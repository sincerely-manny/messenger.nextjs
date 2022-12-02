'use client';

import Preloader from 'components/Preloader';
import withSessionProvider from 'components/withSessionProvider';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import './home.scss';

const Home = () => {
    const session = useSession({
        required: true,
    });

    if (session.status === 'authenticated') {
        redirect('/messenger');
    }

    return (
        <main className="entry-point-loading">
            <Preloader />
        </main>
    );
};

export default withSessionProvider(Home);
