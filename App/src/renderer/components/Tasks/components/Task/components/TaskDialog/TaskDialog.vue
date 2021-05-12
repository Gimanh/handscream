<template>
    <v-dialog
        :value="true"
        scrollable
        :max-width="dialogWidth"
        persistent
    >
        <v-card
            v-if="item"
        >
            <v-card-title>
                <v-textarea
                    :id="'textarea-dialog' + item.id"
                    :value="item.description"
                    :label="$t('msg.task')"
                    rows="1"
                    auto-grow
                    :disabled="allowSort"
                    :placeholder="$t('msg.typeTask')"
                    @change="emitTaskChanged($event, item)"
                    @focusout="emitDeleteTask($event, item)"
                />
            </v-card-title>
            <v-card-text
                class="pt-3"
                style="height: auto;"
            >
                <task-comment
                    :item="item"
                    @change="fetchItem"
                />

                <task-reminder
                    :item="item"
                    @change="fetchItem"
                />

                <task-labels
                    :item="item"
                    @change="fetchItem"
                />

                <task-time-records
                    :item="item"
                />

                <task-move
                    :item="item"
                    @change="close"
                />
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="blue--text darken-1"
                    elevation="1"
                    @click="close"
                >
                    {{ $t( 'msg.close' ) }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src="./TaskDialog.ts" />

<style>
.i-want-delete .v-messages {
    display: none !important;
}
</style>
