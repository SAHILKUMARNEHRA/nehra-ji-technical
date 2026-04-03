import React from 'react';

import banner from '../assets/banner.png';
import studio from '../assets/studio cool.jpg';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="h-64 overflow-hidden">
          <img 
            src={banner} 
            alt="Nehra Ji Technical Banner" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-8 text-blue-600 border-b pb-4">About Nehra Ji Technical</h1>
          
          <div className="space-y-8">
            {/* Hindi Content */}
            <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-blue-500">
              <p className="text-xl font-medium mb-4 text-gray-800">नमस्कार दोस्तों,</p>
              <p className="text-gray-700 leading-relaxed text-lg">
                आपका बहुत बहुत स्वागत है हमारे चैनल "NEHRA JI TECHNICAL" में! मैंने यह चैनल मेरे उन सभी दोस्तों के लिए बनाया है जो टेक्नोलॉजी के बारे में अपनी भाषा में जानना चाहते है। "NEHRA JI TECHNICAL" चैनल में आपको रोज़ाना एक नयी वीडियो मिलेगी जहा मैं कोशिश करूँगा आपको मोबाइल और कंप्यूटर की दुनिया के बारे में कुछ जरुरी बातें बताने की।
              </p>
            </div>

            {/* English Content */}
            <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-blue-500">
              <p className="text-xl font-medium mb-4 text-gray-800">Hello friends,</p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Welcome to "NEHRA JI TECHNICAL"! I created this channel on 13th June 2021. My motive is to make easy-to-understand Tech Videos in Hindi, and I want everyone interested in technology to understand it in the easiest way possible. I post one video daily on topics that cover the latest technology and tech news. Please SUBSCRIBE to NEHRA JI TECHNICAL, Thanks.
              </p>
            </div>

            {/* Studio Image Section */}
            <div className="py-8">
              <img 
                src={studio} 
                alt="Our Studio" 
                className="w-full h-auto rounded-3xl shadow-lg border border-gray-100"
              />
              <p className="text-center text-gray-400 text-sm mt-4 italic">Welcome to the Nehra Ji Technical Studio</p>
            </div>

            {/* Footer Phrases */}
            <div className="text-center space-y-4 pt-8">
              <p className="text-2xl font-bold text-gray-900">जय हिन्द, वन्दे मातरम|</p>
              <p className="text-blue-600 font-medium italic">NEHRA JI TECHNICAL provides tech support over e-mail</p>
              <div className="bg-blue-600 text-white p-4 rounded-xl font-mono text-lg break-all">
                Our email address: SK.NEHRA2005@GMAIL.COM
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-xl font-bold text-gray-800 pt-4">
                <span>LIKE</span>
                <span>|</span>
                <span>SHARE</span>
                <span>|</span>
                <span>SUBSCRIBE</span>
              </div>
              <div className="pt-8 text-3xl font-black text-gray-900 tracking-wider">
                THANKS
              </div>
              <div className="text-blue-600 font-bold text-xl">
                NEHRA JI TECHNICAL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
