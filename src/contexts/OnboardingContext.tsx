import { createContext, useContext, ReactNode } from 'react';
import { useOnboarding as useOnboardingHook } from '../hooks/useOnboarding';

const OnboardingContext = createContext<ReturnType<
	typeof useOnboardingHook
> | null>(null);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
	const onboarding = useOnboardingHook();
	return (
		<OnboardingContext.Provider value={onboarding}>
			{children}
		</OnboardingContext.Provider>
	);
};

export const useOnboarding = () => {
	const context = useContext(OnboardingContext);
	if (!context)
		throw new Error('useOnboarding must be used within OnboardingProvider');
	return context;
};
