import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ConsumerAccount } from "src/app/shared/models/ConsumerAccount";
import { ConsumerAccountService } from 'src/app/shared/services/consumer-account.service';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { ConsumerService } from 'src/app/shared/services/consumer.service';

@Component({
  selector: 'app-consumer-account-update',
  templateUrl: './consumer-account-update.component.html',
  styleUrls: ['./consumer-account-update.component.css']
})
export class ConsumerAccountUpdateComponent implements OnInit {

  /* #region Global Varialbes  */
  updateConAccForm: FormGroup;
  isSubmitted = false;
  storedConAcc: ConsumerAccount;
  updatedConAcc: ConsumerAccount;
  financialYears = [];
  selectedYear = [];
  slectedConsumer = [];
  consumers = [];
  /* #endregion */

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private consumerService: ConsumerService,
    private consumerAccService: ConsumerAccountService,
    private appConfigService: AppConfigService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.updateConAccForm = this.formBuilder.group({
      year: ["", Validators.required],
      // amountPaid: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      consumerId: ["", Validators.required]
    });

    this.getConsumers();
    this.getFinancialYears();

    //Fetch ConsumerAccount using consumerAccID provided in route parameter.
    this.route.paramMap.subscribe((params) => {
      const consumerAccId = params.get("consumerAccId");
      if (consumerAccId && consumerAccId != null) {
        this.getConsumerAccountById(consumerAccId);
      }
    });
  }

  // convenience getter for easy access to form fields. For fetching error on HTML side.
  get f() {
    return this.updateConAccForm.controls;
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
        text: year
      }));
  }

  // Method: Fetch consumer Account.
  // Parameter: ConsumerAccId.
  getConsumerAccountById(consumerAccId: string) {
    console.log("Inside getConsumerAccByID", consumerAccId);

    this.consumerAccService.getConsumerAccountById(consumerAccId).subscribe(
      (res) => {
        if (res != null && res.httpStatusCode == 200 && res.response != null) {
          console.log("fetched", JSON.stringify(res));

          this.storedConAcc = res.response;
          this.selectedYear = [{
            id: this.storedConAcc.year,
            text: this.storedConAcc.year
          }];
          this.slectedConsumer = [{
            id: this.storedConAcc.consumer.consumerId,
            text: `${this.storedConAcc.consumer.itsId} - ${this.storedConAcc.consumer.firstName} ${this.storedConAcc.consumer.lastName}`,
          }];

          //Patch fetched values to the form.
          this.patchValues();
        } else {

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

  // Patch fetched values to the form.
  patchValues() {

    this.updateConAccForm.controls["year"].setValue(this.selectedYear, {
      onlySelf: true,
    });

    this.updateConAccForm.controls["consumerId"].setValue(this.slectedConsumer, {
      onlySelf: true,
    });
  }

  // Save the updated consumer.
  onSubmit() {
    this.isSubmitted = true;
    var formValues = this.updateConAccForm.value;
    // Check if form values are valid. If Invalid return.
    if (this.updateConAccForm.invalid) {
      console.log("Form Invalid. Form Values : " + JSON.stringify(formValues));
      console.log(
        "Form Invalid. Form Errors : " +
        JSON.stringify(this.updateConAccForm.controls.getError)
      );
      return;
    }
    // Set Modified At and Modified By Values
    var modifiedAt = new Date();
    var modifiedBy = "Admin"; /// This needs to be fetched from current user context.


    // Prepare object for updated consumer account.
    this.updatedConAcc = {
      consumerAccountId: this.storedConAcc.consumerAccountId,
      consumerId: formValues.consumerId[0].id,
      year: formValues.year[0].id,
      receipts: this.storedConAcc.receipts,
      amountPaid: this.storedConAcc.amountPaid,
      isActive: true,
      modifiedAt: modifiedAt,
      modifiedBy: modifiedBy,
      createdAt: this.storedConAcc.createdAt,
      createdBy: this.storedConAcc.createdBy
    };

    // Call consumer service to update consumer.
    this.consumerAccService.updateConsumerAccount(this.updatedConAcc).subscribe(
      (out) => {
        console.log(
          "Updated Consumer Account : " + JSON.stringify(this.updatedConAcc)
        );
        console.log("Success Output : " + JSON.stringify(out));
        if (out != null && out.httpStatusCode == 200 && out.response == true) {
          // Toaster Success message. Use out.message.
          this.toastr.success(out.message, "Success");
          this.router.navigate(["consumerAccount/list"]);
        } else {
          if (out != null) {
            this.toastr.error(`Either Consumer Account is already present for given FY or Cosnumer Account has receipts made for given FY.`, `${out.message}`);
          } else {
            // Toaster Erorr message.
            this.toastr.error("Error while saving consumer Account", "Failure");

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

  // Reset the form with fetched values.
  onReset() {
    this.isSubmitted = false;
    this.patchValues();
  }

}
