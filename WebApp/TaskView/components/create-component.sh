#!/bin/bash

red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
reset=`tput sgr0`

if [ ! -e "./$1" ]; then
    echo "${green}Start creating component${reset}"

    mkdir $1

    echo "import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';

@Component
export default class $1 extends AppBase {

}" > $1/$1.ts

    echo "<template>
    <h1>Component $1</h1>
</template>

<script src="./$1.ts" />" > $1/$1.vue

    echo "import $1 from './$1.vue';

export { $1 };
export default $1;" > $1/index.ts

    if grep -Fxq "export * from './$1';" index.ts
    then
        echo "${yellow}Export in index.ts already exists!${reset}"
    else
        echo "export * from './$1';" >> index.ts
        echo "${green}Export added into index.ts${reset}"
    fi

    git add $1

    echo "${green}File created! Use component ${yellow}<$1 />${green} in vue files.${reset}"
else
    echo "${red}File already exists! Can not create components!${reset}"
fi
