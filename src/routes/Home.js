import { dbService } from 'fBase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Nweet from 'components/Nweet.js';
import NweetFactory from 'components/NweetFactory';

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

  const getNweets = async () => {
    const q = query(collection(dbService, 'nweets'), orderBy('createdAt', 'desc'));
    onSnapshot(q, snapshot => {
      const nweetObj = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetObj);
    });
  };
  useEffect(() => {
    getNweets();
  }, []);

  return (
    <div>
      <NweetFactory userObj={userObj} />
      <div>
        {nweets.map(nweet => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
            imageUrl={nweet.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
