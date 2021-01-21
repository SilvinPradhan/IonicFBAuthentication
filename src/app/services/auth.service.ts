import { User } from "./../shared/services/user";
import { Router } from "@angular/router";
import auth from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Injectable, NgZone } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userData: any; // save logged in us er data
  authState: any = null;
  hasVerifiedEmail = true;

  constructor(
    public afu: AngularFireAuth,
    private router: Router,
    public afs: AngularFirestore,
    public ngZone: NgZone // Remove outside scope warning
  ) {
    // Saving user data in localStorage when logged in and setting up null when logged out;
    this.afu.authState.subscribe((auth) => {
      if (auth) {
        this.userData = auth;
        localStorage.setItem("user", JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem("user"));
      } else {
        localStorage.setItem("user", null);
        JSON.parse(localStorage.getItem("user"));
      }
    });
  }

  // All firebase getData functions

  get isUserAnonymousLoggedIn(): boolean {
    return this.authState !== null ? this.authState.isAnonymous : false;
  }

  get currentUserId(): string {
    return this.authState !== null ? this.authState.uid : "";
  }

  get currentUserName(): string {
    return this.authState["email"];
  }

  get currentUser(): any {
    return this.authState !== null ? this.authState : null;
  }

  get isUserEmailLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      this.authState !== null &&
      !this.isUserAnonymousLoggedIn &&
      this.authState.emailVerified !== false
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Return true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    return user.emailVerified !== false ? true : false;
  }

  async registerWithEmail(email: string, password: string) {
    return this.afu
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // send email verification
        this.authState.sendVerificationEmail();
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
        console.log(error);
        throw error;
      });
  }

  // Send verification email when new user sign up
  // async sendVerificationEmail() {
  //   await this.afu.currentUser.sendVerificationEmail().then(() => {
  //     this.router.navigate(["verify-email"]);
  //   });
  // }

  async sendVerificationEmail() {
    await this.afu.currentUser
      .then((u) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(["verify-email"]);
      });
  }

  async loginWithEmail(email: string, password: string) {
    return this.afu
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  // Setting up user data when sign in with username/password, sign up with username/password.

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  signOut() {
    return this.afu.signOut().then(() => {
      localStorage.removeItem("user");
      this.router.navigate(["/login"]);
    });
    // this.afu.signOut();
    // this.router.navigate(["/login"]);
  }
}
