import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  loading: boolean;
  splash: boolean;
  validationsForm: FormGroup;
  matching_passwords_group: FormGroup;
  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': [
      { type: 'required', message: 'El email es necesario para acceder.' },
      { type: 'pattern', message: 'Ingrese un email valido.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'The phone is incorrect for the selected country.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es necesaria.' },
      { type: 'minlength', message: 'La contraseña tiene que tener al menos 5 caracteres.' },
      { type: 'pattern', message: 'La contraseña tiene que tener al menos una mayuscula, un numero y un caracter.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required.' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch.' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };

  constructor(
    private  router:  Router,
    public afAuth: AngularFireAuth,
    public formBuilder: FormBuilder
  ) {
    this.loading = false;
    this.splash = true;
  }

  ngOnInit() {
    this.loading = false;
    this.ionViewDidLoad();

    const REGEXP = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    this.validationsForm = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern(REGEXP)
        ])),
        password: new FormControl('', Validators.compose([
          Validators.minLength(5),
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        ]))
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    setTimeout(() => this.splash = false, 3000);
  }

  async login() {
    console.log('login');
    this.loading = true;
    try {

      const response = await this.afAuth.auth.signInWithEmailAndPassword(this.validationsForm.value.email, this.validationsForm.value.password);
      console.log(response);
      if (response.user) {
        this.loading = false;
        this.router.navigateByUrl('bienvenido');
      }

    } catch (err) {
        this.loading = false;
        if (err.code === 'auth/user-not-found' ) {
            console.dir(err);
        } else {
          console.dir(err);
        }
    }
  }



  // cargarUsuario(user) {
  //   switch (user) {
  //      case 'admin': {
  //         this.email = 'admin@gmail.com';
  //         this.password = '111111';
  //         break;
  //      }
  //      case 'invitado': {
  //        this.email = 'invitado@gmail.com';
  //        this.password = '222222';
  //         break;
  //      }
  //      case 'usuario': {
  //        this.email = 'usuario@gmail.com';
  //        this.password = '333333';
  //         break;
  //      }
  //      case 'D': {
  //         console.log('Poor');
  //         break;
  //      }
  //      default: {
  //         console.log('Invalid choice');
  //         break;
  //      }
  //   }
  // }

  cargarUsuario(user) {

    switch (user) {
       case 'admin': {
           this.validationsForm = this.formBuilder.group({
             email: ['admin@gmail.com',
               Validators.compose([Validators.required, Validators.email])],
             password: [
              '111111',
               Validators.compose([Validators.required, Validators.minLength(6)]),
             ],
           });
           break;
       }
       case 'invitado': {
         this.validationsForm = this.formBuilder.group({
           email: ['invitado@gmail.com',
             Validators.compose([Validators.required, Validators.email])],
           password: [
            '222222',
             Validators.compose([Validators.required, Validators.minLength(6)]),
           ],
         });
         break;
       }
       case 'user': {
         this.validationsForm = this.formBuilder.group({
           email: ['usuario@gmail.com',
             Validators.compose([Validators.required, Validators.email])],
           password: [
            '333333',
             Validators.compose([Validators.required, Validators.minLength(6)]),
           ],
         });
         break;
       }
       case 'anon': {
          this.validationsForm = this.formBuilder.group({
             email: ['anonimo@gmail.com',
               Validators.compose([Validators.required, Validators.email])],
             password: [
              '444444',
               Validators.compose([Validators.required, Validators.minLength(6)]),
             ],
           });
          break;
       }
       case 'test': {
         this.validationsForm = this.formBuilder.group({
            email: ['tester@gmail.com',
              Validators.compose([Validators.required, Validators.email])],
            password: [
             '555555',
              Validators.compose([Validators.required, Validators.minLength(6)]),
            ],
          });
          break;
       }
       default: {
          console.log(user);
          break;
       }
     }
  }

}
