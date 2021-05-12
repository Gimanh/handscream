import { AllAllowedSettings } from '@/store/Types/AppSettings/Types';

export interface IAppMainSettingsMutation {

    initSettings( object: any );

    setItemValue<S extends keyof AllAllowedSettings>
    ( item: { name: S, value: AllAllowedSettings[S]['value'] } );

}
