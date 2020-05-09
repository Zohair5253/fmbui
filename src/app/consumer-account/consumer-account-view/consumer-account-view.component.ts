import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Receipt } from "src/app/shared/models/Receipt";
import { Subject, Subscription } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { ConsumerAccount } from "src/app/shared/models/ConsumerAccount";
import { ConsumerAccountService } from "src/app/shared/services/consumer-account.service";
import { ReceiptService } from "src/app/shared/services/receipt.service";
import { AppConfigService } from "src/app/shared/services/app-config.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-consumer-account-view',
  templateUrl: './consumer-account-view.component.html',
  styleUrls: ['./consumer-account-view.component.css']
})
export class ConsumerAccountViewComponent implements OnInit, OnDestroy {

  // Datatable Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  timerSubscription: Subscription;
  storedConsumerAcc: ConsumerAccount;
  hasReceipts: boolean = false;
  receipts: Receipt[];
  financialYears = [];
  isSubmited: boolean = false;

  constructor(
    private consumerAccService: ConsumerAccountService,
    private appConfigService: AppConfigService,
    private receiptService: ReceiptService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    //Set Datatable options.
    this.dtOptions = {
      // pagingType: "full_numbers",
      // pageLength: 12,
      autoWidth: false,
      processing: true,
      paging: false
    };
    // Fetch Consumer Account.
    this.route.paramMap.subscribe((params) => {
      const consumerAccId = params.get("consumerAccId");
      console.log("route param", consumerAccId);
      if (consumerAccId != null) {
        console.log("calling get consumeracc id");
        this.getConsumerAccountById(consumerAccId);
      }
    });
    console.log("After calling GetConsumerAccByID");

  }

  // Method: Fetch consumer Account.
  // Parameter: ConsumerAccId.
  getConsumerAccountById(consumerAccId: string) {
    console.log("Inside getConsumerAccByID", consumerAccId);

    this.consumerAccService.getConsumerAccountById(consumerAccId).subscribe(
      (res) => {
        if (res != null && res.httpStatusCode == 200 && res.response != null) {
          console.log("fetched", JSON.stringify(res));

          this.storedConsumerAcc = res.response;
          this.receipts = this.storedConsumerAcc.receipts;
          // this.dtTrigger.next();
          console.log("Calling rerender");
          this.rerender();
        } else {
          // this.dtTrigger.next();
          this.rerender();
          if (res != null) {
            this.toastr.error(res.message, "Error");
          } else {
            this.toastr.error("Failed to fetch Consumer Account", "Error");
          }
        }
      },
      (error) => {
        this.toastr.error(error, "Service Failure");
      }
    );
  }

  /* #region  Datatable related methods */
  // Method: Refreshes the datatable.
  rerender() {
    console.log("Inside rerenderer");

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      console.log("Destroying DTInstance");

      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();

    });
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy");

    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");
    this.dtTrigger.next();
  }
  /* #endregion */

  printReceipt(receiptId: string): void {
    console.log("Print Receipt Called", receiptId);

  }

  deleteReceipt(receipt: Receipt) {
    Swal.fire({
      title: `Delete Receipt Number ${receipt.receiptNumber}?`,
      text: `You will not be able to recover this.`,
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {

        this.receiptService.deleteReceipt(receipt.receiptId).subscribe(
          (res) => {
            console.log("Success Output : " + JSON.stringify(res));
            if (res != null && res.httpStatusCode == 200 && res.response == true) {
              // Remove row from table.
              this.receipts = this.receipts.filter(
                ({ receiptId }) => receiptId !== receipt.receiptId);
              console.log("Removed receipt from table.");
              this.rerender();
              // Success message through swal or toaster.
              Swal.fire(
                "Deleted!",
                `Receipt Number ${receipt.receiptNumber} has been deleted.`,
                "success"
              );
            } else {
              // Toaster Erorr message.
              if (res != null) {
                this.toastr.error(`${res.message}`, "Error");
              } else {
                this.toastr.error("Error in deleting receipt", "Error");
              }
            }
          },
          (error) => {
            // On Error.
            console.error("Service Failure", error);
            // Toaster Error: Failed to fetch consumer.
            this.toastr.error(error, "Service Failure");
          }
        );

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Receipt is not deleted.", "error");
      }
    });
  }

  updateReceipt(receiptId: string) {
    console.log("receiptId", receiptId);
    this.router.navigate(["receipt/update", receiptId]);
  }

}
