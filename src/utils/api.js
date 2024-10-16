
import axios from 'axios';
import {getToken} from './auth'
//export const baseUrl = 'http://localhost:5007/ennore-delivery/'//'https://ennore-delivery-api.onrender.com/ennore-delivery/' 
export const baseUrl = 'https://ennore-delivery-api.onrender.com/ennore-delivery/' 


export const api = axios.create({
  baseURL:baseUrl, // replace with your ngrok URL
  headers: {
    'Content-Type': 'application/json', 
    Authorization: `Bearer ${getToken()}`
  },
});
