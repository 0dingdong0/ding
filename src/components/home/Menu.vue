<template>
  <q-tab-panel :name="name">
    <div class="text-h6">
      Home Menu
    </div>
    [Menu]Lorem ipsum dolor sit amet consectetur adipisicing elit.
  </q-tab-panel>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style>

</style>
