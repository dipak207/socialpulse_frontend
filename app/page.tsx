import Navbar from '@/components/shared/Navbar'
import Link from 'next/link'
import { ArrowRight, BarChart3, Search, Sparkles, Zap, Layers, Download } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-900 overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow opacity-60"></div>
        <div className="container relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-400 mb-8 animate-fade-in">
            <Zap className="w-4 h-4" /> Real-Time Analytics Platform
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up" style={{animationDelay: '100ms'}}>
            Intelligence for Every <br />
            <span className="gradient-text">Social Post</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{animationDelay: '200ms'}}>
            Analyze any public social media content instantly. YouTube, Instagram, TikTok, Twitter — one platform to track them all.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{animationDelay: '300ms'}}>
            <Link href="/dashboard" className="btn-primary flex items-center gap-2 text-lg">
              Start Analyzing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/compare" className="px-6 py-3 rounded-xl font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              Compare Profiles
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why SocialPulse Intelligence?</h2>
          <p className="text-gray-400">Professional grade tools for public data analysis.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Search, title: "URL Intelligence", desc: "Paste any URL, get instant analytics without logging in.", color: "bg-indigo-500/20 text-indigo-400" },
            { icon: BarChart3, title: "Engagement Engine", desc: "Real engagement rate, virality score, and trend analysis.", color: "bg-cyan-500/20 text-cyan-400" },
            { icon: Sparkles, title: "Smart Insights", desc: "AI-generated performance insights for every post.", color: "bg-purple-500/20 text-purple-400" },
            { icon: Zap, title: "Live Pipeline", desc: "Real-time analysis with live status updates.", color: "bg-yellow-500/20 text-yellow-400" },
            { icon: Layers, title: "Cross-Platform", desc: "Compare across YouTube, Instagram, TikTok and more.", color: "bg-green-500/20 text-green-400" },
            { icon: Download, title: "Export Reports", desc: "Download beautiful PDF, CSV, and JSON reports.", color: "bg-red-500/20 text-red-400" },
          ].map((feat, i) => (
            <div key={i} className="glass-card-hover p-6">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feat.color}`}>
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
              <p className="text-gray-400">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
