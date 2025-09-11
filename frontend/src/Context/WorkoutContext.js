import { createContext, useReducer } from "react";

export const WorkoutsContext = createContext();

export const workoutsReducer = (state, action) => {
  switch (action.type) {
    case "SET_WORKOUTS":
      return {
        workouts: action.payload,
      };

    case "CREATE_WORKOUT":
      return {
        workouts: [action.payload, ...state.workouts],
      };

    case "DELETE_WORKOUT": {
      const deletedId =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?._id;
      return {
        workouts: state.workouts.filter((workout) => workout._id !== deletedId),
      };
    }
    default:
      return state;
  }
};

export const WorkoutsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutsReducer, {
    workouts: null,
  });

  //   dispatch({ type: "SET_WORKOUTS", payload: [{}, {}] });

  return (
    <WorkoutsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkoutsContext.Provider>
  );
};
