<template>
    <v-footer app fixed padless>
        <v-card
            class="flex"
            flat
        >
            <v-card-text class="py-2 text-center">
                <strong>&copy; {{ (new Date()).getFullYear() }} - "{{ name }}"
                    www.handscream.com</strong>
            </v-card-text>
        </v-card>
    </v-footer>
</template>

<script lang="ts" src="./ZFooter.ts"></script>
