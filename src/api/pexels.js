import axios from 'axios'

const API_KEY = 'YfmWw5OJHOED92T2zB39zWNMY8fqGGnoYQ2vfRvzzQnOtpfq0QJ4xRIZ'
const API_URL = 'https://api.pexels.com/v1/'

const pexelsClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: API_KEY
  }
})

export const searchPhotos = async (query, perPage = 5) => {
  try {
    const response = await pexelsClient.get('/search', {
      params: {
        query,
        per_page: perPage,
        orientation: 'square'
      }
    })
    return response.data.photos.map(photo => ({
      id: photo.id,
      url: photo.src.large,
      alt: photo.alt || `Imagem de ${query}`
    }))
  } catch (error) {
    console.error('Error fetching photos from Pexels:', error)
    return []
  }
}