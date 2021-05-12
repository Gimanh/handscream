import { Getters, Mutations, Actions, Module } from 'vuex-smart-module'

import { $database } from '@/store/plugins/API';
import { IAppMainSettingsState } from '@/store/Types/AppSettings/IAppMainSettingsState';
import { AllAllowedSettings, IAppSettingsItems } from '@/store/Types/AppSettings/Types';
import { IAppMainSettingsMutation } from '@/store/Types/AppSettings/IAppMainSettingsMutations';
import { IAppMainSettingsActions } from '@/store/Types/AppSettings/IAppMainSettingsActions';

class AppMainSettingsState implements IAppMainSettingsState {

    showCompletedTasks: boolean = false;

    items: AllAllowedSettings = {
        showCompletedTasks: {
            id: -1,
            value: false
        },
        showListStats: {
            id: -1,
            value: false
        }
    };
}

class AppMainSettingsGetters extends Getters<AppMainSettingsState> {

}

class AppMainSettingsMutations extends Mutations<AppMainSettingsState> implements IAppMainSettingsMutation {
    initSettings( items: IAppSettingsItems ) {
        for ( let i in items ) {
            this.state.items[ items[ i ].name ] = {
                id: items[ i ].id,
                value: JSON.parse( items[ i ].value )
            }
        }
    }

    setItemValue<S extends keyof AllAllowedSettings>
    ( item: { name: S, value: AllAllowedSettings[S]['value'] } ) {
        if ( this.state.items[ item.name ] === undefined ) {
            let msg = 'Can not set settings property ' + item.name;
            console.error( msg );
            alert( msg );
        } else {
            this.state.items[ item.name ].value = item.value;
        }
    }
}

class AppMainSettingsActions extends Actions<AppMainSettingsState,
    AppMainSettingsGetters,
    AppMainSettingsMutations,
    AppMainSettingsActions> implements IAppMainSettingsActions {

    updateSettings() {
        let updateSettings: IAppSettingsItems = [];
        for ( let k in this.state.items ) {
            updateSettings.push( {
                id: this.state.items[ k ].id,
                name: k,
                value: this.state.items[ k ].value.toString()
            } )
        }
        $database.updateAllSettings( updateSettings );
    }

    fetchSettings() {
        this.commit( 'initSettings', $database.fetchAllSettings() );
    }
}


const module = new Module( {
    state: AppMainSettingsState,
    getters: AppMainSettingsGetters,
    mutations: AppMainSettingsMutations,
    actions: AppMainSettingsActions
} );
export default module;
