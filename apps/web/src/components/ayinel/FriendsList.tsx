import React from 'react';

interface FriendsListProps {
  friends?: string[];
}

export function FriendsList({ friends = ["Sarah", "David", "Jessica", "Alex", "James", "Maya"] }: FriendsListProps) {
  return (
    <div className="space-y-2">
      {friends.map((friend) => (
        <div key={friend} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/10" />
            <div className="text-sm text-white">{friend}</div>
          </div>
          <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10">View</button>
        </div>
      ))}
    </div>
  );
}
