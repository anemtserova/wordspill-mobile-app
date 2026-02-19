import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Alert,
	TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
	Text,
	Input,
	TextArea,
	Button,
	Card,
	Tag,
	HeaderImagePicker,
	ImagePicker,
	DatePicker,
} from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Xmark } from 'iconoir-react-native';
import * as ImagePickerExpo from 'expo-image-picker';
import { useCreateEntry } from '../../api/entries';
import { useAuth } from '../../contexts/AuthContext';
import { uploadMedia } from '../../api/firebase/storage';
import { MediaItem } from '../../types/Entry';
import { useGetAllCollections } from '../../api/collections';

interface AddEntryScreenProps {
	navigation: NativeStackNavigationProp<any>;
	route?: {
		params?: {
			collectionId?: string;
			userId?: string;
		};
	};
}

export const AddEntryScreen: React.FC<AddEntryScreenProps> = ({
	navigation,
	route,
}) => {
	const insets = useSafeAreaInsets();
	const preselectedCollection = route?.params?.collectionId;
	const { user } = useAuth();
	const userId = user?.uid || '';

	const createEntryMutation = useCreateEntry(userId);

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [entryDate, setEntryDate] = useState<Date>(new Date());
	const [selectedCollection, setSelectedCollection] = useState<string | null>(
		preselectedCollection || null,
	);
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState('');
	const [headerImage, setHeaderImage] = useState<string | null>(null);
	const [mediaItems, setMediaItems] = useState<
		{ uri: string; type: 'image' | 'video' }[]
	>([]);
	const [isSaving, setIsSaving] = useState(false);

	const defaultCollections = useGetAllCollections(userId).data || [];

	const handleAddTag = () => {
		const trimmedTag = tagInput.trim();
		if (trimmedTag && !tags.includes(trimmedTag)) {
			setTags([...tags, trimmedTag]);
			setTagInput('');
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handlePickHeaderImage = () => {
		Alert.alert('Add Header Image', 'Choose an option', [
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
				'Please grant camera access to take photos so your entries can capture beautiful moments like this one.',
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
				'Please grant photo library access to add images so your entries fully capture your experiences.',
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
				'Please grant photo library access to add media so your entries fully capture your experiences.',
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
			setMediaItems([...mediaItems, { uri: asset.uri, type: mediaType }]);
		}
	};

	const handleRemoveMediaImage = (index: number) => {
		setMediaItems(mediaItems.filter((_, i) => i !== index));
	};

	const handleSave = async () => {
		if (!title.trim()) {
			Alert.alert('Missing Title', 'Please enter a title for your entry.');
			return;
		}
		if (!content.trim()) {
			Alert.alert('Missing Content', 'Please add some content to your entry.');
			return;
		}

		setIsSaving(true);

		try {
			let uploadedHeaderImage: string | null = null;
			if (headerImage) {
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

			const newEntry = {
				title: title.trim(),
				content: content.trim(),
				collectionId: selectedCollection,
				tags,
				headerImage: uploadedHeaderImage,
				media: uploadedMedia,
				date: entryDate,
				mood: null,
				updatedAt: new Date(),
			};

			await createEntryMutation.mutateAsync(newEntry);

			Alert.alert('Success', 'Entry saved successfully!', [
				{
					text: 'OK',
					onPress: () => navigation.goBack(),
				},
			]);
		} catch (error) {
			Alert.alert(
				'Error',
				'Failed to save entry. Please check your connection and try again.',
			);
			console.error('Save error:', error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDiscard = () => {
		Alert.alert(
			'Discard Entry?',
			'Are you sure you want to discard this entry? All changes will be lost.',
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

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={insets.top}>
			<View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
				<TouchableOpacity onPress={handleDiscard} style={styles.backButton}>
					<ArrowLeft
						width={24}
						height={24}
						color={colors.text.primary}
						strokeWidth={2}
					/>
				</TouchableOpacity>
				<Text variant="h5">New Entry</Text>
				<View style={styles.headerRight} />
			</View>

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
					<View style={styles.tagInputRow}>
						<Input
							placeholder="Add a tag..."
							value={tagInput}
							onChangeText={setTagInput}
							onSubmitEditing={handleAddTag}
							returnKeyType="done"
							style={styles.tagInput}
						/>
						<Button
							variant="secondary"
							size="sm"
							onPress={handleAddTag}
							disabled={!tagInput.trim()}
							style={styles.addTagButton}>
							<Plus
								width={20}
								height={20}
								color={colors.neutral.white}
								strokeWidth={2}
							/>
						</Button>
					</View>
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

			<View
				style={[
					styles.bottomActions,
					{ paddingBottom: insets.bottom + spacing.md },
				]}>
				<Button
					variant="outline"
					onPress={handleDiscard}
					style={styles.actionButton}>
					Cancel
				</Button>
				<Button
					variant="secondary"
					onPress={handleSave}
					loading={isSaving}
					disabled={isSaving}
					style={styles.actionButton}>
					Save Entry
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.lg,
		paddingBottom: spacing.sm,
		backgroundColor: colors.background.primary,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.light,
	},
	backButton: {
		padding: spacing.xs,
		width: 40,
	},
	headerRight: {
		width: 40,
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
	tagInputRow: {
		flexDirection: 'row',
		gap: spacing.sm,
		alignItems: 'flex-start',
	},
	tagInput: {
		flex: 1,
		marginBottom: 0,
	},
	addTagButton: {
		paddingHorizontal: spacing.md,
		minWidth: 'auto',
	},
	tagsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
		marginTop: spacing.xs,
	},
	bottomActions: {
		flexDirection: 'row',
		gap: spacing.md,
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.md,
		backgroundColor: colors.background.primary,
		borderTopWidth: 1,
		borderTopColor: colors.border.light,
	},
	actionButton: {
		flex: 1,
	},
});
