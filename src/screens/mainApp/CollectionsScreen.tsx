import React, { useState, useMemo } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
	Text,
	Button,
	CollectionCard,
	AddCollectionModal,
	ColorScreenHeader,
	SearchBar,
} from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import {
	useGetAllCollections,
	useDeleteCollection,
} from '../../api/collections';
import { useGetEntriesByCollection } from '../../api/entries';
import { BookStack, NavArrowLeft, Plus } from 'iconoir-react-native';
import { EditCollectionModal } from '../../components/ui/EditCollectionModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CollectionsScreen = ({
	navigation,
}: {
	navigation: NativeStackNavigationProp<any>;
}) => {
	const { user } = useAuth();
	const [isAddModalVisible, setIsAddModalVisible] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
	const [selectedCollection, setSelectedCollection] = useState<any>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const insets = useSafeAreaInsets();

	const {
		data: collections = [],
		isLoading,
		refetch,
	} = useGetAllCollections(user?.uid || '');
	const deleteCollectionMutation = useDeleteCollection(user?.uid || '');

	const filteredCollections = useMemo(() => {
		if (!searchQuery.trim()) return collections;
		const query = searchQuery.toLowerCase();
		return collections.filter((collection) =>
			collection.name.toLowerCase().includes(query),
		);
	}, [collections, searchQuery]);

	const onRefresh = async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	};

	const handleCollectionPress = (collectionId: string) => {
		navigation.navigate('Entries', {
			screen: 'Collections',
			params: { collectionId },
			// options: { pop: true },
		});
	};

	const handleEditCollection = (collectionId: string) => {
		const collection = collections.find((col) => col.id === collectionId);
		setSelectedCollection(collection);
		setIsUpdateModalVisible(true);
	};

	const handleDeleteCollection = async (collectionId: string) => {
		try {
			await deleteCollectionMutation.mutateAsync(collectionId);
		} catch (error) {
			console.error('Failed to delete collection:', error);
		}
	};

	// Helper component to fetch entry count for each collection
	const CollectionCardWithEntryCount = ({
		collection,
	}: {
		collection: any;
	}) => {
		const { data: entries = [] } = useGetEntriesByCollection(
			user?.uid || '',
			collection.id,
		);

		return (
			<CollectionCard
				collection={collection}
				entryCount={entries.length}
				onPress={() => handleCollectionPress(collection.id)}
				onEdit={() => handleEditCollection(collection.id)}
				onDelete={() => handleDeleteCollection(collection.id)}
			/>
		);
	};

	return (
		<View style={styles.container}>
			<ColorScreenHeader
				title="My Collections"
				onBackPress={() => navigation.goBack()}
				icon={
					<BookStack
						width={24}
						height={24}
						color={colors.background.secondary}
						strokeWidth={2}
					/>
				}
				style={{
					backgroundColor: colors.accent.teal,
					paddingBottom: spacing.md,
					paddingTop: spacing.md,
				}}
			/>

			<SearchBar
				variant="filled"
				placeholder="Search collections..."
				value={searchQuery}
				onChangeText={setSearchQuery}
				onClear={() => setSearchQuery('')}
				containerStyle={styles.searchBar}
			/>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}>
				{isLoading ? (
					<View style={styles.emptyContainer}>
						<Text variant="body" color={colors.text.secondary}>
							Loading collections...
						</Text>
					</View>
				) : filteredCollections.length === 0 ? (
					<View style={styles.emptyContainer}>
						<Text variant="h4" style={styles.emptyTitle}>
							{searchQuery ? 'No Collections Found' : 'No Collections Yet'}
						</Text>
						<Text
							variant="body"
							color={colors.text.secondary}
							style={styles.emptyText}>
							{searchQuery
								? 'No collections match your search'
								: 'Create your first collection to organize your spills'}
						</Text>
						{!searchQuery && (
							<Button
								variant="primary"
								onPress={() => setIsAddModalVisible(true)}
								style={styles.createButton}>
								Create Collection
							</Button>
						)}
					</View>
				) : (
					<View style={styles.collectionsContainer}>
						{filteredCollections.map((collection) => (
							<CollectionCardWithEntryCount
								key={collection.id}
								collection={collection}
							/>
						))}
					</View>
				)}
			</ScrollView>

			<TouchableOpacity
				style={[styles.fab, { bottom: spacing.lg + insets.bottom }]}
				onPress={() => setIsAddModalVisible(true)}>
				<Plus
					width={24}
					height={24}
					color={colors.neutral.white}
					strokeWidth={2.5}
				/>
			</TouchableOpacity>

			<AddCollectionModal
				visible={isAddModalVisible}
				onClose={() => setIsAddModalVisible(false)}
				userId={user?.uid || ''}
			/>

			<EditCollectionModal
				visible={isUpdateModalVisible}
				onClose={() => {
					setIsUpdateModalVisible(false);
					setSelectedCollection(null);
				}}
				userId={user?.uid || ''}
				collection={selectedCollection}
				selectedCollectionName={selectedCollection?.name || ''}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.secondary,
	},
	searchBar: {
		marginHorizontal: spacing.lg,
		marginTop: spacing.md,
		paddingVertical: spacing.md,
		backgroundColor: colors.background.primary,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.lg,
		paddingBottom: spacing.lg,
		backgroundColor: colors.background.primary,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.light,
		borderBottomLeftRadius: spacing.lg,
		borderBottomRightRadius: spacing.lg,
	},
	title: {
		flex: 1,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.secondary.light,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: spacing.md,
	},
	addButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: colors.secondary.light,
		justifyContent: 'center',
		alignItems: 'center',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: spacing.lg,
		paddingBottom: 80,
	},
	collectionsContainer: {
		paddingBottom: spacing.xl,
	},
	emptyContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.xl,
		paddingTop: spacing['4xl'],
	},
	emptyTitle: {
		marginBottom: spacing.md,
		textAlign: 'center',
	},
	emptyText: {
		textAlign: 'center',
		marginBottom: spacing.xl,
	},
	createButton: {
		minWidth: 200,
	},
	fab: {
		position: 'absolute',
		right: spacing.lg,
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
