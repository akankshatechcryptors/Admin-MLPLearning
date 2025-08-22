import axios from 'axios'
const api = axios.create({
  baseURL: "http://localhost:7000/"
})
// 🔑 Interceptor to always attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      const token = JSON.parse(user)?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const addUser = (data) => {
  console.log(data)
  return api.post("users/add_user", data)
}
export const login = (data) => {
  return axios.post('http://localhost:7000/admins/login', data)
}
export const getUsers = (id) => {
  return api.post("users/get_users", id)
}
export const addGroup = (data) => {
  return api.post("groups/add_group", data)
}
export const editGroup=(data)=>{
  return api.post("groups/edit_group", data)
}
export const getGroups = () => {
  const data = {
    user_id: ''
  }
  return api.post("groups/get_groups", data)
}
export const addToGroup = (data) => {
  return api.post("groups/change_groups", data)
}

export const removeFromGroup = (data) => {
  return api.post("groups/remove_from_group", data)
}
