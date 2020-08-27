import {Component, Prop} from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import {Mutation, Action} from 'vuex-class';
import {NS_ACTIVE_TARGET} from '@/store/types';
 //import {IRootStateMethods} from '@/store';
import {Helper} from '@/classes/Helper';


@Component
export default class ColorSelect extends ZMixin {

    @Prop()
    public targetId!: number;

    @Prop({default: 10})
    public colorItemsCount!: number;

    @Action('setColorToTarget', {namespace: NS_ACTIVE_TARGET}) setColorToTarget!: any //IRootStateMethods['setColorToTarget'];

    public colorItems: string[] = [];

    generateColors() {
        this.colorItems = [];
        for (let i = this.colorItemsCount; i--;) {
            let color: string = Helper.generateColor();
            this.colorItems.push(color)
        }
    }

    selectedColor(color) {
        this.setColorToTarget({
            targetId: this.targetId, color: color
        });
    }
}
