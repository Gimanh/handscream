import { Component, Prop } from 'vue-property-decorator'
import ZMixin from '@/mixins/mixin';

@Component
export default class AppComment extends ZMixin {

    @Prop( { default: '' } )
    public comment!: string;

    commentChanged( val ) {
        if ( val ) {
            val = val.replace( /\r?\n|\r/g, ' ' );
        }
        this.$emit( 'commentChanged', val );
    }
}
