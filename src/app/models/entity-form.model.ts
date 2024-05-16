import { Validators } from '@angular/forms';
import {
    AbstractFormModel,
    UntypedFields,
} from '@ui-shared/models/abstract-form.model';
import { FormFieldType } from '@ui-shared/models/form-field.model';
import { FormErrorMessage } from '@ui-shared/models/form-message.model';
import { KeyValueObject } from '@ui-shared/models/utils.model';

export enum EntityFormFields {
    label = 'label',
    code = 'code',
}

export class EntityFormModel extends AbstractFormModel {
    /**
     * Initialisation des controles du formulaire
     */
    protected initFormControlsFields(): void {
        this.formFieldsDefinition = {
            [UntypedFields.isEdited]: {
                type: FormFieldType.HIDDEN,
                formControlName: UntypedFields.isEdited,
            },
            [UntypedFields.id]: {
                type: FormFieldType.HIDDEN,
                formControlName: UntypedFields.id,
            },
            [EntityFormFields.label]: {
                type: FormFieldType.INPUT,
                formControlName: EntityFormFields.label,
                rules: {
                    'required': true,
                    'maxLength': 60,
                },
            },
            [EntityFormFields.code]: {
                type: FormFieldType.INPUT,
                formControlName: EntityFormFields.code,
                rules: {
                        'maxLength': 30,
                        'pattern': '^[0-9]*$',
                },
            },
        };
    }

    /**
     * Initialisation des messages d'erreur sur les controles du fomulaire
     */
    protected initErrorMessages(): void {
        this.formErrorsMessages = [
            new FormErrorMessage(
                EntityFormFields.code,
                Validators.pattern.name,
                'ERRORS.PATTERN'
            ),
        ];
    }

    /**
     * Initialisation des message d'aide (hint) sur les controles du formulaire
     */
    protected initInitMessages(): void {
        this.formHintMessages = [];
    }

    /**
     * Mise à jour des données du formulaire
     * @param {User} entity : Entitée permettant la mise à jour
     */
    public updateForm(entity?: any): void {
        this.clearAllControls();

        const values = {} as KeyValueObject;

        values[UntypedFields.id] = entity?.id ?? undefined;

        values[EntityFormFields.label] = entity?.label ?? undefined;

        values[EntityFormFields.code] = entity?.agencyCode ?? undefined;

        // Initialisation de la valeur d'édition
        values[UntypedFields.isEdited] = entity?.isEdited ?? false;

        this.setFormValue(values);
    }
}
