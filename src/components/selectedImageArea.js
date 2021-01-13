import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";


const useStyles = makeStyles({
  root: {
		position: "relative",
		display: "flex",
		flexDirection: "column",
	},
});

export default function SelectedImageArea(props){
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<canvas id="selected_portion" alt="Selected portion of image"/>
			<canvas id="segmented_portion" alt="Segmented portion of image"/>
		</div>
	)
};