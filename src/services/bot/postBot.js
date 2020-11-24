import http from 'src/services/http';

const postBot = (payload) => http.post('/bot', payload, {
    'Content-Type': 'multipart/form-data',
});

// const postBot = (payload) => new Promise((resolve) => {
//     const returnValue = {
//         message: 'Bot successfully created',
//     };

//     console.log(payload);
//     setTimeout(resolve, 2000, returnValue);
// });

export default postBot;
