import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Layout from "./components/Layout";
import { ProjectContextProvider } from "./contexts/projectContext";
import Edit from "./pages/Edit";
import Home from "./pages/Home";

function App() {
  return (
    <ProjectContextProvider>
      <Header />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit" element={<Edit />} />
        </Routes>
      </Layout>
    </ProjectContextProvider>
  );
}

export default App;
