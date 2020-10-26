import { Component, Prop, Vue } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { Helper } from '@/classes/Helper';
import { IGoal } from '@/interfaces/IApp';

@Component
export default class GoalForm extends ZMixin {

    @Prop( {
        default: function () {
            return {};
        }
    } )
    public goal!: IGoal;

    @Prop( { default: true } )
    public editMode!: boolean;

    public name: string = this.goal.name || '';

    public description: string = this.goal.description || '';

    public color: string = this.goal.color || '';

    public colorItems: string[] = [];

    public colorItemsCount: number = 14;

    $refs!: {
        form: any
        nameField: HTMLElement
    };

    created() {
        this.generateColors();
    }

    mounted() {
        if ( this.$refs.nameField ) {
            this.$nextTick( () => {
                this.$refs.nameField.focus()
            } );
        }
    }

    generateColors() {
        this.colorItems = [];
        for ( let i = this.colorItemsCount; i--; ) {
            let color: string = Helper.generateColor();
            this.colorItems.push( color )
        }
        if ( this.editMode ) {
            if ( this.color ) {
                this.colorItems[ 0 ] = this.color;
            }
        }
        this.color = this.colorItems[ 0 ];
    }

    selectedColor( color: string ) {
        this.color = color;
    }

    close() {
        this.name = '';
        this.description = '';
        this.color = '';
        this.$emit( 'cancelForm' );
    }

    save() {
        let valid = this.$refs.form.validate();
        if ( valid ) {
            this.$emit( 'saveForm', {
                name: this.name,
                description: this.description,
                color: this.color
            } );
        }
    }
}
