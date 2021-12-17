<template>
    <div
        style="position: relative;"
        class="pl-5 pr-5"
    >
        <v-progress-linear
            v-if="loadingActive"
            color="green"
            indeterminate
            absolute
            rounded
            height="4"
        />
    </div>
</template>

<script src=./AppProgress.ts />
