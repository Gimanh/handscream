<template>
    <div>
        <task-add
            :list-id="listId"
        />
        <m-task
            v-for="item in tasks"
            :key="item.id"
        >
            {{ item.description }}
        </m-task>
    </div>
</template>

<script src="./Tasks.ts" lang="ts" />
