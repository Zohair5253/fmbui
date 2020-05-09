import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthenticationService } from "src/app/shared/services/authentication.service";
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /* #region  Global variables */
  loginForm: FormGroup;
  isSubmitted: boolean = false;
  disableSubmit: boolean = false;
  returnUrl: string;
  /* #endregion */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    document.body.className = "hold-transition login-page";
    
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = '/';
  }

  // convenience getter for easy access to form fields. For fetching error on HTML side.
  get f() {
    return this.loginForm.controls;
  }


  login() {
    this.isSubmitted = true;
    this.disableSubmit = true;
    var formValues = this.loginForm.value;
    // Check if form values are valid.
    if (this.loginForm.invalid) {
      console.log("Failed" + JSON.stringify(formValues));
      console.log(
        "Failed" + JSON.stringify(this.loginForm.controls.getError)
      );
      this.disableSubmit = false
      return;
    }

    this.authenticationService.login(formValues.username,formValues.password)
      .pipe(first())
      .subscribe(
        (out) => {
          console.log("Success");
          console.log("Success" + JSON.stringify(out));
          if (out != null && out.httpStatusCode == 200 && out.response != null) {
            this.toastr.success(out.message, "Success");
            this.router.navigate([this.returnUrl]);
          } else {
            //Toaster Error message.
            this.disableSubmit = false;
            if (out != null) {
              this.toastr.error(out.message,"Error");
            } else {
              this.toastr.error("Error while Login", "Failure");
            }
          }
        },
        (error) => {
          this.disableSubmit = false;
          //On Error.
          console.error("Service Failure", error);
          //Toaster Error
          this.toastr.error(error, "Service Failure");
        });
  }
    

}
