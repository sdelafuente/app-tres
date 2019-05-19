import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.page.html',
  styleUrls: ['./bienvenido.page.scss'],
})
export class BienvenidoPage implements OnInit {

  items: Observable<any[]>;
  public xOrient: any;
  public yOrient: any;
  public zOrient: any;
  public timestamp: any;
  public accX: any;
  public accY: any;
  public accZ: any;
  public promise: any;
  public isVertial: any;
  public isHorizontal: any;
  // public id: any;

  private options: GyroscopeOptions = {
    frequency: 1000
 };

  constructor(
    db: AngularFirestore,
    private gyroscope: Gyroscope,
    private deviceMotion: DeviceMotion
  ) {
    // this.items = db.collection('santiago').valueChanges();

  }

  ngOnInit() {
    // this.gyrascope();
  }

  gyrascope() {

    this.gyroscope = new Gyroscope();


   // this.gyroscope.getCurrent()
   //   .then((orientation: GyroscopeOrientation) => {
   //      // console.log(orientation.x, orientation.y, orientation.z, orientation.timestamp);
   //      this.xOrient = (orientation.x.toFixed(2));
   //      this.yOrient = orientation.y;
   //      this.zOrient = orientation.z;
   //
   //      this.timestamp = orientation.timestamp;
   //
   //    })
   //   .catch()


    this.gyroscope.watch(this.options)
      .subscribe((orientation: GyroscopeOrientation) => {
         // console.log(orientation.x, orientation.y, orientation.z, orientation.timestamp);
         this.xOrient = orientation.x;
         this.yOrient = orientation.y;
         this.zOrient = orientation.z;
         this.timestamp = orientation.timestamp;
          // = orientation.id;
      });
  }

  Accelerometer(valor) {
    if (valor) {
      this.deviceMotion.getCurrentAcceleration().then(
        (acceleration: DeviceMotionAccelerationData) =>
         console.log(acceleration),

      //  (error: any) => console.log(error)

      );

      // Watch device acceleration
      this.promise = this.deviceMotion.watchAcceleration(this.options)
      .subscribe((acceleration: DeviceMotionAccelerationData) => {

        this.accX = acceleration.x;
        this.accY = acceleration.y;
        this.accZ = acceleration.z;

        if (acceleration.y > 8 && acceleration.z  < 2 && !this.isVertial) {
          this.isVertial = true;
          alert('Vertical');
        }

        if (acceleration.y < 2 && acceleration.z  > 8 && !this.isHorizontal) {
          this.isHorizontal = true;
          alert('Horizontal');
        }

      });
      console.log(  this.promise);
    } else {
      this.promise.unsubscribe();
    }


  }

  Clear() {
    this.isVertial = false;
    this.isHorizontal = false;
  }

}
