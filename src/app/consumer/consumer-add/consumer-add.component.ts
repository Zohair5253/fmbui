import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ConsumerService } from "src/app/shared/services/consumer.service";
import { Consumer } from "src/app/shared/models/Consumer";
import { Areas, tiffinSize } from "src/app/shared/appConfig";
import { DeliverymanService } from "src/app/shared/services/deliveryman.service";
import { Tiffin } from "src/app/shared/models/Tiffin";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-consumer-add",
  templateUrl: "./consumer-add.component.html",
  styleUrls: ["./consumer-add.component.css"],
})
export class ConsumerAddComponent implements OnInit {
  /* #region  Global variables */
  consumerForm: FormGroup;
  isSubmitted:boolean = false;
  disableSubmit:boolean = false;
  newConsumer: Consumer;
  newTiffin: Tiffin;
  areas = [];
  deliveryMen = [];
  tiffinSizes: any[];
  /* #endregion */

  constructor(
    private formBuilder: FormBuilder,
    private consumerService: ConsumerService,
    private deliveryManService: DeliverymanService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.consumerForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      mobileNumber: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{10,10}$")],
      ],
      address: ["", Validators.required],
      itsId: ["", [Validators.required, Validators.pattern("^[0-9]{8,8}$")]],
      sabilNumber: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      area: ["", Validators.required],
      deliveryManId: [""],
      tiffinSize: ["", Validators.required],
      tiffinRate: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    });

    this.getAreas();
    this.getTiffinSize();
    this.getDeliveryMen();
  }

   // convenience getter for easy access to form fields. For fetching error on HTML side.
   get f() {
    return this.consumerForm.controls;
  }

  // Method: Fetch deliverry Men using service to populate dropdown.
  getDeliveryMen(): void {
    this.deliveryManService.getDeliveryMen().subscribe(
      (res) => {
        if (res != null && res.httpStatusCode == 200 && res.response != null) {
          this.deliveryMen = res.response.map((d) => ({
            id: d.deliveryManId,
            text: `${d.firstName} ${d.lastName}`,
          }));
          console.log(
            "Fetched DM ",
            `${res.httpStatusCode} :${JSON.stringify(res.response)}`
          );
        } else {
          if (res != null) {
            this.toastr.error(res.message, "Delivery Men not found...!!!");
            console.log(
              "Error fetching DM",
              `${res.httpStatusCode} : ${res.message}`
            );
          } else {
            this.toastr.error("Failed to fetch Delivery Men.", "Error");
          }
          this.deliveryMen = [];
        }
      },
      (error) => {
        console.error("Service Failure", error);
        this.toastr.error(error, "Service Failure");
      }
    );
  }

  // Method: Fetch Areas using service to populate dropdown.
  getAreas(): void {
    this.areas = Areas;
  }

  // Method: Fetch Tiffin Size using service to populate dropdown.
  getTiffinSize(): void {
    this.tiffinSizes = tiffinSize;
  }

  // Method: Save a new consumer by calling create consumer service.
  onSubmit() {
    this.isSubmitted = true;
    this.disableSubmit = true;
    var formValues = this.consumerForm.value;
    // Check if form values are valid.
    if (this.consumerForm.invalid) {
      console.log("Failed" + JSON.stringify(formValues));
      console.log(
        "Failed" + JSON.stringify(this.consumerForm.controls.getError)
      );
      return;
    }
    var createdAt = new Date();
    var createdBy = "Admin"; /// This needs to be fetched from current user context.
    // New tiffin object associated with consumer.
    this.newTiffin = {
      size: formValues.tiffinSize[0].text,
      rate: Math.trunc(formValues.tiffinRate),
      // number:"785"  // Auto increment using SQL sequence.
      createdAt: createdAt,
      createdBy: createdBy,
    };
    // New Consumer Object.
    this.newConsumer = {
      firstName: formValues.firstName,
      middleName: formValues.middleName,
      lastName: formValues.lastName,
      mobileNumber: formValues.mobileNumber,
      address: formValues.address,
      itsId: formValues.itsId,
      sabilNumber: formValues.sabilNumber,
      area: formValues.area[0].text,
      tiffin: this.newTiffin,
      isActive: true,
      deliveryManId: formValues.deliveryManId[0].id,
      createdAt: createdAt,
      createdBy: createdBy,
    };

    this.consumerService.addConsumer(this.newConsumer).subscribe(
      (out) => {
        console.log("Success" + JSON.stringify(this.newConsumer));
        console.log("Success" + JSON.stringify(out));
        if (out.httpStatusCode == 200 && out.response == true) {
          this.toastr.success(out.message, "Success");
          this.onReset();
        } else {
          //Toaster Error message.
          this.toastr.error("Error while saving consumer", "Failure");
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
    this.consumerForm.reset();
  }
}
