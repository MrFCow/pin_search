import React, { useLayoutEffect, useState } from "react";

import ImageComponent from "./imageComponent";
import SelectedImageArea from "./selectedImageArea";
import makeStyles from "@material-ui/styles/makeStyles";

// import {useOpenCv} from "opencv-react";
import {useTfjs} from "./useTfjs";

const useStyles = makeStyles({
  root: {
		display: "flex",
		alignItems: "center",
		gap: 10,
	},
});


export default function ImageDisplay(props){
	const classes = useStyles();
	// const {loaded, cv} = useOpenCv();
	const [mouseDown, setMouseDown] = useState(false);
	const {tfLoaded, tf, model} = useTfjs();

	let sourceImgRef = React.createRef();
	const imageRenderWidth = document?.getElementById("source_image")?.width;
	const imageRenderHeight = document?.getElementById("source_image")?.height;

	/*// open CV load from image then show to canvas - not using anymore
	useLayoutEffect(()=>{
		if (loaded && cv && sourceImgRef.current && imageRenderWidth > 0){
			// console.log("Loaded in Image Pairs");
			// console.log(sourceImgRef);
			// console.log(cv);
			// console.log(props.image)
			try{
				const cvImage = cv.imread("source_image");
				// console.log(cvImage);
				// console.log("Loaded Image OK");
				const {width, height} = cvImage.size();
				// console.log(width, height);
				const {x, y, w, h} = props.xywh;
				// console.log(x, y, w, h);
				const rect = new cv.Rect(x*width,
					y*height,
					w*width,
					h*height
				);
				// console.log(rect);
				const selected = cvImage.roi(rect);
				// console.log(selected);
				cv.imshow("selected_portion", selected);
				cvImage.delete();
				selected.delete();
			}
			catch(err){
				// console.error(err);
			}
		}
	}, [loaded, cv, sourceImgRef, props.xywh,
		props.image, imageRenderWidth
	]);
	//*/

	// test tf?
	useLayoutEffect(()=>{
		if (tfLoaded && tf && model && 
			props.image && sourceImgRef.current && 
			!mouseDown && //only when mouse is not draging to reduce mouse movement
			imageRenderWidth > 0){

			try{
				// tf.enableDebugMode()

				// Crop image base on selection
				console.log("sourceImgRef.current:", sourceImgRef.current);
				const imageTensor = tf.browser.fromPixels(sourceImgRef.current); // 3D int32 tensor

				const {x, y, w, h} = props.xywh;
				console.log("xywh:", props.xywh);
				const boxes = [[y,x,y+h,x+w]];
				const boxInd = [0];
				const cropSize = [parseInt(imageRenderHeight*h), parseInt(imageRenderWidth*w)];
				console.log("cropSize (h,w):", cropSize);

				// image expand 4D, so unsqueeze at 0
				const croppedTensor = tf.squeeze(tf.image.cropAndResize(imageTensor.expandDims(0).toFloat(), boxes, boxInd, cropSize, "bilinear"), 0);
				console.log("croppedTensor.shape", croppedTensor.shape);
				const canvas = document.getElementById('selected_portion');
				canvas.style.width = '100%';
				canvas.style.height = '100%';
				const scaleRatio = cropSize[0]/imageRenderHeight/2;
				canvas.height = scaleRatio*cropSize[0];
				canvas.width = scaleRatio*cropSize[1];

				tf.browser.toPixels(croppedTensor.toInt(), canvas);

				// Image Segmentation
				model.segment(croppedTensor).then( output => {
				// model.segment(sourceImgRef.current).then( output => {
					console.log("segment output", output);
					const {legend, height, width, segmentationMap} = output;
					const canvas = document.getElementById('segmented_portion');
					const ctx = canvas.getContext('2d');
					const segmentationMapData = new ImageData(segmentationMap, width, height);
					console.log("segmentationMapData:", segmentationMapData);
					canvas.style.width = '100%';
					canvas.style.height = '100%';
					const scaleRatio = height/imageRenderHeight/2;
					canvas.height = scaleRatio*height;
					canvas.width = scaleRatio*width;
					// ctx.putImageData(segmentationMapData, 0, 0);
					createImageBitmap(segmentationMapData).then(imgData => {
						ctx.drawImage(imgData, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
					});
				});
			}
			catch(err){
				console.error(err);
			}
		}
	},[tfLoaded, model, props.image, sourceImgRef, mouseDown]);
	// },[tfLoaded, tf, model, props.image, sourceImgRef, imageRenderWidth]);
	
	return (
		<div className={classes.root}>
			<ImageComponent {...props} sourceImgRef={sourceImgRef} setMouseDown={setMouseDown}/>
			{/* {selectedImage ? <SelectedImageArea image={selectedImage} /> : null} */}
			<SelectedImageArea />
		</div>
	)
};