'use client';

import { ApiResponse } from 'api-types/general';
import { SignUpInputs, SignUpSchema } from 'api-types/signup';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { addNotification } from 'components/PopUpNotifications/slice';
import { StyledForm, StyledFormTypes } from 'components/StyledForm';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import fonts from 'scss/fonts';

const SignUp = () => {
    const dispatch = useDispatch();
    const submitHandler: StyledFormTypes.Handler<SignUpInputs> = (
        values,
        actions,
    ) => {
        const res = axios.post<SignUpInputs, AxiosResponse<ApiResponse>>('/api/auth/signup', values);
        res.then((r) => {
            dispatch(addNotification({
                type: 'success',
                message: JSON.stringify(r.data.payload).replaceAll(',', ' ') || 'Undefined',
                title: 'Sent:',
            }));
        }).catch((e: AxiosError<ApiResponse>) => {
            dispatch(addNotification({
                type: 'error',
                message: e.response?.data.message || 'Error sending data',
            }));
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
            <p className="diff-auth-option-link">
                Already have an account?&nbsp;
                <Link href="/sign-in">
                    Sign in
                </Link>
            </p>
        </>
    );
};

export default SignUp;
