import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { consumerAccountRoutes } from '../shared/appConfig';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { ConsumerAccountListComponent } from './consumer-account-list/consumer-account-list.component';
import { ConsumerAccountAddComponent } from './consumer-account-add/consumer-account-add.component';

const routes: Routes = [
  // {
  //   path: consumerAccountRoutes.Base,
  //   component: DashboardComponent,
  //   children:[
  //     {path: '', redirectTo: consumerAccountRoutes.List, pathMatch: 'full'},
  //     {path: consumerAccountRoutes.List, component: ConsumerAccountListComponent},
  //     {path: consumerAccountRoutes.Add, component: ConsumerAccountAddComponent},
  //     {path: consumerAccountRoutes.Update, component: ConsumerAccountAddComponent},
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerAccountRoutingModule { }
