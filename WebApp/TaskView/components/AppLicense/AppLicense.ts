import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class AppLicense extends AppBase {

    public dialog: boolean = false;

    get license(): string {
        return this.$t( 'msg.beforeStart' ) as string;
    }

    get closeTitle(): string {
        return this.$t( 'msg.close' ) as string;
    }

}
