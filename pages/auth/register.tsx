import { LockOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import Copyright from "../../components/Copyright";
import Link from "next/link";
import { LinkWrapper } from "./style";
import BlankLayout from "../../layout/BlankLayout";
import { api } from '../../services/apiClient';
interface FormValues {
  username: string;
  email: string;
  password: string;
  password2: string;
}

const signUpValidationSchema: Yup.SchemaOf<FormValues> = Yup.object().shape({
  username: Yup.string()
    .required("Display name is required")
    .min(2, "Too short")
    .max(15, "Must be 15 char or less"),
  email: Yup.string().email("Invalid Email").required("Email is required"),
  password: Yup.string()
    .required("No password provided")
    .min(8, "Password is too short - should be 8 chars minimum")
    .matches(/\d+/, "Password must have a number")
    .matches(/[a-z]+/, "Password must have a lowercase")
    .matches(/[A-Z]+/, "Password must have a uppercase")
    .matches(/[!?.@#$%^&*()-+]+/, "Password must have a special char"),
  password2: Yup.string()
    .required("No password provided")
    .min(8, "Password is too short - should be 8 chars minimum")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const Register = () => {
  const router = useRouter();
  const initialValues: FormValues = {
    username: "",
    email: "",
    password: "",
    password2: "",
  };

  const handleSubmit = async (values: FormValues) => {
    const result = await api.post('/users', {
      name: values.username,
      email: values.email,
      password: values.password,
      username: values.username
    })
    router.push("/auth/login");
  };

  return (
    <Container
      sx={{
        marginTop: "3rem",
        // mt: 6,
        height: "calc(100vh - 3rem)",
        textAlign: "center",
      }}
      maxWidth="sm"
    >
      <Avatar
        sx={{
          margin: "1rem auto",
          bgcolor: "primary.main",
          // bgcolor: blue[500],
        }}
      >
        <LockOutlined />
      </Avatar>
      <Typography sx={{ margin: "1rem" }} variant="h4">
        Sign Up
      </Typography>
      {/* //! Bütün formu sarmallıyoruz. Kendi local state i var. ilave olarak state tanımlamıyoruz. Sadece yukarıda const ile initialValues tanımlıyoruz. initial değerleri formik tagi içerisine tanımlıyoruz. */}
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        //! Yup ile hazırladığımız validationu buraya gönderiyoruz.
        validationSchema={signUpValidationSchema}
      >
        {/* //!Bütün formu curly braces içerisine alıyoruz. Ve arrow function kullanarak bütün değişkenleri burada tanımlıyoruz. Ayrıca değerleri destructuring yapmak önemli  */}
        {({
          //!Parametre olarak tanımladığımız (values) değişkenleri TextField içerisinde value değişkenlerine atıyoruz.
          values,
          handleChange,
          //! handleSubmit önce burada, daha sonra Formik içerisinde tanımlıyoruz. Müteakiben fonksiyonu yukarıda oluşturuyoruz.
          handleSubmit,
          //! touched and errors and handleBlur--> validation hatasını almak için eklememiz gerekiyor.
          touched,
          errors,
          //! handleBlur --> focustan yani inputtan çıktığımızda blur oluyor.
          handleBlur,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {/* //! xs={12} --> 12 birim yer kapşlasın */}
                <TextField
                  name="username"
                  label="User Name"
                  variant="outlined"
                  value={values.username}
                  onChange={handleChange}
                  //! onBlur --> focustan çıktıktan sonra
                  onBlur={handleBlur}
                  //! helper text input altındaki validation uyarısı
                  helperText={touched.username && errors.username}
                  //! uyarıyı error şeklinde vermesi için (rengi kırmızı oldu)
                  error={touched.username && Boolean(errors.username)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  variant="outlined"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.email && errors.email}
                  error={touched.email && Boolean(errors.email)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.password && errors.password}
                  error={touched.password && Boolean(errors.password)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password2"
                  label="Password Again"
                  variant="outlined"
                  type="password"
                  value={values.password2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.password2 && errors.password2}
                  error={touched.password2 && Boolean(errors.password2)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      <p>
        Already have an account?
        <Link href="/auth/login">
          <LinkWrapper>Login.</LinkWrapper>
        </Link>
      </p>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default Register;
