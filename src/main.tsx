import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  Flower2,
  RotateCcw,
  Printer,
  Download,
  Check,
  CreditCard,
  Info,
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./style.css";
const defaultMessages = [
  "A little reminder: You are worthy of care.",
  "Taking care of yourself matters.",
  "You showed up for yourself today.",
  "Today is a day for kindness and serenity.",
];
const initial = defaultMessages[0];
const styles = [
  {
    name: "California Poppy",
    desc: "Golden petals · driftwood",
    asset: "poppy",
    scientific: "Eschscholzia californica",
  },
  {
    name: "Dune Lupine",
    desc: "Lavender spires · seaweed",
    asset: "lupine",
    scientific: "Lupinus chamissonis",
  },
  {
    name: "Seaside Daisy",
    desc: "Soft lavender · driftwood",
    asset: "daisy",
    scientific: "Erigeron glaucus",
  },
  {
    name: "Sea-cliff Buckwheat",
    desc: "Cream & blush · seaweed",
    asset: "buckwheat",
    scientific: "Eriogonum parvifolium",
  },
];
// Reverse columns on the back sheet to align labels during duplex printing.
const sheetIndices = (back: boolean) => (back ? [1, 0, 3, 2] : [0, 1, 2, 3]);
function Botanicals({
  style = 0,
  thumbnail = false,
}: {
  style?: number;
  thumbnail?: boolean;
}) {
  if (thumbnail)
    return (
      <div className="motif-thumbnail" aria-hidden="true">
        <img src={`/art/${styles[style].asset}.png`} />
      </div>
    );
  return (
    <div className="botanicals" aria-hidden="true">
      <img
        className="sweeping-corner corner-upper"
        src={`/art/${styles[style].asset}-corner.png`}
      />
      <img
        className="sweeping-corner corner-lower"
        src={`/art/${styles[style].asset}-corner.png`}
      />
    </div>
  );
}
function Card({
  main,
  style,
  back,
  personal,
  heading,
  singlePage,
}: {
  main: string;
  style: number;
  back: boolean;
  personal: boolean;
  heading: string;
  singlePage: boolean;
}) {
  return (
    <div className={"card " + (back ? "card-back" : "") + (singlePage ? " card-single-page" : "")}>
      {!back && <Botanicals style={style} />}
      {back ? (
        <div className="back-content">
          <p className="with-care">With care,</p>
          <img
            className="rotary-logo"
            src="/NCRotaryLogo.png"
            alt="Rotary Club of Newport Coast"
          />
        </div>
      ) : (
        <div className="card-content">
          {personal && <div className="personal-heading">{heading}</div>}
          <div
            className={
              "affirmation " +
              (main.length > 140 ? "very-long" : main.length > 90 ? "long" : "")
            }
          >
            {main}
          </div>
        </div>
      )}
      {singlePage && (
        <div className="single-page-signoff">
          <img className="rotary-logo" src="/NCRotaryLogo.png" alt="Rotary Club of Newport Coast" />
        </div>
      )}
    </div>
  );
}
function App() {
  const [main, setMain] = useState(initial),
    [style, setStyle] = useState(0),
    [back, setBack] = useState(false),
    [singlePage, setSinglePage] = useState(true),
    [portrait, setPortrait] = useState(true),
    [personal, setPersonal] = useState(false),
    [heading, setHeading] = useState("A little something for you"),
    [guides, setGuides] = useState(true),
    [mix, setMix] = useState(true),
    [messages, setMessages] = useState([...defaultMessages]),
    [cardStyles, setCardStyles] = useState([0, 1, 2, 3]),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState(""),
    [activeCard, setActiveCard] = useState(0);
  const exportRef = useRef<HTMLDivElement>(null);
  const reset = () => {
    setMain(initial);
    setStyle(0);
    setCardStyles([0, 1, 2, 3]);
    setBack(false);
    setSinglePage(true);
    setPortrait(true);
    setPersonal(false);
    setHeading("A little something for you");
    setGuides(true);
    setMix(true);
    setActiveCard(0);
    setMessages([...defaultMessages]);
    setStatus("Original design restored.");
  };
  const card = (index = 0, isBack = back) => (
    <Card
      main={mix ? messages[index] : main}
      style={mix ? cardStyles[index] : style}
      back={!singlePage && isBack}
      singlePage={singlePage}
      personal={personal}
      heading={heading}
    />
  );
  const download = async () => {
    setBusy(true);
    setStatus("Preparing your PDF…");
    try {
      await document.fonts.ready;
      const orientation = portrait ? "portrait" : "landscape";
      const pdf = new jsPDF({
        orientation,
        unit: "in",
        format: "letter",
        compress: true,
      });
      const nodes =
        exportRef.current!.querySelectorAll<HTMLElement>(".export-page");
      for (let i = 0; i < nodes.length; i++) {
        const canvas = await html2canvas(nodes[i], {
          scale: 3,
          backgroundColor: null,
          useCORS: true,
        });
        if (i) pdf.addPage("letter", orientation);
        pdf.addImage(
          // Preserve transparency and print resolution with lossless compression.
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          0,
          portrait ? 8.5 : 11,
          portrait ? 11 : 8.5,
          undefined,
          "SLOW",
        );
      }
      pdf.save("a-little-care-cards.pdf");
      setStatus(singlePage ? "Downloaded! One-sided cards on one page." : "Downloaded! Fronts on page 1, backs on page 2.");
    } catch {
      setStatus("PDF could not be created. Use Print and choose Save as PDF.");
    } finally {
      setBusy(false);
    }
  };
  const selectedStyle = mix ? cardStyles[activeCard] : style;
  const updateStyle = (value: number) => {
    if (mix)
      setCardStyles((prev) =>
        prev.map((v, i) => (i === activeCard ? value : v)),
      );
    else setStyle(value);
    setBack(false);
  };
  const updateMessage = (value: string) =>
    mix
      ? setMessages((prev) =>
          prev.map((v, i) => (i === activeCard ? value : v)),
        )
      : setMain(value);
  return (
    <div className={portrait ? "app portrait" : "app landscape"}>
      <style>{`@page { size: letter ${portrait ? "portrait" : "landscape"}; margin: 0; }`}</style>
      <main>
        <div className="intro">
          <div>
            <h1>
              <Flower2 size={27} /> A Little Care <span>THE CARD STUDIO</span>
            </h1>
            <p>
              Choose a message, make it your own, and print a little kindness.
            </p>
          </div>
          <button className="reset" onClick={reset}>
            <RotateCcw size={14} /> Reset design
          </button>
        </div>
        <div className="studio">
          <aside className="customize panel">
            <div className="panel-title">
              <h2>Make it your own</h2>
              <span>01</span>
            </div>
            <label className="field-label sheet-mode-label" htmlFor="layout">
              Messages on your sheet
            </label>
            <select
              id="layout"
              value={mix ? "mix" : "same"}
              onChange={(e) => {
                if (e.target.value === "same") {
                  setMain(messages[activeCard]);
                  setStyle(cardStyles[activeCard]);
                }
                setMix(e.target.value === "mix");
                setBack(false);
              }}
            >
              <option value="same">Same card × 4</option>
              <option value="mix">Four different cards</option>
            </select>
            {mix && (
              <div className="card-selector">
                <span>Edit card</span>
                {[0, 1, 2, 3].map((i) => (
                  <button
                    className={activeCard === i ? "on" : ""}
                    key={i}
                    onClick={() => {
                      setActiveCard(i);
                      setBack(false);
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
            <label className="field-label" htmlFor="main">
              Main message
            </label>
            <textarea
              id="main"
              value={mix ? messages[activeCard] : main}
              onChange={(e) => updateMessage(e.target.value)}
              maxLength={180}
              rows={3}
            />
            <div className="character">
              {(mix ? messages[activeCard] : main).length}/180{" "}
              <span>40–90 characters is ideal</span>
            </div>
            <div className="field-label motif-label">Choose your motif</div>
            <div className="design-grid">
              {styles.map((s, i) => (
                <button
                  className={
                    "design " + (selectedStyle === i ? "selected" : "")
                  }
                  onClick={() => updateStyle(i)}
                  key={s.name}
                >
                  <div className="design-art">
                    <Botanicals style={i} thumbnail />
                    {selectedStyle === i && (
                      <span className="selected-check">
                        <Check size={13} />
                      </span>
                    )}
                  </div>
                  <strong>{s.name}</strong>
                  <span>{s.desc}</span>
                </button>
              ))}
            </div>
            <div className="personal-row">
              <label htmlFor="personal">Add a personal heading</label>
              <input
                id="personal"
                type="checkbox"
                className="switch"
                checked={personal}
                onChange={(e) => setPersonal(e.target.checked)}
              />
            </div>
            {personal && (
              <input
                aria-label="Personal heading"
                value={heading}
                maxLength={60}
                onChange={(e) => setHeading(e.target.value)}
              />
            )}
          </aside>
          <section className="preview-area">
            <div className="preview-toolbar">
              <span>
                <span className="live-dot" /> LIVE PREVIEW
              </span>
              <div className="segments" hidden={singlePage}>
                <button
                  className={!back ? "on" : ""}
                  onClick={() => setBack(false)}
                >
                  Front
                </button>
                <button
                  className={back ? "on" : ""}
                  onClick={() => setBack(true)}
                >
                  Back
                </button>
              </div>
            </div>
            <div className="preview-stage sheet-stage">
              <div className="preview-paper-space">
                <div className={"preview-sheet " + (guides ? "cut-guides" : "")}>
                  {sheetIndices(!singlePage && back).map((i) => (
                    <React.Fragment key={i}>{card(i)}</React.Fragment>
                  ))}
                </div>
              </div>
              <div className="dimension">
                US Letter · {portrait ? "8.5 × 11" : "11 × 8.5"} in
              </div>
            </div>
            <div className="preview-bottom">
              <span><Check size={13} /> Changes appear instantly</span>
            </div>
          </section>
          <aside className="print-panel panel">
            <div className="panel-title">
              <h2>Print a little kindness</h2>
              <span>02</span>
            </div>
            <label className="field-label" htmlFor="print-format">Print format</label>
            <select id="print-format" value={singlePage ? "single" : "duplex"} onChange={(e) => {
              setSinglePage(e.target.value === "single");
              setBack(false);
            }}>
              <option value="duplex">Two-sided · fronts + backs</option>
              <option value="single">Single page · one-sided</option>
            </select>
            <label className="field-label">Card orientation</label>
            <div className="segments orientation">
              <button
                className={!portrait ? "on" : ""}
                onClick={() => setPortrait(false)}
              >
                <CreditCard size={17} /> Landscape
              </button>
              <button
                className={portrait ? "on" : ""}
                onClick={() => setPortrait(true)}
              >
                <CreditCard size={17} className="portrait-icon" /> Portrait
              </button>
            </div>
            <div className="print-spec">
              <span>Card size</span>
              <strong>{portrait ? "4.25 × 5.5" : "5.5 × 4.25"} in</strong>
            </div>
            <div className="print-spec">
              <span>Paper</span>
              <strong>US Letter · {portrait ? "portrait" : "landscape"}</strong>
            </div>
            <div className="print-spec">
              <span>Cards per sheet</span>
              <strong>4 · 2 × 2</strong>
            </div>
            <div className="section-rule" />
            <label className="guide-row">
              <input
                type="checkbox"
                checked={guides}
                onChange={(e) => setGuides(e.target.checked)}
              />{" "}
              Show subtle cut guides
            </label>
            <div className="print-actions">
              <button className="primary" onClick={() => window.print()}>
                <Printer size={18} /> Print
              </button>
              <button className="secondary" disabled={busy} onClick={download}>
                <Download size={17} />
                {busy ? "Preparing PDF…" : "Download PDF"}
              </button>
              <p className="print-tip">
                <Info size={15} />
                <span>
                  Select <strong>Actual Size / 100%</strong> in printer
                  settings. Turn off headers and footers.
                </span>
              </p>
              <p className="pdf-note">
                {singlePage ? "Print and PDF include one page. Print one-sided." : <>
                  Print and PDF include fronts + backs.<br />
                  {portrait ? "Long-edge" : "Short-edge"} duplex, or print each side separately.
                </>}
              </p>
              <div role="status" className="status">
                {status}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <div className="print-only">
        {(singlePage ? [false] : [false, true]).map((b) => (
          <div
            className={"print-page " + (guides ? "cut-guides" : "")}
            key={String(b)}
          >
            {sheetIndices(b).map((i) => (
              <React.Fragment key={i}>{card(i, b)}</React.Fragment>
            ))}
          </div>
        ))}
      </div>
      <div className="export-container" ref={exportRef}>
        {(singlePage ? [false] : [false, true]).map((b) => (
          <div
            className={"export-page " + (guides ? "cut-guides" : "")}
            key={String(b)}
          >
            {sheetIndices(b).map((i) => (
              <React.Fragment key={i}>{card(i, b)}</React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
