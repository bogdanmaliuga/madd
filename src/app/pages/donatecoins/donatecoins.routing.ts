import { Routes, RouterModule }  from '@angular/router';

import { Donatecoins } from './donatecoins.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Donatecoins
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
