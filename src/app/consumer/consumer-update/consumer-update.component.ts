import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Consumer } from "src/app/shared/models/Consumer";
import { Tiffin } from "src/app/shared/models/Tiffin";
import { ConsumerService } from "src/app/shared/services/consumer.service";
import { DeliverymanService } from "src/app/shared/services/deliveryman.service";
import { Areas, tiffinSize } from "src/app/shared/appConfig";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-consumer-update",
  templateUrl: "./consumer-update.component.html",
  styleUrls: ["./consumer-update.component.css"],
})
export class ConsumerUpdateComponent implements OnInit {
  /* #region  Global Variabes */
  updateForm: FormGroup;
  isSubmitted:boolean = false;
  disableSumbit:boolean = false;
  storedConsumer: Consumer;
  updatedConsumer: Consumer;
  storedTiffin: Tiffin;
  updatedTiffin: Tiffin;
  storedArea;
  storedDeliveryMan;
  storedTiffinSize;
  areas = [];
  deliveryMen = [];
  tiffinSizes: any[];
  /* #endregion */

  //Initialize services.
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private consumerService: ConsumerService,
    private deliveryManService: DeliverymanService,
    private toastr: ToastrService
  ) {}

  // Create Form & patch values of fetched consumer.
  ngOnInit() {
    //Create Form.
    this.updateForm = this.formBuilder.group({
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
      tiffinNumber: [""],
      tiffinSize: ["", Validators.required],
      tiffinRate: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    });

    /* #region  Fetch Dropdown values */
    this.getAreas();
    this.getTiffinSize();
    this.getDeliveryMen();
    /* #endregion */

    //Fetch Consumer using consumerID provided in route parameter.
    this.route.paramMap.subscribe((params) => {
      const consumerId = params.get("consumerId");
      if (consumerId && consumerId != null) {
        this.getConsumerById(consumerId);
      }
    });
  }

   // convenience getter for easy access to form fields. For fetching error on HTML side.
   get f() {
    return this.updateForm.controls;
  }

  getDeliveryMen(): void {
    this.deliveryManService.getDeliveryMen().subscribe((dm) => {
      if (dm != null && dm.httpStatusCode == 200) {
        this.deliveryMen = dm.response.map((d) => ({
          id: d.deliveryManId,
          text: `${d.firstName} ${d.lastName}`,
        }));
        console.log(`${dm.httpStatusCode} :${JSON.stringify(dm.response)}`);
      } else {
        this.deliveryMen = [];
        console.log(`${dm.httpStatusCode} : ${dm.message}`);
        // Toaster Error: Failed to fetch Delivery Men.
      }
    });
  }

  getAreas(): void {
    this.areas = Areas;
  }

  getTiffinSize(): void {
    this.tiffinSizes = tiffinSize;
  }

  getConsumerById(consumerId: string) {
    this.consumerService.getConsumer(consumerId).subscribe(
      (res) => {
      if (res != null) {
        if (res.httpStatusCode == 200 && res.response != null) {
          console.log("Fetched Consumer : ", JSON.stringify(res.response));
          this.storedConsumer = res.response;
          this.storedTiffin = this.storedConsumer.tiffin;
          // Assign Deliveryman using ternary operator.......
          this.storedDeliveryMan =
            this.storedConsumer.deliveryMan != null
              ? [
                  {
                    id: this.storedConsumer.deliveryMan.deliveryManId,
                    text: `${this.storedConsumer.deliveryMan.firstName} ${this.storedConsumer.deliveryMan.lastName}`,
                  },
                ]
              : "";

          this.storedTiffinSize = [
            {
              id: this.storedTiffin.size,
              text: this.storedTiffin.size,
            },
          ];

          this.storedArea = [
            {
              id: this.storedConsumer.area,
              text: this.storedConsumer.area,
            },
          ];
          //Patch fetched values to the form.
          this.patchValues();
        } else {
          // Toaster Error: Failed to fetch Consumer.
          this.toastr.error("Failed to Fetch Consumer.", "Error");
        }
      } else {
        // Toaster Error: Consumer with consumer ID not found.
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
    this.updateForm.patchValue({
      firstName: this.storedConsumer.firstName,
      middleName: this.storedConsumer.middleName,
      lastName: this.storedConsumer.lastName,
      mobileNumber: this.storedConsumer.mobileNumber,
      itsId: this.storedConsumer.itsId,
      sabilNumber: this.storedConsumer.sabilNumber,
      address: this.storedConsumer.address,
      tiffinNumber: this.storedTiffin.number,
      tiffinRate: this.storedTiffin.rate,
    });

    this.updateForm.controls["area"].setValue(this.storedArea, {
      onlySelf: true,
    });
    this.updateForm.controls["tiffinSize"].setValue(this.storedTiffinSize, {
      onlySelf: true,
    });
    this.updateForm.controls["deliveryManId"].setValue(this.storedDeliveryMan, {
      onlySelf: true,
    });
  }

  // Save the updated consumer.
  onSave() {
    this.isSubmitted = true;
    this.disableSumbit = true;
    var formValues = this.updateForm.value;
    // Check if form values are valid. If Invalid return.
    if (this.updateForm.invalid) {
      console.log("Form Invalid. Form Values : " + JSON.stringify(formValues));
      console.log(
        "Form Invalid. Form Errors : " +
          JSON.stringify(this.updateForm.controls.getError)
      );
      return;
    }
    // Set Modified At and Modified By Values
    var modifiedAt = new Date();
    var modifiedBy = "Admin"; /// This needs to be fetched from current user context.

    // change modified Date only if tiffin is updated....
    if (
      this.storedTiffin.rate != Math.trunc(formValues.tiffinRate) ||
      this.storedTiffin.size != formValues.tiffinSize[0].text
      // ||this.storedTiffin.number != formValues.tiffinNumber  //Tiffin Number field is read only....
    ) {
      this.updatedTiffin = {
        tiffinId: this.storedTiffin.tiffinId,
        size: formValues.tiffinSize[0].text,
        rate: Math.trunc(formValues.tiffinRate),
        number: formValues.tiffinNumber, 
        modifiedAt: modifiedAt,
        modifiedBy: modifiedBy,
        createdAt: this.storedTiffin.createdAt,
        createdBy: this.storedTiffin.createdBy,
      };
    } else {
      this.updatedTiffin = this.storedTiffin;
    }

    // Prepare object for updated consumer.
    this.updatedConsumer = {
      consumerId: this.storedConsumer.consumerId,
      firstName: formValues.firstName,
      middleName: formValues.middleName,
      lastName: formValues.lastName,
      mobileNumber: formValues.mobileNumber,
      address: formValues.address,
      itsId: formValues.itsId,
      sabilNumber: formValues.sabilNumber,
      area: formValues.area[0].text,
      tiffin: this.updatedTiffin,
      isActive: true,
      deliveryManId: formValues.deliveryManId[0].id,
      modifiedAt: modifiedAt,
      modifiedBy: modifiedBy,
      createdAt: this.storedConsumer.createdAt,
      createdBy: this.storedConsumer.createdBy,
    };

    // Call consumer service to update consumer.
    this.consumerService.updateConsumer(this.updatedConsumer).subscribe(
      (out) => {
        console.log(
          "Updated Consumer : " + JSON.stringify(this.updatedConsumer)
        );
        console.log("Success Output : " + JSON.stringify(out));
        if (out.httpStatusCode == 200 && out.response == true) {
          // Toaster Success message. Use out.message.
          this.toastr.success(out.message, "Success");
          this.router.navigate(["consumer/list"]);
        } else {
          // Toaster Erorr message.
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

  // Reset the form with fetched values.
  onReset() {
    this.isSubmitted = false;
    this.disableSumbit = false;
    this.patchValues();
  }
}
