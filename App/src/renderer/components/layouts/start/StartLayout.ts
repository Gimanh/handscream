import {Component} from 'vue-property-decorator';
import {State} from 'vuex-class';
import {NS_MAIN_STORE} from '@/store/types';
import ZMixin from '@/mixins/mixin';

@Component
export default class StartLayout extends ZMixin {

    @State(state => state[NS_MAIN_STORE].name) name!: boolean;

}
