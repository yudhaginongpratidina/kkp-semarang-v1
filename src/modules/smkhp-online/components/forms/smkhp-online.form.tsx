import * as React from 'react';

import { Form, TextInput, Button } from '../../../../shared/components';
import useGlobalStore from '../../../../shared/stores/global.store';
import useSMKHPOnlineStore, { type SMKHPOnlineData } from '../../store';

type SMKHPOnlineFormProps = {
    item: SMKHPOnlineData;
    mode: 'schedule' | 'detail';
    onSuccess?: () => void;
};

export default function SMKHPOnlineForm(props: SMKHPOnlineFormProps) {
    const { item, mode, onSuccess } = props;
    const [linkMeet, setLinkMeet] = React.useState(item.linkmeet || '');
    const [timeMeet, setTimeMeet] = React.useState(item.timemeet || '');
    const [catatan, setCatatan] = React.useState(item.catatan_petugas || '');
    const { state: globalUser } = useGlobalStore();
    const { setPetugas, scheduleMeeting, finishMeeting, isSubmitting } =
        useSMKHPOnlineStore();

    React.useEffect(() => {
        setPetugas(globalUser.full_name, globalUser.nip);
    }, [globalUser.full_name, globalUser.nip, setPetugas]);

    React.useEffect(() => {
        setLinkMeet(item.linkmeet || '');
        setTimeMeet(item.timemeet || '');
        setCatatan(item.catatan_petugas || '');
    }, [item]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (mode === 'schedule') {
            if (!linkMeet.trim() || !timeMeet.trim()) {
                alert('Link Zoom dan jam meeting wajib diisi.');
                return;
            }

            const result = await scheduleMeeting({
                token: item.token,
                linkmeet: linkMeet,
                timemeet: timeMeet,
            });

            if (result.success) onSuccess?.();
            return;
        }

        if (item.status !== 'meeting') return;

        const result = await finishMeeting(item.token, catatan);
        if (result.success) onSuccess?.();
    };

    const isDetailMode = mode === 'detail';
    const isMeetingStatus = item.status === 'meeting';
    const isFinishedStatus = item.status === 'selesai';

    return (
        <Form onSubmit={handleSubmit}>
            <TextInput
                name="formatted_no"
                label="Nomor Antrian"
                value={item.formattedNo || item.token}
                required
                disabled
            />
            <TextInput
                name="queue_no"
                label="Queue No"
                value={item.queueNo}
                required
                disabled
            />
            <TextInput
                name="nama"
                label="Nama"
                value={item.nama}
                required
                disabled
            />
            <TextInput
                name="nik"
                label="NIK"
                value={item.nik}
                required
                disabled
            />
            <TextInput name="email" label="Email" value={item.email} disabled />
            <TextInput
                name="nomor_hp"
                label="Nomor HP"
                value={item.nomorHp}
                required
                disabled
            />
            <TextInput
                name="no_aju"
                label="Nomor Aju"
                value={item.noAju}
                required
                disabled
            />
            <TextInput
                name="ajuan"
                label="Ajuan"
                value={item.ajuan}
                required
                disabled
            />
            <TextInput
                name="tanggal_registrasi"
                label="Tanggal Registrasi"
                value={item.tanggalRegistrasi}
                required
                disabled
            />
            <TextInput
                name="status"
                label="Status"
                value={item.status}
                required
                disabled
            />

            <TextInput
                name="link_meet"
                label="Link Zoom / Meet"
                value={linkMeet}
                onChange={(event) => {
                    const target = event.target as HTMLInputElement;
                    setLinkMeet(target.value);
                }}
                disabled={isDetailMode}
                helperText={
                    mode === 'schedule'
                        ? 'Pastikan link meeting sudah final sebelum disimpan.'
                        : undefined
                }
                required
            />

            <TextInput
                name="time_meet"
                label="Jam Meeting"
                type="time"
                value={timeMeet}
                onChange={(event) => {
                    const target = event.target as HTMLInputElement;
                    setTimeMeet(target.value);
                }}
                disabled={isDetailMode}
                helperText={
                    mode === 'schedule'
                        ? 'Sistem akan menolak jadwal yang bentrok di tanggal yang sama.'
                        : undefined
                }
                required
            />

            {isDetailMode && (
                <>
                    <TextInput
                        name="nama_petugas"
                        label="Nama Petugas"
                        value={
                            isMeetingStatus
                                ? globalUser.full_name
                                : item.nama_petugas
                        }
                        disabled
                    />
                    <TextInput
                        name="nip_petugas"
                        label="NIP Petugas"
                        value={
                            isMeetingStatus ? globalUser.nip : item.nip_petugas
                        }
                        disabled
                    />
                    <TextInput
                        name="catatan_petugas"
                        label="Catatan Petugas"
                        value={catatan}
                        onChange={(event) => {
                            const target = event.target as HTMLInputElement;
                            setCatatan(target.value);
                        }}
                        disabled={isFinishedStatus}
                        helperText={
                            isMeetingStatus
                                ? 'Catatan ini akan disimpan saat meeting diselesaikan.'
                                : undefined
                        }
                    />
                </>
            )}

            {mode === 'schedule' && (
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan...' : 'Simpan dan Mulai Meeting'}
                </Button>
            )}

            {mode === 'detail' && isMeetingStatus && (
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Menyelesaikan...' : 'Selesaikan Meeting'}
                </Button>
            )}
        </Form>
    );
}
