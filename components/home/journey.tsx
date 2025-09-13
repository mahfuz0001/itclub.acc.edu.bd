"use client";

import { JOURNEY_DATA } from "@/constants/home-content";
import { Separator } from "../ui/separator";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function Journey() {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      ref={containerRef}
      className="relative py-20 bg-background overflow-hidden"
      id="journey"
    >
      {/* Soft Background Glow */}
      <motion.div
        className="absolute inset-0 blur-3xl opacity-10"
        style={{
          background:
            "radial-gradient(circle at center, #74bf45 0%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        transition={{ duration: 1.2 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl drop-shadow-[0_0_12px_#74bf45aa]">
            Our Journey
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The story of our club from its inception to the present day
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical Line with Glow */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#74bf45]/30 shadow-[0_0_15px_#74bf45aa] hidden sm:block"
            style={{ scaleY: scaleX }}
          />

          {JOURNEY_DATA.milestones.map((event, index) => (
            <TimelineEvent
              key={event.title}
              event={event}
              index={index}
              isExpanded={expandedEvent === index}
              onToggle={() =>
                setExpandedEvent(expandedEvent === index ? null : index)
              }
            />
          ))}
        </div>
      </div>
      <Separator className="my-12" />
    </section>
  );
}

function TimelineEvent({
  event,
  index,
  isExpanded,
  onToggle,
}: {
  event: (typeof JOURNEY_DATA.milestones)[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={`mb-8 flex flex-col sm:flex-row justify-between items-center w-full ${
        index % 2 === 0 ? "sm:flex-row-reverse" : ""
      }`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      {/* Spacer for larger screens */}
      <div className="hidden sm:block sm:w-[41.66%] lg:w-5/12" />

      {/* Timeline Dot with Glow */}
      <div className="z-20 flex items-center justify-center w-8 h-8 bg-[#74bf45] shadow-[0_0_10px_#74bf45aa] rounded-full">
        <div className="w-3 h-3 bg-background rounded-full" />
      </div>

      {/* Event Card */}
      <motion.div
        className="w-full sm:w-5/12 mt-4 sm:mt-0 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
      >
        <div className="p-4 bg-background rounded-lg border border-primary/10 shadow-md hover:shadow-[0_0_20px_#74bf45aa] transition-shadow duration-300">
          <span className="font-bold text-primary">{event.year}</span>
          <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
          <p className="text-muted-foreground">{event.description}</p>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-sm text-muted-foreground">
              {event.details}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
