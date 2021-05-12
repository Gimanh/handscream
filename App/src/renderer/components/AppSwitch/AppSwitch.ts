import ZMixin from '@/mixins/mixin';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class AppSwitch extends ZMixin {

    @Prop()
    public labelActive!: string;

    @Prop()
    public labelPassive!: string;

    @Prop( {
        default: function () {
            return {};
        }
    } )
    public props!: string;

    public active: boolean = false;

    get label() {
        return this.active ? this.labelActive : this.labelPassive;
    }

}
