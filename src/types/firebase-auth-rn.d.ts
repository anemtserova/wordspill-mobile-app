/**
 * Module augmentation to add `getReactNativePersistence` to `firebase/auth` typings.
 *
 * Firebase v12 does not re-export this function in the `firebase/auth` type surface,
 * even though it exists at runtime via Metro's React Native bundle resolution.
 * This declaration bridges the gap without requiring a downgrade or separate import.
 */
import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
	export function getReactNativePersistence(storage: {
		getItem(key: string): Promise<string | null>;
		setItem(key: string, value: string): Promise<void>;
		removeItem(key: string): Promise<void>;
	}): Persistence;
}
