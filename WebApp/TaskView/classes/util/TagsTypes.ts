import { AppResponse } from '~/classes/util/AppTypes';
import { TaskIdArg } from '~/classes/util/TaskTypes';

export type TagStoreStateUrls = {
    addTag: string
    fetchTags: string
    toggleTag: string
    deleteTag: string
    updateTag: string
};

export type TagItem = {
    id: number,
    name: string,
    owner: number,
    color: string
};

export type TagItems = TagItem[];

export type TagItemAdd = Omit<TagItem, 'id' | 'owner'>;

export type TagItemUpdate = Omit<TagItem, 'owner'>;

export type AddTagResponse = AppResponse<{ tag: TagItem | null }>;

export type EditTagResponse = AppResponse<{ tag: TagItem | null }>;

export type AddTag = {
    name: string
    color: string
};

export type TagsResponse = AppResponse<TagItems>;

export type ToggleTagActions = { action: 'add' | 'delete' };

export type ToggleTagResponse = AppResponse<ToggleTagActions>;

export type ToggleTagArg = { taskId: TaskIdArg, tagId: TagItem['id'] };

export type DeleteTagResponse = AppResponse<{ delete: boolean }>
