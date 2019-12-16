<template>
  <div id="app">
    <Callout type="error" title="Something went wrong">
      <p>
        It appears that the custom element isn't being loaded in Kentico
        Kontent.
      </p>
    </Callout>
  </div>
</template>

<script>
import Callout from "./components/Callout";

export default {
  name: "app",
  components: {
    Callout
  }
};
</script>
