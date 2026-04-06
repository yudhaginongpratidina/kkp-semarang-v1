import { Button } from '../../../shared/components';

export default function MenuLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
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
            <main className="flex-1 p-8">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {children}
                </div>
            </main>
            <footer className="bg-slate-900 text-white py-4 mt-auto">
                <div className="max-w-7xl mx-auto text-center text-sm">
                    &copy; {new Date().getFullYear()} Kementerian Kelautan dan
                    Perikanan. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
