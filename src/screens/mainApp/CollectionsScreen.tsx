import React, { useState } from 'react';
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
} from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import {
	useGetAllCollections,
	useDeleteCollection,
} from '../../api/collections';
import { useGetEntriesByCollection } from '../../api/entries';
import { Plus } from 'iconoir-react-native';
import { EditCollectionModal } from '../../components/ui/EditCollectionModal';

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

	const {
		data: collections = [],
		isLoading,
		refetch,
	} = useGetAllCollections(user?.uid || '');
	const deleteCollectionMutation = useDeleteCollection(user?.uid || '');

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
			<View style={styles.header}>
				<Text variant="h2" style={styles.title}>
					My Collections
				</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => setIsAddModalVisible(true)}>
					<Plus
						width={24}
						height={24}
						color={colors.primary.main}
						strokeWidth={2}
					/>
				</TouchableOpacity>
			</View>

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
				) : collections.length === 0 ? (
					<View style={styles.emptyContainer}>
						<Text variant="h4" style={styles.emptyTitle}>
							No Collections Yet
						</Text>
						<Text
							variant="body"
							color={colors.text.secondary}
							style={styles.emptyText}>
							Create your first collection to organize your entries
						</Text>
						<Button
							variant="primary"
							onPress={() => setIsAddModalVisible(true)}
							style={styles.createButton}>
							Create Collection
						</Button>
					</View>
				) : (
					<View style={styles.collectionsContainer}>
						{collections.map((collection) => (
							<CollectionCardWithEntryCount
								key={collection.id}
								collection={collection}
							/>
						))}
					</View>
				)}
			</ScrollView>

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
		backgroundColor: colors.background.primary,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: spacing.lg,
		paddingTop: spacing['2xl'],
		paddingBottom: spacing.lg,
		backgroundColor: colors.background.secondary,
		borderBottomWidth: 1,
		borderBottomColor: colors.border.light,
	},
	title: {
		flex: 1,
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
	},
	collectionsContainer: {
		paddingBottom: spacing.xl,
	},
	emptyContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing.xl,
		paddingTop: spacing['5xl'],
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
});
