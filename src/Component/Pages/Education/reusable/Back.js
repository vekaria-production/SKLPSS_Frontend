import { useNavigate } from "react-router-dom";

const Back = () => {
  const navigate = useNavigate();
  return (
    <div className="px-4 sm:px-8 md:py-4 pb-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full 
             border border-[#E1D5C9] bg-white text-gray-800 
             hover:bg-[#FDF0D8] transition-all duration-200 shadow-sm hover:shadow-md
             dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200
             dark:hover:bg-gray-800 dark:hover:shadow-lg"
      >
        <span className="text-lg">←</span> Back
      </button>
    </div>
  );
};
export default Back;
