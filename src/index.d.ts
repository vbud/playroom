interface PlayroomConfig {
  components: string;
  outputPath: string;
  title?: string;
  snippets?: Snippet[];
  cwd?: string;
  storageKey?: string;
  webpackConfig?: () => void;
  baseUrl?: string;
  paramType: 'hash' | 'search';
  reactDocgenTypescriptConfig?: import('react-docgen-typescript').ParserOptions;
}

interface InternalPlayroomConfig extends PlayroomConfig {
  cwd: string;
  storageKey: string;
  port: number;
  openBrowser: boolean;
}

interface Window {
  __playroomConfig__: InternalPlayroomConfig;
}

declare const __PLAYROOM_GLOBAL__CONFIG__: InternalPlayroomConfig;
declare const __PLAYROOM_GLOBAL__STATIC_TYPES__: any;
