import http from 'src/services/http';

const getBot = (id) => http.get(`/bot/${id}`);

export default getBot;
