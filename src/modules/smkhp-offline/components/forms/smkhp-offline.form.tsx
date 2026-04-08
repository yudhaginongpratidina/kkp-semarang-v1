import { Form, TextInput, Button } from '../../../../shared/components';

export default function SMKHPOfflineForm({ id }: { id: string }) {
    return (
        <Form>
            <TextInput name="id" label="ID User" value={id} required disabled />
            <TextInput
                name="no_antrian"
                label="Nomer Antrian"
                value={1}
                required
                disabled
            />
            <TextInput
                name="nama"
                label="Nama"
                value="User 1"
                required
                disabled
            />
            <TextInput
                name="no_npwp"
                label="Nomer NPWP"
                value="00.100.169.1-305.7000"
                required
                disabled
            />
            <TextInput
                name="nama_petugas"
                label="Nama Petugas"
                value="petugas 1"
                required
                disabled
            />
            <TextInput
                name="catatan_petugas"
                label="Catatan Petugas"
                value="catatan petugas 1"
                required
            />
            <Button>Submit dan Selesaikan</Button>
        </Form>
    );
}
