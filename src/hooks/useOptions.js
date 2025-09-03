// src/hooks/useOptions.js
// import { useOptionsContext } from "../context/OptionsContext";
import { useOptionsContext} from "../Context/Options/OptionsContext"

export const useOptions = () => {
  const { options, loading, errors, refresh } = useOptionsContext();

  return {
    categories: options.CategoriesList || [],
    position: options.PositionList || [],
    loading,
    errors,
    refresh, // pass a key like 'suppliers' to refresh only that
  };
};
