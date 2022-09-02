import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TermOfUse extends AppBase {

    public dialog: boolean = false;

    emitAccept() {
        this.$emit( 'accept' );
        this.dialog = false;
    }

    emitCancel() {
        this.$emit( 'cancel' );
        this.dialog = false;
    }
}
