<template>
    <v-row
        class="goal-nested-items__info ma-0"
    >
        <v-col
            cols="12"
            class="pa-0 goal-nested-item__info__comment pt-1"
        >
            <app-comment
                :comment="item.item_comment_text"
                @commentChanged="commentChanged($event, item)"
            />
        </v-col>
    </v-row>
</template>

<script src="./TaskComment.ts" />
