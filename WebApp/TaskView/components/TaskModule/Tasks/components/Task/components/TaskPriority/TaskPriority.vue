<template>
    <div
        class="pa-0"
    >
        <v-radio-group
            v-if="canWatchPriority"
            v-model="selected"
            :disabled="!canEditPriority"
            row
            dense
            class="ma-0"
            hide-details
        >
            <v-radio
                v-for="(priority, index) in priorities"
                :key="index"
                :label="getLabel(priority)"
                :color="getRadioColor(priority)"
                :value="priority.id"
                @change="priorityChanged(priority.id)"
            />
        </v-radio-group>
    </div>
</template>

<script src=./TaskPriority.ts />
