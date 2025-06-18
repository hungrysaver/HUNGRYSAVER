import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Utensils, 
  GraduationCap, 
  HandHeart, 
  Recycle, 
  Shield, 
  Home,
  TrendingUp,
  Users,
  Clock,
  Heart,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import VolunteerDashboard from '../Volunteer/VolunteerDashboard';
import CommunityIssueForm from '../CommunitySupport/CommunityIssueForm';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();

  // Show role-specific dashboards
  if (userProfile?.role === 'volunteer') {
    return <VolunteerDashboard />;
  }

  if (userProfile?.role === 'community-support') {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome, {userProfile?.displayName}!
              </h1>
              <p className="text-blue-100 text-lg">
                Community Support Representative for {userProfile?.city}
              </p>
              <p className="text-blue-100 mt-2">
                Help us identify and support students in need in your community
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Community Issue Form */}
        <CommunityIssueForm />

        {/* Information Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Submit Request</h3>
              <p className="text-sm text-gray-600">
                Fill out the form above with details about students who need educational support
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Volunteer Verification</h3>
              <p className="text-sm text-gray-600">
                Our local volunteers will verify the request and assess the student's needs
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Donor Matching</h3>
              <p className="text-sm text-gray-600">
                Verified requests are shown to donors who can provide the needed support
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default dashboard for donors and admins
  const modules = [
    {
      id: 'food-donation',
      title: 'Annamitra Seva',
      subtitle: 'Food Donation',
      description: 'Connect donors with volunteers to distribute surplus food to those in need',
      icon: Utensils,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      link: '/food-donation',
      stats: { total: 234, pending: 12 },
      allowedRoles: ['donor', 'admin']
    },
    {
      id: 'education-aid',
      title: 'Vidya Jyothi',
      subtitle: 'Education Aid',
      description: 'Sponsor students and provide educational resources for underprivileged children',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/education-aid',
      stats: { total: 89, pending: 7 },
      allowedRoles: ['donor', 'admin']
    },
    {
      id: 'ngo-support',
      title: 'Suraksha Setu',
      subtitle: 'NGO Support',
      description: 'Support NGOs with resources and connect volunteers for various causes',
      icon: HandHeart,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/ngo-support',
      stats: { total: 45, pending: 3 },
      allowedRoles: ['donor', 'admin']
    },
    {
      id: 'waste-donation',
      title: 'PunarAsha',
      subtitle: 'Recyclable Waste',
      description: 'Donate recyclable items and organize collection events for sustainability',
      icon: Recycle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/waste-donation',
      stats: { total: 156, pending: 8 },
      allowedRoles: ['donor', 'admin']
    },
    {
      id: 'emergency-rescue',
      title: 'Raksha Jyothi',
      subtitle: 'Emergency Rescue',
      description: 'Report emergencies and coordinate rescue operations for humans and animals',
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      link: '/emergency-rescue',
      stats: { total: 23, pending: 2 },
      allowedRoles: ['donor', 'admin']
    },
    {
      id: 'shelter',
      title: 'Jyothi Nilayam',
      subtitle: 'Shelter Management',
      description: 'Manage shelters for humans and animals, track residents and resources',
      icon: Home,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      link: '/shelter',
      stats: { total: 67, pending: 5 },
      allowedRoles: ['donor', 'admin']
    }
  ];

  const overallStats = [
    { label: 'Total Donations', value: '1,234', icon: Heart, color: 'text-orange-600' },
    { label: 'Active Volunteers', value: '456', icon: Users, color: 'text-blue-600' },
    { label: 'Lives Impacted', value: '2,890', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Pending Actions', value: '37', icon: Clock, color: 'text-red-600' }
  ];

  // Filter modules based on user role
  const availableModules = modules.filter(module => 
    module.allowedRoles.includes(userProfile?.role || 'donor')
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userProfile?.displayName}!
            </h1>
            <p className="text-orange-100 text-lg">
              Your role: <span className="font-semibold capitalize">{userProfile?.role}</span>
            </p>
            <p className="text-orange-100 mt-2">
              Together, we're making a difference in our community
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Impact Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableModules.map((module) => (
            <div key={module.id} className="group">
              <Link to={module.link} className="block">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color}`}>
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${module.textColor}`}>
                        {module.stats.pending} pending
                      </p>
                      <p className="text-xs text-gray-500">
                        {module.stats.total} total
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {module.title}
                  </h3>
                  <p className={`text-sm font-medium ${module.textColor} mb-2`}>
                    {module.subtitle}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {module.description}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-sm font-medium ${module.textColor} group-hover:underline`}>
                      Explore Module →
                    </span>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${module.color}`}></div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions - Only for donors and admins */}
      {(userProfile?.role === 'donor' || userProfile?.role === 'admin') && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              to="/food-donation/new"
              className="p-6 border-2 border-dashed border-orange-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 text-center group"
            >
              <Utensils className="h-8 w-8 text-orange-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">Post Food Donation</h3>
              <p className="text-sm text-gray-600">Share surplus food with the community</p>
            </Link>
            
            <Link 
              to="/emergency-rescue/new"
              className="p-6 border-2 border-dashed border-red-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all duration-200 text-center group"
            >
              <Shield className="h-8 w-8 text-red-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">Report Emergency</h3>
              <p className="text-sm text-gray-600">Get immediate help for emergencies</p>
            </Link>
            
            <Link 
              to="/education-aid/sponsor"
              className="p-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center group"
            >
              <GraduationCap className="h-8 w-8 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-900 mb-2">Sponsor Education</h3>
              <p className="text-sm text-gray-600">Support a student's education journey</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;