<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
            <v-btn
                icon
                v-on="on"
            >
                <v-icon
                    class="material-icons-outlined"
                >
                    settings
                </v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-toolbar
                dense
            >
                <v-btn
                    icon
                    @click="saveAndClose"
                >
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>
                    {{ $t('msg.settings') }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <!--<v-toolbar-items>
                    <v-btn
                        depressed
                        @click="dialog = false"
                    >
                        {{ $t('msg.save') }}
                    </v-btn>
                </v-toolbar-items>-->
            </v-toolbar>

            <v-list
                three-line
                subheader
            >
                <v-subheader>
                    {{ $t('msg.general') }}
                </v-subheader>
                <v-list-item>
                    <v-list-item-action>
                        <v-checkbox
                            on-icon="check_box"
                            off-icon="check_box_outline_blank"
                            :input-value="showCompletedTasks"
                            @change="setShowCompletedTask"
                        />
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ $t('stn.showCompletedItems') }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{ $t('stn.showCompletedDesc') }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-action>
                        <v-checkbox
                            on-icon="check_box"
                            off-icon="check_box_outline_blank"
                            :input-value="showStatsInList"
                            @change="setShowStatsInList"
                        />
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ $t('stn.showStatsInList') }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{ $t('stn.showStatsInListDesc') }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-divider />
        </v-card>
    </v-dialog>
</template>

<script src="./AppSettings.ts" />
