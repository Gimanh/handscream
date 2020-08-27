import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';

@Component
export default class AppDeleteRecordBottomSheet extends ZMixin {

    @Prop( { default: false } )
    public value!: boolean;

    emitCancel() {
        this.$emit( 'cancel' );
    }

    emitDelete() {
        this.$emit( 'delete' );
    }

}
