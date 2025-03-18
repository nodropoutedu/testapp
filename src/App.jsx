import React, { useState, useEffect } from 'react';
import './App.css';
import NewsFeed from './components/NewsFeed';
import Bookmarks from './components/Bookmarks';
import Profile from './components/Profile';
import Auth from './components/Auth';
import { supabase } from './supabase';

function App() {
  const [activeSection, setActiveSection] = useState('news');
  const [user, setUser] = useState(null);
  const [showInterestsForm, setShowInterestsForm] = useState(false);

  useEffect(() => {
    console.log('App useEffect triggered');

    const clearSession = async () => {
      console.log('Clearing session');
      await supabase.auth.signOut();
      setUser(null);
    };
    clearSession();

    const checkSession = async () => {
      console.log('Checking session');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session found');
        setUser(null);
        return;
      }
      console.log('Session found, user:', session.user);
      setUser(session.user);

      if (session.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('has_completed_interests')
          .eq('id', session.user.id)
          .single();

        console.log('Profile data:', profile, 'Error:', error);
        if (!profile || error || !profile.has_completed_interests) {
          console.log('No profile, error, or has_completed_interests false, showing interests form');
          setShowInterestsForm(true);
        } else {
          console.log('has_completed_interests is true, showing news feed');
          setShowInterestsForm(false);
        }
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setShowInterestsForm(false);
        return;
      }

      const currentUser = session?.user || null;
      setUser(currentUser);

      if (event === 'SIGNED_IN' && currentUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('has_completed_interests')
          .eq('id', currentUser.id)
          .single();

        console.log('Profile data on SIGNED_IN:', profile, 'Error:', error);
        if (!profile || error || !profile.has_completed_interests) {
          console.log('No profile, error, or has_completed_interests false on SIGNED_IN, showing interests form');
          setShowInterestsForm(true);
        } else {
          console.log('has_completed_interests is true on SIGNED_IN, showing news feed');
          setShowInterestsForm(false);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  if (showInterestsForm) {
    return <Auth setUser={setUser} showInterestsForm={true} />;
  }

  return (
    <div className="app">
      <div className="news-feed">
        {activeSection === 'news' && <NewsFeed />}
        {activeSection === 'bookmarks' && <Bookmarks />}
        {activeSection === 'profile' && <Profile />}
        <div className="nav-bar">
          <span
            className={`nav-icon ${activeSection === 'news' ? 'active' : ''}`}
            onClick={() => setActiveSection('news')}
          >
            📰
          </span>
          <span
            className={`nav-icon ${activeSection === 'bookmarks' ? 'active' : ''}`}
            onClick={() => setActiveSection('bookmarks')}
          >
            ★
          </span>
          <span
            className={`nav-icon ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            👤
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;