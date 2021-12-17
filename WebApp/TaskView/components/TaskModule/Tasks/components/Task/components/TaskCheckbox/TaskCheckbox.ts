import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TaskCheckbox extends AppBase {

    @Prop()
    public complete!: boolean;

    emitChange( value: boolean ) {
        this.$emit( 'change', value );
    }

}
