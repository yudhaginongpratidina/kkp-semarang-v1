import { MenuItem } from '../../../../shared/components';
import {
    IoIosDocument,
    IoIosFlask,
    IoIosHeadset,
    IoIosStats,
    IoIosPeople,
    IoIosTime,
    IoIosContacts,
    IoIosList,
    IoIosSettings,
} from 'react-icons/io';

export default function MainMenuList() {
    return (
        <>
            <MenuItem
                title="SMKHP"
                description="Dokumen resmi KKP yang menjamin produk perikanan Indonesia memenuhi standar keamanan pangan internasional"
                icon={<IoIosDocument size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />

            <MenuItem
                href="/laboratorium"
                title="Laboratorium"
                description="Fasilitas untuk memeriksa sampel produk perikanan dan memastikan kualitasnya"
                icon={<IoIosFlask size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />

            <MenuItem
                title="Customer Service"
                description="Layanan untuk membantu pengajuan SMKHP bagi yang belum memilikinya"
                icon={<IoIosHeadset size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />

            <MenuItem
                href="/layanan-online"
                title="Layanan Online"
                description="Layanan online untuk memudahkan pengajuan SMKHP dan pembuatan SMKHP bagi pelaku usaha"
                icon={<IoIosList size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />

            <MenuItem
                href="/reporting"
                title="Reporting"
                description="Akses laporan resmi dan statistik terkait kegiatan"
                icon={<IoIosStats size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />

            <MenuItem
                title="Traders"
                description="Kelola profil trader dan validasi data NPWP untuk kepatuhan transaksi."
                icon={<IoIosPeople size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />

            <MenuItem
                title="History"
                description="Riwayat pengajuan, pemeriksaan, dan sertifikasi produk perikanan"
                icon={<IoIosTime size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />

            <MenuItem
                title="Officers"
                description="Manajemen petugas dan staf yang bertanggung jawab di lapangan"
                icon={<IoIosContacts size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />

            <MenuItem
                title="Terminal Antrian"
                description="Layanan daftar antrian dan pengaturan jadwal pemeriksaan produk"
                icon={<IoIosList size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />

            <MenuItem
                href="/settings"
                title="Settings"
                description="Pengaturan aplikasi dan preferensi pengguna"
                icon={<IoIosSettings size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />
        </>
    );
}
