import Vue from 'vue'

export default Vue.extends({
  name: 'FeatureBlock',
  props: {
    color: {
      type: String,
      required: true,
    },
    hasTitle: {
      type: Boolean,
      default: false,
    },
  },
})
