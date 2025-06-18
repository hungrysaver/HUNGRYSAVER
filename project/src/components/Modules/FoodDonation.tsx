import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Clock, Users, Utensils, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface FoodDonation {
  id: string;
  title: string;
  description: string;
  foodType: string;
  quantity: string;
  location: string;
  pickupTime: string;
  donorName: string;
  donorId: string;
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
  volunteerId?: string;
  volunteerName?: string;
  createdAt: string;
}

const FoodDonation: React.FC = () => {
  const { userProfile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [donations, setDonations] = useState<FoodDonation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    foodType: '',
    quantity: '',
    location: '',
    pickupTime: ''
  });

  useEffect(() => {
    // Listen to food donations
    const donationsQuery = query(
      collection(db, 'food_donations'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(donationsQuery, (snapshot) => {
      const donationsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FoodDonation[];
      setDonations(donationsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const donationData = {
        ...formData,
        donorName: userProfile?.displayName || 'Anonymous',
        donorId: userProfile?.uid,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'food_donations'), donationData);
      
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        foodType: '',
        quantity: '',
        location: '',
        pickupTime: ''
      });
    } catch (error) {
      console.error('Error creating food donation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'picked': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDonations = filterStatus === 'all' 
    ? donations 
    : donations.filter(donation => donation.status === filterStatus);

  if (loading && donations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Food Donation</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Fresh vegetables from restaurant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe the food items in detail"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Type
                </label>
                <select
                  name="foodType"
                  value={formData.foodType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="">Select food type</option>
                  <option value="Vegetables & Fruits">Vegetables & Fruits</option>
                  <option value="Cooked Food">Cooked Food</option>
                  <option value="Packaged Food">Packaged Food</option>
                  <option value="Dairy Products">Dairy Products</option>
                  <option value="Grains & Cereals">Grains & Cereals</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 10 kg or 50 servings"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter pickup address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Pickup Time
              </label>
              <input
                type="datetime-local"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Donation'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Annamitra Seva</h1>
          <p className="text-gray-600 mt-1">Food Donation Management</p>
        </div>
        {(userProfile?.role === 'donor' || userProfile?.role === 'admin') && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>New Donation</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'assigned', 'picked', 'delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Donations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDonations.map((donation) => (
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

            <div className="space-y-3">
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
                <Users className="h-4 w-4 mr-2 text-green-500" />
                <span>Donor: {donation.donorName}</span>
              </div>

              {donation.volunteerName && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Volunteer: {donation.volunteerName}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDonations.length === 0 && (
        <div className="text-center py-12">
          <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
          <p className="text-gray-500">
            {filterStatus === 'all' 
              ? 'Start by creating a new food donation.'
              : `No donations with status "${filterStatus}".`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default FoodDonation;