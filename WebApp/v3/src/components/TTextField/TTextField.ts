import { defineComponent } from 'vue';

export default defineComponent( {
    props: {
        modelValue: String
    },
    emits: [ 'update:modelValue' ],
    data() {
        return {}
    }
} );
