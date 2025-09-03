import React from 'react';

const ContactModal = ({ isOpen, onClose, eventTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4">Contact for Upcoming Event</h2>
        <p className="mb-4">To participate or inquire about <strong>{eventTitle}</strong>, please contact our event coordinator.</p>
        <div className="text-sm text-gray-700">
          📞 +248 123 4567<br />
          📧 events@community.org
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
