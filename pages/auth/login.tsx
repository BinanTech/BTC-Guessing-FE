import * as React from "react";
import BlankLayout from "../../layout/BlankLayout";
import { ReactNode } from "react";
import { LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Copyright from "../../components/Copyright";
import { LinkWrapper } from '../../components/style';
import { useAuth } from '../../hooks/useAuth';

interface FormValues {
  email: string;
  password: string;
}

const signUpValidationSchema: Yup.SchemaOf<FormValues> = Yup.object().shape({
  email: Yup.string().email('Invalid Email').required('Email is required'),
  password: Yup.string()
    .required('No password provided')
    .min(8, 'Password is too short - should be 8 chars minimum')
    .matches(/\d+/, 'Password must have a number')
    .matches(/[a-z]+/, 'Password must have a lowercase')
    .matches(/[A-Z]+/, 'Password must have a uppercase')
    .matches(/[!?.@#$%^&*()-+]+/, 'Password must have a special char'),
  password2: Yup.string()
});

const Login = () => {
  const initialValues: FormValues = {
    email: '',
    password: ''
  };

  const { signIn } = useAuth();

  const handleSubmit = async (values: FormValues) => {
    await signIn({ ...values });
  };

  return (
    <Container
      sx={{
        marginTop: '3rem',
        // mt: 6,
        height: 'calc(100vh - 3rem)',
        textAlign: 'center'
      }}
      maxWidth='sm'
    >
      <Avatar
        sx={{
          margin: '1rem auto',
          bgcolor: 'primary.main'
          // bgcolor: blue[500],
        }}
      >
        <LockOutlined />
      </Avatar>
      <Typography sx={{ margin: '1rem' }} variant='h4'>
        Login
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={signUpValidationSchema}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          touched,
          errors,
          handleBlur
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField name='email' label='Email' variant='outlined' value={values.email} onChange={handleChange} onBlur={handleBlur} helperText={touched.email && errors.email} error={touched.email && Boolean(errors.email)} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField name='password' label='Password' type='password' value={values.password} onChange={handleChange} onBlur={handleBlur} helperText={touched.password && errors.password} error={touched.password && Boolean(errors.password)} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Button type='submit' variant='contained' color='primary' fullWidth>
                  Login
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      <p>
        Don't have an account yet?
        <Link href='/auth/register'>
          <LinkWrapper>Register.</LinkWrapper>
        </Link>
      </p>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

Login.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default Login;
