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

<block>
{
  "name": "Text",
  "description": "Block for rendering text",
  "props": {
    "content": {
      "type": "textarea"
    }
  }
}
</block>
