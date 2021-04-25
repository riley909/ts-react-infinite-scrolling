import { useEffect, useState } from "react";
import axios, { Canceler } from "axios";

export default function useSearch(query: string, pageNum: number) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);

  // useEffect(() => {
  //   setResult([]);
  // }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel: Canceler;
    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNum },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setResult((prevResult) => {
          return [...prevResult, ...res.data.docs.map((r: { title: any }) => r.title)];
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
        console.log(res.data);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNum]);

  return { loading, error, result, hasMore };
}
