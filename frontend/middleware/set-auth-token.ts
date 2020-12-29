import { Middleware } from '@nuxt/types'
import { getAuth0 } from '~/plugins/auth.client'

const setAuthTokensMiddleware: Middleware = async ({ app }) => {
  const auth = getAuth0()
  if (auth.isAuthenticated) {
    const token = await auth.getTokenSilently()
    app.$apolloHelpers.onLogin(token)
    app.$axios.setToken(token, "Bearer")
  } else {
    app.$apolloHelpers.onLogout()
    app.$axios.setToken(false)
  }
}

export default setAuthTokensMiddleware
