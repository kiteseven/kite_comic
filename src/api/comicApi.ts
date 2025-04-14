
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