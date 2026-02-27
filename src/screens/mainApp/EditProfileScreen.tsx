import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	Alert,
	ActivityIndicator,
	Image as RNImage,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePickerExpo from 'expo-image-picker';
import { Camera, Xmark } from 'iconoir-react-native';
import { Text, Button, Card, ScreenHeader, Input } from '../../components/ui';
import { colors, spacing, borderRadius } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useUpdateUser } from '../../api/users/mutations';
import { uploadMedia } from '../../api/firebase/storage';
import { useGetUser } from '../../api/users';

interface EditProfileScreenProps {
	navigation: NativeStackNavigationProp<any>;
}

export const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
	const { user, profile } = useAuth();
	const updateUserMutation = useUpdateUser(user?.uid || '');
	const { data: updatedUser } = useGetUser(user?.uid || '');

	const [displayName, setDisplayName] = useState(
		profile?.displayName || user?.email?.split('@')[0] || '',
	);
	const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || null);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		if (profile) {
			setDisplayName(profile.displayName || user?.email?.split('@')[0] || '');
			setAvatarUrl(profile.avatarUrl || null);
		}
	}, [profile, user]);

	useEffect(() => {
		if (updatedUser) {
			setDisplayName(
				updatedUser.displayName || user?.email?.split('@')[0] || '',
			);
			setAvatarUrl(updatedUser.avatarUrl || null);
		}
	}, [updatedUser, user]);

	const handlePickImage = async () => {
		try {
			const { status } =
				await ImagePickerExpo.requestMediaLibraryPermissionsAsync();

			if (status !== 'granted') {
				Alert.alert(
					'Permission Required',
					'Please allow access to your photo library to change your profile picture.',
				);
				return;
			}

			const result = await ImagePickerExpo.launchImageLibraryAsync({
				mediaTypes: ['images'],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.8,
			});

			if (!result.canceled && result.assets[0]) {
				setIsUploading(true);
				try {
					const { url } = await uploadMedia(
						user?.uid || '',
						result.assets[0].uri,
						'image',
						'avatars',
					);
					setAvatarUrl(url);
				} catch (error) {
					Alert.alert('Error', 'Failed to upload image');
					console.error('Error uploading avatar:', error);
				} finally {
					setIsUploading(false);
				}
			}
		} catch (error) {
			Alert.alert('Error', 'Failed to pick image');
			console.error('Error picking image:', error);
			setIsUploading(false);
		}
	};

	const handleRemoveAvatar = () => {
		Alert.alert(
			'Remove Avatar',
			'Are you sure you want to remove your avatar?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Remove',
					style: 'destructive',
					onPress: () => setAvatarUrl(null),
				},
			],
		);
	};

	const handleSave = async () => {
		if (!displayName.trim()) {
			Alert.alert('Error', 'Please enter a display name');
			return;
		}

		try {
			await updateUserMutation.mutateAsync({
				displayName: displayName.trim(),
				avatarUrl: avatarUrl,
			});

			navigation.goBack();
		} catch (error) {
			Alert.alert('Error', 'Failed to update profile');
			console.error('Error updating profile:', error);
		}
	};

	const getInitials = () => {
		if (displayName) {
			const names = displayName.trim().split(' ');
			return names
				.map((n: string) => n[0])
				.join('')
				.toUpperCase()
				.slice(0, 2);
		}
		return 'U';
	};

	return (
		<View style={styles.container}>
			<ScreenHeader
				title="Edit Profile"
				onBackPress={() => navigation.goBack()}
			/>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				{/* Avatar Section */}
				<Card variant="elevated" padding="lg" style={styles.avatarCard}>
					<Text weight="bold" variant="label" style={styles.sectionLabel}>
						PROFILE PHOTO
					</Text>
					<View style={styles.avatarContainer}>
						<View style={styles.avatarWrapper}>
							{avatarUrl ? (
								<RNImage source={{ uri: avatarUrl }} style={styles.avatar} />
							) : (
								<View style={styles.avatarPlaceholder}>
									<Text weight="bold" variant="h2" color={colors.neutral.white}>
										{getInitials()}
									</Text>
								</View>
							)}
							{isUploading && (
								<View style={styles.uploadingOverlay}>
									<ActivityIndicator
										size="large"
										color={colors.neutral.white}
									/>
								</View>
							)}
						</View>
						<View style={styles.avatarActions}>
							<Button
								variant="accent"
								size="sm"
								onPress={handlePickImage}
								disabled={isUploading}
								style={styles.avatarButtonAdd}>
								<Camera
									width={18}
									height={18}
									color={colors.neutral.white}
									strokeWidth={2}
								/>
								<Text
									variant="bodySmall"
									color={colors.neutral.white}
									style={{ paddingLeft: spacing.xs }}>
									{avatarUrl ? 'Change Photo' : 'Add Photo'}
								</Text>
							</Button>
							{avatarUrl && !isUploading && (
								<Button
									variant="outline"
									size="sm"
									onPress={handleRemoveAvatar}
									style={styles.avatarButtonRemove}>
									<Text
										variant="bodySmall"
										style={{ color: colors.semantic.error }}>
										Remove
									</Text>
								</Button>
							)}
						</View>
					</View>
				</Card>

				{/* Display Name Section */}
				<Card variant="elevated" padding="lg" style={styles.nameCard}>
					<Text weight="bold" variant="label" style={styles.sectionLabel}>
						DISPLAY NAME
					</Text>
					<Input
						value={displayName}
						onChangeText={setDisplayName}
						placeholder="Enter your display name"
						autoCapitalize="words"
						maxLength={50}
					/>
					<Text
						variant="caption"
						color={colors.text.tertiary}
						style={styles.helperText}>
						This is how your name will appear throughout the app
					</Text>
				</Card>

				{/* Email Section (Read-only) */}
				<Card variant="elevated" padding="lg" style={styles.emailCard}>
					<Text weight="bold" variant="label" style={styles.sectionLabel}>
						EMAIL
					</Text>
					<View style={styles.emailContainer}>
						<Text variant="body" color={colors.text.secondary}>
							{user?.email || ''}
						</Text>
					</View>
					<Text
						variant="caption"
						color={colors.text.tertiary}
						style={styles.helperText}>
						Your email cannot be changed
					</Text>
				</Card>

				<Button
					variant="accent"
					onPress={handleSave}
					loading={updateUserMutation.isPending}
					disabled={updateUserMutation.isPending || isUploading}
					style={styles.saveButton}>
					Save Changes
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
		paddingBottom: spacing.xl,
	},
	avatarCard: {
		marginBottom: spacing.md,
	},
	nameCard: {
		marginBottom: spacing.md,
	},
	emailCard: {
		marginBottom: spacing.lg,
	},
	sectionLabel: {
		marginBottom: spacing.md,
		color: colors.text.secondary,
	},
	avatarContainer: {
		alignItems: 'center',
		gap: spacing.lg,
	},
	avatarWrapper: {
		position: 'relative',
	},
	avatar: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: colors.neutral.gray200,
	},
	avatarPlaceholder: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: colors.primary.main,
		alignItems: 'center',
		justifyContent: 'center',
	},
	uploadingOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderRadius: 60,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarActions: {
		flexDirection: 'row',
		gap: spacing.sm,
		width: '100%',
		justifyContent: 'center',
	},
	avatarButtonRemove: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
		borderColor: colors.accent.peach,
	},
	avatarButtonAdd: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
		backgroundColor: colors.accent.teal,
	},
	helperText: {
		marginTop: spacing.sm,
	},
	emailContainer: {
		padding: spacing.md,
		backgroundColor: colors.background.secondary,
		borderRadius: borderRadius.md,
		borderWidth: 1,
		borderColor: colors.border.light,
	},
	saveButton: {
		marginTop: spacing.md,
		backgroundColor: colors.accent.teal,
	},
});
