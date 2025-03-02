<template>
  <section class="product-list">
    <h2>Products</h2>
    <label for="filter-store">Filter by Store</label>
    <select v-model="selectedStore" id="filter-store">
      <option value="" selected>All</option>
      <option v-for="store in localStores" :key="store.id" :value="store.id">
        {{ store.name }} {{ store.itemCount }}
      </option>
    </select>
    <ul v-if="sortedProducts">
      <li v-for="product in sortedProducts" :key="product.id" :class="{ 'checked': product.checked }">
        <input :id="product.id" type="checkbox" :checked="product.checked" @change="checkProduct(product.id)" class="product-list__name" />
        <label :for="product.id">
          <h3>
            {{ product.name }}
          </h3>
        </label>
        <div class="product-list__details">
          <div>
            <span class="visually-hidden">Quantity:</span><Icons icon="quantity"></Icons> <span>{{ product.quantity }}</span>
          </div>
          <div>
            <span class="visually-hidden">Priority:</span><Icons icon="priority"></Icons> <span>{{ product.priority }}</span>
          </div>
        </div>
        <div class="product-list__stores">
          <div v-for="store in product.stores" :key="store.id">
            {{ store.name }}
          </div>
        </div>
        <div class="product-list__actions">
          <button @click="removeProduct(product.id)"><Icons icon="delete"></Icons>Delete</button>
          <button type="button" @click="edit(product.id)"><Icons icon="edit"></Icons>
            {{ productBeingEdited === product.id ? 'Close' : 'Edit' }}
          </button>
        </div>
        <ProductEditor :product="product" :stores="stores" :edit="true" :hidden="productBeingEdited !== product.id"
          @product-updated="closeEditors" />
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { ref, type Ref, computed } from 'vue';
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";
import { db } from "../db";
import ProductEditor from "./ProductEditor.vue";
import Icons from "./Icons.vue";
import { type Product, type Store, type DexieError } from "../db";

export default {
  name: 'ProductList',
  props: {
    stores: {
      type: Array as () => Array<Store>,
      required: true
    }
  },
  components: {
    ProductEditor,
    Icons
  },
  setup(props) {
    const products: Ref<Array<Product>> = useObservable(
      // @ts-expect-error unneeded type check on observable
      liveQuery(() => db.products.toArray())
    );
    console.log('products:', products);
    const productBeingEdited: Ref<null|string> = ref(null);

    const removeProduct = async (id: string|undefined) => {
      if (!id) return;
      try {
        await db.products.delete(id);
      } catch (error: unknown) {
        const thisError = error as DexieError;
        console.error('Error deleting product:', thisError);
      }
    };
    const checkProduct = async (id: string|undefined) => {
      if (!id) return;
      try {
        const product = await db.products.get(id);
        if (product) {
          product.checked = !product.checked;
          await db.products.update(id, { checked: product.checked });
        }
      } catch (error: unknown) {
        const thisError = error as DexieError;
        console.error('Error marking product as checked:', thisError);
      }
    };
    const edit = (id: string|undefined) => {
      if (!id) return;
      if (productBeingEdited.value === id) {
        productBeingEdited.value = null;
      } else {
        productBeingEdited.value = id;
      }
    };
    const closeEditors = () => {
      productBeingEdited.value = null;
    };
    const selectedStore: Ref<number|string> = ref('');

    const sortedProducts = computed(() => {
      if (products.value) {
        const toSort = products.value.map((product: Product) => {
          return {
            ...product
          };
        });
        // sort by priority and checked
        const sorted = toSort.sort((a: Product, b: Product) => {
          if (a.checked && !b.checked) return 1;
          if (!a.checked && b.checked) return -1;
          return b.priority - a.priority;
        });
        if (selectedStore.value) {
          return sorted.filter((product) => {
            return product.stores.some((store) => store.id === selectedStore.value);
          });
        } else {
          return sorted;
        }
      }
      return [];
    });

    const localStores = computed(() => {
      return props.stores.map((store: Store) => {
        return {
          id: store.id,
          name: store.name,
          itemCount: products.value ? products.value.filter((product: Product) => product.stores.some((s) => s.id === store.id)).length : 0
        };
      }).filter((store: Store) => {
        return store.itemCount > 0;
      }).sort((a: Store, b: Store) => {
        // sort by most items
        return b.itemCount - a.itemCount;
      });
    });
    return {
      db,
      sortedProducts,
      removeProduct,
      checkProduct,
      ProductEditor,
      Icons,
      productBeingEdited,
      closeEditors,
      selectedStore,
      localStores,
      edit,
    };
  }
};
</script>

<style>
.product-list {
  margin-block: var(--space-l);
  background-color: var(--color-background-muted);
  padding: var(--space-l);
  & ul {
    list-style: none;
    padding: 0;
    & li {
      margin-block: var(--space-l);
      padding: var(--textFrameY) var(--textFrameX);
      border: 1px solid var(--color-text);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      position: relative;
      background-color: var(--color-background);
      display: grid;
      grid-template-columns: 3fr 1fr;
      grid-template-areas: "name actions"
        "details actions"
        "stores actions";
      & > input[type="checkbox"] {
        position: absolute;
        inset: 0;
        opacity: 0;
        z-index: 1;
      }
    }
  }
  & h3 {
    margin-block: 0;
  }
}

.product-list__details {
  display: flex;
  gap: var(--space-s);
  grid-area: details;
  & div {
    display: flex;
    gap: var(--space-xs);
  }
}

.checked {
  text-decoration: line-through;
  text-decoration-color: var(--color-disabled-strong);
  text-decoration-thickness: 3px;
}

input[type="checkbox"].product-list__name:checked + label {
  background-color: var(--color-disabled);
  color: var(--color-disabled-muted);
  border-color: var(--color-disabled-strong);
}

.product-list__actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--space-s);
  margin-block: var(--space-s) var(--space-m);
  position: relative;
  z-index: 2;
  grid-area: actions;
  & button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-s);
  }
}

.product-list__stores {
  font-size: 0.875em;
  display: flex;
  gap: var(--space-xs);
  grid-area: stores;
  & div::after {
    content: '•';
    flex-grow: 1;
    margin-left: var(--space-xs);
  }
  & div:last-child::after {
    content: '';
  }
}
</style>
