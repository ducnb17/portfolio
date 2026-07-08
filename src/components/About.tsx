'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  // Skill categories + values — category keys dịch theo ngôn ngữ
  const skills: [string, string[]][] = [
    [t.about.skillCategories.os, ['Windows', 'Linux', 'MacOS']],
    [t.about.skillCategories.database, ['MySQL']],
    [t.about.skillCategories.programming, ['C++', 'Java', 'HTML/CSS', 'Python', 'AI/ML']],
    [t.about.skillCategories.office, ['Excel', 'Word', 'PowerPoint']],
    [t.about.skillCategories.security, ['Cybersecurity Fundamentals']],
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {t.about.sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-7xl font-bold shadow-2xl">
              NBD
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
              Nguyễn Bá Đức
            </h3>
            <p className="text-cyan-600 dark:text-cyan-400 font-semibold mb-4">
              {t.about.jobTitle}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {t.about.description}
            </p>

            {/* Skills */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-gray-800 dark:text-white">{t.about.skills}</h4>
              {skills.map(([category, items]) => (
                <div key={category}>
                  <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {category}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {t.about.languages}
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {t.about.langVi}
                </span>
      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
        {t.about.langJa}
      </span>
      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
        {t.about.langEn}
      </span>
    </div>
  </div>
</motion.div>
        </div>
      </div>
    </section>
  );
}
