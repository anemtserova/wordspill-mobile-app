import React from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Alert,
	Image as RNImage,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
	Text,
	Button,
	Card,
	ScreenHeader,
	ColorScreenHeader,
} from '../../components/ui';
import { colors, spacing, borderRadius } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import {
	User,
	Settings,
	EditPencil,
	LogOut,
	Book,
	NavArrowRight,
	ProfileCircle,
} from 'iconoir-react-native';

interface ProfileScreenProps {
	navigation: NativeStackNavigationProp<any>;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
	const { user, profile, logout } = useAuth();

	const handleLogout = () => {
		Alert.alert('Logout', 'Are you sure you want to logout?', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Logout',
				style: 'destructive',
				onPress: async () => {
					try {
						await logout();
					} catch (error) {
						Alert.alert('Error', 'Failed to logout. Please try again.');
					}
				},
			},
		]);
	};

	const handleEditProfile = () => {
		navigation.navigate('Edit Profile');
	};

	const handleSettings = () => {
		navigation.navigate('Settings');
	};

	const displayName =
		profile?.displayName || user?.email?.split('@')[0] || 'User';
	const email = user?.email || '';
	const avatarUrl = profile?.avatarUrl;

	const getInitials = () => {
		if (profile?.displayName) {
			const names = profile.displayName.split(' ');
			return names
				.map((n: string) => n[0])
				.join('')
				.toUpperCase()
				.slice(0, 2);
		}
		return displayName[0]?.toUpperCase() || 'U';
	};

	return (
		<View style={styles.container}>
			<ColorScreenHeader
				icon={
					<ProfileCircle
						width={24}
						height={24}
						color={colors.background.secondary}
					/>
				}
				title="My Profile"
				onBackPress={() => navigation.goBack()}
				style={{
					backgroundColor: colors.accent.peach,
					paddingBottom: spacing.md,
					paddingTop: spacing.md,
				}}
			/>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				<Card variant="elevated" padding="lg" style={styles.userCard}>
					<View style={styles.userInfo}>
						{avatarUrl ? (
							<RNImage source={{ uri: avatarUrl }} style={styles.avatar} />
						) : (
							<View style={styles.avatarPlaceholder}>
								<Text variant="h3" color={colors.neutral.white}>
									{getInitials()}
								</Text>
							</View>
						)}
						<View style={styles.userDetails}>
							<Text variant="h3" style={styles.userName}>
								{displayName}
							</Text>
							<Text variant="body" color={colors.text.secondary}>
								{email}
							</Text>
						</View>
					</View>
					<Button
						variant="outline"
						size="sm"
						onPress={handleEditProfile}
						style={styles.editButton}>
						<EditPencil
							width={18}
							height={18}
							color={colors.text.primary}
							strokeWidth={2}
						/>
						<Text variant="bodySmall" style={styles.editButtonText}>
							Edit Profile
						</Text>
					</Button>
				</Card>

				<View style={styles.section}>
					<Text variant="label" style={styles.sectionTitle}>
						ACCOUNT
					</Text>

					<Card variant="outlined" padding="xs">
						<TouchableOpacity
							style={styles.menuItem}
							onPress={handleEditProfile}
							activeOpacity={0.7}>
							<View style={styles.menuItemLeft}>
								<View style={styles.iconContainer}>
									<User
										width={20}
										height={20}
										color={colors.primary.contrast}
										strokeWidth={2}
									/>
								</View>
								<Text variant="body">Edit Profile</Text>
							</View>
							<NavArrowRight
								width={20}
								height={20}
								color={colors.text.secondary}
								strokeWidth={2}
							/>
						</TouchableOpacity>

						<View style={styles.divider} />

						<TouchableOpacity
							style={styles.menuItem}
							onPress={handleSettings}
							activeOpacity={0.7}>
							<View style={styles.menuItemLeft}>
								<View style={styles.iconContainer}>
									<Settings
										width={20}
										height={20}
										color={colors.primary.contrast}
										strokeWidth={2}
									/>
								</View>
								<Text variant="body">Settings</Text>
							</View>
							<NavArrowRight
								width={20}
								height={20}
								color={colors.text.secondary}
								strokeWidth={2}
							/>
						</TouchableOpacity>
					</Card>
				</View>

				<View style={styles.section}>
					<Text variant="label" style={styles.sectionTitle}>
						ABOUT
					</Text>

					<Card variant="outlined" padding="md">
						<View style={styles.infoRow}>
							<Text variant="body" color={colors.text.secondary}>
								Version
							</Text>
							<Text variant="body">1.0.0</Text>
						</View>
					</Card>
				</View>

				<Button
					variant="outline"
					onPress={handleLogout}
					style={styles.logoutButton}>
					<LogOut
						width={20}
						height={20}
						color={colors.semantic.error}
						strokeWidth={2}
					/>
					<Text variant="body" color={colors.semantic.error}>
						Logout
					</Text>
				</Button>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.secondary,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: spacing.lg,
		gap: spacing.lg,
	},
	userCard: {
		alignItems: 'center',
	},
	userInfo: {
		alignItems: 'center',
		marginBottom: spacing.lg,
		width: '100%',
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: spacing.md,
	},
	avatarPlaceholder: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: colors.accent.peach,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: spacing.md,
	},
	userDetails: {
		alignItems: 'center',
		gap: spacing.xs,
	},
	userName: {
		textAlign: 'center',
	},
	editButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
		width: '100%',
	},
	editButtonText: {
		marginLeft: spacing.xs,
	},
	section: {
		gap: spacing.sm,
	},
	sectionTitle: {
		marginBottom: spacing.xs,
		color: colors.text.secondary,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: spacing.md,
	},
	menuItemLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.md,
	},
	iconContainer: {
		width: 36,
		height: 36,
		borderRadius: borderRadius.md,
		backgroundColor: colors.accent.peach,
		justifyContent: 'center',
		alignItems: 'center',
	},
	divider: {
		height: 1,
		backgroundColor: colors.border.light,
		marginHorizontal: spacing.md,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
		borderColor: colors.semantic.error,
		marginTop: spacing.md,
	},
});
