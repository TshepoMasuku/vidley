import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import auth from '../src/services/authService';
import Navbar from "./components/navbar";
import Movies from "./components/movies";
import Customers from './components/customers';
import Rentals from './components/rentals';
import NotFound from './components/notFound';
import MovieFormFC from './components/movieFormFC';
import MovieFormCC from './components/movieFormCC';
import RegisterForm from './components/registerForm';
import LoginForm from './components/loginForm';
import LogOut from './components/logOut';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

class App extends Component {
  state = {};

  async componentDidMount() {
    const user = await auth.getCurrentUser();
    this.setState({ user });
  }

  protectRoute = (Component) => {
    if (this.state.user?.isAdmin) {
      return <Component /> 
    } else {
      return <Navigate to="/" replace />
    }
  }

  blockedRoute = (Component) => {
    if (!this.state.user) {
      return <Component /> 
    } else {
      return <Navigate to="/" replace />
    }
  }

  render() {
    const { user } = this.state;
    return (
      <Router>
        <ToastContainer />
        <Navbar user={user} />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Navigate to="/movies" />} />
            <Route path="/movies" element={<Movies user={user} />} />
            <Route path="/movies/new" element={this.protectRoute(MovieFormFC)} />
            <Route path="/movies/new" element={this.protectRoute(MovieFormCC)} />
            <Route path="/movies/:id" element={this.protectRoute(MovieFormFC)} />
            <Route path="/login" element={this.blockedRoute(LoginForm)} />
            <Route path="/logOut" element={<LogOut />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;

// NB: the "/movies/new" routes have 2different components aka elements
// movieFormFC - movieFormFunctionalComponent
// movieFormCC - movieFormClassComponent
// And the 2nd "/movies/new" route wont be invoked  
// Unless the 1st "/movies/new" route is commented out.