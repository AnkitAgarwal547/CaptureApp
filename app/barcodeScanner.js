import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  Image,
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import styles from './styles/companies.styles';
import Screen from '@components/screen';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
const {height, width} = Dimensions.get('screen');
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {goBack} from '../utils/navigationUtils';
import {AppContext} from '../context/appContextProvider';
import colors from '../theme/colors';
import base64 from 'react-native-base64';

const BarcodeScanner = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const {barcodeDetails, setBarcodeDetails, string} =
    React.useContext(AppContext);

  const onSuccess = async e => {
    const {data} = e;

    try {
      const companyListRaw = await AsyncStorage.getItem('companyList');
      let companyList = [];
      if (companyListRaw) {
        companyList = JSON.parse(companyListRaw);
      }
      if (companyList.length > 0 && companyList) {
        if (
          !(
            /^(D[0-9]{1,6})\|([A-Z]|[0-9]){2}(\|([A-Z]|[0-9]))?$/.test(data) ||
            /^([A-Z]{2})(([0-9]{2})[0-9]{6})\|([A-Z]|[0-9]){2}(\|([A-Z]|[0-9]))?$/.test(
              data,
            )
          )
        ) {
          setBarcodeDetails();
          Snackbar.show({
            text: string.Invalid_barcode,
            duration: Snackbar.LENGTH_LONG,
          });
          return null;
        }

        const beforePipeData = data.split('|')[0];
        const afterPipeData = data.split('|')[1];
        const afterSecondPipeData = data.length > 2 ? data.split('|')[2] : null;
        if (!beforePipeData || !afterPipeData) {
          Snackbar.show({
            text: string.Invalid_barcode,
            duration: Snackbar.LENGTH_SHORT,
          });
          return null;
        }
        const companySuffix = afterPipeData[0] + afterPipeData[1];
        const isCompanyExists = companyList.some(
          company => company.suffix === companySuffix,
        );
        if (isCompanyExists && afterPipeData.length <= 2) {
          let isDossier = false;

          let barcodeData;

          const company = companyList.find(
            company => company.suffix === companySuffix,
          );

          if (
            /^(D[0-9]{1,6})\|([A-Z]|[0-9]){2}(\|([A-Z]|[0-9]))?$/.test(data)
          ) {
            await setBarcodeDetails({
              type: 'dossier',
              barcodeData: data,
              company: company,
            });
            barcodeData = {type: 'dossier', barcodeData: data};
            isDossier = true;
            goBack();
            return null;
          } else if (
            /^([A-Z]{2})(([0-9]{2})[0-9]{6})\|([A-Z]|[0-9]){2}(\|([A-Z]|[0-9]))?$/.test(
              data,
            )
          ) {
            await setBarcodeDetails({
              type: 'document',
              barcodeData: data,
              company: company,
            });
            barcodeData = {type: 'document', barcodeData: data};
            isDossier = false;
            goBack();
            return null;
          } else {
            setBarcodeDetails();
            Snackbar.show({
              text: string.Invalid_barcode,
              duration: Snackbar.LENGTH_SHORT,
            });
            return null;
          }
        } else {
          Alert.alert(
            string.Invalid_barcode,
            string.This_barcode_does_not_belong_to_your_organisation_Try_again_or_enter_the_document_or_dossier_code_manually,
          );
        }
      } else {
        setBarcodeDetails();
        Snackbar.show({
          text: string.No_companies_found_Please_add_a_company_first,
          duration: Snackbar.LENGTH_LONG,
        });
        // Alert.alert('No companies found', 'Please add a company first');
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    // barcodeDetails && goBack();
  }, [barcodeDetails]);

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

  const requestPermission = () => {
    Platform.OS === 'android'
      ? requestAndroidPermission()
      : requestIosPermission();
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      checkAndroidPermission();
    } else {
      checkIosPermission();
    }
  }, []);

  const NoCameraPermission = () => {
    return (
      <Screen>
        <Pressable
          style={{
            flex: 1,
            // marginTop: 32,
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
          onPress={requestPermission}>
          <Text style={{color: 'black'}}>
            {string.Need_camera_access_Click_Here_to_allow}
          </Text>
        </Pressable>
      </Screen>
    );
  };

  return hasCameraPermission ? (
    <View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          height: width * 0.11,
          width: width * 0.11,
          zIndex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
        }}
        onPress={() => {
          goBack();
        }}>
        <Image
          style={{
            resizeMode: 'contain',
            width: width * 0.1,
            height: height * 0.1,
            tintColor: colors.Primary,
          }}
          source={require('../assets/images/arrow_back_FILL0_wght400_GRAD0_opsz48.png')}
        />
      </TouchableOpacity>

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
    </View>
  ) : (
    <NoCameraPermission />
  );
};

export default BarcodeScanner;
