import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { receiptRoutes } from '../shared/appConfig';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { ReceiptAddComponent } from './receipt-add/receipt-add.component';

const routes: Routes = [
  // {
  //   path: receiptRoutes.Base,
  //   component: DashboardComponent,
  //   children:[
  //     {path: '', redirectTo: receiptRoutes.List, pathMatch: 'full'},
  //     {path: receiptRoutes.List, component: ReceiptListComponent},
  //     {path: receiptRoutes.Add, component: ReceiptAddComponent},
  //     {path: receiptRoutes.Update, component: ReceiptAddComponent},
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptRoutingModule { }
