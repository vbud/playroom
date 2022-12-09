interface Snippet {
  group: string;
  name: string;
  code: string;
}

type Snippets = Snippet[];

type ParamType = 'hash' | 'search';

interface CompressParamsOptions {
  code?: string;
}
export const compressParams: (options: CompressParamsOptions) => string;

interface CreateUrlOptions {
  baseUrl?: string;
  code?: string;
  paramType?: ParamType;
}

export const createUrl: (options: CreateUrlOptions) => string;

interface CreatePreviewUrlOptions {
  baseUrl?: string;
  code?: string;
  paramType?: ParamType;
}

export const createPreviewUrl: (options: CreatePreviewUrlOptions) => string;
