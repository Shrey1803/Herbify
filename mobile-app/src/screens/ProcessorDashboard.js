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

const colors = {
  background: "#F0F4F3",
  primary: "#2DD4BF",
  secondary: "#065F46",
  text: "#0F1F1C",
  border: "#D3E4DD",
  inactive: "#647477",
};

const logItems = [
  { id: "1", icon: "science", title: "Extraction Logged", desc: "Ethanol process completed for batch HB-001.", time: "Oct 27, 11:45 AM" },
  { id: "2", icon: "git-compare", title: "Batch Split", desc: "Batch HB-001 split into two sub-batches.", time: "Oct 27, 9:00 AM" },
  { id: "3", icon: "gavel", title: "Smart Contract Validated", desc: "Checks passed for grinding stage.", time: "Oct 26, 4:00 PM" },
  { id: "4", icon: "grain", title: "Grinding Logged", desc: "Dried herbs ground to fine powder.", time: "Oct 26, 3:30 PM" },
  { id: "5", icon: "water-outline", title: "Drying Logged", desc: "Moisture reduced to 8%.", time: "Oct 26, 11:00 AM" },
  { id: "6", icon: "broom", title: "Cleaning Logged", desc: "Initial cleaning of raw herbs.", time: "Oct 26, 9:15 AM" },
];

export default function ProcessorDashboard() {
  const navigation = useNavigation();
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleAddPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);
  const progressPercent = 75;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, { toValue: progressPercent, duration: 800, useNativeDriver: false }).start();
  }, [progressPercent]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const stages = [
    { label: "Cleaning", icon: "broom" },
    { label: "Drying", icon: "water-outline" },
    { label: "Grinding", icon: "grain" },
    { label: "Extraction", icon: "science" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="menu" size={28} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <Image source={require("../assets/herbify-logo.png")} style={styles.logo} />
          <Text style={styles.headerTitle}>Herbify</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={28} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>Processor Dashboard</Text>

          <AnimatedPressable
            style={[styles.addButton, { transform: [{ scale: buttonScale }] }]}
            onPress={handleAddPress}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </AnimatedPressable>
        </View>

        <View style={styles.card}>
          <View style={styles.activeRow}>
            <View>
              <Text style={styles.statusTextMain}>
                Status: <Text style={styles.statusValue}>Grinding</Text>
              </Text>
              <Text style={styles.batchLabel}>
                Active Batch ID: <Text style={styles.batchId}>HB-PR-20231026-001</Text>
              </Text>
            </View>

            <TouchableOpacity style={styles.moreButton}>
              <MaterialIcons name="more-vert" size={28} color={colors.inactive} />
            </TouchableOpacity>
          </View>

          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>

          <View style={styles.stagesRow}>
            {stages.map(({ label, icon }) => (
              <View style={styles.stage} key={label}>
                {icon === "broom" ? (
                  <MaterialCommunityIcons name={icon} size={22} color={label === "Grinding" ? colors.secondary : colors.inactive} />
                ) : icon.includes("outline") || icon.includes("-") ? (
                  <Ionicons name={icon} size={22} color={label === "Grinding" ? colors.secondary : colors.inactive} />
                ) : (
                  <MaterialIcons name={icon} size={22} color={label === "Grinding" ? colors.secondary : colors.inactive} />
                )}
                <Text style={[styles.stageLabel, label === "Grinding" && styles.activeStage]}>
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 14 }}>
          {logItems.map(({ id, icon, title, desc, time }) => (
            <View key={id} style={styles.traceabilityItem}>
              <View style={styles.iconCircle}>
                {icon === "broom" ? (
                  <MaterialCommunityIcons name="broom" size={22} color={colors.secondary} />
                ) : icon.includes("outline") || icon.includes("-") ? (
                  <Ionicons name={icon} size={22} color={colors.secondary} />
                ) : (
                  <MaterialIcons name={icon} size={22} color={colors.secondary} />
                )}
              </View>
              <View style={styles.traceabilityContent}>
                <Text style={styles.traceabilityTitle}>{title}</Text>
                <Text style={styles.traceabilityDesc}>{desc}</Text>
                <Text style={styles.traceabilityTime}>{time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footerTabs}>
        <TouchableOpacity style={styles.footerTab}>
          <Ionicons name="home-outline" size={26} color={colors.secondary} />
          <Text style={[styles.footerTabLabel, styles.footerTabActive]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerTab}>
          <Ionicons name="layers-outline" size={26} color={colors.inactive} />
          <Text style={styles.footerTabLabel}>Batches</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerTab}>
          <Ionicons name="shield-checkmark-outline" size={26} color={colors.inactive} />
          <Text style={styles.footerTabLabel}>QC</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerTab}>
          <Ionicons name="person-outline" size={26} color={colors.inactive} />
          <Text style={styles.footerTabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.secondary,
    paddingTop: Platform.OS === "ios" ? 55 : 36,
    paddingBottom: 14,
    paddingHorizontal: 18,
    elevation: 4,
  },
  headerButton: { padding: 6 },
  headerTitleRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 30, height: 30, marginRight: 8, resizeMode: "contain" },
  headerTitle: { fontSize: 22, fontWeight: "700", color: colors.primary },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 6 },

  contentContainer: { paddingHorizontal: 16, paddingBottom: 80, paddingTop: 16 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  titleText: { fontSize: 24, fontWeight: "700", color: colors.text },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },

  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: colors.border },
  activeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },

  statusTextMain: { fontSize: 16, fontWeight: "700", marginBottom: 4, color: colors.text },
  statusValue: { color: colors.secondary },
  batchLabel: { fontSize: 14, fontWeight: "600", color: colors.text },
  batchId: { color: colors.secondary },

  moreButton: { padding: 4 },

  progressTrack: { height: 14, backgroundColor: colors.border, borderRadius: 7, marginBottom: 10 },
  progressFill: { height: 14, backgroundColor: colors.secondary },

  stagesRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  stage: { flexDirection: "row", alignItems: "center", gap: 4 },
  stageLabel: { fontSize: 12, color: colors.inactive },
  activeStage: { color: colors.text, fontWeight: "700" },

  traceabilityItem: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  iconCircle: {
    width: 36,
    height: 36,
    backgroundColor: "#d4f2df",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  traceabilityContent: { flex: 1 },
  traceabilityTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  traceabilityDesc: { fontSize: 14, color: "#47575C", marginTop: 3 },
  traceabilityTime: { fontSize: 13, color: colors.inactive, marginTop: 4 },

  footerTabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  footerTab: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 6 },
  footerTabLabel: { fontSize: 12, color: colors.inactive },
  footerTabActive: { color: colors.secondary, fontWeight: "700" },
});
