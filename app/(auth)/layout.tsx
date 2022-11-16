'use client';

import { Provider } from 'react-redux';
import { store } from 'store';
import './auth.scss';

export default function AuthLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <main className="auth-page">
            <section className="auth-window">
                <Provider store={store}>
                    {children}
                </Provider>
            </section>
        </main>
    );
}
