import * as Yup from 'yup';
import { ApiResponse } from './general';

export type SignUpInputs = {
    name?: string,
    email: string,
    login: string,
    password: string,
    confirmPassword: string,
};

export const SignUpSchema = Yup.object().shape({
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
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Please input your password'),
});

export type SignUpResponse =
    (ApiResponse<{ id: string }> & { status: 'ok' }) |
    (ApiResponse<Yup.ValidationError> & { status: 'error' });
