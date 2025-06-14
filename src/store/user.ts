import { defineStore } from 'pinia';
import {
    getUserData,
} from "@/api/userApi"
export const useUserStore = defineStore('user', {
    state: () => ({
        userData: null,
    }),
    actions: {
        async fetchUserData() {
            try {
              //准备通过token获取用户信息
                const token = localStorage.getItem('token');
                if (token){
                    const response = await getUserData();
                    if (response.code===1) {
                        this.userData = response.data;
                        console.info(this.userData);
                    }
                }
            } catch (error) {
                console.error('获取用户信息失败', error);
                throw error;
            }
        },
    },
});