import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class AppProgress extends AppBase {
    @Prop( { default: false } )
    public loading!: boolean;
}
