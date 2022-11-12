import {
    Formik, Field, Form, ErrorMessage, FormikValues,
} from 'formik';
import { StyledFormProps } from './types';
import './StyledForm.scss';

export default function StyledForm<Values extends FormikValues>(props: StyledFormProps<Values>) {
    const {
        initialValues, yupValidationSchema, onSubmit, className, inputsList,
    } = props;
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={yupValidationSchema}
            onSubmit={onSubmit}
        >
            { ({ errors, touched }) => (
                <Form className={`styled-form ${className || ''}`}>
                    {
                        inputsList.map((input) => {
                            const id = input.id ? input.id : `input-${input.name}`;
                            const {
                                type, name, label, placeholder,
                            } = input;

                            if (input.type !== 'submit') {
                                return (
                                    <label htmlFor={id} key={id}>
                                        {label}
                                        <Field
                                            name={name}
                                            id={id}
                                            type={type}
                                            className={errors[name] && touched[name] ? 'invalid' : ''}
                                            placeholder={placeholder}
                                        />
                                        <ErrorMessage name={name} component="span" />
                                    </label>
                                );
                            }
                            const anyError = inputsList.some(({ name: n }) => errors[n]);
                            return (
                                <Field name="submit" type="submit" value="Sign in" disabled={anyError} key={id} />
                            );
                        })
                    }
                </Form>
            )}
        </Formik>
    );
}
