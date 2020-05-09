import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { deliveryManRoutes } from '../shared/appConfig';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { DeliveryManListComponent } from './delivery-man-list/delivery-man-list.component';
import { DeliveryManAddComponent } from './delivery-man-add/delivery-man-add.component';

const routes: Routes = [
  // {
  //   path: deliveryManRoutes.Base,
  //   component: DashboardComponent,
  //   children:[
  //     {path: '', redirectTo: deliveryManRoutes.List, pathMatch: 'full'},
  //     {path: deliveryManRoutes.List, component: DeliveryManListComponent},
  //     {path: deliveryManRoutes.Add, component: DeliveryManAddComponent},
  //     {path: deliveryManRoutes.Update, component: DeliveryManAddComponent},
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryManRoutingModule { }
