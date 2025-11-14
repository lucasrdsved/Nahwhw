
import React from 'react';
import { Profile } from '../types';

interface HeaderProps {
  profile: Profile;
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ profile, title, subtitle }) => {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
        <p className="text-gray-400">{subtitle}</p>
      </div>
      <img
        src={profile.avatar_url}
        alt={profile.full_name}
        className="w-12 h-12 rounded-full border-2 border-dark-border"
      />
    </header>
  );
};

export default Header;
