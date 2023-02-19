/* eslint-disable react/jsx-props-no-spreading */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import { AppRouter } from 'lib/api/trpcRouter';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

function getBaseUrl() {
    // browser should use relative path
    if (typeof window !== 'undefined') {
        return '';
    }
    // reference for vercel.com
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    // reference for render.com
    if (process.env.RENDER_INTERNAL_HOSTNAME) {
        return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT || '3000'}`;
    }
    // assume localhost
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

const withTrpcProvider = <T extends object>(
    WrappedComponent: React.ComponentType<T>,
) => (props: T) => {
    const queryClient = new QueryClient();
    const trpcClient = trpc.createClient({
        links: [
            httpBatchLink({
                url: `${getBaseUrl()}/api/trpc`,
            }),
        ],
        transformer: superjson,
    });
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <WrappedComponent {...props} />
            </QueryClientProvider>
        </trpc.Provider>
    );
};

export default withTrpcProvider;
