import http from 'src/services/http';

const putBot = (id, payload) => http.put(`/bot/${id}`, payload, {
    'Content-Type': 'multipart/form-data',
});

export default putBot;
