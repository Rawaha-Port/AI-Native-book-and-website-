// src/services/userProfile.ts
import axios from 'axios';
import { auth } from './auth'; // Assuming auth.ts is in the same services directory

interface UserProfileData {
  os: string;
  language: string;
  hardware: string;
  // Add any other profile data fields here
}

export const fetchUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) {
      console.error("No authentication token available to fetch user profile.");
      return null;
    }

    const response = await axios.get(`/api/user-profiles/${uid}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.profile_data; // Assuming profile_data is nested
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// You might also want a function to update the profile, though not explicitly in tasks.md
export const updateUserProfile = async (uid: string, profileData: UserProfileData): Promise<boolean> => {
    try {
        const idToken = await auth.currentUser?.getIdToken();
        if (!idToken) {
            console.error("No authentication token available to update user profile.");
            return false;
        }

        await axios.post(`/api/user-profiles/${uid}`, profileData, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        return true;
    } catch (error) {
        console.error("Error updating user profile:", error);
        return false;
    }
};