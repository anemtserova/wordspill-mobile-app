import React from 'react';
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
import { Text, Button, EntrySummaryCard } from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useGetAllCollections } from '../../api/collections';
import { useGetEntriesByCollection } from '../../api/entries/queries';
import { deleteEntry } from '../../api/firebase/firestore';
import { getCollectionIcon } from '../../utils/collectionIcons';
import { NavArrowLeft } from 'iconoir-react-native';

type Props = NativeStackScreenProps<any, 'Collections'>;

export const SelectedCollectionScreen = ({ route, navigation }: Props) => {
	const { collectionId } = route.params || {};
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const insets = useSafeAreaInsets();

	const { data: collections = [] } = useGetAllCollections(user?.uid || '');
	const collection = collections.find((c) => c.id === collectionId);

	const {
		data: entries = [],
		isLoading: entriesLoading,
		error: entriesError,
	} = useGetEntriesByCollection(user?.uid || '', collectionId);

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
			<View
				style={[
					styles.header,
					{
						backgroundColor: collection.color || colors.primary.light,
					},
				]}>
				<View style={styles.headerTop}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}>
						<NavArrowLeft
							width={24}
							height={24}
							color={colors.neutral.white}
							strokeWidth={2.5}
						/>
					</TouchableOpacity>

					<IconComponent
						width={32}
						height={32}
						color={colors.neutral.white}
						strokeWidth={2}
					/>

					<Text
						variant="h3"
						color={colors.neutral.white}
						style={styles.headerTitle}>
						{collection.name}
					</Text>
				</View>

				<Text
					variant="label"
					color={colors.neutral.white}
					style={styles.entryCount}>
					{entries.length} {entries.length === 1 ? 'entry' : 'entries'}
				</Text>
			</View>

			<ScrollView
				contentContainerStyle={[
					styles.scrollContent,
					{ paddingBottom: 60 + insets.bottom + spacing.lg },
				]}
				showsVerticalScrollIndicator={false}>
				{entriesLoading ? (
					<View style={styles.centerContent}>
						<Text variant="body" color={colors.text.secondary}>
							Loading entries...
						</Text>
					</View>
				) : entriesError ? (
					<View style={styles.centerContent}>
						<Text variant="body" color={colors.semantic.error}>
							Error loading entries
						</Text>
					</View>
				) : entries.length === 0 ? (
					<View style={styles.centerContent}>
						<Text
							variant="body"
							color={colors.text.secondary}
							style={styles.emptyText}>
							No entries yet in this collection
						</Text>
						<Button
							onPress={handleAddEntry}
							variant="primary"
							style={styles.firstEntryButton}>
							Add Your First Entry {''}
						</Button>
					</View>
				) : (
					<View style={styles.entriesContainer}>
						{entries.map((entry) => (
							<EntrySummaryCard
								key={entry.id}
								entry={entry}
								onPress={() =>
									navigation.navigate('Entry Details', { entryId: entry.id })
								}
								onDelete={() => handleDeleteEntry(entry.id, entry.title)}
							/>
						))}
					</View>
				)}
			</ScrollView>

			{entries.length > 0 && (
				<TouchableOpacity
					style={[styles.fab, { bottom: 60 + insets.bottom + spacing.lg }]}
					onPress={handleAddEntry}>
					<Text variant="h2" color={colors.neutral.white}>
						+
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.secondary,
	},
	header: {
		paddingBottom: spacing.lg,
		paddingHorizontal: spacing.lg,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
	},
	headerTop: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		marginBottom: spacing.xs,
		paddingTop: spacing.lg,
	},
	backButton: {
		padding: spacing.xs,
		marginRight: spacing.xs,
	},
	headerTitle: {
		flex: 1,
	},
	entryCount: {
		marginLeft: spacing['2xl'] + spacing.sm,
		opacity: 0.85,
	},
	scrollContent: {
		padding: spacing.lg,
	},
	centerContent: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: spacing['4xl'],
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
