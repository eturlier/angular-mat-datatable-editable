import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { MatDatatableEditableComponent } from '@ui-shared/components/mat-datatable-editable/mat-datatable-editable.component';
import { UntypedFields } from '@ui-shared/models/abstract-form.model';
import { UiColumn } from '@ui-shared/models/ui-column.model';
import { EntityFormModel } from 'src/app/models/entity-form.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatDatatableEditableComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-mat-datatable-editable';

  /**
   * Liste des entitée
   */
  public entities: EntityFormModel[] = [];

  /**
   * Liste des entitées
   */
  public entitiesList$: WritableSignal<EntityFormModel[]> = signal<
    EntityFormModel[]
  >([]);

  /**
   * Liste des colonnes
   */
  public columns: UiColumn<EntityFormModel>[] = [
    new UiColumn<EntityFormModel>('is', 'COLUMNS.ID', false),
    new UiColumn<EntityFormModel>('label', 'COLUMNS.LABEL', false),
    new UiColumn<EntityFormModel>('code', 'COLUMNS.CODE'),
  ];

  ngOnInit(): void {
    // [TODO] IMPLEMENTER VOTRE CODE DE RECUPERATION DE LA LISTE ICI
    const entitiesForms = this.entities.map((e: any) => {
      const form: EntityFormModel = new EntityFormModel();
      form.updateForm(e);
      return form;
    });
    this.entitiesList$.set(entitiesForms);
  }

  /**
   * Mis à jour d'une entité
   * @param {EntityFormModel} form: Formulaire de l'entité
   * @param {boolean} withUpdateList: Mettre à jour la liste après la mise à jour de l'entité
   */
  public updateEntity(form: EntityFormModel): void {
    const initialValues = form.initialFormValuesGetter;
    if (initialValues) delete initialValues[UntypedFields.isEdited];

    // Si rien n'a changé, on ne fait rien
    if (JSON.stringify(form.value) === JSON.stringify(initialValues)) {
      form.get(UntypedFields.isEdited)?.setValue(false);
      return;
    }

    if (form.get(UntypedFields.id)?.value) {
      // [TODO] IMPLEMENTER VOTRE CODE DE MISE A JOUR ICI
      console.log('update réussi', form);
    } else {
      // [TODO] IMPLEMENTER VOTRE CODE DE CREATION ICI
      console.log('creation réussie');
    }
  }

  /**
   * Ajout d'une entitée
   */
  public addEntity(): void {
    const form: EntityFormModel = new EntityFormModel();
    const entity: any = { isEdited: true };
    form.updateForm(entity);
    this.entitiesList$.update((value: EntityFormModel[]) => [...value, form]);
  }

  /**
   * Suppression d'une entité
   * @param {EntityFormModel} form: Formulaire de l'entité
   */
  public deleteEntity(form: EntityFormModel): void {
    // [TODO] IMPLEMENTER VOTRE CODE DE MISE A JOUR ICI
    console.log('delete réussi', form);
  }
}
