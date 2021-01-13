import React from "react";

const DebugMsgContext = React.createContext();

function useDebugMsg() {
  const context = React.useContext(DebugMsgContext);
  if (!context) {
    throw new Error(`useCount must be used within a DebugMsgProvider`)
  }
  return context
}

function DebugMsgProvider(props) {
  const [debugMsg, setDebugMsg] = React.useState([]); // list of strings in message
  const value = React.useMemo(() => [debugMsg, setDebugMsg], [debugMsg])
  return <DebugMsgContext.Provider value={value} {...props} />
}

export {DebugMsgProvider, useDebugMsg}