import { createContext, useReducer } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";

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

  useCopilotReadable({
    description: "The current list of workouts with their details",
    value: state.workouts
      ? JSON.stringify(state.workouts, null, 2)
      : "No workouts available",
  });

  useCopilotAction({
    name: "addWorkout",
    description: "Add a new workout to the list",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title/name of the exercise",
        required: true,
      },
      {
        name: "load",
        type: "number",
        description: "The weight/load in kg",
        required: true,
      },
      {
        name: "reps",
        type: "number",
        description: "The number of repetitions",
        required: true,
      },
    ],
    handler: async ({ title, load, reps }) => {
      try {
        // Validate inputs
        if (!title || title.trim() === "") {
          throw new Error("Workout title cannot be empty");
        }
        if (load < 0 || reps < 0) {
          throw new Error("Load and reps must be positive numbers");
        }

        if (
          state.workouts &&
          state.workouts.some(
            (w) => w.title.trim().toLowerCase() === title.trim().toLowerCase()
          )
        ) {
          throw new Error("A workout with this title already exists");
        }

        const workout = {
          title: title.trim(),
          load: Number(load),
          reps: Number(reps),
        };

        const response = await fetch("/api/workouts", {
          method: "POST",
          body: JSON.stringify(workout),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || "Failed to add workout");
        }

        dispatch({ type: "CREATE_WORKOUT", payload: json });
        return `Successfully added workout: ${title} (${load}kg x ${reps} reps)`;
      } catch (error) {
        return `Error adding workout: ${error.message}`;
      }
    },
  });

  useCopilotAction({
    name: "deleteWorkout",
    description: "Delete a workout from the list",
    parameters: [
      {
        name: "workoutIdentifier",
        type: "string",
        description: "The workout ID or title to delete",
        required: true,
      },
    ],
    handler: async ({ workoutIdentifier }) => {
      try {
        if (!state.workouts || state.workouts.length === 0) {
          throw new Error("No workouts available to delete");
        }

        let workoutToDelete = null;
        if (workoutIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
          workoutToDelete = state.workouts.find(
            (w) => w._id === workoutIdentifier
          );
        } else {
          workoutToDelete = state.workouts.find((w) =>
            w.title.toLowerCase().includes(workoutIdentifier.toLowerCase())
          );
        }

        if (!workoutToDelete) {
          throw new Error(`Workout not found: ${workoutIdentifier}`);
        }

        const response = await fetch(`/api/workouts/${workoutToDelete._id}`, {
          method: "DELETE",
        });

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || "Failed to delete workout");
        }

        dispatch({ type: "DELETE_WORKOUT", payload: workoutToDelete._id });
        return `Successfully deleted workout: ${workoutToDelete.title}`;
      } catch (error) {
        return `Error deleting workout: ${error.message}`;
      }
    },
  });

  return (
    <WorkoutsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkoutsContext.Provider>
  );
};
