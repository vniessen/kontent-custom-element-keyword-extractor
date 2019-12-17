<template>
  <fieldset :disabled="disabled">
    <!--
    Your UI + logic go here.
    Some tips:
      * Make is more seemless with Kontent provided styles
        (https://github.com/Kentico/kontent-custom-element-samples#styling-your-custom-elements)
      * Allow the user to preview and reset the values of the element</li>
      * Disable state for inputs is handled by the fieldset wrapper, you can read the disabled prop to determine the current state
      * Use the save method in this element to persist the current data to Kontent
    -->
    <div>
      <button
        class="btn btn--primary"
        @click="save({ externalId: 1, updated: Date.now() })"
      >
        Choose 1
      </button>
      <button
        class="btn btn--primary"
        @click="save({ externalId: 2, updated: Date.now() })"
      >
        Choose 2
      </button>
      <button class="btn btn--primary" @click="save(null)">
        Clear/reset
      </button>
      <div v-if="value" class="selectedNumber">
        {{ value.externalId }}
      </div>
    </div>
  </fieldset>
</template>

<script>
export default {
  data: () => ({
    firstName: ""
  }),
  props: {
    disabled: {
      type: Boolean,
      required: true
    },
    value: {
      required: true
    }
  },
  methods: {
    save: function(value) {
      this.$emit("save", value);
    }
  }
};
</script>

<style scoped>
fieldset {
  border: none;
}

.selectedNumber {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  padding: 0px;
  background: #4caf50;
  color: #fff;
  text-align: center;
  font-size: 32px;
  line-height: 50px;
  font-weight: 700;
  margin: 10px 0;
}
</style>
