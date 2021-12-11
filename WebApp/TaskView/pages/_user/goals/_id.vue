<template>
    <v-col>
        <div>Selected goal list here for {{ $route.params.id }}</div>
        {{ $route.params }}
        <goal-components />
        <div>
            <router-view />
        </div>
    </v-col>
</template>
