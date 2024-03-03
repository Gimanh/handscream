<template>
    <v-list-item lines="two"
                 :active="isActive"
                 :value="goal"
                 :ripple="false"
                 @click="goToLists">
        <v-list-item-title>
            {{ goal.name }}
        </v-list-item-title>
        <template #append>
            <tv-btn icon
                    :size="'x-small'"
                    @click.stop.prevent="showActionDialog($event)">
                <v-icon>
                    {{ mdiDotsVertical }}
                </v-icon>
            </tv-btn>
        </template>
    </v-list-item>
</template>

<script src="./GoalsItem.ts" lang="ts" />
