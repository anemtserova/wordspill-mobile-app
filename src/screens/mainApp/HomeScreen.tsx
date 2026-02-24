import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
	Text,
	Button,
	SearchBar,
	Card,
	AddCollectionModal,
} from '../../components/ui';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useGetAllCollections } from '../../api/collections';
import { getCollectionIcon } from '../../utils/collectionIcons';
import { seedDefaultCollections } from '../../utils/seedDefaultCollections';
import { Plus } from 'iconoir-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 3) / 2;

export const HomeScreen = ({
	navigation,
}: {
	navigation: NativeStackNavigationProp<any>;
}) => {
	const { profile, user } = useAuth();
	const [searchQuery, setSearchQuery] = useState('');
	const [isCollectionModalVisible, setIsCollectionModalVisible] =
		useState(false);

	const {
		data: collections = [],
		isLoading: collectionsLoading,
		error: collectionsError,
		refetch: refetchCollections,
	} = useGetAllCollections(user?.uid || '');

	useEffect(() => {
		const seedIfNeeded = async () => {
			if (
				!collectionsLoading &&
				!collectionsError &&
				collections.length === 0 &&
				user?.uid
			) {
				console.log('No collections found. Seeding default collections...');
				await seedDefaultCollections(user.uid);
				refetchCollections();
			}
		};

		seedIfNeeded();
	}, [collectionsLoading, collectionsError, collections.length, user?.uid]);

	const displayName =
		profile?.displayName || user?.email?.split('@')[0] || 'Friend';
	const greeting = getGreeting();

	const handleCollectionPress = (collectionId: string) => {
		navigation.navigate('Entries', {
			screen: 'Collections',
			params: { collectionId },
		});
	};

	const handleStartWithoutCollection = () => {
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
				<View style={styles.header}>
					<View style={styles.greetingContainer}>
						<Text variant="h2" style={styles.greeting}>
							{greeting},
						</Text>
						<Text variant="h2" color={colors.secondary.main}>
							{displayName}
						</Text>
					</View>

					<TouchableOpacity
						style={styles.avatarContainer}
						onPress={() => navigation.navigate('ProfileTab')}>
						<View style={styles.avatar}>
							<Text style={styles.avatarText}>
								{displayName.charAt(0).toUpperCase()}
							</Text>
						</View>
					</TouchableOpacity>
				</View>

				<SearchBar
					variant="filled"
					placeholder="Search collections or tags..."
					value={searchQuery}
					onChangeText={setSearchQuery}
					onClear={() => setSearchQuery('')}
					onSubmitEditing={handleSearch}
					containerStyle={styles.searchBar}
				/>

				<View style={styles.section}>
					<Text variant="h4" style={styles.sectionTitle}>
						Choose a Collection
					</Text>

					{collectionsLoading ? (
						<Text variant="body" color={colors.text.secondary}>
							Loading your collections...
						</Text>
					) : collectionsError ? (
						<Text variant="body" color={colors.semantic.error}>
							Error loading collections
						</Text>
					) : collections.length === 0 ? (
						<Text variant="body" color={colors.text.secondary}>
							No collections yet. Start creating entries!
						</Text>
					) : (
						<View style={styles.collectionsGrid}>
							{collections.map((collection) => {
								const IconComponent = getCollectionIcon(collection.iconName);

								return (
									<TouchableOpacity
										key={collection.id}
										style={[
											styles.collectionCard,
											{
												backgroundColor:
													collection.color || colors.primary.light,
											},
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
											truncated={collection.name.length > 12}
											ellipsizeMode="tail"
											color={colors.neutral.white}
											style={styles.collectionName}>
											{collection.name}
										</Text>
									</TouchableOpacity>
								);
							})}

							<TouchableOpacity
								style={[styles.collectionCard, styles.addCollectionCard]}
								onPress={() => setIsCollectionModalVisible(true)}
								activeOpacity={0.8}>
								<Plus
									width={32}
									height={32}
									color={colors.primary.main}
									strokeWidth={2}
								/>
								<Text
									variant="h6"
									color={colors.primary.main}
									style={styles.collectionName}>
									Add New
								</Text>
							</TouchableOpacity>
						</View>
					)}

					<Text variant="h4" style={styles.jumpRightInTitle}>
						Or Jump Right In
					</Text>
					<Button
						variant="outline"
						fullWidth
						onPress={handleStartWithoutCollection}>
						Start Without Collection
					</Button>
				</View>

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

			<AddCollectionModal
				visible={isCollectionModalVisible}
				onClose={() => setIsCollectionModalVisible(false)}
				userId={user?.uid || ''}
			/>
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
		paddingTop: spacing['2xl'],
		paddingBottom: spacing.lg,
		backgroundColor: colors.background.secondary,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
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
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: colors.secondary.main,
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		fontSize: 32,
		fontFamily: 'Jost_700Bold',
		color: colors.neutral.white,
	},
	searchBar: {
		marginHorizontal: spacing.lg,
		marginBottom: spacing.lg,
		marginTop: spacing.md,
		backgroundColor: colors.background.secondary,
	},
	section: {
		paddingHorizontal: spacing.lg,
		marginBottom: spacing.sm,
	},
	sectionTitle: {
		marginBottom: spacing.sm,
	},
	jumpRightInTitle: {
		marginTop: spacing.xs,
		marginBottom: spacing.sm,
	},
	collectionsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.md,
	},
	collectionCard: {
		width: CARD_WIDTH,
		aspectRatio: 1.4,
		borderRadius: 16,
		padding: spacing.md,
		justifyContent: 'center',
		alignItems: 'center',
		gap: spacing.sm,
	},
	addCollectionCard: {
		backgroundColor: colors.background.secondary,
		borderWidth: 2,
		borderColor: colors.primary.main,
		borderStyle: 'dashed',
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
