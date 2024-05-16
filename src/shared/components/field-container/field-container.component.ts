import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractFormModel } from '@ui-shared/models/abstract-form.model';
import {
  FormFieldDefinition,
  FormFieldType,
} from '@ui-shared/models/form-field.model';
import { TranslateParamsPipe } from '@ui-shared/pipes/translate-params.pipe';
import { CustomErrorStateMatcher } from "@ui-shared/utils/custom-error-state-matcher";
@Component({
    selector: 'app-field-container',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        TranslateParamsPipe,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './field-container.component.html',
    styleUrls: ['./field-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldContainerComponent {
    /**
     * Définition du champ
     */
    public field = input.required<FormFieldDefinition>();

    /**
     * Label du champ (clé de traduction)
     */
    public keyTradLabel = input<string>();

    /**
     * Formulaire parent
     */
    public formGroup = input.required<AbstractFormModel>();

    /**
     * Index du champ
     */
    public fieldIndex = input.required<number | string>();

    /**
     * Champ en lecture seule
     */
    public readonly = input<boolean>(false);

    /**
     * Indique si le champ se trouve dans un tableau (pour le style)
     */
    public isInTable = input(false, { transform: booleanAttribute });

    /**
     * Type de champs possibles
     */
    public FieldContainerType = FormFieldType;

    /**
     * Détection des erreurs de champs en cour de saisie
     * */
    public errorStateMatcher = new CustomErrorStateMatcher();
}
