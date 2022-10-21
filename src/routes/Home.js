import { dbService } from "fBase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet.js";

const Home = ({ userObj }) => {
  const [text, setText] = useState("");
  const [nweets, setNweets] = useState([]);
  const [imageFile, setImageFile] = useState();
  const getNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetObj = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetObj);
    });
  };
  useEffect(() => {
    getNweets();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "nweets"), {
        text,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    setText("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setText(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    // TODO fileReader API 사용할 것임 : 말 그대로 파일 이름을 읽음
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setImageFile(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearImage = () => setImageFile(null);
  return (
    <div>
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
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
