<template>
  <h2>Product List</h2>
  <section class="product-list">
    <ul v-if="products">
      <li v-for="product in products" :key="product.id">
        {{ product.name }}
        {{ product.quantity }}
        <span v-for="store in product.stores" :key="store.id">
          {{ store.name }}
        </span>
        <button @click="removeProduct(product.id)">Delete</button>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
  import { liveQuery } from "dexie";
  import { useObservable } from "@vueuse/rxjs";
  import { db } from "../db";
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
  setup (props) {
    // console.log('stores', props.stores);
    const products = useObservable(
      liveQuery(() => db.products.toArray())
    );
    const removeProduct = async (id: number) => {
      try {
        await db.products.delete(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };
    return {
      db,
      products,
      removeProduct
    };
  }
};
</script>

<style scoped>
.product-list {
  margin-block: 1em;
}
</style>
