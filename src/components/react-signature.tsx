"use client";
import { cn } from "@/lib/utils";
import Signature, { type SignatureRef } from "@uiw/react-signature";
import { CheckIcon, Eraser, RefreshCcwIcon } from "lucide-react";
import { type ComponentProps, useRef, useState } from "react";

export function ReactSignature({
  className,
  onDownload,
  label,
  ...props
}: ComponentProps<typeof Signature> & {
  onDownload?: (url: string | null) => void;
  label: string;
}) {
  const [readonly, setReadonly] = useState(false);
  const $svg = useRef<SignatureRef>(null);

  async function getSignatureDataUrl(
    svgElement: SVGSVGElement | null | undefined
  ): Promise<string | null> {
    if (!svgElement) return null;

    return new Promise((resolve) => {
      const { svgelm, clientWidth, clientHeight } =
        prepareSvgElement(svgElement);

      const data = new XMLSerializer().serializeToString(svgelm);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = clientWidth ?? 0;
        canvas.height = clientHeight ?? 0;
        ctx?.drawImage(img, 0, 0);
        const url = canvas.toDataURL("image/png");
        resolve(url);
      };

      img.onerror = () => resolve(null);

      img.src = `data:image/svg+xml;base64,${window.btoa(
        decodeURIComponent(encodeURIComponent(data))
      )}`;
    });
  }

  const handleClear = () => {
    $svg.current?.clear();
    if (onDownload) {
      onDownload(null);
    }
  };

  const handleValidate = async () => {
    if (readonly) {
      $svg.current?.clear();
      setReadonly(false);
      if (onDownload) {
        onDownload(null);
      }
    } else {
      setReadonly(true);
      if (onDownload && $svg.current?.svg) {
        const dataUrl = await getSignatureDataUrl($svg.current.svg);
        if (dataUrl) {
          onDownload(dataUrl);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[error=true]:text-destructive">
        {label}
      </p>
      <Signature
        className={cn(
          "h-28 w-80 rounded-lg border border-neutral-500/20 bg-neutral-500/10",
          readonly
            ? "cursor-not-allowed fill-neutral-500"
            : "fill-neutral-800 dark:fill-neutral-200",
          className
        )}
        options={{
          smoothing: 0,
          streamline: 0.8,
          thinning: 0.7,
        }}
        readonly={readonly}
        {...props}
        ref={$svg}
      />
      <div className="flex gap-1 text-neutral-700 dark:text-neutral-200">
        <ValidateButton onClick={handleValidate} readonly={readonly} />

        {!readonly && <ClearButton onClick={handleClear} />}
      </div>
    </div>
  );
}

function prepareSvgElement(svgElement: SVGSVGElement) {
  const svgelm = svgElement.cloneNode(true) as SVGSVGElement;
  const clientWidth = svgElement.clientWidth;
  const clientHeight = svgElement.clientHeight;
  svgelm.removeAttribute("style");
  svgelm.setAttribute("width", `${clientWidth}px`);
  svgelm.setAttribute("height", `${clientHeight}px`);
  svgelm.setAttribute("viewBox", `0 0 ${clientWidth} ${clientHeight}`);
  return { svgelm, clientWidth, clientHeight };
}

function ValidateButton({
  readonly,
  onClick,
}: Readonly<{
  readonly: boolean;
  onClick: () => void;
}>) {
  return (
    <button
      className="inline-grid size-8 place-content-center rounded-md border border-neutral-500/10 bg-neutral-500/10 hover:bg-neutral-500/20"
      onClick={onClick}
      type="button"
    >
      {readonly ? (
        <>
          <RefreshCcwIcon className="size-5" />
          <span className="sr-only">Reset</span>
        </>
      ) : (
        <>
          <CheckIcon className="size-5" />
          <span className="sr-only">Validate</span>
        </>
      )}
    </button>
  );
}

function ClearButton({ onClick }: Readonly<{ onClick: () => void }>) {
  return (
    <button
      className="inline-grid size-8 place-content-center rounded-md border border-neutral-500/10 bg-neutral-500/10 hover:bg-neutral-500/20"
      onClick={onClick}
      type="button"
    >
      <Eraser className="size-5" />
      <span className="sr-only">Clear</span>
    </button>
  );
}
