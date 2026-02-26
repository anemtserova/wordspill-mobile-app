import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Modal,
	ViewStyle,
} from 'react-native';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Calendar, Xmark } from 'iconoir-react-native';
import { Text } from './Text';
import { Button } from './Button';
import { colors, spacing, borderRadius } from '../../theme';

interface DatePickerProps {
	label?: string;
	value: Date;
	onChange: (date: Date) => void;
	placeholder?: string;
	containerStyle?: ViewStyle;
	mode?: 'single' | 'range' | 'multiple';
}

export const DatePicker = ({
	label,
	value,
	onChange,
	placeholder = 'Select date',
	containerStyle,
	mode = 'single',
}: DatePickerProps) => {
	const defaultStyles = useDefaultStyles();
	const [isOpen, setIsOpen] = useState(false);
	const [tempDate, setTempDate] = useState(value);

	const formatDate = (date: Date) => {
		return dayjs(date).format('D MMMM, YYYY');
	};

	const handleConfirm = () => {
		onChange(tempDate);
		setIsOpen(false);
	};

	const handleCancel = () => {
		setTempDate(value);
		setIsOpen(false);
	};

	return (
		<View style={[styles.container, containerStyle]}>
			{label && (
				<Text variant="label" style={styles.label}>
					{label}
				</Text>
			)}

			<TouchableOpacity
				style={styles.inputTrigger}
				onPress={() => setIsOpen(true)}
				activeOpacity={0.7}>
				<Text
					variant="body"
					color={value ? colors.text.primary : colors.text.tertiary}>
					{value ? formatDate(value) : placeholder}
				</Text>
				<Calendar
					width={20}
					height={20}
					color={colors.text.secondary}
					strokeWidth={2}
				/>
			</TouchableOpacity>

			<Modal
				visible={isOpen}
				transparent
				animationType="fade"
				onRequestClose={handleCancel}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						{/* Modal Header */}
						<View style={styles.modalHeader}>
							<Text variant="h6">Select Date</Text>
							<TouchableOpacity
								onPress={handleCancel}
								style={styles.closeButton}>
								<Xmark
									width={24}
									height={24}
									color={colors.text.primary}
									strokeWidth={2}
								/>
							</TouchableOpacity>
						</View>
						{/* Date Picker */}
						<DateTimePicker
							styles={{
								...defaultStyles,
								today: { borderColor: colors.accent.gold, borderWidth: 2 },
								selected: { backgroundColor: colors.accent.teal },
								selected_label: { color: colors.neutral.white },
							}}
							mode={mode}
							date={dayjs(tempDate)}
							onChange={(params: any) => {
								if (params.date) {
									const newDate = dayjs(params.date).toDate();
									setTempDate(newDate);
								}
							}}
						/>
						{/* Modal Actions */}
						<View style={styles.modalActions}>
							<Button
								variant="secondary"
								onPress={handleConfirm}
								style={styles.actionButton}>
								Confirm
							</Button>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: spacing.md,
	},
	label: {
		marginBottom: spacing.xs,
	},
	inputTrigger: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		backgroundColor: colors.background.secondary,
		borderRadius: borderRadius.md,
		borderWidth: 1,
		borderColor: colors.border.light,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: spacing.lg,
	},
	modalContent: {
		backgroundColor: colors.background.primary,
		borderRadius: borderRadius.lg,
		padding: spacing.lg,
		width: '100%',
		maxWidth: 400,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.md,
	},
	closeButton: {
		padding: spacing.xs,
	},
	modalActions: {
		flexDirection: 'row',
		gap: spacing.md,
		marginTop: spacing.lg,
	},
	actionButton: {
		flex: 1,
	},
});
