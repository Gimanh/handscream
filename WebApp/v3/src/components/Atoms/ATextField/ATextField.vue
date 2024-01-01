<template>
    <v-text-field
        v-bind="$attrs"
        :slot="$slots"
        variant="underlined"
        density="compact"
        hide-details
    >
        <template v-for="(_, name) in $slots" v-slot:[name]="slotData" :slot="name" >
            <slot :name="name" v-bind="slotData" />
        </template>
    </v-text-field>
</template>

<script src="./ATextField.ts" lang="ts" />
