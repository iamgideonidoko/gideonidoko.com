import { useState, useEffect } from 'react';
import { renameFileWithPrefix } from '../../helper';

const useStorage = (file, projectStorage, addAsset, currentAdminUsername, currentAdminName) => {
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);
	const [url, setUrl] = useState(null);

	useEffect(() => {
		//get a new filename
		const newFileName = renameFileWithPrefix(file.name);

		//references
		const storageRef = projectStorage.ref(newFileName);
		
		storageRef.put(file).on('state_changed', (snap) => {
			let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
			setProgress(percentage);
		}, err => {
			setError(err);
		}, async () => {
			const url = await storageRef.getDownloadURL();
			const newAsset = {
				name: newFileName, 
				url, 
				size: file.size, 
				file_type: file.type,
				author_username: currentAdminUsername,
				author_name: currentAdminName
			};
			addAsset(newAsset);
			setUrl(url);
		})
	}, [file]);

	return { progress, url, error };

}

export default useStorage;
