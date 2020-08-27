export interface IConfigStoreLicense {
    agreed: boolean
    version: string
}

export type IConfigDataTaskView = {
    databaseList: { src: string, date: number }[],
    lastOpenedDatabase: string
};

export interface IConfigAll {
    license: IConfigStoreLicense,
    taskView: IConfigDataTaskView,
    darkMode: boolean,
    locale: string
}
