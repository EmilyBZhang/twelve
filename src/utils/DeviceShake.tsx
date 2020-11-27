import { Accelerometer } from 'expo-sensors';
import { Subscription } from './interfaces';
//this is shake sensitivity - lowering this will give high sensitivity and increasing this will give lower sensitivity
const THRESHOLD = 150;

export class DeviceShake {
  static addListener(handler: () => any) {
    let last_x: number, last_y: number, last_z: number;
    let lastUpdate = 0;
    return Accelerometer.addListener((accelerometerData) => {
      let { x, y, z } = accelerometerData;
      let currTime = Date.now();
      if (currTime - lastUpdate > 100) {
        let diffTime = currTime - lastUpdate;
        lastUpdate = currTime;
        let speed =
          (Math.abs(x + y + z - last_x - last_y - last_z) / diffTime) * 10000;
        if (speed > THRESHOLD) {
          handler();
        }
        last_x = x;
        last_y = y;
        last_z = z;
      }
    });
  }
  static removeSubscription(subscription: Subscription) {
    Accelerometer.removeSubscription(subscription);
  }
  static removeAllListeners() {
    Accelerometer.removeAllListeners();
  }
}

export default DeviceShake;
