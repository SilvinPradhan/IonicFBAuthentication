import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";

  // Validation Error
  errorMessage = "";

  // For firebase error handlings
  error: { name: string; message: string } = { name: "", message: "" };

  // Constructor
  constructor(private authservice: AuthService, private router: Router) {}

  ngOnInit(): void {}

  clearErrorMessage() {
    this.errorMessage = "";
    this.error = { name: "", message: "" };
  }

  login() {
    this.clearErrorMessage();
    if (this.validateForm(this.email, this.password)) {
      this.authservice
        .loginWithEmail(this.email, this.password)
        .then(() => {
          this.router.navigate(["/home/user-info"]);
        })
        .catch((_error) => {
          this.error = _error;
          this.router.navigate(["/login"]);
        });
    }
  }

  validateForm(email: string, password: string) {
    if (email.length === 0) {
      this.errorMessage = "please enter email id, Try again.";
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
