import React, { useState, useRef, useEffect } from 'react';
import { Alert, TouchableOpacity, Text, View, ScrollView, StyleSheet, Dimensions, Image, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const colors = {
  background: '#111827',
  cardBackground: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  accent: '#6EEA8E',
  primary: '#166534',
  warning: '#FCD34D',
  error: '#F87171',
  success: '#34D399',
};

async function updateShipmentStatus(scannedCode, userId) {
  console.log(`Updating shipment for code: ${scannedCode}, user: ${userId}`);
  await new Promise((res) => setTimeout(res, 1000));
  if (scannedCode.startsWith('BATCH')) {
    return { success: true };
  } else {
    return { success: false, message: 'Invalid batch code' };
  }
}

export default function TransporterDashboard() {
  const navigation = useNavigation();
  const [userId] = useState('USER123');

  // Animation refs
  const scanSectionAnim = useRef(new Animated.Value(0)).current;
  const shipmentCardAnim = useRef(new Animated.Value(0)).current;
  const provenanceAnim = useRef(new Animated.Value(0)).current;
  const alertBgAnim = useRef(new Animated.Value(0)).current;
  const mapScale = useRef(new Animated.Value(1)).current;
  const mapOverlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(scanSectionAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(shipmentCardAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(provenanceAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    // Slow, continuous blinking animation for alert background
    Animated.loop(
      Animated.sequence([
        Animated.timing(alertBgAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(alertBgAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    ).start();

    // Fade in map overlay
    Animated.timing(mapOverlayOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, []);

  const scanHandler = async (scannedCode) => {
    if (!scannedCode || scannedCode.length < 3) {
      Alert.alert('Invalid scan', 'Scanned code is invalid or empty.');
      return;
    }

    try {
      const response = await updateShipmentStatus(scannedCode, userId);

      if (response.success) {
        Alert.alert('Success', 'Shipment status updated successfully!');
        // Refresh UI or fetch updated shipment data here
      } else {
        Alert.alert('Error', response.message || 'Failed to update shipment');
      }
    } catch (error) {
      Alert.alert('Error', `Scan processing failed: ${error.message}`);
    }
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const handlePressIn = (anim) => {
    Animated.spring(anim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = (anim) => {
    Animated.spring(anim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  const handleMapPressIn = () => {
    Animated.spring(mapScale, { toValue: 1.05, useNativeDriver: true }).start();
  };

  const handleMapPressOut = () => {
    Animated.spring(mapScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  };

  const pickupScale = useRef(new Animated.Value(1)).current;
  const dropoffScale = useRef(new Animated.Value(1)).current;

  const scanSectionStyle = {
    opacity: scanSectionAnim,
    transform: [{ translateY: scanSectionAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
  };

  const shipmentCardStyle = {
    opacity: shipmentCardAnim,
    transform: [{ translateY: shipmentCardAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
  };

  const provenanceStyle = {
    opacity: provenanceAnim,
    transform: [{ translateY: provenanceAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
  };

  const alertBgColor = alertBgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(180, 83, 9, 0.2)', 'rgba(180, 83, 9, 0.5)'], // Slow fade between semi-transparent shades
  });

  const mapStyle = {
    transform: [{ scale: mapScale }],
  };

  const mapOverlayStyle = {
    opacity: mapOverlayOpacity,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/herbify-logo.png')}
            style={styles.logo}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome, Transporter</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Animated.View style={[styles.card, styles.scanSection, scanSectionStyle]}>
          <Text style={styles.scanTitle}>Scan at Point</Text>
          <View style={styles.scanButtons}>
            <Animated.View style={{ transform: [{ scale: pickupScale }] }}>
              <TouchableOpacity 
                style={styles.scanButton} 
                onPress={() => scanHandler('BATCH123456')}
                onPressIn={() => handlePressIn(pickupScale)}
                onPressOut={() => handlePressOut(pickupScale)}
              >
                <MaterialCommunityIcons name="cellphone-wireless" size={48} color={colors.accent} style={styles.scanIcon} />
                <Text style={styles.scanText}>Pickup Scan</Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: dropoffScale }] }}>
              <TouchableOpacity 
                style={styles.scanButton} 
                onPress={() => scanHandler('XYZ987')}
                onPressIn={() => handlePressIn(dropoffScale)}
                onPressOut={() => handlePressOut(dropoffScale)}
              >
                <MaterialCommunityIcons name="cellphone-wireless" size={48} color={colors.textSecondary} style={styles.scanIcon} />
                <Text style={[styles.scanText, { color: colors.textSecondary }]}>Drop-off Scan</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        <Text style={styles.sectionTitle}>Active Shipment: Basil #789012</Text>
        <Animated.View style={[styles.card, shipmentCardStyle]}>
          <View style={styles.conditionsRow}>
            <View style={styles.conditionCard}>
              <MaterialCommunityIcons name="thermometer" size={24} color={colors.accent} style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.conditionLabel}>Temperature</Text>
                <Text style={styles.conditionValue}>21°C</Text>
              </View>
            </View>
            <View style={styles.conditionCard}>
              <MaterialCommunityIcons name="water-percent" size={24} color={colors.accent} style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.conditionLabel}>Humidity</Text>
                <Text style={styles.conditionValue}>67%</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            activeOpacity={0.8} 
            onPressIn={handleMapPressIn} 
            onPressOut={handleMapPressOut} 
            onPress={() => Alert.alert('Map Details', 'Detailed route view coming soon!')}
          >
            <Animated.View style={[styles.mapPlaceholder, mapStyle]}>
              <Image
                source={require('../assets/map.jpg')}
                style={styles.mapImage}
                resizeMode="cover"
              />
              <Animated.Text style={[styles.mapOverlayText, mapOverlayStyle]}>
                Tap to view details
              </Animated.Text>
            </Animated.View>
          </TouchableOpacity>

          <Animated.View style={[styles.alertContainer, { backgroundColor: alertBgColor }]}>
            <MaterialIcons name="warning" size={24} color={colors.warning} />
            <View style={styles.alertText}>
              <Text style={{ color: colors.warning, fontWeight: '600' }}>Anomaly Alert</Text>
              <Text style={{ color: '#FDE68A', fontSize: 14 }}>Unscheduled stop detected at 11:45 AM.</Text>
            </View>
          </Animated.View>
        </Animated.View>

        <Text style={styles.sectionTitle}>Provenance Trail</Text>
        <Animated.View style={[styles.card, provenanceStyle]}>
          <View style={styles.provenanceItem}>
            <MaterialCommunityIcons name="sprout" size={24} color={colors.accent} style={styles.provenanceIcon} />
            <View style={styles.provenanceContent}>
              <Text style={styles.provenanceTitle}>Farmer John</Text>
              <Text style={styles.provenanceSubtitle}>Harvested: Basil</Text>
              <Text style={styles.provenanceSubtitle}>June 10, 8:00 AM</Text>
            </View>
          </View>

          <View style={styles.provenanceItem}>
            <MaterialCommunityIcons name="truck-check-outline" size={24} color={colors.accent} style={styles.provenanceIcon} />
            <View style={styles.provenanceContent}>
              <Text style={styles.provenanceTitle}>Pickup Scan (You)</Text>
              <Text style={styles.provenanceSubtitle}>Location: Green Farms</Text>
              <Text style={styles.provenanceSubtitle}>June 10, 9:15 AM</Text>
            </View>
          </View>

          <View style={styles.provenanceItem}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.textSecondary} style={styles.provenanceIcon} />
            <Text style={[styles.provenanceSubtitle, { fontStyle: 'italic', marginLeft: 4 }]}>
              In-transit to retailer...
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.tabBar}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.tabItem}>
            <MaterialIcons name="dashboard" size={24} color={colors.accent} style={styles.tabIcon} />
            <Text style={[styles.tabLabel, styles.tabActive]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <MaterialCommunityIcons name="truck-delivery" size={24} color={colors.textSecondary} style={styles.tabIcon} />
            <Text style={[styles.tabLabel, styles.tabInactive]}>Shipments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <MaterialCommunityIcons name="file-document-multiple-outline" size={24} color={colors.textSecondary} style={styles.tabIcon} />
            <Text style={[styles.tabLabel, styles.tabInactive]}>Provenance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="person-outline" size={24} color={colors.textSecondary} style={styles.tabIcon} />
            <Text style={[styles.tabLabel, styles.tabInactive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scanSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  scanButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  scanButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scanIcon: {
    marginBottom: 8,
  },
  scanText: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  conditionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  conditionCard: {
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  conditionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  conditionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  mapPlaceholder: {
    width: '100%',
    height: 250, // Slightly reduced from 300 to 250
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlayText: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
  },
  alertContainer: {
    borderColor: '#D97706',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  alertText: {
    color: '#FCD34D',
    marginLeft: 12,
    flex: 1,
  },
  provenanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  provenanceIcon: {
    marginRight: 12,
  },
  provenanceContent: {
    flex: 1,
  },
  provenanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  provenanceSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: '#374151',
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabActive: {
    color: colors.accent,
  },
  tabInactive: {
    color: colors.textSecondary,
  },
});
