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
      { id: 1, name: 'Any' , itemCount: 0},
      { id: 2, name: 'Aldi' , itemCount: 0},
      { id: 3, name: 'Damaged Freight' , itemCount: 0},
      { id: 4, name: 'Dollar Tree' , itemCount: 0},
      { id: 5, name: 'Hardware' , itemCount: 0},
      { id: 6, name: 'King Saver' , itemCount: 0},
      { id: 7, name: 'Walmart', itemCount: 0 }
    ]
    return {
      stores
    }
  }
}
</script>


<style scoped>

</style>
