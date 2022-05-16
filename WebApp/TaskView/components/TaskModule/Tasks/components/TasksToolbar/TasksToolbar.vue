<template>
    <v-row no-gutters>
        <v-col
            :style="colsStyle"
        >
            <task-add
                v-show="showAddTask"
                v-if="canAddTasks"
                :component-id="componentId"
            />
            <tasks-search
                v-show="showMoreFilters"
                @searchTask="searchTask"
            />
        </v-col>
        <v-col
            v-if="showMoreFilters"
            v-bind="colParams"
        >
            <tasks-toggle
                @showCompleted="showCompletedTasks"
            />
        </v-col>
        <v-col
            v-bind="colParams"
        >
            <v-btn
                icon
                fab
                small
                @click="showMoreFilters = !showMoreFilters"
            >
                <v-icon>
                    {{ showMoreFilters ? 'mdi-chevron-triple-right' : 'mdi-chevron-triple-left' }}
                </v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script src=./TasksToolbar.ts />
