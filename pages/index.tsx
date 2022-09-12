import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  Box,
  Grid,
  Button,
  LinearProgress,
  LinearProgressProps,
} from "@mui/material";
import Link from "../src/Link";
import ProTip from "../src/ProTip";
import Copyright from "../src/Copyright";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const Home: NextPage = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Please guess the price
        </Typography>
        <Grid container spacing={1}>
          <Grid
            item
            spacing={3}
            mt={3}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Typography component="h2">User Name: name</Typography>
          </Grid>
          <Grid
            item
            spacing={3}
            mt={3}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Typography component="h2">BTC Price: 1300$</Typography>
          </Grid>
          <Grid
            item
            spacing={3}
            mt={3}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              item
              xs={12}
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Button>Up</Button>
              <Button>Down</Button>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ width: "100%" }}>
                <LinearProgressWithLabel value={50} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
};

export default Home;
