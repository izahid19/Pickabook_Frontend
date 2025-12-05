'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Users, Coins, ArrowLeft, Loader2, Edit2, X, Check, LayoutGrid, Table } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { config } from '../../config/config';
import ThemeToggle from '../../components/ThemeToggle';
import LoadingAnimation from '../../components/LoadingAnimation';
import StatsCard from '../../components/dashboard/StatsCard';
import gsap from 'gsap';

interface UserData {
  id: string;
  username: string;
  email: string;
  userType: number;
  credits: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editCredits, setEditCredits] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && (!user || user.userType !== 2)) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (token && user?.userType === 2) {
      fetchUsers();
    }
  }, [token, user]);

  // GSAP Animations
  useEffect(() => {
    if (loadingUsers || loading) return;

    const ctx = gsap.context(() => {
      // Header slide down
      gsap.fromTo(headerRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );

      // Stats cards stagger animation
      gsap.fromTo(".stat-card",
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.5, 
          stagger: 0.15, 
          ease: "back.out(1.2)",
          delay: 0.2
        }
      );

      // Content fade in
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.5 }
      );

      // Table rows or cards stagger
      gsap.fromTo(".user-row, .user-card",
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.4, 
          stagger: 0.05, 
          ease: "power2.out",
          delay: 0.7
        }
      );
    });

    return () => ctx.revert();
  }, [loadingUsers, loading, viewMode]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.API_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      toast.error('Failed to connect to server');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdateCredits = async (userId: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`${config.API_URL}/auth/users/${userId}/credits`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credits: editCredits })
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(users.map(u => u.id === userId ? { ...u, credits: data.user.credits } : u));
        toast.success('Credits updated successfully!');
        setEditingUser(null);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update credits');
      }
    } catch (error) {
      toast.error('Failed to connect to server');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  if (!user || user.userType !== 2) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header ref={headerRef} className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="font-bold text-lg dark:text-white">
              <span className="text-orange-500">Admin</span> Dashboard
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'card' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard
            icon={Users}
            label="Total Users"
            value={users.length}
            iconBgColor="bg-orange-100 dark:bg-orange-900/30"
            iconColor="text-orange-500"
          />
          <StatsCard
            icon={Coins}
            label="Total Credits"
            value={users.reduce((acc, u) => acc + u.credits, 0)}
            iconBgColor="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-500"
          />
          <div className="stat-card bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <span className="text-xl">👑</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.filter(u => u.userType === 2).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table View */}
        {viewMode === 'table' && (
          <div ref={contentRef} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Type</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Credits</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {users.map((u) => {
                    const { id, username, email, userType, credits } = u;
                    return (
                    <tr key={id} className="user-row hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            {username?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${userType === 2 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                          {userType === 2 ? '👑 Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {editingUser === id ? (
                          <input
                            type="number"
                            value={editCredits}
                            onChange={(e) => setEditCredits(parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                            min="0"
                          />
                        ) : (
                          <span className="font-semibold text-gray-900 dark:text-white">{credits}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingUser === id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdateCredits(id)}
                              disabled={updating}
                              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingUser(id);
                              setEditCredits(credits);
                            }}
                            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                   );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Card View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u) => {
              const { id, username, email, userType, credits } = u;
              return (
              <div key={id} className="user-card bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{username}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
                    </div>
                  </div>
                  {userType === 2 && (
                    <span className="text-lg">👑</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-orange-500" />
                    {editingUser === id ? (
                      <input
                        type="number"
                        value={editCredits}
                        onChange={(e) => setEditCredits(parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                        min="0"
                      />
                    ) : (
                      <span className="font-bold text-gray-900 dark:text-white">{credits} credits</span>
                    )}
                  </div>
                  
                  {editingUser === id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateCredits(id)}
                        disabled={updating}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingUser(id);
                        setEditCredits(credits);
                      }}
                      className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

