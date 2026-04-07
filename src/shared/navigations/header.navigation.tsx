import { Button } from '../components';

export default function HeaderNavigation() {
    return (
        <header className="bg-slate-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <img
                    src="/logo.png"
                    alt="Logo KKP"
                    className="h-14 w-auto object-contain"
                />
                <Button variant="solid">Logout</Button>
            </div>
        </header>
    );
}
