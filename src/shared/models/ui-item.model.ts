export class UiItem {
    /**
     * Nom de l'item
     */
    name?: string;
    /**
     * Code de traduction de l'item
     */
    code_trad_label?: string;
    /**
     * Code de l'icone
     */
    icon?: string;
    /**
     * Chemin sur le clic, si chemin il y a
     */
    path?: string;
    /**
     * Indique si l'item est désactivé
     */
    disabled?: (data?: unknown) => boolean;
    /**
     * Couleur de l'item
     */
    color?: string;
    /**
     * Classe de l'item
     */
    class?: string;
    /**
     * Action de callback
     */
    callback?: (data?: unknown) => void;
    /**
     * Indique si l'item est visible ou non
     */
    visible?: (data?: unknown) => boolean;

    constructor(item: object) {
        Object.assign(this, { ...item });
    }
}

/**
 * Enumération des items d'édition pour les menus
 */
export enum EditUiItem {
    EDIT = 1,
    DELETE = 2,
    VALIDATE = 3,
    CANCEL = 4,
}

export const EditUiItemDetails = {
    [EditUiItem.EDIT]: {
        code_trad_label: 'Modifier',
        icon: 'pencil_line',
        name: 'edit',
        color: 'var(--notif-info-text)',
    },
    [EditUiItem.DELETE]: {
        code_trad_label: 'Supprimer',
        icon: 'delete_2_line',
        name: 'delete',
    },
    [EditUiItem.VALIDATE]: {
        code_trad_label: 'Valider',
        icon: 'check_fill',
        name: 'validate',
        color: 'var(--notif-info-text)',
    },
    [EditUiItem.CANCEL]: {
        code_trad_label: 'Annuler',
        icon: 'close_line',
        name: 'cancel',
        color: 'var(--notif-danger-text)',
    },
};
