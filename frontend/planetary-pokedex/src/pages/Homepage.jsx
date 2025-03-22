import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import PokedexForm from "../components/PokedexForm";

const HomePage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Star properties
    const stars = [];
    const numStars = 300;
    const speed = 0.1;

    // Create stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.7,
        speed: Math.random() * speed + 0.1
      });
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.5) + ')';
        ctx.fill();

        // Move star
        star.y += star.speed;

        // Reset star position if it goes off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-red-500 flex flex-col">
      {/* Space-themed animated background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ opacity: 0.7 }}
      />
      
      {/* Header with solid background */}
      <div className="relative z-10 bg-gray-900">
        <Header />
      </div>
      
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow">
        {/* Back button */}
        <div className="w-full max-w-7xl px-4 mb-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-red-500 hover:text-red-400 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>
        <PokedexForm />
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-gray-400 py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Planetary Pokedex. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/" className="text-red-500 hover:text-red-400 transition-colors duration-200">Home</Link>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-red-500 hover:text-red-400 transition-colors duration-200">About</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-red-500 hover:text-red-400 transition-colors duration-200">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
