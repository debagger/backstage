<template>
  <v-row>
    <v-col class="text-center">
      <v-btn @click="enabled = false" v-if="enabled">Stop</v-btn>
      <v-btn @click="run" v-else>Run</v-btn>

      {{ message }}
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: function () {
    return {
      enabled: false,
      message: '',
    }
  },
  methods: {
    run: async function () {
      this.enabled = true
      while (this.enabled) {
        const response = await this.$axios.get('/api/ping')
        this.message = response.data
      }
    },
  },
}
</script>

<style>
</style>