'use client';

import axios, { AxiosResponse } from 'axios';
import { addNotification } from 'components/PopUpNotifications';
import { StyledForm, StyledFormTypes } from 'components/StyledForm';
import withStoreProvider from 'components/withStoreProvider';
import { User } from 'next-auth';
import { getCsrfToken, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import fonts from 'scss/fonts';
import * as Yup from 'yup';

type SignInInputs = {
    login: string,
    password: string,
};

const SignInSchema = Yup.object().shape({
    login: Yup.string()
        .required('Please input your login'),
    password: Yup.string()
        .required('Please input your password'),
});

const SignIn = () => {
    const dispatch = useDispatch();
    const submitHandler: StyledFormTypes.Handler<SignInInputs> = (
        values,
        actions,
    ) => {
        (async () => {
            // const csrfToken = await getCsrfToken();
            // const res = await axios.post<SignInInputs, AxiosResponse<User | null>>(
            //     '/api/auth/signin/credentials',
            //     {
            //         csrfToken,
            //         ...values,
            //     },
            // );
            // dispatch(addNotification({
            //     type: 'success',
            //     title: 'Sent:',
            //     message: JSON.stringify(res.data).replaceAll(',', ' ') || 'Undefined',
            // }));
            // actions.setSubmitting(false);
            const res = await signIn('credentials', { redirect: false, ...values });
            console.log(res);
            dispatch(addNotification({
                type: 'success',
                title: 'Sent:',
                message: JSON.stringify(res).replaceAll(',', ' ') || 'Undefined',
            }));
            actions.setSubmitting(false);
        })().catch((e: Error) => {
            dispatch(addNotification({
                type: 'error',
                message: e.message || 'Error sending data',
            }));
        });
    };
    return (
        <>
            <h1 className={`form-title ${fonts.lora.className}`}>Sign In</h1>
            <StyledForm<SignInInputs>
                yupValidationSchema={SignInSchema}
                initialValues={{ login: '', password: '' }}
                onSubmit={submitHandler}
                inputsList={[
                    { type: 'text', name: 'login', label: 'Login' },
                    { type: 'password', name: 'password', label: 'Password' },
                    { type: 'submit', name: 'submit', label: 'Sign in' },
                ]}
            />
            <p className="diff-auth-option-link">
                Don&apos;t have an account?&nbsp;
                <Link href="/sign-up">
                    Sign up
                </Link>
            </p>
        </>
    );
};

export default withStoreProvider(SignIn);
