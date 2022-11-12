'use client';

import Link from 'next/link';
import * as Yup from 'yup';
import { StyledForm, StyledFormTypes } from '../../../components/StyledForm';
import fonts from '../../../scss/fonts';

type SignInInputs = {
    name?: string,
    email: string,
    login: string,
    password: string,
    confirmPassword: string,
};

const SignInSchema = Yup.object().shape({
    name: Yup.string()
        .ensure()
        .trim()
        .max(30, 'Name shouldn&apos;t be longer than 30 symbols'),
    email: Yup.string()
        .email('Please enter a valid e-mail')
        .required('E-mail is required'),
    login: Yup.string()
        .trim()
        .min(2, 'Login shoud be longer than 1 symbol')
        .max(30, 'Login shouldn&apos;t be longer than 30 symbols')
        .matches(/^[a-z0-9_-]+$/i, 'Numbers and english letters only')
        .required('Login is required'),
    password: Yup.string()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password shoud be minimum 8 characters and contain at least one letter and a number')
        .required('Please input your password'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please input your password'),
});

export default function SignUp() {
    const submitHandler: StyledFormTypes.Handler<SignInInputs> = (
        values,
        actions,
    ) => {
        console.log(values);
        actions.setSubmitting(false);
    };
    return (
        <>
            <h1 className={`form-title ${fonts.lora.className}`}>Sign Up</h1>
            <StyledForm<SignInInputs>
                yupValidationSchema={SignInSchema}
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
}
