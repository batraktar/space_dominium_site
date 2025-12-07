import React, { useEffect, useRef, useState } from "react";
import styles from "./floating-shapes.module.scss";

type Shape = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "chevron" | "bracket";
  rotation: number;
  size: number;
};

const FloatingShapes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Initialize shapes
    const initialShapes: Shape[] = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80, // percent
      y: Math.random() * 80, // percent
      vx: (Math.random() - 0.5) * 0.15, // velocity
      vy: (Math.random() - 0.5) * 0.15,
      type: Math.random() > 0.5 ? "chevron" : "bracket",
      rotation: Math.floor(Math.random() * 4) * 90,
      size: 40 + Math.random() * 20,
    }));
    setShapes(initialShapes);
  }, []);

  useEffect(() => {
    const animate = () => {
      setShapes((prevShapes) =>
        prevShapes.map((shape) => {
          let { x, y, vx, vy } = shape;

          x += vx;
          y += vy;

          // Bounce logic (using percentage 0-100)
          if (x <= 0 || x >= 95) vx = -vx;
          if (y <= 0 || y >= 95) vy = -vy;

          return { ...shape, x, y, vx, vy };
        })
      );
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <div className={styles.floating_container} ref={containerRef}>
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={styles.shape}
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            transform: `rotate(${shape.rotation}deg)`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
          }}
        >
          {shape.type === "chevron" ? (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="#CBD83B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4H20V20" stroke="#CBD83B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

export default FloatingShapes;
