import { IoIosDocument, IoIosHeadset } from 'react-icons/io';
import { MenuItem } from '../../../../shared/components';

export default function LayananOnlineMenuList() {
    return (
        <>
            <MenuItem
                badge={5}
                title="SMKHP"
                description="Dokumen resmi KKP yang menjamin produk perikanan Indonesia memenuhi standar keamanan pangan internasional"
                icon={<IoIosDocument size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />
            <MenuItem
                badge={1}
                title="Customer Service"
                description="Layanan untuk membantu pengajuan SMKHP bagi yang belum memilikinya"
                icon={<IoIosHeadset size={32} className="text-black" />}
                className="hover:shadow-lg hover:bg-slate-100 transition-all duration-200"
            />
        </>
    );
}
