<template>
    <v-row>
        <v-col
            v-if="canShowLeftColumn"
            :cols="cols"
            class="pr-1"
        >
            <goal-components />
        </v-col>
        <nuxt-child />
    </v-row>
    <!--    <v-col
            cols="7"
            class="pl-1"
        >
            <tasks
                :component-id="$route.params.list"
            />
        </v-col>-->
</template>
<script src="../../../classes/pages/Id.ts" />
