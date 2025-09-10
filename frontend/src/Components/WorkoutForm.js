import { useState } from "react";

const WorkoutForm = () => {
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (load < 0 || reps < 0) {
      setError("Load and reps must be positive numbers.");
      return;
    }

    const workout = { title, load, reps };

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
    }

    if (response.ok) {
      setTitle("");
      setLoad("");
      setReps("");
      setError(null);
      console.log("new workout added", json);
    }
  };

  return (
    <form className="create">
      <h3>Add a New Workout</h3>

      <label>Exercise Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />

      <label>Loads (in kg):</label>

      <input
        type="number"
        min="0"
        onChange={(e) => setLoad(Math.max(0, Number(e.target.value)))}
        value={load}
      />

      <label>reps:</label>

      <input
        type="number"
        min="0"
        onChange={(e) => setReps(Math.max(0, Number(e.target.value)))}
        value={reps}
      />

      <button onClick={handleSubmit}>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
