"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 0.5, className = "" }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.215, 0.61, 0.355, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = "left",
  className = "",
}: AnimationProps & { direction?: "left" | "right" }) {
  const xVal = direction === "left" ? -40 : 40;
  return (
    <motion.div
      initial={{ opacity: 0, x: xVal }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration, delay, ease: [0.215, 0.61, 0.355, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, duration = 0.4, className = "" }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: [0.215, 0.61, 0.355, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


export function HoverScale({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`h-full w-full cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function HoverImage({ src, alt, className = "" }: { src: string, alt: string, className?: string }) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileHover="hover"
      initial="initial"
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.1 }
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </motion.div>
  );
}

export function HoverBadge({ children, className = "", hoverColor = "#dbeafe" }: { children: React.ReactNode, className?: string, hoverColor?: string }) {
  return (
    <motion.span
      whileHover={{ scale: 1.1, backgroundColor: hoverColor }}
      className={`${className} cursor-default`}
    >
      {children}
    </motion.span>
  );
}

export function HoverStar({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.span
      whileHover={{ scale: 1.2, rotate: 15 }}
      className={`${className} cursor-default inline-block`}
    >
      {children}
    </motion.span>
  );
}

export function HoverPrice({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.span
      whileHover={{ scale: 1.05, color: "#2563eb" }}
      className={`${className} cursor-default inline-block`}
    >
      {children}
    </motion.span>
  );
}

export function HoverLink({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      whileHover={{ x: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
