import { Component, OnInit } from "@angular/core";
import {
  consumerRoutes,
  consumerAccountRoutes,
  receiptRoutes,
  deliveryManRoutes,
} from "src/app/shared/appConfig";
// import { Router } from '@angular/router';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  /* #region  Consumer Routes */
  listConsumers = `/${consumerRoutes.Base}/${consumerRoutes.List}`;
  createConsumer = `/${consumerRoutes.Base}/${consumerRoutes.Add}`;
  /* #endregion */

  /* #region  Consumer Account Routes */
  listConsumerAccounts = `/${consumerAccountRoutes.Base}/${consumerAccountRoutes.List}`;
  createConsumerAccount = `/${consumerAccountRoutes.Base}/${consumerAccountRoutes.Add}`;
  /* #endregion */

  /* #region  Receipt Routes */
  listReceipts = `/${receiptRoutes.Base}/${receiptRoutes.List}`;
  createReceipt = `/${receiptRoutes.Base}/${receiptRoutes.Add}`;
  /* #endregion */
 
  /* #region  Delivery Man Routes */
  listDeliveryMen = `/${deliveryManRoutes.Base}/${deliveryManRoutes.List}`;
  createDeliveryMan = `/${deliveryManRoutes.Base}/${deliveryManRoutes.Add}`;
  /* #endregion */

}
