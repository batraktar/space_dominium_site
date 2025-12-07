import { useEffect, useState, type FC, type CSSProperties } from "react";
import Papa from "papaparse";
import "./question.scss";

type FaqItem = { question: string; answer: string };

type Props = {
  sheetUrl: string;
  plusColor?: string;
  titleColor?: string;
};

const Question: FC<Props> = ({ sheetUrl, plusColor = "#0A0A60", titleColor = "#0A0A60" }) => {
  const [open, setOpen] = useState<number | null>(0);
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true); setErr(null);
        const res = await fetch(sheetUrl, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load FAQ (${res.status})`);
        const text = await res.text();
        
        const result = Papa.parse<string[]>(text, { 
          header: false, 
          skipEmptyLines: true 
        });
        
        const rows = result.data;
        if (rows.length > 1) {
          // Skip header row
          const [, ...data] = rows;
          setItems(
            data
              .map(r => ({ question: r[0] ?? "", answer: r[1] ?? "" }))
              .filter(x => x.question && x.answer)
          );
        } else {
          setItems([]);
        }

      } catch (e: any) {
        if (e?.name !== "AbortError") setErr(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [sheetUrl]);

  const rootStyle: CSSProperties = {
    ["--faq-plus" as any]: plusColor,
    ["--faq-title" as any]: titleColor,
  };

  return (
    <section className="question" style={rootStyle}>
      <div className="ques_wrapper">
        <h2 className="ques_title" style={{ color: "var(--faq-title)" }}>
          Актуальні питання
        </h2>

        {loading && <p>Завантажуємо питання…</p>}
        {err && <p>Не вдалося завантажити FAQ: {err}</p>}

        {!loading && !err && items.map((item, idx) => {
          const isActive = open === idx;
          const answerId = `ans-${idx}`;
          return (
            <div key={idx} className={`faq_item ${isActive ? "active" : ""}`}>
              <button
                className="faq_question"
                onClick={() => setOpen(p => (p === idx ? null : idx))}
                aria-expanded={isActive}
                aria-controls={answerId}
                type="button"
              >
                {item.question}
                <span className="faq_icon" style={{ color: "var(--faq-plus)" }}>
                  <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1v16M1 9h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div id={answerId} className="faq_answer">
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Question;