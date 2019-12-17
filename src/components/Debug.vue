<template>
  <div
    class="debug-window"
    v-if="element && element.config && element.config.debug"
  >
    <div class="tag tag--yellow">
      Debug Window
    </div>
    <div class="debug-window__content">
      <div>
        <div class="switch-wrapper">
          <input type="checkbox" :checked="element.disabled" hidden />
          <label
            class="switch"
            @click="$emit('handleDisable', !element.disabled)"
          ></label>
          <span class="switch__label">Disabled</span>
        </div>
      </div>
      <div>
        <span @click="valueExpanded = !valueExpanded"
          ><i :class="valueExpanded ? 'icon-expand-down' : 'icon-expand'"></i>
          Value</span
        >
        <pre v-show="valueExpanded">{{ value ? value : "null" }}</pre>
      </div>
      <div>
        <span @click="elementExpanded = !elementExpanded"
          ><i :class="elementExpanded ? 'icon-expand-down' : 'icon-expand'"></i>
          Element</span
        >
        <pre v-show="elementExpanded">{{ element }}</pre>
      </div>
      <div>
        <span @click="contextExpanded = !contextExpanded"
          ><i :class="contextExpanded ? 'icon-expand-down' : 'icon-expand'"></i>
          Context</span
        >
        <pre v-show="contextExpanded">{{ context }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    context: { required: true },
    element: { required: true },
    value: { required: true }
  },
  data: () => ({
    contextExpanded: false,
    elementExpanded: false,
    valueExpanded: false
  })
};
</script>

<style scoped>
.debug-window {
  margin: 10px;
}

.debug-window .tag {
  float: right;
}

.debug-window__content {
  border: 1px solid #ffc800;
  background: #ffc8000f;
  border-radius: 2px;
  padding: 5px;
}

.tag {
  display: inline-block;
  height: 26px;
  max-width: 100%;
  padding: 3px 6px;
  overflow: hidden;
  font-size: 16px;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  cursor: inherit;
  background-color: #919194;
  border-radius: 2px;
  transition: all 0.15s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.tag--yellow,
.tag--yellow:focus {
  color: #4c4d52;
  text-decoration: none;
  background-color: #ffc800;
  outline: none;
}
</style>
