import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class Index extends AppBase {
    created() {
        this.redirectToUser();
    }
}
