import axios from 'axios';

const postCredentials = (payload) => axios.post(`${process.env.API}/auth/login`, payload);

// const postCredentials = (payload) => new Promise((resolve/* , reject */) => {
//     const returnValue = {
//         message: 'Successfully logged in',
//         ...payload,
//     };

//     setTimeout(resolve, 2000, returnValue);
//     // setTimeout(reject, 2000, returnValue);
// });

export default postCredentials;
