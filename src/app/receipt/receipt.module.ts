import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from "ng2-select";
import { DataTablesModule } from "angular-datatables";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { ReceiptRoutingModule } from './receipt-routing.module';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { ReceiptAddComponent } from './receipt-add/receipt-add.component';
import { ReceiptUpdateComponent } from './receipt-update/receipt-update.component';
import { ReceiptPrintComponent } from './receipt-print/receipt-print.component';

@NgModule({
  declarations: [
    ReceiptListComponent, 
    ReceiptAddComponent, ReceiptUpdateComponent, ReceiptPrintComponent
  ],
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
    ReceiptRoutingModule
  ]
})
export class ReceiptModule { }
