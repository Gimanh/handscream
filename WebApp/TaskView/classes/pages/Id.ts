import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class Id extends AppBase {
    public routes: string[] = [
        'user-goals-id-list',
        'user-goals-id-list-task',
        'user-goals-id-list-task-details',
        'user-goals-id-list-task-subtask',
        'user-goals-id-list-task-subtask-details'
    ];

    get cols() {
        return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs ? 12 : 5;
    }

    get canShowLeftColumn() {
        if ( this.routes.includes( this.$route.name + '' ) ) {
            if ( this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs ) {
                return false;
            }
        }
        return true;
    }
}
