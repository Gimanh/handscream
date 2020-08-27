<template>
    <v-textarea
        :value="comment"
        :label="$t('msg.note')"
        class="pa-0 ma-0 goal-nested-items__info"
        auto-grow
        rows="1"
        row-height="20"
        @change="commentChanged"
        @keydown.enter.prevent=""
    />
</template>

<script src="./AppComment.ts"></script>
