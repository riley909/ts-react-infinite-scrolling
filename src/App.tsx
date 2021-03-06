import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const App = () => {
  //? 렌더링할 데이터를 담을 변수
  const [result, setResult] = useState<any | any[]>({
    data: { userFeeds: [] },
  });
  //? axios로 불러온 데이터 전체를 담을 변수
  const [item, setItem] = useState<any | any[]>([]);
  //? 로딩. 데이터를 받아왔는지 판별
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMoreData = async () => {
    const lastIdx = result.data.userFeeds.length - 1;
    const lastItem = result.data.userFeeds[lastIdx];
    const feedId = lastItem?.feedId;
    console.log(lastIdx);
    setIsLoading(true);
    await axios
      .post(`https://localhost:5000/feed/lookup`, {
        topicId: 1,
        limit: 10,
        feedId: feedId,
      })
      .then((res) => {
        const response = res.data;
        const newResult = result.data.userFeeds.concat(response.data.userFeeds);
        setResult({
          data: { userFeeds: newResult },
        });
      });
    setIsLoading(false);
  };

  const _infiniteScroll = useCallback(() => {
    //? 화면 높이값
    let scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );

    //? 사용자가 보는 페이지와 전체페이지 최상단과의 차이
    let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

    //? 사용자가 현재 보고있는 높이
    let clientHeight = document.documentElement.clientHeight;

    //? 높이에서 -100을 해서 최하단에 내려오지 않아도 어느 정도 내려오면 데이터를 새로 받아오게 한다
    scrollHeight -= 100;

    if (scrollTop + clientHeight >= scrollHeight && isLoading === false) {
      fetchMoreData();
    }
  }, [isLoading]);

  const getFetchData = async () => {
    await axios
      .post(`https://localhost:5000/feed/lookup`, { topicId: 1, limit: 10 })
      .then((res) => {
        let response = res.data;
        console.log("response", response);
        setResult({
          data: { userFeeds: response.data.userFeeds },
        });
        setIsLoading(false);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };
  console.log("result:", result);

  useEffect(() => {
    getFetchData();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", _infiniteScroll, true);
  }, [_infiniteScroll]);

  if (isLoading && result.data.userFeeds.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {result.data.userFeeds.map((res: any, idx: number) => {
        return (
          <div key={res.feedId}>
            <h2>{idx}</h2>
            <li>feedId: {res.feedId}</li>
            <li>nickName: {res.user.nickName}</li>
            <li>topic: {res.topic}</li>
            <li>
              content: {res.content[0]}
              {res.content[1]}
            </li>
            <li>date: {res.createdAt}</li>
          </div>
        );
      })}
    </div>
  );
};

export default App;
