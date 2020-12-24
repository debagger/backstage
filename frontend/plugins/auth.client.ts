import Vue from 'vue'
import createAuth0Client, {
  GetIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  LogoutOptions,
  PopupConfigOptions,
  RedirectLoginOptions,
} from '@auth0/auth0-spa-js'
import {
  Auth0Client,
  Auth0ClientOptions,
  PopupLoginOptions,
  User,
} from '@auth0/auth0-spa-js'

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname)

/** Returns the current instance of the SDK */
export type AuthPluginOptions = {
  onRedirectCallback: (appState?: any, router?: any) => void
  redirectUri?: String
} & Auth0ClientOptions

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
const useAuth0 = ({
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  redirectUri = global.window.location.origin,
  ...options
}: Auth0ClientOptions) => {
    // The 'instance' is simply a Vue object
  const instance = new Vue({
    data() {
      return {
        loading: true,
        isAuthenticated: false,
        user: <User>{},
        auth0Client: <Auth0Client>null,
        popupOpen: false,
        error: null,
      }
    },
    methods: {
      /** Authenticates the user using a popup window */
      async loginWithPopup(
        options?: PopupLoginOptions,
        config?: PopupConfigOptions
      ) {
        this.popupOpen = true

        try {
          await this.auth0Client.loginWithPopup(options, config)
        } catch (e) {
          // eslint-disable-next-line
          console.error(e)
        } finally {
          this.popupOpen = false
        }

        this.user = await this.auth0Client?.getUser()
        this.isAuthenticated = true
      },
      /** Handles the callback when logging in using a redirect */
      async handleRedirectCallback() {
        this.loading = true
        try {
          await this.auth0Client?.handleRedirectCallback()
          this.user = await this.auth0Client?.getUser()
          this.isAuthenticated = true
        } catch (e) {
          this.error = e
        } finally {
          this.loading = false
        }
      },
      /** Authenticates the user using the redirect method */
      loginWithRedirect(o?: RedirectLoginOptions) {
        return this.auth0Client?.loginWithRedirect(o)
      },
      /** Returns all the claims present in the ID token */
      getIdTokenClaims(o: GetIdTokenClaimsOptions) {
        return this.auth0Client?.getIdTokenClaims(o)
      },
      /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
      getTokenSilently(o?: GetTokenSilentlyOptions) {
        return this.auth0Client?.getTokenSilently(o)
      },
      /** Gets the access token using a popup window */

      getTokenWithPopup(o: GetTokenWithPopupOptions) {
        return this.auth0Client?.getTokenWithPopup(o)
      },
      /** Logs the user out and removes their session on the authorization server */
      logout(o?: LogoutOptions) {
        return this.auth0Client?.logout(o)
      },
    },
    /** Use this lifecycle method to instantiate the SDK client */
    async created() {
      // Create a new instance of the SDK client using members of the given options object
      this.auth0Client = await createAuth0Client({
        ...options,
        client_id: options.client_id,
        redirect_uri: redirectUri,
        cacheLocation: 'localstorage',
        ui_locales: 'ru',
      })
      try {
        // If the user is returning to the app after authentication..
        if (
          window.location.search.includes('code=') &&
          window.location.search.includes('state=')
        ) {
          // handle the redirect and retrieve tokens
          const { appState } = await this.auth0Client.handleRedirectCallback()
          // Notify subscribers that the redirect callback has happened, passing the appState
          // (useful for retrieving any pre-authentication state)
          onRedirectCallback(appState, this.$router)
        }
      } catch (e) {
        this.error = e
      } finally {
        // Initialize our internal authentication state
        this.isAuthenticated = await this.auth0Client.isAuthenticated()
        this.user = await this.auth0Client.getUser()
        this.loading = false
      }
    },
  })
  return instance
}

let auth0Instance: AuthPluginType

export const getAuth0 = ()=>{
if(!auth0Instance) 
{
  auth0Instance = useAuth0(opts)
}
return auth0Instance
}

export const Auth0Plugin = {
  install(Vue: any) {
    Vue.prototype.$auth = getAuth0() 
  },
}

const opts: AuthPluginOptions = {
  domain: process.env.API_DOMAIN,
  client_id: process.env.API_CLIENT_ID,
  audience: process.env.API_AUDIENCE,
  onRedirectCallback: (appState, router) => {
    router?.push(
      appState?.targetUrl ? appState.targetUrl : window.location.pathname
    )
  },
}

Vue.use(Auth0Plugin)

// type ExcludeVue<P> = P extends VueConstructor<infer T & Vue>? T:never

export type AuthPluginType = ReturnType<typeof useAuth0>

export interface AuthPlugin extends AuthPluginType {}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: AuthPlugin
  }
}
