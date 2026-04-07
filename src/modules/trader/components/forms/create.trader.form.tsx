import { Form, TextInput, Button } from '../../../../shared/components';

export default function CreateTraderForm() {
    return (
        <Form>
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
            <Button>Tambah Trader</Button>
        </Form>
    );
}
