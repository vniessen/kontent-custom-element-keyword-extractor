<template>
  <div id="app">
    <Callout v-if="errorMessage" type="error" title="Something went wrong">
      <p>
        {{ errorMessage }}
      </p>
    </Callout>
    <div v-if="loaded">
      <YourComponent
        :disabled="element.disabled"
        :value="parsedValue"
        @save="save"
      />
      <Debug :element="element" :context="context" />
    </div>
  </div>
</template>

<script>
/*global CustomElement*/
import Callout from "./components/Callout";
import Debug from "./components/Debug";
import YourComponent from "./components/YourComponent";
import Vue from "vue";

export default {
  name: "app",
  components: {
    Callout,
    Debug,
    YourComponent
  },
  data: () => ({
    loaded: false,
    errorMessage: "",
    element: {},
    context: {}
  }),
  computed: {
    parsedValue: function() {
      return this.element ? JSON.parse(this.element.value) : null;
    }
  },
  created: function() {
    try {
      CustomElement.init(this.initialize);
      CustomElement.onDisabledChanged(this.handleDisable);
    } catch (error) {
      this.errorMessage = error;
    }
  },
  methods: {
    getElementValue: function(elementCodename) {
      return new Promise((resolve, reject) => {
        try {
          CustomElement.getElementValue(elementCodename, value => {
            resolve(value);
          });
        } catch (error) {
          reject(error);
        }
      });
    },
    handleDisable: function(disableState) {
      this.element.disabled = disableState;
    },
    initialize: function(element, context) {
      this.element = element;
      this.context = context;
      this.disabled = this.element.disabled;
      this.loaded = true;
      this.updateSize();
    },
    save: function(value) {
      const toSave = JSON.stringify(value);
      this.element.value = toSave;
      CustomElement.setValue(toSave);
    },
    updateSize() {
      Vue.nextTick(function() {
        CustomElement.setHeight(document.body.offsetHeight);
      });
    }
    // },
    // watch: {
    //   currentValue: function(oldValue, newValue) {}
  }
};
</script>
