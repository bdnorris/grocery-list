<template>
  <section class="product-editor">
    <form @submit.prevent="evalProduct">
      <h2>{{ addOrEdit }} Product</h2>
    <fieldset>
      <legend>{{ addOrEdit }} product</legend>
      <label for="name">
        Name:
      </label>
      <input id="name" v-model="productName" type="text" @focus="clearStatus" />
      <label for="quantity">
        Quantity:
      </label>
      <input id="quantity" v-model="productQuantity" type="number" value="1" step="1" />
      <div class="product-editor__stores">
        <div v-for="store in stores" :key="store.id" class="checkbox-group">
          <input v-model="productStores" type="checkbox" :id="store.id + hash" :value="store.id" />
          <label :for="store.id + hash">{{ store.name }}</label>
        </div>
      </div>
      <label for="priority">
        Priority: {{ productPriority }}
      </label>
      <input id="priority" type="range" v-model="productPriority" min="1" max="10" />
      <div>
        <button type="submit"><Icons icon="save"></Icons>{{ addOrEdit }}</button>
        <p>{{ status }}</p>
      </div>
    </fieldset>
    </form>
  </section>
</template>

<script lang="ts">
import { ref, type Ref } from 'vue';
import { db } from '../db';
import { type Store, type Product, type DexieError } from '../db';
import Icons from "./Icons.vue";

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
  components: {
    Icons
  },
  emits: ['product-updated'],
  setup (props, { emit }) {
    const productName: Ref<string> = props.product ? ref(props.product.name) : ref('');
    const productQuantity: Ref<number> = props.product ? ref(props.product.quantity) : ref(1);
    const productPriority: Ref<number> = props.product ? ref(props.product.priority) : ref(5);
    const productStores = props.product
      ? ref(props.product.stores.map((store: Store) => store.id))
      : ref([]);
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
        productName.value = '';
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
      addOrEdit: props.edit ? 'Save' : 'Add',
      Icons,
      clearStatus: () => status.value = ''
    };
  }
};
</script>

<style>
.product-editor {
  background-color: var(--color-background);
  padding: var(--space-m);
  position: relative;
  z-index: 2;
  & hidden {
    display: none;
  }
  & input[type="checkbox"] {
    /* Hide the checkbox */
    position: absolute;
    left: -9999px;
  }
  & input[type="checkbox"] + label {
    cursor: pointer;
    display: block;
    border: 1px solid var(--color-text);
    padding-block: var(--textFrameY);
    padding-inline: var(--textFrameX);
    border-radius: var(--radius);
  }
  & input[type="checkbox"]:checked + label {
    background-color: var(--color-clickable);
    color: var(--color-background);
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
