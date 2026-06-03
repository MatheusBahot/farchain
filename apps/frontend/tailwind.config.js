/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Status badges — gerados dinamicamente
    'bg-success-500/10','text-success-600','text-success-400','border-success-500/20',
    'bg-warning-500/10','text-warning-600','text-warning-400','border-warning-500/20',
    'bg-danger-500/10', 'text-danger-600', 'text-danger-400', 'border-danger-500/20',
    'bg-primary-500/10','text-primary-700','text-primary-400','border-primary-500/20',
    'bg-teal-500/10',  'text-teal-700',  'text-teal-400',  'border-teal-500/20',
    'bg-grafite-500/10','text-grafite-600','text-grafite-400','border-grafite-500/20',
    // Cores dinâmicas de KPI cards
    'bg-primary-500/10','border-primary-500/20','text-primary-500',
    'bg-teal-500/10',  'border-teal-500/20',  'text-teal-500',
    'bg-warning-500/10','border-warning-500/20','text-warning-500',
    'bg-danger-500/10', 'border-danger-500/20', 'text-danger-500',
    'bg-success-500/10','border-success-500/20','text-success-500',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',
          400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',
          800:'#1e40af',900:'#1e3a8a',950:'#172554',
        },
        teal: {
          50:'#f0fdfa',100:'#ccfbf1',200:'#99f6e4',300:'#5eead4',
          400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e',
          800:'#115e59',900:'#134e4a',950:'#042f2e',
        },
        grafite: {
          50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',
          400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',
          800:'#1e293b',900:'#0f172a',950:'#020617',
        },
        success: { 400:'#4ade80', 500:'#22c55e', 600:'#16a34a' },
        warning: { 400:'#fbbf24', 500:'#f59e0b', 600:'#d97706' },
        danger:  { 400:'#f87171', 500:'#ef4444', 600:'#dc2626' },
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Sora', 'Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'slide-up':   'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { '0%':{ opacity:'0' }, '100%':{ opacity:'1' } },
        slideUp: { '0%':{ opacity:'0', transform:'translateY(20px)' }, '100%':{ opacity:'1', transform:'translateY(0)' } },
        float:   { '0%,100%':{ transform:'translateY(0px)' }, '50%':{ transform:'translateY(-10px)' } },
      },
      boxShadow: {
        'glow-blue': '0 0 40px -10px rgba(37,99,235,0.5)',
        'glow-teal': '0 0 40px -10px rgba(13,148,136,0.4)',
        'card':      '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)',
        'card-hover':'0 10px 40px -10px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};
