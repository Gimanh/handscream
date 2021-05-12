<template>
    <v-switch
        v-model="active"
        v-bind="props"
        :label="label"
        inset
        dense
        v-on="$listeners"
    />
</template>

<script src="./AppSwitch.ts" />
