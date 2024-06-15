import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Platform, BackHandler, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const [status, setStatus] = useState('ok');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    registerForPushNotificationsAsync();

    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/status'); // Recommended to change to your computers ip addres.
        const data = await response.json();
        const newStatus = data.status.toLowerCase();

        if (newStatus !== status) {
          setStatus(newStatus);

          const newLog = {
            status: newStatus,
            description: data.description,
            time: new Date().toLocaleTimeString()
          };

          setLogs((prevLogs) => {
            const updatedLogs = [newLog, ...prevLogs];
            return updatedLogs.slice(0, 10); // Last 10 logs
          });

          // Show notification
          await schedulePushNotification(newStatus, data.description);
        }

      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();

    const intervalId = setInterval(fetchStatus, 5000); // Fetches status in 5s intervals.

    return () => clearInterval(intervalId); // Clear interval
  }, [status]);

  const getStatusStyle = () => {
    switch (status) {
      case 'ok':
        return styles.ok;
      case 'inspect':
        return styles.inspect;
      case 'warning':
        return styles.warning;
      default:
        return styles.ok;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'ok':
        return 'OK';
      case 'inspect':
        return 'Inspect';
      case 'warning':
        return 'Warning!';
      default:
        return 'OK';
    }
  };

  const handleCloseApp = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      Alert.alert('Close App', 'This action is not supported on iOS.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Status</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleCloseApp}>
          <Icon name="close" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={[styles.circle, getStatusStyle()]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
      <View style={styles.logContainer}>
        <ScrollView>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {`${log.time} - ${log.status.toUpperCase()}: ${log.description}`}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

async function schedulePushNotification(status, description) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Status Update: ${status.toUpperCase()}`,
      body: description,
    },
    trigger: null,
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // add your project id
    })).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#007AFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 10,
  },
  circle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  ok: {
    backgroundColor: 'green',
  },
  inspect: {
    backgroundColor: '#FFA500',
  },
  warning: {
    backgroundColor: 'red',
  },
  statusText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 24,
  },
  logContainer: {
    marginTop: 40,
    width: '90%',
    maxHeight: 200,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  logText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default App;
