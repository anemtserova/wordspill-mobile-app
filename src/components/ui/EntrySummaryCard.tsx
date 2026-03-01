import React, { memo } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Image as RNImage,
} from 'react-native';
import { Text } from './Text';
import { Card } from './Card';
import { colors, spacing } from '../../theme';
import { Trash } from 'iconoir-react-native';
import { Entry } from '../../types';

interface EntrySummaryCardProps {
	entry: Entry;
	onPress: () => void;
	onDelete: () => void;
	showDeleteButton?: boolean;
	onTagPress?: (tag: string) => void;
}

export const EntrySummaryCard = memo(
	({
		entry,
		onPress,
		onDelete,
		showDeleteButton = true,
		onTagPress,
	}: EntrySummaryCardProps) => {
		return (
			<TouchableOpacity activeOpacity={0.7} onPress={onPress}>
				<Card style={styles.entryCard}>
					<View style={styles.entryContent}>
						{entry.headerImage && (
							<RNImage
								source={{ uri: entry.headerImage }}
								style={styles.entryHeaderImage}
								resizeMode="cover"
							/>
						)}

						<View style={styles.entryInfo}>
							<Text variant="h5" numberOfLines={2}>
								{entry.title}
							</Text>
							<Text
								variant="body"
								color={colors.text.secondary}
								numberOfLines={3}
								align="justify"
								style={styles.entryExcerpt}>
								{entry.content}
							</Text>

							{entry.tags.length > 0 && (
								<View style={styles.tagsContainer}>
									{entry.tags.slice(0, 3).map((tag: string, index: number) => (
										<TouchableOpacity
											key={index}
											style={styles.tag}
											onPress={(e) => {
												if (onTagPress) {
													e.stopPropagation();
													onTagPress(tag);
												}
											}}
											disabled={!onTagPress}>
											<Text variant="caption" color={colors.primary.main}>
												#{tag}
											</Text>
										</TouchableOpacity>
									))}
									{entry.tags.length > 3 && (
										<Text variant="caption" color={colors.text.secondary}>
											+{entry.tags.length - 3}
										</Text>
									)}
								</View>
							)}
							<View style={styles.entryFooter}>
								<Text variant="caption" color={colors.text.secondary}>
									{entry.date.toDateString()}
								</Text>

								{showDeleteButton && (
									<TouchableOpacity
										style={styles.deleteButton}
										onPress={(e) => {
											e.stopPropagation();
											onDelete();
										}}>
										<Trash
											width={20}
											height={20}
											color={colors.semantic.error}
											strokeWidth={2}
										/>
									</TouchableOpacity>
								)}
							</View>
						</View>
					</View>
				</Card>
			</TouchableOpacity>
		);
	},
);

const styles = StyleSheet.create({
	entryCard: {
		overflow: 'hidden',
	},
	entryContent: {
		flexDirection: 'column',
	},
	entryHeaderImage: {
		width: '100%',
		height: 150,
		marginBottom: spacing.md,
	},
	entryInfo: {
		gap: spacing.sm,
	},
	entryExcerpt: {
		marginTop: spacing.xs,
	},
	tagsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.xs,
		marginTop: spacing.xs,
	},
	tag: {
		backgroundColor: colors.semantic.success,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: 12,
	},
	entryFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: spacing.sm,
		paddingTop: spacing.sm,
		borderTopWidth: 1,
		borderTopColor: colors.border.light,
	},
	deleteButton: {
		padding: spacing.xs,
	},
});
