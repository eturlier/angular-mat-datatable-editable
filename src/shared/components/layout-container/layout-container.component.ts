import { CommonModule } from '@angular/common';
import { Component, InputSignal, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { UiItem } from '@ui-shared/models/ui-item.model';

@Component({
    selector: 'app-layout-container',
    standalone: true,
    imports: [CommonModule, MatButtonModule, TranslateModule, MatIconModule],
    templateUrl: './layout-container.component.html',
    styleUrl: './layout-container.component.scss',
})
export class LayoutContainerComponent {
    /**
     * Input - Boutton d'action disponible dans l'en-tête
     */
    public buttons: InputSignal<UiItem[]> = input<UiItem[]>([]);

    /**
     * Action au click sur un boutton
     * @param {UiItem} button Item du menu sur lequel on a cliqué
     */
    public doCallbackAction(button: UiItem): void {
        if (button?.callback) {
            button.callback();
        }
    }
}
