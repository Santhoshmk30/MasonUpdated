import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  PixelRatio
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scaleFont = (size) => size * PixelRatio.getFontScale();

const RegisterPage = () => {
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const inputRef = useRef(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const validatePhone = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleReferralCodeChange = (code) => {
    setReferralCode(code);
  };

  const handleReferralSubmit = () => {
    Alert.alert('Referral Code Submitted', referralCode || 'No code entered');
  };

  const handleSubmit = async () => {
    if (isLoading) return; // prevent multiple presses
    setIsLoading(true);

    if (!isChecked) {
      Alert.alert("Please accept the terms and conditions to continue.");
      setIsLoading(false);
      return;
    }

    if (!phone || phone.length !== 10 || !validatePhone()) {
      Alert.alert("Invalid Input", "Please enter a valid 10-digit phone number.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://masonshop.in/api/get_otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: phone }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('phone', phone);
        setIsLoading(false);
        navigation.navigate('VerificationPage');
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    navigation.navigate('LoginPage');
  };

  return (
    <ImageBackground
      source={require('../RegisterPage/masonbackground.jpeg')}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
              <LinearGradient
                colors={['#FC2121', '#982B2B']}
                style={styles.gradientBox}
              />

              <View style={styles.content}>
                <Text style={styles.title}>Enter Your Number</Text>
                <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
                  <View style={styles.inputBox}>
                    <Text style={styles.countryCode}>+91</Text>
                    <View style={styles.divider} />
                    <TextInput
                      ref={inputRef}
                      onChangeText={setPhone}
                      value={phone}
                      placeholder="Mobile Number"
                      placeholderTextColor="white"
                      style={styles.textInput}
                      keyboardType="numeric"
                      autoCapitalize="none"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.bottomSection}>
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    title="I hereby accept all terms and conditions"
                    checked={isChecked}
                    onPress={() => setIsChecked(!isChecked)}
                    checkedColor="#fff"
                    uncheckedColor="#ccc"
                    containerStyle={{
                      backgroundColor: 'transparent',
                      borderWidth: 0,
                      borderRadius: 8,
                      padding: 10,
                    }}
                    textStyle={{
                      color: 'white',
                    }}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && { opacity: 0.6 }]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.logoContainer}>
                <Image
                  source={require('../RegisterPage/masonlogo.png')}
                  style={styles.logo}
                />
                <Text style={styles.logoText}>MASON</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradientBox: {
    position: 'absolute',
    top: screenHeight * 0.22,
    left: 0,
    width: '100%',
    height: screenHeight * 0.75,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  countryCode: {
    color: 'white',
    fontSize: 14,
    marginRight: 5,
  },
  divider: {
    width: 1,
    height: '50%',
    backgroundColor: 'white',
    marginHorizontal: 8,
  },
  textInput: {
    color: 'white',
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: screenHeight * 0.5,
  },
  content: {
    position: 'absolute',
    top: screenHeight * 0.25,
    left: '5%',
    width: '90%',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.045,
    marginBottom: 15,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: screenHeight * 0.02,
    height: 60,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: screenHeight * 0.6,
    marginLeft: 20,
  },
  button: {
    marginTop: screenHeight * 0.03,
    width: screenWidth * 0.9,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#f60138',
    fontWeight: 'bold',
    fontSize: screenWidth * 0.05,
  },
  logoContainer: {
    position: 'absolute',
    top: screenHeight * 0.08,
    alignSelf: 'center',
    alignItems: 'center',
  },
  logo: {
    width: screenWidth * 0.20,
    height: screenHeight * 0.07,
    marginBottom: 5,
  },
  logoText: {
    fontSize: 19,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RegisterPage;
