import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,
  // Global page headers (https://go.nuxtjs.dev/config-head)
  env: {
    API_DOMAIN: process.env.API_DOMAIN,
    API_CLIENT_ID: process.env.API_CLIENT_ID,
    API_AUDIENCE: process.env.API_AUDIENCE,
  },
  head: {
    titleTemplate: '%s - frontend',
    title: 'frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['~/plugins/auth.client.ts', '~/plugins/axios.ts'],
  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
  ],

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'http://localhost/api/graphql',
        tokenName: 'apollo-token',
      },
    },
  },
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 'http://localhost', // Used as fallback if no runtime config is provided
    credentials: true,
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config) {
      //setup webpack to understand gql queries
      const rule = config.module.rules.find((i) => i.loader === 'vue-loader')
      rule.options.transpileOptions = {
        transforms: {
          dangerousTaggedTemplateString: true,
        },
      }
    },
  },
  server: {
    host: '0.0.0.0',
  },
  router: { middleware: ['set-auth-token'] },
}
