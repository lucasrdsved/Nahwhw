
'use client';
import React from 'react';
import { UserRole } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HomeIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const UsersIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const DumbbellIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
);
const UserIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);


const NavItem: React.FC<{ href: string; icon: React.ReactNode; label: string; active?: boolean }> = ({ href, icon, label, active }) => (
    <Link href={href} className={`flex flex-col items-center justify-center space-y-1 w-full p-2 rounded-lg transition-colors ${active ? 'text-brand-neon-blue' : 'text-dark-text-secondary hover:text-white'}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </Link>
);

const BottomNav: React.FC<{ role: UserRole }> = ({ role }) => {
    const pathname = usePathname();
    
    const personalNav = [
        { href: '/dashboard', icon: <HomeIcon />, label: 'Dashboard' },
        { href: '/alunos', icon: <UsersIcon />, label: 'Alunos' },
        { href: '/exercicios', icon: <DumbbellIcon />, label: 'Exercícios' },
        { href: '/perfil', icon: <UserIcon />, label: 'Perfil' },
    ];

    const alunoNav = [
        { href: '/dashboard', icon: <HomeIcon />, label: 'Hoje' },
        { href: '/treinos', icon: <DumbbellIcon />, label: 'Treinos' },
        { href: '/progresso', icon: <UserIcon />, label: 'Progresso' },
    ];
    
    const navItems = role === 'personal' ? personalNav : alunoNav;

    return (
        <footer className="fixed bottom-0 left-0 right-0 h-20 bg-dark-surface/80 backdrop-blur-lg border-t border-dark-border z-40">
            <nav className="h-full max-w-lg mx-auto flex items-center justify-around px-4">
                {navItems.map(item => (
                    <NavItem key={item.label} href={item.href} icon={item.icon} label={item.label} active={pathname === item.href} />
                ))}
            </nav>
        </footer>
    );
};

export default BottomNav;
