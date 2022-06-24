import React, { useContext, useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Container,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import AppContext from "../../ApplicationContext";
import { useStyles } from "../../useStyles";
import TemperatureDetails from "./TemperatureDetails";

export default function WeatherSearch() {
  const [temperature, setTemperature] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { isDarkTheme } = useContext(AppContext);
  const classes = useStyles({ isDarkTheme });
  const callApi = async (data) => {
    const { state, city, zip } = data;
    setIsLoading(true);
    const result = await fetch(
      `${
        window.location.hostname === "localhost"
          ? "http://localhost:5000"
          : "https://www.yashvoza.com"
      }/api/weather-search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state,
          city,
          zip,
        }),
      }
    );
    const { weatherData } = await result.json();
    setIsLoading(false);
    if (weatherData.cod === 200) {
      setIsError(false);
      setTemperature(weatherData);
    } else {
      setIsError(true);
      setTemperature({});
    }
    reset();
  };

  return (
    <Container className={classes.appContainer}>
      <Box className={classes.contentBox}>
        <Card sx={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <CardHeader
            title="Weather App"
            subheader="Enter any of the below details for getting the temperature in celsious to the entered place"
          />
          <Box autoComplete="off" sx={{ width: "50%", margin: "auto" }}>
            <form onSubmit={handleSubmit(callApi)}>
              <Stack direction="column">
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <TextField
                        {...field}
                        error={errors?.city}
                        id="outlined-required"
                        label="City"
                        placeholder="Enter City"
                        sx={{ marginBottom: "1rem" }}
                        helperText={errors?.city && "Enter City"}
                      />
                    );
                  }}
                ></Controller>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextField
                        {...field}
                        id="outlined-required"
                        label="State"
                        placeholder="Enter State"
                        sx={{ marginBottom: "1rem" }}
                        helperText="Enter state only for US"
                      />
                    );
                  }}
                ></Controller>
                <Controller
                  name="zip"
                  control={control}
                  render={({ field }) => {
                    return (
                      <TextField
                        {...field}
                        id="outlined-required"
                        label="Zip"
                        placeholder="Enter Zip"
                        sx={{ marginBottom: "1rem" }}
                        helperText="Enter zip only for US"
                      />
                    );
                  }}
                ></Controller>
              </Stack>
              <Button
                type="submit"
                size="large"
                sx={{ margin: "auto", width: "100%" }}
              >
                Get Details
              </Button>
            </form>
          </Box>
        </Card>

        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "20px",
            }}
          >
            <CircularProgress />
          </div>
        )}
        {Object.keys(temperature) && Object.keys(temperature).length > 0 && (
          <TemperatureDetails {...temperature} />
        )}
        {isError && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Please try again
          </Alert>
        )}
      </Box>
    </Container>
  );
}
