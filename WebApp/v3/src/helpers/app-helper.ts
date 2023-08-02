import { reactive, computed } from 'vue';
import { app } from '@/main';
import type { Router } from 'vue-router';
import { useUserStore } from '@/stores/user';

const ls = reactive( app.config.globalProperties.$ls );
export const isLoggedIn = computed( () => {
    return ls.isLoggedIn;
} );

export const goToLoginPage = async ( router: Router ) => {
    await router.push( { name: 'login' } );
}

export const redirectToUser = async ( router: Router ) => {
    const userStore = useUserStore();
    if ( userStore.accessToken ) {
        await router.push( { name: 'user', params:{user:'1212121'} } );
    }
}

export const logError = ( err: any ) => console.log( err );

export function getDateFormatFOrSafari( date: string ): string {
    return date.substr( 0, 10 ).replace( /-/g, '/' );
}
