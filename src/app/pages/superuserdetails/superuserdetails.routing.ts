import { Routes, RouterModule }  from '@angular/router';

import { Superuserdetails } from './superuserdetails.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Superuserdetails
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
