import React, { useEffect, useRef, useState } from 'react';
import { authService, dbService, storageService } from 'fBase';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { updateProfile } from '@firebase/auth';

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [image, setImage] = useState(userObj.photoURL);
  // const [updateProfile, setUpdateProfile] = useState();
  const navigator = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigator('/');
  };

  const getMyNweets = async () => {
    const q = query(
      collection(dbService, 'nweets'),
      where('creatorId', '==', userObj.uid),
      orderBy('createdAt', 'desc'),
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  const onChange = event => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async event => {
    event.preventDefault();
    let imageUrl = '';

    if (userObj.photoURL !== image) {
      const imageRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(imageRef, image, 'data_url');
      imageUrl = await getDownloadURL(response.ref);
      await updateProfile(authService.currentUser, {
        photoURL: imageUrl,
      });
    }
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
    }
    refreshUser();
  };
  const onFileChange = event => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = finishedEvent => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setImage(result);
    };
    reader.readAsDataURL(theFile);
  };

  const fileInput = useRef();

  const onClear = async () => {
    fileInput.current.value = '';
    setImage('https://intermusicakorea.com/common/img/default_profile.png');
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="file" accept="image/*" ref={fileInput} onChange={onFileChange} />
        {image && (
          <div>
            <img id="image-file" src={image} width="50px" height="50px"></img>
            <button onClick={onClear}>Clear</button>
          </div>
        )}
        <input onChange={onChange} type="text" placeholder="Display Name" value={newDisplayName} />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;

// * 아이패드에 수정 (firestore의 규칙을 수정)
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if true;
//     }
//   }
// }
