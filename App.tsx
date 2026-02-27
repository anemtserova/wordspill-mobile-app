import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from './src/hooks/useFonts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import { OnboardingProvider } from './src/contexts/OnboardingContext';
import { colors } from './src/theme';

const queryClient = new QueryClient();

export default function App() {
	const fontsLoaded = useFonts();

	if (!fontsLoaded) {
		return null; // Or return a loading screen
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<OnboardingProvider>
						<SafeAreaProvider>
							<SafeAreaView
								style={{
									flex: 1,
									backgroundColor: colors.background.secondary,
								}}>
								<NavigationContainer>
									<StatusBar style="auto" />
									<RootNavigator />
								</NavigationContainer>
							</SafeAreaView>
						</SafeAreaProvider>
					</OnboardingProvider>
				</AuthProvider>
			</QueryClientProvider>
		</GestureHandlerRootView>
	);
}
