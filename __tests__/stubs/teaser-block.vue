<template>
  <div>
    Teaser block
    <br />
    <b>Caption:</b> {{ caption }}
    <br />
    <b>Variant:</b> {{ variant }}
  </div>
</template>

<script>
  export default {
    name: 'TeaserBlock',
    props: {
      caption: {
        type: String,
        default: '',
      },
      variant: {
        type: String,
        default: 'red',
      },
    },
  }
</script>

<block>
{
  "name": "Teaser block",
  "description": "Teaser block",
  "icon": "image",
  "props": {
    "caption": {
      "default": "default text",
      "editor": "textarea"
    },
    "variant": {
      "editor": "radio-group",
      "title": "Variants",
      "default": "red",
      "options": {
        "variants": [
          "red",
          "blue",
          { "label": "Green variant", "value": "green" }
        ]
      }
    }
  }
}
</block>
