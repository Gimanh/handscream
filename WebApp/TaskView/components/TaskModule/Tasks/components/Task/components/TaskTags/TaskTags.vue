<template>
    <v-card
        v-if="canWatchTags"
        elevation="1"
    >
        <tag-delete-dialog
            v-if="showDeleteTagForm"
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
            <tasks-tag-edit
                v-if="showEditTagForm && canEditTags"
                :tag="selectedTagForAction"
                @close="closeEdit"
            />
            <v-chip
                v-for="(tag, index) in tags"
                :key="index"
                :disabled="!canEditTags"
                class="mr-1"
                :close="showActionChipIcon"
                label
                outlined
                :close-icon="tagIcon"
                @click="toggleTag(tag)"
                @click:close="iconClickTagHandler(tag)"
            >
                <v-icon
                    left
                    :color="getTagColor(tag)"
                >
                    mdi-label
                </v-icon>
                {{ tag.name }}
            </v-chip>
        </v-card-text>
        <v-divider />
        <v-card-actions>
            <v-spacer />
            <v-btn
                fab
                icon
                x-small
                elevation="1"
                :disabled="showEditeLabelIcon"
            >
                <v-icon
                    @click="addTag"
                >
                    mdi-plus
                </v-icon>
            </v-btn>

            <v-btn
                fab
                icon
                x-small
                elevation="1"
            >
                <v-icon
                    @click="editTags"
                >
                    {{ showEditeLabelIcon ? 'mdi-pencil-off-outline' : 'mdi-pencil-outline' }}
                </v-icon>
            </v-btn>

            <v-btn
                fab
                icon
                x-small
                elevation="1"
            >
                <v-icon
                    @click="enableDelete"
                >
                    {{ showDeleteIcon ? 'mdi-delete-off-outline' : 'mdi-delete-outline' }}
                </v-icon>
            </v-btn>
            <v-spacer />
        </v-card-actions>
    </v-card>
</template>

<script src=./TaskTags.ts />
