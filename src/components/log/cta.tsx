"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import useMeasure from "react-use-measure";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  type Transition,
} from "framer-motion";
import { cn } from "@/lib/utils";
import useClickOutside from "@/hooks/useClickOutside";
import { ArrowClockwise } from "@phosphor-icons/react";
import { validateAndSaveEntry } from "@/app/(without-root-layout)/visitors/actions";
import Field from "./field";
import { useAtom, useSetAtom } from "jotai";
import {
  hasCreatedEntryBeforeAtom,
  localCreatedByIdAtom,
  localEntriesAtom,
} from "@/atoms/guestbook";

const transition: Transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.25,
};

export default function WriteNoteCTA() {
  const ASCII_CHARS = " .'`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
  const ASCII_CONTRAST = 1.5;
  const ASCII_GAMMA = 0.9;
  const ASCII_BRIGHTNESS = 6;

  const [step, setStep] = useState<number>(0);
  const [contentRef, { height: heightContent }] = useMeasure();
  const [menuRef, { width: widthContainer }] = useMeasure();
  const [maxWidth, setMaxWidth] = useState(0);
  const [formInfo, setFormInfo] = useState({
    created_by: "",
    entry: "",
    signature: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const setLocalEntries = useSetAtom(localEntriesAtom);
  const [hasCreatedEntryBefore, setHasCreatedEntryBefore] = useAtom(
    hasCreatedEntryBeforeAtom
  );
  const [localCreatedById, setLocalCreatedById] = useAtom(localCreatedByIdAtom);

  const buttonText = ["Write me a note", "Next", "Submit", "Thanks!"][step];

  const ref = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const asciiPreRef = useRef<HTMLPreElement>(null);
  const { pending } = useFormStatus();
  const [loading, setLoading] = useState(false);
  const [asciiPreview, setAsciiPreview] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [asciiGrid, setAsciiGrid] = useState({ width: 96, height: 54 });

  const handleCreatedByChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInfo({
      ...formInfo,
      created_by: e.target.value,
    });
  };

  const handleEntryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInfo({
      ...formInfo,
      entry: e.target.value,
    });
  };

  const convertVideoFrameToAscii = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = asciiGrid.width;
    const height = asciiGrid.height;

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      return "";
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return "";

    canvas.width = width;
    canvas.height = height;

    // Preserve proportions using "cover" behavior so ascii fills the whole box.
    const sourceAspect = video.videoWidth / video.videoHeight;
    const targetAspect = width / height;
    let sx = 0;
    let sy = 0;
    let sWidth = video.videoWidth;
    let sHeight = video.videoHeight;

    if (sourceAspect > targetAspect) {
      sWidth = video.videoHeight * targetAspect;
      sx = (video.videoWidth - sWidth) / 2;
    } else if (sourceAspect < targetAspect) {
      sHeight = video.videoWidth / targetAspect;
      sy = (video.videoHeight - sHeight) / 2;
    }

    context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, width, height);

    const { data } = context.getImageData(0, 0, width, height);
    let output = "";

    for (let y = 0; y < height; y += 1) {
      let row = "";
      for (let x = 0; x < width; x += 1) {
        // Mirror for a natural selfie preview.
        const mirroredX = width - x - 1;
        const idx = (y * width + mirroredX) * 4;
        const r = data[idx] ?? 0;
        const g = data[idx + 1] ?? 0;
        const b = data[idx + 2] ?? 0;
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const normalizedLuminance = luminance / 255;
        const contrastedLuminance = Math.min(
          1,
          Math.max(0, (normalizedLuminance - 0.5) * ASCII_CONTRAST + 0.5)
        );
        // Lift shadows slightly so contrast does not crush dark details.
        const gammaAdjustedLuminance = Math.pow(contrastedLuminance, ASCII_GAMMA);
        const adjustedLuminance = Math.min(
          255,
          Math.max(0, gammaAdjustedLuminance * 255 + ASCII_BRIGHTNESS)
        );
        const charIndex = Math.floor(
          (adjustedLuminance / 255) * (ASCII_CHARS.length - 1)
        );
        row += ASCII_CHARS[charIndex] ?? " ";
      }
      output += `${row}\n`;
    }

    return output.slice(0, -1);
  };

  const escapeXml = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");

  const asciiToSvg = (ascii: string) => {
    const lines = ascii.split("\n");
    const longestLine = Math.max(...lines.map((line) => line.length), 1);
    const fontSize = 6;
    const lineHeight = 6;
    const charWidth = 3.72;
    const horizontalPadding = 7;
    const verticalPadding = 3;
    // Include a small width buffer to avoid clipping on fallback monospace fonts.
    const widthBuffer = 2;
    const svgWidth = Math.ceil(
      longestLine * charWidth + horizontalPadding * 2 + widthBuffer
    );
    const svgHeight = Math.ceil(lines.length * lineHeight + verticalPadding * 2);

    const tspans = lines
      .map((line, index) => {
        const fixedWidthLine = line.padEnd(longestLine, " ").replaceAll(" ", "\u00A0");
        return `<tspan x="${horizontalPadding}" y="${
          verticalPadding + lineHeight * (index + 1)
        }">${escapeXml(fixedWidthLine)}</tspan>`;
      })
      .join("");

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" role="img" aria-label="ascii selfie"><rect width="100%" height="100%" fill="#000"/><text xml:space="preserve" fill="#fff" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace" font-size="${fontSize}" dominant-baseline="alphabetic">${tspans}</text></svg>`;
  };

  const handleASCIICapture = () => {
    const ascii = convertVideoFrameToAscii();
    if (!ascii) return "";
    const asciiSvg = asciiToSvg(ascii);

    setFormInfo((prev) => ({
      ...prev,
      signature: asciiSvg,
    }));
    return asciiSvg;
  };

  const stopCamera = () => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const stepConent = (
    step: number,
    videoElmRef: React.RefObject<HTMLVideoElement | null>
  ) => {
    switch (step) {
      case 1:
        return (
          <fieldset className="flex flex-col gap-y-4 p-2">
            <Field
              label="ur name, handle, something"
              value={formInfo.created_by}
              name="created_by"
              placeholder="john doe"
              onChange={handleCreatedByChange}
            />
            <Field
              label="a sweet note"
              value={formInfo.entry}
              name="entry"
              placeholder="xyz"
              onChange={handleEntryChange}
            />
          </fieldset>
        );
      case 2:
        return (
          <div className="relative flex flex-col overflow-hidden rounded-md border border-white/50 bg-black/25 p-2">
            <video ref={videoElmRef} className="hidden" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
            <pre
              ref={asciiPreRef}
              className="h-52 w-full overflow-hidden whitespace-pre rounded-[4px] border border-white/40 bg-black/80 p-0.5 font-mono text-[5px] leading-[5px] text-white"
            >
              {cameraError
                ? cameraError
                : asciiPreview || "initializing camera..."}
            </pre>
            <input type="hidden" value={formInfo.signature} />
            <button
              aria-label="retake ascii selfie"
              className="group absolute bottom-1 left-1 self-end rounded-[4px] border border-white/60 bg-black/30 p-1 font-medium text-white transition duration-200 hover:bg-black/45"
              type="button"
              onClick={() => {
                const ascii = convertVideoFrameToAscii();
                setAsciiPreview(ascii);
                setFormInfo((prev) => ({ ...prev, signature: "" }));
              }}
            >
              <ArrowClockwise className="group-hover:rotate-180 transition duration-200 " />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const validateStep = async (currentStep: number) => {
    setLoading(true);
    if (currentStep === 1) {
      const formData = new FormData();
      formData.append("created_by", formInfo.created_by);
      formData.append("entry", formInfo.entry);

      const result = await validateAndSaveEntry(formData, true);

      if (!result.success) {
        // @ts-ignore
        setErrors(result.errors);
        setLoading(false);
        return false;
      }
      setErrors(null);
      setLoading(false);
      return true;
    }
    setLoading(false);
    return true;
  };

  const handleClick = async () => {
    if (!localCreatedById) setLocalCreatedById(crypto.randomUUID());
    if (step === 3) {
      return;
    }

    if (!isOpen && step === 0) {
      setIsOpen(true);
      setStep(1);
      return;
    }

    if (!isOpen) {
      setIsOpen(true);
      return;
    }

    if (step === 1) {
      const isValid = await validateStep(step);
      if (!isValid) return;
    }

    if (step === 2) {
      setLoading(true);
      const s = handleASCIICapture();
      if (!s) {
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("local_entry_id", crypto.randomUUID());
      formData.append("created_by", formInfo.created_by);
      formData.append("entry", formInfo.entry);
      formData.append("signature", s);
      formData.append(
        "hasCreatedEntryBefore",
        hasCreatedEntryBefore.toString()
      );
      formData.append("local_created_by_id", localCreatedById);
      await handleSubmit(formData);
      return;
    }

    setStep((prev) => prev + 1);
  };

  const getRandomPosition = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const handleSubmit = async (formData: FormData) => {
    const result = await validateAndSaveEntry(formData);
    if (!result.success) {
      // @ts-ignore
      setErrors(result.errors);
      setLoading(false);
      return;
    }

    const newEntry = {
      id: crypto.randomUUID(),
      local_entry_id: formData.get("local_entry_id") as string,
      created_by: formData.get("created_by") as string,
      body: formData.get("entry") as string,
      signature: formData.get("signature") as string,
      initialX: getRandomPosition(100, window.innerWidth - 100),
      initialY: getRandomPosition(100, window.innerHeight - 100),
    };
    setLocalEntries((prev) => [newEntry, ...prev]);

    setStep(3);
    setIsOpen(false);
    setLoading(false);
    formRef.current?.reset();
    setHasCreatedEntryBefore(true);
  };

  useClickOutside(ref, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    const updateAsciiGrid = () => {
      const pre = asciiPreRef.current;
      if (!pre) return;

      const styles = window.getComputedStyle(pre);
      const fontSize = Number.parseFloat(styles.fontSize) || 5;
      const lineHeight = Number.parseFloat(styles.lineHeight) || fontSize;

      // Slightly oversample to better fill the preview box.
      const densityScale = 1.3;
      const charWidth = Math.max(1, fontSize * 0.62);
      const nextWidth = Math.max(
        42,
        Math.floor((pre.clientWidth / charWidth) * densityScale)
      );
      const nextHeight = Math.max(
        24,
        Math.floor((pre.clientHeight / lineHeight) * densityScale)
      );

      setAsciiGrid((prev) =>
        prev.width === nextWidth && prev.height === nextHeight
          ? prev
          : { width: nextWidth, height: nextHeight }
      );
    };

    if (!(step === 2 && isOpen)) return;

    updateAsciiGrid();
    const observer = new ResizeObserver(updateAsciiGrid);
    if (asciiPreRef.current) observer.observe(asciiPreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [step, isOpen]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        frameIntervalRef.current = setInterval(() => {
          const ascii = convertVideoFrameToAscii();
          if (ascii) setAsciiPreview(ascii);
        }, 125);
      } catch {
        setCameraError("camera unavailable — allow webcam access to take selfie");
      }
    };

    if (step === 2 && isOpen) {
      void startCamera();
      return;
    }

    stopCamera();
  }, [step, isOpen]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (!widthContainer || maxWidth > 0) return;
    setMaxWidth(widthContainer);
  }, [widthContainer, maxWidth]);

  return (
    <div className="absolute bottom-10 left-1/2 z-300 -translate-x-1/2">
      <div
        className={cn(
          "flex h-fit w-72 items-center justify-center gap-x-1.5 rounded-md border border-white/60 bg-black/20 text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition"
        )}
      >
        <MotionConfig transition={transition}>
          <div className="h-full w-full" ref={ref}>
            <form ref={formRef}>
              <div className="overflow-hidden w-full">
                <AnimatePresence initial={false} mode="sync">
                  {isOpen ? (
                    <motion.div
                      key="content"
                      initial={{ height: 0 }}
                      animate={{ height: heightContent || 0 }}
                      exit={{ height: 0 }}
                      style={{
                        width: maxWidth,
                      }}
                    >
                      <div ref={contentRef} className="w-full">
                        <motion.div
                          key={"notes"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isOpen ? 1 : 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <div
                            className={cn(
                              "px-2 pt-2 text-sm",
                              isOpen ? "block" : "hidden"
                            )}
                          >
                            <AnimatePresence>
                              {step === 1 && (
                                <motion.div
                                  className={cn(
                                    "absolute -top-18 left-0 w-full rounded-md border border-white/60 bg-black/30 px-4 py-2 text-center text-sm font-medium text-white shadow-lg transition",
                                    errors
                                      ? "ring-2 ring-[red]/60"
                                      : ""
                                  )}
                                  style={{
                                    textWrap: "balance",
                                  }}
                                  initial={{ opacity: 0, y: -20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{
                                    opacity: 0,
                                    y: -20,
                                    transition: {
                                      duration: 0.1,
                                    },
                                  }}
                                  transition={{
                                    type: "spring",
                                    duration: 0.05,
                                    bounce: 0.02,
                                    restDelta: 0.01,
                                  }}
                                >
                                  <AnimatePresence mode="wait" initial={false}>
                                    <motion.p
                                      key={
                                        errors?.created_by || errors?.entry
                                          ? "error"
                                          : "default"
                                      }
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      transition={{ duration: 0.05 }}
                                    >
                                      {errors?.created_by || errors?.entry
                                        ? errors?.created_by || errors?.entry
                                        : `ty for visiting! leave ur name and a note <3`}
                                    </motion.p>
                                  </AnimatePresence>
                                </motion.div>
                              )}
                              {step === 2 && (
                                <motion.div
                                  className="absolute -top-12 left-0 w-full rounded-md border border-white/60 bg-black/30 px-4 py-2 text-center text-sm font-medium text-white shadow-lg transition"
                                  style={{
                                    textWrap: "balance",
                                  }}
                                  initial={{ opacity: 0, y: -20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{
                                    opacity: 0,
                                    y: -20,
                                    transition: {
                                      duration: 0.1,
                                    },
                                  }}
                                >
                                  take an ascii selfie for your note!
                                </motion.div>
                              )}
                            </AnimatePresence>
                            {stepConent(step, videoRef)}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <button
                ref={menuRef}
                aria-label={"notes"}
                className={cn(
                  "relative flex w-full shrink-0 appearance-none items-center justify-center rounded-md border border-white/60 bg-black/20 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-black/30 focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98]",
                  loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                )}
                type="button"
                disabled={pending || loading}
                onClick={handleClick}
              >
                {isOpen || step === 3 ? buttonText : "write me a note"}
              </button>
            </form>
          </div>
        </MotionConfig>
      </div>
    </div>
  );
}
