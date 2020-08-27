import { Component, Prop } from 'vue-property-decorator';
import ZMixin from '@/mixins/mixin';
import { Helper } from '@/classes/Helper';
import { IAppAddLabel, IAppLabel } from '@/Interfaces/IApp';

@Component
export default class AddEditLabelDialog extends ZMixin {

    @Prop( { default: false } )
    public value!: boolean;

    @Prop( { default: '' } )
    public labelName!: string;

    @Prop( {
        default: function () {
            return {};
        }
    } )
    public label!: IAppLabel;

    public newLabelName: string = this.label.name || this.labelName;

    public defaultAdditionalColor = { r: 6, g: 255, b: 238, a: 1 };

    public additionalColor: any = this.defaultAdditionalColor;

    public showAdditionalColorInputs: boolean = false;

    get selectedColorForLabel() {
        return Helper.convertRgbaToHsla( this.additionalColor.r, this.additionalColor.g, this.additionalColor.b, this.additionalColor.a );
    }

    get hasNewLabelNameValue() {
        let value = Helper.replaceAllSpacesToOne( this.newLabelName );
        return value && value !== ' ';
    }

    get hasLabelForEdit() {
        return Object.keys( this.label ).length > 0;
    }

    saveChanges() {
        if ( this.hasNewLabelNameValue ) {
            let color = Helper.convertRgbaToHsla( this.additionalColor.r, this.additionalColor.g, this.additionalColor.b, this.additionalColor.a );
            if ( this.hasLabelForEdit ) {
                let labelEdit: IAppLabel = {
                    id: this.label.id,
                    name: this.newLabelName,
                    color: color,
                    date_creation: Helper.dateNow()
                };
                this.$emit( 'update', labelEdit );
            } else {
                let labelAdd: IAppAddLabel = {
                    name: this.newLabelName,
                    color: color,
                    date_creation: Helper.dateNow()
                };
                this.$emit( 'save', labelAdd );
            }
        }
    }

    close() {
        this.$emit( 'close' )
    }

    created() {
        if ( this.hasLabelForEdit ) {
            this.additionalColor = Helper.appHslToRgb( this.label.color, true );
        }
    }
}
