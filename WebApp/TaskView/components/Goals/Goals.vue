<template>
    <div>
        <div
            v-for="i in goals"
            :key="i"
            v-text="i.name"
        />
        <add-goal />
    </div>
</template>

<script src=./Goals.ts />
