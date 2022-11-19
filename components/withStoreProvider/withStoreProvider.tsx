/* eslint-disable react/jsx-props-no-spreading */

'use client';

import { Provider } from 'react-redux';
import { store } from 'store';

const withStoreProvider = <T extends Record<string, unknown>>(
    WrappedComponent: React.ComponentType<T>,
) => (props: T) => (
    <Provider store={store}>
        <WrappedComponent {...props} />
    </Provider>
);

export default withStoreProvider;
