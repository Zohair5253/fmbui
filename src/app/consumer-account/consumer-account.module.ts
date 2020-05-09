import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from "ng2-select";
import { DataTablesModule } from "angular-datatables";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { ConsumerAccountRoutingModule } from './consumer-account-routing.module';
import { ConsumerAccountAddComponent } from './consumer-account-add/consumer-account-add.component';
import { ConsumerAccountListComponent } from './consumer-account-list/consumer-account-list.component';
import { ConsumerAccountViewComponent } from './consumer-account-view/consumer-account-view.component';
import { ConsumerAccountUpdateComponent } from './consumer-account-update/consumer-account-update.component';

@NgModule({
  declarations: [
    ConsumerAccountAddComponent, 
    ConsumerAccountListComponent,
    ConsumerAccountViewComponent,
    ConsumerAccountUpdateComponent
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
    ConsumerAccountRoutingModule
  ]
})
export class ConsumerAccountModule { }
