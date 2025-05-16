import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator,FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function CategoryList() {
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://masonshop.in/api/category_statusapi');
        const json = await res.json();
        if (json.data) {
          setCategories(json.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchCategories();
    }, []);
  
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Loading categories...</Text>
        </View>
      );
    }
  
    return (
        <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ProductsPage', { categoryId: item.id })}
            style={styles.categoryItem}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
    );
  }
  
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 8,
  },
  categoryText: { fontSize: 18 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
