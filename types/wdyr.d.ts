// types/wdyr.d.ts
import React from 'react';

declare module '@welldone-software/why-did-you-render' {
  interface WDYRConfig {
    trackAllPureComponents?: boolean;
    trackHooks?: boolean;
    trackExtraHooks?: Array<[object, string]>;
    logOnDifferentValues?: boolean;
    collapseGroups?: boolean;
  }

  const whyDidYouRender: (
    react: typeof React,
    config?: WDYRConfig
  ) => void;

  export = whyDidYouRender;
}

// 扩展 React 组件类型
declare module 'react' {
  interface FunctionComponent<P = {}> {
    whyDidYouRender?: boolean | {
      trackHooks?: boolean;
      trackAllPureComponents?: boolean;
      trackExtraHooks?: Array<[object, string]>;
      logOnDifferentValues?: boolean;
      collapseGroups?: boolean;
    };
  }
}