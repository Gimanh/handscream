<template>
    <div>
        <v-simple-table
            dense
            height="150"
            fixed-header
        >
            <template v-slot:default>
                <thead>
                <tr>
                    <th class="text-left">
                        {{ $t('msg.beginning') }}
                    </th>
                    <th class="text-left">
                        {{ $t('msg.duration') }}
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in records" :key="item.id">
                    <td>{{ item.dateCreation }}</td>
                    <td>{{ item.duration }}</td>
                </tr>
                </tbody>
            </template>
        </v-simple-table>
        <v-row
            justify="end"
            class="pr-5"
        >
            {{ $t('msg.total') }}: {{ total }}
        </v-row>
    </div>
</template>

<script src="./GoalItemNestedTaskTimeRecords.ts" />
