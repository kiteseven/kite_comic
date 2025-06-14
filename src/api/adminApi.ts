import request from '@/util/request'

export const getStats = () =>{
    return request.get('/admin/getStats')
}

export const adminGetComics =(page,pageSize)=>{
    return request.get('/admin/getComics',
        {
            params: {
                page,
                pageSize,
            }
        }
    )
}