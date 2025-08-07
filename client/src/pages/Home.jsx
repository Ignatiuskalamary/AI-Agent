import React from "react";
import Navbar from "../componentes/Navbar";
import Header from "../componentes/Header";
import BlogList from "../componentes/BlogList";
import Newsletter from "../componentes/Newsletter";
import Footer from "../componentes/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />
      <BlogList />
      <Newsletter />
      <Footer />
    </>
  );
};

export default Home;
