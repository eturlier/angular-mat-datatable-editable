import { registerLocaleData } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import localeFrExtra from "@angular/common/locales/extra/fr";
import localeFr from "@angular/common/locales/fr";
import { importProvidersFrom } from "@angular/core";
import { TranslateLoader, TranslateModule, TranslateModuleConfig } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

registerLocaleData(localeFr, 'fr-FR', localeFrExtra);

function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const config: TranslateModuleConfig = {
        defaultLanguage: 'fr',
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
        }
};

export function provideTranslation() {
        return importProvidersFrom([
                HttpClientModule,
                TranslateModule.forRoot(config),
    ]);
}