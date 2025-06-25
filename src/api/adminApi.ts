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

export const getTheComicStats =()=>{
    return request.get('/admin/getTheComicStats')
}

export const exportComicsToTheExcel =()=>{
    return request.get('/admin/exportComic'
        , {
            responseType: 'blob', // 接收二进制流
        }
        )
}

export const adminDeleteComics =(ids)=>{
    return request.delete('/admin/deleteComics', {
        data:ids})
}