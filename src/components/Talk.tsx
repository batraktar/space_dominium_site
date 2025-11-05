import React from "react";
import "./talk.scss";

type TalkProps = {
  text: React.ReactNode;
  ctaLabel: string;

  /** опціональні параметри, які можна міняти при вставці */
  gradient?: string;
  textColor?: string;
  btnTextSizePx?: number;
  btnTextColor?: string;
  btnBg?: string;
};

export default function Talk({
  text,
  ctaLabel,
  gradient,
  textColor,
  btnTextSizePx,
  btnTextColor,
  btnBg,
}: TalkProps) {
  const style: React.CSSProperties = {
    ...(gradient ? { ["--talk-bg" as any]: gradient } : null),
    ...(textColor ? { ["--talk-text-color" as any]: textColor } : null),
    ...(btnTextSizePx ? { ["--talk-btn-size" as any]: `${btnTextSizePx}px` } : null),
    ...(btnTextColor ? { ["--talk-btn-color" as any]: btnTextColor } : null),
    ...(btnBg ? { ["--talk-btn-bg" as any]: btnBg } : null),
  };

  return (
    <div className="talk-container">
      <div className="talk-body" style={style}>
        <p className="talk-text">{text}</p>
        <button className="talk-btn">{ctaLabel}</button>
      </div>
    </div>
  );
}

