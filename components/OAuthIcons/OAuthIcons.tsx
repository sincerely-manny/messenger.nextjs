'use client';

import { addNotification } from 'components/PopUpNotifications';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { MouseEvent } from 'react';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import './OAuthIcons.scss';

const OAuthIcons = () => {
    const dispatch = useDispatch();
    const clickHandlerLogin = (provider: string) => (ev: MouseEvent) => {
        ev.preventDefault();
        (async () => {
            await signIn(provider, { callbackUrl: '/messenger' });
        })().catch((e: Error) => {
            dispatch(addNotification({
                type: 'error',
                message: e.message || 'Error sending data',
            }));
        });
    };
    return (
        <>
            <Link href="/sign-in" title="Sign-in with GitHub" className="oauth-icon" onClick={clickHandlerLogin('github')}>
                <BsGithub size="3em" />
            </Link>
            <Link href="/sign-in" title="Sign-in with Google" className="oauth-icon" onClick={clickHandlerLogin('google')}>
                <BsGoogle size="3em" />
            </Link>
        </>
    );
};

export default OAuthIcons;
