import React from "react";
import Header from "../components/Header";
import PokedexForm from "../components/PokedexForm";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-red-500">
      <Header />
      <main className="flex items-center justify-center">
        <PokedexForm />
      </main>
    </div>
  );
};

export default HomePage;