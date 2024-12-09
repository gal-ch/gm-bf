declare module '*.jpg';
declare module '*.png';
declare module '*.woff2';
declare module '*.woff';
declare module '*.ttf';

declare module '*.svg' {
  import React = require('react');

  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;

  
}

declare global {
  interface NodeRequire {
    context: (directory: string, useSubdirectories: boolean, regExp: RegExp) => {
      keys: () => string[];
      (id: string): string;
    };
  }
}

declare interface NodeRequire {
  context: (path: string, deep?: boolean, filter?: RegExp) => {
    keys: () => string[];
    <T>(id: string): T;
  };
}