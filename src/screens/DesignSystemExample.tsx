// Design System Usage Examples
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Input, TextArea, Card } from '../components/ui';
import { colors, spacing } from '../theme';

export const DesignSystemExample = () => {
	const [inputValue, setInputValue] = useState('');
	const [textAreaValue, setTextAreaValue] = useState('');

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
			</View>

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
});
