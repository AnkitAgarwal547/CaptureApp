import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  Image,
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import styles from './styles/language.styles';
import Screen from '@components/screen';
import {navigate, navigateAndSimpleReset} from '../utils/navigationUtils';
import {AppContext} from '../context/appContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Language = () => {
  const {selectedLanguage, setSelectedLanguage, string} =
    React.useContext(AppContext);

  const BottomComp = () => {
    return (
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => navigateAndSimpleReset('Home')}>
          <Text style={styles.openText}>{string.CONTINUE}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.languageTitle}>{string.Choose_language}</Text>
          <View style={styles.languageListContainer}>
            <Pressable
              style={styles.languageContainer}
              onPress={async () => {
                setSelectedLanguage('nl');
                await AsyncStorage.setItem('language', 'nl');
              }}>
              <View style={styles.language}>
                <Image
                  source={require('../assets/images/dutch.png')}
                  style={styles.languageFlagImage}
                />
                <Text style={styles.languageText}>Dutch</Text>
              </View>
              <View style={styles.radioButtonOuter}>
                {selectedLanguage === 'nl' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </Pressable>
            <Pressable
              style={styles.languageContainer}
              onPress={async () => {
                setSelectedLanguage('en');
                await AsyncStorage.setItem('language', 'en');
              }}>
              <View style={styles.language}>
                <Image
                  source={require('../assets/images/english.png')}
                  style={styles.languageFlagImage}
                />
                <Text style={styles.languageText}>English</Text>
              </View>
              <View style={styles.radioButtonOuter}>
                {selectedLanguage === 'en' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </Pressable>
            <Pressable
              style={styles.languageContainer}
              onPress={async () => {
                setSelectedLanguage('fr');
                await AsyncStorage.setItem('language', 'fr');
              }}>
              <View style={styles.language}>
                <Image
                  source={require('../assets/images/french.png')}
                  style={styles.languageFlagImage}
                />
                <Text style={styles.languageText}>French</Text>
              </View>
              <View style={styles.radioButtonOuter}>
                {selectedLanguage === 'fr' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </Pressable>
          </View>
        </View>
      </View>
      <BottomComp />
    </Screen>
  );
};
export default Language;
