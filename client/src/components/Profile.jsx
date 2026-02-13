// client/src/components/Profile.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [navigate, user]);

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-nexora-primary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
          {user.name[0]}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <p className="text-gray-600 mt-1">{user.email}</p>
        <p className="text-gray-700 mt-4 max-w-xs mx-auto">{user.bio || "No bio yet."}</p>
        
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-nexora-primary">12</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div>
            <div className="text-xl font-bold text-nexora-primary">84</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div>
            <div className="text-xl font-bold text-nexora-primary">56</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;