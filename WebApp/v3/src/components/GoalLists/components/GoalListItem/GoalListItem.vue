<template>
    <v-list-item
        :to="goToTasks"
    >
        <v-list-item-title>
            {{ list.name }}
        </v-list-item-title>
        <template #append>
            <tv-btn
                icon
                :size="'x-small'"
                @click.stop="showActionDialog($event)"
            >
                <v-icon>
                    {{ mdiDotsVertical }}
                </v-icon>
            </tv-btn>
        </template>
    </v-list-item>
</template>

<script src="./GoalListItem.ts" lang="ts" />
