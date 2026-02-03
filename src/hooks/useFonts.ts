import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import {
	PlayfairDisplay_400Regular,
	PlayfairDisplay_700Bold,
	PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import {
	Jost_400Regular,
	Jost_500Medium,
	Jost_600SemiBold,
	Jost_700Bold,
} from '@expo-google-fonts/jost';

export const useFonts = () => {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	useEffect(() => {
		const loadFonts = async () => {
			try {
				await Font.loadAsync({
					PlayfairDisplay_400Regular,
					PlayfairDisplay_700Bold,
					PlayfairDisplay_700Bold_Italic,
					Jost_400Regular,
					Jost_500Medium,
					Jost_600SemiBold,
					Jost_700Bold,
				});
				setFontsLoaded(true);
			} catch (error) {
				console.error('Error loading fonts:', error);
			}
		};

		loadFonts();
	}, []);

	return fontsLoaded;
};
