import { LocalStorage, Cookies } from 'quasar';

const redirectIfAuthenticated = (to, from, next) => {
    if (Cookies.has('jwtSecurityKey') && LocalStorage.has('secutityKeys')) {
        next('/');
        return;
    }

    next();
};

const protectRoutesFromUnauthenticatedUsers = (to, from, next) => {
    if (!Cookies.has('jwtSecurityKey') || !LocalStorage.has('secutityKeys')) {
        next('/login');
        return;
    }

    next();
};

const routes = [
    {
        path: '/login',
        component: () => import('layouts/AuthenticationLayout.vue'),
        children: [
            { path: '', component: () => import('pages/LoginPage.vue') },
        ],
        beforeEnter: redirectIfAuthenticated,
    },

    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('pages/HomePage.vue') },
        ],
        beforeEnter: protectRoutesFromUnauthenticatedUsers,
    },

    {
        path: '/edit/:id',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('pages/EditPage.vue') },
        ],
        props: {
            hideFooter: true,
            denseToolbar: true,
        },
        beforeEnter: protectRoutesFromUnauthenticatedUsers,
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: '*',
        component: () => import('pages/Error404.vue'),
    },
];

export default routes;
