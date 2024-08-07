import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormData } from '../context/FormDataContext';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Required'),
  username: Yup.string().required('Required'),
  phone: Yup.string().matches(/^[0-9]+$/, 'Must be only digits').required('Required'),
  age: Yup.number().required('Required').positive().integer(),
});

const FormPage = () => {
  const router = useRouter();
  const { setFormData } = useFormData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }


  const handleSubmit = (values) => {
    setFormData(values);
    router.push('/second');
  };


  return (
    mounted&&(
    <Layout>
      <h1>Form Page</h1>
      <Formik
        initialValues={{ email: '', username: '', phone: '', age: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label>Email</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <label>Username</label>
            <Field type="text" name="username" />
            <ErrorMessage name="username" component="div" />
          </div>
          <div>
            <label>Phone</label>
            <Field type="text" name="phone" />
            <ErrorMessage name="phone" component="div" />
          </div>
          <div>
            <label>Age</label>
            <Field type="number" name="age" />
            <ErrorMessage name="age" component="div" />
          </div>
          <button type="submit">Save</button>
        </Form>
      </Formik>
    </Layout>
    )
  );
};

export default FormPage;