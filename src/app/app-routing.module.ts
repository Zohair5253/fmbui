import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login/login.component";
import { DashboardComponent } from "./dashboard/dashboard/dashboard.component";
import { commonRoutes, consumerRoutes, consumerAccountRoutes, receiptRoutes, deliveryManRoutes } from "./shared/appConfig";
import { ConsumerListComponent } from './consumer/consumer-list/consumer-list.component';
import { ConsumerAddComponent } from './consumer/consumer-add/consumer-add.component';
import { ConsumerUpdateComponent } from './consumer/consumer-update/consumer-update.component';
import { ConsumerAccountListComponent } from './consumer-account/consumer-account-list/consumer-account-list.component';
import { ConsumerAccountAddComponent } from './consumer-account/consumer-account-add/consumer-account-add.component';
import { ConsumerAccountViewComponent } from './consumer-account/consumer-account-view/consumer-account-view.component';
import { ConsumerAccountUpdateComponent } from './consumer-account/consumer-account-update/consumer-account-update.component';
import { ReceiptAddComponent } from './receipt/receipt-add/receipt-add.component';
import { ReceiptListComponent } from './receipt/receipt-list/receipt-list.component';
import { ReceiptUpdateComponent } from './receipt/receipt-update/receipt-update.component';
import { ReceiptPrintComponent } from './receipt/receipt-print/receipt-print.component';
import { DeliveryManListComponent } from './delivery-man/delivery-man-list/delivery-man-list.component';
import { DeliveryManAddComponent } from './delivery-man/delivery-man-add/delivery-man-add.component';
import { DeliveryManUpdateComponent } from './delivery-man/delivery-man-update/delivery-man-update.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { ReportsComponent } from './dashboard/reports/reports.component';


const routes: Routes = [
  { path: commonRoutes.Login, component: LoginComponent },
  {
    path: "",
    component:DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {path: "", component: ReportsComponent},
      {path: `${consumerRoutes.Base}/${consumerRoutes.List}`, component: ConsumerListComponent},
      {path: `${consumerRoutes.Base}/${consumerRoutes.Add}`, component: ConsumerAddComponent},
      {path: `${consumerRoutes.Base}/${consumerRoutes.Update}/:consumerId`, component: ConsumerUpdateComponent},
      {path: `${consumerAccountRoutes.Base}/${consumerAccountRoutes.List}`, component: ConsumerAccountListComponent},
      {path: `${consumerAccountRoutes.Base}/${consumerAccountRoutes.Add}`, component: ConsumerAccountAddComponent},
      {path: `${consumerAccountRoutes.Base}/${consumerAccountRoutes.View}/:consumerAccId`, component: ConsumerAccountViewComponent},
      {path: `${consumerAccountRoutes.Base}/${consumerAccountRoutes.Update}/:consumerAccId`, component: ConsumerAccountUpdateComponent},
      {path: `${receiptRoutes.Base}/${receiptRoutes.Add}`, component: ReceiptAddComponent},
      {path: `${receiptRoutes.Base}/${receiptRoutes.List}`, component: ReceiptListComponent},
      {path: `${receiptRoutes.Base}/${receiptRoutes.Update}/:receiptId`, component: ReceiptUpdateComponent},
      {path: `${deliveryManRoutes.Base}/${deliveryManRoutes.Add}`, component: DeliveryManAddComponent},
      {path: `${deliveryManRoutes.Base}/${deliveryManRoutes.List}`, component: DeliveryManListComponent},
      {path: `${deliveryManRoutes.Base}/${deliveryManRoutes.Update}/:deliveryManId`, component: DeliveryManUpdateComponent}
    ]
  },
//   { path: "", component:DashboardComponent, pathMatch:"full",
// canActivate: [AuthGuard] },
  { path: `${receiptRoutes.Base}/${receiptRoutes.Print}/:receiptId`, component: ReceiptPrintComponent,pathMatch:"full" },

  { path: "**", redirectTo: commonRoutes.Login, pathMatch: "full" }
  
  // {
  //   path: deliveryManRoutes.Base,
  //   component: DashboardComponent,
  //   loadChildren: "./delivery-man/delivery-man.module#DeliveryManModule"
  // },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
