import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Animated,
  Pressable,
  Image,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const colors = {
  background: '#111827',
  cardBackground: '#1F2937',
  labCardBackground: '#1A1A1A',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  accent: '#6EEA8E',
  labAccent: '#A3FFD2',
  primary: '#166534',
  labPrimary: '#004D40',
  warning: '#FCD34D',
  error: '#F87171',
  success: '#34D399',
};

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

const LabDashboard = () => {
  const navigation = useNavigation();

  const batchData = [
    {
      id: '1',
      title: 'Batch HFY-72A: Moisture Test',
      farmer: 'Ram Singh',
      type: 'moisture',
      status: 'pass',
      action: null
    },
    {
      id: '2',
      title: 'Batch HFY-68B: Pesticide Analysis',
      farmer: 'Sita Devi',
      type: 'pesticide',
      status: 'fail',
      action: 'Notification sent to Farmer & Manager. Batch quarantined.'
    },
    {
      id: '3',
      title: 'Batch HFY-55C: DNA Barcoding',
      farmer: 'Vijay Kumar',
      type: 'dna',
      status: 'pass',
      action: null
    }
  ];

  const itemAnimations = useRef(batchData.map(() => new Animated.Value(0))).current;
  const uploadButtonScale = useRef(new Animated.Value(1)).current;
  const batchesLightAnim = useRef(new Animated.Value(0)).current;
  const testsLightAnim = useRef(new Animated.Value(0)).current;

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

    Animated.loop(
      Animated.sequence([
        Animated.timing(batchesLightAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(batchesLightAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(testsLightAnim, { toValue: 1, duration: 1800, useNativeDriver: false }),
        Animated.timing(testsLightAnim, { toValue: 0, duration: 1800, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const handleUploadPress = () => {
    Animated.sequence([
      Animated.timing(uploadButtonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(uploadButtonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const batchBackgroundColor = batchesLightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.labCardBackground, '#2A4F3D'],
  });
  const testBackgroundColor = testsLightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.labCardBackground, '#1A3A2B'],
  });

  const getBatchIcon = (type) => {
    switch (type) {
      case 'moisture': return <MaterialCommunityIcons name="water" size={28} color={colors.labAccent} />;
      case 'pesticide': return <MaterialCommunityIcons name="bug" size={28} color={colors.labAccent} />;
      case 'dna': return <MaterialCommunityIcons name="dna" size={28} color={colors.labAccent} />;
      default: return <MaterialCommunityIcons name="clipboard-text" size={28} color={colors.labAccent} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../assets/herbify-logo.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>Herbify</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>Lab Dashboard</Text>
          <Text style={styles.welcomeText}>Welcome, Dr. Anya Sharma</Text>
        </View>

        <View style={styles.statsContainer}>
          <Animated.View style={[styles.statCard, { backgroundColor: batchBackgroundColor }]}>
            <Text style={styles.statLabel}>Batches Pending</Text>
            <Text style={styles.statValue}>12</Text>
            <MaterialCommunityIcons name="package-variant" size={40} color={colors.labAccent} style={styles.statIcon} />
          </Animated.View>
          <Animated.View style={[styles.statCard, { backgroundColor: testBackgroundColor }]}>
            <Text style={styles.statLabel}>Tests Completed</Text>
            <Text style={styles.statValue}>87</Text>
            <MaterialCommunityIcons name="flask" size={40} color={colors.labAccent} style={styles.statIcon} />
          </Animated.View>
        </View>

        <View style={styles.labSectionHeader}>
          <Text style={styles.sectionTitle}>Batch Quality Reports</Text>
          <AnimatedPressable
            style={[styles.uploadButton, { transform: [{ scale: uploadButtonScale }] }]}
            onPress={handleUploadPress}
            android_ripple={{ color: 'rgba(163,255,210,0.3)' }}
          >
            <Ionicons name="arrow-up-circle-outline" size={20} color={colors.labAccent} />
            <Text style={styles.uploadButtonText}>Upload Report</Text>
          </AnimatedPressable>
        </View>

        {batchData.map((batch, index) => {
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
            <Animated.View key={batch.id} style={[styles.batchItem, animatedStyle]}>
              <View style={styles.batchHeader}>
                <View style={styles.batchIcon}>{getBatchIcon(batch.type)}</View>
                <View style={styles.batchInfo}>
                  <Text style={styles.batchTitle}>{batch.title}</Text>
                  <Text style={styles.batchSubtitle}>Farmer: {batch.farmer}</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-vertical" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.batchFooter}>
                <Text style={styles.blockchainText}>Blockchain Validation...</Text>
                <View
                  style={[
                    styles.statusBadge,
                    batch.status === 'pass' ? styles.statusBadgePass : styles.statusBadgeFail,
                  ]}
                >
                  <Text style={{ fontSize: 14 }}>{batch.status === 'pass' ? '✓' : '✗'}</Text>
                  <Text
                    style={[
                      styles.statusText,
                      batch.status === 'pass' ? styles.statusTextPass : styles.statusTextFail,
                    ]}
                  >
                    {batch.status === 'pass' ? 'Pass' : 'Fail'}
                  </Text>
                </View>
              </View>

              {batch.action && (
                <View style={styles.actionAlert}>
                  <Text style={styles.actionAlertText}>
                    <Text style={{ fontWeight: '600' }}>Action:</Text> {batch.action}
                  </Text>
                </View>
              )}
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Wrapped tabBar inside SafeAreaView with bottom edge to avoid clashes */}
      <SafeAreaView edges={['bottom']} style={styles.safeBottom}>
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
            <Ionicons name="speedometer-outline" size={24} color={colors.labAccent} />
            <Text style={[styles.tabLabel, styles.tabActive, { fontWeight: 'bold' }]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
            <Ionicons name="flask-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.tabLabel, styles.tabInactive]}>All Tests</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
            <Ionicons name="cloud-upload-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.tabLabel, styles.tabInactive]}>Uploads</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
            <Ionicons name="person-outline" size={24} color={colors.textSecondary} />
            <Text style={[styles.tabLabel, styles.tabInactive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    elevation: 5,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 36, height: 36, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.labAccent },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 12 },
  content: { flex: 1, padding: 16 },
  statCard: {
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  statValue: { fontSize: 32, fontWeight: 'bold', color: colors.labAccent },
  statLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '500', marginBottom: 8 },
  statIcon: { position: 'absolute', right: 16, bottom: 16, opacity: 0.3 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  welcomeText: { fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
  labSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4, // Adds horizontal padding for balanced spacing
  },
  uploadButton: {
    backgroundColor: colors.labPrimary,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: colors.labAccent,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  batchItem: { backgroundColor: colors.labCardBackground, borderRadius: 8, padding: 16, marginBottom: 12 },
  batchHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  batchIcon: { width: 48, height: 48, borderRadius: 6, backgroundColor: colors.labPrimary, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  batchInfo: { flex: 1 },
  batchTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  batchSubtitle: { fontSize: 14, color: colors.textSecondary },
  batchFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  blockchainText: { fontSize: 12, color: colors.textSecondary },
  statusBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, flexDirection: 'row', alignItems: 'center' },
  statusBadgePass: { backgroundColor: 'rgba(52, 211, 153, 0.5)' },
  statusBadgeFail: { backgroundColor: 'rgba(248, 113, 113, 0.5)' },
  statusText: { fontSize: 12, fontWeight: '500', marginLeft: 4 },
  statusTextPass: { color: '#34D399' },
  statusTextFail: { color: '#F87171' },
  actionAlert: { backgroundColor: 'rgba(185, 28, 28, 0.2)', borderColor: 'rgba(185, 28, 28, 0.5)', borderWidth: 1, borderRadius: 6, padding: 8, marginTop: 12 },
  actionAlertText: { color: '#FCA5A5', fontSize: 12 },

  safeBottom: {
    backgroundColor: '#000000',
  },

tabBar: {
  flexDirection: 'row',
  backgroundColor: '#000000',
  borderTopColor: '#374151',
  borderTopWidth: 1,
  paddingTop: 8,
  paddingBottom: Platform.OS === 'android' ? 4 : 12, // Reduced bottom padding further
  paddingHorizontal: 10,
},
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 12, fontWeight: '500', marginTop: 4 },
  tabActive: { color: colors.labAccent },
  tabInactive: { color: colors.textSecondary },
});

export default LabDashboard;
