import React from 'react';
import vision from  "../../../assets/vision.png"
export default function Vision() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 flex gap-6">
        <img src={vision} alt="Vision" className="h-16" />
        <div>
          <h3 className="text-xl font-bold">Vision</h3>
          <p className="text-gray-700 mt-2">
            Our Vision is to foster a strong, inclusive Indian community in Seychelles that celebrates our heritage,
            promotes education, and empowers every generation to thrive with unity, respect, and shared purpose.
          </p>
        </div>
      </div>
    </section>
  );
}
