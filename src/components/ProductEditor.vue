<template>
  <section class="product-editor">
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
      <div class="product-editor__stores">
        <div v-for="store in stores" :key="store.id" class="checkbox-group">
          <input v-model="productStores" type="checkbox" :id="store.id + hash" :value="store.id" />
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
  </section>
</template>

<script lang="ts">
import { ref, type Ref } from 'vue';
import { db } from '../db';
import { type Store, type Product, type DexieError } from '../db';

export default {
  name: 'ProductEditor',
  props: {
    stores: {
      type: Array as () => Array<Store>,
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
    const productName: Ref<string> = props.product ? ref(props.product.name) : ref('');
    const productQuantity: Ref<number> = props.product ? ref(props.product.quantity) : ref(1);
    const productPriority: Ref<number> = props.product ? ref(props.product.priority) : ref(5);
    const productStores = props.product
      ? ref(props.product.stores.map((store: Store) => store.id))
      : ref([]);
    console.log(productStores);
    const status = ref('');

    const hash = Math.random().toString(36).substring(2, 15);
//
    const addProduct = async () => {
      const storesToAdd = getStoresToAdd();
      try {
        await db.products.add({
          name: productName.value,
          quantity: productQuantity.value,
          stores: storesToAdd ? storesToAdd : [],
          priority: productPriority.value,
          checked: false
        });
        status.value = 'Product added!';
      } catch (error: unknown) {
        const thisError = error as DexieError;
        status.value = 'An error occurred: ' + thisError.message;
      }
    };

    const editProduct = async () => {
      const storesToAdd = getStoresToAdd();
      if (!props.product) {
        status.value = 'No product to edit';
        return;
      }
      try {
        await db.products.update(props.product.id, {
          name: productName.value,
          quantity: productQuantity.value,
          stores: storesToAdd ? storesToAdd : [],
          priority: productPriority.value,
          checked: false
        });
        status.value = 'Product updated!';
        emit('product-updated');
      } catch (error: unknown) {
        const thisError = error as DexieError;
        status.value = 'An error occurred: ' + thisError.message;
      }
    };

    const evalProduct = () => {
      if (props.edit) {
        editProduct();
      } else {
        addProduct();
      }
    };

    function getStoresToAdd () {
      return props.stores.filter((store: Store) => {
        return productStores.value.includes(store.id);
      });
    }

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

<style>
.product-editor {
  background-color: var(--color-background);
  padding: var(--space-m);
  & hidden {
    display: none;
  }
}
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

.product-editor__stores {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-block: var(--space-s);
}
</style>
