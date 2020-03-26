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
        default: '',
      },
      isDark: Boolean,
    },
  }
</script>
