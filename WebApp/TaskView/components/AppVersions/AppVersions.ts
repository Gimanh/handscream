import { Component } from 'vue-property-decorator';
import AppBase from '~/components/AppBase';
import { AppResponse, AppVersionsData } from '~/classes/util/AppTypes';

@Component
export default class AppVersions extends AppBase {

    public dialog: boolean = false;

    public items: AppVersionsData = {};

    public url: string = '/module/about/versions';

    get about(): string {
        return this.$t( 'msg.about' ) as string;
    }

    get closeTitle(): string {
        return this.$t( 'msg.close' ) as string;
    }

    async created(): Promise<void> {
        await this.fetchData();
    }

    getDateFormat( date: string ): string {
        const instance = new Date( date );
        const month = instance.getMonth() + 1;
        return `${ instance.getDate() }-${ month < 10 ? '0' : '' }${ month }-${ instance.getFullYear() }`;
    }

    async fetchData(): Promise<void> {
        const result = await this.$axios.$get<AppResponse<AppVersionsData>>( this.url ).catch( this.logError );
        if ( result ) {
            this.items = result.response;
        }
    }
}
