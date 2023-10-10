import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: {
    _id: "64ede8a38d1e72cfbe8e0e17",
    username: "Amanda_Cerny",
    email: "amandaCerny@onlyfans.com",
    profilePicture:
      "https://celebjihad.com/celeb-jihad/harlots/amanda_cerny/amanda_cerny95.jpg",
    coverPicture:
      "http://scandalplanet.com/wp-content/uploads/2017/04/Amanda-Cerny-nude-porn-playboy-bikini-feet-topless-sexy-hot-ScandalPlanet-3.jpg",
    followers: [],
    isAdmin: false,
    followings: ["64f73bfe539362405b1d348b"],
    city: "Los Angeles, California",
    from: "Pittsburgh, Pennsylvania, United States",
    relationship: "2",
  },
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
