<template>
    <v-col
        ref="container"
        class="user-container__goal-items-row__col-right pa-0"
        md="8"
        sm="12"
        @scroll="onScroll($event)"
    >
        <div
            ref="list"
            class="goal-nested-items"
        >
            <!--            <h2>{{ sortedNestedItems.length }}</h2>-->
            <additional-panel
                @change="toggleCompleted"
                @searchTask="searchTask"
                @sort="sortTasks"
            />
            <router-view />

            <component
                :is="draggableComponentName"
                v-model="sortedNestedItems"
                class="pa-0"
                v-bind="dragOptions"
            >
                <task
                    v-for="taskItem in sortedNestedItems"
                    v-if="canShowItem(taskItem)"
                    :key="taskItem.id"
                    :item="taskItem"
                    @addNewTaskToList="addNewTaskToList"
                />
            </component>
            <add-task
                @addNewNestedItem="addNewTaskToList"
                @toggleCompleted="toggleCompleted"
            />

            <!--   TODO     <app-delete-record-bottom-sheet
                        :value="deleteDialog"
                        @cancel="cancelDelete"
                        @delete="deleteItem"
                    />-->
        </div>
    </v-col>
</template>

<script src="./Tasks.ts" />

