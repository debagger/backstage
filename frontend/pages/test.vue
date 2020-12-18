<template>
  <v-row>
    <v-col class="text-center">
      <v-btn @click="enabled = false" v-if="enabled">Stop</v-btn>
      <v-btn @click="run" v-else>Run</v-btn>

      {{ message }}<br/>{{count}}

    </v-col>
  </v-row>
</template>

<script>
export default {
  data: function () {
    return {
      enabled: false,
      message: '',
      count:''
    }
  },
  methods: {
    run: async function () {
      this.enabled = true
      this.getCount()
      while (this.enabled) {
        const response = await this.$axios.get('/api/ping')
        this.message = response.data
      }
    },
    getCount: async function(){
        while (this.enabled) {
        const response = await this.$axios.get('/api/ping/count')
        this.count = response.data
        }
    }
  },
}
</script>

<style>
</style>