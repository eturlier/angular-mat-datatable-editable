import { Routes } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

export const routes: Routes = [
    {
        path: 'home',
        component: AppComponent,
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
    },
];
