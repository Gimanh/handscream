import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class Index extends AppBase {
    created() {
        setTimeout( () => {
            this.redirectToUser();
        }, 5000 );
    }
}
