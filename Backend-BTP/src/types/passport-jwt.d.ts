declare module 'passport-jwt' {
  import { Strategy as PassportStrategy } from 'passport';

  export interface StrategyOptions {
    jwtFromRequest: JwtFromRequestFunction;
    ignoreExpiration?: boolean;
    secretOrKey?: string | Buffer;
    secretOrKeyProvider?: SecretOrKeyProvider;
    issuer?: string;
    audience?: string;
    algorithms?: string[];
    jsonWebTokenOptions?: object;
  }

  export type JwtFromRequestFunction = (req: any) => string | null;
  export type SecretOrKeyProvider = (
    request: any,
    rawJwtToken: any,
    done: (err: any, secretOrKey?: string | Buffer) => void,
  ) => void;

  export type VerifiedCallback = (error: any, user?: any, info?: any) => void;
  export type VerifyCallback = (payload: any, done: VerifiedCallback) => void;

  export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify: VerifyCallback);
    name: string;
  }

  export class ExtractJwt {
    static fromHeader(headerName: string): JwtFromRequestFunction;
    static fromBodyField(fieldName: string): JwtFromRequestFunction;
    static fromUrlQueryParameter(paramName: string): JwtFromRequestFunction;
    static fromAuthHeaderWithScheme(authScheme: string): JwtFromRequestFunction;
    static fromAuthHeaderAsBearerToken(): JwtFromRequestFunction;
    static fromExtractors(extractors: JwtFromRequestFunction[]): JwtFromRequestFunction;
  }
}
