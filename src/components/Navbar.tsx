"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 className="text-gold" style={{ fontSize: '1.5rem', margin: 0 }}>BandUP</h1>
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="#features" className="nav-link" style={{ fontSize: '0.9rem' }}>Features</Link>
          <Link href="#pricing" className="nav-link" style={{ fontSize: '0.9rem' }}>Pricing</Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
            <ThemeToggle />
            <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem' }}>Login</Link>
            <Link href="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
