import { computed } from 'vue';
import type { Router } from 'vue-router';
import { useUserStore } from '@/stores/user.store';
import type { ArgumentsType } from 'vitest';

export const isLoggedIn = computed(() => {
    const userStore: ReturnType<typeof useUserStore> = useUserStore();
    return userStore.isLoggedIn;
});

export const goToLoginPage = async (router: Router) => {
    await router.push({ name: 'login' });
}

export const redirectToUser = async (router: Router) => {
    const userStore: ReturnType<typeof useUserStore> = useUserStore();
    if (userStore.accessToken) {
        await router.push({ name: 'user', params: { user: userStore.login } });
    }
}

export const logError = (err: any) => console.log(err);

export function getDateFormatFOrSafari(date: string): string {
    return date.substr(0, 10).replace(/-/g, '/');
}

export function debounce<T extends (...args: any[]) => ReturnType<T>>(fn: T, delay: number) {
    let timeoutId = -1;
    return (...args: Parameters<T>) => {
        if (timeoutId !== -1) {
            clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => {
            fn(...args);
        }, delay)
    }
}