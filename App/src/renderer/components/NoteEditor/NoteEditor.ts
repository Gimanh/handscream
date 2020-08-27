import ZMixin from '@/mixins/mixin';
import { Component, Prop } from 'vue-property-decorator';
import { NOTE_EDITOR_NIGHT } from '@/classes/IZBaseProp';
import { Action } from 'vuex-class';
import { NS_ACTIVE_TARGET } from '@/store/types';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Code,
    Italic,
    Link,
    Strike,
    Underline,
    History,
    Placeholder,
    TrailingNode,
    Table,
    TableHeader,
    TableCell,
    TableRow,
    Image
} from 'tiptap-extensions'

import NoteIcon from './NoteIcon.vue'

@Component( {
    components: {
        EditorContent, EditorMenuBar, NoteIcon
    }
} )
export default class NoteEditor extends ZMixin {

    @Prop()
    public id!: number; //note id in database

    @Prop()
    public name!: string; //display in header component

    @Prop( { default: '' } )
    public content!: string; //content from database

    @Prop()
    public expanded!: number;

    @Prop()
    public description!: string;

    @Prop( { default: false } )
    public dragEnabled!: boolean;

    @Action( 'updateHeader', { namespace: NS_ACTIVE_TARGET } ) updateHeader!: any //IRootStateMethods['updateHeader'];

    @Action( 'updateExpand', { namespace: NS_ACTIVE_TARGET } ) updateExpand!: any //IRootStateMethods['updateExpand'];

    @Action( 'deleteComponent', { namespace: NS_ACTIVE_TARGET } ) deleteComponent!: any //IRootStateMethods['deleteComponent'];

    @Action( 'updateNoteContent', { namespace: NS_ACTIVE_TARGET } ) updateNoteContent!: any //IRootStateMethods['updateNoteContent'];

    public localContent = this.content;

    private tableName: string = 'notes';

    public fullscreen: boolean = false;

    public activeEditor: boolean = false;

    public editor: any = new Editor( {
        extensions: [
            new Blockquote(),
            new BulletList(),
            new CodeBlock(),
            new HardBreak(),
            new Heading( { levels: [ 1, 2, 3 ] } ),
            new HorizontalRule(),
            new ListItem(),
            new OrderedList(),
            new TodoItem(),
            new TodoList(),
            new Link(),
            new Bold(),
            new Code(),
            new Italic(),
            new Strike(),
            new Underline(),
            new History(),
            new Placeholder( {
                emptyNodeText: '...'
            } ),
            new TrailingNode( {
                node: 'paragraph',
                notAfter: [ 'paragraph' ],
            } ),
            new Table( {
                resizable: true,
            } ),
            new TableHeader(),
            new TableCell(),
            new TableRow(),
            new Image(),
        ],
        content: this.localContent,
        onUpdate: ( { getJSON, getHTML } ) => {

            this.updateContent( getHTML() );
        },
        onFocus: () => {
            this.updateActive( true );
        },
        onBlur: () => {
            this.updateActive( false );
        }
    } );

    get containerStyles(): string {
        return NOTE_EDITOR_NIGHT + ( this.fullscreen ? ' t100 fullscreen-editor' : ' ' );
    }

    public headerUpdated( newValue: string ) {
        this.updateHeader( {
            id: this.id,
            tableName: this.tableName,
            value: newValue
        } )
    }

    public changeExpanded( status: boolean ) {
        this.updateExpand( {
            id: this.id,
            tableName: this.tableName,
            value: Number( status )
        } );
    }

    public deleteItem( itemId: number ) {
        this.deleteComponent( {
            id: itemId,
            tableName: this.tableName
        } );
    }

    public updateContent( content ) {
        this.updateNoteContent( {
            id: this.id,
            content: content
        } );
    }

    public beforeDestroy() {
        this.editor.destroy()
    }

    updateActive( active ) {
        this.activeEditor = active;
    }
}
