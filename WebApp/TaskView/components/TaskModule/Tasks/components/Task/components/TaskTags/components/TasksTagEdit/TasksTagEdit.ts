import { Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AppBase from '~/components/AppBase';
import { AddTag, TagItem, TagItemUpdate } from '~/classes/util/TagsTypes';
import { TagsStoreActions } from '~/store/Tags';

@Component
export default class TasksTagEdit extends AppBase {

    @Prop( {
        default: () => {
        }
    } )
    public tag!: TagItem;

    public dialog: boolean = true;

    public tagName: string = this.tag.name;

    public color: string = this.tag.color;

    public showColor: boolean = false;

    @Action( 'updateTag', { namespace: 'Tags' } ) updateTag!: TagsStoreActions['updateTag'];

    get saveDisabled() {
        return this.tagName === this.tag.name && this.color === this.tag.color;
    }

    async updateTagHandler() {
        if ( this.tagName ) {
            const data: TagItemUpdate = {
                id: this.tag.id,
                name: this.tagName,
                color: this.color
            };
            await this.updateTag( data );
            this.closeDialog();
        }
    }

    closeDialog() {
        this.$emit( 'close' );
    }

    toggleColors() {
        this.showColor = !this.showColor;
    }
}
