import { Component, Prop } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { TasksState } from '~/store/Tasks';

@Component
export default class Task extends AppBase {
    @Prop( {
        default: () => {
        }
    } )
    public task!: TasksState['tasks'][0];
}
