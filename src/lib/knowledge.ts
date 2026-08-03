import type { Locale } from '@/lib/i18n/translations';

export type KnowledgeCategory = 'ccna' | 'peh' | 'lpi' | 'ai-foundation';

type LocalizedText = Record<Locale, string>;

export interface KnowledgeArticle {
  slug: string;
  category: KnowledgeCategory;
  title: LocalizedText;
  summary: LocalizedText;
  readTime: number;
  sections: Array<{ heading: LocalizedText; paragraphs: LocalizedText[] }>;
}

export const categoryMeta: Record<KnowledgeCategory, { title: string; description: LocalizedText }> = {
  ccna: { title: 'CCNA', description: { vi: 'Nền tảng mạng, switching, routing và xử lý sự cố.', en: 'Networking, switching, routing, and troubleshooting fundamentals.', ja: 'ネットワーク、スイッチング、ルーティング、障害対応の基礎。' } },
  peh: { title: 'TCM Security – PEH', description: { vi: 'Tư duy và quy trình ethical hacking có trách nhiệm.', en: 'Responsible ethical-hacking mindset and workflow.', ja: '責任あるエシカルハッキングの考え方と手順。' } },
  lpi: { title: 'LPI 1 & 2', description: { vi: 'Quản trị Linux từ nền tảng đến vận hành dịch vụ.', en: 'Linux administration from fundamentals to service operations.', ja: 'Linuxの基礎からサービス運用まで。' } },
  'ai-foundation': { title: 'AI Foundation', description: { vi: 'Nền tảng AI, mô hình ngôn ngữ và cách ứng dụng an toàn.', en: 'AI foundations, language models, and safe application.', ja: 'AI基礎、言語モデル、安全な活用方法。' } },
};

const t = (vi: string, en: string, ja: string): LocalizedText => ({ vi, en, ja });
const section = (heading: LocalizedText, paragraphs: LocalizedText[]) => ({ heading, paragraphs });

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: 'osi-tcp-ip-tu-duy-phan-tang', category: 'ccna', readTime: 6,
    title: t('OSI và TCP/IP: tư duy phân tầng để xử lý sự cố', 'OSI and TCP/IP: layered troubleshooting', 'OSIとTCP/IP：階層で考える障害対応'),
    summary: t('Hiểu vai trò từng tầng và dùng mô hình phân tầng để khoanh vùng lỗi mạng nhanh hơn.', 'Understand each layer and isolate network faults faster.', '各層の役割を理解し、ネットワーク障害を素早く切り分けます。'),
    sections: [
      section(t('Vì sao cần phân tầng?', 'Why layers matter', 'なぜ階層化するのか'), [t('Mô hình OSI chia giao tiếp mạng thành bảy tầng; TCP/IP gom chúng thành bốn nhóm thực dụng. Mục tiêu không phải học thuộc tên tầng mà là biết dữ liệu được đóng gói, truyền và tháo gói ở đâu.', 'OSI separates networking into seven layers while TCP/IP groups them into four practical layers. The goal is not memorization, but knowing where data is encapsulated, transported, and decoded.', 'OSIは通信を7層に、TCP/IPは実用的な4層に整理します。重要なのは暗記ではなく、データがどこでカプセル化・転送・復号されるかを理解することです。')]),
      section(t('Khoanh vùng từ dưới lên', 'Troubleshoot bottom-up', '下位層から切り分ける'), [t('Bắt đầu bằng nguồn điện, cáp và trạng thái interface; tiếp theo kiểm tra VLAN/MAC, địa chỉ IP/gateway, rồi DNS và ứng dụng. Nếu ping IP được nhưng tên miền không được, vấn đề thường nằm ở DNS thay vì đường truyền.', 'Start with power, cabling, and interface state; then inspect VLAN/MAC, IP/gateway, DNS, and the application. If an IP responds but a hostname does not, investigate DNS before the link.', '電源、ケーブル、インターフェース状態から始め、VLAN/MAC、IP/ゲートウェイ、DNS、アプリの順に確認します。IPへ到達できて名前解決できない場合はDNSを疑います。')]),
      section(t('Checklist thực hành', 'Practical checklist', '実践チェックリスト'), [t('Ghi lại hiện tượng, phạm vi ảnh hưởng và thay đổi gần nhất. Dùng ipconfig/ip, ping, arp, traceroute và nslookup/dig theo thứ tự; sau mỗi bước phải có giả thuyết và kết luận, tránh chạy lệnh ngẫu nhiên.', 'Record the symptom, impact, and latest change. Use ipconfig/ip, ping, arp, traceroute, and nslookup/dig in sequence; every command should test a hypothesis.', '症状、影響範囲、直近の変更を記録し、ipconfig/ip、ping、arp、traceroute、nslookup/digを順に使います。各コマンドで仮説を検証します。')]),
    ],
  },
  {
    slug: 'subnetting-ipv4-thuc-hanh', category: 'ccna', readTime: 7,
    title: t('Subnetting IPv4: cách tính nhanh và áp dụng', 'IPv4 subnetting: fast calculation and use', 'IPv4サブネット：素早い計算と活用'),
    summary: t('Từ CIDR đến network, broadcast và dải host bằng một quy trình dễ kiểm tra.', 'A repeatable path from CIDR to network, broadcast, and host range.', 'CIDRからネットワーク、ブロードキャスト、ホスト範囲を求める手順。'),
    sections: [
      section(t('CIDR nói điều gì?', 'What CIDR means', 'CIDRの意味'), [t('/24 nghĩa là 24 bit dành cho network và 8 bit cho host. Số địa chỉ là 2 mũ số bit host; mạng IPv4 truyền thống trừ network và broadcast để ra số host sử dụng được.', '/24 reserves 24 bits for the network and 8 for hosts. The address count is two to the power of host bits; traditionally subtract network and broadcast for usable hosts.', '/24はネットワーク部24ビット、ホスト部8ビットです。アドレス数は2のホストビット数乗で、通常はネットワークとブロードキャストを除きます。')]),
      section(t('Tính theo block size', 'Use the block size', 'ブロックサイズで計算'), [t('Với /27, subnet mask cuối là 224 nên block size bằng 256 − 224 = 32. Các mạng bắt đầu tại 0, 32, 64…; địa chỉ ngay trước mạng kế tiếp là broadcast.', 'For /27, the final mask octet is 224, so the block size is 256 − 224 = 32. Networks start at 0, 32, 64… and the address before the next network is the broadcast.', '/27では最後のマスクが224なのでブロックサイズは32です。ネットワークは0、32、64…から始まり、次のネットワーク直前がブロードキャストです。')]),
      section(t('Thiết kế có dư địa', 'Plan for growth', '拡張余地を持つ'), [t('Không chỉ chọn subnet vừa đủ hôm nay. Hãy tính thêm thiết bị dự kiến, địa chỉ quản trị, gateway và tăng trưởng; ghi chép VLAN, CIDR và mục đích trong IPAM để tránh trùng địa chỉ.', 'Do not size only for today. Include future devices, management addresses, gateways, and growth; document VLAN, CIDR, and purpose in IPAM to prevent overlap.', '現在だけでなく将来の端末、管理用IP、ゲートウェイ、成長を考慮し、VLAN・CIDR・用途をIPAMへ記録します。')]),
    ],
  },
  {
    slug: 'vlan-trunk-inter-vlan', category: 'ccna', readTime: 7,
    title: t('VLAN, trunk và inter-VLAN routing', 'VLANs, trunks, and inter-VLAN routing', 'VLAN・トランク・VLAN間ルーティング'),
    summary: t('Tách broadcast domain đúng cách và kết nối các VLAN có kiểm soát.', 'Separate broadcast domains and connect VLANs deliberately.', 'ブロードキャストドメインを分離し、VLAN間を適切に接続します。'),
    sections: [
      section(t('Access và trunk', 'Access and trunk ports', 'アクセスポートとトランク'), [t('Access port mang lưu lượng của một VLAN tới thiết bị đầu cuối. Trunk dùng thẻ 802.1Q để mang nhiều VLAN giữa switch, router hoặc hypervisor.', 'An access port carries one VLAN to an endpoint. A trunk uses 802.1Q tags to carry multiple VLANs between switches, routers, or hypervisors.', 'アクセスポートは端末へ1つのVLANを提供し、トランクは802.1Qタグで複数VLANをスイッチやルーター間に運びます。')]),
      section(t('VLAN không tự nói chuyện', 'VLANs need routing', 'VLAN間にはルーティングが必要'), [t('Hai VLAN là hai mạng Layer 3 khác nhau. Muốn giao tiếp phải có router-on-a-stick hoặc switch Layer 3 với SVI; ACL có thể giới hạn luồng giữa các vùng người dùng, máy chủ và quản trị.', 'Two VLANs are separate Layer 3 networks. Communication requires router-on-a-stick or Layer 3 SVIs; ACLs can restrict flows among user, server, and management zones.', '異なるVLANは別のL3ネットワークです。通信にはルーターオンアスティックまたはL3スイッチのSVIが必要で、ACLで通信を制御できます。')]),
      section(t('Lỗi thường gặp', 'Common mistakes', 'よくあるミス'), [t('Kiểm tra VLAN có tồn tại, port access thuộc đúng VLAN, trunk cho phép VLAN đó và native VLAN nhất quán. Dùng show vlan brief, show interfaces trunk và kiểm tra STP trước khi nghi ngờ router.', 'Verify the VLAN exists, access membership is correct, the trunk allows it, and native VLANs match. Check show vlan brief, show interfaces trunk, and STP before blaming the router.', 'VLANの存在、アクセスポート所属、トランク許可、ネイティブVLAN一致を確認し、show vlan brief、show interfaces trunk、STPを調べます。')]),
    ],
  },
  {
    slug: 'ethical-hacking-co-pham-vi', category: 'peh', readTime: 6,
    title: t('Ethical hacking bắt đầu từ phạm vi và đạo đức', 'Ethical hacking starts with scope and ethics', 'エシカルハッキングは範囲と倫理から'),
    summary: t('Rules of engagement, ủy quyền và cách thực hành an toàn trong lab.', 'Authorization, rules of engagement, and safe lab practice.', '許可、実施規則、安全なラボ演習について。'),
    sections: [
      section(t('Không có ủy quyền thì không kiểm thử', 'No authorization, no test', '許可なしにテストしない'), [t('Chỉ kiểm thử hệ thống bạn sở hữu hoặc được cho phép bằng văn bản. Phạm vi phải nêu rõ IP/domain, thời gian, kỹ thuật bị cấm, dữ liệu nhạy cảm và đầu mối xử lý sự cố.', 'Test only systems you own or have written authorization to assess. Scope should define IPs/domains, timing, forbidden techniques, sensitive data, and incident contacts.', '所有または書面で許可されたシステムだけを対象にします。IP/ドメイン、時間、禁止手法、機密データ、緊急連絡先を明確にします。')]),
      section(t('Lab cô lập', 'Use an isolated lab', '隔離ラボを使う'), [t('Dùng máy ảo và mạng host-only cho Metasploitable, DVWA hoặc OWASP Juice Shop. Tạo snapshot trước bài thực hành và không bridge máy dễ tổn thương ra Internet.', 'Use virtual machines and host-only networking for Metasploitable, DVWA, or OWASP Juice Shop. Snapshot first and never bridge vulnerable targets to the public Internet.', 'Metasploitable、DVWA、OWASP Juice ShopはVMとhost-onlyネットワークで使い、事前にスナップショットを取り、インターネットへ公開しません。')]),
      section(t('Báo cáo để giảm rủi ro', 'Report to reduce risk', 'リスク低減のための報告'), [t('Một phát hiện tốt gồm bằng chứng tối thiểu, tác động, điều kiện khai thác, mức độ ưu tiên và cách khắc phục có thể kiểm chứng. Không lưu dữ liệu thật nhiều hơn mức cần thiết.', 'A useful finding includes minimal evidence, impact, exploit conditions, priority, and verifiable remediation. Retain no more real data than necessary.', '有用な報告には最小限の証拠、影響、悪用条件、優先度、検証可能な対策を含め、実データは必要以上に保存しません。')]),
    ],
  },
  {
    slug: 'reconnaissance-va-enumeration', category: 'peh', readTime: 7,
    title: t('Reconnaissance và enumeration có phương pháp', 'Methodical reconnaissance and enumeration', '体系的な偵察と列挙'),
    summary: t('Thu thập bề mặt tấn công trong phạm vi cho phép và biến dữ liệu thành giả thuyết.', 'Map an authorized attack surface and turn observations into hypotheses.', '許可された攻撃面を把握し、観察を仮説へ変えます。'),
    sections: [
      section(t('Thụ động trước, chủ động sau', 'Passive before active', '受動調査から能動調査へ'), [t('Bắt đầu với tài liệu, DNS công khai và tài sản đã được cung cấp; sau đó mới quét chủ động trong giới hạn tốc độ. Cách này giảm nhiễu và tránh tác động ngoài ý muốn.', 'Start with documentation, public DNS, and supplied assets; only then scan actively within rate limits. This reduces noise and unintended impact.', '文書、公開DNS、提供された資産から始め、その後レート制限内で能動スキャンを行い、不要な影響を減らします。')]),
      section(t('Dịch vụ quan trọng hơn cổng', 'Services matter more than ports', 'ポートよりサービスを理解する'), [t('Cổng mở chỉ là tín hiệu. Cần xác định dịch vụ, phiên bản với độ tin cậy phù hợp, cơ chế xác thực và quan hệ với tài sản khác; tránh kết luận lỗ hổng chỉ từ banner.', 'An open port is only a signal. Identify the service, confidence-rated version, authentication, and relationships; never declare a vulnerability from a banner alone.', '開放ポートは手掛かりに過ぎません。サービス、信頼度付きバージョン、認証、他資産との関係を確認し、バナーだけで脆弱性と断定しません。')]),
      section(t('Ghi chép tái lập được', 'Keep reproducible notes', '再現可能な記録'), [t('Lưu thời gian, nguồn, lệnh, phạm vi và kết quả đã rút gọn. Một bảng tài sản gồm hostname, IP, dịch vụ, owner và trạng thái kiểm chứng giúp tránh kiểm tra lặp hoặc bỏ sót.', 'Record time, source, command, scope, and reduced results. An asset table with hostname, IP, services, owner, and validation state prevents duplication and gaps.', '時刻、情報源、コマンド、範囲、要約結果を記録し、ホスト名・IP・サービス・所有者・確認状態の一覧で漏れを防ぎます。')]),
    ],
  },
  {
    slug: 'quan-ly-lo-hong-va-khac-phuc', category: 'peh', readTime: 7,
    title: t('Từ phát hiện lỗ hổng đến khắc phục', 'From finding to remediation', '脆弱性発見から修正まで'),
    summary: t('Xác minh, ưu tiên và retest để biến pentest thành cải thiện thực tế.', 'Validate, prioritize, and retest so assessment drives real improvement.', '検証・優先順位付け・再テストで実際の改善につなげます。'),
    sections: [
      section(t('Máy quét không phải kết luận', 'A scanner is not a verdict', 'スキャナ結果は結論ではない'), [t('Kết quả tự động có false positive và false negative. Xác minh bằng dấu hiệu an toàn, đối chiếu phiên bản/cấu hình và ghi rõ mức độ chắc chắn trước khi báo cáo.', 'Automated results contain false positives and negatives. Validate safely, compare versions and configuration, and state confidence before reporting.', '自動検出には誤検知・見逃しがあります。安全に検証し、バージョンと設定を照合し、確度を明記します。')]),
      section(t('Ưu tiên theo ngữ cảnh', 'Prioritize in context', '状況に応じた優先順位'), [t('CVSS chỉ là một đầu vào. Cần xét tài sản có Internet-facing không, dữ liệu gì, khả năng khai thác, kiểm soát bù trừ và tác động kinh doanh để quyết định SLA.', 'CVSS is one input. Consider Internet exposure, data, exploitability, compensating controls, and business impact when setting remediation SLAs.', 'CVSSだけでなく、外部公開、データ、悪用可能性、代替統制、事業影響を考慮して修正期限を決めます。')]),
      section(t('Đóng vòng bằng retest', 'Close the loop with retesting', '再テストで完了する'), [t('Sau khi sửa, chạy lại đúng bước tái hiện và kiểm tra regression liên quan. Ghi ngày, phiên bản, bằng chứng mới và trạng thái: fixed, mitigated, accepted hoặc còn mở.', 'After remediation, repeat the reproduction steps and related regression checks. Record date, version, new evidence, and status: fixed, mitigated, accepted, or open.', '修正後は再現手順と関連回帰テストを行い、日付、バージョン、新しい証拠、状態を記録します。')]),
    ],
  },
  {
    slug: 'linux-filesystem-permissions', category: 'lpi', readTime: 6,
    title: t('Filesystem và quyền truy cập Linux', 'Linux filesystems and permissions', 'Linuxファイルシステムと権限'),
    summary: t('Hiểu FHS, owner/group và chmod để quản trị an toàn.', 'Use FHS, ownership, and modes for safe administration.', 'FHS、所有者、モードを理解して安全に管理します。'),
    sections: [
      section(t('Biết dữ liệu nằm ở đâu', 'Know where data belongs', 'データの配置を理解する'), [t('/etc chứa cấu hình, /var chứa dữ liệu thay đổi như log, /home là dữ liệu người dùng, /run là trạng thái runtime và /usr chứa phần lớn chương trình. Hiểu FHS giúp backup và điều tra nhanh hơn.', '/etc holds configuration, /var changing data such as logs, /home user data, /run runtime state, and /usr most programs. FHS knowledge improves backup and diagnosis.', '/etcは設定、/varはログなどの可変データ、/homeはユーザーデータ、/runは実行時状態、/usrは主なプログラムを格納します。')]),
      section(t('Quyền tối thiểu', 'Least privilege', '最小権限'), [t('Mỗi file có owner, group và quyền read/write/execute. Dùng chmod dạng ký hiệu khi cần rõ ý định, chown/chgrp để đổi sở hữu; tránh chmod 777 vì che giấu sai thiết kế quyền.', 'Files have owner, group, and read/write/execute bits. Use symbolic chmod for clarity and chown/chgrp for ownership; avoid chmod 777 because it hides permission design errors.', '各ファイルには所有者、グループ、rwx権限があります。chmod、chown、chgrpを適切に使い、設計不備を隠す777は避けます。')]),
      section(t('setuid, setgid và sticky bit', 'Special permission bits', '特殊権限ビット'), [t('Các bit đặc biệt thay đổi cách thực thi hoặc xóa file. Chỉ dùng khi hiểu rõ nhu cầu; định kỳ tìm file setuid/setgid bất thường và kiểm tra thư mục ghi chung có sticky bit.', 'Special bits change execution or deletion behavior. Use them deliberately; audit unexpected setuid/setgid files and ensure shared writable directories use the sticky bit.', '特殊ビットは実行や削除動作を変えます。必要性を確認し、予期しないsetuid/setgidと共有書込ディレクトリのsticky bitを監査します。')]),
    ],
  },
  {
    slug: 'systemd-journalctl-van-hanh', category: 'lpi', readTime: 7,
    title: t('Vận hành dịch vụ với systemd và journalctl', 'Operating services with systemd and journalctl', 'systemdとjournalctlによるサービス運用'),
    summary: t('Quản lý vòng đời dịch vụ và đọc log theo dấu thời gian.', 'Manage service lifecycle and inspect time-bounded logs.', 'サービスのライフサイクル管理と時間範囲ログの確認。'),
    sections: [
      section(t('Unit và trạng thái', 'Units and state', 'ユニットと状態'), [t('systemctl status cho biết trạng thái, PID và log gần nhất; start/stop/restart tác động ngay, còn enable/disable quyết định khởi động cùng hệ thống. Hai nhóm lệnh này không thay thế nhau.', 'systemctl status shows state, PID, and recent logs; start/stop/restart act now, while enable/disable control boot behavior. They are distinct.', 'systemctl statusは状態、PID、直近ログを表示します。start/stop/restartは現在、enable/disableは起動時動作を制御します。')]),
      section(t('Đọc journal có mục tiêu', 'Query the journal precisely', '目的を持ってjournalを読む'), [t('Dùng journalctl -u service --since để giới hạn theo unit và thời gian; thêm -f khi theo dõi realtime. Luôn đối chiếu timestamp với lần deploy hoặc sự cố.', 'Use journalctl -u service --since to constrain unit and time; add -f for live follow. Correlate timestamps with deployments or incidents.', 'journalctl -uと--sinceで対象と時間を絞り、リアルタイムは-fを使います。デプロイや障害時刻と照合します。')]),
      section(t('Thay đổi unit an toàn', 'Change units safely', '安全なユニット変更'), [t('Ưu tiên systemctl edit để tạo override thay vì sửa unit của package. Sau thay đổi chạy daemon-reload, kiểm tra cấu hình, restart và xác minh cả trạng thái lẫn endpoint dịch vụ.', 'Prefer systemctl edit overrides over modifying vendor units. Then daemon-reload, validate, restart, and verify both service state and endpoint.', 'パッケージのunitを直接編集せずsystemctl editでoverrideし、daemon-reload、検証、再起動、エンドポイント確認を行います。')]),
    ],
  },
  {
    slug: 'linux-networking-troubleshooting', category: 'lpi', readTime: 7,
    title: t('Xử lý sự cố mạng trên Linux', 'Linux network troubleshooting', 'Linuxネットワーク障害対応'),
    summary: t('Kiểm tra interface, route, DNS, socket và firewall theo chuỗi logic.', 'Inspect interfaces, routes, DNS, sockets, and firewall in order.', 'インターフェース、経路、DNS、ソケット、FWを順に確認します。'),
    sections: [
      section(t('Từ interface đến route', 'Interface to route', 'インターフェースから経路へ'), [t('ip link và ip address xác nhận interface/up và địa chỉ; ip route cho biết default gateway và đường đi. Ping gateway trước khi kiểm tra Internet để tách lỗi LAN khỏi upstream.', 'ip link and ip address confirm interface state and addressing; ip route reveals gateway and paths. Ping the gateway before the Internet to separate LAN from upstream faults.', 'ip linkとip addressで状態とIPを確認し、ip routeでゲートウェイと経路を確認します。まずゲートウェイへpingします。')]),
      section(t('DNS và ứng dụng', 'DNS and applications', 'DNSとアプリケーション'), [t('Dùng resolvectl hoặc dig để kiểm tra resolver. curl -v cho thấy DNS, TCP, TLS và HTTP; ss -lntp xác nhận ứng dụng có listen đúng IP/port hay chỉ ở loopback.', 'Use resolvectl or dig for resolver checks. curl -v exposes DNS, TCP, TLS, and HTTP; ss -lntp confirms whether an app listens on the intended address or loopback only.', 'resolvectlやdigでDNSを確認し、curl -vでDNS/TCP/TLS/HTTP、ss -lntpで待受アドレスを確認します。')]),
      section(t('Firewall có bằng chứng', 'Evidence-based firewall checks', '証拠に基づくFW確認'), [t('Kiểm tra nftables/iptables và firewall cloud, nhưng không tắt toàn bộ firewall để thử. Dùng rule tạm có phạm vi hẹp, ghi nhận counter và hoàn tác sau kiểm tra.', 'Inspect nftables/iptables and cloud firewalls, but do not disable everything as a test. Use narrow temporary rules, observe counters, and remove them afterward.', 'nftables/iptablesとクラウドFWを確認し、全停止は避けます。限定的な一時ルールとカウンタで検証し、後で削除します。')]),
    ],
  },
  {
    slug: 'ai-ml-deep-learning-la-gi', category: 'ai-foundation', readTime: 6,
    title: t('AI, Machine Learning và Deep Learning khác nhau thế nào?', 'AI, machine learning, and deep learning', 'AI・機械学習・深層学習の違い'),
    summary: t('Bản đồ khái niệm cơ bản để chọn đúng công nghệ cho bài toán.', 'A basic map for choosing the right technology.', '課題に合う技術を選ぶための基本概念。'),
    sections: [
      section(t('Quan hệ bao-hàm', 'The hierarchy', '包含関係'), [t('AI là mục tiêu xây hệ thống thực hiện nhiệm vụ cần trí tuệ; Machine Learning là cách học mẫu từ dữ liệu; Deep Learning là nhánh ML dùng mạng nơ-ron nhiều tầng. Không phải bài toán AI nào cũng cần deep learning.', 'AI is the goal of systems performing intelligent tasks; machine learning learns patterns from data; deep learning is ML using multi-layer neural networks. Not every AI problem needs deep learning.', 'AIは知的タスクを行うシステム全般、機械学習はデータからパターンを学ぶ手法、深層学習は多層ニューラルネットを使う機械学習です。')]),
      section(t('Bắt đầu từ bài toán', 'Start with the problem', '問題から始める'), [t('Xác định đầu vào, đầu ra, tiêu chí thành công, chi phí sai và dữ liệu sẵn có. Một rule engine đơn giản có thể tốt hơn mô hình phức tạp nếu yêu cầu ổn định và cần giải thích rõ.', 'Define inputs, outputs, success metrics, error cost, and available data. A rule engine may beat a complex model when requirements are stable and explainability matters.', '入力、出力、成功指標、誤りコスト、データを定義します。要件が安定し説明性が重要ならルールベースが適切な場合もあります。')]),
      section(t('Đánh giá ngoài độ chính xác', 'Beyond accuracy', '精度以外の評価'), [t('Cần xem precision/recall, latency, chi phí, độ ổn định theo nhóm dữ liệu và khả năng giám sát. Mô hình tốt trong notebook chưa chắc phù hợp production.', 'Consider precision/recall, latency, cost, performance across data groups, and observability. A notebook winner may not fit production.', 'precision/recall、遅延、コスト、データ群ごとの安定性、監視性を考慮します。Notebookで良くても本番向きとは限りません。')]),
    ],
  },
  {
    slug: 'llm-token-context-prompt', category: 'ai-foundation', readTime: 7,
    title: t('LLM: token, context và prompt hoạt động ra sao', 'LLMs: tokens, context, and prompts', 'LLM：トークン・コンテキスト・プロンプト'),
    summary: t('Hiểu giới hạn mô hình ngôn ngữ để sử dụng hiệu quả và kiểm chứng được.', 'Understand language-model limits for effective, verifiable use.', '言語モデルの限界を理解し、効果的かつ検証可能に使います。'),
    sections: [
      section(t('Dự đoán token tiếp theo', 'Next-token prediction', '次トークン予測'), [t('LLM nhận chuỗi token và dự đoán token tiếp theo dựa trên mẫu đã học. Câu trả lời trôi chảy không đồng nghĩa với sự thật; mô hình có thể tạo chi tiết hợp lý nhưng sai.', 'An LLM receives tokens and predicts the next token from learned patterns. Fluency is not truth; plausible details can still be wrong.', 'LLMはトークン列から次のトークンを予測します。流暢さは正しさを保証せず、もっともらしい誤情報を生成することがあります。')]),
      section(t('Context là bộ nhớ làm việc', 'Context is working memory', 'コンテキストは作業記憶'), [t('System prompt, lịch sử, tài liệu và câu hỏi cùng chiếm context window. Nội dung quá dài có thể bị bỏ hoặc làm loãng tín hiệu; nên đưa dữ liệu liên quan, có cấu trúc và nguồn rõ.', 'System instructions, history, documents, and questions share the context window. Excess content can be omitted or dilute signal; provide relevant, structured, sourced material.', 'システム指示、履歴、文書、質問がコンテキストを共有します。長すぎる情報は信号を薄めるため、関連情報を構造化して与えます。')]),
      section(t('Prompt tốt tạo đầu ra kiểm tra được', 'Prompts should enable verification', '検証可能なプロンプト'), [t('Nêu mục tiêu, bối cảnh, ràng buộc, định dạng và tiêu chí hoàn thành. Với tác vụ quan trọng, yêu cầu trích nguồn, chạy test hoặc đối chiếu dữ liệu thay vì tin vào lời khẳng định.', 'Specify goal, context, constraints, output format, and completion criteria. For important tasks, require sources, tests, or data checks rather than trusting assertions.', '目標、背景、制約、形式、完了条件を明示し、重要な作業では出典、テスト、データ照合を求めます。')]),
    ],
  },
  {
    slug: 'rag-va-ai-an-toan', category: 'ai-foundation', readTime: 7,
    title: t('RAG và nguyên tắc xây ứng dụng AI an toàn', 'RAG and safe AI application design', 'RAGと安全なAIアプリ設計'),
    summary: t('Kết nối LLM với tri thức riêng, kiểm soát nguồn và bảo vệ dữ liệu.', 'Ground LLMs in private knowledge while controlling sources and data.', '独自知識でLLMを根拠付け、情報源とデータを管理します。'),
    sections: [
      section(t('RAG giải quyết điều gì?', 'What RAG solves', 'RAGが解決すること'), [t('Retrieval-Augmented Generation tìm các đoạn tài liệu liên quan rồi đưa vào prompt để mô hình trả lời dựa trên nguồn cập nhật. Nó không tự bảo đảm đúng; chất lượng phụ thuộc dữ liệu, chunking, retrieval và cách yêu cầu trích dẫn.', 'RAG retrieves relevant passages and supplies them to the prompt so answers use current sources. It is not automatically correct; quality depends on data, chunking, retrieval, and citation design.', 'RAGは関連文書を検索してプロンプトへ渡し、最新情報に基づく回答を支援します。正確性はデータ、分割、検索、引用設計に依存します。')]),
      section(t('Phòng chống prompt injection', 'Defend against prompt injection', 'プロンプトインジェクション対策'), [t('Tài liệu truy xuất là dữ liệu không đáng tin, không phải chỉ dẫn hệ thống. Tách quyền công cụ, allowlist hành động, xác nhận thao tác nhạy cảm và không để văn bản bên ngoài tự quyết định truy cập bí mật.', 'Retrieved content is untrusted data, not system instruction. Separate tool permissions, allowlist actions, confirm sensitive operations, and never let external text authorize secret access.', '取得文書は信頼できないデータでありシステム指示ではありません。ツール権限を分離し、許可リストと重要操作の確認を行います。')]),
      section(t('Quan sát và đánh giá liên tục', 'Observe and evaluate continuously', '継続的な監視と評価'), [t('Lưu metric về chất lượng retrieval, tỷ lệ từ chối, latency và chi phí nhưng loại bỏ dữ liệu nhạy cảm. Dùng bộ câu hỏi chuẩn, kiểm thử regression và human review cho quyết định có tác động lớn.', 'Track retrieval quality, refusal rate, latency, and cost while removing sensitive data. Use evaluation sets, regression tests, and human review for high-impact decisions.', '検索品質、拒否率、遅延、コストを機密情報なしで計測し、評価セット、回帰テスト、高影響判断の人手確認を行います。')]),
    ],
  },
];

export const getKnowledgeArticle = (slug: string) => knowledgeArticles.find((article) => article.slug === slug);
export const getLocalized = (value: LocalizedText, locale: Locale) => value[locale];
