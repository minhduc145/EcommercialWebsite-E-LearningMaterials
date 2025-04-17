"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamic import chỉ chạy ở client
const EasyMDEEditor = dynamic(() => import("@/components/EasyMDEditor"), {
  ssr: false,
});

export default function EditorPage() {
  const [value, setValue] = useState<string>("");

  return (
    <div>
      <EasyMDEEditor
        value={value}
        onChange={(val: string) => setValue(val)}
      />
    </div>
  );
}
