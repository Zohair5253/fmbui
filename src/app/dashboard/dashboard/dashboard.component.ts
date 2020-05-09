import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConsumerService } from 'src/app/shared/services/consumer.service';
import { Consumer } from 'src/app/shared/models/Consumer';
import { ConsumerAccountService } from 'src/app/shared/services/consumer-account.service';
import { ReceiptService } from 'src/app/shared/services/receipt.service';
import { TiffinService } from 'src/app/shared/services/tiffin.service';
import { DeliverymanService } from 'src/app/shared/services/deliveryman.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  constructor(
    private consumerService: ConsumerService,
    private cas: ConsumerAccountService,
    private rs: ReceiptService,
    private ts: TiffinService,
    private dmser: DeliverymanService,
  ) { }

  consumers :any = [];
  consumerAccounts :any = [];
  receipts :any = [];
  dms :any = [];
  tiffins :any = [];
  status: string = ""
  
  ngOnInit() {
    document.body.className = "hold-transition skin-blue sidebar-mini sidebar-collapse";
   
  }

  ngOnDestroy() {
    document.body.className = "";
  }

  getConsumers() : void {
    this.consumerService.getConsumers()
    .subscribe(res => this.consumers = res.response)

  }
  getConsumerAccounts() : void {
    this.cas.getConsumerAccounts()
    .subscribe(res => this.consumerAccounts = res.response)

  }
  getReceipts() : void {
    this.rs.getReceipts()
    .subscribe(res => this.receipts = res.response)

  }
  getDMs() : void {
    this.dmser.getDeliveryMen()
    .subscribe(res => this.dms = res.response)

  }
  // getTiffins() : void {
  //   this.dmser.getDeliveryMans()
  //   .subscribe(res => this.dms = res.response)

  // }
  
}
