<template>
  <form @submit.prevent="evalProduct">
    <h2>{{ addOrEdit }} Product</h2>
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
        <input v-model="productStores" type="checkbox" :id="store.id + hash" :value="store" />
        <label :for="store.id + hash">{{ store.name }}</label>
      </div>
    </div>
    <label>
      Priority:
      <input type="range" v-model="productPriority" min="1" max="10" />
    </label>
    <button type="submit">{{ addOrEdit }} Product</button>
    <p>{{ status }}</p>
  </fieldset>
  </form>
</template>

<script lang="ts">
import { ref } from 'vue';
import { db } from '../db';
import { type Store, type Product } from '../db';

export default {
  name: 'ProductEditor',
  props: {
    stores: {
      type: Array<Store>,
      required: true
    },
    product: {
      type: Object as () => Product,
      required: false
    },
    edit: {
      type: Boolean,
      default: true
    }
  },
  emits: ['product-updated'],
  setup (props, { emit }) {
    const productName = props.product ? ref(props.product.name) : ref('');
    const productQuantity = props.product ? ref(props.product.quantity) : ref(1);
    const productPriority = props.product ? ref(props.product.priority) : ref(1);
    const productStores = props.product
      ? ref(props.product.stores.map((store: Store) => store))
      : ref([]);
    const status = ref('');

    const hash = Math.random().toString(36).substring(2, 15);
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
      } catch (error: DataError) {
        status.value = 'An error occurred: ' + error.message;
      }
    };

    const editProduct = async () => {
      let storesToAdd = productStores.value.map((store) => {
        return { id: store.id, name: store.name };
      });
      if (!props.product) {
        status.value = 'No product to edit';
        return;
      }
      try {
        await db.products.update(props.product.id, {
          name: productName.value,
          quantity: productQuantity.value,
          stores: storesToAdd,
          priority: productPriority.value
        });
        status.value = 'Product updated!';
        emit('product-updated');
      } catch (error: DataError) {
        status.value = 'An error occurred: ' + error.message;
      }
    };

    const evalProduct = () => {
      if (props.edit) {
        editProduct();
      } else {
        addProduct();
      }
    };

    return {
      productName,
      productQuantity,
      productPriority,
      productStores,
      addProduct,
      editProduct,
      evalProduct,
      status,
      hash,
      addOrEdit: props.edit ? 'Edit' : 'Add',
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
  margin-block: 0.25em;
}

.checkbox-group {
  display: flex;
  gap: 0.5em;
  margin-right: 1em;
}
</style>
