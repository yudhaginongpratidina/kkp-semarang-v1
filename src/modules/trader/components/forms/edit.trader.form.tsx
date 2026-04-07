import { Form, TextInput, Button } from '../../../../shared/components';

export default function EditTraderForm({ id }: { id: string }) {
    return (
        <Form>
            <TextInput
                name="id"
                label="ID Petugas"
                value={id}
                disabled
                required
            />
            <TextInput
                name="kode"
                label="Kode Trader"
                placeholder="Masukkan kode trader"
                required
            />
            <TextInput
                name="name"
                label="Nama Trader"
                placeholder="Masukkan nama trader"
                required
            />
            <TextInput
                name="npwp"
                label="NPWP"
                placeholder="Masukkan npwp trader"
                required
            />
            <TextInput
                name="alamat"
                label="Alamat"
                placeholder="Masukkan alamat trader"
                required
            />
            <Button>Edit Trader</Button>
        </Form>
    );
}
