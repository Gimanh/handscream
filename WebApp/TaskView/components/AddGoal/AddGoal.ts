import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { GoalAdd } from '~/classes/util/GoalTypes';

@Component
export default class AddGoal extends AppBase {

    @Prop( { default: true } )
    public addMode!: boolean;

    public dialog: boolean = false;

    public name: string = '';

    public description: string = '';

    cancel() {
        this.dialog = false;
        this.name = '';
        this.description = '';
    }

    save() {
        if ( this.name.trim() !== '' && this.name.length > 1 ) {
            const goalData: GoalAdd = {
                name: this.name,
                description: this.description
            };
            console.log( goalData );
        }
    }
}
