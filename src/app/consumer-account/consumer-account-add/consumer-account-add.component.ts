import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ConsumerAccountService } from "src/app/shared/services/consumer-account.service";
import { ConsumerService } from "src/app/shared/services/consumer.service";
import { ConsumerAccount } from "src/app/shared/models/ConsumerAccount";
import { AppConfigService } from "src/app/shared/services/app-config.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-consumer-account-add",
  templateUrl: "./consumer-account-add.component.html",
  styleUrls: ["./consumer-account-add.component.css"],
})
export class ConsumerAccountAddComponent implements OnInit {
  /* #region  Global variables */
  consumerAccForm: FormGroup;
  isSubmitted:boolean = false;
  disableSubmit:boolean = false;
  newConsumerAcc: ConsumerAccount;
  consumers = [];
  financialYears = [];
  /* #endregion */

  constructor(
    private formBuilder : FormBuilder,
    private consumerAccService : ConsumerAccountService,
    private consumerService : ConsumerService,
    private appConfigService : AppConfigService,
    private toastr : ToastrService
  ) {}

  // Initialize Consumer Account Form on Component initialization.
  ngOnInit() {
    this.consumerAccForm = this.formBuilder.group({
      year:["", Validators.required],
      // amountPaid: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      consumerId: ["", Validators.required]
    });

    this.getConsumers();
    this.getFinancialYears();
  }

  // convenience getter for easy access to form fields. For fetching error on HTML side.
  get f() {
    return this.consumerAccForm.controls;
  }

  // Method : Fetch consumers using consumer service to populate consumer dropdown.
  getConsumers() {
    this.consumerService.getConsumers().subscribe(
      (res) => {
        if (res != null && res.httpStatusCode == 200 && res.response != null) {
          this.consumers = res.response.map((c) => ({
            id: c.consumerId,
            text: `${c.itsId} - ${c.firstName} ${c.lastName}`,
          }));
          console.log(
            "Fetched Consumers ",
            `${res.httpStatusCode} :${JSON.stringify(res.response)}`
          );
        } else {
          if (res != null) {
            this.toastr.error(res.message, "Consumers not found...!!!");
            console.log(
              "Error fetching Consumers",
              `${res.httpStatusCode} : ${res.message}`
            );
          } else {
            this.toastr.error("Failed to fetch Consumer.", "Error");
          }
          this.consumers = [];
        }
      },
      (error) => {
        console.error("Service Failure", error);
        this.toastr.error(error, "Service Failure");
      }
    );
  }

  // Method : Fetch Financial Years using app config service to populate Year dropdown.
  getFinancialYears(): void {
    this.financialYears = this.appConfigService.getFinancialYears()
    .map((year) => ({
      id: year,
      text : year
    }));
  }

// Method: Save a new consumer Account by calling create consumer account service.
onSubmit() {
  this.isSubmitted = true;
  this.disableSubmit = true;
  var formValues = this.consumerAccForm.value;
  console.log("Consumer", formValues.consumerId);
  
  // Check if form values are valid.
  if (this.consumerAccForm.invalid) {
    console.log("Failed" + JSON.stringify(formValues));
    console.log(
      "Failed" + JSON.stringify(this.consumerAccForm.controls.getError)
    );
    return;
  }
  var createdAt = new Date();
  var createdBy = "Admin"; /// This needs to be fetched from current user context.
  // New Receipt object associated with consumer account.
  // this.newReceipt = {
  //   size: formValues.tiffinSize[0].text,
  //   rate: Math.trunc(formValues.tiffinRate),
  //   // number:"785"  // Auto increment using SQL sequence.
  //   createdAt: createdAt,
  //   createdBy: createdBy,
  // };
  // New Consumer Account Object.
  this.newConsumerAcc = {
    year: formValues.year[0].id,
    amountPaid: 0 || formValues.amountPaid, // Needs to be system calculated based on total receipt value.
    consumerId: formValues.consumerId[0].id,
    isActive: true,
    createdAt: createdAt,
    createdBy: createdBy,
  };

  // Call consumeraccount service to add a new consumer account. 
  // Parameter : consumer Account Object.
  this.consumerAccService.addConsumerAccount(this.newConsumerAcc).subscribe(
    (out) => {
      console.log("Success" + JSON.stringify(this.newConsumerAcc));
      console.log("Success" + JSON.stringify(out));
      if (out.httpStatusCode == 200 && out.response == true) {
        this.toastr.success(out.message, "Success");
        this.onReset();
      } else {
        //Toaster Error message.
        this.toastr.error(out.message, "Failure");
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
    this.isSubmitted = false;
    this.disableSubmit = false;
    this.consumerAccForm.reset();
  }

}
