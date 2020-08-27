<template>
    <target-item
        :drag-enabled="dragEnabled"
        :item-id="id"
        :header-value="name"
        :expanded-content="!!expanded"
        @headerUpdated="headerUpdated"
        @deleteItem="deleteItem"
        @expandedStatus="changeExpanded"
    >
        <template v-slot:header>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn
                        icon
                        :disabled="dragEnabled"
                        @click="changeExpanded(!expanded)"
                        v-on="on"
                    >
                        <v-icon>{{ (expanded ? "visibility_off" : "visibility") }}</v-icon>
                    </v-btn>
                </template>
                <span>{{ (expanded ? $t('msg.hide') : $t('msg.show')) }}</span>
            </v-tooltip>
        </template>
        <div class="editor__container target-item-content">
            <editor-menu-bar v-slot="{ commands, isActive, focused }" :editor="editor">
                <div class="editor__menubar is-hidden pa-2" :class="{ 'is-focused': focused }">
                    <v-btn
                        small
                        text
                        icon
                        :class="{ 'v-btn--active': isActive.bold() }"
                        @click="commands.bold"
                    >
                        <note-icon
                            name="bold"
                        />
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        :class="{ 'v-btn--active': isActive.italic() }"
                        @click="commands.italic"
                    >
                        <note-icon
                            name="italic"
                        />
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        :class="{ 'v-btn--active': isActive.strike() }"
                        @click="commands.strike"
                    >
                        <note-icon
                            name="strike"
                        />
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        :class="{ 'v-btn--active': isActive.underline() }"
                        @click="commands.underline"
                    >
                        <note-icon
                            name="underline"
                        />
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        :class="{ 'v-btn--active': isActive.code() }"
                        @click="commands.code"
                    >
                        <note-icon
                            name="code"
                        />
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        class="menubar__button"
                        :class="{ 'v-btn--active': isActive.paragraph() }"
                        @click="commands.paragraph"
                    >
                        <note-icon
                            name="paragraph"
                        />
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        class="menubar__button"
                        :class="{ 'v-btn--active': isActive.heading({ level: 1 }) }"
                        @click="commands.heading({ level: 1 })"
                    >
                        H1
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        class="menubar__button"
                        :class="{ 'v-btn--active': isActive.heading({ level: 2 }) }"
                        @click="commands.heading({ level: 2 })"
                    >
                        H2
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        :class="{ 'v-btn--active': isActive.bullet_list() }"
                        @click="commands.bullet_list"
                    >
                        <note-icon
                            name="ul"
                        />
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        :class="{ 'v-btn--active': isActive.ordered_list() }"
                        @click="commands.ordered_list"
                    >
                        <note-icon
                            name="ol"
                        />
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        :class="{ 'v-btn--active': isActive.blockquote() }"
                        @click="commands.blockquote"
                    >
                        <note-icon
                            name="quote"
                        />
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        :class="{ 'v-btn--active': isActive.code_block() }"
                        @click="commands.code_block"
                    >
                        <note-icon
                            name="code"
                        />
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        @click="commands.horizontal_rule"
                    >
                        <note-icon style="padding: 6px 0!important;" name="hr" />
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        @click="commands.createTable({rowsCount: 3, colsCount: 3, withHeaderRow: false })"
                    >
                        <note-icon name="table" />
                    </v-btn>

                    <span v-if="isActive.table()">
                        <v-btn small text icon
                               class="menubar__button"
                               @click="commands.deleteTable"
                        >
                            <note-icon name="delete_table" />
                        </v-btn>
                        <v-btn small text icon
                               class="menubar__button"
                               @click="commands.addColumnBefore"
                        >
                            <note-icon name="add_col_before" />
                        </v-btn>
                        <v-btn small text icon
                               class="menubar__button"
                               @click="commands.addColumnAfter"
                        >
                            <note-icon name="add_col_after" />
                        </v-btn>
                        <v-btn small text icon
                               class="menubar__button"
                               @click="commands.deleteColumn"
                        >
                            <note-icon name="delete_col" />
                        </v-btn>
                        <v-btn small text icon
                               class="menubar__button"
                               @click="commands.addRowBefore"
                        >
                            <note-icon name="add_row_before" />
                        </v-btn>
                        <v-btn small text icon
                               class="menubar__button"
                               @click="commands.addRowAfter"
                        >
                            <note-icon name="add_row_after" />
                        </v-btn>
                        <v-btn small text icon
                               class="menubar__button"
                               @click="commands.deleteRow"
                        >
                            <note-icon name="delete_row" />
                        </v-btn>
                        <v-btn small text icon
                               class="menubar__button"
                               @click="commands.toggleCellMerge"
                        >
                            <note-icon name="combine_cells" />
                        </v-btn>
                    </span>

                    <v-btn
                        small
                        text
                        icon
                        class="menubar__button"
                        @click="commands.undo"
                    >
                        <note-icon name="undo" />
                    </v-btn>

                    <v-btn
                        small
                        text
                        icon
                        class="menubar__button"
                        @click="commands.redo"
                    >
                        <note-icon name="redo" />
                    </v-btn>
                </div>
            </editor-menu-bar>
            <editor-content class="editor__content pa-2" :editor="editor" />
        </div>
    </target-item>
</template>

<script src="./NoteEditor.ts"></script>
