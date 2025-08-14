// Enhanced Header Component with modern design
"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { 
  Home, 
  PlusSquare, 
  User, 
  LogOut, 
  Camera,
  Heart,
  Search,
  MessageCircle,
  Menu,
  X
} from "lucide-react"

export default function Header() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: "/", icon: Home, label: "홈", active: pathname === "/" },
    { href: "/create", icon: PlusSquare, label: "작성", active: pathname === "/create" },
    { href: "/profile", icon: User, label: "프로필", active: pathname === "/profile" },
  ]

  return (
    <header className={`
      sticky top-0 z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm' 
        : 'bg-white border-b border-gray-100'
      }
    `}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <Camera className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              MyGram
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          {session && (
            <div className="hidden md:flex items-center max-w-xs w-full mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="검색..."
                  className="input pl-10 pr-4 py-2 text-sm bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {status === "loading" ? (
              <div className="flex items-center space-x-2">
                <div className="skeleton w-8 h-8 rounded-full"></div>
                <div className="skeleton w-16 h-4 rounded"></div>
              </div>
            ) : session ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 rounded-lg transition-all duration-200
                      ${item.active 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className={`w-5 h-5 ${item.active ? 'fill-current' : ''}`} />
                    <span className="ml-2 text-sm font-medium hidden lg:block">
                      {item.label}
                    </span>
                  </Link>
                ))}

                {/* Action Icons */}
                <div className="flex items-center space-x-1 ml-4 pl-4 border-l border-gray-200">
                  <button className="icon-btn">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="icon-btn">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Profile Menu */}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  <Link href="/profile" className="flex items-center space-x-2 group">
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="avatar w-8 h-8"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 hidden xl:block">
                      {session.user.name}
                    </span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="icon-btn text-gray-500 hover:text-red-600"
                    title="로그아웃"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-primary"
              >
                로그인
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          {session && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden icon-btn"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {session && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 animate-fadeIn">
            <div className="py-4 space-y-2">
              {/* Mobile Search */}
              <div className="px-2 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="검색..."
                    className="input pl-10 pr-4 py-2 text-sm bg-gray-50"
                  />
                </div>
              </div>

              {/* Mobile Navigation */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-lg mx-2 transition-all duration-200
                    ${item.active 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${item.active ? 'fill-current' : ''}`} />
                  <span className="ml-3 font-medium">{item.label}</span>
                </Link>
              ))}

              {/* Mobile Actions */}
              <div className="flex items-center justify-around pt-4 mx-2 border-t border-gray-100">
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">활동</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">메시지</span>
                </button>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">로그아웃</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}