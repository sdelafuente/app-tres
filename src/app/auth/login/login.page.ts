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
    this.loading = false;
  }

  async login() {
    this.loading = true;
    try {

      const response = await this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password);
      // console.log(response);
      if (response.user) {
        this.loading = false;
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



  cargarUsuario(user) {
    switch (user) {
       case 'admin': {
          this.email = 'admin@gmail.com';
          this.password = '111111';
          break;
       }
       case 'invitado': {
         this.email = 'invitado@gmail.com';
         this.password = '222222';
          break;
       }
       case 'usuario': {
         this.email = 'usuario@gmail.com';
         this.password = '333333';
          break;
       }
       case 'D': {
          console.log('Poor');
          break;
       }
       default: {
          console.log('Invalid choice');
          break;
       }
    }
  }


}
