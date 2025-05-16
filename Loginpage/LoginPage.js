import React, { useState } from 'react';
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
  Platform,Dimensions,PixelRatio
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scaleFont = (size) => size * PixelRatio.getFontScale();

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const validatePhone = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };
  const handleSubmit = async () => {
    if (!phone || phone.length !== 10) {
      Alert.alert("Invalid Input", "Please enter a valid 10-digit phone number.");
      return;
    }
  
    try {
      const response = await fetch("https://masonshop.in/api/get_otp_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: phone }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "OTP sent successfully.");
        await AsyncStorage.setItem('phone', phone); 
  
        navigation.navigate('VerificationPage');
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  const goToRegister = () => {
    navigation.navigate('RegisterPage');
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
                <View style={styles.inputBox}>
                  <Text style={styles.countryCode}>+91</Text>
                  <View style={styles.divider} />
                  <TextInput
                    onChangeText={setPhone}
                    value={phone}
                    placeholder="Mobile Number"
                    placeholderTextColor="white"
                    style={styles.textInput}
                    keyboardType="numeric"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              

              <View style={styles.bottomSection}>
    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <Text onPress={goToRegister} style={styles.loginLink}>
                    Create an account? Register here
                </Text>
              </View>

              {/* Logo Container */}
              <View style={styles.logoContainer}>
                <Image
                  source={require('../RegisterPage/masonlogo.png')} // Ensure the path is correct
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
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: screenHeight * 0.5, // Cover half the screen
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
    fontSize: screenWidth * 0.06,
    marginBottom: 15,
  },
  countryCode:{
    marginBottom:2,
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
  },
  button: {
    marginTop: screenHeight * 0.71,
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
  },
  logo: {
    width: screenWidth * 0.20, 
    height: screenHeight * 0.07,
    marginBottom: 5,
  },
  logoText: {
    width: screenWidth * 0.17, 
    height: screenHeight * 0.07,
    fontSize:19,
  },
  loginLink: {
    color: 'white',
    textAlign: 'center', 
    marginTop: screenHeight * 0.02,
    textDecorationLine: 'underline',
  },
});

export default LoginPage;
