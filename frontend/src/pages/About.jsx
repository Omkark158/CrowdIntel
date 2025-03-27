import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Heading */}
        <h2 className="text-5xl font-bold text-center mb-8 text-blue-300">
          Empowering Smarter Crowd Management
        </h2>

        {/* Introduction Text */}
        <p className="text-2xl font-semibold text-center mb-12 max-w-3xl mx-auto text-gray-300">
          CrowdIntel leverages AI-driven insights to monitor, predict, and manage
          crowd behavior effectively. Our cutting-edge technology enhances public
          safety and ensures seamless event management.
        </p>

        <div className="space-y-16">
          {/* Our Mission */}
          <section className="text-center">
            <h3 className="text-3xl font-bold text-blue-300 mb-6">
              Our Mission
            </h3>
            <p className="text-xl font-medium text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Our mission is to revolutionize crowd management using advanced AI
              technologies. We strive to create a safer and more efficient
              environment by providing real-time analytics and proactive
              monitoring solutions.
            </p>
          </section>

          {/* Our Core Values */}
          <section className="text-center">
            <h3 className="text-3xl font-bold text-blue-300 mb-8">
              Our Core Values
            </h3>
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-gray-800 p-5 rounded-lg shadow-md">
                <p className="text-xl font-medium text-gray-300">
                  <strong>Innovation:</strong> Continuously improving through AI advancements.
                </p>
              </div>
              <div className="bg-gray-800 p-5 rounded-lg shadow-md">
                <p className="text-xl font-medium text-gray-300">
                  <strong>Safety:</strong> Prioritizing public security with intelligent solutions.
                </p>
              </div>
              <div className="bg-gray-800 p-5 rounded-lg shadow-md">
                <p className="text-xl font-medium text-gray-300">
                  <strong>Efficiency:</strong> Enhancing event management with predictive analytics.
                </p>
              </div>
              <div className="bg-gray-800 p-5 rounded-lg shadow-md">
                <p className="text-xl font-medium text-gray-300">
                  <strong>Reliability:</strong> Ensuring accuracy and dependability in data-driven decisions.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
