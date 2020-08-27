<template>
    <div class="note-container__note-icon">
        <div v-html="require(`!vue-html-loader!@/assets/editor/icons/${name}.svg`)" />
    </div>
</template>

<script lang="ts">
    export default {
        name: 'NoteIcon',
        props: {
            name: {
                type: String,
                default: 'code'
            },
        },
    }
</script>
