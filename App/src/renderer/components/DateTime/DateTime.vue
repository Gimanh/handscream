<template>
    <div class="w100">
        <vue-ctk-date-time-picker
            :id="getId()"
            v-model="selectedDate"
            :dark="theme === 'dark'"
            format="YYYY-MM-DD HH:mm"
            :label="$t('msg.selectDateTime')"
            no-shortcuts
            @input="dateChanged"
        />
    </div>
</template>

<script src="./DateTime.ts"></script>
