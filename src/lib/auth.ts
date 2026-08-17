import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
const BASE32="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function decode(s:string){const out:number[]=[];let b=0,n=0;for(const c of s.replace(/=+$/,'').toUpperCase()){const v=BASE32.indexOf(c);if(v<0)continue;b=(b<<5)|v;n+=5;if(n>=8){out.push((b>>(n-8))&255);n-=8}}return Buffer.from(out)}
export function generateTOTPSecret(){let s="";for(const b of crypto.randomBytes(20)){s+=BASE32[(b>>3)&31]}return s.padEnd(32,"A").slice(0,32)}
export function generateTOTPCode(secret:string){const buf=Buffer.alloc(8);buf.writeBigInt64BE(BigInt(Math.floor(Date.now()/30000)));const d=crypto.createHmac("sha1",decode(secret)).update(buf).digest();const i=d[19]&15;return (((d[i]&127)<<24|(d[i+1]<<16)|(d[i+2]<<8)|d[i+3])%1000000).toString().padStart(6,"0")}
export function verifyTOTP(token:string,secret:string,window=1){for(let o=-window;o<=window;o++){const buf=Buffer.alloc(8);buf.writeBigInt64BE(BigInt(Math.floor(Date.now()/30000)+o));const d=crypto.createHmac("sha1",decode(secret)).update(buf).digest();const i=d[19]&15;const c=(((d[i]&127)<<24|(d[i+1]<<16)|(d[i+2]<<8)|d[i+3])%1000000).toString().padStart(6,"0");if(c===token)return true}return false}
export function generateOTPAuthURL(email:string,secret:string){return `otpauth://totp/${encodeURIComponent(`The Terminal:${email}`)}?secret=${secret}&issuer=The%20Terminal&algorithm=SHA1&digits=6&period=30`}
export const hashPassword=(p:string)=>bcrypt.hash(p,12);export const verifyPassword=(p:string,h:string)=>bcrypt.compare(p,h);
const SECRET=process.env.SESSION_SECRET||"lifeos-dev-secret-change-in-production";export interface SessionData{userId:string;email:string;twoFactorVerified:boolean;createdAt:number;expiresAt:number}
export function createSession(userId:string,email:string,twoFactorVerified:boolean){const data={userId,email,twoFactorVerified,createdAt:Date.now(),expiresAt:Date.now()+604800000};const payload=JSON.stringify(data);const sig=crypto.createHmac("sha256",SECRET).update(payload).digest("hex");return Buffer.from(`${payload}.${sig}`).toString("base64url")}
export function verifySession(token:string):SessionData|null{try{const d=Buffer.from(token,"base64url").toString(),i=d.lastIndexOf(".");if(i<0)return null;const p=d.slice(0,i),s=d.slice(i+1),e=crypto.createHmac("sha256",SECRET).update(p).digest("hex");if(s!==e)return null;const x=JSON.parse(p);return Date.now()>x.expiresAt?null:x}catch{return null}}
export async function getUserFromRequest(req:Request){const m=(req.headers.get("cookie")||"").match(/lifeos-session=([^;]+)/);return m?verifySession(m[1]):null}
export {db};
