import React, {useState} from "react";
import { useDrag } from "react-use-gesture";
import useDimensions from "react-use-dimensions";
import makeStyles from "@material-ui/styles/makeStyles";

const maxWidth = 300;

const useStyles = makeStyles({
  root: {
		width: maxWidth,
		position: "relative",
		backgroundColor: "rgb(0,0,0,0.5)",	
		marginLeft:50,
	},
	box: {
		position: "absolute",
		backgroundColor: "rgba(0,155,0,0.5)",
	},
	img: {
		"-webkit-user-drag": "none",
		"-khtml-user-drag": "none",
		"-moz-user-drag": "none",
		"-o-user-drag": "none",
		"user-drag": "none",
		maxWidth: maxWidth,
	}
})

export default function ImageComponent(props){
	const classes = useStyles();
	const [ref, dimensions] = useDimensions();

	const [pos, setPos] = useState({
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0,
		});

	
	const bind = useDrag(({ args: [dimensions], down, movement: [movX, movY], offset: [offX, offY], initial: [initX, initY] }) => {
			// console.log("init", initX, initY);
			// console.log("mov", movX, movY);
			// console.log("off", offX, offY);

			let startX = initX - dimensions.x;
			let startY = initY - dimensions.y;

			let endX = initX - dimensions.x + movX;
			let endY = initY - dimensions.y + movY;

			if (endX < 0){
				endX = 0;
			}
			else if (endX > dimensions.width ){
				endX = dimensions.width;
			}

			if (endY < 0){
				endY = 0;
			}
			else if (endY > dimensions.height){
				endY = dimensions.height;
			}

			setPos({
				startX: startX,
				startY: startY,
				endX: endX,
				endY: endY
			});

			props.setSearchArgs({
				x: Math.min(startX, endX) / dimensions.width,
				y: Math.min(startY, endY) / dimensions.height,
				w: Math.abs(startX - endX) / dimensions.width,
				h: Math.abs(startY - endY) / dimensions.height
			})
		},
		// options
		{ 
			delay: true, // allowing click for generated div
			// bounds: { left: 0, right: dimensions.width, top: 0, bottom: dimensions.height },
		}, 
	);

	return (
		<div className={classes.root} ref={ref} {...bind(dimensions)} style={{touchAction: "none"}}>
				<img className={classes.img} alt="" src={props.image}/>
				{Math.abs(pos.startX - pos.endX) * Math.abs(pos.startY - pos.endY) > 0 ? (<div 
					className={classes.box} 
					style={{
						width: Math.abs(pos.startX - pos.endX), 
						height: Math.abs(pos.startY - pos.endY),
						left: Math.min(pos.startX, pos.endX),
						top: Math.min(pos.startY, pos.endY),
					}}
					// onClick={e=>console.log("clicked")}
				/>) : null}
			</div>
	)	
}
