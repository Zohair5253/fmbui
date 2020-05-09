import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from "@angular/core";
import { ConsumerAccount } from "src/app/shared/models/ConsumerAccount";
import { Subject, Subscription } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { ConsumerAccountService } from "src/app/shared/services/consumer-account.service";
import { AppConfigService } from "src/app/shared/services/app-config.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: "app-consumer-account-list",
  templateUrl: "./consumer-account-list.component.html",
  styleUrls: ["./consumer-account-list.component.css"],
})
export class ConsumerAccountListComponent implements OnInit,AfterViewInit, OnDestroy {

  /* #region  Global variables */
  // Datatable properties..
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  timerSubscription: Subscription;
  yearFilterForm: FormGroup;
  consumerAccounts: ConsumerAccount[];
  financialYears = [];
  currentFY = [];
  /* #endregion */

  constructor(
    private consumerAccService: ConsumerAccountService,
    private router: Router,
    private toastr: ToastrService,
    private appConfigService: AppConfigService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // Create Financial Year filter form.
    this.yearFilterForm = this.formBuilder.group({
      year: ["", Validators.required],
    });

    // Set the current Financial Year.
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth();
    this.currentFY =
    currentMonth > 2
    ? [{id:`${currentYear}-${currentYear+1}`,text:`${currentYear}-${currentYear+1}`}]
    : [{id:`${currentYear-1}-${currentYear}`,text:`${currentYear-1}-${currentYear}`}];

    //Get the Financial Years to populate dropdown & set currentFY as default.
    this.getFinancialYears();

    //Set Datatable options.
    this.dtOptions = {
        pagingType: "full_numbers",
        pageLength: 10,
        autoWidth: false,
        processing: true,
      };
      // Call getConsumerAcount service to fetch all active consumer account 
      // and populate to table.
      this.getConsumerAccounts(this.currentFY[0].text);
  }

  // convenience getter for easy access to form fields. For fetching error on HTML side.
  get f() {
    return this.yearFilterForm.controls;
  }

  // Method : Fetch Financial Years using app config service to populate Year dropdown.
  getFinancialYears(): void {
    this.financialYears = this.appConfigService
      .getFinancialYears()
      .map((year) => ({
        id: year,
        text: year,
      }));
      this.yearFilterForm.controls["year"].setValue(this.currentFY, {
      onlySelf: true,
    });
  }

  // Filter the Consumer Account based on FY.
  filterConsumerAccounts(): void {
    console.log("Filter");  
    var formValues = this.yearFilterForm.value;
    this.getConsumerAccounts(formValues.year[0].text);
    // this.consumerAccService.getConsumerAccountsByYear(formValues.year[0].text).subscribe(res => {
    //   this.consumerAccounts = res.response;
    //   this.rerender();
    // })
  }

  // Method: Call Consumer Account service to fetch consumer accounts through REST API.
  getConsumerAccounts(year: string) {
    console.log("Get Consumer accounts called....");
    console.log(year);
    // Use consumerAccService.getConsumerAccounts Method to fetch all consumer accounts.
    this.consumerAccService.getConsumerAccountsByYear(year).subscribe(
      (res) => {
        //On successfull response.
        if (res != null && res.httpStatusCode == 200 && res.response != null) {
          console.log(
            "Fetched Consumer Accounts",
            `${res.httpStatusCode} :${JSON.stringify(res.response)}`
          );
          // Assign fetched response to consumer accounts global variable.
          this.consumerAccounts =  res.response;
          // this.dtTrigger.next();
          this.rerender();
        } else {
          // Toaster Error: Failed to fetch consumer accounts.
          // this.dtTrigger.next();
          this.rerender();
          if (res != null) {
            this.toastr.error(res.message, "Error");
            console.log("Error : \n", `${res.httpStatusCode} : ${res.message}`);
          } else {
            this.toastr.error("Failed to Fetch Consumer Accounts.", "Error");
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

  ngOnDestroy(): void {    
    this.dtTrigger.unsubscribe();    
  } 
  
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
 
  viewConsumerAcc(consumerAccId:string) {
    console.log("conAccId",consumerAccId);
    this.router.navigate(["consumerAccount/view", consumerAccId]);
  }

  updateConsumerAcc(consumerAccId: string) {
    console.log("conAccId",consumerAccId);
    this.router.navigate(["consumerAccount/update", consumerAccId]);
  }

   deleteConsumerAcc(consumerAcc:ConsumerAccount) {
    Swal.fire({
      title: `Delete Consumer Account of ${consumerAcc.consumer.firstName} ${consumerAcc.consumer.lastName} ?`,
      text: `You will not be able to recover this consumer account for FY ${consumerAcc.year}!`,
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        
        this.consumerAccService.deleteConsumerAccount(consumerAcc.consumerAccountId).subscribe(
          (res) => {
            console.log("Success Output : " + JSON.stringify(res));
            if (res.httpStatusCode == 200 && res.response == true) {
              // Remove row from table.
              this.consumerAccounts = this.consumerAccounts.filter(
                ({consumerAccountId}) => consumerAccountId !== consumerAcc.consumerAccountId);
              console.log("Removed consumer from table.");
              this.rerender();
              // Success message through swal or toaster.
              Swal.fire(
                "Deleted!",
                `Consumer Account of ${consumerAcc.consumer.firstName} ${consumerAcc.consumer.lastName} has been deleted.`,
                "success"
              );
            } else {
              // Toaster Erorr message.
              this.toastr.error(`${res.message}`, "Error");
            }
          },
          (error) => {
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
