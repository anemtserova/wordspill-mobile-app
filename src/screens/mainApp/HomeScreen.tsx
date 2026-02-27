import React, { useState, useMemo } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	RefreshControl,
	Image as RNImage,
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
import { LightBulbOn, Plus } from 'iconoir-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.xl * 3) / 2;

export const HomeScreen = ({
	navigation,
}: {
	navigation: NativeStackNavigationProp<any>;
}) => {
	const { profile, user } = useAuth();
	const [searchQuery, setSearchQuery] = useState('');
	const [refreshing, setRefreshing] = useState(false);
	const [isCollectionModalVisible, setIsCollectionModalVisible] =
		useState(false);

	const {
		data: collections = [],
		refetch,
		isLoading: collectionsLoading,
		error: collectionsError,
	} = useGetAllCollections(user?.uid || '');

	const displayName =
		profile?.displayName || user?.email?.split('@')[0] || 'Friend';
	const greeting = getGreeting();

	// Filter collections based on search query
	const filteredCollections = useMemo(() => {
		if (!searchQuery.trim()) return collections;
		const query = searchQuery.toLowerCase();
		return collections.filter((collection) =>
			collection.name.toLowerCase().includes(query),
		);
	}, [collections, searchQuery]);

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

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	return (
		<View style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}>
				<View style={styles.header}>
					<View style={styles.greetingContainer}>
						<Text variant="h4" style={styles.greeting}>
							{greeting},
						</Text>
						<Text variant="h2" color={colors.secondary.dark}>
							{displayName}
						</Text>
					</View>

					<TouchableOpacity
						style={styles.avatarContainer}
						onPress={() => navigation.navigate('ProfileTab')}>
						<View style={styles.avatar}>
							{profile?.avatarUrl ? (
								<RNImage
									source={{ uri: profile.avatarUrl }}
									style={styles.avatar}
								/>
							) : (
								<Text style={styles.avatarText}>
									{displayName.charAt(0).toUpperCase()}
								</Text>
							)}
						</View>
					</TouchableOpacity>
				</View>

				<SearchBar
					variant="filled"
					placeholder="Search collections..."
					value={searchQuery}
					onChangeText={setSearchQuery}
					onClear={() => setSearchQuery('')}
					containerStyle={styles.searchBar}
				/>

				<Card style={styles.section}>
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
					) : filteredCollections.length === 0 ? (
						<Text variant="body" color={colors.text.secondary}>
							{searchQuery
								? 'No collections match your search'
								: 'No collections yet. Start creating entries!'}
						</Text>
					) : (
						<View style={styles.collectionsGrid}>
							{filteredCollections.map((collection) => {
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
									strokeWidth={2.5}
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
				</Card>

				<Card variant="filled" padding="lg" style={styles.tipCard}>
					<Text variant="h6" style={styles.tipTitle}>
						<LightBulbOn
							width={24}
							height={24}
							color={colors.accent.gold}
							strokeWidth={3}
						/>{' '}
						Quick Tip
					</Text>
					<Text variant="body" color={colors.text.secondary}>
						Collections help organize your spills by topics. Choose one to get
						started or create your own!
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
		backgroundColor: colors.background.secondary,
	},
	scrollContent: {
		paddingBottom: spacing.xl,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.lg,
		paddingBottom: spacing.lg,
		backgroundColor: colors.accent.cream,
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
		marginHorizontal: spacing.md,
		marginBottom: spacing.lg,
		marginTop: spacing.md,
		backgroundColor: colors.background.tertiary,
	},
	section: {
		paddingHorizontal: spacing.md,
		marginBottom: spacing.sm,
		marginHorizontal: spacing.md,
	},
	sectionTitle: {
		marginBottom: spacing.sm,
		alignSelf: 'center',
	},
	jumpRightInTitle: {
		marginTop: spacing.xs,
		marginBottom: spacing.sm,
		alignSelf: 'center',
	},
	collectionsGrid: {
		flexDirection: 'row',
		justifyContent: 'center',
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
		marginTop: spacing.lg,
		marginHorizontal: spacing.lg,
		borderColor: colors.accent.gold,
		borderWidth: 3,
		borderRadius: 12,
		borderStyle: 'dashed',
	},
	tipTitle: {
		marginBottom: spacing.sm,
	},
});
