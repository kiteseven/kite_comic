
import request from '@/util/request'


export const getShowComic =() => {
    return request.get('/comic/getShowComic')
}

export const getComic =(slug,comicId)=>{
    return request.get('/comic/{slug}',
    {
        params: {
            comicId
        }
    })
}

export const getComicChapters =(slug,comicId)=>{
    return request.get('/comic/${slug}/chapters',
    {
        params:{
            comicId
        }
    })
}

export const getComicChapterPages =(slug,comicId,chapterNumber)=>{
  return request.get('/comic/${slug}/chapters/${chapterNumber}',
      {
          params:{
              chapterNumber,
              comicId
          }
      }
      )
}



export const getShareSlug = () =>{
    return
}

export const publishComments = (CommentUploadDTO) =>{
    return request.post('comic/uploadComment',CommentUploadDTO)
}

export const getComments =(comicId) =>{
    return request.get('/comic/${comicId}/getComments',
        {
            params: {
                comicId
            }
        },
        )
}

export const createComic = (comicCreateDTO) => {
    return request.post('/comic/createComic' , comicCreateDTO)
}

export const uploadComic =(ComicUploadDTO) =>{
    return request.post('/comic/uploadComic',ComicUploadDTO)
}

export const incrementComicClickCount =(comicId)=>{
    return request.put(`/comic/${comicId}/incrementComicClick`,
        {
            params: {comicId}
        },
        );
}

export const getComicByPageSize =(page,pageSize,type)=>{
    return request.get('/comic/getComicByPageSize',
        {
            params: {
                page,
                pageSize,
                type
            }
        })
}

export const getMyComics =(page,pageSize)=>{
    return request.get('/comic/getMyComics',
        {
            params: {
                page,
                pageSize,
            }
        }
        )
}

export const searchComics =(string) =>{
    return request.get('/comic/getSearchComic',
        {
            params: {
                comicTitle:string
            }
        }
        )
}

export const addTheComicReadHistory =(comicId)=>{
   return request.post('/comic/addTheComicReadHistory',null,
       {
           params: {
               comicId
           }
       },
    )
}

export const saveTheComicReadHistoryDetail =(comicReadHistoryDetailDTO)=>{
    return request.post('/comic/saveTheComicReadHistoryDetail',comicReadHistoryDetailDTO,)
}

export const getTheComicReadHistoryDetail =(comicId)=>{
    return request.get('/comic/getTheComicReadHistoryDetailToShow',
        {
        params: {
            comicId
        }
    },)
}
export const getTheComicReadHistoryToShow =()=>{
    return  request.get('/comic/getTheComicReadHistoryToShow',)
}

export const getComicCollectionToShow =()=>{
     return request.get('/comic/getComicCollectionToShow',)
}

export const collectTheComic =(comicId)=>{
    return request.post('/comic/collectTheComic',null,{
        params: {
            comicId
        }})
}

export const cancelTheCollectComic =(comicId)=>{
    return request.post('/comic/cancelTheCollectComic',null,{
        params: {
            comicId
        }
    })
}

