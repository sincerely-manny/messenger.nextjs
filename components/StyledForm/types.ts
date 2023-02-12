import { HTMLProps } from 'react';
import {
    FormikConfig, FormikValues, FormikHelpers,
} from 'formik';
import * as Yup from 'yup';

export type StyledFormProps<Values extends FormikValues> = Omit<HTMLProps<HTMLFormElement>, 'onSubmit'> & {
    yupValidationSchema: Yup.Schema<Values>,
} & FormikConfig<Values> & {
    inputsList:
    {
        type: 'text' | 'password' | 'submit',
        name: string,
        placeholder?: string,
        label?: string,
        id?: string,
    }[],
};

export type Handler<Values extends FormikValues> = (
    values: Values,
    actions: FormikHelpers<Values>
) => void;
