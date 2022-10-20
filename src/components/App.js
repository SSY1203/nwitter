import AppRouter from "components/Router";
import React, { useEffect, useState } from "react";
import { authService } from "fBase";

function App() {
  const [init, setInit] = useState(false);
  // * init은 firebase가 프로그램을 초기화하길 기다리기 위한 역할

  const [isLogggedIn, setIsLoggedIn] = useState(false);
  // * 여기서 로그인을 알아차릴 수 없는 이유는 실행이 빠르기 때문에 firebase가 초기화하는 속도가 실행 속도를 따라갈 수 없음
  // * 그래서 firebase가 초기화 되지 않은 상태로 보고 실행 되므로 로그아웃으로 봄

  const [userObj, setUserObj] = useState(null);
  // * 누가 로그인한건지 받아오기 위한 변수
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // * onAuthStateChanged란?
      // * User의 로그인 상태의 변화를 관찰하는 메소드
      // * EventListener이고 User 상태에 변화가 있을 때, 변화를 알아차림
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user); // * 로그인 되면 호출
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter userObj={userObj} isLogggedIn={isLogggedIn} />
      ) : (
        "Initailizing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
