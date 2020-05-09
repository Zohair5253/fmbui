import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
// import { Chart } from "chart.js";

// Modules
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConsumerModule } from './consumer/consumer.module';
import { AppRoutingModule } from './app-routing.module';
// Components
import { AppComponent } from './app.component';
// Services
import { AppConfigService } from './shared/services/app-config.service';
import { ConsumerService } from './shared/services/consumer.service';
import { ConsumerAccountService } from './shared/services/consumer-account.service';
import { DeliverymanService } from './shared/services/deliveryman.service';
import { ReceiptService } from './shared/services/receipt.service';
import { TiffinService } from './shared/services/tiffin.service';
import { UserService } from './shared/services/user.service';
import { ConsumerAccountModule } from './consumer-account/consumer-account.module';
import { DeliveryManModule } from './delivery-man/delivery-man.module';
import { ReceiptModule } from './receipt/receipt.module';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from "ng2-select";
import { DataTablesModule } from "angular-datatables";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { JwtInterceptor } from './shared/helpers/jwt.interceptor';
import { ErrorInterceptor } from './shared/helpers/error.interceptor';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({autoDismiss:true,closeButton:true,newestOnTop:true}),
    LoginModule,
    DashboardModule,
    ConsumerModule,
    ConsumerAccountModule,
    DeliveryManModule,
    ReceiptModule,
    SelectModule,
    DataTablesModule,
    // Chart,
    AppRoutingModule,
  ],
  providers: [
    ConsumerService,
    ConsumerAccountService,
    UserService,
    TiffinService,
    DeliverymanService,
    ReceiptService,
    AppConfigService,
    JwtInterceptor,
    ErrorInterceptor
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  // Diagnostic only: inspect router configuration
  // constructor(router: Router) {
  //   // Use a custom replacer to display function names in the route configs
  //   const replacer = (key, value) => (typeof value === 'function') ? value.name : value;

  //   console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
  // }
}
