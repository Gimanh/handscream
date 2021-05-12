<template>
    <div class="text-center">
        <v-menu
            :close-on-content-click="false"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="indigo"
                    dark
                    icon
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon>
                        filter_list
                    </v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item
                    v-for="item in sortBy"
                    :key="item.value"
                    @click="changeSort(item)"
                >
                    <v-list-item-action>
                        <v-icon
                            :disabled="item.asc === 0"
                            :class="getRotate(item)"
                        >
                            filter_list
                        </v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                        {{ translate( item.text ) }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script src="./SortTasks.ts" />
