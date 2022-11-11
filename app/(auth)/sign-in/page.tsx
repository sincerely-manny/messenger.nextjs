'use client';

import {
    Formik, Field, Form, ErrorMessage, FormikHelpers, FormikProps,
} from 'formik';
import Link from 'next/link';
import * as Yup from 'yup';
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
    const submitHandler = (
        values: SignInInputs,
        actions: FormikHelpers<SignInInputs>,
    ) => {
        console.log(values);
        actions.setSubmitting(false);
    };
    return (
        <>
            <h1 className={`form-title ${fonts.lora.className}`}>Sign In</h1>
            <Formik
                initialValues={{ login: '', password: '' }}
                validationSchema={SignInSchema}
                onSubmit={submitHandler}
            >
                { ({ errors, touched }: FormikProps<SignInInputs>) => (
                    <Form className="auth-form">
                        <label htmlFor="login">
                            Login
                            <Field name="login" id="login" type="text" className={errors.login && touched.login ? 'invalid' : ''} />
                            <ErrorMessage name="login" component="span" />
                        </label>
                        <label htmlFor="password">
                            Password
                            <Field name="password" id="password" type="password" className={errors.password && touched.password ? 'invalid' : ''} />
                            <ErrorMessage name="password" component="span" />
                        </label>
                        <Field name="submit" type="submit" value="Sign In" disabled={(errors.login || errors.password)} />
                    </Form>
                )}
            </Formik>
            <p className="diff-auth-option-link">
                Don&apos;t have an account?&nbsp;
                <Link href="/sign-up">
                    Sign up
                </Link>
            </p>
        </>
    );
}
