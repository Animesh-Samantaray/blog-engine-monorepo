import axios from 'axios'

export const serverUrl = 'http://localhost:5000'

const api = axios.create({
  baseURL: `${serverUrl}/api`,
  withCredentials: true,
})

export default api