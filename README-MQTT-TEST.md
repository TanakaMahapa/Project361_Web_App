# MQTT Test Script - Smart Door & Bed System

## Overview
This MQTT test script simulates and tests the communication between IoT devices in a smart door and bed alert system. It connects to an MQTT broker and handles multiple sensor inputs to control LED lights and vibration motors.

## What It Does

### 🏠 **Smart Home System Components**
- **Motion Detection** - PIR sensor detects movement at the door
- **Gas Monitoring** - Gas sensor detects dangerous gas levels
- **Pressure Monitoring** - Pressure sensor detects door pressure changes
- **LED Control** - Controls door and bed LED strips
- **Vibration Alerts** - Controls bed vibration motor for emergencies

### 📡 **MQTT Topics Used**

#### **Input Topics (Sensors → Script)**
- `home/door/motion` - Motion sensor readings
- `home/door/gas` - Gas sensor readings  
- `home/door/pressure` - Pressure sensor readings
- `home/bed/ack` - Bed Arduino status messages

#### **Output Topics (Script → Actuators)**
- `home/door/led` - Door LED strip control
- `home/bed/led` - Bed LED strip control
- `home/bed/vibration` - Bed vibration motor control

### 🚦 **Alert Logic**

#### **Motion Sensor Responses:**
- `"detected"` → 🚨 **RED LEDs** + **Vibration START**
- `"visitor"` → 🟡 **YELLOW LEDs** + **Vibration STOP**
- `"clear"` → ✅ **LEDs OFF** + **Vibration STOP**

#### **Gas Sensor Responses:**
- `"WARNING"` / `"HIGH"` → 🟡 **YELLOW LEDs** + **Vibration STOP**
- `"DANGER"` / `"CRITICAL"` → 🚨 **RED LEDs** + **Vibration START**
- `"NORMAL"` / `"LOW"` → ✅ **LEDs OFF** + **Vibration STOP**

#### **Pressure Sensor Responses:**
- `"HIGH"` / `"OVERLOAD"` → 🟡 **YELLOW LEDs** + **Vibration STOP**
- `"CRITICAL"` / `"DANGER"` → 🚨 **RED LEDs** + **Vibration START**
- `"NORMAL"` / `"LOW"` → ✅ **LEDs OFF** + **Vibration STOP**

## Prerequisites

### **Required Software:**
- Node.js (v14 or higher)
- npm package manager

### **Required Dependencies:**
```bash
npm install mqtt
```

### **Network Requirements:**
- Internet connection (for test.mosquitto.org broker)
- Or access to your own MQTT broker

## How to Run

### **Step-by-Step Instructions**

#### **Step 1: Open Terminal/Command Prompt**
- **Windows:** Press `Win + R`, type `cmd`, press Enter
- **Mac:** Press `Cmd + Space`, type `Terminal`, press Enter
- **Linux:** Press `Ctrl + Alt + T`

#### **Step 2: Navigate to Project Directory**
```bash
# Navigate to your project folder
cd "C:\Users\ASUS\OneDrive\Documents\GitHub\Project361_Web_App\PRJ361-WEB_APP-main"

# Or if you're already in the parent directory:
cd PRJ361-WEB_APP-main
```

#### **Step 3: Check if Node.js is Installed**
```bash
node --version
npm --version
```
**Expected Output:**
```
v18.17.0  (or similar version)
9.6.7     (or similar version)
```

**If not installed:** Download from [nodejs.org](https://nodejs.org/)

#### **Step 4: Install Required Dependencies**
```bash
# Install the MQTT library
npm install mqtt
```

**Expected Output:**
```
added 1 package, and audited 2 packages in 2s
found 0 vulnerabilities
```

#### **Step 5: Run the MQTT Test Script**
```bash
# Run the script
node mqtt-test.js 
#############################
```

#### **Step 6: Observe the Output**
You should see output like:
```
🚀 Starting MQTT Test...
📡 Connecting to broker: mqtt://test.mosquitto.org:1883
✅ Connected to broker via MQTT
📡 Subscribed to: home/door/motion, home/bed/ack, home/door/gas and home/door/pressure
⏳ MQTT test running... Press Ctrl+C to stop
```

#### **Step 7: Stop the Script**
- Press `Ctrl + C` to stop the script
- Or close the terminal window

### **Alternative Running Methods**

#### **Method 1: Direct Node Command**
```bash
node mqtt-test.js
```

#### **Method 2: Using npm (if package.json has scripts)**
```bash
npm run mqtt-test
```

#### **Method 3: Background Service with PM2**
```bash
# Install PM2 first
npm install -g pm2

# Run as background service
pm2 start mqtt-test.js --name "mqtt-controller"

# Check status
pm2 status

# View logs
pm2 logs mqtt-controller
```

### **Troubleshooting Running Issues**

#### **Error: "node is not recognized"**
```bash
# Solution: Install Node.js
# Download from https://nodejs.org/
# Restart terminal after installation
```

#### **Error: "Cannot find module 'mqtt'"**
```bash
# Solution: Install dependencies
npm install mqtt
```

#### **Error: "ENOTFOUND test.mosquitto.org"**
```bash
# Solution: Check internet connection
# Or use a different MQTT broker
```

#### **Script Runs but No Output**
```bash
# Solution: Check if you're in the correct directory
pwd  # (Mac/Linux) or dir (Windows)
# Make sure you see mqtt-test.js in the file list
```

### **3. Expected Output**
```
🚀 Starting MQTT Test...
📡 Connecting to broker: mqtt://test.mosquitto.org:1883
✅ Connected to broker via MQTT
📡 Subscribed to: home/door/motion, home/bed/ack, home/door/gas and home/door/pressure

🧪 Testing motion detection...
📤 Publishing 'detected' motion...
📩 Message received: home/door/motion detected
------ SYSTEM STATUS ------
Status: 🚨 EMERGENCY - Motion Detected
Door LED: RED
Bed LED: RED
Vibration: START
---------------------------
```

### **4. Test Scenarios**
The script automatically runs these test scenarios:
- **Motion Tests:** detected → visitor → clear
- **Gas Tests:** NORMAL → WARNING → DANGER
- **Pressure Tests:** NORMAL → HIGH → CRITICAL

## Configuration

### **Broker Settings**
```javascript
// Current: Public test broker
const brokerUrl = "mqtt://test.mosquitto.org:1883";

// For production: Your own broker
// const brokerUrl = "mqtt://192.168.1.100:1883";
// const brokerUrl = "mqtts://your-broker.com:8883"; // Secure
```

### **Authentication (if needed)**
```javascript
// Uncomment and configure if your broker requires authentication
// const options = {
//   username: "your_username",
//   password: "your_password",
//   clientId: "smart_door_controller"
// };
```

## Integration with Real IoT Devices

### **For Arduino/ESP32 Devices:**

#### **Motion Sensor Code:**
```cpp
client.publish("home/door/motion", "detected");
client.publish("home/door/motion", "visitor");
client.publish("home/door/motion", "clear");
```

#### **Gas Sensor Code:**
```cpp
client.publish("home/door/gas", "NORMAL");
client.publish("home/door/gas", "WARNING");
client.publish("home/door/gas", "DANGER");
```

#### **Pressure Sensor Code:**
```cpp
client.publish("home/door/pressure", "NORMAL");
client.publish("home/door/pressure", "HIGH");
client.publish("home/door/pressure", "CRITICAL");
```

#### **LED Controller Code:**
```cpp
client.subscribe("home/door/led");
client.subscribe("home/bed/led");
// Handle messages: "RED", "YELLOW", "OFF"
```

#### **Vibration Motor Code:**
```cpp
client.subscribe("home/bed/vibration");
// Handle messages: "START", "STOP"
```

## Node-RED Integration

### **Import Flow:**
1. Copy the provided Node-RED flow JSON
2. In Node-RED: Menu → Import → Paste JSON
3. Deploy the flow

### **Test Integration:**
1. Run the MQTT test script
2. Watch Node-RED dashboard for real-time updates
3. Both systems should show synchronized status

## Troubleshooting

### **Common Issues:**

#### **Connection Failed:**
```
❌ MQTT Error: Error: connect ECONNREFUSED
```
**Solution:** Check broker URL and port, ensure broker is running

#### **No Messages Received:**
```
📡 Subscribed to topics but no messages...
```
**Solution:** Check topic names match exactly, verify broker permissions

#### **Authentication Failed:**
```
❌ MQTT Error: Not authorized
```
**Solution:** Add username/password in options object

### **Debug Mode:**
Add more logging by uncommenting debug lines in the script.

## Production Deployment

### **For Real IoT Integration:**

1. **Remove Test Function:**
   ```javascript
   // Comment out or remove this line:
   // setTimeout(testMotionDetection, 1000);
   ```

2. **Update Broker URL:**
   ```javascript
   const brokerUrl = "mqtt://your-production-broker:1883";
   ```

3. **Add Authentication:**
   ```javascript
   const options = {
     username: "production_user",
     password: "secure_password",
     clientId: "smart_door_controller"
   };
   ```

4. **Run as Service with PM2:**
   ```bash
   # Install PM2 globally
   npm install -g pm2
   
   # Start your MQTT script as a background service
   pm2 start mqtt-test.js --name "smart-door-controller"
   
   # Check if it's running
   pm2 status
   
   # View real-time logs
   pm2 logs smart-door-controller
   
   # Monitor performance
   pm2 monit
   
   # Auto-start on system boot
   pm2 startup
   pm2 save
   ```

### **PM2 Process Manager**

**PM2** is a production-ready process manager that keeps your MQTT script running 24/7:

#### **Why Use PM2?**
- ✅ **Always Running** - Script stays connected even if terminal closes
- ✅ **Auto-Restart** - Automatically restarts if script crashes
- ✅ **Monitoring** - Real-time CPU/memory usage and logs
- ✅ **Production Ready** - Used by companies worldwide
- ✅ **Background Service** - Runs independently of your terminal

#### **PM2 Commands:**
```bash
# Start script
pm2 start mqtt-test.js --name "mqtt-controller"

# Check status
pm2 status

# View logs
pm2 logs mqtt-controller

# Restart script
pm2 restart mqtt-controller

# Stop script
pm2 stop mqtt-controller

# Delete script
pm2 delete mqtt-controller

# Monitor dashboard
pm2 monit

# Setup auto-start on boot
pm2 startup
pm2 save
```

#### **When to Use PM2:**
- **Production IoT systems** - Critical systems that must stay running
- **24/7 monitoring** - Scripts that need constant operation
- **Server deployment** - When deploying to production servers
- **Raspberry Pi** - Running on embedded devices
- **Always-on computers** - Home automation systems

#### **PM2 Benefits for IoT:**
- Your MQTT script stays connected to the broker 24/7
- Automatic recovery from network interruptions
- Remote monitoring and management
- Log management and rotation
- Zero-downtime deployments

## System Architecture

```
IoT Sensors → MQTT Broker → This Script → MQTT Broker → IoT Actuators
     ↓              ↓              ↓              ↓
Motion/Gas/     Message      Process &      LED/Vibration
Pressure        Delivery     Control        Control
Detection
```

## Files in This System

- `mqtt-test.js` - Main MQTT test script
- `README-MQTT-TEST.md` - This documentation
- `Node-RED-Flow.json` - Node-RED dashboard flow

## Support

For issues or questions:
1. Check this README first
2. Verify broker connectivity
3. Test with MQTT Explorer tool
4. Check Node-RED flow deployment

---

**Happy IoT Testing! 🚀**
