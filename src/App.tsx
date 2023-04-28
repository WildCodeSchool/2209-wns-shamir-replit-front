import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Layout from "./components/Layout";
import { DeleteModalContextProvider } from "./contexts/deleteModalContext";
import { ForceProjectListUpdateContextProvider } from "./contexts/forceProjectListUpdateContext";
import { ProjectContextProvider } from "./contexts/projectContext";
import { ShareModalContextProvider } from "./contexts/shareModalContext";
import { UserContextProvider } from "./contexts/userContext";
import Edit from "./pages/Edit";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Subscription from "./pages/Subscription";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

function App() {
  const { REACT_APP_STRIPE_PUBLIC_KEY } = process.env;

  const stripePromise = loadStripe(REACT_APP_STRIPE_PUBLIC_KEY || "");

  return (
    <Elements stripe={stripePromise}>
      <ForceProjectListUpdateContextProvider>
        <DeleteModalContextProvider>
          <ShareModalContextProvider>
            <UserContextProvider>
              <ProjectContextProvider>
                <Header />
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/edit" element={<Edit />} />
                    <Route path="/subscription" element={<Subscription />} />
                    <Route path="/login" element={<SignIn />} />
                  </Routes>
                </Layout>
              </ProjectContextProvider>
            </UserContextProvider>
          </ShareModalContextProvider>
        </DeleteModalContextProvider>
      </ForceProjectListUpdateContextProvider>
    </Elements>
  );
}

export default App;
