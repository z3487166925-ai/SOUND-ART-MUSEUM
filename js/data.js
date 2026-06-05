/** 声音艺术馆 — 站点数据 */
const SITE_DATA = {
  museum: {
    nameZh: "声音艺术馆",
    nameEn: "SOUND ART MUSEUM",
    tagline: "听见声音，也看见声音",
    about:
      "声音艺术馆参照 UCCA、泰特现代、MoMA 等当代美术馆的策展理念，以「听见艺术」为核心，构建人声、自然、动物与无声四大主题声景空间。馆内设常设展、特展与声音档案库，面向公众、研究者与创作者开放。",
    stats: [
      { value: "12,000+", label: "馆藏声音条目" },
      { value: "48", label: "合作艺术家" },
      { value: "4", label: "主题展馆" },
      { value: "2019", label: "开馆年份" },
    ],
  },

  visit: [
    { title: "开放时间", items: ["周二至周日 10:00–18:00", "周四延长至 20:00", "周一闭馆（法定节假日除外）"] },
    { title: "门票", items: ["常设展 免费", "特展 ￥80 / ￥50（学生）", "声音档案库 含在通票内"] },
    { title: "交通", items: ["地铁 2 号线 艺术大道站 B 口", "公交 18 / 63 / 901 路", "馆内地下停车场"] },
    { title: "咨询", items: ["visitor@soundartmuseum.cn", "+86 10 8888 6600", "北京市朝阳区声景大道 1 号"] },
  ],

  exhibitions: [
    {
      id: "echo-silence",
      titleZh: "沉默的回声",
      titleEn: "The Echo of Silence",
      status: "正在展出",
      dates: "2026.03.15 — 2026.08.30",
      venue: "1 号展厅 · 特展",
      artist: "珍妮特·卡牌夫、克里斯·沃森",
      medium: "沉浸式声音装置",
      desc: "在近乎无声的场域中，聆听呼吸、建筑与记忆的微响。参照 Tate Modern「Soundscapes」展陈逻辑，强调观者的身体在场。",
      image: "assets/images/exhibitions/echo-silence.jpg",
      imageFallback: "linear-gradient(135deg,#1a0a12,#9d4dff44)",
      article: {
        lead: "当环境声被压低到几乎不可闻，呼吸、织物摩擦与建筑结构的微振反而成为主角。本展以双耳录音与定向扬声器阵列，邀请观者在「近乎零分贝」的展厅里重新校准听觉。",
        sections: [
          {
            heading: "展览概念",
            body: "「沉默的回声」并非追求绝对无声，而是将日常被掩蔽的微弱声层从背景中剥离出来。策展团队参照 Tate Modern「Soundscapes」的展陈逻辑，以暗房、吸音材料与低照度照明构建一个让身体先于语言做出反应的空间。观者进入展厅后，会经历约九十秒的「听觉适应」引导，随后步入由四十组点声源构成的环形声场。",
          },
          {
            heading: "作品与艺术家",
            body: "珍妮特·卡牌夫带来改编自《The Forty Part Motet》的室内版双耳漫游，声源在观者头顶缓慢位移；克里斯·沃森则提供冰岛冰川裂缝与雨林晨雾的未压缩田野录音，强调「寂静中的生物声学」。两件作品在展厅两端对话，中间区域留给馆方委约的《呼吸档案》——收录三十位观者在静默中的呼吸节奏，经算法转化为可视光脉。",
          },
          {
            heading: "参观提示",
            body: "建议预留 45–60 分钟，佩戴馆方提供的无线耳机以获得完整双耳效果。展厅内禁止拍照与大声交谈；儿童需在成人陪同下参观。特展通票含常设区，可于出口处领取纸质听展手册（中/英）。",
          },
        ],
        curator: "策展人：林声远 · 声音艺术馆特展部",
      },
    },
    {
      id: "urban-rhythm",
      titleZh: "城市节律",
      titleEn: "Urban Rhythms",
      status: "即将开幕",
      dates: "2026.09.12 — 2027.01.05",
      venue: "2 号展厅",
      artist: "比尔·丰塔纳、李向群",
      medium: "城市声景采集与实时混音",
      desc: "以上海、东京、柏林三地交通枢纽为样本，呈现 24 小时循环的城市声纹。",
      image: "assets/images/exhibitions/urban-rhythm.jpg",
      imageFallback: "linear-gradient(135deg,#001a22,#00d9ff33)",
      article: {
        lead: "地铁报站、信号灯切换、人群脚步与远处施工声——城市从不真正入睡。本展以三地交通枢纽的连续田野录音为素材，在展厅内重建一座可聆听的「24 小时声纹城市」。",
        sections: [
          {
            heading: "三地声纹样本",
            body: "比尔·丰塔纳团队于 2025 年秋在上海虹桥枢纽、东京新宿站与柏林 Hauptbahnhof 同步部署八通道固定录音点，连续采集 72 小时环境声。李向群负责将素材按「高峰—平峰—深夜」切片，并标注各语言报站、闸机与广播系统的频谱特征。展厅中央的大型环形屏显示实时声谱，地面低音炮在「高峰段」传递轨道振动。",
          },
          {
            heading: "互动听音台",
            body: "观众可在六组听音台前选择「清晨 / 午后 / 午夜」与「雨夜 / 晴日」组合，耳机内将混音出对应的城市片段。每套组合约 8 分钟，附带中英字幕说明关键声事件。馆方计划展期结束后开放部分素材的非商业研究下载（需预约）。",
          },
          {
            heading: "开幕与票务",
            body: "展览将于 2026 年 9 月 12 日开幕，开幕周设有艺术家导览（需提前预约）。标准票 ￥80，学生票 ￥50；声音艺术馆会员可优先入场。展厅位于 2 号展厅，与「沉默的回声」特展步行约 3 分钟。",
          },
        ],
        curator: "策展人：陈轨 · 城市声景实验室合作",
      },
    },
    {
      id: "soundscape-arch",
      titleZh: "声景考古",
      titleEn: "Soundscape Archaeology",
      status: "常设",
      dates: "长期",
      venue: "地下一层",
      artist: "馆际联合策展",
      medium: "档案与互动听音台",
      desc: "整理工业遗产、方言与濒危生物声学档案，致敬 Bernie Krause 的生物声学田野传统。",
      image: "assets/images/exhibitions/soundscape-arch.jpg",
      imageFallback: "linear-gradient(135deg,#111,#333)",
      article: {
        lead: "从蒸汽机车汽笛到濒危方言的最后一个发音者，声音档案馆保存着即将消失的时间层。常设展「声景考古」以听音台、档案柜与耳机墙三种形态，呈现馆藏 12,000+ 条声音条目中的精选篇章。",
        sections: [
          {
            heading: "档案结构",
            body: "地下一层展厅分为「工业遗产」「方言田野」「生物声学」三条动线。工业区展示华北铁路声纹、港口吊机与纺织车间录音；方言区收录闽南、藏语、吴语等十二种方言的朗读与日常交谈；生物声学区致敬 Bernie Krause 传统，陈列亚马逊、刚果盆地与北极苔原的濒危物种声学标本。每条档案均附采集年份、坐标与伦理说明。",
          },
          {
            heading: "互动听音台",
            body: "十二组听音台支持关键词检索：输入「雨」「码头」「鸟鸣」等词，系统将推荐 3–5 条相关馆藏。耳机为馆方定制开放式型号，可同时听到环境导览与档案内容。研究者可凭有效证件申请档案室深度查阅（每周二、四下午）。",
          },
          {
            heading: "教育与合作",
            body: "馆校合作课程「田野录音入门」每月开设一期，学员作品经审核后可进入「青年声景」子库。本展免费对公众开放，建议参观时长 60–90 分钟。地下一层设有无障碍通道与休息区。",
          },
        ],
        curator: "馆际联合策展组 · 典藏与研究部",
      },
    },
  ],

  artists: [
    { name: "池田亮司", nameEn: "Ryoji Ikeda", country: "日本", focus: "数据声画、极简电子", work: "《test pattern [声场版]》", year: "2024" },
    { name: "珍妮特·卡牌夫", nameEn: "Janet Cardiff", country: "加拿大", focus: "双耳录音、叙事漫步", work: "《The Forty Part Motet》", year: "2023" },
    { name: "比尔·丰塔纳", nameEn: "Bill Fontana", country: "美国", focus: "建筑声学雕塑", work: "《谐波桥》", year: "2025" },
    { name: "克里斯·沃森", nameEn: "Chris Watson", country: "英国", focus: "自然声景田野", work: "《亚马逊黎明》", year: "2022" },
    { name: "李向群", nameEn: "Li Xiangqun", country: "中国", focus: "城市声音装置", work: "《胡同频率》", year: "2025" },
    { name: "王志刚", nameEn: "Wang Zhigang", country: "中国", focus: "方言声学档案", work: "《南音志》", year: "2026" },
  ],

  events: [
    { date: "06.15", title: "策展人导览 · 沉默的回声", type: "导览", hall: "1 号展厅" },
    { date: "06.22", title: "声音工作坊：田野录音入门", type: "工作坊", hall: "教育中心" },
    { date: "07.06", title: "艺术家对谈：李向群 × 比尔·丰塔纳", type: "讲座", hall: "报告厅" },
    { date: "07.20", title: "夜间专场：无声馆冥想听音", type: "特场", hall: "无声馆" },
  ],

  news: [
    { date: "2026.05.28", title: "声音艺术馆入选 ICCA 亚太声音艺术机构网络", tag: "公告" },
    { date: "2026.05.10", title: "《城市节律》特展公布参展艺术家名单", tag: "展览" },
    { date: "2026.04.18", title: "馆际合作：与大英图书馆声音档案共享 200 小时素材", tag: "合作" },
    { date: "2026.03.15", title: "《沉默的回声》开幕，免费公众导览每周六 14:00", tag: "开幕" },
  ],

  halls: {
    human: {
      id: "human",
      num: "01",
      hallLabel: "EXHIBITION HALL 01",
      titleZh: "人声馆",
      titleEn: "Human Voice",
      heroTitleEn: "HUMAN VOICE",
      tag: "Vocal Resonance",
      accent: "#ff4d6d",
      poster: "assets/images/posters/human.svg",
      intro: "人声是历史最古老、最亲密的声音媒介，承载着情感、记忆与文化的多层纹理。本馆收录全球方言、吟诵与日常交谈，构建可聆听的口述档案。",
      previewSound: "assets/sounds/human.mp3",
      tracks: [
        { id: "h01", num: "01", titleZh: "闽南语童谣", titleEn: "Minnan Lullaby", desc: "来自福建漳州的民间摇篮曲采集", duration: "3:47", file: "assets/sounds/tracks/human-01.mp3" },
        { id: "h02", num: "02", titleZh: "藏语诵经片段", titleEn: "Tibetan Chant", desc: "拉萨寺院晨课录音，立体声双耳制式", duration: "5:12", file: "assets/sounds/tracks/human-02.mp3" },
        { id: "h03", num: "03", titleZh: "纽约地铁报站", titleEn: "NYC Subway", desc: "多语种报站与车厢交谈声层", duration: "2:58", file: "assets/sounds/tracks/human-03.mp3" },
        { id: "h04", num: "04", titleZh: "京剧念白", titleEn: "Peking Opera", desc: "《贵妃醉酒》选段，传统念白与锣鼓", duration: "6:03", file: "assets/sounds/tracks/human-04.mp3" },
        { id: "h05", num: "05", titleZh: "朋友闲谈", titleEn: "Friends Chatting", desc: "日常友人闲谈与笑声的亲密声层", duration: "4:05", file: "assets/sounds/tracks/human-05.mp3" },
      ],
    },
    nature: {
      id: "nature",
      num: "02",
      hallLabel: "EXHIBITION HALL 02",
      titleZh: "自然声音馆",
      titleEn: "Natural Sounds",
      heroTitleEn: "NATURAL SOUNDS",
      tag: "Earth Frequencies",
      accent: "#00d9ff",
      poster: "assets/images/posters/nature.svg",
      intro: "雨林、海洋、风与雷构成地球的声纹底噪。本馆以 Chris Watson 式田野美学呈现未压缩的自然声景，聆听星球自身的呼吸。",
      previewSound: "assets/sounds/nature.mp3",
      tracks: [
        { id: "n01", num: "01", titleZh: "亚马逊黎明", titleEn: "Amazon Dawn", desc: "鸟类苏醒的层次化鸣叫", duration: "7:22", file: "assets/sounds/tracks/nature-01.mp3" },
        { id: "n02", num: "02", titleZh: "冰岛瀑布", titleEn: "Iceland Falls", desc: "塞里雅兰瀑布近距离水声频谱", duration: "4:44", file: "assets/sounds/tracks/nature-02.mp3" },
        { id: "n03", num: "03", titleZh: "珊瑚礁水下", titleEn: "Coral Reef", desc: "水下接触式麦克风录制", duration: "5:55", file: "assets/sounds/tracks/nature-03.mp3" },
        { id: "n04", num: "04", titleZh: "撒哈拉风", titleEn: "Sahara Wind", desc: "沙丘风纹与远处驼铃", duration: "4:09", file: "assets/sounds/tracks/nature-04.mp3" },
      ],
    },
    animal: {
      id: "animal",
      num: "03",
      hallLabel: "EXHIBITION HALL 03",
      titleZh: "动物声音馆",
      titleEn: "Animal Sounds",
      heroTitleEn: "ANIMAL SOUNDS",
      tag: "Wild Echoes",
      accent: "#7bff00",
      poster: "assets/images/posters/animal.svg",
      intro: "鸟鸣、鲸歌与昆虫振翅构成野性的声学生态。本馆合作国际生物声学网络，保存濒危物种的声学标本与田野记录。",
      previewSound: "assets/sounds/animal.mp3",
      tracks: [
        { id: "a01", num: "01", titleZh: "座头鲸之歌", titleEn: "Humpback Whale", desc: "夏威夷海域繁殖季录音", duration: "9:12", file: "assets/sounds/tracks/animal-01.mp3" },
        { id: "a02", num: "02", titleZh: "热带雨林蛙鸣", titleEn: "Rainforest Frogs", desc: "哥斯达黎加夜间合唱", duration: "4:36", file: "assets/sounds/tracks/animal-02.mp3" },
        { id: "a03", num: "03", titleZh: "东北虎啸", titleEn: "Siberian Tiger", desc: "野生动物保护区监测录音", duration: "1:48", file: "assets/sounds/tracks/animal-03.mp3" },
        { id: "a04", num: "04", titleZh: "蜜蜂蜂巢", titleEn: "Bee Hive", desc: "接触式麦克风蜂巢内部振动", duration: "5:40", file: "assets/sounds/tracks/animal-04.mp3" },
      ],
    },
    silent: {
      id: "silent",
      num: "04",
      hallLabel: "EXHIBITION HALL 04",
      titleZh: "无声馆",
      titleEn: "Silence / Beyond Sound",
      heroTitleEn: "SILENCE",
      tag: "Beyond Sound",
      accent: "#9d4dff",
      poster: "assets/images/posters/silent.svg",
      intro: "无声是一种可被阅读的语言。手语、盲文与留白共同构成声音的缺席与另一种表达。",
      previewSound: null,
      tracks: [],
      silentExhibit: {
        introTitle: "无声是一种视觉语言",
        introBody: "当听觉退场，视觉与触觉成为信息的载体。本展厅以手语与盲文为媒介，邀请你在寂静中阅读声音的缺席与在场。",
        signLanguage: [
          {
            word: "你好",
            en: "Hello",
            image: "assets/images/silent/sign-hello-particle.png",
            hint: "① 指向对方 · ② 竖起拇指",
          },
          {
            word: "谢谢",
            en: "Thank You",
            image: "assets/images/silent/sign-thanks-particle.png",
            hint: "竖起拇指，朝向对方",
          },
          {
            word: "再见",
            en: "Goodbye",
            image: "assets/images/silent/sign-goodbye-particle.png",
            hint: "手掌张开，向前挥动",
          },
        ],
        braille: [
          { word: "你好", zh: "你好", rows: [["⠝", "⠊"], ["⠓", "⠁", "⠕"]] },
          { word: "谢谢", unicode: "⠭⠊⠑⠀⠭⠊⠑", zh: "谢谢" },
          { word: "再见", unicode: "⠵⠁⠊⠀⠚⠊⠁⠝", zh: "再见" },
        ],
        cardBraille: "⠍⠽⠀⠙⠑⠀⠎⠓⠑⠝⠛⠀⠽⠔",
      },
    },
  },
};

if (typeof module !== "undefined") module.exports = SITE_DATA;
