import {
    FormArray,
    FormControl,
    UntypedFormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import {
    FormFieldDefinition,
    FormFieldType,
} from '@ui-shared/models/form-field.model';
import { KeyValueObject } from '@ui-shared/models/utils.model';
import { FormErrorMessage, FormHintMessage } from './form-message.model';

// Interface pour les arguments de formulaire
export interface FormArgs {
    validators: ValidatorFn | ValidatorFn[] | undefined;
}

export enum UntypedFields {
    id = 'id',
    isEdited = 'isEdited',
}

export abstract class AbstractFormModel extends UntypedFormGroup {
    /**
     * Tableau pour stocker les messages d'erreur du formulaire
     */
    protected formErrorsMessages: Array<FormErrorMessage> = [];

    /**
     * Tableau pour stocker les messages d'aide du formulaire
     */
    protected formHintMessages: Array<FormHintMessage> = [];

    /**
     * Tableau pour stocker les définition des champs du formulaire
     */
    public formFieldsDefinition: {
        [key in string]: FormFieldDefinition;
    } = {};

    /**
     * Valeurs initiales du formulaire (mise à jour lors d'un appel setFormValue)
     */
    protected initialFormValues: KeyValueObject | undefined;
    public get initialFormValuesGetter(): KeyValueObject | undefined {
        return this.initialFormValues;
    }

    constructor(args?: FormArgs) {
        super({}, args?.validators);
        // Initialisation des contrôles, des messages d'erreur et des messages d'indice
        this.initFormControlsFields();
        this.initControls();
        this.initErrorMessages();
        this.initInitMessages();
    }

    /**
     * Méthode pour obtenir les messages d'erreur d'un contrôle de formulaire spécifique
     * @param {string} formControlName : Nom du contrôle de formulaire
     * @returns {Array<{ translate: string; translateParams?: object }> | undefined}
     */
    public getErrorMessages(
        formControlName: string
    ): Array<{ translate: string; translateParams?: object }> | undefined {
        const result: Array<{
            translate: string;
            translateParams?: object;
        }> = [];
        if (
            !!this.controls[formControlName] &&
            this.controls[formControlName].invalid
        ) {
            const formControlNameMessages = this.formErrorsMessages
                .filter(message => message.formControlName === formControlName)
                .filter(message =>
                    this.controls[formControlName].hasError(message.type)
                );
            formControlNameMessages.forEach(message =>
                result.push({
                    translate: message.translate,
                    translateParams: message.translateParams,
                })
            );
        }
        return result;
    }

    /**
     * Méthode pour obtenir le message d'aide d'un contrôle de formulaire spécifique
     * @param {string} formControlName : Nom du contrôle de formulaire
     * @returns {{ translate: string; translateParams?: object } | undefined}
     */
    public getHintMessage(
        formControlName: string
    ): { translate: string; translateParams?: object } | undefined {
        const formControlNameMessage = this.formHintMessages.find(
            message => message.formControlName === formControlName
        );
        if (formControlNameMessage) {
            return {
                translate: formControlNameMessage.translate,
                translateParams: formControlNameMessage.translateParams,
            };
        } else {
            return undefined;
        }
    }

    /**
     * Méthode pour effacer un contrôle de formulaire spécifique
     * @param {string} formControlName : Nom du contrôle de formulaire
     */
    public clearControl(formControlName: string): void {
        const control = this.controls[formControlName];
        if (control) {
            control instanceof FormArray
                ? control.clear()
                : control.setValue(null);
            control.updateValueAndValidity();
        }
    }

    /**
     * Méthode pour effacer tous les contrôles du formulaire
     */
    public clearAllControls(): void {
        Object.keys(this.controls).forEach(controlName => {
            this.clearControl(controlName);
        });
    }

    /**
     * Méthode pour remettre les contrôles du formulaire avec leur valeur initiale
     */
    public resetControlswithInitialValues(): void {
        Object.keys(this.controls).forEach(controlName => {
            const control = this.controls[controlName];
            if (control) {
                control instanceof FormArray
                    ? control.clear()
                    : control.setValue(null);
                if (this.initialFormValues) {
                    control.setValue(this.initialFormValues[controlName]);
                }
                control.updateValueAndValidity();
            }
        });
    }

    /**
     * Méthode pour initialiser les contrôles du formulaire
     */
    protected initControls(): void {
        Object.keys(this.formFieldsDefinition).forEach((key: string) => {
            const field = this.formFieldsDefinition[key];
            const isFormArray = field.type === FormFieldType.FORM_ARRAY;
            this.addControl(
                key,
                isFormArray
                    ? new FormArray([], {
                          validators: field.rules
                              ? this.addValidatorsToControl(field.rules)
                              : [],
                      })
                    : new FormControl(field.initialValue, {
                          validators: field.rules
                              ? this.addValidatorsToControl(field.rules)
                              : [],
                      })
            );
        });
    }

    /**
     * Méthode pour mettre à jour les valeurs du formulaire
     * @param {KeyValueObject} values : Valeurs à mettre à jour
     */
    protected setFormValue(values: KeyValueObject): void {
        this.initialFormValues = values;
        this.patchValue(values);
    }

    /**
     * Méthode pour mettre à jour les validteurs d'un contrôle du formulaire
     * @param rules
     * @returns
     */
    private addValidatorsToControl(rules?: object): ValidatorFn[] | null {
        if (!rules) {
            return null;
        }

        return Object.keys(rules)
            .map(rule => {
                switch (rule) {
                    case 'required':
                        return Validators.required;
                    case 'maxLength':
                        return Validators.maxLength(
                            (rules as { maxLength: number })[rule]
                        );
                    case 'minLength':
                        return Validators.minLength(
                            (rules as { minLength: number })[rule]
                        );
                    case 'pattern':
                        return Validators.pattern(
                            (rules as { pattern: string })[rule]
                        );
                    default:
                        return null;
                }
            })
            .filter(v => v !== null) as ValidatorFn[];
    }

    // Méthodes abstraites à implémenter dans les classes filles
    /**
     * Méthode pour récupérer les champs de contrôles du formulaire
     */
    protected abstract initFormControlsFields(): void;

    /**
     * Méthode pour initialiser les messages d'erreur du formulaire
     */
    protected abstract initErrorMessages(): void;

    /**
     * Méthode pour initialiser les messages d'indice du formulaire
     */
    protected abstract initInitMessages(): void;

    /**
     * Méthode pour mettre à jour le formulaire
     */
    public abstract updateForm(entity?: unknown): void;

}
