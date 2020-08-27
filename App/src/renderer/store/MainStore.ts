import { Getters, Mutations, Actions, Module } from 'vuex-smart-module'
import { IMainStoreMutations } from '@/store/IMainStoreMutations';
import { I18N } from '@/classes/IZDatabase';

/**
 * Class for root state each request to database
 * or server for fetching data must use only actions
 * and then mutation { DONT USE MUTATIONS FOR ACCESS TO DATABASE }
 */
class MainStoreState {

    public name: string = 'Task View';

    public version: string = '1.11.0';

    public darkMode: boolean = false;

    public layout: string = 'StartLayout';

    public usagesMode: string = 'local';

    public languages: I18N[] = [
        { locale: 'ru', name: 'Русский' },
        { locale: 'en', name: 'English' },
        { locale: 'de', name: 'Deutsche' },
    ];

    public colorAddGoal: string = '#36B37E';

    public baseDialogWidth: string = '600px';

    public addBtnElevation: number = 3;

    public addBtnTransition: string = 'slide-y-reverse-transition';

    public addListItemTitleTransition: string = 'v-slide-x-transition';

    public addListItemActiveFabClass: string = 'grey lighten-4';

    public archivedGoalsClass: string = 'orange--text accent-4';

    public completeGoalIconColor: string = '#00B8D9';

    public allowSort: boolean = false;
}

class MainStoreMutations extends Mutations<MainStoreState> implements IMainStoreMutations {

    setDarkMode( v: boolean ): void {
        this.state.darkMode = v;
    }

    setLayout( v: string ): void {
        this.state.layout = v;
    }

    setUsagesMode( v: string ): void {
        this.state.usagesMode = v;
    }

    setVersion( v: string ): void {
        this.state.version = v;
    }

    setAllowSort( v: boolean ) {
        this.state.allowSort = v;
    }
}

class MainStoreGetters extends Getters<MainStoreState> {

}


class MainStoreActions extends Actions<MainStoreState, MainStoreGetters, MainStoreMutations, MainStoreActions> {

}


const module = new Module( {
    state: MainStoreState,
    getters: MainStoreGetters,
    mutations: MainStoreMutations,
    actions: MainStoreActions
} );
export default module;
