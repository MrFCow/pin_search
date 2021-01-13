import React from "react";
import FormComponent from "./components/form";

// import {OpenCvProvider} from "opencv-react";
import {TfjsProvider} from "./components/useTfjs";

import {DebugMsgProvider} from "./contexts/debugMsg";
import DebugMsg from "./components/debugMsg";

import {configs} from "./config/config";


function App() {
  // const [debugMsg, setDebugMsg] = useDebugMsg();

  // const onLoaded = () => {
  //   const msg = "OpenCV loaded"
  //   setDebugMsg([...debugMsg, msg]);
  //   console.log(msg);
  // }

  return (
    <>
      <DebugMsgProvider>
        <TfjsProvider modelName="pascal" quantizationBytes={2}>
          {/* <OpenCvProvider onLoad={onLoaded} openCvPath={`https://docs.opencv.org/${configs.VERSION_NUMBER}/opencv.js`}> */}
            <FormComponent/>
          {/* </OpenCvProvider> */}
        </TfjsProvider>
        {configs.DEBUG_MODE ? <DebugMsg/> : null}
      </DebugMsgProvider>
    </>
  );
}

export default App;
