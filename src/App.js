import React, {useState} from "react";
import FormComponent from "./components/form";
import {OpenCvProvider} from "opencv-react";
import makeStyles from "@material-ui/styles/makeStyles";

const VERSION_NUMBER = "4.5.1";
const DEBUG_MODE = true;

const useStyles = makeStyles({
  debug: {		
		position: "fixed",
		backgroundColor: "rgb(0,0,255,0.5)",	
    top: 0,
    right: 0,
    width: 200,
  },
});

function App() {
  const classes = useStyles();

  const [debugMsg, setDebugMsg] = useState("");
  const onLoaded = () => {
    const msg = "OpenCV loaded"
    setDebugMsg(msg);
    console.log(msg);
  }

  return (
    <>
      <OpenCvProvider onLoad={onLoaded} openCvPath={`https://docs.opencv.org/${VERSION_NUMBER}/opencv.js`}>
        <FormComponent/>
      </OpenCvProvider>
      {DEBUG_MODE ? <div className={classes.debug}>{debugMsg}</div> : null}
    </>
  );
}

export default App;
