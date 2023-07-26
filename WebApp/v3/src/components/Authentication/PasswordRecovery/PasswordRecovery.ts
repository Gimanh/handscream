import { defineComponent } from 'vue';
import qs from 'qs';

import { mdiArrowLeft } from '@mdi/js';
import type { FormFieldRules, RecoveryRequestResponse } from '@/helpers/AppTypes';
export default defineComponent( {
    data() {
        return {
            url: '/module/auth/email/recovery',
            email: '',
            valid: false,
            emailSent: false,
            sent: false,
            mdiArrowLeft
        }
    },
    computed: {
        emailLabel(): string {
            return this.$t( 'msg.email' ) as string;
        },
        emailRule(): FormFieldRules {
            return [
                ( email: string ) => {
                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test( String( email ).toLowerCase() ) || this.$t( 'msg.requiredField' ) as string;
                }
            ];
        },
        alertInfo(): string {
            return this.sent ? this.$t( 'msg.checkEmail' ) as string : this.$t( 'msg.sendRecoveryEmailError' ) as string;
        },
        alertType(): 'info' | 'warning' {
            return this.sent ? 'info' : 'warning';
        },
    },
    methods: {
        emitCancel(): void {
            this.$emit( 'cancelRecovery' );
        },
        showInfo() {
            this.emailSent = true;
            setTimeout( () => {
                this.emailSent = false;
                this.emitCancel();
            }, this.sent ? 2000 : 3000 );
        },
        async submit(): Promise<void> {
            if ( this.$refs.form.validate() ) {
                const result = await this.$axios.post<RecoveryRequestResponse>( this.url, qs.stringify( { email: this.email } ) )
                    .catch( ( err ) => console.log( err ) );
                if ( result ) {
                    this.sent = result.data.sent;
                    this.showInfo();
                }
            }

        }
    }
} );
