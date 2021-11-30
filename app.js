import { upload } from './upload';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAcMFqqXUjOyjhe5NnfHK_KcOYK3rRkqek",
  authDomain: "fe-upload-c9397.firebaseapp.com",
  projectId: "fe-upload-c9397",
  storageBucket: "fe-upload-c9397.appspot.com",
  messagingSenderId: "1063373761265",
  appId: "1:1063373761265:web:5666ad98c9f3fa4fec5750"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage();

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg','.jpeg','.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const metadata = {
        contentType: 'image/jpeg'
      };
      const storageRef = ref(storage, 'images/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      
      uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        const block = blocks[index].querySelector('.preview-info-progress');
        block.textContent = `${+progress}%`;
        block.style.width = `${progress}%`;
      },
      (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
            break;
            case 'storage/canceled':
              // User canceled the upload
            break;
            // ...
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
            }
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
      );
    })
  }
});