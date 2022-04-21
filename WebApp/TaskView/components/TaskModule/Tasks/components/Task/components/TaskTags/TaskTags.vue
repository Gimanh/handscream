<template>
    <v-card
        v-if="canWatchTags"
    >
        <v-card-title>
            {{ $t( 'msg.tags' ) }}
            <v-spacer />
            <v-icon
                @click="addTag"
            >
                mdi-plus
            </v-icon>
        </v-card-title>
        <v-card-text>
            <tasks-tag-add
                v-if="showAddForm && canEditTags"
                @close="closeAdd"
            />
            <v-list>
                <!--                <v-list-item
                                    v-for="(tag, index) in tags"
                                    :key="index"
                                >
                                    {{ tag.name }}
                                </v-list-item>-->

                <v-chip
                    v-for="(tag, index) in tags"
                    :key="index"
                    :disabled="!canEditTags"
                    class="ma-2"
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
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script src=./TaskTags.ts />
