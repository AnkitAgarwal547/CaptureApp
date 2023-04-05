# ProfitPlus CaptureApp

The Application involves development of app developed with React Native.

# Usage
The code can be used for the following operations:

Barcode scanner: code is for asking permission for camera and scanning barcode.

   
    
# Procedure
The following is the procedure followed by the code:

#### Barcode Scanner:
1. Asking for permission: First we have to ask for camera permission to scan barcode.
2. Scanning code: After that camera gets activated on screen and user can scan code.
3. handling barcode scanner response: after scanning barcode scanner responses in onRead callback function and we can reacive scanned data.

## Dependencies
install dependencies with yarn
```
react-native-qrcode-scanner: to scan barcodes 
```

## Installation
1. Clone the repository.
2. Install the dependencies using yarn.
3. install pod using npx pod install.
4. Run the code with yarn android | yarn ios.

## Code
#### Permission state
````
const [hasCameraPermission, setHasCameraPermission] = useState(false);
````

#### Check Permission in android for camera
````
const checkAndroidPermission = async () => {
    const status = await check(PERMISSIONS.ANDROID.CAMERA);
    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
      setHasCameraPermission(true);
    } else if (status === RESULTS.BLOCKED) {
      setHasCameraPermission(false);
    } else {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result === RESULTS.GRANTED || RESULTS.LIMITED) {
        setHasCameraPermission(true);
      } else {
        setHasCameraPermission(false);
      }
    }
  };
  ````

  #### Request Permission in android for camera
  ````
   const requestAndroidPermission = async () => {
    const status = await check(PERMISSIONS.ANDROID.CAMERA);
    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        string.Camera_access_denied,
        string.Need_camera_access_to_scan_QR_code_Please_go_to_settings_and_allow_access,
        [
          {
            text: string.Cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: string.CONTINUE, onPress: () => openSettings()},
        ],
      );
      setHasCameraPermission(false);
    } else if (status === RESULTS.DENIED) {
      const result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result === RESULTS.GRANTED || RESULTS.LIMITED) {
        setHasCameraPermission(true);
      }
    } else if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
      setHasCameraPermission(true);
    }
  };
  ````

  #### Check Permission in ios for camera
````
 const checkIosPermission = async () => {
    const status = await check(PERMISSIONS.IOS.CAMERA);
    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
      setHasCameraPermission(true);
    } else if (status === RESULTS.BLOCKED) {
      setHasCameraPermission(false);
    } else {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      if (result === RESULTS.GRANTED || RESULTS.LIMITED) {
        setHasCameraPermission(true);
      } else {
        setHasCameraPermission(false);
      }
    }
  };
  ````

  #### Request Permission in ios for camera
  ````
   const requestIosPermission = async () => {
    const status = await check(PERMISSIONS.IOS.CAMERA);
    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        string.Camera_access_denied,
        string.Need_camera_access_to_scan_QR_code_Please_go_to_settings_and_allow_access,
        [
          {
            text: string.Cancel,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: string.CONTINUE, onPress: () => openSettings()},
        ],
      );
      setHasCameraPermission(false);
    } else if (status === RESULTS.DENIED) {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      if (result === RESULTS.GRANTED || RESULTS.LIMITED) {
        setHasCameraPermission(true);
      }
    } else if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
      setHasCameraPermission(true);
    }
  };
  ````

  #### Barcode Scanner
  
  ````
   <QRCodeScanner
        cameraStyle={{height: height, width: width}}
        reactivate={true}
        reactivateTimeout={4000}
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.auto}
        showMarker={true}
        markerStyle={{
          marginTop: -80,
          height: 140,
          width: width * 0.7,
          borderColor: colors.White,
        }}
      />
````

## Tech Stack
    React native, Javascript

## Documentation
[react-native-qrcode-scanner](https://www.npmjs.com/package/react-native-qrcode-scanner)
