import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	Modal,
	TextInput,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { Xmark } from 'iconoir-react-native';
import { Text } from './Text';
import { Button } from './Button';
import { colors, spacing } from '../../theme';
import { useCreateCollection } from '../../api/collections';

interface AddCollectionModalProps {
	visible: boolean;
	onClose: () => void;
	userId: string;
}

export const AddCollectionModal: React.FC<AddCollectionModalProps> = ({
	visible,
	onClose,
	userId,
}) => {
	const [collectionNameInput, setCollectionNameInput] = useState('');
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
				color: colors.primary.main,
				iconUrl: null,
				iconName: 'book',
			},
			{
				onSuccess: () => {
					setCollectionNameInput('');
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
		onClose();
	};

	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="fade"
			onRequestClose={handleClose}>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<View style={styles.modalHeader}>
						<Text variant="h5">Add New Collection</Text>
						<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
							<Xmark
								width={24}
								height={24}
								color={colors.text.secondary}
								strokeWidth={2}
							/>
						</TouchableOpacity>
					</View>

					<TextInput
						style={styles.modalInput}
						placeholder="Collection name"
						value={collectionNameInput}
						onChangeText={setCollectionNameInput}
						placeholderTextColor={colors.text.secondary}
						autoFocus
						onSubmitEditing={handleAddCollection}
					/>

					<View style={styles.modalButtons}>
						<Button variant="outline" onPress={handleClose} style={{ flex: 1 }}>
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
		marginBottom: spacing.lg,
	},
	modalButtons: {
		flexDirection: 'row',
		gap: spacing.md,
	},
});
