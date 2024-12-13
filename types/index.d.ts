// types/index.d.ts
import React from 'react';

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
  }
}

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

export {};