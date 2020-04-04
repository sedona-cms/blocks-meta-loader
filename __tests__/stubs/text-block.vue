<template>
  <div>
    Text block
  </div>
</template>

<script>
  export default {
    name: 'TextBlock',
    props: {
      text: {
        type: String,
        default: 'default text'
      },
      items: {
        type: Array,
      },
      isDark: Boolean,
    },
  }
</script>
