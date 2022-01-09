<template>
    <!--    <v-col>
            Selected list {{ $route.params.list }}
            <div></div>
        </v-col>-->
    <v-col
        :cols="cols"
        :class="colClass"
    >

        <v-btn
            v-if="smallScreen"
            fab
            dark
            small
            absolute
            bottom
            left
            @click="goToLists"
        >
            <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <tasks
            :component-id="$route.params.list"
        />
        <router-view />
    </v-col>
</template>

<script src="../../../../classes/pages/List.ts" />
