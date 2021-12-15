import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class Tasks extends AppBase {

    @Prop( {} )
    public componentId!: number;

}
