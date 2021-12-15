<template>
    <v-list
        nav
    >
        <v-list-group
            :value="true"
        >
            <template #activator>
                <v-list-item-title>
                    {{ $t( 'task.tasks' ) }}
                </v-list-item-title>
            </template>
            <task-add
                :component-id="componentId"
            />
        </v-list-group>
    </v-list>
</template>

<script src=./Tasks.ts />
