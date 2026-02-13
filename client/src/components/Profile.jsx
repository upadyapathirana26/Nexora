// client/src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    // Use local storage data immediately (no API call needed for self-profile)
    setProfileUser(currentUser);

    // Fetch follower stats
    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/follow/${currentUser.id}/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load stats');
      }
    };

    fetchStats();
  }, [navigate, currentUser]);

  // Show loading while waiting for stats
  if (!profileUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center">
        {/* Safe avatar: only show first letter if name exists */}
        <div className="w-24 h-24 rounded-full bg-nexora-primary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
          {profileUser.name ? profileUser.name[0].toUpperCase() : '?'}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">{profileUser.name || 'Unknown'}</h1>
        <p className="text-gray-600 mt-1">{profileUser.email || ''}</p>
        <p className="text-gray-700 mt-4 max-w-xs mx-auto">
          {profileUser.bio || "No bio yet."}
        </p>
        
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-nexora-primary">12</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div>
            <div className="text-xl font-bold text-nexora-primary">{stats.followers}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div>
            <div className="text-xl font-bold text-nexora-primary">{stats.following}</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;