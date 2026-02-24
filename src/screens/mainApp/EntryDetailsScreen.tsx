import React from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Alert,
	Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Text,
	Button,
	Card,
	Image,
	ScreenHeader,
	VideoPlayer,
} from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useGetEntry } from '../../api/entries';
import { useGetAllCollections } from '../../api/collections';
import { deleteEntry } from '../../api/firebase/firestore';
import { getCollectionIcon } from '../../utils/collectionIcons';
import {
	EditPencil,
	Trash,
	Calendar,
	SunLight,
	BookStack,
} from 'iconoir-react-native';
import { Hashtag } from 'iconoir-react-native/regular';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<any, 'Entry Details'>;

export const EntryDetailsScreen = ({ route, navigation }: Props) => {
	const { entryId } = route.params || {};
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const {
		data: entry,
		isLoading,
		error,
	} = useGetEntry(user?.uid || '', entryId);
	const { data: collections = [] } = useGetAllCollections(user?.uid || '');

	const collection = collections.find((c) => c.id === entry?.collectionId);

	const deleteEntryMutation = useMutation({
		mutationFn: async () => {
			if (!user?.uid) throw new Error('User not authenticated');
			return await deleteEntry(user.uid, entryId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['entries', user?.uid] });
			navigation.goBack();
		},
	});

	const handleDelete = () => {
		Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: () => deleteEntryMutation.mutate(),
			},
		]);
	};

	const handleEdit = () => {
		navigation.navigate('Edit Entry', { entryId });
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	if (isLoading) {
		return (
			<View style={styles.centerContent}>
				<Text variant="body" color={colors.text.secondary}>
					Loading...
				</Text>
			</View>
		);
	}

	if (error || !entry) {
		return (
			<View style={styles.centerContent}>
				<Text variant="body" color={colors.text.secondary}>
					Entry not found
				</Text>
				<Button
					onPress={() => navigation.goBack()}
					variant="outline"
					style={styles.backButton}>
					Go Back
				</Button>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ScreenHeader
				title="Entry Details"
				onBackPress={() => navigation.goBack()}
				rightComponent={
					<View style={{ flexDirection: 'row', gap: spacing.md }}>
						<TouchableOpacity onPress={handleEdit} activeOpacity={0.7}>
							<EditPencil
								width={24}
								height={24}
								color={colors.text.primary}
								strokeWidth={2}
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleDelete} activeOpacity={0.7}>
							<Trash
								width={24}
								height={24}
								color={colors.semantic.error}
								strokeWidth={2}
							/>
						</TouchableOpacity>
					</View>
				}
			/>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				{entry.headerImage && (
					<Image
						source={{ uri: entry.headerImage }}
						style={styles.headerImage}
						resizeMode="cover"
						clickable
					/>
				)}

				<View style={styles.content}>
					<Text variant="h3" style={styles.title}>
						{entry.title}
					</Text>

					<View style={styles.metadataRow}>
						<View style={styles.metadataItem}>
							<Calendar
								width={16}
								height={16}
								color={colors.text.secondary}
								strokeWidth={2}
							/>
							<Text variant="caption" color={colors.text.secondary}>
								{formatDate(entry.date)}
							</Text>
						</View>

						{/* Mood */}
						{entry.mood && (
							<View style={styles.metadataItem}>
								<SunLight
									width={16}
									height={16}
									color={colors.text.secondary}
									strokeWidth={2}
								/>
								<Text variant="caption" color={colors.text.secondary}>
									{entry.mood}
								</Text>
							</View>
						)}
					</View>

					{/* Collection */}
					{collection && (
						<View style={styles.collectionContainer}>
							<View style={styles.metadataItem}>
								<BookStack
									width={16}
									height={16}
									color={colors.text.secondary}
									strokeWidth={2}
								/>
								<Text variant="caption" color={colors.text.secondary}>
									Collection:
								</Text>
							</View>
							<Card
								style={[
									styles.collectionBadge,
									{ backgroundColor: collection.color || colors.primary.main },
								]}>
								<View style={styles.collectionBadgeContent}>
									{(() => {
										const IconComponent = getCollectionIcon(
											collection.iconName,
										);
										return (
											<IconComponent
												width={14}
												height={14}
												color={colors.neutral.white}
												strokeWidth={2}
											/>
										);
									})()}
									<Text
										variant="caption"
										color={colors.neutral.white}
										style={styles.collectionName}>
										{collection.name}
									</Text>
								</View>
							</Card>
						</View>
					)}

					{/* Tags */}
					{entry.tags && entry.tags.length > 0 && (
						<View style={styles.tagsContainer}>
							<View style={styles.metadataItem}>
								<Hashtag
									width={16}
									height={16}
									color={colors.text.secondary}
									strokeWidth={2}
								/>
								<Text variant="caption" color={colors.text.secondary}>
									Tags:
								</Text>
							</View>
							<View style={styles.tagsWrapper}>
								{entry.tags.map((tag, index) => (
									<View key={index} style={styles.tag}>
										<Text variant="caption" color={colors.text.secondary}>
											#{tag}
										</Text>
									</View>
								))}
							</View>
						</View>
					)}

					{/* Content */}
					<View style={styles.entryContent}>
						<Text variant="body" style={styles.entryText}>
							{entry.content}
						</Text>
					</View>

					{/* Media Gallery */}
					{entry.media && entry.media.length > 0 && (
						<View style={styles.mediaGallery}>
							<Text variant="h6" style={styles.sectionTitle}>
								Media
							</Text>
							<View style={styles.mediaGrid}>
								{entry.media.map((item, index) =>
									item.type === 'video' ? (
										<VideoPlayer
											key={index}
											uri={item.url}
											thumbnailUri={item.thumbnailUrl}
											style={styles.mediaItem}
										/>
									) : (
										<Image
											key={index}
											source={{ uri: item.url }}
											style={styles.mediaItem}
											resizeMode="cover"
											clickable
										/>
									),
								)}
							</View>
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	centerContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background.primary,
		padding: spacing.lg,
	},
	backButton: {
		marginTop: spacing.xs,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: spacing.xl,
	},
	headerImage: {
		width: width,
		height: width * 0.6,
		backgroundColor: colors.background.secondary,
	},
	content: {
		padding: spacing.lg,
	},
	title: {
		marginBottom: spacing.md,
	},
	metadataRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.md,
		marginBottom: spacing.md,
	},
	metadataItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	collectionContainer: {
		marginBottom: spacing.md,
	},
	collectionBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		marginTop: spacing.xs,
	},
	collectionBadgeContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
	},
	collectionName: {
		fontWeight: '600',
	},
	tagsContainer: {
		marginBottom: spacing.md,
	},
	tagsWrapper: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.xs,
		marginTop: spacing.xs,
	},
	tag: {
		backgroundColor: colors.background.secondary,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: 12,
	},
	entryContent: {
		marginTop: spacing.md,
		marginBottom: spacing.lg,
	},
	entryText: {
		lineHeight: 24,
	},
	mediaGallery: {
		marginTop: spacing.lg,
	},
	sectionTitle: {
		marginBottom: spacing.md,
	},
	mediaGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
	},
	mediaItem: {
		width: (width - spacing.lg * 2 - spacing.sm * 2) / 3,
		height: (width - spacing.lg * 2 - spacing.sm * 2) / 3,
		borderRadius: 8,
		backgroundColor: colors.background.secondary,
	},
});
