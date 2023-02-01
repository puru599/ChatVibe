import React from "react";
import Friends from "../Friends/Friends";
import Group from "../Group/Group";

const Home = () => {
  const { userName } = JSON.parse(localStorage.getItem("userData"));
  return (
    <React.Fragment>
      <h2>{userName}</h2>
      <Friends />
      <Group />
    </React.Fragment>
  );
};

export default Home;
