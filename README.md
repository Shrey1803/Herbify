# Herbify

A blockchain-based supply chain management system for herbs and agricultural products, leveraging Hyperledger Fabric and machine learning to ensure product authenticity, track origin, and maintain transparency across the entire supply chain.

## Overview

Herbify is a comprehensive platform designed to address the challenges of herb and agricultural product supply chain management. Using distributed ledger technology and AI/ML analytics, the system ensures product traceability, authenticity verification, and trust among farmers, processors, transporters, retailers, labs, and consumers.

## Key Features

- **Blockchain-Based Traceability**: Immutable record of products from farm to consumer using Hyperledger Fabric
- **Multi-Role Dashboard**: Tailored interfaces for farmers, processors, transporters, retailers, and labs
- **QR Code & NFC Scanning**: Easy product identification and verification via QR codes and NFC tags
- **Machine Learning Analytics**: Supply chain intelligence for pattern detection and predictive analysis
- **Real-time Location Tracking**: GPS tracking for products in transit
- **Cross-Platform Mobile App**: React Native application for Android and iOS
- **Push Notifications**: Real-time alerts for supply chain events via Expo Notifications
- **Barcode Scanner Integration**: Multiple scanning options including barcode, QR code, and NFC

## Tech Stack

### Backend
- **Blockchain**: Hyperledger Fabric 2.x
- **Chaincode**: Node.js smart contracts

### Mobile App
- **Framework**: React Native (Expo)
- **Language**: JavaScript/TypeScript
- **Navigation**: React Navigation
- **Notifications**: expo-notifications (Firebase Cloud Messaging)
- **Scanning**: Barcode, QR code, NFC support
- **Maps**: React Native Maps with Geolocation

### Machine Learning
- **Jupyter Notebooks**: Supply chain ML demonstrations
- **Dataset**: Trust chain dataset for analysis

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Network**: Hyperledger Fabric Network (configurable via YAML)

## Project Structure

```
Herbify/
├── README.md                  # Project documentation
├── chaincode/                 # Hyperledger Fabric smart contracts
│   ├── index.js
│   ├── package.json
│   └── lib/
│       └── herbify-contract.js
├── mobile-app/               # React Native Expo application
│   ├── src/
│   │   ├── screens/          # Screen components (dashboards, login, scanning)
│   │   ├── services/         # Navigation and API services
│   │   └── assets/           # Images and resources
│   ├── android/              # Android native code
│   ├── App.js               # App entry point
│   ├── app.json             # Expo configuration
│   └── package.json         # Dependencies
├── network/                  # Hyperledger Fabric network configuration
│   ├── configtx.yaml        # Channel configuration
│   ├── crypto-config.yaml   # Certificate configuration
│   └── docker-compose-fabric.yml
├── scripts/                  # Deployment and setup scripts
│   ├── start-dev-network.sh
│   ├── deploy-chaincode.sh
│   └── test-chaincode.sh
└── Ml/                       # Machine Learning components
    ├── supply_chain_ml_demo.ipynb
    └── trust_chain_dataset.csv
```

## Installation

### Prerequisites
- Node.js 14+ and npm
- Docker and Docker Compose
- Hyperledger Fabric prerequisites (Go 1.19+, Python 3.7+)
- Expo CLI: `npm install -g expo-cli`
- For Android development: Android SDK or Android Studio

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Herbify
   ```

2. **Install chaincode dependencies**
   ```bash
   cd chaincode
   npm install
   cd ..
   ```

3. **Install mobile app dependencies**
   ```bash
   cd mobile-app
   npm install
   cd ..
   ```

4. **Start the Hyperledger Fabric network**
   ```bash
   ./scripts/start-dev-network.sh
   ```

5. **Deploy the chaincode**
   ```bash
   ./scripts/deploy-chaincode.sh
   ```

## Running the Application

### Start Mobile App (Development)
```bash
cd mobile-app
npm start
```

Then choose your platform:
- **Android**: Press `a` or `npx expo run:android`
- **iOS**: Press `i` or `npx expo run:ios`
- **Web**: Press `w` or `npx expo start --web`

### Test Chaincode
```bash
./scripts/test-chaincode.sh
```

### Machine Learning
Open the Jupyter notebook for supply chain analytics:
```bash
cd Ml
jupyter notebook supply_chain_ml_demo.ipynb
```

## Key Components

### Mobile App Screens
- **LoginScreen**: User authentication and role selection
- **SplashScreen**: App initialization
- **ScanScreen**: QR code, barcode, and NFC scanning
- **FarmerDashboard**: Farm product management and creation
- **ProcessorDashboard**: Product processing and transformation tracking
- **TransporterDashboard**: Shipment and logistics management
- **RetailerDashboard**: Inventory and sales management
- **LabDashboard**: Product testing and verification
- **ConsumerDashboard**: Product verification and authenticity checking
- **AlertScreen**: Notifications and alerts

### Smart Contract
The `herbify-contract.js` chaincode implements:
- Product creation and registration
- Supply chain transaction recording
- Status updates for products through various stages
- Product history and provenance tracking
- Authentication and authorization

### Notifications
- Push notifications via Firebase Cloud Messaging (Android) and APNs (iOS)
- Powered by expo-notifications for cross-platform compatibility
- Real-time alerts for supply chain events

## Network Configuration

The Hyperledger Fabric network is configured with:
- Multiple organizations (Farmers, Processors, Retailers, Labs)
- Channel configuration for secure communication
- Certificate and key management
- Docker-based deployment for easy setup and teardown

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

## Acknowledgments

- Hyperledger Fabric community
- Expo and React Native teams
- Contributors and testers
