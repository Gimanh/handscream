<template>
    <v-menu
        top
        :close-on-click="true"
    >
        <template #activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            >
                <v-icon>
                    mdi-filter-outline
                </v-icon>
            </v-btn>
        </template>

        <v-list>
            <v-list-item
                v-for="(item, index) in 5"
                :key="index"
            >
                <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script src=./TasksFilters.ts />
