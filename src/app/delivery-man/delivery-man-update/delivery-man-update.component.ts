import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DeliveryMan } from "src/app/shared/models/DeliveryMan";
import { DeliverymanService } from "src/app/shared/services/deliveryman.service";
import { Areas } from "src/app/shared/appConfig";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-delivery-man-update',
  templateUrl: './delivery-man-update.component.html',
  styleUrls: ['./delivery-man-update.component.css']
})
export class DeliveryManUpdateComponent implements OnInit {

   /* #region  Global Variabes */
   updateDeliveryManForm: FormGroup;
   disableSubmit: boolean = false;
   isSubmitted: boolean = false;
   storedDeliveryMan: DeliveryMan;
   updatedDeliveryMan: DeliveryMan;
   storedArea = [];
   areas = [];
   /* #endregion */

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private deliveryManService: DeliverymanService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    //Create Form.
    this.updateDeliveryManForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      mobileNumber: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{10,10}$")],
      ],
      address: ["", Validators.required],
      area: ["", Validators.required],
    });

    this.getAreas();

    //Fetch Delivery Man using deliveryManId provided in route parameter.
    this.route.paramMap.subscribe((params) => {
      const deliveryManId = params.get("deliveryManId");
      if (deliveryManId && deliveryManId != null) {
        this.getDeliveryManById(deliveryManId);
      }
    });
  }

   // convenience getter for easy access to form fields. For fetching error on HTML side.
   get f() {
    return this.updateDeliveryManForm.controls;
  }

  getAreas(): void {
    this.areas = Areas;
  }

  getDeliveryManById(deliveryManId: string) {
    this.deliveryManService.getDeliveryMan(deliveryManId).subscribe(
      (res) => {
      if (res != null) {
        if (res.httpStatusCode == 200 && res.response != null) {
          console.log("Fetched DM : ", JSON.stringify(res.response));
          this.storedDeliveryMan = res.response;
          this.storedArea = [
            {
              id: this.storedDeliveryMan.area,
              text: this.storedDeliveryMan.area,
            },
          ];
          //Patch fetched values to the form.
          this.patchValues();
        } else {
          // Toaster Error: Failed to fetch DeliveryMan.
          this.toastr.error("Failed to Fetch Delivery man.", "Error");
        }
      } else{
        // Toaster Error: DeliveryMan with DeliveryMan ID not found.
        this.toastr.error(res.message, "Error");
        console.log("Error : \n", `${res.httpStatusCode} : ${res.message}`);
      }
    },
    (error) => {
       // On Error.
       console.error("Service Failure", error);
       // Toaster Error: Failed to fetch consumer.
       this.toastr.error(error, "Service Failure");
    }
    );
  }

  // Patch fetched values to the form.
  patchValues() {
    this.updateDeliveryManForm.patchValue({
      firstName: this.storedDeliveryMan.firstName,
      middleName: this.storedDeliveryMan.middleName,
      lastName: this.storedDeliveryMan.lastName,
      mobileNumber: this.storedDeliveryMan.mobileNumber,
      address: this.storedDeliveryMan.address
    });

    this.updateDeliveryManForm.controls["area"].setValue(this.storedArea, {
      onlySelf: true,
    });
    
  }

  // Save the updated deliveryman.
  onSubmit() {
    this.isSubmitted = true;
    this.disableSubmit = true;
    var formValues = this.updateDeliveryManForm.value;
    // Check if form values are valid. If Invalid return.
    if (this.updateDeliveryManForm.invalid) {
      console.log("Form Invalid. Form Values : " + JSON.stringify(formValues));
      console.log(
        "Form Invalid. Form Errors : " +
          JSON.stringify(this.updateDeliveryManForm.controls.getError)
      );
      return;
    }
    // Set Modified At and Modified By Values
    var modifiedAt = new Date();
    var modifiedBy = "Admin"; /// This needs to be fetched from current user context.

    // Prepare object for updated consumer.
    this.updatedDeliveryMan = {
      deliveryManId: this.storedDeliveryMan.deliveryManId,
      firstName: formValues.firstName,
      middleName: formValues.middleName,
      lastName: formValues.lastName,
      mobileNumber: formValues.mobileNumber,
      address: formValues.address,
      area: formValues.area[0].text,
      modifiedAt: modifiedAt,
      modifiedBy: modifiedBy,
      createdAt: this.storedDeliveryMan.createdAt,
      createdBy: this.storedDeliveryMan.createdBy,
    };

    // Call deliveryman service to update deliveryman.
    this.deliveryManService.updateDeliveryMan(this.updatedDeliveryMan).subscribe(
      (out) => {
        console.log(
          "Updated DM : " + JSON.stringify(this.updatedDeliveryMan)
        );
        console.log("Success Output : " + JSON.stringify(out));
        if (out != null && out.httpStatusCode == 200 && out.response == true) {
          // Toaster Success message. Use out.message.
          this.toastr.success(out.message, "Success");
          this.router.navigate(["deliveryman/list"]);
        } else {
          // Toaster Erorr message.
          if (out != null) {
            this.toastr.error("Error while saving deliveryman", "Failure");
          } else {
            this.toastr.error(out.message,"Error")
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
    this.disableSubmit = false;
    this.patchValues();
  }

}
