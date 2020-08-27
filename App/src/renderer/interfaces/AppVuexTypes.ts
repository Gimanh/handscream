import { Payload } from 'vuex';

export type VAction<S> = S & Payload
