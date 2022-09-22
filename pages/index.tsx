import { useEffect, useState, useRef } from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  Box,
  Grid,
  Button
} from "@mui/material";
import ProTip from "../components/ProTip";
import Copyright from "../components/Copyright";
import { useAuth } from "../hooks/useAuth";
import LinearProgressWithLabel from "../components/LinearProgressWithLabel";

import { io } from "socket.io-client";
import Cookies from "js-cookie";

import { withSSRAuth } from "../utils/withSSRAuth";
import { setupAPIClient } from "../services/api";

interface Score {
  score?: string;
  userId: string;
  _id: string;
  oldPrice: string;
  currentPrice: string;
}

const socket = io(process.env.NEXT_BACKEND_URL as string, {
  query: {
    token: Cookies.get("nextauth.token"),
  },
  path: "",
  transports: ["websocket"],
});

const period = process.env.NEXT_PERIOD
  ? parseInt(process.env.NEXT_PERIOD) - 1
  : 59;

const refinePrice = (score: string): string => {
  if (!score) return "0";
  return (Math.floor(parseFloat(score) * 100) / 100).toString();
};

const Home: NextPage = () => {
  const { user, guess, initialPrice, signOut } = useAuth();
  const [price, setPrice] = useState<string>(initialPrice);
  const [score, setScore] = useState<string | undefined>(
    guess?.score ? guess.score : "0"
  );
  const [previousPrice, setPriviousPrice] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const [prediction, setPrediction] = useState<string>("");
  const timer: { current: NodeJS.Timeout | null } = useRef(null);

  useEffect(() => {
    setPrice(initialPrice);
    setScore(guess?.score ? guess.score : "0");
  }, [guess, initialPrice]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("score", (data: string) => {
      const score: Score = JSON.parse(data);
      setScore(score?.score ? score.score : "0");
      setPrice(score.currentPrice);
      setPriviousPrice(score.oldPrice);
      setDisabled(false);
      setCounter(0);
      setPrediction("");
    });

    socket.on("recieved", (data: string) => {
      setDisabled(true);
    });
  }, []);

  useEffect(() => {
    if (!disabled && !timer.current) {
      timer.current = setInterval(() => setCounter((prev) => prev + 1), 1000);
      setPrediction("");
    }
  }, [disabled]);

  useEffect(() => {
    if (counter > period) {
      clearInterval(timer.current as NodeJS.Timeout);
      timer.current = null;
      setDisabled(true);
    }
  }, [counter]);

  const sendGuess = (value: string) => {
    setPrediction(value);
    socket.emit(
      "guess",
      JSON.stringify({
        userId: user?._id,
        guess: value,
      })
    );
  };

  const logout = async () => {
    if (socket.connected) await socket.disconnect();
    await signOut();
  };

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
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ position: "relative" }}
        >
          Guessing Price
        </Typography>
        <Button
          sx={{ position: "absolute", top: "10px", right: "10px" }}
          onClick={async () => await logout()}
        >
          Log out
        </Button>
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
            <Typography component="h2">User Name: {user?.username}</Typography>
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
            <Typography component="h2">Your Score: {score}</Typography>
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
            <Typography component="h2">
              Previous BTC Price: {refinePrice(previousPrice)}
            </Typography>
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
            <Typography component="h2">
              Current BTC Price: {refinePrice(price)}
            </Typography>
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
            {prediction && (
              <Typography component="h2">
                Your guess is "Price will be {prediction}"
              </Typography>
            )}
            {!prediction && (
              <Typography component="h2">
                Please click the below button
              </Typography>
            )}
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
              <Button onClick={() => sendGuess("up")} disabled={disabled}>
                Up
              </Button>
              <Button onClick={() => sendGuess("down")} disabled={disabled}>
                Down
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ width: "100%" }}>
                <LinearProgressWithLabel value={counter} />
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

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  await apiClient.get("/auth/me");

  return {
    props: {},
  };
});

export default Home;
