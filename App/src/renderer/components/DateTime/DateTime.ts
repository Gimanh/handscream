import ZMixin from '@/mixins/mixin';
import {Component, Prop} from 'vue-property-decorator'
import {Helper} from '@/classes/Helper';

@Component
export default class DateTime extends ZMixin {

    @Prop()
    public date!: string;

    public selectedDate: string = this.date ? this.date : ''//this.getDate();

    private theme = 'dark';

    private getDate() {
        let date = new Date();
        let result: string[] = [];
        result.push(date.toISOString().substr(0, 10));
        result.push(date.getHours() + ' ' + date.getMinutes());
        return result.join(' ');
    }

    public getId(): string {
        return Helper.guidGenerator();
    }

    public dateChanged(e) {
        this.$emit('input', e);
    }
}
