import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation, useResendVerificationMutation } from '../../api/authApi';
import { logout } from '../../features/auth/authSlice';
import { removeRefreshToken } from '../../utils/tokenStorage';
import { useTheme } from '../../context/ThemeContext';
import { useGetNotificationsQuery, useMarkAllReadMutation } from '../../api/notificationsApi';
import { Sun, Moon, Upload, LogOut, User, ChevronLeft, ChevronRight, Bell, AlertTriangle, Mail } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();
  const [resendVerification] = useResendVerificationMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [resent, setResent] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const { data: notifData } = useGetNotificationsQuery({ limit: 10 }, { skip: !user });
  const [markAllRead] = useMarkAllReadMutation();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    try { await logoutApi().unwrap(); } catch (e) {}
    dispatch(logout());
    removeRefreshToken();
    navigate('/login');
  };

  const handleResend = async () => {
    try { await resendVerification().unwrap(); setResent(true); } catch (e) {}
  };

  const unreadCount = notifData?.unreadCount || 0;
  const showBanner = user && !user.isVerified;

  return (
    <div className="sticky top-0 z-10">
      <header className="h-16 px-6 flex items-center justify-between bg-gray-50/80 dark:bg-[#0F0F0F]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#242424] flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#2A2A2A] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => navigate(1)} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#242424] flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#2A2A2A] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="w-9 h-9 rounded-full bg-gray-200 dark:bg-[#242424] flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#2A2A2A] transition-colors">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-full bg-gray-200 dark:bg-[#242424] flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#2A2A2A] transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#2A2A2A]">
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-violet-500 hover:text-violet-600">
                      Mark all read
                    </button>
                  )}
                </div>
                {notifData?.data?.length > 0 ? (
                  notifData.data.map((notif) => (
                    <div key={notif._id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors border-b border-gray-50 dark:border-[#2A2A2A] ${!notif.isRead ? 'bg-violet-50/50 dark:bg-violet-500/5' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {notif.sender?.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        {!notif.isRead && <div className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0 mt-1" />}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-8">No notifications</p>
                )}
              </div>
            )}
          </div>

          {(user?.role === 'artist' || user?.role === 'admin') && (
            <Link to="/upload" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors">
              <Upload className="w-4 h-4" />
              Upload
            </Link>
          )}

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-[#242424] hover:bg-gray-300 dark:hover:bg-[#2A2A2A] transition-colors">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-semibold">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium hidden sm:block">{user?.username}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] rounded-xl shadow-xl py-1 z-50">
                {user?._id && (
                  <Link to={`/artists/${user._id}`} onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-[#242424]">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-[#242424] w-full">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showBanner && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-6 py-2 flex items-center justify-center gap-3">
          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <span className="text-sm text-yellow-600 dark:text-yellow-400">Please verify your email</span>
          {resent ? (
            <span className="text-xs text-green-500">Email sent!</span>
          ) : (
            <button onClick={handleResend} className="text-xs text-violet-500 hover:text-violet-600 font-medium flex items-center gap-1">
              <Mail className="w-3 h-3" /> Resend email
            </button>
          )}
        </div>
      )}
    </div>
  );
}
