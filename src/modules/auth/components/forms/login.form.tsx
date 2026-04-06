import {
    Form,
    EmailInput,
    PasswordInput,
    Button,
} from '../../../../shared/components';

export default function LoginForm() {
    return (
        <Form>
            <EmailInput
                name="email"
                label="Email"
                placeholder="Masukkan email Anda"
                required
            />
            <PasswordInput
                name="password"
                label="Password"
                placeholder="Masukkan password Anda"
                required
            />
            <Button>Masuk</Button>
        </Form>
    );
}
