<template>
    <v-col>
        <tasks
            :component-id="$route.params.list"
        />
        <div>tasks or OTHER for selected component {{ $route.params.id }}</div>
        {{ $route.params }}
        <!--        <goal-components />-->
        <div>
            <router-view />
        </div>
    </v-col>
</template>
