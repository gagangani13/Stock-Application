"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import TableComponent from "./components/table";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store/store";
import "./page.module.css"

const Home = () => {
  const data = {};
  return (
    <>
      <Provider store={makeStore()}>
          <TableComponent />
      </Provider>
    </>
  );
};

export default Home;
