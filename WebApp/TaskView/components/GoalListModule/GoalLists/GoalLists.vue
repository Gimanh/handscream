<template>
    <v-list
        nav
        dense
    >
        <v-list-group
            :value="true"
        >
            <template #activator>
                <v-list-item-title>{{ $t( 'goal.components' ) }}</v-list-item-title>
            </template>
            <goal-add-list />
            <app-progress
                :loading-active="loading"
            />
            <v-list-item-group
                v-model="selected"
                class="app-scrolled-list"
            >
                <goal-list
                    v-for="list in lists"
                    :key="list.id"
                    :list="list"
                />
            </v-list-item-group>
        </v-list-group>
    </v-list>
</template>

<script src=./GoalLists.ts />
