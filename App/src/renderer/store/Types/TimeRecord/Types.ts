export const DEF_ACTIVE_RECORD_VAL = -1;

export type IArgStartTimeRecord = {
    taskId: number
    dateCreation: number
    dateStart: number
};

export type IArgStopTimeRecord = {
    taskId: number
    activeRecordInDatabaseId: number
    dateEnd: number
};



export interface ITimeRecord {
    id: number
    task_id: number
    date_creation: number
    date_start: number
    date_end: number
}

export type ITimeRecords = ITimeRecord[];
