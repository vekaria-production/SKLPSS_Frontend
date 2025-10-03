import React from 'react';
import President from "../../../assets/president.png"

export default function PresidentMessage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 grid md:grid-cols-3 gap-6 items-center">
        {/* <img src={President} alt="President" className="rounded-lg w-full" /> */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold">President message</h3>
          <p className="text-gray-700 mt-2 text-sm">
            It brings me great pride and heartfelt joy to address you as the President of our vibrant Shree Kutchi Leva Patel Samaj Seychelles. Our organization has always stood as a beacon of unity, tradition, and shared purpose—
            bridging generations and preserving the essence of our cultural identity. <br />
            As we move forward, our focus remains clear: to empower our youth through education, support our elders
            with respect, and foster togetherness through meaningful activities. This website marks a new chapter—a
            digital space where our values meet modern connectivity, making it easier than ever to stay informed,
            involved, and inspired. <br />
            I warmly invite each of you to take part, share your voice, and continue building a legacy that reflects
            who we are—resilient, respectful, and rooted in community spirit.
          </p>
          <p className="mt-4 font-bold">Mr XYZabc Patel</p>
          <p className="text-sm text-gray-500">President</p>
        </div>
      </div>
    </section>
  );
}
