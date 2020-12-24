<template>
  <v-card>
    <v-card-title>
      <v-list-item>
        <v-list-item-avatar size="64">
          <v-avatar size="64">
            <v-img :src="user.picture"></v-img>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title> {{ user.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card-title>
    <v-card-text>
      <v-text-field
        readonly
        v-for="field in fields"
        :label="field.title"
        :value="field.value"
        :key="field.key"
      />
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { User } from '@auth0/auth0-spa-js'
import Vue from 'vue'

type Field = { key: string; title: string; value: string }

export default Vue.extend({
  data: function () {
    return {
      knownFields: <Record<string, string>>{
        given_name: 'Имя',
        family_name: 'Фамилия',
        nickname: 'Никнейм',
        email: 'E-mail',
      },
      excludeFields: ['email_verified', 'picture'],
    }
  },
  computed: {
    isLoggedIn(): boolean {
      return !!this.$auth?.isAuthenticated
    },
    user(): User {
      return this.$auth.user
    },
    fields(): Field[] {
      return Object.keys(this.user)
        .filter((key) => this.knownFields[key])
        .map((key) => ({
          key,
          value: this.user[key],
          title: this.knownFields[key],
        }))
    },
  },
})
</script>