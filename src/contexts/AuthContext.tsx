import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';

const AuthContext = createContext<ReturnType<typeof useAuthHook> | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const auth = useAuthHook();

	const value = useMemo(() => auth, [auth.user, auth.profile, auth.loading]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within AuthProvider');
	return context;
};
