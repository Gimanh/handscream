import { Component } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { Action, Mutation, State } from 'vuex-class';
import { NS_SETTINGS } from '@/store/types';
import {
    IAppMainSettingsActions,
    IAppMainSettingsMutation,
    IAppMainSettingsState
} from '@/store/IAppMainSettings';

@Component
export default class AppSettings extends ZMixin {

    @Action( 'fetchSettings', { namespace: NS_SETTINGS } )
    fetchSettings!: IAppMainSettingsActions['fetchSettings'];

    @Action( 'updateSettings', { namespace: NS_SETTINGS } )
    updateSettings!: IAppMainSettingsActions['updateSettings'];

    @Mutation( 'setItemValue', { namespace: NS_SETTINGS } )
    setItemValue!: IAppMainSettingsMutation['setItemValue'];

    public dialog: boolean = false;

    get showCompletedTasks() {
        return this.settingItems[ 'showCompletedTasks' ].value;
    }

    get showStatsInList() {
        return this.settingItems[ 'showListStats' ].value;
    }

    created() {
        if ( this.activeDatabase ) {
            this.fetchSettings();
        }
    }

    async saveAndClose() {
        await this.updateSettings();
        this.dialog = false;
    }

    setShowCompletedTask( value: boolean ) {
        this.setItemValue( {
            name: 'showCompletedTasks',
            value: value
        } );
    }

    setShowStatsInList(value: boolean) {
        this.setItemValue( {
            name: 'showListStats',
            value: value
        } );
    }
}
