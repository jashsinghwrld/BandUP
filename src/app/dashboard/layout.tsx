"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardList, 
  History, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Prompts", href: "/dashboard/prompts", icon: FileText },
  { name: "Assignments", href: "/dashboard/assignments", icon: ClipboardList },
  { name: "Submissions", href: "/dashboard/submissions", icon: History },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Animated Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '0 0.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
            <span style={{ color: '#000', fontWeight: '800', fontSize: '1.2rem' }}>B</span>
          </div>
          <h2 className="text-gold" style={{ margin: 0, fontSize: '1.4rem' }}>BandUP</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                <item.icon size={18} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="active-indicator"
                    style={{ 
                      position: 'absolute', 
                      left: 0, 
                      width: '3px', 
                      height: '20px', 
                      backgroundColor: 'var(--primary)',
                      borderRadius: '0 4px 4px 0'
                    }}
                  />
                )}
              </Link>
            );
          })}
          
          <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'grid', gap: '0.25rem' }}>
            <Link href="/dashboard/settings" className={`nav-link ${pathname === '/dashboard/settings' ? 'active' : ''}`}>
              <Settings size={18} />
              <span>Settings</span>
            </Link>
            <Link href="/api/auth/signout" className="nav-link" style={{ color: 'var(--error)' }}>
              <LogOut size={18} />
              <span>Logout</span>
            </Link>
          </div>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header className="navbar" style={{ position: 'sticky', top: 0, width: '100%', borderLeft: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'center', gap: '1.5rem' }}>
            <ThemeToggle />
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--secondary)'
            }}>
              <Bell size={20} />
            </div>
            <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Admin User</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Trainer Account</div>
              </div>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: 'var(--radius-full)', 
                backgroundColor: 'var(--surface-high)',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                AU
              </div>
            </div>
          </div>
        </header>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ padding: '2.5rem', flex: 1 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
