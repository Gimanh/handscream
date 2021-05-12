import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { AppBtnProps } from '@/components/AppBtn/Types';

@Component
export default class AppBtn extends ZMixin {
    @Prop( {
        default: function (): AppBtnProps {
            return {
                text: '---'
            }
        }
    } )
    public props!: AppBtnProps;
}
