<template>
    <v-col>
        <div>tasks or OTHER for selected component {{ $route.params.id }}</div>
        {{ $route.params }}
        <!--        <goal-components />-->
        <div>
            <router-view />
        </div>
    </v-col>
</template>
