import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { ReceiptService } from "src/app/shared/services/receipt.service";
import { ConsumerAccountService } from "src/app/shared/services/consumer-account.service";
import { AppConfigService } from "src/app/shared/services/app-config.service";
import { Receipt } from "src/app/shared/models/Receipt";
import { PaymentModes } from "src/app/shared/appConfig";
import { ToastrService } from "ngx-toastr";
import { formatDate } from '@angular/common';
import Swal from "sweetalert2";

@Component({
  selector: 'app-receipt-add',
  templateUrl: './receipt-add.component.html',
  styleUrls: ['./receipt-add.component.css']
})
export class ReceiptAddComponent implements OnInit {
  /* #region  Global variables */
  receiptForm: FormGroup;
  isSubmitted: Boolean = false;
  disableSubmit: Boolean = false;
  newReceipt: Receipt;
  consumerAccounts = [];
  currentFY: string;
  paymentModes = [];
  // currentDate : Date = ;
  /* #endregion */


  constructor(
    private formBuilder: FormBuilder,
    private receiptService: ReceiptService,
    private consumerAccService: ConsumerAccountService,
    private appConfigService: AppConfigService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.receiptForm = this.formBuilder.group({
      consumerAccountId: ["", Validators.required],
      receiptNumber: [{ value: "System Generated", disabled: true }, [Validators.required]],
      date: [formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]],
      amount: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      paymentMode: ["", Validators.required],
      remarks: [""]
    });

    // Set the current Financial Year.
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth();
    this.currentFY =
      currentMonth > 2
        ? `${currentYear}-${currentYear + 1}`
        : `${currentYear - 1}-${currentYear}`;

    this.getConsumerAccountsByYear(this.currentFY);
    this.getPaymentModes();
  }

  // convenience getter for easy access to form fields. For fetching error on HTML side.
  get f() {
    return this.receiptForm.controls;
  }

  // Method: Fetch Areas using service to populate dropdown.
  getPaymentModes(): void {
    this.paymentModes = PaymentModes;
  }

  // Method: Call Consumer Account service to fetch consumer accounts by year.
  // Parameter: current Financial Year
  getConsumerAccountsByYear(year: string) {
    console.log("Get Consumer accounts called....");
    console.log(year);
    // Use consumerAccService.getConsumerAccounts Method to fetch all consumer accounts.
    this.consumerAccService.getConsumerAccountsByYear(year)
      .subscribe(
        (res) => {
          //On successfull response.
          if (res != null && res.httpStatusCode == 200 && res.response != null) {
            console.log(
              "Fetched Consumer Accounts",
              `${res.httpStatusCode} :${JSON.stringify(res.response)}`
            );
            // Assign fetched response to consumer accounts global variable.
            this.consumerAccounts = res.response.map((ca) => ({
              id: ca.consumerAccountId,
              text: `${ca.consumer.itsId} - ${ca.consumer.firstName} ${ca.consumer.lastName}`,
            }));;

          } else {
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

  // Method: Save a new receipt by calling add receipt service.
  onSubmit() {
    this.isSubmitted = true;
    this.disableSubmit = true;
    var formValues = this.receiptForm.value;
    // Check if form values are valid.
    if (this.receiptForm.invalid) {
      console.log("Failed" + JSON.stringify(formValues));
      return;
    }
    var createdAt = new Date();
    var createdBy = "Admin"; /// This needs to be fetched from current user context.
    // New Receipt Object.
    this.newReceipt = {
      consumerAccountId: formValues.consumerAccountId[0].id,
      consumerName: formValues.consumerAccountId[0].text.slice(10),
      date: formValues.date,
      amount: formValues.amount,
      paymentMode: formValues.paymentMode[0].id,
      remarks: formValues.remarks,
      takenBy: "Admin", // To be replaced by current User.
      createdAt: createdAt,
      createdBy: createdBy,
    };

    console.log("ReceiptObject", JSON.stringify(this.newReceipt));
    // Call receiptService to add Receipt.
    // Returns receipt object on success.
    this.receiptService.addReceipt(this.newReceipt).subscribe(
      (out) => {
        console.log("Success" + JSON.stringify(out));
        if (out != null && out.httpStatusCode == 200 && out.message.includes("success") ) {
          this.toastr.success(out.message, "Success");
          this.printReceipt(out.response);
        } else {
          // Toaster Error: Failed to fetch consumer accounts.
          if (out != null) {
            this.toastr.error(out.message, "Error");
            console.log("Error : \n", `${out.httpStatusCode} : ${out.message}`);
          } else {
            this.toastr.error("Failed to Save Receipt.", "Error");
          }
        }
      },
      (error) => {
        //On Error.
        console.error("Service Failure", error);
        //Toaster Error
        this.toastr.error(error, "Service Failure");
      }
    );
  }

  // Method : Reset Form.
  onReset() {
    this.disableSubmit = false;
    this.isSubmitted = false;
    this.receiptForm.reset();
  }

  printReceipt(receipt : Receipt) {
    Swal.fire({
      title: `Do you want to print receipt number ${receipt.receiptNumber} ?`,
      // text: "You will not be able to recover this consumer!",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, print it!",
      cancelButtonText: "No"
    }).then(result => {
      if (result.value) {

        console.log("printing receipt....!!!");

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.onReset();
        Swal.fire("Cancelled", "Receipt is not printed.", "info");
      }
    });
  }

}
