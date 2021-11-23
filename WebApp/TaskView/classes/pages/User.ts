import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component( {
    middleware: 'authenticated'
} )
export default class User extends AppBase {

    created() {
        console.log( this.$ls );
    }

}
