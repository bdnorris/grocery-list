<template>
  <div v-if="localIcon === 'quantity'">
    <svg viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg" id="Hand-Coin-Fill--Streamline-Remix-Fill"><desc>Hand Coin Fill Streamline Icon: https://streamlinehq.com</desc><path d="m9.3349 11.5023 2.17 0.0005c2.4853 0 4.5 2.0147 4.5 4.5H9.00388l0.001 1 8.00002 -0.0008v-0.9992c0 -1.0824 -0.3182 -2.1031 -0.8861 -3.0008l2.8861 0.0008c1.9923 0 3.7124 1.1653 4.5161 2.8514 -2.3648 3.1206 -6.1942 5.1486 -10.5161 5.1486 -2.7613 0 -5.10045 -0.5906 -7.00034 -1.6248l0.00136 -9.3042c1.24555 0.1784 2.3853 0.6847 3.32898 1.4285Zm-4.33002 7.5005c0 0.5523 -0.44771 1 -1 1h-2c-0.55228 0 -1 -0.4477 -1 -1v-9c0 -0.55228 0.44772 -0.99999 1 -0.99999h2c0.55229 0 1 0.44771 1 0.99999v9ZM18.0049 5.00281c1.6568 0 3 1.34314 3 3 0 1.65685 -1.3432 2.99999 -3 2.99999 -1.6569 0 -3 -1.34314 -3 -2.99999 0 -1.65686 1.3431 -3 3 -3Zm-7 -3c1.6568 0 3 1.34314 3 3 0 1.65685 -1.3432 3 -3 3 -1.65687 0 -3.00002 -1.34315 -3.00002 -3 0 -1.65686 1.34315 -3 3.00002 -3Z" stroke-width="1"></path></svg>
  </div>
  <div v-if="localIcon === 'priority'">
    <svg viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg" id="Swap-3-Fill--Streamline-Remix-Fill"><desc>Swap 3 Fill Streamline Icon: https://streamlinehq.com</desc><path d="m6.00008 5.91424 -2.2929 2.2929 -1.41421 -1.41422 4.70711 -4.7071 4.70712 4.7071 -1.4142 1.41422 -2.29292 -2.2929L8.00007 11H6.00008l0 -5.08576Zm6.50002 1.08579c0 2.48528 2.0147 4.49997 4.5 4.49997s4.5 -2.01469 4.5 -4.49997c0 -2.48528 -2.0147 -4.5 -4.5 -4.5s-4.5 2.01472 -4.5 4.5Zm9.2071 10.20707 -1.4142 -1.4142 -2.2929 2.2929V13h-2v5.0858l-2.2929 -2.2929 -1.4142 1.4142 4.7071 4.7071 4.7071 -4.7071ZM11.0001 14c0 -0.5523 -0.4477 -1 -1 -1H4.00008c-0.55229 0 -1 0.4477 -1 1l0 6c-0.00001 0.5523 0.44771 1 0.99999 1h6.00003c0.5523 0 1 -0.4477 1 -1v-6Z" stroke-width="1"></path></svg>
  </div>
  <div v-if="localIcon === 'edit'">
    <svg viewBox="0 0 16 16" fill="#000000" xmlns="http://www.w3.org/2000/svg" id="Edit-Fill--Streamline-Remix-Fill" height="16" width="16"><desc>Edit Fill Streamline Icon: https://streamlinehq.com</desc><path d="M4.828426666666666 11.9978H2V9.169333333333332L9.623333333333333 1.5459999999999998c0.26039999999999996 -0.2603466666666666 0.6824666666666667 -0.2603466666666666 0.9427999999999999 0l1.8856666666666666 1.8856199999999999c0.2603333333333333 0.2603466666666666 0.2603333333333333 0.68246 0 0.9428066666666666L4.828426666666666 11.9978ZM2 13.331133333333334h12v1.3333333333333333H2v-1.3333333333333333Z" stroke-width="0.6667"></path></svg>
  </div>
  <div v-if="localIcon === 'save'">
    <svg viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg" id="Save-3-Fill--Streamline-Remix-Fill"><desc>Save 3 Fill Streamline Icon: https://streamlinehq.com</desc><path d="M4 3h14l2.7071 2.70711c0.1875 0.18753 0.2929 0.44189 0.2929 0.7071V20c0 0.5523 -0.4477 1 -1 1H4c-0.55228 0 -1 -0.4477 -1 -1V4c0 -0.55228 0.44772 -1 1 -1Zm3 1v5h9V4H7Zm-1 8v7h12v-7H6Zm7 -7h2v3h-2V5Z" stroke-width="1"></path></svg>
  </div>
  <div v-if="localIcon === 'delete'">
    <svg viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg" id="Delete-Back-2-Fill--Streamline-Remix-Fill"><desc>Delete Back 2 Fill Streamline Icon: https://streamlinehq.com</desc><path d="M6.53451 3H20.9993c0.5523 0 1 0.44772 1 1v16c0 0.5523 -0.4477 1 -1 1H6.53451c-0.33436 0 -0.64659 -0.1671 -0.83205 -0.4453l-5.333338 -8c-0.223933 -0.3359 -0.223933 -0.7735 0 -1.1094l5.333338 -8C5.88792 3.1671 6.20015 3 6.53451 3Zm6.46479 7.5858 -2.8284 -2.82844 -1.41422 1.41421L11.5851 12l-2.82842 2.8284 1.41422 1.4142 2.8284 -2.8284 2.8284 2.8284 1.4143 -1.4142L14.4135 12l2.8285 -2.82843 -1.4143 -1.41421 -2.8284 2.82844Z" stroke-width="1"></path></svg>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Icons',
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  setup (props) {
    return {
      localIcon: props.icon
    }
  }
}
</script>

<style scoped>
div {
  width: 1.5em;
  height: 1.5em;
}
svg {
  width: 1.5em;
  height: 1.5em;
  & path {
    fill: currentColor;
  }
}
</style>
