<template>
    <v-checkbox
        v-bind="$attrs"
        density="compact"
        hide-details
    >
        <template v-for="(_, name) in $slots" v-slot:[name]="slotData" :slot="name" >
            <slot :name="name" v-bind="slotData" />
        </template>
    </v-checkbox>
</template>

<script src="./ACheckbox.ts" lang="ts" />
