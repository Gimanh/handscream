import * as components from '@/components'

export default {
    install( Vue, options ) {
        for ( let key in components ) {
            Vue.component( key, components[ key ] )
        }
    }
}
