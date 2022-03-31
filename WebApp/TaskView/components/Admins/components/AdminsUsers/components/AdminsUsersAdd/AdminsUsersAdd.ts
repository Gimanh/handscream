import { Component, Prop } from 'vue-property-decorator';
import qs from 'qs';
import { passwordStrength } from 'check-password-strength';
import AppBase from '~/components/AppBase';
import { isEmail, validLogin } from '~/classes/util/Helper';
import { AddUserItem, AddUserResponse, UserExistResponse, UserItem } from '~/components/Admins/Types';
import { FormFieldRules } from '~/classes/util/AppTypes';

@Component
export default class AdminsUsersAdd extends AppBase {

    @Prop( { default: false } )
    public disabled!: boolean;

    public valid: boolean = false;

    public dialog: boolean = false;

    public login: UserItem['login'] = '';

    public email: UserItem['email'] = '';

    public block: boolean = false;

    private userEmailExists: boolean = false;

    private userLoginExists: boolean = false;

    public $refs!: {
        form: any
    };

    public timeOut: number = -1;

    public loginLoading: boolean = false;

    public password: string = '';

    public passwordType: 'password' | 'text' = 'password';

    get passwordIcon() {
        return this.passwordType === 'password' ? 'mdi-eye' : 'mdi-eye-off';
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

    get credentialsRules(): FormFieldRules {
        return [
            ( v: string ) => !!v || this.$t( 'msg.requiredField' ) as string,
            ( v: string ) => {
                const result = passwordStrength<'Strong' | 'Medium' | 'Weak' | 'Too weak'>( v );
                return ( result.value === 'Strong' || result.value === 'Medium' ) || this.$t( 'msg.passwordStrength' ) as string;
            }
        ];
    }

    cancel() {
        this.dialog = false;
        this.login = '';
        this.email = '';
        this.block = false;
    }

    async checkUserEmail( email: string ) {
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
        if ( this.timeOut !== -1 ) {
            clearTimeout( this.timeOut );
        }
        return await new Promise<void>( ( resolve ) => {
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

    inversePasswordType() {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    }

    async save() {
        if ( this.valid ) {
            const userData: AddUserItem = {
                login: this.login,
                email: this.email,
                block: +this.block as 0 | 1,
                password: this.password
            };
            const result = await this.$axios.$post<AddUserResponse>( '/admins/add/user', qs.stringify( userData ) )
                .catch( this.logError );
            if ( result ) {
                if ( result.response.add ) {
                    this.$emit( 'add', result.response.add );
                    this.dialog = false;
                }
            }
        }
    }
}
