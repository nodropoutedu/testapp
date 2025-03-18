import React, { useState } from 'react';
import './Auth.css';
import { supabase } from '../supabase';

function Auth({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      console.log('Login successful, setting user:', data.user);
      setUser(data.user);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('Signup attempt with email:', email, 'password:', password);

    if (email.toLowerCase() === password.toLowerCase()) {
      setError('Email and password cannot be the same');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const { data: signupData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      console.error('Signup error:', authError.message, authError.details);
      setIsLoading(false);
      return;
    }

    if (!signupData.session) {
      setError('Signup successful, but auto-login failed. Please log in manually.');
      setIsLoading(false);
      return;
    }

    console.log('Signup successful, user session:', signupData.session.user);
    // Delay to ensure session propagation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Creating profile for user:', signupData.user.id);
    const { error: profileError, data: profileData } = await supabase
      .from('profiles')
      .insert({
        id: signupData.user.id,
        email: signupData.user.email,
        created_at: new Date().toISOString(),
        has_completed_interests: false, // Kept for future use
      });

    if (profileError) {
      console.error('Profile creation failed:', profileError.message, profileError.details, profileError.code);
      setError('Error creating profile: ' + profileError.message + ' Details: ' + JSON.stringify(profileError.details) + ' Code: ' + profileError.code);
      setIsLoading(false);
      return;
    }

    console.log('Profile created successfully:', profileData);
    setUser(signupData.user);
    setIsLoading(false);
  };

  return (
    <div className="app">
      <div className="news-feed">
        <div className="auth-content">
          <h2>JustGood News</h2>
          {error && <p className="error">{error}</p>}
          {isLoading && <div className="loading-spinner">⏳ Loading...</div>}
          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {isSignup && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            )}
            <button type="submit" disabled={isLoading}>
              {isSignup ? 'Sign Up' : 'Login'}
            </button>
          </form>
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span className="toggle-auth" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Login' : 'Sign Up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;