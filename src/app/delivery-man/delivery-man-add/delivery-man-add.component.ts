import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { DeliveryMan } from "src/app/shared/models/DeliveryMan";
import { Areas } from "src/app/shared/appConfig";
import { DeliverymanService } from "src/app/shared/services/deliveryman.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-delivery-man-add',
  templateUrl: './delivery-man-add.component.html',
  styleUrls: ['./delivery-man-add.component.css']
})
export class DeliveryManAddComponent implements OnInit {
/* #region  Global variables */
deliveryManForm: FormGroup;
disableSubmit: boolean = false;
isSubmitted: boolean = false;
newDeliveryMan: DeliveryMan;
areas = [];
deliveryMen = [];
/* #endregion */

  constructor(
    private formBuilder: FormBuilder,
    private deliveryManService: DeliverymanService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.deliveryManForm = this.formBuilder.group({
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

  }

   // convenience getter for easy access to form fields. For fetching error on HTML side.
   get f() {
    return this.deliveryManForm.controls;
  }

  // Method: Fetch Areas using service to populate dropdown.
  getAreas(): void {
    this.areas = Areas;
  }

  // Method: Save a new consumer by calling create consumer service.
  onSubmit() {
    this.isSubmitted = true;
    this.disableSubmit = true;
    var formValues = this.deliveryManForm.value;
    // Check if form values are valid.
    if (this.deliveryManForm.invalid) {
      console.log("Failed" + JSON.stringify(formValues));
      console.log(
        "Failed" + JSON.stringify(this.deliveryManForm.controls.getError)
      );
      return;
    }
    var createdAt = new Date();
    var createdBy = "Admin"; /// This needs to be fetched from current user context.
    
    // New Consumer Object.
    this.newDeliveryMan = {
      firstName: formValues.firstName,
      middleName: formValues.middleName,
      lastName: formValues.lastName,
      mobileNumber: formValues.mobileNumber,
      address: formValues.address,
      area: formValues.area[0].text,
      createdAt: createdAt,
      createdBy: createdBy,
    };

    this.deliveryManService.addDeliveryMan(this.newDeliveryMan).subscribe(
      (out) => {
        console.log("Success" + JSON.stringify(this.newDeliveryMan));
        console.log("Success" + JSON.stringify(out));
        if (out.httpStatusCode == 200 && out.response == true) {
          this.toastr.success(out.message, "Success");
          this.onReset();
        } else {
          //Toaster Error message.
          this.toastr.error("Error while saving Delivery Man", "Failure");
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
    this.deliveryManForm.reset();
  }

}
