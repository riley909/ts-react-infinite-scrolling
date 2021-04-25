import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import axios from "axios";

const App = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [ref, inView] = useInView();

  // 서버에서 아이템을 가져오는 함수
  // TODO: useCallback과 useEffect의 역할?
  const getItems = useCallback(async () => {
    setLoading(true);
    await axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: {
        q: "blue",
        page: page,
      },
    }).then((res) => {
      console.log(res);
      setItems((prevState): any => [
        ...prevState,
        ...res.data.docs.map((r: { title: any }) => r.title),
      ]);
    });
    setLoading(false);
  }, [page]);

  // getItems가 바뀔때마다 함수 실행
  useEffect(() => {
    getItems();
  }, [getItems]);

  useEffect(() => {
    // 사용자가 마지막 요소를 보고있고, 로딩중이 아니라면
    if (inView && loading) {
      setPage((prevState) => prevState + 1);
    }
  }, [inView, loading]);

  return (
    <div className="list">
      {items.map((item, idx) => (
        <div key={idx}>
          {items.length - 1 == idx ? (
            <div className="list-item" ref={ref}>
              {item}
            </div>
          ) : (
            <div className="list-item">{item}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
