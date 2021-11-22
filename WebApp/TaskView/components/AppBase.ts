import { Vue, Component } from 'vue-property-decorator'

@Component
export default class AppBase extends Vue {
    logError( error: any ) {
        console.log( error );
    }
}
