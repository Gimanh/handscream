<template>
    <div class="task-priority">
        <v-checkbox
            class="ma-0"
            style="z-index: 1;"
            dense
            :disabled="!allowed"
            :input-value="complete"
            @change="emitChange"
            @click.prevent
        />
        <div class="task-priority-stripe" :style=" !complete ? {border: '2px solid ' + getPriorityColor()} : {}" />
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

.task-priority-stripe {
    padding: 1px;
    position: absolute;
    width: 10px;
    height: 10px;
    margin: 0 auto;
    z-index: 0;
}
</style>
