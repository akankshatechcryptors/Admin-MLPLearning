import axios from 'axios'
const api = axios.create({
  baseURL: "http://localhost:7000/"
})
// 🔑 Interceptor to always attach token from localStorage
// 🔑 Request interceptor to attach token
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

// ⚠️ Response interceptor to handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 ||error.response?.status === 401) {
      // remove user from localStorage
      localStorage.removeItem('user');
      // optionally reload the page or redirect to login
    }
    return Promise.reject(error);
  }
);
export const addUser = (data) => {
  console.log(data)
  return api.post("users/add_user", data)
}
export const editUser=(data)=>{
  return api.post("users/edit_user",data)
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
export const uploadUsers=(data)=>{
  return api.post("users/upload_users",data)
}

export const changePassword=(data)=>{
  return api.post("admins/change_password",data)
}
export const addAdmin=(data)=>{
  return api.post("admins/add_admin" ,data)
}
export const getAdmins=(data)=>{
  return api.post("admins/get_admins" ,data)
}
export const editAdmin=(data)=>{
  return api.post("admins/edit_admin" ,data)
}

export const addFolder=(data)=>{
  return api.post("exams/add_folder",data)
}
export const getFolder=()=>{
  const data=""
  return api.post("exams/get_folders",data)
}
export const editFolder=(data)=>{
  return api.post("exams/edit_folder",data)
}
export const addExam=(data)=>{
  return api.post("exams/add_exam",data)
}
export const getExam=(data)=>{
  return api.post("exams/get_exams",data)
}
export const editExam=(data)=>{
   return api.post("exams/edit_exam",data)
}
export const moveFolder=(data)=>{
  return api.post("exams/move_to_folder",data)
}
export const allotTest=(data)=>{
  return api.post("exams/exam_allotment",data)
}
export const addSections=(data)=>{
  return api.post("sections/add_section",data)
}
export const editSections=(data)=>{
  return api.post("sections/edit_section",data)
}
export const deleteSections=(data)=>{
  return api.post("sections/delete_section",data)
}
export const getSections=(data)=>{
  return api.post("questions/get_exam_questions",data)
}
export const getQuestions=(data)=>{
  return api.post("questions/get_exam_questions",data)
}
export const addQuestions=(data)=>{
  return api.post("questions/add_question",data)
}

export const uploadQuestions=(data)=>{
  return api.post("questions/upload_questions",data)
}
 export const editQuestion=(data)=>{
  return api.post("questions/edit_questions",data)
}

export const deleteQuestion=(data)=>{
  return api.post("questions/delete_questions",data)
}
export const udpateMinScore=(data)=>{
  return api.post("exams/update_min_marks",data)
}