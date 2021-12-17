<template>
    <v-row>
        <v-col
            cols="5"
            class="pr-1"
        >
            <goal-lists />
        </v-col>
        <nuxt-child />
    </v-row>
    <!--    <v-col
            cols="7"
            class="pl-1"
        >
            <tasks
                :component-id="$route.params.list"
            />
        </v-col>-->
</template>
