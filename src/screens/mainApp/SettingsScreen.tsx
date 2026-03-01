import { View, StyleSheet, Alert } from 'react-native';
import { ScreenHeader, Text, Button } from '../../components/ui';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '../../theme';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuth } from '../../contexts/AuthContext';
import { useDeactivateAccount } from '../../api/users/mutations';
import { WSLogo } from '../../components/ui/WSLogo';

export const SettingsScreen = ({
	navigation,
}: {
	navigation: NativeStackNavigationProp<any>;
}) => {
	const { user, logout } = useAuth();
	const deactivateAccountMutation = useDeactivateAccount(user?.uid || '');

	const handleDeactivateAccount = () => {
		Alert.alert(
			'Deactivate Account',
			'Your account will be deactivated and scheduled for permanent deletion in 14 days. You can reactivate it anytime within this 14-day period by simply logging back in.\n\nAre you sure you want to continue?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Deactivate',
					style: 'destructive',
					onPress: async () => {
						try {
							await deactivateAccountMutation.mutateAsync();
							Alert.alert(
								'Account Deactivated',
								'Your account has been deactivated. You have 14 days to log back in and reactivate it.',
								[
									{
										text: 'OK',
										onPress: () => logout(),
									},
								],
							);
						} catch (error) {
							Alert.alert(
								'Error',
								'Failed to deactivate account. Please try again.',
							);
						}
					},
				},
			],
		);
	};

	return (
		<View style={styles.container}>
			<ScreenHeader
				title="Account Settings"
				onBackPress={() => navigation.goBack()}
			/>
			<ScrollView
				contentContainerStyle={{ padding: 16 }}
				showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<WSLogo />
					<Text
						variant="h3"
						weight="bold"
						style={{ marginBottom: spacing.md, alignSelf: 'center' }}>
						Account Management {''}
					</Text>
					<Text
						variant="body"
						color={colors.text.secondary}
						style={{ marginBottom: spacing.md, paddingHorizontal: spacing.md }}>
						Deactivating your account will hide your profile and schedule your
						account for deletion in 14 days. You can reactivate anytime within
						this 14-day period by logging back in.
					</Text>
					<Text
						variant="h5"
						weight="bold"
						align="center"
						style={{
							marginBottom: 0,
							marginTop: spacing.md,
							alignSelf: 'center',
							color: colors.semantic.error,
						}}>
						We hate to see you go!
					</Text>
					<Text
						variant="h6"
						weight="bold"
						align="center"
						style={{
							marginBottom: spacing.lg,
							alignSelf: 'center',
							color: colors.semantic.error,
						}}>
						And we hope you'll come back after this short break.
					</Text>
					<Button
						variant="danger"
						onPress={handleDeactivateAccount}
						loading={deactivateAccountMutation.isPending}>
						DEACTIVATE ACCOUNT
					</Button>
				</View>
				<View style={styles.divider} />
				<Text
					variant="label"
					weight="bold"
					color={colors.text.secondary}
					style={{
						marginTop: spacing.lg,
						marginBottom: spacing.md,
						alignSelf: 'center',
					}}>
					More settings coming soon...
				</Text>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background.primary,
	},
	divider: {
		height: 1,
		backgroundColor: colors.border.light,
		marginHorizontal: spacing.md,
		marginVertical: spacing.xl,
	},
	section: {
		marginTop: spacing.lg,
		paddingTop: spacing.lg,
		justifyContent: 'center',
		flexDirection: 'column',
		alignItems: 'center',
	},
});
