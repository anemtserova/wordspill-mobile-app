import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
	Text,
	Input,
	TextArea,
	Button,
	Tag,
	HeaderImagePicker,
	ImagePicker,
	DatePicker,
	AddTagsModal,
	ScreenHeader,
	LocationPicker,
} from '../../components/ui';
import { colors, spacing } from '../../theme';
import { Plus } from 'iconoir-react-native';
import * as ImagePickerExpo from 'expo-image-picker';
import { useUpdateEntry, useGetEntry } from '../../api/entries';
import { useAuth } from '../../contexts/AuthContext';
import { uploadMedia } from '../../api/firebase/storage';
import { MediaItem, Location } from '../../types/Entry';
import { useGetAllCollections } from '../../api/collections';

type EditEntryScreenProps = NativeStackScreenProps<any, 'Edit Entry'>;

export const EditEntryScreen: React.FC<EditEntryScreenProps> = ({
	navigation,
	route,
}) => {
	const { entryId } = route.params || {};
	const { user } = useAuth();
	const userId = user?.uid || '';

	const { data: entry, isLoading, error } = useGetEntry(userId, entryId || '');
	const updateEntryMutation = useUpdateEntry(userId, entryId || '');
	const { data: defaultCollections = [] } = useGetAllCollections(userId);

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [entryDate, setEntryDate] = useState<Date>(new Date());
	const [selectedCollection, setSelectedCollection] = useState<string | null>(
		null,
	);
	const [tags, setTags] = useState<string[]>([]);
	const [isTagModalVisible, setIsTagModalVisible] = useState(false);
	const [headerImage, setHeaderImage] = useState<string | null>(null);
	const [mediaItems, setMediaItems] = useState<
		{ uri: string; type: 'image' | 'video'; isExisting?: boolean }[]
	>([]);
	const [location, setLocation] = useState<Location | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (entry) {
			setTitle(entry.title);
			setContent(entry.content);
			setEntryDate(new Date(entry.date));
			setSelectedCollection(entry.collectionId);
			setTags(entry.tags || []);
			setHeaderImage(entry.headerImage);
			setLocation(entry.location || null);

			if (entry.media && entry.media.length > 0) {
				const existingMedia = entry.media.map((item) => ({
					uri: item.url,
					type: item.type,
					isExisting: true,
				}));
				setMediaItems(existingMedia);
			}
		}
	}, [entry]);

	const handleAddTags = (newTags: string[]) => {
		setTags([...tags, ...newTags]);
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handlePickHeaderImage = () => {
		Alert.alert('Change Header Image', 'Choose an option', [
			{
				text: 'Take Photo',
				onPress: handleTakeHeaderPhoto,
			},
			{
				text: 'Choose from Library',
				onPress: handleChooseHeaderFromLibrary,
			},
			{
				text: 'Cancel',
				style: 'cancel',
			},
		]);
	};

	const handleTakeHeaderPhoto = async () => {
		const { status } = await ImagePickerExpo.requestCameraPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert(
				'Permission Needed',
				'Please grant camera access to take photos.',
			);
			return;
		}

		const result = await ImagePickerExpo.launchCameraAsync({
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.8,
		});

		if (!result.canceled) {
			setHeaderImage(result.assets[0].uri);
		}
	};

	const handleChooseHeaderFromLibrary = async () => {
		const { status } =
			await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert(
				'Permission Needed',
				'Please grant photo library access to add images.',
			);
			return;
		}

		const result = await ImagePickerExpo.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.8,
		});

		if (!result.canceled) {
			setHeaderImage(result.assets[0].uri);
		}
	};

	const handleAddMediaImage = async () => {
		const { status } =
			await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert(
				'Permission Needed',
				'Please grant photo library access to add media.',
			);
			return;
		}

		const result = await ImagePickerExpo.launchImageLibraryAsync({
			mediaTypes: ['images', 'videos'],
			allowsEditing: true,
			quality: 0.8,
		});

		if (!result.canceled && mediaItems.length < 5) {
			const asset = result.assets[0];
			const mediaType = asset.type === 'video' ? 'video' : 'image';
			setMediaItems([
				...mediaItems,
				{ uri: asset.uri, type: mediaType, isExisting: false },
			]);
		}
	};

	const handleRemoveMediaImage = (index: number) => {
		setMediaItems(mediaItems.filter((_, i) => i !== index));
	};

	const handleUpdate = async () => {
		if (!title.trim()) {
			Alert.alert('Missing Title', 'Please enter a title for your spill.');
			return;
		}
		if (!content.trim()) {
			Alert.alert('Missing Content', 'Please add some content to your spill.');
			return;
		}

		setIsSaving(true);

		try {
			let uploadedHeaderImage: string | null = headerImage;

			if (headerImage && !headerImage.startsWith('http')) {
				const { url } = await uploadMedia(
					userId,
					headerImage,
					'image',
					'headers',
				);
				uploadedHeaderImage = url;
			}

			const uploadedMedia: MediaItem[] = [];
			for (const item of mediaItems) {
				if (item.isExisting) {
					uploadedMedia.push({
						url: item.uri,
						type: item.type,
					});
				} else {
					const { url } = await uploadMedia(
						userId,
						item.uri,
						item.type,
						'entries',
					);
					uploadedMedia.push({
						url,
						type: item.type,
					});
				}
			}

			const updatedEntry = {
				title: title.trim(),
				content: content.trim(),
				collectionId: selectedCollection,
				tags,
				headerImage: uploadedHeaderImage,
				media: uploadedMedia,
				date: entryDate,
				location,
				updatedAt: new Date(),
			};

			await updateEntryMutation.mutateAsync(updatedEntry);

			Alert.alert('Success', 'Spill updated successfully!', [
				{
					text: 'OK',
					onPress: () => navigation.goBack(),
				},
			]);
		} catch (error) {
			Alert.alert(
				'Error',
				'Failed to update spill. Please check your connection and try again.',
			);
			console.error('Update error:', error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDiscard = () => {
		Alert.alert(
			'Discard Changes?',
			'Are you sure you want to discard your changes to this spill? All changes will be lost.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Discard',
					style: 'destructive',
					onPress: () => navigation.goBack(),
				},
			],
		);
	};

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={colors.primary.main} />
				<Text
					variant="body"
					color={colors.text.secondary}
					style={styles.loadingText}>
					Loading spill...
				</Text>
			</View>
		);
	}

	if (error || !entry) {
		return (
			<View style={styles.loadingContainer}>
				<Text variant="body" color={colors.semantic.error}>
					Error loading spill. Please try again later.
				</Text>
				<Button onPress={() => navigation.goBack()} variant="outline">
					Go Back
				</Button>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<ScreenHeader title="Edit Spill" onBackPress={handleDiscard} />

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				<HeaderImagePicker
					imageUri={headerImage}
					onPress={handlePickHeaderImage}
					placeholder="Add header image (optional)"
				/>

				<Input
					label="Title"
					placeholder="Enter title..."
					value={title}
					onChangeText={setTitle}
					style={styles.input}
				/>

				<DatePicker
					label="Date"
					value={entryDate}
					onChange={setEntryDate}
					placeholder="Select date..."
				/>

				<View style={styles.section}>
					<Text variant="label" style={styles.sectionLabel}>
						Collection (Optional)
					</Text>
					<View style={styles.collectionsRow}>
						{defaultCollections.map((collection) => (
							<Tag
								key={collection.id}
								variant={
									selectedCollection === collection.id ? 'accent' : 'default'
								}
								onPress={() =>
									setSelectedCollection(
										selectedCollection === collection.id ? null : collection.id,
									)
								}
								style={styles.collectionTag}>
								{collection.name}
							</Tag>
						))}
					</View>
				</View>

				<TextArea
					label="Content"
					placeholder="What's on your mind?"
					value={content}
					onChangeText={setContent}
					minHeight={200}
					maxLength={10000}
					showCount
					style={styles.input}
				/>

				<View style={styles.section}>
					<Text variant="label" style={styles.sectionLabel}>
						Tags
					</Text>
					<Button
						variant="secondary"
						onPress={() => setIsTagModalVisible(true)}
						style={styles.addTagButton}>
						<Text variant="body" color={colors.primary.contrast}>
							Add Tags
						</Text>
					</Button>
					{tags.length > 0 && (
						<View style={styles.tagsContainer}>
							{tags.map((tag) => (
								<Tag
									key={tag}
									variant="accent"
									removable
									onRemove={() => handleRemoveTag(tag)}>
									{tag}
								</Tag>
							))}
						</View>
					)}
				</View>

				<View style={styles.section}>
					<Text variant="label" style={styles.sectionLabel}>
						Location (Optional)
					</Text>
					<LocationPicker
						location={location}
						onLocationSelect={setLocation}
						onLocationClear={() => setLocation(null)}
					/>
				</View>

				<View style={styles.section}>
					<Text variant="label" style={styles.sectionLabel}>
						Media (Optional)
					</Text>
					<ImagePicker
						images={mediaItems}
						onAddImage={handleAddMediaImage}
						onRemoveImage={handleRemoveMediaImage}
						maxImages={5}
					/>
				</View>
			</ScrollView>

			<View style={styles.bottomActions}>
				<Button
					variant="outline"
					onPress={handleDiscard}
					style={styles.actionButton}>
					Cancel
				</Button>
				<Button
					variant="secondary"
					onPress={handleUpdate}
					loading={isSaving}
					disabled={isSaving}
					style={styles.actionButton}>
					Update Spill
				</Button>
			</View>

			<AddTagsModal
				visible={isTagModalVisible}
				onClose={() => setIsTagModalVisible(false)}
				onAddTags={handleAddTags}
				existingTags={tags}
			/>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.background.primary,
		padding: spacing.lg,
		gap: spacing.md,
	},
	loadingText: {
		marginTop: spacing.md,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: spacing.lg,
		gap: spacing.lg,
	},
	input: {
		marginBottom: 0,
	},
	section: {
		gap: spacing.sm,
	},
	sectionLabel: {
		marginBottom: spacing.xs,
	},
	collectionsRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
	},
	collectionTag: {
		marginBottom: 0,
	},
	addTagButton: {
		marginTop: spacing.xs,
	},
	tagsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
		marginTop: spacing.md,
	},
	bottomActions: {
		flexDirection: 'row',
		gap: spacing.md,
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		backgroundColor: colors.background.primary,
		borderTopWidth: 1,
		borderTopColor: colors.border.light,
	},
	actionButton: {
		flex: 1,
	},
});
