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
    database: string;
    programming: string;
    office: string;
    security: string;
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
  }>;
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
  contact: ContactTranslations;
  footer: FooterTranslations;
}

// ── Translations Dictionary ─────────────────────────────────────────────────

export const translations: Record<Locale, Translations> = {
  vi: {
    nav: {
      home: 'Trang chủ',
      about: 'Giới thiệu',
      experience: 'Kinh nghiệm',
      education: 'Học vấn',
      portfolio: 'Portfolio',
      blog: 'Blog',
      lms: 'LMS',
      contact: 'Liên hệ',
    },
    hero: {
      title: 'Information Systems Technician',
      description:
        'Tốt nghiệp Hệ thống thông tin (PTIT), có nền tảng vững chắc về vận hành hệ thống, xử lý sự cố phần cứng/phần mềm và cơ sở dữ liệu. Định hướng phát triển sâu về AI và Cybersecurity.',
      viewPortfolio: 'Xem Portfolio',
      contact: 'Liên hệ',
      lmsCourses: 'LMS Khóa học',
      github: 'GitHub',
      githubUrl: 'https://github.com/ducnb17',
    },
    about: {
      sectionTitle: 'Giới thiệu',
      jobTitle: 'Information Systems Technician',
      description:
        'Tốt nghiệp chuyên ngành Hệ thống thông tin (PTIT), có nền tảng vững chắc về vận hành hệ thống, xử lý sự cố phần cứng/phần mềm và cơ sở dữ liệu. Có 2 năm học tập tại Nhật Bản (JLPT N4), tác phong làm việc chuẩn mực. Định hướng phát triển sâu về AI và Cybersecurity.',
      skills: 'Kỹ năng',
      languages: 'Ngôn ngữ',
      skillCategories: {
        os: 'Hệ điều hành',
        database: 'Cơ sở dữ liệu',
        programming: 'Lập trình',
        office: 'Tin học văn phòng',
        security: 'Cybersecurity',
      },
      langVi: '🇻🇳 Tiếng Việt (Bản xứ)',
      langJa: '🇯🇵 Tiếng Nhật (Giao tiếp cơ bản/N4)',
      langEn: '🇬🇧 Tiếng Anh (Giao tiếp cơ bản)',
    },
    experience: {
      sectionTitle: 'Kinh nghiệm làm việc',
      jobs: [
        {
          title: 'Kỹ thuật viên CNTT tự do',
          company: 'Freelancer',
          period: '2018 - Nay',
          description:
            'Cài đặt/cấu hình hệ điều hành, sửa chữa nâng cấp phần cứng; tham gia dự án xử lý, phân loại, gắn nhãn dữ liệu hình ảnh (Data Labeling) cho mô hình AI.',
        },
        {
          title: 'Học viên & Thực tập sinh CNTT',
          company: 'FUNiX, BKACAD',
          period: '2017 - 2019',
          description:
            'Hoàn thành khóa Automotive Programming (C++, UI) tại FUNiX, Java Web tại BKACAD; thực tập ngắn hạn Backend Java.',
        },
        {
          title: 'Nhân viên hỗ trợ - Vận hành kho & CSKH',
          company: 'Thời vụ',
          period: 'Trước 2017',
          description:
            'Phân loại hàng hóa, kiểm tra chứng từ, đối chiếu log xuất-nhập kho TMĐT; hỗ trợ kỹ thuật dịch vụ di động qua tổng đài.',
        },
      ],
    },
    education: {
      sectionTitle: 'Học vấn & Chứng chỉ',
      educationLabel: 'Học vấn',
      certificationsLabel: 'Chứng chỉ',
      items: [
        {
          degree: 'Hệ Cao đẳng - Hệ thống thông tin',
          school: 'Học viện Công nghệ Bưu chính Viễn thông (PTIT)',
          period: '2011 - 2014',
        },
        {
          degree: 'Du học sinh - Ngôn ngữ Nhật',
          school: 'Trường Nhật ngữ JAM, Niigata, Nhật Bản',
          period: '2015 - 2017',
        },
      ],
    },
    portfolio: {
      sectionTitle: 'Portfolio',
      subtitle: 'Một số dự án tiêu biểu trong lĩnh vực AI và hạ tầng hệ thống',
      projects: [
        {
          title: 'Triển khai mô hình AI Local (Ollama) trên Docker',
          description:
            'Tự cấu hình Docker và Ollama để chạy các mô hình ngôn ngữ lớn (LLM) trên máy cá nhân. Xử lý bài toán tối ưu VRAM để tránh tràn bộ nhớ khi chạy mô hình trên GPU phổ thông (RTX 3060).',
          tech: ['Docker', 'Ollama', 'AI Local'],
        },
        {
          title: 'Giải pháp lưu trữ và giám sát Camera qua Synology NAS',
          description:
            'Cấu hình hệ thống NAS Synology, tích hợp và quản lý luồng dữ liệu từ camera an ninh, thiết lập phân quyền truy cập và lưu trữ dữ liệu an toàn.',
          tech: ['Synology NAS', 'Surveillance', 'Storage'],
        },
        {
          title: 'Thiết kế và tối ưu hạ tầng mạng nội bộ (Home Lab)',
          description:
            'Tự thiết kế và xử lý sự cố hạ tầng mạng gia đình, bao gồm bài toán giải nhiệt cho modem/router quá tải nhiệt gây nghẽn mạng, tối ưu hiệu năng đường truyền.',
          tech: ['Networking', 'Troubleshooting', 'Home Lab'],
        },
        {
          title: 'Quản lý cơ sở dữ liệu - Hệ thống vận hành',
          description:
            'Công cụ quản lý và vận hành cơ sở dữ liệu MySQL, tối ưu truy vấn và sao lưu dữ liệu.',
          tech: ['MySQL', 'Database', 'Backup'],
        },
      ],
    },

    contact: {
      sectionTitle: 'Liên hệ',
      infoTitle: 'Thông tin liên hệ',
      infoDesc: 'Tôi luôn sẵn sàng lắng nghe và hợp tác. Hãy liên hệ với tôi qua các kênh sau:',
      phone: 'Điện thoại',
      address: 'Địa chỉ',
      addressValue: 'Đường Vĩnh Khang, TP. Hà Nội',
      email: 'Email',
      formName: 'Họ và tên',
      formNamePlaceholder: 'Nguyễn Văn A',
      formSubject: 'Tiêu đề',
      formSubjectPlaceholder: 'Tiêu đề liên hệ',
      formMessage: 'Nội dung',
      formMessagePlaceholder: 'Nội dung tin nhắn...',
      formSubmit: 'Gửi tin nhắn',
      formSuccess: 'Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.',
    },
    footer: {
      contact: 'Liên hệ',
      address: 'Địa chỉ',
      addressLine1: 'Đường Vĩnh Khang',
      addressLine2: 'TP. Hà Nội, Việt Nam',
      social: 'Mạng xã hội',
      github: 'GitHub',
      githubUrl: 'https://github.com/ducnb17',
      rights: '© 2025 Nguyễn Bá Đức. Tất cả các quyền được bảo lưu.',
    },
  },

  en: {
    nav: {
      home: 'Home',
      about: 'About',
      experience: 'Experience',
      education: 'Education',
      portfolio: 'Portfolio',
      blog: 'Blog',
      lms: 'LMS',
      contact: 'Contact',
    },
    hero: {
      title: 'Information Systems Technician',
      description:
        'Graduate in Information Systems (PTIT) with a strong foundation in system operations, hardware/software troubleshooting, and databases. Pursuing deeper expertise in AI and Cybersecurity.',
      viewPortfolio: 'View Portfolio',
      contact: 'Contact Me',
      lmsCourses: 'LMS Courses',
      github: 'GitHub',
      githubUrl: 'https://github.com/ducnb17',
    },
    about: {
      sectionTitle: 'About Me',
      jobTitle: 'Information Systems Technician',
      description:
        'Graduate in Information Systems (PTIT) with a solid background in system operations, hardware/software troubleshooting, and databases. Spent 2 years studying in Japan (JLPT N4) with professional working standards. Pursuing deeper expertise in AI and Cybersecurity.',
      skills: 'Skills',
      languages: 'Languages',
      skillCategories: {
        os: 'Operating Systems',
        database: 'Databases',
        programming: 'Programming',
        office: 'Office Tools',
        security: 'Cybersecurity',
      },
      langVi: '🇻🇳 Vietnamese (Native)',
      langJa: '🇯🇵 Japanese (Basic / JLPT N4)',
      langEn: '🇬🇧 English (Basic Communication)',
    },
    experience: {
      sectionTitle: 'Work Experience',
      jobs: [
        {
          title: 'Freelance IT Technician',
          company: 'Freelancer',
          period: '2018 - Present',
          description:
            'OS installation/configuration, hardware repair and upgrades; participated in image data processing, classification, and labeling (Data Labeling) projects for AI models.',
        },
        {
          title: 'IT Trainee & Intern',
          company: 'FUNiX, BKACAD',
          period: '2017 - 2019',
          description:
            'Completed Automotive Programming (C++, UI) at FUNiX and Java Web at BKACAD; short-term Backend Java internship.',
        },
        {
          title: 'Support Staff - Warehouse & Customer Service',
          company: 'Seasonal',
          period: 'Before 2017',
          description:
            'Goods classification, document verification, e-commerce warehouse log reconciliation; technical support for mobile services via call center.',
        },
      ],
    },
    education: {
      sectionTitle: 'Education & Certifications',
      educationLabel: 'Education',
      certificationsLabel: 'Certifications',
      items: [
        {
          degree: 'Associate Degree - Information Systems',
          school: 'Posts and Telecommunications Institute of Technology (PTIT)',
          period: '2011 - 2014',
        },
        {
          degree: 'International Student - Japanese Language',
          school: 'JAM Japanese Language School, Niigata, Japan',
          period: '2015 - 2017',
        },
      ],
    },
    portfolio: {
      sectionTitle: 'Portfolio',
      subtitle: 'Featured projects in AI and system infrastructure',
      projects: [
        {
          title: 'Local AI Model Deployment (Ollama) on Docker',
          description:
            'Self-configured Docker and Ollama to run large language models (LLM) on a personal machine. Solved VRAM optimization to prevent out-of-memory errors when running models on a consumer GPU (RTX 3060).',
          tech: ['Docker', 'Ollama', 'AI Local'],
        },
        {
          title: 'Camera Storage & Monitoring via Synology NAS',
          description:
            'Configured a Synology NAS system, integrated and managed data streams from security cameras, set up access control and secure data storage.',
          tech: ['Synology NAS', 'Surveillance', 'Storage'],
        },
        {
          title: 'Home Lab Network Infrastructure Design & Optimization',
          description:
            'Self-designed and troubleshot home network infrastructure, including thermal management for overheating modem/router causing network congestion, and optimized throughput performance.',
          tech: ['Networking', 'Troubleshooting', 'Home Lab'],
        },
        {
          title: 'Database Management - Operations System',
          description:
            'Tool for managing and operating MySQL databases, optimizing queries and data backups.',
          tech: ['MySQL', 'Database', 'Backup'],
        },
      ],
    },

    contact: {
      sectionTitle: 'Contact',
      infoTitle: 'Contact Information',
      infoDesc: 'I am always open to listening and collaborating. Feel free to reach me through the following channels:',
      phone: 'Phone',
      address: 'Address',
      addressValue: 'Vinh Khang Street, Hanoi City',
      email: 'Email',
      formName: 'Full Name',
      formNamePlaceholder: 'John Doe',
      formSubject: 'Subject',
      formSubjectPlaceholder: 'Contact subject',
      formMessage: 'Message',
      formMessagePlaceholder: 'Your message...',
      formSubmit: 'Send Message',
      formSuccess: 'Thank you for reaching out! I will get back to you as soon as possible.',
    },
    footer: {
      contact: 'Contact',
      address: 'Address',
      addressLine1: 'Vinh Khang Street',
      addressLine2: 'Hanoi City, Vietnam',
      social: 'Social Media',
      github: 'GitHub',
      githubUrl: 'https://github.com/ducnb17',
      rights: '© 2025 Nguyễn Bá Đức. All rights reserved.',
    },
  },

  ja: {
    nav: {
      home: 'ホーム',
      about: '自己紹介',
      experience: '職歴',
      education: '学歴',
      portfolio: 'ポートフォリオ',
      blog: 'ブログ',
      lms: 'LMS',
      contact: 'お問い合わせ',
    },
    hero: {
      title: '情報システム技術者',
      description:
        'PTIT情報システム学科卒業。システム運用、ハード・ソフトウェアのトラブルシューティング、データベースに強い基盤を持つ。AIとサイバーセキュリティの専門知識をさらに深めることを目指している。',
      viewPortfolio: 'ポートフォリオを見る',
      contact: 'お問い合わせ',
      lmsCourses: 'LMSコース',
      github: 'GitHub',
      githubUrl: 'https://github.com/ducnb17',
    },
    about: {
      sectionTitle: '自己紹介',
      jobTitle: '情報システム技術者',
      description:
        'PTIT情報システム学科卒業。システム運用、ハード・ソフトウェアのトラブルシューティング、データベースに強い基盤を持つ。日本に2年間留学（JLPT N4取得）し、日本式の仕事スタイルを身につけた。AIとサイバーセキュリティの専門知識を深めることを目指している。',
      skills: 'スキル',
      languages: '言語',
      skillCategories: {
        os: 'オペレーティングシステム',
        database: 'データベース',
        programming: 'プログラミング',
        office: 'オフィスツール',
        security: 'サイバーセキュリティ',
      },
      langVi: '🇻🇳 ベトナム語（母国語）',
      langJa: '🇯🇵 日本語（日常会話 / JLPT N4）',
      langEn: '🇬🇧 英語（基本的なコミュニケーション）',
    },
    experience: {
      sectionTitle: '職歴',
      jobs: [
        {
          title: 'フリーランスITエンジニア',
          company: 'フリーランス',
          period: '2018年 - 現在',
          description:
            'OSのインストール・設定、ハードウェアの修理・アップグレード。AIモデル向け画像データの処理・分類・ラベリング（データラベリング）プロジェクトに参加。',
        },
        {
          title: 'IT研修生・インターン',
          company: 'FUNiX, BKACAD',
          period: '2017年 - 2019年',
          description:
            'FUNiXにてAutomotiveプログラミング（C++, UI）、BKACADにてJava Webを修了。Javaバックエンドの短期インターンシップ経験あり。',
        },
        {
          title: 'サポートスタッフ - 倉庫運営・カスタマーサービス',
          company: '季節雇用',
          period: '2017年以前',
          description:
            '商品の仕分け、書類確認、EC倉庫の入出庫ログ照合。コールセンターにてモバイルサービスの技術サポート業務。',
        },
      ],
    },
    education: {
      sectionTitle: '学歴・資格',
      educationLabel: '学歴',
      certificationsLabel: '資格',
      items: [
        {
          degree: '準学士 - 情報システム学科',
          school: '郵政通信工科大学（PTIT）',
          period: '2011年 - 2014年',
        },
        {
          degree: '留学生 - 日本語学科',
          school: 'JAM日本語学校、新潟、日本',
          period: '2015年 - 2017年',
        },
      ],
    },
    portfolio: {
      sectionTitle: 'ポートフォリオ',
      subtitle: 'AIおよびシステムインフラ分野の代表的なプロジェクト',
      projects: [
        {
          title: 'DockerでのローカルAIモデル（Ollama）デプロイ',
          description:
            'DockerとOllamaを自己設定し、個人のマシンで大規模言語モデル（LLM）を実行。一般向けGPU（RTX 3060）でのモデル実行時のVRAMオーバーフロー防止のための最適化を実施。',
          tech: ['Docker', 'Ollama', 'AI Local'],
        },
        {
          title: 'Synology NASによるカメラ録画・監視システム',
          description:
            'Synology NASシステムを構築し、防犯カメラからのデータストリームを統合・管理。アクセス権限の設定と安全なデータストレージを実現。',
          tech: ['Synology NAS', 'Surveillance', 'Storage'],
        },
        {
          title: 'ホームラボネットワークインフラの設計・最適化',
          description:
            '家庭用ネットワークインフラを自己設計・トラブルシューティング。モデム/ルーターの過熱による通信障害の冷却対策と、スループット性能の最適化を実施。',
          tech: ['Networking', 'Troubleshooting', 'Home Lab'],
        },
        {
          title: 'データベース管理 - 運用システム',
          description:
            'MySQLデータベースの管理・運用ツール。クエリの最適化とデータバックアップに対応。',
          tech: ['MySQL', 'Database', 'Backup'],
        },
      ],
    },

    contact: {
      sectionTitle: 'お問い合わせ',
      infoTitle: '連絡先情報',
      infoDesc: 'いつでもご連絡をお待ちしております。以下のチャンネルからお気軽にどうぞ：',
      phone: '電話番号',
      address: '住所',
      addressValue: 'ヴィンカン通り、ハノイ市',
      email: 'メール',
      formName: 'お名前',
      formNamePlaceholder: '山田 太郎',
      formSubject: '件名',
      formSubjectPlaceholder: 'お問い合わせの件名',
      formMessage: 'メッセージ',
      formMessagePlaceholder: 'メッセージをご入力ください...',
      formSubmit: '送信する',
      formSuccess: 'お問い合わせありがとうございます！できるだけ早くご返信いたします。',
    },
    footer: {
      contact: '連絡先',
      address: '住所',
      addressLine1: 'ヴィンカン通り',
      addressLine2: 'ハノイ市、ベトナム',
      social: 'ソーシャルメディア',
      github: 'GitHub',
      githubUrl: 'https://github.com/ducnb17',
      rights: '© 2025 Nguyễn Bá Đức. 全著作権所有。',
    },
  },
} as const;

export type TranslationKeys = typeof translations.vi;
