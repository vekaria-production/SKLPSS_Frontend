import React from 'react';
import bloodDonationImg from '../../../assets/blood_donation.png';
import culturalFestivalImg from '../../../assets/cultural_festival.png';
import communitySportsImg from '../../../assets/community_sports.png';

export default function CommunityInitiatives() {
  const initiatives = [
    {
      title: 'Blood Donation Drives',
      description: 'In partnership with the Seychelles Hospital Blood Transfusion Centre, SKLPSS hosts regular volunteer blood drives to help maintain public blood supplies and support local medical care.',
      image: bloodDonationImg,
      icon: '❤️'
    },
    {
      title: 'Cultural Festivals',
      description: 'Preserving our traditions in the Indian diaspora. We celebrate Navratri, Diwali, and Holi with community prayers, dances, and shared meals, keeping the next generation connected to their roots.',
      image: culturalFestivalImg,
      icon: '✨'
    },
    {
      title: 'Sports & Youth Engagement',
      description: 'Encouraging physical health, teamwork, and strong social ties. The Samaj organizes regular sports meets, friendly cricket matches, and youth outings in local tropical parks.',
      image: communitySportsImg,
      icon: '🏏'
    }
  ];

  return (
    <section className="text-center px-[5vw] mb-20 max-w-[90vw] mx-auto font-sans">
      <h2 className="mb-4 text-[clamp(2rem,5vw,2.75rem)] font-extrabold text-[#292929] tracking-tight">
        Community <span className="text-[#F48F0F]">Initiatives</span>
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-sm sm:text-base leading-relaxed">
        We strive to support Seychelles healthcare services, preserve our rich Indian heritage, and nurture strong community bonds through diverse local programs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {initiatives.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md border border-[#e4e4e4] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col text-left"
          >
            {/* Image section */}
            <div className="h-48 w-full overflow-hidden bg-orange-50 relative flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <span className="absolute bottom-3 right-3 bg-white/90 shadow-sm text-lg w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm select-none">
                {item.icon}
              </span>
            </div>

            {/* Content section */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
