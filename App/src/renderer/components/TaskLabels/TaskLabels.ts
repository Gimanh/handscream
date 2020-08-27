import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { IAppAddLabel, IAppLabel, IAppLabels } from '@/Interfaces/IApp';
import { Helper } from '@/classes/Helper';
import { Action, State } from 'vuex-class';
import { NS_GOALS } from '@/store/types';
import { IGoalsStoreActions, IGoalStoreState } from '@/store/IGoalsStore';

@Component
export default class TaskLabels extends ZMixin {

    @Prop()
    public nestedItemId!: number;

    @Prop( { default: () => [] } )
    public selectedLabels!: IAppLabels;

    @Action( 'addNewLabelToDb', { namespace: NS_GOALS } )
    addNewLabelToDb!: IGoalsStoreActions['addNewLabelToDb'];

    @Action( 'deleteLabelFromDb', { namespace: NS_GOALS } )
    deleteLabelFromDb!: IGoalsStoreActions['deleteLabelFromDb'];

    @Action( 'updateLabelsOnNestedItem', { namespace: NS_GOALS } )
    updateLabelsOnNestedItem!: IGoalsStoreActions['updateLabelsOnNestedItem'];

    public select: IAppLabels = this.selectedLabels;

    public newLabelName: string = '';

    public colors: string[] = Helper.generateColors( 7 );

    public newLabelColor: string = this.colors[ 0 ];

    public itemHeight: string = '45px';

    get backgroundAddItemColor() {
        return Helper.setNewAlphaToHslaString( this.newLabelColor, 0.3 );
    }

    get hasNewLabelNameValue() {
        let value = Helper.replaceAllSpacesToOne( this.newLabelName );
        return value && value !== ' ';
    }

    getBackgroundColorWithOpacity( hsl: string, opacity: number ) {
        return Helper.setNewAlphaToHslaString( hsl, opacity );
    }

    regenerateColors() {
        this.colors = Helper.generateColors( 7 );
        this.newLabelColor = this.colors[ 0 ];
    }

    selectColor( color ) {
        this.newLabelColor = color;
    }

    async addNewLabel() {
        if ( this.hasNewLabelNameValue && this.newLabelColor ) {
            let label: IAppAddLabel = {
                name: this.newLabelName,
                color: this.newLabelColor,
                date_creation: Helper.dateNow()
            };
            let addedLabel = await this.addNewLabelToDb( label );
            if ( !addedLabel ) {
                console.log( 'Can not add label', label );
            }
            this.newLabelName = '';
            this.regenerateColors();
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
    }
}
