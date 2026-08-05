import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  {
    group: 'Proyectos',
    items: [
      {
        label: 'Todos los proyectos',
        href: '/admin',
        end: true,
        icon: (
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
      },
      {
        label: 'Nuevo proyecto',
        href: '/admin/projects/new',
        end: false,
        icon: (
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'Catálogo',
    items: [
      {
        label: 'Tecnologías',
        href: '/admin/technologies',
        end: true,
        icon: (
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        ),
      },
      {
        label: 'Skills',
        href: '/admin/skills',
        end: true,
        icon: (
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
    ],
  },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(true)

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Mobile backdrop */}
      {expanded && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full flex flex-col bg-[#0f1117] transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? 'w-64' : 'w-0 lg:w-16'
        }`}
      >
        {/* Header with toggle */}
        <div className="h-16 flex items-center px-3 flex-shrink-0">
          <div className="flex items-center gap-3 w-full overflow-hidden">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              {expanded ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <span className={`text-sm font-semibold tracking-tight whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
              dair<span className="text-violet-500">.</span>admin
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-5 overflow-y-auto overflow-x-hidden">
          {navItems.map((group) => (
            <div key={group.group}>
              <p className={`text-[10px] text-gray-600 font-semibold uppercase tracking-widest px-3 mb-1.5 whitespace-nowrap transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
                {group.group}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.end}
                    onClick={() => { if (window.innerWidth < 1024) setExpanded(false) }}
                    title={!expanded ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-violet-600/20 text-violet-400'
                          : 'text-gray-500 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {item.icon}
                    <span className={`transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
                      {item.label}
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-1 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
              {user?.username?.charAt(0)}
            </div>
            <span className={`text-sm text-gray-400 truncate transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
              {user?.username}
            </span>
          </div>
          <button
            onClick={handleLogout}
            title={!expanded ? 'Cerrar sesión' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className={`transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
              Cerrar sesión
            </span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
        expanded ? 'lg:ml-64' : 'lg:ml-16'
      } ml-0`}>

        {/* Topbar */}
        <header className="sticky top-0 z-10 h-16 bg-gray-950/80 backdrop-blur-sm flex items-center px-8">
          <span className="text-sm font-medium text-gray-500">Panel de administración</span>
        </header>

        <main className="flex-1 px-8 py-6">
          <div className="max-w-5xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
