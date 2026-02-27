import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	Modal,
	TextInput,
	TouchableOpacity,
	Alert,
	ScrollView,
} from 'react-native';
import { Xmark, Check } from 'iconoir-react-native';
import { Text } from './Text';
import { Button } from './Button';
import { colors, spacing } from '../../theme';
import { useCreateCollection } from '../../api/collections';
import { getCollectionIcon } from '../../utils/collectionIcons';
import {
	COLLECTION_COLORS,
	COLLECTION_ICON_OPTIONS,
} from '../../utils/constants';

interface AddCollectionModalProps {
	visible: boolean;
	onClose: () => void;
	userId: string;
}

export const AddCollectionModal = ({
	visible,
	onClose,
	userId,
}: AddCollectionModalProps) => {
	const [collectionNameInput, setCollectionNameInput] = useState('');
	const [selectedColor, setSelectedColor] = useState(colors.primary.main);
	const [selectedIcon, setSelectedIcon] = useState('book');
	const createCollectionMutation = useCreateCollection(userId);

	const handleAddCollection = () => {
		const trimmedName = collectionNameInput.trim();

		if (!trimmedName) {
			Alert.alert('Error', 'Please enter a collection name');
			return;
		}

		createCollectionMutation.mutate(
			{
				name: trimmedName,
				color: selectedColor,
				iconUrl: null,
				iconName: selectedIcon,
			},
			{
				onSuccess: () => {
					setCollectionNameInput('');
					setSelectedColor(colors.primary.main);
					setSelectedIcon('book');
					onClose();
				},
				onError: (error) => {
					Alert.alert('Error', 'Failed to create collection');
					console.error('Error creating collection:', error);
				},
			},
		);
	};

	const handleClose = () => {
		setCollectionNameInput('');
		setSelectedColor(colors.primary.main);
		setSelectedIcon('book');
		onClose();
	};

	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="fade"
			onRequestClose={handleClose}>
			<View style={styles.modalOverlay}>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text variant="h4">Add New Collection</Text>
							<TouchableOpacity
								onPress={handleClose}
								style={styles.closeButton}>
								<Xmark
									width={24}
									height={24}
									color={colors.text.secondary}
									strokeWidth={2}
								/>
							</TouchableOpacity>
						</View>

						<View>
							<TextInput
								style={styles.modalInput}
								placeholder="Collection name"
								value={collectionNameInput}
								onChangeText={setCollectionNameInput}
								placeholderTextColor={colors.text.secondary}
								autoFocus
								onSubmitEditing={handleAddCollection}
								maxLength={50}
							/>
							<Text variant="caption" style={styles.charCounter}>
								{collectionNameInput.length}/50
							</Text>
						</View>

						<Text variant="h6" style={styles.sectionLabel}>
							Choose Color
						</Text>
						<View style={styles.colorGrid}>
							{COLLECTION_COLORS.map((item) => (
								<TouchableOpacity
									key={item.color}
									style={[
										styles.colorOption,
										{ backgroundColor: item.color },
										selectedColor === item.color && styles.selectedColorOption,
									]}
									onPress={() => setSelectedColor(item.color)}
									activeOpacity={0.7}>
									{selectedColor === item.color && (
										<Check
											width={20}
											height={20}
											color={colors.neutral.white}
											strokeWidth={3}
										/>
									)}
								</TouchableOpacity>
							))}
						</View>

						<Text variant="h6" style={styles.sectionLabel}>
							Choose Icon
						</Text>
						<View style={styles.iconGrid}>
							{COLLECTION_ICON_OPTIONS.map((iconName) => {
								const IconComponent = getCollectionIcon(iconName);
								const isSelected = selectedIcon === iconName;

								return (
									<TouchableOpacity
										key={iconName}
										style={[
											styles.iconOption,
											isSelected && styles.selectedIconOption,
										]}
										onPress={() => setSelectedIcon(iconName)}
										activeOpacity={0.7}>
										<IconComponent
											width={24}
											height={24}
											color={
												isSelected ? colors.neutral.white : colors.text.primary
											}
											strokeWidth={2}
										/>
									</TouchableOpacity>
								);
							})}
						</View>

						<View style={styles.modalButtons}>
							<Button
								variant="outline"
								onPress={handleClose}
								style={{ flex: 1 }}>
								Cancel
							</Button>
							<Button
								variant="primary"
								onPress={handleAddCollection}
								style={{ flex: 1 }}
								disabled={createCollectionMutation.isPending}>
								{createCollectionMutation.isPending ? 'Adding...' : 'Add'}
							</Button>
						</View>
					</View>
				</ScrollView>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: spacing.xl,
	},
	modalContent: {
		backgroundColor: colors.background.primary,
		borderRadius: 16,
		padding: spacing.lg,
		width: '85%',
		maxWidth: 400,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.lg,
	},
	closeButton: {
		padding: spacing.xs,
	},
	modalInput: {
		backgroundColor: colors.background.secondary,
		borderRadius: 12,
		padding: spacing.md,
		fontSize: 16,
		fontFamily: 'Jost_400Regular',
		color: colors.text.primary,
		marginBottom: spacing.xs,
	},
	charCounter: {
		textAlign: 'right',
		color: colors.text.secondary,
		marginBottom: spacing.md,
	},
	sectionLabel: {
		marginTop: spacing.sm,
		marginBottom: spacing.sm,
		color: colors.text.secondary,
	},
	colorGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.md,
		marginBottom: spacing.md,
	},
	colorOption: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: 'transparent',
	},
	selectedColorOption: {
		borderColor: colors.neutral.white,
		borderWidth: 3,
	},
	iconGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
		marginBottom: spacing.lg,
	},
	iconOption: {
		width: 48,
		height: 48,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background.secondary,
	},
	selectedIconOption: {
		backgroundColor: colors.primary.main,
	},
	modalButtons: {
		flexDirection: 'row',
		gap: spacing.md,
	},
});
