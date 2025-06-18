import React, { useState, useEffect } from 'react';
import { GraduationCap, User, MapPin, Calendar, Heart, BookOpen, AlertCircle, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  school: string;
  location: string;
  profileImage: string;
  story: string;
  monthlyNeed: number;
  sponsored: boolean;
  sponsorshipType: 'full' | 'partial' | null;
  sponsorName?: string;
  documentsVerified: boolean;
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

const EducationAid: React.FC = () => {
  const { userProfile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('students');
  const [communityIssues, setCommunityIssues] = useState<CommunityIssue[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for students - in real app, this would come from Firestore
  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      age: 12,
      grade: '7th Grade',
      school: 'Government High School',
      location: 'Whitefield, Bangalore',
      profileImage: 'https://images.pexels.com/photos/4144232/pexels-photo-4144232.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      story: 'Priya is a bright student who dreams of becoming a doctor. Her father works as a daily wage laborer and her mother is a housewife. Despite financial constraints, Priya consistently ranks in the top 3 of her class.',
      monthlyNeed: 2500,
      sponsored: false,
      sponsorshipType: null,
      documentsVerified: true,
      createdAt: '2024-01-10T10:00'
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      age: 15,
      grade: '10th Grade',
      school: 'City Public School',
      location: 'Jayanagar, Bangalore',
      profileImage: 'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      story: 'Rajesh excels in mathematics and science. He lost his father last year and his mother works as a domestic helper. He wants to pursue engineering and needs support for his board exam preparations.',
      monthlyNeed: 3000,
      sponsored: true,
      sponsorshipType: 'partial',
      sponsorName: 'Tech Corp Foundation',
      documentsVerified: true,
      createdAt: '2024-01-08T14:30'
    },
    {
      id: '3',
      name: 'Ananya Reddy',
      age: 8,
      grade: '3rd Grade',
      school: 'Little Flower School',
      location: 'HSR Layout, Bangalore',
      profileImage: 'https://images.pexels.com/photos/4144177/pexels-photo-4144177.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      story: 'Ananya loves reading and painting. Her parents work in a small tea stall. She is very creative and her teachers believe she has great potential in arts and literature.',
      monthlyNeed: 2000,
      sponsored: false,
      sponsorshipType: null,
      documentsVerified: true,
      createdAt: '2024-01-12T09:15'
    }
  ]);

  useEffect(() => {
    // Listen to verified community issues for donors
    if (userProfile?.role === 'donor' || userProfile?.role === 'admin') {
      const issuesQuery = query(
        collection(db, 'community_issues'),
        where('status', '==', 'verified')
      );

      const unsubscribe = onSnapshot(issuesQuery, (snapshot) => {
        const issues = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CommunityIssue[];
        setCommunityIssues(issues);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [userProfile]);

  const handleSponsor = (studentId: string, type: 'full' | 'partial') => {
    // In real app, this would update Firestore and handle payment
    console.log(`Sponsoring student ${studentId} with ${type} sponsorship`);
  };

  const handleSupportIssue = (issueId: string) => {
    // In real app, this would update Firestore and handle support process
    console.log(`Supporting community issue ${issueId}`);
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

  const filteredStudents = selectedCategory === 'students' 
    ? students 
    : selectedCategory === 'sponsored'
    ? students.filter(student => student.sponsored)
    : students.filter(student => !student.sponsored);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vidya Jyothi</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Education Aid Program - Support underprivileged students in their educational journey and help them achieve their dreams
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Sponsored</p>
              <p className="text-2xl font-bold text-green-600">{students.filter(s => s.sponsored).length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Need Support</p>
              <p className="text-2xl font-bold text-orange-600">{students.filter(s => !s.sponsored).length}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Community Issues</p>
              <p className="text-2xl font-bold text-purple-600">{communityIssues.length}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {['students', 'need-support', 'sponsored', 'community-issues'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'students' ? 'All Students' : 
               category === 'need-support' ? 'Need Support' : 
               category === 'sponsored' ? 'Sponsored' : 'Community Issues'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {selectedCategory === 'community-issues' ? (
        // Community Issues Section
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communityIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{issue.studentName}</h3>
                    <p className="text-sm text-gray-600">Age: {issue.age} years</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(issue.urgencyLevel)}`}>
                    {issue.urgencyLevel.charAt(0).toUpperCase() + issue.urgencyLevel.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
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

                <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                  {issue.supportDetails}
                </p>

                <div className="bg-green-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-green-600 font-medium">✓ Verified by Volunteer</p>
                  <p className="text-xs text-green-600 mt-1">
                    This request has been field-verified and is ready for support
                  </p>
                </div>

                <button
                  onClick={() => handleSupportIssue(issue.id)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Provide Support
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Students Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              {/* Student Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
                <img
                  src={student.profileImage}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
                {student.sponsored && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Sponsored
                  </div>
                )}
                {student.documentsVerified && (
                  <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    ✓ Verified
                  </div>
                )}
              </div>

              {/* Student Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.age} years old • {student.grade}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{student.school}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                    <span>{student.location}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                  {student.story}
                </p>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Monthly Support Needed</p>
                  <p className="text-lg font-bold text-gray-900">₹{student.monthlyNeed.toLocaleString()}</p>
                  {student.sponsored && student.sponsorName && (
                    <p className="text-xs text-green-600 mt-1">
                      Sponsored by: {student.sponsorName}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                {!student.sponsored ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSponsor(student.id, 'full')}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                    >
                      Full Sponsorship (₹{student.monthlyNeed}/month)
                    </button>
                    <button
                      onClick={() => handleSponsor(student.id, 'partial')}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                    >
                      Partial Sponsorship
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                      <Heart className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {student.sponsorshipType === 'full' ? 'Fully Sponsored' : 'Partially Sponsored'}
                      </span>
                    </div>
                  </div>
                )}

                <button className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  View Full Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty States */}
      {selectedCategory !== 'community-issues' && filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-500">
            {selectedCategory === 'students' 
              ? 'No student profiles available at the moment.'
              : `No ${selectedCategory} students found.`
            }
          </p>
        </div>
      )}

      {selectedCategory === 'community-issues' && communityIssues.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No community issues found</h3>
          <p className="text-gray-500">
            No verified community issues available for support at the moment.
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Make a Difference Today</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Your sponsorship can transform a child's life. Even a small contribution can help provide books, uniforms, and other educational necessities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Become a Sponsor
          </button>
          <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationAid;