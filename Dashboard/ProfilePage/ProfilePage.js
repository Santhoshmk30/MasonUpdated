import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ImageBackground, Alert,Image,ToastAndroid,Share } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const ProfilePage = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [earnings, setEarnings] = useState(null);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {  
            try {  
              await AsyncStorage.setItem('isLoggedOut', 'true'); 
              await AsyncStorage.removeItem('isLoggedIn');
  
              navigation.reset({
                index: 0,
                routes: [{ name: 'RegisterPage' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


  
  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      console.log('Fetched user_id from AsyncStorage:', userId);

      if (!userId) {
        console.warn('No user_id found in AsyncStorage');
        setLoading(false);
        return;
      }


      const response = await axios.get(`https://masonshop.in/api/userslist?user_id=${userId}`);
      console.log('API Response:', response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setUserData(response.data.data[0]);
      } else {
        console.warn('Unexpected API response format:', response.data);
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  
  const inviteLink = `https://masonshop.in/${userData?.user_id}`;

  const handleCopy = () => {
    Clipboard.setString(inviteLink);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Link copied to clipboard', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Link copied to clipboard');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: inviteLink,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  useEffect(() => {
    const fetchEarnings = async () => {
      const user_id = await AsyncStorage.getItem('user_id'); // Adjust key name if different
      if (!user_id) return;

      try {
        const response = await fetch(`https://masonshop.in/api/user_earnings?user_id=${user_id}`);
        const data = await response.json();
        console.log('Earnings API response:', data);

        if (data.status === true) {
          setEarnings(data);
          console.log(data)
        }
      } catch (error) {
        console.error('Error fetching earnings:', error);
      }
    };

    fetchEarnings();
  }, []);

  useEffect(() => {
    fetchUserData ();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData (); // ✅ Refresh on return
    }, [])
  );




  return (
    <ImageBackground
      source={require('../icons/masonbackground.jpeg')}  
      style={styles.container}
    >
    <ScrollView style={styles.container}>
    {userData ? (
  <View style={styles.header}>
    <Image
      source={{ uri: userData.profile }}
      style={{ width: 80, height: 80, borderRadius: 40 }} // or use a style from styles.image
    />
    <View style={styles.userInfo}>
      <Text style={styles.userName}>{userData.username}</Text>
      <Text style={styles.userDetails}>+91 {userData.phone}</Text>
      <Text style={styles.userDetails}>User Id: {userData.user_id}</Text>
    </View>
  </View>
) : (
  <Text>Loading user Data...</Text>
)}


  
      <View style={styles.buttonRow}>
        <Button mode="contained" style={styles.premiumButton}>
          <Text style={styles.premiumButtonText}>You Are A Premium Member</Text>
        </Button>
        <Button mode="outlined" style={styles.editProfileButton} onPress={() => navigation.navigate('MyAccountKYC')}>
          <Text style={styles.premiumButtonText}>Edit Profile</Text>
        </Button>
      </View>

    
      <View style={styles.inviteSection}>
      <Text style={styles.inviteText}>Invite Link</Text>
      <View style={styles.inviteInputContainer}>
        <Text style={styles.inviteInput}>{inviteLink}</Text>
        <TouchableOpacity onPress={handleCopy}>
          <Icon name="content-copy" size={24} color="#000" style={styles.copyIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Icon name="share-variant-outline" size={24} color="#000" style={styles.copyIcon} />
        </TouchableOpacity>
      </View>
    </View>

      <TouchableOpacity style={styles.ReferralSection} onPress={() => navigation.navigate('Qrpage')}>
        <Text style={styles.ReferralText}>Referral QR Code</Text>
        <View style={styles.ReferralInputContainer}>
          <TextInput
            style={styles.ReferralInput}
            placeholder="Click here to view your Referral QR Code."
            editable={false}
          />
          <Icon name="qrcode-scan" size={24} color="#000" style={styles.copyIcon} />

        </View>
      </TouchableOpacity>

      {/* Earnings Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Earnings</Text>
        <Text style={styles.cardAmount}>₹{earnings?.total_earnings}</Text>
        <Text style={styles.cardDetails}>
          Today Earnings - ₹{earnings?.today_earnings}
        </Text>
      </View>

      {/* Wallet Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mason Wallet</Text>
        <Text style={styles.cardAmount}>₹{earnings?.wallet_amount || '0.00'}</Text>
        <Text style={styles.cardDetails}>
          Used Amount - ₹{earnings?.used_amount || '0.00'} | Total Wallet - ₹{earnings?.wallet_amount || '0.00'}
        </Text>
      </View>

      {/* Icon Buttons Row */}
      <View style={styles.iconRow}>
        <View style={styles.iconcontainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="cash" size={30} color="#f44336" />
          <Text style={styles.iconText}>Withdraw</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.iconcontainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="ticket-percent" size={30} color="#4caf50" />
          <Text style={styles.iconText}>Coupon</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.iconcontainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="bank-transfer" size={30} color="#2196f3" />
          <Text style={styles.iconText}>Transfer</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.iconcontainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="share" size={30} color="#ff9800" />
          <Text style={styles.iconText}>Referral Link</Text>
        </TouchableOpacity>
        </View>
      </View>

      {/* Links Section */}
      <TouchableOpacity onPress={() => navigation.navigate('Membership')} style={styles.linkButton}>
  <View style={styles.leftSection}>
    <View style={styles.imagecard}>
      <Image
        source={require('../icons/Membership.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
    <Text style={styles.linkText}>Membership</Text>
  </View>
</TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Membership')} style={styles.linkButton}>
      <View style={styles.leftSection}>
      <View style={styles.imagecard}>
      <Image
        source={require('../icons/coupon.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
        <Text style={styles.linkText}>My Coupons</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MyAccountKYC')} style={styles.linkButton}>
      <View style={styles.leftSection}>
      <View style={styles.imagecard}>
      <Image
        source={require('../icons/account&kyc.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
        <Text style={styles.linkText}>My Account & KYC</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MyOrders')} style={styles.linkButton}>
      <View style={styles.leftSection}>
      <View style={styles.imagecard}>
      <Image
        source={require('../icons/myorders.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
        <Text style={styles.linkText}>My Orders</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Invoice')} style={styles.linkButton}>
      <View style={styles.leftSection}>
      <View style={styles.imagecard}>
      <Image
        source={require('../icons/invoice1.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
        <Text style={styles.linkText}>Invoice</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Address')}  style={styles.linkButton}>
      <View style={styles.leftSection}>
      <View style={styles.imagecard}>
      <Image
        source={require('../icons/Address.png')}
        style={styles.image1}
        resizeMode="cover"
      />
    </View>
        <Text style={styles.linkText}>Address</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PaymentsRefunds')} style={styles.linkButton}>
      <View style={styles.leftSection}>
      <View style={styles.imagecard}>
      <Image
        source={require('../icons/invoice.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
        <Text style={styles.linkText}>Payments & Refunds</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ReferralList')} style={styles.linkButton}>
      <View style={styles.leftSection}>
      <View style={styles.imagecard}>
      <Image
        source={require('../icons/referell.png')}
        style={styles.image1}
        resizeMode="cover"
      />
    </View>
        <Text style={styles.linkText}>Refferal List</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MyRewards')} style={styles.linkButton}>
      <View style={styles.leftSection}>
      <View style={styles.imagecard}>
      <Image
        source={require('../icons/rewards.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
        <Text style={styles.linkText}>My Rewards</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('IncomeReport')} style={styles.linkButton}>
      <View style={styles.leftSection}>
      <View style={styles.imagecard}>
      <Image
        source={require('../icons/income.png')}
        style={styles.image1}
        resizeMode="cover"
      />
    </View>
        <Text style={styles.linkText}>Income Report</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.linkButton}>
      <View style={styles.leftSection}>
      <View style={styles.imagecard}>
      <Image
        source={require('../icons/logout1.jpg')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
      <Text style={styles.linkText}>Logout</Text>
      </View>
    </TouchableOpacity>
      
      <View style={styles.spacer}>
               
            </View>
    </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userDetails: {
    fontSize: 14,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  premiumButton: {
    backgroundColor: '#f60138',
    flex: 1,
    marginRight: 10,
  },
  premiumButtonText: {
    color:'#fff',
  },
  editProfileButton: {
    flex: 1,
    backgroundColor: '#f60138',
  },
  editProfileButtonText: {
    Color: '#fff',
  },
  inviteSection: {
    marginBottom: 20,
  },
  inviteText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  inviteInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation:4,
  },
  inviteInput: {
    flex: 1,
  },
  ReferralSection: {
    marginBottom: 20,
  },
  ReferralText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  ReferralInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation:4,
  },
  ReferralInput: {
    flex: 1,
  },
  copyIcon: {
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 5,
  },
  cardDetails: {
    fontSize: 14,
    color: '#666',
  },
  iconcontainer:{
    backgroundColor: '#fff',
    padding: 15,
    borderRadius:25,
    marginBottom: 10,
    elevation: 2,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconButton: {
    alignItems: 'center',
    width: '100%',
  },
  iconText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  linkButton: {
    flexDirection:'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 10,
    elevation: 2,
  },
  linkText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  spacer: {
    height: 50, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    marginTop: 20,
},
leftSection: {
  flexDirection: 'row',
  alignItems: 'center',
},

imagecard: {
  width: 40,
  height: 40,
  borderRadius: 35,
  backgroundColor: '#f0f0f0',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
},

image: {
  width: 30,
  height: 30,
},
image1: {
  width: 30,
  height: 30,
},

});

export default ProfilePage;
