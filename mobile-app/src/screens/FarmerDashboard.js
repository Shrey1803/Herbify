// FarmerDashboard.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  dark: '#100B00',
  mint: '#EFFFC8',
  green: '#85CB33',
  bluegreen: '#A5CBC3',
  white: '#FFFFFF',
};

// Blinking Text Component
function BlinkingText({ children, style }) {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);
  return <Animated.Text style={[style, { opacity }]}>{children}</Animated.Text>;
}

export default function FarmerDashboard() {
  const navigation = useNavigation();

  const [harvestData, setHarvestData] = useState([
    {
      id: '1',
      image: require('../assets/basil.jpg'),
      name: 'Basil',
      batchId: 'H8S1L',
      location: 'Moca, PR',
      date: '12/05/24 08:15',
      cid: 'JX-734',
      tag: 'Tag Bound',
      tagColor: COLORS.green,
      status: 'Verified',
      statusColor: COLORS.green,
      moisture: '12%',
      freshness: 'A+',
      aiSpecies: 'Basil',
      aiStatus: null,
    },
    {
      id: '2',
      image: require('../assets/rosemary.jpg'),
      name: 'Rosemary',
      batchId: 'R9T2M',
      location: 'Isabela, PR',
      date: '11/05/24 14:30',
      cid: 'JX-734',
      tag: 'No Tag',
      tagColor: '#E9B548',
      status: 'Pending',
      statusColor: '#E9B548',
      moisture: 'N/A',
      freshness: 'N/A',
      aiSpecies: null,
      aiStatus: 'Processing',
    },
  ]);

  // Animations for list items + button
  const itemAnimations = useRef(harvestData.map(() => new Animated.Value(0))).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animations = itemAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();
  }, []);

  const handleNewEntryPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      // TODO: open new harvest entry flow
    });
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <SafeAreaView style={styles.background} edges={['top']}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image style={styles.avatar} source={require('../assets/farmer-avatar.png')} />
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>Rosa</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
          {/* 🔔 Bell now navigates to AlertScreen */}
          <TouchableOpacity style={styles.bellIconWrap} onPress={() => navigation.navigate('AlertScreen')}>
            <Image source={require('../assets/bell.png')} style={styles.bellIcon} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          {/* 🔑 Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={28} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.brandTitle}>Herbify</Text>
      <Text style={styles.subtitle}>Dashboard</Text>

      {/* Harvest Log Card */}
      <View style={styles.logCard}>
        <View style={styles.logHeaderRow}>
          <Text style={styles.sectionTitle}>Harvest Log</Text>
          <AnimatedPressable
            style={[styles.newEntryButton, { transform: [{ scale: buttonScale }] }]}
            onPress={handleNewEntryPress}
          >
            <Text style={styles.newEntryText}>+ New Entry</Text>
          </AnimatedPressable>
        </View>

        <FlatList
          data={harvestData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const animatedStyle = {
              opacity: itemAnimations[index],
              transform: [
                {
                  translateY: itemAnimations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            };
            return (
              <Animated.View style={[styles.harvestItem, animatedStyle]} key={item.id}>
                <View style={styles.cropHeader}>
                  <Image source={item.image} style={styles.cropImage} />
                  <View style={styles.cropInfo}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.cropName}>{item.name}</Text>
                      <View style={[styles.statusPill, { backgroundColor: item.statusColor }]}>
                        {item.status === 'Pending' ? (
                          <BlinkingText style={styles.statusPillText}>{item.status}</BlinkingText>
                        ) : (
                          <Text style={styles.statusPillText}>{item.status}</Text>
                        )}
                      </View>
                    </View>
                    <Text style={styles.batchId}>Batch ID: {item.batchId}</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoText}>{item.location}</Text>
                      <Text style={styles.infoText}>{item.date}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoText}>CID: {item.cid}</Text>
                      <Text style={[styles.tag, { color: item.tagColor }]}>{item.tag}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.qualityBlock}>
                  <Text style={styles.qualityTitle}>Quality Checks</Text>
                  <View style={styles.qualityRow}>
                    <Text style={styles.qualityItem}>Moisture: {item.moisture}</Text>
                    <Text style={styles.qualityItem}>Freshness: {item.freshness}</Text>
                    {item.aiSpecies ? (
                      <Text style={styles.qualityItem}>AI Species: {item.aiSpecies}</Text>
                    ) : (
                      <BlinkingText style={[styles.qualityItem, { color: '#E9B548' }]}>
                        AI: {item.aiStatus}
                      </BlinkingText>
                    )}
                  </View>
                </View>
              </Animated.View>
            );
          }}
        />
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Ionicons name="home" size={24} color={COLORS.green} />
          <Text style={[styles.tabLabel, styles.tabActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Ionicons name="add-circle-outline" size={24} color={COLORS.bluegreen} />
          <Text style={[styles.tabLabel, styles.tabInactive]}>New Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('AlertScreen')}
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.bluegreen} />
          <Text style={[styles.tabLabel, styles.tabInactive]}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <Ionicons name="person-outline" size={24} color={COLORS.bluegreen} />
          <Text style={[styles.tabLabel, styles.tabInactive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: COLORS.dark },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 26,
  },
  avatar: { width: 60, height: 52, borderRadius: 2, marginRight: 3 },
  welcomeText: { color: COLORS.bluegreen, fontSize: 16 },
  userName: { color: COLORS.white, fontSize: 22, fontWeight: 'bold' },
  bellIconWrap: { position: 'relative', marginRight: 16 },
  bellIcon: { width: 28, height: 28 },
  badge: {
    position: 'absolute',
    right: -5,
    top: -4,
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingHorizontal: 5,
  },
  badgeText: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  logoutButton: { padding: 6, justifyContent: 'center', alignItems: 'center' },
  brandTitle: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 2,
    letterSpacing: 1,
  },
  subtitle: { color: COLORS.bluegreen, fontSize: 18, textAlign: 'center', marginBottom: 18 },
  logCard: {
    backgroundColor: COLORS.mint,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flex: 1,
    padding: 20,
  },
  logHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  sectionTitle: { color: COLORS.dark, fontSize: 22, fontWeight: 'bold' },
  newEntryButton: { backgroundColor: COLORS.green, borderRadius: 24, paddingHorizontal: 20, paddingVertical: 8 },
  newEntryText: { color: COLORS.dark, fontWeight: 'bold', fontSize: 15 },
  harvestItem: { backgroundColor: COLORS.bluegreen, borderRadius: 18, marginBottom: 18, padding: 12 },
  cropHeader: { flexDirection: 'row', marginBottom: 8 },
  cropImage: { width: 70, height: 70, borderRadius: 14, marginRight: 13 },
  cropInfo: { flex: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cropName: { color: COLORS.dark, fontSize: 19, fontWeight: '700' },
  statusPill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 70,
  },
  statusPillText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  batchId: { color: COLORS.dark, fontSize: 13, marginBottom: 3 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  infoText: { color: COLORS.dark, fontSize: 13 },
  tag: { fontWeight: 'bold' },
  qualityBlock: { marginTop: 8, borderTopWidth: 1, borderTopColor: COLORS.green, paddingTop: 7 },
  qualityTitle: { color: COLORS.dark, fontWeight: 'bold', marginBottom: 4 },
  qualityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  qualityItem: { color: COLORS.dark, fontSize: 13, marginRight: 13 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.mint,
    borderTopWidth: 1,
    borderTopColor: COLORS.green,
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  tabLabel: { fontSize: 12, fontWeight: '500', marginTop: 4 },
  tabActive: { color: COLORS.green },
  tabInactive: { color: COLORS.bluegreen },
});
