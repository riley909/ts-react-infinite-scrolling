import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const App = () => {
  //? 렌더링할 데이터를 담을 변수
  const [result, setResult] = useState<any | any[]>([]);
  //? axios로 불러온 데이터 전체를 담을 변수
  const [item, setItem] = useState<any | any[]>([]);
  //? 로딩. 데이터를 받아왔는지 판별
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMoreData = async () => {
    setIsLoading(true);
    setResult(result.concat(item.slice(0, 20)));
    setItem(item.slice(20));
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
      .get(
        `http://openlibrary.org/search.json?author=tolkien
    `
      )
      .then((res) => {
        let response = res.data.docs;
        console.log(response);
        setResult(response.slice(0, 20));
        response = response.slice(20);
        setItem(response);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {result.map((res: any, idx: number) => {
        console.log(res.name);
        return (
          <div key={res.id}>
            <h2>
              {idx}. &nbsp;{res.title}
            </h2>
            <ul>
              <li>Author Name: {res.author_name}</li>
              <li>First Publish Year: {res.first_publish_year}</li>
              <li>E-Book Count: {res.ebook_count_i}</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default App;
