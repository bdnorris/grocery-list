<template>
  <h2>Product List</h2>
  <section class="product-list">
    <h3>Products</h3>
    <select v-model="selectedStore">
      <option value="" selected disabled>Select a store</option>
      <option value="">All</option>
      <option v-for="store in localStores" :key="store.id" :value="store.id">
        {{ store.name }} {{ store.itemCount }}
      </option>
    </select>
    <ul v-if="sortedProducts">
      <li v-for="product in sortedProducts" :key="product.id" :class="{ 'checked': product.checked }">
        <input type="checkbox" :checked="product.checked" @change="checkProduct(product.id)" />
        <h4>
          {{ product.name }}
        </h4>
        <div class="product-list__details">
          <div>
            Qty: {{ product.quantity }}
          </div>
          <div>
            Priority: {{ product.priority }}
          </div>
          <div v-for="store in product.stores" :key="store.id">
            {{ store.name }}
          </div>
        </div>
        <button @click="removeProduct(product.id)">Delete</button>
        <button type="button" @click="edit(product.id)">
          {{ productBeingEdited === product.id ? 'Close' : 'Edit' }}
        </button>
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
    ProductEditor
  },
  setup(props) {
    const products: Ref<Array<Product>> = useObservable(
      // @ts-expect-error unneeded type check on observable
      liveQuery(() => db.products.toArray())
    );
    const productBeingEdited: Ref<null|number> = ref(null);

    const removeProduct = async (id: number|undefined) => {
      if (!id) return;
      try {
        await db.products.delete(id);
      } catch (error: unknown) {
        const thisError = error as DexieError;
        console.error('Error deleting product:', thisError);
      }
    };
    const checkProduct = async (id: number|undefined) => {
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
    const edit = (id: number|undefined) => {
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
    const selectedStore: Ref<number|null> = ref(null);

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
      productBeingEdited,
      closeEditors,
      selectedStore,
      localStores,
      edit
    };
  }
};
</script>

<style>
.product-list {
  margin-block: var(--spacing-large);
  background-color: var(--color-background);
  padding: var(--spacing-medium);
  & ul {
    list-style: none;
    padding: 0;
    & li:nth-child(odd) {
      background-color: var(--color-background-medium);
    }
  }
}

.product-list__details {
  display: flex;
  gap: var(--spacing-small);
}

.checked {
  text-decoration: line-through;
}
</style>
