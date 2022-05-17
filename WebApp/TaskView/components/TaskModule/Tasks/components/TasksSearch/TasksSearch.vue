<template>
    <div
        style="height: 70px;"
    >
        <v-form
            ref="form"
            @submit.prevent
        >
            <v-text-field
                v-model="taskName"
                :error="invalidName"
                :error-messages="errorMessage"
                :label="label"
                :placeholder="label"
                :prepend-inner-icon="iconForInput"
                clearable
                @click:clear="search"
                @input="inputHandler"
                @keypress.enter="search"
            />
        </v-form>
    </div>
</template>

<script src=./TasksSearch.ts />
