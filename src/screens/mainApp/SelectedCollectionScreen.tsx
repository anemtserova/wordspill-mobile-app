import React, { useState, useMemo } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	Text,
	Button,
	EntrySummaryCard,
	ColorScreenHeader,
	SearchBar,
} from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useGetAllCollections } from '../../api/collections';
import { useGetEntriesByCollection } from '../../api/entries/queries';
import { deleteEntry } from '../../api/firebase/firestore';
import { getCollectionIcon } from '../../utils/collectionIcons';
import { Plus } from 'iconoir-react-native';

type Props = NativeStackScreenProps<any, 'Collections'>;

export const SelectedCollectionScreen = ({ route, navigation }: Props) => {
	const { collectionId } = route.params || {};
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const insets = useSafeAreaInsets();
	const [searchQuery, setSearchQuery] = useState('');

	const { data: collections = [] } = useGetAllCollections(user?.uid || '');
	const collection = collections.find((c) => c.id === collectionId);

	const {
		data: entries = [],
		isLoading: entriesLoading,
		error: entriesError,
	} = useGetEntriesByCollection(user?.uid || '', collectionId);

	const filteredEntries = useMemo(() => {
		if (!searchQuery.trim()) return entries;
		const query = searchQuery.toLowerCase();
		return entries.filter(
			(entry: any) =>
				entry.title?.toLowerCase().includes(query) ||
				entry.content?.toLowerCase().includes(query) ||
				entry.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
		);
	}, [entries, searchQuery]);

	const deleteEntryMutation = useMutation({
		mutationFn: async (entryId: string) => {
			if (!user?.uid) throw new Error('User not authenticated');
			return await deleteEntry(user.uid, entryId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['entries', user?.uid] });
			queryClient.invalidateQueries({
				queryKey: ['entries', user?.uid, 'collection', collectionId],
			});
		},
	});

	const handleAddEntry = () => {
		navigation.navigate('Add Entry', { collectionId });
	};

	const handleDeleteEntry = (entryId: string, entryTitle: string) => {
		Alert.alert(
			'Delete Entry',
			`Are you sure you want to delete "${entryTitle}"? This action cannot be undone.`,
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {
						deleteEntryMutation.mutate(entryId);
					},
				},
			],
		);
	};

	if (!collection) {
		return (
			<View style={styles.container}>
				<Text variant="body" color={colors.text.secondary}>
					Collection not found
				</Text>
			</View>
		);
	}

	const IconComponent = getCollectionIcon(collection.iconName);

	return (
		<View style={styles.container}>
			<ColorScreenHeader
				title={collection.name}
				subtitle={`${filteredEntries.length} ${filteredEntries.length === 1 ? 'spill' : 'spills'}`}
				icon={
					<IconComponent
						width={32}
						height={32}
						color={colors.neutral.white}
						strokeWidth={2}
					/>
				}
				backgroundColor={collection.color || colors.primary.light}
				onBackPress={() => navigation.goBack()}
			/>

			<SearchBar
				variant="filled"
				placeholder="Search spills by title, content, or tags..."
				value={searchQuery}
				onChangeText={setSearchQuery}
				onClear={() => setSearchQuery('')}
				containerStyle={styles.searchBar}
			/>

			<ScrollView
				contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 }]}
				showsVerticalScrollIndicator={false}>
				{entriesLoading ? (
					<View style={styles.centerContent}>
						<Text variant="body" color={colors.text.secondary}>
							Loading spills...
						</Text>
					</View>
				) : entriesError ? (
					<View style={styles.centerContent}>
						<Text variant="body" color={colors.semantic.error}>
							Error loading spills
						</Text>
					</View>
				) : filteredEntries.length === 0 ? (
					<View style={styles.centerContent}>
						<Text variant="h4" style={styles.emptyTitle}>
							{searchQuery ? 'No Spills Found' : 'No Spills Yet'}
						</Text>
						<Text
							variant="body"
							color={colors.text.secondary}
							style={styles.emptyText}>
							{searchQuery
								? 'No spills match your search'
								: 'No spills yet in this collection'}
						</Text>
						{!searchQuery && (
							<Button
								onPress={handleAddEntry}
								variant="primary"
								style={styles.firstEntryButton}>
								Add Your First Spill {''}
							</Button>
						)}
					</View>
				) : (
					<View style={styles.entriesContainer}>
						{filteredEntries.map((entry) => (
							<EntrySummaryCard
								key={entry.id}
								entry={entry}
								onPress={() =>
									navigation.navigate('Entry Details', { entryId: entry.id })
								}
								onDelete={() => handleDeleteEntry(entry.id, entry.title)}
								onTagPress={(selectedTag) =>
									navigation.navigate('Entries By Tag', { tag: selectedTag })
								}
							/>
						))}
					</View>
				)}
			</ScrollView>

			<TouchableOpacity
				style={[styles.fab, { bottom: spacing.lg + insets.bottom }]}
				onPress={handleAddEntry}>
				<Plus
					width={24}
					height={24}
					color={colors.neutral.white}
					strokeWidth={2.5}
				/>
			</TouchableOpacity>
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
	scrollContent: {
		padding: spacing.lg,
	},
	centerContent: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: spacing['4xl'],
	},
	emptyTitle: {
		marginBottom: spacing.md,
		textAlign: 'center',
	},
	emptyText: {
		textAlign: 'center',
		marginBottom: spacing.lg,
	},
	firstEntryButton: {
		marginTop: spacing.md,
	},
	entriesContainer: {
		gap: spacing.md,
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
