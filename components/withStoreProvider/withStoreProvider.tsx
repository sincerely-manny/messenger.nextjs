'use client';

import { Provider } from 'react-redux';
import { store } from 'store';

const withStoreProvider = (
    WrappedComponent: React.ComponentType<T>,
) => (props) => (
    <Provider store={store}>
        <WrappedComponent />
    </Provider>
);
