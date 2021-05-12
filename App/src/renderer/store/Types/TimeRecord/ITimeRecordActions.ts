export interface ITimeRecordActions {
    workingOnTask( id: number ): Promise<any>;

    startTimeRecordForTask( taskId: number ): Promise<boolean>;

    stopTimeRecordForTask( taskId: number ): Promise<boolean>;
}
