/* eslint-disable react/jsx-props-no-spreading */

'use client';

import { SessionProvider } from 'next-auth/react';

const withSessionProvider = <T extends object>(
    WrappedComponent: React.ComponentType<T>,
) => (props: T) => (
    <SessionProvider>
        <WrappedComponent {...props} />
    </SessionProvider>
);

export default withSessionProvider;
