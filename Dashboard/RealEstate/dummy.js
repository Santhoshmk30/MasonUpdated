import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PropertyDetailPage = () => {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        const property_id = await AsyncStorage.getItem('propertyId');
        console.log('user_id:', user_id);
        console.log('property_id:', property_id);
        if (user_id && property_id) {
          const url = `https://masonshop.in/api/publishapi?user_id=${user_id}&property_id=${property_id}`;
          const response = await fetch(url);
          const data = await response.json();
          console.log('API response:', data);
          setPropertyData(data?.property);
        } else {
          console.warn('Missing user_id or property_id');
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyDetails();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text>Loading property details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{propertyData?.add_title || 'Property Title'}</Text>
          {propertyData?.description && (
            <Text style={styles.subtitle}>{propertyData.description}</Text>
          )}
        </View>
      </View>

      {/* Scrollable Image List */}
      {propertyData?.image && propertyData.image.split(',').some(img => img.trim().toLowerCase().endsWith('.jpg')) ? (
        <FlatList
          data={propertyData.image.split(',').filter(img => img.trim().toLowerCase().endsWith('.jpg'))}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item.trim() }} style={styles.image} />
          )}
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        />
      ) : (
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png' }}
          style={styles.image}
        />
      )}

      {/* Price and Sale/Rent Information */}
      {(propertyData?.sale_or_rent || propertyData?.price) && (
        <View>
          {propertyData?.sale_or_rent && (
            <View style={styles.saleRow}>
              <View style={styles.saleTag}>
                <View style={styles.greenDot} />
                <Text>{propertyData.sale_or_rent}</Text>
              </View>
            </View>
          )}
          {propertyData?.price && (
            <View style={styles.priceTag}>
              <Text style={styles.price}>{`₹${propertyData.price}`}</Text>
            </View>
          )}
        </View>
      )}

      {/* Features */}
      <View style={styles.featuresRow}>
        {propertyData?.bedrooms && <Feature icon="bed-king-outline" label={propertyData.bedrooms} />}
        {propertyData?.carparking && (
          <Feature icon="car-parking-lights" label={`${propertyData.carparking} Car Parking`} />
        )}
      </View>
      <View style={styles.featuresRow1}>
        {propertyData?.bathrooms && (
          <Feature icon="shower" label={`${propertyData.bathrooms} Bathroom`} />
        )}
        {propertyData?.super_builtup_area && (
          <Feature icon="ruler-square" label={`${propertyData.super_builtup_area} Sq.Ft`} />
        )}
      </View>

      {/* Description */}
      {propertyData?.description && (
        <>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{propertyData.description}</Text>
        </>
      )}

      {/* Location */}
      {(propertyData?.street_name || propertyData?.city) && (
        <>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationRow}>
            <Icon name="map-marker" size={20} color="red" />
            <Text>{`${propertyData?.street_name || ''}, ${propertyData?.city || ''}`}</Text>
          </View>
        </>
      )}

      {propertyData?.landmark && (
        <>
          <Text style={styles.locationHighlightTitle}>Location Highlights</Text>
          <Text style={styles.description}>{propertyData.landmark}</Text>
        </>
      )}

      {/* Property Details */}
      {propertyData?.furnishing && (
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Furnishing:</Text>
          <Text style={styles.detailValue}>{propertyData.furnishing}</Text>
        </View>
      )}
      {propertyData?.construction_status && (
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Construction Status:</Text>
          <Text style={styles.detailValue}>{propertyData.construction_status}</Text>
        </View>
      )}
      {propertyData?.listed_by && (
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Listed By:</Text>
          <Text style={styles.detailValue}>{propertyData.listed_by}</Text>
        </View>
      )}
      {propertyData?.carpet_area && (
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Carpet Area:</Text>
          <Text style={styles.detailValue}>{propertyData.carpet_area} Sq.Ft</Text>
        </View>
      )}
      {propertyData?.maintenance && (
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Maintenance:</Text>
          <Text style={styles.detailValue}>{propertyData.maintenance}</Text>
        </View>
      )}
      {propertyData?.total_floors && (
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Total Floors:</Text>
          <Text style={styles.detailValue}>{propertyData.total_floors}</Text>
        </View>
      )}
      {propertyData?.floor_no && (
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Floor No:</Text>
          <Text style={styles.detailValue}>{propertyData.floor_no}</Text>
        </View>
      )}
      {propertyData?.facing && (
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Facing:</Text>
          <Text style={styles.detailValue}>{propertyData.facing}</Text>
        </View>
      )}
      {propertyData?.project_name && (
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Project Name:</Text>
          <Text style={styles.detailValue}>{propertyData.project_name}</Text>
        </View>
      )}

      {/* Plot Details */}
      {propertyData?.type === 'Plot' && (
        <>
          <Text style={styles.sectionTitle}>Plot Details</Text>
          {propertyData?.plot_type && (
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Plot Type:</Text>
              <Text style={styles.detailValue}>{propertyData.plot_type}</Text>
            </View>
          )}
          {propertyData?.plot_area && (
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Plot Area:</Text>
              <Text style={styles.detailValue}>{propertyData.plot_area} Sq.Ft</Text>
            </View>
          )}
          {propertyData?.length && (
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Length:</Text>
              <Text style={styles.detailValue}>{propertyData.length} ft</Text>
            </View>
          )}
          {propertyData?.breadth && (
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Breadth:</Text>
              <Text style={styles.detailValue}>{propertyData.breadth} ft</Text>
            </View>
          )}
        </>
      )}

      {/* PG Details */}
      {propertyData?.type === 'PG' && (
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Meals Included:</Text>
          <Text style={styles.detailValue}>{propertyData?.meals || 'No'}</Text>
        </View>
      )}

      {/* Address Section */}
      {(propertyData?.door_no || propertyData?.street_name || propertyData?.area || propertyData?.city || propertyData?.state || propertyData?.pincode) && (
        <>
          <Text style={styles.sectionTitle}>Address</Text>
          {propertyData?.door_no && (
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Door No:</Text>
              <Text style={styles.detailValue}>{propertyData.door_no}</Text>
            </View>
          )}
          {propertyData?.street_name && (
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Street:</Text>
              <Text style={styles.detailValue}>{propertyData.street_name}</Text>
            </View>
          )}
          {propertyData?.area && (
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Area:</Text>
              <Text style={styles.detailValue}>{propertyData.area}</Text>
            </View>
          )}
          {propertyData?.city && (
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>City:</Text>
              <Text style={styles.detailValue}>{propertyData.city}</Text>
            </View>
          )}
          {propertyData?.state && (
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>State:</Text>
              <Text style={styles.detailValue}>{propertyData.state}</Text>
            </View>
          )}
          {propertyData?.pincode && (
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Pincode:</Text>
              <Text style={styles.detailValue}>{propertyData.pincode}</Text>
            </View>
          )}
        </>
      )}

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editbuttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.publishButton}>
          <Text style={styles.buttonText}>Publish</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const Feature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <Icon name={icon} size={24} />
    <Text>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#555',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginVertical: 10,
  },
  saleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saleTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  featuresRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  description: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationHighlightTitle: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
    marginTop: 40,marginBottom:60,margin:10,
  },
  editButton: {
    backgroundColor: '#fff',
    borderColor: '#f60138',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  publishButton: {
    backgroundColor: '#f60138',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  editbuttonText: {
    color: '#f60138',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 120,
  },
  detailValue: {
    color: '#555',
  },
});

export default PropertyDetailPage;
