<template>
  <fieldset :disabled="element && element.disabled">
    <div class="form__group">
      <div class="form__input-with-buttons-wrapper">
        <div class="multi-select__option-area">
          <div
            class="multi-select__option-wrapper"
            v-for="(keyword, index) in value"
            :key="index"
          >
            <div class="multi-select__option">
              <div class="multi-select__option-name">
                {{ keyword }}
              </div>
              <div
                v-if="!element.disabled"
                @click="removeKeyword(index)"
                class="multi-select__option-remove-button"
              >
                <i class="icon-remove-multi-select-option"></i>
              </div>
            </div>
          </div>
        </div>
        <button
          class="form__icon-btn"
          data-balloon="Copy to clipboard"
          data-balloon-pos="up-left"
          type="button"
          @click="updateKeywords"
        >
          <i class="icon-autogenerate"></i>
        </button>
      </div>
    </div>
  </fieldset>
</template>

<script>
import { getKeywords as getKeywordsLocal } from "../analyzers/localAnalyzer";
import { getKeywords as getKeywordsAzure } from "../analyzers/azureAnalyzer";
import { getElementValue } from "../utilities/customElementHelper";

export default {
  props: {
    element: {
      type: Object,
      required: true
    },
    context: {
      type: Object,
      required: true
    },
    value: {}
  },
  methods: {
    removeKeyword: function(index) {
      const newValue = [
        ...this.value.slice(0, index),
        ...this.value.slice(index + 1)
      ];

      this.save(newValue);
    },
    updateKeywords: async function() {
      if (this.element.config.elements) {
        const text = await this.element.config.elements.reduce(
          async (previous, current) => {
            const aggregate = await previous;
            const elementValue = await getElementValue(current);
            return `${aggregate} ${elementValue}`;
          },
          ""
        );
        let keywords = [];
        if (this.element.config.azureKey) {
          keywords = await getKeywordsAzure(text, this.element.config.azureKey);
        } else {
          keywords = getKeywordsLocal(text, 3, 3, 1);
        }

        this.save(keywords);
      }
    },
    // Sample action below
    sampleAction: function(value) {
      this.save({
        externalId: value,
        updated: Date.now()
      });
    },
    // Sample action above
    reset: function() {
      this.save(null);
    },
    save: function(value) {
      this.$emit("update:value", value);
    }
  }
};
</script>

<style scoped>
fieldset {
  border: none;
}

.multi-select__option-area {
  min-width: 0;
  width: 100%;
}

.multi-select__option-area + .form__icon-btn {
  margin-left: 2px;
}
</style>
