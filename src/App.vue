<template>
  <header>
    <h1>Groceries</h1>
  </header>

  <main>
    <ProductList :stores="stores" />
    <ProductAdder :stores="stores" />
  </main>
</template>

<script lang="ts">
import ProductAdder from './components/ProductAdder.vue'
import ProductList from './components/ProductList.vue'
import { type Store } from './db'

export default {
  name: 'App',
  components: {
    ProductAdder,
    ProductList
  },
  setup () {
    const stores: Array<Store> = [
      { id: 1, name: 'Any' },
      { id: 2, name: 'Aldi' },
      { id: 3, name: 'Damaged Freight' },
      { id: 4, name: 'Dollar Tree' },
      { id: 5, name: 'Hardware' },
      { id: 6, name: 'King Saver' },
      { id: 7, name: 'Walmart' }
    ]
    return {
      stores
    }
  }
}
</script>


<style scoped>

</style>
