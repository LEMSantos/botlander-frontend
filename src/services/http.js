import axios from 'axios';
import {
    LocalStorage,
    Cookies,
    Dialog,
} from 'quasar';
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
    async (error) => {
        const originalRequest = error.config;
        const refreshURL = `${process.env.API}/auth/refresh`;
        const refreshnessURL = `${process.env.API}/auth/fresh-login`;

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

            let newRequest = axios({
                method: 'POST',
                url: refreshURL,
                headers: { Authorization: `Bearer ${decryptedData.refresh_token}` },
            });

            if (error.response.config.method !== 'get') {
                await new Promise((resolve) => {
                    Dialog.create({
                        title: 'Verificação de Segurança',
                        message: 'Por questões de segurança, por favor informe a sua senha para completar a ação.',
                        prompt: {
                            model: '',
                            type: 'password',
                        },
                        cancel: true,
                        persistent: true,
                    })
                        .onOk((password) => resolve(password));
                })
                    .then((password) => {
                        newRequest = axios({
                            method: 'POST',
                            url: refreshnessURL,
                            data: {
                                identity: LocalStorage.getItem('userInfo').username,
                                password,
                            },
                        });
                    });
            }

            return newRequest.then(({ data }) => {
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
