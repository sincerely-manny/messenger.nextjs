import './auth.scss';

export default function AuthLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <main className="auth-page">
            <section className="auth-window">
                {children}
            </section>
        </main>
    );
}
