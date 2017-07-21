import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule' },
      { path: 'projectdetails/:id', loadChildren: 'app/pages/projectdetails/projectdetails.module#ProjectDetailsModule' },
      { path: 'profile', loadChildren: 'app/pages/profile/profile.module#ProfileModule' },
      { path: 'editors', loadChildren: 'app/pages/editors/editors.module#EditorsModule' },
      { path: 'components', loadChildren: 'app/pages/components/components.module#ComponentsModule' },
      { path: 'charts', loadChildren: 'app/pages/charts/charts.module#ChartsModule' },
      { path: 'ui', loadChildren: 'app/pages/ui/ui.module#UiModule' },
      { path: 'forms', loadChildren: 'app/pages/forms/forms.module#FormsModule' },
      { path: 'tables', loadChildren: 'app/pages/tables/tables.module#TablesModule' },
      { path: 'maps', loadChildren: 'app/pages/maps/maps.module#MapsModule' },
      { path: 'adminpage', loadChildren: 'app/pages/admin/admin.module#AdminModule' },
      { path: 'superuserpage', loadChildren: 'app/pages/superuser/superuser.module#SuperuserModule' },
      { path: 'superuserdetails/:id', loadChildren: 'app/pages/superuserdetails/superuserdetails.module#SuperuserdetailsModule' },
      { path: 'partnerdetails/:sid/:pid', loadChildren: 'app/pages/partnerdetails/partnerdetails.module#PartnerdetailsModule' },
      { path: 'donatecoins', loadChildren: 'app/pages/donatecoins/donatecoins.module#DonatecoinsModule' },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
