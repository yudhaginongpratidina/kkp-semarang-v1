import { create } from 'zustand';
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { db } from '../../shared/configs/firebase';

export type SMKHPOnlineStatus = 'pending' | 'meeting' | 'selesai';

export type SMKHPOnlineData = {
    token: string;
    ajuan: string;
    email: string;
    formattedNo: string;
    linkmeet: string;
    nama: string;
    nik: string;
    noAju: string;
    nomorHp: string;
    queueNo: number;
    status: SMKHPOnlineStatus;
    tanggalRegistrasi: string;
    timemeet: string;
    timestamp: number;
    nama_petugas: string;
    nip_petugas: string;
    catatan_petugas: string;
};

type Petugas = {
    nama: string;
    nip: string;
};

type ScheduleMeetingPayload = {
    token: string;
    linkmeet: string;
    timemeet: string;
};

type SMKHPOnlineState = {
    smkhp_online: SMKHPOnlineData[];
    petugas: Petugas;
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
};

type SMKHPOnlineAction = {
    getSMKHPOnline: () => () => void;
    scheduleMeeting: (
        payload: ScheduleMeetingPayload,
    ) => Promise<{ success: boolean; message?: string }>;
    finishMeeting: (
        token: string,
        catatan?: string,
    ) => Promise<{ success: boolean; message?: string }>;
    setPetugas: (nama: string, nip: string) => void;
};

const initialState: SMKHPOnlineState = {
    smkhp_online: [],
    petugas: { nama: '', nip: '' },
    isLoading: false,
    isSubmitting: false,
    error: null,
};

const normalizeStatus = (status?: string): SMKHPOnlineStatus => {
    switch ((status || '').toLowerCase()) {
        case 'meeting':
            return 'meeting';
        case 'selesai':
        case 'completed':
            return 'selesai';
        default:
            return 'pending';
    }
};

const normalizeTime = (time?: string) => {
    if (!time) return '';

    const [hour = '', minute = ''] = time.split(':');
    if (!hour || !minute) return time;

    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
};

const useSMKHPOnlineStore = create<SMKHPOnlineState & SMKHPOnlineAction>()(
    (set, get) => ({
        ...initialState,

        setPetugas: (nama, nip) => {
            set((state) => ({
                petugas: { ...state.petugas, nama, nip },
            }));
        },

        getSMKHPOnline: () => {
            set({ isLoading: true, error: null });

            return onSnapshot(
                query(collection(db, 'onlineSMKHP'), orderBy('queueNo', 'asc')),
                (snapshot) => {
                    const data = snapshot.docs.map((item) => {
                        const value = item.data();

                        return {
                            token: item.id,
                            ajuan: value.ajuan || '-',
                            email: value.email || '',
                            formattedNo: value.formattedNo || item.id,
                            linkmeet: value.linkmeet || '',
                            nama: value.nama || value.name || 'Tanpa Nama',
                            nik: value.nik || '-',
                            noAju: value.noAju || '-',
                            nomorHp: value.nomorHp || '-',
                            queueNo: Number(value.queueNo || 0),
                            status: normalizeStatus(value.status),
                            tanggalRegistrasi: value.tanggalRegistrasi || '',
                            timemeet: normalizeTime(value.timemeet),
                            timestamp: Number(value.timestamp || 0),
                            nama_petugas: value.nama_petugas || '',
                            nip_petugas: value.nip_petugas || '',
                            catatan_petugas: value.catatan_petugas || '',
                        } satisfies SMKHPOnlineData;
                    });

                    set({
                        smkhp_online: data,
                        isLoading: false,
                        error: null,
                    });
                },
                (error) => {
                    console.error('SMKHP Online Stream Error:', error);
                    set({
                        isLoading: false,
                        error: error.message,
                    });
                },
            );
        },

        scheduleMeeting: async ({ token, linkmeet, timemeet }) => {
            const item = get().smkhp_online.find(
                (queue) => queue.token === token,
            );

            if (!item) {
                const message = 'Data antrean SMKHP online tidak ditemukan.';
                alert(message);
                return { success: false, message };
            }

            const normalizedTime = normalizeTime(timemeet);

            const isConflict = get().smkhp_online.some((queue) => {
                return (
                    queue.token !== token &&
                    queue.status === 'meeting' &&
                    queue.tanggalRegistrasi === item.tanggalRegistrasi &&
                    normalizeTime(queue.timemeet) === normalizedTime
                );
            });

            if (isConflict) {
                const message =
                    'Jadwal meeting bentrok dengan antrean SMKHP online lain di tanggal dan jam yang sama.';
                alert(message);
                return { success: false, message };
            }

            set({ isSubmitting: true, error: null });

            try {
                await updateDoc(doc(db, 'onlineSMKHP', token), {
                    linkmeet: linkmeet.trim(),
                    timemeet: normalizedTime,
                    status: 'meeting',
                    updatedAt: Date.now(),
                });

                return { success: true };
            } catch (error: any) {
                const message =
                    error?.message ||
                    'Gagal menyimpan jadwal meeting SMKHP online.';
                alert(message);
                return { success: false, message };
            } finally {
                set({ isSubmitting: false });
            }
        },

        finishMeeting: async (token, catatan) => {
            const item = get().smkhp_online.find(
                (queue) => queue.token === token,
            );
            const { petugas } = get();

            if (!item) {
                const message = 'Data antrean SMKHP online tidak ditemukan.';
                alert(message);
                return { success: false, message };
            }

            if (!petugas.nama || !petugas.nip) {
                const message = 'Data petugas login belum tersedia.';
                alert(message);
                return { success: false, message };
            }

            set({ isSubmitting: true, error: null });

            try {
                await updateDoc(doc(db, 'onlineSMKHP', token), {
                    status: 'selesai',
                    nama_petugas: petugas.nama,
                    nip_petugas: petugas.nip,
                    catatan_petugas: catatan?.trim() || '',
                    updatedAt: Date.now(),
                });

                await setDoc(doc(db, 'officer_notes', token), {
                    nama_petugas: petugas.nama,
                    nip_petugas: petugas.nip,
                    catatan: catatan?.trim() || '',
                    layanan: 'SMKHP Online',
                    token,
                    nomor_antrian: item.formattedNo || token,
                    nomor_aju: item.noAju || '',
                    jadwal_meeting: {
                        tanggal: item.tanggalRegistrasi || '',
                        jam: item.timemeet || '',
                        link: item.linkmeet || '',
                    },
                    timestamp: Date.now(),
                });

                return { success: true };
            } catch (error: any) {
                const message =
                    error?.message ||
                    'Gagal menyelesaikan meeting SMKHP online.';
                alert(message);
                return { success: false, message };
            } finally {
                set({ isSubmitting: false });
            }
        },
    }),
);

export default useSMKHPOnlineStore;
