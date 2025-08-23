import React, { useEffect, useState } from "react";
import api from "../utils/api";

export const TestPage = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/test");
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return <div>{data && <div>{data.message}</div>}</div>;
};
