"use client";

import React from "react";
import { Svg, Path, G, Defs, ClipPath, Rect } from "@react-pdf/renderer";

import { resumeConfig } from "@/config/resume";

export const HeaderDecoration = () => (
  <Svg height={150} viewBox="0 0 150 150" width={150}>
    <Defs>
      <ClipPath id="clip-path">
        <Rect height={150} width={150} />
      </ClipPath>
    </Defs>
    <G clipPath="url(#clip-path)">
      <Path
        d="M150,0 L150,150 L0,150 Z"
        fill={resumeConfig.pdfStyle.primaryColor}
        opacity={0.1}
      />
      <Path
        d="M150,0 L150,120 L30,150 Z"
        fill={resumeConfig.pdfStyle.secondaryColor}
        opacity={0.08}
      />
      <Path
        d="M150,0 L150,90 L60,150 Z"
        fill={resumeConfig.pdfStyle.primaryColor}
        opacity={0.05}
      />
    </G>
  </Svg>
);

export const FooterDecoration = () => (
  <Svg height={70} viewBox="0 0 200 70" width={200}>
    <Defs>
      <ClipPath id="clip-path-footer">
        <Rect height={70} width={200} />
      </ClipPath>
    </Defs>
    <G clipPath="url(#clip-path-footer)">
      <Path
        d="M0,70 L200,70 L0,0 Z"
        fill={resumeConfig.pdfStyle.primaryColor}
        opacity={0.1}
      />
      <Path
        d="M0,70 L170,70 L0,30 Z"
        fill={resumeConfig.pdfStyle.secondaryColor}
        opacity={0.08}
      />
      <Path
        d="M0,70 L140,70 L0,50 Z"
        fill={resumeConfig.pdfStyle.primaryColor}
        opacity={0.05}
      />
    </G>
  </Svg>
);

export const CirclePattern = () => (
  <Svg height={40} viewBox="0 0 40 40" width={40}>
    <G>
      <Path
        d="M20,40 C31.046,40 40,31.046 40,20 C40,8.954 31.046,0 20,0 C8.954,0 0,8.954 0,20 C0,31.046 8.954,40 20,40 Z M20,30 C25.523,30 30,25.523 30,20 C30,14.477 25.523,10 20,10 C14.477,10 10,14.477 10,20 C10,25.523 14.477,30 20,30 Z"
        fill={resumeConfig.pdfStyle.secondaryColor}
        opacity={0.07}
      />
    </G>
  </Svg>
);

export const LinkedinSvg = () => (
  <Svg height={12} viewBox="0 0 24 24" width={12}>
    <Path
      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
      fill={resumeConfig.pdfStyle.secondaryColor}
    />
  </Svg>
);

export const GitlabSvg = () => (
  <Svg height={12} viewBox="0 0 24 24" width={12}>
    <Path
      d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"
      fill={resumeConfig.pdfStyle.secondaryColor}
    />
  </Svg>
);

export const EmailSvg = () => (
  <Svg height={12} viewBox="0 0 24 24" width={12}>
    <Path
      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
      fill={resumeConfig.pdfStyle.secondaryColor}
    />
  </Svg>
);

export const PhoneSvg = () => (
  <Svg height={12} viewBox="0 0 24 24" width={12}>
    <Path
      d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
      fill={resumeConfig.pdfStyle.secondaryColor}
    />
  </Svg>
);
