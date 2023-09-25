"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    // within Crisp: Settings > Website Settings > Setup Instructions: Website ID
    Crisp.configure("ce4eb269-656a-4846-8ebb-2f61281ba75f");
  }, []);

  return null;
};
