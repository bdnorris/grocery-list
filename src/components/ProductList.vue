<template>
  <h2>Product List</h2>
  <section class="product-list">
    <h3>Products</h3>
    <select v-model="selectedStore">
      <option value="" selected disabled>Select a store</option>
      <option v-for="store in localStores" :key="store.id" :value="store.id">
        {{ store.name }} {{ store.itemCount }}
      </option>
    </select>
    <ul v-if="sortedProducts">
      <li v-for="product in sortedProducts" :key="product.id" :class="{'checked': product.checked}">
        <input
          type="checkbox"
          :checked="product.checked"
          @change="checkProduct(product.id)"
        />
        <!-- {{ product.id }} -->
        <h4>
          {{ product.name }}
        </h4>
        <div>
          Qty: {{ product.quantity }}
        </div>
        <div>
          Priority: {{ product.priority }}
        </div>

        <span v-for="store in product.stores" :key="store.id">
          {{ store.name }}
        </span>
        <button @click="removeProduct(product.id)">Delete</button>
        <button type="button" @click="edit(product.id)">
          {{ productBeingEdited === product.id ? 'Close' : 'Edit' }}
        </button>
        <ProductEditor :product="product" :stores="stores" :edit="true" :hidden="productBeingEdited !== product.id" />
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
  // import { type Product } from "../db";
  // import { type Store } from "../db";

export default {
  name: 'ProductList',
  props: {
    stores: {
      type: Array,
      required: true
    }
  },
  components: {
    ProductEditor
  },
  setup (props) {
    // console.log('stores', props.stores);
    const productEditor = ref(null);
    const products = useObservable(
      liveQuery(() => db.products.toArray())
    );
    const productBeingEdited: Ref<null|number> = ref(null);
    const removeProduct = async (id: number) => {
      try {
        await db.products.delete(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };
    const checkProduct = async (id: number) => {
      try {
        const product = await db.products.get(id);
        if (product) {
          product.checked = !product.checked;
          await db.products.update(id, { checked: product.checked });
        }
      } catch (error) {
        console.error('Error marking product as checked:', error);
      }
    };
    const edit = (id: number) => {
      if (productBeingEdited.value === id) {
        productBeingEdited.value = null;
      } else {
        productBeingEdited.value = id;
      }
    };
    const selectedStore = ref('');

    const sortedProducts = computed(() => {
      if (products.value) {
        const toSort = products.value.map((product) => {
          return {
            ...product
          };
        });
        // sort by priority and checked
        const sorted =  toSort.sort((a, b) => {
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

    let localStores = computed(() => {
      return props.stores.map((store) => {
        return {
          id: store.id,
          name: store.name,
          itemCount: products.value ? products.value.filter((product) => product.stores.some((s) => s.id === store.id)).length : 0
        };
      }).filter((store) => {
        return store.itemCount > 0;
      }).sort((a, b) => {
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
      selectedStore,
      localStores,
      edit
    };
  }
};
</script>

<style scoped>
.product-list {
  margin-block: 1em;
}

.checked {
  text-decoration: line-through;
}
</style>
