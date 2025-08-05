"use client";

import React from "react";
import { TitleProps } from "@refinedev/core";

export const CustomTitle: React.FC<TitleProps> = ({ collapsed }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span style={{ fontSize: "18px" }}>🏢</span>
      {!collapsed && <span>Metiokulto 管理后台</span>}
    </div>
  );
};
