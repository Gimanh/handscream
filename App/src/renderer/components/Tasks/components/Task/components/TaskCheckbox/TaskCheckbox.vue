<template>
    <v-col
        cols="1"
        class="pl-5 pa-1 goal-nested-item__checkbox pt-2"
    >
        <v-checkbox
            :input-value="item.checked"
            on-icon="check_box"
            off-icon="check_box_outline_blank"
            @change="updateStatus($event)"
        />
    </v-col>
</template>

<script src="./TaskCheckbox.ts" />
