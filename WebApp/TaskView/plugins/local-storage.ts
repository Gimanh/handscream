import { Plugin } from '@nuxt/types'
import LocalStorage from '~/classes/util/LocalStorage';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LocalStoragePlugin: Plugin = ( context, inject ) => {
    inject( 'ls', new LocalStorage( { namespace: 'task_view' } ) )
}

export default LocalStoragePlugin
