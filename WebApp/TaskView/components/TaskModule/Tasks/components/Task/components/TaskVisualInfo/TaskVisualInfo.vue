<template>
    <div
        v-if="canWatchPriority"
        class="task-visual-info pl-1"
    >
        <v-icon
            small
            :color="getPriorityColor()"
        >
            mdi-alert-box
        </v-icon>
        <div
            v-if="canWatchTags"
            class="task-visual-info pl-14"
        >
            <v-icon
                v-for="tagId in task.tags"
                :key="tagId"
                small
                :color="getTagColor(tagId)"
            >
                mdi-label
            </v-icon>
        </div>
    </div>
</template>

<script src=./TaskVisualInfo.ts />

<style>
.task-visual-info {
    position: absolute;
    bottom: 0;
    display: flex;
}
</style>
