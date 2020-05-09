import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ConsumerService } from "src/app/shared/services/consumer.service";
import { Consumer } from "src/app/shared/models/Consumer";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";


@Component({
  selector: "app-consumer-list",
  templateUrl: "./consumer-list.component.html",
  styleUrls: ["./consumer-list.component.css"]
})
export class ConsumerListComponent implements AfterViewInit, OnInit {
  /* #region  Global variables */
  consumers: Consumer[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtElement: DataTableDirective;
  /* #endregion */

  constructor(
    private consumerService: ConsumerService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Call getConsumer service to fetch all active consumers and populate to Table.
    this.getConsumers();
  }

  ngAfterViewInit(): void {
    // this.dtTrigger.next();
  }

  // Method: Call Consumer service to fetch consumers through REST API.
  getConsumers(): void {
    console.log("Get Consumers called....");
    //Set Datatable options.
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      autoWidth: false,
      processing: true
    };
    // Use consumerService.getConsumer Method to fetch all consumers.
    this.consumerService.getConsumers().subscribe(
      res => {
        //On successfull response.
        if (res != null && res.httpStatusCode == 200 && res.response != null) {
          console.log(
            "Fetched Consumers",
            `${res.httpStatusCode} :${JSON.stringify(res.response)}`
          );
          // Assign fetched response to consumer global variable.
          this.consumers = res.response;
          // Refresh the datatable.
          this.dtTrigger.next();
        } else {
          // Toaster Error: Failed to fetch consumer.
          this.dtTrigger.next();
          if (res != null) {
            this.toastr.error(res.message, "Error");
            console.log("Error : \n", `${res.httpStatusCode} : ${res.message}`);
          } else {
            this.toastr.error("Failed to Fetch Consumers.", "Error");
          }
        }
      },
      error => {
        // On Error.
        console.error("Service Failure", error);
        // Toaster Error: Failed to fetch consumer.
        this.toastr.error(error, "Service Failure");
      }
    );
  }

  // Method : Call consumerUpdate component. 
  // Parameter: consumerId.
  updateConsumer(consumerId: string) {
    this.router.navigate(["consumer/update", consumerId]);
  }

  // Method : Call Consumer Service to delete consumer. 
  // Parameter: consumerId
  deleteConsumer(consumer: Consumer) {
    console.log("Consumer ID:", consumer.consumerId);
    Swal.fire({
      title: `Delete ${consumer.firstName} ${consumer.lastName} ?`,
      text: "You will not be able to recover this consumer!",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        consumer.isActive = false;
        consumer.isDeleted = true;
        consumer.deletedAt = new Date();
        consumer.deletedBy = "Admin"; //Update this value to current user name.
        this.consumerService.updateConsumer(consumer).subscribe(
          res => {
            console.log("Success Output : " + JSON.stringify(res));
            if (res.httpStatusCode == 200 && res.response == true) {
              // Remove row from table.
              this.consumers = this.consumers.filter(({consumerId}) => consumerId !== consumer.consumerId);
              console.log("Removed consumer from table.");
              
              // Success message through swal or toaster.
              Swal.fire(
                "Deleted!",
                `${consumer.firstName} ${consumer.lastName} has been deleted.`,
                "success"
              );
            } else {
              // Toaster Erorr message.
              this.toastr.error(`Failed to delete ${consumer.firstName} ${consumer.lastName}`, "Error");
            }
          },
          error => {
            // On Error.
            console.error("Service Failure", error);
            // Toaster Error: Failed to fetch consumer.
            this.toastr.error(error, "Service Failure");
          }
        );
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Consumer is not deleted.", "error");
      }
    });
  }

}
