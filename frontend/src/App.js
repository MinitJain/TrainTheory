import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";

import Home from "./pages/Home";
import Navbar from "./Components/Navbar";
import { WorkoutsContextProvider } from "./Context/WorkoutContext";

const toggleTheme = () => {
  document.documentElement.classList.toggle("dark");
};

function App() {
  return (
    <CopilotKit publicApiKey="ck_pub_00828bb5867d63cbfb2bbc6f1352e642">
      <WorkoutsContextProvider>
        <div className="App">
          <BrowserRouter>
            <Navbar />
            <div className="pages">
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </div>
          </BrowserRouter>

          <CopilotPopup
            instructions={
              "You are a workout assistant. You can help users add new workouts and delete existing ones. When adding workouts, you need the title, load (in kg), and reps. When deleting workouts, you need the workout ID or title."
            }
            labels={{
              title: "Workout Assistant",
              initial: "How can I help with your workouts?",
            }}
          />
        </div>
      </WorkoutsContextProvider>
    </CopilotKit>
  );
}

export default App;
