// import axios from 'axios';

// const postLogout = () => axios.post(process.env.API);

const postLogout = () => new Promise((resolve) => {
    const returnValue = {
        message: 'Logged out',
    };

    setTimeout(resolve, 1200, returnValue);
});

export default postLogout;
