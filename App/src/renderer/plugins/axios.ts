import axios, { AxiosRequestConfig } from 'axios';
import _Vue from 'vue';

let AxiosPlugin = function <config extends AxiosRequestConfig>( Vue: typeof _Vue, options?: config ): void {
    Vue.prototype.$axios = axios.create( options );
}
export { AxiosPlugin };
export default AxiosPlugin;
