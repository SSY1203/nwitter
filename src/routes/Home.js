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

const Home = ({ userObj }) => {
  const [text, setText] = useState("");
  const [nweets, setNweets] = useState([]);
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
      console.log("Document written with ID: ", docRef);
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
  console.log(nweets);
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
        <input type="submit" value="Ntweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.creatorId}>
            <h4>{nweet.text}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
