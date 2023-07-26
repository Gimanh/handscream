import axios from 'axios';
import type { AxiosResponse } from 'axios';

const $api = axios.create( {
    //@ts-ignore PHPSTORM
    baseURL: process.env.NODE_ENV !== 'production' ? 'http://menu.localhost' : 'https://ilikeeat.handscream.com'
} );

export default $api;


