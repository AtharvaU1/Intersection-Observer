import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import "./App.css";
import useDebounce from "./hooks/useDebounce";
import InfiniteScroll from "./InfiniteScroll";
import useDependenciesDebugger from "./hooks/useDependenciesDebugger";

const endpoint = "https://openlibrary.org/search.json";

async function getData(query, pageNumber, abortControllerRef) {
  const params = getUrlSearchParams(query, pageNumber);
  const url = new URL(`${endpoint}?${params}`);
  console.log(url);
  abortControllerRef.current?.abort();
  abortControllerRef.current = new AbortController();
  const response = await fetch(url.href, {
    signal: abortControllerRef.current.signal,
  });
  const data = await response.json();
  return data;
}

const getUrlSearchParams = (query, pageNumber) => {
  const params = new URLSearchParams({ q: query, page: pageNumber, limit: 10 });
  console.log(params);
  return params;
};

function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState("hello there");
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //const isLoading = useRef(false);
  const AbortControllerRef = useRef(null);

  const fetchData = useCallback(
    async function fetchData() {
      let data;
      try {
        data = await getData(query, pageNumber, AbortControllerRef);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        return;
      }
      console.log(data);
      setDocs((curDocs) => [...curDocs, ...data.docs.slice(0, 10)]);
      setIsLoading(false);
    },
    [query, pageNumber]
  );
  const debouncedFn = useDebounce(1000, fetchData);

  const handlePageIncrease = () => {
    if (isLoading) return;
    setPageNumber((pageNumber) => pageNumber + 1);
    setIsLoading(true);
  };

  useEffect(() => {
    debouncedFn();
    return () => {
      AbortControllerRef.current?.abort();
    };
  }, [query, pageNumber, debouncedFn]);

  const handleInputChange = (event) => {
    if (!event || !event.target) {
      console.log(`invalid event: ${event}`);
      return;
    }
    setQuery(event.target.value);
    setIsLoading(true);
    setPageNumber(1);
    setDocs([]);
  };

  const renderDocs = (doc, ref) => {
    return (
      <div key={doc.key} ref={ref}>
        {doc.title}
      </div>
    );
  };

  return (
    <>
      <input onChange={handleInputChange} value={query}></input>
      <InfiniteScroll
        data={docs}
        renderList={renderDocs}
        fetchData={fetchData}
        isLoading={isLoading}
        handlePageIncrease={handlePageIncrease}
        pageNumber={pageNumber}
      />
    </>
  );
}

export default App;
