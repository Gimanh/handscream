#!/bin/bash

red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
reset=`tput sgr0`

if [ ! -e "./$1" ]; then
    echo "${green}Start creating component${reset}"

    mkdir $1

    echo "import { defineComponent } from 'vue';

export default defineComponent( {
    data() {
        return {}
    }
} );" > $1/$1.ts

    echo "<template>
    <h1>Component $1</h1>
</template>

<script src=\"./$1.ts\" lang=\"ts\"/>" > $1/$1.vue
    echo "import $1 from \"./$1.vue\";

export { $1 };
export default $1;" > $1/index.ts
fi
