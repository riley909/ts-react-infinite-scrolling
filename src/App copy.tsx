import React, { useState, ChangeEvent, FormEvent, useRef, useCallback } from "react";
import useSearch from "./useSearch";

export default function App() {
  const [query, setQuery] = useState("");
  const [pageNum, setPageNum] = useState(1);
  useSearch(query, pageNum);
  const { result, hasMore, loading, error } = useSearch(query, pageNum);

  // const observer = useRef();
  // const lastResultElementRef = useCallback(
  //   (el) => {
  //     if (loading) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting) {
  //         console.log("Visible");
  //       }
  //     });
  //     if (el) observer.current.observe(el);
  //     console.log(el);
  //   },
  //   [loading, hasMore]
  // );

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setPageNum(1);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={handleSearch} />
        <button type="submit">검색</button>
      </form>
      {result.map((res, idx) => {
        return <div key={idx}>{result}</div>;
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </>
  );
}
