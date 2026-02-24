import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	Modal,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { Xmark } from 'iconoir-react-native';
import { Text } from './Text';
import { Input } from './Input';
import { Button } from './Button';
import { colors, spacing } from '../../theme';

interface AddTagsModalProps {
	visible: boolean;
	onClose: () => void;
	onAddTags: (tags: string[]) => void;
	existingTags: string[];
}

export const AddTagsModal: React.FC<AddTagsModalProps> = ({
	visible,
	onClose,
	onAddTags,
	existingTags,
}) => {
	const [tagInput, setTagInput] = useState('');

	const handleAddTags = () => {
		const trimmedInput = tagInput.trim();
		if (!trimmedInput) {
			handleClose();
			return;
		}

		const newTags = trimmedInput
			.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag && !existingTags.includes(tag));

		if (newTags.length > 0) {
			onAddTags(newTags);
		}

		handleClose();
	};

	const handleClose = () => {
		setTagInput('');
		onClose();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={handleClose}>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<View style={styles.modalHeader}>
						<Text variant="h4" style={styles.modalTitle}>
							Add Tags
						</Text>
						<TouchableOpacity
							onPress={handleClose}
							style={styles.modalCloseButton}>
							<Xmark
								width={24}
								height={24}
								color={colors.text.primary}
								strokeWidth={2}
							/>
						</TouchableOpacity>
					</View>

					<Text
						variant="body"
						color={colors.text.secondary}
						style={styles.modalDescription}>
						Enter tags separated by commas (e.g., travel, vacation, summer)
					</Text>

					<Input
						placeholder="e.g., travel, vacation, summer"
						value={tagInput}
						onChangeText={setTagInput}
						multiline
						numberOfLines={3}
						style={styles.modalInput}
					/>

					<View style={styles.modalButtons}>
						<Button
							variant="outline"
							onPress={handleClose}
							style={styles.modalButton}>
							Cancel
						</Button>
						<Button
							variant="secondary"
							onPress={handleAddTags}
							disabled={!tagInput.trim()}
							style={styles.modalButton}>
							Add Tags
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
		padding: spacing.lg,
	},
	modalContent: {
		backgroundColor: colors.background.primary,
		borderRadius: 16,
		padding: spacing.lg,
		width: '100%',
		maxWidth: 500,
		shadowColor: colors.neutral.black,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.md,
	},
	modalTitle: {
		flex: 1,
	},
	modalCloseButton: {
		padding: spacing.xs,
	},
	modalDescription: {
		marginBottom: spacing.md,
	},
	modalInput: {
		minHeight: 80,
		textAlignVertical: 'top',
		marginBottom: spacing.lg,
	},
	modalButtons: {
		flexDirection: 'row',
		gap: spacing.md,
	},
	modalButton: {
		flex: 1,
		color: colors.text.primary,
	},
});
