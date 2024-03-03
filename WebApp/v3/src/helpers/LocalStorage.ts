import type { AxiosInstance } from 'axios';
import type { JWTPayload } from '@/helpers/AppTypes';
import { parseJwt } from '@/helpers/Helper';
import { useUserStore } from '@/stores/user.store';

export const ACCESS_TOKEN_KEY = 'access';
export const REFRESH_TOKEN_KEY = 'refresh';

export default class LocalStorage {

    protected namespace: string = '';

    protected axios!: AxiosInstance;

    public isLoggedIn: boolean = false;

    protected userStore!: ReturnType<typeof useUserStore>;

    constructor(options: { namespace: string, axios: AxiosInstance }) {
        this.namespace = options.namespace;
        this.axios = options.axios;
        this.isLoggedIn = !!this.getToken();
        this.userStore = useUserStore();
    }

    private key(key: string): string {
        return `${this.namespace}.${key}`;
    }

    getValue(key: string): string | null {
        return localStorage.getItem(this.key(key));
    }

    setValue(key: string, value: { [key: string]: any } | string): void {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        localStorage.setItem(this.key(key), value);
    }

    setToken(token: string): void {
        this.setValue(ACCESS_TOKEN_KEY, token);
        this.checkTokenAndSetForAxios();
        this.isLoggedIn = true;
    }

    setRefreshToken(refreshToken: string): void {
        this.setValue(REFRESH_TOKEN_KEY, refreshToken);
    }

    getToken(): string | null {
        return this.getValue(ACCESS_TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return this.getValue(REFRESH_TOKEN_KEY);
    }

    checkTokenAndSetForAxios(): void {
        const token = this.getToken();
        if (token) {
            this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

    invalidateTokens() {
        localStorage.removeItem(this.key(REFRESH_TOKEN_KEY));
        localStorage.removeItem(this.key(ACCESS_TOKEN_KEY));
        delete this.axios.defaults.headers.common['Authorization'];
        this.isLoggedIn = false;
        if (this.userStore) {
            this.userStore.setAccessToken('');
            this.userStore.setRefreshToken('');
            this.userStore.setLogin('');
            this.userStore.setEmail('');
        }
    }

    updateUserStoreByToken() {
        const accessToken = this.getToken();
        if (accessToken) {
            this.userStore.setAccessToken(accessToken);
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
                this.userStore.setRefreshToken(refreshToken);
            }
            const payload = parseJwt<JWTPayload>(accessToken);
            this.userStore.setLogin(payload.userData.login);
            this.userStore.setEmail(payload.userData.email);
        }
    }
}
