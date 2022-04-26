import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { Store } from 'vuex';
import qs from 'qs';
import {
    AddTagResponse, DeleteTagResponse, EditTagResponse,
    TagItem,
    TagItemAdd,
    TagItems, TagItemUpdate,
    TagsResponse,
    TagStoreStateUrls, ToggleTagArg, ToggleTagResponse
} from '~/classes/util/TagsTypes';

export class TagsState {
    public urls: TagStoreStateUrls = {
        addTag: '/module/tags/add',
        fetchTags: '/module/tags/fetch',
        toggleTag: '/module/tags/toggle',
        deleteTag: '/module/tags/delete',
        updateTag: '/module/tags/update'
    }

    public tags: TagItems = []
}

export class TagsMutations extends Mutations<TagsState> {
    addTag( tag: TagItem ) {
        this.state.tags.push( tag );
    }

    updateTag( tag: TagItem ) {
        for ( const k of this.state.tags ) {
            if ( +k.id === +tag.id ) {
                k.color = tag.color;
                k.name = tag.name;
            }
        }
    }

    setTags( tags: TagItems ) {
        this.state.tags = tags;
    }

    deleteTag( tag: TagItem ) {
        const index = this.state.tags.findIndex( function ( value ) {
            return value.id === tag.id;
        } );
        if ( index !== -1 ) {
            this.state.tags.splice( index, 1 );
        }
    }
}

export class TagsStoreGetters extends Getters<TagsState> {

}

export class TagsStoreActions extends Actions<TagsState, TagsStoreGetters, TagsMutations, TagsStoreActions> {

    private store!: Store<any>

    $init( store: Store<any> ) {
        this.store = store;
    }

    async addTag( tag: TagItemAdd ): Promise<AddTagResponse | void> {
        const result = await this.store.$axios.$post<AddTagResponse>( this.state.urls.addTag, qs.stringify( tag ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.tag ) {
                this.mutations.addTag( result.response.tag );
            }
        }
        return result;
    }

    async fetchTags(): Promise<TagsResponse | void> {
        const result = await this.store.$axios.$get<TagsResponse>( this.state.urls.fetchTags )
            .catch( err => console.log( err ) );
        if ( result ) {
            this.mutations.setTags( result.response );
        }
        return result;
    }

    async toggleTagForTask( data: ToggleTagArg ): Promise<ToggleTagResponse | void> {
        return await this.store.$axios.$post<ToggleTagResponse>( this.state.urls.toggleTag, qs.stringify( data ) )
            .catch( err => console.log( err ) );
    }

    async deleteTag( tag: TagItem ): Promise<DeleteTagResponse | void> {
        const result = await this.store.$axios.$post<DeleteTagResponse>( this.state.urls.deleteTag, qs.stringify( { tagId: tag.id } ) )
            .catch( err => console.log( err ) );
        this.store.commit( 'Tasks/deleteTagFromAllTasks', tag );
        if ( result ) {
            if ( result.response.delete ) {
                this.mutations.deleteTag( tag );
            }
        }
        return result;
    }

    async updateTag( tag: TagItemUpdate ): Promise<EditTagResponse | void> {
        const result = await this.store.$axios.$post<EditTagResponse>( this.state.urls.updateTag, qs.stringify( tag ) )
            .catch( err => console.log( err ) );
        if ( result ) {
            if ( result.response.tag ) {
                this.mutations.updateTag( result.response.tag );
            }
        }
        return result;
    }
}

const module = new Module( {
    state: TagsState,
    getters: TagsStoreGetters,
    mutations: TagsMutations,
    actions: TagsStoreActions
} );
export { module as Tags };
export default module;
