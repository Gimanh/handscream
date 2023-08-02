<template>
    <v-menu
        v-model="dialogStatusModel"
        :activator="activator"
        location="bottom"
    >
        <v-list>
            <v-list-item
                v-for="item in actions"
                :key="item.id"
                :value="item.name"
                @click="emitSelectedEvent(item.eventName)"
            >
                <v-list-item-title>
                    {{ item.name }}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script src="./GoalActions.ts" lang="ts"/>
