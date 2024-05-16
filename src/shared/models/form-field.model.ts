/**
 * Définition de la classe FormFieldDefinition qui permet de fournir une définition de champ de formulaire
 */
export class FormFieldDefinition {
    public type: FormFieldType;
    public formControlName: string;
    public initialValue?: unknown;
    public rules?: object;

    constructor(
        type: FormFieldType,
        formControlName: string,
        initialValue?: unknown,
        rules?: object
    ) {
        this.type = type;
        this.formControlName = formControlName;
        this.initialValue = initialValue ?? null;
        this.rules = rules;
    }
}

/**
 * Enumération des types de champs de formulaire
 */
export enum FormFieldType {
    INPUT, // Champ de saisie
    DATE, // Champ de date
    SELECT, // Champ de sélection
    HIDDEN, // Champ caché
    FORM_ARRAY, // Tableau de formulaire
    BOOLEAN_SWITCH, // Interrupteur booléen
}
