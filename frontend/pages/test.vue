<template>
  <v-row>
    <v-col class="text-center">
      <v-btn @click="enabled = false" v-if="enabled">Stop</v-btn>
      <v-btn @click="run" v-else>Run</v-btn>

      {{ message }}<br />{{ count }}
    </v-col>
    <v-col>
      <v-btn @click="getProfile">Profile</v-btn><br />
      <code>
        {{ profile }}
      </code>
    </v-col>
    <v-col>
      <ApolloQuery
        :query="
          (gql) =>
            gql`
              query {
                pings(take: 100, skip: 4100) {
                  count
                  pings {
                    id
                    date
                  }
                }
              }
            `
        "
      >
        <template v-slot="{ result: { loading, error, data } }">
          <div v-if="loading">Loading...</div>
          <div v-else-if="error">{{ error }}</div>
          <div v-else-if="data">{{ data.pings }}</div>
          <div v-else>No result :(</div>
        </template></ApolloQuery
      ></v-col
    ></v-row
  >
</template>
      </ApolloQuery>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'

export default Vue.extend({
  data: function () {
    return {
      pings: ['loading'],
      enabled: false,
      message: '',
      count: '',
      profile: '',
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
    getCount: async function () {
      while (this.enabled) {
        const response = await this.$axios.get('/api/ping/count')
        this.count = response.data
      }
    },
    getProfile: async function () {
      try {
        const token = await this.$auth.getTokenSilently()
        const response = await this.$axios.get('/api/userprofile')
        this.profile = JSON.stringify(response.data, undefined, 2)
      } catch (error) {
        this.profile = error
      }
    },
  },
})
</script>

<style>
</style>