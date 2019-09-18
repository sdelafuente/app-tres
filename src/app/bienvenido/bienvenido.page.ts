import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.page.html',
  styleUrls: ['./bienvenido.page.scss'],
})
export class BienvenidoPage implements OnInit {

  items: Observable<any[]>;

  public accX: any;
  public accY: any;
  public accZ: any;
  // public gyrX: any;
  // public gyrY: any;
  // public gyrZ: any;
  public promise: any;
  public promiseDos: any;
  public isVertial: any;
  public isHorizontal: any;
  public isLeft: any;
  public isRight: any;
  public isOn: any;
  private options: GyroscopeOptions = {
    frequency: 1000
 };

  constructor(
    private  router:  Router,
    public afAuth: AngularFireAuth,
    db: AngularFirestore,
    private gyroscope: Gyroscope,
    private deviceMotion: DeviceMotion,
    private flashlight: Flashlight,
    private vibration: Vibration,
    private nativeAudio: NativeAudio
  ) { }

  ngOnInit() {
    this.isVertial = false;
    this.isHorizontal = true;
    this.isLeft = false;
    this.isRight = false;
    this.isOn = false;
    this.cargarAudios();
  }

  // Giroscopio
  // gyrascope() {
  //
  //   this.gyroscope = new Gyroscope();
  //
  //   this.gyroscope.getCurrent()
  //    .then((orientation: GyroscopeOrientation) => {
  //
  //     })
  //    .catch();
  //
  //
  //   this.promiseDos = this.gyroscope.watch(this.options)
  //     .subscribe((orientation: GyroscopeOrientation) => {
  //       this.gyrX = orientation.x;
  //       this.gyrY = orientation.y;
  //       this.gyrZ = orientation.z;
  //     });
  // }

  // Acelerometro
  Accelerometer() {

      this.deviceMotion.getCurrentAcceleration().then(
        (acceleration: DeviceMotionAccelerationData) =>
         // console.log(acceleration),
        (error: any) => console.log(error)
      );

      // Watch device acceleration
      this.promise = this.deviceMotion.watchAcceleration(this.options)
      .subscribe((acceleration: DeviceMotionAccelerationData) => {

          this.accX = acceleration.x;
          this.accY = acceleration.y;
          this.accZ = acceleration.z;

          // // Izquierda
          if ( acceleration.x >= 2 && !this.isLeft) {
            this.isLeft = true;
            this.nativeAudio.play('sirena');
          }

          // Derecha
          if ( acceleration.x <= -2 && !this.isRight) {
            this.isRight = true;
            this.nativeAudio.play('train');
          }

          // Vertical
          if (acceleration.y > 8 && acceleration.z  < 2 && !this.isVertial && this.flashlight.available()) {
            this.isVertial = true;
            this.isHorizontal = false;
            this.flashlight.switchOn();
            this.nativeAudio.play('air-horn');
            setTimeout(() => this.flashlight.switchOff(), 5000);
          }

          // Horizontal
          if (acceleration.y < 2 && acceleration.z  > 8 && !this.isHorizontal) {
            this.isHorizontal = true;
            this.isVertial = false;
            this.vibration.vibrate(5000);
            this.nativeAudio.play('bike');
          }

      });
  }

  Stop() {

    if (this.promise !== undefined) {
      this.promise.unsubscribe();
    }
    if (this.promiseDos !== undefined) {
        this.promiseDos.unsubscribe();
    }
  }

  Clear() {
    this.isLeft = false;
    this.isRight = false;
    this.isVertial = false;
    this.isHorizontal = false;
    this.isOn = false;
  }

  logOut(): void {
    this.afAuth.auth.signOut().then( () => {
      this.nativeAudio.unload('air-horn');
      this.nativeAudio.unload('bike');
      this.nativeAudio.unload('sirena');
      this.nativeAudio.unload('train');
      this.router.navigateByUrl('login');
    });
  }

  Iniciar() {
    this.isOn = true;
    this.Accelerometer();
  }

  Detener() {
    this.Stop();
    this.Clear();
  }

  cargarAudios() {
    this.nativeAudio.preloadSimple('air-horn', 'assets/sounds/air-horn.wav');
    this.nativeAudio.preloadSimple('bike', 'assets/sounds/bike-horn.wav');
    this.nativeAudio.preloadSimple('sirena', 'assets/sounds/sirena.wav');
    this.nativeAudio.preloadSimple('train', 'assets/sounds/train-low-horn.wav');
  }

}
