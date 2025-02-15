<template>
  <form @submit.prevent="addProduct">
    <h2>Add Product</h2>
  <fieldset>
    <legend>Add new product</legend>
    <label>
      Name:
      <input v-model="productName" type="text" />
    </label>
    <label>
      Quantity:
      <input v-model="productQuantity" type="number" value="1" step="1" />
    </label>
    <div>
      <div v-for="store in stores" :key="store.id" class="checkbox-group">
        <input v-model="productStores" type="checkbox" :id="store.id" :value="store" />
        <label :for="store.id">{{ store.name }}</label>
      </div>
    </div>
    <label>
      Priority:
      <input type="range" v-model="productPriority" min="1" max="10" />
    </label>
    <button type="submit">Add Product</button>
    <p>{{ status }}</p>
  </fieldset>
  </form>
</template>

<script lang="ts">
import { ref, type Ref } from 'vue';
import { db } from '../db';
import { type Store } from '../db';

export default {
  name: 'ProductAdder',
  props: {
    stores: {
      type: Array,
      required: true
    }
  },
  setup (props) {
    const productName = ref('');
    const productQuantity = ref(1);
    const productPriority = ref(1);
    const productStores: Ref<Array<Store>>= ref([]);
    const status = ref('');
//
    const addProduct = async () => {
      let storesToAdd = productStores.value.map((store) => {
        return { id: store.id, name: store.name };
      });
      try {
        await db.products.add({
          name: productName.value,
          quantity: productQuantity.value,
          stores: storesToAdd,
          priority: productPriority.value
        });
        status.value = 'Product added!';
      } catch (error) {
        status.value = 'An error occurred: ' + error.message;
      }
    };

    return {
      productName,
      productQuantity,
      productPriority,
      productStores,
      addProduct,
      status,
    };
  }
};
</script>

<style scoped>
fieldset {
  border: 1px solid #ccc;
  padding: 1em;
  margin-block: 1em;
}
label {
  display: block;
  margin-block: 1em;
}

.checkbox-group {
  display: flex;
  gap: 0.5em;
  margin-right: 1em;
}
</style>
