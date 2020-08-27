import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';

@Component
export default class AddNestedItem extends ZMixin {

    @Prop( { required: true } )
    public showCompleted!: boolean;

    public fab: boolean = false;

    addNestedItem() {
        this.$emit( 'addNewNestedItem' );
    }

    toggleCompleted() {
        this.$emit( 'toggleCompleted' );
    }
}
