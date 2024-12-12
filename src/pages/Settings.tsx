import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Bell, 
  Moon, 
  Sun, 
  Shield, 
  Globe, 
  Save, 
  Loader2,
  Trash2
} from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';
import { Button } from '../components/ui/Button';
import { DeleteAccountModal } from '../components/modals/DeleteAccountModal';
import { FeedbackModal } from '../components/ui/FeedbackModal';
import { BACKEND_URL } from '../config';
interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sections: SettingsSection[] = [
  { id: 'profile', title: 'Profile', icon: User },
  { id: 'notifications', title: 'Notifications', icon: Bell },
  { id: 'appearance', title: 'Appearance', icon: Moon },
  { id: 'security', title: 'Security', icon: Shield },
  { id: 'preferences', title: 'Preferences', icon: Globe },
];

export default function Settings() {
  const { user, updateUser, logout, updateProfilePicture, changePassword } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });


  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  
    if (!file) return;
  
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB.');
      return;
    }
  
    setUploading(true);
    try {
      await updateProfilePicture(file);
      setFeedbackMessage('Your profile picture has been updated successfully!');
      setIsFeedbackOpen(true);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setFeedbackMessage('Failed to update profile picture. Please try again.');
      setIsFeedbackOpen(true);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Update the user's name if it has changed
      if (formData.name && formData.name !== user?.name) {
        await updateUser({ name: formData.name });
      }
  
      // Update the password if all fields are filled correctly
      if (formData.currentPassword && formData.newPassword && formData.newPassword === formData.confirmPassword) {
        await changePassword(formData.currentPassword, formData.newPassword);
      }
  
      setFeedbackMessage('Changes saved successfully!');
    } catch (error) {
      setFeedbackMessage('Failed to save changes. Please try again.');
    } finally {
      setIsFeedbackOpen(true);
      setIsLoading(false);
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const handleDeleteAccount = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    logout();
    navigate('/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            {/* Avatar Upload */}
            <div className="flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-400 flex items-center justify-center text-3xl font-bold text-white">
  {uploading ? (
    <Loader2 className="w-8 h-8 animate-spin text-white" />
  ) : user?.avatar ? (
    <img
      src={`${BACKEND_URL}${user.avatar}`}
      alt="Profile"
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    user?.name?.charAt(0).toUpperCase() || 'U'
  )}
</div>
  <label className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer">
    <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => handleProfilePictureChange(e)}
    />
  </label>
</motion.div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Picture</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  JPG, GIF or PNG. Max size of 2MB.
                </p>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled={true}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Password Change */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Change Password
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Current Password"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-500 focus:border-transparent"
                    placeholder="New Password"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Confirm New Password"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="destructive"
                onClick={() => setIsDeleteModalOpen(true)}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Delete Account
              </Button>

              <Button
                type="submit"
                isLoading={isLoading}
                icon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </motion.form>
        );

      case 'appearance':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Theme
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Switch between dark and light mode
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center h-64"
          >
            <p className="text-gray-500 dark:text-gray-400">
              This section is coming soon...
            </p>
          </motion.div>
        );
    }
  };

  return (
    <>
      <div className="py-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <section.icon className={`w-5 h-5 ${
                  activeSection === section.id
                    ? 'text-black'
                    : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span className="font-medium">{section.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800/50 p-8 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm">
            {renderSection()}
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
      {/* Render the FeedbackModal here */}
    {isFeedbackOpen && (
      <FeedbackModal
        message={feedbackMessage}
        onClose={() => setIsFeedbackOpen(false)}
      />
    )}
    </>
  );
}