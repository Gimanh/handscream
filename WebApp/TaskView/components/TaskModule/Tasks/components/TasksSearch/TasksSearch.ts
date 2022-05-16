import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TasksSearch extends AppBase {

    public taskName: string = '';

    public invalidName: boolean = false;

    get errorMessage() {
        return this.invalidName ? this.$t( 'msg.requiredField' ) : '';
    }

    get label(): string {
        return this.$t( 'admin.search' ) as string;
    }

    get iconForInput(): string {
        return 'mdi-magnify';
    }

    inputHandler( v: string ) {
        if ( v.trim() ) {
            this.invalidName = false;
        }
    }

    search() {
        this.$emit( 'searchTask', this.taskName );
    }
}
