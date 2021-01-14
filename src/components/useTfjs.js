import React, {useState, useEffect, useCallback, useMemo} from "react";
import * as tf from '@tensorflow/tfjs';
import * as deeplab from '@tfmodels/deeplab';
import {useDebugMsg} from "../contexts/debugMsg";

// const deeplab = tfmodels.deeplab;

// Prepare Context
const Tfjsontext = React.createContext();
const { Consumer: TfjsConsumer, Provider } = Tfjsontext;

export { TfjsConsumer, Tfjsontext };

export const TfjsProvider = ({modelName, quantizationBytes=2, children}) => {
	const [tfLoaded, setTfLoaded] = useState(false);
	const [model, setModel] = useState();

	const [debugMsg, setDebugMsg] = useDebugMsg();

	// let modelObj = useMemo((modelUrl) => ({
	// 	modelUrl: modelUrl || 'https://tfhub.dev/tensorflow/tfjs-model/deeplab/pascal/1/default/1/model.json?tfjs-format=file',
	// }),[]);
	let modelObj = useMemo(()=> ({
		base: modelName,
		quantizationBytes: quantizationBytes,
	}), [modelName, quantizationBytes]);

	const loadModel = useCallback(async (modelDict) => {
		try {
			const model = await deeplab.load(modelDict);
			setModel(model);
			const msg = "TF model loaded";
			setDebugMsg([...debugMsg, msg]);
			console.log(msg);

		} 			
		catch (err) {
			console.log(err);
		}
	}, []);

	useEffect(()=>{
		tf.ready().then(()=>{
			setTfLoaded(true);
			loadModel(modelObj);
		});
	},[modelObj, loadModel]);

	const memoizedProviderValue = useMemo(
    () => ({ tfLoaded, tf: tf, deeplab: deeplab, model: model }),
    [tfLoaded, model]
	);
	
	return <Provider value={memoizedProviderValue}>{children}</Provider>
}

export const useTfjs = () => React.useContext(Tfjsontext);