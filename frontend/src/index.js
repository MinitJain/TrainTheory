import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { WorkoutsContextProvider } from "./Context/WorkoutContext";
import "@copilotkit/react-ui/styles.css";
import { CopilotKit } from "@copilotkit/react-core";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CopilotKit publicApiKey="ck_pub_00828bb5867d63cbfb2bbc6f1352e642">
      <WorkoutsContextProvider>
        <App />
      </WorkoutsContextProvider>
    </CopilotKit>
  </React.StrictMode>
);
