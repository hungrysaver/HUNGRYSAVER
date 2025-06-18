import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { 
  Utensils, 
  BookOpen, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  AlertCircle,
  CheckCircle,
  Filter,
  Eye
} from 'lucide-react';

interface FoodDonation {
  id: string;
  title: string;
  description: string;
  foodType: string;
  quantity: string;
  location: string;
  pickupTime: string;
  donorName: string;
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
  createdAt: string;
}

interface CommunityIssue {
  id: string;
  studentName: string;
  age: number;
  requiredSupport: string;
  supportDetails: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  contactNumber: string;
  alternateContact?: string;
  submitterName: string;
  submitterEmail: string;
  city: string;
  status: 'pending' | 'verified' | 'in-progress' | 'resolved';
  createdAt: string;
}

const VolunteerDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [foodDonations, setFoodDonations] = useState<FoodDonation[]>([]);
  const [communityIssues, setCommunityIssues] = useState<CommunityIssue[]>([]);
  const [activeTab, setActiveTab] = useState<'food' | 'education'>('food');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to food donations
    const foodQuery = query(
      collection(db, 'food_donations'),
      where('status', 'in', ['pending', 'assigned'])
    );

    const unsubscribeFood = onSnapshot(foodQuery, (snapshot) => {
      const donations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FoodDonation[];
      setFoodDonations(donations);
    });

    // Listen to community issues
    const issuesQuery = query(
      collection(db, 'community_issues'),
      where('status', 'in', ['pending', 'verified'])
    );

    const unsubscribeIssues = onSnapshot(issuesQuery, (snapshot) => {
      const issues = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommunityIssue[];
      setCommunityIssues(issues);
      setLoading(false);
    });

    return () => {
      unsubscribeFood();
      unsubscribeIssues();
    };
  }, []);

  const handleAssignFood = async (donationId: string) => {
    try {
      await updateDoc(doc(db, 'food_donations', donationId), {
        status: 'assigned',
        volunteerId: userProfile?.uid,
        volunteerName: userProfile?.displayName,
        assignedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error assigning food donation:', error);
    }
  };

  const handleVerifyIssue = async (issueId: string) => {
    try {
      await updateDoc(doc(db, 'community_issues', issueId), {
        status: 'verified',
        verifiedBy: userProfile?.uid,
        verifierName: userProfile?.displayName,
        verifiedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error verifying community issue:', error);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFoodDonations = filterStatus === 'all' 
    ? foodDonations 
    : foodDonations.filter(donation => donation.status === filterStatus);

  const filteredCommunityIssues = filterStatus === 'all' 
    ? communityIssues 
    : communityIssues.filter(issue => issue.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Volunteer Dashboard</h1>
            <p className="text-blue-100 text-lg">
              Welcome, {userProfile?.displayName}!
            </p>
            <p className="text-blue-100 mt-1">
              Location: {userProfile?.location} • Qualification: {userProfile?.educationalQualification}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Food Donations</p>
              <p className="text-2xl font-bold text-orange-600">{foodDonations.length}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Utensils className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Education Issues</p>
              <p className="text-2xl font-bold text-blue-600">{communityIssues.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Actions</p>
              <p className="text-2xl font-bold text-yellow-600">
                {foodDonations.filter(d => d.status === 'pending').length + 
                 communityIssues.filter(i => i.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {foodDonations.filter(d => d.status === 'assigned').length + 
                 communityIssues.filter(i => i.status === 'verified').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('food')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'food'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Utensils className="h-4 w-4 inline mr-2" />
              Food Donations
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'education'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-2" />
              Education Issues
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'food' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFoodDonations.map((donation) => (
            <div key={donation.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex-1">
                  {donation.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {donation.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Utensils className="h-4 w-4 mr-2 text-orange-500" />
                  <span className="font-medium">{donation.foodType}</span>
                  <span className="mx-2">•</span>
                  <span>{donation.quantity}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-red-500" />
                  <span>{donation.location}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Pickup: {new Date(donation.pickupTime).toLocaleString()}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2 text-green-500" />
                  <span>Donor: {donation.donorName}</span>
                </div>
              </div>

              <div className="flex gap-3">
                {donation.status === 'pending' && (
                  <button
                    onClick={() => handleAssignFood(donation.id)}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Accept Assignment
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4 inline mr-1" />
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCommunityIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {issue.studentName}
                  </h3>
                  <p className="text-sm text-gray-600">Age: {issue.age} years</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                    {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(issue.urgencyLevel)}`}>
                    {issue.urgencyLevel.charAt(0).toUpperCase() + issue.urgencyLevel.slice(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="font-medium">{issue.requiredSupport}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-red-500" />
                  <span>{issue.city}, Andhra Pradesh</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-green-500" />
                  <span>{issue.contactNumber}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Submitted by: {issue.submitterName}</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {issue.supportDetails}
              </p>

              <div className="flex gap-3">
                {issue.status === 'pending' && (
                  <button
                    onClick={() => handleVerifyIssue(issue.id)}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    Verify Issue
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4 inline mr-1" />
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty States */}
      {activeTab === 'food' && filteredFoodDonations.length === 0 && (
        <div className="text-center py-12">
          <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No food donations found</h3>
          <p className="text-gray-500">
            {filterStatus === 'all' 
              ? 'No food donations available at the moment.'
              : `No food donations with status "${filterStatus}".`
            }
          </p>
        </div>
      )}

      {activeTab === 'education' && filteredCommunityIssues.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No education issues found</h3>
          <p className="text-gray-500">
            {filterStatus === 'all' 
              ? 'No education issues submitted yet.'
              : `No education issues with status "${filterStatus}".`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;