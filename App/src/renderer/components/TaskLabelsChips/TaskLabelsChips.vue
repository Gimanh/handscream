<template>
    <v-list dense>
        <v-list-item-group>
            <template
                v-for="(label, i) in labels"
            >
                <v-list-item
                    :key="i"
                    :style="{backgroundColor: getBackgroundColorWithOpacity(label.color, 0.4)}"
                    inactive
                    @click="toggleLabel(label)"
                >
                    <v-list-item-icon>
                        <v-icon
                            :color="selectedLabelsIds[label.id] ? label.color : ''"
                            :class="selectedLabelsIds[label.id] ? '' : 'material-icons-outlined'"
                        >
                            label
                        </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        {{ label.name }}
                    </v-list-item-content>
                    <v-list-item-action
                        v-if="allowDeleteLabel"
                    >
                        <v-icon
                            small
                            @click="deleteLabel(label)"
                        >
                            delete
                        </v-icon>
                    </v-list-item-action>
                    <v-list-item-action
                        v-if="allowEditLabels"
                    >
                        <v-icon
                            small
                            @click.stop="editLabel(label)"
                        >
                            edit
                        </v-icon>
                    </v-list-item-action>
                </v-list-item>
            </template>
            <v-list-item
                dense
                @click="showAddInput = true"
            >
                <v-list-item-icon>
                    <v-icon
                        class="material-icons-outlined"
                    >
                        add
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    {{ $t('msg.addLabel') }}
                </v-list-item-content>
            </v-list-item>
            <v-list-item
                dense
                @click="allowDeleteLabel = !allowDeleteLabel"
            >
                <v-list-item-icon>
                    <v-icon
                        class="material-icons-outlined"
                    >
                        {{ allowDeleteLabel ? 'check_box' : 'check_box_outline_blank' }}
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    {{ $t('msg.iWantDeleteLabel') }}
                </v-list-item-content>
            </v-list-item>
            <v-list-item
                dense
                @click="setAllowEditLabels"
            >
                <v-list-item-icon>
                    <v-icon
                        class="material-icons-outlined"
                    >
                        edit
                    </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    {{ $t('msg.editLabel') }}
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>

        <add-edit-label-dialog
            v-if="showAddInput"
            :value="showAddInput"
            :label="labelForEdit"
            @close="closeAddDialog"
            @save="addNewLabel"
            @update="updateLabel"
        />
    </v-list>
</template>

<script src="./TaskLabelsChips.ts" />

