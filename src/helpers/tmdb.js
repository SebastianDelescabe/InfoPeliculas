import axios from 'axios';

const configuredKey = (process.env.REACT_APP_API_KEY || '').trim();
const apiKey = configuredKey.startsWith('api_key=')
    ? configuredKey.slice('api_key='.length)
    : configuredKey;

const client = axios.create({ baseURL: 'https://api.themoviedb.org/3' });

export const tmdbGet = (path, params = {}) => client.get(path, {
    params: { api_key: apiKey, ...params }
});
