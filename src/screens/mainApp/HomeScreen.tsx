import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, Button, SearchBar, Card } from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import {
	Book,
	Page,
	Map,
	EditPencil,
	BookLock,
	PageEdit,
	Fish,
	SeaAndSun,
	FavouriteBook,
	Learning,
} from 'iconoir-react-native';
import { Flower } from 'iconoir-react-native/regular';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 3) / 2;

export const PREDEFINED_COLLECTIONS = [
	{
		id: 'fiction',
		name: 'Fiction',
		icon: Fish,
		color: colors.accent.cream,
	},
	{
		id: 'poetry',
		name: 'Poetry',
		icon: Flower,
		color: colors.accent.teal,
	},
	{
		id: 'travel',
		name: 'Travel',
		icon: SeaAndSun,
		color: colors.accent.peach,
	},
	{
		id: 'quick-notes',
		name: 'Quick Notes',
		icon: EditPencil,
		color: colors.accent.gold,
	},
	{
		id: 'diary',
		name: 'Diary',
		icon: FavouriteBook,
		color: colors.secondary.light,
	},
	{
		id: 'essay',
		name: 'Essay',
		icon: Learning,
		color: colors.primary.light,
	},
];

export const HomeScreen = ({
	navigation,
}: {
	navigation: NativeStackNavigationProp<any>;
}) => {
	const { profile, user } = useAuth();
	const [searchQuery, setSearchQuery] = useState('');

	const displayName =
		profile?.displayName || user?.email?.split('@')[0] || 'Friend';
	const greeting = getGreeting();

	const handleCollectionPress = (collectionId: string) => {
		// Navigate to Entries navigator, which will show the SelectedCollectionScreen
		navigation.navigate('Entries', {
			screen: 'Collections',
			params: { collectionId },
		});
	};

	const handleStartWithoutCollection = () => {
		// Navigate to add entry screen
		navigation.navigate('Entries', {
			screen: 'Add Entry',
		});
	};

	const handleSearch = () => {
		// TODO: Implement search functionality
		console.log('Searching for:', searchQuery);
	};

	return (
		<View style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				{/* Header Section */}
				<View style={styles.header}>
					<View style={styles.greetingContainer}>
						<Text variant="h2" style={styles.greeting}>
							{greeting},
						</Text>
						<Text variant="h2" color={colors.secondary.main}>
							{displayName}
						</Text>
					</View>

					{/* Avatar */}
					<TouchableOpacity
						style={styles.avatarContainer}
						onPress={() => navigation.navigate('ProfileScreen')}>
						<View style={styles.avatar}>
							<Text style={styles.avatarText}>
								{displayName.charAt(0).toUpperCase()}
							</Text>
						</View>
					</TouchableOpacity>
				</View>

				{/* Search Bar */}
				<SearchBar
					variant="filled"
					placeholder="Search collections or tags..."
					value={searchQuery}
					onChangeText={setSearchQuery}
					onClear={() => setSearchQuery('')}
					onSubmitEditing={handleSearch}
					containerStyle={styles.searchBar}
				/>

				{/* Collections Grid */}
				<View style={styles.section}>
					<Text variant="h4" style={styles.sectionTitle}>
						Choose a Collection
					</Text>

					<View style={styles.collectionsGrid}>
						{PREDEFINED_COLLECTIONS.map((collection) => {
							const IconComponent = collection.icon;
							return (
								<TouchableOpacity
									key={collection.id}
									style={[
										styles.collectionCard,
										{ backgroundColor: collection.color },
									]}
									onPress={() => handleCollectionPress(collection.id)}
									activeOpacity={0.8}>
									<IconComponent
										width={32}
										height={32}
										color={colors.neutral.white}
										strokeWidth={2}
									/>
									<Text
										variant="h6"
										color={colors.neutral.white}
										style={styles.collectionName}>
										{collection.name}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</View>

				{/* Start Without Collection Button */}
				<View style={styles.section}>
					<Text variant="h4" style={styles.sectionTitle}>
						Or Jump Right In
					</Text>
					<Button
						variant="outline"
						fullWidth
						onPress={handleStartWithoutCollection}>
						Start Without Collection
					</Button>
				</View>

				{/* Quick Stats or Tips */}
				<Card variant="filled" padding="lg" style={styles.tipCard}>
					<Text variant="h6" style={styles.tipTitle}>
						💡 Quick Tip
					</Text>
					<Text variant="body" color={colors.text.secondary}>
						Collections help organize your vocabulary by topics. Choose one to
						get started or create your own!
					</Text>
				</Card>
			</ScrollView>
		</View>
	);
};

function getGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return 'Good Morning';
	if (hour < 18) return 'Good Afternoon';
	return 'Good Evening';
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	scrollContent: {
		paddingBottom: spacing.xl,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.xl,
		paddingBottom: spacing.md,
	},
	greetingContainer: {
		flex: 1,
	},
	greeting: {
		marginBottom: spacing.xs,
	},
	avatarContainer: {
		marginLeft: spacing.md,
	},
	avatar: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.secondary.main,
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		fontSize: 24,
		fontFamily: 'Jost-SemiBold',
		color: colors.neutral.white,
	},
	searchBar: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
	},
	section: {
		paddingHorizontal: spacing.lg,
		marginBottom: spacing.xl,
	},
	sectionTitle: {
		marginBottom: spacing.md,
	},
	collectionsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.md,
	},
	collectionCard: {
		width: CARD_WIDTH,
		aspectRatio: 1,
		borderRadius: 16,
		padding: spacing.md,
		justifyContent: 'center',
		alignItems: 'center',
		gap: spacing.sm,
	},
	collectionName: {
		textAlign: 'center',
	},
	tipCard: {
		marginHorizontal: spacing.lg,
	},
	tipTitle: {
		marginBottom: spacing.sm,
	},
});
