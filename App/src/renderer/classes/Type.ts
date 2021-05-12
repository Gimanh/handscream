import { ArgFetchTasks } from '@/store/Types/Goals/Types';

export type AppSqlQueries = {
    tasks: ArgFetchTasks
    [ 'tasks-search' ]: ArgFetchTasks
};

export let DefaultSort = {
    tasks: 'order_key',
    'tasks-search': 'order_key'
}
