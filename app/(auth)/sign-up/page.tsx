'use client';

import { ApiResponse } from 'api-types/general';
import { SignUpInputs, SignUpSchema } from 'api-types/signup';
import axios, { AxiosError, AxiosResponse } from 'axios';
import PopUpNotification from 'components/PopUpNotification/PopUpNotification';
import { StyledForm, StyledFormTypes } from 'components/StyledForm';
import Link from 'next/link';
import fonts from 'scss/fonts';

export default function SignUp() {
    const submitHandler: StyledFormTypes.Handler<SignUpInputs> = (
        values,
        actions,
    ) => {
        const res = axios.post<SignUpInputs, AxiosResponse<ApiResponse>>('/api/auth/signup', values);
        res.then((r) => {
            console.log(r.data.payload);
        }).catch((e: AxiosError<ApiResponse>) => {
            console.log(e.response?.data.message);
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
            <PopUpNotification />
        </>
    );
}
