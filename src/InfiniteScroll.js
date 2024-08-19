import { useState, useEffect, useRef } from "react";

const InfiniteScroll = (props) => {
  const { data, renderList, handlePageIncrease, isLoading } = props;

  const observerRef = useRef(null);
  const lastNodeRef = (node) => {
    console.log({ node });
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      console.log(`entries: ${entries}`);
      if (!entries[0].isIntersecting) return;
      handlePageIncrease();
    });
    if (node) observerRef.current.observe(node);
  };

  return (
    <>
      {data.map((element, index) => {
        if (index === data.length - 1) return renderList(element, lastNodeRef);
        return renderList(element, null);
      })}
      {isLoading ? <p> Loading...</p> : <></>}
    </>
  );
};

export default InfiniteScroll;
