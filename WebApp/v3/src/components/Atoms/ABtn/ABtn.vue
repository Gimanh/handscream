<template>
    <v-btn v-bind="$attrs"
           :slot="$slots">
        <template v-for="(_, name) in $slots"
                  v-slot:[name]="slotData"
                  :slot="name">
            <slot :name="name"
                  v-bind="slotData || {}" />
        </template>
    </v-btn>
</template>

<script setup lang="ts">

</script>
