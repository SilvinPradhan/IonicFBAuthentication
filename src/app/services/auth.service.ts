import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable, NgZone } from '@angular/core';

@Injectable({
	providedIn: 'root',
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
				localStorage.setItem('user', JSON.stringify(this.userData));
				JSON.parse(localStorage.getItem('user'));
			} else {
				localStorage.setItem('user', null);
				JSON.parse(localStorage.getItem('user'));
			}
		});
	}

	registerWithEmail(email: string, password: string) {
		return this.afu
			.createUserWithEmailAndPassword(email, password)
			.then((result) => {
				console.log(result);
				// send email verification
			})
			.catch((error) => {
				window.alert(error.message);
				console.log(error);
				throw error;
			});
	}

	loginWithEmail(email: string, password: string) {
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

	signOut() {
		return this.afu.signOut().then(() => {
			localStorage.removeItem('user');
			this.router.navigate(['/login']);
		});
		// this.afu.signOut();
		// this.router.navigate(["/login"]);
	}
}
