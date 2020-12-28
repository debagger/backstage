import { Middleware } from '@nuxt/types'
import { getAuth0 } from '~/plugins/auth.client'

const myMiddleware: Middleware = async ({ app }) => {
  const auth = getAuth0()
  if (auth.isAuthenticated) {
    const token = await auth.getTokenSilently()
    console.log('[apollo-auth] token = ', token)
    app.$apolloHelpers.onLogin(token)
    app.$axios.setToken(token, "Bearer")
  } else {
    console.log('[apollo-auth] not authenticated')
    app.$apolloHelpers.onLogout()
    app.$axios.setToken(false)
  }
}

export default myMiddleware
