import {
    Formik, Field, Form, ErrorMessage, FormikValues,
} from 'formik';
import { StyledFormProps } from './types';
import './StyledForm.scss';

const StyledForm = <Values extends FormikValues>(props: StyledFormProps<Values>) => {
    const {
        initialValues, yupValidationSchema, onSubmit, className, inputsList,
    } = props;
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={yupValidationSchema}
            onSubmit={onSubmit}
        >
            { ({ errors, touched, isSubmitting }) => (
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
                                <Field name={name} type="submit" value={label} disabled={anyError || isSubmitting} key={id} />
                            );
                        })
                    }
                </Form>
            )}
        </Formik>
    );
};

export default StyledForm;
