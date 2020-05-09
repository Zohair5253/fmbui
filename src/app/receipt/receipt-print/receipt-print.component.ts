import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ReceiptService } from 'src/app/shared/services/receipt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Receipt } from 'src/app/shared/models/Receipt';

@Component({
  selector: 'app-receipt-print',
  templateUrl: './receipt-print.component.html',
  styleUrls: ['./receipt-print.component.css']
})
export class ReceiptPrintComponent implements OnInit {
  receipt: Receipt;

  constructor(
    private _location: Location,
    private receiptService: ReceiptService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    
    //Fetch Receipt using ReceiptId provided in route parameter.
    this.route.paramMap.subscribe((params) => {
      const receiptId = params.get("receiptId");
      if (receiptId && receiptId != null) {
        this.getReceiptById(receiptId);
      }
    });

  }

   // Method: Fetch Receipt.
  // Parameter: receiptId.
  getReceiptById(receiptId: string) {
    console.log("Inside getReceiptById", receiptId);

    this.receiptService.getReceiptById(receiptId).subscribe(
      (res) => {
        if (res != null && res.httpStatusCode == 200 && res.response != null) {
          console.log("fetched", JSON.stringify(res));

          this.receipt = res.response;
          // window.print();
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

  backClicked() {
    this._location.back();
    
  }
}
