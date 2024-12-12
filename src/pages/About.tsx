import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { TrendingUp, Shield, Users, Code, Globe, Zap, Award, ArrowRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: Shield,
    title: 'Risk-Free Trading',
    description: 'Practice trading with virtual funds in a real market environment without risking real money.'
  },
  {
    icon: Globe,
    title: 'Real-Time Market Data',
    description: 'Access live cryptocurrency market data directly from Binance exchange.'
  },
  {
    icon: Zap,
    title: 'Advanced Trading Tools',
    description: 'Professional-grade charts, technical indicators, and trading tools.'
  },
  {
    icon: Users,
    title: 'Community Learning',
    description: 'Join a community of traders, share strategies, and learn from others.'
  },
  {
    icon: Code,
    title: 'Advanced Technology',
    description: 'Built with cutting-edge technology for a seamless trading experience.'
  },
  {
    icon: Award,
    title: 'Performance Analytics',
    description: 'Detailed statistics and insights to help improve your trading strategy.'
  }
];

const FloatingElement = ({ delay = 0, duration = 3, className = '' }) => (
  <motion.div
    className={`absolute rounded-full mix-blend-overlay ${className}`}
    animate={{
      y: [0, -20, 0],
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

export default function About() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef);
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const springScrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (isHeroInView) {
      const element = heroRef.current;
      element.style.setProperty('--gradient-position', '100%');
    }
  }, [isHeroInView]);

  return (
    <div className="relative overflow-hidden">
      <motion.div className="min-h-screen py-12 px-4 max-w-7xl mx-auto">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingElement
            className="w-72 h-72 bg-yellow-500/30 blur-3xl -top-20 -right-20"
            delay={0}
          />
          <FloatingElement
            className="w-96 h-96 bg-yellow-500/20 blur-3xl -bottom-20 -left-20"
            delay={1}
          />
          <FloatingElement
            className="w-64 h-64 bg-yellow-400/20 blur-3xl top-1/2 left-1/4"
            delay={2}
          />
        </div>

        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          style={{ opacity, scale }}
          className="text-center mb-32 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 360] }}
            transition={{ 
              type: "spring",
              duration: 1.5,
              bounce: 0.5
            }}
            className="relative inline-block mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative p-4 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-2xl shadow-lg shadow-yellow-500/20">
              <TrendingUp className="w-12 h-12 text-black" />
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-gray-900 dark:text-white">The Future of </span>
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">
              Crypto Trading
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Experience the most advanced crypto trading simulator with real-time market data
            and professional tools.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-black text-lg font-medium rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center space-x-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-bounce"
          >
            <ChevronDown className="w-6 h-6 text-yellow-500" />
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          style={{ opacity: springScrollY }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group bg-white dark:bg-gray-800/50 p-8 rounded-xl border border-gray-100 dark:border-yellow-500/10 backdrop-blur-sm hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-yellow-500/20 transition-all duration-300"
              >
                <feature.icon className="w-8 h-8 text-black" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative text-center bg-gradient-to-br from-yellow-500 to-yellow-400 p-12 rounded-3xl shadow-2xl shadow-yellow-500/20 overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, rgba(0,0,0,0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, rgba(0,0,0,0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 0%, rgba(0,0,0,0.1) 0%, transparent 50%)"
              ]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-black/80 max-w-2xl mx-auto">
              Join thousands of successful traders who have already mastered their skills with MaTrade.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="group px-8 py-4 bg-black text-white text-lg font-medium rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-black/20 flex items-center justify-center mx-auto space-x-2"
            >
              <span>Start Trading Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}