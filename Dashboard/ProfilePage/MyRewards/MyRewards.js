import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MyRewards = () => {
  return (
    <View style={styles.container}>
      {/* Silver Card */}
      <View style={[styles.card, styles.highlighted]}>
        <View style={styles.ribbon}>
          <Text style={styles.ribbonText}>You Are Now In</Text>
        </View>
        <Text style={styles.title}>Silver</Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>Team</Text>
          <Text style={styles.valueText}>100 Premium</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>Live</Text>
          <Text style={styles.valueText}>50 Premium</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>Need</Text>
          <Text style={styles.valueText}>50 Premium</Text>
        </View>
      </View>

      {/* Gold Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Gold</Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>Team</Text>
          <Text style={styles.valueText}>10 Silver</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>Live</Text>
          <Text style={styles.valueText}>0 Silver</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>Need</Text>
          <Text style={styles.valueText}>10 Silver</Text>
        </View>
      </View>

      {/* Diamond Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Diamond</Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>Team</Text>
          <Text style={styles.valueText}>10 Gold</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>Live</Text>
          <Text style={styles.valueText}>0 Gold</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>Need</Text>
          <Text style={styles.valueText}>10 Gold</Text>
        </View>
      </View>

      {/* Crown Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Crown</Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>Team</Text>
          <Text style={styles.valueText}>10 Diamond</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>Live</Text>
          <Text style={styles.valueText}>0 Diamond</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>Need</Text>
          <Text style={styles.valueText}>10 Diamond</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  highlighted: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  ribbon: {
    position: 'absolute',
    top: 20,
    right: -10,
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    transform: [{ rotate: '45deg' }],
  },
  ribbonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 4,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MyRewards;
