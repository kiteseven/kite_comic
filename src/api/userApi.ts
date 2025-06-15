import request from '@/util/request'


export const submitLoginDTO = (UserLoginDTO) =>{
    return request.post('/user/login',UserLoginDTO)
}

export const submitRegisterDTO = (UserRegisterDTO) =>{
    return request.post('/user/register',UserRegisterDTO)
}

export const getUserData = ()=>{
    return request.get('/user/getUserData')
}

export const updateUserData  = (updateUserDataDTO) =>{
    return request.put('/user/updateUserProfile',updateUserDataDTO)
}

export const saveTheComicReadConfig =(ComicReaderConfigDTO)=>{
    return request.post('/user/settings/saveTheComicReaderConfig',ComicReaderConfigDTO)
}

export const getUserReaderConfig = () =>{
    return request.get('/user/settings/readerSettings')
}