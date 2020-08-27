<template>
    <div>
        <v-menu transition="slide-y-transition">
            <template v-slot:activator="{ on: onMenu }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                        <v-btn
                            icon
                            v-on="{ ...onMenu, ...onTooltip }"
                            @click.stop
                        >
                            <v-icon>
                                more_horiz
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('msg.moreActions') }}</span>
                </v-tooltip>
            </template>
            <v-list>
                <v-list-item
                    @click="editSelected"
                >
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ $t('msg.edit') }}
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-icon
                            right
                            class="material-icons-outlined"
                        >
                            edit
                        </v-icon>
                    </v-list-item-action>
                </v-list-item>

                <v-list-item
                    @click="archiveGoal"
                >
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ archive ? $t('msg.unarchiveGoal') :$t('msg.archiveGoal') }}
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-icon
                            right
                            class="material-icons-outlined"
                        >
                            {{ archive ? 'unarchive' : 'archive' }}
                        </v-icon>
                    </v-list-item-action>
                </v-list-item>

                <v-list-item
                    class="red darken-2"
                    @click="confirmDeleteDialog = true"
                >
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ $t('msg.delete') }}
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-icon
                            right
                            class="material-icons-outlined"
                        >
                            delete
                        </v-icon>
                    </v-list-item-action>
                </v-list-item>
            </v-list>

        </v-menu>

        <app-delete-record-bottom-sheet
            :value="confirmDeleteDialog"
            @cancel="cancelDelete"
            @delete="deleteSelected"
        />
        <!--<v-bottom-sheet
            v-model="confirmDeleteDialog"
            inset
            persistent
        >
            <v-sheet
                class="text-center app-form"
                height="100px"
            >
                <v-icon color="red">
                    warning
                </v-icon>
                <h4>
                    {{ $t('msg.areYouWantDeleteRecord') }}
                </h4>
                <v-btn
                    color="app-form-submit-btn"
                    depressed
                    @click="cancelDelete"
                >
                    {{ $t('msg.cancel') }}
                </v-btn>
                <v-btn
                    color="app-form-cancel-btn"
                    depressed
                    @click="deleteSelected"
                >
                    {{ $t('msg.agree') }}
                </v-btn>
            </v-sheet>
        </v-bottom-sheet>-->
    </div>
</template>

<script src="./GoalItemMoreActions.ts" />
