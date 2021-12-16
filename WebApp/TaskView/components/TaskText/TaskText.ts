import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TaskText extends AppBase {
    @Prop( { default: '' } )
    public description!: string;

    updateDescription( value: string ) {
        this.$emit( 'change', value );
    }
}
