import { defineStore } from 'pinia';
import type { AppStoreState } from '@/types/global-app';

export const useAppStore = defineStore( 'app', {
    state(): AppStoreState {
        return {
            drawer: true
        }
    },
    actions: {
        setDrawer( state: boolean ) {
            this.drawer = state;
        }
    }
} );
