import { Component, Vue } from 'vue-property-decorator';
import { NS_GOALS, NS_MAIN_STORE, NS_SETTINGS, NS_TIME_CONTROL } from '@/store/Types/Consts';
import { State } from 'vuex-class';
import { registerModule } from 'vuex-smart-module';
import mainStore from '@/store/MainStore'
import goalsStore from '@/store/GoalsStore'
import settingsStore from '@/store/AppMainSettings'
import timeControl from '@/store/TimeRecordStore'

@Component
export default class App extends Vue {

    name: string = 'App';

    @State( state => state[ NS_MAIN_STORE ].layout ) layout;

    created() {
        registerModule( this.$store, NS_MAIN_STORE, NS_MAIN_STORE, mainStore );
        registerModule( this.$store, NS_GOALS, NS_GOALS, goalsStore );
        registerModule( this.$store, NS_SETTINGS, NS_SETTINGS, settingsStore );
        registerModule( this.$store, NS_TIME_CONTROL, NS_TIME_CONTROL, timeControl );
        this.$router.push( '/' );
    }
}
