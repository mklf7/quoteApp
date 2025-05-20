import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Chargement from './../components/Chargement';


type Quote = {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
};

const colors = ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#BBDEFB', '#C8E6C9', '#FFF9C4', '#FFE0B2', '#D1C4E9', '#B2EBF2', '#DCEDC8', '#FFECB3', '#F0F4C3', '#FFCCBC', '#CFD8DC', '#E6EE9C', '#B3E5FC', ];

export default function App() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [bgColor, setBgColor] = useState(colors[0]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animateFadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const getRandomColor = () => {
    let newColor = bgColor;
    while (newColor === bgColor) {
      newColor = colors[Math.floor(Math.random() * colors.length)];
    }
    return newColor;
  };

  const recharger = () => {
    setLoading(true);
    axios.get<Quote>('http://api.quotable.io/random')
      .then(response => {
        setQuote(response.data);
        setBgColor(getRandomColor());
        animateFadeIn();
      })
      .catch(error => {
        console.error('Erreur lors du fetch:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    recharger();
  }, []);

  if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Chargement />
    </View>
  );
}


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.titre}>My Day's Quote</Text>
        <Text style={styles.quote}>"{quote?.content}"</Text>
        <Text style={styles.author}>- {quote?.author} -</Text>

        <TouchableOpacity style={styles.bouton} onPress={recharger}>
          <Text style={styles.boutonTexte}>Nouvelle citation</Text>
        </TouchableOpacity>
      </Animated.View>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titre: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 40
  },
  quote: {
    fontSize: 20,
    fontStyle: 'italic',
    marginBottom: 10,
    textAlign: 'center',
  },
  author: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bouton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 30,
    marginTop: 40,
    alignSelf: 'center',
  },
  boutonTexte: {
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
});
