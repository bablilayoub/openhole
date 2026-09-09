"use client";

import { motion, useReducedMotion } from "motion/react";
import { BrowserWindow } from "@/components/BrowserWindow";
import { TerminalWindow } from "@/components/TerminalWindow";
import { Glow } from "@/components/ui/Glow";
import { demoPort, demoUrl, firstRun, sessionLog, webhookEvents } from "@/lib/fixtures";
import { cliVersion } from "@/lib/site";

const host = demoUrl.replace(/^https?:\/\//, "");

export function ProductStage() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mt-16 pb-24 sm:mt-20 [perspective:1800px]">
      <Glow className="left-1/2 top-4 h-[28rem] w-[64rem] -translate-x-1/2 blur-3xl" />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 48, rotateX: 16 }}
        animate={{ opacity: 1, y: 0, rotateX: 5 }}
        transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="page-container relative origin-top"
        style={{ transformStyle: "preserve-3d" }}
      >
        <TerminalWindow
          command={firstRun}
          version={cliVersion}
          url={demoUrl}
          port={demoPort}
          log={sessionLog}
          className="mx-auto w-full max-w-4xl"
        />

        <BrowserWindow
          host={host}
          events={webhookEvents}
          className="absolute -bottom-14 right-5 hidden w-[42%] max-w-[26rem] md:block lg:right-20"
        />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent"
        aria-hidden
      />
    </div>
  );
}
