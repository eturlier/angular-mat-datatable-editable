import { FormArray } from '@angular/forms';
import { AbstractFormModel } from '@ui-shared/models/abstract-form.model';
import { FormFieldType } from '@ui-shared/models/form-field.model';

export enum DatatableFormFields {
    rows = 'rows',
}
export class DataTableFormModel extends AbstractFormModel {
    /**
     * Initialisation des controles du formulaire
     */
    protected initFormControlsFields(): void {
        this.formFieldsDefinition = {
            [DatatableFormFields.rows]: {
                type: FormFieldType.FORM_ARRAY,
                formControlName: DatatableFormFields.rows,
            },
        };
    }

    /**
     * Initialisation des messages d'erreur sur les controles du fomulaire
     */
    protected initErrorMessages(): void {
        this.formErrorsMessages = [];
    }

    /**
     * Initialisation des message d'aide (hint) sur les controles du formulaire
     */
    protected initInitMessages(): void {
        this.formHintMessages = [];
    }

    /**
     * Mise à jour des données du formulaire
     * @param {AbstractFormModel[]} rowsForms : Liste de formulaire permettant la mise à jour
     */
    public updateForm(rowsForms?: AbstractFormModel[]): void {
        this.clearAllControls();

        const rows = this.controls[DatatableFormFields.rows] as FormArray;

        rowsForms?.forEach(rowForm => {
            rows.push(rowForm);
        });
    }

    /**
     * Transformation du formulaire en entitée
     * Non utilisée pour le cas du DataTableFormModel (elle sert de passe plat)
     */
    public transformToEntity(): void {
        throw new Error('Method not implemented.');
    }
}
