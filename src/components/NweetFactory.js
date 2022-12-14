import { dbService, storageService } from 'fBase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NweetFactory = ({ userObj }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState('');
  const onSubmit = async event => {
    event.preventDefault();
    let imageUrl = '';
    try {
      if (imageFile !== '') {
        const imageRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        // * npm install uuid는 기본적으로 어떤 특별한 식벽자를 랜덤으로 생성해줌
        const response = await uploadString(imageRef, imageFile, 'data_url');
        imageUrl = await getDownloadURL(response.ref);
        // * getDownloadURL은 Promise를 리턴하는데, Promise는 "날 기다려줘"라는 의미로 await이 필요
      }
      const nweetObj = {
        text,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        imageUrl,
      };
      await addDoc(collection(dbService, 'nweets'), nweetObj);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
    setText('');
    setImageFile('');
  };
  const onChange = event => {
    const {
      target: { value },
    } = event;
    setText(value);
  };
  const onFileChange = event => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    // TODO fileReader API 사용할 것임 : 말 그대로 파일 이름을 읽음
    const reader = new FileReader();
    reader.onloadend = finishedEvent => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setImageFile(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearImage = () => setImageFile('');
  return (
    <form onSubmit={onSubmit}>
      <input
        value={text}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="submit" value="Ntweet" />
      {imageFile && (
        <div>
          <img src={imageFile} width="50px" height="50px" />
          <button onClick={onClearImage}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
