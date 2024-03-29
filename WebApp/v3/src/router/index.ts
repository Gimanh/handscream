import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';
import IndexPage from '@/pages/IndexPage';

import authenticated from '@/middleware/authenticated';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: IndexPage,
            children: []
        },
        {
            path: '/:user',
            name: 'user',
            component: () => import('@/pages/UserPage'),
            children: [
                {
                    path: ':goalId',
                    name: 'goal-lists',
                    component: () => import('@/components/GoalLists'),
                    children: [
                        {
                            path: ':listId',
                            name: 'goal-list-tasks',
                            component: () => import('@/components/Tasks'),
                            children: []
                        }
                    ]
                },
            ],
            beforeEnter: [authenticated]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/pages/LoginPage'),
            children: []
        },
        // {
        //     path: '/admin',
        //     name: 'admin',
        //     component: () => import('@/pages/AdminPage'),
        //     children: [],
        //     beforeEnter: [ authenticated ],
        // },
    ],
});

export default router;
