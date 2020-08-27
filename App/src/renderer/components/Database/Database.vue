<template>
    <div v-if="mode === 'local'">
        <v-menu
            left
            bottom
        >
            <template v-slot:activator="{ on: onMenu }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                        <v-btn icon v-on="{...onMenu, ...onTooltip}">
                            <v-icon>
                                storage
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>{{ $t('msg.storage') }}</span>
                </v-tooltip>
            </template>

            <v-list>
                <v-list-item
                    v-if="activeDatabase"
                    @click="closeDatabase"
                >
                    <v-list-item-title>
                        {{ $t('msg.closeDb') }}
                    </v-list-item-title>
                </v-list-item>

                <v-list-item
                    @click="createDatabase"
                >
                    <v-list-item-title>
                        {{ $t('msg.createDb') }}
                    </v-list-item-title>
                </v-list-item>

                <v-list-item
                    @click="openDatabaseDialogWithList"
                >
                    <v-list-item-title>
                        {{ $t('msg.openDb') }}
                    </v-list-item-title>
                </v-list-item>
                <v-list-item
                    v-if="activeDatabase"
                    disabled
                >
                    <v-list-item-title>
                        {{ dbName }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>


        </v-menu>
        <v-dialog
            v-model="showFileNameDialog"
            persistent
            max-width="450"
        >
            <v-card
                v-if="showFileNameDialog"
            >
                <v-card-title class="headline">
                    {{ $t('msg.enterFileName') }}
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        ref="fileNameField"
                        v-model="fileName"
                        :rules="fileNameRules"
                        :label="$t('msg.fileName')"
                        :placeholder="$t('msg.fileName')"
                    >
                        <template v-slot:append>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        icon
                                        v-on="on"
                                        @click="selectFolder"
                                    >
                                        <v-icon>
                                            folder_open
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('msg.selectStorageDestination') }}</span>
                            </v-tooltip>
                        </template>
                    </v-text-field>
                    <span>{{ databaseDestinationFolder }}</span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        color="blue--text darken-1"
                        elevation="1"
                        @click="hideDialog"
                    >
                        {{ $t('msg.cancel') }}
                    </v-btn>
                    <v-btn
                        color="blue--text darken-1"
                        elevation="1"
                        :disabled="dialogDisabledOkBtn"
                        @click="createDatabaseFile"
                    >
                        {{ $t('msg.create') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="showDialogOpenStorage" scrollable max-width="300px">
            <v-card>
                <v-card-title>{{ $t('msg.openStorage') }}</v-card-title>
                <v-card-text
                    class="pa-0"
                >
                    <!--IF you will DELETE v-if="showDialogOpenStorage" you will get infinity loop-->
                    <v-list v-if="showDialogOpenStorage">
                        <v-list-item-group>
                            <v-list-item
                                style="position: sticky; top: 0; z-index: 1;"
                                :class="$vuetify.theme.dark ? 'grey darken-2' : 'grey lighten-3'"
                                @click="openSelectDatabaseFolderDialog"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ $t('msg.openNew') }}
                                    </v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn
                                        icon
                                    >
                                        <v-icon>
                                            folder_open
                                        </v-icon>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>

                            <v-list-item
                                v-for="(item, index) in databaseListClean"
                                :key="index"
                                :class="item.exist ? '' : 'red lighten-2'"
                                @click="openSelectedDatabase(item)"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ item.dateUi }}
                                    </v-list-item-subtitle>
                                    <v-list-item-subtitle
                                        v-if="!item.exist"
                                    >
                                        {{ $t('msg.fileNotExists') }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn
                                        icon
                                        @click.stop="wantDeleteDatabaseListItem(item)"
                                    >
                                        <v-icon>
                                            close
                                        </v-icon>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        color="blue--text darken-1"
                        elevation="1"
                        @click="showDialogOpenStorage = false"
                    >
                        {{ $t('msg.cancel') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="showDeleteStorageFileDialog"
            max-width="600"
        >
            <v-card v-if="showDeleteStorageFileDialog">
                <v-card-title>
                    {{ $t('msg.warning') }}
                </v-card-title>
                <v-card-text
                    class="pa-0"
                >
                    <v-alert
                        prominent
                        icon="report_problem"
                        type="warning"
                    >
                        <v-row>
                            <v-col cols="12">
                                {{ $t('msg.deleteDbListItem') }}
                            </v-col>
                            <!--<v-col
                                v-if="itemWillBeDeleted.exist"
                                cols="12"
                            >
                                <v-btn
                                    color="grey"
                                    depressed
                                    @click="openFileLocation"
                                >
                                    <v-icon>
                                        folder_open
                                    </v-icon>
                                    {{ $t('msg.openLocation') }}
                                </v-btn>
                            </v-col>-->
                        </v-row>
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        v-if="itemWillBeDeleted.exist"
                        color="grey"
                        depressed
                        @click="openFileLocation"
                    >
                        <v-icon>
                            folder_open
                        </v-icon>
                        {{ $t('msg.openLocation') }}
                    </v-btn>
                    <v-btn
                        color="app-form-submit-btn"
                        @click="cancelDeleteFile"
                    >
                        {{ $t('msg.cancel') }}
                    </v-btn>
                    <v-btn
                        color="app-form-cancel-btn"
                        @click="deleteStorageListItem"
                    >
                        {{ $t('msg.accept') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script src="./Database.ts"></script>
