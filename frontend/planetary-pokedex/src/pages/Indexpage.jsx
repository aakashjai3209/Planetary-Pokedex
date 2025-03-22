import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import FeatureCard from "../components/FeatureCard";

const IndexPage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Function to resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight; // Full document height
      
      // Recreate stars when canvas is resized
      createStars();
    };

    // Star properties
    const stars = [];
    const numStars = 300;
    const speed = 0.3;

    // Create stars function
    const createStars = () => {
      // Clear existing stars
      stars.length = 0;
      
      // Create new stars
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.0,
          speed: Math.random() * speed + 0.3,
        });
      }
    };

    // Initial resize and setup
    resizeCanvas();
    
    // Add resize event listener
    window.addEventListener('resize', resizeCanvas);

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          "rgba(255, 255, 255, " + (Math.random() * 0.5 + 0.5) + ")";
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
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-blue-500 font-orbitron">
      {/* Space-themed animated background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{ opacity: 0.7 }}
      />

      {/* Header with solid background */}
      <div className="relative z-10 bg-gray-900">
        <Header />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center mb-16">
          {/* Spinning Earth Image */}
          <div className="w-64 h-64 relative mb-8 mx-auto">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere_transparent_background.png/1024px-Earth_Western_Hemisphere_transparent_background.png" 
              alt="Earth" 
              className="w-full h-full object-contain absolute inset-0"
              style={{ 
                animation: "spin 20s linear infinite",
                transformOrigin: "center center" 
              }}
            />
            <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 blur-md"></div>
          </div>

          <h1 className="text-5xl font-bold mb-4 text-blue-500">
            Planetary Pokedex
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            Explore and analyze planets across the universe with our advanced
            classification system
          </p>
          <Link
            to="/pokedex"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            Launch Planetdex
          </Link>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-400">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Planet Classification"
              description="Identify planets based on their physical characteristics and compare them with known celestial bodies."
              icon="classify"
            />
            <FeatureCard
              title="Detailed Analysis"
              description="Get comprehensive information about planetary composition, atmosphere, and habitability potential."
              icon="analyze"
            />
            <FeatureCard
              title="Image Recognition"
              description="Upload images of planets and receive AI-powered identification and similarity scores."
              icon="image"
            />
          </div>
        </section>

        {/* About Section */}
        <section className="bg-transparent  p-8 rounded-lg border hover:shadow-lg hover:shadow-blue-700 border-gray-700 mb-16">
        <h2 className="text-3xl font-bold mb-6 text-blue-400">
            About Planetary Pokedex
        </h2>
        <div className="text-gray-300 space-y-4">
            <p>
            The Planetary Pokedex is an advanced tool designed for
            astronomers, researchers, and space enthusiasts to classify and
            analyze planets throughout the universe.
            </p>
            <p>
            Using machine learning algorithms and a comprehensive database of
            known celestial bodies, our system can identify planets based on
            their physical parameters and visual characteristics.
            </p>
            <p>
            Whether you're studying exoplanets, creating educational content,
            or simply exploring the wonders of space, the Planetary Pokedex
            provides accurate classifications and detailed information to
            enhance your understanding of planetary science.
            </p>
        </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-400">
            How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
            { num: 1, title: "Upload", desc: "Upload an image of your planet" },
            { num: 2, title: "Input", desc: "Enter physical parameters" },
            { num: 3, title: "Analyze", desc: "Our AI processes the data" },
            { num: 4, title: "Discover", desc: "Get detailed classification results" },
            ].map((step) => (
            <div
                key={step.num}
                className="bg-transparent  p-6 rounded-lg border border-gray-400/50 text-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-700"
            >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20">
                <span className="text-2xl text-white font-bold">
                    {step.num}
                </span>
                </div>
                <h3 className="text-xl font-medium mb-2 text-blue-400">
                {step.title}
                </h3>
                <p className="text-gray-300">{step.desc}</p>
            </div>
            ))}
        </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} Planetary Pokedex. All rights reserved.
          </p>
          <p className="mt-2">Explore the universe, one planet at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
