import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const fetchSession = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

const Home = () => {
  const naviagte = useNavigate();
  const { data, error } = useQuery({
    queryKey: ["session"],
    queryFn: () =>
      fetchSession(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/session`),
  });

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/logout`, {
        withCredentials: true,
        withXSRFToken: true,
      });
      naviagte("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (error) {
    naviagte("/login");
  }

  return (
    data && (
      <div>
        <h1>Home Page</h1>
        <h2>Hello {data.name}</h2>
        <p>{JSON.stringify(data)}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  );
};

export default Home;
