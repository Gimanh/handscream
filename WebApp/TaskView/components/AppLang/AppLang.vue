<template>
    <v-menu offset-y>
        <template #activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            >
                <v-icon>
                    mdi-web
                </v-icon>
            </v-btn>
        </template>
        <v-list-item-group
            v-model="selected"
            active-class="pink--text"
        >
            <v-list>
                <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    active-class="pink--text"
                    @click="setLang(item)"
                >
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-list-item-group>
    </v-menu>
</template>

<script src=./AppLang.ts />
