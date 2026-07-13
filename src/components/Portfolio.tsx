'use client';

import { motion } from 'framer-motion';
import { Github, Server, Camera, Wifi } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// Icon cố định theo thứ tự project (không đổi theo ngôn ngữ)
// Project 1: Docker/AI Local → Server
// Project 2: Synology NAS/Camera → Camera
// Project 3: Home Lab/Networking → Wifi
const ICONS = [Server, Camera, Wifi];

export default function Portfolio() {
  const { t } = useLanguage();
  const { sectionTitle, subtitle, projects } = t.portfolio;

  return (
    <section id="portfolio" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="h-48 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Icon className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {/* TODO: Thay href="#" bằng link GitHub thật khi có */}
                    <a
                      href="#"
                      className="flex-1 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-center rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
