import { createRouter, createWebHashHistory } from 'vue-router';

import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';
import IndexPage from '@/pages/IndexPage';

import authenticated from '@/middleware/authenticated';

const router = createRouter( {
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: IndexPage,
            children: []
        },
        {
            path: '/:company',
            name: 'company',
            component: () => import('@/pages/CompanyPage'),
            children: [
                {
                    path: ':restaurant',
                    name: 'company-restaurant',
                    component: () => import('@/pages/RestaurantPage'),
                    children: []
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/pages/LoginPage'),
            children: []
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('@/pages/AdminPage'),
            children: [],
            beforeEnter: [ authenticated ],
        },
    ],
} );

export default router;
