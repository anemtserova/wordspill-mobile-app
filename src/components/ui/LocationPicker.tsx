import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
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
		setIsManualInput(false);
		setManualAddress('');
	};

	const handleClear = () => {
		onLocationClear();
		setIsManualInput(false);
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

	if (isManualInput) {
		return (
			<Card variant="outlined" padding="md">
				<Text variant="label" style={styles.inputLabel}>
					Enter Location
				</Text>
				<Input
					placeholder="e.g., Paris, France or 123 Main St"
					value={manualAddress}
					onChangeText={setManualAddress}
					autoFocus
				/>
				<View style={styles.manualActions}>
					<Button
						variant="outline"
						size="sm"
						onPress={() => {
							setIsManualInput(false);
							setManualAddress('');
						}}
						style={styles.manualButton}>
						Cancel
					</Button>
					<Button
						variant="primary"
						size="sm"
						onPress={handleManualSave}
						disabled={!manualAddress.trim()}
						style={styles.manualButton}>
						Save
					</Button>
				</View>
			</Card>
		);
	}

	return (
		<Card variant="outlined" padding="md">
			<View style={styles.emptyState}>
				<PineTree
					width={32}
					height={32}
					color={colors.text.secondary}
					strokeWidth={2}
				/>
				<Text
					variant="bodySmall"
					color={colors.text.secondary}
					style={styles.emptyText}>
					Add a location to your entry
				</Text>
				<View style={styles.actions}>
					<Button
						variant="outline"
						size="sm"
						onPress={handleGetCurrentLocation}
						loading={isLoading}
						disabled={isLoading}
						style={styles.actionButton}>
						<Position
							width={18}
							height={18}
							color={colors.text.primary}
							strokeWidth={2}
						/>
						<Text variant="bodySmall" style={styles.buttonText}>
							Current Location
						</Text>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onPress={() => setIsManualInput(true)}
						style={styles.actionButton}>
						<Text variant="bodySmall">Enter Manually</Text>
					</Button>
				</View>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
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
	actions: {
		flexDirection: 'row',
		gap: spacing.sm,
		marginTop: spacing.xs,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	buttonText: {
		marginLeft: spacing.xs,
	},
	inputLabel: {
		marginBottom: spacing.xs,
	},
	manualActions: {
		flexDirection: 'row',
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
	manualButton: {
		flex: 1,
	},
});
