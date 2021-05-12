import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { TaskItem } from '@/interfaces/IApp';

@Component
export default class TaskTimeRecords extends ZMixin {
    @Prop( {
        default: function () {
            return {};
        }
    } )
    public item!: TaskItem;
}
