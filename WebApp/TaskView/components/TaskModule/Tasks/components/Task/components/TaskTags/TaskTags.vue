<template>
    <v-card
        v-if="canWatchTags"
        elevation="1"
    >
        <tag-delete-dialog
            v-if="deleteTagActive"
            @cancel="cancelDeleting"
            @apply="runDeletion"
        />
        <v-card-subtitle
            v-if="tags.length ===0"
        >
            {{ $t( 'msg.tags' ) }}
            <v-spacer />
        </v-card-subtitle>
        <v-card-text>
            <tasks-tag-add
                v-if="showAddForm && canEditTags"
                @close="closeAdd"
            />
            <v-chip
                v-for="(tag, index) in tags"
                :key="index"
                :disabled="!canEditTags"
                class="mr-1"
                close
                label
                outlined
                close-icon="mdi-delete"
                @click="toggleTag(tag)"
                @click:close="deleteTagHandler(tag)"
            >
                <v-icon
                    left
                    :color="getTagColor(tag)"
                >
                    mdi-label
                </v-icon>
                {{ tag.name }}
            </v-chip>
            <v-icon
                @click="addTag"
            >
                mdi-plus
            </v-icon>
        </v-card-text>
    </v-card>
</template>

<script src=./TaskTags.ts />
