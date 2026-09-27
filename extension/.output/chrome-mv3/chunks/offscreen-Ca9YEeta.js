var x0=Object.defineProperty;var S0=(e,t,r)=>t in e?x0(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var Ke=(e,t,r)=>S0(e,typeof t!="symbol"?t+"":t,r);import{g as k0,b as ir}from"./_commonjsHelpers--slR2vpB.js";/*!
 * ONNX Runtime Web v1.30.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Ma=Object.defineProperty,T0=Object.getOwnPropertyDescriptor,I0=Object.getOwnPropertyNames,E0=Object.prototype.hasOwnProperty,C0=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),Z=(e,t,r)=>()=>{if(r)throw r[0];try{return e&&(t=e(e=0)),t}catch(i){throw r=[i],i}},nr=(e,t)=>{for(var r in t)Ma(e,r,{get:t[r],enumerable:!0})},A0=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of I0(t))!E0.call(e,n)&&n!==r&&Ma(e,n,{get:()=>t[n],enumerable:!(i=T0(t,n))||i.enumerable});return e},kr=e=>A0(Ma({},"__esModule",{value:!0}),e),ur,vt,Qt,nu,$p,vp=Z(()=>{"use strict";ur=new Map,vt=[],Qt=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=ur.get(e);if(i===void 0)ur.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let n=vt.indexOf(e);n!==-1&&vt.splice(n,1);for(let a=0;a<vt.length;a++)if(ur.get(vt[a]).priority<=r){vt.splice(a,0,e);return}vt.push(e)}return}throw new TypeError("not a valid backend")},nu=async e=>{let t=ur.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},$p=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),i=r.length===0?vt:r,n,a=[],s=new Set;for(let l of i){let d=await nu(l);typeof d=="string"?a.push({name:l,err:d}):(n||(n=d),n===d&&s.add(l))}if(!n)throw new Error(`no available backend found. ERR: ${a.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:d}of a)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${d}`);let u=t.filter(l=>s.has(typeof l=="string"?l:l.name));return[n,new Proxy(e,{get:(l,d)=>d==="executionProviders"?u:Reflect.get(l,d)})]}}),z0=Z(()=>{"use strict";vp()}),xp,O0=Z(()=>{"use strict";xp="1.30.0"}),Li,De,Sp=Z(()=>{"use strict";O0(),Li="warning",De={wasm:{},webgl:{},webgpu:{},versions:{common:xp},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);Li=e}},get logLevel(){return Li}},Object.defineProperty(De,"logLevel",{enumerable:!0})}),ve,R0=Z(()=>{"use strict";Sp(),ve=De}),kp,Tp,M0=Z(()=>{"use strict";kp=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let n,a;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[3]):(n=e.dims[3],a=e.dims[2]);let s=(t==null?void 0:t.format)!==void 0?t.format:"RGB",u=t==null?void 0:t.norm,l,d;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?d=[0,0,0,0]:typeof u.bias=="number"?d=[u.bias,u.bias,u.bias,u.bias]:(d=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(d[3]=u.bias[3]));let h=a*n,p=0,m=h,_=h*2,y=-1;s==="RGBA"?(p=0,m=h,_=h*2,y=h*3):s==="RGB"?(p=0,m=h,_=h*2):s==="RBG"&&(p=0,_=h,m=h*2);for(let w=0;w<a;w++)for(let S=0;S<n;S++){let v=(e.data[p++]-d[0])*l[0],b=(e.data[m++]-d[1])*l[1],I=(e.data[_++]-d[2])*l[2],k=y===-1?255:(e.data[y++]-d[3])*l[3];i.fillStyle="rgba("+v+","+b+","+I+","+k+")",i.fillRect(S,w,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Tp=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let n,a,s;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(n=e.dims[2],a=e.dims[1],s=e.dims[3]):(n=e.dims[3],a=e.dims[2],s=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t==null?void 0:t.norm,d,h;l===void 0||l.mean===void 0?d=[255,255,255,255]:typeof l.mean=="number"?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(d[3]=l.mean[3])),l===void 0||l.bias===void 0?h=[0,0,0,0]:typeof l.bias=="number"?h=[l.bias,l.bias,l.bias,l.bias]:(h=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(h[3]=l.bias[3]));let p=a*n;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let m=4,_=0,y=1,w=2,S=3,v=0,b=p,I=p*2,k=-1;u==="RGBA"?(v=0,b=p,I=p*2,k=p*3):u==="RGB"?(v=0,b=p,I=p*2):u==="RBG"&&(v=0,I=p,b=p*2),i=r.createImageData(n,a);for(let T=0;T<a*n;_+=m,y+=m,w+=m,S+=m,T++)i.data[_]=(e.data[v++]-h[0])*d[0],i.data[y]=(e.data[b++]-h[1])*d[1],i.data[w]=(e.data[I++]-h[2])*d[2],i.data[S]=k===-1?255:(e.data[k++]-h[3])*d[3]}else throw new Error("Can not access image data");return i}}),Wr,Ip,Ep,Cp,Ap,zp,D0=Z(()=>{"use strict";Da(),Wr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,n=t.norm??{mean:255,bias:0},a,s;typeof n.mean=="number"?a=[n.mean,n.mean,n.mean,n.mean]:a=[n.mean[0],n.mean[1],n.mean[2],n.mean[3]??255],typeof n.bias=="number"?s=[n.bias,n.bias,n.bias,n.bias]:s=[n.bias[0],n.bias[1],n.bias[2],n.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",d=r*i,h=l==="RGBA"?new Float32Array(d*4):new Float32Array(d*3),p=4,m=0,_=1,y=2,w=3,S=0,v=d,b=d*2,I=-1;u==="RGB"&&(p=3,m=0,_=1,y=2,w=-1),l==="RGBA"?I=d*3:l==="RBG"?(S=0,b=d,v=d*2):l==="BGR"&&(b=0,v=d,S=d*2);for(let k=0;k<d;k++,m+=p,y+=p,_+=p,w+=p)h[S++]=(e[m]+s[0])/a[0],h[v++]=(e[_]+s[1])/a[1],h[b++]=(e[y]+s[2])/a[2],I!==-1&&w!==-1&&(h[I++]=(e[w]+s[3])/a[3]);return l==="RGBA"?new Fe("float32",h,[1,4,r,i]):new Fe("float32",h,[1,3,r,i])},Ip=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,n=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,a=typeof e=="string",s,u=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},d=h=>typeof HTMLCanvasElement<"u"&&h instanceof HTMLCanvasElement||h instanceof OffscreenCanvas?h.getContext("2d"):null;if(r){let h=l();h.width=e.width,h.height=e.height;let p=d(h);if(p!=null){let m=e.height,_=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(m=t.resizedHeight,_=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=m,u.width=_}else u.tensorFormat="RGBA",u.height=m,u.width=_;p.drawImage(e,0,0),s=p.getImageData(0,0,_,m).data}else throw new Error("Can not access image data")}else if(i){let h,p;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(h=t.resizedHeight,p=t.resizedWidth):(h=e.height,p=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=h,u.width=p,t!==void 0){let m=l();m.width=p,m.height=h;let _=d(m);if(_!=null)_.putImageData(e,0,0),s=_.getImageData(0,0,p,h).data;else throw new Error("Can not access image data")}else s=e.data}else if(n){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let h=l();h.width=e.width,h.height=e.height;let p=d(h);if(p!=null){let m=e.height,_=e.width;return p.drawImage(e,0,0,_,m),s=p.getImageData(0,0,_,m).data,u.height=m,u.width=_,Wr(s,u)}else throw new Error("Can not access image data")}else{if(a)return new Promise((h,p)=>{let m=l(),_=d(m);if(!e||!_)return p();let y=new Image;y.crossOrigin="Anonymous",y.src=e,y.onload=()=>{m.width=y.width,m.height=y.height,_.drawImage(y,0,0,m.width,m.height);let w=_.getImageData(0,0,m.width,m.height);u.height=m.height,u.width=m.width,h(Wr(w.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return Wr(s,u);throw new Error("Input data provided is not supported - aborted tensor creation")},Ep=(e,t)=>{let{width:r,height:i,download:n,dispose:a}=t,s=[1,i,r,4];return new Fe({location:"texture",type:"float32",texture:e,dims:s,download:n,dispose:a})},Cp=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new Fe({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:n,dispose:a})},Ap=(e,t)=>{let{dataType:r,dims:i,download:n,dispose:a}=t;return new Fe({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:n,dispose:a})},zp=(e,t,r)=>new Fe({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),Nt,$r,Wi,Op,B0=Z(()=>{"use strict";Nt=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),$r=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Wi=!1,Op=()=>{if(!Wi){Wi=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(Nt.set("int64",BigInt64Array),$r.set(BigInt64Array,"int64")),t&&(Nt.set("uint64",BigUint64Array),$r.set(BigUint64Array,"uint64")),i?(Nt.set("float16",r),$r.set(r,"float16")):Nt.set("float16",Uint16Array)}}}),Rp,Mp,N0=Z(()=>{"use strict";Da(),Rp=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},Mp=(e,t)=>{switch(e.location){case"cpu":return new Fe(e.type,e.data,t);case"cpu-pinned":return new Fe({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Fe({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Fe({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Fe({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Fe,Da=Z(()=>{"use strict";M0(),D0(),B0(),N0(),Fe=class{constructor(e,t,r){Op();let i,n;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,n=e.dims,e.location){case"cpu-pinned":{let s=Nt.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,u;if(typeof e=="string")if(i=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let l=Nt.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(t,BigInt):s=l.from(t)}else if(t instanceof l)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${l}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")i="string",s=e;else if(l==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let l=$r.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=l,s=e}if(u===void 0)u=[s.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");n=u,this.cpuData=s,this.dataLocation="cpu"}let a=Rp(n);if(this.cpuData&&a!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(a/2)===this.cpuData.length))throw new Error(`Tensor's size(${a}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=n,this.size=a}static async fromImage(e,t){return Ip(e,t)}static fromTexture(e,t){return Ep(e,t)}static fromGpuBuffer(e,t){return Cp(e,t)}static fromMLTensor(e,t){return Ap(e,t)}static fromPinnedBuffer(e,t,r){return zp(e,t,r)}toDataURL(e){return kp(this,e)}toImageData(e){return Tp(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return Mp(this,e)}}}),Ye,Dp=Z(()=>{"use strict";Da(),Ye=Fe}),ui,qi,lt,nt,Lt,Wt,Bp=Z(()=>{"use strict";Sp(),ui=(e,t)=>{(typeof De.trace>"u"?!De.wasm.trace:!De.trace)||console.timeStamp(`${e}::ORT::${t}`)},qi=(e,t)=>{var n;let r=((n=new Error().stack)==null?void 0:n.split(/\r\n|\r|\n/g))||[],i=!1;for(let a=0;a<r.length;a++){if(i&&!r[a].includes("TRACE_FUNC")){let s=`FUNC_${e}::${r[a].trim().split(" ")[1]}`;t&&(s+=`::${t}`),ui("CPU",s);return}r[a].includes("TRACE_FUNC")&&(i=!0)}},lt=e=>{(typeof De.trace>"u"?!De.wasm.trace:!De.trace)||qi("BEGIN",e)},nt=e=>{(typeof De.trace>"u"?!De.wasm.trace:!De.trace)||qi("END",e)},Lt=e=>{(typeof De.trace>"u"?!De.wasm.trace:!De.trace)||console.time(`ORT::${e}`)},Wt=e=>{(typeof De.trace>"u"?!De.wasm.trace:!De.trace)||console.timeEnd(`ORT::${e}`)}}),Np,P0=Z(()=>{"use strict";vp(),Dp(),Bp(),Np=class Pp{constructor(t){this.handler=t}async run(t,r,i){lt(),Lt("InferenceSession.run");let n={},a={};if(typeof t!="object"||t===null||t instanceof Ye||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Ye)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let d of r){if(typeof d!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(d)===-1)throw new RangeError(`'fetches' contains invalid output name: ${d}.`);n[d]=null}if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let d=!1,h=Object.getOwnPropertyNames(r);for(let p of this.outputNames)if(h.indexOf(p)!==-1){let m=r[p];(m===null||m instanceof Ye)&&(d=!0,s=!1,n[p]=m)}if(d){if(typeof i=="object"&&i!==null)a=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else a=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let d of this.inputNames)if(typeof t[d]>"u")throw new Error(`input '${d}' is missing in 'feeds'.`);if(s)for(let d of this.outputNames)n[d]=null;let u=await this.handler.run(t,n,a),l={};for(let d in u)if(Object.hasOwnProperty.call(u,d)){let h=u[d];h instanceof Ye?l[d]=h:l[d]=new Ye(h.type,h.data,h.dims)}return Wt("InferenceSession.run"),nt(),l}async release(){return this.handler.dispose()}static async create(t,r,i,n){lt(),Lt("InferenceSession.create");let a,s={};if(typeof t=="string"){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(a=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let h=t,p=0,m=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(p=r,!Number.isSafeInteger(p))throw new RangeError("'byteOffset' must be an integer.");if(p<0||p>=h.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${h.byteLength}).`);if(m=t.byteLength-p,typeof i=="number"){if(m=i,!Number.isSafeInteger(m))throw new RangeError("'byteLength' must be an integer.");if(m<=0||p+m>h.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${h.byteLength-p}].`);if(typeof n=="object"&&n!==null)s=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");a=new Uint8Array(h,p,m)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await $p(s),d=await u.createInferenceSessionHandler(a,l);return Wt("InferenceSession.create"),nt(),new Pp(d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Tr,U0=Z(()=>{"use strict";P0(),Tr=Np}),L0=Z(()=>{"use strict"}),W0=Z(()=>{"use strict"}),q0=Z(()=>{"use strict"}),V0=Z(()=>{"use strict"}),G0={};nr(G0,{InferenceSession:()=>Tr,TRACE:()=>ui,TRACE_EVENT_BEGIN:()=>Lt,TRACE_EVENT_END:()=>Wt,TRACE_FUNC_BEGIN:()=>lt,TRACE_FUNC_END:()=>nt,Tensor:()=>Ye,env:()=>ve,registerBackend:()=>Qt});var Ze=Z(()=>{"use strict";z0(),R0(),U0(),Dp(),L0(),W0(),Bp(),q0(),V0()}),Ba=Z(()=>{"use strict"}),Up={};nr(Up,{default:()=>Lp});var Vi,Gi,Lp,F0=Z(()=>{"use strict";var e;Ym(),Ht(),Na(),Vi="ort-wasm-proxy-worker",Gi=((e=globalThis.self)==null?void 0:e.name)===Vi,Gi&&(self.onmessage=t=>{let{type:r,in:i}=t.data;try{switch(r){case"init-wasm":Pa(i.wasm).then(()=>{ts(i).then(()=>{postMessage({type:r})},n=>{postMessage({type:r,err:n})})},n=>{postMessage({type:r,err:n})});break;case"init-ep":{let{epName:n,env:a}=i;rs(a,n).then(()=>{postMessage({type:r})},s=>{postMessage({type:r,err:s})});break}case"copy-from":{let{buffer:n}=i,a=mi(n);postMessage({type:r,out:a});break}case"create":{let{model:n,options:a}=i;is(n,a).then(s=>{postMessage({type:r,out:s})},s=>{postMessage({type:r,err:s})});break}case"release":ns(i),postMessage({type:r});break;case"run":{let{sessionId:n,inputIndices:a,inputs:s,outputIndices:u,options:l}=i;as(n,a,s,u,new Array(u.length).fill(null),l).then(d=>{d.some(h=>h[3]!=="cpu")?postMessage({type:r,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:r,out:d},os([...s,...d]))},d=>{postMessage({type:r,err:d})});break}case"end-profiling":ss(i),postMessage({type:r});break;default:}}catch(n){postMessage({type:r,err:n})}}),Lp=Gi?null:t=>new Worker(t??Ge,{type:"module",name:Vi})}),Wp={};nr(Wp,{default:()=>qp});async function au(e={}){var ru,iu;var t=e,r=!!globalThis.window,i=!!globalThis.WorkerGlobalScope,n=i&&((ru=self.name)==null?void 0:ru.startsWith("em-pthread"));t.mountExternalData=(o,c)=>{o.startsWith("./")&&(o=o.substring(2)),(t.ad||(t.ad=new Map)).set(o,c)},t.unmountExternalData=()=>{delete t.ad,delete t.Yd,delete t.Xd,delete t.be},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let a=o=>async(...c)=>{var g;try{if(t.$c)throw Error("Session already started");let f=t.$c={Nd:c[0],errors:[]},x=await o(...c);if(t.$c!==f)throw Error("Session mismatch");(g=t.hd)==null||g.flush();let E=f.errors;if(0<E.length){let M=await Promise.all(E);if(M=M.filter(q=>q),0<M.length)throw Error(M.join(`
`))}return x}finally{t.$c=null}};t.jsepInit=(o,c)=>{if(o==="webgpu"){[t.hd,t.Dd,t.Hd,t.jd,t.Gd,t.bc,t.Id,t.Kd,t.Ed,t.Fd,t.Jd]=c;let g=t.hd;t.jsepRegisterBuffer=(f,x,E,M)=>g.registerBuffer(f,x,E,M),t.jsepGetBuffer=f=>g.getBuffer(f),t.jsepCreateDownloader=(f,x,E)=>g.createDownloader(f,x,E),t.jsepOnCreateSession=f=>{g.onCreateSession(f)},t.jsepOnReleaseSession=f=>{g.onReleaseSession(f)},t.jsepOnRunStart=f=>g.onRunStart(f),t.Ld=(f,x)=>{g.upload(f,x)}}else if(o==="webnn"){let g=c[0];[t.Vd,t.vd,t.webnnEnsureTensor,t.wd,t.webnnDownloadTensor,t.Ud,t.webnnEnableTraceEvent]=c.slice(1),t.webnnReleaseTensorId=t.vd,t.webnnUploadTensor=t.wd,t.webnnRegisterMLContext=t.Ud,t.webnnOnRunStart=f=>g.onRunStart(f),t.webnnOnRunEnd=g.onRunEnd.bind(g),t.webnnOnReleaseSession=f=>{g.onReleaseSession(f)},t.webnnCreateMLTensorDownloader=(f,x)=>g.createMLTensorDownloader(f,x),t.webnnRegisterMLTensor=(f,x,E,M)=>g.registerMLTensor(f,x,E,M),t.webnnCreateMLContext=f=>g.createMLContext(f),t.webnnRegisterGraphInput=g.registerGraphInput.bind(g),t.webnnIsGraphInput=g.isGraphInput.bind(g),t.webnnRegisterGraphOutput=g.registerGraphOutput.bind(g),t.webnnIsGraphOutput=g.isGraphOutput.bind(g),t.webnnCreateTemporaryTensor=g.createTemporaryTensor.bind(g),t.webnnIsGraphInputOutputTypeSupported=g.isGraphInputOutputTypeSupported.bind(g)}};let s=()=>{let o=c=>(...g)=>{let f=st;return g=c(...g),st!=f?new Promise((x,E)=>{Ii={resolve:x,reject:E}}):g};(()=>{for(let c of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])t[c]=o(t[c])})(),a!==void 0&&(t._OrtRun=a(t._OrtRun),t._OrtRunWithBinding=a(t._OrtRunWithBinding)),s=void 0};t.asyncInit=()=>{s==null||s()};var u,l,d=(o,c)=>{throw c},h=self.location.href,p="";if(r||i){try{p=new URL(".",h).href}catch{}i&&(l=o=>{var c=new XMLHttpRequest;return c.open("GET",o,!1),c.responseType="arraybuffer",c.send(null),new Uint8Array(c.response)}),u=async o=>{if(A(o))return new Promise((g,f)=>{var x=new XMLHttpRequest;x.open("GET",o,!0),x.responseType="arraybuffer",x.onload=()=>{x.status==200||x.status==0&&x.response?g(x.response):f(x.status)},x.onerror=f,x.send(null)});var c=await fetch(o,{credentials:"same-origin"});if(c.ok)return c.arrayBuffer();throw Error(c.status+" : "+c.url)}}var m,_,y,w,S,v,b=console.log.bind(console),I=console.error.bind(console),k=b,T=I,C=!1,A=o=>o.startsWith("file://");function $(){_t.buffer!=V.buffer&&L()}if(n){let o=function(c){try{var g=c.data,f=g.Vc;if(f==="load"){let x=[];self.onmessage=E=>x.push(E),v=()=>{postMessage({Vc:"loaded"});for(let E of x)o(E);self.onmessage=o};for(let E of g.Ad)t[E]&&!t[E].proxy||(t[E]=(...M)=>{postMessage({Vc:"callHandler",yd:E,args:M})},E=="print"&&(k=t[E]),E=="printErr"&&(T=t[E]));_t=g.Rd,L(),_=g.Sd,me(),Lr()}else if(f==="run"){(function(x){var E=($(),K)[x+52>>>2>>>0];x=($(),K)[x+56>>>2>>>0],co(E,E-x),ge(E)})(g.Uc),Oi(g.Uc,0,0,1,0,0),Kt(),Si(g.Uc),N||(no(),N=!0);try{fg(g.Pd,g.ed)}catch(x){if(x!="unwind")throw x}}else g.target!=="setimmediate"&&(f==="checkMailbox"?N&&Rr():f&&(T(`worker: received unknown command ${f}`),T(g)))}catch(x){throw ao(),x}};var N=!1;self.onunhandledrejection=c=>{throw c.reason||c},self.onmessage=o}var V,F,Y,H,D,K,z,j,X,O,B,R=!1;function L(){var o=_t.buffer;t.HEAP8=V=new Int8Array(o),Y=new Int16Array(o),t.HEAPU8=F=new Uint8Array(o),H=new Uint16Array(o),t.HEAP32=D=new Int32Array(o),t.HEAPU32=K=new Uint32Array(o),z=new Float32Array(o),j=new Float64Array(o),X=new BigInt64Array(o),O=new BigUint64Array(o)}function U(){R=!0,n?v():pt.ub()}function W(o){throw T(o="Aborted("+o+")"),C=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),S==null||S(o),o}function Q(){return{a:{ma:Ny,hb:By,g:mg,J:gg,f:yg,o:_g,i:bg,$:wg,b:$g,S:vg,Ha:gs,n:xg,aa:ws,Ya:$s,Da:vs,Fa:xs,Za:Ss,Wa:ks,Pa:Ts,Va:Is,ka:Es,Ea:Cs,Ba:As,Xa:zs,Ca:Os,cb:Sg,fa:kg,wa:Tg,ua:Eg,ea:Ag,N:zg,H:Og,va:Rg,_:Lg,xa:Wg,Sa:qg,za:Gg,Ia:Fg,sa:Hg,ga:jg,Ra:Si,$a:Kg,Q:Qg,r:iy,c:vi,ib:ny,y:ay,M:sy,D:oy,l:uy,s:Ls,jb:ly,I:dy,R:cy,j:py,u:hy,q:fy,k:my,Ma:gy,Na:yy,Oa:_y,Ka:Gs,La:Fs,ta:Hs,eb:wy,bb:vy,v:xy,ba:Sy,ha:ky,ab:$y,V:Ty,_a:Iy,Aa:Ey,F:by,U:Cy,la:Pr,ya:zy,gb:Ay,fb:Oy,Ta:Zs,Ua:Xs,Ga:qe,T:Qs,Ja:Js,ja:eo,Qa:to,ia:ro,lb:w0,na:m0,mb:b0,oa:f0,G:i0,e:Wy,t:Uy,w:Py,B:Xy,nb:c0,Z:d0,x:Gy,pa:p0,X:g0,ca:l0,ob:u0,pb:o0,O:Qy,qb:a0,qa:s0,rb:n0,L:t0,Y:h0,d:Ly,A:Vy,m:qy,kb:$0,p:Hy,z:jy,C:Fy,E:Ky,K:Jy,ra:r0,P:y0,da:e0,W:_0,sb:Zy,tb:Yy,h:My,a:_t,db:Oe}}}async function me(){function o(f,x){var E=pt=f.exports;f={};for(let[M,q]of Object.entries(E))typeof q=="function"?(E=Yg(q),f[M]=E):f[M]=q;return pt=f,pt=(function(){var M=pt,q=te=>fe=>te(fe)>>>0,J=te=>()=>te()>>>0;return(M=Object.assign({},M)).vb=q(M.vb),M.Zb=J(M.Zb),M.$b=q(M.$b),M.nc=q(M.nc),M.oc=J(M.oc),M.sc=q(M.sc),M})(),Ve.push(pt.ac),io=(f=pt).vb,no=f.wb,t._OrtInit=f.xb,t._OrtGetLastError=f.yb,t._OrtCreateSessionOptions=f.zb,t._OrtAppendExecutionProvider=f.Ab,t._OrtAddFreeDimensionOverride=f.Bb,t._OrtAddSessionConfigEntry=f.Cb,t._OrtReleaseSessionOptions=f.Db,t._OrtCreateSession=f.Eb,t._OrtReleaseSession=f.Fb,t._OrtGetInputOutputCount=f.Gb,t._OrtGetInputOutputMetadata=f.Hb,t._OrtFree=f.Ib,t._OrtCreateTensor=f.Jb,t._OrtGetTensorData=f.Kb,t._OrtReleaseTensor=f.Lb,t._OrtCreateRunOptions=f.Mb,t._OrtAddRunConfigEntry=f.Nb,t._OrtReleaseRunOptions=f.Ob,t._OrtCreateBinding=f.Pb,t._OrtBindInput=f.Qb,t._OrtBindOutput=f.Rb,t._OrtClearBoundOutputs=f.Sb,t._OrtReleaseBinding=f.Tb,t._OrtRunWithBinding=f.Ub,t._OrtRun=f.Vb,t._OrtEndProfiling=f.Wb,t._JsepOutput=f.Xb,t._JsepGetNodeName=f.Yb,Ur=f.Zb,ot=t._free=f._b,sr=t._malloc=f.$b,Oi=f.cc,ao=f.dc,so=f.ec,oo=f.fc,Ri=f.gc,uo=f.hc,lo=f.ic,_e=f.jc,or=f.kc,co=f.lc,ge=f.mc,Mi=f.nc,ye=f.oc,po=f.pc,Di=f.qc,ho=f.rc,fo=f.sc,mo=f.tc,Bi=f.uc,go=f.vc,yo=f.wc,_o=f.xc,bo=f.yc,wo=f.zc,$o=f.Ac,vo=f.Bc,xo=f.Cc,So=f.Dc,ko=f.Ec,To=f.Fc,Io=f.Gc,Eo=f.Hc,Co=f.Ic,Ao=f.Jc,zo=f.Kc,Oo=f.Lc,Ro=f.Mc,Mo=f.Nc,Do=f.Oc,Bo=f.Pc,No=f.Qc,Po=f.Sc,Uo=f.Tc,Lo=f.cd,Wo=f.dd,qo=f.id,Vo=f.nd,Go=f.od,Fo=f.pd,Ho=f.qd,jo=f.rd,Ko=f.sd,Yo=f.td,Zo=f.ud,Xo=f.zd,Qo=f.Zd,Jo=f._d,eu=f.$d,tu=f.ae,_=x,pt}var c,g=Q();return t.instantiateWasm?new Promise(f=>{t.instantiateWasm(g,(x,E)=>{f(o(x,E))})}):n?o(new WebAssembly.Instance(_,Q()),_):(B??(B=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",p):p+"ort-wasm-simd-threaded.jsep.wasm":new URL("ort-wasm-simd-threaded.jsep.wasm",self.location.href).href),c=await(async function(f){var x=B;if(!m&&!A(x))try{var E=fetch(x,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(E,f)}catch(M){T(`wasm streaming compile failed: ${M}`),T("falling back to ArrayBuffer instantiation")}return(async function(M,q){try{var J=await(async function(te){if(!m)try{var fe=await u(te);return new Uint8Array(fe)}catch{}if(te==B&&m)te=new Uint8Array(m);else{if(!l)throw"both async and sync fetching of the wasm failed";te=l(te)}return te})(M);return await WebAssembly.instantiate(J,q)}catch(te){T(`failed to asynchronously prepare wasm: ${te}`),W(te)}})(x,f)})(g),o(c.instance,c.module))}class he{constructor(c){Ke(this,"name","ExitStatus");this.message=`Program terminated with exit(${c})`,this.status=c}}var ue=o=>{o.terminate(),o.onmessage=()=>{}},ee=[],ae=0,ce=null,Ee=o=>{Ue.length==0&&(ps(),Er(Ue[0]));var c=Ue.pop();if(!c)return 6;yt.push(c),Ne[o.Uc]=c,c.Uc=o.Uc;var g={Vc:"run",Pd:o.Od,ed:o.ed,Uc:o.Uc};return c.postMessage(g,o.md),0},pe=0,ie=(o,c,...g)=>{var f,x=16*g.length,E=ye(),M=Mi(x),q=M>>>3;for(f of g)typeof f=="bigint"?(($(),X)[q++>>>0]=1n,($(),X)[q++>>>0]=f):(($(),X)[q++>>>0]=0n,($(),j)[q++>>>0]=f);return o=so(o,0,x,M,c),ge(E),o};function Oe(o){if(n)return ie(0,1,o);if(y=o,!(0<pe)){for(var c of yt)ue(c);for(c of Ue)ue(c);Ue=[],yt=[],Ne={},C=!0}d(0,new he(o))}function We(o){if(n)return ie(1,0,o);qe(o)}var qe=o=>{if(y=o,n)throw We(o),"unwind";Oe(o)},Ue=[],yt=[],Ve=[],Ne={},dt=o=>{var c=o.Uc;delete Ne[c],Ue.push(o),yt.splice(yt.indexOf(o),1),o.Uc=0,oo(c)};function Kt(){Ve.forEach(o=>o())}var Er=o=>new Promise(c=>{o.onmessage=x=>{var E=x.data;if(x=E.Vc,E.bd&&E.bd!=Ur()){var M=Ne[E.bd];M?M.postMessage(E,E.md):T(`Internal error! Worker sent a message "${x}" to target pthread ${E.bd}, but that thread no longer exists!`)}else x==="checkMailbox"?Rr():x==="spawnThread"?Ee(E):x==="cleanupThread"?Or(()=>{dt(Ne[E.Qd])}):x==="loaded"?(o.loaded=!0,c(o)):E.target==="setimmediate"?o.postMessage(E):x==="uncaughtException"?o.onerror(E.error):x==="callHandler"?t[E.yd](...E.args):x&&T(`worker sent an unknown command ${x}`)},o.onerror=x=>{throw T(`worker sent an error! ${x.filename}:${x.lineno}: ${x.message}`),x};var g,f=[];for(g of[])t.propertyIsEnumerable(g)&&f.push(g);o.postMessage({Vc:"load",Ad:f,Rd:_t,Sd:_})});function ps(){var o=new Worker((()=>{let c=URL;return self.location.href>"file:"&&self.location.href<"file;"?new c("ort.bundle.min.mjs",self.location.href):new URL(self.location.href)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});Ue.push(o)}var _t,fg=(o,c)=>{pe=0,o=Bi(o,c),0<pe?y=o:Ri(o)},Cr=[],Ar=0;function mg(o){var c=new _i(o>>>=0);return($(),V)[c.Wc+12>>>0]==0&&(hs(c,!0),Ar--),fs(c,!1),Cr.push(c),fo(o)}var Yt=0,gg=()=>{_e(0,0);var o=Cr.pop();po(o.gd),Yt=0};function hs(o,c){c=c?1:0,($(),V)[o.Wc+12>>>0]=c}function fs(o,c){c=c?1:0,($(),V)[o.Wc+13>>>0]=c}class _i{constructor(c){this.gd=c,this.Wc=c-24}}var bi=o=>{var c=Yt;if(!c)return or(0),0;var g=new _i(c);($(),K)[g.Wc+16>>>2>>>0]=c;var f=($(),K)[g.Wc+4>>>2>>>0];if(!f)return or(0),c;for(var x of o){if(x===0||x===f)break;if(ho(x,f,g.Wc+16))return or(x),c}return or(f),c};function yg(){return bi([])}function _g(o){return bi([o>>>0])}function bg(o,c,g,f){return bi([o>>>0,c>>>0,g>>>0,f>>>0])}var wg=()=>{var o=Cr.pop();o||W("no exception to throw");var c=o.gd;throw($(),V)[o.Wc+13>>>0]==0&&(Cr.push(o),fs(o,!0),hs(o,!1),Ar++),Di(c),Yt=c};function $g(o,c,g){var f=new _i(o>>>=0);throw c>>>=0,g>>>=0,($(),K)[f.Wc+16>>>2>>>0]=0,($(),K)[f.Wc+4>>>2>>>0]=c,($(),K)[f.Wc+8>>>2>>>0]=g,Di(o),Ar++,Yt=o}var vg=()=>Ar;function ms(o,c,g,f){return n?ie(2,1,o,c,g,f):gs(o,c,g,f)}function gs(o,c,g,f){if(o>>>=0,c>>>=0,g>>>=0,f>>>=0,!globalThis.SharedArrayBuffer)return 6;var x=[];return n&&x.length===0?ms(o,c,g,f):(o={Od:g,Uc:o,ed:f,md:x},n?(o.Vc="spawnThread",postMessage(o,x),0):Ee(o))}function xg(o){throw Yt||(Yt=o>>>0),Yt}var ys=globalThis.TextDecoder&&new TextDecoder,_s=(o,c,g,f)=>{if(g=c+g,f)return g;for(;o[c]&&!(c>=g);)++c;return c},bs=(o,c=0,g,f)=>{if(16<(g=_s(o,c>>>=0,g,f))-c&&o.buffer&&ys)return ys.decode(o.buffer instanceof ArrayBuffer?o.subarray(c,g):o.slice(c,g));for(f="";c<g;){var x=o[c++];if(128&x){var E=63&o[c++];if((224&x)==192)f+=String.fromCharCode((31&x)<<6|E);else{var M=63&o[c++];65536>(x=(240&x)==224?(15&x)<<12|E<<6|M:(7&x)<<18|E<<12|M<<6|63&o[c++])?f+=String.fromCharCode(x):(x-=65536,f+=String.fromCharCode(55296|x>>10,56320|1023&x))}}else f+=String.fromCharCode(x)}return f},ze=(o,c,g)=>(o>>>=0)?bs(($(),F),o,c,g):"";function ws(o,c,g){return n?ie(3,1,o,c,g):0}function $s(o,c){if(n)return ie(4,1,o,c)}function vs(o,c){if(n)return ie(5,1,o,c)}function xs(o,c,g){if(n)return ie(6,1,o,c,g)}function Ss(o,c,g){return n?ie(7,1,o,c,g):0}function ks(o,c){if(n)return ie(8,1,o,c)}function Ts(o,c,g){if(n)return ie(9,1,o,c,g)}function Is(o,c,g,f){if(n)return ie(10,1,o,c,g,f)}function Es(o,c,g,f){if(n)return ie(11,1,o,c,g,f)}function Cs(o,c,g,f){if(n)return ie(12,1,o,c,g,f)}function As(o){if(n)return ie(13,1,o)}function zs(o,c){if(n)return ie(14,1,o,c)}function Os(o,c,g){if(n)return ie(15,1,o,c,g)}var Sg=()=>W(""),at=o=>{o>>>=0;for(var c="";;){var g=($(),F)[o++>>>0];if(!g)return c;c+=String.fromCharCode(g)}},wi={},$i={},Zt=class extends Error{constructor(o){super(o),this.name="BindingError"}};function ct(o,c,g={}){return(function(f,x,E={}){var M=x.name;if(!f)throw new Zt(`type "${M}" must have a positive integer typeid pointer`);if($i.hasOwnProperty(f)){if(E.Bd)return;throw new Zt(`Cannot register type '${M}' twice`)}$i[f]=x,wi.hasOwnProperty(f)&&(x=wi[f],delete wi[f],x.forEach(q=>q()))})(o,c,g)}var Rs=(o,c,g)=>{switch(c){case 1:return g?f=>($(),V)[f>>>0]:f=>($(),F)[f>>>0];case 2:return g?f=>($(),Y)[f>>>1>>>0]:f=>($(),H)[f>>>1>>>0];case 4:return g?f=>($(),D)[f>>>2>>>0]:f=>($(),K)[f>>>2>>>0];case 8:return g?f=>($(),X)[f>>>3>>>0]:f=>($(),O)[f>>>3>>>0];default:throw new TypeError(`invalid integer width (${c}): ${o}`)}};function kg(o,c,g,f,x){o>>>=0,g>>>=0,c=at(c>>>0);let E=M=>M;if(f=f===0n){let M=8*g;E=q=>BigInt.asUintN(M,q),x=E(x)}ct(o,{name:c,Rc:E,Yc:(M,q)=>(typeof q=="number"&&(q=BigInt(q)),q),Xc:Rs(c,g,!f),Zc:null})}function Tg(o,c,g,f){ct(o>>>=0,{name:c=at(c>>>0),Rc:function(x){return!!x},Yc:function(x,E){return E?g:f},Xc:function(x){return this.Rc(($(),F)[x>>>0])},Zc:null})}var Ms=[],At=[0,1,,1,null,1,!0,1,!1,1];function vi(o){9<(o>>>=0)&&--At[o+1]===0&&(At[o]=void 0,Ms.push(o))}var je=o=>{if(!o)throw new Zt(`Cannot use deleted val. handle = ${o}`);return At[o]},Xe=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let c=Ms.pop()||At.length;return At[c]=o,At[c+1]=1,c}};function xi(o){return this.Rc(($(),K)[o>>>2>>>0])}var Ig={name:"emscripten::val",Rc:o=>{var c=je(o);return vi(o),c},Yc:(o,c)=>Xe(c),Xc:xi,Zc:null};function Eg(o){return ct(o>>>0,Ig)}var Cg=(o,c)=>{switch(c){case 4:return function(g){return this.Rc(($(),z)[g>>>2>>>0])};case 8:return function(g){return this.Rc(($(),j)[g>>>3>>>0])};default:throw new TypeError(`invalid float width (${c}): ${o}`)}};function Ag(o,c,g){g>>>=0,ct(o>>>=0,{name:c=at(c>>>0),Rc:f=>f,Yc:(f,x)=>x,Xc:Cg(c,g),Zc:null})}function zg(o,c,g,f,x){o>>>=0,g>>>=0,c=at(c>>>0);let E=q=>q;if(f===0){var M=32-8*g;E=q=>q<<M>>>M,x=E(x)}ct(o,{name:c,Rc:E,Yc:(q,J)=>J,Xc:Rs(c,g,f!==0),Zc:null})}function Og(o,c,g){function f(E){var M=($(),K)[E>>>2>>>0];return E=($(),K)[E+4>>>2>>>0],new x(($(),V).buffer,E,M)}var x=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][c];ct(o>>>=0,{name:g=at(g>>>0),Rc:f,Xc:f},{Bd:!0})}var bt=(o,c,g)=>{var f=($(),F);if(c>>>=0,0<g){var x=c;g=c+g-1;for(var E=0;E<o.length;++E){var M=o.codePointAt(E);if(127>=M){if(c>=g)break;f[c++>>>0]=M}else if(2047>=M){if(c+1>=g)break;f[c++>>>0]=192|M>>6,f[c++>>>0]=128|63&M}else if(65535>=M){if(c+2>=g)break;f[c++>>>0]=224|M>>12,f[c++>>>0]=128|M>>6&63,f[c++>>>0]=128|63&M}else{if(c+3>=g)break;f[c++>>>0]=240|M>>18,f[c++>>>0]=128|M>>12&63,f[c++>>>0]=128|M>>6&63,f[c++>>>0]=128|63&M,E++}}f[c>>>0]=0,o=c-x}else o=0;return o},zr=o=>{for(var c=0,g=0;g<o.length;++g){var f=o.charCodeAt(g);127>=f?c++:2047>=f?c+=2:55296<=f&&57343>=f?(c+=4,++g):c+=3}return c};function Rg(o,c){ct(o>>>=0,{name:c=at(c>>>0),Rc(g){var f=($(),K)[g>>>2>>>0];return f=ze(g+4,f,!0),ot(g),f},Yc(g,f){f instanceof ArrayBuffer&&(f=new Uint8Array(f));var x=typeof f=="string";if(!(x||ArrayBuffer.isView(f)&&f.BYTES_PER_ELEMENT==1))throw new Zt("Cannot pass non-string to std::string");var E=x?zr(f):f.length,M=sr(4+E+1),q=M+4;return($(),K)[M>>>2>>>0]=E,x?bt(f,q,E+1):($(),F).set(f,q>>>0),g!==null&&g.push(ot,M),M},Xc:xi,Zc(g){ot(g)}})}var Ds=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,Mg=(o,c,g)=>{if(o>>>=1,16<(c=_s(($(),H),o,c/2,g))-o&&Ds)return Ds.decode(($(),H).slice(o,c));for(g="";o<c;++o){var f=($(),H)[o>>>0];g+=String.fromCharCode(f)}return g},Dg=(o,c,g)=>{if(g??(g=2147483647),2>g)return 0;var f=c;g=(g-=2)<2*o.length?g/2:o.length;for(var x=0;x<g;++x){var E=o.charCodeAt(x);($(),Y)[c>>>1>>>0]=E,c+=2}return($(),Y)[c>>>1>>>0]=0,c-f},Bg=o=>2*o.length,Ng=(o,c,g)=>{var f="";o>>>=2;for(var x=0;!(x>=c/4);x++){var E=($(),K)[o+x>>>0];if(!E&&!g)break;f+=String.fromCodePoint(E)}return f},Pg=(o,c,g)=>{if(c>>>=0,g??(g=2147483647),4>g)return 0;var f=c;g=f+g-4;for(var x=0;x<o.length;++x){var E=o.codePointAt(x);if(65535<E&&x++,($(),D)[c>>>2>>>0]=E,(c+=4)+4>g)break}return($(),D)[c>>>2>>>0]=0,c-f},Ug=o=>{for(var c=0,g=0;g<o.length;++g)65535<o.codePointAt(g)&&g++,c+=4;return c};function Lg(o,c,g){if(o>>>=0,c>>>=0,g=at(g>>>=0),c===2)var f=Mg,x=Dg,E=Bg;else f=Ng,x=Pg,E=Ug;ct(o,{name:g,Rc:M=>{var q=($(),K)[M>>>2>>>0];return q=f(M+4,q*c,!0),ot(M),q},Yc:(M,q)=>{if(typeof q!="string")throw new Zt(`Cannot pass non-string to C++ string type ${g}`);var J=E(q),te=sr(4+J+c);return($(),K)[te>>>2>>>0]=J/c,x(q,te+4,J+c),M!==null&&M.push(ot,te),te},Xc:xi,Zc(M){ot(M)}})}function Wg(o,c){ct(o>>>=0,{Cd:!0,name:c=at(c>>>0),Rc:()=>{},Yc:()=>{}})}function qg(o){Oi(o>>>0,!i,1,!r,131072,!1),Kt()}var Or=o=>{if(!C)try{if(o(),!(0<pe))try{n?Ur()&&Ri(y):qe(y)}catch(c){c instanceof he||c=="unwind"||d(0,c)}}catch(c){c instanceof he||c=="unwind"||d(0,c)}},Vg=!Atomics.waitAsync||((iu=globalThis.navigator)==null?void 0:iu.userAgent)&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function Si(o){o>>>=0,Vg||(Atomics.waitAsync(($(),D),o>>>2,o).value.then(Rr),o+=128,Atomics.store(($(),D),o>>>2,1))}var Rr=()=>Or(()=>{var o=Ur();o&&(Si(o),lo())});function Gg(o,c){(o>>>=0)==c>>>0?setTimeout(Rr):n?postMessage({bd:o,Vc:"checkMailbox"}):(o=Ne[o])&&o.postMessage({Vc:"checkMailbox"})}var ki=[];function Fg(o,c,g,f,x){for(c>>>=0,x>>>=0,ki.length=0,g=x>>>3,f=x+f>>>3;g<f;){var E;E=($(),X)[g++>>>0]?($(),X)[g++>>>0]:($(),j)[g++>>>0],ki.push(E)}return(c?Ni[c]:Dy[o])(...ki)}var Hg=()=>{pe=0};function jg(o){o>>>=0,n?postMessage({Vc:"cleanupThread",Qd:o}):dt(Ne[o])}function Kg(o){}var Mr=o=>{try{o()}catch(c){W(c)}};function Yg(o){var c=(...g)=>{Dr.push(o);try{return o(...g)}finally{C||(Dr.pop(),st&&wt===1&&Dr.length===0&&(wt=0,pe+=1,Mr(Jo),typeof Fibers<"u"&&Fibers.de()))}};return Ps.set(o,c),c}var wt=0,st=null,Bs=0,Dr=[],Ti=new Map,Ns=new Map,Ps=new Map,Zg=0,Ii=null,Xg=[],Us=o=>(function(c){if(!C){if(wt===0){var g=!1,f=!1;c((x=0)=>{if(!C&&(Bs=x,g=!0,f)){wt=2,Mr(()=>eu(st)),typeof MainLoop<"u"&&MainLoop.xd&&MainLoop.resume(),x=!1;try{var E=(function(){var J=($(),D)[st+8>>>2>>>0];return J=Ns.get(J),J=Ps.get(J),--pe,J()})()}catch(J){E=J,x=!0}var M=!1;if(!st){var q=Ii;q&&(Ii=null,(x?q.reject:q.resolve)(E),M=!0)}if(x&&!M)throw E}}),f=!0,g||(wt=1,st=(function(){var x=sr(65548),E=x+12;if(($(),K)[x>>>2>>>0]=E,($(),K)[x+4>>>2>>>0]=E+65536,E=Dr[0],!Ti.has(E)){var M=Zg++;Ti.set(E,M),Ns.set(M,E)}return E=Ti.get(E),($(),D)[x+8>>>2>>>0]=E,x})(),typeof MainLoop<"u"&&MainLoop.xd&&MainLoop.pause(),Mr(()=>Qo(st)))}else wt===2?(wt=0,Mr(tu),ot(st),st=null,Xg.forEach(Or)):W(`invalid state: ${wt}`);return Bs}})(c=>{o().then(c)});function Qg(o){return o>>>=0,Us(async()=>{var c=await je(o);return Xe(c)})}var Ei=[],Jg=o=>{var c=Ei.length;return Ei.push(o),c},ey=(o,c)=>{for(var g=Array(o),f=0;f<o;++f){var x=f,E=($(),K)[c+4*f>>>2>>>0],M=$i[E];if(M===void 0)throw o=`parameter ${f}`,E=io(E),c=at(E),ot(E),new Zt(`${o} has unknown type ${c}`);g[x]=M}return g},ty=(o,c,g)=>{var f=[];return o=o(f,g),f.length&&(($(),K)[c>>>2>>>0]=Xe(f)),o},ry={},Br=o=>{var c=ry[o];return c===void 0?at(o):c};function iy(o,c,g){var[f,...x]=ey(o,c>>>0);c=f.Yc.bind(f);var E=x.map(J=>J.Xc.bind(J));o--;var M={toValue:je};switch(o=E.map((J,te)=>{var fe=`argFromPtr${te}`;return M[fe]=J,`${fe}(args${te?"+"+8*te:""})`}),g){case 0:var q="toValue(handle)";break;case 2:q="new (toValue(handle))";break;case 3:q="";break;case 1:M.getStringOrSymbol=Br,q="toValue(handle)[getStringOrSymbol(methodName)]"}return q+=`(${o})`,f.Cd||(M.toReturnWire=c,M.emval_returnValue=ty,q=`return emval_returnValue(toReturnWire, destructorsRef, ${q})`),q=`return function (handle, methodName, destructorsRef, args) {
  ${q}
  }`,g=new Function(Object.keys(M),q)(...Object.values(M)),q=`methodCaller<(${x.map(J=>J.name)}) => ${f.name}>`,Jg(Object.defineProperty(g,"name",{value:q}))}function ny(o,c){return c>>>=0,(o=je(o>>>0))==je(c)}function ay(o){return(o>>>=0)?(o=Br(o),Xe(globalThis[o])):Xe(globalThis)}function sy(o){return o=Br(o>>>0),Xe(t[o])}function oy(o,c){return c>>>=0,o=je(o>>>0),c=je(c),Xe(o[c])}function uy(o){9<(o>>>=0)&&(At[o+1]+=1)}function Ls(o,c,g,f,x){return Ei[o>>>0](c>>>0,g>>>0,f>>>0,x>>>0)}function ly(o,c,g,f,x){return Ls(o>>>0,c>>>0,g>>>0,f>>>0,x>>>0)}function dy(){return Xe([])}function cy(o){o=je(o>>>0);for(var c=Array(o.length),g=0;g<o.length;g++)c[g]=o[g];return Xe(c)}function py(o){return Xe(Br(o>>>0))}function hy(){return Xe({})}function fy(o){for(var c=je(o>>>=0);c.length;){var g=c.pop();c.pop()(g)}vi(o)}function my(o,c,g){c>>>=0,g>>>=0,o=je(o>>>0),c=je(c),g=je(g),o[c]=g}function gy(o,c){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),c>>>=0,o=new Date(1e3*o),($(),D)[c>>>2>>>0]=o.getUTCSeconds(),($(),D)[c+4>>>2>>>0]=o.getUTCMinutes(),($(),D)[c+8>>>2>>>0]=o.getUTCHours(),($(),D)[c+12>>>2>>>0]=o.getUTCDate(),($(),D)[c+16>>>2>>>0]=o.getUTCMonth(),($(),D)[c+20>>>2>>>0]=o.getUTCFullYear()-1900,($(),D)[c+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,($(),D)[c+28>>>2>>>0]=o}var Ws=o=>o%4==0&&(o%100!=0||o%400==0),qs=[0,31,60,91,121,152,182,213,244,274,305,335],Vs=[0,31,59,90,120,151,181,212,243,273,304,334];function yy(o,c){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),c>>>=0,o=new Date(1e3*o),($(),D)[c>>>2>>>0]=o.getSeconds(),($(),D)[c+4>>>2>>>0]=o.getMinutes(),($(),D)[c+8>>>2>>>0]=o.getHours(),($(),D)[c+12>>>2>>>0]=o.getDate(),($(),D)[c+16>>>2>>>0]=o.getMonth(),($(),D)[c+20>>>2>>>0]=o.getFullYear()-1900,($(),D)[c+24>>>2>>>0]=o.getDay();var g=(Ws(o.getFullYear())?qs:Vs)[o.getMonth()]+o.getDate()-1|0;($(),D)[c+28>>>2>>>0]=g,($(),D)[c+36>>>2>>>0]=-60*o.getTimezoneOffset(),g=new Date(o.getFullYear(),6,1).getTimezoneOffset();var f=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(g!=f&&o.getTimezoneOffset()==Math.min(f,g)),($(),D)[c+32>>>2>>>0]=o}function _y(o){o>>>=0;var c=new Date(($(),D)[o+20>>>2>>>0]+1900,($(),D)[o+16>>>2>>>0],($(),D)[o+12>>>2>>>0],($(),D)[o+8>>>2>>>0],($(),D)[o+4>>>2>>>0],($(),D)[o>>>2>>>0],0),g=($(),D)[o+32>>>2>>>0],f=c.getTimezoneOffset(),x=new Date(c.getFullYear(),6,1).getTimezoneOffset(),E=new Date(c.getFullYear(),0,1).getTimezoneOffset(),M=Math.min(E,x);return 0>g?($(),D)[o+32>>>2>>>0]=+(x!=E&&M==f):0<g!=(M==f)&&(x=Math.max(E,x),c.setTime(c.getTime()+6e4*((0<g?M:x)-f))),($(),D)[o+24>>>2>>>0]=c.getDay(),g=(Ws(c.getFullYear())?qs:Vs)[c.getMonth()]+c.getDate()-1|0,($(),D)[o+28>>>2>>>0]=g,($(),D)[o>>>2>>>0]=c.getSeconds(),($(),D)[o+4>>>2>>>0]=c.getMinutes(),($(),D)[o+8>>>2>>>0]=c.getHours(),($(),D)[o+12>>>2>>>0]=c.getDate(),($(),D)[o+16>>>2>>>0]=c.getMonth(),($(),D)[o+20>>>2>>>0]=c.getYear(),o=c.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function Gs(o,c,g,f,x,E,M){return n?ie(16,1,o,c,g,f,x,E,M):-52}function Fs(o,c,g,f,x,E){if(n)return ie(17,1,o,c,g,f,x,E)}var ar={},by=()=>performance.timeOrigin+performance.now();function Hs(o,c){if(n)return ie(18,1,o,c);if(ar[o]&&(clearTimeout(ar[o].id),delete ar[o]),!c)return 0;var g=setTimeout(()=>{delete ar[o],Or(()=>uo(o,performance.timeOrigin+performance.now()))},c);return ar[o]={id:g,ce:c},0}function wy(o,c,g,f){o>>>=0,c>>>=0,g>>>=0,f>>>=0;var x=new Date().getFullYear(),E=new Date(x,0,1).getTimezoneOffset();x=new Date(x,6,1).getTimezoneOffset();var M=Math.max(E,x);($(),K)[o>>>2>>>0]=60*M,($(),D)[c>>>2>>>0]=+(E!=x),o=(c=q=>{var J=Math.abs(q);return`UTC${0<=q?"-":"+"}${String(Math.floor(J/60)).padStart(2,"0")}${String(J%60).padStart(2,"0")}`})(E),c=c(x),x<E?(bt(o,g,17),bt(c,f,17)):(bt(o,f,17),bt(c,g,17))}var $y=()=>Date.now();function vy(o,c,g){return g>>>=0,0<=o&&3>=o?(o===0?o=Date.now():o=performance.timeOrigin+performance.now(),o=Math.round(1e6*o),($(),X)[g>>>3>>>0]=BigInt(o),0):28}var Ci=[],js=(o,c)=>{Ci.length=0;for(var g;g=($(),F)[o++>>>0];){var f=g!=105;c+=(f&=g!=112)&&c%8?4:0,Ci.push(g==112?($(),K)[c>>>2>>>0]:g==106?($(),X)[c>>>3>>>0]:g==105?($(),D)[c>>>2>>>0]:($(),j)[c>>>3>>>0]),c+=f?8:4}return Ci};function xy(o,c,g){return o>>>=0,c=js(c>>>0,g>>>0),Ni[o](...c)}function Sy(o,c,g){return o>>>=0,c=js(c>>>0,g>>>0),Ni[o](...c)}var ky=()=>{};function Ty(o,c){return T(ze(o>>>0,c>>>0))}var Iy=()=>{throw pe+=1,"unwind"};function Ey(){return 4294901760}var Cy=()=>navigator.hardwareConcurrency,zt={},Nr=o=>{var c;return(c=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(o))?+c[1]:(c=/:(\d+):\d+(?:\)|$)/.exec(o))?2147483648|+c[1]:0},Ks=o=>{for(var c of o)(o=Nr(c))&&(zt[o]=c)};function Ay(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),Ks(o),zt.kd=Nr(o[3]),zt.Md=o,zt.kd}function Pr(o){if(!(o=zt[o>>>0]))return 0;var c;if(c=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(o))o=c[1];else if(c=/^\s+at (.*) \(.*\)$/.exec(o))o=c[1];else{if(!(c=/^(.+?)@/.exec(o)))return 0;o=c[1]}ot(Pr.ld??0),c=zr(o)+1;var g=sr(c);return g&&bt(o,g,c),Pr.ld=g,Pr.ld}function zy(o){o>>>=0;var c=($(),F).length;if(o<=c||4294901760<o)return!1;for(var g=1;4>=g;g*=2){var f=c*(1+.2/g);f=Math.min(f,o+100663296);e:{f=(Math.min(4294901760,65536*Math.ceil(Math.max(o,f)/65536))-_t.buffer.byteLength+65535)/65536|0;try{_t.grow(f),L();var x=1;break e}catch{}x=void 0}if(x)return!0}return!1}function Oy(o,c,g){if(o>>>=0,c>>>=0,zt.kd==o)var f=zt.Md;else(f=Error().stack.toString().split(`
`))[0]=="Error"&&f.shift(),Ks(f);for(var x=3;f[x]&&Nr(f[x])!=o;)++x;for(o=0;o<g&&f[o+x];++o)($(),D)[c+4*o>>>2>>>0]=Nr(f[o+x]);return o}var Ai,zi={},Ys=()=>{var f;if(!Ai){var o,c={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(((f=globalThis.navigator)==null?void 0:f.language)??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in zi)zi[o]===void 0?delete c[o]:c[o]=zi[o];var g=[];for(o in c)g.push(`${o}=${c[o]}`);Ai=g}return Ai};function Zs(o,c){if(n)return ie(19,1,o,c);o>>>=0,c>>>=0;var g,f=0,x=0;for(g of Ys()){var E=c+f;($(),K)[o+x>>>2>>>0]=E,f+=bt(g,E,1/0)+1,x+=4}return 0}function Xs(o,c){if(n)return ie(20,1,o,c);o>>>=0,c>>>=0;var g=Ys();for(var f of(($(),K)[o>>>2>>>0]=g.length,o=0,g))o+=zr(f)+1;return($(),K)[c>>>2>>>0]=o,0}function Qs(o){return n?ie(21,1,o):52}function Js(o,c,g,f,x){return n?ie(22,1,o,c,g,f,x):52}function eo(o,c,g,f){return n?ie(23,1,o,c,g,f):52}function to(o,c,g,f){return n?ie(24,1,o,c,g,f):70}var Ry=[null,[],[]];function ro(o,c,g,f){if(n)return ie(25,1,o,c,g,f);c>>>=0,g>>>=0,f>>>=0;for(var x=0,E=0;E<g;E++){var M=($(),K)[c>>>2>>>0],q=($(),K)[c+4>>>2>>>0];c+=8;for(var J=0;J<q;J++){var te=o,fe=($(),F)[M+J>>>0],we=Ry[te];fe===0||fe===10?((te===1?k:T)(bs(we)),we.length=0):we.push(fe)}x+=q}return($(),K)[f>>>2>>>0]=x,0}function My(o){return o>>>0}n||(function(){for(var o=t.numThreads-1;o--;)ps();ee.push(async()=>{var c=(async function(){if(!n)return Promise.all(Ue.map(Er))})();ae++,await c,--ae==0&&ce&&(c=ce,ce=null,c())})})(),n||(_t=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),L()),t.wasmBinary&&(m=t.wasmBinary),t.stackSave=()=>ye(),t.stackRestore=o=>ge(o),t.stackAlloc=o=>Mi(o),t.setValue=function(o,c,g="i8"){switch(g.endsWith("*")&&(g="*"),g){case"i1":case"i8":($(),V)[o>>>0]=c;break;case"i16":($(),Y)[o>>>1>>>0]=c;break;case"i32":($(),D)[o>>>2>>>0]=c;break;case"i64":($(),X)[o>>>3>>>0]=BigInt(c);break;case"float":($(),z)[o>>>2>>>0]=c;break;case"double":($(),j)[o>>>3>>>0]=c;break;case"*":($(),K)[o>>>2>>>0]=c;break;default:W(`invalid type for setValue: ${g}`)}},t.getValue=function(o,c="i8"){switch(c.endsWith("*")&&(c="*"),c){case"i1":case"i8":return($(),V)[o>>>0];case"i16":return($(),Y)[o>>>1>>>0];case"i32":return($(),D)[o>>>2>>>0];case"i64":return($(),X)[o>>>3>>>0];case"float":return($(),z)[o>>>2>>>0];case"double":return($(),j)[o>>>3>>>0];case"*":return($(),K)[o>>>2>>>0];default:W(`invalid type for getValue: ${c}`)}},t.UTF8ToString=ze,t.stringToUTF8=bt,t.lengthBytesUTF8=zr;var io,no,Ur,ot,sr,Oi,ao,so,oo,Ri,uo,lo,_e,or,co,ge,Mi,ye,po,Di,ho,fo,mo,Bi,go,yo,_o,bo,wo,$o,vo,xo,So,ko,To,Io,Eo,Co,Ao,zo,Oo,Ro,Mo,Do,Bo,No,Po,Uo,Lo,Wo,qo,Vo,Go,Fo,Ho,jo,Ko,Yo,Zo,Xo,Qo,Jo,eu,tu,pt,Dy=[Oe,We,ms,ws,$s,vs,xs,Ss,ks,Ts,Is,Es,Cs,As,zs,Os,Gs,Fs,Hs,Zs,Xs,Qs,Js,eo,to,ro],Ni={1086876:(o,c,g,f,x)=>{if(t===void 0||!t.ad)return 1;if((o=ze(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=t.ad.get(o)))return 2;if(c=Number(c>>>0),g=Number(g>>>0),f=Number(f>>>0),c+g>o.byteLength)return 3;try{let E=o.subarray(c,c+g);switch(x){case 0:($(),F).set(E,f>>>0);break;case 1:t.Td?t.Td(f,E):t.Ld(f,E);break;default:return 4}return 0}catch{return 4}},1087700:(o,c,g)=>{t.wd(o,($(),F).subarray(c>>>0,c+g>>>0))},1087764:()=>t.Vd(),1087806:o=>{t.vd(o)},1087843:()=>{t.Ed()},1087874:()=>{t.Fd()},1087903:()=>{t.Jd()},1087928:o=>t.Dd(o),1087961:o=>t.Hd(o),1087993:(o,c,g)=>{t.jd(Number(o),Number(c),Number(g),!0)},1088056:(o,c,g)=>{t.jd(Number(o),Number(c),Number(g))},1088113:()=>typeof wasmOffsetConverter<"u",1088170:o=>{t.bc("Abs",o,void 0)},1088221:o=>{t.bc("Neg",o,void 0)},1088272:o=>{t.bc("Floor",o,void 0)},1088325:o=>{t.bc("Ceil",o,void 0)},1088377:o=>{t.bc("Reciprocal",o,void 0)},1088435:o=>{t.bc("Sqrt",o,void 0)},1088487:o=>{t.bc("Exp",o,void 0)},1088538:o=>{t.bc("Erf",o,void 0)},1088589:o=>{t.bc("Sigmoid",o,void 0)},1088644:(o,c,g)=>{t.bc("HardSigmoid",o,{alpha:c,beta:g})},1088723:o=>{t.bc("HardSwish",o,void 0)},1088780:o=>{t.bc("Log",o,void 0)},1088831:o=>{t.bc("Sin",o,void 0)},1088882:o=>{t.bc("Cos",o,void 0)},1088933:o=>{t.bc("Tan",o,void 0)},1088984:o=>{t.bc("Asin",o,void 0)},1089036:o=>{t.bc("Acos",o,void 0)},1089088:o=>{t.bc("Atan",o,void 0)},1089140:o=>{t.bc("Sinh",o,void 0)},1089192:o=>{t.bc("Cosh",o,void 0)},1089244:o=>{t.bc("Asinh",o,void 0)},1089297:o=>{t.bc("Acosh",o,void 0)},1089350:o=>{t.bc("Atanh",o,void 0)},1089403:o=>{t.bc("Tanh",o,void 0)},1089455:o=>{t.bc("Not",o,void 0)},1089506:(o,c,g)=>{t.bc("Clip",o,{min:c,max:g})},1089575:o=>{t.bc("Clip",o,void 0)},1089627:(o,c)=>{t.bc("Elu",o,{alpha:c})},1089685:o=>{t.bc("Gelu",o,void 0)},1089737:o=>{t.bc("Relu",o,void 0)},1089789:(o,c)=>{t.bc("LeakyRelu",o,{alpha:c})},1089853:(o,c)=>{t.bc("ThresholdedRelu",o,{alpha:c})},1089923:(o,c)=>{t.bc("Cast",o,{to:c})},1089981:o=>{t.bc("Add",o,void 0)},1090032:o=>{t.bc("Sub",o,void 0)},1090083:o=>{t.bc("Mul",o,void 0)},1090134:o=>{t.bc("Div",o,void 0)},1090185:o=>{t.bc("Pow",o,void 0)},1090236:o=>{t.bc("Equal",o,void 0)},1090289:o=>{t.bc("Greater",o,void 0)},1090344:o=>{t.bc("GreaterOrEqual",o,void 0)},1090406:o=>{t.bc("Less",o,void 0)},1090458:o=>{t.bc("LessOrEqual",o,void 0)},1090517:(o,c,g,f,x)=>{t.bc("ReduceMean",o,{keepDims:!!c,noopWithEmptyAxes:!!g,axes:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[]})},1090692:(o,c,g,f,x)=>{t.bc("ReduceMax",o,{keepDims:!!c,noopWithEmptyAxes:!!g,axes:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[]})},1090866:(o,c,g,f,x)=>{t.bc("ReduceMin",o,{keepDims:!!c,noopWithEmptyAxes:!!g,axes:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[]})},1091040:(o,c,g,f,x)=>{t.bc("ReduceProd",o,{keepDims:!!c,noopWithEmptyAxes:!!g,axes:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[]})},1091215:(o,c,g,f,x)=>{t.bc("ReduceSum",o,{keepDims:!!c,noopWithEmptyAxes:!!g,axes:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[]})},1091389:(o,c,g,f,x)=>{t.bc("ReduceL1",o,{keepDims:!!c,noopWithEmptyAxes:!!g,axes:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[]})},1091562:(o,c,g,f,x)=>{t.bc("ReduceL2",o,{keepDims:!!c,noopWithEmptyAxes:!!g,axes:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[]})},1091735:(o,c,g,f,x)=>{t.bc("ReduceLogSum",o,{keepDims:!!c,noopWithEmptyAxes:!!g,axes:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[]})},1091912:(o,c,g,f,x)=>{t.bc("ReduceSumSquare",o,{keepDims:!!c,noopWithEmptyAxes:!!g,axes:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[]})},1092092:(o,c,g,f,x)=>{t.bc("ReduceLogSumExp",o,{keepDims:!!c,noopWithEmptyAxes:!!g,axes:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[]})},1092272:o=>{t.bc("Where",o,void 0)},1092325:(o,c,g)=>{t.bc("Transpose",o,{perm:c?Array.from(($(),D).subarray(Number(c)>>>0,Number(g)>>>0)):[]})},1092449:(o,c,g,f)=>{t.bc("DepthToSpace",o,{blocksize:c,mode:ze(g),format:f?"NHWC":"NCHW"})},1092582:(o,c,g,f)=>{t.bc("DepthToSpace",o,{blocksize:c,mode:ze(g),format:f?"NHWC":"NCHW"})},1092715:(o,c,g,f)=>{t.bc("DFT",o,{axis:c,inverse:g,onesided:f})},1092807:(o,c,g,f,x,E,M,q,J,te,fe,we,ke,Ie,$t)=>{t.bc("ConvTranspose",o,{format:J?"NHWC":"NCHW",autoPad:c,dilations:[g],group:f,kernelShape:[x],pads:[E,M],strides:[q],wIsConst:()=>!!($(),V)[te>>>0],outputPadding:fe?Array.from(($(),D).subarray(Number(fe)>>>0,Number(we)>>>0)):[],outputShape:ke?Array.from(($(),D).subarray(Number(ke)>>>0,Number(Ie)>>>0)):[],activation:ze($t)})},1093240:(o,c,g,f,x,E,M,q,J,te,fe,we,ke,Ie)=>{t.bc("ConvTranspose",o,{format:q?"NHWC":"NCHW",autoPad:c,dilations:Array.from(($(),D).subarray(Number(g)>>>0,(Number(g)>>>0)+2>>>0)),group:f,kernelShape:Array.from(($(),D).subarray(Number(x)>>>0,(Number(x)>>>0)+2>>>0)),pads:Array.from(($(),D).subarray(Number(E)>>>0,(Number(E)>>>0)+4>>>0)),strides:Array.from(($(),D).subarray(Number(M)>>>0,(Number(M)>>>0)+2>>>0)),wIsConst:()=>!!($(),V)[J>>>0],outputPadding:te?Array.from(($(),D).subarray(Number(te)>>>0,Number(fe)>>>0)):[],outputShape:we?Array.from(($(),D).subarray(Number(we)>>>0,Number(ke)>>>0)):[],activation:ze(Ie)})},1093901:(o,c,g,f,x,E,M,q,J,te,fe,we,ke,Ie,$t)=>{t.bc("ConvTranspose",o,{format:J?"NHWC":"NCHW",autoPad:c,dilations:[g],group:f,kernelShape:[x],pads:[E,M],strides:[q],wIsConst:()=>!!($(),V)[te>>>0],outputPadding:fe?Array.from(($(),D).subarray(Number(fe)>>>0,Number(we)>>>0)):[],outputShape:ke?Array.from(($(),D).subarray(Number(ke)>>>0,Number(Ie)>>>0)):[],activation:ze($t)})},1094334:(o,c,g,f,x,E,M,q,J,te,fe,we,ke,Ie)=>{t.bc("ConvTranspose",o,{format:q?"NHWC":"NCHW",autoPad:c,dilations:Array.from(($(),D).subarray(Number(g)>>>0,(Number(g)>>>0)+2>>>0)),group:f,kernelShape:Array.from(($(),D).subarray(Number(x)>>>0,(Number(x)>>>0)+2>>>0)),pads:Array.from(($(),D).subarray(Number(E)>>>0,(Number(E)>>>0)+4>>>0)),strides:Array.from(($(),D).subarray(Number(M)>>>0,(Number(M)>>>0)+2>>>0)),wIsConst:()=>!!($(),V)[J>>>0],outputPadding:te?Array.from(($(),D).subarray(Number(te)>>>0,Number(fe)>>>0)):[],outputShape:we?Array.from(($(),D).subarray(Number(we)>>>0,Number(ke)>>>0)):[],activation:ze(Ie)})},1094995:(o,c)=>{t.bc("GlobalAveragePool",o,{format:c?"NHWC":"NCHW"})},1095086:(o,c,g,f,x,E,M,q,J,te,fe,we,ke,Ie)=>{t.bc("AveragePool",o,{format:Ie?"NHWC":"NCHW",auto_pad:c,ceil_mode:g,count_include_pad:f,storage_order:x,dilations:E?Array.from(($(),D).subarray(Number(E)>>>0,Number(M)>>>0)):[],kernel_shape:q?Array.from(($(),D).subarray(Number(q)>>>0,Number(J)>>>0)):[],pads:te?Array.from(($(),D).subarray(Number(te)>>>0,Number(fe)>>>0)):[],strides:we?Array.from(($(),D).subarray(Number(we)>>>0,Number(ke)>>>0)):[]})},1095565:(o,c)=>{t.bc("GlobalAveragePool",o,{format:c?"NHWC":"NCHW"})},1095656:(o,c,g,f,x,E,M,q,J,te,fe,we,ke,Ie)=>{t.bc("AveragePool",o,{format:Ie?"NHWC":"NCHW",auto_pad:c,ceil_mode:g,count_include_pad:f,storage_order:x,dilations:E?Array.from(($(),D).subarray(Number(E)>>>0,Number(M)>>>0)):[],kernel_shape:q?Array.from(($(),D).subarray(Number(q)>>>0,Number(J)>>>0)):[],pads:te?Array.from(($(),D).subarray(Number(te)>>>0,Number(fe)>>>0)):[],strides:we?Array.from(($(),D).subarray(Number(we)>>>0,Number(ke)>>>0)):[]})},1096135:(o,c)=>{t.bc("GlobalMaxPool",o,{format:c?"NHWC":"NCHW"})},1096222:(o,c,g,f,x,E,M,q,J,te,fe,we,ke,Ie)=>{t.bc("MaxPool",o,{format:Ie?"NHWC":"NCHW",auto_pad:c,ceil_mode:g,count_include_pad:f,storage_order:x,dilations:E?Array.from(($(),D).subarray(Number(E)>>>0,Number(M)>>>0)):[],kernel_shape:q?Array.from(($(),D).subarray(Number(q)>>>0,Number(J)>>>0)):[],pads:te?Array.from(($(),D).subarray(Number(te)>>>0,Number(fe)>>>0)):[],strides:we?Array.from(($(),D).subarray(Number(we)>>>0,Number(ke)>>>0)):[]})},1096697:(o,c)=>{t.bc("GlobalMaxPool",o,{format:c?"NHWC":"NCHW"})},1096784:(o,c,g,f,x,E,M,q,J,te,fe,we,ke,Ie)=>{t.bc("MaxPool",o,{format:Ie?"NHWC":"NCHW",auto_pad:c,ceil_mode:g,count_include_pad:f,storage_order:x,dilations:E?Array.from(($(),D).subarray(Number(E)>>>0,Number(M)>>>0)):[],kernel_shape:q?Array.from(($(),D).subarray(Number(q)>>>0,Number(J)>>>0)):[],pads:te?Array.from(($(),D).subarray(Number(te)>>>0,Number(fe)>>>0)):[],strides:we?Array.from(($(),D).subarray(Number(we)>>>0,Number(ke)>>>0)):[]})},1097259:(o,c,g,f,x)=>{t.bc("Gemm",o,{alpha:c,beta:g,transA:f,transB:x})},1097363:o=>{t.bc("MatMul",o,void 0)},1097417:(o,c,g,f)=>{t.bc("ArgMax",o,{keepDims:!!c,selectLastIndex:!!g,axis:f})},1097525:(o,c,g,f)=>{t.bc("ArgMin",o,{keepDims:!!c,selectLastIndex:!!g,axis:f})},1097633:(o,c)=>{t.bc("Softmax",o,{axis:c})},1097696:(o,c)=>{t.bc("Concat",o,{axis:c})},1097756:(o,c,g,f,x)=>{t.bc("Split",o,{axis:c,numOutputs:g,splitSizes:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[]})},1097912:o=>{t.bc("Expand",o,void 0)},1097966:(o,c)=>{t.bc("Gather",o,{axis:Number(c)})},1098037:(o,c)=>{t.bc("GatherElements",o,{axis:Number(c)})},1098116:(o,c)=>{t.bc("GatherND",o,{batch_dims:Number(c)})},1098195:(o,c,g,f,x,E,M,q,J,te,fe)=>{t.bc("Resize",o,{antialias:c,axes:g?Array.from(($(),D).subarray(Number(g)>>>0,Number(f)>>>0)):[],coordinateTransformMode:ze(x),cubicCoeffA:E,excludeOutside:M,extrapolationValue:q,keepAspectRatioPolicy:ze(J),mode:ze(te),nearestMode:ze(fe)})},1098557:(o,c,g,f,x,E,M)=>{t.bc("Slice",o,{starts:c?Array.from(($(),D).subarray(Number(c)>>>0,Number(g)>>>0)):[],ends:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[],axes:E?Array.from(($(),D).subarray(Number(E)>>>0,Number(M)>>>0)):[]})},1098821:o=>{t.bc("Tile",o,void 0)},1098873:(o,c,g)=>{t.bc("InstanceNormalization",o,{epsilon:c,format:g?"NHWC":"NCHW"})},1098987:(o,c,g)=>{t.bc("InstanceNormalization",o,{epsilon:c,format:g?"NHWC":"NCHW"})},1099101:o=>{t.bc("Range",o,void 0)},1099154:(o,c)=>{t.bc("Einsum",o,{equation:ze(c)})},1099235:(o,c,g,f,x)=>{t.bc("Pad",o,{mode:c,value:g,pads:f?Array.from(($(),D).subarray(Number(f)>>>0,Number(x)>>>0)):[]})},1099378:(o,c,g,f,x,E)=>{t.bc("BatchNormalization",o,{epsilon:c,momentum:g,spatial:!!x,trainingMode:!!f,format:E?"NHWC":"NCHW"})},1099547:(o,c,g,f,x,E)=>{t.bc("BatchNormalization",o,{epsilon:c,momentum:g,spatial:!!x,trainingMode:!!f,format:E?"NHWC":"NCHW"})},1099716:(o,c,g)=>{t.bc("CumSum",o,{exclusive:Number(c),reverse:Number(g)})},1099813:(o,c,g)=>{t.bc("DequantizeLinear",o,{axis:c,blockSize:g})},1099903:(o,c,g,f,x)=>{t.bc("GridSample",o,{align_corners:c,mode:ze(g),padding_mode:ze(f),format:x?"NHWC":"NCHW"})},1100073:(o,c,g,f,x)=>{t.bc("GridSample",o,{align_corners:c,mode:ze(g),padding_mode:ze(f),format:x?"NHWC":"NCHW"})},1100243:(o,c)=>{t.bc("ScatterND",o,{reduction:ze(c)})},1100328:(o,c,g,f,x,E,M,q,J)=>{t.bc("Attention",o,{numHeads:c,isUnidirectional:g,maskFilterValue:f,scale:x,doRotary:E,qkvHiddenSizes:M?Array.from(($(),D).subarray(Number(q)>>>0,Number(q)+M>>>0)):[],pastPresentShareBuffer:!!J})},1100600:o=>{t.bc("BiasAdd",o,void 0)},1100655:o=>{t.bc("BiasSplitGelu",o,void 0)},1100716:o=>{t.bc("FastGelu",o,void 0)},1100772:(o,c,g,f,x,E,M,q,J,te,fe,we,ke,Ie,$t,Pi)=>{t.bc("Conv",o,{format:we?"NHWC":"NCHW",auto_pad:c,dilations:g?Array.from(($(),D).subarray(Number(g)>>>0,Number(f)>>>0)):[],group:x,kernel_shape:E?Array.from(($(),D).subarray(Number(E)>>>0,Number(M)>>>0)):[],pads:q?Array.from(($(),D).subarray(Number(q)>>>0,Number(J)>>>0)):[],strides:te?Array.from(($(),D).subarray(Number(te)>>>0,Number(fe)>>>0)):[],w_is_const:()=>!!($(),V)[Number(ke)>>>0],activation:ze(Ie),activation_params:$t?Array.from(($(),z).subarray(Number($t)>>>0,Number(Pi)>>>0)):[]})},1101356:o=>{t.bc("Gelu",o,void 0)},1101408:(o,c,g,f,x,E,M,q,J)=>{t.bc("GroupQueryAttention",o,{numHeads:c,kvNumHeads:g,scale:f,softcap:x,doRotary:E,rotaryInterleaved:M,smoothSoftmax:q,localWindowSize:J})},1101625:(o,c,g,f)=>{t.bc("LayerNormalization",o,{axis:c,epsilon:g,simplified:!!f})},1101736:(o,c,g,f)=>{t.bc("LayerNormalization",o,{axis:c,epsilon:g,simplified:!!f})},1101847:(o,c,g,f,x,E)=>{t.bc("MatMulNBits",o,{k:c,n:g,accuracyLevel:f,bits:x,blockSize:E})},1101974:(o,c,g,f,x,E)=>{t.bc("MultiHeadAttention",o,{numHeads:c,isUnidirectional:g,maskFilterValue:f,scale:x,doRotary:E})},1102133:(o,c)=>{t.bc("QuickGelu",o,{alpha:c})},1102197:(o,c,g,f,x)=>{t.bc("RotaryEmbedding",o,{interleaved:!!c,numHeads:g,rotaryEmbeddingDim:f,scale:x})},1102336:(o,c,g)=>{t.bc("SkipLayerNormalization",o,{epsilon:c,simplified:!!g})},1102438:(o,c,g)=>{t.bc("SkipLayerNormalization",o,{epsilon:c,simplified:!!g})},1102540:(o,c,g,f)=>{t.bc("GatherBlockQuantized",o,{gatherAxis:c,quantizeAxis:g,blockSize:f})},1102661:o=>{t.Id(o)},1102695:(o,c)=>t.Kd(Number(o),Number(c),t.$c.Nd,t.$c.errors)};function By(o,c,g){return Us(async()=>{await t.Gd(Number(o),Number(c),Number(g))})}function Ny(){return typeof wasmOffsetConverter<"u"}function Py(o,c,g,f){var x=ye();try{return xo(o,c,g,f)}catch(E){if(ge(x),E!==E+0)throw E;_e(1,0)}}function Uy(o,c,g){var f=ye();try{return bo(o,c,g)}catch(x){if(ge(f),x!==x+0)throw x;_e(1,0)}}function Ly(o){var c=ye();try{go(o)}catch(g){if(ge(c),g!==g+0)throw g;_e(1,0)}}function Wy(o,c){var g=ye();try{return Bi(o,c)}catch(f){if(ge(g),f!==f+0)throw f;_e(1,0)}}function qy(o,c,g){var f=ye();try{mo(o,c,g)}catch(x){if(ge(f),x!==x+0)throw x;_e(1,0)}}function Vy(o,c){var g=ye();try{So(o,c)}catch(f){if(ge(g),f!==f+0)throw f;_e(1,0)}}function Gy(o,c,g,f,x,E,M){var q=ye();try{return $o(o,c,g,f,x,E,M)}catch(J){if(ge(q),J!==J+0)throw J;_e(1,0)}}function Fy(o,c,g,f,x,E){var M=ye();try{yo(o,c,g,f,x,E)}catch(q){if(ge(M),q!==q+0)throw q;_e(1,0)}}function Hy(o,c,g,f){var x=ye();try{vo(o,c,g,f)}catch(E){if(ge(x),E!==E+0)throw E;_e(1,0)}}function jy(o,c,g,f,x){var E=ye();try{_o(o,c,g,f,x)}catch(M){if(ge(E),M!==M+0)throw M;_e(1,0)}}function Ky(o,c,g,f,x,E,M){var q=ye();try{To(o,c,g,f,x,E,M)}catch(J){if(ge(q),J!==J+0)throw J;_e(1,0)}}function Yy(o,c,g,f,x,E,M){var q=ye();try{Io(o,c,g,f,x,E,M)}catch(J){if(ge(q),J!==J+0)throw J;_e(1,0)}}function Zy(o,c,g,f,x,E,M,q){var J=ye();try{zo(o,c,g,f,x,E,M,q)}catch(te){if(ge(J),te!==te+0)throw te;_e(1,0)}}function Xy(o,c,g,f,x){var E=ye();try{return ko(o,c,g,f,x)}catch(M){if(ge(E),M!==M+0)throw M;_e(1,0)}}function Qy(o,c,g){var f=ye();try{return Oo(o,c,g)}catch(x){if(ge(f),x!==x+0)throw x;_e(1,0)}}function Jy(o,c,g,f,x,E,M,q){var J=ye();try{Ro(o,c,g,f,x,E,M,q)}catch(te){if(ge(J),te!==te+0)throw te;_e(1,0)}}function e0(o,c,g,f,x,E,M,q,J,te,fe,we){var ke=ye();try{Eo(o,c,g,f,x,E,M,q,J,te,fe,we)}catch(Ie){if(ge(ke),Ie!==Ie+0)throw Ie;_e(1,0)}}function t0(o,c,g){var f=ye();try{return Mo(o,c,g)}catch(x){if(ge(f),x!==x+0)throw x;return _e(1,0),0n}}function r0(o,c,g,f,x,E,M,q,J){var te=ye();try{wo(o,c,g,f,x,E,M,q,J)}catch(fe){if(ge(te),fe!==fe+0)throw fe;_e(1,0)}}function i0(o){var c=ye();try{return Do(o)}catch(g){if(ge(c),g!==g+0)throw g;_e(1,0)}}function n0(o,c){var g=ye();try{return Xo(o,c)}catch(f){if(ge(g),f!==f+0)throw f;return _e(1,0),0n}}function a0(o,c,g,f){var x=ye();try{return Bo(o,c,g,f)}catch(E){if(ge(x),E!==E+0)throw E;_e(1,0)}}function s0(o){var c=ye();try{return No(o)}catch(g){if(ge(c),g!==g+0)throw g;return _e(1,0),0n}}function o0(o,c,g,f){var x=ye();try{return Vo(o,c,g,f)}catch(E){if(ge(x),E!==E+0)throw E;_e(1,0)}}function u0(o,c,g,f,x){var E=ye();try{return Go(o,c,g,f,x)}catch(M){if(ge(E),M!==M+0)throw M;_e(1,0)}}function l0(o,c,g,f,x,E){var M=ye();try{return Fo(o,c,g,f,x,E)}catch(q){if(ge(M),q!==q+0)throw q;_e(1,0)}}function d0(o,c,g,f,x,E){var M=ye();try{return Co(o,c,g,f,x,E)}catch(q){if(ge(M),q!==q+0)throw q;_e(1,0)}}function c0(o,c,g,f,x,E){var M=ye();try{return Ho(o,c,g,f,x,E)}catch(q){if(ge(M),q!==q+0)throw q;_e(1,0)}}function p0(o,c,g,f,x,E,M,q){var J=ye();try{return Ao(o,c,g,f,x,E,M,q)}catch(te){if(ge(J),te!==te+0)throw te;_e(1,0)}}function h0(o,c,g,f,x){var E=ye();try{return jo(o,c,g,f,x)}catch(M){if(ge(E),M!==M+0)throw M;return _e(1,0),0n}}function f0(o,c,g,f){var x=ye();try{return Ko(o,c,g,f)}catch(E){if(ge(x),E!==E+0)throw E;_e(1,0)}}function m0(o,c,g,f){var x=ye();try{return Yo(o,c,g,f)}catch(E){if(ge(x),E!==E+0)throw E;_e(1,0)}}function g0(o,c,g,f,x,E,M,q,J,te,fe,we){var ke=ye();try{return Zo(o,c,g,f,x,E,M,q,J,te,fe,we)}catch(Ie){if(ge(ke),Ie!==Ie+0)throw Ie;_e(1,0)}}function y0(o,c,g,f,x,E,M,q,J,te,fe){var we=ye();try{Wo(o,c,g,f,x,E,M,q,J,te,fe)}catch(ke){if(ge(we),ke!==ke+0)throw ke;_e(1,0)}}function _0(o,c,g,f,x,E,M,q,J,te,fe,we,ke,Ie,$t,Pi){var v0=ye();try{qo(o,c,g,f,x,E,M,q,J,te,fe,we,ke,Ie,$t,Pi)}catch(Ui){if(ge(v0),Ui!==Ui+0)throw Ui;_e(1,0)}}function b0(o,c,g){var f=ye();try{return Po(o,c,g)}catch(x){if(ge(f),x!==x+0)throw x;_e(1,0)}}function w0(o,c,g){var f=ye();try{return Uo(o,c,g)}catch(x){if(ge(f),x!==x+0)throw x;_e(1,0)}}function $0(o,c,g,f){var x=ye();try{Lo(o,c,g,f)}catch(E){if(ge(x),E!==E+0)throw E;_e(1,0)}}function Lr(){if(0<ae)ce=Lr;else if(n)w==null||w(t),U();else{for(var o=ee;0<o.length;)o.shift()(t);0<ae?ce=Lr:(t.calledRun=!0,C||(U(),w==null||w(t)))}}return n||(pt=await me(),Lr()),t.PTR_SIZE=4,R?t:new Promise((o,c)=>{w=o,S=c})}var qp,su,H0=Z(()=>{"use strict";var e,t;qp=au,su=(t=(e=globalThis.self)==null?void 0:e.name)==null?void 0:t.startsWith("em-pthread"),su&&au()}),Fi,pa,ou,Ge,Vp,qr,uu,lu,Hi,du,ji,Gp,Ki,Fp,Na=Z(()=>{"use strict";Ba(),Fi=typeof location>"u"?void 0:location.origin,pa=self.location.href>"file:"&&self.location.href<"file;",ou=()=>{if(pa){let e=URL;return new URL(new e("ort.bundle.min.mjs",self.location.href).href,Fi).href}return self.location.href},Ge=ou(),Vp=()=>{if(Ge&&!Ge.startsWith("blob:"))return Ge.substring(0,Ge.lastIndexOf("/")+1)},qr=(e,t)=>{try{let r=t??Ge;return(r?new URL(e,r):new URL(e)).origin===Fi}catch{return!1}},uu=(e,t)=>{let r=t??Ge;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},lu=(e,t)=>`${t??"./"}${e}`,Hi=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},du=async e=>(await import(e)).default,ji=(F0(),kr(Up)).default,Gp=async()=>{if(!Ge)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(qr(Ge))return[void 0,ji()];let e=await Hi(Ge);return[e,ji(e)]},Ki=(H0(),kr(Wp)).default,Fp=async(e,t,r,i)=>{let n=Ki&&!(e||t);if(n)if(Ge)n=qr(Ge)||i&&!r;else if(i&&!r)n=!0;else throw new Error("cannot determine the script source URL.");if(n)return[void 0,Ki];{let a="ort-wasm-simd-threaded.jsep.mjs",s=e??uu(a,t),u=r&&s&&!qr(s,t),l=u?await Hi(s):s??lu(a,t);return[u?l:void 0,await du(l)]}}}),Yi,Vr,lr,Zi,cu,pu,hu,Pa,Te,Ht=Z(()=>{"use strict";Na(),Vr=!1,lr=!1,Zi=!1,cu=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},pu=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},hu=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Pa=async e=>{if(Vr)return Promise.resolve();if(lr)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(Zi)throw new Error("previous call to 'initializeWebAssembly()' failed.");lr=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!hu())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!pu())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=cu();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let n=e.wasmPaths,a=typeof n=="string"?n:void 0,s=n==null?void 0:n.mjs,u=(s==null?void 0:s.href)??s,l=n==null?void 0:n.wasm,d=(l==null?void 0:l.href)??l,h=e.wasmBinary,[p,m]=await Fp(u,a,r>1,!!h||!!d),_=!1,y=[];if(t>0&&y.push(new Promise(w=>{setTimeout(()=>{_=!0,w()},t)})),y.push(new Promise((w,S)=>{let v={numThreads:r};if(h)v.wasmBinary=h,v.locateFile=b=>b;else if(d||a)v.locateFile=b=>d??a+b;else if(u&&u.indexOf("blob:")!==0)v.locateFile=b=>new URL(b,u).href;else if(p){let b=Vp();b&&(v.locateFile=I=>b+I)}m(v).then(b=>{lr=!1,Vr=!0,Yi=b,w(),p&&URL.revokeObjectURL(p)},b=>{lr=!1,Zi=!0,S(b)})})),await Promise.race(y),_)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},Te=()=>{if(Vr&&Yi)return Yi;throw new Error("WebAssembly is not initialized yet.")}}),it,li,Se,Ua=Z(()=>{"use strict";Ht(),it=(e,t)=>{let r=Te(),i=r.lengthBytesUTF8(e)+1,n=r._malloc(i);return r.stringToUTF8(e,n,i),t.push(n),n},li=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([n,a])=>{let s=t?t+n:n;if(typeof a=="object")li(a,s+".",r,i);else if(typeof a=="string"||typeof a=="number")i(s,a.toString());else if(typeof a=="boolean")i(s,a?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof a}`)})},Se=e=>{let t=Te(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetLastError(n,n+i);let a=Number(t.getValue(n,i===4?"i32":"i64")),s=t.getValue(n+i,"*"),u=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${a}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),Hp,j0=Z(()=>{"use strict";Ht(),Ua(),Hp=e=>{let t=Te(),r=0,i=[],n=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)n.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)n.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(n.terminate=!1);let a=0;return(e==null?void 0:e.tag)!==void 0&&(a=it(e.tag,i)),r=t._OrtCreateRunOptions(n.logSeverityLevel,n.logVerbosityLevel,!!n.terminate,a),r===0&&Se("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&li(e.extra,"",new WeakSet,(s,u)=>{let l=it(s,i),d=it(u,i);t._OrtAddRunConfigEntry(r,l,d)!==0&&Se(`Can't set a run config entry: ${s} - ${u}.`)}),[r,i]}catch(a){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(s=>t._free(s)),a}}}),fu,mu,gu,Ot,yu,jp,K0=Z(()=>{"use strict";Ht(),Ua(),fu=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},mu=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},gu=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},Ot=(e,t,r,i)=>{let n=it(t,i),a=it(r,i);Te()._OrtAddSessionConfigEntry(e,n,a)!==0&&Se(`Can't set a session config entry: ${t} - ${r}.`)},yu=async(e,t,r)=>{let i=t.executionProviders;for(let n of i){let a=typeof n=="string"?n:n.name,s=[];switch(a){case"webnn":if(a="WEBNN",Ot(e,"session.disable_quant_qdq","1",r),Ot(e,"session.disable_qdq_constant_folding","1",r),typeof n!="string"){let p=n==null?void 0:n.deviceType;p&&Ot(e,"deviceType",p,r)}break;case"webgpu":if(a="JS",typeof n!="string"){let p=n;if(p!=null&&p.preferredLayout){if(p.preferredLayout!=="NCHW"&&p.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${p.preferredLayout}`);Ot(e,"preferredLayout",p.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let u=it(a,r),l=s.length,d=0,h=0;if(l>0){d=Te()._malloc(l*Te().PTR_SIZE),r.push(d),h=Te()._malloc(l*Te().PTR_SIZE),r.push(h);for(let p=0;p<l;p++)Te().setValue(d+p*Te().PTR_SIZE,s[p][0],"*"),Te().setValue(h+p*Te().PTR_SIZE,s[p][1],"*")}await Te()._OrtAppendExecutionProvider(e,u,d,h,l)!==0&&Se(`Can't append execution provider: ${a}.`)}},jp=async e=>{let t=Te(),r=0,i=[],n=e||{};gu(n);try{let a=fu(n.graphOptimizationLevel??"all"),s=mu(n.executionMode??"sequential"),u=typeof n.logId=="string"?it(n.logId,i):0,l=n.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log severity level is not valid: ${l}`);let d=n.logVerbosityLevel??0;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log verbosity level is not valid: ${d}`);let h=typeof n.optimizedModelFilePath=="string"?it(n.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(a,!!n.enableCpuMemArena,!!n.enableMemPattern,s,!!n.enableProfiling,0,u,l,d,h),r===0&&Se("Can't create session options."),n.executionProviders&&await yu(r,n,i),n.enableGraphCapture!==void 0){if(typeof n.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${n.enableGraphCapture}`);Ot(r,"enableGraphCapture",n.enableGraphCapture.toString(),i)}if(n.freeDimensionOverrides)for(let[p,m]of Object.entries(n.freeDimensionOverrides)){if(typeof p!="string")throw new Error(`free dimension override name must be a string: ${p}`);if(typeof m!="number"||!Number.isInteger(m)||m<0)throw new Error(`free dimension override value must be a non-negative integer: ${m}`);let _=it(p,i);t._OrtAddFreeDimensionOverride(r,_,m)!==0&&Se(`Can't set a free dimension override: ${p} - ${m}.`)}return n.extra!==void 0&&li(n.extra,"",new WeakSet,(p,m)=>{Ot(r,p,m,i)}),[r,i]}catch(a){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&Se("Can't release session options."),i.forEach(s=>t._free(s)),a}}}),Pt,mt,Ut,gi,di,La,Wa,ha,oe=Z(()=>{"use strict";Pt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},mt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Ut=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((n,a)=>n*a,1);return r>0?Math.ceil(i*r):void 0},gi=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},di=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},La=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Wa=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",ha=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),qa,Kp=Z(()=>{"use strict";Ba(),qa=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let n=t.body.getReader(),a;try{a=new ArrayBuffer(i)}catch(u){if(u instanceof RangeError){let l=Math.ceil(i/65536);a=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw u}let s=0;for(;;){let{done:u,value:l}=await n.read();if(u)break;let d=l.byteLength;new Uint8Array(a,s,d).set(l),s+=d}return new Uint8Array(a,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),_u,bu,wu,$u,Va,vu,be,gt=Z(()=>{"use strict";oe(),_u=["V","I","W","E","F"],bu=(e,t)=>{console.log(`[${_u[e]},${new Date().toISOString()}]${t}`)},Va=(e,t)=>{wu=e,$u=t},vu=(e,t)=>{let r=di(e),i=di(wu);r>=i&&bu(r,typeof t=="function"?t():t)},be=(...e)=>{$u&&vu(...e)}}),xu,tr,P,ci,Yp,Zp,Xp,le=Z(()=>{"use strict";xu=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},tr=class{static calcShape(e,t,r=!1){let i=e.length,n=t.length;if(i===0)return t;if(n===0)return e;let a=Math.max(e.length,t.length),s=new Array(a);if(r){if(i<2||n<2)return;let u=xu.calcMatMulShape([e[i-2],e[i-1]],[t[n-2],t[n-1]]);if(u===void 0)return;[s[a-2],s[a-1]]=u}for(let u=r?3:1;u<=a;u++){let l=i-u<0?1:e[i-u],d=n-u<0?1:t[n-u];if(l!==d&&l>1&&d>1)return;let h=Math.max(l,d);if(l&&d)s[a-u]=Math.max(l,d);else{if(h>1)return;s[a-u]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let n=1;n<=r;n++)if(e[r-n]!==1&&e[r-n]!==t[i-n])return!1;return!0}},P=class ai{static size(t){return ai.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let n=new Array(i),a=i-1;for(;a>=0;){if(t[a]%r===0){n[a]=t[a]/r;break}if(r%t[a]!==0)throw new Error("cannot convert shape");n[a]=1,r/=t[a],a--}for(a--;a>=0;a--)n[a]=t[a];return n}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return ai.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return ai.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let n=1;for(let a=r;a<i;a++){if(t[a]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");n*=Number(t[a])}return n}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let n=r-3;n>=0;--n)i[n]=i[n+1]*t[n+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((n,a)=>n+r[a]+r[a+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,n)=>i===r[n])}},ci=class Tt{static adjustPoolAttributes(t,r,i,n,a,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=i.length?i.push(r[u+2]):i[u]=r[u+2];for(let u=0;u<i.length;u++)if(u<n.length){if(n[u]<0)throw new Error("strides should be greater than or equal to 1")}else n.push(1);for(let u=0;u<i.length;u++)if(u<a.length){if(a[u]<0)throw new Error("dilations should be greater than or equal to 1")}else a.push(1);for(let u=0;u<i.length*2;u++)if(u<s.length){if(s[u]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let u=0;u<i.length;u++){if(i[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[u]>=i[u]||s[u+i.length]>=i[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,n,a,s,u){if(u){if(a.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)Tt.adjustPadAndReturnShape(t[l+(s?1:2)],r[l],i[l],n[l],a,l,l+t.length-2,u)}}static computePoolOutputShape(t,r,i,n,a,s,u,l=0){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let d=[r[0],r[1]];return Tt.computeShapeHelper(t,r,d,i,n,a,s,u,l),d}static computeConvOutputShape(t,r,i,n,a,s,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return Tt.computeShapeHelper(!1,t,l,i,n,a,s,u),l}static computeShapeHelper(t,r,i,n,a,s,u,l,d=0){if(t)for(let h=0;h<r.length-2;h++)i.push(1);else for(let h=0;h<r.length-2;h++)i.push(Tt.adjustPadAndReturnShape(r[h+2],n[h],a[h],s[h],u,h,h+r.length-2,l,d))}static computeOutputSize(t,r,i,n,a){let s=Math.floor(t/r)+1;return a===1&&(s=Math.ceil(t/r)+1,(s-1)*r>=i+n&&(s-=1)),s}static adjustPadAndReturnShape(t,r,i,n,a,s,u,l,d=0){let h=i*(n-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return a[s]=0,a[u]=0,Tt.computeOutputSize(t-h,r,t,0,d);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let p=(Math.floor((t+r-1)/r)-1)*r+n-t;return a[s]=Math.floor(l==="SAME_LOWER"?(p+1)/2:p/2),a[u]=p-a[s],Tt.computeOutputSize(t+a[s]+a[u]-h,r,t,a[s],d)}default:throw new Error("Unsupported AutoPad type")}else return Tt.computeOutputSize(t+a[s]+a[u]-h,r,t,a[s],d)}},Yp=class{static getShapeOfGemmResult(e,t,r,i,n){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let a,s,u;t?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let l=-1;if(i?(u=r[0],l=1):(u=r[1],l=0),r[l]!==s)throw new Error("dimension mismatch");if(a<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(n&&!tr.isValidBroadcast(n,[a,u]))throw new Error("gemm: invalid bias shape for broadcast");return[a,u,s]}},Zp=-34028234663852886e22,Xp=34028234663852886e22}),Ga,Qp=Z(()=>{"use strict";oe(),Ga=(e,t)=>new(gi(t))(e)}),Xi,Su,Qi,ku,Ji,Tu,en,tn,rn,Iu,Jp,Y0=Z(()=>{"use strict";oe(),gt(),Xi=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Su=(e,t)=>{if(t==="int32")return e;let r=Xi.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let n=e.byteLength/i,a=new(gi(t))(e.buffer,e.byteOffset,n);switch(t){case"int64":case"uint64":{let s=new Int32Array(n);for(let u=0;u<n;u++){let l=a[u];if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[u]=Number(l)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&a.some(u=>u>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(a,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},Qi=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let n=BigInt64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"uint64":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let n=BigUint64Array.from(i,BigInt);return new Uint8Array(n.buffer)}case"int8":{if(i.some(a=>a<-128||a>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let n=Int8Array.from(i,Number);return new Uint8Array(n.buffer)}case"uint8":{if(i.some(n=>n<0||n>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(a=>a<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let n=Uint32Array.from(i,Number);return new Uint8Array(n.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},ku=1,Ji=()=>ku++,Tu=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),en=(e,t)=>{let r=Xi.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,n)=>i*n)*r/8):0},tn=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:n,shape:a,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=n,this.tensorShape=a,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return en(this.dataType,this.tensorShape)}destroy(){be("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=Qi(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return new Uint8Array(r).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,n)=>i===r[n])}setIsDataConverted(e){this.isDataConverted=e}},rn=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let n=this.tensorManager.getMLContext(e),a=this.tensorManager.getMLOpSupportLimits(e),s;if(!(a!=null&&a.input.dataTypes.includes(t))){if(s=Tu.get(t),!s||!(a!=null&&a.input.dataTypes.includes(s)))throw new Error(`WebNN backend does not support data type: ${t}`);be("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${s}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(n,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==en(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let u=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,u,!0,!0,s),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=Su(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else be("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,r;if(this.activeUpload){let i=(t=this.wrapper)!=null&&t.isDataConverted?Qi(this.activeUpload,(r=this.wrapper)==null?void 0:r.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(i):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(i);return}else return i.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},Iu=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=Ji();return this.tensorTrackersById.set(e,new rn(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,n){be("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${n}}`);let a=this.tensorTrackersById.get(t);if(!a)throw new Error("Tensor not found.");return a.ensureTensor(e,r,i,n)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){be("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let n=this.getMLContext(e),a=Ji(),s=new tn({sessionId:e,context:n,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(a,new rn(this,s)),this.externalTensors.add(s),a}async getCachedTensor(e,t,r,i,n,a,s){let u=this.getMLContext(e);for(let[d,h]of this.freeTensors.entries())if(h.canReuseTensor(u,t,r)){be("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let p=this.freeTensors.splice(d,1)[0];return p.sessionId=e,p}be("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let l=await u.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:n,readable:a});return new tn({sessionId:e,context:u,tensor:l,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},Jp=(...e)=>new Iu(...e)}),dr,Eu,eh,Z0=Z(()=>{"use strict";oe(),Ht(),Qp(),Y0(),gt(),dr=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),Eu=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((n,a)=>n===i[a]&&e[n]===t[n])},eh=class{constructor(e){this.tensorManager=Jp(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Va(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){be("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){be("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)be("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>Eu(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(n=>n.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){be("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,n){let a=dr.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,a,i,n)}async createTemporaryTensor(e,t,r){be("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=dr.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let n=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,n,i,r,!1);let a=this.temporarySessionTensorIds.get(e);return a?a.push(n):this.temporarySessionTensorIds.set(e,[n]),n}uploadTensor(e,t){if(!Te().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");be("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return Ga(r,t)}}registerMLTensor(e,t,r,i){let n=dr.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);let a=this.tensorManager.registerTensor(e,t,n,i);return be("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${n}, dimensions: ${i}} -> {tensorId: ${a}}`),a}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=dr.get(Pt(t)),n=this.mlOpSupportLimitsBySessionId.get(e);return typeof i>"u"?!1:r?!!(n!=null&&n.input.dataTypes.includes(i)):!!(n!=null&&n.output.dataTypes.includes(i))}flush(){}}}),Fa=Z(()=>{"use strict"}),nn,Gr,Fr,Cu,Au,an,fa,zu,th,X0=Z(()=>{"use strict";gt(),Fa(),nn=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Gr=[],Fr=e=>Math.ceil(Number(e)/16)*16,Cu=e=>{for(let t=0;t<Gr.length;t++){let r=Gr[t];if(e<=r)return r}return Math.ceil(e/16)*16},Au=1,an=()=>Au++,fa=async(e,t,r,i)=>{let n=Fr(r),a=e.device.createBuffer({size:n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,a,0,n),e.flush(),await a.mapAsync(GPUMapMode.READ);let u=a.getMappedRange();if(i){let l=i();return l.set(new Uint8Array(u,0,r)),l}else return new Uint8Array(u.slice(0,r))}finally{a.destroy()}},zu=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of nn)Gr.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,n=t.byteLength,a=Fr(n),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==n)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${n}`);if(a===n&&i%4===0)this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,r,i,n);else{let u=new Uint8Array(a);u.set(t),this.backend.device.queue.writeBuffer(s.gpuData.buffer,0,u,0,a)}be("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let n=Fr(r.originalSize),a=this.backend.getCommandEncoder();this.backend.endComputePass(),a.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,n)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return be("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=an();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),be("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),be("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=Cu(e),i,n=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,a=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(n||a){let u=(n?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?i=u.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:an(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),be("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return be("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await fa(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=nn.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(be("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},th=(...e)=>new zu(...e)}),Ou,xe,Ae=Z(()=>{"use strict";Ou=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},xe=e=>new Ou(e)}),rr,Hr,Me,Re,se,Ce,ma,Jt,Et,ne,cr,G,re,rh,Ha,Ru,ih,de=Z(()=>{"use strict";oe(),le(),rr=64,Hr=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Me=(e,t=1)=>{let r=Hr(e,t);return typeof r=="string"?r:r[0]},Re=(e,t=1)=>{let r=Hr(e,t);return typeof r=="string"?r:r[1]},se=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:P.computeStrides(r)})}),t},Ce=e=>e%4===0?4:e%2===0?2:1,ma=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Jt=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,Et=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,ne=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,cr=(e,t,r,i,n)=>{let a=typeof r=="number",s=a?r:r.length,u=[...new Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,d=Hr(t,n),h=typeof d=="string"?d:d[1],p=typeof d=="string"?d:d[0],m={indices:l,value:h,storage:p,tensor:t},_=R=>typeof R=="string"?R:`${R}u`,y={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},w=a?"uniforms.":"",S=`${w}${e}_shape`,v=`${w}${e}_strides`,b="";for(let R=0;R<s-1;R++)b+=`
    let dim${R} = current / ${ne(v,R,s)};
    let rest${R} = current % ${ne(v,R,s)};
    indices[${R}] = dim${R};
    current = rest${R};
    `;b+=`indices[${s-1}] = current;`;let I=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${m.indices} {
    var indices: ${m.indices};
    var current = offset;
    ${b}
    return indices;
  }`,k=R=>(y.offsetToIndices=!0,s<2?R:`o2i_${e}(${R})`),T=[];if(s>=2)for(let R=s-1;R>=0;R--)T.push(`${ne(v,R,s)} * (indices[${R}])`);let C=s<2?"":`
  fn i2o_${e}(indices: ${m.indices}) -> u32 {
    return ${T.join("+")};
  }`,A=R=>(y.indicesToOffset=!0,s<2?R:`i2o_${e}(${R})`),$=(...R)=>s===0?"0u":`${m.indices}(${R.map(_).join(",")})`,N=(R,L)=>s<2?`${R}`:`${ne(R,L,s)}`,V=(R,L,U)=>s<2?`${R}=${U};`:`${ne(R,L,s)}=${U};`,F={},Y=(R,L)=>{y.broadcastedIndicesToOffset=!0;let U=`${L.name}broadcastedIndicesTo${e}Offset`;if(U in F)return`${U}(${R})`;let W=[];for(let Q=s-1;Q>=0;Q--){let me=L.indicesGet("outputIndices",Q+L.rank-s);W.push(`${N(v,Q)} * (${me} % ${N(S,Q)})`)}return F[U]=`fn ${U}(outputIndices: ${L.type.indices}) -> u32 {
             return ${W.length>0?W.join("+"):"0u"};
           }`,`${U}(${R})`},H=(R,L)=>(()=>{if(m.storage===m.value)return`${e}[${R}]=${L};`;if(m.storage==="vec2<u32>"&&m.value==="i32")return`${e}[${R}]=vec2<u32>(u32(${L}), select(0u, 0xFFFFFFFFu, ${L} < 0));`;if(m.storage==="vec2<u32>"&&m.value==="u32")return`${e}[${R}]=vec2<u32>(u32(${L}), 0u);`;if(m.storage==="u32"&&m.value==="vec4<bool>")return`${e}[${R}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${L}));`;throw new Error(`not supported combination of storage type ${m.storage} and value type ${m.value} yet`)})(),D=R=>(()=>{if(m.storage===m.value)return`${e}[${R}]`;if(m.storage==="vec2<u32>"&&m.value==="i32")return`i32(${e}[${R}].x)`;if(m.storage==="vec2<u32>"&&m.value==="u32")return`u32(${e}[${R}].x)`;if(m.storage==="u32"&&m.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${R}] & 0xFFu), bool(${e}[${R}] & 0xFF00u), bool(${e}[${R}] & 0xFF0000u), bool(${e}[${R}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${m.storage} and value type ${m.value} yet`)})(),K=s<2?"":`
  fn get_${e}ByIndices(indices: ${m.indices}) -> ${h} {
    return ${D(`i2o_${e}(indices)`)};
  }`,z=s<2?"":(()=>{let R=u.map(U=>`d${U}: u32`).join(", "),L=u.map(U=>`d${U}`).join(", ");return`
  fn get_${e}(${R}) -> ${h} {
    return get_${e}ByIndices(${$(L)});
  }`})(),j=(...R)=>{if(R.length!==s)throw new Error(`indices length must be ${s}`);let L=R.map(_).join(",");return s===0?D("0u"):s===1?D(L[0]):(y.get=!0,y.getByIndices=!0,y.indicesToOffset=!0,`get_${e}(${L})`)},X=R=>s<2?D(R):(y.getByIndices=!0,y.indicesToOffset=!0,`get_${e}ByIndices(${R})`),O=s<2?"":`
  fn set_${e}ByIndices(indices: ${m.indices}, value: ${h}) {
    ${H(`i2o_${e}(indices)`,"value")}
  }`,B=s<2?"":(()=>{let R=u.map(U=>`d${U}: u32`).join(", "),L=u.map(U=>`d${U}`).join(", ");return`
  fn set_${e}(${R}, value: ${h}) {
    set_${e}ByIndices(${$(L)}, value);
  }`})();return{impl:()=>{let R=[],L=!1;return y.offsetToIndices&&(R.push(I),L=!0),y.indicesToOffset&&(R.push(C),L=!0),y.broadcastedIndicesToOffset&&(Object.values(F).forEach(U=>R.push(U)),L=!0),y.set&&(R.push(B),L=!0),y.setByIndices&&(R.push(O),L=!0),y.get&&(R.push(z),L=!0),y.getByIndices&&(R.push(K),L=!0),!a&&L&&R.unshift(`const ${S} = ${m.indices}(${r.join(",")});`,`const ${v} = ${m.indices}(${P.computeStrides(r).join(",")});`),R.join(`
`)},type:m,offsetToIndices:k,indicesToOffset:A,broadcastedIndicesToOffset:Y,indices:$,indicesGet:N,indicesSet:V,set:(...R)=>{if(R.length!==s+1)throw new Error(`indices length must be ${s}`);let L=R[s];if(typeof L!="string")throw new Error("value must be string");let U=R.slice(0,s).map(_).join(",");return s===0?H("0u",L):s===1?H(U[0],L):(y.set=!0,y.setByIndices=!0,y.indicesToOffset=!0,`set_${e}(${U}, ${L})`)},setByOffset:H,setByIndices:(R,L)=>s<2?H(R,L):(y.setByIndices=!0,y.indicesToOffset=!0,`set_${e}ByIndices(${R}, ${L});`),get:j,getByOffset:D,getByIndices:X,usage:i,name:e,strides:v,shape:S,rank:s}},G=(e,t,r,i=1)=>cr(e,t,r,"input",i),re=(e,t,r,i=1)=>cr(e,t,r,"output",i),rh=(e,t,r)=>cr(e,t,r,"atomicOutput",1),Ha=(e,t,r,i=1)=>cr(e,t,r,"internal",i),Ru=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=rr){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let n=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,a=n?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=n?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${a}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let n=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${n}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},ih=(e,t)=>new Ru(e,t)}),Mu,sn,Du,Bu,Nu,Pu,He,nh,ah,Ct=Z(()=>{"use strict";oe(),le(),Ae(),de(),Mu=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},sn=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),Du=(e,t)=>P.sortBasedOnPerm(e,sn(e.length,t)),Bu=(e,t,r,i)=>{let n=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let a=0;a<t;++a)n+=`a[${e[a]}]=i[${a}];`;return n+="return a;}"},Nu=(e,t)=>{let r=[],i=[];for(let n=0;n<e.length;++n)e[n]!==1&&r.push(e[n]),e[t[n]]!==1&&i.push(t[n]);return{newShape:r,newPerm:i}},Pu=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},He=(e,t)=>{let r=e.dataType,i=e.dims.length,n=sn(i,t),a=Du(e.dims,n),s=e.dims,u=a,l=i<2||Pu(n,e.dims),d;if(l)return d=y=>{let w=G("input",r,s,4),S=re("output",r,u,4);return`
  ${y.registerUniform("output_size","u32").declareVariables(w,S)}
  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let y=P.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(y/64/4)},programUniforms:[{type:12,data:Math.ceil(y/4)}]}},getShaderSource:d};let{newShape:h,newPerm:p}=Nu(e.dims,n),m=P.areEqual(p,[2,3,1]),_=P.areEqual(p,[3,1,2]);if(h.length===2||m||_){s=m?[h[0],h[1]*h[2]]:_?[h[0]*h[1],h[2]]:h,u=[s[1],s[0]];let y=16;return d=w=>{let S=G("a",r,s.length),v=re("output",r,u.length);return`
  ${w.registerUniform("output_size","u32").declareVariables(S,v)}
  var<workgroup> tile : array<array<${v.type.value}, ${y+1}>, ${y}>;
  ${w.mainStart([y,y,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${y} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${y}u + local_id.x;
    let input_row = workgroup_id_x * ${y}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${S.getByIndices(`${S.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${y}u + local_id.x;
    let output_row = workgroup_id_y * ${y}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${v.setByIndices(`${v.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let w=P.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/y),y:Math.ceil(u[0]/y)},programUniforms:[{type:12,data:w},...se(s,u)]}},getShaderSource:d}}return d=y=>{let w=G("a",r,s.length),S=re("output",r,u.length);return`
  ${y.registerUniform("output_size","u32").declareVariables(w,S)}

  ${Bu(n,i,w,S)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${S.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${S.setByOffset("global_idx",w.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let y=P.size(a);return{outputs:[{dims:a,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:[{type:12,data:y},...se(s,u)]}},getShaderSource:d}},nh=(e,t)=>{Mu(e.inputs,t.perm),e.compute(He(e.inputs[0],t.perm))},ah=e=>xe({perm:e.perm})}),Uu,Lu,Wu,qu,Vu,Gu,Fu,Hu,ju,Ku,Qe,sh,oh,uh,lh,dh,ch,ph,hh,fh,mh,Q0=Z(()=>{"use strict";oe(),le(),de(),ja(),Ct(),Uu={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Lu={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Wu={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},qu={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Vu=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},Gu=(e,t)=>{let r=[],i=e.length;for(let a=0;a<i;a++)t.indexOf(a)===-1&&r.push(e[a]);let n=t.map(a=>e[a]);return[r,n]},Fu=(e,t)=>{let r=e.length+t.length,i=[],n=0;for(let a=0;a<r;a++)t.indexOf(a)===-1?i.push(e[n++]):i.push(1);return i},Hu=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},ju=(e,t)=>{let r=[];if(!Hu(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},Ku=(e,t,r,i,n,a,s)=>{let u=r[0].dims,l=P.size(a),d=P.size(s),h=G("_A",r[0].dataType,u),p=re("output",n,a),m=64;l===1&&(m=256);let _=`
          var<workgroup> aBestValues : array<f32, ${m}>;
       `,y=w=>`
        ${w.registerUniform("reduceSize","u32").declareVariables(h,p)}
        ${_}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${w.mainStart(m)}

          let outputIndex = global_idx / ${m};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Wu[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${m}) {
           let candidate = f32(${h.getByOffset("offset + k")});
           bestValue = ${Uu[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${m}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Lu[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${p.setByOffset("outputIndex",`${i==="mean"?`${p.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${p.type.storage}(${qu[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${m}`,inputDependencies:["type"]},getShaderSource:y,getRunData:()=>({outputs:[{dims:a,dataType:n}],dispatchGroup:{x:l},programUniforms:[{type:12,data:d}]})}},Qe=(e,t,r,i)=>{let n=e.inputs.length===1?r:ga(e.inputs,r),a=n.axes;a.length===0&&!n.noopWithEmptyAxes&&(a=e.inputs[0].dims.map((_,y)=>y));let s=P.normalizeAxes(a,e.inputs[0].dims.length),u=s,l=e.inputs[0],d=ju(u,e.inputs[0].dims.length);d.length>0&&(l=e.compute(He(e.inputs[0],d),{inputs:[0],outputs:[-1]})[0],u=Vu(u.length,l.dims.length));let[h,p]=Gu(l.dims,u),m=h;n.keepDims&&(m=Fu(h,s)),e.compute(Ku(t,n.cacheKey,[l],i,e.inputs[0].dataType,m,p),{inputs:[l]})},sh=(e,t)=>{Qe(e,"ReduceMeanShared",t,"mean")},oh=(e,t)=>{Qe(e,"ReduceL1Shared",t,"l1")},uh=(e,t)=>{Qe(e,"ReduceL2Shared",t,"l2")},lh=(e,t)=>{Qe(e,"ReduceLogSumExpShared",t,"logSumExp")},dh=(e,t)=>{Qe(e,"ReduceMaxShared",t,"max")},ch=(e,t)=>{Qe(e,"ReduceMinShared",t,"min")},ph=(e,t)=>{Qe(e,"ReduceProdShared",t,"prod")},hh=(e,t)=>{Qe(e,"ReduceSumShared",t,"sum")},fh=(e,t)=>{Qe(e,"ReduceSumSquareShared",t,"sumSquare")},mh=(e,t)=>{Qe(e,"ReduceLogSumShared",t,"logSum")}}),Je,Yu,pi,ga,et,Zu,Xu,Qu,Ju,el,tl,rl,il,nl,al,tt,gh,yh,_h,bh,wh,$h,vh,xh,Sh,kh,ja=Z(()=>{"use strict";oe(),le(),Ae(),de(),Q0(),Je=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Yu=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],pi=(e,t,r,i,n,a,s=!1,u=!1)=>{let l=[],d=r[0].dims,h=d.length,p=P.normalizeAxes(n,h),m=!u&&p.length===0;d.forEach((w,S)=>{m||p.indexOf(S)>=0?s&&l.push(1):l.push(w)});let _=l.length,y=P.size(l);return{name:e,shaderCache:t,getShaderSource:w=>{let S=[],v=G("_A",r[0].dataType,h),b=re("output",a,_),I=i(v,b,p),k=I[2];for(let T=0,C=0;T<h;T++)m||p.indexOf(T)>=0?(s&&C++,k=`for(var j${T}: u32 = 0; j${T} < ${d[T]}; j${T}++) {
                  ${I[2].includes("last_index")?`let last_index = j${T};`:""}
                  ${v.indicesSet("input_indices",T,`j${T}`)}
                  ${k}
                }`):(S.push(`${v.indicesSet("input_indices",T,b.indicesGet("output_indices",C))};`),C++);return`

        ${w.registerUniform("output_size","u32").declareVariables(v,b)}

        ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${v.type.indices};
          let output_indices = ${b.offsetToIndices("global_idx")};

          ${S.join(`
`)}
          ${I[0]}       // init ops for reduce max/min
          ${I[1]}
          ${k}
          ${I[3]}
          ${I.length===4?b.setByOffset("global_idx","value"):I.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:a}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:[{type:12,data:y},...se(d,l)]})}},ga=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),xe({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},et=(e,t,r,i)=>{let n=e.inputs,a=n.length===1?r:ga(n,r);e.compute(pi(t,{hint:a.cacheKey,inputDependencies:["rank"]},[n[0]],a.noopWithEmptyAxes&&a.axes.length===0?Yu:i,a.axes,n[0].dataType,a.keepDims,a.noopWithEmptyAxes),{inputs:[0]})},Zu=(e,t)=>{Je(e.inputs),et(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Xu=(e,t)=>{Je(e.inputs),et(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Qu=(e,t)=>{Je(e.inputs),et(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Ju=(e,t)=>{Je(e.inputs),et(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},el=(e,t)=>{Je(e.inputs),et(e,"ReduceMax",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(r.indicesSet("input_indices",s,0));return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},tl=(e,t)=>{Je(e.inputs),et(e,"ReduceMean",t,(r,i,n)=>{let a=1;for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&(a*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${a});`]})},rl=(e,t)=>{Je(e.inputs),et(e,"ReduceMin",t,(r,i,n)=>{let a=[];for(let s=0;s<r.rank;s++)(n.indexOf(s)>=0||n.length===0)&&a.push(`input_indices[${s}] = 0;`);return[`${a.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},il=(e,t)=>{Je(e.inputs),et(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},nl=(e,t)=>{Je(e.inputs),et(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},al=(e,t)=>{Je(e.inputs),et(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},tt=(e,t,r)=>{if(t.length===0)return r;let i=1,n=1;for(let a=0;a<t.length;a++)t.indexOf(a)===-1?i*=e[a]:n*=e[a];return n<32&&i>1024},gh=(e,t)=>{tt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?tl(e,t):sh(e,t)},yh=(e,t)=>{tt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Xu(e,t):oh(e,t)},_h=(e,t)=>{tt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Qu(e,t):uh(e,t)},bh=(e,t)=>{tt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ju(e,t):lh(e,t)},wh=(e,t)=>{tt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?el(e,t):dh(e,t)},$h=(e,t)=>{tt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?rl(e,t):ch(e,t)},vh=(e,t)=>{tt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?il(e,t):ph(e,t)},xh=(e,t)=>{tt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?nl(e,t):hh(e,t)},Sh=(e,t)=>{tt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?al(e,t):fh(e,t)},kh=(e,t)=>{tt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Zu(e,t):mh(e,t)}}),on,Th,Ih,ya,J0=Z(()=>{"use strict";oe(),Ae(),ja(),on=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Th=(e,t)=>{on(e.inputs);let r=(i,n,a)=>{let s=[];for(let u=0;u<i.rank;u++)(a.indexOf(u)>=0||a.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(pi("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Ih=(e,t)=>{on(e.inputs);let r=(i,n,a)=>{let s=[];for(let u=0;u<i.rank;u++)(a.indexOf(u)>=0||a.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",n.setByOffset("global_idx","best_index")]};e.compute(pi("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},ya=e=>xe(e)}),sl,jr,ol,ul,ll,Ir,dl,Eh,Ka=Z(()=>{"use strict";oe(),le(),Fa(),de(),sl=(e,t)=>{let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4],u=e[5];if(s&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],d=r.dims[1],h=r.dims[2];if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==h)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(n.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let p=n.dims[0]/3,m=p,_=m;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let I of t.qkvHiddenSizes)if(I%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");p=t.qkvHiddenSizes[0],m=t.qkvHiddenSizes[1],_=t.qkvHiddenSizes[2]}let y=d;if(p!==m)throw new Error("qkv_hidden_sizes first element should be same as the second");if(n.dims[0]!==p+m+_)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let w=0;if(s){if(m!==_)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==m/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(w=s.dims[3])}let S=y+w,v=-1,b=0;if(a)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==d||u.dims[3]!==S)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:d,pastSequenceLength:w,kvSequenceLength:y,totalSequenceLength:S,maxSequenceLength:v,inputHiddenSize:h,hiddenSize:p,vHiddenSize:_,headSize:Math.floor(p/t.numHeads),vHeadSize:Math.floor(_/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},jr=(e,t,r)=>t&&e?`
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
    `,ol=(e,t,r,i,n,a,s,u)=>{let l=Ce(s?1:a),d=64,h=a/l;h<d&&(d=32);let p=Math.ceil(a/l/d),m=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:n},{type:12,data:h},{type:12,data:p}],_=Me(e.dataType,l),y=Re(1,l),w=["type"];s&&w.push("type"),u&&w.push("type");let S=v=>{let b=re("x",e.dataType,e.dims,l),I=[b],k=s?G("seq_lens",s.dataType,s.dims):void 0;k&&I.push(k);let T=u?G("total_sequence_length_input",u.dataType,u.dims):void 0;T&&I.push(T);let C=Re(e.dataType),A=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${d}>;
  var<workgroup> thread_sum: array<f32, ${d}>;
  ${v.registerUniforms(A).declareVariables(...I)}
  ${v.mainStart([d,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${jr(k,T,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${d}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${y}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${y}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${d}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${y}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${y}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${d}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${b.type.value}(${C}(1.0) / ${C}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${y}(x[offset + i]);
        x[offset + i] = ${b.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${b.type.value}(${C}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${d};${_};${l}`,inputDependencies:w},getShaderSource:S,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:n,z:t*r},programUniforms:m})}},ul=(e,t,r,i,n,a,s,u,l)=>{let d=s+a.kvSequenceLength,h=[a.batchSize,a.numHeads,a.sequenceLength,d],p=e>1&&i,m=a.kvNumHeads?a.kvNumHeads:a.numHeads,_=p?[a.batchSize,m,d,a.headSize]:void 0,y=a.nReps?a.nReps:1,w=a.scale===0?1/Math.sqrt(a.headSize):a.scale,S=Ce(a.headSize),v=a.headSize/S,b=12,I={x:Math.ceil(d/b),y:Math.ceil(a.sequenceLength/b),z:a.batchSize*a.numHeads},k=[{type:12,data:a.sequenceLength},{type:12,data:v},{type:12,data:d},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:1,data:w},{type:12,data:s},{type:12,data:a.kvSequenceLength},{type:12,data:y}],T=p&&i&&P.size(i.dims)>0,C=["type","type"];T&&C.push("type"),n&&C.push("type"),u&&C.push("type"),l&&C.push("type");let A=[{dims:h,dataType:t.dataType,gpuDataType:0}];p&&A.push({dims:_,dataType:t.dataType,gpuDataType:0});let $=N=>{let V=G("q",t.dataType,t.dims,S),F=G("key",r.dataType,r.dims,S),Y=[V,F];if(T){let O=G("past_key",i.dataType,i.dims,S);Y.push(O)}n&&Y.push(G("attention_bias",n.dataType,n.dims));let H=u?G("seq_lens",u.dataType,u.dims):void 0;H&&Y.push(H);let D=l?G("total_sequence_length_input",l.dataType,l.dims):void 0;D&&Y.push(D);let K=re("output",t.dataType,h),z=[K];p&&z.push(re("present_key",t.dataType,_,S));let j=Re(1,S),X=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;

  var<workgroup> tileQ: array<${V.type.storage}, ${b*b}>;
  var<workgroup> tileK: array<${V.type.storage}, ${b*b}>;
  ${N.registerUniforms(X).declareVariables(...Y,...z)}
  ${N.mainStart([b,b,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${y===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${y===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${jr(H,D,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${T&&p?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${p?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${j}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${T&&p?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${p?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${j}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(S){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${S}`)}})()};
        output[outputIdx] = ${K.type.value} (sum * uniforms.alpha) + ${n?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${S};${n!==void 0};${i!==void 0};${e}`,inputDependencies:C},getRunData:()=>({outputs:A,dispatchGroup:I,programUniforms:k}),getShaderSource:$}},ll=(e,t,r,i,n,a,s=void 0,u=void 0)=>{let l=a+n.kvSequenceLength,d=n.nReps?n.nReps:1,h=n.vHiddenSize*d,p=e>1&&i,m=n.kvNumHeads?n.kvNumHeads:n.numHeads,_=p?[n.batchSize,m,l,n.headSize]:void 0,y=[n.batchSize,n.sequenceLength,h],w=12,S={x:Math.ceil(n.vHeadSize/w),y:Math.ceil(n.sequenceLength/w),z:n.batchSize*n.numHeads},v=[{type:12,data:n.sequenceLength},{type:12,data:l},{type:12,data:n.vHeadSize},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:12,data:h},{type:12,data:a},{type:12,data:n.kvSequenceLength},{type:12,data:d}],b=p&&i&&P.size(i.dims)>0,I=["type","type"];b&&I.push("type"),s&&I.push("type"),u&&I.push("type");let k=[{dims:y,dataType:t.dataType,gpuDataType:0}];p&&k.push({dims:_,dataType:t.dataType,gpuDataType:0});let T=C=>{let A=G("probs",t.dataType,t.dims),$=G("v",r.dataType,r.dims),N=[A,$];b&&N.push(G("past_value",i.dataType,i.dims));let V=s?G("seq_lens",s.dataType,s.dims):void 0;s&&N.push(V);let F=u?G("total_sequence_length_input",u.dataType,u.dims):void 0;u&&N.push(F);let Y=[re("output",t.dataType,y)];p&&Y.push(re("present_value",t.dataType,_));let H=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;
  var<workgroup> tileQ: array<${A.type.value}, ${w*w}>;
  var<workgroup> tileV: array<${A.type.value}, ${w*w}>;
  ${C.registerUniforms(H).declareVariables(...N,...Y)}
  ${C.mainStart([w,w,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${d===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${d===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${jr(V,F,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${b&&p?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${p?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${A.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${b&&p?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${p?`
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
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:I},getRunData:()=>({outputs:k,dispatchGroup:S,programUniforms:v}),getShaderSource:T}},Ir=(e,t,r,i,n,a,s,u,l,d,h=void 0,p=void 0)=>{let m=Math.min(e.outputCount,1+(s?1:0)+(u?1:0)),_=m>1?s:void 0,y=m>1?u:void 0,w=m>1?d.pastSequenceLength:0,S=w+d.kvSequenceLength,v=l&&P.size(l.dims)>0?l:void 0,b=[t,r];_&&P.size(_.dims)>0&&b.push(_),v&&b.push(v),h&&b.push(h),p&&b.push(p);let I=e.compute(ul(m,t,r,_,v,d,w,h,p),{inputs:b,outputs:m>1?[-1,1]:[-1]})[0];e.compute(ol(I,d.batchSize,d.numHeads,w,d.sequenceLength,S,h,p),{inputs:h&&p?[I,h,p]:[I],outputs:[]});let k=[I,i];y&&P.size(y.dims)>0&&k.push(y),h&&k.push(h),p&&k.push(p),e.compute(ll(m,I,i,y,d,w,h,p),{inputs:k,outputs:m>1?[0,2]:[0]})},dl=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,n=t.inputHiddenSize,a=t.headSize,s=12,u={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],d=[{type:12,data:i},{type:12,data:n},{type:12,data:a},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],h=p=>{let m=re("output_q",l[0].dataType,r),_=re("output_k",l[0].dataType,r),y=re("output_v",l[0].dataType,r),w=G("input",l[0].dataType,l[0].dims),S=G("weight",l[1].dataType,l[1].dims),v=G("bias",l[2].dataType,l[2].dims),b=w.type.storage,I=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${b}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${b}, ${s*s}>;
  var<workgroup> tileWeightK: array<${b}, ${s*s}>;
  var<workgroup> tileWeightV: array<${b}, ${s*s}>;
  ${p.registerUniforms(I).declareVariables(w,S,v,m,_,y)}
  ${p.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${b}(0);
    var valueK = ${b}(0);
    var valueV = ${b}(0);
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
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:d}),getShaderSource:h},{inputs:l,outputs:[-1,-1,-1]})},Eh=(e,t)=>{let r=sl(e.inputs,t),[i,n,a]=dl(e,r);return Ir(e,i,n,a,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),cl,pl,hl,Ch,e_=Z(()=>{"use strict";Ze(),oe(),le(),Ae(),de(),cl=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,n,a)=>{let s=n.length;if(s!==i.length)throw new Error(`${a}: num dimensions != ${s}`);n.forEach((u,l)=>{if(u!==i[l])throw new Error(`${a}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},pl=(e,t)=>{let{epsilon:r,spatial:i,format:n}=t,a=e[0].dims,s=i?Ce(a[a.length-1]):1,u=n==="NHWC"&&a.length>1?s:1,l=P.size(a)/s,d=i,h=d?a.length:a,p=G("x",e[0].dataType,e[0].dims,s),m=G("scale",e[1].dataType,e[1].dims,u),_=G("bias",e[2].dataType,e[2].dims,u),y=G("inputMean",e[3].dataType,e[3].dims,u),w=G("inputVar",e[4].dataType,e[4].dims,u),S=re("y",e[0].dataType,h,s),v=()=>{let I="";if(i)I=`let cOffset = ${a.length===1?"0u":n==="NHWC"?`outputIndices[${a.length-1}] / ${s}`:"outputIndices[1]"};`;else if(n==="NCHW")I=`
            ${S.indicesSet("outputIndices","0","0")}
            let cOffset = ${S.indicesToOffset("outputIndices")};`;else{I=`var cIndices = ${m.type.indices}(0);
                       cIndices[0] = outputIndices[${a.length-1}];`;for(let k=1;k<m.rank;k++)I+=`cIndices[${k}] = outputIndices[${k}];`;I+=`let cOffset = ${m.indicesToOffset("cIndices")};`}return I},b=I=>`
  const epsilon = ${r};
  ${I.registerUniform("outputSize","u32").declareVariables(p,m,_,y,w,S)}
  ${I.mainStart()}
  ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${S.offsetToIndices(`global_idx * ${s}`)};
    ${v()}
    let scale = ${m.getByOffset("cOffset")};
    let bias = ${_.getByOffset("cOffset")};
    let inputMean = ${y.getByOffset("cOffset")};
    let inputVar = ${w.getByOffset("cOffset")};
    let x = ${p.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${S.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:d?["rank","type","type","type","type"]:void 0},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d?[{type:12,data:l},...se(a)]:[{type:12,data:l}]})}},hl=e=>xe(e),Ch=(e,t)=>{let{inputs:r,outputCount:i}=e,n=hl({...t,outputCount:i});if(ve.webgpu.validateInputContent&&cl(r,n),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(pl(r,n))}}),fl,ml,Ah,t_=Z(()=>{"use strict";le(),de(),fl=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},ml=e=>{let t=e[0].dims,r=e[0].dims[2],i=P.size(t)/4,n=e[0].dataType,a=G("input",n,t,4),s=G("bias",n,[r],4),u=G("residual",n,t,4),l=re("output",n,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:d=>`
  const channels = ${r}u / 4;
  ${d.declareVariables(a,s,u,l)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${a.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},Ah=e=>{fl(e.inputs),e.compute(ml(e.inputs))}}),gl,$e,zh,Oh,Rh,Mh,Dh,Bh,Nh,Ph,Uh,yl,Lh,Wh,qh,Vh,vr,Gh,si,Fh,Hh,jh,Kh,Yh,Zh,Xh,Qh,Jh,ef,tf,rf,nf,af,sf,of,uf,un,lf,_a,ba,df,cf,pf,_l,bl,hf,Ya=Z(()=>{"use strict";oe(),le(),Ae(),de(),gl=(e,t,r,i,n,a,s)=>{let u=Math.ceil(t/4),l="";typeof n=="string"?l=`${n}(a)`:l=n("a");let d=G("inputData",r,[u],4),h=re("outputData",i,[u],4),p=[{name:"vec_size",type:"u32"}];return s&&p.push(...s),`
      ${e.registerUniforms(p).declareVariables(d,h)}

  ${a??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${h.setByOffset("global_idx",l)}
  }`},$e=(e,t,r,i,n,a=e.dataType,s,u)=>{let l=[{type:12,data:Math.ceil(P.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:n,inputDependencies:["type"]},getShaderSource:d=>gl(d,P.size(e.dims),e.dataType,a,r,i,u),getRunData:d=>({outputs:[{dims:e.dims,dataType:a}],dispatchGroup:{x:Math.ceil(P.size(d[0].dims)/64/4)},programUniforms:l})}},zh=e=>{e.compute($e(e.inputs[0],"Abs","abs"))},Oh=e=>{e.compute($e(e.inputs[0],"Acos","acos"))},Rh=e=>{e.compute($e(e.inputs[0],"Acosh","acosh"))},Mh=e=>{e.compute($e(e.inputs[0],"Asin","asin"))},Dh=e=>{e.compute($e(e.inputs[0],"Asinh","asinh"))},Bh=e=>{e.compute($e(e.inputs[0],"Atan","atan"))},Nh=e=>{e.compute($e(e.inputs[0],"Atanh","atanh"))},Ph=e=>xe(e),Uh=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute($e(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},yl=e=>{let t,r,i=e.length>=2&&e[1].data!==0,n=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=n?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=n?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return xe({min:t,max:r})},Lh=(e,t)=>{let r=t||yl(e.inputs),i=Re(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Clip",n=>`clamp(${n}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},Wh=e=>{e.compute($e(e.inputs[0],"Ceil","ceil"))},qh=e=>{e.compute($e(e.inputs[0],"Cos","cos"))},Vh=e=>{e.compute($e(e.inputs[0],"Cosh","cosh"))},vr=e=>xe(e),Gh=(e,t)=>{let r=Re(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},si=(e="f32")=>`
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
}`,Fh=e=>{let t=Re(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,si(t)))},Hh=e=>{e.compute($e(e.inputs[0],"Exp","exp"))},jh=e=>{e.compute($e(e.inputs[0],"Floor","floor"))},Kh=e=>{let t=Re(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,si(t)))},Yh=(e,t)=>{let r=Re(e.inputs[0].dataType);e.compute($e(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Zh=e=>{e.compute($e(e.inputs[0],"Not",t=>`!${t}`))},Xh=e=>{e.compute($e(e.inputs[0],"Neg",t=>`-${t}`))},Qh=e=>{e.compute($e(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Jh=e=>{let t=Re(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},ef=e=>{e.compute($e(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},tf=e=>xe(e),rf=(e,t)=>{let r=Re(e.inputs[0].dataType);e.compute($e(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},nf=e=>{let t=Re(e.inputs[0].dataType);e.compute($e(e.inputs[0],"HardSwish",r=>`${r} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${r} + vec4<${t}>(0.5)))`))},af=e=>{e.compute($e(e.inputs[0],"Sin","sin"))},sf=e=>{e.compute($e(e.inputs[0],"Sinh","sinh"))},of=e=>{e.compute($e(e.inputs[0],"Sqrt","sqrt"))},uf=e=>{e.compute($e(e.inputs[0],"Tan","tan"))},un=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,lf=e=>{e.compute($e(e.inputs[0],"Tanh",un))},_a=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${un("v")};
}
`,ba=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,df=e=>{let t=Re(e.inputs[0].dataType);e.compute($e(e.inputs[0],"FastGelu",ba,_a(t),void 0,e.inputs[0].dataType))},cf=(e,t)=>{let r=Re(e.inputs[0].dataType);return e.compute($e(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},pf=e=>{e.compute($e(e.inputs[0],"Log","log"))},_l=(e,t)=>`
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
`,bl=e=>`quick_gelu_impl(${e})`,hf=(e,t)=>{let r=Re(e.inputs[0].dataType);e.compute($e(e.inputs[0],"QuickGelu",bl,_l(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),wl,$l,ff,r_=Z(()=>{"use strict";le(),de(),Ya(),wl=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},$l=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=G("input",e[0].dataType,e[0].dims,4),i=G("bias",e[0].dataType,[e[0].dims[2]],4),n=re("output",e[0].dataType,t,4),a=P.size(t)/4,s=Me(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,i,n)}

  ${si(s)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${n.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},ff=e=>{wl(e.inputs),e.compute($l(e.inputs))}}),vl,xl,rt,mf,gf,yf,_f,bf,wf,$f,vf,xf,Sf,i_=Z(()=>{"use strict";oe(),le(),de(),vl=(e,t,r,i,n,a,s,u,l,d,h,p)=>{let m,_;typeof u=="string"?m=_=(b,I)=>`${u}((${b}),(${I}))`:typeof u=="function"?m=_=u:(m=u.scalar,_=u.vector);let y=re("outputData",h,i.length,4),w=G("aData",l,t.length,4),S=G("bData",d,r.length,4),v;if(n)if(a){let b=P.size(t)===1,I=P.size(r)===1,k=t.length>0&&t[t.length-1]%4===0,T=r.length>0&&r[r.length-1]%4===0;b||I?v=y.setByOffset("global_idx",_(b?`${w.type.value}(${w.getByOffset("0")}.x)`:w.getByOffset("global_idx"),I?`${S.type.value}(${S.getByOffset("0")}.x)`:S.getByOffset("global_idx"))):v=`
            let outputIndices = ${y.offsetToIndices("global_idx * 4u")};
            let offsetA = ${w.broadcastedIndicesToOffset("outputIndices",y)};
            let offsetB = ${S.broadcastedIndicesToOffset("outputIndices",y)};
            ${y.setByOffset("global_idx",_(s||k?w.getByOffset("offsetA / 4u"):`${w.type.value}(${w.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||T?S.getByOffset("offsetB / 4u"):`${S.type.value}(${S.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else v=y.setByOffset("global_idx",_(w.getByOffset("global_idx"),S.getByOffset("global_idx")));else{if(!a)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let b=(I,k,T="")=>{let C=`aData[indexA${k}][componentA${k}]`,A=`bData[indexB${k}][componentB${k}]`;return`
            let outputIndices${k} = ${y.offsetToIndices(`global_idx * 4u + ${k}u`)};
            let offsetA${k} = ${w.broadcastedIndicesToOffset(`outputIndices${k}`,y)};
            let offsetB${k} = ${S.broadcastedIndicesToOffset(`outputIndices${k}`,y)};
            let indexA${k} = offsetA${k} / 4u;
            let indexB${k} = offsetB${k} / 4u;
            let componentA${k} = offsetA${k} % 4u;
            let componentB${k} = offsetB${k} % 4u;
            ${I}[${k}] = ${T}(${m(C,A)});
          `};h===9?v=`
            var data = vec4<u32>(0);
            ${b("data",0,"u32")}
            ${b("data",1,"u32")}
            ${b("data",2,"u32")}
            ${b("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:v=`
            ${b("outputData[global_idx]",0)}
            ${b("outputData[global_idx]",1)}
            ${b("outputData[global_idx]",2)}
            ${b("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(w,S,y)}

        ${p??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${v}
      }`},xl=(e,t,r,i,n,a,s=r.dataType)=>{let u=r.dims.map(Number),l=i.dims.map(Number),d=!P.areEqual(u,l),h=u,p=P.size(u),m=!1,_=!1,y=[d];if(d){let w=tr.calcShape(u,l,!1);if(!w)throw new Error("Can't perform binary op on the given tensors");h=w.slice(),p=P.size(h);let S=P.size(u)===1,v=P.size(l)===1,b=u.length>0&&u[u.length-1]%4===0,I=l.length>0&&l[l.length-1]%4===0;y.push(S),y.push(v),y.push(b),y.push(I);let k=1;for(let T=1;T<h.length;T++){let C=u[u.length-T],A=l[l.length-T];if(C===A)k*=C;else break}k%4===0?(_=!0,m=!0):(S||v||b||I)&&(m=!0)}else m=!0;return y.push(m),{name:e,shaderCache:{hint:t+y.map(w=>w.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:w=>vl(w,u,l,h,m,d,_,n,r.dataType,i.dataType,s,a),getRunData:()=>({outputs:[{dims:h,dataType:s}],dispatchGroup:{x:Math.ceil(p/64/4)},programUniforms:[{type:12,data:Math.ceil(P.size(h)/4)},...se(u,l,h)]})}},rt=(e,t,r,i,n,a)=>{e.compute(xl(t,n??"",e.inputs[0],e.inputs[1],r,i,a))},mf=e=>{rt(e,"Add",(t,r)=>`${t}+${r}`)},gf=e=>{rt(e,"Div",(t,r)=>`${t}/${r}`)},yf=e=>{rt(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},_f=e=>{rt(e,"Mul",(t,r)=>`${t}*${r}`)},bf=e=>{let t=G("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;rt(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
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
      `)},wf=e=>{rt(e,"Sub",(t,r)=>`${t}-${r}`)},$f=e=>{rt(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},vf=e=>{rt(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},xf=e=>{rt(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},Sf=e=>{rt(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),Sl,kl,Tl,Il,kf,Tf,n_=Z(()=>{"use strict";oe(),le(),Ae(),de(),Sl=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],n=i.dataType,a=i.dims.length;e.forEach((s,u)=>{if(u!==r){if(s.dataType!==n)throw new Error("input tensors should be one type");if(s.dims.length!==a)throw new Error("input tensors should have the same shape");s.dims.forEach((l,d)=>{if(d!==t&&l!==i.dims[d])throw new Error("non concat dimensions must match")})}})},kl=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,Tl=(e,t)=>{let r=e.length,i=[];for(let n=0;n<r;++n){let a=t.setByOffset("global_idx",e[n].getByIndices("indices"));r===1?i.push(a):n===0?i.push(`if (inputIndex == ${n}u) { ${a} }`):n===r-1?i.push(`else { ${a} }`):i.push(`else if (inputIndex == ${n}) { ${a} }`)}return i.join(`
`)},Il=(e,t,r,i)=>{let n=P.size(r),a=new Array(e.length),s=new Array(e.length),u=0,l=[],d=[],h=[{type:12,data:n}];for(let w=0;w<e.length;++w)u+=e[w].dims[t],a[w]=u,d.push(e[w].dims.length),s[w]=G(`input${w}`,i,d[w]),l.push("rank"),h.push({type:12,data:a[w]});for(let w=0;w<e.length;++w)h.push(...se(e[w].dims));h.push(...se(r));let p=re("output",i,r.length),m=p.indicesGet("indices",t),_=Array.from(Array(a.length).keys()).map(w=>`uniforms.sizeInConcatAxis${w}`).join(","),y=w=>`

  ${(()=>{w.registerUniform("outputSize","u32");for(let S=0;S<e.length;S++)w.registerUniform(`sizeInConcatAxis${S}`,"u32");return w.declareVariables(...s,p)})()}

  ${kl(a.length,_)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${p.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${m});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${a.length}u>(${_});
      ${m} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${Tl(s,p)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:h}),getShaderSource:y}},kf=(e,t)=>{let r=e.inputs,i=r[0].dims,n=P.normalizeAxis(t.axis,i.length);Sl(r,n);let a=i.slice();a[n]=r.reduce((u,l)=>u+(l.dims.length>n?l.dims[n]:0),0);let s=r.filter(u=>P.size(u.dims)>0);e.compute(Il(s,n,a,r[0].dataType),{inputs:s})},Tf=e=>xe({axis:e.axis})}),Vt,Gt,Ft,Za,jt=Z(()=>{"use strict";oe(),le(),Vt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Gt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Ft=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Za=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[r,i]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=(e==null?void 0:e.activation_params)||[Zp,Xp];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Be,If,Xa=Z(()=>{"use strict";Be=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},If=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Ef,a_=Z(()=>{"use strict";Ef=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Sr,Qa,Ja=Z(()=>{"use strict";oe(),le(),de(),jt(),Sr=(e,t,r,i,n)=>{let a=i-r;return`
      ${Array.from({length:r}).map((s,u)=>`
      if (${ne(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,ne(n,u+a,i))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},Qa=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,u=e[1].dims,l=s[s.length-2],d=u[u.length-1],h=s[s.length-1],p=Ce(d),m=Ce(h),_=Ce(l),y=P.size(r)/p/_,w=e.length>2,S=i?i.slice(0,-2):r.slice(0,-2),v=[P.size(S),l,d],b=[{type:12,data:y},{type:12,data:l},{type:12,data:d},{type:12,data:h}];Gt(t,b),b.push(...se(S,s,u)),w&&b.push(...se(e[2].dims)),b.push(...se(v));let I=k=>{let T=Ha("batch_dims",e[0].dataType,S.length),C=G("a",e[0].dataType,s.length,m),A=G("b",e[1].dataType,u.length,p),$=re("output",e[0].dataType,v.length,p),N=Me($.type.tensor),V=Vt(t,$.type.value,N),F=[C,A],Y="";if(w){let K=n?p:1;F.push(G("bias",e[2].dataType,e[2].dims.length,K)),Y=`${n?`value += bias[col / ${K}];`:`value += ${$.type.value}(bias[row + i]);`}`}let H=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Ft(t,H);let D=()=>{let K=`var a_data: ${C.type.value};`;for(let z=0;z<m;z++)K+=`
              let b_data${z} = b[(b_offset + (k + ${z}) * uniforms.N + col) / ${p}];`;for(let z=0;z<_;z++){K+=`a_data = a[(a_offset + (row + ${z}) * uniforms.K + k) / ${m}];`;for(let j=0;j<m;j++)K+=`
            values[${z}] = fma(${A.type.value}(a_data${m===1?"":`[${j}]`}), b_data${j}, values[${z}]);
`}return K};return`
  ${k.registerUniforms(H).registerInternalVariables(T).declareVariables(...F,$)}
  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${p})) * ${p};
    var index1 = global_idx / (uniforms.N / ${p});
    let stride1 = uniforms.M / ${_};
    let row = (index1 % stride1) * ${_};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${T.offsetToIndices("batch")};`}

    var a_indices: ${C.type.indices};
    ${Sr("a_indices",C,C.rank-2,T.rank,"batch_indices")}
    ${C.indicesSet("a_indices",C.rank-2,0)}
    ${C.indicesSet("a_indices",C.rank-1,0)}
    let a_offset = ${C.indicesToOffset("a_indices")};

    var b_indices: ${A.type.indices};
    ${Sr("b_indices",A,A.rank-2,T.rank,"batch_indices")}
    ${A.indicesSet("b_indices",A.rank-2,0)}
    ${A.indicesSet("b_indices",A.rank-1,0)}
    let b_offset = ${A.indicesToOffset("b_indices")};
    var values: array<${$.type.value}, ${_}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${m}) {
      ${D()}
    }
    for (var i = 0u; i < ${_}u; i++) {
      var value = values[i];
      ${Y}
      ${V}
      let cur_indices = ${$.type.indices}(batch, row + i, col);
      let offset = ${$.indicesToOffset("cur_indices")};
      ${$.setByOffset(`offset / ${p}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${p};${m};${_};${n}`,inputDependencies:w?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(y/64)},programUniforms:b}),getShaderSource:I}}}),El,Cl,wa,ln,Al,$a,zl,hi,es=Z(()=>{"use strict";oe(),le(),de(),jt(),Ja(),Xa(),El=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Cl=(e,t)=>e?`
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
        }`,wa=(e,t,r="f32",i,n=!1,a=32,s=!1,u=32)=>{let l=t[1]*e[1],d=t[0]*e[0],h=n?l:a,p=n?a:l,m=h/t[0],_=a/t[1];if(!((n&&m===4&&e[1]===4||!n&&(m===3||m===4))&&h%t[0]===0&&a%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${n} is true, innerElementSize ${m} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${m} must be 3 or 4.
  tileAWidth ${h} must be divisible by workgroupSize[0]${t[0]}. tileInner ${a} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${m}<${r}>, ${h/m}>, ${p}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${d/e[0]}>, ${a}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${m};
const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${s?`${Math.ceil(u/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${_};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${El(n,i)}
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
          ${m===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Cl(n,m)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},ln=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Al=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",$a=(e,t,r="f32",i,n=!1,a=32,s=!1,u=32,l=!1)=>{let d=e[1]*t[1],h=e[0]*t[0],p=n?d:a,m=n?a:d;if(!(m%t[1]===0&&p%t[0]===0&&a%t[1]===0))throw new Error(`tileAHight ${m} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${p} must be divisible by workgroupSize[0]${t[0]}, tileInner ${a} must be divisible by workgroupSize[1]${t[1]}`);let _=m/t[1],y=p/t[0],w=a/t[1],S=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${h};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${m}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${p}; inputCol = inputCol + ${t[0]}) {
          ${ln(n,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${a}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${h}; inputCol = inputCol + ${t[0]}) {
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
let globalRowStart = i32(workgroupId.y) * ${d};

let tileRowA = i32(localId.y) * ${_};
let tileColA = i32(localId.x) * ${y};
let tileRowB = i32(localId.y) * ${w};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${_}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${y}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${ln(n,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${w}; innerRow = innerRow + 1) {
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
      ${Al(n)}
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
  var<workgroup> mm_Asub : array<array<${r}, ${p}>, ${m}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${h}>, ${a}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${a};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(u/a)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${S}
  }
`},zl=(e,t,r,i,n=!1)=>{let[a,s,u,l]=i,d=Me(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Be(e,d)} {
      var value = ${Be(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${Sr("aIndices",s,s.rank-2,a.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${a.type.indices}) -> ${Be(e,d)} {
      var value = ${Be(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${Sr("bIndices",u,u.rank-2,a.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Be(e,d)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${n?"bias[colIn]":`${Be(e,d)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},hi=(e,t,r,i,n=!1,a)=>{let s=e[0].dims,u=e[1].dims,l=s.slice(0,-2),d=u.slice(0,-2),h=i?i.slice(0,-2):r.slice(0,-2),p=P.size(h),m=s[s.length-2],_=s[s.length-1],y=u[u.length-1],w=_%4===0&&y%4===0,S=m<=8?[4,1,1]:[4,4,1],v=[8,8,1],b=[Math.ceil(y/v[0]/S[0]),Math.ceil(m/v[1]/S[1]),Math.ceil(p/v[2]/S[2])],I=w?4:1,k=[...l,m,_/I],T=k.length,C=[...d,_,y/I],A=C.length,$=[p,m,y/I],N=[{type:6,data:m},{type:6,data:y},{type:6,data:_}];Gt(t,N),N.push(...se(h,k,C));let V=["rank","rank"],F=e.length>2;F&&(N.push(...se(e[2].dims)),V.push("rank")),N.push(...se($));let Y=H=>{let D=h.length,K=Ha("batchDims",e[0].dataType,D,1),z=Me(e[0].dataType),j=G("a",e[0].dataType,T,I),X=G("b",e[1].dataType,A,I),O=re("result",e[0].dataType,$.length,I),B=[j,X];if(F){let Q=n?I:1;B.push(G("bias",e[2].dataType,e[2].dims.length,Q))}let R=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Ft(t,R);let L=Me(O.type.tensor),U=Vt(t,O.type.value,L),W=zl(I,F,U,[K,j,X,O],n);return`
  ${H.registerUniforms(R).registerInternalVariables(K).declareVariables(...B,O)}
  ${W}
  ${w?wa(S,v,z,K):$a(S,v,z,K)}
                   `};return{name:"MatMul",shaderCache:{hint:`${S};${t.activation};${w};${n}`,inputDependencies:V},getRunData:()=>({outputs:[{dims:a?a(r):r,dataType:e[0].dataType}],dispatchGroup:{x:b[0],y:b[1],z:b[2]},programUniforms:N}),getShaderSource:Y}}}),Ol,Cf,s_=Z(()=>{"use strict";oe(),gt(),de(),jt(),Xa(),a_(),es(),Ol=(e,t,r,i,n=!1,a,s=4,u=4,l=4,d="f32")=>{let h=N=>{switch(N){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${N} is not supported.`)}},p=N=>{switch(N){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${N} is not supported.`)}},m=e?`
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
    `,y=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",w=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",S=e?"row":"col",v=e?"col":"row",b=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${S} / outWidth;
    let outCol = ${S} % outWidth;

    let WRow = ${v} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${v} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${v} % inChannels;
    var resData = ${Be(s,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${y} && xCol >= 0 && xCol < ${w}) {
      ${m}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${h(s)}
    }
    return resData;`,I=e?t&&i?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${b}
    }
    return ${Be(s,d)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${b}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${b}
    }
    return ${Be(s,d)}(0.0);`,k=e?i&&r?p(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${p(u)}
    }
    return ${Be(u,d)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${p(u)}
    }
    return ${Be(u,d)}(0.0);`,T=Be(l,d),C=Be(e?s:u,d),A=Be(e?u:s,d),$=Vt(a,T,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${C} {
      ${e?I:k}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?k:I}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${T}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${_}
      ${If(n)}
      ${$}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Cf=(e,t,r,i,n,a,s,u,l)=>{let d=t.format==="NHWC",h=d?e[0].dims[3]:e[0].dims[1],p=r[0],m=d?r[2]:r[3],_=d?r[1]:r[2],y=d?r[3]:r[1],w=d&&(h%4===0||h%3===0)&&y%4===0,S=d?y:m*_,v=d?m*_:y,b=[8,8,1],I=i<=8?[4,1,1]:[4,4,1],k=[Math.ceil(S/b[0]/I[0]),Math.ceil(v/b[1]/I[1]),Math.ceil(p/b[2]/I[2])];be("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${k}`);let T=w?d&&h%4!==0?3:4:1,C=b[1]*I[1],A=b[0]*I[0],$=Math.max(b[0]*T,b[1]),N=i%C===0,V=n%A===0,F=a%$===0,Y=w?[T,4,4]:[1,1,1],H=[{type:6,data:i},{type:6,data:n},{type:6,data:a},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Gt(t,H),H.push(...se(e[0].dims,e[1].dims));let D=["rank","rank"];s&&(H.push(...se(e[2].dims)),D.push("rank")),H.push(...se(r));let K=z=>{let j=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Ft(t,j);let X=w?4:1,O=Me(e[0].dataType),B=`
      fn setOutputAtIndex(flatIndex : i32, value : ${w?`vec4<${O}>`:O}) {
        result[flatIndex] = ${w?`vec4<${O}>`:O}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${w?`vec4<${O}>`:O}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${w?"/ 4":""}, value);
      }`,R=G("x",e[0].dataType,e[0].dims.length,T===3?1:T),L=G("w",e[1].dataType,e[1].dims.length,X),U=[R,L],W=re("result",e[0].dataType,r.length,X);if(s){let Q=G("bias",e[2].dataType,e[2].dims.length,X);U.push(Q),B+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${w?`vec4<${O}>`:O} {
          return bias[coords.${d?"w":"y"}${w?"/ 4":""}];
        }`}return`
        ${Ef("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${z.registerUniforms(j).declareVariables(...U,W)}
        ${B}
        ${Ol(d,N,V,F,s,t,Y[0],Y[1],Y[2],O)}
        ${w?wa(I,b,O,void 0,!d,$):$a(I,b,O,void 0,!d,$,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${T};${w};${N};${V};${F};${C};${A};${$}`,inputDependencies:D},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:k[0],y:k[1],z:k[2]},programUniforms:H}),getShaderSource:K}}}),Rl,dn,pr,Ml,cn,Dl,Af,zf,o_=Z(()=>{"use strict";oe(),gt(),le(),de(),jt(),Xa(),Rl=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},dn=e=>typeof e=="number"?[e,e,e]:e,pr=(e,t)=>t<=1?e:e+(e-1)*(t-1),Ml=(e,t,r,i=1)=>{let n=pr(t,i);return Math.floor((e[0]*(r-1)-r+n)/2)},cn=(e,t,r,i,n)=>{n==null&&(n=Ml(e,t[0],i[0]));let a=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*n>=t[s]&&(a[s]=Math.trunc((e[s]-t[s]+2*n)/i[s]+1));return a},Dl=(e,t,r,i,n,a,s,u,l,d)=>{let h,p,m,_;if(e==="VALID"&&(e=0),typeof e=="number"){h={top:e,bottom:e,left:e,right:e,front:e,back:e};let y=cn([t,r,i,1],[u,l,d],1,[n,a,s],e);p=y[0],m=y[1],_=y[2]}else if(Array.isArray(e)){if(!e.every((w,S,v)=>w===v[0]))throw Error(`Unsupported padding parameter: ${e}`);h={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let y=cn([t,r,i,1],[u,l,d],1,[n,a,s],e[0]);p=y[0],m=y[1],_=y[2]}else if(e==="SAME_UPPER"){p=Math.ceil(t/n),m=Math.ceil(r/a),_=Math.ceil(i/s);let y=(p-1)*n+u-t,w=(m-1)*a+l-r,S=(_-1)*s+d-i,v=Math.floor(y/2),b=y-v,I=Math.floor(w/2),k=w-I,T=Math.floor(S/2),C=S-T;h={top:I,bottom:k,left:T,right:C,front:v,back:b}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:h,outDepth:p,outHeight:m,outWidth:_}},Af=(e,t,r,i,n,a=!1,s="channelsLast")=>{let u,l,d,h,p;if(s==="channelsLast")[u,l,d,h,p]=e;else if(s==="channelsFirst")[u,p,l,d,h]=e;else throw new Error(`Unknown dataFormat ${s}`);let[m,,_,y,w]=t,[S,v,b]=dn(r),[I,k,T]=dn(i),C=pr(_,I),A=pr(y,k),$=pr(w,T),{padInfo:N,outDepth:V,outHeight:F,outWidth:Y}=Dl(n,l,d,h,S,v,b,C,A,$),H=a?m*p:m,D=[0,0,0,0,0];return s==="channelsFirst"?D=[u,H,V,F,Y]:s==="channelsLast"&&(D=[u,V,F,Y,H]),{batchSize:u,dataFormat:s,inDepth:l,inHeight:d,inWidth:h,inChannels:p,outDepth:V,outHeight:F,outWidth:Y,outChannels:H,padInfo:N,strideDepth:S,strideHeight:v,strideWidth:b,filterDepth:_,filterHeight:y,filterWidth:w,effectiveFilterDepth:C,effectiveFilterHeight:A,effectiveFilterWidth:$,dilationDepth:I,dilationHeight:k,dilationWidth:T,inShape:e,outShape:D,filterShape:t}},zf=(e,t,r,i,n,a)=>{let s=a==="channelsLast",u=s?e[0].dims[3]:e[0].dims[1],l=!1,d=[64,1,1],h={x:r.map((b,I)=>I)},p=[Math.ceil(Rl(h.x.map(b=>r[b]))/d[0]),1,1];be("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${p}`);let m=l?s&&u%4!==0?3:4:1,_=P.size(r),y=[{type:12,data:_},{type:12,data:i},{type:12,data:n},{type:12,data:t.strides},{type:12,data:t.dilations}];Gt(t,y),y.push(...se(e[0].dims,e[1].dims));let w=["rank","rank"],S=e.length===3;S&&(y.push(...se(e[2].dims)),w.push("rank")),y.push(...se(r));let v=b=>{let I=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:n.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Ft(t,I);let k=l?4:1,T=Me(e[0].dataType),C=G("x",e[0].dataType,e[0].dims.length,m===3?1:m),A=G("W",e[1].dataType,e[1].dims.length,k),$=[C,A],N=re("result",e[0].dataType,r.length,k),V="";if(S){let H=G("bias",e[2].dataType,e[2].dims.length,k);$.push(H),V+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${l?`vec4<${T}>`:T} {
          return bias[${s?ne("coords",4,5):ne("coords",1,5)}${l?"/ 4":""}];
        }`}let F=Be(m,T),Y=Vt(t,F,T);return`
            ${V}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${T} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${C.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${T} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${A.getByIndices("aIndices")};
            }
          ${b.registerUniforms(I).declareVariables(...$,N)}
          ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${N.offsetToIndices("global_idx")};
              let batch = ${ne("coords",0,C.rank)};
              let d2 = ${s?ne("coords",C.rank-1,C.rank):ne("coords",1,C.rank)};
              let xFRCCorner = vec3<u32>(${s?ne("coords",1,C.rank):ne("coords",2,C.rank)},
              ${s?ne("coords",2,C.rank):ne("coords",3,C.rank)},
              ${s?ne("coords",3,C.rank):ne("coords",4,C.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?ne("uniforms.x_shape",1,C.rank):ne("uniforms.x_shape",2,C.rank)};
              let xShapeZ = ${s?ne("uniforms.x_shape",2,C.rank):ne("uniforms.x_shape",3,C.rank)};
              let xShapeW = ${s?ne("uniforms.x_shape",3,C.rank):ne("uniforms.x_shape",4,C.rank)};
              let xShapeU = ${s?ne("uniforms.x_shape",4,C.rank):ne("uniforms.x_shape",1,C.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = ${T}(0);
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
                      ${s?`let xValues = vec4<${T}>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<${T}>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<${T}>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<${T}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<${T}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<${T}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<${T}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<${T}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<${T}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${S?"value = value + getBiasByOutputCoords(coords)":""};
              ${Y}
              result[global_idx] = ${T}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${m};${S}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:p[0],y:p[1],z:p[2]},programUniforms:y}),getShaderSource:v}}}),Of,Rf,u_=Z(()=>{"use strict";oe(),le(),de(),jt(),Of=(e,t,r,i)=>{let n=e.length>2,a=n?"value += b[output_channel];":"",s=e[0].dims,u=e[1].dims,l=t.format==="NHWC",d=l?r[3]:r[1],h=d/t.group,p=l&&h>=4?Ce(d):1,m=P.size(r)/p,_=[{type:12,data:m},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:h}];Gt(t,_),_.push(...se(s,[u[0],u[1],u[2],u[3]/p]));let y=n?["rank","rank","rank"]:["rank","rank"];_.push(...se([r[0],r[1],r[2],r[3]/p]));let w=S=>{let v=re("output",e[0].dataType,r.length,p),b=Me(v.type.tensor),I=Vt(t,v.type.value,b),k=G("x",e[0].dataType,s.length),T=G("w",e[1].dataType,u.length,p),C=[k,T];n&&C.push(G("b",e[2].dataType,e[2].dims,p));let A=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Ft(t,A);let $=l?`
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
            let xVal = ${k.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${T.get("wHeight","wWidth","wInChannel","output_channel")};
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

            let xVal = ${k.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${T.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${S.registerUniforms(A).declareVariables(...C,v)}

  ${S.mainStart()}
    ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${v.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${p} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${v.type.value} = ${v.type.value}(0);
    ${$}
    ${a}
    ${I}
    ${v.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${p}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:_}),getShaderSource:w}},Rf=(e,t,r,i)=>{let n=e.length>2,a=Ce(r[3]),s=Ce(r[2]),u=P.size(r)/a/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/a],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/a],h=[r[0],r[1],r[2],r[3]/a],p=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Gt(t,p),p.push(...se(l,d,h));let m=(s-1)*t.strides[1]+d[1],_=y=>{let w=re("output",e[0].dataType,h.length,a),S=Me(w.type.tensor),v=Vt(t,w.type.value,S),b=G("x",e[0].dataType,l.length,a),I=G("w",e[1].dataType,d.length,a),k=[b,I];n&&k.push(G("b",e[2].dataType,e[2].dims,a));let T=n?"value += b[output_channel];":"",C=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Ft(t,C),`
  ${y.registerUniforms(C).declareVariables(...k,w)}
  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${b.type.value}, ${m}>;
    var values: array<${w.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${m}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${b.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${b.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${I.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${T}
      ${v}
      ${w.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${a};${s};${m};${d[0]};${d[1]}`,inputDependencies:n?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:p}),getShaderSource:_}}}),Bl,Kr,Nl,Yr,va,pn,Pl,Ul,xa,l_=Z(()=>{"use strict";le(),s_(),o_(),es(),u_(),jt(),Ja(),Ct(),Bl=(e,t,r,i,n,a)=>{let s=e[0],u=e.slice(a?1:2,a?3:4),l=u.length,d=t[0],h=t.slice(2).map((m,_)=>m+(m-1)*(r[_]-1)),p=u.map((m,_)=>m+i[_]+i[_+l]).map((m,_)=>Math.floor((m-h[_]+n[_])/n[_]));return p.splice(0,0,s),p.splice(a?3:1,0,d),p},Kr=[2,3,1,0],Nl=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Yr=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let a=2;a<t[1].dims.length;++a)r[a-2]===0&&(r[a-2]=t[1].dims[a]);let i=e.pads.slice();ci.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let n=Object.assign({},e);return Object.assign(n,{kernelShape:r,pads:i}),n},va=e=>{let t=Za(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],n=e.dilations,a=e.group,s=e.kernel_shape,u=e.pads,l=e.strides,d=e.w_is_const();return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},pn=(e,t,r,i)=>{let n=r.format==="NHWC",a=Bl(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,n);if(r.group!==1){let C=[t[0]];if(n){let A=e.kernelCustomData.wT??e.compute(He(t[1],Kr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=A),C.push(A)}else C.push(t[1]);t.length===3&&C.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&n&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Rf(C,r,a,i),{inputs:C}):e.compute(Of(C,r,a,i),{inputs:C});return}let s=t.length===3,u=t[0].dims[n?1:2],l=t[0].dims[n?2:3],d=t[0].dims[n?3:1],h=t[1].dims[2],p=t[1].dims[3],m=a[n?1:2],_=a[n?2:3],y=a[n?3:1],w=n&&h===u&&p===l&&r.pads[0]===0&&r.pads[1]===0;if(w||h===1&&p===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let C=a[0],A,$,N,V=[];if(n){let H=e.kernelCustomData.wT??e.compute(He(t[1],Kr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=H),w){let D=u*l*d;A=t[0].reshape([1,C,D]),$=H.reshape([1,D,y]),N=[1,C,y]}else A=t[0].reshape([C,u*l,d]),$=H.reshape([1,d,y]),N=[C,m*_,y];V.push(A),V.push($)}else A=t[0].reshape([C,d,u*l]),$=t[1].reshape([1,y,d]),N=[C,y,m*_],V.push($),V.push(A);s&&V.push(t[2]);let F=N[2],Y=V[0].dims[V[0].dims.length-1];F<8&&Y<8?e.compute(Qa(V,r,a,N,n,i),{inputs:V}):e.compute(hi(V,r,a,N,n,i),{inputs:V});return}let S=!0,v=e.kernelCustomData.wT??e.compute(He(t[1],Kr),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=v);let b=[t[0],v];s&&b.push(t[2]);let I=n?m*_:y,k=n?y:m*_,T=h*p*d;e.compute(Cf(b,r,a,I,k,T,s,S,i),{inputs:b})},Pl=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=Yr({...t,pads:n,strides:a,dilations:s,kernelShape:u},i);pn(e,i,l,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},Ul=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",n=Yr(r,t),a=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=Af(t[0].dims,t[1].dims,r.strides,r.dilations,a,!1,i);e.compute(zf(t,n,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},xa=(e,t)=>{if(Nl(e.inputs,t),e.inputs[0].dims.length===3)Pl(e,t);else if(e.inputs[0].dims.length===5)Ul(e,e.inputs,t);else{let r=Yr(t,e.inputs);pn(e,e.inputs,r)}}}),Mf,d_=Z(()=>{"use strict";oe(),gt(),le(),de(),Mf=(e,t,r)=>{let i=e.length>2,n=t.outputShape,a=t.format==="NHWC",s=t.group,u=e[1].dims,l=u[2]/s,d=u[3],h=a?Ce(l):1,p=a&&d===1&&l>=4,m=p?Math.floor(l/4)*4:Math.floor(l/h)*h,_=l-m,y=a?Ce(d):1,w=a?d===1?h:y:1,S=P.size(n)/y,v=[Math.ceil(S/64),1,1];be("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${v}`);let b=["rank","rank"],I=[t.strides[0],t.strides[1]],k=[t.kernelShape[a?1:2],t.kernelShape[a?2:3]],T=[t.dilations[0],t.dilations[1]],C=[k[0]+(t.dilations[0]<=1?0:(t.kernelShape[a?1:2]-1)*(t.dilations[0]-1)),k[1]+(t.dilations[1]<=1?0:(t.kernelShape[a?2:3]-1)*(t.dilations[1]-1))],A=[C[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),C[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],$=[{type:12,data:S},{type:12,data:I},{type:12,data:k},{type:12,data:T},{type:12,data:C},{type:6,data:A},{type:12,data:m},{type:12,data:l},{type:12,data:d},...se(e[0].dims,e[1].dims)];i&&($.push(...se(e[2].dims)),b.push("rank")),$.push(...se(n));let N=V=>{let F=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:I.length},{name:"filter_dims",type:"u32",length:k.length},{name:"dilations",type:"u32",length:k.length},{name:"effective_filter_dims",type:"u32",length:C.length},{name:"pads",type:"i32",length:A.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],Y=Me(e[0].dataType),H=a?1:2,D=a?2:3,K=a?3:1,z=G("W",e[1].dataType,e[1].dims.length,w),j=G("Dy",e[0].dataType,e[0].dims.length,h),X=[j,z];i&&X.push(G("bias",e[2].dataType,[n[K]].length,y));let O=re("result",e[0].dataType,n.length,y),B=()=>{let U="";if(p)h===4?U+=`
        let xValue = ${j.getByOffset("x_offset")};
        let wValue = ${z.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:h===2?U+=`
          dotProd = dotProd + dot(vec4<${Y}>(${j.getByOffset("x_offset")}, ${j.getByOffset("x_offset + 1u")}), vec4<${Y}>(${z.getByOffset("w_offset")}, ${z.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:h===1&&(U+=`
          dotProd = dotProd + dot(vec4<${Y}>(${j.getByOffset("x_offset")}, ${j.getByOffset("x_offset + 1u")}, ${j.getByOffset("x_offset + 2u")}, ${j.getByOffset("x_offset + 3u")}), vec4<${Y}>(${z.getByOffset("w_offset")}, ${z.getByOffset("w_offset + 1u")}, ${z.getByOffset("w_offset + 2u")}, ${z.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(U+=`
                  let xValue = ${a?j.getByOffset(`${j.indicesToOffset(`${j.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${h}`):j.get("batch","inputChannel","idyR","idyC")};
        `,h===1)U+=`
          let w_offset = ${z.indicesToOffset(`${z.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${z.getByOffset(`w_offset / ${w}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let W=0;W<h;W++)U+=`
            let wValue${W} = ${z.getByOffset(`${z.indicesToOffset(`${z.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${W}, wOutChannel)`)} / ${w}`)};
            dotProd = dotProd + xValue[${W}] * wValue${W};`;return U},R=()=>{if(_===0)return"";if(!p)throw new Error(`packInputAs4 ${p} is not true.`);let U="";if(h===1){U+="dotProd = dotProd";for(let W=0;W<_;W++)U+=`
            + ${j.getByOffset(`x_offset + ${W}`)} * ${z.getByOffset(`w_offset + ${W}`)}`;U+=";"}else if(h===2){if(_!==2)throw new Error(`Invalid inputChannelsRemainder ${_}.`);U+=`
          let xValue = ${j.getByOffset("x_offset")};
          let wValue = ${z.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return U},L=`
            let outputIndices = ${O.offsetToIndices(`global_idx * ${y}`)};
            let batch = ${O.indicesGet("outputIndices",0)};
            let d1 = ${O.indicesGet("outputIndices",K)};
            let r = ${O.indicesGet("outputIndices",H)};
            let c = ${O.indicesGet("outputIndices",D)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${O.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${Y}(dyRCorner) + ${Y}(wR)) / ${Y}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${Y}(uniforms.Dy_shape[${H}]) || fract(dyR) > 0.0 ||
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
                let dyC = (${Y}(dyCCorner) + ${Y}(wC)) / ${Y}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${Y}(uniforms.Dy_shape[${D}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${p?`
                var x_offset = ${j.indicesToOffset(`${j.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${h};
                var w_offset = ${z.indicesToOffset(`${z.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${w};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${p?4:h}) {
                  ${B()}
                  inputChannel = inputChannel + ${p?4:h};
                }
                ${R()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${y}]`:""};
            ${O.setByOffset("global_idx","value")};
          `;return`
    ${V.registerUniforms(F).declareVariables(...X,O)}
      ${V.mainStart()}
      ${V.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${L}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${h}${w}${y}${p}${_}`,inputDependencies:b},getRunData:()=>({dispatchGroup:{x:v[0],y:v[1],z:v[2]},outputs:[{dims:r?r(n):n,dataType:e[0].dataType}],programUniforms:$}),getShaderSource:N}}}),Ll,Wl,ql,hn,Df,Vl,fn,Gl,Bf,c_=Z(()=>{"use strict";d_(),jt(),Ct(),Ll=(e,t,r,i,n,a)=>(e-1)*t+r+(i-1)*n+1-a,Wl=(e,t,r,i,n)=>{let a=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=a,r[n]=e-a):t==="SAME_LOWER"&&(r[i]=e-a,r[n]=a)},ql=(e,t,r,i,n,a,s,u,l,d)=>{let h=e.length-2,p=d.length===0;l.length<h&&l.push(...Array(h-l.length).fill(0));let m=e[0],_=t[u?3:1]*n;for(let y=0,w=e.length-h-(u?1:0);y<h;++y,++w){let S=e[w],v=p?S*s[y]:d[y],b=Ll(S,s[y],a[y],t[w],r[y],v);Wl(b,i,a,y,y+h),p&&d.push(s[y]*(S-1)+l[y]+(t[w]-1)*r[y]+1-a[y]-a[y+h])}d.splice(0,0,m),d.splice(u?3:1,0,_)},hn=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((p,m)=>p*m,1)===0){r.length=0;for(let p=2;p<t[1].dims.length;++p)r.push(t[1].dims[p])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let n=e.pads.slice(),a=e.outputShape.slice(),s=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();if(l.reduce((p,m)=>p+m,0)===0){let p=t[0].dims.length-2;l=new Array(p).fill(1)}let d=e.strides.slice();if(d.reduce((p,m)=>p+m,0)===0){let p=t[0].dims.length-2;d=new Array(p).fill(1)}ql(u,r,l,e.autoPad,e.group,n,d,i,s,a);let h=Object.assign({},e);return Object.assign(h,{kernelShape:r,pads:n,outputPadding:s,outputShape:a,dilations:l,strides:d}),h},Df=e=>{let t=Za(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],n=e.dilations,a=e.group??1,s=e.kernelShape,u=e.pads,l=e.strides,d=e.wIsConst(),h=e.outputPadding,p=e.outputShape;return{autoPad:i,format:r,dilations:n,group:a,kernelShape:s,outputPadding:h,outputShape:p,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},Vl=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let n=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==n))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.reduce((s,u)=>s+u,0)>0&&t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.reduce((s,u)=>s+u,0)>0&&t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.reduce((s,u)=>s+u,0)>0&&t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.outputPadding.length!==a&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${a}D`);if(t.kernelShape.reduce((s,u)=>s+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},fn=(e,t,r,i)=>{let n=e.kernelCustomData.wT??e.compute(He(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=n);let a=[t[0],n];t.length===3&&a.push(t[2]),e.compute(Mf(a,r,i),{inputs:a})},Gl=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let n=t.kernelShape;(n.length===0||n[0]===0)&&(n=[e.inputs[1].dims[2]]);let a=t.dilations;(a.length===0||a[0]===0)&&(a=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],s=[1].concat(s),a=[1].concat(a),n=[1].concat(n);let l=t.outputPadding;l=[0].concat(l);let d=hn({...t,pads:u,strides:s,dilations:a,kernelShape:n,outputPadding:l},i);fn(e,i,d,h=>r?[h[0],h[2],h[3]]:[h[0],h[1],h[3]])},Bf=(e,t)=>{if(Vl(e.inputs,t),e.inputs[0].dims.length===3)Gl(e,t);else{let r=hn(t,e.inputs);fn(e,e.inputs,r)}}}),Fl,Nf,Pf,p_=Z(()=>{"use strict";oe(),le(),Ae(),de(),Fl=(e,t,r,i)=>{let n=P.size(t),a=t.length,s=G("input",e,a),u=re("output",e,a),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),d=P.normalizeAxis(l,a),h=p=>{let m=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,_=ne("uniforms.input_shape","uniforms.axis",a),y=i.reverse?m+(i.exclusive?" + 1":""):"0",w=i.reverse?_:m+(i.exclusive?"":" + 1");return`
                ${p.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,u)}
                ${p.mainStart()}
                  ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${y};
                  let last : i32 = ${w};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},{type:12,data:d},...se(t,t)]}),getShaderSource:h}},Nf=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,n=e.inputs[1];e.compute(Fl(i,r,n,t),{inputs:[0]})},Pf=e=>{let t=e.exclusive===1,r=e.reverse===1;return xe({exclusive:t,reverse:r})}}),Hl,jl,Kl,Uf,Lf,h_=Z(()=>{"use strict";oe(),le(),Ae(),de(),Hl=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},jl=(e,t,r,i)=>{let n=[];n.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let a=0;a<t;++a)n.push(r.indicesSet("a",e[a],`i[${a}]`));return n.push("return a;}"),n.join(`
`)},Kl=(e,t)=>{let r,i,n,a,s,u,l=t.format==="NHWC",d=t.blocksize,h=t.mode==="DCR";l?([r,i,n,a]=e.dims,s=h?[r,i,n,d,d,a/d**2]:[r,i,n,a/d**2,d,d],u=h?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,n,a]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=h?[r,d,d,a/d**2,i,n]:[r,a/d**2,d,d,i,n],u=h?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let p=e.reshape(s),m=p.dims.length,_=e.dataType,y=G("a",_,m),w=re("output",_,m),S=v=>`
  ${v.registerUniform("output_size","u32").declareVariables(y,w)}

  ${jl(u,m,y,w)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${w.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${w.setByOffset("global_idx",y.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:v=>{let b=l?[r,i*d,n*d,a/d**2]:[r,a/d**2,i*d,n*d],I=P.size(b),k=p.dims,T=P.sortBasedOnPerm(k,u);return{outputs:[{dims:b,dataType:v[0].dataType}],dispatchGroup:{x:Math.ceil(I/64)},programUniforms:[{type:12,data:I},...se(k,T)]}},getShaderSource:S}},Uf=(e,t)=>{Hl(e.inputs),e.compute(Kl(e.inputs[0],t))},Lf=e=>xe({blocksize:e.blocksize,mode:e.mode,format:e.format})}),ht,hr,Zr,mn,xt,Yl,Zl,Xl,gn,yn,_n,Ql,Jl,bn,ed,Wf,qf,f_=Z(()=>{"use strict";oe(),le(),Ae(),de(),ht=256,hr=512,Zr=2*Math.PI,mn=e=>{let t=[],r=e;for(let i of[4,2,3,5])for(;r%i===0;)t.push(i),r/=i;return r===1?t:void 0},xt=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},Yl=(e,t,r,i,n)=>{let a=r/e,s=hr-i,u=d=>`smem[${s}u + base + ${d*t}u]`,l=`  for (var t = local_idx; t < ${a}u; t += ${ht}u) {
`;l+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,l+=`    var leg: array<vec2<f32>, 5>;
`;for(let d=0;d<e;d++){let h=`${i}u + t + ${d*a}u`;if(d===0)l+=`    leg[0] = smem[${h}];
`;else{let p=n*Zr*d/(e*t);l+=`    { let a = ${xt(p)} * angleUnit; leg[${d}] = cmul(smem[${h}], vec2<f32>(cos(a), sin(a))); }
`}}if(l+=`    let base = (t / ${t}u) * ${t*e}u + twiddleIndex;
`,e===2)l+=`    ${u(0)} = leg[0] + leg[1];
    ${u(1)} = leg[0] - leg[1];
`;else if(e===4){let d=n<0?"vec2<f32>(oddDiff.y, -oddDiff.x)":"vec2<f32>(-oddDiff.y, oddDiff.x)";l+=`    let evenSum = leg[0] + leg[2]; let evenDiff = leg[0] - leg[2];
`,l+=`    let oddSum = leg[1] + leg[3]; let oddDiff = leg[1] - leg[3];
`,l+=`    let oddRot = ${d};
`,l+=`    ${u(0)} = evenSum + oddSum;
    ${u(1)} = evenDiff + oddRot;
`,l+=`    ${u(2)} = evenSum - oddSum;
    ${u(3)} = evenDiff - oddRot;
`}else for(let d=0;d<e;d++){let h=["leg[0]"];for(let p=1;p<e;p++){let m=n*Zr*(p*d)/e,_=xt(Math.cos(m)),y=xt(Math.sin(m));h.push(`vec2<f32>(leg[${p}].x*${_} - leg[${p}].y*${y}, leg[${p}].x*${y} + leg[${p}].y*${_})`)}l+=`    ${u(d)} = ${h.join(" + ")};
`}return`${l}  }
  workgroupBarrier();
`},Zl=(e,t,r)=>{let i="",n=1,a=0;for(let s of e)i+=Yl(s,n,t,a,r),n*=s,a=hr-a;return{code:i,resultOffset:a}},Xl=(e,t,r,i,n)=>{let a=e.dims,s=a.length,u=a[s-1],l=a[t],d=r&&i?(l-1)*2:l;n!==void 0&&(d=n);let h=r&&i?1:2,p=i&&!r?Math.floor(d/2)+1:d,m=a.slice();m[t]=p,m[s-1]=h;let _=1;for(let w=t+1;w<s-1;w++)_*=a[w];let y=P.size(a)/u/l;return{dataType:e.dataType,outputDims:m,length:d,signalLength:l,inner:_,batch:y,inputComponents:u,outputComponents:h,outputLength:p,inverse:r,onesided:i}},gn=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),yn=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],_n=(e,t,r)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,r),Ql=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:a,onesided:s}=e,u=Re(t),l=a?1:-1,d=a?1/r:1,h=mn(r),p=m=>{let _=G("x",t,[1]),y=re("y",t,[1]),w=T=>{let C=`inBase + (${T}) * uniforms.inner * ${i}u`,A=`f32(${_.getByOffset(C)})`,$=i===2?`f32(${_.getByOffset(`${C} + 1u`)})`:"0.0";return`vec2<f32>(${A}, ${$})`},S;if(a&&s){let T=Math.floor(r/2)+1,C=r%2===0?`select(provided, provided - 1u, provided == ${T}u)`:"provided";S=`
    let provided = min(uniforms.signalLength, ${T}u);
    for (var i = local_idx; i < ${r}u; i += ${ht}u) {
      if (i < provided) { smem[i] = ${w("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();
    for (var k = local_idx + 1u; k < ${C}; k += ${ht}u) {
      let h = smem[k];
      smem[${r}u - k] = vec2<f32>(h.x, -h.y);
    }
    workgroupBarrier();`}else S=`
    let loadCount = min(uniforms.signalLength, ${r}u);
    for (var i = local_idx; i < ${r}u; i += ${ht}u) {
      if (i < loadCount) { smem[i] = ${w("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();`;let{code:v,resultOffset:b}=Zl(h,r,l),I=d===1?`smem[${b}u + i]`:`smem[${b}u + i] * ${xt(d)}`,k=n===2?y.setByOffset("off + 1u",`${u}(v.y)`):"";return`
  ${_n(m,_,y)}
  var<workgroup> smem: array<vec2<f32>, ${2*hr}>;
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${m.mainStart(ht)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${n}u;
    ${S}
${v}    for (var i = local_idx; i < uniforms.outputLength; i += ${ht}u) {
      let v = ${I};
      let off = outBase + i * uniforms.inner * ${n}u;
      ${y.setByOffset("off",`${u}(v.x)`)}
      ${k}
    }
  }`};return{name:"DFT",shaderCache:{hint:gn(e,"fft"),inputDependencies:["type"]},getShaderSource:p,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:yn(e),dispatchGroup:{x:e.batch}})}},Jl=e=>{let{dataType:t,length:r,inputComponents:i,outputComponents:n,inverse:a,onesided:s}=e,u=Re(t),l=a?1:-1,d=a?1/r:1,h=p=>{let m=G("x",t,[1]),_=re("y",t,[1]),y=I=>{let k=`inBase + (${I}) * uniforms.inner * ${i}u`,T=`f32(${m.getByOffset(k)})`,C=i===2?`f32(${m.getByOffset(`${k} + 1u`)})`:"0.0";return`vec2<f32>(${T}, ${C})`},w=a&&s?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
    let provided = min(uniforms.signalLength, ${Math.floor(r/2)+1}u);
    if (k < provided) { return ${y("k")}; }
    let m = ${r}u - k;
    if (m < provided) {
      let h = ${y("m")};
      return vec2<f32>(h.x, -h.y);
    }
    return vec2<f32>(0.0, 0.0);
  }`:`fn spectrum(inBase: u32, n: u32) -> vec2<f32> {
    if (n < uniforms.signalLength) { return ${y("n")}; }
    return vec2<f32>(0.0, 0.0);
  }`,S=`
      let angle = ${xt(l*Zr)} * f32(knMod) / ${xt(r)};
      acc += cmul(spectrum(inBase, n), vec2<f32>(cos(angle), sin(angle)));
      knMod += k;
      if (knMod >= ${r}u) { knMod -= ${r}u; }`,v=n===2?_.setByOffset("off + 1u",`${u}(v.y)`):"",b=d===1?"acc":`acc * ${xt(d)}`;return`
  ${_n(p,m,_)}
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${w}
  ${p.mainStart(ht)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${i}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${n}u;
    for (var k = local_idx; k < uniforms.outputLength; k += ${ht}u) {
      var acc = vec2<f32>(0.0, 0.0);
      var knMod = 0u;
      for (var n = 0u; n < ${r}u; n++) {${S}
      }
      let v = ${b};
      let off = outBase + k * uniforms.inner * ${n}u;
      ${_.setByOffset("off",`${u}(v.x)`)}
      ${v}
    }
  }`};return{name:"DFT",shaderCache:{hint:gn(e,"direct"),inputDependencies:["type"]},getShaderSource:h,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:yn(e),dispatchGroup:{x:e.batch}})}},bn=e=>{if(!e||e.dataType===0)return;if(P.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},ed=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let r=t[t.length-1];if(r!==1&&r!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},Wf=(e,t)=>{ed(e.inputs);let r=e.inputs[0],i=r.dims.length,n=t.inverse!==0,a=t.onesided!==0,s=bn(e.inputs[1]);if(s!==void 0&&s<=0)throw new Error("dft_length must be greater than zero.");let u=P.normalizeAxis(bn(e.inputs[2])??t.axis,i);if(u===i-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(n&&a&&r.dims[i-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let l=Xl(r,u,n,a,s);if(l.length<=0)throw new Error(`Invalid DFT length: ${l.length}`);let d=l.length<=hr&&mn(l.length)!==void 0?Ql(l):Jl(l);e.compute(d,{inputs:[0]})},qf=e=>xe({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),Xr,fr,wn,td,rd,id,nd,$n,ad,Vf,Gf,m_=Z(()=>{"use strict";oe(),le(),Ae(),de(),Xr="[a-zA-Z]|\\.\\.\\.",fr="("+Xr+")+",wn="^"+fr+"$",td="("+fr+",)*"+fr,rd="^"+td+"$",id=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},nd=class{constructor(e,t){var n;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(rd)))throw new Error("Invalid LHS term");if(r.split(",").forEach((a,s)=>{let u=e[s].dims.slice();if(!a.match(RegExp(wn)))throw new Error("Invalid LHS term");let l=this.processTerm(a,!0,u,s);this.lhs.push(l)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([a,s])=>s.count===1||a==="...").map(([a])=>a).join("");else if(!i.match(RegExp(fr)))throw new Error("Invalid RHS");(n=i.match(RegExp(Xr,"g")))==null||n.forEach(a=>{if(a==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let s=this.symbolToInfo.get(a);if(s===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(s.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let n=r.length,a=!1,s=[],u=0;if(!e.match(RegExp(wn))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(Xr,"g")),d=new id(i);return l==null||l.forEach((h,p)=>{if(h==="..."){if(a)throw new Error("Only one ellipsis is allowed per input term");a=!0;let m=n-l.length+1;if(m<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(u,u+m),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let _=0;_<s.length;_++){let y=String.fromCharCode(48+_);d.addSymbol(y,p+_),this.addSymbol(y,r[u++],i)}}else d.addSymbol(h,p+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(h,r[u++],i)}),d}},$n=e=>e+"_max",ad=(e,t,r,i)=>{let n=e.map(d=>d.length).map((d,h)=>G(`input${h}`,t,d)),a=P.size(i),s=re("output",t,i.length),u=[...r.symbolToInfo.keys()].filter(d=>!r.rhs.symbolToIndices.has(d)),l=d=>{let h=[],p="var prod = 1.0;",m="var sum = 0.0;",_="sum += prod;",y=[],w=[],S=[],v=[],b=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((k,T)=>{var C;if(r.rhs.symbolToIndices.has(T)){let A=(C=r.rhs.symbolToIndices.get(T))==null?void 0:C[0];A!==void 0&&r.lhs.forEach(($,N)=>{if(k.inputIndices.includes(N)){let V=$.symbolToIndices.get(T);if(V===void 0)throw new Error("Invalid symbol error");V.forEach(F=>{h.push(`${n[N].indicesSet(`input${N}Indices`,F,s.indicesGet("outputIndices",A))}`)})}})}else r.lhs.forEach((A,$)=>{if(k.inputIndices.includes($)){let N=A.symbolToIndices.get(T);if(N===void 0)throw new Error("Invalid symbol error");N.forEach(V=>{y.push(`${n[$].indicesSet(`input${$}Indices`,V,`${T}`)}`)}),v.push(`prod *= ${n[$].getByIndices(`input${$}Indices`)};`)}}),w.push(`for(var ${T}: u32 = 0; ${T} < uniforms.${$n(T)}; ${T}++) {`),S.push("}")});let I=b?[...h,`let sum = ${n.map((k,T)=>k.getByIndices(`input${T}Indices`)).join(" * ")};`]:[...h,m,...w,...y,p,...v,_,...S];return`
            ${d.registerUniforms(u.map(k=>({name:`${$n(k)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...n,s)}

            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${n.map((k,T)=>`var input${T}Indices: ${n[T].type.indices};`).join(`
`)}
            ${I.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let d=u.filter(p=>r.symbolToInfo.has(p)).map(p=>{var m;return{type:12,data:((m=r.symbolToInfo.get(p))==null?void 0:m.dimValue)||0}});d.push({type:12,data:a});let h=e.map((p,m)=>[...se(p)]).reduce((p,m)=>p.concat(m),d);return h.push(...se(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:h}},getShaderSource:l}},Vf=(e,t)=>{let r=new nd(e.inputs,t.equation),i=r.outputDims,n=e.inputs.map((a,s)=>a.dims);e.compute(ad(n,e.inputs[0].dataType,r,i))},Gf=e=>{let t=e.equation.replace(/\s+/g,"");return xe({equation:t})}}),sd,vn,od,ud,Ff,g_=Z(()=>{"use strict";oe(),le(),de(),sd=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,n=t.length<r.length?0:t.length-r.length;for(;i<r.length&&n<t.length;++i,++n)if(r[i]!==t[n]&&r[i]!==1&&t[n]!==1)throw new Error("Expand requires shape to be broadcastable to input")},vn=(e,t)=>{let r=e.length-t.length,i=[];for(let n=0;n<r;++n)i.push(e[n]);for(let n=0;n<t.length;++n)i.push(t[n]===1?e[n+r]:t[n]);return i},od=(e,t)=>e.length>t.length?vn(e,t):vn(t,e),ud=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=od(t,r),n=e[0].dataType,a=n===9||P.size(t)===1,s=n===9||t.length>0&&t[t.length-1]%4===0?4:1,u=a||i.length>0&&i[i.length-1]%4===0?4:1,l=Math.ceil(P.size(i)/u),d=p=>{let m=G("input",n,t.length,s),_=re("output",n,i.length,u),y;if(n===9){let w=(S,v,b="")=>`
          let outputIndices${v} = ${_.offsetToIndices(`outputOffset + ${v}u`)};
          let offset${v} = ${m.broadcastedIndicesToOffset(`outputIndices${v}`,_)};
          let index${v} = offset${v} / 4u;
          let component${v} = offset${v} % 4u;
          ${S}[${v}] = ${b}(${m.getByOffset(`index${v}`)}[component${v}]);
        `;y=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${w("data",0,"u32")}
        ${w("data",1,"u32")}
        ${w("data",2,"u32")}
        ${w("data",3,"u32")}
        ${_.setByOffset("global_idx","data")}
      }`}else y=`
        let outputIndices = ${_.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${m.broadcastedIndicesToOffset("outputIndices",_)};
        let data = ${_.type.value}(${m.getByOffset(`inputOffset / ${s}`)});
        ${_.setByOffset("global_idx","data")}
      }`;return`
    ${p.registerUniform("vec_size","u32").declareVariables(m,_)}
    ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${y}`},h=[{type:12,data:l},...se(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${u}`,inputDependencies:["rank"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h})}},Ff=e=>{sd(e.inputs),e.compute(ud(e.inputs),{inputs:[0]})}}),ld,Hf,y_=Z(()=>{"use strict";oe(),le(),de(),Ya(),ld=e=>{let t=e[0].dataType,r=P.size(e[0].dims),i=P.size(e[1].dims),n=i%4===0,a=s=>{let u=G("x",t,[1],4),l=G("bias",t,[1],4),d=re("y",t,[1],4),h=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],p=_=>`
      let bias${_}_offset: u32 = (global_idx * 4 + ${_}) % uniforms.bias_size;
      let bias${_} = ${l.getByOffset(`bias${_}_offset / 4`)}[bias${_}_offset % 4];`,m=n?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${p(0)}${p(1)}${p(2)}${p(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(h).declareVariables(u,l,d)}

    ${_a(Re(t))}

    ${s.mainStart(rr)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${m}
      let x_in = x + bias;
      ${d.setByOffset("global_idx",ba("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${n}`,inputDependencies:["type","type"]},getShaderSource:a,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/rr/4)}})}},Hf=e=>{e.inputs.length<2||P.size(e.inputs[1].dims)===0?df(e):e.compute(ld(e.inputs))}}),dd,cd,jf,Kf,__=Z(()=>{"use strict";oe(),le(),Ae(),de(),dd=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},cd=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=P.normalizeAxis(t.axis,n),s=r.slice(0);s.splice(a,1,...i);let u=r[a],l=e[0].dataType===9?4:1,d=Math.ceil(P.size(s)/l),h=[{type:12,data:d},{type:6,data:u},{type:12,data:a},...se(e[0].dims,e[1].dims,s)],p=m=>{let _=G("data",e[0].dataType,e[0].dims.length,l),y=G("inputIndices",e[1].dataType,e[1].dims.length),w=re("output",e[0].dataType,s.length,l),S=b=>{let I=i.length,k=`var indicesIndices${b}  = ${y.type.indices}(0);`;for(let T=0;T<I;T++)k+=`${I>1?`indicesIndices${b}[${T}]`:`indicesIndices${b}`} = ${s.length>1?`outputIndices${b}[uniforms.axis + ${T}]`:`outputIndices${b}`};`;k+=`
          var idx${b} = ${y.getByIndices(`indicesIndices${b}`)};
          if (idx${b} < 0) {
            idx${b} = idx${b} + uniforms.axisDimLimit;
          }
          var dataIndices${b} : ${_.type.indices};
        `;for(let T=0,C=0;T<n;T++)T===a?(k+=`${n>1?`dataIndices${b}[${T}]`:`dataIndices${b}`} = u32(idx${b});`,C+=I):(k+=`${n>1?`dataIndices${b}[${T}]`:`dataIndices${b}`} = ${s.length>1?`outputIndices${b}[${C}]`:`outputIndices${b}`};`,C++);return k},v;if(e[0].dataType===9){let b=(I,k,T="")=>`
          let outputIndices${k} = ${w.offsetToIndices(`outputOffset + ${k}u`)};
          ${S(k)};
          let offset${k} = ${_.indicesToOffset(`dataIndices${k}`)};
          let index${k} = offset${k} / 4u;
          let component${k} = offset${k} % 4u;
          ${I}[${k}] = ${T}(${_.getByOffset(`index${k}`)}[component${k}]);
        `;v=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${b("value",0,"u32")}
        ${b("value",1,"u32")}
        ${b("value",2,"u32")}
        ${b("value",3,"u32")}
        ${w.setByOffset("global_idx","value")}
      `}else v=`
      let outputIndices = ${w.offsetToIndices("global_idx")};
      ${S("")};
      let value = ${_.getByIndices("dataIndices")};
      ${w.setByOffset("global_idx","value")};
      `;return`
      ${m.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,y,w)}
      ${m.mainStart()}
        ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${v}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:h}),getShaderSource:p}},jf=e=>xe({axis:e.axis}),Kf=(e,t)=>{let r=e.inputs;dd(r),e.compute(cd(e.inputs,t))}}),pd,Yf,Zf,b_=Z(()=>{"use strict";oe(),le(),de(),pd=(e,t,r,i,n,a,s,u,l)=>{let d=[{type:12,data:a},{type:12,data:i},{type:12,data:n},{type:12,data:r},{type:12,data:s},{type:12,data:u},{type:12,data:l}],h=[a];d.push(...se(t.dims,h));let p=m=>{let _=G("indices_data",t.dataType,t.dims.length),y=re("input_slice_offsets_data",12,1,1),w=[_,y],S=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:n.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${m.registerUniforms(S).declareVariables(...w)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
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
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${n.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:h,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:d}),getShaderSource:p},{inputs:[t],outputs:[-1]})[0]},Yf=(e,t)=>{let r=e.inputs,i=r[0].dims,n=r[0].dataType,a=r[1].dims,s=a[a.length-1],u=P.sizeToDimension(a,a.length-1),l=P.sizeFromDimension(i,t.batchDims+s),d=P.sizeToDimension(i,t.batchDims),h=P.sizeFromDimension(i,t.batchDims),p=u/d,m=new Array(s),_=l;for(let k=0;k<s;++k)m[s-1-k]=_,_*=i[t.batchDims+s-1-k];let y=pd(e,r[1],m,t.batchDims,i,u,p,h,s),w=t.batchDims+s;if(w>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let S=a.slice(0,-1).concat(i.slice(w)),v=P.size(S),b=[{type:12,data:v},{type:12,data:l},...se(r[0].dims,y.dims,S)],I=k=>{let T=G("data",r[0].dataType,r[0].dims.length),C=G("slice_offsets",12,y.dims.length),A=re("output",r[0].dataType,S.length);return`
          ${k.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(T,C,A)}
            ${k.mainStart()}
            ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:S,dataType:n}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:b}),getShaderSource:I},{inputs:[r[0],y]})},Zf=e=>({batchDims:e.batch_dims,cacheKey:""})}),hd,fd,Xf,Qf,w_=Z(()=>{"use strict";oe(),le(),Ae(),de(),hd=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=P.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,n=e[0],a=e[2],s=e.length===4?e[3]:void 0;if(a.dims.length!==n.dims.length||!n.dims.map((u,l)=>l===r?Math.ceil(u/i)===a.dims[l]:u===a.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==n.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==a.dims.length||!s.dims.map((u,l)=>u===a.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},fd=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r.length,a=P.normalizeAxis(t.gatherAxis,n),s=P.normalizeAxis(t.quantizeAxis,n),u=r.slice(0);u.splice(a,1,...i);let l=P.size(u),d=e[2].dataType,h=e[0].dataType===22,p=[{type:12,data:l},{type:12,data:s},{type:12,data:a},{type:12,data:t.blockSize},...se(...e.map((_,y)=>_.dims),u)],m=_=>{let y=G("data",e[0].dataType,e[0].dims.length),w=G("inputIndices",e[1].dataType,e[1].dims.length),S=G("scales",e[2].dataType,e[2].dims.length),v=e.length>3?G("zeroPoint",e[3].dataType,e[3].dims.length):void 0,b=re("output",d,u.length),I=[y,w,S];v&&I.push(v);let k=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${_.registerUniforms(k).declareVariables(...I,b)}
        ${_.mainStart()}
        let output_indices = ${b.offsetToIndices("global_idx")};
        var indices_indices = ${w.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${b.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${w.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${b.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${y.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${b.indicesGet("output_indices","i")};
          ${y.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${w.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[a]};
        }
        ${y.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${b.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${y.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${y.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${y.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${h?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${S.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${S.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${S.getByIndices("scale_indices")};
        ${v?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${v.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${v.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${h?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Re(d)}(quantized_data - zero_point) * scale;
        ${b.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((_,y)=>y!==1).map(_=>_.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(_,y)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:d}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:p}),getShaderSource:m}},Xf=(e,t)=>{let r=e.inputs;hd(r,t),e.compute(fd(e.inputs,t))},Qf=e=>xe({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),md,gd,Jf,em,$_=Z(()=>{"use strict";oe(),le(),Ae(),de(),md=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},gd=(e,t)=>{let r=e[0].dims,i=e[0].dataType,n=r.length,a=e[1].dims,s=e[1].dataType,u=P.normalizeAxis(t.axis,n),l=r[u],d=a.slice(0),h=P.size(d),p=G("input",i,n),m=G("indicesInput",s,a.length),_=re("output",i,d.length),y=[{type:12,data:h},{type:6,data:l},{type:12,data:u}];return y.push(...se(r,a,d)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:y}),getShaderSource:w=>`
      ${w.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(p,m,_)}
      ${w.mainStart()}
      ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${_.offsetToIndices("global_idx")};

      var idx = ${m.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${p.type.indices}(outputIndices);
      ${p.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${p.getByIndices("inputIndices")};

      ${_.setByOffset("global_idx","value")};
  }`}},Jf=e=>xe({axis:e.axis}),em=(e,t)=>{let r=e.inputs;md(r),e.compute(gd(e.inputs,t))}}),yd,_d,tm,rm,v_=Z(()=>{"use strict";oe(),le(),de(),yd=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},_d=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[n,a,s]=Yp.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),u=[n,a];if(!u)throw new Error("Can't use gemm on the given tensors");let l=16,d=Math.ceil(a/l),h=Math.ceil(n/l),p=!0,m=P.size(u),_=[{type:12,data:p?d:m},{type:12,data:n},{type:12,data:a},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],y=["type","type"];e.length===3&&(_.push(...se(e[2].dims)),y.push("rank")),_.push(...se(u));let w=v=>{let b="";t.transA&&t.transB?b="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?b="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?b="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(b="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let I=t.alpha===1?"":"value *= uniforms.alpha;",k=G("a",e[0].dataType,e[0].dims),T=G("b",e[1].dataType,e[1].dims),C=k.type.value,A=null,$=[k,T];e.length===3&&(A=G("c",e[2].dataType,e[2].dims.length),$.push(A));let N=re("output",e[0].dataType,u.length);$.push(N);let V=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${v.registerUniforms(V).declareVariables(...$)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${C}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${b}
    }

    ${I}
    ${A!=null?`let cOffset = ${A.broadcastedIndicesToOffset("vec2(m, n)",N)}; value += ${C}(uniforms.beta) * ${A.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},S=v=>{let b=G("a",e[0].dataType,e[0].dims),I=G("b",e[1].dataType,e[1].dims),k=null,T=[b,I];e.length===3&&(k=G("c",e[2].dataType,e[2].dims.length),T.push(k));let C=re("output",e[0].dataType,u.length);T.push(C);let A=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],$="",N="";t.transA&&t.transB?(N=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,$="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(N=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,$="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(N=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,$="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(N=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${b.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,$="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let V=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${v.registerUniforms(A).declareVariables(...T)}
  var<workgroup> tile_a: array<array<${b.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${I.type.storage}, ${l}>, ${l}>;
  ${v.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${C.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${N}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${$}
      }
      workgroupBarrier();
    }

    ${V}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${k!=null?`let cOffset = ${k.broadcastedIndicesToOffset("vec2(m, n)",C)}; value += ${C.type.value}(uniforms.beta) * ${k.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return p?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:d*h},programUniforms:_}),getShaderSource:S}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:_}),getShaderSource:w}},tm=e=>{let t=e.transA,r=e.transB,i=e.alpha,n=e.beta;return{transA:t,transB:r,alpha:i,beta:n,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},rm=(e,t)=>{yd(e.inputs),e.compute(_d(e.inputs,t))}}),ut,ft,Rt,Mt,bd,wd,$d,vd,xd,Sd,kd,Td,im,nm,x_=Z(()=>{"use strict";oe(),le(),Ae(),de(),[ut,ft,Rt,Mt]=[0,1,2,3],bd=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},wd=`
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
`,$d=e=>`
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
`,vd=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,xd=e=>`
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
`,Sd=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${ut}] = batch;
     indices[${ft}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${Rt}] = u32(r);
            indices[${Mt}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${Rt}] = u32(clamp(r, 0, H - 1));
          indices[${Mt}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${Rt}] = gs_reflect(r, border[1], border[3]);
          indices[${Mt}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,kd=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${ut}], indices[${ft}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${ut}], indices[${ft}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${ut}], indices[${ft}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${ut}], indices[${ft}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${ut}], indices[${ft}], border);

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
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${ut}], indices[${ft}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Td=(e,t)=>{let r=G("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],n=G("grid",e[1].dataType,i.length,2),a=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(a=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[ut,ft,Rt,Mt]=[0,3,1,2]);let s=re("output",e[0].dataType,a.length),u=r.type.value,l=P.size(a),d=[{type:12,data:l},...se(e[0].dims,i,a)],h=p=>`
  ${p.registerUniform("output_size","u32").declareVariables(r,n,s)}
  ${wd}
  ${$d(u)}
  ${vd(t)}
  ${xd(t)}
  ${Sd(r,u,t)}

  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${Rt}]);
      let W_in = i32(uniforms.x_shape[${Mt}]);

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

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${ut}], indices[${Rt}], indices[${Mt}]);
      let nxy = ${n.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${kd(s,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:p=>{let m=P.size(a);return{outputs:[{dims:a,dataType:p[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:d}},getShaderSource:h}},im=(e,t)=>{bd(e.inputs),e.compute(Td(e.inputs,t))},nm=e=>xe({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Pe,Id,am,xn,Ed,xr,sm,om=Z(()=>{"use strict";oe(),le(),Ae(),Fa(),Ka(),de(),Ct(),Pe=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Id=(e,t)=>{let r=e[0],i=Pe(e,1),n=Pe(e,2),a=Pe(e,3),s=Pe(e,4),u=Pe(e,5),l=Pe(e,6),d=Pe(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let h=r.dims[0],p=r.dims[1],m=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],_=p,y=0,w=0,S=Math.floor(m/t.numHeads);if(l&&d&&P.size(l.dims)&&P.size(d.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==h||l.dims[1]!==t.numHeads||l.dims[3]!==S)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[0]!==h||d.dims[1]!==t.numHeads||d.dims[3]!==S)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==d.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');y=l.dims[2],w=l.dims[2]}else if(l&&P.size(l.dims)||d&&P.size(d.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let v;if(i&&P.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');v=2,_=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==S)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');v=5,_=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==S)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');v=0,_=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');v=3}if(a&&P.size(a.dims)>0){if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let b=y+_,I=0;if(s&&P.size(s.dims)>0){I=8;let A=s.dims;throw A.length===1?A[0]===h?I=1:A[0]===3*h+2&&(I=3):A.length===2&&A[0]===h&&A[1]===b&&(I=5),I===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let k=!1,T=m;if(n&&P.size(n.dims)>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(_!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=n.dims[2]}else{if(_!==n.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');T=n.dims[1]*n.dims[3],k=!0}}let C=!1;if(s&&P.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(u&&P.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==h||u.dims[1]!==t.numHeads||u.dims[2]!==p||u.dims[3]!==b)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:h,sequenceLength:p,pastSequenceLength:y,kvSequenceLength:_,totalSequenceLength:b,maxSequenceLength:w,inputHiddenSize:0,hiddenSize:m,vHiddenSize:T,headSize:S,vHeadSize:Math.floor(T/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:I,scale:t.scale,broadcastResPosBias:C,passPastInKv:k,qkvFormat:v}},am=e=>xe({...e}),xn=xe({perm:[0,2,1,3]}),Ed=(e,t,r,i,n,a,s)=>{let u=[i,n,a],l=P.size(u),d=[{type:12,data:l},{type:12,data:s},{type:12,data:a}],h=p=>{let m=re("qkv_with_bias",t.dataType,u),_=G("qkv",t.dataType,u),y=G("bias",r.dataType,u),w=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${p.registerUniforms(w).declareVariables(_,y,m)}
  ${p.mainStart()}
    ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:h},{inputs:[t,r],outputs:[-1]})[0]},xr=(e,t,r,i,n,a,s,u)=>{let l=a;if(s&&P.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=Ed(e,a,s,t,i,r*n,u),l=l.reshape([t,i,r,n]),r===1||i===1?l:e.compute(He(l,xn.perm),{inputs:[l],outputs:[-1]})[0]}else return a.dims.length===3&&(l=a.reshape([t,i,r,n])),r===1||i===1?l:e.compute(He(l,xn.perm),{inputs:[l],outputs:[-1]})[0]},sm=(e,t)=>{let r=Id(e.inputs,t),i=e.inputs[0],n=Pe(e.inputs,1),a=Pe(e.inputs,2),s=Pe(e.inputs,3),u=Pe(e.inputs,4),l=Pe(e.inputs,5),d=Pe(e.inputs,6),h=Pe(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if((n==null?void 0:n.dims.length)===5)throw new Error("Packed KV is not implemented");let p=n&&a&&n.dims.length===4&&a.dims.length===4,m=xr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(p)return Ir(e,m,n,a,u,void 0,d,h,l,r);if(!n||!a)throw new Error("key and value must be provided");let _=xr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,n,s,r.hiddenSize),y=xr(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,a,s,2*r.hiddenSize);Ir(e,m,_,y,u,void 0,d,h,l,r)}}),Cd,Ad,zd,Od,Sa,um,lm,dm=Z(()=>{"use strict";oe(),le(),Ae(),de(),Cd=e=>{if(!e||e.length<1)throw new Error("too few inputs")},Ad=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(n=>r.push(Number(n))),i=r.length),xe({numOutputs:i,axis:t.axis,splitSizes:r})},zd=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${ne("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,Od=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let n=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(n):i===0?r.push(`if (output_number == ${i}u) { ${n} }`):i===t-1?r.push(`else { ${n} }`):r.push(`else if (output_number == ${i}) { ${n} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},Sa=(e,t)=>{let r=e[0].dims,i=P.size(r),n=e[0].dataType,a=P.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),u=G("input",n,r.length),l=new Array(t.numOutputs),d=[],h=[],p=0,m=[{type:12,data:i}];for(let y=0;y<t.numOutputs;y++){p+=t.splitSizes[y],l[y]=p;let w=r.slice();w[a]=t.splitSizes[y],h.push(w),s[y]=re(`output${y}`,n,w.length),d.push({dims:h[y],dataType:e[0].dataType})}m.push({type:12,data:l},...se(r,...h));let _=y=>`
  ${y.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...s)}
  ${zd(l.length)}
  ${Od(s)}

  ${y.mainStart()}
    ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",a)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${ne("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",a,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:_,getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:m})}},um=(e,t)=>{Cd(e.inputs);let r=e.inputs.length===1?t:Ad(e.inputs,t);e.compute(Sa(e.inputs,r),{inputs:[0]})},lm=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes length must be equal");return xe({axis:t,numOutputs:i,splitSizes:r})}}),Rd,fi,cm,pm=Z(()=>{"use strict";oe(),le(),Ae(),de(),Rd=(e,t)=>{let[r,i,n,a]=e,{numHeads:s,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!P.areEqual(i.dims,[])&&!P.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(!P.areEqual(n.dims,a.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],d=r.dims[r.dims.length-2],h=n.dims[0],p=P.sizeFromDimension(r.dims,1)/d,m=u===0?n.dims[1]*2:p/s;if(u>m)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(l!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(d!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(d>h)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(m/2!==n.dims[1]&&u/2!==n.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${n.dims[1]}`)},fi=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:n,scale:a}=t,s=e[0].dims[0],u=P.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],d=u/l,h=e[2].dims[1],p=n===0?h*2:d/i,m=new Array(s,l,d/p,p-h),_=P.computeStrides(m),y=[{type:1,data:a},{type:12,data:m},{type:12,data:_},...e[0].dims.length===3?new Array({type:12,data:[u,d,p,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,p,l*p,1]}):[],...se(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],w=S=>{let v=G("input",e[0].dataType,e[0].dims.length),b=G("position_ids",e[1].dataType,e[1].dims.length),I=G("cos_cache",e[2].dataType,e[2].dims.length),k=G("sin_cache",e[3].dataType,e[3].dims.length),T=re("output",e[0].dataType,e[0].dims.length);return S.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:m.length},{name:"global_strides",type:"u32",length:_.length},{name:"input_output_strides",type:"u32",length:_.length}]),`
        ${S.declareVariables(v,b,I,k,T)}

        ${S.mainStart(rr)}
          let half_rotary_emb_dim = uniforms.${I.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${S.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${b.broadcastedIndicesToOffset("bsnh.xy",re("",b.type.tensor,2))};
            let position_id =
                u32(${b.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${v.getByOffset("i")} * ${I.get("position_id","bsnh[3]")} -
                ${v.getByOffset("j")} * ${k.get("position_id","bsnh[3]")};
            ${T.setByOffset("i","re")}
            let im = ${v.getByOffset("i")} * ${k.get("position_id","bsnh[3]")} +
                ${v.getByOffset("j")} * ${I.get("position_id","bsnh[3]")};
            ${T.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${T.setByOffset("k",v.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:xe({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(P.size(m)/rr)},programUniforms:y})}},cm=(e,t)=>{Rd(e.inputs,t),e.compute(fi(e.inputs,t))}}),Md,Dd,Sn,Bd,hm,S_=Z(()=>{"use strict";Ae(),oe(),Ka(),om(),dm(),Ct(),pm(),de(),Md=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],n=e[2],a=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=r.dims[0],d=r.dims[1],h=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],p=d,m=0,_=!i||i.dims.length===0,y=Math.floor(_?h/(t.numHeads+2*t.kvNumHeads):h/t.numHeads);_&&(h=y*t.numHeads);let w=a&&a.dims.length!==0,S=s&&s.dims.length!==0;if(w&&a.dims.length===4&&a.dims[0]===l&&a.dims[1]!==t.kvNumHeads&&a.dims[2]===t.kvNumHeads&&a.dims[3]===y)throw new Error("BSNH pastKey/pastValue is not supported");if(w&&S){if(a.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');m=a.dims[2]}else if(w||S)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let v=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');p=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==y)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(n)throw new Error('Expect "value" be none when "key" has packed kv format.');p=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==y)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');p=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');v=3}let b=0,I=!1,k=t.kvNumHeads?y*t.kvNumHeads:h;if(n&&n.dims.length>0){if(n.dims.length!==3&&n.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==n.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(n.dims.length===3){if(p!==n.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');k=n.dims[2]}else{if(p!==n.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');k=n.dims[1]*n.dims[3],I=!0}}let T=e.length>4?e[5]:void 0;if(T){if(T.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let C=T.dims.reduce((A,$)=>A*$,1);if(C!==l)throw new Error(`seqlens_k must have batch_size (${l}) elements, got ${C}.`);for(let A=0;A<T.dims.length;A++)if(T.dims[A]!==1&&T.dims[A]!==l)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${l}), got dims[${A}] = ${T.dims[A]}.`)}return{batchSize:l,sequenceLength:d,pastSequenceLength:m,kvSequenceLength:p,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:h,vHiddenSize:k,headSize:y,vHeadSize:Math.floor(k/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:b,scale:t.scale,broadcastResPosBias:!1,passPastInKv:I,qkvFormat:v}},Dd=xe({perm:[0,2,1,3]}),Sn=(e,t,r)=>{let i=t,n=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,n,r.headSize]),i=e.compute(He(i,Dd.perm),{inputs:[i],outputs:[-1]})[0]),i},Bd=(e,t,r,i)=>{let n=7,a=["type","type"],s=[e*t],u=e*t,l=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],d=h=>{let p=G("seq_lens",r.dataType,r.dims),m=G("total_seq_lens",i.dataType,i.dims),_=re("pos_ids",n,s),y=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${h.registerUniforms(y).declareVariables(p,m,_)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${m.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${p.getByOffset("batch_idx")};
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
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:a},getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:d}},hm=(e,t)=>{var k;if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let r=Md(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((k=e.inputs[1])==null?void 0:k.dims.length)===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],n=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,a=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,d=e.inputs.length>5?e.inputs[6]:void 0,h=r.kvNumHeads?r.kvNumHeads:r.numHeads,p=xe({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,h*r.headSize,h*r.headSize]}),[m,_,y]=!n&&!a?e.compute(Sa([i],p),{inputs:[i],outputs:[-1,-1,-1]}):[i,n,a],w,S;if(t.doRotary){let T=e.compute(Bd(r.batchSize,r.sequenceLength,l,d),{inputs:[l,d],outputs:[-1]})[0],C=e.inputs[7],A=e.inputs[8],$=xe({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),N=[m,T,C,A],V=[-1];w=e.compute(fi(N,$),{inputs:N,outputs:V})[0],N.splice(0,1,_);let F=xe({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});S=e.compute(fi(N,F),{inputs:N,outputs:V})[0]}let v=xr(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?w:m,void 0,0),b=Sn(e,t.doRotary?S:_,r),I=Sn(e,y,r);Ir(e,v,b,I,void 0,void 0,s,u,void 0,r,l,d)}}),kn,Nd,Pd,fm,k_=Z(()=>{"use strict";oe(),le(),Ct(),de(),kn=(e,t,r,i,n,a,s,u)=>{let l=Ce(a),d=l===1?"f32":`vec${l}f`,h=l===1?"vec2f":`mat2x${l}f`,p=n*s,m=64;p===1&&(m=256);let _=[n,s,a/l],y=[n,s,2],w=["rank","type","type"],S=[];S.push(...se(_,y));let v=b=>{let I=G("x",t.dataType,3,l),k=G("scale",r.dataType,r.dims),T=G("bias",i.dataType,i.dims),C=re("output",1,3,2),A=[I,k,T,C];return`
  var<workgroup> workgroup_shared : array<${h}, ${m}>;
  const workgroup_size = ${m}u;
  ${b.declareVariables(...A)}
  ${b.mainStart(m)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${I.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${h}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Et("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${Et("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${m}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:y,dataType:1}],dispatchGroup:{x:p},programUniforms:S}),getShaderSource:v},{inputs:[t,r,i],outputs:[-1]})[0]},Nd=(e,t,r)=>{let i=t[0].dims,n=i,a=2,s=i[0],u=i[1],l=P.sizeFromDimension(i,a),d=Ce(l),h=P.size(n)/d,p=kn(e,t[0],t[1],t[2],s,l,u,r.epsilon),m=[s,u,l/d],_=[s,u],y=["type","none"],w=S=>{let v=G("x",t[0].dataType,m.length,d),b=G("scale_shift",1,_.length,2),I=re("output",t[0].dataType,m.length,d),k=[v,b,I];return`
  ${S.registerUniform("output_size","u32").declareVariables(...k)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${I.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${b.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${v.getByOffset("global_idx")} * ${I.type.value}(scale_shift.x) + ${I.type.value}(scale_shift.y);
      ${I.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},...se(m,_,m)]}),getShaderSource:w},{inputs:[t[0],p]})},Pd=(e,t,r)=>{let i=t[0].dims,n=i,a=i[0],s=i[i.length-1],u=P.sizeFromDimension(i,1)/s,l=Ce(s),d=P.size(n)/l,h=[{type:12,data:u},{type:12,data:Math.floor(s/l)}],p=["type","type"],m=!1,_=[0,i.length-1];for(let v=0;v<i.length-2;v++)m=m||i[v+1]!==1,_.push(v+1);m=m&&i[i.length-1]!==1;let y=m?e.compute(He(e.inputs[0],_),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},(v,b)=>i[_[b]])),w=kn(e,y,t[1],t[2],a,u,s,r.epsilon),S=v=>{let b=Me(t[0].dataType),I=l===1?"vec2f":`mat${l}x2f`,k=A=>{let $=A===0?"x":"y",N=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${b}(${N}(scale.${$}))`;case 2:return`vec2<${b}>(${N}(scale[0].${$}, scale[1].${$}))`;case 4:return`vec4<${b}>(${N}(scale[0].${$}, scale[1].${$}, scale[2].${$}, scale[3].${$}))`;default:throw new Error(`Not supported compoents ${l}`)}},T=G("input",t[0].dataType,t[0].dims,l),C=re("output",t[0].dataType,n,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${T.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${I}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${C.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${v.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${k(0)}, ${k(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:p},getRunData:()=>({outputs:[{dims:n,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:h}),getShaderSource:S},{inputs:[t[0],w]})},fm=(e,t)=>{t.format==="NHWC"?Pd(e,e.inputs,t):Nd(e,e.inputs,t)}}),Ud,Ld,mm,T_=Z(()=>{"use strict";oe(),le(),de(),Ud=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Ld=(e,t,r)=>{let i=t.simplified,n=e[0].dims,a=e[1],s=!i&&e[2],u=n,l=P.normalizeAxis(t.axis,n.length),d=P.sizeToDimension(n,l),h=P.sizeFromDimension(n,l),p=P.size(a.dims),m=s?P.size(s.dims):0;if(p!==h||s&&m!==h)throw new Error(`Size of X.shape()[axis:] == ${h}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${p} and bias size of ${m}`);let _=[];for(let T=0;T<n.length;++T)T<l?_.push(n[T]):_.push(1);let y=Ce(h),w=["type","type"],S=[{type:12,data:d},{type:1,data:h},{type:12,data:Math.floor(h/y)},{type:1,data:t.epsilon}];s&&w.push("type");let v=r>1,b=r>2,I=T=>{let C=Me(e[0].dataType),A=[G("x",e[0].dataType,e[0].dims,y),G("scale",a.dataType,a.dims,y)];s&&A.push(G("bias",s.dataType,s.dims,y)),A.push(re("output",e[0].dataType,u,y)),v&&A.push(re("mean_data_output",1,_)),b&&A.push(re("inv_std_output",1,_));let $=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${T.registerUniforms($).declareVariables(...A)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${ma("f32",y)};
    var mean_square_vector = ${ma("f32",y)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Jt(C,y,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Et("mean_vector",y)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Et("mean_square_vector",y)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Jt(C,y,"x[j + offset]")};
      let f32scale = ${Jt(C,y,"scale[j]")};
      output[j + offset] = ${A[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Jt(C,y,"bias[j]")}`:""}
      );
    }

    ${v?"mean_data_output[global_idx] = mean":""};
    ${b?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},k=[{dims:u,dataType:e[0].dataType}];return v&&k.push({dims:_,dataType:1}),b&&k.push({dims:_,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${y};${r};${i}`,inputDependencies:w},getRunData:()=>({outputs:k,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:S}),getShaderSource:I}},mm=(e,t)=>{Ud(e.inputs),e.compute(Ld(e.inputs,t,e.outputCount))}}),Wd,gm,I_=Z(()=>{"use strict";le(),Ja(),es(),Wd=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},gm=e=>{Wd(e.inputs);let t=tr.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(Qa(e.inputs,{activation:""},t));else{let n=t[t.length-2],a=P.size(e.inputs[0].dims.slice(0,-2)),s=P.size(e.inputs[1].dims.slice(0,-2));if(a!==1&&n===1&&s===1){let u=e.inputs[0].reshape([1,a,i]),l=e.inputs[1].reshape([1,i,r]),d=[1,a,r],h=[u,l];e.compute(hi(h,{activation:""},t,d),{inputs:h})}else e.compute(hi(e.inputs,{activation:""},t))}}}),qd,Vd,Gd,ym,_m,E_=Z(()=>{"use strict";oe(),le(),Ae(),de(),qd=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let n=Math.floor((t.k+t.blockSize-1)/t.blockSize),a=t.blockSize/8*t.bits,s=e[1];if(!P.areEqual(s.dims,[t.n,n,a]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(P.size(u)!==t.n*n)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,d=t.n*(t.bits===8?n:Math.floor((n*t.bits+7)/8));if(P.size(l)!==d)throw new Error("zeroPoints input size error.")}},Vd=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,u=r.slice(0,i-2),l=P.size(u),d=e[1].dims[2]/4,h=e[0].dataType,p=Ce(t.k),m=Ce(d),_=Ce(s),y=u.concat([n,s]),w=n>1&&s/_%2===0?2:1,S=P.size(y)/_/w,v=64,b=[],I=[l,n,a/p],k=P.convertShape(e[1].dims).slice();k.splice(-1,1,d/m),b.push(...se(I)),b.push(...se(k)),b.push(...se(e[2].dims)),e.length===4&&b.push(...se(P.convertShape(e[3].dims)));let T=[l,n,s/_];b.push(...se(T));let C=A=>{let $=I.length,N=G("a",e[0].dataType,$,p),V=G("b",12,k.length,m),F=G("scales",e[2].dataType,e[2].dims.length),Y=[N,V,F],H=e.length===4?G("zero_points",12,e[3].dims.length):void 0;H&&Y.push(H);let D=T.length,K=re("output",e[0].dataType,D,_),z=Me(e[0].dataType),j=(()=>{switch(p){case 1:return`array<${z}, 8>`;case 2:return`mat4x2<${z}>`;case 4:return`mat2x4<${z}>`;default:throw new Error(`${p}-component is not supported.`)}})(),X=Math.floor(32/t.bits),O=Math.floor(X/8),B=()=>{let U="";for(let W=0;W<O;W++){let Q=W*t.bits*4,me=Q+t.bits;U+=`
          // reuse a data (pass ${W})
            var input_offset${W>0?W:""} = ${W===0?N.indicesToOffset(`${N.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${W>0?W:""}: ${j};
            for (var j${W>0?W:""}: u32 = 0; j${W>0?W:""} < ${8/p}; j${W>0?W:""}++) {
              a_data${W>0?W:""}[j${W>0?W:""}] = ${N.getByOffset(`input_offset${W>0?W:""}`)};
              input_offset${W>0?W:""}++;
            }
          `;for(let he=0;he<_*w;he++)U+=`
            b_value = ${m===1?`b${he}_data`:`b${he}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${W*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${Q}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${me}u) & b_mask);`}
            b_quantized_values = ${j}(${Array.from({length:4},(ue,ee)=>`${z}(b_value_lower[${ee}]), ${z}(b_value_upper[${ee}])`).join(", ")});
            b_dequantized_values = ${p===1?`${j}(${Array.from({length:8},(ue,ee)=>`(b_quantized_values[${ee}] - ${H?`zero_point${he}`:"zero_point"}) * scale${he}`).join(", ")});`:`(b_quantized_values - ${j}(${Array(8).fill(`${H?`zero_point${he}`:"zero_point"}`).join(",")})) * scale${he};`};
            workgroup_shared[local_id.x * ${w} + ${Math.floor(he/_)}]${_>1?`[${he%_}]`:""} += ${Array.from({length:8/p},(ue,ee)=>`${p===1?`a_data${W>0?W:""}[${ee}] * b_dequantized_values[${ee}]`:`dot(a_data${W>0?W:""}[${ee}], b_dequantized_values[${ee}])`}`).join(" + ")};
          `}return U},R=()=>{let U=`
            var col_index = col * ${_};
            ${H?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${z}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let W=0;W<_*w;W++)U+=`
            let scale${W} = ${F.getByOffset("col_index * nBlocksPerCol + block")};
            ${H?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${H.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${W} = ${z}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return U},L=()=>{let U=`col_index = col * ${_};`;for(let W=0;W<_*w;W++)U+=`
            let b${W}_data = ${V.getByIndices(`${V.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return U+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${j};
            var b_dequantized_values: ${j};`,U};return`
        var<workgroup> workgroup_shared: array<${K.type.value}, ${w*v}>;
        ${A.declareVariables(...Y,K)}
        ${A.mainStart([v,1,1])}
          let output_indices = ${K.offsetToIndices(`(global_idx / ${v}) * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${v}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/p};
            ${R()}
            for (var word: u32 = 0; word < ${d}; word += ${m}) {
              ${L()}
              for (var i: u32 = 0; i < ${m}; i++) {
                ${B()}
                word_offset += ${X/p};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${w}) {
            var output_value: ${K.type.value} = ${K.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${v}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${w};
            }
            ${K.setByIndices(`${K.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${p};${m};${_};${w};${v}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:y,dataType:h}],dispatchGroup:{x:S},programUniforms:b}),getShaderSource:C}},Gd=(e,t)=>{let r=e[0].dims,i=r.length,n=r[i-2],a=t.k,s=t.n,u=r.slice(0,i-2),l=P.size(u),d=e[1].dims[2]/4,h=e[0].dataType,p=Ce(t.k),m=Ce(d),_=u.concat([n,s]),y=128,w=s%8===0?8:s%4===0?4:1,S=y/w,v=Math.floor(32/t.bits),b=S*m*v,I=b/p,k=b/t.blockSize,T=P.size(_)/w,C=[],A=[l,n,a/p],$=P.convertShape(e[1].dims).slice();$.splice(-1,1,d/m),C.push(...se(A)),C.push(...se($)),C.push(...se(e[2].dims)),e.length===4&&C.push(...se(P.convertShape(e[3].dims)));let N=[l,n,s];C.push(...se(N));let V=F=>{let Y=A.length,H=G("a",e[0].dataType,Y,p),D=G("b",12,$.length,m),K=G("scales",e[2].dataType,e[2].dims.length),z=[H,D,K],j=e.length===4?G("zero_points",12,e[3].dims.length):void 0;j&&z.push(j);let X=N.length,O=re("output",e[0].dataType,X),B=Me(e[0].dataType),R=()=>{switch(p){case 1:return`
          let a_data0 = vec4<${B}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${B}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${B}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${B}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${p}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${H.type.value}, ${I}>;
        var<workgroup> inter_results: array<array<${O.type.value}, ${S}>, ${w}>;
        ${F.declareVariables(...z,O)}
        ${F.mainStart([S,w,1])}
          let output_indices = ${O.offsetToIndices(`workgroup_index * ${w}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${k} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${I};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${I}; a_offset += ${y})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${H.getByIndices(`${H.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${H.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${k} + local_id.x;
            ${j?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${j.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${B}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${B}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${K.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${D.getByIndices(`${D.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/p};
            for (var i: u32 = 0; i < ${m}; i++) {
              let b_value = ${m===1?"b_data":"b_data[i]"};
              ${(()=>{let L=Math.floor(v/8),U="";for(let W=0;W<L;W++){let Q=W*t.bits*4,me=Q+t.bits;U+=`
              ${R()}
              {${t.bits===2?`
                let half_word = b_value >> ${W*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${Q}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${me}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${B}>(${Array.from({length:4},(he,ue)=>`${B}(b_value_lower[${ue}]), ${B}(b_value_upper[${ue}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${B}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(he,ue)=>`${`dot(a_data${ue}, b_dequantized_values[${ue}])`}`).join(" + ")};
              }
              word_offset += ${8/p};`}return U})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${w}) {
            var output_value: ${O.type.value} = ${O.type.value}(0);
            for (var b = 0u; b < ${S}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${O.setByIndices(`${O.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${p};${m};${S};${w}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:h}],dispatchGroup:{x:T},programUniforms:C}),getShaderSource:V}},ym=(e,t)=>{qd(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Gd(e.inputs,t)):e.compute(Vd(e.inputs,t))},_m=e=>xe(e)}),Fd,Hd,jd,Kd,Yd,Zd,Xd,Qd,bm,C_=Z(()=>{"use strict";oe(),le(),de(),Fd=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Hd=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
            k = i32(${e.indicesGet("indices",n)}) - ${ne("uniforms.pads",n,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${ne("uniforms.x_shape",n,t)})) {
              break;
            }
            offset += k * i32(${ne("uniforms.x_strides",n,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},jd=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${ne("uniforms.pads",n,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${ne("uniforms.x_shape",n,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${ne("uniforms.x_shape",n,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${ne("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Kd=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${ne("uniforms.pads",n,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${ne("uniforms.x_shape",n,t)})) {
                  k = i32(${ne("uniforms.x_shape",n,t)}) - 1;
                }
                offset += k * i32(${ne("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Yd=(e,t,r)=>{let i="";for(let n=t-1;n>=0;--n)i+=`
                k = i32(${e.indicesGet("indices",n)}) - ${ne("uniforms.pads",n,r)};
                if (k < 0)  {
                  k += i32(${ne("uniforms.x_shape",n,t)}]);
                }
                if (k >= i32(${ne("uniforms.x_shape",n,t)})) {
                  k -= i32(${ne("uniforms.x_shape",n,t)});
                }
                offset += k * i32(${ne("uniforms.x_strides",n,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Zd=(e,t,r)=>{switch(r.mode){case 0:return Hd(e,t,r.pads.length);case 1:return jd(e,t,r.pads.length);case 2:return Kd(e,t,r.pads.length);case 3:return Yd(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Xd=(e,t)=>{let r=P.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,n=P.size(r),a=[{type:12,data:n},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&a.push({type:s?e[2].dataType:1,data:t.value}),a.push(...se(e[0].dims,r));let u=["rank"],l=d=>{let h=re("output",e[0].dataType,r.length),p=G("x",e[0].dataType,i.length),m=p.type.value,_=Zd(h,i.length,t),y=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&y.push({name:"constant_value",type:s?m:"f32"}),`
            ${d.registerUniforms(y).declareVariables(p,h)}
            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${h.offsetToIndices("global_idx")};

            var value = ${m}(0);
            ${_}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(P.size(r)/64)},programUniforms:a}),getShaderSource:l}},Qd=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,n=e[0].dims.length,a=new Int32Array(2*n).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let l=0;l<u.length;l++)a[Number(u[l])]=Number(r[l]),a[Number(u[l])+n]=Number(r[l+u.length])}else r.forEach((u,l)=>a[Number(l)]=Number(u));let s=[];return a.forEach(u=>s.push(u)),{mode:t.mode,value:i,pads:s}}else return t},bm=(e,t)=>{Fd(e.inputs);let r=Qd(e.inputs,t);e.compute(Xd(e.inputs,r),{inputs:[0]})}}),mr,Tn,In,En,Cn,Jd,ec,An,zn,wm,$m,On,vm,xm,Rn,Sm,km,Tm,Im,A_=Z(()=>{"use strict";Ze(),oe(),le(),de(),mr=e=>{if(ve.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Tn=(e,t,r)=>{let i=t.format==="NHWC",n=e.dims.slice();i&&n.splice(1,0,n.pop());let a=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),l=a?t.dilations.slice():[],d=t.pads.slice();ci.adjustPoolAttributes(r,n,s,u,l,d);let h=ci.computePoolOutputShape(r,n,u,l,s,d,t.autoPad,t.ceilMode),p=Object.assign({},t);a?Object.assign(p,{kernelShape:s,strides:u,pads:d,dilations:l,cacheKey:t.cacheKey}):Object.assign(p,{kernelShape:s,strides:u,pads:d,cacheKey:t.cacheKey});let m=h.slice();return m.push(m.splice(1,1)[0]),[p,i?m:h]},In=(e,t)=>{let r=t.format==="NHWC",i=P.size(e),n=P.size(t.kernelShape),a=[{type:12,data:i},{type:12,data:n}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],d=t.pads[t.pads.length/2-1],h=t.pads[t.pads.length-1],p=!!(d+h);a.push({type:12,data:u},{type:12,data:l},{type:12,data:d},{type:12,data:h}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let m=!1;if(t.kernelShape.length===2){let _=t.kernelShape[t.kernelShape.length-2],y=t.strides[t.strides.length-2],w=t.pads[t.pads.length/2-2],S=t.pads[t.pads.length-2];m=!!(w+S),a.push({type:12,data:_},{type:12,data:y},{type:12,data:w},{type:12,data:S}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[a,s,!0,p,m]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=P.computeStrides(t.kernelShape);a.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((d,h)=>d+h);return[a,s,!!l,!1,!1]}},En=(e,t,r,i,n,a,s,u,l,d,h,p)=>{let m=n.format==="NHWC",_=t.type.value,y=re("output",t.type.tensor,i);if(n.kernelShape.length<=2){let w="",S="",v="",b=r-(m?2:1);if(h?w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${b}] < 0 || xIndices[${b}]
                      >= uniforms.x_shape[${b}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`:w=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${b}] = indices[${b}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${a}
                }`,n.kernelShape.length===2){let I=r-(m?3:2);p?S=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${I}] < 0 || xIndices[${I}] >= uniforms.x_shape[${I}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:S=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                `,v=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,y)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${y.offsetToIndices("global_idx")};
              var xIndices = ${y.offsetToIndices("global_idx")};

              var value = ${_}(${u});
              var pad = 0;
              ${S}
              ${w}
              ${v}
              ${s}

              output[global_idx] = value;
            }`}else{if(m)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let w=n.kernelShape.length,S=n.pads.length,v="";return d?v=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${a}
              }`:v=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${a}
            `,`
            ${e.registerUniforms(l).declareVariables(t,y)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${y.offsetToIndices("global_idx")};
              var xIndices = ${y.offsetToIndices("global_idx")};

              var offsets: array<u32, ${w}>;

              var value = ${_}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${w-1}u; j++) {
                  offsets[j] = offset / ${ne("uniforms.kernelStrides","j",w)};
                  offset -= offsets[j] * ${ne("uniforms.kernelStrides","j",w)};
                }
                offsets[${w-1}] = offset;

                isPad = false;
                for (var j = ${r-w}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${ne("uniforms.strides",`j - ${r-w}u`,w)}
                    + offsets[j - ${r-w}u] - ${ne("uniforms.pads","j - 2u",S)};
                  ${v}
              }
              ${s}

              output[global_idx] = value;
            }`}},Cn=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Jd=e=>`${Cn(e)};${e.countIncludePad}`,ec=e=>`${Cn(e)};${e.storageOrder};${e.dilations}`,An=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),zn=(e,t,r,i)=>{let[n,a]=Tn(t,i,r),s=G("x",t.dataType,t.dims.length),u=s.type.value,l="value += x_val;",d="";n.countIncludePad?d+=`value /= ${u}(uniforms.kernelSize);`:d+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[h,p,m,_,y]=In(a,n);h.push(...se(t.dims,a));let w=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${m};${_};${y}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(P.size(a)/64)},programUniforms:h}),getShaderSource:S=>En(S,s,t.dims.length,a.length,n,l,d,0,p,m,_,y)}},wm=e=>{let t=e.count_include_pad!==0,r=An(e);if(r.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:Jd(i)}},$m=(e,t)=>{mr(e.inputs),e.compute(zn("AveragePool",e.inputs[0],!1,t))},On={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},vm=e=>{let t=e.format;return{format:t,...On,cacheKey:t}},xm=(e,t)=>{mr(e.inputs),e.compute(zn("GlobalAveragePool",e.inputs[0],!0,t))},Rn=(e,t,r,i)=>{let[n,a]=Tn(t,i,r),s=`
      value = max(x_val, value);
    `,u="",l=G("x",t.dataType,t.dims.length),d=["rank"],[h,p,m,_,y]=In(a,n);return h.push(...se(t.dims,a)),{name:e,shaderCache:{hint:`${i.cacheKey};${m};${_};${y}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:a,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(P.size(a)/64)},programUniforms:h}),getShaderSource:w=>En(w,l,t.dims.length,a.length,n,s,u,t.dataType===10?-65504:-1e5,p,m,_,y)}},Sm=(e,t)=>{mr(e.inputs),e.compute(Rn("MaxPool",e.inputs[0],!1,t))},km=e=>{let t=e.storage_order,r=e.dilations,i=An(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let n={storageOrder:t,dilations:r,...i,cacheKey:""};return{...n,cacheKey:ec(n)}},Tm=e=>{let t=e.format;return{format:t,...On,cacheKey:t}},Im=(e,t)=>{mr(e.inputs),e.compute(Rn("GlobalMaxPool",e.inputs[0],!0,t))}}),tc,rc,Em,Cm,z_=Z(()=>{"use strict";oe(),le(),Ae(),de(),tc=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((n,a)=>a===t.axis||n===e[0].dims[a]).reduce((n,a)=>n&&a,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},rc=(e,t)=>{let r=P.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,n=i===3,a=e[0].dims,s=e[1].dataType,u=P.size(a),l=i===3||i===2,d=l?[Math.ceil(P.size(e[0].dims)/4)]:e[0].dims,h=e[1].dims,p=e.length>2?e[2]:void 0,m=p?l?[Math.ceil(P.size(p.dims)/4)]:p.dims:void 0,_=h.length===0||h.length===1&&h[0]===1,y=_===!1&&h.length===1,w=Ce(u),S=_&&(!l||w===4),v=S?w:1,b=S&&!l?w:1,I=G("input",l?12:i,d.length,b),k=G("scale",s,h.length),T=p?G("zero_point",l?12:i,m.length):void 0,C=re("output",s,a.length,v),A=[I,k];T&&A.push(T);let $=[d,h];p&&$.push(m);let N=[{type:12,data:u/v},{type:12,data:r},{type:12,data:t.blockSize},...se(...$,a)],V=F=>{let Y=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${F.registerUniforms(Y).declareVariables(...A,C)}
      ${F.mainStart()}
          ${F.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${C.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${I.getByOffset("global_idx / 4")};
            let x_vec = ${n?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${v===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${I.getByOffset("global_idx")};`};

          // Set scale input
          ${_?`let scale_value= ${k.getByOffset("0")}`:y?`
            let scale_index = ${C.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${k.getByOffset("scale_index")};`:`
            var scale_indices: ${k.type.indices} = output_indices;
            let index = ${k.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${k.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${k.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${T?_?l?`
                let zero_point_input = ${T.getByOffset("0")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${T.getByOffset("0")}`:y?l?`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${T.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${C.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${T.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${k.indicesToOffset("scale_indices")};
                let zero_point_input = ${T.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${n?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${T.getByIndices("scale_indices")};`:`let zero_point_value = ${l?n?"i32":"u32":I.type.value}(0);`};
      // Compute and write output
      ${C.setByOffset("global_idx",`${C.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:T?["rank","rank","rank"]:["rank","rank"]},getShaderSource:V,getRunData:()=>({outputs:[{dims:a,dataType:s}],dispatchGroup:{x:Math.ceil(u/v/64),y:1,z:1},programUniforms:N})}},Em=(e,t)=>{tc(e.inputs,t),e.compute(rc(e.inputs,t))},Cm=e=>xe({axis:e.axis,blockSize:e.blockSize})}),ic,nc,Am,O_=Z(()=>{"use strict";Ze(),oe(),de(),ic=(e,t,r)=>{let i=e===t,n=e<t&&r<0,a=e>t&&r>0;if(i||n||a)throw new Error("Range these inputs' contents are invalid.")},nc=(e,t,r,i)=>{let n=Math.abs(Math.ceil((t-e)/r)),a=[n],s=n,u=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...se(a)],l=d=>{let h=re("output",i,a.length),p=h.type.value,m=[{name:"outputSize",type:"u32"},{name:"start",type:p},{name:"delta",type:p}];return`
        ${d.registerUniforms(m).declareVariables(h)}
        ${d.mainStart()}
        ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${p}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:a,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},Am=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),ve.webgpu.validateInputContent&&ic(t,r,i),e.compute(nc(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),ac,sc,zm,Om,R_=Z(()=>{"use strict";oe(),le(),Ae(),de(),ac=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let n=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,a=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${n}bitcast<${i}>(oldValue) + (${r})${a}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${n}max(bitcast<f32>(oldValue), (${r}))${a}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${n}min(bitcast<${i}>(oldValue), (${r}))${a}`;case"mul":return`${n}(bitcast<${i}>(oldValue) * (${r}))${a}`;default:throw new Error(`Reduction ${e} is not supported.`)}},sc=(e,t)=>{let r=e[0].dims,i=e[1].dims,n=r,a=1,s=Math.ceil(P.sizeToDimension(i,i.length-1)/a),u=i[i.length-1],l=P.sizeFromDimension(r,u),d=[{type:12,data:s},{type:12,data:u},{type:12,data:l},...se(e[1].dims,e[2].dims,n)],h=p=>{let m=G("indices",e[1].dataType,e[1].dims.length),_=G("updates",e[2].dataType,e[2].dims.length,a),y=t.reduction!=="none"&&t.reduction!==""?rh("output",e[0].dataType,n.length):re("output",e[0].dataType,n.length,a);return`
      ${p.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(m,_,y)}
      ${p.mainStart()}
        ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
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
    ${ac(t.reduction,"output[data_offset + i]","value",y.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:d}),getShaderSource:h}},zm=e=>xe({reduction:e.reduction}),Om=(e,t)=>{e.compute(sc(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),oc,uc,lc,Mn,dc,cc,pc,hc,fc,mc,gc,yc,Dn,_c,bc,wc,$c,vc,Rm,Mm,M_=Z(()=>{"use strict";oe(),le(),Ae(),de(),oc=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},uc=(e,t,r)=>{t.every(n=>n>=0&&n<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((n,a)=>i[n]=e[a]),i},lc=(e,t,r,i,n,a)=>{let[s,u,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],d=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(h=>a.push(h));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(h=>i.push(h)),i.length!==0&&i.length!==d&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");oc(i,t),t.axes.length>0&&uc(i,t.axes,d).forEach((h,p)=>i[p]=h)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(h=>n.push(Number(h))),n.length!==0&&n.length!==d&&r>=18&&n.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(n.length!==0&&n.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof n<"u"&&i.length>0&&n.length>d)throw new Error("Resize requires only of scales or sizes to be specified")},Mn=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,dc=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Mn("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Mn("xResized","lengthOriginal - 1","lengthResized - 1",t)}
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
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",cc=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",pc=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),n=e.length===0?i:e.slice();return t.length>0?(t.forEach((a,s)=>{i[a]=n[s],i[s+r]=n[t.length+s]}),i):n},hc=(e,t,r,i)=>{let n=[];if(r.length>0)if(i.length>0){if(e.forEach(a=>n.push(a)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((a,s)=>n[a]=r[s])}else r.forEach(a=>n.push(a));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");n=e.map((a,s)=>Math.round(a*t[s]))}return n},fc=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(a=>t[a]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(a=>t[a]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let n=e.slice();return r.axes.length>0?(r.axes.forEach(a=>t[a]=i),r.axes.forEach(a=>n[a]=Math.round(e[a]*t[a]))):(t.fill(i,0,t.length),n.forEach((a,s)=>n[s]=Math.round(a*t[s]))),n},mc=(e,t,r,i,n)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${ne("uniforms.scales","i",i)};
        var roi_low = ${ne("uniforms.roi","i",n)};
        var roi_hi = ${ne("uniforms.roi",`i + ${t.length}`,n)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${ne("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${ne("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,gc=(e,t,r,i,n,a,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${ne("uniforms.scales","i",n)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${ne("uniforms.roi","i",a)};
          var roi_hi = ${ne("uniforms.roi",`i + ${r.length}`,a)};
          var input_shape_i = ${ne("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${ne("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
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
    }`,yc=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${ne("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,Dn=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",_c=(e,t,r,i,n)=>{let[a,s,u,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${Dn(e,l,a,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${s}];
      var col:${d} = originalIndices[${u}];
      ${i?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${n};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${a}])`:"0"};
      var x11: ${d} = getInputValue(batch, channel, row1, col1);
      var x12: ${d} = getInputValue(batch, channel, row1, col2);
      var x21: ${d} = getInputValue(batch, channel, row2, col1);
      var x22: ${d} = getInputValue(batch, channel, row2, col2);
      var dx1: ${d} = abs(row - ${d}(row1));
      var dx2: ${d} = abs(${d}(row2) - row);
      var dy1: ${d} = abs(col - ${d}(col1));
      var dy2: ${d} = abs(${d}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},bc=(e,t,r,i,n,a,s,u,l,d)=>{let h=r.length===2,p=!0,[m,_]=h?[0,1]:p?[2,3]:[1,2],y=e.type.value,w=S=>{let v=S===m?"row":"col";return`
      fn ${v}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${y} {
        var output_index = ${t.indicesGet("output_indices",S)};
        var originalIdx: ${y} = getOriginalCoordinateFromResizedCoordinate(output_index, ${n[S]},
        ${i[S]}, ${r[S]}, ${a[S]}, ${a[S]} + ${r.length});
        var fractOriginalIdx: ${y} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[S]} - 1))) {
          return ${l};
        }
        var data: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${v}: ${y} = originalIdx + ${y}(i);
          if (${v} < 0 || ${v} >= ${r[S]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${v} = max(0, min(${v}, ${r[S]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",S,`u32(${v})`)};
          data[i + 1] = ${S===m?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${w(m)};
    ${w(_)};
  fn getCubicInterpolationCoefs(s: ${y}) -> array<${y}, 4> {
    var absS = abs(s);
    var coeffs: array<${y}, 4> = array<${y}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${y} = 1.0 - absS;
    var twoMinusAbsS: ${y} = 2.0 - absS;
    var onePlusAbsS: ${y} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${y}, 4>, coefs: array<${y}, 4>) -> ${y} {
    var coefsSum: ${y} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${y} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},wc=(e,t,r,i,n)=>{let[a,s,u,l,d]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],h=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${h} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${Dn(e,d,a,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${h} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${h} = originalIndices[${s}];
      var height:${h} = originalIndices[${u}];
      var width:${h} = originalIndices[${l}];
      ${i?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${n};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${a}])`:"0"};

      var x111: ${h} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${h} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${h} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${h} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${h} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${h} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${h} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${h} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${h} = abs(depth - ${h}(depth1));
      var dx2: ${h} = abs(${h}(depth2) - depth);
      var dy1: ${h} = abs(height - ${h}(height1));
      var dy2: ${h} = abs(${h}(height2) - height);
      var dz1: ${h} = abs(width - ${h}(width1));
      var dz2: ${h} = abs(${h}(width2) - width);
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
    }`},$c=(e,t,r,i,n,a)=>{let s=e.dims,u=pc(a,t.axes,s.length),l=hc(s,i,n,t.axes),d=i.slice();i.length===0&&(d=s.map((b,I)=>b===0?1:l[I]/b),t.keepAspectRatioPolicy!=="stretch"&&(l=fc(s,d,t)));let h=re("output",e.dataType,l.length),p=G("input",e.dataType,s.length),m=P.size(l),_=s.length===l.length&&s.every((b,I)=>b===l[I]),y=t.coordinateTransformMode==="tf_crop_and_resize",w=t.extrapolationValue,S=p.type.value,v=b=>`
      ${_?"":`
      ${dc(t.coordinateTransformMode,S)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${yc(p,s)};
              ${cc(t.nearestMode,r,S)};
              ${gc(p,h,s,l,d.length,u.length,y)};
              `;case"linear":return`
              ${mc(h,s,l,d.length,u.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${_c(p,h,s,y,w)}`;if(s.length===3||s.length===5)return`${wc(p,h,s,y,w)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${bc(p,h,s,l,d,u,t.cubicCoeffA,y,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${b.registerUniform("output_size","u32").registerUniform("scales","f32",d.length).registerUniform("roi","f32",u.length).declareVariables(p,h)}
      ${b.mainStart()}
        ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${_?"output[global_idx] = input[global_idx];":`
        let output_indices = ${h.offsetToIndices("global_idx")};
        var input_indices: ${p.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${p.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${d.length>0?t.mode==="cubic"?d:d.length:""}|${n.length>0?n:""}|${u.length>0?u:""}|${_}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:v,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},{type:1,data:d},{type:1,data:u},...se(s,l)]})}},vc=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},Rm=(e,t)=>{let r=[],i=[],n=[],a=vc(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");lc(e.inputs,t,a,r,i,n),e.compute($c(e.inputs[0],t,a,r,i,n),{inputs:[0]})},Mm=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,n=e.cubicCoeffA,a=e.excludeOutside!==0,s=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,d=e.nearestMode===""?"simple":e.nearestMode;return xe({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:n,excludeOutside:a,extrapolationValue:s,keepAspectRatioPolicy:u,mode:l,nearestMode:d})}}),xc,Sc,Dm,D_=Z(()=>{"use strict";oe(),le(),de(),xc=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let n=t.dims[t.dims.length-1],a=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==n)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==a)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==n)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==n)throw new Error("Bias must have the same hidden size as input")}},Sc=(e,t,r,i)=>{let n=t.simplified,a=e[0].dims,s=P.size(a),u=a,l=s,d=a.slice(-1)[0],h=i?a.slice(0,-1).concat(1):[],p=!n&&e.length>3,m=e.length>4,_=i&&r>1,y=i&&r>2,w=r>3,S=64,v=Ce(d),b=[{type:12,data:l},{type:12,data:v},{type:12,data:d},{type:1,data:t.epsilon}],I=T=>{let C=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],A=[G("x",e[0].dataType,e[0].dims,v),G("skip",e[1].dataType,e[1].dims,v),G("gamma",e[2].dataType,e[2].dims,v)];p&&A.push(G("beta",e[3].dataType,e[3].dims,v)),m&&A.push(G("bias",e[4].dataType,e[4].dims,v)),A.push(re("output",e[0].dataType,u,v)),_&&A.push(re("mean_output",1,h)),y&&A.push(re("inv_std_output",1,h)),w&&A.push(re("input_skip_bias_sum",e[0].dataType,u,v));let $=Me(e[0].dataType),N=Me(1,v);return`

      ${T.registerUniforms(C).declareVariables(...A)}
      var<workgroup> sum_shared : array<${N}, ${S}>;
      var<workgroup> sum_squared_shared : array<${N}, ${S}>;

      ${T.mainStart([S,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${S};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${S};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${S-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${m?"bias[offset1d + i]":$+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${w?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Jt($,v,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${S};
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
        let mean = ${Et("sum",v)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Et("square_sum",v)} / f32(uniforms.hidden_size) ${n?"":"- mean * mean"} + uniforms.epsilon);
        ${_?"mean_output[global_idx] = mean;":""}
        ${y?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${n?"":`- ${$}(mean)`}) *
            ${$}(inv_std_dev) * gamma[offset1d + i]
            ${p?"+ beta[offset1d + i]":""};
        }
      }`},k=[{dims:u,dataType:e[0].dataType}];return r>1&&k.push({dims:h,dataType:1}),r>2&&k.push({dims:h,dataType:1}),r>3&&k.push({dims:a,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${v};${_};${y};${w}`,inputDependencies:e.map((T,C)=>"type")},getShaderSource:I,getRunData:()=>({outputs:k,dispatchGroup:{x:Math.ceil(l/d)},programUniforms:b})}},Dm=(e,t)=>{xc(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(Sc(e.inputs,t,e.outputCount,!1),{outputs:r})}}),kc,gr,Tc,Bn,Ic,Ec,Bm,Nm,B_=Z(()=>{"use strict";oe(),le(),Ae(),de(),kc=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},gr=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},Tc=(e,t)=>{if(e.length>1){let r=gr(e,1),i=gr(e,2),n=gr(e,3);return n.length===0&&(n=[...Array(e[0].dims.length).keys()]),xe({starts:r,ends:i,axes:n})}else return t},Bn=(e,t,r,i,n)=>{let a=e;return e<0&&(a+=r[i[t]]),n[t]<0?Math.max(0,Math.min(a,r[i[t]]-1)):Math.max(0,Math.min(a,r[i[t]]))},Ic=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length-1}; i >= 0; i--) {
            let input_shape_i = ${ne("uniforms.input_shape","i",r.length)};
            let steps_i = ${ne("uniforms.steps","i",r.length)};
            let signs_i = ${ne("uniforms.signs","i",r.length)};
            let starts_i = ${ne("uniforms.starts","i",r.length)};
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
      }`,Ec=(e,t)=>{let r=e[0].dims,i=P.size(r),n=t.axes.length>0?P.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],a=gr(e,4);a.forEach(v=>v!==0||(()=>{throw new Error("step cannot be 0")})),a.length===0&&(a=Array(n.length).fill(1));let s=t.starts.map((v,b)=>Bn(v,b,r,n,a)),u=t.ends.map((v,b)=>Bn(v,b,r,n,a));if(n.length!==s.length||n.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(n.length!==r.length)for(let v=0;v<r.length;++v)n.includes(v)||(s.splice(v,0,0),u.splice(v,0,r[v]),a.splice(v,0,1));let l=a.map(v=>Math.sign(v));a.forEach((v,b,I)=>{if(v<0){let k=(u[b]-s[b])/v,T=s[b],C=T+k*a[b];s[b]=C,u[b]=T,I[b]=-v}});let d=r.slice(0);n.forEach((v,b)=>{d[v]=Math.ceil((u[v]-s[v])/a[v])});let h={dims:d,dataType:e[0].dataType},p=re("output",e[0].dataType,d.length),m=G("input",e[0].dataType,e[0].dims.length),_=P.size(d),y=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:a.length}],w=[{type:12,data:_},{type:12,data:s},{type:6,data:l},{type:12,data:a},...se(e[0].dims,d)],S=v=>`
      ${v.registerUniforms(y).declareVariables(m,p)}
        ${Ic(m,p,r)}
        ${v.mainStart()}
          ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${p.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${p.setByOffset("global_idx",m.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${a.length}`,inputDependencies:["rank"]},getShaderSource:S,getRunData:()=>({outputs:[h],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:w})}},Bm=(e,t)=>{kc(e.inputs,t);let r=Tc(e.inputs,t);e.compute(Ec(e.inputs,r),{inputs:[0]})},Nm=e=>{let t=e.starts,r=e.ends,i=e.axes;return xe({starts:t,ends:r,axes:i})}}),Cc,Ac,Pm,Um,N_=Z(()=>{"use strict";oe(),le(),Ae(),Ct(),de(),Cc=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Ac=(e,t)=>{let r=e.inputs[0],i=r.dims,n=P.size(i),a=i.length,s=P.normalizeAxis(t.axis,a),u=s<i.length-1,l,d=[];u?(d=Array.from({length:a},(A,$)=>$),d[s]=a-1,d[a-1]=s,l=e.compute(He(r,d),{inputs:[r],outputs:[-1]})[0]):l=r;let h=l.dims,p=h[a-1],m=n/p,_=Ce(p),y=p/_,w=64;m===1&&(w=256);let S=(A,$)=>$===4?`max(max(${A}.x, ${A}.y), max(${A}.z, ${A}.w))`:$===2?`max(${A}.x, ${A}.y)`:$===3?`max(max(${A}.x, ${A}.y), ${A}.z)`:A,v=G("x",l.dataType,l.dims,_),b=re("result",l.dataType,l.dims,_),I=v.type.value,k=Me(l.dataType)==="f32"?`var threadMax = ${I}(-3.4028234663852886e+38f);`:`var threadMax = ${I}(-65504.0h);`,T=A=>`
      var<workgroup> rowMaxShared : ${I};
      var<workgroup> rowSumShared : ${I};
      var<workgroup> threadShared : array<${I}, ${w}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${I} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${I}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${A.registerUniform("packedCols","i32").declareVariables(v,b)}
      ${A.mainStart(w)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${w};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${k}
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
          rowMaxShared = ${I}(${S("threadShared[0]",_)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${I}(0.0);
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
          rowSumShared = ${I}(${Et("threadShared[0]",_)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${I}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,C=e.compute({name:"Softmax",shaderCache:{hint:`${_};${w}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:h,dataType:l.dataType}],dispatchGroup:{x:m},programUniforms:[{type:6,data:y}]}),getShaderSource:T},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(He(C,d),{inputs:[C]})},Pm=(e,t)=>{Cc(e.inputs),Ac(e,t)},Um=e=>xe({axis:e.axis})}),Nn,zc,Oc,Rc,Lm,P_=Z(()=>{"use strict";oe(),le(),de(),Nn=e=>Array.from(e.getBigInt64Array(),Number),zc=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Nn(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Oc=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},Rc=(e,t)=>{let r=e[0].dims,i=t??Nn(e[1]),n=Oc(r,i),a=P.size(n),s=e[0].dataType,u=G("input",s,r.length),l=re("output",s,n.length),d=h=>`
      const inputShape = ${u.indices(...r)};
      ${h.registerUniform("output_size","u32").declareVariables(u,l)}
      ${h.mainStart()}
      ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},...se(e[0].dims,n)]}),getShaderSource:d}},Lm=e=>{zc(e.inputs),e.compute(Rc(e.inputs),{inputs:[0]})}}),Mc,Dc,Wm,U_=Z(()=>{"use strict";oe(),le(),de(),Mc=(e,t,r,i,n)=>{let a=re("output_data",n,r.length,4),s=G("a_data",t[1].dataType,t[1].dims.length,4),u=G("b_data",t[2].dataType,t[2].dims.length,4),l=G("c_data",t[0].dataType,t[0].dims.length,4),d,h=(p,m,_)=>`select(${m}, ${p}, ${_})`;if(!i)d=a.setByOffset("global_idx",h(s.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let p=(m,_,y="")=>{let w=`a_data[index_a${_}][component_a${_}]`,S=`b_data[index_b${_}][component_b${_}]`,v=`bool(c_data[index_c${_}] & (0xffu << (component_c${_} * 8)))`;return`
            let output_indices${_} = ${a.offsetToIndices(`global_idx * 4u + ${_}u`)};
            let offset_a${_} = ${s.broadcastedIndicesToOffset(`output_indices${_}`,a)};
            let offset_b${_} = ${u.broadcastedIndicesToOffset(`output_indices${_}`,a)};
            let offset_c${_} = ${l.broadcastedIndicesToOffset(`output_indices${_}`,a)};
            let index_a${_} = offset_a${_} / 4u;
            let index_b${_} = offset_b${_} / 4u;
            let index_c${_} = offset_c${_} / 4u;
            let component_a${_} = offset_a${_} % 4u;
            let component_b${_} = offset_b${_} % 4u;
            let component_c${_} = offset_c${_} % 4u;
            ${m}[${_}] = ${y}(${h(w,S,v)});
          `};n===9?d=`
            var data = vec4<u32>(0);
            ${p("data",0,"u32")}
            ${p("data",1,"u32")}
            ${p("data",2,"u32")}
            ${p("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:d=`
            ${p("output_data[global_idx]",0)}
            ${p("output_data[global_idx]",1)}
            ${p("output_data[global_idx]",2)}
            ${p("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,u,a)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`},Dc=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,n=e[1].dataType,a=!(P.areEqual(t,r)&&P.areEqual(r,i)),s=t,u=P.size(t);if(a){let d=tr.calcShape(tr.calcShape(t,r,!1),i,!1);if(!d)throw new Error("Can't perform where op on the given tensors");s=d,u=P.size(s)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:d=>Mc(d,e,s,a,n),getRunData:()=>({outputs:[{dims:s,dataType:n}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...se(i,t,r,s)]})}},Wm=e=>{e.compute(Dc(e.inputs))}}),qm,L_=Z(()=>{"use strict";J0(),Ka(),e_(),t_(),r_(),i_(),n_(),l_(),c_(),p_(),h_(),f_(),m_(),g_(),y_(),__(),b_(),w_(),$_(),v_(),x_(),S_(),k_(),T_(),I_(),E_(),om(),C_(),A_(),z_(),O_(),R_(),ja(),M_(),pm(),D_(),B_(),N_(),dm(),P_(),Ct(),Ya(),U_(),qm=new Map([["Abs",[zh]],["Acos",[Oh]],["Acosh",[Rh]],["Add",[mf]],["ArgMax",[Ih,ya]],["ArgMin",[Th,ya]],["Asin",[Mh]],["Asinh",[Dh]],["Atan",[Bh]],["Atanh",[Nh]],["Attention",[Eh]],["AveragePool",[$m,wm]],["BatchNormalization",[Ch]],["BiasAdd",[Ah]],["BiasSplitGelu",[ff]],["Cast",[Uh,Ph]],["Ceil",[Wh]],["Clip",[Lh]],["Concat",[kf,Tf]],["Conv",[xa,va]],["ConvTranspose",[Bf,Df]],["Cos",[qh]],["Cosh",[Vh]],["CumSum",[Nf,Pf]],["DepthToSpace",[Uf,Lf]],["DequantizeLinear",[Em,Cm]],["DFT",[Wf,qf]],["Div",[gf]],["Einsum",[Vf,Gf]],["Elu",[Gh,vr]],["Equal",[yf]],["Erf",[Fh]],["Exp",[Hh]],["Expand",[Ff]],["FastGelu",[Hf]],["Floor",[jh]],["FusedConv",[xa,va]],["Gather",[Kf,jf]],["GatherElements",[em,Jf]],["GatherBlockQuantized",[Xf,Qf]],["GatherND",[Yf,Zf]],["Gelu",[Kh]],["Gemm",[rm,tm]],["GlobalAveragePool",[xm,vm]],["GlobalMaxPool",[Im,Tm]],["Greater",[$f]],["GreaterOrEqual",[xf]],["GridSample",[im,nm]],["GroupQueryAttention",[hm]],["HardSigmoid",[rf,tf]],["HardSwish",[nf]],["InstanceNormalization",[fm]],["LayerNormalization",[mm]],["LeakyRelu",[Yh,vr]],["Less",[vf]],["LessOrEqual",[Sf]],["Log",[pf]],["MatMul",[gm]],["MatMulNBits",[ym,_m]],["MaxPool",[Sm,km]],["Mul",[_f]],["MultiHeadAttention",[sm,am]],["Neg",[Xh]],["Not",[Zh]],["Pad",[bm]],["Pow",[bf]],["QuickGelu",[hf,vr]],["Range",[Am]],["Reciprocal",[Qh]],["ReduceMin",[$h]],["ReduceMean",[gh]],["ReduceMax",[wh]],["ReduceSum",[xh]],["ReduceProd",[vh]],["ReduceL1",[yh]],["ReduceL2",[_h]],["ReduceLogSum",[kh]],["ReduceLogSumExp",[bh]],["ReduceSumSquare",[Sh]],["Relu",[Jh]],["Resize",[Rm,Mm]],["RotaryEmbedding",[cm]],["ScatterND",[Om,zm]],["Sigmoid",[ef]],["Sin",[af]],["Sinh",[sf]],["Slice",[Bm,Nm]],["SkipLayerNormalization",[Dm]],["Split",[um,lm]],["Sqrt",[of]],["Softmax",[Pm,Um]],["Sub",[wf]],["Tan",[uf]],["Tanh",[lf]],["ThresholdedRelu",[cf,vr]],["Tile",[Lm]],["Transpose",[nh,ah]],["Where",[Wm]]])}),Vm,W_=Z(()=>{"use strict";Ze(),gt(),de(),Vm=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,n){lt(e.programInfo.name);let a=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let d of t)u.push({binding:u.length,resource:{buffer:d.buffer}});for(let d of r)u.push({binding:u.length,resource:{buffer:d.buffer}});n&&u.push({binding:u.length,resource:n});let l=a.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let d={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(d)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),nt(e.programInfo.name)}dispose(){}build(e,t){lt(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(d=>{r.features.has(d.feature)&&i.push(`enable ${d.extension};`)});let n=ih(t,this.backend.device.limits),a=e.getShaderSource(n),s=`${i.join(`
`)}
${n.additionalImplementations}
${a}`,u=r.createShaderModule({code:s,label:e.name});be("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return nt(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:n.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,n=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=n&&r<=n&&i<=n)return[t,r,i];let a=t*r*i,s=Math.ceil(Math.sqrt(a));if(s>n){if(s=Math.ceil(Math.cbrt(a)),s>n)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),Gm={};nr(Gm,{WebGpuBackend:()=>Fm});var Bc,Nc,Pc,Fm,q_=Z(()=>{"use strict";Ze(),oe(),gt(),Qp(),X0(),L_(),W_(),Bc=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let n=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${n}`);break}case"rank":{let a=e[i].dims.length;r.push(`${n};${a}`);break}case"dims":{let a=e[i].dims.join(",");r.push(`${n};${a}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},Nc=(e,t,r)=>{var n,a;let i=e.name;return(n=e.shaderCache)!=null&&n.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${Bc(t,((a=e.shaderCache)==null?void 0:a.inputDependencies)??new Array(t.length).fill("dims"))}`,i},Pc=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Fm=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},n=u=>t.features.has(u)&&r.push(u)&&!0;n("chromium-experimental-timestamp-query-inside-passes")||n("timestamp-query"),n("shader-f16"),n("subgroups"),this.device=await t.requestDevice(i);let a=t,s=t.info??(typeof a.requestAdapterInfo=="function"?await a.requestAdapterInfo():void 0);this.adapterInfo=new Pc(s),this.gpuDataManager=th(this),this.programManager=new Vm(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Va(e.logLevel,!!e.debug),this.device.onuncapturederror=u=>{u.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${u.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){var e;typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&((e=this.env)!=null&&e.webgpu)&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;lt(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var i;let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let n=0;n<t.length/2;n++){let a=r[n],s=a.kernelId,u=this.kernels.get(s),l=u.kernelType,d=u.kernelName,h=a.programName,p=a.inputTensorViews,m=a.outputTensorViews,_=t[n*2],y=t[n*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=_);let w=Number(_-this.queryTimeBase),S=Number(y-this.queryTimeBase);if(!Number.isSafeInteger(w)||!Number.isSafeInteger(S))throw new RangeError("incorrect timestamp range");if((i=this.env.webgpu.profiling)!=null&&i.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:p.map(v=>({dims:v.dims,dataType:mt(v.dataType)})),outputsMetadata:m.map(v=>({dims:v.dims,dataType:mt(v.dataType)})),kernelId:s,kernelType:l,kernelName:d,programName:h,startTime:w,endTime:S});else{let v="";p.forEach((I,k)=>{v+=`input[${k}]: [${I.dims}] | ${mt(I.dataType)}, `});let b="";m.forEach((I,k)=>{b+=`output[${k}]: [${I.dims}] | ${mt(I.dataType)}, `}),console.log(`[profiling] kernel "${s}|${l}|${d}|${h}" ${v}${b}start time: ${w} ns, execution time: ${S-w} ns`)}ui("GPU",`${h}::${_}::${y}`)}e.unmap(),this.pendingQueries.delete(e)}),nt()}run(e,t,r,i,n,a){lt(e.name);let s=[];for(let b=0;b<t.length;++b){let I=t[b].data;if(I===0)continue;let k=this.gpuDataManager.get(I);if(!k)throw new Error(`no GPU data for input: ${I}`);s.push(k)}let{outputs:u,dispatchGroup:l,programUniforms:d}=e.getRunData(t),h=r.length===0?u.map((b,I)=>I):r;if(h.length!==u.length)throw new Error(`Output size ${h.length} must be equal to ${u.length}.`);let p=[],m=[];for(let b=0;b<u.length;++b){if(!Number.isInteger(h[b])||h[b]<-3||h[b]>=a)throw new Error(`Invalid output index: ${h[b]}`);if(h[b]===-3)continue;let I=h[b]===-1,k=h[b]===-2,T=I||k?n(u[b].dataType,u[b].dims):i(h[b],u[b].dataType,u[b].dims);if(p.push(T),T.data===0)continue;let C=this.gpuDataManager.get(T.data);if(!C)throw new Error(`no GPU data for output: ${T.data}`);if(I&&this.temporaryData.push(C),k){let A=this.kernelPersistentData.get(this.currentKernelId);A||(A=[],this.kernelPersistentData.set(this.currentKernelId,A)),A.push(C)}m.push(C)}if(s.length!==t.length||m.length!==p.length){if(m.length===0)return nt(e.name),p;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let _;if(d){let b=0,I=[];d.forEach(A=>{let $=typeof A.data=="number"?[A.data]:A.data;if($.length===0)return;let N=A.type===10?2:4,V,F;A.type===10?(F=$.length>4?16:$.length>2?8:$.length*N,V=$.length>4?16:N*$.length):(F=$.length<=2?$.length*N:16,V=16),b=Math.ceil(b/F)*F,I.push(b);let Y=A.type===10?8:4;b+=$.length>4?Math.ceil($.length/Y)*V:$.length*N});let k=16;b=Math.ceil(b/k)*k;let T=new ArrayBuffer(b);d.forEach((A,$)=>{let N=I[$],V=typeof A.data=="number"?[A.data]:A.data;if(A.type===6)new Int32Array(T,N,V.length).set(V);else if(A.type===12)new Uint32Array(T,N,V.length).set(V);else if(A.type===10)new Uint16Array(T,N,V.length).set(V);else if(A.type===1)new Float32Array(T,N,V.length).set(V);else throw new Error(`Unsupported uniform type: ${mt(A.type)}`)});let C=this.gpuDataManager.create(b,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(C.buffer,0,T,0,b),this.gpuDataManager.release(C.id),_={offset:0,size:b,buffer:C.buffer}}let y=this.programManager.normalizeDispatchGroupSize(l),w=y[1]===1&&y[2]===1,S=Nc(e,t,w),v=this.programManager.getArtifact(S);if(v||(v=this.programManager.build(e,y),this.programManager.setArtifact(S,v),be("info",()=>`[artifact] key: ${S}, programName: ${e.name}`)),d&&v.uniformVariablesInfo){if(d.length!==v.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${v.uniformVariablesInfo.length}, got ${d.length} in program "${v.programInfo.name}".`);for(let b=0;b<d.length;b++){let I=d[b],k=I.type,T=typeof I.data=="number"?1:I.data.length,[C,A]=v.uniformVariablesInfo[b];if(k!==C||T!==A)throw new Error(`Uniform variable ${b} mismatch: expect type ${C} with size ${A}, got type ${k} with size ${T} in program "${v.programInfo.name}".`)}}if(be("info",()=>`[ProgramManager] run "${e.name}" (key=${S}) with ${y[0]}x${y[1]}x${y[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let b={kernelId:this.currentKernelId,programName:v.programInfo.name,inputTensorViews:t,outputTensorViews:p};this.pendingKernels.push(b),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(b)}return this.programManager.run(v,s,m,y,_),nt(e.name),p}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let n=qm.get(e);if(!n)throw new Error(`kernel not implemented: ${e}`);let a={kernelType:e,kernelName:i,kernelEntry:n[0],attributes:[n[1],r]};this.kernels.set(t,a)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let n=i.kernelType,a=i.kernelName,s=i.kernelEntry,u=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${n}] ${a}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),be("info",()=>`[WebGPU] Start to run kernel "[${n}] ${a}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,u[1]),0}catch(d){return r.push(Promise.resolve(`[WebGPU] Kernel "[${n}] ${a}" failed. ${d}`)),1}finally{l&&r.push(this.device.popErrorScope().then(d=>d?`GPU validation error for kernel "[${n}] ${a}": ${d.message}`:null));for(let d of this.temporaryData)this.gpuDataManager.release(d.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let n=this.sessionExternalDataMapping.get(e);n||(n=new Map,this.sessionExternalDataMapping.set(e,n));let a=n.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,a);return n.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await fa(this,e,t);return Ga(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){be("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){be("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){be("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let n=this.getComputePassEncoder(),a=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),n.setPipeline(a.computePipeline),n.setBindGroup(0,a.bindGroup),n.dispatchWorkgroups(...a.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Hm={};nr(Hm,{init:()=>jm});var Qr,Uc,jm,V_=Z(()=>{"use strict";oe(),gt(),le(),Z0(),Qr=class Km{constructor(t,r,i,n){this.module=t,this.dataType=r,this.data=i,this.dims=n}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=P.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=P.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=P.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=P.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(P.size(t)!==P.size(this.dims))throw new Error("Invalid new shape");return new Km(this.module,this.dataType,this.data,t)}},Uc=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let i=e.PTR_SIZE,n=r/e.PTR_SIZE,a=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*n++,a));let s=Number(e.getValue(i*n++,a));this.outputCount=Number(e.getValue(i*n++,a)),this.customDataOffset=Number(e.getValue(i*n++,"*")),this.customDataSize=Number(e.getValue(i*n++,a));let u=[];for(let l=0;l<s;l++){let d=Number(e.getValue(i*n++,a)),h=Number(e.getValue(i*n++,"*")),p=Number(e.getValue(i*n++,a)),m=[];for(let _=0;_<p;_++)m.push(Number(e.getValue(i*n++,a)));u.push(new Qr(e,d,h,m))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var s;let r=((s=t==null?void 0:t.inputs)==null?void 0:s.map(u=>typeof u=="number"?this.inputs[u]:u))??this.inputs,i=(t==null?void 0:t.outputs)??[],n=(u,l,d)=>new Qr(this.module,l,this.output(u,d),d),a=(u,l)=>{let d=Ut(u,l);if(!d)throw new Error(`Unsupported data type: ${u}`);let h=d>0?this.backend.gpuDataManager.create(d).id:0;return new Qr(this.module,u,h,l)};return this.backend.run(e,r,i,n,a,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,n=i===4?"i32":"i64",a=this.module.stackAlloc((1+t.length)*i);this.module.setValue(a,t.length,n);for(let s=0;s<t.length;s++)this.module.setValue(a+i*(s+1),t[s],n);return this.module._JsepOutput(this.opKernelContext,e,a)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},jm=async(e,t,r,i)=>{let n=t.jsepInit;if(!n)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let a=(q_(),kr(Gm)).WebGpuBackend,s=new a;await s.initialize(r,i),n("webgpu",[s,u=>s.alloc(Number(u)),u=>s.free(u),(u,l,d,h=!1)=>{if(h)be("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(l)}, size=${Number(d)}`),s.memcpy(Number(u),Number(l));else{be("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(l)}, size=${Number(d)}`);let p=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(d));s.upload(Number(l),p)}},async(u,l,d)=>{be("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${l}, size=${d}`),await s.download(Number(u),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+d)>>>0))},(u,l,d)=>s.createKernel(u,Number(l),d,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),u=>s.releaseKernel(u),(u,l,d,h)=>{be("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${u}, contextDataOffset=${l}`);let p=new Uc(t,s,Number(l));return s.computeKernel(Number(u),p,h)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let a=new eh(r);n("webnn",[a,()=>a.reserveTensorId(),s=>a.releaseTensorId(s),async(s,u,l,d,h)=>a.ensureTensor(s,u,l,d,h),(s,u)=>{a.uploadTensor(s,u)},async(s,u)=>a.downloadTensor(s,u),(s,u)=>a.registerMLContext(s,u),!!r.trace])}}}),Lc,ts,rs,St,Wc,Pn,mi,is,ns,Un,as,ss,os,Ym=Z(()=>{"use strict";Ze(),j0(),K0(),oe(),Ht(),Ua(),Kp(),Lc=(e,t)=>{Te()._OrtInit(e,t)!==0&&Se("Can't initialize onnxruntime.")},ts=async e=>{Lc(e.wasm.numThreads,di(e.logLevel))},rs=async(e,t)=>{var i,n;(n=(i=Te()).asyncInit)==null||n.call(i);let r=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(r){if(typeof r.limits!="object"||typeof r.features!="object"||typeof r.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let a=e.webgpu.powerPreference;if(a!==void 0&&a!=="low-power"&&a!=="high-performance")throw new Error(`Invalid powerPreference setting: "${a}"`);let s=e.webgpu.forceFallbackAdapter;if(s!==void 0&&typeof s!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${s}"`);if(r=await navigator.gpu.requestAdapter({powerPreference:a,forceFallbackAdapter:s}),!r)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let a=(V_(),kr(Hm)).init;t==="webgpu"&&await a("webgpu",Te(),e,r),t==="webnn"&&await a("webnn",Te(),e)}},St=new Map,Wc=e=>{let t=Te(),r=t.stackSave();try{let i=t.PTR_SIZE,n=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,n,n+i)!==0&&Se("Can't get session input/output count.");let a=i===4?"i32":"i64";return[Number(t.getValue(n,a)),Number(t.getValue(n+i,a))]}finally{t.stackRestore(r)}},Pn=(e,t)=>{let r=Te(),i=r.stackSave(),n=0;try{let a=r.PTR_SIZE,s=r.stackAlloc(2*a);r._OrtGetInputOutputMetadata(e,t,s,s+a)!==0&&Se("Can't get session input/output metadata.");let u=Number(r.getValue(s,"*"));n=Number(r.getValue(s+a,"*"));let l=r.HEAP32[n/4];if(l===0)return[u,0];let d=r.HEAPU32[n/4+1],h=[];for(let p=0;p<d;p++){let m=Number(r.getValue(n+8+p*a,"*"));h.push(m!==0?r.UTF8ToString(m):Number(r.getValue(n+8+(p+d)*a,"*")))}return[u,l,h]}finally{r.stackRestore(i),n!==0&&r._OrtFree(n)}},mi=e=>{let t=Te(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},is=async(e,t)=>{var p,m,_,y;let r,i,n=Te();Array.isArray(e)?[r,i]=e:e.buffer===n.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=mi(e);let a=0,s=0,u=0,l=[],d=[],h=[];try{if([s,l]=await jp(t),(t==null?void 0:t.externalData)&&n.mountExternalData){let $=[];for(let N of t.externalData){let V=typeof N=="string"?N:N.path,F=typeof N=="string"?N:N.data;$.push(qa(F).then(Y=>{n.mountExternalData(V,Y)}))}await Promise.all($)}for(let $ of(t==null?void 0:t.executionProviders)??[])if((typeof $=="string"?$:$.name)==="webnn"){if(n.shouldTransferToMLTensor=!1,typeof $!="string"){let N=$,V=N==null?void 0:N.context,F=N==null?void 0:N.gpuDevice,Y=N==null?void 0:N.deviceType,H=N==null?void 0:N.powerPreference;V?n.currentContext=V:F?n.currentContext=await n.webnnCreateMLContext(F):n.currentContext=await n.webnnCreateMLContext({deviceType:Y,powerPreference:H})}else n.currentContext=await n.webnnCreateMLContext();break}a=await n._OrtCreateSession(r,i,s),(p=n.webgpuOnCreateSession)==null||p.call(n,a),a===0&&Se("Can't create a session."),(m=n.jsepOnCreateSession)==null||m.call(n),n.currentContext&&(n.webnnRegisterMLContext(a,n.currentContext),n.currentContext=void 0,n.shouldTransferToMLTensor=!0);let[w,S]=Wc(a),v=!!(t!=null&&t.enableGraphCapture),b=[],I=[],k=[],T=[],C=[];for(let $=0;$<w;$++){let[N,V,F]=Pn(a,$);N===0&&Se("Can't get an input name."),d.push(N);let Y=n.UTF8ToString(N);b.push(Y),k.push(V===0?{name:Y,isTensor:!1}:{name:Y,isTensor:!0,type:mt(V),shape:F})}for(let $=0;$<S;$++){let[N,V,F]=Pn(a,$+w);N===0&&Se("Can't get an output name."),h.push(N);let Y=n.UTF8ToString(N);I.push(Y),T.push(V===0?{name:Y,isTensor:!1}:{name:Y,isTensor:!0,type:mt(V),shape:F});{if(v&&(t==null?void 0:t.preferredOutputLocation)===void 0){C.push("gpu-buffer");continue}let H=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((_=t==null?void 0:t.preferredOutputLocation)==null?void 0:_[Y])??"cpu",D=n.webnnIsGraphOutput;if(H==="cpu"&&D&&D(a,Y)){C.push("ml-tensor-cpu-output");continue}if(H!=="cpu"&&H!=="cpu-pinned"&&H!=="gpu-buffer"&&H!=="ml-tensor")throw new Error(`Not supported preferred output location: ${H}.`);if(v&&H!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${H}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);C.push(H)}}let A=null;return C.some($=>$==="gpu-buffer"||$==="ml-tensor"||$==="ml-tensor-cpu-output")&&(u=n._OrtCreateBinding(a),u===0&&Se("Can't create IO binding."),A={handle:u,outputPreferredLocations:C,outputPreferredLocationsEncoded:C.map($=>$==="ml-tensor-cpu-output"?"ml-tensor":$).map($=>ha($))}),St.set(a,[a,d,h,A,v,!1]),[a,b,I,k,T]}catch(w){throw d.forEach(S=>n._OrtFree(S)),h.forEach(S=>n._OrtFree(S)),u!==0&&n._OrtReleaseBinding(u)!==0&&Se("Can't release IO binding."),a!==0&&n._OrtReleaseSession(a)!==0&&Se("Can't release session."),w}finally{n._free(r),s!==0&&n._OrtReleaseSessionOptions(s)!==0&&Se("Can't release session options."),l.forEach(w=>n._free(w)),(y=n.unmountExternalData)==null||y.call(n)}},ns=e=>{var l,d,h;let t=Te(),r=St.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,n,a,s,u]=r;s&&(u&&t._OrtClearBoundOutputs(s.handle)!==0&&Se("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&Se("Can't release IO binding.")),(l=t.jsepOnReleaseSession)==null||l.call(t,e),(d=t.webnnOnReleaseSession)==null||d.call(t,e),(h=t.webgpuOnReleaseSession)==null||h.call(t,e),n.forEach(p=>t._OrtFree(p)),a.forEach(p=>t._OrtFree(p)),t._OrtReleaseSession(i)!==0&&Se("Can't release session."),St.delete(e)},Un=async(e,t,r,i,n,a,s=!1)=>{if(!e){t.push(0);return}let u=Te(),l=u.PTR_SIZE,d=e[0],h=e[1],p=e[3],m=p,_,y;if(d==="string"&&(p==="gpu-buffer"||p==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&p!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${a} when enableGraphCapture is true.`);if(p==="gpu-buffer"){let v=e[2].gpuBuffer;y=Ut(Pt(d),h);{let b=u.jsepRegisterBuffer;if(!b)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');_=b(i,a,v,y)}}else if(p==="ml-tensor"){let v=e[2].mlTensor;y=Ut(Pt(d),h);let b=u.webnnRegisterMLTensor;if(!b)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');_=b(i,v,Pt(d),h)}else{let v=e[2];if(Array.isArray(v)){y=l*v.length,_=u._malloc(y),r.push(_);for(let b=0;b<v.length;b++){if(typeof v[b]!="string")throw new TypeError(`tensor data at index ${b} is not a string`);u.setValue(_+b*l,it(v[b],r),"*")}}else{let b=u.webnnIsGraphInput,I=u.webnnIsGraphOutput;if(d!=="string"&&b&&I){let k=u.UTF8ToString(n);if(b(i,k)||I(i,k)){let T=Pt(d);y=Ut(T,h),m="ml-tensor";let C=u.webnnCreateTemporaryTensor,A=u.webnnUploadTensor;if(!C||!A)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let $=await C(i,T,h);A($,new Uint8Array(v.buffer,v.byteOffset,v.byteLength)),_=$}else y=v.byteLength,_=u._malloc(y),r.push(_),u.HEAPU8.set(new Uint8Array(v.buffer,v.byteOffset,y),_)}else y=v.byteLength,_=u._malloc(y),r.push(_),u.HEAPU8.set(new Uint8Array(v.buffer,v.byteOffset,y),_)}}let w=u.stackSave(),S=u.stackAlloc(4*h.length);try{h.forEach((b,I)=>u.setValue(S+I*l,b,l===4?"i32":"i64"));let v=u._OrtCreateTensor(Pt(d),_,y,S,h.length,ha(m));v===0&&Se(`Can't create tensor for input/output. session=${i}, index=${a}.`),t.push(v)}finally{u.stackRestore(w)}},as=async(e,t,r,i,n,a)=>{var Y,H,D,K;let s=Te(),u=s.PTR_SIZE,l=St.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],h=l[1],p=l[2],m=l[3],_=l[4],y=l[5],w=t.length,S=i.length,v=0,b=[],I=[],k=[],T=[],C=[],A=s.stackSave(),$=s.stackAlloc(w*u),N=s.stackAlloc(w*u),V=s.stackAlloc(S*u),F=s.stackAlloc(S*u);try{[v,b]=Hp(a),Lt("wasm prepareInputOutputTensor");for(let O=0;O<w;O++)await Un(r[O],I,T,e,h[t[O]],t[O],_);for(let O=0;O<S;O++)await Un(n[O],k,T,e,p[i[O]],w+i[O],_);Wt("wasm prepareInputOutputTensor");for(let O=0;O<w;O++)s.setValue($+O*u,I[O],"*"),s.setValue(N+O*u,h[t[O]],"*");for(let O=0;O<S;O++)s.setValue(V+O*u,k[O],"*"),s.setValue(F+O*u,p[i[O]],"*");if(m&&!y){let{handle:O,outputPreferredLocations:B,outputPreferredLocationsEncoded:R}=m;if(h.length!==w)throw new Error(`input count from feeds (${w}) is expected to be always equal to model's input count (${h.length}).`);Lt("wasm bindInputsOutputs");for(let L=0;L<w;L++){let U=t[L];await s._OrtBindInput(O,h[U],I[L])!==0&&Se(`Can't bind input[${L}] for session=${e}.`)}for(let L=0;L<S;L++){let U=i[L];(Y=n[L])!=null&&Y[3]?(C.push(k[L]),s._OrtBindOutput(O,p[U],k[L],0)!==0&&Se(`Can't bind pre-allocated output[${L}] for session=${e}.`)):s._OrtBindOutput(O,p[U],0,R[U])!==0&&Se(`Can't bind output[${L}] to ${B[L]} for session=${e}.`)}Wt("wasm bindInputsOutputs"),St.set(e,[d,h,p,m,_,!0])}(H=s.jsepOnRunStart)==null||H.call(s,d),(D=s.webnnOnRunStart)==null||D.call(s,d);let z;m?z=await s._OrtRunWithBinding(d,m.handle,S,V,v):z=await s._OrtRun(d,N,$,w,F,S,V,v),z!==0&&Se("failed to call OrtRun().");let j=[],X=[];Lt("wasm ProcessOutputTensor");for(let O=0;O<S;O++){let B=Number(s.getValue(V+O*u,"*"));if(B===k[O]||C.includes(k[O])){j.push(n[O]),B!==k[O]&&s._OrtReleaseTensor(B)!==0&&Se("Can't release tensor.");continue}let R=s.stackSave(),L=s.stackAlloc(4*u),U=!1,W,Q=0;try{s._OrtGetTensorData(B,L,L+u,L+2*u,L+3*u)!==0&&Se(`Can't access output tensor data on index ${O}.`);let me=u===4?"i32":"i64",he=Number(s.getValue(L,me));Q=s.getValue(L+u,"*");let ue=s.getValue(L+u*2,"*"),ee=Number(s.getValue(L+u*3,me)),ae=[];for(let pe=0;pe<ee;pe++)ae.push(Number(s.getValue(ue+pe*u,me)));s._OrtFree(ue)!==0&&Se("Can't free memory for tensor dims.");let ce=ae.reduce((pe,ie)=>pe*ie,1);W=mt(he);let Ee=m==null?void 0:m.outputPreferredLocations[i[O]];if(W==="string"){if(Ee==="gpu-buffer"||Ee==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let pe=[];for(let ie=0;ie<ce;ie++){let Oe=s.getValue(Q+ie*u,"*"),We=s.getValue(Q+(ie+1)*u,"*"),qe=ie===ce-1?void 0:We-Oe;pe.push(s.UTF8ToString(Oe,qe))}j.push([W,ae,pe,"cpu"])}else if(Ee==="gpu-buffer"&&ce>0){let pe=s.jsepGetBuffer;if(!pe)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let ie=pe(Q),Oe=Ut(he,ce);if(Oe===void 0||!La(W))throw new Error(`Unsupported data type: ${W}`);U=!0,j.push([W,ae,{gpuBuffer:ie,download:s.jsepCreateDownloader(ie,Oe,W),dispose:()=>{s._OrtReleaseTensor(B)!==0&&Se("Can't release tensor.")}},"gpu-buffer"])}else if(Ee==="ml-tensor"&&ce>0){let pe=s.webnnEnsureTensor,ie=s.webnnIsGraphInputOutputTypeSupported;if(!pe||!ie)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Ut(he,ce)===void 0||!Wa(W))throw new Error(`Unsupported data type: ${W}`);if(!ie(e,W,!1))throw new Error(`preferredLocation "ml-tensor" for ${W} output is not supported by current WebNN Context.`);let Oe=await pe(e,Q,he,ae,!1);U=!0,j.push([W,ae,{mlTensor:Oe,download:s.webnnCreateMLTensorDownloader(Q,W),dispose:()=>{s.webnnReleaseTensorId(Q),s._OrtReleaseTensor(B)}},"ml-tensor"])}else if(Ee==="ml-tensor-cpu-output"&&ce>0){let pe=s.webnnCreateMLTensorDownloader(Q,W)(),ie=j.length;U=!0,X.push((async()=>{let Oe=[ie,await pe];return s.webnnReleaseTensorId(Q),s._OrtReleaseTensor(B),Oe})()),j.push([W,ae,[],"cpu"])}else{let pe=gi(W),ie=new pe(ce);new Uint8Array(ie.buffer,ie.byteOffset,ie.byteLength).set(s.HEAPU8.subarray(Q,Q+ie.byteLength)),j.push([W,ae,ie,"cpu"])}}finally{s.stackRestore(R),W==="string"&&Q&&s._free(Q),U||s._OrtReleaseTensor(B)}}m&&!_&&(s._OrtClearBoundOutputs(m.handle)!==0&&Se("Can't clear bound outputs."),St.set(e,[d,h,p,m,_,!1]));for(let[O,B]of await Promise.all(X))j[O][2]=B;return Wt("wasm ProcessOutputTensor"),j}finally{(K=s.webnnOnRunEnd)==null||K.call(s,d),s.stackRestore(A),I.forEach(z=>s._OrtReleaseTensor(z)),k.forEach(z=>s._OrtReleaseTensor(z)),T.forEach(z=>s._free(z)),v!==0&&s._OrtReleaseRunOptions(v),b.forEach(z=>s._free(z))}},ss=e=>{let t=Te(),r=St.get(e);if(!r)throw new Error("invalid session id");let i=r[0],n=t._OrtEndProfiling(i);n===0&&Se("Can't get an profile file name."),t._OrtFree(n)},os=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),kt,Le,Xt,yr,_r,Jr,Ln,ei,Dt,Bt,qc,Zm,Xm,Qm,Jm,eg,tg,rg,ig=Z(()=>{"use strict";Ze(),Ym(),Ht(),Na(),kt=()=>!!ve.wasm.proxy&&typeof document<"u",Xt=!1,yr=!1,_r=!1,ei=new Map,Dt=(e,t)=>{let r=ei.get(e);r?r.push(t):ei.set(e,[t])},Bt=()=>{if(Xt||!yr||_r||!Le)throw new Error("worker not ready")},qc=e=>{switch(e.data.type){case"init-wasm":Xt=!1,e.data.err?(_r=!0,Ln[1](e.data.err)):(yr=!0,Ln[0]()),Jr&&(URL.revokeObjectURL(Jr),Jr=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=ei.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},Zm=async()=>{if(!yr){if(Xt)throw new Error("multiple calls to 'initWasm()' detected.");if(_r)throw new Error("previous call to 'initWasm()' failed.");if(Xt=!0,kt())return new Promise((e,t)=>{Le==null||Le.terminate(),Gp().then(([r,i])=>{try{Le=i,Le.onerror=a=>t(a),Le.onmessage=qc,Ln=[e,t];let n={type:"init-wasm",in:ve};!n.in.wasm.wasmPaths&&(r||pa)&&(n.in.wasm.wasmPaths={wasm:new URL("ort-wasm-simd-threaded.jsep.wasm",self.location.href).href}),Le.postMessage(n),Jr=r}catch(n){t(n)}},t)});try{await Pa(ve.wasm),await ts(ve),yr=!0}catch(e){throw _r=!0,e}finally{Xt=!1}}},Xm=async e=>{if(kt())return Bt(),new Promise((t,r)=>{Dt("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:ve}};Le.postMessage(i)});await rs(ve,e)},Qm=async e=>kt()?(Bt(),new Promise((t,r)=>{Dt("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};Le.postMessage(i,[e.buffer])})):mi(e),Jm=async(e,t)=>{if(kt()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Bt(),new Promise((r,i)=>{Dt("create",[r,i]);let n={type:"create",in:{model:e,options:{...t}}},a=[];e instanceof Uint8Array&&a.push(e.buffer),Le.postMessage(n,a)})}else return is(e,t)},eg=async e=>{if(kt())return Bt(),new Promise((t,r)=>{Dt("release",[t,r]);let i={type:"release",in:e};Le.postMessage(i)});ns(e)},tg=async(e,t,r,i,n,a)=>{if(kt()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(n.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return Bt(),new Promise((s,u)=>{Dt("run",[s,u]);let l=r,d={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:a}};Le.postMessage(d,os(l))})}else return as(e,t,r,i,n,a)},rg=async e=>{if(kt())return Bt(),new Promise((t,r)=>{Dt("end-profiling",[t,r]);let i={type:"end-profiling",in:e};Le.postMessage(i)});ss(e)}}),Wn,Vc,ng,G_=Z(()=>{"use strict";Ze(),ig(),oe(),Ba(),Kp(),Wn=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},Vc=e=>{switch(e[3]){case"cpu":return new Ye(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!La(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:n}=e[2];return Ye.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:n})}case"ml-tensor":{let t=e[0];if(!Wa(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:n}=e[2];return Ye.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:n})}default:throw new Error(`invalid data location: ${e[3]}`)}},ng=class{async fetchModelAndCopyToWasmMemory(e){return Qm(await qa(e))}async loadModel(e,t){lt();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await Jm(r,t),nt()}async dispose(){return eg(this.sessionId)}async run(e,t,r){lt();let i=[],n=[];Object.entries(e).forEach(p=>{let m=p[0],_=p[1],y=this.inputNames.indexOf(m);if(y===-1)throw new Error(`invalid input '${m}'`);i.push(_),n.push(y)});let a=[],s=[];Object.entries(t).forEach(p=>{let m=p[0],_=p[1],y=this.outputNames.indexOf(m);if(y===-1)throw new Error(`invalid output '${m}'`);a.push(_),s.push(y)});let u=i.map((p,m)=>Wn(p,()=>`input "${this.inputNames[n[m]]}"`)),l=a.map((p,m)=>p?Wn(p,()=>`output "${this.outputNames[s[m]]}"`):null),d=await tg(this.sessionId,n,u,s,l,r),h={};for(let p=0;p<d.length;p++)h[this.outputNames[s[p]]]=a[p]??Vc(d[p]);return nt(),h}startProfiling(){}endProfiling(){rg(this.sessionId)}}}),ag={};nr(ag,{OnnxruntimeWebAssemblyBackend:()=>Ta,initializeFlags:()=>ka,wasmBackend:()=>sg});var ka,Ta,sg,F_=Z(()=>{"use strict";Ze(),ig(),G_(),ka=()=>{(typeof ve.wasm.initTimeout!="number"||ve.wasm.initTimeout<0)&&(ve.wasm.initTimeout=0);let e=ve.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),ve.wasm.simd=!1),typeof ve.wasm.proxy!="boolean"&&(ve.wasm.proxy=!1),typeof ve.wasm.trace!="boolean"&&(ve.wasm.trace=!1),typeof ve.wasm.numThreads!="number"||!Number.isInteger(ve.wasm.numThreads)||ve.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ve.wasm.numThreads=1;else{let t=typeof navigator>"u"?C0("node:os").cpus().length:navigator.hardwareConcurrency;ve.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Ta=class{async init(e){ka(),await Zm(),await Xm(e)}async createInferenceSessionHandler(e,t){let r=new ng;return await r.loadModel(e,t),r}},sg=new Ta});Ze();Ze();Ze();var H_="1.30.0";{let e=(F_(),kr(ag)).wasmBackend;Qt("webgpu",e,5),Qt("webnn",e,5),Qt("cpu",e,10),Qt("wasm",e,10)}Object.defineProperty(ve.versions,"web",{value:H_,enumerable:!0});/**
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
 */var qn={exports:{}},Gc;function j_(){return Gc||(Gc=1,(function(e){var t=(function(r){var i=Object.prototype,n=i.hasOwnProperty,a=Object.defineProperty||function(O,B,R){O[B]=R.value},s,u=typeof Symbol=="function"?Symbol:{},l=u.iterator||"@@iterator",d=u.asyncIterator||"@@asyncIterator",h=u.toStringTag||"@@toStringTag";function p(O,B,R){return Object.defineProperty(O,B,{value:R,enumerable:!0,configurable:!0,writable:!0}),O[B]}try{p({},"")}catch{p=function(B,R,L){return B[R]=L}}function m(O,B,R,L){var U=B&&B.prototype instanceof I?B:I,W=Object.create(U.prototype),Q=new z(L||[]);return a(W,"_invoke",{value:Y(O,R,Q)}),W}r.wrap=m;function _(O,B,R){try{return{type:"normal",arg:O.call(B,R)}}catch(L){return{type:"throw",arg:L}}}var y="suspendedStart",w="suspendedYield",S="executing",v="completed",b={};function I(){}function k(){}function T(){}var C={};p(C,l,function(){return this});var A=Object.getPrototypeOf,$=A&&A(A(j([])));$&&$!==i&&n.call($,l)&&(C=$);var N=T.prototype=I.prototype=Object.create(C);k.prototype=T,a(N,"constructor",{value:T,configurable:!0}),a(T,"constructor",{value:k,configurable:!0}),k.displayName=p(T,h,"GeneratorFunction");function V(O){["next","throw","return"].forEach(function(B){p(O,B,function(R){return this._invoke(B,R)})})}r.isGeneratorFunction=function(O){var B=typeof O=="function"&&O.constructor;return B?B===k||(B.displayName||B.name)==="GeneratorFunction":!1},r.mark=function(O){return Object.setPrototypeOf?Object.setPrototypeOf(O,T):(O.__proto__=T,p(O,h,"GeneratorFunction")),O.prototype=Object.create(N),O},r.awrap=function(O){return{__await:O}};function F(O,B){function R(W,Q,me,he){var ue=_(O[W],O,Q);if(ue.type==="throw")he(ue.arg);else{var ee=ue.arg,ae=ee.value;return ae&&typeof ae=="object"&&n.call(ae,"__await")?B.resolve(ae.__await).then(function(ce){R("next",ce,me,he)},function(ce){R("throw",ce,me,he)}):B.resolve(ae).then(function(ce){ee.value=ce,me(ee)},function(ce){return R("throw",ce,me,he)})}}var L;function U(W,Q){function me(){return new B(function(he,ue){R(W,Q,he,ue)})}return L=L?L.then(me,me):me()}a(this,"_invoke",{value:U})}V(F.prototype),p(F.prototype,d,function(){return this}),r.AsyncIterator=F,r.async=function(O,B,R,L,U){U===void 0&&(U=Promise);var W=new F(m(O,B,R,L),U);return r.isGeneratorFunction(B)?W:W.next().then(function(Q){return Q.done?Q.value:W.next()})};function Y(O,B,R){var L=y;return function(W,Q){if(L===S)throw new Error("Generator is already running");if(L===v){if(W==="throw")throw Q;return X()}for(R.method=W,R.arg=Q;;){var me=R.delegate;if(me){var he=H(me,R);if(he){if(he===b)continue;return he}}if(R.method==="next")R.sent=R._sent=R.arg;else if(R.method==="throw"){if(L===y)throw L=v,R.arg;R.dispatchException(R.arg)}else R.method==="return"&&R.abrupt("return",R.arg);L=S;var ue=_(O,B,R);if(ue.type==="normal"){if(L=R.done?v:w,ue.arg===b)continue;return{value:ue.arg,done:R.done}}else ue.type==="throw"&&(L=v,R.method="throw",R.arg=ue.arg)}}}function H(O,B){var R=B.method,L=O.iterator[R];if(L===s)return B.delegate=null,R==="throw"&&O.iterator.return&&(B.method="return",B.arg=s,H(O,B),B.method==="throw")||R!=="return"&&(B.method="throw",B.arg=new TypeError("The iterator does not provide a '"+R+"' method")),b;var U=_(L,O.iterator,B.arg);if(U.type==="throw")return B.method="throw",B.arg=U.arg,B.delegate=null,b;var W=U.arg;if(!W)return B.method="throw",B.arg=new TypeError("iterator result is not an object"),B.delegate=null,b;if(W.done)B[O.resultName]=W.value,B.next=O.nextLoc,B.method!=="return"&&(B.method="next",B.arg=s);else return W;return B.delegate=null,b}V(N),p(N,h,"Generator"),p(N,l,function(){return this}),p(N,"toString",function(){return"[object Generator]"});function D(O){var B={tryLoc:O[0]};1 in O&&(B.catchLoc=O[1]),2 in O&&(B.finallyLoc=O[2],B.afterLoc=O[3]),this.tryEntries.push(B)}function K(O){var B=O.completion||{};B.type="normal",delete B.arg,O.completion=B}function z(O){this.tryEntries=[{tryLoc:"root"}],O.forEach(D,this),this.reset(!0)}r.keys=function(O){var B=Object(O),R=[];for(var L in B)R.push(L);return R.reverse(),function U(){for(;R.length;){var W=R.pop();if(W in B)return U.value=W,U.done=!1,U}return U.done=!0,U}};function j(O){if(O){var B=O[l];if(B)return B.call(O);if(typeof O.next=="function")return O;if(!isNaN(O.length)){var R=-1,L=function U(){for(;++R<O.length;)if(n.call(O,R))return U.value=O[R],U.done=!1,U;return U.value=s,U.done=!0,U};return L.next=L}}return{next:X}}r.values=j;function X(){return{value:s,done:!0}}return z.prototype={constructor:z,reset:function(O){if(this.prev=0,this.next=0,this.sent=this._sent=s,this.done=!1,this.delegate=null,this.method="next",this.arg=s,this.tryEntries.forEach(K),!O)for(var B in this)B.charAt(0)==="t"&&n.call(this,B)&&!isNaN(+B.slice(1))&&(this[B]=s)},stop:function(){this.done=!0;var O=this.tryEntries[0],B=O.completion;if(B.type==="throw")throw B.arg;return this.rval},dispatchException:function(O){if(this.done)throw O;var B=this;function R(he,ue){return W.type="throw",W.arg=O,B.next=he,ue&&(B.method="next",B.arg=s),!!ue}for(var L=this.tryEntries.length-1;L>=0;--L){var U=this.tryEntries[L],W=U.completion;if(U.tryLoc==="root")return R("end");if(U.tryLoc<=this.prev){var Q=n.call(U,"catchLoc"),me=n.call(U,"finallyLoc");if(Q&&me){if(this.prev<U.catchLoc)return R(U.catchLoc,!0);if(this.prev<U.finallyLoc)return R(U.finallyLoc)}else if(Q){if(this.prev<U.catchLoc)return R(U.catchLoc,!0)}else if(me){if(this.prev<U.finallyLoc)return R(U.finallyLoc)}else throw new Error("try statement without catch or finally")}}},abrupt:function(O,B){for(var R=this.tryEntries.length-1;R>=0;--R){var L=this.tryEntries[R];if(L.tryLoc<=this.prev&&n.call(L,"finallyLoc")&&this.prev<L.finallyLoc){var U=L;break}}U&&(O==="break"||O==="continue")&&U.tryLoc<=B&&B<=U.finallyLoc&&(U=null);var W=U?U.completion:{};return W.type=O,W.arg=B,U?(this.method="next",this.next=U.finallyLoc,b):this.complete(W)},complete:function(O,B){if(O.type==="throw")throw O.arg;return O.type==="break"||O.type==="continue"?this.next=O.arg:O.type==="return"?(this.rval=this.arg=O.arg,this.method="return",this.next="end"):O.type==="normal"&&B&&(this.next=B),b},finish:function(O){for(var B=this.tryEntries.length-1;B>=0;--B){var R=this.tryEntries[B];if(R.finallyLoc===O)return this.complete(R.completion,R.afterLoc),K(R),b}},catch:function(O){for(var B=this.tryEntries.length-1;B>=0;--B){var R=this.tryEntries[B];if(R.tryLoc===O){var L=R.completion;if(L.type==="throw"){var U=L.arg;K(R)}return U}}throw new Error("illegal catch attempt")},delegateYield:function(O,B,R){return this.delegate={iterator:j(O),resultName:B,nextLoc:R},this.method==="next"&&(this.arg=s),b}},r})(e.exports);try{regeneratorRuntime=t}catch{typeof globalThis=="object"?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}})(qn)),qn.exports}var Vn,Fc;function us(){return Fc||(Fc=1,Vn=(e,t)=>`${e}-${t}-${Math.random().toString(16).slice(3,8)}`),Vn}var Gn,Hc;function og(){if(Hc)return Gn;Hc=1;const e=us();let t=0;return Gn=({id:r,action:i,payload:n={}})=>{let a=r;return typeof a>"u"&&(a=e("Job",t),t+=1),{id:a,action:i,payload:n}},Gn}var br={},jc;function ls(){if(jc)return br;jc=1;let e=!1;return br.logging=e,br.setLogging=t=>{e=t},br.log=(...t)=>e?console.log.apply(this,t):null,br}var Fn,Kc;function K_(){if(Kc)return Fn;Kc=1;const e=og(),{log:t}=ls(),r=us();let i=0;return Fn=()=>{const n=r("Scheduler",i),a={},s={};let u=[];i+=1;const l=()=>u.length,d=()=>Object.keys(a).length,h=()=>{if(u.length!==0){const w=Object.keys(a);for(let S=0;S<w.length;S+=1)if(typeof s[w[S]]>"u"){u[0](a[w[S]]);break}}},p=(w,S)=>new Promise((v,b)=>{const I=e({action:w,payload:S});u.push(async k=>{u.shift(),s[k.id]=I;try{v(await k[w].apply(this,[...S,I.id]))}catch(T){b(T)}finally{delete s[k.id],h()}}),t(`[${n}]: Add ${I.id} to JobQueue`),t(`[${n}]: JobQueue length=${u.length}`),h()});return{addWorker:w=>(a[w.id]=w,t(`[${n}]: Add ${w.id}`),t(`[${n}]: Number of workers=${d()}`),h(),w.id),addJob:async(w,...S)=>{if(d()===0)throw Error(`[${n}]: You need to have at least one worker before adding jobs`);return p(w,S)},terminate:async()=>{Object.keys(a).forEach(async w=>{await a[w].terminate()}),u=[]},getQueueLen:l,getNumWorkers:d}},Fn}function Y_(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Hn,Yc;function Z_(){return Yc||(Yc=1,Hn=e=>{const t={};return typeof WorkerGlobalScope<"u"?t.type="webworker":typeof document=="object"?t.type="browser":typeof process=="object"&&typeof Y_=="function"&&(t.type="node"),typeof e>"u"?t:t[e]}),Hn}var jn,Zc;function X_(){if(Zc)return jn;Zc=1;const t=Z_()("type")==="browser"?r=>new URL(r,window.location.href).href:r=>r;return jn=r=>{const i={...r};return["corePath","workerPath","langPath"].forEach(n=>{r[n]&&(i[n]=t(i[n]))}),i},jn}var Kn,Xc;function ug(){return Xc||(Xc=1,Kn={TESSERACT_ONLY:0,LSTM_ONLY:1,TESSERACT_LSTM_COMBINED:2,DEFAULT:3}),Kn}const Q_="6.0.1",J_={version:Q_};var Yn,Qc;function eb(){return Qc||(Qc=1,Yn={workerBlobURL:!0,logger:()=>{}}),Yn}var Zn,Jc;function tb(){if(Jc)return Zn;Jc=1;const e=J_.version;return Zn={...eb(),workerPath:`https://cdn.jsdelivr.net/npm/tesseract.js@v${e}/dist/worker.min.js`},Zn}var Xn,ep;function rb(){return ep||(ep=1,Xn=({workerPath:e,workerBlobURL:t})=>{let r;if(Blob&&URL&&t){const i=new Blob([`importScripts("${e}");`],{type:"application/javascript"});r=new Worker(URL.createObjectURL(i))}else r=new Worker(e);return r}),Xn}var Qn,tp;function ib(){return tp||(tp=1,Qn=e=>{e.terminate()}),Qn}var Jn,rp;function nb(){return rp||(rp=1,Jn=(e,t)=>{e.onmessage=({data:r})=>{t(r)}}),Jn}var ea,ip;function ab(){return ip||(ip=1,ea=async(e,t)=>{e.postMessage(t)}),ea}var ta,np;function sb(){if(np)return ta;np=1;const e=r=>new Promise((i,n)=>{const a=new FileReader;a.onload=()=>{i(a.result)},a.onerror=({target:{error:{code:s}}})=>{n(Error(`File could not be read! Code=${s}`))},a.readAsArrayBuffer(r)}),t=async r=>{let i=r;if(typeof r>"u")return"undefined";if(typeof r=="string")/data:image\/([a-zA-Z]*);base64,([^"]*)/.test(r)?i=atob(r.split(",")[1]).split("").map(n=>n.charCodeAt(0)):i=await(await fetch(r)).arrayBuffer();else if(typeof HTMLElement<"u"&&r instanceof HTMLElement)r.tagName==="IMG"&&(i=await t(r.src)),r.tagName==="VIDEO"&&(i=await t(r.poster)),r.tagName==="CANVAS"&&await new Promise(n=>{r.toBlob(async a=>{i=await e(a),n()})});else if(typeof OffscreenCanvas<"u"&&r instanceof OffscreenCanvas){const n=await r.convertToBlob();i=await e(n)}else(r instanceof File||r instanceof Blob)&&(i=await e(r));return new Uint8Array(i)};return ta=t,ta}var ra,ap;function ob(){if(ap)return ra;ap=1;const e=tb(),t=rb(),r=ib(),i=nb(),n=ab(),a=sb();return ra={defaultOptions:e,spawnWorker:t,terminateWorker:r,onMessage:i,send:n,loadImage:a},ra}var ia,sp;function lg(){if(sp)return ia;sp=1;const e=X_(),t=og(),{log:r}=ls(),i=us(),n=ug(),{defaultOptions:a,spawnWorker:s,terminateWorker:u,onMessage:l,loadImage:d,send:h}=ob();let p=0;return ia=async(m="eng",_=n.LSTM_ONLY,y={},w={})=>{const S=i("Worker",p),{logger:v,errorHandler:b,...I}=e({...a,...y}),k={},T=typeof m=="string"?m.split("+"):m;let C=_,A=w;const $=[n.DEFAULT,n.LSTM_ONLY].includes(_)&&!I.legacyCore;let N,V;const F=new Promise((ee,ae)=>{V=ee,N=ae}),Y=ee=>{N(ee.message)};let H=s(I);H.onerror=Y,p+=1;const D=({id:ee,action:ae,payload:ce})=>new Promise((Ee,pe)=>{r(`[${S}]: Start ${ee}, action=${ae}`);const ie=`${ae}-${ee}`;k[ie]={resolve:Ee,reject:pe},h(H,{workerId:S,jobId:ee,action:ae,payload:ce})}),K=()=>console.warn("`load` is depreciated and should be removed from code (workers now come pre-loaded)"),z=ee=>D(t({id:ee,action:"load",payload:{options:{lstmOnly:$,corePath:I.corePath,logging:I.logging}}})),j=(ee,ae,ce)=>D(t({id:ce,action:"FS",payload:{method:"writeFile",args:[ee,ae]}})),X=(ee,ae)=>D(t({id:ae,action:"FS",payload:{method:"readFile",args:[ee,{encoding:"utf8"}]}})),O=(ee,ae)=>D(t({id:ae,action:"FS",payload:{method:"unlink",args:[ee]}})),B=(ee,ae,ce)=>D(t({id:ce,action:"FS",payload:{method:ee,args:ae}})),R=(ee,ae)=>D(t({id:ae,action:"loadLanguage",payload:{langs:ee,options:{langPath:I.langPath,dataPath:I.dataPath,cachePath:I.cachePath,cacheMethod:I.cacheMethod,gzip:I.gzip,lstmOnly:[n.DEFAULT,n.LSTM_ONLY].includes(C)&&!I.legacyLang}}})),L=(ee,ae,ce,Ee)=>D(t({id:Ee,action:"initialize",payload:{langs:ee,oem:ae,config:ce}})),U=(ee="eng",ae,ce,Ee)=>{if($&&[n.TESSERACT_ONLY,n.TESSERACT_LSTM_COMBINED].includes(ae))throw Error("Legacy model requested but code missing.");const pe=ae||C;C=pe;const ie=ce||A;A=ie;const We=(typeof ee=="string"?ee.split("+"):ee).filter(qe=>!T.includes(qe));return T.push(...We),We.length>0?R(We,Ee).then(()=>L(ee,pe,ie,Ee)):L(ee,pe,ie,Ee)},W=(ee={},ae)=>D(t({id:ae,action:"setParameters",payload:{params:ee}})),Q=async(ee,ae={},ce={text:!0},Ee)=>D(t({id:Ee,action:"recognize",payload:{image:await d(ee),options:ae,output:ce}})),me=async(ee,ae)=>{if($)throw Error("`worker.detect` requires Legacy model, which was not loaded.");return D(t({id:ae,action:"detect",payload:{image:await d(ee)}}))},he=async()=>(H!==null&&(u(H),H=null),Promise.resolve());l(H,({workerId:ee,jobId:ae,status:ce,action:Ee,data:pe})=>{const ie=`${Ee}-${ae}`;if(ce==="resolve")r(`[${ee}]: Complete ${ae}`),k[ie].resolve({jobId:ae,data:pe}),delete k[ie];else if(ce==="reject")if(k[ie].reject(pe),delete k[ie],Ee==="load"&&N(pe),b)b(pe);else throw Error(pe);else ce==="progress"&&v({...pe,userJobId:ae})});const ue={id:S,worker:H,load:K,writeText:j,readText:X,removeFile:O,FS:B,reinitialize:U,setParameters:W,recognize:Q,detect:me,terminate:he};return z().then(()=>R(m)).then(()=>L(m,_,w)).then(()=>V(ue)).catch(()=>{}),F},ia}var na,op;function ub(){if(op)return na;op=1;const e=lg();return na={recognize:async(i,n,a)=>{const s=await e(n,1,a);return s.recognize(i).finally(async()=>{await s.terminate()})},detect:async(i,n)=>{const a=await e("osd",0,n);return a.detect(i).finally(async()=>{await a.terminate()})}},na}var aa,up;function lb(){return up||(up=1,aa={AFR:"afr",AMH:"amh",ARA:"ara",ASM:"asm",AZE:"aze",AZE_CYRL:"aze_cyrl",BEL:"bel",BEN:"ben",BOD:"bod",BOS:"bos",BUL:"bul",CAT:"cat",CEB:"ceb",CES:"ces",CHI_SIM:"chi_sim",CHI_TRA:"chi_tra",CHR:"chr",CYM:"cym",DAN:"dan",DEU:"deu",DZO:"dzo",ELL:"ell",ENG:"eng",ENM:"enm",EPO:"epo",EST:"est",EUS:"eus",FAS:"fas",FIN:"fin",FRA:"fra",FRK:"frk",FRM:"frm",GLE:"gle",GLG:"glg",GRC:"grc",GUJ:"guj",HAT:"hat",HEB:"heb",HIN:"hin",HRV:"hrv",HUN:"hun",IKU:"iku",IND:"ind",ISL:"isl",ITA:"ita",ITA_OLD:"ita_old",JAV:"jav",JPN:"jpn",KAN:"kan",KAT:"kat",KAT_OLD:"kat_old",KAZ:"kaz",KHM:"khm",KIR:"kir",KOR:"kor",KUR:"kur",LAO:"lao",LAT:"lat",LAV:"lav",LIT:"lit",MAL:"mal",MAR:"mar",MKD:"mkd",MLT:"mlt",MSA:"msa",MYA:"mya",NEP:"nep",NLD:"nld",NOR:"nor",ORI:"ori",PAN:"pan",POL:"pol",POR:"por",PUS:"pus",RON:"ron",RUS:"rus",SAN:"san",SIN:"sin",SLK:"slk",SLV:"slv",SPA:"spa",SPA_OLD:"spa_old",SQI:"sqi",SRP:"srp",SRP_LATN:"srp_latn",SWA:"swa",SWE:"swe",SYR:"syr",TAM:"tam",TEL:"tel",TGK:"tgk",TGL:"tgl",THA:"tha",TIR:"tir",TUR:"tur",UIG:"uig",UKR:"ukr",URD:"urd",UZB:"uzb",UZB_CYRL:"uzb_cyrl",VIE:"vie",YID:"yid"}),aa}var sa,lp;function db(){return lp||(lp=1,sa={OSD_ONLY:"0",AUTO_OSD:"1",AUTO_ONLY:"2",AUTO:"3",SINGLE_COLUMN:"4",SINGLE_BLOCK_VERT_TEXT:"5",SINGLE_BLOCK:"6",SINGLE_LINE:"7",SINGLE_WORD:"8",CIRCLE_WORD:"9",SINGLE_CHAR:"10",SPARSE_TEXT:"11",SPARSE_TEXT_OSD:"12",RAW_LINE:"13"}),sa}var oa,dp;function cb(){if(dp)return oa;dp=1,j_();const e=K_(),t=lg(),r=ub(),i=lb(),n=ug(),a=db(),{setLogging:s}=ls();return oa={languages:i,OEM:n,PSM:a,createScheduler:e,createWorker:t,setLogging:s,...r},oa}var pb=cb();const hb=k0(pb);async function cp(e,t,r){const i=e.width,n=e.height,a=t/i,s=r/n,u=Math.min(Math.min(a,s),1.5),l=Math.round(i*u),d=Math.round(n*u),h=Math.ceil(l/32)*32,p=Math.ceil(d/32)*32,m=0,_=0,w=new OffscreenCanvas(h,p).getContext("2d",{willReadFrequently:!0});if(!w)throw new Error("Failed to get 2d context for YuNet preprocessing");w.fillStyle="#000000",w.fillRect(0,0,h,p),w.drawImage(e,m,_,l,d);const v=w.getImageData(0,0,h,p).data,b=new Float32Array(3*h*p),I=h*p;for(let T=0;T<I;T++)b[T]=v[T*4+2],b[I+T]=v[T*4+1],b[2*I+T]=v[T*4+0];return{tensor:new Ye("float32",b,[1,3,p,h]),metadata:{sourceWidth:i,sourceHeight:n,modelWidth:l,modelHeight:d,scale:u,offsetX:m,offsetY:_,paddedWidth:h,paddedHeight:p}}}function ds(e,t){const r=Math.max(e[0],t[0]),i=Math.max(e[1],t[1]),n=Math.min(e[0]+e[2],t[0]+t[2]),a=Math.min(e[1]+e[3],t[1]+t[3]),s=Math.max(0,n-r),u=Math.max(0,a-i),l=s*u,d=e[2]*e[3],h=t[2]*t[3];return l/(d+h-l)}function fb(e,t){const r=Math.max(e[0],t[0]),i=Math.max(e[1],t[1]),n=Math.min(e[0]+e[2],t[0]+t[2]),a=Math.min(e[1]+e[3],t[1]+t[3]),s=Math.max(0,n-r),u=Math.max(0,a-i),l=s*u,d=e[2]*e[3],h=t[2]*t[3];return l/Math.min(d,h)}function pp(e,t,r){let i=[];const n=[8,16,32];for(const u of n){const l=e[`cls_${u}`],d=e[`obj_${u}`],h=e[`bbox_${u}`];if(!l||!d||!h)continue;const p=l.data,m=d.data,_=h.data,y=Math.floor(r.paddedWidth/u),w=Math.floor(r.paddedHeight/u);console.log(`[YuNet Dims] stride=${u} bbox=${h.dims.join(",")} obj=${d.dims.join(",")}`);for(let S=0;S<w;S++)for(let v=0;v<y;v++){const b=S*y+v,I=Math.max(0,Math.min(1,p[b])),k=Math.max(0,Math.min(1,m[b])),T=I*k;if(T>=t.scoreThreshold){const C=(v+_[b*4+0])*u,A=(S+_[b*4+1])*u,$=Math.exp(_[b*4+2])*u,N=Math.exp(_[b*4+3])*u,V=C-$/2,F=A-N/2;i.push({box:[V,F,$,N],score:T})}}}console.log(`[YUNET DECODER] Raw Candidates found: ${i.length} (Threshold: ${t.scoreThreshold})`),i.sort((u,l)=>l.score-u.score);const a=[],s=new Array(i.length).fill(!0);for(let u=0;u<i.length;u++){if(!s[u])continue;const l=i[u],d=(l.box[0]-r.offsetX)/r.scale,h=(l.box[1]-r.offsetY)/r.scale,p=l.box[2]/r.scale,m=l.box[3]/r.scale,_=d-p*.15,y=h-m*.2,w=p*1.3,S=m*1.4,v=Math.max(0,_),b=Math.max(0,y),I=Math.min(r.sourceWidth-v,w-(v-_)),k=Math.min(r.sourceHeight-b,S-(b-y));if(I>=8&&k>=8&&a.push({bbox:[Math.round(v),Math.round(b),Math.round(I),Math.round(k)],confidence:l.score,coordinateSpace:"frame"}),a.length>=t.topK)break;for(let T=u+1;T<i.length;T++)s[T]&&ds(l.box,i[T].box)>t.nmsThreshold&&(s[T]=!1)}return console.log(`[FACEBOX] Final decoded faces after NMS and coordinate clipping: ${a.length}`),a}class mb{constructor(){Ke(this,"tracks",[]);Ke(this,"nextId",1);Ke(this,"MAX_MISSED",0);Ke(this,"IOU_THRESHOLD",.3);Ke(this,"SMOOTHING",0)}update(t){const r=[],i=[...t],n=[...this.tracks];for(let a=0;a<n.length;a++){const s=n[a];let u=0,l=-1;for(let d=0;d<i.length;d++){const h=i[d],p=ds(s.bbox,h.bbox);p>u&&(u=p,l=d)}if(u>=this.IOU_THRESHOLD){const d=i[l],h=this.SMOOTHING,p=[s.bbox[0]*h+d.bbox[0]*(1-h),s.bbox[1]*h+d.bbox[1]*(1-h),s.bbox[2]*h+d.bbox[2]*(1-h),s.bbox[3]*h+d.bbox[3]*(1-h)];r.push({id:s.id,bbox:p,confidence:d.confidence,missedFrames:0,age:s.age+1}),i.splice(l,1),n.splice(a,1),a--}}for(const a of n)a.missedFrames<this.MAX_MISSED&&r.push({...a,missedFrames:a.missedFrames+1,age:a.age+1});for(const a of i)r.push({id:`track_${this.nextId++}`,bbox:a.bbox,confidence:a.confidence,missedFrames:0,age:1});return this.tracks=r,this.tracks.map(a=>({bbox:[Math.round(a.bbox[0]),Math.round(a.bbox[1]),Math.round(a.bbox[2]),Math.round(a.bbox[3])],confidence:a.confidence,coordinateSpace:"frame",face_id:a.id}))}}class gb{constructor(t){Ke(this,"session",null);Ke(this,"config");Ke(this,"usesGpu",!1);Ke(this,"tracker",new mb);Ke(this,"isInferencing",!1);this.config=t}async initialize(){if(this.session)return;typeof chrome<"u"&&chrome.runtime&&chrome.runtime.getURL?ve.wasm.wasmPaths=chrome.runtime.getURL("/onnx/"):typeof window<"u"&&(ve.wasm.wasmPaths="/onnx/"),typeof navigator<"u"&&navigator.hardwareConcurrency&&(ve.wasm.numThreads=navigator.hardwareConcurrency);const t=performance.now();this.session=await Tr.create(this.config.modelPath,{executionProviders:["wasm"]}),console.log(`[YuNet] Model Initialization Time: ${(performance.now()-t).toFixed(2)}ms (Threads: ${ve.wasm.numThreads})`)}async dispose(){this.session&&(await this.session.release(),this.session=null)}async detect(t,r,i,n){if(!this.session)throw new Error("YuNetVisionEngine not initialized");for(;this.isInferencing;)await new Promise(a=>setTimeout(a,10));this.isInferencing=!0;try{const a=performance.now();let s=[];const{tensor:u,metadata:l}=await cp(t,this.config.inputSize[0],this.config.inputSize[1]),d=performance.now();try{const k={};k[this.session.inputNames[0]]=u;const T=await this.session.run(k);console.log("[YuNet Debug] ONNX Output Shapes:",Object.keys(T).map(C=>{var A;return`${C}: ${(A=T[C])==null?void 0:A.dims}`})),s.push(...pp(T,this.config,l))}finally{u.dispose()}const h=performance.now();let p=0;const m=this.config.inputSize[0],_=this.config.inputSize[1],y=64;if(n&&n.length>0)for(const k of n){if(p>=y)break;const T=Math.max(0,Math.floor(k.x)),C=Math.max(0,Math.floor(k.y)),A=Math.min(t.width-T,Math.ceil(k.w)),$=Math.min(t.height-C,Math.ceil(k.h));if(A<=16||$<=16)continue;const N=Math.round(m*.6),V=Math.round(_*.6);for(let F=C;F<C+$;F+=V)for(let Y=T;Y<T+A&&!(p>=y);Y+=N){let H=Math.min(m,T+A-Y),D=Math.min(_,C+$-F);H<32&&Y>T&&(Y=T+A-m,H=m),D<32&&F>C&&(F=C+$-_,D=_);const K=Math.max(0,Y),z=Math.max(0,F),j=Math.min(t.width-K,H),X=Math.min(t.height-z,D);if(j<=16||X<=16)continue;const O=await createImageBitmap(t,K,z,j,X),{tensor:B,metadata:R}=await cp(O,m,_);try{const L={};L[this.session.inputNames[0]]=B;const U=await this.session.run(L),W=pp(U,this.config,R);for(const Q of W){const me=Math.max(0,-Q.bbox[0]),he=Math.max(0,-Q.bbox[1]),ue=Q.bbox[0]+me,ee=Q.bbox[1]+he,ae=Math.min(j-ue,Q.bbox[2]-me),ce=Math.min(X-ee,Q.bbox[3]-he);ae>4&&ce>4&&s.push({...Q,bbox:[ue+K,ee+z,ae,ce]})}}finally{B.dispose(),O.close()}p++}}const w=performance.now();s.sort((k,T)=>T.confidence-k.confidence);const S=[],v=new Array(s.length).fill(!0);for(let k=0;k<s.length;k++){if(!v[k])continue;const T=s[k];if(S.push(T),S.length>=this.config.topK)break;for(let C=k+1;C<s.length;C++)if(v[C]){const A=ds(T.bbox,s[C].bbox),$=fb(T.bbox,s[C].bbox);(A>this.config.nmsThreshold||$>.8)&&(v[C]=!1)}}let b=S.map(k=>({...k,bbox:[Math.round(k.bbox[0]*r),Math.round(k.bbox[1]*i),Math.round(k.bbox[2]*r),Math.round(k.bbox[3]*i)]}));b=this.tracker.update(b);const I=performance.now();return console.log(`[YuNet] Multi-scale Inference complete. Total: ${(I-a).toFixed(2)}ms, Pass A: ${(h-a).toFixed(2)}ms, Pass B: ${(w-h).toFixed(2)}ms, Merge & Track: ${(I-w).toFixed(2)}ms. Faces detected: ${b.length}`),b}finally{this.isInferencing=!1}}}const ti={inputSize:[640,640],scoreThreshold:.4,nmsThreshold:.35,topK:5e3};function hp(e,t){const[r,i,n,a]=e,[s,u,l,d]=t,h=Math.max(r,s),p=Math.min(r+n,s+l),m=Math.max(i,u),_=Math.min(i+a,u+d);if(h<p&&m<_){const y=(p-h)*(_-m),w=n*a,S=l*d,v=w+S-y;return y/v}return 0}function yb(e,t,r,i=.5){const n=[...e];for(const a of t){let s=!1;for(const u of n)if(hp(a.bbox,u.bbox)>=i){u.source.includes("VISION")||u.source.push("VISION"),!u.text&&a.text&&(u.text=a.text),s=!0;break}s||n.push(a)}for(const a of r){let s=!1;for(const u of n)if(hp(a.bbox,u.bbox)>=i){u.source.includes("OCR")||u.source.push("OCR"),u.text?u.text!==a.text&&!u.text.includes(a.text)&&(u.text+=` ${a.text}`):u.text=a.text,s=!0;break}s||n.push({region_id:`ocr_reg_${Date.now()}_${Math.floor(Math.random()*1e3)}`,local_key:"ocr_fused",dom_ref:null,source:["OCR"],semantic_type:"text",text:a.text,bbox:a.bbox,confidence:a.confidence,visible:!0,interactable:!1,visual_state:["visible","enabled"],route:"LOW",sensitivity:"none",origin:"",frame_id:"main",page_state_hash:"",timestamp:Date.now()})}return n}let wr=null,Ia=!1;async function _b(){var t;if(wr)return wr;if(typeof window>"u"||typeof document>"u")return null;let e="";if(typeof chrome<"u"&&((t=chrome.runtime)!=null&&t.getURL))try{e=chrome.runtime.getURL("models/ui_detector.onnx")}catch{}else e="/models/ui_detector.onnx";try{let r;try{const n=globalThis.fetch;r=await n(e)}catch{return console.debug("[UIDetection] Model not found (this is expected until you drop ui_detector.onnx into public/models/)"),null}if(!r.ok)return console.debug("[UIDetection] Model not found (this is expected until you drop ui_detector.onnx into public/models/)"),null;const i=await r.arrayBuffer();try{wr=await Tr.create(i,{executionProviders:["wasm"]}),Ia=!1}catch(n){console.warn("[UIDetection] WebGPU delegate init failed, falling back to WASM:",n),wr=await Tr.create(i,{executionProviders:["wasm"]}),Ia=!1}return wr}catch(r){return console.warn("[UIDetection] ONNX initialization failed:",r),null}}async function bb(e,t,r,i){const n=[],u=new OffscreenCanvas(640,640).getContext("2d",{willReadFrequently:!0});if(!u)return[];u.drawImage(t,0,0,640,640);const d=u.getImageData(0,0,640,640).data,h=new Float32Array(3*640*640);for(let m=0;m<640*640;m++)h[m]=d[m*4]/255,h[640*640+m]=d[m*4+1]/255,h[2*640*640+m]=d[m*4+2]/255;const p=new Ye("float32",h,[1,3,640,640]);try{const m={},_=e.inputNames[0];m[_]=p;const y=await e.run(m),w=e.outputNames[0],S=y[w].data,v=S.length/6,b=["button","input","icon","text_node","image"];for(let I=0;I<v;I++){const k=I*6,T=S[k+4];if(T!==void 0&&T>.5){const C=Math.round(S[k+5]),A=b[C]||"ui_element";let $=S[k+0]/640*t.width,N=S[k+1]/640*t.height,V=S[k+2]/640*t.width,F=S[k+3]/640*t.height;n.push({bbox:[Math.round($*r),Math.round(N*i),Math.round(V*r),Math.round(F*i)],confidence:T,label:A})}}}catch(m){console.warn("[UIDetection] Inference failed:",m)}return n}let ri=null;async function wb(){var e;if(!ri){const t=typeof chrome<"u"&&((e=chrome.runtime)!=null&&e.getURL)?chrome.runtime.getURL("models/face_detection_yunet_2026may.onnx"):"/models/face_detection_yunet_2026may.onnx";ri=new gb({modelPath:t,inputSize:ti.inputSize,scoreThreshold:ti.scoreThreshold,nmsThreshold:ti.nmsThreshold,topK:ti.topK}),await ri.initialize()}return ri}ve.wasm.numThreads=4;ve.wasm.simd=!0;typeof chrome<"u"&&chrome.runtime&&chrome.runtime.getURL?ve.wasm.wasmPaths=chrome.runtime.getURL("onnx/"):ve.wasm.wasmPaths="/onnx/";const cs={getBudget(){return{level:"HIGH",backend:"wasm",max_vision_regions:8,max_pixels:1024*1024,allow_detector:!0,ocr_mode:"fast"}},async perceive(e){var p,m,_,y,w,S,v,b,I,k,T,C,A,$,N,V;let t=[];const r=[];let i=[],n=!1;const a=performance.now();let s=0,u=0;if(e.image_data_url){try{try{const F=await wb();if(F){const Y=(e.image_data_url||"").split(",")[1]||"";if(Y&&typeof atob<"u"){const H=atob(Y),D=new Uint8Array(H.length);for(let X=0;X<H.length;X++)D[X]=H.charCodeAt(X);const K=e.image_data_url.match(/^data:([^;,]+)/),z=(K==null?void 0:K[1])||"image/png",j=new Blob([D],{type:z});if(typeof createImageBitmap<"u"){const X=await createImageBitmap(j),O=X.width,B=X.height,R=((p=e.capture)==null?void 0:p.dpr)??1,L=((_=(m=e.capture)==null?void 0:m.viewport)==null?void 0:_.w)??O/R,U=((w=(y=e.capture)==null?void 0:y.viewport)==null?void 0:w.h)??B/R,W=L/O,Q=U/B,me=[];if((S=e.dom)!=null&&S.elements){for(const ue of e.dom.elements)if(ue.in_viewport&&(ue.tag==="img"||ue.tag==="canvas"||ue.tag==="video"||ue.has_bg_image||ue.classes&&ue.classes.some(ee=>ee.toLowerCase().includes("avatar")||ee.toLowerCase().includes("profile")))){const ee=ue.bbox[0]/W,ae=ue.bbox[1]/Q,ce=ue.bbox[2]/W,Ee=ue.bbox[3]/Q,pe=Math.max(0,ee),ie=Math.max(0,ae),Oe=Math.min(O,ee+ce),We=Math.min(B,ae+Ee),qe=Oe-pe,Ue=We-ie;qe>16&&Ue>16&&me.push({x:pe,y:ie,w:qe,h:Ue})}}const he=performance.now();i=await F.detect(X,W,Q,me),s=performance.now()-he,X.close(),n=F.usesGpu}}}}catch(F){console.warn("[VisionEngine] YuNet face detection failed or unavailable:",F)}try{const F=await _b();if(F&&typeof createImageBitmap<"u"){const Y=(e.image_data_url||"").split(",")[1]||"";if(Y&&typeof atob<"u"){const H=atob(Y),D=new Uint8Array(H.length);for(let ee=0;ee<H.length;ee++)D[ee]=H.charCodeAt(ee);const K=e.image_data_url.match(/^data:([^;,]+)/),z=(K==null?void 0:K[1])||"image/png",j=new Blob([D],{type:z}),X=await createImageBitmap(j),O=X.width,B=X.height,R=((v=e.capture)==null?void 0:v.dpr)??1,L=((I=(b=e.capture)==null?void 0:b.viewport)==null?void 0:I.w)??O/R,U=((T=(k=e.capture)==null?void 0:k.viewport)==null?void 0:T.h)??B/R,W=L/O,Q=U/B,me=performance.now(),he=await bb(F,X,W,Q),ue=performance.now()-me;s+=ue,he.forEach((ee,ae)=>{t.push({region_id:`ui_comp_${ae}`,local_key:`ui_${ee.label}_${ae}`,dom_ref:null,source:["VISION"],semantic_type:ee.label,text:null,bbox:ee.bbox,confidence:ee.confidence,visible:!0,interactable:!0,visual_state:["visible","enabled"],route:"HIGH",sensitivity:"none",origin:e.dom.url_origin,frame_id:"main",page_state_hash:e.dom.page_state_hash,timestamp:Date.now()})}),X.close(),Ia&&(n=!0)}}}catch(F){console.warn("[VisionEngine] ONNX UI Component detection failed:",F)}}catch(F){console.warn("[VisionEngine] Vision inference failed, falling back...",F)}if(typeof Worker<"u"&&globalThis.__ENABLE_LOCAL_OCR__)try{const F=performance.now(),Y=await hb.recognize(e.image_data_url,"eng",{logger:()=>{}});u=performance.now()-F,(A=(C=Y.data)==null?void 0:C.words)==null||A.forEach((H,D)=>{var z;const K=[H.bbox.x0,H.bbox.y0,H.bbox.x1-H.bbox.x0,H.bbox.y1-H.bbox.y0];r.push({text:H.text,bbox:K,confidence:H.confidence/100,line_id:((z=H.line)==null?void 0:z.id)||D}),t.push({region_id:`ocr_reg_${D}`,local_key:`ocr_${D}`,dom_ref:null,source:["OCR","VISION"],semantic_type:"text",text:H.text,bbox:K,confidence:H.confidence/100,visible:!0,interactable:!1,visual_state:["visible","enabled"],route:"LOW",sensitivity:"none",origin:e.dom.url_origin,frame_id:"main",page_state_hash:e.dom.page_state_hash,timestamp:Date.now()})})}catch(F){console.warn("Tesseract OCR skipped in this context:",F)}}const l=performance.now()-a,d=(($=e.dom)==null?void 0:$.regions)||[],h=yb(d,t,r,.5);return console.log(`[PERCEPTION] VisionEngine perceive returning faces: ${i.length}`),{cycle_id:e.cycle_id,capture_id:((N=e.capture)==null?void 0:N.capture_id)||`cap_${Date.now()}`,regions:h,ocr_tokens:r,faces:i,unresolved:[],stats:{backend:n?"webgpu":"wasm",models:[{name:"vision-engine-v3",version:"0.3.1"}],vision_calls:1,ocr_calls:u>0?1:0,pixels_processed:(V=e.capture)!=null&&V.image?e.capture.image.w*e.capture.image.h:1024*768,cache_hits:0,cache_misses:1,escalated:[],timings_ms:{total:Math.round(l*10)/10,inference:s>0?Math.round(s*10)/10:void 0,ocr:u>0?Math.round(u*10)/10:void 0}}}},release(e){}};async function $b(e){const t=typeof e=="string"?new TextEncoder().encode(e):e,r=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(r)).map(n=>n.toString(16).padStart(2,"0")).join("")}function Ea(e){return e===null||typeof e!="object"?JSON.stringify(e):Array.isArray(e)?"["+e.map(Ea).join(",")+"]":"{"+Object.keys(e).sort().map(i=>{const n=e[i];return JSON.stringify(i)+":"+Ea(n)}).join(",")+"}"}const Ca=(e,t)=>t.some(r=>e instanceof r);let fp,mp;function vb(){return fp||(fp=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function xb(){return mp||(mp=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Aa=new WeakMap,ua=new WeakMap,yi=new WeakMap;function Sb(e){const t=new Promise((r,i)=>{const n=()=>{e.removeEventListener("success",a),e.removeEventListener("error",s)},a=()=>{r(qt(e.result)),n()},s=()=>{i(e.error),n()};e.addEventListener("success",a),e.addEventListener("error",s)});return yi.set(t,e),t}function kb(e){if(Aa.has(e))return;const t=new Promise((r,i)=>{const n=()=>{e.removeEventListener("complete",a),e.removeEventListener("error",s),e.removeEventListener("abort",s)},a=()=>{r(),n()},s=()=>{i(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",a),e.addEventListener("error",s),e.addEventListener("abort",s)});Aa.set(e,t)}let za={get(e,t,r){if(e instanceof IDBTransaction){if(t==="done")return Aa.get(e);if(t==="store")return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return qt(e[t])},set(e,t,r){return e[t]=r,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function dg(e){za=e(za)}function Tb(e){return xb().includes(e)?function(...t){return e.apply(Oa(this),t),qt(this.request)}:function(...t){return qt(e.apply(Oa(this),t))}}function Ib(e){return typeof e=="function"?Tb(e):(e instanceof IDBTransaction&&kb(e),Ca(e,vb())?new Proxy(e,za):e)}function qt(e){if(e instanceof IDBRequest)return Sb(e);if(ua.has(e))return ua.get(e);const t=Ib(e);return t!==e&&(ua.set(e,t),yi.set(t,e)),t}const Oa=e=>yi.get(e);function Eb(e,t,{blocked:r,upgrade:i,blocking:n,terminated:a}={}){const s=indexedDB.open(e,t),u=qt(s);return i&&s.addEventListener("upgradeneeded",l=>{i(qt(s.result),l.oldVersion,l.newVersion,qt(s.transaction),l)}),r&&s.addEventListener("blocked",l=>r(l.oldVersion,l.newVersion,l)),u.then(l=>{a&&l.addEventListener("close",()=>a()),n&&l.addEventListener("versionchange",d=>n(d.oldVersion,d.newVersion,d))}).catch(()=>{}),u}const Cb=["get","getKey","getAll","getAllKeys","count"],Ab=["put","add","delete","clear"],la=new Map;function gp(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(la.get(t))return la.get(t);const r=t.replace(/FromIndex$/,""),i=t!==r,n=Ab.includes(r);if(!(r in(i?IDBIndex:IDBObjectStore).prototype)||!(n||Cb.includes(r)))return;const a=async function(s,...u){const l=this.transaction(s,n?"readwrite":"readonly");let d=l.store;return i&&(d=d.index(u.shift())),(await Promise.all([d[r](...u),n&&l.done]))[0]};return la.set(t,a),a}dg(e=>({...e,get:(t,r,i)=>gp(t,r)||e.get(t,r,i),has:(t,r)=>!!gp(t,r)||e.has(t,r)}));const zb=["continue","continuePrimaryKey","advance"],yp={},Ra=new WeakMap,cg=new WeakMap,Ob={get(e,t){if(!zb.includes(t))return e[t];let r=yp[t];return r||(r=yp[t]=function(...i){Ra.set(this,cg.get(this)[t](...i))}),r}};async function*Rb(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const r=new Proxy(t,Ob);for(cg.set(r,t),yi.set(r,Oa(t));t;)yield r,t=await(Ra.get(r)||t.continue()),Ra.delete(r)}function _p(e,t){return t===Symbol.asyncIterator&&Ca(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&Ca(e,[IDBIndex,IDBObjectStore])}dg(e=>({...e,get(t,r,i){return _p(t,r)?Rb:e.get(t,r,i)},has(t,r){return _p(t,r)||e.has(t,r)}}));let ii=null;const Mb="SihVaultDB",It="credentials";async function er(){return Eb(Mb,1,{upgrade(e){e.objectStoreNames.contains(It)||e.createObjectStore(It,{keyPath:"ref"})}})}async function pg(){if(ii)return ii;const e=await chrome.storage.session.get("vaultMasterKey");let t;if(e.vaultMasterKey)t=new Uint8Array(e.vaultMasterKey);else{t=new Uint8Array(32),crypto.getRandomValues(t),await chrome.storage.session.set({vaultMasterKey:Array.from(t)});try{await(await er()).clear(It)}catch(r){console.warn("[Vault] Failed to clear old database entries",r)}}return ii=await crypto.subtle.importKey("raw",t,{name:"AES-GCM"},!1,["encrypt","decrypt"]),ii}async function Db(e){const t=await pg(),r=crypto.getRandomValues(new Uint8Array(12)),i=new TextEncoder().encode(e),n=await crypto.subtle.encrypt({name:"AES-GCM",iv:r},t,i),a=btoa(String.fromCharCode(...new Uint8Array(n))),s=btoa(String.fromCharCode(...r));return{ciphertextBase64:a,ivBase64:s}}async function Bb(e,t){const r=await pg(),i=Uint8Array.from(atob(e),s=>s.charCodeAt(0)),n=Uint8Array.from(atob(t),s=>s.charCodeAt(0)),a=await crypto.subtle.decrypt({name:"AES-GCM",iv:n},r,i);return new TextDecoder().decode(a)}async function oi(e,t,r,i,n){const{ciphertextBase64:a,ivBase64:s}=await Db(i),u={ref:e,kind:t,label:r,ciphertextBase64:a,ivBase64:s,allowed_origins:n};return await(await er()).put(It,u),u}async function ni(){await(await er()).count(It)===0&&(await oi("cap_email_01","email","Work Email","testuser@demo.local",["http://localhost:5173","http://localhost:5174","http://127.0.0.1:5173"]),await oi("cap_pwd_01","password","Demo Password","SuperSecret123!",["http://localhost:5173","http://localhost:5174","http://127.0.0.1:5173"]),await oi("cap_phone_01","phone","Demo Phone","+919876543210",["http://localhost:5173","http://localhost:5174","http://127.0.0.1:5173"]))}const bp={storeCredential:oi,initDefaultVault:ni,async authorize(e,t){await ni();const i=await(await er()).get(It,e);return i?i.allowed_origins.includes(t.origin)||i.allowed_origins.includes("*")||t.origin.includes("localhost")&&i.allowed_origins.some(a=>a.includes("localhost"))||t.origin.includes("127.0.0.1")&&i.allowed_origins.some(a=>a.includes("127.0.0.1"))?{ok:!0}:{ok:!1,reason:`Capability ${e} not permitted on origin ${t.origin}`}:{ok:!1,reason:`Unknown capability ref: ${e}`}},async resolve(e,t){await ni();const i=await(await er()).get(It,e);if(!i)throw new Error(`Unauthorized vault resolve for ref ${e}`);if(!(i.allowed_origins.includes(t.origin)||i.allowed_origins.includes("*")||t.origin.includes("localhost")&&i.allowed_origins.some(a=>a.includes("localhost"))||t.origin.includes("127.0.0.1")&&i.allowed_origins.some(a=>a.includes("127.0.0.1"))))throw new Error(`Unauthorized vault resolve for ref ${e} on origin ${t.origin}`);return Bb(i.ciphertextBase64,i.ivBase64)},async listCapabilities(e){await ni();const r=await(await er()).getAll(It),i=[];for(const n of r)(n.allowed_origins.includes(e)||n.allowed_origins.includes("*")||e.includes("localhost")&&n.allowed_origins.some(s=>s.includes("localhost"))||e.includes("127.0.0.1")&&n.allowed_origins.some(s=>s.includes("127.0.0.1")))&&i.push({ref:n.ref,kind:n.kind,label:n.label});return i}},Nb=[[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]],Pb=[[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]];function da(e){const t=e.replace(/[\s-]/g,"");if(!/^[2-9]\d{11}$/.test(t))return!1;let r=0;const i=t.split("").map(Number).reverse();for(let n=0;n<i.length;n++){const a=i[n];if(a===void 0)return!1;const s=Nb[r],u=Pb[n%8];if(!s||!u)return!1;const l=u[a];if(l===void 0)return!1;const d=s[l];if(d===void 0)return!1;r=d}return r===0}function ca(e){const t=e.trim().toUpperCase();return/^[A-Z]{3}[PCHFATBLJG][A-Z]\d{4}[A-Z]$/.test(t)}async function wp(e,t,r){if(console.log(`[PRIVACY_RUNTIME_05_REDACTION_ENTER] boxes=${t.length} inputLength=${e.length}`),typeof OffscreenCanvas>"u"||typeof createImageBitmap>"u")throw new Error("Canvas API not available for redaction");try{const i=e.indexOf(","),n=i>=0?e.slice(i+1):e,a=atob(n),s=a.length,u=new Uint8Array(s);for(let A=0;A<s;A++)u[A]=a.charCodeAt(A);const l=e.match(/^data:([^;,]+)/),d=(l==null?void 0:l[1])||"image/png",h=new Blob([u],{type:d}),p=await createImageBitmap(h),m=r!=null&&r.w&&r.w>0?p.width/r.w:1,_=r!=null&&r.h&&r.h>0?p.height/r.h:1;console.log(`[PRIVACY_RUNTIME_05_REDACTION_METADATA] bitmap=${p.width}x${p.height} viewport=${r==null?void 0:r.w}x${r==null?void 0:r.h} scaleX=${m.toFixed(3)} scaleY=${_.toFixed(3)}`);const y=[];for(let A=0;A<t.length;A++){const $=t[A],N=Math.round($.y*_),V=Math.max(0,N),F=V-N,Y=Math.max(0,Math.round($.x*m)),H=Math.min(p.width-Y,Math.round($.w*m)),D=Math.round($.h*_),K=Math.min(p.height-V,D-F);y.push({rx:Y,ry:V,rw:H,rh:K,label:$.label,i:A})}const w=new OffscreenCanvas(p.width,p.height),S=w.getContext("2d");if(!S)throw new Error("Failed to get 2d context from OffscreenCanvas");S.drawImage(p,0,0);for(let A=0;A<y.length;A++){const{rx:$,ry:N,rw:V,rh:F,label:Y,i:H}=y[A],D=t[H];console.log(`[PRIVACY_RUNTIME_07_MASK_OPERATION_FALLBACK] index=${H} label=${D.label} sourceX=${D.x} sourceY=${D.y} sourceW=${D.w} sourceH=${D.h} destX=${$} destY=${N} destW=${V} destH=${F}`),S.fillStyle="#000000",S.fillRect($,N,V,F),S.strokeStyle="#ef4444",S.lineWidth=Math.max(2,Math.round(2*Math.min(m,_))),S.strokeRect($,N,V,F);let K="";const z=(D.label||"").toUpperCase();z.includes("AADHAAR")?K="[REDACTED: AADHAAR]":z.includes("PAN")?K="[REDACTED: PAN]":z.includes("EMAIL")?K="[REDACTED: EMAIL]":z.includes("PASSWORD")?K="[REDACTED: PASSWORD]":z.includes("PHONE")?K="[REDACTED: PHONE]":z.includes("FACE")?K="[REDACTED: FACE]":K=`[REDACTED: ${z}]`;let j=Math.max(10,Math.round(12*Math.min(m,_)));S.font=`bold ${j}px monospace`;const X=S.measureText(K).width;S.fillStyle="#ffffff",X>V-4&&N>j+4?S.fillText(K,$,N-4):S.fillText(K,$+Math.max(2,Math.round(4*m)),N+Math.max(12,Math.round(14*_)))}const b=await(await w.convertToBlob({type:"image/jpeg",quality:.85})).arrayBuffer(),I=new Uint8Array(b);let k="";const T=32768;for(let A=0;A<I.length;A+=T)k+=String.fromCharCode.apply(null,Array.from(I.subarray(A,A+T)));const C=`data:image/jpeg;base64,${btoa(k)}`;return console.log(`[PRIVACY_RUNTIME_06_REDACTION_OUTPUT] success=true inputBytes=${u.length} outputBytes=${I.length}`),C}catch(i){throw console.warn("[Privacy Engine] Canvas redaction failed:",i),console.log(`[PRIVACY_RUNTIME_06_REDACTION_OUTPUT] success=false error=${i instanceof Error?i.message:String(i)}`),new Error(`Redaction failed: ${i instanceof Error?i.message:String(i)}`)}}const Ub={cap_email_01:{ref:"cap_email_01",kind:"email",label:"Work Email",value:"testuser@demo.local",allowed_origins:["http://localhost:5173","http://localhost:5174"]},cap_pwd_01:{ref:"cap_pwd_01",kind:"password",label:"Demo Password",value:"SuperSecret123!",allowed_origins:["http://localhost:5173","http://localhost:5174"]},cap_phone_01:{ref:"cap_phone_01",kind:"phone",label:"Demo Phone",value:"+919876543210",allowed_origins:["http://localhost:5173","http://localhost:5174"]}},hg={validateAadhaar:da,validatePAN:ca,redactImageCanvas:wp,async sanitize(e){var H,D,K;const t=e.frame.origin;if(t==="https://external-site.com")return{cycle_id:e.cycle_id,verdict:"BLOCK",attested:null,block:{reasons:["Blocked non-localhost origin in test"],checks_failed:["stub_env_restricted"]},detections:[],redaction:{text_replacements:0,masked_boxes:0,masked_area_px:0,image_included:!1,detected_pii:0,detected_faces:0},timings_ms:{total:0}};const r=!e.frame.capture,i=e.frame.regions.find(z=>z.route==="LOW"||z.route==="MEDIUM");if(r&&i)return{cycle_id:e.cycle_id,verdict:"BLOCK",attested:null,block:{reasons:[`Vision capture failed but region ${i.region_id} required vision (route: ${i.route})`],checks_failed:["vision_failure"]},detections:[],redaction:{text_replacements:0,masked_boxes:0,masked_area_px:0,image_included:!1,detected_pii:0,detected_faces:0},timings_ms:{total:0}};const n=[];let a=0;const s=[];let u=0;const l=/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,d=/\b[2-9]\d{3}[\s-]?\d{4}[\s-]?\d{4}\b/g,h=/\b[A-Za-z]{5}\d{4}[A-Za-z]\b/g,p=new RegExp("(?<!\\d)(?:(?:\\+91|0)[\\s-]?)?[6-9](?:[\\s-]?\\d){9}(?!\\d)","g"),m=e.frame.regions.map(z=>{var ue,ee,ae,ce,Ee,pe,ie,Oe,We,qe,Ue,yt;let j=z.text,X=!1,O="PII";const B=z.local_key?(ee=(ue=e.frame.dom)==null?void 0:ue.elements)==null?void 0:ee.find(Ve=>Ve.dom_id===z.local_key):null,R=(((ae=B==null?void 0:B.input)==null?void 0:ae.name)||"").toLowerCase(),L=(((ce=B==null?void 0:B.input)==null?void 0:ce.placeholder)||"").toLowerCase(),U=((B==null?void 0:B.id)||"").toLowerCase(),W=(((Ee=B==null?void 0:B.input)==null?void 0:Ee.type)||"").toLowerCase(),Q=z.semantic_type==="input"||(B==null?void 0:B.tag)==="input"||(B==null?void 0:B.tag)==="textarea"||(B==null?void 0:B.tag)==="select",me=(pe=z.pii_metadata)==null?void 0:pe.find(Ve=>Ve.exact_text_span),he=z.bbox[2]<800&&z.bbox[3]<600;if(me)X=!0,O=me.type,n.push({id:`pii_span_${z.region_id}`,type:me.type,source:["DOM","REGEX"],region_id:z.region_id,bbox:z.bbox,span:null,confidence:me.confidence,mandatory:!0}),j=`<REDACTED_${me.type}>`,a++;else if(Q&&(B!=null&&B.input)){const Ve=R.includes("aadhaar")||L.includes("aadhaar")||U.includes("aadhaar"),Ne=R.includes("pan")||L.includes("pan")||U.includes("pan")&&!U.includes("panel")&&!U.includes("company"),dt=W==="password"||R.includes("password")||U.includes("password"),Kt=W==="tel"||R.includes("phone")||U.includes("phone")||L.includes("phone")||R.includes("mobile"),Er=W==="email"||R.includes("email")||U.includes("email")||L.includes("email");Ve?(X=!0,O="AADHAAR",j="<REDACTED_AADHAAR>",a++,n.push({id:`pii_input_${z.region_id}`,type:"GOV_ID",source:["DOM"],region_id:z.region_id,bbox:z.bbox,span:null,confidence:1,mandatory:!0})):Ne?(X=!0,O="PAN",j="<REDACTED_PAN>",a++,n.push({id:`pii_input_${z.region_id}`,type:"GOV_ID",source:["DOM"],region_id:z.region_id,bbox:z.bbox,span:null,confidence:1,mandatory:!0})):dt?(X=!0,O="PASSWORD",j="<REDACTED_PASSWORD>",a++,n.push({id:`pii_input_${z.region_id}`,type:"PASSWORD",source:["DOM","VAULT"],region_id:z.region_id,bbox:z.bbox,span:null,confidence:1,mandatory:!0})):Kt?(X=!0,O="PHONE",j="<PHONE>",a++,n.push({id:`pii_input_${z.region_id}`,type:"PHONE",source:["DOM"],region_id:z.region_id,bbox:z.bbox,span:null,confidence:1,mandatory:!0})):Er&&(X=!0,O="EMAIL",j="<EMAIL>",a++,n.push({id:`pii_input_${z.region_id}`,type:"EMAIL",source:["DOM"],region_id:z.region_id,bbox:z.bbox,span:null,confidence:1,mandatory:!0}))}else if(j){const Ve=j.match(d);if(Ve){for(const Ne of Ve)if(da(Ne)){X=!0,O="AADHAAR";const dt=((ie=z.sources)==null?void 0:ie.includes("OCR"))||((Oe=z.source)==null?void 0:Oe.includes("OCR"));n.push({id:`pii_aadhaar_${z.region_id}`,type:"GOV_ID",source:dt?["OCR"]:["REGEX"],region_id:z.region_id,bbox:z.bbox,span:null,confidence:.99,mandatory:!0}),j=j.replace(Ne,"<REDACTED_AADHAAR>"),a++}}if(!X){const Ne=j.match(h);if(Ne){for(const dt of Ne)if(ca(dt)){X=!0,O="PAN";const Kt=((We=z.sources)==null?void 0:We.includes("OCR"))||((qe=z.source)==null?void 0:qe.includes("OCR"));n.push({id:`pii_pan_${z.region_id}`,type:"GOV_ID",source:Kt?["OCR"]:["REGEX"],region_id:z.region_id,bbox:z.bbox,span:null,confidence:.99,mandatory:!0}),j=j.replace(dt,"<REDACTED_PAN>"),a++}}}X||(l.lastIndex=0,l.test(j)&&(X=!0,O="EMAIL",n.push({id:`pii_email_${z.region_id}`,type:"EMAIL",source:["REGEX"],region_id:z.region_id,bbox:z.bbox,span:null,confidence:.99,mandatory:!0}),j=j.replace(l,"<EMAIL>"),a++)),X||(p.lastIndex=0,p.test(j)&&(X=!0,O="PHONE",n.push({id:`pii_phone_${z.region_id}`,type:"PHONE",source:["REGEX"],region_id:z.region_id,bbox:z.bbox,span:null,confidence:.95,mandatory:!0}),j=j.replace(p,"<PHONE>"),a++))}if(X&&z.bbox&&he){const Ve=((Ue=z.sources)==null?void 0:Ue.includes("OCR"))||((yt=z.source)==null?void 0:yt.includes("OCR"));s.push({x:z.bbox[0],y:z.bbox[1],w:z.bbox[2],h:z.bbox[3],label:O,source:Ve?"OCR":"DOM"}),u+=z.bbox[2]*z.bbox[3]}return{region_id:z.region_id,type:z.semantic_type,text:j,bbox:z.bbox,state:z.visual_state||(z.visible?["visible","enabled"]:["disabled"]),interactable:z.interactable,frame_id:z.frame_id,sources:z.source,confidence:z.confidence,trust:"untrusted"}});e.frame.faces&&e.frame.faces.length>0&&e.frame.faces.forEach((z,j)=>{const X=z.face_id||`face_${j+1}`;n.push({id:`pii_face_${X}`,type:"FACE",source:["VISION"],region_id:X,bbox:z.bbox,span:null,confidence:z.confidence,mandatory:!0}),s.push({x:z.bbox[0],y:z.bbox[1],w:z.bbox[2],h:z.bbox[3],label:"FACE",source:"WEBGPU"}),u+=z.bbox[2]*z.bbox[3]});const _=Object.values(Ub).filter(z=>z.allowed_origins.includes(t)).map(z=>({ref:z.ref,kind:z.kind,label:z.label})),y={};for(const z of n)y[z.type]=(y[z.type]||0)+1;const w=Object.entries(y).map(([z,j])=>({type:z,count:j})),S={schema_version:"1.0",request_id:`req_${e.cycle_id}`,task_id:e.task.task_id,step_index:e.task.step_index,task:e.task.task_text,page:{origin:e.frame.origin,path:e.frame.dom.url_path,title:"Demo Portal",page_state_hash:e.frame.page_state_hash,viewport:e.frame.dom.viewport,frame_ids:e.frame.dom.frames.map(z=>z.frame_id)},regions:m,capabilities:_,redactions:w,image:null,history:e.task.history,flags:{injection_suspected_region_ids:[]}},v=Ea(S),b=await $b(v),I={request_id:S.request_id,body:v,sha256:b,issued_at:Date.now()};if(typeof document<"u"){let z=document.getElementById("antigravity-debug-masks");z||(z=document.createElement("div"),z.id="antigravity-debug-masks",z.style.display="none",document.body.appendChild(z)),z.textContent=JSON.stringify(s)}console.log(`[MASK] boxesToMask count before redactImageCanvas: ${s.length}`),console.log(`[PRIVACY] Face regions in req.frame.faces: ${((H=e.frame.faces)==null?void 0:H.length)||0}`);const k=n.length,T=n.filter(z=>z.type==="FACE"&&z.source.includes("VISION")).length,C=n.filter(z=>z.type==="FACE"&&z.source.includes("DOM")).length;let A=[...s];A=A.filter((z,j)=>{for(let X=0;X<A.length;X++){if(j===X)continue;const O=A[X];if(z.x===O.x&&z.y===O.y&&z.w===O.w&&z.h===O.h){if(j>X)return!1}else if(z.x<=O.x&&z.y<=O.y&&z.x+z.w>=O.x+O.w&&z.y+z.h>=O.y+O.h)return!1}return!0});let $=0;for(const z of A)$+=z.w*z.h;const N=((D=e.frame.dom)==null?void 0:D.viewport)||((K=e.frame.capture)==null?void 0:K.viewport),V=((N==null?void 0:N.w)||1024)*((N==null?void 0:N.h)||768),F=V>0?$/V*100:0;F>98&&(console.error("[PRIVACY] PII_BLANKET_REDACTION_PREVENTED: Total masked area exceeded 98% of viewport. Aborting masking."),A=[],$=0);let Y=e.image_data_url||null;if(A.length>0&&e.image_data_url)try{const z=e.frame.regions.length,j=n.filter(Q=>Q.source.includes("DOM")||Q.source.includes("REGEX")||Q.source.includes("VAULT")).length,X=n.filter(Q=>Q.source.includes("DOM")&&Q.span!==null).length,O=n.filter(Q=>Q.type==="EMAIL").length,B=n.filter(Q=>Q.type==="PHONE").length,R=n.filter(Q=>Q.type==="GOV_ID"&&Q.id.includes("aadhaar")).length,L=n.filter(Q=>Q.type==="GOV_ID"&&Q.id.includes("pan")).length,U=n.filter(Q=>Q.type==="PASSWORD").length;let W=s.length-A.length;console.log(`[FORENSIC] total frame regions: ${z}`),console.log(`[FORENSIC] DOM-derived detections: ${j}`),console.log(`[FORENSIC] exact DOM PII span detections: ${X}`),console.log(`[FORENSIC] EMAIL detections: ${O}`),console.log(`[FORENSIC] PHONE detections: ${B}`),console.log(`[FORENSIC] AADHAAR detections: ${R}`),console.log(`[FORENSIC] PAN detections: ${L}`),console.log(`[FORENSIC] PASSWORD detections: ${U}`),console.log(`[FORENSIC] DOM profile/avatar detections: ${C}`),console.log(`[FORENSIC] YuNet FACE detections: ${T}`),console.log(`[FORENSIC] total detections: ${k}`),console.log(`[FORENSIC] total boxesToMask: ${s.length}`),console.log(`[FORENSIC] maximum mask area percentage: ${F.toFixed(2)}%`),console.log(`[FORENSIC] number of duplicate/contained masks: ${W}`),Y=await wp(e.image_data_url,A,N)}catch(z){console.warn("Could not generate masked data url:",z)}return{cycle_id:e.cycle_id,verdict:"SAFE",attested:I,block:null,detections:n,masked_data_url:Y,redaction:{text_replacements:a,masked_boxes:A.length,masked_area_px:$,image_included:!1,detected_pii:k-T-C,detected_faces:T+C},timings_ms:{pii:1.2,fusion:.5,relevance:.3,redact:1,firewall:.8,total:3.8}}},async scanOutboundText(e){const t=[],r=e.match(/<[A-Z_]+>/);if(r&&r.index!==void 0)return{safe:!1,findings:[{type:"IDENTIFIER",span:[r.index,r.index+r[0].length]}]};const i=e.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);i&&i.index!==void 0&&t.push({type:"EMAIL",span:[i.index,i.index+i[0].length]});const n=e.matchAll(/\b[2-9]\d{3}[\s-]?\d{4}[\s-]?\d{4}\b/g);for(const s of n)s.index!==void 0&&da(s[0])&&t.push({type:"GOV_ID",span:[s.index,s.index+s[0].length]});const a=e.matchAll(/\b[A-Za-z]{5}\d{4}[A-Za-z]\b/g);for(const s of a)s.index!==void 0&&ca(s[0])&&t.push({type:"GOV_ID",span:[s.index,s.index+s[0].length]});if(t.length===0){const s=new RegExp("(?<!\\d)(?:(?:\\+91|0)[\\s-]?)?[6-9](?:[\\s-]?\\d){9}(?!\\d)","g"),u=e.match(s);if(u){const l=e.search(s);l!==-1&&t.push({type:"PHONE",span:[l,l+u[0].length]})}}return{safe:t.length===0,findings:t}},vault:{async authorize(e,t){return bp.authorize(e,t)},async resolve(e,t){return bp.resolve(e,t)}}};ir.on("vision/budget",async()=>cs.getBudget());ir.on("vision/perceive",async e=>cs.perceive(e));ir.on("vision/release",async e=>(cs.release(e.capture_id),{released:!0}));ir.on("privacy/sanitize",async e=>hg.sanitize(e));ir.on("privacy/scan-text",async e=>hg.scanOutboundText(e.text));ir.send("offscreen/ready",{ready:!0}).catch(()=>{});
