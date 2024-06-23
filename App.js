import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const App = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão de localização não concedida",
          "Por favor, conceda permissão de localização para obter a localização."
        );
        setLoading(false);
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
      fetchWeather(locationData.coords.latitude, locationData.coords.longitude);
    })();
  }, []);

  const fetchWeather = async (latitude, longitude) => {
    try {
      const apiKey = "dc564a7fd6661c9dbedbbabb9f575458"; // Substitua pelo seu próprio API Key
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        "Houve um problema ao obter a previsão do tempo. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Geolocalização</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : location ? (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>Sua Localização</Text>
          <Text style={styles.coordsText}>Latitude: {location.coords.latitude}</Text>
          <Text style={styles.coordsText}>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Você está aqui"
            />
          </MapView>
          {weather && (
            <View style={styles.weatherContainer}>
              <Text style={styles.weatherText}>Previsão do Tempo</Text>
              <Text style={styles.weatherInfo}>Temperatura: {weather.main.temp}°C</Text>
              <Text style={styles.weatherInfo}>Clima: {weather.weather[0].description}</Text>
              <Text style={styles.weatherInfo}>Humidade: {weather.main.humidity}%</Text>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.loadingText}>Obtendo localização...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  locationContainer: {
    width: "100%",
    alignItems: "center",
  },
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  coordsText: {
    fontSize: 16,
  },
  map: {
    width: "100%",
    height: 300,
    marginTop: 24,
  },
  loadingText: {
    fontSize: 18,
    fontStyle: "italic",
  },
  weatherContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  weatherText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  weatherInfo: {
    fontSize: 16,
  },
});

export default App;
