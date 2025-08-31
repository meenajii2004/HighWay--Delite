import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, ArrowRight, User, Mail, Calendar, Clock } from 'lucide-react';
import { formatDateOfBirth } from '../lib/utils';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {user.name}! 🎉
          </h2>
          
          <p className="text-gray-600 mb-8">
            Your account has been successfully created and verified.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Account Information</h3>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Name: {user.name}</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Email: {user.email}</span>
              </div>
              
              
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-primary-100 mr-3 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary-600"></div>
                </div>
                <span className="text-sm text-gray-600">
                  Provider: {user.provider === 'google' ? 'Google' : 'Email + OTP'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/notes')}
            className="btn-primary w-full flex justify-center items-center"
          >
            Start Taking Notes
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
