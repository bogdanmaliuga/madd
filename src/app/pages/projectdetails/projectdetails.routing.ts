import { Routes, RouterModule }  from '@angular/router';

import { ProjectDetails } from './projectdetails.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ProjectDetails
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
