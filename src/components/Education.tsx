'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// Chứng chỉ không dịch (tên cố định), chỉ dịch label section
const certifications = [
  { name: 'C++ & UI', issuer: 'FUNiX', year: '2019' },
  { name: 'Java Web', issuer: 'BKACAD', year: '2017' },
  { name: 'JLPT N4', issuer: 'Japan Foundation', year: '2017' },
];

export default function Education() {
  const { t } = useLanguage();
  const educationItems = t.education.items;

  return (
    <section id="education" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {t.education.sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-800 dark:text-white">
              <GraduationCap className="w-8 h-8 text-cyan-500" />
              {t.education.educationLabel}
            </h3>
            <div className="space-y-6">
              {educationItems.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-cyan-500"
                >
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {edu.degree}
                  </h4>
                  <p className="text-cyan-600 dark:text-cyan-400 font-semibold mb-2">
                    {edu.school}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{edu.period}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-800 dark:text-white">
              <Award className="w-8 h-8 text-cyan-500" />
              {t.education.certificationsLabel}
            </h3>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border border-cyan-200 dark:border-gray-600"
                >
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {cert.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{cert.issuer}</p>
                  <span className="inline-block px-3 py-1 bg-cyan-500 text-white text-sm rounded-full">
                    {cert.year}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
