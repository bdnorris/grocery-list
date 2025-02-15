<template>
  <h2>Product List</h2>
  <section class="product-list">
    <ul v-if="products">
      <li v-for="product in products" :key="product.id" :class="{'checked': product.checked}">
        <input
          type="checkbox"
          :checked="product.checked"
          @change="checkProduct(product.id)"
        />
        <!-- {{ product.id }} -->
        {{ product.name }}
        {{ product.quantity }}
        {{ product.priority }}

        <span v-for="store in product.stores" :key="store.id">
          {{ store.name }}
        </span>
        <button @click="removeProduct(product.id)">Delete</button>
        <button type="button" @click="edit(product.id)">Edit</button>
        <ProductEditor :product="product" :stores="stores" :edit="true" />
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
  import { ref } from 'vue';
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
      productEditor.value = id;
    };
    return {
      db,
      products,
      removeProduct,
      checkProduct,
      ProductEditor,
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
