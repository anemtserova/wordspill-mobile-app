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
import { Text } from './Text';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';
import { colors, spacing, borderRadius } from '../../theme';

interface Location {
	latitude: number;
	longitude: number;
	address?: string;
}

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
			// Note: You'll need to install expo-location and request permissions
			// For now, this is a mock implementation

			Alert.alert(
				'Location Feature',
				'To use current location, please install expo-location:\n\nnpx expo install expo-location',
			);

			// Mock location data for demonstration
			// const mockLocation: Location = {
			// 	latitude: 42.6977,
			// 	longitude: 23.3219,
			// 	address: 'Sofia, Bulgaria',
			// };
			// onLocationSelect(mockLocation);
		} catch (error) {
			Alert.alert('Error', 'Failed to get current location');
		} finally {
			setIsLoading(false);
		}
	};

	const handleManualSave = () => {
		if (!manualAddress.trim()) {
			Alert.alert('Error', 'Please enter a location');
			return;
		}

		// Mock geocoding - in production, use a geocoding service
		const mockLocation: Location = {
			latitude: 0,
			longitude: 0,
			address: manualAddress.trim(),
		};

		onLocationSelect(mockLocation);
		setManualAddress('');
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
					color={colors.accent.teal}
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
