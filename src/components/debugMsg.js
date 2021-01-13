import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";
import {useDebugMsg} from "../contexts/debugMsg";

const useStyles = makeStyles({
  debug: {		
		position: "fixed",
		backgroundColor: "rgb(0,0,255,0.5)",	
    top: 0,
    right: 0,
    width: 200,
  },
});

export default function DebugMsg(props){
	const classes = useStyles();
	const [debugMsg] = useDebugMsg();
	
	return (
		<div className={classes.debug}>
			{debugMsg.map( (item, idx)=>{
				return (<div key={idx}>{item}</div>)
			})}
		</div>
	)
}