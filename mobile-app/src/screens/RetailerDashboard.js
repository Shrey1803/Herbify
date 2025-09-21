import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from 'react-native-animatable';

const colors = {
  background: "#161B24",
  primary: "#35FFD6",
  secondary: "#065F46",
  textLight: "#BFC6D5",
  textDark: "#FFFFFF",
  inactive: "#67748C",
  actionButtonBg: "#1ED187",
  darkBg: "#202534",
  warning: "#FCD34D",
  error: "#F87171",
  success: "#34D399",
};

const RetailerDashboard = () => {
  const navigation = useNavigation();

  // Animation references (removed action cards custom animation)
  const headerLogoScale = useRef(new Animated.Value(1)).current;
  const notificationPulse = useRef(new Animated.Value(0)).current;
  const logoutButtonScale = useRef(new Animated.Value(1)).current;
  const batchCardsAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate header logo gently scaling
    Animated.loop(
      Animated.sequence([
        Animated.timing(headerLogoScale, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
        Animated.timing(headerLogoScale, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Pulse animation for notification dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(notificationPulse, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(notificationPulse, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ])
    ).start();

    // Fade in animation for metrics cards
    Animated.timing(batchCardsAnimation, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    navigation.replace("Login");
  };

  const pulseBackgroundColor = notificationPulse.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF5252", "#FF0000"],
  });

  const animatedMetricStyle = {
    opacity: batchCardsAnimation,
    transform: [
      {
        translateY: batchCardsAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {/* Header with reduced padding */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}} style={styles.iconTouchable}>
          <MaterialIcons name="menu" size={28} color={colors.primary} />
        </TouchableOpacity>

        <Animated.Image
          source={require("../assets/herbify-logo.png")}
          style={[styles.logo, { transform: [{ scale: headerLogoScale }] }]}
        />
        <Text style={styles.headerTitle}>Herbify</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => {}} style={styles.iconTouchable}>
            <Ionicons name="notifications-outline" size={26} color={colors.primary} />
            <Animated.View
              style={[
                styles.notificationDot,
                { backgroundColor: pulseBackgroundColor },
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Animated.sequence([
                Animated.timing(logoutButtonScale, { toValue: 0.9, duration: 150, useNativeDriver: true }),
                Animated.timing(logoutButtonScale, { toValue: 1, duration: 150, useNativeDriver: true }),
              ]).start(() => handleLogout());
            }}
            style={styles.iconTouchable}
          >
            <Animated.View style={{ transform: [{ scale: logoutButtonScale }] }}>
              <Ionicons name="log-out-outline" size={26} color={colors.primary} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>Welcome, Retailer!</Text>

        {/* Metric Cards without green animation */}
        <Animated.View style={[styles.metricRow, animatedMetricStyle]}>
          <View style={[styles.metricCard, styles.metricCard3D, { shadowColor: colors.success }]}>
            <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={36} color={colors.success} />
            <Text style={styles.metricLabel}>Active Batches</Text>
            <Text style={styles.metricValue}>12</Text>
          </View>
          <View style={[styles.metricCard, styles.metricCard3D, { shadowColor: colors.primary }]}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={36} color={colors.primary} />
            <Text style={styles.metricLabel}>Incoming</Text>
            <Text style={styles.metricValue}>3</Text>
          </View>
        </Animated.View>

        {/* Actions Section with bounceIn animation using react-native-animatable */}
        <Text style={styles.actionsTitle}>Actions</Text>

        <Animatable.View animation="bounceIn" delay={0} style={styles.actionCard}>
          <MaterialCommunityIcons name="qrcode-scan" size={30} color={colors.primary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionCardTitle}>Generate Serialized Tags</Text>
            <Text style={styles.actionCardDesc}>Create unique QR codes or NFC tags for new products.</Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.actionButtonText}>Generate Now</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <Animatable.View animation="bounceIn" delay={150} style={styles.actionCard}>
          <MaterialCommunityIcons name="link-variant" size={30} color={colors.primary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionCardTitle}>Link Packaging</Text>
            <Text style={styles.actionCardDesc}>Associate packaging with full product provenance.</Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.actionButtonText}>Start Linking</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <Animatable.View animation="bounceIn" delay={300} style={styles.actionCard}>
          <MaterialCommunityIcons name="flask-outline" size={30} color={colors.primary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionCardTitle}>Attach Lab Reports</Text>
            <Text style={styles.actionCardDesc}>Upload and link lab analysis reports.</Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#444C5E" }]}>
              <Text style={styles.actionButtonText}>Upload Report</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <Animatable.View animation="bounceIn" delay={450} style={styles.actionCard}>
          <MaterialCommunityIcons name="leaf" size={30} color={colors.primary} />
          <View style={styles.actionContent}>
            <Text style={styles.actionCardTitle}>Add Sustainability Scores</Text>
            <Text style={styles.actionCardDesc}>Update sustainability metrics.</Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#444C5E" }]}>
              <Text style={styles.actionButtonText}>Update Score</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>

      {/* Optimized Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]} activeOpacity={0.7}>
          <MaterialIcons name="dashboard" size={28} color={colors.primary} />
          <Text style={[styles.navText, styles.navTextActive]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialIcons name="inventory" size={28} color={colors.inactive} />
          <Text style={styles.navText}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialCommunityIcons name="qrcode-scan" size={28} color={colors.inactive} />
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialCommunityIcons name="file-document-outline" size={28} color={colors.inactive} />
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialIcons name="account-circle" size={28} color={colors.inactive} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 15 : 30,
    paddingHorizontal: 15,
    paddingBottom: 5,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    elevation: 4,
  },
  iconTouchable: {
    padding: 8,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 26,
    color: colors.primary,
    fontWeight: "700",
    letterSpacing: 1,
    marginLeft: 8,
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
    position: "absolute",
    top: -3,
    right: -3,
    borderWidth: 2,
    borderColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 110,
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 22,
    color: colors.textLight,
    fontWeight: "700",
    marginVertical: 16,
  },
  metricRow: {
    flexDirection: "row",
    marginBottom: 24,
    justifyContent: "space-between",
  },
  metricCard: {
    backgroundColor: colors.darkBg,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 28,
    paddingHorizontal: 0,
    alignItems: "center",
    elevation: 3,
  },
  metricCard3D: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8,
  },
  metricLabel: {
    color: colors.textLight,
    fontSize: 16,
    marginTop: 12,
  },
  metricValue: {
    color: colors.textDark,
    fontSize: 28,
    fontWeight: "700",
    marginTop: 8,
  },
  actionsTitle: {
    fontSize: 20,
    color: colors.primary,
    marginBottom: 18,
    fontWeight: "700",
  },
  actionCard: {
    backgroundColor: colors.darkBg,
    borderRadius: 16,
    flexDirection: "row",
    padding: 20,
    marginBottom: 18,
    alignItems: "center",
    gap: 20,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  actionContent: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 17,
    color: colors.textDark,
    fontWeight: "700",
    marginBottom: 6,
  },
  actionCardDesc: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 14,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignSelf: "flex-start",
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.background,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.darkBg,
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#111",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  navItemActive: {
    backgroundColor: "rgba(53, 255, 214, 0.1)",
    borderRadius: 8,
  },
  navText: {
    fontSize: 11,
    marginTop: 4,
    color: colors.inactive,
  },
  navTextActive: {
    fontSize: 11,
    marginTop: 4,
    color: colors.primary,
    fontWeight: "700",
  },
});

export default RetailerDashboard;
