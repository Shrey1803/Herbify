import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const alerts = [
  {
    icon: '⚠️',
    iconColor: '#B53E2C',
    bgColor: '#222D24',
    title: 'Harvest Quota Exceeded',
    subtitle: 'Organic basil quota surpassed by 15%.',
    time: 'Now',
    accent: '#C72525',
  },
  {
    icon: '🌡️',
    iconColor: '#FF9800',
    bgColor: '#212313',
    title: 'Transport Condition Anomaly',
    subtitle: 'High temperature detected in Vehicle #3.',
    time: '5m ago',
    accent: '#F59E42',
  },
  {
    icon: '🧪',
    iconColor: '#E2B400',
    bgColor: '#212313',
    title: 'Failed Lab Report',
    subtitle: 'Rosemary batch #B456 failed pesticide test.',
    time: '1hr ago',
    accent: '#FFD600',
  },
  {
    icon: '❌',
    iconColor: '#EE4C4C',
    bgColor: '#222124',
    title: 'Product Recall',
    subtitle: 'URGENT: Recall notice for thyme batch #T789.',
    time: '3hr ago',
    accent: '#EE4C4C',
  },
];

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Herbify</Text>
        <View style={{ flex: 1 }} />
      
      </View>

      <Text style={styles.sectionTitle}>Alerts & Notifications</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {alerts.map((alert, idx) => (
          <View key={idx} style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: alert.bgColor }]}>
              <Text style={[styles.cardIcon, { color: alert.iconColor }]}>{alert.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{alert.title}</Text>
              <Text style={styles.cardSubtitle}>{alert.subtitle}</Text>
            </View>
            <Text style={styles.cardTime}>{alert.time}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151D17',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F5F7F2',
    letterSpacing: 0.5,
  },
  bell: {
    fontSize: 24,
    color: '#e2e5db',
  },
  sectionTitle: {
    color: '#F5F7F2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C261F',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F5F7F2',
    marginBottom: 2,
  },
  cardSubtitle: {
    color: '#A3B2A4',
    fontSize: 13,
    marginBottom: 2,
  },
  cardTime: {
    color: '#A3B2A4',
    fontSize: 13,
    marginLeft: 10,
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
});