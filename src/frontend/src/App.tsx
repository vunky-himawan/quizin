import React from "react";
import AuthProvider from "./context/authContext";
import Routes from "./routes/Routes";
import { Toaster } from "./components/ui/toaster";
import QuizProvider from "./context/quizContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <QuizProvider>
        <Routes />
        <Toaster />
      </QuizProvider>
    </AuthProvider>
  );
};

export default App;
