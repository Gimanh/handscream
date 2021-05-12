import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { IAppAddLabel, IAppLabel, IAppLabels } from '@/interfaces/IApp';
import { Helper } from '@/classes/Helper';
import { Action, State } from 'vuex-class';
import { NS_GOALS } from '@/store/Types/Consts';
import { IGoalsStoreActions } from '@/store/Types/Goals/IGoalsStoreActions';

@Component
export default class TaskLabelsChips extends ZMixin {

    @Prop()
    public nestedItemId!: number;

    @Prop( { default: () => [] } )
    public selectedLabels!: IAppLabels;

    public allowDeleteLabel: boolean = false;

    public allowEditLabels: boolean = false;

    @Action( 'addNewLabelToDb', { namespace: NS_GOALS } )
    addNewLabelToDb!: IGoalsStoreActions['addNewLabelToDb'];

    @Action( 'deleteLabelFromDb', { namespace: NS_GOALS } )
    deleteLabelFromDb!: IGoalsStoreActions['deleteLabelFromDb'];

    @Action( 'updateLabelsOnNestedItem', { namespace: NS_GOALS } )
    updateLabelsOnNestedItem!: IGoalsStoreActions['updateLabelsOnNestedItem'];

    @Action( 'updateLabel', { namespace: NS_GOALS } )
    updateLabelInDB!: IGoalsStoreActions['updateLabel'];

    public select: IAppLabels = this.selectedLabels;

    public colorsCount: number = 11;

    public colors: string[] = Helper.generateColors( this.colorsCount );

    public newLabelColor: string = this.colors[ 0 ];

    public itemHeight: string = '45px';

    public showAddInput: boolean = false;

    public showAdditionalColors: boolean = true;

    public labelForEdit: IAppAddLabel | {} = {};

    get selectedLabelsIds(): { [ key: string ]: number } {
        let ids: { [ key: string ]: number } = {};
        for ( let k in this.selectedLabels ) {
            ids[ this.selectedLabels[ k ][ 'id' ] ] = this.selectedLabels[ k ][ 'id' ];
        }
        return ids;
    }

    setAllowEditLabels() {
        this.allowDeleteLabel = false;
        this.allowEditLabels = !this.allowEditLabels;
    }

    getBackgroundColorWithOpacity( hsl: string, opacity: number ) {
        return Helper.setNewAlphaToHslaString( hsl, opacity );
    }

    regenerateColors() {
        this.colors = Helper.generateColors( this.colorsCount );
        this.newLabelColor = this.colors[ 0 ];
    }

    async addNewLabel( label: IAppAddLabel ) {
        let addedLabel = await this.addNewLabelToDb( label );
        if ( !addedLabel ) {
            console.log( 'Can not add label', label );
        }
    }

    async deleteLabel( label: IAppLabel ) {
        await this.deleteLabelFromDb( label );
    }

    async inputHandler( e: IAppLabels ) {
        await this.updateLabelsOnNestedItem( {
            nestedId: this.nestedItemId,
            labels: e
        } );
        this.emitChange();
    }

    editLabel( label: IAppLabel ) {
        this.showAddInput = true;
        this.labelForEdit = label;
    }

    closeAddDialog() {
        this.labelForEdit = {};
        this.showAddInput = false;
    }

    async toggleLabel( label: IAppLabel ) {
        if ( this.selectedLabelsIds[ label.id ] ) {
            let newLabels = JSON.parse( JSON.stringify( this.selectedLabels ) );
            for ( let i = 0; i < newLabels.length; i++ ) {
                if ( newLabels[ i ].id == label.id ) {
                    newLabels.splice( i, 1 );
                    break
                }
            }
            await this.inputHandler( newLabels );
        } else {
            let newLabels = this.selectedLabels;
            newLabels.push( label );
            await this.inputHandler( newLabels );
        }
    }

    async updateLabel( label: IAppLabel ) {
        await this.updateLabelInDB( label );
        this.closeAddDialog();
    }

    emitChange() {
        this.$emit( 'change' );
    }
}
