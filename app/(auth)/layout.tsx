'use client';

import './auth.scss';

const AuthLayout = ({ children }: {
    children: React.ReactNode;
}) => (
    <main className="auth-page">
        <section className="auth-window">
            {children}
        </section>
    </main>
);

export default AuthLayout;
