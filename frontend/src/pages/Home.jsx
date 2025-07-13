import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid"; // Importing icons

const Home = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  // Apply smooth scrolling when navigating within the page
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  // Toggle Light/Dark Mode
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
      {/* Font Awesome CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />

      {/* Navbar */}
      <header className={`flex justify-between items-center p-5 shadow-lg fixed top-0 w-full z-10 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <h1 className="text-2xl font-bold text-green-500">CrowdIntel</h1>
        <div className="flex items-center space-x-8"> 
          <nav className="flex space-x-6 text-lg">
            {["Home", "Features", "Services", "Join Us", "Contact"].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`} 
                className="hover:text-green-500 transition duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-green-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {item}
              </a>
            ))}
          </nav>
          {/* Light Mode Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 dark:bg-gray-200 dark:hover:bg-gray-300 transition duration-300"
          >
            {darkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-300" />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="flex flex-col md:flex-row items-center justify-between text-center md:text-left h-screen px-8 max-w-6xl mx-auto pt-32">
  <div className="md:w-1/2">
    <h1 className="text-4xl font-bold drop-shadow-lg leading-tight">
      Transforming Crowd Management with AI Magic!
    </h1>
    <p className="max-w-lg drop-shadow-md mt-4 text-lg">
      Dive into the future where your control room sees everything and alerts you before things get out of hand.
    </p>
    
    <button 
      onClick={() => navigate("/signup")} 
      className="mt-6 bg-green-500 px-10 py-4 rounded-lg text-white hover:bg-green-600 shadow-lg text-lg">
      Get Started
    </button>

    {/* Know More About Us Link with Flicker Effect */}
    <div className="mt-6">
  <Link 
    to="/about" 
    className="bg-blue-500 px-8 py-4 rounded-lg text-white hover:bg-blue-600 shadow-lg text-lg inline-block transition duration-700 flicker"
  >
    Know More About Us
  </Link>
</div>
  </div>

  <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
    <img src="/images/pexels-photo-25391056.jpeg" alt="Hero Section" className="w-[400px] h-[400px] rounded-3xl shadow-lg object-cover" />
  </div>

  {/* Flickering Animation */}
  <style>
    {`
      @keyframes flicker {
        0% { opacity: 1; }
        50% { opacity: 0.2; }
        100% { opacity: 1; }
      }
      .flicker {
        animation: flicker 1s infinite;
      }
    `}
  </style>
</section>

      {/* Features Section */}
      <section id="features" className="py-12 px-8">
        <h2 className="text-3xl font-bold text-green-500 text-center mb-10">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <div className="flex justify-start items-center"> 
            <img src="/images/pexels-photo-30546987.jpeg" alt="Feature Section" className="w-[400px] h-[440px] rounded-3xl shadow-lg object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { img: "alert-circle-outline.svg", title: "Instant Alerts", desc: "Get notified about overcrowding." },
              { img: "server.svg", title: "AI Precision", desc: "Detect potential crowd risks." },
              { img: "airplane-sharp.svg", title: "User-Friendly UI", desc: "Fast, responsive, and intuitive." },
              { img: "stats-chart.svg", title: "Crowd Analytics", desc: "Live tracking & movement analysis." }
            ].map((feature, index) => (
              <div key={index} className={`p-6 rounded-lg shadow-lg flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 
                ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}>
                <img src={`/images/${feature.img}`} alt={feature.title} className="w-14 h-14 mb-4" />
                <h3 className="text-lg font-semibold text-green-500">{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 text-center px-8">
        <h2 className="text-3xl font-bold text-green-500 mb-10">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: "fa-solid fa-calendar-check", title: "Event Monitoring", desc: "Ensure safety at every event." },
            { icon: "fa-solid fa-bus", title: "Transport Hub Surveillance", desc: "Manage crowds in transit areas." },
            { icon: "fa-solid fa-cogs", title: "Custom Solutions", desc: "Tailored systems for your needs." }
          ].map((service, index) => (
            <div key={index} className={`p-6 rounded-lg shadow-lg flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 
              ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}>
              <i className={`${service.icon} text-black text-5xl mb-4`}></i>
              <h3 className="text-lg font-semibold text-green-500">{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

       {/* Join Us Section */}
       <section id="join-us" className="py-12 text-center px-8">
        <h2 className="text-3xl font-bold text-green-500 mb-8">Join Us Today</h2>
        <div className="flex justify-center space-x-6">
          <button 
            onClick={() => navigate("/signup")} 
            className="bg-green-500 px-8 py-4 rounded-lg text-white hover:bg-green-600 shadow-lg text-lg">
            Sign Up
          </button>
          <button 
            onClick={() => navigate("/login")} 
            className="bg-blue-500 px-8 py-4 rounded-lg text-white hover:bg-blue-600 shadow-lg text-lg">
            Login
          </button>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="py-12 text-center px-8">
        <h2 className="text-3xl font-bold text-green-500 mb-8">Contact Us</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="p-6 bg-gray-700 text-white rounded-lg shadow-lg flex items-center space-x-4 w-96">
            <EnvelopeIcon className="w-8 h-8 text-green-500" />
            <a href="mailto:support@crowdintel.com" className="hover:text-green-500 transition duration-300 text-lg">support@crowdintel@gmail.com</a>
          </div>
          <div className="p-6 bg-gray-700 text-white rounded-lg shadow-lg flex items-center space-x-4 w-96">
            <PhoneIcon className="w-8 h-8 text-green-500" />
            <span className="text-lg">+91 1234567890</span>
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="p-6 text-center bg-gray-800 text-gray-400">
        <p>&copy; 2025 CrowdIntel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
