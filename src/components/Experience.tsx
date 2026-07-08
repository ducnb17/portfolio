'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Experience() {
  const { t } = useLanguage();
  const experiences = t.experience.jobs;

  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {t.experience.sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Đường dọc giữa */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-600 -translate-x-1/2" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div
                  className={`md:w-5/12 ${
                    index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                  }`}
                >
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-cyan-500">
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                          {exp.title}
                        </h3>
                        <p className="text-cyan-600 dark:text-cyan-400 font-semibold">
                          {exp.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full whitespace-nowrap">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="hidden md:block absolute left-1/2 top-8 w-4 h-4 bg-cyan-500 rounded-full -translate-x-1/2 shadow-lg shadow-cyan-500/50" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
