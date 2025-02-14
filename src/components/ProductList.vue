<template>
  <section>
    <ul v-if="products">
      <li v-for="product in products" :key="product.id">
        {{ product.name }}
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { liveQuery } from "dexie";
  import { useObservable } from "@vueuse/rxjs";
  import { db } from "../db";

export default {
  name: 'ProductList',
  setup () {
    const products = useObservable(
      liveQuery(() => db.products.toArray())
    );
    console.log(products);
    return {
      db,
      products
    };
  }
};
</script>
