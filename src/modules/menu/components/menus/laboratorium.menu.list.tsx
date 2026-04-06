import { MenuItem } from '../../../../shared/components';
import {
    IoFlaskOutline,
    IoWaterOutline,
    IoCubeOutline,
    IoWarningOutline,
    IoSkullOutline,
    IoThermometerOutline,
} from 'react-icons/io5';

export default function LaboratoriumMenuList() {
    return (
        <>
            <MenuItem
                badge={100}
                title="Pengujian Angka Lempeng Total (ALT)"
                description="Mengukur jumlah total bakteri pada sampel perikanan"
                icon={<IoFlaskOutline size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />
            <MenuItem
                badge={13}
                title="Pengujian Coliform"
                description="Mendeteksi keberadaan bakteri Coliform pada sampel air atau produk"
                icon={<IoWaterOutline size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />
            <MenuItem
                badge={10}
                title="Pengujian Coliform Produk Kerang"
                description="Spesifik mendeteksi bakteri Coliform pada produk kerang"
                icon={<IoCubeOutline size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />
            <MenuItem
                badge={5}
                title="Escherichia Coli (E. coli)"
                description="Mendeteksi bakteri E. coli pada sampel perikanan"
                icon={<IoWarningOutline size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />
            <MenuItem
                badge={1}
                title="Pengujian Salmonella"
                description="Mendeteksi bakteri Salmonella yang berpotensi membahayakan konsumen"
                icon={<IoSkullOutline size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />
            <MenuItem
                badge={4}
                title="Pengujian Sensori"
                description="Menilai kualitas fisik dan organoleptik produk perikanan"
                icon={<IoThermometerOutline size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />
            <MenuItem
                badge={2}
                title="Pengujian Formalin"
                description="Mendeteksi kandungan formalin yang berbahaya pada produk perikanan"
                icon={<IoWarningOutline size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />
        </>
    );
}
