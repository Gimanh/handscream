<template>
    <v-card class="hs-list-items pa-0 app-border-radius" style="height: 100vh;">
        <v-toolbar style="flex: 0;">
            <v-toolbar-title>
                {{ $t('msg.calendar') }}
            </v-toolbar-title>
            <v-spacer />
        </v-toolbar>
        <v-layout class="hs-list-items pa-0 pt-2">
            <v-calendar
                ref="calendar"
                :events="events"
                @change="updateRange"
            />
        </v-layout>
    </v-card>
</template>

<script src="./AppCalendar.ts"/>
