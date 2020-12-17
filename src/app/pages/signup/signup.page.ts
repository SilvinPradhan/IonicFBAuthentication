import { Router } from "@angular/router";
import { AuthService } from "./../../services/auth.service";
import { Component, OnInit } from "@angular/core";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  fname: string = "";
  lname: string = "";
  email: string = "";
  password: string = "";
  message = "";

  // Validation Error
  errorMessage = "";

  // For firebase error handlings
  error: { name: string; message: string } = { name: "", message: "" };

  constructor(private authservice: AuthService, private router: Router) {}

  ngOnInit(): void {}

  clearErrorMessage() {
    this.errorMessage = "";
    this.error = { name: "", message: "" };
  }

  register() {
    this.clearErrorMessage();
    if (this.validateForm(this.email, this.password)) {
      this.authservice
        .registerWithEmail(this.email, this.password)
        .then(() => {
          this.message = "Your credentials has been registered to Firebase";
        })
        .then(() => {
          this.router.navigate(["/home/user-info"]);
        })
        .catch((_error) => {
          this.error = _error;
          this.router.navigate(["/register"]);
        });
    }
  }

  validateForm(email: string, password: string) {
    if (email.length === 0) {
      this.errorMessage = "please enter email id";
      return false;
    }

    if (password.length === 0) {
      this.errorMessage = "please enter password";
      return false;
    }

    if (password.length < 6) {
      this.errorMessage = "password should be at least 6 char";
      return false;
    }

    this.errorMessage = "";
    return true;
  }
}
