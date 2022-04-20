import { Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { getRandomColor } from '~/classes/util/Helper';
import { AddOrEditTag } from '~/classes/util/TagsTypes';
import { TagsStoreActions } from '~/store/Tags';

@Component
export default class TasksTagAdd extends AppBase {

    public dialog: boolean = true;

    public tagName: string = '';

    public color: string = '';

    public showColor: boolean = false;

    @Action( 'addTag', { namespace: 'Tags' } ) addTag!: TagsStoreActions['addTag'];

    get saveDisabled() {
        return !this.tagName;
    }

    async addNewTag() {
        if ( this.tagName ) {
            const data: AddOrEditTag = {
                name: this.tagName,
                color: this.color
            };
            const result = await this.addTag( data );
            if ( result && result.response.tag ) {
                this.closeDialog();
            }
        }
    }

    closeDialog() {
        this.$emit( 'close' );
    }

    toggleColors() {
        this.showColor = !this.showColor;
    }

    created() {
        this.color = getRandomColor();
    }
}
