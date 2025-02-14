<template>
  <fieldset>
    <legend>Add new product</legend>
    <label>
      Name:
      <input v-model="productName" type="text" />
    </label>
    <button @click="addProduct">Add Product</button>
    <p>{{ status }}</p>
  </fieldset>
</template>

<script lang="ts">
import { ref } from 'vue';
import { db } from '../db';

export default {
  name: 'ProductAdder',
  setup () {
    const productName = ref('');
    const status = ref('');

    const addProduct = async () => {
      try {
        await db.products.add({
          name: productName.value,
        });
        status.value = 'Product added!';
      } catch (error) {
        status.value = 'An error occurred: ' + error.message;
      }
    };

    return {
      productName,
      addProduct,
      status
    };
  }
};
</script>
