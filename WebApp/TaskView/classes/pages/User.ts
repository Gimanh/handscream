import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class User extends AppBase {

    created() {
        console.log( this.$ls );
    }

}
