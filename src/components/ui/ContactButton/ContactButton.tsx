import React from "react";
import "./contact-button.scss";

type Pos = "bottom-right" | "bottom-left" | "top-right" | "top-left";

interface ContactButtonProps {
  show?: boolean;
  text?: string;
  href?: string;
  onClick?: () => void;
  position?: Pos;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ContactButton: React.FC<ContactButtonProps> = ({
  show = true,
  text = "Зв’язатись ♡",
  href,
  onClick,
  position = "bottom-right",
  bgColor = "#A88AED",
  textColor = "#000000",
  borderColor = "#0A0A60",
  className = "",
  style,
}) => {
  if (!show) return null;

  const baseStyle: React.CSSProperties = {
    ["--cb-bg" as any]: bgColor,
    ["--cb-text" as any]: textColor,
    ["--cb-border" as any]: borderColor,
    ...style,
  };

  const cls = `contact-btn contact-btn--${position} ${className}`.trim();
  
  return href ? (
    <a className={cls} href={href} style={baseStyle}>
      {text}
    </a>
  ) : (
    <button className={cls} onClick={onClick} style={baseStyle} type="button">
      {text}
    </button>
  );
};

export default ContactButton;
