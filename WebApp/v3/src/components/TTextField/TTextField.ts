import { defineComponent } from 'vue';

export default defineComponent( {
    props: {
        modelValue: String,
        component: {
            type: String,
            default: 'v-text-field'
        }
    },
    emits: [ 'update:modelValue' ],
    data() {
        return {}
    }
} );
