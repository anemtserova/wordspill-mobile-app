import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Modal,
	TextInput,
	TouchableOpacity,
	Alert,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { Xmark } from 'iconoir-react-native';
import { Text } from './Text';
import { Button } from './Button';
import { colors, spacing, borderRadius } from '../../theme';
import { useUpdateCollection } from '../../api/collections';
import { Collection } from '../../types/Collection';

interface EditCollectionModalProps {
	visible: boolean;
	onClose: () => void;
	userId: string;
	collection: Collection | null;
	selectedCollectionName: string;
}

export const EditCollectionModal = ({
	selectedCollectionName,
	visible,
	onClose,
	userId,
	collection,
}: EditCollectionModalProps) => {
	const [collectionName, setCollectionName] = useState(
		selectedCollectionName || '',
	);
	const updateCollectionMutation = useUpdateCollection(userId);

	useEffect(() => {
		if (collection) {
			setCollectionName(collection.name);
		}
	}, [collection]);

	const handleUpdate = () => {
		const trimmedName = collectionName.trim();

		if (!trimmedName) {
			Alert.alert('Error', 'Please enter a collection name');
			return;
		}

		if (!collection) {
			return;
		}

		if (trimmedName === collection.name) {
			// No changes made
			onClose();
			return;
		}

		updateCollectionMutation.mutate(
			{
				collectionId: collection.id,
				data: { name: trimmedName },
			},
			{
				onSuccess: () => {
					setCollectionName('');
					onClose();
				},
				onError: (error) => {
					Alert.alert('Error', 'Failed to update collection');
					console.error('Error updating collection:', error);
				},
			},
		);
	};

	const handleClose = () => {
		setCollectionName('');
		onClose();
	};

	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="fade"
			onRequestClose={handleClose}>
			<KeyboardAvoidingView
				style={styles.modalOverlay}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<View style={styles.modalContent}>
					<View style={styles.modalHeader}>
						<Text variant="h4">Edit Collection</Text>
						<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
							<Xmark
								width={24}
								height={24}
								color={colors.text.secondary}
								strokeWidth={2}
							/>
						</TouchableOpacity>
					</View>

					<View style={styles.inputContainer}>
						<Text variant="label" style={styles.label}>
							Collection Name
						</Text>
						<TextInput
							style={styles.input}
							value={collection?.name || collectionName}
							onChangeText={setCollectionName}
							placeholder="Enter collection name"
							placeholderTextColor={colors.text.tertiary}
							autoFocus={true}
							maxLength={50}
						/>
					</View>

					<View style={styles.buttonContainer}>
						<Button
							variant="outline"
							onPress={handleClose}
							style={styles.button}>
							Cancel
						</Button>
						<Button
							variant="primary"
							onPress={handleUpdate}
							loading={updateCollectionMutation.isPending}
							style={styles.button}>
							Save Changes
						</Button>
					</View>
				</View>
			</KeyboardAvoidingView>
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
	modalContent: {
		width: '90%',
		maxWidth: 400,
		backgroundColor: colors.background.primary,
		borderRadius: borderRadius.xl,
		padding: spacing.lg,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.xl,
	},
	closeButton: {
		padding: spacing.xs,
	},
	inputContainer: {
		marginBottom: spacing.xl,
	},
	label: {
		marginBottom: spacing.sm,
		color: colors.text.primary,
	},
	input: {
		borderWidth: 1,
		borderColor: colors.border.light,
		borderRadius: borderRadius.md,
		padding: spacing.md,
		fontSize: 16,
		color: colors.text.primary,
		backgroundColor: colors.background.secondary,
	},
	buttonContainer: {
		flexDirection: 'row',
		gap: spacing.md,
	},
	button: {
		flex: 1,
	},
});
