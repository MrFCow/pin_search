import React, {useState} from "react";

import ImageGridList from "./resultGrid";
import ImagePairs from "./imagePairs";

import searchPinterest from "../utils/queryPinterest";
import dataURLtoBlob from "../utils/dataUrlToBlob";



export default function Main(props){
	const [image, setImage] = useState(null); //base64 string content
	const [xywh, setXywh] = useState({x: 0, y: 0, w: 1, h: 1});
	const [isReadingImg, setIsReadingImg] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [searchResult, setSearchResult] = useState(null);

	const fileInput = React.createRef();

	const handleLoad = () => {
		const fileToUpload = fileInput.current.files[0];

		const fileReader = new FileReader();

		fileReader.onloadstart = async () => {
			// console.log(fileToUpload);
			setIsReadingImg(true);
		}

		fileReader.onloadend = async () => {
			setImage(fileReader.result);
			// console.log(fileReader.result)
			setIsReadingImg(false);
		}
		fileReader.onerror = function (e) {
			console.error(e);
			setIsReadingImg(false);
		};

		// Read content - base 64
		fileReader.readAsDataURL(fileToUpload);
	};

	const handleSearch = () => {
		// prepare form data
		let formData = new FormData();
		const fileToUpload = fileInput.current.files[0];
		const imageBlob = dataURLtoBlob(image);
		formData.append("image", imageBlob, fileToUpload.name);
		// formData.append("x", "0");
		// formData.append("y", "0");
		// formData.append("w", "1.0");
		// formData.append("h", "1.0");
		formData.append("x", xywh.x.toString());
		formData.append("y", xywh.y.toString());
		formData.append("w", xywh.w.toString());
		formData.append("h", xywh.h.toString());

		// for (let key of formData.entries()) {
		// 	console.log(key[0] + ', ' + key[1]);
		// }

		setIsSearching(true);
		const result = searchPinterest(formData);
		result.then(resultData => {
			// console.log(resultData);
			setSearchResult(resultData.data);
			setIsSearching(false);
		}).catch(err => {
			setIsSearching(false);
		});

			
	};

	return (
		<div>
			<input type="file" id="myfile" name="myfile" ref={fileInput} onChange={handleLoad}/>
			{isReadingImg ? <div>...Loading</div> : null}
			<div>
				{image ? <div>
					<ImagePairs image={image} xywh={xywh} setSearchArgs={setXywh}/>	
					{isSearching ? <div>...Searching</div> : <button onClick={handleSearch}>Search</button>}
				</div> : 
				<div>No image</div>}
			</div>
			<div>
				<div>Results:</div>
				{searchResult?.data ? <ImageGridList data={searchResult.data} /> : null }
			</div>
		</div>
	);
};