import { Component } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';


@Component
export default class AppAbout extends ZMixin {

    public dialog: boolean = false;

    public tabsModel: number = 1;

}
