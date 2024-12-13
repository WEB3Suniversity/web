import React from "react";

if (process.env.NODE_ENV === "development") {
  if (typeof window !== "undefined") {
    const whyDidYouRender = require("@welldone-software/why-did-you-render");

    // 使用正确的类型
    whyDidYouRender(React, {
      trackAllPureComponents: true,
      trackHooks: true,
      logOnDifferentValues: true,
      collapseGroups: true,
    });
  }
}

export {};
