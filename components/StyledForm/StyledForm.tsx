import {
    ErrorMessage, Field, Form, Formik, FormikErrors, FormikValues,
} from 'formik';
import './StyledForm.scss';
import { StyledFormProps } from './types';

const StyledForm = <Values extends FormikValues>(
    {
        initialValues, yupValidationSchema, onSubmit, className, inputsList, externalErrors = {},
    }: StyledFormProps<Values> & { externalErrors?: FormikErrors<Values> },
) => (
    <Formik
        initialValues={initialValues}
        validationSchema={yupValidationSchema}
        onSubmit={onSubmit}
    >
        {
            ({
                errors, touched, isSubmitting, setFieldError,
            }) => {
                if (externalErrors) {
                    Object.entries(externalErrors).forEach(([field, err]) => {
                        if (typeof err === 'string') {
                            setFieldError(field, err);
                        }
                        // eslint-disable-next-line no-param-reassign
                        delete externalErrors[field];
                    });
                }
                return (
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
                                    <Field name={name} type="submit" value={label} disabled={anyError || isSubmitting || Object.keys(touched).length === 0} key={id} />
                                );
                            })
                        }
                    </Form>
                );
            }
        }
    </Formik>
);

export default StyledForm;
