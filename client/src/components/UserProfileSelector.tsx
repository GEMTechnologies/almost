import React, { useState, useEffect } from 'react';
import { User, Building, Globe, Award } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  organization_type: string;
  country: string;
  sector: string;
  credits: number;
}

interface UserProfileSelectorProps {
  onUserSelect: (user: UserProfile) => void;
  currentUser?: UserProfile;
}

export const UserProfileSelector: React.FC<UserProfileSelectorProps> = ({ 
  onUserSelect,
  currentUser 
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  const fetchUserProfiles = async () => {
    try {
      const response = await fetch('/api/users/demo-profiles');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles || []);
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSelect = async (profile: UserProfile) => {
    try {
      // Set this profile as current user for demo
      const response = await fetch('/api/users/set-demo-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id })
      });

      if (response.ok) {
        onUserSelect(profile);
        setShowSelector(false);
      }
    } catch (error) {
      console.error('Failed to set user:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        <div className="animate-pulse">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setShowSelector(!showSelector)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        {currentUser ? currentUser.full_name.split(' ')[0] : 'Select User'}
      </button>

      {showSelector && (
        <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-2 w-80 max-h-96 overflow-y-auto">
          <div className="text-sm text-gray-600 p-2 border-b">
            Choose a user profile to test personalized content:
          </div>
          
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleProfileSelect(profile)}
              className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border-l-4 ${
                currentUser?.id === profile.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {profile.full_name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {profile.full_name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {profile.email}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {profile.organization_type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {profile.country}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {profile.sector}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Award className="w-3 h-3" />
                      {profile.credits} credits
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          {profiles.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No profiles available
            </div>
          )}
        </div>
      )}
    </div>
  );
};