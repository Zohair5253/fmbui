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
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsumerAccount } from 'src/app/shared/models/ConsumerAccount';

@Component({
  selector: 'app-receipt-update',
  templateUrl: './receipt-update.component.html',
  styleUrls: ['./receipt-update.component.css']
})
export class ReceiptUpdateComponent implements OnInit {
  /* #region  Global variables */
  updateReceiptForm: FormGroup;
  isSubmitted: Boolean = false;
  disableSubmit: Boolean = false;
  storedReceipt: Receipt;
  updatedReceipt: Receipt;
  currentFY: string;
  ca:ConsumerAccount [] = [];
  consumerAccounts = [];
  paymentModes = [];
  selectedConsumerAcc = [];
  selectedPaymentMode = [];
  // currentDate : Date = ;
  /* #endregion */

  constructor(
    private formBuilder: FormBuilder,
    private receiptService: ReceiptService,
    private consumerAccService: ConsumerAccountService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.updateReceiptForm = this.formBuilder.group({
      consumerAccountId: ["", Validators.required],
      receiptNumber: [{ value: "", disabled: true }, [Validators.required]],
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

    //Fetch Receipt using ReceiptId provided in route parameter.
    this.route.paramMap.subscribe((params) => {
      const receiptId = params.get("receiptId");
      if (receiptId && receiptId != null) {
        this.getReceiptById(receiptId);
      }
    });
  }

  // convenience getter for easy access to form fields. For fetching error on HTML side.
  get f() {
    return this.updateReceiptForm.controls;
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
            this.ca = res.response;
            this.consumerAccounts = res.response.map((ca) => ({
              id: ca.consumerAccountId,
              text: `${ca.consumer.itsId} - ${ca.consumer.firstName} ${ca.consumer.lastName}`,
            }));
            this.patchConsumer();
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

  // Method: Fetch Receipt.
  // Parameter: receiptId.
  getReceiptById(receiptId: string) {
    console.log("Inside getReceiptById", receiptId);

    this.receiptService.getReceiptById(receiptId).subscribe(
      (res) => {
        if (res != null && res.httpStatusCode == 200 && res.response != null) {
          console.log("fetched", JSON.stringify(res));

          this.storedReceipt = res.response;
          this.selectedPaymentMode = [{
            id: this.storedReceipt.paymentMode,
            text: this.storedReceipt.paymentMode
          }];


          //Patch fetched values to the form.
          this.patchValues();
        } else {

          if (res != null) {
            this.toastr.error(res.message, "Error");
          } else {
            this.toastr.error("Failed to fetch Receipt.", "Error");
          }
        }
      },
      (error) => {
        this.toastr.error(error, "Service Failure");
      }
    );
  }

  // Patch fetched values to the form.
  patchValues() {
    console.log("Patch values");

    this.updateReceiptForm.patchValue({
      receiptNumber: this.storedReceipt.receiptNumber,
      date: formatDate(this.storedReceipt.date, 'yyyy-MM-dd', 'en'),
      amount: this.storedReceipt.amount,
      remarks: this.storedReceipt.remarks,
    });
    
    this.updateReceiptForm.controls["paymentMode"].setValue(this.selectedPaymentMode, {
      onlySelf: true,
    });
    this.patchConsumer();
  }

  patchConsumer(){
    if (this.storedReceipt != null && this.consumerAccounts !=null) {
      this.selectedConsumerAcc = this.consumerAccounts.filter(ca => ca.id == this.storedReceipt.consumerAccountId);

    this.updateReceiptForm.controls["consumerAccountId"].setValue(this.selectedConsumerAcc, {
      onlySelf: true,
    });
    }
  }
  // Method: Save a new receipt by calling add receipt service.
  onSubmit() {
    this.isSubmitted = true;
    this.disableSubmit = true;
    var formValues = this.updateReceiptForm.value;
    // Check if form values are valid.
    if (this.updateReceiptForm.invalid) {
      console.log("Failed" + JSON.stringify(formValues));
      return;
    }
    // Set Modified At and Modified By Values
    var modifiedAt = new Date();
    var modifiedBy = "Admin"; /// This needs to be fetched from current user context.
    var consumerAcc = this.ca.filter(acc => acc.consumerAccountId == formValues.consumerAccountId[0].id);
    // Updated Receipt Object.
    this.updatedReceipt = {
      receiptId: this.storedReceipt.receiptId,
      receiptNumber : this.storedReceipt.receiptNumber,
      consumerAccountId: formValues.consumerAccountId[0].id,
      consumerAccount:consumerAcc[0],
      consumerName: formValues.consumerAccountId[0].text.slice(10),
      date: formValues.date,
      amount: formValues.amount,
      paymentMode: formValues.paymentMode[0].id,
      remarks: formValues.remarks,
      takenBy: "Admin", // To be replaced by current User.
      createdAt: this.storedReceipt.createdAt,
      createdBy: this.storedReceipt.createdBy,
      modifiedAt: modifiedAt,
      modifiedBy: modifiedBy
    };

    console.log("ReceiptObject", JSON.stringify(this.updatedReceipt));
    // Call receiptService to update Receipt.
    this.receiptService.updateReceipt(this.updatedReceipt).subscribe(
      (out) => {
        console.log("Success" + JSON.stringify(out));
        if (out != null && out.httpStatusCode == 200 && out.response == true) {
          this.toastr.success(out.message, "Success");
          this.router.navigate(["receipt/list"]);
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
    this.patchValues();
  }

}
