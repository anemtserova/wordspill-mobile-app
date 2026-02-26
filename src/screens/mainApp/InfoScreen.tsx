import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text, IconStyled } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';
import {
	BookStack,
	Page,
	Search,
	Plus,
	EditPencil,
	Gift,
	Spark,
	Sparks,
} from 'iconoir-react-native';
import { Hashtag } from 'iconoir-react-native/regular';

export const InfoScreen = ({ navigation }: { navigation: any }) => {
	return (
		<View style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<Text variant="h1" style={styles.title}>
						Welcome to Wordspill
					</Text>
					<Text
						variant="body"
						color={colors.text.secondary}
						style={styles.subtitle}>
						Your personal writing companion
					</Text>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<IconStyled
							icon={BookStack}
							color={colors.secondary.contrast}
							width={24}
							height={24}
						/>
						<Text variant="h3" style={styles.sectionTitle}>
							What is Wordspill?
						</Text>
					</View>
					<Text
						variant="body"
						color={colors.text.secondary}
						style={styles.sectionText}>
						Wordspill is your personal writing space where thoughts flow freely.
						Capture your daily reflections, craft poetry and fiction, document
						your travels, record meaningful words and discoveries, or simply
						express your personal thoughts. It's your canvas for all forms of
						written expression.
					</Text>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						{/* <View style={styles.iconContainer}>
                <Plus
                  width={24}
                  height={24}
                  color={colors.secondary.contrast}
                  strokeWidth={2}
                />
              </View> */}
						<IconStyled
							icon={Plus}
							color={colors.secondary.contrast}
							width={24}
							height={24}
						/>
						<Text variant="h3" style={styles.sectionTitle}>
							Create Entries
						</Text>
					</View>
					<Text
						variant="body"
						color={colors.text.secondary}
						style={styles.sectionText}>
						Write freely in your personal space. Pen diary entries, compose
						poems, draft stories, jot down travel experiences, capture
						interesting words you discover, or record personal thoughts and
						reflections. Add images to enrich your entries and preserve
						memories.
					</Text>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						{/* <View style={styles.iconContainer}>
							<BookStack
								width={24}
								height={24}
								color={colors.secondary.contrast}
								strokeWidth={2}
							/>
						</View> */}
						<IconStyled
							icon={BookStack}
							color={colors.secondary.contrast}
							width={24}
							height={24}
						/>
						<Text variant="h3" style={styles.sectionTitle}>
							Organize with Collections
						</Text>
					</View>
					<Text
						variant="body"
						color={colors.text.secondary}
						style={styles.sectionText}>
						Keep your writing organized by creating collections. Separate your
						daily journal from your poetry, group travel stories together, or
						create collections for fiction projects, vocabulary discoveries, or
						personal reflections. Your collections, your way. Tap on a
						collection to see all entries within it.
					</Text>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						{/* <View style={styles.iconContainer}>
							<Hashtag
								width={24}
								height={24}
								color={colors.secondary.contrast}
								strokeWidth={2}
							/>
						</View> */}
						<IconStyled
							icon={Hashtag}
							color={colors.secondary.contrast}
							width={24}
							height={24}
						/>
						<Text variant="h3" style={styles.sectionTitle}>
							Tag for Quick Access
						</Text>
					</View>
					<Text
						variant="body"
						color={colors.text.secondary}
						style={styles.sectionText}>
						Add tags to organize and connect your writing. Tag entries by mood,
						theme, location, or any category that matters to you. Tags help you
						discover patterns in your writing and quickly find related pieces
						across different collections. Tap on a tag to see all entries
						associated with it.
					</Text>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						{/* <View style={styles.iconContainer}>
							<Search
								width={24}
								height={24}
								color={colors.secondary.contrast}
								strokeWidth={2}
							/>
						</View> */}
						<IconStyled
							icon={Search}
							color={colors.secondary.contrast}
							width={24}
							height={24}
						/>
						<Text variant="h3" style={styles.sectionTitle}>
							Search & Review
						</Text>
					</View>
					<Text
						variant="body"
						color={colors.text.secondary}
						style={styles.sectionText}>
						Revisit your writing journey anytime. Search through your entries,
						browse collections, and reflect on your growth as a writer. Your
						words are preserved and easily accessible whenever inspiration
						strikes or memories call.
					</Text>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<IconStyled
							icon={EditPencil}
							color={colors.secondary.contrast}
							width={24}
							height={24}
						/>
						<Text variant="h3" style={styles.sectionTitle}>
							Update & Refine
						</Text>
					</View>
					<Text
						variant="body"
						color={colors.text.secondary}
						style={styles.sectionText}>
						Your writing evolves, and so can your entries. Edit and refine your
						work, continue unfinished pieces, or add new insights to previous
						reflections. Your creative space adapts to your needs.
					</Text>
				</View>

				<View style={[styles.section, styles.lastSection]}>
					<View style={styles.purposeBox}>
						<View style={styles.sectionHeader}>
							{/* <View style={[styles.iconContainer, { width: 35, height: 35 }]}>
								<Sparks
									width={20}
									height={20}
									color={colors.secondary.contrast}
									strokeWidth={2}
								/>
							</View> */}
							<IconStyled
								icon={Sparks}
								color={colors.secondary.contrast}
								width={20}
								height={20}
								strokeWidth={2}
								containerSize={35}
								backgroundColor={colors.secondary.light}
								marginRight={spacing.md}
							/>
							<Text variant="h3" style={styles.purposeTitle}>
								Perfect For
							</Text>
						</View>
						<View style={styles.purposeList}>
							<Text variant="body" style={styles.purposeItem}>
								• Daily journaling and personal reflection
							</Text>
							<Text variant="body" style={styles.purposeItem}>
								• Writing poetry and fiction
							</Text>
							<Text variant="body" style={styles.purposeItem}>
								• Travel journals and adventure logs
							</Text>
							<Text variant="body" style={styles.purposeItem}>
								• Capturing new words and discoveries
							</Text>
							<Text variant="body" style={styles.purposeItem}>
								• Recording thoughts and inspirations
							</Text>
							<Text variant="body" style={styles.purposeItem}>
								• Anyone who loves to write
							</Text>
						</View>
					</View>
				</View>

				<View style={styles.footer}>
					{/* <View style={styles.iconContainer}>
						<Gift
							width={24}
							height={24}
							color={colors.secondary.contrast}
							strokeWidth={2}
						/>
					</View> */}
					<IconStyled
						icon={Gift}
						color={colors.secondary.contrast}
						width={24}
						height={24}
						strokeWidth={2}
					/>
					<Text
						variant="h4"
						style={[
							styles.sectionTitle,
							{ marginBottom: spacing.sm, marginTop: spacing.md },
						]}>
						Start Your Writing Journey
					</Text>
					<Text
						variant="body"
						color={colors.text.tertiary}
						style={styles.footerText}>
						Gift yourself a moment of reflection and let your words flow!
					</Text>
				</View>
				<Button
					variant="ghost"
					onPress={() => navigation.goBack()}
					style={{
						backgroundColor: colors.neutral.gray200,
						width: '50%',
						alignSelf: 'center',
					}}>
					GO BACK
				</Button>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	scrollContent: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.xl,
		paddingBottom: spacing['2xl'],
	},
	header: {
		marginBottom: spacing.xl,
		alignItems: 'center',
	},
	title: {
		marginBottom: spacing.sm,
		textAlign: 'center',
	},
	subtitle: {
		textAlign: 'center',
		fontSize: typography.fontSize.lg,
	},
	section: {
		marginBottom: spacing.xl,
	},
	lastSection: {
		marginBottom: spacing.lg,
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: spacing.md,
	},
	sectionTitle: {
		flex: 1,
		color: colors.accent.teal,
	},
	sectionText: {
		lineHeight: 24,
		paddingLeft: 56, // Align with text after icon
	},
	purposeBox: {
		backgroundColor: colors.background.secondary,
		borderRadius: 12,
		padding: spacing.lg,
		borderWidth: 1,
		borderColor: colors.neutral.gray200,
	},
	purposeTitle: {
		color: colors.primary.main,
	},
	purposeList: {
		gap: spacing.sm,
	},
	purposeItem: {
		color: colors.text.secondary,
		lineHeight: 24,
	},
	footer: {
		marginTop: spacing.lg,
		alignItems: 'center',
		paddingVertical: spacing.lg,
	},
	footerText: {
		textAlign: 'center',
		fontStyle: 'italic',
	},
});
