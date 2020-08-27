import {Component} from 'vue-property-decorator'
import ZMixin from '@/mixins/mixin';
import {State} from 'vuex-class';
import {NS_MAIN_STORE} from '@/store/types';

@Component
export default class AppTitle extends ZMixin {
    @State(state => state[NS_MAIN_STORE].name) name!: string;

    get appName() {
        return this.name.split(' ');
    }
}
