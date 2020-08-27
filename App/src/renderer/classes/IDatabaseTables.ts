export interface IDatabaseTablesVersion {
    id: number
    version: string
}

export interface IDatabaseTablesCheckListHeader {
    id: number
    name: string
    description: string
    date_creation: string
    parent: number
    owner: string
    expanded: number
    service: number
    order_key: number
}

export interface IDatabaseTablesCheckListItem {
    id: number
    description: string
    checked: number
    parent_id: number
    date_creation: string
    order_key: number
    date_complete: number
}

export interface IDatabaseTablesComment {
    id: number
    item_id: number
    text: string
    date_creation: string
    owner: string
}

export interface IDatabaseTablesNotes {
    id: number
    name: string
    description: string
    content: string
    date_creation: string
    parent: number
    expanded: number
    owner: string
    order_key: number
}

export interface IDatabaseTablesReminder {
    id: number
    item_id: number
    date: number
    date_creation: string
    owner: string
}

export interface IDatabaseTablesTargets {
    id: number
    name: string
    description: string
    date_creation: string
    parent: string
    owner: string
    order_key: number
    color: string
    archive: number
}
