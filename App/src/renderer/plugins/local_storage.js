import LocalStorage from '@/classes/LocalStorage';

let LocalStoragePlugin = function ( Vue, options ) {
    Vue.prototype.$ls = new LocalStorage(options);
}
export { LocalStoragePlugin };
export default LocalStoragePlugin;
