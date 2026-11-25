import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({baseURL:API_URL});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        if(error.response?.status === 401 && !original._retry){
            original._retry = true
            try{
                const refresh = localStorage.getItem('refresh');
                const {data} = await axios.post(`${API_URL}token/refresh/`,{refresh});
                localStorage.setItem('access',data.access);
                original.headers.Authorization = `Bearer ${data.access}`;
                return api(original);
            }
            catch{
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
    
);

export default api;