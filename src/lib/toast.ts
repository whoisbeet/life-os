import { toast } from "sonner";
const duration=4000;
export const notify={success:(message:string,description?:string)=>toast.success(message,{description,duration}),error:(message:string,description?:string)=>toast.error(message,{description,duration:duration+2000}),warning:(message:string,description?:string)=>toast.warning(message,{description,duration}),info:(message:string,description?:string)=>toast.info(message,{description,duration}),promise:<T>(promise:Promise<T>,opts:{loading:string;success:string;error:string})=>toast.promise(promise,opts),dismiss:(id?:string|number)=>toast.dismiss(id)};
export {toast};
