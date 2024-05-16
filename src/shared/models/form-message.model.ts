/**
 * Définition de la classe FormErrorMessage qui permet de définir un message d'erreur pour un champ de formulaire
 */
export class FormErrorMessage {
    public formControlName: string;
    public type: string;
    public translate: string;
    public translateParams?: object;

    constructor(
        formControlName: string,
        type: string,
        translate: string,
        translateParams?: object
    ) {
        this.formControlName = formControlName;
        this.type = type;
        this.translate = translate;
        this.translateParams = translateParams;
    }
}

/**
 * Définition de la classe FormHintMessage qui permet de définir un message d'aide pour un champ de formulaire
 */
export class FormHintMessage {
    public formControlName: string;
    public translate: string;
    public translateParams?: object;

    constructor(
        formControlName: string,
        translate: string,
        translateParams?: object
    ) {
        this.formControlName = formControlName;
        this.translate = translate;
        this.translateParams = translateParams;
    }
}
