import { defineComponent } from 'vue';
import { TvBtn } from '@/components/TvBtn'

export default defineComponent( {
    props: {
        modelValue: Boolean,
        title: {
            type: String,
            default: 'Delete record'
        },
        text: {
            type: String,
            default: ''
        }
    },
    emits: [
        'update:modelValue',
        'ok',
        'cancel',
    ],
    components: {
        TvBtn
    },
    data() {
        return {
            // dialog: true,
        }
    },
    methods: {
        updateModel() {
            this.$emit( 'update:modelValue', false );
        },
        ok() {
            this.updateModel();
            this.$emit( 'ok' );
        },
        cancel() {
            this.updateModel();
            this.$emit( 'cancel' );
        }
    }
} );
