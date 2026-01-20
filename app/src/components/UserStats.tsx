import { User } from '@/types';

interface UserStatsProps {
  user: User;
}

export default function UserStats({ user }: UserStatsProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Your Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Karma Points</span>
            <span className="font-semibold text-blue-600">{user.karmaPoints}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">DMs Remaining</span>
            <span className="font-semibold text-gray-900">7/10</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Referrals Given</span>
            <span className="font-semibold text-gray-900">{user.referralsGiven}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-900">Top Contributors</h3>
          <a href="#" className="text-xs text-blue-600 hover:underline">View all</a>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500 font-bold">1.</span>
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                AB
              </div>
              <span className="text-sm">Alice B.</span>
            </div>
            <span className="text-xs text-gray-500">1.2k</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 font-bold">2.</span>
              <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                RC
              </div>
              <span className="text-sm">Ryan C.</span>
            </div>
            <span className="text-xs text-gray-500">980</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-orange-400 font-bold">3.</span>
              <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                SK
              </div>
              <span className="text-sm">Sarah K.</span>
            </div>
            <span className="text-xs text-gray-500">875</span>
          </div>
        </div>
      </div>

      {!user.linkedinConnected && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2 text-sm">Connect LinkedIn</h4>
          <p className="text-xs text-blue-800 mb-3">Get +50 bonus points and enhance your profile!</p>
          <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Connect Now
          </button>
        </div>
      )}
    </div>
  );
}
