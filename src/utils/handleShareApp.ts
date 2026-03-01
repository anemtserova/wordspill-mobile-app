import { Alert, Share } from 'react-native';

export const handleShareApp = async () => {
	try {
		await Share.share({
			message:
				'Check out Wordspill - Your personal writing companion! Capture your thoughts, write freely, and preserve your memories. 📝✨',
			title: 'Share Wordspill',
			url: '', // add my play store link here when available
		});
	} catch (error: any) {
		Alert.alert('Error', 'Failed to share app');
		console.error('Share error:', error);
	}
};
