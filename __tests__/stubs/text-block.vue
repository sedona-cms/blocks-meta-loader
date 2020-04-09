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
      fontSize: {
        type: Number,
        default: 12,
      },
      isDark: Boolean,
    },
  }
</script>
