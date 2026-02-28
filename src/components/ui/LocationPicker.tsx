import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	Switch,
} from 'react-native';
import { Xmark, Position, PineTree } from 'iconoir-react-native';
import * as ExpoLocation from 'expo-location';
import { Text } from './Text';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';
import { colors, spacing, borderRadius } from '../../theme';
import { Location } from '../../types/Entry';

interface LocationPickerProps {
	location: Location | null;
	onLocationSelect: (location: Location | null) => void;
	onLocationClear: () => void;
}

export const LocationPicker = ({
	location,
	onLocationSelect,
	onLocationClear,
}: LocationPickerProps) => {
	const [isManualInput, setIsManualInput] = useState(false);
	const [manualAddress, setManualAddress] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleGetCurrentLocation = async () => {
		setIsLoading(true);
		try {
			// Request location permissions
			let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert(
					'Permission Denied',
					'Location permission is required to use this feature. Please enable it in your device settings.',
				);
				setIsLoading(false);
				return;
			}

			const isEnabled = await ExpoLocation.hasServicesEnabledAsync();
			if (!isEnabled) {
				Alert.alert(
					'Location Services Disabled',
					'Please enable location services in your device settings.',
				);
				setIsLoading(false);
				return;
			}

			// Get current position with timeout for emulator compatibility
			let currentLocation = await ExpoLocation.getCurrentPositionAsync({
				accuracy: ExpoLocation.Accuracy.Balanced,
				timeInterval: 5000,
				distanceInterval: 0,
			});

			// Optionally get address from coordinates (reverse geocoding)
			let address: string | undefined = undefined;
			try {
				const [result] = await ExpoLocation.reverseGeocodeAsync({
					latitude: currentLocation.coords.latitude,
					longitude: currentLocation.coords.longitude,
				});
				if (result) {
					address = [result.city, result.region, result.country]
						.filter(Boolean)
						.join(', ');
				}
			} catch (geocodeError) {
				console.log('Geocoding failed, using coordinates only:', geocodeError);
			}

			const location: Location = {
				latitude: currentLocation.coords.latitude,
				longitude: currentLocation.coords.longitude,
				address,
			};

			onLocationSelect(location);
		} catch (error: any) {
			console.error('Location error:', error);
			Alert.alert(
				'Location Error',
				`Failed to get current location: ${error.message || 'Unknown error'}. Make sure location is enabled in your emulator's extended controls.`,
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleManualSave = async () => {
		if (!manualAddress.trim()) {
			Alert.alert('Error', 'Please enter a location');
			return;
		}

		setIsLoading(true);
		try {
			// Try to geocode the address to get coordinates
			const results = await ExpoLocation.geocodeAsync(manualAddress.trim());

			const location: Location = {
				latitude: results[0]?.latitude || 0,
				longitude: results[0]?.longitude || 0,
				address: manualAddress.trim(),
			};

			onLocationSelect(location);
			setManualAddress('');
			setIsManualInput(false);
		} catch (error) {
			// If geocoding fails, still save with address only
			const location: Location = {
				latitude: 0,
				longitude: 0,
				address: manualAddress.trim(),
			};
			onLocationSelect(location);
			setManualAddress('');
			setIsManualInput(false);
		}
		setIsLoading(false);
	};

	const handleClear = () => {
		onLocationClear();
		setManualAddress('');
	};

	if (location) {
		return (
			<Card variant="outlined" orientation="horizontal" padding="md">
				<View style={styles.locationInfo}>
					<PineTree
						width={20}
						height={20}
						color={colors.primary.main}
						strokeWidth={2}
					/>
					<View style={styles.locationText}>
						<Text variant="bodySmall" style={styles.locationLabel}>
							Location
						</Text>
						<Text variant="body" numberOfLines={1}>
							{location.address ||
								`${location.latitude}, ${location.longitude}`}
						</Text>
					</View>
				</View>
				<TouchableOpacity onPress={handleClear} style={styles.clearButton}>
					<Xmark
						width={20}
						height={20}
						color={colors.text.secondary}
						strokeWidth={2}
					/>
				</TouchableOpacity>
			</Card>
		);
	}

	return (
		<Card variant="outlined" padding="md" style={styles.locationContainer}>
			<View style={styles.emptyState}>
				<PineTree
					width={32}
					height={32}
					color={isManualInput ? colors.accent.peach : colors.accent.teal}
					strokeWidth={2}
				/>
				<Text
					variant="bodySmall"
					color={colors.text.secondary}
					style={styles.emptyText}>
					Add a location
				</Text>

				<View style={styles.switchContainer}>
					<Text variant="bodySmall" color={colors.text.secondary}>
						Use Locator
					</Text>
					<Switch
						value={isManualInput}
						onValueChange={setIsManualInput}
						ios_backgroundColor={colors.accent.teal}
						trackColor={{
							false: colors.neutral.gray300,
							true: colors.neutral.gray300,
						}}
						thumbColor={
							isManualInput ? colors.accent.peach : colors.accent.teal
						}
					/>
					<Text variant="bodySmall" color={colors.text.secondary}>
						Add Manually {''}
					</Text>
				</View>

				{isManualInput ? (
					<View style={styles.manualInputContainer}>
						<Input
							placeholder="e.g., Planet Earth or 123 Main St"
							value={manualAddress}
							onChangeText={setManualAddress}
						/>
						<View style={styles.actions}>
							<Button
								variant="outline"
								size="sm"
								onPress={() => setIsManualInput(false)}
								style={styles.saveButton}>
								Back to Locator
							</Button>
							<Button
								variant="secondary"
								size="sm"
								onPress={handleManualSave}
								disabled={!manualAddress.trim()}
								style={styles.saveButton}>
								Save Location
							</Button>
						</View>
					</View>
				) : (
					<View style={styles.actions}>
						<Button
							variant="outline"
							size="sm"
							fullWidth
							onPress={handleGetCurrentLocation}
							loading={isLoading}
							disabled={isLoading}
							style={styles.actionButton}>
							<View style={styles.addLocationButtonContainer}>
								<Position
									width={18}
									height={18}
									color={colors.text.primary}
									strokeWidth={2}
								/>
								<Text variant="bodySmall" style={styles.buttonText}>
									Current Location
								</Text>
							</View>
						</Button>
					</View>
				)}
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	locationContainer: {
		backgroundColor: colors.neutral.white,
		borderStyle: 'dashed',
		borderWidth: 2,
		borderColor: colors.neutral.gray300,
		borderRadius: borderRadius.lg,
	},
	addLocationButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: spacing.xs,
	},
	locationInfo: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	locationText: {
		flex: 1,
		gap: spacing.xs,
	},
	locationLabel: {
		fontWeight: '600',
		color: colors.text.secondary,
	},
	clearButton: {
		padding: spacing.xs,
	},
	emptyState: {
		alignItems: 'center',
		gap: spacing.sm,
	},
	emptyText: {
		textAlign: 'center',
	},
	switchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		marginTop: spacing.xs,
	},
	manualInputContainer: {
		width: '100%',
		gap: spacing.sm,
	},
	saveButton: {
		width: '45%',
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: spacing.sm,
		marginTop: spacing.xs,
		width: '100%',
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	buttonText: {
		marginLeft: spacing.xs,
	},
});
