import { Component, Watch } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { AppBtnProps } from '@/components/AppBtn/Types';
import { AppTextAreaProps } from '@/components/AppTextArea/Types';
import { IArgAddTask } from '@/store/Types/Goals/Types';
import { Action } from 'vuex-class';
import { NS_GOALS } from '@/store/Types/Consts';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';

@Component
export default class AddTaskDialog extends ZMixin {

    public nestedId: string = '';

    public description: string = '';

    @Action( 'addTask', { namespace: NS_GOALS } )
    addTask!: IGoalsStoreActions['addTask'];

    created() {
        this.nestedId = this.$route.params.nestedId;
    }

    get title(): string {
        return this.$t( 'msg.newTask' ) as string;
    }

    get textAreaProps(): AppTextAreaProps {
        return {
            autofocus: true,
            autoGrow: true,
            disabled: this.allowSort,
            placeholder: this.$t( 'msg.typeTask' ) as string,
            rows: 1,
            label: this.$t( 'msg.task' ) as string,
        }
    }

    get closeBtnProps(): AppBtnProps {
        return {
            text: this.$t( 'msg.close' ) as string
        }
    }

    get addBtnProps(): AppBtnProps {
        return {
            text: this.$t( 'msg.add' ) as string
        }
    }

    textUpdated( event ) {
        this.description = event;
    }

    async addNewTask() {
        await this.addNewTaskToList()
    }

    async addNewTaskToList(): Promise<void> {
        let orderKey: number = 1000000;
        let parentId = Number( this.nestedId );
        let newInfo: IArgAddTask = {
            order_key: orderKey,
            parentId: parentId,
            description: this.description
        };
        let result = await this.addTask( newInfo );
        if ( result ) {
            this.goBack();
            setTimeout( () => {
                if ( result ) {
                    this.goToTaskDialog( result.id );
                }
            }, 0 );
        }
        this.emitEventForList( newInfo.parentId );
    }

}
