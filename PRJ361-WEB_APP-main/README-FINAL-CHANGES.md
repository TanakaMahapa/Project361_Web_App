# Smart Door & Bed Alert System - Final Project README

## 🏠 Project Overview

This is a **complete IoT smart home system** that monitors your door area with multiple sensors and provides intelligent alerts through LED lights and vibration motors. The system uses MQTT (Message Queuing Telemetry Transport) to enable seamless communication between all devices.

## 🌟 What Makes This System "Smart"?

### **The Magic of MQTT**
MQTT is like a **super-fast messenger service** for your smart home devices. Think of it as the invisible nervous system that connects all your IoT devices:

- **Motion Sensor** detects movement → **MQTT** → **LEDs turn RED** + **Vibration starts**
- **Gas Sensor** detects danger → **MQTT** → **LEDs turn YELLOW** + **Alerts activate**
- **Pressure Sensor** detects overload → **MQTT** → **Emergency mode** activated

**Without MQTT:** Your devices are like deaf people in different rooms 😞  
**With MQTT:** Your devices instantly communicate like best friends! 😊

## 🎯 System Components

### **📡 Input Sensors (Detect & Report)**
1. **Motion Sensor (PIR)** - Detects movement at door
2. **Gas Sensor** - Monitors dangerous gas levels
3. **Pressure Sensor** - Detects door pressure changes
4. **Bed Arduino** - Reports bed device status

### **💡 Output Actuators (Respond & Control)**
1. **Door LED Strip** - Visual alerts (RED/YELLOW/OFF)
2. **Bed LED Strip** - Visual alerts (RED/YELLOW/OFF)
3. **Vibration Motor** - Haptic alerts (START/STOP)

### **🧠 Control System**
- **MQTT Test Script** - Processes sensor data and controls actuators
- **Node-RED Dashboard** - Visual monitoring and control interface
- **React Web App** - User interface for settings and monitoring

## 🚦 Intelligent Alert System

### **Motion Detection Logic:**
```
🚨 "detected" → RED LEDs + Vibration START (Emergency)
🟡 "visitor" → YELLOW LEDs + Vibration STOP (Warning)
✅ "clear" → LEDs OFF + Vibration STOP (Safe)
```

### **Gas Monitoring Logic:**
```
🚨 "DANGER" → RED LEDs + Vibration START (Evacuate!)
⚠️ "WARNING" → YELLOW LEDs + Vibration STOP (Caution)
✅ "NORMAL" → LEDs OFF + Vibration STOP (Safe)
```

### **Pressure Monitoring Logic:**
```
🚨 "CRITICAL" → RED LEDs + Vibration START (Emergency)
⚠️ "HIGH" → YELLOW LEDs + Vibration STOP (Warning)
✅ "NORMAL" → LEDs OFF + Vibration STOP (Safe)
```

## 📁 Project Structure

```
PRJ361-WEB_APP-main/
├── mqtt-test.js                    # Main MQTT control script
├── README-MQTT-TEST.md            # Detailed MQTT documentation
├── README-PROJECT-FINAL.md        # This final project overview
├── src/                           # React web application
│   ├── components/                # UI components
│   ├── pages/                     # Web app pages
│   └── MQBroker/                  # MQTT integration
└── node-red-flow.json            # Node-RED dashboard flow
```

## 🚀 Quick Start Guide

### **1. Prerequisites**
- Node.js (v14 or higher)
- Internet connection
- MQTT broker access

### **2. Install Dependencies**
```bash
cd PRJ361-WEB_APP-main
npm install mqtt
npm install  # For React app
```

### **3. Run the System**

#### **Option A: Development Testing**
```bash
# Run MQTT control script
node mqtt-test.js

# Run React web app (separate terminal)
npm run dev
```

#### **Option B: Production Deployment**
```bash
# Install PM2 for 24/7 operation
npm install -g pm2

# Start as background service
pm2 start mqtt-test.js --name "smart-door-controller"
pm2 start npm --name "web-app" -- run dev

# Check status
pm2 status
```

### **4. Access the System**
- **React Web App:** http://localhost:5173
- **Node-RED Dashboard:** Import provided flow JSON
- **MQTT Script:** Running in background (PM2) or terminal

## 🔧 MQTT Integration

### **Topics Used:**
```
Input Topics (Sensors → System):
├── home/door/motion      # Motion sensor readings
├── home/door/gas         # Gas sensor readings
├── home/door/pressure    # Pressure sensor readings
└── home/bed/ack          # Bed Arduino status

Output Topics (System → Actuators):
├── home/door/led         # Door LED control
├── home/bed/led          # Bed LED control
└── home/bed/vibration    # Vibration motor control
```

### **Message Formats:**
```javascript
// Motion Sensor
"detected", "visitor", "clear"

// Gas Sensor  
"NORMAL", "WARNING", "DANGER", "HIGH", "LOW", "CRITICAL"

// Pressure Sensor
"NORMAL", "HIGH", "LOW", "OVERLOAD", "CRITICAL", "DANGER"

// LED Control
"RED", "YELLOW", "OFF"

// Vibration Control
"START", "STOP"
```

## 🤖 IoT Device Integration

### **Arduino/ESP32 Code Examples:**

#### **Motion Sensor:**
```cpp
// Publish motion detection
client.publish("home/door/motion", "detected");
client.publish("home/door/motion", "visitor");
client.publish("home/door/motion", "clear");
```

#### **Gas Sensor:**
```cpp
// Publish gas readings
client.publish("home/door/gas", "NORMAL");
client.publish("home/door/gas", "WARNING");
client.publish("home/door/gas", "DANGER");
```

#### **Pressure Sensor:**
```cpp
// Publish pressure readings
client.publish("home/door/pressure", "NORMAL");
client.publish("home/door/pressure", "HIGH");
client.publish("home/door/pressure", "CRITICAL");
```

#### **LED Controller:**
```cpp
// Subscribe to LED control
client.subscribe("home/door/led");
client.subscribe("home/bed/led");

// Handle LED commands
void onMessage(char* topic, byte* payload, unsigned int length) {
    String message = String(payload);
    if (message == "RED") {
        // Turn LED RED
    } else if (message == "YELLOW") {
        // Turn LED YELLOW
    } else if (message == "OFF") {
        // Turn LED OFF
    }
}
```

#### **Vibration Motor:**
```cpp
// Subscribe to vibration control
client.subscribe("home/bed/vibration");

// Handle vibration commands
void onMessage(char* topic, byte* payload, unsigned int length) {
    String message = String(payload);
    if (message == "START") {
        // Start vibration
    } else if (message == "STOP") {
        // Stop vibration
    }
}
```

## 🌐 Node-RED Dashboard

### **Import Instructions:**
1. Open Node-RED in your browser
2. Go to Menu → Import
3. Copy and paste the provided Node-RED flow JSON
4. Click Deploy
5. Access dashboard at Node-RED UI

### **Dashboard Features:**
- **Real-time status monitoring**
- **Manual test buttons**
- **System status display**
- **LED status indicators**
- **Alert notifications**

## 🎨 React Web Application

### **Features:**
- **Dashboard** - Motion alerts and system status
- **Settings** - Configure vibration and LED preferences
- **Login/Signup** - User authentication
- **Responsive Design** - Works on mobile and desktop

### **Pages:**
- `/` - Main dashboard
- `/settings` - System configuration
- `/login` - User authentication
- `/signup` - User registration

## 🔄 System Architecture

```
┌─────────────────┐    MQTT     ┌─────────────────┐    MQTT     ┌─────────────────┐
│   IoT Sensors   │ ──────────► │  MQTT Broker    │ ──────────► │   Actuators     │
│                 │             │                 │             │                 │
│ • Motion        │             │ • Message       │             │ • Door LED      │
│ • Gas           │             │   Routing       │             │ • Bed LED       │
│ • Pressure      │             │ • Status        │             │ • Vibration     │
│ • Bed ACK       │             │   Management    │             │ • Notifications │
└─────────────────┘             └─────────────────┘             └─────────────────┘
         ▲                               ▲                               ▲
         │                               │                               │
         │                               │                               │
         ▼                               ▼                               ▼
┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
│  MQTT Script    │             │  Node-RED       │             │  React Web      │
│  (Processing)   │             │  Dashboard      │             │  Application    │
│                 │             │                 │             │                 │
│ • Data Analysis │             │ • Visualization │             │ • User Interface│
│ • Control Logic │             │ • Monitoring    │             │ • Settings      │
│ • Alert System  │             │ • Manual Tests  │             │ • Authentication│
└─────────────────┘             └─────────────────┘             └─────────────────┘
```

## 🛡️ Production Deployment

### **For Real-World Use:**

#### **1. Update Broker Configuration:**
```javascript
// Change from test broker to your production broker
const brokerUrl = "mqtt://your-broker-ip:1883";

// Add authentication if needed
const options = {
  username: "your_username",
  password: "your_password",
  clientId: "smart_door_controller"
};
```

#### **2. Remove Test Functions:**
```javascript
// Comment out test function for production
// setTimeout(testMotionDetection, 1000);
```

#### **3. Deploy with PM2:**
```bash
# Install PM2
npm install -g pm2

# Start services
pm2 start mqtt-test.js --name "smart-door-controller"
pm2 start npm --name "web-app" -- run dev

# Setup auto-start
pm2 startup
pm2 save
```

#### **4. Monitor System:**
```bash
# Check status
pm2 status

# View logs
pm2 logs smart-door-controller

# Monitor performance
pm2 monit
```

## 🔧 Troubleshooting

### **Common Issues:**

#### **MQTT Connection Failed:**
```bash
# Check broker URL and internet connection
ping test.mosquitto.org
```

#### **No Messages Received:**
```bash
# Verify topic names match exactly
# Check broker permissions
```

#### **Script Crashes:**
```bash
# Check PM2 logs
pm2 logs smart-door-controller

# Restart service
pm2 restart smart-door-controller
```

#### **Web App Won't Start:**
```bash
# Check dependencies
npm install

# Check port availability
netstat -an | grep 5173
```

## 📊 System Benefits

### **🏠 Smart Home Advantages:**
- **Instant Alerts** - Know immediately when something happens
- **Multi-Sensor Monitoring** - Motion, gas, and pressure detection
- **Intelligent Responses** - Different alerts for different situations
- **24/7 Operation** - Never stops monitoring
- **Remote Access** - Control from anywhere via web app

### **🔧 Technical Benefits:**
- **MQTT Efficiency** - Low bandwidth, high reliability
- **Modular Design** - Easy to add/remove sensors
- **Scalable** - Can handle multiple devices
- **Real-time** - Instant communication between devices
- **Cross-Platform** - Works with any IoT device

### **👥 User Benefits:**
- **Peace of Mind** - Always know what's happening at your door
- **Safety** - Gas and pressure monitoring for security
- **Convenience** - Automated responses to situations
- **Customization** - Adjustable settings for preferences
- **Accessibility** - Works on mobile and desktop

## 🎯 Future Enhancements

### **Possible Additions:**
- **Camera Integration** - Visual monitoring
- **Voice Alerts** - Audio notifications
- **Mobile App** - Dedicated smartphone app
- **Database Logging** - Store event history
- **Machine Learning** - Smart pattern recognition
- **Weather Integration** - Environmental monitoring
- **Energy Monitoring** - Power usage tracking

## 📞 Support & Documentation

### **Documentation Files:**
- `README-PROJECT-FINAL.md` - This complete project overview
- `README-MQTT-TEST.md` - Detailed MQTT script documentation
- `mqtt-test.js` - Fully commented control script
- Node-RED flow JSON - Dashboard configuration

### **Getting Help:**
1. Check documentation files first
2. Verify all dependencies are installed
3. Test with MQTT Explorer tool
4. Check Node-RED flow deployment
5. Review PM2 logs for errors

## 🏆 Project Completion

This project successfully demonstrates:

✅ **Complete IoT System** - Multiple sensors and actuators  
✅ **MQTT Communication** - Reliable message passing  
✅ **Smart Control Logic** - Intelligent response system  
✅ **Web Interface** - User-friendly dashboard  
✅ **Production Ready** - PM2 deployment capability  
✅ **Comprehensive Documentation** - Complete setup guides  
✅ **Real-World Applicable** - Ready for actual deployment  

**Your Smart Door & Bed Alert System is complete and ready to make your home truly intelligent!** 🏠✨

---

**Happy Smart Home Living! 🚀🏠**
