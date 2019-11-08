import React, { Component } from 'react';
import {
  AppRegistry,
  AppState,
  StyleSheet,
  Text,
  findNodeHandle,
  View,
  Platform,
  PermissionsAndroid,
  BackHandler
} from 'react-native';
import {
  BarcodePicker,
  ScanditModule,
  ScanSession,
  Barcode,
  SymbologySettings,
  ScanSettings
} from 'scandit-react-native';

ScanditModule.setAppKey('AWv9rj5FIBnOHM7GrgAjOZo2+u5sIIwqyzZSmuZf/PT+eQnwCmrV4/h1rXuiBNvBBXRejdVJaC0AeCjupW7Hs2VtBiJvWlgtNSfqR8J/Fz55VtPhLmRHJkFXBC6NTtfz/ng5FltcOhy/fILcOkxjYxN0B2JUaGHtVG0M+PhBy6g8aA9xaVdqMIduZQRCZcADw3/Etqxzk0PYRvn42Ge0PshlVcRWVJLCokHVicpTiONsJKAMm0v/9o1Gbc8bSE5swUOflhFqdKBbK1cotzIVc094WCWwaS+ITlrhnE4kubbMJhb3Zl9razJFnDMhZuFnxn/UEGBukkBSet6JDWhQAIZs8KzmdR35P1WX+it2XKgBTrGO3Vgz3NMogms7e9C+V37NSrdVW6c0RhmmIXUlCG5YKWHSRMviXGDK7TN2wJmYT13gfiLEDZ5PqqDVeEhAJ2YRSoBn67uyJSukPkv4DO9Rk+YAV219+Gi8WktsMUu8bcHayms+lVR5xDX7U344WRjJ0rIEgtnkOYW+L06k0nHMa65OyfddAjnNBcHbb3kFxZVQ9Cc00rksr+H51LaS767eTxG/7irNLCrdH+QXQfJ/8ja8R1STG1rWnsT88kNbRp0Q3py2f2n/Bnfii1Tm8u2JSbyS2VzCy+nQMUi6X0GjvyQbc+Ysln6qLtkQqOK1RSHKZ4cvKGRqJYSvOHsfWDbz+w9J4EDegSWwkTfIl0A1W4729q/mteDEeBvydQqEGhrrMylnDroD4dX9C0TSr/vOtvE2TMjZeiWrSL1SjNycqXHAZN0ePLm3mKvCOGBJ9SFnzsxICm/NbzlsCr9COe4H4HdGwHMRTbV2qTeSCI5+WZhEDC5S0urlAZP3ZWBqufdJCRkMM9vWJVTplARdHYLGhdy7EdXzWA5CO4gPB7sxaOluFmiapTifiGCzOYjFk44kYYW5maq3Tkz1nzu6GX8uaI9+cGwRsMcNO4HO6Jfl2PGJCL+QqxXVwe1uK1A/EXWYLhA3wIGBMpUT+xGMknpmvjUS1UPw1JCEdYgSvZm25j9bctjE3IJzZgB3dOGsI+y6pYyZTOwKV9YqfSYpXAkm/6gvOKsGCPf7XaPINYyTjoU1IpTOWTMM/ZdiFJg1H7xepDgHLX6LLMKDJfGmSbi8KmS0XY+zDd58XC7dc9N66rQ0ORAajE4PNy+QmoZdhOFKYnFFRNJN9GI=');

export default class SimpleSample extends Component {

  componentWillMount() {
    this.settings = new ScanSettings();
    this.settings.setSymbologyEnabled(Barcode.Symbology.EAN13, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.EAN8, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.UPCA, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.UPCE, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.CODE39, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.ITF, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.QR, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.DATA_MATRIX, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.CODE128, true);

    /* Some 1d barcode symbologies allow you to encode variable-length data. By default, the
       Scandit BarcodeScanner SDK only scans barcodes in a certain length range. If your
       application requires scanning of one of these symbologies, and the length is falling
       outside the default range, you may need to adjust the "active symbol counts" for this
       symbology. This is shown in the following few lines of code. */
    this.settings.getSymbologySettings(Barcode.Symbology.CODE39)
      .activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    /* For details on defaults and how to calculate the symbol counts for each symbology, take
       a look at http://docs.scandit.com/stable/c_api/symbologies.html. */
  }

  isAndroidMarshmallowOrNewer() {
    return Platform.OS === 'android' && Platform.Version >= 23;
  }

  async hasCameraPermission() {
    if (this.isAndroidMarshmallowOrNewer()) {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      return granted;
    } else {
      return true;
    }
  }

  async requestCameraPermission() {
    if (this.isAndroidMarshmallowOrNewer()) {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Android Camera Permission has been granted.");
          this.cameraPermissionGranted();
        } else {
          console.log("Android Camera Permission has been denied - the app will shut itself down.");
          this.cameraPermissionDenied();
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      this.cameraPermissionGranted();
    }
  }

  // This method should only be called if the Platform.OS is android.
  cameraPermissionDenied() {
    BackHandler.exitApp();
  }

  cameraPermissionGranted() {
    this.scanner.startScanning();
  }

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.checkForCameraPermission();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      this.scanner.stopScanning();
    } else {
      this.checkForCameraPermission();
    }
  }

  async checkForCameraPermission() {
    const hasPermission = await this.hasCameraPermission();
    if (hasPermission) {
      this.cameraPermissionGranted();
    } else {
      await this.requestCameraPermission();
    }
  }

  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'column'}}>
        <BarcodePicker
          onScan={(session) => { this.onScan(session) }}
          scanSettings= { this.settings }
          ref={(scan) => { this.scanner = scan }}
          style={{ flex: 1 }}/>
      </View>
    );
  }

  onScan(session) {
    alert(session.newlyRecognizedCodes[0].data + " " + session.newlyRecognizedCodes[0].symbology);
  }

}
