import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from './Text';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { Collection } from '../../types/Collection';
import { getCollectionIcon } from '../../utils/collectionIcons';
import { EditPencil, Trash } from 'iconoir-react-native';

interface CollectionCardProps {
	collection: Collection;
	entryCount?: number;
	onPress: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export const CollectionCard = ({
	collection,
	entryCount = 0,
	onPress,
	onEdit,
	onDelete,
}: CollectionCardProps) => {
	const IconComponent = getCollectionIcon(collection.iconName);
	const backgroundColor = collection.color || colors.primary.main;

	const handleDelete = () => {
		Alert.alert(
			'Delete Collection',
			`Are you sure you want to delete "${collection.name}"? This action cannot be undone.`,
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Delete',
					style: 'destructive',
					onPress: onDelete,
				},
			],
		);
	};

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={onPress}
			activeOpacity={0.7}>
			<View style={styles.content}>
				{/* Icon */}
				<View style={[styles.iconContainer, { backgroundColor }]}>
					<IconComponent
						width={28}
						height={28}
						color={colors.neutral.white}
						strokeWidth={2}
					/>
				</View>

				{/* Collection Info */}
				<View style={styles.textContainer}>
					<Text variant="h5" style={styles.collectionName}>
						{collection.name}
					</Text>
					<Text variant="bodySmall" color={colors.text.secondary}>
						{entryCount} {entryCount === 1 ? 'entry' : 'entries'}
					</Text>
				</View>

				<View style={styles.actions}>
					<TouchableOpacity
						style={styles.actionButton}
						onPress={(e) => {
							e.stopPropagation();
							onEdit();
						}}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
						<EditPencil
							width={20}
							height={20}
							color={colors.text.secondary}
							strokeWidth={2}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.actionButton}
						onPress={(e) => {
							e.stopPropagation();
							handleDelete();
						}}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
						<Trash
							width={20}
							height={20}
							color={colors.semantic.error}
							strokeWidth={2}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		backgroundColor: colors.background.secondary,
		borderRadius: borderRadius.lg,
		borderWidth: 1,
		borderColor: colors.border.light,
		marginBottom: spacing.md,
		...shadows.sm,
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: spacing.md,
	},
	iconContainer: {
		width: 56,
		height: 56,
		borderRadius: borderRadius.lg,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: spacing.md,
	},
	textContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	collectionName: {
		marginBottom: spacing.xs,
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	actionButton: {
		padding: spacing.xs,
	},
});
