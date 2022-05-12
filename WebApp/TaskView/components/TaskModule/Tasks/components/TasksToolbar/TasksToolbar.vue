<template>
    <div>
        <task-add
            v-if="canAddTasks"
            :component-id="componentId"
            @showCompleted="showCompletedTasks"
        />
    </div>
</template>

<script src=./TasksToolbar.ts />
