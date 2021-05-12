export type IAppSettingsItem = { id: number, name: string, value: string };
export type IAppSettingsItems = IAppSettingsItem[];
export type IAppItemValue = {
    name: IAppSettingsItem['name']
    value: IAppSettingsItem['value']
}
/**
 * All allowed settings in application
 */
export type AllAllowedSettings = {
    showCompletedTasks: {
        id: number
        value: boolean
    },
    showListStats: {
        id: number
        value: boolean
    }
};



export type setItemArg<S, V extends keyof AllAllowedSettings> = {
    name: S
    value: AllAllowedSettings[V]['value']
};




