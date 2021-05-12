import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { AppTextAreaProps } from '@/components/AppTextArea/Types';

@Component
export default class AppTextArea extends ZMixin {
    @Prop( {
        default: function (): AppTextAreaProps {
            return {};
        }
    } )
    public props!: AppTextAreaProps;

    public $refs!: {
        textArea: HTMLInputElement
    }

    created() {
        if ( this.props.autofocus ) {
            setTimeout( () => {
                this.$refs.textArea.focus();
            }, 0 );
        }
    }
}
