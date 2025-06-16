<template>
  <header>
    <h1>Shopping</h1>
  </header>
  <main>
    <ProductList :stores="stores" />
    <ProductEditor :stores="stores" :edit="false" />
  </main>
</template>

<script lang="ts">
import ProductEditor from './components/ProductEditor.vue'
import ProductList from './components/ProductList.vue'
import { type Store } from './db'

export default {
  name: 'App',
  components: {
    ProductEditor,
    ProductList
  },
  setup () {
    const stores: Array<Store> = [
      { id: 1, name: 'Misc' , itemCount: 0},
      { id: 2, name: 'Produce' , itemCount: 0},
      { id: 3, name: 'Dairy' , itemCount: 0},
      { id: 4, name: 'Canned' , itemCount: 0},
      { id: 5, name: 'Meat' , itemCount: 0},
      { id: 6, name: 'Online' , itemCount: 0},
      { id: 7, name: 'Hardware', itemCount: 0 }
    ]
    return {
      stores
    }
  }
}
</script>


<style scoped>

</style>
