import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  loading: boolean;

  constructor(
    private  router:  Router,
    public afAuth: AngularFireAuth
  ) {
    this.loading = false;
  }

  ngOnInit() {
  }

  async login() {
    this.loading = true;
    try {

      const response = await this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password);
      // console.log(response);
      if (response.user) {
        this.router.navigateByUrl('bienvenido');
      }

    } catch (err) {
        this.loading = false;
        // if (err.code === 'auth/user-not-found' ) {
        //     console.dir(err);
        // } else {
        //   console.dir(err);
        // }
    }
  }

}
