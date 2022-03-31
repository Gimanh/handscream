import { AppResponse } from '~/classes/util/AppTypes';

export type UserItem = { id: number, login: string, email: string, block: 0 | 1 };
export type SaveUserItem = { id: number, login?: string, email?: string, block?: 0 | 1, password?: string };
export type AddUserItem = { login: string, email: string, password: string, block: 0 | 1 };
export type UserItems = UserItem[];
export type AdminsUsersResponse = {
    items: UserItems
    headers: { text: string, value: string }[]
};
export type UserExistResponse = AppResponse<{ exists: boolean }>;
export type AddUserResponse = AppResponse<{ add: boolean }>;
export type UpdateUserResponse = AppResponse<{ update: boolean }>;
export type DeleteUserResponse = AppResponse<{ delete: boolean }>;
