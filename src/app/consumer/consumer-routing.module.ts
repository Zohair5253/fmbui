import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { ConsumerListComponent } from './consumer-list/consumer-list.component';
import { consumerRoutes } from '../shared/appConfig';
import { ConsumerAddComponent } from './consumer-add/consumer-add.component';

const routes: Routes = [
  // {
  //   path: 'consumer',
  //   component: DashboardComponent,
  //   children:[
  //     // {path: '', redirectTo: 'list', pathMatch: 'full'},
  //     {path: 'list', component: ConsumerListComponent},
  //     {path: consumerRoutes.Add, component: ConsumerAddComponent},
  //     {path: consumerRoutes.Update, component: ConsumerAddComponent},
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerRoutingModule { }
