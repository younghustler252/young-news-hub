// hooks/useUser.js
import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentUser as fetchCurrentUser,
  completeProfile as completeProfileAPI,
  updateProfile as updateProfileAPI,
  toggleFollow as toggleFollowAPI,
  banUser as banUserAPI,
  getUserByUsername as fetchUserByUsername,
} from '../service/userService';
import toast from 'react-hot-toast';

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUser = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCurrentUser();
      setUser(data);
    } catch (err) {
      setError(err.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return { user, setUser, loading, error, reload: loadUser };
};

export const useCompleteProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const completeProfile = async (userData) => {
    setLoading(true);
    setError('');
    try {
      const data = await completeProfileAPI(userData);
      toast.success('Profile completed!');
      return data;
    } catch (err) {
      setError(err.message || 'Profile completion failed');
      toast.error(err.message || 'Profile completion failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { completeProfile, loading, error };
};

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError('');
    try {
      const data = await updateProfileAPI(profileData);
      toast.success('Profile updated!');
      return data;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      toast.error(err.message || 'Profile update failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
};

export const useToggleFollow = (initialFollowing = false) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async (userId) => {
    setLoading(true);
    try {
      await toggleFollowAPI(userId);
      setIsFollowing((prev) => !prev);
    } catch (err) {
      toast.error(err.message || 'Follow/unfollow failed');
    } finally {
      setLoading(false);
    }
  };

  return { isFollowing, toggleFollow, loading };
};

export const useBanUser = () => {
  const [loading, setLoading] = useState(false);

  const banUser = async (userId, action, reason = '') => {
    setLoading(true);
    try {
      const data = await banUserAPI(userId, action, reason);
      toast.success(data.message || 'Action completed');
      return data;
    } catch (err) {
      toast.error(err.message || 'Action failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { banUser, loading };
};

export const useUserByUsername = (username) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUser = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchUserByUsername(username);
      setUser(data);
    } catch (err) {
      setError(err.message || 'User not found');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return { user, loading, error, reload: loadUser };
};
