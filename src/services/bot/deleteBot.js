import http from 'src/services/http';

const deleteBot = (id) => http.delete(`/bot/${id}`);

export default deleteBot;
