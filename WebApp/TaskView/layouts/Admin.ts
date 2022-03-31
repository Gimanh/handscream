import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class Default extends AppBase {

    public drawer: boolean = false;

    public miniVariant: boolean = false;

    public clipped: boolean = true;

}
