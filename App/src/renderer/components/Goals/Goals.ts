import { Component } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { State, Action } from 'vuex-class';
import { NS_GOALS } from '@/store/types';
import { IGoal } from '@/Interfaces/IApp';
import { IArgUpdateArchiveGoalStatus, IGoalsStoreActions } from '@/store/IGoalsStore';
import { Helper } from '@/classes/Helper';

@Component
export default class Goals extends ZMixin {

    @State( state => state[ NS_GOALS ].goals ) goals!: IGoal[];

    @Action( 'deleteGoal', { namespace: NS_GOALS } )
    deleteGoalAction!: IGoalsStoreActions['deleteGoal'];

    @Action( 'setArchiveGoalStatus', { namespace: NS_GOALS } )
    setArchiveGoalStatus!: IGoalsStoreActions['setArchiveGoalStatus'];

    @Action( 'updateGoalsOrder', { namespace: NS_GOALS } )
    updateGoalsOrder!: IGoalsStoreActions['updateGoalsOrder'];

    public activeActions: number | null = null;

    public showArchive: boolean = false;

    public listModel: number = -1;

    public editingGoal: IGoal | null = null;

    public fab: boolean = false;

    async archiveGoal( options: IArgUpdateArchiveGoalStatus ) {
        await this.setArchiveGoalStatus( options );
        let goal = this.getCurrentActiveGoal();
        if ( goal ) {
            if ( Number( goal.id ) === Number( options.goalId ) ) {
                this.goToLocalUserPage();
            }
        }
    }

    toggleArchived() {
        this.showArchive = !this.showArchive;
        if ( !this.showArchive ) {
            let goal = this.getCurrentActiveGoal();
            if ( goal ) {
                if ( goal.archive ) {
                    this.goToLocalUserPage();
                }
            }
        }
    }

    getCurrentActiveGoal(): IGoal | null {
        for ( let k in this.goals ) {
            if ( Number( this.goals[ k ].id ) === Number( this.$route.params.id ) ) {
                return this.goals[ k ];
            }
        }
        return null;
    }

    canShowGoal( goal: IGoal ) {
        if ( goal.archive && this.allowSort ) {
            return false;
        }
        return !( goal.archive && !this.showArchive );
    }

    showMoreActions( id: number ) {
        if ( this.activeActions === id ) {
            this.activeActions = null;
        } else {
            this.activeActions = id;
        }
    }

    getStyleBorderForGoal( goal: IGoal ) {
        if ( Number( this.$route.params.id ) === Number( goal.id ) ) {
            let color = Helper.appHslToRgb( goal.color );
            return {
                'border-left-color': color,
                'border-left-style': 'solid',
                'border-left-width': '12px'
            }
        }
        return undefined;
    }

    get sortedGoals() {
        let nI = JSON.parse( JSON.stringify( this.goals ) );
        nI.sort( ( a, b ) => {

            if ( a.archive && !b.archive ) {
                return -1;
            }
            if ( b.archive && !a.archive ) {
                return 1;
            }
            if ( b.archive && a.archive ) {
                return 0;
            }

            if ( a.order_key < b.order_key ) {
                return -1;
            }
            if ( a.order_key > b.order_key ) {
                return 1;
            }
            return 0;
        } );
        return nI;
    }

    set sortedGoals( value: IGoal[] ) {
        let items: { id: number, orderKey: number }[] = [];
        for ( let k in value ) {
            items.push( {
                id: Number( value[ k ].id ),
                orderKey: Number( k ) + 1
            } )
        }
        this.updateGoalsOrder( items );
    }

    htmlEscape( value ) {
        let lt = /</g,
            gt = />/g,
            ap = /'/g,
            ic = /"/g;
        value = value.toString().replace( lt, '&lt;' ).replace( gt, '&gt;' ).replace( ap, '&#39;' ).replace( ic, '&#34;' );
        return value;
    }

    convertDescription( value ) {
        return this.htmlEscape( value ).split( '\n' ).join( '<br/>' );
    }

    async deleteGoal( id, goal: IGoal ) {
        await this.deleteGoalAction( goal );
        this.goToLocalUserPage();
    }

    editGoal( id, goal: IGoal ) {
        this.editingGoal = goal;
    }

    editingEnd() {
        this.editingGoal = null;
    }
}
