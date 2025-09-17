import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const colors = {
  background: '#111714',
  cardBackground: '#1C2620',
  text: '#F9FAFB',
  textSecondary: '#9eb7a8',
  accent: '#1dc962',
  border: '#29382f',
};

const ConsumerDashboard = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const recentScans = [
    { id: '1', title: 'Organic Mint Tea', subtitle: 'Verified: 2 days ago', icon: 'leaf', color: '#4ade80' },
    { id: '2', title: 'Fair Trade Coffee Beans', subtitle: 'Verified: 1 week ago', icon: 'coffee', color: '#a78bfa' },
    { id: '3', title: 'Sustainable Salmon', subtitle: 'Verified: 3 weeks ago', icon: 'fish', color: '#60a5fa' },
  ];

  const itemAnimations = useRef(recentScans.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();

    const animations = itemAnimations.map((anim, index) =>
      Animated.timing(anim, { toValue: 1, duration: 500, delay: index * 150 + 400, useNativeDriver: true })
    );
    Animated.parallel(animations).start();
  }, []);

  const handleScanPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate('ScanScreen');
    });
  };

  const handleLogout = () => {
    // Reset stack and go to Login screen
    navigation.replace('Login');
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Herbify</Text>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={handleLogout} style={[styles.settingsButton, {marginRight: 10}]}>
              <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <View style={styles.searchIcon}>
              <Ionicons name="search" size={20} color={colors.textSecondary} />
            </View>
            <TextInput style={styles.searchInput} placeholder="Search for products" placeholderTextColor={colors.textSecondary} />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Scan & Verify</Text>
          </View>

          <View style={styles.scanCard}>
            <View style={styles.scanImageContainer}>
              <MaterialCommunityIcons name="package-variant" size={48} color="#6B7280" />
            </View>
            <View style={styles.scanContent}>
              <Text style={styles.scanTitle}>Scan Product</Text>
              <Text style={styles.scanDescription}>
                Use your camera to scan QR codes or NFC tags on products to verify their authenticity and journey.
              </Text>
              <AnimatedPressable
                style={[styles.scanButton, { transform: [{ scale: buttonScale }] }]}
                onPress={handleScanPress}
                android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
              >
                <MaterialCommunityIcons name="qrcode-scan" size={20} color={colors.background} style={styles.scanButtonIcon} />
                <Text style={styles.scanButtonText}>Scan Now</Text>
              </AnimatedPressable>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
          </View>

          <View style={styles.recentScansContainer}>
            {recentScans.map((item, index) => {
              const animatedStyle = {
                opacity: itemAnimations[index],
                transform: [
                  {
                    translateY: itemAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              };

              return (
                <Animated.View key={item.id} style={animatedStyle}>
                  <TouchableOpacity style={styles.scanItem} activeOpacity={0.8}>
                    <View style={[styles.scanItemImage, { backgroundColor: item.color + '20' }]}>
                      <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                    </View>
                    <View style={styles.scanItemContent}>
                      <Text style={styles.scanItemTitle}>{item.title}</Text>
                      <Text style={styles.scanItemSubtitle}>{item.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
            <Ionicons name="home" size={24} color={colors.accent} />
            <Text style={[styles.tabLabel, styles.tabActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
            <Ionicons name="qr-code-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.tabLabel, styles.tabInactive]}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
            <Ionicons name="time-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.tabLabel, styles.tabInactive]}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
            <Ionicons name="person-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.tabLabel, styles.tabInactive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
  headerSpacer: { width: 40 },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    flex: 1,
    letterSpacing: 0.5,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  searchContainer: { paddingHorizontal: 20, paddingBottom: 16 },
  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  searchInput: {
    flex: 1,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 16,
  },
  content: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  sectionHeader: { paddingHorizontal: 20, paddingVertical: 16 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, letterSpacing: 0.3 },
  scanCard: {
    marginHorizontal: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  scanImageContainer: {
    height: 180,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanContent: { padding: 20 },
  scanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  scanDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scanButtonIcon: { marginRight: 8 },
  scanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
  },
  recentScansContainer: { paddingHorizontal: 20 },
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scanItemImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanItemContent: { flex: 1 },
  scanItemTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 },
  scanItemSubtitle: { fontSize: 14, color: colors.textSecondary },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: { fontSize: 12, fontWeight: '500', marginTop: 4 },
  tabActive: { color: colors.accent },
  tabInactive: { color: colors.textSecondary },
});

export default ConsumerDashboard;
