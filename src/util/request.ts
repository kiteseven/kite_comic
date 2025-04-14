// src/utils/request.ts
import axios from 'axios'
import { ariaProps, ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
    baseURL: '/api',
    timeout: 500000
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`; // 添加 token 到请求头
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code === 0) {
            ElMessage.error(res.msg || 'Error')
            return Promise.reject(new Error(res.msg || 'Error'))
        }
        return res
    },
    error => {
        ElMessage.error(error.message || '请求失败')
        return Promise.reject(error)
    }
)

export default service