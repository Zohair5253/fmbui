import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from "ng2-select";
import { DataTablesModule } from "angular-datatables";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { DeliveryManRoutingModule } from './delivery-man-routing.module';
import { DeliveryManListComponent } from './delivery-man-list/delivery-man-list.component';
import { DeliveryManAddComponent } from './delivery-man-add/delivery-man-add.component';
import { DeliveryManUpdateComponent } from './delivery-man-update/delivery-man-update.component';

@NgModule({
  declarations: [DeliveryManListComponent, DeliveryManAddComponent, DeliveryManUpdateComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    SelectModule,
    DataTablesModule,
    BrowserAnimationsModule,
    ToastrModule,
    DeliveryManRoutingModule
  ]
})
export class DeliveryManModule { }
