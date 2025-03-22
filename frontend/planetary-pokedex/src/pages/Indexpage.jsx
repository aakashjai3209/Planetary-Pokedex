    // src/pages/IndexPage.jsx
    import React, { useEffect, useRef } from "react";
    import { Link } from "react-router-dom";
    import Header from "../components/Header";
    import FeatureCard from "../components/FeatureCard";

    const IndexPage = () => {
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
        const speed = 0.3;

        // Create stars
        for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2.0,
            speed: Math.random() * speed + 0.3
        });
        }

        // Animation function
        const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
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
        <div className="min-h-screen relative overflow-hidden bg-black text-red-500">
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
        
        <main className="relative z-10 container mx-auto px-4 py-12">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center mb-16">
            <div className="w-32 h-32 rounded-full bg-red-600 flex items-center justify-center mb-6 animate-pulse">
                <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-500"></div>
                </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 text-red-500">Planetary Pokedex</h1>
            <p className="text-xl text-gray-300 max-w-2xl mb-8">
                Explore and analyze planets across the universe with our advanced classification system
            </p>
            <Link 
                to="/pokedex" 
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200"
            >
                Launch Pokedex
            </Link>
            </section>
            
            {/* Features Section */}
            <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10 text-red-400">Features</h2>
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
            <section className="bg-gray-900 bg-opacity-60 backdrop-filter backdrop-blur-md p-8 rounded-lg border border-gray-700 mb-16">
            <h2 className="text-3xl font-bold mb-6 text-red-400">About Planetary Pokedex</h2>
            <div className="text-gray-300 space-y-4">
                <p>
                The Planetary Pokedex is an advanced tool designed for astronomers, researchers, and space enthusiasts to classify and analyze planets throughout the universe.
                </p>
                <p>
                Using machine learning algorithms and a comprehensive database of known celestial bodies, our system can identify planets based on their physical parameters and visual characteristics.
                </p>
                <p>
                Whether you're studying exoplanets, creating educational content, or simply exploring the wonders of space, the Planetary Pokedex provides accurate classifications and detailed information to enhance your understanding of planetary science.
                </p>
            </div>
            </section>
            
            {/* How It Works Section */}
            <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10 text-red-400">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { num: 1, title: "Upload", desc: "Upload an image of your planet" },
                    { num: 2, title: "Input", desc: "Enter physical parameters" },
                    { num: 3, title: "Analyze", desc: "Our AI processes the data" },
                    { num: 4, title: "Discover", desc: "Get detailed classification results" }
                ].map((step) => (
                    <div key={step.num} className="bg-gray-900 bg-opacity-40 backdrop-filter backdrop-blur-sm p-6 rounded-lg border border-gray-800 text-center transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-red-500/20">
                        <span className="text-2xl text-red-900 font-bold">{step.num}</span>
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-red-400">{step.title}</h3>
                    <p className="text-gray-400">{step.desc}</p>
                    </div>
                ))}
                </div>

            </section>
        </main>
        
        {/* Footer */}
        <footer className="relative z-10 bg-gray-900 text-gray-400 py-8">
            <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} Planetary Pokedex. All rights reserved.</p>
            <p className="mt-2">Explore the universe, one planet at a time.</p>
            </div>
        </footer>
        </div>
    );
    };

    export default IndexPage;
