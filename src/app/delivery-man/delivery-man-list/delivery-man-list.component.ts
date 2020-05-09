import { Component, OnInit,  AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { DeliveryMan } from "src/app/shared/models/DeliveryMan";
import { Subject,Subscription } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { DeliverymanService } from "src/app/shared/services/deliveryman.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-delivery-man-list',
  templateUrl: './delivery-man-list.component.html',
  styleUrls: ['./delivery-man-list.component.css']
})
export class DeliveryManListComponent implements OnInit,AfterViewInit, OnDestroy  {

  /* #region  Global variables */
  // Datatable properties..
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  timerSubscription: Subscription;
  deliveryMen: DeliveryMan[];
  /* #endregion */

  constructor(
    private deliveryManService: DeliverymanService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    
    //Set Datatable options.
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      autoWidth: false,
      processing: true,
    };
    // Call det deliveryMan service to fetch all active Delivery men account 
    // and populate to table.
    this.getDeliveryMen();
  }

  // Method: Call DeliveryMan service to fetch delivery men through REST API.
  getDeliveryMen() {
    console.log("Get DM called....");
    this.deliveryManService.getDeliveryMen().subscribe(
      (res) => {
        //On successfull response.
        if (res != null && res.httpStatusCode == 200 && res.response != null) {
          console.log(
            "Fetched Delivery Men",
            `${res.httpStatusCode} :${JSON.stringify(res.response)}`
          );
          // Assign fetched response to deliveryMen global variable.
          this.deliveryMen =  res.response;
          this.rerender();
        } else {
          // Toaster Error: Failed to fetch deliveryMen.
          this.rerender();
          if (res != null) {
            this.toastr.error(res.message, "Error");
            console.log("Error : \n", `${res.httpStatusCode} : ${res.message}`);
          } else {
            this.toastr.error("Failed to Fetch Delivery Men.", "Error");
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

  // Method: Refreshes the datatable.
  rerender() {
        this.dtElement.dtInstance.then((dtInstance : DataTables.Api) => 
        {
            // Destroy the table first in the current context
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
           this.dtTrigger.next();
        });
  } 
  // Destroy datatable instance
  ngOnDestroy(): void {    
    this.dtTrigger.unsubscribe();    
  } 
  // Trigger Datatable instance.
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  updateDeliveryMan(deliveryManId: string) {
    console.log("conAccId",deliveryManId);
    this.router.navigate(["deliveryman/update", deliveryManId]);
  }

   deleteDeliveryMan(deliveryMan:DeliveryMan) {
    Swal.fire({
      title: `Delete ${deliveryMan.firstName} ${deliveryMan.lastName} ?`,
      text: `You will not be able to recover this.`,
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        
        this.deliveryManService.deleteDeliveryMan(deliveryMan.deliveryManId).subscribe(
          (res) => {
            console.log("Success Output : " + JSON.stringify(res));
            if (res != null && res.httpStatusCode == 200 && res.response == true) {
              // Remove row from table.
              this.deliveryMen = this.deliveryMen.filter(
                ({deliveryManId}) => deliveryManId !== deliveryMan.deliveryManId);
              console.log("Removed delivery man from table.");
              this.rerender();
              // Success message through swal or toaster.
              Swal.fire(
                "Deleted!",
                `${deliveryMan.firstName} ${deliveryMan.lastName} has been deleted.`,
                "success"
              );
            } else {
              // Toaster Erorr message.
              if (res != null) {
                this.toastr.error(`${res.message}`, "Error");
              } else {
                this.toastr.error("Unable to delete.","Error");     
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
        Swal.fire("Cancelled", "Delivery Man is not deleted.", "error");
      }
    });
  }

}
