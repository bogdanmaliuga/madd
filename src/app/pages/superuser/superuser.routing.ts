import { Routes, RouterModule }  from '@angular/router';

import { Superuser } from './superuser.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Superuser
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
