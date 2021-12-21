import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TaskDeleteDialog extends AppBase {
    public dialog: boolean = true;

    apply() {
        this.$emit( 'apply' );
    }

    cancel() {
        this.$emit( 'cancel' );
    }
}
