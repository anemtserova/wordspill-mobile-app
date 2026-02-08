// Design System Usage Examples
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
	Text,
	Button,
	Input,
	TextArea,
	Card,
	Tag,
	Image,
	SearchBar,
	ImagePicker,
	HeaderImagePicker,
	LocationPicker,
} from '../components/ui';
import { colors, spacing } from '../theme';
import { Book, Heart } from 'iconoir-react-native';

export const DesignSystemExample = () => {
	const [inputValue, setInputValue] = useState('');
	const [textAreaValue, setTextAreaValue] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [images, setImages] = useState<string[]>([]);
	const [headerImage, setHeaderImage] = useState<string | null>(null);
	const [location, setLocation] = useState<{
		latitude: number;
		longitude: number;
		address?: string;
	} | null>(null);

	const handleAddImage = () => {
		// Mock adding an image
		const mockImage =
			'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';
		setImages([...images, mockImage]);
	};

	const handleRemoveImage = (index: number) => {
		setImages(images.filter((_, i) => i !== index));
	};

	const handleAddHeaderImage = () => {
		// Mock adding a header image
		const mockHeaderImage =
			'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
		setHeaderImage(mockHeaderImage);
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.section}>
				<Text variant="h1">Design System</Text>
				<Text variant="body" color={colors.text.secondary}>
					Playfair Display & Jost Fonts
				</Text>
			</View>

			{/* Typography Examples */}
			<Card variant="elevated" padding="lg" style={styles.card}>
				<Text variant="h2">Typography</Text>
				<Text variant="h3">Heading 3</Text>
				<Text variant="h4">Heading 4</Text>
				<Text variant="h5">Heading 5</Text>
				<Text variant="h6">Heading 6</Text>
				<Text variant="body">
					This is body text using Jost font. Perfect for longer paragraphs and
					content.
				</Text>
				<Text variant="bodyLarge">Large body text for emphasis</Text>
				<Text variant="bodySmall">Small body text for details</Text>
				<Text variant="caption">Caption text for hints and metadata</Text>
				<Text variant="label">Label Text</Text>
			</Card>

			{/* Button Examples */}
			<Card variant="elevated" padding="lg" style={styles.card}>
				<Text variant="h3" style={styles.sectionTitle}>
					Buttons
				</Text>

				<Button variant="primary" fullWidth style={styles.button}>
					Primary Button
				</Button>

				<Button variant="secondary" fullWidth style={styles.button}>
					Secondary Button
				</Button>

				<Button variant="outline" fullWidth style={styles.button}>
					Outline Button
				</Button>

				<Button variant="ghost" fullWidth style={styles.button}>
					Ghost Button
				</Button>

				<Button variant="accent" fullWidth style={styles.button}>
					Accent Button
				</Button>

				<Button variant="primary" size="sm" fullWidth style={styles.button}>
					Small Button
				</Button>

				<Button variant="primary" size="lg" fullWidth style={styles.button}>
					Large Button
				</Button>

				<Button variant="primary" loading fullWidth style={styles.button}>
					Loading
				</Button>

				<Button variant="primary" disabled fullWidth style={styles.button}>
					Disabled
				</Button>
			</Card>

			{/* Input Examples */}
			<Card variant="elevated" padding="lg" style={styles.card}>
				<Text variant="h3" style={styles.sectionTitle}>
					Inputs
				</Text>

				<Input
					label="Email"
					placeholder="Enter your email"
					value={inputValue}
					onChangeText={setInputValue}
					hint="We'll never share your email"
				/>

				<Input
					label="Password"
					placeholder="Enter password"
					secureTextEntry
					error="Password is required"
				/>

				<Input label="Disabled" placeholder="Disabled input" editable={false} />
			</Card>

			{/* TextArea Examples */}
			<Card variant="elevated" padding="lg" style={styles.card}>
				<Text variant="h3" style={styles.sectionTitle}>
					Text Area
				</Text>

				<TextArea
					label="Description"
					placeholder="Write your thoughts..."
					value={textAreaValue}
					onChangeText={setTextAreaValue}
					maxLength={500}
					showCount
					minHeight={150}
					hint="Share what's on your mind"
				/>
			</Card>

			{/* Tag Examples */}
			<Card variant="elevated" padding="lg" style={styles.card}>
				<Text variant="h3" style={styles.sectionTitle}>
					Tags
				</Text>

				<Text variant="bodySmall" style={styles.subsectionTitle}>
					Filled Tags
				</Text>
				<View style={styles.tagRow}>
					<Tag variant="default">Default</Tag>
					<Tag variant="primary">Primary</Tag>
					<Tag variant="secondary">Secondary</Tag>
					<Tag variant="accent">Accent</Tag>
				</View>

				<View style={styles.tagRow}>
					<Tag variant="success">Success</Tag>
					<Tag variant="warning">Warning</Tag>
					<Tag variant="error">Error</Tag>
				</View>

				<Text variant="bodySmall" style={styles.subsectionTitle}>
					Outlined Tags
				</Text>
				<View style={styles.tagRow}>
					<Tag variant="default" outlined>
						Default
					</Tag>
					<Tag variant="primary" outlined>
						Primary
					</Tag>
					<Tag variant="secondary" outlined>
						Secondary
					</Tag>
					<Tag variant="accent" outlined>
						Accent
					</Tag>
				</View>

				<Text variant="bodySmall" style={styles.subsectionTitle}>
					Sizes
				</Text>
				<View style={styles.tagRow}>
					<Tag variant="primary" size="sm">
						Small
					</Tag>
					<Tag variant="primary" size="md">
						Medium
					</Tag>
					<Tag variant="primary" size="lg">
						Large
					</Tag>
				</View>

				<Text variant="bodySmall" style={styles.subsectionTitle}>
					Removable Tags
				</Text>
				<View style={styles.tagRow}>
					<Tag
						variant="primary"
						removable
						onRemove={() => console.log('Removed')}>
						Removable
					</Tag>
					<Tag
						variant="accent"
						outlined
						removable
						onRemove={() => console.log('Removed')}>
						Removable
					</Tag>
				</View>

				<Text variant="bodySmall" style={styles.subsectionTitle}>
					Clickable Tags
				</Text>
				<View style={styles.tagRow}>
					<Tag variant="secondary" onPress={() => console.log('Clicked')}>
						Clickable
					</Tag>
					<Tag
						variant="success"
						outlined
						onPress={() => console.log('Clicked')}>
						Clickable
					</Tag>
				</View>
			</Card>

			{/* Image Examples */}
			<Card variant="elevated" padding="lg" style={styles.card}>
				<Text variant="h3" style={styles.sectionTitle}>
					Images
				</Text>

				<Text variant="bodySmall" style={styles.subsectionTitle}>
					Variants
				</Text>
				<View style={styles.imageRow}>
					<View style={styles.imageContainer}>
						<Image
							source={require('../../assets/testImages/pexels-olly-813940.jpg')}
							variant="default"
							size="sm"
						/>
						<Text variant="caption" style={styles.imageLabel}>
							Default
						</Text>
					</View>
					<View style={styles.imageContainer}>
						<Image
							source={require('../../assets/testImages/pexels-tomaz-barcellos-999425-1987301.jpg')}
							variant="rounded"
							size="sm"
						/>
						<Text variant="caption" style={styles.imageLabel}>
							Rounded
						</Text>
					</View>
					<View style={styles.imageContainer}>
						<Image
							source={require('../../assets/testImages/pexels-quang-nguyen-vinh-222549-6871904.jpg')}
							variant="circle"
							size="sm"
						/>
						<Text variant="caption" style={styles.imageLabel}>
							Circle
						</Text>
					</View>
					<View style={styles.imageContainer}>
						<Image
							source={require('../../assets/testImages/pexels-oskar-gross-1074333632-34314175.jpg')}
							variant="thumbnail"
							size="sm"
						/>
						<Text variant="caption" style={styles.imageLabel}>
							Thumbnail
						</Text>
					</View>
				</View>

				<Text variant="bodySmall" style={styles.subsectionTitle}>
					Sizes
				</Text>
				<View style={styles.imageRow}>
					<View style={styles.imageContainer}>
						<Image
							source={require('../../assets/testImages/pexels-olly-813940.jpg')}
							variant="rounded"
							size="sm"
						/>
						<Text variant="caption" style={styles.imageLabel}>
							Small
						</Text>
					</View>
					<View style={styles.imageContainer}>
						<Image
							source={require('../../assets/testImages/pexels-tomaz-barcellos-999425-1987301.jpg')}
							variant="rounded"
							size="md"
						/>
						<Text variant="caption" style={styles.imageLabel}>
							Medium
						</Text>
					</View>
				</View>

				<Text variant="bodySmall" style={styles.subsectionTitle}>
					Resize Modes
				</Text>
				<View style={styles.imageRow}>
					<View style={styles.imageContainer}>
						<Image
							source={require('../../assets/testImages/pexels-quang-nguyen-vinh-222549-6871904.jpg')}
							variant="rounded"
							size="md"
							resizeMode="cover"
						/>
						<Text variant="caption" style={styles.imageLabel}>
							Cover
						</Text>
					</View>
					<View style={styles.imageContainer}>
						<Image
							source={require('../../assets/testImages/pexels-quang-nguyen-vinh-222549-6871904.jpg')}
							variant="rounded"
							size="md"
							resizeMode="contain"
						/>
						<Text variant="caption" style={styles.imageLabel}>
							Contain
						</Text>
					</View>
				</View>

				<Text variant="bodySmall" style={styles.subsectionTitle}>
					Clickable (Open in Modal)
				</Text>
				<View style={styles.imageRow}>
					<View style={styles.imageContainer}>
						<Image
							source={require('../../assets/testImages/pexels-olly-813940.jpg')}
							variant="rounded"
							size="md"
							clickable
						/>
						<Text variant="caption" style={styles.imageLabel}>
							Tap to view
						</Text>
					</View>
				</View>
			</Card>

			{/* SearchBar Examples */}
			<Card variant="elevated" padding="lg" style={styles.card}>
				<Text variant="h3" style={styles.sectionTitle}>
					Search Bar
				</Text>

				<Text variant="bodySmall" style={styles.subsectionTitle}>
					Default Variant
				</Text>
				<SearchBar
					variant="default"
					placeholder="Search..."
					value={searchQuery}
					onChangeText={setSearchQuery}
					onClear={() => setSearchQuery('')}
				/>

				<Text variant="bodySmall" style={styles.subsectionTitle}>
					Filled Variant
				</Text>
				<SearchBar
					variant="filled"
					placeholder="Search collections or tags..."
					value={searchQuery}
					onChangeText={setSearchQuery}
					onClear={() => setSearchQuery('')}
				/>
			</Card>

			{/* ImagePicker Examples */}
			<Card variant="elevated" padding="lg" style={styles.card}>
				<Text variant="h3" style={styles.sectionTitle}>
					Image Picker
				</Text>

				<Text variant="body" color={colors.text.secondary} style={styles.hint}>
					Add up to 5 images. Click + to add, X to remove.
				</Text>

				<ImagePicker
					images={images}
					onAddImage={handleAddImage}
					onRemoveImage={handleRemoveImage}
					maxImages={5}
				/>
			</Card>

			{/* Card Examples */}
			<View style={styles.section}>
				<Text variant="h3" style={styles.sectionTitle}>
					Cards
				</Text>

				<Card variant="elevated" padding="lg" style={styles.card}>
					<Text variant="h5">Elevated Card</Text>
					<Text variant="body">Card with shadow elevation</Text>
				</Card>

				<Card variant="outlined" padding="lg" style={styles.card}>
					<Text variant="h5">Outlined Card</Text>
					<Text variant="body">Card with border outline</Text>
				</Card>

				<Card variant="filled" padding="lg" style={styles.card}>
					<Text variant="h5">Filled Card</Text>
					<Text variant="body">Card with background fill</Text>
				</Card>

				<Text
					variant="bodySmall"
					style={[styles.subsectionTitle, { paddingHorizontal: spacing.lg }]}>
					Horizontal Cards
				</Text>

				<Card
					variant="elevated"
					orientation="horizontal"
					padding="md"
					style={styles.card}>
					<Book
						width={24}
						height={24}
						color={colors.primary.main}
						strokeWidth={2}
					/>
					<Text variant="h6">Fiction Collection</Text>
				</Card>

				<Card
					variant="outlined"
					orientation="horizontal"
					padding="md"
					style={styles.card}>
					<Heart
						width={24}
						height={24}
						color={colors.accent.peach}
						strokeWidth={2}
					/>
					<Text variant="h6">Favorite Words</Text>
				</Card>
			</View>

			{/* Header Image Picker */}
			<Card variant="elevated" padding="lg" style={styles.card}>
				<Text variant="h3" style={styles.sectionTitle}>
					Header Image Picker
				</Text>

				<Text variant="body" color={colors.text.secondary} style={styles.hint}>
					Full-width header image component for entries
				</Text>

				<HeaderImagePicker
					imageUri={headerImage}
					onPress={handleAddHeaderImage}
					placeholder="Add entry header image"
				/>

				{headerImage && (
					<Button
						variant="outline"
						size="sm"
						onPress={() => setHeaderImage(null)}
						style={{ marginTop: spacing.md }}>
						Clear Image
					</Button>
				)}
			</Card>

			{/* Location Picker */}
			<Card variant="elevated" padding="lg" style={styles.card}>
				<Text variant="h3" style={styles.sectionTitle}>
					Location Picker
				</Text>

				<Text variant="body" color={colors.text.secondary} style={styles.hint}>
					Add location to entries with current location or manual input
				</Text>

				<LocationPicker
					location={location}
					onLocationSelect={setLocation}
					onLocationClear={() => setLocation(null)}
				/>
			</Card>

			{/* Color Palette */}
			<Card variant="elevated" padding="lg" style={styles.card}>
				<Text variant="h3" style={styles.sectionTitle}>
					Color Palette
				</Text>

				<View style={styles.colorRow}>
					<View
						style={[styles.colorBox, { backgroundColor: colors.primary.main }]}
					/>
					<Text variant="body">Primary</Text>
				</View>

				<View style={styles.colorRow}>
					<View
						style={[
							styles.colorBox,
							{ backgroundColor: colors.secondary.main },
						]}
					/>
					<Text variant="body">Secondary</Text>
				</View>

				<View style={styles.colorRow}>
					<View
						style={[styles.colorBox, { backgroundColor: colors.accent.cream }]}
					/>
					<Text variant="body">Accent Cream</Text>
				</View>

				<View style={styles.colorRow}>
					<View
						style={[styles.colorBox, { backgroundColor: colors.accent.teal }]}
					/>
					<Text variant="body">Accent Teal</Text>
				</View>

				<View style={styles.colorRow}>
					<View
						style={[styles.colorBox, { backgroundColor: colors.accent.peach }]}
					/>
					<Text variant="body">Accent Peach</Text>
				</View>

				<View style={styles.colorRow}>
					<View
						style={[styles.colorBox, { backgroundColor: colors.accent.gold }]}
					/>
					<Text variant="body">Accent Gold</Text>
				</View>
			</Card>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.secondary,
	},
	section: {
		padding: spacing.lg,
	},
	sectionTitle: {
		marginBottom: spacing.md,
	},
	card: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	button: {
		marginBottom: spacing.md,
	},
	colorRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: spacing.md,
		gap: spacing.md,
	},
	colorBox: {
		width: 50,
		height: 50,
		borderRadius: 8,
	},
	tagRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.sm,
		marginBottom: spacing.md,
	},
	subsectionTitle: {
		marginTop: spacing.md,
		marginBottom: spacing.sm,
		fontWeight: '600',
	},
	imageRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.md,
		marginBottom: spacing.md,
	},
	imageContainer: {
		alignItems: 'center',
	},
	imageLabel: {
		marginTop: spacing.xs,
		textAlign: 'center',
	},
	hint: {
		marginBottom: spacing.md,
	},
});
