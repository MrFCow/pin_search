import React, {useState, useEffect} from "react";
import * as tf from '@tensorflow/tfjs';
import {useDebugMsg} from "../contexts/debugMsg";

// Prepare Context
const Tfjsontext = React.createContext();
const { Consumer: TfjsConsumer, Provider } = Tfjsontext;

export { TfjsConsumer, Tfjsontext };

export const TfjsProvider = ({modelUrl, modelMetaUrl, children}) => {
	const [tfLoaded, setTfLoaded] = useState(false);
	const [metadata, setMetadata] = useState();
	const [model, setModel] = useState();

	const [debugMsg, setDebugMsg] = useDebugMsg();
	//Model and metadata URL
	let url = {
		model: modelUrl || 'https://tfhub.dev/tensorflow/tfjs-model/deeplab/pascal/1/default/1',
		metadata: modelMetaUrl || 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json',
	};

	async function loadModel(url) {
		try {
			const model = await tf.loadLayersModel(url.model);
			setModel(model);
			const msg = "TF model loaded";
			setDebugMsg([...debugMsg, msg]);
			console.log(msg);
		} 			
		catch (err) {
			console.log(err);
		}
	}

	async function loadMetadata(url) {
		try {
			const metadataJson = await fetch(url.metadata);
			const metadata = await metadataJson.json();
			setMetadata(metadata);
			const msg = "TF model meta loaded";
			setDebugMsg([...debugMsg, msg]);
			console.log(msg);
		}
		catch (err) {
			console.log(err);
		}
	}

	useEffect(()=>{
		tf.ready().then(()=>{
			setTfLoaded(true);
			loadModel(url);
			loadMetadata(url);
		});
	},[]);

	const memoizedProviderValue = React.useMemo(
    () => ({ tfLoaded, tf: tf, model: model }),
    [tfLoaded, model]
	);
	
	return <Provider value={memoizedProviderValue}>{children}</Provider>
}

export const useTfjs = () => React.useContext(Tfjsontext);