var c1=Object.defineProperty;var p1=(e,t,r)=>t in e?c1(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var Ft=(e,t,r)=>p1(e,typeof t!="symbol"?t+"":t,r);import{g as f1,b as Xn}from"./_commonjsHelpers-qts3L1aW.js";/*!
 * ONNX Runtime Web v1.30.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var vc=Object.defineProperty,h1=Object.getOwnPropertyDescriptor,m1=Object.getOwnPropertyNames,g1=Object.prototype.hasOwnProperty,y1=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),Ue=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(i){throw r=[i],i}},Ba=(e,t)=>{for(var r in t)vc(e,r,{get:t[r],enumerable:!0})},b1=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of m1(t))!g1.call(e,n)&&n!==r&&vc(e,n,{get:()=>t[n],enumerable:!(i=h1(t,n))||i.enumerable});return e},bo=e=>b1(vc({},"__esModule",{value:!0}),e),la,Sr,Gn,jp,P0,L0=Ue(()=>{"use strict";la=new Map,Sr=[],Gn=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=la.get(e);if(i===void 0)la.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=Sr.indexOf(e);n!==-1&&Sr.splice(n,1);for(let s=0;s<Sr.length;s++)if(la.get(Sr[s]).priority<=r){Sr.splice(s,0,e);return}Sr.push(e)}return}throw new TypeError("not a valid backend")},jp=async e=>{let t=la.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},P0=async e=>{let t=e.executionProviders||[],r=t.map(u=>typeof u=="string"?u:u.name),i=r.length===0?Sr:r,n,s=[],a=new Set;for(let u of i){let c=await jp(u);typeof c=="string"?s.push({name:u,err:c}):(n||(n=c),n===c&&a.add(u))}if(!n)throw new Error(`no available backend found. ERR: ${s.map(u=>`[${u.name}] ${u.err}`).join(", ")}`);for(let{name:u,err:c}of s)r.includes(u)&&console.warn(`removing requested execution provider "${u}" from session options because it is not available: ${c}`);let o=t.filter(u=>a.has(typeof u=="string"?u:u.name));return[n,new Proxy(e,{get:(u,c)=>c==="executionProviders"?o:Reflect.get(u,c)})]}}),w1=Ue(()=>{"use strict";L0()}),W0,_1=Ue(()=>{"use strict";W0="1.30.0"}),rl,gt,G0=Ue(()=>{"use strict";_1(),rl="warning",gt={wasm:{},webgl:{},webgpu:{},versions:{common:W0},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);rl=e}},get logLevel(){return rl}},Object.defineProperty(gt,"logLevel",{enumerable:!0})}),Qe,v1=Ue(()=>{"use strict";G0(),Qe=gt}),q0,V0,$1=Ue(()=>{"use strict";q0=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let n,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],s=e.dims[3]):(n=e.dims[3],s=e.dims[2]);let a=(t==null?void 0:t.format)!==void 0?t.format:"RGB",o=t==null?void 0:t.norm,u,c;o===void 0||o.mean===void 0?u=[255,255,255,255]:typeof o.mean=="number"?u=[o.mean,o.mean,o.mean,o.mean]:(u=[o.mean[0],o.mean[1],o.mean[2],0],o.mean[3]!==void 0&&(u[3]=o.mean[3])),o===void 0||o.bias===void 0?c=[0,0,0,0]:typeof o.bias=="number"?c=[o.bias,o.bias,o.bias,o.bias]:(c=[o.bias[0],o.bias[1],o.bias[2],0],o.bias[3]!==void 0&&(c[3]=o.bias[3]));let m=s*n,f=0,g=m,_=m*2,v=-1;a==="RGBA"?(f=0,g=m,_=m*2,v=m*3):a==="RGB"?(f=0,g=m,_=m*2):a==="RBG"&&(f=0,_=m,g=m*2);for(let S=0;S<s;S++)for(let k=0;k<n;k++){let E=(e.data[f++]-c[0])*u[0],I=(e.data[g++]-c[1])*u[1],O=(e.data[_++]-c[2])*u[2],z=v===-1?255:(e.data[v++]-c[3])*u[3];i.fillStyle="rgba("+E+","+I+","+O+","+z+")",i.fillRect(k,S,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},V0=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let n,s,a;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],s=e.dims[1],a=e.dims[3]):(n=e.dims[3],s=e.dims[2],a=e.dims[1]);let o=t!==void 0&&t.format!==void 0?t.format:"RGB",u=t==null?void 0:t.norm,c,m;u===void 0||u.mean===void 0?c=[255,255,255,255]:typeof u.mean=="number"?c=[u.mean,u.mean,u.mean,u.mean]:(c=[u.mean[0],u.mean[1],u.mean[2],255],u.mean[3]!==void 0&&(c[3]=u.mean[3])),u===void 0||u.bias===void 0?m=[0,0,0,0]:typeof u.bias=="number"?m=[u.bias,u.bias,u.bias,u.bias]:(m=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(m[3]=u.bias[3]));let f=s*n;if(t!==void 0&&(t.format!==void 0&&a===4&&t.format!=="RGBA"||a===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let g=4,_=0,v=1,S=2,k=3,E=0,I=f,O=f*2,z=-1;o==="RGBA"?(E=0,I=f,O=f*2,z=f*3):o==="RGB"?(E=0,I=f,O=f*2):o==="RBG"&&(E=0,O=f,I=f*2),i=r.createImageData(n,s);for(let R=0;R<s*n;_+=g,v+=g,S+=g,k+=g,R++)i.data[_]=(e.data[E++]-m[0])*c[0],i.data[v]=(e.data[I++]-m[1])*c[1],i.data[S]=(e.data[O++]-m[2])*c[2],i.data[k]=z===-1?255:(e.data[z++]-m[3])*c[3]}else throw new Error("Can not access image data");return i}}),Vs,F0,H0,j0,K0,Y0,x1=Ue(()=>{"use strict";$c(),Vs=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,n=t.norm??{mean:255,bias:0},s,a;typeof n.mean=="number"?s=[n.mean,n.mean,n.mean,n.mean]:s=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?a=[n.bias,n.bias,n.bias,n.bias]:a=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let o=t.format!==void 0?t.format:"RGBA",u=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",c=r*i,m=u==="RGBA"?new Float32Array(c*4):new Float32Array(c*3),f=4,g=0,_=1,v=2,S=3,k=0,E=c,I=c*2,O=-1;o==="RGB"&&(f=3,g=0,_=1,v=2,S=-1),u==="RGBA"?O=c*3:u==="RBG"?(k=0,I=c,E=c*2):u==="BGR"&&(I=0,E=c,k=c*2);for(let z=0;z<c;z++,g+=f,v+=f,_+=f,S+=f)m[k++]=(e[g]+a[0])/s[0],m[E++]=(e[_]+a[1])/s[1],m[I++]=(e[v]+a[2])/s[2],O!==-1&&S!==-1&&(m[O++]=(e[S]+a[3])/s[3]);return u==="RGBA"?new Pt("float32",m,[1,4,r,i]):new Pt("float32",m,[1,3,r,i])},F0=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,s=typeof e=="string",a,o=t??{},u=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},c=m=>typeof HTMLCanvasElement<"u"&&m instanceof HTMLCanvasElement||m instanceof OffscreenCanvas?m.getContext("2d"):null;if(r){let m=u();m.width=e.width,m.height=e.height;let f=c(m);if(f!=null){let g=e.height,_=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(g=t.resizedHeight,_=t.resizedWidth),t!==void 0){if(o=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");o.tensorFormat="RGBA",o.height=g,o.width=_}else o.tensorFormat="RGBA",o.height=g,o.width=_;f.drawImage(e,0,0),a=f.getImageData(0,0,_,g).data}else throw new Error("Can not access image data")}else if(i){let m,f;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(m=t.resizedHeight,f=t.resizedWidth):(m=e.height,f=e.width),t!==void 0&&(o=t),o.format="RGBA",o.height=m,o.width=f,t!==void 0){let g=u();g.width=f,g.height=m;let _=c(g);if(_!=null)_.putImageData(e,0,0),a=_.getImageData(0,0,f,m).data;else throw new Error("Can not access image data")}else a=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let m=u();m.width=e.width,m.height=e.height;let f=c(m);if(f!=null){let g=e.height,_=e.width;return f.drawImage(e,0,0,_,g),a=f.getImageData(0,0,_,g).data,o.height=g,o.width=_,Vs(a,o)}else throw new Error("Can not access image data")}else{if(s)return new Promise((m,f)=>{let g=u(),_=c(g);if(!e||!_)return f();let v=new Image;v.crossOrigin="Anonymous",v.src=e,v.onload=()=>{g.width=v.width,g.height=v.height,_.drawImage(v,0,0,g.width,g.height);let S=_.getImageData(0,0,g.width,g.height);o.height=g.height,o.width=g.width,m(Vs(S.data,o))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(a!==void 0)return Vs(a,o);throw new Error("Input data provided is not supported - aborted tensor creation")},H0=(e,t)=>{let{width:r,height:i,download:n,dispose:s}=t,a=[1,i,r,4];return new Pt({location:"texture",type:"float32",texture:e,dims:a,download:n,dispose:s})},j0=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:s}=t;return new Pt({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:n,dispose:s})},K0=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:s}=t;return new Pt({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:n,dispose:s})},Y0=(e,t,r)=>new Pt({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),ln,Ea,nl,X0,T1=Ue(()=>{"use strict";ln=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Ea=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),nl=!1,X0=()=>{if(!nl){nl=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(ln.set("int64",BigInt64Array),Ea.set(BigInt64Array,"int64")),t&&(ln.set("uint64",BigUint64Array),Ea.set(BigUint64Array,"uint64")),i?(ln.set("float16",r),Ea.set(r,"float16")):ln.set("float16",Uint16Array)}}}),Z0,Q0,S1=Ue(()=>{"use strict";$c(),Z0=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},Q0=(e,t)=>{switch(e.location){case"cpu":return new Pt(e.type,e.data,t);case"cpu-pinned":return new Pt({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Pt({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Pt({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Pt({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Pt,$c=Ue(()=>{"use strict";$1(),x1(),T1(),S1(),Pt=class{constructor(e,t,r){X0();let i,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,n=e.dims,e.location){case"cpu-pinned":{let a=ln.get(i);if(!a)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof a))throw new TypeError(`buffer should be of type ${a.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let a,o;if(typeof e=="string")if(i=e,o=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");a=t}else{let u=ln.get(e);if(u===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&u===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${u.name} as data.`);e==="uint64"||e==="int64"?a=u.from(t,BigInt):a=u.from(t)}else if(t instanceof u)a=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")a=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&u!==Uint16Array)a=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${u}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let u=typeof e[0];if(u==="string")i="string",a=e;else if(u==="boolean")i="bool",a=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${u}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",a=Uint8Array.from(e);else{let u=Ea.get(e.constructor);if(u===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=u,a=e}if(o===void 0)o=[a.length];else if(!Array.isArray(o))throw new TypeError("A tensor's dims must be a number array");n=o,this.cpuData=a,this.dataLocation="cpu"}let s=Z0(n);if(this.cpuData&&s!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(s/2)===this.cpuData.length))throw new Error(`Tensor's size(${s}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=n,this.size=s}static async fromImage(e,t){return F0(e,t)}static fromTexture(e,t){return H0(e,t)}static fromGpuBuffer(e,t){return j0(e,t)}static fromMLTensor(e,t){return K0(e,t)}static fromPinnedBuffer(e,t,r){return Y0(e,t,r)}toDataURL(e){return q0(this,e)}toImageData(e){return V0(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Q0(this,e)}}}),nr,J0=Ue(()=>{"use strict";$c(),nr=Pt}),Kd,il,Hn,jn,hn,mn,ey=Ue(()=>{"use strict";G0(),Kd=(e,t)=>{(typeof gt.trace>"u"?!gt.wasm.trace:!gt.trace)||console.timeStamp(`${e}::ORT::${t}`)},il=(e,t)=>{var n;let r=((n=new Error().stack)==null?void 0:n.split(/\r\n|\r|\n/g))||[],i=!1;for(let s=0;s<r.length;s++){if(i&&!r[s].includes("TRACE_FUNC")){let a=`FUNC_${e}::${r[s].trim().split(" ")[1]}`;t&&(a+=`::${t}`),Kd("CPU",a);return}r[s].includes("TRACE_FUNC")&&(i=!0)}},Hn=e=>{(typeof gt.trace>"u"?!gt.wasm.trace:!gt.trace)||il("BEGIN",e)},jn=e=>{(typeof gt.trace>"u"?!gt.wasm.trace:!gt.trace)||il("END",e)},hn=e=>{(typeof gt.trace>"u"?!gt.wasm.trace:!gt.trace)||console.time(`ORT::${e}`)},mn=e=>{(typeof gt.trace>"u"?!gt.wasm.trace:!gt.trace)||console.timeEnd(`ORT::${e}`)}}),ty,I1=Ue(()=>{"use strict";L0(),J0(),ey(),ty=class ry{constructor(t){this.handler=t}async run(t,r,i){Hn(),hn("InferenceSession.run");let n={},s={};if(typeof t!="object"||t===null||t instanceof nr||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let a=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof nr)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");a=!1;for(let c of r){if(typeof c!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(c)===-1)throw new RangeError(`'fetches' contains invalid output name: ${c}.`);n[c]=null}if(typeof i=="object"&&i!==null)s=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let c=!1,m=Object.getOwnPropertyNames(r);for(let f of this.outputNames)if(m.indexOf(f)!==-1){let g=r[f];(g===null||g instanceof nr)&&(c=!0,a=!1,n[f]=g)}if(c){if(typeof i=="object"&&i!==null)s=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else s=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let c of this.inputNames)if(typeof t[c]>"u")throw new Error(`input '${c}' is missing in 'feeds'.`);if(a)for(let c of this.outputNames)n[c]=null;let o=await this.handler.run(t,n,s),u={};for(let c in o)if(Object.hasOwnProperty.call(o,c)){let m=o[c];m instanceof nr?u[c]=m:u[c]=new nr(m.type,m.data,m.dims)}return mn("InferenceSession.run"),jn(),u}async release(){return this.handler.dispose()}static async create(t,r,i,n){Hn(),hn("InferenceSession.create");let s,a={};if(typeof t=="string"){if(s=t,typeof r=="object"&&r!==null)a=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(s=t,typeof r=="object"&&r!==null)a=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let m=t,f=0,g=t.byteLength;if(typeof r=="object"&&r!==null)a=r;else if(typeof r=="number"){if(f=r,!Number.isSafeInteger(f))throw new RangeError("'byteOffset' must be an integer.");if(f<0||f>=m.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${m.byteLength}).`);if(g=t.byteLength-f,typeof i=="number"){if(g=i,!Number.isSafeInteger(g))throw new RangeError("'byteLength' must be an integer.");if(g<=0||f+g>m.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${m.byteLength-f}].`);if(typeof n=="object"&&n!==null)a=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");s=new Uint8Array(m,f,g)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[o,u]=await P0(a),c=await o.createInferenceSessionHandler(s,u);return mn("InferenceSession.create"),jn(),new ry(c)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),wo,E1=Ue(()=>{"use strict";I1(),wo=ty}),k1=Ue(()=>{"use strict"}),C1=Ue(()=>{"use strict"}),A1=Ue(()=>{"use strict"}),O1=Ue(()=>{"use strict"}),z1={};Ba(z1,{InferenceSession:()=>wo,TRACE:()=>Kd,TRACE_EVENT_BEGIN:()=>hn,TRACE_EVENT_END:()=>mn,TRACE_FUNC_BEGIN:()=>Hn,TRACE_FUNC_END:()=>jn,Tensor:()=>nr,env:()=>Qe,registerBackend:()=>Gn});var $n=Ue(()=>{"use strict";w1(),v1(),E1(),J0(),k1(),C1(),ey(),A1(),O1()}),xc=Ue(()=>{"use strict"}),ny={};Ba(ny,{default:()=>iy});var al,sl,iy,R1=Ue(()=>{"use strict";var e;wy(),xn(),Tc(),al="ort-wasm-proxy-worker",sl=((e=globalThis.self)==null?void 0:e.name)===al,sl&&(self.onmessage=t=>{let{type:r,in:i}=t.data;try{switch(r){case"init-wasm":Sc(i.wasm).then(()=>{Ac(i).then(()=>{postMessage({type:r})},n=>{postMessage({type:r,err:n})})},n=>{postMessage({type:r,err:n})});break;case"init-ep":{let{epName:n,env:s}=i;Oc(s,n).then(()=>{postMessage({type:r})},a=>{postMessage({type:r,err:a})});break}case"copy-from":{let{buffer:n}=i,s=$o(n);postMessage({type:r,out:s});break}case"create":{let{model:n,options:s}=i;zc(n,s).then(a=>{postMessage({type:r,out:a})},a=>{postMessage({type:r,err:a})});break}case"release":Rc(i),postMessage({type:r});break;case"run":{let{sessionId:n,inputIndices:s,inputs:a,outputIndices:o,options:u}=i;Mc(n,s,a,o,new Array(o.length).fill(null),u).then(c=>{c.some(m=>m[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:c},Dc([...a,...c]))},c=>{postMessage({type:r,err:c})});break}case"end-profiling":Bc(i),postMessage({type:r});break;default:}}catch(n){postMessage({type:r,err:n})}}),iy=sl?null:t=>new Worker(t??Dt,{type:"module",name:al})}),ay={};Ba(ay,{default:()=>sy});async function Kp(e={}){var Fp,Hp;var t=e,r=!!globalThis.window,i=!!globalThis.WorkerGlobalScope,n=i&&((Fp=self.name)==null?void 0:Fp.startsWith("em-pthread"));t.mountExternalData=(d,p)=>{d.startsWith("./")&&(d=d.substring(2)),(t.ed||(t.ed=new Map)).set(d,p)},t.unmountExternalData=()=>{delete t.ed,delete t.Te,delete t.Se,delete t.Ue},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let s=()=>{let d=p=>(...y)=>{let b=st;return y=p(...y),st!=b?new Promise((C,B)=>{Fr={resolve:C,reject:B}}):y};(()=>{for(let p of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[p]=d(t[p])})(),typeof jsepRunAsync<"u"&&(t._OrtRun=jsepRunAsync(t._OrtRun),t._OrtRunWithBinding=jsepRunAsync(t._OrtRunWithBinding)),s=void 0};t.asyncInit=()=>{s==null||s()};var a,o,u=(d,p)=>{throw p},c=self.location.href,m="";if(r||i){try{m=new URL(".",c).href}catch{}i&&(o=d=>{var p=new XMLHttpRequest;return p.open("GET",d,!1),p.responseType="arraybuffer",p.send(null),new Uint8Array(p.response)}),a=async d=>{if(N(d))return new Promise((y,b)=>{var C=new XMLHttpRequest;C.open("GET",d,!0),C.responseType="arraybuffer",C.onload=()=>{C.status==200||C.status==0&&C.response?y(C.response):b(C.status)},C.onerror=b,C.send(null)});var p=await fetch(d,{credentials:"same-origin"});if(p.ok)return p.arrayBuffer();throw Error(p.status+" : "+p.url)}}var f,g,_,v,S,k,E=console.log.bind(console),I=console.error.bind(console),O=E,z=I,R=!1,N=d=>d.startsWith("file://");function T(){vt.buffer!=P.buffer&&q()}if(n){let d=function(p){try{var y=p.data,b=y.$c;if(b==="load"){let C=[];self.onmessage=B=>C.push(B),k=()=>{postMessage({$c:"loaded"});for(let B of C)d(B);self.onmessage=d};for(let B of y.ue)t[B]&&!t[B].proxy||(t[B]=(...G)=>{postMessage({$c:"callHandler",te:B,args:G})},B=="print"&&(O=t[B]),B=="printErr"&&(z=t[B]));vt=y.Me,q(),g=y.Ne,pe(),qs()}else if(b==="run"){(function(C){var B=(T(),M)[C+52>>>2>>>0];C=(T(),M)[C+56>>>2>>>0],Ws(B,B-C),_e(B)})(y.Xc),aa(y.Xc,0,0,1,0,0),xr(),Gr(y.Xc),$||($s(),$=!0);try{Gt(y.ze,y.kd)}catch(C){if(C!="unwind")throw C}}else y.target!=="setimmediate"&&(b==="checkMailbox"?$&&lr():b&&(z(`worker: received unknown command ${b}`),z(y)))}catch(C){throw Ds(),C}};var $=!1;self.onunhandledrejection=p=>{throw p.reason||p},self.onmessage=d}var P,F,J,H,L,M,ne,te,ie,me,U,j=!1;function q(){var d=vt.buffer;t.HEAP8=P=new Int8Array(d),J=new Int16Array(d),t.HEAPU8=F=new Uint8Array(d),H=new Uint16Array(d),t.HEAP32=L=new Int32Array(d),t.HEAPU32=M=new Uint32Array(d),ne=new Float32Array(d),te=new Float64Array(d),ie=new BigInt64Array(d),me=new BigUint64Array(d)}function K(){j=!0,n?k():yr.hc()}function X(d){throw z(d="Aborted("+d+")"),R=!0,d=new WebAssembly.RuntimeError(d+". Build with -sASSERTIONS for more info."),S==null||S(d),d}function Y(){return{a:{qa:Tv,f:Ro,K:Mo,k:Bo,p:Do,l:No,fa:Uo,b:Po,da:Lo,gc:ri,q:Wo,ea:si,Ua:oi,cc:ui,ec:li,Va:di,Sa:ci,La:pi,Ra:fi,oa:hi,dc:mi,ac:gi,Ta:yi,bc:bi,_a:Go,Ba:qo,Xb:Vo,Vb:Ho,Aa:Ko,O:Yo,J:Xo,Wb:Zo,ka:iu,Yb:au,Oa:su,_b:uu,Ea:lu,Tb:du,Ca:cu,Na:Gr,Xa:pu,U:gu,n:vu,c:Lr,qb:$u,w:xu,N:Tu,A:Su,j:Iu,o:Ii,rb:Eu,H:ku,T:Cu,g:Au,u:Ou,m:zu,i:Ru,Ia:Mu,Ja:Bu,Ka:Du,Ga:Ai,Ha:Oi,Ub:zi,ab:Uu,Za:Lu,Z:Wu,pb:Gu,Da:qu,Ya:Pu,X:Vu,Wa:Fu,$b:Hu,G:Nu,db:ju,_:fr,pa:kn,Zb:Bi,cb:Ku,bb:Di,lb:Wa,z:Gi,sa:Ga,ra:qa,nb:Va,Y:qi,v:Fa,kb:Ha,jb:ja,ib:Ka,mb:Ya,gb:Xa,fb:Za,eb:Qa,Pa:Fi,Qa:Hi,fc:lt,W:ji,Fa:Ki,ma:Yi,Ma:Xi,la:Zi,Fb:u1,va:r1,Gb:o1,wa:t1,E:Gv,e:kv,r:Iv,x:Sv,C:Uv,Ib:Qv,ca:Zv,D:Ov,xa:Jv,aa:n1,ha:Xv,Jb:Yv,Kb:Kv,za:Vv,Lb:Hv,ya:jv,Mb:Fv,ua:s1,ba:e1,d:Ev,B:Av,s:Cv,Eb:l1,t:Rv,y:Lv,F:zv,I:Mv,L:Wv,Nb:qv,R:i1,ia:Nv,$:a1,Pb:Dv,Rb:Bv,Ob:Pv,h:es,a:vt,$a:ue,Hb:ts,V:rs,M:ns,na:is,Db:as,ja:ss,S:os,Ab:us,Bb:ls,vb:ds,wb:cs,P:ps,xb:fs,yb:hs,ta:ms,Sb:gs,ob:ys,Q:bs,hb:ws,Cb:_s,sb:Yt,tb:Qi,ub:Xu,ga:Zu,zb:Qu,Qb:Ju}}}async function pe(){function d(b,C){var B=yr=b.exports;b={};for(let[G,W]of Object.entries(B))typeof W=="function"?(B=fu(W),b[G]=B):b[G]=W;return yr=b,yr=(function(){var G=yr,W=se=>de=>se(de)>>>0,Q=se=>()=>se()>>>0;return(G=Object.assign({},G)).ic=W(G.ic),G.Nc=Q(G.Nc),G.Pc=W(G.Pc),G.Bd=(se=>(de,Ee)=>se(de,Ee)>>>0)(G.Bd),G.Gd=W(G.Gd),G.Hd=Q(G.Hd),G.Ld=W(G.Ld),G})(),jt.push(yr.sd),vs=(b=yr).ic,$s=b.jc,t._OrtInit=b.kc,t._OrtGetLastError=b.lc,t._OrtCreateSessionOptions=b.mc,t._OrtAppendExecutionProvider=b.nc,t._OrtAddFreeDimensionOverride=b.oc,t._OrtAddSessionConfigEntry=b.pc,t._OrtReleaseSessionOptions=b.qc,t._OrtCreateSession=b.rc,t._OrtReleaseSession=b.sc,t._OrtGetInputOutputCount=b.tc,t._OrtGetInputOutputMetadata=b.uc,t._OrtFree=b.vc,t._OrtCreateTensor=b.wc,t._OrtGetTensorData=b.xc,t._OrtReleaseTensor=b.yc,t._OrtCreateRunOptions=b.zc,t._OrtAddRunConfigEntry=b.Ac,t._OrtReleaseRunOptions=b.Bc,t._OrtCreateBinding=b.Cc,t._OrtBindInput=b.Dc,t._OrtBindOutput=b.Ec,t._OrtClearBoundOutputs=b.Fc,t._OrtReleaseBinding=b.Gc,t._OrtRunWithBinding=b.Hc,t._OrtRun=b.Ic,t._OrtEndProfiling=b.Jc,xs=t._OrtCreateWebGpuInstance=b.Kc,t._wgpuCreateInstance=b.Lc,Ji=t._OrtGetWebGpuDevice=b.Mc,Bn=b.Nc,Et=t._free=b.Oc,gr=t._malloc=b.Pc,Ts=t._wgpuBufferRelease=b.Qc,Ss=b.Rc,Is=b.Sc,Es=b.Tc,ks=b.Uc,Cs=b.Vc,As=b.Yc,Os=b.Zc,zs=b.hd,Rs=b.id,Ms=b.jd,ea=b.ld,ta=b.md,ra=b.nd,na=b.od,Zr=b.pd,ia=b.qd,Bs=b.rd,aa=b.ud,Ds=b.vd,Ns=b.wd,Us=b.xd,sa=b.yd,Ps=b.zd,Ls=b.Ad,oa=b.Bd,Me=b.Cd,Qr=b.Dd,Ws=b.Ed,_e=b.Fd,Jr=b.Gd,xe=b.Hd,l=b.Id,h=b.Jd,x=b.Kd,w=b.Ld,A=b.Md,D=b.Nd,V=b.Od,ee=b.Pd,le=b.Qd,fe=b.Rd,Ae=b.Sd,De=b.Td,Ge=b.Ud,He=b.Vd,Xt=b.Wd,Dn=b.Xd,Gs=b.Yd,Nn=b.Zd,gp=b._d,yp=b.$d,bp=b.ae,wp=b.be,_p=b.ce,vp=b.de,$p=b.fe,xp=b.ge,Tp=b.he,Sp=b.ie,Ip=b.je,Ep=b.ke,kp=b.le,Cp=b.me,Ap=b.Ae,Op=b.Be,zp=b.Ce,Rp=b.De,Mp=b.Ee,Bp=b.Fe,Dp=b.Ge,Np=b.He,Up=b.Ie,Pp=b.Je,Lp=b.Ke,Wp=b.nf,Gp=b.of,qp=b.pf,Vp=b.qf,g=C,yr}var p,y=Y();return t.instantiateWasm?new Promise(b=>{t.instantiateWasm(y,(C,B)=>{b(d(C,B))})}):n?d(new WebAssembly.Instance(g,Y()),g):(U??(U=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.asyncify.wasm",m):m+"ort-wasm-simd-threaded.asyncify.wasm":new URL("ort-wasm-simd-threaded.asyncify.wasm",self.location.href).href),p=await(async function(b){var C=U;if(!f&&!N(C))try{var B=fetch(C,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(B,b)}catch(G){z(`wasm streaming compile failed: ${G}`),z("falling back to ArrayBuffer instantiation")}return(async function(G,W){try{var Q=await(async function(se){if(!f)try{var de=await a(se);return new Uint8Array(de)}catch{}if(se==U&&f)se=new Uint8Array(f);else{if(!o)throw"both async and sync fetching of the wasm failed";se=o(se)}return se})(G);return await WebAssembly.instantiate(Q,W)}catch(se){z(`failed to asynchronously prepare wasm: ${se}`),X(se)}})(C,b)})(y),d(p.instance,p.module))}class Ce{constructor(p){Ft(this,"name","ExitStatus");this.message=`Program terminated with exit(${p})`,this.status=p}}var Se=d=>{d.terminate(),d.onmessage=()=>{}},$e=[],ce=0,he=null,Ie=d=>{rt.length==0&&(ct(),dt(rt[0]));var p=rt.pop();if(!p)return 6;wt.push(p),At[d.Xc]=p,p.Xc=d.Xc;var y={$c:"run",ze:d.ye,kd:d.kd,Xc:d.Xc};return p.postMessage(y,d.oe),0},ve=0,oe=(d,p,...y)=>{var b,C=16*y.length,B=xe(),G=Jr(C),W=G>>>3;for(b of y)typeof b=="bigint"?((T(),ie)[W++>>>0]=1n,(T(),ie)[W++>>>0]=b):((T(),ie)[W++>>>0]=0n,(T(),te)[W++>>>0]=b);return d=Ns(d,0,C,G,p),_e(B),d};function ue(d){if(n)return oe(0,1,d);if(_=d,!(0<ve)){for(var p of wt)Se(p);for(p of rt)Se(p);rt=[],wt=[],At={},R=!0}u(0,new Ce(d))}function Fe(d){if(n)return oe(1,0,d);lt(d)}var lt=d=>{if(_=d,n)throw Fe(d),"unwind";ue(d)},rt=[],wt=[],jt=[],At={},Ot=d=>{var p=d.Xc;delete At[p],rt.push(d),wt.splice(wt.indexOf(d),1),d.Xc=0,Us(p)};function xr(){jt.forEach(d=>d())}var dt=d=>new Promise(p=>{d.onmessage=C=>{var B=C.data;if(C=B.$c,B.gd&&B.gd!=Bn()){var G=At[B.gd];G?G.postMessage(B,B.oe):z(`Internal error! Worker sent a message "${C}" to target pthread ${B.gd}, but that thread no longer exists!`)}else C==="checkMailbox"?lr():C==="spawnThread"?Ie(B):C==="cleanupThread"?ot(()=>{Ot(At[B.Le])}):C==="loaded"?(d.loaded=!0,p(d)):B.target==="setimmediate"?d.postMessage(B):C==="uncaughtException"?d.onerror(B.error):C==="callHandler"?t[B.te](...B.args):C&&z(`worker sent an unknown command ${C}`)},d.onerror=C=>{throw z(`worker sent an error! ${C.filename}:${C.lineno}: ${C.message}`),C};var y,b=[];for(y of[])t.propertyIsEnumerable(y)&&b.push(y);d.postMessage({$c:"load",ue:b,Me:vt,Ne:g})});function ct(){var d=new Worker((()=>{let p=URL;return self.location.href>"file:"&&self.location.href<"file;"?new p("ort.webgpu.bundle.min.mjs",self.location.href):new URL(self.location.href)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});rt.push(d)}var vt,Gt=(d,p)=>{ve=0,d=D(d,p),0<ve?_=d:sa(d)},In=[],ur=0,it=d=>-9007199254740992>d||9007199254740992<d?NaN:Number(d);function Ro(d){var p=new Dr(d>>>=0);return(T(),P)[p.ad+12>>>0]==0&&(Jn(p,!0),ur--),ei(p,!1),In.push(p),w(d)}var zt=0,Mo=()=>{Me(0,0);var d=In.pop();l(d.td),zt=0};function Jn(d,p){p=p?1:0,(T(),P)[d.ad+12>>>0]=p}function ei(d,p){p=p?1:0,(T(),P)[d.ad+13>>>0]=p}class Dr{constructor(p){this.td=p,this.ad=p-24}}var Nr=d=>{var p=zt;if(!p)return Qr(0),0;var y=new Dr(p);(T(),M)[y.ad+16>>>2>>>0]=p;var b=(T(),M)[y.ad+4>>>2>>>0];if(!b)return Qr(0),p;for(var C of d){if(C===0||C===b)break;if(x(C,b,y.ad+16))return Qr(C),p}return Qr(b),p};function Bo(){return Nr([])}function Do(d){return Nr([d>>>0])}function No(d,p,y,b){return Nr([d>>>0,p>>>0,y>>>0,b>>>0])}var Uo=()=>{var d=In.pop();d||X("no exception to throw");var p=d.td;throw(T(),P)[d.ad+13>>>0]==0&&(In.push(d),ei(d,!0),Jn(d,!1),ur++),h(p),zt=p};function Po(d,p,y){var b=new Dr(d>>>=0);throw p>>>=0,y>>>=0,(T(),M)[b.ad+16>>>2>>>0]=0,(T(),M)[b.ad+4>>>2>>>0]=p,(T(),M)[b.ad+8>>>2>>>0]=y,h(d),ur++,zt=d}var Lo=()=>ur;function ti(d,p,y,b){return n?oe(2,1,d,p,y,b):ri(d,p,y,b)}function ri(d,p,y,b){if(d>>>=0,p>>>=0,y>>>=0,b>>>=0,!globalThis.SharedArrayBuffer)return 6;var C=[];return n&&C.length===0?ti(d,p,y,b):(d={ye:y,Xc:d,kd:b,oe:C},n?(d.$c="spawnThread",postMessage(d,C),0):Ie(d))}function Wo(d){throw zt||(zt=d>>>0),zt}var ni=globalThis.TextDecoder&&new TextDecoder,ii=(d,p,y,b)=>{if(y=p+y,b)return y;for(;d[p]&&!(p>=y);)++p;return p},ai=(d,p=0,y,b)=>{if(16<(y=ii(d,p>>>=0,y,b))-p&&d.buffer&&ni)return ni.decode(d.buffer instanceof ArrayBuffer?d.subarray(p,y):d.slice(p,y));for(b="";p<y;){var C=d[p++];if(128&C){var B=63&d[p++];if((224&C)==192)b+=String.fromCharCode((31&C)<<6|B);else{var G=63&d[p++];65536>(C=(240&C)==224?(15&C)<<12|B<<6|G:(7&C)<<18|B<<12|G<<6|63&d[p++])?b+=String.fromCharCode(C):(C-=65536,b+=String.fromCharCode(55296|C>>10,56320|1023&C))}}else b+=String.fromCharCode(C)}return b},Ye=(d,p,y)=>(d>>>=0)?ai((T(),F),d,p,y):"";function si(d,p,y){return n?oe(3,1,d,p,y):0}function oi(d,p){if(n)return oe(4,1,d,p)}function ui(d,p){if(n)return oe(5,1,d,p)}function li(d,p,y){if(n)return oe(6,1,d,p,y)}function di(d,p,y){return n?oe(7,1,d,p,y):0}function ci(d,p){if(n)return oe(8,1,d,p)}function pi(d,p,y){if(n)return oe(9,1,d,p,y)}function fi(d,p,y,b){if(n)return oe(10,1,d,p,y,b)}function hi(d,p,y,b){if(n)return oe(11,1,d,p,y,b)}function mi(d,p,y,b){if(n)return oe(12,1,d,p,y,b)}function gi(d){if(n)return oe(13,1,d)}function yi(d,p){if(n)return oe(14,1,d,p)}function bi(d,p,y){if(n)return oe(15,1,d,p,y)}var Go=()=>X(""),at=d=>{d>>>=0;for(var p="";;){var y=(T(),F)[d++>>>0];if(!y)return p;p+=String.fromCharCode(y)}},Ur={},Pr={},Rt=class extends Error{constructor(d){super(d),this.name="BindingError"}};function pt(d,p,y={}){return(function(b,C,B={}){var G=C.name;if(!b)throw new Rt(`type "${G}" must have a positive integer typeid pointer`);if(Pr.hasOwnProperty(b)){if(B.ve)return;throw new Rt(`Cannot register type '${G}' twice`)}Pr[b]=C,Ur.hasOwnProperty(b)&&(C=Ur[b],delete Ur[b],C.forEach(W=>W()))})(d,p,y)}var wi=(d,p,y)=>{switch(p){case 1:return y?b=>(T(),P)[b>>>0]:b=>(T(),F)[b>>>0];case 2:return y?b=>(T(),J)[b>>>1>>>0]:b=>(T(),H)[b>>>1>>>0];case 4:return y?b=>(T(),L)[b>>>2>>>0]:b=>(T(),M)[b>>>2>>>0];case 8:return y?b=>(T(),ie)[b>>>3>>>0]:b=>(T(),me)[b>>>3>>>0];default:throw new TypeError(`invalid integer width (${p}): ${d}`)}};function qo(d,p,y,b,C){d>>>=0,y>>>=0,p=at(p>>>0);let B=G=>G;if(b=b===0n){let G=8*y;B=W=>BigInt.asUintN(G,W),C=B(C)}pt(d,{name:p,Wc:B,cd:(G,W)=>(typeof W=="number"&&(W=BigInt(W)),W),bd:wi(p,y,!b),dd:null})}function Vo(d,p,y,b){pt(d>>>=0,{name:p=at(p>>>0),Wc:function(C){return!!C},cd:function(C,B){return B?y:b},bd:function(C){return this.Wc((T(),F)[C>>>0])},dd:null})}var _i=[],$t=[0,1,,1,null,1,!0,1,!1,1];function Lr(d){9<(d>>>=0)&&--$t[d+1]===0&&($t[d]=void 0,_i.push(d))}var Je=d=>{if(!d)throw new Rt(`Cannot use deleted val. handle = ${d}`);return $t[d]},nt=d=>{switch(d){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let p=_i.pop()||$t.length;return $t[p]=d,$t[p+1]=1,p}};function Wr(d){return this.Wc((T(),M)[d>>>2>>>0])}var Fo={name:"emscripten::val",Wc:d=>{var p=Je(d);return Lr(d),p},cd:(d,p)=>nt(p),bd:Wr,dd:null};function Ho(d){return pt(d>>>0,Fo)}var jo=(d,p)=>{switch(p){case 4:return function(y){return this.Wc((T(),ne)[y>>>2>>>0])};case 8:return function(y){return this.Wc((T(),te)[y>>>3>>>0])};default:throw new TypeError(`invalid float width (${p}): ${d}`)}};function Ko(d,p,y){y>>>=0,pt(d>>>=0,{name:p=at(p>>>0),Wc:b=>b,cd:(b,C)=>C,bd:jo(p,y),dd:null})}function Yo(d,p,y,b,C){d>>>=0,y>>>=0,p=at(p>>>0);let B=W=>W;if(b===0){var G=32-8*y;B=W=>W<<G>>>G,C=B(C)}pt(d,{name:p,Wc:B,cd:(W,Q)=>Q,bd:wi(p,y,b!==0),dd:null})}function Xo(d,p,y){function b(B){var G=(T(),M)[B>>>2>>>0];return B=(T(),M)[B+4>>>2>>>0],new C((T(),P).buffer,B,G)}var C=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][p];pt(d>>>=0,{name:y=at(y>>>0),Wc:b,bd:b},{ve:!0})}var mt=(d,p,y)=>{var b=(T(),F);if(p>>>=0,0<y){var C=p;y=p+y-1;for(var B=0;B<d.length;++B){var G=d.codePointAt(B);if(127>=G){if(p>=y)break;b[p++>>>0]=G}else if(2047>=G){if(p+1>=y)break;b[p++>>>0]=192|G>>6,b[p++>>>0]=128|63&G}else if(65535>=G){if(p+2>=y)break;b[p++>>>0]=224|G>>12,b[p++>>>0]=128|G>>6&63,b[p++>>>0]=128|63&G}else{if(p+3>=y)break;b[p++>>>0]=240|G>>18,b[p++>>>0]=128|G>>12&63,b[p++>>>0]=128|G>>6&63,b[p++>>>0]=128|63&G,B++}}b[p>>>0]=0,d=p-C}else d=0;return d},St=d=>{for(var p=0,y=0;y<d.length;++y){var b=d.charCodeAt(y);127>=b?p++:2047>=b?p+=2:55296<=b&&57343>=b?(p+=4,++y):p+=3}return p};function Zo(d,p){pt(d>>>=0,{name:p=at(p>>>0),Wc(y){var b=(T(),M)[y>>>2>>>0];return b=Ye(y+4,b,!0),Et(y),b},cd(y,b){b instanceof ArrayBuffer&&(b=new Uint8Array(b));var C=typeof b=="string";if(!(C||ArrayBuffer.isView(b)&&b.BYTES_PER_ELEMENT==1))throw new Rt("Cannot pass non-string to std::string");var B=C?St(b):b.length,G=gr(4+B+1),W=G+4;return(T(),M)[G>>>2>>>0]=B,C?mt(b,W,B+1):(T(),F).set(b,W>>>0),y!==null&&y.push(Et,G),G},bd:Wr,dd(y){Et(y)}})}var vi=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,Qo=(d,p,y)=>{if(d>>>=1,16<(p=ii((T(),H),d,p/2,y))-d&&vi)return vi.decode((T(),H).slice(d,p));for(y="";d<p;++d){var b=(T(),H)[d>>>0];y+=String.fromCharCode(b)}return y},Jo=(d,p,y)=>{if(y??(y=2147483647),2>y)return 0;var b=p;y=(y-=2)<2*d.length?y/2:d.length;for(var C=0;C<y;++C){var B=d.charCodeAt(C);(T(),J)[p>>>1>>>0]=B,p+=2}return(T(),J)[p>>>1>>>0]=0,p-b},eu=d=>2*d.length,tu=(d,p,y)=>{var b="";d>>>=2;for(var C=0;!(C>=p/4);C++){var B=(T(),M)[d+C>>>0];if(!B&&!y)break;b+=String.fromCodePoint(B)}return b},ru=(d,p,y)=>{if(p>>>=0,y??(y=2147483647),4>y)return 0;var b=p;y=b+y-4;for(var C=0;C<d.length;++C){var B=d.codePointAt(C);if(65535<B&&C++,(T(),L)[p>>>2>>>0]=B,(p+=4)+4>y)break}return(T(),L)[p>>>2>>>0]=0,p-b},nu=d=>{for(var p=0,y=0;y<d.length;++y)65535<d.codePointAt(y)&&y++,p+=4;return p};function iu(d,p,y){if(d>>>=0,p>>>=0,y=at(y>>>=0),p===2)var b=Qo,C=Jo,B=eu;else b=tu,C=ru,B=nu;pt(d,{name:y,Wc:G=>{var W=(T(),M)[G>>>2>>>0];return W=b(G+4,W*p,!0),Et(G),W},cd:(G,W)=>{if(typeof W!="string")throw new Rt(`Cannot pass non-string to C++ string type ${y}`);var Q=B(W),se=gr(4+Q+p);return(T(),M)[se>>>2>>>0]=Q/p,C(W,se+4,Q+p),G!==null&&G.push(Et,se),se},bd:Wr,dd(G){Et(G)}})}function au(d,p){pt(d>>>=0,{we:!0,name:p=at(p>>>0),Wc:()=>{},cd:()=>{}})}function su(d){aa(d>>>0,!i,1,!r,131072,!1),xr()}var ot=d=>{if(!R)try{if(d(),!(0<ve))try{n?Bn()&&sa(_):lt(_)}catch(p){p instanceof Ce||p=="unwind"||u(0,p)}}catch(p){p instanceof Ce||p=="unwind"||u(0,p)}},ou=!Atomics.waitAsync||((Hp=globalThis.navigator)==null?void 0:Hp.userAgent)&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function Gr(d){d>>>=0,ou||(Atomics.waitAsync((T(),L),d>>>2,d).value.then(lr),d+=128,Atomics.store((T(),L),d>>>2,1))}var lr=()=>ot(()=>{var d=Bn();d&&(Gr(d),Ls())});function uu(d,p){(d>>>=0)==p>>>0?setTimeout(lr):n?postMessage({gd:d,$c:"checkMailbox"}):(d=At[d])&&d.postMessage({$c:"checkMailbox"})}var qr=[];function lu(d,p,y,b,C){for(p>>>=0,C>>>=0,qr.length=0,y=C>>>3,b=C+b>>>3;y<b;){var B;B=(T(),ie)[y++>>>0]?(T(),ie)[y++>>>0]:(T(),te)[y++>>>0],qr.push(B)}return(p?el[p]:xv[d])(...qr)}var du=()=>{ve=0};function cu(d){d>>>=0,n?postMessage({$c:"cleanupThread",Le:d}):Ot(At[d])}function pu(d){}var dr=d=>{try{d()}catch(p){X(p)}};function fu(d){var p=(...y)=>{cr.push(d);try{return d(...y)}finally{R||(cr.pop(),st&&_t===1&&cr.length===0&&(_t=0,ve+=1,dr(Gp),typeof Fibers<"u"&&Fibers.We()))}};return Ti.set(d,p),p}var _t=0,st=null,$i=0,cr=[],Vr=new Map,xi=new Map,Ti=new Map,hu=0,Fr=null,mu=[],Si=d=>(function(p){if(!R){if(_t===0){var y=!1,b=!1;p((C=0)=>{if(!R&&($i=C,y=!0,b)){_t=2,dr(()=>qp(st)),typeof MainLoop<"u"&&MainLoop.se&&MainLoop.resume(),C=!1;try{var B=(function(){var Q=(T(),L)[st+8>>>2>>>0];return Q=xi.get(Q),Q=Ti.get(Q),--ve,Q()})()}catch(Q){B=Q,C=!0}var G=!1;if(!st){var W=Fr;W&&(Fr=null,(C?W.reject:W.resolve)(B),G=!0)}if(C&&!G)throw B}}),b=!0,y||(_t=1,st=(function(){var C=gr(65548),B=C+12;if((T(),M)[C>>>2>>>0]=B,(T(),M)[C+4>>>2>>>0]=B+65536,B=cr[0],!Vr.has(B)){var G=hu++;Vr.set(B,G),xi.set(G,B)}return B=Vr.get(B),(T(),L)[C+8>>>2>>>0]=B,C})(),typeof MainLoop<"u"&&MainLoop.se&&MainLoop.pause(),dr(()=>Wp(st)))}else _t===2?(_t=0,dr(Vp),Et(st),st=null,mu.forEach(ot)):X(`invalid state: ${_t}`);return $i}})(p=>{d().then(p)});function gu(d){return d>>>=0,Si(async()=>{var p=await Je(d);return nt(p)})}var Hr=[],yu=d=>{var p=Hr.length;return Hr.push(d),p},bu=(d,p)=>{for(var y=Array(d),b=0;b<d;++b){var C=b,B=(T(),M)[p+4*b>>>2>>>0],G=Pr[B];if(G===void 0)throw d=`parameter ${b}`,B=vs(B),p=at(B),Et(B),new Rt(`${d} has unknown type ${p}`);y[C]=G}return y},wu=(d,p,y)=>{var b=[];return d=d(b,y),b.length&&((T(),M)[p>>>2>>>0]=nt(b)),d},_u={},pr=d=>{var p=_u[d];return p===void 0?at(d):p};function vu(d,p,y){var[b,...C]=bu(d,p>>>0);p=b.cd.bind(b);var B=C.map(Q=>Q.bd.bind(Q));d--;var G={toValue:Je};switch(d=B.map((Q,se)=>{var de=`argFromPtr${se}`;return G[de]=Q,`${de}(args${se?"+"+8*se:""})`}),y){case 0:var W="toValue(handle)";break;case 2:W="new (toValue(handle))";break;case 3:W="";break;case 1:G.getStringOrSymbol=pr,W="toValue(handle)[getStringOrSymbol(methodName)]"}return W+=`(${d})`,b.we||(G.toReturnWire=p,G.emval_returnValue=wu,W=`return emval_returnValue(toReturnWire, destructorsRef, ${W})`),W=`return function (handle, methodName, destructorsRef, args) {
  ${W}
  }`,y=new Function(Object.keys(G),W)(...Object.values(G)),W=`methodCaller<(${C.map(Q=>Q.name)}) => ${b.name}>`,yu(Object.defineProperty(y,"name",{value:W}))}function $u(d,p){return p>>>=0,(d=Je(d>>>0))==Je(p)}function xu(d){return(d>>>=0)?(d=pr(d),nt(globalThis[d])):nt(globalThis)}function Tu(d){return d=pr(d>>>0),nt(t[d])}function Su(d,p){return p>>>=0,d=Je(d>>>0),p=Je(p),nt(d[p])}function Iu(d){9<(d>>>=0)&&($t[d+1]+=1)}function Ii(d,p,y,b,C){return Hr[d>>>0](p>>>0,y>>>0,b>>>0,C>>>0)}function Eu(d,p,y,b,C){return Ii(d>>>0,p>>>0,y>>>0,b>>>0,C>>>0)}function ku(){return nt([])}function Cu(d){d=Je(d>>>0);for(var p=Array(d.length),y=0;y<d.length;y++)p[y]=d[y];return nt(p)}function Au(d){return nt(pr(d>>>0))}function Ou(){return nt({})}function zu(d){for(var p=Je(d>>>=0);p.length;){var y=p.pop();p.pop()(y)}Lr(d)}function Ru(d,p,y){p>>>=0,y>>>=0,d=Je(d>>>0),p=Je(p),y=Je(y),d[p]=y}function Mu(d,p){d=it(d),p>>>=0,d=new Date(1e3*d),(T(),L)[p>>>2>>>0]=d.getUTCSeconds(),(T(),L)[p+4>>>2>>>0]=d.getUTCMinutes(),(T(),L)[p+8>>>2>>>0]=d.getUTCHours(),(T(),L)[p+12>>>2>>>0]=d.getUTCDate(),(T(),L)[p+16>>>2>>>0]=d.getUTCMonth(),(T(),L)[p+20>>>2>>>0]=d.getUTCFullYear()-1900,(T(),L)[p+24>>>2>>>0]=d.getUTCDay(),d=(d.getTime()-Date.UTC(d.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(T(),L)[p+28>>>2>>>0]=d}var Ei=d=>d%4==0&&(d%100!=0||d%400==0),ki=[0,31,60,91,121,152,182,213,244,274,305,335],Ci=[0,31,59,90,120,151,181,212,243,273,304,334];function Bu(d,p){d=it(d),p>>>=0,d=new Date(1e3*d),(T(),L)[p>>>2>>>0]=d.getSeconds(),(T(),L)[p+4>>>2>>>0]=d.getMinutes(),(T(),L)[p+8>>>2>>>0]=d.getHours(),(T(),L)[p+12>>>2>>>0]=d.getDate(),(T(),L)[p+16>>>2>>>0]=d.getMonth(),(T(),L)[p+20>>>2>>>0]=d.getFullYear()-1900,(T(),L)[p+24>>>2>>>0]=d.getDay();var y=(Ei(d.getFullYear())?ki:Ci)[d.getMonth()]+d.getDate()-1|0;(T(),L)[p+28>>>2>>>0]=y,(T(),L)[p+36>>>2>>>0]=-60*d.getTimezoneOffset(),y=new Date(d.getFullYear(),6,1).getTimezoneOffset();var b=new Date(d.getFullYear(),0,1).getTimezoneOffset();d=0|(y!=b&&d.getTimezoneOffset()==Math.min(b,y)),(T(),L)[p+32>>>2>>>0]=d}function Du(d){d>>>=0;var p=new Date((T(),L)[d+20>>>2>>>0]+1900,(T(),L)[d+16>>>2>>>0],(T(),L)[d+12>>>2>>>0],(T(),L)[d+8>>>2>>>0],(T(),L)[d+4>>>2>>>0],(T(),L)[d>>>2>>>0],0),y=(T(),L)[d+32>>>2>>>0],b=p.getTimezoneOffset(),C=new Date(p.getFullYear(),6,1).getTimezoneOffset(),B=new Date(p.getFullYear(),0,1).getTimezoneOffset(),G=Math.min(B,C);return 0>y?(T(),L)[d+32>>>2>>>0]=+(C!=B&&G==b):0<y!=(G==b)&&(C=Math.max(B,C),p.setTime(p.getTime()+6e4*((0<y?G:C)-b))),(T(),L)[d+24>>>2>>>0]=p.getDay(),y=(Ei(p.getFullYear())?ki:Ci)[p.getMonth()]+p.getDate()-1|0,(T(),L)[d+28>>>2>>>0]=y,(T(),L)[d>>>2>>>0]=p.getSeconds(),(T(),L)[d+4>>>2>>>0]=p.getMinutes(),(T(),L)[d+8>>>2>>>0]=p.getHours(),(T(),L)[d+12>>>2>>>0]=p.getDate(),(T(),L)[d+16>>>2>>>0]=p.getMonth(),(T(),L)[d+20>>>2>>>0]=p.getYear(),d=p.getTime(),BigInt(isNaN(d)?-1:d/1e3)}function Ai(d,p,y,b,C,B,G){return n?oe(16,1,d,p,y,b,C,B,G):-52}function Oi(d,p,y,b,C,B){if(n)return oe(17,1,d,p,y,b,C,B)}var Kt={},Nu=()=>performance.timeOrigin+performance.now();function zi(d,p){if(n)return oe(18,1,d,p);if(Kt[d]&&(clearTimeout(Kt[d].id),delete Kt[d]),!p)return 0;var y=setTimeout(()=>{delete Kt[d],ot(()=>Ps(d,performance.timeOrigin+performance.now()))},p);return Kt[d]={id:y,Ve:p},0}function Uu(d,p,y,b){d>>>=0,p>>>=0,y>>>=0,b>>>=0;var C=new Date().getFullYear(),B=new Date(C,0,1).getTimezoneOffset();C=new Date(C,6,1).getTimezoneOffset();var G=Math.max(B,C);(T(),M)[d>>>2>>>0]=60*G,(T(),L)[p>>>2>>>0]=+(B!=C),d=(p=W=>{var Q=Math.abs(W);return`UTC${0<=W?"-":"+"}${String(Math.floor(Q/60)).padStart(2,"0")}${String(Q%60).padStart(2,"0")}`})(B),p=p(C),C<B?(mt(d,y,17),mt(p,b,17)):(mt(d,b,17),mt(p,y,17))}var Pu=()=>Date.now();function Lu(d,p,y){return y>>>=0,0<=d&&3>=d?(d===0?d=Date.now():d=performance.timeOrigin+performance.now(),d=Math.round(1e6*d),(T(),ie)[y>>>3>>>0]=BigInt(d),0):28}var jr=[],Ri=(d,p)=>{jr.length=0;for(var y;y=(T(),F)[d++>>>0];){var b=y!=105;p+=(b&=y!=112)&&p%8?4:0,jr.push(y==112?(T(),M)[p>>>2>>>0]:y==106?(T(),ie)[p>>>3>>>0]:y==105?(T(),L)[p>>>2>>>0]:(T(),te)[p>>>3>>>0]),p+=b?8:4}return jr};function Wu(d,p,y){return d>>>=0,p=Ri(p>>>0,y>>>0),el[d](...p)}function Gu(d,p,y){return d>>>=0,p=Ri(p>>>0,y>>>0),el[d](...p)}var qu=()=>{};function Vu(d,p){return z(Ye(d>>>0,p>>>0))}var Fu=()=>{throw ve+=1,"unwind"};function Hu(){return 4294901760}var ju=()=>1,fr=()=>navigator.hardwareConcurrency,qt={},Mi=d=>{var p=St(d)+1,y=gr(p);return y&&mt(d,y,p),y},En=d=>{var p;return(p=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(d))?+p[1]:(p=/:(\d+):\d+(?:\)|$)/.exec(d))?2147483648|+p[1]:0},Kr=d=>{for(var p of d)(d=En(p))&&(qt[d]=p)};function Ku(){var d=Error().stack.toString().split(`
`);return d[0]=="Error"&&d.shift(),Kr(d),qt.ee=En(d[3]),qt.xe=d,qt.ee}function kn(d){if(!(d=qt[d>>>0]))return 0;var p;if(p=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(d))d=p[1];else if(p=/^\s+at (.*) \(.*\)$/.exec(d))d=p[1];else{if(!(p=/^(.+?)@/.exec(d)))return 0;d=p[1]}return Et(kn.ne??0),kn.ne=Mi(d),kn.ne}function Bi(d){d>>>=0;var p=(T(),F).length;if(d<=p||4294901760<d)return!1;for(var y=1;4>=y;y*=2){var b=p*(1+.2/y);b=Math.min(b,d+100663296);e:{b=(Math.min(4294901760,65536*Math.ceil(Math.max(d,b)/65536))-vt.buffer.byteLength+65535)/65536|0;try{vt.grow(b),q();var C=1;break e}catch{}C=void 0}if(C)return!0}return!1}function Di(d,p,y){if(d>>>=0,p>>>=0,qt.ee==d)var b=qt.xe;else(b=Error().stack.toString().split(`
`))[0]=="Error"&&b.shift(),Kr(b);for(var C=3;b[C]&&En(b[C])!=d;)++C;for(d=0;d<y&&b[d+C];++d)(T(),L)[p+4*d>>>2>>>0]=En(b[d+C]);return d}var Mt=d=>{var p=St(d)+1,y=Jr(p);return mt(d,y,p),y},hr=d=>(T(),M)[d>>>2>>>0]+4294967296*(T(),L)[d+4>>>2>>>0],ut=[],Ni=(d,p)=>{ut[d>>>0]=p},Vt=[],Yr=[],mr=(d,p)=>{Yr[d]=new Promise(y=>p.finally(()=>y(d)))},we=d=>{if(d)return ut[d>>>0]},Cn=(d,p)=>{for(d=(T(),M)[d>>>2>>>0];d;d=(T(),M)[d>>>2>>>0])p[(T(),L)[d+4>>>2>>>0]](d)},An=(d,p,y)=>{(T(),M)[d>>>2>>>0]=p,(T(),M)[d+4>>>2>>>0]=y},Ui=d=>{var p=(T(),M)[d>>>2>>>0];return d=(T(),M)[d+4>>>2>>>0],Ye(p,d)},It=d=>{var p=(T(),M)[d>>>2>>>0];return d=(T(),M)[d+4>>>2>>>0],p?Ye(p,d):d===0?"":void 0},On=d=>{var p=It(d+4),y=(y=(T(),M)[d+12>>>2>>>0])?we(y):"auto";if(d+=16){var b=we((T(),M)[d+4>>>2>>>0]),C=(T(),M)[d+16>>>2>>>0],B=(T(),M)[d+20>>>2>>>0];if(C){for(var G={},W=0;W<C;++W){var Q=B+24*W;G[Ui(Q+4)]=(T(),te)[Q+16>>>3>>>0]}C=G}else C=void 0;d={module:b,constants:C,entryPoint:It(d+8)}}else d=void 0;return{label:p,layout:y,compute:d}},Bt=(d,p)=>{function y(B,G,W,Q=0){B=d[B]??Q,(T(),M)[G+W>>>2>>>0]=B}function b(B,G,W,Q=0){G+=W,B=d[B]??Q,(T(),M)[G>>>2>>>0]=B,Q=(T(),M)[G>>>2>>>0],(T(),M)[G+4>>>2>>>0]=(B-Q)/4294967296}var C=(T(),M)[p>>>2>>>0];y("maxTextureDimension1D",p,4),y("maxTextureDimension2D",p,8),y("maxTextureDimension3D",p,12),y("maxTextureArrayLayers",p,16),y("maxBindGroups",p,20),y("maxBindGroupsPlusVertexBuffers",p,24),y("maxBindingsPerBindGroup",p,28),y("maxDynamicUniformBuffersPerPipelineLayout",p,32),y("maxDynamicStorageBuffersPerPipelineLayout",p,36),y("maxSampledTexturesPerShaderStage",p,40),y("maxSamplersPerShaderStage",p,44),y("maxStorageBuffersPerShaderStage",p,48),y("maxStorageTexturesPerShaderStage",p,52),y("maxUniformBuffersPerShaderStage",p,56),y("minUniformBufferOffsetAlignment",p,80),y("minStorageBufferOffsetAlignment",p,84),b("maxUniformBufferBindingSize",p,64),b("maxStorageBufferBindingSize",p,72),y("maxVertexBuffers",p,88),b("maxBufferSize",p,96),y("maxVertexAttributes",p,104),y("maxVertexBufferArrayStride",p,108),y("maxInterStageShaderVariables",p,112),y("maxColorAttachments",p,116),y("maxColorAttachmentBytesPerSample",p,120),y("maxComputeWorkgroupStorageSize",p,124),y("maxComputeInvocationsPerWorkgroup",p,128),y("maxComputeWorkgroupSizeX",p,132),y("maxComputeWorkgroupSizeY",p,136),y("maxComputeWorkgroupSizeZ",p,140),y("maxComputeWorkgroupsPerDimension",p,144),y("maxImmediateSize",p,148),C!==0&&(T(),y("maxStorageBuffersInVertexStage",C,8,d.maxStorageBuffersPerShaderStage),y("maxStorageBuffersInFragmentStage",C,16,d.maxStorageBuffersPerShaderStage),y("maxStorageTexturesInVertexStage",C,12,d.maxStorageTexturesPerShaderStage),y("maxStorageTexturesInFragmentStage",C,20,d.maxStorageTexturesPerShaderStage))},Xr=(d,p)=>{(T(),M)[p+52>>>2>>>0]=d.subgroupMinSize,(T(),M)[p+56>>>2>>>0]=d.subgroupMaxSize;var y=Mi(d.vendor+d.architecture+d.device+d.description),b=St(d.vendor);An(p+4,y,b),y+=b,b=St(d.architecture),An(p+12,y,b),y+=b,b=St(d.device),An(p+20,y,b),y+=b,b=St(d.description),An(p+28,y,b),y+=b,(T(),L)[p+36>>>2>>>0]=2,y=d.isFallbackAdapter?3:4,(T(),L)[p+40>>>2>>>0]=y,(T(),M)[p+44>>>2>>>0]=0,(T(),M)[p+48>>>2>>>0]=0,Cn(p,{327739:C=>{let B=0,G=0;if(d.subgroupMatrixConfigs){B=d.subgroupMatrixConfigs.length,G=gr(20*B);for(let[W,Q]of d.subgroupMatrixConfigs.entries()){let se=G+20*W,de=Tr.indexOf(Q.componentType),Ee=Tr.indexOf(Q.resultComponentType);(T(),L)[se>>>2>>>0]=de,(T(),L)[se+4>>>2>>>0]=Ee,(T(),M)[se+8>>>2>>>0]=Q.M,(T(),M)[se+12>>>2>>>0]=Q.N,(T(),M)[se+16>>>2>>>0]=Q.K}}(T(),M)[C+12>>>2>>>0]=G,(T(),M)[C+8>>>2>>>0]=B}})},Pi=[,,"uniform","storage","read-only-storage"],Da=[,"validation","out-of-memory","internal"],Na=[,"compatibility","core"],Li={1:"core-features-and-limits",2:"depth-clip-control",3:"depth32float-stencil8",4:"texture-compression-bc",5:"texture-compression-bc-sliced-3d",6:"texture-compression-etc2",7:"texture-compression-astc",8:"texture-compression-astc-sliced-3d",9:"timestamp-query",10:"indirect-first-instance",11:"shader-f16",12:"rg11b10ufloat-renderable",13:"bgra8unorm-storage",14:"float32-filterable",15:"float32-blendable",16:"clip-distances",17:"dual-source-blending",18:"subgroups",19:"texture-formats-tier1",20:"texture-formats-tier2",21:"primitive-index",22:"texture-component-swizzle",23:"subgroup-size-control",327692:"chromium-experimental-unorm16-texture-formats",327729:"chromium-experimental-multi-draw-indirect",327732:"chromium-experimental-subgroup-matrix"},Wi=[,"low-power","high-performance"],Ua=[,"occlusion","timestamp"],Pa=[,,"filtering","non-filtering","comparison"],Be=[,,"write-only","read-only","read-write"],Tr=[,"f32","f16","u32","i32","u8","i8"],La=[,"r8unorm","r8snorm","r8uint","r8sint","r16unorm","r16snorm","r16uint","r16sint","r16float","rg8unorm","rg8snorm","rg8uint","rg8sint","r32float","r32uint","r32sint","rg16unorm","rg16snorm","rg16uint","rg16sint","rg16float","rgba8unorm","rgba8unorm-srgb","rgba8snorm","rgba8uint","rgba8sint","bgra8unorm","bgra8unorm-srgb","rgb10a2uint","rgb10a2unorm","rg11b10ufloat","rgb9e5ufloat","rg32float","rg32uint","rg32sint","rgba16unorm","rgba16snorm","rgba16uint","rgba16sint","rgba16float","rgba32float","rgba32uint","rgba32sint","stencil8","depth16unorm","depth24plus","depth24plus-stencil8","depth32float","depth32float-stencil8","bc1-rgba-unorm","bc1-rgba-unorm-srgb","bc2-rgba-unorm","bc2-rgba-unorm-srgb","bc3-rgba-unorm","bc3-rgba-unorm-srgb","bc4-r-unorm","bc4-r-snorm","bc5-rg-unorm","bc5-rg-snorm","bc6h-rgb-ufloat","bc6h-rgb-float","bc7-rgba-unorm","bc7-rgba-unorm-srgb","etc2-rgb8unorm","etc2-rgb8unorm-srgb","etc2-rgb8a1unorm","etc2-rgb8a1unorm-srgb","etc2-rgba8unorm","etc2-rgba8unorm-srgb","eac-r11unorm","eac-r11snorm","eac-rg11unorm","eac-rg11snorm","astc-4x4-unorm","astc-4x4-unorm-srgb","astc-5x4-unorm","astc-5x4-unorm-srgb","astc-5x5-unorm","astc-5x5-unorm-srgb","astc-6x5-unorm","astc-6x5-unorm-srgb","astc-6x6-unorm","astc-6x6-unorm-srgb","astc-8x5-unorm","astc-8x5-unorm-srgb","astc-8x6-unorm","astc-8x6-unorm-srgb","astc-8x8-unorm","astc-8x8-unorm-srgb","astc-10x5-unorm","astc-10x5-unorm-srgb","astc-10x6-unorm","astc-10x6-unorm-srgb","astc-10x8-unorm","astc-10x8-unorm-srgb","astc-10x10-unorm","astc-10x10-unorm-srgb","astc-12x10-unorm","astc-12x10-unorm-srgb","astc-12x12-unorm","astc-12x12-unorm-srgb"],ze=[,,"float","unfilterable-float","depth","sint","uint"],zn=[,"1d","2d","2d-array","cube","cube-array","3d"],Re={undefined:1,unknown:1,destroyed:2};function Wa(d,p,y,b,C,B){p=it(p),y=it(y),b>>>=0,C>>>=0,B>>>=0;var G=we(d>>>0);if(d={},B){var W=(T(),M)[B+12>>>2>>>0];if(W){var Q=(T(),M)[B+16>>>2>>>0];d.requiredFeatures=Array.from((T(),M).subarray(Q>>>2>>>0,Q+4*W>>>2>>>0),de=>Li[de])}if(W=(T(),M)[B+20>>>2>>>0]){let de=function(Ne,je,en,ua=!1){je+=en,(je=(T(),M)[je>>>2>>>0])==4294967295||ua&&je==0||(se[Ne]=je)},Ee=function(Ne,je,en){je+=en,en=(T(),M)[je>>>2>>>0];var ua=(T(),M)[je+4>>>2>>>0];en==4294967295&&ua==4294967295||(se[Ne]=hr(je))};Q=(T(),M)[W>>>2>>>0];var se={};de("maxTextureDimension1D",W,4),de("maxTextureDimension2D",W,8),de("maxTextureDimension3D",W,12),de("maxTextureArrayLayers",W,16),de("maxBindGroups",W,20),de("maxBindGroupsPlusVertexBuffers",W,24),de("maxBindingsPerBindGroup",W,28),de("maxDynamicUniformBuffersPerPipelineLayout",W,32),de("maxDynamicStorageBuffersPerPipelineLayout",W,36),de("maxSampledTexturesPerShaderStage",W,40),de("maxSamplersPerShaderStage",W,44),de("maxStorageBuffersPerShaderStage",W,48),de("maxStorageTexturesPerShaderStage",W,52),de("maxUniformBuffersPerShaderStage",W,56),de("minUniformBufferOffsetAlignment",W,80),de("minStorageBufferOffsetAlignment",W,84),Ee("maxUniformBufferBindingSize",W,64),Ee("maxStorageBufferBindingSize",W,72),de("maxVertexBuffers",W,88),Ee("maxBufferSize",W,96),de("maxVertexAttributes",W,104),de("maxVertexBufferArrayStride",W,108),de("maxInterStageShaderVariables",W,112),de("maxColorAttachments",W,116),de("maxColorAttachmentBytesPerSample",W,120),de("maxComputeWorkgroupStorageSize",W,124),de("maxComputeInvocationsPerWorkgroup",W,128),de("maxComputeWorkgroupSizeX",W,132),de("maxComputeWorkgroupSizeY",W,136),de("maxComputeWorkgroupSizeZ",W,140),de("maxComputeWorkgroupsPerDimension",W,144),de("maxImmediateSize",W,148,!0),Q!==0&&(T(),"maxStorageBuffersInVertexStage"in GPUSupportedLimits.prototype&&(de("maxStorageBuffersInVertexStage",Q,8),de("maxStorageTexturesInVertexStage",Q,12),de("maxStorageBuffersInFragmentStage",Q,16),de("maxStorageTexturesInFragmentStage",Q,20))),d.requiredLimits=se}(W=(T(),M)[B+24>>>2>>>0])&&(W={label:It(W+4)},d.defaultQueue=W),d.label=It(B+4)}ve+=1,mr(p,G.requestDevice(d).then(de=>{--ve,ot(()=>{ut[C>>>0]=de.queue,ut[b>>>0]=de,ve+=1,mr(y,de.lost.then(Ee=>{ot(()=>{de.onuncapturederror=()=>{};var Ne=xe(),je=Mt(Ee.message);ta(y,Re[Ee.reason],je),_e(Ne)}),--ve})),de.onuncapturederror=Ee=>{var Ne=5;Ee.error instanceof GPUValidationError?Ne=2:Ee.error instanceof GPUOutOfMemoryError?Ne=3:Ee.error instanceof GPUInternalError&&(Ne=4);var je=xe();Ee=Mt(Ee.error.message),Bs(b,Ne,Ee),_e(je)},"adapterInfo"in de||(de.adapterInfo=G.info),ia(p,1,b,0)})},de=>{--ve,ot(()=>{var Ee=xe(),Ne=Mt(de.message);ia(p,3,b,Ne),y&&ta(y,4,Ne),_e(Ee)})}))}function Gi(d){var p=we(d>>>=0),y=Vt[d];if(y){for(var b=0;b<y.length;++b)y[b]();delete Vt[d]}p.destroy()}function Ga(d,p,y){y>>>=0;var b=we(d>>>=0);y==4294967295&&(y=void 0);try{var C=b.getMappedRange(p>>>0,y)}catch{return 0}var B=oa(16,C.byteLength);return(T(),F).set(new Uint8Array(C),B>>>0),Vt[d].push(()=>Et(B)),B}function qa(d,p,y){y>>>=0;var b=we(d>>>=0);y==4294967295&&(y=void 0);try{var C=b.getMappedRange(p>>>0,y)}catch{return 0}var B=oa(16,C.byteLength);return(T(),F).fill(0,B,C.byteLength),Vt[d].push(()=>{new Uint8Array(C).set((T(),F).subarray(B>>>0,B+C.byteLength>>>0)),Et(B)}),B}function Va(d,p,y,b,C){d>>>=0,p=it(p),y=it(y),C>>>=0;var B=we(d);Vt[d]=[],C==4294967295&&(C=void 0),ve+=1,mr(p,B.mapAsync(y,b>>>0,C).then(()=>{--ve,ot(()=>{ra(p,1,0)})},G=>{--ve,ot(()=>{xe();var W=Mt(G.message);ra(p,G.name==="AbortError"?4:G.name==="OperationError"?3:0,W),delete Vt[d]})}))}function qi(d){var p=we(d>>>=0),y=Vt[d];if(y){for(var b=0;b<y.length;++b)y[b]();delete Vt[d],p.unmap()}}function Fa(d){delete ut[d>>>0]}function Ha(d,p,y){d>>>=0,p>>>=0,y>>>=0;var b=!!(T(),M)[p+32>>>2>>>0];p={label:It(p+4),usage:(T(),M)[p+16>>>2>>>0],size:hr(p+24),mappedAtCreation:b},d=we(d);try{var C=d.createBuffer(p)}catch{return!1}return ut[y>>>0]=C,b&&(Vt[y]=[]),!0}function ja(d,p,y,b){d>>>=0,p=it(p),b>>>=0,y=On(y>>>0),d=we(d),ve+=1,mr(p,d.createComputePipelineAsync(y).then(C=>{--ve,ot(()=>{ut[b>>>0]=C,ea(p,1,b,0)})},C=>{--ve,ot(()=>{var B=xe(),G=Mt(C.message);ea(p,C.reason==="validation"?3:C.reason==="internal"?4:0,b,G),_e(B)})}))}function Ka(d,p,y){d>>>=0,p>>>=0,y>>>=0;var b=(T(),M)[p>>>2>>>0],C=(T(),L)[b+4>>>2>>>0];p={label:It(p+4),code:""},C===2&&(p.code=Ui(b+8)),d=we(d).createShaderModule(p),ut[y>>>0]=d}var Ya=d=>{(d=we(d)).onuncapturederror=null,d.destroy()};function Xa(d,p){p=it(p),d=we(d>>>0),ve+=1,mr(p,d.popErrorScope().then(y=>{--ve,ot(()=>{var b=5;y?y instanceof GPUValidationError?b=2:y instanceof GPUOutOfMemoryError?b=3:y instanceof GPUInternalError&&(b=4):b=1;var C=xe(),B=y?Mt(y.message):0;na(p,1,b,B),_e(C)})},y=>{--ve,ot(()=>{var b=xe(),C=Mt(y.message);na(p,1,5,C),_e(b)})}))}function Za(d,p,y,b){if(p=it(p),b>>>=0,y>>>=0){var C={featureLevel:Na[(T(),L)[y+4>>>2>>>0]],powerPreference:Wi[(T(),L)[y+8>>>2>>>0]],forceFallbackAdapter:!!(T(),M)[y+12>>>2>>>0]};(d=(T(),M)[y>>>2>>>0])!==0&&(T(),C.Ye=!!(T(),M)[d+8>>>2>>>0])}"gpu"in navigator?(ve+=1,mr(p,navigator.gpu.requestAdapter(C).then(B=>{--ve,ot(()=>{if(B)ut[b>>>0]=B,Zr(p,1,b,0);else{var G=xe(),W=Mt("WebGPU not available on this browser (requestAdapter returned null)");Zr(p,3,b,W),_e(G)}})},B=>{--ve,ot(()=>{var G=xe(),W=Mt(B.message);Zr(p,4,b,W),_e(G)})}))):(C=xe(),d=Mt("WebGPU not available on this browser (navigator.gpu is not available)"),Zr(p,3,b,d),_e(C))}function Qa(d,p,y){return d>>>=0,p>>>=0,y>>>=0,Si(async()=>{var b=[];if(y){var C=(T(),L)[y>>>2>>>0];b.length=p+1,b[p]=new Promise(W=>setTimeout(W,C,0))}else b.length=p;for(var B=0;B<p;++B){var G=hr(d+8*B);if(!(G in Yr))return G;b[B]=Yr[G]}return b=await Promise.race(b),delete Yr[b],b})}var Rn,Mn={},Vi=()=>{var b;if(!Rn){var d,p={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(((b=globalThis.navigator)==null?void 0:b.language)??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(d in Mn)Mn[d]===void 0?delete p[d]:p[d]=Mn[d];var y=[];for(d in p)y.push(`${d}=${p[d]}`);Rn=y}return Rn};function Fi(d,p){if(n)return oe(19,1,d,p);d>>>=0,p>>>=0;var y,b=0,C=0;for(y of Vi()){var B=p+b;(T(),M)[d+C>>>2>>>0]=B,b+=mt(y,B,1/0)+1,C+=4}return 0}function Hi(d,p){if(n)return oe(20,1,d,p);d>>>=0,p>>>=0;var y=Vi();for(var b of((T(),M)[d>>>2>>>0]=y.length,d=0,y))d+=St(b)+1;return(T(),M)[p>>>2>>>0]=d,0}function ji(d){return n?oe(21,1,d):52}function Ki(d,p,y,b,C){return n?oe(22,1,d,p,y,b,C):52}function Yi(d,p,y,b){return n?oe(23,1,d,p,y,b):52}function Xi(d,p,y,b){return n?oe(24,1,d,p,y,b):70}var Ja=[null,[],[]];function Zi(d,p,y,b){if(n)return oe(25,1,d,p,y,b);p>>>=0,y>>>=0,b>>>=0;for(var C=0,B=0;B<y;B++){var G=(T(),M)[p>>>2>>>0],W=(T(),M)[p+4>>>2>>>0];p+=8;for(var Q=0;Q<W;Q++){var se=d,de=(T(),F)[G+Q>>>0],Ee=Ja[se];de===0||de===10?((se===1?O:z)(ai(Ee)),Ee.length=0):Ee.push(de)}C+=W}return(T(),M)[b>>>2>>>0]=C,0}function es(d){return d>>>0}function ts(d,p){return Bt(we(d>>>0).limits,p>>>0),1}function rs(d,p){return we(d>>>0).features.has(Li[p])}function ns(d){return BigInt(we(d>>>0).size)}function is(d){return BigInt(we(d>>>0).usage)}function as(d,p){if(d>>>=0,p>>>=0){var y=It(p+4);y={label:y,timestampWrites:p=(p=(T(),M)[p+12>>>2>>>0])!==0?{querySet:we((T(),M)[p+4>>>2>>>0]),beginningOfPassWriteIndex:(T(),M)[p+8>>>2>>>0],endOfPassWriteIndex:(T(),M)[p+12>>>2>>>0]}:void 0}}return p=we(d),d=Cs(0),y=p.beginComputePass(y),ut[d>>>0]=y,d}function ss(d,p,y,b){y=it(y),(b=it(b))==-1&&(b=void 0),(d=we(d>>>0)).clearBuffer(we(p>>>0),y,b)}function os(d,p,y,b,C,B){y=it(y),C=it(C),B=it(B),we(d>>>0).copyBufferToBuffer(we(p>>>0),y,we(b>>>0),C,B)}function us(d){var p=we(d>>>0);return d=Es(0),p=p.finish(),ut[d>>>0]=p,d}function ls(d,p,y,b,C,B){B=it(B),we(d>>>0).resolveQuerySet(we(p>>>0),y,b,we(C>>>0),B)}function ds(d,p,y,b){we(d>>>0).dispatchWorkgroups(p,y,b)}function cs(d,p,y){y=it(y),we(d>>>0).dispatchWorkgroupsIndirect(we(p>>>0),y)}function ps(d){we(d>>>0).end()}function fs(d,p,y,b,C){b>>>=0,C>>>=0,d=we(d>>>0),y=we(y>>>0),b==0?d.setBindGroup(p,y):d.setBindGroup(p,y,(T(),M),C>>>2,b)}function hs(d,p){we(d>>>0).setPipeline(we(p>>>0))}function ms(d,p,y){we(d>>>0).Xe(we(p>>>0),y)}function gs(d,p){function y(C){var B=(T(),M)[C+8>>>2>>>0],G=(T(),M)[C+32>>>2>>>0],W=(T(),M)[C+36>>>2>>>0],Q=0;return Cn(C,{14:se=>{Q=(T(),M)[se+8>>>2>>>0]}}),B?((G=hr(C+24))==-1&&(G=void 0),B={buffer:we(B),offset:hr(C+16),size:G}):B=we(G||W||Q),{binding:(T(),M)[C+4>>>2>>>0],resource:B}}d>>>=0,p={label:It((p>>>=0)+4),layout:we((T(),M)[p+12>>>2>>>0]),entries:(function(C,B){for(var G=[],W=0;W<C;++W)G.push(y(B+40*W));return G})((T(),M)[p+16>>>2>>>0],(T(),M)[p+20>>>2>>>0])},d=we(d);var b=Ss(0);return Ni(b,d.createBindGroup(p)),b}function ys(d,p){function y(Q){var se=(T(),M)[Q+4>>>2>>>0];if(se)return{type:Pi[se],hasDynamicOffset:!!(T(),M)[Q+8>>>2>>>0],minBindingSize:hr(Q+16)}}function b(Q){if(Q=(T(),M)[Q+4>>>2>>>0])return{type:Pa[Q]}}function C(Q){var se=(T(),M)[Q+4>>>2>>>0];if(se)return{sampleType:ze[se],viewDimension:zn[(T(),L)[Q+8>>>2>>>0]],multisampled:!!(T(),M)[Q+12>>>2>>>0]}}function B(Q){var se=(T(),M)[Q+4>>>2>>>0];if(se)return{access:Be[se],format:La[(T(),L)[Q+8>>>2>>>0]],viewDimension:zn[(T(),L)[Q+12>>>2>>>0]]}}function G(Q){var se={binding:(T(),M)[Q+4>>>2>>>0],visibility:(T(),M)[Q+8>>>2>>>0],buffer:y(Q+24),sampler:b(Q+48),texture:C(Q+56),storageTexture:B(Q+72)};return Cn(Q,{13:()=>{se.externalTexture={}}}),se}d>>>=0,p={label:It((p>>>=0)+4),entries:(function(Q,se){for(var de=[],Ee=0;Ee<Q;++Ee)de.push(G(se+88*Ee));return de})((T(),M)[p+12>>>2>>>0],(T(),M)[p+16>>>2>>>0])},d=we(d);var W=Is(0);return Ni(W,d.createBindGroupLayout(p)),W}function bs(d,p){var y;return d>>>=0,(p>>>=0)&&(y={label:It(p+4)}),p=we(d),d=ks(0),y=p.createCommandEncoder(y),ut[d>>>0]=y,d}function ws(d,p){d>>>=0,p>>>=0;for(var y=(T(),M)[p+12>>>2>>>0],b=(T(),M)[p+16>>>2>>>0],C=[],B=0;B<y;++B)C.push(we((T(),M)[b+4*B>>>2>>>0]));return p={label:It(p+4),bindGroupLayouts:C,immediateSize:(T(),M)[p+20>>>2>>>0]},y=we(d),d=As(0),p=y.createPipelineLayout(p),ut[d>>>0]=p,d}function _s(d,p){d>>>=0,p>>>=0,p={type:Ua[(T(),L)[p+12>>>2>>>0]],count:(T(),M)[p+16>>>2>>>0]};var y=we(d);return d=Os(0),p=y.createQuerySet(p),ut[d>>>0]=p,d}function Yt(d,p){return Xr(we(d>>>0).adapterInfo,p>>>0),1}var Yu={"core-features-and-limits":1,"depth-clip-control":2,"depth32float-stencil8":3,"texture-compression-bc":4,"texture-compression-bc-sliced-3d":5,"texture-compression-etc2":6,"texture-compression-astc":7,"texture-compression-astc-sliced-3d":8,"timestamp-query":9,"indirect-first-instance":10,"shader-f16":11,"rg11b10ufloat-renderable":12,"bgra8unorm-storage":13,"float32-filterable":14,"float32-blendable":15,"clip-distances":16,"dual-source-blending":17,subgroups:18,"texture-formats-tier1":19,"texture-formats-tier2":20,"primitive-index":21,"texture-component-swizzle":22,"subgroup-size-control":23,"chromium-experimental-unorm16-texture-formats":327692,"chromium-experimental-multi-draw-indirect":327729,"chromium-experimental-subgroup-matrix":327732};function Qi(d,p){p>>>=0;var y=we(d>>>0);d=gr(4*y.features.size);var b=0,C=0;for(let B of y.features)0<=(y=Yu[B])&&((T(),L)[d+b>>>2>>>0]=y,b+=4,C++);(T(),M)[p+4>>>2>>>0]=d,(T(),M)[p>>>2>>>0]=C}function Xu(d,p){return Bt(we(d>>>0).limits,p>>>0),1}function Zu(d,p){we(d>>>0).pushErrorScope(Da[p])}function Qu(d,p,y){p>>>=0,y>>>=0,d=we(d>>>0),p=Array.from((T(),L).subarray(y>>>2>>>0,y+4*p>>>2>>>0),b=>we(b)),d.submit(p)}function Ju(d,p,y,b,C){y=it(y),b>>>=0,C>>>=0,d=we(d>>>0),p=we(p>>>0),b=(T(),F).subarray(b>>>0,b+C>>>0),d.writeBuffer(p,y,b,0,C)}n||(function(){for(var d=t.numThreads-1;d--;)ct();$e.push(async()=>{var p=(async function(){if(!n)return Promise.all(rt.map(dt))})();ce++,await p,--ce==0&&he&&(p=he,he=null,p())})})(),n||(vt=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),q()),t.wasmBinary&&(f=t.wasmBinary),t.stackSave=()=>xe(),t.stackRestore=d=>_e(d),t.stackAlloc=d=>Jr(d),t.setValue=function(d,p,y="i8"){switch(y.endsWith("*")&&(y="*"),y){case"i1":case"i8":(T(),P)[d>>>0]=p;break;case"i16":(T(),J)[d>>>1>>>0]=p;break;case"i32":(T(),L)[d>>>2>>>0]=p;break;case"i64":(T(),ie)[d>>>3>>>0]=BigInt(p);break;case"float":(T(),ne)[d>>>2>>>0]=p;break;case"double":(T(),te)[d>>>3>>>0]=p;break;case"*":(T(),M)[d>>>2>>>0]=p;break;default:X(`invalid type for setValue: ${y}`)}},t.getValue=function(d,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":return(T(),P)[d>>>0];case"i16":return(T(),J)[d>>>1>>>0];case"i32":return(T(),L)[d>>>2>>>0];case"i64":return(T(),ie)[d>>>3>>>0];case"float":return(T(),ne)[d>>>2>>>0];case"double":return(T(),te)[d>>>3>>>0];case"*":return(T(),M)[d>>>2>>>0];default:X(`invalid type for getValue: ${p}`)}},t.UTF8ToString=Ye,t.stringToUTF8=mt,t.lengthBytesUTF8=St;var vs,$s,xs,Ji,Bn,Et,gr,Ts,Ss,Is,Es,ks,Cs,As,Os,zs,Rs,Ms,ea,ta,ra,na,Zr,ia,Bs,aa,Ds,Ns,Us,sa,Ps,Ls,oa,Me,Qr,Ws,_e,Jr,xe,l,h,x,w,A,D,V,ee,le,fe,Ae,De,Ge,He,Xt,Dn,Gs,Nn,gp,yp,bp,wp,_p,vp,$p,xp,Tp,Sp,Ip,Ep,kp,Cp,Ap,Op,zp,Rp,Mp,Bp,Dp,Np,Up,Pp,Lp,Wp,Gp,qp,Vp,yr,xv=[ue,Fe,ti,si,oi,ui,li,di,ci,pi,fi,hi,mi,gi,yi,bi,Ai,Oi,zi,Fi,Hi,ji,Ki,Yi,Xi,Zi],el={1274364:(d,p,y,b,C)=>{if(t===void 0||!t.ed)return 1;if((d=Ye(Number(d>>>0))).startsWith("./")&&(d=d.substring(2)),!(d=t.ed.get(d)))return 2;if(p=Number(p>>>0),y=Number(y>>>0),b=Number(b>>>0),p+y>d.byteLength)return 3;try{let B=d.subarray(p,p+y);switch(C){case 0:(T(),F).set(B,b>>>0);break;case 1:t.pe?t.pe(b,B):t.Re(b,B);break;default:return 4}return 0}catch{return 4}},1275188:(d,p,y)=>{t.re(d,(T(),F).subarray(p>>>0,p+y>>>0))},1275252:()=>t.Pe(),1275294:d=>{t.qe(d)},1275331:()=>typeof wasmOffsetConverter<"u"};function Tv(){return typeof wasmOffsetConverter<"u"}function Sv(d,p,y,b){var C=xe();try{return He(d,p,y,b)}catch(B){if(_e(C),B!==B+0)throw B;Me(1,0)}}function Iv(d,p,y){var b=xe();try{return Ae(d,p,y)}catch(C){if(_e(b),C!==C+0)throw C;Me(1,0)}}function Ev(d){var p=xe();try{V(d)}catch(y){if(_e(p),y!==y+0)throw y;Me(1,0)}}function kv(d,p){var y=xe();try{return D(d,p)}catch(b){if(_e(y),b!==b+0)throw b;Me(1,0)}}function Cv(d,p,y){var b=xe();try{A(d,p,y)}catch(C){if(_e(b),C!==C+0)throw C;Me(1,0)}}function Av(d,p){var y=xe();try{Xt(d,p)}catch(b){if(_e(y),b!==b+0)throw b;Me(1,0)}}function Ov(d,p,y,b,C,B,G){var W=xe();try{return fe(d,p,y,b,C,B,G)}catch(Q){if(_e(W),Q!==Q+0)throw Q;Me(1,0)}}function zv(d,p,y,b,C,B){var G=xe();try{ee(d,p,y,b,C,B)}catch(W){if(_e(G),W!==W+0)throw W;Me(1,0)}}function Rv(d,p,y,b){var C=xe();try{Ge(d,p,y,b)}catch(B){if(_e(C),B!==B+0)throw B;Me(1,0)}}function Mv(d,p,y,b,C,B,G){var W=xe();try{Gs(d,p,y,b,C,B,G)}catch(Q){if(_e(W),Q!==Q+0)throw Q;Me(1,0)}}function Bv(d,p,y,b,C,B,G){var W=xe();try{Nn(d,p,y,b,C,B,G)}catch(Q){if(_e(W),Q!==Q+0)throw Q;Me(1,0)}}function Dv(d,p,y,b,C,B,G,W){var Q=xe();try{Sp(d,p,y,b,C,B,G,W)}catch(se){if(_e(Q),se!==se+0)throw se;Me(1,0)}}function Nv(d,p,y,b,C,B,G,W,Q,se,de,Ee){var Ne=xe();try{gp(d,p,y,b,C,B,G,W,Q,se,de,Ee)}catch(je){if(_e(Ne),je!==je+0)throw je;Me(1,0)}}function Uv(d,p,y,b,C){var B=xe();try{return Dn(d,p,y,b,C)}catch(G){if(_e(B),G!==G+0)throw G;Me(1,0)}}function Pv(d,p,y,b,C,B){var G=xe();try{Ip(d,p,y,b,C,B)}catch(W){if(_e(G),W!==W+0)throw W;Me(1,0)}}function Lv(d,p,y,b,C){var B=xe();try{le(d,p,y,b,C)}catch(G){if(_e(B),G!==G+0)throw G;Me(1,0)}}function Wv(d,p,y,b,C,B,G,W){var Q=xe();try{De(d,p,y,b,C,B,G,W)}catch(se){if(_e(Q),se!==se+0)throw se;Me(1,0)}}function Gv(d){var p=xe();try{return Ep(d)}catch(y){if(_e(p),y!==y+0)throw y;Me(1,0)}}function qv(d,p,y,b,C,B,G,W,Q){var se=xe();try{bp(d,p,y,b,C,B,G,W,Q)}catch(de){if(_e(se),de!==de+0)throw de;Me(1,0)}}function Vv(d,p,y){var b=xe();try{return kp(d,p,y)}catch(C){if(_e(b),C!==C+0)throw C;Me(1,0)}}function Fv(d,p){var y=xe();try{return Lp(d,p)}catch(b){if(_e(y),b!==b+0)throw b;return Me(1,0),0n}}function Hv(d,p,y,b){var C=xe();try{return Cp(d,p,y,b)}catch(B){if(_e(C),B!==B+0)throw B;Me(1,0)}}function jv(d){var p=xe();try{return yp(d)}catch(y){if(_e(p),y!==y+0)throw y;return Me(1,0),0n}}function Kv(d,p,y,b){var C=xe();try{return Ap(d,p,y,b)}catch(B){if(_e(C),B!==B+0)throw B;Me(1,0)}}function Yv(d,p,y,b,C){var B=xe();try{return Op(d,p,y,b,C)}catch(G){if(_e(B),G!==G+0)throw G;Me(1,0)}}function Xv(d,p,y,b,C,B){var G=xe();try{return zp(d,p,y,b,C,B)}catch(W){if(_e(G),W!==W+0)throw W;Me(1,0)}}function Zv(d,p,y,b,C,B){var G=xe();try{return xp(d,p,y,b,C,B)}catch(W){if(_e(G),W!==W+0)throw W;Me(1,0)}}function Qv(d,p,y,b,C,B){var G=xe();try{return Rp(d,p,y,b,C,B)}catch(W){if(_e(G),W!==W+0)throw W;Me(1,0)}}function Jv(d,p,y,b,C,B,G,W){var Q=xe();try{return Tp(d,p,y,b,C,B,G,W)}catch(se){if(_e(Q),se!==se+0)throw se;Me(1,0)}}function e1(d,p,y,b,C){var B=xe();try{return Mp(d,p,y,b,C)}catch(G){if(_e(B),G!==G+0)throw G;return Me(1,0),0n}}function t1(d,p,y,b){var C=xe();try{return Bp(d,p,y,b)}catch(B){if(_e(C),B!==B+0)throw B;Me(1,0)}}function r1(d,p,y,b){var C=xe();try{return Dp(d,p,y,b)}catch(B){if(_e(C),B!==B+0)throw B;Me(1,0)}}function n1(d,p,y,b,C,B,G,W,Q,se,de,Ee){var Ne=xe();try{return Np(d,p,y,b,C,B,G,W,Q,se,de,Ee)}catch(je){if(_e(Ne),je!==je+0)throw je;Me(1,0)}}function i1(d,p,y,b,C,B,G,W,Q,se,de){var Ee=xe();try{Up(d,p,y,b,C,B,G,W,Q,se,de)}catch(Ne){if(_e(Ee),Ne!==Ne+0)throw Ne;Me(1,0)}}function a1(d,p,y,b,C,B,G,W,Q,se,de,Ee,Ne,je,en,ua){var d1=xe();try{Pp(d,p,y,b,C,B,G,W,Q,se,de,Ee,Ne,je,en,ua)}catch(tl){if(_e(d1),tl!==tl+0)throw tl;Me(1,0)}}function s1(d,p,y){var b=xe();try{return _p(d,p,y)}catch(C){if(_e(b),C!==C+0)throw C;return Me(1,0),0n}}function o1(d,p,y){var b=xe();try{return wp(d,p,y)}catch(C){if(_e(b),C!==C+0)throw C;Me(1,0)}}function u1(d,p,y){var b=xe();try{return vp(d,p,y)}catch(C){if(_e(b),C!==C+0)throw C;Me(1,0)}}function l1(d,p,y,b){var C=xe();try{$p(d,p,y,b)}catch(B){if(_e(C),B!==B+0)throw B;Me(1,0)}}function qs(){if(0<ce)he=qs;else if(n)v==null||v(t),K();else{for(var d=$e;0<d.length;)d.shift()(t);0<ce?he=qs:(t.calledRun=!0,R||(K(),v==null||v(t)))}}return n||(yr=await pe(),qs()),t.PTR_SIZE=4,t.webgpuInit=d=>{let p=new WeakMap,y,b,C=1;t.webgpuRegisterDevice=W=>{if(b!==void 0)throw Error("another WebGPU EP inference session is being created.");if(W){var Q=p.get(W);if(!Q){let se=((de,Ee=0)=>{var Ne=Ms(Ee);return Ee=Rs(Ee,Ne),ut[Ne>>>0]=de.queue,ut[Ee>>>0]=de,Ee})(W,Q=xs());Q=[C++,Q,se],p.set(W,Q)}return y=W,b=Q[0],Q}y=void 0,b=0};let B=new Map;t.webgpuOnCreateSession=W=>{if(b!==void 0){var Q=b;if(b=void 0,W){let se=Ji(Q);B.set(W,se),Q===0&&d(y??we(se))}y=void 0}},t.webgpuOnReleaseSession=W=>{B.delete(W)};let G=Symbol("gpuBufferMetadata");t.webgpuRegisterBuffer=(W,Q,se)=>{if(se)return W[G]=[se,NaN],se;if(se=W[G])return se[1]++,se[0];if((Q=B.get(Q))===void 0)throw Error("Invalid session handle passed to webgpuRegisterBuffer");return Q=((de,Ee=0)=>(de.mapState==="unmapped"||X(),Ee=zs(Ee),ut[Ee>>>0]=de,Ee))(W,Q),W[G]=[Q,1],Q},t.webgpuUnregisterBuffer=W=>{let Q=W[G];if(!Q)throw Error("Buffer is not registered");Q[1]--,Q[1]===0&&(Ts(Q[0]),delete W[G])},t.webgpuGetBuffer=W=>we(W),t.webgpuCreateDownloader=(W,Q,se)=>{if((se=B.get(se))===void 0)throw Error("Invalid session handle passed to webgpuRegisterBuffer");let de=we(se),Ee=16*Math.ceil(Number(Q)/16);return async()=>{let Ne=de.createBuffer({size:Ee,usage:9});try{let je=de.createCommandEncoder();return je.copyBufferToBuffer(W,0,Ne,0,Ee),de.queue.submit([je.finish()]),await Ne.mapAsync(GPUMapMode.READ),Ne.getMappedRange().slice(0,Q)}finally{Ne.destroy()}}},t.pe=(W,Q)=>{var se=Q.buffer;let de=Q.byteOffset,Ee=Q.byteLength;if(Q=16*Math.ceil(Number(Ee)/16),W=we(W),!y){var Ne=Ji(b);y=we(Ne)}let je=(Ne=y.createBuffer({mappedAtCreation:!0,size:Q,usage:6})).getMappedRange();new Uint8Array(je).set(new Uint8Array(se,de,Ee)),Ne.unmap(),(se=y.createCommandEncoder()).copyBufferToBuffer(Ne,0,W,0,Q),y.queue.submit([se.finish()]),Ne.destroy()}},t.webnnInit=d=>{let p=d[0];[t.Pe,t.qe,t.webnnEnsureTensor,t.re,t.webnnDownloadTensor,t.Oe,t.webnnEnableTraceEvent]=d.slice(1),t.webnnReleaseTensorId=t.qe,t.webnnUploadTensor=t.re,t.webnnRegisterMLContext=t.Oe,t.webnnOnRunStart=y=>p.onRunStart(y),t.webnnOnRunEnd=p.onRunEnd.bind(p),t.webnnOnReleaseSession=y=>{p.onReleaseSession(y)},t.webnnCreateMLTensorDownloader=(y,b)=>p.createMLTensorDownloader(y,b),t.webnnRegisterMLTensor=(y,b,C,B)=>p.registerMLTensor(y,b,C,B),t.webnnCreateMLContext=y=>p.createMLContext(y),t.webnnRegisterGraphInput=p.registerGraphInput.bind(p),t.webnnIsGraphInput=p.isGraphInput.bind(p),t.webnnRegisterGraphOutput=p.registerGraphOutput.bind(p),t.webnnIsGraphOutput=p.isGraphOutput.bind(p),t.webnnCreateTemporaryTensor=p.createTemporaryTensor.bind(p),t.webnnIsGraphInputOutputTypeSupported=p.isGraphInputOutputTypeSupported.bind(p)},j?t:new Promise((d,p)=>{v=d,S=p})}var sy,Yp,M1=Ue(()=>{"use strict";var e,t;sy=Kp,Yp=(t=(e=globalThis.self)==null?void 0:e.name)==null?void 0:t.startsWith("em-pthread"),Yp&&Kp()}),ol,Yd,Xp,Dt,oy,Fs,Zp,Qp,ul,Jp,ll,uy,dl,ly,Tc=Ue(()=>{"use strict";xc(),ol=typeof location>"u"?void 0:location.origin,Yd=self.location.href>"file:"&&self.location.href<"file;",Xp=()=>{if(Yd){let e=URL;return new URL(new e("ort.webgpu.bundle.min.mjs",self.location.href).href,ol).href}return self.location.href},Dt=Xp(),oy=()=>{if(Dt&&!Dt.startsWith("blob:"))return Dt.substring(0,Dt.lastIndexOf("/")+1)},Fs=(e,t)=>{try{let r=t??Dt;return(r?new URL(e,r):new URL(e)).origin===ol}catch{return!1}},Zp=(e,t)=>{let r=t??Dt;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Qp=(e,t)=>`${t??"./"}${e}`,ul=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Jp=async e=>(await import(e)).default,ll=(R1(),bo(ny)).default,uy=async()=>{if(!Dt)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Fs(Dt))return[void 0,ll()];let e=await ul(Dt);return[e,ll(e)]},dl=(M1(),bo(ay)).default,ly=async(e,t,r,i)=>{let n=dl&&!(e||t);if(n)if(Dt)n=Fs(Dt)||i&&!r;else if(i&&!r)n=!0;else throw new Error("cannot determine the script source URL.");if(n)return[void 0,dl];{let s="ort-wasm-simd-threaded.asyncify.mjs",a=e??Zp(s,t),o=r&&a&&!Fs(a,t),u=o?await ul(a):a??Qp(s,t);return[o?u:void 0,await Jp(u)]}}}),cl,Hs,da,pl,ef,tf,rf,Sc,Ke,xn=Ue(()=>{"use strict";Tc(),Hs=!1,da=!1,pl=!1,ef=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},tf=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},rf=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Sc=async e=>{if(Hs)return Promise.resolve();if(da)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(pl)throw new Error("previous call to 'initializeWebAssembly()' failed.");da=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!rf())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!tf())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=ef();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,s=typeof n=="string"?n:void 0,a=n==null?void 0:n.mjs,o=(a==null?void 0:a.href)??a,u=n==null?void 0:n.wasm,c=(u==null?void 0:u.href)??u,m=e.wasmBinary,[f,g]=await ly(o,s,r>1,!!m||!!c),_=!1,v=[];if(t>0&&v.push(new Promise(S=>{setTimeout(()=>{_=!0,S()},t)})),v.push(new Promise((S,k)=>{let E={numThreads:r};if(m)E.wasmBinary=m,E.locateFile=I=>I;else if(c||s)E.locateFile=I=>c??s+I;else if(o&&o.indexOf("blob:")!==0)E.locateFile=I=>new URL(I,o).href;else if(f){let I=oy();I&&(E.locateFile=O=>I+O)}g(E).then(I=>{da=!1,Hs=!0,cl=I,S(),f&&URL.revokeObjectURL(f)},I=>{da=!1,pl=!0,k(I)})})),await Promise.race(v),_)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},Ke=()=>{if(Hs&&cl)return cl;throw new Error("WebAssembly is not initialized yet.")}}),Ut,_o,qe,Ic=Ue(()=>{"use strict";xn(),Ut=(e,t)=>{let r=Ke(),i=r.lengthBytesUTF8(e)+1,n=r._malloc(i);return r.stringToUTF8(e,n,i),t.push(n),n},_o=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,s])=>{let a=t?t+n:n;if(typeof s=="object")_o(s,a+".",r,i);else if(typeof s=="string"||typeof s=="number")i(a,s.toString());else if(typeof s=="boolean")i(a,s?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof s}`)})},qe=e=>{let t=Ke(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetLastError(n,n+i);let s=Number(t.getValue(n,i===4?"i32":"i64")),a=t.getValue(n+i,"*"),o=a?t.UTF8ToString(a):"";throw new Error(`${e} ERROR_CODE: ${s}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(r)}}}),dy,B1=Ue(()=>{"use strict";xn(),Ic(),dy=e=>{let t=Ke(),r=0,i=[],n=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)n.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)n.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(n.terminate=!1);let s=0;return(e==null?void 0:e.tag)!==void 0&&(s=Ut(e.tag,i)),r=t._OrtCreateRunOptions(n.logSeverityLevel,n.logVerbosityLevel,!!n.terminate,s),r===0&&qe("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&_o(e.extra,"",new WeakSet,(a,o)=>{let u=Ut(a,i),c=Ut(o,i);t._OrtAddRunConfigEntry(r,u,c)!==0&&qe(`Can't set a run config entry: ${a} - ${o}.`)}),[r,i]}catch(s){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(a=>t._free(a)),s}}}),nf,af,sf,Un,br,of,cy,D1=Ue(()=>{"use strict";xn(),Ic(),nf=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},af=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},sf=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},Un=(e,t,r,i)=>{let n=Ut(t,i),s=Ut(r,i);Ke()._OrtAddSessionConfigEntry(e,n,s)!==0&&qe(`Can't set a session config entry: ${t} - ${r}.`)},br=(e,t,r,i)=>{let n=Ut(t,i),s=Ut(r,i);e.push([n,s])},of=async(e,t,r)=>{let i=t.executionProviders;for(let n of i){let s=typeof n=="string"?n:n.name,a=[];switch(s){case"webnn":if(s="WEBNN",Un(e,"session.disable_quant_qdq","1",r),Un(e,"session.disable_qdq_constant_folding","1",r),typeof n!="string"){let f=n==null?void 0:n.deviceType;f&&Un(e,"deviceType",f,r)}break;case"webgpu":{s="WebGPU";let f;if(typeof n!="string"){let _=n;if(_.device)if(typeof GPUDevice<"u"&&_.device instanceof GPUDevice)f=_.device;else throw new Error("Invalid GPU device set in WebGPU EP options.");let{enableGraphCapture:v}=t;if(typeof v=="boolean"&&v&&br(a,"enableGraphCapture","1",r),typeof _.preferredLayout=="string"&&br(a,"preferredLayout",_.preferredLayout,r),_.forceCpuNodeNames){let S=Array.isArray(_.forceCpuNodeNames)?_.forceCpuNodeNames:[_.forceCpuNodeNames];br(a,"forceCpuNodeNames",S.join(`
`),r)}_.validationMode&&br(a,"validationMode",_.validationMode,r);for(let S of["storageBufferCacheMode","uniformBufferCacheMode","queryResolveBufferCacheMode","defaultBufferCacheMode"]){let k=_[S];if(k){if(k!=="disabled"&&k!=="lazyRelease"&&k!=="simple"&&k!=="bucket")throw new Error(`${S} must be one of 'disabled', 'lazyRelease', 'simple' or 'bucket': ${k}`);br(a,S,k,r)}}}let g=Ke().webgpuRegisterDevice(f);if(g){let[_,v,S]=g;br(a,"deviceId",_.toString(),r),br(a,"webgpuInstance",v.toString(),r),br(a,"webgpuDevice",S.toString(),r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${s}`)}let o=Ut(s,r),u=a.length,c=0,m=0;if(u>0){c=Ke()._malloc(u*Ke().PTR_SIZE),r.push(c),m=Ke()._malloc(u*Ke().PTR_SIZE),r.push(m);for(let f=0;f<u;f++)Ke().setValue(c+f*Ke().PTR_SIZE,a[f][0],"*"),Ke().setValue(m+f*Ke().PTR_SIZE,a[f][1],"*")}await Ke()._OrtAppendExecutionProvider(e,o,c,m,u)!==0&&qe(`Can't append execution provider: ${s}.`)}},cy=async e=>{let t=Ke(),r=0,i=[],n=e||{};sf(n);try{let s=nf(n.graphOptimizationLevel??"all"),a=af(n.executionMode??"sequential"),o=typeof n.logId=="string"?Ut(n.logId,i):0,u=n.logSeverityLevel??2;if(!Number.isInteger(u)||u<0||u>4)throw new Error(`log severity level is not valid: ${u}`);let c=n.logVerbosityLevel??0;if(!Number.isInteger(c)||c<0||c>4)throw new Error(`log verbosity level is not valid: ${c}`);let m=typeof n.optimizedModelFilePath=="string"?Ut(n.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(s,!!n.enableCpuMemArena,!!n.enableMemPattern,a,!!n.enableProfiling,0,o,u,c,m),r===0&&qe("Can't create session options."),n.executionProviders&&await of(r,n,i),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);Un(r,"enableGraphCapture",n.enableGraphCapture.toString(),i)}if(n.freeDimensionOverrides)for(let[f,g]of Object.entries(n.freeDimensionOverrides)){if(typeof f!="string")throw new Error(`free dimension override name must be a string: ${f}`);if(typeof g!="number"||!Number.isInteger(g)||g<0)throw new Error(`free dimension override value must be a non-negative integer: ${g}`);let _=Ut(f,i);t._OrtAddFreeDimensionOverride(r,_,g)!==0&&qe(`Can't set a free dimension override: ${f} - ${g}.`)}return n.extra!==void 0&&_o(n.extra,"",new WeakSet,(f,g)=>{Un(r,f,g,i)}),[r,i]}catch(s){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&qe("Can't release session options."),i.forEach(a=>t._free(a)),s}}}),dn,ho,Wn,za,vo,Ec,kc,Xd,Zn=Ue(()=>{"use strict";dn=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},ho=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Wn=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((n,s)=>n*s,1);return r>0?Math.ceil(i*r):void 0},za=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},vo=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Ec=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",kc=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Xd=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Cc,py=Ue(()=>{"use strict";xc(),Cc=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),s;try{s=new ArrayBuffer(i)}catch(o){if(o instanceof RangeError){let u=Math.ceil(i/65536);s=new WebAssembly.Memory({initial:u,maximum:u}).buffer}else throw o}let a=0;for(;;){let{done:o,value:u}=await n.read();if(o)break;let c=u.byteLength;new Uint8Array(s,a,c).set(u),a+=c}return new Uint8Array(s,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),fy,N1=Ue(()=>{"use strict";Zn(),fy=(e,t)=>new(za(t))(e)}),uf,lf,df,cf,hy,pf,Tt,my=Ue(()=>{"use strict";Zn(),uf=["V","I","W","E","F"],lf=(e,t)=>{console.log(`[${uf[e]},${new Date().toISOString()}]${t}`)},hy=(e,t)=>{df=e,cf=t},pf=(e,t)=>{let r=vo(e),i=vo(df);r>=i&&lf(r,typeof t=="function"?t():t)},Tt=(...e)=>{cf&&pf(...e)}}),fl,ff,hl,hf,ml,mf,gl,yl,bl,gf,gy,U1=Ue(()=>{"use strict";Zn(),my(),fl=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),ff=(e,t)=>{if(t==="int32")return e;let r=fl.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let n=e.byteLength/i,s=new(za(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let a=new Int32Array(n);for(let o=0;o<n;o++){let u=s[o];if(u>2147483647n||u<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");a[o]=Number(u)}return new Uint8Array(a.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&s.some(o=>o>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let a=Int32Array.from(s,Number);return new Uint8Array(a.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},hl=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"uint64":{if(i.some(s=>s<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(i.some(s=>s<-128||s>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let n=Int8Array.from(i,Number);return new Uint8Array(n.buffer)}case"uint8":{if(i.some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(s=>s<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let n=Uint32Array.from(i,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},hf=1,ml=()=>hf++,mf=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),gl=(e,t)=>{let r=fl.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,n)=>i*n)*r/8):0},yl=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:n,shape:s,fallbackDataType:a}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=n,this.tensorShape=s,this.fallbackDataType=a}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return gl(this.dataType,this.tensorShape)}destroy(){Tt("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=hl(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,n)=>i===r[n])}setIsDataConverted(e){this.isDataConverted=e}},bl=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let n=this.tensorManager.getMLContext(e),s=this.tensorManager.getMLOpSupportLimits(e),a;if(!(s!=null&&s.input.dataTypes.includes(t))){if(a=mf.get(t),!a||!(s!=null&&s.input.dataTypes.includes(a)))throw new Error(`WebNN backend does not support data type: ${t}`);Tt("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${a}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==gl(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let o=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,o,!0,!0,a),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=ff(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else Tt("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,r;if(this.activeUpload){let i=(t=this.wrapper)!=null&&t.isDataConverted?hl(this.activeUpload,(r=this.wrapper)==null?void 0:r.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(i):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(i);return}else return i.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},gf=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=ml();return this.tensorTrackersById.set(e,new bl(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,n){Tt("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${n}}`);let s=this.tensorTrackersById.get(t);if(!s)throw new Error("Tensor not found.");return s.ensureTensor(e,r,i,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){Tt("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let n=this.getMLContext(e),s=ml(),a=new yl({sessionId:e,context:n,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(s,new bl(this,a)),this.externalTensors.add(a),s}async getCachedTensor(e,t,r,i,n,s,a){let o=this.getMLContext(e);for(let[c,m]of this.freeTensors.entries())if(m.canReuseTensor(o,t,r)){Tt("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${a?`fallbackDataType: ${a},`:""} shape: ${r}`);let f=this.freeTensors.splice(c,1)[0];return f.sessionId=e,f}Tt("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${a?`fallbackDataType: ${a},`:""} shape: ${r}}`);let u=await o.createTensor({dataType:a??t,shape:r,dimensions:r,usage:i,writable:n,readable:s});return new yl({sessionId:e,context:o,tensor:u,dataType:t,shape:r,fallbackDataType:a})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},gy=(...e)=>new gf(...e)}),yy={};Ba(yy,{WebNNBackend:()=>by});var ca,yf,by,P1=Ue(()=>{"use strict";Zn(),xn(),N1(),U1(),my(),ca=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),yf=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((n,s)=>n===i[s]&&e[n]===t[n])},by=class{constructor(e){this.tensorManager=gy(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,hy(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){Tt("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){Tt("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)Tt("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>yf(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(n=>n.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){Tt("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,n){let s=ca.get(r);if(!s)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,s,i,n)}async createTemporaryTensor(e,t,r){Tt("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=ca.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,i,r,!1);let s=this.temporarySessionTensorIds.get(e);return s?s.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!Ke().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");Tt("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return fy(r,t)}}registerMLTensor(e,t,r,i){let n=ca.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let s=this.tensorManager.registerTensor(e,t,n,i);return Tt("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${i}} -> {tensorId: ${s}}`),s}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=ca.get(dn(t)),n=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!(n!=null&&n.input.dataTypes.includes(i)):!!(n!=null&&n.output.dataTypes.includes(i))}flush(){}}}),bf,Ac,Oc,Ir,wf,wl,$o,zc,Rc,_l,Mc,Bc,Dc,wy=Ue(()=>{"use strict";$n(),B1(),D1(),Zn(),xn(),Ic(),py(),bf=(e,t)=>{Ke()._OrtInit(e,t)!==0&&qe("Can't initialize onnxruntime.")},Ac=async e=>{bf(e.wasm.numThreads,vo(e.logLevel))},Oc=async(e,t)=>{var i,n;(n=(i=Ke()).asyncInit)==null||n.call(i);let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let s=e.webgpu.powerPreference;if(s!==void 0&&s!=="low-power"&&s!=="high-performance")throw new Error(`Invalid powerPreference setting: "${s}"`);let a=e.webgpu.forceFallbackAdapter;if(a!==void 0&&typeof a!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${a}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:s,forceFallbackAdapter:a}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");if(t==="webgpu"&&Ke().webgpuInit(s=>{e.webgpu.device=s}),t==="webnn"){let s=new(P1(),bo(yy)).WebNNBackend(e);Ke().webnnInit([s,()=>s.reserveTensorId(),a=>s.releaseTensorId(a),async(a,o,u,c,m)=>s.ensureTensor(a,o,u,c,m),(a,o)=>{s.uploadTensor(a,o)},async(a,o)=>s.downloadTensor(a,o),(a,o)=>s.registerMLContext(a,o),!!e.trace])}},Ir=new Map,wf=e=>{let t=Ke(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,n,n+i)!==0&&qe("Can't get session input/output count.");let s=i===4?"i32":"i64";return[Number(t.getValue(n,s)),Number(t.getValue(n+i,s))]}finally{t.stackRestore(r)}},wl=(e,t)=>{let r=Ke(),i=r.stackSave(),n=0;try{let s=r.PTR_SIZE,a=r.stackAlloc(2*s);r._OrtGetInputOutputMetadata(e,t,a,a+s)!==0&&qe("Can't get session input/output metadata.");let o=Number(r.getValue(a,"*"));n=Number(r.getValue(a+s,"*"));let u=r.HEAP32[n/4];if(u===0)return[o,0];let c=r.HEAPU32[n/4+1],m=[];for(let f=0;f<c;f++){let g=Number(r.getValue(n+8+f*s,"*"));m.push(g!==0?r.UTF8ToString(g):Number(r.getValue(n+8+(f+c)*s,"*")))}return[o,u,m]}finally{r.stackRestore(i),n!==0&&r._OrtFree(n)}},$o=e=>{let t=Ke(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},zc=async(e,t)=>{var f,g,_,v;let r,i,n=Ke();Array.isArray(e)?[r,i]=e:e.buffer===n.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=$o(e);let s=0,a=0,o=0,u=[],c=[],m=[];try{if([a,u]=await cy(t),(t==null?void 0:t.externalData)&&n.mountExternalData){let $=[];for(let P of t.externalData){let F=typeof P=="string"?P:P.path,J=typeof P=="string"?P:P.data;$.push(Cc(J).then(H=>{n.mountExternalData(F,H)}))}await Promise.all($)}for(let $ of(t==null?void 0:t.executionProviders)??[])if((typeof $=="string"?$:$.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof $!="string"){let P=$,F=P==null?void 0:P.context,J=P==null?void 0:P.gpuDevice,H=P==null?void 0:P.deviceType,L=P==null?void 0:P.powerPreference;F?n.currentContext=F:J?n.currentContext=await n.webnnCreateMLContext(J):n.currentContext=await n.webnnCreateMLContext({deviceType:H,powerPreference:L})}else n.currentContext=await n.webnnCreateMLContext();break}s=await n._OrtCreateSession(r,i,a),(f=n.webgpuOnCreateSession)==null||f.call(n,s),s===0&&qe("Can't create a session."),(g=n.jsepOnCreateSession)==null||g.call(n),n.currentContext&&(n.webnnRegisterMLContext(s,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[S,k]=wf(s),E=!!(t!=null&&t.enableGraphCapture),I=[],O=[],z=[],R=[],N=[];for(let $=0;$<S;$++){let[P,F,J]=wl(s,$);P===0&&qe("Can't get an input name."),c.push(P);let H=n.UTF8ToString(P);I.push(H),z.push(F===0?{name:H,isTensor:!1}:{name:H,isTensor:!0,type:ho(F),shape:J})}for(let $=0;$<k;$++){let[P,F,J]=wl(s,$+S);P===0&&qe("Can't get an output name."),m.push(P);let H=n.UTF8ToString(P);O.push(H),R.push(F===0?{name:H,isTensor:!1}:{name:H,isTensor:!0,type:ho(F),shape:J});{if(E&&(t==null?void 0:t.preferredOutputLocation)===void 0){N.push("gpu-buffer");continue}let L=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((_=t==null?void 0:t.preferredOutputLocation)==null?void 0:_[H])??"cpu",M=n.webnnIsGraphOutput;if(L==="cpu"&&M&&M(s,H)){N.push("ml-tensor-cpu-output");continue}if(L!=="cpu"&&L!=="cpu-pinned"&&L!=="gpu-buffer"&&L!=="ml-tensor")throw new Error(`Not supported preferred output location: ${L}.`);if(E&&L!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${L}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);N.push(L)}}let T=null;return N.some($=>$==="gpu-buffer"||$==="ml-tensor"||$==="ml-tensor-cpu-output")&&(o=n._OrtCreateBinding(s),o===0&&qe("Can't create IO binding."),T={handle:o,outputPreferredLocations:N,outputPreferredLocationsEncoded:N.map($=>$==="ml-tensor-cpu-output"?"ml-tensor":$).map($=>Xd($))}),Ir.set(s,[s,c,m,T,E,!1]),[s,I,O,z,R]}catch(S){throw c.forEach(k=>n._OrtFree(k)),m.forEach(k=>n._OrtFree(k)),o!==0&&n._OrtReleaseBinding(o)!==0&&qe("Can't release IO binding."),s!==0&&n._OrtReleaseSession(s)!==0&&qe("Can't release session."),S}finally{n._free(r),a!==0&&n._OrtReleaseSessionOptions(a)!==0&&qe("Can't release session options."),u.forEach(S=>n._free(S)),(v=n.unmountExternalData)==null||v.call(n)}},Rc=e=>{var u,c,m;let t=Ke(),r=Ir.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,n,s,a,o]=r;a&&(o&&t._OrtClearBoundOutputs(a.handle)!==0&&qe("Can't clear bound outputs."),t._OrtReleaseBinding(a.handle)!==0&&qe("Can't release IO binding.")),(u=t.jsepOnReleaseSession)==null||u.call(t,e),(c=t.webnnOnReleaseSession)==null||c.call(t,e),(m=t.webgpuOnReleaseSession)==null||m.call(t,e),n.forEach(f=>t._OrtFree(f)),s.forEach(f=>t._OrtFree(f)),t._OrtReleaseSession(i)!==0&&qe("Can't release session."),Ir.delete(e)},_l=async(e,t,r,i,n,s,a=!1)=>{if(!e){t.push(0);return}let o=Ke(),u=o.PTR_SIZE,c=e[0],m=e[1],f=e[3],g=f,_,v;if(c==="string"&&(f==="gpu-buffer"||f==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(a&&f!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${s} when enableGraphCapture is true.`);if(f==="gpu-buffer"){let E=e[2].gpuBuffer;v=Wn(dn(c),m);{let I=o.webgpuRegisterBuffer;if(!I)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');_=I(E,i)}}else if(f==="ml-tensor"){let E=e[2].mlTensor;v=Wn(dn(c),m);let I=o.webnnRegisterMLTensor;if(!I)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');_=I(i,E,dn(c),m)}else{let E=e[2];if(Array.isArray(E)){v=u*E.length,_=o._malloc(v),r.push(_);for(let I=0;I<E.length;I++){if(typeof E[I]!="string")throw new TypeError(`tensor data at index ${I} is not a string`);o.setValue(_+I*u,Ut(E[I],r),"*")}}else{let I=o.webnnIsGraphInput,O=o.webnnIsGraphOutput;if(c!=="string"&&I&&O){let z=o.UTF8ToString(n);if(I(i,z)||O(i,z)){let R=dn(c);v=Wn(R,m),g="ml-tensor";let N=o.webnnCreateTemporaryTensor,T=o.webnnUploadTensor;if(!N||!T)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let $=await N(i,R,m);T($,new Uint8Array(E.buffer,E.byteOffset,E.byteLength)),_=$}else v=E.byteLength,_=o._malloc(v),r.push(_),o.HEAPU8.set(new Uint8Array(E.buffer,E.byteOffset,v),_)}else v=E.byteLength,_=o._malloc(v),r.push(_),o.HEAPU8.set(new Uint8Array(E.buffer,E.byteOffset,v),_)}}let S=o.stackSave(),k=o.stackAlloc(4*m.length);try{m.forEach((I,O)=>o.setValue(k+O*u,I,u===4?"i32":"i64"));let E=o._OrtCreateTensor(dn(c),_,v,k,m.length,Xd(g));E===0&&qe(`Can't create tensor for input/output. session=${i}, index=${s}.`),t.push(E)}finally{o.stackRestore(S)}},Mc=async(e,t,r,i,n,s)=>{var H,L,M,ne;let a=Ke(),o=a.PTR_SIZE,u=Ir.get(e);if(!u)throw new Error(`cannot run inference. invalid session id: ${e}`);let c=u[0],m=u[1],f=u[2],g=u[3],_=u[4],v=u[5],S=t.length,k=i.length,E=0,I=[],O=[],z=[],R=[],N=[],T=a.stackSave(),$=a.stackAlloc(S*o),P=a.stackAlloc(S*o),F=a.stackAlloc(k*o),J=a.stackAlloc(k*o);try{[E,I]=dy(s),hn("wasm prepareInputOutputTensor");for(let U=0;U<S;U++)await _l(r[U],O,R,e,m[t[U]],t[U],_);for(let U=0;U<k;U++)await _l(n[U],z,R,e,f[i[U]],S+i[U],_);mn("wasm prepareInputOutputTensor");for(let U=0;U<S;U++)a.setValue($+U*o,O[U],"*"),a.setValue(P+U*o,m[t[U]],"*");for(let U=0;U<k;U++)a.setValue(F+U*o,z[U],"*"),a.setValue(J+U*o,f[i[U]],"*");if(g&&!v){let{handle:U,outputPreferredLocations:j,outputPreferredLocationsEncoded:q}=g;if(m.length!==S)throw new Error(`input count from feeds (${S}) is expected to be always equal to model's input count (${m.length}).`);hn("wasm bindInputsOutputs");for(let K=0;K<S;K++){let X=t[K];await a._OrtBindInput(U,m[X],O[K])!==0&&qe(`Can't bind input[${K}] for session=${e}.`)}for(let K=0;K<k;K++){let X=i[K];(H=n[K])!=null&&H[3]?(N.push(z[K]),a._OrtBindOutput(U,f[X],z[K],0)!==0&&qe(`Can't bind pre-allocated output[${K}] for session=${e}.`)):a._OrtBindOutput(U,f[X],0,q[X])!==0&&qe(`Can't bind output[${K}] to ${j[K]} for session=${e}.`)}mn("wasm bindInputsOutputs"),Ir.set(e,[c,m,f,g,_,!0])}(L=a.jsepOnRunStart)==null||L.call(a,c),(M=a.webnnOnRunStart)==null||M.call(a,c);let te;g?te=await a._OrtRunWithBinding(c,g.handle,k,F,E):te=await a._OrtRun(c,P,$,S,J,k,F,E),te!==0&&qe("failed to call OrtRun().");let ie=[],me=[];hn("wasm ProcessOutputTensor");for(let U=0;U<k;U++){let j=Number(a.getValue(F+U*o,"*"));if(j===z[U]||N.includes(z[U])){ie.push(n[U]),j!==z[U]&&a._OrtReleaseTensor(j)!==0&&qe("Can't release tensor.");continue}let q=a.stackSave(),K=a.stackAlloc(4*o),X=!1,Y,pe=0;try{a._OrtGetTensorData(j,K,K+o,K+2*o,K+3*o)!==0&&qe(`Can't access output tensor data on index ${U}.`);let Ce=o===4?"i32":"i64",Se=Number(a.getValue(K,Ce));pe=a.getValue(K+o,"*");let $e=a.getValue(K+o*2,"*"),ce=Number(a.getValue(K+o*3,Ce)),he=[];for(let oe=0;oe<ce;oe++)he.push(Number(a.getValue($e+oe*o,Ce)));a._OrtFree($e)!==0&&qe("Can't free memory for tensor dims.");let Ie=he.reduce((oe,ue)=>oe*ue,1);Y=ho(Se);let ve=g==null?void 0:g.outputPreferredLocations[i[U]];if(Y==="string"){if(ve==="gpu-buffer"||ve==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let oe=[];for(let ue=0;ue<Ie;ue++){let Fe=a.getValue(pe+ue*o,"*"),lt=a.getValue(pe+(ue+1)*o,"*"),rt=ue===Ie-1?void 0:lt-Fe;oe.push(a.UTF8ToString(Fe,rt))}ie.push([Y,he,oe,"cpu"])}else if(ve==="gpu-buffer"&&Ie>0){let oe=a.webgpuGetBuffer;if(!oe)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let ue=oe(pe),Fe=Wn(Se,Ie);if(Fe===void 0||!Ec(Y))throw new Error(`Unsupported data type: ${Y}`);X=!0;{a.webgpuRegisterBuffer(ue,e,pe);let lt=a.webgpuCreateDownloader(ue,Fe,e);ie.push([Y,he,{gpuBuffer:ue,download:async()=>{let rt=await lt();return new(za(Y))(rt)},dispose:()=>{a._OrtReleaseTensor(j)!==0&&qe("Can't release tensor.")}},"gpu-buffer"])}}else if(ve==="ml-tensor"&&Ie>0){let oe=a.webnnEnsureTensor,ue=a.webnnIsGraphInputOutputTypeSupported;if(!oe||!ue)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Wn(Se,Ie)===void 0||!kc(Y))throw new Error(`Unsupported data type: ${Y}`);if(!ue(e,Y,!1))throw new Error(`preferredLocation "ml-tensor" for ${Y} output is not supported by current WebNN Context.`);let Fe=await oe(e,pe,Se,he,!1);X=!0,ie.push([Y,he,{mlTensor:Fe,download:a.webnnCreateMLTensorDownloader(pe,Y),dispose:()=>{a.webnnReleaseTensorId(pe),a._OrtReleaseTensor(j)}},"ml-tensor"])}else if(ve==="ml-tensor-cpu-output"&&Ie>0){let oe=a.webnnCreateMLTensorDownloader(pe,Y)(),ue=ie.length;X=!0,me.push((async()=>{let Fe=[ue,await oe];return a.webnnReleaseTensorId(pe),a._OrtReleaseTensor(j),Fe})()),ie.push([Y,he,[],"cpu"])}else{let oe=za(Y),ue=new oe(Ie);new Uint8Array(ue.buffer,ue.byteOffset,ue.byteLength).set(a.HEAPU8.subarray(pe,pe+ue.byteLength)),ie.push([Y,he,ue,"cpu"])}}finally{a.stackRestore(q),Y==="string"&&pe&&a._free(pe),X||a._OrtReleaseTensor(j)}}g&&!_&&(a._OrtClearBoundOutputs(g.handle)!==0&&qe("Can't clear bound outputs."),Ir.set(e,[c,m,f,g,_,!1]));for(let[U,j]of await Promise.all(me))ie[U][2]=j;return mn("wasm ProcessOutputTensor"),ie}finally{(ne=a.webnnOnRunEnd)==null||ne.call(a,c),a.stackRestore(T),r.forEach(te=>{te&&te[3]==="gpu-buffer"&&a.webgpuUnregisterBuffer(te[2].gpuBuffer)}),n.forEach(te=>{te&&te[3]==="gpu-buffer"&&a.webgpuUnregisterBuffer(te[2].gpuBuffer)}),O.forEach(te=>a._OrtReleaseTensor(te)),z.forEach(te=>a._OrtReleaseTensor(te)),R.forEach(te=>a._free(te)),E!==0&&a._OrtReleaseRunOptions(E),I.forEach(te=>a._free(te))}},Bc=e=>{let t=Ke(),r=Ir.get(e);if(!r)throw new Error("invalid session id");let i=r[0],n=t._OrtEndProfiling(i);n===0&&qe("Can't get an profile file name."),t._OrtFree(n)},Dc=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),Er,kt,Pn,pa,fa,js,vl,Ks,tn,rn,_f,_y,vy,$y,xy,Ty,Sy,Iy,Ey=Ue(()=>{"use strict";$n(),wy(),xn(),Tc(),Er=()=>!!Qe.wasm.proxy&&typeof document<"u",Pn=!1,pa=!1,fa=!1,Ks=new Map,tn=(e,t)=>{let r=Ks.get(e);r?r.push(t):Ks.set(e,[t])},rn=()=>{if(Pn||!pa||fa||!kt)throw new Error("worker not ready")},_f=e=>{switch(e.data.type){case"init-wasm":Pn=!1,e.data.err?(fa=!0,vl[1](e.data.err)):(pa=!0,vl[0]()),js&&(URL.revokeObjectURL(js),js=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Ks.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},_y=async()=>{if(!pa){if(Pn)throw new Error("multiple calls to 'initWasm()' detected.");if(fa)throw new Error("previous call to 'initWasm()' failed.");if(Pn=!0,Er())return new Promise((e,t)=>{kt==null||kt.terminate(),uy().then(([r,i])=>{try{kt=i,kt.onerror=s=>t(s),kt.onmessage=_f,vl=[e,t];let n={type:"init-wasm",in:Qe};!n.in.wasm.wasmPaths&&(r||Yd)&&(n.in.wasm.wasmPaths={wasm:new URL("ort-wasm-simd-threaded.asyncify.wasm",self.location.href).href}),kt.postMessage(n),js=r}catch(n){t(n)}},t)});try{await Sc(Qe.wasm),await Ac(Qe),pa=!0}catch(e){throw fa=!0,e}finally{Pn=!1}}},vy=async e=>{if(Er())return rn(),new Promise((t,r)=>{tn("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:Qe}};kt.postMessage(i)});await Oc(Qe,e)},$y=async e=>Er()?(rn(),new Promise((t,r)=>{tn("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};kt.postMessage(i,[e.buffer])})):$o(e),xy=async(e,t)=>{if(Er()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return rn(),new Promise((r,i)=>{tn("create",[r,i]);let n={type:"create",in:{model:e,options:{...t}}},s=[];e instanceof Uint8Array&&s.push(e.buffer),kt.postMessage(n,s)})}else return zc(e,t)},Ty=async e=>{if(Er())return rn(),new Promise((t,r)=>{tn("release",[t,r]);let i={type:"release",in:e};kt.postMessage(i)});Rc(e)},Sy=async(e,t,r,i,n,s)=>{if(Er()){if(r.some(a=>a[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(a=>a))throw new Error("pre-allocated output tensor is not supported for proxy.");return rn(),new Promise((a,o)=>{tn("run",[a,o]);let u=r,c={type:"run",in:{sessionId:e,inputIndices:t,inputs:u,outputIndices:i,options:s}};kt.postMessage(c,Dc(u))})}else return Mc(e,t,r,i,n,s)},Iy=async e=>{if(Er())return rn(),new Promise((t,r)=>{tn("end-profiling",[t,r]);let i={type:"end-profiling",in:e};kt.postMessage(i)});Bc(e)}}),$l,vf,ky,L1=Ue(()=>{"use strict";$n(),Ey(),Zn(),xc(),py(),$l=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},vf=e=>{switch(e[3]){case"cpu":return new nr(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Ec(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:n}=e[2];return nr.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:n})}case"ml-tensor":{let t=e[0];if(!kc(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:n}=e[2];return nr.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},ky=class{async fetchModelAndCopyToWasmMemory(e){return $y(await Cc(e))}async loadModel(e,t){Hn();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await xy(r,t),jn()}async dispose(){return Ty(this.sessionId)}async run(e,t,r){Hn();let i=[],n=[];Object.entries(e).forEach(f=>{let g=f[0],_=f[1],v=this.inputNames.indexOf(g);if(v===-1)throw new Error(`invalid input '${g}'`);i.push(_),n.push(v)});let s=[],a=[];Object.entries(t).forEach(f=>{let g=f[0],_=f[1],v=this.outputNames.indexOf(g);if(v===-1)throw new Error(`invalid output '${g}'`);s.push(_),a.push(v)});let o=i.map((f,g)=>$l(f,()=>`input "${this.inputNames[n[g]]}"`)),u=s.map((f,g)=>f?$l(f,()=>`output "${this.outputNames[a[g]]}"`):null),c=await Sy(this.sessionId,n,o,a,u,r),m={};for(let f=0;f<c.length;f++)m[this.outputNames[a[f]]]=s[f]??vf(c[f]);return jn(),m}startProfiling(){}endProfiling(){Iy(this.sessionId)}}}),Cy={};Ba(Cy,{OnnxruntimeWebAssemblyBackend:()=>Qd,initializeFlags:()=>Zd,wasmBackend:()=>Ay});var Zd,Qd,Ay,W1=Ue(()=>{"use strict";$n(),Ey(),L1(),Zd=()=>{(typeof Qe.wasm.initTimeout!="number"||Qe.wasm.initTimeout<0)&&(Qe.wasm.initTimeout=0);let e=Qe.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),Qe.wasm.simd=!1),typeof Qe.wasm.proxy!="boolean"&&(Qe.wasm.proxy=!1),typeof Qe.wasm.trace!="boolean"&&(Qe.wasm.trace=!1),typeof Qe.wasm.numThreads!="number"||!Number.isInteger(Qe.wasm.numThreads)||Qe.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)Qe.wasm.numThreads=1;else{let t=typeof navigator>"u"?y1("node:os").cpus().length:navigator.hardwareConcurrency;Qe.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Qd=class{async init(e){Zd(),await _y(),await vy(e)}async createInferenceSessionHandler(e,t){let r=new ky;return await r.loadModel(e,t),r}},Ay=new Qd});$n();$n();$n();var G1="1.30.0";{let e=(W1(),bo(Cy)).wasmBackend;Gn("webgpu",e,5),Gn("webnn",e,5),Gn("cpu",e,10),Gn("wasm",e,10)}Object.defineProperty(Qe.versions,"web",{value:G1,enumerable:!0});var xl={exports:{}},$f;function q1(){return $f||($f=1,(function(e){var t=(function(r){var i=Object.prototype,n=i.hasOwnProperty,s=Object.defineProperty||function(U,j,q){U[j]=q.value},a,o=typeof Symbol=="function"?Symbol:{},u=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",m=o.toStringTag||"@@toStringTag";function f(U,j,q){return Object.defineProperty(U,j,{value:q,enumerable:!0,configurable:!0,writable:!0}),U[j]}try{f({},"")}catch{f=function(j,q,K){return j[q]=K}}function g(U,j,q,K){var X=j&&j.prototype instanceof O?j:O,Y=Object.create(X.prototype),pe=new te(K||[]);return s(Y,"_invoke",{value:H(U,q,pe)}),Y}r.wrap=g;function _(U,j,q){try{return{type:"normal",arg:U.call(j,q)}}catch(K){return{type:"throw",arg:K}}}var v="suspendedStart",S="suspendedYield",k="executing",E="completed",I={};function O(){}function z(){}function R(){}var N={};f(N,u,function(){return this});var T=Object.getPrototypeOf,$=T&&T(T(ie([])));$&&$!==i&&n.call($,u)&&(N=$);var P=R.prototype=O.prototype=Object.create(N);z.prototype=R,s(P,"constructor",{value:R,configurable:!0}),s(R,"constructor",{value:z,configurable:!0}),z.displayName=f(R,m,"GeneratorFunction");function F(U){["next","throw","return"].forEach(function(j){f(U,j,function(q){return this._invoke(j,q)})})}r.isGeneratorFunction=function(U){var j=typeof U=="function"&&U.constructor;return j?j===z||(j.displayName||j.name)==="GeneratorFunction":!1},r.mark=function(U){return Object.setPrototypeOf?Object.setPrototypeOf(U,R):(U.__proto__=R,f(U,m,"GeneratorFunction")),U.prototype=Object.create(P),U},r.awrap=function(U){return{__await:U}};function J(U,j){function q(Y,pe,Ce,Se){var $e=_(U[Y],U,pe);if($e.type==="throw")Se($e.arg);else{var ce=$e.arg,he=ce.value;return he&&typeof he=="object"&&n.call(he,"__await")?j.resolve(he.__await).then(function(Ie){q("next",Ie,Ce,Se)},function(Ie){q("throw",Ie,Ce,Se)}):j.resolve(he).then(function(Ie){ce.value=Ie,Ce(ce)},function(Ie){return q("throw",Ie,Ce,Se)})}}var K;function X(Y,pe){function Ce(){return new j(function(Se,$e){q(Y,pe,Se,$e)})}return K=K?K.then(Ce,Ce):Ce()}s(this,"_invoke",{value:X})}F(J.prototype),f(J.prototype,c,function(){return this}),r.AsyncIterator=J,r.async=function(U,j,q,K,X){X===void 0&&(X=Promise);var Y=new J(g(U,j,q,K),X);return r.isGeneratorFunction(j)?Y:Y.next().then(function(pe){return pe.done?pe.value:Y.next()})};function H(U,j,q){var K=v;return function(Y,pe){if(K===k)throw new Error("Generator is already running");if(K===E){if(Y==="throw")throw pe;return me()}for(q.method=Y,q.arg=pe;;){var Ce=q.delegate;if(Ce){var Se=L(Ce,q);if(Se){if(Se===I)continue;return Se}}if(q.method==="next")q.sent=q._sent=q.arg;else if(q.method==="throw"){if(K===v)throw K=E,q.arg;q.dispatchException(q.arg)}else q.method==="return"&&q.abrupt("return",q.arg);K=k;var $e=_(U,j,q);if($e.type==="normal"){if(K=q.done?E:S,$e.arg===I)continue;return{value:$e.arg,done:q.done}}else $e.type==="throw"&&(K=E,q.method="throw",q.arg=$e.arg)}}}function L(U,j){var q=j.method,K=U.iterator[q];if(K===a)return j.delegate=null,q==="throw"&&U.iterator.return&&(j.method="return",j.arg=a,L(U,j),j.method==="throw")||q!=="return"&&(j.method="throw",j.arg=new TypeError("The iterator does not provide a '"+q+"' method")),I;var X=_(K,U.iterator,j.arg);if(X.type==="throw")return j.method="throw",j.arg=X.arg,j.delegate=null,I;var Y=X.arg;if(!Y)return j.method="throw",j.arg=new TypeError("iterator result is not an object"),j.delegate=null,I;if(Y.done)j[U.resultName]=Y.value,j.next=U.nextLoc,j.method!=="return"&&(j.method="next",j.arg=a);else return Y;return j.delegate=null,I}F(P),f(P,m,"Generator"),f(P,u,function(){return this}),f(P,"toString",function(){return"[object Generator]"});function M(U){var j={tryLoc:U[0]};1 in U&&(j.catchLoc=U[1]),2 in U&&(j.finallyLoc=U[2],j.afterLoc=U[3]),this.tryEntries.push(j)}function ne(U){var j=U.completion||{};j.type="normal",delete j.arg,U.completion=j}function te(U){this.tryEntries=[{tryLoc:"root"}],U.forEach(M,this),this.reset(!0)}r.keys=function(U){var j=Object(U),q=[];for(var K in j)q.push(K);return q.reverse(),function X(){for(;q.length;){var Y=q.pop();if(Y in j)return X.value=Y,X.done=!1,X}return X.done=!0,X}};function ie(U){if(U){var j=U[u];if(j)return j.call(U);if(typeof U.next=="function")return U;if(!isNaN(U.length)){var q=-1,K=function X(){for(;++q<U.length;)if(n.call(U,q))return X.value=U[q],X.done=!1,X;return X.value=a,X.done=!0,X};return K.next=K}}return{next:me}}r.values=ie;function me(){return{value:a,done:!0}}return te.prototype={constructor:te,reset:function(U){if(this.prev=0,this.next=0,this.sent=this._sent=a,this.done=!1,this.delegate=null,this.method="next",this.arg=a,this.tryEntries.forEach(ne),!U)for(var j in this)j.charAt(0)==="t"&&n.call(this,j)&&!isNaN(+j.slice(1))&&(this[j]=a)},stop:function(){this.done=!0;var U=this.tryEntries[0],j=U.completion;if(j.type==="throw")throw j.arg;return this.rval},dispatchException:function(U){if(this.done)throw U;var j=this;function q(Se,$e){return Y.type="throw",Y.arg=U,j.next=Se,$e&&(j.method="next",j.arg=a),!!$e}for(var K=this.tryEntries.length-1;K>=0;--K){var X=this.tryEntries[K],Y=X.completion;if(X.tryLoc==="root")return q("end");if(X.tryLoc<=this.prev){var pe=n.call(X,"catchLoc"),Ce=n.call(X,"finallyLoc");if(pe&&Ce){if(this.prev<X.catchLoc)return q(X.catchLoc,!0);if(this.prev<X.finallyLoc)return q(X.finallyLoc)}else if(pe){if(this.prev<X.catchLoc)return q(X.catchLoc,!0)}else if(Ce){if(this.prev<X.finallyLoc)return q(X.finallyLoc)}else throw new Error("try statement without catch or finally")}}},abrupt:function(U,j){for(var q=this.tryEntries.length-1;q>=0;--q){var K=this.tryEntries[q];if(K.tryLoc<=this.prev&&n.call(K,"finallyLoc")&&this.prev<K.finallyLoc){var X=K;break}}X&&(U==="break"||U==="continue")&&X.tryLoc<=j&&j<=X.finallyLoc&&(X=null);var Y=X?X.completion:{};return Y.type=U,Y.arg=j,X?(this.method="next",this.next=X.finallyLoc,I):this.complete(Y)},complete:function(U,j){if(U.type==="throw")throw U.arg;return U.type==="break"||U.type==="continue"?this.next=U.arg:U.type==="return"?(this.rval=this.arg=U.arg,this.method="return",this.next="end"):U.type==="normal"&&j&&(this.next=j),I},finish:function(U){for(var j=this.tryEntries.length-1;j>=0;--j){var q=this.tryEntries[j];if(q.finallyLoc===U)return this.complete(q.completion,q.afterLoc),ne(q),I}},catch:function(U){for(var j=this.tryEntries.length-1;j>=0;--j){var q=this.tryEntries[j];if(q.tryLoc===U){var K=q.completion;if(K.type==="throw"){var X=K.arg;ne(q)}return X}}throw new Error("illegal catch attempt")},delegateYield:function(U,j,q){return this.delegate={iterator:ie(U),resultName:j,nextLoc:q},this.method==="next"&&(this.arg=a),I}},r})(e.exports);try{regeneratorRuntime=t}catch{typeof globalThis=="object"?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}})(xl)),xl.exports}var Tl,xf;function Nc(){return xf||(xf=1,Tl=(e,t)=>`${e}-${t}-${Math.random().toString(16).slice(3,8)}`),Tl}var Sl,Tf;function Oy(){if(Tf)return Sl;Tf=1;const e=Nc();let t=0;return Sl=({id:r,action:i,payload:n={}})=>{let s=r;return typeof s>"u"&&(s=e("Job",t),t+=1),{id:s,action:i,payload:n}},Sl}var ha={},Sf;function Uc(){if(Sf)return ha;Sf=1;let e=!1;return ha.logging=e,ha.setLogging=t=>{e=t},ha.log=(...t)=>e?console.log.apply(this,t):null,ha}var Il,If;function V1(){if(If)return Il;If=1;const e=Oy(),{log:t}=Uc(),r=Nc();let i=0;return Il=()=>{const n=r("Scheduler",i),s={},a={};let o=[];i+=1;const u=()=>o.length,c=()=>Object.keys(s).length,m=()=>{if(o.length!==0){const S=Object.keys(s);for(let k=0;k<S.length;k+=1)if(typeof a[S[k]]>"u"){o[0](s[S[k]]);break}}},f=(S,k)=>new Promise((E,I)=>{const O=e({action:S,payload:k});o.push(async z=>{o.shift(),a[z.id]=O;try{E(await z[S].apply(this,[...k,O.id]))}catch(R){I(R)}finally{delete a[z.id],m()}}),t(`[${n}]: Add ${O.id} to JobQueue`),t(`[${n}]: JobQueue length=${o.length}`),m()});return{addWorker:S=>(s[S.id]=S,t(`[${n}]: Add ${S.id}`),t(`[${n}]: Number of workers=${c()}`),m(),S.id),addJob:async(S,...k)=>{if(c()===0)throw Error(`[${n}]: You need to have at least one worker before adding jobs`);return f(S,k)},terminate:async()=>{Object.keys(s).forEach(async S=>{await s[S].terminate()}),o=[]},getQueueLen:u,getNumWorkers:c}},Il}function F1(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var El,Ef;function H1(){return Ef||(Ef=1,El=e=>{const t={};return typeof WorkerGlobalScope<"u"?t.type="webworker":typeof document=="object"?t.type="browser":typeof process=="object"&&typeof F1=="function"&&(t.type="node"),typeof e>"u"?t:t[e]}),El}var kl,kf;function j1(){if(kf)return kl;kf=1;const t=H1()("type")==="browser"?r=>new URL(r,window.location.href).href:r=>r;return kl=r=>{const i={...r};return["corePath","workerPath","langPath"].forEach(n=>{r[n]&&(i[n]=t(i[n]))}),i},kl}var Cl,Cf;function zy(){return Cf||(Cf=1,Cl={TESSERACT_ONLY:0,LSTM_ONLY:1,TESSERACT_LSTM_COMBINED:2,DEFAULT:3}),Cl}const K1="6.0.1",Y1={version:K1};var Al,Af;function X1(){return Af||(Af=1,Al={workerBlobURL:!0,logger:()=>{}}),Al}var Ol,Of;function Z1(){if(Of)return Ol;Of=1;const e=Y1.version;return Ol={...X1(),workerPath:`https://cdn.jsdelivr.net/npm/tesseract.js@v${e}/dist/worker.min.js`},Ol}var zl,zf;function Q1(){return zf||(zf=1,zl=({workerPath:e,workerBlobURL:t})=>{let r;if(Blob&&URL&&t){const i=new Blob([`importScripts("${e}");`],{type:"application/javascript"});r=new Worker(URL.createObjectURL(i))}else r=new Worker(e);return r}),zl}var Rl,Rf;function J1(){return Rf||(Rf=1,Rl=e=>{e.terminate()}),Rl}var Ml,Mf;function e$(){return Mf||(Mf=1,Ml=(e,t)=>{e.onmessage=({data:r})=>{t(r)}}),Ml}var Bl,Bf;function t$(){return Bf||(Bf=1,Bl=async(e,t)=>{e.postMessage(t)}),Bl}var Dl,Df;function r$(){if(Df)return Dl;Df=1;const e=r=>new Promise((i,n)=>{const s=new FileReader;s.onload=()=>{i(s.result)},s.onerror=({target:{error:{code:a}}})=>{n(Error(`File could not be read! Code=${a}`))},s.readAsArrayBuffer(r)}),t=async r=>{let i=r;if(typeof r>"u")return"undefined";if(typeof r=="string")/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(r)?i=atob(r.split(",")[1]).split("").map(n=>n.charCodeAt(0)):i=await(await fetch(r)).arrayBuffer();else if(typeof HTMLElement<"u"&&r instanceof HTMLElement)r.tagName==="IMG"&&(i=await t(r.src)),r.tagName==="VIDEO"&&(i=await t(r.poster)),r.tagName==="CANVAS"&&await new Promise(n=>{r.toBlob(async s=>{i=await e(s),n()})});else if(typeof OffscreenCanvas<"u"&&r instanceof OffscreenCanvas){const n=await r.convertToBlob();i=await e(n)}else(r instanceof File||r instanceof Blob)&&(i=await e(r));return new Uint8Array(i)};return Dl=t,Dl}var Nl,Nf;function n$(){if(Nf)return Nl;Nf=1;const e=Z1(),t=Q1(),r=J1(),i=e$(),n=t$(),s=r$();return Nl={defaultOptions:e,spawnWorker:t,terminateWorker:r,onMessage:i,send:n,loadImage:s},Nl}var Ul,Uf;function Ry(){if(Uf)return Ul;Uf=1;const e=j1(),t=Oy(),{log:r}=Uc(),i=Nc(),n=zy(),{defaultOptions:s,spawnWorker:a,terminateWorker:o,onMessage:u,loadImage:c,send:m}=n$();let f=0;return Ul=async(g="eng",_=n.LSTM_ONLY,v={},S={})=>{const k=i("Worker",f),{logger:E,errorHandler:I,...O}=e({...s,...v}),z={},R=typeof g=="string"?g.split("+"):g;let N=_,T=S;const $=[n.DEFAULT,n.LSTM_ONLY].includes(_)&&!O.legacyCore;let P,F;const J=new Promise((ce,he)=>{F=ce,P=he}),H=ce=>{P(ce.message)};let L=a(O);L.onerror=H,f+=1;const M=({id:ce,action:he,payload:Ie})=>new Promise((ve,oe)=>{r(`[${k}]: Start ${ce}, action=${he}`);const ue=`${he}-${ce}`;z[ue]={resolve:ve,reject:oe},m(L,{workerId:k,jobId:ce,action:he,payload:Ie})}),ne=()=>console.warn("`load` is depreciated and should be removed from code (workers now come pre-loaded)"),te=ce=>M(t({id:ce,action:"load",payload:{options:{lstmOnly:$,corePath:O.corePath,logging:O.logging}}})),ie=(ce,he,Ie)=>M(t({id:Ie,action:"FS",payload:{method:"writeFile",args:[ce,he]}})),me=(ce,he)=>M(t({id:he,action:"FS",payload:{method:"readFile",args:[ce,{encoding:"utf8"}]}})),U=(ce,he)=>M(t({id:he,action:"FS",payload:{method:"unlink",args:[ce]}})),j=(ce,he,Ie)=>M(t({id:Ie,action:"FS",payload:{method:ce,args:he}})),q=(ce,he)=>M(t({id:he,action:"loadLanguage",payload:{langs:ce,options:{langPath:O.langPath,dataPath:O.dataPath,cachePath:O.cachePath,cacheMethod:O.cacheMethod,gzip:O.gzip,lstmOnly:[n.DEFAULT,n.LSTM_ONLY].includes(N)&&!O.legacyLang}}})),K=(ce,he,Ie,ve)=>M(t({id:ve,action:"initialize",payload:{langs:ce,oem:he,config:Ie}})),X=(ce="eng",he,Ie,ve)=>{if($&&[n.TESSERACT_ONLY,n.TESSERACT_LSTM_COMBINED].includes(he))throw Error("Legacy model requested but code missing.");const oe=he||N;N=oe;const ue=Ie||T;T=ue;const lt=(typeof ce=="string"?ce.split("+"):ce).filter(rt=>!R.includes(rt));return R.push(...lt),lt.length>0?q(lt,ve).then(()=>K(ce,oe,ue,ve)):K(ce,oe,ue,ve)},Y=(ce={},he)=>M(t({id:he,action:"setParameters",payload:{params:ce}})),pe=async(ce,he={},Ie={text:!0},ve)=>M(t({id:ve,action:"recognize",payload:{image:await c(ce),options:he,output:Ie}})),Ce=async(ce,he)=>{if($)throw Error("`worker.detect` requires Legacy model, which was not loaded.");return M(t({id:he,action:"detect",payload:{image:await c(ce)}}))},Se=async()=>(L!==null&&(o(L),L=null),Promise.resolve());u(L,({workerId:ce,jobId:he,status:Ie,action:ve,data:oe})=>{const ue=`${ve}-${he}`;if(Ie==="resolve")r(`[${ce}]: Complete ${he}`),z[ue].resolve({jobId:he,data:oe}),delete z[ue];else if(Ie==="reject")if(z[ue].reject(oe),delete z[ue],ve==="load"&&P(oe),I)I(oe);else throw Error(oe);else Ie==="progress"&&E({...oe,userJobId:he})});const $e={id:k,worker:L,load:ne,writeText:ie,readText:me,removeFile:U,FS:j,reinitialize:X,setParameters:Y,recognize:pe,detect:Ce,terminate:Se};return te().then(()=>q(g)).then(()=>K(g,_,S)).then(()=>F($e)).catch(()=>{}),J},Ul}var Pl,Pf;function i$(){if(Pf)return Pl;Pf=1;const e=Ry();return Pl={recognize:async(i,n,s)=>{const a=await e(n,1,s);return a.recognize(i).finally(async()=>{await a.terminate()})},detect:async(i,n)=>{const s=await e("osd",0,n);return s.detect(i).finally(async()=>{await s.terminate()})}},Pl}var Ll,Lf;function a$(){return Lf||(Lf=1,Ll={AFR:"afr",AMH:"amh",ARA:"ara",ASM:"asm",AZE:"aze",AZE_CYRL:"aze_cyrl",BEL:"bel",BEN:"ben",BOD:"bod",BOS:"bos",BUL:"bul",CAT:"cat",CEB:"ceb",CES:"ces",CHI_SIM:"chi_sim",CHI_TRA:"chi_tra",CHR:"chr",CYM:"cym",DAN:"dan",DEU:"deu",DZO:"dzo",ELL:"ell",ENG:"eng",ENM:"enm",EPO:"epo",EST:"est",EUS:"eus",FAS:"fas",FIN:"fin",FRA:"fra",FRK:"frk",FRM:"frm",GLE:"gle",GLG:"glg",GRC:"grc",GUJ:"guj",HAT:"hat",HEB:"heb",HIN:"hin",HRV:"hrv",HUN:"hun",IKU:"iku",IND:"ind",ISL:"isl",ITA:"ita",ITA_OLD:"ita_old",JAV:"jav",JPN:"jpn",KAN:"kan",KAT:"kat",KAT_OLD:"kat_old",KAZ:"kaz",KHM:"khm",KIR:"kir",KOR:"kor",KUR:"kur",LAO:"lao",LAT:"lat",LAV:"lav",LIT:"lit",MAL:"mal",MAR:"mar",MKD:"mkd",MLT:"mlt",MSA:"msa",MYA:"mya",NEP:"nep",NLD:"nld",NOR:"nor",ORI:"ori",PAN:"pan",POL:"pol",POR:"por",PUS:"pus",RON:"ron",RUS:"rus",SAN:"san",SIN:"sin",SLK:"slk",SLV:"slv",SPA:"spa",SPA_OLD:"spa_old",SQI:"sqi",SRP:"srp",SRP_LATN:"srp_latn",SWA:"swa",SWE:"swe",SYR:"syr",TAM:"tam",TEL:"tel",TGK:"tgk",TGL:"tgl",THA:"tha",TIR:"tir",TUR:"tur",UIG:"uig",UKR:"ukr",URD:"urd",UZB:"uzb",UZB_CYRL:"uzb_cyrl",VIE:"vie",YID:"yid"}),Ll}var Wl,Wf;function s$(){return Wf||(Wf=1,Wl={OSD_ONLY:"0",AUTO_OSD:"1",AUTO_ONLY:"2",AUTO:"3",SINGLE_COLUMN:"4",SINGLE_BLOCK_VERT_TEXT:"5",SINGLE_BLOCK:"6",SINGLE_LINE:"7",SINGLE_WORD:"8",CIRCLE_WORD:"9",SINGLE_CHAR:"10",SPARSE_TEXT:"11",SPARSE_TEXT_OSD:"12",RAW_LINE:"13"}),Wl}var Gl,Gf;function o$(){if(Gf)return Gl;Gf=1,q1();const e=V1(),t=Ry(),r=i$(),i=a$(),n=zy(),s=s$(),{setLogging:a}=Uc();return Gl={languages:i,OEM:n,PSM:s,createScheduler:e,createWorker:t,setLogging:a,...r},Gl}var u$=o$();const l$=f1(u$);/*!
 * ONNX Runtime Web v1.30.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Pc=Object.defineProperty,d$=Object.getOwnPropertyDescriptor,c$=Object.getOwnPropertyNames,p$=Object.prototype.hasOwnProperty,f$=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),ae=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(i){throw r=[i],i}},Qn=(e,t)=>{for(var r in t)Pc(e,r,{get:t[r],enumerable:!0})},h$=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of c$(t))!p$.call(e,n)&&n!==r&&Pc(e,n,{get:()=>t[n],enumerable:!(i=d$(t,n))||i.enumerable});return e},Ra=e=>h$(Pc({},"__esModule",{value:!0}),e),ma,kr,qn,qf,My,By=ae(()=>{"use strict";ma=new Map,kr=[],qn=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=ma.get(e);if(i===void 0)ma.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=kr.indexOf(e);n!==-1&&kr.splice(n,1);for(let s=0;s<kr.length;s++)if(ma.get(kr[s]).priority<=r){kr.splice(s,0,e);return}kr.push(e)}return}throw new TypeError("not a valid backend")},qf=async e=>{let t=ma.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},My=async e=>{let t=e.executionProviders||[],r=t.map(u=>typeof u=="string"?u:u.name),i=r.length===0?kr:r,n,s=[],a=new Set;for(let u of i){let c=await qf(u);typeof c=="string"?s.push({name:u,err:c}):(n||(n=c),n===c&&a.add(u))}if(!n)throw new Error(`no available backend found. ERR: ${s.map(u=>`[${u.name}] ${u.err}`).join(", ")}`);for(let{name:u,err:c}of s)r.includes(u)&&console.warn(`removing requested execution provider "${u}" from session options because it is not available: ${c}`);let o=t.filter(u=>a.has(typeof u=="string"?u:u.name));return[n,new Proxy(e,{get:(u,c)=>c==="executionProviders"?o:Reflect.get(u,c)})]}}),m$=ae(()=>{"use strict";By()}),Dy,g$=ae(()=>{"use strict";Dy="1.30.0"}),ql,yt,Ny=ae(()=>{"use strict";g$(),ql="warning",yt={wasm:{},webgl:{},webgpu:{},versions:{common:Dy},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);ql=e}},get logLevel(){return ql}},Object.defineProperty(yt,"logLevel",{enumerable:!0})}),Xe,y$=ae(()=>{"use strict";Ny(),Xe=yt}),Uy,Py,b$=ae(()=>{"use strict";Uy=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let n,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],s=e.dims[3]):(n=e.dims[3],s=e.dims[2]);let a=(t==null?void 0:t.format)!==void 0?t.format:"RGB",o=t==null?void 0:t.norm,u,c;o===void 0||o.mean===void 0?u=[255,255,255,255]:typeof o.mean=="number"?u=[o.mean,o.mean,o.mean,o.mean]:(u=[o.mean[0],o.mean[1],o.mean[2],0],o.mean[3]!==void 0&&(u[3]=o.mean[3])),o===void 0||o.bias===void 0?c=[0,0,0,0]:typeof o.bias=="number"?c=[o.bias,o.bias,o.bias,o.bias]:(c=[o.bias[0],o.bias[1],o.bias[2],0],o.bias[3]!==void 0&&(c[3]=o.bias[3]));let m=s*n,f=0,g=m,_=m*2,v=-1;a==="RGBA"?(f=0,g=m,_=m*2,v=m*3):a==="RGB"?(f=0,g=m,_=m*2):a==="RBG"&&(f=0,_=m,g=m*2);for(let S=0;S<s;S++)for(let k=0;k<n;k++){let E=(e.data[f++]-c[0])*u[0],I=(e.data[g++]-c[1])*u[1],O=(e.data[_++]-c[2])*u[2],z=v===-1?255:(e.data[v++]-c[3])*u[3];i.fillStyle="rgba("+E+","+I+","+O+","+z+")",i.fillRect(k,S,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Py=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let n,s,a;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],s=e.dims[1],a=e.dims[3]):(n=e.dims[3],s=e.dims[2],a=e.dims[1]);let o=t!==void 0&&t.format!==void 0?t.format:"RGB",u=t==null?void 0:t.norm,c,m;u===void 0||u.mean===void 0?c=[255,255,255,255]:typeof u.mean=="number"?c=[u.mean,u.mean,u.mean,u.mean]:(c=[u.mean[0],u.mean[1],u.mean[2],255],u.mean[3]!==void 0&&(c[3]=u.mean[3])),u===void 0||u.bias===void 0?m=[0,0,0,0]:typeof u.bias=="number"?m=[u.bias,u.bias,u.bias,u.bias]:(m=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(m[3]=u.bias[3]));let f=s*n;if(t!==void 0&&(t.format!==void 0&&a===4&&t.format!=="RGBA"||a===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let g=4,_=0,v=1,S=2,k=3,E=0,I=f,O=f*2,z=-1;o==="RGBA"?(E=0,I=f,O=f*2,z=f*3):o==="RGB"?(E=0,I=f,O=f*2):o==="RBG"&&(E=0,O=f,I=f*2),i=r.createImageData(n,s);for(let R=0;R<s*n;_+=g,v+=g,S+=g,k+=g,R++)i.data[_]=(e.data[E++]-m[0])*c[0],i.data[v]=(e.data[I++]-m[1])*c[1],i.data[S]=(e.data[O++]-m[2])*c[2],i.data[k]=z===-1?255:(e.data[z++]-m[3])*c[3]}else throw new Error("Can not access image data");return i}}),Ys,Ly,Wy,Gy,qy,Vy,w$=ae(()=>{"use strict";Lc(),Ys=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,n=t.norm??{mean:255,bias:0},s,a;typeof n.mean=="number"?s=[n.mean,n.mean,n.mean,n.mean]:s=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?a=[n.bias,n.bias,n.bias,n.bias]:a=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let o=t.format!==void 0?t.format:"RGBA",u=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",c=r*i,m=u==="RGBA"?new Float32Array(c*4):new Float32Array(c*3),f=4,g=0,_=1,v=2,S=3,k=0,E=c,I=c*2,O=-1;o==="RGB"&&(f=3,g=0,_=1,v=2,S=-1),u==="RGBA"?O=c*3:u==="RBG"?(k=0,I=c,E=c*2):u==="BGR"&&(I=0,E=c,k=c*2);for(let z=0;z<c;z++,g+=f,v+=f,_+=f,S+=f)m[k++]=(e[g]+a[0])/s[0],m[E++]=(e[_]+a[1])/s[1],m[I++]=(e[v]+a[2])/s[2],O!==-1&&S!==-1&&(m[O++]=(e[S]+a[3])/s[3]);return u==="RGBA"?new Lt("float32",m,[1,4,r,i]):new Lt("float32",m,[1,3,r,i])},Ly=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,s=typeof e=="string",a,o=t??{},u=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},c=m=>typeof HTMLCanvasElement<"u"&&m instanceof HTMLCanvasElement||m instanceof OffscreenCanvas?m.getContext("2d"):null;if(r){let m=u();m.width=e.width,m.height=e.height;let f=c(m);if(f!=null){let g=e.height,_=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(g=t.resizedHeight,_=t.resizedWidth),t!==void 0){if(o=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");o.tensorFormat="RGBA",o.height=g,o.width=_}else o.tensorFormat="RGBA",o.height=g,o.width=_;f.drawImage(e,0,0),a=f.getImageData(0,0,_,g).data}else throw new Error("Can not access image data")}else if(i){let m,f;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(m=t.resizedHeight,f=t.resizedWidth):(m=e.height,f=e.width),t!==void 0&&(o=t),o.format="RGBA",o.height=m,o.width=f,t!==void 0){let g=u();g.width=f,g.height=m;let _=c(g);if(_!=null)_.putImageData(e,0,0),a=_.getImageData(0,0,f,m).data;else throw new Error("Can not access image data")}else a=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let m=u();m.width=e.width,m.height=e.height;let f=c(m);if(f!=null){let g=e.height,_=e.width;return f.drawImage(e,0,0,_,g),a=f.getImageData(0,0,_,g).data,o.height=g,o.width=_,Ys(a,o)}else throw new Error("Can not access image data")}else{if(s)return new Promise((m,f)=>{let g=u(),_=c(g);if(!e||!_)return f();let v=new Image;v.crossOrigin="Anonymous",v.src=e,v.onload=()=>{g.width=v.width,g.height=v.height,_.drawImage(v,0,0,g.width,g.height);let S=_.getImageData(0,0,g.width,g.height);o.height=g.height,o.width=g.width,m(Ys(S.data,o))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(a!==void 0)return Ys(a,o);throw new Error("Input data provided is not supported - aborted tensor creation")},Wy=(e,t)=>{let{width:r,height:i,download:n,dispose:s}=t,a=[1,i,r,4];return new Lt({location:"texture",type:"float32",texture:e,dims:a,download:n,dispose:s})},Gy=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:s}=t;return new Lt({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:n,dispose:s})},qy=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:s}=t;return new Lt({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:n,dispose:s})},Vy=(e,t,r)=>new Lt({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),cn,ka,Vl,Fy,_$=ae(()=>{"use strict";cn=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),ka=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Vl=!1,Fy=()=>{if(!Vl){Vl=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(cn.set("int64",BigInt64Array),ka.set(BigInt64Array,"int64")),t&&(cn.set("uint64",BigUint64Array),ka.set(BigUint64Array,"uint64")),i?(cn.set("float16",r),ka.set(r,"float16")):cn.set("float16",Uint16Array)}}}),Hy,jy,v$=ae(()=>{"use strict";Lc(),Hy=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},jy=(e,t)=>{switch(e.location){case"cpu":return new Lt(e.type,e.data,t);case"cpu-pinned":return new Lt({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Lt({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Lt({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Lt({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Lt,Lc=ae(()=>{"use strict";b$(),w$(),_$(),v$(),Lt=class{constructor(e,t,r){Fy();let i,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,n=e.dims,e.location){case"cpu-pinned":{let a=cn.get(i);if(!a)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof a))throw new TypeError(`buffer should be of type ${a.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let a,o;if(typeof e=="string")if(i=e,o=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");a=t}else{let u=cn.get(e);if(u===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&u===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${u.name} as data.`);e==="uint64"||e==="int64"?a=u.from(t,BigInt):a=u.from(t)}else if(t instanceof u)a=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")a=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&u!==Uint16Array)a=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${u}`)}else if(o=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let u=typeof e[0];if(u==="string")i="string",a=e;else if(u==="boolean")i="bool",a=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${u}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",a=Uint8Array.from(e);else{let u=ka.get(e.constructor);if(u===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=u,a=e}if(o===void 0)o=[a.length];else if(!Array.isArray(o))throw new TypeError("A tensor's dims must be a number array");n=o,this.cpuData=a,this.dataLocation="cpu"}let s=Hy(n);if(this.cpuData&&s!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(s/2)===this.cpuData.length))throw new Error(`Tensor's size(${s}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=n,this.size=s}static async fromImage(e,t){return Ly(e,t)}static fromTexture(e,t){return Wy(e,t)}static fromGpuBuffer(e,t){return Gy(e,t)}static fromMLTensor(e,t){return qy(e,t)}static fromPinnedBuffer(e,t,r){return Vy(e,t,r)}toDataURL(e){return Uy(this,e)}toImageData(e){return Py(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return jy(this,e)}}}),ir,Ky=ae(()=>{"use strict";Lc(),ir=Lt}),xo,Fl,or,ar,gn,yn,Yy=ae(()=>{"use strict";Ny(),xo=(e,t)=>{(typeof yt.trace>"u"?!yt.wasm.trace:!yt.trace)||console.timeStamp(`${e}::ORT::${t}`)},Fl=(e,t)=>{var n;let r=((n=new Error().stack)==null?void 0:n.split(/\r\n|\r|\n/g))||[],i=!1;for(let s=0;s<r.length;s++){if(i&&!r[s].includes("TRACE_FUNC")){let a=`FUNC_${e}::${r[s].trim().split(" ")[1]}`;t&&(a+=`::${t}`),xo("CPU",a);return}r[s].includes("TRACE_FUNC")&&(i=!0)}},or=e=>{(typeof yt.trace>"u"?!yt.wasm.trace:!yt.trace)||Fl("BEGIN",e)},ar=e=>{(typeof yt.trace>"u"?!yt.wasm.trace:!yt.trace)||Fl("END",e)},gn=e=>{(typeof yt.trace>"u"?!yt.wasm.trace:!yt.trace)||console.time(`ORT::${e}`)},yn=e=>{(typeof yt.trace>"u"?!yt.wasm.trace:!yt.trace)||console.timeEnd(`ORT::${e}`)}}),Xy,$$=ae(()=>{"use strict";By(),Ky(),Yy(),Xy=class Zy{constructor(t){this.handler=t}async run(t,r,i){or(),gn("InferenceSession.run");let n={},s={};if(typeof t!="object"||t===null||t instanceof ir||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let a=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof ir)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");a=!1;for(let c of r){if(typeof c!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(c)===-1)throw new RangeError(`'fetches' contains invalid output name: ${c}.`);n[c]=null}if(typeof i=="object"&&i!==null)s=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let c=!1,m=Object.getOwnPropertyNames(r);for(let f of this.outputNames)if(m.indexOf(f)!==-1){let g=r[f];(g===null||g instanceof ir)&&(c=!0,a=!1,n[f]=g)}if(c){if(typeof i=="object"&&i!==null)s=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else s=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let c of this.inputNames)if(typeof t[c]>"u")throw new Error(`input '${c}' is missing in 'feeds'.`);if(a)for(let c of this.outputNames)n[c]=null;let o=await this.handler.run(t,n,s),u={};for(let c in o)if(Object.hasOwnProperty.call(o,c)){let m=o[c];m instanceof ir?u[c]=m:u[c]=new ir(m.type,m.data,m.dims)}return yn("InferenceSession.run"),ar(),u}async release(){return this.handler.dispose()}static async create(t,r,i,n){or(),gn("InferenceSession.create");let s,a={};if(typeof t=="string"){if(s=t,typeof r=="object"&&r!==null)a=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(s=t,typeof r=="object"&&r!==null)a=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let m=t,f=0,g=t.byteLength;if(typeof r=="object"&&r!==null)a=r;else if(typeof r=="number"){if(f=r,!Number.isSafeInteger(f))throw new RangeError("'byteOffset' must be an integer.");if(f<0||f>=m.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${m.byteLength}).`);if(g=t.byteLength-f,typeof i=="number"){if(g=i,!Number.isSafeInteger(g))throw new RangeError("'byteLength' must be an integer.");if(g<=0||f+g>m.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${m.byteLength-f}].`);if(typeof n=="object"&&n!==null)a=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");s=new Uint8Array(m,f,g)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[o,u]=await My(a),c=await o.createInferenceSessionHandler(s,u);return yn("InferenceSession.create"),ar(),new Zy(c)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Wc,x$=ae(()=>{"use strict";$$(),Wc=Xy}),T$=ae(()=>{"use strict"}),S$=ae(()=>{"use strict"}),I$=ae(()=>{"use strict"}),E$=ae(()=>{"use strict"}),k$={};Qn(k$,{InferenceSession:()=>Wc,TRACE:()=>xo,TRACE_EVENT_BEGIN:()=>gn,TRACE_EVENT_END:()=>yn,TRACE_FUNC_BEGIN:()=>or,TRACE_FUNC_END:()=>ar,Tensor:()=>ir,env:()=>Xe,registerBackend:()=>qn});var Ht=ae(()=>{"use strict";m$(),y$(),x$(),Ky(),T$(),S$(),Yy(),I$(),E$()}),Gc=ae(()=>{"use strict"}),Qy={};Qn(Qy,{default:()=>Jy});var Hl,jl,Jy,C$=ae(()=>{"use strict";var e;ov(),Tn(),qc(),Hl="ort-wasm-proxy-worker",jl=((e=globalThis.self)==null?void 0:e.name)===Hl,jl&&(self.onmessage=t=>{let{type:r,in:i}=t.data;try{switch(r){case"init-wasm":Vc(i.wasm).then(()=>{op(i).then(()=>{postMessage({type:r})},n=>{postMessage({type:r,err:n})})},n=>{postMessage({type:r,err:n})});break;case"init-ep":{let{epName:n,env:s}=i;up(s,n).then(()=>{postMessage({type:r})},a=>{postMessage({type:r,err:a})});break}case"copy-from":{let{buffer:n}=i,s=Ao(n);postMessage({type:r,out:s});break}case"create":{let{model:n,options:s}=i;lp(n,s).then(a=>{postMessage({type:r,out:a})},a=>{postMessage({type:r,err:a})});break}case"release":dp(i),postMessage({type:r});break;case"run":{let{sessionId:n,inputIndices:s,inputs:a,outputIndices:o,options:u}=i;cp(n,s,a,o,new Array(o.length).fill(null),u).then(c=>{c.some(m=>m[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:c},fp([...a,...c]))},c=>{postMessage({type:r,err:c})});break}case"end-profiling":pp(i),postMessage({type:r});break;default:}}catch(n){postMessage({type:r,err:n})}}),Jy=jl?null:t=>new Worker(t??Nt,{type:"module",name:Hl})}),eb={};Qn(eb,{default:()=>tb});async function Vf(e={}){var Jr,xe;var t=e,r=!!globalThis.window,i=!!globalThis.WorkerGlobalScope,n=i&&((Jr=self.name)==null?void 0:Jr.startsWith("em-pthread"));t.mountExternalData=(l,h)=>{l.startsWith("./")&&(l=l.substring(2)),(t.ad||(t.ad=new Map)).set(l,h)},t.unmountExternalData=()=>{delete t.ad,delete t.Yd,delete t.Xd,delete t.be},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let s=l=>async(...h)=>{var x;try{if(t.$c)throw Error("Session already started");let w=t.$c={Nd:h[0],errors:[]},A=await l(...h);if(t.$c!==w)throw Error("Session mismatch");(x=t.hd)==null||x.flush();let D=w.errors;if(0<D.length){let V=await Promise.all(D);if(V=V.filter(ee=>ee),0<V.length)throw Error(V.join(`
`))}return A}finally{t.$c=null}};t.jsepInit=(l,h)=>{if(l==="webgpu"){[t.hd,t.Dd,t.Hd,t.jd,t.Gd,t.bc,t.Id,t.Kd,t.Ed,t.Fd,t.Jd]=h;let x=t.hd;t.jsepRegisterBuffer=(w,A,D,V)=>x.registerBuffer(w,A,D,V),t.jsepGetBuffer=w=>x.getBuffer(w),t.jsepCreateDownloader=(w,A,D)=>x.createDownloader(w,A,D),t.jsepOnCreateSession=w=>{x.onCreateSession(w)},t.jsepOnReleaseSession=w=>{x.onReleaseSession(w)},t.jsepOnRunStart=w=>x.onRunStart(w),t.Ld=(w,A)=>{x.upload(w,A)}}else if(l==="webnn"){let x=h[0];[t.Vd,t.vd,t.webnnEnsureTensor,t.wd,t.webnnDownloadTensor,t.Ud,t.webnnEnableTraceEvent]=h.slice(1),t.webnnReleaseTensorId=t.vd,t.webnnUploadTensor=t.wd,t.webnnRegisterMLContext=t.Ud,t.webnnOnRunStart=w=>x.onRunStart(w),t.webnnOnRunEnd=x.onRunEnd.bind(x),t.webnnOnReleaseSession=w=>{x.onReleaseSession(w)},t.webnnCreateMLTensorDownloader=(w,A)=>x.createMLTensorDownloader(w,A),t.webnnRegisterMLTensor=(w,A,D,V)=>x.registerMLTensor(w,A,D,V),t.webnnCreateMLContext=w=>x.createMLContext(w),t.webnnRegisterGraphInput=x.registerGraphInput.bind(x),t.webnnIsGraphInput=x.isGraphInput.bind(x),t.webnnRegisterGraphOutput=x.registerGraphOutput.bind(x),t.webnnIsGraphOutput=x.isGraphOutput.bind(x),t.webnnCreateTemporaryTensor=x.createTemporaryTensor.bind(x),t.webnnIsGraphInputOutputTypeSupported=x.isGraphInputOutputTypeSupported.bind(x)}};let a=()=>{let l=h=>(...x)=>{let w=st;return x=h(...x),st!=w?new Promise((A,D)=>{Fr={resolve:A,reject:D}}):x};(()=>{for(let h of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[h]=l(t[h])})(),s!==void 0&&(t._OrtRun=s(t._OrtRun),t._OrtRunWithBinding=s(t._OrtRunWithBinding)),a=void 0};t.asyncInit=()=>{a==null||a()};var o,u,c=(l,h)=>{throw h},m=self.location.href,f="";if(r||i){try{f=new URL(".",m).href}catch{}i&&(u=l=>{var h=new XMLHttpRequest;return h.open("GET",l,!1),h.responseType="arraybuffer",h.send(null),new Uint8Array(h.response)}),o=async l=>{if(T(l))return new Promise((x,w)=>{var A=new XMLHttpRequest;A.open("GET",l,!0),A.responseType="arraybuffer",A.onload=()=>{A.status==200||A.status==0&&A.response?x(A.response):w(A.status)},A.onerror=w,A.send(null)});var h=await fetch(l,{credentials:"same-origin"});if(h.ok)return h.arrayBuffer();throw Error(h.status+" : "+h.url)}}var g,_,v,S,k,E,I=console.log.bind(console),O=console.error.bind(console),z=I,R=O,N=!1,T=l=>l.startsWith("file://");function $(){Gt.buffer!=F.buffer&&K()}if(n){let l=function(h){try{var x=h.data,w=x.Vc;if(w==="load"){let A=[];self.onmessage=D=>A.push(D),E=()=>{postMessage({Vc:"loaded"});for(let D of A)l(D);self.onmessage=l};for(let D of x.Ad)t[D]&&!t[D].proxy||(t[D]=(...V)=>{postMessage({Vc:"callHandler",yd:D,args:V})},D=="print"&&(z=t[D]),D=="printErr"&&(R=t[D]));Gt=x.Rd,K(),_=x.Sd,Ce(),_e()}else if(w==="run"){(function(A){var D=($(),ne)[A+52>>>2>>>0];A=($(),ne)[A+56>>>2>>>0],La(D,D-A),ze(D)})(x.Uc),Pi(x.Uc,0,0,1,0,0),dt(),Gr(x.Uc),P||(It(),P=!0);try{In(x.Pd,x.ed)}catch(A){if(A!="unwind")throw A}}else x.target!=="setimmediate"&&(w==="checkMailbox"?P&&lr():w&&(R(`worker: received unknown command ${w}`),R(x)))}catch(A){throw Da(),A}};var P=!1;self.onunhandledrejection=h=>{throw h.reason||h},self.onmessage=l}var F,J,H,L,M,ne,te,ie,me,U,j,q=!1;function K(){var l=Gt.buffer;t.HEAP8=F=new Int8Array(l),H=new Int16Array(l),t.HEAPU8=J=new Uint8Array(l),L=new Uint16Array(l),t.HEAP32=M=new Int32Array(l),t.HEAPU32=ne=new Uint32Array(l),te=new Float32Array(l),ie=new Float64Array(l),me=new BigInt64Array(l),U=new BigUint64Array(l)}function X(){q=!0,n?E():Yt.ub()}function Y(l){throw R(l="Aborted("+l+")"),N=!0,l=new WebAssembly.RuntimeError(l+". Build with -sASSERTIONS for more info."),k==null||k(l),l}function pe(){return{a:{ma:Zu,hb:Xu,g:Ro,J:Mo,f:Bo,o:Do,i:No,$:Uo,b:Po,S:Lo,Ha:ri,n:Wo,aa:si,Ya:oi,Da:ui,Fa:li,Za:di,Wa:ci,Pa:pi,Va:fi,ka:hi,Ea:mi,Ba:gi,Xa:yi,Ca:bi,cb:Go,fa:qo,wa:Vo,ua:Ho,ea:Ko,N:Yo,H:Xo,va:Zo,_:iu,xa:au,Sa:su,za:uu,Ia:lu,sa:du,ga:cu,Ra:Gr,$a:pu,Q:gu,r:vu,c:Lr,ib:$u,y:xu,M:Tu,D:Su,l:Iu,s:Ii,jb:Eu,I:ku,R:Cu,j:Au,u:Ou,q:zu,k:Ru,Ma:Mu,Na:Bu,Oa:Du,Ka:Ai,La:Oi,ta:zi,eb:Uu,bb:Lu,v:Wu,ba:Gu,ha:qu,ab:Pu,V:Vu,_a:Fu,Aa:Hu,F:Nu,U:ju,la:Kr,ya:Ku,gb:En,fb:kn,Ta:hr,Ua:ut,Ga:rt,T:Ni,Ja:Vt,ja:Yr,Qa:mr,ia:Cn,lb:Qr,na:sa,mb:Me,oa:Us,G:Ms,e:$s,t:Ju,w:Qu,B:ks,nb:aa,Z:Bs,x:Bn,pa:Ds,X:Ps,ca:ia,ob:Zr,pb:na,O:Cs,qb:ta,qa:ra,rb:ea,L:zs,Y:Ns,d:vs,A:Ji,m:xs,kb:Ws,p:gr,z:Ts,C:Et,E:Ss,K:As,ra:Rs,P:Ls,da:Os,W:oa,sb:Es,tb:Is,h:An,a:Gt,db:Fe}}}async function Ce(){function l(w,A){var D=Yt=w.exports;w={};for(let[V,ee]of Object.entries(D))typeof ee=="function"?(D=fu(ee),w[V]=D):w[V]=ee;return Yt=w,Yt=(function(){var V=Yt,ee=fe=>Ae=>fe(Ae)>>>0,le=fe=>()=>fe()>>>0;return(V=Object.assign({},V)).vb=ee(V.vb),V.Zb=le(V.Zb),V.$b=ee(V.$b),V.nc=ee(V.nc),V.oc=le(V.oc),V.sc=ee(V.sc),V})(),At.push(Yt.ac),Ui=(w=Yt).vb,It=w.wb,t._OrtInit=w.xb,t._OrtGetLastError=w.yb,t._OrtCreateSessionOptions=w.zb,t._OrtAppendExecutionProvider=w.Ab,t._OrtAddFreeDimensionOverride=w.Bb,t._OrtAddSessionConfigEntry=w.Cb,t._OrtReleaseSessionOptions=w.Db,t._OrtCreateSession=w.Eb,t._OrtReleaseSession=w.Fb,t._OrtGetInputOutputCount=w.Gb,t._OrtGetInputOutputMetadata=w.Hb,t._OrtFree=w.Ib,t._OrtCreateTensor=w.Jb,t._OrtGetTensorData=w.Kb,t._OrtReleaseTensor=w.Lb,t._OrtCreateRunOptions=w.Mb,t._OrtAddRunConfigEntry=w.Nb,t._OrtReleaseRunOptions=w.Ob,t._OrtCreateBinding=w.Pb,t._OrtBindInput=w.Qb,t._OrtBindOutput=w.Rb,t._OrtClearBoundOutputs=w.Sb,t._OrtReleaseBinding=w.Tb,t._OrtRunWithBinding=w.Ub,t._OrtRun=w.Vb,t._OrtEndProfiling=w.Wb,t._JsepOutput=w.Xb,t._JsepGetNodeName=w.Yb,On=w.Zb,Bt=t._free=w._b,Xr=t._malloc=w.$b,Pi=w.cc,Da=w.dc,Na=w.ec,Li=w.fc,Wi=w.gc,Ua=w.hc,Pa=w.ic,Be=w.jc,Tr=w.kc,La=w.lc,ze=w.mc,zn=w.nc,Re=w.oc,Wa=w.pc,Gi=w.qc,Ga=w.rc,qa=w.sc,Va=w.tc,qi=w.uc,Fa=w.vc,Ha=w.wc,ja=w.xc,Ka=w.yc,Ya=w.zc,Xa=w.Ac,Za=w.Bc,Qa=w.Cc,Rn=w.Dc,Mn=w.Ec,Vi=w.Fc,Fi=w.Gc,Hi=w.Hc,ji=w.Ic,Ki=w.Jc,Yi=w.Kc,Xi=w.Lc,Ja=w.Mc,Zi=w.Nc,es=w.Oc,ts=w.Pc,rs=w.Qc,ns=w.Sc,is=w.Tc,as=w.cd,ss=w.dd,os=w.id,us=w.nd,ls=w.od,ds=w.pd,cs=w.qd,ps=w.rd,fs=w.sd,hs=w.td,ms=w.ud,gs=w.zd,ys=w.Zd,bs=w._d,ws=w.$d,_s=w.ae,_=A,Yt}var h,x=pe();return t.instantiateWasm?new Promise(w=>{t.instantiateWasm(x,(A,D)=>{w(l(A,D))})}):n?l(new WebAssembly.Instance(_,pe()),_):(j??(j=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",f):f+"ort-wasm-simd-threaded.jsep.wasm":new URL("ort-wasm-simd-threaded.jsep.wasm",self.location.href).href),h=await(async function(w){var A=j;if(!g&&!T(A))try{var D=fetch(A,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(D,w)}catch(V){R(`wasm streaming compile failed: ${V}`),R("falling back to ArrayBuffer instantiation")}return(async function(V,ee){try{var le=await(async function(fe){if(!g)try{var Ae=await o(fe);return new Uint8Array(Ae)}catch{}if(fe==j&&g)fe=new Uint8Array(g);else{if(!u)throw"both async and sync fetching of the wasm failed";fe=u(fe)}return fe})(V);return await WebAssembly.instantiate(le,ee)}catch(fe){R(`failed to asynchronously prepare wasm: ${fe}`),Y(fe)}})(A,w)})(x),l(h.instance,h.module))}class Se{constructor(h){Ft(this,"name","ExitStatus");this.message=`Program terminated with exit(${h})`,this.status=h}}var $e=l=>{l.terminate(),l.onmessage=()=>{}},ce=[],he=0,Ie=null,ve=l=>{wt.length==0&&(vt(),ct(wt[0]));var h=wt.pop();if(!h)return 6;jt.push(h),Ot[l.Uc]=h,h.Uc=l.Uc;var x={Vc:"run",Pd:l.Od,ed:l.ed,Uc:l.Uc};return h.postMessage(x,l.md),0},oe=0,ue=(l,h,...x)=>{var w,A=16*x.length,D=Re(),V=zn(A),ee=V>>>3;for(w of x)typeof w=="bigint"?(($(),me)[ee++>>>0]=1n,($(),me)[ee++>>>0]=w):(($(),me)[ee++>>>0]=0n,($(),ie)[ee++>>>0]=w);return l=Na(l,0,A,V,h),ze(D),l};function Fe(l){if(n)return ue(0,1,l);if(v=l,!(0<oe)){for(var h of jt)$e(h);for(h of wt)$e(h);wt=[],jt=[],Ot={},N=!0}c(0,new Se(l))}function lt(l){if(n)return ue(1,0,l);rt(l)}var rt=l=>{if(v=l,n)throw lt(l),"unwind";Fe(l)},wt=[],jt=[],At=[],Ot={},xr=l=>{var h=l.Uc;delete Ot[h],wt.push(l),jt.splice(jt.indexOf(l),1),l.Uc=0,Li(h)};function dt(){At.forEach(l=>l())}var ct=l=>new Promise(h=>{l.onmessage=A=>{var D=A.data;if(A=D.Vc,D.bd&&D.bd!=On()){var V=Ot[D.bd];V?V.postMessage(D,D.md):R(`Internal error! Worker sent a message "${A}" to target pthread ${D.bd}, but that thread no longer exists!`)}else A==="checkMailbox"?lr():A==="spawnThread"?ve(D):A==="cleanupThread"?ot(()=>{xr(Ot[D.Qd])}):A==="loaded"?(l.loaded=!0,h(l)):D.target==="setimmediate"?l.postMessage(D):A==="uncaughtException"?l.onerror(D.error):A==="callHandler"?t[D.yd](...D.args):A&&R(`worker sent an unknown command ${A}`)},l.onerror=A=>{throw R(`worker sent an error! ${A.filename}:${A.lineno}: ${A.message}`),A};var x,w=[];for(x of[])t.propertyIsEnumerable(x)&&w.push(x);l.postMessage({Vc:"load",Ad:w,Rd:Gt,Sd:_})});function vt(){var l=new Worker((()=>{let h=URL;return self.location.href>"file:"&&self.location.href<"file;"?new h("ort.bundle.min.mjs",self.location.href):new URL(self.location.href)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});wt.push(l)}var Gt,In=(l,h)=>{oe=0,l=qi(l,h),0<oe?v=l:Wi(l)},ur=[],it=0;function Ro(l){var h=new Dr(l>>>=0);return($(),F)[h.Wc+12>>>0]==0&&(Jn(h,!0),it--),ei(h,!1),ur.push(h),qa(l)}var zt=0,Mo=()=>{Be(0,0);var l=ur.pop();Wa(l.gd),zt=0};function Jn(l,h){h=h?1:0,($(),F)[l.Wc+12>>>0]=h}function ei(l,h){h=h?1:0,($(),F)[l.Wc+13>>>0]=h}class Dr{constructor(h){this.gd=h,this.Wc=h-24}}var Nr=l=>{var h=zt;if(!h)return Tr(0),0;var x=new Dr(h);($(),ne)[x.Wc+16>>>2>>>0]=h;var w=($(),ne)[x.Wc+4>>>2>>>0];if(!w)return Tr(0),h;for(var A of l){if(A===0||A===w)break;if(Ga(A,w,x.Wc+16))return Tr(A),h}return Tr(w),h};function Bo(){return Nr([])}function Do(l){return Nr([l>>>0])}function No(l,h,x,w){return Nr([l>>>0,h>>>0,x>>>0,w>>>0])}var Uo=()=>{var l=ur.pop();l||Y("no exception to throw");var h=l.gd;throw($(),F)[l.Wc+13>>>0]==0&&(ur.push(l),ei(l,!0),Jn(l,!1),it++),Gi(h),zt=h};function Po(l,h,x){var w=new Dr(l>>>=0);throw h>>>=0,x>>>=0,($(),ne)[w.Wc+16>>>2>>>0]=0,($(),ne)[w.Wc+4>>>2>>>0]=h,($(),ne)[w.Wc+8>>>2>>>0]=x,Gi(l),it++,zt=l}var Lo=()=>it;function ti(l,h,x,w){return n?ue(2,1,l,h,x,w):ri(l,h,x,w)}function ri(l,h,x,w){if(l>>>=0,h>>>=0,x>>>=0,w>>>=0,!globalThis.SharedArrayBuffer)return 6;var A=[];return n&&A.length===0?ti(l,h,x,w):(l={Od:x,Uc:l,ed:w,md:A},n?(l.Vc="spawnThread",postMessage(l,A),0):ve(l))}function Wo(l){throw zt||(zt=l>>>0),zt}var ni=globalThis.TextDecoder&&new TextDecoder,ii=(l,h,x,w)=>{if(x=h+x,w)return x;for(;l[h]&&!(h>=x);)++h;return h},ai=(l,h=0,x,w)=>{if(16<(x=ii(l,h>>>=0,x,w))-h&&l.buffer&&ni)return ni.decode(l.buffer instanceof ArrayBuffer?l.subarray(h,x):l.slice(h,x));for(w="";h<x;){var A=l[h++];if(128&A){var D=63&l[h++];if((224&A)==192)w+=String.fromCharCode((31&A)<<6|D);else{var V=63&l[h++];65536>(A=(240&A)==224?(15&A)<<12|D<<6|V:(7&A)<<18|D<<12|V<<6|63&l[h++])?w+=String.fromCharCode(A):(A-=65536,w+=String.fromCharCode(55296|A>>10,56320|1023&A))}}else w+=String.fromCharCode(A)}return w},Ye=(l,h,x)=>(l>>>=0)?ai(($(),J),l,h,x):"";function si(l,h,x){return n?ue(3,1,l,h,x):0}function oi(l,h){if(n)return ue(4,1,l,h)}function ui(l,h){if(n)return ue(5,1,l,h)}function li(l,h,x){if(n)return ue(6,1,l,h,x)}function di(l,h,x){return n?ue(7,1,l,h,x):0}function ci(l,h){if(n)return ue(8,1,l,h)}function pi(l,h,x){if(n)return ue(9,1,l,h,x)}function fi(l,h,x,w){if(n)return ue(10,1,l,h,x,w)}function hi(l,h,x,w){if(n)return ue(11,1,l,h,x,w)}function mi(l,h,x,w){if(n)return ue(12,1,l,h,x,w)}function gi(l){if(n)return ue(13,1,l)}function yi(l,h){if(n)return ue(14,1,l,h)}function bi(l,h,x){if(n)return ue(15,1,l,h,x)}var Go=()=>Y(""),at=l=>{l>>>=0;for(var h="";;){var x=($(),J)[l++>>>0];if(!x)return h;h+=String.fromCharCode(x)}},Ur={},Pr={},Rt=class extends Error{constructor(l){super(l),this.name="BindingError"}};function pt(l,h,x={}){return(function(w,A,D={}){var V=A.name;if(!w)throw new Rt(`type "${V}" must have a positive integer typeid pointer`);if(Pr.hasOwnProperty(w)){if(D.Bd)return;throw new Rt(`Cannot register type '${V}' twice`)}Pr[w]=A,Ur.hasOwnProperty(w)&&(A=Ur[w],delete Ur[w],A.forEach(ee=>ee()))})(l,h,x)}var wi=(l,h,x)=>{switch(h){case 1:return x?w=>($(),F)[w>>>0]:w=>($(),J)[w>>>0];case 2:return x?w=>($(),H)[w>>>1>>>0]:w=>($(),L)[w>>>1>>>0];case 4:return x?w=>($(),M)[w>>>2>>>0]:w=>($(),ne)[w>>>2>>>0];case 8:return x?w=>($(),me)[w>>>3>>>0]:w=>($(),U)[w>>>3>>>0];default:throw new TypeError(`invalid integer width (${h}): ${l}`)}};function qo(l,h,x,w,A){l>>>=0,x>>>=0,h=at(h>>>0);let D=V=>V;if(w=w===0n){let V=8*x;D=ee=>BigInt.asUintN(V,ee),A=D(A)}pt(l,{name:h,Rc:D,Yc:(V,ee)=>(typeof ee=="number"&&(ee=BigInt(ee)),ee),Xc:wi(h,x,!w),Zc:null})}function Vo(l,h,x,w){pt(l>>>=0,{name:h=at(h>>>0),Rc:function(A){return!!A},Yc:function(A,D){return D?x:w},Xc:function(A){return this.Rc(($(),J)[A>>>0])},Zc:null})}var _i=[],$t=[0,1,,1,null,1,!0,1,!1,1];function Lr(l){9<(l>>>=0)&&--$t[l+1]===0&&($t[l]=void 0,_i.push(l))}var Je=l=>{if(!l)throw new Rt(`Cannot use deleted val. handle = ${l}`);return $t[l]},nt=l=>{switch(l){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let h=_i.pop()||$t.length;return $t[h]=l,$t[h+1]=1,h}};function Wr(l){return this.Rc(($(),ne)[l>>>2>>>0])}var Fo={name:"emscripten::val",Rc:l=>{var h=Je(l);return Lr(l),h},Yc:(l,h)=>nt(h),Xc:Wr,Zc:null};function Ho(l){return pt(l>>>0,Fo)}var jo=(l,h)=>{switch(h){case 4:return function(x){return this.Rc(($(),te)[x>>>2>>>0])};case 8:return function(x){return this.Rc(($(),ie)[x>>>3>>>0])};default:throw new TypeError(`invalid float width (${h}): ${l}`)}};function Ko(l,h,x){x>>>=0,pt(l>>>=0,{name:h=at(h>>>0),Rc:w=>w,Yc:(w,A)=>A,Xc:jo(h,x),Zc:null})}function Yo(l,h,x,w,A){l>>>=0,x>>>=0,h=at(h>>>0);let D=ee=>ee;if(w===0){var V=32-8*x;D=ee=>ee<<V>>>V,A=D(A)}pt(l,{name:h,Rc:D,Yc:(ee,le)=>le,Xc:wi(h,x,w!==0),Zc:null})}function Xo(l,h,x){function w(D){var V=($(),ne)[D>>>2>>>0];return D=($(),ne)[D+4>>>2>>>0],new A(($(),F).buffer,D,V)}var A=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][h];pt(l>>>=0,{name:x=at(x>>>0),Rc:w,Xc:w},{Bd:!0})}var mt=(l,h,x)=>{var w=($(),J);if(h>>>=0,0<x){var A=h;x=h+x-1;for(var D=0;D<l.length;++D){var V=l.codePointAt(D);if(127>=V){if(h>=x)break;w[h++>>>0]=V}else if(2047>=V){if(h+1>=x)break;w[h++>>>0]=192|V>>6,w[h++>>>0]=128|63&V}else if(65535>=V){if(h+2>=x)break;w[h++>>>0]=224|V>>12,w[h++>>>0]=128|V>>6&63,w[h++>>>0]=128|63&V}else{if(h+3>=x)break;w[h++>>>0]=240|V>>18,w[h++>>>0]=128|V>>12&63,w[h++>>>0]=128|V>>6&63,w[h++>>>0]=128|63&V,D++}}w[h>>>0]=0,l=h-A}else l=0;return l},St=l=>{for(var h=0,x=0;x<l.length;++x){var w=l.charCodeAt(x);127>=w?h++:2047>=w?h+=2:55296<=w&&57343>=w?(h+=4,++x):h+=3}return h};function Zo(l,h){pt(l>>>=0,{name:h=at(h>>>0),Rc(x){var w=($(),ne)[x>>>2>>>0];return w=Ye(x+4,w,!0),Bt(x),w},Yc(x,w){w instanceof ArrayBuffer&&(w=new Uint8Array(w));var A=typeof w=="string";if(!(A||ArrayBuffer.isView(w)&&w.BYTES_PER_ELEMENT==1))throw new Rt("Cannot pass non-string to std::string");var D=A?St(w):w.length,V=Xr(4+D+1),ee=V+4;return($(),ne)[V>>>2>>>0]=D,A?mt(w,ee,D+1):($(),J).set(w,ee>>>0),x!==null&&x.push(Bt,V),V},Xc:Wr,Zc(x){Bt(x)}})}var vi=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,Qo=(l,h,x)=>{if(l>>>=1,16<(h=ii(($(),L),l,h/2,x))-l&&vi)return vi.decode(($(),L).slice(l,h));for(x="";l<h;++l){var w=($(),L)[l>>>0];x+=String.fromCharCode(w)}return x},Jo=(l,h,x)=>{if(x??(x=2147483647),2>x)return 0;var w=h;x=(x-=2)<2*l.length?x/2:l.length;for(var A=0;A<x;++A){var D=l.charCodeAt(A);($(),H)[h>>>1>>>0]=D,h+=2}return($(),H)[h>>>1>>>0]=0,h-w},eu=l=>2*l.length,tu=(l,h,x)=>{var w="";l>>>=2;for(var A=0;!(A>=h/4);A++){var D=($(),ne)[l+A>>>0];if(!D&&!x)break;w+=String.fromCodePoint(D)}return w},ru=(l,h,x)=>{if(h>>>=0,x??(x=2147483647),4>x)return 0;var w=h;x=w+x-4;for(var A=0;A<l.length;++A){var D=l.codePointAt(A);if(65535<D&&A++,($(),M)[h>>>2>>>0]=D,(h+=4)+4>x)break}return($(),M)[h>>>2>>>0]=0,h-w},nu=l=>{for(var h=0,x=0;x<l.length;++x)65535<l.codePointAt(x)&&x++,h+=4;return h};function iu(l,h,x){if(l>>>=0,h>>>=0,x=at(x>>>=0),h===2)var w=Qo,A=Jo,D=eu;else w=tu,A=ru,D=nu;pt(l,{name:x,Rc:V=>{var ee=($(),ne)[V>>>2>>>0];return ee=w(V+4,ee*h,!0),Bt(V),ee},Yc:(V,ee)=>{if(typeof ee!="string")throw new Rt(`Cannot pass non-string to C++ string type ${x}`);var le=D(ee),fe=Xr(4+le+h);return($(),ne)[fe>>>2>>>0]=le/h,A(ee,fe+4,le+h),V!==null&&V.push(Bt,fe),fe},Xc:Wr,Zc(V){Bt(V)}})}function au(l,h){pt(l>>>=0,{Cd:!0,name:h=at(h>>>0),Rc:()=>{},Yc:()=>{}})}function su(l){Pi(l>>>0,!i,1,!r,131072,!1),dt()}var ot=l=>{if(!N)try{if(l(),!(0<oe))try{n?On()&&Wi(v):rt(v)}catch(h){h instanceof Se||h=="unwind"||c(0,h)}}catch(h){h instanceof Se||h=="unwind"||c(0,h)}},ou=!Atomics.waitAsync||((xe=globalThis.navigator)==null?void 0:xe.userAgent)&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function Gr(l){l>>>=0,ou||(Atomics.waitAsync(($(),M),l>>>2,l).value.then(lr),l+=128,Atomics.store(($(),M),l>>>2,1))}var lr=()=>ot(()=>{var l=On();l&&(Gr(l),Pa())});function uu(l,h){(l>>>=0)==h>>>0?setTimeout(lr):n?postMessage({bd:l,Vc:"checkMailbox"}):(l=Ot[l])&&l.postMessage({Vc:"checkMailbox"})}var qr=[];function lu(l,h,x,w,A){for(h>>>=0,A>>>=0,qr.length=0,x=A>>>3,w=A+w>>>3;x<w;){var D;D=($(),me)[x++>>>0]?($(),me)[x++>>>0]:($(),ie)[x++>>>0],qr.push(D)}return(h?Qi[h]:Yu[l])(...qr)}var du=()=>{oe=0};function cu(l){l>>>=0,n?postMessage({Vc:"cleanupThread",Qd:l}):xr(Ot[l])}function pu(l){}var dr=l=>{try{l()}catch(h){Y(h)}};function fu(l){var h=(...x)=>{cr.push(l);try{return l(...x)}finally{N||(cr.pop(),st&&_t===1&&cr.length===0&&(_t=0,oe+=1,dr(bs),typeof Fibers<"u"&&Fibers.de()))}};return Ti.set(l,h),h}var _t=0,st=null,$i=0,cr=[],Vr=new Map,xi=new Map,Ti=new Map,hu=0,Fr=null,mu=[],Si=l=>(function(h){if(!N){if(_t===0){var x=!1,w=!1;h((A=0)=>{if(!N&&($i=A,x=!0,w)){_t=2,dr(()=>ws(st)),typeof MainLoop<"u"&&MainLoop.xd&&MainLoop.resume(),A=!1;try{var D=(function(){var le=($(),M)[st+8>>>2>>>0];return le=xi.get(le),le=Ti.get(le),--oe,le()})()}catch(le){D=le,A=!0}var V=!1;if(!st){var ee=Fr;ee&&(Fr=null,(A?ee.reject:ee.resolve)(D),V=!0)}if(A&&!V)throw D}}),w=!0,x||(_t=1,st=(function(){var A=Xr(65548),D=A+12;if(($(),ne)[A>>>2>>>0]=D,($(),ne)[A+4>>>2>>>0]=D+65536,D=cr[0],!Vr.has(D)){var V=hu++;Vr.set(D,V),xi.set(V,D)}return D=Vr.get(D),($(),M)[A+8>>>2>>>0]=D,A})(),typeof MainLoop<"u"&&MainLoop.xd&&MainLoop.pause(),dr(()=>ys(st)))}else _t===2?(_t=0,dr(_s),Bt(st),st=null,mu.forEach(ot)):Y(`invalid state: ${_t}`);return $i}})(h=>{l().then(h)});function gu(l){return l>>>=0,Si(async()=>{var h=await Je(l);return nt(h)})}var Hr=[],yu=l=>{var h=Hr.length;return Hr.push(l),h},bu=(l,h)=>{for(var x=Array(l),w=0;w<l;++w){var A=w,D=($(),ne)[h+4*w>>>2>>>0],V=Pr[D];if(V===void 0)throw l=`parameter ${w}`,D=Ui(D),h=at(D),Bt(D),new Rt(`${l} has unknown type ${h}`);x[A]=V}return x},wu=(l,h,x)=>{var w=[];return l=l(w,x),w.length&&(($(),ne)[h>>>2>>>0]=nt(w)),l},_u={},pr=l=>{var h=_u[l];return h===void 0?at(l):h};function vu(l,h,x){var[w,...A]=bu(l,h>>>0);h=w.Yc.bind(w);var D=A.map(le=>le.Xc.bind(le));l--;var V={toValue:Je};switch(l=D.map((le,fe)=>{var Ae=`argFromPtr${fe}`;return V[Ae]=le,`${Ae}(args${fe?"+"+8*fe:""})`}),x){case 0:var ee="toValue(handle)";break;case 2:ee="new (toValue(handle))";break;case 3:ee="";break;case 1:V.getStringOrSymbol=pr,ee="toValue(handle)[getStringOrSymbol(methodName)]"}return ee+=`(${l})`,w.Cd||(V.toReturnWire=h,V.emval_returnValue=wu,ee=`return emval_returnValue(toReturnWire, destructorsRef, ${ee})`),ee=`return function (handle, methodName, destructorsRef, args) {
  ${ee}
  }`,x=new Function(Object.keys(V),ee)(...Object.values(V)),ee=`methodCaller<(${A.map(le=>le.name)}) => ${w.name}>`,yu(Object.defineProperty(x,"name",{value:ee}))}function $u(l,h){return h>>>=0,(l=Je(l>>>0))==Je(h)}function xu(l){return(l>>>=0)?(l=pr(l),nt(globalThis[l])):nt(globalThis)}function Tu(l){return l=pr(l>>>0),nt(t[l])}function Su(l,h){return h>>>=0,l=Je(l>>>0),h=Je(h),nt(l[h])}function Iu(l){9<(l>>>=0)&&($t[l+1]+=1)}function Ii(l,h,x,w,A){return Hr[l>>>0](h>>>0,x>>>0,w>>>0,A>>>0)}function Eu(l,h,x,w,A){return Ii(l>>>0,h>>>0,x>>>0,w>>>0,A>>>0)}function ku(){return nt([])}function Cu(l){l=Je(l>>>0);for(var h=Array(l.length),x=0;x<l.length;x++)h[x]=l[x];return nt(h)}function Au(l){return nt(pr(l>>>0))}function Ou(){return nt({})}function zu(l){for(var h=Je(l>>>=0);h.length;){var x=h.pop();h.pop()(x)}Lr(l)}function Ru(l,h,x){h>>>=0,x>>>=0,l=Je(l>>>0),h=Je(h),x=Je(x),l[h]=x}function Mu(l,h){l=-9007199254740992>l||9007199254740992<l?NaN:Number(l),h>>>=0,l=new Date(1e3*l),($(),M)[h>>>2>>>0]=l.getUTCSeconds(),($(),M)[h+4>>>2>>>0]=l.getUTCMinutes(),($(),M)[h+8>>>2>>>0]=l.getUTCHours(),($(),M)[h+12>>>2>>>0]=l.getUTCDate(),($(),M)[h+16>>>2>>>0]=l.getUTCMonth(),($(),M)[h+20>>>2>>>0]=l.getUTCFullYear()-1900,($(),M)[h+24>>>2>>>0]=l.getUTCDay(),l=(l.getTime()-Date.UTC(l.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,($(),M)[h+28>>>2>>>0]=l}var Ei=l=>l%4==0&&(l%100!=0||l%400==0),ki=[0,31,60,91,121,152,182,213,244,274,305,335],Ci=[0,31,59,90,120,151,181,212,243,273,304,334];function Bu(l,h){l=-9007199254740992>l||9007199254740992<l?NaN:Number(l),h>>>=0,l=new Date(1e3*l),($(),M)[h>>>2>>>0]=l.getSeconds(),($(),M)[h+4>>>2>>>0]=l.getMinutes(),($(),M)[h+8>>>2>>>0]=l.getHours(),($(),M)[h+12>>>2>>>0]=l.getDate(),($(),M)[h+16>>>2>>>0]=l.getMonth(),($(),M)[h+20>>>2>>>0]=l.getFullYear()-1900,($(),M)[h+24>>>2>>>0]=l.getDay();var x=(Ei(l.getFullYear())?ki:Ci)[l.getMonth()]+l.getDate()-1|0;($(),M)[h+28>>>2>>>0]=x,($(),M)[h+36>>>2>>>0]=-60*l.getTimezoneOffset(),x=new Date(l.getFullYear(),6,1).getTimezoneOffset();var w=new Date(l.getFullYear(),0,1).getTimezoneOffset();l=0|(x!=w&&l.getTimezoneOffset()==Math.min(w,x)),($(),M)[h+32>>>2>>>0]=l}function Du(l){l>>>=0;var h=new Date(($(),M)[l+20>>>2>>>0]+1900,($(),M)[l+16>>>2>>>0],($(),M)[l+12>>>2>>>0],($(),M)[l+8>>>2>>>0],($(),M)[l+4>>>2>>>0],($(),M)[l>>>2>>>0],0),x=($(),M)[l+32>>>2>>>0],w=h.getTimezoneOffset(),A=new Date(h.getFullYear(),6,1).getTimezoneOffset(),D=new Date(h.getFullYear(),0,1).getTimezoneOffset(),V=Math.min(D,A);return 0>x?($(),M)[l+32>>>2>>>0]=+(A!=D&&V==w):0<x!=(V==w)&&(A=Math.max(D,A),h.setTime(h.getTime()+6e4*((0<x?V:A)-w))),($(),M)[l+24>>>2>>>0]=h.getDay(),x=(Ei(h.getFullYear())?ki:Ci)[h.getMonth()]+h.getDate()-1|0,($(),M)[l+28>>>2>>>0]=x,($(),M)[l>>>2>>>0]=h.getSeconds(),($(),M)[l+4>>>2>>>0]=h.getMinutes(),($(),M)[l+8>>>2>>>0]=h.getHours(),($(),M)[l+12>>>2>>>0]=h.getDate(),($(),M)[l+16>>>2>>>0]=h.getMonth(),($(),M)[l+20>>>2>>>0]=h.getYear(),l=h.getTime(),BigInt(isNaN(l)?-1:l/1e3)}function Ai(l,h,x,w,A,D,V){return n?ue(16,1,l,h,x,w,A,D,V):-52}function Oi(l,h,x,w,A,D){if(n)return ue(17,1,l,h,x,w,A,D)}var Kt={},Nu=()=>performance.timeOrigin+performance.now();function zi(l,h){if(n)return ue(18,1,l,h);if(Kt[l]&&(clearTimeout(Kt[l].id),delete Kt[l]),!h)return 0;var x=setTimeout(()=>{delete Kt[l],ot(()=>Ua(l,performance.timeOrigin+performance.now()))},h);return Kt[l]={id:x,ce:h},0}function Uu(l,h,x,w){l>>>=0,h>>>=0,x>>>=0,w>>>=0;var A=new Date().getFullYear(),D=new Date(A,0,1).getTimezoneOffset();A=new Date(A,6,1).getTimezoneOffset();var V=Math.max(D,A);($(),ne)[l>>>2>>>0]=60*V,($(),M)[h>>>2>>>0]=+(D!=A),l=(h=ee=>{var le=Math.abs(ee);return`UTC${0<=ee?"-":"+"}${String(Math.floor(le/60)).padStart(2,"0")}${String(le%60).padStart(2,"0")}`})(D),h=h(A),A<D?(mt(l,x,17),mt(h,w,17)):(mt(l,w,17),mt(h,x,17))}var Pu=()=>Date.now();function Lu(l,h,x){return x>>>=0,0<=l&&3>=l?(l===0?l=Date.now():l=performance.timeOrigin+performance.now(),l=Math.round(1e6*l),($(),me)[x>>>3>>>0]=BigInt(l),0):28}var jr=[],Ri=(l,h)=>{jr.length=0;for(var x;x=($(),J)[l++>>>0];){var w=x!=105;h+=(w&=x!=112)&&h%8?4:0,jr.push(x==112?($(),ne)[h>>>2>>>0]:x==106?($(),me)[h>>>3>>>0]:x==105?($(),M)[h>>>2>>>0]:($(),ie)[h>>>3>>>0]),h+=w?8:4}return jr};function Wu(l,h,x){return l>>>=0,h=Ri(h>>>0,x>>>0),Qi[l](...h)}function Gu(l,h,x){return l>>>=0,h=Ri(h>>>0,x>>>0),Qi[l](...h)}var qu=()=>{};function Vu(l,h){return R(Ye(l>>>0,h>>>0))}var Fu=()=>{throw oe+=1,"unwind"};function Hu(){return 4294901760}var ju=()=>navigator.hardwareConcurrency,fr={},qt=l=>{var h;return(h=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(l))?+h[1]:(h=/:(\d+):\d+(?:\)|$)/.exec(l))?2147483648|+h[1]:0},Mi=l=>{for(var h of l)(l=qt(h))&&(fr[l]=h)};function En(){var l=Error().stack.toString().split(`
`);return l[0]=="Error"&&l.shift(),Mi(l),fr.kd=qt(l[3]),fr.Md=l,fr.kd}function Kr(l){if(!(l=fr[l>>>0]))return 0;var h;if(h=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(l))l=h[1];else if(h=/^\s+at (.*) \(.*\)$/.exec(l))l=h[1];else{if(!(h=/^(.+?)@/.exec(l)))return 0;l=h[1]}Bt(Kr.ld??0),h=St(l)+1;var x=Xr(h);return x&&mt(l,x,h),Kr.ld=x,Kr.ld}function Ku(l){l>>>=0;var h=($(),J).length;if(l<=h||4294901760<l)return!1;for(var x=1;4>=x;x*=2){var w=h*(1+.2/x);w=Math.min(w,l+100663296);e:{w=(Math.min(4294901760,65536*Math.ceil(Math.max(l,w)/65536))-Gt.buffer.byteLength+65535)/65536|0;try{Gt.grow(w),K();var A=1;break e}catch{}A=void 0}if(A)return!0}return!1}function kn(l,h,x){if(l>>>=0,h>>>=0,fr.kd==l)var w=fr.Md;else(w=Error().stack.toString().split(`
`))[0]=="Error"&&w.shift(),Mi(w);for(var A=3;w[A]&&qt(w[A])!=l;)++A;for(l=0;l<x&&w[l+A];++l)($(),M)[h+4*l>>>2>>>0]=qt(w[l+A]);return l}var Bi,Di={},Mt=()=>{var w;if(!Bi){var l,h={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(((w=globalThis.navigator)==null?void 0:w.language)??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(l in Di)Di[l]===void 0?delete h[l]:h[l]=Di[l];var x=[];for(l in h)x.push(`${l}=${h[l]}`);Bi=x}return Bi};function hr(l,h){if(n)return ue(19,1,l,h);l>>>=0,h>>>=0;var x,w=0,A=0;for(x of Mt()){var D=h+w;($(),ne)[l+A>>>2>>>0]=D,w+=mt(x,D,1/0)+1,A+=4}return 0}function ut(l,h){if(n)return ue(20,1,l,h);l>>>=0,h>>>=0;var x=Mt();for(var w of(($(),ne)[l>>>2>>>0]=x.length,l=0,x))l+=St(w)+1;return($(),ne)[h>>>2>>>0]=l,0}function Ni(l){return n?ue(21,1,l):52}function Vt(l,h,x,w,A){return n?ue(22,1,l,h,x,w,A):52}function Yr(l,h,x,w){return n?ue(23,1,l,h,x,w):52}function mr(l,h,x,w){return n?ue(24,1,l,h,x,w):70}var we=[null,[],[]];function Cn(l,h,x,w){if(n)return ue(25,1,l,h,x,w);h>>>=0,x>>>=0,w>>>=0;for(var A=0,D=0;D<x;D++){var V=($(),ne)[h>>>2>>>0],ee=($(),ne)[h+4>>>2>>>0];h+=8;for(var le=0;le<ee;le++){var fe=l,Ae=($(),J)[V+le>>>0],De=we[fe];Ae===0||Ae===10?((fe===1?z:R)(ai(De)),De.length=0):De.push(Ae)}A+=ee}return($(),ne)[w>>>2>>>0]=A,0}function An(l){return l>>>0}n||(function(){for(var l=t.numThreads-1;l--;)vt();ce.push(async()=>{var h=(async function(){if(!n)return Promise.all(wt.map(ct))})();he++,await h,--he==0&&Ie&&(h=Ie,Ie=null,h())})})(),n||(Gt=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),K()),t.wasmBinary&&(g=t.wasmBinary),t.stackSave=()=>Re(),t.stackRestore=l=>ze(l),t.stackAlloc=l=>zn(l),t.setValue=function(l,h,x="i8"){switch(x.endsWith("*")&&(x="*"),x){case"i1":case"i8":($(),F)[l>>>0]=h;break;case"i16":($(),H)[l>>>1>>>0]=h;break;case"i32":($(),M)[l>>>2>>>0]=h;break;case"i64":($(),me)[l>>>3>>>0]=BigInt(h);break;case"float":($(),te)[l>>>2>>>0]=h;break;case"double":($(),ie)[l>>>3>>>0]=h;break;case"*":($(),ne)[l>>>2>>>0]=h;break;default:Y(`invalid type for setValue: ${x}`)}},t.getValue=function(l,h="i8"){switch(h.endsWith("*")&&(h="*"),h){case"i1":case"i8":return($(),F)[l>>>0];case"i16":return($(),H)[l>>>1>>>0];case"i32":return($(),M)[l>>>2>>>0];case"i64":return($(),me)[l>>>3>>>0];case"float":return($(),te)[l>>>2>>>0];case"double":return($(),ie)[l>>>3>>>0];case"*":return($(),ne)[l>>>2>>>0];default:Y(`invalid type for getValue: ${h}`)}},t.UTF8ToString=Ye,t.stringToUTF8=mt,t.lengthBytesUTF8=St;var Ui,It,On,Bt,Xr,Pi,Da,Na,Li,Wi,Ua,Pa,Be,Tr,La,ze,zn,Re,Wa,Gi,Ga,qa,Va,qi,Fa,Ha,ja,Ka,Ya,Xa,Za,Qa,Rn,Mn,Vi,Fi,Hi,ji,Ki,Yi,Xi,Ja,Zi,es,ts,rs,ns,is,as,ss,os,us,ls,ds,cs,ps,fs,hs,ms,gs,ys,bs,ws,_s,Yt,Yu=[Fe,lt,ti,si,oi,ui,li,di,ci,pi,fi,hi,mi,gi,yi,bi,Ai,Oi,zi,hr,ut,Ni,Vt,Yr,mr,Cn],Qi={1086876:(l,h,x,w,A)=>{if(t===void 0||!t.ad)return 1;if((l=Ye(Number(l>>>0))).startsWith("./")&&(l=l.substring(2)),!(l=t.ad.get(l)))return 2;if(h=Number(h>>>0),x=Number(x>>>0),w=Number(w>>>0),h+x>l.byteLength)return 3;try{let D=l.subarray(h,h+x);switch(A){case 0:($(),J).set(D,w>>>0);break;case 1:t.Td?t.Td(w,D):t.Ld(w,D);break;default:return 4}return 0}catch{return 4}},1087700:(l,h,x)=>{t.wd(l,($(),J).subarray(h>>>0,h+x>>>0))},1087764:()=>t.Vd(),1087806:l=>{t.vd(l)},1087843:()=>{t.Ed()},1087874:()=>{t.Fd()},1087903:()=>{t.Jd()},1087928:l=>t.Dd(l),1087961:l=>t.Hd(l),1087993:(l,h,x)=>{t.jd(Number(l),Number(h),Number(x),!0)},1088056:(l,h,x)=>{t.jd(Number(l),Number(h),Number(x))},1088113:()=>typeof wasmOffsetConverter<"u",1088170:l=>{t.bc("Abs",l,void 0)},1088221:l=>{t.bc("Neg",l,void 0)},1088272:l=>{t.bc("Floor",l,void 0)},1088325:l=>{t.bc("Ceil",l,void 0)},1088377:l=>{t.bc("Reciprocal",l,void 0)},1088435:l=>{t.bc("Sqrt",l,void 0)},1088487:l=>{t.bc("Exp",l,void 0)},1088538:l=>{t.bc("Erf",l,void 0)},1088589:l=>{t.bc("Sigmoid",l,void 0)},1088644:(l,h,x)=>{t.bc("HardSigmoid",l,{alpha:h,beta:x})},1088723:l=>{t.bc("HardSwish",l,void 0)},1088780:l=>{t.bc("Log",l,void 0)},1088831:l=>{t.bc("Sin",l,void 0)},1088882:l=>{t.bc("Cos",l,void 0)},1088933:l=>{t.bc("Tan",l,void 0)},1088984:l=>{t.bc("Asin",l,void 0)},1089036:l=>{t.bc("Acos",l,void 0)},1089088:l=>{t.bc("Atan",l,void 0)},1089140:l=>{t.bc("Sinh",l,void 0)},1089192:l=>{t.bc("Cosh",l,void 0)},1089244:l=>{t.bc("Asinh",l,void 0)},1089297:l=>{t.bc("Acosh",l,void 0)},1089350:l=>{t.bc("Atanh",l,void 0)},1089403:l=>{t.bc("Tanh",l,void 0)},1089455:l=>{t.bc("Not",l,void 0)},1089506:(l,h,x)=>{t.bc("Clip",l,{min:h,max:x})},1089575:l=>{t.bc("Clip",l,void 0)},1089627:(l,h)=>{t.bc("Elu",l,{alpha:h})},1089685:l=>{t.bc("Gelu",l,void 0)},1089737:l=>{t.bc("Relu",l,void 0)},1089789:(l,h)=>{t.bc("LeakyRelu",l,{alpha:h})},1089853:(l,h)=>{t.bc("ThresholdedRelu",l,{alpha:h})},1089923:(l,h)=>{t.bc("Cast",l,{to:h})},1089981:l=>{t.bc("Add",l,void 0)},1090032:l=>{t.bc("Sub",l,void 0)},1090083:l=>{t.bc("Mul",l,void 0)},1090134:l=>{t.bc("Div",l,void 0)},1090185:l=>{t.bc("Pow",l,void 0)},1090236:l=>{t.bc("Equal",l,void 0)},1090289:l=>{t.bc("Greater",l,void 0)},1090344:l=>{t.bc("GreaterOrEqual",l,void 0)},1090406:l=>{t.bc("Less",l,void 0)},1090458:l=>{t.bc("LessOrEqual",l,void 0)},1090517:(l,h,x,w,A)=>{t.bc("ReduceMean",l,{keepDims:!!h,noopWithEmptyAxes:!!x,axes:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[]})},1090692:(l,h,x,w,A)=>{t.bc("ReduceMax",l,{keepDims:!!h,noopWithEmptyAxes:!!x,axes:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[]})},1090866:(l,h,x,w,A)=>{t.bc("ReduceMin",l,{keepDims:!!h,noopWithEmptyAxes:!!x,axes:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[]})},1091040:(l,h,x,w,A)=>{t.bc("ReduceProd",l,{keepDims:!!h,noopWithEmptyAxes:!!x,axes:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[]})},1091215:(l,h,x,w,A)=>{t.bc("ReduceSum",l,{keepDims:!!h,noopWithEmptyAxes:!!x,axes:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[]})},1091389:(l,h,x,w,A)=>{t.bc("ReduceL1",l,{keepDims:!!h,noopWithEmptyAxes:!!x,axes:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[]})},1091562:(l,h,x,w,A)=>{t.bc("ReduceL2",l,{keepDims:!!h,noopWithEmptyAxes:!!x,axes:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[]})},1091735:(l,h,x,w,A)=>{t.bc("ReduceLogSum",l,{keepDims:!!h,noopWithEmptyAxes:!!x,axes:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[]})},1091912:(l,h,x,w,A)=>{t.bc("ReduceSumSquare",l,{keepDims:!!h,noopWithEmptyAxes:!!x,axes:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[]})},1092092:(l,h,x,w,A)=>{t.bc("ReduceLogSumExp",l,{keepDims:!!h,noopWithEmptyAxes:!!x,axes:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[]})},1092272:l=>{t.bc("Where",l,void 0)},1092325:(l,h,x)=>{t.bc("Transpose",l,{perm:h?Array.from(($(),M).subarray(Number(h)>>>0,Number(x)>>>0)):[]})},1092449:(l,h,x,w)=>{t.bc("DepthToSpace",l,{blocksize:h,mode:Ye(x),format:w?"NHWC":"NCHW"})},1092582:(l,h,x,w)=>{t.bc("DepthToSpace",l,{blocksize:h,mode:Ye(x),format:w?"NHWC":"NCHW"})},1092715:(l,h,x,w)=>{t.bc("DFT",l,{axis:h,inverse:x,onesided:w})},1092807:(l,h,x,w,A,D,V,ee,le,fe,Ae,De,Ge,He,Xt)=>{t.bc("ConvTranspose",l,{format:le?"NHWC":"NCHW",autoPad:h,dilations:[x],group:w,kernelShape:[A],pads:[D,V],strides:[ee],wIsConst:()=>!!($(),F)[fe>>>0],outputPadding:Ae?Array.from(($(),M).subarray(Number(Ae)>>>0,Number(De)>>>0)):[],outputShape:Ge?Array.from(($(),M).subarray(Number(Ge)>>>0,Number(He)>>>0)):[],activation:Ye(Xt)})},1093240:(l,h,x,w,A,D,V,ee,le,fe,Ae,De,Ge,He)=>{t.bc("ConvTranspose",l,{format:ee?"NHWC":"NCHW",autoPad:h,dilations:Array.from(($(),M).subarray(Number(x)>>>0,(Number(x)>>>0)+2>>>0)),group:w,kernelShape:Array.from(($(),M).subarray(Number(A)>>>0,(Number(A)>>>0)+2>>>0)),pads:Array.from(($(),M).subarray(Number(D)>>>0,(Number(D)>>>0)+4>>>0)),strides:Array.from(($(),M).subarray(Number(V)>>>0,(Number(V)>>>0)+2>>>0)),wIsConst:()=>!!($(),F)[le>>>0],outputPadding:fe?Array.from(($(),M).subarray(Number(fe)>>>0,Number(Ae)>>>0)):[],outputShape:De?Array.from(($(),M).subarray(Number(De)>>>0,Number(Ge)>>>0)):[],activation:Ye(He)})},1093901:(l,h,x,w,A,D,V,ee,le,fe,Ae,De,Ge,He,Xt)=>{t.bc("ConvTranspose",l,{format:le?"NHWC":"NCHW",autoPad:h,dilations:[x],group:w,kernelShape:[A],pads:[D,V],strides:[ee],wIsConst:()=>!!($(),F)[fe>>>0],outputPadding:Ae?Array.from(($(),M).subarray(Number(Ae)>>>0,Number(De)>>>0)):[],outputShape:Ge?Array.from(($(),M).subarray(Number(Ge)>>>0,Number(He)>>>0)):[],activation:Ye(Xt)})},1094334:(l,h,x,w,A,D,V,ee,le,fe,Ae,De,Ge,He)=>{t.bc("ConvTranspose",l,{format:ee?"NHWC":"NCHW",autoPad:h,dilations:Array.from(($(),M).subarray(Number(x)>>>0,(Number(x)>>>0)+2>>>0)),group:w,kernelShape:Array.from(($(),M).subarray(Number(A)>>>0,(Number(A)>>>0)+2>>>0)),pads:Array.from(($(),M).subarray(Number(D)>>>0,(Number(D)>>>0)+4>>>0)),strides:Array.from(($(),M).subarray(Number(V)>>>0,(Number(V)>>>0)+2>>>0)),wIsConst:()=>!!($(),F)[le>>>0],outputPadding:fe?Array.from(($(),M).subarray(Number(fe)>>>0,Number(Ae)>>>0)):[],outputShape:De?Array.from(($(),M).subarray(Number(De)>>>0,Number(Ge)>>>0)):[],activation:Ye(He)})},1094995:(l,h)=>{t.bc("GlobalAveragePool",l,{format:h?"NHWC":"NCHW"})},1095086:(l,h,x,w,A,D,V,ee,le,fe,Ae,De,Ge,He)=>{t.bc("AveragePool",l,{format:He?"NHWC":"NCHW",auto_pad:h,ceil_mode:x,count_include_pad:w,storage_order:A,dilations:D?Array.from(($(),M).subarray(Number(D)>>>0,Number(V)>>>0)):[],kernel_shape:ee?Array.from(($(),M).subarray(Number(ee)>>>0,Number(le)>>>0)):[],pads:fe?Array.from(($(),M).subarray(Number(fe)>>>0,Number(Ae)>>>0)):[],strides:De?Array.from(($(),M).subarray(Number(De)>>>0,Number(Ge)>>>0)):[]})},1095565:(l,h)=>{t.bc("GlobalAveragePool",l,{format:h?"NHWC":"NCHW"})},1095656:(l,h,x,w,A,D,V,ee,le,fe,Ae,De,Ge,He)=>{t.bc("AveragePool",l,{format:He?"NHWC":"NCHW",auto_pad:h,ceil_mode:x,count_include_pad:w,storage_order:A,dilations:D?Array.from(($(),M).subarray(Number(D)>>>0,Number(V)>>>0)):[],kernel_shape:ee?Array.from(($(),M).subarray(Number(ee)>>>0,Number(le)>>>0)):[],pads:fe?Array.from(($(),M).subarray(Number(fe)>>>0,Number(Ae)>>>0)):[],strides:De?Array.from(($(),M).subarray(Number(De)>>>0,Number(Ge)>>>0)):[]})},1096135:(l,h)=>{t.bc("GlobalMaxPool",l,{format:h?"NHWC":"NCHW"})},1096222:(l,h,x,w,A,D,V,ee,le,fe,Ae,De,Ge,He)=>{t.bc("MaxPool",l,{format:He?"NHWC":"NCHW",auto_pad:h,ceil_mode:x,count_include_pad:w,storage_order:A,dilations:D?Array.from(($(),M).subarray(Number(D)>>>0,Number(V)>>>0)):[],kernel_shape:ee?Array.from(($(),M).subarray(Number(ee)>>>0,Number(le)>>>0)):[],pads:fe?Array.from(($(),M).subarray(Number(fe)>>>0,Number(Ae)>>>0)):[],strides:De?Array.from(($(),M).subarray(Number(De)>>>0,Number(Ge)>>>0)):[]})},1096697:(l,h)=>{t.bc("GlobalMaxPool",l,{format:h?"NHWC":"NCHW"})},1096784:(l,h,x,w,A,D,V,ee,le,fe,Ae,De,Ge,He)=>{t.bc("MaxPool",l,{format:He?"NHWC":"NCHW",auto_pad:h,ceil_mode:x,count_include_pad:w,storage_order:A,dilations:D?Array.from(($(),M).subarray(Number(D)>>>0,Number(V)>>>0)):[],kernel_shape:ee?Array.from(($(),M).subarray(Number(ee)>>>0,Number(le)>>>0)):[],pads:fe?Array.from(($(),M).subarray(Number(fe)>>>0,Number(Ae)>>>0)):[],strides:De?Array.from(($(),M).subarray(Number(De)>>>0,Number(Ge)>>>0)):[]})},1097259:(l,h,x,w,A)=>{t.bc("Gemm",l,{alpha:h,beta:x,transA:w,transB:A})},1097363:l=>{t.bc("MatMul",l,void 0)},1097417:(l,h,x,w)=>{t.bc("ArgMax",l,{keepDims:!!h,selectLastIndex:!!x,axis:w})},1097525:(l,h,x,w)=>{t.bc("ArgMin",l,{keepDims:!!h,selectLastIndex:!!x,axis:w})},1097633:(l,h)=>{t.bc("Softmax",l,{axis:h})},1097696:(l,h)=>{t.bc("Concat",l,{axis:h})},1097756:(l,h,x,w,A)=>{t.bc("Split",l,{axis:h,numOutputs:x,splitSizes:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[]})},1097912:l=>{t.bc("Expand",l,void 0)},1097966:(l,h)=>{t.bc("Gather",l,{axis:Number(h)})},1098037:(l,h)=>{t.bc("GatherElements",l,{axis:Number(h)})},1098116:(l,h)=>{t.bc("GatherND",l,{batch_dims:Number(h)})},1098195:(l,h,x,w,A,D,V,ee,le,fe,Ae)=>{t.bc("Resize",l,{antialias:h,axes:x?Array.from(($(),M).subarray(Number(x)>>>0,Number(w)>>>0)):[],coordinateTransformMode:Ye(A),cubicCoeffA:D,excludeOutside:V,extrapolationValue:ee,keepAspectRatioPolicy:Ye(le),mode:Ye(fe),nearestMode:Ye(Ae)})},1098557:(l,h,x,w,A,D,V)=>{t.bc("Slice",l,{starts:h?Array.from(($(),M).subarray(Number(h)>>>0,Number(x)>>>0)):[],ends:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[],axes:D?Array.from(($(),M).subarray(Number(D)>>>0,Number(V)>>>0)):[]})},1098821:l=>{t.bc("Tile",l,void 0)},1098873:(l,h,x)=>{t.bc("InstanceNormalization",l,{epsilon:h,format:x?"NHWC":"NCHW"})},1098987:(l,h,x)=>{t.bc("InstanceNormalization",l,{epsilon:h,format:x?"NHWC":"NCHW"})},1099101:l=>{t.bc("Range",l,void 0)},1099154:(l,h)=>{t.bc("Einsum",l,{equation:Ye(h)})},1099235:(l,h,x,w,A)=>{t.bc("Pad",l,{mode:h,value:x,pads:w?Array.from(($(),M).subarray(Number(w)>>>0,Number(A)>>>0)):[]})},1099378:(l,h,x,w,A,D)=>{t.bc("BatchNormalization",l,{epsilon:h,momentum:x,spatial:!!A,trainingMode:!!w,format:D?"NHWC":"NCHW"})},1099547:(l,h,x,w,A,D)=>{t.bc("BatchNormalization",l,{epsilon:h,momentum:x,spatial:!!A,trainingMode:!!w,format:D?"NHWC":"NCHW"})},1099716:(l,h,x)=>{t.bc("CumSum",l,{exclusive:Number(h),reverse:Number(x)})},1099813:(l,h,x)=>{t.bc("DequantizeLinear",l,{axis:h,blockSize:x})},1099903:(l,h,x,w,A)=>{t.bc("GridSample",l,{align_corners:h,mode:Ye(x),padding_mode:Ye(w),format:A?"NHWC":"NCHW"})},1100073:(l,h,x,w,A)=>{t.bc("GridSample",l,{align_corners:h,mode:Ye(x),padding_mode:Ye(w),format:A?"NHWC":"NCHW"})},1100243:(l,h)=>{t.bc("ScatterND",l,{reduction:Ye(h)})},1100328:(l,h,x,w,A,D,V,ee,le)=>{t.bc("Attention",l,{numHeads:h,isUnidirectional:x,maskFilterValue:w,scale:A,doRotary:D,qkvHiddenSizes:V?Array.from(($(),M).subarray(Number(ee)>>>0,Number(ee)+V>>>0)):[],pastPresentShareBuffer:!!le})},1100600:l=>{t.bc("BiasAdd",l,void 0)},1100655:l=>{t.bc("BiasSplitGelu",l,void 0)},1100716:l=>{t.bc("FastGelu",l,void 0)},1100772:(l,h,x,w,A,D,V,ee,le,fe,Ae,De,Ge,He,Xt,Dn)=>{t.bc("Conv",l,{format:De?"NHWC":"NCHW",auto_pad:h,dilations:x?Array.from(($(),M).subarray(Number(x)>>>0,Number(w)>>>0)):[],group:A,kernel_shape:D?Array.from(($(),M).subarray(Number(D)>>>0,Number(V)>>>0)):[],pads:ee?Array.from(($(),M).subarray(Number(ee)>>>0,Number(le)>>>0)):[],strides:fe?Array.from(($(),M).subarray(Number(fe)>>>0,Number(Ae)>>>0)):[],w_is_const:()=>!!($(),F)[Number(Ge)>>>0],activation:Ye(He),activation_params:Xt?Array.from(($(),te).subarray(Number(Xt)>>>0,Number(Dn)>>>0)):[]})},1101356:l=>{t.bc("Gelu",l,void 0)},1101408:(l,h,x,w,A,D,V,ee,le)=>{t.bc("GroupQueryAttention",l,{numHeads:h,kvNumHeads:x,scale:w,softcap:A,doRotary:D,rotaryInterleaved:V,smoothSoftmax:ee,localWindowSize:le})},1101625:(l,h,x,w)=>{t.bc("LayerNormalization",l,{axis:h,epsilon:x,simplified:!!w})},1101736:(l,h,x,w)=>{t.bc("LayerNormalization",l,{axis:h,epsilon:x,simplified:!!w})},1101847:(l,h,x,w,A,D)=>{t.bc("MatMulNBits",l,{k:h,n:x,accuracyLevel:w,bits:A,blockSize:D})},1101974:(l,h,x,w,A,D)=>{t.bc("MultiHeadAttention",l,{numHeads:h,isUnidirectional:x,maskFilterValue:w,scale:A,doRotary:D})},1102133:(l,h)=>{t.bc("QuickGelu",l,{alpha:h})},1102197:(l,h,x,w,A)=>{t.bc("RotaryEmbedding",l,{interleaved:!!h,numHeads:x,rotaryEmbeddingDim:w,scale:A})},1102336:(l,h,x)=>{t.bc("SkipLayerNormalization",l,{epsilon:h,simplified:!!x})},1102438:(l,h,x)=>{t.bc("SkipLayerNormalization",l,{epsilon:h,simplified:!!x})},1102540:(l,h,x,w)=>{t.bc("GatherBlockQuantized",l,{gatherAxis:h,quantizeAxis:x,blockSize:w})},1102661:l=>{t.Id(l)},1102695:(l,h)=>t.Kd(Number(l),Number(h),t.$c.Nd,t.$c.errors)};function Xu(l,h,x){return Si(async()=>{await t.Gd(Number(l),Number(h),Number(x))})}function Zu(){return typeof wasmOffsetConverter<"u"}function Qu(l,h,x,w){var A=Re();try{return Qa(l,h,x,w)}catch(D){if(ze(A),D!==D+0)throw D;Be(1,0)}}function Ju(l,h,x){var w=Re();try{return Ka(l,h,x)}catch(A){if(ze(w),A!==A+0)throw A;Be(1,0)}}function vs(l){var h=Re();try{Fa(l)}catch(x){if(ze(h),x!==x+0)throw x;Be(1,0)}}function $s(l,h){var x=Re();try{return qi(l,h)}catch(w){if(ze(x),w!==w+0)throw w;Be(1,0)}}function xs(l,h,x){var w=Re();try{Va(l,h,x)}catch(A){if(ze(w),A!==A+0)throw A;Be(1,0)}}function Ji(l,h){var x=Re();try{Rn(l,h)}catch(w){if(ze(x),w!==w+0)throw w;Be(1,0)}}function Bn(l,h,x,w,A,D,V){var ee=Re();try{return Xa(l,h,x,w,A,D,V)}catch(le){if(ze(ee),le!==le+0)throw le;Be(1,0)}}function Et(l,h,x,w,A,D){var V=Re();try{Ha(l,h,x,w,A,D)}catch(ee){if(ze(V),ee!==ee+0)throw ee;Be(1,0)}}function gr(l,h,x,w){var A=Re();try{Za(l,h,x,w)}catch(D){if(ze(A),D!==D+0)throw D;Be(1,0)}}function Ts(l,h,x,w,A){var D=Re();try{ja(l,h,x,w,A)}catch(V){if(ze(D),V!==V+0)throw V;Be(1,0)}}function Ss(l,h,x,w,A,D,V){var ee=Re();try{Vi(l,h,x,w,A,D,V)}catch(le){if(ze(ee),le!==le+0)throw le;Be(1,0)}}function Is(l,h,x,w,A,D,V){var ee=Re();try{Fi(l,h,x,w,A,D,V)}catch(le){if(ze(ee),le!==le+0)throw le;Be(1,0)}}function Es(l,h,x,w,A,D,V,ee){var le=Re();try{Yi(l,h,x,w,A,D,V,ee)}catch(fe){if(ze(le),fe!==fe+0)throw fe;Be(1,0)}}function ks(l,h,x,w,A){var D=Re();try{return Mn(l,h,x,w,A)}catch(V){if(ze(D),V!==V+0)throw V;Be(1,0)}}function Cs(l,h,x){var w=Re();try{return Xi(l,h,x)}catch(A){if(ze(w),A!==A+0)throw A;Be(1,0)}}function As(l,h,x,w,A,D,V,ee){var le=Re();try{Ja(l,h,x,w,A,D,V,ee)}catch(fe){if(ze(le),fe!==fe+0)throw fe;Be(1,0)}}function Os(l,h,x,w,A,D,V,ee,le,fe,Ae,De){var Ge=Re();try{Hi(l,h,x,w,A,D,V,ee,le,fe,Ae,De)}catch(He){if(ze(Ge),He!==He+0)throw He;Be(1,0)}}function zs(l,h,x){var w=Re();try{return Zi(l,h,x)}catch(A){if(ze(w),A!==A+0)throw A;return Be(1,0),0n}}function Rs(l,h,x,w,A,D,V,ee,le){var fe=Re();try{Ya(l,h,x,w,A,D,V,ee,le)}catch(Ae){if(ze(fe),Ae!==Ae+0)throw Ae;Be(1,0)}}function Ms(l){var h=Re();try{return es(l)}catch(x){if(ze(h),x!==x+0)throw x;Be(1,0)}}function ea(l,h){var x=Re();try{return gs(l,h)}catch(w){if(ze(x),w!==w+0)throw w;return Be(1,0),0n}}function ta(l,h,x,w){var A=Re();try{return ts(l,h,x,w)}catch(D){if(ze(A),D!==D+0)throw D;Be(1,0)}}function ra(l){var h=Re();try{return rs(l)}catch(x){if(ze(h),x!==x+0)throw x;return Be(1,0),0n}}function na(l,h,x,w){var A=Re();try{return us(l,h,x,w)}catch(D){if(ze(A),D!==D+0)throw D;Be(1,0)}}function Zr(l,h,x,w,A){var D=Re();try{return ls(l,h,x,w,A)}catch(V){if(ze(D),V!==V+0)throw V;Be(1,0)}}function ia(l,h,x,w,A,D){var V=Re();try{return ds(l,h,x,w,A,D)}catch(ee){if(ze(V),ee!==ee+0)throw ee;Be(1,0)}}function Bs(l,h,x,w,A,D){var V=Re();try{return ji(l,h,x,w,A,D)}catch(ee){if(ze(V),ee!==ee+0)throw ee;Be(1,0)}}function aa(l,h,x,w,A,D){var V=Re();try{return cs(l,h,x,w,A,D)}catch(ee){if(ze(V),ee!==ee+0)throw ee;Be(1,0)}}function Ds(l,h,x,w,A,D,V,ee){var le=Re();try{return Ki(l,h,x,w,A,D,V,ee)}catch(fe){if(ze(le),fe!==fe+0)throw fe;Be(1,0)}}function Ns(l,h,x,w,A){var D=Re();try{return ps(l,h,x,w,A)}catch(V){if(ze(D),V!==V+0)throw V;return Be(1,0),0n}}function Us(l,h,x,w){var A=Re();try{return fs(l,h,x,w)}catch(D){if(ze(A),D!==D+0)throw D;Be(1,0)}}function sa(l,h,x,w){var A=Re();try{return hs(l,h,x,w)}catch(D){if(ze(A),D!==D+0)throw D;Be(1,0)}}function Ps(l,h,x,w,A,D,V,ee,le,fe,Ae,De){var Ge=Re();try{return ms(l,h,x,w,A,D,V,ee,le,fe,Ae,De)}catch(He){if(ze(Ge),He!==He+0)throw He;Be(1,0)}}function Ls(l,h,x,w,A,D,V,ee,le,fe,Ae){var De=Re();try{ss(l,h,x,w,A,D,V,ee,le,fe,Ae)}catch(Ge){if(ze(De),Ge!==Ge+0)throw Ge;Be(1,0)}}function oa(l,h,x,w,A,D,V,ee,le,fe,Ae,De,Ge,He,Xt,Dn){var Gs=Re();try{os(l,h,x,w,A,D,V,ee,le,fe,Ae,De,Ge,He,Xt,Dn)}catch(Nn){if(ze(Gs),Nn!==Nn+0)throw Nn;Be(1,0)}}function Me(l,h,x){var w=Re();try{return ns(l,h,x)}catch(A){if(ze(w),A!==A+0)throw A;Be(1,0)}}function Qr(l,h,x){var w=Re();try{return is(l,h,x)}catch(A){if(ze(w),A!==A+0)throw A;Be(1,0)}}function Ws(l,h,x,w){var A=Re();try{as(l,h,x,w)}catch(D){if(ze(A),D!==D+0)throw D;Be(1,0)}}function _e(){if(0<he)Ie=_e;else if(n)S==null||S(t),X();else{for(var l=ce;0<l.length;)l.shift()(t);0<he?Ie=_e:(t.calledRun=!0,N||(X(),S==null||S(t)))}}return n||(Yt=await Ce(),_e()),t.PTR_SIZE=4,q?t:new Promise((l,h)=>{S=l,k=h})}var tb,Ff,A$=ae(()=>{"use strict";var e,t;tb=Vf,Ff=(t=(e=globalThis.self)==null?void 0:e.name)==null?void 0:t.startsWith("em-pthread"),Ff&&Vf()}),Kl,Jd,Hf,Nt,rb,Xs,jf,Kf,Yl,Yf,Xl,nb,Zl,ib,qc=ae(()=>{"use strict";Gc(),Kl=typeof location>"u"?void 0:location.origin,Jd=self.location.href>"file:"&&self.location.href<"file;",Hf=()=>{if(Jd){let e=URL;return new URL(new e("ort.bundle.min.mjs",self.location.href).href,Kl).href}return self.location.href},Nt=Hf(),rb=()=>{if(Nt&&!Nt.startsWith("blob:"))return Nt.substring(0,Nt.lastIndexOf("/")+1)},Xs=(e,t)=>{try{let r=t??Nt;return(r?new URL(e,r):new URL(e)).origin===Kl}catch{return!1}},jf=(e,t)=>{let r=t??Nt;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},Kf=(e,t)=>`${t??"./"}${e}`,Yl=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Yf=async e=>(await import(e)).default,Xl=(C$(),Ra(Qy)).default,nb=async()=>{if(!Nt)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Xs(Nt))return[void 0,Xl()];let e=await Yl(Nt);return[e,Xl(e)]},Zl=(A$(),Ra(eb)).default,ib=async(e,t,r,i)=>{let n=Zl&&!(e||t);if(n)if(Nt)n=Xs(Nt)||i&&!r;else if(i&&!r)n=!0;else throw new Error("cannot determine the script source URL.");if(n)return[void 0,Zl];{let s="ort-wasm-simd-threaded.jsep.mjs",a=e??jf(s,t),o=r&&a&&!Xs(a,t),u=o?await Yl(a):a??Kf(s,t);return[o?u:void 0,await Yf(u)]}}}),Ql,Zs,ga,Jl,Xf,Zf,Qf,Vc,Ze,Tn=ae(()=>{"use strict";qc(),Zs=!1,ga=!1,Jl=!1,Xf=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Zf=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Qf=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Vc=async e=>{if(Zs)return Promise.resolve();if(ga)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Jl)throw new Error("previous call to 'initializeWebAssembly()' failed.");ga=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Qf())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Zf())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=Xf();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,s=typeof n=="string"?n:void 0,a=n==null?void 0:n.mjs,o=(a==null?void 0:a.href)??a,u=n==null?void 0:n.wasm,c=(u==null?void 0:u.href)??u,m=e.wasmBinary,[f,g]=await ib(o,s,r>1,!!m||!!c),_=!1,v=[];if(t>0&&v.push(new Promise(S=>{setTimeout(()=>{_=!0,S()},t)})),v.push(new Promise((S,k)=>{let E={numThreads:r};if(m)E.wasmBinary=m,E.locateFile=I=>I;else if(c||s)E.locateFile=I=>c??s+I;else if(o&&o.indexOf("blob:")!==0)E.locateFile=I=>new URL(I,o).href;else if(f){let I=rb();I&&(E.locateFile=O=>I+O)}g(E).then(I=>{ga=!1,Zs=!0,Ql=I,S(),f&&URL.revokeObjectURL(f)},I=>{ga=!1,Jl=!0,k(I)})})),await Promise.race(v),_)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},Ze=()=>{if(Zs&&Ql)return Ql;throw new Error("WebAssembly is not initialized yet.")}}),rr,To,Ve,Fc=ae(()=>{"use strict";Tn(),rr=(e,t)=>{let r=Ze(),i=r.lengthBytesUTF8(e)+1,n=r._malloc(i);return r.stringToUTF8(e,n,i),t.push(n),n},To=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,s])=>{let a=t?t+n:n;if(typeof s=="object")To(s,a+".",r,i);else if(typeof s=="string"||typeof s=="number")i(a,s.toString());else if(typeof s=="boolean")i(a,s?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof s}`)})},Ve=e=>{let t=Ze(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetLastError(n,n+i);let s=Number(t.getValue(n,i===4?"i32":"i64")),a=t.getValue(n+i,"*"),o=a?t.UTF8ToString(a):"";throw new Error(`${e} ERROR_CODE: ${s}, ERROR_MESSAGE: ${o}`)}finally{t.stackRestore(r)}}}),ab,O$=ae(()=>{"use strict";Tn(),Fc(),ab=e=>{let t=Ze(),r=0,i=[],n=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)n.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)n.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(n.terminate=!1);let s=0;return(e==null?void 0:e.tag)!==void 0&&(s=rr(e.tag,i)),r=t._OrtCreateRunOptions(n.logSeverityLevel,n.logVerbosityLevel,!!n.terminate,s),r===0&&Ve("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&To(e.extra,"",new WeakSet,(a,o)=>{let u=rr(a,i),c=rr(o,i);t._OrtAddRunConfigEntry(r,u,c)!==0&&Ve(`Can't set a run config entry: ${a} - ${o}.`)}),[r,i]}catch(s){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(a=>t._free(a)),s}}}),Jf,eh,th,nn,rh,sb,z$=ae(()=>{"use strict";Tn(),Fc(),Jf=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},eh=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},th=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},nn=(e,t,r,i)=>{let n=rr(t,i),s=rr(r,i);Ze()._OrtAddSessionConfigEntry(e,n,s)!==0&&Ve(`Can't set a session config entry: ${t} - ${r}.`)},rh=async(e,t,r)=>{let i=t.executionProviders;for(let n of i){let s=typeof n=="string"?n:n.name,a=[];switch(s){case"webnn":if(s="WEBNN",nn(e,"session.disable_quant_qdq","1",r),nn(e,"session.disable_qdq_constant_folding","1",r),typeof n!="string"){let f=n==null?void 0:n.deviceType;f&&nn(e,"deviceType",f,r)}break;case"webgpu":if(s="JS",typeof n!="string"){let f=n;if(f!=null&&f.preferredLayout){if(f.preferredLayout!=="NCHW"&&f.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${f.preferredLayout}`);nn(e,"preferredLayout",f.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${s}`)}let o=rr(s,r),u=a.length,c=0,m=0;if(u>0){c=Ze()._malloc(u*Ze().PTR_SIZE),r.push(c),m=Ze()._malloc(u*Ze().PTR_SIZE),r.push(m);for(let f=0;f<u;f++)Ze().setValue(c+f*Ze().PTR_SIZE,a[f][0],"*"),Ze().setValue(m+f*Ze().PTR_SIZE,a[f][1],"*")}await Ze()._OrtAppendExecutionProvider(e,o,c,m,u)!==0&&Ve(`Can't append execution provider: ${s}.`)}},sb=async e=>{let t=Ze(),r=0,i=[],n=e||{};th(n);try{let s=Jf(n.graphOptimizationLevel??"all"),a=eh(n.executionMode??"sequential"),o=typeof n.logId=="string"?rr(n.logId,i):0,u=n.logSeverityLevel??2;if(!Number.isInteger(u)||u<0||u>4)throw new Error(`log severity level is not valid: ${u}`);let c=n.logVerbosityLevel??0;if(!Number.isInteger(c)||c<0||c>4)throw new Error(`log verbosity level is not valid: ${c}`);let m=typeof n.optimizedModelFilePath=="string"?rr(n.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(s,!!n.enableCpuMemArena,!!n.enableMemPattern,a,!!n.enableProfiling,0,o,u,c,m),r===0&&Ve("Can't create session options."),n.executionProviders&&await rh(r,n,i),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);nn(r,"enableGraphCapture",n.enableGraphCapture.toString(),i)}if(n.freeDimensionOverrides)for(let[f,g]of Object.entries(n.freeDimensionOverrides)){if(typeof f!="string")throw new Error(`free dimension override name must be a string: ${f}`);if(typeof g!="number"||!Number.isInteger(g)||g<0)throw new Error(`free dimension override value must be a non-negative integer: ${g}`);let _=rr(f,i);t._OrtAddFreeDimensionOverride(r,_,g)!==0&&Ve(`Can't set a free dimension override: ${f} - ${g}.`)}return n.extra!==void 0&&To(n.extra,"",new WeakSet,(f,g)=>{nn(r,f,g,i)}),[r,i]}catch(s){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&Ve("Can't release session options."),i.forEach(a=>t._free(a)),s}}}),pn,vr,fn,Oo,So,Hc,jc,ec,Te=ae(()=>{"use strict";pn=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},vr=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},fn=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((n,s)=>n*s,1);return r>0?Math.ceil(i*r):void 0},Oo=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},So=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Hc=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",jc=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",ec=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Kc,ob=ae(()=>{"use strict";Gc(),Kc=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),s;try{s=new ArrayBuffer(i)}catch(o){if(o instanceof RangeError){let u=Math.ceil(i/65536);s=new WebAssembly.Memory({initial:u,maximum:u}).buffer}else throw o}let a=0;for(;;){let{done:o,value:u}=await n.read();if(o)break;let c=u.byteLength;new Uint8Array(s,a,c).set(u),a+=c}return new Uint8Array(s,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),nh,ih,ah,sh,Yc,oh,Pe,$r=ae(()=>{"use strict";Te(),nh=["V","I","W","E","F"],ih=(e,t)=>{console.log(`[${nh[e]},${new Date().toISOString()}]${t}`)},Yc=(e,t)=>{ah=e,sh=t},oh=(e,t)=>{let r=So(e),i=So(ah);r>=i&&ih(r,typeof t=="function"?t():t)},Pe=(...e)=>{sh&&oh(...e)}}),uh,Kn,Z,Io,ub,lb,db,ke=ae(()=>{"use strict";uh=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Kn=class{static calcShape(e,t,r=!1){let i=e.length,n=t.length;if(i===0)return t;if(n===0)return e;let s=Math.max(e.length,t.length),a=new Array(s);if(r){if(i<2||n<2)return;let o=uh.calcMatMulShape([e[i-2],e[i-1]],[t[n-2],t[n-1]]);if(o===void 0)return;[a[s-2],a[s-1]]=o}for(let o=r?3:1;o<=s;o++){let u=i-o<0?1:e[i-o],c=n-o<0?1:t[n-o];if(u!==c&&u>1&&c>1)return;let m=Math.max(u,c);if(u&&c)a[s-o]=Math.max(u,c);else{if(m>1)return;a[s-o]=0}}return a}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[i-n])return!1;return!0}},Z=class mo{static size(t){return mo.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let n=new Array(i),s=i-1;for(;s>=0;){if(t[s]%r===0){n[s]=t[s]/r;break}if(r%t[s]!==0)throw new Error("cannot convert shape");n[s]=1,r/=t[s],s--}for(s--;s>=0;s--)n[s]=t[s];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return mo.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return mo.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let n=1;for(let s=r;s<i;s++){if(t[s]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[s])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let n=r-3;n>=0;--n)i[n]=i[n+1]*t[n+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((n,s)=>n+r[s]+r[s+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,n)=>i===r[n])}},Io=class zr{static adjustPoolAttributes(t,r,i,n,s,a){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let o=0;o<r.length-2;o++)o>=i.length?i.push(r[o+2]):i[o]=r[o+2];for(let o=0;o<i.length;o++)if(o<n.length){if(n[o]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let o=0;o<i.length;o++)if(o<s.length){if(s[o]<0)throw new Error("dilations should be greater than or equal to 1")}else s.push(1);for(let o=0;o<i.length*2;o++)if(o<a.length){if(a[o]<0)throw new Error("pad should be greater than or equal to 1")}else a.push(0);for(let o=0;o<i.length;o++){if(i[o]<=0)throw new Error("kernel shapes need to be greater than 0");if(a[o]>=i[o]||a[o+i.length]>=i[o])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,n,s,a,o){if(o){if(s.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let u=0;u<t.length-2;u++)zr.adjustPadAndReturnShape(t[u+(a?1:2)],r[u],i[u],n[u],s,u,u+t.length-2,o)}}static computePoolOutputShape(t,r,i,n,s,a,o,u=0){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let c=[r[0],r[1]];return zr.computeShapeHelper(t,r,c,i,n,s,a,o,u),c}static computeConvOutputShape(t,r,i,n,s,a,o){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let u=[t[0],r[0]];return zr.computeShapeHelper(!1,t,u,i,n,s,a,o),u}static computeShapeHelper(t,r,i,n,s,a,o,u,c=0){if(t)for(let m=0;m<r.length-2;m++)i.push(1);else for(let m=0;m<r.length-2;m++)i.push(zr.adjustPadAndReturnShape(r[m+2],n[m],s[m],a[m],o,m,m+r.length-2,u,c))}static computeOutputSize(t,r,i,n,s){let a=Math.floor(t/r)+1;return s===1&&(a=Math.ceil(t/r)+1,(a-1)*r>=i+n&&(a-=1)),a}static adjustPadAndReturnShape(t,r,i,n,s,a,o,u,c=0){let m=i*(n-1)+1;if(u&&u!=="NOTSET")switch(u){case"VALID":return s[a]=0,s[o]=0,zr.computeOutputSize(t-m,r,t,0,c);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let f=(Math.floor((t+r-1)/r)-1)*r+n-t;return s[a]=Math.floor(u==="SAME_LOWER"?(f+1)/2:f/2),s[o]=f-s[a],zr.computeOutputSize(t+s[a]+s[o]-m,r,t,s[a],c)}default:throw new Error("Unsupported AutoPad type")}else return zr.computeOutputSize(t+s[a]+s[o]-m,r,t,s[a],c)}},ub=class{static getShapeOfGemmResult(e,t,r,i,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let s,a,o;t?(s=e[1],a=e[0]):(s=e[0],a=e[1]);let u=-1;if(i?(o=r[0],u=1):(o=r[1],u=0),r[u]!==a)throw new Error("dimension mismatch");if(s<=0||o<=0||a<=0)throw new Error("invalid shape specified");if(n&&!Kn.isValidBroadcast(n,[s,o]))throw new Error("gemm: invalid bias shape for broadcast");return[s,o,a]}},lb=-34028234663852886e22,db=34028234663852886e22}),Xc,cb=ae(()=>{"use strict";Te(),Xc=(e,t)=>new(Oo(t))(e)}),ed,lh,td,dh,rd,ch,nd,id,ad,ph,pb,R$=ae(()=>{"use strict";Te(),$r(),ed=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),lh=(e,t)=>{if(t==="int32")return e;let r=ed.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let n=e.byteLength/i,s=new(Oo(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let a=new Int32Array(n);for(let o=0;o<n;o++){let u=s[o];if(u>2147483647n||u<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");a[o]=Number(u)}return new Uint8Array(a.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&s.some(o=>o>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let a=Int32Array.from(s,Number);return new Uint8Array(a.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},td=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"uint64":{if(i.some(s=>s<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(i.some(s=>s<-128||s>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let n=Int8Array.from(i,Number);return new Uint8Array(n.buffer)}case"uint8":{if(i.some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(s=>s<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let n=Uint32Array.from(i,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},dh=1,rd=()=>dh++,ch=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),nd=(e,t)=>{let r=ed.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,n)=>i*n)*r/8):0},id=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:n,shape:s,fallbackDataType:a}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=n,this.tensorShape=s,this.fallbackDataType=a}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return nd(this.dataType,this.tensorShape)}destroy(){Pe("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=td(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,n)=>i===r[n])}setIsDataConverted(e){this.isDataConverted=e}},ad=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let n=this.tensorManager.getMLContext(e),s=this.tensorManager.getMLOpSupportLimits(e),a;if(!(s!=null&&s.input.dataTypes.includes(t))){if(a=ch.get(t),!a||!(s!=null&&s.input.dataTypes.includes(a)))throw new Error(`WebNN backend does not support data type: ${t}`);Pe("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${a}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==nd(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let o=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,o,!0,!0,a),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=lh(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else Pe("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,r;if(this.activeUpload){let i=(t=this.wrapper)!=null&&t.isDataConverted?td(this.activeUpload,(r=this.wrapper)==null?void 0:r.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(i):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(i);return}else return i.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},ph=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=rd();return this.tensorTrackersById.set(e,new ad(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,n){Pe("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${n}}`);let s=this.tensorTrackersById.get(t);if(!s)throw new Error("Tensor not found.");return s.ensureTensor(e,r,i,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){Pe("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let n=this.getMLContext(e),s=rd(),a=new id({sessionId:e,context:n,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(s,new ad(this,a)),this.externalTensors.add(a),s}async getCachedTensor(e,t,r,i,n,s,a){let o=this.getMLContext(e);for(let[c,m]of this.freeTensors.entries())if(m.canReuseTensor(o,t,r)){Pe("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${a?`fallbackDataType: ${a},`:""} shape: ${r}`);let f=this.freeTensors.splice(c,1)[0];return f.sessionId=e,f}Pe("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${a?`fallbackDataType: ${a},`:""} shape: ${r}}`);let u=await o.createTensor({dataType:a??t,shape:r,dimensions:r,usage:i,writable:n,readable:s});return new id({sessionId:e,context:o,tensor:u,dataType:t,shape:r,fallbackDataType:a})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},pb=(...e)=>new ph(...e)}),ya,fh,fb,M$=ae(()=>{"use strict";Te(),Tn(),cb(),R$(),$r(),ya=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),fh=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((n,s)=>n===i[s]&&e[n]===t[n])},fb=class{constructor(e){this.tensorManager=pb(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Yc(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){Pe("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){Pe("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)Pe("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>fh(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(n=>n.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){Pe("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,n){let s=ya.get(r);if(!s)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,s,i,n)}async createTemporaryTensor(e,t,r){Pe("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=ya.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,i,r,!1);let s=this.temporarySessionTensorIds.get(e);return s?s.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!Ze().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");Pe("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return Xc(r,t)}}registerMLTensor(e,t,r,i){let n=ya.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let s=this.tensorManager.registerTensor(e,t,n,i);return Pe("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${i}} -> {tensorId: ${s}}`),s}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=ya.get(pn(t)),n=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!(n!=null&&n.input.dataTypes.includes(i)):!!(n!=null&&n.output.dataTypes.includes(i))}flush(){}}}),Zc=ae(()=>{"use strict"}),sd,Qs,Js,hh,mh,od,tc,gh,hb,B$=ae(()=>{"use strict";$r(),Zc(),sd=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Qs=[],Js=e=>Math.ceil(Number(e)/16)*16,hh=e=>{for(let t=0;t<Qs.length;t++){let r=Qs[t];if(e<=r)return r}return Math.ceil(e/16)*16},mh=1,od=()=>mh++,tc=async(e,t,r,i)=>{let n=Js(r),s=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let a=e.getCommandEncoder();e.endComputePass(),a.copyBufferToBuffer(t,0,s,0,n),e.flush(),await s.mapAsync(GPUMapMode.READ);let o=s.getMappedRange();if(i){let u=i();return u.set(new Uint8Array(o,0,r)),u}else return new Uint8Array(o.slice(0,r))}finally{s.destroy()}},gh=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of sd)Qs.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,n=t.byteLength,s=Js(n),a=this.storageCache.get(e);if(!a)throw new Error("gpu data for uploading does not exist");if(Number(a.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${a.originalSize}, data size=${n}`);if(s===n&&i%4===0)this.backend.device.queue.writeBuffer(a.gpuData.buffer,0,r,i,n);else{let o=new Uint8Array(s);o.set(t),this.backend.device.queue.writeBuffer(a.gpuData.buffer,0,o,0,s)}Pe("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=Js(r.originalSize),s=this.backend.getCommandEncoder();this.backend.endComputePass(),s.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return Pe("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=od();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),Pe("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),Pe("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=hh(e),i,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,s=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||s){let o=(n?this.freeBuffers:this.freeUniformBuffers).get(r);o?o.length>0?i=o.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let a={id:od(),type:0,buffer:i};return this.storageCache.set(a.id,{gpuData:a,originalSize:Number(e)}),Pe("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${a.id}`),a}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return Pe("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await tc(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=sd.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(Pe("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},hb=(...e)=>new gh(...e)}),yh,We,tt=ae(()=>{"use strict";yh=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},We=e=>new yh(e)}),Yn,eo,ht,ft,be,et,rc,Vn,Mr,ye,ba,re,ge,mb,Qc,bh,gb,Oe=ae(()=>{"use strict";Te(),ke(),Yn=64,eo=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},ht=(e,t=1)=>{let r=eo(e,t);return typeof r=="string"?r:r[0]},ft=(e,t=1)=>{let r=eo(e,t);return typeof r=="string"?r:r[1]},be=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:Z.computeStrides(r)})}),t},et=e=>e%4===0?4:e%2===0?2:1,rc=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Vn=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,Mr=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,ye=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,ba=(e,t,r,i,n)=>{let s=typeof r=="number",a=s?r:r.length,o=[...new Array(a).keys()],u=a<2?"u32":a<=4?`vec${a}<u32>`:`array<u32, ${a}>`,c=eo(t,n),m=typeof c=="string"?c:c[1],f=typeof c=="string"?c:c[0],g={indices:u,value:m,storage:f,tensor:t},_=q=>typeof q=="string"?q:`${q}u`,v={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},S=s?"uniforms.":"",k=`${S}${e}_shape`,E=`${S}${e}_strides`,I="";for(let q=0;q<a-1;q++)I+=`
    let dim${q} = current / ${ye(E,q,a)};
    let rest${q} = current % ${ye(E,q,a)};
    indices[${q}] = dim${q};
    current = rest${q};
    `;I+=`indices[${a-1}] = current;`;let O=a<2?"":`
  fn o2i_${e}(offset: u32) -> ${g.indices} {
    var indices: ${g.indices};
    var current = offset;
    ${I}
    return indices;
  }`,z=q=>(v.offsetToIndices=!0,a<2?q:`o2i_${e}(${q})`),R=[];if(a>=2)for(let q=a-1;q>=0;q--)R.push(`${ye(E,q,a)} * (indices[${q}])`);let N=a<2?"":`
  fn i2o_${e}(indices: ${g.indices}) -> u32 {
    return ${R.join("+")};
  }`,T=q=>(v.indicesToOffset=!0,a<2?q:`i2o_${e}(${q})`),$=(...q)=>a===0?"0u":`${g.indices}(${q.map(_).join(",")})`,P=(q,K)=>a<2?`${q}`:`${ye(q,K,a)}`,F=(q,K,X)=>a<2?`${q}=${X};`:`${ye(q,K,a)}=${X};`,J={},H=(q,K)=>{v.broadcastedIndicesToOffset=!0;let X=`${K.name}broadcastedIndicesTo${e}Offset`;if(X in J)return`${X}(${q})`;let Y=[];for(let pe=a-1;pe>=0;pe--){let Ce=K.indicesGet("outputIndices",pe+K.rank-a);Y.push(`${P(E,pe)} * (${Ce} % ${P(k,pe)})`)}return J[X]=`fn ${X}(outputIndices: ${K.type.indices}) -> u32 {
             return ${Y.length>0?Y.join("+"):"0u"};
           }`,`${X}(${q})`},L=(q,K)=>(()=>{if(g.storage===g.value)return`${e}[${q}]=${K};`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`${e}[${q}]=vec2<u32>(u32(${K}), select(0u, 0xFFFFFFFFu, ${K} < 0));`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`${e}[${q}]=vec2<u32>(u32(${K}), 0u);`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`${e}[${q}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${K}));`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),M=q=>(()=>{if(g.storage===g.value)return`${e}[${q}]`;if(g.storage==="vec2<u32>"&&g.value==="i32")return`i32(${e}[${q}].x)`;if(g.storage==="vec2<u32>"&&g.value==="u32")return`u32(${e}[${q}].x)`;if(g.storage==="u32"&&g.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${q}] & 0xFFu), bool(${e}[${q}] & 0xFF00u), bool(${e}[${q}] & 0xFF0000u), bool(${e}[${q}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${g.storage} and value type ${g.value} yet`)})(),ne=a<2?"":`
  fn get_${e}ByIndices(indices: ${g.indices}) -> ${m} {
    return ${M(`i2o_${e}(indices)`)};
  }`,te=a<2?"":(()=>{let q=o.map(X=>`d${X}: u32`).join(", "),K=o.map(X=>`d${X}`).join(", ");return`
  fn get_${e}(${q}) -> ${m} {
    return get_${e}ByIndices(${$(K)});
  }`})(),ie=(...q)=>{if(q.length!==a)throw new Error(`indices length must be ${a}`);let K=q.map(_).join(",");return a===0?M("0u"):a===1?M(K[0]):(v.get=!0,v.getByIndices=!0,v.indicesToOffset=!0,`get_${e}(${K})`)},me=q=>a<2?M(q):(v.getByIndices=!0,v.indicesToOffset=!0,`get_${e}ByIndices(${q})`),U=a<2?"":`
  fn set_${e}ByIndices(indices: ${g.indices}, value: ${m}) {
    ${L(`i2o_${e}(indices)`,"value")}
  }`,j=a<2?"":(()=>{let q=o.map(X=>`d${X}: u32`).join(", "),K=o.map(X=>`d${X}`).join(", ");return`
  fn set_${e}(${q}, value: ${m}) {
    set_${e}ByIndices(${$(K)}, value);
  }`})();return{impl:()=>{let q=[],K=!1;return v.offsetToIndices&&(q.push(O),K=!0),v.indicesToOffset&&(q.push(N),K=!0),v.broadcastedIndicesToOffset&&(Object.values(J).forEach(X=>q.push(X)),K=!0),v.set&&(q.push(j),K=!0),v.setByIndices&&(q.push(U),K=!0),v.get&&(q.push(te),K=!0),v.getByIndices&&(q.push(ne),K=!0),!s&&K&&q.unshift(`const ${k} = ${g.indices}(${r.join(",")});`,`const ${E} = ${g.indices}(${Z.computeStrides(r).join(",")});`),q.join(`
`)},type:g,offsetToIndices:z,indicesToOffset:T,broadcastedIndicesToOffset:H,indices:$,indicesGet:P,indicesSet:F,set:(...q)=>{if(q.length!==a+1)throw new Error(`indices length must be ${a}`);let K=q[a];if(typeof K!="string")throw new Error("value must be string");let X=q.slice(0,a).map(_).join(",");return a===0?L("0u",K):a===1?L(X[0],K):(v.set=!0,v.setByIndices=!0,v.indicesToOffset=!0,`set_${e}(${X}, ${K})`)},setByOffset:L,setByIndices:(q,K)=>a<2?L(q,K):(v.setByIndices=!0,v.indicesToOffset=!0,`set_${e}ByIndices(${q}, ${K});`),get:ie,getByOffset:M,getByIndices:me,usage:i,name:e,strides:E,shape:k,rank:a}},re=(e,t,r,i=1)=>ba(e,t,r,"input",i),ge=(e,t,r,i=1)=>ba(e,t,r,"output",i),mb=(e,t,r)=>ba(e,t,r,"atomicOutput",1),Qc=(e,t,r,i=1)=>ba(e,t,r,"internal",i),bh=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Yn){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,s=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,a=n?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${s}) {
    ${a}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let n=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${n}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},gb=(e,t)=>new bh(e,t)}),wh,ud,_h,vh,$h,xh,Wt,yb,bb,Br=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),wh=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},ud=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),_h=(e,t)=>Z.sortBasedOnPerm(e,ud(e.length,t)),vh=(e,t,r,i)=>{let n=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let s=0;s<t;++s)n+=`a[${e[s]}]=i[${s}];`;return n+="return a;}"},$h=(e,t)=>{let r=[],i=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&i.push(t[n]);return{newShape:r,newPerm:i}},xh=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},Wt=(e,t)=>{let r=e.dataType,i=e.dims.length,n=ud(i,t),s=_h(e.dims,n),a=e.dims,o=s,u=i<2||xh(n,e.dims),c;if(u)return c=v=>{let S=re("input",r,a,4),k=ge("output",r,o,4);return`
  ${v.registerUniform("output_size","u32").declareVariables(S,k)}
  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let v=Z.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(v/64/4)},programUniforms:[{type:12,data:Math.ceil(v/4)}]}},getShaderSource:c};let{newShape:m,newPerm:f}=$h(e.dims,n),g=Z.areEqual(f,[2,3,1]),_=Z.areEqual(f,[3,1,2]);if(m.length===2||g||_){a=g?[m[0],m[1]*m[2]]:_?[m[0]*m[1],m[2]]:m,o=[a[1],a[0]];let v=16;return c=S=>{let k=re("a",r,a.length),E=ge("output",r,o.length);return`
  ${S.registerUniform("output_size","u32").declareVariables(k,E)}
  var<workgroup> tile : array<array<${E.type.value}, ${v+1}>, ${v}>;
  ${S.mainStart([v,v,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${v} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${v}u + local_id.x;
    let input_row = workgroup_id_x * ${v}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${k.getByIndices(`${k.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${v}u + local_id.x;
    let output_row = workgroup_id_y * ${v}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${E.setByIndices(`${E.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let S=Z.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(o[1]/v),y:Math.ceil(o[0]/v)},programUniforms:[{type:12,data:S},...be(a,o)]}},getShaderSource:c}}return c=v=>{let S=re("a",r,a.length),k=ge("output",r,o.length);return`
  ${v.registerUniform("output_size","u32").declareVariables(S,k)}

  ${vh(n,i,S,k)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${k.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${k.setByOffset("global_idx",S.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let v=Z.size(s);return{outputs:[{dims:s,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:[{type:12,data:v},...be(a,o)]}},getShaderSource:c}},yb=(e,t)=>{wh(e.inputs,t.perm),e.compute(Wt(e.inputs[0],t.perm))},bb=e=>We({perm:e.perm})}),Th,Sh,Ih,Eh,kh,Ch,Ah,Oh,zh,Rh,Zt,wb,_b,vb,$b,xb,Tb,Sb,Ib,Eb,kb,D$=ae(()=>{"use strict";Te(),ke(),Oe(),Jc(),Br(),Th={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Sh={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Ih={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Eh={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},kh=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},Ch=(e,t)=>{let r=[],i=e.length;for(let s=0;s<i;s++)t.indexOf(s)===-1&&r.push(e[s]);let n=t.map(s=>e[s]);return[r,n]},Ah=(e,t)=>{let r=e.length+t.length,i=[],n=0;for(let s=0;s<r;s++)t.indexOf(s)===-1?i.push(e[n++]):i.push(1);return i},Oh=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},zh=(e,t)=>{let r=[];if(!Oh(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},Rh=(e,t,r,i,n,s,a)=>{let o=r[0].dims,u=Z.size(s),c=Z.size(a),m=re("_A",r[0].dataType,o),f=ge("output",n,s),g=64;u===1&&(g=256);let _=`
          var<workgroup> aBestValues : array<f32, ${g}>;
       `,v=S=>`
        ${S.registerUniform("reduceSize","u32").declareVariables(m,f)}
        ${_}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${S.mainStart(g)}

          let outputIndex = global_idx / ${g};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Ih[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${g}) {
           let candidate = f32(${m.getByOffset("offset + k")});
           bestValue = ${Th[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${g}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Sh[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${f.setByOffset("outputIndex",`${i==="mean"?`${f.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${f.type.storage}(${Eh[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${g}`,inputDependencies:["type"]},getShaderSource:v,getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:u},programUniforms:[{type:12,data:c}]})}},Zt=(e,t,r,i)=>{let n=e.inputs.length===1?r:nc(e.inputs,r),s=n.axes;s.length===0&&!n.noopWithEmptyAxes&&(s=e.inputs[0].dims.map((_,v)=>v));let a=Z.normalizeAxes(s,e.inputs[0].dims.length),o=a,u=e.inputs[0],c=zh(o,e.inputs[0].dims.length);c.length>0&&(u=e.compute(Wt(e.inputs[0],c),{inputs:[0],outputs:[-1]})[0],o=kh(o.length,u.dims.length));let[m,f]=Ch(u.dims,o),g=m;n.keepDims&&(g=Ah(m,a)),e.compute(Rh(t,n.cacheKey,[u],i,e.inputs[0].dataType,g,f),{inputs:[u]})},wb=(e,t)=>{Zt(e,"ReduceMeanShared",t,"mean")},_b=(e,t)=>{Zt(e,"ReduceL1Shared",t,"l1")},vb=(e,t)=>{Zt(e,"ReduceL2Shared",t,"l2")},$b=(e,t)=>{Zt(e,"ReduceLogSumExpShared",t,"logSumExp")},xb=(e,t)=>{Zt(e,"ReduceMaxShared",t,"max")},Tb=(e,t)=>{Zt(e,"ReduceMinShared",t,"min")},Sb=(e,t)=>{Zt(e,"ReduceProdShared",t,"prod")},Ib=(e,t)=>{Zt(e,"ReduceSumShared",t,"sum")},Eb=(e,t)=>{Zt(e,"ReduceSumSquareShared",t,"sumSquare")},kb=(e,t)=>{Zt(e,"ReduceLogSumShared",t,"logSum")}}),Qt,Mh,Eo,nc,Jt,Bh,Dh,Nh,Uh,Ph,Lh,Wh,Gh,qh,Vh,er,Cb,Ab,Ob,zb,Rb,Mb,Bb,Db,Nb,Ub,Jc=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),D$(),Qt=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Mh=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Eo=(e,t,r,i,n,s,a=!1,o=!1)=>{let u=[],c=r[0].dims,m=c.length,f=Z.normalizeAxes(n,m),g=!o&&f.length===0;c.forEach((S,k)=>{g||f.indexOf(k)>=0?a&&u.push(1):u.push(S)});let _=u.length,v=Z.size(u);return{name:e,shaderCache:t,getShaderSource:S=>{let k=[],E=re("_A",r[0].dataType,m),I=ge("output",s,_),O=i(E,I,f),z=O[2];for(let R=0,N=0;R<m;R++)g||f.indexOf(R)>=0?(a&&N++,z=`for(var j${R}: u32 = 0; j${R} < ${c[R]}; j${R}++) {
                  ${O[2].includes("last_index")?`let last_index = j${R};`:""}
                  ${E.indicesSet("input_indices",R,`j${R}`)}
                  ${z}
                }`):(k.push(`${E.indicesSet("input_indices",R,I.indicesGet("output_indices",N))};`),N++);return`

        ${S.registerUniform("output_size","u32").declareVariables(E,I)}

        ${S.mainStart()}
          ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${E.type.indices};
          let output_indices = ${I.offsetToIndices("global_idx")};

          ${k.join(`
`)}
          ${O[0]}       // init ops for reduce max/min
          ${O[1]}
          ${z}
          ${O[3]}
          ${O.length===4?I.setByOffset("global_idx","value"):O.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:u,dataType:s}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:[{type:12,data:v},...be(c,u)]})}},nc=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),We({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Jt=(e,t,r,i)=>{let n=e.inputs,s=n.length===1?r:nc(n,r);e.compute(Eo(t,{hint:s.cacheKey,inputDependencies:["rank"]},[n[0]],s.noopWithEmptyAxes&&s.axes.length===0?Mh:i,s.axes,n[0].dataType,s.keepDims,s.noopWithEmptyAxes),{inputs:[0]})},Bh=(e,t)=>{Qt(e.inputs),Jt(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Dh=(e,t)=>{Qt(e.inputs),Jt(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Nh=(e,t)=>{Qt(e.inputs),Jt(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Uh=(e,t)=>{Qt(e.inputs),Jt(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},Ph=(e,t)=>{Qt(e.inputs),Jt(e,"ReduceMax",t,(r,i,n)=>{let s=[];for(let a=0;a<r.rank;a++)(n.indexOf(a)>=0||n.length===0)&&s.push(r.indicesSet("input_indices",a,0));return[`${s.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},Lh=(e,t)=>{Qt(e.inputs),Jt(e,"ReduceMean",t,(r,i,n)=>{let s=1;for(let a=0;a<r.rank;a++)(n.indexOf(a)>=0||n.length===0)&&(s*=e.inputs[0].dims[a]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${s});`]})},Wh=(e,t)=>{Qt(e.inputs),Jt(e,"ReduceMin",t,(r,i,n)=>{let s=[];for(let a=0;a<r.rank;a++)(n.indexOf(a)>=0||n.length===0)&&s.push(`input_indices[${a}] = 0;`);return[`${s.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},Gh=(e,t)=>{Qt(e.inputs),Jt(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},qh=(e,t)=>{Qt(e.inputs),Jt(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},Vh=(e,t)=>{Qt(e.inputs),Jt(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},er=(e,t,r)=>{if(t.length===0)return r;let i=1,n=1;for(let s=0;s<t.length;s++)t.indexOf(s)===-1?i*=e[s]:n*=e[s];return n<32&&i>1024},Cb=(e,t)=>{er(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Lh(e,t):wb(e,t)},Ab=(e,t)=>{er(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Dh(e,t):_b(e,t)},Ob=(e,t)=>{er(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Nh(e,t):vb(e,t)},zb=(e,t)=>{er(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Uh(e,t):$b(e,t)},Rb=(e,t)=>{er(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ph(e,t):xb(e,t)},Mb=(e,t)=>{er(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Wh(e,t):Tb(e,t)},Bb=(e,t)=>{er(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Gh(e,t):Sb(e,t)},Db=(e,t)=>{er(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?qh(e,t):Ib(e,t)},Nb=(e,t)=>{er(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Vh(e,t):Eb(e,t)},Ub=(e,t)=>{er(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Bh(e,t):kb(e,t)}}),ld,Pb,Lb,ic,N$=ae(()=>{"use strict";Te(),tt(),Jc(),ld=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Pb=(e,t)=>{ld(e.inputs);let r=(i,n,s)=>{let a=[];for(let o=0;o<i.rank;o++)(s.indexOf(o)>=0||s.length===0)&&a.push(`input_indices[${o}] = 0;`);return[`${a.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(Eo("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Lb=(e,t)=>{ld(e.inputs);let r=(i,n,s)=>{let a=[];for(let o=0;o<i.rank;o++)(s.indexOf(o)>=0||s.length===0)&&a.push(`input_indices[${o}] = 0;`);return[`${a.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(Eo("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},ic=e=>We(e)}),Fh,to,Hh,jh,Kh,Ma,Yh,Wb,ep=ae(()=>{"use strict";Te(),ke(),Zc(),Oe(),Fh=(e,t)=>{let r=e[0],i=e[1],n=e[2],s=e[3],a=e[4],o=e[5];if(a&&o)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let u=r.dims[0],c=r.dims[1],m=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==m)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let f=n.dims[0]/3,g=f,_=g;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let O of t.qkvHiddenSizes)if(O%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");f=t.qkvHiddenSizes[0],g=t.qkvHiddenSizes[1],_=t.qkvHiddenSizes[2]}let v=c;if(f!==g)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==f+g+_)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let S=0;if(a){if(g!==_)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(a.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(a.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(a.dims[1]!==u)throw new Error('Input "past" second dimension must be batch_size');if(a.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(a.dims[4]!==g/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(S=a.dims[3])}let k=v+S,E=-1,I=0;if(s)throw new Error("Mask not supported");if(a)throw new Error("past is not supported");if(o){if(o.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(o.dims[0]!==u||o.dims[1]!==t.numHeads||o.dims[2]!==c||o.dims[3]!==k)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:u,sequenceLength:c,pastSequenceLength:S,kvSequenceLength:v,totalSequenceLength:k,maxSequenceLength:E,inputHiddenSize:m,hiddenSize:f,vHiddenSize:_,headSize:Math.floor(f/t.numHeads),vHeadSize:Math.floor(_/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:I,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},to=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e==null?void 0:e.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,Hh=(e,t,r,i,n,s,a,o)=>{let u=et(a?1:s),c=64,m=s/u;m<c&&(c=32);let f=Math.ceil(s/u/c),g=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:m},{type:12,data:f}],_=ht(e.dataType,u),v=ft(1,u),S=["type"];a&&S.push("type"),o&&S.push("type");let k=E=>{let I=ge("x",e.dataType,e.dims,u),O=[I],z=a?re("seq_lens",a.dataType,a.dims):void 0;z&&O.push(z);let R=o?re("total_sequence_length_input",o.dataType,o.dims):void 0;R&&O.push(R);let N=ft(e.dataType),T=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${c}>;
  var<workgroup> thread_sum: array<f32, ${c}>;
  ${E.registerUniforms(T).declareVariables(...O)}
  ${E.mainStart([c,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${to(z,R,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${c}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${a?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${v}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${v}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(u){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${u}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${c}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${v}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${v}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(u){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${u}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${c}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${I.type.value}(${N}(1.0) / ${N}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${v}(x[offset + i]);
        x[offset + i] = ${I.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${a?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${I.type.value}(${N}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${c};${_};${u}`,inputDependencies:S},getShaderSource:k,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:g})}},jh=(e,t,r,i,n,s,a,o,u)=>{let c=a+s.kvSequenceLength,m=[s.batchSize,s.numHeads,s.sequenceLength,c],f=e>1&&i,g=s.kvNumHeads?s.kvNumHeads:s.numHeads,_=f?[s.batchSize,g,c,s.headSize]:void 0,v=s.nReps?s.nReps:1,S=s.scale===0?1/Math.sqrt(s.headSize):s.scale,k=et(s.headSize),E=s.headSize/k,I=12,O={x:Math.ceil(c/I),y:Math.ceil(s.sequenceLength/I),z:s.batchSize*s.numHeads},z=[{type:12,data:s.sequenceLength},{type:12,data:E},{type:12,data:c},{type:12,data:s.numHeads},{type:12,data:s.headSize},{type:1,data:S},{type:12,data:a},{type:12,data:s.kvSequenceLength},{type:12,data:v}],R=f&&i&&Z.size(i.dims)>0,N=["type","type"];R&&N.push("type"),n&&N.push("type"),o&&N.push("type"),u&&N.push("type");let T=[{dims:m,dataType:t.dataType,gpuDataType:0}];f&&T.push({dims:_,dataType:t.dataType,gpuDataType:0});let $=P=>{let F=re("q",t.dataType,t.dims,k),J=re("key",r.dataType,r.dims,k),H=[F,J];if(R){let U=re("past_key",i.dataType,i.dims,k);H.push(U)}n&&H.push(re("attention_bias",n.dataType,n.dims));let L=o?re("seq_lens",o.dataType,o.dims):void 0;L&&H.push(L);let M=u?re("total_sequence_length_input",u.dataType,u.dims):void 0;M&&H.push(M);let ne=ge("output",t.dataType,m),te=[ne];f&&te.push(ge("present_key",t.dataType,_,k));let ie=ft(1,k),me=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${I}u;

  var<workgroup> tileQ: array<${F.type.storage}, ${I*I}>;
  var<workgroup> tileK: array<${F.type.storage}, ${I*I}>;
  ${P.registerUniforms(me).declareVariables(...H,...te)}
  ${P.mainStart([I,I,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${v===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${v===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${to(L,M,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${R&&f?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${f?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${ie}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${R&&f?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${f?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${ie}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(k){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${k}`)}})()};
        output[outputIdx] = ${ne.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${k};${n!==void 0};${i!==void 0};${e}`,inputDependencies:N},getRunData:()=>({outputs:T,dispatchGroup:O,programUniforms:z}),getShaderSource:$}},Kh=(e,t,r,i,n,s,a=void 0,o=void 0)=>{let u=s+n.kvSequenceLength,c=n.nReps?n.nReps:1,m=n.vHiddenSize*c,f=e>1&&i,g=n.kvNumHeads?n.kvNumHeads:n.numHeads,_=f?[n.batchSize,g,u,n.headSize]:void 0,v=[n.batchSize,n.sequenceLength,m],S=12,k={x:Math.ceil(n.vHeadSize/S),y:Math.ceil(n.sequenceLength/S),z:n.batchSize*n.numHeads},E=[{type:12,data:n.sequenceLength},{type:12,data:u},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:m},{type:12,data:s},{type:12,data:n.kvSequenceLength},{type:12,data:c}],I=f&&i&&Z.size(i.dims)>0,O=["type","type"];I&&O.push("type"),a&&O.push("type"),o&&O.push("type");let z=[{dims:v,dataType:t.dataType,gpuDataType:0}];f&&z.push({dims:_,dataType:t.dataType,gpuDataType:0});let R=N=>{let T=re("probs",t.dataType,t.dims),$=re("v",r.dataType,r.dims),P=[T,$];I&&P.push(re("past_value",i.dataType,i.dims));let F=a?re("seq_lens",a.dataType,a.dims):void 0;a&&P.push(F);let J=o?re("total_sequence_length_input",o.dataType,o.dims):void 0;o&&P.push(J);let H=[ge("output",t.dataType,v)];f&&H.push(ge("present_value",t.dataType,_));let L=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${S}u;
  var<workgroup> tileQ: array<${T.type.value}, ${S*S}>;
  var<workgroup> tileV: array<${T.type.value}, ${S*S}>;
  ${N.registerUniforms(L).declareVariables(...P,...H)}
  ${N.mainStart([S,S,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${c===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${c===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${to(F,J,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${I&&f?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${f?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${T.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${I&&f?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${f?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:O},getRunData:()=>({outputs:z,dispatchGroup:k,programUniforms:E}),getShaderSource:R}},Ma=(e,t,r,i,n,s,a,o,u,c,m=void 0,f=void 0)=>{let g=Math.min(e.outputCount,1+(a?1:0)+(o?1:0)),_=g>1?a:void 0,v=g>1?o:void 0,S=g>1?c.pastSequenceLength:0,k=S+c.kvSequenceLength,E=u&&Z.size(u.dims)>0?u:void 0,I=[t,r];_&&Z.size(_.dims)>0&&I.push(_),E&&I.push(E),m&&I.push(m),f&&I.push(f);let O=e.compute(jh(g,t,r,_,E,c,S,m,f),{inputs:I,outputs:g>1?[-1,1]:[-1]})[0];e.compute(Hh(O,c.batchSize,c.numHeads,S,c.sequenceLength,k,m,f),{inputs:m&&f?[O,m,f]:[O],outputs:[]});let z=[O,i];v&&Z.size(v.dims)>0&&z.push(v),m&&z.push(m),f&&z.push(f),e.compute(Kh(g,O,i,v,c,S,m,f),{inputs:z,outputs:g>1?[0,2]:[0]})},Yh=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,n=t.inputHiddenSize,s=t.headSize,a=12,o={x:Math.ceil(t.headSize/a),y:Math.ceil(t.sequenceLength/a),z:t.batchSize*t.numHeads},u=[e.inputs[0],e.inputs[1],e.inputs[2]],c=[{type:12,data:i},{type:12,data:n},{type:12,data:s},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],m=f=>{let g=ge("output_q",u[0].dataType,r),_=ge("output_k",u[0].dataType,r),v=ge("output_v",u[0].dataType,r),S=re("input",u[0].dataType,u[0].dims),k=re("weight",u[1].dataType,u[1].dims),E=re("bias",u[2].dataType,u[2].dims),I=S.type.storage,O=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${a}u;
  var<workgroup> tileInput: array<${I}, ${a*a}>;
  var<workgroup> tileWeightQ: array<${I}, ${a*a}>;
  var<workgroup> tileWeightK: array<${I}, ${a*a}>;
  var<workgroup> tileWeightV: array<${I}, ${a*a}>;
  ${f.registerUniforms(O).declareVariables(S,k,E,g,_,v)}
  ${f.mainStart([a,a,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${I}(0);
    var valueK = ${I}(0);
    var valueV = ${I}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:o,programUniforms:c}),getShaderSource:m},{inputs:u,outputs:[-1,-1,-1]})},Wb=(e,t)=>{let r=Fh(e.inputs,t),[i,n,s]=Yh(e,r);return Ma(e,i,n,s,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),Xh,Zh,Qh,Gb,U$=ae(()=>{"use strict";Ht(),Te(),ke(),tt(),Oe(),Xh=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,n,s)=>{let a=n.length;if(a!==i.length)throw new Error(`${s}: num dimensions != ${a}`);n.forEach((o,u)=>{if(o!==i[u])throw new Error(`${s}: dim[${u}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},Zh=(e,t)=>{let{epsilon:r,spatial:i,format:n}=t,s=e[0].dims,a=i?et(s[s.length-1]):1,o=n==="NHWC"&&s.length>1?a:1,u=Z.size(s)/a,c=i,m=c?s.length:s,f=re("x",e[0].dataType,e[0].dims,a),g=re("scale",e[1].dataType,e[1].dims,o),_=re("bias",e[2].dataType,e[2].dims,o),v=re("inputMean",e[3].dataType,e[3].dims,o),S=re("inputVar",e[4].dataType,e[4].dims,o),k=ge("y",e[0].dataType,m,a),E=()=>{let O="";if(i)O=`let cOffset = ${s.length===1?"0u":n==="NHWC"?`outputIndices[${s.length-1}] / ${a}`:"outputIndices[1]"};`;else if(n==="NCHW")O=`
            ${k.indicesSet("outputIndices","0","0")}
            let cOffset = ${k.indicesToOffset("outputIndices")};`;else{O=`var cIndices = ${g.type.indices}(0);
                       cIndices[0] = outputIndices[${s.length-1}];`;for(let z=1;z<g.rank;z++)O+=`cIndices[${z}] = outputIndices[${z}];`;O+=`let cOffset = ${g.indicesToOffset("cIndices")};`}return O},I=O=>`
  const epsilon = ${r};
  ${O.registerUniform("outputSize","u32").declareVariables(f,g,_,v,S,k)}
  ${O.mainStart()}
  ${O.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${k.offsetToIndices(`global_idx * ${a}`)};
    ${E()}
    let scale = ${g.getByOffset("cOffset")};
    let bias = ${_.getByOffset("cOffset")};
    let inputMean = ${v.getByOffset("cOffset")};
    let inputVar = ${S.getByOffset("cOffset")};
    let x = ${f.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${k.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${a}`,inputDependencies:c?["rank","type","type","type","type"]:void 0},getShaderSource:I,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:c?[{type:12,data:u},...be(s)]:[{type:12,data:u}]})}},Qh=e=>We(e),Gb=(e,t)=>{let{inputs:r,outputCount:i}=e,n=Qh({...t,outputCount:i});if(Xe.webgpu.validateInputContent&&Xh(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Zh(r,n))}}),Jh,em,qb,P$=ae(()=>{"use strict";ke(),Oe(),Jh=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},em=e=>{let t=e[0].dims,r=e[0].dims[2],i=Z.size(t)/4,n=e[0].dataType,s=re("input",n,t,4),a=re("bias",n,[r],4),o=re("residual",n,t,4),u=ge("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:c=>`
  const channels = ${r}u / 4;
  ${c.declareVariables(s,a,o,u)}

  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${s.getByOffset("global_idx")}
      + ${a.getByOffset("global_idx % channels")} + ${o.getByOffset("global_idx")};
    ${u.setByOffset("global_idx","value")}
  }`}},qb=e=>{Jh(e.inputs),e.compute(em(e.inputs))}}),tm,Le,Vb,Fb,Hb,jb,Kb,Yb,Xb,Zb,Qb,rm,Jb,ew,tw,rw,Ca,nw,go,iw,aw,sw,ow,uw,lw,dw,cw,pw,fw,hw,mw,gw,yw,bw,ww,_w,dd,vw,ac,sc,$w,xw,Tw,nm,im,Sw,tp=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),tm=(e,t,r,i,n,s,a)=>{let o=Math.ceil(t/4),u="";typeof n=="string"?u=`${n}(a)`:u=n("a");let c=re("inputData",r,[o],4),m=ge("outputData",i,[o],4),f=[{name:"vec_size",type:"u32"}];return a&&f.push(...a),`
      ${e.registerUniforms(f).declareVariables(c,m)}

  ${s??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${c.getByOffset("global_idx")};
    ${m.setByOffset("global_idx",u)}
  }`},Le=(e,t,r,i,n,s=e.dataType,a,o)=>{let u=[{type:12,data:Math.ceil(Z.size(e.dims)/4)}];return a&&u.push(...a),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:c=>tm(c,Z.size(e.dims),e.dataType,s,r,i,o),getRunData:c=>({outputs:[{dims:e.dims,dataType:s}],dispatchGroup:{x:Math.ceil(Z.size(c[0].dims)/64/4)},programUniforms:u})}},Vb=e=>{e.compute(Le(e.inputs[0],"Abs","abs"))},Fb=e=>{e.compute(Le(e.inputs[0],"Acos","acos"))},Hb=e=>{e.compute(Le(e.inputs[0],"Acosh","acosh"))},jb=e=>{e.compute(Le(e.inputs[0],"Asin","asin"))},Kb=e=>{e.compute(Le(e.inputs[0],"Asinh","asinh"))},Yb=e=>{e.compute(Le(e.inputs[0],"Atan","atan"))},Xb=e=>{e.compute(Le(e.inputs[0],"Atanh","atanh"))},Zb=e=>We(e),Qb=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(Le(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},rm=e=>{let t,r,i=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return We({min:t,max:r})},Jb=(e,t)=>{let r=t||rm(e.inputs),i=ft(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},ew=e=>{e.compute(Le(e.inputs[0],"Ceil","ceil"))},tw=e=>{e.compute(Le(e.inputs[0],"Cos","cos"))},rw=e=>{e.compute(Le(e.inputs[0],"Cosh","cosh"))},Ca=e=>We(e),nw=(e,t)=>{let r=ft(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},go=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,iw=e=>{let t=ft(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,go(t)))},aw=e=>{e.compute(Le(e.inputs[0],"Exp","exp"))},sw=e=>{e.compute(Le(e.inputs[0],"Floor","floor"))},ow=e=>{let t=ft(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,go(t)))},uw=(e,t)=>{let r=ft(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},lw=e=>{e.compute(Le(e.inputs[0],"Not",t=>`!${t}`))},dw=e=>{e.compute(Le(e.inputs[0],"Neg",t=>`-${t}`))},cw=e=>{e.compute(Le(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},pw=e=>{let t=ft(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},fw=e=>{e.compute(Le(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},hw=e=>We(e),mw=(e,t)=>{let r=ft(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},gw=e=>{let t=ft(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"HardSwish",r=>`${r} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${r} + vec4<${t}>(0.5)))`))},yw=e=>{e.compute(Le(e.inputs[0],"Sin","sin"))},bw=e=>{e.compute(Le(e.inputs[0],"Sinh","sinh"))},ww=e=>{e.compute(Le(e.inputs[0],"Sqrt","sqrt"))},_w=e=>{e.compute(Le(e.inputs[0],"Tan","tan"))},dd=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,vw=e=>{e.compute(Le(e.inputs[0],"Tanh",dd))},ac=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${dd("v")};
}
`,sc=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,$w=e=>{let t=ft(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"FastGelu",sc,ac(t),void 0,e.inputs[0].dataType))},xw=(e,t)=>{let r=ft(e.inputs[0].dataType);return e.compute(Le(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},Tw=e=>{e.compute(Le(e.inputs[0],"Log","log"))},nm=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,im=e=>`quick_gelu_impl(${e})`,Sw=(e,t)=>{let r=ft(e.inputs[0].dataType);e.compute(Le(e.inputs[0],"QuickGelu",im,nm(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),am,sm,Iw,L$=ae(()=>{"use strict";ke(),Oe(),tp(),am=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},sm=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=re("input",e[0].dataType,e[0].dims,4),i=re("bias",e[0].dataType,[e[0].dims[2]],4),n=ge("output",e[0].dataType,t,4),s=Z.size(t)/4,a=ht(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)}}),getShaderSource:o=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${o.declareVariables(r,i,n)}

  ${go(a)}

  ${o.mainStart()}
    ${o.guardAgainstOutOfBoundsWorkgroupSizes(s)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${n.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},Iw=e=>{am(e.inputs),e.compute(sm(e.inputs))}}),om,um,tr,Ew,kw,Cw,Aw,Ow,zw,Rw,Mw,Bw,Dw,W$=ae(()=>{"use strict";Te(),ke(),Oe(),om=(e,t,r,i,n,s,a,o,u,c,m,f)=>{let g,_;typeof o=="string"?g=_=(I,O)=>`${o}((${I}),(${O}))`:typeof o=="function"?g=_=o:(g=o.scalar,_=o.vector);let v=ge("outputData",m,i.length,4),S=re("aData",u,t.length,4),k=re("bData",c,r.length,4),E;if(n)if(s){let I=Z.size(t)===1,O=Z.size(r)===1,z=t.length>0&&t[t.length-1]%4===0,R=r.length>0&&r[r.length-1]%4===0;I||O?E=v.setByOffset("global_idx",_(I?`${S.type.value}(${S.getByOffset("0")}.x)`:S.getByOffset("global_idx"),O?`${k.type.value}(${k.getByOffset("0")}.x)`:k.getByOffset("global_idx"))):E=`
            let outputIndices = ${v.offsetToIndices("global_idx * 4u")};
            let offsetA = ${S.broadcastedIndicesToOffset("outputIndices",v)};
            let offsetB = ${k.broadcastedIndicesToOffset("outputIndices",v)};
            ${v.setByOffset("global_idx",_(a||z?S.getByOffset("offsetA / 4u"):`${S.type.value}(${S.getByOffset("offsetA / 4u")}[offsetA % 4u])`,a||R?k.getByOffset("offsetB / 4u"):`${k.type.value}(${k.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else E=v.setByOffset("global_idx",_(S.getByOffset("global_idx"),k.getByOffset("global_idx")));else{if(!s)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let I=(O,z,R="")=>{let N=`aData[indexA${z}][componentA${z}]`,T=`bData[indexB${z}][componentB${z}]`;return`
            let outputIndices${z} = ${v.offsetToIndices(`global_idx * 4u + ${z}u`)};
            let offsetA${z} = ${S.broadcastedIndicesToOffset(`outputIndices${z}`,v)};
            let offsetB${z} = ${k.broadcastedIndicesToOffset(`outputIndices${z}`,v)};
            let indexA${z} = offsetA${z} / 4u;
            let indexB${z} = offsetB${z} / 4u;
            let componentA${z} = offsetA${z} % 4u;
            let componentB${z} = offsetB${z} % 4u;
            ${O}[${z}] = ${R}(${g(N,T)});
          `};m===9?E=`
            var data = vec4<u32>(0);
            ${I("data",0,"u32")}
            ${I("data",1,"u32")}
            ${I("data",2,"u32")}
            ${I("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:E=`
            ${I("outputData[global_idx]",0)}
            ${I("outputData[global_idx]",1)}
            ${I("outputData[global_idx]",2)}
            ${I("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(S,k,v)}

        ${f??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${E}
      }`},um=(e,t,r,i,n,s,a=r.dataType)=>{let o=r.dims.map(Number),u=i.dims.map(Number),c=!Z.areEqual(o,u),m=o,f=Z.size(o),g=!1,_=!1,v=[c];if(c){let S=Kn.calcShape(o,u,!1);if(!S)throw new Error("Can't perform binary op on the given tensors");m=S.slice(),f=Z.size(m);let k=Z.size(o)===1,E=Z.size(u)===1,I=o.length>0&&o[o.length-1]%4===0,O=u.length>0&&u[u.length-1]%4===0;v.push(k),v.push(E),v.push(I),v.push(O);let z=1;for(let R=1;R<m.length;R++){let N=o[o.length-R],T=u[u.length-R];if(N===T)z*=N;else break}z%4===0?(_=!0,g=!0):(k||E||I||O)&&(g=!0)}else g=!0;return v.push(g),{name:e,shaderCache:{hint:t+v.map(S=>S.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:S=>om(S,o,u,m,g,c,_,n,r.dataType,i.dataType,a,s),getRunData:()=>({outputs:[{dims:m,dataType:a}],dispatchGroup:{x:Math.ceil(f/64/4)},programUniforms:[{type:12,data:Math.ceil(Z.size(m)/4)},...be(o,u,m)]})}},tr=(e,t,r,i,n,s)=>{e.compute(um(t,n??"",e.inputs[0],e.inputs[1],r,i,s))},Ew=e=>{tr(e,"Add",(t,r)=>`${t}+${r}`)},kw=e=>{tr(e,"Div",(t,r)=>`${t}/${r}`)},Cw=e=>{tr(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},Aw=e=>{tr(e,"Mul",(t,r)=>`${t}*${r}`)},Ow=e=>{let t=re("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;tr(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},zw=e=>{tr(e,"Sub",(t,r)=>`${t}-${r}`)},Rw=e=>{tr(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},Mw=e=>{tr(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},Bw=e=>{tr(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},Dw=e=>{tr(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),lm,dm,cm,pm,Nw,Uw,G$=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),lm=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],n=i.dataType,s=i.dims.length;e.forEach((a,o)=>{if(o!==r){if(a.dataType!==n)throw new Error("input tensors should be one type");if(a.dims.length!==s)throw new Error("input tensors should have the same shape");a.dims.forEach((u,c)=>{if(c!==t&&u!==i.dims[c])throw new Error("non concat dimensions must match")})}})},dm=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,cm=(e,t)=>{let r=e.length,i=[];for(let n=0;n<r;++n){let s=t.setByOffset("global_idx",e[n].getByIndices("indices"));r===1?i.push(s):n===0?i.push(`if (inputIndex == ${n}u) { ${s} }`):n===r-1?i.push(`else { ${s} }`):i.push(`else if (inputIndex == ${n}) { ${s} }`)}return i.join(`
`)},pm=(e,t,r,i)=>{let n=Z.size(r),s=new Array(e.length),a=new Array(e.length),o=0,u=[],c=[],m=[{type:12,data:n}];for(let S=0;S<e.length;++S)o+=e[S].dims[t],s[S]=o,c.push(e[S].dims.length),a[S]=re(`input${S}`,i,c[S]),u.push("rank"),m.push({type:12,data:s[S]});for(let S=0;S<e.length;++S)m.push(...be(e[S].dims));m.push(...be(r));let f=ge("output",i,r.length),g=f.indicesGet("indices",t),_=Array.from(Array(s.length).keys()).map(S=>`uniforms.sizeInConcatAxis${S}`).join(","),v=S=>`

  ${(()=>{S.registerUniform("outputSize","u32");for(let k=0;k<e.length;k++)S.registerUniform(`sizeInConcatAxis${k}`,"u32");return S.declareVariables(...a,f)})()}

  ${dm(s.length,_)}

  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${f.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${g});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${s.length}u>(${_});
      ${g} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${cm(a,f)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:m}),getShaderSource:v}},Nw=(e,t)=>{let r=e.inputs,i=r[0].dims,n=Z.normalizeAxis(t.axis,i.length);lm(r,n);let s=i.slice();s[n]=r.reduce((o,u)=>o+(u.dims.length>n?u.dims[n]:0),0);let a=r.filter(o=>Z.size(o.dims)>0);e.compute(pm(a,n,s,r[0].dataType),{inputs:a})},Uw=e=>We({axis:e.axis})}),wn,_n,vn,rp,Sn=ae(()=>{"use strict";Te(),ke(),wn=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},_n=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},vn=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},rp=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[r,i]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=(e==null?void 0:e.activation_params)||[lb,db];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:r}}return{activation:t}}}),bt,Pw,np=ae(()=>{"use strict";bt=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Pw=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Lw,q$=ae(()=>{"use strict";Lw=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Oa,ip,ap=ae(()=>{"use strict";Te(),ke(),Oe(),Sn(),Oa=(e,t,r,i,n)=>{let s=i-r;return`
      ${Array.from({length:r}).map((a,o)=>`
      if (${ye(t.shape,o,t.rank)} != 1) {
        ${t.indicesSet(e,o,ye(n,o+s,i))}
      } else {
        ${t.indicesSet(e,o,0)}
      }`).join("")}
`},ip=(e,t,r,i,n=!1,s)=>{let a=e[0].dims,o=e[1].dims,u=a[a.length-2],c=o[o.length-1],m=a[a.length-1],f=et(c),g=et(m),_=et(u),v=Z.size(r)/f/_,S=e.length>2,k=i?i.slice(0,-2):r.slice(0,-2),E=[Z.size(k),u,c],I=[{type:12,data:v},{type:12,data:u},{type:12,data:c},{type:12,data:m}];_n(t,I),I.push(...be(k,a,o)),S&&I.push(...be(e[2].dims)),I.push(...be(E));let O=z=>{let R=Qc("batch_dims",e[0].dataType,k.length),N=re("a",e[0].dataType,a.length,g),T=re("b",e[1].dataType,o.length,f),$=ge("output",e[0].dataType,E.length,f),P=ht($.type.tensor),F=wn(t,$.type.value,P),J=[N,T],H="";if(S){let ne=n?f:1;J.push(re("bias",e[2].dataType,e[2].dims.length,ne)),H=`${n?`value += bias[col / ${ne}];`:`value += ${$.type.value}(bias[row + i]);`}`}let L=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];vn(t,L);let M=()=>{let ne=`var a_data: ${N.type.value};`;for(let te=0;te<g;te++)ne+=`
              let b_data${te} = b[(b_offset + (k + ${te}) * uniforms.N + col) / ${f}];`;for(let te=0;te<_;te++){ne+=`a_data = a[(a_offset + (row + ${te}) * uniforms.K + k) / ${g}];`;for(let ie=0;ie<g;ie++)ne+=`
            values[${te}] = fma(${T.type.value}(a_data${g===1?"":`[${ie}]`}), b_data${ie}, values[${te}]);
`}return ne};return`
  ${z.registerUniforms(L).registerInternalVariables(R).declareVariables(...J,$)}
  ${z.mainStart()}
    ${z.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${f})) * ${f};
    var index1 = global_idx / (uniforms.N / ${f});
    let stride1 = uniforms.M / ${_};
    let row = (index1 % stride1) * ${_};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${R.offsetToIndices("batch")};`}

    var a_indices: ${N.type.indices};
    ${Oa("a_indices",N,N.rank-2,R.rank,"batch_indices")}
    ${N.indicesSet("a_indices",N.rank-2,0)}
    ${N.indicesSet("a_indices",N.rank-1,0)}
    let a_offset = ${N.indicesToOffset("a_indices")};

    var b_indices: ${T.type.indices};
    ${Oa("b_indices",T,T.rank-2,R.rank,"batch_indices")}
    ${T.indicesSet("b_indices",T.rank-2,0)}
    ${T.indicesSet("b_indices",T.rank-1,0)}
    let b_offset = ${T.indicesToOffset("b_indices")};
    var values: array<${$.type.value}, ${_}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${g}) {
      ${M()}
    }
    for (var i = 0u; i < ${_}u; i++) {
      var value = values[i];
      ${H}
      ${F}
      let cur_indices = ${$.type.indices}(batch, row + i, col);
      let offset = ${$.indicesToOffset("cur_indices")};
      ${$.setByOffset(`offset / ${f}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${f};${g};${_};${n}`,inputDependencies:S?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:s?s(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:I}),getShaderSource:O}}}),fm,hm,oc,cd,mm,uc,gm,ko,sp=ae(()=>{"use strict";Te(),ke(),Oe(),Sn(),ap(),np(),fm=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,hm=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,oc=(e,t,r="f32",i,n=!1,s=32,a=!1,o=32)=>{let u=t[1]*e[1],c=t[0]*e[0],m=n?u:s,f=n?s:u,g=m/t[0],_=s/t[1];if(!((n&&g===4&&e[1]===4||!n&&(g===3||g===4))&&m%t[0]===0&&s%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${g} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${g} must be 3 or 4.
  tileAWidth ${m} must be divisible by workgroupSize[0]${t[0]}. tileInner ${s} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${g}<${r}>, ${m/g}>, ${f}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${c/e[0]}>, ${s}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${g};
const tileInner = ${s};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${a?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${u};

  let num_tiles = ${a?`${Math.ceil(o/s)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${a?`i32(globalId.z) * ${o}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${_};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${fm(n,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${i?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${g===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${hm(n,g)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},cd=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,mm=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",uc=(e,t,r="f32",i,n=!1,s=32,a=!1,o=32,u=!1)=>{let c=e[1]*t[1],m=e[0]*t[0],f=n?c:s,g=n?s:c;if(!(g%t[1]===0&&f%t[0]===0&&s%t[1]===0))throw new Error(`tileAHight ${g} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${f} must be divisible by workgroupSize[0]${t[0]}, tileInner ${s} must be divisible by workgroupSize[1]${t[1]}`);let _=g/t[1],v=f/t[0],S=s/t[1],k=u?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${c};
    let globalColStart = i32(workgroupId.x) * ${m};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${g}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${t[0]}) {
          ${cd(n,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${s}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${m}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${i?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${n?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${c};

let tileRowA = i32(localId.y) * ${_};
let tileColA = i32(localId.x) * ${v};
let tileRowB = i32(localId.y) * ${S};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${v}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${cd(n,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${S}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${i?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${mm(n)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${f}>, ${g}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${m}>, ${s}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${s};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${a?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${a?`${Math.ceil(o/s)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${a?`i32(globalId.z) * ${o}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${k}
  }
`},gm=(e,t,r,i,n=!1)=>{let[s,a,o,u]=i,c=ht(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${s.type.indices}) -> ${bt(e,c)} {
      var value = ${bt(e,c)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${a.type.indices};
        ${Oa("aIndices",a,a.rank-2,s.rank,"batchIndices")}
        ${a.indicesSet("aIndices",a.rank-2,"u32(row)")}
        ${a.indicesSet("aIndices",a.rank-1,"u32(colIn)")}
        value = ${a.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${s.type.indices}) -> ${bt(e,c)} {
      var value = ${bt(e,c)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${o.type.indices};
        ${Oa("bIndices",o,o.rank-2,s.rank,"batchIndices")}
        ${o.indicesSet("bIndices",o.rank-2,"u32(row)")}
        ${o.indicesSet("bIndices",o.rank-1,"u32(colIn)")}
        value = ${o.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${bt(e,c)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${bt(e,c)}(bias[row])`};`:""}
        ${r}
        ${u.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},ko=(e,t,r,i,n=!1,s)=>{let a=e[0].dims,o=e[1].dims,u=a.slice(0,-2),c=o.slice(0,-2),m=i?i.slice(0,-2):r.slice(0,-2),f=Z.size(m),g=a[a.length-2],_=a[a.length-1],v=o[o.length-1],S=_%4===0&&v%4===0,k=g<=8?[4,1,1]:[4,4,1],E=[8,8,1],I=[Math.ceil(v/E[0]/k[0]),Math.ceil(g/E[1]/k[1]),Math.ceil(f/E[2]/k[2])],O=S?4:1,z=[...u,g,_/O],R=z.length,N=[...c,_,v/O],T=N.length,$=[f,g,v/O],P=[{type:6,data:g},{type:6,data:v},{type:6,data:_}];_n(t,P),P.push(...be(m,z,N));let F=["rank","rank"],J=e.length>2;J&&(P.push(...be(e[2].dims)),F.push("rank")),P.push(...be($));let H=L=>{let M=m.length,ne=Qc("batchDims",e[0].dataType,M,1),te=ht(e[0].dataType),ie=re("a",e[0].dataType,R,O),me=re("b",e[1].dataType,T,O),U=ge("result",e[0].dataType,$.length,O),j=[ie,me];if(J){let pe=n?O:1;j.push(re("bias",e[2].dataType,e[2].dims.length,pe))}let q=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];vn(t,q);let K=ht(U.type.tensor),X=wn(t,U.type.value,K),Y=gm(O,J,X,[ne,ie,me,U],n);return`
  ${L.registerUniforms(q).registerInternalVariables(ne).declareVariables(...j,U)}
  ${Y}
  ${S?oc(k,E,te,ne):uc(k,E,te,ne)}
                   `};return{name:"MatMul",shaderCache:{hint:`${k};${t.activation};${S};${n}`,inputDependencies:F},getRunData:()=>({outputs:[{dims:s?s(r):r,dataType:e[0].dataType}],dispatchGroup:{x:I[0],y:I[1],z:I[2]},programUniforms:P}),getShaderSource:H}}}),ym,Ww,V$=ae(()=>{"use strict";Te(),$r(),Oe(),Sn(),np(),q$(),sp(),ym=(e,t,r,i,n=!1,s,a=4,o=4,u=4,c="f32")=>{let m=P=>{switch(P){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${c}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${P} is not supported.`)}},f=P=>{switch(P){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${P} is not supported.`)}},g=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,_=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,v=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",S=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",k=e?"row":"col",E=e?"col":"row",I=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${k} / outWidth;
    let outCol = ${k} % outWidth;

    let WRow = ${E} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${E} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${E} % inChannels;
    var resData = ${bt(a,c)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${v} && xCol >= 0 && xCol < ${S}) {
      ${g}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${m(a)}
    }
    return resData;`,O=e?t&&i?`
    let col = colIn * ${a};
    ${I}`:`
    let col = colIn * ${a};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${I}
    }
    return ${bt(a,c)}(0.0);`:i&&r?`
    let col = colIn * ${a};
    ${I}`:`
    let col = colIn * ${a};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${I}
    }
    return ${bt(a,c)}(0.0);`,z=e?i&&r?f(o):`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${f(o)}
    }
    return ${bt(o,c)}(0.0);`:`
    let col = colIn * ${o};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${f(o)}
    }
    return ${bt(o,c)}(0.0);`,R=bt(u,c),N=bt(e?a:o,c),T=bt(e?o:a,c),$=wn(s,R,c);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${N} {
      ${e?O:z}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${T} {
      ${e?z:O}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${R}) {
      let col = colIn * ${u};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${_}
      ${Pw(n)}
      ${$}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Ww=(e,t,r,i,n,s,a,o,u)=>{let c=t.format==="NHWC",m=c?e[0].dims[3]:e[0].dims[1],f=r[0],g=c?r[2]:r[3],_=c?r[1]:r[2],v=c?r[3]:r[1],S=c&&(m%4===0||m%3===0)&&v%4===0,k=c?v:g*_,E=c?g*_:v,I=[8,8,1],O=i<=8?[4,1,1]:[4,4,1],z=[Math.ceil(k/I[0]/O[0]),Math.ceil(E/I[1]/O[1]),Math.ceil(f/I[2]/O[2])];Pe("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${z}`);let R=S?c&&m%4!==0?3:4:1,N=I[1]*O[1],T=I[0]*O[0],$=Math.max(I[0]*R,I[1]),P=i%N===0,F=n%T===0,J=s%$===0,H=S?[R,4,4]:[1,1,1],L=[{type:6,data:i},{type:6,data:n},{type:6,data:s},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];_n(t,L),L.push(...be(e[0].dims,e[1].dims));let M=["rank","rank"];a&&(L.push(...be(e[2].dims)),M.push("rank")),L.push(...be(r));let ne=te=>{let ie=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];vn(t,ie);let me=S?4:1,U=ht(e[0].dataType),j=`
      fn setOutputAtIndex(flatIndex : i32, value : ${S?`vec4<${U}>`:U}) {
        result[flatIndex] = ${S?`vec4<${U}>`:U}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${S?`vec4<${U}>`:U}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${S?"/ 4":""}, value);
      }`,q=re("x",e[0].dataType,e[0].dims.length,R===3?1:R),K=re("w",e[1].dataType,e[1].dims.length,me),X=[q,K],Y=ge("result",e[0].dataType,r.length,me);if(a){let pe=re("bias",e[2].dataType,e[2].dims.length,me);X.push(pe),j+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${S?`vec4<${U}>`:U} {
          return bias[coords.${c?"w":"y"}${S?"/ 4":""}];
        }`}return`
        ${Lw("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${te.registerUniforms(ie).declareVariables(...X,Y)}
        ${j}
        ${ym(c,P,F,J,a,t,H[0],H[1],H[2],U)}
        ${S?oc(O,I,U,void 0,!c,$):uc(O,I,U,void 0,!c,$,!1,void 0,o)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${R};${S};${P};${F};${J};${N};${T};${$}`,inputDependencies:M},getRunData:()=>({outputs:[{dims:u?u(r):r,dataType:e[0].dataType}],dispatchGroup:{x:z[0],y:z[1],z:z[2]},programUniforms:L}),getShaderSource:ne}}}),bm,pd,wa,wm,fd,_m,Gw,qw,F$=ae(()=>{"use strict";Te(),$r(),ke(),Oe(),Sn(),np(),bm=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},pd=e=>typeof e=="number"?[e,e,e]:e,wa=(e,t)=>t<=1?e:e+(e-1)*(t-1),wm=(e,t,r,i=1)=>{let n=wa(t,i);return Math.floor((e[0]*(r-1)-r+n)/2)},fd=(e,t,r,i,n)=>{n==null&&(n=wm(e,t[0],i[0]));let s=[0,0,0,r];for(let a=0;a<3;a++)e[a]+2*n>=t[a]&&(s[a]=Math.trunc((e[a]-t[a]+2*n)/i[a]+1));return s},_m=(e,t,r,i,n,s,a,o,u,c)=>{let m,f,g,_;if(e==="VALID"&&(e=0),typeof e=="number"){m={top:e,bottom:e,left:e,right:e,front:e,back:e};let v=fd([t,r,i,1],[o,u,c],1,[n,s,a],e);f=v[0],g=v[1],_=v[2]}else if(Array.isArray(e)){if(!e.every((S,k,E)=>S===E[0]))throw Error(`Unsupported padding parameter: ${e}`);m={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let v=fd([t,r,i,1],[o,u,c],1,[n,s,a],e[0]);f=v[0],g=v[1],_=v[2]}else if(e==="SAME_UPPER"){f=Math.ceil(t/n),g=Math.ceil(r/s),_=Math.ceil(i/a);let v=(f-1)*n+o-t,S=(g-1)*s+u-r,k=(_-1)*a+c-i,E=Math.floor(v/2),I=v-E,O=Math.floor(S/2),z=S-O,R=Math.floor(k/2),N=k-R;m={top:O,bottom:z,left:R,right:N,front:E,back:I}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:m,outDepth:f,outHeight:g,outWidth:_}},Gw=(e,t,r,i,n,s=!1,a="channelsLast")=>{let o,u,c,m,f;if(a==="channelsLast")[o,u,c,m,f]=e;else if(a==="channelsFirst")[o,f,u,c,m]=e;else throw new Error(`Unknown dataFormat ${a}`);let[g,,_,v,S]=t,[k,E,I]=pd(r),[O,z,R]=pd(i),N=wa(_,O),T=wa(v,z),$=wa(S,R),{padInfo:P,outDepth:F,outHeight:J,outWidth:H}=_m(n,u,c,m,k,E,I,N,T,$),L=s?g*f:g,M=[0,0,0,0,0];return a==="channelsFirst"?M=[o,L,F,J,H]:a==="channelsLast"&&(M=[o,F,J,H,L]),{batchSize:o,dataFormat:a,inDepth:u,inHeight:c,inWidth:m,inChannels:f,outDepth:F,outHeight:J,outWidth:H,outChannels:L,padInfo:P,strideDepth:k,strideHeight:E,strideWidth:I,filterDepth:_,filterHeight:v,filterWidth:S,effectiveFilterDepth:N,effectiveFilterHeight:T,effectiveFilterWidth:$,dilationDepth:O,dilationHeight:z,dilationWidth:R,inShape:e,outShape:M,filterShape:t}},qw=(e,t,r,i,n,s)=>{let a=s==="channelsLast",o=a?e[0].dims[3]:e[0].dims[1],u=!1,c=[64,1,1],m={x:r.map((I,O)=>O)},f=[Math.ceil(bm(m.x.map(I=>r[I]))/c[0]),1,1];Pe("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${f}`);let g=u?a&&o%4!==0?3:4:1,_=Z.size(r),v=[{type:12,data:_},{type:12,data:i},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];_n(t,v),v.push(...be(e[0].dims,e[1].dims));let S=["rank","rank"],k=e.length===3;k&&(v.push(...be(e[2].dims)),S.push("rank")),v.push(...be(r));let E=I=>{let O=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];vn(t,O);let z=u?4:1,R=ht(e[0].dataType),N=re("x",e[0].dataType,e[0].dims.length,g===3?1:g),T=re("W",e[1].dataType,e[1].dims.length,z),$=[N,T],P=ge("result",e[0].dataType,r.length,z),F="";if(k){let L=re("bias",e[2].dataType,e[2].dims.length,z);$.push(L),F+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${u?`vec4<${R}>`:R} {
          return bias[${a?ye("coords",4,5):ye("coords",1,5)}${u?"/ 4":""}];
        }`}let J=bt(g,R),H=wn(t,J,R);return`
            ${F}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${R} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${N.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${R} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${T.getByIndices("aIndices")};
            }
          ${I.registerUniforms(O).declareVariables(...$,P)}
          ${I.mainStart()}
          ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${P.offsetToIndices("global_idx")};
              let batch = ${ye("coords",0,N.rank)};
              let d2 = ${a?ye("coords",N.rank-1,N.rank):ye("coords",1,N.rank)};
              let xFRCCorner = vec3<u32>(${a?ye("coords",1,N.rank):ye("coords",2,N.rank)},
              ${a?ye("coords",2,N.rank):ye("coords",3,N.rank)},
              ${a?ye("coords",3,N.rank):ye("coords",4,N.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${a?ye("uniforms.x_shape",1,N.rank):ye("uniforms.x_shape",2,N.rank)};
              let xShapeZ = ${a?ye("uniforms.x_shape",2,N.rank):ye("uniforms.x_shape",3,N.rank)};
              let xShapeW = ${a?ye("uniforms.x_shape",3,N.rank):ye("uniforms.x_shape",4,N.rank)};
              let xShapeU = ${a?ye("uniforms.x_shape",4,N.rank):ye("uniforms.x_shape",1,N.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = ${R}(0);
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${a?`let xValues = vec4<${R}>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<${R}>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<${R}>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${a?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${a?`let xValues = vec2<${R}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<${R}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<${R}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${a?`let xValues = vec3<${R}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<${R}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<${R}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${k?"value = value + getBiasByOutputCoords(coords)":""};
              ${H}
              result[global_idx] = ${R}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${a};${g};${k}`,inputDependencies:S},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:f[0],y:f[1],z:f[2]},programUniforms:v}),getShaderSource:E}}}),Vw,Fw,H$=ae(()=>{"use strict";Te(),ke(),Oe(),Sn(),Vw=(e,t,r,i)=>{let n=e.length>2,s=n?"value += b[output_channel];":"",a=e[0].dims,o=e[1].dims,u=t.format==="NHWC",c=u?r[3]:r[1],m=c/t.group,f=u&&m>=4?et(c):1,g=Z.size(r)/f,_=[{type:12,data:g},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:m}];_n(t,_),_.push(...be(a,[o[0],o[1],o[2],o[3]/f]));let v=n?["rank","rank","rank"]:["rank","rank"];_.push(...be([r[0],r[1],r[2],r[3]/f]));let S=k=>{let E=ge("output",e[0].dataType,r.length,f),I=ht(E.type.tensor),O=wn(t,E.type.value,I),z=re("x",e[0].dataType,a.length),R=re("w",e[1].dataType,o.length,f),N=[z,R];n&&N.push(re("b",e[2].dataType,e[2].dims,f));let T=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];vn(t,T);let $=u?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${z.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${R.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${z.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${R.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${k.registerUniforms(T).declareVariables(...N,E)}

  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${E.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${u?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${u?1:2}], outputIndices[${u?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${f} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${u?2:1}];

    var value: ${E.type.value} = ${E.type.value}(0);
    ${$}
    ${s}
    ${O}
    ${E.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${f}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:S}},Fw=(e,t,r,i)=>{let n=e.length>2,s=et(r[3]),a=et(r[2]),o=Z.size(r)/s/a,u=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/s],c=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/s],m=[r[0],r[1],r[2],r[3]/s],f=[{type:12,data:o},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];_n(t,f),f.push(...be(u,c,m));let g=(a-1)*t.strides[1]+c[1],_=v=>{let S=ge("output",e[0].dataType,m.length,s),k=ht(S.type.tensor),E=wn(t,S.type.value,k),I=re("x",e[0].dataType,u.length,s),O=re("w",e[1].dataType,c.length,s),z=[I,O];n&&z.push(re("b",e[2].dataType,e[2].dims,s));let R=n?"value += b[output_channel];":"",N=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return vn(t,N),`
  ${v.registerUniforms(N).declareVariables(...z,S)}
  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${a}u;
    let col = (index1 % width1) * ${a}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${I.type.value}, ${g}>;
    var values: array<${S.type.value}, ${a}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${c[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${g}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${I.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${I.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${c[1]}; w_width++) {
          let w_val = ${O.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${a}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${a}u; i++) {
      var value = values[i];
      ${R}
      ${E}
      ${S.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${s};${a};${g};${c[0]};${c[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:f}),getShaderSource:_}}}),vm,ro,$m,no,lc,hd,xm,Tm,dc,j$=ae(()=>{"use strict";ke(),V$(),F$(),sp(),H$(),Sn(),ap(),Br(),vm=(e,t,r,i,n,s)=>{let a=e[0],o=e.slice(s?1:2,s?3:4),u=o.length,c=t[0],m=t.slice(2).map((g,_)=>g+(g-1)*(r[_]-1)),f=o.map((g,_)=>g+i[_]+i[_+u]).map((g,_)=>Math.floor((g-m[_]+n[_])/n[_]));return f.splice(0,0,a),f.splice(s?3:1,0,c),f},ro=[2,3,1,0],$m=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},no=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let s=2;s<t[1].dims.length;++s)r[s-2]===0&&(r[s-2]=t[1].dims[s]);let i=e.pads.slice();Io.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:i}),n},lc=e=>{let t=rp(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,s=e.group,a=e.kernel_shape,o=e.pads,u=e.strides,c=e.w_is_const();return{autoPad:i,format:r,dilations:n,group:s,kernelShape:a,pads:o,strides:u,wIsConst:c,...t,cacheKey:`${e.format};${t.activation};`}},hd=(e,t,r,i)=>{let n=r.format==="NHWC",s=vm(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let N=[t[0]];if(n){let T=e.kernelCustomData.wT??e.compute(Wt(t[1],ro),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=T),N.push(T)}else N.push(t[1]);t.length===3&&N.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Fw(N,r,s,i),{inputs:N}):e.compute(Vw(N,r,s,i),{inputs:N});return}let a=t.length===3,o=t[0].dims[n?1:2],u=t[0].dims[n?2:3],c=t[0].dims[n?3:1],m=t[1].dims[2],f=t[1].dims[3],g=s[n?1:2],_=s[n?2:3],v=s[n?3:1],S=n&&m===o&&f===u&&r.pads[0]===0&&r.pads[1]===0;if(S||m===1&&f===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let N=s[0],T,$,P,F=[];if(n){let L=e.kernelCustomData.wT??e.compute(Wt(t[1],ro),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=L),S){let M=o*u*c;T=t[0].reshape([1,N,M]),$=L.reshape([1,M,v]),P=[1,N,v]}else T=t[0].reshape([N,o*u,c]),$=L.reshape([1,c,v]),P=[N,g*_,v];F.push(T),F.push($)}else T=t[0].reshape([N,c,o*u]),$=t[1].reshape([1,v,c]),P=[N,v,g*_],F.push($),F.push(T);a&&F.push(t[2]);let J=P[2],H=F[0].dims[F[0].dims.length-1];J<8&&H<8?e.compute(ip(F,r,s,P,n,i),{inputs:F}):e.compute(ko(F,r,s,P,n,i),{inputs:F});return}let k=!0,E=e.kernelCustomData.wT??e.compute(Wt(t[1],ro),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=E);let I=[t[0],E];a&&I.push(t[2]);let O=n?g*_:v,z=n?v:g*_,R=m*f*c;e.compute(Ww(I,r,s,O,z,R,a,k,i),{inputs:I})},xm=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],s=[1].concat(t.strides),a=[1].concat(t.dilations),o=[1].concat(t.kernelShape),u=no({...t,pads:n,strides:s,dilations:a,kernelShape:o},i);hd(e,i,u,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},Tm=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",n=no(r,t),s=r.autoPad==="NOTSET"?r.pads:r.autoPad,a=Gw(t[0].dims,t[1].dims,r.strides,r.dilations,s,!1,i);e.compute(qw(t,n,a.outShape,[a.filterDepth,a.filterHeight,a.filterWidth],[a.padInfo.front,a.padInfo.top,a.padInfo.left],i))},dc=(e,t)=>{if($m(e.inputs,t),e.inputs[0].dims.length===3)xm(e,t);else if(e.inputs[0].dims.length===5)Tm(e,e.inputs,t);else{let r=no(t,e.inputs);hd(e,e.inputs,r)}}}),Hw,K$=ae(()=>{"use strict";Te(),$r(),ke(),Oe(),Hw=(e,t,r)=>{let i=e.length>2,n=t.outputShape,s=t.format==="NHWC",a=t.group,o=e[1].dims,u=o[2]/a,c=o[3],m=s?et(u):1,f=s&&c===1&&u>=4,g=f?Math.floor(u/4)*4:Math.floor(u/m)*m,_=u-g,v=s?et(c):1,S=s?c===1?m:v:1,k=Z.size(n)/v,E=[Math.ceil(k/64),1,1];Pe("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${E}`);let I=["rank","rank"],O=[t.strides[0],t.strides[1]],z=[t.kernelShape[s?1:2],t.kernelShape[s?2:3]],R=[t.dilations[0],t.dilations[1]],N=[z[0]+(t.dilations[0]<=1?0:(t.kernelShape[s?1:2]-1)*(t.dilations[0]-1)),z[1]+(t.dilations[1]<=1?0:(t.kernelShape[s?2:3]-1)*(t.dilations[1]-1))],T=[N[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),N[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],$=[{type:12,data:k},{type:12,data:O},{type:12,data:z},{type:12,data:R},{type:12,data:N},{type:6,data:T},{type:12,data:g},{type:12,data:u},{type:12,data:c},...be(e[0].dims,e[1].dims)];i&&($.push(...be(e[2].dims)),I.push("rank")),$.push(...be(n));let P=F=>{let J=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:O.length},{name:"filter_dims",type:"u32",length:z.length},{name:"dilations",type:"u32",length:z.length},{name:"effective_filter_dims",type:"u32",length:N.length},{name:"pads",type:"i32",length:T.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],H=ht(e[0].dataType),L=s?1:2,M=s?2:3,ne=s?3:1,te=re("W",e[1].dataType,e[1].dims.length,S),ie=re("Dy",e[0].dataType,e[0].dims.length,m),me=[ie,te];i&&me.push(re("bias",e[2].dataType,[n[ne]].length,v));let U=ge("result",e[0].dataType,n.length,v),j=()=>{let X="";if(f)m===4?X+=`
        let xValue = ${ie.getByOffset("x_offset")};
        let wValue = ${te.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:m===2?X+=`
          dotProd = dotProd + dot(vec4<${H}>(${ie.getByOffset("x_offset")}, ${ie.getByOffset("x_offset + 1u")}), vec4<${H}>(${te.getByOffset("w_offset")}, ${te.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:m===1&&(X+=`
          dotProd = dotProd + dot(vec4<${H}>(${ie.getByOffset("x_offset")}, ${ie.getByOffset("x_offset + 1u")}, ${ie.getByOffset("x_offset + 2u")}, ${ie.getByOffset("x_offset + 3u")}), vec4<${H}>(${te.getByOffset("w_offset")}, ${te.getByOffset("w_offset + 1u")}, ${te.getByOffset("w_offset + 2u")}, ${te.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(X+=`
                  let xValue = ${s?ie.getByOffset(`${ie.indicesToOffset(`${ie.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${m}`):ie.get("batch","inputChannel","idyR","idyC")};
        `,m===1)X+=`
          let w_offset = ${te.indicesToOffset(`${te.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${te.getByOffset(`w_offset / ${S}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let Y=0;Y<m;Y++)X+=`
            let wValue${Y} = ${te.getByOffset(`${te.indicesToOffset(`${te.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${Y}, wOutChannel)`)} / ${S}`)};
            dotProd = dotProd + xValue[${Y}] * wValue${Y};`;return X},q=()=>{if(_===0)return"";if(!f)throw new Error(`packInputAs4 ${f} is not true.`);let X="";if(m===1){X+="dotProd = dotProd";for(let Y=0;Y<_;Y++)X+=`
            + ${ie.getByOffset(`x_offset + ${Y}`)} * ${te.getByOffset(`w_offset + ${Y}`)}`;X+=";"}else if(m===2){if(_!==2)throw new Error(`Invalid inputChannelsRemainder ${_}.`);X+=`
          let xValue = ${ie.getByOffset("x_offset")};
          let wValue = ${te.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return X},K=`
            let outputIndices = ${U.offsetToIndices(`global_idx * ${v}`)};
            let batch = ${U.indicesGet("outputIndices",0)};
            let d1 = ${U.indicesGet("outputIndices",ne)};
            let r = ${U.indicesGet("outputIndices",L)};
            let c = ${U.indicesGet("outputIndices",M)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${U.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${H}(dyRCorner) + ${H}(wR)) / ${H}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${H}(uniforms.Dy_shape[${L}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${H}(dyCCorner) + ${H}(wC)) / ${H}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${H}(uniforms.Dy_shape[${M}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${f?`
                var x_offset = ${ie.indicesToOffset(`${ie.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${m};
                var w_offset = ${te.indicesToOffset(`${te.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${S};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${f?4:m}) {
                  ${j()}
                  inputChannel = inputChannel + ${f?4:m};
                }
                ${q()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${v}]`:""};
            ${U.setByOffset("global_idx","value")};
          `;return`
    ${F.registerUniforms(J).declareVariables(...me,U)}
      ${F.mainStart()}
      ${F.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${K}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${m}${S}${v}${f}${_}`,inputDependencies:I},getRunData:()=>({dispatchGroup:{x:E[0],y:E[1],z:E[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:$}),getShaderSource:P}}}),Sm,Im,Em,md,jw,km,gd,Cm,Kw,Y$=ae(()=>{"use strict";K$(),Sn(),Br(),Sm=(e,t,r,i,n,s)=>(e-1)*t+r+(i-1)*n+1-s,Im=(e,t,r,i,n)=>{let s=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=s,r[n]=e-s):t==="SAME_LOWER"&&(r[i]=e-s,r[n]=s)},Em=(e,t,r,i,n,s,a,o,u,c)=>{let m=e.length-2,f=c.length===0;u.length<m&&u.push(...Array(m-u.length).fill(0));let g=e[0],_=t[o?3:1]*n;for(let v=0,S=e.length-m-(o?1:0);v<m;++v,++S){let k=e[S],E=f?k*a[v]:c[v],I=Sm(k,a[v],s[v],t[S],r[v],E);Im(I,i,s,v,v+m),f&&c.push(a[v]*(k-1)+u[v]+(t[S]-1)*r[v]+1-s[v]-s[v+m])}c.splice(0,0,g),c.splice(o?3:1,0,_)},md=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((f,g)=>f*g,1)===0){r.length=0;for(let f=2;f<t[1].dims.length;++f)r.push(t[1].dims[f])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let n=e.pads.slice(),s=e.outputShape.slice(),a=e.outputPadding.slice(),o=t[0].dims,u=e.dilations.slice();if(u.reduce((f,g)=>f+g,0)===0){let f=t[0].dims.length-2;u=new Array(f).fill(1)}let c=e.strides.slice();if(c.reduce((f,g)=>f+g,0)===0){let f=t[0].dims.length-2;c=new Array(f).fill(1)}Em(o,r,u,e.autoPad,e.group,n,c,i,a,s);let m=Object.assign({},e);return Object.assign(m,{kernelShape:r,pads:n,outputPadding:a,outputShape:s,dilations:u,strides:c}),m},jw=e=>{let t=rp(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,s=e.group??1,a=e.kernelShape,o=e.pads,u=e.strides,c=e.wIsConst(),m=e.outputPadding,f=e.outputShape;return{autoPad:i,format:r,dilations:n,group:s,kernelShape:a,outputPadding:m,outputShape:f,pads:o,strides:u,wIsConst:c,...t,cacheKey:`${e.format};${t.activation};`}},km=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let s=e[0].dims.length-2;if(t.dilations.reduce((a,o)=>a+o,0)>0&&t.dilations.length!==s)throw new Error(`dilations should be ${s}D`);if(t.strides.reduce((a,o)=>a+o,0)>0&&t.strides.length!==s)throw new Error(`strides should be ${s}D`);if(t.pads.reduce((a,o)=>a+o,0)>0&&t.pads.length!==s*2)throw new Error(`pads should be ${s*2}D`);if(t.outputPadding.length!==s&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${s}D`);if(t.kernelShape.reduce((a,o)=>a+o,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},gd=(e,t,r,i)=>{let n=e.kernelCustomData.wT??e.compute(Wt(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let s=[t[0],n];t.length===3&&s.push(t[2]),e.compute(Hw(s,r,i),{inputs:s})},Cm=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let s=t.dilations;(s.length===0||s[0]===0)&&(s=[1]);let a=t.strides;(a.length===0||a[0]===0)&&(a=[1]);let o=t.pads;o.length===0&&(o=[0,0]),o=[0,o[0],0,o[1]],a=[1].concat(a),s=[1].concat(s),n=[1].concat(n);let u=t.outputPadding;u=[0].concat(u);let c=md({...t,pads:o,strides:a,dilations:s,kernelShape:n,outputPadding:u},i);gd(e,i,c,m=>r?[m[0],m[2],m[3]]:[m[0],m[1],m[3]])},Kw=(e,t)=>{if(km(e.inputs,t),e.inputs[0].dims.length===3)Cm(e,t);else{let r=md(t,e.inputs);gd(e,e.inputs,r)}}}),Am,Yw,Xw,X$=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),Am=(e,t,r,i)=>{let n=Z.size(t),s=t.length,a=re("input",e,s),o=ge("output",e,s),u=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),c=Z.normalizeAxis(u,s),m=f=>{let g=` i32(${a.indicesGet("inputIndices","uniforms.axis")}) `,_=ye("uniforms.input_shape","uniforms.axis",s),v=i.reverse?g+(i.exclusive?" + 1":""):"0",S=i.reverse?_:g+(i.exclusive?"":" + 1");return`
                ${f.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(a,o)}
                ${f.mainStart()}
                  ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${o.offsetToIndices("global_idx")};
                  var sum = ${o.type.value}(0);
                  let first : i32 = ${v};
                  let last : i32 = ${S};
                  for (var i : i32 = first; i < last; i++) {
                    ${a.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${a.getByIndices("inputIndices")};
                  }
                  ${o.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:c},...be(t,t)]}),getShaderSource:m}},Yw=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,n=e.inputs[1];e.compute(Am(i,r,n,t),{inputs:[0]})},Xw=e=>{let t=e.exclusive===1,r=e.reverse===1;return We({exclusive:t,reverse:r})}}),Om,zm,Rm,Zw,Qw,Z$=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),Om=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},zm=(e,t,r,i)=>{let n=[];n.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let s=0;s<t;++s)n.push(r.indicesSet("a",e[s],`i[${s}]`));return n.push("return a;}"),n.join(`
`)},Rm=(e,t)=>{let r,i,n,s,a,o,u=t.format==="NHWC",c=t.blocksize,m=t.mode==="DCR";u?([r,i,n,s]=e.dims,a=m?[r,i,n,c,c,s/c**2]:[r,i,n,s/c**2,c,c],o=m?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,n,s]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],a=m?[r,c,c,s/c**2,i,n]:[r,s/c**2,c,c,i,n],o=m?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let f=e.reshape(a),g=f.dims.length,_=e.dataType,v=re("a",_,g),S=ge("output",_,g),k=E=>`
  ${E.registerUniform("output_size","u32").declareVariables(v,S)}

  ${zm(o,g,v,S)}

  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${S.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${S.setByOffset("global_idx",v.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:E=>{let I=u?[r,i*c,n*c,s/c**2]:[r,s/c**2,i*c,n*c],O=Z.size(I),z=f.dims,R=Z.sortBasedOnPerm(z,o);return{outputs:[{dims:I,dataType:E[0].dataType}],dispatchGroup:{x:Math.ceil(O/64)},programUniforms:[{type:12,data:O},...be(z,R)]}},getShaderSource:k}},Zw=(e,t)=>{Om(e.inputs),e.compute(Rm(e.inputs[0],t))},Qw=e=>We({blocksize:e.blocksize,mode:e.mode,format:e.format})}),wr,_a,io,yd,Cr,Mm,Bm,Dm,bd,wd,_d,Nm,Um,vd,Pm,Jw,e_,Q$=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),wr=256,_a=512,io=2*Math.PI,yd=e=>{let t=[],r=e;for(let i of[4,2,3,5])for(;r%i===0;)t.push(i),r/=i;return r===1?t:void 0},Cr=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},Mm=(e,t,r,i,n)=>{let s=r/e,a=_a-i,o=c=>`smem[${a}u + base + ${c*t}u]`,u=`  for (var t = local_idx; t < ${s}u; t += ${wr}u) {
`;u+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,u+=`    var leg: array<vec2<f32>, 5>;
`;for(let c=0;c<e;c++){let m=`${i}u + t + ${c*s}u`;if(c===0)u+=`    leg[0] = smem[${m}];
`;else{let f=n*io*c/(e*t);u+=`    { let a = ${Cr(f)} * angleUnit; leg[${c}] = cmul(smem[${m}], vec2<f32>(cos(a), sin(a))); }
`}}if(u+=`    let base = (t / ${t}u) * ${t*e}u + twiddleIndex;
`,e===2)u+=`    ${o(0)} = leg[0] + leg[1];
    ${o(1)} = leg[0] - leg[1];
`;else if(e===4){let c=n<0?"vec2<f32>(oddDiff.y, -oddDiff.x)":"vec2<f32>(-oddDiff.y, oddDiff.x)";u+=`    let evenSum = leg[0] + leg[2]; let evenDiff = leg[0] - leg[2];
`,u+=`    let oddSum = leg[1] + leg[3]; let oddDiff = leg[1] - leg[3];
`,u+=`    let oddRot = ${c};
`,u+=`    ${o(0)} = evenSum + oddSum;
    ${o(1)} = evenDiff + oddRot;
`,u+=`    ${o(2)} = evenSum - oddSum;
    ${o(3)} = evenDiff - oddRot;
`}else for(let c=0;c<e;c++){let m=["leg[0]"];for(let f=1;f<e;f++){let g=n*io*(f*c)/e,_=Cr(Math.cos(g)),v=Cr(Math.sin(g));m.push(`vec2<f32>(leg[${f}].x*${_} - leg[${f}].y*${v}, leg[${f}].x*${v} + leg[${f}].y*${_})`)}u+=`    ${o(c)} = ${m.join(" + ")};
`}return`${u}  }
  workgroupBarrier();
`},Bm=(e,t,r)=>{let i="",n=1,s=0;for(let a of e)i+=Mm(a,n,t,s,r),n*=a,s=_a-s;return{code:i,resultOffset:s}},Dm=(e,t,r,i,n)=>{let s=e.dims,a=s.length,o=s[a-1],u=s[t],c=r&&i?(u-1)*2:u;n!==void 0&&(c=n);let m=r&&i?1:2,f=i&&!r?Math.floor(c/2)+1:c,g=s.slice();g[t]=f,g[a-1]=m;let _=1;for(let S=t+1;S<a-1;S++)_*=s[S];let v=Z.size(s)/o/u;return{dataType:e.dataType,outputDims:g,length:c,signalLength:u,inner:_,batch:v,inputComponents:o,outputComponents:m,outputLength:f,inverse:r,onesided:i}},bd=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),wd=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],_d=(e,t,r)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,r),Nm=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:s,onesided:a}=e,o=ft(t),u=s?1:-1,c=s?1/r:1,m=yd(r),f=g=>{let _=re("x",t,[1]),v=ge("y",t,[1]),S=R=>{let N=`inBase + (${R}) * uniforms.inner * ${i}u`,T=`f32(${_.getByOffset(N)})`,$=i===2?`f32(${_.getByOffset(`${N} + 1u`)})`:"0.0";return`vec2<f32>(${T}, ${$})`},k;if(s&&a){let R=Math.floor(r/2)+1,N=r%2===0?`select(provided, provided - 1u, provided == ${R}u)`:"provided";k=`
    let provided = min(uniforms.signalLength, ${R}u);
    for (var i = local_idx; i < ${r}u; i += ${wr}u) {
      if (i < provided) { smem[i] = ${S("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();
    for (var k = local_idx + 1u; k < ${N}; k += ${wr}u) {
      let h = smem[k];
      smem[${r}u - k] = vec2<f32>(h.x, -h.y);
    }
    workgroupBarrier();`}else k=`
    let loadCount = min(uniforms.signalLength, ${r}u);
    for (var i = local_idx; i < ${r}u; i += ${wr}u) {
      if (i < loadCount) { smem[i] = ${S("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();`;let{code:E,resultOffset:I}=Bm(m,r,u),O=c===1?`smem[${I}u + i]`:`smem[${I}u + i] * ${Cr(c)}`,z=n===2?v.setByOffset("off + 1u",`${o}(v.y)`):"";return`
  ${_d(g,_,v)}
  var<workgroup> smem: array<vec2<f32>, ${2*_a}>;
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${g.mainStart(wr)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${n}u;
    ${k}
${E}    for (var i = local_idx; i < uniforms.outputLength; i += ${wr}u) {
      let v = ${O};
      let off = outBase + i * uniforms.inner * ${n}u;
      ${v.setByOffset("off",`${o}(v.x)`)}
      ${z}
    }
  }`};return{name:"DFT",shaderCache:{hint:bd(e,"fft"),inputDependencies:["type"]},getShaderSource:f,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:wd(e),dispatchGroup:{x:e.batch}})}},Um=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:s,onesided:a}=e,o=ft(t),u=s?1:-1,c=s?1/r:1,m=f=>{let g=re("x",t,[1]),_=ge("y",t,[1]),v=O=>{let z=`inBase + (${O}) * uniforms.inner * ${i}u`,R=`f32(${g.getByOffset(z)})`,N=i===2?`f32(${g.getByOffset(`${z} + 1u`)})`:"0.0";return`vec2<f32>(${R}, ${N})`},S=s&&a?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
    let provided = min(uniforms.signalLength, ${Math.floor(r/2)+1}u);
    if (k < provided) { return ${v("k")}; }
    let m = ${r}u - k;
    if (m < provided) {
      let h = ${v("m")};
      return vec2<f32>(h.x, -h.y);
    }
    return vec2<f32>(0.0, 0.0);
  }`:`fn spectrum(inBase: u32, n: u32) -> vec2<f32> {
    if (n < uniforms.signalLength) { return ${v("n")}; }
    return vec2<f32>(0.0, 0.0);
  }`,k=`
      let angle = ${Cr(u*io)} * f32(knMod) / ${Cr(r)};
      acc += cmul(spectrum(inBase, n), vec2<f32>(cos(angle), sin(angle)));
      knMod += k;
      if (knMod >= ${r}u) { knMod -= ${r}u; }`,E=n===2?_.setByOffset("off + 1u",`${o}(v.y)`):"",I=c===1?"acc":`acc * ${Cr(c)}`;return`
  ${_d(f,g,_)}
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${S}
  ${f.mainStart(wr)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${n}u;
    for (var k = local_idx; k < uniforms.outputLength; k += ${wr}u) {
      var acc = vec2<f32>(0.0, 0.0);
      var knMod = 0u;
      for (var n = 0u; n < ${r}u; n++) {${k}
      }
      let v = ${I};
      let off = outBase + k * uniforms.inner * ${n}u;
      ${_.setByOffset("off",`${o}(v.x)`)}
      ${E}
    }
  }`};return{name:"DFT",shaderCache:{hint:bd(e,"direct"),inputDependencies:["type"]},getShaderSource:m,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:wd(e),dispatchGroup:{x:e.batch}})}},vd=e=>{if(!e||e.dataType===0)return;if(Z.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},Pm=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let r=t[t.length-1];if(r!==1&&r!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},Jw=(e,t)=>{Pm(e.inputs);let r=e.inputs[0],i=r.dims.length,n=t.inverse!==0,s=t.onesided!==0,a=vd(e.inputs[1]);if(a!==void 0&&a<=0)throw new Error("dft_length must be greater than zero.");let o=Z.normalizeAxis(vd(e.inputs[2])??t.axis,i);if(o===i-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(n&&s&&r.dims[i-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let u=Dm(r,o,n,s,a);if(u.length<=0)throw new Error(`Invalid DFT length: ${u.length}`);let c=u.length<=_a&&yd(u.length)!==void 0?Nm(u):Um(u);e.compute(c,{inputs:[0]})},e_=e=>We({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),ao,va,$d,Lm,Wm,Gm,qm,xd,Vm,t_,r_,J$=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),ao="[a-zA-Z]|\\.\\.\\.",va="("+ao+")+",$d="^"+va+"$",Lm="("+va+",)*"+va,Wm="^"+Lm+"$",Gm=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},qm=class{constructor(e,t){var n;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(Wm)))throw new Error("Invalid LHS term");if(r.split(",").forEach((s,a)=>{let o=e[a].dims.slice();if(!s.match(RegExp($d)))throw new Error("Invalid LHS term");let u=this.processTerm(s,!0,o,a);this.lhs.push(u)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([s,a])=>a.count===1||s==="...").map(([s])=>s).join("");else if(!i.match(RegExp(va)))throw new Error("Invalid RHS");(n=i.match(RegExp(ao,"g")))==null||n.forEach(s=>{if(s==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let a=this.symbolToInfo.get(s);if(a===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(a.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let n=r.length,s=!1,a=[],o=0;if(!e.match(RegExp($d))&&!t&&e!=="")throw new Error("Invalid LHS term");let u=e.match(RegExp(ao,"g")),c=new Gm(i);return u==null||u.forEach((m,f)=>{if(m==="..."){if(s)throw new Error("Only one ellipsis is allowed per input term");s=!0;let g=n-u.length+1;if(g<0)throw new Error("Ellipsis out of bounds");if(a=r.slice(o,o+g),this.hasEllipsis){if(this.ellipsisDims.length!==a.length||this.ellipsisDims.toString()!==a.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=a;else throw new Error("Ellipsis must be specified in the LHS");for(let _=0;_<a.length;_++){let v=String.fromCharCode(48+_);c.addSymbol(v,f+_),this.addSymbol(v,r[o++],i)}}else c.addSymbol(m,f+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(m,r[o++],i)}),c}},xd=e=>e+"_max",Vm=(e,t,r,i)=>{let n=e.map(c=>c.length).map((c,m)=>re(`input${m}`,t,c)),s=Z.size(i),a=ge("output",t,i.length),o=[...r.symbolToInfo.keys()].filter(c=>!r.rhs.symbolToIndices.has(c)),u=c=>{let m=[],f="var prod = 1.0;",g="var sum = 0.0;",_="sum += prod;",v=[],S=[],k=[],E=[],I=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((z,R)=>{var N;if(r.rhs.symbolToIndices.has(R)){let T=(N=r.rhs.symbolToIndices.get(R))==null?void 0:N[0];T!==void 0&&r.lhs.forEach(($,P)=>{if(z.inputIndices.includes(P)){let F=$.symbolToIndices.get(R);if(F===void 0)throw new Error("Invalid symbol error");F.forEach(J=>{m.push(`${n[P].indicesSet(`input${P}Indices`,J,a.indicesGet("outputIndices",T))}`)})}})}else r.lhs.forEach((T,$)=>{if(z.inputIndices.includes($)){let P=T.symbolToIndices.get(R);if(P===void 0)throw new Error("Invalid symbol error");P.forEach(F=>{v.push(`${n[$].indicesSet(`input${$}Indices`,F,`${R}`)}`)}),E.push(`prod *= ${n[$].getByIndices(`input${$}Indices`)};`)}}),S.push(`for(var ${R}: u32 = 0; ${R} < uniforms.${xd(R)}; ${R}++) {`),k.push("}")});let O=I?[...m,`let sum = ${n.map((z,R)=>z.getByIndices(`input${R}Indices`)).join(" * ")};`]:[...m,g,...S,...v,f,...E,_,...k];return`
            ${c.registerUniforms(o.map(z=>({name:`${xd(z)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,a)}

            ${c.mainStart()}
            ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${a.offsetToIndices("global_idx")};
            ${n.map((z,R)=>`var input${R}Indices: ${n[R].type.indices};`).join(`
`)}
            ${O.join(`
`)};
            ${a.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let c=o.filter(f=>r.symbolToInfo.has(f)).map(f=>{var g;return{type:12,data:((g=r.symbolToInfo.get(f))==null?void 0:g.dimValue)||0}});c.push({type:12,data:s});let m=e.map((f,g)=>[...be(f)]).reduce((f,g)=>f.concat(g),c);return m.push(...be(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:m}},getShaderSource:u}},t_=(e,t)=>{let r=new qm(e.inputs,t.equation),i=r.outputDims,n=e.inputs.map((s,a)=>s.dims);e.compute(Vm(n,e.inputs[0].dataType,r,i))},r_=e=>{let t=e.equation.replace(/\s+/g,"");return We({equation:t})}}),Fm,Td,Hm,jm,n_,e2=ae(()=>{"use strict";Te(),ke(),Oe(),Fm=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;i<r.length&&n<t.length;++i,++n)if(r[i]!==t[n]&&r[i]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Td=(e,t)=>{let r=e.length-t.length,i=[];for(let n=0;n<r;++n)i.push(e[n]);for(let n=0;n<t.length;++n)i.push(t[n]===1?e[n+r]:t[n]);return i},Hm=(e,t)=>e.length>t.length?Td(e,t):Td(t,e),jm=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=Hm(t,r),n=e[0].dataType,s=n===9||Z.size(t)===1,a=n===9||t.length>0&&t[t.length-1]%4===0?4:1,o=s||i.length>0&&i[i.length-1]%4===0?4:1,u=Math.ceil(Z.size(i)/o),c=f=>{let g=re("input",n,t.length,a),_=ge("output",n,i.length,o),v;if(n===9){let S=(k,E,I="")=>`
          let outputIndices${E} = ${_.offsetToIndices(`outputOffset + ${E}u`)};
          let offset${E} = ${g.broadcastedIndicesToOffset(`outputIndices${E}`,_)};
          let index${E} = offset${E} / 4u;
          let component${E} = offset${E} % 4u;
          ${k}[${E}] = ${I}(${g.getByOffset(`index${E}`)}[component${E}]);
        `;v=`
        let outputOffset = global_idx * ${o};
        var data = vec4<u32>(0);
        ${S("data",0,"u32")}
        ${S("data",1,"u32")}
        ${S("data",2,"u32")}
        ${S("data",3,"u32")}
        ${_.setByOffset("global_idx","data")}
      }`}else v=`
        let outputIndices = ${_.offsetToIndices(`global_idx * ${o}`)};
        let inputOffset = ${g.broadcastedIndicesToOffset("outputIndices",_)};
        let data = ${_.type.value}(${g.getByOffset(`inputOffset / ${a}`)});
        ${_.setByOffset("global_idx","data")}
      }`;return`
    ${f.registerUniform("vec_size","u32").declareVariables(g,_)}
    ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${v}`},m=[{type:12,data:u},...be(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${a}${o}`,inputDependencies:["rank"]},getShaderSource:c,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:m})}},n_=e=>{Fm(e.inputs),e.compute(jm(e.inputs),{inputs:[0]})}}),Km,i_,t2=ae(()=>{"use strict";Te(),ke(),Oe(),tp(),Km=e=>{let t=e[0].dataType,r=Z.size(e[0].dims),i=Z.size(e[1].dims),n=i%4===0,s=a=>{let o=re("x",t,[1],4),u=re("bias",t,[1],4),c=ge("y",t,[1],4),m=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],f=_=>`
      let bias${_}_offset: u32 = (global_idx * 4 + ${_}) % uniforms.bias_size;
      let bias${_} = ${u.getByOffset(`bias${_}_offset / 4`)}[bias${_}_offset % 4];`,g=n?`
      let bias = ${u.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${f(0)}${f(1)}${f(2)}${f(3)}
      let bias = ${o.type.value}(bias0, bias1, bias2, bias3);`;return`${a.registerUniforms(m).declareVariables(o,u,c)}

    ${ac(ft(t))}

    ${a.mainStart(Yn)}
      ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${o.getByOffset("global_idx")};
      ${g}
      let x_in = x + bias;
      ${c.setByOffset("global_idx",sc("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:s,getRunData:a=>({outputs:[{dims:a[0].dims,dataType:a[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/Yn/4)}})}},i_=e=>{e.inputs.length<2||Z.size(e.inputs[1].dims)===0?$w(e):e.compute(Km(e.inputs))}}),Ym,Xm,a_,s_,r2=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),Ym=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Xm=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,s=Z.normalizeAxis(t.axis,n),a=r.slice(0);a.splice(s,1,...i);let o=r[s],u=e[0].dataType===9?4:1,c=Math.ceil(Z.size(a)/u),m=[{type:12,data:c},{type:6,data:o},{type:12,data:s},...be(e[0].dims,e[1].dims,a)],f=g=>{let _=re("data",e[0].dataType,e[0].dims.length,u),v=re("inputIndices",e[1].dataType,e[1].dims.length),S=ge("output",e[0].dataType,a.length,u),k=I=>{let O=i.length,z=`var indicesIndices${I}  = ${v.type.indices}(0);`;for(let R=0;R<O;R++)z+=`${O>1?`indicesIndices${I}[${R}]`:`indicesIndices${I}`} = ${a.length>1?`outputIndices${I}[uniforms.axis + ${R}]`:`outputIndices${I}`};`;z+=`
          var idx${I} = ${v.getByIndices(`indicesIndices${I}`)};
          if (idx${I} < 0) {
            idx${I} = idx${I} + uniforms.axisDimLimit;
          }
          var dataIndices${I} : ${_.type.indices};
        `;for(let R=0,N=0;R<n;R++)R===s?(z+=`${n>1?`dataIndices${I}[${R}]`:`dataIndices${I}`} = u32(idx${I});`,N+=O):(z+=`${n>1?`dataIndices${I}[${R}]`:`dataIndices${I}`} = ${a.length>1?`outputIndices${I}[${N}]`:`outputIndices${I}`};`,N++);return z},E;if(e[0].dataType===9){let I=(O,z,R="")=>`
          let outputIndices${z} = ${S.offsetToIndices(`outputOffset + ${z}u`)};
          ${k(z)};
          let offset${z} = ${_.indicesToOffset(`dataIndices${z}`)};
          let index${z} = offset${z} / 4u;
          let component${z} = offset${z} % 4u;
          ${O}[${z}] = ${R}(${_.getByOffset(`index${z}`)}[component${z}]);
        `;E=`
        let outputOffset = global_idx * ${u};
        var value = vec4<u32>(0);
        ${I("value",0,"u32")}
        ${I("value",1,"u32")}
        ${I("value",2,"u32")}
        ${I("value",3,"u32")}
        ${S.setByOffset("global_idx","value")}
      `}else E=`
      let outputIndices = ${S.offsetToIndices("global_idx")};
      ${k("")};
      let value = ${_.getByIndices("dataIndices")};
      ${S.setByOffset("global_idx","value")};
      `;return`
      ${g.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,v,S)}
      ${g.mainStart()}
        ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${E}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:m}),getShaderSource:f}},a_=e=>We({axis:e.axis}),s_=(e,t)=>{let r=e.inputs;Ym(r),e.compute(Xm(e.inputs,t))}}),Zm,o_,u_,n2=ae(()=>{"use strict";Te(),ke(),Oe(),Zm=(e,t,r,i,n,s,a,o,u)=>{let c=[{type:12,data:s},{type:12,data:i},{type:12,data:n},{type:12,data:r},{type:12,data:a},{type:12,data:o},{type:12,data:u}],m=[s];c.push(...be(t.dims,m));let f=g=>{let _=re("indices_data",t.dataType,t.dims.length),v=ge("input_slice_offsets_data",12,1,1),S=[_,v],k=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${g.registerUniforms(k).declareVariables(...S)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${n.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:m,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:c}),getShaderSource:f},{inputs:[t],outputs:[-1]})[0]},o_=(e,t)=>{let r=e.inputs,i=r[0].dims,n=r[0].dataType,s=r[1].dims,a=s[s.length-1],o=Z.sizeToDimension(s,s.length-1),u=Z.sizeFromDimension(i,t.batchDims+a),c=Z.sizeToDimension(i,t.batchDims),m=Z.sizeFromDimension(i,t.batchDims),f=o/c,g=new Array(a),_=u;for(let z=0;z<a;++z)g[a-1-z]=_,_*=i[t.batchDims+a-1-z];let v=Zm(e,r[1],g,t.batchDims,i,o,f,m,a),S=t.batchDims+a;if(S>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let k=s.slice(0,-1).concat(i.slice(S)),E=Z.size(k),I=[{type:12,data:E},{type:12,data:u},...be(r[0].dims,v.dims,k)],O=z=>{let R=re("data",r[0].dataType,r[0].dims.length),N=re("slice_offsets",12,v.dims.length),T=ge("output",r[0].dataType,k.length);return`
          ${z.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(R,N,T)}
            ${z.mainStart()}
            ${z.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:k,dataType:n}],dispatchGroup:{x:Math.ceil(E/64)},programUniforms:I}),getShaderSource:O},{inputs:[r[0],v]})},u_=e=>({batchDims:e.batch_dims,cacheKey:""})}),Qm,Jm,l_,d_,i2=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),Qm=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=Z.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,n=e[0],s=e[2],a=e.length===4?e[3]:void 0;if(s.dims.length!==n.dims.length||!n.dims.map((o,u)=>u===r?Math.ceil(o/i)===s.dims[u]:o===s.dims[u]).reduce((o,u)=>o&&u,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(a){if(a.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(a.dims.length!==s.dims.length||!a.dims.map((o,u)=>o===s.dims[u]).reduce((o,u)=>o&&u,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Jm=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,s=Z.normalizeAxis(t.gatherAxis,n),a=Z.normalizeAxis(t.quantizeAxis,n),o=r.slice(0);o.splice(s,1,...i);let u=Z.size(o),c=e[2].dataType,m=e[0].dataType===22,f=[{type:12,data:u},{type:12,data:a},{type:12,data:s},{type:12,data:t.blockSize},...be(...e.map((_,v)=>_.dims),o)],g=_=>{let v=re("data",e[0].dataType,e[0].dims.length),S=re("inputIndices",e[1].dataType,e[1].dims.length),k=re("scales",e[2].dataType,e[2].dims.length),E=e.length>3?re("zeroPoint",e[3].dataType,e[3].dims.length):void 0,I=ge("output",c,o.length),O=[v,S,k];E&&O.push(E);let z=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${_.registerUniforms(z).declareVariables(...O,I)}
        ${_.mainStart()}
        let output_indices = ${I.offsetToIndices("global_idx")};
        var indices_indices = ${S.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${I.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${S.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${I.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${v.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${I.indicesGet("output_indices","i")};
          ${v.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${S.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[s]};
        }
        ${v.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${o.length}; i++) {
          let index = ${I.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${v.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${v.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${v.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${m?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${k.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${k.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${k.getByIndices("scale_indices")};
        ${E?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${E.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${E.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${m?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${ft(c)}(quantized_data - zero_point) * scale;
        ${I.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((_,v)=>v!==1).map(_=>_.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(_,v)=>"rank")},getRunData:()=>({outputs:[{dims:o,dataType:c}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:f}),getShaderSource:g}},l_=(e,t)=>{let r=e.inputs;Qm(r,t),e.compute(Jm(e.inputs,t))},d_=e=>We({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),eg,tg,c_,p_,a2=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),eg=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},tg=(e,t)=>{let r=e[0].dims,i=e[0].dataType,n=r.length,s=e[1].dims,a=e[1].dataType,o=Z.normalizeAxis(t.axis,n),u=r[o],c=s.slice(0),m=Z.size(c),f=re("input",i,n),g=re("indicesInput",a,s.length),_=ge("output",i,c.length),v=[{type:12,data:m},{type:6,data:u},{type:12,data:o}];return v.push(...be(r,s,c)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:v}),getShaderSource:S=>`
      ${S.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(f,g,_)}
      ${S.mainStart()}
      ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${_.offsetToIndices("global_idx")};

      var idx = ${g.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${f.type.indices}(outputIndices);
      ${f.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${f.getByIndices("inputIndices")};

      ${_.setByOffset("global_idx","value")};
  }`}},c_=e=>We({axis:e.axis}),p_=(e,t)=>{let r=e.inputs;eg(r),e.compute(tg(e.inputs,t))}}),rg,ng,f_,h_,s2=ae(()=>{"use strict";Te(),ke(),Oe(),rg=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},ng=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[n,s,a]=ub.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),o=[n,s];if(!o)throw new Error("Can't use gemm on the given tensors");let u=16,c=Math.ceil(s/u),m=Math.ceil(n/u),f=!0,g=Z.size(o),_=[{type:12,data:f?c:g},{type:12,data:n},{type:12,data:s},{type:12,data:a},{type:1,data:t.alpha},{type:1,data:t.beta}],v=["type","type"];e.length===3&&(_.push(...be(e[2].dims)),v.push("rank")),_.push(...be(o));let S=E=>{let I="";t.transA&&t.transB?I="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?I="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?I="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(I="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let O=t.alpha===1?"":"value *= uniforms.alpha;",z=re("a",e[0].dataType,e[0].dims),R=re("b",e[1].dataType,e[1].dims),N=z.type.value,T=null,$=[z,R];e.length===3&&(T=re("c",e[2].dataType,e[2].dims.length),$.push(T));let P=ge("output",e[0].dataType,o.length);$.push(P);let F=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${E.registerUniforms(F).declareVariables(...$)}

  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${N}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${I}
    }

    ${O}
    ${T!=null?`let cOffset = ${T.broadcastedIndicesToOffset("vec2(m, n)",P)}; value += ${N}(uniforms.beta) * ${T.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},k=E=>{let I=re("a",e[0].dataType,e[0].dims),O=re("b",e[1].dataType,e[1].dims),z=null,R=[I,O];e.length===3&&(z=re("c",e[2].dataType,e[2].dims.length),R.push(z));let N=ge("output",e[0].dataType,o.length);R.push(N);let T=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],$="",P="";t.transA&&t.transB?(P=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${I.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${O.type.value}(0);
      }
      `,$="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(P=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${I.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${O.type.value}(0);
      }
      `,$="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(P=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${I.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${O.type.value}(0);
      }
      `,$="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(P=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${I.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${O.type.value}(0);
      }
      `,$="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let F=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${E.registerUniforms(T).declareVariables(...R)}
  var<workgroup> tile_a: array<array<${I.type.storage}, ${u}>, ${u}>;
  var<workgroup> tile_b: array<array<${O.type.storage}, ${u}>, ${u}>;
  ${E.mainStart([u,u,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${u};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${u};
    let num_tiles = (uniforms.K - 1) / ${u} + 1;
    var k_start = 0u;
    var value = ${N.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${P}
      k_start = k_start + ${u};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${u}; k++) {
        ${$}
      }
      workgroupBarrier();
    }

    ${F}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${z!=null?`let cOffset = ${z.broadcastedIndicesToOffset("vec2(m, n)",N)}; value += ${N.type.value}(uniforms.beta) * ${z.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return f?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:c*m},programUniforms:_}),getShaderSource:k}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:_}),getShaderSource:S}},f_=e=>{let t=e.transA,r=e.transB,i=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:i,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},h_=(e,t)=>{rg(e.inputs),e.compute(ng(e.inputs,t))}}),sr,_r,an,sn,ig,ag,sg,og,ug,lg,dg,cg,m_,g_,o2=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),[sr,_r,an,sn]=[0,1,2,3],ig=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},ag=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,sg=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,og=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,ug=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,lg=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${sr}] = batch;
     indices[${_r}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${an}] = u32(r);
            indices[${sn}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${an}] = u32(clamp(r, 0, H - 1));
          indices[${sn}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${an}] = gs_reflect(r, border[1], border[3]);
          indices[${sn}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,dg=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${sr}], indices[${_r}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${sr}], indices[${_r}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${sr}], indices[${_r}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${sr}], indices[${_r}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${sr}], indices[${_r}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${sr}], indices[${_r}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,cg=(e,t)=>{let r=re("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=re("grid",e[1].dataType,i.length,2),s=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(s=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[sr,_r,an,sn]=[0,3,1,2]);let a=ge("output",e[0].dataType,s.length),o=r.type.value,u=Z.size(s),c=[{type:12,data:u},...be(e[0].dims,i,s)],m=f=>`
  ${f.registerUniform("output_size","u32").declareVariables(r,n,a)}
  ${ag}
  ${sg(o)}
  ${og(t)}
  ${ug(t)}
  ${lg(r,o,t)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${an}]);
      let W_in = i32(uniforms.x_shape[${sn}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${a.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${sr}], indices[${an}], indices[${sn}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${dg(a,o,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:f=>{let g=Z.size(s);return{outputs:[{dims:s,dataType:f[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:c}},getShaderSource:m}},m_=(e,t)=>{ig(e.inputs),e.compute(cg(e.inputs,t))},g_=e=>We({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),xt,pg,y_,Sd,fg,Aa,b_,w_=ae(()=>{"use strict";Te(),ke(),tt(),Zc(),ep(),Oe(),Br(),xt=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,pg=(e,t)=>{let r=e[0],i=xt(e,1),n=xt(e,2),s=xt(e,3),a=xt(e,4),o=xt(e,5),u=xt(e,6),c=xt(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let m=r.dims[0],f=r.dims[1],g=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],_=f,v=0,S=0,k=Math.floor(g/t.numHeads);if(u&&c&&Z.size(u.dims)&&Z.size(c.dims)){if(u.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(u.dims[0]!==m||u.dims[1]!==t.numHeads||u.dims[3]!==k)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(c.dims[0]!==m||c.dims[1]!==t.numHeads||c.dims[3]!==k)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(u.dims[2]!==c.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(c.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');v=u.dims[2],S=u.dims[2]}else if(u&&Z.size(u.dims)||c&&Z.size(c.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let E;if(i&&Z.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');E=2,_=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==k)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');E=5,_=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==k)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');E=0,_=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');E=3}if(s&&Z.size(s.dims)>0){if(s.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let I=v+_,O=0;if(a&&Z.size(a.dims)>0){O=8;let T=a.dims;throw T.length===1?T[0]===m?O=1:T[0]===3*m+2&&(O=3):T.length===2&&T[0]===m&&T[1]===I&&(O=5),O===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let z=!1,R=g;if(n&&Z.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(_!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');R=n.dims[2]}else{if(_!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');R=n.dims[1]*n.dims[3],z=!0}}let N=!1;if(a&&Z.size(a.dims)>0)throw new Error("Key padding mask is not supported");if(o&&Z.size(o.dims)>0){if(o.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(o.dims[0]!==m||o.dims[1]!==t.numHeads||o.dims[2]!==f||o.dims[3]!==I)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:m,sequenceLength:f,pastSequenceLength:v,kvSequenceLength:_,totalSequenceLength:I,maxSequenceLength:S,inputHiddenSize:0,hiddenSize:g,vHiddenSize:R,headSize:k,vHeadSize:Math.floor(R/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:O,scale:t.scale,broadcastResPosBias:N,passPastInKv:z,qkvFormat:E}},y_=e=>We({...e}),Sd=We({perm:[0,2,1,3]}),fg=(e,t,r,i,n,s,a)=>{let o=[i,n,s],u=Z.size(o),c=[{type:12,data:u},{type:12,data:a},{type:12,data:s}],m=f=>{let g=ge("qkv_with_bias",t.dataType,o),_=re("qkv",t.dataType,o),v=re("bias",r.dataType,o),S=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${f.registerUniforms(S).declareVariables(_,v,g)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:o,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:c}),getShaderSource:m},{inputs:[t,r],outputs:[-1]})[0]},Aa=(e,t,r,i,n,s,a,o)=>{let u=s;if(a&&Z.size(a.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return u=fg(e,s,a,t,i,r*n,o),u=u.reshape([t,i,r,n]),r===1||i===1?u:e.compute(Wt(u,Sd.perm),{inputs:[u],outputs:[-1]})[0]}else return s.dims.length===3&&(u=s.reshape([t,i,r,n])),r===1||i===1?u:e.compute(Wt(u,Sd.perm),{inputs:[u],outputs:[-1]})[0]},b_=(e,t)=>{let r=pg(e.inputs,t),i=e.inputs[0],n=xt(e.inputs,1),s=xt(e.inputs,2),a=xt(e.inputs,3),o=xt(e.inputs,4),u=xt(e.inputs,5),c=xt(e.inputs,6),m=xt(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if((n==null?void 0:n.dims.length)===5)throw new Error("Packed KV is not implemented");let f=n&&s&&n.dims.length===4&&s.dims.length===4,g=Aa(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,a,0);if(f)return Ma(e,g,n,s,o,void 0,c,m,u,r);if(!n||!s)throw new Error("key and value must be provided");let _=Aa(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,a,r.hiddenSize),v=Aa(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,s,a,2*r.hiddenSize);Ma(e,g,_,v,o,void 0,c,m,u,r)}}),hg,mg,gg,yg,cc,__,v_,$_=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),hg=e=>{if(!e||e.length<1)throw new Error("too few inputs")},mg=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),i=r.length),We({numOutputs:i,axis:t.axis,splitSizes:r})},gg=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${ye("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,yg=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let n=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(n):i===0?r.push(`if (output_number == ${i}u) { ${n} }`):i===t-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${i}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},cc=(e,t)=>{let r=e[0].dims,i=Z.size(r),n=e[0].dataType,s=Z.normalizeAxis(t.axis,r.length),a=new Array(t.numOutputs),o=re("input",n,r.length),u=new Array(t.numOutputs),c=[],m=[],f=0,g=[{type:12,data:i}];for(let v=0;v<t.numOutputs;v++){f+=t.splitSizes[v],u[v]=f;let S=r.slice();S[s]=t.splitSizes[v],m.push(S),a[v]=ge(`output${v}`,n,S.length),c.push({dims:m[v],dataType:e[0].dataType})}g.push({type:12,data:u},...be(r,...m));let _=v=>`
  ${v.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",u.length).declareVariables(o,...a)}
  ${gg(u.length)}
  ${yg(a)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${o.offsetToIndices("global_idx")};
    var index = ${o.indicesGet("indices",s)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${ye("uniforms.size_in_split_axis","output_number - 1u",u.length)};
      ${o.indicesSet("indices",s,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:c,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:g})}},__=(e,t)=>{hg(e.inputs);let r=e.inputs.length===1?t:mg(e.inputs,t);e.compute(cc(e.inputs,r),{inputs:[0]})},v_=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return We({axis:t,numOutputs:i,splitSizes:r})}}),bg,Co,x_,T_=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),bg=(e,t)=>{let[r,i,n,s]=e,{numHeads:a,rotaryEmbeddingDim:o}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!Z.areEqual(i.dims,[])&&!Z.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(s.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${s.dims.length}`);if(!Z.areEqual(n.dims,s.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(o>0&&a===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let u=r.dims[0],c=r.dims[r.dims.length-2],m=n.dims[0],f=Z.sizeFromDimension(r.dims,1)/c,g=o===0?n.dims[1]*2:f/a;if(o>g)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(u!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(c!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(c>m)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(g/2!==n.dims[1]&&o/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`)},Co=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:n,scale:s}=t,a=e[0].dims[0],o=Z.sizeFromDimension(e[0].dims,1),u=e[0].dims[e[0].dims.length-2],c=o/u,m=e[2].dims[1],f=n===0?m*2:c/i,g=new Array(a,u,c/f,f-m),_=Z.computeStrides(g),v=[{type:1,data:s},{type:12,data:g},{type:12,data:_},...e[0].dims.length===3?new Array({type:12,data:[o,c,f,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[o,f,u*f,1]}):[],...be(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],S=k=>{let E=re("input",e[0].dataType,e[0].dims.length),I=re("position_ids",e[1].dataType,e[1].dims.length),O=re("cos_cache",e[2].dataType,e[2].dims.length),z=re("sin_cache",e[3].dataType,e[3].dims.length),R=ge("output",e[0].dataType,e[0].dims.length);return k.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:g.length},{name:"global_strides",type:"u32",length:_.length},{name:"input_output_strides",type:"u32",length:_.length}]),`
        ${k.declareVariables(E,I,O,z,R)}

        ${k.mainStart(Yn)}
          let half_rotary_emb_dim = uniforms.${O.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${I.broadcastedIndicesToOffset("bsnh.xy",ge("",I.type.tensor,2))};
            let position_id =
                u32(${I.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${E.getByOffset("i")} * ${O.get("position_id","bsnh[3]")} -
                ${E.getByOffset("j")} * ${z.get("position_id","bsnh[3]")};
            ${R.setByOffset("i","re")}
            let im = ${E.getByOffset("i")} * ${z.get("position_id","bsnh[3]")} +
                ${E.getByOffset("j")} * ${O.get("position_id","bsnh[3]")};
            ${R.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${R.setByOffset("k",E.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:We({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:S,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(Z.size(g)/Yn)},programUniforms:v})}},x_=(e,t)=>{bg(e.inputs,t),e.compute(Co(e.inputs,t))}}),wg,_g,Id,vg,S_,u2=ae(()=>{"use strict";tt(),Te(),ep(),w_(),$_(),Br(),T_(),Oe(),wg=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],n=e[2],s=e[3],a=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let o=!1,u=r.dims[0],c=r.dims[1],m=r.dims.length===3?o?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],f=c,g=0,_=!i||i.dims.length===0,v=Math.floor(_?m/(t.numHeads+2*t.kvNumHeads):m/t.numHeads);_&&(m=v*t.numHeads);let S=s&&s.dims.length!==0,k=a&&a.dims.length!==0;if(S&&s.dims.length===4&&s.dims[0]===u&&s.dims[1]!==t.kvNumHeads&&s.dims[2]===t.kvNumHeads&&s.dims[3]===v)throw new Error("BSNH pastKey/pastValue is not supported");if(S&&k){if(s.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(a.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');g=s.dims[2]}else if(S||k)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let E=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');f=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==v)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');f=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==v)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');f=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');E=3}let I=0,O=!1,z=t.kvNumHeads?v*t.kvNumHeads:m;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(f!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');z=n.dims[2]}else{if(f!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');z=n.dims[1]*n.dims[3],O=!0}}let R=e.length>4?e[5]:void 0;if(R){if(R.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let N=R.dims.reduce((T,$)=>T*$,1);if(N!==u)throw new Error(`seqlens_k must have batch_size (${u}) elements, got ${N}.`);for(let T=0;T<R.dims.length;T++)if(R.dims[T]!==1&&R.dims[T]!==u)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${u}), got dims[${T}] = ${R.dims[T]}.`)}return{batchSize:u,sequenceLength:c,pastSequenceLength:g,kvSequenceLength:f,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:m,vHiddenSize:z,headSize:v,vHeadSize:Math.floor(z/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:I,scale:t.scale,broadcastResPosBias:!1,passPastInKv:O,qkvFormat:E}},_g=We({perm:[0,2,1,3]}),Id=(e,t,r)=>{let i=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),i=e.compute(Wt(i,_g.perm),{inputs:[i],outputs:[-1]})[0]),i},vg=(e,t,r,i)=>{let n=7,s=["type","type"],a=[e*t],o=e*t,u=[{type:12,data:o},{type:12,data:t},{type:12,data:e}],c=m=>{let f=re("seq_lens",r.dataType,r.dims),g=re("total_seq_lens",i.dataType,i.dims),_=ge("pos_ids",n,a),v=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${m.registerUniforms(v).declareVariables(f,g,_)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${g.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${f.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${_.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${_.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${_.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:s},getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:u}),getShaderSource:c}},S_=(e,t)=>{var z;if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let r=wg(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((z=e.inputs[1])==null?void 0:z.dims.length)===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,s=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,a=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,o=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,u=e.inputs.length>4?e.inputs[5]:void 0,c=e.inputs.length>5?e.inputs[6]:void 0,m=r.kvNumHeads?r.kvNumHeads:r.numHeads,f=We({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,m*r.headSize,m*r.headSize]}),[g,_,v]=!n&&!s?e.compute(cc([i],f),{inputs:[i],outputs:[-1,-1,-1]}):[i,n,s],S,k;if(t.doRotary){let R=e.compute(vg(r.batchSize,r.sequenceLength,u,c),{inputs:[u,c],outputs:[-1]})[0],N=e.inputs[7],T=e.inputs[8],$=We({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),P=[g,R,N,T],F=[-1];S=e.compute(Co(P,$),{inputs:P,outputs:F})[0],P.splice(0,1,_);let J=We({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});k=e.compute(Co(P,J),{inputs:P,outputs:F})[0]}let E=Aa(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?S:g,void 0,0),I=Id(e,t.doRotary?k:_,r),O=Id(e,v,r);Ma(e,E,I,O,void 0,void 0,a,o,void 0,r,u,c)}}),Ed,$g,xg,I_,l2=ae(()=>{"use strict";Te(),ke(),Br(),Oe(),Ed=(e,t,r,i,n,s,a,o)=>{let u=et(s),c=u===1?"f32":`vec${u}f`,m=u===1?"vec2f":`mat2x${u}f`,f=n*a,g=64;f===1&&(g=256);let _=[n,a,s/u],v=[n,a,2],S=["rank","type","type"],k=[];k.push(...be(_,v));let E=I=>{let O=re("x",t.dataType,3,u),z=re("scale",r.dataType,r.dims),R=re("bias",i.dataType,i.dims),N=ge("output",1,3,2),T=[O,z,R,N];return`
  var<workgroup> workgroup_shared : array<${m}, ${g}>;
  const workgroup_size = ${g}u;
  ${I.declareVariables(...T)}
  ${I.mainStart(g)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${c}(0);
    var squared_sum = ${c}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${c}(${O.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${m}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Mr("workgroup_shared[0][0]",u)} / f32(hight * ${u});
      let squared_sum_final = ${Mr("workgroup_shared[0][1]",u)} / f32(hight * ${u});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${o}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${u};${o};${g}`,inputDependencies:S},getRunData:()=>({outputs:[{dims:v,dataType:1}],dispatchGroup:{x:f},programUniforms:k}),getShaderSource:E},{inputs:[t,r,i],outputs:[-1]})[0]},$g=(e,t,r)=>{let i=t[0].dims,n=i,s=2,a=i[0],o=i[1],u=Z.sizeFromDimension(i,s),c=et(u),m=Z.size(n)/c,f=Ed(e,t[0],t[1],t[2],a,u,o,r.epsilon),g=[a,o,u/c],_=[a,o],v=["type","none"],S=k=>{let E=re("x",t[0].dataType,g.length,c),I=re("scale_shift",1,_.length,2),O=ge("output",t[0].dataType,g.length,c),z=[E,I,O];return`
  ${k.registerUniform("output_size","u32").declareVariables(...z)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${O.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${I.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${E.getByOffset("global_idx")} * ${O.type.value}(scale_shift.x) + ${O.type.value}(scale_shift.y);
      ${O.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${c}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...be(g,_,g)]}),getShaderSource:S},{inputs:[t[0],f]})},xg=(e,t,r)=>{let i=t[0].dims,n=i,s=i[0],a=i[i.length-1],o=Z.sizeFromDimension(i,1)/a,u=et(a),c=Z.size(n)/u,m=[{type:12,data:o},{type:12,data:Math.floor(a/u)}],f=["type","type"],g=!1,_=[0,i.length-1];for(let E=0;E<i.length-2;E++)g=g||i[E+1]!==1,_.push(E+1);g=g&&i[i.length-1]!==1;let v=g?e.compute(Wt(e.inputs[0],_),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},(E,I)=>i[_[I]])),S=Ed(e,v,t[1],t[2],s,o,a,r.epsilon),k=E=>{let I=ht(t[0].dataType),O=u===1?"vec2f":`mat${u}x2f`,z=T=>{let $=T===0?"x":"y",P=u===1?"f32":`vec${u}f`;switch(u){case 1:return`${I}(${P}(scale.${$}))`;case 2:return`vec2<${I}>(${P}(scale[0].${$}, scale[1].${$}))`;case 4:return`vec4<${I}>(${P}(scale[0].${$}, scale[1].${$}, scale[2].${$}, scale[3].${$}))`;default:throw new Error(`Not supported compoents ${u}`)}},R=re("input",t[0].dataType,t[0].dims,u),N=ge("output",t[0].dataType,n,u);return`
  @group(0) @binding(0) var<storage, read> input : array<${R.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${O}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${N.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${E.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${z(0)}, ${z(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${u}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:m}),getShaderSource:k},{inputs:[t[0],S]})},I_=(e,t)=>{t.format==="NHWC"?xg(e,e.inputs,t):$g(e,e.inputs,t)}}),Tg,Sg,E_,d2=ae(()=>{"use strict";Te(),ke(),Oe(),Tg=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Sg=(e,t,r)=>{let i=t.simplified,n=e[0].dims,s=e[1],a=!i&&e[2],o=n,u=Z.normalizeAxis(t.axis,n.length),c=Z.sizeToDimension(n,u),m=Z.sizeFromDimension(n,u),f=Z.size(s.dims),g=a?Z.size(a.dims):0;if(f!==m||a&&g!==m)throw new Error(`Size of X.shape()[axis:] == ${m}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${f} and bias size of ${g}`);let _=[];for(let R=0;R<n.length;++R)R<u?_.push(n[R]):_.push(1);let v=et(m),S=["type","type"],k=[{type:12,data:c},{type:1,data:m},{type:12,data:Math.floor(m/v)},{type:1,data:t.epsilon}];a&&S.push("type");let E=r>1,I=r>2,O=R=>{let N=ht(e[0].dataType),T=[re("x",e[0].dataType,e[0].dims,v),re("scale",s.dataType,s.dims,v)];a&&T.push(re("bias",a.dataType,a.dims,v)),T.push(ge("output",e[0].dataType,o,v)),E&&T.push(ge("mean_data_output",1,_)),I&&T.push(ge("inv_std_output",1,_));let $=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${R.registerUniforms($).declareVariables(...T)}
  ${R.mainStart()}
    ${R.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${rc("f32",v)};
    var mean_square_vector = ${rc("f32",v)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Vn(N,v,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Mr("mean_vector",v)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Mr("mean_square_vector",v)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Vn(N,v,"x[j + offset]")};
      let f32scale = ${Vn(N,v,"scale[j]")};
      output[j + offset] = ${T[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${a?`+ ${Vn(N,v,"bias[j]")}`:""}
      );
    }

    ${E?"mean_data_output[global_idx] = mean":""};
    ${I?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},z=[{dims:o,dataType:e[0].dataType}];return E&&z.push({dims:_,dataType:1}),I&&z.push({dims:_,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${v};${r};${i}`,inputDependencies:S},getRunData:()=>({outputs:z,dispatchGroup:{x:Math.ceil(c/64)},programUniforms:k}),getShaderSource:O}},E_=(e,t)=>{Tg(e.inputs),e.compute(Sg(e.inputs,t,e.outputCount))}}),Ig,k_,c2=ae(()=>{"use strict";ke(),ap(),sp(),Ig=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},k_=e=>{Ig(e.inputs);let t=Kn.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(ip(e.inputs,{activation:""},t));else{let n=t[t.length-2],s=Z.size(e.inputs[0].dims.slice(0,-2)),a=Z.size(e.inputs[1].dims.slice(0,-2));if(s!==1&&n===1&&a===1){let o=e.inputs[0].reshape([1,s,i]),u=e.inputs[1].reshape([1,i,r]),c=[1,s,r],m=[o,u];e.compute(ko(m,{activation:""},t,c),{inputs:m})}else e.compute(ko(e.inputs,{activation:""},t))}}}),Eg,kg,Cg,C_,A_,p2=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),Eg=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),s=t.blockSize/8*t.bits,a=e[1];if(!Z.areEqual(a.dims,[t.n,n,s]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let o=e[2].dims;if(Z.size(o)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let u=e[3].dims,c=t.n*(t.bits===8?n:Math.floor((n*t.bits+7)/8));if(Z.size(u)!==c)throw new Error("zeroPoints input size error.")}},kg=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],s=t.k,a=t.n,o=r.slice(0,i-2),u=Z.size(o),c=e[1].dims[2]/4,m=e[0].dataType,f=et(t.k),g=et(c),_=et(a),v=o.concat([n,a]),S=n>1&&a/_%2===0?2:1,k=Z.size(v)/_/S,E=64,I=[],O=[u,n,s/f],z=Z.convertShape(e[1].dims).slice();z.splice(-1,1,c/g),I.push(...be(O)),I.push(...be(z)),I.push(...be(e[2].dims)),e.length===4&&I.push(...be(Z.convertShape(e[3].dims)));let R=[u,n,a/_];I.push(...be(R));let N=T=>{let $=O.length,P=re("a",e[0].dataType,$,f),F=re("b",12,z.length,g),J=re("scales",e[2].dataType,e[2].dims.length),H=[P,F,J],L=e.length===4?re("zero_points",12,e[3].dims.length):void 0;L&&H.push(L);let M=R.length,ne=ge("output",e[0].dataType,M,_),te=ht(e[0].dataType),ie=(()=>{switch(f){case 1:return`array<${te}, 8>`;case 2:return`mat4x2<${te}>`;case 4:return`mat2x4<${te}>`;default:throw new Error(`${f}-component is not supported.`)}})(),me=Math.floor(32/t.bits),U=Math.floor(me/8),j=()=>{let X="";for(let Y=0;Y<U;Y++){let pe=Y*t.bits*4,Ce=pe+t.bits;X+=`
          // reuse a data (pass ${Y})
            var input_offset${Y>0?Y:""} = ${Y===0?P.indicesToOffset(`${P.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${Y>0?Y:""}: ${ie};
            for (var j${Y>0?Y:""}: u32 = 0; j${Y>0?Y:""} < ${8/f}; j${Y>0?Y:""}++) {
              a_data${Y>0?Y:""}[j${Y>0?Y:""}] = ${P.getByOffset(`input_offset${Y>0?Y:""}`)};
              input_offset${Y>0?Y:""}++;
            }
          `;for(let Se=0;Se<_*S;Se++)X+=`
            b_value = ${g===1?`b${Se}_data`:`b${Se}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${Y*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${pe}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${Ce}u) & b_mask);`}
            b_quantized_values = ${ie}(${Array.from({length:4},($e,ce)=>`${te}(b_value_lower[${ce}]), ${te}(b_value_upper[${ce}])`).join(", ")});
            b_dequantized_values = ${f===1?`${ie}(${Array.from({length:8},($e,ce)=>`(b_quantized_values[${ce}] - ${L?`zero_point${Se}`:"zero_point"}) * scale${Se}`).join(", ")});`:`(b_quantized_values - ${ie}(${Array(8).fill(`${L?`zero_point${Se}`:"zero_point"}`).join(",")})) * scale${Se};`};
            workgroup_shared[local_id.x * ${S} + ${Math.floor(Se/_)}]${_>1?`[${Se%_}]`:""} += ${Array.from({length:8/f},($e,ce)=>`${f===1?`a_data${Y>0?Y:""}[${ce}] * b_dequantized_values[${ce}]`:`dot(a_data${Y>0?Y:""}[${ce}], b_dequantized_values[${ce}])`}`).join(" + ")};
          `}return X},q=()=>{let X=`
            var col_index = col * ${_};
            ${L?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${te}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let Y=0;Y<_*S;Y++)X+=`
            let scale${Y} = ${J.getByOffset("col_index * nBlocksPerCol + block")};
            ${L?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${L.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${Y} = ${te}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return X},K=()=>{let X=`col_index = col * ${_};`;for(let Y=0;Y<_*S;Y++)X+=`
            let b${Y}_data = ${F.getByIndices(`${F.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return X+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${ie};
            var b_dequantized_values: ${ie};`,X};return`
        var<workgroup> workgroup_shared: array<${ne.type.value}, ${S*E}>;
        ${T.declareVariables(...H,ne)}
        ${T.mainStart([E,1,1])}
          let output_indices = ${ne.offsetToIndices(`(global_idx / ${E}) * ${S}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${E}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/f};
            ${q()}
            for (var word: u32 = 0; word < ${c}; word += ${g}) {
              ${K()}
              for (var i: u32 = 0; i < ${g}; i++) {
                ${j()}
                word_offset += ${me/f};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${S}) {
            var output_value: ${ne.type.value} = ${ne.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${E}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${S};
            }
            ${ne.setByIndices(`${ne.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${f};${g};${_};${S};${E}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:v,dataType:m}],dispatchGroup:{x:k},programUniforms:I}),getShaderSource:N}},Cg=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],s=t.k,a=t.n,o=r.slice(0,i-2),u=Z.size(o),c=e[1].dims[2]/4,m=e[0].dataType,f=et(t.k),g=et(c),_=o.concat([n,a]),v=128,S=a%8===0?8:a%4===0?4:1,k=v/S,E=Math.floor(32/t.bits),I=k*g*E,O=I/f,z=I/t.blockSize,R=Z.size(_)/S,N=[],T=[u,n,s/f],$=Z.convertShape(e[1].dims).slice();$.splice(-1,1,c/g),N.push(...be(T)),N.push(...be($)),N.push(...be(e[2].dims)),e.length===4&&N.push(...be(Z.convertShape(e[3].dims)));let P=[u,n,a];N.push(...be(P));let F=J=>{let H=T.length,L=re("a",e[0].dataType,H,f),M=re("b",12,$.length,g),ne=re("scales",e[2].dataType,e[2].dims.length),te=[L,M,ne],ie=e.length===4?re("zero_points",12,e[3].dims.length):void 0;ie&&te.push(ie);let me=P.length,U=ge("output",e[0].dataType,me),j=ht(e[0].dataType),q=()=>{switch(f){case 1:return`
          let a_data0 = vec4<${j}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${j}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${j}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${j}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${f}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${L.type.value}, ${O}>;
        var<workgroup> inter_results: array<array<${U.type.value}, ${k}>, ${S}>;
        ${J.declareVariables(...te,U)}
        ${J.mainStart([k,S,1])}
          let output_indices = ${U.offsetToIndices(`workgroup_index * ${S}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${z} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${O};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${O}; a_offset += ${v})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${L.getByIndices(`${L.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${L.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${z} + local_id.x;
            ${ie?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${ie.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${j}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${j}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${ne.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${M.getByIndices(`${M.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/f};
            for (var i: u32 = 0; i < ${g}; i++) {
              let b_value = ${g===1?"b_data":"b_data[i]"};
              ${(()=>{let K=Math.floor(E/8),X="";for(let Y=0;Y<K;Y++){let pe=Y*t.bits*4,Ce=pe+t.bits;X+=`
              ${q()}
              {${t.bits===2?`
                let half_word = b_value >> ${Y*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${pe}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${Ce}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${j}>(${Array.from({length:4},(Se,$e)=>`${j}(b_value_lower[${$e}]), ${j}(b_value_upper[${$e}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${j}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(Se,$e)=>`${`dot(a_data${$e}, b_dequantized_values[${$e}])`}`).join(" + ")};
              }
              word_offset += ${8/f};`}return X})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${S}) {
            var output_value: ${U.type.value} = ${U.type.value}(0);
            for (var b = 0u; b < ${k}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${U.setByIndices(`${U.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${f};${g};${k};${S}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:m}],dispatchGroup:{x:R},programUniforms:N}),getShaderSource:F}},C_=(e,t)=>{Eg(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Cg(e.inputs,t)):e.compute(kg(e.inputs,t))},A_=e=>We(e)}),Ag,Og,zg,Rg,Mg,Bg,Dg,Ng,O_,f2=ae(()=>{"use strict";Te(),ke(),Oe(),Ag=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Og=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
            k = i32(${e.indicesGet("indices",n)}) - ${ye("uniforms.pads",n,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${ye("uniforms.x_shape",n,t)})) {
              break;
            }
            offset += k * i32(${ye("uniforms.x_strides",n,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},zg=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${ye("uniforms.pads",n,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${ye("uniforms.x_shape",n,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${ye("uniforms.x_shape",n,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${ye("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Rg=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${ye("uniforms.pads",n,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${ye("uniforms.x_shape",n,t)})) {
                  k = i32(${ye("uniforms.x_shape",n,t)}) - 1;
                }
                offset += k * i32(${ye("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Mg=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${ye("uniforms.pads",n,r)};
                if (k < 0)  {
                  k += i32(${ye("uniforms.x_shape",n,t)}]);
                }
                if (k >= i32(${ye("uniforms.x_shape",n,t)})) {
                  k -= i32(${ye("uniforms.x_shape",n,t)});
                }
                offset += k * i32(${ye("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Bg=(e,t,r)=>{switch(r.mode){case 0:return Og(e,t,r.pads.length);case 1:return zg(e,t,r.pads.length);case 2:return Rg(e,t,r.pads.length);case 3:return Mg(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Dg=(e,t)=>{let r=Z.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,n=Z.size(r),s=[{type:12,data:n},{type:6,data:t.pads}],a=e.length>=3&&e[2].data;t.mode===0&&s.push({type:a?e[2].dataType:1,data:t.value}),s.push(...be(e[0].dims,r));let o=["rank"],u=c=>{let m=ge("output",e[0].dataType,r.length),f=re("x",e[0].dataType,i.length),g=f.type.value,_=Bg(m,i.length,t),v=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&v.push({name:"constant_value",type:a?g:"f32"}),`
            ${c.registerUniforms(v).declareVariables(f,m)}
            ${c.mainStart()}
            ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${m.offsetToIndices("global_idx")};

            var value = ${g}(0);
            ${_}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${a}`,inputDependencies:o},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(Z.size(r)/64)},programUniforms:s}),getShaderSource:u}},Ng=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,s=new Int32Array(2*n).fill(0);if(e.length>=4){let o=e[3].getBigInt64Array();for(let u=0;u<o.length;u++)s[Number(o[u])]=Number(r[u]),s[Number(o[u])+n]=Number(r[u+o.length])}else r.forEach((o,u)=>s[Number(u)]=Number(o));let a=[];return s.forEach(o=>a.push(o)),{mode:t.mode,value:i,pads:a}}else return t},O_=(e,t)=>{Ag(e.inputs);let r=Ng(e.inputs,t);e.compute(Dg(e.inputs,r),{inputs:[0]})}}),$a,kd,Cd,Ad,Od,Ug,Pg,zd,Rd,z_,R_,Md,M_,B_,Bd,D_,N_,U_,P_,h2=ae(()=>{"use strict";Ht(),Te(),ke(),Oe(),$a=e=>{if(Xe.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},kd=(e,t,r)=>{let i=t.format==="NHWC",n=e.dims.slice();i&&n.splice(1,0,n.pop());let s=Object.hasOwnProperty.call(t,"dilations"),a=t.kernelShape.slice(),o=t.strides.slice(),u=s?t.dilations.slice():[],c=t.pads.slice();Io.adjustPoolAttributes(r,n,a,o,u,c);let m=Io.computePoolOutputShape(r,n,o,u,a,c,t.autoPad,t.ceilMode),f=Object.assign({},t);s?Object.assign(f,{kernelShape:a,strides:o,pads:c,dilations:u,cacheKey:t.cacheKey}):Object.assign(f,{kernelShape:a,strides:o,pads:c,cacheKey:t.cacheKey});let g=m.slice();return g.push(g.splice(1,1)[0]),[f,i?g:m]},Cd=(e,t)=>{let r=t.format==="NHWC",i=Z.size(e),n=Z.size(t.kernelShape),s=[{type:12,data:i},{type:12,data:n}],a=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let o=t.kernelShape[t.kernelShape.length-1],u=t.strides[t.strides.length-1],c=t.pads[t.pads.length/2-1],m=t.pads[t.pads.length-1],f=!!(c+m);s.push({type:12,data:o},{type:12,data:u},{type:12,data:c},{type:12,data:m}),a.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let g=!1;if(t.kernelShape.length===2){let _=t.kernelShape[t.kernelShape.length-2],v=t.strides[t.strides.length-2],S=t.pads[t.pads.length/2-2],k=t.pads[t.pads.length-2];g=!!(S+k),s.push({type:12,data:_},{type:12,data:v},{type:12,data:S},{type:12,data:k}),a.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[s,a,!0,f,g]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let o=Z.computeStrides(t.kernelShape);s.push({type:12,data:o},{type:12,data:t.pads},{type:12,data:t.strides}),a.push({name:"kernelStrides",type:"u32",length:o.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let u=t.pads.reduce((c,m)=>c+m);return[s,a,!!u,!1,!1]}},Ad=(e,t,r,i,n,s,a,o,u,c,m,f)=>{let g=n.format==="NHWC",_=t.type.value,v=ge("output",t.type.tensor,i);if(n.kernelShape.length<=2){let S="",k="",E="",I=r-(g?2:1);if(m?S=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${I}] < 0 || xIndices[${I}]
                      >= uniforms.x_shape[${I}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${s}
                }`:S=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${s}
                }`,n.kernelShape.length===2){let O=r-(g?3:2);f?k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${O}] = indices[${O}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${O}] < 0 || xIndices[${O}] >= uniforms.x_shape[${O}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${O}] = indices[${O}] * uniforms.sh - uniforms.phStart + j;
                `,E=`
              }
            `}return`
            ${e.registerUniforms(u).declareVariables(t,v)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${v.offsetToIndices("global_idx")};
              var xIndices = ${v.offsetToIndices("global_idx")};

              var value = ${_}(${o});
              var pad = 0;
              ${k}
              ${S}
              ${E}
              ${a}

              output[global_idx] = value;
            }`}else{if(g)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let S=n.kernelShape.length,k=n.pads.length,E="";return c?E=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${s}
              }`:E=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${s}
            `,`
            ${e.registerUniforms(u).declareVariables(t,v)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${v.offsetToIndices("global_idx")};
              var xIndices = ${v.offsetToIndices("global_idx")};

              var offsets: array<u32, ${S}>;

              var value = ${_}(${o});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${S-1}u; j++) {
                  offsets[j] = offset / ${ye("uniforms.kernelStrides","j",S)};
                  offset -= offsets[j] * ${ye("uniforms.kernelStrides","j",S)};
                }
                offsets[${S-1}] = offset;

                isPad = false;
                for (var j = ${r-S}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${ye("uniforms.strides",`j - ${r-S}u`,S)}
                    + offsets[j - ${r-S}u] - ${ye("uniforms.pads","j - 2u",k)};
                  ${E}
              }
              ${a}

              output[global_idx] = value;
            }`}},Od=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Ug=e=>`${Od(e)};${e.countIncludePad}`,Pg=e=>`${Od(e)};${e.storageOrder};${e.dilations}`,zd=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),Rd=(e,t,r,i)=>{let[n,s]=kd(t,i,r),a=re("x",t.dataType,t.dims.length),o=a.type.value,u="value += x_val;",c="";n.countIncludePad?c+=`value /= ${o}(uniforms.kernelSize);`:c+=`value /= ${o}(i32(uniforms.kernelSize) - pad);`;let[m,f,g,_,v]=Cd(s,n);m.push(...be(t.dims,s));let S=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${g};${_};${v}`,inputDependencies:S},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(Z.size(s)/64)},programUniforms:m}),getShaderSource:k=>Ad(k,a,t.dims.length,s.length,n,u,c,0,f,g,_,v)}},z_=e=>{let t=e.count_include_pad!==0,r=zd(e);if(r.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:Ug(i)}},R_=(e,t)=>{$a(e.inputs),e.compute(Rd("AveragePool",e.inputs[0],!1,t))},Md={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},M_=e=>{let t=e.format;return{format:t,...Md,cacheKey:t}},B_=(e,t)=>{$a(e.inputs),e.compute(Rd("GlobalAveragePool",e.inputs[0],!0,t))},Bd=(e,t,r,i)=>{let[n,s]=kd(t,i,r),a=`
      value = max(x_val, value);
    `,o="",u=re("x",t.dataType,t.dims.length),c=["rank"],[m,f,g,_,v]=Cd(s,n);return m.push(...be(t.dims,s)),{name:e,shaderCache:{hint:`${i.cacheKey};${g};${_};${v}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:s,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(Z.size(s)/64)},programUniforms:m}),getShaderSource:S=>Ad(S,u,t.dims.length,s.length,n,a,o,t.dataType===10?-65504:-1e5,f,g,_,v)}},D_=(e,t)=>{$a(e.inputs),e.compute(Bd("MaxPool",e.inputs[0],!1,t))},N_=e=>{let t=e.storage_order,r=e.dilations,i=zd(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let n={storageOrder:t,dilations:r,...i,cacheKey:""};return{...n,cacheKey:Pg(n)}},U_=e=>{let t=e.format;return{format:t,...Md,cacheKey:t}},P_=(e,t)=>{$a(e.inputs),e.compute(Bd("GlobalMaxPool",e.inputs[0],!0,t))}}),Lg,Wg,L_,W_,m2=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),Lg=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,s)=>s===t.axis||n===e[0].dims[s]).reduce((n,s)=>n&&s,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Wg=(e,t)=>{let r=Z.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,n=i===3,s=e[0].dims,a=e[1].dataType,o=Z.size(s),u=i===3||i===2,c=u?[Math.ceil(Z.size(e[0].dims)/4)]:e[0].dims,m=e[1].dims,f=e.length>2?e[2]:void 0,g=f?u?[Math.ceil(Z.size(f.dims)/4)]:f.dims:void 0,_=m.length===0||m.length===1&&m[0]===1,v=_===!1&&m.length===1,S=et(o),k=_&&(!u||S===4),E=k?S:1,I=k&&!u?S:1,O=re("input",u?12:i,c.length,I),z=re("scale",a,m.length),R=f?re("zero_point",u?12:i,g.length):void 0,N=ge("output",a,s.length,E),T=[O,z];R&&T.push(R);let $=[c,m];f&&$.push(g);let P=[{type:12,data:o/E},{type:12,data:r},{type:12,data:t.blockSize},...be(...$,s)],F=J=>{let H=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${J.registerUniforms(H).declareVariables(...T,N)}
      ${J.mainStart()}
          ${J.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${N.offsetToIndices("global_idx")};

          // Set input x
          ${u?`
            let input = ${O.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${E===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${O.getByOffset("global_idx")};`};

          // Set scale input
          ${_?`let scale_value= ${z.getByOffset("0")}`:v?`
            let scale_index = ${N.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${z.getByOffset("scale_index")};`:`
            var scale_indices: ${z.type.indices} = output_indices;
            let index = ${z.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${z.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${z.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${R?_?u?`
                let zero_point_input = ${R.getByOffset("0")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${R.getByOffset("0")}`:v?u?`
                let zero_point_index = ${N.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${R.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${N.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${R.getByOffset("zero_point_index")};`:u?`
                let zero_point_offset = ${z.indicesToOffset("scale_indices")};
                let zero_point_input = ${R.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${R.getByIndices("scale_indices")};`:`let zero_point_value = ${u?n?"i32":"u32":O.type.value}(0);`};
      // Compute and write output
      ${N.setByOffset("global_idx",`${N.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:R?["rank","rank","rank"]:["rank","rank"]},getShaderSource:F,getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(o/E/64),y:1,z:1},programUniforms:P})}},L_=(e,t)=>{Lg(e.inputs,t),e.compute(Wg(e.inputs,t))},W_=e=>We({axis:e.axis,blockSize:e.blockSize})}),Gg,qg,G_,g2=ae(()=>{"use strict";Ht(),Te(),Oe(),Gg=(e,t,r)=>{let i=e===t,n=e<t&&r<0,s=e>t&&r>0;if(i||n||s)throw new Error("Range these inputs' contents are invalid.")},qg=(e,t,r,i)=>{let n=Math.abs(Math.ceil((t-e)/r)),s=[n],a=n,o=[{type:12,data:a},{type:i,data:e},{type:i,data:r},...be(s)],u=c=>{let m=ge("output",i,s.length),f=m.type.value,g=[{name:"outputSize",type:"u32"},{name:"start",type:f},{name:"delta",type:f}];return`
        ${c.registerUniforms(g).declareVariables(m)}
        ${c.mainStart()}
        ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${f}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:u,getRunData:()=>({outputs:[{dims:s,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:o})}},G_=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),Xe.webgpu.validateInputContent&&Gg(t,r,i),e.compute(qg(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),Vg,Fg,q_,V_,y2=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),Vg=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let n=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,s=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${n}bitcast<${i}>(oldValue) + (${r})${s}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${n}max(bitcast<f32>(oldValue), (${r}))${s}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${n}min(bitcast<${i}>(oldValue), (${r}))${s}`;case"mul":return`${n}(bitcast<${i}>(oldValue) * (${r}))${s}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Fg=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r,s=1,a=Math.ceil(Z.sizeToDimension(i,i.length-1)/s),o=i[i.length-1],u=Z.sizeFromDimension(r,o),c=[{type:12,data:a},{type:12,data:o},{type:12,data:u},...be(e[1].dims,e[2].dims,n)],m=f=>{let g=re("indices",e[1].dataType,e[1].dims.length),_=re("updates",e[2].dataType,e[2].dims.length,s),v=t.reduction!=="none"&&t.reduction!==""?mb("output",e[0].dataType,n.length):ge("output",e[0].dataType,n.length,s);return`
      ${f.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,_,v)}
      ${f.mainStart()}
        ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${Vg(t.reduction,"output[data_offset + i]","value",v.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}),getShaderSource:m}},q_=e=>We({reduction:e.reduction}),V_=(e,t)=>{e.compute(Fg(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Hg,jg,Kg,Dd,Yg,Xg,Zg,Qg,Jg,e0,t0,r0,Nd,n0,i0,a0,s0,o0,F_,H_,b2=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),Hg=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},jg=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((n,s)=>i[n]=e[s]),i},Kg=(e,t,r,i,n,s)=>{let[a,o,u]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],c=e[0].dims.length;if(a>0&&e.length>a&&e[a].dims.length>0)e[a].getFloat32Array().forEach(m=>s.push(m));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(o>0&&e.length>o&&e[o].dims.length===1&&e[o].dims[0]>0){if(e[o].getFloat32Array().forEach(m=>i.push(m)),i.length!==0&&i.length!==c&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Hg(i,t),t.axes.length>0&&jg(i,t.axes,c).forEach((m,f)=>i[f]=m)}if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0&&(e[u].getBigInt64Array().forEach(m=>n.push(Number(m))),n.length!==0&&n.length!==c&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof n<"u"&&i.length>0&&n.length>c)throw new Error("Resize requires only of scales or sizes to be specified")},Dd=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,Yg=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Dd("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Dd("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Xg=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Zg=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),n=e.length===0?i:e.slice();return t.length>0?(t.forEach((s,a)=>{i[s]=n[a],i[a+r]=n[t.length+a]}),i):n},Qg=(e,t,r,i)=>{let n=[];if(r.length>0)if(i.length>0){if(e.forEach(s=>n.push(s)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((s,a)=>n[s]=r[a])}else r.forEach(s=>n.push(s));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");n=e.map((s,a)=>Math.round(s*t[a]))}return n},Jg=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(s=>t[s]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(s=>t[s]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let n=e.slice();return r.axes.length>0?(r.axes.forEach(s=>t[s]=i),r.axes.forEach(s=>n[s]=Math.round(e[s]*t[s]))):(t.fill(i,0,t.length),n.forEach((s,a)=>n[a]=Math.round(s*t[a]))),n},e0=(e,t,r,i,n)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${ye("uniforms.scales","i",i)};
        var roi_low = ${ye("uniforms.roi","i",n)};
        var roi_hi = ${ye("uniforms.roi",`i + ${t.length}`,n)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${ye("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${ye("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,t0=(e,t,r,i,n,s,a)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${ye("uniforms.scales","i",n)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${ye("uniforms.roi","i",s)};
          var roi_hi = ${ye("uniforms.roi",`i + ${r.length}`,s)};
          var input_shape_i = ${ye("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${ye("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${a} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,r0=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${ye("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,Nd=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",n0=(e,t,r,i,n)=>{let[s,a,o,u]=r.length===2?[-1,0,1,-1]:[0,2,3,1],c=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${c} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",a,`max(0, min(row, ${r[a]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(col, ${r[o]} - 1))`)};
      ${Nd(e,u,s,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${c} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${c} = originalIndices[${a}];
      var col:${c} = originalIndices[${o}];
      ${i?`if (row < 0 || row > (${r[a]} - 1) || col < 0 || col > (${r[o]} - 1)) {
        return ${n};
      }`:""};
      row = max(0, min(row, ${r[a]} - 1));
      col = max(0, min(col, ${r[o]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${u}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${s}])`:"0"};
      var x11: ${c} = getInputValue(batch, channel, row1, col1);
      var x12: ${c} = getInputValue(batch, channel, row1, col2);
      var x21: ${c} = getInputValue(batch, channel, row2, col1);
      var x22: ${c} = getInputValue(batch, channel, row2, col2);
      var dx1: ${c} = abs(row - ${c}(row1));
      var dx2: ${c} = abs(${c}(row2) - row);
      var dy1: ${c} = abs(col - ${c}(col1));
      var dy2: ${c} = abs(${c}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},i0=(e,t,r,i,n,s,a,o,u,c)=>{let m=r.length===2,f=!0,[g,_]=m?[0,1]:f?[2,3]:[1,2],v=e.type.value,S=k=>{let E=k===g?"row":"col";return`
      fn ${E}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${v} {
        var output_index = ${t.indicesGet("output_indices",k)};
        var originalIdx: ${v} = getOriginalCoordinateFromResizedCoordinate(output_index, ${n[k]},
        ${i[k]}, ${r[k]}, ${s[k]}, ${s[k]} + ${r.length});
        var fractOriginalIdx: ${v} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${o} && (originalIdx < 0 || originalIdx > (${r[k]} - 1))) {
          return ${u};
        }
        var data: array<${v}, 4> = array<${v}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${E}: ${v} = originalIdx + ${v}(i);
          if (${E} < 0 || ${E} >= ${r[k]}) {
            ${c?`coefs[i + 1] = 0.0;
                        continue;`:o?`return ${u};`:`${E} = max(0, min(${E}, ${r[k]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",k,`u32(${E})`)};
          data[i + 1] = ${k===g?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${S(g)};
    ${S(_)};
  fn getCubicInterpolationCoefs(s: ${v}) -> array<${v}, 4> {
    var absS = abs(s);
    var coeffs: array<${v}, 4> = array<${v}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${v} = 1.0 - absS;
    var twoMinusAbsS: ${v} = 2.0 - absS;
    var onePlusAbsS: ${v} = 1.0 + absS;
    coeffs[0] = ((${a} * onePlusAbsS - 5 * ${a}) * onePlusAbsS + 8 * ${a}) * onePlusAbsS - 4 * ${a};
    coeffs[1] = ((${a} + 2) * absS - (${a} + 3)) * absS * absS + 1;
    coeffs[2] = ((${a} + 2) * oneMinusAbsS - (${a} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${a} * twoMinusAbsS - 5 * ${a}) * twoMinusAbsS + 8 * ${a}) * twoMinusAbsS - 4 * ${a};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${v}, 4>, coefs: array<${v}, 4>) -> ${v} {
    var coefsSum: ${v} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${v} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},a0=(e,t,r,i,n)=>{let[s,a,o,u,c]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],m=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${m} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",a,`max(0, min(depth, ${r[a]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(height, ${r[o]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(width, ${r[u]} - 1))`)};
      ${Nd(e,c,s,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${m} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${m} = originalIndices[${a}];
      var height:${m} = originalIndices[${o}];
      var width:${m} = originalIndices[${u}];
      ${i?`if (depth < 0 || depth > (${r[a]} - 1) || height < 0 || height > (${r[o]} - 1) || width < 0 || (width > ${r[u]} - 1)) {
      return ${n};
        }`:""};

    depth = max(0, min(depth, ${r[a]} - 1));
      height = max(0, min(height, ${r[o]} - 1));
      width = max(0, min(width, ${r[u]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${c}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${s}])`:"0"};

      var x111: ${m} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${m} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${m} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${m} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${m} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${m} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${m} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${m} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${m} = abs(depth - ${m}(depth1));
      var dx2: ${m} = abs(${m}(depth2) - depth);
      var dy1: ${m} = abs(height - ${m}(height1));
      var dy2: ${m} = abs(${m}(height2) - height);
      var dz1: ${m} = abs(width - ${m}(width1));
      var dz2: ${m} = abs(${m}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},s0=(e,t,r,i,n,s)=>{let a=e.dims,o=Zg(s,t.axes,a.length),u=Qg(a,i,n,t.axes),c=i.slice();i.length===0&&(c=a.map((I,O)=>I===0?1:u[O]/I),t.keepAspectRatioPolicy!=="stretch"&&(u=Jg(a,c,t)));let m=ge("output",e.dataType,u.length),f=re("input",e.dataType,a.length),g=Z.size(u),_=a.length===u.length&&a.every((I,O)=>I===u[O]),v=t.coordinateTransformMode==="tf_crop_and_resize",S=t.extrapolationValue,k=f.type.value,E=I=>`
      ${_?"":`
      ${Yg(t.coordinateTransformMode,k)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${r0(f,a)};
              ${Xg(t.nearestMode,r,k)};
              ${t0(f,m,a,u,c.length,o.length,v)};
              `;case"linear":return`
              ${e0(m,a,u,c.length,o.length)};
              ${(()=>{if(a.length===2||a.length===4)return`${n0(f,m,a,v,S)}`;if(a.length===3||a.length===5)return`${a0(f,m,a,v,S)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(a.length===2||a.length===4)return`${i0(f,m,a,u,c,o,t.cubicCoeffA,v,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${I.registerUniform("output_size","u32").registerUniform("scales","f32",c.length).registerUniform("roi","f32",o.length).declareVariables(f,m)}
      ${I.mainStart()}
        ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${_?"output[global_idx] = input[global_idx];":`
        let output_indices = ${m.offsetToIndices("global_idx")};
        var input_indices: ${f.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${f.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${a.length===2||a.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${c.length>0?t.mode==="cubic"?c:c.length:""}|${n.length>0?n:""}|${o.length>0?o:""}|${_}|${t.mode==="nearest"?a.length:a}`,inputDependencies:["rank"]},getShaderSource:E,getRunData:()=>({outputs:[{dims:u,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},{type:1,data:c},{type:1,data:o},...be(a,u)]})}},o0=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},F_=(e,t)=>{let r=[],i=[],n=[],s=o0(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");Kg(e.inputs,t,s,r,i,n),e.compute(s0(e.inputs[0],t,s,r,i,n),{inputs:[0]})},H_=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,n=e.cubicCoeffA,s=e.excludeOutside!==0,a=e.extrapolationValue,o=e.keepAspectRatioPolicy,u=e.mode,c=e.nearestMode===""?"simple":e.nearestMode;return We({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:n,excludeOutside:s,extrapolationValue:a,keepAspectRatioPolicy:o,mode:u,nearestMode:c})}}),u0,l0,j_,w2=ae(()=>{"use strict";Te(),ke(),Oe(),u0=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],s=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==s)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let a=e[3];if(a.dims.length!==1)throw new Error("Beta must be 1D");if(a.dims[a.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let a=e[4];if(a.dims.length!==1)throw new Error("Bias must be 1D");if(a.dims[a.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},l0=(e,t,r,i)=>{let n=t.simplified,s=e[0].dims,a=Z.size(s),o=s,u=a,c=s.slice(-1)[0],m=i?s.slice(0,-1).concat(1):[],f=!n&&e.length>3,g=e.length>4,_=i&&r>1,v=i&&r>2,S=r>3,k=64,E=et(c),I=[{type:12,data:u},{type:12,data:E},{type:12,data:c},{type:1,data:t.epsilon}],O=R=>{let N=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],T=[re("x",e[0].dataType,e[0].dims,E),re("skip",e[1].dataType,e[1].dims,E),re("gamma",e[2].dataType,e[2].dims,E)];f&&T.push(re("beta",e[3].dataType,e[3].dims,E)),g&&T.push(re("bias",e[4].dataType,e[4].dims,E)),T.push(ge("output",e[0].dataType,o,E)),_&&T.push(ge("mean_output",1,m)),v&&T.push(ge("inv_std_output",1,m)),S&&T.push(ge("input_skip_bias_sum",e[0].dataType,o,E));let $=ht(e[0].dataType),P=ht(1,E);return`

      ${R.registerUniforms(N).declareVariables(...T)}
      var<workgroup> sum_shared : array<${P}, ${k}>;
      var<workgroup> sum_squared_shared : array<${P}, ${k}>;

      ${R.mainStart([k,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${k};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${k};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${k-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${g?"bias[offset1d + i]":$+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${S?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Vn($,E,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${k};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Mr("sum",E)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Mr("square_sum",E)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${_?"mean_output[global_idx] = mean;":""}
        ${v?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${$}(mean)`}) *
            ${$}(inv_std_dev) * gamma[offset1d + i]
            ${f?"+ beta[offset1d + i]":""};
        }
      }`},z=[{dims:o,dataType:e[0].dataType}];return r>1&&z.push({dims:m,dataType:1}),r>2&&z.push({dims:m,dataType:1}),r>3&&z.push({dims:s,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${E};${_};${v};${S}`,inputDependencies:e.map((R,N)=>"type")},getShaderSource:O,getRunData:()=>({outputs:z,dispatchGroup:{x:Math.ceil(u/c)},programUniforms:I})}},j_=(e,t)=>{u0(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(l0(e.inputs,t,e.outputCount,!1),{outputs:r})}}),d0,xa,c0,Ud,p0,f0,K_,Y_,_2=ae(()=>{"use strict";Te(),ke(),tt(),Oe(),d0=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},xa=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},c0=(e,t)=>{if(e.length>1){let r=xa(e,1),i=xa(e,2),n=xa(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),We({starts:r,ends:i,axes:n})}else return t},Ud=(e,t,r,i,n)=>{let s=e;return e<0&&(s+=r[i[t]]),n[t]<0?Math.max(0,Math.min(s,r[i[t]]-1)):Math.max(0,Math.min(s,r[i[t]]))},p0=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${ye("uniforms.input_shape","i",r.length)};
            let steps_i = ${ye("uniforms.steps","i",r.length)};
            let signs_i = ${ye("uniforms.signs","i",r.length)};
            let starts_i = ${ye("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,f0=(e,t)=>{let r=e[0].dims,i=Z.size(r),n=t.axes.length>0?Z.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],s=xa(e,4);s.forEach(E=>E!==0||(()=>{throw new Error("step cannot be 0")})),s.length===0&&(s=Array(n.length).fill(1));let a=t.starts.map((E,I)=>Ud(E,I,r,n,s)),o=t.ends.map((E,I)=>Ud(E,I,r,n,s));if(n.length!==a.length||n.length!==o.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let E=0;E<r.length;++E)n.includes(E)||(a.splice(E,0,0),o.splice(E,0,r[E]),s.splice(E,0,1));let u=s.map(E=>Math.sign(E));s.forEach((E,I,O)=>{if(E<0){let z=(o[I]-a[I])/E,R=a[I],N=R+z*s[I];a[I]=N,o[I]=R,O[I]=-E}});let c=r.slice(0);n.forEach((E,I)=>{c[E]=Math.ceil((o[E]-a[E])/s[E])});let m={dims:c,dataType:e[0].dataType},f=ge("output",e[0].dataType,c.length),g=re("input",e[0].dataType,e[0].dims.length),_=Z.size(c),v=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:a.length},{name:"signs",type:"i32",length:u.length},{name:"steps",type:"u32",length:s.length}],S=[{type:12,data:_},{type:12,data:a},{type:6,data:u},{type:12,data:s},...be(e[0].dims,c)],k=E=>`
      ${E.registerUniforms(v).declareVariables(g,f)}
        ${p0(g,f,r)}
        ${E.mainStart()}
          ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${f.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${f.setByOffset("global_idx",g.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${u.length}_${a.length}_${s.length}`,inputDependencies:["rank"]},getShaderSource:k,getRunData:()=>({outputs:[m],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:S})}},K_=(e,t)=>{d0(e.inputs,t);let r=c0(e.inputs,t);e.compute(f0(e.inputs,r),{inputs:[0]})},Y_=e=>{let t=e.starts,r=e.ends,i=e.axes;return We({starts:t,ends:r,axes:i})}}),h0,m0,X_,Z_,v2=ae(()=>{"use strict";Te(),ke(),tt(),Br(),Oe(),h0=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},m0=(e,t)=>{let r=e.inputs[0],i=r.dims,n=Z.size(i),s=i.length,a=Z.normalizeAxis(t.axis,s),o=a<i.length-1,u,c=[];o?(c=Array.from({length:s},(T,$)=>$),c[a]=s-1,c[s-1]=a,u=e.compute(Wt(r,c),{inputs:[r],outputs:[-1]})[0]):u=r;let m=u.dims,f=m[s-1],g=n/f,_=et(f),v=f/_,S=64;g===1&&(S=256);let k=(T,$)=>$===4?`max(max(${T}.x, ${T}.y), max(${T}.z, ${T}.w))`:$===2?`max(${T}.x, ${T}.y)`:$===3?`max(max(${T}.x, ${T}.y), ${T}.z)`:T,E=re("x",u.dataType,u.dims,_),I=ge("result",u.dataType,u.dims,_),O=E.type.value,z=ht(u.dataType)==="f32"?`var threadMax = ${O}(-3.4028234663852886e+38f);`:`var threadMax = ${O}(-65504.0h);`,R=T=>`
      var<workgroup> rowMaxShared : ${O};
      var<workgroup> rowSumShared : ${O};
      var<workgroup> threadShared : array<${O}, ${S}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${O} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${O}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${T.registerUniform("packedCols","i32").declareVariables(E,I)}
      ${T.mainStart(S)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${S};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${z}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${O}(${k("threadShared[0]",_)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${O}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${O}(${Mr("threadShared[0]",_)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${O}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,N=e.compute({name:"Softmax",shaderCache:{hint:`${_};${S}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:m,dataType:u.dataType}],dispatchGroup:{x:g},programUniforms:[{type:6,data:v}]}),getShaderSource:R},{inputs:[u],outputs:[o?-1:0]})[0];o&&e.compute(Wt(N,c),{inputs:[N]})},X_=(e,t)=>{h0(e.inputs),m0(e,t)},Z_=e=>We({axis:e.axis})}),Pd,g0,y0,b0,Q_,$2=ae(()=>{"use strict";Te(),ke(),Oe(),Pd=e=>Array.from(e.getBigInt64Array(),Number),g0=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Pd(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},y0=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},b0=(e,t)=>{let r=e[0].dims,i=t??Pd(e[1]),n=y0(r,i),s=Z.size(n),a=e[0].dataType,o=re("input",a,r.length),u=ge("output",a,n.length),c=m=>`
      const inputShape = ${o.indices(...r)};
      ${m.registerUniform("output_size","u32").declareVariables(o,u)}
      ${m.mainStart()}
      ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${u.offsetToIndices("global_idx")};
      var input_indices: ${o.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${o.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${u.indicesGet("output_indices","i")}  % input_dim_i;

        ${o.indicesSet("input_indices","i","input_dim_value")}
      }
      ${u.setByOffset("global_idx",o.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:[{type:12,data:s},...be(e[0].dims,n)]}),getShaderSource:c}},Q_=e=>{g0(e.inputs),e.compute(b0(e.inputs),{inputs:[0]})}}),w0,_0,J_,x2=ae(()=>{"use strict";Te(),ke(),Oe(),w0=(e,t,r,i,n)=>{let s=ge("output_data",n,r.length,4),a=re("a_data",t[1].dataType,t[1].dims.length,4),o=re("b_data",t[2].dataType,t[2].dims.length,4),u=re("c_data",t[0].dataType,t[0].dims.length,4),c,m=(f,g,_)=>`select(${g}, ${f}, ${_})`;if(!i)c=s.setByOffset("global_idx",m(a.getByOffset("global_idx"),o.getByOffset("global_idx"),u.getByOffset("global_idx")));else{let f=(g,_,v="")=>{let S=`a_data[index_a${_}][component_a${_}]`,k=`b_data[index_b${_}][component_b${_}]`,E=`bool(c_data[index_c${_}] & (0xffu << (component_c${_} * 8)))`;return`
            let output_indices${_} = ${s.offsetToIndices(`global_idx * 4u + ${_}u`)};
            let offset_a${_} = ${a.broadcastedIndicesToOffset(`output_indices${_}`,s)};
            let offset_b${_} = ${o.broadcastedIndicesToOffset(`output_indices${_}`,s)};
            let offset_c${_} = ${u.broadcastedIndicesToOffset(`output_indices${_}`,s)};
            let index_a${_} = offset_a${_} / 4u;
            let index_b${_} = offset_b${_} / 4u;
            let index_c${_} = offset_c${_} / 4u;
            let component_a${_} = offset_a${_} % 4u;
            let component_b${_} = offset_b${_} % 4u;
            let component_c${_} = offset_c${_} % 4u;
            ${g}[${_}] = ${v}(${m(S,k,E)});
          `};n===9?c=`
            var data = vec4<u32>(0);
            ${f("data",0,"u32")}
            ${f("data",1,"u32")}
            ${f("data",2,"u32")}
            ${f("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:c=`
            ${f("output_data[global_idx]",0)}
            ${f("output_data[global_idx]",1)}
            ${f("output_data[global_idx]",2)}
            ${f("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(u,a,o,s)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${c}
      }`},_0=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,n=e[1].dataType,s=!(Z.areEqual(t,r)&&Z.areEqual(r,i)),a=t,o=Z.size(t);if(s){let c=Kn.calcShape(Kn.calcShape(t,r,!1),i,!1);if(!c)throw new Error("Can't perform where op on the given tensors");a=c,o=Z.size(a)}let u=Math.ceil(o/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:c=>w0(c,e,a,s,n),getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:Math.ceil(o/64/4)},programUniforms:[{type:12,data:u},...be(i,t,r,a)]})}},J_=e=>{e.compute(_0(e.inputs))}}),ev,T2=ae(()=>{"use strict";N$(),ep(),U$(),P$(),L$(),W$(),G$(),j$(),Y$(),X$(),Z$(),Q$(),J$(),e2(),t2(),r2(),n2(),i2(),a2(),s2(),o2(),u2(),l2(),d2(),c2(),p2(),w_(),f2(),h2(),m2(),g2(),y2(),Jc(),b2(),T_(),w2(),_2(),v2(),$_(),$2(),Br(),tp(),x2(),ev=new Map([["Abs",[Vb]],["Acos",[Fb]],["Acosh",[Hb]],["Add",[Ew]],["ArgMax",[Lb,ic]],["ArgMin",[Pb,ic]],["Asin",[jb]],["Asinh",[Kb]],["Atan",[Yb]],["Atanh",[Xb]],["Attention",[Wb]],["AveragePool",[R_,z_]],["BatchNormalization",[Gb]],["BiasAdd",[qb]],["BiasSplitGelu",[Iw]],["Cast",[Qb,Zb]],["Ceil",[ew]],["Clip",[Jb]],["Concat",[Nw,Uw]],["Conv",[dc,lc]],["ConvTranspose",[Kw,jw]],["Cos",[tw]],["Cosh",[rw]],["CumSum",[Yw,Xw]],["DepthToSpace",[Zw,Qw]],["DequantizeLinear",[L_,W_]],["DFT",[Jw,e_]],["Div",[kw]],["Einsum",[t_,r_]],["Elu",[nw,Ca]],["Equal",[Cw]],["Erf",[iw]],["Exp",[aw]],["Expand",[n_]],["FastGelu",[i_]],["Floor",[sw]],["FusedConv",[dc,lc]],["Gather",[s_,a_]],["GatherElements",[p_,c_]],["GatherBlockQuantized",[l_,d_]],["GatherND",[o_,u_]],["Gelu",[ow]],["Gemm",[h_,f_]],["GlobalAveragePool",[B_,M_]],["GlobalMaxPool",[P_,U_]],["Greater",[Rw]],["GreaterOrEqual",[Bw]],["GridSample",[m_,g_]],["GroupQueryAttention",[S_]],["HardSigmoid",[mw,hw]],["HardSwish",[gw]],["InstanceNormalization",[I_]],["LayerNormalization",[E_]],["LeakyRelu",[uw,Ca]],["Less",[Mw]],["LessOrEqual",[Dw]],["Log",[Tw]],["MatMul",[k_]],["MatMulNBits",[C_,A_]],["MaxPool",[D_,N_]],["Mul",[Aw]],["MultiHeadAttention",[b_,y_]],["Neg",[dw]],["Not",[lw]],["Pad",[O_]],["Pow",[Ow]],["QuickGelu",[Sw,Ca]],["Range",[G_]],["Reciprocal",[cw]],["ReduceMin",[Mb]],["ReduceMean",[Cb]],["ReduceMax",[Rb]],["ReduceSum",[Db]],["ReduceProd",[Bb]],["ReduceL1",[Ab]],["ReduceL2",[Ob]],["ReduceLogSum",[Ub]],["ReduceLogSumExp",[zb]],["ReduceSumSquare",[Nb]],["Relu",[pw]],["Resize",[F_,H_]],["RotaryEmbedding",[x_]],["ScatterND",[V_,q_]],["Sigmoid",[fw]],["Sin",[yw]],["Sinh",[bw]],["Slice",[K_,Y_]],["SkipLayerNormalization",[j_]],["Split",[__,v_]],["Sqrt",[ww]],["Softmax",[X_,Z_]],["Sub",[zw]],["Tan",[_w]],["Tanh",[vw]],["ThresholdedRelu",[xw,Ca]],["Tile",[Q_]],["Transpose",[yb,bb]],["Where",[J_]]])}),tv,S2=ae(()=>{"use strict";Ht(),$r(),Oe(),tv=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,n){or(e.programInfo.name);let s=this.backend.device,a=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let o=[];for(let c of t)o.push({binding:o.length,resource:{buffer:c.buffer}});for(let c of r)o.push({binding:o.length,resource:{buffer:c.buffer}});n&&o.push({binding:o.length,resource:n});let u=s.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:o,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let c={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:u,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(c)}a.setPipeline(e.computePipeline),a.setBindGroup(0,u),a.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),ar(e.programInfo.name)}dispose(){}build(e,t){or(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(c=>{r.features.has(c.feature)&&i.push(`enable ${c.extension};`)});let n=gb(t,this.backend.device.limits),s=e.getShaderSource(n),a=`${i.join(`
`)}
${n.additionalImplementations}
${s}`,o=r.createShaderModule({code:a,label:e.name});Pe("verbose",()=>`[WebGPU] ${e.name} shader code: ${a}`);let u=r.createComputePipeline({compute:{module:o,entryPoint:"main"},layout:"auto",label:e.name});return ar(e.name),{programInfo:e,computePipeline:u,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&i<=n)return[t,r,i];let s=t*r*i,a=Math.ceil(Math.sqrt(s));if(a>n){if(a=Math.ceil(Math.cbrt(s)),a>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[a,a,a]}else return[a,a,1]}}}),rv={};Qn(rv,{WebGpuBackend:()=>nv});var v0,$0,x0,nv,I2=ae(()=>{"use strict";Ht(),Te(),$r(),cb(),B$(),T2(),S2(),v0=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let n=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let s=e[i].dims.length;r.push(`${n};${s}`);break}case"dims":{let s=e[i].dims.join(",");r.push(`${n};${s}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},$0=(e,t,r)=>{var n,s;let i=e.name;return(n=e.shaderCache)!=null&&n.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${v0(t,((s=e.shaderCache)==null?void 0:s.inputDependencies)??new Array(t.length).fill("dims"))}`,i},x0=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},nv=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=o=>t.features.has(o)&&r.push(o)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(i);let s=t,a=t.info??(typeof s.requestAdapterInfo=="function"?await s.requestAdapterInfo():void 0);this.adapterInfo=new x0(a),this.gpuDataManager=hb(this),this.programManager=new tv(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Yc(e.logLevel,!!e.debug),this.device.onuncapturederror=o=>{o.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${o.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){var e;typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&((e=this.env)!=null&&e.webgpu)&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;or(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var i;let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let n=0;n<t.length/2;n++){let s=r[n],a=s.kernelId,o=this.kernels.get(a),u=o.kernelType,c=o.kernelName,m=s.programName,f=s.inputTensorViews,g=s.outputTensorViews,_=t[n*2],v=t[n*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=_);let S=Number(_-this.queryTimeBase),k=Number(v-this.queryTimeBase);if(!Number.isSafeInteger(S)||!Number.isSafeInteger(k))throw new RangeError("incorrect timestamp range");if((i=this.env.webgpu.profiling)!=null&&i.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:f.map(E=>({dims:E.dims,dataType:vr(E.dataType)})),outputsMetadata:g.map(E=>({dims:E.dims,dataType:vr(E.dataType)})),kernelId:a,kernelType:u,kernelName:c,programName:m,startTime:S,endTime:k});else{let E="";f.forEach((O,z)=>{E+=`input[${z}]: [${O.dims}] | ${vr(O.dataType)}, `});let I="";g.forEach((O,z)=>{I+=`output[${z}]: [${O.dims}] | ${vr(O.dataType)}, `}),console.log(`[profiling] kernel "${a}|${u}|${c}|${m}" ${E}${I}start time: ${S} ns, execution time: ${k-S} ns`)}xo("GPU",`${m}::${_}::${v}`)}e.unmap(),this.pendingQueries.delete(e)}),ar()}run(e,t,r,i,n,s){or(e.name);let a=[];for(let I=0;I<t.length;++I){let O=t[I].data;if(O===0)continue;let z=this.gpuDataManager.get(O);if(!z)throw new Error(`no GPU data for input: ${O}`);a.push(z)}let{outputs:o,dispatchGroup:u,programUniforms:c}=e.getRunData(t),m=r.length===0?o.map((I,O)=>O):r;if(m.length!==o.length)throw new Error(`Output size ${m.length} must be equal to ${o.length}.`);let f=[],g=[];for(let I=0;I<o.length;++I){if(!Number.isInteger(m[I])||m[I]<-3||m[I]>=s)throw new Error(`Invalid output index: ${m[I]}`);if(m[I]===-3)continue;let O=m[I]===-1,z=m[I]===-2,R=O||z?n(o[I].dataType,o[I].dims):i(m[I],o[I].dataType,o[I].dims);if(f.push(R),R.data===0)continue;let N=this.gpuDataManager.get(R.data);if(!N)throw new Error(`no GPU data for output: ${R.data}`);if(O&&this.temporaryData.push(N),z){let T=this.kernelPersistentData.get(this.currentKernelId);T||(T=[],this.kernelPersistentData.set(this.currentKernelId,T)),T.push(N)}g.push(N)}if(a.length!==t.length||g.length!==f.length){if(g.length===0)return ar(e.name),f;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let _;if(c){let I=0,O=[];c.forEach(T=>{let $=typeof T.data=="number"?[T.data]:T.data;if($.length===0)return;let P=T.type===10?2:4,F,J;T.type===10?(J=$.length>4?16:$.length>2?8:$.length*P,F=$.length>4?16:P*$.length):(J=$.length<=2?$.length*P:16,F=16),I=Math.ceil(I/J)*J,O.push(I);let H=T.type===10?8:4;I+=$.length>4?Math.ceil($.length/H)*F:$.length*P});let z=16;I=Math.ceil(I/z)*z;let R=new ArrayBuffer(I);c.forEach((T,$)=>{let P=O[$],F=typeof T.data=="number"?[T.data]:T.data;if(T.type===6)new Int32Array(R,P,F.length).set(F);else if(T.type===12)new Uint32Array(R,P,F.length).set(F);else if(T.type===10)new Uint16Array(R,P,F.length).set(F);else if(T.type===1)new Float32Array(R,P,F.length).set(F);else throw new Error(`Unsupported uniform type: ${vr(T.type)}`)});let N=this.gpuDataManager.create(I,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(N.buffer,0,R,0,I),this.gpuDataManager.release(N.id),_={offset:0,size:I,buffer:N.buffer}}let v=this.programManager.normalizeDispatchGroupSize(u),S=v[1]===1&&v[2]===1,k=$0(e,t,S),E=this.programManager.getArtifact(k);if(E||(E=this.programManager.build(e,v),this.programManager.setArtifact(k,E),Pe("info",()=>`[artifact] key: ${k}, programName: ${e.name}`)),c&&E.uniformVariablesInfo){if(c.length!==E.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${E.uniformVariablesInfo.length}, got ${c.length} in program "${E.programInfo.name}".`);for(let I=0;I<c.length;I++){let O=c[I],z=O.type,R=typeof O.data=="number"?1:O.data.length,[N,T]=E.uniformVariablesInfo[I];if(z!==N||R!==T)throw new Error(`Uniform variable ${I} mismatch: expect type ${N} with size ${T}, got type ${z} with size ${R} in program "${E.programInfo.name}".`)}}if(Pe("info",()=>`[ProgramManager] run "${e.name}" (key=${k}) with ${v[0]}x${v[1]}x${v[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let I={kernelId:this.currentKernelId,programName:E.programInfo.name,inputTensorViews:t,outputTensorViews:f};this.pendingKernels.push(I),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(I)}return this.programManager.run(E,a,g,v,_),ar(e.name),f}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let n=ev.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let s={kernelType:e,kernelName:i,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,s)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let n=i.kernelType,s=i.kernelName,a=i.kernelEntry,o=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${s}" is not allowed to be called recursively`);this.currentKernelId=e,o[0]&&(o[1]=o[0](o[1]),o[0]=void 0),Pe("info",()=>`[WebGPU] Start to run kernel "[${n}] ${s}"...`);let u=this.env.debug;this.temporaryData=[];try{return u&&this.device.pushErrorScope("validation"),a(t,o[1]),0}catch(c){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${s}" failed. ${c}`)),1}finally{u&&r.push(this.device.popErrorScope().then(c=>c?`GPU validation error for kernel "[${n}] ${s}": ${c.message}`:null));for(let c of this.temporaryData)this.gpuDataManager.release(c.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let s=n.get(t),a=this.gpuDataManager.registerExternalBuffer(r,i,s);return n.set(t,[a,r]),a}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await tc(this,e,t);return Xc(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){Pe("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){Pe("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){Pe("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let n=this.getComputePassEncoder(),s=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(s.computePipeline),n.setBindGroup(0,s.bindGroup),n.dispatchWorkgroups(...s.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),iv={};Qn(iv,{init:()=>av});var so,T0,av,E2=ae(()=>{"use strict";Te(),$r(),ke(),M$(),so=class sv{constructor(t,r,i,n){this.module=t,this.dataType=r,this.data=i,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=Z.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=Z.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=Z.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=Z.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(Z.size(t)!==Z.size(this.dims))throw new Error("Invalid new shape");return new sv(this.module,this.dataType,this.data,t)}},T0=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let i=e.PTR_SIZE,n=r/e.PTR_SIZE,s=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*n++,s));let a=Number(e.getValue(i*n++,s));this.outputCount=Number(e.getValue(i*n++,s)),this.customDataOffset=Number(e.getValue(i*n++,"*")),this.customDataSize=Number(e.getValue(i*n++,s));let o=[];for(let u=0;u<a;u++){let c=Number(e.getValue(i*n++,s)),m=Number(e.getValue(i*n++,"*")),f=Number(e.getValue(i*n++,s)),g=[];for(let _=0;_<f;_++)g.push(Number(e.getValue(i*n++,s)));o.push(new so(e,c,m,g))}this.inputs=o}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var a;let r=((a=t==null?void 0:t.inputs)==null?void 0:a.map(o=>typeof o=="number"?this.inputs[o]:o))??this.inputs,i=(t==null?void 0:t.outputs)??[],n=(o,u,c)=>new so(this.module,u,this.output(o,c),c),s=(o,u)=>{let c=fn(o,u);if(!c)throw new Error(`Unsupported data type: ${o}`);let m=c>0?this.backend.gpuDataManager.create(c).id:0;return new so(this.module,o,m,u)};return this.backend.run(e,r,i,n,s,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,n=i===4?"i32":"i64",s=this.module.stackAlloc((1+t.length)*i);this.module.setValue(s,t.length,n);for(let a=0;a<t.length;a++)this.module.setValue(s+i*(a+1),t[a],n);return this.module._JsepOutput(this.opKernelContext,e,s)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},av=async(e,t,r,i)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let s=(I2(),Ra(rv)).WebGpuBackend,a=new s;await a.initialize(r,i),n("webgpu",[a,o=>a.alloc(Number(o)),o=>a.free(o),(o,u,c,m=!1)=>{if(m)Pe("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(o)}, dst=${Number(u)}, size=${Number(c)}`),a.memcpy(Number(o),Number(u));else{Pe("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(o)}, gpuDataId=${Number(u)}, size=${Number(c)}`);let f=t.HEAPU8.subarray(Number(o>>>0),Number(o>>>0)+Number(c));a.upload(Number(u),f)}},async(o,u,c)=>{Pe("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${o}, dataOffset=${u}, size=${c}`),await a.download(Number(o),()=>t.HEAPU8.subarray(Number(u)>>>0,Number(u+c)>>>0))},(o,u,c)=>a.createKernel(o,Number(u),c,t.UTF8ToString(t._JsepGetNodeName(Number(u)))),o=>a.releaseKernel(o),(o,u,c,m)=>{Pe("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${c}, kernel=${o}, contextDataOffset=${u}`);let f=new T0(t,a,Number(u));return a.computeKernel(Number(o),f,m)},()=>a.captureBegin(),()=>a.captureEnd(),()=>a.replay()])}else{let s=new fb(r);n("webnn",[s,()=>s.reserveTensorId(),a=>s.releaseTensorId(a),async(a,o,u,c,m)=>s.ensureTensor(a,o,u,c,m),(a,o)=>{s.uploadTensor(a,o)},async(a,o)=>s.downloadTensor(a,o),(a,o)=>s.registerMLContext(a,o),!!r.trace])}}}),S0,op,up,Ar,I0,Ld,Ao,lp,dp,Wd,cp,pp,fp,ov=ae(()=>{"use strict";Ht(),O$(),z$(),Te(),Tn(),Fc(),ob(),S0=(e,t)=>{Ze()._OrtInit(e,t)!==0&&Ve("Can't initialize onnxruntime.")},op=async e=>{S0(e.wasm.numThreads,So(e.logLevel))},up=async(e,t)=>{var i,n;(n=(i=Ze()).asyncInit)==null||n.call(i);let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let s=e.webgpu.powerPreference;if(s!==void 0&&s!=="low-power"&&s!=="high-performance")throw new Error(`Invalid powerPreference setting: "${s}"`);let a=e.webgpu.forceFallbackAdapter;if(a!==void 0&&typeof a!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${a}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:s,forceFallbackAdapter:a}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let s=(E2(),Ra(iv)).init;t==="webgpu"&&await s("webgpu",Ze(),e,r),t==="webnn"&&await s("webnn",Ze(),e)}},Ar=new Map,I0=e=>{let t=Ze(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,n,n+i)!==0&&Ve("Can't get session input/output count.");let s=i===4?"i32":"i64";return[Number(t.getValue(n,s)),Number(t.getValue(n+i,s))]}finally{t.stackRestore(r)}},Ld=(e,t)=>{let r=Ze(),i=r.stackSave(),n=0;try{let s=r.PTR_SIZE,a=r.stackAlloc(2*s);r._OrtGetInputOutputMetadata(e,t,a,a+s)!==0&&Ve("Can't get session input/output metadata.");let o=Number(r.getValue(a,"*"));n=Number(r.getValue(a+s,"*"));let u=r.HEAP32[n/4];if(u===0)return[o,0];let c=r.HEAPU32[n/4+1],m=[];for(let f=0;f<c;f++){let g=Number(r.getValue(n+8+f*s,"*"));m.push(g!==0?r.UTF8ToString(g):Number(r.getValue(n+8+(f+c)*s,"*")))}return[o,u,m]}finally{r.stackRestore(i),n!==0&&r._OrtFree(n)}},Ao=e=>{let t=Ze(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},lp=async(e,t)=>{var f,g,_,v;let r,i,n=Ze();Array.isArray(e)?[r,i]=e:e.buffer===n.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=Ao(e);let s=0,a=0,o=0,u=[],c=[],m=[];try{if([a,u]=await sb(t),(t==null?void 0:t.externalData)&&n.mountExternalData){let $=[];for(let P of t.externalData){let F=typeof P=="string"?P:P.path,J=typeof P=="string"?P:P.data;$.push(Kc(J).then(H=>{n.mountExternalData(F,H)}))}await Promise.all($)}for(let $ of(t==null?void 0:t.executionProviders)??[])if((typeof $=="string"?$:$.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof $!="string"){let P=$,F=P==null?void 0:P.context,J=P==null?void 0:P.gpuDevice,H=P==null?void 0:P.deviceType,L=P==null?void 0:P.powerPreference;F?n.currentContext=F:J?n.currentContext=await n.webnnCreateMLContext(J):n.currentContext=await n.webnnCreateMLContext({deviceType:H,powerPreference:L})}else n.currentContext=await n.webnnCreateMLContext();break}s=await n._OrtCreateSession(r,i,a),(f=n.webgpuOnCreateSession)==null||f.call(n,s),s===0&&Ve("Can't create a session."),(g=n.jsepOnCreateSession)==null||g.call(n),n.currentContext&&(n.webnnRegisterMLContext(s,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[S,k]=I0(s),E=!!(t!=null&&t.enableGraphCapture),I=[],O=[],z=[],R=[],N=[];for(let $=0;$<S;$++){let[P,F,J]=Ld(s,$);P===0&&Ve("Can't get an input name."),c.push(P);let H=n.UTF8ToString(P);I.push(H),z.push(F===0?{name:H,isTensor:!1}:{name:H,isTensor:!0,type:vr(F),shape:J})}for(let $=0;$<k;$++){let[P,F,J]=Ld(s,$+S);P===0&&Ve("Can't get an output name."),m.push(P);let H=n.UTF8ToString(P);O.push(H),R.push(F===0?{name:H,isTensor:!1}:{name:H,isTensor:!0,type:vr(F),shape:J});{if(E&&(t==null?void 0:t.preferredOutputLocation)===void 0){N.push("gpu-buffer");continue}let L=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((_=t==null?void 0:t.preferredOutputLocation)==null?void 0:_[H])??"cpu",M=n.webnnIsGraphOutput;if(L==="cpu"&&M&&M(s,H)){N.push("ml-tensor-cpu-output");continue}if(L!=="cpu"&&L!=="cpu-pinned"&&L!=="gpu-buffer"&&L!=="ml-tensor")throw new Error(`Not supported preferred output location: ${L}.`);if(E&&L!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${L}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);N.push(L)}}let T=null;return N.some($=>$==="gpu-buffer"||$==="ml-tensor"||$==="ml-tensor-cpu-output")&&(o=n._OrtCreateBinding(s),o===0&&Ve("Can't create IO binding."),T={handle:o,outputPreferredLocations:N,outputPreferredLocationsEncoded:N.map($=>$==="ml-tensor-cpu-output"?"ml-tensor":$).map($=>ec($))}),Ar.set(s,[s,c,m,T,E,!1]),[s,I,O,z,R]}catch(S){throw c.forEach(k=>n._OrtFree(k)),m.forEach(k=>n._OrtFree(k)),o!==0&&n._OrtReleaseBinding(o)!==0&&Ve("Can't release IO binding."),s!==0&&n._OrtReleaseSession(s)!==0&&Ve("Can't release session."),S}finally{n._free(r),a!==0&&n._OrtReleaseSessionOptions(a)!==0&&Ve("Can't release session options."),u.forEach(S=>n._free(S)),(v=n.unmountExternalData)==null||v.call(n)}},dp=e=>{var u,c,m;let t=Ze(),r=Ar.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,n,s,a,o]=r;a&&(o&&t._OrtClearBoundOutputs(a.handle)!==0&&Ve("Can't clear bound outputs."),t._OrtReleaseBinding(a.handle)!==0&&Ve("Can't release IO binding.")),(u=t.jsepOnReleaseSession)==null||u.call(t,e),(c=t.webnnOnReleaseSession)==null||c.call(t,e),(m=t.webgpuOnReleaseSession)==null||m.call(t,e),n.forEach(f=>t._OrtFree(f)),s.forEach(f=>t._OrtFree(f)),t._OrtReleaseSession(i)!==0&&Ve("Can't release session."),Ar.delete(e)},Wd=async(e,t,r,i,n,s,a=!1)=>{if(!e){t.push(0);return}let o=Ze(),u=o.PTR_SIZE,c=e[0],m=e[1],f=e[3],g=f,_,v;if(c==="string"&&(f==="gpu-buffer"||f==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(a&&f!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${s} when enableGraphCapture is true.`);if(f==="gpu-buffer"){let E=e[2].gpuBuffer;v=fn(pn(c),m);{let I=o.jsepRegisterBuffer;if(!I)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');_=I(i,s,E,v)}}else if(f==="ml-tensor"){let E=e[2].mlTensor;v=fn(pn(c),m);let I=o.webnnRegisterMLTensor;if(!I)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');_=I(i,E,pn(c),m)}else{let E=e[2];if(Array.isArray(E)){v=u*E.length,_=o._malloc(v),r.push(_);for(let I=0;I<E.length;I++){if(typeof E[I]!="string")throw new TypeError(`tensor data at index ${I} is not a string`);o.setValue(_+I*u,rr(E[I],r),"*")}}else{let I=o.webnnIsGraphInput,O=o.webnnIsGraphOutput;if(c!=="string"&&I&&O){let z=o.UTF8ToString(n);if(I(i,z)||O(i,z)){let R=pn(c);v=fn(R,m),g="ml-tensor";let N=o.webnnCreateTemporaryTensor,T=o.webnnUploadTensor;if(!N||!T)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let $=await N(i,R,m);T($,new Uint8Array(E.buffer,E.byteOffset,E.byteLength)),_=$}else v=E.byteLength,_=o._malloc(v),r.push(_),o.HEAPU8.set(new Uint8Array(E.buffer,E.byteOffset,v),_)}else v=E.byteLength,_=o._malloc(v),r.push(_),o.HEAPU8.set(new Uint8Array(E.buffer,E.byteOffset,v),_)}}let S=o.stackSave(),k=o.stackAlloc(4*m.length);try{m.forEach((I,O)=>o.setValue(k+O*u,I,u===4?"i32":"i64"));let E=o._OrtCreateTensor(pn(c),_,v,k,m.length,ec(g));E===0&&Ve(`Can't create tensor for input/output. session=${i}, index=${s}.`),t.push(E)}finally{o.stackRestore(S)}},cp=async(e,t,r,i,n,s)=>{var H,L,M,ne;let a=Ze(),o=a.PTR_SIZE,u=Ar.get(e);if(!u)throw new Error(`cannot run inference. invalid session id: ${e}`);let c=u[0],m=u[1],f=u[2],g=u[3],_=u[4],v=u[5],S=t.length,k=i.length,E=0,I=[],O=[],z=[],R=[],N=[],T=a.stackSave(),$=a.stackAlloc(S*o),P=a.stackAlloc(S*o),F=a.stackAlloc(k*o),J=a.stackAlloc(k*o);try{[E,I]=ab(s),gn("wasm prepareInputOutputTensor");for(let U=0;U<S;U++)await Wd(r[U],O,R,e,m[t[U]],t[U],_);for(let U=0;U<k;U++)await Wd(n[U],z,R,e,f[i[U]],S+i[U],_);yn("wasm prepareInputOutputTensor");for(let U=0;U<S;U++)a.setValue($+U*o,O[U],"*"),a.setValue(P+U*o,m[t[U]],"*");for(let U=0;U<k;U++)a.setValue(F+U*o,z[U],"*"),a.setValue(J+U*o,f[i[U]],"*");if(g&&!v){let{handle:U,outputPreferredLocations:j,outputPreferredLocationsEncoded:q}=g;if(m.length!==S)throw new Error(`input count from feeds (${S}) is expected to be always equal to model's input count (${m.length}).`);gn("wasm bindInputsOutputs");for(let K=0;K<S;K++){let X=t[K];await a._OrtBindInput(U,m[X],O[K])!==0&&Ve(`Can't bind input[${K}] for session=${e}.`)}for(let K=0;K<k;K++){let X=i[K];(H=n[K])!=null&&H[3]?(N.push(z[K]),a._OrtBindOutput(U,f[X],z[K],0)!==0&&Ve(`Can't bind pre-allocated output[${K}] for session=${e}.`)):a._OrtBindOutput(U,f[X],0,q[X])!==0&&Ve(`Can't bind output[${K}] to ${j[K]} for session=${e}.`)}yn("wasm bindInputsOutputs"),Ar.set(e,[c,m,f,g,_,!0])}(L=a.jsepOnRunStart)==null||L.call(a,c),(M=a.webnnOnRunStart)==null||M.call(a,c);let te;g?te=await a._OrtRunWithBinding(c,g.handle,k,F,E):te=await a._OrtRun(c,P,$,S,J,k,F,E),te!==0&&Ve("failed to call OrtRun().");let ie=[],me=[];gn("wasm ProcessOutputTensor");for(let U=0;U<k;U++){let j=Number(a.getValue(F+U*o,"*"));if(j===z[U]||N.includes(z[U])){ie.push(n[U]),j!==z[U]&&a._OrtReleaseTensor(j)!==0&&Ve("Can't release tensor.");continue}let q=a.stackSave(),K=a.stackAlloc(4*o),X=!1,Y,pe=0;try{a._OrtGetTensorData(j,K,K+o,K+2*o,K+3*o)!==0&&Ve(`Can't access output tensor data on index ${U}.`);let Ce=o===4?"i32":"i64",Se=Number(a.getValue(K,Ce));pe=a.getValue(K+o,"*");let $e=a.getValue(K+o*2,"*"),ce=Number(a.getValue(K+o*3,Ce)),he=[];for(let oe=0;oe<ce;oe++)he.push(Number(a.getValue($e+oe*o,Ce)));a._OrtFree($e)!==0&&Ve("Can't free memory for tensor dims.");let Ie=he.reduce((oe,ue)=>oe*ue,1);Y=vr(Se);let ve=g==null?void 0:g.outputPreferredLocations[i[U]];if(Y==="string"){if(ve==="gpu-buffer"||ve==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let oe=[];for(let ue=0;ue<Ie;ue++){let Fe=a.getValue(pe+ue*o,"*"),lt=a.getValue(pe+(ue+1)*o,"*"),rt=ue===Ie-1?void 0:lt-Fe;oe.push(a.UTF8ToString(Fe,rt))}ie.push([Y,he,oe,"cpu"])}else if(ve==="gpu-buffer"&&Ie>0){let oe=a.jsepGetBuffer;if(!oe)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let ue=oe(pe),Fe=fn(Se,Ie);if(Fe===void 0||!Hc(Y))throw new Error(`Unsupported data type: ${Y}`);X=!0,ie.push([Y,he,{gpuBuffer:ue,download:a.jsepCreateDownloader(ue,Fe,Y),dispose:()=>{a._OrtReleaseTensor(j)!==0&&Ve("Can't release tensor.")}},"gpu-buffer"])}else if(ve==="ml-tensor"&&Ie>0){let oe=a.webnnEnsureTensor,ue=a.webnnIsGraphInputOutputTypeSupported;if(!oe||!ue)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(fn(Se,Ie)===void 0||!jc(Y))throw new Error(`Unsupported data type: ${Y}`);if(!ue(e,Y,!1))throw new Error(`preferredLocation "ml-tensor" for ${Y} output is not supported by current WebNN Context.`);let Fe=await oe(e,pe,Se,he,!1);X=!0,ie.push([Y,he,{mlTensor:Fe,download:a.webnnCreateMLTensorDownloader(pe,Y),dispose:()=>{a.webnnReleaseTensorId(pe),a._OrtReleaseTensor(j)}},"ml-tensor"])}else if(ve==="ml-tensor-cpu-output"&&Ie>0){let oe=a.webnnCreateMLTensorDownloader(pe,Y)(),ue=ie.length;X=!0,me.push((async()=>{let Fe=[ue,await oe];return a.webnnReleaseTensorId(pe),a._OrtReleaseTensor(j),Fe})()),ie.push([Y,he,[],"cpu"])}else{let oe=Oo(Y),ue=new oe(Ie);new Uint8Array(ue.buffer,ue.byteOffset,ue.byteLength).set(a.HEAPU8.subarray(pe,pe+ue.byteLength)),ie.push([Y,he,ue,"cpu"])}}finally{a.stackRestore(q),Y==="string"&&pe&&a._free(pe),X||a._OrtReleaseTensor(j)}}g&&!_&&(a._OrtClearBoundOutputs(g.handle)!==0&&Ve("Can't clear bound outputs."),Ar.set(e,[c,m,f,g,_,!1]));for(let[U,j]of await Promise.all(me))ie[U][2]=j;return yn("wasm ProcessOutputTensor"),ie}finally{(ne=a.webnnOnRunEnd)==null||ne.call(a,c),a.stackRestore(T),O.forEach(te=>a._OrtReleaseTensor(te)),z.forEach(te=>a._OrtReleaseTensor(te)),R.forEach(te=>a._free(te)),E!==0&&a._OrtReleaseRunOptions(E),I.forEach(te=>a._free(te))}},pp=e=>{let t=Ze(),r=Ar.get(e);if(!r)throw new Error("invalid session id");let i=r[0],n=t._OrtEndProfiling(i);n===0&&Ve("Can't get an profile file name."),t._OrtFree(n)},fp=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),Or,Ct,Ln,Ta,Sa,oo,Gd,uo,on,un,E0,uv,lv,dv,cv,pv,fv,hv,mv=ae(()=>{"use strict";Ht(),ov(),Tn(),qc(),Or=()=>!!Xe.wasm.proxy&&typeof document<"u",Ln=!1,Ta=!1,Sa=!1,uo=new Map,on=(e,t)=>{let r=uo.get(e);r?r.push(t):uo.set(e,[t])},un=()=>{if(Ln||!Ta||Sa||!Ct)throw new Error("worker not ready")},E0=e=>{switch(e.data.type){case"init-wasm":Ln=!1,e.data.err?(Sa=!0,Gd[1](e.data.err)):(Ta=!0,Gd[0]()),oo&&(URL.revokeObjectURL(oo),oo=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=uo.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},uv=async()=>{if(!Ta){if(Ln)throw new Error("multiple calls to 'initWasm()' detected.");if(Sa)throw new Error("previous call to 'initWasm()' failed.");if(Ln=!0,Or())return new Promise((e,t)=>{Ct==null||Ct.terminate(),nb().then(([r,i])=>{try{Ct=i,Ct.onerror=s=>t(s),Ct.onmessage=E0,Gd=[e,t];let n={type:"init-wasm",in:Xe};!n.in.wasm.wasmPaths&&(r||Jd)&&(n.in.wasm.wasmPaths={wasm:new URL("ort-wasm-simd-threaded.jsep.wasm",self.location.href).href}),Ct.postMessage(n),oo=r}catch(n){t(n)}},t)});try{await Vc(Xe.wasm),await op(Xe),Ta=!0}catch(e){throw Sa=!0,e}finally{Ln=!1}}},lv=async e=>{if(Or())return un(),new Promise((t,r)=>{on("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:Xe}};Ct.postMessage(i)});await up(Xe,e)},dv=async e=>Or()?(un(),new Promise((t,r)=>{on("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};Ct.postMessage(i,[e.buffer])})):Ao(e),cv=async(e,t)=>{if(Or()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return un(),new Promise((r,i)=>{on("create",[r,i]);let n={type:"create",in:{model:e,options:{...t}}},s=[];e instanceof Uint8Array&&s.push(e.buffer),Ct.postMessage(n,s)})}else return lp(e,t)},pv=async e=>{if(Or())return un(),new Promise((t,r)=>{on("release",[t,r]);let i={type:"release",in:e};Ct.postMessage(i)});dp(e)},fv=async(e,t,r,i,n,s)=>{if(Or()){if(r.some(a=>a[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(a=>a))throw new Error("pre-allocated output tensor is not supported for proxy.");return un(),new Promise((a,o)=>{on("run",[a,o]);let u=r,c={type:"run",in:{sessionId:e,inputIndices:t,inputs:u,outputIndices:i,options:s}};Ct.postMessage(c,fp(u))})}else return cp(e,t,r,i,n,s)},hv=async e=>{if(Or())return un(),new Promise((t,r)=>{on("end-profiling",[t,r]);let i={type:"end-profiling",in:e};Ct.postMessage(i)});pp(e)}}),qd,k0,gv,k2=ae(()=>{"use strict";Ht(),mv(),Te(),Gc(),ob(),qd=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},k0=e=>{switch(e[3]){case"cpu":return new ir(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Hc(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:n}=e[2];return ir.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:n})}case"ml-tensor":{let t=e[0];if(!jc(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:n}=e[2];return ir.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},gv=class{async fetchModelAndCopyToWasmMemory(e){return dv(await Kc(e))}async loadModel(e,t){or();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await cv(r,t),ar()}async dispose(){return pv(this.sessionId)}async run(e,t,r){or();let i=[],n=[];Object.entries(e).forEach(f=>{let g=f[0],_=f[1],v=this.inputNames.indexOf(g);if(v===-1)throw new Error(`invalid input '${g}'`);i.push(_),n.push(v)});let s=[],a=[];Object.entries(t).forEach(f=>{let g=f[0],_=f[1],v=this.outputNames.indexOf(g);if(v===-1)throw new Error(`invalid output '${g}'`);s.push(_),a.push(v)});let o=i.map((f,g)=>qd(f,()=>`input "${this.inputNames[n[g]]}"`)),u=s.map((f,g)=>f?qd(f,()=>`output "${this.outputNames[a[g]]}"`):null),c=await fv(this.sessionId,n,o,a,u,r),m={};for(let f=0;f<c.length;f++)m[this.outputNames[a[f]]]=s[f]??k0(c[f]);return ar(),m}startProfiling(){}endProfiling(){hv(this.sessionId)}}}),yv={};Qn(yv,{OnnxruntimeWebAssemblyBackend:()=>fc,initializeFlags:()=>pc,wasmBackend:()=>bv});var pc,fc,bv,C2=ae(()=>{"use strict";Ht(),mv(),k2(),pc=()=>{(typeof Xe.wasm.initTimeout!="number"||Xe.wasm.initTimeout<0)&&(Xe.wasm.initTimeout=0);let e=Xe.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),Xe.wasm.simd=!1),typeof Xe.wasm.proxy!="boolean"&&(Xe.wasm.proxy=!1),typeof Xe.wasm.trace!="boolean"&&(Xe.wasm.trace=!1),typeof Xe.wasm.numThreads!="number"||!Number.isInteger(Xe.wasm.numThreads)||Xe.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)Xe.wasm.numThreads=1;else{let t=typeof navigator>"u"?f$("node:os").cpus().length:navigator.hardwareConcurrency;Xe.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},fc=class{async init(e){pc(),await uv(),await lv(e)}async createInferenceSessionHandler(e,t){let r=new gv;return await r.loadModel(e,t),r}},bv=new fc});Ht();Ht();Ht();var A2="1.30.0";{let e=(C2(),Ra(yv)).wasmBackend;qn("webgpu",e,5),qn("webnn",e,5),qn("cpu",e,10),qn("wasm",e,10)}Object.defineProperty(Xe.versions,"web",{value:A2,enumerable:!0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function C0(e,t,r){const i=e.width,n=e.height,s=t/i,a=r/n,o=Math.min(Math.min(s,a),1.5),u=Math.round(i*o),c=Math.round(n*o),m=Math.ceil(u/32)*32,f=Math.ceil(c/32)*32,g=0,_=0,S=new OffscreenCanvas(m,f).getContext("2d",{willReadFrequently:!0});if(!S)throw new Error("Failed to get 2d context for YuNet preprocessing");S.fillStyle="#000000",S.fillRect(0,0,m,f),S.drawImage(e,g,_,u,c);const E=S.getImageData(0,0,m,f).data,I=new Float32Array(3*m*f),O=m*f;for(let R=0;R<O;R++)I[R]=E[R*4+2],I[O+R]=E[R*4+1],I[2*O+R]=E[R*4+0];return{tensor:new ir("float32",I,[1,3,f,m]),metadata:{sourceWidth:i,sourceHeight:n,modelWidth:u,modelHeight:c,scale:o,offsetX:g,offsetY:_,paddedWidth:m,paddedHeight:f}}}function hp(e,t){const r=Math.max(e[0],t[0]),i=Math.max(e[1],t[1]),n=Math.min(e[0]+e[2],t[0]+t[2]),s=Math.min(e[1]+e[3],t[1]+t[3]),a=Math.max(0,n-r),o=Math.max(0,s-i),u=a*o,c=e[2]*e[3],m=t[2]*t[3];return u/(c+m-u)}function O2(e,t){const r=Math.max(e[0],t[0]),i=Math.max(e[1],t[1]),n=Math.min(e[0]+e[2],t[0]+t[2]),s=Math.min(e[1]+e[3],t[1]+t[3]),a=Math.max(0,n-r),o=Math.max(0,s-i),u=a*o,c=e[2]*e[3],m=t[2]*t[3];return u/Math.min(c,m)}function A0(e,t,r){let i=[];const n=[8,16,32];for(const o of n){const u=e[`cls_${o}`],c=e[`obj_${o}`],m=e[`bbox_${o}`];if(!u||!c||!m)continue;const f=u.data,g=c.data,_=m.data,v=Math.floor(r.paddedWidth/o),S=Math.floor(r.paddedHeight/o);console.log(`[YuNet Dims] stride=${o} bbox=${m.dims.join(",")} obj=${c.dims.join(",")}`);for(let k=0;k<S;k++)for(let E=0;E<v;E++){const I=k*v+E,O=Math.max(0,Math.min(1,f[I])),z=Math.max(0,Math.min(1,g[I])),R=Math.sqrt(O*z);if(R>=t.scoreThreshold){const N=(E+_[I*4+0])*o,T=(k+_[I*4+1])*o,$=Math.exp(_[I*4+2])*o,P=Math.exp(_[I*4+3])*o,F=N-$/2,J=T-P/2;i.push({box:[F,J,$,P],score:R})}}}console.log(`[YUNET DECODER] Raw Candidates found: ${i.length} (Threshold: ${t.scoreThreshold})`),i.sort((o,u)=>u.score-o.score);const s=[],a=new Array(i.length).fill(!0);for(let o=0;o<i.length;o++){if(!a[o])continue;const u=i[o],c=(u.box[0]-r.offsetX)/r.scale,m=(u.box[1]-r.offsetY)/r.scale,f=u.box[2]/r.scale,g=u.box[3]/r.scale,_=Math.max(0,c),v=Math.max(0,m),S=Math.min(r.sourceWidth-_,f-(_-c)),k=Math.min(r.sourceHeight-v,g-(v-m));if(S>=8&&k>=8&&s.push({bbox:[Math.round(_),Math.round(v),Math.round(S),Math.round(k)],confidence:u.score,coordinateSpace:"frame"}),s.length>=t.topK)break;for(let E=o+1;E<i.length;E++)a[E]&&hp(u.box,i[E].box)>t.nmsThreshold&&(a[E]=!1)}return console.log(`[FACEBOX] Final decoded faces after NMS and coordinate clipping: ${s.length}`),s}class z2{constructor(){Ft(this,"tracks",[]);Ft(this,"nextId",1);Ft(this,"MAX_MISSED",0);Ft(this,"IOU_THRESHOLD",.3);Ft(this,"SMOOTHING",0)}update(t){const r=[],i=[...t],n=[...this.tracks];for(let s=0;s<n.length;s++){const a=n[s];let o=0,u=-1;for(let c=0;c<i.length;c++){const m=i[c],f=hp(a.bbox,m.bbox);f>o&&(o=f,u=c)}if(o>=this.IOU_THRESHOLD){const c=i[u],m=this.SMOOTHING,f=[a.bbox[0]*m+c.bbox[0]*(1-m),a.bbox[1]*m+c.bbox[1]*(1-m),a.bbox[2]*m+c.bbox[2]*(1-m),a.bbox[3]*m+c.bbox[3]*(1-m)];r.push({id:a.id,bbox:f,confidence:c.confidence,missedFrames:0,age:a.age+1}),i.splice(u,1),n.splice(s,1),s--}}for(const s of n)s.missedFrames<this.MAX_MISSED&&r.push({...s,missedFrames:s.missedFrames+1,age:s.age+1});for(const s of i)r.push({id:`track_${this.nextId++}`,bbox:s.bbox,confidence:s.confidence,missedFrames:0,age:1});return this.tracks=r,this.tracks.map(s=>({bbox:[Math.round(s.bbox[0]),Math.round(s.bbox[1]),Math.round(s.bbox[2]),Math.round(s.bbox[3])],confidence:s.confidence,coordinateSpace:"frame",face_id:s.id}))}}class R2{constructor(t){Ft(this,"session",null);Ft(this,"config");Ft(this,"usesGpu",!1);Ft(this,"tracker",new z2);this.config=t}async initialize(){if(this.session)return;typeof chrome<"u"&&chrome.runtime&&chrome.runtime.getURL?Xe.wasm.wasmPaths=chrome.runtime.getURL("/onnx/"):typeof window<"u"&&(Xe.wasm.wasmPaths="/onnx/");const t=performance.now();this.session=await Wc.create(this.config.modelPath,{executionProviders:["wasm"]}),console.log(`[YuNet] Model Initialization Time: ${(performance.now()-t).toFixed(2)}ms`)}async dispose(){this.session&&(await this.session.release(),this.session=null)}async detect(t,r,i,n){if(!this.session)throw new Error("YuNetVisionEngine not initialized");const s=performance.now();let a=[];const{tensor:o,metadata:u}=await C0(t,this.config.inputSize[0],this.config.inputSize[1]);performance.now();try{const O={};O[this.session.inputNames[0]]=o;const z=await this.session.run(O);console.log("[YuNet Debug] ONNX Output Shapes:",Object.keys(z).map(R=>{var N;return`${R}: ${(N=z[R])==null?void 0:N.dims}`})),a.push(...A0(z,this.config,u))}finally{o.dispose()}const c=performance.now();let m=0;const f=this.config.inputSize[0],g=this.config.inputSize[1],_=64;if(n&&n.length>0)for(const O of n){if(m>=_)break;const z=Math.max(0,Math.floor(O.x)),R=Math.max(0,Math.floor(O.y)),N=Math.min(t.width-z,Math.ceil(O.w)),T=Math.min(t.height-R,Math.ceil(O.h));if(N<=16||T<=16)continue;const $=Math.round(f*.6),P=Math.round(g*.6);for(let F=R;F<R+T;F+=P)for(let J=z;J<z+N&&!(m>=_);J+=$){let H=Math.min(f,z+N-J),L=Math.min(g,R+T-F);H<32&&J>z&&(J=z+N-f,H=f),L<32&&F>R&&(F=R+T-g,L=g);const M=Math.max(0,J),ne=Math.max(0,F),te=Math.min(t.width-M,H),ie=Math.min(t.height-ne,L);if(te<=16||ie<=16)continue;const me=await createImageBitmap(t,M,ne,te,ie),{tensor:U,metadata:j}=await C0(me,f,g);try{const q={};q[this.session.inputNames[0]]=U;const K=await this.session.run(q),X=A0(K,this.config,j);for(const Y of X){const pe=Math.max(0,-Y.bbox[0]),Ce=Math.max(0,-Y.bbox[1]),Se=Y.bbox[0]+pe,$e=Y.bbox[1]+Ce,ce=Math.min(te-Se,Y.bbox[2]-pe),he=Math.min(ie-$e,Y.bbox[3]-Ce);ce>4&&he>4&&a.push({...Y,bbox:[Se+M,$e+ne,ce,he]})}}finally{U.dispose(),me.close()}m++}}const v=performance.now();a.sort((O,z)=>z.confidence-O.confidence);const S=[],k=new Array(a.length).fill(!0);for(let O=0;O<a.length;O++){if(!k[O])continue;const z=a[O];if(S.push(z),S.length>=this.config.topK)break;for(let R=O+1;R<a.length;R++)if(k[R]){const N=hp(z.bbox,a[R].bbox),T=O2(z.bbox,a[R].bbox);(N>this.config.nmsThreshold||T>.8)&&(k[R]=!1)}}let E=S.map(O=>({...O,bbox:[Math.round(O.bbox[0]*r),Math.round(O.bbox[1]*i),Math.round(O.bbox[2]*r),Math.round(O.bbox[3]*i)]}));E=this.tracker.update(E);const I=performance.now();return console.log(`[YuNet] Multi-scale Inference complete. Total: ${(I-s).toFixed(2)}ms, Pass A: ${(c-s).toFixed(2)}ms, Pass B: ${(v-c).toFixed(2)}ms, Merge & Track: ${(I-v).toFixed(2)}ms. Faces detected: ${E.length}`),E}}const lo={inputSize:[640,640],scoreThreshold:.55,nmsThreshold:.4,topK:5e3};function O0(e,t){const[r,i,n,s]=e,[a,o,u,c]=t,m=Math.max(r,a),f=Math.min(r+n,a+u),g=Math.max(i,o),_=Math.min(i+s,o+c);if(m<f&&g<_){const v=(f-m)*(_-g),S=n*s,k=u*c,E=S+k-v;return v/E}return 0}function M2(e,t,r,i=.5){const n=[...e];for(const s of t){let a=!1;for(const o of n)if(O0(s.bbox,o.bbox)>=i){o.source.includes("VISION")||o.source.push("VISION"),!o.text&&s.text&&(o.text=s.text),a=!0;break}a||n.push(s)}for(const s of r){let a=!1;for(const o of n)if(O0(s.bbox,o.bbox)>=i){o.source.includes("OCR")||o.source.push("OCR"),o.text?o.text!==s.text&&!o.text.includes(s.text)&&(o.text+=` ${s.text}`):o.text=s.text,a=!0;break}a||n.push({region_id:`ocr_reg_${Date.now()}_${Math.floor(Math.random()*1e3)}`,local_key:"ocr_fused",dom_ref:null,source:["OCR"],semantic_type:"text",text:s.text,bbox:s.bbox,confidence:s.confidence,visible:!0,interactable:!1,visual_state:["visible","enabled"],route:"LOW",sensitivity:"none",origin:"",frame_id:"main",page_state_hash:"",timestamp:Date.now()})}return n}let Ia=null,hc=!1;async function B2(){var t;if(Ia)return Ia;if(typeof window>"u"||typeof document>"u")return null;let e="";if(typeof chrome<"u"&&((t=chrome.runtime)!=null&&t.getURL))try{e=chrome.runtime.getURL("models/ui_detector.onnx")}catch{}else e="/models/ui_detector.onnx";try{let r;try{const n=globalThis.fetch;r=await n(e)}catch{return console.debug("[UIDetection] Model not found (this is expected until you drop ui_detector.onnx into public/models/)"),null}if(!r.ok)return console.debug("[UIDetection] Model not found (this is expected until you drop ui_detector.onnx into public/models/)"),null;const i=await r.arrayBuffer();try{Ia=await wo.create(i,{executionProviders:["webgpu"]}),hc=!0}catch(n){console.warn("[UIDetection] WebGPU delegate init failed, falling back to WASM:",n),Ia=await wo.create(i,{executionProviders:["wasm"]}),hc=!1}return Ia}catch(r){return console.warn("[UIDetection] ONNX initialization failed:",r),null}}async function D2(e,t,r,i){const n=[],o=new OffscreenCanvas(640,640).getContext("2d",{willReadFrequently:!0});if(!o)return[];o.drawImage(t,0,0,640,640);const c=o.getImageData(0,0,640,640).data,m=new Float32Array(3*640*640);for(let g=0;g<640*640;g++)m[g]=c[g*4]/255,m[640*640+g]=c[g*4+1]/255,m[2*640*640+g]=c[g*4+2]/255;const f=new nr("float32",m,[1,3,640,640]);try{const g={},_=e.inputNames[0];g[_]=f;const v=await e.run(g),S=e.outputNames[0],k=v[S].data,E=k.length/6,I=["button","input","icon","text_node","image"];for(let O=0;O<E;O++){const z=O*6,R=k[z+4];if(R!==void 0&&R>.5){const N=Math.round(k[z+5]),T=I[N]||"ui_element";let $=k[z+0]/640*t.width,P=k[z+1]/640*t.height,F=k[z+2]/640*t.width,J=k[z+3]/640*t.height;n.push({bbox:[Math.round($*r),Math.round(P*i),Math.round(F*r),Math.round(J*i)],confidence:R,label:T})}}}catch(g){console.warn("[UIDetection] Inference failed:",g)}return n}let co=null;async function N2(){var e;if(!co){const t=typeof chrome<"u"&&((e=chrome.runtime)!=null&&e.getURL)?chrome.runtime.getURL("models/face_detection_yunet_2026may.onnx"):"/models/face_detection_yunet_2026may.onnx";co=new R2({modelPath:t,inputSize:lo.inputSize,scoreThreshold:lo.scoreThreshold,nmsThreshold:lo.nmsThreshold,topK:lo.topK}),await co.initialize()}return co}Qe.wasm.numThreads=4;Qe.wasm.simd=!0;typeof chrome<"u"&&chrome.runtime&&chrome.runtime.getURL?Qe.wasm.wasmPaths=chrome.runtime.getURL("onnx/"):Qe.wasm.wasmPaths="/onnx/";const mp={getBudget(){return{level:"HIGH",backend:"webgpu",max_vision_regions:8,max_pixels:1024*1024,allow_detector:!0,ocr_mode:"fast"}},async perceive(e){var f,g,_,v,S,k,E,I,O,z,R,N,T,$,P,F;let t=[];const r=[];let i=[],n=!1;const s=performance.now();let a=0,o=0;if(e.image_data_url){try{try{const J=await N2();if(J){const H=(e.image_data_url||"").split(",")[1]||"";if(H&&typeof atob<"u"){const L=atob(H),M=new Uint8Array(L.length);for(let me=0;me<L.length;me++)M[me]=L.charCodeAt(me);const ne=e.image_data_url.match(/^data:([^;,]+)/),te=(ne==null?void 0:ne[1])||"image/png",ie=new Blob([M],{type:te});if(typeof createImageBitmap<"u"){const me=await createImageBitmap(ie),U=me.width,j=me.height,q=((f=e.capture)==null?void 0:f.dpr)??1,K=((_=(g=e.capture)==null?void 0:g.viewport)==null?void 0:_.w)??U/q,X=((S=(v=e.capture)==null?void 0:v.viewport)==null?void 0:S.h)??j/q,Y=K/U,pe=X/j,Ce=[];if((k=e.dom)!=null&&k.elements)for(const $e of e.dom.elements)($e.tag==="img"||$e.tag==="canvas"||$e.tag==="video"||$e.has_bg_image||$e.classes&&$e.classes.some(ce=>ce.toLowerCase().includes("avatar")||ce.toLowerCase().includes("profile")))&&Ce.push({x:Math.max(0,$e.bbox[0]/Y),y:Math.max(0,$e.bbox[1]/pe),w:Math.min(U,$e.bbox[2]/Y),h:Math.min(j,$e.bbox[3]/pe)});const Se=performance.now();i=await J.detect(me,Y,pe,Ce),a=performance.now()-Se,me.close(),n=J.usesGpu}}}}catch(J){console.warn("[VisionEngine] YuNet face detection failed or unavailable:",J)}try{const J=await B2();if(J&&typeof createImageBitmap<"u"){const H=(e.image_data_url||"").split(",")[1]||"";if(H&&typeof atob<"u"){const L=atob(H),M=new Uint8Array(L.length);for(let ce=0;ce<L.length;ce++)M[ce]=L.charCodeAt(ce);const ne=e.image_data_url.match(/^data:([^;,]+)/),te=(ne==null?void 0:ne[1])||"image/png",ie=new Blob([M],{type:te}),me=await createImageBitmap(ie),U=me.width,j=me.height,q=((E=e.capture)==null?void 0:E.dpr)??1,K=((O=(I=e.capture)==null?void 0:I.viewport)==null?void 0:O.w)??U/q,X=((R=(z=e.capture)==null?void 0:z.viewport)==null?void 0:R.h)??j/q,Y=K/U,pe=X/j,Ce=performance.now(),Se=await D2(J,me,Y,pe),$e=performance.now()-Ce;a+=$e,Se.forEach((ce,he)=>{t.push({region_id:`ui_comp_${he}`,local_key:`ui_${ce.label}_${he}`,dom_ref:null,source:["VISION"],semantic_type:ce.label,text:null,bbox:ce.bbox,confidence:ce.confidence,visible:!0,interactable:!0,visual_state:["visible","enabled"],route:"HIGH",sensitivity:"none",origin:e.dom.url_origin,frame_id:"main",page_state_hash:e.dom.page_state_hash,timestamp:Date.now()})}),me.close(),hc&&(n=!0)}}}catch(J){console.warn("[VisionEngine] ONNX UI Component detection failed:",J)}}catch(J){console.warn("[VisionEngine] Vision inference failed, falling back...",J)}if(typeof Worker<"u"&&globalThis.__ENABLE_LOCAL_OCR__)try{const J=performance.now(),H=await l$.recognize(e.image_data_url,"eng",{logger:()=>{}});o=performance.now()-J,(T=(N=H.data)==null?void 0:N.words)==null||T.forEach((L,M)=>{var te;const ne=[L.bbox.x0,L.bbox.y0,L.bbox.x1-L.bbox.x0,L.bbox.y1-L.bbox.y0];r.push({text:L.text,bbox:ne,confidence:L.confidence/100,line_id:((te=L.line)==null?void 0:te.id)||M}),t.push({region_id:`ocr_reg_${M}`,local_key:`ocr_${M}`,dom_ref:null,source:["OCR","VISION"],semantic_type:"text",text:L.text,bbox:ne,confidence:L.confidence/100,visible:!0,interactable:!1,visual_state:["visible","enabled"],route:"LOW",sensitivity:"none",origin:e.dom.url_origin,frame_id:"main",page_state_hash:e.dom.page_state_hash,timestamp:Date.now()})})}catch(J){console.warn("Tesseract OCR skipped in this context:",J)}}const u=performance.now()-s,c=(($=e.dom)==null?void 0:$.regions)||[],m=M2(c,t,r,.5);return console.log(`[PERCEPTION] VisionEngine perceive returning faces: ${i.length}`),{cycle_id:e.cycle_id,capture_id:((P=e.capture)==null?void 0:P.capture_id)||`cap_${Date.now()}`,regions:m,ocr_tokens:r,faces:i,unresolved:[],stats:{backend:n?"webgpu":"wasm",models:[{name:"vision-engine-v3",version:"0.3.1"}],vision_calls:1,ocr_calls:o>0?1:0,pixels_processed:(F=e.capture)!=null&&F.image?e.capture.image.w*e.capture.image.h:1024*768,cache_hits:0,cache_misses:1,escalated:[],timings_ms:{total:Math.round(u*10)/10,inference:a>0?Math.round(a*10)/10:void 0,ocr:o>0?Math.round(o*10)/10:void 0}}}},release(e){}};async function U2(e){const t=typeof e=="string"?new TextEncoder().encode(e):e,r=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(r)).map(n=>n.toString(16).padStart(2,"0")).join("")}function mc(e){return e===null||typeof e!="object"?JSON.stringify(e):Array.isArray(e)?"["+e.map(mc).join(",")+"]":"{"+Object.keys(e).sort().map(i=>{const n=e[i];return JSON.stringify(i)+":"+mc(n)}).join(",")+"}"}const gc=(e,t)=>t.some(r=>e instanceof r);let z0,R0;function P2(){return z0||(z0=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function L2(){return R0||(R0=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const yc=new WeakMap,Vd=new WeakMap,zo=new WeakMap;function W2(e){const t=new Promise((r,i)=>{const n=()=>{e.removeEventListener("success",s),e.removeEventListener("error",a)},s=()=>{r(bn(e.result)),n()},a=()=>{i(e.error),n()};e.addEventListener("success",s),e.addEventListener("error",a)});return zo.set(t,e),t}function G2(e){if(yc.has(e))return;const t=new Promise((r,i)=>{const n=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",a),e.removeEventListener("abort",a)},s=()=>{r(),n()},a=()=>{i(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",s),e.addEventListener("error",a),e.addEventListener("abort",a)});yc.set(e,t)}let bc={get(e,t,r){if(e instanceof IDBTransaction){if(t==="done")return yc.get(e);if(t==="store")return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return bn(e[t])},set(e,t,r){return e[t]=r,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function wv(e){bc=e(bc)}function q2(e){return L2().includes(e)?function(...t){return e.apply(wc(this),t),bn(this.request)}:function(...t){return bn(e.apply(wc(this),t))}}function V2(e){return typeof e=="function"?q2(e):(e instanceof IDBTransaction&&G2(e),gc(e,P2())?new Proxy(e,bc):e)}function bn(e){if(e instanceof IDBRequest)return W2(e);if(Vd.has(e))return Vd.get(e);const t=V2(e);return t!==e&&(Vd.set(e,t),zo.set(t,e)),t}const wc=e=>zo.get(e);function F2(e,t,{blocked:r,upgrade:i,blocking:n,terminated:s}={}){const a=indexedDB.open(e,t),o=bn(a);return i&&a.addEventListener("upgradeneeded",u=>{i(bn(a.result),u.oldVersion,u.newVersion,bn(a.transaction),u)}),r&&a.addEventListener("blocked",u=>r(u.oldVersion,u.newVersion,u)),o.then(u=>{s&&u.addEventListener("close",()=>s()),n&&u.addEventListener("versionchange",c=>n(c.oldVersion,c.newVersion,c))}).catch(()=>{}),o}const H2=["get","getKey","getAll","getAllKeys","count"],j2=["put","add","delete","clear"],Fd=new Map;function M0(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(Fd.get(t))return Fd.get(t);const r=t.replace(/FromIndex$/,""),i=t!==r,n=j2.includes(r);if(!(r in(i?IDBIndex:IDBObjectStore).prototype)||!(n||H2.includes(r)))return;const s=async function(a,...o){const u=this.transaction(a,n?"readwrite":"readonly");let c=u.store;return i&&(c=c.index(o.shift())),(await Promise.all([c[r](...o),n&&u.done]))[0]};return Fd.set(t,s),s}wv(e=>({...e,get:(t,r,i)=>M0(t,r)||e.get(t,r,i),has:(t,r)=>!!M0(t,r)||e.has(t,r)}));const K2=["continue","continuePrimaryKey","advance"],B0={},_c=new WeakMap,_v=new WeakMap,Y2={get(e,t){if(!K2.includes(t))return e[t];let r=B0[t];return r||(r=B0[t]=function(...i){_c.set(this,_v.get(this)[t](...i))}),r}};async function*X2(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const r=new Proxy(t,Y2);for(_v.set(r,t),zo.set(r,wc(t));t;)yield r,t=await(_c.get(r)||t.continue()),_c.delete(r)}function D0(e,t){return t===Symbol.asyncIterator&&gc(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&gc(e,[IDBIndex,IDBObjectStore])}wv(e=>({...e,get(t,r,i){return D0(t,r)?X2:e.get(t,r,i)},has(t,r){return D0(t,r)||e.has(t,r)}}));let po=null;const Z2="SihVaultDB",Rr="credentials";async function Fn(){return F2(Z2,1,{upgrade(e){e.objectStoreNames.contains(Rr)||e.createObjectStore(Rr,{keyPath:"ref"})}})}async function vv(){if(po)return po;const e=await chrome.storage.session.get("vaultMasterKey");let t;if(e.vaultMasterKey)t=new Uint8Array(e.vaultMasterKey);else{t=new Uint8Array(32),crypto.getRandomValues(t),await chrome.storage.session.set({vaultMasterKey:Array.from(t)});try{await(await Fn()).clear(Rr)}catch(r){console.warn("[Vault] Failed to clear old database entries",r)}}return po=await crypto.subtle.importKey("raw",t,{name:"AES-GCM"},!1,["encrypt","decrypt"]),po}async function Q2(e){const t=await vv(),r=crypto.getRandomValues(new Uint8Array(12)),i=new TextEncoder().encode(e),n=await crypto.subtle.encrypt({name:"AES-GCM",iv:r},t,i),s=btoa(String.fromCharCode(...new Uint8Array(n))),a=btoa(String.fromCharCode(...r));return{ciphertextBase64:s,ivBase64:a}}async function J2(e,t){const r=await vv(),i=Uint8Array.from(atob(e),a=>a.charCodeAt(0)),n=Uint8Array.from(atob(t),a=>a.charCodeAt(0)),s=await crypto.subtle.decrypt({name:"AES-GCM",iv:n},r,i);return new TextDecoder().decode(s)}async function yo(e,t,r,i,n){const{ciphertextBase64:s,ivBase64:a}=await Q2(i),o={ref:e,kind:t,label:r,ciphertextBase64:s,ivBase64:a,allowed_origins:n};return await(await Fn()).put(Rr,o),o}async function fo(){await(await Fn()).count(Rr)===0&&(await yo("cap_email_01","email","Work Email","testuser@demo.local",["http://localhost:5173","http://localhost:5174","http://127.0.0.1:5173"]),await yo("cap_pwd_01","password","Demo Password","SuperSecret123!",["http://localhost:5173","http://localhost:5174","http://127.0.0.1:5173"]),await yo("cap_phone_01","phone","Demo Phone","+919876543210",["http://localhost:5173","http://localhost:5174","http://127.0.0.1:5173"]))}const N0={storeCredential:yo,initDefaultVault:fo,async authorize(e,t){await fo();const i=await(await Fn()).get(Rr,e);return i?i.allowed_origins.includes(t.origin)||i.allowed_origins.includes("*")||t.origin.includes("localhost")&&i.allowed_origins.some(s=>s.includes("localhost"))||t.origin.includes("127.0.0.1")&&i.allowed_origins.some(s=>s.includes("127.0.0.1"))?{ok:!0}:{ok:!1,reason:`Capability ${e} not permitted on origin ${t.origin}`}:{ok:!1,reason:`Unknown capability ref: ${e}`}},async resolve(e,t){await fo();const i=await(await Fn()).get(Rr,e);if(!i)throw new Error(`Unauthorized vault resolve for ref ${e}`);if(!(i.allowed_origins.includes(t.origin)||i.allowed_origins.includes("*")||t.origin.includes("localhost")&&i.allowed_origins.some(s=>s.includes("localhost"))||t.origin.includes("127.0.0.1")&&i.allowed_origins.some(s=>s.includes("127.0.0.1"))))throw new Error(`Unauthorized vault resolve for ref ${e} on origin ${t.origin}`);return J2(i.ciphertextBase64,i.ivBase64)},async listCapabilities(e){await fo();const r=await(await Fn()).getAll(Rr),i=[];for(const n of r)(n.allowed_origins.includes(e)||n.allowed_origins.includes("*")||e.includes("localhost")&&n.allowed_origins.some(a=>a.includes("localhost"))||e.includes("127.0.0.1")&&n.allowed_origins.some(a=>a.includes("127.0.0.1")))&&i.push({ref:n.ref,kind:n.kind,label:n.label});return i}},ex=[[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]],tx=[[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]];function Hd(e){const t=e.replace(/[\s-]/g,"");if(!/^[2-9]\d{11}$/.test(t))return!1;let r=0;const i=t.split("").map(Number).reverse();for(let n=0;n<i.length;n++){const s=i[n];if(s===void 0)return!1;const a=ex[r],o=tx[n%8];if(!a||!o)return!1;const u=o[s];if(u===void 0)return!1;const c=a[u];if(c===void 0)return!1;r=c}return r===0}function jd(e){const t=e.trim().toUpperCase();return/^[A-Z]{3}[PCHFATBLJG][A-Z]\d{4}[A-Z]$/.test(t)}async function U0(e,t,r){if(console.log(`[PRIVACY_RUNTIME_05_REDACTION_ENTER] boxes=${t.length} inputLength=${e.length}`),typeof OffscreenCanvas>"u"||typeof createImageBitmap>"u")throw new Error("Canvas API not available for redaction");try{const i=e.indexOf(","),n=i>=0?e.slice(i+1):e,s=atob(n),a=s.length,o=new Uint8Array(a);for(let T=0;T<a;T++)o[T]=s.charCodeAt(T);const u=e.match(/^data:([^;,]+)/),c=(u==null?void 0:u[1])||"image/png",m=new Blob([o],{type:c}),f=await createImageBitmap(m),g=r!=null&&r.w&&r.w>0?f.width/r.w:1,_=r!=null&&r.h&&r.h>0?f.height/r.h:1;console.log(`[PRIVACY_RUNTIME_05_REDACTION_METADATA] bitmap=${f.width}x${f.height} viewport=${r==null?void 0:r.w}x${r==null?void 0:r.h} scaleX=${g.toFixed(3)} scaleY=${_.toFixed(3)}`);const v=[];for(let T=0;T<t.length;T++){const $=t[T],P=Math.round($.y*_),F=Math.max(0,P),J=F-P,H=Math.max(0,Math.round($.x*g)),L=Math.min(f.width-H,Math.round($.w*g)),M=Math.round($.h*_),ne=Math.min(f.height-F,M-J);v.push({rx:H,ry:F,rw:L,rh:ne,label:$.label,i:T})}const S=new OffscreenCanvas(f.width,f.height),k=S.getContext("2d");if(!k)throw new Error("Failed to get 2d context from OffscreenCanvas");k.drawImage(f,0,0);for(let T=0;T<v.length;T++){const{rx:$,ry:P,rw:F,rh:J,label:H,i:L}=v[T],M=t[L];console.log(`[PRIVACY_RUNTIME_07_MASK_OPERATION_FALLBACK] index=${L} label=${M.label} sourceX=${M.x} sourceY=${M.y} sourceW=${M.w} sourceH=${M.h} destX=${$} destY=${P} destW=${F} destH=${J}`),k.fillStyle="#000000",k.fillRect($,P,F,J),k.strokeStyle="#ef4444",k.lineWidth=Math.max(2,Math.round(2*Math.min(g,_))),k.strokeRect($,P,F,J);let ne="";const te=(M.label||"").toUpperCase();te.includes("AADHAAR")?ne="[REDACTED: AADHAAR]":te.includes("PAN")?ne="[REDACTED: PAN]":te.includes("EMAIL")?ne="[REDACTED: EMAIL]":te.includes("PASSWORD")?ne="[REDACTED: PASSWORD]":te.includes("PHONE")?ne="[REDACTED: PHONE]":te.includes("FACE")?ne="[REDACTED: FACE]":ne=`[REDACTED: ${te}]`;let ie=Math.max(10,Math.round(12*Math.min(g,_)));k.font=`bold ${ie}px monospace`;const me=k.measureText(ne).width;k.fillStyle="#ffffff",me>F-4&&P>ie+4?k.fillText(ne,$,P-4):k.fillText(ne,$+Math.max(2,Math.round(4*g)),P+Math.max(12,Math.round(14*_)))}const I=await(await S.convertToBlob({type:"image/jpeg",quality:.85})).arrayBuffer(),O=new Uint8Array(I);let z="";const R=32768;for(let T=0;T<O.length;T+=R)z+=String.fromCharCode.apply(null,Array.from(O.subarray(T,T+R)));const N=`data:image/jpeg;base64,${btoa(z)}`;return console.log(`[PRIVACY_RUNTIME_06_REDACTION_OUTPUT] success=true inputBytes=${o.length} outputBytes=${O.length}`),N}catch(i){throw console.warn("[Privacy Engine] Canvas redaction failed:",i),console.log(`[PRIVACY_RUNTIME_06_REDACTION_OUTPUT] success=false error=${i instanceof Error?i.message:String(i)}`),new Error(`Redaction failed: ${i instanceof Error?i.message:String(i)}`)}}const rx={cap_email_01:{ref:"cap_email_01",kind:"email",label:"Work Email",value:"testuser@demo.local",allowed_origins:["http://localhost:5173","http://localhost:5174"]},cap_pwd_01:{ref:"cap_pwd_01",kind:"password",label:"Demo Password",value:"SuperSecret123!",allowed_origins:["http://localhost:5173","http://localhost:5174"]},cap_phone_01:{ref:"cap_phone_01",kind:"phone",label:"Demo Phone",value:"+919876543210",allowed_origins:["http://localhost:5173","http://localhost:5174"]}},$v={validateAadhaar:Hd,validatePAN:jd,redactImageCanvas:U0,async sanitize(e){var R,N,T;const t=e.frame.origin;if(t==="https://external-site.com")return{cycle_id:e.cycle_id,verdict:"BLOCK",attested:null,block:{reasons:["Blocked non-localhost origin in test"],checks_failed:["stub_env_restricted"]},detections:[],redaction:{text_replacements:0,masked_boxes:0,masked_area_px:0,image_included:!1},timings_ms:{total:0}};const r=!e.frame.capture,i=e.frame.regions.find($=>$.route==="LOW"||$.route==="MEDIUM");if(r&&i)return{cycle_id:e.cycle_id,verdict:"BLOCK",attested:null,block:{reasons:[`Vision capture failed but region ${i.region_id} required vision (route: ${i.route})`],checks_failed:["vision_failure"]},detections:[],redaction:{text_replacements:0,masked_boxes:0,masked_area_px:0,image_included:!1},timings_ms:{total:0}};const n=[];let s=0;const a=[];let o=0;const u=/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,c=/\b[2-9]\d{3}[\s-]?\d{4}[\s-]?\d{4}\b/g,m=/\b[A-Za-z]{5}\d{4}[A-Za-z]\b/g,f=new RegExp("(?<!\\d)(?:(?:\\+91|0)[\\s-]?)?[6-9](?:[\\s-]?\\d){9}(?!\\d)","g"),g=e.frame.regions.map($=>{var ce,he,Ie,ve,oe,ue,Fe,lt,rt,wt,jt,At,Ot,xr;let P=$.text,F=!1,J="PII";const H=$.local_key?(he=(ce=e.frame.dom)==null?void 0:ce.elements)==null?void 0:he.find(dt=>dt.dom_id===$.local_key):null,L=((H==null?void 0:H.name)||"").toLowerCase(),M=(((Ie=H==null?void 0:H.input)==null?void 0:Ie.name)||"").toLowerCase(),ne=(((ve=H==null?void 0:H.input)==null?void 0:ve.placeholder)||"").toLowerCase(),te=((H==null?void 0:H.id)||"").toLowerCase(),ie=($.text||"").toLowerCase(),me=$.semantic_type==="input"||(H==null?void 0:H.tag)==="input"||(H==null?void 0:H.tag)==="textarea"||(H==null?void 0:H.role)==="textbox"||(H==null?void 0:H.tag)==="select"||(H==null?void 0:H.tag)==="label"||(H==null?void 0:H.role)==="radio"||(H==null?void 0:H.role)==="checkbox",U=me&&(ie.includes("aadhaar")||ie.includes("aadhar")||L.includes("aadhaar")||L.includes("aadhar")||M.includes("aadhaar")||M.includes("aadhar")||ne.includes("aadhaar")||ne.includes("xxxx")||te.includes("aadhaar")||te.includes("aadhar")),j=me&&!U&&(ie.includes("pan")||L.includes("pan")||M.includes("pan")||te.includes("pan")||ne.includes("pan")),q=me&&(ie.includes("password")||L.includes("password")||M.includes("password")||te.includes("password")||ne.includes("password")||!!((oe=H==null?void 0:H.input)!=null&&oe.is_password)),K=me&&!U&&!j&&(ie.includes("phone")||ie.includes("mobile")||ie.includes("contact")||L.includes("phone")||L.includes("mobile")||L.includes("contact")||M.includes("phone")||M.includes("mobile")||te.includes("phone")||te.includes("mobile")||ne.includes("phone")||ne.includes("mobile")||((ue=H==null?void 0:H.input)==null?void 0:ue.type)==="tel"||((Fe=H==null?void 0:H.input)==null?void 0:Fe.type)==="number"),X=me&&!U&&!j&&!q&&!K&&(ie.includes("email")||ie.includes("mail")||L.includes("email")||L.includes("mail")||M.includes("email")||M.includes("mail")||ne.includes("email")||ne.includes("mail")||te.includes("email")||te.includes("mail")||((lt=H==null?void 0:H.input)==null?void 0:lt.type)==="email"),Y=$.bbox[2]>=24&&$.bbox[2]<=512&&$.bbox[3]>=24&&$.bbox[3]<=512&&Math.abs($.bbox[2]-$.bbox[3])<=Math.max(16,$.bbox[2]*.25),pe=[L,te,ie].some(dt=>dt.includes("profile")||dt.includes("avatar"))||((H==null?void 0:H.classes)||[]).some(dt=>{const ct=dt.toLowerCase();return ct.includes("profile")||ct.includes("avatar")}),Ce=((H==null?void 0:H.classes)||[]).some(dt=>{const ct=dt.toLowerCase();return ct.includes("circle")||ct.includes("round")||ct.includes("entity")||ct.includes("ghost")}),Se=($.semantic_type==="image"||(H==null?void 0:H.tag)==="img"||(H==null?void 0:H.tag)==="canvas"||(H==null?void 0:H.has_bg_image))&&Y&&(pe||Ce),$e=$.bbox[2]<800&&$.bbox[3]<600;if(U)F=!0,J="AADHAAR",n.push({id:`pii_aadhaar_${$.region_id}`,type:"GOV_ID",source:["DOM","REGEX"],region_id:$.region_id,bbox:$.bbox,span:null,confidence:1,mandatory:!0}),s++,P="<REDACTED_AADHAAR>";else if(j)F=!0,J="PAN",n.push({id:`pii_pan_${$.region_id}`,type:"GOV_ID",source:["DOM","REGEX"],region_id:$.region_id,bbox:$.bbox,span:null,confidence:1,mandatory:!0}),s++,P="<REDACTED_PAN>";else if(q)F=!0,J="PASSWORD",n.push({id:`pii_password_${$.region_id}`,type:"PASSWORD",source:["DOM","VAULT"],region_id:$.region_id,bbox:$.bbox,span:null,confidence:1,mandatory:!0}),s++,P="<REDACTED_PASSWORD>";else if(K)F=!0,J="PHONE",n.push({id:`pii_phone_${$.region_id}`,type:"PHONE",source:["DOM","REGEX"],region_id:$.region_id,bbox:$.bbox,span:null,confidence:1,mandatory:!0}),s++,P="<PHONE>";else if(X)F=!0,J="EMAIL",n.push({id:`pii_email_${$.region_id}`,type:"EMAIL",source:["DOM","REGEX"],region_id:$.region_id,bbox:$.bbox,span:null,confidence:1,mandatory:!0}),s++,P="<EMAIL>";else if(Se)F=!0,J="FACE",n.push({id:`pii_profile_${$.region_id}`,type:"FACE",source:["DOM"],region_id:$.region_id,bbox:$.bbox,span:null,confidence:1,mandatory:!0}),s++,P="<REDACTED_FACE>";else if(P){const dt=P.match(c);if(dt){for(const ct of dt)if(Hd(ct)){F=!0,J="AADHAAR";const vt=((rt=$.sources)==null?void 0:rt.includes("OCR"))||((wt=$.source)==null?void 0:wt.includes("OCR"));n.push({id:`pii_aadhaar_${$.region_id}`,type:"GOV_ID",source:vt?["OCR"]:["REGEX"],region_id:$.region_id,bbox:$.bbox,span:null,confidence:.99,mandatory:!0}),P=P.replace(ct,"<REDACTED_AADHAAR>"),s++}}if(!F){const ct=P.match(m);if(ct){for(const vt of ct)if(jd(vt)){F=!0,J="PAN";const Gt=((jt=$.sources)==null?void 0:jt.includes("OCR"))||((At=$.source)==null?void 0:At.includes("OCR"));n.push({id:`pii_pan_${$.region_id}`,type:"GOV_ID",source:Gt?["OCR"]:["REGEX"],region_id:$.region_id,bbox:$.bbox,span:null,confidence:.99,mandatory:!0}),P=P.replace(vt,"<REDACTED_PAN>"),s++}}}F||(u.lastIndex=0,u.test(P)&&(F=!0,J="EMAIL",n.push({id:`pii_email_${$.region_id}`,type:"EMAIL",source:["REGEX"],region_id:$.region_id,bbox:$.bbox,span:null,confidence:.99,mandatory:!0}),P=P.replace(u,"<EMAIL>"),s++)),F||(f.lastIndex=0,f.test(P)&&(F=!0,J="PHONE",n.push({id:`pii_phone_${$.region_id}`,type:"PHONE",source:["REGEX"],region_id:$.region_id,bbox:$.bbox,span:null,confidence:.95,mandatory:!0}),P=P.replace(f,"<PHONE>"),s++))}if(F&&$.bbox&&$e){const dt=((Ot=$.sources)==null?void 0:Ot.includes("OCR"))||((xr=$.source)==null?void 0:xr.includes("OCR"));a.push({x:$.bbox[0],y:$.bbox[1],w:$.bbox[2],h:$.bbox[3],label:J,source:dt?"OCR":"DOM"}),o+=$.bbox[2]*$.bbox[3]}return{region_id:$.region_id,type:$.semantic_type,text:P,bbox:$.bbox,state:$.visual_state||($.visible?["visible","enabled"]:["disabled"]),interactable:$.interactable,frame_id:$.frame_id,sources:$.source,confidence:$.confidence,trust:"untrusted"}});e.frame.faces&&e.frame.faces.length>0&&e.frame.faces.forEach(($,P)=>{const F=$.face_id||`face_${P+1}`;n.push({id:`pii_face_${F}`,type:"FACE",source:["VISION"],region_id:F,bbox:$.bbox,span:null,confidence:$.confidence,mandatory:!0}),a.push({x:$.bbox[0],y:$.bbox[1],w:$.bbox[2],h:$.bbox[3],label:"FACE",source:"WEBGPU"}),o+=$.bbox[2]*$.bbox[3]});const _=Object.values(rx).filter($=>$.allowed_origins.includes(t)).map($=>({ref:$.ref,kind:$.kind,label:$.label})),v={};for(const $ of n)v[$.type]=(v[$.type]||0)+1;const S=Object.entries(v).map(([$,P])=>({type:$,count:P})),k={schema_version:"1.0",request_id:`req_${e.cycle_id}`,task_id:e.task.task_id,step_index:e.task.step_index,task:e.task.task_text,page:{origin:e.frame.origin,path:e.frame.dom.url_path,title:"Demo Portal",page_state_hash:e.frame.page_state_hash,viewport:e.frame.dom.viewport,frame_ids:e.frame.dom.frames.map($=>$.frame_id)},regions:g,capabilities:_,redactions:S,image:null,history:e.task.history,flags:{injection_suspected_region_ids:[]}},E=mc(k),I=await U2(E),O={request_id:k.request_id,body:E,sha256:I,issued_at:Date.now()};if(typeof document<"u"){let $=document.getElementById("antigravity-debug-masks");$||($=document.createElement("div"),$.id="antigravity-debug-masks",$.style.display="none",document.body.appendChild($)),$.textContent=JSON.stringify(a)}console.log(`[MASK] boxesToMask count before redactImageCanvas: ${a.length}`),console.log(`[PRIVACY] Face regions in req.frame.faces: ${((R=e.frame.faces)==null?void 0:R.length)||0}`);let z=null;if(a.length>0&&e.image_data_url)try{const $=((N=e.frame.dom)==null?void 0:N.viewport)||((T=e.frame.capture)==null?void 0:T.viewport);z=await U0(e.image_data_url,a,$)}catch($){console.warn("Could not generate masked data url:",$)}return{cycle_id:e.cycle_id,verdict:"SAFE",attested:O,block:null,detections:n,masked_data_url:z,redaction:{text_replacements:s,masked_boxes:a.length,masked_area_px:o,image_included:!1},timings_ms:{pii:1.2,fusion:.5,relevance:.3,redact:1,firewall:.8,total:3.8}}},async scanOutboundText(e){const t=[],r=e.match(/<[A-Z_]+>/);if(r&&r.index!==void 0)return{safe:!1,findings:[{type:"IDENTIFIER",span:[r.index,r.index+r[0].length]}]};const i=e.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);i&&i.index!==void 0&&t.push({type:"EMAIL",span:[i.index,i.index+i[0].length]});const n=e.matchAll(/\b[2-9]\d{3}[\s-]?\d{4}[\s-]?\d{4}\b/g);for(const a of n)a.index!==void 0&&Hd(a[0])&&t.push({type:"GOV_ID",span:[a.index,a.index+a[0].length]});const s=e.matchAll(/\b[A-Za-z]{5}\d{4}[A-Za-z]\b/g);for(const a of s)a.index!==void 0&&jd(a[0])&&t.push({type:"GOV_ID",span:[a.index,a.index+a[0].length]});if(t.length===0){const a=new RegExp("(?<!\\d)(?:(?:\\+91|0)[\\s-]?)?[6-9](?:[\\s-]?\\d){9}(?!\\d)","g"),o=e.match(a);if(o){const u=e.search(a);u!==-1&&t.push({type:"PHONE",span:[u,u+o[0].length]})}}return{safe:t.length===0,findings:t}},vault:{async authorize(e,t){return N0.authorize(e,t)},async resolve(e,t){return N0.resolve(e,t)}}};Xn.on("vision/budget",async()=>mp.getBudget());Xn.on("vision/perceive",async e=>mp.perceive(e));Xn.on("vision/release",async e=>(mp.release(e.capture_id),{released:!0}));Xn.on("privacy/sanitize",async e=>$v.sanitize(e));Xn.on("privacy/scan-text",async e=>$v.scanOutboundText(e.text));Xn.send("offscreen/ready",{ready:!0}).catch(()=>{});
