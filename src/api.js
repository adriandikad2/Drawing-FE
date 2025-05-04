import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/drawings'

export const getDrawings = () => axios.get(BASE_URL)
export const getDrawing = (id) => axios.get(`${BASE_URL}/${id}`)
export const createDrawing = (data) => axios.post(BASE_URL, data)
export const deleteDrawing = (id) => axios.delete(`${BASE_URL}/${id}`)
export const updateDrawing = (id, data) => axios.put(`${BASE_URL}/${id}`, data)
export const getDrawingById = (id) => axios.get(`${BASE_URL}/${id}`)
