import React from 'react';
import MissionImg from "../../../assets/mission.png"

export default function Mission() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 flex gap-6">
        <img src={MissionImg} alt="Mission" className="h-16" />
        <div>
          <h3 className="text-xl font-bold">Mission</h3>
          <p className="text-gray-700 mt-2">
            Our mission is to unite and support the Indian community in Seychelles by organizing cultural, educational,
            and social initiatives that preserve our values, uplift our youth, and strengthen community bonds.
          </p>
        </div>
      </div>
    </section>
  );
}
