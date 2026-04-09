import type { LabHistoryItem, LabSample } from '../lab.types';
import { findTestCatalog, formatCurrency, formatLongDate } from '../lab.utils';

type LabReportViewProps = {
    item: LabSample | LabHistoryItem;
    title: string;
};

export default function LabReportView({ item, title }: LabReportViewProps) {
    return (
        <div className="bg-white border border-slate-300 p-6 text-black space-y-6">
            <div className="text-center border-b border-black pb-4">
                <p className="text-sm font-bold">
                    KEMENTERIAN KELAUTAN DAN PERIKANAN
                </p>
                <p className="text-sm">BALAI KIPM SEMARANG</p>
                <h2 className="text-xl font-black mt-2">LAPORAN HASIL UJI</h2>
                <p className="text-xs uppercase tracking-[0.2em] mt-1">
                    {title}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                    <p>
                        <span className="font-bold">Nomor LPP:</span> {item.lpp}
                    </p>
                    <p>
                        <span className="font-bold">Nama Sampel:</span>{' '}
                        {item.namaSampel}
                    </p>
                    <p>
                        <span className="font-bold">Tanggal Pengujian:</span>{' '}
                        {formatLongDate(item.tanggalPengujian)}
                    </p>
                    <p>
                        <span className="font-bold">Jumlah Kg:</span>{' '}
                        {item.jumlahKg || '-'}
                    </p>
                </div>

                <div className="space-y-1">
                    <p>
                        <span className="font-bold">Email:</span>{' '}
                        {item.email || '-'}
                    </p>
                    <p>
                        <span className="font-bold">NIP / Identitas:</span>{' '}
                        {item.nip || '-'}
                    </p>
                    <p>
                        <span className="font-bold">Petugas Pengujian:</span>{' '}
                        {item.namaPetugas || '-'}
                    </p>
                    <p>
                        <span className="font-bold">NIP Petugas:</span>{' '}
                        {item.nipPetugas || '-'}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="border border-slate-300 px-3 py-2 text-left">
                                No
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                                Jenis Pengujian
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                                Satuan
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                                Hasil Uji
                            </th>
                            <th className="border border-slate-300 px-3 py-2 text-left">
                                Tarif
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {item.hasilUji.map((result, index) => {
                            const catalog = findTestCatalog(result.testName);

                            return (
                                <tr key={`${result.testKey}-${index}`}>
                                    <td className="border border-slate-300 px-3 py-2">
                                        {index + 1}
                                    </td>
                                    <td className="border border-slate-300 px-3 py-2">
                                        {result.testName}
                                    </td>
                                    <td className="border border-slate-300 px-3 py-2">
                                        {catalog.satuan}
                                    </td>
                                    <td className="border border-slate-300 px-3 py-2">
                                        {result.result || '-'}
                                    </td>
                                    <td className="border border-slate-300 px-3 py-2">
                                        {formatCurrency(result.tarif)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td
                                colSpan={4}
                                className="border border-slate-300 px-3 py-2 font-bold text-right"
                            >
                                Total Tarif
                            </td>
                            <td className="border border-slate-300 px-3 py-2 font-bold">
                                {formatCurrency(item.totalTarif)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="text-sm space-y-1">
                <p>
                    Laporan hasil uji ini menyesuaikan jenis pengujian yang
                    dipilih pada sampel dan hasil input petugas laboratorium.
                </p>
                <p>
                    Status laporan:{' '}
                    <span className="font-bold">{item.status}</span>
                </p>
            </div>

            <div className="pt-6 flex justify-end">
                <div className="w-full max-w-xs text-sm space-y-1">
                    <p>Semarang, {formatLongDate(item.tanggalPenerbitan)}</p>
                    <p className="font-bold">Penanggung Jawab Laboratorium</p>
                    <div className="h-16" />
                    <p className="font-bold">
                        {item.namaPenanggungJawab || '-'}
                    </p>
                    <p>NIP. {item.nipPenanggungJawab || '-'}</p>
                </div>
            </div>
        </div>
    );
}
