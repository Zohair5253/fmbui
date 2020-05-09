import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Receipt } from "src/app/shared/models/Receipt";
import { Subject, Subscription } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { ReceiptService } from "src/app/shared/services/receipt.service";
import { ConsumerAccountService } from "src/app/shared/services/consumer-account.service";
import { AppConfigService } from "src/app/shared/services/app-config.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.css']
})
export class ReceiptListComponent implements OnInit, AfterViewInit,OnDestroy {

  /* #region  Global variables */
  // Datatable properties..
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  timerSubscription: Subscription;
  yearFilterForm: FormGroup;
  receipts: Receipt[];
  financialYears = [];
  currentFY: string;
  /* #endregion */
  constructor(
    private router:Router,
    private receiptService: ReceiptService,
    private consumerAccService: ConsumerAccountService,
    private appConfigService: AppConfigService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    // Set the current Financial Year.
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth();
    this.currentFY =
      currentMonth > 2
        ? `${currentYear}-${currentYear + 1}`
        : `${currentYear - 1}-${currentYear}`;

        //Set Datatable options.
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      autoWidth: false,
      processing: true,
    };
    

    this.getReceiptByYear(this.currentFY);
  }

  // Method: Call Consumer Account service to fetch consumer accounts by year.
  // Parameter: current Financial Year
  getReceiptByYear(year:string) {
    console.log("Get Consumer accounts called....");
    console.log(year);
    var startDate = `${year.slice(0,4)}-04-01`;
    console.log(startDate);
    
    var endDate = `${year.slice(5)}-03-31`;
    console.log(endDate);
    // Use consumerAccService.getConsumerAccounts Method to fetch all consumer accounts.
    this.receiptService.getReceiptByDate(startDate,endDate)
      .subscribe(
        (res) => {
          //On successfull response.
          if (res != null && res.httpStatusCode == 200 && res.response != null) {
            console.log(
              "Fetched  receipts",
              `${res.httpStatusCode} :${JSON.stringify(res.response)}`
            );
            // Assign fetched response to receipts global variable.
            this.receipts = res.response;
            this.rerender();

          } else {
            this.rerender();
            // Toaster Error: Failed to fetch consumer accounts.
            if (res != null) {
              this.toastr.error(res.message, "Error");
              console.log("Error : \n", `${res.httpStatusCode} : ${res.message}`);
            } else {
              this.toastr.error("Failed to Fetch Consumers.", "Error");
            }

          }
        },
        (error) => {
          // On Error.
          console.error("Service Failure", error);
          // Toaster Error: Failed to fetch consumer accounts.
          this.toastr.error(error, "Service Failure");
        }
      );

  }

  updateReceipt(receiptId: string) {
    console.log("receiptId",receiptId);
    this.router.navigate(["receipt/update", receiptId]);
  }

   deleteReceipt(receipt:Receipt) {
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
                ({receiptId}) => receiptId !== receipt.receiptId);
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

  printReceipt(receipt : Receipt) {
    Swal.fire({
      title: `Do you want to print receipt number ${receipt.receiptNumber} ?`,
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, print it!",
      cancelButtonText: "No"
    }).then(result => {
      if (result.value) {

        console.log("printing receipt....!!!");
        this.router.navigate(["receipt/print", receipt.receiptId]);

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Receipt is not printed.", "info");
      }
    });
  }

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
  // Destroy datatable.
  ngOnDestroy(): void {
    console.log("ngOnDestroy");
    this.dtTrigger.unsubscribe();
  }
  // Trigger datatable
  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");
    this.dtTrigger.next();
  }

}
