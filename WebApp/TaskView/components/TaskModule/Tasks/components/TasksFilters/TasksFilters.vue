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
                style="cursor:pointer;"
                @click="showCompletedTasks(true)"
            >
                <v-list-item-action>
                    <v-simple-checkbox
                        :value="true"
                        :disabled="true"
                    />
                </v-list-item-action>
                <v-list-item-title>{{ $t( 'msg.showCompletedTasks' ) }}</v-list-item-title>
            </v-list-item>
            <v-list-item
                style="cursor:pointer;"
                @click="showCompletedTasks(false)"
            >
                <v-list-item-action>
                    <v-simple-checkbox
                        :value="false"
                        :disabled="true"
                    />
                </v-list-item-action>
                <v-list-item-title>{{ $t( 'msg.hideCompletedTasks' ) }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script src=./TasksFilters.ts />
