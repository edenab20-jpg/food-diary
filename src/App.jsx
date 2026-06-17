import { useState, useEffect, useRef } from "react";
import {
  Sunrise, UtensilsCrossed, Cookie, ChefHat,
  Droplets, Pill, Plus, X, ClipboardList,
  Home, BookOpen, Lightbulb, Check, Flame, AlertCircle,
  BarChart2, TrendingUp, TrendingDown, ChevronDown, ChevronUp,
  Send, Sparkles
} from "lucide-react";

const C = {
  bg:       "#FFFFFF",
  bgSoft:   "#F7F8F6",
  bgSage:   "#F2F5EE",
  card:        "#FFFFFF",
  cardShadow:  "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
  cardBorder:  "#EFEFEF",
  glass:       "rgba(255,255,255,0.75)",
  glassBorder: "rgba(255,255,255,0.9)",
  glassShadow: "0 8px 32px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
  sage:        "#7A9E6E",
  sageDark:    "#2D5016",
  sageDeep:    "#3D6B25",
  sagePale:    "#EAF0E5",
  cta:         "#9A5000",
  ctaPale:     "#FFF4E8",
  ctaBorder:   "#F5D9B5",
  ctaBtn:      "#C96B00",
  text:        "#1A1A1A",
  textMid:     "#4A4A4A",
  muted:       "#767676",
  danger:      "#C0392B",
  warning:     "#8B4513",
  water:       "#2E7A8A",
  waterPale:   "#E8F4F7",
  divider:     "#F0F0F0",
};

const card = {
  background: C.card,
  borderRadius: 20,
  boxShadow: C.cardShadow,
  border: `1px solid ${C.cardBorder}`,
};

const glassPanel = {
  background: C.glass,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid ${C.glassBorder}`,
  boxShadow: C.glassShadow,
};

const DAILY_TARGET = 1650;
const WATER_TARGET = 8;

const MEALS = {
  breakfast: { label: "ארוחת בוקר",   short: "בוקר",   Icon: Sunrise,        target: 375 },
  lunch:     { label: "ארוחת צהריים", short: "צהריים", Icon: UtensilsCrossed, target: 525 },
  snack:     { label: "נשנוש לילה",   short: "נשנוש",  Icon: Cookie,          target: 175 },
  dinner:    { label: "ארוחת ערב",    short: "ערב",    Icon: ChefHat,         target: 425 },
};

const SUGGESTIONS = {
  breakfast: [
    { title: "טוסט עם ביצה", note: "✅ גם הילדה אוכלת | 5 דקות", items: ["2 פרוסות לחם מלא (70 גרם)", "2 ביצים מקושקשות בכפית שמן זית", "גבינה צהובה 28% (20 גרם)", "עגבנייה בינונית אחת"] },
    { title: "יוגורט עם פרי", note: "✅ גם הילדה אוכלת (היא עם גרנולה, את בלי)", items: ["יוגורט יווני 5% – 200 גרם", "בננה קטנה (100 גרם)", "כפית דבש", "2 קוביות שוקולד מריר 70%"] },
    { title: "אם יצאו עוגיות עם קפה", note: "הסדר שובר את הספייק בסוכר", items: ["קודם ביצה קשה אחת (מהמקרר)", "אחר כך עוגייה אחת"] },
  ],
  lunch: [
    { title: "עוף עם אורז", items: ["חזה עוף 150 גרם (מבושל)", "4 כפות אורז מלא מבושל (80 גרם יבש)", "סלט מלפפון + עגבנייה עם כפית שמן זית"] },
    { title: "פסטה עם קציצות", items: ["פסטה מלאה 70 גרם (יבש)", "3 קציצות בשר (~150 גרם)", "חצי כוס רוטב עגבניות", "ירק בצד: גזר / מלפפון"] },
    { title: "קוסקוס עם טונה", items: ["קוסקוס 70 גרם (יבש)", "פחית טונה במים (160 גרם)", "פלפל + עגבנייה + כפית שמן זית"] },
  ],
  snack: [
    { title: "גבינה קשה", note: "במקום עוגיות / חטיפים", items: ["גאודה / צהובה / פרמז׳ן – 30 גרם (2–3 פרוסות)"] },
    { title: "שוקולד מריר + גבינה", note: "במקום שוקולד רגיל", items: ["2 קוביות שוקולד מריר 70% (20 גרם)", "גבינה קשה (20 גרם)"] },
    { title: "גבינה בולגרית עם ירק", note: "במקום חטיפים מלוחים", items: ["גבינה בולגרית 5% – 50 גרם", "מלפפון שלם"] },
    { title: "ברי / קממבר עם עגבנייה", note: "במקום כריך שמן", items: ["גבינת ברי / קממבר – 40 גרם", "עגבנייה"] },
  ],
  dinner: [
    { title: "קציצות / עוף בתנור", note: "יום ראשון | מספיק לשני ימים", items: ["500 גרם בשר טחון → 10 קציצות", "3 קציצות לארוחה", "ירק מוקפץ: קישוא / גזר / ברוקולי", "3 כפות אורז"] },
    { title: "מרק עדשים", note: "יום שלישי | מספיק לשני ימים", items: ["1 כוס עדשים כתומות יבשות", "קערת מרק (300 מ״ל)", "פרוסת לחם מלא"] },
    { title: "פשטידת ירק בתנור", note: "יום חמישי", items: ["4 ביצים", "קישוא מגורד", "גבינה בולגרית 5% (100 גרם)", "שמיר", "רבע פשטידה + סלט ירוק"] },
    { title: "ביצים מקושקשות", note: "מהיר | 10 דקות", items: ["3 ביצים מקושקשות", "פרוסת לחם מלא", "30 גרם גבינה קשה"] },
    { title: "פיתה עם קוטג׳", note: "מהיר", items: ["פיתה מלאה", "קוטג׳ 200 גרם", "ירקות חתוכים"] },
    { title: "טונה עם אורז", note: "מהיר", items: ["פחית טונה", "4 כפות אורז מהמקרר", "עגבנייה"] },
  ],
};

const TIPS = [
  { Icon: AlertCircle, title: "סדר אכילה חשוב",   body: "תמיד תתחילי עם חלבון לפני פחמימה — זה מוריד את הספייק בסוכר ומפחית את החשק למתוק אחר כך." },
  { Icon: Flame,       title: "הנשנוש הכי קריטי", body: "החלון של שעת שינה הילדה הוא הכי מסוכן לאכילה לא מתוכננת. תכיני גבינה קשה לפני שהיא נרדמת." },
  { Icon: Pill,        title: "ויטמין להריון",      body: "על השיש, ליד מכונת הקפה. לא במגירה. זה ההבדל בין לקחת ולא לקחת." },
  { Icon: Droplets,    title: "שתייה ממוקדת",      body: "כוס מים מיד בבוקר לפני הקפה, כוס לפני כל ארוחה — ככה מגיעים ל-8 בלי לחשוב." },
  { Icon: Check,       title: "3 שינויים ראשונים", body: "6 ביצים קשות במקרר, גבינה קשה חתוכה בקופסה, ויטמין ליד הקפה. רק את שלושת אלה קודם." },
];

const HISTORY = [
  { date: (() => { const d = new Date(); d.setDate(d.getDate()-6); return d; })(), label:"יום א׳", calories:1480, water:6, meals:{ breakfast:[{name:"יוגורט יווני עם בננה",calories:280}], lunch:[{name:"עוף עם אורז מלא",calories:520},{name:"סלט ירקות",calories:80}], snack:[{name:"גבינה קשה",calories:110}], dinner:[{name:"מרק עדשים",calories:310},{name:"לחם מלא",calories:180}] }},
  { date: (() => { const d = new Date(); d.setDate(d.getDate()-5); return d; })(), label:"יום ב׳", calories:1720, water:5, meals:{ breakfast:[{name:"טוסט עם ביצה וגבינה",calories:390}], lunch:[{name:"פסטה עם קציצות",calories:620}], snack:[{name:"שוקולד מריר + גבינה",calories:130}], dinner:[{name:"קציצות בתנור",calories:380},{name:"ירק מוקפץ",calories:200}] }},
  { date: (() => { const d = new Date(); d.setDate(d.getDate()-4); return d; })(), label:"יום ג׳", calories:1390, water:8, meals:{ breakfast:[{name:"קפה + ביצה קשה",calories:90}], lunch:[{name:"קוסקוס עם טונה",calories:510}], snack:[{name:"גבינה בולגרית עם מלפפון",calories:120}], dinner:[{name:"פשטידת ירק",calories:340},{name:"סלט ירוק",calories:80},{name:"לחם מלא",calories:250}] }},
  { date: (() => { const d = new Date(); d.setDate(d.getDate()-3); return d; })(), label:"יום ד׳", calories:1650, water:7, meals:{ breakfast:[{name:"יוגורט עם פרי ודבש",calories:350}], lunch:[{name:"עוף עם אורז",calories:580}], snack:[{name:"גבינת ברי ועגבנייה",calories:150}], dinner:[{name:"ביצים מקושקשות + לחם",calories:420},{name:"גבינה קשה",calories:150}] }},
  { date: (() => { const d = new Date(); d.setDate(d.getDate()-2); return d; })(), label:"יום ה׳", calories:1890, water:4, meals:{ breakfast:[{name:"מעדן דנונה + קפה",calories:165}], lunch:[{name:"3 תפוחי אדמה + ביצים",calories:385}], snack:[], dinner:[{name:"לחמנייה גדולה",calories:530},{name:"טונה",calories:150},{name:"ביצים קשות",calories:280},{name:"ירקות",calories:50},{name:"גבינה",calories:100},{name:"ממרח",calories:90}] }},
  { date: (() => { const d = new Date(); d.setDate(d.getDate()-1); return d; })(), label:"אתמול", calories:1560, water:6, meals:{ breakfast:[{name:"טוסט עם ביצה",calories:380}], lunch:[{name:"סלט עוף גדול",calories:520}], snack:[{name:"גבינה קשה",calories:110}], dinner:[{name:"מרק עדשים",calories:310},{name:"לחם מלא",calories:180},{name:"סלט ירוק",calories:60}] }},
];

const today = new Date().toLocaleDateString("he-IL", { weekday:"long", month:"long", day:"numeric" });

const MENU_CONTEXT = `את סוכנת תזונה אישית ואוהבת של עדן. עדן עוקבת אחר תפריט תזונתי מותאם ל-PCOS, כניסה להריון וירידה במשקל.
יעד קלורי יומי: 1,600–1,700 קלוריות.
ארוחות: בוקר (375 קל׳), צהריים (525 קל׳), נשנוש לילה (175 קל׳), ערב (425 קל׳).

כשעדן מספרת לך מה אכלה, עשי את הדברים הבאים:
1. זהי לאיזו ארוחה זה שייך (breakfast/lunch/snack/dinner) על סמך התוכן והזמן ביום
2. העריכי קלוריות לכל פריט בנפרד
3. תני פידבק חם, אישי ומעודד — לא שיפוטי!
4. הוסיפי טיפ קצר לארוחה הבאה
5. כתבי בעברית, בטון חם ואישי כמו חברה טובה

חזרי תמיד ב-JSON בלבד (ללא שום טקסט נוסף, ללא markdown, ללא backticks):
{"message":"הודעה חמה ואישית","meal_key":"breakfast|lunch|snack|dinner","items":[{"name":"שם המאכל","calories":123}],"tip":"טיפ קצר לארוחה הבאה"}

אם זה לא קשור לאוכל:
{"message":"תגובה חמה ואישית","meal_key":null,"items":[],"tip":null}`;

// ─── CONFETTI ─────────────────────────────────────────────────
function Confetti({ show }) {
  if (!show) return null;
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    x: 10 + Math.random() * 80, delay: Math.random() * 0.5,
    color: [C.sage, C.ctaBtn, "#c8b560", C.water, C.sageDeep][i % 5],
    size: 5 + Math.random() * 7,
  }));
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", borderRadius:20 }}>
      {pieces.map((p, i) => (
        <div key={i} style={{
          position:"absolute", left:`${p.x}%`, top:"-8px",
          width:p.size, height:p.size, borderRadius: i%3===0 ? "50%" : 2,
          background:p.color, animation:`confettiFall 1.1s ${p.delay}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

// ─── TYPING INDICATOR ─────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4, padding:"10px 14px", background:C.bgSage, borderRadius:"18px 18px 18px 4px", width:"fit-content", border:`1px solid rgba(122,158,110,0.2)` }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:6, height:6, borderRadius:"50%", background:C.sage,
          animation:`typingBounce 1.2s ${i*0.2}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── AI CHAT HOME ─────────────────────────────────────────────
function HomeScreen({ entries, setEntries, glasses, streak }) {
  const mealTotal = k => entries[k].reduce((s, e) => s + e.calories, 0);
  const dailyTotal = Object.keys(entries).reduce((s, k) => s + mealTotal(k), 0);
  const pct = Math.min((dailyTotal / DAILY_TARGET) * 100, 100);
  const remaining = Math.max(0, DAILY_TARGET - dailyTotal);
  const over = dailyTotal > DAILY_TARGET;

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "בוקר טוב, עדן ☀️";
    if (h < 17) return "צהריים טובים, עדן 🌿";
    return "ערב טוב, עדן 🌙";
  };

  const getOpeningMessage = () => {
    const h = new Date().getHours();
    const eaten = Object.values(entries).flat().length;
    if (eaten === 0) {
      if (h < 10) return "בוקר טוב! רק רגע אחד לכתוב מה אכלת — זה הכי קל ואת תרגישי כל כך טוב שתיעדת 💪";
      if (h < 14) return "היי עדן! ספרי לי מה היה לבוקר — אפילו משהו קטן, זה מעולה לתיעוד 🌱";
      return "היי! עוד לא רשמנו כלום היום. בואי נתחיל — מה אכלת? פשוט כתבי לי בחופשיות 😊";
    }
    return `כל הכבוד שכבר תיעדת! יש לך ${dailyTotal} קל׳ עד עכשיו. מה אכלת עוד? ספרי לי ואני אדאג לשאר 💜`;
  };

  const [messages, setMessages] = useState([
    { id: 1, role: "agent", text: getOpeningMessage(), tip: null, addedItems: null }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nextMsgId, setNextMsgId] = useState(10);
  const [nextEntryId, setNextEntryId] = useState(100);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    const uid = nextMsgId;
    setNextMsgId(n => n + 2);
    setMessages(prev => [...prev, { id: uid, role: "user", text, tip: null, addedItems: null }]);
    setIsLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
 headers: { 
  "Content-Type": "application/json", 
  "x-api-key": "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",
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true"
},
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          system: MENU_CONTEXT,
          messages: [{ role: "user", content: text }],
        }),
      });
      const data = await response.json();

      // Show raw error from API if request failed
      if (!response.ok || data.error) {
        const errMsg = data.error?.message || JSON.stringify(data);
        setMessages(prev => [...prev, { id: uid+1, role: "agent", text: `שגיאה: ${errMsg}`, tip: null, addedItems: null }]);
        setIsLoading(false);
        return;
      }

      const raw = data.content?.find(b => b.type === "text")?.text || "{}";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      let addedItems = null;
      if (parsed.meal_key && parsed.items?.length > 0) {
        const newItems = parsed.items.map((item, i) => ({
          id: nextEntryId + i, name: item.name, calories: item.calories,
        }));
        setNextEntryId(n => n + parsed.items.length);
        setEntries(prev => ({ ...prev, [parsed.meal_key]: [...prev[parsed.meal_key], ...newItems] }));
        addedItems = { mealLabel: MEALS[parsed.meal_key]?.label, items: parsed.items };
      }

      setMessages(prev => [...prev, { id: uid+1, role: "agent", text: parsed.message, tip: parsed.tip, addedItems }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: uid+1, role: "agent", text: `שגיאה טכנית: ${err.message}`, tip: null, addedItems: null }]);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ background: C.bg, height:"calc(100vh - 68px)", display:"flex", flexDirection:"column" }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(145deg, ${C.sageDeep} 0%, ${C.sage} 100%)`,
        padding: "44px 22px 20px", position: "relative", overflow: "hidden", flexShrink: 0,
      }}>
        <div style={{ position:"absolute", top:-40, left:-40, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
        <div style={{ position:"absolute", bottom:-20, right:-20, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", letterSpacing:1.5, marginBottom:5, textTransform:"uppercase" }}>{today}</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff", letterSpacing:-0.5, marginBottom:12 }}>{greet()}</div>

          <div style={{ ...glassPanel, borderRadius:18, padding:"13px 16px", display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ position:"relative", width:72, height:72, flexShrink:0 }}>
              <svg width="72" height="72" style={{ transform:"rotate(-90deg)" }}>
                <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                <circle cx="36" cy="36" r="30" fill="none"
                  stroke={over ? "#ff6b6b" : "#fff"} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={2*Math.PI*30}
                  strokeDashoffset={2*Math.PI*30*(1-pct/100)}
                  style={{ transition:"stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)" }}
                />
              </svg>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:15, fontWeight:800, color:over?"#ff6b6b":"#fff", lineHeight:1 }}>{dailyTotal}</div>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.65)", marginTop:1 }}>קל׳</div>
              </div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:700, color: over?"#ff6b6b":"#fff", marginBottom:7 }}>
                {over ? `עברת ב־${dailyTotal - DAILY_TARGET}` : `נותר ${remaining} קל׳`}
              </div>
              {Object.entries(MEALS).map(([key, m]) => {
                const t = mealTotal(key); const p = Math.min((t/m.target)*100, 100);
                return (
                  <div key={key} style={{ marginBottom:4 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                      <span style={{ fontSize:9, color:"rgba(255,255,255,0.6)" }}>{m.short}</span>
                      <span style={{ fontSize:9, fontWeight:600, color:"rgba(255,255,255,0.85)" }}>{t}</span>
                    </div>
                    <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:3, height:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${p}%`, background:"#fff", borderRadius:3, transition:"width 0.5s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px", display:"flex", flexDirection:"column", gap:10 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display:"flex", flexDirection: msg.role === "user" ? "row-reverse" : "row",
            alignItems:"flex-end", gap:8, animation:"popIn 0.25s ease",
          }}>
            {msg.role === "agent" && (
              <div style={{
                width:30, height:30, borderRadius:"50%", flexShrink:0,
                background:`linear-gradient(135deg, ${C.sageDeep}, ${C.sage})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`0 2px 8px rgba(61,107,37,0.3)`,
              }}>
                <Sparkles size={13} color="#fff" strokeWidth={2} />
              </div>
            )}

            <div style={{ maxWidth:"78%", display:"flex", flexDirection:"column", gap:6, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                background: msg.role === "user" ? C.sageDeep : C.bgSage,
                border: msg.role === "user" ? "none" : `1px solid rgba(122,158,110,0.2)`,
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "10px 14px",
                boxShadow: msg.role === "user" ? `0 3px 12px rgba(45,80,22,0.2)` : "none",
              }}>
                <p style={{ fontSize:13, color: msg.role === "user" ? "#fff" : C.text, lineHeight:1.55, margin:0, direction:"rtl" }}>
                  {msg.text}
                </p>
              </div>

              {msg.addedItems && (
                <div style={{ background:C.sagePale, border:`1px solid rgba(122,158,110,0.35)`, borderRadius:12, padding:"9px 12px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.sageDeep, marginBottom:5, display:"flex", alignItems:"center", gap:4 }}>
                    <Check size={11} color={C.sageDeep} strokeWidth={2.5} />
                    נרשם ל{msg.addedItems.mealLabel}
                  </div>
                  {msg.addedItems.items.map((item, i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", gap:12, fontSize:11, color:C.textMid, marginBottom: i < msg.addedItems.items.length-1 ? 3 : 0 }}>
                      <span>{item.name}</span>
                      <span style={{ fontWeight:700, color:C.sageDeep, flexShrink:0 }}>{item.calories} קל׳</span>
                    </div>
                  ))}
                </div>
              )}

              {msg.tip && (
                <div style={{ background:C.ctaPale, border:`1px solid ${C.ctaBorder}`, borderRadius:12, padding:"8px 12px", display:"flex", alignItems:"flex-start", gap:7 }}>
                  <Lightbulb size={12} color={C.ctaBtn} strokeWidth={2} style={{ flexShrink:0, marginTop:1 }} />
                  <p style={{ fontSize:11, color:C.cta, margin:0, lineHeight:1.5, direction:"rtl" }}>{msg.tip}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg, ${C.sageDeep}, ${C.sage})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Sparkles size={13} color="#fff" strokeWidth={2} />
            </div>
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ flexShrink:0, background:C.bg, borderTop:`1px solid ${C.divider}`, padding:"10px 14px 12px", display:"flex", gap:8, alignItems:"center" }}>
        <div style={{ flex:1, background:C.bgSoft, border:`1.5px solid ${C.cardBorder}`, borderRadius:22, padding:"10px 16px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="מה אכלת? כתבי לי בחופשיות..."
            style={{ width:"100%", background:"none", border:"none", outline:"none", fontSize:13, color:C.text, direction:"rtl", fontFamily:"inherit" }}
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          style={{
            width:42, height:42, borderRadius:"50%", border:"none",
            cursor: input.trim() && !isLoading ? "pointer" : "default",
            background: input.trim() && !isLoading ? C.sageDeep : "#E0E0E0",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
            boxShadow: input.trim() && !isLoading ? `0 4px 14px rgba(45,80,22,0.3)` : "none",
            transition:"all 0.2s",
          }}
        >
          <Send size={16} color="#fff" strokeWidth={2.5} style={{ transform:"rotate(180deg)" }} />
        </button>
      </div>
    </div>
  );
}

// ─── DIARY ────────────────────────────────────────────────────
function DiaryScreen({ entries, setEntries, initialMeal }) {
  const [activeMeal, setActiveMeal] = useState(initialMeal || "breakfast");
  const [inputName, setInputName]   = useState("");
  const [inputCal, setInputCal]     = useState("");
  const [nextId, setNextId]         = useState(200);
  const [showSugg, setShowSugg]     = useState(false);
  const [justAdded, setJustAdded]   = useState(false);
  const [celebrate, setCelebrate]   = useState(false);

  const mealTotal = k => entries[k].reduce((s, e) => s + e.calories, 0);
  const addEntry = () => {
    if (!inputName.trim() || !inputCal) return;
    const newEntries = { ...entries, [activeMeal]: [...entries[activeMeal], { id:nextId, name:inputName.trim(), calories:parseInt(inputCal) }] };
    setEntries(newEntries); setNextId(n => n+1); setInputName(""); setInputCal("");
    setJustAdded(true); setTimeout(() => setJustAdded(false), 600);
    const t = newEntries[activeMeal].reduce((s, e) => s + e.calories, 0);
    if (t >= MEALS[activeMeal].target * 0.88 && t <= MEALS[activeMeal].target * 1.12) { setCelebrate(true); setTimeout(() => setCelebrate(false), 1800); }
  };
  const removeEntry = id => setEntries(prev => ({ ...prev, [activeMeal]: prev[activeMeal].filter(e => e.id !== id) }));

  const meal = MEALS[activeMeal];
  const total = mealTotal(activeMeal);
  const pct = Math.min((total / meal.target) * 100, 100);
  const statusColor = total === 0 ? C.muted : total > meal.target * 1.15 ? C.danger : total > meal.target ? C.warning : C.sageDeep;

  return (
    <div style={{ background:C.bgSoft, minHeight:"100vh", paddingBottom:110 }}>
      <div style={{ background:C.bg, padding:"36px 22px 16px", borderBottom:`1px solid ${C.divider}` }}>
        <div style={{ fontSize:24, fontWeight:800, color:C.text, letterSpacing:-0.5, marginBottom:2 }}>יומן אכילה</div>
        <div style={{ fontSize:11, color:C.muted, letterSpacing:1.2, textTransform:"uppercase" }}>{today}</div>
      </div>
      <div style={{ background:C.bg, padding:"12px 22px 16px", borderBottom:`1px solid ${C.divider}` }}>
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:2 }}>
          {Object.entries(MEALS).map(([key, m]) => {
            const isActive = activeMeal === key; const t = mealTotal(key);
            return (
              <button key={key} onClick={() => { setActiveMeal(key); setShowSugg(false); }} style={{
                flexShrink:0, background: isActive ? C.sageDeep : C.bgSoft,
                border: isActive ? "none" : `1px solid ${C.cardBorder}`,
                borderRadius:50, padding:"8px 16px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:6,
                boxShadow: isActive ? `0 4px 14px rgba(45,80,22,0.25)` : "none",
                transition:"all 0.18s",
              }}>
                <m.Icon size={13} color={isActive ? "#fff" : t > 0 ? C.sage : "#BFBFBF"} strokeWidth={2} />
                <span style={{ fontSize:12, fontWeight:600, color: isActive ? "#fff" : C.textMid }}>{m.short}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding:"16px 22px 0" }}>
        <div style={{ ...card, background:C.card, padding:20, position:"relative", overflow:"hidden" }}>
          <Confetti show={celebrate} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
                <meal.Icon size={17} color={C.sage} strokeWidth={1.75} />
                <span style={{ fontSize:16, fontWeight:800, color:C.text }}>{meal.label}</span>
              </div>
              <div style={{ fontSize:11, color:C.muted }}>יעד: {meal.target} קל׳</div>
            </div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:24, fontWeight:800, color:statusColor, lineHeight:1 }}>{total}</div>
              <div style={{ fontSize:10, color:C.muted }}>קל׳</div>
            </div>
          </div>
          <div style={{ background:"#EBEBEB", borderRadius:6, height:6, marginBottom:16, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background: pct>115 ? C.danger : C.sage, borderRadius:6, transition:"width 0.45s cubic-bezier(.4,0,.2,1)" }} />
          </div>
          <button onClick={() => setShowSugg(s => !s)} style={{
            background: showSugg ? C.bgSage : C.ctaPale, border: `1px solid ${showSugg ? "rgba(122,158,110,0.4)" : C.ctaBorder}`,
            borderRadius:10, padding:"9px 16px", cursor:"pointer", width:"100%",
            display:"flex", alignItems:"center", justifyContent:"center", gap:7, marginBottom:14, transition:"all 0.2s",
          }}>
            <ClipboardList size={14} color={showSugg ? C.sageDeep : C.cta} strokeWidth={2} />
            <span style={{ fontSize:12, fontWeight:700, color: showSugg ? C.sageDeep : C.cta }}>{showSugg ? "סגור הצעות" : "הצעות מהתפריט"}</span>
          </button>
          {showSugg && (
            <div style={{ marginBottom:14, animation:"slideDown 0.2s ease" }}>
              {SUGGESTIONS[activeMeal].map((s, i) => (
                <div key={i} style={{ background:C.bgSoft, border:`1px solid ${C.cardBorder}`, borderRadius:12, padding:"11px 13px", marginBottom:8 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom: s.note ? 2 : 6 }}>{s.title}</div>
                  {s.note && <div style={{ fontSize:10, color:C.muted, marginBottom:6, fontStyle:"italic" }}>{s.note}</div>}
                  {s.items.map((item, j) => (
                    <div key={j} style={{ fontSize:11, color:C.textMid, marginBottom:3, paddingRight:9, borderRight:`2px solid ${C.sage}` }}>{item}</div>
                  ))}
                </div>
              ))}
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:14 }}>
            {entries[activeMeal].length === 0 ? (
              <div style={{ textAlign:"center", color:C.muted, fontSize:12, padding:"20px 0" }}>עדיין לא הוספת — הוסיפי את הארוחה</div>
            ) : entries[activeMeal].map((entry, idx) => (
              <div key={entry.id} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                background:C.bgSoft, border:`1px solid ${C.divider}`, borderRadius:10, padding:"9px 13px",
                animation: idx === entries[activeMeal].length-1 && justAdded ? "popIn 0.3s ease" : "none",
              }}>
                <span style={{ fontSize:13, color:C.text }}>{entry.name}</span>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:C.sageDeep }}>{entry.calories}</span>
                  <button onClick={() => removeEntry(entry.id)} style={{ background:"none", border:"none", cursor:"pointer", padding:2, display:"flex" }}>
                    <X size={13} color={C.muted} strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:7 }}>
            <input value={inputName} onChange={e => setInputName(e.target.value)} onKeyDown={e => e.key==="Enter" && addEntry()} placeholder="מה אכלת?"
              style={{ flex:1, background:C.bgSoft, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"10px 13px", color:C.text, fontSize:13, outline:"none", direction:"rtl", fontFamily:"inherit" }}
            />
            <input value={inputCal} onChange={e => setInputCal(e.target.value)} onKeyDown={e => e.key==="Enter" && addEntry()} placeholder="קל׳" type="number"
              style={{ width:58, background:C.bgSoft, border:`1.5px solid ${C.cardBorder}`, borderRadius:10, padding:"10px 8px", color:C.text, fontSize:13, outline:"none", textAlign:"center", fontFamily:"inherit" }}
            />
            <button onClick={addEntry} style={{ background:C.ctaBtn, border:"none", borderRadius:10, width:42, height:42, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 14px rgba(201,107,0,0.35)`, flexShrink:0 }}>
              <Plus size={18} color="#fff" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TIPS ─────────────────────────────────────────────────────
function TipsScreen({ glasses, setGlasses }) {
  return (
    <div style={{ background:C.bgSoft, minHeight:"100vh", paddingBottom:110 }}>
      <div style={{ background:C.bg, padding:"36px 22px 16px", borderBottom:`1px solid ${C.divider}` }}>
        <div style={{ fontSize:24, fontWeight:800, color:C.text, letterSpacing:-0.5, marginBottom:2 }}>טיפים ומים</div>
        <div style={{ fontSize:11, color:C.muted, letterSpacing:1.2, textTransform:"uppercase" }}>כלים לשמור על הדרך</div>
      </div>
      <div style={{ padding:"16px 22px 0" }}>
        <div style={{ background:`linear-gradient(135deg, ${C.water} 0%, #1a5f70 100%)`, borderRadius:20, padding:20, marginBottom:12, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
          <div style={{ ...glassPanel, borderRadius:16, padding:"16px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Droplets size={17} color={C.water} strokeWidth={1.75} />
                <span style={{ fontSize:14, fontWeight:700, color:C.text }}>שתייה יומית</span>
              </div>
              <span style={{ fontSize:20, fontWeight:800, color: glasses >= WATER_TARGET ? C.sageDeep : C.water }}>
                {glasses}<span style={{ fontSize:11, fontWeight:400, color:C.muted }}>/{WATER_TARGET}</span>
              </span>
            </div>
            <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:10 }}>
              {Array.from({ length: WATER_TARGET }).map((_, i) => (
                <div key={i} onClick={() => setGlasses(i < glasses ? i : i+1)} style={{
                  width:28, height:42, borderRadius:8,
                  background: i < glasses ? `rgba(46,122,138,0.7)` : `rgba(46,122,138,0.12)`,
                  border: `1.5px solid ${i < glasses ? "rgba(46,122,138,0.5)" : "rgba(46,122,138,0.2)"}`,
                  backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)",
                  cursor:"pointer", transition:"all 0.2s",
                  display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:5,
                }}>
                  {i < glasses && <div style={{ width:4, height:4, borderRadius:"50%", background:"rgba(255,255,255,0.6)" }} />}
                </div>
              ))}
            </div>
            <div style={{ textAlign:"center", fontSize:12, fontWeight: glasses >= WATER_TARGET ? 700 : 400, color: glasses >= WATER_TARGET ? C.sageDeep : C.muted }}>
              {glasses >= WATER_TARGET ? "כל הכבוד! הגעת ליעד השתייה היום" : `עוד ${WATER_TARGET - glasses} כוסות ליעד`}
            </div>
          </div>
        </div>
        <div style={{ ...card, padding:"14px 16px", marginBottom:12, background:C.ctaPale, border:`1px solid ${C.ctaBorder}`, boxShadow:"none", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"rgba(201,107,0,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Pill size={18} color={C.ctaBtn} strokeWidth={1.75} />
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:C.text }}>ויטמין להריון</div>
            <div style={{ fontSize:11, color:C.muted }}>על השיש, ליד מכונת הקפה — לא במגירה</div>
          </div>
        </div>
        <div style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:10, letterSpacing:0.8, textTransform:"uppercase" }}>טיפים חכמים</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {TIPS.map((tip, i) => (
            <div key={i} style={{ ...card, padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ width:38, height:38, borderRadius:11, flexShrink:0, background:C.bgSage, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <tip.Icon size={16} color={C.sageDeep} strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:3 }}>{tip.title}</div>
                <div style={{ fontSize:12, color:C.textMid, lineHeight:1.55 }}>{tip.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────
function DashboardScreen({ todayEntries, todayGlasses }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const todayTotal = Object.values(todayEntries).flat().reduce((s, e) => s + e.calories, 0);
  const allDays = [...HISTORY, { date:new Date(), label:"היום", calories:todayTotal, water:todayGlasses, meals:todayEntries, isToday:true }];
  const avg = Math.round(allDays.reduce((s, d) => s + d.calories, 0) / allDays.length);
  const daysOnTarget = allDays.filter(d => d.calories >= DAILY_TARGET*0.85 && d.calories <= DAILY_TARGET*1.1).length;
  const trend = (() => { const f = allDays.slice(0,3).reduce((s,d)=>s+d.calories,0)/3; const l = allDays.slice(-3).reduce((s,d)=>s+d.calories,0)/3; return l-f; })();
  const worstMeal = (() => { const t={breakfast:0,lunch:0,snack:0,dinner:0}; allDays.forEach(d=>Object.entries(d.meals).forEach(([k,items])=>{t[k]+=(items||[]).reduce((s,e)=>s+e.calories,0);})); return MEALS[Object.entries(t).sort((a,b)=>b[1]-a[1])[0][0]].label; })();
  const maxCal = Math.max(...allDays.map(d => d.calories), DAILY_TARGET * 1.2);
  const dayColor = cal => cal > DAILY_TARGET*1.1 ? C.danger : cal < DAILY_TARGET*0.75 ? C.warning : C.sage;

  return (
    <div style={{ background:C.bgSoft, minHeight:"100vh", paddingBottom:110 }}>
      <div style={{ background:C.bg, padding:"36px 22px 16px", borderBottom:`1px solid ${C.divider}` }}>
        <div style={{ fontSize:24, fontWeight:800, color:C.text, letterSpacing:-0.5, marginBottom:2 }}>דשבורד</div>
        <div style={{ fontSize:11, color:C.muted, letterSpacing:1.2, textTransform:"uppercase" }}>7 ימים אחרונים</div>
      </div>
      <div style={{ padding:"16px 22px 0" }}>
        <div style={{ background:`linear-gradient(135deg, ${C.sageDeep} 0%, ${C.sage} 100%)`, borderRadius:20, padding:20, marginBottom:12, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
          <div style={{ ...glassPanel, borderRadius:16, padding:"16px 14px 12px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:14 }}>מבט שבועי</div>
            <div style={{ display:"flex", alignItems:"flex-end", height:80, gap:5, position:"relative", marginBottom:8 }}>
              <div style={{ position:"absolute", left:0, right:0, bottom:`${(DAILY_TARGET/maxCal)*100}%`, borderTop:`1.5px dashed ${C.sage}`, zIndex:2, pointerEvents:"none" }}>
                <span style={{ position:"absolute", right:0, top:-14, fontSize:9, color:C.sageDeep, fontWeight:700, background:"rgba(255,255,255,0.85)", padding:"1px 4px", borderRadius:4 }}>יעד</span>
              </div>
              {allDays.map((d, i) => {
                const h = Math.max((d.calories/maxCal)*100, 4); const col = dayColor(d.calories);
                return (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, height:"100%", justifyContent:"flex-end" }}>
                    <div style={{ fontSize:8, color:C.muted, fontWeight: d.isToday ? 700 : 400 }}>{d.calories||"—"}</div>
                    <div style={{ width:"100%", height:`${h}%`, background: d.isToday ? col : `${col}66`, borderRadius:"4px 4px 2px 2px", border: d.isToday ? `1.5px solid ${col}` : "none", boxShadow: d.isToday ? `0 2px 8px ${col}55` : "none" }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", gap:5 }}>
              {allDays.map((d, i) => <div key={i} style={{ flex:1, textAlign:"center", fontSize:8, color: d.isToday ? C.sageDeep : C.muted, fontWeight: d.isToday ? 700 : 400 }}>{d.label}</div>)}
            </div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
          <div style={{ ...card, padding:"14px" }}><div style={{ fontSize:10, color:C.muted, marginBottom:4 }}>ממוצע יומי</div><div style={{ fontSize:22, fontWeight:800, color: avg > DAILY_TARGET ? C.danger : C.sageDeep, lineHeight:1 }}>{avg}</div><div style={{ fontSize:10, color:C.muted }}>קל׳ ליום</div></div>
          <div style={{ ...card, padding:"14px" }}><div style={{ fontSize:10, color:C.muted, marginBottom:4 }}>ימים ביעד</div><div style={{ fontSize:22, fontWeight:800, color:C.sageDeep, lineHeight:1 }}>{daysOnTarget}<span style={{ fontSize:11, fontWeight:400, color:C.muted }}>/7</span></div><div style={{ fontSize:10, color:C.muted }}>מתוך שבוע</div></div>
        </div>

        <div style={{ ...card, padding:"13px 16px", marginBottom:10, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:11, background: trend>50 ? "rgba(192,57,43,0.08)" : C.bgSage, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {trend > 50 ? <TrendingUp size={17} color={C.danger} strokeWidth={1.75}/> : <TrendingDown size={17} color={C.sage} strokeWidth={1.75}/>}
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:2 }}>מגמה שבועית</div>
            <div style={{ fontSize:11, color:C.textMid }}>{trend>50 ? `הצריכה עולה — ${Math.round(Math.abs(trend))} קל׳ יותר מתחילת השבוע` : `הצריכה יורדת — שיפור של ${Math.round(Math.abs(trend))} קל׳`}</div>
          </div>
        </div>

        <div style={{ ...card, padding:"13px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12, background:C.ctaPale, border:`1px solid ${C.ctaBorder}`, boxShadow:"none" }}>
          <div style={{ width:38, height:38, borderRadius:11, background:"rgba(201,107,0,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <AlertCircle size={17} color={C.ctaBtn} strokeWidth={1.75}/>
          </div>
          <div><div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:2 }}>ארוחה לשיפור</div><div style={{ fontSize:11, color:C.textMid }}>{worstMeal} — הארוחה הכבדה ביותר בממוצע</div></div>
        </div>

        <div style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:10, letterSpacing:0.8, textTransform:"uppercase" }}>היסטוריית ימים</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[...allDays].reverse().map((d, i) => {
            const isExpanded = expandedDay === i; const col = dayColor(d.calories); const p = Math.min((d.calories/DAILY_TARGET)*100,100);
            return (
              <div key={i} style={{ ...card, overflow:"hidden" }}>
                <button onClick={() => setExpandedDay(isExpanded ? null : i)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"13px 16px", display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:9, height:9, borderRadius:"50%", background:col, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:13, fontWeight: d.isToday ? 800 : 600, color:C.text }}>{d.label}</span>
                        {d.isToday && <span style={{ fontSize:9, background:C.bgSage, color:C.sageDeep, borderRadius:5, padding:"1px 6px", fontWeight:700, border:`1px solid rgba(122,158,110,0.3)` }}>עכשיו</span>}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:3 }}><Droplets size={11} color={d.water >= WATER_TARGET ? C.water : C.muted} strokeWidth={2}/><span style={{ fontSize:10, color: d.water >= WATER_TARGET ? C.water : C.muted }}>{d.water}/{WATER_TARGET}</span></div>
                        <span style={{ fontSize:14, fontWeight:700, color:col }}>{d.calories||"—"}</span>
                        {isExpanded ? <ChevronUp size={14} color={C.muted} strokeWidth={2}/> : <ChevronDown size={14} color={C.muted} strokeWidth={2}/>}
                      </div>
                    </div>
                    <div style={{ background:"#EBEBEB", borderRadius:3, height:4, overflow:"hidden" }}><div style={{ height:"100%", width:`${p}%`, background:col, borderRadius:3 }} /></div>
                  </div>
                </button>
                {isExpanded && (
                  <div style={{ padding:"0 16px 14px", animation:"slideDown 0.2s ease" }}>
                    <div style={{ height:1, background:C.divider, marginBottom:12 }} />
                    {Object.entries(MEALS).map(([key, m]) => {
                      const items = (d.meals[key]||[]); if (!items.length) return null;
                      const mTotal = items.reduce((s,e)=>s+e.calories,0);
                      return (
                        <div key={key} style={{ marginBottom:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                            <m.Icon size={12} color={C.sage} strokeWidth={2}/>
                            <span style={{ fontSize:11, fontWeight:700, color:C.text }}>{m.short}</span>
                            <span style={{ fontSize:11, color:C.muted, marginRight:"auto" }}>{mTotal} קל׳</span>
                          </div>
                          {items.map((item, j) => (
                            <div key={j} style={{ display:"flex", justifyContent:"space-between", paddingRight:18, marginBottom:3 }}>
                              <span style={{ fontSize:11, color:C.textMid }}>{item.name}</span>
                              <span style={{ fontSize:11, color:C.muted }}>{item.calories}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────
function NavBar({ screen, onNavigate }) {
  const tabs = [
    { key:"home",      label:"בית",    Icon:Home },
    { key:"diary",     label:"יומן",   Icon:BookOpen },
    { key:"dashboard", label:"דשבורד", Icon:BarChart2 },
    { key:"tips",      label:"טיפים",  Icon:Lightbulb },
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430,
      background:"rgba(255,255,255,0.82)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
      borderTop:`1px solid rgba(255,255,255,0.9)`, boxShadow:"0 -1px 0 rgba(0,0,0,0.06), 0 -8px 24px rgba(0,0,0,0.05)",
      display:"flex", justifyContent:"space-around", alignItems:"center", padding:"10px 0 18px", zIndex:100,
    }}>
      {tabs.map(({ key, label, Icon }) => {
        const active = screen === key;
        return (
          <button key={key} onClick={() => onNavigate(key)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"4px 16px", transition:"all 0.15s" }}>
            <div style={{ width:44, height:28, borderRadius:14, background: active ? C.bgSage : "transparent", border: active ? `1px solid rgba(122,158,110,0.3)` : "1px solid transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
              <Icon size={18} color={active ? C.sageDeep : "#ADADAD"} strokeWidth={active ? 2.1 : 1.75}/>
            </div>
            <span style={{ fontSize:10, fontWeight: active ? 700 : 400, color: active ? C.sageDeep : "#ADADAD" }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]       = useState("home");
  const [diaryMeal, setDiaryMeal] = useState("breakfast");
  const [glasses, setGlasses]     = useState(4);
  const [streak]                   = useState(3);
  const [entries, setEntries]      = useState({
    breakfast: [{ id:1, name:"נס קפה ללא סוכר", calories:5 }, { id:2, name:"3 אפיפיות עלית כשרות לפסח", calories:75 }],
    lunch:     [],
    snack:     [],
    dinner:    [],
  });

  const navigate = (s, meal) => { setScreen(s); if (meal) setDiaryMeal(meal); };

  return (
    <div dir="rtl" style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", background:C.bg, fontFamily:"'Segoe UI', Tahoma, sans-serif" }}>
      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);} }
        @keyframes popIn { 0%{transform:scale(0.85);opacity:0;} 60%{transform:scale(1.04);} 100%{transform:scale(1);opacity:1;} }
        @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1;} 100%{transform:translateY(250px) rotate(400deg);opacity:0;} }
        @keyframes typingBounce { 0%,60%,100%{transform:translateY(0);} 30%{transform:translateY(-5px);} }
        input::placeholder { color:#BBBBBB; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
        * { box-sizing:border-box; }
        button:active { transform:scale(0.97); }
      `}</style>
        <div style={{ height:"100vh", overflow: screen === "home" ? "hidden" : "auto" }}>
        {screen==="home"      && <HomeScreen      entries={entries} setEntries={setEntries} glasses={glasses} streak={streak} onNavigate={navigate}/>}
        {screen==="diary"     && <DiaryScreen     entries={entries} setEntries={setEntries} initialMeal={diaryMeal}/>}
        {screen==="dashboard" && <DashboardScreen todayEntries={entries} todayGlasses={glasses}/>}
        {screen==="tips"      && <TipsScreen      glasses={glasses} setGlasses={setGlasses}/>}
      </div>
      <NavBar screen={screen} onNavigate={navigate}/>
    </div>
  );
}
