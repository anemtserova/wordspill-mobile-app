import React from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Alert,
	Image as RNImage,
	Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Text, Button, Card } from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useGetAllCollections } from '../../api/collections';
import { useGetEntriesByCollection } from '../../api/entries/queries';
import { deleteEntry } from '../../api/firebase/firestore';
import { getCollectionIcon } from '../../utils/collectionIcons';
import { Trash, NavArrowLeft } from 'iconoir-react-native';

type Props = NativeStackScreenProps<any, 'Collections'>;

export const SelectedCollectionScreen = ({ route, navigation }: Props) => {
	const { collectionId } = route.params || {};
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const { data: collections = [] } = useGetAllCollections(user?.uid || '');
	const collection = collections.find((c) => c.id === collectionId);

	const {
		data: entries = [],
		isLoading: entriesLoading,
		error: entriesError,
	} = useGetEntriesByCollection(user?.uid || '', collectionId);

	const deleteEntryMutation = useMutation({
		mutationFn: async (entryId: string) => {
			if (!user?.uid) throw new Error('User not authenticated');
			return await deleteEntry(user.uid, entryId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['entries', user?.uid] });
			queryClient.invalidateQueries({
				queryKey: ['entries', user?.uid, 'collection', collectionId],
			});
		},
	});

	const handleAddEntry = () => {
		navigation.navigate('Add Entry', { collectionId });
	};

	const handleDeleteEntry = (entryId: string, entryTitle: string) => {
		Alert.alert(
			'Delete Entry',
			`Are you sure you want to delete "${entryTitle}"? This action cannot be undone.`,
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						deleteEntryMutation.mutate(entryId);
					},
				},
			],
		);
	};

	if (!collection) {
		return (
			<View style={styles.container}>
				<Text variant="body" color={colors.text.secondary}>
					Collection not found
				</Text>
			</View>
		);
	}

	const IconComponent = getCollectionIcon(collection.iconName);

	return (
		<View style={styles.container}>
			<View
				style={[
					styles.header,
					{ backgroundColor: collection.color || colors.primary.light },
				]}>
				{/* Back Button and Title Row */}
				<View style={styles.headerTop}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}>
						<NavArrowLeft
							width={24}
							height={24}
							color={colors.neutral.white}
							strokeWidth={2.5}
						/>
					</TouchableOpacity>

					<IconComponent
						width={32}
						height={32}
						color={colors.neutral.white}
						strokeWidth={2}
					/>

					<Text
						variant="h3"
						color={colors.neutral.white}
						style={styles.headerTitle}>
						{collection.name}
					</Text>
				</View>

				<Text
					variant="label"
					color={colors.neutral.white}
					style={styles.entryCount}>
					{entries.length} {entries.length === 1 ? 'entry' : 'entries'}
				</Text>
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				{entriesLoading ? (
					<View style={styles.centerContent}>
						<Text variant="body" color={colors.text.secondary}>
							Loading entries...
						</Text>
					</View>
				) : entriesError ? (
					<View style={styles.centerContent}>
						<Text variant="body" color={colors.semantic.error}>
							Error loading entries
						</Text>
					</View>
				) : entries.length === 0 ? (
					<View style={styles.centerContent}>
						<Text
							variant="body"
							color={colors.text.secondary}
							style={styles.emptyText}>
							No entries yet in this collection
						</Text>
						<Button
							onPress={handleAddEntry}
							variant="primary"
							style={styles.firstEntryButton}>
							Add Your First Entry {''}
						</Button>
					</View>
				) : (
					<View style={styles.entriesContainer}>
						{entries.map((entry) => (
							<TouchableOpacity
								key={entry.id}
								activeOpacity={0.7}
								onPress={() =>
									navigation.navigate('Entry Details', { entryId: entry.id })
								}>
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
												style={styles.entryExcerpt}>
												{entry.content}
											</Text>

											{entry.tags.length > 0 && (
												<View style={styles.tagsContainer}>
													{entry.tags
														.slice(0, 3)
														.map((tag: string, index: number) => (
															<View key={index} style={styles.tag}>
																<Text
																	variant="caption"
																	color={colors.primary.main}>
																	#{tag}
																</Text>
															</View>
														))}
													{entry.tags.length > 3 && (
														<Text
															variant="caption"
															color={colors.text.secondary}>
															+{entry.tags.length - 3}
														</Text>
													)}
												</View>
											)}

											<View style={styles.entryFooter}>
												<Text variant="caption" color={colors.text.secondary}>
													{new Date(entry.createdAt).toDateString()}
												</Text>

												<TouchableOpacity
													style={styles.deleteButton}
													onPress={(e) => {
														e.stopPropagation();
														handleDeleteEntry(entry.id, entry.title);
													}}>
													<Trash
														width={20}
														height={20}
														color={colors.semantic.error}
														strokeWidth={2}
													/>
												</TouchableOpacity>
											</View>
										</View>
									</View>
								</Card>
							</TouchableOpacity>
						))}
					</View>
				)}
			</ScrollView>

			{entries.length > 0 && (
				<TouchableOpacity style={styles.fab} onPress={handleAddEntry}>
					<Text variant="h2" color={colors.neutral.white}>
						+
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	header: {
		paddingTop: Platform.OS === 'ios' ? spacing['4xl'] : spacing.lg,
		paddingBottom: spacing.lg,
		paddingHorizontal: spacing.lg,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
	},
	headerTop: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		marginBottom: spacing.xs,
	},
	backButton: {
		padding: spacing.xs,
		marginRight: spacing.xs,
	},
	headerTitle: {
		flex: 1,
	},
	entryCount: {
		marginLeft: spacing['2xl'] + spacing.sm,
		opacity: 0.85,
	},
	scrollContent: {
		padding: spacing.lg,
		paddingBottom: spacing['5xl'],
	},
	centerContent: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: spacing['4xl'],
	},
	emptyText: {
		textAlign: 'center',
		marginBottom: spacing.lg,
	},
	firstEntryButton: {
		marginTop: spacing.md,
	},
	entriesContainer: {
		gap: spacing.md,
	},
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
		backgroundColor: colors.primary.light,
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
	fab: {
		position: 'absolute',
		right: spacing.lg,
		bottom: spacing.lg,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.primary.main,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 4,
		shadowColor: colors.neutral.black,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
});
