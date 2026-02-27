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
	ExpandableText,
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
	BookStack,
	PineTree,
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
				title="Spill Details"
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
					<Text variant="h2" style={styles.title}>
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
							<Text
								weight="medium"
								variant="label"
								color={colors.text.secondary}>
								{formatDate(entry.date)}
							</Text>
						</View>
					</View>

					{collection && (
						<View style={styles.collectionContainer}>
							<View style={styles.metadataItem}>
								<BookStack
									width={16}
									height={16}
									color={colors.text.secondary}
									strokeWidth={2}
								/>
								<Text
									weight="medium"
									variant="label"
									color={colors.text.secondary}>
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
										variant="label"
										color={colors.neutral.white}
										style={styles.collectionName}>
										{collection.name}
									</Text>
								</View>
							</Card>
						</View>
					)}

					{entry.tags && entry.tags.length > 0 && (
						<View style={styles.tagsContainer}>
							<View style={styles.metadataItem}>
								<Hashtag
									width={16}
									height={16}
									color={colors.text.secondary}
									strokeWidth={2}
								/>
								<Text
									weight="medium"
									variant="label"
									color={colors.text.primary}>
									Tags:
								</Text>
							</View>
							<View style={styles.tagsWrapper}>
								{entry.tags.map((tag, index) => (
									<TouchableOpacity
										key={index}
										style={styles.tag}
										onPress={() =>
											navigation.navigate('Entries By Tag', { tag })
										}>
										<Text variant="label" color={colors.text.primary}>
											#{tag}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>
					)}

					{entry.location && (
						<View style={styles.locationContainer}>
							<View style={styles.metadataItem}>
								<PineTree
									width={16}
									height={16}
									color={colors.text.secondary}
									strokeWidth={2}
								/>
								<Text
									weight="medium"
									variant="label"
									color={colors.text.primary}>
									Location:
								</Text>
							</View>
							<Text variant="body" color={colors.text.primary}>
								{entry.location.address ||
									`${entry.location.latitude}, ${entry.location.longitude}`}
							</Text>
						</View>
					)}

					<View style={styles.entryContent}>
						<ExpandableText
							variant="body"
							style={styles.entryText}
							numberOfLines={15}>
							{entry.content}
						</ExpandableText>
					</View>

					{entry.media && entry.media.length > 0 && (
						<View style={styles.mediaGallery}>
							<Text weight="medium" variant="label" style={styles.sectionTitle}>
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
		backgroundColor: colors.accent.gold,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
		borderRadius: 12,
	},
	locationContainer: {
		marginBottom: spacing.md,
	},
	entryContent: {
		marginTop: spacing.md,
		marginBottom: spacing.lg,
		borderWidth: 1,
		borderColor: colors.background.secondary,
		borderRadius: 8,
		padding: spacing.lg,
		backgroundColor: colors.background.secondary,
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
