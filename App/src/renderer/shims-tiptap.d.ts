declare module 'tiptap' {
    import {Vue} from 'vue/types/vue'

    export class Extension {
        constructor(...arg: any[])

        [key: string]: any
    }

    export class Editor {
        constructor(...arg: any[])

        [key: string]: any
    }

    export class EditorMenuBubble extends Vue {
        [key: string]: any
    }

    export class EditorContent extends Vue {
        [key: string]: any
    }

    export class EditorMenuBar extends Vue {
        [key: string]: any
    }

    export class EditorFloatingMenu extends Vue {
        [key: string]: any
    }
}
