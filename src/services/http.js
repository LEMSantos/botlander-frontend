import axios from 'axios';
import { LocalStorage, Cookies } from 'quasar';
import { routerInstance } from 'boot/router';
import utils from 'src/utils';

const router = routerInstance;

const http = axios.create({
    baseURL: process.env.API,
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer',
    },
    timeout: 10000,
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;
        const refreshURL = `${process.env.API}/auth/refresh`;

        if (error.response.status === 401 && originalRequest.url === refreshURL) {
            LocalStorage.remove('secutityKeys');
            router.push('/login');

            return Promise.reject(error);
        }

        const decryptedData = utils.getSecurityData();

        // eslint-disable-next-line
        if (error.response.status === 401 && !originalRequest._retry) {
            // eslint-disable-next-line
            originalRequest._retry = true;

            return axios({
                method: 'POST',
                url: refreshURL,
                headers: { Authorization: `Bearer ${decryptedData.refresh_token}` },
            })
                .then(({ data }) => {
                    decryptedData.access_token = data.access_token;
                    utils.setSecurityData(decryptedData);

                    originalRequest.headers.Authorization = `Bearer ${decryptedData.access_token}`;

                    return axios(originalRequest);
                });
        }

        return Promise.reject(error);
    },
);

http.interceptors.request.use((config) => {
    if (Cookies.has('jwtSecurityKey') && LocalStorage.has('secutityKeys')) {
        const decryptedData = utils.getSecurityData();
        config.headers.Authorization = `Bearer ${decryptedData.access_token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default http;
