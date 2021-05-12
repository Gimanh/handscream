import Vue from 'vue';
import Router from 'vue-router';
import {
    ROUTE_NAME_NESTED_COMPONENTS,
    ROUTE_NAME_TASK_DIALOG,
    ROUTE_NAME_TASK_DIALOG_FOR_NEW_TASK
} from '@/AppConsts';

Vue.use( Router );

export default new Router( {
    routes: [
        {
            path: '/',
            name: 'start',
            component: require( '@/components/Start/Start' ).default
        },
        {
            //Here we display all available goals
            path: '/:user',
            name: 'user',
            component: require( '@/components/User/User' ).default,
            children: [
                {
                    //Here we display all available goal components
                    path: 'goal/:id',
                    name: 'goal-id',
                    components: {
                        default: require( '@/components/GoalItems/GoalItems' ).default,
                    },
                    children: [
                        {
                            //Here we display all available goal-id nested components
                            path: 'nested-components/:nestedId',
                            name: ROUTE_NAME_NESTED_COMPONENTS,
                            components: {
                                default: require( '@/components/Tasks/Tasks' ).default
                            },
                            children: [
                                {
                                    //Here we display task dialog with task details
                                    path: 'task-dialog/add-task',
                                    name: ROUTE_NAME_TASK_DIALOG_FOR_NEW_TASK,
                                    components: {
                                        default: require( '@/components/Tasks/components/AddTaskDialog/AddTaskDialog' ).default
                                    },
                                },
                                {
                                    //Here we display task dialog with task details
                                    path: 'task-dialog/:taskId',
                                    name: ROUTE_NAME_TASK_DIALOG,
                                    components: {
                                        default: require( '@/components/Tasks/components/Task/components/TaskDialog/TaskDialog' ).default
                                    },
                                }
                            ]
                        }
                    ]
                }
            ]
        },
    ]
} )
