'use client';

import Link from 'next/link';
import * as Yup from 'yup';
import { StyledForm, StyledFormTypes } from '../../../components/StyledForm';
import fonts from '../../../scss/fonts';

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

export default function SignIn() {
    const submitHandler: StyledFormTypes.Handler<SignInInputs> = (
        values,
        actions,
    ) => {
        console.log(values);
        actions.setSubmitting(false);
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
}
