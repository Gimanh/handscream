import { defineComponent } from 'vue';

import { AppCredentialsForm } from '@/components/Authentication/AppCredentialsForm';

export default defineComponent( {
    data() {
        return {
            msg: 'login'
        }
    },
    components: {
        AppCredentialsForm
    }
} );
