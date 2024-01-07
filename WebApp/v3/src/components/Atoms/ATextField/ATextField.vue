<template>
    <v-text-field v-bind="$attrs"
                  :slot="$slots"
                  variant="underlined"
                  density="compact"
                  hide-details
                  @update:modelValue="emitUpdate">
        <template v-for="(_, name) in $slots"
                  v-slot:[name]="slotData"
                  :slot="name">
            <slot :name="name"
                  v-bind="slotData" />
        </template>
    </v-text-field>
</template>

<script setup lang="ts">
import type { TaskItem } from '@/types/tasks.types';

const emit = defineEmits<{ (e: 'change', description: string): void }>();

function emitUpdate(description: TaskItem['description']) {
    emit('change', description);
}
</script>
