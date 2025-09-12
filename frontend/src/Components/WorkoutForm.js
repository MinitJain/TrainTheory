import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutContext";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  // Function to remove error styling when user focuses on a field
  const handleFieldFocus = (fieldName) => {
    if (emptyFields.includes(fieldName)) {
      setEmptyFields(emptyFields.filter((field) => field !== fieldName));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);
    setEmptyFields([]);

    // Validate input
    if (!title || !load || !reps) {
      setError("Please fill in all fields");
      const empty = [];
      if (!title) empty.push("title");
      if (!load) empty.push("load");
      if (!reps) empty.push("reps");
      setEmptyFields(empty);
      return;
    }

    if (load < 0 || reps < 0) {
      setError("Load and reps must be positive numbers.");
      return;
    }

    const workout = { title, load: Number(load), reps: Number(reps) };

    const response = await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }

    if (response.ok) {
      setTitle("");
      setLoad("");
      setReps("");
      setError(null);
      setEmptyFields([]);
      console.log("new workout added", json);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Exercise Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => handleFieldFocus("title")}
        value={title}
        className={emptyFields.includes("title") ? "error" : " "}
      />

      <label>Loads (in kg):</label>

      <input
        type="number"
        min="0"
        onChange={(e) => setLoad(Math.max(0, Number(e.target.value)))}
        onFocus={() => handleFieldFocus("load")}
        value={load}
        className={emptyFields.includes("load") ? "error" : " "}
      />

      <label>reps:</label>

      <input
        type="number"
        min="0"
        onChange={(e) => setReps(Math.max(0, Number(e.target.value)))}
        onFocus={() => handleFieldFocus("reps")}
        value={reps}
        className={emptyFields.includes("reps") ? "error" : " "}
      />

      <button type="submit">Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
