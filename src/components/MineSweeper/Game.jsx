import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardActions,
  CardHeader,
  Container,
  Popover,
  Typography,
} from "@mui/material";
import { isBrowser, isMobile } from "react-device-detect";
import { useStyles } from "../../useStyles";
import Panel from "./Panel";
import { GameContextProvider } from "./GameContext";
import Settings from "./Settings";
import Details from "./Details";

export default function Minesweeper() {
  const classes = useStyles();

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [gameState, setGameState] = useState("new");
  const [flagsMarked, setFlagsMarked] = useState(0);
  const [newGame, setNewGame] = useState(false);
  const [cellStates, setCellStates] = useState([]);
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [pauseButtonClicked, setPauseButtonClicked] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  console.log(isBrowser, isMobile);

  function toggle() {
    setIsActive(!isActive);
  }

  function resetTimer() {
    setSeconds(0);
    setIsActive(false);
  }
  const resetGame = () => {
    setGameState("new");
    setFlagsMarked(0);
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <GameContextProvider
      value={{
        toggle,
        resetTimer,
        seconds,
        gameState,
        setGameState,
        flagsMarked,
        setFlagsMarked,
        newGame,
        setNewGame,
        resetGame,
        cellStates,
        setCellStates,
        skillLevel,
        setSkillLevel,
        isActive,
        pauseButtonClicked,
        setPauseButtonClicked,
      }}
    >
      <Container className={classes.appContainer}>
        <Card raised={true} className={classes.contentBox}>
          {!isBrowser && (
            <Alert variant="filled" severity="warning">
              <AlertTitle>Warning</AlertTitle>
              This game uses right click for selection of mines and so it is not
              mobile or tablet compatible.
            </Alert>
          )}
          <Card>
            <CardHeader
              title="Minesweeper"
              subheader="Select the skill level and continue to play the game"
            ></CardHeader>
            <CardActions>
              <Button
                size="small"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                aria-describedby={"directions"}
              >
                How To Play
              </Button>
            </CardActions>
            <Popover
              id="directions"
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Typography sx={{ p: 2 }} align="center">
                To Play:
              </Typography>
              <Typography sx={{ p: 2 }}>
                Click on a cell to reveal. When a cell reveals a number, this
                number indicates the number of adjacent mines. Right click on a
                cell to flag a mine.
              </Typography>
              <Typography sx={{ p: 2 }} align="center">
                TO WIN:
              </Typography>
              <Typography sx={{ p: 2 }}>
                Reveal all the cells that do not contain mines!
              </Typography>
              <Typography sx={{ p: 2 }} align="center">
                Change Difficulty
              </Typography>
              <Typography sx={{ p: 2 }}>
                To change the level of difficulty, toggle between the 3 options
                provided (Beginner, Intermediate and Expert)
              </Typography>
            </Popover>
            <Settings />
            <Details />
            {gameState === "lost" && (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                Sorry, you lost, please click play again to try again !!!!
              </Alert>
            )}
            {gameState === "won" && (
              <Alert variant="filled" severity="success">
                <AlertTitle>Success</AlertTitle>
                Congrats, you won !!!!
              </Alert>
            )}
            <Panel />
          </Card>
        </Card>
      </Container>
    </GameContextProvider>
  );
}
