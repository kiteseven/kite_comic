import {
    getUserData,
} from "@/api/userApi"

export const getUserDatas = async () => {
    const token = localStorage.getItem('token');
    if (token){
        const response = await getUserData();
        return response.data;
    }
}