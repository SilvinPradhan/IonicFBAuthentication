import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-user-info',
	templateUrl: './user-info.page.html',
	styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {
	constructor(public authservice: AuthService, private router: Router) {}

	ngOnInit(): void {}
}
