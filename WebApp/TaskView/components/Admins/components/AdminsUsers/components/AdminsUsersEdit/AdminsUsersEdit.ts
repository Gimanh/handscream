import { Component, Prop, Watch } from 'vue-property-decorator';
import qs from 'qs';
import AppBase from '~/components/AppBase';
import { isEmail, validLogin } from '~/classes/util/Helper';
import { SaveUserItem, UpdateUserResponse, UserExistResponse, UserItem } from '~/components/Admins/Types';
import { FormFieldRules } from '~/classes/util/AppTypes';
import PasswordHelper from '~/classes/util/PasswordHelper';

@Component
export default class AdminsUsersEdit extends AppBase {

    @Prop( {
        default(): UserItem {
            return {
                id: -1,
                login: '',
                email: '',
                block: 0
            };
        }
    } )
    public userData!: UserItem;

    @Prop( { default: false } )
    public disabled!: boolean;

    public valid: boolean = false;

    public dialog: boolean = false;

    public id: UserItem['id'] = -1;

    public login: UserItem['login'] = '';

    public email: UserItem['email'] = '';

    public block: boolean = false;

    public timeOut: number = -1;

    private userEmailExists: boolean = false;

    private userLoginExists: boolean = false;

    public loginLoading: boolean = false;

    public $refs!: {
        form: any
    };

    public password: string = '';

    public passwordType: 'password' | 'text' = 'password';

    get passwordIcon() {
        return this.passwordType === 'password' ? 'mdi-eye' : 'mdi-eye-off';
    }

    get credentialsRules(): FormFieldRules {
        return [
            ( v: string ) => {
                if ( v.trim() ) {
                    return PasswordHelper.check(v) || this.$t( 'msg.passwordStrength' ) as string;
                }
                return true;
            }
        ];
    }

    @Watch( 'userData', { deep: true, immediate: true } )
    userDataWatcher( value: UserItem ) {
        this.login = value.login;
        this.email = value.email;
        this.block = Boolean( value.block );
    }

    get loginRules() {
        return [
            ( login: string ) => {
                if ( !validLogin( login ) ) {
                    return this.$t( 'admin.correctLogin' );
                }
                if ( this.userLoginExists ) {
                    return this.$t( 'admin.userExists' );
                }
                return true;
            }
        ];
    }

    get emailRules() {
        return [
            ( email: string ) => {
                if ( !isEmail( email ) ) {
                    return this.$t( 'admin.correctEmail' );
                }
                if ( this.userEmailExists ) {
                    return this.$t( 'admin.userExists' );
                }
                return true;
            }
        ];
    }

    inversePasswordType() {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    }

    async checkUserEmail( email: string ) {
        if ( email === this.userData.email ) {
            return false;
        }
        if ( this.timeOut !== -1 ) {
            clearTimeout( this.timeOut );
        }
        return await new Promise<void>( ( resolve ) => {
            this.loading = true;
            this.timeOut = window.setTimeout( async () => {
                const result = await this.$axios.$get<UserExistResponse>( `/admins/check/user/${ email }` )
                    .catch( this.logError );
                this.loading = false;
                if ( result ) {
                    this.userEmailExists = result.response.exists;
                    this.$refs.form.validate();
                }
                resolve();
            }, 500 );
        } );
    }

    async checkUserLogin( login: string ) {
        if ( login === this.userData.login ) {
            return false;
        }
        if ( this.timeOut !== -1 ) {
            clearTimeout( this.timeOut );
        }
        return await new Promise<void>( ( resolve ) => {
            if ( login === this.userData.login ) {
                resolve();
            }
            this.loginLoading = true;
            this.timeOut = window.setTimeout( async () => {
                const result = await this.$axios.$get<UserExistResponse>( `/admins/check/user/${ login }` )
                    .catch( this.logError );
                this.loginLoading = false;
                if ( result ) {
                    this.userLoginExists = result.response.exists;
                    this.$refs.form.validate();
                }
                resolve();
            }, 500 );
        } );
    }

    async save() {
        const userData: SaveUserItem = {
            id: this.userData.id
        };
        if ( this.valid ) {
            if ( this.login !== this.userData.login ) {
                userData[ 'login' ] = this.login;
            }
            if ( this.email !== this.userData.email ) {
                userData[ 'email' ] = this.email;
            }
            if ( +this.block !== this.userData.block ) {
                userData[ 'block' ] = +this.block as 0 | 1;
            }
            if ( this.password.trim() !== '' ) {
                userData[ 'password' ] = this.password;
            }
            const result = await this.$axios.$post<UpdateUserResponse>( '/admins/update/user', qs.stringify( userData ) );
            if ( result ) {
                if ( result.response.update ) {
                    this.dialog = false;
                    this.$emit( 'update', result.response.update );
                }
            }
        }
    }
}
