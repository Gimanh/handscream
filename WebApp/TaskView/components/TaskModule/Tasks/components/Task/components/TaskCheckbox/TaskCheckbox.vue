<template>
    <div class="task-priority">
        <v-checkbox
            class="ma-0"
            :class="getPriorityClassColor()"
            style="z-index: 1;"
            dense
            :disabled="!allowed"
            :input-value="complete"
            @change="emitChange"
            @click.prevent
        />
    </div>
</template>

<script src=./TaskCheckbox.ts />

<style>
.task-priority {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.task-priority .task-priority__high .theme--light.v-icon {
    color: red !important;
}

.task-priority .task-priority__medium .theme--light.v-icon {
    color: orange !important;
}

.task-priority .task-priority__low .theme--light.v-icon {
    color: grey !important;
}
</style>
