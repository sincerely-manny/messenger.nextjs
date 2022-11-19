'use client';

import { Provider } from 'react-redux';
import { store } from 'store';
import './auth.scss';

const AuthLayout = ({ children }: {
    children: React.ReactNode;
}) => (
    <main className="auth-page">
        <section className="auth-window">
            <Provider store={store}>
                {children}
            </Provider>
        </section>
    </main>
);

export default AuthLayout;
