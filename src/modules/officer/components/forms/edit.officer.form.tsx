import {
    Form,
    TextInput,
    SelectInput,
    Button,
} from '../../../../shared/components';

export default function EditOfficerForm({ id }: { id: string }) {
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
                name="name"
                label="Nama Petugas"
                placeholder="Masukkan nama petugas"
                required
            />
            <TextInput
                name="nip"
                label="NIP Petugas"
                placeholder="Masukkan NIP petugas"
                required
            />
            <SelectInput
                label="Hak Akses"
                options={[
                    { label: 'Admin Operator', value: 'admin-operator' },
                    { label: 'SMKHP Operator', value: 'smkhp-operator' },
                    { label: 'Lab Umum Operator', value: 'lab-umum-operator' },
                    {
                        label: 'Lab Oficial Operator',
                        value: 'lab-oficial-operator',
                    },
                    { label: 'CS Operator', value: 'cs-operator' },
                ]}
            />
            <Button>Edit</Button>
        </Form>
    );
}
