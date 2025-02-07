import "./App.css";
import React, { useState } from "react";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSignUp = () => {
    alert("User signed up successfully!");
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {!loggedIn ? (
            <>
              <SignUp onSignUp={handleSignUp} />
              <Login onLogin={handleLogin} />
            </>
          ) : (
            <Dashboard />
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
