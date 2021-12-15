import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class TaskAdd extends AppBase {
    public taskName: string = '';
    public invalidName: boolean = false;

    get errorMessage() {
        return this.invalidName ? this.$t( 'msg.requiredField' ) : '';
    }

    get iconForInput() {
        if ( this.taskName ) {
            return 'mdi-keyboard-return';
        }
        return 'mdi-keyboard-variant';
    }

    isValidName() {
        return this.taskName && !!this.taskName.trim();
    }

    inputHandler( v: string ) {
        if ( v.trim() ) {
            this.invalidName = false;
        }
    }

    canAddGoal() {
        if ( this.isValidName() ) {
            return true;
        }
        this.invalidName = true;
    }

    async add() {
        if ( this.canAddGoal() ) {
            console.log( this.taskName );
            // const goalData: GoalAddItem = {
            //     name: this.name,
            //     description: this.description
            // };
            // const result = await this.addGoal( goalData ).catch( this.logError );
            // if ( result && result.response.add ) {
            //     this.cancel();
            // }
        }
    }
}
