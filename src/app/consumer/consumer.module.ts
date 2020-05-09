import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from "ng2-select";
import { DataTablesModule } from "angular-datatables";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { ConsumerRoutingModule } from './consumer-routing.module';
import { ConsumerListComponent } from './consumer-list/consumer-list.component';
import { ConsumerAddComponent } from './consumer-add/consumer-add.component';
import { ConsumerUpdateComponent } from './consumer-update/consumer-update.component';



@NgModule({
  declarations: [
    ConsumerListComponent,
    ConsumerAddComponent,
    ConsumerUpdateComponent
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
    ConsumerRoutingModule
  ],
  exports: [
    ConsumerListComponent,
    ConsumerAddComponent,
    ConsumerUpdateComponent
  ]
})
export class ConsumerModule { }
