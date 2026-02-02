import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
					<NavigationContainer>
						<StatusBar style="auto" />
						<RootNavigator />
					</NavigationContainer>
				</SafeAreaView>
			</SafeAreaProvider>
		</QueryClientProvider>
	);
}
