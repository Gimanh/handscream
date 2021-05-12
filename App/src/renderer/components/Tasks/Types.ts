export type TasksDraggableComponent = 'div' | 'draggable';

export type SortNo = 0;
export type SortAsc = 1;
export type SortDesc = -1;

export type SortByItem = {
    value: string,
    text: string,
    asc: SortDesc | SortNo | SortAsc
};

export type SortBy = SortByItem[];
