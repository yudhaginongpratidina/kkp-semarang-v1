import { create } from 'zustand';
import { toast } from 'sonner';

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../shared/configs/firebase';
import { doc, getDoc } from 'firebase/firestore';

type AuthState = {
    email: string;
    password: string;
    is_loading: boolean;
    is_error: boolean;
    message: string;
};

type AuthAction = {
    setField: <K extends keyof AuthState>(key: K, value: AuthState[K]) => void;
    reset: () => void;
    login: () => Promise<void>;
    logout: () => Promise<void>;
};

const initialState: Omit<AuthState, 'is_loading' | 'is_error' | 'message'> = {
    email: '',
    password: '',
};

export const useNoAjuStore = create<AuthState & AuthAction>((set, get) => ({
    ...initialState,
    is_loading: false,
    is_error: false,
    message: '',

    setField: (key, value) => set((state) => ({ ...state, [key]: value })),

    reset: () =>
        set({
            ...initialState,
            is_loading: false,
            is_error: false,
            message: '',
        }),

    login: async () => {
        const { email, password } = get();
        const toastId = toast.loading('logging in...');
        set({ is_loading: true, is_error: false });
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const uid = userCredential.user.uid;

            const userDoc = await getDoc(doc(db, 'officers', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                toast.success(`Access Granted: Welcome ${data.full_name}`, {
                    id: toastId,
                });
                // return { id: uid, ...data };
            } else {
                throw new Error('USER_NOT_FOUND_IN_DATABASE');
            }
        } catch (error: any) {
            let errMsg = 'AUTH_ERROR';
            if (error.code === 'auth/user-not-found') errMsg = 'USER_NOT_FOUND';
            else if (error.code === 'auth/wrong-password')
                errMsg = 'INVALID_CREDENTIALS';
            else errMsg = error.message;

            set({ is_error: true, message: errMsg });
            toast.error(errMsg, { id: toastId });
        } finally {
            set({ is_loading: false });
        }
    },

    logout: async () => {
        const toastId = toast.loading('Logging out...');
        try {
            await signOut(auth);
            set({ ...initialState });
            toast.success('Session telah berakhir', { id: toastId });
            setTimeout(() => (window.location.href = '/auth/login'), 1000);
        } catch (error: any) {
            set({ is_error: true, message: error.message });
            toast.error('Logout gagal', { id: toastId });
        }
    },
}));
