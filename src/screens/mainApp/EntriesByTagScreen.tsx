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
import {
	Text,
	Button,
	EntrySummaryCard,
	ColoredScreenHeader,
} from '../../components/ui';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useGetEntriesByTag } from '../../api/entries/queries';
import { deleteEntry } from '../../api/firebase/firestore';
import { Hashtag } from 'iconoir-react-native';

type Props = NativeStackScreenProps<any, 'Entries By Tag'>;

export const EntriesByTagScreen = ({ route, navigation }: Props) => {
	const { tag } = route.params || {};
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const insets = useSafeAreaInsets();

	const {
		data: entries = [],
		isLoading: entriesLoading,
		error: entriesError,
	} = useGetEntriesByTag(user?.uid || '', tag || '');

	// Debug logging
	React.useEffect(() => {
		if (entriesError) {
			console.error('EntriesByTagScreen error:', entriesError);
			console.log('userId:', user?.uid);
			console.log('tag:', tag);
		}
	}, [entriesError, user?.uid, tag]);

	const deleteEntryMutation = useMutation({
		mutationFn: async (entryId: string) => {
			if (!user?.uid) throw new Error('User not authenticated');
			return await deleteEntry(user.uid, entryId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['entries', user?.uid] });
			queryClient.invalidateQueries({
				queryKey: ['entries', user?.uid, 'tag', tag],
			});
		},
	});

	const handleAddEntry = () => {
		navigation.navigate('Add Entry');
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

	if (!tag) {
		return (
			<View style={styles.container}>
				<Text variant="body" color={colors.text.secondary}>
					Tag not found
				</Text>
			</View>
		);
	}

	if (!user?.uid) {
		return (
			<View style={styles.container}>
				<ColoredScreenHeader
					title={tag}
					subtitle="0 entries"
					icon={
						<Hashtag
							width={32}
							height={32}
							color={colors.neutral.white}
							strokeWidth={2}
						/>
					}
					backgroundColor={colors.accent.gold}
					onBackPress={() => navigation.goBack()}
				/>
				<View style={styles.centerContent}>
					<Text variant="body" color={colors.text.secondary}>
						Loading user data...
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ColoredScreenHeader
				title={tag}
				subtitle={`${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`}
				icon={
					<Hashtag
						width={32}
						height={32}
						color={colors.neutral.white}
						strokeWidth={2}
					/>
				}
				backgroundColor={colors.accent.gold}
				onBackPress={() => navigation.goBack()}
			/>

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
						<Text
							variant="caption"
							color={colors.text.secondary}
							style={{ marginTop: spacing.sm }}>
							{entriesError instanceof Error
								? entriesError.message
								: 'Unknown error'}
						</Text>
					</View>
				) : entries.length === 0 ? (
					<View style={styles.centerContent}>
						<Text
							variant="body"
							color={colors.text.secondary}
							style={styles.emptyText}>
							No entries with this tag yet
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
								onTagPress={(selectedTag) =>
									navigation.push('Entries By Tag', { tag: selectedTag })
								}
							/>
						))}
					</View>
				)}
			</ScrollView>

			{entries.length > 0 && (
				<TouchableOpacity
					style={[
						styles.addButton,
						{
							bottom: insets.bottom + spacing.lg,
						},
					]}
					onPress={handleAddEntry}>
					<Text variant="h4" color={colors.neutral.white}>
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
		backgroundColor: colors.background.primary,
	},
	scrollContent: {
		padding: spacing.lg,
		minHeight: '100%',
	},
	centerContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: spacing['4xl'],
		gap: spacing.lg,
	},
	emptyText: {
		textAlign: 'center',
		marginBottom: spacing.md,
	},
	firstEntryButton: {
		minWidth: 200,
	},
	entriesContainer: {
		gap: spacing.md,
	},
	addButton: {
		position: 'absolute',
		right: spacing.lg,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: colors.primary.main,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: colors.neutral.black,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
});
