import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import {authGuard} from './core/guards/auth.guard'
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./modules/home/home.module').then((m) => m.HomeModule),
        canActivate:[authGuard]
      },
      {
        path: 'quotations',
        loadChildren: () =>
          import('./modules/quotations/quotations.module').then((m) => m.QuotationsModule),
          canActivate:[authGuard]
      },
      {
        path: 'production-requests',
        loadChildren: () =>
          import('./modules/production-requests/production-requests.module').then((m) => m.ProductionRequestsModule),
          canActivate:[authGuard]
      },
      {
        path: 'reception-report',
        loadChildren: () =>
          import('./modules/reception-report/reception-report.module').then((m) => m.ReceptionReportModule),
          canActivate:[authGuard]
      },
      {
        path: 'client-payment',
        loadChildren: () =>
          import('./modules/client-payment/client-payment.module').then((m) => m.ClientPaymentModule),
          canActivate:[authGuard]
      },
      {
        path: 'top',
        loadChildren: () =>
          import('./modules/top/top.module').then((m)=>m.TopModule),
          canActivate:[authGuard]
      },
      {
        path: 'contract',
        loadChildren: () =>
          import('./modules/contract/contract.module').then((m) => m.ContractModule),
          canActivate:[authGuard]
      },
      {
      path: 'follows',
      loadChildren: () =>
        import('./modules/follows/follows.module').then((m)=>m.FollowsModule),
        canActivate:[authGuard]
    },
      {
        path: 'clients',
        loadChildren: () =>
          import('./modules/clients/clients.module').then((m) => m.ClientsModule),
          canActivate:[authGuard]
      },
      {
        path: 'sanitaryConnections',
        loadChildren: () =>
          import('./modules/sanitary-connections/sanitary-connections.module').then((m)=>m.SanitaryConnectionsModule),
          canActivate:[authGuard]
      },
      {
        path: 'reports',
        loadChildren:()=>
          import('./modules/reports/reports.module').then((m)=>m.ReportsModule),
          canActivate:[authGuard]
      },

      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.module').then((m)=>m.UsersModule),
          canActivate:[authGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate:[authGuard]
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/theme.module').then((m) => m.ThemeModule),
        canActivate:[authGuard]
      },
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/base.module').then((m) => m.BaseModule),
        canActivate:[authGuard]
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/buttons.module').then((m) => m.ButtonsModule),
        canActivate:[authGuard]
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule),
        canActivate:[authGuard]
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/charts.module').then((m) => m.ChartsModule),
        canActivate:[authGuard]
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule),
        canActivate:[authGuard]
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/notifications.module').then((m) => m.NotificationsModule),
        canActivate:[authGuard]
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule),
        canActivate:[authGuard]
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule),
        canActivate:[authGuard]
      },
      {
        path: 'warehouses',
        loadChildren: () =>
          import('./modules/warehouses/warehouses.module').then((m) => m.WarehousesModule),
        canActivate: [authGuard]
      },
      {
        path: 'supplier',
        loadChildren: () =>
          import('./modules/supplier/supplier.module').then((m) => m.SupplierModule),
        canActivate: [authGuard]
      },
      {
        path: 'material',
        loadChildren: () =>
          import('./modules/material/material.module').then((m) => m.MaterialModule)
      },
      {
        path: 'consumables',
        loadChildren: () =>
          import('./modules/consumables/consumables.module').then((m) => m.ConsumablesModule)
      },
      {
        path: 'main-warehouse',
        loadChildren: () =>
          import('./modules/main-warehouse/main-warehouse.module').then((m) => m.MainWarehouseModule)
      }

    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
