'use client';

import axios, { AxiosError, AxiosResponse } from 'axios';
import OAuthIcons from 'components/OAuthIcons';
import { addNotification } from 'components/PopUpNotifications/slice';
import { StyledForm, StyledFormTypes } from 'components/StyledForm';
import withStoreProvider from 'components/withStoreProvider';
import { SignUpInputs, SignUpResponse, SignUpSchema } from 'lib/api/signup';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import fonts from 'scss/fonts';

const SignUp = () => {
    const dispatch = useDispatch();
    const errors: Record<string, string> = {};
    const submitHandler: StyledFormTypes.Handler<SignUpInputs> = (
        values,
        actions,
    ) => {
        const res = axios.post<SignUpInputs, AxiosResponse<SignUpResponse>>('/api/user/signup', values);
        res.then((r) => {
            dispatch(addNotification({
                type: 'success',
                message: JSON.stringify(r.data.payload).replaceAll(',', ' ') || 'Undefined',
                title: 'Sent:',
            }));
        }).catch((e: AxiosError<SignUpResponse>) => {
            if (e.response?.data.status === 'error' && e.response.data.payload?.path) {
                // We've got a Yup.ValidationError - let's hilight the field
                const { path, message } = e.response.data.payload;
                errors[path] = message;
            } else {
                // Probably something else – just nitify
                dispatch(addNotification({
                    type: 'error',
                    message: e.response?.data.message || 'Error sending data',
                }));
            }
        }).finally(() => {
            actions.setSubmitting(false);
        });
    };
    return (
        <>
            <h1 className={`form-title ${fonts.lora.className}`}>Sign Up</h1>
            <StyledForm<SignUpInputs>
                yupValidationSchema={SignUpSchema}
                initialValues={{
                    login: '', password: '', name: '', confirmPassword: '', email: '',
                }}
                onSubmit={submitHandler}
                externalErrors={errors}
                inputsList={[
                    { type: 'text', name: 'name', label: 'Name' },
                    { type: 'text', name: 'email', label: 'Email' },
                    { type: 'text', name: 'login', label: 'Login' },
                    { type: 'password', name: 'password', label: 'Password' },
                    {
                        type: 'password', name: 'confirmPassword', label: 'Password(2)', placeholder: 'one more time',
                    },
                    { type: 'submit', name: 'submit', label: 'Sign up' },
                ]}
            />
            <OAuthIcons />
            <p className="diff-auth-option-link">
                Already have an account?&nbsp;
                <Link href="/sign-in">
                    Sign in
                </Link>
            </p>
        </>
    );
};

export default withStoreProvider(SignUp);
