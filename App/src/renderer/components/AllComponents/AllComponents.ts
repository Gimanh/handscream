import ZMixin from '@/mixins/mixin';
import { Component, Prop } from 'vue-property-decorator';
import { State, Action } from 'vuex-class'
import { NS_ACTIVE_TARGET } from '@/store/types';
import { AvailableComponent, ParentInfo } from '@/classes/IZDatabase';

@Component
export default class AllComponents extends ZMixin {

    @Prop()
    public parentInfo!: ParentInfo;

    @Prop( { default: false } )
    public disabled!: boolean;

    @State( state => state[ NS_ACTIVE_TARGET ].availableComponents ) items!: AvailableComponent[];

    @Action( 'addComponent', { namespace: NS_ACTIVE_TARGET } ) addComponent!: any //IRootStateMethods['addComponent'];


    selectComponent( componentName: AvailableComponent['componentName'] ) {
        this.addComponent( {
            parentId: this.parentInfo.id,
            parentType: this.parentInfo.type,
            componentName: componentName,
            props: null
        } );
    }
}
