import { getAuth0 } from '~/plugins/auth.client'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
export default function ({ $axios }: { $axios: NuxtAxiosInstance }) {
  const auth = getAuth0()
  $axios.interceptors.request.use(async (config) => {
    const token = await auth.getTokenSilently()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      config.headers.Authorization = undefined
    }
    return config
  })
}
