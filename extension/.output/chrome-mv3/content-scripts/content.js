var content = (function() {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  function defineContentScript(definition2) {
    return definition2;
  }
  function stageError(code, stage, message, retryable = false, detail) {
    return { code, stage, message, retryable, detail };
  }
  content;
  content;
  content;
  content;
  content;
  content;
  content;
  content;
  content;
  content;
  function roundBBoxToStep(bbox, step = 4) {
    return [
      Math.round(bbox[0] / step) * step,
      Math.round(bbox[1] / step) * step,
      Math.round(bbox[2] / step) * step,
      Math.round(bbox[3] / step) * step
    ];
  }
  content;
  var util;
  (function(util2) {
    util2.assertEqual = (_) => {
    };
    function assertIs(_arg) {
    }
    util2.assertIs = assertIs;
    function assertNever(_x) {
      throw new Error();
    }
    util2.assertNever = assertNever;
    util2.arrayToEnum = (items) => {
      const obj = {};
      for (const item of items) {
        obj[item] = item;
      }
      return obj;
    };
    util2.getValidEnumValues = (obj) => {
      const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
      const filtered = {};
      for (const k of validKeys) {
        filtered[k] = obj[k];
      }
      return util2.objectValues(filtered);
    };
    util2.objectValues = (obj) => {
      return util2.objectKeys(obj).map(function(e) {
        return obj[e];
      });
    };
    util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
      const keys = [];
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          keys.push(key);
        }
      }
      return keys;
    };
    util2.find = (arr, checker) => {
      for (const item of arr) {
        if (checker(item))
          return item;
      }
      return void 0;
    };
    util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
      return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
    }
    util2.joinValues = joinValues;
    util2.jsonStringifyReplacer = (_, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    };
  })(util || (util = {}));
  var objectUtil;
  (function(objectUtil2) {
    objectUtil2.mergeShapes = (first, second) => {
      return {
        ...first,
        ...second
        // second overwrites first
      };
    };
  })(objectUtil || (objectUtil = {}));
  const ZodParsedType = util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set"
  ]);
  const getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
      case "undefined":
        return ZodParsedType.undefined;
      case "string":
        return ZodParsedType.string;
      case "number":
        return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
      case "boolean":
        return ZodParsedType.boolean;
      case "function":
        return ZodParsedType.function;
      case "bigint":
        return ZodParsedType.bigint;
      case "symbol":
        return ZodParsedType.symbol;
      case "object":
        if (Array.isArray(data)) {
          return ZodParsedType.array;
        }
        if (data === null) {
          return ZodParsedType.null;
        }
        if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
          return ZodParsedType.promise;
        }
        if (typeof Map !== "undefined" && data instanceof Map) {
          return ZodParsedType.map;
        }
        if (typeof Set !== "undefined" && data instanceof Set) {
          return ZodParsedType.set;
        }
        if (typeof Date !== "undefined" && data instanceof Date) {
          return ZodParsedType.date;
        }
        return ZodParsedType.object;
      default:
        return ZodParsedType.unknown;
    }
  };
  const ZodIssueCode = util.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite"
  ]);
  class ZodError extends Error {
    get errors() {
      return this.issues;
    }
    constructor(issues) {
      super();
      this.issues = [];
      this.addIssue = (sub) => {
        this.issues = [...this.issues, sub];
      };
      this.addIssues = (subs = []) => {
        this.issues = [...this.issues, ...subs];
      };
      const actualProto = new.target.prototype;
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(this, actualProto);
      } else {
        this.__proto__ = actualProto;
      }
      this.name = "ZodError";
      this.issues = issues;
    }
    format(_mapper) {
      const mapper = _mapper || function(issue) {
        return issue.message;
      };
      const fieldErrors = { _errors: [] };
      const processError = (error) => {
        for (const issue of error.issues) {
          if (issue.code === "invalid_union") {
            issue.unionErrors.map(processError);
          } else if (issue.code === "invalid_return_type") {
            processError(issue.returnTypeError);
          } else if (issue.code === "invalid_arguments") {
            processError(issue.argumentsError);
          } else if (issue.path.length === 0) {
            fieldErrors._errors.push(mapper(issue));
          } else {
            let curr = fieldErrors;
            let i = 0;
            while (i < issue.path.length) {
              const el = issue.path[i];
              const terminal = i === issue.path.length - 1;
              if (!terminal) {
                curr[el] = curr[el] || { _errors: [] };
              } else {
                curr[el] = curr[el] || { _errors: [] };
                curr[el]._errors.push(mapper(issue));
              }
              curr = curr[el];
              i++;
            }
          }
        }
      };
      processError(this);
      return fieldErrors;
    }
    static assert(value) {
      if (!(value instanceof ZodError)) {
        throw new Error(`Not a ZodError: ${value}`);
      }
    }
    toString() {
      return this.message;
    }
    get message() {
      return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
      return this.issues.length === 0;
    }
    flatten(mapper = (issue) => issue.message) {
      const fieldErrors = {};
      const formErrors = [];
      for (const sub of this.issues) {
        if (sub.path.length > 0) {
          const firstEl = sub.path[0];
          fieldErrors[firstEl] = fieldErrors[firstEl] || [];
          fieldErrors[firstEl].push(mapper(sub));
        } else {
          formErrors.push(mapper(sub));
        }
      }
      return { formErrors, fieldErrors };
    }
    get formErrors() {
      return this.flatten();
    }
  }
  ZodError.create = (issues) => {
    const error = new ZodError(issues);
    return error;
  };
  const errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        if (issue.received === ZodParsedType.undefined) {
          message = "Required";
        } else {
          message = `Expected ${issue.expected}, received ${issue.received}`;
        }
        break;
      case ZodIssueCode.invalid_literal:
        message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
        break;
      case ZodIssueCode.unrecognized_keys:
        message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
        break;
      case ZodIssueCode.invalid_union:
        message = `Invalid input`;
        break;
      case ZodIssueCode.invalid_union_discriminator:
        message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
        break;
      case ZodIssueCode.invalid_enum_value:
        message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
        break;
      case ZodIssueCode.invalid_arguments:
        message = `Invalid function arguments`;
        break;
      case ZodIssueCode.invalid_return_type:
        message = `Invalid function return type`;
        break;
      case ZodIssueCode.invalid_date:
        message = `Invalid date`;
        break;
      case ZodIssueCode.invalid_string:
        if (typeof issue.validation === "object") {
          if ("includes" in issue.validation) {
            message = `Invalid input: must include "${issue.validation.includes}"`;
            if (typeof issue.validation.position === "number") {
              message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
            }
          } else if ("startsWith" in issue.validation) {
            message = `Invalid input: must start with "${issue.validation.startsWith}"`;
          } else if ("endsWith" in issue.validation) {
            message = `Invalid input: must end with "${issue.validation.endsWith}"`;
          } else {
            util.assertNever(issue.validation);
          }
        } else if (issue.validation !== "regex") {
          message = `Invalid ${issue.validation}`;
        } else {
          message = "Invalid";
        }
        break;
      case ZodIssueCode.too_small:
        if (issue.type === "array")
          message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
        else if (issue.type === "string")
          message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
        else if (issue.type === "number")
          message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
        else if (issue.type === "bigint")
          message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
        else if (issue.type === "date")
          message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
        else
          message = "Invalid input";
        break;
      case ZodIssueCode.too_big:
        if (issue.type === "array")
          message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
        else if (issue.type === "string")
          message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
        else if (issue.type === "number")
          message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
        else if (issue.type === "bigint")
          message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
        else if (issue.type === "date")
          message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
        else
          message = "Invalid input";
        break;
      case ZodIssueCode.custom:
        message = `Invalid input`;
        break;
      case ZodIssueCode.invalid_intersection_types:
        message = `Intersection results could not be merged`;
        break;
      case ZodIssueCode.not_multiple_of:
        message = `Number must be a multiple of ${issue.multipleOf}`;
        break;
      case ZodIssueCode.not_finite:
        message = "Number must be finite";
        break;
      default:
        message = _ctx.defaultError;
        util.assertNever(issue);
    }
    return { message };
  };
  let overrideErrorMap = errorMap;
  function getErrorMap() {
    return overrideErrorMap;
  }
  const makeIssue = (params) => {
    const { data, path, errorMaps, issueData } = params;
    const fullPath = [...path, ...issueData.path || []];
    const fullIssue = {
      ...issueData,
      path: fullPath
    };
    if (issueData.message !== void 0) {
      return {
        ...issueData,
        path: fullPath,
        message: issueData.message
      };
    }
    let errorMessage = "";
    const maps = errorMaps.filter((m) => !!m).slice().reverse();
    for (const map of maps) {
      errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
    }
    return {
      ...issueData,
      path: fullPath,
      message: errorMessage
    };
  };
  function addIssueToContext(ctx, issueData) {
    const overrideMap = getErrorMap();
    const issue = makeIssue({
      issueData,
      data: ctx.data,
      path: ctx.path,
      errorMaps: [
        ctx.common.contextualErrorMap,
        // contextual error map is first priority
        ctx.schemaErrorMap,
        // then schema-bound map if available
        overrideMap,
        // then global override map
        overrideMap === errorMap ? void 0 : errorMap
        // then global default map
      ].filter((x) => !!x)
    });
    ctx.common.issues.push(issue);
  }
  class ParseStatus {
    constructor() {
      this.value = "valid";
    }
    dirty() {
      if (this.value === "valid")
        this.value = "dirty";
    }
    abort() {
      if (this.value !== "aborted")
        this.value = "aborted";
    }
    static mergeArray(status, results) {
      const arrayValue = [];
      for (const s of results) {
        if (s.status === "aborted")
          return INVALID;
        if (s.status === "dirty")
          status.dirty();
        arrayValue.push(s.value);
      }
      return { status: status.value, value: arrayValue };
    }
    static async mergeObjectAsync(status, pairs) {
      const syncPairs = [];
      for (const pair of pairs) {
        const key = await pair.key;
        const value = await pair.value;
        syncPairs.push({
          key,
          value
        });
      }
      return ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
      const finalObject = {};
      for (const pair of pairs) {
        const { key, value } = pair;
        if (key.status === "aborted")
          return INVALID;
        if (value.status === "aborted")
          return INVALID;
        if (key.status === "dirty")
          status.dirty();
        if (value.status === "dirty")
          status.dirty();
        if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
          finalObject[key.value] = value.value;
        }
      }
      return { status: status.value, value: finalObject };
    }
  }
  const INVALID = Object.freeze({
    status: "aborted"
  });
  const DIRTY = (value) => ({ status: "dirty", value });
  const OK = (value) => ({ status: "valid", value });
  const isAborted = (x) => x.status === "aborted";
  const isDirty = (x) => x.status === "dirty";
  const isValid = (x) => x.status === "valid";
  const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
  var errorUtil;
  (function(errorUtil2) {
    errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
    errorUtil2.toString = (message) => typeof message === "string" ? message : message == null ? void 0 : message.message;
  })(errorUtil || (errorUtil = {}));
  class ParseInputLazyPath {
    constructor(parent, value, path, key) {
      this._cachedPath = [];
      this.parent = parent;
      this.data = value;
      this._path = path;
      this._key = key;
    }
    get path() {
      if (!this._cachedPath.length) {
        if (Array.isArray(this._key)) {
          this._cachedPath.push(...this._path, ...this._key);
        } else {
          this._cachedPath.push(...this._path, this._key);
        }
      }
      return this._cachedPath;
    }
  }
  const handleResult = (ctx, result2) => {
    if (isValid(result2)) {
      return { success: true, data: result2.value };
    } else {
      if (!ctx.common.issues.length) {
        throw new Error("Validation failed but no issues detected.");
      }
      return {
        success: false,
        get error() {
          if (this._error)
            return this._error;
          const error = new ZodError(ctx.common.issues);
          this._error = error;
          return this._error;
        }
      };
    }
  };
  function processCreateParams(params) {
    if (!params)
      return {};
    const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
    if (errorMap2 && (invalid_type_error || required_error)) {
      throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap2)
      return { errorMap: errorMap2, description };
    const customMap = (iss, ctx) => {
      const { message } = params;
      if (iss.code === "invalid_enum_value") {
        return { message: message ?? ctx.defaultError };
      }
      if (typeof ctx.data === "undefined") {
        return { message: message ?? required_error ?? ctx.defaultError };
      }
      if (iss.code !== "invalid_type")
        return { message: ctx.defaultError };
      return { message: message ?? invalid_type_error ?? ctx.defaultError };
    };
    return { errorMap: customMap, description };
  }
  class ZodType {
    get description() {
      return this._def.description;
    }
    _getType(input) {
      return getParsedType(input.data);
    }
    _getOrReturnCtx(input, ctx) {
      return ctx || {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      };
    }
    _processInputParams(input) {
      return {
        status: new ParseStatus(),
        ctx: {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        }
      };
    }
    _parseSync(input) {
      const result2 = this._parse(input);
      if (isAsync(result2)) {
        throw new Error("Synchronous parse encountered promise.");
      }
      return result2;
    }
    _parseAsync(input) {
      const result2 = this._parse(input);
      return Promise.resolve(result2);
    }
    parse(data, params) {
      const result2 = this.safeParse(data, params);
      if (result2.success)
        return result2.data;
      throw result2.error;
    }
    safeParse(data, params) {
      const ctx = {
        common: {
          issues: [],
          async: (params == null ? void 0 : params.async) ?? false,
          contextualErrorMap: params == null ? void 0 : params.errorMap
        },
        path: (params == null ? void 0 : params.path) || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      const result2 = this._parseSync({ data, path: ctx.path, parent: ctx });
      return handleResult(ctx, result2);
    }
    "~validate"(data) {
      var _a, _b;
      const ctx = {
        common: {
          issues: [],
          async: !!this["~standard"].async
        },
        path: [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      if (!this["~standard"].async) {
        try {
          const result2 = this._parseSync({ data, path: [], parent: ctx });
          return isValid(result2) ? {
            value: result2.value
          } : {
            issues: ctx.common.issues
          };
        } catch (err) {
          if ((_b = (_a = err == null ? void 0 : err.message) == null ? void 0 : _a.toLowerCase()) == null ? void 0 : _b.includes("encountered")) {
            this["~standard"].async = true;
          }
          ctx.common = {
            issues: [],
            async: true
          };
        }
      }
      return this._parseAsync({ data, path: [], parent: ctx }).then((result2) => isValid(result2) ? {
        value: result2.value
      } : {
        issues: ctx.common.issues
      });
    }
    async parseAsync(data, params) {
      const result2 = await this.safeParseAsync(data, params);
      if (result2.success)
        return result2.data;
      throw result2.error;
    }
    async safeParseAsync(data, params) {
      const ctx = {
        common: {
          issues: [],
          contextualErrorMap: params == null ? void 0 : params.errorMap,
          async: true
        },
        path: (params == null ? void 0 : params.path) || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
      const result2 = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
      return handleResult(ctx, result2);
    }
    refine(check, message) {
      const getIssueProperties = (val) => {
        if (typeof message === "string" || typeof message === "undefined") {
          return { message };
        } else if (typeof message === "function") {
          return message(val);
        } else {
          return message;
        }
      };
      return this._refinement((val, ctx) => {
        const result2 = check(val);
        const setError = () => ctx.addIssue({
          code: ZodIssueCode.custom,
          ...getIssueProperties(val)
        });
        if (typeof Promise !== "undefined" && result2 instanceof Promise) {
          return result2.then((data) => {
            if (!data) {
              setError();
              return false;
            } else {
              return true;
            }
          });
        }
        if (!result2) {
          setError();
          return false;
        } else {
          return true;
        }
      });
    }
    refinement(check, refinementData) {
      return this._refinement((val, ctx) => {
        if (!check(val)) {
          ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
          return false;
        } else {
          return true;
        }
      });
    }
    _refinement(refinement) {
      return new ZodEffects({
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: { type: "refinement", refinement }
      });
    }
    superRefine(refinement) {
      return this._refinement(refinement);
    }
    constructor(def) {
      this.spa = this.safeParseAsync;
      this._def = def;
      this.parse = this.parse.bind(this);
      this.safeParse = this.safeParse.bind(this);
      this.parseAsync = this.parseAsync.bind(this);
      this.safeParseAsync = this.safeParseAsync.bind(this);
      this.spa = this.spa.bind(this);
      this.refine = this.refine.bind(this);
      this.refinement = this.refinement.bind(this);
      this.superRefine = this.superRefine.bind(this);
      this.optional = this.optional.bind(this);
      this.nullable = this.nullable.bind(this);
      this.nullish = this.nullish.bind(this);
      this.array = this.array.bind(this);
      this.promise = this.promise.bind(this);
      this.or = this.or.bind(this);
      this.and = this.and.bind(this);
      this.transform = this.transform.bind(this);
      this.brand = this.brand.bind(this);
      this.default = this.default.bind(this);
      this.catch = this.catch.bind(this);
      this.describe = this.describe.bind(this);
      this.pipe = this.pipe.bind(this);
      this.readonly = this.readonly.bind(this);
      this.isNullable = this.isNullable.bind(this);
      this.isOptional = this.isOptional.bind(this);
      this["~standard"] = {
        version: 1,
        vendor: "zod",
        validate: (data) => this["~validate"](data)
      };
    }
    optional() {
      return ZodOptional.create(this, this._def);
    }
    nullable() {
      return ZodNullable.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return ZodArray.create(this);
    }
    promise() {
      return ZodPromise.create(this, this._def);
    }
    or(option) {
      return ZodUnion.create([this, option], this._def);
    }
    and(incoming) {
      return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
      return new ZodEffects({
        ...processCreateParams(this._def),
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: { type: "transform", transform }
      });
    }
    default(def) {
      const defaultValueFunc = typeof def === "function" ? def : () => def;
      return new ZodDefault({
        ...processCreateParams(this._def),
        innerType: this,
        defaultValue: defaultValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodDefault
      });
    }
    brand() {
      return new ZodBranded({
        typeName: ZodFirstPartyTypeKind.ZodBranded,
        type: this,
        ...processCreateParams(this._def)
      });
    }
    catch(def) {
      const catchValueFunc = typeof def === "function" ? def : () => def;
      return new ZodCatch({
        ...processCreateParams(this._def),
        innerType: this,
        catchValue: catchValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodCatch
      });
    }
    describe(description) {
      const This = this.constructor;
      return new This({
        ...this._def,
        description
      });
    }
    pipe(target) {
      return ZodPipeline.create(this, target);
    }
    readonly() {
      return ZodReadonly.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  }
  const cuidRegex = /^c[^\s-]{8,}$/i;
  const cuid2Regex = /^[0-9a-z]+$/;
  const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
  const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
  const nanoidRegex = /^[a-z0-9_-]{21}$/i;
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
  const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
  const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
  const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
  let emojiRegex;
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
  const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
  const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
  const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
  const dateRegex = new RegExp(`^${dateRegexSource}$`);
  function timeRegexSource(args) {
    let secondsRegexSource = `[0-5]\\d`;
    if (args.precision) {
      secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
    } else if (args.precision == null) {
      secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
    }
    const secondsQuantifier = args.precision ? "+" : "?";
    return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
  }
  function timeRegex(args) {
    return new RegExp(`^${timeRegexSource(args)}$`);
  }
  function datetimeRegex(args) {
    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset)
      opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
  }
  function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
      return true;
    }
    return false;
  }
  function isValidJWT(jwt, alg) {
    if (!jwtRegex.test(jwt))
      return false;
    try {
      const [header] = jwt.split(".");
      if (!header)
        return false;
      const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
      const decoded = JSON.parse(atob(base64));
      if (typeof decoded !== "object" || decoded === null)
        return false;
      if ("typ" in decoded && (decoded == null ? void 0 : decoded.typ) !== "JWT")
        return false;
      if (!decoded.alg)
        return false;
      if (alg && decoded.alg !== alg)
        return false;
      return true;
    } catch {
      return false;
    }
  }
  function isValidCidr(ip, version) {
    if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
      return true;
    }
    return false;
  }
  class ZodString extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = String(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.string) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      const status = new ParseStatus();
      let ctx = void 0;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          if (input.data.length < check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          if (input.data.length > check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "length") {
          const tooBig = input.data.length > check.value;
          const tooSmall = input.data.length < check.value;
          if (tooBig || tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            if (tooBig) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: true,
                message: check.message
              });
            } else if (tooSmall) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: true,
                message: check.message
              });
            }
            status.dirty();
          }
        } else if (check.kind === "email") {
          if (!emailRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "email",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "emoji") {
          if (!emojiRegex) {
            emojiRegex = new RegExp(_emojiRegex, "u");
          }
          if (!emojiRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "emoji",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "uuid") {
          if (!uuidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "uuid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "nanoid") {
          if (!nanoidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "nanoid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cuid") {
          if (!cuidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cuid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cuid2") {
          if (!cuid2Regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cuid2",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "ulid") {
          if (!ulidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "ulid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "url") {
          try {
            new URL(input.data);
          } catch {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "url",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "regex") {
          check.regex.lastIndex = 0;
          const testResult = check.regex.test(input.data);
          if (!testResult) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "regex",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "trim") {
          input.data = input.data.trim();
        } else if (check.kind === "includes") {
          if (!input.data.includes(check.value, check.position)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { includes: check.value, position: check.position },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "toLowerCase") {
          input.data = input.data.toLowerCase();
        } else if (check.kind === "toUpperCase") {
          input.data = input.data.toUpperCase();
        } else if (check.kind === "startsWith") {
          if (!input.data.startsWith(check.value)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { startsWith: check.value },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "endsWith") {
          if (!input.data.endsWith(check.value)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { endsWith: check.value },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "datetime") {
          const regex = datetimeRegex(check);
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "datetime",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "date") {
          const regex = dateRegex;
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "date",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "time") {
          const regex = timeRegex(check);
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "time",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "duration") {
          if (!durationRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "duration",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "ip") {
          if (!isValidIP(input.data, check.version)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "ip",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "jwt") {
          if (!isValidJWT(input.data, check.alg)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "jwt",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cidr") {
          if (!isValidCidr(input.data, check.version)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cidr",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "base64") {
          if (!base64Regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "base64",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "base64url") {
          if (!base64urlRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "base64url",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    _regex(regex, validation, message) {
      return this.refinement((data) => regex.test(data), {
        validation,
        code: ZodIssueCode.invalid_string,
        ...errorUtil.errToObj(message)
      });
    }
    _addCheck(check) {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    email(message) {
      return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
    }
    url(message) {
      return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
    }
    emoji(message) {
      return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
    }
    uuid(message) {
      return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
    }
    nanoid(message) {
      return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
    }
    cuid(message) {
      return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
    }
    cuid2(message) {
      return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
    }
    ulid(message) {
      return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
    }
    base64(message) {
      return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
    }
    base64url(message) {
      return this._addCheck({
        kind: "base64url",
        ...errorUtil.errToObj(message)
      });
    }
    jwt(options) {
      return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
    }
    ip(options) {
      return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
    }
    cidr(options) {
      return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
    }
    datetime(options) {
      if (typeof options === "string") {
        return this._addCheck({
          kind: "datetime",
          precision: null,
          offset: false,
          local: false,
          message: options
        });
      }
      return this._addCheck({
        kind: "datetime",
        precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision,
        offset: (options == null ? void 0 : options.offset) ?? false,
        local: (options == null ? void 0 : options.local) ?? false,
        ...errorUtil.errToObj(options == null ? void 0 : options.message)
      });
    }
    date(message) {
      return this._addCheck({ kind: "date", message });
    }
    time(options) {
      if (typeof options === "string") {
        return this._addCheck({
          kind: "time",
          precision: null,
          message: options
        });
      }
      return this._addCheck({
        kind: "time",
        precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision,
        ...errorUtil.errToObj(options == null ? void 0 : options.message)
      });
    }
    duration(message) {
      return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
    }
    regex(regex, message) {
      return this._addCheck({
        kind: "regex",
        regex,
        ...errorUtil.errToObj(message)
      });
    }
    includes(value, options) {
      return this._addCheck({
        kind: "includes",
        value,
        position: options == null ? void 0 : options.position,
        ...errorUtil.errToObj(options == null ? void 0 : options.message)
      });
    }
    startsWith(value, message) {
      return this._addCheck({
        kind: "startsWith",
        value,
        ...errorUtil.errToObj(message)
      });
    }
    endsWith(value, message) {
      return this._addCheck({
        kind: "endsWith",
        value,
        ...errorUtil.errToObj(message)
      });
    }
    min(minLength, message) {
      return this._addCheck({
        kind: "min",
        value: minLength,
        ...errorUtil.errToObj(message)
      });
    }
    max(maxLength, message) {
      return this._addCheck({
        kind: "max",
        value: maxLength,
        ...errorUtil.errToObj(message)
      });
    }
    length(len, message) {
      return this._addCheck({
        kind: "length",
        value: len,
        ...errorUtil.errToObj(message)
      });
    }
    /**
     * Equivalent to `.min(1)`
     */
    nonempty(message) {
      return this.min(1, errorUtil.errToObj(message));
    }
    trim() {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "trim" }]
      });
    }
    toLowerCase() {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "toLowerCase" }]
      });
    }
    toUpperCase() {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "toUpperCase" }]
      });
    }
    get isDatetime() {
      return !!this._def.checks.find((ch) => ch.kind === "datetime");
    }
    get isDate() {
      return !!this._def.checks.find((ch) => ch.kind === "date");
    }
    get isTime() {
      return !!this._def.checks.find((ch) => ch.kind === "time");
    }
    get isDuration() {
      return !!this._def.checks.find((ch) => ch.kind === "duration");
    }
    get isEmail() {
      return !!this._def.checks.find((ch) => ch.kind === "email");
    }
    get isURL() {
      return !!this._def.checks.find((ch) => ch.kind === "url");
    }
    get isEmoji() {
      return !!this._def.checks.find((ch) => ch.kind === "emoji");
    }
    get isUUID() {
      return !!this._def.checks.find((ch) => ch.kind === "uuid");
    }
    get isNANOID() {
      return !!this._def.checks.find((ch) => ch.kind === "nanoid");
    }
    get isCUID() {
      return !!this._def.checks.find((ch) => ch.kind === "cuid");
    }
    get isCUID2() {
      return !!this._def.checks.find((ch) => ch.kind === "cuid2");
    }
    get isULID() {
      return !!this._def.checks.find((ch) => ch.kind === "ulid");
    }
    get isIP() {
      return !!this._def.checks.find((ch) => ch.kind === "ip");
    }
    get isCIDR() {
      return !!this._def.checks.find((ch) => ch.kind === "cidr");
    }
    get isBase64() {
      return !!this._def.checks.find((ch) => ch.kind === "base64");
    }
    get isBase64url() {
      return !!this._def.checks.find((ch) => ch.kind === "base64url");
    }
    get minLength() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxLength() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
  }
  ZodString.create = (params) => {
    return new ZodString({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodString,
      coerce: (params == null ? void 0 : params.coerce) ?? false,
      ...processCreateParams(params)
    });
  };
  function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return valInt % stepInt / 10 ** decCount;
  }
  class ZodNumber extends ZodType {
    constructor() {
      super(...arguments);
      this.min = this.gte;
      this.max = this.lte;
      this.step = this.multipleOf;
    }
    _parse(input) {
      if (this._def.coerce) {
        input.data = Number(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.number) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.number,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      let ctx = void 0;
      const status = new ParseStatus();
      for (const check of this._def.checks) {
        if (check.kind === "int") {
          if (!util.isInteger(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: "integer",
              received: "float",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "min") {
          const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
          if (tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
          if (tooBig) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "multipleOf") {
          if (floatSafeRemainder(input.data, check.value) !== 0) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "finite") {
          if (!Number.isFinite(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_finite,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new ZodNumber({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind,
            value,
            inclusive,
            message: errorUtil.toString(message)
          }
        ]
      });
    }
    _addCheck(check) {
      return new ZodNumber({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    int(message) {
      return this._addCheck({
        kind: "int",
        message: errorUtil.toString(message)
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message)
      });
    }
    finite(message) {
      return this._addCheck({
        kind: "finite",
        message: errorUtil.toString(message)
      });
    }
    safe(message) {
      return this._addCheck({
        kind: "min",
        inclusive: true,
        value: Number.MIN_SAFE_INTEGER,
        message: errorUtil.toString(message)
      })._addCheck({
        kind: "max",
        inclusive: true,
        value: Number.MAX_SAFE_INTEGER,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
    get isInt() {
      return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
    }
    get isFinite() {
      let max = null;
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
          return true;
        } else if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        } else if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return Number.isFinite(min) && Number.isFinite(max);
    }
  }
  ZodNumber.create = (params) => {
    return new ZodNumber({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodNumber,
      coerce: (params == null ? void 0 : params.coerce) || false,
      ...processCreateParams(params)
    });
  };
  class ZodBigInt extends ZodType {
    constructor() {
      super(...arguments);
      this.min = this.gte;
      this.max = this.lte;
    }
    _parse(input) {
      if (this._def.coerce) {
        try {
          input.data = BigInt(input.data);
        } catch {
          return this._getInvalidInput(input);
        }
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.bigint) {
        return this._getInvalidInput(input);
      }
      let ctx = void 0;
      const status = new ParseStatus();
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
          if (tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              type: "bigint",
              minimum: check.value,
              inclusive: check.inclusive,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
          if (tooBig) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              type: "bigint",
              maximum: check.value,
              inclusive: check.inclusive,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "multipleOf") {
          if (input.data % check.value !== BigInt(0)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    _getInvalidInput(input) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx.parsedType
      });
      return INVALID;
    }
    gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new ZodBigInt({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind,
            value,
            inclusive,
            message: errorUtil.toString(message)
          }
        ]
      });
    }
    _addCheck(check) {
      return new ZodBigInt({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
  }
  ZodBigInt.create = (params) => {
    return new ZodBigInt({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodBigInt,
      coerce: (params == null ? void 0 : params.coerce) ?? false,
      ...processCreateParams(params)
    });
  };
  class ZodBoolean extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = Boolean(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.boolean) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.boolean,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodBoolean.create = (params) => {
    return new ZodBoolean({
      typeName: ZodFirstPartyTypeKind.ZodBoolean,
      coerce: (params == null ? void 0 : params.coerce) || false,
      ...processCreateParams(params)
    });
  };
  class ZodDate extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = new Date(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.date) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.date,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      if (Number.isNaN(input.data.getTime())) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_date
        });
        return INVALID;
      }
      const status = new ParseStatus();
      let ctx = void 0;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          if (input.data.getTime() < check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              message: check.message,
              inclusive: true,
              exact: false,
              minimum: check.value,
              type: "date"
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          if (input.data.getTime() > check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              message: check.message,
              inclusive: true,
              exact: false,
              maximum: check.value,
              type: "date"
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return {
        status: status.value,
        value: new Date(input.data.getTime())
      };
    }
    _addCheck(check) {
      return new ZodDate({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    min(minDate, message) {
      return this._addCheck({
        kind: "min",
        value: minDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    max(maxDate, message) {
      return this._addCheck({
        kind: "max",
        value: maxDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    get minDate() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min != null ? new Date(min) : null;
    }
    get maxDate() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max != null ? new Date(max) : null;
    }
  }
  ZodDate.create = (params) => {
    return new ZodDate({
      checks: [],
      coerce: (params == null ? void 0 : params.coerce) || false,
      typeName: ZodFirstPartyTypeKind.ZodDate,
      ...processCreateParams(params)
    });
  };
  class ZodSymbol extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.symbol) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.symbol,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodSymbol.create = (params) => {
    return new ZodSymbol({
      typeName: ZodFirstPartyTypeKind.ZodSymbol,
      ...processCreateParams(params)
    });
  };
  class ZodUndefined extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.undefined,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodUndefined.create = (params) => {
    return new ZodUndefined({
      typeName: ZodFirstPartyTypeKind.ZodUndefined,
      ...processCreateParams(params)
    });
  };
  class ZodNull extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.null) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.null,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodNull.create = (params) => {
    return new ZodNull({
      typeName: ZodFirstPartyTypeKind.ZodNull,
      ...processCreateParams(params)
    });
  };
  class ZodAny extends ZodType {
    constructor() {
      super(...arguments);
      this._any = true;
    }
    _parse(input) {
      return OK(input.data);
    }
  }
  ZodAny.create = (params) => {
    return new ZodAny({
      typeName: ZodFirstPartyTypeKind.ZodAny,
      ...processCreateParams(params)
    });
  };
  class ZodUnknown extends ZodType {
    constructor() {
      super(...arguments);
      this._unknown = true;
    }
    _parse(input) {
      return OK(input.data);
    }
  }
  ZodUnknown.create = (params) => {
    return new ZodUnknown({
      typeName: ZodFirstPartyTypeKind.ZodUnknown,
      ...processCreateParams(params)
    });
  };
  class ZodNever extends ZodType {
    _parse(input) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.never,
        received: ctx.parsedType
      });
      return INVALID;
    }
  }
  ZodNever.create = (params) => {
    return new ZodNever({
      typeName: ZodFirstPartyTypeKind.ZodNever,
      ...processCreateParams(params)
    });
  };
  class ZodVoid extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.void,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodVoid.create = (params) => {
    return new ZodVoid({
      typeName: ZodFirstPartyTypeKind.ZodVoid,
      ...processCreateParams(params)
    });
  };
  class ZodArray extends ZodType {
    _parse(input) {
      const { ctx, status } = this._processInputParams(input);
      const def = this._def;
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (def.exactLength !== null) {
        const tooBig = ctx.data.length > def.exactLength.value;
        const tooSmall = ctx.data.length < def.exactLength.value;
        if (tooBig || tooSmall) {
          addIssueToContext(ctx, {
            code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
            minimum: tooSmall ? def.exactLength.value : void 0,
            maximum: tooBig ? def.exactLength.value : void 0,
            type: "array",
            inclusive: true,
            exact: true,
            message: def.exactLength.message
          });
          status.dirty();
        }
      }
      if (def.minLength !== null) {
        if (ctx.data.length < def.minLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.minLength.message
          });
          status.dirty();
        }
      }
      if (def.maxLength !== null) {
        if (ctx.data.length > def.maxLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.maxLength.message
          });
          status.dirty();
        }
      }
      if (ctx.common.async) {
        return Promise.all([...ctx.data].map((item, i) => {
          return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        })).then((result3) => {
          return ParseStatus.mergeArray(status, result3);
        });
      }
      const result2 = [...ctx.data].map((item, i) => {
        return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      });
      return ParseStatus.mergeArray(status, result2);
    }
    get element() {
      return this._def.type;
    }
    min(minLength, message) {
      return new ZodArray({
        ...this._def,
        minLength: { value: minLength, message: errorUtil.toString(message) }
      });
    }
    max(maxLength, message) {
      return new ZodArray({
        ...this._def,
        maxLength: { value: maxLength, message: errorUtil.toString(message) }
      });
    }
    length(len, message) {
      return new ZodArray({
        ...this._def,
        exactLength: { value: len, message: errorUtil.toString(message) }
      });
    }
    nonempty(message) {
      return this.min(1, message);
    }
  }
  ZodArray.create = (schema, params) => {
    return new ZodArray({
      type: schema,
      minLength: null,
      maxLength: null,
      exactLength: null,
      typeName: ZodFirstPartyTypeKind.ZodArray,
      ...processCreateParams(params)
    });
  };
  function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
      const newShape = {};
      for (const key in schema.shape) {
        const fieldSchema = schema.shape[key];
        newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
      }
      return new ZodObject({
        ...schema._def,
        shape: () => newShape
      });
    } else if (schema instanceof ZodArray) {
      return new ZodArray({
        ...schema._def,
        type: deepPartialify(schema.element)
      });
    } else if (schema instanceof ZodOptional) {
      return ZodOptional.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodNullable) {
      return ZodNullable.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodTuple) {
      return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
    } else {
      return schema;
    }
  }
  class ZodObject extends ZodType {
    constructor() {
      super(...arguments);
      this._cached = null;
      this.nonstrict = this.passthrough;
      this.augment = this.extend;
    }
    _getCached() {
      if (this._cached !== null)
        return this._cached;
      const shape = this._def.shape();
      const keys = util.objectKeys(shape);
      this._cached = { shape, keys };
      return this._cached;
    }
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.object) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      const { status, ctx } = this._processInputParams(input);
      const { shape, keys: shapeKeys } = this._getCached();
      const extraKeys = [];
      if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
        for (const key in ctx.data) {
          if (!shapeKeys.includes(key)) {
            extraKeys.push(key);
          }
        }
      }
      const pairs = [];
      for (const key of shapeKeys) {
        const keyValidator = shape[key];
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (this._def.catchall instanceof ZodNever) {
        const unknownKeys = this._def.unknownKeys;
        if (unknownKeys === "passthrough") {
          for (const key of extraKeys) {
            pairs.push({
              key: { status: "valid", value: key },
              value: { status: "valid", value: ctx.data[key] }
            });
          }
        } else if (unknownKeys === "strict") {
          if (extraKeys.length > 0) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.unrecognized_keys,
              keys: extraKeys
            });
            status.dirty();
          }
        } else if (unknownKeys === "strip") ;
        else {
          throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
        }
      } else {
        const catchall = this._def.catchall;
        for (const key of extraKeys) {
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: catchall._parse(
              new ParseInputLazyPath(ctx, value, ctx.path, key)
              //, ctx.child(key), value, getParsedType(value)
            ),
            alwaysSet: key in ctx.data
          });
        }
      }
      if (ctx.common.async) {
        return Promise.resolve().then(async () => {
          const syncPairs = [];
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
              key,
              value,
              alwaysSet: pair.alwaysSet
            });
          }
          return syncPairs;
        }).then((syncPairs) => {
          return ParseStatus.mergeObjectSync(status, syncPairs);
        });
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
    get shape() {
      return this._def.shape();
    }
    strict(message) {
      errorUtil.errToObj;
      return new ZodObject({
        ...this._def,
        unknownKeys: "strict",
        ...message !== void 0 ? {
          errorMap: (issue, ctx) => {
            var _a, _b;
            const defaultError = ((_b = (_a = this._def).errorMap) == null ? void 0 : _b.call(_a, issue, ctx).message) ?? ctx.defaultError;
            if (issue.code === "unrecognized_keys")
              return {
                message: errorUtil.errToObj(message).message ?? defaultError
              };
            return {
              message: defaultError
            };
          }
        } : {}
      });
    }
    strip() {
      return new ZodObject({
        ...this._def,
        unknownKeys: "strip"
      });
    }
    passthrough() {
      return new ZodObject({
        ...this._def,
        unknownKeys: "passthrough"
      });
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
    extend(augmentation) {
      return new ZodObject({
        ...this._def,
        shape: () => ({
          ...this._def.shape(),
          ...augmentation
        })
      });
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge(merging) {
      const merged = new ZodObject({
        unknownKeys: merging._def.unknownKeys,
        catchall: merging._def.catchall,
        shape: () => ({
          ...this._def.shape(),
          ...merging._def.shape()
        }),
        typeName: ZodFirstPartyTypeKind.ZodObject
      });
      return merged;
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    setKey(key, schema) {
      return this.augment({ [key]: schema });
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    catchall(index) {
      return new ZodObject({
        ...this._def,
        catchall: index
      });
    }
    pick(mask) {
      const shape = {};
      for (const key of util.objectKeys(mask)) {
        if (mask[key] && this.shape[key]) {
          shape[key] = this.shape[key];
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => shape
      });
    }
    omit(mask) {
      const shape = {};
      for (const key of util.objectKeys(this.shape)) {
        if (!mask[key]) {
          shape[key] = this.shape[key];
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => shape
      });
    }
    /**
     * @deprecated
     */
    deepPartial() {
      return deepPartialify(this);
    }
    partial(mask) {
      const newShape = {};
      for (const key of util.objectKeys(this.shape)) {
        const fieldSchema = this.shape[key];
        if (mask && !mask[key]) {
          newShape[key] = fieldSchema;
        } else {
          newShape[key] = fieldSchema.optional();
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => newShape
      });
    }
    required(mask) {
      const newShape = {};
      for (const key of util.objectKeys(this.shape)) {
        if (mask && !mask[key]) {
          newShape[key] = this.shape[key];
        } else {
          const fieldSchema = this.shape[key];
          let newField = fieldSchema;
          while (newField instanceof ZodOptional) {
            newField = newField._def.innerType;
          }
          newShape[key] = newField;
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => newShape
      });
    }
    keyof() {
      return createZodEnum(util.objectKeys(this.shape));
    }
  }
  ZodObject.create = (shape, params) => {
    return new ZodObject({
      shape: () => shape,
      unknownKeys: "strip",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodObject.strictCreate = (shape, params) => {
    return new ZodObject({
      shape: () => shape,
      unknownKeys: "strict",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodObject.lazycreate = (shape, params) => {
    return new ZodObject({
      shape,
      unknownKeys: "strip",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  class ZodUnion extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const options = this._def.options;
      function handleResults(results) {
        for (const result2 of results) {
          if (result2.result.status === "valid") {
            return result2.result;
          }
        }
        for (const result2 of results) {
          if (result2.result.status === "dirty") {
            ctx.common.issues.push(...result2.ctx.common.issues);
            return result2.result;
          }
        }
        const unionErrors = results.map((result2) => new ZodError(result2.ctx.common.issues));
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return Promise.all(options.map(async (option) => {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          return {
            result: await option._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            }),
            ctx: childCtx
          };
        })).then(handleResults);
      } else {
        let dirty = void 0;
        const issues = [];
        for (const option of options) {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          const result2 = option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          });
          if (result2.status === "valid") {
            return result2;
          } else if (result2.status === "dirty" && !dirty) {
            dirty = { result: result2, ctx: childCtx };
          }
          if (childCtx.common.issues.length) {
            issues.push(childCtx.common.issues);
          }
        }
        if (dirty) {
          ctx.common.issues.push(...dirty.ctx.common.issues);
          return dirty.result;
        }
        const unionErrors = issues.map((issues2) => new ZodError(issues2));
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors
        });
        return INVALID;
      }
    }
    get options() {
      return this._def.options;
    }
  }
  ZodUnion.create = (types, params) => {
    return new ZodUnion({
      options: types,
      typeName: ZodFirstPartyTypeKind.ZodUnion,
      ...processCreateParams(params)
    });
  };
  const getDiscriminator = (type) => {
    if (type instanceof ZodLazy) {
      return getDiscriminator(type.schema);
    } else if (type instanceof ZodEffects) {
      return getDiscriminator(type.innerType());
    } else if (type instanceof ZodLiteral) {
      return [type.value];
    } else if (type instanceof ZodEnum) {
      return type.options;
    } else if (type instanceof ZodNativeEnum) {
      return util.objectValues(type.enum);
    } else if (type instanceof ZodDefault) {
      return getDiscriminator(type._def.innerType);
    } else if (type instanceof ZodUndefined) {
      return [void 0];
    } else if (type instanceof ZodNull) {
      return [null];
    } else if (type instanceof ZodOptional) {
      return [void 0, ...getDiscriminator(type.unwrap())];
    } else if (type instanceof ZodNullable) {
      return [null, ...getDiscriminator(type.unwrap())];
    } else if (type instanceof ZodBranded) {
      return getDiscriminator(type.unwrap());
    } else if (type instanceof ZodReadonly) {
      return getDiscriminator(type.unwrap());
    } else if (type instanceof ZodCatch) {
      return getDiscriminator(type._def.innerType);
    } else {
      return [];
    }
  };
  class ZodDiscriminatedUnion extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const discriminator = this.discriminator;
      const discriminatorValue = ctx.data[discriminator];
      const option = this.optionsMap.get(discriminatorValue);
      if (!option) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union_discriminator,
          options: Array.from(this.optionsMap.keys()),
          path: [discriminator]
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return option._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      } else {
        return option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      }
    }
    get discriminator() {
      return this._def.discriminator;
    }
    get options() {
      return this._def.options;
    }
    get optionsMap() {
      return this._def.optionsMap;
    }
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create(discriminator, options, params) {
      const optionsMap = /* @__PURE__ */ new Map();
      for (const type of options) {
        const discriminatorValues = getDiscriminator(type.shape[discriminator]);
        if (!discriminatorValues.length) {
          throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
        }
        for (const value of discriminatorValues) {
          if (optionsMap.has(value)) {
            throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
          }
          optionsMap.set(value, type);
        }
      }
      return new ZodDiscriminatedUnion({
        typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
        discriminator,
        options,
        optionsMap,
        ...processCreateParams(params)
      });
    }
  }
  function mergeValues(a, b) {
    const aType = getParsedType(a);
    const bType = getParsedType(b);
    if (a === b) {
      return { valid: true, data: a };
    } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
      const bKeys = util.objectKeys(b);
      const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
      const newObj = { ...a, ...b };
      for (const key of sharedKeys) {
        const sharedValue = mergeValues(a[key], b[key]);
        if (!sharedValue.valid) {
          return { valid: false };
        }
        newObj[key] = sharedValue.data;
      }
      return { valid: true, data: newObj };
    } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
      if (a.length !== b.length) {
        return { valid: false };
      }
      const newArray = [];
      for (let index = 0; index < a.length; index++) {
        const itemA = a[index];
        const itemB = b[index];
        const sharedValue = mergeValues(itemA, itemB);
        if (!sharedValue.valid) {
          return { valid: false };
        }
        newArray.push(sharedValue.data);
      }
      return { valid: true, data: newArray };
    } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
      return { valid: true, data: a };
    } else {
      return { valid: false };
    }
  }
  class ZodIntersection extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      const handleParsed = (parsedLeft, parsedRight) => {
        if (isAborted(parsedLeft) || isAborted(parsedRight)) {
          return INVALID;
        }
        const merged = mergeValues(parsedLeft.value, parsedRight.value);
        if (!merged.valid) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_intersection_types
          });
          return INVALID;
        }
        if (isDirty(parsedLeft) || isDirty(parsedRight)) {
          status.dirty();
        }
        return { status: status.value, value: merged.data };
      };
      if (ctx.common.async) {
        return Promise.all([
          this._def.left._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }),
          this._def.right._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          })
        ]).then(([left, right]) => handleParsed(left, right));
      } else {
        return handleParsed(this._def.left._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }), this._def.right._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }));
      }
    }
  }
  ZodIntersection.create = (left, right, params) => {
    return new ZodIntersection({
      left,
      right,
      typeName: ZodFirstPartyTypeKind.ZodIntersection,
      ...processCreateParams(params)
    });
  };
  class ZodTuple extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (ctx.data.length < this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        return INVALID;
      }
      const rest = this._def.rest;
      if (!rest && ctx.data.length > this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        status.dirty();
      }
      const items = [...ctx.data].map((item, itemIndex) => {
        const schema = this._def.items[itemIndex] || this._def.rest;
        if (!schema)
          return null;
        return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
      }).filter((x) => !!x);
      if (ctx.common.async) {
        return Promise.all(items).then((results) => {
          return ParseStatus.mergeArray(status, results);
        });
      } else {
        return ParseStatus.mergeArray(status, items);
      }
    }
    get items() {
      return this._def.items;
    }
    rest(rest) {
      return new ZodTuple({
        ...this._def,
        rest
      });
    }
  }
  ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas)) {
      throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple({
      items: schemas,
      typeName: ZodFirstPartyTypeKind.ZodTuple,
      rest: null,
      ...processCreateParams(params)
    });
  };
  class ZodRecord extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const pairs = [];
      const keyType = this._def.keyType;
      const valueType = this._def.valueType;
      for (const key in ctx.data) {
        pairs.push({
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
          value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (ctx.common.async) {
        return ParseStatus.mergeObjectAsync(status, pairs);
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
    get element() {
      return this._def.valueType;
    }
    static create(first, second, third) {
      if (second instanceof ZodType) {
        return new ZodRecord({
          keyType: first,
          valueType: second,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(third)
        });
      }
      return new ZodRecord({
        keyType: ZodString.create(),
        valueType: first,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(second)
      });
    }
  }
  class ZodMap extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.map) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.map,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const keyType = this._def.keyType;
      const valueType = this._def.valueType;
      const pairs = [...ctx.data.entries()].map(([key, value], index) => {
        return {
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
          value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
        };
      });
      if (ctx.common.async) {
        const finalMap = /* @__PURE__ */ new Map();
        return Promise.resolve().then(async () => {
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        });
      } else {
        const finalMap = /* @__PURE__ */ new Map();
        for (const pair of pairs) {
          const key = pair.key;
          const value = pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      }
    }
  }
  ZodMap.create = (keyType, valueType, params) => {
    return new ZodMap({
      valueType,
      keyType,
      typeName: ZodFirstPartyTypeKind.ZodMap,
      ...processCreateParams(params)
    });
  };
  class ZodSet extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.set) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.set,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const def = this._def;
      if (def.minSize !== null) {
        if (ctx.data.size < def.minSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.minSize.message
          });
          status.dirty();
        }
      }
      if (def.maxSize !== null) {
        if (ctx.data.size > def.maxSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.maxSize.message
          });
          status.dirty();
        }
      }
      const valueType = this._def.valueType;
      function finalizeSet(elements2) {
        const parsedSet = /* @__PURE__ */ new Set();
        for (const element of elements2) {
          if (element.status === "aborted")
            return INVALID;
          if (element.status === "dirty")
            status.dirty();
          parsedSet.add(element.value);
        }
        return { status: status.value, value: parsedSet };
      }
      const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
      if (ctx.common.async) {
        return Promise.all(elements).then((elements2) => finalizeSet(elements2));
      } else {
        return finalizeSet(elements);
      }
    }
    min(minSize, message) {
      return new ZodSet({
        ...this._def,
        minSize: { value: minSize, message: errorUtil.toString(message) }
      });
    }
    max(maxSize, message) {
      return new ZodSet({
        ...this._def,
        maxSize: { value: maxSize, message: errorUtil.toString(message) }
      });
    }
    size(size, message) {
      return this.min(size, message).max(size, message);
    }
    nonempty(message) {
      return this.min(1, message);
    }
  }
  ZodSet.create = (valueType, params) => {
    return new ZodSet({
      valueType,
      minSize: null,
      maxSize: null,
      typeName: ZodFirstPartyTypeKind.ZodSet,
      ...processCreateParams(params)
    });
  };
  class ZodLazy extends ZodType {
    get schema() {
      return this._def.getter();
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const lazySchema = this._def.getter();
      return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
  }
  ZodLazy.create = (getter, params) => {
    return new ZodLazy({
      getter,
      typeName: ZodFirstPartyTypeKind.ZodLazy,
      ...processCreateParams(params)
    });
  };
  class ZodLiteral extends ZodType {
    _parse(input) {
      if (input.data !== this._def.value) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_literal,
          expected: this._def.value
        });
        return INVALID;
      }
      return { status: "valid", value: input.data };
    }
    get value() {
      return this._def.value;
    }
  }
  ZodLiteral.create = (value, params) => {
    return new ZodLiteral({
      value,
      typeName: ZodFirstPartyTypeKind.ZodLiteral,
      ...processCreateParams(params)
    });
  };
  function createZodEnum(values, params) {
    return new ZodEnum({
      values,
      typeName: ZodFirstPartyTypeKind.ZodEnum,
      ...processCreateParams(params)
    });
  }
  class ZodEnum extends ZodType {
    _parse(input) {
      if (typeof input.data !== "string") {
        const ctx = this._getOrReturnCtx(input);
        const expectedValues = this._def.values;
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!this._cache) {
        this._cache = new Set(this._def.values);
      }
      if (!this._cache.has(input.data)) {
        const ctx = this._getOrReturnCtx(input);
        const expectedValues = this._def.values;
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
    get options() {
      return this._def.values;
    }
    get enum() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    get Values() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    get Enum() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    extract(values, newDef = this._def) {
      return ZodEnum.create(values, {
        ...this._def,
        ...newDef
      });
    }
    exclude(values, newDef = this._def) {
      return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
        ...this._def,
        ...newDef
      });
    }
  }
  ZodEnum.create = createZodEnum;
  class ZodNativeEnum extends ZodType {
    _parse(input) {
      const nativeEnumValues = util.getValidEnumValues(this._def.values);
      const ctx = this._getOrReturnCtx(input);
      if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
        const expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!this._cache) {
        this._cache = new Set(util.getValidEnumValues(this._def.values));
      }
      if (!this._cache.has(input.data)) {
        const expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
    get enum() {
      return this._def.values;
    }
  }
  ZodNativeEnum.create = (values, params) => {
    return new ZodNativeEnum({
      values,
      typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
      ...processCreateParams(params)
    });
  };
  class ZodPromise extends ZodType {
    unwrap() {
      return this._def.type;
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.promise,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
      return OK(promisified.then((data) => {
        return this._def.type.parseAsync(data, {
          path: ctx.path,
          errorMap: ctx.common.contextualErrorMap
        });
      }));
    }
  }
  ZodPromise.create = (schema, params) => {
    return new ZodPromise({
      type: schema,
      typeName: ZodFirstPartyTypeKind.ZodPromise,
      ...processCreateParams(params)
    });
  };
  class ZodEffects extends ZodType {
    innerType() {
      return this._def.schema;
    }
    sourceType() {
      return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      const effect = this._def.effect || null;
      const checkCtx = {
        addIssue: (arg) => {
          addIssueToContext(ctx, arg);
          if (arg.fatal) {
            status.abort();
          } else {
            status.dirty();
          }
        },
        get path() {
          return ctx.path;
        }
      };
      checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
      if (effect.type === "preprocess") {
        const processed = effect.transform(ctx.data, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(processed).then(async (processed2) => {
            if (status.value === "aborted")
              return INVALID;
            const result2 = await this._def.schema._parseAsync({
              data: processed2,
              path: ctx.path,
              parent: ctx
            });
            if (result2.status === "aborted")
              return INVALID;
            if (result2.status === "dirty")
              return DIRTY(result2.value);
            if (status.value === "dirty")
              return DIRTY(result2.value);
            return result2;
          });
        } else {
          if (status.value === "aborted")
            return INVALID;
          const result2 = this._def.schema._parseSync({
            data: processed,
            path: ctx.path,
            parent: ctx
          });
          if (result2.status === "aborted")
            return INVALID;
          if (result2.status === "dirty")
            return DIRTY(result2.value);
          if (status.value === "dirty")
            return DIRTY(result2.value);
          return result2;
        }
      }
      if (effect.type === "refinement") {
        const executeRefinement = (acc) => {
          const result2 = effect.refinement(acc, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(result2);
          }
          if (result2 instanceof Promise) {
            throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
          }
          return acc;
        };
        if (ctx.common.async === false) {
          const inner = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          executeRefinement(inner.value);
          return { status: status.value, value: inner.value };
        } else {
          return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            return executeRefinement(inner.value).then(() => {
              return { status: status.value, value: inner.value };
            });
          });
        }
      }
      if (effect.type === "transform") {
        if (ctx.common.async === false) {
          const base = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (!isValid(base))
            return INVALID;
          const result2 = effect.transform(base.value, checkCtx);
          if (result2 instanceof Promise) {
            throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
          }
          return { status: status.value, value: result2 };
        } else {
          return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
            if (!isValid(base))
              return INVALID;
            return Promise.resolve(effect.transform(base.value, checkCtx)).then((result2) => ({
              status: status.value,
              value: result2
            }));
          });
        }
      }
      util.assertNever(effect);
    }
  }
  ZodEffects.create = (schema, effect, params) => {
    return new ZodEffects({
      schema,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect,
      ...processCreateParams(params)
    });
  };
  ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
    return new ZodEffects({
      schema,
      effect: { type: "preprocess", transform: preprocess },
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      ...processCreateParams(params)
    });
  };
  class ZodOptional extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType === ZodParsedType.undefined) {
        return OK(void 0);
      }
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  ZodOptional.create = (type, params) => {
    return new ZodOptional({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodOptional,
      ...processCreateParams(params)
    });
  };
  class ZodNullable extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType === ZodParsedType.null) {
        return OK(null);
      }
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  ZodNullable.create = (type, params) => {
    return new ZodNullable({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodNullable,
      ...processCreateParams(params)
    });
  };
  class ZodDefault extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      let data = ctx.data;
      if (ctx.parsedType === ZodParsedType.undefined) {
        data = this._def.defaultValue();
      }
      return this._def.innerType._parse({
        data,
        path: ctx.path,
        parent: ctx
      });
    }
    removeDefault() {
      return this._def.innerType;
    }
  }
  ZodDefault.create = (type, params) => {
    return new ZodDefault({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodDefault,
      defaultValue: typeof params.default === "function" ? params.default : () => params.default,
      ...processCreateParams(params)
    });
  };
  class ZodCatch extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const newCtx = {
        ...ctx,
        common: {
          ...ctx.common,
          issues: []
        }
      };
      const result2 = this._def.innerType._parse({
        data: newCtx.data,
        path: newCtx.path,
        parent: {
          ...newCtx
        }
      });
      if (isAsync(result2)) {
        return result2.then((result3) => {
          return {
            status: "valid",
            value: result3.status === "valid" ? result3.value : this._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        });
      } else {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      }
    }
    removeCatch() {
      return this._def.innerType;
    }
  }
  ZodCatch.create = (type, params) => {
    return new ZodCatch({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodCatch,
      catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
      ...processCreateParams(params)
    });
  };
  class ZodNaN extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.nan) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.nan,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return { status: "valid", value: input.data };
    }
  }
  ZodNaN.create = (params) => {
    return new ZodNaN({
      typeName: ZodFirstPartyTypeKind.ZodNaN,
      ...processCreateParams(params)
    });
  };
  class ZodBranded extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const data = ctx.data;
      return this._def.type._parse({
        data,
        path: ctx.path,
        parent: ctx
      });
    }
    unwrap() {
      return this._def.type;
    }
  }
  class ZodPipeline extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.common.async) {
        const handleAsync = async () => {
          const inResult = await this._def.in._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return DIRTY(inResult.value);
          } else {
            return this._def.out._parseAsync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        };
        return handleAsync();
      } else {
        const inResult = this._def.in._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return {
            status: "dirty",
            value: inResult.value
          };
        } else {
          return this._def.out._parseSync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }
    }
    static create(a, b) {
      return new ZodPipeline({
        in: a,
        out: b,
        typeName: ZodFirstPartyTypeKind.ZodPipeline
      });
    }
  }
  class ZodReadonly extends ZodType {
    _parse(input) {
      const result2 = this._def.innerType._parse(input);
      const freeze = (data) => {
        if (isValid(data)) {
          data.value = Object.freeze(data.value);
        }
        return data;
      };
      return isAsync(result2) ? result2.then((data) => freeze(data)) : freeze(result2);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  ZodReadonly.create = (type, params) => {
    return new ZodReadonly({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodReadonly,
      ...processCreateParams(params)
    });
  };
  function custom(check, _params = {}, fatal) {
    return ZodAny.create();
  }
  var ZodFirstPartyTypeKind;
  (function(ZodFirstPartyTypeKind2) {
    ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
    ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
  })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
  const stringType = ZodString.create;
  const numberType = ZodNumber.create;
  const booleanType = ZodBoolean.create;
  ZodAny.create;
  ZodNever.create;
  const arrayType = ZodArray.create;
  const objectType = ZodObject.create;
  const unionType = ZodUnion.create;
  const discriminatedUnionType = ZodDiscriminatedUnion.create;
  ZodIntersection.create;
  const tupleType = ZodTuple.create;
  const recordType = ZodRecord.create;
  const literalType = ZodLiteral.create;
  const enumType = ZodEnum.create;
  ZodPromise.create;
  ZodOptional.create;
  ZodNullable.create;
  const BBoxSchema = tupleType([numberType(), numberType(), numberType(), numberType()]);
  stringType().refine((val) => {
    return /^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?$/.test(val);
  }, { message: "Origin must be scheme+host+port only, no paths or trailing slashes" });
  const FrameIdSchema = stringType();
  const SourceSchema = enumType(["DOM", "ARIA", "VISION", "OCR"]);
  const SemanticTypeSchema = enumType([
    "button",
    "input",
    "checkbox",
    "dropdown",
    "link",
    "tab",
    "menu",
    "dialog",
    "chart",
    "table",
    "card",
    "navigation",
    "image",
    "text",
    "custom_control",
    "unknown"
  ]);
  const VisualStateSchema = enumType([
    "enabled",
    "disabled",
    "selected",
    "expanded",
    "collapsed",
    "focused",
    "checked",
    "unchecked",
    "visible"
  ]);
  const StageNameSchema = enumType([
    "capture",
    "dom",
    "route",
    "vision",
    "ocr",
    "face",
    "ground",
    "fuse",
    "pii",
    "redact",
    "firewall",
    "network",
    "server",
    "validate",
    "execute",
    "settle"
  ]);
  const StageErrorCodeSchema = enumType([
    "VISION_UNAVAILABLE",
    "PRIVACY_BLOCK",
    "PRIVACY_ERROR",
    "SERVER_UNAVAILABLE",
    "SERVER_INVALID",
    "STALE_STATE",
    "ORIGIN_MISMATCH",
    "FRAME_MISMATCH",
    "POLICY_DENIED",
    "TARGET_NOT_FOUND",
    "NOT_INTERACTABLE",
    "CAPABILITY_DENIED",
    "TEXT_UNSAFE",
    "TIMEOUT",
    "INTERNAL"
  ]);
  objectType({
    code: StageErrorCodeSchema,
    stage: StageNameSchema,
    message: stringType(),
    retryable: booleanType(),
    detail: recordType(unionType([stringType(), numberType(), booleanType()])).optional()
  }).strict();
  objectType({
    ts: numberType(),
    cycle_id: stringType(),
    stage: StageNameSchema,
    duration_ms: numberType(),
    meta: recordType(unionType([stringType(), numberType(), booleanType()])).optional()
  }).strict();
  const FrameInfoSchema = objectType({
    frame_id: FrameIdSchema,
    parent_frame_id: FrameIdSchema.nullable(),
    origin: stringType(),
    path: stringType(),
    offset: tupleType([numberType(), numberType()]),
    accessible: booleanType()
  }).strict();
  const DomElementInfoSchema = objectType({
    dom_id: stringType(),
    frame_id: FrameIdSchema,
    origin: stringType(),
    tag: stringType(),
    role: stringType().nullable(),
    name: stringType().nullable(),
    text: stringType(),
    aria: objectType({
      expanded: booleanType().optional(),
      checked: unionType([booleanType(), literalType("mixed")]).optional(),
      disabled: booleanType().optional(),
      selected: booleanType().optional(),
      pressed: booleanType().optional(),
      hidden: booleanType().optional()
    }).strict(),
    input: objectType({
      type: stringType(),
      autocomplete: stringType().nullable(),
      name: stringType().nullable(),
      placeholder: stringType().nullable(),
      is_password: booleanType(),
      has_value: booleanType(),
      value: stringType().nullable()
    }).strict().optional(),
    bbox: BBoxSchema,
    visible: booleanType(),
    in_viewport: booleanType(),
    occluded: booleanType(),
    interactable: booleanType(),
    rendering: enumType([
      "html",
      "canvas",
      "svg",
      "img",
      "video",
      "iframe",
      "shadow_open",
      "shadow_closed",
      "custom"
    ]),
    has_bg_image: booleanType(),
    handlers_hint: booleanType(),
    parent_dom_id: stringType().nullable(),
    classes: arrayType(stringType()).optional(),
    attributes: recordType(stringType()).optional(),
    element_id: stringType().nullable().optional(),
    element_name: stringType().nullable().optional(),
    label: stringType().nullable().optional(),
    description: stringType().nullable().optional(),
    aria_label: stringType().nullable().optional(),
    aria_labelledby: stringType().nullable().optional(),
    aria_describedby: stringType().nullable().optional(),
    form_id: stringType().nullable().optional(),
    stable_selector: stringType().nullable().optional()
  }).strict();
  objectType({
    snapshot_id: stringType(),
    url_origin: stringType(),
    url_path: stringType(),
    frames: arrayType(FrameInfoSchema),
    elements: arrayType(DomElementInfoSchema),
    viewport: objectType({ w: numberType(), h: numberType() }).strict(),
    dpr: numberType(),
    scroll: objectType({ x: numberType(), y: numberType() }).strict(),
    page_state_hash: stringType(),
    ts: numberType()
  }).strict();
  const RoutingLevelSchema = enumType(["HIGH", "MEDIUM", "LOW"]);
  const VisionTaskSchema = enumType(["ocr", "ui_detect", "face", "ground"]);
  const BudgetLevelSchema = enumType(["HIGH", "MEDIUM", "LOW"]);
  const BudgetSchema = objectType({
    level: BudgetLevelSchema,
    backend: enumType(["webgpu", "webgl", "wasm", "none"]),
    max_vision_regions: numberType(),
    max_pixels: numberType(),
    allow_detector: booleanType(),
    ocr_mode: enumType(["off", "fast", "high_recall"])
  }).strict();
  const RoutingDecisionSchema = objectType({
    region_key: stringType(),
    dom_id: stringType().nullable(),
    level: RoutingLevelSchema,
    reasons: arrayType(stringType()),
    crop: BBoxSchema.nullable(),
    needs: arrayType(VisionTaskSchema)
  }).strict();
  objectType({
    snapshot_id: stringType(),
    page_state_hash: stringType(),
    decisions: arrayType(RoutingDecisionSchema),
    needs_screenshot: booleanType(),
    budget: BudgetSchema
  }).strict();
  objectType({
    capture_id: stringType(),
    page_state_hash: stringType(),
    dpr: numberType(),
    viewport: objectType({ w: numberType(), h: numberType() }).strict(),
    scroll: objectType({ x: numberType(), y: numberType() }).strict(),
    image: objectType({ w: numberType(), h: numberType() }).strict(),
    ts: numberType()
  }).strict();
  objectType({
    text: stringType(),
    bbox: BBoxSchema,
    confidence: numberType(),
    line_id: numberType()
  }).strict();
  objectType({
    bbox: BBoxSchema,
    confidence: numberType(),
    coordinateSpace: literalType("frame")
  }).strict();
  const PiiTypeSchema = enumType([
    "EMAIL",
    "PHONE",
    "PERSON",
    "ADDRESS",
    "DOB",
    "CARD",
    "PASSWORD",
    "AUTH_TOKEN",
    "GOV_ID",
    "BANK_ACCOUNT",
    "FACE",
    "IDENTIFIER"
  ]);
  const CapabilityDescriptorSchema = objectType({
    ref: stringType(),
    kind: enumType(["password", "email", "phone", "token", "profile"]),
    label: stringType()
  }).strict();
  const ActionTypeSchema = enumType([
    "click",
    "scroll",
    "focus",
    "select",
    "type",
    "keypress",
    "fill_secret",
    "navigate",
    "back"
  ]);
  const StepSummarySchema = objectType({
    step: numberType(),
    action: ActionTypeSchema,
    target_region_id: stringType().nullable(),
    result: enumType(["ok", "blocked", "failed"]),
    note: stringType().nullable()
  }).strict();
  const ActionParamsSchema$1 = objectType({
    text: stringType().optional(),
    option: stringType().optional(),
    key: stringType().optional(),
    direction: enumType(["up", "down", "left", "right"]).optional(),
    amount: numberType().optional()
  }).strict();
  const StructuredActionSchema = objectType({
    action_id: stringType(),
    request_id: stringType(),
    action: ActionTypeSchema,
    target: objectType({ region_id: stringType() }).strict().nullable(),
    params: ActionParamsSchema$1.nullable(),
    capability: stringType().nullable(),
    origin: stringType(),
    frame_id: FrameIdSchema,
    page_state_hash: stringType(),
    rationale: stringType().optional()
  }).strict();
  objectType({
    request_id: stringType(),
    status: enumType(["action", "done", "need_user", "fail"]),
    action: StructuredActionSchema.nullable(),
    message: stringType().nullable(),
    usage: objectType({
      server_ms: numberType(),
      model: stringType()
    }).strict()
  }).strict();
  const SanitizedRegionSchema = objectType({
    region_id: stringType(),
    type: SemanticTypeSchema,
    text: stringType().nullable(),
    bbox: BBoxSchema,
    state: arrayType(VisualStateSchema),
    interactable: booleanType(),
    frame_id: FrameIdSchema,
    sources: arrayType(SourceSchema),
    confidence: numberType(),
    relations: arrayType(objectType({ rel: stringType(), target: stringType() }).strict()).optional(),
    trust: literalType("untrusted")
  }).strict();
  objectType({
    schema_version: literalType("1.0"),
    request_id: stringType(),
    task_id: stringType(),
    step_index: numberType(),
    task: stringType(),
    page: objectType({
      origin: stringType(),
      path: stringType(),
      title: stringType().nullable(),
      page_state_hash: stringType(),
      viewport: objectType({ w: numberType(), h: numberType() }).strict(),
      frame_ids: arrayType(FrameIdSchema)
    }).strict(),
    regions: arrayType(SanitizedRegionSchema),
    capabilities: arrayType(CapabilityDescriptorSchema),
    redactions: arrayType(objectType({
      type: PiiTypeSchema,
      count: numberType()
    }).strict()),
    image: objectType({
      mime: literalType("image/jpeg"),
      data_base64: stringType(),
      width: numberType(),
      height: numberType(),
      covers_region_ids: arrayType(stringType())
    }).strict().nullable(),
    history: arrayType(StepSummarySchema),
    flags: objectType({
      injection_suspected_region_ids: arrayType(stringType())
    }).strict()
  }).strict();
  objectType({
    request_id: stringType(),
    body: stringType(),
    sha256: stringType().length(64),
    issued_at: numberType()
  }).strict();
  content;
  function getChrome() {
    var _a;
    if (typeof chrome !== "undefined" && chrome.runtime) {
      return chrome;
    }
    if (typeof globalThis !== "undefined" && ((_a = globalThis.chrome) == null ? void 0 : _a.runtime)) {
      return globalThis.chrome;
    }
    return void 0;
  }
  const chromeHandlers = /* @__PURE__ */ new Map();
  let globalListenerAttached = false;
  function ensureGlobalMessageListener(ext) {
    if (globalListenerAttached) return;
    globalListenerAttached = true;
    ext.runtime.onMessage.addListener(
      (message, sender, sendResponse) => {
        if (!message || typeof message.type !== "string") {
          return false;
        }
        const handlers = chromeHandlers.get(message.type);
        if (handlers && handlers.length > 0) {
          Promise.resolve().then(() => handlers[0](message.payload, sender)).then((data) => {
            try {
              sendResponse({ ok: true, data });
            } catch {
            }
          }).catch((err) => {
            const error = (err == null ? void 0 : err.code) && (err == null ? void 0 : err.stage) ? err : stageError("INTERNAL", "dom", (err == null ? void 0 : err.message) || String(err));
            try {
              sendResponse({ ok: false, error });
            } catch {
            }
          });
          return true;
        }
        return false;
      }
    );
  }
  const localHandlers = /* @__PURE__ */ new Map();
  const bus = {
    /**
     * Send a typed message across realms (or locally if in test/node).
     */
    async send(type, payload, options) {
      var _a;
      const message = { type, payload };
      const ext = getChrome();
      const timeoutMs = (options == null ? void 0 : options.timeoutMs) || (type === "vision/perceive" ? 1e4 : 5e3);
      if (ext && ((_a = ext.runtime) == null ? void 0 : _a.sendMessage)) {
        return new Promise((resolve) => {
          var _a2;
          let settled = false;
          const timer = setTimeout(() => {
            if (!settled) {
              settled = true;
              resolve({
                ok: false,
                error: stageError("TIMEOUT", "dom", `Message "${type}" timed out after ${timeoutMs}ms`)
              });
            }
          }, timeoutMs);
          try {
            const callback = (res) => {
              const lastError = ext.runtime.lastError;
              if (settled) return;
              settled = true;
              clearTimeout(timer);
              if (lastError) {
                resolve({
                  ok: false,
                  error: stageError(
                    "INTERNAL",
                    "dom",
                    lastError.message || "Unknown runtime error"
                  )
                });
                return;
              }
              if (!res) {
                resolve({
                  ok: false,
                  error: stageError("INTERNAL", "dom", `No response from handler for message "${type}"`)
                });
                return;
              }
              resolve(res);
            };
            if ((options == null ? void 0 : options.tabId) && options.tabId > 0 && ((_a2 = ext.tabs) == null ? void 0 : _a2.sendMessage)) {
              const frameId = options.frameId !== void 0 ? options.frameId : 0;
              ext.tabs.sendMessage(options.tabId, message, { frameId }, callback);
            } else {
              ext.runtime.sendMessage(message, callback);
            }
          } catch (err) {
            if (!settled) {
              settled = true;
              clearTimeout(timer);
              resolve({
                ok: false,
                error: stageError("INTERNAL", "dom", err instanceof Error ? err.message : String(err))
              });
            }
          }
        });
      }
      const handlers = localHandlers.get(type);
      if (!handlers || handlers.length === 0) {
        return {
          ok: false,
          error: stageError("INTERNAL", "dom", `No local handler registered for "${type}"`)
        };
      }
      try {
        const data = await handlers[0](payload);
        return { ok: true, data };
      } catch (err) {
        return {
          ok: false,
          error: err.code && err.stage ? err : stageError("INTERNAL", "dom", err.message || String(err))
        };
      }
    },
    /**
     * Register a typed message listener.
     */
    on(type, handler) {
      var _a;
      const ext = getChrome();
      if (ext && ((_a = ext.runtime) == null ? void 0 : _a.onMessage)) {
        ensureGlobalMessageListener(ext);
        const list2 = chromeHandlers.get(type) || [];
        list2.push(handler);
        chromeHandlers.set(type, list2);
        return () => {
          const existing = chromeHandlers.get(type) || [];
          const filtered = existing.filter((h) => h !== handler);
          if (filtered.length > 0) {
            chromeHandlers.set(type, filtered);
          } else {
            chromeHandlers.delete(type);
          }
        };
      }
      const list = localHandlers.get(type) || [];
      list.push(handler);
      localHandlers.set(type, list);
      return () => {
        const existing = localHandlers.get(type) || [];
        const filtered = existing.filter((h) => h !== handler);
        if (filtered.length > 0) {
          localHandlers.set(type, filtered);
        } else {
          localHandlers.delete(type);
        }
      };
    },
    /**
     * Clears all local test handlers (for tests).
     */
    _clearLocalHandlers() {
      localHandlers.clear();
      chromeHandlers.clear();
    }
  };
  content;
  const SUPPORTED_ACTION_TYPES = [
    "click",
    "type",
    "scroll",
    "keypress",
    "focus",
    "select",
    "fill_secret"
  ];
  const SupportedActionTypeSchema = enumType(SUPPORTED_ACTION_TYPES);
  const FORBIDDEN_TEXT_PATTERNS = [
    /javascript:/i,
    /<script[\s>]/i,
    /\beval\s*\(/i,
    /\bFunction\s*\(/i,
    /\bwindow\.execScript\b/i
  ];
  const SafeTextParamSchema = stringType().superRefine((val, ctx) => {
    for (const pattern of FORBIDDEN_TEXT_PATTERNS) {
      if (pattern.test(val)) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: `Forbidden script injection pattern detected: ${pattern.source}`
        });
      }
    }
  });
  const ActionParamsSchema = objectType({
    text: SafeTextParamSchema.optional(),
    key: stringType().min(1).max(50).optional(),
    direction: enumType(["up", "down", "left", "right"]).optional(),
    amount: numberType().int().min(1).max(1e4).optional(),
    option: stringType().optional()
  }).strict().optional().nullable();
  objectType({
    target_id: stringType().min(1, "target_id cannot be empty"),
    role: stringType().optional(),
    label: stringType().optional()
  }).strict();
  const ActionPayloadSchema = objectType({
    type: SupportedActionTypeSchema,
    target_id: stringType().min(1, "target_id cannot be empty").optional(),
    params: ActionParamsSchema
  }).strict().superRefine((action, ctx) => {
    const targetRequiredActions = ["click", "type", "focus", "select", "fill_secret"];
    if (targetRequiredActions.includes(action.type) && !action.target_id) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `Action '${action.type}' requires a non-empty target_id`,
        path: ["target_id"]
      });
    }
    if (action.type === "type" && (!action.params || typeof action.params.text !== "string")) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Action 'type' requires params.text",
        path: ["params", "text"]
      });
    }
    if (action.type === "keypress" && (!action.params || typeof action.params.key !== "string")) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Action 'keypress' requires params.key",
        path: ["params", "key"]
      });
    }
  });
  objectType({
    request_id: stringType().min(1, "request_id cannot be empty"),
    observation_id: stringType().min(1, "observation_id cannot be empty"),
    action: ActionPayloadSchema,
    page_state_hash: stringType().optional(),
    capability: stringType().nullable().optional()
  }).strict();
  const ACTION_VALIDATION_ERROR_CODES = [
    "MALFORMED_REQUEST",
    "MISSING_ACTION_TYPE",
    "UNSUPPORTED_ACTION",
    "MISSING_TARGET",
    "MALFORMED_TARGET",
    "INVALID_OBSERVATION",
    "STALE_OBSERVATION",
    "SCRIPT_INJECTION_REJECTED",
    "PAGE_STATE_MISMATCH",
    "FRAME_MISMATCH",
    "TARGET_NOT_FOUND",
    "NOT_INTERACTABLE",
    "POLICY_DENIED",
    "CAPABILITY_DENIED",
    "TEXT_UNSAFE",
    "UNVALIDATED_EXECUTION_ATTEMPT",
    "EXPIRED_VERDICT",
    "REPLAY_REJECTED",
    "OBSERVATION_MISMATCH",
    "TARGET_MISMATCH",
    "NO_VALIDATION_VERDICT",
    "VALIDATION_EXCEPTION",
    "EXECUTOR_RUNTIME_ERROR"
  ];
  discriminatedUnionType("allowed", [
    objectType({
      allowed: literalType(true),
      reason: stringType(),
      request_id: stringType(),
      observation_id: stringType(),
      action_type: SupportedActionTypeSchema,
      target_id: stringType().nullable().optional(),
      ticket: custom().optional()
    }).passthrough(),
    objectType({
      allowed: literalType(false),
      reason: stringType(),
      code: enumType(ACTION_VALIDATION_ERROR_CODES),
      failed_check: stringType().optional()
    }).strict()
  ]);
  content;
  content;
  function isElementVisible(el) {
    if (typeof el.checkVisibility === "function") {
      if (!el.checkVisibility({
        checkOpacity: true,
        checkVisibilityCSS: true
      })) {
        return false;
      }
    }
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return false;
    }
    if (typeof window !== "undefined") {
      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse" || parseFloat(style.opacity || "1") < 0.05) {
        return false;
      }
    }
    return true;
  }
  function isElementOccluded(el, cx, cy) {
    if (typeof document === "undefined" || typeof document.elementsFromPoint !== "function") {
      return false;
    }
    const topElements = document.elementsFromPoint(cx, cy);
    if (topElements.length === 0) return false;
    const top = topElements[0];
    if (!top) return false;
    return top !== el && !el.contains(top);
  }
  content;
  function detectRenderingKind(el) {
    const tag = el.tagName.toLowerCase();
    let rendering = "html";
    if (tag === "canvas") rendering = "canvas";
    else if (tag === "svg" || tag === "path") rendering = "svg";
    else if (tag === "img") rendering = "img";
    else if (tag === "video") rendering = "video";
    else if (tag === "iframe") rendering = "iframe";
    else if (el.shadowRoot) rendering = "shadow_open";
    let has_bg_image = false;
    let handlers_hint = false;
    if (typeof window !== "undefined") {
      const style = window.getComputedStyle(el);
      if (style.backgroundImage && style.backgroundImage !== "none") {
        has_bg_image = true;
      }
      if (style.cursor === "pointer") {
        handlers_hint = true;
      }
    }
    if (el.onclick || el.getAttribute("onclick") || el.getAttribute("role") === "button") {
      handlers_hint = true;
    }
    return { rendering, has_bg_image, handlers_hint };
  }
  content;
  function computeAriaRole(el) {
    const explicitRole = el.getAttribute("role");
    if (explicitRole) {
      return explicitRole.trim().split(/\s+/)[0] || null;
    }
    const tag = el.tagName.toLowerCase();
    switch (tag) {
      case "a":
        return el.hasAttribute("href") ? "link" : null;
      case "button":
        return "button";
      case "input": {
        const type = (el.getAttribute("type") || "text").toLowerCase();
        if (type === "button" || type === "submit" || type === "reset") return "button";
        if (type === "checkbox") return "checkbox";
        if (type === "radio") return "radio";
        if (type === "range") return "slider";
        if (type === "number") return "spinbutton";
        return "textbox";
      }
      case "select":
        return "combobox";
      case "textarea":
        return "textbox";
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        return "heading";
      case "img":
        return "img";
      case "nav":
        return "navigation";
      case "dialog":
        return "dialog";
      default:
        return null;
    }
  }
  function extractAriaStates(el) {
    const aria = {};
    if (el.hasAttribute("aria-expanded")) {
      aria.expanded = el.getAttribute("aria-expanded") === "true";
    }
    if (el.hasAttribute("aria-checked")) {
      const val = el.getAttribute("aria-checked");
      aria.checked = val === "mixed" ? "mixed" : val === "true";
    }
    if (el.hasAttribute("aria-disabled") || el.disabled) {
      aria.disabled = el.getAttribute("aria-disabled") === "true" || el.disabled === true;
    }
    if (el.hasAttribute("aria-selected")) {
      aria.selected = el.getAttribute("aria-selected") === "true";
    }
    if (el.hasAttribute("aria-pressed")) {
      aria.pressed = el.getAttribute("aria-pressed") === "true";
    }
    if (el.hasAttribute("aria-hidden")) {
      aria.hidden = el.getAttribute("aria-hidden") === "true";
    }
    return aria;
  }
  content;
  var toStr = Object.prototype.toString;
  function isCallable(fn) {
    return typeof fn === "function" || toStr.call(fn) === "[object Function]";
  }
  function toInteger(value) {
    var number = Number(value);
    if (isNaN(number)) {
      return 0;
    }
    if (number === 0 || !isFinite(number)) {
      return number;
    }
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
  }
  var maxSafeInteger = Math.pow(2, 53) - 1;
  function toLength(value) {
    var len = toInteger(value);
    return Math.min(Math.max(len, 0), maxSafeInteger);
  }
  function arrayFrom(arrayLike, mapFn) {
    var C = Array;
    var items = Object(arrayLike);
    if (arrayLike == null) {
      throw new TypeError("Array.from requires an array-like object - not null or undefined");
    }
    var len = toLength(items.length);
    var A = isCallable(C) ? Object(new C(len)) : new Array(len);
    var k = 0;
    var kValue;
    while (k < len) {
      kValue = items[k];
      {
        A[k] = kValue;
      }
      k += 1;
    }
    A.length = len;
    return A;
  }
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == _typeof(i) ? i : i + "";
  }
  function _toPrimitive(t, r) {
    if ("object" != _typeof(t) || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
      if ("object" != _typeof(i)) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(t);
  }
  var SetLike = /* @__PURE__ */ (function() {
    function SetLike2() {
      var items = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      _classCallCheck(this, SetLike2);
      _defineProperty(this, "items", void 0);
      this.items = items;
    }
    return _createClass(SetLike2, [{
      key: "add",
      value: function add(value) {
        if (this.has(value) === false) {
          this.items.push(value);
        }
        return this;
      }
    }, {
      key: "clear",
      value: function clear() {
        this.items = [];
      }
    }, {
      key: "delete",
      value: function _delete(value) {
        var previousLength = this.items.length;
        this.items = this.items.filter(function(item) {
          return item !== value;
        });
        return previousLength !== this.items.length;
      }
    }, {
      key: "forEach",
      value: function forEach(callbackfn) {
        var _this = this;
        this.items.forEach(function(item) {
          callbackfn(item, item, _this);
        });
      }
    }, {
      key: "has",
      value: function has(value) {
        return this.items.indexOf(value) !== -1;
      }
    }, {
      key: "size",
      get: function get() {
        return this.items.length;
      }
    }]);
  })();
  const SetLike$1 = typeof Set === "undefined" ? Set : SetLike;
  function getLocalName(element) {
    var _element$localName;
    return (
      // eslint-disable-next-line no-restricted-properties -- actual guard for environments without localName
      (_element$localName = element.localName) !== null && _element$localName !== void 0 ? _element$localName : (
        // eslint-disable-next-line no-restricted-properties -- required for the fallback
        element.tagName.toLowerCase()
      )
    );
  }
  var localNameToRoleMappings = {
    article: "article",
    aside: "complementary",
    button: "button",
    datalist: "listbox",
    dd: "definition",
    details: "group",
    dialog: "dialog",
    dt: "term",
    fieldset: "group",
    figure: "figure",
    // WARNING: Only with an accessible name
    form: "form",
    footer: "contentinfo",
    h1: "heading",
    h2: "heading",
    h3: "heading",
    h4: "heading",
    h5: "heading",
    h6: "heading",
    header: "banner",
    hr: "separator",
    html: "document",
    legend: "legend",
    li: "listitem",
    math: "math",
    main: "main",
    menu: "list",
    nav: "navigation",
    ol: "list",
    optgroup: "group",
    // WARNING: Only in certain context
    option: "option",
    output: "status",
    progress: "progressbar",
    // WARNING: Only with an accessible name
    section: "region",
    summary: "button",
    table: "table",
    tbody: "rowgroup",
    textarea: "textbox",
    tfoot: "rowgroup",
    // WARNING: Only in certain context
    td: "cell",
    th: "columnheader",
    thead: "rowgroup",
    tr: "row",
    ul: "list"
  };
  var prohibitedAttributes = {
    caption: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
    code: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
    deletion: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
    emphasis: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
    generic: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby", "aria-roledescription"]),
    insertion: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
    none: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
    paragraph: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
    presentation: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
    strong: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
    subscript: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"]),
    superscript: /* @__PURE__ */ new Set(["aria-label", "aria-labelledby"])
  };
  function hasGlobalAriaAttributes(element, role) {
    return [
      "aria-atomic",
      "aria-busy",
      "aria-controls",
      "aria-current",
      "aria-description",
      "aria-describedby",
      "aria-details",
      // "disabled",
      "aria-dropeffect",
      // "errormessage",
      "aria-flowto",
      "aria-grabbed",
      // "haspopup",
      "aria-hidden",
      // "invalid",
      "aria-keyshortcuts",
      "aria-label",
      "aria-labelledby",
      "aria-live",
      "aria-owns",
      "aria-relevant",
      "aria-roledescription"
    ].some(function(attributeName) {
      var _prohibitedAttributes;
      return element.hasAttribute(attributeName) && !((_prohibitedAttributes = prohibitedAttributes[role]) !== null && _prohibitedAttributes !== void 0 && _prohibitedAttributes.has(attributeName));
    });
  }
  function ignorePresentationalRole(element, implicitRole) {
    return hasGlobalAriaAttributes(element, implicitRole);
  }
  function getRole(element) {
    var explicitRole = getExplicitRole(element);
    if (explicitRole === null || presentationRoles.indexOf(explicitRole) !== -1) {
      var implicitRole = getImplicitRole(element);
      if (presentationRoles.indexOf(explicitRole || "") === -1 || ignorePresentationalRole(element, implicitRole || "")) {
        return implicitRole;
      }
    }
    return explicitRole;
  }
  function getImplicitRole(element) {
    var mappedByTag = localNameToRoleMappings[getLocalName(element)];
    if (mappedByTag !== void 0) {
      return mappedByTag;
    }
    switch (getLocalName(element)) {
      case "a":
      case "area":
      case "link":
        if (element.hasAttribute("href")) {
          return "link";
        }
        break;
      case "img":
        if (element.getAttribute("alt") === "" && !ignorePresentationalRole(element, "img")) {
          return "presentation";
        }
        return "img";
      case "input": {
        var _ref = element, type = _ref.type;
        switch (type) {
          case "button":
          case "image":
          case "reset":
          case "submit":
            return "button";
          case "checkbox":
          case "radio":
            return type;
          case "range":
            return "slider";
          case "email":
          case "tel":
          case "text":
          case "url":
            if (element.hasAttribute("list")) {
              return "combobox";
            }
            return "textbox";
          case "search":
            if (element.hasAttribute("list")) {
              return "combobox";
            }
            return "searchbox";
          case "number":
            return "spinbutton";
          default:
            return null;
        }
      }
      case "select":
        if (element.hasAttribute("multiple") || element.size > 1) {
          return "listbox";
        }
        return "combobox";
    }
    return null;
  }
  function getExplicitRole(element) {
    var role = element.getAttribute("role");
    if (role !== null) {
      var explicitRole = role.trim().split(" ")[0];
      if (explicitRole.length > 0) {
        return explicitRole;
      }
    }
    return null;
  }
  var presentationRoles = ["presentation", "none"];
  function isElement(node) {
    return node !== null && node.nodeType === node.ELEMENT_NODE;
  }
  function isHTMLTableCaptionElement(node) {
    return isElement(node) && getLocalName(node) === "caption";
  }
  function isHTMLInputElement(node) {
    return isElement(node) && getLocalName(node) === "input";
  }
  function isHTMLOptGroupElement(node) {
    return isElement(node) && getLocalName(node) === "optgroup";
  }
  function isHTMLSelectElement(node) {
    return isElement(node) && getLocalName(node) === "select";
  }
  function isHTMLTableElement(node) {
    return isElement(node) && getLocalName(node) === "table";
  }
  function isHTMLTextAreaElement(node) {
    return isElement(node) && getLocalName(node) === "textarea";
  }
  function safeWindow(node) {
    var _ref = node.ownerDocument === null ? node : node.ownerDocument, defaultView = _ref.defaultView;
    if (defaultView === null) {
      throw new TypeError("no window available");
    }
    return defaultView;
  }
  function isHTMLFieldSetElement(node) {
    return isElement(node) && getLocalName(node) === "fieldset";
  }
  function isHTMLLegendElement(node) {
    return isElement(node) && getLocalName(node) === "legend";
  }
  function isHTMLSlotElement(node) {
    return isElement(node) && getLocalName(node) === "slot";
  }
  function isSVGElement(node) {
    return isElement(node) && node.ownerSVGElement !== void 0;
  }
  function isSVGSVGElement(node) {
    return isElement(node) && getLocalName(node) === "svg";
  }
  function isSVGTitleElement(node) {
    return isSVGElement(node) && getLocalName(node) === "title";
  }
  function queryIdRefs(node, attributeName) {
    if (isElement(node) && node.hasAttribute(attributeName)) {
      var ids = node.getAttribute(attributeName).split(" ");
      var root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
      return ids.map(function(id) {
        return root.getElementById(id);
      }).filter(
        function(element) {
          return element !== null;
        }
        // TODO: why does this not narrow?
      );
    }
    return [];
  }
  function hasAnyConcreteRoles(node, roles) {
    if (isElement(node)) {
      return roles.indexOf(getRole(node)) !== -1;
    }
    return false;
  }
  function asFlatString(s) {
    return s.trim().replace(/\s\s+/g, " ");
  }
  function isHidden(node, getComputedStyleImplementation) {
    if (!isElement(node)) {
      return false;
    }
    if (node.hasAttribute("hidden") || node.getAttribute("aria-hidden") === "true") {
      return true;
    }
    var style = getComputedStyleImplementation(node);
    return style.getPropertyValue("display") === "none" || style.getPropertyValue("visibility") === "hidden";
  }
  function isControl(node) {
    return hasAnyConcreteRoles(node, ["button", "combobox", "listbox", "textbox"]) || hasAbstractRole(node, "range");
  }
  function hasAbstractRole(node, role) {
    if (!isElement(node)) {
      return false;
    }
    switch (role) {
      case "range":
        return hasAnyConcreteRoles(node, ["meter", "progressbar", "scrollbar", "slider", "spinbutton"]);
      default:
        throw new TypeError("No knowledge about abstract role '".concat(role, "'. This is likely a bug :("));
    }
  }
  function querySelectorAllSubtree(element, selectors) {
    var elements = arrayFrom(element.querySelectorAll(selectors));
    queryIdRefs(element, "aria-owns").forEach(function(root) {
      elements.push.apply(elements, arrayFrom(root.querySelectorAll(selectors)));
    });
    return elements;
  }
  function querySelectedOptions(listbox) {
    if (isHTMLSelectElement(listbox)) {
      return listbox.selectedOptions || querySelectorAllSubtree(listbox, "[selected]");
    }
    return querySelectorAllSubtree(listbox, '[aria-selected="true"]');
  }
  function isMarkedPresentational(node) {
    return hasAnyConcreteRoles(node, presentationRoles);
  }
  function isNativeHostLanguageTextAlternativeElement(node) {
    return isHTMLTableCaptionElement(node);
  }
  function allowsNameFromContent(node) {
    return hasAnyConcreteRoles(node, ["button", "cell", "checkbox", "columnheader", "gridcell", "heading", "label", "legend", "link", "menuitem", "menuitemcheckbox", "menuitemradio", "option", "radio", "row", "rowheader", "switch", "tab", "tooltip", "treeitem"]);
  }
  function isDescendantOfNativeHostLanguageTextAlternativeElement(node) {
    return false;
  }
  function getValueOfTextbox(element) {
    if (isHTMLInputElement(element) || isHTMLTextAreaElement(element)) {
      return element.value;
    }
    return element.textContent || "";
  }
  function getTextualContent(declaration) {
    var content2 = declaration.getPropertyValue("content");
    if (/^["'].*["']$/.test(content2)) {
      return content2.slice(1, -1);
    }
    return "";
  }
  function isLabelableElement(element) {
    var localName = getLocalName(element);
    return localName === "button" || localName === "input" && element.getAttribute("type") !== "hidden" || localName === "meter" || localName === "output" || localName === "progress" || localName === "select" || localName === "textarea";
  }
  function findLabelableElement(element) {
    if (isLabelableElement(element)) {
      return element;
    }
    var labelableElement = null;
    element.childNodes.forEach(function(childNode) {
      if (labelableElement === null && isElement(childNode)) {
        var descendantLabelableElement = findLabelableElement(childNode);
        if (descendantLabelableElement !== null) {
          labelableElement = descendantLabelableElement;
        }
      }
    });
    return labelableElement;
  }
  function getControlOfLabel(label) {
    if (label.control !== void 0) {
      return label.control;
    }
    var htmlFor = label.getAttribute("for");
    if (htmlFor !== null) {
      return label.ownerDocument.getElementById(htmlFor);
    }
    return findLabelableElement(label);
  }
  function getLabels(element) {
    var labelsProperty = element.labels;
    if (labelsProperty === null) {
      return labelsProperty;
    }
    if (labelsProperty !== void 0) {
      return arrayFrom(labelsProperty);
    }
    if (!isLabelableElement(element)) {
      return null;
    }
    var document2 = element.ownerDocument;
    return arrayFrom(document2.querySelectorAll("label")).filter(function(label) {
      return getControlOfLabel(label) === element;
    });
  }
  function getSlotContents(slot) {
    var assignedNodes = slot.assignedNodes();
    if (assignedNodes.length === 0) {
      return arrayFrom(slot.childNodes);
    }
    return assignedNodes;
  }
  function computeTextAlternative(root) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var consultedNodes = new SetLike$1();
    var computedStyles = typeof Map === "undefined" ? void 0 : /* @__PURE__ */ new Map();
    var window2 = safeWindow(root);
    var _options$compute = options.compute, compute = _options$compute === void 0 ? "name" : _options$compute, _options$computedStyl = options.computedStyleSupportsPseudoElements, computedStyleSupportsPseudoElements = _options$computedStyl === void 0 ? options.getComputedStyle !== void 0 : _options$computedStyl, _options$getComputedS = options.getComputedStyle, uncachedGetComputedStyle = _options$getComputedS === void 0 ? window2.getComputedStyle.bind(window2) : _options$getComputedS, _options$hidden = options.hidden, hidden = _options$hidden === void 0 ? false : _options$hidden;
    var getComputedStyle = function getComputedStyle2(el, pseudoElement) {
      if (pseudoElement !== void 0) {
        throw new Error("use uncachedGetComputedStyle directly for pseudo elements");
      }
      if (computedStyles === void 0) {
        return uncachedGetComputedStyle(el);
      }
      var cachedStyles = computedStyles.get(el);
      if (cachedStyles) {
        return cachedStyles;
      }
      var style = uncachedGetComputedStyle(el, pseudoElement);
      computedStyles.set(el, style);
      return style;
    };
    function computeMiscTextAlternative(node, context) {
      var accumulatedText = "";
      if (isElement(node) && computedStyleSupportsPseudoElements) {
        var pseudoBefore = uncachedGetComputedStyle(node, "::before");
        var beforeContent = getTextualContent(pseudoBefore);
        accumulatedText = "".concat(beforeContent, " ").concat(accumulatedText);
      }
      var childNodes = isHTMLSlotElement(node) ? getSlotContents(node) : arrayFrom(node.childNodes).concat(queryIdRefs(node, "aria-owns"));
      childNodes.forEach(function(child) {
        var result2 = computeTextAlternative2(child, {
          isEmbeddedInLabel: context.isEmbeddedInLabel,
          isReferenced: false,
          recursion: true
        });
        var display = isElement(child) ? getComputedStyle(child).getPropertyValue("display") : "inline";
        var separator = display !== "inline" ? " " : "";
        accumulatedText += "".concat(separator).concat(result2).concat(separator);
      });
      if (isElement(node) && computedStyleSupportsPseudoElements) {
        var pseudoAfter = uncachedGetComputedStyle(node, "::after");
        var afterContent = getTextualContent(pseudoAfter);
        accumulatedText = "".concat(accumulatedText, " ").concat(afterContent);
      }
      return accumulatedText.trim();
    }
    function useAttribute(element, attributeName) {
      var attribute = element.getAttributeNode(attributeName);
      if (attribute !== null && !consultedNodes.has(attribute) && attribute.value.trim() !== "") {
        consultedNodes.add(attribute);
        return attribute.value;
      }
      return null;
    }
    function computeTooltipAttributeValue(node) {
      if (!isElement(node)) {
        return null;
      }
      return useAttribute(node, "title");
    }
    function computeElementTextAlternative(node) {
      if (!isElement(node)) {
        return null;
      }
      if (isHTMLFieldSetElement(node)) {
        consultedNodes.add(node);
        var children = arrayFrom(node.childNodes);
        for (var i = 0; i < children.length; i += 1) {
          var child = children[i];
          if (isHTMLLegendElement(child)) {
            return computeTextAlternative2(child, {
              isEmbeddedInLabel: false,
              isReferenced: false,
              recursion: false
            });
          }
        }
      } else if (isHTMLTableElement(node)) {
        consultedNodes.add(node);
        var _children = arrayFrom(node.childNodes);
        for (var _i = 0; _i < _children.length; _i += 1) {
          var _child = _children[_i];
          if (isHTMLTableCaptionElement(_child)) {
            return computeTextAlternative2(_child, {
              isEmbeddedInLabel: false,
              isReferenced: false,
              recursion: false
            });
          }
        }
      } else if (isSVGSVGElement(node)) {
        consultedNodes.add(node);
        var _children2 = arrayFrom(node.childNodes);
        for (var _i2 = 0; _i2 < _children2.length; _i2 += 1) {
          var _child2 = _children2[_i2];
          if (isSVGTitleElement(_child2)) {
            return _child2.textContent;
          }
        }
        return null;
      } else if (getLocalName(node) === "img" || getLocalName(node) === "area") {
        var nameFromAlt = useAttribute(node, "alt");
        if (nameFromAlt !== null) {
          return nameFromAlt;
        }
      } else if (isHTMLOptGroupElement(node)) {
        var nameFromLabel = useAttribute(node, "label");
        if (nameFromLabel !== null) {
          return nameFromLabel;
        }
      }
      if (isHTMLInputElement(node) && (node.type === "button" || node.type === "submit" || node.type === "reset")) {
        var nameFromValue = useAttribute(node, "value");
        if (nameFromValue !== null) {
          return nameFromValue;
        }
        if (node.type === "submit") {
          return "Submit";
        }
        if (node.type === "reset") {
          return "Reset";
        }
      }
      var labels = getLabels(node);
      if (labels !== null && labels.length !== 0) {
        consultedNodes.add(node);
        return arrayFrom(labels).map(function(element) {
          return computeTextAlternative2(element, {
            isEmbeddedInLabel: true,
            isReferenced: false,
            recursion: true
          });
        }).filter(function(label) {
          return label.length > 0;
        }).join(" ");
      }
      if (isHTMLInputElement(node) && node.type === "image") {
        var _nameFromAlt = useAttribute(node, "alt");
        if (_nameFromAlt !== null) {
          return _nameFromAlt;
        }
        var nameFromTitle = useAttribute(node, "title");
        if (nameFromTitle !== null) {
          return nameFromTitle;
        }
        return "Submit Query";
      }
      if (hasAnyConcreteRoles(node, ["button"])) {
        var nameFromSubTree = computeMiscTextAlternative(node, {
          isEmbeddedInLabel: false
        });
        if (nameFromSubTree !== "") {
          return nameFromSubTree;
        }
      }
      return null;
    }
    function computeTextAlternative2(current, context) {
      if (consultedNodes.has(current)) {
        return "";
      }
      if (!hidden && isHidden(current, getComputedStyle) && !context.isReferenced) {
        consultedNodes.add(current);
        return "";
      }
      var labelAttributeNode = isElement(current) ? current.getAttributeNode("aria-labelledby") : null;
      var labelElements = labelAttributeNode !== null && !consultedNodes.has(labelAttributeNode) ? queryIdRefs(current, "aria-labelledby") : [];
      if (compute === "name" && !context.isReferenced && labelElements.length > 0) {
        consultedNodes.add(labelAttributeNode);
        return labelElements.map(function(element) {
          return computeTextAlternative2(element, {
            isEmbeddedInLabel: context.isEmbeddedInLabel,
            isReferenced: true,
            // this isn't recursion as specified, otherwise we would skip
            // `aria-label` in
            // <input id="myself" aria-label="foo" aria-labelledby="myself"
            recursion: false
          });
        }).join(" ");
      }
      var skipToStep2E = context.recursion && isControl(current) && compute === "name";
      if (!skipToStep2E) {
        var ariaLabel = (isElement(current) && current.getAttribute("aria-label") || "").trim();
        if (ariaLabel !== "" && compute === "name") {
          consultedNodes.add(current);
          return ariaLabel;
        }
        if (!isMarkedPresentational(current)) {
          var elementTextAlternative = computeElementTextAlternative(current);
          if (elementTextAlternative !== null) {
            consultedNodes.add(current);
            return elementTextAlternative;
          }
        }
      }
      if (hasAnyConcreteRoles(current, ["menu"])) {
        consultedNodes.add(current);
        return "";
      }
      if (skipToStep2E || context.isEmbeddedInLabel || context.isReferenced) {
        if (hasAnyConcreteRoles(current, ["combobox", "listbox"])) {
          consultedNodes.add(current);
          var selectedOptions = querySelectedOptions(current);
          if (selectedOptions.length === 0) {
            return isHTMLInputElement(current) ? current.value : "";
          }
          return arrayFrom(selectedOptions).map(function(selectedOption) {
            return computeTextAlternative2(selectedOption, {
              isEmbeddedInLabel: context.isEmbeddedInLabel,
              isReferenced: false,
              recursion: true
            });
          }).join(" ");
        }
        if (hasAbstractRole(current, "range")) {
          consultedNodes.add(current);
          if (current.hasAttribute("aria-valuetext")) {
            return current.getAttribute("aria-valuetext");
          }
          if (current.hasAttribute("aria-valuenow")) {
            return current.getAttribute("aria-valuenow");
          }
          return current.getAttribute("value") || "";
        }
        if (hasAnyConcreteRoles(current, ["textbox"])) {
          consultedNodes.add(current);
          return getValueOfTextbox(current);
        }
      }
      if (allowsNameFromContent(current) || isElement(current) && context.isReferenced || isNativeHostLanguageTextAlternativeElement(current) || isDescendantOfNativeHostLanguageTextAlternativeElement()) {
        var accumulatedText2F = computeMiscTextAlternative(current, {
          isEmbeddedInLabel: context.isEmbeddedInLabel
        });
        if (accumulatedText2F !== "") {
          consultedNodes.add(current);
          return accumulatedText2F;
        }
      }
      if (current.nodeType === current.TEXT_NODE) {
        consultedNodes.add(current);
        return current.textContent || "";
      }
      if (context.recursion) {
        consultedNodes.add(current);
        return computeMiscTextAlternative(current, {
          isEmbeddedInLabel: context.isEmbeddedInLabel
        });
      }
      var tooltipAttributeValue = computeTooltipAttributeValue(current);
      if (tooltipAttributeValue !== null) {
        consultedNodes.add(current);
        return tooltipAttributeValue;
      }
      consultedNodes.add(current);
      return "";
    }
    return asFlatString(computeTextAlternative2(root, {
      isEmbeddedInLabel: false,
      // by spec computeAccessibleDescription starts with the referenced elements as roots
      isReferenced: compute === "description",
      recursion: false
    }));
  }
  function prohibitsNaming(node) {
    return hasAnyConcreteRoles(node, ["caption", "code", "deletion", "emphasis", "generic", "insertion", "none", "paragraph", "presentation", "strong", "subscript", "superscript"]);
  }
  function computeAccessibleName(root) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (prohibitsNaming(root)) {
      return "";
    }
    return computeTextAlternative(root, options);
  }
  function getElementFlattenedText(el, visited = /* @__PURE__ */ new Set()) {
    if (visited.has(el)) return "";
    visited.add(el);
    let text = "";
    for (let i = 0; i < el.childNodes.length; i++) {
      const node = el.childNodes[i];
      if (!node) continue;
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.nodeValue || "";
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const childEl = node;
        const tag = childEl.tagName.toLowerCase();
        if (tag === "input" || tag === "select" || tag === "textarea") {
          const inputVal = childEl.value;
          if (inputVal && childEl.type !== "password") {
            text += " " + inputVal;
          }
        } else {
          text += " " + getElementFlattenedText(childEl, visited);
        }
      }
    }
    return text.trim().replace(/\s+/g, " ");
  }
  function resolveIdReferences(idList, contextDoc) {
    if (!idList || typeof idList !== "string") {
      return { text: null, foundIds: [], hasHidden: false };
    }
    const ids = idList.trim().split(/\s+/).filter(Boolean);
    if (ids.length === 0) {
      return { text: null, foundIds: [], hasHidden: false };
    }
    const doc = contextDoc || (typeof document !== "undefined" ? document : null);
    if (!doc) {
      return { text: null, foundIds: [], hasHidden: false };
    }
    const parts = [];
    const foundIds = [];
    let hasHidden = false;
    for (const id of ids) {
      try {
        const target = doc.getElementById(id);
        if (!target) {
          continue;
        }
        foundIds.push(id);
        if (typeof window !== "undefined" && typeof window.getComputedStyle === "function") {
          try {
            const style = window.getComputedStyle(target);
            if (style.display === "none" || style.visibility === "hidden" || target.hasAttribute("hidden") || target.getAttribute("aria-hidden") === "true") {
              hasHidden = true;
            }
          } catch {
            if (target.hasAttribute("hidden") || target.getAttribute("aria-hidden") === "true") {
              hasHidden = true;
            }
          }
        } else {
          if (target.hasAttribute("hidden") || target.getAttribute("aria-hidden") === "true") {
            hasHidden = true;
          }
        }
        const content2 = getElementFlattenedText(target);
        if (content2) {
          parts.push(content2);
        }
      } catch {
      }
    }
    const combined = parts.join(" ").trim().replace(/\s+/g, " ");
    return {
      text: combined.length > 0 ? combined : null,
      foundIds,
      hasHidden
    };
  }
  function resolveHtmlLabels(el, contextDoc) {
    var _a;
    const doc = contextDoc || el.ownerDocument || (typeof document !== "undefined" ? document : null);
    if (!doc) return null;
    const parts = [];
    if (el.id) {
      try {
        const safeId = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(el.id) : el.id.replace(/["\\]/g, "\\$&");
        const matchingLabels = doc.querySelectorAll(`label[for="${safeId}"]`);
        matchingLabels.forEach((lbl) => {
          const text = getElementFlattenedText(lbl);
          if (text) parts.push(text);
        });
      } catch {
      }
    }
    if (parts.length === 0) {
      try {
        const enclosing = el.closest("label");
        if (enclosing) {
          const clone = enclosing.cloneNode(true);
          const controls = clone.querySelectorAll("input, select, textarea, button");
          controls.forEach((c) => c.remove());
          const text = (_a = clone.textContent) == null ? void 0 : _a.trim().replace(/\s+/g, " ");
          if (text) parts.push(text);
        }
      } catch {
      }
    }
    const result2 = parts.join(" ").trim().replace(/\s+/g, " ");
    return result2.length > 0 ? result2 : null;
  }
  function resolveNativeSemantics(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === "input") {
      const input = el;
      const type = (input.type || "text").toLowerCase();
      if (type === "button" || type === "submit" || type === "reset") {
        if (input.value && input.value.trim()) {
          return input.value.trim();
        }
      }
    }
    if (tag === "img" || tag === "area") {
      const alt = el.getAttribute("alt");
      if (alt && alt.trim()) return alt.trim();
    }
    if (tag === "fieldset") {
      const legend = el.querySelector("legend");
      if (legend && legend.textContent) {
        const text = legend.textContent.trim().replace(/\s+/g, " ");
        if (text) return text;
      }
    }
    if (tag === "table") {
      const caption = el.querySelector("caption");
      if (caption && caption.textContent) {
        const text = caption.textContent.trim().replace(/\s+/g, " ");
        if (text) return text;
      }
    }
    if (tag === "details") {
      const summary = el.querySelector("summary");
      if (summary && summary.textContent) {
        const text = summary.textContent.trim().replace(/\s+/g, " ");
        if (text) return text;
      }
    }
    if (tag === "button" || tag === "a") {
      const text = getElementFlattenedText(el);
      if (text) return text;
    }
    return null;
  }
  function resolveAriaMetadata(el, contextDoc) {
    var _a, _b;
    const doc = el.ownerDocument || (typeof document !== "undefined" ? document : null);
    let name = null;
    let nameSource = null;
    let hasHiddenRef = false;
    const referencedIds = [];
    const labelledByAttr = el.getAttribute("aria-labelledby");
    if (labelledByAttr && doc) {
      const res = resolveIdReferences(labelledByAttr, doc);
      if (res.text) {
        name = res.text;
        nameSource = "aria-labelledby";
        if (res.hasHidden) hasHiddenRef = true;
        referencedIds.push(...res.foundIds);
      }
    }
    if (!name) {
      const ariaLabel = el.getAttribute("aria-label");
      if (ariaLabel && ariaLabel.trim()) {
        name = ariaLabel.trim();
        nameSource = "aria-label";
      }
    }
    if (!name) {
      const labelText = resolveHtmlLabels(el, doc);
      if (labelText) {
        name = labelText;
        nameSource = "label";
      }
    }
    if (!name) {
      const native = resolveNativeSemantics(el);
      if (native) {
        name = native;
        nameSource = "native";
      }
    }
    if (!name) {
      try {
        const computed = computeAccessibleName(el);
        if (computed && computed.trim()) {
          const trimmed = computed.trim();
          const titleAttr = (_a = el.getAttribute("title")) == null ? void 0 : _a.trim();
          const phAttr = (_b = el.getAttribute("placeholder")) == null ? void 0 : _b.trim();
          name = trimmed;
          if (titleAttr && trimmed === titleAttr) {
            nameSource = "title";
          } else if (phAttr && trimmed === phAttr) {
            nameSource = "placeholder";
          } else {
            nameSource = "native";
          }
        }
      } catch {
      }
    }
    if (!name) {
      const title = el.getAttribute("title");
      if (title && title.trim()) {
        name = title.trim();
        nameSource = "title";
      }
    }
    if (!name) {
      const placeholder = el.getAttribute("placeholder");
      if (placeholder && placeholder.trim()) {
        name = placeholder.trim();
        nameSource = "placeholder";
      }
    }
    let description = null;
    let descriptionSource = null;
    const describedByAttr = el.getAttribute("aria-describedby");
    if (describedByAttr && doc) {
      const res = resolveIdReferences(describedByAttr, doc);
      if (res.text) {
        description = res.text;
        descriptionSource = "aria-describedby";
        if (res.hasHidden) hasHiddenRef = true;
        referencedIds.push(...res.foundIds);
      }
    }
    if (!description) {
      const ariaDesc = el.getAttribute("aria-description");
      if (ariaDesc && ariaDesc.trim()) {
        description = ariaDesc.trim();
        descriptionSource = "aria-description";
      }
    }
    if (!description && nameSource !== "title") {
      const title = el.getAttribute("title");
      if (title && title.trim()) {
        description = title.trim();
        descriptionSource = "title";
      }
    }
    if (!description && nameSource !== "placeholder") {
      const placeholder = el.getAttribute("placeholder");
      if (placeholder && placeholder.trim()) {
        description = placeholder.trim();
        descriptionSource = "placeholder";
      }
    }
    return {
      name,
      nameSource,
      description,
      descriptionSource,
      hasHiddenReference: hasHiddenRef,
      referencedIds
    };
  }
  content;
  function computeElementAccessibleName(el) {
    try {
      const meta = resolveAriaMetadata(el);
      if (meta.name) return meta.name;
    } catch {
    }
    const ariaLabel = el.getAttribute("aria-label");
    if (ariaLabel) return ariaLabel.trim();
    const title = el.getAttribute("title");
    if (title) return title.trim();
    const placeholder = el.getAttribute("placeholder");
    if (placeholder) return placeholder.trim();
    const alt = el.getAttribute("alt");
    if (alt) return alt.trim();
    return null;
  }
  content;
  function getLocalFrameOffset() {
    if (typeof window === "undefined") return [0, 0];
    try {
      if (window.self === window.top) {
        return [0, 0];
      }
      if (window.frameElement) {
        const rect = window.frameElement.getBoundingClientRect();
        return [rect.left, rect.top];
      }
    } catch {
    }
    return [0, 0];
  }
  content;
  const domElementMap = /* @__PURE__ */ new Map();
  const regionToDomMap = /* @__PURE__ */ new Map();
  const elementRegistry = {
    register(domId, el) {
      domElementMap.set(domId, new WeakRef(el));
    },
    get(domId) {
      const ref = domElementMap.get(domId);
      if (!ref) return null;
      const el = ref.deref();
      if (!el || !el.isConnected) {
        domElementMap.delete(domId);
        return null;
      }
      return el;
    },
    setRegionMapping(mapping) {
      for (const [regionId, domId] of Object.entries(mapping)) {
        regionToDomMap.set(regionId, domId);
      }
    },
    getByRegionId(regionId) {
      const domId = regionToDomMap.get(regionId);
      if (!domId) return null;
      return this.get(domId);
    },
    clear() {
      domElementMap.clear();
      regionToDomMap.clear();
    }
  };
  content;
  async function sha256Hex(input) {
    const data = typeof input === "string" ? new TextEncoder().encode(input) : input;
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function canonicalJson(obj) {
    if (obj === null || typeof obj !== "object") {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return "[" + obj.map(canonicalJson).join(",") + "]";
    }
    const keys = Object.keys(obj).sort();
    const pairs = keys.map((key) => {
      const val = obj[key];
      return JSON.stringify(key) + ":" + canonicalJson(val);
    });
    return "{" + pairs.join(",") + "}";
  }
  content;
  async function computePageStateHash(origin, path, frames, elements, scrollY = 0, options = {}) {
    const scrollBucket = Math.floor(scrollY / 64);
    const dialogOpen = elements.some((el) => el.tag === "dialog" && el.visible);
    let interactiveElements = elements.filter((el) => el.visible && el.interactable);
    if (options.mode === "target-scoped" && options.targetBBox) {
      const [tx, ty, tw, th] = options.targetBBox;
      interactiveElements = interactiveElements.filter((el) => {
        const [ex, ey] = el.bbox;
        return Math.abs(ex - tx) < tw + 150 && Math.abs(ey - ty) < th + 150;
      });
    }
    const interactiveSummary = interactiveElements.map((el) => ({
      tag: el.tag,
      role: el.role,
      name: el.name,
      bbox: roundBBoxToStep(el.bbox, 4),
      disabled: el.aria.disabled,
      checked: el.aria.checked
    }));
    const payload = {
      origin,
      path,
      frames: frames.map((f) => ({ id: f.frame_id, origin: f.origin })),
      dialogOpen,
      scrollBucket,
      interactive: interactiveSummary
    };
    const rawJson = canonicalJson(payload);
    const fullHash = await sha256Hex(rawJson);
    return fullHash.slice(0, 16);
  }
  content;
  function resolveAssociatedLabel(el) {
    try {
      const meta = resolveAriaMetadata(el);
      if (meta.nameSource === "aria-labelledby" || meta.nameSource === "label" || meta.nameSource === "aria-label") {
        return meta.name;
      }
    } catch {
    }
    return null;
  }
  function computeElementDescription(el) {
    try {
      const meta = resolveAriaMetadata(el);
      return meta.description;
    } catch {
    }
    return null;
  }
  function resolveFormAssociation(el) {
    try {
      const formAttr = el.getAttribute("form");
      if (formAttr) return formAttr;
      const formEl = el.closest("form");
      if (formEl) {
        return formEl.id || formEl.getAttribute("name") || "form";
      }
    } catch {
    }
    return null;
  }
  function computeStableSelector(el) {
    try {
      const tag = el.tagName.toLowerCase();
      if (el.id) {
        return `#${el.id}`;
      }
      const name = el.getAttribute("name");
      if (name) {
        return `${tag}[name="${name}"]`;
      }
      const role = el.getAttribute("role");
      if (role) {
        return `${tag}[role="${role}"]`;
      }
      const parent = el.parentElement;
      if (parent) {
        const parentTag = parent.tagName.toLowerCase();
        const parentId = parent.id ? `#${parent.id}` : parentTag;
        const index = Array.from(parent.children).indexOf(el) + 1;
        return `${parentId} > ${tag}:nth-child(${index})`;
      }
      return tag;
    } catch {
      return el.tagName ? el.tagName.toLowerCase() : "unknown";
    }
  }
  function extractEnhancedDomMetadata(el) {
    const element_id = el.id ? el.id : null;
    const element_name = el.getAttribute("name") || null;
    const aria_label = el.getAttribute("aria-label") || null;
    const aria_labelledby = el.getAttribute("aria-labelledby") || null;
    const aria_describedby = el.getAttribute("aria-describedby") || null;
    const label = resolveAssociatedLabel(el);
    const description = computeElementDescription(el);
    const form_id = resolveFormAssociation(el);
    const stable_selector = computeStableSelector(el);
    return {
      element_id,
      element_name,
      label,
      description,
      aria_label,
      aria_labelledby,
      aria_describedby,
      form_id,
      stable_selector
    };
  }
  content;
  const CANDIDATE_SELECTOR = [
    "a[href]",
    "button",
    "input",
    "select",
    "textarea",
    "details",
    "summary",
    "dialog",
    "[role]",
    "[tabindex]",
    "[contenteditable]",
    "label",
    "h1, h2, h3, h4, h5, h6, p, blockquote, th, td, li, dt, dd, figcaption",
    "canvas",
    "svg",
    "img",
    "video",
    "iframe",
    '[class*="avatar"]',
    '[class*="profile"]',
    '[class*="user"]',
    '[class*="photo"]',
    '[class*="thumb"]'
  ].join(",");
  const elementCache = /* @__PURE__ */ new WeakMap();
  let nextId = 1;
  let nextPiiId = 1;
  function markDirty(el) {
    if (!el) return;
    elementCache.delete(el);
  }
  async function extractDomSnapshot(frameId = "main", parentFrameId = null) {
    var _a, _b;
    if (typeof document === "undefined" || typeof window === "undefined") {
      return {
        snapshot_id: `snap_${Date.now()}`,
        url_origin: "http://localhost:5173",
        url_path: "/",
        frames: [
          {
            frame_id: frameId,
            parent_frame_id: parentFrameId,
            origin: "http://localhost:5173",
            path: "/",
            offset: [0, 0],
            accessible: true
          }
        ],
        elements: [],
        viewport: { w: 1280, h: 800 },
        dpr: 1,
        scroll: { x: 0, y: 0 },
        page_state_hash: "0000000000000000",
        ts: Date.now()
      };
    }
    const urlOrigin = window.location.origin;
    const urlPath = window.location.pathname;
    const frameOffset = getLocalFrameOffset();
    const viewport = {
      w: ((_a = document.documentElement) == null ? void 0 : _a.clientWidth) || window.innerWidth,
      h: ((_b = document.documentElement) == null ? void 0 : _b.clientHeight) || window.innerHeight
    };
    const frames = [
      {
        frame_id: frameId,
        parent_frame_id: parentFrameId,
        origin: urlOrigin,
        path: urlPath,
        offset: frameOffset,
        accessible: true
      }
    ];
    const rawElements = /* @__PURE__ */ new Set();
    function collectNodes(root) {
      var _a2, _b2;
      const children = root.querySelectorAll("*");
      for (let i = 0; i < children.length; i++) {
        const el = children[i];
        if (!el) continue;
        let sRoot = el.shadowRoot || null;
        if (!sRoot && typeof chrome !== "undefined" && ((_a2 = chrome.dom) == null ? void 0 : _a2.openOrClosedShadowRoot)) {
          try {
            sRoot = chrome.dom.openOrClosedShadowRoot(el);
          } catch {
          }
        }
        if (sRoot) {
          collectNodes(sRoot);
        }
        if (rawElements.has(el)) continue;
        let cached = elementCache.get(el);
        if (cached) {
          if (cached.isMeaningful) rawElements.add(el);
          continue;
        }
        let isMeaningful = false;
        try {
          if (el.matches && el.matches(CANDIDATE_SELECTOR)) {
            isMeaningful = true;
          }
        } catch {
        }
        if (!isMeaningful) {
          const htmlEl = el;
          if (el.onclick || ((_b2 = htmlEl.style) == null ? void 0 : _b2.cursor) === "pointer" || el.hasAttribute("onclick")) {
            isMeaningful = true;
          } else {
            if (el.hasChildNodes()) {
              const childNodes = el.childNodes;
              for (let j = 0; j < childNodes.length; j++) {
                const child = childNodes[j];
                if (child && child.nodeType === Node.TEXT_NODE) {
                  const text = child.nodeValue;
                  if (text && text.trim().length > 0) {
                    isMeaningful = true;
                    break;
                  }
                }
              }
            }
            if (!isMeaningful && el.children.length === 0) {
              const computed = window.getComputedStyle(el);
              if (computed.backgroundImage && computed.backgroundImage !== "none" && computed.backgroundImage.includes("url(")) {
                const rect = el.getBoundingClientRect();
                if (rect.width > 10 && rect.height > 10) {
                  isMeaningful = true;
                }
              }
            }
          }
        }
        if (isMeaningful) {
          rawElements.add(el);
          elementCache.set(el, { isMeaningful: true });
        } else {
          elementCache.set(el, { isMeaningful: false });
        }
      }
    }
    collectNodes(document);
    const filtered = Array.from(rawElements).filter(
      (el) => !el.closest("[data-agent-ui]") && el.id !== "__sih_agent_ui_host__"
    );
    const elements = [];
    for (const el of filtered) {
      let cached = elementCache.get(el);
      if (!cached) continue;
      if (!cached.domId) {
        cached.domId = `d${nextId++}`;
      }
      const domId = cached.domId;
      elementRegistry.register(domId, el);
      const rect = el.getBoundingClientRect();
      const bbox = [
        Math.round(rect.left + frameOffset[0]),
        Math.round(rect.top + frameOffset[1]),
        Math.round(rect.width),
        Math.round(rect.height)
      ];
      const visible = isElementVisible(el);
      const inViewport = rect.bottom >= 0 && rect.right >= 0 && rect.top <= viewport.h && rect.left <= viewport.w;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const occluded = isElementOccluded(el, cx, cy);
      if (!cached.staticInfo) {
        const tag = el.tagName.toLowerCase();
        const role = computeAriaRole(el);
        const name = computeElementAccessibleName(el);
        const aria = extractAriaStates(el);
        const { rendering, has_bg_image, handlers_hint } = detectRenderingKind(el);
        let inputInfo = void 0;
        if (tag === "input" || tag === "textarea" || tag === "select") {
          const inputEl = el;
          const type = (inputEl.type || "text").toLowerCase();
          const isPassword = type === "password";
          const hasValue = Boolean(inputEl.value && inputEl.value.length > 0);
          inputInfo = {
            type,
            autocomplete: inputEl.autocomplete || null,
            name: inputEl.name || null,
            placeholder: inputEl.placeholder || null,
            is_password: isPassword,
            has_value: hasValue,
            value: isPassword ? null : inputEl.value || null
          };
        }
        const attrs = {};
        const addAttr = (name2) => {
          const val = el.getAttribute(name2);
          if (val) attrs[name2] = val;
        };
        addAttr("alt");
        addAttr("title");
        addAttr("aria-description");
        addAttr("label");
        addAttr("autocomplete");
        let extractedText = "";
        const piiMatches = [];
        for (let j = 0; j < el.childNodes.length; j++) {
          const child = el.childNodes[j];
          if (child && child.nodeType === Node.TEXT_NODE) {
            const rawText = child.nodeValue || "";
            if (!rawText.trim()) {
              extractedText += rawText;
              continue;
            }
            let modifiedText = rawText;
            const matches = [];
            for (const m of rawText.matchAll(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g)) {
              matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "EMAIL" });
            }
            for (const m of rawText.matchAll(/\b[2-9]\d{3}[\s-]?\d{4}[\s-]?\d{4}\b/g)) {
              const clean = m[0].replace(/[\s-]/g, "");
              if (/^[2-9]\d{11}$/.test(clean)) {
                let c = 0;
                const VERHOEFF_D = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1], [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]];
                const VERHOEFF_P = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1], [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]];
                const digits = clean.split("").map(Number).reverse();
                let valid = true;
                for (let i = 0; i < digits.length; i++) {
                  if (digits[i] === void 0) {
                    valid = false;
                    break;
                  }
                  c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digits[i]]];
                }
                if (valid && c === 0) {
                  matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "AADHAAR" });
                }
              }
            }
            for (const m of rawText.matchAll(/\b[A-Za-z]{5}\d{4}[A-Za-z]\b/g)) {
              if (/^[A-Z]{3}[PCHFATBLJG][A-Z]\d{4}[A-Z]$/.test(m[0].trim().toUpperCase())) {
                matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "PAN" });
              }
            }
            for (const m of rawText.matchAll(new RegExp("(?<!\\d)(?:(?:\\+91|0)[\\s-]?)?[6-9](?:[\\s-]?\\d){9}(?!\\d)", "g"))) {
              matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], type: "PHONE" });
            }
            matches.sort((a, b) => b.start - a.start);
            for (const m of matches) {
              piiMatches.push({ nodeIndex: j, start: m.start, end: m.end, text: m.text, type: m.type });
              modifiedText = modifiedText.substring(0, m.start) + `<${m.type}>` + modifiedText.substring(m.end);
            }
            extractedText += modifiedText + " ";
          }
        }
        const text = extractedText.trim().replace(/\s+/g, " ").slice(0, 300);
        const classes = Array.from(el.classList);
        const enhanced = extractEnhancedDomMetadata(el);
        cached.staticInfo = {
          tag,
          role,
          name,
          aria,
          rendering,
          has_bg_image,
          handlers_hint,
          inputInfo,
          extractedText: text,
          classes,
          piiMatches,
          attributes: attrs,
          enhanced
        };
      }
      const s = cached.staticInfo;
      const interactable = visible && !s.aria.disabled && !occluded;
      for (const m of s.piiMatches) {
        try {
          const child = el.childNodes[m.nodeIndex];
          if (child && child.nodeType === Node.TEXT_NODE) {
            const range = document.createRange();
            range.setStart(child, m.start);
            range.setEnd(child, m.end);
            const rects = range.getClientRects();
            for (let k = 0; k < rects.length; k++) {
              const rect2 = rects[k];
              if (rect2 && rect2.width > 0 && rect2.height > 0) {
                elements.push({
                  dom_id: `pii_span_${nextPiiId++}`,
                  frame_id: frameId,
                  origin: urlOrigin,
                  tag: "span",
                  role: null,
                  name: null,
                  text: m.text,
                  bbox: [
                    Math.round(rect2.left + frameOffset[0]),
                    Math.round(rect2.top + frameOffset[1]),
                    Math.round(rect2.width),
                    Math.round(rect2.height)
                  ],
                  aria: {},
                  visible: true,
                  in_viewport: true,
                  occluded: false,
                  interactable: false,
                  rendering: "html",
                  has_bg_image: false,
                  handlers_hint: false,
                  parent_dom_id: domId
                });
              }
            }
          }
        } catch (e) {
        }
      }
      elements.push({
        dom_id: domId,
        frame_id: frameId,
        origin: urlOrigin,
        tag: s.tag,
        role: s.role,
        name: s.name,
        text: s.extractedText,
        classes: s.classes,
        aria: s.aria,
        input: s.inputInfo,
        attributes: s.attributes,
        bbox,
        visible,
        in_viewport: inViewport,
        occluded,
        interactable,
        rendering: s.rendering,
        has_bg_image: s.has_bg_image,
        handlers_hint: s.handlers_hint,
        parent_dom_id: null,
        element_id: s.enhanced.element_id,
        element_name: s.enhanced.element_name,
        label: s.enhanced.label,
        description: s.enhanced.description,
        aria_label: s.enhanced.aria_label,
        aria_labelledby: s.enhanced.aria_labelledby,
        aria_describedby: s.enhanced.aria_describedby,
        form_id: s.enhanced.form_id,
        stable_selector: s.enhanced.stable_selector
      });
    }
    const pageStateHash = await computePageStateHash(
      urlOrigin,
      urlPath,
      frames,
      elements,
      window.scrollY
    );
    return {
      snapshot_id: `snap_${Date.now()}`,
      url_origin: urlOrigin,
      url_path: urlPath,
      frames,
      elements,
      viewport,
      dpr: window.devicePixelRatio || 1,
      scroll: { x: window.scrollX, y: window.scrollY },
      page_state_hash: pageStateHash,
      ts: Date.now()
    };
  }
  content;
  let mutationObserver = null;
  let lastScrollY = 0;
  let scrollTimeout = null;
  let dirtyTimeout = null;
  let batchedBBox = null;
  let activeScrollListener = null;
  function stopDomObservers() {
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
    if (scrollTimeout) clearTimeout(scrollTimeout);
    if (dirtyTimeout) clearTimeout(dirtyTimeout);
    if (activeScrollListener && typeof window !== "undefined") {
      window.removeEventListener("scroll", activeScrollListener);
      activeScrollListener = null;
    }
  }
  function startDomObservers(frameId = "main") {
    if (typeof document === "undefined") return () => {
    };
    stopDomObservers();
    mutationObserver = new MutationObserver((mutations) => {
      let hasMeaningful = false;
      for (const m of mutations) {
        let target = m.target;
        if (m.type === "characterData") {
          target = m.target.parentElement;
        }
        if (!target || !target.closest) continue;
        if (target.closest("[data-agent-ui]") || target.id === "__sih_agent_ui_host__") {
          continue;
        }
        if (m.type === "childList") {
          let onlyExtensionNodes = true;
          if (m.addedNodes.length === 0 && m.removedNodes.length === 0) {
            onlyExtensionNodes = false;
          }
          m.addedNodes.forEach((n) => {
            var _a;
            const el = n;
            if (el.nodeType !== Node.ELEMENT_NODE) {
              onlyExtensionNodes = false;
              return;
            }
            if (el.id !== "__sih_agent_ui_host__" && !((_a = el.hasAttribute) == null ? void 0 : _a.call(el, "data-agent-ui"))) {
              onlyExtensionNodes = false;
              markDirty(el);
            }
          });
          m.removedNodes.forEach((n) => {
            var _a;
            const el = n;
            if (el.nodeType !== Node.ELEMENT_NODE) {
              onlyExtensionNodes = false;
              return;
            }
            if (el.id !== "__sih_agent_ui_host__" && !((_a = el.hasAttribute) == null ? void 0 : _a.call(el, "data-agent-ui"))) {
              onlyExtensionNodes = false;
            }
          });
          if (onlyExtensionNodes) {
            continue;
          }
        }
        markDirty(target);
        hasMeaningful = true;
        if (!batchedBBox && target.getBoundingClientRect) {
          const rect = target.getBoundingClientRect();
          batchedBBox = [rect.left, rect.top, rect.width, rect.height];
        }
      }
      if (!hasMeaningful) return;
      if (!dirtyTimeout) {
        dirtyTimeout = setTimeout(() => {
          const event = {
            reason: "mutation",
            bbox: batchedBBox,
            frame_id: frameId,
            ts: Date.now()
          };
          bus.send("dom/dirty", event).catch(() => {
          });
          batchedBBox = null;
          dirtyTimeout = null;
        }, 100);
      }
    });
    mutationObserver.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "hidden", "aria-hidden", "disabled"],
      characterData: true
      // Required for text changes
    });
    const onScroll = () => {
      if (Math.abs(window.scrollY - lastScrollY) < 32) return;
      lastScrollY = window.scrollY;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const event = {
          reason: "scroll",
          bbox: null,
          frame_id: frameId,
          ts: Date.now()
        };
        bus.send("dom/dirty", event).catch(() => {
        });
      }, 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    activeScrollListener = onScroll;
    return () => {
      stopDomObservers();
    };
  }
  content;
  let agentUiContainer = null;
  let agentUiShadow = null;
  function ensureAgentUiHost() {
    if (agentUiShadow && agentUiContainer && agentUiContainer.isConnected) {
      return agentUiShadow;
    }
    agentUiContainer = document.createElement("div");
    agentUiContainer.setAttribute("data-agent-ui", "true");
    agentUiContainer.id = "__sih_agent_ui_host__";
    agentUiContainer.style.position = "fixed";
    agentUiContainer.style.top = "0";
    agentUiContainer.style.left = "0";
    agentUiContainer.style.width = "0";
    agentUiContainer.style.height = "0";
    agentUiContainer.style.zIndex = "2147483647";
    agentUiContainer.style.pointerEvents = "none";
    agentUiShadow = agentUiContainer.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = `
    .action-highlight {
      position: absolute;
      border: 2px solid #3b82f6;
      background: rgba(59, 130, 246, 0.15);
      border-radius: 4px;
      pointer-events: none;
      transition: opacity 0.3s ease-out;
      box-sizing: border-box;
    }
  `;
    agentUiShadow.appendChild(style);
    document.documentElement.appendChild(agentUiContainer);
    return agentUiShadow;
  }
  function showActionHighlight(bbox, durationMs = 800) {
    if (typeof document === "undefined") return;
    const shadow = ensureAgentUiHost();
    const box = document.createElement("div");
    box.className = "action-highlight";
    box.style.left = `${bbox[0]}px`;
    box.style.top = `${bbox[1]}px`;
    box.style.width = `${bbox[2]}px`;
    box.style.height = `${bbox[3]}px`;
    shadow.appendChild(box);
    setTimeout(() => {
      box.style.opacity = "0";
      setTimeout(() => {
        box.remove();
      }, 300);
    }, durationMs);
  }
  content;
  async function executeClick(el) {
    el.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    if (typeof document.elementFromPoint === "function") {
      const atPoint = document.elementFromPoint(cx, cy);
      if (atPoint && atPoint !== el && !el.contains(atPoint)) {
        throw new Error(`Click blocked: target is obscured by decoy element <${atPoint.tagName.toLowerCase()}>`);
      }
    }
    showActionHighlight([rect.left, rect.top, rect.width, rect.height]);
    const opts = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: cx,
      clientY: cy
    };
    el.dispatchEvent(new PointerEvent("pointerdown", opts));
    el.dispatchEvent(new MouseEvent("mousedown", opts));
    el.dispatchEvent(new PointerEvent("pointerup", opts));
    el.dispatchEvent(new MouseEvent("mouseup", opts));
    el.dispatchEvent(new MouseEvent("click", opts));
    if (typeof el.click === "function") {
      el.click();
    }
  }
  content;
  function setNativeValue(el, val) {
    const isTextarea = el.tagName.toLowerCase() === "textarea";
    const prototype = isTextarea ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
    if (descriptor == null ? void 0 : descriptor.set) {
      descriptor.set.call(el, val);
    } else {
      el.value = val;
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }
  async function executeType(el, text) {
    const htmlEl = el;
    htmlEl.focus();
    const rect = el.getBoundingClientRect();
    showActionHighlight([rect.left, rect.top, rect.width, rect.height]);
    setNativeValue(htmlEl, text);
    if (htmlEl.value !== text) {
      throw new Error("Type action failed: Element value did not update.");
    }
  }
  async function executeFillSecret(el, secretValue) {
    let ephemeralSecret = secretValue;
    try {
      const htmlEl = el;
      htmlEl.focus();
      const rect = el.getBoundingClientRect();
      showActionHighlight([rect.left, rect.top, rect.width, rect.height]);
      setNativeValue(htmlEl, ephemeralSecret);
      if (htmlEl.value !== ephemeralSecret) {
        throw new Error("Fill secret action failed: Element value did not update.");
      }
    } finally {
      ephemeralSecret = "0000000000000000";
      ephemeralSecret = null;
    }
  }
  content;
  async function executeSelect(el, optionTextOrValue) {
    const rect = el.getBoundingClientRect();
    showActionHighlight([rect.left, rect.top, rect.width, rect.height]);
    if (el.tagName.toLowerCase() === "select") {
      const selectEl = el;
      let found = false;
      for (let i = 0; i < selectEl.options.length; i++) {
        const opt = selectEl.options[i];
        if (opt && (opt.value === optionTextOrValue || opt.text.trim() === optionTextOrValue.trim())) {
          selectEl.selectedIndex = i;
          found = true;
          break;
        }
      }
      if (!found) {
        throw new Error(`Option "${optionTextOrValue}" not found in select element`);
      }
      selectEl.dispatchEvent(new Event("input", { bubbles: true }));
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      el.click();
    }
  }
  content;
  async function executeScroll(direction = "down", rawAmount = 300) {
    const amount = Math.min(Math.max(10, rawAmount), 1200);
    let dx = 0;
    let dy = 0;
    switch (direction) {
      case "up":
        dy = -amount;
        break;
      case "down":
        dy = amount;
        break;
      case "left":
        dx = -amount;
        break;
      case "right":
        dx = amount;
        break;
    }
    if (typeof window !== "undefined") {
      const startX = window.scrollX;
      const startY = window.scrollY;
      window.scrollBy({ left: dx, top: dy, behavior: "instant" });
      if (window.scrollX === startX && window.scrollY === startY) {
        throw new Error(`Scroll ${direction} failed: No change in scroll position. Already at edge or not scrollable.`);
      }
    }
  }
  content;
  const ALLOWED_KEYS = /* @__PURE__ */ new Set([
    "Enter",
    "Tab",
    "Escape",
    "Backspace",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight"
  ]);
  async function executeKeypress(key) {
    if (!ALLOWED_KEYS.has(key)) {
      throw new Error(`Key "${key}" is not in whitelisted allowed keys`);
    }
    const target = document.activeElement || document.body;
    const opts = {
      key,
      bubbles: true,
      cancelable: true
    };
    target.dispatchEvent(new KeyboardEvent("keydown", opts));
    target.dispatchEvent(new KeyboardEvent("keypress", opts));
    target.dispatchEvent(new KeyboardEvent("keyup", opts));
  }
  content;
  async function waitForSettle(debounceMs = 150, maxWaitMs = 2e3) {
    if (typeof document === "undefined") return;
    return new Promise((resolve) => {
      let timeout = null;
      let maxTimeout = null;
      const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(done, debounceMs);
      });
      const done = () => {
        observer.disconnect();
        clearTimeout(timeout);
        clearTimeout(maxTimeout);
        resolve();
      };
      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true
      });
      timeout = setTimeout(done, debounceMs);
      maxTimeout = setTimeout(done, maxWaitMs);
    });
  }
  content;
  async function executeAction(action, resolvedSecret) {
    var _a, _b, _c, _d, _e, _f;
    let targetEl = null;
    if (action.target) {
      targetEl = elementRegistry.getByRegionId(action.target.region_id);
      if (!targetEl) {
        return {
          ok: false,
          action_id: action.action_id,
          navigated: false,
          new_page_state_hash: null,
          error: stageError(
            "TARGET_NOT_FOUND",
            "execute",
            `Cannot execute: element for region "${action.target.region_id}" is disconnected or not found`
          )
        };
      }
    }
    try {
      switch (action.action) {
        case "click": {
          if (!targetEl) throw new Error("Click requires a target element");
          await executeClick(targetEl);
          break;
        }
        case "type": {
          if (!targetEl) throw new Error("Type requires a target element");
          await executeType(targetEl, ((_a = action.params) == null ? void 0 : _a.text) || "");
          break;
        }
        case "fill_secret": {
          if (!targetEl) throw new Error("fill_secret requires a target element");
          if (!resolvedSecret) throw new Error("fill_secret requires a resolved secret value");
          await executeFillSecret(targetEl, resolvedSecret);
          break;
        }
        case "select": {
          if (!targetEl) throw new Error("Select requires a target element");
          await executeSelect(targetEl, ((_b = action.params) == null ? void 0 : _b.option) || "");
          break;
        }
        case "scroll": {
          await executeScroll((_c = action.params) == null ? void 0 : _c.direction, (_d = action.params) == null ? void 0 : _d.amount);
          break;
        }
        case "focus": {
          if (!targetEl) throw new Error("Focus requires a target element");
          targetEl.focus();
          break;
        }
        case "keypress": {
          if (!((_e = action.params) == null ? void 0 : _e.key)) throw new Error("Keypress requires a key parameter");
          await executeKeypress(action.params.key);
          break;
        }
        case "navigate": {
          if (!((_f = action.params) == null ? void 0 : _f.url)) throw new Error("Navigate requires a url parameter");
          window.location.href = action.params.url;
          break;
        }
        case "back": {
          window.history.back();
          break;
        }
        default:
          throw new Error(`Unsupported action type: ${action.action}`);
      }
      await waitForSettle();
      const freshSnapshot = await extractDomSnapshot();
      return {
        ok: true,
        action_id: action.action_id,
        navigated: false,
        new_page_state_hash: freshSnapshot.page_state_hash
      };
    } catch (err) {
      console.error("[Action Executor] Internal Execution Error:", err);
      let safeErrorCode = "INTERNAL";
      let safeMessage = "Action execution failed due to an internal browser error.";
      const errMsg = (err == null ? void 0 : err.message) || String(err);
      if (errMsg.includes("requires a target element")) {
        safeErrorCode = "TARGET_NOT_FOUND";
        safeMessage = "The requested action requires a target region that was not found or provided.";
      } else if (errMsg.includes("requires a url")) {
        safeErrorCode = "INTERNAL";
        safeMessage = "The requested navigation action requires a valid URL.";
      } else if (errMsg.includes("Unsupported action type")) {
        safeErrorCode = "INTERNAL";
        safeMessage = "The requested action type is not supported.";
      } else if (errMsg.includes("fill_secret requires a resolved secret")) {
        safeErrorCode = "INTERNAL";
        safeMessage = "The secret could not be resolved for filling.";
      }
      return {
        ok: false,
        action_id: action.action_id,
        navigated: false,
        new_page_state_hash: null,
        error: stageError(safeErrorCode, "execute", safeMessage)
      };
    }
  }
  content;
  function mapDomToSemanticType(el) {
    if (el.role === "button" || el.tag === "button") return "button";
    if (el.input) {
      if (el.input.type === "checkbox") return "checkbox";
      if (el.input.type === "button" || el.input.type === "submit") return "button";
      return "input";
    }
    if (el.role === "link" || el.tag === "a") return "link";
    if (el.role === "combobox" || el.tag === "select") return "dropdown";
    if (el.tag === "img" || el.role === "img") return "image";
    if (el.role === "dialog" || el.tag === "dialog") return "dialog";
    if (el.tag === "table") return "table";
    if (el.tag === "nav" || el.role === "navigation") return "navigation";
    if (el.role === "tab") return "tab";
    if (el.role === "menu" || el.role === "menuitem") return "menu";
    if (el.text && el.text.length > 0) return "text";
    return "unknown";
  }
  content;
  const definition = defineContentScript({
    matches: ["<all_urls>"],
    allFrames: true,
    matchAboutBlank: true,
    runAt: "document_idle",
    main() {
      const isTop = typeof window !== "undefined" && window.self === window.top;
      const frameId = isTop ? "main" : `frame_${Math.random().toString(36).substring(2, 7)}`;
      startDomObservers(frameId);
      bus.on("dom/snapshot", async () => {
        return extractDomSnapshot(frameId);
      });
      bus.on("dom/fingerprint", async () => {
        const snap = await extractDomSnapshot(frameId);
        return {
          page_state_hash: snap.page_state_hash,
          origin: snap.url_origin,
          frame_id: frameId
        };
      });
      bus.on("registry/set", async (payload) => {
        elementRegistry.setRegionMapping(payload.mapping);
        return { applied: true };
      });
      bus.on("action/resolve-target", async (payload) => {
        const el = elementRegistry.getByRegionId(payload.region_id);
        if (!el || !el.isConnected) {
          return {
            exists: false,
            visible: false,
            interactable: false,
            occluded: false,
            bbox: [0, 0, 0, 0],
            origin: window.location.origin,
            frame_id: frameId,
            semantic_type: "unknown",
            input_type: null,
            is_password: false
          };
        }
        const rect = el.getBoundingClientRect();
        const visible = isElementVisible(el);
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const occluded = isElementOccluded(el, cx, cy);
        const interactable = visible && !el.disabled && !occluded;
        const tag = el.tagName.toLowerCase();
        let inputType = null;
        let isPassword = false;
        if (tag === "input") {
          inputType = (el.type || "text").toLowerCase();
          isPassword = inputType === "password";
        }
        return {
          exists: true,
          visible,
          interactable,
          occluded,
          bbox: [
            Math.round(rect.left),
            Math.round(rect.top),
            Math.round(rect.width),
            Math.round(rect.height)
          ],
          origin: window.location.origin,
          frame_id: frameId,
          semantic_type: mapDomToSemanticType({
            tag,
            role: el.getAttribute("role"),
            text: el.textContent || ""
          }),
          input_type: inputType,
          is_password: isPassword
        };
      });
      bus.on("action/execute", async (payload) => {
        return executeAction(payload.action, payload.resolved_secret);
      });
      bus.on("test/inject-dom-change", async (payload) => {
        const div = document.createElement("div");
        div.innerHTML = payload.html;
        document.body.appendChild(div);
        return { injected: true };
      });
    }
  });
  content;
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var browserPolyfill$1 = { exports: {} };
  var browserPolyfill = browserPolyfill$1.exports;
  var hasRequiredBrowserPolyfill;
  function requireBrowserPolyfill() {
    if (hasRequiredBrowserPolyfill) return browserPolyfill$1.exports;
    hasRequiredBrowserPolyfill = 1;
    (function(module, exports) {
      (function(global, factory) {
        {
          factory(module);
        }
      })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : browserPolyfill, function(module2) {
        if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
          throw new Error("This script should only be loaded in a browser extension.");
        }
        if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
          const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
          const wrapAPIs = (extensionAPIs) => {
            const apiMetadata = {
              "alarms": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "clearAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "bookmarks": {
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getChildren": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getRecent": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getSubTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTree": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "browserAction": {
                "disable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "enable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "getBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "openPopup": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "browsingData": {
                "remove": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "removeCache": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCookies": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeDownloads": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFormData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeHistory": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeLocalStorage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePasswords": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePluginData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "settings": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "commands": {
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "contextMenus": {
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "cookies": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAllCookieStores": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "devtools": {
                "inspectedWindow": {
                  "eval": {
                    "minArgs": 1,
                    "maxArgs": 2,
                    "singleCallbackArg": false
                  }
                },
                "panels": {
                  "create": {
                    "minArgs": 3,
                    "maxArgs": 3,
                    "singleCallbackArg": true
                  },
                  "elements": {
                    "createSidebarPane": {
                      "minArgs": 1,
                      "maxArgs": 1
                    }
                  }
                }
              },
              "downloads": {
                "cancel": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "download": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "erase": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFileIcon": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "open": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "pause": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFile": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "resume": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "extension": {
                "isAllowedFileSchemeAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "isAllowedIncognitoAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "history": {
                "addUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "deleteRange": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getVisits": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "i18n": {
                "detectLanguage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAcceptLanguages": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "identity": {
                "launchWebAuthFlow": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "idle": {
                "queryState": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "management": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getSelf": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setEnabled": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "uninstallSelf": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "notifications": {
                "clear": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPermissionLevel": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "pageAction": {
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "hide": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "permissions": {
                "contains": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "request": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "runtime": {
                "getBackgroundPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPlatformInfo": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "openOptionsPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "requestUpdateCheck": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "sendMessage": {
                  "minArgs": 1,
                  "maxArgs": 3
                },
                "sendNativeMessage": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "setUninstallURL": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "sessions": {
                "getDevices": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getRecentlyClosed": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "restore": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "storage": {
                "local": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                },
                "managed": {
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  }
                },
                "sync": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              },
              "tabs": {
                "captureVisibleTab": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "detectLanguage": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "discard": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "duplicate": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "executeScript": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getZoom": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getZoomSettings": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goBack": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goForward": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "highlight": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "insertCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "query": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "reload": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "sendMessage": {
                  "minArgs": 2,
                  "maxArgs": 3
                },
                "setZoom": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "setZoomSettings": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "update": {
                  "minArgs": 1,
                  "maxArgs": 2
                }
              },
              "topSites": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "webNavigation": {
                "getAllFrames": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFrame": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "webRequest": {
                "handlerBehaviorChanged": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "windows": {
                "create": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getLastFocused": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              }
            };
            if (Object.keys(apiMetadata).length === 0) {
              throw new Error("api-metadata.json has not been included in browser-polyfill");
            }
            class DefaultWeakMap extends WeakMap {
              constructor(createItem, items = void 0) {
                super(items);
                this.createItem = createItem;
              }
              get(key) {
                if (!this.has(key)) {
                  this.set(key, this.createItem(key));
                }
                return super.get(key);
              }
            }
            const isThenable = (value) => {
              return value && typeof value === "object" && typeof value.then === "function";
            };
            const makeCallback = (promise, metadata) => {
              return (...callbackArgs) => {
                if (extensionAPIs.runtime.lastError) {
                  promise.reject(new Error(extensionAPIs.runtime.lastError.message));
                } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                  promise.resolve(callbackArgs[0]);
                } else {
                  promise.resolve(callbackArgs);
                }
              };
            };
            const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
            const wrapAsyncFunction = (name, metadata) => {
              return function asyncFunctionWrapper(target, ...args) {
                if (args.length < metadata.minArgs) {
                  throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
                }
                if (args.length > metadata.maxArgs) {
                  throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
                }
                return new Promise((resolve, reject) => {
                  if (metadata.fallbackToNoCallback) {
                    try {
                      target[name](...args, makeCallback({
                        resolve,
                        reject
                      }, metadata));
                    } catch (cbError) {
                      console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                      target[name](...args);
                      metadata.fallbackToNoCallback = false;
                      metadata.noCallback = true;
                      resolve();
                    }
                  } else if (metadata.noCallback) {
                    target[name](...args);
                    resolve();
                  } else {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  }
                });
              };
            };
            const wrapMethod = (target, method, wrapper) => {
              return new Proxy(method, {
                apply(targetMethod, thisObj, args) {
                  return wrapper.call(thisObj, target, ...args);
                }
              });
            };
            let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
            const wrapObject = (target, wrappers = {}, metadata = {}) => {
              let cache = /* @__PURE__ */ Object.create(null);
              let handlers = {
                has(proxyTarget2, prop) {
                  return prop in target || prop in cache;
                },
                get(proxyTarget2, prop, receiver) {
                  if (prop in cache) {
                    return cache[prop];
                  }
                  if (!(prop in target)) {
                    return void 0;
                  }
                  let value = target[prop];
                  if (typeof value === "function") {
                    if (typeof wrappers[prop] === "function") {
                      value = wrapMethod(target, target[prop], wrappers[prop]);
                    } else if (hasOwnProperty(metadata, prop)) {
                      let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                      value = wrapMethod(target, target[prop], wrapper);
                    } else {
                      value = value.bind(target);
                    }
                  } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                    value = wrapObject(value, wrappers[prop], metadata[prop]);
                  } else if (hasOwnProperty(metadata, "*")) {
                    value = wrapObject(value, wrappers[prop], metadata["*"]);
                  } else {
                    Object.defineProperty(cache, prop, {
                      configurable: true,
                      enumerable: true,
                      get() {
                        return target[prop];
                      },
                      set(value2) {
                        target[prop] = value2;
                      }
                    });
                    return value;
                  }
                  cache[prop] = value;
                  return value;
                },
                set(proxyTarget2, prop, value, receiver) {
                  if (prop in cache) {
                    cache[prop] = value;
                  } else {
                    target[prop] = value;
                  }
                  return true;
                },
                defineProperty(proxyTarget2, prop, desc) {
                  return Reflect.defineProperty(cache, prop, desc);
                },
                deleteProperty(proxyTarget2, prop) {
                  return Reflect.deleteProperty(cache, prop);
                }
              };
              let proxyTarget = Object.create(target);
              return new Proxy(proxyTarget, handlers);
            };
            const wrapEvent = (wrapperMap) => ({
              addListener(target, listener, ...args) {
                target.addListener(wrapperMap.get(listener), ...args);
              },
              hasListener(target, listener) {
                return target.hasListener(wrapperMap.get(listener));
              },
              removeListener(target, listener) {
                target.removeListener(wrapperMap.get(listener));
              }
            });
            const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onRequestFinished(req) {
                const wrappedReq = wrapObject(req, {}, {
                  getContent: {
                    minArgs: 0,
                    maxArgs: 0
                  }
                });
                listener(wrappedReq);
              };
            });
            const onMessageWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onMessage(message, sender, sendResponse) {
                let didCallSendResponse = false;
                let wrappedSendResponse;
                let sendResponsePromise = new Promise((resolve) => {
                  wrappedSendResponse = function(response) {
                    didCallSendResponse = true;
                    resolve(response);
                  };
                });
                let result2;
                try {
                  result2 = listener(message, sender, wrappedSendResponse);
                } catch (err) {
                  result2 = Promise.reject(err);
                }
                const isResultThenable = result2 !== true && isThenable(result2);
                if (result2 !== true && !isResultThenable && !didCallSendResponse) {
                  return false;
                }
                const sendPromisedResult = (promise) => {
                  promise.then((msg) => {
                    sendResponse(msg);
                  }, (error) => {
                    let message2;
                    if (error && (error instanceof Error || typeof error.message === "string")) {
                      message2 = error.message;
                    } else {
                      message2 = "An unexpected error occurred";
                    }
                    sendResponse({
                      __mozWebExtensionPolyfillReject__: true,
                      message: message2
                    });
                  }).catch((err) => {
                    console.error("Failed to send onMessage rejected reply", err);
                  });
                };
                if (isResultThenable) {
                  sendPromisedResult(result2);
                } else {
                  sendPromisedResult(sendResponsePromise);
                }
                return true;
              };
            });
            const wrappedSendMessageCallback = ({
              reject,
              resolve
            }, reply) => {
              if (extensionAPIs.runtime.lastError) {
                if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                  resolve();
                } else {
                  reject(new Error(extensionAPIs.runtime.lastError.message));
                }
              } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
                reject(new Error(reply.message));
              } else {
                resolve(reply);
              }
            };
            const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                const wrappedCb = wrappedSendMessageCallback.bind(null, {
                  resolve,
                  reject
                });
                args.push(wrappedCb);
                apiNamespaceObj.sendMessage(...args);
              });
            };
            const staticWrappers = {
              devtools: {
                network: {
                  onRequestFinished: wrapEvent(onRequestFinishedWrappers)
                }
              },
              runtime: {
                onMessage: wrapEvent(onMessageWrappers),
                onMessageExternal: wrapEvent(onMessageWrappers),
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 1,
                  maxArgs: 3
                })
              },
              tabs: {
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 2,
                  maxArgs: 3
                })
              }
            };
            const settingMetadata = {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            };
            apiMetadata.privacy = {
              network: {
                "*": settingMetadata
              },
              services: {
                "*": settingMetadata
              },
              websites: {
                "*": settingMetadata
              }
            };
            return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
          };
          module2.exports = wrapAPIs(chrome);
        } else {
          module2.exports = globalThis.browser;
        }
      });
    })(browserPolyfill$1);
    return browserPolyfill$1.exports;
  }
  var browserPolyfillExports = requireBrowserPolyfill();
  const originalBrowser = /* @__PURE__ */ getDefaultExportFromCjs(browserPolyfillExports);
  const browser = originalBrowser;
  function print$1(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger$1 = {
    debug: (...args) => print$1(console.debug, ...args),
    log: (...args) => print$1(console.log, ...args),
    warn: (...args) => print$1(console.warn, ...args),
    error: (...args) => print$1(console.error, ...args)
  };
  const _WxtLocationChangeEvent = class _WxtLocationChangeEvent extends Event {
    constructor(newUrl, oldUrl) {
      super(_WxtLocationChangeEvent.EVENT_NAME, {});
      this.newUrl = newUrl;
      this.oldUrl = oldUrl;
    }
  };
  __publicField(_WxtLocationChangeEvent, "EVENT_NAME", getUniqueEventName("wxt:locationchange"));
  let WxtLocationChangeEvent = _WxtLocationChangeEvent;
  function getUniqueEventName(eventName) {
    var _a;
    return `${(_a = browser == null ? void 0 : browser.runtime) == null ? void 0 : _a.id}:${"content"}:${eventName}`;
  }
  function createLocationWatcher(ctx) {
    let interval;
    let oldUrl;
    return {
      /**
       * Ensure the location watcher is actively looking for URL changes. If it's already watching,
       * this is a noop.
       */
      run() {
        if (interval != null) return;
        oldUrl = new URL(location.href);
        interval = ctx.setInterval(() => {
          let newUrl = new URL(location.href);
          if (newUrl.href !== oldUrl.href) {
            window.dispatchEvent(new WxtLocationChangeEvent(newUrl, oldUrl));
            oldUrl = newUrl;
          }
        }, 1e3);
      }
    };
  }
  const _ContentScriptContext = class _ContentScriptContext {
    constructor(contentScriptName, options) {
      __publicField(this, "isTopFrame", window.self === window.top);
      __publicField(this, "abortController");
      __publicField(this, "locationWatcher", createLocationWatcher(this));
      __publicField(this, "receivedMessageIds", /* @__PURE__ */ new Set());
      this.contentScriptName = contentScriptName;
      this.options = options;
      this.abortController = new AbortController();
      if (this.isTopFrame) {
        this.listenForNewerScripts({ ignoreFirstEvent: true });
        this.stopOldScripts();
      } else {
        this.listenForNewerScripts();
      }
    }
    get signal() {
      return this.abortController.signal;
    }
    abort(reason) {
      return this.abortController.abort(reason);
    }
    get isInvalid() {
      if (browser.runtime.id == null) {
        this.notifyInvalidated();
      }
      return this.signal.aborted;
    }
    get isValid() {
      return !this.isInvalid;
    }
    /**
     * Add a listener that is called when the content script's context is invalidated.
     *
     * @returns A function to remove the listener.
     *
     * @example
     * browser.runtime.onMessage.addListener(cb);
     * const removeInvalidatedListener = ctx.onInvalidated(() => {
     *   browser.runtime.onMessage.removeListener(cb);
     * })
     * // ...
     * removeInvalidatedListener();
     */
    onInvalidated(cb) {
      this.signal.addEventListener("abort", cb);
      return () => this.signal.removeEventListener("abort", cb);
    }
    /**
     * Return a promise that never resolves. Useful if you have an async function that shouldn't run
     * after the context is expired.
     *
     * @example
     * const getValueFromStorage = async () => {
     *   if (ctx.isInvalid) return ctx.block();
     *
     *   // ...
     * }
     */
    block() {
      return new Promise(() => {
      });
    }
    /**
     * Wrapper around `window.setInterval` that automatically clears the interval when invalidated.
     */
    setInterval(handler, timeout) {
      const id = setInterval(() => {
        if (this.isValid) handler();
      }, timeout);
      this.onInvalidated(() => clearInterval(id));
      return id;
    }
    /**
     * Wrapper around `window.setTimeout` that automatically clears the interval when invalidated.
     */
    setTimeout(handler, timeout) {
      const id = setTimeout(() => {
        if (this.isValid) handler();
      }, timeout);
      this.onInvalidated(() => clearTimeout(id));
      return id;
    }
    /**
     * Wrapper around `window.requestAnimationFrame` that automatically cancels the request when
     * invalidated.
     */
    requestAnimationFrame(callback) {
      const id = requestAnimationFrame((...args) => {
        if (this.isValid) callback(...args);
      });
      this.onInvalidated(() => cancelAnimationFrame(id));
      return id;
    }
    /**
     * Wrapper around `window.requestIdleCallback` that automatically cancels the request when
     * invalidated.
     */
    requestIdleCallback(callback, options) {
      const id = requestIdleCallback((...args) => {
        if (!this.signal.aborted) callback(...args);
      }, options);
      this.onInvalidated(() => cancelIdleCallback(id));
      return id;
    }
    addEventListener(target, type, handler, options) {
      var _a;
      if (type === "wxt:locationchange") {
        if (this.isValid) this.locationWatcher.run();
      }
      (_a = target.addEventListener) == null ? void 0 : _a.call(
        target,
        type.startsWith("wxt:") ? getUniqueEventName(type) : type,
        handler,
        {
          ...options,
          signal: this.signal
        }
      );
    }
    /**
     * @internal
     * Abort the abort controller and execute all `onInvalidated` listeners.
     */
    notifyInvalidated() {
      this.abort("Content script context invalidated");
      logger$1.debug(
        `Content script "${this.contentScriptName}" context invalidated`
      );
    }
    stopOldScripts() {
      window.postMessage(
        {
          type: _ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
          contentScriptName: this.contentScriptName,
          messageId: Math.random().toString(36).slice(2)
        },
        "*"
      );
    }
    verifyScriptStartedEvent(event) {
      var _a, _b, _c;
      const isScriptStartedEvent = ((_a = event.data) == null ? void 0 : _a.type) === _ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE;
      const isSameContentScript = ((_b = event.data) == null ? void 0 : _b.contentScriptName) === this.contentScriptName;
      const isNotDuplicate = !this.receivedMessageIds.has((_c = event.data) == null ? void 0 : _c.messageId);
      return isScriptStartedEvent && isSameContentScript && isNotDuplicate;
    }
    listenForNewerScripts(options) {
      let isFirst = true;
      const cb = (event) => {
        if (this.verifyScriptStartedEvent(event)) {
          this.receivedMessageIds.add(event.data.messageId);
          const wasFirst = isFirst;
          isFirst = false;
          if (wasFirst && (options == null ? void 0 : options.ignoreFirstEvent)) return;
          this.notifyInvalidated();
        }
      };
      addEventListener("message", cb);
      this.onInvalidated(() => removeEventListener("message", cb));
    }
  };
  __publicField(_ContentScriptContext, "SCRIPT_STARTED_MESSAGE_TYPE", getUniqueEventName(
    "wxt:content-script-started"
  ));
  let ContentScriptContext = _ContentScriptContext;
  const nullKey = Symbol("null");
  let keyCounter = 0;
  class ManyKeysMap extends Map {
    constructor(...arguments_) {
      super();
      this._objectHashes = /* @__PURE__ */ new WeakMap();
      this._symbolHashes = /* @__PURE__ */ new Map();
      this._publicKeys = /* @__PURE__ */ new Map();
      const [pairs] = arguments_;
      if (pairs === null || pairs === void 0) {
        return;
      }
      if (typeof pairs[Symbol.iterator] !== "function") {
        throw new TypeError(typeof pairs + " is not iterable (cannot read property Symbol(Symbol.iterator))");
      }
      for (const [keys, value] of pairs) {
        this.set(keys, value);
      }
    }
    _getPublicKeys(keys, create = false) {
      if (!Array.isArray(keys)) {
        throw new TypeError("The keys parameter must be an array");
      }
      const privateKey = this._getPrivateKey(keys, create);
      let publicKey;
      if (privateKey && this._publicKeys.has(privateKey)) {
        publicKey = this._publicKeys.get(privateKey);
      } else if (create) {
        publicKey = [...keys];
        this._publicKeys.set(privateKey, publicKey);
      }
      return { privateKey, publicKey };
    }
    _getPrivateKey(keys, create = false) {
      const privateKeys = [];
      for (const key of keys) {
        const keyToPass = key === null ? nullKey : key;
        let hashes;
        if (typeof keyToPass === "object" || typeof keyToPass === "function") {
          hashes = "_objectHashes";
        } else if (typeof keyToPass === "symbol") {
          hashes = "_symbolHashes";
        } else {
          hashes = false;
        }
        if (!hashes) {
          privateKeys.push(keyToPass);
        } else if (this[hashes].has(keyToPass)) {
          privateKeys.push(this[hashes].get(keyToPass));
        } else if (create) {
          const privateKey = `@@mkm-ref-${keyCounter++}@@`;
          this[hashes].set(keyToPass, privateKey);
          privateKeys.push(privateKey);
        } else {
          return false;
        }
      }
      return JSON.stringify(privateKeys);
    }
    set(keys, value) {
      const { publicKey } = this._getPublicKeys(keys, true);
      return super.set(publicKey, value);
    }
    get(keys) {
      const { publicKey } = this._getPublicKeys(keys);
      return super.get(publicKey);
    }
    has(keys) {
      const { publicKey } = this._getPublicKeys(keys);
      return super.has(publicKey);
    }
    delete(keys) {
      const { publicKey, privateKey } = this._getPublicKeys(keys);
      return Boolean(publicKey && super.delete(publicKey) && this._publicKeys.delete(privateKey));
    }
    clear() {
      super.clear();
      this._symbolHashes.clear();
      this._publicKeys.clear();
    }
    get [Symbol.toStringTag]() {
      return "ManyKeysMap";
    }
    get size() {
      return super.size;
    }
  }
  new ManyKeysMap();
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  const result = (async () => {
    try {
      initPlugins();
      const { main, ...options } = definition;
      const ctx = new ContentScriptContext("content", options);
      return await main(ctx);
    } catch (err) {
      logger.error(
        `The content script "${"content"}" crashed on startup!`,
        err
      );
      throw err;
    }
  })();
  return result;
})();
content;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDI2LjYuMl9yb2xsdXBANC42My40L25vZGVfbW9kdWxlcy93eHQvZGlzdC9zYW5kYm94L2RlZmluZS1jb250ZW50LXNjcmlwdC5tanMiLCIuLi8uLi8uLi8uLi9jb250cmFjdHMvdHMvY29tbW9uLnRzIiwiLi4vLi4vLi4vLi4vY29udHJhY3RzL3RzL2dlb21ldHJ5LnRzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEAzLjI1Ljc2L25vZGVfbW9kdWxlcy96b2QvdjMvaGVscGVycy91dGlsLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEAzLjI1Ljc2L25vZGVfbW9kdWxlcy96b2QvdjMvWm9kRXJyb3IuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDMuMjUuNzYvbm9kZV9tb2R1bGVzL3pvZC92My9sb2NhbGVzL2VuLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEAzLjI1Ljc2L25vZGVfbW9kdWxlcy96b2QvdjMvZXJyb3JzLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEAzLjI1Ljc2L25vZGVfbW9kdWxlcy96b2QvdjMvaGVscGVycy9wYXJzZVV0aWwuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDMuMjUuNzYvbm9kZV9tb2R1bGVzL3pvZC92My9oZWxwZXJzL2Vycm9yVXRpbC5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RAMy4yNS43Ni9ub2RlX21vZHVsZXMvem9kL3YzL3R5cGVzLmpzIiwiLi4vLi4vLi4vLi4vY29udHJhY3RzL3RzL3NjaGVtYXMudHMiLCIuLi8uLi8uLi8uLi9jb250cmFjdHMvdHMvYnVzLnRzIiwiLi4vLi4vLi4vLi4vY29udHJhY3RzL3RzL2FjdGlvbi12YWxpZGF0b3IudHMiLCIuLi8uLi8uLi9zcmMvcGVyY2VwdGlvbi9kb20vdmlzaWJpbGl0eS50cyIsIi4uLy4uLy4uL3NyYy9wZXJjZXB0aW9uL2RvbS9yZW5kZXJpbmcta2luZC50cyIsIi4uLy4uLy4uL3NyYy9wZXJjZXB0aW9uL2FjY2Vzc2liaWxpdHkvcm9sZS50cyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9kb20tYWNjZXNzaWJpbGl0eS1hcGlAMC43LjEvbm9kZV9tb2R1bGVzL2RvbS1hY2Nlc3NpYmlsaXR5LWFwaS9kaXN0L3BvbHlmaWxscy9hcnJheS5mcm9tLm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9kb20tYWNjZXNzaWJpbGl0eS1hcGlAMC43LjEvbm9kZV9tb2R1bGVzL2RvbS1hY2Nlc3NpYmlsaXR5LWFwaS9kaXN0L3BvbHlmaWxscy9TZXRMaWtlLm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9kb20tYWNjZXNzaWJpbGl0eS1hcGlAMC43LjEvbm9kZV9tb2R1bGVzL2RvbS1hY2Nlc3NpYmlsaXR5LWFwaS9kaXN0L2dldFJvbGUubWpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2RvbS1hY2Nlc3NpYmlsaXR5LWFwaUAwLjcuMS9ub2RlX21vZHVsZXMvZG9tLWFjY2Vzc2liaWxpdHktYXBpL2Rpc3QvdXRpbC5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vZG9tLWFjY2Vzc2liaWxpdHktYXBpQDAuNy4xL25vZGVfbW9kdWxlcy9kb20tYWNjZXNzaWJpbGl0eS1hcGkvZGlzdC9hY2Nlc3NpYmxlLW5hbWUtYW5kLWRlc2NyaXB0aW9uLm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9kb20tYWNjZXNzaWJpbGl0eS1hcGlAMC43LjEvbm9kZV9tb2R1bGVzL2RvbS1hY2Nlc3NpYmlsaXR5LWFwaS9kaXN0L2FjY2Vzc2libGUtbmFtZS5tanMiLCIuLi8uLi8uLi9zcmMvcGVyY2VwdGlvbi9hY2Nlc3NpYmlsaXR5L2FyaWEtcmVzb2x2ZXIudHMiLCIuLi8uLi8uLi9zcmMvcGVyY2VwdGlvbi9hY2Nlc3NpYmlsaXR5L25hbWUudHMiLCIuLi8uLi8uLi9zcmMvY29udGVudC9mcmFtZS1vZmZzZXRzLnRzIiwiLi4vLi4vLi4vc3JjL2NvbnRlbnQvcmVnaXN0cnkudHMiLCIuLi8uLi8uLi9zcmMvc2VjdXJpdHkvc2hhMjU2LnRzIiwiLi4vLi4vLi4vc3JjL2Jyb3dzZXIvc3RhdGUvZmluZ2VycHJpbnQudHMiLCIuLi8uLi8uLi9zcmMvcGVyY2VwdGlvbi9kb20vYXJpYS1tZXRhZGF0YS50cyIsIi4uLy4uLy4uL3NyYy9wZXJjZXB0aW9uL2RvbS9zbmFwc2hvdC50cyIsIi4uLy4uLy4uL3NyYy9jb250ZW50L29ic2VydmVycy50cyIsIi4uLy4uLy4uL3NyYy9jb250ZW50L2FnZW50LXVpLnRzIiwiLi4vLi4vLi4vc3JjL2FjdGlvbnMvZXhlY3V0b3IvY2xpY2sudHMiLCIuLi8uLi8uLi9zcmMvYWN0aW9ucy9leGVjdXRvci90eXBlLnRzIiwiLi4vLi4vLi4vc3JjL2FjdGlvbnMvZXhlY3V0b3Ivc2VsZWN0LnRzIiwiLi4vLi4vLi4vc3JjL2FjdGlvbnMvZXhlY3V0b3Ivc2Nyb2xsLnRzIiwiLi4vLi4vLi4vc3JjL2FjdGlvbnMvZXhlY3V0b3Iva2V5cHJlc3MudHMiLCIuLi8uLi8uLi9zcmMvYWN0aW9ucy9leGVjdXRvci9zZXR0bGUudHMiLCIuLi8uLi8uLi9zcmMvYWN0aW9ucy9leGVjdXRvci9pbmRleC50cyIsIi4uLy4uLy4uL3NyYy9wZXJjZXB0aW9uL2RvbS90by1yZWdpb25zLnRzIiwiLi4vLi4vLi4vZW50cnlwb2ludHMvY29udGVudC50cyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93ZWJleHRlbnNpb24tcG9seWZpbGxAMC4xMi4wL25vZGVfbW9kdWxlcy93ZWJleHRlbnNpb24tcG9seWZpbGwvZGlzdC9icm93c2VyLXBvbHlmaWxsLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDI2LjYuMl9yb2xsdXBANC42My40L25vZGVfbW9kdWxlcy93eHQvZGlzdC9icm93c2VyL2luZGV4Lm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4xOS4yOV9AdHlwZXMrbm9kZUAyNi42LjJfcm9sbHVwQDQuNjMuNC9ub2RlX21vZHVsZXMvd3h0L2Rpc3Qvc2FuZGJveC91dGlscy9sb2dnZXIubWpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDI2LjYuMl9yb2xsdXBANC42My40L25vZGVfbW9kdWxlcy93eHQvZGlzdC9jbGllbnQvY29udGVudC1zY3JpcHRzL2N1c3RvbS1ldmVudHMubWpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDI2LjYuMl9yb2xsdXBANC42My40L25vZGVfbW9kdWxlcy93eHQvZGlzdC9jbGllbnQvY29udGVudC1zY3JpcHRzL2xvY2F0aW9uLXdhdGNoZXIubWpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDI2LjYuMl9yb2xsdXBANC42My40L25vZGVfbW9kdWxlcy93eHQvZGlzdC9jbGllbnQvY29udGVudC1zY3JpcHRzL2NvbnRlbnQtc2NyaXB0LWNvbnRleHQubWpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL21hbnkta2V5cy1tYXBAMy4wLjMvbm9kZV9tb2R1bGVzL21hbnkta2V5cy1tYXAvaW5kZXguanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQDFuYXRzdSt3YWl0LWVsZW1lbnRANC4yLjAvbm9kZV9tb2R1bGVzL0AxbmF0c3Uvd2FpdC1lbGVtZW50L2Rpc3QvaW5kZXgubWpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBkZWZpbmVDb250ZW50U2NyaXB0KGRlZmluaXRpb24pIHtcbiAgcmV0dXJuIGRlZmluaXRpb247XG59XG4iLCJleHBvcnQgdHlwZSBCQm94ID0gW3g6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcl07IC8vIENTUyBweCwgVE9QLUxFVkVMIHZpZXdwb3J0IHNwYWNlXG5leHBvcnQgdHlwZSBPcmlnaW4gPSBzdHJpbmc7IC8vIFwiaHR0cHM6Ly9leGFtcGxlLmNvbVwiIOKAlCBzY2hlbWUraG9zdCtwb3J0IG9ubHksIG5ldmVyIGEgZnVsbCBVUkxcbmV4cG9ydCB0eXBlIEZyYW1lSWQgPSBzdHJpbmc7IC8vIFwibWFpblwiIHwgXCJmMVwiIHwgXCJmMlwiIC4uLlxuZXhwb3J0IHR5cGUgU291cmNlID0gJ0RPTScgfCAnQVJJQScgfCAnVklTSU9OJyB8ICdPQ1InO1xuXG5leHBvcnQgdHlwZSBTZW1hbnRpY1R5cGUgPVxuICB8ICdidXR0b24nIHwgJ2lucHV0JyB8ICdjaGVja2JveCcgfCAnZHJvcGRvd24nIHwgJ2xpbmsnIHwgJ3RhYicgfCAnbWVudScgfCAnZGlhbG9nJ1xuICB8ICdjaGFydCcgfCAndGFibGUnIHwgJ2NhcmQnIHwgJ25hdmlnYXRpb24nIHwgJ2ltYWdlJyB8ICd0ZXh0JyB8ICdjdXN0b21fY29udHJvbCcgfCAndW5rbm93bic7XG5cbmV4cG9ydCB0eXBlIFZpc3VhbFN0YXRlID1cbiAgfCAnZW5hYmxlZCcgfCAnZGlzYWJsZWQnIHwgJ3NlbGVjdGVkJyB8ICdleHBhbmRlZCcgfCAnY29sbGFwc2VkJ1xuICB8ICdmb2N1c2VkJyB8ICdjaGVja2VkJyB8ICd1bmNoZWNrZWQnIHwgJ3Zpc2libGUnO1xuXG5leHBvcnQgdHlwZSBTdGFnZU5hbWUgPVxuICB8ICdjYXB0dXJlJyB8ICdkb20nIHwgJ3JvdXRlJyB8ICd2aXNpb24nIHwgJ29jcicgfCAnZmFjZScgfCAnZ3JvdW5kJyB8ICdmdXNlJ1xuICB8ICdwaWknIHwgJ3JlZGFjdCcgfCAnZmlyZXdhbGwnIHwgJ25ldHdvcmsnIHwgJ3NlcnZlcicgfCAndmFsaWRhdGUnIHwgJ2V4ZWN1dGUnIHwgJ3NldHRsZSc7XG5cbmV4cG9ydCB0eXBlIFN0YWdlRXJyb3JDb2RlID1cbiAgfCAnVklTSU9OX1VOQVZBSUxBQkxFJyB8ICdQUklWQUNZX0JMT0NLJyB8ICdQUklWQUNZX0VSUk9SJyB8ICdTRVJWRVJfVU5BVkFJTEFCTEUnXG4gIHwgJ1NFUlZFUl9JTlZBTElEJyB8ICdTVEFMRV9TVEFURScgfCAnT1JJR0lOX01JU01BVENIJyB8ICdGUkFNRV9NSVNNQVRDSCdcbiAgfCAnUE9MSUNZX0RFTklFRCcgfCAnVEFSR0VUX05PVF9GT1VORCcgfCAnTk9UX0lOVEVSQUNUQUJMRSdcbiAgfCAnQ0FQQUJJTElUWV9ERU5JRUQnIHwgJ1RFWFRfVU5TQUZFJyB8ICdUSU1FT1VUJyB8ICdJTlRFUk5BTCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhZ2VFcnJvciB7XG4gIGNvZGU6IFN0YWdlRXJyb3JDb2RlO1xuICBzdGFnZTogU3RhZ2VOYW1lO1xuICBtZXNzYWdlOiBzdHJpbmc7IC8vIE5FVkVSIGNvbnRhaW5zIHJhdyBwYWdlIHRleHQsIFBJSSBvciBzZWNyZXRzXG4gIHJldHJ5YWJsZTogYm9vbGVhbjtcbiAgZGV0YWlsPzogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbj47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGVsZW1ldHJ5RXZlbnQge1xuICB0czogbnVtYmVyO1xuICBjeWNsZV9pZDogc3RyaW5nO1xuICBzdGFnZTogU3RhZ2VOYW1lO1xuICBkdXJhdGlvbl9tczogbnVtYmVyOyAvLyBwZXJmb3JtYW5jZS5ub3coKSBkZWx0YSwga2VlcCAzIGRlY2ltYWxzIOKAlCBuZXZlciByb3VuZCB0byAwXG4gIG1ldGE/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuPjsgLy8gY291bnRzL2lkcy9lbnVtcyBPTkxZLCBubyByYXcgdGV4dFxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhZ2VFcnJvcihcbiAgY29kZTogU3RhZ2VFcnJvckNvZGUsXG4gIHN0YWdlOiBTdGFnZU5hbWUsXG4gIG1lc3NhZ2U6IHN0cmluZyxcbiAgcmV0cnlhYmxlID0gZmFsc2UsXG4gIGRldGFpbD86IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4+XG4pOiBTdGFnZUVycm9yIHtcbiAgcmV0dXJuIHsgY29kZSwgc3RhZ2UsIG1lc3NhZ2UsIHJldHJ5YWJsZSwgZGV0YWlsIH07XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJCb3ggfSBmcm9tICcuL2NvbW1vbi5qcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjdCB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvUmVjdChiYm94OiBCQm94KTogUmVjdCB7XG4gIHJldHVybiB7XG4gICAgeDogYmJveFswXSxcbiAgICB5OiBiYm94WzFdLFxuICAgIHdpZHRoOiBiYm94WzJdLFxuICAgIGhlaWdodDogYmJveFszXSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21SZWN0KHJlY3Q6IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0gfCBET01SZWN0IHwgRE9NUmVjdFJlYWRPbmx5KTogQkJveCB7XG4gIHJldHVybiBbcmVjdC54LCByZWN0LnksIHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0XTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvSW1hZ2VQeChiYm94OiBCQm94LCBkcHI6IG51bWJlcik6IEJCb3gge1xuICByZXR1cm4gW1xuICAgIE1hdGgucm91bmQoYmJveFswXSAqIGRwciksXG4gICAgTWF0aC5yb3VuZChiYm94WzFdICogZHByKSxcbiAgICBNYXRoLnJvdW5kKGJib3hbMl0gKiBkcHIpLFxuICAgIE1hdGgucm91bmQoYmJveFszXSAqIGRwciksXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0Nzc1B4KGJib3g6IEJCb3gsIGRwcjogbnVtYmVyKTogQkJveCB7XG4gIGNvbnN0IHNjYWxlID0gZHByID4gMCA/IDEgLyBkcHIgOiAxO1xuICByZXR1cm4gW1xuICAgIGJib3hbMF0gKiBzY2FsZSxcbiAgICBiYm94WzFdICogc2NhbGUsXG4gICAgYmJveFsyXSAqIHNjYWxlLFxuICAgIGJib3hbM10gKiBzY2FsZSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhZEJCb3goYmJveDogQkJveCwgcGFkZGluZzogbnVtYmVyLCBtYXhCb3VuZHM/OiB7IHc6IG51bWJlcjsgaDogbnVtYmVyIH0pOiBCQm94IHtcbiAgY29uc3QgeCA9IE1hdGgubWF4KDAsIGJib3hbMF0gLSBwYWRkaW5nKTtcbiAgY29uc3QgeSA9IE1hdGgubWF4KDAsIGJib3hbMV0gLSBwYWRkaW5nKTtcbiAgbGV0IHcgPSBiYm94WzJdICsgcGFkZGluZyAqIDI7XG4gIGxldCBoID0gYmJveFszXSArIHBhZGRpbmcgKiAyO1xuXG4gIGlmIChtYXhCb3VuZHMpIHtcbiAgICB3ID0gTWF0aC5taW4odywgbWF4Qm91bmRzLncgLSB4KTtcbiAgICBoID0gTWF0aC5taW4oaCwgbWF4Qm91bmRzLmggLSB5KTtcbiAgfVxuXG4gIHJldHVybiBbeCwgeSwgTWF0aC5tYXgoMCwgdyksIE1hdGgubWF4KDAsIGgpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJvdW5kQkJveChiYm94OiBCQm94LCBwcmVjaXNpb24gPSAwKTogQkJveCB7XG4gIGNvbnN0IGZhY3RvciA9IDEwICoqIHByZWNpc2lvbjtcbiAgcmV0dXJuIFtcbiAgICBNYXRoLnJvdW5kKGJib3hbMF0gKiBmYWN0b3IpIC8gZmFjdG9yLFxuICAgIE1hdGgucm91bmQoYmJveFsxXSAqIGZhY3RvcikgLyBmYWN0b3IsXG4gICAgTWF0aC5yb3VuZChiYm94WzJdICogZmFjdG9yKSAvIGZhY3RvcixcbiAgICBNYXRoLnJvdW5kKGJib3hbM10gKiBmYWN0b3IpIC8gZmFjdG9yLFxuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcm91bmRCQm94VG9TdGVwKGJib3g6IEJCb3gsIHN0ZXAgPSA0KTogQkJveCB7XG4gIHJldHVybiBbXG4gICAgTWF0aC5yb3VuZChiYm94WzBdIC8gc3RlcCkgKiBzdGVwLFxuICAgIE1hdGgucm91bmQoYmJveFsxXSAvIHN0ZXApICogc3RlcCxcbiAgICBNYXRoLnJvdW5kKGJib3hbMl0gLyBzdGVwKSAqIHN0ZXAsXG4gICAgTWF0aC5yb3VuZChiYm94WzNdIC8gc3RlcCkgKiBzdGVwLFxuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2VudGVyUG9pbnQoYmJveDogQkJveCk6IFtudW1iZXIsIG51bWJlcl0ge1xuICByZXR1cm4gW2Jib3hbMF0gKyBiYm94WzJdIC8gMiwgYmJveFsxXSArIGJib3hbM10gLyAyXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5zUG9pbnQoYmJveDogQkJveCwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICB4ID49IGJib3hbMF0gJiZcbiAgICB4IDw9IGJib3hbMF0gKyBiYm94WzJdICYmXG4gICAgeSA+PSBiYm94WzFdICYmXG4gICAgeSA8PSBiYm94WzFdICsgYmJveFszXVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJzZWN0QkJveChhOiBCQm94LCBiOiBCQm94KTogQkJveCB8IG51bGwge1xuICBjb25zdCB4MSA9IE1hdGgubWF4KGFbMF0sIGJbMF0pO1xuICBjb25zdCB5MSA9IE1hdGgubWF4KGFbMV0sIGJbMV0pO1xuICBjb25zdCB4MiA9IE1hdGgubWluKGFbMF0gKyBhWzJdLCBiWzBdICsgYlsyXSk7XG4gIGNvbnN0IHkyID0gTWF0aC5taW4oYVsxXSArIGFbM10sIGJbMV0gKyBiWzNdKTtcblxuICBpZiAoeDIgPD0geDEgfHwgeTIgPD0geTEpIHJldHVybiBudWxsO1xuICByZXR1cm4gW3gxLCB5MSwgeDIgLSB4MSwgeTIgLSB5MV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGVCQm94KGJib3g6IEJCb3gsIGR4OiBudW1iZXIsIGR5OiBudW1iZXIpOiBCQm94IHtcbiAgcmV0dXJuIFtiYm94WzBdICsgZHgsIGJib3hbMV0gKyBkeSwgYmJveFsyXSwgYmJveFszXV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYm94QXJlYShiYm94OiBCQm94KTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGgubWF4KDAsIGJib3hbMl0pICogTWF0aC5tYXgoMCwgYmJveFszXSk7XG59XG4iLCJleHBvcnQgdmFyIHV0aWw7XG4oZnVuY3Rpb24gKHV0aWwpIHtcbiAgICB1dGlsLmFzc2VydEVxdWFsID0gKF8pID0+IHsgfTtcbiAgICBmdW5jdGlvbiBhc3NlcnRJcyhfYXJnKSB7IH1cbiAgICB1dGlsLmFzc2VydElzID0gYXNzZXJ0SXM7XG4gICAgZnVuY3Rpb24gYXNzZXJ0TmV2ZXIoX3gpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgfVxuICAgIHV0aWwuYXNzZXJ0TmV2ZXIgPSBhc3NlcnROZXZlcjtcbiAgICB1dGlsLmFycmF5VG9FbnVtID0gKGl0ZW1zKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgICAgICAgIG9ialtpdGVtXSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuICAgIHV0aWwuZ2V0VmFsaWRFbnVtVmFsdWVzID0gKG9iaikgPT4ge1xuICAgICAgICBjb25zdCB2YWxpZEtleXMgPSB1dGlsLm9iamVjdEtleXMob2JqKS5maWx0ZXIoKGspID0+IHR5cGVvZiBvYmpbb2JqW2tdXSAhPT0gXCJudW1iZXJcIik7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkID0ge307XG4gICAgICAgIGZvciAoY29uc3QgayBvZiB2YWxpZEtleXMpIHtcbiAgICAgICAgICAgIGZpbHRlcmVkW2tdID0gb2JqW2tdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1dGlsLm9iamVjdFZhbHVlcyhmaWx0ZXJlZCk7XG4gICAgfTtcbiAgICB1dGlsLm9iamVjdFZhbHVlcyA9IChvYmopID0+IHtcbiAgICAgICAgcmV0dXJuIHV0aWwub2JqZWN0S2V5cyhvYmopLm1hcChmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIG9ialtlXTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICB1dGlsLm9iamVjdEtleXMgPSB0eXBlb2YgT2JqZWN0LmtleXMgPT09IFwiZnVuY3Rpb25cIiAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGJhbi9iYW5cbiAgICAgICAgPyAob2JqKSA9PiBPYmplY3Qua2V5cyhvYmopIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYmFuL2JhblxuICAgICAgICA6IChvYmplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG9iamVjdCkge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBrZXlzO1xuICAgICAgICB9O1xuICAgIHV0aWwuZmluZCA9IChhcnIsIGNoZWNrZXIpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGFycikge1xuICAgICAgICAgICAgaWYgKGNoZWNrZXIoaXRlbSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIHV0aWwuaXNJbnRlZ2VyID0gdHlwZW9mIE51bWJlci5pc0ludGVnZXIgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICA/ICh2YWwpID0+IE51bWJlci5pc0ludGVnZXIodmFsKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGJhbi9iYW5cbiAgICAgICAgOiAodmFsKSA9PiB0eXBlb2YgdmFsID09PSBcIm51bWJlclwiICYmIE51bWJlci5pc0Zpbml0ZSh2YWwpICYmIE1hdGguZmxvb3IodmFsKSA9PT0gdmFsO1xuICAgIGZ1bmN0aW9uIGpvaW5WYWx1ZXMoYXJyYXksIHNlcGFyYXRvciA9IFwiIHwgXCIpIHtcbiAgICAgICAgcmV0dXJuIGFycmF5Lm1hcCgodmFsKSA9PiAodHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIiA/IGAnJHt2YWx9J2AgOiB2YWwpKS5qb2luKHNlcGFyYXRvcik7XG4gICAgfVxuICAgIHV0aWwuam9pblZhbHVlcyA9IGpvaW5WYWx1ZXM7XG4gICAgdXRpbC5qc29uU3RyaW5naWZ5UmVwbGFjZXIgPSAoXywgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJiaWdpbnRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG59KSh1dGlsIHx8ICh1dGlsID0ge30pKTtcbmV4cG9ydCB2YXIgb2JqZWN0VXRpbDtcbihmdW5jdGlvbiAob2JqZWN0VXRpbCkge1xuICAgIG9iamVjdFV0aWwubWVyZ2VTaGFwZXMgPSAoZmlyc3QsIHNlY29uZCkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uZmlyc3QsXG4gICAgICAgICAgICAuLi5zZWNvbmQsIC8vIHNlY29uZCBvdmVyd3JpdGVzIGZpcnN0XG4gICAgICAgIH07XG4gICAgfTtcbn0pKG9iamVjdFV0aWwgfHwgKG9iamVjdFV0aWwgPSB7fSkpO1xuZXhwb3J0IGNvbnN0IFpvZFBhcnNlZFR5cGUgPSB1dGlsLmFycmF5VG9FbnVtKFtcbiAgICBcInN0cmluZ1wiLFxuICAgIFwibmFuXCIsXG4gICAgXCJudW1iZXJcIixcbiAgICBcImludGVnZXJcIixcbiAgICBcImZsb2F0XCIsXG4gICAgXCJib29sZWFuXCIsXG4gICAgXCJkYXRlXCIsXG4gICAgXCJiaWdpbnRcIixcbiAgICBcInN5bWJvbFwiLFxuICAgIFwiZnVuY3Rpb25cIixcbiAgICBcInVuZGVmaW5lZFwiLFxuICAgIFwibnVsbFwiLFxuICAgIFwiYXJyYXlcIixcbiAgICBcIm9iamVjdFwiLFxuICAgIFwidW5rbm93blwiLFxuICAgIFwicHJvbWlzZVwiLFxuICAgIFwidm9pZFwiLFxuICAgIFwibmV2ZXJcIixcbiAgICBcIm1hcFwiLFxuICAgIFwic2V0XCIsXG5dKTtcbmV4cG9ydCBjb25zdCBnZXRQYXJzZWRUeXBlID0gKGRhdGEpID0+IHtcbiAgICBjb25zdCB0ID0gdHlwZW9mIGRhdGE7XG4gICAgc3dpdGNoICh0KSB7XG4gICAgICAgIGNhc2UgXCJ1bmRlZmluZWRcIjpcbiAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLnVuZGVmaW5lZDtcbiAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUuc3RyaW5nO1xuICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyLmlzTmFOKGRhdGEpID8gWm9kUGFyc2VkVHlwZS5uYW4gOiBab2RQYXJzZWRUeXBlLm51bWJlcjtcbiAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLmJvb2xlYW47XG4gICAgICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUuZnVuY3Rpb247XG4gICAgICAgIGNhc2UgXCJiaWdpbnRcIjpcbiAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLmJpZ2ludDtcbiAgICAgICAgY2FzZSBcInN5bWJvbFwiOlxuICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUuc3ltYm9sO1xuICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLmFycmF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS5udWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRhdGEudGhlbiAmJiB0eXBlb2YgZGF0YS50aGVuID09PSBcImZ1bmN0aW9uXCIgJiYgZGF0YS5jYXRjaCAmJiB0eXBlb2YgZGF0YS5jYXRjaCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUucHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgTWFwICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS5tYXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIFNldCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkYXRhIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUuc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBEYXRlICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUuZGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLm9iamVjdDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLnVua25vd247XG4gICAgfVxufTtcbiIsImltcG9ydCB7IHV0aWwgfSBmcm9tIFwiLi9oZWxwZXJzL3V0aWwuanNcIjtcbmV4cG9ydCBjb25zdCBab2RJc3N1ZUNvZGUgPSB1dGlsLmFycmF5VG9FbnVtKFtcbiAgICBcImludmFsaWRfdHlwZVwiLFxuICAgIFwiaW52YWxpZF9saXRlcmFsXCIsXG4gICAgXCJjdXN0b21cIixcbiAgICBcImludmFsaWRfdW5pb25cIixcbiAgICBcImludmFsaWRfdW5pb25fZGlzY3JpbWluYXRvclwiLFxuICAgIFwiaW52YWxpZF9lbnVtX3ZhbHVlXCIsXG4gICAgXCJ1bnJlY29nbml6ZWRfa2V5c1wiLFxuICAgIFwiaW52YWxpZF9hcmd1bWVudHNcIixcbiAgICBcImludmFsaWRfcmV0dXJuX3R5cGVcIixcbiAgICBcImludmFsaWRfZGF0ZVwiLFxuICAgIFwiaW52YWxpZF9zdHJpbmdcIixcbiAgICBcInRvb19zbWFsbFwiLFxuICAgIFwidG9vX2JpZ1wiLFxuICAgIFwiaW52YWxpZF9pbnRlcnNlY3Rpb25fdHlwZXNcIixcbiAgICBcIm5vdF9tdWx0aXBsZV9vZlwiLFxuICAgIFwibm90X2Zpbml0ZVwiLFxuXSk7XG5leHBvcnQgY29uc3QgcXVvdGVsZXNzSnNvbiA9IChvYmopID0+IHtcbiAgICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCAyKTtcbiAgICByZXR1cm4ganNvbi5yZXBsYWNlKC9cIihbXlwiXSspXCI6L2csIFwiJDE6XCIpO1xufTtcbmV4cG9ydCBjbGFzcyBab2RFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBnZXQgZXJyb3JzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc3N1ZXM7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKGlzc3Vlcykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlzc3VlcyA9IFtdO1xuICAgICAgICB0aGlzLmFkZElzc3VlID0gKHN1YikgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc3N1ZXMgPSBbLi4udGhpcy5pc3N1ZXMsIHN1Yl07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWRkSXNzdWVzID0gKHN1YnMgPSBbXSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc3N1ZXMgPSBbLi4udGhpcy5pc3N1ZXMsIC4uLnN1YnNdO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBhY3R1YWxQcm90byA9IG5ldy50YXJnZXQucHJvdG90eXBlO1xuICAgICAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgYmFuL2JhblxuICAgICAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIGFjdHVhbFByb3RvKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX19wcm90b19fID0gYWN0dWFsUHJvdG87XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uYW1lID0gXCJab2RFcnJvclwiO1xuICAgICAgICB0aGlzLmlzc3VlcyA9IGlzc3VlcztcbiAgICB9XG4gICAgZm9ybWF0KF9tYXBwZXIpIHtcbiAgICAgICAgY29uc3QgbWFwcGVyID0gX21hcHBlciB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGlzc3VlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzc3VlLm1lc3NhZ2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjb25zdCBmaWVsZEVycm9ycyA9IHsgX2Vycm9yczogW10gfTtcbiAgICAgICAgY29uc3QgcHJvY2Vzc0Vycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGlzc3VlIG9mIGVycm9yLmlzc3Vlcykge1xuICAgICAgICAgICAgICAgIGlmIChpc3N1ZS5jb2RlID09PSBcImludmFsaWRfdW5pb25cIikge1xuICAgICAgICAgICAgICAgICAgICBpc3N1ZS51bmlvbkVycm9ycy5tYXAocHJvY2Vzc0Vycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUuY29kZSA9PT0gXCJpbnZhbGlkX3JldHVybl90eXBlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0Vycm9yKGlzc3VlLnJldHVyblR5cGVFcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLmNvZGUgPT09IFwiaW52YWxpZF9hcmd1bWVudHNcIikge1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRXJyb3IoaXNzdWUuYXJndW1lbnRzRXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS5wYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZEVycm9ycy5fZXJyb3JzLnB1c2gobWFwcGVyKGlzc3VlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY3VyciA9IGZpZWxkRXJyb3JzO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgaXNzdWUucGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gaXNzdWUucGF0aFtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlcm1pbmFsID0gaSA9PT0gaXNzdWUucGF0aC5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0ZXJtaW5hbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJbZWxdID0gY3VycltlbF0gfHwgeyBfZXJyb3JzOiBbXSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmICh0eXBlb2YgZWwgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGN1cnJbZWxdID0gY3VycltlbF0gfHwgeyBfZXJyb3JzOiBbXSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSBpZiAodHlwZW9mIGVsID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjb25zdCBlcnJvckFycmF5OiBhbnkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGVycm9yQXJyYXkuX2Vycm9ycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY3VycltlbF0gPSBjdXJyW2VsXSB8fCBlcnJvckFycmF5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJbZWxdID0gY3VycltlbF0gfHwgeyBfZXJyb3JzOiBbXSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJbZWxdLl9lcnJvcnMucHVzaChtYXBwZXIoaXNzdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnIgPSBjdXJyW2VsXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcHJvY2Vzc0Vycm9yKHRoaXMpO1xuICAgICAgICByZXR1cm4gZmllbGRFcnJvcnM7XG4gICAgfVxuICAgIHN0YXRpYyBhc3NlcnQodmFsdWUpIHtcbiAgICAgICAgaWYgKCEodmFsdWUgaW5zdGFuY2VvZiBab2RFcnJvcikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm90IGEgWm9kRXJyb3I6ICR7dmFsdWV9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2U7XG4gICAgfVxuICAgIGdldCBtZXNzYWdlKCkge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5pc3N1ZXMsIHV0aWwuanNvblN0cmluZ2lmeVJlcGxhY2VyLCAyKTtcbiAgICB9XG4gICAgZ2V0IGlzRW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzc3Vlcy5sZW5ndGggPT09IDA7XG4gICAgfVxuICAgIGZsYXR0ZW4obWFwcGVyID0gKGlzc3VlKSA9PiBpc3N1ZS5tZXNzYWdlKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkRXJyb3JzID0ge307XG4gICAgICAgIGNvbnN0IGZvcm1FcnJvcnMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBzdWIgb2YgdGhpcy5pc3N1ZXMpIHtcbiAgICAgICAgICAgIGlmIChzdWIucGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlyc3RFbCA9IHN1Yi5wYXRoWzBdO1xuICAgICAgICAgICAgICAgIGZpZWxkRXJyb3JzW2ZpcnN0RWxdID0gZmllbGRFcnJvcnNbZmlyc3RFbF0gfHwgW107XG4gICAgICAgICAgICAgICAgZmllbGRFcnJvcnNbZmlyc3RFbF0ucHVzaChtYXBwZXIoc3ViKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtRXJyb3JzLnB1c2gobWFwcGVyKHN1YikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGZvcm1FcnJvcnMsIGZpZWxkRXJyb3JzIH07XG4gICAgfVxuICAgIGdldCBmb3JtRXJyb3JzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mbGF0dGVuKCk7XG4gICAgfVxufVxuWm9kRXJyb3IuY3JlYXRlID0gKGlzc3VlcykgPT4ge1xuICAgIGNvbnN0IGVycm9yID0gbmV3IFpvZEVycm9yKGlzc3Vlcyk7XG4gICAgcmV0dXJuIGVycm9yO1xufTtcbiIsImltcG9ydCB7IFpvZElzc3VlQ29kZSB9IGZyb20gXCIuLi9ab2RFcnJvci5qc1wiO1xuaW1wb3J0IHsgdXRpbCwgWm9kUGFyc2VkVHlwZSB9IGZyb20gXCIuLi9oZWxwZXJzL3V0aWwuanNcIjtcbmNvbnN0IGVycm9yTWFwID0gKGlzc3VlLCBfY3R4KSA9PiB7XG4gICAgbGV0IG1lc3NhZ2U7XG4gICAgc3dpdGNoIChpc3N1ZS5jb2RlKSB7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZTpcbiAgICAgICAgICAgIGlmIChpc3N1ZS5yZWNlaXZlZCA9PT0gWm9kUGFyc2VkVHlwZS51bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJSZXF1aXJlZFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBFeHBlY3RlZCAke2lzc3VlLmV4cGVjdGVkfSwgcmVjZWl2ZWQgJHtpc3N1ZS5yZWNlaXZlZH1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLmludmFsaWRfbGl0ZXJhbDpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW52YWxpZCBsaXRlcmFsIHZhbHVlLCBleHBlY3RlZCAke0pTT04uc3RyaW5naWZ5KGlzc3VlLmV4cGVjdGVkLCB1dGlsLmpzb25TdHJpbmdpZnlSZXBsYWNlcil9YDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS51bnJlY29nbml6ZWRfa2V5czpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgVW5yZWNvZ25pemVkIGtleShzKSBpbiBvYmplY3Q6ICR7dXRpbC5qb2luVmFsdWVzKGlzc3VlLmtleXMsIFwiLCBcIil9YDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5pbnZhbGlkX3VuaW9uOlxuICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnZhbGlkIGlucHV0YDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5pbnZhbGlkX3VuaW9uX2Rpc2NyaW1pbmF0b3I6XG4gICAgICAgICAgICBtZXNzYWdlID0gYEludmFsaWQgZGlzY3JpbWluYXRvciB2YWx1ZS4gRXhwZWN0ZWQgJHt1dGlsLmpvaW5WYWx1ZXMoaXNzdWUub3B0aW9ucyl9YDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5pbnZhbGlkX2VudW1fdmFsdWU6XG4gICAgICAgICAgICBtZXNzYWdlID0gYEludmFsaWQgZW51bSB2YWx1ZS4gRXhwZWN0ZWQgJHt1dGlsLmpvaW5WYWx1ZXMoaXNzdWUub3B0aW9ucyl9LCByZWNlaXZlZCAnJHtpc3N1ZS5yZWNlaXZlZH0nYDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5pbnZhbGlkX2FyZ3VtZW50czpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW52YWxpZCBmdW5jdGlvbiBhcmd1bWVudHNgO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLmludmFsaWRfcmV0dXJuX3R5cGU6XG4gICAgICAgICAgICBtZXNzYWdlID0gYEludmFsaWQgZnVuY3Rpb24gcmV0dXJuIHR5cGVgO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLmludmFsaWRfZGF0ZTpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW52YWxpZCBkYXRlYDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZzpcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaXNzdWUudmFsaWRhdGlvbiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIGlmIChcImluY2x1ZGVzXCIgaW4gaXNzdWUudmFsaWRhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gYEludmFsaWQgaW5wdXQ6IG11c3QgaW5jbHVkZSBcIiR7aXNzdWUudmFsaWRhdGlvbi5pbmNsdWRlc31cImA7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXNzdWUudmFsaWRhdGlvbi5wb3NpdGlvbiA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGAke21lc3NhZ2V9IGF0IG9uZSBvciBtb3JlIHBvc2l0aW9ucyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gJHtpc3N1ZS52YWxpZGF0aW9uLnBvc2l0aW9ufWA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoXCJzdGFydHNXaXRoXCIgaW4gaXNzdWUudmFsaWRhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gYEludmFsaWQgaW5wdXQ6IG11c3Qgc3RhcnQgd2l0aCBcIiR7aXNzdWUudmFsaWRhdGlvbi5zdGFydHNXaXRofVwiYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoXCJlbmRzV2l0aFwiIGluIGlzc3VlLnZhbGlkYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnZhbGlkIGlucHV0OiBtdXN0IGVuZCB3aXRoIFwiJHtpc3N1ZS52YWxpZGF0aW9uLmVuZHNXaXRofVwiYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWwuYXNzZXJ0TmV2ZXIoaXNzdWUudmFsaWRhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUudmFsaWRhdGlvbiAhPT0gXCJyZWdleFwiKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnZhbGlkICR7aXNzdWUudmFsaWRhdGlvbn1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiSW52YWxpZFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLnRvb19zbWFsbDpcbiAgICAgICAgICAgIGlmIChpc3N1ZS50eXBlID09PSBcImFycmF5XCIpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBBcnJheSBtdXN0IGNvbnRhaW4gJHtpc3N1ZS5leGFjdCA/IFwiZXhhY3RseVwiIDogaXNzdWUuaW5jbHVzaXZlID8gYGF0IGxlYXN0YCA6IGBtb3JlIHRoYW5gfSAke2lzc3VlLm1pbmltdW19IGVsZW1lbnQocylgO1xuICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUudHlwZSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gYFN0cmluZyBtdXN0IGNvbnRhaW4gJHtpc3N1ZS5leGFjdCA/IFwiZXhhY3RseVwiIDogaXNzdWUuaW5jbHVzaXZlID8gYGF0IGxlYXN0YCA6IGBvdmVyYH0gJHtpc3N1ZS5taW5pbXVtfSBjaGFyYWN0ZXIocylgO1xuICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUudHlwZSA9PT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gYE51bWJlciBtdXN0IGJlICR7aXNzdWUuZXhhY3QgPyBgZXhhY3RseSBlcXVhbCB0byBgIDogaXNzdWUuaW5jbHVzaXZlID8gYGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byBgIDogYGdyZWF0ZXIgdGhhbiBgfSR7aXNzdWUubWluaW11bX1gO1xuICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUudHlwZSA9PT0gXCJiaWdpbnRcIilcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gYE51bWJlciBtdXN0IGJlICR7aXNzdWUuZXhhY3QgPyBgZXhhY3RseSBlcXVhbCB0byBgIDogaXNzdWUuaW5jbHVzaXZlID8gYGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byBgIDogYGdyZWF0ZXIgdGhhbiBgfSR7aXNzdWUubWluaW11bX1gO1xuICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUudHlwZSA9PT0gXCJkYXRlXCIpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBEYXRlIG11c3QgYmUgJHtpc3N1ZS5leGFjdCA/IGBleGFjdGx5IGVxdWFsIHRvIGAgOiBpc3N1ZS5pbmNsdXNpdmUgPyBgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIGAgOiBgZ3JlYXRlciB0aGFuIGB9JHtuZXcgRGF0ZShOdW1iZXIoaXNzdWUubWluaW11bSkpfWA7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiSW52YWxpZCBpbnB1dFwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLnRvb19iaWc6XG4gICAgICAgICAgICBpZiAoaXNzdWUudHlwZSA9PT0gXCJhcnJheVwiKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgQXJyYXkgbXVzdCBjb250YWluICR7aXNzdWUuZXhhY3QgPyBgZXhhY3RseWAgOiBpc3N1ZS5pbmNsdXNpdmUgPyBgYXQgbW9zdGAgOiBgbGVzcyB0aGFuYH0gJHtpc3N1ZS5tYXhpbXVtfSBlbGVtZW50KHMpYDtcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLnR5cGUgPT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBTdHJpbmcgbXVzdCBjb250YWluICR7aXNzdWUuZXhhY3QgPyBgZXhhY3RseWAgOiBpc3N1ZS5pbmNsdXNpdmUgPyBgYXQgbW9zdGAgOiBgdW5kZXJgfSAke2lzc3VlLm1heGltdW19IGNoYXJhY3RlcihzKWA7XG4gICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS50eXBlID09PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgTnVtYmVyIG11c3QgYmUgJHtpc3N1ZS5leGFjdCA/IGBleGFjdGx5YCA6IGlzc3VlLmluY2x1c2l2ZSA/IGBsZXNzIHRoYW4gb3IgZXF1YWwgdG9gIDogYGxlc3MgdGhhbmB9ICR7aXNzdWUubWF4aW11bX1gO1xuICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUudHlwZSA9PT0gXCJiaWdpbnRcIilcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gYEJpZ0ludCBtdXN0IGJlICR7aXNzdWUuZXhhY3QgPyBgZXhhY3RseWAgOiBpc3N1ZS5pbmNsdXNpdmUgPyBgbGVzcyB0aGFuIG9yIGVxdWFsIHRvYCA6IGBsZXNzIHRoYW5gfSAke2lzc3VlLm1heGltdW19YDtcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLnR5cGUgPT09IFwiZGF0ZVwiKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgRGF0ZSBtdXN0IGJlICR7aXNzdWUuZXhhY3QgPyBgZXhhY3RseWAgOiBpc3N1ZS5pbmNsdXNpdmUgPyBgc21hbGxlciB0aGFuIG9yIGVxdWFsIHRvYCA6IGBzbWFsbGVyIHRoYW5gfSAke25ldyBEYXRlKE51bWJlcihpc3N1ZS5tYXhpbXVtKSl9YDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJJbnZhbGlkIGlucHV0XCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUuY3VzdG9tOlxuICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnZhbGlkIGlucHV0YDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5pbnZhbGlkX2ludGVyc2VjdGlvbl90eXBlczpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW50ZXJzZWN0aW9uIHJlc3VsdHMgY291bGQgbm90IGJlIG1lcmdlZGA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUubm90X211bHRpcGxlX29mOlxuICAgICAgICAgICAgbWVzc2FnZSA9IGBOdW1iZXIgbXVzdCBiZSBhIG11bHRpcGxlIG9mICR7aXNzdWUubXVsdGlwbGVPZn1gO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLm5vdF9maW5pdGU6XG4gICAgICAgICAgICBtZXNzYWdlID0gXCJOdW1iZXIgbXVzdCBiZSBmaW5pdGVcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgbWVzc2FnZSA9IF9jdHguZGVmYXVsdEVycm9yO1xuICAgICAgICAgICAgdXRpbC5hc3NlcnROZXZlcihpc3N1ZSk7XG4gICAgfVxuICAgIHJldHVybiB7IG1lc3NhZ2UgfTtcbn07XG5leHBvcnQgZGVmYXVsdCBlcnJvck1hcDtcbiIsImltcG9ydCBkZWZhdWx0RXJyb3JNYXAgZnJvbSBcIi4vbG9jYWxlcy9lbi5qc1wiO1xubGV0IG92ZXJyaWRlRXJyb3JNYXAgPSBkZWZhdWx0RXJyb3JNYXA7XG5leHBvcnQgeyBkZWZhdWx0RXJyb3JNYXAgfTtcbmV4cG9ydCBmdW5jdGlvbiBzZXRFcnJvck1hcChtYXApIHtcbiAgICBvdmVycmlkZUVycm9yTWFwID0gbWFwO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEVycm9yTWFwKCkge1xuICAgIHJldHVybiBvdmVycmlkZUVycm9yTWFwO1xufVxuIiwiaW1wb3J0IHsgZ2V0RXJyb3JNYXAgfSBmcm9tIFwiLi4vZXJyb3JzLmpzXCI7XG5pbXBvcnQgZGVmYXVsdEVycm9yTWFwIGZyb20gXCIuLi9sb2NhbGVzL2VuLmpzXCI7XG5leHBvcnQgY29uc3QgbWFrZUlzc3VlID0gKHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHsgZGF0YSwgcGF0aCwgZXJyb3JNYXBzLCBpc3N1ZURhdGEgfSA9IHBhcmFtcztcbiAgICBjb25zdCBmdWxsUGF0aCA9IFsuLi5wYXRoLCAuLi4oaXNzdWVEYXRhLnBhdGggfHwgW10pXTtcbiAgICBjb25zdCBmdWxsSXNzdWUgPSB7XG4gICAgICAgIC4uLmlzc3VlRGF0YSxcbiAgICAgICAgcGF0aDogZnVsbFBhdGgsXG4gICAgfTtcbiAgICBpZiAoaXNzdWVEYXRhLm1lc3NhZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uaXNzdWVEYXRhLFxuICAgICAgICAgICAgcGF0aDogZnVsbFBhdGgsXG4gICAgICAgICAgICBtZXNzYWdlOiBpc3N1ZURhdGEubWVzc2FnZSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgbGV0IGVycm9yTWVzc2FnZSA9IFwiXCI7XG4gICAgY29uc3QgbWFwcyA9IGVycm9yTWFwc1xuICAgICAgICAuZmlsdGVyKChtKSA9PiAhIW0pXG4gICAgICAgIC5zbGljZSgpXG4gICAgICAgIC5yZXZlcnNlKCk7XG4gICAgZm9yIChjb25zdCBtYXAgb2YgbWFwcykge1xuICAgICAgICBlcnJvck1lc3NhZ2UgPSBtYXAoZnVsbElzc3VlLCB7IGRhdGEsIGRlZmF1bHRFcnJvcjogZXJyb3JNZXNzYWdlIH0pLm1lc3NhZ2U7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmlzc3VlRGF0YSxcbiAgICAgICAgcGF0aDogZnVsbFBhdGgsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yTWVzc2FnZSxcbiAgICB9O1xufTtcbmV4cG9ydCBjb25zdCBFTVBUWV9QQVRIID0gW107XG5leHBvcnQgZnVuY3Rpb24gYWRkSXNzdWVUb0NvbnRleHQoY3R4LCBpc3N1ZURhdGEpIHtcbiAgICBjb25zdCBvdmVycmlkZU1hcCA9IGdldEVycm9yTWFwKCk7XG4gICAgY29uc3QgaXNzdWUgPSBtYWtlSXNzdWUoe1xuICAgICAgICBpc3N1ZURhdGE6IGlzc3VlRGF0YSxcbiAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICBlcnJvck1hcHM6IFtcbiAgICAgICAgICAgIGN0eC5jb21tb24uY29udGV4dHVhbEVycm9yTWFwLCAvLyBjb250ZXh0dWFsIGVycm9yIG1hcCBpcyBmaXJzdCBwcmlvcml0eVxuICAgICAgICAgICAgY3R4LnNjaGVtYUVycm9yTWFwLCAvLyB0aGVuIHNjaGVtYS1ib3VuZCBtYXAgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgICBvdmVycmlkZU1hcCwgLy8gdGhlbiBnbG9iYWwgb3ZlcnJpZGUgbWFwXG4gICAgICAgICAgICBvdmVycmlkZU1hcCA9PT0gZGVmYXVsdEVycm9yTWFwID8gdW5kZWZpbmVkIDogZGVmYXVsdEVycm9yTWFwLCAvLyB0aGVuIGdsb2JhbCBkZWZhdWx0IG1hcFxuICAgICAgICBdLmZpbHRlcigoeCkgPT4gISF4KSxcbiAgICB9KTtcbiAgICBjdHguY29tbW9uLmlzc3Vlcy5wdXNoKGlzc3VlKTtcbn1cbmV4cG9ydCBjbGFzcyBQYXJzZVN0YXR1cyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSBcInZhbGlkXCI7XG4gICAgfVxuICAgIGRpcnR5KCkge1xuICAgICAgICBpZiAodGhpcy52YWx1ZSA9PT0gXCJ2YWxpZFwiKVxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFwiZGlydHlcIjtcbiAgICB9XG4gICAgYWJvcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLnZhbHVlICE9PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcImFib3J0ZWRcIjtcbiAgICB9XG4gICAgc3RhdGljIG1lcmdlQXJyYXkoc3RhdHVzLCByZXN1bHRzKSB7XG4gICAgICAgIGNvbnN0IGFycmF5VmFsdWUgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBzIG9mIHJlc3VsdHMpIHtcbiAgICAgICAgICAgIGlmIChzLnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICBpZiAocy5zdGF0dXMgPT09IFwiZGlydHlcIilcbiAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgIGFycmF5VmFsdWUucHVzaChzLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cy52YWx1ZSwgdmFsdWU6IGFycmF5VmFsdWUgfTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIG1lcmdlT2JqZWN0QXN5bmMoc3RhdHVzLCBwYWlycykge1xuICAgICAgICBjb25zdCBzeW5jUGFpcnMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBwYWlyIG9mIHBhaXJzKSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBhd2FpdCBwYWlyLmtleTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gYXdhaXQgcGFpci52YWx1ZTtcbiAgICAgICAgICAgIHN5bmNQYWlycy5wdXNoKHtcbiAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUGFyc2VTdGF0dXMubWVyZ2VPYmplY3RTeW5jKHN0YXR1cywgc3luY1BhaXJzKTtcbiAgICB9XG4gICAgc3RhdGljIG1lcmdlT2JqZWN0U3luYyhzdGF0dXMsIHBhaXJzKSB7XG4gICAgICAgIGNvbnN0IGZpbmFsT2JqZWN0ID0ge307XG4gICAgICAgIGZvciAoY29uc3QgcGFpciBvZiBwYWlycykge1xuICAgICAgICAgICAgY29uc3QgeyBrZXksIHZhbHVlIH0gPSBwYWlyO1xuICAgICAgICAgICAgaWYgKGtleS5zdGF0dXMgPT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICBpZiAoa2V5LnN0YXR1cyA9PT0gXCJkaXJ0eVwiKVxuICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXR1cyA9PT0gXCJkaXJ0eVwiKVxuICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgaWYgKGtleS52YWx1ZSAhPT0gXCJfX3Byb3RvX19cIiAmJiAodHlwZW9mIHZhbHVlLnZhbHVlICE9PSBcInVuZGVmaW5lZFwiIHx8IHBhaXIuYWx3YXlzU2V0KSkge1xuICAgICAgICAgICAgICAgIGZpbmFsT2JqZWN0W2tleS52YWx1ZV0gPSB2YWx1ZS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cy52YWx1ZSwgdmFsdWU6IGZpbmFsT2JqZWN0IH07XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IElOVkFMSUQgPSBPYmplY3QuZnJlZXplKHtcbiAgICBzdGF0dXM6IFwiYWJvcnRlZFwiLFxufSk7XG5leHBvcnQgY29uc3QgRElSVFkgPSAodmFsdWUpID0+ICh7IHN0YXR1czogXCJkaXJ0eVwiLCB2YWx1ZSB9KTtcbmV4cG9ydCBjb25zdCBPSyA9ICh2YWx1ZSkgPT4gKHsgc3RhdHVzOiBcInZhbGlkXCIsIHZhbHVlIH0pO1xuZXhwb3J0IGNvbnN0IGlzQWJvcnRlZCA9ICh4KSA9PiB4LnN0YXR1cyA9PT0gXCJhYm9ydGVkXCI7XG5leHBvcnQgY29uc3QgaXNEaXJ0eSA9ICh4KSA9PiB4LnN0YXR1cyA9PT0gXCJkaXJ0eVwiO1xuZXhwb3J0IGNvbnN0IGlzVmFsaWQgPSAoeCkgPT4geC5zdGF0dXMgPT09IFwidmFsaWRcIjtcbmV4cG9ydCBjb25zdCBpc0FzeW5jID0gKHgpID0+IHR5cGVvZiBQcm9taXNlICE9PSBcInVuZGVmaW5lZFwiICYmIHggaW5zdGFuY2VvZiBQcm9taXNlO1xuIiwiZXhwb3J0IHZhciBlcnJvclV0aWw7XG4oZnVuY3Rpb24gKGVycm9yVXRpbCkge1xuICAgIGVycm9yVXRpbC5lcnJUb09iaiA9IChtZXNzYWdlKSA9PiB0eXBlb2YgbWVzc2FnZSA9PT0gXCJzdHJpbmdcIiA/IHsgbWVzc2FnZSB9IDogbWVzc2FnZSB8fCB7fTtcbiAgICAvLyBiaW9tZS1pZ25vcmUgbGludDpcbiAgICBlcnJvclV0aWwudG9TdHJpbmcgPSAobWVzc2FnZSkgPT4gdHlwZW9mIG1lc3NhZ2UgPT09IFwic3RyaW5nXCIgPyBtZXNzYWdlIDogbWVzc2FnZT8ubWVzc2FnZTtcbn0pKGVycm9yVXRpbCB8fCAoZXJyb3JVdGlsID0ge30pKTtcbiIsImltcG9ydCB7IFpvZEVycm9yLCBab2RJc3N1ZUNvZGUsIH0gZnJvbSBcIi4vWm9kRXJyb3IuanNcIjtcbmltcG9ydCB7IGRlZmF1bHRFcnJvck1hcCwgZ2V0RXJyb3JNYXAgfSBmcm9tIFwiLi9lcnJvcnMuanNcIjtcbmltcG9ydCB7IGVycm9yVXRpbCB9IGZyb20gXCIuL2hlbHBlcnMvZXJyb3JVdGlsLmpzXCI7XG5pbXBvcnQgeyBESVJUWSwgSU5WQUxJRCwgT0ssIFBhcnNlU3RhdHVzLCBhZGRJc3N1ZVRvQ29udGV4dCwgaXNBYm9ydGVkLCBpc0FzeW5jLCBpc0RpcnR5LCBpc1ZhbGlkLCBtYWtlSXNzdWUsIH0gZnJvbSBcIi4vaGVscGVycy9wYXJzZVV0aWwuanNcIjtcbmltcG9ydCB7IHV0aWwsIFpvZFBhcnNlZFR5cGUsIGdldFBhcnNlZFR5cGUgfSBmcm9tIFwiLi9oZWxwZXJzL3V0aWwuanNcIjtcbmNsYXNzIFBhcnNlSW5wdXRMYXp5UGF0aCB7XG4gICAgY29uc3RydWN0b3IocGFyZW50LCB2YWx1ZSwgcGF0aCwga2V5KSB7XG4gICAgICAgIHRoaXMuX2NhY2hlZFBhdGggPSBbXTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuZGF0YSA9IHZhbHVlO1xuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5fa2V5ID0ga2V5O1xuICAgIH1cbiAgICBnZXQgcGF0aCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jYWNoZWRQYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5fa2V5KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlZFBhdGgucHVzaCguLi50aGlzLl9wYXRoLCAuLi50aGlzLl9rZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVkUGF0aC5wdXNoKC4uLnRoaXMuX3BhdGgsIHRoaXMuX2tleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlZFBhdGg7XG4gICAgfVxufVxuY29uc3QgaGFuZGxlUmVzdWx0ID0gKGN0eCwgcmVzdWx0KSA9PiB7XG4gICAgaWYgKGlzVmFsaWQocmVzdWx0KSkge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiByZXN1bHQudmFsdWUgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICghY3R4LmNvbW1vbi5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJWYWxpZGF0aW9uIGZhaWxlZCBidXQgbm8gaXNzdWVzIGRldGVjdGVkLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICBnZXQgZXJyb3IoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Vycm9yKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZXJyb3I7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgWm9kRXJyb3IoY3R4LmNvbW1vbi5pc3N1ZXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yID0gZXJyb3I7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Vycm9yO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG59O1xuZnVuY3Rpb24gcHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpIHtcbiAgICBpZiAoIXBhcmFtcylcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIGNvbnN0IHsgZXJyb3JNYXAsIGludmFsaWRfdHlwZV9lcnJvciwgcmVxdWlyZWRfZXJyb3IsIGRlc2NyaXB0aW9uIH0gPSBwYXJhbXM7XG4gICAgaWYgKGVycm9yTWFwICYmIChpbnZhbGlkX3R5cGVfZXJyb3IgfHwgcmVxdWlyZWRfZXJyb3IpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2FuJ3QgdXNlIFwiaW52YWxpZF90eXBlX2Vycm9yXCIgb3IgXCJyZXF1aXJlZF9lcnJvclwiIGluIGNvbmp1bmN0aW9uIHdpdGggY3VzdG9tIGVycm9yIG1hcC5gKTtcbiAgICB9XG4gICAgaWYgKGVycm9yTWFwKVxuICAgICAgICByZXR1cm4geyBlcnJvck1hcDogZXJyb3JNYXAsIGRlc2NyaXB0aW9uIH07XG4gICAgY29uc3QgY3VzdG9tTWFwID0gKGlzcywgY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gcGFyYW1zO1xuICAgICAgICBpZiAoaXNzLmNvZGUgPT09IFwiaW52YWxpZF9lbnVtX3ZhbHVlXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB7IG1lc3NhZ2U6IG1lc3NhZ2UgPz8gY3R4LmRlZmF1bHRFcnJvciB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY3R4LmRhdGEgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB7IG1lc3NhZ2U6IG1lc3NhZ2UgPz8gcmVxdWlyZWRfZXJyb3IgPz8gY3R4LmRlZmF1bHRFcnJvciB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc3MuY29kZSAhPT0gXCJpbnZhbGlkX3R5cGVcIilcbiAgICAgICAgICAgIHJldHVybiB7IG1lc3NhZ2U6IGN0eC5kZWZhdWx0RXJyb3IgfTtcbiAgICAgICAgcmV0dXJuIHsgbWVzc2FnZTogbWVzc2FnZSA/PyBpbnZhbGlkX3R5cGVfZXJyb3IgPz8gY3R4LmRlZmF1bHRFcnJvciB9O1xuICAgIH07XG4gICAgcmV0dXJuIHsgZXJyb3JNYXA6IGN1c3RvbU1hcCwgZGVzY3JpcHRpb24gfTtcbn1cbmV4cG9ydCBjbGFzcyBab2RUeXBlIHtcbiAgICBnZXQgZGVzY3JpcHRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuZGVzY3JpcHRpb247XG4gICAgfVxuICAgIF9nZXRUeXBlKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBnZXRQYXJzZWRUeXBlKGlucHV0LmRhdGEpO1xuICAgIH1cbiAgICBfZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCkge1xuICAgICAgICByZXR1cm4gKGN0eCB8fCB7XG4gICAgICAgICAgICBjb21tb246IGlucHV0LnBhcmVudC5jb21tb24sXG4gICAgICAgICAgICBkYXRhOiBpbnB1dC5kYXRhLFxuICAgICAgICAgICAgcGFyc2VkVHlwZTogZ2V0UGFyc2VkVHlwZShpbnB1dC5kYXRhKSxcbiAgICAgICAgICAgIHNjaGVtYUVycm9yTWFwOiB0aGlzLl9kZWYuZXJyb3JNYXAsXG4gICAgICAgICAgICBwYXRoOiBpbnB1dC5wYXRoLFxuICAgICAgICAgICAgcGFyZW50OiBpbnB1dC5wYXJlbnQsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IG5ldyBQYXJzZVN0YXR1cygpLFxuICAgICAgICAgICAgY3R4OiB7XG4gICAgICAgICAgICAgICAgY29tbW9uOiBpbnB1dC5wYXJlbnQuY29tbW9uLFxuICAgICAgICAgICAgICAgIGRhdGE6IGlucHV0LmRhdGEsXG4gICAgICAgICAgICAgICAgcGFyc2VkVHlwZTogZ2V0UGFyc2VkVHlwZShpbnB1dC5kYXRhKSxcbiAgICAgICAgICAgICAgICBzY2hlbWFFcnJvck1hcDogdGhpcy5fZGVmLmVycm9yTWFwLFxuICAgICAgICAgICAgICAgIHBhdGg6IGlucHV0LnBhdGgsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBpbnB1dC5wYXJlbnQsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBfcGFyc2VTeW5jKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3BhcnNlKGlucHV0KTtcbiAgICAgICAgaWYgKGlzQXN5bmMocmVzdWx0KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU3luY2hyb25vdXMgcGFyc2UgZW5jb3VudGVyZWQgcHJvbWlzZS5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgX3BhcnNlQXN5bmMoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcGFyc2UoaW5wdXQpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgfVxuICAgIHBhcnNlKGRhdGEsIHBhcmFtcykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnNhZmVQYXJzZShkYXRhLCBwYXJhbXMpO1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LmRhdGE7XG4gICAgICAgIHRocm93IHJlc3VsdC5lcnJvcjtcbiAgICB9XG4gICAgc2FmZVBhcnNlKGRhdGEsIHBhcmFtcykge1xuICAgICAgICBjb25zdCBjdHggPSB7XG4gICAgICAgICAgICBjb21tb246IHtcbiAgICAgICAgICAgICAgICBpc3N1ZXM6IFtdLFxuICAgICAgICAgICAgICAgIGFzeW5jOiBwYXJhbXM/LmFzeW5jID8/IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbnRleHR1YWxFcnJvck1hcDogcGFyYW1zPy5lcnJvck1hcCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXRoOiBwYXJhbXM/LnBhdGggfHwgW10sXG4gICAgICAgICAgICBzY2hlbWFFcnJvck1hcDogdGhpcy5fZGVmLmVycm9yTWFwLFxuICAgICAgICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIHBhcnNlZFR5cGU6IGdldFBhcnNlZFR5cGUoZGF0YSksXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3BhcnNlU3luYyh7IGRhdGEsIHBhdGg6IGN0eC5wYXRoLCBwYXJlbnQ6IGN0eCB9KTtcbiAgICAgICAgcmV0dXJuIGhhbmRsZVJlc3VsdChjdHgsIHJlc3VsdCk7XG4gICAgfVxuICAgIFwifnZhbGlkYXRlXCIoZGF0YSkge1xuICAgICAgICBjb25zdCBjdHggPSB7XG4gICAgICAgICAgICBjb21tb246IHtcbiAgICAgICAgICAgICAgICBpc3N1ZXM6IFtdLFxuICAgICAgICAgICAgICAgIGFzeW5jOiAhIXRoaXNbXCJ+c3RhbmRhcmRcIl0uYXN5bmMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGF0aDogW10sXG4gICAgICAgICAgICBzY2hlbWFFcnJvck1hcDogdGhpcy5fZGVmLmVycm9yTWFwLFxuICAgICAgICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIHBhcnNlZFR5cGU6IGdldFBhcnNlZFR5cGUoZGF0YSksXG4gICAgICAgIH07XG4gICAgICAgIGlmICghdGhpc1tcIn5zdGFuZGFyZFwiXS5hc3luYykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9wYXJzZVN5bmMoeyBkYXRhLCBwYXRoOiBbXSwgcGFyZW50OiBjdHggfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQocmVzdWx0KVxuICAgICAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc3N1ZXM6IGN0eC5jb21tb24uaXNzdWVzLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnI/Lm1lc3NhZ2U/LnRvTG93ZXJDYXNlKCk/LmluY2x1ZGVzKFwiZW5jb3VudGVyZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tcIn5zdGFuZGFyZFwiXS5hc3luYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGN0eC5jb21tb24gPSB7XG4gICAgICAgICAgICAgICAgICAgIGlzc3VlczogW10sXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlQXN5bmMoeyBkYXRhLCBwYXRoOiBbXSwgcGFyZW50OiBjdHggfSkudGhlbigocmVzdWx0KSA9PiBpc1ZhbGlkKHJlc3VsdClcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQudmFsdWUsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICBpc3N1ZXM6IGN0eC5jb21tb24uaXNzdWVzLFxuICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIGFzeW5jIHBhcnNlQXN5bmMoZGF0YSwgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuc2FmZVBhcnNlQXN5bmMoZGF0YSwgcGFyYW1zKTtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5kYXRhO1xuICAgICAgICB0aHJvdyByZXN1bHQuZXJyb3I7XG4gICAgfVxuICAgIGFzeW5jIHNhZmVQYXJzZUFzeW5jKGRhdGEsIHBhcmFtcykge1xuICAgICAgICBjb25zdCBjdHggPSB7XG4gICAgICAgICAgICBjb21tb246IHtcbiAgICAgICAgICAgICAgICBpc3N1ZXM6IFtdLFxuICAgICAgICAgICAgICAgIGNvbnRleHR1YWxFcnJvck1hcDogcGFyYW1zPy5lcnJvck1hcCxcbiAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXRoOiBwYXJhbXM/LnBhdGggfHwgW10sXG4gICAgICAgICAgICBzY2hlbWFFcnJvck1hcDogdGhpcy5fZGVmLmVycm9yTWFwLFxuICAgICAgICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIHBhcnNlZFR5cGU6IGdldFBhcnNlZFR5cGUoZGF0YSksXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG1heWJlQXN5bmNSZXN1bHQgPSB0aGlzLl9wYXJzZSh7IGRhdGEsIHBhdGg6IGN0eC5wYXRoLCBwYXJlbnQ6IGN0eCB9KTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgKGlzQXN5bmMobWF5YmVBc3luY1Jlc3VsdCkgPyBtYXliZUFzeW5jUmVzdWx0IDogUHJvbWlzZS5yZXNvbHZlKG1heWJlQXN5bmNSZXN1bHQpKTtcbiAgICAgICAgcmV0dXJuIGhhbmRsZVJlc3VsdChjdHgsIHJlc3VsdCk7XG4gICAgfVxuICAgIHJlZmluZShjaGVjaywgbWVzc2FnZSkge1xuICAgICAgICBjb25zdCBnZXRJc3N1ZVByb3BlcnRpZXMgPSAodmFsKSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIG1lc3NhZ2UgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBtZXNzYWdlIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2UodmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVmaW5lbWVudCgodmFsLCBjdHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGNoZWNrKHZhbCk7XG4gICAgICAgICAgICBjb25zdCBzZXRFcnJvciA9ICgpID0+IGN0eC5hZGRJc3N1ZSh7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmN1c3RvbSxcbiAgICAgICAgICAgICAgICAuLi5nZXRJc3N1ZVByb3BlcnRpZXModmFsKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBQcm9taXNlICE9PSBcInVuZGVmaW5lZFwiICYmIHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgc2V0RXJyb3IoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlZmluZW1lbnQoY2hlY2ssIHJlZmluZW1lbnREYXRhKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWZpbmVtZW50KCh2YWwsIGN0eCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFjaGVjayh2YWwpKSB7XG4gICAgICAgICAgICAgICAgY3R4LmFkZElzc3VlKHR5cGVvZiByZWZpbmVtZW50RGF0YSA9PT0gXCJmdW5jdGlvblwiID8gcmVmaW5lbWVudERhdGEodmFsLCBjdHgpIDogcmVmaW5lbWVudERhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX3JlZmluZW1lbnQocmVmaW5lbWVudCkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZEVmZmVjdHMoe1xuICAgICAgICAgICAgc2NoZW1hOiB0aGlzLFxuICAgICAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RFZmZlY3RzLFxuICAgICAgICAgICAgZWZmZWN0OiB7IHR5cGU6IFwicmVmaW5lbWVudFwiLCByZWZpbmVtZW50IH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdXBlclJlZmluZShyZWZpbmVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWZpbmVtZW50KHJlZmluZW1lbnQpO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihkZWYpIHtcbiAgICAgICAgLyoqIEFsaWFzIG9mIHNhZmVQYXJzZUFzeW5jICovXG4gICAgICAgIHRoaXMuc3BhID0gdGhpcy5zYWZlUGFyc2VBc3luYztcbiAgICAgICAgdGhpcy5fZGVmID0gZGVmO1xuICAgICAgICB0aGlzLnBhcnNlID0gdGhpcy5wYXJzZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnNhZmVQYXJzZSA9IHRoaXMuc2FmZVBhcnNlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucGFyc2VBc3luYyA9IHRoaXMucGFyc2VBc3luYy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnNhZmVQYXJzZUFzeW5jID0gdGhpcy5zYWZlUGFyc2VBc3luYy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnNwYSA9IHRoaXMuc3BhLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucmVmaW5lID0gdGhpcy5yZWZpbmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5yZWZpbmVtZW50ID0gdGhpcy5yZWZpbmVtZW50LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3VwZXJSZWZpbmUgPSB0aGlzLnN1cGVyUmVmaW5lLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub3B0aW9uYWwgPSB0aGlzLm9wdGlvbmFsLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMubnVsbGFibGUgPSB0aGlzLm51bGxhYmxlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMubnVsbGlzaCA9IHRoaXMubnVsbGlzaC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmFycmF5ID0gdGhpcy5hcnJheS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnByb21pc2UgPSB0aGlzLnByb21pc2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vciA9IHRoaXMub3IuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5hbmQgPSB0aGlzLmFuZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IHRoaXMudHJhbnNmb3JtLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYnJhbmQgPSB0aGlzLmJyYW5kLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGVmYXVsdCA9IHRoaXMuZGVmYXVsdC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmNhdGNoID0gdGhpcy5jYXRjaC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRlc2NyaWJlID0gdGhpcy5kZXNjcmliZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnBpcGUgPSB0aGlzLnBpcGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5yZWFkb25seSA9IHRoaXMucmVhZG9ubHkuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5pc051bGxhYmxlID0gdGhpcy5pc051bGxhYmxlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaXNPcHRpb25hbCA9IHRoaXMuaXNPcHRpb25hbC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzW1wifnN0YW5kYXJkXCJdID0ge1xuICAgICAgICAgICAgdmVyc2lvbjogMSxcbiAgICAgICAgICAgIHZlbmRvcjogXCJ6b2RcIixcbiAgICAgICAgICAgIHZhbGlkYXRlOiAoZGF0YSkgPT4gdGhpc1tcIn52YWxpZGF0ZVwiXShkYXRhKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgb3B0aW9uYWwoKSB7XG4gICAgICAgIHJldHVybiBab2RPcHRpb25hbC5jcmVhdGUodGhpcywgdGhpcy5fZGVmKTtcbiAgICB9XG4gICAgbnVsbGFibGUoKSB7XG4gICAgICAgIHJldHVybiBab2ROdWxsYWJsZS5jcmVhdGUodGhpcywgdGhpcy5fZGVmKTtcbiAgICB9XG4gICAgbnVsbGlzaCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubnVsbGFibGUoKS5vcHRpb25hbCgpO1xuICAgIH1cbiAgICBhcnJheSgpIHtcbiAgICAgICAgcmV0dXJuIFpvZEFycmF5LmNyZWF0ZSh0aGlzKTtcbiAgICB9XG4gICAgcHJvbWlzZSgpIHtcbiAgICAgICAgcmV0dXJuIFpvZFByb21pc2UuY3JlYXRlKHRoaXMsIHRoaXMuX2RlZik7XG4gICAgfVxuICAgIG9yKG9wdGlvbikge1xuICAgICAgICByZXR1cm4gWm9kVW5pb24uY3JlYXRlKFt0aGlzLCBvcHRpb25dLCB0aGlzLl9kZWYpO1xuICAgIH1cbiAgICBhbmQoaW5jb21pbmcpIHtcbiAgICAgICAgcmV0dXJuIFpvZEludGVyc2VjdGlvbi5jcmVhdGUodGhpcywgaW5jb21pbmcsIHRoaXMuX2RlZik7XG4gICAgfVxuICAgIHRyYW5zZm9ybSh0cmFuc2Zvcm0pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RFZmZlY3RzKHtcbiAgICAgICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXModGhpcy5fZGVmKSxcbiAgICAgICAgICAgIHNjaGVtYTogdGhpcyxcbiAgICAgICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kRWZmZWN0cyxcbiAgICAgICAgICAgIGVmZmVjdDogeyB0eXBlOiBcInRyYW5zZm9ybVwiLCB0cmFuc2Zvcm0gfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRlZmF1bHQoZGVmKSB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZUZ1bmMgPSB0eXBlb2YgZGVmID09PSBcImZ1bmN0aW9uXCIgPyBkZWYgOiAoKSA9PiBkZWY7XG4gICAgICAgIHJldHVybiBuZXcgWm9kRGVmYXVsdCh7XG4gICAgICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHRoaXMuX2RlZiksXG4gICAgICAgICAgICBpbm5lclR5cGU6IHRoaXMsXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU6IGRlZmF1bHRWYWx1ZUZ1bmMsXG4gICAgICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZERlZmF1bHQsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBicmFuZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RCcmFuZGVkKHtcbiAgICAgICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kQnJhbmRlZCxcbiAgICAgICAgICAgIHR5cGU6IHRoaXMsXG4gICAgICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHRoaXMuX2RlZiksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjYXRjaChkZWYpIHtcbiAgICAgICAgY29uc3QgY2F0Y2hWYWx1ZUZ1bmMgPSB0eXBlb2YgZGVmID09PSBcImZ1bmN0aW9uXCIgPyBkZWYgOiAoKSA9PiBkZWY7XG4gICAgICAgIHJldHVybiBuZXcgWm9kQ2F0Y2goe1xuICAgICAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyh0aGlzLl9kZWYpLFxuICAgICAgICAgICAgaW5uZXJUeXBlOiB0aGlzLFxuICAgICAgICAgICAgY2F0Y2hWYWx1ZTogY2F0Y2hWYWx1ZUZ1bmMsXG4gICAgICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZENhdGNoLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGVzY3JpYmUoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgY29uc3QgVGhpcyA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICAgIHJldHVybiBuZXcgVGhpcyh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHBpcGUodGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBab2RQaXBlbGluZS5jcmVhdGUodGhpcywgdGFyZ2V0KTtcbiAgICB9XG4gICAgcmVhZG9ubHkoKSB7XG4gICAgICAgIHJldHVybiBab2RSZWFkb25seS5jcmVhdGUodGhpcyk7XG4gICAgfVxuICAgIGlzT3B0aW9uYWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNhZmVQYXJzZSh1bmRlZmluZWQpLnN1Y2Nlc3M7XG4gICAgfVxuICAgIGlzTnVsbGFibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNhZmVQYXJzZShudWxsKS5zdWNjZXNzO1xuICAgIH1cbn1cbmNvbnN0IGN1aWRSZWdleCA9IC9eY1teXFxzLV17OCx9JC9pO1xuY29uc3QgY3VpZDJSZWdleCA9IC9eWzAtOWEtel0rJC87XG5jb25zdCB1bGlkUmVnZXggPSAvXlswLTlBLUhKS01OUC1UVi1aXXsyNn0kL2k7XG4vLyBjb25zdCB1dWlkUmVnZXggPVxuLy8gICAvXihbYS1mMC05XXs4fS1bYS1mMC05XXs0fS1bMS01XVthLWYwLTldezN9LVthLWYwLTldezR9LVthLWYwLTldezEyfXwwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDApJC9pO1xuY29uc3QgdXVpZFJlZ2V4ID0gL15bMC05YS1mQS1GXXs4fVxcYi1bMC05YS1mQS1GXXs0fVxcYi1bMC05YS1mQS1GXXs0fVxcYi1bMC05YS1mQS1GXXs0fVxcYi1bMC05YS1mQS1GXXsxMn0kL2k7XG5jb25zdCBuYW5vaWRSZWdleCA9IC9eW2EtejAtOV8tXXsyMX0kL2k7XG5jb25zdCBqd3RSZWdleCA9IC9eW0EtWmEtejAtOS1fXStcXC5bQS1aYS16MC05LV9dK1xcLltBLVphLXowLTktX10qJC87XG5jb25zdCBkdXJhdGlvblJlZ2V4ID0gL15bLStdP1AoPyEkKSg/Oig/OlstK10/XFxkK1kpfCg/OlstK10/XFxkK1suLF1cXGQrWSQpKT8oPzooPzpbLStdP1xcZCtNKXwoPzpbLStdP1xcZCtbLixdXFxkK00kKSk/KD86KD86Wy0rXT9cXGQrVyl8KD86Wy0rXT9cXGQrWy4sXVxcZCtXJCkpPyg/Oig/OlstK10/XFxkK0QpfCg/OlstK10/XFxkK1suLF1cXGQrRCQpKT8oPzpUKD89W1xcZCstXSkoPzooPzpbLStdP1xcZCtIKXwoPzpbLStdP1xcZCtbLixdXFxkK0gkKSk/KD86KD86Wy0rXT9cXGQrTSl8KD86Wy0rXT9cXGQrWy4sXVxcZCtNJCkpPyg/OlstK10/XFxkKyg/OlsuLF1cXGQrKT9TKT8pPz8kLztcbi8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ2MTgxLzE1NTAxNTVcbi8vIG9sZCB2ZXJzaW9uOiB0b28gc2xvdywgZGlkbid0IHN1cHBvcnQgdW5pY29kZVxuLy8gY29uc3QgZW1haWxSZWdleCA9IC9eKCgoW2Etel18XFxkfFshI1xcJCUmJ1xcKlxcK1xcLVxcLz1cXD9cXF5fYHtcXHx9fl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKyhcXC4oW2Etel18XFxkfFshI1xcJCUmJ1xcKlxcK1xcLVxcLz1cXD9cXF5fYHtcXHx9fl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKykqKXwoKFxceDIyKSgoKChcXHgyMHxcXHgwOSkqKFxceDBkXFx4MGEpKT8oXFx4MjB8XFx4MDkpKyk/KChbXFx4MDEtXFx4MDhcXHgwYlxceDBjXFx4MGUtXFx4MWZcXHg3Zl18XFx4MjF8W1xceDIzLVxceDViXXxbXFx4NWQtXFx4N2VdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoXFxcXChbXFx4MDEtXFx4MDlcXHgwYlxceDBjXFx4MGQtXFx4N2ZdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpKSooKChcXHgyMHxcXHgwOSkqKFxceDBkXFx4MGEpKT8oXFx4MjB8XFx4MDkpKyk/KFxceDIyKSkpQCgoKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KChbYS16XXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKihbYS16XXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSlcXC4pKygoW2Etel18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCgoW2Etel18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKihbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKSQvaTtcbi8vb2xkIGVtYWlsIHJlZ2V4XG4vLyBjb25zdCBlbWFpbFJlZ2V4ID0gL14oKFtePD4oKVtcXF0uLDs6XFxzQFwiXSsoXFwuW148PigpW1xcXS4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKCg/IS0pKFtePD4oKVtcXF0uLDs6XFxzQFwiXStcXC4pK1tePD4oKVtcXF0uLDs6XFxzQFwiXXsxLH0pW14tPD4oKVtcXF0uLDs6XFxzQFwiXSQvaTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuLy8gY29uc3QgZW1haWxSZWdleCA9XG4vLyAgIC9eKChbXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKFxcLltePD4oKVtcXF1cXFxcLiw7Olxcc0BcXFwiXSspKil8KFxcXCIuK1xcXCIpKUAoKFxcWygoKDI1WzAtNV0pfCgyWzAtNF1bMC05XSl8KDFbMC05XXsyfSl8KFswLTldezEsMn0pKVxcLil7M30oKDI1WzAtNV0pfCgyWzAtNF1bMC05XSl8KDFbMC05XXsyfSl8KFswLTldezEsMn0pKVxcXSl8KFxcW0lQdjY6KChbYS1mMC05XXsxLDR9Oil7N318OjooW2EtZjAtOV17MSw0fTopezAsNn18KFthLWYwLTldezEsNH06KXsxfTooW2EtZjAtOV17MSw0fTopezAsNX18KFthLWYwLTldezEsNH06KXsyfTooW2EtZjAtOV17MSw0fTopezAsNH18KFthLWYwLTldezEsNH06KXszfTooW2EtZjAtOV17MSw0fTopezAsM318KFthLWYwLTldezEsNH06KXs0fTooW2EtZjAtOV17MSw0fTopezAsMn18KFthLWYwLTldezEsNH06KXs1fTooW2EtZjAtOV17MSw0fTopezAsMX0pKFthLWYwLTldezEsNH18KCgoMjVbMC01XSl8KDJbMC00XVswLTldKXwoMVswLTldezJ9KXwoWzAtOV17MSwyfSkpXFwuKXszfSgoMjVbMC01XSl8KDJbMC00XVswLTldKXwoMVswLTldezJ9KXwoWzAtOV17MSwyfSkpKVxcXSl8KFtBLVphLXowLTldKFtBLVphLXowLTktXSpbQS1aYS16MC05XSkqKFxcLltBLVphLXpdezIsfSkrKSkkLztcbi8vIGNvbnN0IGVtYWlsUmVnZXggPVxuLy8gICAvXlthLXpBLVowLTlcXC5cXCFcXCNcXCRcXCVcXCZcXCdcXCpcXCtcXC9cXD1cXD9cXF5cXF9cXGBcXHtcXHxcXH1cXH5cXC1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuLy8gY29uc3QgZW1haWxSZWdleCA9XG4vLyAgIC9eKD86W2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSspKnxcIig/OltcXHgwMS1cXHgwOFxceDBiXFx4MGNcXHgwZS1cXHgxZlxceDIxXFx4MjMtXFx4NWJcXHg1ZC1cXHg3Zl18XFxcXFtcXHgwMS1cXHgwOVxceDBiXFx4MGNcXHgwZS1cXHg3Zl0pKlwiKUAoPzooPzpbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/XFwuKStbYS16MC05XSg/OlthLXowLTktXSpbYS16MC05XSk/fFxcWyg/Oig/OjI1WzAtNV18MlswLTRdWzAtOV18WzAxXT9bMC05XVswLTldPylcXC4pezN9KD86MjVbMC01XXwyWzAtNF1bMC05XXxbMDFdP1swLTldWzAtOV0/fFthLXowLTktXSpbYS16MC05XTooPzpbXFx4MDEtXFx4MDhcXHgwYlxceDBjXFx4MGUtXFx4MWZcXHgyMS1cXHg1YVxceDUzLVxceDdmXXxcXFxcW1xceDAxLVxceDA5XFx4MGJcXHgwY1xceDBlLVxceDdmXSkrKVxcXSkkL2k7XG5jb25zdCBlbWFpbFJlZ2V4ID0gL14oPyFcXC4pKD8hLipcXC5cXC4pKFtBLVowLTlfJytcXC1cXC5dKilbQS1aMC05XystXUAoW0EtWjAtOV1bQS1aMC05XFwtXSpcXC4pK1tBLVpdezIsfSQvaTtcbi8vIGNvbnN0IGVtYWlsUmVnZXggPVxuLy8gICAvXlthLXowLTkuISMkJSbigJkqKy89P15fYHt8fX4tXStAW2EtejAtOS1dKyg/OlxcLlthLXowLTlcXC1dKykqJC9pO1xuLy8gZnJvbSBodHRwczovL3RoZWtldmluc2NvdHQuY29tL2Vtb2ppcy1pbi1qYXZhc2NyaXB0LyN3cml0aW5nLWEtcmVndWxhci1leHByZXNzaW9uXG5jb25zdCBfZW1vamlSZWdleCA9IGBeKFxcXFxwe0V4dGVuZGVkX1BpY3RvZ3JhcGhpY318XFxcXHB7RW1vamlfQ29tcG9uZW50fSkrJGA7XG5sZXQgZW1vamlSZWdleDtcbi8vIGZhc3Rlciwgc2ltcGxlciwgc2FmZXJcbmNvbnN0IGlwdjRSZWdleCA9IC9eKD86KD86MjVbMC01XXwyWzAtNF1bMC05XXwxWzAtOV1bMC05XXxbMS05XVswLTldfFswLTldKVxcLil7M30oPzoyNVswLTVdfDJbMC00XVswLTldfDFbMC05XVswLTldfFsxLTldWzAtOV18WzAtOV0pJC87XG5jb25zdCBpcHY0Q2lkclJlZ2V4ID0gL14oPzooPzoyNVswLTVdfDJbMC00XVswLTldfDFbMC05XVswLTldfFsxLTldWzAtOV18WzAtOV0pXFwuKXszfSg/OjI1WzAtNV18MlswLTRdWzAtOV18MVswLTldWzAtOV18WzEtOV1bMC05XXxbMC05XSlcXC8oM1swLTJdfFsxMl0/WzAtOV0pJC87XG4vLyBjb25zdCBpcHY2UmVnZXggPVxuLy8gL14oKFthLWYwLTldezEsNH06KXs3fXw6OihbYS1mMC05XXsxLDR9Oil7MCw2fXwoW2EtZjAtOV17MSw0fTopezF9OihbYS1mMC05XXsxLDR9Oil7MCw1fXwoW2EtZjAtOV17MSw0fTopezJ9OihbYS1mMC05XXsxLDR9Oil7MCw0fXwoW2EtZjAtOV17MSw0fTopezN9OihbYS1mMC05XXsxLDR9Oil7MCwzfXwoW2EtZjAtOV17MSw0fTopezR9OihbYS1mMC05XXsxLDR9Oil7MCwyfXwoW2EtZjAtOV17MSw0fTopezV9OihbYS1mMC05XXsxLDR9Oil7MCwxfSkoW2EtZjAtOV17MSw0fXwoKCgyNVswLTVdKXwoMlswLTRdWzAtOV0pfCgxWzAtOV17Mn0pfChbMC05XXsxLDJ9KSlcXC4pezN9KCgyNVswLTVdKXwoMlswLTRdWzAtOV0pfCgxWzAtOV17Mn0pfChbMC05XXsxLDJ9KSkpJC87XG5jb25zdCBpcHY2UmVnZXggPSAvXigoWzAtOWEtZkEtRl17MSw0fTopezcsN31bMC05YS1mQS1GXXsxLDR9fChbMC05YS1mQS1GXXsxLDR9Oil7MSw3fTp8KFswLTlhLWZBLUZdezEsNH06KXsxLDZ9OlswLTlhLWZBLUZdezEsNH18KFswLTlhLWZBLUZdezEsNH06KXsxLDV9KDpbMC05YS1mQS1GXXsxLDR9KXsxLDJ9fChbMC05YS1mQS1GXXsxLDR9Oil7MSw0fSg6WzAtOWEtZkEtRl17MSw0fSl7MSwzfXwoWzAtOWEtZkEtRl17MSw0fTopezEsM30oOlswLTlhLWZBLUZdezEsNH0pezEsNH18KFswLTlhLWZBLUZdezEsNH06KXsxLDJ9KDpbMC05YS1mQS1GXXsxLDR9KXsxLDV9fFswLTlhLWZBLUZdezEsNH06KCg6WzAtOWEtZkEtRl17MSw0fSl7MSw2fSl8OigoOlswLTlhLWZBLUZdezEsNH0pezEsN318Oil8ZmU4MDooOlswLTlhLWZBLUZdezAsNH0pezAsNH0lWzAtOWEtekEtWl17MSx9fDo6KGZmZmYoOjB7MSw0fSl7MCwxfTopezAsMX0oKDI1WzAtNV18KDJbMC00XXwxezAsMX1bMC05XSl7MCwxfVswLTldKVxcLil7MywzfSgyNVswLTVdfCgyWzAtNF18MXswLDF9WzAtOV0pezAsMX1bMC05XSl8KFswLTlhLWZBLUZdezEsNH06KXsxLDR9OigoMjVbMC01XXwoMlswLTRdfDF7MCwxfVswLTldKXswLDF9WzAtOV0pXFwuKXszLDN9KDI1WzAtNV18KDJbMC00XXwxezAsMX1bMC05XSl7MCwxfVswLTldKSkkLztcbmNvbnN0IGlwdjZDaWRyUmVnZXggPSAvXigoWzAtOWEtZkEtRl17MSw0fTopezcsN31bMC05YS1mQS1GXXsxLDR9fChbMC05YS1mQS1GXXsxLDR9Oil7MSw3fTp8KFswLTlhLWZBLUZdezEsNH06KXsxLDZ9OlswLTlhLWZBLUZdezEsNH18KFswLTlhLWZBLUZdezEsNH06KXsxLDV9KDpbMC05YS1mQS1GXXsxLDR9KXsxLDJ9fChbMC05YS1mQS1GXXsxLDR9Oil7MSw0fSg6WzAtOWEtZkEtRl17MSw0fSl7MSwzfXwoWzAtOWEtZkEtRl17MSw0fTopezEsM30oOlswLTlhLWZBLUZdezEsNH0pezEsNH18KFswLTlhLWZBLUZdezEsNH06KXsxLDJ9KDpbMC05YS1mQS1GXXsxLDR9KXsxLDV9fFswLTlhLWZBLUZdezEsNH06KCg6WzAtOWEtZkEtRl17MSw0fSl7MSw2fSl8OigoOlswLTlhLWZBLUZdezEsNH0pezEsN318Oil8ZmU4MDooOlswLTlhLWZBLUZdezAsNH0pezAsNH0lWzAtOWEtekEtWl17MSx9fDo6KGZmZmYoOjB7MSw0fSl7MCwxfTopezAsMX0oKDI1WzAtNV18KDJbMC00XXwxezAsMX1bMC05XSl7MCwxfVswLTldKVxcLil7MywzfSgyNVswLTVdfCgyWzAtNF18MXswLDF9WzAtOV0pezAsMX1bMC05XSl8KFswLTlhLWZBLUZdezEsNH06KXsxLDR9OigoMjVbMC01XXwoMlswLTRdfDF7MCwxfVswLTldKXswLDF9WzAtOV0pXFwuKXszLDN9KDI1WzAtNV18KDJbMC00XXwxezAsMX1bMC05XSl7MCwxfVswLTldKSlcXC8oMTJbMC04XXwxWzAxXVswLTldfFsxLTldP1swLTldKSQvO1xuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzg2MDM5Mi9kZXRlcm1pbmUtaWYtc3RyaW5nLWlzLWluLWJhc2U2NC11c2luZy1qYXZhc2NyaXB0XG5jb25zdCBiYXNlNjRSZWdleCA9IC9eKFswLTlhLXpBLVorL117NH0pKigoWzAtOWEtekEtWisvXXsyfT09KXwoWzAtOWEtekEtWisvXXszfT0pKT8kLztcbi8vIGh0dHBzOi8vYmFzZTY0Lmd1cnUvc3RhbmRhcmRzL2Jhc2U2NHVybFxuY29uc3QgYmFzZTY0dXJsUmVnZXggPSAvXihbMC05YS16QS1aLV9dezR9KSooKFswLTlhLXpBLVotX117Mn0oPT0pPyl8KFswLTlhLXpBLVotX117M30oPSk/KSk/JC87XG4vLyBzaW1wbGVcbi8vIGNvbnN0IGRhdGVSZWdleFNvdXJjZSA9IGBcXFxcZHs0fS1cXFxcZHsyfS1cXFxcZHsyfWA7XG4vLyBubyBsZWFwIHllYXIgdmFsaWRhdGlvblxuLy8gY29uc3QgZGF0ZVJlZ2V4U291cmNlID0gYFxcXFxkezR9LSgoMFsxMzU3OF18MTB8MTIpLTMxfCgwWzEzLTldfDFbMC0yXSktMzB8KDBbMS05XXwxWzAtMl0pLSgwWzEtOV18MVxcXFxkfDJcXFxcZCkpYDtcbi8vIHdpdGggbGVhcCB5ZWFyIHZhbGlkYXRpb25cbmNvbnN0IGRhdGVSZWdleFNvdXJjZSA9IGAoKFxcXFxkXFxcXGRbMjQ2OF1bMDQ4XXxcXFxcZFxcXFxkWzEzNTc5XVsyNl18XFxcXGRcXFxcZDBbNDhdfFswMjQ2OF1bMDQ4XTAwfFsxMzU3OV1bMjZdMDApLTAyLTI5fFxcXFxkezR9LSgoMFsxMzU3OF18MVswMl0pLSgwWzEtOV18WzEyXVxcXFxkfDNbMDFdKXwoMFs0NjldfDExKS0oMFsxLTldfFsxMl1cXFxcZHwzMCl8KDAyKS0oMFsxLTldfDFcXFxcZHwyWzAtOF0pKSlgO1xuY29uc3QgZGF0ZVJlZ2V4ID0gbmV3IFJlZ0V4cChgXiR7ZGF0ZVJlZ2V4U291cmNlfSRgKTtcbmZ1bmN0aW9uIHRpbWVSZWdleFNvdXJjZShhcmdzKSB7XG4gICAgbGV0IHNlY29uZHNSZWdleFNvdXJjZSA9IGBbMC01XVxcXFxkYDtcbiAgICBpZiAoYXJncy5wcmVjaXNpb24pIHtcbiAgICAgICAgc2Vjb25kc1JlZ2V4U291cmNlID0gYCR7c2Vjb25kc1JlZ2V4U291cmNlfVxcXFwuXFxcXGR7JHthcmdzLnByZWNpc2lvbn19YDtcbiAgICB9XG4gICAgZWxzZSBpZiAoYXJncy5wcmVjaXNpb24gPT0gbnVsbCkge1xuICAgICAgICBzZWNvbmRzUmVnZXhTb3VyY2UgPSBgJHtzZWNvbmRzUmVnZXhTb3VyY2V9KFxcXFwuXFxcXGQrKT9gO1xuICAgIH1cbiAgICBjb25zdCBzZWNvbmRzUXVhbnRpZmllciA9IGFyZ3MucHJlY2lzaW9uID8gXCIrXCIgOiBcIj9cIjsgLy8gcmVxdWlyZSBzZWNvbmRzIGlmIHByZWNpc2lvbiBpcyBub256ZXJvXG4gICAgcmV0dXJuIGAoWzAxXVxcXFxkfDJbMC0zXSk6WzAtNV1cXFxcZCg6JHtzZWNvbmRzUmVnZXhTb3VyY2V9KSR7c2Vjb25kc1F1YW50aWZpZXJ9YDtcbn1cbmZ1bmN0aW9uIHRpbWVSZWdleChhcmdzKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYF4ke3RpbWVSZWdleFNvdXJjZShhcmdzKX0kYCk7XG59XG4vLyBBZGFwdGVkIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzMxNDMyMzFcbmV4cG9ydCBmdW5jdGlvbiBkYXRldGltZVJlZ2V4KGFyZ3MpIHtcbiAgICBsZXQgcmVnZXggPSBgJHtkYXRlUmVnZXhTb3VyY2V9VCR7dGltZVJlZ2V4U291cmNlKGFyZ3MpfWA7XG4gICAgY29uc3Qgb3B0cyA9IFtdO1xuICAgIG9wdHMucHVzaChhcmdzLmxvY2FsID8gYFo/YCA6IGBaYCk7XG4gICAgaWYgKGFyZ3Mub2Zmc2V0KVxuICAgICAgICBvcHRzLnB1c2goYChbKy1dXFxcXGR7Mn06P1xcXFxkezJ9KWApO1xuICAgIHJlZ2V4ID0gYCR7cmVnZXh9KCR7b3B0cy5qb2luKFwifFwiKX0pYDtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgXiR7cmVnZXh9JGApO1xufVxuZnVuY3Rpb24gaXNWYWxpZElQKGlwLCB2ZXJzaW9uKSB7XG4gICAgaWYgKCh2ZXJzaW9uID09PSBcInY0XCIgfHwgIXZlcnNpb24pICYmIGlwdjRSZWdleC50ZXN0KGlwKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCh2ZXJzaW9uID09PSBcInY2XCIgfHwgIXZlcnNpb24pICYmIGlwdjZSZWdleC50ZXN0KGlwKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gaXNWYWxpZEpXVChqd3QsIGFsZykge1xuICAgIGlmICghand0UmVnZXgudGVzdChqd3QpKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgW2hlYWRlcl0gPSBqd3Quc3BsaXQoXCIuXCIpO1xuICAgICAgICBpZiAoIWhlYWRlcilcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgLy8gQ29udmVydCBiYXNlNjR1cmwgdG8gYmFzZTY0XG4gICAgICAgIGNvbnN0IGJhc2U2NCA9IGhlYWRlclxuICAgICAgICAgICAgLnJlcGxhY2UoLy0vZywgXCIrXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvXy9nLCBcIi9cIilcbiAgICAgICAgICAgIC5wYWRFbmQoaGVhZGVyLmxlbmd0aCArICgoNCAtIChoZWFkZXIubGVuZ3RoICUgNCkpICUgNCksIFwiPVwiKTtcbiAgICAgICAgY29uc3QgZGVjb2RlZCA9IEpTT04ucGFyc2UoYXRvYihiYXNlNjQpKTtcbiAgICAgICAgaWYgKHR5cGVvZiBkZWNvZGVkICE9PSBcIm9iamVjdFwiIHx8IGRlY29kZWQgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChcInR5cFwiIGluIGRlY29kZWQgJiYgZGVjb2RlZD8udHlwICE9PSBcIkpXVFwiKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoIWRlY29kZWQuYWxnKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoYWxnICYmIGRlY29kZWQuYWxnICE9PSBhbGcpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5mdW5jdGlvbiBpc1ZhbGlkQ2lkcihpcCwgdmVyc2lvbikge1xuICAgIGlmICgodmVyc2lvbiA9PT0gXCJ2NFwiIHx8ICF2ZXJzaW9uKSAmJiBpcHY0Q2lkclJlZ2V4LnRlc3QoaXApKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoKHZlcnNpb24gPT09IFwidjZcIiB8fCAhdmVyc2lvbikgJiYgaXB2NkNpZHJSZWdleC50ZXN0KGlwKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0IGNsYXNzIFpvZFN0cmluZyBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBpZiAodGhpcy5fZGVmLmNvZXJjZSkge1xuICAgICAgICAgICAgaW5wdXQuZGF0YSA9IFN0cmluZyhpbnB1dC5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLnN0cmluZykge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5zdHJpbmcsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdGF0dXMgPSBuZXcgUGFyc2VTdGF0dXMoKTtcbiAgICAgICAgbGV0IGN0eCA9IHVuZGVmaW5lZDtcbiAgICAgICAgZm9yIChjb25zdCBjaGVjayBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2hlY2sua2luZCA9PT0gXCJtaW5cIikge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dC5kYXRhLmxlbmd0aCA8IGNoZWNrLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fc21hbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiBjaGVjay52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBleGFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJtYXhcIikge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dC5kYXRhLmxlbmd0aCA+IGNoZWNrLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fYmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogY2hlY2sudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwibGVuZ3RoXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0b29CaWcgPSBpbnB1dC5kYXRhLmxlbmd0aCA+IGNoZWNrLnZhbHVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvb1NtYWxsID0gaW5wdXQuZGF0YS5sZW5ndGggPCBjaGVjay52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodG9vQmlnIHx8IHRvb1NtYWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9vQmlnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX2JpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiBjaGVjay52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodG9vU21hbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fc21hbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogY2hlY2sudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiZW1haWxcIikge1xuICAgICAgICAgICAgICAgIGlmICghZW1haWxSZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwiZW1haWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImVtb2ppXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVtb2ppUmVnZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZW1vamlSZWdleCA9IG5ldyBSZWdFeHAoX2Vtb2ppUmVnZXgsIFwidVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFlbW9qaVJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJlbW9qaVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwidXVpZFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF1dWlkUmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcInV1aWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcIm5hbm9pZFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFuYW5vaWRSZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwibmFub2lkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJjdWlkXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWN1aWRSZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwiY3VpZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiY3VpZDJcIikge1xuICAgICAgICAgICAgICAgIGlmICghY3VpZDJSZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwiY3VpZDJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcInVsaWRcIikge1xuICAgICAgICAgICAgICAgIGlmICghdWxpZFJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJ1bGlkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJ1cmxcIikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBVUkwoaW5wdXQuZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJ1cmxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcInJlZ2V4XCIpIHtcbiAgICAgICAgICAgICAgICBjaGVjay5yZWdleC5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlc3RSZXN1bHQgPSBjaGVjay5yZWdleC50ZXN0KGlucHV0LmRhdGEpO1xuICAgICAgICAgICAgICAgIGlmICghdGVzdFJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcInJlZ2V4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJ0cmltXCIpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5kYXRhID0gaW5wdXQuZGF0YS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImluY2x1ZGVzXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmRhdGEuaW5jbHVkZXMoY2hlY2sudmFsdWUsIGNoZWNrLnBvc2l0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7IGluY2x1ZGVzOiBjaGVjay52YWx1ZSwgcG9zaXRpb246IGNoZWNrLnBvc2l0aW9uIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJ0b0xvd2VyQ2FzZVwiKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuZGF0YSA9IGlucHV0LmRhdGEudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwidG9VcHBlckNhc2VcIikge1xuICAgICAgICAgICAgICAgIGlucHV0LmRhdGEgPSBpbnB1dC5kYXRhLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcInN0YXJ0c1dpdGhcIikge1xuICAgICAgICAgICAgICAgIGlmICghaW5wdXQuZGF0YS5zdGFydHNXaXRoKGNoZWNrLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7IHN0YXJ0c1dpdGg6IGNoZWNrLnZhbHVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJlbmRzV2l0aFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC5kYXRhLmVuZHNXaXRoKGNoZWNrLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiB7IGVuZHNXaXRoOiBjaGVjay52YWx1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiZGF0ZXRpbWVcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gZGF0ZXRpbWVSZWdleChjaGVjayk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImRhdGVcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gZGF0ZVJlZ2V4O1xuICAgICAgICAgICAgICAgIGlmICghcmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcInRpbWVcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gdGltZVJlZ2V4KGNoZWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJ0aW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJkdXJhdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFkdXJhdGlvblJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJkdXJhdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiaXBcIikge1xuICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZElQKGlucHV0LmRhdGEsIGNoZWNrLnZlcnNpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwiaXBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImp3dFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkSldUKGlucHV0LmRhdGEsIGNoZWNrLmFsZykpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJqd3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImNpZHJcIikge1xuICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZENpZHIoaW5wdXQuZGF0YSwgY2hlY2sudmVyc2lvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJjaWRyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJiYXNlNjRcIikge1xuICAgICAgICAgICAgICAgIGlmICghYmFzZTY0UmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcImJhc2U2NFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiYmFzZTY0dXJsXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWJhc2U2NHVybFJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJiYXNlNjR1cmxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB1dGlsLmFzc2VydE5ldmVyKGNoZWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cy52YWx1ZSwgdmFsdWU6IGlucHV0LmRhdGEgfTtcbiAgICB9XG4gICAgX3JlZ2V4KHJlZ2V4LCB2YWxpZGF0aW9uLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZmluZW1lbnQoKGRhdGEpID0+IHJlZ2V4LnRlc3QoZGF0YSksIHtcbiAgICAgICAgICAgIHZhbGlkYXRpb24sXG4gICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfYWRkQ2hlY2soY2hlY2spIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RTdHJpbmcoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgY2hlY2tzOiBbLi4udGhpcy5fZGVmLmNoZWNrcywgY2hlY2tdLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZW1haWwobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcImVtYWlsXCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSB9KTtcbiAgICB9XG4gICAgdXJsKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJ1cmxcIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpIH0pO1xuICAgIH1cbiAgICBlbW9qaShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwiZW1vamlcIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpIH0pO1xuICAgIH1cbiAgICB1dWlkKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJ1dWlkXCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSB9KTtcbiAgICB9XG4gICAgbmFub2lkKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJuYW5vaWRcIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpIH0pO1xuICAgIH1cbiAgICBjdWlkKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJjdWlkXCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSB9KTtcbiAgICB9XG4gICAgY3VpZDIobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcImN1aWQyXCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSB9KTtcbiAgICB9XG4gICAgdWxpZChtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwidWxpZFwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSkgfSk7XG4gICAgfVxuICAgIGJhc2U2NChtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwiYmFzZTY0XCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSB9KTtcbiAgICB9XG4gICAgYmFzZTY0dXJsKG1lc3NhZ2UpIHtcbiAgICAgICAgLy8gYmFzZTY0dXJsIGVuY29kaW5nIGlzIGEgbW9kaWZpY2F0aW9uIG9mIGJhc2U2NCB0aGF0IGNhbiBzYWZlbHkgYmUgdXNlZCBpbiBVUkxzIGFuZCBmaWxlbmFtZXNcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwiYmFzZTY0dXJsXCIsXG4gICAgICAgICAgICAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBqd3Qob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcImp3dFwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoob3B0aW9ucykgfSk7XG4gICAgfVxuICAgIGlwKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJpcFwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoob3B0aW9ucykgfSk7XG4gICAgfVxuICAgIGNpZHIob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcImNpZHJcIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG9wdGlvbnMpIH0pO1xuICAgIH1cbiAgICBkYXRldGltZShvcHRpb25zKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgICAgICBraW5kOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgICAgcHJlY2lzaW9uOiBudWxsLFxuICAgICAgICAgICAgICAgIG9mZnNldDogZmFsc2UsXG4gICAgICAgICAgICAgICAgbG9jYWw6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG9wdGlvbnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJkYXRldGltZVwiLFxuICAgICAgICAgICAgcHJlY2lzaW9uOiB0eXBlb2Ygb3B0aW9ucz8ucHJlY2lzaW9uID09PSBcInVuZGVmaW5lZFwiID8gbnVsbCA6IG9wdGlvbnM/LnByZWNpc2lvbixcbiAgICAgICAgICAgIG9mZnNldDogb3B0aW9ucz8ub2Zmc2V0ID8/IGZhbHNlLFxuICAgICAgICAgICAgbG9jYWw6IG9wdGlvbnM/LmxvY2FsID8/IGZhbHNlLFxuICAgICAgICAgICAgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG9wdGlvbnM/Lm1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGF0ZShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwiZGF0ZVwiLCBtZXNzYWdlIH0pO1xuICAgIH1cbiAgICB0aW1lKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAgICAgIGtpbmQ6IFwidGltZVwiLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogbnVsbCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBvcHRpb25zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwidGltZVwiLFxuICAgICAgICAgICAgcHJlY2lzaW9uOiB0eXBlb2Ygb3B0aW9ucz8ucHJlY2lzaW9uID09PSBcInVuZGVmaW5lZFwiID8gbnVsbCA6IG9wdGlvbnM/LnByZWNpc2lvbixcbiAgICAgICAgICAgIC4uLmVycm9yVXRpbC5lcnJUb09iaihvcHRpb25zPy5tZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGR1cmF0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJkdXJhdGlvblwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSkgfSk7XG4gICAgfVxuICAgIHJlZ2V4KHJlZ2V4LCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcInJlZ2V4XCIsXG4gICAgICAgICAgICByZWdleDogcmVnZXgsXG4gICAgICAgICAgICAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpbmNsdWRlcyh2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJpbmNsdWRlc1wiLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgcG9zaXRpb246IG9wdGlvbnM/LnBvc2l0aW9uLFxuICAgICAgICAgICAgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG9wdGlvbnM/Lm1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3RhcnRzV2l0aCh2YWx1ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJzdGFydHNXaXRoXCIsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbmRzV2l0aCh2YWx1ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJlbmRzV2l0aFwiLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbWluKG1pbkxlbmd0aCwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtaW5cIixcbiAgICAgICAgICAgIHZhbHVlOiBtaW5MZW5ndGgsXG4gICAgICAgICAgICAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBtYXgobWF4TGVuZ3RoLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1heFwiLFxuICAgICAgICAgICAgdmFsdWU6IG1heExlbmd0aCxcbiAgICAgICAgICAgIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxlbmd0aChsZW4sIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibGVuZ3RoXCIsXG4gICAgICAgICAgICB2YWx1ZTogbGVuLFxuICAgICAgICAgICAgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRXF1aXZhbGVudCB0byBgLm1pbigxKWBcbiAgICAgKi9cbiAgICBub25lbXB0eShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbigxLCBlcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSkpO1xuICAgIH1cbiAgICB0cmltKCkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZFN0cmluZyh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBjaGVja3M6IFsuLi50aGlzLl9kZWYuY2hlY2tzLCB7IGtpbmQ6IFwidHJpbVwiIH1dLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgdG9Mb3dlckNhc2UoKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kU3RyaW5nKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGNoZWNrczogWy4uLnRoaXMuX2RlZi5jaGVja3MsIHsga2luZDogXCJ0b0xvd2VyQ2FzZVwiIH1dLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgdG9VcHBlckNhc2UoKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kU3RyaW5nKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGNoZWNrczogWy4uLnRoaXMuX2RlZi5jaGVja3MsIHsga2luZDogXCJ0b1VwcGVyQ2FzZVwiIH1dLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IGlzRGF0ZXRpbWUoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwiZGF0ZXRpbWVcIik7XG4gICAgfVxuICAgIGdldCBpc0RhdGUoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwiZGF0ZVwiKTtcbiAgICB9XG4gICAgZ2V0IGlzVGltZSgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJ0aW1lXCIpO1xuICAgIH1cbiAgICBnZXQgaXNEdXJhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJkdXJhdGlvblwiKTtcbiAgICB9XG4gICAgZ2V0IGlzRW1haWwoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwiZW1haWxcIik7XG4gICAgfVxuICAgIGdldCBpc1VSTCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJ1cmxcIik7XG4gICAgfVxuICAgIGdldCBpc0Vtb2ppKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcImVtb2ppXCIpO1xuICAgIH1cbiAgICBnZXQgaXNVVUlEKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcInV1aWRcIik7XG4gICAgfVxuICAgIGdldCBpc05BTk9JRCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJuYW5vaWRcIik7XG4gICAgfVxuICAgIGdldCBpc0NVSUQoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwiY3VpZFwiKTtcbiAgICB9XG4gICAgZ2V0IGlzQ1VJRDIoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwiY3VpZDJcIik7XG4gICAgfVxuICAgIGdldCBpc1VMSUQoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwidWxpZFwiKTtcbiAgICB9XG4gICAgZ2V0IGlzSVAoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwiaXBcIik7XG4gICAgfVxuICAgIGdldCBpc0NJRFIoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwiY2lkclwiKTtcbiAgICB9XG4gICAgZ2V0IGlzQmFzZTY0KCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcImJhc2U2NFwiKTtcbiAgICB9XG4gICAgZ2V0IGlzQmFzZTY0dXJsKCkge1xuICAgICAgICAvLyBiYXNlNjR1cmwgZW5jb2RpbmcgaXMgYSBtb2RpZmljYXRpb24gb2YgYmFzZTY0IHRoYXQgY2FuIHNhZmVseSBiZSB1c2VkIGluIFVSTHMgYW5kIGZpbGVuYW1lc1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcImJhc2U2NHVybFwiKTtcbiAgICB9XG4gICAgZ2V0IG1pbkxlbmd0aCgpIHtcbiAgICAgICAgbGV0IG1pbiA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgY2ggb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoLmtpbmQgPT09IFwibWluXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobWluID09PSBudWxsIHx8IGNoLnZhbHVlID4gbWluKVxuICAgICAgICAgICAgICAgICAgICBtaW4gPSBjaC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluO1xuICAgIH1cbiAgICBnZXQgbWF4TGVuZ3RoKCkge1xuICAgICAgICBsZXQgbWF4ID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBjaCBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2gua2luZCA9PT0gXCJtYXhcIikge1xuICAgICAgICAgICAgICAgIGlmIChtYXggPT09IG51bGwgfHwgY2gudmFsdWUgPCBtYXgpXG4gICAgICAgICAgICAgICAgICAgIG1heCA9IGNoLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXg7XG4gICAgfVxufVxuWm9kU3RyaW5nLmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZFN0cmluZyh7XG4gICAgICAgIGNoZWNrczogW10sXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kU3RyaW5nLFxuICAgICAgICBjb2VyY2U6IHBhcmFtcz8uY29lcmNlID8/IGZhbHNlLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzk2NjQ4NC93aHktZG9lcy1tb2R1bHVzLW9wZXJhdG9yLXJldHVybi1mcmFjdGlvbmFsLW51bWJlci1pbi1qYXZhc2NyaXB0LzMxNzExMDM0IzMxNzExMDM0XG5mdW5jdGlvbiBmbG9hdFNhZmVSZW1haW5kZXIodmFsLCBzdGVwKSB7XG4gICAgY29uc3QgdmFsRGVjQ291bnQgPSAodmFsLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpWzFdIHx8IFwiXCIpLmxlbmd0aDtcbiAgICBjb25zdCBzdGVwRGVjQ291bnQgPSAoc3RlcC50b1N0cmluZygpLnNwbGl0KFwiLlwiKVsxXSB8fCBcIlwiKS5sZW5ndGg7XG4gICAgY29uc3QgZGVjQ291bnQgPSB2YWxEZWNDb3VudCA+IHN0ZXBEZWNDb3VudCA/IHZhbERlY0NvdW50IDogc3RlcERlY0NvdW50O1xuICAgIGNvbnN0IHZhbEludCA9IE51bWJlci5wYXJzZUludCh2YWwudG9GaXhlZChkZWNDb3VudCkucmVwbGFjZShcIi5cIiwgXCJcIikpO1xuICAgIGNvbnN0IHN0ZXBJbnQgPSBOdW1iZXIucGFyc2VJbnQoc3RlcC50b0ZpeGVkKGRlY0NvdW50KS5yZXBsYWNlKFwiLlwiLCBcIlwiKSk7XG4gICAgcmV0dXJuICh2YWxJbnQgJSBzdGVwSW50KSAvIDEwICoqIGRlY0NvdW50O1xufVxuZXhwb3J0IGNsYXNzIFpvZE51bWJlciBleHRlbmRzIFpvZFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLm1pbiA9IHRoaXMuZ3RlO1xuICAgICAgICB0aGlzLm1heCA9IHRoaXMubHRlO1xuICAgICAgICB0aGlzLnN0ZXAgPSB0aGlzLm11bHRpcGxlT2Y7XG4gICAgfVxuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBpZiAodGhpcy5fZGVmLmNvZXJjZSkge1xuICAgICAgICAgICAgaW5wdXQuZGF0YSA9IE51bWJlcihpbnB1dC5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLm51bWJlcikge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5udW1iZXIsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3R4ID0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBzdGF0dXMgPSBuZXcgUGFyc2VTdGF0dXMoKTtcbiAgICAgICAgZm9yIChjb25zdCBjaGVjayBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2hlY2sua2luZCA9PT0gXCJpbnRcIikge1xuICAgICAgICAgICAgICAgIGlmICghdXRpbC5pc0ludGVnZXIoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBcImludGVnZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBcImZsb2F0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJtaW5cIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvb1NtYWxsID0gY2hlY2suaW5jbHVzaXZlID8gaW5wdXQuZGF0YSA8IGNoZWNrLnZhbHVlIDogaW5wdXQuZGF0YSA8PSBjaGVjay52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodG9vU21hbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19zbWFsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW06IGNoZWNrLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogY2hlY2suaW5jbHVzaXZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwibWF4XCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0b29CaWcgPSBjaGVjay5pbmNsdXNpdmUgPyBpbnB1dC5kYXRhID4gY2hlY2sudmFsdWUgOiBpbnB1dC5kYXRhID49IGNoZWNrLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0b29CaWcpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19iaWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiBjaGVjay52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IGNoZWNrLmluY2x1c2l2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcIm11bHRpcGxlT2ZcIikge1xuICAgICAgICAgICAgICAgIGlmIChmbG9hdFNhZmVSZW1haW5kZXIoaW5wdXQuZGF0YSwgY2hlY2sudmFsdWUpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5ub3RfbXVsdGlwbGVfb2YsXG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZU9mOiBjaGVjay52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImZpbml0ZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLm5vdF9maW5pdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbC5hc3NlcnROZXZlcihjaGVjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMudmFsdWUsIHZhbHVlOiBpbnB1dC5kYXRhIH07XG4gICAgfVxuICAgIGd0ZSh2YWx1ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRMaW1pdChcIm1pblwiLCB2YWx1ZSwgdHJ1ZSwgZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpKTtcbiAgICB9XG4gICAgZ3QodmFsdWUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TGltaXQoXCJtaW5cIiwgdmFsdWUsIGZhbHNlLCBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkpO1xuICAgIH1cbiAgICBsdGUodmFsdWUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TGltaXQoXCJtYXhcIiwgdmFsdWUsIHRydWUsIGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSk7XG4gICAgfVxuICAgIGx0KHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldExpbWl0KFwibWF4XCIsIHZhbHVlLCBmYWxzZSwgZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpKTtcbiAgICB9XG4gICAgc2V0TGltaXQoa2luZCwgdmFsdWUsIGluY2x1c2l2ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZE51bWJlcih7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBjaGVja3M6IFtcbiAgICAgICAgICAgICAgICAuLi50aGlzLl9kZWYuY2hlY2tzLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2luZCxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX2FkZENoZWNrKGNoZWNrKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kTnVtYmVyKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGNoZWNrczogWy4uLnRoaXMuX2RlZi5jaGVja3MsIGNoZWNrXSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGludChtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcImludFwiLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcG9zaXRpdmUobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtaW5cIixcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiBmYWxzZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5lZ2F0aXZlKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWF4XCIsXG4gICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgIGluY2x1c2l2ZTogZmFsc2UsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBub25wb3NpdGl2ZShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1heFwiLFxuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBub25uZWdhdGl2ZShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1pblwiLFxuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBtdWx0aXBsZU9mKHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm11bHRpcGxlT2ZcIixcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZpbml0ZShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcImZpbml0ZVwiLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2FmZShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1pblwiLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KS5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtYXhcIixcbiAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldCBtaW5WYWx1ZSgpIHtcbiAgICAgICAgbGV0IG1pbiA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgY2ggb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoLmtpbmQgPT09IFwibWluXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobWluID09PSBudWxsIHx8IGNoLnZhbHVlID4gbWluKVxuICAgICAgICAgICAgICAgICAgICBtaW4gPSBjaC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluO1xuICAgIH1cbiAgICBnZXQgbWF4VmFsdWUoKSB7XG4gICAgICAgIGxldCBtYXggPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGNoIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaC5raW5kID09PSBcIm1heFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1heCA9PT0gbnVsbCB8fCBjaC52YWx1ZSA8IG1heClcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gY2gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1heDtcbiAgICB9XG4gICAgZ2V0IGlzSW50KCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcImludFwiIHx8IChjaC5raW5kID09PSBcIm11bHRpcGxlT2ZcIiAmJiB1dGlsLmlzSW50ZWdlcihjaC52YWx1ZSkpKTtcbiAgICB9XG4gICAgZ2V0IGlzRmluaXRlKCkge1xuICAgICAgICBsZXQgbWF4ID0gbnVsbDtcbiAgICAgICAgbGV0IG1pbiA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgY2ggb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoLmtpbmQgPT09IFwiZmluaXRlXCIgfHwgY2gua2luZCA9PT0gXCJpbnRcIiB8fCBjaC5raW5kID09PSBcIm11bHRpcGxlT2ZcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2gua2luZCA9PT0gXCJtaW5cIikge1xuICAgICAgICAgICAgICAgIGlmIChtaW4gPT09IG51bGwgfHwgY2gudmFsdWUgPiBtaW4pXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGNoLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2gua2luZCA9PT0gXCJtYXhcIikge1xuICAgICAgICAgICAgICAgIGlmIChtYXggPT09IG51bGwgfHwgY2gudmFsdWUgPCBtYXgpXG4gICAgICAgICAgICAgICAgICAgIG1heCA9IGNoLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobWluKSAmJiBOdW1iZXIuaXNGaW5pdGUobWF4KTtcbiAgICB9XG59XG5ab2ROdW1iZXIuY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kTnVtYmVyKHtcbiAgICAgICAgY2hlY2tzOiBbXSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2ROdW1iZXIsXG4gICAgICAgIGNvZXJjZTogcGFyYW1zPy5jb2VyY2UgfHwgZmFsc2UsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kQmlnSW50IGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMubWluID0gdGhpcy5ndGU7XG4gICAgICAgIHRoaXMubWF4ID0gdGhpcy5sdGU7XG4gICAgfVxuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBpZiAodGhpcy5fZGVmLmNvZXJjZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpbnB1dC5kYXRhID0gQmlnSW50KGlucHV0LmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRJbnZhbGlkSW5wdXQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUuYmlnaW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SW52YWxpZElucHV0KGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3R4ID0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBzdGF0dXMgPSBuZXcgUGFyc2VTdGF0dXMoKTtcbiAgICAgICAgZm9yIChjb25zdCBjaGVjayBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2hlY2sua2luZCA9PT0gXCJtaW5cIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvb1NtYWxsID0gY2hlY2suaW5jbHVzaXZlID8gaW5wdXQuZGF0YSA8IGNoZWNrLnZhbHVlIDogaW5wdXQuZGF0YSA8PSBjaGVjay52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodG9vU21hbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19zbWFsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYmlnaW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiBjaGVjay52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogY2hlY2suaW5jbHVzaXZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwibWF4XCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0b29CaWcgPSBjaGVjay5pbmNsdXNpdmUgPyBpbnB1dC5kYXRhID4gY2hlY2sudmFsdWUgOiBpbnB1dC5kYXRhID49IGNoZWNrLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0b29CaWcpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19iaWcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJpZ2ludFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogY2hlY2sudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IGNoZWNrLmluY2x1c2l2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcIm11bHRpcGxlT2ZcIikge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dC5kYXRhICUgY2hlY2sudmFsdWUgIT09IEJpZ0ludCgwKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUubm90X211bHRpcGxlX29mLFxuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlwbGVPZjogY2hlY2sudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbC5hc3NlcnROZXZlcihjaGVjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMudmFsdWUsIHZhbHVlOiBpbnB1dC5kYXRhIH07XG4gICAgfVxuICAgIF9nZXRJbnZhbGlkSW5wdXQoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5iaWdpbnQsXG4gICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICB9XG4gICAgZ3RlKHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldExpbWl0KFwibWluXCIsIHZhbHVlLCB0cnVlLCBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkpO1xuICAgIH1cbiAgICBndCh2YWx1ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRMaW1pdChcIm1pblwiLCB2YWx1ZSwgZmFsc2UsIGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSk7XG4gICAgfVxuICAgIGx0ZSh2YWx1ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRMaW1pdChcIm1heFwiLCB2YWx1ZSwgdHJ1ZSwgZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpKTtcbiAgICB9XG4gICAgbHQodmFsdWUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TGltaXQoXCJtYXhcIiwgdmFsdWUsIGZhbHNlLCBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkpO1xuICAgIH1cbiAgICBzZXRMaW1pdChraW5kLCB2YWx1ZSwgaW5jbHVzaXZlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kQmlnSW50KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGNoZWNrczogW1xuICAgICAgICAgICAgICAgIC4uLnRoaXMuX2RlZi5jaGVja3MsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBraW5kLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfYWRkQ2hlY2soY2hlY2spIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RCaWdJbnQoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgY2hlY2tzOiBbLi4udGhpcy5fZGVmLmNoZWNrcywgY2hlY2tdLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcG9zaXRpdmUobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtaW5cIixcbiAgICAgICAgICAgIHZhbHVlOiBCaWdJbnQoMCksXG4gICAgICAgICAgICBpbmNsdXNpdmU6IGZhbHNlLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbmVnYXRpdmUobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtYXhcIixcbiAgICAgICAgICAgIHZhbHVlOiBCaWdJbnQoMCksXG4gICAgICAgICAgICBpbmNsdXNpdmU6IGZhbHNlLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbm9ucG9zaXRpdmUobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtYXhcIixcbiAgICAgICAgICAgIHZhbHVlOiBCaWdJbnQoMCksXG4gICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBub25uZWdhdGl2ZShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1pblwiLFxuICAgICAgICAgICAgdmFsdWU6IEJpZ0ludCgwKSxcbiAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG11bHRpcGxlT2YodmFsdWUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibXVsdGlwbGVPZlwiLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgbWluVmFsdWUoKSB7XG4gICAgICAgIGxldCBtaW4gPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGNoIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaC5raW5kID09PSBcIm1pblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1pbiA9PT0gbnVsbCB8fCBjaC52YWx1ZSA+IG1pbilcbiAgICAgICAgICAgICAgICAgICAgbWluID0gY2gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pbjtcbiAgICB9XG4gICAgZ2V0IG1heFZhbHVlKCkge1xuICAgICAgICBsZXQgbWF4ID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBjaCBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2gua2luZCA9PT0gXCJtYXhcIikge1xuICAgICAgICAgICAgICAgIGlmIChtYXggPT09IG51bGwgfHwgY2gudmFsdWUgPCBtYXgpXG4gICAgICAgICAgICAgICAgICAgIG1heCA9IGNoLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXg7XG4gICAgfVxufVxuWm9kQmlnSW50LmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZEJpZ0ludCh7XG4gICAgICAgIGNoZWNrczogW10sXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kQmlnSW50LFxuICAgICAgICBjb2VyY2U6IHBhcmFtcz8uY29lcmNlID8/IGZhbHNlLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZEJvb2xlYW4gZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RlZi5jb2VyY2UpIHtcbiAgICAgICAgICAgIGlucHV0LmRhdGEgPSBCb29sZWFuKGlucHV0LmRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUuYm9vbGVhbikge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5ib29sZWFuLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9LKGlucHV0LmRhdGEpO1xuICAgIH1cbn1cblpvZEJvb2xlYW4uY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kQm9vbGVhbih7XG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kQm9vbGVhbixcbiAgICAgICAgY29lcmNlOiBwYXJhbXM/LmNvZXJjZSB8fCBmYWxzZSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2REYXRlIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGlmICh0aGlzLl9kZWYuY29lcmNlKSB7XG4gICAgICAgICAgICBpbnB1dC5kYXRhID0gbmV3IERhdGUoaW5wdXQuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5kYXRlKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLmRhdGUsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKGlucHV0LmRhdGEuZ2V0VGltZSgpKSkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfZGF0ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RhdHVzID0gbmV3IFBhcnNlU3RhdHVzKCk7XG4gICAgICAgIGxldCBjdHggPSB1bmRlZmluZWQ7XG4gICAgICAgIGZvciAoY29uc3QgY2hlY2sgb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoZWNrLmtpbmQgPT09IFwibWluXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQuZGF0YS5nZXRUaW1lKCkgPCBjaGVjay52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX3NtYWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW06IGNoZWNrLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcIm1heFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LmRhdGEuZ2V0VGltZSgpID4gY2hlY2sudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19iaWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogY2hlY2sudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHV0aWwuYXNzZXJ0TmV2ZXIoY2hlY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6IHN0YXR1cy52YWx1ZSxcbiAgICAgICAgICAgIHZhbHVlOiBuZXcgRGF0ZShpbnB1dC5kYXRhLmdldFRpbWUoKSksXG4gICAgICAgIH07XG4gICAgfVxuICAgIF9hZGRDaGVjayhjaGVjaykge1xuICAgICAgICByZXR1cm4gbmV3IFpvZERhdGUoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgY2hlY2tzOiBbLi4udGhpcy5fZGVmLmNoZWNrcywgY2hlY2tdLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbWluKG1pbkRhdGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWluXCIsXG4gICAgICAgICAgICB2YWx1ZTogbWluRGF0ZS5nZXRUaW1lKCksXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBtYXgobWF4RGF0ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtYXhcIixcbiAgICAgICAgICAgIHZhbHVlOiBtYXhEYXRlLmdldFRpbWUoKSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldCBtaW5EYXRlKCkge1xuICAgICAgICBsZXQgbWluID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBjaCBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2gua2luZCA9PT0gXCJtaW5cIikge1xuICAgICAgICAgICAgICAgIGlmIChtaW4gPT09IG51bGwgfHwgY2gudmFsdWUgPiBtaW4pXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGNoLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW4gIT0gbnVsbCA/IG5ldyBEYXRlKG1pbikgOiBudWxsO1xuICAgIH1cbiAgICBnZXQgbWF4RGF0ZSgpIHtcbiAgICAgICAgbGV0IG1heCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgY2ggb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoLmtpbmQgPT09IFwibWF4XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF4ID09PSBudWxsIHx8IGNoLnZhbHVlIDwgbWF4KVxuICAgICAgICAgICAgICAgICAgICBtYXggPSBjaC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF4ICE9IG51bGwgPyBuZXcgRGF0ZShtYXgpIDogbnVsbDtcbiAgICB9XG59XG5ab2REYXRlLmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZERhdGUoe1xuICAgICAgICBjaGVja3M6IFtdLFxuICAgICAgICBjb2VyY2U6IHBhcmFtcz8uY29lcmNlIHx8IGZhbHNlLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZERhdGUsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kU3ltYm9sIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUuc3ltYm9sKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLnN5bWJvbCxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPSyhpbnB1dC5kYXRhKTtcbiAgICB9XG59XG5ab2RTeW1ib2wuY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kU3ltYm9sKHtcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RTeW1ib2wsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kVW5kZWZpbmVkIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUudW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLnVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPSyhpbnB1dC5kYXRhKTtcbiAgICB9XG59XG5ab2RVbmRlZmluZWQuY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kVW5kZWZpbmVkKHtcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RVbmRlZmluZWQsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kTnVsbCBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLm51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUubnVsbCxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPSyhpbnB1dC5kYXRhKTtcbiAgICB9XG59XG5ab2ROdWxsLmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZE51bGwoe1xuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE51bGwsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kQW55IGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8vIHRvIHByZXZlbnQgaW5zdGFuY2VzIG9mIG90aGVyIGNsYXNzZXMgZnJvbSBleHRlbmRpbmcgWm9kQW55LiB0aGlzIGNhdXNlcyBpc3N1ZXMgd2l0aCBjYXRjaGFsbCBpbiBab2RPYmplY3QuXG4gICAgICAgIHRoaXMuX2FueSA9IHRydWU7XG4gICAgfVxuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gT0soaW5wdXQuZGF0YSk7XG4gICAgfVxufVxuWm9kQW55LmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZEFueSh7XG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kQW55LFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZFVua25vd24gZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgLy8gcmVxdWlyZWRcbiAgICAgICAgdGhpcy5fdW5rbm93biA9IHRydWU7XG4gICAgfVxuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gT0soaW5wdXQuZGF0YSk7XG4gICAgfVxufVxuWm9kVW5rbm93bi5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RVbmtub3duKHtcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RVbmtub3duLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZE5ldmVyIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUubmV2ZXIsXG4gICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICB9XG59XG5ab2ROZXZlci5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2ROZXZlcih7XG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kTmV2ZXIsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kVm9pZCBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLnVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS52b2lkLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9LKGlucHV0LmRhdGEpO1xuICAgIH1cbn1cblpvZFZvaWQuY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kVm9pZCh7XG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kVm9pZCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RBcnJheSBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IGN0eCwgc3RhdHVzIH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBjb25zdCBkZWYgPSB0aGlzLl9kZWY7XG4gICAgICAgIGlmIChjdHgucGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5hcnJheSkge1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5hcnJheSxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZWYuZXhhY3RMZW5ndGggIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHRvb0JpZyA9IGN0eC5kYXRhLmxlbmd0aCA+IGRlZi5leGFjdExlbmd0aC52YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IHRvb1NtYWxsID0gY3R4LmRhdGEubGVuZ3RoIDwgZGVmLmV4YWN0TGVuZ3RoLnZhbHVlO1xuICAgICAgICAgICAgaWYgKHRvb0JpZyB8fCB0b29TbWFsbCkge1xuICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiB0b29CaWcgPyBab2RJc3N1ZUNvZGUudG9vX2JpZyA6IFpvZElzc3VlQ29kZS50b29fc21hbGwsXG4gICAgICAgICAgICAgICAgICAgIG1pbmltdW06ICh0b29TbWFsbCA/IGRlZi5leGFjdExlbmd0aC52YWx1ZSA6IHVuZGVmaW5lZCksXG4gICAgICAgICAgICAgICAgICAgIG1heGltdW06ICh0b29CaWcgPyBkZWYuZXhhY3RMZW5ndGgudmFsdWUgOiB1bmRlZmluZWQpLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGRlZi5leGFjdExlbmd0aC5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkZWYubWluTGVuZ3RoICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY3R4LmRhdGEubGVuZ3RoIDwgZGVmLm1pbkxlbmd0aC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX3NtYWxsLFxuICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiBkZWYubWluTGVuZ3RoLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBkZWYubWluTGVuZ3RoLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlZi5tYXhMZW5ndGggIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjdHguZGF0YS5sZW5ndGggPiBkZWYubWF4TGVuZ3RoLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fYmlnLFxuICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiBkZWYubWF4TGVuZ3RoLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBkZWYubWF4TGVuZ3RoLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbLi4uY3R4LmRhdGFdLm1hcCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWYudHlwZS5fcGFyc2VBc3luYyhuZXcgUGFyc2VJbnB1dExhenlQYXRoKGN0eCwgaXRlbSwgY3R4LnBhdGgsIGkpKTtcbiAgICAgICAgICAgIH0pKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUGFyc2VTdGF0dXMubWVyZ2VBcnJheShzdGF0dXMsIHJlc3VsdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBbLi4uY3R4LmRhdGFdLm1hcCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGRlZi50eXBlLl9wYXJzZVN5bmMobmV3IFBhcnNlSW5wdXRMYXp5UGF0aChjdHgsIGl0ZW0sIGN0eC5wYXRoLCBpKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gUGFyc2VTdGF0dXMubWVyZ2VBcnJheShzdGF0dXMsIHJlc3VsdCk7XG4gICAgfVxuICAgIGdldCBlbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnR5cGU7XG4gICAgfVxuICAgIG1pbihtaW5MZW5ndGgsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RBcnJheSh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBtaW5MZW5ndGg6IHsgdmFsdWU6IG1pbkxlbmd0aCwgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBtYXgobWF4TGVuZ3RoLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kQXJyYXkoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgbWF4TGVuZ3RoOiB7IHZhbHVlOiBtYXhMZW5ndGgsIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbGVuZ3RoKGxlbiwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZEFycmF5KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGV4YWN0TGVuZ3RoOiB7IHZhbHVlOiBsZW4sIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbm9uZW1wdHkobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5taW4oMSwgbWVzc2FnZSk7XG4gICAgfVxufVxuWm9kQXJyYXkuY3JlYXRlID0gKHNjaGVtYSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RBcnJheSh7XG4gICAgICAgIHR5cGU6IHNjaGVtYSxcbiAgICAgICAgbWluTGVuZ3RoOiBudWxsLFxuICAgICAgICBtYXhMZW5ndGg6IG51bGwsXG4gICAgICAgIGV4YWN0TGVuZ3RoOiBudWxsLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEFycmF5LFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZnVuY3Rpb24gZGVlcFBhcnRpYWxpZnkoc2NoZW1hKSB7XG4gICAgaWYgKHNjaGVtYSBpbnN0YW5jZW9mIFpvZE9iamVjdCkge1xuICAgICAgICBjb25zdCBuZXdTaGFwZSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBzY2hlbWEuc2hhcGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkU2NoZW1hID0gc2NoZW1hLnNoYXBlW2tleV07XG4gICAgICAgICAgICBuZXdTaGFwZVtrZXldID0gWm9kT3B0aW9uYWwuY3JlYXRlKGRlZXBQYXJ0aWFsaWZ5KGZpZWxkU2NoZW1hKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICAgICAgLi4uc2NoZW1hLl9kZWYsXG4gICAgICAgICAgICBzaGFwZTogKCkgPT4gbmV3U2hhcGUsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY2hlbWEgaW5zdGFuY2VvZiBab2RBcnJheSkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZEFycmF5KHtcbiAgICAgICAgICAgIC4uLnNjaGVtYS5fZGVmLFxuICAgICAgICAgICAgdHlwZTogZGVlcFBhcnRpYWxpZnkoc2NoZW1hLmVsZW1lbnQpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2NoZW1hIGluc3RhbmNlb2YgWm9kT3B0aW9uYWwpIHtcbiAgICAgICAgcmV0dXJuIFpvZE9wdGlvbmFsLmNyZWF0ZShkZWVwUGFydGlhbGlmeShzY2hlbWEudW53cmFwKCkpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2NoZW1hIGluc3RhbmNlb2YgWm9kTnVsbGFibGUpIHtcbiAgICAgICAgcmV0dXJuIFpvZE51bGxhYmxlLmNyZWF0ZShkZWVwUGFydGlhbGlmeShzY2hlbWEudW53cmFwKCkpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2NoZW1hIGluc3RhbmNlb2YgWm9kVHVwbGUpIHtcbiAgICAgICAgcmV0dXJuIFpvZFR1cGxlLmNyZWF0ZShzY2hlbWEuaXRlbXMubWFwKChpdGVtKSA9PiBkZWVwUGFydGlhbGlmeShpdGVtKSkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNjaGVtYTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgWm9kT2JqZWN0IGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuX2NhY2hlZCA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBJbiBtb3N0IGNhc2VzLCB0aGlzIGlzIG5vIGxvbmdlciBuZWVkZWQgLSB1bmtub3duIHByb3BlcnRpZXMgYXJlIG5vdyBzaWxlbnRseSBzdHJpcHBlZC5cbiAgICAgICAgICogSWYgeW91IHdhbnQgdG8gcGFzcyB0aHJvdWdoIHVua25vd24gcHJvcGVydGllcywgdXNlIGAucGFzc3Rocm91Z2goKWAgaW5zdGVhZC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubm9uc3RyaWN0ID0gdGhpcy5wYXNzdGhyb3VnaDtcbiAgICAgICAgLy8gZXh0ZW5kPFxuICAgICAgICAvLyAgIEF1Z21lbnRhdGlvbiBleHRlbmRzIFpvZFJhd1NoYXBlLFxuICAgICAgICAvLyAgIE5ld091dHB1dCBleHRlbmRzIHV0aWwuZmxhdHRlbjx7XG4gICAgICAgIC8vICAgICBbayBpbiBrZXlvZiBBdWdtZW50YXRpb24gfCBrZXlvZiBPdXRwdXRdOiBrIGV4dGVuZHMga2V5b2YgQXVnbWVudGF0aW9uXG4gICAgICAgIC8vICAgICAgID8gQXVnbWVudGF0aW9uW2tdW1wiX291dHB1dFwiXVxuICAgICAgICAvLyAgICAgICA6IGsgZXh0ZW5kcyBrZXlvZiBPdXRwdXRcbiAgICAgICAgLy8gICAgICAgPyBPdXRwdXRba11cbiAgICAgICAgLy8gICAgICAgOiBuZXZlcjtcbiAgICAgICAgLy8gICB9PixcbiAgICAgICAgLy8gICBOZXdJbnB1dCBleHRlbmRzIHV0aWwuZmxhdHRlbjx7XG4gICAgICAgIC8vICAgICBbayBpbiBrZXlvZiBBdWdtZW50YXRpb24gfCBrZXlvZiBJbnB1dF06IGsgZXh0ZW5kcyBrZXlvZiBBdWdtZW50YXRpb25cbiAgICAgICAgLy8gICAgICAgPyBBdWdtZW50YXRpb25ba11bXCJfaW5wdXRcIl1cbiAgICAgICAgLy8gICAgICAgOiBrIGV4dGVuZHMga2V5b2YgSW5wdXRcbiAgICAgICAgLy8gICAgICAgPyBJbnB1dFtrXVxuICAgICAgICAvLyAgICAgICA6IG5ldmVyO1xuICAgICAgICAvLyAgIH0+XG4gICAgICAgIC8vID4oXG4gICAgICAgIC8vICAgYXVnbWVudGF0aW9uOiBBdWdtZW50YXRpb25cbiAgICAgICAgLy8gKTogWm9kT2JqZWN0PFxuICAgICAgICAvLyAgIGV4dGVuZFNoYXBlPFQsIEF1Z21lbnRhdGlvbj4sXG4gICAgICAgIC8vICAgVW5rbm93bktleXMsXG4gICAgICAgIC8vICAgQ2F0Y2hhbGwsXG4gICAgICAgIC8vICAgTmV3T3V0cHV0LFxuICAgICAgICAvLyAgIE5ld0lucHV0XG4gICAgICAgIC8vID4ge1xuICAgICAgICAvLyAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgLy8gICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgLy8gICAgIHNoYXBlOiAoKSA9PiAoe1xuICAgICAgICAvLyAgICAgICAuLi50aGlzLl9kZWYuc2hhcGUoKSxcbiAgICAgICAgLy8gICAgICAgLi4uYXVnbWVudGF0aW9uLFxuICAgICAgICAvLyAgICAgfSksXG4gICAgICAgIC8vICAgfSkgYXMgYW55O1xuICAgICAgICAvLyB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBVc2UgYC5leHRlbmRgIGluc3RlYWRcbiAgICAgICAgICogICovXG4gICAgICAgIHRoaXMuYXVnbWVudCA9IHRoaXMuZXh0ZW5kO1xuICAgIH1cbiAgICBfZ2V0Q2FjaGVkKCkge1xuICAgICAgICBpZiAodGhpcy5fY2FjaGVkICE9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlZDtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl9kZWYuc2hhcGUoKTtcbiAgICAgICAgY29uc3Qga2V5cyA9IHV0aWwub2JqZWN0S2V5cyhzaGFwZSk7XG4gICAgICAgIHRoaXMuX2NhY2hlZCA9IHsgc2hhcGUsIGtleXMgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlZDtcbiAgICB9XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUub2JqZWN0KSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLm9iamVjdCxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHsgc3RhdHVzLCBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGNvbnN0IHsgc2hhcGUsIGtleXM6IHNoYXBlS2V5cyB9ID0gdGhpcy5fZ2V0Q2FjaGVkKCk7XG4gICAgICAgIGNvbnN0IGV4dHJhS2V5cyA9IFtdO1xuICAgICAgICBpZiAoISh0aGlzLl9kZWYuY2F0Y2hhbGwgaW5zdGFuY2VvZiBab2ROZXZlciAmJiB0aGlzLl9kZWYudW5rbm93bktleXMgPT09IFwic3RyaXBcIikpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGN0eC5kYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzaGFwZUtleXMuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBleHRyYUtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYWlycyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBzaGFwZUtleXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleVZhbGlkYXRvciA9IHNoYXBlW2tleV07XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGN0eC5kYXRhW2tleV07XG4gICAgICAgICAgICBwYWlycy5wdXNoKHtcbiAgICAgICAgICAgICAgICBrZXk6IHsgc3RhdHVzOiBcInZhbGlkXCIsIHZhbHVlOiBrZXkgfSxcbiAgICAgICAgICAgICAgICB2YWx1ZToga2V5VmFsaWRhdG9yLl9wYXJzZShuZXcgUGFyc2VJbnB1dExhenlQYXRoKGN0eCwgdmFsdWUsIGN0eC5wYXRoLCBrZXkpKSxcbiAgICAgICAgICAgICAgICBhbHdheXNTZXQ6IGtleSBpbiBjdHguZGF0YSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9kZWYuY2F0Y2hhbGwgaW5zdGFuY2VvZiBab2ROZXZlcikge1xuICAgICAgICAgICAgY29uc3QgdW5rbm93bktleXMgPSB0aGlzLl9kZWYudW5rbm93bktleXM7XG4gICAgICAgICAgICBpZiAodW5rbm93bktleXMgPT09IFwicGFzc3Rocm91Z2hcIikge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGV4dHJhS2V5cykge1xuICAgICAgICAgICAgICAgICAgICBwYWlycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogeyBzdGF0dXM6IFwidmFsaWRcIiwgdmFsdWU6IGtleSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHsgc3RhdHVzOiBcInZhbGlkXCIsIHZhbHVlOiBjdHguZGF0YVtrZXldIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHVua25vd25LZXlzID09PSBcInN0cmljdFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4dHJhS2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnVucmVjb2duaXplZF9rZXlzLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5czogZXh0cmFLZXlzLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodW5rbm93bktleXMgPT09IFwic3RyaXBcIikge1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnRlcm5hbCBab2RPYmplY3QgZXJyb3I6IGludmFsaWQgdW5rbm93bktleXMgdmFsdWUuYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBydW4gY2F0Y2hhbGwgdmFsaWRhdGlvblxuICAgICAgICAgICAgY29uc3QgY2F0Y2hhbGwgPSB0aGlzLl9kZWYuY2F0Y2hhbGw7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBleHRyYUtleXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGN0eC5kYXRhW2tleV07XG4gICAgICAgICAgICAgICAgcGFpcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGtleTogeyBzdGF0dXM6IFwidmFsaWRcIiwgdmFsdWU6IGtleSB9LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogY2F0Y2hhbGwuX3BhcnNlKG5ldyBQYXJzZUlucHV0TGF6eVBhdGgoY3R4LCB2YWx1ZSwgY3R4LnBhdGgsIGtleSkgLy8sIGN0eC5jaGlsZChrZXkpLCB2YWx1ZSwgZ2V0UGFyc2VkVHlwZSh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgYWx3YXlzU2V0OiBrZXkgaW4gY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICAgICAgICAgIC50aGVuKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzeW5jUGFpcnMgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHBhaXIgb2YgcGFpcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYXdhaXQgcGFpci5rZXk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gYXdhaXQgcGFpci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgc3luY1BhaXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbHdheXNTZXQ6IHBhaXIuYWx3YXlzU2V0LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN5bmNQYWlycztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHN5bmNQYWlycykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBQYXJzZVN0YXR1cy5tZXJnZU9iamVjdFN5bmMoc3RhdHVzLCBzeW5jUGFpcnMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gUGFyc2VTdGF0dXMubWVyZ2VPYmplY3RTeW5jKHN0YXR1cywgcGFpcnMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBzaGFwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5zaGFwZSgpO1xuICAgIH1cbiAgICBzdHJpY3QobWVzc2FnZSkge1xuICAgICAgICBlcnJvclV0aWwuZXJyVG9PYmo7XG4gICAgICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIHVua25vd25LZXlzOiBcInN0cmljdFwiLFxuICAgICAgICAgICAgLi4uKG1lc3NhZ2UgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICBlcnJvck1hcDogKGlzc3VlLCBjdHgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRFcnJvciA9IHRoaXMuX2RlZi5lcnJvck1hcD8uKGlzc3VlLCBjdHgpLm1lc3NhZ2UgPz8gY3R4LmRlZmF1bHRFcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc3N1ZS5jb2RlID09PSBcInVucmVjb2duaXplZF9rZXlzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpLm1lc3NhZ2UgPz8gZGVmYXVsdEVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGRlZmF1bHRFcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDoge30pLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3RyaXAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIHVua25vd25LZXlzOiBcInN0cmlwXCIsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwYXNzdGhyb3VnaCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgdW5rbm93bktleXM6IFwicGFzc3Rocm91Z2hcIixcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIGNvbnN0IEF1Z21lbnRGYWN0b3J5ID1cbiAgICAvLyAgIDxEZWYgZXh0ZW5kcyBab2RPYmplY3REZWY+KGRlZjogRGVmKSA9PlxuICAgIC8vICAgPEF1Z21lbnRhdGlvbiBleHRlbmRzIFpvZFJhd1NoYXBlPihcbiAgICAvLyAgICAgYXVnbWVudGF0aW9uOiBBdWdtZW50YXRpb25cbiAgICAvLyAgICk6IFpvZE9iamVjdDxcbiAgICAvLyAgICAgZXh0ZW5kU2hhcGU8UmV0dXJuVHlwZTxEZWZbXCJzaGFwZVwiXT4sIEF1Z21lbnRhdGlvbj4sXG4gICAgLy8gICAgIERlZltcInVua25vd25LZXlzXCJdLFxuICAgIC8vICAgICBEZWZbXCJjYXRjaGFsbFwiXVxuICAgIC8vICAgPiA9PiB7XG4gICAgLy8gICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAvLyAgICAgICAuLi5kZWYsXG4gICAgLy8gICAgICAgc2hhcGU6ICgpID0+ICh7XG4gICAgLy8gICAgICAgICAuLi5kZWYuc2hhcGUoKSxcbiAgICAvLyAgICAgICAgIC4uLmF1Z21lbnRhdGlvbixcbiAgICAvLyAgICAgICB9KSxcbiAgICAvLyAgICAgfSkgYXMgYW55O1xuICAgIC8vICAgfTtcbiAgICBleHRlbmQoYXVnbWVudGF0aW9uKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIHNoYXBlOiAoKSA9PiAoe1xuICAgICAgICAgICAgICAgIC4uLnRoaXMuX2RlZi5zaGFwZSgpLFxuICAgICAgICAgICAgICAgIC4uLmF1Z21lbnRhdGlvbixcbiAgICAgICAgICAgIH0pLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUHJpb3IgdG8gem9kQDEuMC4xMiB0aGVyZSB3YXMgYSBidWcgaW4gdGhlXG4gICAgICogaW5mZXJyZWQgdHlwZSBvZiBtZXJnZWQgb2JqZWN0cy4gUGxlYXNlXG4gICAgICogdXBncmFkZSBpZiB5b3UgYXJlIGV4cGVyaWVuY2luZyBpc3N1ZXMuXG4gICAgICovXG4gICAgbWVyZ2UobWVyZ2luZykge1xuICAgICAgICBjb25zdCBtZXJnZWQgPSBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgICAgIHVua25vd25LZXlzOiBtZXJnaW5nLl9kZWYudW5rbm93bktleXMsXG4gICAgICAgICAgICBjYXRjaGFsbDogbWVyZ2luZy5fZGVmLmNhdGNoYWxsLFxuICAgICAgICAgICAgc2hhcGU6ICgpID0+ICh7XG4gICAgICAgICAgICAgICAgLi4udGhpcy5fZGVmLnNoYXBlKCksXG4gICAgICAgICAgICAgICAgLi4ubWVyZ2luZy5fZGVmLnNoYXBlKCksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kT2JqZWN0LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1lcmdlZDtcbiAgICB9XG4gICAgLy8gbWVyZ2U8XG4gICAgLy8gICBJbmNvbWluZyBleHRlbmRzIEFueVpvZE9iamVjdCxcbiAgICAvLyAgIEF1Z21lbnRhdGlvbiBleHRlbmRzIEluY29taW5nW1wic2hhcGVcIl0sXG4gICAgLy8gICBOZXdPdXRwdXQgZXh0ZW5kcyB7XG4gICAgLy8gICAgIFtrIGluIGtleW9mIEF1Z21lbnRhdGlvbiB8IGtleW9mIE91dHB1dF06IGsgZXh0ZW5kcyBrZXlvZiBBdWdtZW50YXRpb25cbiAgICAvLyAgICAgICA/IEF1Z21lbnRhdGlvbltrXVtcIl9vdXRwdXRcIl1cbiAgICAvLyAgICAgICA6IGsgZXh0ZW5kcyBrZXlvZiBPdXRwdXRcbiAgICAvLyAgICAgICA/IE91dHB1dFtrXVxuICAgIC8vICAgICAgIDogbmV2ZXI7XG4gICAgLy8gICB9LFxuICAgIC8vICAgTmV3SW5wdXQgZXh0ZW5kcyB7XG4gICAgLy8gICAgIFtrIGluIGtleW9mIEF1Z21lbnRhdGlvbiB8IGtleW9mIElucHV0XTogayBleHRlbmRzIGtleW9mIEF1Z21lbnRhdGlvblxuICAgIC8vICAgICAgID8gQXVnbWVudGF0aW9uW2tdW1wiX2lucHV0XCJdXG4gICAgLy8gICAgICAgOiBrIGV4dGVuZHMga2V5b2YgSW5wdXRcbiAgICAvLyAgICAgICA/IElucHV0W2tdXG4gICAgLy8gICAgICAgOiBuZXZlcjtcbiAgICAvLyAgIH1cbiAgICAvLyA+KFxuICAgIC8vICAgbWVyZ2luZzogSW5jb21pbmdcbiAgICAvLyApOiBab2RPYmplY3Q8XG4gICAgLy8gICBleHRlbmRTaGFwZTxULCBSZXR1cm5UeXBlPEluY29taW5nW1wiX2RlZlwiXVtcInNoYXBlXCJdPj4sXG4gICAgLy8gICBJbmNvbWluZ1tcIl9kZWZcIl1bXCJ1bmtub3duS2V5c1wiXSxcbiAgICAvLyAgIEluY29taW5nW1wiX2RlZlwiXVtcImNhdGNoYWxsXCJdLFxuICAgIC8vICAgTmV3T3V0cHV0LFxuICAgIC8vICAgTmV3SW5wdXRcbiAgICAvLyA+IHtcbiAgICAvLyAgIGNvbnN0IG1lcmdlZDogYW55ID0gbmV3IFpvZE9iamVjdCh7XG4gICAgLy8gICAgIHVua25vd25LZXlzOiBtZXJnaW5nLl9kZWYudW5rbm93bktleXMsXG4gICAgLy8gICAgIGNhdGNoYWxsOiBtZXJnaW5nLl9kZWYuY2F0Y2hhbGwsXG4gICAgLy8gICAgIHNoYXBlOiAoKSA9PlxuICAgIC8vICAgICAgIG9iamVjdFV0aWwubWVyZ2VTaGFwZXModGhpcy5fZGVmLnNoYXBlKCksIG1lcmdpbmcuX2RlZi5zaGFwZSgpKSxcbiAgICAvLyAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RPYmplY3QsXG4gICAgLy8gICB9KSBhcyBhbnk7XG4gICAgLy8gICByZXR1cm4gbWVyZ2VkO1xuICAgIC8vIH1cbiAgICBzZXRLZXkoa2V5LCBzY2hlbWEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXVnbWVudCh7IFtrZXldOiBzY2hlbWEgfSk7XG4gICAgfVxuICAgIC8vIG1lcmdlPEluY29taW5nIGV4dGVuZHMgQW55Wm9kT2JqZWN0PihcbiAgICAvLyAgIG1lcmdpbmc6IEluY29taW5nXG4gICAgLy8gKTogLy9ab2RPYmplY3Q8VCAmIEluY29taW5nW1wiX3NoYXBlXCJdLCBVbmtub3duS2V5cywgQ2F0Y2hhbGw+ID0gKG1lcmdpbmcpID0+IHtcbiAgICAvLyBab2RPYmplY3Q8XG4gICAgLy8gICBleHRlbmRTaGFwZTxULCBSZXR1cm5UeXBlPEluY29taW5nW1wiX2RlZlwiXVtcInNoYXBlXCJdPj4sXG4gICAgLy8gICBJbmNvbWluZ1tcIl9kZWZcIl1bXCJ1bmtub3duS2V5c1wiXSxcbiAgICAvLyAgIEluY29taW5nW1wiX2RlZlwiXVtcImNhdGNoYWxsXCJdXG4gICAgLy8gPiB7XG4gICAgLy8gICAvLyBjb25zdCBtZXJnZWRTaGFwZSA9IG9iamVjdFV0aWwubWVyZ2VTaGFwZXMoXG4gICAgLy8gICAvLyAgIHRoaXMuX2RlZi5zaGFwZSgpLFxuICAgIC8vICAgLy8gICBtZXJnaW5nLl9kZWYuc2hhcGUoKVxuICAgIC8vICAgLy8gKTtcbiAgICAvLyAgIGNvbnN0IG1lcmdlZDogYW55ID0gbmV3IFpvZE9iamVjdCh7XG4gICAgLy8gICAgIHVua25vd25LZXlzOiBtZXJnaW5nLl9kZWYudW5rbm93bktleXMsXG4gICAgLy8gICAgIGNhdGNoYWxsOiBtZXJnaW5nLl9kZWYuY2F0Y2hhbGwsXG4gICAgLy8gICAgIHNoYXBlOiAoKSA9PlxuICAgIC8vICAgICAgIG9iamVjdFV0aWwubWVyZ2VTaGFwZXModGhpcy5fZGVmLnNoYXBlKCksIG1lcmdpbmcuX2RlZi5zaGFwZSgpKSxcbiAgICAvLyAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RPYmplY3QsXG4gICAgLy8gICB9KSBhcyBhbnk7XG4gICAgLy8gICByZXR1cm4gbWVyZ2VkO1xuICAgIC8vIH1cbiAgICBjYXRjaGFsbChpbmRleCkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBjYXRjaGFsbDogaW5kZXgsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwaWNrKG1hc2spIHtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdXRpbC5vYmplY3RLZXlzKG1hc2spKSB7XG4gICAgICAgICAgICBpZiAobWFza1trZXldICYmIHRoaXMuc2hhcGVba2V5XSkge1xuICAgICAgICAgICAgICAgIHNoYXBlW2tleV0gPSB0aGlzLnNoYXBlW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgc2hhcGU6ICgpID0+IHNoYXBlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb21pdChtYXNrKSB7XG4gICAgICAgIGNvbnN0IHNoYXBlID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIHV0aWwub2JqZWN0S2V5cyh0aGlzLnNoYXBlKSkge1xuICAgICAgICAgICAgaWYgKCFtYXNrW2tleV0pIHtcbiAgICAgICAgICAgICAgICBzaGFwZVtrZXldID0gdGhpcy5zaGFwZVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIHNoYXBlOiAoKSA9PiBzaGFwZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgZGVlcFBhcnRpYWwoKSB7XG4gICAgICAgIHJldHVybiBkZWVwUGFydGlhbGlmeSh0aGlzKTtcbiAgICB9XG4gICAgcGFydGlhbChtYXNrKSB7XG4gICAgICAgIGNvbnN0IG5ld1NoYXBlID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIHV0aWwub2JqZWN0S2V5cyh0aGlzLnNoYXBlKSkge1xuICAgICAgICAgICAgY29uc3QgZmllbGRTY2hlbWEgPSB0aGlzLnNoYXBlW2tleV07XG4gICAgICAgICAgICBpZiAobWFzayAmJiAhbWFza1trZXldKSB7XG4gICAgICAgICAgICAgICAgbmV3U2hhcGVba2V5XSA9IGZpZWxkU2NoZW1hO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3U2hhcGVba2V5XSA9IGZpZWxkU2NoZW1hLm9wdGlvbmFsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgc2hhcGU6ICgpID0+IG5ld1NoYXBlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVxdWlyZWQobWFzaykge1xuICAgICAgICBjb25zdCBuZXdTaGFwZSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB1dGlsLm9iamVjdEtleXModGhpcy5zaGFwZSkpIHtcbiAgICAgICAgICAgIGlmIChtYXNrICYmICFtYXNrW2tleV0pIHtcbiAgICAgICAgICAgICAgICBuZXdTaGFwZVtrZXldID0gdGhpcy5zaGFwZVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmllbGRTY2hlbWEgPSB0aGlzLnNoYXBlW2tleV07XG4gICAgICAgICAgICAgICAgbGV0IG5ld0ZpZWxkID0gZmllbGRTY2hlbWE7XG4gICAgICAgICAgICAgICAgd2hpbGUgKG5ld0ZpZWxkIGluc3RhbmNlb2YgWm9kT3B0aW9uYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3RmllbGQgPSBuZXdGaWVsZC5fZGVmLmlubmVyVHlwZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmV3U2hhcGVba2V5XSA9IG5ld0ZpZWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIHNoYXBlOiAoKSA9PiBuZXdTaGFwZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGtleW9mKCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlWm9kRW51bSh1dGlsLm9iamVjdEtleXModGhpcy5zaGFwZSkpO1xuICAgIH1cbn1cblpvZE9iamVjdC5jcmVhdGUgPSAoc2hhcGUsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgc2hhcGU6ICgpID0+IHNoYXBlLFxuICAgICAgICB1bmtub3duS2V5czogXCJzdHJpcFwiLFxuICAgICAgICBjYXRjaGFsbDogWm9kTmV2ZXIuY3JlYXRlKCksXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kT2JqZWN0LFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuWm9kT2JqZWN0LnN0cmljdENyZWF0ZSA9IChzaGFwZSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICBzaGFwZTogKCkgPT4gc2hhcGUsXG4gICAgICAgIHVua25vd25LZXlzOiBcInN0cmljdFwiLFxuICAgICAgICBjYXRjaGFsbDogWm9kTmV2ZXIuY3JlYXRlKCksXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kT2JqZWN0LFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuWm9kT2JqZWN0LmxhenljcmVhdGUgPSAoc2hhcGUsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgc2hhcGUsXG4gICAgICAgIHVua25vd25LZXlzOiBcInN0cmlwXCIsXG4gICAgICAgIGNhdGNoYWxsOiBab2ROZXZlci5jcmVhdGUoKSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RPYmplY3QsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kVW5pb24gZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9kZWYub3B0aW9ucztcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlUmVzdWx0cyhyZXN1bHRzKSB7XG4gICAgICAgICAgICAvLyByZXR1cm4gZmlyc3QgaXNzdWUtZnJlZSB2YWxpZGF0aW9uIGlmIGl0IGV4aXN0c1xuICAgICAgICAgICAgZm9yIChjb25zdCByZXN1bHQgb2YgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVzdWx0LnN0YXR1cyA9PT0gXCJ2YWxpZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQucmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVzdWx0IG9mIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJlc3VsdC5zdGF0dXMgPT09IFwiZGlydHlcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgaXNzdWVzIGZyb20gZGlydHkgb3B0aW9uXG4gICAgICAgICAgICAgICAgICAgIGN0eC5jb21tb24uaXNzdWVzLnB1c2goLi4ucmVzdWx0LmN0eC5jb21tb24uaXNzdWVzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmV0dXJuIGludmFsaWRcbiAgICAgICAgICAgIGNvbnN0IHVuaW9uRXJyb3JzID0gcmVzdWx0cy5tYXAoKHJlc3VsdCkgPT4gbmV3IFpvZEVycm9yKHJlc3VsdC5jdHguY29tbW9uLmlzc3VlcykpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdW5pb24sXG4gICAgICAgICAgICAgICAgdW5pb25FcnJvcnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwob3B0aW9ucy5tYXAoYXN5bmMgKG9wdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkQ3R4ID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5jdHgsXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY3R4LmNvbW1vbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzc3VlczogW10sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDogYXdhaXQgb3B0aW9uLl9wYXJzZUFzeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGNoaWxkQ3R4LFxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgY3R4OiBjaGlsZEN0eCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkpLnRoZW4oaGFuZGxlUmVzdWx0cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgZGlydHkgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zdCBpc3N1ZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZEN0eCA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uY3R4LFxuICAgICAgICAgICAgICAgICAgICBjb21tb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmN0eC5jb21tb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBpc3N1ZXM6IFtdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBvcHRpb24uX3BhcnNlU3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjaGlsZEN0eCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gXCJ2YWxpZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlc3VsdC5zdGF0dXMgPT09IFwiZGlydHlcIiAmJiAhZGlydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlydHkgPSB7IHJlc3VsdCwgY3R4OiBjaGlsZEN0eCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRDdHguY29tbW9uLmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNzdWVzLnB1c2goY2hpbGRDdHguY29tbW9uLmlzc3Vlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRpcnR5KSB7XG4gICAgICAgICAgICAgICAgY3R4LmNvbW1vbi5pc3N1ZXMucHVzaCguLi5kaXJ0eS5jdHguY29tbW9uLmlzc3Vlcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpcnR5LnJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHVuaW9uRXJyb3JzID0gaXNzdWVzLm1hcCgoaXNzdWVzKSA9PiBuZXcgWm9kRXJyb3IoaXNzdWVzKSk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF91bmlvbixcbiAgICAgICAgICAgICAgICB1bmlvbkVycm9ycyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYub3B0aW9ucztcbiAgICB9XG59XG5ab2RVbmlvbi5jcmVhdGUgPSAodHlwZXMsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kVW5pb24oe1xuICAgICAgICBvcHRpb25zOiB0eXBlcyxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RVbmlvbixcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy8vLy8vLy9cbi8vLy8vLy8vLy8gICAgICBab2REaXNjcmltaW5hdGVkVW5pb24gICAgICAvLy8vLy8vLy8vXG4vLy8vLy8vLy8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5jb25zdCBnZXREaXNjcmltaW5hdG9yID0gKHR5cGUpID0+IHtcbiAgICBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZExhenkpIHtcbiAgICAgICAgcmV0dXJuIGdldERpc2NyaW1pbmF0b3IodHlwZS5zY2hlbWEpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kRWZmZWN0cykge1xuICAgICAgICByZXR1cm4gZ2V0RGlzY3JpbWluYXRvcih0eXBlLmlubmVyVHlwZSgpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZExpdGVyYWwpIHtcbiAgICAgICAgcmV0dXJuIFt0eXBlLnZhbHVlXTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZEVudW0pIHtcbiAgICAgICAgcmV0dXJuIHR5cGUub3B0aW9ucztcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZE5hdGl2ZUVudW0pIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGJhbi9iYW5cbiAgICAgICAgcmV0dXJuIHV0aWwub2JqZWN0VmFsdWVzKHR5cGUuZW51bSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2REZWZhdWx0KSB7XG4gICAgICAgIHJldHVybiBnZXREaXNjcmltaW5hdG9yKHR5cGUuX2RlZi5pbm5lclR5cGUpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kVW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBbdW5kZWZpbmVkXTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZE51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtudWxsXTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZE9wdGlvbmFsKSB7XG4gICAgICAgIHJldHVybiBbdW5kZWZpbmVkLCAuLi5nZXREaXNjcmltaW5hdG9yKHR5cGUudW53cmFwKCkpXTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZE51bGxhYmxlKSB7XG4gICAgICAgIHJldHVybiBbbnVsbCwgLi4uZ2V0RGlzY3JpbWluYXRvcih0eXBlLnVud3JhcCgpKV07XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2RCcmFuZGVkKSB7XG4gICAgICAgIHJldHVybiBnZXREaXNjcmltaW5hdG9yKHR5cGUudW53cmFwKCkpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kUmVhZG9ubHkpIHtcbiAgICAgICAgcmV0dXJuIGdldERpc2NyaW1pbmF0b3IodHlwZS51bndyYXAoKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2RDYXRjaCkge1xuICAgICAgICByZXR1cm4gZ2V0RGlzY3JpbWluYXRvcih0eXBlLl9kZWYuaW5uZXJUeXBlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG59O1xuZXhwb3J0IGNsYXNzIFpvZERpc2NyaW1pbmF0ZWRVbmlvbiBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgaWYgKGN0eC5wYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLm9iamVjdCkge1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5vYmplY3QsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaXNjcmltaW5hdG9yID0gdGhpcy5kaXNjcmltaW5hdG9yO1xuICAgICAgICBjb25zdCBkaXNjcmltaW5hdG9yVmFsdWUgPSBjdHguZGF0YVtkaXNjcmltaW5hdG9yXTtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gdGhpcy5vcHRpb25zTWFwLmdldChkaXNjcmltaW5hdG9yVmFsdWUpO1xuICAgICAgICBpZiAoIW9wdGlvbikge1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdW5pb25fZGlzY3JpbWluYXRvcixcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBBcnJheS5mcm9tKHRoaXMub3B0aW9uc01hcC5rZXlzKCkpLFxuICAgICAgICAgICAgICAgIHBhdGg6IFtkaXNjcmltaW5hdG9yXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb24uX3BhcnNlQXN5bmMoe1xuICAgICAgICAgICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uLl9wYXJzZVN5bmMoe1xuICAgICAgICAgICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IGRpc2NyaW1pbmF0b3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuZGlzY3JpbWluYXRvcjtcbiAgICB9XG4gICAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYub3B0aW9ucztcbiAgICB9XG4gICAgZ2V0IG9wdGlvbnNNYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYub3B0aW9uc01hcDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBkaXNjcmltaW5hdGVkIHVuaW9uIHNjaGVtYS4gSXRzIGJlaGF2aW91ciBpcyB2ZXJ5IHNpbWlsYXIgdG8gdGhhdCBvZiB0aGUgbm9ybWFsIHoudW5pb24oKSBjb25zdHJ1Y3Rvci5cbiAgICAgKiBIb3dldmVyLCBpdCBvbmx5IGFsbG93cyBhIHVuaW9uIG9mIG9iamVjdHMsIGFsbCBvZiB3aGljaCBuZWVkIHRvIHNoYXJlIGEgZGlzY3JpbWluYXRvciBwcm9wZXJ0eS4gVGhpcyBwcm9wZXJ0eSBtdXN0XG4gICAgICogaGF2ZSBhIGRpZmZlcmVudCB2YWx1ZSBmb3IgZWFjaCBvYmplY3QgaW4gdGhlIHVuaW9uLlxuICAgICAqIEBwYXJhbSBkaXNjcmltaW5hdG9yIHRoZSBuYW1lIG9mIHRoZSBkaXNjcmltaW5hdG9yIHByb3BlcnR5XG4gICAgICogQHBhcmFtIHR5cGVzIGFuIGFycmF5IG9mIG9iamVjdCBzY2hlbWFzXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGUoZGlzY3JpbWluYXRvciwgb3B0aW9ucywgcGFyYW1zKSB7XG4gICAgICAgIC8vIEdldCBhbGwgdGhlIHZhbGlkIGRpc2NyaW1pbmF0b3IgdmFsdWVzXG4gICAgICAgIGNvbnN0IG9wdGlvbnNNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIC8vIHRyeSB7XG4gICAgICAgIGZvciAoY29uc3QgdHlwZSBvZiBvcHRpb25zKSB7XG4gICAgICAgICAgICBjb25zdCBkaXNjcmltaW5hdG9yVmFsdWVzID0gZ2V0RGlzY3JpbWluYXRvcih0eXBlLnNoYXBlW2Rpc2NyaW1pbmF0b3JdKTtcbiAgICAgICAgICAgIGlmICghZGlzY3JpbWluYXRvclZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEEgZGlzY3JpbWluYXRvciB2YWx1ZSBmb3Iga2V5IFxcYCR7ZGlzY3JpbWluYXRvcn1cXGAgY291bGQgbm90IGJlIGV4dHJhY3RlZCBmcm9tIGFsbCBzY2hlbWEgb3B0aW9uc2ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiBkaXNjcmltaW5hdG9yVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNNYXAuaGFzKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERpc2NyaW1pbmF0b3IgcHJvcGVydHkgJHtTdHJpbmcoZGlzY3JpbWluYXRvcil9IGhhcyBkdXBsaWNhdGUgdmFsdWUgJHtTdHJpbmcodmFsdWUpfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcHRpb25zTWFwLnNldCh2YWx1ZSwgdHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBab2REaXNjcmltaW5hdGVkVW5pb24oe1xuICAgICAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2REaXNjcmltaW5hdGVkVW5pb24sXG4gICAgICAgICAgICBkaXNjcmltaW5hdG9yLFxuICAgICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgICAgIG9wdGlvbnNNYXAsXG4gICAgICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1lcmdlVmFsdWVzKGEsIGIpIHtcbiAgICBjb25zdCBhVHlwZSA9IGdldFBhcnNlZFR5cGUoYSk7XG4gICAgY29uc3QgYlR5cGUgPSBnZXRQYXJzZWRUeXBlKGIpO1xuICAgIGlmIChhID09PSBiKSB7XG4gICAgICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBkYXRhOiBhIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKGFUeXBlID09PSBab2RQYXJzZWRUeXBlLm9iamVjdCAmJiBiVHlwZSA9PT0gWm9kUGFyc2VkVHlwZS5vYmplY3QpIHtcbiAgICAgICAgY29uc3QgYktleXMgPSB1dGlsLm9iamVjdEtleXMoYik7XG4gICAgICAgIGNvbnN0IHNoYXJlZEtleXMgPSB1dGlsLm9iamVjdEtleXMoYSkuZmlsdGVyKChrZXkpID0+IGJLZXlzLmluZGV4T2Yoa2V5KSAhPT0gLTEpO1xuICAgICAgICBjb25zdCBuZXdPYmogPSB7IC4uLmEsIC4uLmIgfTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2Ygc2hhcmVkS2V5cykge1xuICAgICAgICAgICAgY29uc3Qgc2hhcmVkVmFsdWUgPSBtZXJnZVZhbHVlcyhhW2tleV0sIGJba2V5XSk7XG4gICAgICAgICAgICBpZiAoIXNoYXJlZFZhbHVlLnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdPYmpba2V5XSA9IHNoYXJlZFZhbHVlLmRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IHRydWUsIGRhdGE6IG5ld09iaiB9O1xuICAgIH1cbiAgICBlbHNlIGlmIChhVHlwZSA9PT0gWm9kUGFyc2VkVHlwZS5hcnJheSAmJiBiVHlwZSA9PT0gWm9kUGFyc2VkVHlwZS5hcnJheSkge1xuICAgICAgICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdBcnJheSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1BID0gYVtpbmRleF07XG4gICAgICAgICAgICBjb25zdCBpdGVtQiA9IGJbaW5kZXhdO1xuICAgICAgICAgICAgY29uc3Qgc2hhcmVkVmFsdWUgPSBtZXJnZVZhbHVlcyhpdGVtQSwgaXRlbUIpO1xuICAgICAgICAgICAgaWYgKCFzaGFyZWRWYWx1ZS52YWxpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3QXJyYXkucHVzaChzaGFyZWRWYWx1ZS5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgZGF0YTogbmV3QXJyYXkgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoYVR5cGUgPT09IFpvZFBhcnNlZFR5cGUuZGF0ZSAmJiBiVHlwZSA9PT0gWm9kUGFyc2VkVHlwZS5kYXRlICYmICthID09PSArYikge1xuICAgICAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgZGF0YTogYSB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlIH07XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFpvZEludGVyc2VjdGlvbiBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IHN0YXR1cywgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBjb25zdCBoYW5kbGVQYXJzZWQgPSAocGFyc2VkTGVmdCwgcGFyc2VkUmlnaHQpID0+IHtcbiAgICAgICAgICAgIGlmIChpc0Fib3J0ZWQocGFyc2VkTGVmdCkgfHwgaXNBYm9ydGVkKHBhcnNlZFJpZ2h0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2VWYWx1ZXMocGFyc2VkTGVmdC52YWx1ZSwgcGFyc2VkUmlnaHQudmFsdWUpO1xuICAgICAgICAgICAgaWYgKCFtZXJnZWQudmFsaWQpIHtcbiAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfaW50ZXJzZWN0aW9uX3R5cGVzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzRGlydHkocGFyc2VkTGVmdCkgfHwgaXNEaXJ0eShwYXJzZWRSaWdodCkpIHtcbiAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLnZhbHVlLCB2YWx1ZTogbWVyZ2VkLmRhdGEgfTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmLmxlZnQuX3BhcnNlQXN5bmMoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIHRoaXMuX2RlZi5yaWdodC5fcGFyc2VBc3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdKS50aGVuKChbbGVmdCwgcmlnaHRdKSA9PiBoYW5kbGVQYXJzZWQobGVmdCwgcmlnaHQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVQYXJzZWQodGhpcy5fZGVmLmxlZnQuX3BhcnNlU3luYyh7XG4gICAgICAgICAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICB9KSwgdGhpcy5fZGVmLnJpZ2h0Ll9wYXJzZVN5bmMoe1xuICAgICAgICAgICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuWm9kSW50ZXJzZWN0aW9uLmNyZWF0ZSA9IChsZWZ0LCByaWdodCwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RJbnRlcnNlY3Rpb24oe1xuICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICByaWdodDogcmlnaHQsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kSW50ZXJzZWN0aW9uLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuLy8gdHlwZSBab2RUdXBsZUl0ZW1zID0gW1pvZFR5cGVBbnksIC4uLlpvZFR5cGVBbnlbXV07XG5leHBvcnQgY2xhc3MgWm9kVHVwbGUgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBzdGF0dXMsIGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgaWYgKGN0eC5wYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLmFycmF5KSB7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLmFycmF5LFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN0eC5kYXRhLmxlbmd0aCA8IHRoaXMuX2RlZi5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fc21hbGwsXG4gICAgICAgICAgICAgICAgbWluaW11bTogdGhpcy5fZGVmLml0ZW1zLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiYXJyYXlcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzdCA9IHRoaXMuX2RlZi5yZXN0O1xuICAgICAgICBpZiAoIXJlc3QgJiYgY3R4LmRhdGEubGVuZ3RoID4gdGhpcy5fZGVmLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19iaWcsXG4gICAgICAgICAgICAgICAgbWF4aW11bTogdGhpcy5fZGVmLml0ZW1zLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiYXJyYXlcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaXRlbXMgPSBbLi4uY3R4LmRhdGFdXG4gICAgICAgICAgICAubWFwKChpdGVtLCBpdGVtSW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNjaGVtYSA9IHRoaXMuX2RlZi5pdGVtc1tpdGVtSW5kZXhdIHx8IHRoaXMuX2RlZi5yZXN0O1xuICAgICAgICAgICAgaWYgKCFzY2hlbWEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICByZXR1cm4gc2NoZW1hLl9wYXJzZShuZXcgUGFyc2VJbnB1dExhenlQYXRoKGN0eCwgaXRlbSwgY3R4LnBhdGgsIGl0ZW1JbmRleCkpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmZpbHRlcigoeCkgPT4gISF4KTsgLy8gZmlsdGVyIG51bGxzXG4gICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoaXRlbXMpLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUGFyc2VTdGF0dXMubWVyZ2VBcnJheShzdGF0dXMsIHJlc3VsdHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gUGFyc2VTdGF0dXMubWVyZ2VBcnJheShzdGF0dXMsIGl0ZW1zKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgaXRlbXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuaXRlbXM7XG4gICAgfVxuICAgIHJlc3QocmVzdCkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZFR1cGxlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIHJlc3QsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblpvZFR1cGxlLmNyZWF0ZSA9IChzY2hlbWFzLCBwYXJhbXMpID0+IHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoc2NoZW1hcykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgcGFzcyBhbiBhcnJheSBvZiBzY2hlbWFzIHRvIHoudHVwbGUoWyAuLi4gXSlcIik7XG4gICAgfVxuICAgIHJldHVybiBuZXcgWm9kVHVwbGUoe1xuICAgICAgICBpdGVtczogc2NoZW1hcyxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RUdXBsZSxcbiAgICAgICAgcmVzdDogbnVsbCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RSZWNvcmQgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBnZXQga2V5U2NoZW1hKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmtleVR5cGU7XG4gICAgfVxuICAgIGdldCB2YWx1ZVNjaGVtYSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi52YWx1ZVR5cGU7XG4gICAgfVxuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IHN0YXR1cywgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBpZiAoY3R4LnBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUub2JqZWN0KSB7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLm9iamVjdCxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhaXJzID0gW107XG4gICAgICAgIGNvbnN0IGtleVR5cGUgPSB0aGlzLl9kZWYua2V5VHlwZTtcbiAgICAgICAgY29uc3QgdmFsdWVUeXBlID0gdGhpcy5fZGVmLnZhbHVlVHlwZTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gY3R4LmRhdGEpIHtcbiAgICAgICAgICAgIHBhaXJzLnB1c2goe1xuICAgICAgICAgICAgICAgIGtleToga2V5VHlwZS5fcGFyc2UobmV3IFBhcnNlSW5wdXRMYXp5UGF0aChjdHgsIGtleSwgY3R4LnBhdGgsIGtleSkpLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVR5cGUuX3BhcnNlKG5ldyBQYXJzZUlucHV0TGF6eVBhdGgoY3R4LCBjdHguZGF0YVtrZXldLCBjdHgucGF0aCwga2V5KSksXG4gICAgICAgICAgICAgICAgYWx3YXlzU2V0OiBrZXkgaW4gY3R4LmRhdGEsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYykge1xuICAgICAgICAgICAgcmV0dXJuIFBhcnNlU3RhdHVzLm1lcmdlT2JqZWN0QXN5bmMoc3RhdHVzLCBwYWlycyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gUGFyc2VTdGF0dXMubWVyZ2VPYmplY3RTeW5jKHN0YXR1cywgcGFpcnMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBlbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnZhbHVlVHlwZTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShmaXJzdCwgc2Vjb25kLCB0aGlyZCkge1xuICAgICAgICBpZiAoc2Vjb25kIGluc3RhbmNlb2YgWm9kVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBab2RSZWNvcmQoe1xuICAgICAgICAgICAgICAgIGtleVR5cGU6IGZpcnN0LFxuICAgICAgICAgICAgICAgIHZhbHVlVHlwZTogc2Vjb25kLFxuICAgICAgICAgICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kUmVjb3JkLFxuICAgICAgICAgICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXModGhpcmQpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBab2RSZWNvcmQoe1xuICAgICAgICAgICAga2V5VHlwZTogWm9kU3RyaW5nLmNyZWF0ZSgpLFxuICAgICAgICAgICAgdmFsdWVUeXBlOiBmaXJzdCxcbiAgICAgICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kUmVjb3JkLFxuICAgICAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhzZWNvbmQpLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgWm9kTWFwIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgZ2V0IGtleVNjaGVtYSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5rZXlUeXBlO1xuICAgIH1cbiAgICBnZXQgdmFsdWVTY2hlbWEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYudmFsdWVUeXBlO1xuICAgIH1cbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBzdGF0dXMsIGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgaWYgKGN0eC5wYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLm1hcCkge1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5tYXAsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBrZXlUeXBlID0gdGhpcy5fZGVmLmtleVR5cGU7XG4gICAgICAgIGNvbnN0IHZhbHVlVHlwZSA9IHRoaXMuX2RlZi52YWx1ZVR5cGU7XG4gICAgICAgIGNvbnN0IHBhaXJzID0gWy4uLmN0eC5kYXRhLmVudHJpZXMoKV0ubWFwKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGtleToga2V5VHlwZS5fcGFyc2UobmV3IFBhcnNlSW5wdXRMYXp5UGF0aChjdHgsIGtleSwgY3R4LnBhdGgsIFtpbmRleCwgXCJrZXlcIl0pKSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVUeXBlLl9wYXJzZShuZXcgUGFyc2VJbnB1dExhenlQYXRoKGN0eCwgdmFsdWUsIGN0eC5wYXRoLCBbaW5kZXgsIFwidmFsdWVcIl0pKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYykge1xuICAgICAgICAgICAgY29uc3QgZmluYWxNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwYWlyIG9mIHBhaXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGF3YWl0IHBhaXIua2V5O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGF3YWl0IHBhaXIudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkuc3RhdHVzID09PSBcImFib3J0ZWRcIiB8fCB2YWx1ZS5zdGF0dXMgPT09IFwiYWJvcnRlZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5LnN0YXR1cyA9PT0gXCJkaXJ0eVwiIHx8IHZhbHVlLnN0YXR1cyA9PT0gXCJkaXJ0eVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmaW5hbE1hcC5zZXQoa2V5LnZhbHVlLCB2YWx1ZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLnZhbHVlLCB2YWx1ZTogZmluYWxNYXAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZmluYWxNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHBhaXIgb2YgcGFpcnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBwYWlyLmtleTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHBhaXIudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKGtleS5zdGF0dXMgPT09IFwiYWJvcnRlZFwiIHx8IHZhbHVlLnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChrZXkuc3RhdHVzID09PSBcImRpcnR5XCIgfHwgdmFsdWUuc3RhdHVzID09PSBcImRpcnR5XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbmFsTWFwLnNldChrZXkudmFsdWUsIHZhbHVlLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLnZhbHVlLCB2YWx1ZTogZmluYWxNYXAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cblpvZE1hcC5jcmVhdGUgPSAoa2V5VHlwZSwgdmFsdWVUeXBlLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZE1hcCh7XG4gICAgICAgIHZhbHVlVHlwZSxcbiAgICAgICAga2V5VHlwZSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RNYXAsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kU2V0IGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgc3RhdHVzLCBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGlmIChjdHgucGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5zZXQpIHtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUuc2V0LFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVmID0gdGhpcy5fZGVmO1xuICAgICAgICBpZiAoZGVmLm1pblNpemUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjdHguZGF0YS5zaXplIDwgZGVmLm1pblNpemUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19zbWFsbCxcbiAgICAgICAgICAgICAgICAgICAgbWluaW11bTogZGVmLm1pblNpemUudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2V0XCIsXG4gICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBkZWYubWluU2l6ZS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkZWYubWF4U2l6ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGN0eC5kYXRhLnNpemUgPiBkZWYubWF4U2l6ZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX2JpZyxcbiAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogZGVmLm1heFNpemUudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2V0XCIsXG4gICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBkZWYubWF4U2l6ZS5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZhbHVlVHlwZSA9IHRoaXMuX2RlZi52YWx1ZVR5cGU7XG4gICAgICAgIGZ1bmN0aW9uIGZpbmFsaXplU2V0KGVsZW1lbnRzKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWRTZXQgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5zdGF0dXMgPT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5zdGF0dXMgPT09IFwiZGlydHlcIilcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgcGFyc2VkU2V0LmFkZChlbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLnZhbHVlLCB2YWx1ZTogcGFyc2VkU2V0IH07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBbLi4uY3R4LmRhdGEudmFsdWVzKCldLm1hcCgoaXRlbSwgaSkgPT4gdmFsdWVUeXBlLl9wYXJzZShuZXcgUGFyc2VJbnB1dExhenlQYXRoKGN0eCwgaXRlbSwgY3R4LnBhdGgsIGkpKSk7XG4gICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoZWxlbWVudHMpLnRoZW4oKGVsZW1lbnRzKSA9PiBmaW5hbGl6ZVNldChlbGVtZW50cykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZpbmFsaXplU2V0KGVsZW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBtaW4obWluU2l6ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZFNldCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBtaW5TaXplOiB7IHZhbHVlOiBtaW5TaXplLCBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG1heChtYXhTaXplLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kU2V0KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIG1heFNpemU6IHsgdmFsdWU6IG1heFNpemUsIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2l6ZShzaXplLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbihzaXplLCBtZXNzYWdlKS5tYXgoc2l6ZSwgbWVzc2FnZSk7XG4gICAgfVxuICAgIG5vbmVtcHR5KG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWluKDEsIG1lc3NhZ2UpO1xuICAgIH1cbn1cblpvZFNldC5jcmVhdGUgPSAodmFsdWVUeXBlLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZFNldCh7XG4gICAgICAgIHZhbHVlVHlwZSxcbiAgICAgICAgbWluU2l6ZTogbnVsbCxcbiAgICAgICAgbWF4U2l6ZTogbnVsbCxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RTZXQsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kRnVuY3Rpb24gZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy52YWxpZGF0ZSA9IHRoaXMuaW1wbGVtZW50O1xuICAgIH1cbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGlmIChjdHgucGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5mdW5jdGlvbikge1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5mdW5jdGlvbixcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1ha2VBcmdzSXNzdWUoYXJncywgZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBtYWtlSXNzdWUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IGFyZ3MsXG4gICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgZXJyb3JNYXBzOiBbY3R4LmNvbW1vbi5jb250ZXh0dWFsRXJyb3JNYXAsIGN0eC5zY2hlbWFFcnJvck1hcCwgZ2V0RXJyb3JNYXAoKSwgZGVmYXVsdEVycm9yTWFwXS5maWx0ZXIoKHgpID0+ICEheCksXG4gICAgICAgICAgICAgICAgaXNzdWVEYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX2FyZ3VtZW50cyxcbiAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzRXJyb3I6IGVycm9yLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYWtlUmV0dXJuc0lzc3VlKHJldHVybnMsIGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFrZUlzc3VlKHtcbiAgICAgICAgICAgICAgICBkYXRhOiByZXR1cm5zLFxuICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgIGVycm9yTWFwczogW2N0eC5jb21tb24uY29udGV4dHVhbEVycm9yTWFwLCBjdHguc2NoZW1hRXJyb3JNYXAsIGdldEVycm9yTWFwKCksIGRlZmF1bHRFcnJvck1hcF0uZmlsdGVyKCh4KSA9PiAhIXgpLFxuICAgICAgICAgICAgICAgIGlzc3VlRGF0YToge1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9yZXR1cm5fdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVHlwZUVycm9yOiBlcnJvcixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFyYW1zID0geyBlcnJvck1hcDogY3R4LmNvbW1vbi5jb250ZXh0dWFsRXJyb3JNYXAgfTtcbiAgICAgICAgY29uc3QgZm4gPSBjdHguZGF0YTtcbiAgICAgICAgaWYgKHRoaXMuX2RlZi5yZXR1cm5zIGluc3RhbmNlb2YgWm9kUHJvbWlzZSkge1xuICAgICAgICAgICAgLy8gV291bGQgbG92ZSBhIHdheSB0byBhdm9pZCBkaXNhYmxpbmcgdGhpcyBydWxlLCBidXQgd2UgbmVlZFxuICAgICAgICAgICAgLy8gYW4gYWxpYXMgKHVzaW5nIGFuIGFycm93IGZ1bmN0aW9uIHdhcyB3aGF0IGNhdXNlZCAyNjUxKS5cbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdGhpcy1hbGlhc1xuICAgICAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIE9LKGFzeW5jIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgWm9kRXJyb3IoW10pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZEFyZ3MgPSBhd2FpdCBtZS5fZGVmLmFyZ3MucGFyc2VBc3luYyhhcmdzLCBwYXJhbXMpLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yLmFkZElzc3VlKG1ha2VBcmdzSXNzdWUoYXJncywgZSkpO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBSZWZsZWN0LmFwcGx5KGZuLCB0aGlzLCBwYXJzZWRBcmdzKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRSZXR1cm5zID0gYXdhaXQgbWUuX2RlZi5yZXR1cm5zLl9kZWYudHlwZVxuICAgICAgICAgICAgICAgICAgICAucGFyc2VBc3luYyhyZXN1bHQsIHBhcmFtcylcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yLmFkZElzc3VlKG1ha2VSZXR1cm5zSXNzdWUocmVzdWx0LCBlKSk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWRSZXR1cm5zO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBXb3VsZCBsb3ZlIGEgd2F5IHRvIGF2b2lkIGRpc2FibGluZyB0aGlzIHJ1bGUsIGJ1dCB3ZSBuZWVkXG4gICAgICAgICAgICAvLyBhbiBhbGlhcyAodXNpbmcgYW4gYXJyb3cgZnVuY3Rpb24gd2FzIHdoYXQgY2F1c2VkIDI2NTEpLlxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG4gICAgICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gT0soZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRBcmdzID0gbWUuX2RlZi5hcmdzLnNhZmVQYXJzZShhcmdzLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGlmICghcGFyc2VkQXJncy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBab2RFcnJvcihbbWFrZUFyZ3NJc3N1ZShhcmdzLCBwYXJzZWRBcmdzLmVycm9yKV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LmFwcGx5KGZuLCB0aGlzLCBwYXJzZWRBcmdzLmRhdGEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFJldHVybnMgPSBtZS5fZGVmLnJldHVybnMuc2FmZVBhcnNlKHJlc3VsdCwgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICBpZiAoIXBhcnNlZFJldHVybnMuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgWm9kRXJyb3IoW21ha2VSZXR1cm5zSXNzdWUocmVzdWx0LCBwYXJzZWRSZXR1cm5zLmVycm9yKV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkUmV0dXJucy5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGFyYW1ldGVycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5hcmdzO1xuICAgIH1cbiAgICByZXR1cm5UeXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnJldHVybnM7XG4gICAgfVxuICAgIGFyZ3MoLi4uaXRlbXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RGdW5jdGlvbih7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBhcmdzOiBab2RUdXBsZS5jcmVhdGUoaXRlbXMpLnJlc3QoWm9kVW5rbm93bi5jcmVhdGUoKSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm5zKHJldHVyblR5cGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RGdW5jdGlvbih7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICByZXR1cm5zOiByZXR1cm5UeXBlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaW1wbGVtZW50KGZ1bmMpIHtcbiAgICAgICAgY29uc3QgdmFsaWRhdGVkRnVuYyA9IHRoaXMucGFyc2UoZnVuYyk7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZWRGdW5jO1xuICAgIH1cbiAgICBzdHJpY3RJbXBsZW1lbnQoZnVuYykge1xuICAgICAgICBjb25zdCB2YWxpZGF0ZWRGdW5jID0gdGhpcy5wYXJzZShmdW5jKTtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlZEZ1bmM7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUoYXJncywgcmV0dXJucywgcGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kRnVuY3Rpb24oe1xuICAgICAgICAgICAgYXJnczogKGFyZ3MgPyBhcmdzIDogWm9kVHVwbGUuY3JlYXRlKFtdKS5yZXN0KFpvZFVua25vd24uY3JlYXRlKCkpKSxcbiAgICAgICAgICAgIHJldHVybnM6IHJldHVybnMgfHwgWm9kVW5rbm93bi5jcmVhdGUoKSxcbiAgICAgICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kRnVuY3Rpb24sXG4gICAgICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBab2RMYXp5IGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgZ2V0IHNjaGVtYSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5nZXR0ZXIoKTtcbiAgICB9XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBjb25zdCBsYXp5U2NoZW1hID0gdGhpcy5fZGVmLmdldHRlcigpO1xuICAgICAgICByZXR1cm4gbGF6eVNjaGVtYS5fcGFyc2UoeyBkYXRhOiBjdHguZGF0YSwgcGF0aDogY3R4LnBhdGgsIHBhcmVudDogY3R4IH0pO1xuICAgIH1cbn1cblpvZExhenkuY3JlYXRlID0gKGdldHRlciwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RMYXp5KHtcbiAgICAgICAgZ2V0dGVyOiBnZXR0ZXIsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kTGF6eSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RMaXRlcmFsIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dC5kYXRhICE9PSB0aGlzLl9kZWYudmFsdWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9saXRlcmFsLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiB0aGlzLl9kZWYudmFsdWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogXCJ2YWxpZFwiLCB2YWx1ZTogaW5wdXQuZGF0YSB9O1xuICAgIH1cbiAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYudmFsdWU7XG4gICAgfVxufVxuWm9kTGl0ZXJhbC5jcmVhdGUgPSAodmFsdWUsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kTGl0ZXJhbCh7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RMaXRlcmFsLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZnVuY3Rpb24gY3JlYXRlWm9kRW51bSh2YWx1ZXMsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgWm9kRW51bSh7XG4gICAgICAgIHZhbHVlcyxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RFbnVtLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgY2xhc3MgWm9kRW51bSBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0LmRhdGEgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkVmFsdWVzID0gdGhpcy5fZGVmLnZhbHVlcztcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiB1dGlsLmpvaW5WYWx1ZXMoZXhwZWN0ZWRWYWx1ZXMpLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2NhY2hlKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWNoZSA9IG5ldyBTZXQodGhpcy5fZGVmLnZhbHVlcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9jYWNoZS5oYXMoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkVmFsdWVzID0gdGhpcy5fZGVmLnZhbHVlcztcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9lbnVtX3ZhbHVlLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IGV4cGVjdGVkVmFsdWVzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT0soaW5wdXQuZGF0YSk7XG4gICAgfVxuICAgIGdldCBvcHRpb25zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnZhbHVlcztcbiAgICB9XG4gICAgZ2V0IGVudW0oKSB7XG4gICAgICAgIGNvbnN0IGVudW1WYWx1ZXMgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCB2YWwgb2YgdGhpcy5fZGVmLnZhbHVlcykge1xuICAgICAgICAgICAgZW51bVZhbHVlc1t2YWxdID0gdmFsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbnVtVmFsdWVzO1xuICAgIH1cbiAgICBnZXQgVmFsdWVzKCkge1xuICAgICAgICBjb25zdCBlbnVtVmFsdWVzID0ge307XG4gICAgICAgIGZvciAoY29uc3QgdmFsIG9mIHRoaXMuX2RlZi52YWx1ZXMpIHtcbiAgICAgICAgICAgIGVudW1WYWx1ZXNbdmFsXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW51bVZhbHVlcztcbiAgICB9XG4gICAgZ2V0IEVudW0oKSB7XG4gICAgICAgIGNvbnN0IGVudW1WYWx1ZXMgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCB2YWwgb2YgdGhpcy5fZGVmLnZhbHVlcykge1xuICAgICAgICAgICAgZW51bVZhbHVlc1t2YWxdID0gdmFsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbnVtVmFsdWVzO1xuICAgIH1cbiAgICBleHRyYWN0KHZhbHVlcywgbmV3RGVmID0gdGhpcy5fZGVmKSB7XG4gICAgICAgIHJldHVybiBab2RFbnVtLmNyZWF0ZSh2YWx1ZXMsIHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIC4uLm5ld0RlZixcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGV4Y2x1ZGUodmFsdWVzLCBuZXdEZWYgPSB0aGlzLl9kZWYpIHtcbiAgICAgICAgcmV0dXJuIFpvZEVudW0uY3JlYXRlKHRoaXMub3B0aW9ucy5maWx0ZXIoKG9wdCkgPT4gIXZhbHVlcy5pbmNsdWRlcyhvcHQpKSwge1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgLi4ubmV3RGVmLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5ab2RFbnVtLmNyZWF0ZSA9IGNyZWF0ZVpvZEVudW07XG5leHBvcnQgY2xhc3MgWm9kTmF0aXZlRW51bSBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCBuYXRpdmVFbnVtVmFsdWVzID0gdXRpbC5nZXRWYWxpZEVudW1WYWx1ZXModGhpcy5fZGVmLnZhbHVlcyk7XG4gICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgaWYgKGN0eC5wYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLnN0cmluZyAmJiBjdHgucGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkVmFsdWVzID0gdXRpbC5vYmplY3RWYWx1ZXMobmF0aXZlRW51bVZhbHVlcyk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogdXRpbC5qb2luVmFsdWVzKGV4cGVjdGVkVmFsdWVzKSxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9jYWNoZSkge1xuICAgICAgICAgICAgdGhpcy5fY2FjaGUgPSBuZXcgU2V0KHV0aWwuZ2V0VmFsaWRFbnVtVmFsdWVzKHRoaXMuX2RlZi52YWx1ZXMpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2NhY2hlLmhhcyhpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWRWYWx1ZXMgPSB1dGlsLm9iamVjdFZhbHVlcyhuYXRpdmVFbnVtVmFsdWVzKTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9lbnVtX3ZhbHVlLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IGV4cGVjdGVkVmFsdWVzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT0soaW5wdXQuZGF0YSk7XG4gICAgfVxuICAgIGdldCBlbnVtKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnZhbHVlcztcbiAgICB9XG59XG5ab2ROYXRpdmVFbnVtLmNyZWF0ZSA9ICh2YWx1ZXMsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kTmF0aXZlRW51bSh7XG4gICAgICAgIHZhbHVlczogdmFsdWVzLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE5hdGl2ZUVudW0sXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kUHJvbWlzZSBleHRlbmRzIFpvZFR5cGUge1xuICAgIHVud3JhcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi50eXBlO1xuICAgIH1cbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGlmIChjdHgucGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5wcm9taXNlICYmIGN0eC5jb21tb24uYXN5bmMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLnByb21pc2UsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcm9taXNpZmllZCA9IGN0eC5wYXJzZWRUeXBlID09PSBab2RQYXJzZWRUeXBlLnByb21pc2UgPyBjdHguZGF0YSA6IFByb21pc2UucmVzb2x2ZShjdHguZGF0YSk7XG4gICAgICAgIHJldHVybiBPSyhwcm9taXNpZmllZC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnR5cGUucGFyc2VBc3luYyhkYXRhLCB7XG4gICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgZXJyb3JNYXA6IGN0eC5jb21tb24uY29udGV4dHVhbEVycm9yTWFwLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKTtcbiAgICB9XG59XG5ab2RQcm9taXNlLmNyZWF0ZSA9IChzY2hlbWEsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kUHJvbWlzZSh7XG4gICAgICAgIHR5cGU6IHNjaGVtYSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RQcm9taXNlLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZEVmZmVjdHMgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBpbm5lclR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuc2NoZW1hO1xuICAgIH1cbiAgICBzb3VyY2VUeXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnNjaGVtYS5fZGVmLnR5cGVOYW1lID09PSBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kRWZmZWN0c1xuICAgICAgICAgICAgPyB0aGlzLl9kZWYuc2NoZW1hLnNvdXJjZVR5cGUoKVxuICAgICAgICAgICAgOiB0aGlzLl9kZWYuc2NoZW1hO1xuICAgIH1cbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBzdGF0dXMsIGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgY29uc3QgZWZmZWN0ID0gdGhpcy5fZGVmLmVmZmVjdCB8fCBudWxsO1xuICAgICAgICBjb25zdCBjaGVja0N0eCA9IHtcbiAgICAgICAgICAgIGFkZElzc3VlOiAoYXJnKSA9PiB7XG4gICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCBhcmcpO1xuICAgICAgICAgICAgICAgIGlmIChhcmcuZmF0YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0IHBhdGgoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN0eC5wYXRoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgY2hlY2tDdHguYWRkSXNzdWUgPSBjaGVja0N0eC5hZGRJc3N1ZS5iaW5kKGNoZWNrQ3R4KTtcbiAgICAgICAgaWYgKGVmZmVjdC50eXBlID09PSBcInByZXByb2Nlc3NcIikge1xuICAgICAgICAgICAgY29uc3QgcHJvY2Vzc2VkID0gZWZmZWN0LnRyYW5zZm9ybShjdHguZGF0YSwgY2hlY2tDdHgpO1xuICAgICAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHByb2Nlc3NlZCkudGhlbihhc3luYyAocHJvY2Vzc2VkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXMudmFsdWUgPT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuX2RlZi5zY2hlbWEuX3BhcnNlQXN5bmMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcHJvY2Vzc2VkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gXCJkaXJ0eVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERJUlRZKHJlc3VsdC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXMudmFsdWUgPT09IFwiZGlydHlcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBESVJUWShyZXN1bHQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cy52YWx1ZSA9PT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX2RlZi5zY2hlbWEuX3BhcnNlU3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHByb2Nlc3NlZCxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09IFwiZGlydHlcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERJUlRZKHJlc3VsdC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cy52YWx1ZSA9PT0gXCJkaXJ0eVwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRElSVFkocmVzdWx0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChlZmZlY3QudHlwZSA9PT0gXCJyZWZpbmVtZW50XCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4ZWN1dGVSZWZpbmVtZW50ID0gKGFjYykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGVmZmVjdC5yZWZpbmVtZW50KGFjYywgY2hlY2tDdHgpO1xuICAgICAgICAgICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXN5bmMgcmVmaW5lbWVudCBlbmNvdW50ZXJlZCBkdXJpbmcgc3luY2hyb25vdXMgcGFyc2Ugb3BlcmF0aW9uLiBVc2UgLnBhcnNlQXN5bmMgaW5zdGVhZC5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5uZXIgPSB0aGlzLl9kZWYuc2NoZW1hLl9wYXJzZVN5bmMoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChpbm5lci5zdGF0dXMgPT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgICAgICBpZiAoaW5uZXIuc3RhdHVzID09PSBcImRpcnR5XCIpXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiB2YWx1ZSBpcyBpZ25vcmVkXG4gICAgICAgICAgICAgICAgZXhlY3V0ZVJlZmluZW1lbnQoaW5uZXIudmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLnZhbHVlLCB2YWx1ZTogaW5uZXIudmFsdWUgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZWYuc2NoZW1hLl9wYXJzZUFzeW5jKHsgZGF0YTogY3R4LmRhdGEsIHBhdGg6IGN0eC5wYXRoLCBwYXJlbnQ6IGN0eCB9KS50aGVuKChpbm5lcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5uZXIuc3RhdHVzID09PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5uZXIuc3RhdHVzID09PSBcImRpcnR5XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4ZWN1dGVSZWZpbmVtZW50KGlubmVyLnZhbHVlKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLnZhbHVlLCB2YWx1ZTogaW5uZXIudmFsdWUgfTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVmZmVjdC50eXBlID09PSBcInRyYW5zZm9ybVwiKSB7XG4gICAgICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlID0gdGhpcy5fZGVmLnNjaGVtYS5fcGFyc2VTeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWQoYmFzZSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGVmZmVjdC50cmFuc2Zvcm0oYmFzZS52YWx1ZSwgY2hlY2tDdHgpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQXN5bmNocm9ub3VzIHRyYW5zZm9ybSBlbmNvdW50ZXJlZCBkdXJpbmcgc3luY2hyb25vdXMgcGFyc2Ugb3BlcmF0aW9uLiBVc2UgLnBhcnNlQXN5bmMgaW5zdGVhZC5gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMudmFsdWUsIHZhbHVlOiByZXN1bHQgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZWYuc2NoZW1hLl9wYXJzZUFzeW5jKHsgZGF0YTogY3R4LmRhdGEsIHBhdGg6IGN0eC5wYXRoLCBwYXJlbnQ6IGN0eCB9KS50aGVuKChiYXNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZChiYXNlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGVmZmVjdC50cmFuc2Zvcm0oYmFzZS52YWx1ZSwgY2hlY2tDdHgpKS50aGVuKChyZXN1bHQpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHN0YXR1cy52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB1dGlsLmFzc2VydE5ldmVyKGVmZmVjdCk7XG4gICAgfVxufVxuWm9kRWZmZWN0cy5jcmVhdGUgPSAoc2NoZW1hLCBlZmZlY3QsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kRWZmZWN0cyh7XG4gICAgICAgIHNjaGVtYSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RFZmZlY3RzLFxuICAgICAgICBlZmZlY3QsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5ab2RFZmZlY3RzLmNyZWF0ZVdpdGhQcmVwcm9jZXNzID0gKHByZXByb2Nlc3MsIHNjaGVtYSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RFZmZlY3RzKHtcbiAgICAgICAgc2NoZW1hLFxuICAgICAgICBlZmZlY3Q6IHsgdHlwZTogXCJwcmVwcm9jZXNzXCIsIHRyYW5zZm9ybTogcHJlcHJvY2VzcyB9LFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEVmZmVjdHMsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgeyBab2RFZmZlY3RzIGFzIFpvZFRyYW5zZm9ybWVyIH07XG5leHBvcnQgY2xhc3MgWm9kT3B0aW9uYWwgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSA9PT0gWm9kUGFyc2VkVHlwZS51bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBPSyh1bmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuaW5uZXJUeXBlLl9wYXJzZShpbnB1dCk7XG4gICAgfVxuICAgIHVud3JhcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5pbm5lclR5cGU7XG4gICAgfVxufVxuWm9kT3B0aW9uYWwuY3JlYXRlID0gKHR5cGUsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kT3B0aW9uYWwoe1xuICAgICAgICBpbm5lclR5cGU6IHR5cGUsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kT3B0aW9uYWwsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kTnVsbGFibGUgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSA9PT0gWm9kUGFyc2VkVHlwZS5udWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gT0sobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5pbm5lclR5cGUuX3BhcnNlKGlucHV0KTtcbiAgICB9XG4gICAgdW53cmFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmlubmVyVHlwZTtcbiAgICB9XG59XG5ab2ROdWxsYWJsZS5jcmVhdGUgPSAodHlwZSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2ROdWxsYWJsZSh7XG4gICAgICAgIGlubmVyVHlwZTogdHlwZSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2ROdWxsYWJsZSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2REZWZhdWx0IGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBsZXQgZGF0YSA9IGN0eC5kYXRhO1xuICAgICAgICBpZiAoY3R4LnBhcnNlZFR5cGUgPT09IFpvZFBhcnNlZFR5cGUudW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkYXRhID0gdGhpcy5fZGVmLmRlZmF1bHRWYWx1ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuaW5uZXJUeXBlLl9wYXJzZSh7XG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbW92ZURlZmF1bHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuaW5uZXJUeXBlO1xuICAgIH1cbn1cblpvZERlZmF1bHQuY3JlYXRlID0gKHR5cGUsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kRGVmYXVsdCh7XG4gICAgICAgIGlubmVyVHlwZTogdHlwZSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2REZWZhdWx0LFxuICAgICAgICBkZWZhdWx0VmFsdWU6IHR5cGVvZiBwYXJhbXMuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiID8gcGFyYW1zLmRlZmF1bHQgOiAoKSA9PiBwYXJhbXMuZGVmYXVsdCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RDYXRjaCBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgLy8gbmV3Q3R4IGlzIHVzZWQgdG8gbm90IGNvbGxlY3QgaXNzdWVzIGZyb20gaW5uZXIgdHlwZXMgaW4gY3R4XG4gICAgICAgIGNvbnN0IG5ld0N0eCA9IHtcbiAgICAgICAgICAgIC4uLmN0eCxcbiAgICAgICAgICAgIGNvbW1vbjoge1xuICAgICAgICAgICAgICAgIC4uLmN0eC5jb21tb24sXG4gICAgICAgICAgICAgICAgaXNzdWVzOiBbXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX2RlZi5pbm5lclR5cGUuX3BhcnNlKHtcbiAgICAgICAgICAgIGRhdGE6IG5ld0N0eC5kYXRhLFxuICAgICAgICAgICAgcGF0aDogbmV3Q3R4LnBhdGgsXG4gICAgICAgICAgICBwYXJlbnQ6IHtcbiAgICAgICAgICAgICAgICAuLi5uZXdDdHgsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGlzQXN5bmMocmVzdWx0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IFwidmFsaWRcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC5zdGF0dXMgPT09IFwidmFsaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPyByZXN1bHQudmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIDogdGhpcy5fZGVmLmNhdGNoVmFsdWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldCBlcnJvcigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBab2RFcnJvcihuZXdDdHguY29tbW9uLmlzc3Vlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dDogbmV3Q3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogXCJ2YWxpZFwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQuc3RhdHVzID09PSBcInZhbGlkXCJcbiAgICAgICAgICAgICAgICAgICAgPyByZXN1bHQudmFsdWVcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLl9kZWYuY2F0Y2hWYWx1ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXQgZXJyb3IoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBab2RFcnJvcihuZXdDdHguY29tbW9uLmlzc3Vlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IG5ld0N0eC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVtb3ZlQ2F0Y2goKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuaW5uZXJUeXBlO1xuICAgIH1cbn1cblpvZENhdGNoLmNyZWF0ZSA9ICh0eXBlLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZENhdGNoKHtcbiAgICAgICAgaW5uZXJUeXBlOiB0eXBlLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZENhdGNoLFxuICAgICAgICBjYXRjaFZhbHVlOiB0eXBlb2YgcGFyYW1zLmNhdGNoID09PSBcImZ1bmN0aW9uXCIgPyBwYXJhbXMuY2F0Y2ggOiAoKSA9PiBwYXJhbXMuY2F0Y2gsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kTmFOIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUubmFuKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLm5hbixcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogXCJ2YWxpZFwiLCB2YWx1ZTogaW5wdXQuZGF0YSB9O1xuICAgIH1cbn1cblpvZE5hTi5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2ROYU4oe1xuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE5hTixcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjb25zdCBCUkFORCA9IFN5bWJvbChcInpvZF9icmFuZFwiKTtcbmV4cG9ydCBjbGFzcyBab2RCcmFuZGVkIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBjb25zdCBkYXRhID0gY3R4LmRhdGE7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYudHlwZS5fcGFyc2Uoe1xuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB1bndyYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYudHlwZTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgWm9kUGlwZWxpbmUgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBzdGF0dXMsIGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZUFzeW5jID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluUmVzdWx0ID0gYXdhaXQgdGhpcy5fZGVmLmluLl9wYXJzZUFzeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaW5SZXN1bHQuc3RhdHVzID09PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICAgICAgaWYgKGluUmVzdWx0LnN0YXR1cyA9PT0gXCJkaXJ0eVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRElSVFkoaW5SZXN1bHQudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5vdXQuX3BhcnNlQXN5bmMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5SZXN1bHQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUFzeW5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBpblJlc3VsdCA9IHRoaXMuX2RlZi5pbi5fcGFyc2VTeW5jKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGluUmVzdWx0LnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICBpZiAoaW5SZXN1bHQuc3RhdHVzID09PSBcImRpcnR5XCIpIHtcbiAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IFwiZGlydHlcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGluUmVzdWx0LnZhbHVlLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGVmLm91dC5fcGFyc2VTeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogaW5SZXN1bHQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RQaXBlbGluZSh7XG4gICAgICAgICAgICBpbjogYSxcbiAgICAgICAgICAgIG91dDogYixcbiAgICAgICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kUGlwZWxpbmUsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBab2RSZWFkb25seSBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9kZWYuaW5uZXJUeXBlLl9wYXJzZShpbnB1dCk7XG4gICAgICAgIGNvbnN0IGZyZWV6ZSA9IChkYXRhKSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNWYWxpZChkYXRhKSkge1xuICAgICAgICAgICAgICAgIGRhdGEudmFsdWUgPSBPYmplY3QuZnJlZXplKGRhdGEudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBpc0FzeW5jKHJlc3VsdCkgPyByZXN1bHQudGhlbigoZGF0YSkgPT4gZnJlZXplKGRhdGEpKSA6IGZyZWV6ZShyZXN1bHQpO1xuICAgIH1cbiAgICB1bndyYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuaW5uZXJUeXBlO1xuICAgIH1cbn1cblpvZFJlYWRvbmx5LmNyZWF0ZSA9ICh0eXBlLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZFJlYWRvbmx5KHtcbiAgICAgICAgaW5uZXJUeXBlOiB0eXBlLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFJlYWRvbmx5LFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLyAgICAgICAgICAgICAgICAgICAgLy8vLy8vLy8vL1xuLy8vLy8vLy8vLyAgICAgIHouY3VzdG9tICAgICAgLy8vLy8vLy8vL1xuLy8vLy8vLy8vLyAgICAgICAgICAgICAgICAgICAgLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZnVuY3Rpb24gY2xlYW5QYXJhbXMocGFyYW1zLCBkYXRhKSB7XG4gICAgY29uc3QgcCA9IHR5cGVvZiBwYXJhbXMgPT09IFwiZnVuY3Rpb25cIiA/IHBhcmFtcyhkYXRhKSA6IHR5cGVvZiBwYXJhbXMgPT09IFwic3RyaW5nXCIgPyB7IG1lc3NhZ2U6IHBhcmFtcyB9IDogcGFyYW1zO1xuICAgIGNvbnN0IHAyID0gdHlwZW9mIHAgPT09IFwic3RyaW5nXCIgPyB7IG1lc3NhZ2U6IHAgfSA6IHA7XG4gICAgcmV0dXJuIHAyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGN1c3RvbShjaGVjaywgX3BhcmFtcyA9IHt9LCBcbi8qKlxuICogQGRlcHJlY2F0ZWRcbiAqXG4gKiBQYXNzIGBmYXRhbGAgaW50byB0aGUgcGFyYW1zIG9iamVjdCBpbnN0ZWFkOlxuICpcbiAqIGBgYHRzXG4gKiB6LnN0cmluZygpLmN1c3RvbSgodmFsKSA9PiB2YWwubGVuZ3RoID4gNSwgeyBmYXRhbDogZmFsc2UgfSlcbiAqIGBgYFxuICpcbiAqL1xuZmF0YWwpIHtcbiAgICBpZiAoY2hlY2spXG4gICAgICAgIHJldHVybiBab2RBbnkuY3JlYXRlKCkuc3VwZXJSZWZpbmUoKGRhdGEsIGN0eCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgciA9IGNoZWNrKGRhdGEpO1xuICAgICAgICAgICAgaWYgKHIgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHIudGhlbigocikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IGNsZWFuUGFyYW1zKF9wYXJhbXMsIGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX2ZhdGFsID0gcGFyYW1zLmZhdGFsID8/IGZhdGFsID8/IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguYWRkSXNzdWUoeyBjb2RlOiBcImN1c3RvbVwiLCAuLi5wYXJhbXMsIGZhdGFsOiBfZmF0YWwgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IGNsZWFuUGFyYW1zKF9wYXJhbXMsIGRhdGEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IF9mYXRhbCA9IHBhcmFtcy5mYXRhbCA/PyBmYXRhbCA/PyB0cnVlO1xuICAgICAgICAgICAgICAgIGN0eC5hZGRJc3N1ZSh7IGNvZGU6IFwiY3VzdG9tXCIsIC4uLnBhcmFtcywgZmF0YWw6IF9mYXRhbCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSk7XG4gICAgcmV0dXJuIFpvZEFueS5jcmVhdGUoKTtcbn1cbmV4cG9ydCB7IFpvZFR5cGUgYXMgU2NoZW1hLCBab2RUeXBlIGFzIFpvZFNjaGVtYSB9O1xuZXhwb3J0IGNvbnN0IGxhdGUgPSB7XG4gICAgb2JqZWN0OiBab2RPYmplY3QubGF6eWNyZWF0ZSxcbn07XG5leHBvcnQgdmFyIFpvZEZpcnN0UGFydHlUeXBlS2luZDtcbihmdW5jdGlvbiAoWm9kRmlyc3RQYXJ0eVR5cGVLaW5kKSB7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kU3RyaW5nXCJdID0gXCJab2RTdHJpbmdcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2ROdW1iZXJcIl0gPSBcIlpvZE51bWJlclwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZE5hTlwiXSA9IFwiWm9kTmFOXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kQmlnSW50XCJdID0gXCJab2RCaWdJbnRcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RCb29sZWFuXCJdID0gXCJab2RCb29sZWFuXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kRGF0ZVwiXSA9IFwiWm9kRGF0ZVwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZFN5bWJvbFwiXSA9IFwiWm9kU3ltYm9sXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kVW5kZWZpbmVkXCJdID0gXCJab2RVbmRlZmluZWRcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2ROdWxsXCJdID0gXCJab2ROdWxsXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kQW55XCJdID0gXCJab2RBbnlcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RVbmtub3duXCJdID0gXCJab2RVbmtub3duXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kTmV2ZXJcIl0gPSBcIlpvZE5ldmVyXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kVm9pZFwiXSA9IFwiWm9kVm9pZFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZEFycmF5XCJdID0gXCJab2RBcnJheVwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZE9iamVjdFwiXSA9IFwiWm9kT2JqZWN0XCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kVW5pb25cIl0gPSBcIlpvZFVuaW9uXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kRGlzY3JpbWluYXRlZFVuaW9uXCJdID0gXCJab2REaXNjcmltaW5hdGVkVW5pb25cIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RJbnRlcnNlY3Rpb25cIl0gPSBcIlpvZEludGVyc2VjdGlvblwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZFR1cGxlXCJdID0gXCJab2RUdXBsZVwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZFJlY29yZFwiXSA9IFwiWm9kUmVjb3JkXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kTWFwXCJdID0gXCJab2RNYXBcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RTZXRcIl0gPSBcIlpvZFNldFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZEZ1bmN0aW9uXCJdID0gXCJab2RGdW5jdGlvblwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZExhenlcIl0gPSBcIlpvZExhenlcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RMaXRlcmFsXCJdID0gXCJab2RMaXRlcmFsXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kRW51bVwiXSA9IFwiWm9kRW51bVwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZEVmZmVjdHNcIl0gPSBcIlpvZEVmZmVjdHNcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2ROYXRpdmVFbnVtXCJdID0gXCJab2ROYXRpdmVFbnVtXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kT3B0aW9uYWxcIl0gPSBcIlpvZE9wdGlvbmFsXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kTnVsbGFibGVcIl0gPSBcIlpvZE51bGxhYmxlXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kRGVmYXVsdFwiXSA9IFwiWm9kRGVmYXVsdFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZENhdGNoXCJdID0gXCJab2RDYXRjaFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZFByb21pc2VcIl0gPSBcIlpvZFByb21pc2VcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RCcmFuZGVkXCJdID0gXCJab2RCcmFuZGVkXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kUGlwZWxpbmVcIl0gPSBcIlpvZFBpcGVsaW5lXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kUmVhZG9ubHlcIl0gPSBcIlpvZFJlYWRvbmx5XCI7XG59KShab2RGaXJzdFBhcnR5VHlwZUtpbmQgfHwgKFpvZEZpcnN0UGFydHlUeXBlS2luZCA9IHt9KSk7XG4vLyByZXF1aXJlcyBUUyA0LjQrXG5jbGFzcyBDbGFzcyB7XG4gICAgY29uc3RydWN0b3IoLi4uXykgeyB9XG59XG5jb25zdCBpbnN0YW5jZU9mVHlwZSA9IChcbi8vIGNvbnN0IGluc3RhbmNlT2ZUeXBlID0gPFQgZXh0ZW5kcyBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk+KFxuY2xzLCBwYXJhbXMgPSB7XG4gICAgbWVzc2FnZTogYElucHV0IG5vdCBpbnN0YW5jZSBvZiAke2Nscy5uYW1lfWAsXG59KSA9PiBjdXN0b20oKGRhdGEpID0+IGRhdGEgaW5zdGFuY2VvZiBjbHMsIHBhcmFtcyk7XG5jb25zdCBzdHJpbmdUeXBlID0gWm9kU3RyaW5nLmNyZWF0ZTtcbmNvbnN0IG51bWJlclR5cGUgPSBab2ROdW1iZXIuY3JlYXRlO1xuY29uc3QgbmFuVHlwZSA9IFpvZE5hTi5jcmVhdGU7XG5jb25zdCBiaWdJbnRUeXBlID0gWm9kQmlnSW50LmNyZWF0ZTtcbmNvbnN0IGJvb2xlYW5UeXBlID0gWm9kQm9vbGVhbi5jcmVhdGU7XG5jb25zdCBkYXRlVHlwZSA9IFpvZERhdGUuY3JlYXRlO1xuY29uc3Qgc3ltYm9sVHlwZSA9IFpvZFN5bWJvbC5jcmVhdGU7XG5jb25zdCB1bmRlZmluZWRUeXBlID0gWm9kVW5kZWZpbmVkLmNyZWF0ZTtcbmNvbnN0IG51bGxUeXBlID0gWm9kTnVsbC5jcmVhdGU7XG5jb25zdCBhbnlUeXBlID0gWm9kQW55LmNyZWF0ZTtcbmNvbnN0IHVua25vd25UeXBlID0gWm9kVW5rbm93bi5jcmVhdGU7XG5jb25zdCBuZXZlclR5cGUgPSBab2ROZXZlci5jcmVhdGU7XG5jb25zdCB2b2lkVHlwZSA9IFpvZFZvaWQuY3JlYXRlO1xuY29uc3QgYXJyYXlUeXBlID0gWm9kQXJyYXkuY3JlYXRlO1xuY29uc3Qgb2JqZWN0VHlwZSA9IFpvZE9iamVjdC5jcmVhdGU7XG5jb25zdCBzdHJpY3RPYmplY3RUeXBlID0gWm9kT2JqZWN0LnN0cmljdENyZWF0ZTtcbmNvbnN0IHVuaW9uVHlwZSA9IFpvZFVuaW9uLmNyZWF0ZTtcbmNvbnN0IGRpc2NyaW1pbmF0ZWRVbmlvblR5cGUgPSBab2REaXNjcmltaW5hdGVkVW5pb24uY3JlYXRlO1xuY29uc3QgaW50ZXJzZWN0aW9uVHlwZSA9IFpvZEludGVyc2VjdGlvbi5jcmVhdGU7XG5jb25zdCB0dXBsZVR5cGUgPSBab2RUdXBsZS5jcmVhdGU7XG5jb25zdCByZWNvcmRUeXBlID0gWm9kUmVjb3JkLmNyZWF0ZTtcbmNvbnN0IG1hcFR5cGUgPSBab2RNYXAuY3JlYXRlO1xuY29uc3Qgc2V0VHlwZSA9IFpvZFNldC5jcmVhdGU7XG5jb25zdCBmdW5jdGlvblR5cGUgPSBab2RGdW5jdGlvbi5jcmVhdGU7XG5jb25zdCBsYXp5VHlwZSA9IFpvZExhenkuY3JlYXRlO1xuY29uc3QgbGl0ZXJhbFR5cGUgPSBab2RMaXRlcmFsLmNyZWF0ZTtcbmNvbnN0IGVudW1UeXBlID0gWm9kRW51bS5jcmVhdGU7XG5jb25zdCBuYXRpdmVFbnVtVHlwZSA9IFpvZE5hdGl2ZUVudW0uY3JlYXRlO1xuY29uc3QgcHJvbWlzZVR5cGUgPSBab2RQcm9taXNlLmNyZWF0ZTtcbmNvbnN0IGVmZmVjdHNUeXBlID0gWm9kRWZmZWN0cy5jcmVhdGU7XG5jb25zdCBvcHRpb25hbFR5cGUgPSBab2RPcHRpb25hbC5jcmVhdGU7XG5jb25zdCBudWxsYWJsZVR5cGUgPSBab2ROdWxsYWJsZS5jcmVhdGU7XG5jb25zdCBwcmVwcm9jZXNzVHlwZSA9IFpvZEVmZmVjdHMuY3JlYXRlV2l0aFByZXByb2Nlc3M7XG5jb25zdCBwaXBlbGluZVR5cGUgPSBab2RQaXBlbGluZS5jcmVhdGU7XG5jb25zdCBvc3RyaW5nID0gKCkgPT4gc3RyaW5nVHlwZSgpLm9wdGlvbmFsKCk7XG5jb25zdCBvbnVtYmVyID0gKCkgPT4gbnVtYmVyVHlwZSgpLm9wdGlvbmFsKCk7XG5jb25zdCBvYm9vbGVhbiA9ICgpID0+IGJvb2xlYW5UeXBlKCkub3B0aW9uYWwoKTtcbmV4cG9ydCBjb25zdCBjb2VyY2UgPSB7XG4gICAgc3RyaW5nOiAoKGFyZykgPT4gWm9kU3RyaW5nLmNyZWF0ZSh7IC4uLmFyZywgY29lcmNlOiB0cnVlIH0pKSxcbiAgICBudW1iZXI6ICgoYXJnKSA9PiBab2ROdW1iZXIuY3JlYXRlKHsgLi4uYXJnLCBjb2VyY2U6IHRydWUgfSkpLFxuICAgIGJvb2xlYW46ICgoYXJnKSA9PiBab2RCb29sZWFuLmNyZWF0ZSh7XG4gICAgICAgIC4uLmFyZyxcbiAgICAgICAgY29lcmNlOiB0cnVlLFxuICAgIH0pKSxcbiAgICBiaWdpbnQ6ICgoYXJnKSA9PiBab2RCaWdJbnQuY3JlYXRlKHsgLi4uYXJnLCBjb2VyY2U6IHRydWUgfSkpLFxuICAgIGRhdGU6ICgoYXJnKSA9PiBab2REYXRlLmNyZWF0ZSh7IC4uLmFyZywgY29lcmNlOiB0cnVlIH0pKSxcbn07XG5leHBvcnQgeyBhbnlUeXBlIGFzIGFueSwgYXJyYXlUeXBlIGFzIGFycmF5LCBiaWdJbnRUeXBlIGFzIGJpZ2ludCwgYm9vbGVhblR5cGUgYXMgYm9vbGVhbiwgZGF0ZVR5cGUgYXMgZGF0ZSwgZGlzY3JpbWluYXRlZFVuaW9uVHlwZSBhcyBkaXNjcmltaW5hdGVkVW5pb24sIGVmZmVjdHNUeXBlIGFzIGVmZmVjdCwgZW51bVR5cGUgYXMgZW51bSwgZnVuY3Rpb25UeXBlIGFzIGZ1bmN0aW9uLCBpbnN0YW5jZU9mVHlwZSBhcyBpbnN0YW5jZW9mLCBpbnRlcnNlY3Rpb25UeXBlIGFzIGludGVyc2VjdGlvbiwgbGF6eVR5cGUgYXMgbGF6eSwgbGl0ZXJhbFR5cGUgYXMgbGl0ZXJhbCwgbWFwVHlwZSBhcyBtYXAsIG5hblR5cGUgYXMgbmFuLCBuYXRpdmVFbnVtVHlwZSBhcyBuYXRpdmVFbnVtLCBuZXZlclR5cGUgYXMgbmV2ZXIsIG51bGxUeXBlIGFzIG51bGwsIG51bGxhYmxlVHlwZSBhcyBudWxsYWJsZSwgbnVtYmVyVHlwZSBhcyBudW1iZXIsIG9iamVjdFR5cGUgYXMgb2JqZWN0LCBvYm9vbGVhbiwgb251bWJlciwgb3B0aW9uYWxUeXBlIGFzIG9wdGlvbmFsLCBvc3RyaW5nLCBwaXBlbGluZVR5cGUgYXMgcGlwZWxpbmUsIHByZXByb2Nlc3NUeXBlIGFzIHByZXByb2Nlc3MsIHByb21pc2VUeXBlIGFzIHByb21pc2UsIHJlY29yZFR5cGUgYXMgcmVjb3JkLCBzZXRUeXBlIGFzIHNldCwgc3RyaWN0T2JqZWN0VHlwZSBhcyBzdHJpY3RPYmplY3QsIHN0cmluZ1R5cGUgYXMgc3RyaW5nLCBzeW1ib2xUeXBlIGFzIHN5bWJvbCwgZWZmZWN0c1R5cGUgYXMgdHJhbnNmb3JtZXIsIHR1cGxlVHlwZSBhcyB0dXBsZSwgdW5kZWZpbmVkVHlwZSBhcyB1bmRlZmluZWQsIHVuaW9uVHlwZSBhcyB1bmlvbiwgdW5rbm93blR5cGUgYXMgdW5rbm93biwgdm9pZFR5cGUgYXMgdm9pZCwgfTtcbmV4cG9ydCBjb25zdCBORVZFUiA9IElOVkFMSUQ7XG4iLCJpbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcblxuZXhwb3J0IGNvbnN0IEJCb3hTY2hlbWEgPSB6LnR1cGxlKFt6Lm51bWJlcigpLCB6Lm51bWJlcigpLCB6Lm51bWJlcigpLCB6Lm51bWJlcigpXSk7XG5cbmV4cG9ydCBjb25zdCBPcmlnaW5TY2hlbWEgPSB6LnN0cmluZygpLnJlZmluZSgodmFsKSA9PiB7XG4gIHJldHVybiAvXmh0dHBzPzpcXC9cXC9bYS16QS1aMC05Li1dKyg6XFxkKyk/JC8udGVzdCh2YWwpO1xufSwgeyBtZXNzYWdlOiAnT3JpZ2luIG11c3QgYmUgc2NoZW1lK2hvc3QrcG9ydCBvbmx5LCBubyBwYXRocyBvciB0cmFpbGluZyBzbGFzaGVzJyB9KTtcblxuZXhwb3J0IGNvbnN0IEZyYW1lSWRTY2hlbWEgPSB6LnN0cmluZygpO1xuXG5leHBvcnQgY29uc3QgU291cmNlU2NoZW1hID0gei5lbnVtKFsnRE9NJywgJ0FSSUEnLCAnVklTSU9OJywgJ09DUiddKTtcblxuZXhwb3J0IGNvbnN0IFNlbWFudGljVHlwZVNjaGVtYSA9IHouZW51bShbXG4gICdidXR0b24nLCAnaW5wdXQnLCAnY2hlY2tib3gnLCAnZHJvcGRvd24nLCAnbGluaycsICd0YWInLCAnbWVudScsICdkaWFsb2cnLFxuICAnY2hhcnQnLCAndGFibGUnLCAnY2FyZCcsICduYXZpZ2F0aW9uJywgJ2ltYWdlJywgJ3RleHQnLCAnY3VzdG9tX2NvbnRyb2wnLCAndW5rbm93bicsXG5dKTtcblxuZXhwb3J0IGNvbnN0IFZpc3VhbFN0YXRlU2NoZW1hID0gei5lbnVtKFtcbiAgJ2VuYWJsZWQnLCAnZGlzYWJsZWQnLCAnc2VsZWN0ZWQnLCAnZXhwYW5kZWQnLCAnY29sbGFwc2VkJyxcbiAgJ2ZvY3VzZWQnLCAnY2hlY2tlZCcsICd1bmNoZWNrZWQnLCAndmlzaWJsZScsXG5dKTtcblxuZXhwb3J0IGNvbnN0IFN0YWdlTmFtZVNjaGVtYSA9IHouZW51bShbXG4gICdjYXB0dXJlJywgJ2RvbScsICdyb3V0ZScsICd2aXNpb24nLCAnb2NyJywgJ2ZhY2UnLCAnZ3JvdW5kJywgJ2Z1c2UnLFxuICAncGlpJywgJ3JlZGFjdCcsICdmaXJld2FsbCcsICduZXR3b3JrJywgJ3NlcnZlcicsICd2YWxpZGF0ZScsICdleGVjdXRlJywgJ3NldHRsZScsXG5dKTtcblxuZXhwb3J0IGNvbnN0IFN0YWdlRXJyb3JDb2RlU2NoZW1hID0gei5lbnVtKFtcbiAgJ1ZJU0lPTl9VTkFWQUlMQUJMRScsICdQUklWQUNZX0JMT0NLJywgJ1BSSVZBQ1lfRVJST1InLCAnU0VSVkVSX1VOQVZBSUxBQkxFJyxcbiAgJ1NFUlZFUl9JTlZBTElEJywgJ1NUQUxFX1NUQVRFJywgJ09SSUdJTl9NSVNNQVRDSCcsICdGUkFNRV9NSVNNQVRDSCcsXG4gICdQT0xJQ1lfREVOSUVEJywgJ1RBUkdFVF9OT1RfRk9VTkQnLCAnTk9UX0lOVEVSQUNUQUJMRScsXG4gICdDQVBBQklMSVRZX0RFTklFRCcsICdURVhUX1VOU0FGRScsICdUSU1FT1VUJywgJ0lOVEVSTkFMJyxcbl0pO1xuXG5leHBvcnQgY29uc3QgU3RhZ2VFcnJvclNjaGVtYSA9IHoub2JqZWN0KHtcbiAgY29kZTogU3RhZ2VFcnJvckNvZGVTY2hlbWEsXG4gIHN0YWdlOiBTdGFnZU5hbWVTY2hlbWEsXG4gIG1lc3NhZ2U6IHouc3RyaW5nKCksXG4gIHJldHJ5YWJsZTogei5ib29sZWFuKCksXG4gIGRldGFpbDogei5yZWNvcmQoei51bmlvbihbei5zdHJpbmcoKSwgei5udW1iZXIoKSwgei5ib29sZWFuKCldKSkub3B0aW9uYWwoKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgY29uc3QgVGVsZW1ldHJ5RXZlbnRTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHRzOiB6Lm51bWJlcigpLFxuICBjeWNsZV9pZDogei5zdHJpbmcoKSxcbiAgc3RhZ2U6IFN0YWdlTmFtZVNjaGVtYSxcbiAgZHVyYXRpb25fbXM6IHoubnVtYmVyKCksXG4gIG1ldGE6IHoucmVjb3JkKHoudW5pb24oW3ouc3RyaW5nKCksIHoubnVtYmVyKCksIHouYm9vbGVhbigpXSkpLm9wdGlvbmFsKCksXG59KS5zdHJpY3QoKTtcblxuZXhwb3J0IGNvbnN0IEZyYW1lSW5mb1NjaGVtYSA9IHoub2JqZWN0KHtcbiAgZnJhbWVfaWQ6IEZyYW1lSWRTY2hlbWEsXG4gIHBhcmVudF9mcmFtZV9pZDogRnJhbWVJZFNjaGVtYS5udWxsYWJsZSgpLFxuICBvcmlnaW46IHouc3RyaW5nKCksXG4gIHBhdGg6IHouc3RyaW5nKCksXG4gIG9mZnNldDogei50dXBsZShbei5udW1iZXIoKSwgei5udW1iZXIoKV0pLFxuICBhY2Nlc3NpYmxlOiB6LmJvb2xlYW4oKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgY29uc3QgRG9tRWxlbWVudEluZm9TY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGRvbV9pZDogei5zdHJpbmcoKSxcbiAgZnJhbWVfaWQ6IEZyYW1lSWRTY2hlbWEsXG4gIG9yaWdpbjogei5zdHJpbmcoKSxcbiAgdGFnOiB6LnN0cmluZygpLFxuICByb2xlOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gIG5hbWU6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgdGV4dDogei5zdHJpbmcoKSxcbiAgYXJpYTogei5vYmplY3Qoe1xuICAgIGV4cGFuZGVkOiB6LmJvb2xlYW4oKS5vcHRpb25hbCgpLFxuICAgIGNoZWNrZWQ6IHoudW5pb24oW3ouYm9vbGVhbigpLCB6LmxpdGVyYWwoJ21peGVkJyldKS5vcHRpb25hbCgpLFxuICAgIGRpc2FibGVkOiB6LmJvb2xlYW4oKS5vcHRpb25hbCgpLFxuICAgIHNlbGVjdGVkOiB6LmJvb2xlYW4oKS5vcHRpb25hbCgpLFxuICAgIHByZXNzZWQ6IHouYm9vbGVhbigpLm9wdGlvbmFsKCksXG4gICAgaGlkZGVuOiB6LmJvb2xlYW4oKS5vcHRpb25hbCgpLFxuICB9KS5zdHJpY3QoKSxcbiAgaW5wdXQ6IHoub2JqZWN0KHtcbiAgICB0eXBlOiB6LnN0cmluZygpLFxuICAgIGF1dG9jb21wbGV0ZTogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxuICAgIG5hbWU6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgICBwbGFjZWhvbGRlcjogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxuICAgIGlzX3Bhc3N3b3JkOiB6LmJvb2xlYW4oKSxcbiAgICBoYXNfdmFsdWU6IHouYm9vbGVhbigpLFxuICAgIHZhbHVlOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gIH0pLnN0cmljdCgpLm9wdGlvbmFsKCksXG4gIGJib3g6IEJCb3hTY2hlbWEsXG4gIHZpc2libGU6IHouYm9vbGVhbigpLFxuICBpbl92aWV3cG9ydDogei5ib29sZWFuKCksXG4gIG9jY2x1ZGVkOiB6LmJvb2xlYW4oKSxcbiAgaW50ZXJhY3RhYmxlOiB6LmJvb2xlYW4oKSxcbiAgcmVuZGVyaW5nOiB6LmVudW0oW1xuICAgICdodG1sJywgJ2NhbnZhcycsICdzdmcnLCAnaW1nJywgJ3ZpZGVvJywgJ2lmcmFtZScsXG4gICAgJ3NoYWRvd19vcGVuJywgJ3NoYWRvd19jbG9zZWQnLCAnY3VzdG9tJyxcbiAgXSksXG4gIGhhc19iZ19pbWFnZTogei5ib29sZWFuKCksXG4gIGhhbmRsZXJzX2hpbnQ6IHouYm9vbGVhbigpLFxuICBwYXJlbnRfZG9tX2lkOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gIGNsYXNzZXM6IHouYXJyYXkoei5zdHJpbmcoKSkub3B0aW9uYWwoKSxcbiAgYXR0cmlidXRlczogei5yZWNvcmQoei5zdHJpbmcoKSkub3B0aW9uYWwoKSxcbiAgZWxlbWVudF9pZDogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gIGVsZW1lbnRfbmFtZTogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gIGxhYmVsOiB6LnN0cmluZygpLm51bGxhYmxlKCkub3B0aW9uYWwoKSxcbiAgZGVzY3JpcHRpb246IHouc3RyaW5nKCkubnVsbGFibGUoKS5vcHRpb25hbCgpLFxuICBhcmlhX2xhYmVsOiB6LnN0cmluZygpLm51bGxhYmxlKCkub3B0aW9uYWwoKSxcbiAgYXJpYV9sYWJlbGxlZGJ5OiB6LnN0cmluZygpLm51bGxhYmxlKCkub3B0aW9uYWwoKSxcbiAgYXJpYV9kZXNjcmliZWRieTogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gIGZvcm1faWQ6IHouc3RyaW5nKCkubnVsbGFibGUoKS5vcHRpb25hbCgpLFxuICBzdGFibGVfc2VsZWN0b3I6IHouc3RyaW5nKCkubnVsbGFibGUoKS5vcHRpb25hbCgpLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCBjb25zdCBEb21TbmFwc2hvdFNjaGVtYSA9IHoub2JqZWN0KHtcbiAgc25hcHNob3RfaWQ6IHouc3RyaW5nKCksXG4gIHVybF9vcmlnaW46IHouc3RyaW5nKCksXG4gIHVybF9wYXRoOiB6LnN0cmluZygpLFxuICBmcmFtZXM6IHouYXJyYXkoRnJhbWVJbmZvU2NoZW1hKSxcbiAgZWxlbWVudHM6IHouYXJyYXkoRG9tRWxlbWVudEluZm9TY2hlbWEpLFxuICB2aWV3cG9ydDogei5vYmplY3QoeyB3OiB6Lm51bWJlcigpLCBoOiB6Lm51bWJlcigpIH0pLnN0cmljdCgpLFxuICBkcHI6IHoubnVtYmVyKCksXG4gIHNjcm9sbDogei5vYmplY3QoeyB4OiB6Lm51bWJlcigpLCB5OiB6Lm51bWJlcigpIH0pLnN0cmljdCgpLFxuICBwYWdlX3N0YXRlX2hhc2g6IHouc3RyaW5nKCksXG4gIHRzOiB6Lm51bWJlcigpLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCBjb25zdCBSb3V0aW5nTGV2ZWxTY2hlbWEgPSB6LmVudW0oWydISUdIJywgJ01FRElVTScsICdMT1cnXSk7XG5leHBvcnQgY29uc3QgVmlzaW9uVGFza1NjaGVtYSA9IHouZW51bShbJ29jcicsICd1aV9kZXRlY3QnLCAnZmFjZScsICdncm91bmQnXSk7XG5leHBvcnQgY29uc3QgQnVkZ2V0TGV2ZWxTY2hlbWEgPSB6LmVudW0oWydISUdIJywgJ01FRElVTScsICdMT1cnXSk7XG5cbmV4cG9ydCBjb25zdCBCdWRnZXRTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGxldmVsOiBCdWRnZXRMZXZlbFNjaGVtYSxcbiAgYmFja2VuZDogei5lbnVtKFsnd2ViZ3B1JywgJ3dlYmdsJywgJ3dhc20nLCAnbm9uZSddKSxcbiAgbWF4X3Zpc2lvbl9yZWdpb25zOiB6Lm51bWJlcigpLFxuICBtYXhfcGl4ZWxzOiB6Lm51bWJlcigpLFxuICBhbGxvd19kZXRlY3Rvcjogei5ib29sZWFuKCksXG4gIG9jcl9tb2RlOiB6LmVudW0oWydvZmYnLCAnZmFzdCcsICdoaWdoX3JlY2FsbCddKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgY29uc3QgUm91dGluZ0RlY2lzaW9uU2NoZW1hID0gei5vYmplY3Qoe1xuICByZWdpb25fa2V5OiB6LnN0cmluZygpLFxuICBkb21faWQ6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgbGV2ZWw6IFJvdXRpbmdMZXZlbFNjaGVtYSxcbiAgcmVhc29uczogei5hcnJheSh6LnN0cmluZygpKSxcbiAgY3JvcDogQkJveFNjaGVtYS5udWxsYWJsZSgpLFxuICBuZWVkczogei5hcnJheShWaXNpb25UYXNrU2NoZW1hKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgY29uc3QgUm91dGluZ1BsYW5TY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHNuYXBzaG90X2lkOiB6LnN0cmluZygpLFxuICBwYWdlX3N0YXRlX2hhc2g6IHouc3RyaW5nKCksXG4gIGRlY2lzaW9uczogei5hcnJheShSb3V0aW5nRGVjaXNpb25TY2hlbWEpLFxuICBuZWVkc19zY3JlZW5zaG90OiB6LmJvb2xlYW4oKSxcbiAgYnVkZ2V0OiBCdWRnZXRTY2hlbWEsXG59KS5zdHJpY3QoKTtcblxuZXhwb3J0IGNvbnN0IENhcHR1cmVNZXRhU2NoZW1hID0gei5vYmplY3Qoe1xuICBjYXB0dXJlX2lkOiB6LnN0cmluZygpLFxuICBwYWdlX3N0YXRlX2hhc2g6IHouc3RyaW5nKCksXG4gIGRwcjogei5udW1iZXIoKSxcbiAgdmlld3BvcnQ6IHoub2JqZWN0KHsgdzogei5udW1iZXIoKSwgaDogei5udW1iZXIoKSB9KS5zdHJpY3QoKSxcbiAgc2Nyb2xsOiB6Lm9iamVjdCh7IHg6IHoubnVtYmVyKCksIHk6IHoubnVtYmVyKCkgfSkuc3RyaWN0KCksXG4gIGltYWdlOiB6Lm9iamVjdCh7IHc6IHoubnVtYmVyKCksIGg6IHoubnVtYmVyKCkgfSkuc3RyaWN0KCksXG4gIHRzOiB6Lm51bWJlcigpLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCBjb25zdCBPY3JUb2tlblNjaGVtYSA9IHoub2JqZWN0KHtcbiAgdGV4dDogei5zdHJpbmcoKSxcbiAgYmJveDogQkJveFNjaGVtYSxcbiAgY29uZmlkZW5jZTogei5udW1iZXIoKSxcbiAgbGluZV9pZDogei5udW1iZXIoKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgY29uc3QgRmFjZUJveFNjaGVtYSA9IHoub2JqZWN0KHtcbiAgYmJveDogQkJveFNjaGVtYSxcbiAgY29uZmlkZW5jZTogei5udW1iZXIoKSxcbiAgY29vcmRpbmF0ZVNwYWNlOiB6LmxpdGVyYWwoJ2ZyYW1lJyksXG59KS5zdHJpY3QoKTtcblxuZXhwb3J0IGNvbnN0IFBpaVR5cGVTY2hlbWEgPSB6LmVudW0oW1xuICAnRU1BSUwnLCAnUEhPTkUnLCAnUEVSU09OJywgJ0FERFJFU1MnLCAnRE9CJywgJ0NBUkQnLCAnUEFTU1dPUkQnLFxuICAnQVVUSF9UT0tFTicsICdHT1ZfSUQnLCAnQkFOS19BQ0NPVU5UJywgJ0ZBQ0UnLCAnSURFTlRJRklFUicsXG5dKTtcblxuZXhwb3J0IGNvbnN0IENhcGFiaWxpdHlEZXNjcmlwdG9yU2NoZW1hID0gei5vYmplY3Qoe1xuICByZWY6IHouc3RyaW5nKCksXG4gIGtpbmQ6IHouZW51bShbJ3Bhc3N3b3JkJywgJ2VtYWlsJywgJ3Bob25lJywgJ3Rva2VuJywgJ3Byb2ZpbGUnXSksXG4gIGxhYmVsOiB6LnN0cmluZygpLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCBjb25zdCBBY3Rpb25UeXBlU2NoZW1hID0gei5lbnVtKFtcbiAgJ2NsaWNrJywgJ3Njcm9sbCcsICdmb2N1cycsICdzZWxlY3QnLCAndHlwZScsICdrZXlwcmVzcycsICdmaWxsX3NlY3JldCcsICduYXZpZ2F0ZScsICdiYWNrJ1xuXSk7XG5cbmV4cG9ydCBjb25zdCBTdGVwU3VtbWFyeVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgc3RlcDogei5udW1iZXIoKSxcbiAgYWN0aW9uOiBBY3Rpb25UeXBlU2NoZW1hLFxuICB0YXJnZXRfcmVnaW9uX2lkOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gIHJlc3VsdDogei5lbnVtKFsnb2snLCAnYmxvY2tlZCcsICdmYWlsZWQnXSksXG4gIG5vdGU6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgY29uc3QgQWN0aW9uUGFyYW1zU2NoZW1hID0gei5vYmplY3Qoe1xuICB0ZXh0OiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG4gIG9wdGlvbjogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICBrZXk6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgZGlyZWN0aW9uOiB6LmVudW0oWyd1cCcsICdkb3duJywgJ2xlZnQnLCAncmlnaHQnXSkub3B0aW9uYWwoKSxcbiAgYW1vdW50OiB6Lm51bWJlcigpLm9wdGlvbmFsKCksXG59KS5zdHJpY3QoKTtcblxuZXhwb3J0IGNvbnN0IFN0cnVjdHVyZWRBY3Rpb25TY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGFjdGlvbl9pZDogei5zdHJpbmcoKSxcbiAgcmVxdWVzdF9pZDogei5zdHJpbmcoKSxcbiAgYWN0aW9uOiBBY3Rpb25UeXBlU2NoZW1hLFxuICB0YXJnZXQ6IHoub2JqZWN0KHsgcmVnaW9uX2lkOiB6LnN0cmluZygpIH0pLnN0cmljdCgpLm51bGxhYmxlKCksXG4gIHBhcmFtczogQWN0aW9uUGFyYW1zU2NoZW1hLm51bGxhYmxlKCksXG4gIGNhcGFiaWxpdHk6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgb3JpZ2luOiB6LnN0cmluZygpLFxuICBmcmFtZV9pZDogRnJhbWVJZFNjaGVtYSxcbiAgcGFnZV9zdGF0ZV9oYXNoOiB6LnN0cmluZygpLFxuICByYXRpb25hbGU6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgY29uc3QgUGxhblJlc3BvbnNlU2NoZW1hID0gei5vYmplY3Qoe1xuICByZXF1ZXN0X2lkOiB6LnN0cmluZygpLFxuICBzdGF0dXM6IHouZW51bShbJ2FjdGlvbicsICdkb25lJywgJ25lZWRfdXNlcicsICdmYWlsJ10pLFxuICBhY3Rpb246IFN0cnVjdHVyZWRBY3Rpb25TY2hlbWEubnVsbGFibGUoKSxcbiAgbWVzc2FnZTogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxuICB1c2FnZTogei5vYmplY3Qoe1xuICAgIHNlcnZlcl9tczogei5udW1iZXIoKSxcbiAgICBtb2RlbDogei5zdHJpbmcoKSxcbiAgfSkuc3RyaWN0KCksXG59KS5zdHJpY3QoKTtcblxuZXhwb3J0IGNvbnN0IFNhbml0aXplZFJlZ2lvblNjaGVtYSA9IHoub2JqZWN0KHtcbiAgcmVnaW9uX2lkOiB6LnN0cmluZygpLFxuICB0eXBlOiBTZW1hbnRpY1R5cGVTY2hlbWEsXG4gIHRleHQ6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgYmJveDogQkJveFNjaGVtYSxcbiAgc3RhdGU6IHouYXJyYXkoVmlzdWFsU3RhdGVTY2hlbWEpLFxuICBpbnRlcmFjdGFibGU6IHouYm9vbGVhbigpLFxuICBmcmFtZV9pZDogRnJhbWVJZFNjaGVtYSxcbiAgc291cmNlczogei5hcnJheShTb3VyY2VTY2hlbWEpLFxuICBjb25maWRlbmNlOiB6Lm51bWJlcigpLFxuICByZWxhdGlvbnM6IHouYXJyYXkoei5vYmplY3QoeyByZWw6IHouc3RyaW5nKCksIHRhcmdldDogei5zdHJpbmcoKSB9KS5zdHJpY3QoKSkub3B0aW9uYWwoKSxcbiAgdHJ1c3Q6IHoubGl0ZXJhbCgndW50cnVzdGVkJyksXG59KS5zdHJpY3QoKTtcblxuZXhwb3J0IGNvbnN0IFNhbml0aXplZENvbnRleHRTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHNjaGVtYV92ZXJzaW9uOiB6LmxpdGVyYWwoJzEuMCcpLFxuICByZXF1ZXN0X2lkOiB6LnN0cmluZygpLFxuICB0YXNrX2lkOiB6LnN0cmluZygpLFxuICBzdGVwX2luZGV4OiB6Lm51bWJlcigpLFxuICB0YXNrOiB6LnN0cmluZygpLFxuICBwYWdlOiB6Lm9iamVjdCh7XG4gICAgb3JpZ2luOiB6LnN0cmluZygpLFxuICAgIHBhdGg6IHouc3RyaW5nKCksXG4gICAgdGl0bGU6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgICBwYWdlX3N0YXRlX2hhc2g6IHouc3RyaW5nKCksXG4gICAgdmlld3BvcnQ6IHoub2JqZWN0KHsgdzogei5udW1iZXIoKSwgaDogei5udW1iZXIoKSB9KS5zdHJpY3QoKSxcbiAgICBmcmFtZV9pZHM6IHouYXJyYXkoRnJhbWVJZFNjaGVtYSksXG4gIH0pLnN0cmljdCgpLFxuICByZWdpb25zOiB6LmFycmF5KFNhbml0aXplZFJlZ2lvblNjaGVtYSksXG4gIGNhcGFiaWxpdGllczogei5hcnJheShDYXBhYmlsaXR5RGVzY3JpcHRvclNjaGVtYSksXG4gIHJlZGFjdGlvbnM6IHouYXJyYXkoei5vYmplY3Qoe1xuICAgIHR5cGU6IFBpaVR5cGVTY2hlbWEsXG4gICAgY291bnQ6IHoubnVtYmVyKCksXG4gIH0pLnN0cmljdCgpKSxcbiAgaW1hZ2U6IHoub2JqZWN0KHtcbiAgICBtaW1lOiB6LmxpdGVyYWwoJ2ltYWdlL2pwZWcnKSxcbiAgICBkYXRhX2Jhc2U2NDogei5zdHJpbmcoKSxcbiAgICB3aWR0aDogei5udW1iZXIoKSxcbiAgICBoZWlnaHQ6IHoubnVtYmVyKCksXG4gICAgY292ZXJzX3JlZ2lvbl9pZHM6IHouYXJyYXkoei5zdHJpbmcoKSksXG4gIH0pLnN0cmljdCgpLm51bGxhYmxlKCksXG4gIGhpc3Rvcnk6IHouYXJyYXkoU3RlcFN1bW1hcnlTY2hlbWEpLFxuICBmbGFnczogei5vYmplY3Qoe1xuICAgIGluamVjdGlvbl9zdXNwZWN0ZWRfcmVnaW9uX2lkczogei5hcnJheSh6LnN0cmluZygpKSxcbiAgfSkuc3RyaWN0KCksXG59KS5zdHJpY3QoKTtcblxuZXhwb3J0IGNvbnN0IEF0dGVzdGVkUGF5bG9hZFNjaGVtYSA9IHoub2JqZWN0KHtcbiAgcmVxdWVzdF9pZDogei5zdHJpbmcoKSxcbiAgYm9keTogei5zdHJpbmcoKSxcbiAgc2hhMjU2OiB6LnN0cmluZygpLmxlbmd0aCg2NCksXG4gIGlzc3VlZF9hdDogei5udW1iZXIoKSxcbn0pLnN0cmljdCgpO1xuIiwiaW1wb3J0IHR5cGUgeyBCdXNSZXNwb25zZSwgTWVzc2FnZU1hcCwgTWVzc2FnZVR5cGUgfSBmcm9tICcuL21lc3NhZ2VzLmpzJztcbmltcG9ydCB7IHN0YWdlRXJyb3IgfSBmcm9tICcuL2NvbW1vbi5qcyc7XG5cbmZ1bmN0aW9uIGdldENocm9tZSgpOiB0eXBlb2YgY2hyb21lIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHR5cGVvZiBjaHJvbWUgIT09ICd1bmRlZmluZWQnICYmIGNocm9tZS5ydW50aW1lKSB7XG4gICAgcmV0dXJuIGNocm9tZTtcbiAgfVxuICBpZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnICYmIChnbG9iYWxUaGlzIGFzIGFueSkuY2hyb21lPy5ydW50aW1lKSB7XG4gICAgcmV0dXJuIChnbG9iYWxUaGlzIGFzIGFueSkuY2hyb21lO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbnR5cGUgSGFuZGxlcjxUIGV4dGVuZHMgTWVzc2FnZVR5cGU+ID0gKFxuICBwYXlsb2FkOiBNZXNzYWdlTWFwW1RdWydwYXlsb2FkJ10sXG4gIHNlbmRlcj86IGFueVxuKSA9PiBQcm9taXNlPE1lc3NhZ2VNYXBbVF1bJ3Jlc3BvbnNlJ10+IHwgTWVzc2FnZU1hcFtUXVsncmVzcG9uc2UnXTtcblxuLy8gUmVnaXN0cnkgZm9yIGhhbmRsZXJzIGluIGV4dGVuc2lvbiByZWFsbVxuY29uc3QgY2hyb21lSGFuZGxlcnMgPSBuZXcgTWFwPHN0cmluZywgQXJyYXk8SGFuZGxlcjxhbnk+Pj4oKTtcbmxldCBnbG9iYWxMaXN0ZW5lckF0dGFjaGVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGVuc3VyZUdsb2JhbE1lc3NhZ2VMaXN0ZW5lcihleHQ6IHR5cGVvZiBjaHJvbWUpIHtcbiAgaWYgKGdsb2JhbExpc3RlbmVyQXR0YWNoZWQpIHJldHVybjtcbiAgZ2xvYmFsTGlzdGVuZXJBdHRhY2hlZCA9IHRydWU7XG5cbiAgZXh0LnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKFxuICAgIChtZXNzYWdlOiBhbnksIHNlbmRlcjogYW55LCBzZW5kUmVzcG9uc2U6IChyZXM6IEJ1c1Jlc3BvbnNlPGFueT4pID0+IHZvaWQpID0+IHtcbiAgICAgIGlmICghbWVzc2FnZSB8fCB0eXBlb2YgbWVzc2FnZS50eXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGhhbmRsZXJzID0gY2hyb21lSGFuZGxlcnMuZ2V0KG1lc3NhZ2UudHlwZSk7XG4gICAgICBpZiAoaGFuZGxlcnMgJiYgaGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgICAgIC50aGVuKCgpID0+IGhhbmRsZXJzWzBdIShtZXNzYWdlLnBheWxvYWQsIHNlbmRlcikpXG4gICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IG9rOiB0cnVlLCBkYXRhIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICAgIC8vIE1lc3NhZ2UgY2hhbm5lbCBtYXkgaGF2ZSBjbG9zZWQgYmVmb3JlIHJlc3BvbnNlIHdhcyBzZW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXJyb3IgPVxuICAgICAgICAgICAgICBlcnI/LmNvZGUgJiYgZXJyPy5zdGFnZVxuICAgICAgICAgICAgICAgID8gZXJyXG4gICAgICAgICAgICAgICAgOiBzdGFnZUVycm9yKCdJTlRFUk5BTCcsICdkb20nLCBlcnI/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVycikpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgb2s6IGZhbHNlLCBlcnJvciB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAvLyBNZXNzYWdlIGNoYW5uZWwgbWF5IGhhdmUgY2xvc2VkIGJlZm9yZSByZXNwb25zZSB3YXMgc2VudFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gS2VlcCBtZXNzYWdlIGNoYW5uZWwgb3BlbiBmb3IgYXN5bmNocm9ub3VzIHNlbmRSZXNwb25zZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICApO1xufVxuXG4vLyBJbi1tZW1vcnkgYnVzIGZhbGxiYWNrIGZvciB0ZXN0aW5nL25vZGUgZW52aXJvbm1lbnRzXG5jb25zdCBsb2NhbEhhbmRsZXJzID0gbmV3IE1hcDxzdHJpbmcsIEFycmF5PChwYXlsb2FkOiBhbnkpID0+IFByb21pc2U8YW55PiB8IGFueT4+KCk7XG5cbmV4cG9ydCBjb25zdCBidXMgPSB7XG4gIC8qKlxuICAgKiBTZW5kIGEgdHlwZWQgbWVzc2FnZSBhY3Jvc3MgcmVhbG1zIChvciBsb2NhbGx5IGlmIGluIHRlc3Qvbm9kZSkuXG4gICAqL1xuICBhc3luYyBzZW5kPFQgZXh0ZW5kcyBNZXNzYWdlVHlwZT4oXG4gICAgdHlwZTogVCxcbiAgICBwYXlsb2FkOiBNZXNzYWdlTWFwW1RdWydwYXlsb2FkJ10sXG4gICAgb3B0aW9ucz86IHsgdGFiSWQ/OiBudW1iZXI7IGZyYW1lSWQ/OiBudW1iZXI7IHRpbWVvdXRNcz86IG51bWJlciB9XG4gICk6IFByb21pc2U8QnVzUmVzcG9uc2U8TWVzc2FnZU1hcFtUXVsncmVzcG9uc2UnXT4+IHtcbiAgICBjb25zdCBtZXNzYWdlID0geyB0eXBlLCBwYXlsb2FkIH07XG4gICAgY29uc3QgZXh0ID0gZ2V0Q2hyb21lKCk7XG4gICAgY29uc3QgdGltZW91dE1zID0gb3B0aW9ucz8udGltZW91dE1zIHx8ICh0eXBlID09PSAndmlzaW9uL3BlcmNlaXZlJyA/IDEwMDAwIDogNTAwMCk7XG5cbiAgICAvLyAxLiBDaHJvbWUgZXh0ZW5zaW9uIGVudmlyb25tZW50XG4gICAgaWYgKGV4dCAmJiBleHQucnVudGltZT8uc2VuZE1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBsZXQgc2V0dGxlZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmICghc2V0dGxlZCkge1xuICAgICAgICAgICAgc2V0dGxlZCA9IHRydWU7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgICBlcnJvcjogc3RhZ2VFcnJvcignVElNRU9VVCcsICdkb20nLCBgTWVzc2FnZSBcIiR7dHlwZX1cIiB0aW1lZCBvdXQgYWZ0ZXIgJHt0aW1lb3V0TXN9bXNgKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGltZW91dE1zKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gKHJlczogQnVzUmVzcG9uc2U8TWVzc2FnZU1hcFtUXVsncmVzcG9uc2UnXT4gfCB1bmRlZmluZWQpID0+IHtcbiAgICAgICAgICAgIC8vIEFMV0FZUyBhY2Nlc3MgZXh0LnJ1bnRpbWUubGFzdEVycm9yIGZpcnN0IHNvIENocm9tZSBrbm93cyBpdCB3YXMgaW5zcGVjdGVkLlxuICAgICAgICAgICAgLy8gVGhpcyBwcmV2ZW50cyBcIlVuY2hlY2tlZCBydW50aW1lLmxhc3RFcnJvcjogQSBsaXN0ZW5lciBpbmRpY2F0ZWQgYW4gYXN5bmNocm9ub3VzIHJlc3BvbnNlLi4uXCJcbiAgICAgICAgICAgIGNvbnN0IGxhc3RFcnJvciA9IGV4dC5ydW50aW1lLmxhc3RFcnJvcjtcblxuICAgICAgICAgICAgaWYgKHNldHRsZWQpIHJldHVybjtcbiAgICAgICAgICAgIHNldHRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcblxuICAgICAgICAgICAgaWYgKGxhc3RFcnJvcikge1xuICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IHN0YWdlRXJyb3IoXG4gICAgICAgICAgICAgICAgICAnSU5URVJOQUwnLFxuICAgICAgICAgICAgICAgICAgJ2RvbScsXG4gICAgICAgICAgICAgICAgICBsYXN0RXJyb3IubWVzc2FnZSB8fCAnVW5rbm93biBydW50aW1lIGVycm9yJ1xuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IHN0YWdlRXJyb3IoJ0lOVEVSTkFMJywgJ2RvbScsIGBObyByZXNwb25zZSBmcm9tIGhhbmRsZXIgZm9yIG1lc3NhZ2UgXCIke3R5cGV9XCJgKSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc29sdmUocmVzKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKG9wdGlvbnM/LnRhYklkICYmIG9wdGlvbnMudGFiSWQgPiAwICYmIGV4dC50YWJzPy5zZW5kTWVzc2FnZSkge1xuICAgICAgICAgICAgLy8gRGVmYXVsdCB0byB0b3AgZnJhbWUgKGZyYW1lSWQ6IDApIHdoZW4gZnJhbWVJZCBpcyBvbWl0dGVkIHRvIHByZXZlbnQgYnJvYWRjYXN0aW5nIHRvIGFsbFxuICAgICAgICAgICAgLy8gc3ViZnJhbWVzL2lmcmFtZXMgd2hpY2ggY2F1c2VzIFwibWVzc2FnZSBjaGFubmVsIGNsb3NlZCBiZWZvcmUgYSByZXNwb25zZSB3YXMgcmVjZWl2ZWRcIi5cbiAgICAgICAgICAgIGNvbnN0IGZyYW1lSWQgPSBvcHRpb25zLmZyYW1lSWQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuZnJhbWVJZCA6IDA7XG4gICAgICAgICAgICBleHQudGFicy5zZW5kTWVzc2FnZShvcHRpb25zLnRhYklkLCBtZXNzYWdlLCB7IGZyYW1lSWQgfSwgY2FsbGJhY2spO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHQucnVudGltZS5zZW5kTWVzc2FnZShtZXNzYWdlLCBjYWxsYmFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBpZiAoIXNldHRsZWQpIHtcbiAgICAgICAgICAgIHNldHRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgIGVycm9yOiBzdGFnZUVycm9yKCdJTlRFUk5BTCcsICdkb20nLCBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogU3RyaW5nKGVycikpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAyLiBOb2RlIC8gdGVzdCBlbnZpcm9ubWVudCBmYWxsYmFja1xuICAgIGNvbnN0IGhhbmRsZXJzID0gbG9jYWxIYW5kbGVycy5nZXQodHlwZSk7XG4gICAgaWYgKCFoYW5kbGVycyB8fCBoYW5kbGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IHN0YWdlRXJyb3IoJ0lOVEVSTkFMJywgJ2RvbScsIGBObyBsb2NhbCBoYW5kbGVyIHJlZ2lzdGVyZWQgZm9yIFwiJHt0eXBlfVwiYCksXG4gICAgICB9O1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgaGFuZGxlcnNbMF0hKHBheWxvYWQpO1xuICAgICAgcmV0dXJuIHsgb2s6IHRydWUsIGRhdGEgfTtcbiAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICBlcnJvcjogZXJyLmNvZGUgJiYgZXJyLnN0YWdlID8gZXJyIDogc3RhZ2VFcnJvcignSU5URVJOQUwnLCAnZG9tJywgZXJyLm1lc3NhZ2UgfHwgU3RyaW5nKGVycikpLFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgdHlwZWQgbWVzc2FnZSBsaXN0ZW5lci5cbiAgICovXG4gIG9uPFQgZXh0ZW5kcyBNZXNzYWdlVHlwZT4odHlwZTogVCwgaGFuZGxlcjogSGFuZGxlcjxUPik6ICgpID0+IHZvaWQge1xuICAgIGNvbnN0IGV4dCA9IGdldENocm9tZSgpO1xuICAgIGlmIChleHQgJiYgZXh0LnJ1bnRpbWU/Lm9uTWVzc2FnZSkge1xuICAgICAgZW5zdXJlR2xvYmFsTWVzc2FnZUxpc3RlbmVyKGV4dCk7XG5cbiAgICAgIGNvbnN0IGxpc3QgPSBjaHJvbWVIYW5kbGVycy5nZXQodHlwZSkgfHwgW107XG4gICAgICBsaXN0LnB1c2goaGFuZGxlcik7XG4gICAgICBjaHJvbWVIYW5kbGVycy5zZXQodHlwZSwgbGlzdCk7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gY2hyb21lSGFuZGxlcnMuZ2V0KHR5cGUpIHx8IFtdO1xuICAgICAgICBjb25zdCBmaWx0ZXJlZCA9IGV4aXN0aW5nLmZpbHRlcigoaCkgPT4gaCAhPT0gaGFuZGxlcik7XG4gICAgICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY2hyb21lSGFuZGxlcnMuc2V0KHR5cGUsIGZpbHRlcmVkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaHJvbWVIYW5kbGVycy5kZWxldGUodHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gTm9kZSAvIHRlc3QgZW52aXJvbm1lbnRcbiAgICBjb25zdCBsaXN0ID0gbG9jYWxIYW5kbGVycy5nZXQodHlwZSkgfHwgW107XG4gICAgbGlzdC5wdXNoKGhhbmRsZXIpO1xuICAgIGxvY2FsSGFuZGxlcnMuc2V0KHR5cGUsIGxpc3QpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nID0gbG9jYWxIYW5kbGVycy5nZXQodHlwZSkgfHwgW107XG4gICAgICBjb25zdCBmaWx0ZXJlZCA9IGV4aXN0aW5nLmZpbHRlcigoaCkgPT4gaCAhPT0gaGFuZGxlcik7XG4gICAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgICBsb2NhbEhhbmRsZXJzLnNldCh0eXBlLCBmaWx0ZXJlZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2NhbEhhbmRsZXJzLmRlbGV0ZSh0eXBlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYWxsIGxvY2FsIHRlc3QgaGFuZGxlcnMgKGZvciB0ZXN0cykuXG4gICAqL1xuICBfY2xlYXJMb2NhbEhhbmRsZXJzKCkge1xuICAgIGxvY2FsSGFuZGxlcnMuY2xlYXIoKTtcbiAgICBjaHJvbWVIYW5kbGVycy5jbGVhcigpO1xuICB9LFxufTtcbiIsImltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuXG4vKipcbiAqIFBoYXNlIDI6IEFjdGlvbiBWYWxpZGF0b3IgQ29udHJhY3RcbiAqIFxuICogRm9ybWFsIHNwZWNpZmljYXRpb24gZm9yIGluY29taW5nIEFJIEFnZW50IChCcm93c2VyT1MgLyBNQ1ApIGFjdGlvbiByZXF1ZXN0cyxcbiAqIHRhcmdldCBpZGVudGl0eSB2YWxpZGF0aW9uLCBvYnNlcnZhdGlvbiBmcmVzaG5lc3MgdHJhY2tpbmcsIGFuZCB2YWxpZGF0aW9uIHZlcmRpY3RzLlxuICogXG4gKiBDUklUSUNBTCBSVUxFOiBUaGlzIGNvbnRyYWN0IGRlZmluZXMgdGhlIHNjaGVtYSBhbmQgc2VjdXJpdHkgdmFsaWRhdGlvbiBydWxlcy5cbiAqIEl0IGRvZXMgTk9UIGV4ZWN1dGUgYnJvd3NlciBhY3Rpb25zIGFuZCBkb2VzIE5PVCBpbnRlcmFjdCB3aXRoIHRoZSBwcml2YWN5L21hc2tpbmcgcGlwZWxpbmUuXG4gKi9cblxuLy8gMS4gU3VwcG9ydGVkIEFjdGlvbiBUeXBlcyAoTVZQIFNjb3BlKVxuZXhwb3J0IGNvbnN0IFNVUFBPUlRFRF9BQ1RJT05fVFlQRVMgPSBbXG4gICdjbGljaycsXG4gICd0eXBlJyxcbiAgJ3Njcm9sbCcsXG4gICdrZXlwcmVzcycsXG4gICdmb2N1cycsXG4gICdzZWxlY3QnLFxuICAnZmlsbF9zZWNyZXQnLFxuXSBhcyBjb25zdDtcblxuZXhwb3J0IHR5cGUgU3VwcG9ydGVkQWN0aW9uVHlwZSA9IHR5cGVvZiBTVVBQT1JURURfQUNUSU9OX1RZUEVTW251bWJlcl07XG5cbmV4cG9ydCBjb25zdCBTdXBwb3J0ZWRBY3Rpb25UeXBlU2NoZW1hID0gei5lbnVtKFNVUFBPUlRFRF9BQ1RJT05fVFlQRVMpO1xuXG4vLyAyLiBQcm9oaWJpdGVkIGNvZGUgZXhlY3V0aW9uIHBhdHRlcm5zIChTY3JpcHQgaW5qZWN0aW9uIC8gZXZhbCBwcmV2ZW50aW9uKVxuY29uc3QgRk9SQklEREVOX1RFWFRfUEFUVEVSTlMgPSBbXG4gIC9qYXZhc2NyaXB0Oi9pLFxuICAvPHNjcmlwdFtcXHM+XS9pLFxuICAvXFxiZXZhbFxccypcXCgvaSxcbiAgL1xcYkZ1bmN0aW9uXFxzKlxcKC9pLFxuICAvXFxid2luZG93XFwuZXhlY1NjcmlwdFxcYi9pLFxuXTtcblxuLy8gU2FmZSBzdHJpbmcgcGFyYW1ldGVyIHZhbGlkYXRvciByZWplY3RpbmcgY29kZSBpbmplY3Rpb25cbmV4cG9ydCBjb25zdCBTYWZlVGV4dFBhcmFtU2NoZW1hID0gei5zdHJpbmcoKS5zdXBlclJlZmluZSgodmFsLCBjdHgpID0+IHtcbiAgZm9yIChjb25zdCBwYXR0ZXJuIG9mIEZPUkJJRERFTl9URVhUX1BBVFRFUk5TKSB7XG4gICAgaWYgKHBhdHRlcm4udGVzdCh2YWwpKSB7XG4gICAgICBjdHguYWRkSXNzdWUoe1xuICAgICAgICBjb2RlOiB6LlpvZElzc3VlQ29kZS5jdXN0b20sXG4gICAgICAgIG1lc3NhZ2U6IGBGb3JiaWRkZW4gc2NyaXB0IGluamVjdGlvbiBwYXR0ZXJuIGRldGVjdGVkOiAke3BhdHRlcm4uc291cmNlfWAsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyAzLiBBY3Rpb24gUGFyYW1ldGVycyBTY2hlbWFcbmV4cG9ydCBjb25zdCBBY3Rpb25QYXJhbXNTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHRleHQ6IFNhZmVUZXh0UGFyYW1TY2hlbWEub3B0aW9uYWwoKSxcbiAga2V5OiB6LnN0cmluZygpLm1pbigxKS5tYXgoNTApLm9wdGlvbmFsKCksXG4gIGRpcmVjdGlvbjogei5lbnVtKFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J10pLm9wdGlvbmFsKCksXG4gIGFtb3VudDogei5udW1iZXIoKS5pbnQoKS5taW4oMSkubWF4KDEwMDAwKS5vcHRpb25hbCgpLFxuICBvcHRpb246IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbn0pLnN0cmljdCgpLm9wdGlvbmFsKCkubnVsbGFibGUoKTtcblxuZXhwb3J0IHR5cGUgQWN0aW9uUGFyYW1zID0gei5pbmZlcjx0eXBlb2YgQWN0aW9uUGFyYW1zU2NoZW1hPjtcblxuLy8gNC4gQWN0aW9uIFRhcmdldCBTY2hlbWFcbmV4cG9ydCBjb25zdCBBY3Rpb25UYXJnZXRTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHRhcmdldF9pZDogei5zdHJpbmcoKS5taW4oMSwgJ3RhcmdldF9pZCBjYW5ub3QgYmUgZW1wdHknKSxcbiAgcm9sZTogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICBsYWJlbDogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCB0eXBlIEFjdGlvblRhcmdldCA9IHouaW5mZXI8dHlwZW9mIEFjdGlvblRhcmdldFNjaGVtYT47XG5cbi8vIDUuIEFjdGlvbiBQYXlsb2FkIFNjaGVtYVxuZXhwb3J0IGNvbnN0IEFjdGlvblBheWxvYWRTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHR5cGU6IFN1cHBvcnRlZEFjdGlvblR5cGVTY2hlbWEsXG4gIHRhcmdldF9pZDogei5zdHJpbmcoKS5taW4oMSwgJ3RhcmdldF9pZCBjYW5ub3QgYmUgZW1wdHknKS5vcHRpb25hbCgpLFxuICBwYXJhbXM6IEFjdGlvblBhcmFtc1NjaGVtYSxcbn0pLnN0cmljdCgpLnN1cGVyUmVmaW5lKChhY3Rpb24sIGN0eCkgPT4ge1xuICAvLyBUYXJnZXQgZXhpc3RlbmNlIHJlcXVpcmVtZW50OiBjbGljaywgdHlwZSwgZm9jdXMsIHNlbGVjdCwgZmlsbF9zZWNyZXQgTVVTVCBzcGVjaWZ5IHRhcmdldF9pZFxuICBjb25zdCB0YXJnZXRSZXF1aXJlZEFjdGlvbnM6IFN1cHBvcnRlZEFjdGlvblR5cGVbXSA9IFsnY2xpY2snLCAndHlwZScsICdmb2N1cycsICdzZWxlY3QnLCAnZmlsbF9zZWNyZXQnXTtcbiAgaWYgKHRhcmdldFJlcXVpcmVkQWN0aW9ucy5pbmNsdWRlcyhhY3Rpb24udHlwZSkgJiYgIWFjdGlvbi50YXJnZXRfaWQpIHtcbiAgICBjdHguYWRkSXNzdWUoe1xuICAgICAgY29kZTogei5ab2RJc3N1ZUNvZGUuY3VzdG9tLFxuICAgICAgbWVzc2FnZTogYEFjdGlvbiAnJHthY3Rpb24udHlwZX0nIHJlcXVpcmVzIGEgbm9uLWVtcHR5IHRhcmdldF9pZGAsXG4gICAgICBwYXRoOiBbJ3RhcmdldF9pZCddLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gVHlwZSBhY3Rpb24gcmVxdWlyZXMgdGV4dCBwYXJhbWV0ZXJcbiAgaWYgKGFjdGlvbi50eXBlID09PSAndHlwZScgJiYgKCFhY3Rpb24ucGFyYW1zIHx8IHR5cGVvZiBhY3Rpb24ucGFyYW1zLnRleHQgIT09ICdzdHJpbmcnKSkge1xuICAgIGN0eC5hZGRJc3N1ZSh7XG4gICAgICBjb2RlOiB6LlpvZElzc3VlQ29kZS5jdXN0b20sXG4gICAgICBtZXNzYWdlOiBcIkFjdGlvbiAndHlwZScgcmVxdWlyZXMgcGFyYW1zLnRleHRcIixcbiAgICAgIHBhdGg6IFsncGFyYW1zJywgJ3RleHQnXSxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEtleXByZXNzIGFjdGlvbiByZXF1aXJlcyBrZXkgcGFyYW1ldGVyXG4gIGlmIChhY3Rpb24udHlwZSA9PT0gJ2tleXByZXNzJyAmJiAoIWFjdGlvbi5wYXJhbXMgfHwgdHlwZW9mIGFjdGlvbi5wYXJhbXMua2V5ICE9PSAnc3RyaW5nJykpIHtcbiAgICBjdHguYWRkSXNzdWUoe1xuICAgICAgY29kZTogei5ab2RJc3N1ZUNvZGUuY3VzdG9tLFxuICAgICAgbWVzc2FnZTogXCJBY3Rpb24gJ2tleXByZXNzJyByZXF1aXJlcyBwYXJhbXMua2V5XCIsXG4gICAgICBwYXRoOiBbJ3BhcmFtcycsICdrZXknXSxcbiAgICB9KTtcbiAgfVxufSk7XG5cbmV4cG9ydCB0eXBlIEFjdGlvblBheWxvYWQgPSB6LmluZmVyPHR5cGVvZiBBY3Rpb25QYXlsb2FkU2NoZW1hPjtcblxuLy8gNi4gQWN0aW9uIFJlcXVlc3QgU2NoZW1hIChSZWNlaXZlZCBmcm9tIEJyb3dzZXJPUyB2aWEgTUNQKVxuZXhwb3J0IGNvbnN0IEFjdGlvblJlcXVlc3RTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHJlcXVlc3RfaWQ6IHouc3RyaW5nKCkubWluKDEsICdyZXF1ZXN0X2lkIGNhbm5vdCBiZSBlbXB0eScpLFxuICBvYnNlcnZhdGlvbl9pZDogei5zdHJpbmcoKS5taW4oMSwgJ29ic2VydmF0aW9uX2lkIGNhbm5vdCBiZSBlbXB0eScpLFxuICBhY3Rpb246IEFjdGlvblBheWxvYWRTY2hlbWEsXG4gIHBhZ2Vfc3RhdGVfaGFzaDogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICBjYXBhYmlsaXR5OiB6LnN0cmluZygpLm51bGxhYmxlKCkub3B0aW9uYWwoKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgdHlwZSBBY3Rpb25SZXF1ZXN0ID0gei5pbmZlcjx0eXBlb2YgQWN0aW9uUmVxdWVzdFNjaGVtYT47XG5cbi8vIDcuIEVycm9yIENvZGVzIGZvciBWYWxpZGF0aW9uXG5leHBvcnQgY29uc3QgQUNUSU9OX1ZBTElEQVRJT05fRVJST1JfQ09ERVMgPSBbXG4gICdNQUxGT1JNRURfUkVRVUVTVCcsXG4gICdNSVNTSU5HX0FDVElPTl9UWVBFJyxcbiAgJ1VOU1VQUE9SVEVEX0FDVElPTicsXG4gICdNSVNTSU5HX1RBUkdFVCcsXG4gICdNQUxGT1JNRURfVEFSR0VUJyxcbiAgJ0lOVkFMSURfT0JTRVJWQVRJT04nLFxuICAnU1RBTEVfT0JTRVJWQVRJT04nLFxuICAnU0NSSVBUX0lOSkVDVElPTl9SRUpFQ1RFRCcsXG4gICdQQUdFX1NUQVRFX01JU01BVENIJyxcbiAgJ0ZSQU1FX01JU01BVENIJyxcbiAgJ1RBUkdFVF9OT1RfRk9VTkQnLFxuICAnTk9UX0lOVEVSQUNUQUJMRScsXG4gICdQT0xJQ1lfREVOSUVEJyxcbiAgJ0NBUEFCSUxJVFlfREVOSUVEJyxcbiAgJ1RFWFRfVU5TQUZFJyxcbiAgJ1VOVkFMSURBVEVEX0VYRUNVVElPTl9BVFRFTVBUJyxcbiAgJ0VYUElSRURfVkVSRElDVCcsXG4gICdSRVBMQVlfUkVKRUNURUQnLFxuICAnT0JTRVJWQVRJT05fTUlTTUFUQ0gnLFxuICAnVEFSR0VUX01JU01BVENIJyxcbiAgJ05PX1ZBTElEQVRJT05fVkVSRElDVCcsXG4gICdWQUxJREFUSU9OX0VYQ0VQVElPTicsXG4gICdFWEVDVVRPUl9SVU5USU1FX0VSUk9SJyxcbl0gYXMgY29uc3Q7XG5cbmV4cG9ydCB0eXBlIEFjdGlvblZhbGlkYXRpb25FcnJvckNvZGUgPSB0eXBlb2YgQUNUSU9OX1ZBTElEQVRJT05fRVJST1JfQ09ERVNbbnVtYmVyXTtcblxuLy8gOC4gVmFsaWRhdGVkIEV4ZWN1dGlvbiBUaWNrZXQgKGlzc3VlZCBieSBWYWxpZGF0b3IgdXBvbiBBTExPVyB2ZXJkaWN0KVxuZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0ZWRFeGVjdXRpb25UaWNrZXQge1xuICB0aWNrZXRfaWQ6IHN0cmluZztcbiAgcmVxdWVzdF9pZDogc3RyaW5nO1xuICBvYnNlcnZhdGlvbl9pZDogc3RyaW5nO1xuICBhY3Rpb25fdHlwZTogU3VwcG9ydGVkQWN0aW9uVHlwZTtcbiAgdGFyZ2V0X2lkOiBzdHJpbmcgfCBudWxsO1xuICBwYXJhbXM/OiBBY3Rpb25QYXJhbXM7XG4gIHBhZ2Vfc3RhdGVfaGFzaD86IHN0cmluZztcbiAgY2FwYWJpbGl0eT86IHN0cmluZyB8IG51bGw7XG4gIHZhbGlkYXRlZF9hdDogbnVtYmVyO1xuICB0dGxfbXM6IG51bWJlcjtcbiAgc2lnbmF0dXJlOiBzdHJpbmc7XG59XG5cbi8vIDkuIFZhbGlkYXRpb24gUmVzdWx0IFNjaGVtYVxuZXhwb3J0IGNvbnN0IFZhbGlkYXRpb25SZXN1bHRTY2hlbWEgPSB6LmRpc2NyaW1pbmF0ZWRVbmlvbignYWxsb3dlZCcsIFtcbiAgei5vYmplY3Qoe1xuICAgIGFsbG93ZWQ6IHoubGl0ZXJhbCh0cnVlKSxcbiAgICByZWFzb246IHouc3RyaW5nKCksXG4gICAgcmVxdWVzdF9pZDogei5zdHJpbmcoKSxcbiAgICBvYnNlcnZhdGlvbl9pZDogei5zdHJpbmcoKSxcbiAgICBhY3Rpb25fdHlwZTogU3VwcG9ydGVkQWN0aW9uVHlwZVNjaGVtYSxcbiAgICB0YXJnZXRfaWQ6IHouc3RyaW5nKCkubnVsbGFibGUoKS5vcHRpb25hbCgpLFxuICAgIHRpY2tldDogei5jdXN0b208VmFsaWRhdGVkRXhlY3V0aW9uVGlja2V0PigpLm9wdGlvbmFsKCksXG4gIH0pLnBhc3N0aHJvdWdoKCksXG4gIHoub2JqZWN0KHtcbiAgICBhbGxvd2VkOiB6LmxpdGVyYWwoZmFsc2UpLFxuICAgIHJlYXNvbjogei5zdHJpbmcoKSxcbiAgICBjb2RlOiB6LmVudW0oQUNUSU9OX1ZBTElEQVRJT05fRVJST1JfQ09ERVMpLFxuICAgIGZhaWxlZF9jaGVjazogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICB9KS5zdHJpY3QoKSxcbl0pO1xuXG5leHBvcnQgdHlwZSBWYWxpZGF0aW9uUmVzdWx0ID0gei5pbmZlcjx0eXBlb2YgVmFsaWRhdGlvblJlc3VsdFNjaGVtYT47XG5cbi8qKlxuICogUHVyZSBTY2hlbWEgVmFsaWRhdG9yIGZvciBBY3Rpb24gUmVxdWVzdHNcbiAqIFZhbGlkYXRlcyByZXF1ZXN0IHN0cnVjdHVyZSwgc3VwcG9ydGVkIGFjdGlvbnMsIHRhcmdldCBwYXJhbWV0ZXJzLCBhbmQgaW5qZWN0aW9uIHNhZmV0eS5cbiAqIEZhaWxzIGNsb3NlZCBvbiBhbnkgYW1iaWd1aXR5IG9yIG1hbGZvcm1lZCBpbnB1dC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlQWN0aW9uUmVxdWVzdENvbnRyYWN0KHJhdzogdW5rbm93bik6IHtcbiAgdmFsaWQ6IGJvb2xlYW47XG4gIHJlc3VsdDogVmFsaWRhdGlvblJlc3VsdDtcbiAgdmFsaWRhdGVkUmVxdWVzdD86IEFjdGlvblJlcXVlc3Q7XG59IHtcbiAgaWYgKCFyYXcgfHwgdHlwZW9mIHJhdyAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIGFsbG93ZWQ6IGZhbHNlLFxuICAgICAgICByZWFzb246ICdNYWxmb3JtZWQgcmVxdWVzdDogcGF5bG9hZCBtdXN0IGJlIGEgbm9uLW51bGwgb2JqZWN0JyxcbiAgICAgICAgY29kZTogJ01BTEZPUk1FRF9SRVFVRVNUJyxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHBhcnNlUmVzdWx0ID0gQWN0aW9uUmVxdWVzdFNjaGVtYS5zYWZlUGFyc2UocmF3KTtcbiAgaWYgKCFwYXJzZVJlc3VsdC5zdWNjZXNzKSB7XG4gICAgY29uc3QgZmlyc3RJc3N1ZSA9IHBhcnNlUmVzdWx0LmVycm9yLmlzc3Vlc1swXTtcbiAgICBjb25zdCBwYXRoID0gZmlyc3RJc3N1ZT8ucGF0aC5qb2luKCcuJykgfHwgJyc7XG4gICAgY29uc3QgbWVzc2FnZSA9IGZpcnN0SXNzdWU/Lm1lc3NhZ2UgfHwgJ0ludmFsaWQgcmVxdWVzdCBzY2hlbWEnO1xuXG4gICAgLy8gTWFwIHNwZWNpZmljIFpvZCBpc3N1ZXMgdG8gc3RhbmRhcmRpemVkIGVycm9yIGNvZGVzXG4gICAgbGV0IGNvZGU6IEFjdGlvblZhbGlkYXRpb25FcnJvckNvZGUgPSAnTUFMRk9STUVEX1JFUVVFU1QnO1xuICAgIGlmIChtZXNzYWdlLmluY2x1ZGVzKCdGb3JiaWRkZW4gc2NyaXB0IGluamVjdGlvbicpKSB7XG4gICAgICBjb2RlID0gJ1NDUklQVF9JTkpFQ1RJT05fUkVKRUNURUQnO1xuICAgIH0gZWxzZSBpZiAocGF0aC5pbmNsdWRlcygndHlwZScpICYmIG1lc3NhZ2UuaW5jbHVkZXMoJ0ludmFsaWQgZW51bSB2YWx1ZScpKSB7XG4gICAgICBjb2RlID0gJ1VOU1VQUE9SVEVEX0FDVElPTic7XG4gICAgfSBlbHNlIGlmIChwYXRoLmluY2x1ZGVzKCd0YXJnZXRfaWQnKSB8fCBtZXNzYWdlLmluY2x1ZGVzKCdyZXF1aXJlcyBhIG5vbi1lbXB0eSB0YXJnZXRfaWQnKSkge1xuICAgICAgY29kZSA9ICdNSVNTSU5HX1RBUkdFVCc7XG4gICAgfSBlbHNlIGlmIChwYXRoID09PSAnb2JzZXJ2YXRpb25faWQnKSB7XG4gICAgICBjb2RlID0gJ0lOVkFMSURfT0JTRVJWQVRJT04nO1xuICAgIH0gZWxzZSBpZiAocGF0aC5pbmNsdWRlcygnYWN0aW9uLnR5cGUnKSAmJiBtZXNzYWdlLmluY2x1ZGVzKCdSZXF1aXJlZCcpKSB7XG4gICAgICBjb2RlID0gJ01JU1NJTkdfQUNUSU9OX1RZUEUnO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB2YWxpZDogZmFsc2UsXG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgYWxsb3dlZDogZmFsc2UsXG4gICAgICAgIHJlYXNvbjogYENvbnRyYWN0IHZhbGlkYXRpb24gZmFpbGVkIFske3BhdGh9XTogJHttZXNzYWdlfWAsXG4gICAgICAgIGNvZGUsXG4gICAgICAgIGZhaWxlZF9jaGVjazogcGF0aCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHJlcSA9IHBhcnNlUmVzdWx0LmRhdGE7XG5cbiAgcmV0dXJuIHtcbiAgICB2YWxpZDogdHJ1ZSxcbiAgICByZXN1bHQ6IHtcbiAgICAgIGFsbG93ZWQ6IHRydWUsXG4gICAgICByZWFzb246ICdBY3Rpb24gcmVxdWVzdCBjb25mb3JtcyB0byBBY3Rpb24gQ29udHJhY3Qgc2NoZW1hJyxcbiAgICAgIHJlcXVlc3RfaWQ6IHJlcS5yZXF1ZXN0X2lkLFxuICAgICAgb2JzZXJ2YXRpb25faWQ6IHJlcS5vYnNlcnZhdGlvbl9pZCxcbiAgICAgIGFjdGlvbl90eXBlOiByZXEuYWN0aW9uLnR5cGUsXG4gICAgICB0YXJnZXRfaWQ6IHJlcS5hY3Rpb24udGFyZ2V0X2lkIHx8IG51bGwsXG4gICAgfSxcbiAgICB2YWxpZGF0ZWRSZXF1ZXN0OiByZXEsXG4gIH07XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaXNFbGVtZW50VmlzaWJsZShlbDogRWxlbWVudCk6IGJvb2xlYW4ge1xuICBpZiAodHlwZW9mIChlbCBhcyBhbnkpLmNoZWNrVmlzaWJpbGl0eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmIChcbiAgICAgICEoZWwgYXMgYW55KS5jaGVja1Zpc2liaWxpdHkoe1xuICAgICAgICBjaGVja09wYWNpdHk6IHRydWUsXG4gICAgICAgIGNoZWNrVmlzaWJpbGl0eUNTUzogdHJ1ZSxcbiAgICAgIH0pXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBpZiAocmVjdC53aWR0aCA9PT0gMCB8fCByZWN0LmhlaWdodCA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIGlmIChcbiAgICAgIHN0eWxlLmRpc3BsYXkgPT09ICdub25lJyB8fFxuICAgICAgc3R5bGUudmlzaWJpbGl0eSA9PT0gJ2hpZGRlbicgfHxcbiAgICAgIHN0eWxlLnZpc2liaWxpdHkgPT09ICdjb2xsYXBzZScgfHxcbiAgICAgIHBhcnNlRmxvYXQoc3R5bGUub3BhY2l0eSB8fCAnMScpIDwgMC4wNVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydChyZWN0OiBET01SZWN0IHwgeyB0b3A6IG51bWJlcjsgbGVmdDogbnVtYmVyOyBib3R0b206IG51bWJlcjsgcmlnaHQ6IG51bWJlciB9LCB2aWV3cG9ydDogeyB3OiBudW1iZXI7IGg6IG51bWJlciB9KTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgcmVjdC5ib3R0b20gPj0gMCAmJlxuICAgIHJlY3QucmlnaHQgPj0gMCAmJlxuICAgIHJlY3QudG9wIDw9IHZpZXdwb3J0LmggJiZcbiAgICByZWN0LmxlZnQgPD0gdmlld3BvcnQud1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFbGVtZW50T2NjbHVkZWQoZWw6IEVsZW1lbnQsIGN4OiBudW1iZXIsIGN5OiBudW1iZXIpOiBib29sZWFuIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IHRvcEVsZW1lbnRzID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQoY3gsIGN5KTtcbiAgaWYgKHRvcEVsZW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IHRvcCA9IHRvcEVsZW1lbnRzWzBdO1xuICBpZiAoIXRvcCkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIHRoZSB0b3AgZWxlbWVudCBpcyBvdXIgZWxlbWVudCBvciBvbmUgb2YgaXRzIGRlc2NlbmRhbnRzLCBpdCBpcyBub3Qgb2NjbHVkZWRcbiAgcmV0dXJuIHRvcCAhPT0gZWwgJiYgIWVsLmNvbnRhaW5zKHRvcCk7XG59XG4iLCJleHBvcnQgdHlwZSBSZW5kZXJpbmdLaW5kID1cbiAgfCAnaHRtbCdcbiAgfCAnY2FudmFzJ1xuICB8ICdzdmcnXG4gIHwgJ2ltZydcbiAgfCAndmlkZW8nXG4gIHwgJ2lmcmFtZSdcbiAgfCAnc2hhZG93X29wZW4nXG4gIHwgJ3NoYWRvd19jbG9zZWQnXG4gIHwgJ2N1c3RvbSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3RSZW5kZXJpbmdLaW5kKGVsOiBFbGVtZW50KToge1xuICByZW5kZXJpbmc6IFJlbmRlcmluZ0tpbmQ7XG4gIGhhc19iZ19pbWFnZTogYm9vbGVhbjtcbiAgaGFuZGxlcnNfaGludDogYm9vbGVhbjtcbn0ge1xuICBjb25zdCB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgbGV0IHJlbmRlcmluZzogUmVuZGVyaW5nS2luZCA9ICdodG1sJztcbiAgaWYgKHRhZyA9PT0gJ2NhbnZhcycpIHJlbmRlcmluZyA9ICdjYW52YXMnO1xuICBlbHNlIGlmICh0YWcgPT09ICdzdmcnIHx8IHRhZyA9PT0gJ3BhdGgnKSByZW5kZXJpbmcgPSAnc3ZnJztcbiAgZWxzZSBpZiAodGFnID09PSAnaW1nJykgcmVuZGVyaW5nID0gJ2ltZyc7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ3ZpZGVvJykgcmVuZGVyaW5nID0gJ3ZpZGVvJztcbiAgZWxzZSBpZiAodGFnID09PSAnaWZyYW1lJykgcmVuZGVyaW5nID0gJ2lmcmFtZSc7XG4gIGVsc2UgaWYgKGVsLnNoYWRvd1Jvb3QpIHJlbmRlcmluZyA9ICdzaGFkb3dfb3Blbic7XG5cbiAgbGV0IGhhc19iZ19pbWFnZSA9IGZhbHNlO1xuICBsZXQgaGFuZGxlcnNfaGludCA9IGZhbHNlO1xuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgJiYgc3R5bGUuYmFja2dyb3VuZEltYWdlICE9PSAnbm9uZScpIHtcbiAgICAgIGhhc19iZ19pbWFnZSA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzdHlsZS5jdXJzb3IgPT09ICdwb2ludGVyJykge1xuICAgICAgaGFuZGxlcnNfaGludCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKFxuICAgIChlbCBhcyBhbnkpLm9uY2xpY2sgfHxcbiAgICBlbC5nZXRBdHRyaWJ1dGUoJ29uY2xpY2snKSB8fFxuICAgIGVsLmdldEF0dHJpYnV0ZSgncm9sZScpID09PSAnYnV0dG9uJ1xuICApIHtcbiAgICBoYW5kbGVyc19oaW50ID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB7IHJlbmRlcmluZywgaGFzX2JnX2ltYWdlLCBoYW5kbGVyc19oaW50IH07XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gY29tcHV0ZUFyaWFSb2xlKGVsOiBFbGVtZW50KTogc3RyaW5nIHwgbnVsbCB7XG4gIC8vIEV4cGxpY2l0IHJvbGVcbiAgY29uc3QgZXhwbGljaXRSb2xlID0gZWwuZ2V0QXR0cmlidXRlKCdyb2xlJyk7XG4gIGlmIChleHBsaWNpdFJvbGUpIHtcbiAgICByZXR1cm4gZXhwbGljaXRSb2xlLnRyaW0oKS5zcGxpdCgvXFxzKy8pWzBdIHx8IG51bGw7XG4gIH1cblxuICAvLyBJbXBsaWNpdCBIVE1MNSByb2xlIG1hcHBpbmdcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgJ2EnOlxuICAgICAgcmV0dXJuIGVsLmhhc0F0dHJpYnV0ZSgnaHJlZicpID8gJ2xpbmsnIDogbnVsbDtcbiAgICBjYXNlICdidXR0b24nOlxuICAgICAgcmV0dXJuICdidXR0b24nO1xuICAgIGNhc2UgJ2lucHV0Jzoge1xuICAgICAgY29uc3QgdHlwZSA9IChlbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSB8fCAndGV4dCcpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAodHlwZSA9PT0gJ2J1dHRvbicgfHwgdHlwZSA9PT0gJ3N1Ym1pdCcgfHwgdHlwZSA9PT0gJ3Jlc2V0JykgcmV0dXJuICdidXR0b24nO1xuICAgICAgaWYgKHR5cGUgPT09ICdjaGVja2JveCcpIHJldHVybiAnY2hlY2tib3gnO1xuICAgICAgaWYgKHR5cGUgPT09ICdyYWRpbycpIHJldHVybiAncmFkaW8nO1xuICAgICAgaWYgKHR5cGUgPT09ICdyYW5nZScpIHJldHVybiAnc2xpZGVyJztcbiAgICAgIGlmICh0eXBlID09PSAnbnVtYmVyJykgcmV0dXJuICdzcGluYnV0dG9uJztcbiAgICAgIHJldHVybiAndGV4dGJveCc7XG4gICAgfVxuICAgIGNhc2UgJ3NlbGVjdCc6XG4gICAgICByZXR1cm4gJ2NvbWJvYm94JztcbiAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICByZXR1cm4gJ3RleHRib3gnO1xuICAgIGNhc2UgJ2gxJzpcbiAgICBjYXNlICdoMic6XG4gICAgY2FzZSAnaDMnOlxuICAgIGNhc2UgJ2g0JzpcbiAgICBjYXNlICdoNSc6XG4gICAgY2FzZSAnaDYnOlxuICAgICAgcmV0dXJuICdoZWFkaW5nJztcbiAgICBjYXNlICdpbWcnOlxuICAgICAgcmV0dXJuICdpbWcnO1xuICAgIGNhc2UgJ25hdic6XG4gICAgICByZXR1cm4gJ25hdmlnYXRpb24nO1xuICAgIGNhc2UgJ2RpYWxvZyc6XG4gICAgICByZXR1cm4gJ2RpYWxvZyc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0QXJpYVN0YXRlcyhlbDogRWxlbWVudCk6IHtcbiAgZXhwYW5kZWQ/OiBib29sZWFuO1xuICBjaGVja2VkPzogYm9vbGVhbiB8ICdtaXhlZCc7XG4gIGRpc2FibGVkPzogYm9vbGVhbjtcbiAgc2VsZWN0ZWQ/OiBib29sZWFuO1xuICBwcmVzc2VkPzogYm9vbGVhbjtcbiAgaGlkZGVuPzogYm9vbGVhbjtcbn0ge1xuICBjb25zdCBhcmlhOiB7XG4gICAgZXhwYW5kZWQ/OiBib29sZWFuO1xuICAgIGNoZWNrZWQ/OiBib29sZWFuIHwgJ21peGVkJztcbiAgICBkaXNhYmxlZD86IGJvb2xlYW47XG4gICAgc2VsZWN0ZWQ/OiBib29sZWFuO1xuICAgIHByZXNzZWQ/OiBib29sZWFuO1xuICAgIGhpZGRlbj86IGJvb2xlYW47XG4gIH0gPSB7fTtcblxuICBpZiAoZWwuaGFzQXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykpIHtcbiAgICBhcmlhLmV4cGFuZGVkID0gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJztcbiAgfVxuICBpZiAoZWwuaGFzQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKSkge1xuICAgIGNvbnN0IHZhbCA9IGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XG4gICAgYXJpYS5jaGVja2VkID0gdmFsID09PSAnbWl4ZWQnID8gJ21peGVkJyA6IHZhbCA9PT0gJ3RydWUnO1xuICB9XG4gIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKSB8fCAoZWwgYXMgYW55KS5kaXNhYmxlZCkge1xuICAgIGFyaWEuZGlzYWJsZWQgPSBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKSA9PT0gJ3RydWUnIHx8IChlbCBhcyBhbnkpLmRpc2FibGVkID09PSB0cnVlO1xuICB9XG4gIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSkge1xuICAgIGFyaWEuc2VsZWN0ZWQgPSBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnO1xuICB9XG4gIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcpKSB7XG4gICAgYXJpYS5wcmVzc2VkID0gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnKSA9PT0gJ3RydWUnO1xuICB9XG4gIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpIHtcbiAgICBhcmlhLmhpZGRlbiA9IGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgcmV0dXJuIGFyaWE7XG59XG4iLCIvKipcbiAqIEBzb3VyY2Uge2h0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2Zyb20jUG9seWZpbGx9XG4gKiBidXQgd2l0aG91dCB0aGlzQXJnICh0b28gaGFyZCB0byB0eXBlLCBubyBuZWVkIHRvIGB0aGlzYClcbiAqL1xudmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmZ1bmN0aW9uIGlzQ2FsbGFibGUoZm4pIHtcbiAgcmV0dXJuIHR5cGVvZiBmbiA9PT0gXCJmdW5jdGlvblwiIHx8IHRvU3RyLmNhbGwoZm4pID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG59XG5mdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcbiAgdmFyIG51bWJlciA9IE51bWJlcih2YWx1ZSk7XG4gIGlmIChpc05hTihudW1iZXIpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgaWYgKG51bWJlciA9PT0gMCB8fCAhaXNGaW5pdGUobnVtYmVyKSkge1xuICAgIHJldHVybiBudW1iZXI7XG4gIH1cbiAgcmV0dXJuIChudW1iZXIgPiAwID8gMSA6IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnMobnVtYmVyKSk7XG59XG52YXIgbWF4U2FmZUludGVnZXIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuZnVuY3Rpb24gdG9MZW5ndGgodmFsdWUpIHtcbiAgdmFyIGxlbiA9IHRvSW50ZWdlcih2YWx1ZSk7XG4gIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChsZW4sIDApLCBtYXhTYWZlSW50ZWdlcik7XG59XG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgZnJvbSBhbiBpdGVyYWJsZSBvYmplY3QuXG4gKiBAcGFyYW0gaXRlcmFibGUgQW4gaXRlcmFibGUgb2JqZWN0IHRvIGNvbnZlcnQgdG8gYW4gYXJyYXkuXG4gKi9cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IGZyb20gYW4gaXRlcmFibGUgb2JqZWN0LlxuICogQHBhcmFtIGl0ZXJhYmxlIEFuIGl0ZXJhYmxlIG9iamVjdCB0byBjb252ZXJ0IHRvIGFuIGFycmF5LlxuICogQHBhcmFtIG1hcGZuIEEgbWFwcGluZyBmdW5jdGlvbiB0byBjYWxsIG9uIGV2ZXJ5IGVsZW1lbnQgb2YgdGhlIGFycmF5LlxuICogQHBhcmFtIHRoaXNBcmcgVmFsdWUgb2YgJ3RoaXMnIHVzZWQgdG8gaW52b2tlIHRoZSBtYXBmbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXJyYXlGcm9tKGFycmF5TGlrZSwgbWFwRm4pIHtcbiAgLy8gMS4gTGV0IEMgYmUgdGhlIHRoaXMgdmFsdWUuXG4gIC8vIGVkaXQoQGVwczFsb24pOiB3ZSdyZSBub3QgY2FsbGluZyBpdCBhcyBBcnJheS5mcm9tXG4gIHZhciBDID0gQXJyYXk7XG5cbiAgLy8gMi4gTGV0IGl0ZW1zIGJlIFRvT2JqZWN0KGFycmF5TGlrZSkuXG4gIHZhciBpdGVtcyA9IE9iamVjdChhcnJheUxpa2UpO1xuXG4gIC8vIDMuIFJldHVybklmQWJydXB0KGl0ZW1zKS5cbiAgaWYgKGFycmF5TGlrZSA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFycmF5LmZyb20gcmVxdWlyZXMgYW4gYXJyYXktbGlrZSBvYmplY3QgLSBub3QgbnVsbCBvciB1bmRlZmluZWRcIik7XG4gIH1cblxuICAvLyA0LiBJZiBtYXBmbiBpcyB1bmRlZmluZWQsIHRoZW4gbGV0IG1hcHBpbmcgYmUgZmFsc2UuXG4gIC8vIGNvbnN0IG1hcEZuID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB2b2lkIHVuZGVmaW5lZDtcblxuICBpZiAodHlwZW9mIG1hcEZuICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgLy8gNS4gZWxzZVxuICAgIC8vIDUuIGEgSWYgSXNDYWxsYWJsZShtYXBmbikgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICBpZiAoIWlzQ2FsbGFibGUobWFwRm4pKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQXJyYXkuZnJvbTogd2hlbiBwcm92aWRlZCwgdGhlIHNlY29uZCBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgfVxuICB9XG5cbiAgLy8gMTAuIExldCBsZW5WYWx1ZSBiZSBHZXQoaXRlbXMsIFwibGVuZ3RoXCIpLlxuICAvLyAxMS4gTGV0IGxlbiBiZSBUb0xlbmd0aChsZW5WYWx1ZSkuXG4gIHZhciBsZW4gPSB0b0xlbmd0aChpdGVtcy5sZW5ndGgpO1xuXG4gIC8vIDEzLiBJZiBJc0NvbnN0cnVjdG9yKEMpIGlzIHRydWUsIHRoZW5cbiAgLy8gMTMuIGEuIExldCBBIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2RcbiAgLy8gb2YgQyB3aXRoIGFuIGFyZ3VtZW50IGxpc3QgY29udGFpbmluZyB0aGUgc2luZ2xlIGl0ZW0gbGVuLlxuICAvLyAxNC4gYS4gRWxzZSwgTGV0IEEgYmUgQXJyYXlDcmVhdGUobGVuKS5cbiAgdmFyIEEgPSBpc0NhbGxhYmxlKEMpID8gT2JqZWN0KG5ldyBDKGxlbikpIDogbmV3IEFycmF5KGxlbik7XG5cbiAgLy8gMTYuIExldCBrIGJlIDAuXG4gIHZhciBrID0gMDtcbiAgLy8gMTcuIFJlcGVhdCwgd2hpbGUgayA8IGxlbuKApiAoYWxzbyBzdGVwcyBhIC0gaClcbiAgdmFyIGtWYWx1ZTtcbiAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICBrVmFsdWUgPSBpdGVtc1trXTtcbiAgICBpZiAobWFwRm4pIHtcbiAgICAgIEFba10gPSBtYXBGbihrVmFsdWUsIGspO1xuICAgIH0gZWxzZSB7XG4gICAgICBBW2tdID0ga1ZhbHVlO1xuICAgIH1cbiAgICBrICs9IDE7XG4gIH1cbiAgLy8gMTguIExldCBwdXRTdGF0dXMgYmUgUHV0KEEsIFwibGVuZ3RoXCIsIGxlbiwgdHJ1ZSkuXG4gIEEubGVuZ3RoID0gbGVuO1xuICAvLyAyMC4gUmV0dXJuIEEuXG4gIHJldHVybiBBO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXJyYXkuZnJvbS5tanMubWFwIiwiZnVuY3Rpb24gX3R5cGVvZihvKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgcmV0dXJuIF90eXBlb2YgPSBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBcInN5bWJvbFwiID09IHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPyBmdW5jdGlvbiAobykgeyByZXR1cm4gdHlwZW9mIG87IH0gOiBmdW5jdGlvbiAobykgeyByZXR1cm4gbyAmJiBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBvLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgbyAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2YgbzsgfSwgX3R5cGVvZihvKTsgfVxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgX3RvUHJvcGVydHlLZXkoZGVzY3JpcHRvci5rZXkpLCBkZXNjcmlwdG9yKTsgfSB9XG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb25zdHJ1Y3RvciwgXCJwcm90b3R5cGVcIiwgeyB3cml0YWJsZTogZmFsc2UgfSk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBrZXkgPSBfdG9Qcm9wZXJ0eUtleShrZXkpOyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cbmZ1bmN0aW9uIF90b1Byb3BlcnR5S2V5KHQpIHsgdmFyIGkgPSBfdG9QcmltaXRpdmUodCwgXCJzdHJpbmdcIik7IHJldHVybiBcInN5bWJvbFwiID09IF90eXBlb2YoaSkgPyBpIDogaSArIFwiXCI7IH1cbmZ1bmN0aW9uIF90b1ByaW1pdGl2ZSh0LCByKSB7IGlmIChcIm9iamVjdFwiICE9IF90eXBlb2YodCkgfHwgIXQpIHJldHVybiB0OyB2YXIgZSA9IHRbU3ltYm9sLnRvUHJpbWl0aXZlXTsgaWYgKHZvaWQgMCAhPT0gZSkgeyB2YXIgaSA9IGUuY2FsbCh0LCByIHx8IFwiZGVmYXVsdFwiKTsgaWYgKFwib2JqZWN0XCIgIT0gX3R5cGVvZihpKSkgcmV0dXJuIGk7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJAQHRvUHJpbWl0aXZlIG11c3QgcmV0dXJuIGEgcHJpbWl0aXZlIHZhbHVlLlwiKTsgfSByZXR1cm4gKFwic3RyaW5nXCIgPT09IHIgPyBTdHJpbmcgOiBOdW1iZXIpKHQpOyB9XG4vLyBmb3IgZW52aXJvbm1lbnRzIHdpdGhvdXQgU2V0IHdlIGZhbGxiYWNrIHRvIGFycmF5cyB3aXRoIHVuaXF1ZSBtZW1iZXJzXG52YXIgU2V0TGlrZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNldExpa2UoKSB7XG4gICAgdmFyIGl0ZW1zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBbXTtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2V0TGlrZSk7XG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaXRlbXNcIiwgdm9pZCAwKTtcbiAgICB0aGlzLml0ZW1zID0gaXRlbXM7XG4gIH1cbiAgcmV0dXJuIF9jcmVhdGVDbGFzcyhTZXRMaWtlLCBbe1xuICAgIGtleTogXCJhZGRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5oYXModmFsdWUpID09PSBmYWxzZSkge1xuICAgICAgICB0aGlzLml0ZW1zLnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkZWxldGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2RlbGV0ZSh2YWx1ZSkge1xuICAgICAgdmFyIHByZXZpb3VzTGVuZ3RoID0gdGhpcy5pdGVtcy5sZW5ndGg7XG4gICAgICB0aGlzLml0ZW1zID0gdGhpcy5pdGVtcy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW0gIT09IHZhbHVlO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcHJldmlvdXNMZW5ndGggIT09IHRoaXMuaXRlbXMubGVuZ3RoO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJmb3JFYWNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbikge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBjYWxsYmFja2ZuKGl0ZW0sIGl0ZW0sIF90aGlzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoYXNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFzKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5pdGVtcy5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNpemVcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgICB9XG4gIH1dKTtcbn0oKTtcbmV4cG9ydCBkZWZhdWx0IHR5cGVvZiBTZXQgPT09IFwidW5kZWZpbmVkXCIgPyBTZXQgOiBTZXRMaWtlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U2V0TGlrZS5tanMubWFwIiwiLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2h0bWwtYXJpYS8jZG9jdW1lbnQtY29uZm9ybWFuY2UtcmVxdWlyZW1lbnRzLWZvci11c2Utb2YtYXJpYS1hdHRyaWJ1dGVzLWluLWh0bWxcblxuaW1wb3J0IHsgcHJlc2VudGF0aW9uUm9sZXMgfSBmcm9tIFwiLi91dGlsLm1qc1wiO1xuXG4vKipcbiAqIFNhZmUgRWxlbWVudC5sb2NhbE5hbWUgZm9yIGFsbCBzdXBwb3J0ZWQgZW52aXJvbm1lbnRzXG4gKiBAcGFyYW0gZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxOYW1lKGVsZW1lbnQpIHtcbiAgdmFyIF9lbGVtZW50JGxvY2FsTmFtZTtcbiAgcmV0dXJuICgvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1wcm9wZXJ0aWVzIC0tIGFjdHVhbCBndWFyZCBmb3IgZW52aXJvbm1lbnRzIHdpdGhvdXQgbG9jYWxOYW1lXG4gICAgKF9lbGVtZW50JGxvY2FsTmFtZSA9IGVsZW1lbnQubG9jYWxOYW1lKSAhPT0gbnVsbCAmJiBfZWxlbWVudCRsb2NhbE5hbWUgIT09IHZvaWQgMCA/IF9lbGVtZW50JGxvY2FsTmFtZSA6XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtcHJvcGVydGllcyAtLSByZXF1aXJlZCBmb3IgdGhlIGZhbGxiYWNrXG4gICAgZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgKTtcbn1cbnZhciBsb2NhbE5hbWVUb1JvbGVNYXBwaW5ncyA9IHtcbiAgYXJ0aWNsZTogXCJhcnRpY2xlXCIsXG4gIGFzaWRlOiBcImNvbXBsZW1lbnRhcnlcIixcbiAgYnV0dG9uOiBcImJ1dHRvblwiLFxuICBkYXRhbGlzdDogXCJsaXN0Ym94XCIsXG4gIGRkOiBcImRlZmluaXRpb25cIixcbiAgZGV0YWlsczogXCJncm91cFwiLFxuICBkaWFsb2c6IFwiZGlhbG9nXCIsXG4gIGR0OiBcInRlcm1cIixcbiAgZmllbGRzZXQ6IFwiZ3JvdXBcIixcbiAgZmlndXJlOiBcImZpZ3VyZVwiLFxuICAvLyBXQVJOSU5HOiBPbmx5IHdpdGggYW4gYWNjZXNzaWJsZSBuYW1lXG4gIGZvcm06IFwiZm9ybVwiLFxuICBmb290ZXI6IFwiY29udGVudGluZm9cIixcbiAgaDE6IFwiaGVhZGluZ1wiLFxuICBoMjogXCJoZWFkaW5nXCIsXG4gIGgzOiBcImhlYWRpbmdcIixcbiAgaDQ6IFwiaGVhZGluZ1wiLFxuICBoNTogXCJoZWFkaW5nXCIsXG4gIGg2OiBcImhlYWRpbmdcIixcbiAgaGVhZGVyOiBcImJhbm5lclwiLFxuICBocjogXCJzZXBhcmF0b3JcIixcbiAgaHRtbDogXCJkb2N1bWVudFwiLFxuICBsZWdlbmQ6IFwibGVnZW5kXCIsXG4gIGxpOiBcImxpc3RpdGVtXCIsXG4gIG1hdGg6IFwibWF0aFwiLFxuICBtYWluOiBcIm1haW5cIixcbiAgbWVudTogXCJsaXN0XCIsXG4gIG5hdjogXCJuYXZpZ2F0aW9uXCIsXG4gIG9sOiBcImxpc3RcIixcbiAgb3B0Z3JvdXA6IFwiZ3JvdXBcIixcbiAgLy8gV0FSTklORzogT25seSBpbiBjZXJ0YWluIGNvbnRleHRcbiAgb3B0aW9uOiBcIm9wdGlvblwiLFxuICBvdXRwdXQ6IFwic3RhdHVzXCIsXG4gIHByb2dyZXNzOiBcInByb2dyZXNzYmFyXCIsXG4gIC8vIFdBUk5JTkc6IE9ubHkgd2l0aCBhbiBhY2Nlc3NpYmxlIG5hbWVcbiAgc2VjdGlvbjogXCJyZWdpb25cIixcbiAgc3VtbWFyeTogXCJidXR0b25cIixcbiAgdGFibGU6IFwidGFibGVcIixcbiAgdGJvZHk6IFwicm93Z3JvdXBcIixcbiAgdGV4dGFyZWE6IFwidGV4dGJveFwiLFxuICB0Zm9vdDogXCJyb3dncm91cFwiLFxuICAvLyBXQVJOSU5HOiBPbmx5IGluIGNlcnRhaW4gY29udGV4dFxuICB0ZDogXCJjZWxsXCIsXG4gIHRoOiBcImNvbHVtbmhlYWRlclwiLFxuICB0aGVhZDogXCJyb3dncm91cFwiLFxuICB0cjogXCJyb3dcIixcbiAgdWw6IFwibGlzdFwiXG59O1xudmFyIHByb2hpYml0ZWRBdHRyaWJ1dGVzID0ge1xuICBjYXB0aW9uOiBuZXcgU2V0KFtcImFyaWEtbGFiZWxcIiwgXCJhcmlhLWxhYmVsbGVkYnlcIl0pLFxuICBjb2RlOiBuZXcgU2V0KFtcImFyaWEtbGFiZWxcIiwgXCJhcmlhLWxhYmVsbGVkYnlcIl0pLFxuICBkZWxldGlvbjogbmV3IFNldChbXCJhcmlhLWxhYmVsXCIsIFwiYXJpYS1sYWJlbGxlZGJ5XCJdKSxcbiAgZW1waGFzaXM6IG5ldyBTZXQoW1wiYXJpYS1sYWJlbFwiLCBcImFyaWEtbGFiZWxsZWRieVwiXSksXG4gIGdlbmVyaWM6IG5ldyBTZXQoW1wiYXJpYS1sYWJlbFwiLCBcImFyaWEtbGFiZWxsZWRieVwiLCBcImFyaWEtcm9sZWRlc2NyaXB0aW9uXCJdKSxcbiAgaW5zZXJ0aW9uOiBuZXcgU2V0KFtcImFyaWEtbGFiZWxcIiwgXCJhcmlhLWxhYmVsbGVkYnlcIl0pLFxuICBub25lOiBuZXcgU2V0KFtcImFyaWEtbGFiZWxcIiwgXCJhcmlhLWxhYmVsbGVkYnlcIl0pLFxuICBwYXJhZ3JhcGg6IG5ldyBTZXQoW1wiYXJpYS1sYWJlbFwiLCBcImFyaWEtbGFiZWxsZWRieVwiXSksXG4gIHByZXNlbnRhdGlvbjogbmV3IFNldChbXCJhcmlhLWxhYmVsXCIsIFwiYXJpYS1sYWJlbGxlZGJ5XCJdKSxcbiAgc3Ryb25nOiBuZXcgU2V0KFtcImFyaWEtbGFiZWxcIiwgXCJhcmlhLWxhYmVsbGVkYnlcIl0pLFxuICBzdWJzY3JpcHQ6IG5ldyBTZXQoW1wiYXJpYS1sYWJlbFwiLCBcImFyaWEtbGFiZWxsZWRieVwiXSksXG4gIHN1cGVyc2NyaXB0OiBuZXcgU2V0KFtcImFyaWEtbGFiZWxcIiwgXCJhcmlhLWxhYmVsbGVkYnlcIl0pXG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gZWxlbWVudFxuICogQHBhcmFtIHJvbGUgVGhlIHJvbGUgdXNlZCBmb3IgdGhpcyBlbGVtZW50LiBUaGlzIGlzIHNwZWNpZmllZCB0byBjb250cm9sIHdoZXRoZXIgeW91IHdhbnQgdG8gdXNlIHRoZSBpbXBsaWNpdCBvciBleHBsaWNpdCByb2xlLlxuICovXG5mdW5jdGlvbiBoYXNHbG9iYWxBcmlhQXR0cmlidXRlcyhlbGVtZW50LCByb2xlKSB7XG4gIC8vIGh0dHBzOi8vcmF3Z2l0LmNvbS93M2MvYXJpYS9zdGFibGUvI2dsb2JhbF9zdGF0ZXNcbiAgLy8gY29tbWVudGVkIGF0dHJpYnV0ZXMgYXJlIGRlcHJlY2F0ZWRcbiAgcmV0dXJuIFtcImFyaWEtYXRvbWljXCIsIFwiYXJpYS1idXN5XCIsIFwiYXJpYS1jb250cm9sc1wiLCBcImFyaWEtY3VycmVudFwiLCBcImFyaWEtZGVzY3JpcHRpb25cIiwgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsIFwiYXJpYS1kZXRhaWxzXCIsXG4gIC8vIFwiZGlzYWJsZWRcIixcbiAgXCJhcmlhLWRyb3BlZmZlY3RcIixcbiAgLy8gXCJlcnJvcm1lc3NhZ2VcIixcbiAgXCJhcmlhLWZsb3d0b1wiLCBcImFyaWEtZ3JhYmJlZFwiLFxuICAvLyBcImhhc3BvcHVwXCIsXG4gIFwiYXJpYS1oaWRkZW5cIixcbiAgLy8gXCJpbnZhbGlkXCIsXG4gIFwiYXJpYS1rZXlzaG9ydGN1dHNcIiwgXCJhcmlhLWxhYmVsXCIsIFwiYXJpYS1sYWJlbGxlZGJ5XCIsIFwiYXJpYS1saXZlXCIsIFwiYXJpYS1vd25zXCIsIFwiYXJpYS1yZWxldmFudFwiLCBcImFyaWEtcm9sZWRlc2NyaXB0aW9uXCJdLnNvbWUoZnVuY3Rpb24gKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICB2YXIgX3Byb2hpYml0ZWRBdHRyaWJ1dGVzO1xuICAgIHJldHVybiBlbGVtZW50Lmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKSAmJiAhKChfcHJvaGliaXRlZEF0dHJpYnV0ZXMgPSBwcm9oaWJpdGVkQXR0cmlidXRlc1tyb2xlXSkgIT09IG51bGwgJiYgX3Byb2hpYml0ZWRBdHRyaWJ1dGVzICE9PSB2b2lkIDAgJiYgX3Byb2hpYml0ZWRBdHRyaWJ1dGVzLmhhcyhhdHRyaWJ1dGVOYW1lKSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gaWdub3JlUHJlc2VudGF0aW9uYWxSb2xlKGVsZW1lbnQsIGltcGxpY2l0Um9sZSkge1xuICAvLyBodHRwczovL3Jhd2dpdC5jb20vdzNjL2FyaWEvc3RhYmxlLyNjb25mbGljdF9yZXNvbHV0aW9uX3ByZXNlbnRhdGlvbl9ub25lXG4gIHJldHVybiBoYXNHbG9iYWxBcmlhQXR0cmlidXRlcyhlbGVtZW50LCBpbXBsaWNpdFJvbGUpO1xufVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Um9sZShlbGVtZW50KSB7XG4gIHZhciBleHBsaWNpdFJvbGUgPSBnZXRFeHBsaWNpdFJvbGUoZWxlbWVudCk7XG4gIGlmIChleHBsaWNpdFJvbGUgPT09IG51bGwgfHwgcHJlc2VudGF0aW9uUm9sZXMuaW5kZXhPZihleHBsaWNpdFJvbGUpICE9PSAtMSkge1xuICAgIHZhciBpbXBsaWNpdFJvbGUgPSBnZXRJbXBsaWNpdFJvbGUoZWxlbWVudCk7XG4gICAgaWYgKHByZXNlbnRhdGlvblJvbGVzLmluZGV4T2YoZXhwbGljaXRSb2xlIHx8IFwiXCIpID09PSAtMSB8fCBpZ25vcmVQcmVzZW50YXRpb25hbFJvbGUoZWxlbWVudCwgaW1wbGljaXRSb2xlIHx8IFwiXCIpKSB7XG4gICAgICByZXR1cm4gaW1wbGljaXRSb2xlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZXhwbGljaXRSb2xlO1xufVxuZnVuY3Rpb24gZ2V0SW1wbGljaXRSb2xlKGVsZW1lbnQpIHtcbiAgdmFyIG1hcHBlZEJ5VGFnID0gbG9jYWxOYW1lVG9Sb2xlTWFwcGluZ3NbZ2V0TG9jYWxOYW1lKGVsZW1lbnQpXTtcbiAgaWYgKG1hcHBlZEJ5VGFnICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbWFwcGVkQnlUYWc7XG4gIH1cbiAgc3dpdGNoIChnZXRMb2NhbE5hbWUoZWxlbWVudCkpIHtcbiAgICBjYXNlIFwiYVwiOlxuICAgIGNhc2UgXCJhcmVhXCI6XG4gICAgY2FzZSBcImxpbmtcIjpcbiAgICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShcImhyZWZcIikpIHtcbiAgICAgICAgcmV0dXJuIFwibGlua1wiO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImltZ1wiOlxuICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiYWx0XCIpID09PSBcIlwiICYmICFpZ25vcmVQcmVzZW50YXRpb25hbFJvbGUoZWxlbWVudCwgXCJpbWdcIikpIHtcbiAgICAgICAgcmV0dXJuIFwicHJlc2VudGF0aW9uXCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gXCJpbWdcIjtcbiAgICBjYXNlIFwiaW5wdXRcIjpcbiAgICAgIHtcbiAgICAgICAgdmFyIF9yZWYgPSBlbGVtZW50LFxuICAgICAgICAgIHR5cGUgPSBfcmVmLnR5cGU7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJidXR0b25cIjpcbiAgICAgICAgICBjYXNlIFwiaW1hZ2VcIjpcbiAgICAgICAgICBjYXNlIFwicmVzZXRcIjpcbiAgICAgICAgICBjYXNlIFwic3VibWl0XCI6XG4gICAgICAgICAgICByZXR1cm4gXCJidXR0b25cIjtcbiAgICAgICAgICBjYXNlIFwiY2hlY2tib3hcIjpcbiAgICAgICAgICBjYXNlIFwicmFkaW9cIjpcbiAgICAgICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgICAgIGNhc2UgXCJyYW5nZVwiOlxuICAgICAgICAgICAgcmV0dXJuIFwic2xpZGVyXCI7XG4gICAgICAgICAgY2FzZSBcImVtYWlsXCI6XG4gICAgICAgICAgY2FzZSBcInRlbFwiOlxuICAgICAgICAgIGNhc2UgXCJ0ZXh0XCI6XG4gICAgICAgICAgY2FzZSBcInVybFwiOlxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKFwibGlzdFwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gXCJjb21ib2JveFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFwidGV4dGJveFwiO1xuICAgICAgICAgIGNhc2UgXCJzZWFyY2hcIjpcbiAgICAgICAgICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShcImxpc3RcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiY29tYm9ib3hcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBcInNlYXJjaGJveFwiO1xuICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgICAgIHJldHVybiBcInNwaW5idXR0b25cIjtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBjYXNlIFwic2VsZWN0XCI6XG4gICAgICBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiKSB8fCBlbGVtZW50LnNpemUgPiAxKSB7XG4gICAgICAgIHJldHVybiBcImxpc3Rib3hcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBcImNvbWJvYm94XCI7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiBnZXRFeHBsaWNpdFJvbGUoZWxlbWVudCkge1xuICB2YXIgcm9sZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicm9sZVwiKTtcbiAgaWYgKHJvbGUgIT09IG51bGwpIHtcbiAgICB2YXIgZXhwbGljaXRSb2xlID0gcm9sZS50cmltKCkuc3BsaXQoXCIgXCIpWzBdO1xuICAgIC8vIFN0cmluZy5wcm90b3R5cGUuc3BsaXQoc2VwLCBsaW1pdCkgd2lsbCBhbHdheXMgcmV0dXJuIGFuIGFycmF5IHdpdGggYXQgbGVhc3Qgb25lIG1lbWJlclxuICAgIC8vIGFzIGxvbmcgYXMgbGltaXQgaXMgZWl0aGVyIHVuZGVmaW5lZCBvciA+IDBcbiAgICBpZiAoZXhwbGljaXRSb2xlLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBleHBsaWNpdFJvbGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2V0Um9sZS5tanMubWFwIiwiZXhwb3J0IHsgZ2V0TG9jYWxOYW1lIH0gZnJvbSBcIi4vZ2V0Um9sZS5tanNcIjtcbmltcG9ydCBnZXRSb2xlLCB7IGdldExvY2FsTmFtZSB9IGZyb20gXCIuL2dldFJvbGUubWpzXCI7XG5leHBvcnQgdmFyIHByZXNlbnRhdGlvblJvbGVzID0gW1wicHJlc2VudGF0aW9uXCIsIFwibm9uZVwiXTtcbmV4cG9ydCBmdW5jdGlvbiBpc0VsZW1lbnQobm9kZSkge1xuICByZXR1cm4gbm9kZSAhPT0gbnVsbCAmJiBub2RlLm5vZGVUeXBlID09PSBub2RlLkVMRU1FTlRfTk9ERTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0hUTUxUYWJsZUNhcHRpb25FbGVtZW50KG5vZGUpIHtcbiAgcmV0dXJuIGlzRWxlbWVudChub2RlKSAmJiBnZXRMb2NhbE5hbWUobm9kZSkgPT09IFwiY2FwdGlvblwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzSFRNTElucHV0RWxlbWVudChub2RlKSB7XG4gIHJldHVybiBpc0VsZW1lbnQobm9kZSkgJiYgZ2V0TG9jYWxOYW1lKG5vZGUpID09PSBcImlucHV0XCI7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNIVE1MT3B0R3JvdXBFbGVtZW50KG5vZGUpIHtcbiAgcmV0dXJuIGlzRWxlbWVudChub2RlKSAmJiBnZXRMb2NhbE5hbWUobm9kZSkgPT09IFwib3B0Z3JvdXBcIjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0hUTUxTZWxlY3RFbGVtZW50KG5vZGUpIHtcbiAgcmV0dXJuIGlzRWxlbWVudChub2RlKSAmJiBnZXRMb2NhbE5hbWUobm9kZSkgPT09IFwic2VsZWN0XCI7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNIVE1MVGFibGVFbGVtZW50KG5vZGUpIHtcbiAgcmV0dXJuIGlzRWxlbWVudChub2RlKSAmJiBnZXRMb2NhbE5hbWUobm9kZSkgPT09IFwidGFibGVcIjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0hUTUxUZXh0QXJlYUVsZW1lbnQobm9kZSkge1xuICByZXR1cm4gaXNFbGVtZW50KG5vZGUpICYmIGdldExvY2FsTmFtZShub2RlKSA9PT0gXCJ0ZXh0YXJlYVwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNhZmVXaW5kb3cobm9kZSkge1xuICB2YXIgX3JlZiA9IG5vZGUub3duZXJEb2N1bWVudCA9PT0gbnVsbCA/IG5vZGUgOiBub2RlLm93bmVyRG9jdW1lbnQsXG4gICAgZGVmYXVsdFZpZXcgPSBfcmVmLmRlZmF1bHRWaWV3O1xuICBpZiAoZGVmYXVsdFZpZXcgPT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibm8gd2luZG93IGF2YWlsYWJsZVwiKTtcbiAgfVxuICByZXR1cm4gZGVmYXVsdFZpZXc7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNIVE1MRmllbGRTZXRFbGVtZW50KG5vZGUpIHtcbiAgcmV0dXJuIGlzRWxlbWVudChub2RlKSAmJiBnZXRMb2NhbE5hbWUobm9kZSkgPT09IFwiZmllbGRzZXRcIjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0hUTUxMZWdlbmRFbGVtZW50KG5vZGUpIHtcbiAgcmV0dXJuIGlzRWxlbWVudChub2RlKSAmJiBnZXRMb2NhbE5hbWUobm9kZSkgPT09IFwibGVnZW5kXCI7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNIVE1MU2xvdEVsZW1lbnQobm9kZSkge1xuICByZXR1cm4gaXNFbGVtZW50KG5vZGUpICYmIGdldExvY2FsTmFtZShub2RlKSA9PT0gXCJzbG90XCI7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNTVkdFbGVtZW50KG5vZGUpIHtcbiAgcmV0dXJuIGlzRWxlbWVudChub2RlKSAmJiBub2RlLm93bmVyU1ZHRWxlbWVudCAhPT0gdW5kZWZpbmVkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzU1ZHU1ZHRWxlbWVudChub2RlKSB7XG4gIHJldHVybiBpc0VsZW1lbnQobm9kZSkgJiYgZ2V0TG9jYWxOYW1lKG5vZGUpID09PSBcInN2Z1wiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzU1ZHVGl0bGVFbGVtZW50KG5vZGUpIHtcbiAgcmV0dXJuIGlzU1ZHRWxlbWVudChub2RlKSAmJiBnZXRMb2NhbE5hbWUobm9kZSkgPT09IFwidGl0bGVcIjtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlIC1cbiAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVOYW1lIC1cbiAqIEByZXR1cm5zIHtFbGVtZW50W119IC1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHF1ZXJ5SWRSZWZzKG5vZGUsIGF0dHJpYnV0ZU5hbWUpIHtcbiAgaWYgKGlzRWxlbWVudChub2RlKSAmJiBub2RlLmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uIC0tIHNhZmUgZHVlIHRvIGhhc0F0dHJpYnV0ZSBjaGVja1xuICAgIHZhciBpZHMgPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKS5zcGxpdChcIiBcIik7XG5cbiAgICAvLyBCcm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgc2hhZG93IERPTSB3b24ndCBoYXZlIGdldFJvb3ROb2RlXG4gICAgdmFyIHJvb3QgPSBub2RlLmdldFJvb3ROb2RlID8gbm9kZS5nZXRSb290Tm9kZSgpIDogbm9kZS5vd25lckRvY3VtZW50O1xuICAgIHJldHVybiBpZHMubWFwKGZ1bmN0aW9uIChpZCkge1xuICAgICAgcmV0dXJuIHJvb3QuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIH0pLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQgIT09IG51bGw7XG4gICAgfVxuICAgIC8vIFRPRE86IHdoeSBkb2VzIHRoaXMgbm90IG5hcnJvdz9cbiAgICApO1xuICB9XG4gIHJldHVybiBbXTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBoYXNBbnlDb25jcmV0ZVJvbGVzKG5vZGUsIHJvbGVzKSB7XG4gIGlmIChpc0VsZW1lbnQobm9kZSkpIHtcbiAgICByZXR1cm4gcm9sZXMuaW5kZXhPZihnZXRSb2xlKG5vZGUpKSAhPT0gLTE7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbC5tanMubWFwIiwiLyoqXG4gKiBpbXBsZW1lbnRzIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9hY2NuYW1lL1xuICovXG5pbXBvcnQgQXJyYXlGcm9tIGZyb20gXCIuL3BvbHlmaWxscy9hcnJheS5mcm9tLm1qc1wiO1xuaW1wb3J0IFNldExpa2UgZnJvbSBcIi4vcG9seWZpbGxzL1NldExpa2UubWpzXCI7XG5pbXBvcnQgeyBoYXNBbnlDb25jcmV0ZVJvbGVzLCBpc0VsZW1lbnQsIGlzSFRNTFRhYmxlQ2FwdGlvbkVsZW1lbnQsIGlzSFRNTElucHV0RWxlbWVudCwgaXNIVE1MU2VsZWN0RWxlbWVudCwgaXNIVE1MVGV4dEFyZWFFbGVtZW50LCBzYWZlV2luZG93LCBpc0hUTUxGaWVsZFNldEVsZW1lbnQsIGlzSFRNTExlZ2VuZEVsZW1lbnQsIGlzSFRNTE9wdEdyb3VwRWxlbWVudCwgaXNIVE1MVGFibGVFbGVtZW50LCBpc0hUTUxTbG90RWxlbWVudCwgaXNTVkdTVkdFbGVtZW50LCBpc1NWR1RpdGxlRWxlbWVudCwgcXVlcnlJZFJlZnMsIGdldExvY2FsTmFtZSwgcHJlc2VudGF0aW9uUm9sZXMgfSBmcm9tIFwiLi91dGlsLm1qc1wiO1xuXG4vKipcbiAqICBBIHN0cmluZyBvZiBjaGFyYWN0ZXJzIHdoZXJlIGFsbCBjYXJyaWFnZSByZXR1cm5zLCBuZXdsaW5lcywgdGFicywgYW5kIGZvcm0tZmVlZHMgYXJlIHJlcGxhY2VkIHdpdGggYSBzaW5nbGUgc3BhY2UsIGFuZCBtdWx0aXBsZSBzcGFjZXMgYXJlIHJlZHVjZWQgdG8gYSBzaW5nbGUgc3BhY2UuIFRoZSBzdHJpbmcgY29udGFpbnMgb25seSBjaGFyYWN0ZXIgZGF0YTsgaXQgZG9lcyBub3QgY29udGFpbiBhbnkgbWFya3VwLlxuICovXG5cbi8qKlxuICogaW50ZXJmYWNlIGZvciBhbiBvcHRpb25zLWJhZyB3aGVyZSBgd2luZG93LmdldENvbXB1dGVkU3R5bGVgIGNhbiBiZSBtb2NrZWRcbiAqL1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC1cbiAqIEByZXR1cm5zIHtGbGF0U3RyaW5nfSAtXG4gKi9cbmZ1bmN0aW9uIGFzRmxhdFN0cmluZyhzKSB7XG4gIHJldHVybiBzLnRyaW0oKS5yZXBsYWNlKC9cXHNcXHMrL2csIFwiIFwiKTtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIG5vZGUgLVxuICogQHBhcmFtIG9wdGlvbnMgLSBUaGVzZSBhcmUgbm90IG9wdGlvbmFsIHRvIHByZXZlbnQgYWNjaWRlbnRhbGx5IGNhbGxpbmcgaXQgd2l0aG91dCBvcHRpb25zIGluIGBjb21wdXRlQWNjZXNzaWJsZU5hbWVgXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gLVxuICovXG5mdW5jdGlvbiBpc0hpZGRlbihub2RlLCBnZXRDb21wdXRlZFN0eWxlSW1wbGVtZW50YXRpb24pIHtcbiAgaWYgKCFpc0VsZW1lbnQobm9kZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKG5vZGUuaGFzQXR0cmlidXRlKFwiaGlkZGVuXCIpIHx8IG5vZGUuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZUltcGxlbWVudGF0aW9uKG5vZGUpO1xuICByZXR1cm4gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShcImRpc3BsYXlcIikgPT09IFwibm9uZVwiIHx8IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCJ2aXNpYmlsaXR5XCIpID09PSBcImhpZGRlblwiO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAtXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSBBcyBkZWZpbmVkIGluIHN0ZXAgMkUgb2YgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2FjY25hbWUvI21hcHBpbmdfYWRkaXRpb25hbF9uZF90ZVxuICovXG5mdW5jdGlvbiBpc0NvbnRyb2wobm9kZSkge1xuICByZXR1cm4gaGFzQW55Q29uY3JldGVSb2xlcyhub2RlLCBbXCJidXR0b25cIiwgXCJjb21ib2JveFwiLCBcImxpc3Rib3hcIiwgXCJ0ZXh0Ym94XCJdKSB8fCBoYXNBYnN0cmFjdFJvbGUobm9kZSwgXCJyYW5nZVwiKTtcbn1cbmZ1bmN0aW9uIGhhc0Fic3RyYWN0Um9sZShub2RlLCByb2xlKSB7XG4gIGlmICghaXNFbGVtZW50KG5vZGUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN3aXRjaCAocm9sZSkge1xuICAgIGNhc2UgXCJyYW5nZVwiOlxuICAgICAgcmV0dXJuIGhhc0FueUNvbmNyZXRlUm9sZXMobm9kZSwgW1wibWV0ZXJcIiwgXCJwcm9ncmVzc2JhclwiLCBcInNjcm9sbGJhclwiLCBcInNsaWRlclwiLCBcInNwaW5idXR0b25cIl0pO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiTm8ga25vd2xlZGdlIGFib3V0IGFic3RyYWN0IHJvbGUgJ1wiLmNvbmNhdChyb2xlLCBcIicuIFRoaXMgaXMgbGlrZWx5IGEgYnVnIDooXCIpKTtcbiAgfVxufVxuXG4vKipcbiAqIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCBidXQgYWxzbyBjb25zaWRlcnMgb3duZWQgdHJlZVxuICogQHBhcmFtIGVsZW1lbnRcbiAqIEBwYXJhbSBzZWxlY3RvcnNcbiAqL1xuZnVuY3Rpb24gcXVlcnlTZWxlY3RvckFsbFN1YnRyZWUoZWxlbWVudCwgc2VsZWN0b3JzKSB7XG4gIHZhciBlbGVtZW50cyA9IEFycmF5RnJvbShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzKSk7XG4gIHF1ZXJ5SWRSZWZzKGVsZW1lbnQsIFwiYXJpYS1vd25zXCIpLmZvckVhY2goZnVuY3Rpb24gKHJvb3QpIHtcbiAgICAvLyBiYWJlbCB0cmFuc3BpbGVzIHRoaXMgYXNzdW1pbmcgYW4gaXRlcmF0b3JcbiAgICBlbGVtZW50cy5wdXNoLmFwcGx5KGVsZW1lbnRzLCBBcnJheUZyb20ocm9vdC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycykpKTtcbiAgfSk7XG4gIHJldHVybiBlbGVtZW50cztcbn1cbmZ1bmN0aW9uIHF1ZXJ5U2VsZWN0ZWRPcHRpb25zKGxpc3Rib3gpIHtcbiAgaWYgKGlzSFRNTFNlbGVjdEVsZW1lbnQobGlzdGJveCkpIHtcbiAgICAvLyBJRTExIHBvbHlmaWxsXG4gICAgcmV0dXJuIGxpc3Rib3guc2VsZWN0ZWRPcHRpb25zIHx8IHF1ZXJ5U2VsZWN0b3JBbGxTdWJ0cmVlKGxpc3Rib3gsIFwiW3NlbGVjdGVkXVwiKTtcbiAgfVxuICByZXR1cm4gcXVlcnlTZWxlY3RvckFsbFN1YnRyZWUobGlzdGJveCwgJ1thcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpO1xufVxuZnVuY3Rpb24gaXNNYXJrZWRQcmVzZW50YXRpb25hbChub2RlKSB7XG4gIHJldHVybiBoYXNBbnlDb25jcmV0ZVJvbGVzKG5vZGUsIHByZXNlbnRhdGlvblJvbGVzKTtcbn1cblxuLyoqXG4gKiBFbGVtZW50cyBzcGVjaWZpY2FsbHkgbGlzdGVkIGluIGh0bWwtYWFtXG4gKlxuICogV2UgZG9uJ3QgbmVlZCB0aGlzIGZvciBgbGFiZWxgIG9yIGBsZWdlbmRgIGVsZW1lbnRzLlxuICogVGhlaXIgaW1wbGljaXQgcm9sZXMgYWxyZWFkeSBhbGxvdyBcIm5hbWluZyBmcm9tIGNvbnRlbnRcIi5cbiAqXG4gKiBzb3VyY2VzOlxuICpcbiAqIC0gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2h0bWwtYWFtLyN0YWJsZS1lbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlSG9zdExhbmd1YWdlVGV4dEFsdGVybmF0aXZlRWxlbWVudChub2RlKSB7XG4gIHJldHVybiBpc0hUTUxUYWJsZUNhcHRpb25FbGVtZW50KG5vZGUpO1xufVxuXG4vKipcbiAqIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9hcmlhLyNuYW1lZnJvbWNvbnRlbnRcbiAqL1xuZnVuY3Rpb24gYWxsb3dzTmFtZUZyb21Db250ZW50KG5vZGUpIHtcbiAgcmV0dXJuIGhhc0FueUNvbmNyZXRlUm9sZXMobm9kZSwgW1wiYnV0dG9uXCIsIFwiY2VsbFwiLCBcImNoZWNrYm94XCIsIFwiY29sdW1uaGVhZGVyXCIsIFwiZ3JpZGNlbGxcIiwgXCJoZWFkaW5nXCIsIFwibGFiZWxcIiwgXCJsZWdlbmRcIiwgXCJsaW5rXCIsIFwibWVudWl0ZW1cIiwgXCJtZW51aXRlbWNoZWNrYm94XCIsIFwibWVudWl0ZW1yYWRpb1wiLCBcIm9wdGlvblwiLCBcInJhZGlvXCIsIFwicm93XCIsIFwicm93aGVhZGVyXCIsIFwic3dpdGNoXCIsIFwidGFiXCIsIFwidG9vbHRpcFwiLCBcInRyZWVpdGVtXCJdKTtcbn1cblxuLyoqXG4gKiBUT0RPIGh0dHBzOi8vZ2l0aHViLmNvbS9lcHMxbG9uL2RvbS1hY2Nlc3NpYmlsaXR5LWFwaS9pc3N1ZXMvMTAwXG4gKi9cbmZ1bmN0aW9uIGlzRGVzY2VuZGFudE9mTmF0aXZlSG9zdExhbmd1YWdlVGV4dEFsdGVybmF0aXZlRWxlbWVudChcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgLS0gbm90IGltcGxlbWVudGVkIHlldFxubm9kZSkge1xuICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBnZXRWYWx1ZU9mVGV4dGJveChlbGVtZW50KSB7XG4gIGlmIChpc0hUTUxJbnB1dEVsZW1lbnQoZWxlbWVudCkgfHwgaXNIVE1MVGV4dEFyZWFFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XG4gIH1cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2VwczFsb24vZG9tLWFjY2Vzc2liaWxpdHktYXBpL2lzc3Vlcy80XG4gIHJldHVybiBlbGVtZW50LnRleHRDb250ZW50IHx8IFwiXCI7XG59XG5mdW5jdGlvbiBnZXRUZXh0dWFsQ29udGVudChkZWNsYXJhdGlvbikge1xuICB2YXIgY29udGVudCA9IGRlY2xhcmF0aW9uLmdldFByb3BlcnR5VmFsdWUoXCJjb250ZW50XCIpO1xuICBpZiAoL15bXCInXS4qW1wiJ10kLy50ZXN0KGNvbnRlbnQpKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQuc2xpY2UoMSwgLTEpO1xuICB9XG4gIHJldHVybiBcIlwiO1xufVxuXG4vKipcbiAqIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjY2F0ZWdvcnktbGFiZWxcbiAqIFRPRE86IGZvcm0tYXNzb2NpYXRlZCBjdXN0b20gZWxlbWVudHNcbiAqIEBwYXJhbSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGlzTGFiZWxhYmxlRWxlbWVudChlbGVtZW50KSB7XG4gIHZhciBsb2NhbE5hbWUgPSBnZXRMb2NhbE5hbWUoZWxlbWVudCk7XG4gIHJldHVybiBsb2NhbE5hbWUgPT09IFwiYnV0dG9uXCIgfHwgbG9jYWxOYW1lID09PSBcImlucHV0XCIgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpICE9PSBcImhpZGRlblwiIHx8IGxvY2FsTmFtZSA9PT0gXCJtZXRlclwiIHx8IGxvY2FsTmFtZSA9PT0gXCJvdXRwdXRcIiB8fCBsb2NhbE5hbWUgPT09IFwicHJvZ3Jlc3NcIiB8fCBsb2NhbE5hbWUgPT09IFwic2VsZWN0XCIgfHwgbG9jYWxOYW1lID09PSBcInRleHRhcmVhXCI7XG59XG5cbi8qKlxuICogPiBbLi4uXSwgdGhlbiB0aGUgZmlyc3Qgc3VjaCBkZXNjZW5kYW50IGluIHRyZWUgb3JkZXIgaXMgdGhlIGxhYmVsIGVsZW1lbnQncyBsYWJlbGVkIGNvbnRyb2wuXG4gKiAtLSBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI2xhYmVsZWQtY29udHJvbFxuICogQHBhcmFtIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gZmluZExhYmVsYWJsZUVsZW1lbnQoZWxlbWVudCkge1xuICBpZiAoaXNMYWJlbGFibGVFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbiAgdmFyIGxhYmVsYWJsZUVsZW1lbnQgPSBudWxsO1xuICBlbGVtZW50LmNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGROb2RlKSB7XG4gICAgaWYgKGxhYmVsYWJsZUVsZW1lbnQgPT09IG51bGwgJiYgaXNFbGVtZW50KGNoaWxkTm9kZSkpIHtcbiAgICAgIHZhciBkZXNjZW5kYW50TGFiZWxhYmxlRWxlbWVudCA9IGZpbmRMYWJlbGFibGVFbGVtZW50KGNoaWxkTm9kZSk7XG4gICAgICBpZiAoZGVzY2VuZGFudExhYmVsYWJsZUVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgICAgbGFiZWxhYmxlRWxlbWVudCA9IGRlc2NlbmRhbnRMYWJlbGFibGVFbGVtZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBsYWJlbGFibGVFbGVtZW50O1xufVxuXG4vKipcbiAqIFBvbHlmaWxsIG9mIEhUTUxMYWJlbEVsZW1lbnQuY29udHJvbFxuICogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCNsYWJlbGVkLWNvbnRyb2xcbiAqIEBwYXJhbSBsYWJlbFxuICovXG5mdW5jdGlvbiBnZXRDb250cm9sT2ZMYWJlbChsYWJlbCkge1xuICBpZiAobGFiZWwuY29udHJvbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGxhYmVsLmNvbnRyb2w7XG4gIH1cbiAgdmFyIGh0bWxGb3IgPSBsYWJlbC5nZXRBdHRyaWJ1dGUoXCJmb3JcIik7XG4gIGlmIChodG1sRm9yICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGxhYmVsLm93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHRtbEZvcik7XG4gIH1cbiAgcmV0dXJuIGZpbmRMYWJlbGFibGVFbGVtZW50KGxhYmVsKTtcbn1cblxuLyoqXG4gKiBQb2x5ZmlsbCBvZiBIVE1MSW5wdXRFbGVtZW50LmxhYmVsc1xuICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0hUTUxJbnB1dEVsZW1lbnQvbGFiZWxzXG4gKiBAcGFyYW0gZWxlbWVudFxuICovXG5mdW5jdGlvbiBnZXRMYWJlbHMoZWxlbWVudCkge1xuICB2YXIgbGFiZWxzUHJvcGVydHkgPSBlbGVtZW50LmxhYmVscztcbiAgaWYgKGxhYmVsc1Byb3BlcnR5ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGxhYmVsc1Byb3BlcnR5O1xuICB9XG4gIGlmIChsYWJlbHNQcm9wZXJ0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIEFycmF5RnJvbShsYWJlbHNQcm9wZXJ0eSk7XG4gIH1cblxuICAvLyBwb2x5ZmlsbFxuICBpZiAoIWlzTGFiZWxhYmxlRWxlbWVudChlbGVtZW50KSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBkb2N1bWVudCA9IGVsZW1lbnQub3duZXJEb2N1bWVudDtcbiAgcmV0dXJuIEFycmF5RnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwibGFiZWxcIikpLmZpbHRlcihmdW5jdGlvbiAobGFiZWwpIHtcbiAgICByZXR1cm4gZ2V0Q29udHJvbE9mTGFiZWwobGFiZWwpID09PSBlbGVtZW50O1xuICB9KTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBjb250ZW50cyBvZiBhIHNsb3QgdXNlZCBmb3IgY29tcHV0aW5nIHRoZSBhY2NuYW1lXG4gKiBAcGFyYW0gc2xvdFxuICovXG5mdW5jdGlvbiBnZXRTbG90Q29udGVudHMoc2xvdCkge1xuICAvLyBDb21wdXRpbmcgdGhlIGFjY2Vzc2libGUgbmFtZSBmb3IgZWxlbWVudHMgY29udGFpbmluZyBzbG90cyBpcyBub3RcbiAgLy8gY3VycmVudGx5IGRlZmluZWQgaW4gdGhlIHNwZWMuIFRoaXMgaW1wbGVtZW50YXRpb24gcmVmbGVjdHMgdGhlXG4gIC8vIGJlaGF2aW9yIG9mIE5WREEgMjAyMC4yL0ZpcmVmb3ggODEgYW5kIGlPUyBWb2ljZU92ZXIvU2FmYXJpIDEzLjYuXG4gIHZhciBhc3NpZ25lZE5vZGVzID0gc2xvdC5hc3NpZ25lZE5vZGVzKCk7XG4gIGlmIChhc3NpZ25lZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIGlmIG5vIG5vZGVzIGFyZSBhc3NpZ25lZCB0byB0aGUgc2xvdCwgaXQgZGlzcGxheXMgdGhlIGRlZmF1bHQgY29udGVudFxuICAgIHJldHVybiBBcnJheUZyb20oc2xvdC5jaGlsZE5vZGVzKTtcbiAgfVxuICByZXR1cm4gYXNzaWduZWROb2Rlcztcbn1cblxuLyoqXG4gKiBpbXBsZW1lbnRzIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9hY2NuYW1lLyNtYXBwaW5nX2FkZGl0aW9uYWxfbmRfdGVcbiAqIEBwYXJhbSByb290XG4gKiBAcGFyYW0gb3B0aW9uc1xuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVUZXh0QWx0ZXJuYXRpdmUocm9vdCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gIHZhciBjb25zdWx0ZWROb2RlcyA9IG5ldyBTZXRMaWtlKCk7XG4gIHZhciBjb21wdXRlZFN0eWxlcyA9IHR5cGVvZiBNYXAgPT09IFwidW5kZWZpbmVkXCIgPyB1bmRlZmluZWQgOiBuZXcgTWFwKCk7XG4gIHZhciB3aW5kb3cgPSBzYWZlV2luZG93KHJvb3QpO1xuICB2YXIgX29wdGlvbnMkY29tcHV0ZSA9IG9wdGlvbnMuY29tcHV0ZSxcbiAgICBjb21wdXRlID0gX29wdGlvbnMkY29tcHV0ZSA9PT0gdm9pZCAwID8gXCJuYW1lXCIgOiBfb3B0aW9ucyRjb21wdXRlLFxuICAgIF9vcHRpb25zJGNvbXB1dGVkU3R5bCA9IG9wdGlvbnMuY29tcHV0ZWRTdHlsZVN1cHBvcnRzUHNldWRvRWxlbWVudHMsXG4gICAgY29tcHV0ZWRTdHlsZVN1cHBvcnRzUHNldWRvRWxlbWVudHMgPSBfb3B0aW9ucyRjb21wdXRlZFN0eWwgPT09IHZvaWQgMCA/IG9wdGlvbnMuZ2V0Q29tcHV0ZWRTdHlsZSAhPT0gdW5kZWZpbmVkIDogX29wdGlvbnMkY29tcHV0ZWRTdHlsLFxuICAgIF9vcHRpb25zJGdldENvbXB1dGVkUyA9IG9wdGlvbnMuZ2V0Q29tcHV0ZWRTdHlsZSxcbiAgICB1bmNhY2hlZEdldENvbXB1dGVkU3R5bGUgPSBfb3B0aW9ucyRnZXRDb21wdXRlZFMgPT09IHZvaWQgMCA/IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlLmJpbmQod2luZG93KSA6IF9vcHRpb25zJGdldENvbXB1dGVkUyxcbiAgICBfb3B0aW9ucyRoaWRkZW4gPSBvcHRpb25zLmhpZGRlbixcbiAgICBoaWRkZW4gPSBfb3B0aW9ucyRoaWRkZW4gPT09IHZvaWQgMCA/IGZhbHNlIDogX29wdGlvbnMkaGlkZGVuO1xuICB2YXIgZ2V0Q29tcHV0ZWRTdHlsZSA9IGZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWwsIHBzZXVkb0VsZW1lbnQpIHtcbiAgICAvLyBXZSBkb24ndCBjYWNoZSB0aGUgcHNldWRvRWxlbWVudCBzdHlsZXMgYW5kIGNhbGxzIHdpdGggcHN1ZWRvIGVsZW1lbnRzXG4gICAgLy8gc2hvdWxkIHVzZSB0aGUgdW5jYWNoZWQgdmVyc2lvbiBpbnN0ZWFkXG4gICAgaWYgKHBzZXVkb0VsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidXNlIHVuY2FjaGVkR2V0Q29tcHV0ZWRTdHlsZSBkaXJlY3RseSBmb3IgcHNldWRvIGVsZW1lbnRzXCIpO1xuICAgIH1cbiAgICAvLyBJZiBNYXAgaXMgbm90IGF2YWlsYWJsZSwgaXQgaXMgcHJvYmFibHkgZmFzdGVyIHRvIGp1c3QgdXNlIHRoZSB1bmNhY2hlZFxuICAgIC8vIHZlcnNpb24gc2luY2UgYSBwb2x5ZmlsbCBsb29rdXAgd291bGQgYmUgTyhuKSBpbnN0ZWFkIG9mIE8oMSkgYW5kXG4gICAgLy8gdGhlIGdldENvbXB1dGVkU3R5bGUgZnVuY3Rpb24gaW4gdGhvc2UgZW52aXJvbm1lbnRzKGUuZy4gSUUxMSkgaXMgZmFzdFxuICAgIGlmIChjb21wdXRlZFN0eWxlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdW5jYWNoZWRHZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICB9XG4gICAgdmFyIGNhY2hlZFN0eWxlcyA9IGNvbXB1dGVkU3R5bGVzLmdldChlbCk7XG4gICAgaWYgKGNhY2hlZFN0eWxlcykge1xuICAgICAgcmV0dXJuIGNhY2hlZFN0eWxlcztcbiAgICB9XG4gICAgdmFyIHN0eWxlID0gdW5jYWNoZWRHZXRDb21wdXRlZFN0eWxlKGVsLCBwc2V1ZG9FbGVtZW50KTtcbiAgICBjb21wdXRlZFN0eWxlcy5zZXQoZWwsIHN0eWxlKTtcbiAgICByZXR1cm4gc3R5bGU7XG4gIH07XG5cbiAgLy8gMkYuaVxuICBmdW5jdGlvbiBjb21wdXRlTWlzY1RleHRBbHRlcm5hdGl2ZShub2RlLCBjb250ZXh0KSB7XG4gICAgdmFyIGFjY3VtdWxhdGVkVGV4dCA9IFwiXCI7XG4gICAgaWYgKGlzRWxlbWVudChub2RlKSAmJiBjb21wdXRlZFN0eWxlU3VwcG9ydHNQc2V1ZG9FbGVtZW50cykge1xuICAgICAgdmFyIHBzZXVkb0JlZm9yZSA9IHVuY2FjaGVkR2V0Q29tcHV0ZWRTdHlsZShub2RlLCBcIjo6YmVmb3JlXCIpO1xuICAgICAgdmFyIGJlZm9yZUNvbnRlbnQgPSBnZXRUZXh0dWFsQ29udGVudChwc2V1ZG9CZWZvcmUpO1xuICAgICAgYWNjdW11bGF0ZWRUZXh0ID0gXCJcIi5jb25jYXQoYmVmb3JlQ29udGVudCwgXCIgXCIpLmNvbmNhdChhY2N1bXVsYXRlZFRleHQpO1xuICAgIH1cblxuICAgIC8vIEZJWE1FOiBJbmNsdWRpbmcgYXJpYS1vd25zIGlzIG5vdCBkZWZpbmVkIGluIHRoZSBzcGVjXG4gICAgLy8gQnV0IGl0IGlzIHJlcXVpcmVkIGluIHRoZSB3ZWItcGxhdGZvcm0tdGVzdFxuICAgIHZhciBjaGlsZE5vZGVzID0gaXNIVE1MU2xvdEVsZW1lbnQobm9kZSkgPyBnZXRTbG90Q29udGVudHMobm9kZSkgOiBBcnJheUZyb20obm9kZS5jaGlsZE5vZGVzKS5jb25jYXQocXVlcnlJZFJlZnMobm9kZSwgXCJhcmlhLW93bnNcIikpO1xuICAgIGNoaWxkTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgIHZhciByZXN1bHQgPSBjb21wdXRlVGV4dEFsdGVybmF0aXZlKGNoaWxkLCB7XG4gICAgICAgIGlzRW1iZWRkZWRJbkxhYmVsOiBjb250ZXh0LmlzRW1iZWRkZWRJbkxhYmVsLFxuICAgICAgICBpc1JlZmVyZW5jZWQ6IGZhbHNlLFxuICAgICAgICByZWN1cnNpb246IHRydWVcbiAgICAgIH0pO1xuICAgICAgLy8gVE9ETzogVW5jbGVhciB3aHkgZGlzcGxheSBhZmZlY3RzIGRlbGltaXRlclxuICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93M2MvYWNjbmFtZS9pc3N1ZXMvM1xuICAgICAgdmFyIGRpc3BsYXkgPSBpc0VsZW1lbnQoY2hpbGQpID8gZ2V0Q29tcHV0ZWRTdHlsZShjaGlsZCkuZ2V0UHJvcGVydHlWYWx1ZShcImRpc3BsYXlcIikgOiBcImlubGluZVwiO1xuICAgICAgdmFyIHNlcGFyYXRvciA9IGRpc3BsYXkgIT09IFwiaW5saW5lXCIgPyBcIiBcIiA6IFwiXCI7XG4gICAgICAvLyB0cmFpbGluZyBzZXBhcmF0b3IgZm9yIHdwdCB0ZXN0c1xuICAgICAgYWNjdW11bGF0ZWRUZXh0ICs9IFwiXCIuY29uY2F0KHNlcGFyYXRvcikuY29uY2F0KHJlc3VsdCkuY29uY2F0KHNlcGFyYXRvcik7XG4gICAgfSk7XG4gICAgaWYgKGlzRWxlbWVudChub2RlKSAmJiBjb21wdXRlZFN0eWxlU3VwcG9ydHNQc2V1ZG9FbGVtZW50cykge1xuICAgICAgdmFyIHBzZXVkb0FmdGVyID0gdW5jYWNoZWRHZXRDb21wdXRlZFN0eWxlKG5vZGUsIFwiOjphZnRlclwiKTtcbiAgICAgIHZhciBhZnRlckNvbnRlbnQgPSBnZXRUZXh0dWFsQ29udGVudChwc2V1ZG9BZnRlcik7XG4gICAgICBhY2N1bXVsYXRlZFRleHQgPSBcIlwiLmNvbmNhdChhY2N1bXVsYXRlZFRleHQsIFwiIFwiKS5jb25jYXQoYWZ0ZXJDb250ZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIGFjY3VtdWxhdGVkVGV4dC50cmltKCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGF0dHJpYnV0ZU5hbWVcbiAgICogQHJldHVybnMgQSBzdHJpbmcgbm9uLWVtcHR5IHN0cmluZyBvciBgbnVsbGBcbiAgICovXG4gIGZ1bmN0aW9uIHVzZUF0dHJpYnV0ZShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lKSB7XG4gICAgdmFyIGF0dHJpYnV0ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlTm9kZShhdHRyaWJ1dGVOYW1lKTtcbiAgICBpZiAoYXR0cmlidXRlICE9PSBudWxsICYmICFjb25zdWx0ZWROb2Rlcy5oYXMoYXR0cmlidXRlKSAmJiBhdHRyaWJ1dGUudmFsdWUudHJpbSgpICE9PSBcIlwiKSB7XG4gICAgICBjb25zdWx0ZWROb2Rlcy5hZGQoYXR0cmlidXRlKTtcbiAgICAgIHJldHVybiBhdHRyaWJ1dGUudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGZ1bmN0aW9uIGNvbXB1dGVUb29sdGlwQXR0cmlidXRlVmFsdWUobm9kZSkge1xuICAgIGlmICghaXNFbGVtZW50KG5vZGUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHVzZUF0dHJpYnV0ZShub2RlLCBcInRpdGxlXCIpO1xuICB9XG4gIGZ1bmN0aW9uIGNvbXB1dGVFbGVtZW50VGV4dEFsdGVybmF0aXZlKG5vZGUpIHtcbiAgICBpZiAoIWlzRWxlbWVudChub2RlKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2h0bWwtYWFtLyNmaWVsZHNldC1hbmQtbGVnZW5kLWVsZW1lbnRzXG4gICAgaWYgKGlzSFRNTEZpZWxkU2V0RWxlbWVudChub2RlKSkge1xuICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKG5vZGUpO1xuICAgICAgdmFyIGNoaWxkcmVuID0gQXJyYXlGcm9tKG5vZGUuY2hpbGROb2Rlcyk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICBpZiAoaXNIVE1MTGVnZW5kRWxlbWVudChjaGlsZCkpIHtcbiAgICAgICAgICByZXR1cm4gY29tcHV0ZVRleHRBbHRlcm5hdGl2ZShjaGlsZCwge1xuICAgICAgICAgICAgaXNFbWJlZGRlZEluTGFiZWw6IGZhbHNlLFxuICAgICAgICAgICAgaXNSZWZlcmVuY2VkOiBmYWxzZSxcbiAgICAgICAgICAgIHJlY3Vyc2lvbjogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNIVE1MVGFibGVFbGVtZW50KG5vZGUpKSB7XG4gICAgICAvLyBodHRwczovL3czYy5naXRodWIuaW8vaHRtbC1hYW0vI3RhYmxlLWVsZW1lbnRcbiAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChub2RlKTtcbiAgICAgIHZhciBfY2hpbGRyZW4gPSBBcnJheUZyb20obm9kZS5jaGlsZE5vZGVzKTtcbiAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBfY2hpbGRyZW4ubGVuZ3RoOyBfaSArPSAxKSB7XG4gICAgICAgIHZhciBfY2hpbGQgPSBfY2hpbGRyZW5bX2ldO1xuICAgICAgICBpZiAoaXNIVE1MVGFibGVDYXB0aW9uRWxlbWVudChfY2hpbGQpKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbXB1dGVUZXh0QWx0ZXJuYXRpdmUoX2NoaWxkLCB7XG4gICAgICAgICAgICBpc0VtYmVkZGVkSW5MYWJlbDogZmFsc2UsXG4gICAgICAgICAgICBpc1JlZmVyZW5jZWQ6IGZhbHNlLFxuICAgICAgICAgICAgcmVjdXJzaW9uOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc1NWR1NWR0VsZW1lbnQobm9kZSkpIHtcbiAgICAgIC8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9zdmctYWFtLTEuMC9cbiAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChub2RlKTtcbiAgICAgIHZhciBfY2hpbGRyZW4yID0gQXJyYXlGcm9tKG5vZGUuY2hpbGROb2Rlcyk7XG4gICAgICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBfY2hpbGRyZW4yLmxlbmd0aDsgX2kyICs9IDEpIHtcbiAgICAgICAgdmFyIF9jaGlsZDIgPSBfY2hpbGRyZW4yW19pMl07XG4gICAgICAgIGlmIChpc1NWR1RpdGxlRWxlbWVudChfY2hpbGQyKSkge1xuICAgICAgICAgIHJldHVybiBfY2hpbGQyLnRleHRDb250ZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2UgaWYgKGdldExvY2FsTmFtZShub2RlKSA9PT0gXCJpbWdcIiB8fCBnZXRMb2NhbE5hbWUobm9kZSkgPT09IFwiYXJlYVwiKSB7XG4gICAgICAvLyBodHRwczovL3czYy5naXRodWIuaW8vaHRtbC1hYW0vI2FyZWEtZWxlbWVudFxuICAgICAgLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2h0bWwtYWFtLyNpbWctZWxlbWVudFxuICAgICAgdmFyIG5hbWVGcm9tQWx0ID0gdXNlQXR0cmlidXRlKG5vZGUsIFwiYWx0XCIpO1xuICAgICAgaWYgKG5hbWVGcm9tQWx0ICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBuYW1lRnJvbUFsdDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzSFRNTE9wdEdyb3VwRWxlbWVudChub2RlKSkge1xuICAgICAgdmFyIG5hbWVGcm9tTGFiZWwgPSB1c2VBdHRyaWJ1dGUobm9kZSwgXCJsYWJlbFwiKTtcbiAgICAgIGlmIChuYW1lRnJvbUxhYmVsICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBuYW1lRnJvbUxhYmVsO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNIVE1MSW5wdXRFbGVtZW50KG5vZGUpICYmIChub2RlLnR5cGUgPT09IFwiYnV0dG9uXCIgfHwgbm9kZS50eXBlID09PSBcInN1Ym1pdFwiIHx8IG5vZGUudHlwZSA9PT0gXCJyZXNldFwiKSkge1xuICAgICAgLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2h0bWwtYWFtLyNpbnB1dC10eXBlLXRleHQtaW5wdXQtdHlwZS1wYXNzd29yZC1pbnB1dC10eXBlLXNlYXJjaC1pbnB1dC10eXBlLXRlbC1pbnB1dC10eXBlLWVtYWlsLWlucHV0LXR5cGUtdXJsLWFuZC10ZXh0YXJlYS1lbGVtZW50LWFjY2Vzc2libGUtZGVzY3JpcHRpb24tY29tcHV0YXRpb25cbiAgICAgIHZhciBuYW1lRnJvbVZhbHVlID0gdXNlQXR0cmlidXRlKG5vZGUsIFwidmFsdWVcIik7XG4gICAgICBpZiAobmFtZUZyb21WYWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbmFtZUZyb21WYWx1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gVE9ETzogbDEwblxuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJzdWJtaXRcIikge1xuICAgICAgICByZXR1cm4gXCJTdWJtaXRcIjtcbiAgICAgIH1cbiAgICAgIC8vIFRPRE86IGwxMG5cbiAgICAgIGlmIChub2RlLnR5cGUgPT09IFwicmVzZXRcIikge1xuICAgICAgICByZXR1cm4gXCJSZXNldFwiO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgbGFiZWxzID0gZ2V0TGFiZWxzKG5vZGUpO1xuICAgIGlmIChsYWJlbHMgIT09IG51bGwgJiYgbGFiZWxzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKG5vZGUpO1xuICAgICAgcmV0dXJuIEFycmF5RnJvbShsYWJlbHMpLm1hcChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gY29tcHV0ZVRleHRBbHRlcm5hdGl2ZShlbGVtZW50LCB7XG4gICAgICAgICAgaXNFbWJlZGRlZEluTGFiZWw6IHRydWUsXG4gICAgICAgICAgaXNSZWZlcmVuY2VkOiBmYWxzZSxcbiAgICAgICAgICByZWN1cnNpb246IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGxhYmVsKSB7XG4gICAgICAgIHJldHVybiBsYWJlbC5sZW5ndGggPiAwO1xuICAgICAgfSkuam9pbihcIiBcIik7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2h0bWwtYWFtLyNpbnB1dC10eXBlLWltYWdlLWFjY2Vzc2libGUtbmFtZS1jb21wdXRhdGlvblxuICAgIC8vIFRPRE86IHdwdCB0ZXN0IGNvbnNpZGVyIGxhYmVsIGVsZW1lbnRzIGJ1dCBodG1sLWFhbSBkb2VzIG5vdCBtZW50aW9uIHRoZW1cbiAgICAvLyBXZSBmb2xsb3cgZXhpc3RpbmcgaW1wbGVtZW50YXRpb25zIG92ZXIgc3BlY1xuICAgIGlmIChpc0hUTUxJbnB1dEVsZW1lbnQobm9kZSkgJiYgbm9kZS50eXBlID09PSBcImltYWdlXCIpIHtcbiAgICAgIHZhciBfbmFtZUZyb21BbHQgPSB1c2VBdHRyaWJ1dGUobm9kZSwgXCJhbHRcIik7XG4gICAgICBpZiAoX25hbWVGcm9tQWx0ICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBfbmFtZUZyb21BbHQ7XG4gICAgICB9XG4gICAgICB2YXIgbmFtZUZyb21UaXRsZSA9IHVzZUF0dHJpYnV0ZShub2RlLCBcInRpdGxlXCIpO1xuICAgICAgaWYgKG5hbWVGcm9tVGl0bGUgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5hbWVGcm9tVGl0bGU7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE86IGwxMG5cbiAgICAgIHJldHVybiBcIlN1Ym1pdCBRdWVyeVwiO1xuICAgIH1cbiAgICBpZiAoaGFzQW55Q29uY3JldGVSb2xlcyhub2RlLCBbXCJidXR0b25cIl0pKSB7XG4gICAgICAvLyBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbC1hYW0tMS4wLyNidXR0b24tZWxlbWVudFxuICAgICAgdmFyIG5hbWVGcm9tU3ViVHJlZSA9IGNvbXB1dGVNaXNjVGV4dEFsdGVybmF0aXZlKG5vZGUsIHtcbiAgICAgICAgaXNFbWJlZGRlZEluTGFiZWw6IGZhbHNlLFxuICAgICAgICBpc1JlZmVyZW5jZWQ6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIGlmIChuYW1lRnJvbVN1YlRyZWUgIT09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIG5hbWVGcm9tU3ViVHJlZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgZnVuY3Rpb24gY29tcHV0ZVRleHRBbHRlcm5hdGl2ZShjdXJyZW50LCBjb250ZXh0KSB7XG4gICAgaWYgKGNvbnN1bHRlZE5vZGVzLmhhcyhjdXJyZW50KSkge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIC8vIDJBXG4gICAgaWYgKCFoaWRkZW4gJiYgaXNIaWRkZW4oY3VycmVudCwgZ2V0Q29tcHV0ZWRTdHlsZSkgJiYgIWNvbnRleHQuaXNSZWZlcmVuY2VkKSB7XG4gICAgICBjb25zdWx0ZWROb2Rlcy5hZGQoY3VycmVudCk7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICAvLyAyQlxuICAgIHZhciBsYWJlbEF0dHJpYnV0ZU5vZGUgPSBpc0VsZW1lbnQoY3VycmVudCkgPyBjdXJyZW50LmdldEF0dHJpYnV0ZU5vZGUoXCJhcmlhLWxhYmVsbGVkYnlcIikgOiBudWxsO1xuICAgIC8vIFRPRE86IERvIHdlIGdlbmVyYWxseSBuZWVkIHRvIGJsb2NrIHF1ZXJ5IElkUmVmcyBvZiBhdHRyaWJ1dGVzIHdlIGhhdmUgYWxyZWFkeSBjb25zdWx0ZWQ/XG4gICAgdmFyIGxhYmVsRWxlbWVudHMgPSBsYWJlbEF0dHJpYnV0ZU5vZGUgIT09IG51bGwgJiYgIWNvbnN1bHRlZE5vZGVzLmhhcyhsYWJlbEF0dHJpYnV0ZU5vZGUpID8gcXVlcnlJZFJlZnMoY3VycmVudCwgXCJhcmlhLWxhYmVsbGVkYnlcIikgOiBbXTtcbiAgICBpZiAoY29tcHV0ZSA9PT0gXCJuYW1lXCIgJiYgIWNvbnRleHQuaXNSZWZlcmVuY2VkICYmIGxhYmVsRWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb24gLS0gQ2FuJ3QgYmUgbnVsbCBoZXJlIG90aGVyd2lzZSBsYWJlbEVsZW1lbnRzIHdvdWxkIGJlIGVtcHR5XG4gICAgICBjb25zdWx0ZWROb2Rlcy5hZGQobGFiZWxBdHRyaWJ1dGVOb2RlKTtcbiAgICAgIHJldHVybiBsYWJlbEVsZW1lbnRzLm1hcChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAvLyBUT0RPOiBDaHJvbWUgd2lsbCBjb25zaWRlciByZXBlYXRlZCB2YWx1ZXMgaS5lLiB1c2UgYSBub2RlIG11bHRpcGxlIHRpbWVzIHdoaWxlIHdlJ2xsIGJhaWwgb3V0IGluIGNvbXB1dGVUZXh0QWx0ZXJuYXRpdmUuXG4gICAgICAgIHJldHVybiBjb21wdXRlVGV4dEFsdGVybmF0aXZlKGVsZW1lbnQsIHtcbiAgICAgICAgICBpc0VtYmVkZGVkSW5MYWJlbDogY29udGV4dC5pc0VtYmVkZGVkSW5MYWJlbCxcbiAgICAgICAgICBpc1JlZmVyZW5jZWQ6IHRydWUsXG4gICAgICAgICAgLy8gdGhpcyBpc24ndCByZWN1cnNpb24gYXMgc3BlY2lmaWVkLCBvdGhlcndpc2Ugd2Ugd291bGQgc2tpcFxuICAgICAgICAgIC8vIGBhcmlhLWxhYmVsYCBpblxuICAgICAgICAgIC8vIDxpbnB1dCBpZD1cIm15c2VsZlwiIGFyaWEtbGFiZWw9XCJmb29cIiBhcmlhLWxhYmVsbGVkYnk9XCJteXNlbGZcIlxuICAgICAgICAgIHJlY3Vyc2lvbjogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9KS5qb2luKFwiIFwiKTtcbiAgICB9XG5cbiAgICAvLyAyQ1xuICAgIC8vIENoYW5nZWQgZnJvbSB0aGUgc3BlYyBpbiBhbnRpY2lwYXRpb24gb2YgaHR0cHM6Ly9naXRodWIuY29tL3czYy9hY2NuYW1lL2lzc3Vlcy82NFxuICAgIC8vIHNwZWMgc2F5cyB3ZSBzaG91bGQgb25seSBjb25zaWRlciBza2lwcGluZyBpZiB3ZSBoYXZlIGEgbm9uLWVtcHR5IGxhYmVsXG4gICAgdmFyIHNraXBUb1N0ZXAyRSA9IGNvbnRleHQucmVjdXJzaW9uICYmIGlzQ29udHJvbChjdXJyZW50KSAmJiBjb21wdXRlID09PSBcIm5hbWVcIjtcbiAgICBpZiAoIXNraXBUb1N0ZXAyRSkge1xuICAgICAgdmFyIGFyaWFMYWJlbCA9IChpc0VsZW1lbnQoY3VycmVudCkgJiYgY3VycmVudC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIpIHx8IFwiXCIpLnRyaW0oKTtcbiAgICAgIGlmIChhcmlhTGFiZWwgIT09IFwiXCIgJiYgY29tcHV0ZSA9PT0gXCJuYW1lXCIpIHtcbiAgICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKGN1cnJlbnQpO1xuICAgICAgICByZXR1cm4gYXJpYUxhYmVsO1xuICAgICAgfVxuXG4gICAgICAvLyAyRFxuICAgICAgaWYgKCFpc01hcmtlZFByZXNlbnRhdGlvbmFsKGN1cnJlbnQpKSB7XG4gICAgICAgIHZhciBlbGVtZW50VGV4dEFsdGVybmF0aXZlID0gY29tcHV0ZUVsZW1lbnRUZXh0QWx0ZXJuYXRpdmUoY3VycmVudCk7XG4gICAgICAgIGlmIChlbGVtZW50VGV4dEFsdGVybmF0aXZlICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKGN1cnJlbnQpO1xuICAgICAgICAgIHJldHVybiBlbGVtZW50VGV4dEFsdGVybmF0aXZlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gc3BlY2lhbCBjYXNpbmcsIGNoZWF0aW5nIHRvIG1ha2UgdGVzdHMgcGFzc1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS93M2MvYWNjbmFtZS9pc3N1ZXMvNjdcbiAgICBpZiAoaGFzQW55Q29uY3JldGVSb2xlcyhjdXJyZW50LCBbXCJtZW51XCJdKSkge1xuICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKGN1cnJlbnQpO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgLy8gMkVcbiAgICBpZiAoc2tpcFRvU3RlcDJFIHx8IGNvbnRleHQuaXNFbWJlZGRlZEluTGFiZWwgfHwgY29udGV4dC5pc1JlZmVyZW5jZWQpIHtcbiAgICAgIGlmIChoYXNBbnlDb25jcmV0ZVJvbGVzKGN1cnJlbnQsIFtcImNvbWJvYm94XCIsIFwibGlzdGJveFwiXSkpIHtcbiAgICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKGN1cnJlbnQpO1xuICAgICAgICB2YXIgc2VsZWN0ZWRPcHRpb25zID0gcXVlcnlTZWxlY3RlZE9wdGlvbnMoY3VycmVudCk7XG4gICAgICAgIGlmIChzZWxlY3RlZE9wdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgLy8gZGVmaW5lZCBwZXIgdGVzdCBgbmFtZV9oZWFkaW5nX2NvbWJvYm94YFxuICAgICAgICAgIHJldHVybiBpc0hUTUxJbnB1dEVsZW1lbnQoY3VycmVudCkgPyBjdXJyZW50LnZhbHVlIDogXCJcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQXJyYXlGcm9tKHNlbGVjdGVkT3B0aW9ucykubWFwKGZ1bmN0aW9uIChzZWxlY3RlZE9wdGlvbikge1xuICAgICAgICAgIHJldHVybiBjb21wdXRlVGV4dEFsdGVybmF0aXZlKHNlbGVjdGVkT3B0aW9uLCB7XG4gICAgICAgICAgICBpc0VtYmVkZGVkSW5MYWJlbDogY29udGV4dC5pc0VtYmVkZGVkSW5MYWJlbCxcbiAgICAgICAgICAgIGlzUmVmZXJlbmNlZDogZmFsc2UsXG4gICAgICAgICAgICByZWN1cnNpb246IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkuam9pbihcIiBcIik7XG4gICAgICB9XG4gICAgICBpZiAoaGFzQWJzdHJhY3RSb2xlKGN1cnJlbnQsIFwicmFuZ2VcIikpIHtcbiAgICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKGN1cnJlbnQpO1xuICAgICAgICBpZiAoY3VycmVudC5oYXNBdHRyaWJ1dGUoXCJhcmlhLXZhbHVldGV4dFwiKSkge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uIC0tIHNhZmUgZHVlIHRvIGhhc0F0dHJpYnV0ZSBndWFyZFxuICAgICAgICAgIHJldHVybiBjdXJyZW50LmdldEF0dHJpYnV0ZShcImFyaWEtdmFsdWV0ZXh0XCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50Lmhhc0F0dHJpYnV0ZShcImFyaWEtdmFsdWVub3dcIikpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvbiAtLSBzYWZlIGR1ZSB0byBoYXNBdHRyaWJ1dGUgZ3VhcmRcbiAgICAgICAgICByZXR1cm4gY3VycmVudC5nZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbm93XCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE90aGVyd2lzZSwgdXNlIHRoZSB2YWx1ZSBhcyBzcGVjaWZpZWQgYnkgYSBob3N0IGxhbmd1YWdlIGF0dHJpYnV0ZS5cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikgfHwgXCJcIjtcbiAgICAgIH1cbiAgICAgIGlmIChoYXNBbnlDb25jcmV0ZVJvbGVzKGN1cnJlbnQsIFtcInRleHRib3hcIl0pKSB7XG4gICAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChjdXJyZW50KTtcbiAgICAgICAgcmV0dXJuIGdldFZhbHVlT2ZUZXh0Ym94KGN1cnJlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDJGOiBodHRwczovL3czYy5naXRodWIuaW8vYWNjbmFtZS8jc3RlcDJGXG4gICAgaWYgKGFsbG93c05hbWVGcm9tQ29udGVudChjdXJyZW50KSB8fCBpc0VsZW1lbnQoY3VycmVudCkgJiYgY29udGV4dC5pc1JlZmVyZW5jZWQgfHwgaXNOYXRpdmVIb3N0TGFuZ3VhZ2VUZXh0QWx0ZXJuYXRpdmVFbGVtZW50KGN1cnJlbnQpIHx8IGlzRGVzY2VuZGFudE9mTmF0aXZlSG9zdExhbmd1YWdlVGV4dEFsdGVybmF0aXZlRWxlbWVudChjdXJyZW50KSkge1xuICAgICAgdmFyIGFjY3VtdWxhdGVkVGV4dDJGID0gY29tcHV0ZU1pc2NUZXh0QWx0ZXJuYXRpdmUoY3VycmVudCwge1xuICAgICAgICBpc0VtYmVkZGVkSW5MYWJlbDogY29udGV4dC5pc0VtYmVkZGVkSW5MYWJlbCxcbiAgICAgICAgaXNSZWZlcmVuY2VkOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBpZiAoYWNjdW11bGF0ZWRUZXh0MkYgIT09IFwiXCIpIHtcbiAgICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKGN1cnJlbnQpO1xuICAgICAgICByZXR1cm4gYWNjdW11bGF0ZWRUZXh0MkY7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjdXJyZW50Lm5vZGVUeXBlID09PSBjdXJyZW50LlRFWFRfTk9ERSkge1xuICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKGN1cnJlbnQpO1xuICAgICAgcmV0dXJuIGN1cnJlbnQudGV4dENvbnRlbnQgfHwgXCJcIjtcbiAgICB9XG4gICAgaWYgKGNvbnRleHQucmVjdXJzaW9uKSB7XG4gICAgICBjb25zdWx0ZWROb2Rlcy5hZGQoY3VycmVudCk7XG4gICAgICByZXR1cm4gY29tcHV0ZU1pc2NUZXh0QWx0ZXJuYXRpdmUoY3VycmVudCwge1xuICAgICAgICBpc0VtYmVkZGVkSW5MYWJlbDogY29udGV4dC5pc0VtYmVkZGVkSW5MYWJlbCxcbiAgICAgICAgaXNSZWZlcmVuY2VkOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciB0b29sdGlwQXR0cmlidXRlVmFsdWUgPSBjb21wdXRlVG9vbHRpcEF0dHJpYnV0ZVZhbHVlKGN1cnJlbnQpO1xuICAgIGlmICh0b29sdGlwQXR0cmlidXRlVmFsdWUgIT09IG51bGwpIHtcbiAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChjdXJyZW50KTtcbiAgICAgIHJldHVybiB0b29sdGlwQXR0cmlidXRlVmFsdWU7XG4gICAgfVxuXG4gICAgLy8gVE9ETyBzaG91bGQgdGhpcyBiZSByZWFjaGFibGU/XG4gICAgY29uc3VsdGVkTm9kZXMuYWRkKGN1cnJlbnQpO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG4gIHJldHVybiBhc0ZsYXRTdHJpbmcoY29tcHV0ZVRleHRBbHRlcm5hdGl2ZShyb290LCB7XG4gICAgaXNFbWJlZGRlZEluTGFiZWw6IGZhbHNlLFxuICAgIC8vIGJ5IHNwZWMgY29tcHV0ZUFjY2Vzc2libGVEZXNjcmlwdGlvbiBzdGFydHMgd2l0aCB0aGUgcmVmZXJlbmNlZCBlbGVtZW50cyBhcyByb290c1xuICAgIGlzUmVmZXJlbmNlZDogY29tcHV0ZSA9PT0gXCJkZXNjcmlwdGlvblwiLFxuICAgIHJlY3Vyc2lvbjogZmFsc2VcbiAgfSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YWNjZXNzaWJsZS1uYW1lLWFuZC1kZXNjcmlwdGlvbi5tanMubWFwIiwiaW1wb3J0IHsgY29tcHV0ZVRleHRBbHRlcm5hdGl2ZSB9IGZyb20gXCIuL2FjY2Vzc2libGUtbmFtZS1hbmQtZGVzY3JpcHRpb24ubWpzXCI7XG5pbXBvcnQgeyBoYXNBbnlDb25jcmV0ZVJvbGVzIH0gZnJvbSBcIi4vdXRpbC5tanNcIjtcblxuLyoqXG4gKiBodHRwczovL3czYy5naXRodWIuaW8vYXJpYS8jbmFtZWZyb21wcm9oaWJpdGVkXG4gKi9cbmZ1bmN0aW9uIHByb2hpYml0c05hbWluZyhub2RlKSB7XG4gIHJldHVybiBoYXNBbnlDb25jcmV0ZVJvbGVzKG5vZGUsIFtcImNhcHRpb25cIiwgXCJjb2RlXCIsIFwiZGVsZXRpb25cIiwgXCJlbXBoYXNpc1wiLCBcImdlbmVyaWNcIiwgXCJpbnNlcnRpb25cIiwgXCJub25lXCIsIFwicGFyYWdyYXBoXCIsIFwicHJlc2VudGF0aW9uXCIsIFwic3Ryb25nXCIsIFwic3Vic2NyaXB0XCIsIFwic3VwZXJzY3JpcHRcIl0pO1xufVxuXG4vKipcbiAqIGltcGxlbWVudHMgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2FjY25hbWUvI21hcHBpbmdfYWRkaXRpb25hbF9uZF9uYW1lXG4gKiBAcGFyYW0gcm9vdFxuICogQHBhcmFtIG9wdGlvbnNcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlQWNjZXNzaWJsZU5hbWUocm9vdCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gIGlmIChwcm9oaWJpdHNOYW1pbmcocm9vdCkpIHtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICByZXR1cm4gY29tcHV0ZVRleHRBbHRlcm5hdGl2ZShyb290LCBvcHRpb25zKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFjY2Vzc2libGUtbmFtZS5tanMubWFwIiwiaW1wb3J0IHsgY29tcHV0ZUFjY2Vzc2libGVOYW1lIH0gZnJvbSAnZG9tLWFjY2Vzc2liaWxpdHktYXBpJztcblxuLyoqXG4gKiBQaGFzZSAyOiBBY2Nlc3NpYmxlIE5hbWUgJiBBUklBIFJlc29sdXRpb25cbiAqIFxuICogSW1wbGVtZW50cyByZWxpYWJsZSByZXNvbHV0aW9uIG9mOlxuICogLSBhcmlhLWxhYmVsXG4gKiAtIGFyaWEtbGFiZWxsZWRieSAoc2luZ2xlIGFuZCBtdWx0aXBsZSBzcGFjZS1zZXBhcmF0ZWQgcmVmZXJlbmNlcywgaW5jbHVkaW5nIGhpZGRlbiB0YXJnZXRzKVxuICogLSBhcmlhLWRlc2NyaWJlZGJ5IChzaW5nbGUgYW5kIG11bHRpcGxlIHNwYWNlLXNlcGFyYXRlZCByZWZlcmVuY2VzLCBpbmNsdWRpbmcgaGlkZGVuIHRhcmdldHMpXG4gKiAtIDxsYWJlbCBmb3I9XCIuLi5cIj4gKGluY2x1ZGluZyBtdWx0aXBsZSBhc3NvY2lhdGVkIGxhYmVscylcbiAqIC0gRW5jbG9zaW5nIDxsYWJlbD4gKG5lc3RlZCBlbGVtZW50cywgc3VidHJlZXMpXG4gKiAtIE5hdGl2ZSBIVE1MIHNlbWFudGljcyAoYnV0dG9uIHRleHQsIGlucHV0IHZhbHVlLCBpbWcgYWx0LCBmaWVsZHNldCBsZWdlbmQsIHRhYmxlIGNhcHRpb24pXG4gKiAtIFBsYWNlaG9sZGVyICYgdGl0bGUgZmFsbGJhY2tzXG4gKiAtIEhhbmRsaW5nIG9mIG1pc3NpbmcsIGJyb2tlbiwgY2lyY3VsYXIsIG9yIGNvbmZsaWN0aW5nIHJlZmVyZW5jZXNcbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIEFyaWFSZXNvbHV0aW9uUmVzdWx0IHtcbiAgbmFtZTogc3RyaW5nIHwgbnVsbDtcbiAgbmFtZVNvdXJjZTogJ2FyaWEtbGFiZWxsZWRieScgfCAnYXJpYS1sYWJlbCcgfCAnbGFiZWwnIHwgJ25hdGl2ZScgfCAndGl0bGUnIHwgJ3BsYWNlaG9sZGVyJyB8IG51bGw7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmcgfCBudWxsO1xuICBkZXNjcmlwdGlvblNvdXJjZTogJ2FyaWEtZGVzY3JpYmVkYnknIHwgJ2FyaWEtZGVzY3JpcHRpb24nIHwgJ3RpdGxlJyB8ICdwbGFjZWhvbGRlcicgfCBudWxsO1xuICBoYXNIaWRkZW5SZWZlcmVuY2U6IGJvb2xlYW47XG4gIHJlZmVyZW5jZWRJZHM6IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIEV4dHJhY3RzIHZpc2libGUgb3IgcmVmZXJlbmNlZCB0ZXh0IGZyb20gYW4gZWxlbWVudCwgaW5jbHVkaW5nIGhpZGRlbiByZWZlcmVuY2VkIG5vZGVzLlxuICogU2FmZWd1YXJkZWQgYWdhaW5zdCBjaXJjdWxhciBET00gcmVmZXJlbmNlcyB3aXRoIGEgdmlzaXRlZCBzZXQuXG4gKi9cbmZ1bmN0aW9uIGdldEVsZW1lbnRGbGF0dGVuZWRUZXh0KGVsOiBFbGVtZW50LCB2aXNpdGVkID0gbmV3IFNldDxFbGVtZW50PigpKTogc3RyaW5nIHtcbiAgaWYgKHZpc2l0ZWQuaGFzKGVsKSkgcmV0dXJuICcnO1xuICB2aXNpdGVkLmFkZChlbCk7XG5cbiAgbGV0IHRleHQgPSAnJztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgbm9kZSA9IGVsLmNoaWxkTm9kZXNbaV07XG4gICAgaWYgKCFub2RlKSBjb250aW51ZTtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgIHRleHQgKz0gbm9kZS5ub2RlVmFsdWUgfHwgJyc7XG4gICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgY29uc3QgY2hpbGRFbCA9IG5vZGUgYXMgRWxlbWVudDtcbiAgICAgIGNvbnN0IHRhZyA9IGNoaWxkRWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgLy8gU2tpcCBlbWJlZGRlZCBjb250cm9scyB0byBhdm9pZCBkb3VibGUgY291bnRpbmcgaW5wdXQgdGV4dFxuICAgICAgaWYgKHRhZyA9PT0gJ2lucHV0JyB8fCB0YWcgPT09ICdzZWxlY3QnIHx8IHRhZyA9PT0gJ3RleHRhcmVhJykge1xuICAgICAgICBjb25zdCBpbnB1dFZhbCA9IChjaGlsZEVsIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuICAgICAgICBpZiAoaW5wdXRWYWwgJiYgKGNoaWxkRWwgYXMgSFRNTElucHV0RWxlbWVudCkudHlwZSAhPT0gJ3Bhc3N3b3JkJykge1xuICAgICAgICAgIHRleHQgKz0gJyAnICsgaW5wdXRWYWw7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHQgKz0gJyAnICsgZ2V0RWxlbWVudEZsYXR0ZW5lZFRleHQoY2hpbGRFbCwgdmlzaXRlZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRleHQudHJpbSgpLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlcyBzcGFjZS1zZXBhcmF0ZWQgSUQgcmVmZXJlbmNlcyAoZS5nLiBmb3IgYXJpYS1sYWJlbGxlZGJ5LCBhcmlhLWRlc2NyaWJlZGJ5KVxuICogSGFuZGxlcyBtdWx0aXBsZSByZWZlcmVuY2VzLCBtaXNzaW5nL2ludmFsaWQgSURzLCBhbmQgaGlkZGVuIGVsZW1lbnRzIGdyYWNlZnVsbHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlSWRSZWZlcmVuY2VzKFxuICBpZExpc3Q6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQsXG4gIGNvbnRleHREb2M/OiBEb2N1bWVudFxuKTogeyB0ZXh0OiBzdHJpbmcgfCBudWxsOyBmb3VuZElkczogc3RyaW5nW107IGhhc0hpZGRlbjogYm9vbGVhbiB9IHtcbiAgaWYgKCFpZExpc3QgfHwgdHlwZW9mIGlkTGlzdCAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4geyB0ZXh0OiBudWxsLCBmb3VuZElkczogW10sIGhhc0hpZGRlbjogZmFsc2UgfTtcbiAgfVxuXG4gIGNvbnN0IGlkcyA9IGlkTGlzdC50cmltKCkuc3BsaXQoL1xccysvKS5maWx0ZXIoQm9vbGVhbik7XG4gIGlmIChpZHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHsgdGV4dDogbnVsbCwgZm91bmRJZHM6IFtdLCBoYXNIaWRkZW46IGZhbHNlIH07XG4gIH1cblxuICBjb25zdCBkb2MgPSBjb250ZXh0RG9jIHx8ICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gZG9jdW1lbnQgOiBudWxsKTtcbiAgaWYgKCFkb2MpIHtcbiAgICByZXR1cm4geyB0ZXh0OiBudWxsLCBmb3VuZElkczogW10sIGhhc0hpZGRlbjogZmFsc2UgfTtcbiAgfVxuXG4gIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBmb3VuZElkczogc3RyaW5nW10gPSBbXTtcbiAgbGV0IGhhc0hpZGRlbiA9IGZhbHNlO1xuXG4gIGZvciAoY29uc3QgaWQgb2YgaWRzKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGRvYy5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAvLyBNaXNzaW5nIC8gaW52YWxpZCByZWZlcmVuY2U6IHNraXAgZ3JhY2VmdWxseSB3aXRob3V0IGZhaWxpbmdcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGZvdW5kSWRzLnB1c2goaWQpO1xuXG4gICAgICAvLyBDaGVjayBpZiByZWZlcmVuY2UgaXMgaGlkZGVuXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXQpO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHN0eWxlLmRpc3BsYXkgPT09ICdub25lJyB8fFxuICAgICAgICAgICAgc3R5bGUudmlzaWJpbGl0eSA9PT0gJ2hpZGRlbicgfHxcbiAgICAgICAgICAgIHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2hpZGRlbicpIHx8XG4gICAgICAgICAgICB0YXJnZXQuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZSdcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGhhc0hpZGRlbiA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICBpZiAodGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnaGlkZGVuJykgfHwgdGFyZ2V0LmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICBoYXNIaWRkZW4gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2hpZGRlbicpIHx8IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJykge1xuICAgICAgICAgIGhhc0hpZGRlbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udGVudCA9IGdldEVsZW1lbnRGbGF0dGVuZWRUZXh0KHRhcmdldCk7XG4gICAgICBpZiAoY29udGVudCkge1xuICAgICAgICBwYXJ0cy5wdXNoKGNvbnRlbnQpO1xuICAgICAgfVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gSWdub3JlIHJlZmVyZW5jZSByZXNvbHV0aW9uIGVycm9yc1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkID0gcGFydHMuam9pbignICcpLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG4gIHJldHVybiB7XG4gICAgdGV4dDogY29tYmluZWQubGVuZ3RoID4gMCA/IGNvbWJpbmVkIDogbnVsbCxcbiAgICBmb3VuZElkcyxcbiAgICBoYXNIaWRkZW4sXG4gIH07XG59XG5cbi8qKlxuICogUmVzb2x2ZXMgYWxsIGFzc29jaWF0ZWQgSFRNTCA8bGFiZWw+IGVsZW1lbnRzOlxuICogLSA8bGFiZWwgZm9yPVwiaWRcIj4gKHN1cHBvcnRzIG11bHRpcGxlIGxhYmVscyBwb2ludGluZyB0byBzYW1lIGlkKVxuICogLSBDbG9zZXN0IGVuY2xvc2luZyA8bGFiZWw+XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlSHRtbExhYmVscyhlbDogRWxlbWVudCwgY29udGV4dERvYz86IERvY3VtZW50KTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGRvYyA9IGNvbnRleHREb2MgfHwgZWwub3duZXJEb2N1bWVudCB8fCAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IGRvY3VtZW50IDogbnVsbCk7XG4gIGlmICghZG9jKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBbXTtcblxuICAvLyAxLiBFeHBsaWNpdCA8bGFiZWwgZm9yPVwiLi4uXCI+XG4gIGlmIChlbC5pZCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzYWZlSWQgPSB0eXBlb2YgQ1NTICE9PSAndW5kZWZpbmVkJyAmJiBDU1MuZXNjYXBlID8gQ1NTLmVzY2FwZShlbC5pZCkgOiBlbC5pZC5yZXBsYWNlKC9bXCJcXFxcXS9nLCAnXFxcXCQmJyk7XG4gICAgICBjb25zdCBtYXRjaGluZ0xhYmVscyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKGBsYWJlbFtmb3I9XCIke3NhZmVJZH1cIl1gKTtcbiAgICAgIG1hdGNoaW5nTGFiZWxzLmZvckVhY2goKGxibCkgPT4ge1xuICAgICAgICBjb25zdCB0ZXh0ID0gZ2V0RWxlbWVudEZsYXR0ZW5lZFRleHQobGJsKTtcbiAgICAgICAgaWYgKHRleHQpIHBhcnRzLnB1c2godGV4dCk7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIEZhbGxiYWNrIGlmIHNlbGVjdG9yIGZhaWxzXG4gICAgfVxuICB9XG5cbiAgLy8gMi4gRW5jbG9zaW5nIDxsYWJlbD4gYW5jZXN0b3JcbiAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBlbmNsb3NpbmcgPSBlbC5jbG9zZXN0KCdsYWJlbCcpO1xuICAgICAgaWYgKGVuY2xvc2luZykge1xuICAgICAgICAvLyBDbG9uZSBhbmQgcmVtb3ZlIHRoaXMgY29udHJvbCB0byBleHRyYWN0IG9ubHkgdGhlIHN1cnJvdW5kaW5nIGxhYmVsIHRleHRcbiAgICAgICAgY29uc3QgY2xvbmUgPSBlbmNsb3NpbmcuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBjb25zdCBjb250cm9scyA9IGNsb25lLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0LCBzZWxlY3QsIHRleHRhcmVhLCBidXR0b24nKTtcbiAgICAgICAgY29udHJvbHMuZm9yRWFjaCgoYykgPT4gYy5yZW1vdmUoKSk7XG4gICAgICAgIGNvbnN0IHRleHQgPSBjbG9uZS50ZXh0Q29udGVudD8udHJpbSgpLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbiAgICAgICAgaWYgKHRleHQpIHBhcnRzLnB1c2godGV4dCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBGYWxsYmFja1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IHBhcnRzLmpvaW4oJyAnKS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xuICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA+IDAgPyByZXN1bHQgOiBudWxsO1xufVxuXG4vKipcbiAqIFJlc29sdmVzIG5hdGl2ZSBIVE1MIGVsZW1lbnQgc2VtYW50aWNzOlxuICogLSA8aW5wdXQgdHlwZT1cImJ1dHRvbnxzdWJtaXR8cmVzZXRcIiB2YWx1ZT1cIi4uLlwiPlxuICogLSA8aW1nIGFsdD1cIi4uLlwiPlxuICogLSA8ZmllbGRzZXQ+IC0+IDxsZWdlbmQ+XG4gKiAtIDx0YWJsZT4gLT4gPGNhcHRpb24+XG4gKiAtIDxkZXRhaWxzPiAtPiA8c3VtbWFyeT5cbiAqIC0gPGE+IC0+IHRleHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVOYXRpdmVTZW1hbnRpY3MoZWw6IEVsZW1lbnQpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gIGlmICh0YWcgPT09ICdpbnB1dCcpIHtcbiAgICBjb25zdCBpbnB1dCA9IGVsIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgY29uc3QgdHlwZSA9IChpbnB1dC50eXBlIHx8ICd0ZXh0JykudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAodHlwZSA9PT0gJ2J1dHRvbicgfHwgdHlwZSA9PT0gJ3N1Ym1pdCcgfHwgdHlwZSA9PT0gJ3Jlc2V0Jykge1xuICAgICAgaWYgKGlucHV0LnZhbHVlICYmIGlucHV0LnZhbHVlLnRyaW0oKSkge1xuICAgICAgICByZXR1cm4gaW5wdXQudmFsdWUudHJpbSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmICh0YWcgPT09ICdpbWcnIHx8IHRhZyA9PT0gJ2FyZWEnKSB7XG4gICAgY29uc3QgYWx0ID0gZWwuZ2V0QXR0cmlidXRlKCdhbHQnKTtcbiAgICBpZiAoYWx0ICYmIGFsdC50cmltKCkpIHJldHVybiBhbHQudHJpbSgpO1xuICB9XG5cbiAgaWYgKHRhZyA9PT0gJ2ZpZWxkc2V0Jykge1xuICAgIGNvbnN0IGxlZ2VuZCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJ2xlZ2VuZCcpO1xuICAgIGlmIChsZWdlbmQgJiYgbGVnZW5kLnRleHRDb250ZW50KSB7XG4gICAgICBjb25zdCB0ZXh0ID0gbGVnZW5kLnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG4gICAgICBpZiAodGV4dCkgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRhZyA9PT0gJ3RhYmxlJykge1xuICAgIGNvbnN0IGNhcHRpb24gPSBlbC5xdWVyeVNlbGVjdG9yKCdjYXB0aW9uJyk7XG4gICAgaWYgKGNhcHRpb24gJiYgY2FwdGlvbi50ZXh0Q29udGVudCkge1xuICAgICAgY29uc3QgdGV4dCA9IGNhcHRpb24udGV4dENvbnRlbnQudHJpbSgpLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbiAgICAgIGlmICh0ZXh0KSByZXR1cm4gdGV4dDtcbiAgICB9XG4gIH1cblxuICBpZiAodGFnID09PSAnZGV0YWlscycpIHtcbiAgICBjb25zdCBzdW1tYXJ5ID0gZWwucXVlcnlTZWxlY3Rvcignc3VtbWFyeScpO1xuICAgIGlmIChzdW1tYXJ5ICYmIHN1bW1hcnkudGV4dENvbnRlbnQpIHtcbiAgICAgIGNvbnN0IHRleHQgPSBzdW1tYXJ5LnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG4gICAgICBpZiAodGV4dCkgcmV0dXJuIHRleHQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRhZyA9PT0gJ2J1dHRvbicgfHwgdGFnID09PSAnYScpIHtcbiAgICBjb25zdCB0ZXh0ID0gZ2V0RWxlbWVudEZsYXR0ZW5lZFRleHQoZWwpO1xuICAgIGlmICh0ZXh0KSByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEZ1bGwgUGhhc2UgMiBBY2Nlc3NpYmxlIE5hbWUgJiBEZXNjcmlwdGlvbiBSZXNvbHZlci5cbiAqIFN0cmljdCBXM0MgcHJlY2VkZW5jZSBoaWVyYXJjaHk6XG4gKiAxLiBhcmlhLWxhYmVsbGVkYnlcbiAqIDIuIGFyaWEtbGFiZWxcbiAqIDMuIDxsYWJlbD4gYXNzb2NpYXRpb24gKEhUTUwgZm9yPSBvciBlbmNsb3NpbmcpXG4gKiA0LiBOYXRpdmUgSFRNTCBzZW1hbnRpY3NcbiAqIDUuIHBsYWNlaG9sZGVyXG4gKiA2LiB0aXRsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUFyaWFNZXRhZGF0YShlbDogRWxlbWVudCwgY29udGV4dERvYz86IERvY3VtZW50KTogQXJpYVJlc29sdXRpb25SZXN1bHQge1xuICBjb25zdCBkb2MgPSBjb250ZXh0RG9jIHx8IGVsLm93bmVyRG9jdW1lbnQgfHwgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudCA6IG51bGwpO1xuICBsZXQgbmFtZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBuYW1lU291cmNlOiBBcmlhUmVzb2x1dGlvblJlc3VsdFsnbmFtZVNvdXJjZSddID0gbnVsbDtcbiAgbGV0IGhhc0hpZGRlblJlZiA9IGZhbHNlO1xuICBjb25zdCByZWZlcmVuY2VkSWRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIC8vIFN0ZXAgMTogYXJpYS1sYWJlbGxlZGJ5XG4gIGNvbnN0IGxhYmVsbGVkQnlBdHRyID0gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgaWYgKGxhYmVsbGVkQnlBdHRyICYmIGRvYykge1xuICAgIGNvbnN0IHJlcyA9IHJlc29sdmVJZFJlZmVyZW5jZXMobGFiZWxsZWRCeUF0dHIsIGRvYyk7XG4gICAgaWYgKHJlcy50ZXh0KSB7XG4gICAgICBuYW1lID0gcmVzLnRleHQ7XG4gICAgICBuYW1lU291cmNlID0gJ2FyaWEtbGFiZWxsZWRieSc7XG4gICAgICBpZiAocmVzLmhhc0hpZGRlbikgaGFzSGlkZGVuUmVmID0gdHJ1ZTtcbiAgICAgIHJlZmVyZW5jZWRJZHMucHVzaCguLi5yZXMuZm91bmRJZHMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFN0ZXAgMjogYXJpYS1sYWJlbCAoaWYgbm90IHJlc29sdmVkIGJ5IGFyaWEtbGFiZWxsZWRieSlcbiAgaWYgKCFuYW1lKSB7XG4gICAgY29uc3QgYXJpYUxhYmVsID0gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgaWYgKGFyaWFMYWJlbCAmJiBhcmlhTGFiZWwudHJpbSgpKSB7XG4gICAgICBuYW1lID0gYXJpYUxhYmVsLnRyaW0oKTtcbiAgICAgIG5hbWVTb3VyY2UgPSAnYXJpYS1sYWJlbCc7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RlcCAzOiA8bGFiZWw+IGFzc29jaWF0aW9uc1xuICBpZiAoIW5hbWUpIHtcbiAgICBjb25zdCBsYWJlbFRleHQgPSByZXNvbHZlSHRtbExhYmVscyhlbCwgZG9jKTtcbiAgICBpZiAobGFiZWxUZXh0KSB7XG4gICAgICBuYW1lID0gbGFiZWxUZXh0O1xuICAgICAgbmFtZVNvdXJjZSA9ICdsYWJlbCc7XG4gICAgfVxuICB9XG5cbiAgLy8gU3RlcCA0OiBOYXRpdmUgc2VtYW50aWNzIChidXR0b25zLCBpbnB1dHMsIGxpbmtzLCBmaWVsZHNldHMsIHRhYmxlcywgZGV0YWlscylcbiAgaWYgKCFuYW1lKSB7XG4gICAgY29uc3QgbmF0aXZlID0gcmVzb2x2ZU5hdGl2ZVNlbWFudGljcyhlbCk7XG4gICAgaWYgKG5hdGl2ZSkge1xuICAgICAgbmFtZSA9IG5hdGl2ZTtcbiAgICAgIG5hbWVTb3VyY2UgPSAnbmF0aXZlJztcbiAgICB9XG4gIH1cblxuICAvLyBTdGVwIDU6IGRvbS1hY2Nlc3NpYmlsaXR5LWFwaSByZXNvbHV0aW9uXG4gIGlmICghbmFtZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjb21wdXRlZCA9IGNvbXB1dGVBY2Nlc3NpYmxlTmFtZShlbCk7XG4gICAgICBpZiAoY29tcHV0ZWQgJiYgY29tcHV0ZWQudHJpbSgpKSB7XG4gICAgICAgIGNvbnN0IHRyaW1tZWQgPSBjb21wdXRlZC50cmltKCk7XG4gICAgICAgIGNvbnN0IHRpdGxlQXR0ciA9IGVsLmdldEF0dHJpYnV0ZSgndGl0bGUnKT8udHJpbSgpO1xuICAgICAgICBjb25zdCBwaEF0dHIgPSBlbC5nZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJyk/LnRyaW0oKTtcbiAgICAgICAgbmFtZSA9IHRyaW1tZWQ7XG4gICAgICAgIGlmICh0aXRsZUF0dHIgJiYgdHJpbW1lZCA9PT0gdGl0bGVBdHRyKSB7XG4gICAgICAgICAgbmFtZVNvdXJjZSA9ICd0aXRsZSc7XG4gICAgICAgIH0gZWxzZSBpZiAocGhBdHRyICYmIHRyaW1tZWQgPT09IHBoQXR0cikge1xuICAgICAgICAgIG5hbWVTb3VyY2UgPSAncGxhY2Vob2xkZXInO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5hbWVTb3VyY2UgPSAnbmF0aXZlJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gRmFsbGJhY2tcbiAgICB9XG4gIH1cblxuICAvLyBTdGVwIDY6IHRpdGxlIChXM0MgSFRNTC1BQU0gc3RlcCAyRClcbiAgaWYgKCFuYW1lKSB7XG4gICAgY29uc3QgdGl0bGUgPSBlbC5nZXRBdHRyaWJ1dGUoJ3RpdGxlJyk7XG4gICAgaWYgKHRpdGxlICYmIHRpdGxlLnRyaW0oKSkge1xuICAgICAgbmFtZSA9IHRpdGxlLnRyaW0oKTtcbiAgICAgIG5hbWVTb3VyY2UgPSAndGl0bGUnO1xuICAgIH1cbiAgfVxuXG4gIC8vIFN0ZXAgNzogcGxhY2Vob2xkZXIgKFczQyBIVE1MLUFBTSBzdGVwIDJFKVxuICBpZiAoIW5hbWUpIHtcbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IGVsLmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKTtcbiAgICBpZiAocGxhY2Vob2xkZXIgJiYgcGxhY2Vob2xkZXIudHJpbSgpKSB7XG4gICAgICBuYW1lID0gcGxhY2Vob2xkZXIudHJpbSgpO1xuICAgICAgbmFtZVNvdXJjZSA9ICdwbGFjZWhvbGRlcic7XG4gICAgfVxuICB9XG5cbiAgLy8gQWNjZXNzaWJsZSBEZXNjcmlwdGlvbiBSZXNvbHV0aW9uIChhcmlhLWRlc2NyaWJlZGJ5ID4gYXJpYS1kZXNjcmlwdGlvbiA+IHRpdGxlID4gcGxhY2Vob2xkZXIpXG4gIGxldCBkZXNjcmlwdGlvbjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBkZXNjcmlwdGlvblNvdXJjZTogQXJpYVJlc29sdXRpb25SZXN1bHRbJ2Rlc2NyaXB0aW9uU291cmNlJ10gPSBudWxsO1xuXG4gIGNvbnN0IGRlc2NyaWJlZEJ5QXR0ciA9IGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICBpZiAoZGVzY3JpYmVkQnlBdHRyICYmIGRvYykge1xuICAgIGNvbnN0IHJlcyA9IHJlc29sdmVJZFJlZmVyZW5jZXMoZGVzY3JpYmVkQnlBdHRyLCBkb2MpO1xuICAgIGlmIChyZXMudGV4dCkge1xuICAgICAgZGVzY3JpcHRpb24gPSByZXMudGV4dDtcbiAgICAgIGRlc2NyaXB0aW9uU291cmNlID0gJ2FyaWEtZGVzY3JpYmVkYnknO1xuICAgICAgaWYgKHJlcy5oYXNIaWRkZW4pIGhhc0hpZGRlblJlZiA9IHRydWU7XG4gICAgICByZWZlcmVuY2VkSWRzLnB1c2goLi4ucmVzLmZvdW5kSWRzKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWRlc2NyaXB0aW9uKSB7XG4gICAgY29uc3QgYXJpYURlc2MgPSBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpcHRpb24nKTtcbiAgICBpZiAoYXJpYURlc2MgJiYgYXJpYURlc2MudHJpbSgpKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IGFyaWFEZXNjLnRyaW0oKTtcbiAgICAgIGRlc2NyaXB0aW9uU291cmNlID0gJ2FyaWEtZGVzY3JpcHRpb24nO1xuICAgIH1cbiAgfVxuXG4gIC8vIFVzZSB0aXRsZSBhcyBkZXNjcmlwdGlvbiBPTkxZIGlmIG5vdCBhbHJlYWR5IHVzZWQgYXMgbmFtZVxuICBpZiAoIWRlc2NyaXB0aW9uICYmIG5hbWVTb3VyY2UgIT09ICd0aXRsZScpIHtcbiAgICBjb25zdCB0aXRsZSA9IGVsLmdldEF0dHJpYnV0ZSgndGl0bGUnKTtcbiAgICBpZiAodGl0bGUgJiYgdGl0bGUudHJpbSgpKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IHRpdGxlLnRyaW0oKTtcbiAgICAgIGRlc2NyaXB0aW9uU291cmNlID0gJ3RpdGxlJztcbiAgICB9XG4gIH1cblxuICAvLyBVc2UgcGxhY2Vob2xkZXIgYXMgZGVzY3JpcHRpb24gZmFsbGJhY2sgT05MWSBpZiBub3QgYWxyZWFkeSB1c2VkIGFzIG5hbWVcbiAgaWYgKCFkZXNjcmlwdGlvbiAmJiBuYW1lU291cmNlICE9PSAncGxhY2Vob2xkZXInKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXIgPSBlbC5nZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJyk7XG4gICAgaWYgKHBsYWNlaG9sZGVyICYmIHBsYWNlaG9sZGVyLnRyaW0oKSkge1xuICAgICAgZGVzY3JpcHRpb24gPSBwbGFjZWhvbGRlci50cmltKCk7XG4gICAgICBkZXNjcmlwdGlvblNvdXJjZSA9ICdwbGFjZWhvbGRlcic7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lLFxuICAgIG5hbWVTb3VyY2UsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgZGVzY3JpcHRpb25Tb3VyY2UsXG4gICAgaGFzSGlkZGVuUmVmZXJlbmNlOiBoYXNIaWRkZW5SZWYsXG4gICAgcmVmZXJlbmNlZElkcyxcbiAgfTtcbn1cbiIsImltcG9ydCB7IHJlc29sdmVBcmlhTWV0YWRhdGEgfSBmcm9tICcuL2FyaWEtcmVzb2x2ZXIuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZUVsZW1lbnRBY2Nlc3NpYmxlTmFtZShlbDogRWxlbWVudCk6IHN0cmluZyB8IG51bGwge1xuICB0cnkge1xuICAgIGNvbnN0IG1ldGEgPSByZXNvbHZlQXJpYU1ldGFkYXRhKGVsKTtcbiAgICBpZiAobWV0YS5uYW1lKSByZXR1cm4gbWV0YS5uYW1lO1xuICB9IGNhdGNoIHtcbiAgICAvLyBGYWlsLXNhZmVcbiAgfVxuXG4gIC8vIEZhbGxiYWNrOiBhcmlhLWxhYmVsLCBhcmlhLWxhYmVsbGVkYnksIGFsdCwgcGxhY2Vob2xkZXIsIHRpdGxlXG4gIGNvbnN0IGFyaWFMYWJlbCA9IGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICBpZiAoYXJpYUxhYmVsKSByZXR1cm4gYXJpYUxhYmVsLnRyaW0oKTtcblxuICBjb25zdCB0aXRsZSA9IGVsLmdldEF0dHJpYnV0ZSgndGl0bGUnKTtcbiAgaWYgKHRpdGxlKSByZXR1cm4gdGl0bGUudHJpbSgpO1xuXG4gIGNvbnN0IHBsYWNlaG9sZGVyID0gZWwuZ2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicpO1xuICBpZiAocGxhY2Vob2xkZXIpIHJldHVybiBwbGFjZWhvbGRlci50cmltKCk7XG5cbiAgY29uc3QgYWx0ID0gZWwuZ2V0QXR0cmlidXRlKCdhbHQnKTtcbiAgaWYgKGFsdCkgcmV0dXJuIGFsdC50cmltKCk7XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxGcmFtZU9mZnNldCgpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gWzAsIDBdO1xuXG4gIHRyeSB7XG4gICAgaWYgKHdpbmRvdy5zZWxmID09PSB3aW5kb3cudG9wKSB7XG4gICAgICByZXR1cm4gWzAsIDBdO1xuICAgIH1cblxuICAgIGlmICh3aW5kb3cuZnJhbWVFbGVtZW50KSB7XG4gICAgICBjb25zdCByZWN0ID0gd2luZG93LmZyYW1lRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHJldHVybiBbcmVjdC5sZWZ0LCByZWN0LnRvcF07XG4gICAgfVxuICB9IGNhdGNoIHtcbiAgICAvLyBDcm9zcy1vcmlnaW4gaWZyYW1lIGZyYW1lRWxlbWVudCBhY2Nlc3Mgd2lsbCB0aHJvdyBTZWN1cml0eUVycm9yLlxuICAgIC8vIFRoZSBzZXJ2aWNlIHdvcmtlciB3aWxsIGNvbXBvc2UgY3Jvc3Mtb3JpZ2luIG9mZnNldHMgdXNpbmcgd2ViTmF2aWdhdGlvbiBmcmFtZSBoaWVyYXJjaHkuXG4gIH1cblxuICByZXR1cm4gWzAsIDBdO1xufVxuXG4vKipcbiAqIENvbXBvc2UgbmVzdGVkIGZyYW1lIG9mZnNldHMgYnkgc3VtbWluZyBwYXJlbnQgb2Zmc2V0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2VGcmFtZU9mZnNldHMoXG4gIGZyYW1lSWQ6IHN0cmluZyxcbiAgZnJhbWVzOiB7IGZyYW1lX2lkOiBzdHJpbmc7IHBhcmVudF9mcmFtZV9pZDogc3RyaW5nIHwgbnVsbDsgb2Zmc2V0OiBbbnVtYmVyLCBudW1iZXJdIH1bXVxuKTogW251bWJlciwgbnVtYmVyXSB7XG4gIGxldCBjdXI6IHsgZnJhbWVfaWQ6IHN0cmluZzsgcGFyZW50X2ZyYW1lX2lkOiBzdHJpbmcgfCBudWxsOyBvZmZzZXQ6IFtudW1iZXIsIG51bWJlcl0gfSB8IHVuZGVmaW5lZCA9XG4gICAgZnJhbWVzLmZpbmQoKGYpID0+IGYuZnJhbWVfaWQgPT09IGZyYW1lSWQpO1xuXG4gIGxldCB0b3RhbFggPSAwO1xuICBsZXQgdG90YWxZID0gMDtcblxuICBjb25zdCB2aXNpdGVkID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgd2hpbGUgKGN1ciAmJiAhdmlzaXRlZC5oYXMoY3VyLmZyYW1lX2lkKSkge1xuICAgIHZpc2l0ZWQuYWRkKGN1ci5mcmFtZV9pZCk7XG4gICAgdG90YWxYICs9IGN1ci5vZmZzZXRbMF07XG4gICAgdG90YWxZICs9IGN1ci5vZmZzZXRbMV07XG5cbiAgICBpZiAoIWN1ci5wYXJlbnRfZnJhbWVfaWQpIGJyZWFrO1xuICAgIGN1ciA9IGZyYW1lcy5maW5kKChmKSA9PiBmLmZyYW1lX2lkID09PSBjdXI/LnBhcmVudF9mcmFtZV9pZCk7XG4gIH1cblxuICByZXR1cm4gW3RvdGFsWCwgdG90YWxZXTtcbn1cbiIsImNvbnN0IGRvbUVsZW1lbnRNYXAgPSBuZXcgTWFwPHN0cmluZywgV2Vha1JlZjxFbGVtZW50Pj4oKTtcbmNvbnN0IHJlZ2lvblRvRG9tTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKTtcblxuZXhwb3J0IGNvbnN0IGVsZW1lbnRSZWdpc3RyeSA9IHtcbiAgcmVnaXN0ZXIoZG9tSWQ6IHN0cmluZywgZWw6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICBkb21FbGVtZW50TWFwLnNldChkb21JZCwgbmV3IFdlYWtSZWYoZWwpKTtcbiAgfSxcblxuICBnZXQoZG9tSWQ6IHN0cmluZyk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICBjb25zdCByZWYgPSBkb21FbGVtZW50TWFwLmdldChkb21JZCk7XG4gICAgaWYgKCFyZWYpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IGVsID0gcmVmLmRlcmVmKCk7XG4gICAgaWYgKCFlbCB8fCAhZWwuaXNDb25uZWN0ZWQpIHtcbiAgICAgIGRvbUVsZW1lbnRNYXAuZGVsZXRlKGRvbUlkKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gZWw7XG4gIH0sXG5cbiAgc2V0UmVnaW9uTWFwcGluZyhtYXBwaW5nOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBbcmVnaW9uSWQsIGRvbUlkXSBvZiBPYmplY3QuZW50cmllcyhtYXBwaW5nKSkge1xuICAgICAgcmVnaW9uVG9Eb21NYXAuc2V0KHJlZ2lvbklkLCBkb21JZCk7XG4gICAgfVxuICB9LFxuXG4gIGdldEJ5UmVnaW9uSWQocmVnaW9uSWQ6IHN0cmluZyk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICBjb25zdCBkb21JZCA9IHJlZ2lvblRvRG9tTWFwLmdldChyZWdpb25JZCk7XG4gICAgaWYgKCFkb21JZCkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KGRvbUlkKTtcbiAgfSxcblxuICBjbGVhcigpOiB2b2lkIHtcbiAgICBkb21FbGVtZW50TWFwLmNsZWFyKCk7XG4gICAgcmVnaW9uVG9Eb21NYXAuY2xlYXIoKTtcbiAgfSxcbn07XG4iLCIvKipcbiAqIENvbXB1dGUgU0hBLTI1NiBoZXggZGlnZXN0IHVzaW5nIFdlYiBDcnlwdG8gQVBJLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2hhMjU2SGV4KGlucHV0OiBzdHJpbmcgfCBVaW50OEFycmF5KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgZGF0YSA9IHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgPyBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoaW5wdXQpIDogaW5wdXQ7XG4gIGNvbnN0IGhhc2hCdWZmZXIgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdCgnU0hBLTI1NicsIGRhdGEgYXMgYW55KTtcbiAgY29uc3QgaGFzaEFycmF5ID0gQXJyYXkuZnJvbShuZXcgVWludDhBcnJheShoYXNoQnVmZmVyKSk7XG4gIHJldHVybiBoYXNoQXJyYXkubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmlzdGljYWxseSBzZXJpYWxpemUgYSBKYXZhU2NyaXB0IHZhbHVlIHRvIEpTT04gKHNvcnRlZCBrZXlzKVxuICogZm9yIHJlbGlhYmxlIGNyeXB0b2dyYXBoaWMgaGFzaGluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbEpzb24ob2JqOiBhbnkpOiBzdHJpbmcge1xuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgIHJldHVybiAnWycgKyBvYmoubWFwKGNhbm9uaWNhbEpzb24pLmpvaW4oJywnKSArICddJztcbiAgfVxuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKS5zb3J0KCk7XG4gIGNvbnN0IHBhaXJzID0ga2V5cy5tYXAoKGtleSkgPT4ge1xuICAgIGNvbnN0IHZhbCA9IG9ialtrZXldO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShrZXkpICsgJzonICsgY2Fub25pY2FsSnNvbih2YWwpO1xuICB9KTtcbiAgcmV0dXJuICd7JyArIHBhaXJzLmpvaW4oJywnKSArICd9Jztcbn1cbiIsImltcG9ydCB0eXBlIHsgQkJveCwgRG9tRWxlbWVudEluZm8sIEZyYW1lSW5mbyB9IGZyb20gJ0Bjb250cmFjdHMvaW5kZXguanMnO1xuaW1wb3J0IHsgcm91bmRCQm94VG9TdGVwIH0gZnJvbSAnQGNvbnRyYWN0cy9nZW9tZXRyeS5qcyc7XG5pbXBvcnQgeyBjYW5vbmljYWxKc29uLCBzaGEyNTZIZXggfSBmcm9tICcuLi8uLi9zZWN1cml0eS9zaGEyNTYuanMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZpbmdlcnByaW50T3B0aW9ucyB7XG4gIG1vZGU/OiAnc3RyaWN0JyB8ICd0YXJnZXQtc2NvcGVkJztcbiAgdGFyZ2V0QkJveD86IEJCb3g7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21wdXRlUGFnZVN0YXRlSGFzaChcbiAgb3JpZ2luOiBzdHJpbmcsXG4gIHBhdGg6IHN0cmluZyxcbiAgZnJhbWVzOiBGcmFtZUluZm9bXSxcbiAgZWxlbWVudHM6IERvbUVsZW1lbnRJbmZvW10sXG4gIHNjcm9sbFkgPSAwLFxuICBvcHRpb25zOiBGaW5nZXJwcmludE9wdGlvbnMgPSB7fVxuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3Qgc2Nyb2xsQnVja2V0ID0gTWF0aC5mbG9vcihzY3JvbGxZIC8gNjQpO1xuICBjb25zdCBkaWFsb2dPcGVuID0gZWxlbWVudHMuc29tZSgoZWwpID0+IGVsLnRhZyA9PT0gJ2RpYWxvZycgJiYgZWwudmlzaWJsZSk7XG5cbiAgbGV0IGludGVyYWN0aXZlRWxlbWVudHMgPSBlbGVtZW50cy5maWx0ZXIoKGVsKSA9PiBlbC52aXNpYmxlICYmIGVsLmludGVyYWN0YWJsZSk7XG5cbiAgaWYgKG9wdGlvbnMubW9kZSA9PT0gJ3RhcmdldC1zY29wZWQnICYmIG9wdGlvbnMudGFyZ2V0QkJveCkge1xuICAgIGNvbnN0IFt0eCwgdHksIHR3LCB0aF0gPSBvcHRpb25zLnRhcmdldEJCb3g7XG4gICAgLy8gS2VlcCBlbGVtZW50cyBpbiBwcm94aW1pdHkgKHdpdGhpbiAxNTBweClcbiAgICBpbnRlcmFjdGl2ZUVsZW1lbnRzID0gaW50ZXJhY3RpdmVFbGVtZW50cy5maWx0ZXIoKGVsKSA9PiB7XG4gICAgICBjb25zdCBbZXgsIGV5XSA9IGVsLmJib3g7XG4gICAgICByZXR1cm4gTWF0aC5hYnMoZXggLSB0eCkgPCB0dyArIDE1MCAmJiBNYXRoLmFicyhleSAtIHR5KSA8IHRoICsgMTUwO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgaW50ZXJhY3RpdmVTdW1tYXJ5ID0gaW50ZXJhY3RpdmVFbGVtZW50cy5tYXAoKGVsKSA9PiAoe1xuICAgIHRhZzogZWwudGFnLFxuICAgIHJvbGU6IGVsLnJvbGUsXG4gICAgbmFtZTogZWwubmFtZSxcbiAgICBiYm94OiByb3VuZEJCb3hUb1N0ZXAoZWwuYmJveCwgNCksXG4gICAgZGlzYWJsZWQ6IGVsLmFyaWEuZGlzYWJsZWQsXG4gICAgY2hlY2tlZDogZWwuYXJpYS5jaGVja2VkLFxuICB9KSk7XG5cbiAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICBvcmlnaW4sXG4gICAgcGF0aCxcbiAgICBmcmFtZXM6IGZyYW1lcy5tYXAoKGYpID0+ICh7IGlkOiBmLmZyYW1lX2lkLCBvcmlnaW46IGYub3JpZ2luIH0pKSxcbiAgICBkaWFsb2dPcGVuLFxuICAgIHNjcm9sbEJ1Y2tldCxcbiAgICBpbnRlcmFjdGl2ZTogaW50ZXJhY3RpdmVTdW1tYXJ5LFxuICB9O1xuXG4gIGNvbnN0IHJhd0pzb24gPSBjYW5vbmljYWxKc29uKHBheWxvYWQpO1xuICBjb25zdCBmdWxsSGFzaCA9IGF3YWl0IHNoYTI1NkhleChyYXdKc29uKTtcbiAgcmV0dXJuIGZ1bGxIYXNoLnNsaWNlKDAsIDE2KTtcbn1cbiIsIi8qKlxuICogUGhhc2UgMTogRE9NIC8gQVJJQSBQZXJjZXB0aW9uIENvbnRyYWN0XG4gKiBcbiAqIEV4dHJhY3RzIHJpY2ggYWNjZXNzaWJpbGl0eSBhbmQgRE9NIGlkZW50aXR5IG1ldGFkYXRhOlxuICogLSBSb2xlICYgQWNjZXNzaWJsZSBuYW1lIC8gZGVzY3JpcHRpb25cbiAqIC0gQXNzb2NpYXRlZCA8bGFiZWw+IHRleHQgYW5kIGxhYmVsIHJlZmVyZW5jZXNcbiAqIC0gRm9ybSBhc3NvY2lhdGlvbiAoZm9ybSBpZC9uYW1lKVxuICogLSBSYXcgQVJJQSBhdHRyaWJ1dGVzIChhcmlhLWxhYmVsLCBhcmlhLWxhYmVsbGVkYnksIGFyaWEtZGVzY3JpYmVkYnkpXG4gKiAtIE5hdGl2ZSBpZGVudGlmaWNhdGlvbiAoaWQsIG5hbWUsIHR5cGUsIHBsYWNlaG9sZGVyLCBhdXRvY29tcGxldGUpXG4gKiAtIFN0YWJsZSBET00gc2VsZWN0b3JcbiAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIEVuaGFuY2VkRG9tTWV0YWRhdGEge1xuICBlbGVtZW50X2lkOiBzdHJpbmcgfCBudWxsO1xuICBlbGVtZW50X25hbWU6IHN0cmluZyB8IG51bGw7XG4gIGxhYmVsOiBzdHJpbmcgfCBudWxsO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nIHwgbnVsbDtcbiAgYXJpYV9sYWJlbDogc3RyaW5nIHwgbnVsbDtcbiAgYXJpYV9sYWJlbGxlZGJ5OiBzdHJpbmcgfCBudWxsO1xuICBhcmlhX2Rlc2NyaWJlZGJ5OiBzdHJpbmcgfCBudWxsO1xuICBmb3JtX2lkOiBzdHJpbmcgfCBudWxsO1xuICBzdGFibGVfc2VsZWN0b3I6IHN0cmluZztcbn1cblxuaW1wb3J0IHsgcmVzb2x2ZUFyaWFNZXRhZGF0YSB9IGZyb20gJy4uL2FjY2Vzc2liaWxpdHkvYXJpYS1yZXNvbHZlci5qcyc7XG5cbi8qKlxuICogUmVzb2x2ZXMgYXNzb2NpYXRlZCBsYWJlbCBmb3IgYW4gaW5wdXQgb3IgY29udHJvbDpcbiAqIDEuIGFyaWEtbGFiZWxsZWRieSB0YXJnZXQgZWxlbWVudHNcbiAqIDIuIEV4cGxpY2l0IDxsYWJlbCBmb3I9XCJpZFwiPiAvIGVuY2xvc2luZyA8bGFiZWw+XG4gKiAzLiBhcmlhLWxhYmVsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlQXNzb2NpYXRlZExhYmVsKGVsOiBFbGVtZW50KTogc3RyaW5nIHwgbnVsbCB7XG4gIHRyeSB7XG4gICAgY29uc3QgbWV0YSA9IHJlc29sdmVBcmlhTWV0YWRhdGEoZWwpO1xuICAgIGlmIChtZXRhLm5hbWVTb3VyY2UgPT09ICdhcmlhLWxhYmVsbGVkYnknIHx8IG1ldGEubmFtZVNvdXJjZSA9PT0gJ2xhYmVsJyB8fCBtZXRhLm5hbWVTb3VyY2UgPT09ICdhcmlhLWxhYmVsJykge1xuICAgICAgcmV0dXJuIG1ldGEubmFtZTtcbiAgICB9XG4gIH0gY2F0Y2gge1xuICAgIC8vIEZhaWwtc2FmZSBpbiByZXN0cmljdGVkIG9yIHVudXN1YWwgRE9NIGVudmlyb25tZW50c1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogUmVzb2x2ZXMgYWNjZXNzaWJsZSBkZXNjcmlwdGlvbjpcbiAqIDEuIGFyaWEtZGVzY3JpYmVkYnkgcmVmZXJlbmNlc1xuICogMi4gYXJpYS1kZXNjcmlwdGlvbiBhdHRyaWJ1dGVcbiAqIDMuIHRpdGxlIGF0dHJpYnV0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZUVsZW1lbnREZXNjcmlwdGlvbihlbDogRWxlbWVudCk6IHN0cmluZyB8IG51bGwge1xuICB0cnkge1xuICAgIGNvbnN0IG1ldGEgPSByZXNvbHZlQXJpYU1ldGFkYXRhKGVsKTtcbiAgICByZXR1cm4gbWV0YS5kZXNjcmlwdGlvbjtcbiAgfSBjYXRjaCB7XG4gICAgLy8gRmFpbC1zYWZlXG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBSZXNvbHZlcyBmb3JtIGFzc29jaWF0aW9uIChpZCBvZiBlbmNsb3Npbmcgb3IgcmVmZXJlbmNlZCBmb3JtKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVGb3JtQXNzb2NpYXRpb24oZWw6IEVsZW1lbnQpOiBzdHJpbmcgfCBudWxsIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBmb3JtQXR0ciA9IGVsLmdldEF0dHJpYnV0ZSgnZm9ybScpO1xuICAgIGlmIChmb3JtQXR0cikgcmV0dXJuIGZvcm1BdHRyO1xuXG4gICAgY29uc3QgZm9ybUVsID0gZWwuY2xvc2VzdCgnZm9ybScpO1xuICAgIGlmIChmb3JtRWwpIHtcbiAgICAgIHJldHVybiBmb3JtRWwuaWQgfHwgZm9ybUVsLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8ICdmb3JtJztcbiAgICB9XG4gIH0gY2F0Y2gge1xuICAgIC8vIEZhaWwtc2FmZVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIENvbXB1dGVzIGEgZGV0ZXJtaW5pc3RpYywgc3RhYmxlIENTUyBzZWxlY3RvciBpZGVudGlmeWluZyB0aGUgZWxlbWVudCBhY3Jvc3MgcmUtcmVuZGVycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVTdGFibGVTZWxlY3RvcihlbDogRWxlbWVudCk6IHN0cmluZyB7XG4gIHRyeSB7XG4gICAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChlbC5pZCkge1xuICAgICAgcmV0dXJuIGAjJHtlbC5pZH1gO1xuICAgIH1cblxuICAgIGNvbnN0IG5hbWUgPSBlbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgICBpZiAobmFtZSkge1xuICAgICAgcmV0dXJuIGAke3RhZ31bbmFtZT1cIiR7bmFtZX1cIl1gO1xuICAgIH1cblxuICAgIGNvbnN0IHJvbGUgPSBlbC5nZXRBdHRyaWJ1dGUoJ3JvbGUnKTtcbiAgICBpZiAocm9sZSkge1xuICAgICAgcmV0dXJuIGAke3RhZ31bcm9sZT1cIiR7cm9sZX1cIl1gO1xuICAgIH1cblxuICAgIC8vIEJ1aWxkIHNob3J0IHBhdGggZnJvbSBwYXJlbnRcbiAgICBjb25zdCBwYXJlbnQgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGNvbnN0IHBhcmVudFRhZyA9IHBhcmVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCBwYXJlbnRJZCA9IHBhcmVudC5pZCA/IGAjJHtwYXJlbnQuaWR9YCA6IHBhcmVudFRhZztcbiAgICAgIGNvbnN0IGluZGV4ID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmluZGV4T2YoZWwpICsgMTtcbiAgICAgIHJldHVybiBgJHtwYXJlbnRJZH0gPiAke3RhZ306bnRoLWNoaWxkKCR7aW5kZXh9KWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhZztcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIGVsLnRhZ05hbWUgPyBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgOiAndW5rbm93bic7XG4gIH1cbn1cblxuLyoqXG4gKiBBZ2dyZWdhdGVzIGFsbCBQaGFzZSAxIGVuaGFuY2VkIERPTS9BUklBIG1ldGFkYXRhIGZvciBhbiBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdEVuaGFuY2VkRG9tTWV0YWRhdGEoZWw6IEVsZW1lbnQpOiBFbmhhbmNlZERvbU1ldGFkYXRhIHtcbiAgY29uc3QgZWxlbWVudF9pZCA9IGVsLmlkID8gZWwuaWQgOiBudWxsO1xuICBjb25zdCBlbGVtZW50X25hbWUgPSBlbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCBudWxsO1xuICBjb25zdCBhcmlhX2xhYmVsID0gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJykgfHwgbnVsbDtcbiAgY29uc3QgYXJpYV9sYWJlbGxlZGJ5ID0gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKSB8fCBudWxsO1xuICBjb25zdCBhcmlhX2Rlc2NyaWJlZGJ5ID0gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JykgfHwgbnVsbDtcbiAgY29uc3QgbGFiZWwgPSByZXNvbHZlQXNzb2NpYXRlZExhYmVsKGVsKTtcbiAgY29uc3QgZGVzY3JpcHRpb24gPSBjb21wdXRlRWxlbWVudERlc2NyaXB0aW9uKGVsKTtcbiAgY29uc3QgZm9ybV9pZCA9IHJlc29sdmVGb3JtQXNzb2NpYXRpb24oZWwpO1xuICBjb25zdCBzdGFibGVfc2VsZWN0b3IgPSBjb21wdXRlU3RhYmxlU2VsZWN0b3IoZWwpO1xuXG4gIHJldHVybiB7XG4gICAgZWxlbWVudF9pZCxcbiAgICBlbGVtZW50X25hbWUsXG4gICAgbGFiZWwsXG4gICAgZGVzY3JpcHRpb24sXG4gICAgYXJpYV9sYWJlbCxcbiAgICBhcmlhX2xhYmVsbGVkYnksXG4gICAgYXJpYV9kZXNjcmliZWRieSxcbiAgICBmb3JtX2lkLFxuICAgIHN0YWJsZV9zZWxlY3RvcixcbiAgfTtcbn1cbiIsImltcG9ydCB0eXBlIHsgRG9tRWxlbWVudEluZm8sIERvbVNuYXBzaG90LCBGcmFtZUluZm8gfSBmcm9tICdAY29udHJhY3RzL2luZGV4LmpzJztcbmltcG9ydCB7IGlzRWxlbWVudE9jY2x1ZGVkLCBpc0VsZW1lbnRWaXNpYmxlIH0gZnJvbSAnLi92aXNpYmlsaXR5LmpzJztcbmltcG9ydCB7IGRldGVjdFJlbmRlcmluZ0tpbmQgfSBmcm9tICcuL3JlbmRlcmluZy1raW5kLmpzJztcbmltcG9ydCB7IGNvbXB1dGVBcmlhUm9sZSwgZXh0cmFjdEFyaWFTdGF0ZXMgfSBmcm9tICcuLi9hY2Nlc3NpYmlsaXR5L3JvbGUuanMnO1xuaW1wb3J0IHsgY29tcHV0ZUVsZW1lbnRBY2Nlc3NpYmxlTmFtZSB9IGZyb20gJy4uL2FjY2Vzc2liaWxpdHkvbmFtZS5qcyc7XG5pbXBvcnQgeyBnZXRMb2NhbEZyYW1lT2Zmc2V0IH0gZnJvbSAnLi4vLi4vY29udGVudC9mcmFtZS1vZmZzZXRzLmpzJztcbmltcG9ydCB7IGVsZW1lbnRSZWdpc3RyeSB9IGZyb20gJy4uLy4uL2NvbnRlbnQvcmVnaXN0cnkuanMnO1xuaW1wb3J0IHsgY29tcHV0ZVBhZ2VTdGF0ZUhhc2ggfSBmcm9tICcuLi8uLi9icm93c2VyL3N0YXRlL2ZpbmdlcnByaW50LmpzJztcbmltcG9ydCB7IGV4dHJhY3RFbmhhbmNlZERvbU1ldGFkYXRhLCBFbmhhbmNlZERvbU1ldGFkYXRhIH0gZnJvbSAnLi9hcmlhLW1ldGFkYXRhLmpzJztcblxuY29uc3QgQ0FORElEQVRFX1NFTEVDVE9SID0gW1xuICAnYVtocmVmXScsXG4gICdidXR0b24nLFxuICAnaW5wdXQnLFxuICAnc2VsZWN0JyxcbiAgJ3RleHRhcmVhJyxcbiAgJ2RldGFpbHMnLFxuICAnc3VtbWFyeScsXG4gICdkaWFsb2cnLFxuICAnW3JvbGVdJyxcbiAgJ1t0YWJpbmRleF0nLFxuICAnW2NvbnRlbnRlZGl0YWJsZV0nLFxuICAnbGFiZWwnLFxuICAnaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgcCwgYmxvY2txdW90ZSwgdGgsIHRkLCBsaSwgZHQsIGRkLCBmaWdjYXB0aW9uJyxcbiAgJ2NhbnZhcycsXG4gICdzdmcnLFxuICAnaW1nJyxcbiAgJ3ZpZGVvJyxcbiAgJ2lmcmFtZScsXG4gICdbY2xhc3MqPVwiYXZhdGFyXCJdJyxcbiAgJ1tjbGFzcyo9XCJwcm9maWxlXCJdJyxcbiAgJ1tjbGFzcyo9XCJ1c2VyXCJdJyxcbiAgJ1tjbGFzcyo9XCJwaG90b1wiXScsXG4gICdbY2xhc3MqPVwidGh1bWJcIl0nXG5dLmpvaW4oJywnKTtcblxuaW50ZXJmYWNlIENhY2hlZFNlbWFudGljSW5mbyB7XG4gIHRhZzogc3RyaW5nO1xuICByb2xlOiBzdHJpbmcgfCBudWxsO1xuICBuYW1lOiBzdHJpbmcgfCBudWxsO1xuICBhcmlhOiBhbnk7XG4gIHJlbmRlcmluZzogYW55O1xuICBoYXNfYmdfaW1hZ2U6IGJvb2xlYW47XG4gIGhhbmRsZXJzX2hpbnQ6IGJvb2xlYW47XG4gIGlucHV0SW5mbzogYW55O1xuICBleHRyYWN0ZWRUZXh0OiBzdHJpbmc7XG4gIGNsYXNzZXM6IHN0cmluZ1tdO1xuICBwaWlNYXRjaGVzOiB7IG5vZGVJbmRleDogbnVtYmVyLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgdGV4dDogc3RyaW5nLCB0eXBlOiBzdHJpbmcgfVtdO1xuICBhdHRyaWJ1dGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBlbmhhbmNlZDogRW5oYW5jZWREb21NZXRhZGF0YTtcbn1cblxuaW50ZXJmYWNlIENhY2hlZEVsZW1lbnQge1xuICBpc01lYW5pbmdmdWw6IGJvb2xlYW47XG4gIGRvbUlkPzogc3RyaW5nO1xuICBzdGF0aWNJbmZvPzogQ2FjaGVkU2VtYW50aWNJbmZvO1xufVxuXG5jb25zdCBlbGVtZW50Q2FjaGUgPSBuZXcgV2Vha01hcDxFbGVtZW50LCBDYWNoZWRFbGVtZW50PigpO1xubGV0IG5leHRJZCA9IDE7XG5sZXQgbmV4dFBpaUlkID0gMTtcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcmtEaXJ0eShlbDogRWxlbWVudCB8IG51bGwpIHtcbiAgaWYgKCFlbCkgcmV0dXJuO1xuICBlbGVtZW50Q2FjaGUuZGVsZXRlKGVsKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4dHJhY3REb21TbmFwc2hvdChcbiAgZnJhbWVJZCA9ICdtYWluJyxcbiAgcGFyZW50RnJhbWVJZDogc3RyaW5nIHwgbnVsbCA9IG51bGxcbik6IFByb21pc2U8RG9tU25hcHNob3Q+IHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc25hcHNob3RfaWQ6IGBzbmFwXyR7RGF0ZS5ub3coKX1gLFxuICAgICAgdXJsX29yaWdpbjogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE3MycsXG4gICAgICB1cmxfcGF0aDogJy8nLFxuICAgICAgZnJhbWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmcmFtZV9pZDogZnJhbWVJZCxcbiAgICAgICAgICBwYXJlbnRfZnJhbWVfaWQ6IHBhcmVudEZyYW1lSWQsXG4gICAgICAgICAgb3JpZ2luOiAnaHR0cDovL2xvY2FsaG9zdDo1MTczJyxcbiAgICAgICAgICBwYXRoOiAnLycsXG4gICAgICAgICAgb2Zmc2V0OiBbMCwgMF0sXG4gICAgICAgICAgYWNjZXNzaWJsZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBlbGVtZW50czogW10sXG4gICAgICB2aWV3cG9ydDogeyB3OiAxMjgwLCBoOiA4MDAgfSxcbiAgICAgIGRwcjogMSxcbiAgICAgIHNjcm9sbDogeyB4OiAwLCB5OiAwIH0sXG4gICAgICBwYWdlX3N0YXRlX2hhc2g6ICcwMDAwMDAwMDAwMDAwMDAwJyxcbiAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgIH07XG4gIH1cblxuICBjb25zdCB1cmxPcmlnaW4gPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luO1xuICBjb25zdCB1cmxQYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lOyAvLyBTdHJpcHBlZCBvZiBxdWVyeSBhbmQgaGFzaFxuICBjb25zdCBmcmFtZU9mZnNldCA9IGdldExvY2FsRnJhbWVPZmZzZXQoKTtcblxuICBjb25zdCB2aWV3cG9ydCA9IHtcbiAgICB3OiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ/LmNsaWVudFdpZHRoIHx8IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgIGg6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudD8uY2xpZW50SGVpZ2h0IHx8IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgfTtcblxuICBjb25zdCBmcmFtZXM6IEZyYW1lSW5mb1tdID0gW1xuICAgIHtcbiAgICAgIGZyYW1lX2lkOiBmcmFtZUlkLFxuICAgICAgcGFyZW50X2ZyYW1lX2lkOiBwYXJlbnRGcmFtZUlkLFxuICAgICAgb3JpZ2luOiB1cmxPcmlnaW4sXG4gICAgICBwYXRoOiB1cmxQYXRoLFxuICAgICAgb2Zmc2V0OiBmcmFtZU9mZnNldCxcbiAgICAgIGFjY2Vzc2libGU6IHRydWUsXG4gICAgfSxcbiAgXTtcblxuICBjb25zdCByYXdFbGVtZW50cyA9IG5ldyBTZXQ8RWxlbWVudD4oKTtcblxuICAvLyBSZWN1cnNpdmUgY29sbGVjdGlvbiBvZiBhbGwgbm9kZXMgaW5jbHVkaW5nIHRob3NlIGluIHNoYWRvdyByb290c1xuICBmdW5jdGlvbiBjb2xsZWN0Tm9kZXMocm9vdDogRG9jdW1lbnQgfCBEb2N1bWVudEZyYWdtZW50IHwgRWxlbWVudCkge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gcm9vdC5xdWVyeVNlbGVjdG9yQWxsKCcqJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZWwgPSBjaGlsZHJlbltpXTtcbiAgICAgIGlmICghZWwpIGNvbnRpbnVlO1xuXG4gICAgICAvLyBDaGVjayBmb3Igc2hhZG93IHJvb3RcbiAgICAgIGxldCBzUm9vdDogU2hhZG93Um9vdCB8IG51bGwgPSBlbC5zaGFkb3dSb290IHx8IG51bGw7XG4gICAgICBpZiAoIXNSb290ICYmIHR5cGVvZiBjaHJvbWUgIT09ICd1bmRlZmluZWQnICYmIChjaHJvbWUgYXMgYW55KS5kb20/Lm9wZW5PckNsb3NlZFNoYWRvd1Jvb3QpIHtcbiAgICAgICAgIHRyeSB7IHNSb290ID0gKGNocm9tZSBhcyBhbnkpLmRvbS5vcGVuT3JDbG9zZWRTaGFkb3dSb290KGVsKTsgfSBjYXRjaCB7fVxuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoc1Jvb3QpIHtcbiAgICAgICAgY29sbGVjdE5vZGVzKHNSb290KTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgYWxyZWFkeSBhZGRlZCwgc2tpcFxuICAgICAgaWYgKHJhd0VsZW1lbnRzLmhhcyhlbCkpIGNvbnRpbnVlO1xuXG4gICAgICBsZXQgY2FjaGVkID0gZWxlbWVudENhY2hlLmdldChlbCk7XG4gICAgICBpZiAoY2FjaGVkKSB7XG4gICAgICAgIGlmIChjYWNoZWQuaXNNZWFuaW5nZnVsKSByYXdFbGVtZW50cy5hZGQoZWwpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IGlzTWVhbmluZ2Z1bCA9IGZhbHNlO1xuICAgICAgXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoZWwubWF0Y2hlcyAmJiBlbC5tYXRjaGVzKENBTkRJREFURV9TRUxFQ1RPUikpIHtcbiAgICAgICAgICBpc01lYW5pbmdmdWwgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gSWdub3JlZFxuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTWVhbmluZ2Z1bCkge1xuICAgICAgICBjb25zdCBodG1sRWwgPSBlbCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgaWYgKChlbCBhcyBhbnkpLm9uY2xpY2sgfHwgaHRtbEVsLnN0eWxlPy5jdXJzb3IgPT09ICdwb2ludGVyJyB8fCBlbC5oYXNBdHRyaWJ1dGUoJ29uY2xpY2snKSkge1xuICAgICAgICAgIGlzTWVhbmluZ2Z1bCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2F0Y2ggcGxhaW4gZGl2cy9zcGFucyB0aGF0IGNvbnRhaW4gZGlyZWN0IHRleHRcbiAgICAgICAgICBpZiAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgICAgICBjb25zdCBjaGlsZE5vZGVzID0gZWwuY2hpbGROb2RlcztcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkTm9kZXNbal07XG4gICAgICAgICAgICAgIGlmIChjaGlsZCAmJiBjaGlsZC5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gY2hpbGQubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0ICYmIHRleHQudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgIGlzTWVhbmluZ2Z1bCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWlzTWVhbmluZ2Z1bCAmJiBlbC5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgICAgICAgaWYgKGNvbXB1dGVkLmJhY2tncm91bmRJbWFnZSAmJiBjb21wdXRlZC5iYWNrZ3JvdW5kSW1hZ2UgIT09ICdub25lJyAmJiBjb21wdXRlZC5iYWNrZ3JvdW5kSW1hZ2UuaW5jbHVkZXMoJ3VybCgnKSkge1xuICAgICAgICAgICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgIGlmIChyZWN0LndpZHRoID4gMTAgJiYgcmVjdC5oZWlnaHQgPiAxMCkge1xuICAgICAgICAgICAgICAgIGlzTWVhbmluZ2Z1bCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGlzTWVhbmluZ2Z1bCkge1xuICAgICAgICByYXdFbGVtZW50cy5hZGQoZWwpO1xuICAgICAgICBlbGVtZW50Q2FjaGUuc2V0KGVsLCB7IGlzTWVhbmluZ2Z1bDogdHJ1ZSB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnRDYWNoZS5zZXQoZWwsIHsgaXNNZWFuaW5nZnVsOiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb2xsZWN0Tm9kZXMoZG9jdW1lbnQpO1xuXG4gIC8vIEZpbHRlciBvdXQgYW55IGFnZW50IFVJIGhvc3RcbiAgY29uc3QgZmlsdGVyZWQgPSBBcnJheS5mcm9tKHJhd0VsZW1lbnRzKS5maWx0ZXIoXG4gICAgKGVsKSA9PiAhZWwuY2xvc2VzdCgnW2RhdGEtYWdlbnQtdWldJykgJiYgZWwuaWQgIT09ICdfX3NpaF9hZ2VudF91aV9ob3N0X18nXG4gICk7XG5cbiAgY29uc3QgZWxlbWVudHM6IERvbUVsZW1lbnRJbmZvW10gPSBbXTtcblxuICBmb3IgKGNvbnN0IGVsIG9mIGZpbHRlcmVkKSB7XG4gICAgbGV0IGNhY2hlZCA9IGVsZW1lbnRDYWNoZS5nZXQoZWwpO1xuICAgIGlmICghY2FjaGVkKSBjb250aW51ZTtcbiAgICBcbiAgICBpZiAoIWNhY2hlZC5kb21JZCkge1xuICAgICAgY2FjaGVkLmRvbUlkID0gYGQke25leHRJZCsrfWA7XG4gICAgfVxuICAgIGNvbnN0IGRvbUlkID0gY2FjaGVkLmRvbUlkO1xuICAgIGVsZW1lbnRSZWdpc3RyeS5yZWdpc3Rlcihkb21JZCwgZWwpO1xuXG4gICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGJib3g6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gW1xuICAgICAgTWF0aC5yb3VuZChyZWN0LmxlZnQgKyBmcmFtZU9mZnNldFswXSksXG4gICAgICBNYXRoLnJvdW5kKHJlY3QudG9wICsgZnJhbWVPZmZzZXRbMV0pLFxuICAgICAgTWF0aC5yb3VuZChyZWN0LndpZHRoKSxcbiAgICAgIE1hdGgucm91bmQocmVjdC5oZWlnaHQpLFxuICAgIF07XG5cbiAgICBjb25zdCB2aXNpYmxlID0gaXNFbGVtZW50VmlzaWJsZShlbCk7XG4gICAgY29uc3QgaW5WaWV3cG9ydCA9XG4gICAgICByZWN0LmJvdHRvbSA+PSAwICYmXG4gICAgICByZWN0LnJpZ2h0ID49IDAgJiZcbiAgICAgIHJlY3QudG9wIDw9IHZpZXdwb3J0LmggJiZcbiAgICAgIHJlY3QubGVmdCA8PSB2aWV3cG9ydC53O1xuXG4gICAgY29uc3QgY3ggPSByZWN0LmxlZnQgKyByZWN0LndpZHRoIC8gMjtcbiAgICBjb25zdCBjeSA9IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgLyAyO1xuICAgIGNvbnN0IG9jY2x1ZGVkID0gaXNFbGVtZW50T2NjbHVkZWQoZWwsIGN4LCBjeSk7XG4gICAgXG5cbiAgICBpZiAoIWNhY2hlZC5zdGF0aWNJbmZvKSB7XG4gICAgICBjb25zdCB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCByb2xlID0gY29tcHV0ZUFyaWFSb2xlKGVsKTtcbiAgICAgIGNvbnN0IG5hbWUgPSBjb21wdXRlRWxlbWVudEFjY2Vzc2libGVOYW1lKGVsKTtcbiAgICAgIGNvbnN0IGFyaWEgPSBleHRyYWN0QXJpYVN0YXRlcyhlbCk7XG4gICAgICBjb25zdCB7IHJlbmRlcmluZywgaGFzX2JnX2ltYWdlLCBoYW5kbGVyc19oaW50IH0gPSBkZXRlY3RSZW5kZXJpbmdLaW5kKGVsKTtcblxuICAgICAgbGV0IGlucHV0SW5mbzogYW55ID0gdW5kZWZpbmVkO1xuICAgICAgaWYgKHRhZyA9PT0gJ2lucHV0JyB8fCB0YWcgPT09ICd0ZXh0YXJlYScgfHwgdGFnID09PSAnc2VsZWN0Jykge1xuICAgICAgICBjb25zdCBpbnB1dEVsID0gZWwgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgY29uc3QgdHlwZSA9IChpbnB1dEVsLnR5cGUgfHwgJ3RleHQnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBpc1Bhc3N3b3JkID0gdHlwZSA9PT0gJ3Bhc3N3b3JkJztcbiAgICAgICAgY29uc3QgaGFzVmFsdWUgPSBCb29sZWFuKGlucHV0RWwudmFsdWUgJiYgaW5wdXRFbC52YWx1ZS5sZW5ndGggPiAwKTtcblxuICAgICAgICBpbnB1dEluZm8gPSB7XG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICBhdXRvY29tcGxldGU6IGlucHV0RWwuYXV0b2NvbXBsZXRlIHx8IG51bGwsXG4gICAgICAgICAgbmFtZTogaW5wdXRFbC5uYW1lIHx8IG51bGwsXG4gICAgICAgICAgcGxhY2Vob2xkZXI6IGlucHV0RWwucGxhY2Vob2xkZXIgfHwgbnVsbCxcbiAgICAgICAgICBpc19wYXNzd29yZDogaXNQYXNzd29yZCxcbiAgICAgICAgICBoYXNfdmFsdWU6IGhhc1ZhbHVlLFxuICAgICAgICAgIHZhbHVlOiBpc1Bhc3N3b3JkID8gbnVsbCA6IGlucHV0RWwudmFsdWUgfHwgbnVsbCwgXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBcbiAgICAgIGNvbnN0IGF0dHJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgICBjb25zdCBhZGRBdHRyID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCB2YWwgPSBlbC5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIGlmICh2YWwpIGF0dHJzW25hbWVdID0gdmFsO1xuICAgICAgfTtcbiAgICAgIGFkZEF0dHIoJ2FsdCcpO1xuICAgICAgYWRkQXR0cigndGl0bGUnKTtcbiAgICAgIGFkZEF0dHIoJ2FyaWEtZGVzY3JpcHRpb24nKTtcbiAgICAgIGFkZEF0dHIoJ2xhYmVsJyk7XG4gICAgICBhZGRBdHRyKCdhdXRvY29tcGxldGUnKTtcblxuICAgICAgbGV0IGV4dHJhY3RlZFRleHQgPSAnJztcbiAgICAgIGNvbnN0IHBpaU1hdGNoZXM6IHsgbm9kZUluZGV4OiBudW1iZXIsIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcsIHR5cGU6IHN0cmluZyB9W10gPSBbXTtcbiAgICAgIFxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBlbC5jaGlsZE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkID0gZWwuY2hpbGROb2Rlc1tqXTtcbiAgICAgICAgaWYgKGNoaWxkICYmIGNoaWxkLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuICAgICAgICAgIGNvbnN0IHJhd1RleHQgPSBjaGlsZC5ub2RlVmFsdWUgfHwgJyc7XG4gICAgICAgICAgaWYgKCFyYXdUZXh0LnRyaW0oKSkge1xuICAgICAgICAgICAgZXh0cmFjdGVkVGV4dCArPSByYXdUZXh0O1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IG1vZGlmaWVkVGV4dCA9IHJhd1RleHQ7XG4gICAgICAgICAgY29uc3QgbWF0Y2hlczogeyBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgdGV4dDogc3RyaW5nLCB0eXBlOiBzdHJpbmcgfVtdID0gW107XG5cbiAgICAgICAgICAvLyBFbWFpbFxuICAgICAgICAgIGZvciAoY29uc3QgbSBvZiByYXdUZXh0Lm1hdGNoQWxsKC9cXGJbQS1aYS16MC05Ll8lKy1dK0BbQS1aYS16MC05Li1dK1xcLltBLVphLXpdezIsfVxcYi9nKSkge1xuICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKHsgc3RhcnQ6IG0uaW5kZXghLCBlbmQ6IG0uaW5kZXghICsgbVswXS5sZW5ndGgsIHRleHQ6IG1bMF0sIHR5cGU6ICdFTUFJTCcgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEFhZGhhYXJcbiAgICAgICAgICBmb3IgKGNvbnN0IG0gb2YgcmF3VGV4dC5tYXRjaEFsbCgvXFxiWzItOV1cXGR7M31bXFxzLV0/XFxkezR9W1xccy1dP1xcZHs0fVxcYi9nKSkge1xuICAgICAgICAgICAgY29uc3QgY2xlYW4gPSBtWzBdLnJlcGxhY2UoL1tcXHMtXS9nLCAnJyk7XG4gICAgICAgICAgICBpZiAoL15bMi05XVxcZHsxMX0kLy50ZXN0KGNsZWFuKSkge1xuICAgICAgICAgICAgICBsZXQgYyA9IDA7XG4gICAgICAgICAgICAgIGNvbnN0IFZFUkhPRUZGX0Q9W1swLDEsMiwzLDQsNSw2LDcsOCw5XSxbMSwyLDMsNCwwLDYsNyw4LDksNV0sWzIsMyw0LDAsMSw3LDgsOSw1LDZdLFszLDQsMCwxLDIsOCw5LDUsNiw3XSxbNCwwLDEsMiwzLDksNSw2LDcsOF0sWzUsOSw4LDcsNiwwLDQsMywyLDFdLFs2LDUsOSw4LDcsMSwwLDQsMywyXSxbNyw2LDUsOSw4LDIsMSwwLDQsM10sWzgsNyw2LDUsOSwzLDIsMSwwLDRdLFs5LDgsNyw2LDUsNCwzLDIsMSwwXV07XG4gICAgICAgICAgICAgIGNvbnN0IFZFUkhPRUZGX1A9W1swLDEsMiwzLDQsNSw2LDcsOCw5XSxbMSw1LDcsNiwyLDgsMywwLDksNF0sWzUsOCwwLDMsNyw5LDYsMSw0LDJdLFs4LDksMSw2LDAsNCwzLDUsMiw3XSxbOSw0LDUsMywxLDIsNiw4LDcsMF0sWzQsMiw4LDYsNSw3LDMsOSwwLDFdLFsyLDcsOSwzLDgsMCw2LDQsMSw1XSxbNywwLDQsNiw5LDEsMywyLDUsOF1dO1xuICAgICAgICAgICAgICBjb25zdCBkaWdpdHMgPSBjbGVhbi5zcGxpdCgnJykubWFwKE51bWJlcikucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICBsZXQgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZ2l0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChkaWdpdHNbaV0gPT09IHVuZGVmaW5lZCkgeyB2YWxpZCA9IGZhbHNlOyBicmVhazsgfVxuICAgICAgICAgICAgICAgIGMgPSBWRVJIT0VGRl9EW2NdIVtWRVJIT0VGRl9QW2kgJSA4XSFbZGlnaXRzW2ldIV0hXSE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHZhbGlkICYmIGMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVzLnB1c2goeyBzdGFydDogbS5pbmRleCEsIGVuZDogbS5pbmRleCEgKyBtWzBdLmxlbmd0aCwgdGV4dDogbVswXSwgdHlwZTogJ0FBREhBQVInIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFBBTlxuICAgICAgICAgIGZvciAoY29uc3QgbSBvZiByYXdUZXh0Lm1hdGNoQWxsKC9cXGJbQS1aYS16XXs1fVxcZHs0fVtBLVphLXpdXFxiL2cpKSB7XG4gICAgICAgICAgICBpZiAoL15bQS1aXXszfVtQQ0hGQVRCTEpHXVtBLVpdXFxkezR9W0EtWl0kLy50ZXN0KG1bMF0udHJpbSgpLnRvVXBwZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICAgIG1hdGNoZXMucHVzaCh7IHN0YXJ0OiBtLmluZGV4ISwgZW5kOiBtLmluZGV4ISArIG1bMF0ubGVuZ3RoLCB0ZXh0OiBtWzBdLCB0eXBlOiAnUEFOJyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gUGhvbmUgKDEwIGRpZ2l0cylcbiAgICAgICAgICBmb3IgKGNvbnN0IG0gb2YgcmF3VGV4dC5tYXRjaEFsbCgvKD88IVxcZCkoPzooPzpcXCs5MXwwKVtcXHMtXT8pP1s2LTldKD86W1xccy1dP1xcZCl7OX0oPyFcXGQpL2cpKSB7XG4gICAgICAgICAgICBtYXRjaGVzLnB1c2goeyBzdGFydDogbS5pbmRleCEsIGVuZDogbS5pbmRleCEgKyBtWzBdLmxlbmd0aCwgdGV4dDogbVswXSwgdHlwZTogJ1BIT05FJyB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtYXRjaGVzLnNvcnQoKGEsIGIpID0+IGIuc3RhcnQgLSBhLnN0YXJ0KTtcblxuICAgICAgICAgIGZvciAoY29uc3QgbSBvZiBtYXRjaGVzKSB7XG4gICAgICAgICAgICBwaWlNYXRjaGVzLnB1c2goeyBub2RlSW5kZXg6IGosIHN0YXJ0OiBtLnN0YXJ0LCBlbmQ6IG0uZW5kLCB0ZXh0OiBtLnRleHQsIHR5cGU6IG0udHlwZSB9KTtcbiAgICAgICAgICAgIG1vZGlmaWVkVGV4dCA9IG1vZGlmaWVkVGV4dC5zdWJzdHJpbmcoMCwgbS5zdGFydCkgKyBgPCR7bS50eXBlfT5gICsgbW9kaWZpZWRUZXh0LnN1YnN0cmluZyhtLmVuZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGV4dHJhY3RlZFRleHQgKz0gbW9kaWZpZWRUZXh0ICsgJyAnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRleHQgPSBleHRyYWN0ZWRUZXh0LnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJykuc2xpY2UoMCwgMzAwKTtcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBBcnJheS5mcm9tKGVsLmNsYXNzTGlzdCk7XG4gICAgICBjb25zdCBlbmhhbmNlZCA9IGV4dHJhY3RFbmhhbmNlZERvbU1ldGFkYXRhKGVsKTtcblxuICAgICAgY2FjaGVkLnN0YXRpY0luZm8gPSB7XG4gICAgICAgIHRhZyxcbiAgICAgICAgcm9sZSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgYXJpYSxcbiAgICAgICAgcmVuZGVyaW5nLFxuICAgICAgICBoYXNfYmdfaW1hZ2UsXG4gICAgICAgIGhhbmRsZXJzX2hpbnQsXG4gICAgICAgIGlucHV0SW5mbyxcbiAgICAgICAgZXh0cmFjdGVkVGV4dDogdGV4dCxcbiAgICAgICAgY2xhc3NlcyxcbiAgICAgICAgcGlpTWF0Y2hlcyxcbiAgICAgICAgYXR0cmlidXRlczogYXR0cnMsXG4gICAgICAgIGVuaGFuY2VkLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBzID0gY2FjaGVkLnN0YXRpY0luZm8hO1xuICAgIGNvbnN0IGludGVyYWN0YWJsZSA9IHZpc2libGUgJiYgIXMuYXJpYS5kaXNhYmxlZCAmJiAhb2NjbHVkZWQ7XG5cbiAgICAvLyBFdmFsdWF0ZSBQSUkgYm91bmRzIGR5bmFtaWNhbGx5IGJhc2VkIG9uIGN1cnJlbnQgdmlld3BvcnRcbiAgICBmb3IgKGNvbnN0IG0gb2Ygcy5waWlNYXRjaGVzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBjaGlsZCA9IGVsLmNoaWxkTm9kZXNbbS5ub2RlSW5kZXhdO1xuICAgICAgICBpZiAoY2hpbGQgJiYgY2hpbGQubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgICAgY29uc3QgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICAgICAgICAgIHJhbmdlLnNldFN0YXJ0KGNoaWxkLCBtLnN0YXJ0KTtcbiAgICAgICAgICByYW5nZS5zZXRFbmQoY2hpbGQsIG0uZW5kKTtcbiAgICAgICAgICBjb25zdCByZWN0cyA9IHJhbmdlLmdldENsaWVudFJlY3RzKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCByZWN0cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IHJlY3RzW2tdO1xuICAgICAgICAgICAgaWYgKHJlY3QgJiYgcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwKSB7XG4gICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgIGRvbV9pZDogYHBpaV9zcGFuXyR7bmV4dFBpaUlkKyt9YCxcbiAgICAgICAgICAgICAgICBmcmFtZV9pZDogZnJhbWVJZCxcbiAgICAgICAgICAgICAgICBvcmlnaW46IHVybE9yaWdpbixcbiAgICAgICAgICAgICAgICB0YWc6ICdzcGFuJyxcbiAgICAgICAgICAgICAgICByb2xlOiBudWxsLFxuICAgICAgICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgICAgICAgdGV4dDogbS50ZXh0LFxuICAgICAgICAgICAgICAgIGJib3g6IFtcbiAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQocmVjdC5sZWZ0ICsgZnJhbWVPZmZzZXRbMF0pLFxuICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZChyZWN0LnRvcCArIGZyYW1lT2Zmc2V0WzFdKSxcbiAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQocmVjdC53aWR0aCksXG4gICAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKHJlY3QuaGVpZ2h0KSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGFyaWE6IHt9LFxuICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaW5fdmlld3BvcnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgb2NjbHVkZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGludGVyYWN0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmVuZGVyaW5nOiAnaHRtbCcsXG4gICAgICAgICAgICAgICAgaGFzX2JnX2ltYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBoYW5kbGVyc19oaW50OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwYXJlbnRfZG9tX2lkOiBkb21JZCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIGVsZW1lbnRzLnB1c2goe1xuICAgICAgZG9tX2lkOiBkb21JZCxcbiAgICAgIGZyYW1lX2lkOiBmcmFtZUlkLFxuICAgICAgb3JpZ2luOiB1cmxPcmlnaW4sXG4gICAgICB0YWc6IHMudGFnLFxuICAgICAgcm9sZTogcy5yb2xlLFxuICAgICAgbmFtZTogcy5uYW1lLFxuICAgICAgdGV4dDogcy5leHRyYWN0ZWRUZXh0LFxuICAgICAgY2xhc3Nlczogcy5jbGFzc2VzLFxuICAgICAgYXJpYTogcy5hcmlhLFxuICAgICAgaW5wdXQ6IHMuaW5wdXRJbmZvLFxuICAgICAgYXR0cmlidXRlczogcy5hdHRyaWJ1dGVzLFxuICAgICAgYmJveCxcbiAgICAgIHZpc2libGUsXG4gICAgICBpbl92aWV3cG9ydDogaW5WaWV3cG9ydCxcbiAgICAgIG9jY2x1ZGVkLFxuICAgICAgaW50ZXJhY3RhYmxlLFxuICAgICAgcmVuZGVyaW5nOiBzLnJlbmRlcmluZyxcbiAgICAgIGhhc19iZ19pbWFnZTogcy5oYXNfYmdfaW1hZ2UsXG4gICAgICBoYW5kbGVyc19oaW50OiBzLmhhbmRsZXJzX2hpbnQsXG4gICAgICBwYXJlbnRfZG9tX2lkOiBudWxsLFxuICAgICAgZWxlbWVudF9pZDogcy5lbmhhbmNlZC5lbGVtZW50X2lkLFxuICAgICAgZWxlbWVudF9uYW1lOiBzLmVuaGFuY2VkLmVsZW1lbnRfbmFtZSxcbiAgICAgIGxhYmVsOiBzLmVuaGFuY2VkLmxhYmVsLFxuICAgICAgZGVzY3JpcHRpb246IHMuZW5oYW5jZWQuZGVzY3JpcHRpb24sXG4gICAgICBhcmlhX2xhYmVsOiBzLmVuaGFuY2VkLmFyaWFfbGFiZWwsXG4gICAgICBhcmlhX2xhYmVsbGVkYnk6IHMuZW5oYW5jZWQuYXJpYV9sYWJlbGxlZGJ5LFxuICAgICAgYXJpYV9kZXNjcmliZWRieTogcy5lbmhhbmNlZC5hcmlhX2Rlc2NyaWJlZGJ5LFxuICAgICAgZm9ybV9pZDogcy5lbmhhbmNlZC5mb3JtX2lkLFxuICAgICAgc3RhYmxlX3NlbGVjdG9yOiBzLmVuaGFuY2VkLnN0YWJsZV9zZWxlY3RvcixcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IHBhZ2VTdGF0ZUhhc2ggPSBhd2FpdCBjb21wdXRlUGFnZVN0YXRlSGFzaChcbiAgICB1cmxPcmlnaW4sXG4gICAgdXJsUGF0aCxcbiAgICBmcmFtZXMsXG4gICAgZWxlbWVudHMsXG4gICAgd2luZG93LnNjcm9sbFlcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHNuYXBzaG90X2lkOiBgc25hcF8ke0RhdGUubm93KCl9YCxcbiAgICB1cmxfb3JpZ2luOiB1cmxPcmlnaW4sXG4gICAgdXJsX3BhdGg6IHVybFBhdGgsXG4gICAgZnJhbWVzLFxuICAgIGVsZW1lbnRzLFxuICAgIHZpZXdwb3J0LFxuICAgIGRwcjogd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSxcbiAgICBzY3JvbGw6IHsgeDogd2luZG93LnNjcm9sbFgsIHk6IHdpbmRvdy5zY3JvbGxZIH0sXG4gICAgcGFnZV9zdGF0ZV9oYXNoOiBwYWdlU3RhdGVIYXNoLFxuICAgIHRzOiBEYXRlLm5vdygpLFxuICB9O1xufVxuIiwiaW1wb3J0IHR5cGUgeyBEaXJ0eUV2ZW50IH0gZnJvbSAnQGNvbnRyYWN0cy9pbmRleC5qcyc7XG5pbXBvcnQgeyBidXMgfSBmcm9tICdAY29udHJhY3RzL2luZGV4LmpzJztcbmltcG9ydCB7IG1hcmtEaXJ0eSB9IGZyb20gJy4uL3BlcmNlcHRpb24vZG9tL3NuYXBzaG90LmpzJztcblxubGV0IG11dGF0aW9uT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgfCBudWxsID0gbnVsbDtcbmxldCBsYXN0U2Nyb2xsWSA9IDA7XG5sZXQgc2Nyb2xsVGltZW91dDogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcbmxldCBkaXJ0eVRpbWVvdXQ6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgbnVsbCA9IG51bGw7XG5sZXQgYmF0Y2hlZEJCb3g6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdIHwgbnVsbCA9IG51bGw7XG5sZXQgYWN0aXZlU2Nyb2xsTGlzdGVuZXI6ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc3RvcERvbU9ic2VydmVycygpIHtcbiAgaWYgKG11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgICBtdXRhdGlvbk9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICBtdXRhdGlvbk9ic2VydmVyID0gbnVsbDtcbiAgfVxuICBpZiAoc2Nyb2xsVGltZW91dCkgY2xlYXJUaW1lb3V0KHNjcm9sbFRpbWVvdXQpO1xuICBpZiAoZGlydHlUaW1lb3V0KSBjbGVhclRpbWVvdXQoZGlydHlUaW1lb3V0KTtcbiAgaWYgKGFjdGl2ZVNjcm9sbExpc3RlbmVyICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGFjdGl2ZVNjcm9sbExpc3RlbmVyKTtcbiAgICBhY3RpdmVTY3JvbGxMaXN0ZW5lciA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0RG9tT2JzZXJ2ZXJzKGZyYW1lSWQgPSAnbWFpbicpOiAoKSA9PiB2b2lkIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiAoKSA9PiB7fTtcblxuICBzdG9wRG9tT2JzZXJ2ZXJzKCk7IC8vIER1cGxpY2F0ZS1vYnNlcnZlciBwcmV2ZW50aW9uXG5cbiAgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICBsZXQgaGFzTWVhbmluZ2Z1bCA9IGZhbHNlO1xuXG4gICAgZm9yIChjb25zdCBtIG9mIG11dGF0aW9ucykge1xuICAgICAgbGV0IHRhcmdldCA9IG0udGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgaWYgKG0udHlwZSA9PT0gJ2NoYXJhY3RlckRhdGEnKSB7XG4gICAgICAgIHRhcmdldCA9IG0udGFyZ2V0LnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmICghdGFyZ2V0IHx8ICF0YXJnZXQuY2xvc2VzdCkgY29udGludWU7XG5cbiAgICAgIC8vIFByb3RlY3Rpb24gYWdhaW5zdCBleHRlbnNpb24tZ2VuZXJhdGVkIG11dGF0aW9uIGxvb3BzXG4gICAgICBpZiAodGFyZ2V0LmNsb3Nlc3QoJ1tkYXRhLWFnZW50LXVpXScpIHx8IHRhcmdldC5pZCA9PT0gJ19fc2loX2FnZW50X3VpX2hvc3RfXycpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChtLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgIGxldCBvbmx5RXh0ZW5zaW9uTm9kZXMgPSB0cnVlO1xuICAgICAgICBpZiAobS5hZGRlZE5vZGVzLmxlbmd0aCA9PT0gMCAmJiBtLnJlbW92ZWROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBvbmx5RXh0ZW5zaW9uTm9kZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbS5hZGRlZE5vZGVzLmZvckVhY2gobiA9PiB7XG4gICAgICAgICAgY29uc3QgZWwgPSBuIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgIGlmIChlbC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgIG9ubHlFeHRlbnNpb25Ob2RlcyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZWwuaWQgIT09ICdfX3NpaF9hZ2VudF91aV9ob3N0X18nICYmICFlbC5oYXNBdHRyaWJ1dGU/LignZGF0YS1hZ2VudC11aScpKSB7XG4gICAgICAgICAgICBvbmx5RXh0ZW5zaW9uTm9kZXMgPSBmYWxzZTtcbiAgICAgICAgICAgIG1hcmtEaXJ0eShlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIG0ucmVtb3ZlZE5vZGVzLmZvckVhY2gobiA9PiB7XG4gICAgICAgICAgY29uc3QgZWwgPSBuIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgIGlmIChlbC5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgIG9ubHlFeHRlbnNpb25Ob2RlcyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZWwuaWQgIT09ICdfX3NpaF9hZ2VudF91aV9ob3N0X18nICYmICFlbC5oYXNBdHRyaWJ1dGU/LignZGF0YS1hZ2VudC11aScpKSB7XG4gICAgICAgICAgICBvbmx5RXh0ZW5zaW9uTm9kZXMgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChvbmx5RXh0ZW5zaW9uTm9kZXMpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBtYXJrRGlydHkodGFyZ2V0KTtcblxuICAgICAgaGFzTWVhbmluZ2Z1bCA9IHRydWU7XG5cbiAgICAgIGlmICghYmF0Y2hlZEJCb3ggJiYgdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCkge1xuICAgICAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBiYXRjaGVkQkJveCA9IFtyZWN0LmxlZnQsIHJlY3QudG9wLCByZWN0LndpZHRoLCByZWN0LmhlaWdodF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFoYXNNZWFuaW5nZnVsKSByZXR1cm47XG5cbiAgICBpZiAoIWRpcnR5VGltZW91dCkge1xuICAgICAgZGlydHlUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGV2ZW50OiBEaXJ0eUV2ZW50ID0ge1xuICAgICAgICAgIHJlYXNvbjogJ211dGF0aW9uJyxcbiAgICAgICAgICBiYm94OiBiYXRjaGVkQkJveCxcbiAgICAgICAgICBmcmFtZV9pZDogZnJhbWVJZCxcbiAgICAgICAgICB0czogRGF0ZS5ub3coKSxcbiAgICAgICAgfTtcbiAgICAgICAgYnVzLnNlbmQoJ2RvbS9kaXJ0eScsIGV2ZW50KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICAgIGJhdGNoZWRCQm94ID0gbnVsbDtcbiAgICAgICAgZGlydHlUaW1lb3V0ID0gbnVsbDtcbiAgICAgIH0sIDEwMCk7IC8vIERlYm91bmNlXG4gICAgfVxuICB9KTtcblxuICBtdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgIGF0dHJpYnV0ZUZpbHRlcjogWydjbGFzcycsICdzdHlsZScsICdoaWRkZW4nLCAnYXJpYS1oaWRkZW4nLCAnZGlzYWJsZWQnXSxcbiAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlIC8vIFJlcXVpcmVkIGZvciB0ZXh0IGNoYW5nZXNcbiAgfSk7XG5cbiAgY29uc3Qgb25TY3JvbGwgPSAoKSA9PiB7XG4gICAgaWYgKE1hdGguYWJzKHdpbmRvdy5zY3JvbGxZIC0gbGFzdFNjcm9sbFkpIDwgMzIpIHJldHVybjtcbiAgICBsYXN0U2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZO1xuXG4gICAgaWYgKHNjcm9sbFRpbWVvdXQpIGNsZWFyVGltZW91dChzY3JvbGxUaW1lb3V0KTtcbiAgICBzY3JvbGxUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCBldmVudDogRGlydHlFdmVudCA9IHtcbiAgICAgICAgcmVhc29uOiAnc2Nyb2xsJyxcbiAgICAgICAgYmJveDogbnVsbCxcbiAgICAgICAgZnJhbWVfaWQ6IGZyYW1lSWQsXG4gICAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgfTtcbiAgICAgIGJ1cy5zZW5kKCdkb20vZGlydHknLCBldmVudCkuY2F0Y2goKCkgPT4ge30pO1xuICAgIH0sIDEwMCk7XG4gIH07XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIG9uU2Nyb2xsLCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gIGFjdGl2ZVNjcm9sbExpc3RlbmVyID0gb25TY3JvbGw7XG5cbiAgcmV0dXJuICgpID0+IHtcbiAgICBzdG9wRG9tT2JzZXJ2ZXJzKCk7XG4gIH07XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJCb3ggfSBmcm9tICdAY29udHJhY3RzL2luZGV4LmpzJztcblxubGV0IGFnZW50VWlDb250YWluZXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5sZXQgYWdlbnRVaVNoYWRvdzogU2hhZG93Um9vdCB8IG51bGwgPSBudWxsO1xuXG5mdW5jdGlvbiBlbnN1cmVBZ2VudFVpSG9zdCgpOiBTaGFkb3dSb290IHtcbiAgaWYgKGFnZW50VWlTaGFkb3cgJiYgYWdlbnRVaUNvbnRhaW5lciAmJiBhZ2VudFVpQ29udGFpbmVyLmlzQ29ubmVjdGVkKSB7XG4gICAgcmV0dXJuIGFnZW50VWlTaGFkb3c7XG4gIH1cblxuICBhZ2VudFVpQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGFnZW50VWlDb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhLWFnZW50LXVpJywgJ3RydWUnKTtcbiAgYWdlbnRVaUNvbnRhaW5lci5pZCA9ICdfX3NpaF9hZ2VudF91aV9ob3N0X18nO1xuICBhZ2VudFVpQ29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgYWdlbnRVaUNvbnRhaW5lci5zdHlsZS50b3AgPSAnMCc7XG4gIGFnZW50VWlDb250YWluZXIuc3R5bGUubGVmdCA9ICcwJztcbiAgYWdlbnRVaUNvbnRhaW5lci5zdHlsZS53aWR0aCA9ICcwJztcbiAgYWdlbnRVaUNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSAnMCc7XG4gIGFnZW50VWlDb250YWluZXIuc3R5bGUuekluZGV4ID0gJzIxNDc0ODM2NDcnO1xuICBhZ2VudFVpQ29udGFpbmVyLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG5cbiAgYWdlbnRVaVNoYWRvdyA9IGFnZW50VWlDb250YWluZXIuYXR0YWNoU2hhZG93KHsgbW9kZTogJ2Nsb3NlZCcgfSk7XG5cbiAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50ZXh0Q29udGVudCA9IGBcbiAgICAuYWN0aW9uLWhpZ2hsaWdodCB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBib3JkZXI6IDJweCBzb2xpZCAjM2I4MmY2O1xuICAgICAgYmFja2dyb3VuZDogcmdiYSg1OSwgMTMwLCAyNDYsIDAuMTUpO1xuICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuM3MgZWFzZS1vdXQ7XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIH1cbiAgYDtcbiAgYWdlbnRVaVNoYWRvdy5hcHBlbmRDaGlsZChzdHlsZSk7XG5cbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGFnZW50VWlDb250YWluZXIpO1xuICByZXR1cm4gYWdlbnRVaVNoYWRvdztcbn1cblxuLyoqXG4gKiBTaG93IGEgbW9tZW50YXJ5IGFjdGlvbiBoaWdobGlnaHQgYm91bmRpbmcgYm94IGZvciB2aXN1YWwgZmVlZGJhY2suXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaG93QWN0aW9uSGlnaGxpZ2h0KGJib3g6IEJCb3gsIGR1cmF0aW9uTXMgPSA4MDApOiB2b2lkIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcblxuICBjb25zdCBzaGFkb3cgPSBlbnN1cmVBZ2VudFVpSG9zdCgpO1xuICBjb25zdCBib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYm94LmNsYXNzTmFtZSA9ICdhY3Rpb24taGlnaGxpZ2h0JztcbiAgYm94LnN0eWxlLmxlZnQgPSBgJHtiYm94WzBdfXB4YDtcbiAgYm94LnN0eWxlLnRvcCA9IGAke2Jib3hbMV19cHhgO1xuICBib3guc3R5bGUud2lkdGggPSBgJHtiYm94WzJdfXB4YDtcbiAgYm94LnN0eWxlLmhlaWdodCA9IGAke2Jib3hbM119cHhgO1xuXG4gIHNoYWRvdy5hcHBlbmRDaGlsZChib3gpO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGJveC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgYm94LnJlbW92ZSgpO1xuICAgIH0sIDMwMCk7XG4gIH0sIGR1cmF0aW9uTXMpO1xufVxuIiwiaW1wb3J0IHsgc2hvd0FjdGlvbkhpZ2hsaWdodCB9IGZyb20gJy4uLy4uL2NvbnRlbnQvYWdlbnQtdWkuanMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZUNsaWNrKGVsOiBFbGVtZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gIC8vIDEuIFNjcm9sbCBpbnRvIHZpZXcgaWYgbmVlZGVkXG4gIGVsLnNjcm9sbEludG9WaWV3KHsgYmxvY2s6ICdjZW50ZXInLCBpbmxpbmU6ICdjZW50ZXInLCBiZWhhdmlvcjogJ2luc3RhbnQnIH0pO1xuXG4gIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgY3ggPSByZWN0LmxlZnQgKyByZWN0LndpZHRoIC8gMjtcbiAgY29uc3QgY3kgPSByZWN0LnRvcCArIHJlY3QuaGVpZ2h0IC8gMjtcblxuICAvLyAyLiBBbnRpLWRlY295IGNoZWNrOiB2ZXJpZnkgZWxlbWVudCBhdCBwb2ludCBpcyBpbmRlZWQgdGFyZ2V0IG9yIGRlc2NlbmRhbnRcbiAgaWYgKHR5cGVvZiBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uc3QgYXRQb2ludCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoY3gsIGN5KTtcbiAgICBpZiAoYXRQb2ludCAmJiBhdFBvaW50ICE9PSBlbCAmJiAhZWwuY29udGFpbnMoYXRQb2ludCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2xpY2sgYmxvY2tlZDogdGFyZ2V0IGlzIG9ic2N1cmVkIGJ5IGRlY295IGVsZW1lbnQgPCR7YXRQb2ludC50YWdOYW1lLnRvTG93ZXJDYXNlKCl9PmApO1xuICAgIH1cbiAgfVxuXG4gIC8vIDMuIEhpZ2hsaWdodFxuICBzaG93QWN0aW9uSGlnaGxpZ2h0KFtyZWN0LmxlZnQsIHJlY3QudG9wLCByZWN0LndpZHRoLCByZWN0LmhlaWdodF0pO1xuXG4gIC8vIDQuIERpc3BhdGNoIHBvaW50ZXIgJiBtb3VzZSBldmVudHNcbiAgY29uc3Qgb3B0czogTW91c2VFdmVudEluaXQgPSB7XG4gICAgYnViYmxlczogdHJ1ZSxcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgIHZpZXc6IHdpbmRvdyxcbiAgICBjbGllbnRYOiBjeCxcbiAgICBjbGllbnRZOiBjeSxcbiAgfTtcblxuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBQb2ludGVyRXZlbnQoJ3BvaW50ZXJkb3duJywgb3B0cykpO1xuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCBvcHRzKSk7XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IFBvaW50ZXJFdmVudCgncG9pbnRlcnVwJywgb3B0cykpO1xuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBNb3VzZUV2ZW50KCdtb3VzZXVwJywgb3B0cykpO1xuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBNb3VzZUV2ZW50KCdjbGljaycsIG9wdHMpKTtcblxuICBpZiAodHlwZW9mIChlbCBhcyBhbnkpLmNsaWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgKGVsIGFzIGFueSkuY2xpY2soKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgc2hvd0FjdGlvbkhpZ2hsaWdodCB9IGZyb20gJy4uLy4uL2NvbnRlbnQvYWdlbnQtdWkuanMnO1xuXG5mdW5jdGlvbiBzZXROYXRpdmVWYWx1ZShlbDogSFRNTEVsZW1lbnQsIHZhbDogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IGlzVGV4dGFyZWEgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd0ZXh0YXJlYSc7XG4gIGNvbnN0IHByb3RvdHlwZSA9IGlzVGV4dGFyZWFcbiAgICA/IHdpbmRvdy5IVE1MVGV4dEFyZWFFbGVtZW50LnByb3RvdHlwZVxuICAgIDogd2luZG93LkhUTUxJbnB1dEVsZW1lbnQucHJvdG90eXBlO1xuXG4gIGNvbnN0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgJ3ZhbHVlJyk7XG4gIGlmIChkZXNjcmlwdG9yPy5zZXQpIHtcbiAgICBkZXNjcmlwdG9yLnNldC5jYWxsKGVsLCB2YWwpO1xuICB9IGVsc2Uge1xuICAgIChlbCBhcyBhbnkpLnZhbHVlID0gdmFsO1xuICB9XG5cbiAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlVHlwZShlbDogRWxlbWVudCwgdGV4dDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGh0bWxFbCA9IGVsIGFzIEhUTUxFbGVtZW50O1xuICBodG1sRWwuZm9jdXMoKTtcblxuICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHNob3dBY3Rpb25IaWdobGlnaHQoW3JlY3QubGVmdCwgcmVjdC50b3AsIHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0XSk7XG5cbiAgc2V0TmF0aXZlVmFsdWUoaHRtbEVsLCB0ZXh0KTtcblxuICBpZiAoKGh0bWxFbCBhcyBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCkudmFsdWUgIT09IHRleHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1R5cGUgYWN0aW9uIGZhaWxlZDogRWxlbWVudCB2YWx1ZSBkaWQgbm90IHVwZGF0ZS4nKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZUZpbGxTZWNyZXQoZWw6IEVsZW1lbnQsIHNlY3JldFZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgbGV0IGVwaGVtZXJhbFNlY3JldDogc3RyaW5nIHwgbnVsbCA9IHNlY3JldFZhbHVlO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgaHRtbEVsID0gZWwgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaHRtbEVsLmZvY3VzKCk7XG5cbiAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgc2hvd0FjdGlvbkhpZ2hsaWdodChbcmVjdC5sZWZ0LCByZWN0LnRvcCwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHRdKTtcblxuICAgIHNldE5hdGl2ZVZhbHVlKGh0bWxFbCwgZXBoZW1lcmFsU2VjcmV0KTtcblxuICAgIGlmICgoaHRtbEVsIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50KS52YWx1ZSAhPT0gZXBoZW1lcmFsU2VjcmV0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGwgc2VjcmV0IGFjdGlvbiBmYWlsZWQ6IEVsZW1lbnQgdmFsdWUgZGlkIG5vdCB1cGRhdGUuJyk7XG4gICAgfVxuICB9IGZpbmFsbHkge1xuICAgIC8vIEludmFyaWFudCBJOTogWmVyb2l6ZSBzZWNyZXQgdmFyaWFibGUgaW1tZWRpYXRlbHlcbiAgICBlcGhlbWVyYWxTZWNyZXQgPSAnMDAwMDAwMDAwMDAwMDAwMCc7XG4gICAgZXBoZW1lcmFsU2VjcmV0ID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgc2hvd0FjdGlvbkhpZ2hsaWdodCB9IGZyb20gJy4uLy4uL2NvbnRlbnQvYWdlbnQtdWkuanMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZVNlbGVjdChlbDogRWxlbWVudCwgb3B0aW9uVGV4dE9yVmFsdWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHNob3dBY3Rpb25IaWdobGlnaHQoW3JlY3QubGVmdCwgcmVjdC50b3AsIHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0XSk7XG5cbiAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCcpIHtcbiAgICBjb25zdCBzZWxlY3RFbCA9IGVsIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RFbC5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBvcHQgPSBzZWxlY3RFbC5vcHRpb25zW2ldO1xuICAgICAgaWYgKG9wdCAmJiAob3B0LnZhbHVlID09PSBvcHRpb25UZXh0T3JWYWx1ZSB8fCBvcHQudGV4dC50cmltKCkgPT09IG9wdGlvblRleHRPclZhbHVlLnRyaW0oKSkpIHtcbiAgICAgICAgc2VsZWN0RWwuc2VsZWN0ZWRJbmRleCA9IGk7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFmb3VuZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBPcHRpb24gXCIke29wdGlvblRleHRPclZhbHVlfVwiIG5vdCBmb3VuZCBpbiBzZWxlY3QgZWxlbWVudGApO1xuICAgIH1cblxuICAgIHNlbGVjdEVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgc2VsZWN0RWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gRm9yIGN1c3RvbSBkcm9wZG93biBjb250cm9scywgdHJpZ2dlciBjbGlja1xuICAgIChlbCBhcyBIVE1MRWxlbWVudCkuY2xpY2soKTtcbiAgfVxufVxuIiwiZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVTY3JvbGwoXG4gIGRpcmVjdGlvbjogJ3VwJyB8ICdkb3duJyB8ICdsZWZ0JyB8ICdyaWdodCcgPSAnZG93bicsXG4gIHJhd0Ftb3VudCA9IDMwMFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGFtb3VudCA9IE1hdGgubWluKE1hdGgubWF4KDEwLCByYXdBbW91bnQpLCAxMjAwKTsgLy8gQ2FwIHNjcm9sbCBib3VuZHNcblxuICBsZXQgZHggPSAwO1xuICBsZXQgZHkgPSAwO1xuXG4gIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgY2FzZSAndXAnOlxuICAgICAgZHkgPSAtYW1vdW50O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZG93bic6XG4gICAgICBkeSA9IGFtb3VudDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgZHggPSAtYW1vdW50O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncmlnaHQnOlxuICAgICAgZHggPSBhbW91bnQ7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnN0IHN0YXJ0WCA9IHdpbmRvdy5zY3JvbGxYO1xuICAgIGNvbnN0IHN0YXJ0WSA9IHdpbmRvdy5zY3JvbGxZO1xuXG4gICAgd2luZG93LnNjcm9sbEJ5KHsgbGVmdDogZHgsIHRvcDogZHksIGJlaGF2aW9yOiAnaW5zdGFudCcgfSk7XG5cbiAgICBpZiAod2luZG93LnNjcm9sbFggPT09IHN0YXJ0WCAmJiB3aW5kb3cuc2Nyb2xsWSA9PT0gc3RhcnRZKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFNjcm9sbCAke2RpcmVjdGlvbn0gZmFpbGVkOiBObyBjaGFuZ2UgaW4gc2Nyb2xsIHBvc2l0aW9uLiBBbHJlYWR5IGF0IGVkZ2Ugb3Igbm90IHNjcm9sbGFibGUuYCk7XG4gICAgfVxuICB9XG59XG4iLCJjb25zdCBBTExPV0VEX0tFWVMgPSBuZXcgU2V0KFtcbiAgJ0VudGVyJyxcbiAgJ1RhYicsXG4gICdFc2NhcGUnLFxuICAnQmFja3NwYWNlJyxcbiAgJ0Fycm93VXAnLFxuICAnQXJyb3dEb3duJyxcbiAgJ0Fycm93TGVmdCcsXG4gICdBcnJvd1JpZ2h0Jyxcbl0pO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZUtleXByZXNzKGtleTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmICghQUxMT1dFRF9LRVlTLmhhcyhrZXkpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBLZXkgXCIke2tleX1cIiBpcyBub3QgaW4gd2hpdGVsaXN0ZWQgYWxsb3dlZCBrZXlzYCk7XG4gIH1cblxuICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XG4gIGNvbnN0IG9wdHM6IEtleWJvYXJkRXZlbnRJbml0ID0ge1xuICAgIGtleSxcbiAgICBidWJibGVzOiB0cnVlLFxuICAgIGNhbmNlbGFibGU6IHRydWUsXG4gIH07XG5cbiAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoJ2tleWRvd24nLCBvcHRzKSk7XG4gIHRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycsIG9wdHMpKTtcbiAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoJ2tleXVwJywgb3B0cykpO1xufVxuIiwiZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JTZXR0bGUoZGVib3VuY2VNcyA9IDE1MCwgbWF4V2FpdE1zID0gMjAwMCk6IFByb21pc2U8dm9pZD4ge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGxldCB0aW1lb3V0OiBhbnkgPSBudWxsO1xuICAgIGxldCBtYXhUaW1lb3V0OiBhbnkgPSBudWxsO1xuXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkb25lLCBkZWJvdW5jZU1zKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGRvbmUgPSAoKSA9PiB7XG4gICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICBjbGVhclRpbWVvdXQobWF4VGltZW91dCk7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfTtcblxuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoZG9uZSwgZGVib3VuY2VNcyk7XG4gICAgbWF4VGltZW91dCA9IHNldFRpbWVvdXQoZG9uZSwgbWF4V2FpdE1zKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IEV4ZWNSZXN1bHQsIFN0cnVjdHVyZWRBY3Rpb24gfSBmcm9tICdAY29udHJhY3RzL2luZGV4LmpzJztcbmltcG9ydCB7IHN0YWdlRXJyb3IgfSBmcm9tICdAY29udHJhY3RzL2NvbW1vbi5qcyc7XG5pbXBvcnQgeyBlbGVtZW50UmVnaXN0cnkgfSBmcm9tICcuLi8uLi9jb250ZW50L3JlZ2lzdHJ5LmpzJztcbmltcG9ydCB7IGV4ZWN1dGVDbGljayB9IGZyb20gJy4vY2xpY2suanMnO1xuaW1wb3J0IHsgZXhlY3V0ZUZpbGxTZWNyZXQsIGV4ZWN1dGVUeXBlIH0gZnJvbSAnLi90eXBlLmpzJztcbmltcG9ydCB7IGV4ZWN1dGVTZWxlY3QgfSBmcm9tICcuL3NlbGVjdC5qcyc7XG5pbXBvcnQgeyBleGVjdXRlU2Nyb2xsIH0gZnJvbSAnLi9zY3JvbGwuanMnO1xuaW1wb3J0IHsgZXhlY3V0ZUtleXByZXNzIH0gZnJvbSAnLi9rZXlwcmVzcy5qcyc7XG5pbXBvcnQgeyB3YWl0Rm9yU2V0dGxlIH0gZnJvbSAnLi9zZXR0bGUuanMnO1xuaW1wb3J0IHsgZXh0cmFjdERvbVNuYXBzaG90IH0gZnJvbSAnLi4vLi4vcGVyY2VwdGlvbi9kb20vc25hcHNob3QuanMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZUFjdGlvbihcbiAgYWN0aW9uOiBTdHJ1Y3R1cmVkQWN0aW9uLFxuICByZXNvbHZlZFNlY3JldD86IHN0cmluZ1xuKTogUHJvbWlzZTxFeGVjUmVzdWx0PiB7XG4gIGxldCB0YXJnZXRFbDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIGlmIChhY3Rpb24udGFyZ2V0KSB7XG4gICAgdGFyZ2V0RWwgPSBlbGVtZW50UmVnaXN0cnkuZ2V0QnlSZWdpb25JZChhY3Rpb24udGFyZ2V0LnJlZ2lvbl9pZCk7XG4gICAgaWYgKCF0YXJnZXRFbCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICBhY3Rpb25faWQ6IGFjdGlvbi5hY3Rpb25faWQsXG4gICAgICAgIG5hdmlnYXRlZDogZmFsc2UsXG4gICAgICAgIG5ld19wYWdlX3N0YXRlX2hhc2g6IG51bGwsXG4gICAgICAgIGVycm9yOiBzdGFnZUVycm9yKFxuICAgICAgICAgICdUQVJHRVRfTk9UX0ZPVU5EJyxcbiAgICAgICAgICAnZXhlY3V0ZScsXG4gICAgICAgICAgYENhbm5vdCBleGVjdXRlOiBlbGVtZW50IGZvciByZWdpb24gXCIke2FjdGlvbi50YXJnZXQucmVnaW9uX2lkfVwiIGlzIGRpc2Nvbm5lY3RlZCBvciBub3QgZm91bmRgXG4gICAgICAgICksXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHRyeSB7XG4gICAgc3dpdGNoIChhY3Rpb24uYWN0aW9uKSB7XG4gICAgICBjYXNlICdjbGljayc6IHtcbiAgICAgICAgaWYgKCF0YXJnZXRFbCkgdGhyb3cgbmV3IEVycm9yKCdDbGljayByZXF1aXJlcyBhIHRhcmdldCBlbGVtZW50Jyk7XG4gICAgICAgIGF3YWl0IGV4ZWN1dGVDbGljayh0YXJnZXRFbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICd0eXBlJzoge1xuICAgICAgICBpZiAoIXRhcmdldEVsKSB0aHJvdyBuZXcgRXJyb3IoJ1R5cGUgcmVxdWlyZXMgYSB0YXJnZXQgZWxlbWVudCcpO1xuICAgICAgICBhd2FpdCBleGVjdXRlVHlwZSh0YXJnZXRFbCwgYWN0aW9uLnBhcmFtcz8udGV4dCB8fCAnJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICdmaWxsX3NlY3JldCc6IHtcbiAgICAgICAgaWYgKCF0YXJnZXRFbCkgdGhyb3cgbmV3IEVycm9yKCdmaWxsX3NlY3JldCByZXF1aXJlcyBhIHRhcmdldCBlbGVtZW50Jyk7XG4gICAgICAgIGlmICghcmVzb2x2ZWRTZWNyZXQpIHRocm93IG5ldyBFcnJvcignZmlsbF9zZWNyZXQgcmVxdWlyZXMgYSByZXNvbHZlZCBzZWNyZXQgdmFsdWUnKTtcbiAgICAgICAgYXdhaXQgZXhlY3V0ZUZpbGxTZWNyZXQodGFyZ2V0RWwsIHJlc29sdmVkU2VjcmV0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ3NlbGVjdCc6IHtcbiAgICAgICAgaWYgKCF0YXJnZXRFbCkgdGhyb3cgbmV3IEVycm9yKCdTZWxlY3QgcmVxdWlyZXMgYSB0YXJnZXQgZWxlbWVudCcpO1xuICAgICAgICBhd2FpdCBleGVjdXRlU2VsZWN0KHRhcmdldEVsLCBhY3Rpb24ucGFyYW1zPy5vcHRpb24gfHwgJycpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnc2Nyb2xsJzoge1xuICAgICAgICBhd2FpdCBleGVjdXRlU2Nyb2xsKGFjdGlvbi5wYXJhbXM/LmRpcmVjdGlvbiwgYWN0aW9uLnBhcmFtcz8uYW1vdW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ2ZvY3VzJzoge1xuICAgICAgICBpZiAoIXRhcmdldEVsKSB0aHJvdyBuZXcgRXJyb3IoJ0ZvY3VzIHJlcXVpcmVzIGEgdGFyZ2V0IGVsZW1lbnQnKTtcbiAgICAgICAgKHRhcmdldEVsIGFzIEhUTUxFbGVtZW50KS5mb2N1cygpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAna2V5cHJlc3MnOiB7XG4gICAgICAgIGlmICghYWN0aW9uLnBhcmFtcz8ua2V5KSB0aHJvdyBuZXcgRXJyb3IoJ0tleXByZXNzIHJlcXVpcmVzIGEga2V5IHBhcmFtZXRlcicpO1xuICAgICAgICBhd2FpdCBleGVjdXRlS2V5cHJlc3MoYWN0aW9uLnBhcmFtcy5rZXkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnbmF2aWdhdGUnOiB7XG4gICAgICAgIGlmICghKGFjdGlvbi5wYXJhbXMgYXMgYW55KT8udXJsKSB0aHJvdyBuZXcgRXJyb3IoJ05hdmlnYXRlIHJlcXVpcmVzIGEgdXJsIHBhcmFtZXRlcicpO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IChhY3Rpb24ucGFyYW1zIGFzIGFueSkudXJsO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnYmFjayc6IHtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBhY3Rpb24gdHlwZTogJHsoYWN0aW9uIGFzIGFueSkuYWN0aW9ufWApO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIERPTSBtdXRhdGlvbnMgdG8gc2V0dGxlXG4gICAgYXdhaXQgd2FpdEZvclNldHRsZSgpO1xuXG4gICAgLy8gQ29tcHV0ZSBmcmVzaCBzdGF0ZSBoYXNoIGFmdGVyIGV4ZWN1dGlvblxuICAgIGNvbnN0IGZyZXNoU25hcHNob3QgPSBhd2FpdCBleHRyYWN0RG9tU25hcHNob3QoKTtcblxuICAgIHJldHVybiB7XG4gICAgICBvazogdHJ1ZSxcbiAgICAgIGFjdGlvbl9pZDogYWN0aW9uLmFjdGlvbl9pZCxcbiAgICAgIG5hdmlnYXRlZDogZmFsc2UsXG4gICAgICBuZXdfcGFnZV9zdGF0ZV9oYXNoOiBmcmVzaFNuYXBzaG90LnBhZ2Vfc3RhdGVfaGFzaCxcbiAgICB9O1xuICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgIC8vIFBoYXNlIDE1OiBTYWZlIEVycm9yIE5vcm1hbGl6YXRpb25cbiAgICAvLyBMb2cgdGhlIGludGVybmFsIGRpYWdub3N0aWMgZXJyb3IgdG8gdGhlIGNvbnNvbGUgZm9yIGRlYnVnZ2luZyBidXQgRE8gTk9UIGV4cG9zZSB0byB0aGUgQWdlbnQuXG4gICAgY29uc29sZS5lcnJvcignW0FjdGlvbiBFeGVjdXRvcl0gSW50ZXJuYWwgRXhlY3V0aW9uIEVycm9yOicsIGVycik7XG5cbiAgICBsZXQgc2FmZUVycm9yQ29kZTogYW55ID0gJ0lOVEVSTkFMJztcbiAgICBsZXQgc2FmZU1lc3NhZ2UgPSAnQWN0aW9uIGV4ZWN1dGlvbiBmYWlsZWQgZHVlIHRvIGFuIGludGVybmFsIGJyb3dzZXIgZXJyb3IuJztcblxuICAgIGNvbnN0IGVyck1zZyA9IGVycj8ubWVzc2FnZSB8fCBTdHJpbmcoZXJyKTtcbiAgICBpZiAoZXJyTXNnLmluY2x1ZGVzKCdyZXF1aXJlcyBhIHRhcmdldCBlbGVtZW50JykpIHtcbiAgICAgIHNhZmVFcnJvckNvZGUgPSAnVEFSR0VUX05PVF9GT1VORCc7XG4gICAgICBzYWZlTWVzc2FnZSA9ICdUaGUgcmVxdWVzdGVkIGFjdGlvbiByZXF1aXJlcyBhIHRhcmdldCByZWdpb24gdGhhdCB3YXMgbm90IGZvdW5kIG9yIHByb3ZpZGVkLic7XG4gICAgfSBlbHNlIGlmIChlcnJNc2cuaW5jbHVkZXMoJ3JlcXVpcmVzIGEgdXJsJykpIHtcbiAgICAgIHNhZmVFcnJvckNvZGUgPSAnSU5URVJOQUwnO1xuICAgICAgc2FmZU1lc3NhZ2UgPSAnVGhlIHJlcXVlc3RlZCBuYXZpZ2F0aW9uIGFjdGlvbiByZXF1aXJlcyBhIHZhbGlkIFVSTC4nO1xuICAgIH0gZWxzZSBpZiAoZXJyTXNnLmluY2x1ZGVzKCdVbnN1cHBvcnRlZCBhY3Rpb24gdHlwZScpKSB7XG4gICAgICBzYWZlRXJyb3JDb2RlID0gJ0lOVEVSTkFMJztcbiAgICAgIHNhZmVNZXNzYWdlID0gJ1RoZSByZXF1ZXN0ZWQgYWN0aW9uIHR5cGUgaXMgbm90IHN1cHBvcnRlZC4nO1xuICAgIH0gZWxzZSBpZiAoZXJyTXNnLmluY2x1ZGVzKCdmaWxsX3NlY3JldCByZXF1aXJlcyBhIHJlc29sdmVkIHNlY3JldCcpKSB7XG4gICAgICBzYWZlRXJyb3JDb2RlID0gJ0lOVEVSTkFMJztcbiAgICAgIHNhZmVNZXNzYWdlID0gJ1RoZSBzZWNyZXQgY291bGQgbm90IGJlIHJlc29sdmVkIGZvciBmaWxsaW5nLic7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9rOiBmYWxzZSxcbiAgICAgIGFjdGlvbl9pZDogYWN0aW9uLmFjdGlvbl9pZCxcbiAgICAgIG5hdmlnYXRlZDogZmFsc2UsXG4gICAgICBuZXdfcGFnZV9zdGF0ZV9oYXNoOiBudWxsLFxuICAgICAgZXJyb3I6IHN0YWdlRXJyb3Ioc2FmZUVycm9yQ29kZSwgJ2V4ZWN1dGUnLCBzYWZlTWVzc2FnZSksXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUge1xuICBEb21FbGVtZW50SW5mbyxcbiAgRG9tU25hcHNob3QsXG4gIFBlcmNlcHRpb25SZWdpb24sXG4gIFNlbWFudGljVHlwZSxcbiAgU291cmNlLFxuICBWaXN1YWxTdGF0ZSxcbn0gZnJvbSAnQGNvbnRyYWN0cy9pbmRleC5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBEb21Ub1NlbWFudGljVHlwZShlbDogRG9tRWxlbWVudEluZm8pOiBTZW1hbnRpY1R5cGUge1xuICBpZiAoZWwucm9sZSA9PT0gJ2J1dHRvbicgfHwgZWwudGFnID09PSAnYnV0dG9uJykgcmV0dXJuICdidXR0b24nO1xuICBpZiAoZWwuaW5wdXQpIHtcbiAgICBpZiAoZWwuaW5wdXQudHlwZSA9PT0gJ2NoZWNrYm94JykgcmV0dXJuICdjaGVja2JveCc7XG4gICAgaWYgKGVsLmlucHV0LnR5cGUgPT09ICdidXR0b24nIHx8IGVsLmlucHV0LnR5cGUgPT09ICdzdWJtaXQnKSByZXR1cm4gJ2J1dHRvbic7XG4gICAgcmV0dXJuICdpbnB1dCc7XG4gIH1cbiAgaWYgKGVsLnJvbGUgPT09ICdsaW5rJyB8fCBlbC50YWcgPT09ICdhJykgcmV0dXJuICdsaW5rJztcbiAgaWYgKGVsLnJvbGUgPT09ICdjb21ib2JveCcgfHwgZWwudGFnID09PSAnc2VsZWN0JykgcmV0dXJuICdkcm9wZG93bic7XG4gIGlmIChlbC50YWcgPT09ICdpbWcnIHx8IGVsLnJvbGUgPT09ICdpbWcnKSByZXR1cm4gJ2ltYWdlJztcbiAgaWYgKGVsLnJvbGUgPT09ICdkaWFsb2cnIHx8IGVsLnRhZyA9PT0gJ2RpYWxvZycpIHJldHVybiAnZGlhbG9nJztcbiAgaWYgKGVsLnRhZyA9PT0gJ3RhYmxlJykgcmV0dXJuICd0YWJsZSc7XG4gIGlmIChlbC50YWcgPT09ICduYXYnIHx8IGVsLnJvbGUgPT09ICduYXZpZ2F0aW9uJykgcmV0dXJuICduYXZpZ2F0aW9uJztcbiAgaWYgKGVsLnJvbGUgPT09ICd0YWInKSByZXR1cm4gJ3RhYic7XG4gIGlmIChlbC5yb2xlID09PSAnbWVudScgfHwgZWwucm9sZSA9PT0gJ21lbnVpdGVtJykgcmV0dXJuICdtZW51JztcbiAgaWYgKGVsLnRleHQgJiYgZWwudGV4dC5sZW5ndGggPiAwKSByZXR1cm4gJ3RleHQnO1xuICByZXR1cm4gJ3Vua25vd24nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG9tRWxlbWVudFRvUGVyY2VwdGlvblJlZ2lvbihcbiAgZWw6IERvbUVsZW1lbnRJbmZvLFxuICBzbmFwc2hvdDogRG9tU25hcHNob3Rcbik6IFBlcmNlcHRpb25SZWdpb24ge1xuICBjb25zdCBzb3VyY2VzOiBTb3VyY2VbXSA9IFsnRE9NJ107XG4gIGlmIChlbC5yb2xlIHx8IGVsLm5hbWUpIHtcbiAgICBzb3VyY2VzLnB1c2goJ0FSSUEnKTtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlczogVmlzdWFsU3RhdGVbXSA9IFtdO1xuICBpZiAoZWwudmlzaWJsZSkgc3RhdGVzLnB1c2goJ3Zpc2libGUnKTtcbiAgaWYgKGVsLmFyaWEuZGlzYWJsZWQpIHN0YXRlcy5wdXNoKCdkaXNhYmxlZCcpO1xuICBlbHNlIHN0YXRlcy5wdXNoKCdlbmFibGVkJyk7XG4gIGlmIChlbC5hcmlhLnNlbGVjdGVkKSBzdGF0ZXMucHVzaCgnc2VsZWN0ZWQnKTtcbiAgaWYgKGVsLmFyaWEuZXhwYW5kZWQpIHN0YXRlcy5wdXNoKCdleHBhbmRlZCcpO1xuICBlbHNlIGlmIChlbC5hcmlhLmV4cGFuZGVkID09PSBmYWxzZSkgc3RhdGVzLnB1c2goJ2NvbGxhcHNlZCcpO1xuICBpZiAoZWwuYXJpYS5jaGVja2VkID09PSB0cnVlKSBzdGF0ZXMucHVzaCgnY2hlY2tlZCcpO1xuICBlbHNlIGlmIChlbC5hcmlhLmNoZWNrZWQgPT09IGZhbHNlKSBzdGF0ZXMucHVzaCgndW5jaGVja2VkJyk7XG5cbiAgbGV0IHRleHQgPSBlbC5uYW1lIHx8IGVsLnRleHQgfHwgZWwuaW5wdXQ/LnBsYWNlaG9sZGVyIHx8IG51bGw7XG4gIGlmIChlbC5pbnB1dCAmJiAhZWwuaW5wdXQuaXNfcGFzc3dvcmQgJiYgZWwuaW5wdXQudmFsdWUgJiYgZWwuaW5wdXQudmFsdWUudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICBpZiAoZWwubmFtZSAmJiBlbC5uYW1lICE9PSBlbC5pbnB1dC52YWx1ZSkge1xuICAgICAgdGV4dCA9IGAke2VsLm5hbWV9OiAke2VsLmlucHV0LnZhbHVlfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRleHQgPSBlbC5pbnB1dC52YWx1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBQaGFzZSAyOiBBZGQgb3RoZXIgYXR0cmlidXRlcyB0byB0aGUgc2VhcmNoYWJsZSB0ZXh0IHNwYWNlXG4gIGlmIChlbC5hdHRyaWJ1dGVzKSB7XG4gICAgY29uc3QgYXR0clZhbHMgPSBPYmplY3QudmFsdWVzKGVsLmF0dHJpYnV0ZXMpLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZiAoYXR0clZhbHMubGVuZ3RoID4gMCkge1xuICAgICAgdGV4dCA9ICh0ZXh0ID8gdGV4dCArICcgJyA6ICcnKSArIGF0dHJWYWxzLmpvaW4oJyAnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHJlZ2lvbl9pZDogJycsIC8vIE1pbnRlZCBieSBhc3NlbWJsZUZyYW1lKClcbiAgICBsb2NhbF9rZXk6IGVsLmRvbV9pZCxcbiAgICBzb3VyY2U6IHNvdXJjZXMsXG4gICAgc2VtYW50aWNfdHlwZTogbWFwRG9tVG9TZW1hbnRpY1R5cGUoZWwpLFxuICAgIHRleHQsXG4gICAgYmJveDogZWwuYmJveCxcbiAgICBjb25maWRlbmNlOiAwLjk1LFxuICAgIHZpc2libGU6IGVsLnZpc2libGUsXG4gICAgaW50ZXJhY3RhYmxlOiBlbC5pbnRlcmFjdGFibGUsXG4gICAgdmlzdWFsX3N0YXRlOiBzdGF0ZXMsXG4gICAgZG9tX3JlZjoge1xuICAgICAgZG9tX2lkOiBlbC5kb21faWQsXG4gICAgICByb2xlOiBlbC5yb2xlLFxuICAgICAgdGFnOiBlbC50YWcsXG4gICAgfSxcbiAgICByb3V0ZTogJ0hJR0gnLFxuICAgIHNlbnNpdGl2aXR5OiAndW5jbGFzc2lmaWVkJyxcbiAgICBvcmlnaW46IGVsLm9yaWdpbixcbiAgICBmcmFtZV9pZDogZWwuZnJhbWVfaWQsXG4gICAgcGFnZV9zdGF0ZV9oYXNoOiBzbmFwc2hvdC5wYWdlX3N0YXRlX2hhc2gsXG4gICAgdGltZXN0YW1wOiBzbmFwc2hvdC50cyxcbiAgfTtcbn1cbiIsImltcG9ydCB7IGRlZmluZUNvbnRlbnRTY3JpcHQgfSBmcm9tICd3eHQvc2FuZGJveCc7XG5pbXBvcnQgeyBidXMgfSBmcm9tICdAY29udHJhY3RzL2luZGV4LmpzJztcbmltcG9ydCB7IGV4dHJhY3REb21TbmFwc2hvdCB9IGZyb20gJy4uL3NyYy9wZXJjZXB0aW9uL2RvbS9zbmFwc2hvdC5qcyc7XG5pbXBvcnQgeyBzdGFydERvbU9ic2VydmVycyB9IGZyb20gJy4uL3NyYy9jb250ZW50L29ic2VydmVycy5qcyc7XG5pbXBvcnQgeyBlbGVtZW50UmVnaXN0cnkgfSBmcm9tICcuLi9zcmMvY29udGVudC9yZWdpc3RyeS5qcyc7XG5pbXBvcnQgeyBleGVjdXRlQWN0aW9uIH0gZnJvbSAnLi4vc3JjL2FjdGlvbnMvZXhlY3V0b3IvaW5kZXguanMnO1xuaW1wb3J0IHsgaXNFbGVtZW50T2NjbHVkZWQsIGlzRWxlbWVudFZpc2libGUgfSBmcm9tICcuLi9zcmMvcGVyY2VwdGlvbi9kb20vdmlzaWJpbGl0eS5qcyc7XG5pbXBvcnQgeyBtYXBEb21Ub1NlbWFudGljVHlwZSB9IGZyb20gJy4uL3NyYy9wZXJjZXB0aW9uL2RvbS90by1yZWdpb25zLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29udGVudFNjcmlwdCh7XG4gIG1hdGNoZXM6IFsnPGFsbF91cmxzPiddLFxuICBhbGxGcmFtZXM6IHRydWUsXG4gIG1hdGNoQWJvdXRCbGFuazogdHJ1ZSxcbiAgcnVuQXQ6ICdkb2N1bWVudF9pZGxlJyxcbiAgbWFpbigpIHtcbiAgICBjb25zdCBpc1RvcCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5zZWxmID09PSB3aW5kb3cudG9wO1xuICAgIGNvbnN0IGZyYW1lSWQgPSBpc1RvcCA/ICdtYWluJyA6IGBmcmFtZV8ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCA3KX1gO1xuXG4gICAgLy8gU3RhcnQgRE9NIG11dGF0aW9uICYgc2Nyb2xsIG9ic2VydmVyc1xuICAgIHN0YXJ0RG9tT2JzZXJ2ZXJzKGZyYW1lSWQpO1xuXG4gICAgLy8gU3luY2hyb25vdXMgdG9wLWxldmVsIGJ1cyBsaXN0ZW5lcnNcbiAgICBidXMub24oJ2RvbS9zbmFwc2hvdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJldHVybiBleHRyYWN0RG9tU25hcHNob3QoZnJhbWVJZCk7XG4gICAgfSk7XG5cbiAgICBidXMub24oJ2RvbS9maW5nZXJwcmludCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHNuYXAgPSBhd2FpdCBleHRyYWN0RG9tU25hcHNob3QoZnJhbWVJZCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwYWdlX3N0YXRlX2hhc2g6IHNuYXAucGFnZV9zdGF0ZV9oYXNoLFxuICAgICAgICBvcmlnaW46IHNuYXAudXJsX29yaWdpbixcbiAgICAgICAgZnJhbWVfaWQ6IGZyYW1lSWQsXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgYnVzLm9uKCdyZWdpc3RyeS9zZXQnLCBhc3luYyAocGF5bG9hZCkgPT4ge1xuICAgICAgZWxlbWVudFJlZ2lzdHJ5LnNldFJlZ2lvbk1hcHBpbmcocGF5bG9hZC5tYXBwaW5nKTtcbiAgICAgIHJldHVybiB7IGFwcGxpZWQ6IHRydWUgfTtcbiAgICB9KTtcblxuICAgIGJ1cy5vbignYWN0aW9uL3Jlc29sdmUtdGFyZ2V0JywgYXN5bmMgKHBheWxvYWQpID0+IHtcbiAgICAgIGNvbnN0IGVsID0gZWxlbWVudFJlZ2lzdHJ5LmdldEJ5UmVnaW9uSWQocGF5bG9hZC5yZWdpb25faWQpO1xuICAgICAgaWYgKCFlbCB8fCAhZWwuaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBleGlzdHM6IGZhbHNlLFxuICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgIGludGVyYWN0YWJsZTogZmFsc2UsXG4gICAgICAgICAgb2NjbHVkZWQ6IGZhbHNlLFxuICAgICAgICAgIGJib3g6IFswLCAwLCAwLCAwXSxcbiAgICAgICAgICBvcmlnaW46IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sXG4gICAgICAgICAgZnJhbWVfaWQ6IGZyYW1lSWQsXG4gICAgICAgICAgc2VtYW50aWNfdHlwZTogJ3Vua25vd24nLFxuICAgICAgICAgIGlucHV0X3R5cGU6IG51bGwsXG4gICAgICAgICAgaXNfcGFzc3dvcmQ6IGZhbHNlLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCB2aXNpYmxlID0gaXNFbGVtZW50VmlzaWJsZShlbCk7XG4gICAgICBjb25zdCBjeCA9IHJlY3QubGVmdCArIHJlY3Qud2lkdGggLyAyO1xuICAgICAgY29uc3QgY3kgPSByZWN0LnRvcCArIHJlY3QuaGVpZ2h0IC8gMjtcbiAgICAgIGNvbnN0IG9jY2x1ZGVkID0gaXNFbGVtZW50T2NjbHVkZWQoZWwsIGN4LCBjeSk7XG4gICAgICBjb25zdCBpbnRlcmFjdGFibGUgPSB2aXNpYmxlICYmICEoZWwgYXMgYW55KS5kaXNhYmxlZCAmJiAhb2NjbHVkZWQ7XG5cbiAgICAgIGNvbnN0IHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGxldCBpbnB1dFR5cGU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgICAgbGV0IGlzUGFzc3dvcmQgPSBmYWxzZTtcblxuICAgICAgaWYgKHRhZyA9PT0gJ2lucHV0Jykge1xuICAgICAgICBpbnB1dFR5cGUgPSAoKGVsIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnR5cGUgfHwgJ3RleHQnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpc1Bhc3N3b3JkID0gaW5wdXRUeXBlID09PSAncGFzc3dvcmQnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBleGlzdHM6IHRydWUsXG4gICAgICAgIHZpc2libGUsXG4gICAgICAgIGludGVyYWN0YWJsZSxcbiAgICAgICAgb2NjbHVkZWQsXG4gICAgICAgIGJib3g6IFtcbiAgICAgICAgICBNYXRoLnJvdW5kKHJlY3QubGVmdCksXG4gICAgICAgICAgTWF0aC5yb3VuZChyZWN0LnRvcCksXG4gICAgICAgICAgTWF0aC5yb3VuZChyZWN0LndpZHRoKSxcbiAgICAgICAgICBNYXRoLnJvdW5kKHJlY3QuaGVpZ2h0KSxcbiAgICAgICAgXSxcbiAgICAgICAgb3JpZ2luOiB3aW5kb3cubG9jYXRpb24ub3JpZ2luLFxuICAgICAgICBmcmFtZV9pZDogZnJhbWVJZCxcbiAgICAgICAgc2VtYW50aWNfdHlwZTogbWFwRG9tVG9TZW1hbnRpY1R5cGUoe1xuICAgICAgICAgIGRvbV9pZDogJycsXG4gICAgICAgICAgZnJhbWVfaWQ6IGZyYW1lSWQsXG4gICAgICAgICAgb3JpZ2luOiB3aW5kb3cubG9jYXRpb24ub3JpZ2luLFxuICAgICAgICAgIHRhZyxcbiAgICAgICAgICByb2xlOiBlbC5nZXRBdHRyaWJ1dGUoJ3JvbGUnKSxcbiAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgIHRleHQ6IGVsLnRleHRDb250ZW50IHx8ICcnLFxuICAgICAgICAgIGFyaWE6IHt9LFxuICAgICAgICAgIGJib3g6IFswLCAwLCAwLCAwXSxcbiAgICAgICAgICB2aXNpYmxlLFxuICAgICAgICAgIGluX3ZpZXdwb3J0OiB0cnVlLFxuICAgICAgICAgIG9jY2x1ZGVkLFxuICAgICAgICAgIGludGVyYWN0YWJsZSxcbiAgICAgICAgICByZW5kZXJpbmc6ICdodG1sJyxcbiAgICAgICAgICBoYXNfYmdfaW1hZ2U6IGZhbHNlLFxuICAgICAgICAgIGhhbmRsZXJzX2hpbnQ6IGZhbHNlLFxuICAgICAgICAgIHBhcmVudF9kb21faWQ6IG51bGwsXG4gICAgICAgIH0pLFxuICAgICAgICBpbnB1dF90eXBlOiBpbnB1dFR5cGUsXG4gICAgICAgIGlzX3Bhc3N3b3JkOiBpc1Bhc3N3b3JkLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGJ1cy5vbignYWN0aW9uL2V4ZWN1dGUnLCBhc3luYyAocGF5bG9hZCkgPT4ge1xuICAgICAgcmV0dXJuIGV4ZWN1dGVBY3Rpb24ocGF5bG9hZC5hY3Rpb24sIHBheWxvYWQucmVzb2x2ZWRfc2VjcmV0KTtcbiAgICB9KTtcblxuICAgIGJ1cy5vbigndGVzdC9pbmplY3QtZG9tLWNoYW5nZScsIGFzeW5jIChwYXlsb2FkKSA9PiB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGRpdi5pbm5lckhUTUwgPSBwYXlsb2FkLmh0bWw7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICByZXR1cm4geyBpbmplY3RlZDogdHJ1ZSB9O1xuICAgIH0pO1xuICB9LFxufSk7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIiwgW1wibW9kdWxlXCJdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGZhY3RvcnkobW9kdWxlKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbW9kID0ge1xuICAgICAgZXhwb3J0czoge31cbiAgICB9O1xuICAgIGZhY3RvcnkobW9kKTtcbiAgICBnbG9iYWwuYnJvd3NlciA9IG1vZC5leHBvcnRzO1xuICB9XG59KSh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFRoaXMgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbiAobW9kdWxlKSB7XG4gIC8qIHdlYmV4dGVuc2lvbi1wb2x5ZmlsbCAtIHYwLjEyLjAgLSBUdWUgTWF5IDE0IDIwMjQgMTg6MDE6MjkgKi9cbiAgLyogLSotIE1vZGU6IGluZGVudC10YWJzLW1vZGU6IG5pbDsganMtaW5kZW50LWxldmVsOiAyIC0qLSAqL1xuICAvKiB2aW06IHNldCBzdHM9MiBzdz0yIGV0IHR3PTgwOiAqL1xuICAvKiBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljXG4gICAqIExpY2Vuc2UsIHYuIDIuMC4gSWYgYSBjb3B5IG9mIHRoZSBNUEwgd2FzIG5vdCBkaXN0cmlidXRlZCB3aXRoIHRoaXNcbiAgICogZmlsZSwgWW91IGNhbiBvYnRhaW4gb25lIGF0IGh0dHA6Ly9tb3ppbGxhLm9yZy9NUEwvMi4wLy4gKi9cbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgaWYgKCEoZ2xvYmFsVGhpcy5jaHJvbWUgJiYgZ2xvYmFsVGhpcy5jaHJvbWUucnVudGltZSAmJiBnbG9iYWxUaGlzLmNocm9tZS5ydW50aW1lLmlkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgc2NyaXB0IHNob3VsZCBvbmx5IGJlIGxvYWRlZCBpbiBhIGJyb3dzZXIgZXh0ZW5zaW9uLlwiKTtcbiAgfVxuICBpZiAoIShnbG9iYWxUaGlzLmJyb3dzZXIgJiYgZ2xvYmFsVGhpcy5icm93c2VyLnJ1bnRpbWUgJiYgZ2xvYmFsVGhpcy5icm93c2VyLnJ1bnRpbWUuaWQpKSB7XG4gICAgY29uc3QgQ0hST01FX1NFTkRfTUVTU0FHRV9DQUxMQkFDS19OT19SRVNQT05TRV9NRVNTQUdFID0gXCJUaGUgbWVzc2FnZSBwb3J0IGNsb3NlZCBiZWZvcmUgYSByZXNwb25zZSB3YXMgcmVjZWl2ZWQuXCI7XG5cbiAgICAvLyBXcmFwcGluZyB0aGUgYnVsayBvZiB0aGlzIHBvbHlmaWxsIGluIGEgb25lLXRpbWUtdXNlIGZ1bmN0aW9uIGlzIGEgbWlub3JcbiAgICAvLyBvcHRpbWl6YXRpb24gZm9yIEZpcmVmb3guIFNpbmNlIFNwaWRlcm1vbmtleSBkb2VzIG5vdCBmdWxseSBwYXJzZSB0aGVcbiAgICAvLyBjb250ZW50cyBvZiBhIGZ1bmN0aW9uIHVudGlsIHRoZSBmaXJzdCB0aW1lIGl0J3MgY2FsbGVkLCBhbmQgc2luY2UgaXQgd2lsbFxuICAgIC8vIG5ldmVyIGFjdHVhbGx5IG5lZWQgdG8gYmUgY2FsbGVkLCB0aGlzIGFsbG93cyB0aGUgcG9seWZpbGwgdG8gYmUgaW5jbHVkZWRcbiAgICAvLyBpbiBGaXJlZm94IG5lYXJseSBmb3IgZnJlZS5cbiAgICBjb25zdCB3cmFwQVBJcyA9IGV4dGVuc2lvbkFQSXMgPT4ge1xuICAgICAgLy8gTk9URTogYXBpTWV0YWRhdGEgaXMgYXNzb2NpYXRlZCB0byB0aGUgY29udGVudCBvZiB0aGUgYXBpLW1ldGFkYXRhLmpzb24gZmlsZVxuICAgICAgLy8gYXQgYnVpbGQgdGltZSBieSByZXBsYWNpbmcgdGhlIGZvbGxvd2luZyBcImluY2x1ZGVcIiB3aXRoIHRoZSBjb250ZW50IG9mIHRoZVxuICAgICAgLy8gSlNPTiBmaWxlLlxuICAgICAgY29uc3QgYXBpTWV0YWRhdGEgPSB7XG4gICAgICAgIFwiYWxhcm1zXCI6IHtcbiAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY2xlYXJBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJib29rbWFya3NcIjoge1xuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q2hpbGRyZW5cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRSZWNlbnRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRTdWJUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VHJlZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NlckFjdGlvblwiOiB7XG4gICAgICAgICAgXCJkaXNhYmxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZW5hYmxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3JcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZVRleHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3JcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZVRleHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0UG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRUaXRsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJyb3dzaW5nRGF0YVwiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDYWNoZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNvb2tpZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVEb3dubG9hZHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVGb3JtRGF0YVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUhpc3RvcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVMb2NhbFN0b3JhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVQYXNzd29yZHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVQbHVnaW5EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb21tYW5kc1wiOiB7XG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb250ZXh0TWVudXNcIjoge1xuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29va2llc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxDb29raWVTdG9yZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkZXZ0b29sc1wiOiB7XG4gICAgICAgICAgXCJpbnNwZWN0ZWRXaW5kb3dcIjoge1xuICAgICAgICAgICAgXCJldmFsXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhbmVsc1wiOiB7XG4gICAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMyxcbiAgICAgICAgICAgICAgXCJzaW5nbGVDYWxsYmFja0FyZ1wiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbGVtZW50c1wiOiB7XG4gICAgICAgICAgICAgIFwiY3JlYXRlU2lkZWJhclBhbmVcIjoge1xuICAgICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZG93bmxvYWRzXCI6IHtcbiAgICAgICAgICBcImNhbmNlbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRvd25sb2FkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZXJhc2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRGaWxlSWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJwYXVzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZpbGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN1bWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZXh0ZW5zaW9uXCI6IHtcbiAgICAgICAgICBcImlzQWxsb3dlZEZpbGVTY2hlbWVBY2Nlc3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpc0FsbG93ZWRJbmNvZ25pdG9BY2Nlc3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJoaXN0b3J5XCI6IHtcbiAgICAgICAgICBcImFkZFVybFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlbGV0ZUFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlbGV0ZVJhbmdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VmlzaXRzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaTE4blwiOiB7XG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFjY2VwdExhbmd1YWdlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImlkZW50aXR5XCI6IHtcbiAgICAgICAgICBcImxhdW5jaFdlYkF1dGhGbG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRsZVwiOiB7XG4gICAgICAgICAgXCJxdWVyeVN0YXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibWFuYWdlbWVudFwiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRTZWxmXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0RW5hYmxlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVuaW5zdGFsbFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJub3RpZmljYXRpb25zXCI6IHtcbiAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UGVybWlzc2lvbkxldmVsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGFnZUFjdGlvblwiOiB7XG4gICAgICAgICAgXCJnZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaGlkZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2hvd1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInBlcm1pc3Npb25zXCI6IHtcbiAgICAgICAgICBcImNvbnRhaW5zXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVxdWVzdFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInJ1bnRpbWVcIjoge1xuICAgICAgICAgIFwiZ2V0QmFja2dyb3VuZFBhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQbGF0Zm9ybUluZm9cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuT3B0aW9uc1BhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0VXBkYXRlQ2hlY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmROYXRpdmVNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VW5pbnN0YWxsVVJMXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic2Vzc2lvbnNcIjoge1xuICAgICAgICAgIFwiZ2V0RGV2aWNlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudGx5Q2xvc2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVzdG9yZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInN0b3JhZ2VcIjoge1xuICAgICAgICAgIFwibG9jYWxcIjoge1xuICAgICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtYW5hZ2VkXCI6IHtcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInN5bmNcIjoge1xuICAgICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0YWJzXCI6IHtcbiAgICAgICAgICBcImNhcHR1cmVWaXNpYmxlVGFiXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGV0ZWN0TGFuZ3VhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkaXNjYXJkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZHVwbGljYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZXhlY3V0ZVNjcmlwdFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEN1cnJlbnRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Wm9vbVNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ29CYWNrXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ29Gb3J3YXJkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaGlnaGxpZ2h0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaW5zZXJ0Q1NTXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInF1ZXJ5XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVsb2FkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ1NTXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0Wm9vbVNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwidG9wU2l0ZXNcIjoge1xuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViTmF2aWdhdGlvblwiOiB7XG4gICAgICAgICAgXCJnZXRBbGxGcmFtZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRGcmFtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndlYlJlcXVlc3RcIjoge1xuICAgICAgICAgIFwiaGFuZGxlckJlaGF2aW9yQ2hhbmdlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndpbmRvd3NcIjoge1xuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldExhc3RGb2N1c2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoT2JqZWN0LmtleXMoYXBpTWV0YWRhdGEpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcGktbWV0YWRhdGEuanNvbiBoYXMgbm90IGJlZW4gaW5jbHVkZWQgaW4gYnJvd3Nlci1wb2x5ZmlsbFwiKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBBIFdlYWtNYXAgc3ViY2xhc3Mgd2hpY2ggY3JlYXRlcyBhbmQgc3RvcmVzIGEgdmFsdWUgZm9yIGFueSBrZXkgd2hpY2ggZG9lc1xuICAgICAgICogbm90IGV4aXN0IHdoZW4gYWNjZXNzZWQsIGJ1dCBiZWhhdmVzIGV4YWN0bHkgYXMgYW4gb3JkaW5hcnkgV2Vha01hcFxuICAgICAgICogb3RoZXJ3aXNlLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNyZWF0ZUl0ZW1cbiAgICAgICAqICAgICAgICBBIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgdmFsdWUgZm9yIGFueVxuICAgICAgICogICAgICAgIGtleSB3aGljaCBkb2VzIG5vdCBleGlzdCwgdGhlIGZpcnN0IHRpbWUgaXQgaXMgYWNjZXNzZWQuIFRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHJlY2VpdmVzLCBhcyBpdHMgb25seSBhcmd1bWVudCwgdGhlIGtleSBiZWluZyBjcmVhdGVkLlxuICAgICAgICovXG4gICAgICBjbGFzcyBEZWZhdWx0V2Vha01hcCBleHRlbmRzIFdlYWtNYXAge1xuICAgICAgICBjb25zdHJ1Y3RvcihjcmVhdGVJdGVtLCBpdGVtcyA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHN1cGVyKGl0ZW1zKTtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUl0ZW0gPSBjcmVhdGVJdGVtO1xuICAgICAgICB9XG4gICAgICAgIGdldChrZXkpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgdGhpcy5jcmVhdGVJdGVtKGtleSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3VwZXIuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG9iamVjdCBpcyBhbiBvYmplY3Qgd2l0aCBhIGB0aGVuYCBtZXRob2QsIGFuZCBjYW5cbiAgICAgICAqIHRoZXJlZm9yZSBiZSBhc3N1bWVkIHRvIGJlaGF2ZSBhcyBhIFByb21pc2UuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdC5cbiAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB0aGVuYWJsZS5cbiAgICAgICAqL1xuICAgICAgY29uc3QgaXNUaGVuYWJsZSA9IHZhbHVlID0+IHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gXCJmdW5jdGlvblwiO1xuICAgICAgfTtcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gd2hpY2gsIHdoZW4gY2FsbGVkLCB3aWxsIHJlc29sdmUgb3IgcmVqZWN0XG4gICAgICAgKiB0aGUgZ2l2ZW4gcHJvbWlzZSBiYXNlZCBvbiBob3cgaXQgaXMgY2FsbGVkOlxuICAgICAgICpcbiAgICAgICAqIC0gSWYsIHdoZW4gY2FsbGVkLCBgY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yYCBjb250YWlucyBhIG5vbi1udWxsIG9iamVjdCxcbiAgICAgICAqICAgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQgd2l0aCB0aGF0IHZhbHVlLlxuICAgICAgICogLSBJZiB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggZXhhY3RseSBvbmUgYXJndW1lbnQsIHRoZSBwcm9taXNlIGlzXG4gICAgICAgKiAgIHJlc29sdmVkIHRvIHRoYXQgdmFsdWUuXG4gICAgICAgKiAtIE90aGVyd2lzZSwgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgdG8gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlXG4gICAgICAgKiAgIGZ1bmN0aW9uJ3MgYXJndW1lbnRzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9taXNlXG4gICAgICAgKiAgICAgICAgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHJlc29sdXRpb24gYW5kIHJlamVjdGlvbiBmdW5jdGlvbnMgb2YgYVxuICAgICAgICogICAgICAgIHByb21pc2UuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9taXNlLnJlc29sdmVcbiAgICAgICAqICAgICAgICBUaGUgcHJvbWlzZSdzIHJlc29sdXRpb24gZnVuY3Rpb24uXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9taXNlLnJlamVjdFxuICAgICAgICogICAgICAgIFRoZSBwcm9taXNlJ3MgcmVqZWN0aW9uIGZ1bmN0aW9uLlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IG1ldGFkYXRhXG4gICAgICAgKiAgICAgICAgTWV0YWRhdGEgYWJvdXQgdGhlIHdyYXBwZWQgbWV0aG9kIHdoaWNoIGhhcyBjcmVhdGVkIHRoZSBjYWxsYmFjay5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAgICAgICAqICAgICAgICBUaGUgZ2VuZXJhdGVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICovXG4gICAgICBjb25zdCBtYWtlQ2FsbGJhY2sgPSAocHJvbWlzZSwgbWV0YWRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuICguLi5jYWxsYmFja0FyZ3MpID0+IHtcbiAgICAgICAgICBpZiAoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgfHwgY2FsbGJhY2tBcmdzLmxlbmd0aCA8PSAxICYmIG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJnc1swXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZShjYWxsYmFja0FyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICBjb25zdCBwbHVyYWxpemVBcmd1bWVudHMgPSBudW1BcmdzID0+IG51bUFyZ3MgPT0gMSA/IFwiYXJndW1lbnRcIiA6IFwiYXJndW1lbnRzXCI7XG5cbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBhIHdyYXBwZXIgZnVuY3Rpb24gZm9yIGEgbWV0aG9kIHdpdGggdGhlIGdpdmVuIG5hbWUgYW5kIG1ldGFkYXRhLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICAgKiAgICAgICAgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB3aGljaCBpcyBiZWluZyB3cmFwcGVkLlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IG1ldGFkYXRhXG4gICAgICAgKiAgICAgICAgTWV0YWRhdGEgYWJvdXQgdGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLlxuICAgICAgICogQHBhcmFtIHtpbnRlZ2VyfSBtZXRhZGF0YS5taW5BcmdzXG4gICAgICAgKiAgICAgICAgVGhlIG1pbmltdW0gbnVtYmVyIG9mIGFyZ3VtZW50cyB3aGljaCBtdXN0IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggZmV3ZXIgdGhhbiB0aGlzIG51bWJlciBvZiBhcmd1bWVudHMsIHRoZVxuICAgICAgICogICAgICAgIHdyYXBwZXIgd2lsbCByYWlzZSBhbiBleGNlcHRpb24uXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1heEFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWF4aW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG1heSBiZSBwYXNzZWQgdG8gdGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24uIElmIGNhbGxlZCB3aXRoIG1vcmUgdGhhbiB0aGlzIG51bWJlciBvZiBhcmd1bWVudHMsIHRoZVxuICAgICAgICogICAgICAgIHdyYXBwZXIgd2lsbCByYWlzZSBhbiBleGNlcHRpb24uXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnXG4gICAgICAgKiAgICAgICAgV2hldGhlciBvciBub3QgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCBvbmx5IHRoZSBmaXJzdFxuICAgICAgICogICAgICAgIGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjaywgYWx0ZXJuYXRpdmVseSBhbiBhcnJheSBvZiBhbGwgdGhlXG4gICAgICAgKiAgICAgICAgY2FsbGJhY2sgYXJndW1lbnRzIGlzIHJlc29sdmVkLiBCeSBkZWZhdWx0LCBpZiB0aGUgY2FsbGJhY2tcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiBpcyBpbnZva2VkIHdpdGggb25seSBhIHNpbmdsZSBhcmd1bWVudCwgdGhhdCB3aWxsIGJlXG4gICAgICAgKiAgICAgICAgcmVzb2x2ZWQgdG8gdGhlIHByb21pc2UsIHdoaWxlIGFsbCBhcmd1bWVudHMgd2lsbCBiZSByZXNvbHZlZCBhc1xuICAgICAgICogICAgICAgIGFuIGFycmF5IGlmIG11bHRpcGxlIGFyZSBnaXZlbi5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7ZnVuY3Rpb24ob2JqZWN0LCAuLi4qKX1cbiAgICAgICAqICAgICAgIFRoZSBnZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbi5cbiAgICAgICAqL1xuICAgICAgY29uc3Qgd3JhcEFzeW5jRnVuY3Rpb24gPSAobmFtZSwgbWV0YWRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFzeW5jRnVuY3Rpb25XcmFwcGVyKHRhcmdldCwgLi4uYXJncykge1xuICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbGVhc3QgJHttZXRhZGF0YS5taW5BcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5taW5BcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbW9zdCAke21ldGFkYXRhLm1heEFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1heEFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjaykge1xuICAgICAgICAgICAgICAvLyBUaGlzIEFQSSBtZXRob2QgaGFzIGN1cnJlbnRseSBubyBjYWxsYmFjayBvbiBDaHJvbWUsIGJ1dCBpdCByZXR1cm4gYSBwcm9taXNlIG9uIEZpcmVmb3gsXG4gICAgICAgICAgICAgIC8vIGFuZCBzbyB0aGUgcG9seWZpbGwgd2lsbCB0cnkgdG8gY2FsbCBpdCB3aXRoIGEgY2FsbGJhY2sgZmlyc3QsIGFuZCBpdCB3aWxsIGZhbGxiYWNrXG4gICAgICAgICAgICAgIC8vIHRvIG5vdCBwYXNzaW5nIHRoZSBjYWxsYmFjayBpZiB0aGUgZmlyc3QgY2FsbCBmYWlscy5cbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncywgbWFrZUNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgICB9LCBtZXRhZGF0YSkpO1xuICAgICAgICAgICAgICB9IGNhdGNoIChjYkVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGAke25hbWV9IEFQSSBtZXRob2QgZG9lc24ndCBzZWVtIHRvIHN1cHBvcnQgdGhlIGNhbGxiYWNrIHBhcmFtZXRlciwgYCArIFwiZmFsbGluZyBiYWNrIHRvIGNhbGwgaXQgd2l0aG91dCBhIGNhbGxiYWNrOiBcIiwgY2JFcnJvcik7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MpO1xuXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBBUEkgbWV0aG9kIG1ldGFkYXRhLCBzbyB0aGF0IHRoZSBuZXh0IEFQSSBjYWxscyB3aWxsIG5vdCB0cnkgdG9cbiAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIHVuc3VwcG9ydGVkIGNhbGxiYWNrIGFueW1vcmUuXG4gICAgICAgICAgICAgICAgbWV0YWRhdGEuZmFsbGJhY2tUb05vQ2FsbGJhY2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5ub0NhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0YWRhdGEubm9DYWxsYmFjaykge1xuICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICAgIH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIFdyYXBzIGFuIGV4aXN0aW5nIG1ldGhvZCBvZiB0aGUgdGFyZ2V0IG9iamVjdCwgc28gdGhhdCBjYWxscyB0byBpdCBhcmVcbiAgICAgICAqIGludGVyY2VwdGVkIGJ5IHRoZSBnaXZlbiB3cmFwcGVyIGZ1bmN0aW9uLiBUaGUgd3JhcHBlciBmdW5jdGlvbiByZWNlaXZlcyxcbiAgICAgICAqIGFzIGl0cyBmaXJzdCBhcmd1bWVudCwgdGhlIG9yaWdpbmFsIGB0YXJnZXRgIG9iamVjdCwgZm9sbG93ZWQgYnkgZWFjaCBvZlxuICAgICAgICogdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0XG4gICAgICAgKiAgICAgICAgVGhlIG9yaWdpbmFsIHRhcmdldCBvYmplY3QgdGhhdCB0aGUgd3JhcHBlZCBtZXRob2QgYmVsb25ncyB0by5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG1ldGhvZFxuICAgICAgICogICAgICAgIFRoZSBtZXRob2QgYmVpbmcgd3JhcHBlZC4gVGhpcyBpcyB1c2VkIGFzIHRoZSB0YXJnZXQgb2YgdGhlIFByb3h5XG4gICAgICAgKiAgICAgICAgb2JqZWN0IHdoaWNoIGlzIGNyZWF0ZWQgdG8gd3JhcCB0aGUgbWV0aG9kLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gd3JhcHBlclxuICAgICAgICogICAgICAgIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHdoaWNoIGlzIGNhbGxlZCBpbiBwbGFjZSBvZiBhIGRpcmVjdCBpbnZvY2F0aW9uXG4gICAgICAgKiAgICAgICAgb2YgdGhlIHdyYXBwZWQgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtQcm94eTxmdW5jdGlvbj59XG4gICAgICAgKiAgICAgICAgQSBQcm94eSBvYmplY3QgZm9yIHRoZSBnaXZlbiBtZXRob2QsIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIHdyYXBwZXJcbiAgICAgICAqICAgICAgICBtZXRob2QgaW4gaXRzIHBsYWNlLlxuICAgICAgICovXG4gICAgICBjb25zdCB3cmFwTWV0aG9kID0gKHRhcmdldCwgbWV0aG9kLCB3cmFwcGVyKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkobWV0aG9kLCB7XG4gICAgICAgICAgYXBwbHkodGFyZ2V0TWV0aG9kLCB0aGlzT2JqLCBhcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gd3JhcHBlci5jYWxsKHRoaXNPYmosIHRhcmdldCwgLi4uYXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBsZXQgaGFzT3duUHJvcGVydHkgPSBGdW5jdGlvbi5jYWxsLmJpbmQoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG5cbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gb2JqZWN0IGluIGEgUHJveHkgd2hpY2ggaW50ZXJjZXB0cyBhbmQgd3JhcHMgY2VydGFpbiBtZXRob2RzXG4gICAgICAgKiBiYXNlZCBvbiB0aGUgZ2l2ZW4gYHdyYXBwZXJzYCBhbmQgYG1ldGFkYXRhYCBvYmplY3RzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgdGFyZ2V0IG9iamVjdCB0byB3cmFwLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbd3JhcHBlcnMgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBzcGVjaWFsIGNhc2VzLiBBbnlcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiBwcmVzZW50IGluIHRoaXMgb2JqZWN0IHRyZWUgaXMgY2FsbGVkIGluIHBsYWNlIG9mIHRoZVxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiB0aGUgc2FtZSBsb2NhdGlvbiBpbiB0aGUgYHRhcmdldGAgb2JqZWN0IHRyZWUuIFRoZXNlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciBtZXRob2RzIGFyZSBpbnZva2VkIGFzIGRlc2NyaWJlZCBpbiB7QHNlZSB3cmFwTWV0aG9kfS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gW21ldGFkYXRhID0ge31dXG4gICAgICAgKiAgICAgICAgQW4gb2JqZWN0IHRyZWUgY29udGFpbmluZyBtZXRhZGF0YSB1c2VkIHRvIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVcbiAgICAgICAqICAgICAgICBQcm9taXNlLWJhc2VkIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBhc3luY2hyb25vdXMuIEFueSBmdW5jdGlvbiBpblxuICAgICAgICogICAgICAgIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZSB3aGljaCBoYXMgYSBjb3JyZXNwb25kaW5nIG1ldGFkYXRhIG9iamVjdFxuICAgICAgICogICAgICAgIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgbWV0YWRhdGFgIHRyZWUgaXMgcmVwbGFjZWQgd2l0aCBhblxuICAgICAgICogICAgICAgIGF1dG9tYXRpY2FsbHktZ2VuZXJhdGVkIHdyYXBwZXIgZnVuY3Rpb24sIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICogICAgICAgIHtAc2VlIHdyYXBBc3luY0Z1bmN0aW9ufVxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtQcm94eTxvYmplY3Q+fVxuICAgICAgICovXG4gICAgICBjb25zdCB3cmFwT2JqZWN0ID0gKHRhcmdldCwgd3JhcHBlcnMgPSB7fSwgbWV0YWRhdGEgPSB7fSkgPT4ge1xuICAgICAgICBsZXQgY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBsZXQgaGFuZGxlcnMgPSB7XG4gICAgICAgICAgaGFzKHByb3h5VGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcCBpbiB0YXJnZXQgfHwgcHJvcCBpbiBjYWNoZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldChwcm94eVRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wIGluIGNhY2hlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWNoZVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKHByb3AgaW4gdGFyZ2V0KSkge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHZhbHVlID0gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBtZXRob2Qgb24gdGhlIHVuZGVybHlpbmcgb2JqZWN0LiBDaGVjayBpZiB3ZSBuZWVkIHRvIGRvXG4gICAgICAgICAgICAgIC8vIGFueSB3cmFwcGluZy5cblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHdyYXBwZXJzW3Byb3BdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIGEgc3BlY2lhbC1jYXNlIHdyYXBwZXIgZm9yIHRoaXMgbWV0aG9kLlxuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcnNbcHJvcF0pO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gYXN5bmMgbWV0aG9kIHRoYXQgd2UgaGF2ZSBtZXRhZGF0YSBmb3IuIENyZWF0ZSBhXG4gICAgICAgICAgICAgICAgLy8gUHJvbWlzZSB3cmFwcGVyIGZvciBpdC5cbiAgICAgICAgICAgICAgICBsZXQgd3JhcHBlciA9IHdyYXBBc3luY0Z1bmN0aW9uKHByb3AsIG1ldGFkYXRhW3Byb3BdKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBNZXRob2QodGFyZ2V0LCB0YXJnZXRbcHJvcF0sIHdyYXBwZXIpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBtZXRob2QgdGhhdCB3ZSBkb24ndCBrbm93IG9yIGNhcmUgYWJvdXQuIFJldHVybiB0aGVcbiAgICAgICAgICAgICAgICAvLyBvcmlnaW5hbCBtZXRob2QsIGJvdW5kIHRvIHRoZSB1bmRlcmx5aW5nIG9iamVjdC5cbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLmJpbmQodGFyZ2V0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgKGhhc093blByb3BlcnR5KHdyYXBwZXJzLCBwcm9wKSB8fCBoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgcHJvcCkpKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gb2JqZWN0IHRoYXQgd2UgbmVlZCB0byBkbyBzb21lIHdyYXBwaW5nIGZvciB0aGUgY2hpbGRyZW5cbiAgICAgICAgICAgICAgLy8gb2YuIENyZWF0ZSBhIHN1Yi1vYmplY3Qgd3JhcHBlciBmb3IgaXQgd2l0aCB0aGUgYXBwcm9wcmlhdGUgY2hpbGRcbiAgICAgICAgICAgICAgLy8gbWV0YWRhdGEuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW3Byb3BdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIFwiKlwiKSkge1xuICAgICAgICAgICAgICAvLyBXcmFwIGFsbCBwcm9wZXJ0aWVzIGluICogbmFtZXNwYWNlLlxuICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBPYmplY3QodmFsdWUsIHdyYXBwZXJzW3Byb3BdLCBtZXRhZGF0YVtcIipcIl0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gV2UgZG9uJ3QgbmVlZCB0byBkbyBhbnkgd3JhcHBpbmcgZm9yIHRoaXMgcHJvcGVydHksXG4gICAgICAgICAgICAgIC8vIHNvIGp1c3QgZm9yd2FyZCBhbGwgYWNjZXNzIHRvIHRoZSB1bmRlcmx5aW5nIG9iamVjdC5cbiAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FjaGVbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldChwcm94eVRhcmdldCwgcHJvcCwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICBpZiAocHJvcCBpbiBjYWNoZSkge1xuICAgICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlZmluZVByb3BlcnR5KHByb3h5VGFyZ2V0LCBwcm9wLCBkZXNjKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShjYWNoZSwgcHJvcCwgZGVzYyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZWxldGVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkoY2FjaGUsIHByb3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBQZXIgY29udHJhY3Qgb2YgdGhlIFByb3h5IEFQSSwgdGhlIFwiZ2V0XCIgcHJveHkgaGFuZGxlciBtdXN0IHJldHVybiB0aGVcbiAgICAgICAgLy8gb3JpZ2luYWwgdmFsdWUgb2YgdGhlIHRhcmdldCBpZiB0aGF0IHZhbHVlIGlzIGRlY2xhcmVkIHJlYWQtb25seSBhbmRcbiAgICAgICAgLy8gbm9uLWNvbmZpZ3VyYWJsZS4gRm9yIHRoaXMgcmVhc29uLCB3ZSBjcmVhdGUgYW4gb2JqZWN0IHdpdGggdGhlXG4gICAgICAgIC8vIHByb3RvdHlwZSBzZXQgdG8gYHRhcmdldGAgaW5zdGVhZCBvZiB1c2luZyBgdGFyZ2V0YCBkaXJlY3RseS5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdlIGNhbm5vdCByZXR1cm4gYSBjdXN0b20gb2JqZWN0IGZvciBBUElzIHRoYXRcbiAgICAgICAgLy8gYXJlIGRlY2xhcmVkIHJlYWQtb25seSBhbmQgbm9uLWNvbmZpZ3VyYWJsZSwgc3VjaCBhcyBgY2hyb21lLmRldnRvb2xzYC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlIHByb3h5IGhhbmRsZXJzIHRoZW1zZWx2ZXMgd2lsbCBzdGlsbCB1c2UgdGhlIG9yaWdpbmFsIGB0YXJnZXRgXG4gICAgICAgIC8vIGluc3RlYWQgb2YgdGhlIGBwcm94eVRhcmdldGAsIHNvIHRoYXQgdGhlIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgYXJlXG4gICAgICAgIC8vIGRlcmVmZXJlbmNlZCB2aWEgdGhlIG9yaWdpbmFsIHRhcmdldHMuXG4gICAgICAgIGxldCBwcm94eVRhcmdldCA9IE9iamVjdC5jcmVhdGUodGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShwcm94eVRhcmdldCwgaGFuZGxlcnMpO1xuICAgICAgfTtcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgc2V0IG9mIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBhbiBldmVudCBvYmplY3QsIHdoaWNoIGhhbmRsZXNcbiAgICAgICAqIHdyYXBwaW5nIG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0aGF0IHRob3NlIG1lc3NhZ2VzIGFyZSBwYXNzZWQuXG4gICAgICAgKlxuICAgICAgICogQSBzaW5nbGUgd3JhcHBlciBpcyBjcmVhdGVkIGZvciBlYWNoIGxpc3RlbmVyIGZ1bmN0aW9uLCBhbmQgc3RvcmVkIGluIGFcbiAgICAgICAqIG1hcC4gU3Vic2VxdWVudCBjYWxscyB0byBgYWRkTGlzdGVuZXJgLCBgaGFzTGlzdGVuZXJgLCBvciBgcmVtb3ZlTGlzdGVuZXJgXG4gICAgICAgKiByZXRyaWV2ZSB0aGUgb3JpZ2luYWwgd3JhcHBlciwgc28gdGhhdCAgYXR0ZW1wdHMgdG8gcmVtb3ZlIGFcbiAgICAgICAqIHByZXZpb3VzbHktYWRkZWQgbGlzdGVuZXIgd29yayBhcyBleHBlY3RlZC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0RlZmF1bHRXZWFrTWFwPGZ1bmN0aW9uLCBmdW5jdGlvbj59IHdyYXBwZXJNYXBcbiAgICAgICAqICAgICAgICBBIERlZmF1bHRXZWFrTWFwIG9iamVjdCB3aGljaCB3aWxsIGNyZWF0ZSB0aGUgYXBwcm9wcmlhdGUgd3JhcHBlclxuICAgICAgICogICAgICAgIGZvciBhIGdpdmVuIGxpc3RlbmVyIGZ1bmN0aW9uIHdoZW4gb25lIGRvZXMgbm90IGV4aXN0LCBhbmQgcmV0cmlldmVcbiAgICAgICAqICAgICAgICBhbiBleGlzdGluZyBvbmUgd2hlbiBpdCBkb2VzLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBFdmVudCA9IHdyYXBwZXJNYXAgPT4gKHtcbiAgICAgICAgYWRkTGlzdGVuZXIodGFyZ2V0LCBsaXN0ZW5lciwgLi4uYXJncykge1xuICAgICAgICAgIHRhcmdldC5hZGRMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lciksIC4uLmFyZ3MpO1xuICAgICAgICB9LFxuICAgICAgICBoYXNMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5oYXNMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lcikpO1xuICAgICAgICB9LFxuICAgICAgICByZW1vdmVMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyKSB7XG4gICAgICAgICAgdGFyZ2V0LnJlbW92ZUxpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3Qgb25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycyA9IG5ldyBEZWZhdWx0V2Vha01hcChsaXN0ZW5lciA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXcmFwcyBhbiBvblJlcXVlc3RGaW5pc2hlZCBsaXN0ZW5lciBmdW5jdGlvbiBzbyB0aGF0IGl0IHdpbGwgcmV0dXJuIGFcbiAgICAgICAgICogYGdldENvbnRlbnQoKWAgcHJvcGVydHkgd2hpY2ggcmV0dXJucyBhIGBQcm9taXNlYCByYXRoZXIgdGhhbiB1c2luZyBhXG4gICAgICAgICAqIGNhbGxiYWNrIEFQSS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlcVxuICAgICAgICAgKiAgICAgICAgVGhlIEhBUiBlbnRyeSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBuZXR3b3JrIHJlcXVlc3QuXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gb25SZXF1ZXN0RmluaXNoZWQocmVxKSB7XG4gICAgICAgICAgY29uc3Qgd3JhcHBlZFJlcSA9IHdyYXBPYmplY3QocmVxLCB7fSAvKiB3cmFwcGVycyAqLywge1xuICAgICAgICAgICAgZ2V0Q29udGVudDoge1xuICAgICAgICAgICAgICBtaW5BcmdzOiAwLFxuICAgICAgICAgICAgICBtYXhBcmdzOiAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGlzdGVuZXIod3JhcHBlZFJlcSk7XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG9uTWVzc2FnZVdyYXBwZXJzID0gbmV3IERlZmF1bHRXZWFrTWFwKGxpc3RlbmVyID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXBzIGEgbWVzc2FnZSBsaXN0ZW5lciBmdW5jdGlvbiBzbyB0aGF0IGl0IG1heSBzZW5kIHJlc3BvbnNlcyBiYXNlZCBvblxuICAgICAgICAgKiBpdHMgcmV0dXJuIHZhbHVlLCByYXRoZXIgdGhhbiBieSByZXR1cm5pbmcgYSBzZW50aW5lbCB2YWx1ZSBhbmQgY2FsbGluZyBhXG4gICAgICAgICAqIGNhbGxiYWNrLiBJZiB0aGUgbGlzdGVuZXIgZnVuY3Rpb24gcmV0dXJucyBhIFByb21pc2UsIHRoZSByZXNwb25zZSBpc1xuICAgICAgICAgKiBzZW50IHdoZW4gdGhlIHByb21pc2UgZWl0aGVyIHJlc29sdmVzIG9yIHJlamVjdHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gbWVzc2FnZVxuICAgICAgICAgKiAgICAgICAgVGhlIG1lc3NhZ2Ugc2VudCBieSB0aGUgb3RoZXIgZW5kIG9mIHRoZSBjaGFubmVsLlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gc2VuZGVyXG4gICAgICAgICAqICAgICAgICBEZXRhaWxzIGFib3V0IHRoZSBzZW5kZXIgb2YgdGhlIG1lc3NhZ2UuXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oKil9IHNlbmRSZXNwb25zZVxuICAgICAgICAgKiAgICAgICAgQSBjYWxsYmFjayB3aGljaCwgd2hlbiBjYWxsZWQgd2l0aCBhbiBhcmJpdHJhcnkgYXJndW1lbnQsIHNlbmRzXG4gICAgICAgICAqICAgICAgICB0aGF0IHZhbHVlIGFzIGEgcmVzcG9uc2UuXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAgICAgKiAgICAgICAgVHJ1ZSBpZiB0aGUgd3JhcHBlZCBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHdoaWNoIHdpbGwgbGF0ZXJcbiAgICAgICAgICogICAgICAgIHlpZWxkIGEgcmVzcG9uc2UuIEZhbHNlIG90aGVyd2lzZS5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvbk1lc3NhZ2UobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgICBsZXQgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IGZhbHNlO1xuICAgICAgICAgIGxldCB3cmFwcGVkU2VuZFJlc3BvbnNlO1xuICAgICAgICAgIGxldCBzZW5kUmVzcG9uc2VQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB3cmFwcGVkU2VuZFJlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIGRpZENhbGxTZW5kUmVzcG9uc2UgPSB0cnVlO1xuICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0ID0gbGlzdGVuZXIobWVzc2FnZSwgc2VuZGVyLCB3cmFwcGVkU2VuZFJlc3BvbnNlKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGlzUmVzdWx0VGhlbmFibGUgPSByZXN1bHQgIT09IHRydWUgJiYgaXNUaGVuYWJsZShyZXN1bHQpO1xuXG4gICAgICAgICAgLy8gSWYgdGhlIGxpc3RlbmVyIGRpZG4ndCByZXR1cm5lZCB0cnVlIG9yIGEgUHJvbWlzZSwgb3IgY2FsbGVkXG4gICAgICAgICAgLy8gd3JhcHBlZFNlbmRSZXNwb25zZSBzeW5jaHJvbm91c2x5LCB3ZSBjYW4gZXhpdCBlYXJsaWVyXG4gICAgICAgICAgLy8gYmVjYXVzZSB0aGVyZSB3aWxsIGJlIG5vIHJlc3BvbnNlIHNlbnQgZnJvbSB0aGlzIGxpc3RlbmVyLlxuICAgICAgICAgIGlmIChyZXN1bHQgIT09IHRydWUgJiYgIWlzUmVzdWx0VGhlbmFibGUgJiYgIWRpZENhbGxTZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBIHNtYWxsIGhlbHBlciB0byBzZW5kIHRoZSBtZXNzYWdlIGlmIHRoZSBwcm9taXNlIHJlc29sdmVzXG4gICAgICAgICAgLy8gYW5kIGFuIGVycm9yIGlmIHRoZSBwcm9taXNlIHJlamVjdHMgKGEgd3JhcHBlZCBzZW5kTWVzc2FnZSBoYXNcbiAgICAgICAgICAvLyB0byB0cmFuc2xhdGUgdGhlIG1lc3NhZ2UgaW50byBhIHJlc29sdmVkIHByb21pc2Ugb3IgYSByZWplY3RlZFxuICAgICAgICAgIC8vIHByb21pc2UpLlxuICAgICAgICAgIGNvbnN0IHNlbmRQcm9taXNlZFJlc3VsdCA9IHByb21pc2UgPT4ge1xuICAgICAgICAgICAgcHJvbWlzZS50aGVuKG1zZyA9PiB7XG4gICAgICAgICAgICAgIC8vIHNlbmQgdGhlIG1lc3NhZ2UgdmFsdWUuXG4gICAgICAgICAgICAgIHNlbmRSZXNwb25zZShtc2cpO1xuICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAvLyBTZW5kIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgZXJyb3IgaWYgdGhlIHJlamVjdGVkIHZhbHVlXG4gICAgICAgICAgICAgIC8vIGlzIGFuIGluc3RhbmNlIG9mIGVycm9yLCBvciB0aGUgb2JqZWN0IGl0c2VsZiBvdGhlcndpc2UuXG4gICAgICAgICAgICAgIGxldCBtZXNzYWdlO1xuICAgICAgICAgICAgICBpZiAoZXJyb3IgJiYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgfHwgdHlwZW9mIGVycm9yLm1lc3NhZ2UgPT09IFwic3RyaW5nXCIpKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZFwiO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgX19tb3pXZWJFeHRlbnNpb25Qb2x5ZmlsbFJlamVjdF9fOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAvLyBQcmludCBhbiBlcnJvciBvbiB0aGUgY29uc29sZSBpZiB1bmFibGUgdG8gc2VuZCB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2VuZCBvbk1lc3NhZ2UgcmVqZWN0ZWQgcmVwbHlcIiwgZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgcmV0dXJuZWQgYSBQcm9taXNlLCBzZW5kIHRoZSByZXNvbHZlZCB2YWx1ZSBhcyBhXG4gICAgICAgICAgLy8gcmVzdWx0LCBvdGhlcndpc2Ugd2FpdCB0aGUgcHJvbWlzZSByZWxhdGVkIHRvIHRoZSB3cmFwcGVkU2VuZFJlc3BvbnNlXG4gICAgICAgICAgLy8gY2FsbGJhY2sgdG8gcmVzb2x2ZSBhbmQgc2VuZCBpdCBhcyBhIHJlc3BvbnNlLlxuICAgICAgICAgIGlmIChpc1Jlc3VsdFRoZW5hYmxlKSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VuZFByb21pc2VkUmVzdWx0KHNlbmRSZXNwb25zZVByb21pc2UpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIExldCBDaHJvbWUga25vdyB0aGF0IHRoZSBsaXN0ZW5lciBpcyByZXBseWluZy5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgd3JhcHBlZFNlbmRNZXNzYWdlQ2FsbGJhY2sgPSAoe1xuICAgICAgICByZWplY3QsXG4gICAgICAgIHJlc29sdmVcbiAgICAgIH0sIHJlcGx5KSA9PiB7XG4gICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgLy8gRGV0ZWN0IHdoZW4gbm9uZSBvZiB0aGUgbGlzdGVuZXJzIHJlcGxpZWQgdG8gdGhlIHNlbmRNZXNzYWdlIGNhbGwgYW5kIHJlc29sdmVcbiAgICAgICAgICAvLyB0aGUgcHJvbWlzZSB0byB1bmRlZmluZWQgYXMgaW4gRmlyZWZveC5cbiAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvd2ViZXh0ZW5zaW9uLXBvbHlmaWxsL2lzc3Vlcy8xMzBcbiAgICAgICAgICBpZiAoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlID09PSBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UpIHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVwbHkgJiYgcmVwbHkuX19tb3pXZWJFeHRlbnNpb25Qb2x5ZmlsbFJlamVjdF9fKSB7XG4gICAgICAgICAgLy8gQ29udmVydCBiYWNrIHRoZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpbnRvXG4gICAgICAgICAgLy8gYW4gRXJyb3IgaW5zdGFuY2UuXG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihyZXBseS5tZXNzYWdlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXBseSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2UgPSAobmFtZSwgbWV0YWRhdGEsIGFwaU5hbWVzcGFjZU9iaiwgLi4uYXJncykgPT4ge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPCBtZXRhZGF0YS5taW5BcmdzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiBtZXRhZGF0YS5tYXhBcmdzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgY29uc3Qgd3JhcHBlZENiID0gd3JhcHBlZFNlbmRNZXNzYWdlQ2FsbGJhY2suYmluZChudWxsLCB7XG4gICAgICAgICAgICByZXNvbHZlLFxuICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYXJncy5wdXNoKHdyYXBwZWRDYik7XG4gICAgICAgICAgYXBpTmFtZXNwYWNlT2JqLnNlbmRNZXNzYWdlKC4uLmFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBjb25zdCBzdGF0aWNXcmFwcGVycyA9IHtcbiAgICAgICAgZGV2dG9vbHM6IHtcbiAgICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgICBvblJlcXVlc3RGaW5pc2hlZDogd3JhcEV2ZW50KG9uUmVxdWVzdEZpbmlzaGVkV3JhcHBlcnMpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBydW50aW1lOiB7XG4gICAgICAgICAgb25NZXNzYWdlOiB3cmFwRXZlbnQob25NZXNzYWdlV3JhcHBlcnMpLFxuICAgICAgICAgIG9uTWVzc2FnZUV4dGVybmFsOiB3cmFwRXZlbnQob25NZXNzYWdlV3JhcHBlcnMpLFxuICAgICAgICAgIHNlbmRNZXNzYWdlOiB3cmFwcGVkU2VuZE1lc3NhZ2UuYmluZChudWxsLCBcInNlbmRNZXNzYWdlXCIsIHtcbiAgICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgICBtYXhBcmdzOiAzXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgdGFiczoge1xuICAgICAgICAgIHNlbmRNZXNzYWdlOiB3cmFwcGVkU2VuZE1lc3NhZ2UuYmluZChudWxsLCBcInNlbmRNZXNzYWdlXCIsIHtcbiAgICAgICAgICAgIG1pbkFyZ3M6IDIsXG4gICAgICAgICAgICBtYXhBcmdzOiAzXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHNldHRpbmdNZXRhZGF0YSA9IHtcbiAgICAgICAgY2xlYXI6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH0sXG4gICAgICAgIHNldDoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgYXBpTWV0YWRhdGEucHJpdmFjeSA9IHtcbiAgICAgICAgbmV0d29yazoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgc2VydmljZXM6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH0sXG4gICAgICAgIHdlYnNpdGVzOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHdyYXBPYmplY3QoZXh0ZW5zaW9uQVBJcywgc3RhdGljV3JhcHBlcnMsIGFwaU1ldGFkYXRhKTtcbiAgICB9O1xuXG4gICAgLy8gVGhlIGJ1aWxkIHByb2Nlc3MgYWRkcyBhIFVNRCB3cmFwcGVyIGFyb3VuZCB0aGlzIGZpbGUsIHdoaWNoIG1ha2VzIHRoZVxuICAgIC8vIGBtb2R1bGVgIHZhcmlhYmxlIGF2YWlsYWJsZS5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHdyYXBBUElzKGNocm9tZSk7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWxUaGlzLmJyb3dzZXI7XG4gIH1cbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnJvd3Nlci1wb2x5ZmlsbC5qcy5tYXBcbiIsImltcG9ydCBvcmlnaW5hbEJyb3dzZXIgZnJvbSBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiO1xuZXhwb3J0IGNvbnN0IGJyb3dzZXIgPSBvcmlnaW5hbEJyb3dzZXI7XG4iLCJmdW5jdGlvbiBwcmludChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgaWYgKGltcG9ydC5tZXRhLmVudi5NT0RFID09PSBcInByb2R1Y3Rpb25cIikgcmV0dXJuO1xuICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXJncy5zaGlmdCgpO1xuICAgIG1ldGhvZChgW3d4dF0gJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIG1ldGhvZChcIlt3eHRdXCIsIC4uLmFyZ3MpO1xuICB9XG59XG5leHBvcnQgY29uc3QgbG9nZ2VyID0ge1xuICBkZWJ1ZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZGVidWcsIC4uLmFyZ3MpLFxuICBsb2c6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmxvZywgLi4uYXJncyksXG4gIHdhcm46ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLndhcm4sIC4uLmFyZ3MpLFxuICBlcnJvcjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZXJyb3IsIC4uLmFyZ3MpXG59O1xuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuZXhwb3J0IGNsYXNzIFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gIGNvbnN0cnVjdG9yKG5ld1VybCwgb2xkVXJsKSB7XG4gICAgc3VwZXIoV3h0TG9jYXRpb25DaGFuZ2VFdmVudC5FVkVOVF9OQU1FLCB7fSk7XG4gICAgdGhpcy5uZXdVcmwgPSBuZXdVcmw7XG4gICAgdGhpcy5vbGRVcmwgPSBvbGRVcmw7XG4gIH1cbiAgc3RhdGljIEVWRU5UX05BTUUgPSBnZXRVbmlxdWVFdmVudE5hbWUoXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcIik7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0VW5pcXVlRXZlbnROYW1lKGV2ZW50TmFtZSkge1xuICByZXR1cm4gYCR7YnJvd3Nlcj8ucnVudGltZT8uaWR9OiR7aW1wb3J0Lm1ldGEuZW52LkVOVFJZUE9JTlR9OiR7ZXZlbnROYW1lfWA7XG59XG4iLCJpbXBvcnQgeyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50IH0gZnJvbSBcIi4vY3VzdG9tLWV2ZW50cy5tanNcIjtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2NhdGlvbldhdGNoZXIoY3R4KSB7XG4gIGxldCBpbnRlcnZhbDtcbiAgbGV0IG9sZFVybDtcbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBFbnN1cmUgdGhlIGxvY2F0aW9uIHdhdGNoZXIgaXMgYWN0aXZlbHkgbG9va2luZyBmb3IgVVJMIGNoYW5nZXMuIElmIGl0J3MgYWxyZWFkeSB3YXRjaGluZyxcbiAgICAgKiB0aGlzIGlzIGEgbm9vcC5cbiAgICAgKi9cbiAgICBydW4oKSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgIT0gbnVsbCkgcmV0dXJuO1xuICAgICAgb2xkVXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcbiAgICAgIGludGVydmFsID0gY3R4LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgbGV0IG5ld1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG4gICAgICAgIGlmIChuZXdVcmwuaHJlZiAhPT0gb2xkVXJsLmhyZWYpIHtcbiAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgV3h0TG9jYXRpb25DaGFuZ2VFdmVudChuZXdVcmwsIG9sZFVybCkpO1xuICAgICAgICAgIG9sZFVybCA9IG5ld1VybDtcbiAgICAgICAgfVxuICAgICAgfSwgMWUzKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tIFwiLi4vLi4vc2FuZGJveC91dGlscy9sb2dnZXIubWpzXCI7XG5pbXBvcnQgeyBnZXRVbmlxdWVFdmVudE5hbWUgfSBmcm9tIFwiLi9jdXN0b20tZXZlbnRzLm1qc1wiO1xuaW1wb3J0IHsgY3JlYXRlTG9jYXRpb25XYXRjaGVyIH0gZnJvbSBcIi4vbG9jYXRpb24td2F0Y2hlci5tanNcIjtcbmV4cG9ydCBjbGFzcyBDb250ZW50U2NyaXB0Q29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRlbnRTY3JpcHROYW1lLCBvcHRpb25zKSB7XG4gICAgdGhpcy5jb250ZW50U2NyaXB0TmFtZSA9IGNvbnRlbnRTY3JpcHROYW1lO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5hYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgaWYgKHRoaXMuaXNUb3BGcmFtZSkge1xuICAgICAgdGhpcy5saXN0ZW5Gb3JOZXdlclNjcmlwdHMoeyBpZ25vcmVGaXJzdEV2ZW50OiB0cnVlIH0pO1xuICAgICAgdGhpcy5zdG9wT2xkU2NyaXB0cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxpc3RlbkZvck5ld2VyU2NyaXB0cygpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFID0gZ2V0VW5pcXVlRXZlbnROYW1lKFxuICAgIFwid3h0OmNvbnRlbnQtc2NyaXB0LXN0YXJ0ZWRcIlxuICApO1xuICBpc1RvcEZyYW1lID0gd2luZG93LnNlbGYgPT09IHdpbmRvdy50b3A7XG4gIGFib3J0Q29udHJvbGxlcjtcbiAgbG9jYXRpb25XYXRjaGVyID0gY3JlYXRlTG9jYXRpb25XYXRjaGVyKHRoaXMpO1xuICByZWNlaXZlZE1lc3NhZ2VJZHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICBnZXQgc2lnbmFsKCkge1xuICAgIHJldHVybiB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWw7XG4gIH1cbiAgYWJvcnQocmVhc29uKSB7XG4gICAgcmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLmFib3J0KHJlYXNvbik7XG4gIH1cbiAgZ2V0IGlzSW52YWxpZCgpIHtcbiAgICBpZiAoYnJvd3Nlci5ydW50aW1lLmlkID09IG51bGwpIHtcbiAgICAgIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2lnbmFsLmFib3J0ZWQ7XG4gIH1cbiAgZ2V0IGlzVmFsaWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzSW52YWxpZDtcbiAgfVxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgY29udGVudCBzY3JpcHQncyBjb250ZXh0IGlzIGludmFsaWRhdGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoY2IpO1xuICAgKiBjb25zdCByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyID0gY3R4Lm9uSW52YWxpZGF0ZWQoKCkgPT4ge1xuICAgKiAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIoY2IpO1xuICAgKiB9KVxuICAgKiAvLyAuLi5cbiAgICogcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lcigpO1xuICAgKi9cbiAgb25JbnZhbGlkYXRlZChjYikge1xuICAgIHRoaXMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBjYik7XG4gICAgcmV0dXJuICgpID0+IHRoaXMuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBjYik7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybiBhIHByb21pc2UgdGhhdCBuZXZlciByZXNvbHZlcy4gVXNlZnVsIGlmIHlvdSBoYXZlIGFuIGFzeW5jIGZ1bmN0aW9uIHRoYXQgc2hvdWxkbid0IHJ1blxuICAgKiBhZnRlciB0aGUgY29udGV4dCBpcyBleHBpcmVkLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBnZXRWYWx1ZUZyb21TdG9yYWdlID0gYXN5bmMgKCkgPT4ge1xuICAgKiAgIGlmIChjdHguaXNJbnZhbGlkKSByZXR1cm4gY3R4LmJsb2NrKCk7XG4gICAqXG4gICAqICAgLy8gLi4uXG4gICAqIH1cbiAgICovXG4gIGJsb2NrKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgoKSA9PiB7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0SW50ZXJ2YWxgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsIHdoZW4gaW52YWxpZGF0ZWQuXG4gICAqL1xuICBzZXRJbnRlcnZhbChoYW5kbGVyLCB0aW1lb3V0KSB7XG4gICAgY29uc3QgaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG4gICAgfSwgdGltZW91dCk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFySW50ZXJ2YWwoaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0VGltZW91dGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWwgd2hlbiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHNldFRpbWVvdXQoaGFuZGxlciwgdGltZW91dCkge1xuICAgIGNvbnN0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG4gICAgfSwgdGltZW91dCk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFyVGltZW91dChpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSByZXF1ZXN0IHdoZW5cbiAgICogaW52YWxpZGF0ZWQuXG4gICAqL1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spIHtcbiAgICBjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCkgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgfSk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2tgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSByZXF1ZXN0IHdoZW5cbiAgICogaW52YWxpZGF0ZWQuXG4gICAqL1xuICByZXF1ZXN0SWRsZUNhbGxiYWNrKGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgY29uc3QgaWQgPSByZXF1ZXN0SWRsZUNhbGxiYWNrKCguLi5hcmdzKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc2lnbmFsLmFib3J0ZWQpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgIH0sIG9wdGlvbnMpO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxJZGxlQ2FsbGJhY2soaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgYWRkRXZlbnRMaXN0ZW5lcih0YXJnZXQsIHR5cGUsIGhhbmRsZXIsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZSA9PT0gXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcIikge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCkgdGhpcy5sb2NhdGlvbldhdGNoZXIucnVuKCk7XG4gICAgfVxuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyPy4oXG4gICAgICB0eXBlLnN0YXJ0c1dpdGgoXCJ3eHQ6XCIpID8gZ2V0VW5pcXVlRXZlbnROYW1lKHR5cGUpIDogdHlwZSxcbiAgICAgIGhhbmRsZXIsXG4gICAgICB7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHNpZ25hbDogdGhpcy5zaWduYWxcbiAgICAgIH1cbiAgICApO1xuICB9XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQWJvcnQgdGhlIGFib3J0IGNvbnRyb2xsZXIgYW5kIGV4ZWN1dGUgYWxsIGBvbkludmFsaWRhdGVkYCBsaXN0ZW5lcnMuXG4gICAqL1xuICBub3RpZnlJbnZhbGlkYXRlZCgpIHtcbiAgICB0aGlzLmFib3J0KFwiQ29udGVudCBzY3JpcHQgY29udGV4dCBpbnZhbGlkYXRlZFwiKTtcbiAgICBsb2dnZXIuZGVidWcoXG4gICAgICBgQ29udGVudCBzY3JpcHQgXCIke3RoaXMuY29udGVudFNjcmlwdE5hbWV9XCIgY29udGV4dCBpbnZhbGlkYXRlZGBcbiAgICApO1xuICB9XG4gIHN0b3BPbGRTY3JpcHRzKCkge1xuICAgIHdpbmRvdy5wb3N0TWVzc2FnZShcbiAgICAgIHtcbiAgICAgICAgdHlwZTogQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLFxuICAgICAgICBjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZSxcbiAgICAgICAgbWVzc2FnZUlkOiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKVxuICAgICAgfSxcbiAgICAgIFwiKlwiXG4gICAgKTtcbiAgfVxuICB2ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpIHtcbiAgICBjb25zdCBpc1NjcmlwdFN0YXJ0ZWRFdmVudCA9IGV2ZW50LmRhdGE/LnR5cGUgPT09IENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRTtcbiAgICBjb25zdCBpc1NhbWVDb250ZW50U2NyaXB0ID0gZXZlbnQuZGF0YT8uY29udGVudFNjcmlwdE5hbWUgPT09IHRoaXMuY29udGVudFNjcmlwdE5hbWU7XG4gICAgY29uc3QgaXNOb3REdXBsaWNhdGUgPSAhdGhpcy5yZWNlaXZlZE1lc3NhZ2VJZHMuaGFzKGV2ZW50LmRhdGE/Lm1lc3NhZ2VJZCk7XG4gICAgcmV0dXJuIGlzU2NyaXB0U3RhcnRlZEV2ZW50ICYmIGlzU2FtZUNvbnRlbnRTY3JpcHQgJiYgaXNOb3REdXBsaWNhdGU7XG4gIH1cbiAgbGlzdGVuRm9yTmV3ZXJTY3JpcHRzKG9wdGlvbnMpIHtcbiAgICBsZXQgaXNGaXJzdCA9IHRydWU7XG4gICAgY29uc3QgY2IgPSAoZXZlbnQpID0+IHtcbiAgICAgIGlmICh0aGlzLnZlcmlmeVNjcmlwdFN0YXJ0ZWRFdmVudChldmVudCkpIHtcbiAgICAgICAgdGhpcy5yZWNlaXZlZE1lc3NhZ2VJZHMuYWRkKGV2ZW50LmRhdGEubWVzc2FnZUlkKTtcbiAgICAgICAgY29uc3Qgd2FzRmlyc3QgPSBpc0ZpcnN0O1xuICAgICAgICBpc0ZpcnN0ID0gZmFsc2U7XG4gICAgICAgIGlmICh3YXNGaXJzdCAmJiBvcHRpb25zPy5pZ25vcmVGaXJzdEV2ZW50KSByZXR1cm47XG4gICAgICAgIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGNiKTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gcmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgY2IpKTtcbiAgfVxufVxuIiwiY29uc3QgbnVsbEtleSA9IFN5bWJvbCgnbnVsbCcpOyAvLyBgb2JqZWN0SGFzaGVzYCBrZXkgZm9yIG51bGxcblxubGV0IGtleUNvdW50ZXIgPSAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYW55S2V5c01hcCBleHRlbmRzIE1hcCB7XG5cdGNvbnN0cnVjdG9yKC4uLmFyZ3VtZW50c18pIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fb2JqZWN0SGFzaGVzID0gbmV3IFdlYWtNYXAoKTtcblx0XHR0aGlzLl9zeW1ib2xIYXNoZXMgPSBuZXcgTWFwKCk7IC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L2VjbWEyNjIvaXNzdWVzLzExOTRcblx0XHR0aGlzLl9wdWJsaWNLZXlzID0gbmV3IE1hcCgpO1xuXG5cdFx0Y29uc3QgW3BhaXJzXSA9IGFyZ3VtZW50c187IC8vIE1hcCBjb21wYXRcblx0XHRpZiAocGFpcnMgPT09IG51bGwgfHwgcGFpcnMgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlb2YgcGFpcnNbU3ltYm9sLml0ZXJhdG9yXSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcih0eXBlb2YgcGFpcnMgKyAnIGlzIG5vdCBpdGVyYWJsZSAoY2Fubm90IHJlYWQgcHJvcGVydHkgU3ltYm9sKFN5bWJvbC5pdGVyYXRvcikpJyk7XG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCBba2V5cywgdmFsdWVdIG9mIHBhaXJzKSB7XG5cdFx0XHR0aGlzLnNldChrZXlzLCB2YWx1ZSk7XG5cdFx0fVxuXHR9XG5cblx0X2dldFB1YmxpY0tleXMoa2V5cywgY3JlYXRlID0gZmFsc2UpIHtcblx0XHRpZiAoIUFycmF5LmlzQXJyYXkoa2V5cykpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBrZXlzIHBhcmFtZXRlciBtdXN0IGJlIGFuIGFycmF5Jyk7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcHJpdmF0ZUtleSA9IHRoaXMuX2dldFByaXZhdGVLZXkoa2V5cywgY3JlYXRlKTtcblxuXHRcdGxldCBwdWJsaWNLZXk7XG5cdFx0aWYgKHByaXZhdGVLZXkgJiYgdGhpcy5fcHVibGljS2V5cy5oYXMocHJpdmF0ZUtleSkpIHtcblx0XHRcdHB1YmxpY0tleSA9IHRoaXMuX3B1YmxpY0tleXMuZ2V0KHByaXZhdGVLZXkpO1xuXHRcdH0gZWxzZSBpZiAoY3JlYXRlKSB7XG5cdFx0XHRwdWJsaWNLZXkgPSBbLi4ua2V5c107IC8vIFJlZ2VuZXJhdGUga2V5cyBhcnJheSB0byBhdm9pZCBleHRlcm5hbCBpbnRlcmFjdGlvblxuXHRcdFx0dGhpcy5fcHVibGljS2V5cy5zZXQocHJpdmF0ZUtleSwgcHVibGljS2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge3ByaXZhdGVLZXksIHB1YmxpY0tleX07XG5cdH1cblxuXHRfZ2V0UHJpdmF0ZUtleShrZXlzLCBjcmVhdGUgPSBmYWxzZSkge1xuXHRcdGNvbnN0IHByaXZhdGVLZXlzID0gW107XG5cdFx0Zm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuXHRcdFx0Y29uc3Qga2V5VG9QYXNzID0ga2V5ID09PSBudWxsID8gbnVsbEtleSA6IGtleTtcblxuXHRcdFx0bGV0IGhhc2hlcztcblx0XHRcdGlmICh0eXBlb2Yga2V5VG9QYXNzID09PSAnb2JqZWN0JyB8fCB0eXBlb2Yga2V5VG9QYXNzID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdGhhc2hlcyA9ICdfb2JqZWN0SGFzaGVzJztcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGtleVRvUGFzcyA9PT0gJ3N5bWJvbCcpIHtcblx0XHRcdFx0aGFzaGVzID0gJ19zeW1ib2xIYXNoZXMnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aGFzaGVzID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghaGFzaGVzKSB7XG5cdFx0XHRcdHByaXZhdGVLZXlzLnB1c2goa2V5VG9QYXNzKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpc1toYXNoZXNdLmhhcyhrZXlUb1Bhc3MpKSB7XG5cdFx0XHRcdHByaXZhdGVLZXlzLnB1c2godGhpc1toYXNoZXNdLmdldChrZXlUb1Bhc3MpKTtcblx0XHRcdH0gZWxzZSBpZiAoY3JlYXRlKSB7XG5cdFx0XHRcdGNvbnN0IHByaXZhdGVLZXkgPSBgQEBta20tcmVmLSR7a2V5Q291bnRlcisrfUBAYDtcblx0XHRcdFx0dGhpc1toYXNoZXNdLnNldChrZXlUb1Bhc3MsIHByaXZhdGVLZXkpO1xuXHRcdFx0XHRwcml2YXRlS2V5cy5wdXNoKHByaXZhdGVLZXkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeShwcml2YXRlS2V5cyk7XG5cdH1cblxuXHRzZXQoa2V5cywgdmFsdWUpIHtcblx0XHRjb25zdCB7cHVibGljS2V5fSA9IHRoaXMuX2dldFB1YmxpY0tleXMoa2V5cywgdHJ1ZSk7XG5cdFx0cmV0dXJuIHN1cGVyLnNldChwdWJsaWNLZXksIHZhbHVlKTtcblx0fVxuXG5cdGdldChrZXlzKSB7XG5cdFx0Y29uc3Qge3B1YmxpY0tleX0gPSB0aGlzLl9nZXRQdWJsaWNLZXlzKGtleXMpO1xuXHRcdHJldHVybiBzdXBlci5nZXQocHVibGljS2V5KTtcblx0fVxuXG5cdGhhcyhrZXlzKSB7XG5cdFx0Y29uc3Qge3B1YmxpY0tleX0gPSB0aGlzLl9nZXRQdWJsaWNLZXlzKGtleXMpO1xuXHRcdHJldHVybiBzdXBlci5oYXMocHVibGljS2V5KTtcblx0fVxuXG5cdGRlbGV0ZShrZXlzKSB7XG5cdFx0Y29uc3Qge3B1YmxpY0tleSwgcHJpdmF0ZUtleX0gPSB0aGlzLl9nZXRQdWJsaWNLZXlzKGtleXMpO1xuXHRcdHJldHVybiBCb29sZWFuKHB1YmxpY0tleSAmJiBzdXBlci5kZWxldGUocHVibGljS2V5KSAmJiB0aGlzLl9wdWJsaWNLZXlzLmRlbGV0ZShwcml2YXRlS2V5KSk7XG5cdH1cblxuXHRjbGVhcigpIHtcblx0XHRzdXBlci5jbGVhcigpO1xuXHRcdHRoaXMuX3N5bWJvbEhhc2hlcy5jbGVhcigpO1xuXHRcdHRoaXMuX3B1YmxpY0tleXMuY2xlYXIoKTtcblx0fVxuXG5cdGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcblx0XHRyZXR1cm4gJ01hbnlLZXlzTWFwJztcblx0fVxuXG5cdGdldCBzaXplKCkge1xuXHRcdHJldHVybiBzdXBlci5zaXplO1xuXHR9XG59XG4iLCJpbXBvcnQgTWFueUtleXNNYXAgZnJvbSAnbWFueS1rZXlzLW1hcCc7XG5pbXBvcnQgeyBkZWZ1IH0gZnJvbSAnZGVmdSc7XG5pbXBvcnQgeyBpc0V4aXN0IH0gZnJvbSAnLi9kZXRlY3RvcnMubWpzJztcblxuY29uc3QgZ2V0RGVmYXVsdE9wdGlvbnMgPSAoKSA9PiAoe1xuICB0YXJnZXQ6IGdsb2JhbFRoaXMuZG9jdW1lbnQsXG4gIHVuaWZ5UHJvY2VzczogdHJ1ZSxcbiAgZGV0ZWN0b3I6IGlzRXhpc3QsXG4gIG9ic2VydmVDb25maWdzOiB7XG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIHN1YnRyZWU6IHRydWUsXG4gICAgYXR0cmlidXRlczogdHJ1ZVxuICB9LFxuICBzaWduYWw6IHZvaWQgMCxcbiAgY3VzdG9tTWF0Y2hlcjogdm9pZCAwXG59KTtcbmNvbnN0IG1lcmdlT3B0aW9ucyA9ICh1c2VyU2lkZU9wdGlvbnMsIGRlZmF1bHRPcHRpb25zKSA9PiB7XG4gIHJldHVybiBkZWZ1KHVzZXJTaWRlT3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpO1xufTtcblxuY29uc3QgdW5pZnlDYWNoZSA9IG5ldyBNYW55S2V5c01hcCgpO1xuZnVuY3Rpb24gY3JlYXRlV2FpdEVsZW1lbnQoaW5zdGFuY2VPcHRpb25zKSB7XG4gIGNvbnN0IHsgZGVmYXVsdE9wdGlvbnMgfSA9IGluc3RhbmNlT3B0aW9ucztcbiAgcmV0dXJuIChzZWxlY3Rvciwgb3B0aW9ucykgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHRhcmdldCxcbiAgICAgIHVuaWZ5UHJvY2VzcyxcbiAgICAgIG9ic2VydmVDb25maWdzLFxuICAgICAgZGV0ZWN0b3IsXG4gICAgICBzaWduYWwsXG4gICAgICBjdXN0b21NYXRjaGVyXG4gICAgfSA9IG1lcmdlT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0T3B0aW9ucyk7XG4gICAgY29uc3QgdW5pZnlQcm9taXNlS2V5ID0gW1xuICAgICAgc2VsZWN0b3IsXG4gICAgICB0YXJnZXQsXG4gICAgICB1bmlmeVByb2Nlc3MsXG4gICAgICBvYnNlcnZlQ29uZmlncyxcbiAgICAgIGRldGVjdG9yLFxuICAgICAgc2lnbmFsLFxuICAgICAgY3VzdG9tTWF0Y2hlclxuICAgIF07XG4gICAgY29uc3QgY2FjaGVkUHJvbWlzZSA9IHVuaWZ5Q2FjaGUuZ2V0KHVuaWZ5UHJvbWlzZUtleSk7XG4gICAgaWYgKHVuaWZ5UHJvY2VzcyAmJiBjYWNoZWRQcm9taXNlKSB7XG4gICAgICByZXR1cm4gY2FjaGVkUHJvbWlzZTtcbiAgICB9XG4gICAgY29uc3QgZGV0ZWN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKFxuICAgICAgLy8gYmlvbWUtaWdub3JlIGxpbnQvc3VzcGljaW91cy9ub0FzeW5jUHJvbWlzZUV4ZWN1dG9yOiBhdm9pZCBuZXN0aW5nIHByb21pc2VcbiAgICAgIGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKHNpZ25hbD8uYWJvcnRlZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3Qoc2lnbmFsLnJlYXNvbik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihcbiAgICAgICAgICBhc3luYyAobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IF8gb2YgbXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgIGlmIChzaWduYWw/LmFib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc3QgZGV0ZWN0UmVzdWx0MiA9IGF3YWl0IGRldGVjdEVsZW1lbnQoe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICAgICAgICBkZXRlY3RvcixcbiAgICAgICAgICAgICAgICBjdXN0b21NYXRjaGVyXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAoZGV0ZWN0UmVzdWx0Mi5pc0RldGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGV0ZWN0UmVzdWx0Mi5yZXN1bHQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBzaWduYWw/LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgXCJhYm9ydFwiLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIHJldHVybiByZWplY3Qoc2lnbmFsLnJlYXNvbik7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IG9uY2U6IHRydWUgfVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBkZXRlY3RSZXN1bHQgPSBhd2FpdCBkZXRlY3RFbGVtZW50KHtcbiAgICAgICAgICBzZWxlY3RvcixcbiAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgZGV0ZWN0b3IsXG4gICAgICAgICAgY3VzdG9tTWF0Y2hlclxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGRldGVjdFJlc3VsdC5pc0RldGVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoZGV0ZWN0UmVzdWx0LnJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXQsIG9ic2VydmVDb25maWdzKTtcbiAgICAgIH1cbiAgICApLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgdW5pZnlDYWNoZS5kZWxldGUodW5pZnlQcm9taXNlS2V5KTtcbiAgICB9KTtcbiAgICB1bmlmeUNhY2hlLnNldCh1bmlmeVByb21pc2VLZXksIGRldGVjdFByb21pc2UpO1xuICAgIHJldHVybiBkZXRlY3RQcm9taXNlO1xuICB9O1xufVxuYXN5bmMgZnVuY3Rpb24gZGV0ZWN0RWxlbWVudCh7XG4gIHRhcmdldCxcbiAgc2VsZWN0b3IsXG4gIGRldGVjdG9yLFxuICBjdXN0b21NYXRjaGVyXG59KSB7XG4gIGNvbnN0IGVsZW1lbnQgPSBjdXN0b21NYXRjaGVyID8gY3VzdG9tTWF0Y2hlcihzZWxlY3RvcikgOiB0YXJnZXQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gIHJldHVybiBhd2FpdCBkZXRlY3RvcihlbGVtZW50KTtcbn1cbmNvbnN0IHdhaXRFbGVtZW50ID0gY3JlYXRlV2FpdEVsZW1lbnQoe1xuICBkZWZhdWx0T3B0aW9uczogZ2V0RGVmYXVsdE9wdGlvbnMoKVxufSk7XG5cbmV4cG9ydCB7IGNyZWF0ZVdhaXRFbGVtZW50LCBnZXREZWZhdWx0T3B0aW9ucywgd2FpdEVsZW1lbnQgfTtcbiJdLCJuYW1lcyI6WyJkZWZpbml0aW9uIiwidXRpbCIsIm9iamVjdFV0aWwiLCJkZWZhdWx0RXJyb3JNYXAiLCJlcnJvclV0aWwiLCJyZXN1bHQiLCJlcnJvck1hcCIsImN0eCIsImlzc3VlcyIsImVsZW1lbnRzIiwicHJvY2Vzc2VkIiwiWm9kRmlyc3RQYXJ0eVR5cGVLaW5kIiwiei50dXBsZSIsInoubnVtYmVyIiwiei5zdHJpbmciLCJ6LmVudW0iLCJ6Lm9iamVjdCIsInouYm9vbGVhbiIsInoucmVjb3JkIiwiei51bmlvbiIsInoubGl0ZXJhbCIsInouYXJyYXkiLCJBY3Rpb25QYXJhbXNTY2hlbWEiLCJfYSIsImxpc3QiLCJ6LlpvZElzc3VlQ29kZSIsInouZGlzY3JpbWluYXRlZFVuaW9uIiwiei5jdXN0b20iLCJvIiwiU2V0TGlrZSIsIkFycmF5RnJvbSIsImNvbnRlbnQiLCJkb2N1bWVudCIsIndpbmRvdyIsImdldENvbXB1dGVkU3R5bGUiLCJjb21wdXRlVGV4dEFsdGVybmF0aXZlIiwiX2IiLCJuYW1lIiwicmVjdCIsInRoaXMiLCJtb2R1bGUiLCJwcm94eVRhcmdldCIsInZhbHVlIiwibWVzc2FnZSIsInByaW50IiwibG9nZ2VyIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFPLFdBQVMsb0JBQW9CQSxhQUFZO0FBQzlDLFdBQU9BO0FBQUEsRUFDVDtBQ3FDTyxXQUFTLFdBQ2QsTUFDQSxPQUNBLFNBQ0EsWUFBWSxPQUNaLFFBQ1k7QUFDWixXQUFPLEVBQUUsTUFBTSxPQUFPLFNBQVMsV0FBVyxPQUFBO0FBQUEsRUFDNUM7Ozs7Ozs7Ozs7O0FDa0JPLFdBQVMsZ0JBQWdCLE1BQVksT0FBTyxHQUFTO0FBQzFELFdBQU87QUFBQSxNQUNMLEtBQUssTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUk7QUFBQSxNQUM3QixLQUFLLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJO0FBQUEsTUFDN0IsS0FBSyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSTtBQUFBLE1BQzdCLEtBQUssTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUk7QUFBQSxJQUFBO0FBQUEsRUFFakM7O0FDeEVPLE1BQUk7QUFDWCxHQUFDLFNBQVVDLE9BQU07QUFDYixJQUFBQSxNQUFLLGNBQWMsQ0FBQyxNQUFNO0FBQUEsSUFBRTtBQUM1QixhQUFTLFNBQVMsTUFBTTtBQUFBLElBQUU7QUFDMUIsSUFBQUEsTUFBSyxXQUFXO0FBQ2hCLGFBQVMsWUFBWSxJQUFJO0FBQ3JCLFlBQU0sSUFBSSxNQUFLO0FBQUEsSUFDbkI7QUFDQSxJQUFBQSxNQUFLLGNBQWM7QUFDbkIsSUFBQUEsTUFBSyxj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UztBQUNULGFBQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxPQUFPLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxNQUFNO0FBQUEsSUFDN0Q7QUFBQSxJQUNBLElBQUksU0FBUztBQUNULGFBQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxPQUFPLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxNQUFNO0FBQUEsSUFDN0Q7QUFBQSxJQUNBLElBQUksYUFBYTtBQUNiLGFBQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxPQUFPLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxVQUFVO0FBQUEsSUFDakU7QUFBQSxJQUNBLElBQUksVUFBVTtBQUNWLGFBQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxPQUFPLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxPQUFPO0FBQUEsSUFDOUQ7QUFBQSxJQUNBLElBQUksUUFBUTtBQUNSLGFBQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxPQUFPLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxLQUFLO0FBQUEsSUFDNUQ7QUFBQSxJQUNBLElBQUksVUFBVTtBQUNWLGFBQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxPQUFPLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxPQUFPO0FBQUEsSUFDOUQ7QUFBQSxJQUNBLElBQUksU0FBUztBQUNULGFBQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxPQUFPLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxNQUFNO0FBQUEsSUFDN0Q7QUFBQSxJQUNBLElBQUksV0FBVztBQUNYLGFBQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxPQUFPLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxRQUFRO0FBQUEsSUFDL0Q7QUFBQSxJQUNBLElBQUksU0FBUztBQUNULGFBQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxPQUFPLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxNQUFNO0FBQUEsSUFDN0Q7QUFBQSxJQUNBLElBQUksVUFBVTtBQUNWLGFBQU8sQ0FBQyxDQUFDLEtBQUssS0FBSyxPQUFP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R0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLENBQUM7QUFDN08sc0JBQU0sYUFBVyxDQUFDLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxDQUFDO0FBQ2pNLHNC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SSxPQUFPLGNBQWMsWUFBWSxPQUFPLGNBQWMsWUFBWTtBQUNyRSxtQkFBUztBQUFBLFFBQ1YsV0FBVyxPQUFPLGNBQWMsVUFBVTtBQUN6QyxtQkFBUztBQUFBLFFBQ1YsT0FBTztBQUNOLG1CQUFTO0FBQUEsUUFDVjtBQUVBLFlBQUksQ0FBQyxRQUFRO0FBQ1osc0JBQVksS0FBSyxTQUFTO0FBQUEsUUFDM0IsV0FBVyxLQUFLLE1BQU0sRUFBRSxJQUFJLFNBQVMsR0FBRztBQUN2QyxzQkFBWSxLQUFLLEtBQUssTUFBTSxFQUFFLElBQUksU0FBUyxDQUFDO0FBQUEsUUFDN0MsV0FBVyxRQUFRO0FBQ2xCLGdCQUFNLGFBQWEsYUFBYSxZQUFZO0FBQzVDLGVBQUssTUFBTSxFQUFFLElBQUksV0FBVyxVQUFVO0FBQ3RDLHNCQUFZLEtBQUssVUFBVTtBQUFBLFFBQzVCLE9BQU87QUFDTixpQkFBTztBQUFBLFFBQ1I7QUFBQSxNQUNEO0FBRUEsYUFBTyxLQUFLLFVBQVUsV0FBVztBQUFBLElBQ2xDO0FBQUEsSUFFQSxJQUFJLE1BQU0sT0FBTztBQUNoQixZQUFNLEVBQUMsVUFBUyxJQUFJLEtBQUssZUFBZSxNQUFNLElBQUk7QUFDbEQsYUFBTyxNQUFNLElBQUksV0FBVyxLQUFLO0FBQUEsSUFDbEM7QUFBQSxJQUVBLElBQUksTUFBTTtBQUNULFlBQU0sRUFBQyxVQUFTLElBQUksS0FBSyxlQUFlLElBQUk7QUFDNUMsYUFBTyxNQUFNLElBQUksU0FBUztBQUFBLElBQzNCO0FBQUEsSUFFQSxJQUFJLE1BQU07QUFDVCxZQUFNLEVBQUMsVUFBUyxJQUFJLEtBQUssZUFBZSxJQUFJO0FBQzVDLGFBQU8sTUFBTSxJQUFJLFNBQVM7QUFBQSxJQUMzQjtBQUFBLElBRUEsT0FBTyxNQUFNO0FBQ1osWUFBTSxFQUFDLFdBQVcsV0FBVSxJQUFJLEtBQUssZUFBZSxJQUFJO0FBQ3hELGFBQU8sUUFBUSxhQUFhLE1BQU0sT0FBTyxTQUFTLEtBQUssS0FBSyxZQUFZLE9BQU8sVUFBVSxDQUFDO0FBQUEsSUFDM0Y7QUFBQSxJQUVBLFFBQVE7QUFDUCxZQUFNLE1BQUs7QUFDWCxXQUFLLGNBQWMsTUFBSztBQUN4QixXQUFLLFlBQVksTUFBSztBQUFBLElBQ3ZCO0FBQUEsSUFFQSxLQUFLLE9BQU8sV0FBVyxJQUFJO0FBQzFCLGFBQU87QUFBQSxJQUNSO0FBQUEsSUFFQSxJQUFJLE9BQU87QUFDVixhQUFPLE1BQU07QUFBQSxJQUNkO0FBQUEsRUFDRDtBQ3ZGbUIsTUFBSSxZQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMyw0LDUsNiw3LDgsOSwxNiwxNywxOCwxOSwyMCwyMSw0MSw0Miw0Myw0NCw0NSw0Niw0Nyw0OF19
