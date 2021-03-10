import axios from 'axios';

const api = axios.create({ baseURL: 'https://api.calendario.com.br/?json=true&token=bHVjYXNjaGF2ZXNAZmFlZS5jb20uYnImaGFzaD0xNTg2MzY0NjA'});

export default api;