/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
    Component,
    InputSignal,
    Signal,
    booleanAttribute,
    computed,
    input,
    output,
    signal,
} from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FieldContainerComponent } from '@ui-shared/components/field-container/field-container.component';
import { LayoutContainerComponent } from '@ui-shared/components/layout-container/layout-container.component';
import { DataTableFormModel, DatatableFormFields } from '@ui-shared/components/mat-datatable-editable/mat-datatable-editable.model';
import { AbstractFormModel, UntypedFields } from '@ui-shared/models/abstract-form.model';
import { FormFieldDefinition, FormFieldType } from '@ui-shared/models/form-field.model';
import { UiColumn } from '@ui-shared/models/ui-column.model';
import {
    EditUiItem,
    EditUiItemDetails,
    UiItem,
} from '@ui-shared/models/ui-item.model';
import { SafePipe } from '@ui-shared/pipes/safe.pipe';

@Component({
    selector: 'app-mat-datatable-editable',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatSortModule,
        TranslateModule,
        MatButtonModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatChipsModule,
        MatIconModule,
        // Pipes
        SafePipe,
        // Composants
        FieldContainerComponent,
        LayoutContainerComponent,
    ],
  templateUrl: './mat-datatable-editable.component.html',
  styleUrls: ['./mat-datatable-editable.component.scss']
})
export class MatDatatableEditableComponent {
    /**
     * Input - Données à afficher dans le tableau
     */
    public data = input.required<any>();

    /**
     * Input - Colonnes à afficher dans le tableau
     */
    public columns = input.required<Array<UiColumn<any>>>();

    /**
     * Input - ID de la table
     */
    public tableId: InputSignal<string | undefined> = input<string>();

    /**
     * Input - Menu contextuel
     */
    public contextMenu: InputSignal<UiItem[]> = input<UiItem[]>([]);

    /**
     * Input - Indique si la datatable est en mode formulaire
     */
    public isFormDatatable = input<boolean, unknown>(false, {
        transform: booleanAttribute,
    });

    /**
     * Input - Possibilité d'ajout de ligne
     */
    public canAddRow = input<boolean, unknown>(false, {
        transform: booleanAttribute,
    });

    /**
     * Input - Titre de la datatable (clé de traduction)
     */
    public tableKeyTrad = input<string>();

    /**
     * Input - Indique si le tri est côté front
     */
    public isClientSideSorting = input<boolean, unknown>(false, {
        transform: booleanAttribute,
    });

    /**
     * Formulaire d'édition
     */
    public formGroup: DataTableFormModel = new DataTableFormModel();

    /**
     * Eléments de typage des champs du formulaire
     */
    public datatableFormFields = DatatableFormFields;
    public untypedFields = UntypedFields;

    /**
     * Boutons d'action disponible dans la section d'en-tête au dessus de la datatable
     */
    public buttons: UiItem[] = [
        {
            code_trad_label: 'COMMON.ADD',
            icon: 'add_circle_line',
            name: 'add',
            class: 'black-button',
            callback: () => this.addNewRow(),
            visible: () => this.canAddRow(),
        },
    ];

    /**
     * Menu générique en bout de ligne
     */
    public actionsMenu: Signal<UiItem[]> = computed<UiItem[]>(() => {
        const editingMenu: UiItem[] = [
            {
                ...EditUiItemDetails[EditUiItem.EDIT],
                callback: (data: any) => {
                    data.get(UntypedFields.isEdited).patchValue(true);
                },
                visible: (data: any) => !this.isEditedRow(data),
            },
            {
                ...EditUiItemDetails[EditUiItem.DELETE],
                callback: (data: any) => {
                    this.deleteRow.emit(data);
                },
                visible: (data: any) => !this.isEditedRow(data),
            },
            {
                ...EditUiItemDetails[EditUiItem.VALIDATE],
                callback: (data: any) => {
                    this.updateRow.emit(data);
                },
                visible: (data: any) => this.isEditedRow(data),
                disabled: (data: any) =>
                    !data?.valid || data?.status === 'INVALID',
            },
            {
                ...EditUiItemDetails[EditUiItem.CANCEL],
                callback: (data: any) => {
                    // Si la ligne n'a pas d'id, on demande la suppression
                    if (!data.get(UntypedFields.id)?.value) {
                        this.deleteRow.emit(data);
                    } else {
                        data.resetControlswithInitialValues();
                        data.controls[UntypedFields.isEdited].patchValue(false);
                    }
                },
                visible: (data: any) => this.isEditedRow(data),
            },
        ];

        // Ajout du systéme d'édition/suppression si la datatable est en mode formulaire
        return this.isFormDatatable()
            ? [...this.contextMenu(), ...editingMenu]
            : this.contextMenu();
    });

    /**
     * Génération des dataSources  en fonction des données reçue et du tri côté client
     */
    public dataSource: Signal<any> = computed<any>((): any => {
        let data = this.data();

        // Tri effectué sur le client uniquement si demandé
        if (this.isClientSideSorting() && this.clientSort().direction !== '') {
            data = this.data()
                .slice()
                .sort((a: any, b: any) => {
                    const valueA =
                        a instanceof AbstractFormModel
                            ? a.get(this.clientSort().active)?.value
                            : a[this.clientSort().active];
                    const valueB =
                        b instanceof AbstractFormModel
                            ? b.get(this.clientSort().active)?.value
                            : b[this.clientSort().active];

                    // [TODO] Tri sur les strings, penser à implémenter au besoin pour les autres types (numbers, dates, etc...)
                    let comparison = 0;
                    if (valueA > valueB) {
                        comparison = 1;
                    } else if (valueA < valueB) {
                        comparison = -1;
                    }
                    return this.clientSort().direction === 'asc'
                        ? comparison
                        : -comparison;
                });
        }

        // Cas d'une grille de formulaire ligne à ligne
        if (this.isFormDatatable() && data?.length > 0) {
            this.formGroup.updateForm(data);
            return new MatTableDataSource(
                (
                    this.formGroup.controls[
                        DatatableFormFields.rows
                    ] as FormArray
                ).controls
            );
        } else {
            // Cas classique d'affichage de données
            return this.data();
        }
    });

    /**
     * Evènements à passer au parent lors de l'ajout, la suppression ou la modification d'une ligne
     */
    public updateRow = output<any>();
    public deleteRow = output<any>();
    public addRow = output<void>();

    /**
     * Événement à passer au parent lors d'une demande de tri côté serveur
     */
    public sortEvent = output<Sort>();

    /**
     * Signal mis à jour lors d'une demande de tri côté client (input isClientSideSorting)
     */
    private clientSort = signal<Sort>({ active: '', direction: '' });

    /**
     * Menu d'items d'action disponible pour une ligne (filtré en fonction de la visibilité ou non de chaque item)
     * @param {any} any Data de la ligne
     * @returns {UiItem[]}
     */
    public getRowActionsMenu(data: any): UiItem[] {
        return this.actionsMenu().filter((item: UiItem) =>
            item.visible ? item.visible(data) : true
        );
    }

    /**
     * Préparation du rendu de la cellule
     * [TODO] A modifier avec des composants custom
     * @param {UiColumn<any>} column Colonne de la cellule à afficher
     * @param {any} data Données de la ligne
     * @returns {string} Contenu de la cellule
     */
    public renderContent(column: UiColumn<any>, data: any): string {
        if (column && data) {
            // Cas particulier pour les formulaires lorsqu'il n'est pas édition
            if (data instanceof AbstractFormModel && !column.formater) {
                if (
                    data.formFieldsDefinition[column.name].type ===
                    FormFieldType.BOOLEAN_SWITCH
                ) {
                    return `<span class="icon icon_medium mgc_${data.controls[column.name]?.value ? 'check_circle_fill' : 'close_circle_fill'} ${data.controls[column.name]?.value ? 'icon-success' : 'icon-danger'}"></span>`;
                } else {
                    return data.controls[column.name]?.value ?? '-';
                }
            }

            if (column.formater) {
                return column.formater(data);
            } else {
                return (
                    ((data as { [key: string]: any })[column.name] as string) ??
                    '-'
                );
            }
        }
        return '';
    }

    /**
     * Retourne la liste des noms des colonnes
     * @returns {string[]} Liste des colonnes
     */
    get columnsNames(): string[] {
        let output: string[] = [];
        if (this.columns() && this.columns().length > 0) {
            output = this.columns().map(c => c.name);
        }
        if (this.actionsMenu() && this.actionsMenu().length > 0) {
            output.push('actions');
        }
        return output;
    }

    /**
     * Action au click sur un item du menu contextuel
     * @param {UiItem} item Item du menu sur lequel on a cliqué
     * @param {any} data Données de la ligne
     */
    public doCallbackAction(item: UiItem, data: any): void {
        if (item?.callback) {
            item.callback(data);
        }
    }

    /**
     * Récupère la définition d'un champ d'une ligne particulière du formulaire
     * @param {number} i Index de la ligne
     * @param {string} columnName Nom de la colonne
     * @returns {FormFieldDefinition}
     */
    public formFieldDefinition(
        i: number,
        columnName: string
    ): FormFieldDefinition {
        return (this.formFieldControl(i) as AbstractFormModel)
            .formFieldsDefinition[columnName];
    }

    /**
     * Récupérer le formulaire d'une ligne particulière du formulaire
     * @param {number} i Index de la ligne
     * @returns {AbstractFormModel}
     */
    public formFieldControl(i: number): AbstractFormModel {
        return (this.formGroup.controls[DatatableFormFields.rows] as FormArray)
            .controls[i] as AbstractFormModel;
    }

    /**
     * Permet de savoir si une ligne est en édition
     * @param {any} form data de la ligne
     * @returns {boolean}
     */
    public isEditedRow(form: any): boolean {
        return form.get(UntypedFields.isEdited).value === true;
    }

    /**
     * Demande d'ajout d'une nouvelle ligne
     * [TODO] Vérifier qu'il n'existe pas une autre ligne vide
     */
    public addNewRow(): void {
        this.addRow.emit();
    }

    /**
     * Evenement sur le clique du tri sur l'entête du tableau
     * @param sort
     */
    public sortChange(sort: Sort): void {
        if (this.isClientSideSorting()) {
            this.clientSort.set(sort);
        } else {
            this.sortEvent.emit(sort);
        }
    }
}
