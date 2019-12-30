import {IAvatarAttributes} from "../ui/src/components/avatar-customizer/avatar-options";

export enum MESSAGE_TYPE {
    INIT_APP = 'init',
    ADD_DATA_FOR_USER = 'data',
    REQUEST_INITIAL_STATE = 'requestInitialState',
    INITIAL_STATE_RESPONSE = 'initialStateResponse',
    CURRENT_USER = 'currentUser',
    CURRENT_USER_FROM_BACKGROUND = 'currentUserBackground',
    CURRENT_USER_FORM_UI = 'currentUserUi'
}

export enum CLIENT_APP_KEY {
    APP_USER_KEY = 'profile-current-user',
    APP_USER_STATE = 'profile-current-state'
}

export enum SUPPORTED_CLIENT {
    SVT = 'svt',
    UR = 'ur',
    SVT_BARN = 'svt_barn',
    SR = 'sr'
}

export interface IStorageKeyWithData {
    key: string,
    data?: any
}

export interface IClientData {
    storageKeysWithData: IStorageKeyWithData[]
}

export type IUserData = Record<string, IStorageKeyWithData[]>

export interface IClientUser {
    id: string;
    name: string;
    avatar: IAvatarAttributes;
    clients: SUPPORTED_CLIENT[];
    storageKeysWithData: IStorageKeyWithData[]
}

export interface IServerUser {
    id: string;
    name: string;
    avatar: IAvatarAttributes;
    clientsData: IUserData
}
export interface IApp {
    users: IServerUser[];
}

