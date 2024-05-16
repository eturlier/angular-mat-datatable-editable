export class UiColumn<T> {
    /**
     * Nom de la colonne (identifiant unique)
     */
    name: string;
    /**
     * Code de traduction de la colonne
     */
    code_trad_label: string;
    /**
     * Filtre possible sur la colonne
     */
    filter: boolean;
    /**
     * Tri possible sur la colonne
     */
    sort: boolean;
    /**
     * Classe de la colonne
     */
    class?: string;
    /**
     * Formateur de la donnée
     */
    formater?: { (content: T): string };

    constructor(
        protected _name: string,
        protected _code_trad_label: string,
        protected _filter?: boolean,
        protected _sort?: boolean,
        protected _class?: string,
        protected _formater?: { (content: T): string }
    ) {
        this.name = _name;
        this.code_trad_label = _code_trad_label;
        this.filter = _filter ?? true;
        this.sort = _sort ?? true;
        this.class = _class;
        this.formater = _formater;
    }
}
