import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { KeyValueObject } from '@ui-shared/models/utils.model';

@Pipe({
    name: 'translateParams',
    standalone: true,
})
export class TranslateParamsPipe implements PipeTransform {
    constructor(private translate: TranslateService) {}

    transform(values?: object): object | undefined | KeyValueObject {
        const result = values;
        if (typeof values === 'object') {
            const newValues = {} as KeyValueObject;
            Object.entries(values).forEach(([key, value]) => {
                newValues[key] = this.translate.instant(value);
            });
            return newValues;
        }
        return result;
    }
}
