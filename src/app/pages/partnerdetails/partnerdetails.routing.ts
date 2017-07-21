import { Routes, RouterModule }  from '@angular/router';

import { Partnerdetails } from './partnerdetails.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Partnerdetails
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
