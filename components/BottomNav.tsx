
import React from 'react';
import HomeIcon from './icons/HomeIcon';
import UsersIcon from './icons/UsersIcon';
import DumbbellIcon from './icons/DumbbellIcon';
import UserIcon from './icons/UserIcon';
import { UserRole } from '../types';

interface BottomNavProps {
    role: UserRole;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
    <button className={`flex flex-col items-center justify-center space-y-1 w-full p-2 rounded-lg transition-colors ${active ? 'text-brand-neon-blue' : 'text-gray-400 hover:text-white'}`}>
        {icon}
        <span className="text-xs">{label}</span>
    </button>
);


const BottomNav: React.FC<BottomNavProps> = ({ role }) => {
    const personalNav = [
        { icon: <HomeIcon />, label: 'Dashboard', active: true },
        { icon: <UsersIcon />, label: 'Alunos' },
        { icon: <DumbbellIcon />, label: 'Exercícios' },
        { icon: <UserIcon />, label: 'Perfil' },
    ];

    const alunoNav = [
        { icon: <HomeIcon />, label: 'Hoje', active: true },
        { icon: <DumbbellIcon />, label: 'Treinos' },
        { icon: <UserIcon />, label: 'Progresso' },
    ];
    
    const navItems = role === 'personal' ? personalNav : alunoNav;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 bg-dark-surface/80 backdrop-blur-lg border-t border-dark-border">
        <nav className="h-full max-w-lg mx-auto flex items-center justify-around px-4">
            {navItems.map(item => (
                <NavItem key={item.label} icon={item.icon} label={item.label} active={item.active} />
            ))}
        </nav>
    </footer>
  );
};

export default BottomNav;
