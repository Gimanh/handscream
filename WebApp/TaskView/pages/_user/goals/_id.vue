<template>
    <v-col
        cols="7"
        class="pl-1"
    >
        <tasks
            :component-id="$route.params.list"
        />
        <!--        <div>tasks or OTHER for selected component {{ $route.params.id }}</div>
                {{ $route.params }}
                <div>
                    <router-view />
                </div>-->
    </v-col>
</template>
