#!/bin/bash

red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
reset=`tput sgr0`

if [ ! -e "./$1" ]; then
    echo "${green}Start creating awesome vuex-smart-store${reset}"

    echo "import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Store } from 'vuex';

export class $1State {

}

export class $1Mutations extends Mutations<$1State> {

}

export class $1StoreGetters extends Getters<$1State> {

}

export class $1StoreActions extends Actions<$1State, $1StoreGetters, $1Mutations, $1StoreActions> {

    private store!: Store<any>

    \$init( store: Store<any> ) {
        this.store = store;
    }

}

const module = new Module( {
    state: $1State,
    getters: $1StoreGetters,
    mutations: $1Mutations,
    actions: $1StoreActions
} );
export { module as $1 };
export default module;" > ./$1.ts

    if grep -Fxq "export { $1 } from './$1';" vuex-smart.ts
    then
        echo "${yellow}Export in index.ts already exists!${reset}"
    else
        echo "export { $1 } from './$1';" >> vuex-smart.ts
        echo "${green}Export added into vuex-smart.ts${reset}"
    fi

    git add $1.ts

    echo "${green}Store created!${reset}"
else
    echo "${red}File already exists! Can not create components!${reset}"
fi
