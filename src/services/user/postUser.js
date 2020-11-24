import axios from 'axios';

const postUser = (payload) => axios.post(`${process.env.API}/user`, payload);

// const postUser = (payload) => new Promise((resolve) => {
//     const returnValue = {
//         message: 'Successfully created',
//         ...payload,
//     };

//     setTimeout(resolve, 2000, returnValue);
// });

export default postUser;
