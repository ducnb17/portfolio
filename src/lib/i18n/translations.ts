/**
 * File chứa toàn bộ bản dịch cho 3 ngôn ngữ: Tiếng Việt, English, 日本語
 * Thêm key mới vào cả 3 ngôn ngữ khi cần dịch thêm nội dung.
 */

export type Locale = 'vi' | 'en' | 'ja';

// ── TypeScript Interfaces ──────────────────────────────────────────────────

export interface NavTranslations {
  home: string;
  about: string;
  experience: string;
  education: string;
  portfolio: string;
  blog: string;
  news: string;
  lms: string;
  contact: string;
}

export interface HeroTranslations {
  title: string;
  description: string;
  viewPortfolio: string;
  contact: string;
  lmsCourses: string;
  github: string;
  githubUrl: string;
}

export interface AboutTranslations {
  sectionTitle: string;
  jobTitle: string;
  description: string;
  skills: string;
  languages: string;
  skillCategories: {
    os: string;
    infrastructure: string;
    database: string;
    programming: string;
    aiTools: string;
    hardware: string;
  };
  langVi: string;
  langJa: string;
  langEn: string;
}

export interface ExperienceTranslations {
  sectionTitle: string;
  jobs: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
}

export interface EducationTranslations {
  sectionTitle: string;
  educationLabel: string;
  certificationsLabel: string;
  inProgressLabel: string;
  items: Array<{
    degree: string;
    school: string;
    period: string;
  }>;
}

export interface PortfolioTranslations {
  sectionTitle: string;
  subtitle: string;
  projects: Array<{
    title: string;
    description: string;
    tech: string[];
    status: string;
    link: string;
  }>;
  viewSource: string;
}

export interface LearningTranslations {
  sectionTitle: string;
  subtitle: string;
  items: Array<{ title: string; description: string }>;
}

export interface ContactTranslations {
  sectionTitle: string;
  infoTitle: string;
  infoDesc: string;
  phone: string;
  address: string;
  addressValue: string;
  email: string;
  formName: string;
  formNamePlaceholder: string;
  formSubject: string;
  formSubjectPlaceholder: string;
  formMessage: string;
  formMessagePlaceholder: string;
  formSubmit: string;
  formSuccess: string;
}

export interface FooterTranslations {
  contact: string;
  address: string;
  addressLine1: string;
  addressLine2: string;
  social: string;
  github: string;
  githubUrl: string;
  rights: string;
}

export interface Translations {
  nav: NavTranslations;
  hero: HeroTranslations;
  about: AboutTranslations;
  experience: ExperienceTranslations;
  education: EducationTranslations;
  portfolio: PortfolioTranslations;
  learning: LearningTranslations;
  contact: ContactTranslations;
  footer: FooterTranslations;
}

// ── Translations Dictionary ─────────────────────────────────────────────────

export const translations: Record<Locale, Translations> = {
  vi: {
    nav: { home: 'Trang chủ', about: 'Giới thiệu', experience: 'Kinh nghiệm', education: 'Học vấn', portfolio: 'Dự án', blog: 'Chia sẻ kiến thức', news: 'Tin tức', lms: 'LMS', contact: 'Liên hệ' },
    hero: {
      title: 'System Operations & AI-Assisted Projects',
      description: 'Kỹ thuật viên CNTT tập trung vào IT Support và System Operations; có kinh nghiệm vận hành VPS, web, cơ sở dữ liệu, ảo hóa và xử lý sự cố. Thực hành triển khai dự án với AI hỗ trợ theo quy trình có kiểm soát.',
      viewPortfolio: 'Xem dự án', contact: 'Liên hệ', lmsCourses: 'Khám phá LMS', github: 'GitHub', githubUrl: 'https://github.com/ducnb17',
    },
    about: {
      sectionTitle: 'Hồ sơ năng lực', jobTitle: 'Kỹ thuật viên CNTT / IT Support / System Operations',
      description: 'Kỹ thuật viên hệ thống thông tin với nền tảng vận hành VPS, web, database, ảo hóa và xử lý sự cố phần cứng/phần mềm. Tôi thực hành workflow vibe coding có kiểm soát: khảo sát kiến trúc, dùng AI hỗ trợ triển khai, tự kiểm thử và sửa lỗi, quản lý mã nguồn rồi deploy theo checklist. Định hướng phát triển ở System Operations và AI/Cybersecurity.',
      skills: 'Kỹ năng kỹ thuật', languages: 'Ngoại ngữ',
      skillCategories: { os: 'Hệ điều hành', infrastructure: 'Hạ tầng & Cloud', database: 'Cơ sở dữ liệu', programming: 'Lập trình cơ bản', aiTools: 'AI hỗ trợ triển khai', hardware: 'Phần cứng & Homelab' },
      langVi: '🇻🇳 Tiếng Việt (Bản xứ)', langJa: '🇯🇵 Tiếng Nhật (JLPT N4)', langEn: '🇬🇧 Tiếng Anh (Đọc hiểu tài liệu kỹ thuật)',
    },
    experience: {
      sectionTitle: 'Kinh nghiệm & Thực hành',
      jobs: [
        { title: 'Kỹ thuật viên hệ thống & Tự động hóa CNTT', company: 'Dự án cá nhân / Thực hành vận hành', period: '2023 - Hiện tại', description: 'Quản trị VPS Linux và dịch vụ web; cấu hình Nginx/Apache, SSL, DNS, database; giám sát và khắc phục sự cố. Dùng AI hỗ trợ mô tả yêu cầu, chạy thử, kiểm tra kết quả, ghi nhận lỗi, chỉnh sửa và deploy theo checklist. Vận hành môi trường VMware, VirtualBox, Proxmox và Docker.' },
        { title: 'Kỹ thuật viên CNTT', company: 'Freelance', period: '2018 - Hiện tại', description: 'Lắp ráp, nâng cấp và sửa chữa PC; cài đặt, tối ưu hệ điều hành; tư vấn NAS và Homelab. Phân tích, xử lý sự cố phần cứng/phần mềm cho người dùng.' },
      ],
    },
    education: {
      sectionTitle: 'Học vấn & Chứng chỉ', educationLabel: 'Học vấn', certificationsLabel: 'Chứng chỉ', inProgressLabel: 'Đang học',
      items: [
        { degree: 'Hệ Cao đẳng - Hệ thống thông tin', school: 'Học viện Công nghệ Bưu chính Viễn thông (PTIT)', period: '2011 - 2014' },
        { degree: 'Du học sinh - Ngôn ngữ Nhật', school: 'Trường Nhật ngữ JAM, Niigata, Nhật Bản', period: '2015 - 2017' },
      ],
    },
    portfolio: {
      sectionTitle: 'Dự án Vibe-code tiêu biểu', subtitle: 'Các dự án được triển khai bằng workflow AI hỗ trợ, với vai trò tập trung vào yêu cầu, thử nghiệm, xử lý lỗi, vận hành và trải nghiệm người dùng.', viewSource: 'Xem mã nguồn',
      projects: [
        { title: 'Portfolio cá nhân & LMS', status: 'Đang vận hành', description: 'Xác định nhu cầu, dùng AI tạo và điều chỉnh mã nguồn, chạy thử, kiểm tra giao diện rồi triển khai website portfolio/LMS lên Ubuntu VPS. Vận hành đăng nhập Google, phân quyền admin, upload nội dung và lưu dữ liệu.', tech: ['AI-assisted', 'Next.js', 'Ubuntu VPS'], link: 'https://github.com/ducnb17/portfolio' },
        { title: 'Soniox Live Translate', status: 'Đã chạy - Đang tối ưu', description: 'Ứng dụng Windows dịch giọng nói thời gian thực với lựa chọn thiết bị âm thanh, lịch sử hội thoại và xuất dữ liệu. Vai trò tập trung vào mô tả yêu cầu, thử nghiệm, phản hồi lỗi và kiểm tra trải nghiệm.', tech: ['Python', 'Soniox', 'Windows'], link: 'https://github.com/ducnb17/soniox-live-translate' },
        { title: 'Async Web Crawler', status: 'Đang phát triển', description: 'Prototype crawler được xây dựng theo từng milestone, hướng tới quản lý crawl jobs, tiến trình và kết quả. Chưa có bản end-to-end sẵn sàng vận hành và đang được hoàn thiện từng phần.', tech: ['Python', 'AsyncIO', 'Crawler'], link: 'https://github.com/ducnb17/crawler' },
      ],
    },
    learning: {
      sectionTitle: 'Đang học', subtitle: 'Các lộ trình đang theo đuổi để củng cố năng lực hạ tầng, Linux và an toàn thông tin.',
      items: [
        { title: 'CCNA', description: 'Kiến thức nền tảng mạng, routing, switching và xử lý sự cố.' },
        { title: 'TCM Security - PEH', description: 'Nền tảng ethical hacking và phương pháp kiểm thử bảo mật thực hành.' },
        { title: 'LPI 1, 2', description: 'Quản trị Linux từ nền tảng đến vận hành hệ thống nâng cao.' },
      ],
    },
    contact: { sectionTitle: 'Liên hệ', infoTitle: 'Thông tin liên hệ', infoDesc: 'Tôi sẵn sàng trao đổi về cơ hội Kỹ thuật viên CNTT, IT Support, System Operations và các dự án vận hành có AI hỗ trợ.', phone: 'Điện thoại', address: 'Địa chỉ', addressValue: 'TP. Hà Nội, Việt Nam', email: 'Email', formName: 'Họ và tên', formNamePlaceholder: 'Nguyễn Văn A', formSubject: 'Tiêu đề', formSubjectPlaceholder: 'Tiêu đề liên hệ', formMessage: 'Nội dung', formMessagePlaceholder: 'Nội dung tin nhắn...', formSubmit: 'Gửi tin nhắn', formSuccess: 'Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.' },
    footer: { contact: 'Liên hệ', address: 'Địa chỉ', addressLine1: 'TP. Hà Nội, Việt Nam', addressLine2: '', social: 'Mạng xã hội', github: 'GitHub', githubUrl: 'https://github.com/ducnb17', rights: '© 2026 Nguyễn Bá Đức. Tất cả các quyền được bảo lưu.' },
  },

  en: {
    nav: { home: 'Home', about: 'Profile', experience: 'Experience', education: 'Education', portfolio: 'Projects', blog: 'Knowledge', news: 'News', lms: 'LMS', contact: 'Contact' },
    hero: { title: 'System Operations & AI-Assisted Projects', description: 'IT technician focused on IT Support and System Operations, with hands-on experience in VPS, web services, databases, virtualization, and troubleshooting. I deliver AI-assisted projects through a controlled workflow.', viewPortfolio: 'View Projects', contact: 'Contact Me', lmsCourses: 'Explore LMS', github: 'GitHub', githubUrl: 'https://github.com/ducnb17' },
    about: { sectionTitle: 'Professional Profile', jobTitle: 'IT Technician / IT Support / System Operations', description: 'Information systems technician with hands-on experience in VPS and web operations, databases, virtualization, and hardware/software troubleshooting. My controlled vibe-coding workflow covers architecture review, AI-assisted implementation, testing, debugging, source control, and checklist-based deployment. I am developing deeper expertise in System Operations and AI/Cybersecurity.', skills: 'Technical Skills', languages: 'Languages', skillCategories: { os: 'Operating Systems', infrastructure: 'Infrastructure & Cloud', database: 'Database', programming: 'Basic Programming', aiTools: 'AI-Assisted Delivery', hardware: 'Hardware & Homelab' }, langVi: '🇻🇳 Vietnamese (Native)', langJa: '🇯🇵 Japanese (JLPT N4)', langEn: '🇬🇧 English (Technical reading)' },
    experience: { sectionTitle: 'Experience & Practice', jobs: [
      { title: 'Systems & IT Automation Technician', company: 'Personal Projects / Operations Practice', period: '2023 - Present', description: 'Administer Linux VPS and web services; configure Nginx/Apache, SSL, DNS, and databases; monitor and troubleshoot services. Use AI to turn requirements into tested changes, record defects, iterate, and deploy through checklists. Operate VMware, VirtualBox, Proxmox, and Docker environments.' },
      { title: 'IT Technician', company: 'Freelance', period: '2018 - Present', description: 'Build, upgrade, and repair PCs; install and optimize operating systems; advise on NAS and homelab setups; diagnose hardware and software issues for users.' },
    ] },
    education: { sectionTitle: 'Education & Certifications', educationLabel: 'Education', certificationsLabel: 'Certifications', inProgressLabel: 'In Progress', items: [
      { degree: 'Associate Degree - Information Systems', school: 'Posts and Telecommunications Institute of Technology (PTIT)', period: '2011 - 2014' },
      { degree: 'International Student - Japanese Language', school: 'JAM Japanese Language School, Niigata, Japan', period: '2015 - 2017' },
    ] },
    portfolio: { sectionTitle: 'Featured AI-Assisted Projects', subtitle: 'Projects delivered through AI-assisted workflows, with my contribution centered on requirements, testing, troubleshooting, operations, and user experience.', viewSource: 'View Source', projects: [
      { title: 'Personal Portfolio & LMS', status: 'Live', description: 'Defined requirements, used AI to generate and refine code, tested the interface, and deployed the portfolio/LMS to an Ubuntu VPS. Operate Google sign-in, admin authorization, content uploads, and data persistence.', tech: ['AI-assisted', 'Next.js', 'Ubuntu VPS'], link: 'https://github.com/ducnb17/portfolio' },
      { title: 'Soniox Live Translate', status: 'Working - Optimizing', description: 'Windows real-time speech translation app with audio-device selection, conversation history, and data export. My role focuses on requirements, testing, defect feedback, and experience validation.', tech: ['Python', 'Soniox', 'Windows'], link: 'https://github.com/ducnb17/soniox-live-translate' },
      { title: 'Async Web Crawler', status: 'In Development', description: 'Milestone-based crawler prototype intended to manage crawl jobs, progress, and results. It is not yet end-to-end production-ready and is being completed incrementally.', tech: ['Python', 'AsyncIO', 'Crawler'], link: 'https://github.com/ducnb17/crawler' },
    ] },
    learning: { sectionTitle: 'Currently Learning', subtitle: 'Active learning paths in networking, Linux operations, and cybersecurity.', items: [
      { title: 'CCNA', description: 'Networking fundamentals, routing, switching, and troubleshooting.' },
      { title: 'TCM Security - PEH', description: 'Ethical hacking foundations and practical security testing methodology.' },
      { title: 'LPI 1, 2', description: 'Linux administration from fundamentals to advanced operations.' },
    ] },
    contact: { sectionTitle: 'Contact', infoTitle: 'Contact Information', infoDesc: 'I am open to opportunities in IT Technician, IT Support, System Operations, and AI-assisted operations projects.', phone: 'Phone', address: 'Address', addressValue: 'Hanoi City, Vietnam', email: 'Email', formName: 'Full Name', formNamePlaceholder: 'John Doe', formSubject: 'Subject', formSubjectPlaceholder: 'Contact subject', formMessage: 'Message', formMessagePlaceholder: 'Your message...', formSubmit: 'Send Message', formSuccess: 'Thank you for reaching out! I will get back to you as soon as possible.' },
    footer: { contact: 'Contact', address: 'Address', addressLine1: 'Hanoi City, Vietnam', addressLine2: '', social: 'Social Media', github: 'GitHub', githubUrl: 'https://github.com/ducnb17', rights: '© 2026 Nguyễn Bá Đức. All rights reserved.' },
  },

  ja: {
    nav: { home: 'ホーム', about: 'プロフィール', experience: '経験', education: '学歴', portfolio: 'プロジェクト', blog: 'ナレッジ', news: 'ニュース', lms: 'LMS', contact: 'お問い合わせ' },
    hero: { title: 'システム運用・AI支援プロジェクト', description: 'ITサポートとシステム運用を中心に、VPS、Webサービス、データベース、仮想化、障害対応を実践しているIT技術者です。管理された手順でAI支援プロジェクトを展開しています。', viewPortfolio: 'プロジェクトを見る', contact: 'お問い合わせ', lmsCourses: 'LMSを見る', github: 'GitHub', githubUrl: 'https://github.com/ducnb17' },
    about: { sectionTitle: '職務プロフィール', jobTitle: 'IT技術者 / ITサポート / システム運用', description: 'VPS・Web運用、データベース、仮想化、ハードウェア／ソフトウェアの障害対応を実践する情報システム技術者です。アーキテクチャ確認、AI支援による実装、テスト、修正、ソース管理、チェックリストに基づくデプロイを行っています。システム運用とAI／サイバーセキュリティの専門性向上を目指しています。', skills: '技術スキル', languages: '言語', skillCategories: { os: 'オペレーティングシステム', infrastructure: 'インフラ・クラウド', database: 'データベース', programming: '基礎プログラミング', aiTools: 'AI支援開発・運用', hardware: 'ハードウェア・ホームラボ' }, langVi: '🇻🇳 ベトナム語（母語）', langJa: '🇯🇵 日本語（JLPT N4）', langEn: '🇬🇧 英語（技術文書の読解）' },
    experience: { sectionTitle: '経験・実践', jobs: [
      { title: 'システム・IT自動化技術者', company: '個人プロジェクト／運用実践', period: '2023年 - 現在', description: 'Linux VPSとWebサービスを管理し、Nginx/Apache、SSL、DNS、データベースを設定。監視と障害対応を行い、AI支援で要件整理、試験、エラー記録、修正、チェックリストによるデプロイを実施。VMware、VirtualBox、Proxmox、Docker環境も運用しています。' },
      { title: 'IT技術者', company: 'フリーランス', period: '2018年 - 現在', description: 'PCの組立・アップグレード・修理、OSのインストールと最適化、NAS・ホームラボの相談、利用者のハードウェア／ソフトウェア障害対応を行っています。' },
    ] },
    education: { sectionTitle: '学歴・資格', educationLabel: '学歴', certificationsLabel: '取得資格', inProgressLabel: '学習中', items: [
      { degree: '準学士 - 情報システム', school: '郵政通信技術学院（PTIT）', period: '2011年 - 2014年' },
      { degree: '留学生 - 日本語', school: 'JAM日本語学校（新潟・日本）', period: '2015年 - 2017年' },
    ] },
    portfolio: { sectionTitle: '代表的なAI支援プロジェクト', subtitle: '要件整理、テスト、障害対応、運用、ユーザー体験を中心にAI支援ワークフローで進めたプロジェクトです。', viewSource: 'ソースを見る', projects: [
      { title: '個人ポートフォリオ & LMS', status: '運用中', description: '要件を定義し、AIでコードを生成・調整、UIをテストしてUbuntu VPSへデプロイ。Googleログイン、管理者権限、コンテンツアップロード、データ保存を運用しています。', tech: ['AI-assisted', 'Next.js', 'Ubuntu VPS'], link: 'https://github.com/ducnb17/portfolio' },
      { title: 'Soniox Live Translate', status: '動作済み・最適化中', description: '音声デバイス選択、会話履歴、データ出力を備えたWindows向けリアルタイム音声翻訳アプリ。要件整理、試験、不具合フィードバック、使用感の確認を担当しています。', tech: ['Python', 'Soniox', 'Windows'], link: 'https://github.com/ducnb17/soniox-live-translate' },
      { title: 'Async Web Crawler', status: '開発中', description: 'クロールジョブ、進捗、結果を管理するマイルストーン方式のプロトタイプ。まだエンドツーエンドで運用可能な段階ではなく、段階的に完成させています。', tech: ['Python', 'AsyncIO', 'Crawler'], link: 'https://github.com/ducnb17/crawler' },
    ] },
    learning: { sectionTitle: '学習中', subtitle: 'ネットワーク、Linux運用、サイバーセキュリティの学習を継続しています。', items: [
      { title: 'CCNA', description: 'ネットワーク基礎、ルーティング、スイッチング、障害対応。' },
      { title: 'TCM Security - PEH', description: '倫理的ハッキングの基礎と実践的なセキュリティテスト。' },
      { title: 'LPI 1, 2', description: 'Linuxの基礎から高度なシステム運用まで。' },
    ] },
    contact: { sectionTitle: 'お問い合わせ', infoTitle: '連絡先', infoDesc: 'IT技術者、ITサポート、システム運用、AI支援運用プロジェクトの機会についてお気軽にご連絡ください。', phone: '電話番号', address: '住所', addressValue: 'ハノイ市、ベトナム', email: 'メール', formName: 'お名前', formNamePlaceholder: '山田 太郎', formSubject: '件名', formSubjectPlaceholder: 'お問い合わせの件名', formMessage: 'メッセージ', formMessagePlaceholder: 'メッセージをご入力ください...', formSubmit: '送信する', formSuccess: 'お問い合わせありがとうございます。できるだけ早くご返信いたします。' },
    footer: { contact: '連絡先', address: '住所', addressLine1: 'ハノイ市、ベトナム', addressLine2: '', social: 'ソーシャルメディア', github: 'GitHub', githubUrl: 'https://github.com/ducnb17', rights: '© 2026 Nguyễn Bá Đức. 全著作権所有。' },
  },
} as const;

export type TranslationKeys = typeof translations.vi;
