export type PlaceDetail = {
  tagline: string;
  overview: string;
  image?: {
    src: string;
    alt: string;
    credit: string;
    license: string;
    sourceUrl: string;
  };
  facts: { label: string; value: string }[];
  budget: string;
  foods: { name: string; description: string; budget: string }[];
  tips: string[];
  links: { label: string; url: string }[];
};

const maps = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const placeDetails: Record<string, PlaceDetail> = {
  tokyo: {
    tagline: "夜间出发前，把补给与车辆状态一次确认完",
    overview: "东京是本次七日环线的起终点。建议晚高峰结束后再上东北道，出发前完成加油、胎压、雨刷液和饮用水补给，把第一晚的目标设为安全抵达福岛方向的 SA / PA，而不是追求里程。",
    facts: [
      { label: "建议停留", value: "出发准备 30–45 分钟" },
      { label: "费用", value: "加油、高速费与餐食按实际" },
      { label: "重点", value: "当晚不再安排洗澡" },
    ],
    budget: "首晚建议预留 ¥2,000–4,000 用于高速餐食、饮料和临时补给；高速费与燃油另计。",
    foods: [
      { name: "SA / PA 夜宵", description: "比市区绕行更省时间，优先热汤面、定食等不易犯困的选择。", budget: "约 ¥800–1,500" },
      { name: "便利店车中早餐", description: "提前买水、咖啡、饭团和次日早餐，减少清晨找店。", budget: "约 ¥700–1,200" },
    ],
    tips: ["避开周日晚间事故与施工拥堵，导航同时打开实时路况。", "每 2 小时至少休息一次；感到困倦时立刻进入最近的 SA / PA。"],
    links: [
      { label: "东京官方旅游信息", url: "https://www.gotokyo.org/en/" },
      { label: "东京站地图", url: maps("東京駅") },
    ],
  },
  goshikinuma: {
    tagline: "火山矿物调出的蓝、绿与赤色湖沼群",
    overview: "五色沼不是单一湖泊，而是磐梯山喷发后形成的一串湖沼。经典自然探胜路单程约 4 公里，沿途经过毘沙门沼、赤沼、弁天沼、青沼与柳沼；水色会随矿物、光线和季节变化。自驾最实用的走法是两端停车、单程徒步后乘巴士回到起点。",
    image: { src: "/places/goshikinuma.jpg", alt: "福岛里磐梯五色沼的蓝绿色湖面", credit: "Jordy Meow", license: "CC BY 3.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Goshikinuma.jpg" },
    facts: [
      { label: "建议停留", value: "2–3 小时" },
      { label: "门票", value: "自然步道免费" },
      { label: "步行", value: "单程约 4 km，约 90 分钟" },
    ],
    budget: "景点本身免费；为接驳巴士、饮料和午餐预留 ¥1,500–2,500 / 人。",
    foods: [
      { name: "会津山盐拉面", description: "使用温泉盐或山盐调味，汤头清爽，适合徒步后补充盐分。", budget: "约 ¥900–1,300" },
      { name: "里磐梯高原冰淇淋", description: "物产馆与湖区餐饮常见，适合作为短暂停留甜点。", budget: "约 ¥400–600" },
    ],
    tips: ["东、西两端停车场均可利用；不要原路折返浪费体力。", "8 月林内也可能湿滑并有熊出没，穿防滑鞋并留意游客中心公告。"],
    links: [
      { label: "游客中心步道指南", url: "https://urabandai-vc.jp/trekking/1goshiki/" },
      { label: "福岛县景点介绍", url: "https://www.pref.fukushima.lg.jp/w4/fgr/perfectview/p01/" },
      { label: "地图与停车入口", url: maps("五色沼自然探勝路") },
    ],
  },
  naruko: {
    tagline: "跨过大深泽桥，看峡谷与铁路切入山林",
    overview: "鸣子峡由大谷川切割形成，深约百米。秋季最有名，但夏季的浓绿也很适合短停。主视角在鸣子峡休息站一带，可从观景台看大深泽桥；若时间允许，再走开放中的步道区段。",
    image: { src: "/places/naruko.jpg", alt: "秋季红叶覆盖的鸣子峡与大深泽桥", credit: "T-KIMURA", license: "CC BY 4.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Miyagi_Naruko-kyo_in_autumn_xl.jpg" },
    facts: [
      { label: "建议停留", value: "45–90 分钟" },
      { label: "门票", value: "观景与步道免费" },
      { label: "停车", value: "红叶旺季可能收费" },
    ],
    budget: "普通季节 ¥0–1,000；若在温泉街吃点心或泡日归温泉，建议预留 ¥1,500–3,000。",
    foods: [
      { name: "栗团子", description: "鸣子温泉代表甜点，栗子包入软糯年糕并淋酱油葛汁。", budget: "约 ¥500–900" },
      { name: "紫苏卷", description: "味噌与坚果卷入紫苏叶油炸，适合作为车上小食或伴手礼。", budget: "约 ¥500–1,000" },
    ],
    tips: ["步道可能因落石或维护临时封闭，以大崎市当天公告为准。", "若只停 45 分钟，优先观景台，不要硬塞完整步道。"],
    links: [
      { label: "大崎市鸣子峡官方信息", url: "https://www.city.osaki.miyagi.jp/kanko/sizen/4/6032.html" },
      { label: "鸣子温泉乡观光协会", url: "https://www.naruko.gr.jp/" },
      { label: "地图与停车场", url: maps("鳴子峡 レストハウス") },
    ],
  },
  kaikatsu: {
    tagline: "青森屋入住前的固定淋浴与休整站",
    overview: "盛冈上堂店提供免费停车、免费淋浴、饮料吧和软冰淇淋。它不是景点，但对连续车中过夜的行程很关键：在这里完成淋浴、充电和短休，再继续向八幡平移动。",
    facts: [
      { label: "建议停留", value: "45–90 分钟" },
      { label: "平日基本", value: "饮放区 ¥230 / 30 分钟起" },
      { label: "淋浴", value: "包含在店内使用费中" },
    ],
    budget: "平日饮放区约 ¥230 / 30 分钟起，3 小时包约 ¥650；周末和节假日包时段加价 ¥220，最终以门店价目为准。",
    foods: [
      { name: "盛冈冷面", description: "若时间允许，可在盛冈市区先吃冷面，再到快活淋浴。", budget: "约 ¥1,000–1,600" },
      { name: "店内轻食", description: "赶时间时可直接使用店内餐单和饮料吧。", budget: "约 ¥500–1,000" },
    ],
    tips: ["门店为会员制，首次使用要准备本人身份证件。", "淋浴高峰可能排队；把毛巾和换洗衣物放在随手可取的位置。"],
    links: [
      { label: "门店设施与实时价目", url: "https://www.kaikatsu.jp/shop/detail/20121.html" },
      { label: "地图导航", url: maps("快活CLUB 盛岡上堂店") },
    ],
  },
  hachimantai: {
    tagline: "高原湿地、八幡沼与短距离木栈道环线",
    overview: "八幡平山顶一带海拔约 1,600 米，地形开阔，湿地、火口湖与针叶林交错。夏季最适合从山顶停车场走八幡沼方向的短环线；不需要登山强度，也能看到高原尺度的景观。",
    image: { src: "/places/hachimantai.jpg", alt: "八幡平八幡沼周边的高原湿地", credit: "Motamota", license: "CC BY-SA 4.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Hachiman-numa_chitou.jpg" },
    facts: [
      { label: "建议停留", value: "1.5–2.5 小时" },
      { label: "门票", value: "步道免费" },
      { label: "海拔", value: "山顶约 1,613 m" },
    ],
    budget: "步道免费；停车、热饮和简餐合计建议预留 ¥1,000–2,500 / 人。",
    foods: [
      { name: "八幡平牛", description: "时间充足可在山麓选择烤肉或牛肉定食。", budget: "约 ¥1,500–3,000" },
      { name: "山葡萄甜品", description: "岩手北部常见山葡萄汁、软冰淇淋与果酱。", budget: "约 ¥400–900" },
    ],
    tips: ["山顶气温明显低于盛冈，8 月也带薄外套和防风层。", "天气差时不要追求完整环线，山顶观景与休息站短停即可。"],
    links: [
      { label: "八幡平市观光协会", url: "https://hachimantai.or.jp/" },
      { label: "山顶休息站信息", url: "https://www.pref.iwate.jp/sangyoukoyou/kankou/camp/1009242.html" },
      { label: "地图导航", url: maps("八幡平山頂レストハウス") },
    ],
  },
  towada: {
    tagline: "本州最深部之一的双重火山口湖",
    overview: "十和田湖是大型破火山口湖，休屋一带适合看湖、散步和乘船。若当天还要深度游奥入濑，建议在湖畔控制停留；想从水面理解御仓、中山两个半岛，再选择约 50 分钟的游览船。",
    image: { src: "/places/towada.jpg", alt: "十和田湖休屋湖畔的蓝色湖面与群山", credit: "Marho", license: "CC BY-SA 4.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Lake_Towada_Yasumiya.jpg" },
    facts: [
      { label: "建议停留", value: "1–2 小时" },
      { label: "湖畔", value: "免费" },
      { label: "2026 游船", value: "成人 ¥1,760 / 约 50 分钟" },
    ],
    budget: "只散步约 ¥0–1,500；加入游船和午餐后约 ¥3,000–4,500 / 人。",
    foods: [
      { name: "姬鳟料理", description: "十和田湖代表性湖鱼，常见盐烧、刺身或定食。", budget: "约 ¥1,500–3,000" },
      { name: "十和田牛肉炒洋葱", description: "十和田市名物“バラ焼き”，适合返程或市区用餐。", budget: "约 ¥1,000–1,800" },
    ],
    tips: ["游船会因浓雾、强风调整或停航，先查当天运行。", "如果奥入濑时间不足，湖畔以乙女像—休屋短线散步为主。"],
    links: [
      { label: "2026 十和田湖游船", url: "https://toutetsu.co.jp/ship.html?lang=ja" },
      { label: "地图与休屋停车", url: maps("十和田湖 休屋") },
    ],
  },
  oirase: {
    tagline: "沿 14 公里清流，串起苔岩、急流与瀑布",
    overview: "奥入濑溪流从十和田湖子之口流向烧山，代表景观包括铫子大瀑布、云井瀑布和阿修罗之流。全程徒步约需 4 小时，本行程更适合选“石户—云井瀑布”或“子之口—铫子大瀑布”分段体验。",
    image: { src: "/places/oirase.jpg", alt: "森林与苔藓之间流动的奥入濑溪流", credit: "sodai gomi", license: "CC BY 2.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:2008-06-03_Oirase_Mountain_Stream.jpg" },
    facts: [
      { label: "建议停留", value: "2.5–4 小时" },
      { label: "门票", value: "溪流步道免费" },
      { label: "全长", value: "约 14 km" },
    ],
    budget: "徒步免费；巴士 / 租车、咖啡和轻食建议预留 ¥1,500–3,500 / 人。",
    foods: [
      { name: "青森苹果甜点", description: "烧山附近常见苹果派、苹果汁与咖啡，适合散步后休息。", budget: "约 ¥500–1,200" },
      { name: "奥入濑溪流馆轻食", description: "出发或结束时补充热饮和简餐，比沿路临时找店稳妥。", budget: "约 ¥800–1,500" },
    ],
    tips: ["车道与步道距离很近，拍照时不要站到车道上。", "部分日期实施私家车交通管制；雨后木道湿滑，必须穿防滑鞋。"],
    links: [
      { label: "青森县官方景点信息", url: "https://aomori-tourism.com/spot/detail_339.html" },
      { label: "地图：石户休息所", url: maps("石ヶ戸休憩所") },
    ],
  },
  hakkoda: {
    tagline: "天气好才值得加入的高山候选线",
    overview: "八甲田由多座火山峰组成。最省体力的体验是乘缆车到山顶公园站，再走约 1–1.5 小时的八甲田ゴードライン。它受云雾和强风影响明显，因此保持为候选点是合理的。",
    image: { src: "/places/hakkoda.jpg", alt: "秋季红叶覆盖的八甲田山地", credit: "Aomorikuma", license: "CC BY-SA 4.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Autumn_leaves_Hakkoda_Aomori_prf_Japan_20171008_IMG_3817.jpg" },
    facts: [
      { label: "建议停留", value: "2–3 小时" },
      { label: "2026 缆车", value: "成人往返 ¥2,200" },
      { label: "运行", value: "约每 15–20 分钟" },
    ],
    budget: "缆车、轻食和饮料合计约 ¥3,000–4,000 / 人。若山顶被云遮住，可直接取消省下时间。",
    foods: [
      { name: "酸汤温泉荞麦面", description: "若绕到酸汤温泉，可安排简单热食并看时间决定是否泡汤。", budget: "约 ¥800–1,300" },
      { name: "八甲田山麓简餐", description: "缆车山麓站周边解决咖喱、拉面或热饮。", budget: "约 ¥900–1,600" },
    ],
    tips: ["先看山顶实时摄像头和运转信息，再决定是否绕行。", "强风或荒天会停运；不要让候选景点影响 14:00–14:30 到青森屋。"],
    links: [
      { label: "八甲田缆车运费与时间", url: "https://hakkoda-ropeway.jp/fare_time/" },
      { label: "地图导航", url: maps("八甲田ロープウェー 山麓駅") },
    ],
  },
  aomoriya: {
    tagline: "把温泉、青森祭典文化和住宿集中在一晚",
    overview: "青森屋位于三泽古牧温泉区域，园区将温泉、乡土料理和青森祭典表演集中在住宿体验内。本行程的关键不是继续赶景点，而是 14:00–14:30 到停车场、15:00 入住，完整利用酒店时间。",
    image: { src: "/places/aomoriya.jpg", alt: "青森屋园区内传统建筑与庭园", credit: "663highland", license: "CC BY 2.5", sourceUrl: "https://commons.wikimedia.org/wiki/File:151031_Hoshino_Resort_Aomoriya_Misawa_Aomori_pref_Japan03s3.jpg" },
    facts: [
      { label: "入住", value: "8/27 15:00" },
      { label: "退房", value: "8/28 12:00" },
      { label: "费用", value: "住宿与餐食以预订内容为准" },
    ],
    budget: "住宿为已确定支出；另为酒水、祭典演出或收费活动预留 ¥2,000–6,000 / 人。",
    foods: [
      { name: "のれそれ食堂", description: "酒店自助餐集中呈现青森乡土料理与现做菜品，需确认预订是否含餐。", budget: "以住宿加餐价为准" },
      { name: "青森苹果与地酒", description: "园区酒场适合尝试苹果饮品和青森地酒，但次日驾车者不要饮酒。", budget: "约 ¥500–2,000" },
    ],
    tips: ["提前在住客页面预约用餐时段和有名额限制的活动。", "次日 12:00 退房是硬约束；上午活动要预留收拾和装车时间。"],
    links: [
      { label: "青森屋官方网站", url: "https://hoshinoresorts.com/ja/hotels/aomoriya/" },
      { label: "青森屋餐饮信息", url: "https://hoshinoresorts.com/ja/hotels/aomoriya/dining/" },
      { label: "地图导航", url: maps("星野リゾート 青森屋") },
    ],
  },
  hachinohe: {
    tagline: "进入三陆道前，用海鲜早餐补给",
    overview: "八户是青森屋退房后进入三陆沿岸道路的补给节点。若中午才从酒店出发，就不建议深入市区；选择八食中心一次完成海鲜午餐、饮料和车上补给最省时间。",
    facts: [
      { label: "建议停留", value: "45–90 分钟" },
      { label: "定位", value: "补给与午餐节点" },
      { label: "停车", value: "八食中心设大型停车区" },
    ],
    budget: "海鲜丼或七厘烧约 ¥1,500–3,500 / 人，伴手礼另计。",
    foods: [
      { name: "平目渍丼", description: "陆奥凑一带代表早餐；若专程去みなと食堂，要先确认营业和排队。", budget: "约 ¥1,000–1,800" },
      { name: "八食中心七厘村", description: "市场买海鲜后现场炭烤，选择多但用时通常超过普通午餐。", budget: "约 ¥2,000–4,000" },
    ],
    tips: ["当天三陆景点多，午餐最好控制在 60 分钟左右。", "海鲜市场营业时间较早，晚到时优先确认店铺是否仍接单。"],
    links: [
      { label: "八户市食文化信息", url: "https://www.city.hachinohe.aomori.jp/soshikikarasagasu/kankoka/shokunomachi/index.html" },
      { label: "八食中心地图", url: maps("八食センター") },
    ],
  },
  kitayamazaki: {
    tagline: "200 米级断崖连续铺开的三陆第一站",
    overview: "北山崎以约 8 公里连续断崖著称。第一展望台从停车场无台阶可达，是时间有限时的首选；第二、第三展望台需要走较多台阶。天气清晰时层叠海岬最壮观，雾天则要谨慎安排时间。",
    image: { src: "/places/kitayamazaki.jpg", alt: "北山崎高耸的三陆海岸断崖", credit: "Raita Futo", license: "CC BY 2.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Iwate_Coastal_Cliff_(51971269859).jpg" },
    facts: [
      { label: "建议停留", value: "45–90 分钟" },
      { label: "展望台", value: "免费" },
      { label: "可选体验", value: "观光船 / 小渔船另收费" },
    ],
    budget: "只看展望台约 ¥0–1,500；参加海上体验需另外预留，单人乘船可能按整船最低 ¥7,600 计。",
    foods: [
      { name: "海鲜磯拉面", description: "北山崎游客区常见海藻与贝类拉面，适合快速午餐。", budget: "约 ¥1,000–1,500" },
      { name: "田野畑乳制品", description: "当地牛乳、冰淇淋和酸奶适合短休。", budget: "约 ¥300–700" },
    ],
    tips: ["先到第一展望台判断能见度，再决定是否走长台阶。", "乘船高度依赖海况且耗时，若要保留三陆三景，不建议临时追加。"],
    links: [
      { label: "田野畑村北山崎介绍", url: "https://www.vill.tanohata.iwate.jp/kankou/see/kitayamazaki.html" },
      { label: "北山崎海上体验", url: "https://www.vill.tanohata.iwate.jp/kankou/see/sappa-adventures.html" },
      { label: "地图导航", url: maps("北山崎 第1展望台") },
    ],
  },
  jodogahama: {
    tagline: "白色流纹岩、松林与钴蓝色海湾",
    overview: "净土之滨是宫古最具代表性的海岸。白色岩群把海湾围成平静水面，步行强度不高。经典路线是游客中心—海滩—休息站；海况允许时可加约 20 分钟的青之洞窟小船。",
    image: { src: "/places/jodogahama.jpg", alt: "净土之滨白色岩石与蓝色海水", credit: "Raita Futo", license: "CC BY 2.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Jodogahama_Beach_(51969977762).jpg" },
    facts: [
      { label: "建议停留", value: "1–2 小时" },
      { label: "海滩", value: "免费" },
      { label: "青之洞窟船", value: "约 20 分钟 / ¥2,000" },
    ],
    budget: "散步加午餐约 ¥1,500–3,000；加入青之洞窟小船约 ¥3,500–5,000 / 人。",
    foods: [
      { name: "瓶丼", description: "把三陆海鲜装入牛奶瓶，食用时倒在米饭上，是宫古代表性体验。", budget: "约 ¥1,500–2,500" },
      { name: "净土之滨海鲜定食", description: "休息站可直接解决海鲜丼、拉面或烤海鲜，位置最省时间。", budget: "约 ¥1,000–2,500" },
    ],
    tips: ["旺季车辆会被引导至较远停车场，再乘接驳或步行进入。", "小船因浪高、风和能见度停航很常见，不要把它设为硬约束。"],
    links: [
      { label: "宫古官方旅游信息", url: "https://kankou385.jp/" },
      { label: "青之洞窟小船与价格", url: "https://j-marine.com/sappa/" },
      { label: "地图导航", url: maps("浄土ヶ浜ビジターセンター") },
    ],
  },
  goishi: {
    tagline: "穴通磯、雷岩与黑色圆石海滩",
    overview: "碁石海岸沿末崎半岛延伸约 6 公里。最具辨识度的是被海蚀穿出三个洞的穴通磯；雷岩能听到海浪冲入洞穴形成的低鸣。游客中心、停车场和短步道集中，适合三陆返程最后一站。",
    image: { src: "/places/goishi.jpg", alt: "碁石海岸穴通磯的三个海蚀洞", credit: "Morio", license: "CC BY-SA 4.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Anatoshi-iso_Rock_2023.jpg" },
    facts: [
      { label: "建议停留", value: "1–1.5 小时" },
      { label: "步道", value: "免费" },
      { label: "穴通船", value: "2026 参考 ¥2,500 / 人起" },
    ],
    budget: "散步与停车基本免费；加餐约 ¥1,500–2,500，参加穴通船后约 ¥4,000–5,500 / 人。",
    foods: [
      { name: "秋刀鱼拉面", description: "碁石海岸休息站的地区名物，适合快速补充热食。", budget: "约 ¥900–1,300" },
      { name: "三陆海鲜丼", description: "大船渡以海鲜和秋刀鱼闻名，想吃丰盛晚餐可进市区。", budget: "约 ¥1,500–3,000" },
    ],
    tips: ["先走穴通磯观景点，再按剩余时间决定碁石岬灯塔和雷岩。", "小船通常要求至少两人且受海况影响，出发前电话确认。"],
    links: [
      { label: "大船渡市碁石海岸指南", url: "https://www.city.ofunato.iwate.jp/ofunatrip/o-sightseeing/page-9837" },
      { label: "穴通船最新信息", url: "https://goishi.info/anatoshisen/" },
      { label: "地图导航", url: maps("碁石海岸インフォメーションセンター") },
    ],
  },
  sendai: {
    tagline: "三陆返程后的餐饮与补给大节点",
    overview: "仙台在本行程中主要承担返程补给与休息功能。若 8/28 晚抵达，可在市区北侧或高速附近用餐后休息；若 8/29 白天经过，则可以安排一顿牛舌再继续回东京。",
    facts: [
      { label: "建议停留", value: "60–120 分钟" },
      { label: "定位", value: "正餐、加油与返程整备" },
      { label: "名物", value: "牛舌、竹叶鱼糕、毛豆泥" },
    ],
    budget: "牛舌定食通常约 ¥2,000–3,500；甜点、停车和补给再预留 ¥1,000–2,000。",
    foods: [
      { name: "炭火牛舌定食", description: "常配麦饭、牛尾汤和南蛮味噌；车站与市中心选择最多。", budget: "约 ¥2,000–3,500" },
      { name: "毛豆泥奶昔 / 毛豆糕", description: "适合作为短暂停留甜点，也方便在车站购买。", budget: "约 ¥400–900" },
    ],
    tips: ["市中心停车与排队会拉长时间，赶路时优先车站周边停车楼或高速服务区。", "吃完正餐后至少休息 15 分钟再继续长途驾驶。"],
    links: [
      { label: "仙台官方旅游信息", url: "https://www.sentabi.jp/" },
      { label: "宫城县牛舌介绍", url: "https://www.miyagi-kankou.or.jp/theme/detail.php?id=19014" },
      { label: "仙台站地图", url: maps("仙台駅") },
    ],
  },
};
