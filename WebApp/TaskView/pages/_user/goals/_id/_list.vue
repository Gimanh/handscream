<template>
    <!--    <v-col>
            Selected list {{ $route.params.list }}
            <div></div>
        </v-col>-->
    <v-col
        cols="7"
        class="pl-1"
    >
        <tasks
            :component-id="$route.params.list"
        />
    </v-col>
</template>
