import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { ROUTE_NAME_TASK_DIALOG_FOR_NEW_TASK } from '@/AppConsts';

@Component
export default class AddTask extends ZMixin {

    public fab: boolean = false;

    addNestedItem() {
        this.$router.push( { name: ROUTE_NAME_TASK_DIALOG_FOR_NEW_TASK } )
    }
}
