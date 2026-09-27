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
  ZodNever.create;
  const arrayType = ZodArray.create;
  const objectType = ZodObject.create;
  const unionType = ZodUnion.create;
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
    parent_dom_id: stringType().nullable()
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
  const ActionParamsSchema = objectType({
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
    params: ActionParamsSchema.nullable(),
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
            sendResponse({ ok: true, data });
          }).catch((err) => {
            const error = (err == null ? void 0 : err.code) && (err == null ? void 0 : err.stage) ? err : stageError("INTERNAL", "dom", (err == null ? void 0 : err.message) || String(err));
            sendResponse({ ok: false, error });
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
      const timeoutMs = (options == null ? void 0 : options.timeoutMs) || (type === "vision/perceive" ? 1e4 : 4500);
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
              if (settled) return;
              settled = true;
              clearTimeout(timer);
              if (ext.runtime.lastError) {
                resolve({
                  ok: false,
                  error: stageError(
                    "INTERNAL",
                    "dom",
                    ext.runtime.lastError.message || "Unknown runtime error"
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
              if (options.frameId !== void 0) {
                ext.tabs.sendMessage(options.tabId, message, { frameId: options.frameId }, callback);
              } else {
                ext.tabs.sendMessage(options.tabId, message, callback);
              }
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
  function computeElementAccessibleName(el) {
    try {
      const name = computeAccessibleName(el);
      return name ? name.trim() : null;
    } catch {
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
          attributes: attrs
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
        parent_dom_id: null
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDI2LjYuMl9yb2xsdXBANC42My40L25vZGVfbW9kdWxlcy93eHQvZGlzdC9zYW5kYm94L2RlZmluZS1jb250ZW50LXNjcmlwdC5tanMiLCIuLi8uLi8uLi8uLi9jb250cmFjdHMvdHMvY29tbW9uLnRzIiwiLi4vLi4vLi4vLi4vY29udHJhY3RzL3RzL2dlb21ldHJ5LnRzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEAzLjI1Ljc2L25vZGVfbW9kdWxlcy96b2QvdjMvaGVscGVycy91dGlsLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEAzLjI1Ljc2L25vZGVfbW9kdWxlcy96b2QvdjMvWm9kRXJyb3IuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDMuMjUuNzYvbm9kZV9tb2R1bGVzL3pvZC92My9sb2NhbGVzL2VuLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEAzLjI1Ljc2L25vZGVfbW9kdWxlcy96b2QvdjMvZXJyb3JzLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEAzLjI1Ljc2L25vZGVfbW9kdWxlcy96b2QvdjMvaGVscGVycy9wYXJzZVV0aWwuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDMuMjUuNzYvbm9kZV9tb2R1bGVzL3pvZC92My9oZWxwZXJzL2Vycm9yVXRpbC5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RAMy4yNS43Ni9ub2RlX21vZHVsZXMvem9kL3YzL3R5cGVzLmpzIiwiLi4vLi4vLi4vLi4vY29udHJhY3RzL3RzL3NjaGVtYXMudHMiLCIuLi8uLi8uLi8uLi9jb250cmFjdHMvdHMvYnVzLnRzIiwiLi4vLi4vLi4vc3JjL3BlcmNlcHRpb24vZG9tL3Zpc2liaWxpdHkudHMiLCIuLi8uLi8uLi9zcmMvcGVyY2VwdGlvbi9kb20vcmVuZGVyaW5nLWtpbmQudHMiLCIuLi8uLi8uLi9zcmMvcGVyY2VwdGlvbi9hY2Nlc3NpYmlsaXR5L3JvbGUudHMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vZG9tLWFjY2Vzc2liaWxpdHktYXBpQDAuNy4xL25vZGVfbW9kdWxlcy9kb20tYWNjZXNzaWJpbGl0eS1hcGkvZGlzdC9wb2x5ZmlsbHMvYXJyYXkuZnJvbS5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vZG9tLWFjY2Vzc2liaWxpdHktYXBpQDAuNy4xL25vZGVfbW9kdWxlcy9kb20tYWNjZXNzaWJpbGl0eS1hcGkvZGlzdC9wb2x5ZmlsbHMvU2V0TGlrZS5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vZG9tLWFjY2Vzc2liaWxpdHktYXBpQDAuNy4xL25vZGVfbW9kdWxlcy9kb20tYWNjZXNzaWJpbGl0eS1hcGkvZGlzdC9nZXRSb2xlLm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9kb20tYWNjZXNzaWJpbGl0eS1hcGlAMC43LjEvbm9kZV9tb2R1bGVzL2RvbS1hY2Nlc3NpYmlsaXR5LWFwaS9kaXN0L3V0aWwubWpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2RvbS1hY2Nlc3NpYmlsaXR5LWFwaUAwLjcuMS9ub2RlX21vZHVsZXMvZG9tLWFjY2Vzc2liaWxpdHktYXBpL2Rpc3QvYWNjZXNzaWJsZS1uYW1lLWFuZC1kZXNjcmlwdGlvbi5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vZG9tLWFjY2Vzc2liaWxpdHktYXBpQDAuNy4xL25vZGVfbW9kdWxlcy9kb20tYWNjZXNzaWJpbGl0eS1hcGkvZGlzdC9hY2Nlc3NpYmxlLW5hbWUubWpzIiwiLi4vLi4vLi4vc3JjL3BlcmNlcHRpb24vYWNjZXNzaWJpbGl0eS9uYW1lLnRzIiwiLi4vLi4vLi4vc3JjL2NvbnRlbnQvZnJhbWUtb2Zmc2V0cy50cyIsIi4uLy4uLy4uL3NyYy9jb250ZW50L3JlZ2lzdHJ5LnRzIiwiLi4vLi4vLi4vc3JjL3NlY3VyaXR5L3NoYTI1Ni50cyIsIi4uLy4uLy4uL3NyYy9icm93c2VyL3N0YXRlL2ZpbmdlcnByaW50LnRzIiwiLi4vLi4vLi4vc3JjL3BlcmNlcHRpb24vZG9tL3NuYXBzaG90LnRzIiwiLi4vLi4vLi4vc3JjL2NvbnRlbnQvb2JzZXJ2ZXJzLnRzIiwiLi4vLi4vLi4vc3JjL2NvbnRlbnQvYWdlbnQtdWkudHMiLCIuLi8uLi8uLi9zcmMvYWN0aW9ucy9leGVjdXRvci9jbGljay50cyIsIi4uLy4uLy4uL3NyYy9hY3Rpb25zL2V4ZWN1dG9yL3R5cGUudHMiLCIuLi8uLi8uLi9zcmMvYWN0aW9ucy9leGVjdXRvci9zZWxlY3QudHMiLCIuLi8uLi8uLi9zcmMvYWN0aW9ucy9leGVjdXRvci9zY3JvbGwudHMiLCIuLi8uLi8uLi9zcmMvYWN0aW9ucy9leGVjdXRvci9rZXlwcmVzcy50cyIsIi4uLy4uLy4uL3NyYy9hY3Rpb25zL2V4ZWN1dG9yL3NldHRsZS50cyIsIi4uLy4uLy4uL3NyYy9hY3Rpb25zL2V4ZWN1dG9yL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL3BlcmNlcHRpb24vZG9tL3RvLXJlZ2lvbnMudHMiLCIuLi8uLi8uLi9lbnRyeXBvaW50cy9jb250ZW50LnRzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3dlYmV4dGVuc2lvbi1wb2x5ZmlsbEAwLjEyLjAvbm9kZV9tb2R1bGVzL3dlYmV4dGVuc2lvbi1wb2x5ZmlsbC9kaXN0L2Jyb3dzZXItcG9seWZpbGwuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMTkuMjlfQHR5cGVzK25vZGVAMjYuNi4yX3JvbGx1cEA0LjYzLjQvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2Jyb3dzZXIvaW5kZXgubWpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjE5LjI5X0B0eXBlcytub2RlQDI2LjYuMl9yb2xsdXBANC42My40L25vZGVfbW9kdWxlcy93eHQvZGlzdC9zYW5kYm94L3V0aWxzL2xvZ2dlci5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMTkuMjlfQHR5cGVzK25vZGVAMjYuNi4yX3JvbGx1cEA0LjYzLjQvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2NsaWVudC9jb250ZW50LXNjcmlwdHMvY3VzdG9tLWV2ZW50cy5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMTkuMjlfQHR5cGVzK25vZGVAMjYuNi4yX3JvbGx1cEA0LjYzLjQvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2NsaWVudC9jb250ZW50LXNjcmlwdHMvbG9jYXRpb24td2F0Y2hlci5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMTkuMjlfQHR5cGVzK25vZGVAMjYuNi4yX3JvbGx1cEA0LjYzLjQvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2NsaWVudC9jb250ZW50LXNjcmlwdHMvY29udGVudC1zY3JpcHQtY29udGV4dC5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbWFueS1rZXlzLW1hcEAzLjAuMy9ub2RlX21vZHVsZXMvbWFueS1rZXlzLW1hcC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AMW5hdHN1K3dhaXQtZWxlbWVudEA0LjIuMC9ub2RlX21vZHVsZXMvQDFuYXRzdS93YWl0LWVsZW1lbnQvZGlzdC9pbmRleC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cbiIsImV4cG9ydCB0eXBlIEJCb3ggPSBbeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyXTsgLy8gQ1NTIHB4LCBUT1AtTEVWRUwgdmlld3BvcnQgc3BhY2VcbmV4cG9ydCB0eXBlIE9yaWdpbiA9IHN0cmluZzsgLy8gXCJodHRwczovL2V4YW1wbGUuY29tXCIg4oCUIHNjaGVtZStob3N0K3BvcnQgb25seSwgbmV2ZXIgYSBmdWxsIFVSTFxuZXhwb3J0IHR5cGUgRnJhbWVJZCA9IHN0cmluZzsgLy8gXCJtYWluXCIgfCBcImYxXCIgfCBcImYyXCIgLi4uXG5leHBvcnQgdHlwZSBTb3VyY2UgPSAnRE9NJyB8ICdBUklBJyB8ICdWSVNJT04nIHwgJ09DUic7XG5cbmV4cG9ydCB0eXBlIFNlbWFudGljVHlwZSA9XG4gIHwgJ2J1dHRvbicgfCAnaW5wdXQnIHwgJ2NoZWNrYm94JyB8ICdkcm9wZG93bicgfCAnbGluaycgfCAndGFiJyB8ICdtZW51JyB8ICdkaWFsb2cnXG4gIHwgJ2NoYXJ0JyB8ICd0YWJsZScgfCAnY2FyZCcgfCAnbmF2aWdhdGlvbicgfCAnaW1hZ2UnIHwgJ3RleHQnIHwgJ2N1c3RvbV9jb250cm9sJyB8ICd1bmtub3duJztcblxuZXhwb3J0IHR5cGUgVmlzdWFsU3RhdGUgPVxuICB8ICdlbmFibGVkJyB8ICdkaXNhYmxlZCcgfCAnc2VsZWN0ZWQnIHwgJ2V4cGFuZGVkJyB8ICdjb2xsYXBzZWQnXG4gIHwgJ2ZvY3VzZWQnIHwgJ2NoZWNrZWQnIHwgJ3VuY2hlY2tlZCcgfCAndmlzaWJsZSc7XG5cbmV4cG9ydCB0eXBlIFN0YWdlTmFtZSA9XG4gIHwgJ2NhcHR1cmUnIHwgJ2RvbScgfCAncm91dGUnIHwgJ3Zpc2lvbicgfCAnb2NyJyB8ICdmYWNlJyB8ICdncm91bmQnIHwgJ2Z1c2UnXG4gIHwgJ3BpaScgfCAncmVkYWN0JyB8ICdmaXJld2FsbCcgfCAnbmV0d29yaycgfCAnc2VydmVyJyB8ICd2YWxpZGF0ZScgfCAnZXhlY3V0ZScgfCAnc2V0dGxlJztcblxuZXhwb3J0IHR5cGUgU3RhZ2VFcnJvckNvZGUgPVxuICB8ICdWSVNJT05fVU5BVkFJTEFCTEUnIHwgJ1BSSVZBQ1lfQkxPQ0snIHwgJ1BSSVZBQ1lfRVJST1InIHwgJ1NFUlZFUl9VTkFWQUlMQUJMRSdcbiAgfCAnU0VSVkVSX0lOVkFMSUQnIHwgJ1NUQUxFX1NUQVRFJyB8ICdPUklHSU5fTUlTTUFUQ0gnIHwgJ0ZSQU1FX01JU01BVENIJ1xuICB8ICdQT0xJQ1lfREVOSUVEJyB8ICdUQVJHRVRfTk9UX0ZPVU5EJyB8ICdOT1RfSU5URVJBQ1RBQkxFJ1xuICB8ICdDQVBBQklMSVRZX0RFTklFRCcgfCAnVEVYVF9VTlNBRkUnIHwgJ1RJTUVPVVQnIHwgJ0lOVEVSTkFMJztcblxuZXhwb3J0IGludGVyZmFjZSBTdGFnZUVycm9yIHtcbiAgY29kZTogU3RhZ2VFcnJvckNvZGU7XG4gIHN0YWdlOiBTdGFnZU5hbWU7XG4gIG1lc3NhZ2U6IHN0cmluZzsgLy8gTkVWRVIgY29udGFpbnMgcmF3IHBhZ2UgdGV4dCwgUElJIG9yIHNlY3JldHNcbiAgcmV0cnlhYmxlOiBib29sZWFuO1xuICBkZXRhaWw/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUZWxlbWV0cnlFdmVudCB7XG4gIHRzOiBudW1iZXI7XG4gIGN5Y2xlX2lkOiBzdHJpbmc7XG4gIHN0YWdlOiBTdGFnZU5hbWU7XG4gIGR1cmF0aW9uX21zOiBudW1iZXI7IC8vIHBlcmZvcm1hbmNlLm5vdygpIGRlbHRhLCBrZWVwIDMgZGVjaW1hbHMg4oCUIG5ldmVyIHJvdW5kIHRvIDBcbiAgbWV0YT86IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4+OyAvLyBjb3VudHMvaWRzL2VudW1zIE9OTFksIG5vIHJhdyB0ZXh0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFnZUVycm9yKFxuICBjb2RlOiBTdGFnZUVycm9yQ29kZSxcbiAgc3RhZ2U6IFN0YWdlTmFtZSxcbiAgbWVzc2FnZTogc3RyaW5nLFxuICByZXRyeWFibGUgPSBmYWxzZSxcbiAgZGV0YWlsPzogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbj5cbik6IFN0YWdlRXJyb3Ige1xuICByZXR1cm4geyBjb2RlLCBzdGFnZSwgbWVzc2FnZSwgcmV0cnlhYmxlLCBkZXRhaWwgfTtcbn1cbiIsImltcG9ydCB0eXBlIHsgQkJveCB9IGZyb20gJy4vY29tbW9uLmpzJztcblxuZXhwb3J0IGludGVyZmFjZSBSZWN0IHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9SZWN0KGJib3g6IEJCb3gpOiBSZWN0IHtcbiAgcmV0dXJuIHtcbiAgICB4OiBiYm94WzBdLFxuICAgIHk6IGJib3hbMV0sXG4gICAgd2lkdGg6IGJib3hbMl0sXG4gICAgaGVpZ2h0OiBiYm94WzNdLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbVJlY3QocmVjdDogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfSB8IERPTVJlY3QgfCBET01SZWN0UmVhZE9ubHkpOiBCQm94IHtcbiAgcmV0dXJuIFtyZWN0LngsIHJlY3QueSwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHRdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9JbWFnZVB4KGJib3g6IEJCb3gsIGRwcjogbnVtYmVyKTogQkJveCB7XG4gIHJldHVybiBbXG4gICAgTWF0aC5yb3VuZChiYm94WzBdICogZHByKSxcbiAgICBNYXRoLnJvdW5kKGJib3hbMV0gKiBkcHIpLFxuICAgIE1hdGgucm91bmQoYmJveFsyXSAqIGRwciksXG4gICAgTWF0aC5yb3VuZChiYm94WzNdICogZHByKSxcbiAgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ3NzUHgoYmJveDogQkJveCwgZHByOiBudW1iZXIpOiBCQm94IHtcbiAgY29uc3Qgc2NhbGUgPSBkcHIgPiAwID8gMSAvIGRwciA6IDE7XG4gIHJldHVybiBbXG4gICAgYmJveFswXSAqIHNjYWxlLFxuICAgIGJib3hbMV0gKiBzY2FsZSxcbiAgICBiYm94WzJdICogc2NhbGUsXG4gICAgYmJveFszXSAqIHNjYWxlLFxuICBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFkQkJveChiYm94OiBCQm94LCBwYWRkaW5nOiBudW1iZXIsIG1heEJvdW5kcz86IHsgdzogbnVtYmVyOyBoOiBudW1iZXIgfSk6IEJCb3gge1xuICBjb25zdCB4ID0gTWF0aC5tYXgoMCwgYmJveFswXSAtIHBhZGRpbmcpO1xuICBjb25zdCB5ID0gTWF0aC5tYXgoMCwgYmJveFsxXSAtIHBhZGRpbmcpO1xuICBsZXQgdyA9IGJib3hbMl0gKyBwYWRkaW5nICogMjtcbiAgbGV0IGggPSBiYm94WzNdICsgcGFkZGluZyAqIDI7XG5cbiAgaWYgKG1heEJvdW5kcykge1xuICAgIHcgPSBNYXRoLm1pbih3LCBtYXhCb3VuZHMudyAtIHgpO1xuICAgIGggPSBNYXRoLm1pbihoLCBtYXhCb3VuZHMuaCAtIHkpO1xuICB9XG5cbiAgcmV0dXJuIFt4LCB5LCBNYXRoLm1heCgwLCB3KSwgTWF0aC5tYXgoMCwgaCldO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcm91bmRCQm94KGJib3g6IEJCb3gsIHByZWNpc2lvbiA9IDApOiBCQm94IHtcbiAgY29uc3QgZmFjdG9yID0gMTAgKiogcHJlY2lzaW9uO1xuICByZXR1cm4gW1xuICAgIE1hdGgucm91bmQoYmJveFswXSAqIGZhY3RvcikgLyBmYWN0b3IsXG4gICAgTWF0aC5yb3VuZChiYm94WzFdICogZmFjdG9yKSAvIGZhY3RvcixcbiAgICBNYXRoLnJvdW5kKGJib3hbMl0gKiBmYWN0b3IpIC8gZmFjdG9yLFxuICAgIE1hdGgucm91bmQoYmJveFszXSAqIGZhY3RvcikgLyBmYWN0b3IsXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByb3VuZEJCb3hUb1N0ZXAoYmJveDogQkJveCwgc3RlcCA9IDQpOiBCQm94IHtcbiAgcmV0dXJuIFtcbiAgICBNYXRoLnJvdW5kKGJib3hbMF0gLyBzdGVwKSAqIHN0ZXAsXG4gICAgTWF0aC5yb3VuZChiYm94WzFdIC8gc3RlcCkgKiBzdGVwLFxuICAgIE1hdGgucm91bmQoYmJveFsyXSAvIHN0ZXApICogc3RlcCxcbiAgICBNYXRoLnJvdW5kKGJib3hbM10gLyBzdGVwKSAqIHN0ZXAsXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjZW50ZXJQb2ludChiYm94OiBCQm94KTogW251bWJlciwgbnVtYmVyXSB7XG4gIHJldHVybiBbYmJveFswXSArIGJib3hbMl0gLyAyLCBiYm94WzFdICsgYmJveFszXSAvIDJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnNQb2ludChiYm94OiBCQm94LCB4OiBudW1iZXIsIHk6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIHggPj0gYmJveFswXSAmJlxuICAgIHggPD0gYmJveFswXSArIGJib3hbMl0gJiZcbiAgICB5ID49IGJib3hbMV0gJiZcbiAgICB5IDw9IGJib3hbMV0gKyBiYm94WzNdXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnNlY3RCQm94KGE6IEJCb3gsIGI6IEJCb3gpOiBCQm94IHwgbnVsbCB7XG4gIGNvbnN0IHgxID0gTWF0aC5tYXgoYVswXSwgYlswXSk7XG4gIGNvbnN0IHkxID0gTWF0aC5tYXgoYVsxXSwgYlsxXSk7XG4gIGNvbnN0IHgyID0gTWF0aC5taW4oYVswXSArIGFbMl0sIGJbMF0gKyBiWzJdKTtcbiAgY29uc3QgeTIgPSBNYXRoLm1pbihhWzFdICsgYVszXSwgYlsxXSArIGJbM10pO1xuXG4gIGlmICh4MiA8PSB4MSB8fCB5MiA8PSB5MSkgcmV0dXJuIG51bGw7XG4gIHJldHVybiBbeDEsIHkxLCB4MiAtIHgxLCB5MiAtIHkxXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZUJCb3goYmJveDogQkJveCwgZHg6IG51bWJlciwgZHk6IG51bWJlcik6IEJCb3gge1xuICByZXR1cm4gW2Jib3hbMF0gKyBkeCwgYmJveFsxXSArIGR5LCBiYm94WzJdLCBiYm94WzNdXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJib3hBcmVhKGJib3g6IEJCb3gpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5tYXgoMCwgYmJveFsyXSkgKiBNYXRoLm1heCgwLCBiYm94WzNdKTtcbn1cbiIsImV4cG9ydCB2YXIgdXRpbDtcbihmdW5jdGlvbiAodXRpbCkge1xuICAgIHV0aWwuYXNzZXJ0RXF1YWwgPSAoXykgPT4geyB9O1xuICAgIGZ1bmN0aW9uIGFzc2VydElzKF9hcmcpIHsgfVxuICAgIHV0aWwuYXNzZXJ0SXMgPSBhc3NlcnRJcztcbiAgICBmdW5jdGlvbiBhc3NlcnROZXZlcihfeCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9XG4gICAgdXRpbC5hc3NlcnROZXZlciA9IGFzc2VydE5ldmVyO1xuICAgIHV0aWwuYXJyYXlUb0VudW0gPSAoaXRlbXMpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0ge307XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICAgICAgb2JqW2l0ZW1dID0gaXRlbTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH07XG4gICAgdXRpbC5nZXRWYWxpZEVudW1WYWx1ZXMgPSAob2JqKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbGlkS2V5cyA9IHV0aWwub2JqZWN0S2V5cyhvYmopLmZpbHRlcigoaykgPT4gdHlwZW9mIG9ialtvYmpba11dICE9PSBcIm51bWJlclwiKTtcbiAgICAgICAgY29uc3QgZmlsdGVyZWQgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrIG9mIHZhbGlkS2V5cykge1xuICAgICAgICAgICAgZmlsdGVyZWRba10gPSBvYmpba107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHV0aWwub2JqZWN0VmFsdWVzKGZpbHRlcmVkKTtcbiAgICB9O1xuICAgIHV0aWwub2JqZWN0VmFsdWVzID0gKG9iaikgPT4ge1xuICAgICAgICByZXR1cm4gdXRpbC5vYmplY3RLZXlzKG9iaikubWFwKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqW2VdO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHV0aWwub2JqZWN0S2V5cyA9IHR5cGVvZiBPYmplY3Qua2V5cyA9PT0gXCJmdW5jdGlvblwiIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYmFuL2JhblxuICAgICAgICA/IChvYmopID0+IE9iamVjdC5rZXlzKG9iaikgLy8gZXNsaW50LWRpc2FibGUtbGluZSBiYW4vYmFuXG4gICAgICAgIDogKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qga2V5cyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgICAgIH07XG4gICAgdXRpbC5maW5kID0gKGFyciwgY2hlY2tlcikgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyKSB7XG4gICAgICAgICAgICBpZiAoY2hlY2tlcihpdGVtKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgdXRpbC5pc0ludGVnZXIgPSB0eXBlb2YgTnVtYmVyLmlzSW50ZWdlciA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgID8gKHZhbCkgPT4gTnVtYmVyLmlzSW50ZWdlcih2YWwpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYmFuL2JhblxuICAgICAgICA6ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwibnVtYmVyXCIgJiYgTnVtYmVyLmlzRmluaXRlKHZhbCkgJiYgTWF0aC5mbG9vcih2YWwpID09PSB2YWw7XG4gICAgZnVuY3Rpb24gam9pblZhbHVlcyhhcnJheSwgc2VwYXJhdG9yID0gXCIgfCBcIikge1xuICAgICAgICByZXR1cm4gYXJyYXkubWFwKCh2YWwpID0+ICh0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiID8gYCcke3ZhbH0nYCA6IHZhbCkpLmpvaW4oc2VwYXJhdG9yKTtcbiAgICB9XG4gICAgdXRpbC5qb2luVmFsdWVzID0gam9pblZhbHVlcztcbiAgICB1dGlsLmpzb25TdHJpbmdpZnlSZXBsYWNlciA9IChfLCB2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImJpZ2ludFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbn0pKHV0aWwgfHwgKHV0aWwgPSB7fSkpO1xuZXhwb3J0IHZhciBvYmplY3RVdGlsO1xuKGZ1bmN0aW9uIChvYmplY3RVdGlsKSB7XG4gICAgb2JqZWN0VXRpbC5tZXJnZVNoYXBlcyA9IChmaXJzdCwgc2Vjb25kKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5maXJzdCxcbiAgICAgICAgICAgIC4uLnNlY29uZCwgLy8gc2Vjb25kIG92ZXJ3cml0ZXMgZmlyc3RcbiAgICAgICAgfTtcbiAgICB9O1xufSkob2JqZWN0VXRpbCB8fCAob2JqZWN0VXRpbCA9IHt9KSk7XG5leHBvcnQgY29uc3QgWm9kUGFyc2VkVHlwZSA9IHV0aWwuYXJyYXlUb0VudW0oW1xuICAgIFwic3RyaW5nXCIsXG4gICAgXCJuYW5cIixcbiAgICBcIm51bWJlclwiLFxuICAgIFwiaW50ZWdlclwiLFxuICAgIFwiZmxvYXRcIixcbiAgICBcImJvb2xlYW5cIixcbiAgICBcImRhdGVcIixcbiAgICBcImJpZ2ludFwiLFxuICAgIFwic3ltYm9sXCIsXG4gICAgXCJmdW5jdGlvblwiLFxuICAgIFwidW5kZWZpbmVkXCIsXG4gICAgXCJudWxsXCIsXG4gICAgXCJhcnJheVwiLFxuICAgIFwib2JqZWN0XCIsXG4gICAgXCJ1bmtub3duXCIsXG4gICAgXCJwcm9taXNlXCIsXG4gICAgXCJ2b2lkXCIsXG4gICAgXCJuZXZlclwiLFxuICAgIFwibWFwXCIsXG4gICAgXCJzZXRcIixcbl0pO1xuZXhwb3J0IGNvbnN0IGdldFBhcnNlZFR5cGUgPSAoZGF0YSkgPT4ge1xuICAgIGNvbnN0IHQgPSB0eXBlb2YgZGF0YTtcbiAgICBzd2l0Y2ggKHQpIHtcbiAgICAgICAgY2FzZSBcInVuZGVmaW5lZFwiOlxuICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUudW5kZWZpbmVkO1xuICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS5zdHJpbmc7XG4gICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIuaXNOYU4oZGF0YSkgPyBab2RQYXJzZWRUeXBlLm5hbiA6IFpvZFBhcnNlZFR5cGUubnVtYmVyO1xuICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUuYm9vbGVhbjtcbiAgICAgICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS5mdW5jdGlvbjtcbiAgICAgICAgY2FzZSBcImJpZ2ludFwiOlxuICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUuYmlnaW50O1xuICAgICAgICBjYXNlIFwic3ltYm9sXCI6XG4gICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS5zeW1ib2w7XG4gICAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUuYXJyYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLm51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YS50aGVuICYmIHR5cGVvZiBkYXRhLnRoZW4gPT09IFwiZnVuY3Rpb25cIiAmJiBkYXRhLmNhdGNoICYmIHR5cGVvZiBkYXRhLmNhdGNoID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS5wcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBNYXAgIT09IFwidW5kZWZpbmVkXCIgJiYgZGF0YSBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLm1hcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgU2V0ICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS5zZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIERhdGUgIT09IFwidW5kZWZpbmVkXCIgJiYgZGF0YSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS5kYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUub2JqZWN0O1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUudW5rbm93bjtcbiAgICB9XG59O1xuIiwiaW1wb3J0IHsgdXRpbCB9IGZyb20gXCIuL2hlbHBlcnMvdXRpbC5qc1wiO1xuZXhwb3J0IGNvbnN0IFpvZElzc3VlQ29kZSA9IHV0aWwuYXJyYXlUb0VudW0oW1xuICAgIFwiaW52YWxpZF90eXBlXCIsXG4gICAgXCJpbnZhbGlkX2xpdGVyYWxcIixcbiAgICBcImN1c3RvbVwiLFxuICAgIFwiaW52YWxpZF91bmlvblwiLFxuICAgIFwiaW52YWxpZF91bmlvbl9kaXNjcmltaW5hdG9yXCIsXG4gICAgXCJpbnZhbGlkX2VudW1fdmFsdWVcIixcbiAgICBcInVucmVjb2duaXplZF9rZXlzXCIsXG4gICAgXCJpbnZhbGlkX2FyZ3VtZW50c1wiLFxuICAgIFwiaW52YWxpZF9yZXR1cm5fdHlwZVwiLFxuICAgIFwiaW52YWxpZF9kYXRlXCIsXG4gICAgXCJpbnZhbGlkX3N0cmluZ1wiLFxuICAgIFwidG9vX3NtYWxsXCIsXG4gICAgXCJ0b29fYmlnXCIsXG4gICAgXCJpbnZhbGlkX2ludGVyc2VjdGlvbl90eXBlc1wiLFxuICAgIFwibm90X211bHRpcGxlX29mXCIsXG4gICAgXCJub3RfZmluaXRlXCIsXG5dKTtcbmV4cG9ydCBjb25zdCBxdW90ZWxlc3NKc29uID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDIpO1xuICAgIHJldHVybiBqc29uLnJlcGxhY2UoL1wiKFteXCJdKylcIjovZywgXCIkMTpcIik7XG59O1xuZXhwb3J0IGNsYXNzIFpvZEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGdldCBlcnJvcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzc3VlcztcbiAgICB9XG4gICAgY29uc3RydWN0b3IoaXNzdWVzKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaXNzdWVzID0gW107XG4gICAgICAgIHRoaXMuYWRkSXNzdWUgPSAoc3ViKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzc3VlcyA9IFsuLi50aGlzLmlzc3Vlcywgc3ViXTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hZGRJc3N1ZXMgPSAoc3VicyA9IFtdKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzc3VlcyA9IFsuLi50aGlzLmlzc3VlcywgLi4uc3Vic107XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGFjdHVhbFByb3RvID0gbmV3LnRhcmdldC5wcm90b3R5cGU7XG4gICAgICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBiYW4vYmFuXG4gICAgICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgYWN0dWFsUHJvdG8pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fX3Byb3RvX18gPSBhY3R1YWxQcm90bztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5hbWUgPSBcIlpvZEVycm9yXCI7XG4gICAgICAgIHRoaXMuaXNzdWVzID0gaXNzdWVzO1xuICAgIH1cbiAgICBmb3JtYXQoX21hcHBlcikge1xuICAgICAgICBjb25zdCBtYXBwZXIgPSBfbWFwcGVyIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoaXNzdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNzdWUubWVzc2FnZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNvbnN0IGZpZWxkRXJyb3JzID0geyBfZXJyb3JzOiBbXSB9O1xuICAgICAgICBjb25zdCBwcm9jZXNzRXJyb3IgPSAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXNzdWUgb2YgZXJyb3IuaXNzdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzc3VlLmNvZGUgPT09IFwiaW52YWxpZF91bmlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzc3VlLnVuaW9uRXJyb3JzLm1hcChwcm9jZXNzRXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS5jb2RlID09PSBcImludmFsaWRfcmV0dXJuX3R5cGVcIikge1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRXJyb3IoaXNzdWUucmV0dXJuVHlwZUVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUuY29kZSA9PT0gXCJpbnZhbGlkX2FyZ3VtZW50c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NFcnJvcihpc3N1ZS5hcmd1bWVudHNFcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLnBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkRXJyb3JzLl9lcnJvcnMucHVzaChtYXBwZXIoaXNzdWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXJyID0gZmllbGRFcnJvcnM7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGkgPCBpc3N1ZS5wYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZWwgPSBpc3N1ZS5wYXRoW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVybWluYWwgPSBpID09PSBpc3N1ZS5wYXRoLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRlcm1pbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycltlbF0gPSBjdXJyW2VsXSB8fCB7IF9lcnJvcnM6IFtdIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHR5cGVvZiBlbCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY3VycltlbF0gPSBjdXJyW2VsXSB8fCB7IF9lcnJvcnM6IFtdIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSBlbHNlIGlmICh0eXBlb2YgZWwgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGNvbnN0IGVycm9yQXJyYXk6IGFueSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgZXJyb3JBcnJheS5fZXJyb3JzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjdXJyW2VsXSA9IGN1cnJbZWxdIHx8IGVycm9yQXJyYXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycltlbF0gPSBjdXJyW2VsXSB8fCB7IF9lcnJvcnM6IFtdIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycltlbF0uX2Vycm9ycy5wdXNoKG1hcHBlcihpc3N1ZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyciA9IGN1cnJbZWxdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBwcm9jZXNzRXJyb3IodGhpcyk7XG4gICAgICAgIHJldHVybiBmaWVsZEVycm9ycztcbiAgICB9XG4gICAgc3RhdGljIGFzc2VydCh2YWx1ZSkge1xuICAgICAgICBpZiAoISh2YWx1ZSBpbnN0YW5jZW9mIFpvZEVycm9yKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb3QgYSBab2RFcnJvcjogJHt2YWx1ZX1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZTtcbiAgICB9XG4gICAgZ2V0IG1lc3NhZ2UoKSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmlzc3VlcywgdXRpbC5qc29uU3RyaW5naWZ5UmVwbGFjZXIsIDIpO1xuICAgIH1cbiAgICBnZXQgaXNFbXB0eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNzdWVzLmxlbmd0aCA9PT0gMDtcbiAgICB9XG4gICAgZmxhdHRlbihtYXBwZXIgPSAoaXNzdWUpID0+IGlzc3VlLm1lc3NhZ2UpIHtcbiAgICAgICAgY29uc3QgZmllbGRFcnJvcnMgPSB7fTtcbiAgICAgICAgY29uc3QgZm9ybUVycm9ycyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHN1YiBvZiB0aGlzLmlzc3Vlcykge1xuICAgICAgICAgICAgaWYgKHN1Yi5wYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaXJzdEVsID0gc3ViLnBhdGhbMF07XG4gICAgICAgICAgICAgICAgZmllbGRFcnJvcnNbZmlyc3RFbF0gPSBmaWVsZEVycm9yc1tmaXJzdEVsXSB8fCBbXTtcbiAgICAgICAgICAgICAgICBmaWVsZEVycm9yc1tmaXJzdEVsXS5wdXNoKG1hcHBlcihzdWIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvcm1FcnJvcnMucHVzaChtYXBwZXIoc3ViKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgZm9ybUVycm9ycywgZmllbGRFcnJvcnMgfTtcbiAgICB9XG4gICAgZ2V0IGZvcm1FcnJvcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZsYXR0ZW4oKTtcbiAgICB9XG59XG5ab2RFcnJvci5jcmVhdGUgPSAoaXNzdWVzKSA9PiB7XG4gICAgY29uc3QgZXJyb3IgPSBuZXcgWm9kRXJyb3IoaXNzdWVzKTtcbiAgICByZXR1cm4gZXJyb3I7XG59O1xuIiwiaW1wb3J0IHsgWm9kSXNzdWVDb2RlIH0gZnJvbSBcIi4uL1pvZEVycm9yLmpzXCI7XG5pbXBvcnQgeyB1dGlsLCBab2RQYXJzZWRUeXBlIH0gZnJvbSBcIi4uL2hlbHBlcnMvdXRpbC5qc1wiO1xuY29uc3QgZXJyb3JNYXAgPSAoaXNzdWUsIF9jdHgpID0+IHtcbiAgICBsZXQgbWVzc2FnZTtcbiAgICBzd2l0Y2ggKGlzc3VlLmNvZGUpIHtcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlOlxuICAgICAgICAgICAgaWYgKGlzc3VlLnJlY2VpdmVkID09PSBab2RQYXJzZWRUeXBlLnVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIlJlcXVpcmVkXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gYEV4cGVjdGVkICR7aXNzdWUuZXhwZWN0ZWR9LCByZWNlaXZlZCAke2lzc3VlLnJlY2VpdmVkfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUuaW52YWxpZF9saXRlcmFsOlxuICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnZhbGlkIGxpdGVyYWwgdmFsdWUsIGV4cGVjdGVkICR7SlNPTi5zdHJpbmdpZnkoaXNzdWUuZXhwZWN0ZWQsIHV0aWwuanNvblN0cmluZ2lmeVJlcGxhY2VyKX1gO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLnVucmVjb2duaXplZF9rZXlzOlxuICAgICAgICAgICAgbWVzc2FnZSA9IGBVbnJlY29nbml6ZWQga2V5KHMpIGluIG9iamVjdDogJHt1dGlsLmpvaW5WYWx1ZXMoaXNzdWUua2V5cywgXCIsIFwiKX1gO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLmludmFsaWRfdW5pb246XG4gICAgICAgICAgICBtZXNzYWdlID0gYEludmFsaWQgaW5wdXRgO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLmludmFsaWRfdW5pb25fZGlzY3JpbWluYXRvcjpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW52YWxpZCBkaXNjcmltaW5hdG9yIHZhbHVlLiBFeHBlY3RlZCAke3V0aWwuam9pblZhbHVlcyhpc3N1ZS5vcHRpb25zKX1gO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLmludmFsaWRfZW51bV92YWx1ZTpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW52YWxpZCBlbnVtIHZhbHVlLiBFeHBlY3RlZCAke3V0aWwuam9pblZhbHVlcyhpc3N1ZS5vcHRpb25zKX0sIHJlY2VpdmVkICcke2lzc3VlLnJlY2VpdmVkfSdgO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLmludmFsaWRfYXJndW1lbnRzOlxuICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnZhbGlkIGZ1bmN0aW9uIGFyZ3VtZW50c2A7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUuaW52YWxpZF9yZXR1cm5fdHlwZTpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW52YWxpZCBmdW5jdGlvbiByZXR1cm4gdHlwZWA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUuaW52YWxpZF9kYXRlOlxuICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnZhbGlkIGRhdGVgO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nOlxuICAgICAgICAgICAgaWYgKHR5cGVvZiBpc3N1ZS52YWxpZGF0aW9uID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKFwiaW5jbHVkZXNcIiBpbiBpc3N1ZS52YWxpZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW52YWxpZCBpbnB1dDogbXVzdCBpbmNsdWRlIFwiJHtpc3N1ZS52YWxpZGF0aW9uLmluY2x1ZGVzfVwiYDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpc3N1ZS52YWxpZGF0aW9uLnBvc2l0aW9uID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gYCR7bWVzc2FnZX0gYXQgb25lIG9yIG1vcmUgcG9zaXRpb25zIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byAke2lzc3VlLnZhbGlkYXRpb24ucG9zaXRpb259YDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChcInN0YXJ0c1dpdGhcIiBpbiBpc3N1ZS52YWxpZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW52YWxpZCBpbnB1dDogbXVzdCBzdGFydCB3aXRoIFwiJHtpc3N1ZS52YWxpZGF0aW9uLnN0YXJ0c1dpdGh9XCJgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChcImVuZHNXaXRoXCIgaW4gaXNzdWUudmFsaWRhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gYEludmFsaWQgaW5wdXQ6IG11c3QgZW5kIHdpdGggXCIke2lzc3VlLnZhbGlkYXRpb24uZW5kc1dpdGh9XCJgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5hc3NlcnROZXZlcihpc3N1ZS52YWxpZGF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS52YWxpZGF0aW9uICE9PSBcInJlZ2V4XCIpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gYEludmFsaWQgJHtpc3N1ZS52YWxpZGF0aW9ufWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJJbnZhbGlkXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUudG9vX3NtYWxsOlxuICAgICAgICAgICAgaWYgKGlzc3VlLnR5cGUgPT09IFwiYXJyYXlcIilcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gYEFycmF5IG11c3QgY29udGFpbiAke2lzc3VlLmV4YWN0ID8gXCJleGFjdGx5XCIgOiBpc3N1ZS5pbmNsdXNpdmUgPyBgYXQgbGVhc3RgIDogYG1vcmUgdGhhbmB9ICR7aXNzdWUubWluaW11bX0gZWxlbWVudChzKWA7XG4gICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS50eXBlID09PSBcInN0cmluZ1wiKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgU3RyaW5nIG11c3QgY29udGFpbiAke2lzc3VlLmV4YWN0ID8gXCJleGFjdGx5XCIgOiBpc3N1ZS5pbmNsdXNpdmUgPyBgYXQgbGVhc3RgIDogYG92ZXJgfSAke2lzc3VlLm1pbmltdW19IGNoYXJhY3RlcihzKWA7XG4gICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS50eXBlID09PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgTnVtYmVyIG11c3QgYmUgJHtpc3N1ZS5leGFjdCA/IGBleGFjdGx5IGVxdWFsIHRvIGAgOiBpc3N1ZS5pbmNsdXNpdmUgPyBgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIGAgOiBgZ3JlYXRlciB0aGFuIGB9JHtpc3N1ZS5taW5pbXVtfWA7XG4gICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS50eXBlID09PSBcImJpZ2ludFwiKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgTnVtYmVyIG11c3QgYmUgJHtpc3N1ZS5leGFjdCA/IGBleGFjdGx5IGVxdWFsIHRvIGAgOiBpc3N1ZS5pbmNsdXNpdmUgPyBgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIGAgOiBgZ3JlYXRlciB0aGFuIGB9JHtpc3N1ZS5taW5pbXVtfWA7XG4gICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS50eXBlID09PSBcImRhdGVcIilcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gYERhdGUgbXVzdCBiZSAke2lzc3VlLmV4YWN0ID8gYGV4YWN0bHkgZXF1YWwgdG8gYCA6IGlzc3VlLmluY2x1c2l2ZSA/IGBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gYCA6IGBncmVhdGVyIHRoYW4gYH0ke25ldyBEYXRlKE51bWJlcihpc3N1ZS5taW5pbXVtKSl9YDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJJbnZhbGlkIGlucHV0XCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUudG9vX2JpZzpcbiAgICAgICAgICAgIGlmIChpc3N1ZS50eXBlID09PSBcImFycmF5XCIpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBBcnJheSBtdXN0IGNvbnRhaW4gJHtpc3N1ZS5leGFjdCA/IGBleGFjdGx5YCA6IGlzc3VlLmluY2x1c2l2ZSA/IGBhdCBtb3N0YCA6IGBsZXNzIHRoYW5gfSAke2lzc3VlLm1heGltdW19IGVsZW1lbnQocylgO1xuICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUudHlwZSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gYFN0cmluZyBtdXN0IGNvbnRhaW4gJHtpc3N1ZS5leGFjdCA/IGBleGFjdGx5YCA6IGlzc3VlLmluY2x1c2l2ZSA/IGBhdCBtb3N0YCA6IGB1bmRlcmB9ICR7aXNzdWUubWF4aW11bX0gY2hhcmFjdGVyKHMpYDtcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLnR5cGUgPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBOdW1iZXIgbXVzdCBiZSAke2lzc3VlLmV4YWN0ID8gYGV4YWN0bHlgIDogaXNzdWUuaW5jbHVzaXZlID8gYGxlc3MgdGhhbiBvciBlcXVhbCB0b2AgOiBgbGVzcyB0aGFuYH0gJHtpc3N1ZS5tYXhpbXVtfWA7XG4gICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS50eXBlID09PSBcImJpZ2ludFwiKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgQmlnSW50IG11c3QgYmUgJHtpc3N1ZS5leGFjdCA/IGBleGFjdGx5YCA6IGlzc3VlLmluY2x1c2l2ZSA/IGBsZXNzIHRoYW4gb3IgZXF1YWwgdG9gIDogYGxlc3MgdGhhbmB9ICR7aXNzdWUubWF4aW11bX1gO1xuICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUudHlwZSA9PT0gXCJkYXRlXCIpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBEYXRlIG11c3QgYmUgJHtpc3N1ZS5leGFjdCA/IGBleGFjdGx5YCA6IGlzc3VlLmluY2x1c2l2ZSA/IGBzbWFsbGVyIHRoYW4gb3IgZXF1YWwgdG9gIDogYHNtYWxsZXIgdGhhbmB9ICR7bmV3IERhdGUoTnVtYmVyKGlzc3VlLm1heGltdW0pKX1gO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkludmFsaWQgaW5wdXRcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5jdXN0b206XG4gICAgICAgICAgICBtZXNzYWdlID0gYEludmFsaWQgaW5wdXRgO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLmludmFsaWRfaW50ZXJzZWN0aW9uX3R5cGVzOlxuICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnRlcnNlY3Rpb24gcmVzdWx0cyBjb3VsZCBub3QgYmUgbWVyZ2VkYDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5ub3RfbXVsdGlwbGVfb2Y6XG4gICAgICAgICAgICBtZXNzYWdlID0gYE51bWJlciBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgJHtpc3N1ZS5tdWx0aXBsZU9mfWA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUubm90X2Zpbml0ZTpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBcIk51bWJlciBtdXN0IGJlIGZpbml0ZVwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBtZXNzYWdlID0gX2N0eC5kZWZhdWx0RXJyb3I7XG4gICAgICAgICAgICB1dGlsLmFzc2VydE5ldmVyKGlzc3VlKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgbWVzc2FnZSB9O1xufTtcbmV4cG9ydCBkZWZhdWx0IGVycm9yTWFwO1xuIiwiaW1wb3J0IGRlZmF1bHRFcnJvck1hcCBmcm9tIFwiLi9sb2NhbGVzL2VuLmpzXCI7XG5sZXQgb3ZlcnJpZGVFcnJvck1hcCA9IGRlZmF1bHRFcnJvck1hcDtcbmV4cG9ydCB7IGRlZmF1bHRFcnJvck1hcCB9O1xuZXhwb3J0IGZ1bmN0aW9uIHNldEVycm9yTWFwKG1hcCkge1xuICAgIG92ZXJyaWRlRXJyb3JNYXAgPSBtYXA7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0RXJyb3JNYXAoKSB7XG4gICAgcmV0dXJuIG92ZXJyaWRlRXJyb3JNYXA7XG59XG4iLCJpbXBvcnQgeyBnZXRFcnJvck1hcCB9IGZyb20gXCIuLi9lcnJvcnMuanNcIjtcbmltcG9ydCBkZWZhdWx0RXJyb3JNYXAgZnJvbSBcIi4uL2xvY2FsZXMvZW4uanNcIjtcbmV4cG9ydCBjb25zdCBtYWtlSXNzdWUgPSAocGFyYW1zKSA9PiB7XG4gICAgY29uc3QgeyBkYXRhLCBwYXRoLCBlcnJvck1hcHMsIGlzc3VlRGF0YSB9ID0gcGFyYW1zO1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gWy4uLnBhdGgsIC4uLihpc3N1ZURhdGEucGF0aCB8fCBbXSldO1xuICAgIGNvbnN0IGZ1bGxJc3N1ZSA9IHtcbiAgICAgICAgLi4uaXNzdWVEYXRhLFxuICAgICAgICBwYXRoOiBmdWxsUGF0aCxcbiAgICB9O1xuICAgIGlmIChpc3N1ZURhdGEubWVzc2FnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5pc3N1ZURhdGEsXG4gICAgICAgICAgICBwYXRoOiBmdWxsUGF0aCxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGlzc3VlRGF0YS5tZXNzYWdlLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gXCJcIjtcbiAgICBjb25zdCBtYXBzID0gZXJyb3JNYXBzXG4gICAgICAgIC5maWx0ZXIoKG0pID0+ICEhbSlcbiAgICAgICAgLnNsaWNlKClcbiAgICAgICAgLnJldmVyc2UoKTtcbiAgICBmb3IgKGNvbnN0IG1hcCBvZiBtYXBzKSB7XG4gICAgICAgIGVycm9yTWVzc2FnZSA9IG1hcChmdWxsSXNzdWUsIHsgZGF0YSwgZGVmYXVsdEVycm9yOiBlcnJvck1lc3NhZ2UgfSkubWVzc2FnZTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uaXNzdWVEYXRhLFxuICAgICAgICBwYXRoOiBmdWxsUGF0aCxcbiAgICAgICAgbWVzc2FnZTogZXJyb3JNZXNzYWdlLFxuICAgIH07XG59O1xuZXhwb3J0IGNvbnN0IEVNUFRZX1BBVEggPSBbXTtcbmV4cG9ydCBmdW5jdGlvbiBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIGlzc3VlRGF0YSkge1xuICAgIGNvbnN0IG92ZXJyaWRlTWFwID0gZ2V0RXJyb3JNYXAoKTtcbiAgICBjb25zdCBpc3N1ZSA9IG1ha2VJc3N1ZSh7XG4gICAgICAgIGlzc3VlRGF0YTogaXNzdWVEYXRhLFxuICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgIGVycm9yTWFwczogW1xuICAgICAgICAgICAgY3R4LmNvbW1vbi5jb250ZXh0dWFsRXJyb3JNYXAsIC8vIGNvbnRleHR1YWwgZXJyb3IgbWFwIGlzIGZpcnN0IHByaW9yaXR5XG4gICAgICAgICAgICBjdHguc2NoZW1hRXJyb3JNYXAsIC8vIHRoZW4gc2NoZW1hLWJvdW5kIG1hcCBpZiBhdmFpbGFibGVcbiAgICAgICAgICAgIG92ZXJyaWRlTWFwLCAvLyB0aGVuIGdsb2JhbCBvdmVycmlkZSBtYXBcbiAgICAgICAgICAgIG92ZXJyaWRlTWFwID09PSBkZWZhdWx0RXJyb3JNYXAgPyB1bmRlZmluZWQgOiBkZWZhdWx0RXJyb3JNYXAsIC8vIHRoZW4gZ2xvYmFsIGRlZmF1bHQgbWFwXG4gICAgICAgIF0uZmlsdGVyKCh4KSA9PiAhIXgpLFxuICAgIH0pO1xuICAgIGN0eC5jb21tb24uaXNzdWVzLnB1c2goaXNzdWUpO1xufVxuZXhwb3J0IGNsYXNzIFBhcnNlU3RhdHVzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IFwidmFsaWRcIjtcbiAgICB9XG4gICAgZGlydHkoKSB7XG4gICAgICAgIGlmICh0aGlzLnZhbHVlID09PSBcInZhbGlkXCIpXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gXCJkaXJ0eVwiO1xuICAgIH1cbiAgICBhYm9ydCgpIHtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgIT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFwiYWJvcnRlZFwiO1xuICAgIH1cbiAgICBzdGF0aWMgbWVyZ2VBcnJheShzdGF0dXMsIHJlc3VsdHMpIHtcbiAgICAgICAgY29uc3QgYXJyYXlWYWx1ZSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHMgb2YgcmVzdWx0cykge1xuICAgICAgICAgICAgaWYgKHMuc3RhdHVzID09PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgIGlmIChzLnN0YXR1cyA9PT0gXCJkaXJ0eVwiKVxuICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgYXJyYXlWYWx1ZS5wdXNoKHMudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLnZhbHVlLCB2YWx1ZTogYXJyYXlWYWx1ZSB9O1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgbWVyZ2VPYmplY3RBc3luYyhzdGF0dXMsIHBhaXJzKSB7XG4gICAgICAgIGNvbnN0IHN5bmNQYWlycyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHBhaXIgb2YgcGFpcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGF3YWl0IHBhaXIua2V5O1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBhd2FpdCBwYWlyLnZhbHVlO1xuICAgICAgICAgICAgc3luY1BhaXJzLnB1c2goe1xuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQYXJzZVN0YXR1cy5tZXJnZU9iamVjdFN5bmMoc3RhdHVzLCBzeW5jUGFpcnMpO1xuICAgIH1cbiAgICBzdGF0aWMgbWVyZ2VPYmplY3RTeW5jKHN0YXR1cywgcGFpcnMpIHtcbiAgICAgICAgY29uc3QgZmluYWxPYmplY3QgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBwYWlyIG9mIHBhaXJzKSB7XG4gICAgICAgICAgICBjb25zdCB7IGtleSwgdmFsdWUgfSA9IHBhaXI7XG4gICAgICAgICAgICBpZiAoa2V5LnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgIGlmIChrZXkuc3RhdHVzID09PSBcImRpcnR5XCIpXG4gICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICBpZiAodmFsdWUuc3RhdHVzID09PSBcImRpcnR5XCIpXG4gICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICBpZiAoa2V5LnZhbHVlICE9PSBcIl9fcHJvdG9fX1wiICYmICh0eXBlb2YgdmFsdWUudmFsdWUgIT09IFwidW5kZWZpbmVkXCIgfHwgcGFpci5hbHdheXNTZXQpKSB7XG4gICAgICAgICAgICAgICAgZmluYWxPYmplY3Rba2V5LnZhbHVlXSA9IHZhbHVlLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLnZhbHVlLCB2YWx1ZTogZmluYWxPYmplY3QgfTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgSU5WQUxJRCA9IE9iamVjdC5mcmVlemUoe1xuICAgIHN0YXR1czogXCJhYm9ydGVkXCIsXG59KTtcbmV4cG9ydCBjb25zdCBESVJUWSA9ICh2YWx1ZSkgPT4gKHsgc3RhdHVzOiBcImRpcnR5XCIsIHZhbHVlIH0pO1xuZXhwb3J0IGNvbnN0IE9LID0gKHZhbHVlKSA9PiAoeyBzdGF0dXM6IFwidmFsaWRcIiwgdmFsdWUgfSk7XG5leHBvcnQgY29uc3QgaXNBYm9ydGVkID0gKHgpID0+IHguc3RhdHVzID09PSBcImFib3J0ZWRcIjtcbmV4cG9ydCBjb25zdCBpc0RpcnR5ID0gKHgpID0+IHguc3RhdHVzID09PSBcImRpcnR5XCI7XG5leHBvcnQgY29uc3QgaXNWYWxpZCA9ICh4KSA9PiB4LnN0YXR1cyA9PT0gXCJ2YWxpZFwiO1xuZXhwb3J0IGNvbnN0IGlzQXN5bmMgPSAoeCkgPT4gdHlwZW9mIFByb21pc2UgIT09IFwidW5kZWZpbmVkXCIgJiYgeCBpbnN0YW5jZW9mIFByb21pc2U7XG4iLCJleHBvcnQgdmFyIGVycm9yVXRpbDtcbihmdW5jdGlvbiAoZXJyb3JVdGlsKSB7XG4gICAgZXJyb3JVdGlsLmVyclRvT2JqID0gKG1lc3NhZ2UpID0+IHR5cGVvZiBtZXNzYWdlID09PSBcInN0cmluZ1wiID8geyBtZXNzYWdlIH0gOiBtZXNzYWdlIHx8IHt9O1xuICAgIC8vIGJpb21lLWlnbm9yZSBsaW50OlxuICAgIGVycm9yVXRpbC50b1N0cmluZyA9IChtZXNzYWdlKSA9PiB0eXBlb2YgbWVzc2FnZSA9PT0gXCJzdHJpbmdcIiA/IG1lc3NhZ2UgOiBtZXNzYWdlPy5tZXNzYWdlO1xufSkoZXJyb3JVdGlsIHx8IChlcnJvclV0aWwgPSB7fSkpO1xuIiwiaW1wb3J0IHsgWm9kRXJyb3IsIFpvZElzc3VlQ29kZSwgfSBmcm9tIFwiLi9ab2RFcnJvci5qc1wiO1xuaW1wb3J0IHsgZGVmYXVsdEVycm9yTWFwLCBnZXRFcnJvck1hcCB9IGZyb20gXCIuL2Vycm9ycy5qc1wiO1xuaW1wb3J0IHsgZXJyb3JVdGlsIH0gZnJvbSBcIi4vaGVscGVycy9lcnJvclV0aWwuanNcIjtcbmltcG9ydCB7IERJUlRZLCBJTlZBTElELCBPSywgUGFyc2VTdGF0dXMsIGFkZElzc3VlVG9Db250ZXh0LCBpc0Fib3J0ZWQsIGlzQXN5bmMsIGlzRGlydHksIGlzVmFsaWQsIG1ha2VJc3N1ZSwgfSBmcm9tIFwiLi9oZWxwZXJzL3BhcnNlVXRpbC5qc1wiO1xuaW1wb3J0IHsgdXRpbCwgWm9kUGFyc2VkVHlwZSwgZ2V0UGFyc2VkVHlwZSB9IGZyb20gXCIuL2hlbHBlcnMvdXRpbC5qc1wiO1xuY2xhc3MgUGFyc2VJbnB1dExhenlQYXRoIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQsIHZhbHVlLCBwYXRoLCBrZXkpIHtcbiAgICAgICAgdGhpcy5fY2FjaGVkUGF0aCA9IFtdO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5kYXRhID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICAgICAgICB0aGlzLl9rZXkgPSBrZXk7XG4gICAgfVxuICAgIGdldCBwYXRoKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2NhY2hlZFBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLl9rZXkpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVkUGF0aC5wdXNoKC4uLnRoaXMuX3BhdGgsIC4uLnRoaXMuX2tleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZWRQYXRoLnB1c2goLi4udGhpcy5fcGF0aCwgdGhpcy5fa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVkUGF0aDtcbiAgICB9XG59XG5jb25zdCBoYW5kbGVSZXN1bHQgPSAoY3R4LCByZXN1bHQpID0+IHtcbiAgICBpZiAoaXNWYWxpZChyZXN1bHQpKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3VsdC52YWx1ZSB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKCFjdHguY29tbW9uLmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlZhbGlkYXRpb24gZmFpbGVkIGJ1dCBubyBpc3N1ZXMgZGV0ZWN0ZWQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIGdldCBlcnJvcigpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lcnJvcjtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBab2RFcnJvcihjdHguY29tbW9uLmlzc3Vlcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZXJyb3I7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbn07XG5mdW5jdGlvbiBwcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcykge1xuICAgIGlmICghcGFyYW1zKVxuICAgICAgICByZXR1cm4ge307XG4gICAgY29uc3QgeyBlcnJvck1hcCwgaW52YWxpZF90eXBlX2Vycm9yLCByZXF1aXJlZF9lcnJvciwgZGVzY3JpcHRpb24gfSA9IHBhcmFtcztcbiAgICBpZiAoZXJyb3JNYXAgJiYgKGludmFsaWRfdHlwZV9lcnJvciB8fCByZXF1aXJlZF9lcnJvcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW4ndCB1c2UgXCJpbnZhbGlkX3R5cGVfZXJyb3JcIiBvciBcInJlcXVpcmVkX2Vycm9yXCIgaW4gY29uanVuY3Rpb24gd2l0aCBjdXN0b20gZXJyb3IgbWFwLmApO1xuICAgIH1cbiAgICBpZiAoZXJyb3JNYXApXG4gICAgICAgIHJldHVybiB7IGVycm9yTWFwOiBlcnJvck1hcCwgZGVzY3JpcHRpb24gfTtcbiAgICBjb25zdCBjdXN0b21NYXAgPSAoaXNzLCBjdHgpID0+IHtcbiAgICAgICAgY29uc3QgeyBtZXNzYWdlIH0gPSBwYXJhbXM7XG4gICAgICAgIGlmIChpc3MuY29kZSA9PT0gXCJpbnZhbGlkX2VudW1fdmFsdWVcIikge1xuICAgICAgICAgICAgcmV0dXJuIHsgbWVzc2FnZTogbWVzc2FnZSA/PyBjdHguZGVmYXVsdEVycm9yIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBjdHguZGF0YSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHsgbWVzc2FnZTogbWVzc2FnZSA/PyByZXF1aXJlZF9lcnJvciA/PyBjdHguZGVmYXVsdEVycm9yIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzcy5jb2RlICE9PSBcImludmFsaWRfdHlwZVwiKVxuICAgICAgICAgICAgcmV0dXJuIHsgbWVzc2FnZTogY3R4LmRlZmF1bHRFcnJvciB9O1xuICAgICAgICByZXR1cm4geyBtZXNzYWdlOiBtZXNzYWdlID8/IGludmFsaWRfdHlwZV9lcnJvciA/PyBjdHguZGVmYXVsdEVycm9yIH07XG4gICAgfTtcbiAgICByZXR1cm4geyBlcnJvck1hcDogY3VzdG9tTWFwLCBkZXNjcmlwdGlvbiB9O1xufVxuZXhwb3J0IGNsYXNzIFpvZFR5cGUge1xuICAgIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5kZXNjcmlwdGlvbjtcbiAgICB9XG4gICAgX2dldFR5cGUoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGdldFBhcnNlZFR5cGUoaW5wdXQuZGF0YSk7XG4gICAgfVxuICAgIF9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KSB7XG4gICAgICAgIHJldHVybiAoY3R4IHx8IHtcbiAgICAgICAgICAgIGNvbW1vbjogaW5wdXQucGFyZW50LmNvbW1vbixcbiAgICAgICAgICAgIGRhdGE6IGlucHV0LmRhdGEsXG4gICAgICAgICAgICBwYXJzZWRUeXBlOiBnZXRQYXJzZWRUeXBlKGlucHV0LmRhdGEpLFxuICAgICAgICAgICAgc2NoZW1hRXJyb3JNYXA6IHRoaXMuX2RlZi5lcnJvck1hcCxcbiAgICAgICAgICAgIHBhdGg6IGlucHV0LnBhdGgsXG4gICAgICAgICAgICBwYXJlbnQ6IGlucHV0LnBhcmVudCxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogbmV3IFBhcnNlU3RhdHVzKCksXG4gICAgICAgICAgICBjdHg6IHtcbiAgICAgICAgICAgICAgICBjb21tb246IGlucHV0LnBhcmVudC5jb21tb24sXG4gICAgICAgICAgICAgICAgZGF0YTogaW5wdXQuZGF0YSxcbiAgICAgICAgICAgICAgICBwYXJzZWRUeXBlOiBnZXRQYXJzZWRUeXBlKGlucHV0LmRhdGEpLFxuICAgICAgICAgICAgICAgIHNjaGVtYUVycm9yTWFwOiB0aGlzLl9kZWYuZXJyb3JNYXAsXG4gICAgICAgICAgICAgICAgcGF0aDogaW5wdXQucGF0aCxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGlucHV0LnBhcmVudCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIF9wYXJzZVN5bmMoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcGFyc2UoaW5wdXQpO1xuICAgICAgICBpZiAoaXNBc3luYyhyZXN1bHQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTeW5jaHJvbm91cyBwYXJzZSBlbmNvdW50ZXJlZCBwcm9taXNlLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBfcGFyc2VBc3luYyhpbnB1dCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9wYXJzZShpbnB1dCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzdWx0KTtcbiAgICB9XG4gICAgcGFyc2UoZGF0YSwgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuc2FmZVBhcnNlKGRhdGEsIHBhcmFtcyk7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcylcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuZGF0YTtcbiAgICAgICAgdGhyb3cgcmVzdWx0LmVycm9yO1xuICAgIH1cbiAgICBzYWZlUGFyc2UoZGF0YSwgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IHtcbiAgICAgICAgICAgIGNvbW1vbjoge1xuICAgICAgICAgICAgICAgIGlzc3VlczogW10sXG4gICAgICAgICAgICAgICAgYXN5bmM6IHBhcmFtcz8uYXN5bmMgPz8gZmFsc2UsXG4gICAgICAgICAgICAgICAgY29udGV4dHVhbEVycm9yTWFwOiBwYXJhbXM/LmVycm9yTWFwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhdGg6IHBhcmFtcz8ucGF0aCB8fCBbXSxcbiAgICAgICAgICAgIHNjaGVtYUVycm9yTWFwOiB0aGlzLl9kZWYuZXJyb3JNYXAsXG4gICAgICAgICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgcGFyc2VkVHlwZTogZ2V0UGFyc2VkVHlwZShkYXRhKSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcGFyc2VTeW5jKHsgZGF0YSwgcGF0aDogY3R4LnBhdGgsIHBhcmVudDogY3R4IH0pO1xuICAgICAgICByZXR1cm4gaGFuZGxlUmVzdWx0KGN0eCwgcmVzdWx0KTtcbiAgICB9XG4gICAgXCJ+dmFsaWRhdGVcIihkYXRhKSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IHtcbiAgICAgICAgICAgIGNvbW1vbjoge1xuICAgICAgICAgICAgICAgIGlzc3VlczogW10sXG4gICAgICAgICAgICAgICAgYXN5bmM6ICEhdGhpc1tcIn5zdGFuZGFyZFwiXS5hc3luYyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXRoOiBbXSxcbiAgICAgICAgICAgIHNjaGVtYUVycm9yTWFwOiB0aGlzLl9kZWYuZXJyb3JNYXAsXG4gICAgICAgICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgcGFyc2VkVHlwZTogZ2V0UGFyc2VkVHlwZShkYXRhKSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCF0aGlzW1wifnN0YW5kYXJkXCJdLmFzeW5jKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3BhcnNlU3luYyh7IGRhdGEsIHBhdGg6IFtdLCBwYXJlbnQ6IGN0eCB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNWYWxpZChyZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzc3VlczogY3R4LmNvbW1vbi5pc3N1ZXMsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycj8ubWVzc2FnZT8udG9Mb3dlckNhc2UoKT8uaW5jbHVkZXMoXCJlbmNvdW50ZXJlZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW1wifnN0YW5kYXJkXCJdLmFzeW5jID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3R4LmNvbW1vbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgaXNzdWVzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyc2VBc3luYyh7IGRhdGEsIHBhdGg6IFtdLCBwYXJlbnQ6IGN0eCB9KS50aGVuKChyZXN1bHQpID0+IGlzVmFsaWQocmVzdWx0KVxuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC52YWx1ZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgIGlzc3VlczogY3R4LmNvbW1vbi5pc3N1ZXMsXG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgYXN5bmMgcGFyc2VBc3luYyhkYXRhLCBwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5zYWZlUGFyc2VBc3luYyhkYXRhLCBwYXJhbXMpO1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LmRhdGE7XG4gICAgICAgIHRocm93IHJlc3VsdC5lcnJvcjtcbiAgICB9XG4gICAgYXN5bmMgc2FmZVBhcnNlQXN5bmMoZGF0YSwgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IHtcbiAgICAgICAgICAgIGNvbW1vbjoge1xuICAgICAgICAgICAgICAgIGlzc3VlczogW10sXG4gICAgICAgICAgICAgICAgY29udGV4dHVhbEVycm9yTWFwOiBwYXJhbXM/LmVycm9yTWFwLFxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhdGg6IHBhcmFtcz8ucGF0aCB8fCBbXSxcbiAgICAgICAgICAgIHNjaGVtYUVycm9yTWFwOiB0aGlzLl9kZWYuZXJyb3JNYXAsXG4gICAgICAgICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgcGFyc2VkVHlwZTogZ2V0UGFyc2VkVHlwZShkYXRhKSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgbWF5YmVBc3luY1Jlc3VsdCA9IHRoaXMuX3BhcnNlKHsgZGF0YSwgcGF0aDogY3R4LnBhdGgsIHBhcmVudDogY3R4IH0pO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCAoaXNBc3luYyhtYXliZUFzeW5jUmVzdWx0KSA/IG1heWJlQXN5bmNSZXN1bHQgOiBQcm9taXNlLnJlc29sdmUobWF5YmVBc3luY1Jlc3VsdCkpO1xuICAgICAgICByZXR1cm4gaGFuZGxlUmVzdWx0KGN0eCwgcmVzdWx0KTtcbiAgICB9XG4gICAgcmVmaW5lKGNoZWNrLCBtZXNzYWdlKSB7XG4gICAgICAgIGNvbnN0IGdldElzc3VlUHJvcGVydGllcyA9ICh2YWwpID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbWVzc2FnZSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgbWVzc2FnZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IG1lc3NhZ2UgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBtZXNzYWdlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZSh2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0aGlzLl9yZWZpbmVtZW50KCh2YWwsIGN0eCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hlY2sodmFsKTtcbiAgICAgICAgICAgIGNvbnN0IHNldEVycm9yID0gKCkgPT4gY3R4LmFkZElzc3VlKHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuY3VzdG9tLFxuICAgICAgICAgICAgICAgIC4uLmdldElzc3VlUHJvcGVydGllcyh2YWwpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIFByb21pc2UgIT09IFwidW5kZWZpbmVkXCIgJiYgcmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBzZXRFcnJvcigpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVmaW5lbWVudChjaGVjaywgcmVmaW5lbWVudERhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZmluZW1lbnQoKHZhbCwgY3R4KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWNoZWNrKHZhbCkpIHtcbiAgICAgICAgICAgICAgICBjdHguYWRkSXNzdWUodHlwZW9mIHJlZmluZW1lbnREYXRhID09PSBcImZ1bmN0aW9uXCIgPyByZWZpbmVtZW50RGF0YSh2YWwsIGN0eCkgOiByZWZpbmVtZW50RGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfcmVmaW5lbWVudChyZWZpbmVtZW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kRWZmZWN0cyh7XG4gICAgICAgICAgICBzY2hlbWE6IHRoaXMsXG4gICAgICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEVmZmVjdHMsXG4gICAgICAgICAgICBlZmZlY3Q6IHsgdHlwZTogXCJyZWZpbmVtZW50XCIsIHJlZmluZW1lbnQgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHN1cGVyUmVmaW5lKHJlZmluZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZmluZW1lbnQocmVmaW5lbWVudCk7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKGRlZikge1xuICAgICAgICAvKiogQWxpYXMgb2Ygc2FmZVBhcnNlQXN5bmMgKi9cbiAgICAgICAgdGhpcy5zcGEgPSB0aGlzLnNhZmVQYXJzZUFzeW5jO1xuICAgICAgICB0aGlzLl9kZWYgPSBkZWY7XG4gICAgICAgIHRoaXMucGFyc2UgPSB0aGlzLnBhcnNlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc2FmZVBhcnNlID0gdGhpcy5zYWZlUGFyc2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5wYXJzZUFzeW5jID0gdGhpcy5wYXJzZUFzeW5jLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc2FmZVBhcnNlQXN5bmMgPSB0aGlzLnNhZmVQYXJzZUFzeW5jLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuc3BhID0gdGhpcy5zcGEuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5yZWZpbmUgPSB0aGlzLnJlZmluZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnJlZmluZW1lbnQgPSB0aGlzLnJlZmluZW1lbnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zdXBlclJlZmluZSA9IHRoaXMuc3VwZXJSZWZpbmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vcHRpb25hbCA9IHRoaXMub3B0aW9uYWwuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5udWxsYWJsZSA9IHRoaXMubnVsbGFibGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5udWxsaXNoID0gdGhpcy5udWxsaXNoLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYXJyYXkgPSB0aGlzLmFycmF5LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucHJvbWlzZSA9IHRoaXMucHJvbWlzZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9yID0gdGhpcy5vci5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmFuZCA9IHRoaXMuYW5kLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gdGhpcy50cmFuc2Zvcm0uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5icmFuZCA9IHRoaXMuYnJhbmQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kZWZhdWx0ID0gdGhpcy5kZWZhdWx0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuY2F0Y2ggPSB0aGlzLmNhdGNoLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuZGVzY3JpYmUgPSB0aGlzLmRlc2NyaWJlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucGlwZSA9IHRoaXMucGlwZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnJlYWRvbmx5ID0gdGhpcy5yZWFkb25seS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmlzTnVsbGFibGUgPSB0aGlzLmlzTnVsbGFibGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5pc09wdGlvbmFsID0gdGhpcy5pc09wdGlvbmFsLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXNbXCJ+c3RhbmRhcmRcIl0gPSB7XG4gICAgICAgICAgICB2ZXJzaW9uOiAxLFxuICAgICAgICAgICAgdmVuZG9yOiBcInpvZFwiLFxuICAgICAgICAgICAgdmFsaWRhdGU6IChkYXRhKSA9PiB0aGlzW1wifnZhbGlkYXRlXCJdKGRhdGEpLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBvcHRpb25hbCgpIHtcbiAgICAgICAgcmV0dXJuIFpvZE9wdGlvbmFsLmNyZWF0ZSh0aGlzLCB0aGlzLl9kZWYpO1xuICAgIH1cbiAgICBudWxsYWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIFpvZE51bGxhYmxlLmNyZWF0ZSh0aGlzLCB0aGlzLl9kZWYpO1xuICAgIH1cbiAgICBudWxsaXNoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5udWxsYWJsZSgpLm9wdGlvbmFsKCk7XG4gICAgfVxuICAgIGFycmF5KCkge1xuICAgICAgICByZXR1cm4gWm9kQXJyYXkuY3JlYXRlKHRoaXMpO1xuICAgIH1cbiAgICBwcm9taXNlKCkge1xuICAgICAgICByZXR1cm4gWm9kUHJvbWlzZS5jcmVhdGUodGhpcywgdGhpcy5fZGVmKTtcbiAgICB9XG4gICAgb3Iob3B0aW9uKSB7XG4gICAgICAgIHJldHVybiBab2RVbmlvbi5jcmVhdGUoW3RoaXMsIG9wdGlvbl0sIHRoaXMuX2RlZik7XG4gICAgfVxuICAgIGFuZChpbmNvbWluZykge1xuICAgICAgICByZXR1cm4gWm9kSW50ZXJzZWN0aW9uLmNyZWF0ZSh0aGlzLCBpbmNvbWluZywgdGhpcy5fZGVmKTtcbiAgICB9XG4gICAgdHJhbnNmb3JtKHRyYW5zZm9ybSkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZEVmZmVjdHMoe1xuICAgICAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyh0aGlzLl9kZWYpLFxuICAgICAgICAgICAgc2NoZW1hOiB0aGlzLFxuICAgICAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RFZmZlY3RzLFxuICAgICAgICAgICAgZWZmZWN0OiB7IHR5cGU6IFwidHJhbnNmb3JtXCIsIHRyYW5zZm9ybSB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGVmYXVsdChkZWYpIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlRnVuYyA9IHR5cGVvZiBkZWYgPT09IFwiZnVuY3Rpb25cIiA/IGRlZiA6ICgpID0+IGRlZjtcbiAgICAgICAgcmV0dXJuIG5ldyBab2REZWZhdWx0KHtcbiAgICAgICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXModGhpcy5fZGVmKSxcbiAgICAgICAgICAgIGlubmVyVHlwZTogdGhpcyxcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZTogZGVmYXVsdFZhbHVlRnVuYyxcbiAgICAgICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kRGVmYXVsdCxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGJyYW5kKCkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZEJyYW5kZWQoe1xuICAgICAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RCcmFuZGVkLFxuICAgICAgICAgICAgdHlwZTogdGhpcyxcbiAgICAgICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXModGhpcy5fZGVmKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNhdGNoKGRlZikge1xuICAgICAgICBjb25zdCBjYXRjaFZhbHVlRnVuYyA9IHR5cGVvZiBkZWYgPT09IFwiZnVuY3Rpb25cIiA/IGRlZiA6ICgpID0+IGRlZjtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RDYXRjaCh7XG4gICAgICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHRoaXMuX2RlZiksXG4gICAgICAgICAgICBpbm5lclR5cGU6IHRoaXMsXG4gICAgICAgICAgICBjYXRjaFZhbHVlOiBjYXRjaFZhbHVlRnVuYyxcbiAgICAgICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kQ2F0Y2gsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkZXNjcmliZShkZXNjcmlwdGlvbikge1xuICAgICAgICBjb25zdCBUaGlzID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgcmV0dXJuIG5ldyBUaGlzKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcGlwZSh0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIFpvZFBpcGVsaW5lLmNyZWF0ZSh0aGlzLCB0YXJnZXQpO1xuICAgIH1cbiAgICByZWFkb25seSgpIHtcbiAgICAgICAgcmV0dXJuIFpvZFJlYWRvbmx5LmNyZWF0ZSh0aGlzKTtcbiAgICB9XG4gICAgaXNPcHRpb25hbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2FmZVBhcnNlKHVuZGVmaW5lZCkuc3VjY2VzcztcbiAgICB9XG4gICAgaXNOdWxsYWJsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2FmZVBhcnNlKG51bGwpLnN1Y2Nlc3M7XG4gICAgfVxufVxuY29uc3QgY3VpZFJlZ2V4ID0gL15jW15cXHMtXXs4LH0kL2k7XG5jb25zdCBjdWlkMlJlZ2V4ID0gL15bMC05YS16XSskLztcbmNvbnN0IHVsaWRSZWdleCA9IC9eWzAtOUEtSEpLTU5QLVRWLVpdezI2fSQvaTtcbi8vIGNvbnN0IHV1aWRSZWdleCA9XG4vLyAgIC9eKFthLWYwLTldezh9LVthLWYwLTldezR9LVsxLTVdW2EtZjAtOV17M30tW2EtZjAtOV17NH0tW2EtZjAtOV17MTJ9fDAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCkkL2k7XG5jb25zdCB1dWlkUmVnZXggPSAvXlswLTlhLWZBLUZdezh9XFxiLVswLTlhLWZBLUZdezR9XFxiLVswLTlhLWZBLUZdezR9XFxiLVswLTlhLWZBLUZdezR9XFxiLVswLTlhLWZBLUZdezEyfSQvaTtcbmNvbnN0IG5hbm9pZFJlZ2V4ID0gL15bYS16MC05Xy1dezIxfSQvaTtcbmNvbnN0IGp3dFJlZ2V4ID0gL15bQS1aYS16MC05LV9dK1xcLltBLVphLXowLTktX10rXFwuW0EtWmEtejAtOS1fXSokLztcbmNvbnN0IGR1cmF0aW9uUmVnZXggPSAvXlstK10/UCg/ISQpKD86KD86Wy0rXT9cXGQrWSl8KD86Wy0rXT9cXGQrWy4sXVxcZCtZJCkpPyg/Oig/OlstK10/XFxkK00pfCg/OlstK10/XFxkK1suLF1cXGQrTSQpKT8oPzooPzpbLStdP1xcZCtXKXwoPzpbLStdP1xcZCtbLixdXFxkK1ckKSk/KD86KD86Wy0rXT9cXGQrRCl8KD86Wy0rXT9cXGQrWy4sXVxcZCtEJCkpPyg/OlQoPz1bXFxkKy1dKSg/Oig/OlstK10/XFxkK0gpfCg/OlstK10/XFxkK1suLF1cXGQrSCQpKT8oPzooPzpbLStdP1xcZCtNKXwoPzpbLStdP1xcZCtbLixdXFxkK00kKSk/KD86Wy0rXT9cXGQrKD86Wy4sXVxcZCspP1MpPyk/PyQvO1xuLy8gZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDYxODEvMTU1MDE1NVxuLy8gb2xkIHZlcnNpb246IHRvbyBzbG93LCBkaWRuJ3Qgc3VwcG9ydCB1bmljb2RlXG4vLyBjb25zdCBlbWFpbFJlZ2V4ID0gL14oKChbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKFxcLihbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKSopfCgoXFx4MjIpKCgoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oKFtcXHgwMS1cXHgwOFxceDBiXFx4MGNcXHgwZS1cXHgxZlxceDdmXXxcXHgyMXxbXFx4MjMtXFx4NWJdfFtcXHg1ZC1cXHg3ZV18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfChcXFxcKFtcXHgwMS1cXHgwOVxceDBiXFx4MGNcXHgwZC1cXHg3Zl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSkpKigoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oXFx4MjIpKSlAKCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKVxcLikrKChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpJC9pO1xuLy9vbGQgZW1haWwgcmVnZXhcbi8vIGNvbnN0IGVtYWlsUmVnZXggPSAvXigoW148PigpW1xcXS4sOzpcXHNAXCJdKyhcXC5bXjw+KClbXFxdLiw7Olxcc0BcIl0rKSopfChcIi4rXCIpKUAoKD8hLSkoW148PigpW1xcXS4sOzpcXHNAXCJdK1xcLikrW148PigpW1xcXS4sOzpcXHNAXCJdezEsfSlbXi08PigpW1xcXS4sOzpcXHNAXCJdJC9pO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4vLyBjb25zdCBlbWFpbFJlZ2V4ID1cbi8vICAgL14oKFtePD4oKVtcXF1cXFxcLiw7Olxcc0BcXFwiXSsoXFwuW148PigpW1xcXVxcXFwuLDs6XFxzQFxcXCJdKykqKXwoXFxcIi4rXFxcIikpQCgoXFxbKCgoMjVbMC01XSl8KDJbMC00XVswLTldKXwoMVswLTldezJ9KXwoWzAtOV17MSwyfSkpXFwuKXszfSgoMjVbMC01XSl8KDJbMC00XVswLTldKXwoMVswLTldezJ9KXwoWzAtOV17MSwyfSkpXFxdKXwoXFxbSVB2NjooKFthLWYwLTldezEsNH06KXs3fXw6OihbYS1mMC05XXsxLDR9Oil7MCw2fXwoW2EtZjAtOV17MSw0fTopezF9OihbYS1mMC05XXsxLDR9Oil7MCw1fXwoW2EtZjAtOV17MSw0fTopezJ9OihbYS1mMC05XXsxLDR9Oil7MCw0fXwoW2EtZjAtOV17MSw0fTopezN9OihbYS1mMC05XXsxLDR9Oil7MCwzfXwoW2EtZjAtOV17MSw0fTopezR9OihbYS1mMC05XXsxLDR9Oil7MCwyfXwoW2EtZjAtOV17MSw0fTopezV9OihbYS1mMC05XXsxLDR9Oil7MCwxfSkoW2EtZjAtOV17MSw0fXwoKCgyNVswLTVdKXwoMlswLTRdWzAtOV0pfCgxWzAtOV17Mn0pfChbMC05XXsxLDJ9KSlcXC4pezN9KCgyNVswLTVdKXwoMlswLTRdWzAtOV0pfCgxWzAtOV17Mn0pfChbMC05XXsxLDJ9KSkpXFxdKXwoW0EtWmEtejAtOV0oW0EtWmEtejAtOS1dKltBLVphLXowLTldKSooXFwuW0EtWmEtel17Mix9KSspKSQvO1xuLy8gY29uc3QgZW1haWxSZWdleCA9XG4vLyAgIC9eW2EtekEtWjAtOVxcLlxcIVxcI1xcJFxcJVxcJlxcJ1xcKlxcK1xcL1xcPVxcP1xcXlxcX1xcYFxce1xcfFxcfVxcflxcLV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykqJC87XG4vLyBjb25zdCBlbWFpbFJlZ2V4ID1cbi8vICAgL14oPzpbYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKD86XFwuW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKykqfFwiKD86W1xceDAxLVxceDA4XFx4MGJcXHgwY1xceDBlLVxceDFmXFx4MjFcXHgyMy1cXHg1YlxceDVkLVxceDdmXXxcXFxcW1xceDAxLVxceDA5XFx4MGJcXHgwY1xceDBlLVxceDdmXSkqXCIpQCg/Oig/OlthLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1thLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT98XFxbKD86KD86MjVbMC01XXwyWzAtNF1bMC05XXxbMDFdP1swLTldWzAtOV0/KVxcLil7M30oPzoyNVswLTVdfDJbMC00XVswLTldfFswMV0/WzAtOV1bMC05XT98W2EtejAtOS1dKlthLXowLTldOig/OltcXHgwMS1cXHgwOFxceDBiXFx4MGNcXHgwZS1cXHgxZlxceDIxLVxceDVhXFx4NTMtXFx4N2ZdfFxcXFxbXFx4MDEtXFx4MDlcXHgwYlxceDBjXFx4MGUtXFx4N2ZdKSspXFxdKSQvaTtcbmNvbnN0IGVtYWlsUmVnZXggPSAvXig/IVxcLikoPyEuKlxcLlxcLikoW0EtWjAtOV8nK1xcLVxcLl0qKVtBLVowLTlfKy1dQChbQS1aMC05XVtBLVowLTlcXC1dKlxcLikrW0EtWl17Mix9JC9pO1xuLy8gY29uc3QgZW1haWxSZWdleCA9XG4vLyAgIC9eW2EtejAtOS4hIyQlJuKAmSorLz0/Xl9ge3x9fi1dK0BbYS16MC05LV0rKD86XFwuW2EtejAtOVxcLV0rKSokL2k7XG4vLyBmcm9tIGh0dHBzOi8vdGhla2V2aW5zY290dC5jb20vZW1vamlzLWluLWphdmFzY3JpcHQvI3dyaXRpbmctYS1yZWd1bGFyLWV4cHJlc3Npb25cbmNvbnN0IF9lbW9qaVJlZ2V4ID0gYF4oXFxcXHB7RXh0ZW5kZWRfUGljdG9ncmFwaGljfXxcXFxccHtFbW9qaV9Db21wb25lbnR9KSskYDtcbmxldCBlbW9qaVJlZ2V4O1xuLy8gZmFzdGVyLCBzaW1wbGVyLCBzYWZlclxuY29uc3QgaXB2NFJlZ2V4ID0gL14oPzooPzoyNVswLTVdfDJbMC00XVswLTldfDFbMC05XVswLTldfFsxLTldWzAtOV18WzAtOV0pXFwuKXszfSg/OjI1WzAtNV18MlswLTRdWzAtOV18MVswLTldWzAtOV18WzEtOV1bMC05XXxbMC05XSkkLztcbmNvbnN0IGlwdjRDaWRyUmVnZXggPSAvXig/Oig/OjI1WzAtNV18MlswLTRdWzAtOV18MVswLTldWzAtOV18WzEtOV1bMC05XXxbMC05XSlcXC4pezN9KD86MjVbMC01XXwyWzAtNF1bMC05XXwxWzAtOV1bMC05XXxbMS05XVswLTldfFswLTldKVxcLygzWzAtMl18WzEyXT9bMC05XSkkLztcbi8vIGNvbnN0IGlwdjZSZWdleCA9XG4vLyAvXigoW2EtZjAtOV17MSw0fTopezd9fDo6KFthLWYwLTldezEsNH06KXswLDZ9fChbYS1mMC05XXsxLDR9Oil7MX06KFthLWYwLTldezEsNH06KXswLDV9fChbYS1mMC05XXsxLDR9Oil7Mn06KFthLWYwLTldezEsNH06KXswLDR9fChbYS1mMC05XXsxLDR9Oil7M306KFthLWYwLTldezEsNH06KXswLDN9fChbYS1mMC05XXsxLDR9Oil7NH06KFthLWYwLTldezEsNH06KXswLDJ9fChbYS1mMC05XXsxLDR9Oil7NX06KFthLWYwLTldezEsNH06KXswLDF9KShbYS1mMC05XXsxLDR9fCgoKDI1WzAtNV0pfCgyWzAtNF1bMC05XSl8KDFbMC05XXsyfSl8KFswLTldezEsMn0pKVxcLil7M30oKDI1WzAtNV0pfCgyWzAtNF1bMC05XSl8KDFbMC05XXsyfSl8KFswLTldezEsMn0pKSkkLztcbmNvbnN0IGlwdjZSZWdleCA9IC9eKChbMC05YS1mQS1GXXsxLDR9Oil7Nyw3fVswLTlhLWZBLUZdezEsNH18KFswLTlhLWZBLUZdezEsNH06KXsxLDd9OnwoWzAtOWEtZkEtRl17MSw0fTopezEsNn06WzAtOWEtZkEtRl17MSw0fXwoWzAtOWEtZkEtRl17MSw0fTopezEsNX0oOlswLTlhLWZBLUZdezEsNH0pezEsMn18KFswLTlhLWZBLUZdezEsNH06KXsxLDR9KDpbMC05YS1mQS1GXXsxLDR9KXsxLDN9fChbMC05YS1mQS1GXXsxLDR9Oil7MSwzfSg6WzAtOWEtZkEtRl17MSw0fSl7MSw0fXwoWzAtOWEtZkEtRl17MSw0fTopezEsMn0oOlswLTlhLWZBLUZdezEsNH0pezEsNX18WzAtOWEtZkEtRl17MSw0fTooKDpbMC05YS1mQS1GXXsxLDR9KXsxLDZ9KXw6KCg6WzAtOWEtZkEtRl17MSw0fSl7MSw3fXw6KXxmZTgwOig6WzAtOWEtZkEtRl17MCw0fSl7MCw0fSVbMC05YS16QS1aXXsxLH18OjooZmZmZig6MHsxLDR9KXswLDF9Oil7MCwxfSgoMjVbMC01XXwoMlswLTRdfDF7MCwxfVswLTldKXswLDF9WzAtOV0pXFwuKXszLDN9KDI1WzAtNV18KDJbMC00XXwxezAsMX1bMC05XSl7MCwxfVswLTldKXwoWzAtOWEtZkEtRl17MSw0fTopezEsNH06KCgyNVswLTVdfCgyWzAtNF18MXswLDF9WzAtOV0pezAsMX1bMC05XSlcXC4pezMsM30oMjVbMC01XXwoMlswLTRdfDF7MCwxfVswLTldKXswLDF9WzAtOV0pKSQvO1xuY29uc3QgaXB2NkNpZHJSZWdleCA9IC9eKChbMC05YS1mQS1GXXsxLDR9Oil7Nyw3fVswLTlhLWZBLUZdezEsNH18KFswLTlhLWZBLUZdezEsNH06KXsxLDd9OnwoWzAtOWEtZkEtRl17MSw0fTopezEsNn06WzAtOWEtZkEtRl17MSw0fXwoWzAtOWEtZkEtRl17MSw0fTopezEsNX0oOlswLTlhLWZBLUZdezEsNH0pezEsMn18KFswLTlhLWZBLUZdezEsNH06KXsxLDR9KDpbMC05YS1mQS1GXXsxLDR9KXsxLDN9fChbMC05YS1mQS1GXXsxLDR9Oil7MSwzfSg6WzAtOWEtZkEtRl17MSw0fSl7MSw0fXwoWzAtOWEtZkEtRl17MSw0fTopezEsMn0oOlswLTlhLWZBLUZdezEsNH0pezEsNX18WzAtOWEtZkEtRl17MSw0fTooKDpbMC05YS1mQS1GXXsxLDR9KXsxLDZ9KXw6KCg6WzAtOWEtZkEtRl17MSw0fSl7MSw3fXw6KXxmZTgwOig6WzAtOWEtZkEtRl17MCw0fSl7MCw0fSVbMC05YS16QS1aXXsxLH18OjooZmZmZig6MHsxLDR9KXswLDF9Oil7MCwxfSgoMjVbMC01XXwoMlswLTRdfDF7MCwxfVswLTldKXswLDF9WzAtOV0pXFwuKXszLDN9KDI1WzAtNV18KDJbMC00XXwxezAsMX1bMC05XSl7MCwxfVswLTldKXwoWzAtOWEtZkEtRl17MSw0fTopezEsNH06KCgyNVswLTVdfCgyWzAtNF18MXswLDF9WzAtOV0pezAsMX1bMC05XSlcXC4pezMsM30oMjVbMC01XXwoMlswLTRdfDF7MCwxfVswLTldKXswLDF9WzAtOV0pKVxcLygxMlswLThdfDFbMDFdWzAtOV18WzEtOV0/WzAtOV0pJC87XG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83ODYwMzkyL2RldGVybWluZS1pZi1zdHJpbmctaXMtaW4tYmFzZTY0LXVzaW5nLWphdmFzY3JpcHRcbmNvbnN0IGJhc2U2NFJlZ2V4ID0gL14oWzAtOWEtekEtWisvXXs0fSkqKChbMC05YS16QS1aKy9dezJ9PT0pfChbMC05YS16QS1aKy9dezN9PSkpPyQvO1xuLy8gaHR0cHM6Ly9iYXNlNjQuZ3VydS9zdGFuZGFyZHMvYmFzZTY0dXJsXG5jb25zdCBiYXNlNjR1cmxSZWdleCA9IC9eKFswLTlhLXpBLVotX117NH0pKigoWzAtOWEtekEtWi1fXXsyfSg9PSk/KXwoWzAtOWEtekEtWi1fXXszfSg9KT8pKT8kLztcbi8vIHNpbXBsZVxuLy8gY29uc3QgZGF0ZVJlZ2V4U291cmNlID0gYFxcXFxkezR9LVxcXFxkezJ9LVxcXFxkezJ9YDtcbi8vIG5vIGxlYXAgeWVhciB2YWxpZGF0aW9uXG4vLyBjb25zdCBkYXRlUmVnZXhTb3VyY2UgPSBgXFxcXGR7NH0tKCgwWzEzNTc4XXwxMHwxMiktMzF8KDBbMTMtOV18MVswLTJdKS0zMHwoMFsxLTldfDFbMC0yXSktKDBbMS05XXwxXFxcXGR8MlxcXFxkKSlgO1xuLy8gd2l0aCBsZWFwIHllYXIgdmFsaWRhdGlvblxuY29uc3QgZGF0ZVJlZ2V4U291cmNlID0gYCgoXFxcXGRcXFxcZFsyNDY4XVswNDhdfFxcXFxkXFxcXGRbMTM1NzldWzI2XXxcXFxcZFxcXFxkMFs0OF18WzAyNDY4XVswNDhdMDB8WzEzNTc5XVsyNl0wMCktMDItMjl8XFxcXGR7NH0tKCgwWzEzNTc4XXwxWzAyXSktKDBbMS05XXxbMTJdXFxcXGR8M1swMV0pfCgwWzQ2OV18MTEpLSgwWzEtOV18WzEyXVxcXFxkfDMwKXwoMDIpLSgwWzEtOV18MVxcXFxkfDJbMC04XSkpKWA7XG5jb25zdCBkYXRlUmVnZXggPSBuZXcgUmVnRXhwKGBeJHtkYXRlUmVnZXhTb3VyY2V9JGApO1xuZnVuY3Rpb24gdGltZVJlZ2V4U291cmNlKGFyZ3MpIHtcbiAgICBsZXQgc2Vjb25kc1JlZ2V4U291cmNlID0gYFswLTVdXFxcXGRgO1xuICAgIGlmIChhcmdzLnByZWNpc2lvbikge1xuICAgICAgICBzZWNvbmRzUmVnZXhTb3VyY2UgPSBgJHtzZWNvbmRzUmVnZXhTb3VyY2V9XFxcXC5cXFxcZHske2FyZ3MucHJlY2lzaW9ufX1gO1xuICAgIH1cbiAgICBlbHNlIGlmIChhcmdzLnByZWNpc2lvbiA9PSBudWxsKSB7XG4gICAgICAgIHNlY29uZHNSZWdleFNvdXJjZSA9IGAke3NlY29uZHNSZWdleFNvdXJjZX0oXFxcXC5cXFxcZCspP2A7XG4gICAgfVxuICAgIGNvbnN0IHNlY29uZHNRdWFudGlmaWVyID0gYXJncy5wcmVjaXNpb24gPyBcIitcIiA6IFwiP1wiOyAvLyByZXF1aXJlIHNlY29uZHMgaWYgcHJlY2lzaW9uIGlzIG5vbnplcm9cbiAgICByZXR1cm4gYChbMDFdXFxcXGR8MlswLTNdKTpbMC01XVxcXFxkKDoke3NlY29uZHNSZWdleFNvdXJjZX0pJHtzZWNvbmRzUXVhbnRpZmllcn1gO1xufVxuZnVuY3Rpb24gdGltZVJlZ2V4KGFyZ3MpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChgXiR7dGltZVJlZ2V4U291cmNlKGFyZ3MpfSRgKTtcbn1cbi8vIEFkYXB0ZWQgZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMzE0MzIzMVxuZXhwb3J0IGZ1bmN0aW9uIGRhdGV0aW1lUmVnZXgoYXJncykge1xuICAgIGxldCByZWdleCA9IGAke2RhdGVSZWdleFNvdXJjZX1UJHt0aW1lUmVnZXhTb3VyY2UoYXJncyl9YDtcbiAgICBjb25zdCBvcHRzID0gW107XG4gICAgb3B0cy5wdXNoKGFyZ3MubG9jYWwgPyBgWj9gIDogYFpgKTtcbiAgICBpZiAoYXJncy5vZmZzZXQpXG4gICAgICAgIG9wdHMucHVzaChgKFsrLV1cXFxcZHsyfTo/XFxcXGR7Mn0pYCk7XG4gICAgcmVnZXggPSBgJHtyZWdleH0oJHtvcHRzLmpvaW4oXCJ8XCIpfSlgO1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGBeJHtyZWdleH0kYCk7XG59XG5mdW5jdGlvbiBpc1ZhbGlkSVAoaXAsIHZlcnNpb24pIHtcbiAgICBpZiAoKHZlcnNpb24gPT09IFwidjRcIiB8fCAhdmVyc2lvbikgJiYgaXB2NFJlZ2V4LnRlc3QoaXApKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoKHZlcnNpb24gPT09IFwidjZcIiB8fCAhdmVyc2lvbikgJiYgaXB2NlJlZ2V4LnRlc3QoaXApKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBpc1ZhbGlkSldUKGp3dCwgYWxnKSB7XG4gICAgaWYgKCFqd3RSZWdleC50ZXN0KGp3dCkpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBbaGVhZGVyXSA9IGp3dC5zcGxpdChcIi5cIik7XG4gICAgICAgIGlmICghaGVhZGVyKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAvLyBDb252ZXJ0IGJhc2U2NHVybCB0byBiYXNlNjRcbiAgICAgICAgY29uc3QgYmFzZTY0ID0gaGVhZGVyXG4gICAgICAgICAgICAucmVwbGFjZSgvLS9nLCBcIitcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9fL2csIFwiL1wiKVxuICAgICAgICAgICAgLnBhZEVuZChoZWFkZXIubGVuZ3RoICsgKCg0IC0gKGhlYWRlci5sZW5ndGggJSA0KSkgJSA0KSwgXCI9XCIpO1xuICAgICAgICBjb25zdCBkZWNvZGVkID0gSlNPTi5wYXJzZShhdG9iKGJhc2U2NCkpO1xuICAgICAgICBpZiAodHlwZW9mIGRlY29kZWQgIT09IFwib2JqZWN0XCIgfHwgZGVjb2RlZCA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKFwidHlwXCIgaW4gZGVjb2RlZCAmJiBkZWNvZGVkPy50eXAgIT09IFwiSldUXCIpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICghZGVjb2RlZC5hbGcpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChhbGcgJiYgZGVjb2RlZC5hbGcgIT09IGFsZylcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzVmFsaWRDaWRyKGlwLCB2ZXJzaW9uKSB7XG4gICAgaWYgKCh2ZXJzaW9uID09PSBcInY0XCIgfHwgIXZlcnNpb24pICYmIGlwdjRDaWRyUmVnZXgudGVzdChpcCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICgodmVyc2lvbiA9PT0gXCJ2NlwiIHx8ICF2ZXJzaW9uKSAmJiBpcHY2Q2lkclJlZ2V4LnRlc3QoaXApKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnQgY2xhc3MgWm9kU3RyaW5nIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGlmICh0aGlzLl9kZWYuY29lcmNlKSB7XG4gICAgICAgICAgICBpbnB1dC5kYXRhID0gU3RyaW5nKGlucHV0LmRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUuc3RyaW5nKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLnN0cmluZyxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IG5ldyBQYXJzZVN0YXR1cygpO1xuICAgICAgICBsZXQgY3R4ID0gdW5kZWZpbmVkO1xuICAgICAgICBmb3IgKGNvbnN0IGNoZWNrIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaGVjay5raW5kID09PSBcIm1pblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LmRhdGEubGVuZ3RoIDwgY2hlY2sudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19zbWFsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW06IGNoZWNrLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcIm1heFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LmRhdGEubGVuZ3RoID4gY2hlY2sudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19iaWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiBjaGVjay52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBleGFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJsZW5ndGhcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvb0JpZyA9IGlucHV0LmRhdGEubGVuZ3RoID4gY2hlY2sudmFsdWU7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9vU21hbGwgPSBpbnB1dC5kYXRhLmxlbmd0aCA8IGNoZWNrLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0b29CaWcgfHwgdG9vU21hbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b29CaWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fYmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heGltdW06IGNoZWNrLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0b29TbWFsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19zbWFsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiBjaGVjay52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJlbWFpbFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlbWFpbFJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJlbWFpbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiZW1vamlcIikge1xuICAgICAgICAgICAgICAgIGlmICghZW1vamlSZWdleCkge1xuICAgICAgICAgICAgICAgICAgICBlbW9qaVJlZ2V4ID0gbmV3IFJlZ0V4cChfZW1vamlSZWdleCwgXCJ1XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWVtb2ppUmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcImVtb2ppXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJ1dWlkXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXV1aWRSZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwidXVpZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwibmFub2lkXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW5hbm9pZFJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJuYW5vaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImN1aWRcIikge1xuICAgICAgICAgICAgICAgIGlmICghY3VpZFJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJjdWlkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJjdWlkMlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjdWlkMlJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJjdWlkMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwidWxpZFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF1bGlkUmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcInVsaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcInVybFwiKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgbmV3IFVSTChpbnB1dC5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcInVybFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwicmVnZXhcIikge1xuICAgICAgICAgICAgICAgIGNoZWNrLnJlZ2V4Lmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdFJlc3VsdCA9IGNoZWNrLnJlZ2V4LnRlc3QoaW5wdXQuZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKCF0ZXN0UmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwicmVnZXhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcInRyaW1cIikge1xuICAgICAgICAgICAgICAgIGlucHV0LmRhdGEgPSBpbnB1dC5kYXRhLnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiaW5jbHVkZXNcIikge1xuICAgICAgICAgICAgICAgIGlmICghaW5wdXQuZGF0YS5pbmNsdWRlcyhjaGVjay52YWx1ZSwgY2hlY2sucG9zaXRpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IHsgaW5jbHVkZXM6IGNoZWNrLnZhbHVlLCBwb3NpdGlvbjogY2hlY2sucG9zaXRpb24gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcInRvTG93ZXJDYXNlXCIpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5kYXRhID0gaW5wdXQuZGF0YS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJ0b1VwcGVyQ2FzZVwiKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuZGF0YSA9IGlucHV0LmRhdGEudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwic3RhcnRzV2l0aFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC5kYXRhLnN0YXJ0c1dpdGgoY2hlY2sudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IHsgc3RhcnRzV2l0aDogY2hlY2sudmFsdWUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImVuZHNXaXRoXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmRhdGEuZW5kc1dpdGgoY2hlY2sudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IHsgZW5kc1dpdGg6IGNoZWNrLnZhbHVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJkYXRldGltZVwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXggPSBkYXRldGltZVJlZ2V4KGNoZWNrKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJkYXRldGltZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiZGF0ZVwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXggPSBkYXRlUmVnZXg7XG4gICAgICAgICAgICAgICAgaWYgKCFyZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwidGltZVwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXggPSB0aW1lUmVnZXgoY2hlY2spO1xuICAgICAgICAgICAgICAgIGlmICghcmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcInRpbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImR1cmF0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWR1cmF0aW9uUmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcImR1cmF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJpcFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkSVAoaW5wdXQuZGF0YSwgY2hlY2sudmVyc2lvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJpcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiand0XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWRKV1QoaW5wdXQuZGF0YSwgY2hlY2suYWxnKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcImp3dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiY2lkclwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkQ2lkcihpbnB1dC5kYXRhLCBjaGVjay52ZXJzaW9uKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcImNpZHJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImJhc2U2NFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFiYXNlNjRSZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwiYmFzZTY0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJiYXNlNjR1cmxcIikge1xuICAgICAgICAgICAgICAgIGlmICghYmFzZTY0dXJsUmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcImJhc2U2NHVybFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHV0aWwuYXNzZXJ0TmV2ZXIoY2hlY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLnZhbHVlLCB2YWx1ZTogaW5wdXQuZGF0YSB9O1xuICAgIH1cbiAgICBfcmVnZXgocmVnZXgsIHZhbGlkYXRpb24sIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVmaW5lbWVudCgoZGF0YSkgPT4gcmVnZXgudGVzdChkYXRhKSwge1xuICAgICAgICAgICAgdmFsaWRhdGlvbixcbiAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9hZGRDaGVjayhjaGVjaykge1xuICAgICAgICByZXR1cm4gbmV3IFpvZFN0cmluZyh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBjaGVja3M6IFsuLi50aGlzLl9kZWYuY2hlY2tzLCBjaGVja10sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbWFpbChtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwiZW1haWxcIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpIH0pO1xuICAgIH1cbiAgICB1cmwobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcInVybFwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSkgfSk7XG4gICAgfVxuICAgIGVtb2ppKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJlbW9qaVwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSkgfSk7XG4gICAgfVxuICAgIHV1aWQobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcInV1aWRcIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpIH0pO1xuICAgIH1cbiAgICBuYW5vaWQobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcIm5hbm9pZFwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSkgfSk7XG4gICAgfVxuICAgIGN1aWQobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcImN1aWRcIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpIH0pO1xuICAgIH1cbiAgICBjdWlkMihtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwiY3VpZDJcIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpIH0pO1xuICAgIH1cbiAgICB1bGlkKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJ1bGlkXCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSB9KTtcbiAgICB9XG4gICAgYmFzZTY0KG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJiYXNlNjRcIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpIH0pO1xuICAgIH1cbiAgICBiYXNlNjR1cmwobWVzc2FnZSkge1xuICAgICAgICAvLyBiYXNlNjR1cmwgZW5jb2RpbmcgaXMgYSBtb2RpZmljYXRpb24gb2YgYmFzZTY0IHRoYXQgY2FuIHNhZmVseSBiZSB1c2VkIGluIFVSTHMgYW5kIGZpbGVuYW1lc1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJiYXNlNjR1cmxcIixcbiAgICAgICAgICAgIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGp3dChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwiand0XCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihvcHRpb25zKSB9KTtcbiAgICB9XG4gICAgaXAob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcImlwXCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihvcHRpb25zKSB9KTtcbiAgICB9XG4gICAgY2lkcihvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwiY2lkclwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoob3B0aW9ucykgfSk7XG4gICAgfVxuICAgIGRhdGV0aW1lKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAgICAgIGtpbmQ6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IG51bGwsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBsb2NhbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogb3B0aW9ucyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICBwcmVjaXNpb246IHR5cGVvZiBvcHRpb25zPy5wcmVjaXNpb24gPT09IFwidW5kZWZpbmVkXCIgPyBudWxsIDogb3B0aW9ucz8ucHJlY2lzaW9uLFxuICAgICAgICAgICAgb2Zmc2V0OiBvcHRpb25zPy5vZmZzZXQgPz8gZmFsc2UsXG4gICAgICAgICAgICBsb2NhbDogb3B0aW9ucz8ubG9jYWwgPz8gZmFsc2UsXG4gICAgICAgICAgICAuLi5lcnJvclV0aWwuZXJyVG9PYmoob3B0aW9ucz8ubWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkYXRlKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJkYXRlXCIsIG1lc3NhZ2UgfSk7XG4gICAgfVxuICAgIHRpbWUob3B0aW9ucykge1xuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICAgICAga2luZDogXCJ0aW1lXCIsXG4gICAgICAgICAgICAgICAgcHJlY2lzaW9uOiBudWxsLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG9wdGlvbnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJ0aW1lXCIsXG4gICAgICAgICAgICBwcmVjaXNpb246IHR5cGVvZiBvcHRpb25zPy5wcmVjaXNpb24gPT09IFwidW5kZWZpbmVkXCIgPyBudWxsIDogb3B0aW9ucz8ucHJlY2lzaW9uLFxuICAgICAgICAgICAgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG9wdGlvbnM/Lm1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZHVyYXRpb24obWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcImR1cmF0aW9uXCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSB9KTtcbiAgICB9XG4gICAgcmVnZXgocmVnZXgsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwicmVnZXhcIixcbiAgICAgICAgICAgIHJlZ2V4OiByZWdleCxcbiAgICAgICAgICAgIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGluY2x1ZGVzKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcImluY2x1ZGVzXCIsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBwb3NpdGlvbjogb3B0aW9ucz8ucG9zaXRpb24sXG4gICAgICAgICAgICAuLi5lcnJvclV0aWwuZXJyVG9PYmoob3B0aW9ucz8ubWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdGFydHNXaXRoKHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcInN0YXJ0c1dpdGhcIixcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVuZHNXaXRoKHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcImVuZHNXaXRoXCIsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBtaW4obWluTGVuZ3RoLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1pblwiLFxuICAgICAgICAgICAgdmFsdWU6IG1pbkxlbmd0aCxcbiAgICAgICAgICAgIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG1heChtYXhMZW5ndGgsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWF4XCIsXG4gICAgICAgICAgICB2YWx1ZTogbWF4TGVuZ3RoLFxuICAgICAgICAgICAgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbGVuZ3RoKGxlbiwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJsZW5ndGhcIixcbiAgICAgICAgICAgIHZhbHVlOiBsZW4sXG4gICAgICAgICAgICAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFcXVpdmFsZW50IHRvIGAubWluKDEpYFxuICAgICAqL1xuICAgIG5vbmVtcHR5KG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWluKDEsIGVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSk7XG4gICAgfVxuICAgIHRyaW0oKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kU3RyaW5nKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGNoZWNrczogWy4uLnRoaXMuX2RlZi5jaGVja3MsIHsga2luZDogXCJ0cmltXCIgfV0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB0b0xvd2VyQ2FzZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RTdHJpbmcoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgY2hlY2tzOiBbLi4udGhpcy5fZGVmLmNoZWNrcywgeyBraW5kOiBcInRvTG93ZXJDYXNlXCIgfV0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB0b1VwcGVyQ2FzZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RTdHJpbmcoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgY2hlY2tzOiBbLi4udGhpcy5fZGVmLmNoZWNrcywgeyBraW5kOiBcInRvVXBwZXJDYXNlXCIgfV0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgaXNEYXRldGltZSgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJkYXRldGltZVwiKTtcbiAgICB9XG4gICAgZ2V0IGlzRGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJkYXRlXCIpO1xuICAgIH1cbiAgICBnZXQgaXNUaW1lKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcInRpbWVcIik7XG4gICAgfVxuICAgIGdldCBpc0R1cmF0aW9uKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcImR1cmF0aW9uXCIpO1xuICAgIH1cbiAgICBnZXQgaXNFbWFpbCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJlbWFpbFwiKTtcbiAgICB9XG4gICAgZ2V0IGlzVVJMKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcInVybFwiKTtcbiAgICB9XG4gICAgZ2V0IGlzRW1vamkoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwiZW1vamlcIik7XG4gICAgfVxuICAgIGdldCBpc1VVSUQoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwidXVpZFwiKTtcbiAgICB9XG4gICAgZ2V0IGlzTkFOT0lEKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcIm5hbm9pZFwiKTtcbiAgICB9XG4gICAgZ2V0IGlzQ1VJRCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJjdWlkXCIpO1xuICAgIH1cbiAgICBnZXQgaXNDVUlEMigpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJjdWlkMlwiKTtcbiAgICB9XG4gICAgZ2V0IGlzVUxJRCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJ1bGlkXCIpO1xuICAgIH1cbiAgICBnZXQgaXNJUCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJpcFwiKTtcbiAgICB9XG4gICAgZ2V0IGlzQ0lEUigpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJjaWRyXCIpO1xuICAgIH1cbiAgICBnZXQgaXNCYXNlNjQoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwiYmFzZTY0XCIpO1xuICAgIH1cbiAgICBnZXQgaXNCYXNlNjR1cmwoKSB7XG4gICAgICAgIC8vIGJhc2U2NHVybCBlbmNvZGluZyBpcyBhIG1vZGlmaWNhdGlvbiBvZiBiYXNlNjQgdGhhdCBjYW4gc2FmZWx5IGJlIHVzZWQgaW4gVVJMcyBhbmQgZmlsZW5hbWVzXG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwiYmFzZTY0dXJsXCIpO1xuICAgIH1cbiAgICBnZXQgbWluTGVuZ3RoKCkge1xuICAgICAgICBsZXQgbWluID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBjaCBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2gua2luZCA9PT0gXCJtaW5cIikge1xuICAgICAgICAgICAgICAgIGlmIChtaW4gPT09IG51bGwgfHwgY2gudmFsdWUgPiBtaW4pXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGNoLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW47XG4gICAgfVxuICAgIGdldCBtYXhMZW5ndGgoKSB7XG4gICAgICAgIGxldCBtYXggPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGNoIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaC5raW5kID09PSBcIm1heFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1heCA9PT0gbnVsbCB8fCBjaC52YWx1ZSA8IG1heClcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gY2gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1heDtcbiAgICB9XG59XG5ab2RTdHJpbmcuY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kU3RyaW5nKHtcbiAgICAgICAgY2hlY2tzOiBbXSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RTdHJpbmcsXG4gICAgICAgIGNvZXJjZTogcGFyYW1zPy5jb2VyY2UgPz8gZmFsc2UsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zOTY2NDg0L3doeS1kb2VzLW1vZHVsdXMtb3BlcmF0b3ItcmV0dXJuLWZyYWN0aW9uYWwtbnVtYmVyLWluLWphdmFzY3JpcHQvMzE3MTEwMzQjMzE3MTEwMzRcbmZ1bmN0aW9uIGZsb2F0U2FmZVJlbWFpbmRlcih2YWwsIHN0ZXApIHtcbiAgICBjb25zdCB2YWxEZWNDb3VudCA9ICh2YWwudG9TdHJpbmcoKS5zcGxpdChcIi5cIilbMV0gfHwgXCJcIikubGVuZ3RoO1xuICAgIGNvbnN0IHN0ZXBEZWNDb3VudCA9IChzdGVwLnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpWzFdIHx8IFwiXCIpLmxlbmd0aDtcbiAgICBjb25zdCBkZWNDb3VudCA9IHZhbERlY0NvdW50ID4gc3RlcERlY0NvdW50ID8gdmFsRGVjQ291bnQgOiBzdGVwRGVjQ291bnQ7XG4gICAgY29uc3QgdmFsSW50ID0gTnVtYmVyLnBhcnNlSW50KHZhbC50b0ZpeGVkKGRlY0NvdW50KS5yZXBsYWNlKFwiLlwiLCBcIlwiKSk7XG4gICAgY29uc3Qgc3RlcEludCA9IE51bWJlci5wYXJzZUludChzdGVwLnRvRml4ZWQoZGVjQ291bnQpLnJlcGxhY2UoXCIuXCIsIFwiXCIpKTtcbiAgICByZXR1cm4gKHZhbEludCAlIHN0ZXBJbnQpIC8gMTAgKiogZGVjQ291bnQ7XG59XG5leHBvcnQgY2xhc3MgWm9kTnVtYmVyIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMubWluID0gdGhpcy5ndGU7XG4gICAgICAgIHRoaXMubWF4ID0gdGhpcy5sdGU7XG4gICAgICAgIHRoaXMuc3RlcCA9IHRoaXMubXVsdGlwbGVPZjtcbiAgICB9XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGlmICh0aGlzLl9kZWYuY29lcmNlKSB7XG4gICAgICAgICAgICBpbnB1dC5kYXRhID0gTnVtYmVyKGlucHV0LmRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLm51bWJlcixcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjdHggPSB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IG5ldyBQYXJzZVN0YXR1cygpO1xuICAgICAgICBmb3IgKGNvbnN0IGNoZWNrIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaGVjay5raW5kID09PSBcImludFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF1dGlsLmlzSW50ZWdlcihpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFwiaW50ZWdlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IFwiZmxvYXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcIm1pblwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9vU21hbGwgPSBjaGVjay5pbmNsdXNpdmUgPyBpbnB1dC5kYXRhIDwgY2hlY2sudmFsdWUgOiBpbnB1dC5kYXRhIDw9IGNoZWNrLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0b29TbWFsbCkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX3NtYWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogY2hlY2sudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiBjaGVjay5pbmNsdXNpdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBleGFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJtYXhcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvb0JpZyA9IGNoZWNrLmluY2x1c2l2ZSA/IGlucHV0LmRhdGEgPiBjaGVjay52YWx1ZSA6IGlucHV0LmRhdGEgPj0gY2hlY2sudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRvb0JpZykge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX2JpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heGltdW06IGNoZWNrLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogY2hlY2suaW5jbHVzaXZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwibXVsdGlwbGVPZlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZsb2F0U2FmZVJlbWFpbmRlcihpbnB1dC5kYXRhLCBjaGVjay52YWx1ZSkgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLm5vdF9tdWx0aXBsZV9vZixcbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpcGxlT2Y6IGNoZWNrLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiZmluaXRlXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUubm90X2Zpbml0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB1dGlsLmFzc2VydE5ldmVyKGNoZWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cy52YWx1ZSwgdmFsdWU6IGlucHV0LmRhdGEgfTtcbiAgICB9XG4gICAgZ3RlKHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldExpbWl0KFwibWluXCIsIHZhbHVlLCB0cnVlLCBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkpO1xuICAgIH1cbiAgICBndCh2YWx1ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRMaW1pdChcIm1pblwiLCB2YWx1ZSwgZmFsc2UsIGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSk7XG4gICAgfVxuICAgIGx0ZSh2YWx1ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRMaW1pdChcIm1heFwiLCB2YWx1ZSwgdHJ1ZSwgZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpKTtcbiAgICB9XG4gICAgbHQodmFsdWUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TGltaXQoXCJtYXhcIiwgdmFsdWUsIGZhbHNlLCBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkpO1xuICAgIH1cbiAgICBzZXRMaW1pdChraW5kLCB2YWx1ZSwgaW5jbHVzaXZlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kTnVtYmVyKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGNoZWNrczogW1xuICAgICAgICAgICAgICAgIC4uLnRoaXMuX2RlZi5jaGVja3MsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBraW5kLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfYWRkQ2hlY2soY2hlY2spIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2ROdW1iZXIoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgY2hlY2tzOiBbLi4udGhpcy5fZGVmLmNoZWNrcywgY2hlY2tdLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaW50KG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwiaW50XCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwb3NpdGl2ZShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1pblwiLFxuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICBpbmNsdXNpdmU6IGZhbHNlLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbmVnYXRpdmUobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtYXhcIixcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiBmYWxzZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5vbnBvc2l0aXZlKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWF4XCIsXG4gICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5vbm5lZ2F0aXZlKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWluXCIsXG4gICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG11bHRpcGxlT2YodmFsdWUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibXVsdGlwbGVPZlwiLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZmluaXRlKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwiZmluaXRlXCIsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzYWZlKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWluXCIsXG4gICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVIsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1heFwiLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IG1pblZhbHVlKCkge1xuICAgICAgICBsZXQgbWluID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBjaCBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2gua2luZCA9PT0gXCJtaW5cIikge1xuICAgICAgICAgICAgICAgIGlmIChtaW4gPT09IG51bGwgfHwgY2gudmFsdWUgPiBtaW4pXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGNoLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW47XG4gICAgfVxuICAgIGdldCBtYXhWYWx1ZSgpIHtcbiAgICAgICAgbGV0IG1heCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgY2ggb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoLmtpbmQgPT09IFwibWF4XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF4ID09PSBudWxsIHx8IGNoLnZhbHVlIDwgbWF4KVxuICAgICAgICAgICAgICAgICAgICBtYXggPSBjaC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF4O1xuICAgIH1cbiAgICBnZXQgaXNJbnQoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwiaW50XCIgfHwgKGNoLmtpbmQgPT09IFwibXVsdGlwbGVPZlwiICYmIHV0aWwuaXNJbnRlZ2VyKGNoLnZhbHVlKSkpO1xuICAgIH1cbiAgICBnZXQgaXNGaW5pdGUoKSB7XG4gICAgICAgIGxldCBtYXggPSBudWxsO1xuICAgICAgICBsZXQgbWluID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBjaCBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2gua2luZCA9PT0gXCJmaW5pdGVcIiB8fCBjaC5raW5kID09PSBcImludFwiIHx8IGNoLmtpbmQgPT09IFwibXVsdGlwbGVPZlwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaC5raW5kID09PSBcIm1pblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1pbiA9PT0gbnVsbCB8fCBjaC52YWx1ZSA+IG1pbilcbiAgICAgICAgICAgICAgICAgICAgbWluID0gY2gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaC5raW5kID09PSBcIm1heFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1heCA9PT0gbnVsbCB8fCBjaC52YWx1ZSA8IG1heClcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gY2gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShtaW4pICYmIE51bWJlci5pc0Zpbml0ZShtYXgpO1xuICAgIH1cbn1cblpvZE51bWJlci5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2ROdW1iZXIoe1xuICAgICAgICBjaGVja3M6IFtdLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE51bWJlcixcbiAgICAgICAgY29lcmNlOiBwYXJhbXM/LmNvZXJjZSB8fCBmYWxzZSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RCaWdJbnQgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5taW4gPSB0aGlzLmd0ZTtcbiAgICAgICAgdGhpcy5tYXggPSB0aGlzLmx0ZTtcbiAgICB9XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGlmICh0aGlzLl9kZWYuY29lcmNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlucHV0LmRhdGEgPSBCaWdJbnQoaW5wdXQuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldEludmFsaWRJbnB1dChpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5iaWdpbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRJbnZhbGlkSW5wdXQoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjdHggPSB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IG5ldyBQYXJzZVN0YXR1cygpO1xuICAgICAgICBmb3IgKGNvbnN0IGNoZWNrIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaGVjay5raW5kID09PSBcIm1pblwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9vU21hbGwgPSBjaGVjay5pbmNsdXNpdmUgPyBpbnB1dC5kYXRhIDwgY2hlY2sudmFsdWUgOiBpbnB1dC5kYXRhIDw9IGNoZWNrLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0b29TbWFsbCkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX3NtYWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJiaWdpbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW06IGNoZWNrLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiBjaGVjay5pbmNsdXNpdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJtYXhcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvb0JpZyA9IGNoZWNrLmluY2x1c2l2ZSA/IGlucHV0LmRhdGEgPiBjaGVjay52YWx1ZSA6IGlucHV0LmRhdGEgPj0gY2hlY2sudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRvb0JpZykge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX2JpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYmlnaW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiBjaGVjay52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogY2hlY2suaW5jbHVzaXZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwibXVsdGlwbGVPZlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LmRhdGEgJSBjaGVjay52YWx1ZSAhPT0gQmlnSW50KDApKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5ub3RfbXVsdGlwbGVfb2YsXG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZU9mOiBjaGVjay52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB1dGlsLmFzc2VydE5ldmVyKGNoZWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cy52YWx1ZSwgdmFsdWU6IGlucHV0LmRhdGEgfTtcbiAgICB9XG4gICAgX2dldEludmFsaWRJbnB1dChpbnB1dCkge1xuICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLmJpZ2ludCxcbiAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgIH1cbiAgICBndGUodmFsdWUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TGltaXQoXCJtaW5cIiwgdmFsdWUsIHRydWUsIGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSk7XG4gICAgfVxuICAgIGd0KHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldExpbWl0KFwibWluXCIsIHZhbHVlLCBmYWxzZSwgZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpKTtcbiAgICB9XG4gICAgbHRlKHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldExpbWl0KFwibWF4XCIsIHZhbHVlLCB0cnVlLCBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkpO1xuICAgIH1cbiAgICBsdCh2YWx1ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRMaW1pdChcIm1heFwiLCB2YWx1ZSwgZmFsc2UsIGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSk7XG4gICAgfVxuICAgIHNldExpbWl0KGtpbmQsIHZhbHVlLCBpbmNsdXNpdmUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RCaWdJbnQoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgY2hlY2tzOiBbXG4gICAgICAgICAgICAgICAgLi4udGhpcy5fZGVmLmNoZWNrcyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtpbmQsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9hZGRDaGVjayhjaGVjaykge1xuICAgICAgICByZXR1cm4gbmV3IFpvZEJpZ0ludCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBjaGVja3M6IFsuLi50aGlzLl9kZWYuY2hlY2tzLCBjaGVja10sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwb3NpdGl2ZShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1pblwiLFxuICAgICAgICAgICAgdmFsdWU6IEJpZ0ludCgwKSxcbiAgICAgICAgICAgIGluY2x1c2l2ZTogZmFsc2UsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBuZWdhdGl2ZShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1heFwiLFxuICAgICAgICAgICAgdmFsdWU6IEJpZ0ludCgwKSxcbiAgICAgICAgICAgIGluY2x1c2l2ZTogZmFsc2UsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBub25wb3NpdGl2ZShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1heFwiLFxuICAgICAgICAgICAgdmFsdWU6IEJpZ0ludCgwKSxcbiAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5vbm5lZ2F0aXZlKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWluXCIsXG4gICAgICAgICAgICB2YWx1ZTogQmlnSW50KDApLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbXVsdGlwbGVPZih2YWx1ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtdWx0aXBsZU9mXCIsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldCBtaW5WYWx1ZSgpIHtcbiAgICAgICAgbGV0IG1pbiA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgY2ggb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoLmtpbmQgPT09IFwibWluXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobWluID09PSBudWxsIHx8IGNoLnZhbHVlID4gbWluKVxuICAgICAgICAgICAgICAgICAgICBtaW4gPSBjaC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluO1xuICAgIH1cbiAgICBnZXQgbWF4VmFsdWUoKSB7XG4gICAgICAgIGxldCBtYXggPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGNoIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaC5raW5kID09PSBcIm1heFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1heCA9PT0gbnVsbCB8fCBjaC52YWx1ZSA8IG1heClcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gY2gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1heDtcbiAgICB9XG59XG5ab2RCaWdJbnQuY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kQmlnSW50KHtcbiAgICAgICAgY2hlY2tzOiBbXSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RCaWdJbnQsXG4gICAgICAgIGNvZXJjZTogcGFyYW1zPy5jb2VyY2UgPz8gZmFsc2UsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kQm9vbGVhbiBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBpZiAodGhpcy5fZGVmLmNvZXJjZSkge1xuICAgICAgICAgICAgaW5wdXQuZGF0YSA9IEJvb2xlYW4oaW5wdXQuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5ib29sZWFuKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLmJvb2xlYW4sXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT0soaW5wdXQuZGF0YSk7XG4gICAgfVxufVxuWm9kQm9vbGVhbi5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RCb29sZWFuKHtcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RCb29sZWFuLFxuICAgICAgICBjb2VyY2U6IHBhcmFtcz8uY29lcmNlIHx8IGZhbHNlLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZERhdGUgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RlZi5jb2VyY2UpIHtcbiAgICAgICAgICAgIGlucHV0LmRhdGEgPSBuZXcgRGF0ZShpbnB1dC5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLmRhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUuZGF0ZSxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGlmIChOdW1iZXIuaXNOYU4oaW5wdXQuZGF0YS5nZXRUaW1lKCkpKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9kYXRlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdGF0dXMgPSBuZXcgUGFyc2VTdGF0dXMoKTtcbiAgICAgICAgbGV0IGN0eCA9IHVuZGVmaW5lZDtcbiAgICAgICAgZm9yIChjb25zdCBjaGVjayBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2hlY2sua2luZCA9PT0gXCJtaW5cIikge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dC5kYXRhLmdldFRpbWUoKSA8IGNoZWNrLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fc21hbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogY2hlY2sudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImRhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwibWF4XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQuZGF0YS5nZXRUaW1lKCkgPiBjaGVjay52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX2JpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBleGFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiBjaGVjay52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbC5hc3NlcnROZXZlcihjaGVjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLnZhbHVlLFxuICAgICAgICAgICAgdmFsdWU6IG5ldyBEYXRlKGlucHV0LmRhdGEuZ2V0VGltZSgpKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgX2FkZENoZWNrKGNoZWNrKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kRGF0ZSh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBjaGVja3M6IFsuLi50aGlzLl9kZWYuY2hlY2tzLCBjaGVja10sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBtaW4obWluRGF0ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtaW5cIixcbiAgICAgICAgICAgIHZhbHVlOiBtaW5EYXRlLmdldFRpbWUoKSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG1heChtYXhEYXRlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1heFwiLFxuICAgICAgICAgICAgdmFsdWU6IG1heERhdGUuZ2V0VGltZSgpLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IG1pbkRhdGUoKSB7XG4gICAgICAgIGxldCBtaW4gPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGNoIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaC5raW5kID09PSBcIm1pblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1pbiA9PT0gbnVsbCB8fCBjaC52YWx1ZSA+IG1pbilcbiAgICAgICAgICAgICAgICAgICAgbWluID0gY2gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pbiAhPSBudWxsID8gbmV3IERhdGUobWluKSA6IG51bGw7XG4gICAgfVxuICAgIGdldCBtYXhEYXRlKCkge1xuICAgICAgICBsZXQgbWF4ID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBjaCBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2gua2luZCA9PT0gXCJtYXhcIikge1xuICAgICAgICAgICAgICAgIGlmIChtYXggPT09IG51bGwgfHwgY2gudmFsdWUgPCBtYXgpXG4gICAgICAgICAgICAgICAgICAgIG1heCA9IGNoLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXggIT0gbnVsbCA/IG5ldyBEYXRlKG1heCkgOiBudWxsO1xuICAgIH1cbn1cblpvZERhdGUuY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kRGF0ZSh7XG4gICAgICAgIGNoZWNrczogW10sXG4gICAgICAgIGNvZXJjZTogcGFyYW1zPy5jb2VyY2UgfHwgZmFsc2UsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kRGF0ZSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RTeW1ib2wgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5zeW1ib2wpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUuc3ltYm9sLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9LKGlucHV0LmRhdGEpO1xuICAgIH1cbn1cblpvZFN5bWJvbC5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RTeW1ib2woe1xuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFN5bWJvbCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RVbmRlZmluZWQgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS51bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUudW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9LKGlucHV0LmRhdGEpO1xuICAgIH1cbn1cblpvZFVuZGVmaW5lZC5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RVbmRlZmluZWQoe1xuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFVuZGVmaW5lZCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2ROdWxsIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUubnVsbCkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5udWxsLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9LKGlucHV0LmRhdGEpO1xuICAgIH1cbn1cblpvZE51bGwuY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kTnVsbCh7XG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kTnVsbCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RBbnkgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgLy8gdG8gcHJldmVudCBpbnN0YW5jZXMgb2Ygb3RoZXIgY2xhc3NlcyBmcm9tIGV4dGVuZGluZyBab2RBbnkuIHRoaXMgY2F1c2VzIGlzc3VlcyB3aXRoIGNhdGNoYWxsIGluIFpvZE9iamVjdC5cbiAgICAgICAgdGhpcy5fYW55ID0gdHJ1ZTtcbiAgICB9XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBPSyhpbnB1dC5kYXRhKTtcbiAgICB9XG59XG5ab2RBbnkuY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kQW55KHtcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RBbnksXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kVW5rbm93biBleHRlbmRzIFpvZFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAvLyByZXF1aXJlZFxuICAgICAgICB0aGlzLl91bmtub3duID0gdHJ1ZTtcbiAgICB9XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBPSyhpbnB1dC5kYXRhKTtcbiAgICB9XG59XG5ab2RVbmtub3duLmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZFVua25vd24oe1xuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFVua25vd24sXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kTmV2ZXIgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5uZXZlcixcbiAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgIH1cbn1cblpvZE5ldmVyLmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZE5ldmVyKHtcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2ROZXZlcixcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RWb2lkIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUudW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLnZvaWQsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT0soaW5wdXQuZGF0YSk7XG4gICAgfVxufVxuWm9kVm9pZC5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RWb2lkKHtcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RWb2lkLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZEFycmF5IGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgY3R4LCBzdGF0dXMgfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGNvbnN0IGRlZiA9IHRoaXMuX2RlZjtcbiAgICAgICAgaWYgKGN0eC5wYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLmFycmF5KSB7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLmFycmF5LFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlZi5leGFjdExlbmd0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgdG9vQmlnID0gY3R4LmRhdGEubGVuZ3RoID4gZGVmLmV4YWN0TGVuZ3RoLnZhbHVlO1xuICAgICAgICAgICAgY29uc3QgdG9vU21hbGwgPSBjdHguZGF0YS5sZW5ndGggPCBkZWYuZXhhY3RMZW5ndGgudmFsdWU7XG4gICAgICAgICAgICBpZiAodG9vQmlnIHx8IHRvb1NtYWxsKSB7XG4gICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IHRvb0JpZyA/IFpvZElzc3VlQ29kZS50b29fYmlnIDogWm9kSXNzdWVDb2RlLnRvb19zbWFsbCxcbiAgICAgICAgICAgICAgICAgICAgbWluaW11bTogKHRvb1NtYWxsID8gZGVmLmV4YWN0TGVuZ3RoLnZhbHVlIDogdW5kZWZpbmVkKSxcbiAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogKHRvb0JpZyA/IGRlZi5leGFjdExlbmd0aC52YWx1ZSA6IHVuZGVmaW5lZCksXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYXJyYXlcIixcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBleGFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZGVmLmV4YWN0TGVuZ3RoLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlZi5taW5MZW5ndGggIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjdHguZGF0YS5sZW5ndGggPCBkZWYubWluTGVuZ3RoLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fc21hbGwsXG4gICAgICAgICAgICAgICAgICAgIG1pbmltdW06IGRlZi5taW5MZW5ndGgudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYXJyYXlcIixcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBleGFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGRlZi5taW5MZW5ndGgubWVzc2FnZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVmLm1heExlbmd0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGN0eC5kYXRhLmxlbmd0aCA+IGRlZi5tYXhMZW5ndGgudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19iaWcsXG4gICAgICAgICAgICAgICAgICAgIG1heGltdW06IGRlZi5tYXhMZW5ndGgudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYXJyYXlcIixcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBleGFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGRlZi5tYXhMZW5ndGgubWVzc2FnZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFsuLi5jdHguZGF0YV0ubWFwKChpdGVtLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZi50eXBlLl9wYXJzZUFzeW5jKG5ldyBQYXJzZUlucHV0TGF6eVBhdGgoY3R4LCBpdGVtLCBjdHgucGF0aCwgaSkpO1xuICAgICAgICAgICAgfSkpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBQYXJzZVN0YXR1cy5tZXJnZUFycmF5KHN0YXR1cywgcmVzdWx0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFsuLi5jdHguZGF0YV0ubWFwKChpdGVtLCBpKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZGVmLnR5cGUuX3BhcnNlU3luYyhuZXcgUGFyc2VJbnB1dExhenlQYXRoKGN0eCwgaXRlbSwgY3R4LnBhdGgsIGkpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBQYXJzZVN0YXR1cy5tZXJnZUFycmF5KHN0YXR1cywgcmVzdWx0KTtcbiAgICB9XG4gICAgZ2V0IGVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYudHlwZTtcbiAgICB9XG4gICAgbWluKG1pbkxlbmd0aCwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZEFycmF5KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIG1pbkxlbmd0aDogeyB2YWx1ZTogbWluTGVuZ3RoLCBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG1heChtYXhMZW5ndGgsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RBcnJheSh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBtYXhMZW5ndGg6IHsgdmFsdWU6IG1heExlbmd0aCwgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBsZW5ndGgobGVuLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kQXJyYXkoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgZXhhY3RMZW5ndGg6IHsgdmFsdWU6IGxlbiwgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBub25lbXB0eShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbigxLCBtZXNzYWdlKTtcbiAgICB9XG59XG5ab2RBcnJheS5jcmVhdGUgPSAoc2NoZW1hLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZEFycmF5KHtcbiAgICAgICAgdHlwZTogc2NoZW1hLFxuICAgICAgICBtaW5MZW5ndGg6IG51bGwsXG4gICAgICAgIG1heExlbmd0aDogbnVsbCxcbiAgICAgICAgZXhhY3RMZW5ndGg6IG51bGwsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kQXJyYXksXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5mdW5jdGlvbiBkZWVwUGFydGlhbGlmeShzY2hlbWEpIHtcbiAgICBpZiAoc2NoZW1hIGluc3RhbmNlb2YgWm9kT2JqZWN0KSB7XG4gICAgICAgIGNvbnN0IG5ld1NoYXBlID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHNjaGVtYS5zaGFwZSkge1xuICAgICAgICAgICAgY29uc3QgZmllbGRTY2hlbWEgPSBzY2hlbWEuc2hhcGVba2V5XTtcbiAgICAgICAgICAgIG5ld1NoYXBlW2tleV0gPSBab2RPcHRpb25hbC5jcmVhdGUoZGVlcFBhcnRpYWxpZnkoZmllbGRTY2hlbWEpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgICAgICAuLi5zY2hlbWEuX2RlZixcbiAgICAgICAgICAgIHNoYXBlOiAoKSA9PiBuZXdTaGFwZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjaGVtYSBpbnN0YW5jZW9mIFpvZEFycmF5KSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kQXJyYXkoe1xuICAgICAgICAgICAgLi4uc2NoZW1hLl9kZWYsXG4gICAgICAgICAgICB0eXBlOiBkZWVwUGFydGlhbGlmeShzY2hlbWEuZWxlbWVudCksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY2hlbWEgaW5zdGFuY2VvZiBab2RPcHRpb25hbCkge1xuICAgICAgICByZXR1cm4gWm9kT3B0aW9uYWwuY3JlYXRlKGRlZXBQYXJ0aWFsaWZ5KHNjaGVtYS51bndyYXAoKSkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY2hlbWEgaW5zdGFuY2VvZiBab2ROdWxsYWJsZSkge1xuICAgICAgICByZXR1cm4gWm9kTnVsbGFibGUuY3JlYXRlKGRlZXBQYXJ0aWFsaWZ5KHNjaGVtYS51bndyYXAoKSkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChzY2hlbWEgaW5zdGFuY2VvZiBab2RUdXBsZSkge1xuICAgICAgICByZXR1cm4gWm9kVHVwbGUuY3JlYXRlKHNjaGVtYS5pdGVtcy5tYXAoKGl0ZW0pID0+IGRlZXBQYXJ0aWFsaWZ5KGl0ZW0pKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gc2NoZW1hO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBab2RPYmplY3QgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5fY2FjaGVkID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXByZWNhdGVkIEluIG1vc3QgY2FzZXMsIHRoaXMgaXMgbm8gbG9uZ2VyIG5lZWRlZCAtIHVua25vd24gcHJvcGVydGllcyBhcmUgbm93IHNpbGVudGx5IHN0cmlwcGVkLlxuICAgICAgICAgKiBJZiB5b3Ugd2FudCB0byBwYXNzIHRocm91Z2ggdW5rbm93biBwcm9wZXJ0aWVzLCB1c2UgYC5wYXNzdGhyb3VnaCgpYCBpbnN0ZWFkLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5ub25zdHJpY3QgPSB0aGlzLnBhc3N0aHJvdWdoO1xuICAgICAgICAvLyBleHRlbmQ8XG4gICAgICAgIC8vICAgQXVnbWVudGF0aW9uIGV4dGVuZHMgWm9kUmF3U2hhcGUsXG4gICAgICAgIC8vICAgTmV3T3V0cHV0IGV4dGVuZHMgdXRpbC5mbGF0dGVuPHtcbiAgICAgICAgLy8gICAgIFtrIGluIGtleW9mIEF1Z21lbnRhdGlvbiB8IGtleW9mIE91dHB1dF06IGsgZXh0ZW5kcyBrZXlvZiBBdWdtZW50YXRpb25cbiAgICAgICAgLy8gICAgICAgPyBBdWdtZW50YXRpb25ba11bXCJfb3V0cHV0XCJdXG4gICAgICAgIC8vICAgICAgIDogayBleHRlbmRzIGtleW9mIE91dHB1dFxuICAgICAgICAvLyAgICAgICA/IE91dHB1dFtrXVxuICAgICAgICAvLyAgICAgICA6IG5ldmVyO1xuICAgICAgICAvLyAgIH0+LFxuICAgICAgICAvLyAgIE5ld0lucHV0IGV4dGVuZHMgdXRpbC5mbGF0dGVuPHtcbiAgICAgICAgLy8gICAgIFtrIGluIGtleW9mIEF1Z21lbnRhdGlvbiB8IGtleW9mIElucHV0XTogayBleHRlbmRzIGtleW9mIEF1Z21lbnRhdGlvblxuICAgICAgICAvLyAgICAgICA/IEF1Z21lbnRhdGlvbltrXVtcIl9pbnB1dFwiXVxuICAgICAgICAvLyAgICAgICA6IGsgZXh0ZW5kcyBrZXlvZiBJbnB1dFxuICAgICAgICAvLyAgICAgICA/IElucHV0W2tdXG4gICAgICAgIC8vICAgICAgIDogbmV2ZXI7XG4gICAgICAgIC8vICAgfT5cbiAgICAgICAgLy8gPihcbiAgICAgICAgLy8gICBhdWdtZW50YXRpb246IEF1Z21lbnRhdGlvblxuICAgICAgICAvLyApOiBab2RPYmplY3Q8XG4gICAgICAgIC8vICAgZXh0ZW5kU2hhcGU8VCwgQXVnbWVudGF0aW9uPixcbiAgICAgICAgLy8gICBVbmtub3duS2V5cyxcbiAgICAgICAgLy8gICBDYXRjaGFsbCxcbiAgICAgICAgLy8gICBOZXdPdXRwdXQsXG4gICAgICAgIC8vICAgTmV3SW5wdXRcbiAgICAgICAgLy8gPiB7XG4gICAgICAgIC8vICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICAvLyAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAvLyAgICAgc2hhcGU6ICgpID0+ICh7XG4gICAgICAgIC8vICAgICAgIC4uLnRoaXMuX2RlZi5zaGFwZSgpLFxuICAgICAgICAvLyAgICAgICAuLi5hdWdtZW50YXRpb24sXG4gICAgICAgIC8vICAgICB9KSxcbiAgICAgICAgLy8gICB9KSBhcyBhbnk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXByZWNhdGVkIFVzZSBgLmV4dGVuZGAgaW5zdGVhZFxuICAgICAgICAgKiAgKi9cbiAgICAgICAgdGhpcy5hdWdtZW50ID0gdGhpcy5leHRlbmQ7XG4gICAgfVxuICAgIF9nZXRDYWNoZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jYWNoZWQgIT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVkO1xuICAgICAgICBjb25zdCBzaGFwZSA9IHRoaXMuX2RlZi5zaGFwZSgpO1xuICAgICAgICBjb25zdCBrZXlzID0gdXRpbC5vYmplY3RLZXlzKHNoYXBlKTtcbiAgICAgICAgdGhpcy5fY2FjaGVkID0geyBzaGFwZSwga2V5cyB9O1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVkO1xuICAgIH1cbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5vYmplY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUub2JqZWN0LFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBzdGF0dXMsIGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgY29uc3QgeyBzaGFwZSwga2V5czogc2hhcGVLZXlzIH0gPSB0aGlzLl9nZXRDYWNoZWQoKTtcbiAgICAgICAgY29uc3QgZXh0cmFLZXlzID0gW107XG4gICAgICAgIGlmICghKHRoaXMuX2RlZi5jYXRjaGFsbCBpbnN0YW5jZW9mIFpvZE5ldmVyICYmIHRoaXMuX2RlZi51bmtub3duS2V5cyA9PT0gXCJzdHJpcFwiKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gY3R4LmRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNoYXBlS2V5cy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4dHJhS2V5cy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhaXJzID0gW107XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIHNoYXBlS2V5cykge1xuICAgICAgICAgICAgY29uc3Qga2V5VmFsaWRhdG9yID0gc2hhcGVba2V5XTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmRhdGFba2V5XTtcbiAgICAgICAgICAgIHBhaXJzLnB1c2goe1xuICAgICAgICAgICAgICAgIGtleTogeyBzdGF0dXM6IFwidmFsaWRcIiwgdmFsdWU6IGtleSB9LFxuICAgICAgICAgICAgICAgIHZhbHVlOiBrZXlWYWxpZGF0b3IuX3BhcnNlKG5ldyBQYXJzZUlucHV0TGF6eVBhdGgoY3R4LCB2YWx1ZSwgY3R4LnBhdGgsIGtleSkpLFxuICAgICAgICAgICAgICAgIGFsd2F5c1NldDoga2V5IGluIGN0eC5kYXRhLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2RlZi5jYXRjaGFsbCBpbnN0YW5jZW9mIFpvZE5ldmVyKSB7XG4gICAgICAgICAgICBjb25zdCB1bmtub3duS2V5cyA9IHRoaXMuX2RlZi51bmtub3duS2V5cztcbiAgICAgICAgICAgIGlmICh1bmtub3duS2V5cyA9PT0gXCJwYXNzdGhyb3VnaFwiKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgZXh0cmFLZXlzKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhaXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiB7IHN0YXR1czogXCJ2YWxpZFwiLCB2YWx1ZToga2V5IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogeyBzdGF0dXM6IFwidmFsaWRcIiwgdmFsdWU6IGN0eC5kYXRhW2tleV0gfSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodW5rbm93bktleXMgPT09IFwic3RyaWN0XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXh0cmFLZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudW5yZWNvZ25pemVkX2tleXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlzOiBleHRyYUtleXMsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh1bmtub3duS2V5cyA9PT0gXCJzdHJpcFwiKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludGVybmFsIFpvZE9iamVjdCBlcnJvcjogaW52YWxpZCB1bmtub3duS2V5cyB2YWx1ZS5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIHJ1biBjYXRjaGFsbCB2YWxpZGF0aW9uXG4gICAgICAgICAgICBjb25zdCBjYXRjaGFsbCA9IHRoaXMuX2RlZi5jYXRjaGFsbDtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGV4dHJhS2V5cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY3R4LmRhdGFba2V5XTtcbiAgICAgICAgICAgICAgICBwYWlycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiB7IHN0YXR1czogXCJ2YWxpZFwiLCB2YWx1ZToga2V5IH0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjYXRjaGFsbC5fcGFyc2UobmV3IFBhcnNlSW5wdXRMYXp5UGF0aChjdHgsIHZhbHVlLCBjdHgucGF0aCwga2V5KSAvLywgY3R4LmNoaWxkKGtleSksIHZhbHVlLCBnZXRQYXJzZWRUeXBlKHZhbHVlKVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICBhbHdheXNTZXQ6IGtleSBpbiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgICAgICAgICAgLnRoZW4oYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN5bmNQYWlycyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcGFpciBvZiBwYWlycykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBhd2FpdCBwYWlyLmtleTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBhd2FpdCBwYWlyLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBzeW5jUGFpcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsd2F5c1NldDogcGFpci5hbHdheXNTZXQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc3luY1BhaXJzO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoc3luY1BhaXJzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFBhcnNlU3RhdHVzLm1lcmdlT2JqZWN0U3luYyhzdGF0dXMsIHN5bmNQYWlycyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBQYXJzZVN0YXR1cy5tZXJnZU9iamVjdFN5bmMoc3RhdHVzLCBwYWlycyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IHNoYXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnNoYXBlKCk7XG4gICAgfVxuICAgIHN0cmljdChtZXNzYWdlKSB7XG4gICAgICAgIGVycm9yVXRpbC5lcnJUb09iajtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgdW5rbm93bktleXM6IFwic3RyaWN0XCIsXG4gICAgICAgICAgICAuLi4obWVzc2FnZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWFwOiAoaXNzdWUsIGN0eCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdEVycm9yID0gdGhpcy5fZGVmLmVycm9yTWFwPy4oaXNzdWUsIGN0eCkubWVzc2FnZSA/PyBjdHguZGVmYXVsdEVycm9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzc3VlLmNvZGUgPT09IFwidW5yZWNvZ25pemVkX2tleXNcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSkubWVzc2FnZSA/PyBkZWZhdWx0RXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZGVmYXVsdEVycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB7fSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdHJpcCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgdW5rbm93bktleXM6IFwic3RyaXBcIixcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHBhc3N0aHJvdWdoKCkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICB1bmtub3duS2V5czogXCJwYXNzdGhyb3VnaFwiLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gY29uc3QgQXVnbWVudEZhY3RvcnkgPVxuICAgIC8vICAgPERlZiBleHRlbmRzIFpvZE9iamVjdERlZj4oZGVmOiBEZWYpID0+XG4gICAgLy8gICA8QXVnbWVudGF0aW9uIGV4dGVuZHMgWm9kUmF3U2hhcGU+KFxuICAgIC8vICAgICBhdWdtZW50YXRpb246IEF1Z21lbnRhdGlvblxuICAgIC8vICAgKTogWm9kT2JqZWN0PFxuICAgIC8vICAgICBleHRlbmRTaGFwZTxSZXR1cm5UeXBlPERlZltcInNoYXBlXCJdPiwgQXVnbWVudGF0aW9uPixcbiAgICAvLyAgICAgRGVmW1widW5rbm93bktleXNcIl0sXG4gICAgLy8gICAgIERlZltcImNhdGNoYWxsXCJdXG4gICAgLy8gICA+ID0+IHtcbiAgICAvLyAgICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgIC8vICAgICAgIC4uLmRlZixcbiAgICAvLyAgICAgICBzaGFwZTogKCkgPT4gKHtcbiAgICAvLyAgICAgICAgIC4uLmRlZi5zaGFwZSgpLFxuICAgIC8vICAgICAgICAgLi4uYXVnbWVudGF0aW9uLFxuICAgIC8vICAgICAgIH0pLFxuICAgIC8vICAgICB9KSBhcyBhbnk7XG4gICAgLy8gICB9O1xuICAgIGV4dGVuZChhdWdtZW50YXRpb24pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgc2hhcGU6ICgpID0+ICh7XG4gICAgICAgICAgICAgICAgLi4udGhpcy5fZGVmLnNoYXBlKCksXG4gICAgICAgICAgICAgICAgLi4uYXVnbWVudGF0aW9uLFxuICAgICAgICAgICAgfSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcmlvciB0byB6b2RAMS4wLjEyIHRoZXJlIHdhcyBhIGJ1ZyBpbiB0aGVcbiAgICAgKiBpbmZlcnJlZCB0eXBlIG9mIG1lcmdlZCBvYmplY3RzLiBQbGVhc2VcbiAgICAgKiB1cGdyYWRlIGlmIHlvdSBhcmUgZXhwZXJpZW5jaW5nIGlzc3Vlcy5cbiAgICAgKi9cbiAgICBtZXJnZShtZXJnaW5nKSB7XG4gICAgICAgIGNvbnN0IG1lcmdlZCA9IG5ldyBab2RPYmplY3Qoe1xuICAgICAgICAgICAgdW5rbm93bktleXM6IG1lcmdpbmcuX2RlZi51bmtub3duS2V5cyxcbiAgICAgICAgICAgIGNhdGNoYWxsOiBtZXJnaW5nLl9kZWYuY2F0Y2hhbGwsXG4gICAgICAgICAgICBzaGFwZTogKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAuLi50aGlzLl9kZWYuc2hhcGUoKSxcbiAgICAgICAgICAgICAgICAuLi5tZXJnaW5nLl9kZWYuc2hhcGUoKSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RPYmplY3QsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWVyZ2VkO1xuICAgIH1cbiAgICAvLyBtZXJnZTxcbiAgICAvLyAgIEluY29taW5nIGV4dGVuZHMgQW55Wm9kT2JqZWN0LFxuICAgIC8vICAgQXVnbWVudGF0aW9uIGV4dGVuZHMgSW5jb21pbmdbXCJzaGFwZVwiXSxcbiAgICAvLyAgIE5ld091dHB1dCBleHRlbmRzIHtcbiAgICAvLyAgICAgW2sgaW4ga2V5b2YgQXVnbWVudGF0aW9uIHwga2V5b2YgT3V0cHV0XTogayBleHRlbmRzIGtleW9mIEF1Z21lbnRhdGlvblxuICAgIC8vICAgICAgID8gQXVnbWVudGF0aW9uW2tdW1wiX291dHB1dFwiXVxuICAgIC8vICAgICAgIDogayBleHRlbmRzIGtleW9mIE91dHB1dFxuICAgIC8vICAgICAgID8gT3V0cHV0W2tdXG4gICAgLy8gICAgICAgOiBuZXZlcjtcbiAgICAvLyAgIH0sXG4gICAgLy8gICBOZXdJbnB1dCBleHRlbmRzIHtcbiAgICAvLyAgICAgW2sgaW4ga2V5b2YgQXVnbWVudGF0aW9uIHwga2V5b2YgSW5wdXRdOiBrIGV4dGVuZHMga2V5b2YgQXVnbWVudGF0aW9uXG4gICAgLy8gICAgICAgPyBBdWdtZW50YXRpb25ba11bXCJfaW5wdXRcIl1cbiAgICAvLyAgICAgICA6IGsgZXh0ZW5kcyBrZXlvZiBJbnB1dFxuICAgIC8vICAgICAgID8gSW5wdXRba11cbiAgICAvLyAgICAgICA6IG5ldmVyO1xuICAgIC8vICAgfVxuICAgIC8vID4oXG4gICAgLy8gICBtZXJnaW5nOiBJbmNvbWluZ1xuICAgIC8vICk6IFpvZE9iamVjdDxcbiAgICAvLyAgIGV4dGVuZFNoYXBlPFQsIFJldHVyblR5cGU8SW5jb21pbmdbXCJfZGVmXCJdW1wic2hhcGVcIl0+PixcbiAgICAvLyAgIEluY29taW5nW1wiX2RlZlwiXVtcInVua25vd25LZXlzXCJdLFxuICAgIC8vICAgSW5jb21pbmdbXCJfZGVmXCJdW1wiY2F0Y2hhbGxcIl0sXG4gICAgLy8gICBOZXdPdXRwdXQsXG4gICAgLy8gICBOZXdJbnB1dFxuICAgIC8vID4ge1xuICAgIC8vICAgY29uc3QgbWVyZ2VkOiBhbnkgPSBuZXcgWm9kT2JqZWN0KHtcbiAgICAvLyAgICAgdW5rbm93bktleXM6IG1lcmdpbmcuX2RlZi51bmtub3duS2V5cyxcbiAgICAvLyAgICAgY2F0Y2hhbGw6IG1lcmdpbmcuX2RlZi5jYXRjaGFsbCxcbiAgICAvLyAgICAgc2hhcGU6ICgpID0+XG4gICAgLy8gICAgICAgb2JqZWN0VXRpbC5tZXJnZVNoYXBlcyh0aGlzLl9kZWYuc2hhcGUoKSwgbWVyZ2luZy5fZGVmLnNoYXBlKCkpLFxuICAgIC8vICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE9iamVjdCxcbiAgICAvLyAgIH0pIGFzIGFueTtcbiAgICAvLyAgIHJldHVybiBtZXJnZWQ7XG4gICAgLy8gfVxuICAgIHNldEtleShrZXksIHNjaGVtYSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdWdtZW50KHsgW2tleV06IHNjaGVtYSB9KTtcbiAgICB9XG4gICAgLy8gbWVyZ2U8SW5jb21pbmcgZXh0ZW5kcyBBbnlab2RPYmplY3Q+KFxuICAgIC8vICAgbWVyZ2luZzogSW5jb21pbmdcbiAgICAvLyApOiAvL1pvZE9iamVjdDxUICYgSW5jb21pbmdbXCJfc2hhcGVcIl0sIFVua25vd25LZXlzLCBDYXRjaGFsbD4gPSAobWVyZ2luZykgPT4ge1xuICAgIC8vIFpvZE9iamVjdDxcbiAgICAvLyAgIGV4dGVuZFNoYXBlPFQsIFJldHVyblR5cGU8SW5jb21pbmdbXCJfZGVmXCJdW1wic2hhcGVcIl0+PixcbiAgICAvLyAgIEluY29taW5nW1wiX2RlZlwiXVtcInVua25vd25LZXlzXCJdLFxuICAgIC8vICAgSW5jb21pbmdbXCJfZGVmXCJdW1wiY2F0Y2hhbGxcIl1cbiAgICAvLyA+IHtcbiAgICAvLyAgIC8vIGNvbnN0IG1lcmdlZFNoYXBlID0gb2JqZWN0VXRpbC5tZXJnZVNoYXBlcyhcbiAgICAvLyAgIC8vICAgdGhpcy5fZGVmLnNoYXBlKCksXG4gICAgLy8gICAvLyAgIG1lcmdpbmcuX2RlZi5zaGFwZSgpXG4gICAgLy8gICAvLyApO1xuICAgIC8vICAgY29uc3QgbWVyZ2VkOiBhbnkgPSBuZXcgWm9kT2JqZWN0KHtcbiAgICAvLyAgICAgdW5rbm93bktleXM6IG1lcmdpbmcuX2RlZi51bmtub3duS2V5cyxcbiAgICAvLyAgICAgY2F0Y2hhbGw6IG1lcmdpbmcuX2RlZi5jYXRjaGFsbCxcbiAgICAvLyAgICAgc2hhcGU6ICgpID0+XG4gICAgLy8gICAgICAgb2JqZWN0VXRpbC5tZXJnZVNoYXBlcyh0aGlzLl9kZWYuc2hhcGUoKSwgbWVyZ2luZy5fZGVmLnNoYXBlKCkpLFxuICAgIC8vICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE9iamVjdCxcbiAgICAvLyAgIH0pIGFzIGFueTtcbiAgICAvLyAgIHJldHVybiBtZXJnZWQ7XG4gICAgLy8gfVxuICAgIGNhdGNoYWxsKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGNhdGNoYWxsOiBpbmRleCxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHBpY2sobWFzaykge1xuICAgICAgICBjb25zdCBzaGFwZSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB1dGlsLm9iamVjdEtleXMobWFzaykpIHtcbiAgICAgICAgICAgIGlmIChtYXNrW2tleV0gJiYgdGhpcy5zaGFwZVtrZXldKSB7XG4gICAgICAgICAgICAgICAgc2hhcGVba2V5XSA9IHRoaXMuc2hhcGVba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBzaGFwZTogKCkgPT4gc2hhcGUsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbWl0KG1hc2spIHtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdXRpbC5vYmplY3RLZXlzKHRoaXMuc2hhcGUpKSB7XG4gICAgICAgICAgICBpZiAoIW1hc2tba2V5XSkge1xuICAgICAgICAgICAgICAgIHNoYXBlW2tleV0gPSB0aGlzLnNoYXBlW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgc2hhcGU6ICgpID0+IHNoYXBlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBkZWVwUGFydGlhbCgpIHtcbiAgICAgICAgcmV0dXJuIGRlZXBQYXJ0aWFsaWZ5KHRoaXMpO1xuICAgIH1cbiAgICBwYXJ0aWFsKG1hc2spIHtcbiAgICAgICAgY29uc3QgbmV3U2hhcGUgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdXRpbC5vYmplY3RLZXlzKHRoaXMuc2hhcGUpKSB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZFNjaGVtYSA9IHRoaXMuc2hhcGVba2V5XTtcbiAgICAgICAgICAgIGlmIChtYXNrICYmICFtYXNrW2tleV0pIHtcbiAgICAgICAgICAgICAgICBuZXdTaGFwZVtrZXldID0gZmllbGRTY2hlbWE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdTaGFwZVtrZXldID0gZmllbGRTY2hlbWEub3B0aW9uYWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBzaGFwZTogKCkgPT4gbmV3U2hhcGUsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXF1aXJlZChtYXNrKSB7XG4gICAgICAgIGNvbnN0IG5ld1NoYXBlID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIHV0aWwub2JqZWN0S2V5cyh0aGlzLnNoYXBlKSkge1xuICAgICAgICAgICAgaWYgKG1hc2sgJiYgIW1hc2tba2V5XSkge1xuICAgICAgICAgICAgICAgIG5ld1NoYXBlW2tleV0gPSB0aGlzLnNoYXBlW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZFNjaGVtYSA9IHRoaXMuc2hhcGVba2V5XTtcbiAgICAgICAgICAgICAgICBsZXQgbmV3RmllbGQgPSBmaWVsZFNjaGVtYTtcbiAgICAgICAgICAgICAgICB3aGlsZSAobmV3RmllbGQgaW5zdGFuY2VvZiBab2RPcHRpb25hbCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdGaWVsZCA9IG5ld0ZpZWxkLl9kZWYuaW5uZXJUeXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBuZXdTaGFwZVtrZXldID0gbmV3RmllbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgc2hhcGU6ICgpID0+IG5ld1NoYXBlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAga2V5b2YoKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVab2RFbnVtKHV0aWwub2JqZWN0S2V5cyh0aGlzLnNoYXBlKSk7XG4gICAgfVxufVxuWm9kT2JqZWN0LmNyZWF0ZSA9IChzaGFwZSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICBzaGFwZTogKCkgPT4gc2hhcGUsXG4gICAgICAgIHVua25vd25LZXlzOiBcInN0cmlwXCIsXG4gICAgICAgIGNhdGNoYWxsOiBab2ROZXZlci5jcmVhdGUoKSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RPYmplY3QsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5ab2RPYmplY3Quc3RyaWN0Q3JlYXRlID0gKHNoYXBlLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgIHNoYXBlOiAoKSA9PiBzaGFwZSxcbiAgICAgICAgdW5rbm93bktleXM6IFwic3RyaWN0XCIsXG4gICAgICAgIGNhdGNoYWxsOiBab2ROZXZlci5jcmVhdGUoKSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RPYmplY3QsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5ab2RPYmplY3QubGF6eWNyZWF0ZSA9IChzaGFwZSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICBzaGFwZSxcbiAgICAgICAgdW5rbm93bktleXM6IFwic3RyaXBcIixcbiAgICAgICAgY2F0Y2hhbGw6IFpvZE5ldmVyLmNyZWF0ZSgpLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE9iamVjdCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RVbmlvbiBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX2RlZi5vcHRpb25zO1xuICAgICAgICBmdW5jdGlvbiBoYW5kbGVSZXN1bHRzKHJlc3VsdHMpIHtcbiAgICAgICAgICAgIC8vIHJldHVybiBmaXJzdCBpc3N1ZS1mcmVlIHZhbGlkYXRpb24gaWYgaXQgZXhpc3RzXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlc3VsdCBvZiByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5yZXN1bHQuc3RhdHVzID09PSBcInZhbGlkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCByZXN1bHQgb2YgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQucmVzdWx0LnN0YXR1cyA9PT0gXCJkaXJ0eVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCBpc3N1ZXMgZnJvbSBkaXJ0eSBvcHRpb25cbiAgICAgICAgICAgICAgICAgICAgY3R4LmNvbW1vbi5pc3N1ZXMucHVzaCguLi5yZXN1bHQuY3R4LmNvbW1vbi5pc3N1ZXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZXR1cm4gaW52YWxpZFxuICAgICAgICAgICAgY29uc3QgdW5pb25FcnJvcnMgPSByZXN1bHRzLm1hcCgocmVzdWx0KSA9PiBuZXcgWm9kRXJyb3IocmVzdWx0LmN0eC5jb21tb24uaXNzdWVzKSk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF91bmlvbixcbiAgICAgICAgICAgICAgICB1bmlvbkVycm9ycyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChvcHRpb25zLm1hcChhc3luYyAob3B0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRDdHggPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmN0eCxcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5jdHguY29tbW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNzdWVzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBhd2FpdCBvcHRpb24uX3BhcnNlQXN5bmMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogY2hpbGRDdHgsXG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICBjdHg6IGNoaWxkQ3R4LFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSkudGhlbihoYW5kbGVSZXN1bHRzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBkaXJ0eSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IGlzc3VlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBvcHRpb24gb2Ygb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkQ3R4ID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5jdHgsXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vbjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uY3R4LmNvbW1vbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzc3VlczogW10sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG9wdGlvbi5fcGFyc2VTeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGNoaWxkQ3R4LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSBcInZhbGlkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzdWx0LnN0YXR1cyA9PT0gXCJkaXJ0eVwiICYmICFkaXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICBkaXJ0eSA9IHsgcmVzdWx0LCBjdHg6IGNoaWxkQ3R4IH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjaGlsZEN0eC5jb21tb24uaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpc3N1ZXMucHVzaChjaGlsZEN0eC5jb21tb24uaXNzdWVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGlydHkpIHtcbiAgICAgICAgICAgICAgICBjdHguY29tbW9uLmlzc3Vlcy5wdXNoKC4uLmRpcnR5LmN0eC5jb21tb24uaXNzdWVzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlydHkucmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdW5pb25FcnJvcnMgPSBpc3N1ZXMubWFwKChpc3N1ZXMpID0+IG5ldyBab2RFcnJvcihpc3N1ZXMpKTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3VuaW9uLFxuICAgICAgICAgICAgICAgIHVuaW9uRXJyb3JzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgb3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5vcHRpb25zO1xuICAgIH1cbn1cblpvZFVuaW9uLmNyZWF0ZSA9ICh0eXBlcywgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RVbmlvbih7XG4gICAgICAgIG9wdGlvbnM6IHR5cGVzLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFVuaW9uLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vLy8vLy8vL1xuLy8vLy8vLy8vLyAgICAgIFpvZERpc2NyaW1pbmF0ZWRVbmlvbiAgICAgIC8vLy8vLy8vLy9cbi8vLy8vLy8vLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmNvbnN0IGdldERpc2NyaW1pbmF0b3IgPSAodHlwZSkgPT4ge1xuICAgIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kTGF6eSkge1xuICAgICAgICByZXR1cm4gZ2V0RGlzY3JpbWluYXRvcih0eXBlLnNjaGVtYSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2RFZmZlY3RzKSB7XG4gICAgICAgIHJldHVybiBnZXREaXNjcmltaW5hdG9yKHR5cGUuaW5uZXJUeXBlKCkpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kTGl0ZXJhbCkge1xuICAgICAgICByZXR1cm4gW3R5cGUudmFsdWVdO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kRW51bSkge1xuICAgICAgICByZXR1cm4gdHlwZS5vcHRpb25zO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kTmF0aXZlRW51bSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgYmFuL2JhblxuICAgICAgICByZXR1cm4gdXRpbC5vYmplY3RWYWx1ZXModHlwZS5lbnVtKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZERlZmF1bHQpIHtcbiAgICAgICAgcmV0dXJuIGdldERpc2NyaW1pbmF0b3IodHlwZS5fZGVmLmlubmVyVHlwZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2RVbmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIFt1bmRlZmluZWRdO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kTnVsbCkge1xuICAgICAgICByZXR1cm4gW251bGxdO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kT3B0aW9uYWwpIHtcbiAgICAgICAgcmV0dXJuIFt1bmRlZmluZWQsIC4uLmdldERpc2NyaW1pbmF0b3IodHlwZS51bndyYXAoKSldO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kTnVsbGFibGUpIHtcbiAgICAgICAgcmV0dXJuIFtudWxsLCAuLi5nZXREaXNjcmltaW5hdG9yKHR5cGUudW53cmFwKCkpXTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZEJyYW5kZWQpIHtcbiAgICAgICAgcmV0dXJuIGdldERpc2NyaW1pbmF0b3IodHlwZS51bndyYXAoKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2RSZWFkb25seSkge1xuICAgICAgICByZXR1cm4gZ2V0RGlzY3JpbWluYXRvcih0eXBlLnVud3JhcCgpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZENhdGNoKSB7XG4gICAgICAgIHJldHVybiBnZXREaXNjcmltaW5hdG9yKHR5cGUuX2RlZi5pbm5lclR5cGUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbn07XG5leHBvcnQgY2xhc3MgWm9kRGlzY3JpbWluYXRlZFVuaW9uIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBpZiAoY3R4LnBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUub2JqZWN0KSB7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLm9iamVjdCxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRpc2NyaW1pbmF0b3IgPSB0aGlzLmRpc2NyaW1pbmF0b3I7XG4gICAgICAgIGNvbnN0IGRpc2NyaW1pbmF0b3JWYWx1ZSA9IGN0eC5kYXRhW2Rpc2NyaW1pbmF0b3JdO1xuICAgICAgICBjb25zdCBvcHRpb24gPSB0aGlzLm9wdGlvbnNNYXAuZ2V0KGRpc2NyaW1pbmF0b3JWYWx1ZSk7XG4gICAgICAgIGlmICghb3B0aW9uKSB7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF91bmlvbl9kaXNjcmltaW5hdG9yLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IEFycmF5LmZyb20odGhpcy5vcHRpb25zTWFwLmtleXMoKSksXG4gICAgICAgICAgICAgICAgcGF0aDogW2Rpc2NyaW1pbmF0b3JdLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYykge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbi5fcGFyc2VBc3luYyh7XG4gICAgICAgICAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb24uX3BhcnNlU3luYyh7XG4gICAgICAgICAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgZGlzY3JpbWluYXRvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5kaXNjcmltaW5hdG9yO1xuICAgIH1cbiAgICBnZXQgb3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5vcHRpb25zO1xuICAgIH1cbiAgICBnZXQgb3B0aW9uc01hcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5vcHRpb25zTWFwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgY29uc3RydWN0b3Igb2YgdGhlIGRpc2NyaW1pbmF0ZWQgdW5pb24gc2NoZW1hLiBJdHMgYmVoYXZpb3VyIGlzIHZlcnkgc2ltaWxhciB0byB0aGF0IG9mIHRoZSBub3JtYWwgei51bmlvbigpIGNvbnN0cnVjdG9yLlxuICAgICAqIEhvd2V2ZXIsIGl0IG9ubHkgYWxsb3dzIGEgdW5pb24gb2Ygb2JqZWN0cywgYWxsIG9mIHdoaWNoIG5lZWQgdG8gc2hhcmUgYSBkaXNjcmltaW5hdG9yIHByb3BlcnR5LiBUaGlzIHByb3BlcnR5IG11c3RcbiAgICAgKiBoYXZlIGEgZGlmZmVyZW50IHZhbHVlIGZvciBlYWNoIG9iamVjdCBpbiB0aGUgdW5pb24uXG4gICAgICogQHBhcmFtIGRpc2NyaW1pbmF0b3IgdGhlIG5hbWUgb2YgdGhlIGRpc2NyaW1pbmF0b3IgcHJvcGVydHlcbiAgICAgKiBAcGFyYW0gdHlwZXMgYW4gYXJyYXkgb2Ygb2JqZWN0IHNjaGVtYXNcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZShkaXNjcmltaW5hdG9yLCBvcHRpb25zLCBwYXJhbXMpIHtcbiAgICAgICAgLy8gR2V0IGFsbCB0aGUgdmFsaWQgZGlzY3JpbWluYXRvciB2YWx1ZXNcbiAgICAgICAgY29uc3Qgb3B0aW9uc01hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgLy8gdHJ5IHtcbiAgICAgICAgZm9yIChjb25zdCB0eXBlIG9mIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpc2NyaW1pbmF0b3JWYWx1ZXMgPSBnZXREaXNjcmltaW5hdG9yKHR5cGUuc2hhcGVbZGlzY3JpbWluYXRvcl0pO1xuICAgICAgICAgICAgaWYgKCFkaXNjcmltaW5hdG9yVmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQSBkaXNjcmltaW5hdG9yIHZhbHVlIGZvciBrZXkgXFxgJHtkaXNjcmltaW5hdG9yfVxcYCBjb3VsZCBub3QgYmUgZXh0cmFjdGVkIGZyb20gYWxsIHNjaGVtYSBvcHRpb25zYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIGRpc2NyaW1pbmF0b3JWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uc01hcC5oYXModmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRGlzY3JpbWluYXRvciBwcm9wZXJ0eSAke1N0cmluZyhkaXNjcmltaW5hdG9yKX0gaGFzIGR1cGxpY2F0ZSB2YWx1ZSAke1N0cmluZyh2YWx1ZSl9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9wdGlvbnNNYXAuc2V0KHZhbHVlLCB0eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFpvZERpc2NyaW1pbmF0ZWRVbmlvbih7XG4gICAgICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZERpc2NyaW1pbmF0ZWRVbmlvbixcbiAgICAgICAgICAgIGRpc2NyaW1pbmF0b3IsXG4gICAgICAgICAgICBvcHRpb25zLFxuICAgICAgICAgICAgb3B0aW9uc01hcCxcbiAgICAgICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gbWVyZ2VWYWx1ZXMoYSwgYikge1xuICAgIGNvbnN0IGFUeXBlID0gZ2V0UGFyc2VkVHlwZShhKTtcbiAgICBjb25zdCBiVHlwZSA9IGdldFBhcnNlZFR5cGUoYik7XG4gICAgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IHRydWUsIGRhdGE6IGEgfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoYVR5cGUgPT09IFpvZFBhcnNlZFR5cGUub2JqZWN0ICYmIGJUeXBlID09PSBab2RQYXJzZWRUeXBlLm9iamVjdCkge1xuICAgICAgICBjb25zdCBiS2V5cyA9IHV0aWwub2JqZWN0S2V5cyhiKTtcbiAgICAgICAgY29uc3Qgc2hhcmVkS2V5cyA9IHV0aWwub2JqZWN0S2V5cyhhKS5maWx0ZXIoKGtleSkgPT4gYktleXMuaW5kZXhPZihrZXkpICE9PSAtMSk7XG4gICAgICAgIGNvbnN0IG5ld09iaiA9IHsgLi4uYSwgLi4uYiB9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBzaGFyZWRLZXlzKSB7XG4gICAgICAgICAgICBjb25zdCBzaGFyZWRWYWx1ZSA9IG1lcmdlVmFsdWVzKGFba2V5XSwgYltrZXldKTtcbiAgICAgICAgICAgIGlmICghc2hhcmVkVmFsdWUudmFsaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld09ialtrZXldID0gc2hhcmVkVmFsdWUuZGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgZGF0YTogbmV3T2JqIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKGFUeXBlID09PSBab2RQYXJzZWRUeXBlLmFycmF5ICYmIGJUeXBlID09PSBab2RQYXJzZWRUeXBlLmFycmF5KSB7XG4gICAgICAgIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5ld0FycmF5ID0gW107XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgaXRlbUEgPSBhW2luZGV4XTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1CID0gYltpbmRleF07XG4gICAgICAgICAgICBjb25zdCBzaGFyZWRWYWx1ZSA9IG1lcmdlVmFsdWVzKGl0ZW1BLCBpdGVtQik7XG4gICAgICAgICAgICBpZiAoIXNoYXJlZFZhbHVlLnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdBcnJheS5wdXNoKHNoYXJlZFZhbHVlLmRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBkYXRhOiBuZXdBcnJheSB9O1xuICAgIH1cbiAgICBlbHNlIGlmIChhVHlwZSA9PT0gWm9kUGFyc2VkVHlwZS5kYXRlICYmIGJUeXBlID09PSBab2RQYXJzZWRUeXBlLmRhdGUgJiYgK2EgPT09ICtiKSB7XG4gICAgICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBkYXRhOiBhIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UgfTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgWm9kSW50ZXJzZWN0aW9uIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgc3RhdHVzLCBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGNvbnN0IGhhbmRsZVBhcnNlZCA9IChwYXJzZWRMZWZ0LCBwYXJzZWRSaWdodCkgPT4ge1xuICAgICAgICAgICAgaWYgKGlzQWJvcnRlZChwYXJzZWRMZWZ0KSB8fCBpc0Fib3J0ZWQocGFyc2VkUmlnaHQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtZXJnZWQgPSBtZXJnZVZhbHVlcyhwYXJzZWRMZWZ0LnZhbHVlLCBwYXJzZWRSaWdodC52YWx1ZSk7XG4gICAgICAgICAgICBpZiAoIW1lcmdlZC52YWxpZCkge1xuICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9pbnRlcnNlY3Rpb25fdHlwZXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNEaXJ0eShwYXJzZWRMZWZ0KSB8fCBpc0RpcnR5KHBhcnNlZFJpZ2h0KSkge1xuICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMudmFsdWUsIHZhbHVlOiBtZXJnZWQuZGF0YSB9O1xuICAgICAgICB9O1xuICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWYubGVmdC5fcGFyc2VBc3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmLnJpZ2h0Ll9wYXJzZUFzeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0pLnRoZW4oKFtsZWZ0LCByaWdodF0pID0+IGhhbmRsZVBhcnNlZChsZWZ0LCByaWdodCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZVBhcnNlZCh0aGlzLl9kZWYubGVmdC5fcGFyc2VTeW5jKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgIH0pLCB0aGlzLl9kZWYucmlnaHQuX3BhcnNlU3luYyh7XG4gICAgICAgICAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5ab2RJbnRlcnNlY3Rpb24uY3JlYXRlID0gKGxlZnQsIHJpZ2h0LCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZEludGVyc2VjdGlvbih7XG4gICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgIHJpZ2h0OiByaWdodCxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RJbnRlcnNlY3Rpb24sXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG4vLyB0eXBlIFpvZFR1cGxlSXRlbXMgPSBbWm9kVHlwZUFueSwgLi4uWm9kVHlwZUFueVtdXTtcbmV4cG9ydCBjbGFzcyBab2RUdXBsZSBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IHN0YXR1cywgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBpZiAoY3R4LnBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUuYXJyYXkpIHtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUuYXJyYXksXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3R4LmRhdGEubGVuZ3RoIDwgdGhpcy5fZGVmLml0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19zbWFsbCxcbiAgICAgICAgICAgICAgICBtaW5pbXVtOiB0aGlzLl9kZWYuaXRlbXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBleGFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJhcnJheVwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN0ID0gdGhpcy5fZGVmLnJlc3Q7XG4gICAgICAgIGlmICghcmVzdCAmJiBjdHguZGF0YS5sZW5ndGggPiB0aGlzLl9kZWYuaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX2JpZyxcbiAgICAgICAgICAgICAgICBtYXhpbXVtOiB0aGlzLl9kZWYuaXRlbXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBleGFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJhcnJheVwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpdGVtcyA9IFsuLi5jdHguZGF0YV1cbiAgICAgICAgICAgIC5tYXAoKGl0ZW0sIGl0ZW1JbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2NoZW1hID0gdGhpcy5fZGVmLml0ZW1zW2l0ZW1JbmRleF0gfHwgdGhpcy5fZGVmLnJlc3Q7XG4gICAgICAgICAgICBpZiAoIXNjaGVtYSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBzY2hlbWEuX3BhcnNlKG5ldyBQYXJzZUlucHV0TGF6eVBhdGgoY3R4LCBpdGVtLCBjdHgucGF0aCwgaXRlbUluZGV4KSk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZmlsdGVyKCh4KSA9PiAhIXgpOyAvLyBmaWx0ZXIgbnVsbHNcbiAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChpdGVtcykudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBQYXJzZVN0YXR1cy5tZXJnZUFycmF5KHN0YXR1cywgcmVzdWx0cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBQYXJzZVN0YXR1cy5tZXJnZUFycmF5KHN0YXR1cywgaXRlbXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBpdGVtcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5pdGVtcztcbiAgICB9XG4gICAgcmVzdChyZXN0KSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kVHVwbGUoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgcmVzdCxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuWm9kVHVwbGUuY3JlYXRlID0gKHNjaGVtYXMsIHBhcmFtcykgPT4ge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShzY2hlbWFzKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgbXVzdCBwYXNzIGFuIGFycmF5IG9mIHNjaGVtYXMgdG8gei50dXBsZShbIC4uLiBdKVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBab2RUdXBsZSh7XG4gICAgICAgIGl0ZW1zOiBzY2hlbWFzLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFR1cGxlLFxuICAgICAgICByZXN0OiBudWxsLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZFJlY29yZCBleHRlbmRzIFpvZFR5cGUge1xuICAgIGdldCBrZXlTY2hlbWEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYua2V5VHlwZTtcbiAgICB9XG4gICAgZ2V0IHZhbHVlU2NoZW1hKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnZhbHVlVHlwZTtcbiAgICB9XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgc3RhdHVzLCBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGlmIChjdHgucGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5vYmplY3QpIHtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUub2JqZWN0LFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFpcnMgPSBbXTtcbiAgICAgICAgY29uc3Qga2V5VHlwZSA9IHRoaXMuX2RlZi5rZXlUeXBlO1xuICAgICAgICBjb25zdCB2YWx1ZVR5cGUgPSB0aGlzLl9kZWYudmFsdWVUeXBlO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjdHguZGF0YSkge1xuICAgICAgICAgICAgcGFpcnMucHVzaCh7XG4gICAgICAgICAgICAgICAga2V5OiBrZXlUeXBlLl9wYXJzZShuZXcgUGFyc2VJbnB1dExhenlQYXRoKGN0eCwga2V5LCBjdHgucGF0aCwga2V5KSksXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlVHlwZS5fcGFyc2UobmV3IFBhcnNlSW5wdXRMYXp5UGF0aChjdHgsIGN0eC5kYXRhW2tleV0sIGN0eC5wYXRoLCBrZXkpKSxcbiAgICAgICAgICAgICAgICBhbHdheXNTZXQ6IGtleSBpbiBjdHguZGF0YSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gUGFyc2VTdGF0dXMubWVyZ2VPYmplY3RBc3luYyhzdGF0dXMsIHBhaXJzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBQYXJzZVN0YXR1cy5tZXJnZU9iamVjdFN5bmMoc3RhdHVzLCBwYWlycyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IGVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYudmFsdWVUeXBlO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKGZpcnN0LCBzZWNvbmQsIHRoaXJkKSB7XG4gICAgICAgIGlmIChzZWNvbmQgaW5zdGFuY2VvZiBab2RUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFpvZFJlY29yZCh7XG4gICAgICAgICAgICAgICAga2V5VHlwZTogZmlyc3QsXG4gICAgICAgICAgICAgICAgdmFsdWVUeXBlOiBzZWNvbmQsXG4gICAgICAgICAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RSZWNvcmQsXG4gICAgICAgICAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyh0aGlyZCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFpvZFJlY29yZCh7XG4gICAgICAgICAgICBrZXlUeXBlOiBab2RTdHJpbmcuY3JlYXRlKCksXG4gICAgICAgICAgICB2YWx1ZVR5cGU6IGZpcnN0LFxuICAgICAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RSZWNvcmQsXG4gICAgICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHNlY29uZCksXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBab2RNYXAgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBnZXQga2V5U2NoZW1hKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmtleVR5cGU7XG4gICAgfVxuICAgIGdldCB2YWx1ZVNjaGVtYSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi52YWx1ZVR5cGU7XG4gICAgfVxuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IHN0YXR1cywgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBpZiAoY3R4LnBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUubWFwKSB7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLm1hcCxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGtleVR5cGUgPSB0aGlzLl9kZWYua2V5VHlwZTtcbiAgICAgICAgY29uc3QgdmFsdWVUeXBlID0gdGhpcy5fZGVmLnZhbHVlVHlwZTtcbiAgICAgICAgY29uc3QgcGFpcnMgPSBbLi4uY3R4LmRhdGEuZW50cmllcygpXS5tYXAoKFtrZXksIHZhbHVlXSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAga2V5OiBrZXlUeXBlLl9wYXJzZShuZXcgUGFyc2VJbnB1dExhenlQYXRoKGN0eCwga2V5LCBjdHgucGF0aCwgW2luZGV4LCBcImtleVwiXSkpLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVR5cGUuX3BhcnNlKG5ldyBQYXJzZUlucHV0TGF6eVBhdGgoY3R4LCB2YWx1ZSwgY3R4LnBhdGgsIFtpbmRleCwgXCJ2YWx1ZVwiXSkpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jKSB7XG4gICAgICAgICAgICBjb25zdCBmaW5hbE1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKS50aGVuKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHBhaXIgb2YgcGFpcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYXdhaXQgcGFpci5rZXk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gYXdhaXQgcGFpci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleS5zdGF0dXMgPT09IFwiYWJvcnRlZFwiIHx8IHZhbHVlLnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkuc3RhdHVzID09PSBcImRpcnR5XCIgfHwgdmFsdWUuc3RhdHVzID09PSBcImRpcnR5XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsTWFwLnNldChrZXkudmFsdWUsIHZhbHVlLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMudmFsdWUsIHZhbHVlOiBmaW5hbE1hcCB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBmaW5hbE1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGFpciBvZiBwYWlycykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHBhaXIua2V5O1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcGFpci52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5LnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIgfHwgdmFsdWUuc3RhdHVzID09PSBcImFib3J0ZWRcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGtleS5zdGF0dXMgPT09IFwiZGlydHlcIiB8fCB2YWx1ZS5zdGF0dXMgPT09IFwiZGlydHlcIikge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluYWxNYXAuc2V0KGtleS52YWx1ZSwgdmFsdWUudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMudmFsdWUsIHZhbHVlOiBmaW5hbE1hcCB9O1xuICAgICAgICB9XG4gICAgfVxufVxuWm9kTWFwLmNyZWF0ZSA9IChrZXlUeXBlLCB2YWx1ZVR5cGUsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kTWFwKHtcbiAgICAgICAgdmFsdWVUeXBlLFxuICAgICAgICBrZXlUeXBlLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE1hcCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RTZXQgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBzdGF0dXMsIGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgaWYgKGN0eC5wYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLnNldCkge1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5zZXQsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWYgPSB0aGlzLl9kZWY7XG4gICAgICAgIGlmIChkZWYubWluU2l6ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGN0eC5kYXRhLnNpemUgPCBkZWYubWluU2l6ZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX3NtYWxsLFxuICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiBkZWYubWluU2l6ZS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzZXRcIixcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBleGFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGRlZi5taW5TaXplLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlZi5tYXhTaXplICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY3R4LmRhdGEuc2l6ZSA+IGRlZi5tYXhTaXplLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fYmlnLFxuICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiBkZWYubWF4U2l6ZS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzZXRcIixcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBleGFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGRlZi5tYXhTaXplLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmFsdWVUeXBlID0gdGhpcy5fZGVmLnZhbHVlVHlwZTtcbiAgICAgICAgZnVuY3Rpb24gZmluYWxpemVTZXQoZWxlbWVudHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZFNldCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBlbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnN0YXR1cyA9PT0gXCJkaXJ0eVwiKVxuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICBwYXJzZWRTZXQuYWRkKGVsZW1lbnQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMudmFsdWUsIHZhbHVlOiBwYXJzZWRTZXQgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbGVtZW50cyA9IFsuLi5jdHguZGF0YS52YWx1ZXMoKV0ubWFwKChpdGVtLCBpKSA9PiB2YWx1ZVR5cGUuX3BhcnNlKG5ldyBQYXJzZUlucHV0TGF6eVBhdGgoY3R4LCBpdGVtLCBjdHgucGF0aCwgaSkpKTtcbiAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChlbGVtZW50cykudGhlbigoZWxlbWVudHMpID0+IGZpbmFsaXplU2V0KGVsZW1lbnRzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmluYWxpemVTZXQoZWxlbWVudHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIG1pbihtaW5TaXplLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kU2V0KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIG1pblNpemU6IHsgdmFsdWU6IG1pblNpemUsIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbWF4KG1heFNpemUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RTZXQoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgbWF4U2l6ZTogeyB2YWx1ZTogbWF4U2l6ZSwgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaXplKHNpemUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWluKHNpemUsIG1lc3NhZ2UpLm1heChzaXplLCBtZXNzYWdlKTtcbiAgICB9XG4gICAgbm9uZW1wdHkobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5taW4oMSwgbWVzc2FnZSk7XG4gICAgfVxufVxuWm9kU2V0LmNyZWF0ZSA9ICh2YWx1ZVR5cGUsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kU2V0KHtcbiAgICAgICAgdmFsdWVUeXBlLFxuICAgICAgICBtaW5TaXplOiBudWxsLFxuICAgICAgICBtYXhTaXplOiBudWxsLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFNldCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RGdW5jdGlvbiBleHRlbmRzIFpvZFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnZhbGlkYXRlID0gdGhpcy5pbXBsZW1lbnQ7XG4gICAgfVxuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgaWYgKGN0eC5wYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLmZ1bmN0aW9uKSB7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLmZ1bmN0aW9uLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWFrZUFyZ3NJc3N1ZShhcmdzLCBlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIG1ha2VJc3N1ZSh7XG4gICAgICAgICAgICAgICAgZGF0YTogYXJncyxcbiAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICBlcnJvck1hcHM6IFtjdHguY29tbW9uLmNvbnRleHR1YWxFcnJvck1hcCwgY3R4LnNjaGVtYUVycm9yTWFwLCBnZXRFcnJvck1hcCgpLCBkZWZhdWx0RXJyb3JNYXBdLmZpbHRlcigoeCkgPT4gISF4KSxcbiAgICAgICAgICAgICAgICBpc3N1ZURhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfYXJndW1lbnRzLFxuICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHNFcnJvcjogZXJyb3IsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG1ha2VSZXR1cm5zSXNzdWUocmV0dXJucywgZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBtYWtlSXNzdWUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHJldHVybnMsXG4gICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgZXJyb3JNYXBzOiBbY3R4LmNvbW1vbi5jb250ZXh0dWFsRXJyb3JNYXAsIGN0eC5zY2hlbWFFcnJvck1hcCwgZ2V0RXJyb3JNYXAoKSwgZGVmYXVsdEVycm9yTWFwXS5maWx0ZXIoKHgpID0+ICEheCksXG4gICAgICAgICAgICAgICAgaXNzdWVEYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3JldHVybl90eXBlLFxuICAgICAgICAgICAgICAgICAgICByZXR1cm5UeXBlRXJyb3I6IGVycm9yLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYXJhbXMgPSB7IGVycm9yTWFwOiBjdHguY29tbW9uLmNvbnRleHR1YWxFcnJvck1hcCB9O1xuICAgICAgICBjb25zdCBmbiA9IGN0eC5kYXRhO1xuICAgICAgICBpZiAodGhpcy5fZGVmLnJldHVybnMgaW5zdGFuY2VvZiBab2RQcm9taXNlKSB7XG4gICAgICAgICAgICAvLyBXb3VsZCBsb3ZlIGEgd2F5IHRvIGF2b2lkIGRpc2FibGluZyB0aGlzIHJ1bGUsIGJ1dCB3ZSBuZWVkXG4gICAgICAgICAgICAvLyBhbiBhbGlhcyAodXNpbmcgYW4gYXJyb3cgZnVuY3Rpb24gd2FzIHdoYXQgY2F1c2VkIDI2NTEpLlxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG4gICAgICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gT0soYXN5bmMgZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBab2RFcnJvcihbXSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkQXJncyA9IGF3YWl0IG1lLl9kZWYuYXJncy5wYXJzZUFzeW5jKGFyZ3MsIHBhcmFtcykuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IuYWRkSXNzdWUobWFrZUFyZ3NJc3N1ZShhcmdzLCBlKSk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IFJlZmxlY3QuYXBwbHkoZm4sIHRoaXMsIHBhcnNlZEFyZ3MpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZFJldHVybnMgPSBhd2FpdCBtZS5fZGVmLnJldHVybnMuX2RlZi50eXBlXG4gICAgICAgICAgICAgICAgICAgIC5wYXJzZUFzeW5jKHJlc3VsdCwgcGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IuYWRkSXNzdWUobWFrZVJldHVybnNJc3N1ZShyZXN1bHQsIGUpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZFJldHVybnM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFdvdWxkIGxvdmUgYSB3YXkgdG8gYXZvaWQgZGlzYWJsaW5nIHRoaXMgcnVsZSwgYnV0IHdlIG5lZWRcbiAgICAgICAgICAgIC8vIGFuIGFsaWFzICh1c2luZyBhbiBhcnJvdyBmdW5jdGlvbiB3YXMgd2hhdCBjYXVzZWQgMjY1MSkuXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXRoaXMtYWxpYXNcbiAgICAgICAgICAgIGNvbnN0IG1lID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBPSyhmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZEFyZ3MgPSBtZS5fZGVmLmFyZ3Muc2FmZVBhcnNlKGFyZ3MsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgaWYgKCFwYXJzZWRBcmdzLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFpvZEVycm9yKFttYWtlQXJnc0lzc3VlKGFyZ3MsIHBhcnNlZEFyZ3MuZXJyb3IpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuYXBwbHkoZm4sIHRoaXMsIHBhcnNlZEFyZ3MuZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkUmV0dXJucyA9IG1lLl9kZWYucmV0dXJucy5zYWZlUGFyc2UocmVzdWx0LCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGlmICghcGFyc2VkUmV0dXJucy5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBab2RFcnJvcihbbWFrZVJldHVybnNJc3N1ZShyZXN1bHQsIHBhcnNlZFJldHVybnMuZXJyb3IpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWRSZXR1cm5zLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwYXJhbWV0ZXJzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmFyZ3M7XG4gICAgfVxuICAgIHJldHVyblR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYucmV0dXJucztcbiAgICB9XG4gICAgYXJncyguLi5pdGVtcykge1xuICAgICAgICByZXR1cm4gbmV3IFpvZEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGFyZ3M6IFpvZFR1cGxlLmNyZWF0ZShpdGVtcykucmVzdChab2RVbmtub3duLmNyZWF0ZSgpKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybnMocmV0dXJuVHlwZSkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIHJldHVybnM6IHJldHVyblR5cGUsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpbXBsZW1lbnQoZnVuYykge1xuICAgICAgICBjb25zdCB2YWxpZGF0ZWRGdW5jID0gdGhpcy5wYXJzZShmdW5jKTtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlZEZ1bmM7XG4gICAgfVxuICAgIHN0cmljdEltcGxlbWVudChmdW5jKSB7XG4gICAgICAgIGNvbnN0IHZhbGlkYXRlZEZ1bmMgPSB0aGlzLnBhcnNlKGZ1bmMpO1xuICAgICAgICByZXR1cm4gdmFsaWRhdGVkRnVuYztcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShhcmdzLCByZXR1cm5zLCBwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RGdW5jdGlvbih7XG4gICAgICAgICAgICBhcmdzOiAoYXJncyA/IGFyZ3MgOiBab2RUdXBsZS5jcmVhdGUoW10pLnJlc3QoWm9kVW5rbm93bi5jcmVhdGUoKSkpLFxuICAgICAgICAgICAgcmV0dXJuczogcmV0dXJucyB8fCBab2RVbmtub3duLmNyZWF0ZSgpLFxuICAgICAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RGdW5jdGlvbixcbiAgICAgICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFpvZExhenkgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBnZXQgc2NoZW1hKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmdldHRlcigpO1xuICAgIH1cbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGNvbnN0IGxhenlTY2hlbWEgPSB0aGlzLl9kZWYuZ2V0dGVyKCk7XG4gICAgICAgIHJldHVybiBsYXp5U2NoZW1hLl9wYXJzZSh7IGRhdGE6IGN0eC5kYXRhLCBwYXRoOiBjdHgucGF0aCwgcGFyZW50OiBjdHggfSk7XG4gICAgfVxufVxuWm9kTGF6eS5jcmVhdGUgPSAoZ2V0dGVyLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZExhenkoe1xuICAgICAgICBnZXR0ZXI6IGdldHRlcixcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RMYXp5LFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZExpdGVyYWwgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgaWYgKGlucHV0LmRhdGEgIT09IHRoaXMuX2RlZi52YWx1ZSkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX2xpdGVyYWwsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IHRoaXMuX2RlZi52YWx1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBcInZhbGlkXCIsIHZhbHVlOiBpbnB1dC5kYXRhIH07XG4gICAgfVxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi52YWx1ZTtcbiAgICB9XG59XG5ab2RMaXRlcmFsLmNyZWF0ZSA9ICh2YWx1ZSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RMaXRlcmFsKHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZExpdGVyYWwsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5mdW5jdGlvbiBjcmVhdGVab2RFbnVtKHZhbHVlcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBab2RFbnVtKHtcbiAgICAgICAgdmFsdWVzLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEVudW0sXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjbGFzcyBab2RFbnVtIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQuZGF0YSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWRWYWx1ZXMgPSB0aGlzLl9kZWYudmFsdWVzO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IHV0aWwuam9pblZhbHVlcyhleHBlY3RlZFZhbHVlcyksXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fY2FjaGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlID0gbmV3IFNldCh0aGlzLl9kZWYudmFsdWVzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2NhY2hlLmhhcyhpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWRWYWx1ZXMgPSB0aGlzLl9kZWYudmFsdWVzO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX2VudW1fdmFsdWUsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogZXhwZWN0ZWRWYWx1ZXMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPSyhpbnB1dC5kYXRhKTtcbiAgICB9XG4gICAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYudmFsdWVzO1xuICAgIH1cbiAgICBnZXQgZW51bSgpIHtcbiAgICAgICAgY29uc3QgZW51bVZhbHVlcyA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IHZhbCBvZiB0aGlzLl9kZWYudmFsdWVzKSB7XG4gICAgICAgICAgICBlbnVtVmFsdWVzW3ZhbF0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVudW1WYWx1ZXM7XG4gICAgfVxuICAgIGdldCBWYWx1ZXMoKSB7XG4gICAgICAgIGNvbnN0IGVudW1WYWx1ZXMgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCB2YWwgb2YgdGhpcy5fZGVmLnZhbHVlcykge1xuICAgICAgICAgICAgZW51bVZhbHVlc1t2YWxdID0gdmFsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbnVtVmFsdWVzO1xuICAgIH1cbiAgICBnZXQgRW51bSgpIHtcbiAgICAgICAgY29uc3QgZW51bVZhbHVlcyA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IHZhbCBvZiB0aGlzLl9kZWYudmFsdWVzKSB7XG4gICAgICAgICAgICBlbnVtVmFsdWVzW3ZhbF0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVudW1WYWx1ZXM7XG4gICAgfVxuICAgIGV4dHJhY3QodmFsdWVzLCBuZXdEZWYgPSB0aGlzLl9kZWYpIHtcbiAgICAgICAgcmV0dXJuIFpvZEVudW0uY3JlYXRlKHZhbHVlcywge1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgLi4ubmV3RGVmLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXhjbHVkZSh2YWx1ZXMsIG5ld0RlZiA9IHRoaXMuX2RlZikge1xuICAgICAgICByZXR1cm4gWm9kRW51bS5jcmVhdGUodGhpcy5vcHRpb25zLmZpbHRlcigob3B0KSA9PiAhdmFsdWVzLmluY2x1ZGVzKG9wdCkpLCB7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICAuLi5uZXdEZWYsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblpvZEVudW0uY3JlYXRlID0gY3JlYXRlWm9kRW51bTtcbmV4cG9ydCBjbGFzcyBab2ROYXRpdmVFbnVtIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IG5hdGl2ZUVudW1WYWx1ZXMgPSB1dGlsLmdldFZhbGlkRW51bVZhbHVlcyh0aGlzLl9kZWYudmFsdWVzKTtcbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICBpZiAoY3R4LnBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUuc3RyaW5nICYmIGN0eC5wYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLm51bWJlcikge1xuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWRWYWx1ZXMgPSB1dGlsLm9iamVjdFZhbHVlcyhuYXRpdmVFbnVtVmFsdWVzKTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiB1dGlsLmpvaW5WYWx1ZXMoZXhwZWN0ZWRWYWx1ZXMpLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX2NhY2hlKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWNoZSA9IG5ldyBTZXQodXRpbC5nZXRWYWxpZEVudW1WYWx1ZXModGhpcy5fZGVmLnZhbHVlcykpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fY2FjaGUuaGFzKGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZFZhbHVlcyA9IHV0aWwub2JqZWN0VmFsdWVzKG5hdGl2ZUVudW1WYWx1ZXMpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX2VudW1fdmFsdWUsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogZXhwZWN0ZWRWYWx1ZXMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPSyhpbnB1dC5kYXRhKTtcbiAgICB9XG4gICAgZ2V0IGVudW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYudmFsdWVzO1xuICAgIH1cbn1cblpvZE5hdGl2ZUVudW0uY3JlYXRlID0gKHZhbHVlcywgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2ROYXRpdmVFbnVtKHtcbiAgICAgICAgdmFsdWVzOiB2YWx1ZXMsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kTmF0aXZlRW51bSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RQcm9taXNlIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgdW53cmFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnR5cGU7XG4gICAgfVxuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgaWYgKGN0eC5wYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLnByb21pc2UgJiYgY3R4LmNvbW1vbi5hc3luYyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUucHJvbWlzZSxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByb21pc2lmaWVkID0gY3R4LnBhcnNlZFR5cGUgPT09IFpvZFBhcnNlZFR5cGUucHJvbWlzZSA/IGN0eC5kYXRhIDogUHJvbWlzZS5yZXNvbHZlKGN0eC5kYXRhKTtcbiAgICAgICAgcmV0dXJuIE9LKHByb21pc2lmaWVkLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZWYudHlwZS5wYXJzZUFzeW5jKGRhdGEsIHtcbiAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICBlcnJvck1hcDogY3R4LmNvbW1vbi5jb250ZXh0dWFsRXJyb3JNYXAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkpO1xuICAgIH1cbn1cblpvZFByb21pc2UuY3JlYXRlID0gKHNjaGVtYSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RQcm9taXNlKHtcbiAgICAgICAgdHlwZTogc2NoZW1hLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFByb21pc2UsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kRWZmZWN0cyBleHRlbmRzIFpvZFR5cGUge1xuICAgIGlubmVyVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5zY2hlbWE7XG4gICAgfVxuICAgIHNvdXJjZVR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuc2NoZW1hLl9kZWYudHlwZU5hbWUgPT09IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RFZmZlY3RzXG4gICAgICAgICAgICA/IHRoaXMuX2RlZi5zY2hlbWEuc291cmNlVHlwZSgpXG4gICAgICAgICAgICA6IHRoaXMuX2RlZi5zY2hlbWE7XG4gICAgfVxuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IHN0YXR1cywgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBjb25zdCBlZmZlY3QgPSB0aGlzLl9kZWYuZWZmZWN0IHx8IG51bGw7XG4gICAgICAgIGNvbnN0IGNoZWNrQ3R4ID0ge1xuICAgICAgICAgICAgYWRkSXNzdWU6IChhcmcpID0+IHtcbiAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIGFyZyk7XG4gICAgICAgICAgICAgICAgaWYgKGFyZy5mYXRhbCkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuYWJvcnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXQgcGF0aCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3R4LnBhdGg7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBjaGVja0N0eC5hZGRJc3N1ZSA9IGNoZWNrQ3R4LmFkZElzc3VlLmJpbmQoY2hlY2tDdHgpO1xuICAgICAgICBpZiAoZWZmZWN0LnR5cGUgPT09IFwicHJlcHJvY2Vzc1wiKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9jZXNzZWQgPSBlZmZlY3QudHJhbnNmb3JtKGN0eC5kYXRhLCBjaGVja0N0eCk7XG4gICAgICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocHJvY2Vzc2VkKS50aGVuKGFzeW5jIChwcm9jZXNzZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cy52YWx1ZSA9PT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5fZGVmLnNjaGVtYS5fcGFyc2VBc3luYyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBwcm9jZXNzZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSBcImRpcnR5XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRElSVFkocmVzdWx0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cy52YWx1ZSA9PT0gXCJkaXJ0eVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERJUlRZKHJlc3VsdC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzLnZhbHVlID09PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fZGVmLnNjaGVtYS5fcGFyc2VTeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogcHJvY2Vzc2VkLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gXCJkaXJ0eVwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRElSVFkocmVzdWx0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzLnZhbHVlID09PSBcImRpcnR5XCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBESVJUWShyZXN1bHQudmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVmZmVjdC50eXBlID09PSBcInJlZmluZW1lbnRcIikge1xuICAgICAgICAgICAgY29uc3QgZXhlY3V0ZVJlZmluZW1lbnQgPSAoYWNjKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZWZmZWN0LnJlZmluZW1lbnQoYWNjLCBjaGVja0N0eCk7XG4gICAgICAgICAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBc3luYyByZWZpbmVtZW50IGVuY291bnRlcmVkIGR1cmluZyBzeW5jaHJvbm91cyBwYXJzZSBvcGVyYXRpb24uIFVzZSAucGFyc2VBc3luYyBpbnN0ZWFkLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbm5lciA9IHRoaXMuX2RlZi5zY2hlbWEuX3BhcnNlU3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGlubmVyLnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgICAgIGlmIChpbm5lci5zdGF0dXMgPT09IFwiZGlydHlcIilcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIHZhbHVlIGlzIGlnbm9yZWRcbiAgICAgICAgICAgICAgICBleGVjdXRlUmVmaW5lbWVudChpbm5lci52YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMudmFsdWUsIHZhbHVlOiBpbm5lci52YWx1ZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5zY2hlbWEuX3BhcnNlQXN5bmMoeyBkYXRhOiBjdHguZGF0YSwgcGF0aDogY3R4LnBhdGgsIHBhcmVudDogY3R4IH0pLnRoZW4oKGlubmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbm5lci5zdGF0dXMgPT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbm5lci5zdGF0dXMgPT09IFwiZGlydHlcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXhlY3V0ZVJlZmluZW1lbnQoaW5uZXIudmFsdWUpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMudmFsdWUsIHZhbHVlOiBpbm5lci52YWx1ZSB9O1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZWZmZWN0LnR5cGUgPT09IFwidHJhbnNmb3JtXCIpIHtcbiAgICAgICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhc2UgPSB0aGlzLl9kZWYuc2NoZW1hLl9wYXJzZVN5bmMoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZChiYXNlKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZWZmZWN0LnRyYW5zZm9ybShiYXNlLnZhbHVlLCBjaGVja0N0eCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBc3luY2hyb25vdXMgdHJhbnNmb3JtIGVuY291bnRlcmVkIGR1cmluZyBzeW5jaHJvbm91cyBwYXJzZSBvcGVyYXRpb24uIFVzZSAucGFyc2VBc3luYyBpbnN0ZWFkLmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cy52YWx1ZSwgdmFsdWU6IHJlc3VsdCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5zY2hlbWEuX3BhcnNlQXN5bmMoeyBkYXRhOiBjdHguZGF0YSwgcGF0aDogY3R4LnBhdGgsIHBhcmVudDogY3R4IH0pLnRoZW4oKGJhc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKGJhc2UpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZWZmZWN0LnRyYW5zZm9ybShiYXNlLnZhbHVlLCBjaGVja0N0eCkpLnRoZW4oKHJlc3VsdCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHV0aWwuYXNzZXJ0TmV2ZXIoZWZmZWN0KTtcbiAgICB9XG59XG5ab2RFZmZlY3RzLmNyZWF0ZSA9IChzY2hlbWEsIGVmZmVjdCwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RFZmZlY3RzKHtcbiAgICAgICAgc2NoZW1hLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEVmZmVjdHMsXG4gICAgICAgIGVmZmVjdCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcblpvZEVmZmVjdHMuY3JlYXRlV2l0aFByZXByb2Nlc3MgPSAocHJlcHJvY2Vzcywgc2NoZW1hLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZEVmZmVjdHMoe1xuICAgICAgICBzY2hlbWEsXG4gICAgICAgIGVmZmVjdDogeyB0eXBlOiBcInByZXByb2Nlc3NcIiwgdHJhbnNmb3JtOiBwcmVwcm9jZXNzIH0sXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kRWZmZWN0cyxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCB7IFpvZEVmZmVjdHMgYXMgWm9kVHJhbnNmb3JtZXIgfTtcbmV4cG9ydCBjbGFzcyBab2RPcHRpb25hbCBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlID09PSBab2RQYXJzZWRUeXBlLnVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIE9LKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5pbm5lclR5cGUuX3BhcnNlKGlucHV0KTtcbiAgICB9XG4gICAgdW53cmFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmlubmVyVHlwZTtcbiAgICB9XG59XG5ab2RPcHRpb25hbC5jcmVhdGUgPSAodHlwZSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RPcHRpb25hbCh7XG4gICAgICAgIGlubmVyVHlwZTogdHlwZSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RPcHRpb25hbCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2ROdWxsYWJsZSBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlID09PSBab2RQYXJzZWRUeXBlLm51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBPSyhudWxsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmlubmVyVHlwZS5fcGFyc2UoaW5wdXQpO1xuICAgIH1cbiAgICB1bndyYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuaW5uZXJUeXBlO1xuICAgIH1cbn1cblpvZE51bGxhYmxlLmNyZWF0ZSA9ICh0eXBlLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZE51bGxhYmxlKHtcbiAgICAgICAgaW5uZXJUeXBlOiB0eXBlLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE51bGxhYmxlLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZERlZmF1bHQgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGxldCBkYXRhID0gY3R4LmRhdGE7XG4gICAgICAgIGlmIChjdHgucGFyc2VkVHlwZSA9PT0gWm9kUGFyc2VkVHlwZS51bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9kZWYuZGVmYXVsdFZhbHVlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5pbm5lclR5cGUuX3BhcnNlKHtcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVtb3ZlRGVmYXVsdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5pbm5lclR5cGU7XG4gICAgfVxufVxuWm9kRGVmYXVsdC5jcmVhdGUgPSAodHlwZSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2REZWZhdWx0KHtcbiAgICAgICAgaW5uZXJUeXBlOiB0eXBlLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZERlZmF1bHQsXG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdHlwZW9mIHBhcmFtcy5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgPyBwYXJhbXMuZGVmYXVsdCA6ICgpID0+IHBhcmFtcy5kZWZhdWx0LFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZENhdGNoIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICAvLyBuZXdDdHggaXMgdXNlZCB0byBub3QgY29sbGVjdCBpc3N1ZXMgZnJvbSBpbm5lciB0eXBlcyBpbiBjdHhcbiAgICAgICAgY29uc3QgbmV3Q3R4ID0ge1xuICAgICAgICAgICAgLi4uY3R4LFxuICAgICAgICAgICAgY29tbW9uOiB7XG4gICAgICAgICAgICAgICAgLi4uY3R4LmNvbW1vbixcbiAgICAgICAgICAgICAgICBpc3N1ZXM6IFtdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fZGVmLmlubmVyVHlwZS5fcGFyc2Uoe1xuICAgICAgICAgICAgZGF0YTogbmV3Q3R4LmRhdGEsXG4gICAgICAgICAgICBwYXRoOiBuZXdDdHgucGF0aCxcbiAgICAgICAgICAgIHBhcmVudDoge1xuICAgICAgICAgICAgICAgIC4uLm5ld0N0eCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoaXNBc3luYyhyZXN1bHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogXCJ2YWxpZFwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnN0YXR1cyA9PT0gXCJ2YWxpZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHJlc3VsdC52YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLl9kZWYuY2F0Y2hWYWx1ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0IGVycm9yKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFpvZEVycm9yKG5ld0N0eC5jb21tb24uaXNzdWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBuZXdDdHguZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInZhbGlkXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlc3VsdC5zdGF0dXMgPT09IFwidmFsaWRcIlxuICAgICAgICAgICAgICAgICAgICA/IHJlc3VsdC52YWx1ZVxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuX2RlZi5jYXRjaFZhbHVlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldCBlcnJvcigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFpvZEVycm9yKG5ld0N0eC5jb21tb24uaXNzdWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dDogbmV3Q3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW1vdmVDYXRjaCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5pbm5lclR5cGU7XG4gICAgfVxufVxuWm9kQ2F0Y2guY3JlYXRlID0gKHR5cGUsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kQ2F0Y2goe1xuICAgICAgICBpbm5lclR5cGU6IHR5cGUsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kQ2F0Y2gsXG4gICAgICAgIGNhdGNoVmFsdWU6IHR5cGVvZiBwYXJhbXMuY2F0Y2ggPT09IFwiZnVuY3Rpb25cIiA/IHBhcmFtcy5jYXRjaCA6ICgpID0+IHBhcmFtcy5jYXRjaCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2ROYU4gZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5uYW4pIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUubmFuLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBcInZhbGlkXCIsIHZhbHVlOiBpbnB1dC5kYXRhIH07XG4gICAgfVxufVxuWm9kTmFOLmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZE5hTih7XG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kTmFOLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNvbnN0IEJSQU5EID0gU3ltYm9sKFwiem9kX2JyYW5kXCIpO1xuZXhwb3J0IGNsYXNzIFpvZEJyYW5kZWQgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBjdHguZGF0YTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi50eXBlLl9wYXJzZSh7XG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHVud3JhcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi50eXBlO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBab2RQaXBlbGluZSBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IHN0YXR1cywgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYykge1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlQXN5bmMgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5SZXN1bHQgPSBhd2FpdCB0aGlzLl9kZWYuaW4uX3BhcnNlQXN5bmMoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChpblJlc3VsdC5zdGF0dXMgPT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgICAgICBpZiAoaW5SZXN1bHQuc3RhdHVzID09PSBcImRpcnR5XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBESVJUWShpblJlc3VsdC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGVmLm91dC5fcGFyc2VBc3luYyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBpblJlc3VsdC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlQXN5bmMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGluUmVzdWx0ID0gdGhpcy5fZGVmLmluLl9wYXJzZVN5bmMoe1xuICAgICAgICAgICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoaW5SZXN1bHQuc3RhdHVzID09PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgIGlmIChpblJlc3VsdC5zdGF0dXMgPT09IFwiZGlydHlcIikge1xuICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogXCJkaXJ0eVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogaW5SZXN1bHQudmFsdWUsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZWYub3V0Ll9wYXJzZVN5bmMoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBpblJlc3VsdC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUoYSwgYikge1xuICAgICAgICByZXR1cm4gbmV3IFpvZFBpcGVsaW5lKHtcbiAgICAgICAgICAgIGluOiBhLFxuICAgICAgICAgICAgb3V0OiBiLFxuICAgICAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RQaXBlbGluZSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFpvZFJlYWRvbmx5IGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX2RlZi5pbm5lclR5cGUuX3BhcnNlKGlucHV0KTtcbiAgICAgICAgY29uc3QgZnJlZXplID0gKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChpc1ZhbGlkKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgZGF0YS52YWx1ZSA9IE9iamVjdC5mcmVlemUoZGF0YS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGlzQXN5bmMocmVzdWx0KSA/IHJlc3VsdC50aGVuKChkYXRhKSA9PiBmcmVlemUoZGF0YSkpIDogZnJlZXplKHJlc3VsdCk7XG4gICAgfVxuICAgIHVud3JhcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5pbm5lclR5cGU7XG4gICAgfVxufVxuWm9kUmVhZG9ubHkuY3JlYXRlID0gKHR5cGUsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kUmVhZG9ubHkoe1xuICAgICAgICBpbm5lclR5cGU6IHR5cGUsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kUmVhZG9ubHksXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vICAgICAgICAgICAgICAgICAgICAvLy8vLy8vLy8vXG4vLy8vLy8vLy8vICAgICAgei5jdXN0b20gICAgICAvLy8vLy8vLy8vXG4vLy8vLy8vLy8vICAgICAgICAgICAgICAgICAgICAvLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5mdW5jdGlvbiBjbGVhblBhcmFtcyhwYXJhbXMsIGRhdGEpIHtcbiAgICBjb25zdCBwID0gdHlwZW9mIHBhcmFtcyA9PT0gXCJmdW5jdGlvblwiID8gcGFyYW1zKGRhdGEpIDogdHlwZW9mIHBhcmFtcyA9PT0gXCJzdHJpbmdcIiA/IHsgbWVzc2FnZTogcGFyYW1zIH0gOiBwYXJhbXM7XG4gICAgY29uc3QgcDIgPSB0eXBlb2YgcCA9PT0gXCJzdHJpbmdcIiA/IHsgbWVzc2FnZTogcCB9IDogcDtcbiAgICByZXR1cm4gcDI7XG59XG5leHBvcnQgZnVuY3Rpb24gY3VzdG9tKGNoZWNrLCBfcGFyYW1zID0ge30sIFxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICpcbiAqIFBhc3MgYGZhdGFsYCBpbnRvIHRoZSBwYXJhbXMgb2JqZWN0IGluc3RlYWQ6XG4gKlxuICogYGBgdHNcbiAqIHouc3RyaW5nKCkuY3VzdG9tKCh2YWwpID0+IHZhbC5sZW5ndGggPiA1LCB7IGZhdGFsOiBmYWxzZSB9KVxuICogYGBgXG4gKlxuICovXG5mYXRhbCkge1xuICAgIGlmIChjaGVjaylcbiAgICAgICAgcmV0dXJuIFpvZEFueS5jcmVhdGUoKS5zdXBlclJlZmluZSgoZGF0YSwgY3R4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByID0gY2hlY2soZGF0YSk7XG4gICAgICAgICAgICBpZiAociBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gci50aGVuKChyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gY2xlYW5QYXJhbXMoX3BhcmFtcywgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfZmF0YWwgPSBwYXJhbXMuZmF0YWwgPz8gZmF0YWwgPz8gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5hZGRJc3N1ZSh7IGNvZGU6IFwiY3VzdG9tXCIsIC4uLnBhcmFtcywgZmF0YWw6IF9mYXRhbCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gY2xlYW5QYXJhbXMoX3BhcmFtcywgZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc3QgX2ZhdGFsID0gcGFyYW1zLmZhdGFsID8/IGZhdGFsID8/IHRydWU7XG4gICAgICAgICAgICAgICAgY3R4LmFkZElzc3VlKHsgY29kZTogXCJjdXN0b21cIiwgLi4ucGFyYW1zLCBmYXRhbDogX2ZhdGFsIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9KTtcbiAgICByZXR1cm4gWm9kQW55LmNyZWF0ZSgpO1xufVxuZXhwb3J0IHsgWm9kVHlwZSBhcyBTY2hlbWEsIFpvZFR5cGUgYXMgWm9kU2NoZW1hIH07XG5leHBvcnQgY29uc3QgbGF0ZSA9IHtcbiAgICBvYmplY3Q6IFpvZE9iamVjdC5sYXp5Y3JlYXRlLFxufTtcbmV4cG9ydCB2YXIgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kO1xuKGZ1bmN0aW9uIChab2RGaXJzdFBhcnR5VHlwZUtpbmQpIHtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RTdHJpbmdcIl0gPSBcIlpvZFN0cmluZ1wiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZE51bWJlclwiXSA9IFwiWm9kTnVtYmVyXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kTmFOXCJdID0gXCJab2ROYU5cIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RCaWdJbnRcIl0gPSBcIlpvZEJpZ0ludFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZEJvb2xlYW5cIl0gPSBcIlpvZEJvb2xlYW5cIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2REYXRlXCJdID0gXCJab2REYXRlXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kU3ltYm9sXCJdID0gXCJab2RTeW1ib2xcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RVbmRlZmluZWRcIl0gPSBcIlpvZFVuZGVmaW5lZFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZE51bGxcIl0gPSBcIlpvZE51bGxcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RBbnlcIl0gPSBcIlpvZEFueVwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZFVua25vd25cIl0gPSBcIlpvZFVua25vd25cIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2ROZXZlclwiXSA9IFwiWm9kTmV2ZXJcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RWb2lkXCJdID0gXCJab2RWb2lkXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kQXJyYXlcIl0gPSBcIlpvZEFycmF5XCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kT2JqZWN0XCJdID0gXCJab2RPYmplY3RcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RVbmlvblwiXSA9IFwiWm9kVW5pb25cIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2REaXNjcmltaW5hdGVkVW5pb25cIl0gPSBcIlpvZERpc2NyaW1pbmF0ZWRVbmlvblwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZEludGVyc2VjdGlvblwiXSA9IFwiWm9kSW50ZXJzZWN0aW9uXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kVHVwbGVcIl0gPSBcIlpvZFR1cGxlXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kUmVjb3JkXCJdID0gXCJab2RSZWNvcmRcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RNYXBcIl0gPSBcIlpvZE1hcFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZFNldFwiXSA9IFwiWm9kU2V0XCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kRnVuY3Rpb25cIl0gPSBcIlpvZEZ1bmN0aW9uXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kTGF6eVwiXSA9IFwiWm9kTGF6eVwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZExpdGVyYWxcIl0gPSBcIlpvZExpdGVyYWxcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RFbnVtXCJdID0gXCJab2RFbnVtXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kRWZmZWN0c1wiXSA9IFwiWm9kRWZmZWN0c1wiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZE5hdGl2ZUVudW1cIl0gPSBcIlpvZE5hdGl2ZUVudW1cIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RPcHRpb25hbFwiXSA9IFwiWm9kT3B0aW9uYWxcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2ROdWxsYWJsZVwiXSA9IFwiWm9kTnVsbGFibGVcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2REZWZhdWx0XCJdID0gXCJab2REZWZhdWx0XCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kQ2F0Y2hcIl0gPSBcIlpvZENhdGNoXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kUHJvbWlzZVwiXSA9IFwiWm9kUHJvbWlzZVwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZEJyYW5kZWRcIl0gPSBcIlpvZEJyYW5kZWRcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RQaXBlbGluZVwiXSA9IFwiWm9kUGlwZWxpbmVcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RSZWFkb25seVwiXSA9IFwiWm9kUmVhZG9ubHlcIjtcbn0pKFpvZEZpcnN0UGFydHlUeXBlS2luZCB8fCAoWm9kRmlyc3RQYXJ0eVR5cGVLaW5kID0ge30pKTtcbi8vIHJlcXVpcmVzIFRTIDQuNCtcbmNsYXNzIENsYXNzIHtcbiAgICBjb25zdHJ1Y3RvciguLi5fKSB7IH1cbn1cbmNvbnN0IGluc3RhbmNlT2ZUeXBlID0gKFxuLy8gY29uc3QgaW5zdGFuY2VPZlR5cGUgPSA8VCBleHRlbmRzIG5ldyAoLi4uYXJnczogYW55W10pID0+IGFueT4oXG5jbHMsIHBhcmFtcyA9IHtcbiAgICBtZXNzYWdlOiBgSW5wdXQgbm90IGluc3RhbmNlIG9mICR7Y2xzLm5hbWV9YCxcbn0pID0+IGN1c3RvbSgoZGF0YSkgPT4gZGF0YSBpbnN0YW5jZW9mIGNscywgcGFyYW1zKTtcbmNvbnN0IHN0cmluZ1R5cGUgPSBab2RTdHJpbmcuY3JlYXRlO1xuY29uc3QgbnVtYmVyVHlwZSA9IFpvZE51bWJlci5jcmVhdGU7XG5jb25zdCBuYW5UeXBlID0gWm9kTmFOLmNyZWF0ZTtcbmNvbnN0IGJpZ0ludFR5cGUgPSBab2RCaWdJbnQuY3JlYXRlO1xuY29uc3QgYm9vbGVhblR5cGUgPSBab2RCb29sZWFuLmNyZWF0ZTtcbmNvbnN0IGRhdGVUeXBlID0gWm9kRGF0ZS5jcmVhdGU7XG5jb25zdCBzeW1ib2xUeXBlID0gWm9kU3ltYm9sLmNyZWF0ZTtcbmNvbnN0IHVuZGVmaW5lZFR5cGUgPSBab2RVbmRlZmluZWQuY3JlYXRlO1xuY29uc3QgbnVsbFR5cGUgPSBab2ROdWxsLmNyZWF0ZTtcbmNvbnN0IGFueVR5cGUgPSBab2RBbnkuY3JlYXRlO1xuY29uc3QgdW5rbm93blR5cGUgPSBab2RVbmtub3duLmNyZWF0ZTtcbmNvbnN0IG5ldmVyVHlwZSA9IFpvZE5ldmVyLmNyZWF0ZTtcbmNvbnN0IHZvaWRUeXBlID0gWm9kVm9pZC5jcmVhdGU7XG5jb25zdCBhcnJheVR5cGUgPSBab2RBcnJheS5jcmVhdGU7XG5jb25zdCBvYmplY3RUeXBlID0gWm9kT2JqZWN0LmNyZWF0ZTtcbmNvbnN0IHN0cmljdE9iamVjdFR5cGUgPSBab2RPYmplY3Quc3RyaWN0Q3JlYXRlO1xuY29uc3QgdW5pb25UeXBlID0gWm9kVW5pb24uY3JlYXRlO1xuY29uc3QgZGlzY3JpbWluYXRlZFVuaW9uVHlwZSA9IFpvZERpc2NyaW1pbmF0ZWRVbmlvbi5jcmVhdGU7XG5jb25zdCBpbnRlcnNlY3Rpb25UeXBlID0gWm9kSW50ZXJzZWN0aW9uLmNyZWF0ZTtcbmNvbnN0IHR1cGxlVHlwZSA9IFpvZFR1cGxlLmNyZWF0ZTtcbmNvbnN0IHJlY29yZFR5cGUgPSBab2RSZWNvcmQuY3JlYXRlO1xuY29uc3QgbWFwVHlwZSA9IFpvZE1hcC5jcmVhdGU7XG5jb25zdCBzZXRUeXBlID0gWm9kU2V0LmNyZWF0ZTtcbmNvbnN0IGZ1bmN0aW9uVHlwZSA9IFpvZEZ1bmN0aW9uLmNyZWF0ZTtcbmNvbnN0IGxhenlUeXBlID0gWm9kTGF6eS5jcmVhdGU7XG5jb25zdCBsaXRlcmFsVHlwZSA9IFpvZExpdGVyYWwuY3JlYXRlO1xuY29uc3QgZW51bVR5cGUgPSBab2RFbnVtLmNyZWF0ZTtcbmNvbnN0IG5hdGl2ZUVudW1UeXBlID0gWm9kTmF0aXZlRW51bS5jcmVhdGU7XG5jb25zdCBwcm9taXNlVHlwZSA9IFpvZFByb21pc2UuY3JlYXRlO1xuY29uc3QgZWZmZWN0c1R5cGUgPSBab2RFZmZlY3RzLmNyZWF0ZTtcbmNvbnN0IG9wdGlvbmFsVHlwZSA9IFpvZE9wdGlvbmFsLmNyZWF0ZTtcbmNvbnN0IG51bGxhYmxlVHlwZSA9IFpvZE51bGxhYmxlLmNyZWF0ZTtcbmNvbnN0IHByZXByb2Nlc3NUeXBlID0gWm9kRWZmZWN0cy5jcmVhdGVXaXRoUHJlcHJvY2VzcztcbmNvbnN0IHBpcGVsaW5lVHlwZSA9IFpvZFBpcGVsaW5lLmNyZWF0ZTtcbmNvbnN0IG9zdHJpbmcgPSAoKSA9PiBzdHJpbmdUeXBlKCkub3B0aW9uYWwoKTtcbmNvbnN0IG9udW1iZXIgPSAoKSA9PiBudW1iZXJUeXBlKCkub3B0aW9uYWwoKTtcbmNvbnN0IG9ib29sZWFuID0gKCkgPT4gYm9vbGVhblR5cGUoKS5vcHRpb25hbCgpO1xuZXhwb3J0IGNvbnN0IGNvZXJjZSA9IHtcbiAgICBzdHJpbmc6ICgoYXJnKSA9PiBab2RTdHJpbmcuY3JlYXRlKHsgLi4uYXJnLCBjb2VyY2U6IHRydWUgfSkpLFxuICAgIG51bWJlcjogKChhcmcpID0+IFpvZE51bWJlci5jcmVhdGUoeyAuLi5hcmcsIGNvZXJjZTogdHJ1ZSB9KSksXG4gICAgYm9vbGVhbjogKChhcmcpID0+IFpvZEJvb2xlYW4uY3JlYXRlKHtcbiAgICAgICAgLi4uYXJnLFxuICAgICAgICBjb2VyY2U6IHRydWUsXG4gICAgfSkpLFxuICAgIGJpZ2ludDogKChhcmcpID0+IFpvZEJpZ0ludC5jcmVhdGUoeyAuLi5hcmcsIGNvZXJjZTogdHJ1ZSB9KSksXG4gICAgZGF0ZTogKChhcmcpID0+IFpvZERhdGUuY3JlYXRlKHsgLi4uYXJnLCBjb2VyY2U6IHRydWUgfSkpLFxufTtcbmV4cG9ydCB7IGFueVR5cGUgYXMgYW55LCBhcnJheVR5cGUgYXMgYXJyYXksIGJpZ0ludFR5cGUgYXMgYmlnaW50LCBib29sZWFuVHlwZSBhcyBib29sZWFuLCBkYXRlVHlwZSBhcyBkYXRlLCBkaXNjcmltaW5hdGVkVW5pb25UeXBlIGFzIGRpc2NyaW1pbmF0ZWRVbmlvbiwgZWZmZWN0c1R5cGUgYXMgZWZmZWN0LCBlbnVtVHlwZSBhcyBlbnVtLCBmdW5jdGlvblR5cGUgYXMgZnVuY3Rpb24sIGluc3RhbmNlT2ZUeXBlIGFzIGluc3RhbmNlb2YsIGludGVyc2VjdGlvblR5cGUgYXMgaW50ZXJzZWN0aW9uLCBsYXp5VHlwZSBhcyBsYXp5LCBsaXRlcmFsVHlwZSBhcyBsaXRlcmFsLCBtYXBUeXBlIGFzIG1hcCwgbmFuVHlwZSBhcyBuYW4sIG5hdGl2ZUVudW1UeXBlIGFzIG5hdGl2ZUVudW0sIG5ldmVyVHlwZSBhcyBuZXZlciwgbnVsbFR5cGUgYXMgbnVsbCwgbnVsbGFibGVUeXBlIGFzIG51bGxhYmxlLCBudW1iZXJUeXBlIGFzIG51bWJlciwgb2JqZWN0VHlwZSBhcyBvYmplY3QsIG9ib29sZWFuLCBvbnVtYmVyLCBvcHRpb25hbFR5cGUgYXMgb3B0aW9uYWwsIG9zdHJpbmcsIHBpcGVsaW5lVHlwZSBhcyBwaXBlbGluZSwgcHJlcHJvY2Vzc1R5cGUgYXMgcHJlcHJvY2VzcywgcHJvbWlzZVR5cGUgYXMgcHJvbWlzZSwgcmVjb3JkVHlwZSBhcyByZWNvcmQsIHNldFR5cGUgYXMgc2V0LCBzdHJpY3RPYmplY3RUeXBlIGFzIHN0cmljdE9iamVjdCwgc3RyaW5nVHlwZSBhcyBzdHJpbmcsIHN5bWJvbFR5cGUgYXMgc3ltYm9sLCBlZmZlY3RzVHlwZSBhcyB0cmFuc2Zvcm1lciwgdHVwbGVUeXBlIGFzIHR1cGxlLCB1bmRlZmluZWRUeXBlIGFzIHVuZGVmaW5lZCwgdW5pb25UeXBlIGFzIHVuaW9uLCB1bmtub3duVHlwZSBhcyB1bmtub3duLCB2b2lkVHlwZSBhcyB2b2lkLCB9O1xuZXhwb3J0IGNvbnN0IE5FVkVSID0gSU5WQUxJRDtcbiIsImltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuXG5leHBvcnQgY29uc3QgQkJveFNjaGVtYSA9IHoudHVwbGUoW3oubnVtYmVyKCksIHoubnVtYmVyKCksIHoubnVtYmVyKCksIHoubnVtYmVyKCldKTtcblxuZXhwb3J0IGNvbnN0IE9yaWdpblNjaGVtYSA9IHouc3RyaW5nKCkucmVmaW5lKCh2YWwpID0+IHtcbiAgcmV0dXJuIC9eaHR0cHM/OlxcL1xcL1thLXpBLVowLTkuLV0rKDpcXGQrKT8kLy50ZXN0KHZhbCk7XG59LCB7IG1lc3NhZ2U6ICdPcmlnaW4gbXVzdCBiZSBzY2hlbWUraG9zdCtwb3J0IG9ubHksIG5vIHBhdGhzIG9yIHRyYWlsaW5nIHNsYXNoZXMnIH0pO1xuXG5leHBvcnQgY29uc3QgRnJhbWVJZFNjaGVtYSA9IHouc3RyaW5nKCk7XG5cbmV4cG9ydCBjb25zdCBTb3VyY2VTY2hlbWEgPSB6LmVudW0oWydET00nLCAnQVJJQScsICdWSVNJT04nLCAnT0NSJ10pO1xuXG5leHBvcnQgY29uc3QgU2VtYW50aWNUeXBlU2NoZW1hID0gei5lbnVtKFtcbiAgJ2J1dHRvbicsICdpbnB1dCcsICdjaGVja2JveCcsICdkcm9wZG93bicsICdsaW5rJywgJ3RhYicsICdtZW51JywgJ2RpYWxvZycsXG4gICdjaGFydCcsICd0YWJsZScsICdjYXJkJywgJ25hdmlnYXRpb24nLCAnaW1hZ2UnLCAndGV4dCcsICdjdXN0b21fY29udHJvbCcsICd1bmtub3duJyxcbl0pO1xuXG5leHBvcnQgY29uc3QgVmlzdWFsU3RhdGVTY2hlbWEgPSB6LmVudW0oW1xuICAnZW5hYmxlZCcsICdkaXNhYmxlZCcsICdzZWxlY3RlZCcsICdleHBhbmRlZCcsICdjb2xsYXBzZWQnLFxuICAnZm9jdXNlZCcsICdjaGVja2VkJywgJ3VuY2hlY2tlZCcsICd2aXNpYmxlJyxcbl0pO1xuXG5leHBvcnQgY29uc3QgU3RhZ2VOYW1lU2NoZW1hID0gei5lbnVtKFtcbiAgJ2NhcHR1cmUnLCAnZG9tJywgJ3JvdXRlJywgJ3Zpc2lvbicsICdvY3InLCAnZmFjZScsICdncm91bmQnLCAnZnVzZScsXG4gICdwaWknLCAncmVkYWN0JywgJ2ZpcmV3YWxsJywgJ25ldHdvcmsnLCAnc2VydmVyJywgJ3ZhbGlkYXRlJywgJ2V4ZWN1dGUnLCAnc2V0dGxlJyxcbl0pO1xuXG5leHBvcnQgY29uc3QgU3RhZ2VFcnJvckNvZGVTY2hlbWEgPSB6LmVudW0oW1xuICAnVklTSU9OX1VOQVZBSUxBQkxFJywgJ1BSSVZBQ1lfQkxPQ0snLCAnUFJJVkFDWV9FUlJPUicsICdTRVJWRVJfVU5BVkFJTEFCTEUnLFxuICAnU0VSVkVSX0lOVkFMSUQnLCAnU1RBTEVfU1RBVEUnLCAnT1JJR0lOX01JU01BVENIJywgJ0ZSQU1FX01JU01BVENIJyxcbiAgJ1BPTElDWV9ERU5JRUQnLCAnVEFSR0VUX05PVF9GT1VORCcsICdOT1RfSU5URVJBQ1RBQkxFJyxcbiAgJ0NBUEFCSUxJVFlfREVOSUVEJywgJ1RFWFRfVU5TQUZFJywgJ1RJTUVPVVQnLCAnSU5URVJOQUwnLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBTdGFnZUVycm9yU2NoZW1hID0gei5vYmplY3Qoe1xuICBjb2RlOiBTdGFnZUVycm9yQ29kZVNjaGVtYSxcbiAgc3RhZ2U6IFN0YWdlTmFtZVNjaGVtYSxcbiAgbWVzc2FnZTogei5zdHJpbmcoKSxcbiAgcmV0cnlhYmxlOiB6LmJvb2xlYW4oKSxcbiAgZGV0YWlsOiB6LnJlY29yZCh6LnVuaW9uKFt6LnN0cmluZygpLCB6Lm51bWJlcigpLCB6LmJvb2xlYW4oKV0pKS5vcHRpb25hbCgpLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCBjb25zdCBUZWxlbWV0cnlFdmVudFNjaGVtYSA9IHoub2JqZWN0KHtcbiAgdHM6IHoubnVtYmVyKCksXG4gIGN5Y2xlX2lkOiB6LnN0cmluZygpLFxuICBzdGFnZTogU3RhZ2VOYW1lU2NoZW1hLFxuICBkdXJhdGlvbl9tczogei5udW1iZXIoKSxcbiAgbWV0YTogei5yZWNvcmQoei51bmlvbihbei5zdHJpbmcoKSwgei5udW1iZXIoKSwgei5ib29sZWFuKCldKSkub3B0aW9uYWwoKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgY29uc3QgRnJhbWVJbmZvU2NoZW1hID0gei5vYmplY3Qoe1xuICBmcmFtZV9pZDogRnJhbWVJZFNjaGVtYSxcbiAgcGFyZW50X2ZyYW1lX2lkOiBGcmFtZUlkU2NoZW1hLm51bGxhYmxlKCksXG4gIG9yaWdpbjogei5zdHJpbmcoKSxcbiAgcGF0aDogei5zdHJpbmcoKSxcbiAgb2Zmc2V0OiB6LnR1cGxlKFt6Lm51bWJlcigpLCB6Lm51bWJlcigpXSksXG4gIGFjY2Vzc2libGU6IHouYm9vbGVhbigpLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCBjb25zdCBEb21FbGVtZW50SW5mb1NjaGVtYSA9IHoub2JqZWN0KHtcbiAgZG9tX2lkOiB6LnN0cmluZygpLFxuICBmcmFtZV9pZDogRnJhbWVJZFNjaGVtYSxcbiAgb3JpZ2luOiB6LnN0cmluZygpLFxuICB0YWc6IHouc3RyaW5nKCksXG4gIHJvbGU6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgbmFtZTogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxuICB0ZXh0OiB6LnN0cmluZygpLFxuICBhcmlhOiB6Lm9iamVjdCh7XG4gICAgZXhwYW5kZWQ6IHouYm9vbGVhbigpLm9wdGlvbmFsKCksXG4gICAgY2hlY2tlZDogei51bmlvbihbei5ib29sZWFuKCksIHoubGl0ZXJhbCgnbWl4ZWQnKV0pLm9wdGlvbmFsKCksXG4gICAgZGlzYWJsZWQ6IHouYm9vbGVhbigpLm9wdGlvbmFsKCksXG4gICAgc2VsZWN0ZWQ6IHouYm9vbGVhbigpLm9wdGlvbmFsKCksXG4gICAgcHJlc3NlZDogei5ib29sZWFuKCkub3B0aW9uYWwoKSxcbiAgICBoaWRkZW46IHouYm9vbGVhbigpLm9wdGlvbmFsKCksXG4gIH0pLnN0cmljdCgpLFxuICBpbnB1dDogei5vYmplY3Qoe1xuICAgIHR5cGU6IHouc3RyaW5nKCksXG4gICAgYXV0b2NvbXBsZXRlOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gICAgbmFtZTogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxuICAgIHBsYWNlaG9sZGVyOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gICAgaXNfcGFzc3dvcmQ6IHouYm9vbGVhbigpLFxuICAgIGhhc192YWx1ZTogei5ib29sZWFuKCksXG4gICAgdmFsdWU6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgfSkuc3RyaWN0KCkub3B0aW9uYWwoKSxcbiAgYmJveDogQkJveFNjaGVtYSxcbiAgdmlzaWJsZTogei5ib29sZWFuKCksXG4gIGluX3ZpZXdwb3J0OiB6LmJvb2xlYW4oKSxcbiAgb2NjbHVkZWQ6IHouYm9vbGVhbigpLFxuICBpbnRlcmFjdGFibGU6IHouYm9vbGVhbigpLFxuICByZW5kZXJpbmc6IHouZW51bShbXG4gICAgJ2h0bWwnLCAnY2FudmFzJywgJ3N2ZycsICdpbWcnLCAndmlkZW8nLCAnaWZyYW1lJyxcbiAgICAnc2hhZG93X29wZW4nLCAnc2hhZG93X2Nsb3NlZCcsICdjdXN0b20nLFxuICBdKSxcbiAgaGFzX2JnX2ltYWdlOiB6LmJvb2xlYW4oKSxcbiAgaGFuZGxlcnNfaGludDogei5ib29sZWFuKCksXG4gIHBhcmVudF9kb21faWQ6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgY29uc3QgRG9tU25hcHNob3RTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHNuYXBzaG90X2lkOiB6LnN0cmluZygpLFxuICB1cmxfb3JpZ2luOiB6LnN0cmluZygpLFxuICB1cmxfcGF0aDogei5zdHJpbmcoKSxcbiAgZnJhbWVzOiB6LmFycmF5KEZyYW1lSW5mb1NjaGVtYSksXG4gIGVsZW1lbnRzOiB6LmFycmF5KERvbUVsZW1lbnRJbmZvU2NoZW1hKSxcbiAgdmlld3BvcnQ6IHoub2JqZWN0KHsgdzogei5udW1iZXIoKSwgaDogei5udW1iZXIoKSB9KS5zdHJpY3QoKSxcbiAgZHByOiB6Lm51bWJlcigpLFxuICBzY3JvbGw6IHoub2JqZWN0KHsgeDogei5udW1iZXIoKSwgeTogei5udW1iZXIoKSB9KS5zdHJpY3QoKSxcbiAgcGFnZV9zdGF0ZV9oYXNoOiB6LnN0cmluZygpLFxuICB0czogei5udW1iZXIoKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgY29uc3QgUm91dGluZ0xldmVsU2NoZW1hID0gei5lbnVtKFsnSElHSCcsICdNRURJVU0nLCAnTE9XJ10pO1xuZXhwb3J0IGNvbnN0IFZpc2lvblRhc2tTY2hlbWEgPSB6LmVudW0oWydvY3InLCAndWlfZGV0ZWN0JywgJ2ZhY2UnLCAnZ3JvdW5kJ10pO1xuZXhwb3J0IGNvbnN0IEJ1ZGdldExldmVsU2NoZW1hID0gei5lbnVtKFsnSElHSCcsICdNRURJVU0nLCAnTE9XJ10pO1xuXG5leHBvcnQgY29uc3QgQnVkZ2V0U2NoZW1hID0gei5vYmplY3Qoe1xuICBsZXZlbDogQnVkZ2V0TGV2ZWxTY2hlbWEsXG4gIGJhY2tlbmQ6IHouZW51bShbJ3dlYmdwdScsICd3ZWJnbCcsICd3YXNtJywgJ25vbmUnXSksXG4gIG1heF92aXNpb25fcmVnaW9uczogei5udW1iZXIoKSxcbiAgbWF4X3BpeGVsczogei5udW1iZXIoKSxcbiAgYWxsb3dfZGV0ZWN0b3I6IHouYm9vbGVhbigpLFxuICBvY3JfbW9kZTogei5lbnVtKFsnb2ZmJywgJ2Zhc3QnLCAnaGlnaF9yZWNhbGwnXSksXG59KS5zdHJpY3QoKTtcblxuZXhwb3J0IGNvbnN0IFJvdXRpbmdEZWNpc2lvblNjaGVtYSA9IHoub2JqZWN0KHtcbiAgcmVnaW9uX2tleTogei5zdHJpbmcoKSxcbiAgZG9tX2lkOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gIGxldmVsOiBSb3V0aW5nTGV2ZWxTY2hlbWEsXG4gIHJlYXNvbnM6IHouYXJyYXkoei5zdHJpbmcoKSksXG4gIGNyb3A6IEJCb3hTY2hlbWEubnVsbGFibGUoKSxcbiAgbmVlZHM6IHouYXJyYXkoVmlzaW9uVGFza1NjaGVtYSksXG59KS5zdHJpY3QoKTtcblxuZXhwb3J0IGNvbnN0IFJvdXRpbmdQbGFuU2NoZW1hID0gei5vYmplY3Qoe1xuICBzbmFwc2hvdF9pZDogei5zdHJpbmcoKSxcbiAgcGFnZV9zdGF0ZV9oYXNoOiB6LnN0cmluZygpLFxuICBkZWNpc2lvbnM6IHouYXJyYXkoUm91dGluZ0RlY2lzaW9uU2NoZW1hKSxcbiAgbmVlZHNfc2NyZWVuc2hvdDogei5ib29sZWFuKCksXG4gIGJ1ZGdldDogQnVkZ2V0U2NoZW1hLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCBjb25zdCBDYXB0dXJlTWV0YVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgY2FwdHVyZV9pZDogei5zdHJpbmcoKSxcbiAgcGFnZV9zdGF0ZV9oYXNoOiB6LnN0cmluZygpLFxuICBkcHI6IHoubnVtYmVyKCksXG4gIHZpZXdwb3J0OiB6Lm9iamVjdCh7IHc6IHoubnVtYmVyKCksIGg6IHoubnVtYmVyKCkgfSkuc3RyaWN0KCksXG4gIHNjcm9sbDogei5vYmplY3QoeyB4OiB6Lm51bWJlcigpLCB5OiB6Lm51bWJlcigpIH0pLnN0cmljdCgpLFxuICBpbWFnZTogei5vYmplY3QoeyB3OiB6Lm51bWJlcigpLCBoOiB6Lm51bWJlcigpIH0pLnN0cmljdCgpLFxuICB0czogei5udW1iZXIoKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgY29uc3QgT2NyVG9rZW5TY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHRleHQ6IHouc3RyaW5nKCksXG4gIGJib3g6IEJCb3hTY2hlbWEsXG4gIGNvbmZpZGVuY2U6IHoubnVtYmVyKCksXG4gIGxpbmVfaWQ6IHoubnVtYmVyKCksXG59KS5zdHJpY3QoKTtcblxuZXhwb3J0IGNvbnN0IEZhY2VCb3hTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGJib3g6IEJCb3hTY2hlbWEsXG4gIGNvbmZpZGVuY2U6IHoubnVtYmVyKCksXG4gIGNvb3JkaW5hdGVTcGFjZTogei5saXRlcmFsKCdmcmFtZScpLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCBjb25zdCBQaWlUeXBlU2NoZW1hID0gei5lbnVtKFtcbiAgJ0VNQUlMJywgJ1BIT05FJywgJ1BFUlNPTicsICdBRERSRVNTJywgJ0RPQicsICdDQVJEJywgJ1BBU1NXT1JEJyxcbiAgJ0FVVEhfVE9LRU4nLCAnR09WX0lEJywgJ0JBTktfQUNDT1VOVCcsICdGQUNFJywgJ0lERU5USUZJRVInLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBDYXBhYmlsaXR5RGVzY3JpcHRvclNjaGVtYSA9IHoub2JqZWN0KHtcbiAgcmVmOiB6LnN0cmluZygpLFxuICBraW5kOiB6LmVudW0oWydwYXNzd29yZCcsICdlbWFpbCcsICdwaG9uZScsICd0b2tlbicsICdwcm9maWxlJ10pLFxuICBsYWJlbDogei5zdHJpbmcoKSxcbn0pLnN0cmljdCgpO1xuXG5leHBvcnQgY29uc3QgQWN0aW9uVHlwZVNjaGVtYSA9IHouZW51bShbXG4gICdjbGljaycsICdzY3JvbGwnLCAnZm9jdXMnLCAnc2VsZWN0JywgJ3R5cGUnLCAna2V5cHJlc3MnLCAnZmlsbF9zZWNyZXQnLCAnbmF2aWdhdGUnLCAnYmFjaydcbl0pO1xuXG5leHBvcnQgY29uc3QgU3RlcFN1bW1hcnlTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHN0ZXA6IHoubnVtYmVyKCksXG4gIGFjdGlvbjogQWN0aW9uVHlwZVNjaGVtYSxcbiAgdGFyZ2V0X3JlZ2lvbl9pZDogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxuICByZXN1bHQ6IHouZW51bShbJ29rJywgJ2Jsb2NrZWQnLCAnZmFpbGVkJ10pLFxuICBub3RlOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG59KS5zdHJpY3QoKTtcblxuZXhwb3J0IGNvbnN0IEFjdGlvblBhcmFtc1NjaGVtYSA9IHoub2JqZWN0KHtcbiAgdGV4dDogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICBvcHRpb246IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAga2V5OiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG4gIGRpcmVjdGlvbjogei5lbnVtKFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J10pLm9wdGlvbmFsKCksXG4gIGFtb3VudDogei5udW1iZXIoKS5vcHRpb25hbCgpLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCBjb25zdCBTdHJ1Y3R1cmVkQWN0aW9uU2NoZW1hID0gei5vYmplY3Qoe1xuICBhY3Rpb25faWQ6IHouc3RyaW5nKCksXG4gIHJlcXVlc3RfaWQ6IHouc3RyaW5nKCksXG4gIGFjdGlvbjogQWN0aW9uVHlwZVNjaGVtYSxcbiAgdGFyZ2V0OiB6Lm9iamVjdCh7IHJlZ2lvbl9pZDogei5zdHJpbmcoKSB9KS5zdHJpY3QoKS5udWxsYWJsZSgpLFxuICBwYXJhbXM6IEFjdGlvblBhcmFtc1NjaGVtYS5udWxsYWJsZSgpLFxuICBjYXBhYmlsaXR5OiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gIG9yaWdpbjogei5zdHJpbmcoKSxcbiAgZnJhbWVfaWQ6IEZyYW1lSWRTY2hlbWEsXG4gIHBhZ2Vfc3RhdGVfaGFzaDogei5zdHJpbmcoKSxcbiAgcmF0aW9uYWxlOiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG59KS5zdHJpY3QoKTtcblxuZXhwb3J0IGNvbnN0IFBsYW5SZXNwb25zZVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgcmVxdWVzdF9pZDogei5zdHJpbmcoKSxcbiAgc3RhdHVzOiB6LmVudW0oWydhY3Rpb24nLCAnZG9uZScsICduZWVkX3VzZXInLCAnZmFpbCddKSxcbiAgYWN0aW9uOiBTdHJ1Y3R1cmVkQWN0aW9uU2NoZW1hLm51bGxhYmxlKCksXG4gIG1lc3NhZ2U6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgdXNhZ2U6IHoub2JqZWN0KHtcbiAgICBzZXJ2ZXJfbXM6IHoubnVtYmVyKCksXG4gICAgbW9kZWw6IHouc3RyaW5nKCksXG4gIH0pLnN0cmljdCgpLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCBjb25zdCBTYW5pdGl6ZWRSZWdpb25TY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHJlZ2lvbl9pZDogei5zdHJpbmcoKSxcbiAgdHlwZTogU2VtYW50aWNUeXBlU2NoZW1hLFxuICB0ZXh0OiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gIGJib3g6IEJCb3hTY2hlbWEsXG4gIHN0YXRlOiB6LmFycmF5KFZpc3VhbFN0YXRlU2NoZW1hKSxcbiAgaW50ZXJhY3RhYmxlOiB6LmJvb2xlYW4oKSxcbiAgZnJhbWVfaWQ6IEZyYW1lSWRTY2hlbWEsXG4gIHNvdXJjZXM6IHouYXJyYXkoU291cmNlU2NoZW1hKSxcbiAgY29uZmlkZW5jZTogei5udW1iZXIoKSxcbiAgcmVsYXRpb25zOiB6LmFycmF5KHoub2JqZWN0KHsgcmVsOiB6LnN0cmluZygpLCB0YXJnZXQ6IHouc3RyaW5nKCkgfSkuc3RyaWN0KCkpLm9wdGlvbmFsKCksXG4gIHRydXN0OiB6LmxpdGVyYWwoJ3VudHJ1c3RlZCcpLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCBjb25zdCBTYW5pdGl6ZWRDb250ZXh0U2NoZW1hID0gei5vYmplY3Qoe1xuICBzY2hlbWFfdmVyc2lvbjogei5saXRlcmFsKCcxLjAnKSxcbiAgcmVxdWVzdF9pZDogei5zdHJpbmcoKSxcbiAgdGFza19pZDogei5zdHJpbmcoKSxcbiAgc3RlcF9pbmRleDogei5udW1iZXIoKSxcbiAgdGFzazogei5zdHJpbmcoKSxcbiAgcGFnZTogei5vYmplY3Qoe1xuICAgIG9yaWdpbjogei5zdHJpbmcoKSxcbiAgICBwYXRoOiB6LnN0cmluZygpLFxuICAgIHRpdGxlOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gICAgcGFnZV9zdGF0ZV9oYXNoOiB6LnN0cmluZygpLFxuICAgIHZpZXdwb3J0OiB6Lm9iamVjdCh7IHc6IHoubnVtYmVyKCksIGg6IHoubnVtYmVyKCkgfSkuc3RyaWN0KCksXG4gICAgZnJhbWVfaWRzOiB6LmFycmF5KEZyYW1lSWRTY2hlbWEpLFxuICB9KS5zdHJpY3QoKSxcbiAgcmVnaW9uczogei5hcnJheShTYW5pdGl6ZWRSZWdpb25TY2hlbWEpLFxuICBjYXBhYmlsaXRpZXM6IHouYXJyYXkoQ2FwYWJpbGl0eURlc2NyaXB0b3JTY2hlbWEpLFxuICByZWRhY3Rpb25zOiB6LmFycmF5KHoub2JqZWN0KHtcbiAgICB0eXBlOiBQaWlUeXBlU2NoZW1hLFxuICAgIGNvdW50OiB6Lm51bWJlcigpLFxuICB9KS5zdHJpY3QoKSksXG4gIGltYWdlOiB6Lm9iamVjdCh7XG4gICAgbWltZTogei5saXRlcmFsKCdpbWFnZS9qcGVnJyksXG4gICAgZGF0YV9iYXNlNjQ6IHouc3RyaW5nKCksXG4gICAgd2lkdGg6IHoubnVtYmVyKCksXG4gICAgaGVpZ2h0OiB6Lm51bWJlcigpLFxuICAgIGNvdmVyc19yZWdpb25faWRzOiB6LmFycmF5KHouc3RyaW5nKCkpLFxuICB9KS5zdHJpY3QoKS5udWxsYWJsZSgpLFxuICBoaXN0b3J5OiB6LmFycmF5KFN0ZXBTdW1tYXJ5U2NoZW1hKSxcbiAgZmxhZ3M6IHoub2JqZWN0KHtcbiAgICBpbmplY3Rpb25fc3VzcGVjdGVkX3JlZ2lvbl9pZHM6IHouYXJyYXkoei5zdHJpbmcoKSksXG4gIH0pLnN0cmljdCgpLFxufSkuc3RyaWN0KCk7XG5cbmV4cG9ydCBjb25zdCBBdHRlc3RlZFBheWxvYWRTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHJlcXVlc3RfaWQ6IHouc3RyaW5nKCksXG4gIGJvZHk6IHouc3RyaW5nKCksXG4gIHNoYTI1Njogei5zdHJpbmcoKS5sZW5ndGgoNjQpLFxuICBpc3N1ZWRfYXQ6IHoubnVtYmVyKCksXG59KS5zdHJpY3QoKTtcbiIsImltcG9ydCB0eXBlIHsgQnVzUmVzcG9uc2UsIE1lc3NhZ2VNYXAsIE1lc3NhZ2VUeXBlIH0gZnJvbSAnLi9tZXNzYWdlcy5qcyc7XG5pbXBvcnQgeyBzdGFnZUVycm9yIH0gZnJvbSAnLi9jb21tb24uanMnO1xuXG5mdW5jdGlvbiBnZXRDaHJvbWUoKTogdHlwZW9mIGNocm9tZSB8IHVuZGVmaW5lZCB7XG4gIGlmICh0eXBlb2YgY2hyb21lICE9PSAndW5kZWZpbmVkJyAmJiBjaHJvbWUucnVudGltZSkge1xuICAgIHJldHVybiBjaHJvbWU7XG4gIH1cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyAmJiAoZ2xvYmFsVGhpcyBhcyBhbnkpLmNocm9tZT8ucnVudGltZSkge1xuICAgIHJldHVybiAoZ2xvYmFsVGhpcyBhcyBhbnkpLmNocm9tZTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG50eXBlIEhhbmRsZXI8VCBleHRlbmRzIE1lc3NhZ2VUeXBlPiA9IChcbiAgcGF5bG9hZDogTWVzc2FnZU1hcFtUXVsncGF5bG9hZCddLFxuICBzZW5kZXI/OiBhbnlcbikgPT4gUHJvbWlzZTxNZXNzYWdlTWFwW1RdWydyZXNwb25zZSddPiB8IE1lc3NhZ2VNYXBbVF1bJ3Jlc3BvbnNlJ107XG5cbi8vIFJlZ2lzdHJ5IGZvciBoYW5kbGVycyBpbiBleHRlbnNpb24gcmVhbG1cbmNvbnN0IGNocm9tZUhhbmRsZXJzID0gbmV3IE1hcDxzdHJpbmcsIEFycmF5PEhhbmRsZXI8YW55Pj4+KCk7XG5sZXQgZ2xvYmFsTGlzdGVuZXJBdHRhY2hlZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBlbnN1cmVHbG9iYWxNZXNzYWdlTGlzdGVuZXIoZXh0OiB0eXBlb2YgY2hyb21lKSB7XG4gIGlmIChnbG9iYWxMaXN0ZW5lckF0dGFjaGVkKSByZXR1cm47XG4gIGdsb2JhbExpc3RlbmVyQXR0YWNoZWQgPSB0cnVlO1xuXG4gIGV4dC5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihcbiAgICAobWVzc2FnZTogYW55LCBzZW5kZXI6IGFueSwgc2VuZFJlc3BvbnNlOiAocmVzOiBCdXNSZXNwb25zZTxhbnk+KSA9PiB2b2lkKSA9PiB7XG4gICAgICBpZiAoIW1lc3NhZ2UgfHwgdHlwZW9mIG1lc3NhZ2UudHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBoYW5kbGVycyA9IGNocm9tZUhhbmRsZXJzLmdldChtZXNzYWdlLnR5cGUpO1xuICAgICAgaWYgKGhhbmRsZXJzICYmIGhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgICAudGhlbigoKSA9PiBoYW5kbGVyc1swXSEobWVzc2FnZS5wYXlsb2FkLCBzZW5kZXIpKVxuICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBvazogdHJ1ZSwgZGF0YSB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9XG4gICAgICAgICAgICAgIGVycj8uY29kZSAmJiBlcnI/LnN0YWdlXG4gICAgICAgICAgICAgICAgPyBlcnJcbiAgICAgICAgICAgICAgICA6IHN0YWdlRXJyb3IoJ0lOVEVSTkFMJywgJ2RvbScsIGVycj8ubWVzc2FnZSB8fCBTdHJpbmcoZXJyKSk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBvazogZmFsc2UsIGVycm9yIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gS2VlcCBtZXNzYWdlIGNoYW5uZWwgb3BlbiBmb3IgYXN5bmNocm9ub3VzIHNlbmRSZXNwb25zZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICApO1xufVxuXG4vLyBJbi1tZW1vcnkgYnVzIGZhbGxiYWNrIGZvciB0ZXN0aW5nL25vZGUgZW52aXJvbm1lbnRzXG5jb25zdCBsb2NhbEhhbmRsZXJzID0gbmV3IE1hcDxzdHJpbmcsIEFycmF5PChwYXlsb2FkOiBhbnkpID0+IFByb21pc2U8YW55PiB8IGFueT4+KCk7XG5cbmV4cG9ydCBjb25zdCBidXMgPSB7XG4gIC8qKlxuICAgKiBTZW5kIGEgdHlwZWQgbWVzc2FnZSBhY3Jvc3MgcmVhbG1zIChvciBsb2NhbGx5IGlmIGluIHRlc3Qvbm9kZSkuXG4gICAqL1xuICBhc3luYyBzZW5kPFQgZXh0ZW5kcyBNZXNzYWdlVHlwZT4oXG4gICAgdHlwZTogVCxcbiAgICBwYXlsb2FkOiBNZXNzYWdlTWFwW1RdWydwYXlsb2FkJ10sXG4gICAgb3B0aW9ucz86IHsgdGFiSWQ/OiBudW1iZXI7IGZyYW1lSWQ/OiBudW1iZXI7IHRpbWVvdXRNcz86IG51bWJlciB9XG4gICk6IFByb21pc2U8QnVzUmVzcG9uc2U8TWVzc2FnZU1hcFtUXVsncmVzcG9uc2UnXT4+IHtcbiAgICBjb25zdCBtZXNzYWdlID0geyB0eXBlLCBwYXlsb2FkIH07XG4gICAgY29uc3QgZXh0ID0gZ2V0Q2hyb21lKCk7XG4gICAgY29uc3QgdGltZW91dE1zID0gb3B0aW9ucz8udGltZW91dE1zIHx8ICh0eXBlID09PSAndmlzaW9uL3BlcmNlaXZlJyA/IDEwMDAwIDogNDUwMCk7XG5cbiAgICAvLyAxLiBDaHJvbWUgZXh0ZW5zaW9uIGVudmlyb25tZW50XG4gICAgaWYgKGV4dCAmJiBleHQucnVudGltZT8uc2VuZE1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBsZXQgc2V0dGxlZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmICghc2V0dGxlZCkge1xuICAgICAgICAgICAgc2V0dGxlZCA9IHRydWU7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgICBlcnJvcjogc3RhZ2VFcnJvcignVElNRU9VVCcsICdkb20nLCBgTWVzc2FnZSBcIiR7dHlwZX1cIiB0aW1lZCBvdXQgYWZ0ZXIgJHt0aW1lb3V0TXN9bXNgKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGltZW91dE1zKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gKHJlczogQnVzUmVzcG9uc2U8TWVzc2FnZU1hcFtUXVsncmVzcG9uc2UnXT4gfCB1bmRlZmluZWQpID0+IHtcbiAgICAgICAgICAgIGlmIChzZXR0bGVkKSByZXR1cm47XG4gICAgICAgICAgICBzZXR0bGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG5cbiAgICAgICAgICAgIGlmIChleHQucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBzdGFnZUVycm9yKFxuICAgICAgICAgICAgICAgICAgJ0lOVEVSTkFMJyxcbiAgICAgICAgICAgICAgICAgICdkb20nLFxuICAgICAgICAgICAgICAgICAgZXh0LnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgfHwgJ1Vua25vd24gcnVudGltZSBlcnJvcidcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBzdGFnZUVycm9yKCdJTlRFUk5BTCcsICdkb20nLCBgTm8gcmVzcG9uc2UgZnJvbSBoYW5kbGVyIGZvciBtZXNzYWdlIFwiJHt0eXBlfVwiYCksXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKHJlcyk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChvcHRpb25zPy50YWJJZCAmJiBvcHRpb25zLnRhYklkID4gMCAmJiBleHQudGFicz8uc2VuZE1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmZyYW1lSWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBleHQudGFicy5zZW5kTWVzc2FnZShvcHRpb25zLnRhYklkLCBtZXNzYWdlLCB7IGZyYW1lSWQ6IG9wdGlvbnMuZnJhbWVJZCB9LCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBleHQudGFicy5zZW5kTWVzc2FnZShvcHRpb25zLnRhYklkLCBtZXNzYWdlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4dC5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UsIGNhbGxiYWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGlmICghc2V0dGxlZCkge1xuICAgICAgICAgICAgc2V0dGxlZCA9IHRydWU7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgICAgZXJyb3I6IHN0YWdlRXJyb3IoJ0lOVEVSTkFMJywgJ2RvbScsIGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIDIuIE5vZGUgLyB0ZXN0IGVudmlyb25tZW50IGZhbGxiYWNrXG4gICAgY29uc3QgaGFuZGxlcnMgPSBsb2NhbEhhbmRsZXJzLmdldCh0eXBlKTtcbiAgICBpZiAoIWhhbmRsZXJzIHx8IGhhbmRsZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICBlcnJvcjogc3RhZ2VFcnJvcignSU5URVJOQUwnLCAnZG9tJywgYE5vIGxvY2FsIGhhbmRsZXIgcmVnaXN0ZXJlZCBmb3IgXCIke3R5cGV9XCJgKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBoYW5kbGVyc1swXSEocGF5bG9hZCk7XG4gICAgICByZXR1cm4geyBvazogdHJ1ZSwgZGF0YSB9O1xuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvazogZmFsc2UsXG4gICAgICAgIGVycm9yOiBlcnIuY29kZSAmJiBlcnIuc3RhZ2UgPyBlcnIgOiBzdGFnZUVycm9yKCdJTlRFUk5BTCcsICdkb20nLCBlcnIubWVzc2FnZSB8fCBTdHJpbmcoZXJyKSksXG4gICAgICB9O1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSB0eXBlZCBtZXNzYWdlIGxpc3RlbmVyLlxuICAgKi9cbiAgb248VCBleHRlbmRzIE1lc3NhZ2VUeXBlPih0eXBlOiBULCBoYW5kbGVyOiBIYW5kbGVyPFQ+KTogKCkgPT4gdm9pZCB7XG4gICAgY29uc3QgZXh0ID0gZ2V0Q2hyb21lKCk7XG4gICAgaWYgKGV4dCAmJiBleHQucnVudGltZT8ub25NZXNzYWdlKSB7XG4gICAgICBlbnN1cmVHbG9iYWxNZXNzYWdlTGlzdGVuZXIoZXh0KTtcblxuICAgICAgY29uc3QgbGlzdCA9IGNocm9tZUhhbmRsZXJzLmdldCh0eXBlKSB8fCBbXTtcbiAgICAgIGxpc3QucHVzaChoYW5kbGVyKTtcbiAgICAgIGNocm9tZUhhbmRsZXJzLnNldCh0eXBlLCBsaXN0KTtcblxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBjaHJvbWVIYW5kbGVycy5nZXQodHlwZSkgfHwgW107XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkID0gZXhpc3RpbmcuZmlsdGVyKChoKSA9PiBoICE9PSBoYW5kbGVyKTtcbiAgICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjaHJvbWVIYW5kbGVycy5zZXQodHlwZSwgZmlsdGVyZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNocm9tZUhhbmRsZXJzLmRlbGV0ZSh0eXBlKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBOb2RlIC8gdGVzdCBlbnZpcm9ubWVudFxuICAgIGNvbnN0IGxpc3QgPSBsb2NhbEhhbmRsZXJzLmdldCh0eXBlKSB8fCBbXTtcbiAgICBsaXN0LnB1c2goaGFuZGxlcik7XG4gICAgbG9jYWxIYW5kbGVycy5zZXQodHlwZSwgbGlzdCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgZXhpc3RpbmcgPSBsb2NhbEhhbmRsZXJzLmdldCh0eXBlKSB8fCBbXTtcbiAgICAgIGNvbnN0IGZpbHRlcmVkID0gZXhpc3RpbmcuZmlsdGVyKChoKSA9PiBoICE9PSBoYW5kbGVyKTtcbiAgICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxvY2FsSGFuZGxlcnMuc2V0KHR5cGUsIGZpbHRlcmVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvY2FsSGFuZGxlcnMuZGVsZXRlKHR5cGUpO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG5cbiAgLyoqXG4gICAqIENsZWFycyBhbGwgbG9jYWwgdGVzdCBoYW5kbGVycyAoZm9yIHRlc3RzKS5cbiAgICovXG4gIF9jbGVhckxvY2FsSGFuZGxlcnMoKSB7XG4gICAgbG9jYWxIYW5kbGVycy5jbGVhcigpO1xuICAgIGNocm9tZUhhbmRsZXJzLmNsZWFyKCk7XG4gIH0sXG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzRWxlbWVudFZpc2libGUoZWw6IEVsZW1lbnQpOiBib29sZWFuIHtcbiAgaWYgKHR5cGVvZiAoZWwgYXMgYW55KS5jaGVja1Zpc2liaWxpdHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAoXG4gICAgICAhKGVsIGFzIGFueSkuY2hlY2tWaXNpYmlsaXR5KHtcbiAgICAgICAgY2hlY2tPcGFjaXR5OiB0cnVlLFxuICAgICAgICBjaGVja1Zpc2liaWxpdHlDU1M6IHRydWUsXG4gICAgICB9KVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgaWYgKHJlY3Qud2lkdGggPT09IDAgfHwgcmVjdC5oZWlnaHQgPT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICBpZiAoXG4gICAgICBzdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgfHxcbiAgICAgIHN0eWxlLnZpc2liaWxpdHkgPT09ICdoaWRkZW4nIHx8XG4gICAgICBzdHlsZS52aXNpYmlsaXR5ID09PSAnY29sbGFwc2UnIHx8XG4gICAgICBwYXJzZUZsb2F0KHN0eWxlLm9wYWNpdHkgfHwgJzEnKSA8IDAuMDVcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRWxlbWVudEluVmlld3BvcnQocmVjdDogRE9NUmVjdCB8IHsgdG9wOiBudW1iZXI7IGxlZnQ6IG51bWJlcjsgYm90dG9tOiBudW1iZXI7IHJpZ2h0OiBudW1iZXIgfSwgdmlld3BvcnQ6IHsgdzogbnVtYmVyOyBoOiBudW1iZXIgfSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIHJlY3QuYm90dG9tID49IDAgJiZcbiAgICByZWN0LnJpZ2h0ID49IDAgJiZcbiAgICByZWN0LnRvcCA8PSB2aWV3cG9ydC5oICYmXG4gICAgcmVjdC5sZWZ0IDw9IHZpZXdwb3J0LndcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRWxlbWVudE9jY2x1ZGVkKGVsOiBFbGVtZW50LCBjeDogbnVtYmVyLCBjeTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBkb2N1bWVudC5lbGVtZW50c0Zyb21Qb2ludCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCB0b3BFbGVtZW50cyA9IGRvY3VtZW50LmVsZW1lbnRzRnJvbVBvaW50KGN4LCBjeSk7XG4gIGlmICh0b3BFbGVtZW50cy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcblxuICBjb25zdCB0b3AgPSB0b3BFbGVtZW50c1swXTtcbiAgaWYgKCF0b3ApIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiB0aGUgdG9wIGVsZW1lbnQgaXMgb3VyIGVsZW1lbnQgb3Igb25lIG9mIGl0cyBkZXNjZW5kYW50cywgaXQgaXMgbm90IG9jY2x1ZGVkXG4gIHJldHVybiB0b3AgIT09IGVsICYmICFlbC5jb250YWlucyh0b3ApO1xufVxuIiwiZXhwb3J0IHR5cGUgUmVuZGVyaW5nS2luZCA9XG4gIHwgJ2h0bWwnXG4gIHwgJ2NhbnZhcydcbiAgfCAnc3ZnJ1xuICB8ICdpbWcnXG4gIHwgJ3ZpZGVvJ1xuICB8ICdpZnJhbWUnXG4gIHwgJ3NoYWRvd19vcGVuJ1xuICB8ICdzaGFkb3dfY2xvc2VkJ1xuICB8ICdjdXN0b20nO1xuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0UmVuZGVyaW5nS2luZChlbDogRWxlbWVudCk6IHtcbiAgcmVuZGVyaW5nOiBSZW5kZXJpbmdLaW5kO1xuICBoYXNfYmdfaW1hZ2U6IGJvb2xlYW47XG4gIGhhbmRsZXJzX2hpbnQ6IGJvb2xlYW47XG59IHtcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gIGxldCByZW5kZXJpbmc6IFJlbmRlcmluZ0tpbmQgPSAnaHRtbCc7XG4gIGlmICh0YWcgPT09ICdjYW52YXMnKSByZW5kZXJpbmcgPSAnY2FudmFzJztcbiAgZWxzZSBpZiAodGFnID09PSAnc3ZnJyB8fCB0YWcgPT09ICdwYXRoJykgcmVuZGVyaW5nID0gJ3N2Zyc7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ2ltZycpIHJlbmRlcmluZyA9ICdpbWcnO1xuICBlbHNlIGlmICh0YWcgPT09ICd2aWRlbycpIHJlbmRlcmluZyA9ICd2aWRlbyc7XG4gIGVsc2UgaWYgKHRhZyA9PT0gJ2lmcmFtZScpIHJlbmRlcmluZyA9ICdpZnJhbWUnO1xuICBlbHNlIGlmIChlbC5zaGFkb3dSb290KSByZW5kZXJpbmcgPSAnc2hhZG93X29wZW4nO1xuXG4gIGxldCBoYXNfYmdfaW1hZ2UgPSBmYWxzZTtcbiAgbGV0IGhhbmRsZXJzX2hpbnQgPSBmYWxzZTtcblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZEltYWdlICYmIHN0eWxlLmJhY2tncm91bmRJbWFnZSAhPT0gJ25vbmUnKSB7XG4gICAgICBoYXNfYmdfaW1hZ2UgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoc3R5bGUuY3Vyc29yID09PSAncG9pbnRlcicpIHtcbiAgICAgIGhhbmRsZXJzX2hpbnQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChcbiAgICAoZWwgYXMgYW55KS5vbmNsaWNrIHx8XG4gICAgZWwuZ2V0QXR0cmlidXRlKCdvbmNsaWNrJykgfHxcbiAgICBlbC5nZXRBdHRyaWJ1dGUoJ3JvbGUnKSA9PT0gJ2J1dHRvbidcbiAgKSB7XG4gICAgaGFuZGxlcnNfaGludCA9IHRydWU7XG4gIH1cblxuICByZXR1cm4geyByZW5kZXJpbmcsIGhhc19iZ19pbWFnZSwgaGFuZGxlcnNfaGludCB9O1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVBcmlhUm9sZShlbDogRWxlbWVudCk6IHN0cmluZyB8IG51bGwge1xuICAvLyBFeHBsaWNpdCByb2xlXG4gIGNvbnN0IGV4cGxpY2l0Um9sZSA9IGVsLmdldEF0dHJpYnV0ZSgncm9sZScpO1xuICBpZiAoZXhwbGljaXRSb2xlKSB7XG4gICAgcmV0dXJuIGV4cGxpY2l0Um9sZS50cmltKCkuc3BsaXQoL1xccysvKVswXSB8fCBudWxsO1xuICB9XG5cbiAgLy8gSW1wbGljaXQgSFRNTDUgcm9sZSBtYXBwaW5nXG4gIGNvbnN0IHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlICdhJzpcbiAgICAgIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUoJ2hyZWYnKSA/ICdsaW5rJyA6IG51bGw7XG4gICAgY2FzZSAnYnV0dG9uJzpcbiAgICAgIHJldHVybiAnYnV0dG9uJztcbiAgICBjYXNlICdpbnB1dCc6IHtcbiAgICAgIGNvbnN0IHR5cGUgPSAoZWwuZ2V0QXR0cmlidXRlKCd0eXBlJykgfHwgJ3RleHQnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKHR5cGUgPT09ICdidXR0b24nIHx8IHR5cGUgPT09ICdzdWJtaXQnIHx8IHR5cGUgPT09ICdyZXNldCcpIHJldHVybiAnYnV0dG9uJztcbiAgICAgIGlmICh0eXBlID09PSAnY2hlY2tib3gnKSByZXR1cm4gJ2NoZWNrYm94JztcbiAgICAgIGlmICh0eXBlID09PSAncmFkaW8nKSByZXR1cm4gJ3JhZGlvJztcbiAgICAgIGlmICh0eXBlID09PSAncmFuZ2UnKSByZXR1cm4gJ3NsaWRlcic7XG4gICAgICBpZiAodHlwZSA9PT0gJ251bWJlcicpIHJldHVybiAnc3BpbmJ1dHRvbic7XG4gICAgICByZXR1cm4gJ3RleHRib3gnO1xuICAgIH1cbiAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgcmV0dXJuICdjb21ib2JveCc7XG4gICAgY2FzZSAndGV4dGFyZWEnOlxuICAgICAgcmV0dXJuICd0ZXh0Ym94JztcbiAgICBjYXNlICdoMSc6XG4gICAgY2FzZSAnaDInOlxuICAgIGNhc2UgJ2gzJzpcbiAgICBjYXNlICdoNCc6XG4gICAgY2FzZSAnaDUnOlxuICAgIGNhc2UgJ2g2JzpcbiAgICAgIHJldHVybiAnaGVhZGluZyc7XG4gICAgY2FzZSAnaW1nJzpcbiAgICAgIHJldHVybiAnaW1nJztcbiAgICBjYXNlICduYXYnOlxuICAgICAgcmV0dXJuICduYXZpZ2F0aW9uJztcbiAgICBjYXNlICdkaWFsb2cnOlxuICAgICAgcmV0dXJuICdkaWFsb2cnO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdEFyaWFTdGF0ZXMoZWw6IEVsZW1lbnQpOiB7XG4gIGV4cGFuZGVkPzogYm9vbGVhbjtcbiAgY2hlY2tlZD86IGJvb2xlYW4gfCAnbWl4ZWQnO1xuICBkaXNhYmxlZD86IGJvb2xlYW47XG4gIHNlbGVjdGVkPzogYm9vbGVhbjtcbiAgcHJlc3NlZD86IGJvb2xlYW47XG4gIGhpZGRlbj86IGJvb2xlYW47XG59IHtcbiAgY29uc3QgYXJpYToge1xuICAgIGV4cGFuZGVkPzogYm9vbGVhbjtcbiAgICBjaGVja2VkPzogYm9vbGVhbiB8ICdtaXhlZCc7XG4gICAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICAgIHNlbGVjdGVkPzogYm9vbGVhbjtcbiAgICBwcmVzc2VkPzogYm9vbGVhbjtcbiAgICBoaWRkZW4/OiBib29sZWFuO1xuICB9ID0ge307XG5cbiAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpKSB7XG4gICAgYXJpYS5leHBhbmRlZCA9IGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZSc7XG4gIH1cbiAgaWYgKGVsLmhhc0F0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJykpIHtcbiAgICBjb25zdCB2YWwgPSBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcpO1xuICAgIGFyaWEuY2hlY2tlZCA9IHZhbCA9PT0gJ21peGVkJyA/ICdtaXhlZCcgOiB2YWwgPT09ICd0cnVlJztcbiAgfVxuICBpZiAoZWwuaGFzQXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJykgfHwgKGVsIGFzIGFueSkuZGlzYWJsZWQpIHtcbiAgICBhcmlhLmRpc2FibGVkID0gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJykgPT09ICd0cnVlJyB8fCAoZWwgYXMgYW55KS5kaXNhYmxlZCA9PT0gdHJ1ZTtcbiAgfVxuICBpZiAoZWwuaGFzQXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykpIHtcbiAgICBhcmlhLnNlbGVjdGVkID0gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJztcbiAgfVxuICBpZiAoZWwuaGFzQXR0cmlidXRlKCdhcmlhLXByZXNzZWQnKSkge1xuICAgIGFyaWEucHJlc3NlZCA9IGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJykgPT09ICd0cnVlJztcbiAgfVxuICBpZiAoZWwuaGFzQXR0cmlidXRlKCdhcmlhLWhpZGRlbicpKSB7XG4gICAgYXJpYS5oaWRkZW4gPSBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJztcbiAgfVxuXG4gIHJldHVybiBhcmlhO1xufVxuIiwiLyoqXG4gKiBAc291cmNlIHtodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9mcm9tI1BvbHlmaWxsfVxuICogYnV0IHdpdGhvdXQgdGhpc0FyZyAodG9vIGhhcmQgdG8gdHlwZSwgbm8gbmVlZCB0byBgdGhpc2ApXG4gKi9cbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5mdW5jdGlvbiBpc0NhbGxhYmxlKGZuKSB7XG4gIHJldHVybiB0eXBlb2YgZm4gPT09IFwiZnVuY3Rpb25cIiB8fCB0b1N0ci5jYWxsKGZuKSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xufVxuZnVuY3Rpb24gdG9JbnRlZ2VyKHZhbHVlKSB7XG4gIHZhciBudW1iZXIgPSBOdW1iZXIodmFsdWUpO1xuICBpZiAoaXNOYU4obnVtYmVyKSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIGlmIChudW1iZXIgPT09IDAgfHwgIWlzRmluaXRlKG51bWJlcikpIHtcbiAgICByZXR1cm4gbnVtYmVyO1xuICB9XG4gIHJldHVybiAobnVtYmVyID4gMCA/IDEgOiAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKG51bWJlcikpO1xufVxudmFyIG1heFNhZmVJbnRlZ2VyID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcbmZ1bmN0aW9uIHRvTGVuZ3RoKHZhbHVlKSB7XG4gIHZhciBsZW4gPSB0b0ludGVnZXIodmFsdWUpO1xuICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuLCAwKSwgbWF4U2FmZUludGVnZXIpO1xufVxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IGZyb20gYW4gaXRlcmFibGUgb2JqZWN0LlxuICogQHBhcmFtIGl0ZXJhYmxlIEFuIGl0ZXJhYmxlIG9iamVjdCB0byBjb252ZXJ0IHRvIGFuIGFycmF5LlxuICovXG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBmcm9tIGFuIGl0ZXJhYmxlIG9iamVjdC5cbiAqIEBwYXJhbSBpdGVyYWJsZSBBbiBpdGVyYWJsZSBvYmplY3QgdG8gY29udmVydCB0byBhbiBhcnJheS5cbiAqIEBwYXJhbSBtYXBmbiBBIG1hcHBpbmcgZnVuY3Rpb24gdG8gY2FsbCBvbiBldmVyeSBlbGVtZW50IG9mIHRoZSBhcnJheS5cbiAqIEBwYXJhbSB0aGlzQXJnIFZhbHVlIG9mICd0aGlzJyB1c2VkIHRvIGludm9rZSB0aGUgbWFwZm4uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFycmF5RnJvbShhcnJheUxpa2UsIG1hcEZuKSB7XG4gIC8vIDEuIExldCBDIGJlIHRoZSB0aGlzIHZhbHVlLlxuICAvLyBlZGl0KEBlcHMxbG9uKTogd2UncmUgbm90IGNhbGxpbmcgaXQgYXMgQXJyYXkuZnJvbVxuICB2YXIgQyA9IEFycmF5O1xuXG4gIC8vIDIuIExldCBpdGVtcyBiZSBUb09iamVjdChhcnJheUxpa2UpLlxuICB2YXIgaXRlbXMgPSBPYmplY3QoYXJyYXlMaWtlKTtcblxuICAvLyAzLiBSZXR1cm5JZkFicnVwdChpdGVtcykuXG4gIGlmIChhcnJheUxpa2UgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJBcnJheS5mcm9tIHJlcXVpcmVzIGFuIGFycmF5LWxpa2Ugb2JqZWN0IC0gbm90IG51bGwgb3IgdW5kZWZpbmVkXCIpO1xuICB9XG5cbiAgLy8gNC4gSWYgbWFwZm4gaXMgdW5kZWZpbmVkLCB0aGVuIGxldCBtYXBwaW5nIGJlIGZhbHNlLlxuICAvLyBjb25zdCBtYXBGbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdm9pZCB1bmRlZmluZWQ7XG5cbiAgaWYgKHR5cGVvZiBtYXBGbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIC8vIDUuIGVsc2VcbiAgICAvLyA1LiBhIElmIElzQ2FsbGFibGUobWFwZm4pIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgaWYgKCFpc0NhbGxhYmxlKG1hcEZuKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFycmF5LmZyb206IHdoZW4gcHJvdmlkZWQsIHRoZSBzZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIDEwLiBMZXQgbGVuVmFsdWUgYmUgR2V0KGl0ZW1zLCBcImxlbmd0aFwiKS5cbiAgLy8gMTEuIExldCBsZW4gYmUgVG9MZW5ndGgobGVuVmFsdWUpLlxuICB2YXIgbGVuID0gdG9MZW5ndGgoaXRlbXMubGVuZ3RoKTtcblxuICAvLyAxMy4gSWYgSXNDb25zdHJ1Y3RvcihDKSBpcyB0cnVlLCB0aGVuXG4gIC8vIDEzLiBhLiBMZXQgQSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kXG4gIC8vIG9mIEMgd2l0aCBhbiBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmcgdGhlIHNpbmdsZSBpdGVtIGxlbi5cbiAgLy8gMTQuIGEuIEVsc2UsIExldCBBIGJlIEFycmF5Q3JlYXRlKGxlbikuXG4gIHZhciBBID0gaXNDYWxsYWJsZShDKSA/IE9iamVjdChuZXcgQyhsZW4pKSA6IG5ldyBBcnJheShsZW4pO1xuXG4gIC8vIDE2LiBMZXQgayBiZSAwLlxuICB2YXIgayA9IDA7XG4gIC8vIDE3LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW7igKYgKGFsc28gc3RlcHMgYSAtIGgpXG4gIHZhciBrVmFsdWU7XG4gIHdoaWxlIChrIDwgbGVuKSB7XG4gICAga1ZhbHVlID0gaXRlbXNba107XG4gICAgaWYgKG1hcEZuKSB7XG4gICAgICBBW2tdID0gbWFwRm4oa1ZhbHVlLCBrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgQVtrXSA9IGtWYWx1ZTtcbiAgICB9XG4gICAgayArPSAxO1xuICB9XG4gIC8vIDE4LiBMZXQgcHV0U3RhdHVzIGJlIFB1dChBLCBcImxlbmd0aFwiLCBsZW4sIHRydWUpLlxuICBBLmxlbmd0aCA9IGxlbjtcbiAgLy8gMjAuIFJldHVybiBBLlxuICByZXR1cm4gQTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFycmF5LmZyb20ubWpzLm1hcCIsImZ1bmN0aW9uIF90eXBlb2YobykgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IHJldHVybiBfdHlwZW9mID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgXCJzeW1ib2xcIiA9PSB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID8gZnVuY3Rpb24gKG8pIHsgcmV0dXJuIHR5cGVvZiBvOyB9IDogZnVuY3Rpb24gKG8pIHsgcmV0dXJuIG8gJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgby5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG8gIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG87IH0sIF90eXBlb2Yobyk7IH1cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIF90b1Byb3BlcnR5S2V5KGRlc2NyaXB0b3Iua2V5KSwgZGVzY3JpcHRvcik7IH0gfVxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29uc3RydWN0b3IsIFwicHJvdG90eXBlXCIsIHsgd3JpdGFibGU6IGZhbHNlIH0pOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsga2V5ID0gX3RvUHJvcGVydHlLZXkoa2V5KTsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5mdW5jdGlvbiBfdG9Qcm9wZXJ0eUtleSh0KSB7IHZhciBpID0gX3RvUHJpbWl0aXZlKHQsIFwic3RyaW5nXCIpOyByZXR1cm4gXCJzeW1ib2xcIiA9PSBfdHlwZW9mKGkpID8gaSA6IGkgKyBcIlwiOyB9XG5mdW5jdGlvbiBfdG9QcmltaXRpdmUodCwgcikgeyBpZiAoXCJvYmplY3RcIiAhPSBfdHlwZW9mKHQpIHx8ICF0KSByZXR1cm4gdDsgdmFyIGUgPSB0W1N5bWJvbC50b1ByaW1pdGl2ZV07IGlmICh2b2lkIDAgIT09IGUpIHsgdmFyIGkgPSBlLmNhbGwodCwgciB8fCBcImRlZmF1bHRcIik7IGlmIChcIm9iamVjdFwiICE9IF90eXBlb2YoaSkpIHJldHVybiBpOyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQEB0b1ByaW1pdGl2ZSBtdXN0IHJldHVybiBhIHByaW1pdGl2ZSB2YWx1ZS5cIik7IH0gcmV0dXJuIChcInN0cmluZ1wiID09PSByID8gU3RyaW5nIDogTnVtYmVyKSh0KTsgfVxuLy8gZm9yIGVudmlyb25tZW50cyB3aXRob3V0IFNldCB3ZSBmYWxsYmFjayB0byBhcnJheXMgd2l0aCB1bmlxdWUgbWVtYmVyc1xudmFyIFNldExpa2UgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTZXRMaWtlKCkge1xuICAgIHZhciBpdGVtcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogW107XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNldExpa2UpO1xuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIml0ZW1zXCIsIHZvaWQgMCk7XG4gICAgdGhpcy5pdGVtcyA9IGl0ZW1zO1xuICB9XG4gIHJldHVybiBfY3JlYXRlQ2xhc3MoU2V0TGlrZSwgW3tcbiAgICBrZXk6IFwiYWRkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZCh2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMuaGFzKHZhbHVlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbGVhclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGVsZXRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9kZWxldGUodmFsdWUpIHtcbiAgICAgIHZhciBwcmV2aW91c0xlbmd0aCA9IHRoaXMuaXRlbXMubGVuZ3RoO1xuICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuaXRlbXMuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtICE9PSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHByZXZpb3VzTGVuZ3RoICE9PSB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZm9yRWFjaFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4pIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLml0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgY2FsbGJhY2tmbihpdGVtLCBpdGVtLCBfdGhpcyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaGFzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhcyh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlbXMuaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzaXplXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGg7XG4gICAgfVxuICB9XSk7XG59KCk7XG5leHBvcnQgZGVmYXVsdCB0eXBlb2YgU2V0ID09PSBcInVuZGVmaW5lZFwiID8gU2V0IDogU2V0TGlrZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVNldExpa2UubWpzLm1hcCIsIi8vIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9odG1sLWFyaWEvI2RvY3VtZW50LWNvbmZvcm1hbmNlLXJlcXVpcmVtZW50cy1mb3ItdXNlLW9mLWFyaWEtYXR0cmlidXRlcy1pbi1odG1sXG5cbmltcG9ydCB7IHByZXNlbnRhdGlvblJvbGVzIH0gZnJvbSBcIi4vdXRpbC5tanNcIjtcblxuLyoqXG4gKiBTYWZlIEVsZW1lbnQubG9jYWxOYW1lIGZvciBhbGwgc3VwcG9ydGVkIGVudmlyb25tZW50c1xuICogQHBhcmFtIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsTmFtZShlbGVtZW50KSB7XG4gIHZhciBfZWxlbWVudCRsb2NhbE5hbWU7XG4gIHJldHVybiAoLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtcHJvcGVydGllcyAtLSBhY3R1YWwgZ3VhcmQgZm9yIGVudmlyb25tZW50cyB3aXRob3V0IGxvY2FsTmFtZVxuICAgIChfZWxlbWVudCRsb2NhbE5hbWUgPSBlbGVtZW50LmxvY2FsTmFtZSkgIT09IG51bGwgJiYgX2VsZW1lbnQkbG9jYWxOYW1lICE9PSB2b2lkIDAgPyBfZWxlbWVudCRsb2NhbE5hbWUgOlxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXByb3BlcnRpZXMgLS0gcmVxdWlyZWQgZm9yIHRoZSBmYWxsYmFja1xuICAgIGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICk7XG59XG52YXIgbG9jYWxOYW1lVG9Sb2xlTWFwcGluZ3MgPSB7XG4gIGFydGljbGU6IFwiYXJ0aWNsZVwiLFxuICBhc2lkZTogXCJjb21wbGVtZW50YXJ5XCIsXG4gIGJ1dHRvbjogXCJidXR0b25cIixcbiAgZGF0YWxpc3Q6IFwibGlzdGJveFwiLFxuICBkZDogXCJkZWZpbml0aW9uXCIsXG4gIGRldGFpbHM6IFwiZ3JvdXBcIixcbiAgZGlhbG9nOiBcImRpYWxvZ1wiLFxuICBkdDogXCJ0ZXJtXCIsXG4gIGZpZWxkc2V0OiBcImdyb3VwXCIsXG4gIGZpZ3VyZTogXCJmaWd1cmVcIixcbiAgLy8gV0FSTklORzogT25seSB3aXRoIGFuIGFjY2Vzc2libGUgbmFtZVxuICBmb3JtOiBcImZvcm1cIixcbiAgZm9vdGVyOiBcImNvbnRlbnRpbmZvXCIsXG4gIGgxOiBcImhlYWRpbmdcIixcbiAgaDI6IFwiaGVhZGluZ1wiLFxuICBoMzogXCJoZWFkaW5nXCIsXG4gIGg0OiBcImhlYWRpbmdcIixcbiAgaDU6IFwiaGVhZGluZ1wiLFxuICBoNjogXCJoZWFkaW5nXCIsXG4gIGhlYWRlcjogXCJiYW5uZXJcIixcbiAgaHI6IFwic2VwYXJhdG9yXCIsXG4gIGh0bWw6IFwiZG9jdW1lbnRcIixcbiAgbGVnZW5kOiBcImxlZ2VuZFwiLFxuICBsaTogXCJsaXN0aXRlbVwiLFxuICBtYXRoOiBcIm1hdGhcIixcbiAgbWFpbjogXCJtYWluXCIsXG4gIG1lbnU6IFwibGlzdFwiLFxuICBuYXY6IFwibmF2aWdhdGlvblwiLFxuICBvbDogXCJsaXN0XCIsXG4gIG9wdGdyb3VwOiBcImdyb3VwXCIsXG4gIC8vIFdBUk5JTkc6IE9ubHkgaW4gY2VydGFpbiBjb250ZXh0XG4gIG9wdGlvbjogXCJvcHRpb25cIixcbiAgb3V0cHV0OiBcInN0YXR1c1wiLFxuICBwcm9ncmVzczogXCJwcm9ncmVzc2JhclwiLFxuICAvLyBXQVJOSU5HOiBPbmx5IHdpdGggYW4gYWNjZXNzaWJsZSBuYW1lXG4gIHNlY3Rpb246IFwicmVnaW9uXCIsXG4gIHN1bW1hcnk6IFwiYnV0dG9uXCIsXG4gIHRhYmxlOiBcInRhYmxlXCIsXG4gIHRib2R5OiBcInJvd2dyb3VwXCIsXG4gIHRleHRhcmVhOiBcInRleHRib3hcIixcbiAgdGZvb3Q6IFwicm93Z3JvdXBcIixcbiAgLy8gV0FSTklORzogT25seSBpbiBjZXJ0YWluIGNvbnRleHRcbiAgdGQ6IFwiY2VsbFwiLFxuICB0aDogXCJjb2x1bW5oZWFkZXJcIixcbiAgdGhlYWQ6IFwicm93Z3JvdXBcIixcbiAgdHI6IFwicm93XCIsXG4gIHVsOiBcImxpc3RcIlxufTtcbnZhciBwcm9oaWJpdGVkQXR0cmlidXRlcyA9IHtcbiAgY2FwdGlvbjogbmV3IFNldChbXCJhcmlhLWxhYmVsXCIsIFwiYXJpYS1sYWJlbGxlZGJ5XCJdKSxcbiAgY29kZTogbmV3IFNldChbXCJhcmlhLWxhYmVsXCIsIFwiYXJpYS1sYWJlbGxlZGJ5XCJdKSxcbiAgZGVsZXRpb246IG5ldyBTZXQoW1wiYXJpYS1sYWJlbFwiLCBcImFyaWEtbGFiZWxsZWRieVwiXSksXG4gIGVtcGhhc2lzOiBuZXcgU2V0KFtcImFyaWEtbGFiZWxcIiwgXCJhcmlhLWxhYmVsbGVkYnlcIl0pLFxuICBnZW5lcmljOiBuZXcgU2V0KFtcImFyaWEtbGFiZWxcIiwgXCJhcmlhLWxhYmVsbGVkYnlcIiwgXCJhcmlhLXJvbGVkZXNjcmlwdGlvblwiXSksXG4gIGluc2VydGlvbjogbmV3IFNldChbXCJhcmlhLWxhYmVsXCIsIFwiYXJpYS1sYWJlbGxlZGJ5XCJdKSxcbiAgbm9uZTogbmV3IFNldChbXCJhcmlhLWxhYmVsXCIsIFwiYXJpYS1sYWJlbGxlZGJ5XCJdKSxcbiAgcGFyYWdyYXBoOiBuZXcgU2V0KFtcImFyaWEtbGFiZWxcIiwgXCJhcmlhLWxhYmVsbGVkYnlcIl0pLFxuICBwcmVzZW50YXRpb246IG5ldyBTZXQoW1wiYXJpYS1sYWJlbFwiLCBcImFyaWEtbGFiZWxsZWRieVwiXSksXG4gIHN0cm9uZzogbmV3IFNldChbXCJhcmlhLWxhYmVsXCIsIFwiYXJpYS1sYWJlbGxlZGJ5XCJdKSxcbiAgc3Vic2NyaXB0OiBuZXcgU2V0KFtcImFyaWEtbGFiZWxcIiwgXCJhcmlhLWxhYmVsbGVkYnlcIl0pLFxuICBzdXBlcnNjcmlwdDogbmV3IFNldChbXCJhcmlhLWxhYmVsXCIsIFwiYXJpYS1sYWJlbGxlZGJ5XCJdKVxufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIGVsZW1lbnRcbiAqIEBwYXJhbSByb2xlIFRoZSByb2xlIHVzZWQgZm9yIHRoaXMgZWxlbWVudC4gVGhpcyBpcyBzcGVjaWZpZWQgdG8gY29udHJvbCB3aGV0aGVyIHlvdSB3YW50IHRvIHVzZSB0aGUgaW1wbGljaXQgb3IgZXhwbGljaXQgcm9sZS5cbiAqL1xuZnVuY3Rpb24gaGFzR2xvYmFsQXJpYUF0dHJpYnV0ZXMoZWxlbWVudCwgcm9sZSkge1xuICAvLyBodHRwczovL3Jhd2dpdC5jb20vdzNjL2FyaWEvc3RhYmxlLyNnbG9iYWxfc3RhdGVzXG4gIC8vIGNvbW1lbnRlZCBhdHRyaWJ1dGVzIGFyZSBkZXByZWNhdGVkXG4gIHJldHVybiBbXCJhcmlhLWF0b21pY1wiLCBcImFyaWEtYnVzeVwiLCBcImFyaWEtY29udHJvbHNcIiwgXCJhcmlhLWN1cnJlbnRcIiwgXCJhcmlhLWRlc2NyaXB0aW9uXCIsIFwiYXJpYS1kZXNjcmliZWRieVwiLCBcImFyaWEtZGV0YWlsc1wiLFxuICAvLyBcImRpc2FibGVkXCIsXG4gIFwiYXJpYS1kcm9wZWZmZWN0XCIsXG4gIC8vIFwiZXJyb3JtZXNzYWdlXCIsXG4gIFwiYXJpYS1mbG93dG9cIiwgXCJhcmlhLWdyYWJiZWRcIixcbiAgLy8gXCJoYXNwb3B1cFwiLFxuICBcImFyaWEtaGlkZGVuXCIsXG4gIC8vIFwiaW52YWxpZFwiLFxuICBcImFyaWEta2V5c2hvcnRjdXRzXCIsIFwiYXJpYS1sYWJlbFwiLCBcImFyaWEtbGFiZWxsZWRieVwiLCBcImFyaWEtbGl2ZVwiLCBcImFyaWEtb3duc1wiLCBcImFyaWEtcmVsZXZhbnRcIiwgXCJhcmlhLXJvbGVkZXNjcmlwdGlvblwiXS5zb21lKGZ1bmN0aW9uIChhdHRyaWJ1dGVOYW1lKSB7XG4gICAgdmFyIF9wcm9oaWJpdGVkQXR0cmlidXRlcztcbiAgICByZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSkgJiYgISgoX3Byb2hpYml0ZWRBdHRyaWJ1dGVzID0gcHJvaGliaXRlZEF0dHJpYnV0ZXNbcm9sZV0pICE9PSBudWxsICYmIF9wcm9oaWJpdGVkQXR0cmlidXRlcyAhPT0gdm9pZCAwICYmIF9wcm9oaWJpdGVkQXR0cmlidXRlcy5oYXMoYXR0cmlidXRlTmFtZSkpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGlnbm9yZVByZXNlbnRhdGlvbmFsUm9sZShlbGVtZW50LCBpbXBsaWNpdFJvbGUpIHtcbiAgLy8gaHR0cHM6Ly9yYXdnaXQuY29tL3czYy9hcmlhL3N0YWJsZS8jY29uZmxpY3RfcmVzb2x1dGlvbl9wcmVzZW50YXRpb25fbm9uZVxuICByZXR1cm4gaGFzR2xvYmFsQXJpYUF0dHJpYnV0ZXMoZWxlbWVudCwgaW1wbGljaXRSb2xlKTtcbn1cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFJvbGUoZWxlbWVudCkge1xuICB2YXIgZXhwbGljaXRSb2xlID0gZ2V0RXhwbGljaXRSb2xlKGVsZW1lbnQpO1xuICBpZiAoZXhwbGljaXRSb2xlID09PSBudWxsIHx8IHByZXNlbnRhdGlvblJvbGVzLmluZGV4T2YoZXhwbGljaXRSb2xlKSAhPT0gLTEpIHtcbiAgICB2YXIgaW1wbGljaXRSb2xlID0gZ2V0SW1wbGljaXRSb2xlKGVsZW1lbnQpO1xuICAgIGlmIChwcmVzZW50YXRpb25Sb2xlcy5pbmRleE9mKGV4cGxpY2l0Um9sZSB8fCBcIlwiKSA9PT0gLTEgfHwgaWdub3JlUHJlc2VudGF0aW9uYWxSb2xlKGVsZW1lbnQsIGltcGxpY2l0Um9sZSB8fCBcIlwiKSkge1xuICAgICAgcmV0dXJuIGltcGxpY2l0Um9sZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGV4cGxpY2l0Um9sZTtcbn1cbmZ1bmN0aW9uIGdldEltcGxpY2l0Um9sZShlbGVtZW50KSB7XG4gIHZhciBtYXBwZWRCeVRhZyA9IGxvY2FsTmFtZVRvUm9sZU1hcHBpbmdzW2dldExvY2FsTmFtZShlbGVtZW50KV07XG4gIGlmIChtYXBwZWRCeVRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG1hcHBlZEJ5VGFnO1xuICB9XG4gIHN3aXRjaCAoZ2V0TG9jYWxOYW1lKGVsZW1lbnQpKSB7XG4gICAgY2FzZSBcImFcIjpcbiAgICBjYXNlIFwiYXJlYVwiOlxuICAgIGNhc2UgXCJsaW5rXCI6XG4gICAgICBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJocmVmXCIpKSB7XG4gICAgICAgIHJldHVybiBcImxpbmtcIjtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJpbWdcIjpcbiAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImFsdFwiKSA9PT0gXCJcIiAmJiAhaWdub3JlUHJlc2VudGF0aW9uYWxSb2xlKGVsZW1lbnQsIFwiaW1nXCIpKSB7XG4gICAgICAgIHJldHVybiBcInByZXNlbnRhdGlvblwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwiaW1nXCI7XG4gICAgY2FzZSBcImlucHV0XCI6XG4gICAgICB7XG4gICAgICAgIHZhciBfcmVmID0gZWxlbWVudCxcbiAgICAgICAgICB0eXBlID0gX3JlZi50eXBlO1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICBjYXNlIFwiYnV0dG9uXCI6XG4gICAgICAgICAgY2FzZSBcImltYWdlXCI6XG4gICAgICAgICAgY2FzZSBcInJlc2V0XCI6XG4gICAgICAgICAgY2FzZSBcInN1Ym1pdFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiYnV0dG9uXCI7XG4gICAgICAgICAgY2FzZSBcImNoZWNrYm94XCI6XG4gICAgICAgICAgY2FzZSBcInJhZGlvXCI6XG4gICAgICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgICAgICBjYXNlIFwicmFuZ2VcIjpcbiAgICAgICAgICAgIHJldHVybiBcInNsaWRlclwiO1xuICAgICAgICAgIGNhc2UgXCJlbWFpbFwiOlxuICAgICAgICAgIGNhc2UgXCJ0ZWxcIjpcbiAgICAgICAgICBjYXNlIFwidGV4dFwiOlxuICAgICAgICAgIGNhc2UgXCJ1cmxcIjpcbiAgICAgICAgICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZShcImxpc3RcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFwiY29tYm9ib3hcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBcInRleHRib3hcIjtcbiAgICAgICAgICBjYXNlIFwic2VhcmNoXCI6XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJsaXN0XCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBcImNvbWJvYm94XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gXCJzZWFyY2hib3hcIjtcbiAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJzcGluYnV0dG9uXCI7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgY2FzZSBcInNlbGVjdFwiOlxuICAgICAgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKFwibXVsdGlwbGVcIikgfHwgZWxlbWVudC5zaXplID4gMSkge1xuICAgICAgICByZXR1cm4gXCJsaXN0Ym94XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gXCJjb21ib2JveFwiO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gZ2V0RXhwbGljaXRSb2xlKGVsZW1lbnQpIHtcbiAgdmFyIHJvbGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcInJvbGVcIik7XG4gIGlmIChyb2xlICE9PSBudWxsKSB7XG4gICAgdmFyIGV4cGxpY2l0Um9sZSA9IHJvbGUudHJpbSgpLnNwbGl0KFwiIFwiKVswXTtcbiAgICAvLyBTdHJpbmcucHJvdG90eXBlLnNwbGl0KHNlcCwgbGltaXQpIHdpbGwgYWx3YXlzIHJldHVybiBhbiBhcnJheSB3aXRoIGF0IGxlYXN0IG9uZSBtZW1iZXJcbiAgICAvLyBhcyBsb25nIGFzIGxpbWl0IGlzIGVpdGhlciB1bmRlZmluZWQgb3IgPiAwXG4gICAgaWYgKGV4cGxpY2l0Um9sZS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gZXhwbGljaXRSb2xlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdldFJvbGUubWpzLm1hcCIsImV4cG9ydCB7IGdldExvY2FsTmFtZSB9IGZyb20gXCIuL2dldFJvbGUubWpzXCI7XG5pbXBvcnQgZ2V0Um9sZSwgeyBnZXRMb2NhbE5hbWUgfSBmcm9tIFwiLi9nZXRSb2xlLm1qc1wiO1xuZXhwb3J0IHZhciBwcmVzZW50YXRpb25Sb2xlcyA9IFtcInByZXNlbnRhdGlvblwiLCBcIm5vbmVcIl07XG5leHBvcnQgZnVuY3Rpb24gaXNFbGVtZW50KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgIT09IG51bGwgJiYgbm9kZS5ub2RlVHlwZSA9PT0gbm9kZS5FTEVNRU5UX05PREU7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNIVE1MVGFibGVDYXB0aW9uRWxlbWVudChub2RlKSB7XG4gIHJldHVybiBpc0VsZW1lbnQobm9kZSkgJiYgZ2V0TG9jYWxOYW1lKG5vZGUpID09PSBcImNhcHRpb25cIjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0hUTUxJbnB1dEVsZW1lbnQobm9kZSkge1xuICByZXR1cm4gaXNFbGVtZW50KG5vZGUpICYmIGdldExvY2FsTmFtZShub2RlKSA9PT0gXCJpbnB1dFwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzSFRNTE9wdEdyb3VwRWxlbWVudChub2RlKSB7XG4gIHJldHVybiBpc0VsZW1lbnQobm9kZSkgJiYgZ2V0TG9jYWxOYW1lKG5vZGUpID09PSBcIm9wdGdyb3VwXCI7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNIVE1MU2VsZWN0RWxlbWVudChub2RlKSB7XG4gIHJldHVybiBpc0VsZW1lbnQobm9kZSkgJiYgZ2V0TG9jYWxOYW1lKG5vZGUpID09PSBcInNlbGVjdFwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzSFRNTFRhYmxlRWxlbWVudChub2RlKSB7XG4gIHJldHVybiBpc0VsZW1lbnQobm9kZSkgJiYgZ2V0TG9jYWxOYW1lKG5vZGUpID09PSBcInRhYmxlXCI7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNIVE1MVGV4dEFyZWFFbGVtZW50KG5vZGUpIHtcbiAgcmV0dXJuIGlzRWxlbWVudChub2RlKSAmJiBnZXRMb2NhbE5hbWUobm9kZSkgPT09IFwidGV4dGFyZWFcIjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzYWZlV2luZG93KG5vZGUpIHtcbiAgdmFyIF9yZWYgPSBub2RlLm93bmVyRG9jdW1lbnQgPT09IG51bGwgPyBub2RlIDogbm9kZS5vd25lckRvY3VtZW50LFxuICAgIGRlZmF1bHRWaWV3ID0gX3JlZi5kZWZhdWx0VmlldztcbiAgaWYgKGRlZmF1bHRWaWV3ID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm5vIHdpbmRvdyBhdmFpbGFibGVcIik7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRWaWV3O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzSFRNTEZpZWxkU2V0RWxlbWVudChub2RlKSB7XG4gIHJldHVybiBpc0VsZW1lbnQobm9kZSkgJiYgZ2V0TG9jYWxOYW1lKG5vZGUpID09PSBcImZpZWxkc2V0XCI7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNIVE1MTGVnZW5kRWxlbWVudChub2RlKSB7XG4gIHJldHVybiBpc0VsZW1lbnQobm9kZSkgJiYgZ2V0TG9jYWxOYW1lKG5vZGUpID09PSBcImxlZ2VuZFwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzSFRNTFNsb3RFbGVtZW50KG5vZGUpIHtcbiAgcmV0dXJuIGlzRWxlbWVudChub2RlKSAmJiBnZXRMb2NhbE5hbWUobm9kZSkgPT09IFwic2xvdFwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzU1ZHRWxlbWVudChub2RlKSB7XG4gIHJldHVybiBpc0VsZW1lbnQobm9kZSkgJiYgbm9kZS5vd25lclNWR0VsZW1lbnQgIT09IHVuZGVmaW5lZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1NWR1NWR0VsZW1lbnQobm9kZSkge1xuICByZXR1cm4gaXNFbGVtZW50KG5vZGUpICYmIGdldExvY2FsTmFtZShub2RlKSA9PT0gXCJzdmdcIjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1NWR1RpdGxlRWxlbWVudChub2RlKSB7XG4gIHJldHVybiBpc1NWR0VsZW1lbnQobm9kZSkgJiYgZ2V0TG9jYWxOYW1lKG5vZGUpID09PSBcInRpdGxlXCI7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAtXG4gKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlTmFtZSAtXG4gKiBAcmV0dXJucyB7RWxlbWVudFtdfSAtXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBxdWVyeUlkUmVmcyhub2RlLCBhdHRyaWJ1dGVOYW1lKSB7XG4gIGlmIChpc0VsZW1lbnQobm9kZSkgJiYgbm9kZS5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSkpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvbiAtLSBzYWZlIGR1ZSB0byBoYXNBdHRyaWJ1dGUgY2hlY2tcbiAgICB2YXIgaWRzID0gbm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSkuc3BsaXQoXCIgXCIpO1xuXG4gICAgLy8gQnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IHNoYWRvdyBET00gd29uJ3QgaGF2ZSBnZXRSb290Tm9kZVxuICAgIHZhciByb290ID0gbm9kZS5nZXRSb290Tm9kZSA/IG5vZGUuZ2V0Um9vdE5vZGUoKSA6IG5vZGUub3duZXJEb2N1bWVudDtcbiAgICByZXR1cm4gaWRzLm1hcChmdW5jdGlvbiAoaWQpIHtcbiAgICAgIHJldHVybiByb290LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBlbGVtZW50ICE9PSBudWxsO1xuICAgIH1cbiAgICAvLyBUT0RPOiB3aHkgZG9lcyB0aGlzIG5vdCBuYXJyb3c/XG4gICAgKTtcbiAgfVxuICByZXR1cm4gW107XG59XG5leHBvcnQgZnVuY3Rpb24gaGFzQW55Q29uY3JldGVSb2xlcyhub2RlLCByb2xlcykge1xuICBpZiAoaXNFbGVtZW50KG5vZGUpKSB7XG4gICAgcmV0dXJuIHJvbGVzLmluZGV4T2YoZ2V0Um9sZShub2RlKSkgIT09IC0xO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWwubWpzLm1hcCIsIi8qKlxuICogaW1wbGVtZW50cyBodHRwczovL3czYy5naXRodWIuaW8vYWNjbmFtZS9cbiAqL1xuaW1wb3J0IEFycmF5RnJvbSBmcm9tIFwiLi9wb2x5ZmlsbHMvYXJyYXkuZnJvbS5tanNcIjtcbmltcG9ydCBTZXRMaWtlIGZyb20gXCIuL3BvbHlmaWxscy9TZXRMaWtlLm1qc1wiO1xuaW1wb3J0IHsgaGFzQW55Q29uY3JldGVSb2xlcywgaXNFbGVtZW50LCBpc0hUTUxUYWJsZUNhcHRpb25FbGVtZW50LCBpc0hUTUxJbnB1dEVsZW1lbnQsIGlzSFRNTFNlbGVjdEVsZW1lbnQsIGlzSFRNTFRleHRBcmVhRWxlbWVudCwgc2FmZVdpbmRvdywgaXNIVE1MRmllbGRTZXRFbGVtZW50LCBpc0hUTUxMZWdlbmRFbGVtZW50LCBpc0hUTUxPcHRHcm91cEVsZW1lbnQsIGlzSFRNTFRhYmxlRWxlbWVudCwgaXNIVE1MU2xvdEVsZW1lbnQsIGlzU1ZHU1ZHRWxlbWVudCwgaXNTVkdUaXRsZUVsZW1lbnQsIHF1ZXJ5SWRSZWZzLCBnZXRMb2NhbE5hbWUsIHByZXNlbnRhdGlvblJvbGVzIH0gZnJvbSBcIi4vdXRpbC5tanNcIjtcblxuLyoqXG4gKiAgQSBzdHJpbmcgb2YgY2hhcmFjdGVycyB3aGVyZSBhbGwgY2FycmlhZ2UgcmV0dXJucywgbmV3bGluZXMsIHRhYnMsIGFuZCBmb3JtLWZlZWRzIGFyZSByZXBsYWNlZCB3aXRoIGEgc2luZ2xlIHNwYWNlLCBhbmQgbXVsdGlwbGUgc3BhY2VzIGFyZSByZWR1Y2VkIHRvIGEgc2luZ2xlIHNwYWNlLiBUaGUgc3RyaW5nIGNvbnRhaW5zIG9ubHkgY2hhcmFjdGVyIGRhdGE7IGl0IGRvZXMgbm90IGNvbnRhaW4gYW55IG1hcmt1cC5cbiAqL1xuXG4vKipcbiAqIGludGVyZmFjZSBmb3IgYW4gb3B0aW9ucy1iYWcgd2hlcmUgYHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlYCBjYW4gYmUgbW9ja2VkXG4gKi9cblxuLyoqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyAtXG4gKiBAcmV0dXJucyB7RmxhdFN0cmluZ30gLVxuICovXG5mdW5jdGlvbiBhc0ZsYXRTdHJpbmcocykge1xuICByZXR1cm4gcy50cmltKCkucmVwbGFjZSgvXFxzXFxzKy9nLCBcIiBcIik7XG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBub2RlIC1cbiAqIEBwYXJhbSBvcHRpb25zIC0gVGhlc2UgYXJlIG5vdCBvcHRpb25hbCB0byBwcmV2ZW50IGFjY2lkZW50YWxseSBjYWxsaW5nIGl0IHdpdGhvdXQgb3B0aW9ucyBpbiBgY29tcHV0ZUFjY2Vzc2libGVOYW1lYFxuICogQHJldHVybnMge2Jvb2xlYW59IC1cbiAqL1xuZnVuY3Rpb24gaXNIaWRkZW4obm9kZSwgZ2V0Q29tcHV0ZWRTdHlsZUltcGxlbWVudGF0aW9uKSB7XG4gIGlmICghaXNFbGVtZW50KG5vZGUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChub2RlLmhhc0F0dHJpYnV0ZShcImhpZGRlblwiKSB8fCBub2RlLmdldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpID09PSBcInRydWVcIikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZhciBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGVJbXBsZW1lbnRhdGlvbihub2RlKTtcbiAgcmV0dXJuIHN0eWxlLmdldFByb3BlcnR5VmFsdWUoXCJkaXNwbGF5XCIpID09PSBcIm5vbmVcIiB8fCBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwidmlzaWJpbGl0eVwiKSA9PT0gXCJoaWRkZW5cIjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgLVxuICogQHJldHVybnMge2Jvb2xlYW59IC0gQXMgZGVmaW5lZCBpbiBzdGVwIDJFIG9mIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9hY2NuYW1lLyNtYXBwaW5nX2FkZGl0aW9uYWxfbmRfdGVcbiAqL1xuZnVuY3Rpb24gaXNDb250cm9sKG5vZGUpIHtcbiAgcmV0dXJuIGhhc0FueUNvbmNyZXRlUm9sZXMobm9kZSwgW1wiYnV0dG9uXCIsIFwiY29tYm9ib3hcIiwgXCJsaXN0Ym94XCIsIFwidGV4dGJveFwiXSkgfHwgaGFzQWJzdHJhY3RSb2xlKG5vZGUsIFwicmFuZ2VcIik7XG59XG5mdW5jdGlvbiBoYXNBYnN0cmFjdFJvbGUobm9kZSwgcm9sZSkge1xuICBpZiAoIWlzRWxlbWVudChub2RlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzd2l0Y2ggKHJvbGUpIHtcbiAgICBjYXNlIFwicmFuZ2VcIjpcbiAgICAgIHJldHVybiBoYXNBbnlDb25jcmV0ZVJvbGVzKG5vZGUsIFtcIm1ldGVyXCIsIFwicHJvZ3Jlc3NiYXJcIiwgXCJzY3JvbGxiYXJcIiwgXCJzbGlkZXJcIiwgXCJzcGluYnV0dG9uXCJdKTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk5vIGtub3dsZWRnZSBhYm91dCBhYnN0cmFjdCByb2xlICdcIi5jb25jYXQocm9sZSwgXCInLiBUaGlzIGlzIGxpa2VseSBhIGJ1ZyA6KFwiKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgYnV0IGFsc28gY29uc2lkZXJzIG93bmVkIHRyZWVcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gc2VsZWN0b3JzXG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5U2VsZWN0b3JBbGxTdWJ0cmVlKGVsZW1lbnQsIHNlbGVjdG9ycykge1xuICB2YXIgZWxlbWVudHMgPSBBcnJheUZyb20oZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycykpO1xuICBxdWVyeUlkUmVmcyhlbGVtZW50LCBcImFyaWEtb3duc1wiKS5mb3JFYWNoKGZ1bmN0aW9uIChyb290KSB7XG4gICAgLy8gYmFiZWwgdHJhbnNwaWxlcyB0aGlzIGFzc3VtaW5nIGFuIGl0ZXJhdG9yXG4gICAgZWxlbWVudHMucHVzaC5hcHBseShlbGVtZW50cywgQXJyYXlGcm9tKHJvb3QucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMpKSk7XG4gIH0pO1xuICByZXR1cm4gZWxlbWVudHM7XG59XG5mdW5jdGlvbiBxdWVyeVNlbGVjdGVkT3B0aW9ucyhsaXN0Ym94KSB7XG4gIGlmIChpc0hUTUxTZWxlY3RFbGVtZW50KGxpc3Rib3gpKSB7XG4gICAgLy8gSUUxMSBwb2x5ZmlsbFxuICAgIHJldHVybiBsaXN0Ym94LnNlbGVjdGVkT3B0aW9ucyB8fCBxdWVyeVNlbGVjdG9yQWxsU3VidHJlZShsaXN0Ym94LCBcIltzZWxlY3RlZF1cIik7XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5U2VsZWN0b3JBbGxTdWJ0cmVlKGxpc3Rib3gsICdbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKTtcbn1cbmZ1bmN0aW9uIGlzTWFya2VkUHJlc2VudGF0aW9uYWwobm9kZSkge1xuICByZXR1cm4gaGFzQW55Q29uY3JldGVSb2xlcyhub2RlLCBwcmVzZW50YXRpb25Sb2xlcyk7XG59XG5cbi8qKlxuICogRWxlbWVudHMgc3BlY2lmaWNhbGx5IGxpc3RlZCBpbiBodG1sLWFhbVxuICpcbiAqIFdlIGRvbid0IG5lZWQgdGhpcyBmb3IgYGxhYmVsYCBvciBgbGVnZW5kYCBlbGVtZW50cy5cbiAqIFRoZWlyIGltcGxpY2l0IHJvbGVzIGFscmVhZHkgYWxsb3cgXCJuYW1pbmcgZnJvbSBjb250ZW50XCIuXG4gKlxuICogc291cmNlczpcbiAqXG4gKiAtIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9odG1sLWFhbS8jdGFibGUtZWxlbWVudFxuICovXG5mdW5jdGlvbiBpc05hdGl2ZUhvc3RMYW5ndWFnZVRleHRBbHRlcm5hdGl2ZUVsZW1lbnQobm9kZSkge1xuICByZXR1cm4gaXNIVE1MVGFibGVDYXB0aW9uRWxlbWVudChub2RlKTtcbn1cblxuLyoqXG4gKiBodHRwczovL3czYy5naXRodWIuaW8vYXJpYS8jbmFtZWZyb21jb250ZW50XG4gKi9cbmZ1bmN0aW9uIGFsbG93c05hbWVGcm9tQ29udGVudChub2RlKSB7XG4gIHJldHVybiBoYXNBbnlDb25jcmV0ZVJvbGVzKG5vZGUsIFtcImJ1dHRvblwiLCBcImNlbGxcIiwgXCJjaGVja2JveFwiLCBcImNvbHVtbmhlYWRlclwiLCBcImdyaWRjZWxsXCIsIFwiaGVhZGluZ1wiLCBcImxhYmVsXCIsIFwibGVnZW5kXCIsIFwibGlua1wiLCBcIm1lbnVpdGVtXCIsIFwibWVudWl0ZW1jaGVja2JveFwiLCBcIm1lbnVpdGVtcmFkaW9cIiwgXCJvcHRpb25cIiwgXCJyYWRpb1wiLCBcInJvd1wiLCBcInJvd2hlYWRlclwiLCBcInN3aXRjaFwiLCBcInRhYlwiLCBcInRvb2x0aXBcIiwgXCJ0cmVlaXRlbVwiXSk7XG59XG5cbi8qKlxuICogVE9ETyBodHRwczovL2dpdGh1Yi5jb20vZXBzMWxvbi9kb20tYWNjZXNzaWJpbGl0eS1hcGkvaXNzdWVzLzEwMFxuICovXG5mdW5jdGlvbiBpc0Rlc2NlbmRhbnRPZk5hdGl2ZUhvc3RMYW5ndWFnZVRleHRBbHRlcm5hdGl2ZUVsZW1lbnQoXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzIC0tIG5vdCBpbXBsZW1lbnRlZCB5ZXRcbm5vZGUpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gZ2V0VmFsdWVPZlRleHRib3goZWxlbWVudCkge1xuICBpZiAoaXNIVE1MSW5wdXRFbGVtZW50KGVsZW1lbnQpIHx8IGlzSFRNTFRleHRBcmVhRWxlbWVudChlbGVtZW50KSkge1xuICAgIHJldHVybiBlbGVtZW50LnZhbHVlO1xuICB9XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lcHMxbG9uL2RvbS1hY2Nlc3NpYmlsaXR5LWFwaS9pc3N1ZXMvNFxuICByZXR1cm4gZWxlbWVudC50ZXh0Q29udGVudCB8fCBcIlwiO1xufVxuZnVuY3Rpb24gZ2V0VGV4dHVhbENvbnRlbnQoZGVjbGFyYXRpb24pIHtcbiAgdmFyIGNvbnRlbnQgPSBkZWNsYXJhdGlvbi5nZXRQcm9wZXJ0eVZhbHVlKFwiY29udGVudFwiKTtcbiAgaWYgKC9eW1wiJ10uKltcIiddJC8udGVzdChjb250ZW50KSkge1xuICAgIHJldHVybiBjb250ZW50LnNsaWNlKDEsIC0xKTtcbiAgfVxuICByZXR1cm4gXCJcIjtcbn1cblxuLyoqXG4gKiBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI2NhdGVnb3J5LWxhYmVsXG4gKiBUT0RPOiBmb3JtLWFzc29jaWF0ZWQgY3VzdG9tIGVsZW1lbnRzXG4gKiBAcGFyYW0gZWxlbWVudFxuICovXG5mdW5jdGlvbiBpc0xhYmVsYWJsZUVsZW1lbnQoZWxlbWVudCkge1xuICB2YXIgbG9jYWxOYW1lID0gZ2V0TG9jYWxOYW1lKGVsZW1lbnQpO1xuICByZXR1cm4gbG9jYWxOYW1lID09PSBcImJ1dHRvblwiIHx8IGxvY2FsTmFtZSA9PT0gXCJpbnB1dFwiICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSAhPT0gXCJoaWRkZW5cIiB8fCBsb2NhbE5hbWUgPT09IFwibWV0ZXJcIiB8fCBsb2NhbE5hbWUgPT09IFwib3V0cHV0XCIgfHwgbG9jYWxOYW1lID09PSBcInByb2dyZXNzXCIgfHwgbG9jYWxOYW1lID09PSBcInNlbGVjdFwiIHx8IGxvY2FsTmFtZSA9PT0gXCJ0ZXh0YXJlYVwiO1xufVxuXG4vKipcbiAqID4gWy4uLl0sIHRoZW4gdGhlIGZpcnN0IHN1Y2ggZGVzY2VuZGFudCBpbiB0cmVlIG9yZGVyIGlzIHRoZSBsYWJlbCBlbGVtZW50J3MgbGFiZWxlZCBjb250cm9sLlxuICogLS0gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCNsYWJlbGVkLWNvbnRyb2xcbiAqIEBwYXJhbSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGZpbmRMYWJlbGFibGVFbGVtZW50KGVsZW1lbnQpIHtcbiAgaWYgKGlzTGFiZWxhYmxlRWxlbWVudChlbGVtZW50KSkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG4gIHZhciBsYWJlbGFibGVFbGVtZW50ID0gbnVsbDtcbiAgZWxlbWVudC5jaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkTm9kZSkge1xuICAgIGlmIChsYWJlbGFibGVFbGVtZW50ID09PSBudWxsICYmIGlzRWxlbWVudChjaGlsZE5vZGUpKSB7XG4gICAgICB2YXIgZGVzY2VuZGFudExhYmVsYWJsZUVsZW1lbnQgPSBmaW5kTGFiZWxhYmxlRWxlbWVudChjaGlsZE5vZGUpO1xuICAgICAgaWYgKGRlc2NlbmRhbnRMYWJlbGFibGVFbGVtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIGxhYmVsYWJsZUVsZW1lbnQgPSBkZXNjZW5kYW50TGFiZWxhYmxlRWxlbWVudDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGFiZWxhYmxlRWxlbWVudDtcbn1cblxuLyoqXG4gKiBQb2x5ZmlsbCBvZiBIVE1MTGFiZWxFbGVtZW50LmNvbnRyb2xcbiAqIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjbGFiZWxlZC1jb250cm9sXG4gKiBAcGFyYW0gbGFiZWxcbiAqL1xuZnVuY3Rpb24gZ2V0Q29udHJvbE9mTGFiZWwobGFiZWwpIHtcbiAgaWYgKGxhYmVsLmNvbnRyb2wgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBsYWJlbC5jb250cm9sO1xuICB9XG4gIHZhciBodG1sRm9yID0gbGFiZWwuZ2V0QXR0cmlidXRlKFwiZm9yXCIpO1xuICBpZiAoaHRtbEZvciAhPT0gbnVsbCkge1xuICAgIHJldHVybiBsYWJlbC5vd25lckRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxGb3IpO1xuICB9XG4gIHJldHVybiBmaW5kTGFiZWxhYmxlRWxlbWVudChsYWJlbCk7XG59XG5cbi8qKlxuICogUG9seWZpbGwgb2YgSFRNTElucHV0RWxlbWVudC5sYWJlbHNcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MSW5wdXRFbGVtZW50L2xhYmVsc1xuICogQHBhcmFtIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gZ2V0TGFiZWxzKGVsZW1lbnQpIHtcbiAgdmFyIGxhYmVsc1Byb3BlcnR5ID0gZWxlbWVudC5sYWJlbHM7XG4gIGlmIChsYWJlbHNQcm9wZXJ0eSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBsYWJlbHNQcm9wZXJ0eTtcbiAgfVxuICBpZiAobGFiZWxzUHJvcGVydHkgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBBcnJheUZyb20obGFiZWxzUHJvcGVydHkpO1xuICB9XG5cbiAgLy8gcG9seWZpbGxcbiAgaWYgKCFpc0xhYmVsYWJsZUVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgZG9jdW1lbnQgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQ7XG4gIHJldHVybiBBcnJheUZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImxhYmVsXCIpKS5maWx0ZXIoZnVuY3Rpb24gKGxhYmVsKSB7XG4gICAgcmV0dXJuIGdldENvbnRyb2xPZkxhYmVsKGxhYmVsKSA9PT0gZWxlbWVudDtcbiAgfSk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgY29udGVudHMgb2YgYSBzbG90IHVzZWQgZm9yIGNvbXB1dGluZyB0aGUgYWNjbmFtZVxuICogQHBhcmFtIHNsb3RcbiAqL1xuZnVuY3Rpb24gZ2V0U2xvdENvbnRlbnRzKHNsb3QpIHtcbiAgLy8gQ29tcHV0aW5nIHRoZSBhY2Nlc3NpYmxlIG5hbWUgZm9yIGVsZW1lbnRzIGNvbnRhaW5pbmcgc2xvdHMgaXMgbm90XG4gIC8vIGN1cnJlbnRseSBkZWZpbmVkIGluIHRoZSBzcGVjLiBUaGlzIGltcGxlbWVudGF0aW9uIHJlZmxlY3RzIHRoZVxuICAvLyBiZWhhdmlvciBvZiBOVkRBIDIwMjAuMi9GaXJlZm94IDgxIGFuZCBpT1MgVm9pY2VPdmVyL1NhZmFyaSAxMy42LlxuICB2YXIgYXNzaWduZWROb2RlcyA9IHNsb3QuYXNzaWduZWROb2RlcygpO1xuICBpZiAoYXNzaWduZWROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAvLyBpZiBubyBub2RlcyBhcmUgYXNzaWduZWQgdG8gdGhlIHNsb3QsIGl0IGRpc3BsYXlzIHRoZSBkZWZhdWx0IGNvbnRlbnRcbiAgICByZXR1cm4gQXJyYXlGcm9tKHNsb3QuY2hpbGROb2Rlcyk7XG4gIH1cbiAgcmV0dXJuIGFzc2lnbmVkTm9kZXM7XG59XG5cbi8qKlxuICogaW1wbGVtZW50cyBodHRwczovL3czYy5naXRodWIuaW8vYWNjbmFtZS8jbWFwcGluZ19hZGRpdGlvbmFsX25kX3RlXG4gKiBAcGFyYW0gcm9vdFxuICogQHBhcmFtIG9wdGlvbnNcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlVGV4dEFsdGVybmF0aXZlKHJvb3QpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICB2YXIgY29uc3VsdGVkTm9kZXMgPSBuZXcgU2V0TGlrZSgpO1xuICB2YXIgY29tcHV0ZWRTdHlsZXMgPSB0eXBlb2YgTWFwID09PSBcInVuZGVmaW5lZFwiID8gdW5kZWZpbmVkIDogbmV3IE1hcCgpO1xuICB2YXIgd2luZG93ID0gc2FmZVdpbmRvdyhyb290KTtcbiAgdmFyIF9vcHRpb25zJGNvbXB1dGUgPSBvcHRpb25zLmNvbXB1dGUsXG4gICAgY29tcHV0ZSA9IF9vcHRpb25zJGNvbXB1dGUgPT09IHZvaWQgMCA/IFwibmFtZVwiIDogX29wdGlvbnMkY29tcHV0ZSxcbiAgICBfb3B0aW9ucyRjb21wdXRlZFN0eWwgPSBvcHRpb25zLmNvbXB1dGVkU3R5bGVTdXBwb3J0c1BzZXVkb0VsZW1lbnRzLFxuICAgIGNvbXB1dGVkU3R5bGVTdXBwb3J0c1BzZXVkb0VsZW1lbnRzID0gX29wdGlvbnMkY29tcHV0ZWRTdHlsID09PSB2b2lkIDAgPyBvcHRpb25zLmdldENvbXB1dGVkU3R5bGUgIT09IHVuZGVmaW5lZCA6IF9vcHRpb25zJGNvbXB1dGVkU3R5bCxcbiAgICBfb3B0aW9ucyRnZXRDb21wdXRlZFMgPSBvcHRpb25zLmdldENvbXB1dGVkU3R5bGUsXG4gICAgdW5jYWNoZWRHZXRDb21wdXRlZFN0eWxlID0gX29wdGlvbnMkZ2V0Q29tcHV0ZWRTID09PSB2b2lkIDAgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZS5iaW5kKHdpbmRvdykgOiBfb3B0aW9ucyRnZXRDb21wdXRlZFMsXG4gICAgX29wdGlvbnMkaGlkZGVuID0gb3B0aW9ucy5oaWRkZW4sXG4gICAgaGlkZGVuID0gX29wdGlvbnMkaGlkZGVuID09PSB2b2lkIDAgPyBmYWxzZSA6IF9vcHRpb25zJGhpZGRlbjtcbiAgdmFyIGdldENvbXB1dGVkU3R5bGUgPSBmdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsLCBwc2V1ZG9FbGVtZW50KSB7XG4gICAgLy8gV2UgZG9uJ3QgY2FjaGUgdGhlIHBzZXVkb0VsZW1lbnQgc3R5bGVzIGFuZCBjYWxscyB3aXRoIHBzdWVkbyBlbGVtZW50c1xuICAgIC8vIHNob3VsZCB1c2UgdGhlIHVuY2FjaGVkIHZlcnNpb24gaW5zdGVhZFxuICAgIGlmIChwc2V1ZG9FbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInVzZSB1bmNhY2hlZEdldENvbXB1dGVkU3R5bGUgZGlyZWN0bHkgZm9yIHBzZXVkbyBlbGVtZW50c1wiKTtcbiAgICB9XG4gICAgLy8gSWYgTWFwIGlzIG5vdCBhdmFpbGFibGUsIGl0IGlzIHByb2JhYmx5IGZhc3RlciB0byBqdXN0IHVzZSB0aGUgdW5jYWNoZWRcbiAgICAvLyB2ZXJzaW9uIHNpbmNlIGEgcG9seWZpbGwgbG9va3VwIHdvdWxkIGJlIE8obikgaW5zdGVhZCBvZiBPKDEpIGFuZFxuICAgIC8vIHRoZSBnZXRDb21wdXRlZFN0eWxlIGZ1bmN0aW9uIGluIHRob3NlIGVudmlyb25tZW50cyhlLmcuIElFMTEpIGlzIGZhc3RcbiAgICBpZiAoY29tcHV0ZWRTdHlsZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuY2FjaGVkR2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgfVxuICAgIHZhciBjYWNoZWRTdHlsZXMgPSBjb21wdXRlZFN0eWxlcy5nZXQoZWwpO1xuICAgIGlmIChjYWNoZWRTdHlsZXMpIHtcbiAgICAgIHJldHVybiBjYWNoZWRTdHlsZXM7XG4gICAgfVxuICAgIHZhciBzdHlsZSA9IHVuY2FjaGVkR2V0Q29tcHV0ZWRTdHlsZShlbCwgcHNldWRvRWxlbWVudCk7XG4gICAgY29tcHV0ZWRTdHlsZXMuc2V0KGVsLCBzdHlsZSk7XG4gICAgcmV0dXJuIHN0eWxlO1xuICB9O1xuXG4gIC8vIDJGLmlcbiAgZnVuY3Rpb24gY29tcHV0ZU1pc2NUZXh0QWx0ZXJuYXRpdmUobm9kZSwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bXVsYXRlZFRleHQgPSBcIlwiO1xuICAgIGlmIChpc0VsZW1lbnQobm9kZSkgJiYgY29tcHV0ZWRTdHlsZVN1cHBvcnRzUHNldWRvRWxlbWVudHMpIHtcbiAgICAgIHZhciBwc2V1ZG9CZWZvcmUgPSB1bmNhY2hlZEdldENvbXB1dGVkU3R5bGUobm9kZSwgXCI6OmJlZm9yZVwiKTtcbiAgICAgIHZhciBiZWZvcmVDb250ZW50ID0gZ2V0VGV4dHVhbENvbnRlbnQocHNldWRvQmVmb3JlKTtcbiAgICAgIGFjY3VtdWxhdGVkVGV4dCA9IFwiXCIuY29uY2F0KGJlZm9yZUNvbnRlbnQsIFwiIFwiKS5jb25jYXQoYWNjdW11bGF0ZWRUZXh0KTtcbiAgICB9XG5cbiAgICAvLyBGSVhNRTogSW5jbHVkaW5nIGFyaWEtb3ducyBpcyBub3QgZGVmaW5lZCBpbiB0aGUgc3BlY1xuICAgIC8vIEJ1dCBpdCBpcyByZXF1aXJlZCBpbiB0aGUgd2ViLXBsYXRmb3JtLXRlc3RcbiAgICB2YXIgY2hpbGROb2RlcyA9IGlzSFRNTFNsb3RFbGVtZW50KG5vZGUpID8gZ2V0U2xvdENvbnRlbnRzKG5vZGUpIDogQXJyYXlGcm9tKG5vZGUuY2hpbGROb2RlcykuY29uY2F0KHF1ZXJ5SWRSZWZzKG5vZGUsIFwiYXJpYS1vd25zXCIpKTtcbiAgICBjaGlsZE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gY29tcHV0ZVRleHRBbHRlcm5hdGl2ZShjaGlsZCwge1xuICAgICAgICBpc0VtYmVkZGVkSW5MYWJlbDogY29udGV4dC5pc0VtYmVkZGVkSW5MYWJlbCxcbiAgICAgICAgaXNSZWZlcmVuY2VkOiBmYWxzZSxcbiAgICAgICAgcmVjdXJzaW9uOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIC8vIFRPRE86IFVuY2xlYXIgd2h5IGRpc3BsYXkgYWZmZWN0cyBkZWxpbWl0ZXJcbiAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vdzNjL2FjY25hbWUvaXNzdWVzLzNcbiAgICAgIHZhciBkaXNwbGF5ID0gaXNFbGVtZW50KGNoaWxkKSA/IGdldENvbXB1dGVkU3R5bGUoY2hpbGQpLmdldFByb3BlcnR5VmFsdWUoXCJkaXNwbGF5XCIpIDogXCJpbmxpbmVcIjtcbiAgICAgIHZhciBzZXBhcmF0b3IgPSBkaXNwbGF5ICE9PSBcImlubGluZVwiID8gXCIgXCIgOiBcIlwiO1xuICAgICAgLy8gdHJhaWxpbmcgc2VwYXJhdG9yIGZvciB3cHQgdGVzdHNcbiAgICAgIGFjY3VtdWxhdGVkVGV4dCArPSBcIlwiLmNvbmNhdChzZXBhcmF0b3IpLmNvbmNhdChyZXN1bHQpLmNvbmNhdChzZXBhcmF0b3IpO1xuICAgIH0pO1xuICAgIGlmIChpc0VsZW1lbnQobm9kZSkgJiYgY29tcHV0ZWRTdHlsZVN1cHBvcnRzUHNldWRvRWxlbWVudHMpIHtcbiAgICAgIHZhciBwc2V1ZG9BZnRlciA9IHVuY2FjaGVkR2V0Q29tcHV0ZWRTdHlsZShub2RlLCBcIjo6YWZ0ZXJcIik7XG4gICAgICB2YXIgYWZ0ZXJDb250ZW50ID0gZ2V0VGV4dHVhbENvbnRlbnQocHNldWRvQWZ0ZXIpO1xuICAgICAgYWNjdW11bGF0ZWRUZXh0ID0gXCJcIi5jb25jYXQoYWNjdW11bGF0ZWRUZXh0LCBcIiBcIikuY29uY2F0KGFmdGVyQ29udGVudCk7XG4gICAgfVxuICAgIHJldHVybiBhY2N1bXVsYXRlZFRleHQudHJpbSgpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqIEBwYXJhbSBhdHRyaWJ1dGVOYW1lXG4gICAqIEByZXR1cm5zIEEgc3RyaW5nIG5vbi1lbXB0eSBzdHJpbmcgb3IgYG51bGxgXG4gICAqL1xuICBmdW5jdGlvbiB1c2VBdHRyaWJ1dGUoZWxlbWVudCwgYXR0cmlidXRlTmFtZSkge1xuICAgIHZhciBhdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZU5vZGUoYXR0cmlidXRlTmFtZSk7XG4gICAgaWYgKGF0dHJpYnV0ZSAhPT0gbnVsbCAmJiAhY29uc3VsdGVkTm9kZXMuaGFzKGF0dHJpYnV0ZSkgJiYgYXR0cmlidXRlLnZhbHVlLnRyaW0oKSAhPT0gXCJcIikge1xuICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKGF0dHJpYnV0ZSk7XG4gICAgICByZXR1cm4gYXR0cmlidXRlLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBmdW5jdGlvbiBjb21wdXRlVG9vbHRpcEF0dHJpYnV0ZVZhbHVlKG5vZGUpIHtcbiAgICBpZiAoIWlzRWxlbWVudChub2RlKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB1c2VBdHRyaWJ1dGUobm9kZSwgXCJ0aXRsZVwiKTtcbiAgfVxuICBmdW5jdGlvbiBjb21wdXRlRWxlbWVudFRleHRBbHRlcm5hdGl2ZShub2RlKSB7XG4gICAgaWYgKCFpc0VsZW1lbnQobm9kZSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9odG1sLWFhbS8jZmllbGRzZXQtYW5kLWxlZ2VuZC1lbGVtZW50c1xuICAgIGlmIChpc0hUTUxGaWVsZFNldEVsZW1lbnQobm9kZSkpIHtcbiAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChub2RlKTtcbiAgICAgIHZhciBjaGlsZHJlbiA9IEFycmF5RnJvbShub2RlLmNoaWxkTm9kZXMpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgaWYgKGlzSFRNTExlZ2VuZEVsZW1lbnQoY2hpbGQpKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbXB1dGVUZXh0QWx0ZXJuYXRpdmUoY2hpbGQsIHtcbiAgICAgICAgICAgIGlzRW1iZWRkZWRJbkxhYmVsOiBmYWxzZSxcbiAgICAgICAgICAgIGlzUmVmZXJlbmNlZDogZmFsc2UsXG4gICAgICAgICAgICByZWN1cnNpb246IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzSFRNTFRhYmxlRWxlbWVudChub2RlKSkge1xuICAgICAgLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2h0bWwtYWFtLyN0YWJsZS1lbGVtZW50XG4gICAgICBjb25zdWx0ZWROb2Rlcy5hZGQobm9kZSk7XG4gICAgICB2YXIgX2NoaWxkcmVuID0gQXJyYXlGcm9tKG5vZGUuY2hpbGROb2Rlcyk7XG4gICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgX2NoaWxkcmVuLmxlbmd0aDsgX2kgKz0gMSkge1xuICAgICAgICB2YXIgX2NoaWxkID0gX2NoaWxkcmVuW19pXTtcbiAgICAgICAgaWYgKGlzSFRNTFRhYmxlQ2FwdGlvbkVsZW1lbnQoX2NoaWxkKSkge1xuICAgICAgICAgIHJldHVybiBjb21wdXRlVGV4dEFsdGVybmF0aXZlKF9jaGlsZCwge1xuICAgICAgICAgICAgaXNFbWJlZGRlZEluTGFiZWw6IGZhbHNlLFxuICAgICAgICAgICAgaXNSZWZlcmVuY2VkOiBmYWxzZSxcbiAgICAgICAgICAgIHJlY3Vyc2lvbjogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNTVkdTVkdFbGVtZW50KG5vZGUpKSB7XG4gICAgICAvLyBodHRwczovL3d3dy53My5vcmcvVFIvc3ZnLWFhbS0xLjAvXG4gICAgICBjb25zdWx0ZWROb2Rlcy5hZGQobm9kZSk7XG4gICAgICB2YXIgX2NoaWxkcmVuMiA9IEFycmF5RnJvbShub2RlLmNoaWxkTm9kZXMpO1xuICAgICAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgX2NoaWxkcmVuMi5sZW5ndGg7IF9pMiArPSAxKSB7XG4gICAgICAgIHZhciBfY2hpbGQyID0gX2NoaWxkcmVuMltfaTJdO1xuICAgICAgICBpZiAoaXNTVkdUaXRsZUVsZW1lbnQoX2NoaWxkMikpIHtcbiAgICAgICAgICByZXR1cm4gX2NoaWxkMi50ZXh0Q29udGVudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmIChnZXRMb2NhbE5hbWUobm9kZSkgPT09IFwiaW1nXCIgfHwgZ2V0TG9jYWxOYW1lKG5vZGUpID09PSBcImFyZWFcIikge1xuICAgICAgLy8gaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2h0bWwtYWFtLyNhcmVhLWVsZW1lbnRcbiAgICAgIC8vIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9odG1sLWFhbS8jaW1nLWVsZW1lbnRcbiAgICAgIHZhciBuYW1lRnJvbUFsdCA9IHVzZUF0dHJpYnV0ZShub2RlLCBcImFsdFwiKTtcbiAgICAgIGlmIChuYW1lRnJvbUFsdCAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbmFtZUZyb21BbHQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc0hUTUxPcHRHcm91cEVsZW1lbnQobm9kZSkpIHtcbiAgICAgIHZhciBuYW1lRnJvbUxhYmVsID0gdXNlQXR0cmlidXRlKG5vZGUsIFwibGFiZWxcIik7XG4gICAgICBpZiAobmFtZUZyb21MYWJlbCAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbmFtZUZyb21MYWJlbDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzSFRNTElucHV0RWxlbWVudChub2RlKSAmJiAobm9kZS50eXBlID09PSBcImJ1dHRvblwiIHx8IG5vZGUudHlwZSA9PT0gXCJzdWJtaXRcIiB8fCBub2RlLnR5cGUgPT09IFwicmVzZXRcIikpIHtcbiAgICAgIC8vIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9odG1sLWFhbS8jaW5wdXQtdHlwZS10ZXh0LWlucHV0LXR5cGUtcGFzc3dvcmQtaW5wdXQtdHlwZS1zZWFyY2gtaW5wdXQtdHlwZS10ZWwtaW5wdXQtdHlwZS1lbWFpbC1pbnB1dC10eXBlLXVybC1hbmQtdGV4dGFyZWEtZWxlbWVudC1hY2Nlc3NpYmxlLWRlc2NyaXB0aW9uLWNvbXB1dGF0aW9uXG4gICAgICB2YXIgbmFtZUZyb21WYWx1ZSA9IHVzZUF0dHJpYnV0ZShub2RlLCBcInZhbHVlXCIpO1xuICAgICAgaWYgKG5hbWVGcm9tVmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5hbWVGcm9tVmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE86IGwxMG5cbiAgICAgIGlmIChub2RlLnR5cGUgPT09IFwic3VibWl0XCIpIHtcbiAgICAgICAgcmV0dXJuIFwiU3VibWl0XCI7XG4gICAgICB9XG4gICAgICAvLyBUT0RPOiBsMTBuXG4gICAgICBpZiAobm9kZS50eXBlID09PSBcInJlc2V0XCIpIHtcbiAgICAgICAgcmV0dXJuIFwiUmVzZXRcIjtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGxhYmVscyA9IGdldExhYmVscyhub2RlKTtcbiAgICBpZiAobGFiZWxzICE9PSBudWxsICYmIGxhYmVscy5sZW5ndGggIT09IDApIHtcbiAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChub2RlKTtcbiAgICAgIHJldHVybiBBcnJheUZyb20obGFiZWxzKS5tYXAoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGNvbXB1dGVUZXh0QWx0ZXJuYXRpdmUoZWxlbWVudCwge1xuICAgICAgICAgIGlzRW1iZWRkZWRJbkxhYmVsOiB0cnVlLFxuICAgICAgICAgIGlzUmVmZXJlbmNlZDogZmFsc2UsXG4gICAgICAgICAgcmVjdXJzaW9uOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChsYWJlbCkge1xuICAgICAgICByZXR1cm4gbGFiZWwubGVuZ3RoID4gMDtcbiAgICAgIH0pLmpvaW4oXCIgXCIpO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9odG1sLWFhbS8jaW5wdXQtdHlwZS1pbWFnZS1hY2Nlc3NpYmxlLW5hbWUtY29tcHV0YXRpb25cbiAgICAvLyBUT0RPOiB3cHQgdGVzdCBjb25zaWRlciBsYWJlbCBlbGVtZW50cyBidXQgaHRtbC1hYW0gZG9lcyBub3QgbWVudGlvbiB0aGVtXG4gICAgLy8gV2UgZm9sbG93IGV4aXN0aW5nIGltcGxlbWVudGF0aW9ucyBvdmVyIHNwZWNcbiAgICBpZiAoaXNIVE1MSW5wdXRFbGVtZW50KG5vZGUpICYmIG5vZGUudHlwZSA9PT0gXCJpbWFnZVwiKSB7XG4gICAgICB2YXIgX25hbWVGcm9tQWx0ID0gdXNlQXR0cmlidXRlKG5vZGUsIFwiYWx0XCIpO1xuICAgICAgaWYgKF9uYW1lRnJvbUFsdCAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gX25hbWVGcm9tQWx0O1xuICAgICAgfVxuICAgICAgdmFyIG5hbWVGcm9tVGl0bGUgPSB1c2VBdHRyaWJ1dGUobm9kZSwgXCJ0aXRsZVwiKTtcbiAgICAgIGlmIChuYW1lRnJvbVRpdGxlICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBuYW1lRnJvbVRpdGxlO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPOiBsMTBuXG4gICAgICByZXR1cm4gXCJTdWJtaXQgUXVlcnlcIjtcbiAgICB9XG4gICAgaWYgKGhhc0FueUNvbmNyZXRlUm9sZXMobm9kZSwgW1wiYnV0dG9uXCJdKSkge1xuICAgICAgLy8gaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWwtYWFtLTEuMC8jYnV0dG9uLWVsZW1lbnRcbiAgICAgIHZhciBuYW1lRnJvbVN1YlRyZWUgPSBjb21wdXRlTWlzY1RleHRBbHRlcm5hdGl2ZShub2RlLCB7XG4gICAgICAgIGlzRW1iZWRkZWRJbkxhYmVsOiBmYWxzZSxcbiAgICAgICAgaXNSZWZlcmVuY2VkOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBpZiAobmFtZUZyb21TdWJUcmVlICE9PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBuYW1lRnJvbVN1YlRyZWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGZ1bmN0aW9uIGNvbXB1dGVUZXh0QWx0ZXJuYXRpdmUoY3VycmVudCwgY29udGV4dCkge1xuICAgIGlmIChjb25zdWx0ZWROb2Rlcy5oYXMoY3VycmVudCkpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICAvLyAyQVxuICAgIGlmICghaGlkZGVuICYmIGlzSGlkZGVuKGN1cnJlbnQsIGdldENvbXB1dGVkU3R5bGUpICYmICFjb250ZXh0LmlzUmVmZXJlbmNlZCkge1xuICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKGN1cnJlbnQpO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgLy8gMkJcbiAgICB2YXIgbGFiZWxBdHRyaWJ1dGVOb2RlID0gaXNFbGVtZW50KGN1cnJlbnQpID8gY3VycmVudC5nZXRBdHRyaWJ1dGVOb2RlKFwiYXJpYS1sYWJlbGxlZGJ5XCIpIDogbnVsbDtcbiAgICAvLyBUT0RPOiBEbyB3ZSBnZW5lcmFsbHkgbmVlZCB0byBibG9jayBxdWVyeSBJZFJlZnMgb2YgYXR0cmlidXRlcyB3ZSBoYXZlIGFscmVhZHkgY29uc3VsdGVkP1xuICAgIHZhciBsYWJlbEVsZW1lbnRzID0gbGFiZWxBdHRyaWJ1dGVOb2RlICE9PSBudWxsICYmICFjb25zdWx0ZWROb2Rlcy5oYXMobGFiZWxBdHRyaWJ1dGVOb2RlKSA/IHF1ZXJ5SWRSZWZzKGN1cnJlbnQsIFwiYXJpYS1sYWJlbGxlZGJ5XCIpIDogW107XG4gICAgaWYgKGNvbXB1dGUgPT09IFwibmFtZVwiICYmICFjb250ZXh0LmlzUmVmZXJlbmNlZCAmJiBsYWJlbEVsZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uIC0tIENhbid0IGJlIG51bGwgaGVyZSBvdGhlcndpc2UgbGFiZWxFbGVtZW50cyB3b3VsZCBiZSBlbXB0eVxuICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKGxhYmVsQXR0cmlidXRlTm9kZSk7XG4gICAgICByZXR1cm4gbGFiZWxFbGVtZW50cy5tYXAoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgLy8gVE9ETzogQ2hyb21lIHdpbGwgY29uc2lkZXIgcmVwZWF0ZWQgdmFsdWVzIGkuZS4gdXNlIGEgbm9kZSBtdWx0aXBsZSB0aW1lcyB3aGlsZSB3ZSdsbCBiYWlsIG91dCBpbiBjb21wdXRlVGV4dEFsdGVybmF0aXZlLlxuICAgICAgICByZXR1cm4gY29tcHV0ZVRleHRBbHRlcm5hdGl2ZShlbGVtZW50LCB7XG4gICAgICAgICAgaXNFbWJlZGRlZEluTGFiZWw6IGNvbnRleHQuaXNFbWJlZGRlZEluTGFiZWwsXG4gICAgICAgICAgaXNSZWZlcmVuY2VkOiB0cnVlLFxuICAgICAgICAgIC8vIHRoaXMgaXNuJ3QgcmVjdXJzaW9uIGFzIHNwZWNpZmllZCwgb3RoZXJ3aXNlIHdlIHdvdWxkIHNraXBcbiAgICAgICAgICAvLyBgYXJpYS1sYWJlbGAgaW5cbiAgICAgICAgICAvLyA8aW5wdXQgaWQ9XCJteXNlbGZcIiBhcmlhLWxhYmVsPVwiZm9vXCIgYXJpYS1sYWJlbGxlZGJ5PVwibXlzZWxmXCJcbiAgICAgICAgICByZWN1cnNpb246IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfSkuam9pbihcIiBcIik7XG4gICAgfVxuXG4gICAgLy8gMkNcbiAgICAvLyBDaGFuZ2VkIGZyb20gdGhlIHNwZWMgaW4gYW50aWNpcGF0aW9uIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS93M2MvYWNjbmFtZS9pc3N1ZXMvNjRcbiAgICAvLyBzcGVjIHNheXMgd2Ugc2hvdWxkIG9ubHkgY29uc2lkZXIgc2tpcHBpbmcgaWYgd2UgaGF2ZSBhIG5vbi1lbXB0eSBsYWJlbFxuICAgIHZhciBza2lwVG9TdGVwMkUgPSBjb250ZXh0LnJlY3Vyc2lvbiAmJiBpc0NvbnRyb2woY3VycmVudCkgJiYgY29tcHV0ZSA9PT0gXCJuYW1lXCI7XG4gICAgaWYgKCFza2lwVG9TdGVwMkUpIHtcbiAgICAgIHZhciBhcmlhTGFiZWwgPSAoaXNFbGVtZW50KGN1cnJlbnQpICYmIGN1cnJlbnQuZ2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiKSB8fCBcIlwiKS50cmltKCk7XG4gICAgICBpZiAoYXJpYUxhYmVsICE9PSBcIlwiICYmIGNvbXB1dGUgPT09IFwibmFtZVwiKSB7XG4gICAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChjdXJyZW50KTtcbiAgICAgICAgcmV0dXJuIGFyaWFMYWJlbDtcbiAgICAgIH1cblxuICAgICAgLy8gMkRcbiAgICAgIGlmICghaXNNYXJrZWRQcmVzZW50YXRpb25hbChjdXJyZW50KSkge1xuICAgICAgICB2YXIgZWxlbWVudFRleHRBbHRlcm5hdGl2ZSA9IGNvbXB1dGVFbGVtZW50VGV4dEFsdGVybmF0aXZlKGN1cnJlbnQpO1xuICAgICAgICBpZiAoZWxlbWVudFRleHRBbHRlcm5hdGl2ZSAhPT0gbnVsbCkge1xuICAgICAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChjdXJyZW50KTtcbiAgICAgICAgICByZXR1cm4gZWxlbWVudFRleHRBbHRlcm5hdGl2ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNwZWNpYWwgY2FzaW5nLCBjaGVhdGluZyB0byBtYWtlIHRlc3RzIHBhc3NcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdzNjL2FjY25hbWUvaXNzdWVzLzY3XG4gICAgaWYgKGhhc0FueUNvbmNyZXRlUm9sZXMoY3VycmVudCwgW1wibWVudVwiXSkpIHtcbiAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChjdXJyZW50KTtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIC8vIDJFXG4gICAgaWYgKHNraXBUb1N0ZXAyRSB8fCBjb250ZXh0LmlzRW1iZWRkZWRJbkxhYmVsIHx8IGNvbnRleHQuaXNSZWZlcmVuY2VkKSB7XG4gICAgICBpZiAoaGFzQW55Q29uY3JldGVSb2xlcyhjdXJyZW50LCBbXCJjb21ib2JveFwiLCBcImxpc3Rib3hcIl0pKSB7XG4gICAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChjdXJyZW50KTtcbiAgICAgICAgdmFyIHNlbGVjdGVkT3B0aW9ucyA9IHF1ZXJ5U2VsZWN0ZWRPcHRpb25zKGN1cnJlbnQpO1xuICAgICAgICBpZiAoc2VsZWN0ZWRPcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIC8vIGRlZmluZWQgcGVyIHRlc3QgYG5hbWVfaGVhZGluZ19jb21ib2JveGBcbiAgICAgICAgICByZXR1cm4gaXNIVE1MSW5wdXRFbGVtZW50KGN1cnJlbnQpID8gY3VycmVudC52YWx1ZSA6IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEFycmF5RnJvbShzZWxlY3RlZE9wdGlvbnMpLm1hcChmdW5jdGlvbiAoc2VsZWN0ZWRPcHRpb24pIHtcbiAgICAgICAgICByZXR1cm4gY29tcHV0ZVRleHRBbHRlcm5hdGl2ZShzZWxlY3RlZE9wdGlvbiwge1xuICAgICAgICAgICAgaXNFbWJlZGRlZEluTGFiZWw6IGNvbnRleHQuaXNFbWJlZGRlZEluTGFiZWwsXG4gICAgICAgICAgICBpc1JlZmVyZW5jZWQ6IGZhbHNlLFxuICAgICAgICAgICAgcmVjdXJzaW9uOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLmpvaW4oXCIgXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGhhc0Fic3RyYWN0Um9sZShjdXJyZW50LCBcInJhbmdlXCIpKSB7XG4gICAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChjdXJyZW50KTtcbiAgICAgICAgaWYgKGN1cnJlbnQuaGFzQXR0cmlidXRlKFwiYXJpYS12YWx1ZXRleHRcIikpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvbiAtLSBzYWZlIGR1ZSB0byBoYXNBdHRyaWJ1dGUgZ3VhcmRcbiAgICAgICAgICByZXR1cm4gY3VycmVudC5nZXRBdHRyaWJ1dGUoXCJhcmlhLXZhbHVldGV4dFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudC5oYXNBdHRyaWJ1dGUoXCJhcmlhLXZhbHVlbm93XCIpKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb24gLS0gc2FmZSBkdWUgdG8gaGFzQXR0cmlidXRlIGd1YXJkXG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnQuZ2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW5vd1wiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBPdGhlcndpc2UsIHVzZSB0aGUgdmFsdWUgYXMgc3BlY2lmaWVkIGJ5IGEgaG9zdCBsYW5ndWFnZSBhdHRyaWJ1dGUuXG4gICAgICAgIHJldHVybiBjdXJyZW50LmdldEF0dHJpYnV0ZShcInZhbHVlXCIpIHx8IFwiXCI7XG4gICAgICB9XG4gICAgICBpZiAoaGFzQW55Q29uY3JldGVSb2xlcyhjdXJyZW50LCBbXCJ0ZXh0Ym94XCJdKSkge1xuICAgICAgICBjb25zdWx0ZWROb2Rlcy5hZGQoY3VycmVudCk7XG4gICAgICAgIHJldHVybiBnZXRWYWx1ZU9mVGV4dGJveChjdXJyZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAyRjogaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2FjY25hbWUvI3N0ZXAyRlxuICAgIGlmIChhbGxvd3NOYW1lRnJvbUNvbnRlbnQoY3VycmVudCkgfHwgaXNFbGVtZW50KGN1cnJlbnQpICYmIGNvbnRleHQuaXNSZWZlcmVuY2VkIHx8IGlzTmF0aXZlSG9zdExhbmd1YWdlVGV4dEFsdGVybmF0aXZlRWxlbWVudChjdXJyZW50KSB8fCBpc0Rlc2NlbmRhbnRPZk5hdGl2ZUhvc3RMYW5ndWFnZVRleHRBbHRlcm5hdGl2ZUVsZW1lbnQoY3VycmVudCkpIHtcbiAgICAgIHZhciBhY2N1bXVsYXRlZFRleHQyRiA9IGNvbXB1dGVNaXNjVGV4dEFsdGVybmF0aXZlKGN1cnJlbnQsIHtcbiAgICAgICAgaXNFbWJlZGRlZEluTGFiZWw6IGNvbnRleHQuaXNFbWJlZGRlZEluTGFiZWwsXG4gICAgICAgIGlzUmVmZXJlbmNlZDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgaWYgKGFjY3VtdWxhdGVkVGV4dDJGICE9PSBcIlwiKSB7XG4gICAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChjdXJyZW50KTtcbiAgICAgICAgcmV0dXJuIGFjY3VtdWxhdGVkVGV4dDJGO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY3VycmVudC5ub2RlVHlwZSA9PT0gY3VycmVudC5URVhUX05PREUpIHtcbiAgICAgIGNvbnN1bHRlZE5vZGVzLmFkZChjdXJyZW50KTtcbiAgICAgIHJldHVybiBjdXJyZW50LnRleHRDb250ZW50IHx8IFwiXCI7XG4gICAgfVxuICAgIGlmIChjb250ZXh0LnJlY3Vyc2lvbikge1xuICAgICAgY29uc3VsdGVkTm9kZXMuYWRkKGN1cnJlbnQpO1xuICAgICAgcmV0dXJuIGNvbXB1dGVNaXNjVGV4dEFsdGVybmF0aXZlKGN1cnJlbnQsIHtcbiAgICAgICAgaXNFbWJlZGRlZEluTGFiZWw6IGNvbnRleHQuaXNFbWJlZGRlZEluTGFiZWwsXG4gICAgICAgIGlzUmVmZXJlbmNlZDogZmFsc2VcbiAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgdG9vbHRpcEF0dHJpYnV0ZVZhbHVlID0gY29tcHV0ZVRvb2x0aXBBdHRyaWJ1dGVWYWx1ZShjdXJyZW50KTtcbiAgICBpZiAodG9vbHRpcEF0dHJpYnV0ZVZhbHVlICE9PSBudWxsKSB7XG4gICAgICBjb25zdWx0ZWROb2Rlcy5hZGQoY3VycmVudCk7XG4gICAgICByZXR1cm4gdG9vbHRpcEF0dHJpYnV0ZVZhbHVlO1xuICAgIH1cblxuICAgIC8vIFRPRE8gc2hvdWxkIHRoaXMgYmUgcmVhY2hhYmxlP1xuICAgIGNvbnN1bHRlZE5vZGVzLmFkZChjdXJyZW50KTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICByZXR1cm4gYXNGbGF0U3RyaW5nKGNvbXB1dGVUZXh0QWx0ZXJuYXRpdmUocm9vdCwge1xuICAgIGlzRW1iZWRkZWRJbkxhYmVsOiBmYWxzZSxcbiAgICAvLyBieSBzcGVjIGNvbXB1dGVBY2Nlc3NpYmxlRGVzY3JpcHRpb24gc3RhcnRzIHdpdGggdGhlIHJlZmVyZW5jZWQgZWxlbWVudHMgYXMgcm9vdHNcbiAgICBpc1JlZmVyZW5jZWQ6IGNvbXB1dGUgPT09IFwiZGVzY3JpcHRpb25cIixcbiAgICByZWN1cnNpb246IGZhbHNlXG4gIH0pKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFjY2Vzc2libGUtbmFtZS1hbmQtZGVzY3JpcHRpb24ubWpzLm1hcCIsImltcG9ydCB7IGNvbXB1dGVUZXh0QWx0ZXJuYXRpdmUgfSBmcm9tIFwiLi9hY2Nlc3NpYmxlLW5hbWUtYW5kLWRlc2NyaXB0aW9uLm1qc1wiO1xuaW1wb3J0IHsgaGFzQW55Q29uY3JldGVSb2xlcyB9IGZyb20gXCIuL3V0aWwubWpzXCI7XG5cbi8qKlxuICogaHR0cHM6Ly93M2MuZ2l0aHViLmlvL2FyaWEvI25hbWVmcm9tcHJvaGliaXRlZFxuICovXG5mdW5jdGlvbiBwcm9oaWJpdHNOYW1pbmcobm9kZSkge1xuICByZXR1cm4gaGFzQW55Q29uY3JldGVSb2xlcyhub2RlLCBbXCJjYXB0aW9uXCIsIFwiY29kZVwiLCBcImRlbGV0aW9uXCIsIFwiZW1waGFzaXNcIiwgXCJnZW5lcmljXCIsIFwiaW5zZXJ0aW9uXCIsIFwibm9uZVwiLCBcInBhcmFncmFwaFwiLCBcInByZXNlbnRhdGlvblwiLCBcInN0cm9uZ1wiLCBcInN1YnNjcmlwdFwiLCBcInN1cGVyc2NyaXB0XCJdKTtcbn1cblxuLyoqXG4gKiBpbXBsZW1lbnRzIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9hY2NuYW1lLyNtYXBwaW5nX2FkZGl0aW9uYWxfbmRfbmFtZVxuICogQHBhcmFtIHJvb3RcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZUFjY2Vzc2libGVOYW1lKHJvb3QpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICBpZiAocHJvaGliaXRzTmFtaW5nKHJvb3QpKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbiAgcmV0dXJuIGNvbXB1dGVUZXh0QWx0ZXJuYXRpdmUocm9vdCwgb3B0aW9ucyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hY2Nlc3NpYmxlLW5hbWUubWpzLm1hcCIsImltcG9ydCB7IGNvbXB1dGVBY2Nlc3NpYmxlTmFtZSB9IGZyb20gJ2RvbS1hY2Nlc3NpYmlsaXR5LWFwaSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlRWxlbWVudEFjY2Vzc2libGVOYW1lKGVsOiBFbGVtZW50KTogc3RyaW5nIHwgbnVsbCB7XG4gIHRyeSB7XG4gICAgY29uc3QgbmFtZSA9IGNvbXB1dGVBY2Nlc3NpYmxlTmFtZShlbCk7XG4gICAgcmV0dXJuIG5hbWUgPyBuYW1lLnRyaW0oKSA6IG51bGw7XG4gIH0gY2F0Y2gge1xuICAgIC8vIEZhbGxiYWNrOiBhcmlhLWxhYmVsLCBhcmlhLWxhYmVsbGVkYnksIGFsdCwgcGxhY2Vob2xkZXIsIHRpdGxlXG4gICAgY29uc3QgYXJpYUxhYmVsID0gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgaWYgKGFyaWFMYWJlbCkgcmV0dXJuIGFyaWFMYWJlbC50cmltKCk7XG5cbiAgICBjb25zdCB0aXRsZSA9IGVsLmdldEF0dHJpYnV0ZSgndGl0bGUnKTtcbiAgICBpZiAodGl0bGUpIHJldHVybiB0aXRsZS50cmltKCk7XG5cbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IGVsLmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKTtcbiAgICBpZiAocGxhY2Vob2xkZXIpIHJldHVybiBwbGFjZWhvbGRlci50cmltKCk7XG5cbiAgICBjb25zdCBhbHQgPSBlbC5nZXRBdHRyaWJ1dGUoJ2FsdCcpO1xuICAgIGlmIChhbHQpIHJldHVybiBhbHQudHJpbSgpO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbEZyYW1lT2Zmc2V0KCk6IFtudW1iZXIsIG51bWJlcl0ge1xuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBbMCwgMF07XG5cbiAgdHJ5IHtcbiAgICBpZiAod2luZG93LnNlbGYgPT09IHdpbmRvdy50b3ApIHtcbiAgICAgIHJldHVybiBbMCwgMF07XG4gICAgfVxuXG4gICAgaWYgKHdpbmRvdy5mcmFtZUVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IHJlY3QgPSB3aW5kb3cuZnJhbWVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgcmV0dXJuIFtyZWN0LmxlZnQsIHJlY3QudG9wXTtcbiAgICB9XG4gIH0gY2F0Y2gge1xuICAgIC8vIENyb3NzLW9yaWdpbiBpZnJhbWUgZnJhbWVFbGVtZW50IGFjY2VzcyB3aWxsIHRocm93IFNlY3VyaXR5RXJyb3IuXG4gICAgLy8gVGhlIHNlcnZpY2Ugd29ya2VyIHdpbGwgY29tcG9zZSBjcm9zcy1vcmlnaW4gb2Zmc2V0cyB1c2luZyB3ZWJOYXZpZ2F0aW9uIGZyYW1lIGhpZXJhcmNoeS5cbiAgfVxuXG4gIHJldHVybiBbMCwgMF07XG59XG5cbi8qKlxuICogQ29tcG9zZSBuZXN0ZWQgZnJhbWUgb2Zmc2V0cyBieSBzdW1taW5nIHBhcmVudCBvZmZzZXRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcG9zZUZyYW1lT2Zmc2V0cyhcbiAgZnJhbWVJZDogc3RyaW5nLFxuICBmcmFtZXM6IHsgZnJhbWVfaWQ6IHN0cmluZzsgcGFyZW50X2ZyYW1lX2lkOiBzdHJpbmcgfCBudWxsOyBvZmZzZXQ6IFtudW1iZXIsIG51bWJlcl0gfVtdXG4pOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgbGV0IGN1cjogeyBmcmFtZV9pZDogc3RyaW5nOyBwYXJlbnRfZnJhbWVfaWQ6IHN0cmluZyB8IG51bGw7IG9mZnNldDogW251bWJlciwgbnVtYmVyXSB9IHwgdW5kZWZpbmVkID1cbiAgICBmcmFtZXMuZmluZCgoZikgPT4gZi5mcmFtZV9pZCA9PT0gZnJhbWVJZCk7XG5cbiAgbGV0IHRvdGFsWCA9IDA7XG4gIGxldCB0b3RhbFkgPSAwO1xuXG4gIGNvbnN0IHZpc2l0ZWQgPSBuZXcgU2V0PHN0cmluZz4oKTtcblxuICB3aGlsZSAoY3VyICYmICF2aXNpdGVkLmhhcyhjdXIuZnJhbWVfaWQpKSB7XG4gICAgdmlzaXRlZC5hZGQoY3VyLmZyYW1lX2lkKTtcbiAgICB0b3RhbFggKz0gY3VyLm9mZnNldFswXTtcbiAgICB0b3RhbFkgKz0gY3VyLm9mZnNldFsxXTtcblxuICAgIGlmICghY3VyLnBhcmVudF9mcmFtZV9pZCkgYnJlYWs7XG4gICAgY3VyID0gZnJhbWVzLmZpbmQoKGYpID0+IGYuZnJhbWVfaWQgPT09IGN1cj8ucGFyZW50X2ZyYW1lX2lkKTtcbiAgfVxuXG4gIHJldHVybiBbdG90YWxYLCB0b3RhbFldO1xufVxuIiwiY29uc3QgZG9tRWxlbWVudE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBXZWFrUmVmPEVsZW1lbnQ+PigpO1xuY29uc3QgcmVnaW9uVG9Eb21NYXAgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXG5leHBvcnQgY29uc3QgZWxlbWVudFJlZ2lzdHJ5ID0ge1xuICByZWdpc3Rlcihkb21JZDogc3RyaW5nLCBlbDogRWxlbWVudCk6IHZvaWQge1xuICAgIGRvbUVsZW1lbnRNYXAuc2V0KGRvbUlkLCBuZXcgV2Vha1JlZihlbCkpO1xuICB9LFxuXG4gIGdldChkb21JZDogc3RyaW5nKTogRWxlbWVudCB8IG51bGwge1xuICAgIGNvbnN0IHJlZiA9IGRvbUVsZW1lbnRNYXAuZ2V0KGRvbUlkKTtcbiAgICBpZiAoIXJlZikgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgZWwgPSByZWYuZGVyZWYoKTtcbiAgICBpZiAoIWVsIHx8ICFlbC5pc0Nvbm5lY3RlZCkge1xuICAgICAgZG9tRWxlbWVudE1hcC5kZWxldGUoZG9tSWQpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBlbDtcbiAgfSxcblxuICBzZXRSZWdpb25NYXBwaW5nKG1hcHBpbmc6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IFtyZWdpb25JZCwgZG9tSWRdIG9mIE9iamVjdC5lbnRyaWVzKG1hcHBpbmcpKSB7XG4gICAgICByZWdpb25Ub0RvbU1hcC5zZXQocmVnaW9uSWQsIGRvbUlkKTtcbiAgICB9XG4gIH0sXG5cbiAgZ2V0QnlSZWdpb25JZChyZWdpb25JZDogc3RyaW5nKTogRWxlbWVudCB8IG51bGwge1xuICAgIGNvbnN0IGRvbUlkID0gcmVnaW9uVG9Eb21NYXAuZ2V0KHJlZ2lvbklkKTtcbiAgICBpZiAoIWRvbUlkKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gdGhpcy5nZXQoZG9tSWQpO1xuICB9LFxuXG4gIGNsZWFyKCk6IHZvaWQge1xuICAgIGRvbUVsZW1lbnRNYXAuY2xlYXIoKTtcbiAgICByZWdpb25Ub0RvbU1hcC5jbGVhcigpO1xuICB9LFxufTtcbiIsIi8qKlxuICogQ29tcHV0ZSBTSEEtMjU2IGhleCBkaWdlc3QgdXNpbmcgV2ViIENyeXB0byBBUEkuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaGEyNTZIZXgoaW5wdXQ6IHN0cmluZyB8IFVpbnQ4QXJyYXkpOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBkYXRhID0gdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyA/IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShpbnB1dCkgOiBpbnB1dDtcbiAgY29uc3QgaGFzaEJ1ZmZlciA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KCdTSEEtMjU2JywgZGF0YSBhcyBhbnkpO1xuICBjb25zdCBoYXNoQXJyYXkgPSBBcnJheS5mcm9tKG5ldyBVaW50OEFycmF5KGhhc2hCdWZmZXIpKTtcbiAgcmV0dXJuIGhhc2hBcnJheS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJycpO1xufVxuXG4vKipcbiAqIERldGVybWluaXN0aWNhbGx5IHNlcmlhbGl6ZSBhIEphdmFTY3JpcHQgdmFsdWUgdG8gSlNPTiAoc29ydGVkIGtleXMpXG4gKiBmb3IgcmVsaWFibGUgY3J5cHRvZ3JhcGhpYyBoYXNoaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2Fub25pY2FsSnNvbihvYmo6IGFueSk6IHN0cmluZyB7XG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgcmV0dXJuICdbJyArIG9iai5tYXAoY2Fub25pY2FsSnNvbikuam9pbignLCcpICsgJ10nO1xuICB9XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopLnNvcnQoKTtcbiAgY29uc3QgcGFpcnMgPSBrZXlzLm1hcCgoa2V5KSA9PiB7XG4gICAgY29uc3QgdmFsID0gb2JqW2tleV07XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGtleSkgKyAnOicgKyBjYW5vbmljYWxKc29uKHZhbCk7XG4gIH0pO1xuICByZXR1cm4gJ3snICsgcGFpcnMuam9pbignLCcpICsgJ30nO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBCQm94LCBEb21FbGVtZW50SW5mbywgRnJhbWVJbmZvIH0gZnJvbSAnQGNvbnRyYWN0cy9pbmRleC5qcyc7XG5pbXBvcnQgeyByb3VuZEJCb3hUb1N0ZXAgfSBmcm9tICdAY29udHJhY3RzL2dlb21ldHJ5LmpzJztcbmltcG9ydCB7IGNhbm9uaWNhbEpzb24sIHNoYTI1NkhleCB9IGZyb20gJy4uLy4uL3NlY3VyaXR5L3NoYTI1Ni5qcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmluZ2VycHJpbnRPcHRpb25zIHtcbiAgbW9kZT86ICdzdHJpY3QnIHwgJ3RhcmdldC1zY29wZWQnO1xuICB0YXJnZXRCQm94PzogQkJveDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbXB1dGVQYWdlU3RhdGVIYXNoKFxuICBvcmlnaW46IHN0cmluZyxcbiAgcGF0aDogc3RyaW5nLFxuICBmcmFtZXM6IEZyYW1lSW5mb1tdLFxuICBlbGVtZW50czogRG9tRWxlbWVudEluZm9bXSxcbiAgc2Nyb2xsWSA9IDAsXG4gIG9wdGlvbnM6IEZpbmdlcnByaW50T3B0aW9ucyA9IHt9XG4pOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBzY3JvbGxCdWNrZXQgPSBNYXRoLmZsb29yKHNjcm9sbFkgLyA2NCk7XG4gIGNvbnN0IGRpYWxvZ09wZW4gPSBlbGVtZW50cy5zb21lKChlbCkgPT4gZWwudGFnID09PSAnZGlhbG9nJyAmJiBlbC52aXNpYmxlKTtcblxuICBsZXQgaW50ZXJhY3RpdmVFbGVtZW50cyA9IGVsZW1lbnRzLmZpbHRlcigoZWwpID0+IGVsLnZpc2libGUgJiYgZWwuaW50ZXJhY3RhYmxlKTtcblxuICBpZiAob3B0aW9ucy5tb2RlID09PSAndGFyZ2V0LXNjb3BlZCcgJiYgb3B0aW9ucy50YXJnZXRCQm94KSB7XG4gICAgY29uc3QgW3R4LCB0eSwgdHcsIHRoXSA9IG9wdGlvbnMudGFyZ2V0QkJveDtcbiAgICAvLyBLZWVwIGVsZW1lbnRzIGluIHByb3hpbWl0eSAod2l0aGluIDE1MHB4KVxuICAgIGludGVyYWN0aXZlRWxlbWVudHMgPSBpbnRlcmFjdGl2ZUVsZW1lbnRzLmZpbHRlcigoZWwpID0+IHtcbiAgICAgIGNvbnN0IFtleCwgZXldID0gZWwuYmJveDtcbiAgICAgIHJldHVybiBNYXRoLmFicyhleCAtIHR4KSA8IHR3ICsgMTUwICYmIE1hdGguYWJzKGV5IC0gdHkpIDwgdGggKyAxNTA7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBpbnRlcmFjdGl2ZVN1bW1hcnkgPSBpbnRlcmFjdGl2ZUVsZW1lbnRzLm1hcCgoZWwpID0+ICh7XG4gICAgdGFnOiBlbC50YWcsXG4gICAgcm9sZTogZWwucm9sZSxcbiAgICBuYW1lOiBlbC5uYW1lLFxuICAgIGJib3g6IHJvdW5kQkJveFRvU3RlcChlbC5iYm94LCA0KSxcbiAgICBkaXNhYmxlZDogZWwuYXJpYS5kaXNhYmxlZCxcbiAgICBjaGVja2VkOiBlbC5hcmlhLmNoZWNrZWQsXG4gIH0pKTtcblxuICBjb25zdCBwYXlsb2FkID0ge1xuICAgIG9yaWdpbixcbiAgICBwYXRoLFxuICAgIGZyYW1lczogZnJhbWVzLm1hcCgoZikgPT4gKHsgaWQ6IGYuZnJhbWVfaWQsIG9yaWdpbjogZi5vcmlnaW4gfSkpLFxuICAgIGRpYWxvZ09wZW4sXG4gICAgc2Nyb2xsQnVja2V0LFxuICAgIGludGVyYWN0aXZlOiBpbnRlcmFjdGl2ZVN1bW1hcnksXG4gIH07XG5cbiAgY29uc3QgcmF3SnNvbiA9IGNhbm9uaWNhbEpzb24ocGF5bG9hZCk7XG4gIGNvbnN0IGZ1bGxIYXNoID0gYXdhaXQgc2hhMjU2SGV4KHJhd0pzb24pO1xuICByZXR1cm4gZnVsbEhhc2guc2xpY2UoMCwgMTYpO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBEb21FbGVtZW50SW5mbywgRG9tU25hcHNob3QsIEZyYW1lSW5mbyB9IGZyb20gJ0Bjb250cmFjdHMvaW5kZXguanMnO1xuaW1wb3J0IHsgaXNFbGVtZW50T2NjbHVkZWQsIGlzRWxlbWVudFZpc2libGUgfSBmcm9tICcuL3Zpc2liaWxpdHkuanMnO1xuaW1wb3J0IHsgZGV0ZWN0UmVuZGVyaW5nS2luZCB9IGZyb20gJy4vcmVuZGVyaW5nLWtpbmQuanMnO1xuaW1wb3J0IHsgY29tcHV0ZUFyaWFSb2xlLCBleHRyYWN0QXJpYVN0YXRlcyB9IGZyb20gJy4uL2FjY2Vzc2liaWxpdHkvcm9sZS5qcyc7XG5pbXBvcnQgeyBjb21wdXRlRWxlbWVudEFjY2Vzc2libGVOYW1lIH0gZnJvbSAnLi4vYWNjZXNzaWJpbGl0eS9uYW1lLmpzJztcbmltcG9ydCB7IGdldExvY2FsRnJhbWVPZmZzZXQgfSBmcm9tICcuLi8uLi9jb250ZW50L2ZyYW1lLW9mZnNldHMuanMnO1xuaW1wb3J0IHsgZWxlbWVudFJlZ2lzdHJ5IH0gZnJvbSAnLi4vLi4vY29udGVudC9yZWdpc3RyeS5qcyc7XG5pbXBvcnQgeyBjb21wdXRlUGFnZVN0YXRlSGFzaCB9IGZyb20gJy4uLy4uL2Jyb3dzZXIvc3RhdGUvZmluZ2VycHJpbnQuanMnO1xuXG5jb25zdCBDQU5ESURBVEVfU0VMRUNUT1IgPSBbXG4gICdhW2hyZWZdJyxcbiAgJ2J1dHRvbicsXG4gICdpbnB1dCcsXG4gICdzZWxlY3QnLFxuICAndGV4dGFyZWEnLFxuICAnZGV0YWlscycsXG4gICdzdW1tYXJ5JyxcbiAgJ2RpYWxvZycsXG4gICdbcm9sZV0nLFxuICAnW3RhYmluZGV4XScsXG4gICdbY29udGVudGVkaXRhYmxlXScsXG4gICdsYWJlbCcsXG4gICdoMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBwLCBibG9ja3F1b3RlLCB0aCwgdGQsIGxpLCBkdCwgZGQsIGZpZ2NhcHRpb24nLFxuICAnY2FudmFzJyxcbiAgJ3N2ZycsXG4gICdpbWcnLFxuICAndmlkZW8nLFxuICAnaWZyYW1lJyxcbiAgJ1tjbGFzcyo9XCJhdmF0YXJcIl0nLFxuICAnW2NsYXNzKj1cInByb2ZpbGVcIl0nLFxuICAnW2NsYXNzKj1cInVzZXJcIl0nLFxuICAnW2NsYXNzKj1cInBob3RvXCJdJyxcbiAgJ1tjbGFzcyo9XCJ0aHVtYlwiXSdcbl0uam9pbignLCcpO1xuXG5pbnRlcmZhY2UgQ2FjaGVkU2VtYW50aWNJbmZvIHtcbiAgdGFnOiBzdHJpbmc7XG4gIHJvbGU6IHN0cmluZyB8IG51bGw7XG4gIG5hbWU6IHN0cmluZyB8IG51bGw7XG4gIGFyaWE6IGFueTtcbiAgcmVuZGVyaW5nOiBhbnk7XG4gIGhhc19iZ19pbWFnZTogYm9vbGVhbjtcbiAgaGFuZGxlcnNfaGludDogYm9vbGVhbjtcbiAgaW5wdXRJbmZvOiBhbnk7XG4gIGV4dHJhY3RlZFRleHQ6IHN0cmluZztcbiAgY2xhc3Nlczogc3RyaW5nW107XG4gIHBpaU1hdGNoZXM6IHsgbm9kZUluZGV4OiBudW1iZXIsIHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcsIHR5cGU6IHN0cmluZyB9W107XG4gIGF0dHJpYnV0ZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG59XG5cbmludGVyZmFjZSBDYWNoZWRFbGVtZW50IHtcbiAgaXNNZWFuaW5nZnVsOiBib29sZWFuO1xuICBkb21JZD86IHN0cmluZztcbiAgc3RhdGljSW5mbz86IENhY2hlZFNlbWFudGljSW5mbztcbn1cblxuY29uc3QgZWxlbWVudENhY2hlID0gbmV3IFdlYWtNYXA8RWxlbWVudCwgQ2FjaGVkRWxlbWVudD4oKTtcbmxldCBuZXh0SWQgPSAxO1xubGV0IG5leHRQaWlJZCA9IDE7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXJrRGlydHkoZWw6IEVsZW1lbnQgfCBudWxsKSB7XG4gIGlmICghZWwpIHJldHVybjtcbiAgZWxlbWVudENhY2hlLmRlbGV0ZShlbCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleHRyYWN0RG9tU25hcHNob3QoXG4gIGZyYW1lSWQgPSAnbWFpbicsXG4gIHBhcmVudEZyYW1lSWQ6IHN0cmluZyB8IG51bGwgPSBudWxsXG4pOiBQcm9taXNlPERvbVNuYXBzaG90PiB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNuYXBzaG90X2lkOiBgc25hcF8ke0RhdGUubm93KCl9YCxcbiAgICAgIHVybF9vcmlnaW46ICdodHRwOi8vbG9jYWxob3N0OjUxNzMnLFxuICAgICAgdXJsX3BhdGg6ICcvJyxcbiAgICAgIGZyYW1lczogW1xuICAgICAgICB7XG4gICAgICAgICAgZnJhbWVfaWQ6IGZyYW1lSWQsXG4gICAgICAgICAgcGFyZW50X2ZyYW1lX2lkOiBwYXJlbnRGcmFtZUlkLFxuICAgICAgICAgIG9yaWdpbjogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE3MycsXG4gICAgICAgICAgcGF0aDogJy8nLFxuICAgICAgICAgIG9mZnNldDogWzAsIDBdLFxuICAgICAgICAgIGFjY2Vzc2libGU6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgZWxlbWVudHM6IFtdLFxuICAgICAgdmlld3BvcnQ6IHsgdzogMTI4MCwgaDogODAwIH0sXG4gICAgICBkcHI6IDEsXG4gICAgICBzY3JvbGw6IHsgeDogMCwgeTogMCB9LFxuICAgICAgcGFnZV9zdGF0ZV9oYXNoOiAnMDAwMDAwMDAwMDAwMDAwMCcsXG4gICAgICB0czogRGF0ZS5ub3coKSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgdXJsT3JpZ2luID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcbiAgY29uc3QgdXJsUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTsgLy8gU3RyaXBwZWQgb2YgcXVlcnkgYW5kIGhhc2hcbiAgY29uc3QgZnJhbWVPZmZzZXQgPSBnZXRMb2NhbEZyYW1lT2Zmc2V0KCk7XG5cbiAgY29uc3Qgdmlld3BvcnQgPSB7XG4gICAgdzogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Py5jbGllbnRXaWR0aCB8fCB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICBoOiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ/LmNsaWVudEhlaWdodCB8fCB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gIH07XG5cbiAgY29uc3QgZnJhbWVzOiBGcmFtZUluZm9bXSA9IFtcbiAgICB7XG4gICAgICBmcmFtZV9pZDogZnJhbWVJZCxcbiAgICAgIHBhcmVudF9mcmFtZV9pZDogcGFyZW50RnJhbWVJZCxcbiAgICAgIG9yaWdpbjogdXJsT3JpZ2luLFxuICAgICAgcGF0aDogdXJsUGF0aCxcbiAgICAgIG9mZnNldDogZnJhbWVPZmZzZXQsXG4gICAgICBhY2Nlc3NpYmxlOiB0cnVlLFxuICAgIH0sXG4gIF07XG5cbiAgY29uc3QgcmF3RWxlbWVudHMgPSBuZXcgU2V0PEVsZW1lbnQ+KCk7XG5cbiAgLy8gUmVjdXJzaXZlIGNvbGxlY3Rpb24gb2YgYWxsIG5vZGVzIGluY2x1ZGluZyB0aG9zZSBpbiBzaGFkb3cgcm9vdHNcbiAgZnVuY3Rpb24gY29sbGVjdE5vZGVzKHJvb3Q6IERvY3VtZW50IHwgRG9jdW1lbnRGcmFnbWVudCB8IEVsZW1lbnQpIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IHJvb3QucXVlcnlTZWxlY3RvckFsbCgnKicpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGVsID0gY2hpbGRyZW5baV07XG4gICAgICBpZiAoIWVsKSBjb250aW51ZTtcblxuICAgICAgLy8gQ2hlY2sgZm9yIHNoYWRvdyByb290XG4gICAgICBsZXQgc1Jvb3Q6IFNoYWRvd1Jvb3QgfCBudWxsID0gZWwuc2hhZG93Um9vdCB8fCBudWxsO1xuICAgICAgaWYgKCFzUm9vdCAmJiB0eXBlb2YgY2hyb21lICE9PSAndW5kZWZpbmVkJyAmJiAoY2hyb21lIGFzIGFueSkuZG9tPy5vcGVuT3JDbG9zZWRTaGFkb3dSb290KSB7XG4gICAgICAgICB0cnkgeyBzUm9vdCA9IChjaHJvbWUgYXMgYW55KS5kb20ub3Blbk9yQ2xvc2VkU2hhZG93Um9vdChlbCk7IH0gY2F0Y2gge31cbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKHNSb290KSB7XG4gICAgICAgIGNvbGxlY3ROb2RlcyhzUm9vdCk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGFscmVhZHkgYWRkZWQsIHNraXBcbiAgICAgIGlmIChyYXdFbGVtZW50cy5oYXMoZWwpKSBjb250aW51ZTtcblxuICAgICAgbGV0IGNhY2hlZCA9IGVsZW1lbnRDYWNoZS5nZXQoZWwpO1xuICAgICAgaWYgKGNhY2hlZCkge1xuICAgICAgICBpZiAoY2FjaGVkLmlzTWVhbmluZ2Z1bCkgcmF3RWxlbWVudHMuYWRkKGVsKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBpc01lYW5pbmdmdWwgPSBmYWxzZTtcbiAgICAgIFxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGVsLm1hdGNoZXMgJiYgZWwubWF0Y2hlcyhDQU5ESURBVEVfU0VMRUNUT1IpKSB7XG4gICAgICAgICAgaXNNZWFuaW5nZnVsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIElnbm9yZWRcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc01lYW5pbmdmdWwpIHtcbiAgICAgICAgY29uc3QgaHRtbEVsID0gZWwgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGlmICgoZWwgYXMgYW55KS5vbmNsaWNrIHx8IGh0bWxFbC5zdHlsZT8uY3Vyc29yID09PSAncG9pbnRlcicgfHwgZWwuaGFzQXR0cmlidXRlKCdvbmNsaWNrJykpIHtcbiAgICAgICAgICBpc01lYW5pbmdmdWwgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENhdGNoIHBsYWluIGRpdnMvc3BhbnMgdGhhdCBjb250YWluIGRpcmVjdCB0ZXh0XG4gICAgICAgICAgaWYgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgY2hpbGROb2RlcyA9IGVsLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNoaWxkTm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZE5vZGVzW2pdO1xuICAgICAgICAgICAgICBpZiAoY2hpbGQgJiYgY2hpbGQubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGNoaWxkLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGV4dCAmJiB0ZXh0LnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICBpc01lYW5pbmdmdWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFpc01lYW5pbmdmdWwgJiYgZWwuY2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgICAgICAgIGlmIChjb21wdXRlZC5iYWNrZ3JvdW5kSW1hZ2UgJiYgY29tcHV0ZWQuYmFja2dyb3VuZEltYWdlICE9PSAnbm9uZScgJiYgY29tcHV0ZWQuYmFja2dyb3VuZEltYWdlLmluY2x1ZGVzKCd1cmwoJykpIHtcbiAgICAgICAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICBpZiAocmVjdC53aWR0aCA+IDEwICYmIHJlY3QuaGVpZ2h0ID4gMTApIHtcbiAgICAgICAgICAgICAgICBpc01lYW5pbmdmdWwgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChpc01lYW5pbmdmdWwpIHtcbiAgICAgICAgcmF3RWxlbWVudHMuYWRkKGVsKTtcbiAgICAgICAgZWxlbWVudENhY2hlLnNldChlbCwgeyBpc01lYW5pbmdmdWw6IHRydWUgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50Q2FjaGUuc2V0KGVsLCB7IGlzTWVhbmluZ2Z1bDogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29sbGVjdE5vZGVzKGRvY3VtZW50KTtcblxuICAvLyBGaWx0ZXIgb3V0IGFueSBhZ2VudCBVSSBob3N0XG4gIGNvbnN0IGZpbHRlcmVkID0gQXJyYXkuZnJvbShyYXdFbGVtZW50cykuZmlsdGVyKFxuICAgIChlbCkgPT4gIWVsLmNsb3Nlc3QoJ1tkYXRhLWFnZW50LXVpXScpICYmIGVsLmlkICE9PSAnX19zaWhfYWdlbnRfdWlfaG9zdF9fJ1xuICApO1xuXG4gIGNvbnN0IGVsZW1lbnRzOiBEb21FbGVtZW50SW5mb1tdID0gW107XG5cbiAgZm9yIChjb25zdCBlbCBvZiBmaWx0ZXJlZCkge1xuICAgIGxldCBjYWNoZWQgPSBlbGVtZW50Q2FjaGUuZ2V0KGVsKTtcbiAgICBpZiAoIWNhY2hlZCkgY29udGludWU7XG4gICAgXG4gICAgaWYgKCFjYWNoZWQuZG9tSWQpIHtcbiAgICAgIGNhY2hlZC5kb21JZCA9IGBkJHtuZXh0SWQrK31gO1xuICAgIH1cbiAgICBjb25zdCBkb21JZCA9IGNhY2hlZC5kb21JZDtcbiAgICBlbGVtZW50UmVnaXN0cnkucmVnaXN0ZXIoZG9tSWQsIGVsKTtcblxuICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBiYm94OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFtcbiAgICAgIE1hdGgucm91bmQocmVjdC5sZWZ0ICsgZnJhbWVPZmZzZXRbMF0pLFxuICAgICAgTWF0aC5yb3VuZChyZWN0LnRvcCArIGZyYW1lT2Zmc2V0WzFdKSxcbiAgICAgIE1hdGgucm91bmQocmVjdC53aWR0aCksXG4gICAgICBNYXRoLnJvdW5kKHJlY3QuaGVpZ2h0KSxcbiAgICBdO1xuXG4gICAgY29uc3QgdmlzaWJsZSA9IGlzRWxlbWVudFZpc2libGUoZWwpO1xuICAgIGNvbnN0IGluVmlld3BvcnQgPVxuICAgICAgcmVjdC5ib3R0b20gPj0gMCAmJlxuICAgICAgcmVjdC5yaWdodCA+PSAwICYmXG4gICAgICByZWN0LnRvcCA8PSB2aWV3cG9ydC5oICYmXG4gICAgICByZWN0LmxlZnQgPD0gdmlld3BvcnQudztcblxuICAgIGNvbnN0IGN4ID0gcmVjdC5sZWZ0ICsgcmVjdC53aWR0aCAvIDI7XG4gICAgY29uc3QgY3kgPSByZWN0LnRvcCArIHJlY3QuaGVpZ2h0IC8gMjtcbiAgICBjb25zdCBvY2NsdWRlZCA9IGlzRWxlbWVudE9jY2x1ZGVkKGVsLCBjeCwgY3kpO1xuICAgIFxuXG4gICAgaWYgKCFjYWNoZWQuc3RhdGljSW5mbykge1xuICAgICAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgY29uc3Qgcm9sZSA9IGNvbXB1dGVBcmlhUm9sZShlbCk7XG4gICAgICBjb25zdCBuYW1lID0gY29tcHV0ZUVsZW1lbnRBY2Nlc3NpYmxlTmFtZShlbCk7XG4gICAgICBjb25zdCBhcmlhID0gZXh0cmFjdEFyaWFTdGF0ZXMoZWwpO1xuICAgICAgY29uc3QgeyByZW5kZXJpbmcsIGhhc19iZ19pbWFnZSwgaGFuZGxlcnNfaGludCB9ID0gZGV0ZWN0UmVuZGVyaW5nS2luZChlbCk7XG5cbiAgICAgIGxldCBpbnB1dEluZm86IGFueSA9IHVuZGVmaW5lZDtcbiAgICAgIGlmICh0YWcgPT09ICdpbnB1dCcgfHwgdGFnID09PSAndGV4dGFyZWEnIHx8IHRhZyA9PT0gJ3NlbGVjdCcpIHtcbiAgICAgICAgY29uc3QgaW5wdXRFbCA9IGVsIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHR5cGUgPSAoaW5wdXRFbC50eXBlIHx8ICd0ZXh0JykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgaXNQYXNzd29yZCA9IHR5cGUgPT09ICdwYXNzd29yZCc7XG4gICAgICAgIGNvbnN0IGhhc1ZhbHVlID0gQm9vbGVhbihpbnB1dEVsLnZhbHVlICYmIGlucHV0RWwudmFsdWUubGVuZ3RoID4gMCk7XG5cbiAgICAgICAgaW5wdXRJbmZvID0ge1xuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgYXV0b2NvbXBsZXRlOiBpbnB1dEVsLmF1dG9jb21wbGV0ZSB8fCBudWxsLFxuICAgICAgICAgIG5hbWU6IGlucHV0RWwubmFtZSB8fCBudWxsLFxuICAgICAgICAgIHBsYWNlaG9sZGVyOiBpbnB1dEVsLnBsYWNlaG9sZGVyIHx8IG51bGwsXG4gICAgICAgICAgaXNfcGFzc3dvcmQ6IGlzUGFzc3dvcmQsXG4gICAgICAgICAgaGFzX3ZhbHVlOiBoYXNWYWx1ZSxcbiAgICAgICAgICB2YWx1ZTogaXNQYXNzd29yZCA/IG51bGwgOiBpbnB1dEVsLnZhbHVlIHx8IG51bGwsIFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgXG4gICAgICBjb25zdCBhdHRyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgICAgY29uc3QgYWRkQXR0ciA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgdmFsID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgICAgICBpZiAodmFsKSBhdHRyc1tuYW1lXSA9IHZhbDtcbiAgICAgIH07XG4gICAgICBhZGRBdHRyKCdhbHQnKTtcbiAgICAgIGFkZEF0dHIoJ3RpdGxlJyk7XG4gICAgICBhZGRBdHRyKCdhcmlhLWRlc2NyaXB0aW9uJyk7XG4gICAgICBhZGRBdHRyKCdsYWJlbCcpO1xuICAgICAgYWRkQXR0cignYXV0b2NvbXBsZXRlJyk7XG5cbiAgICAgIGxldCBleHRyYWN0ZWRUZXh0ID0gJyc7XG4gICAgICBjb25zdCBwaWlNYXRjaGVzOiB7IG5vZGVJbmRleDogbnVtYmVyLCBzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgdGV4dDogc3RyaW5nLCB0eXBlOiBzdHJpbmcgfVtdID0gW107XG4gICAgICBcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZWwuY2hpbGROb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCBjaGlsZCA9IGVsLmNoaWxkTm9kZXNbal07XG4gICAgICAgIGlmIChjaGlsZCAmJiBjaGlsZC5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgICBjb25zdCByYXdUZXh0ID0gY2hpbGQubm9kZVZhbHVlIHx8ICcnO1xuICAgICAgICAgIGlmICghcmF3VGV4dC50cmltKCkpIHtcbiAgICAgICAgICAgIGV4dHJhY3RlZFRleHQgKz0gcmF3VGV4dDtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBtb2RpZmllZFRleHQgPSByYXdUZXh0O1xuICAgICAgICAgIGNvbnN0IG1hdGNoZXM6IHsgc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIHRleHQ6IHN0cmluZywgdHlwZTogc3RyaW5nIH1bXSA9IFtdO1xuXG4gICAgICAgICAgLy8gRW1haWxcbiAgICAgICAgICBmb3IgKGNvbnN0IG0gb2YgcmF3VGV4dC5tYXRjaEFsbCgvXFxiW0EtWmEtejAtOS5fJSstXStAW0EtWmEtejAtOS4tXStcXC5bQS1aYS16XXsyLH1cXGIvZykpIHtcbiAgICAgICAgICAgIG1hdGNoZXMucHVzaCh7IHN0YXJ0OiBtLmluZGV4ISwgZW5kOiBtLmluZGV4ISArIG1bMF0ubGVuZ3RoLCB0ZXh0OiBtWzBdLCB0eXBlOiAnRU1BSUwnIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBBYWRoYWFyXG4gICAgICAgICAgZm9yIChjb25zdCBtIG9mIHJhd1RleHQubWF0Y2hBbGwoL1xcYlsyLTldXFxkezN9W1xccy1dP1xcZHs0fVtcXHMtXT9cXGR7NH1cXGIvZykpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsZWFuID0gbVswXS5yZXBsYWNlKC9bXFxzLV0vZywgJycpO1xuICAgICAgICAgICAgaWYgKC9eWzItOV1cXGR7MTF9JC8udGVzdChjbGVhbikpIHtcbiAgICAgICAgICAgICAgbGV0IGMgPSAwO1xuICAgICAgICAgICAgICBjb25zdCBWRVJIT0VGRl9EPVtbMCwxLDIsMyw0LDUsNiw3LDgsOV0sWzEsMiwzLDQsMCw2LDcsOCw5LDVdLFsyLDMsNCwwLDEsNyw4LDksNSw2XSxbMyw0LDAsMSwyLDgsOSw1LDYsN10sWzQsMCwxLDIsMyw5LDUsNiw3LDhdLFs1LDksOCw3LDYsMCw0LDMsMiwxXSxbNiw1LDksOCw3LDEsMCw0LDMsMl0sWzcsNiw1LDksOCwyLDEsMCw0LDNdLFs4LDcsNiw1LDksMywyLDEsMCw0XSxbOSw4LDcsNiw1LDQsMywyLDEsMF1dO1xuICAgICAgICAgICAgICBjb25zdCBWRVJIT0VGRl9QPVtbMCwxLDIsMyw0LDUsNiw3LDgsOV0sWzEsNSw3LDYsMiw4LDMsMCw5LDRdLFs1LDgsMCwzLDcsOSw2LDEsNCwyXSxbOCw5LDEsNiwwLDQsMyw1LDIsN10sWzksNCw1LDMsMSwyLDYsOCw3LDBdLFs0LDIsOCw2LDUsNywzLDksMCwxXSxbMiw3LDksMyw4LDAsNiw0LDEsNV0sWzcsMCw0LDYsOSwxLDMsMiw1LDhdXTtcbiAgICAgICAgICAgICAgY29uc3QgZGlnaXRzID0gY2xlYW4uc3BsaXQoJycpLm1hcChOdW1iZXIpLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgbGV0IHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWdpdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZGlnaXRzW2ldID09PSB1bmRlZmluZWQpIHsgdmFsaWQgPSBmYWxzZTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICBjID0gVkVSSE9FRkZfRFtjXSFbVkVSSE9FRkZfUFtpICUgOF0hW2RpZ2l0c1tpXSFdIV0hO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh2YWxpZCAmJiBjID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKHsgc3RhcnQ6IG0uaW5kZXghLCBlbmQ6IG0uaW5kZXghICsgbVswXS5sZW5ndGgsIHRleHQ6IG1bMF0sIHR5cGU6ICdBQURIQUFSJyB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBQQU5cbiAgICAgICAgICBmb3IgKGNvbnN0IG0gb2YgcmF3VGV4dC5tYXRjaEFsbCgvXFxiW0EtWmEtel17NX1cXGR7NH1bQS1aYS16XVxcYi9nKSkge1xuICAgICAgICAgICAgaWYgKC9eW0EtWl17M31bUENIRkFUQkxKR11bQS1aXVxcZHs0fVtBLVpdJC8udGVzdChtWzBdLnRyaW0oKS50b1VwcGVyQ2FzZSgpKSkge1xuICAgICAgICAgICAgICBtYXRjaGVzLnB1c2goeyBzdGFydDogbS5pbmRleCEsIGVuZDogbS5pbmRleCEgKyBtWzBdLmxlbmd0aCwgdGV4dDogbVswXSwgdHlwZTogJ1BBTicgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFBob25lICgxMCBkaWdpdHMpXG4gICAgICAgICAgZm9yIChjb25zdCBtIG9mIHJhd1RleHQubWF0Y2hBbGwoLyg/PCFcXGQpKD86KD86XFwrOTF8MClbXFxzLV0/KT9bNi05XSg/OltcXHMtXT9cXGQpezl9KD8hXFxkKS9nKSkge1xuICAgICAgICAgICAgbWF0Y2hlcy5wdXNoKHsgc3RhcnQ6IG0uaW5kZXghLCBlbmQ6IG0uaW5kZXghICsgbVswXS5sZW5ndGgsIHRleHQ6IG1bMF0sIHR5cGU6ICdQSE9ORScgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWF0Y2hlcy5zb3J0KChhLCBiKSA9PiBiLnN0YXJ0IC0gYS5zdGFydCk7XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IG0gb2YgbWF0Y2hlcykge1xuICAgICAgICAgICAgcGlpTWF0Y2hlcy5wdXNoKHsgbm9kZUluZGV4OiBqLCBzdGFydDogbS5zdGFydCwgZW5kOiBtLmVuZCwgdGV4dDogbS50ZXh0LCB0eXBlOiBtLnR5cGUgfSk7XG4gICAgICAgICAgICBtb2RpZmllZFRleHQgPSBtb2RpZmllZFRleHQuc3Vic3RyaW5nKDAsIG0uc3RhcnQpICsgYDwke20udHlwZX0+YCArIG1vZGlmaWVkVGV4dC5zdWJzdHJpbmcobS5lbmQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBleHRyYWN0ZWRUZXh0ICs9IG1vZGlmaWVkVGV4dCArICcgJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCB0ZXh0ID0gZXh0cmFjdGVkVGV4dC50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpLnNsaWNlKDAsIDMwMCk7XG4gICAgICBjb25zdCBjbGFzc2VzID0gQXJyYXkuZnJvbShlbC5jbGFzc0xpc3QpO1xuXG4gICAgICBjYWNoZWQuc3RhdGljSW5mbyA9IHtcbiAgICAgICAgdGFnLFxuICAgICAgICByb2xlLFxuICAgICAgICBuYW1lLFxuICAgICAgICBhcmlhLFxuICAgICAgICByZW5kZXJpbmcsXG4gICAgICAgIGhhc19iZ19pbWFnZSxcbiAgICAgICAgaGFuZGxlcnNfaGludCxcbiAgICAgICAgaW5wdXRJbmZvLFxuICAgICAgICBleHRyYWN0ZWRUZXh0OiB0ZXh0LFxuICAgICAgICBjbGFzc2VzLFxuICAgICAgICBwaWlNYXRjaGVzLFxuICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyc1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBzID0gY2FjaGVkLnN0YXRpY0luZm8hO1xuICAgIGNvbnN0IGludGVyYWN0YWJsZSA9IHZpc2libGUgJiYgIXMuYXJpYS5kaXNhYmxlZCAmJiAhb2NjbHVkZWQ7XG5cbiAgICAvLyBFdmFsdWF0ZSBQSUkgYm91bmRzIGR5bmFtaWNhbGx5IGJhc2VkIG9uIGN1cnJlbnQgdmlld3BvcnRcbiAgICBmb3IgKGNvbnN0IG0gb2Ygcy5waWlNYXRjaGVzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBjaGlsZCA9IGVsLmNoaWxkTm9kZXNbbS5ub2RlSW5kZXhdO1xuICAgICAgICBpZiAoY2hpbGQgJiYgY2hpbGQubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFKSB7XG4gICAgICAgICAgY29uc3QgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICAgICAgICAgIHJhbmdlLnNldFN0YXJ0KGNoaWxkLCBtLnN0YXJ0KTtcbiAgICAgICAgICByYW5nZS5zZXRFbmQoY2hpbGQsIG0uZW5kKTtcbiAgICAgICAgICBjb25zdCByZWN0cyA9IHJhbmdlLmdldENsaWVudFJlY3RzKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCByZWN0cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IHJlY3RzW2tdO1xuICAgICAgICAgICAgaWYgKHJlY3QgJiYgcmVjdC53aWR0aCA+IDAgJiYgcmVjdC5oZWlnaHQgPiAwKSB7XG4gICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgIGRvbV9pZDogYHBpaV9zcGFuXyR7bmV4dFBpaUlkKyt9YCxcbiAgICAgICAgICAgICAgICBmcmFtZV9pZDogZnJhbWVJZCxcbiAgICAgICAgICAgICAgICBvcmlnaW46IHVybE9yaWdpbixcbiAgICAgICAgICAgICAgICB0YWc6ICdzcGFuJyxcbiAgICAgICAgICAgICAgICByb2xlOiBudWxsLFxuICAgICAgICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgICAgICAgdGV4dDogbS50ZXh0LFxuICAgICAgICAgICAgICAgIGJib3g6IFtcbiAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQocmVjdC5sZWZ0ICsgZnJhbWVPZmZzZXRbMF0pLFxuICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZChyZWN0LnRvcCArIGZyYW1lT2Zmc2V0WzFdKSxcbiAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQocmVjdC53aWR0aCksXG4gICAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKHJlY3QuaGVpZ2h0KSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGFyaWE6IHt9LFxuICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaW5fdmlld3BvcnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgb2NjbHVkZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGludGVyYWN0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmVuZGVyaW5nOiAnaHRtbCcsXG4gICAgICAgICAgICAgICAgaGFzX2JnX2ltYWdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBoYW5kbGVyc19oaW50OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwYXJlbnRfZG9tX2lkOiBkb21JZCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICAgIGVsZW1lbnRzLnB1c2goe1xuICAgICAgZG9tX2lkOiBkb21JZCxcbiAgICAgIGZyYW1lX2lkOiBmcmFtZUlkLFxuICAgICAgb3JpZ2luOiB1cmxPcmlnaW4sXG4gICAgICB0YWc6IHMudGFnLFxuICAgICAgcm9sZTogcy5yb2xlLFxuICAgICAgbmFtZTogcy5uYW1lLFxuICAgICAgdGV4dDogcy5leHRyYWN0ZWRUZXh0LFxuICAgICAgY2xhc3Nlczogcy5jbGFzc2VzLFxuICAgICAgYXJpYTogcy5hcmlhLFxuICAgICAgaW5wdXQ6IHMuaW5wdXRJbmZvLFxuICAgICAgYXR0cmlidXRlczogcy5hdHRyaWJ1dGVzLFxuICAgICAgYmJveCxcbiAgICAgIHZpc2libGUsXG4gICAgICBpbl92aWV3cG9ydDogaW5WaWV3cG9ydCxcbiAgICAgIG9jY2x1ZGVkLFxuICAgICAgaW50ZXJhY3RhYmxlLFxuICAgICAgcmVuZGVyaW5nOiBzLnJlbmRlcmluZyxcbiAgICAgIGhhc19iZ19pbWFnZTogcy5oYXNfYmdfaW1hZ2UsXG4gICAgICBoYW5kbGVyc19oaW50OiBzLmhhbmRsZXJzX2hpbnQsXG4gICAgICBwYXJlbnRfZG9tX2lkOiBudWxsLFxuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgcGFnZVN0YXRlSGFzaCA9IGF3YWl0IGNvbXB1dGVQYWdlU3RhdGVIYXNoKFxuICAgIHVybE9yaWdpbixcbiAgICB1cmxQYXRoLFxuICAgIGZyYW1lcyxcbiAgICBlbGVtZW50cyxcbiAgICB3aW5kb3cuc2Nyb2xsWVxuICApO1xuXG4gIHJldHVybiB7XG4gICAgc25hcHNob3RfaWQ6IGBzbmFwXyR7RGF0ZS5ub3coKX1gLFxuICAgIHVybF9vcmlnaW46IHVybE9yaWdpbixcbiAgICB1cmxfcGF0aDogdXJsUGF0aCxcbiAgICBmcmFtZXMsXG4gICAgZWxlbWVudHMsXG4gICAgdmlld3BvcnQsXG4gICAgZHByOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLFxuICAgIHNjcm9sbDogeyB4OiB3aW5kb3cuc2Nyb2xsWCwgeTogd2luZG93LnNjcm9sbFkgfSxcbiAgICBwYWdlX3N0YXRlX2hhc2g6IHBhZ2VTdGF0ZUhhc2gsXG4gICAgdHM6IERhdGUubm93KCksXG4gIH07XG59XG4iLCJpbXBvcnQgdHlwZSB7IERpcnR5RXZlbnQgfSBmcm9tICdAY29udHJhY3RzL2luZGV4LmpzJztcbmltcG9ydCB7IGJ1cyB9IGZyb20gJ0Bjb250cmFjdHMvaW5kZXguanMnO1xuaW1wb3J0IHsgbWFya0RpcnR5IH0gZnJvbSAnLi4vcGVyY2VwdGlvbi9kb20vc25hcHNob3QuanMnO1xuXG5sZXQgbXV0YXRpb25PYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciB8IG51bGwgPSBudWxsO1xubGV0IGxhc3RTY3JvbGxZID0gMDtcbmxldCBzY3JvbGxUaW1lb3V0OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xubGV0IGRpcnR5VGltZW91dDogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcbmxldCBiYXRjaGVkQkJveDogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gfCBudWxsID0gbnVsbDtcbmxldCBhY3RpdmVTY3JvbGxMaXN0ZW5lcjogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9wRG9tT2JzZXJ2ZXJzKCkge1xuICBpZiAobXV0YXRpb25PYnNlcnZlcikge1xuICAgIG11dGF0aW9uT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIG11dGF0aW9uT2JzZXJ2ZXIgPSBudWxsO1xuICB9XG4gIGlmIChzY3JvbGxUaW1lb3V0KSBjbGVhclRpbWVvdXQoc2Nyb2xsVGltZW91dCk7XG4gIGlmIChkaXJ0eVRpbWVvdXQpIGNsZWFyVGltZW91dChkaXJ0eVRpbWVvdXQpO1xuICBpZiAoYWN0aXZlU2Nyb2xsTGlzdGVuZXIgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgYWN0aXZlU2Nyb2xsTGlzdGVuZXIpO1xuICAgIGFjdGl2ZVNjcm9sbExpc3RlbmVyID0gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnREb21PYnNlcnZlcnMoZnJhbWVJZCA9ICdtYWluJyk6ICgpID0+IHZvaWQge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuICgpID0+IHt9O1xuXG4gIHN0b3BEb21PYnNlcnZlcnMoKTsgLy8gRHVwbGljYXRlLW9ic2VydmVyIHByZXZlbnRpb25cblxuICBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIGxldCBoYXNNZWFuaW5nZnVsID0gZmFsc2U7XG5cbiAgICBmb3IgKGNvbnN0IG0gb2YgbXV0YXRpb25zKSB7XG4gICAgICBsZXQgdGFyZ2V0ID0gbS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBpZiAobS50eXBlID09PSAnY2hhcmFjdGVyRGF0YScpIHtcbiAgICAgICAgdGFyZ2V0ID0gbS50YXJnZXQucGFyZW50RWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKCF0YXJnZXQgfHwgIXRhcmdldC5jbG9zZXN0KSBjb250aW51ZTtcblxuICAgICAgLy8gUHJvdGVjdGlvbiBhZ2FpbnN0IGV4dGVuc2lvbi1nZW5lcmF0ZWQgbXV0YXRpb24gbG9vcHNcbiAgICAgIGlmICh0YXJnZXQuY2xvc2VzdCgnW2RhdGEtYWdlbnQtdWldJykgfHwgdGFyZ2V0LmlkID09PSAnX19zaWhfYWdlbnRfdWlfaG9zdF9fJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgaWYgKG0udHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHtcbiAgICAgICAgbGV0IG9ubHlFeHRlbnNpb25Ob2RlcyA9IHRydWU7XG4gICAgICAgIGlmIChtLmFkZGVkTm9kZXMubGVuZ3RoID09PSAwICYmIG0ucmVtb3ZlZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIG9ubHlFeHRlbnNpb25Ob2RlcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBtLmFkZGVkTm9kZXMuZm9yRWFjaChuID0+IHtcbiAgICAgICAgICBjb25zdCBlbCA9IG4gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKGVsLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgb25seUV4dGVuc2lvbk5vZGVzID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChlbC5pZCAhPT0gJ19fc2loX2FnZW50X3VpX2hvc3RfXycgJiYgIWVsLmhhc0F0dHJpYnV0ZT8uKCdkYXRhLWFnZW50LXVpJykpIHtcbiAgICAgICAgICAgIG9ubHlFeHRlbnNpb25Ob2RlcyA9IGZhbHNlO1xuICAgICAgICAgICAgbWFya0RpcnR5KGVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgbS5yZW1vdmVkTm9kZXMuZm9yRWFjaChuID0+IHtcbiAgICAgICAgICBjb25zdCBlbCA9IG4gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKGVsLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgb25seUV4dGVuc2lvbk5vZGVzID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChlbC5pZCAhPT0gJ19fc2loX2FnZW50X3VpX2hvc3RfXycgJiYgIWVsLmhhc0F0dHJpYnV0ZT8uKCdkYXRhLWFnZW50LXVpJykpIHtcbiAgICAgICAgICAgIG9ubHlFeHRlbnNpb25Ob2RlcyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG9ubHlFeHRlbnNpb25Ob2Rlcykge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG1hcmtEaXJ0eSh0YXJnZXQpO1xuXG4gICAgICBoYXNNZWFuaW5nZnVsID0gdHJ1ZTtcblxuICAgICAgaWYgKCFiYXRjaGVkQkJveCAmJiB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7XG4gICAgICAgIGNvbnN0IHJlY3QgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGJhdGNoZWRCQm94ID0gW3JlY3QubGVmdCwgcmVjdC50b3AsIHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWhhc01lYW5pbmdmdWwpIHJldHVybjtcblxuICAgIGlmICghZGlydHlUaW1lb3V0KSB7XG4gICAgICBkaXJ0eVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3QgZXZlbnQ6IERpcnR5RXZlbnQgPSB7XG4gICAgICAgICAgcmVhc29uOiAnbXV0YXRpb24nLFxuICAgICAgICAgIGJib3g6IGJhdGNoZWRCQm94LFxuICAgICAgICAgIGZyYW1lX2lkOiBmcmFtZUlkLFxuICAgICAgICAgIHRzOiBEYXRlLm5vdygpLFxuICAgICAgICB9O1xuICAgICAgICBidXMuc2VuZCgnZG9tL2RpcnR5JywgZXZlbnQpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgYmF0Y2hlZEJCb3ggPSBudWxsO1xuICAgICAgICBkaXJ0eVRpbWVvdXQgPSBudWxsO1xuICAgICAgfSwgMTAwKTsgLy8gRGVib3VuY2VcbiAgICB9XG4gIH0pO1xuXG4gIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwge1xuICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICBzdWJ0cmVlOiB0cnVlLFxuICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgYXR0cmlidXRlRmlsdGVyOiBbJ2NsYXNzJywgJ3N0eWxlJywgJ2hpZGRlbicsICdhcmlhLWhpZGRlbicsICdkaXNhYmxlZCddLFxuICAgIGNoYXJhY3RlckRhdGE6IHRydWUgLy8gUmVxdWlyZWQgZm9yIHRleHQgY2hhbmdlc1xuICB9KTtcblxuICBjb25zdCBvblNjcm9sbCA9ICgpID0+IHtcbiAgICBpZiAoTWF0aC5hYnMod2luZG93LnNjcm9sbFkgLSBsYXN0U2Nyb2xsWSkgPCAzMikgcmV0dXJuO1xuICAgIGxhc3RTY3JvbGxZID0gd2luZG93LnNjcm9sbFk7XG5cbiAgICBpZiAoc2Nyb2xsVGltZW91dCkgY2xlYXJUaW1lb3V0KHNjcm9sbFRpbWVvdXQpO1xuICAgIHNjcm9sbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGV2ZW50OiBEaXJ0eUV2ZW50ID0ge1xuICAgICAgICByZWFzb246ICdzY3JvbGwnLFxuICAgICAgICBiYm94OiBudWxsLFxuICAgICAgICBmcmFtZV9pZDogZnJhbWVJZCxcbiAgICAgICAgdHM6IERhdGUubm93KCksXG4gICAgICB9O1xuICAgICAgYnVzLnNlbmQoJ2RvbS9kaXJ0eScsIGV2ZW50KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfSwgMTAwKTtcbiAgfTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb25TY3JvbGwsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgYWN0aXZlU2Nyb2xsTGlzdGVuZXIgPSBvblNjcm9sbDtcblxuICByZXR1cm4gKCkgPT4ge1xuICAgIHN0b3BEb21PYnNlcnZlcnMoKTtcbiAgfTtcbn1cbiIsImltcG9ydCB0eXBlIHsgQkJveCB9IGZyb20gJ0Bjb250cmFjdHMvaW5kZXguanMnO1xuXG5sZXQgYWdlbnRVaUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbmxldCBhZ2VudFVpU2hhZG93OiBTaGFkb3dSb290IHwgbnVsbCA9IG51bGw7XG5cbmZ1bmN0aW9uIGVuc3VyZUFnZW50VWlIb3N0KCk6IFNoYWRvd1Jvb3Qge1xuICBpZiAoYWdlbnRVaVNoYWRvdyAmJiBhZ2VudFVpQ29udGFpbmVyICYmIGFnZW50VWlDb250YWluZXIuaXNDb25uZWN0ZWQpIHtcbiAgICByZXR1cm4gYWdlbnRVaVNoYWRvdztcbiAgfVxuXG4gIGFnZW50VWlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgYWdlbnRVaUNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RhdGEtYWdlbnQtdWknLCAndHJ1ZScpO1xuICBhZ2VudFVpQ29udGFpbmVyLmlkID0gJ19fc2loX2FnZW50X3VpX2hvc3RfXyc7XG4gIGFnZW50VWlDb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICBhZ2VudFVpQ29udGFpbmVyLnN0eWxlLnRvcCA9ICcwJztcbiAgYWdlbnRVaUNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gJzAnO1xuICBhZ2VudFVpQ29udGFpbmVyLnN0eWxlLndpZHRoID0gJzAnO1xuICBhZ2VudFVpQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9ICcwJztcbiAgYWdlbnRVaUNvbnRhaW5lci5zdHlsZS56SW5kZXggPSAnMjE0NzQ4MzY0Nyc7XG4gIGFnZW50VWlDb250YWluZXIuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcblxuICBhZ2VudFVpU2hhZG93ID0gYWdlbnRVaUNvbnRhaW5lci5hdHRhY2hTaGFkb3coeyBtb2RlOiAnY2xvc2VkJyB9KTtcblxuICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHN0eWxlLnRleHRDb250ZW50ID0gYFxuICAgIC5hY3Rpb24taGlnaGxpZ2h0IHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGJvcmRlcjogMnB4IHNvbGlkICMzYjgyZjY7XG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDU5LCAxMzAsIDI0NiwgMC4xNSk7XG4gICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4zcyBlYXNlLW91dDtcbiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgfVxuICBgO1xuICBhZ2VudFVpU2hhZG93LmFwcGVuZENoaWxkKHN0eWxlKTtcblxuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoYWdlbnRVaUNvbnRhaW5lcik7XG4gIHJldHVybiBhZ2VudFVpU2hhZG93O1xufVxuXG4vKipcbiAqIFNob3cgYSBtb21lbnRhcnkgYWN0aW9uIGhpZ2hsaWdodCBib3VuZGluZyBib3ggZm9yIHZpc3VhbCBmZWVkYmFjay5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3dBY3Rpb25IaWdobGlnaHQoYmJveDogQkJveCwgZHVyYXRpb25NcyA9IDgwMCk6IHZvaWQge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuO1xuXG4gIGNvbnN0IHNoYWRvdyA9IGVuc3VyZUFnZW50VWlIb3N0KCk7XG4gIGNvbnN0IGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBib3guY2xhc3NOYW1lID0gJ2FjdGlvbi1oaWdobGlnaHQnO1xuICBib3guc3R5bGUubGVmdCA9IGAke2Jib3hbMF19cHhgO1xuICBib3guc3R5bGUudG9wID0gYCR7YmJveFsxXX1weGA7XG4gIGJveC5zdHlsZS53aWR0aCA9IGAke2Jib3hbMl19cHhgO1xuICBib3guc3R5bGUuaGVpZ2h0ID0gYCR7YmJveFszXX1weGA7XG5cbiAgc2hhZG93LmFwcGVuZENoaWxkKGJveCk7XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgYm94LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBib3gucmVtb3ZlKCk7XG4gICAgfSwgMzAwKTtcbiAgfSwgZHVyYXRpb25Ncyk7XG59XG4iLCJpbXBvcnQgeyBzaG93QWN0aW9uSGlnaGxpZ2h0IH0gZnJvbSAnLi4vLi4vY29udGVudC9hZ2VudC11aS5qcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlQ2xpY2soZWw6IEVsZW1lbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgLy8gMS4gU2Nyb2xsIGludG8gdmlldyBpZiBuZWVkZWRcbiAgZWwuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogJ2NlbnRlcicsIGlubGluZTogJ2NlbnRlcicsIGJlaGF2aW9yOiAnaW5zdGFudCcgfSk7XG5cbiAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBjeCA9IHJlY3QubGVmdCArIHJlY3Qud2lkdGggLyAyO1xuICBjb25zdCBjeSA9IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgLyAyO1xuXG4gIC8vIDIuIEFudGktZGVjb3kgY2hlY2s6IHZlcmlmeSBlbGVtZW50IGF0IHBvaW50IGlzIGluZGVlZCB0YXJnZXQgb3IgZGVzY2VuZGFudFxuICBpZiAodHlwZW9mIGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zdCBhdFBvaW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjeCwgY3kpO1xuICAgIGlmIChhdFBvaW50ICYmIGF0UG9pbnQgIT09IGVsICYmICFlbC5jb250YWlucyhhdFBvaW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDbGljayBibG9ja2VkOiB0YXJnZXQgaXMgb2JzY3VyZWQgYnkgZGVjb3kgZWxlbWVudCA8JHthdFBvaW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKX0+YCk7XG4gICAgfVxuICB9XG5cbiAgLy8gMy4gSGlnaGxpZ2h0XG4gIHNob3dBY3Rpb25IaWdobGlnaHQoW3JlY3QubGVmdCwgcmVjdC50b3AsIHJlY3Qud2lkdGgsIHJlY3QuaGVpZ2h0XSk7XG5cbiAgLy8gNC4gRGlzcGF0Y2ggcG9pbnRlciAmIG1vdXNlIGV2ZW50c1xuICBjb25zdCBvcHRzOiBNb3VzZUV2ZW50SW5pdCA9IHtcbiAgICBidWJibGVzOiB0cnVlLFxuICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgdmlldzogd2luZG93LFxuICAgIGNsaWVudFg6IGN4LFxuICAgIGNsaWVudFk6IGN5LFxuICB9O1xuXG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IFBvaW50ZXJFdmVudCgncG9pbnRlcmRvd24nLCBvcHRzKSk7XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoJ21vdXNlZG93bicsIG9wdHMpKTtcbiAgZWwuZGlzcGF0Y2hFdmVudChuZXcgUG9pbnRlckV2ZW50KCdwb2ludGVydXAnLCBvcHRzKSk7XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoJ21vdXNldXAnLCBvcHRzKSk7XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoJ2NsaWNrJywgb3B0cykpO1xuXG4gIGlmICh0eXBlb2YgKGVsIGFzIGFueSkuY2xpY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAoZWwgYXMgYW55KS5jbGljaygpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBzaG93QWN0aW9uSGlnaGxpZ2h0IH0gZnJvbSAnLi4vLi4vY29udGVudC9hZ2VudC11aS5qcyc7XG5cbmZ1bmN0aW9uIHNldE5hdGl2ZVZhbHVlKGVsOiBIVE1MRWxlbWVudCwgdmFsOiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc3QgaXNUZXh0YXJlYSA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RleHRhcmVhJztcbiAgY29uc3QgcHJvdG90eXBlID0gaXNUZXh0YXJlYVxuICAgID8gd2luZG93LkhUTUxUZXh0QXJlYUVsZW1lbnQucHJvdG90eXBlXG4gICAgOiB3aW5kb3cuSFRNTElucHV0RWxlbWVudC5wcm90b3R5cGU7XG5cbiAgY29uc3QgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCAndmFsdWUnKTtcbiAgaWYgKGRlc2NyaXB0b3I/LnNldCkge1xuICAgIGRlc2NyaXB0b3Iuc2V0LmNhbGwoZWwsIHZhbCk7XG4gIH0gZWxzZSB7XG4gICAgKGVsIGFzIGFueSkudmFsdWUgPSB2YWw7XG4gIH1cblxuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVUeXBlKGVsOiBFbGVtZW50LCB0ZXh0OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgaHRtbEVsID0gZWwgYXMgSFRNTEVsZW1lbnQ7XG4gIGh0bWxFbC5mb2N1cygpO1xuXG4gIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgc2hvd0FjdGlvbkhpZ2hsaWdodChbcmVjdC5sZWZ0LCByZWN0LnRvcCwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHRdKTtcblxuICBzZXROYXRpdmVWYWx1ZShodG1sRWwsIHRleHQpO1xuXG4gIGlmICgoaHRtbEVsIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50KS52YWx1ZSAhPT0gdGV4dCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVHlwZSBhY3Rpb24gZmFpbGVkOiBFbGVtZW50IHZhbHVlIGRpZCBub3QgdXBkYXRlLicpO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlRmlsbFNlY3JldChlbDogRWxlbWVudCwgc2VjcmV0VmFsdWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBsZXQgZXBoZW1lcmFsU2VjcmV0OiBzdHJpbmcgfCBudWxsID0gc2VjcmV0VmFsdWU7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBodG1sRWwgPSBlbCBhcyBIVE1MRWxlbWVudDtcbiAgICBodG1sRWwuZm9jdXMoKTtcblxuICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBzaG93QWN0aW9uSGlnaGxpZ2h0KFtyZWN0LmxlZnQsIHJlY3QudG9wLCByZWN0LndpZHRoLCByZWN0LmhlaWdodF0pO1xuXG4gICAgc2V0TmF0aXZlVmFsdWUoaHRtbEVsLCBlcGhlbWVyYWxTZWNyZXQpO1xuXG4gICAgaWYgKChodG1sRWwgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQpLnZhbHVlICE9PSBlcGhlbWVyYWxTZWNyZXQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmlsbCBzZWNyZXQgYWN0aW9uIGZhaWxlZDogRWxlbWVudCB2YWx1ZSBkaWQgbm90IHVwZGF0ZS4nKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgLy8gSW52YXJpYW50IEk5OiBaZXJvaXplIHNlY3JldCB2YXJpYWJsZSBpbW1lZGlhdGVseVxuICAgIGVwaGVtZXJhbFNlY3JldCA9ICcwMDAwMDAwMDAwMDAwMDAwJztcbiAgICBlcGhlbWVyYWxTZWNyZXQgPSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBzaG93QWN0aW9uSGlnaGxpZ2h0IH0gZnJvbSAnLi4vLi4vY29udGVudC9hZ2VudC11aS5qcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlU2VsZWN0KGVsOiBFbGVtZW50LCBvcHRpb25UZXh0T3JWYWx1ZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgc2hvd0FjdGlvbkhpZ2hsaWdodChbcmVjdC5sZWZ0LCByZWN0LnRvcCwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHRdKTtcblxuICBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0Jykge1xuICAgIGNvbnN0IHNlbGVjdEVsID0gZWwgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdEVsLm9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG9wdCA9IHNlbGVjdEVsLm9wdGlvbnNbaV07XG4gICAgICBpZiAob3B0ICYmIChvcHQudmFsdWUgPT09IG9wdGlvblRleHRPclZhbHVlIHx8IG9wdC50ZXh0LnRyaW0oKSA9PT0gb3B0aW9uVGV4dE9yVmFsdWUudHJpbSgpKSkge1xuICAgICAgICBzZWxlY3RFbC5zZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE9wdGlvbiBcIiR7b3B0aW9uVGV4dE9yVmFsdWV9XCIgbm90IGZvdW5kIGluIHNlbGVjdCBlbGVtZW50YCk7XG4gICAgfVxuXG4gICAgc2VsZWN0RWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICBzZWxlY3RFbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBGb3IgY3VzdG9tIGRyb3Bkb3duIGNvbnRyb2xzLCB0cmlnZ2VyIGNsaWNrXG4gICAgKGVsIGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xuICB9XG59XG4iLCJleHBvcnQgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZVNjcm9sbChcbiAgZGlyZWN0aW9uOiAndXAnIHwgJ2Rvd24nIHwgJ2xlZnQnIHwgJ3JpZ2h0JyA9ICdkb3duJyxcbiAgcmF3QW1vdW50ID0gMzAwXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgYW1vdW50ID0gTWF0aC5taW4oTWF0aC5tYXgoMTAsIHJhd0Ftb3VudCksIDEyMDApOyAvLyBDYXAgc2Nyb2xsIGJvdW5kc1xuXG4gIGxldCBkeCA9IDA7XG4gIGxldCBkeSA9IDA7XG5cbiAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICBjYXNlICd1cCc6XG4gICAgICBkeSA9IC1hbW91bnQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdkb3duJzpcbiAgICAgIGR5ID0gYW1vdW50O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbGVmdCc6XG4gICAgICBkeCA9IC1hbW91bnQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdyaWdodCc6XG4gICAgICBkeCA9IGFtb3VudDtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgY29uc3Qgc3RhcnRYID0gd2luZG93LnNjcm9sbFg7XG4gICAgY29uc3Qgc3RhcnRZID0gd2luZG93LnNjcm9sbFk7XG5cbiAgICB3aW5kb3cuc2Nyb2xsQnkoeyBsZWZ0OiBkeCwgdG9wOiBkeSwgYmVoYXZpb3I6ICdpbnN0YW50JyB9KTtcblxuICAgIGlmICh3aW5kb3cuc2Nyb2xsWCA9PT0gc3RhcnRYICYmIHdpbmRvdy5zY3JvbGxZID09PSBzdGFydFkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU2Nyb2xsICR7ZGlyZWN0aW9ufSBmYWlsZWQ6IE5vIGNoYW5nZSBpbiBzY3JvbGwgcG9zaXRpb24uIEFscmVhZHkgYXQgZWRnZSBvciBub3Qgc2Nyb2xsYWJsZS5gKTtcbiAgICB9XG4gIH1cbn1cbiIsImNvbnN0IEFMTE9XRURfS0VZUyA9IG5ldyBTZXQoW1xuICAnRW50ZXInLFxuICAnVGFiJyxcbiAgJ0VzY2FwZScsXG4gICdCYWNrc3BhY2UnLFxuICAnQXJyb3dVcCcsXG4gICdBcnJvd0Rvd24nLFxuICAnQXJyb3dMZWZ0JyxcbiAgJ0Fycm93UmlnaHQnLFxuXSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlS2V5cHJlc3Moa2V5OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKCFBTExPV0VEX0tFWVMuaGFzKGtleSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEtleSBcIiR7a2V5fVwiIGlzIG5vdCBpbiB3aGl0ZWxpc3RlZCBhbGxvd2VkIGtleXNgKTtcbiAgfVxuXG4gIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcbiAgY29uc3Qgb3B0czogS2V5Ym9hcmRFdmVudEluaXQgPSB7XG4gICAga2V5LFxuICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgfTtcblxuICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicsIG9wdHMpKTtcbiAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoJ2tleXByZXNzJywgb3B0cykpO1xuICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudCgna2V5dXAnLCBvcHRzKSk7XG59XG4iLCJleHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdEZvclNldHRsZShkZWJvdW5jZU1zID0gMTUwLCBtYXhXYWl0TXMgPSAyMDAwKTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgbGV0IHRpbWVvdXQ6IGFueSA9IG51bGw7XG4gICAgbGV0IG1heFRpbWVvdXQ6IGFueSA9IG51bGw7XG5cbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRvbmUsIGRlYm91bmNlTXMpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZG9uZSA9ICgpID0+IHtcbiAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIGNsZWFyVGltZW91dChtYXhUaW1lb3V0KTtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9O1xuXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCwge1xuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgfSk7XG5cbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkb25lLCBkZWJvdW5jZU1zKTtcbiAgICBtYXhUaW1lb3V0ID0gc2V0VGltZW91dChkb25lLCBtYXhXYWl0TXMpO1xuICB9KTtcbn1cbiIsImltcG9ydCB0eXBlIHsgRXhlY1Jlc3VsdCwgU3RydWN0dXJlZEFjdGlvbiB9IGZyb20gJ0Bjb250cmFjdHMvaW5kZXguanMnO1xuaW1wb3J0IHsgc3RhZ2VFcnJvciB9IGZyb20gJ0Bjb250cmFjdHMvY29tbW9uLmpzJztcbmltcG9ydCB7IGVsZW1lbnRSZWdpc3RyeSB9IGZyb20gJy4uLy4uL2NvbnRlbnQvcmVnaXN0cnkuanMnO1xuaW1wb3J0IHsgZXhlY3V0ZUNsaWNrIH0gZnJvbSAnLi9jbGljay5qcyc7XG5pbXBvcnQgeyBleGVjdXRlRmlsbFNlY3JldCwgZXhlY3V0ZVR5cGUgfSBmcm9tICcuL3R5cGUuanMnO1xuaW1wb3J0IHsgZXhlY3V0ZVNlbGVjdCB9IGZyb20gJy4vc2VsZWN0LmpzJztcbmltcG9ydCB7IGV4ZWN1dGVTY3JvbGwgfSBmcm9tICcuL3Njcm9sbC5qcyc7XG5pbXBvcnQgeyBleGVjdXRlS2V5cHJlc3MgfSBmcm9tICcuL2tleXByZXNzLmpzJztcbmltcG9ydCB7IHdhaXRGb3JTZXR0bGUgfSBmcm9tICcuL3NldHRsZS5qcyc7XG5pbXBvcnQgeyBleHRyYWN0RG9tU25hcHNob3QgfSBmcm9tICcuLi8uLi9wZXJjZXB0aW9uL2RvbS9zbmFwc2hvdC5qcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlQWN0aW9uKFxuICBhY3Rpb246IFN0cnVjdHVyZWRBY3Rpb24sXG4gIHJlc29sdmVkU2VjcmV0Pzogc3RyaW5nXG4pOiBQcm9taXNlPEV4ZWNSZXN1bHQ+IHtcbiAgbGV0IHRhcmdldEVsOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgaWYgKGFjdGlvbi50YXJnZXQpIHtcbiAgICB0YXJnZXRFbCA9IGVsZW1lbnRSZWdpc3RyeS5nZXRCeVJlZ2lvbklkKGFjdGlvbi50YXJnZXQucmVnaW9uX2lkKTtcbiAgICBpZiAoIXRhcmdldEVsKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvazogZmFsc2UsXG4gICAgICAgIGFjdGlvbl9pZDogYWN0aW9uLmFjdGlvbl9pZCxcbiAgICAgICAgbmF2aWdhdGVkOiBmYWxzZSxcbiAgICAgICAgbmV3X3BhZ2Vfc3RhdGVfaGFzaDogbnVsbCxcbiAgICAgICAgZXJyb3I6IHN0YWdlRXJyb3IoXG4gICAgICAgICAgJ1RBUkdFVF9OT1RfRk9VTkQnLFxuICAgICAgICAgICdleGVjdXRlJyxcbiAgICAgICAgICBgQ2Fubm90IGV4ZWN1dGU6IGVsZW1lbnQgZm9yIHJlZ2lvbiBcIiR7YWN0aW9uLnRhcmdldC5yZWdpb25faWR9XCIgaXMgZGlzY29ubmVjdGVkIG9yIG5vdCBmb3VuZGBcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcbiAgICBzd2l0Y2ggKGFjdGlvbi5hY3Rpb24pIHtcbiAgICAgIGNhc2UgJ2NsaWNrJzoge1xuICAgICAgICBpZiAoIXRhcmdldEVsKSB0aHJvdyBuZXcgRXJyb3IoJ0NsaWNrIHJlcXVpcmVzIGEgdGFyZ2V0IGVsZW1lbnQnKTtcbiAgICAgICAgYXdhaXQgZXhlY3V0ZUNsaWNrKHRhcmdldEVsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ3R5cGUnOiB7XG4gICAgICAgIGlmICghdGFyZ2V0RWwpIHRocm93IG5ldyBFcnJvcignVHlwZSByZXF1aXJlcyBhIHRhcmdldCBlbGVtZW50Jyk7XG4gICAgICAgIGF3YWl0IGV4ZWN1dGVUeXBlKHRhcmdldEVsLCBhY3Rpb24ucGFyYW1zPy50ZXh0IHx8ICcnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ2ZpbGxfc2VjcmV0Jzoge1xuICAgICAgICBpZiAoIXRhcmdldEVsKSB0aHJvdyBuZXcgRXJyb3IoJ2ZpbGxfc2VjcmV0IHJlcXVpcmVzIGEgdGFyZ2V0IGVsZW1lbnQnKTtcbiAgICAgICAgaWYgKCFyZXNvbHZlZFNlY3JldCkgdGhyb3cgbmV3IEVycm9yKCdmaWxsX3NlY3JldCByZXF1aXJlcyBhIHJlc29sdmVkIHNlY3JldCB2YWx1ZScpO1xuICAgICAgICBhd2FpdCBleGVjdXRlRmlsbFNlY3JldCh0YXJnZXRFbCwgcmVzb2x2ZWRTZWNyZXQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnc2VsZWN0Jzoge1xuICAgICAgICBpZiAoIXRhcmdldEVsKSB0aHJvdyBuZXcgRXJyb3IoJ1NlbGVjdCByZXF1aXJlcyBhIHRhcmdldCBlbGVtZW50Jyk7XG4gICAgICAgIGF3YWl0IGV4ZWN1dGVTZWxlY3QodGFyZ2V0RWwsIGFjdGlvbi5wYXJhbXM/Lm9wdGlvbiB8fCAnJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICdzY3JvbGwnOiB7XG4gICAgICAgIGF3YWl0IGV4ZWN1dGVTY3JvbGwoYWN0aW9uLnBhcmFtcz8uZGlyZWN0aW9uLCBhY3Rpb24ucGFyYW1zPy5hbW91bnQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnZm9jdXMnOiB7XG4gICAgICAgIGlmICghdGFyZ2V0RWwpIHRocm93IG5ldyBFcnJvcignRm9jdXMgcmVxdWlyZXMgYSB0YXJnZXQgZWxlbWVudCcpO1xuICAgICAgICAodGFyZ2V0RWwgYXMgSFRNTEVsZW1lbnQpLmZvY3VzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICdrZXlwcmVzcyc6IHtcbiAgICAgICAgaWYgKCFhY3Rpb24ucGFyYW1zPy5rZXkpIHRocm93IG5ldyBFcnJvcignS2V5cHJlc3MgcmVxdWlyZXMgYSBrZXkgcGFyYW1ldGVyJyk7XG4gICAgICAgIGF3YWl0IGV4ZWN1dGVLZXlwcmVzcyhhY3Rpb24ucGFyYW1zLmtleSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICduYXZpZ2F0ZSc6IHtcbiAgICAgICAgaWYgKCEoYWN0aW9uLnBhcmFtcyBhcyBhbnkpPy51cmwpIHRocm93IG5ldyBFcnJvcignTmF2aWdhdGUgcmVxdWlyZXMgYSB1cmwgcGFyYW1ldGVyJyk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gKGFjdGlvbi5wYXJhbXMgYXMgYW55KS51cmw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICdiYWNrJzoge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGFjdGlvbiB0eXBlOiAkeyhhY3Rpb24gYXMgYW55KS5hY3Rpb259YCk7XG4gICAgfVxuXG4gICAgLy8gV2FpdCBmb3IgRE9NIG11dGF0aW9ucyB0byBzZXR0bGVcbiAgICBhd2FpdCB3YWl0Rm9yU2V0dGxlKCk7XG5cbiAgICAvLyBDb21wdXRlIGZyZXNoIHN0YXRlIGhhc2ggYWZ0ZXIgZXhlY3V0aW9uXG4gICAgY29uc3QgZnJlc2hTbmFwc2hvdCA9IGF3YWl0IGV4dHJhY3REb21TbmFwc2hvdCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG9rOiB0cnVlLFxuICAgICAgYWN0aW9uX2lkOiBhY3Rpb24uYWN0aW9uX2lkLFxuICAgICAgbmF2aWdhdGVkOiBmYWxzZSxcbiAgICAgIG5ld19wYWdlX3N0YXRlX2hhc2g6IGZyZXNoU25hcHNob3QucGFnZV9zdGF0ZV9oYXNoLFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgLy8gUGhhc2UgMTU6IFNhZmUgRXJyb3IgTm9ybWFsaXphdGlvblxuICAgIC8vIExvZyB0aGUgaW50ZXJuYWwgZGlhZ25vc3RpYyBlcnJvciB0byB0aGUgY29uc29sZSBmb3IgZGVidWdnaW5nIGJ1dCBETyBOT1QgZXhwb3NlIHRvIHRoZSBBZ2VudC5cbiAgICBjb25zb2xlLmVycm9yKCdbQWN0aW9uIEV4ZWN1dG9yXSBJbnRlcm5hbCBFeGVjdXRpb24gRXJyb3I6JywgZXJyKTtcblxuICAgIGxldCBzYWZlRXJyb3JDb2RlOiBhbnkgPSAnSU5URVJOQUwnO1xuICAgIGxldCBzYWZlTWVzc2FnZSA9ICdBY3Rpb24gZXhlY3V0aW9uIGZhaWxlZCBkdWUgdG8gYW4gaW50ZXJuYWwgYnJvd3NlciBlcnJvci4nO1xuXG4gICAgY29uc3QgZXJyTXNnID0gZXJyPy5tZXNzYWdlIHx8IFN0cmluZyhlcnIpO1xuICAgIGlmIChlcnJNc2cuaW5jbHVkZXMoJ3JlcXVpcmVzIGEgdGFyZ2V0IGVsZW1lbnQnKSkge1xuICAgICAgc2FmZUVycm9yQ29kZSA9ICdUQVJHRVRfTk9UX0ZPVU5EJztcbiAgICAgIHNhZmVNZXNzYWdlID0gJ1RoZSByZXF1ZXN0ZWQgYWN0aW9uIHJlcXVpcmVzIGEgdGFyZ2V0IHJlZ2lvbiB0aGF0IHdhcyBub3QgZm91bmQgb3IgcHJvdmlkZWQuJztcbiAgICB9IGVsc2UgaWYgKGVyck1zZy5pbmNsdWRlcygncmVxdWlyZXMgYSB1cmwnKSkge1xuICAgICAgc2FmZUVycm9yQ29kZSA9ICdJTlRFUk5BTCc7XG4gICAgICBzYWZlTWVzc2FnZSA9ICdUaGUgcmVxdWVzdGVkIG5hdmlnYXRpb24gYWN0aW9uIHJlcXVpcmVzIGEgdmFsaWQgVVJMLic7XG4gICAgfSBlbHNlIGlmIChlcnJNc2cuaW5jbHVkZXMoJ1Vuc3VwcG9ydGVkIGFjdGlvbiB0eXBlJykpIHtcbiAgICAgIHNhZmVFcnJvckNvZGUgPSAnSU5URVJOQUwnO1xuICAgICAgc2FmZU1lc3NhZ2UgPSAnVGhlIHJlcXVlc3RlZCBhY3Rpb24gdHlwZSBpcyBub3Qgc3VwcG9ydGVkLic7XG4gICAgfSBlbHNlIGlmIChlcnJNc2cuaW5jbHVkZXMoJ2ZpbGxfc2VjcmV0IHJlcXVpcmVzIGEgcmVzb2x2ZWQgc2VjcmV0JykpIHtcbiAgICAgIHNhZmVFcnJvckNvZGUgPSAnSU5URVJOQUwnO1xuICAgICAgc2FmZU1lc3NhZ2UgPSAnVGhlIHNlY3JldCBjb3VsZCBub3QgYmUgcmVzb2x2ZWQgZm9yIGZpbGxpbmcuJztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgb2s6IGZhbHNlLFxuICAgICAgYWN0aW9uX2lkOiBhY3Rpb24uYWN0aW9uX2lkLFxuICAgICAgbmF2aWdhdGVkOiBmYWxzZSxcbiAgICAgIG5ld19wYWdlX3N0YXRlX2hhc2g6IG51bGwsXG4gICAgICBlcnJvcjogc3RhZ2VFcnJvcihzYWZlRXJyb3JDb2RlLCAnZXhlY3V0ZScsIHNhZmVNZXNzYWdlKSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7XG4gIERvbUVsZW1lbnRJbmZvLFxuICBEb21TbmFwc2hvdCxcbiAgUGVyY2VwdGlvblJlZ2lvbixcbiAgU2VtYW50aWNUeXBlLFxuICBTb3VyY2UsXG4gIFZpc3VhbFN0YXRlLFxufSBmcm9tICdAY29udHJhY3RzL2luZGV4LmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIG1hcERvbVRvU2VtYW50aWNUeXBlKGVsOiBEb21FbGVtZW50SW5mbyk6IFNlbWFudGljVHlwZSB7XG4gIGlmIChlbC5yb2xlID09PSAnYnV0dG9uJyB8fCBlbC50YWcgPT09ICdidXR0b24nKSByZXR1cm4gJ2J1dHRvbic7XG4gIGlmIChlbC5pbnB1dCkge1xuICAgIGlmIChlbC5pbnB1dC50eXBlID09PSAnY2hlY2tib3gnKSByZXR1cm4gJ2NoZWNrYm94JztcbiAgICBpZiAoZWwuaW5wdXQudHlwZSA9PT0gJ2J1dHRvbicgfHwgZWwuaW5wdXQudHlwZSA9PT0gJ3N1Ym1pdCcpIHJldHVybiAnYnV0dG9uJztcbiAgICByZXR1cm4gJ2lucHV0JztcbiAgfVxuICBpZiAoZWwucm9sZSA9PT0gJ2xpbmsnIHx8IGVsLnRhZyA9PT0gJ2EnKSByZXR1cm4gJ2xpbmsnO1xuICBpZiAoZWwucm9sZSA9PT0gJ2NvbWJvYm94JyB8fCBlbC50YWcgPT09ICdzZWxlY3QnKSByZXR1cm4gJ2Ryb3Bkb3duJztcbiAgaWYgKGVsLnRhZyA9PT0gJ2ltZycgfHwgZWwucm9sZSA9PT0gJ2ltZycpIHJldHVybiAnaW1hZ2UnO1xuICBpZiAoZWwucm9sZSA9PT0gJ2RpYWxvZycgfHwgZWwudGFnID09PSAnZGlhbG9nJykgcmV0dXJuICdkaWFsb2cnO1xuICBpZiAoZWwudGFnID09PSAndGFibGUnKSByZXR1cm4gJ3RhYmxlJztcbiAgaWYgKGVsLnRhZyA9PT0gJ25hdicgfHwgZWwucm9sZSA9PT0gJ25hdmlnYXRpb24nKSByZXR1cm4gJ25hdmlnYXRpb24nO1xuICBpZiAoZWwucm9sZSA9PT0gJ3RhYicpIHJldHVybiAndGFiJztcbiAgaWYgKGVsLnJvbGUgPT09ICdtZW51JyB8fCBlbC5yb2xlID09PSAnbWVudWl0ZW0nKSByZXR1cm4gJ21lbnUnO1xuICBpZiAoZWwudGV4dCAmJiBlbC50ZXh0Lmxlbmd0aCA+IDApIHJldHVybiAndGV4dCc7XG4gIHJldHVybiAndW5rbm93bic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb21FbGVtZW50VG9QZXJjZXB0aW9uUmVnaW9uKFxuICBlbDogRG9tRWxlbWVudEluZm8sXG4gIHNuYXBzaG90OiBEb21TbmFwc2hvdFxuKTogUGVyY2VwdGlvblJlZ2lvbiB7XG4gIGNvbnN0IHNvdXJjZXM6IFNvdXJjZVtdID0gWydET00nXTtcbiAgaWYgKGVsLnJvbGUgfHwgZWwubmFtZSkge1xuICAgIHNvdXJjZXMucHVzaCgnQVJJQScpO1xuICB9XG5cbiAgY29uc3Qgc3RhdGVzOiBWaXN1YWxTdGF0ZVtdID0gW107XG4gIGlmIChlbC52aXNpYmxlKSBzdGF0ZXMucHVzaCgndmlzaWJsZScpO1xuICBpZiAoZWwuYXJpYS5kaXNhYmxlZCkgc3RhdGVzLnB1c2goJ2Rpc2FibGVkJyk7XG4gIGVsc2Ugc3RhdGVzLnB1c2goJ2VuYWJsZWQnKTtcbiAgaWYgKGVsLmFyaWEuc2VsZWN0ZWQpIHN0YXRlcy5wdXNoKCdzZWxlY3RlZCcpO1xuICBpZiAoZWwuYXJpYS5leHBhbmRlZCkgc3RhdGVzLnB1c2goJ2V4cGFuZGVkJyk7XG4gIGVsc2UgaWYgKGVsLmFyaWEuZXhwYW5kZWQgPT09IGZhbHNlKSBzdGF0ZXMucHVzaCgnY29sbGFwc2VkJyk7XG4gIGlmIChlbC5hcmlhLmNoZWNrZWQgPT09IHRydWUpIHN0YXRlcy5wdXNoKCdjaGVja2VkJyk7XG4gIGVsc2UgaWYgKGVsLmFyaWEuY2hlY2tlZCA9PT0gZmFsc2UpIHN0YXRlcy5wdXNoKCd1bmNoZWNrZWQnKTtcblxuICBsZXQgdGV4dCA9IGVsLm5hbWUgfHwgZWwudGV4dCB8fCBlbC5pbnB1dD8ucGxhY2Vob2xkZXIgfHwgbnVsbDtcbiAgaWYgKGVsLmlucHV0ICYmICFlbC5pbnB1dC5pc19wYXNzd29yZCAmJiBlbC5pbnB1dC52YWx1ZSAmJiBlbC5pbnB1dC52YWx1ZS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgIGlmIChlbC5uYW1lICYmIGVsLm5hbWUgIT09IGVsLmlucHV0LnZhbHVlKSB7XG4gICAgICB0ZXh0ID0gYCR7ZWwubmFtZX06ICR7ZWwuaW5wdXQudmFsdWV9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGV4dCA9IGVsLmlucHV0LnZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8vIFBoYXNlIDI6IEFkZCBvdGhlciBhdHRyaWJ1dGVzIHRvIHRoZSBzZWFyY2hhYmxlIHRleHQgc3BhY2VcbiAgaWYgKGVsLmF0dHJpYnV0ZXMpIHtcbiAgICBjb25zdCBhdHRyVmFscyA9IE9iamVjdC52YWx1ZXMoZWwuYXR0cmlidXRlcykuZmlsdGVyKEJvb2xlYW4pO1xuICAgIGlmIChhdHRyVmFscy5sZW5ndGggPiAwKSB7XG4gICAgICB0ZXh0ID0gKHRleHQgPyB0ZXh0ICsgJyAnIDogJycpICsgYXR0clZhbHMuam9pbignICcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcmVnaW9uX2lkOiAnJywgLy8gTWludGVkIGJ5IGFzc2VtYmxlRnJhbWUoKVxuICAgIGxvY2FsX2tleTogZWwuZG9tX2lkLFxuICAgIHNvdXJjZTogc291cmNlcyxcbiAgICBzZW1hbnRpY190eXBlOiBtYXBEb21Ub1NlbWFudGljVHlwZShlbCksXG4gICAgdGV4dCxcbiAgICBiYm94OiBlbC5iYm94LFxuICAgIGNvbmZpZGVuY2U6IDAuOTUsXG4gICAgdmlzaWJsZTogZWwudmlzaWJsZSxcbiAgICBpbnRlcmFjdGFibGU6IGVsLmludGVyYWN0YWJsZSxcbiAgICB2aXN1YWxfc3RhdGU6IHN0YXRlcyxcbiAgICBkb21fcmVmOiB7XG4gICAgICBkb21faWQ6IGVsLmRvbV9pZCxcbiAgICAgIHJvbGU6IGVsLnJvbGUsXG4gICAgICB0YWc6IGVsLnRhZyxcbiAgICB9LFxuICAgIHJvdXRlOiAnSElHSCcsXG4gICAgc2Vuc2l0aXZpdHk6ICd1bmNsYXNzaWZpZWQnLFxuICAgIG9yaWdpbjogZWwub3JpZ2luLFxuICAgIGZyYW1lX2lkOiBlbC5mcmFtZV9pZCxcbiAgICBwYWdlX3N0YXRlX2hhc2g6IHNuYXBzaG90LnBhZ2Vfc3RhdGVfaGFzaCxcbiAgICB0aW1lc3RhbXA6IHNuYXBzaG90LnRzLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgZGVmaW5lQ29udGVudFNjcmlwdCB9IGZyb20gJ3d4dC9zYW5kYm94JztcbmltcG9ydCB7IGJ1cyB9IGZyb20gJ0Bjb250cmFjdHMvaW5kZXguanMnO1xuaW1wb3J0IHsgZXh0cmFjdERvbVNuYXBzaG90IH0gZnJvbSAnLi4vc3JjL3BlcmNlcHRpb24vZG9tL3NuYXBzaG90LmpzJztcbmltcG9ydCB7IHN0YXJ0RG9tT2JzZXJ2ZXJzIH0gZnJvbSAnLi4vc3JjL2NvbnRlbnQvb2JzZXJ2ZXJzLmpzJztcbmltcG9ydCB7IGVsZW1lbnRSZWdpc3RyeSB9IGZyb20gJy4uL3NyYy9jb250ZW50L3JlZ2lzdHJ5LmpzJztcbmltcG9ydCB7IGV4ZWN1dGVBY3Rpb24gfSBmcm9tICcuLi9zcmMvYWN0aW9ucy9leGVjdXRvci9pbmRleC5qcyc7XG5pbXBvcnQgeyBpc0VsZW1lbnRPY2NsdWRlZCwgaXNFbGVtZW50VmlzaWJsZSB9IGZyb20gJy4uL3NyYy9wZXJjZXB0aW9uL2RvbS92aXNpYmlsaXR5LmpzJztcbmltcG9ydCB7IG1hcERvbVRvU2VtYW50aWNUeXBlIH0gZnJvbSAnLi4vc3JjL3BlcmNlcHRpb24vZG9tL3RvLXJlZ2lvbnMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb250ZW50U2NyaXB0KHtcbiAgbWF0Y2hlczogWyc8YWxsX3VybHM+J10sXG4gIGFsbEZyYW1lczogdHJ1ZSxcbiAgbWF0Y2hBYm91dEJsYW5rOiB0cnVlLFxuICBydW5BdDogJ2RvY3VtZW50X2lkbGUnLFxuICBtYWluKCkge1xuICAgIGNvbnN0IGlzVG9wID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnNlbGYgPT09IHdpbmRvdy50b3A7XG4gICAgY29uc3QgZnJhbWVJZCA9IGlzVG9wID8gJ21haW4nIDogYGZyYW1lXyR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDcpfWA7XG5cbiAgICAvLyBTdGFydCBET00gbXV0YXRpb24gJiBzY3JvbGwgb2JzZXJ2ZXJzXG4gICAgc3RhcnREb21PYnNlcnZlcnMoZnJhbWVJZCk7XG5cbiAgICAvLyBTeW5jaHJvbm91cyB0b3AtbGV2ZWwgYnVzIGxpc3RlbmVyc1xuICAgIGJ1cy5vbignZG9tL3NuYXBzaG90JywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmV0dXJuIGV4dHJhY3REb21TbmFwc2hvdChmcmFtZUlkKTtcbiAgICB9KTtcblxuICAgIGJ1cy5vbignZG9tL2ZpbmdlcnByaW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgc25hcCA9IGF3YWl0IGV4dHJhY3REb21TbmFwc2hvdChmcmFtZUlkKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBhZ2Vfc3RhdGVfaGFzaDogc25hcC5wYWdlX3N0YXRlX2hhc2gsXG4gICAgICAgIG9yaWdpbjogc25hcC51cmxfb3JpZ2luLFxuICAgICAgICBmcmFtZV9pZDogZnJhbWVJZCxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBidXMub24oJ3JlZ2lzdHJ5L3NldCcsIGFzeW5jIChwYXlsb2FkKSA9PiB7XG4gICAgICBlbGVtZW50UmVnaXN0cnkuc2V0UmVnaW9uTWFwcGluZyhwYXlsb2FkLm1hcHBpbmcpO1xuICAgICAgcmV0dXJuIHsgYXBwbGllZDogdHJ1ZSB9O1xuICAgIH0pO1xuXG4gICAgYnVzLm9uKCdhY3Rpb24vcmVzb2x2ZS10YXJnZXQnLCBhc3luYyAocGF5bG9hZCkgPT4ge1xuICAgICAgY29uc3QgZWwgPSBlbGVtZW50UmVnaXN0cnkuZ2V0QnlSZWdpb25JZChwYXlsb2FkLnJlZ2lvbl9pZCk7XG4gICAgICBpZiAoIWVsIHx8ICFlbC5pc0Nvbm5lY3RlZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGV4aXN0czogZmFsc2UsXG4gICAgICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICAgICAgaW50ZXJhY3RhYmxlOiBmYWxzZSxcbiAgICAgICAgICBvY2NsdWRlZDogZmFsc2UsXG4gICAgICAgICAgYmJveDogWzAsIDAsIDAsIDBdLFxuICAgICAgICAgIG9yaWdpbjogd2luZG93LmxvY2F0aW9uLm9yaWdpbixcbiAgICAgICAgICBmcmFtZV9pZDogZnJhbWVJZCxcbiAgICAgICAgICBzZW1hbnRpY190eXBlOiAndW5rbm93bicsXG4gICAgICAgICAgaW5wdXRfdHlwZTogbnVsbCxcbiAgICAgICAgICBpc19wYXNzd29yZDogZmFsc2UsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHZpc2libGUgPSBpc0VsZW1lbnRWaXNpYmxlKGVsKTtcbiAgICAgIGNvbnN0IGN4ID0gcmVjdC5sZWZ0ICsgcmVjdC53aWR0aCAvIDI7XG4gICAgICBjb25zdCBjeSA9IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgLyAyO1xuICAgICAgY29uc3Qgb2NjbHVkZWQgPSBpc0VsZW1lbnRPY2NsdWRlZChlbCwgY3gsIGN5KTtcbiAgICAgIGNvbnN0IGludGVyYWN0YWJsZSA9IHZpc2libGUgJiYgIShlbCBhcyBhbnkpLmRpc2FibGVkICYmICFvY2NsdWRlZDtcblxuICAgICAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgbGV0IGlucHV0VHlwZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgICBsZXQgaXNQYXNzd29yZCA9IGZhbHNlO1xuXG4gICAgICBpZiAodGFnID09PSAnaW5wdXQnKSB7XG4gICAgICAgIGlucHV0VHlwZSA9ICgoZWwgYXMgSFRNTElucHV0RWxlbWVudCkudHlwZSB8fCAndGV4dCcpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlzUGFzc3dvcmQgPSBpbnB1dFR5cGUgPT09ICdwYXNzd29yZCc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGV4aXN0czogdHJ1ZSxcbiAgICAgICAgdmlzaWJsZSxcbiAgICAgICAgaW50ZXJhY3RhYmxlLFxuICAgICAgICBvY2NsdWRlZCxcbiAgICAgICAgYmJveDogW1xuICAgICAgICAgIE1hdGgucm91bmQocmVjdC5sZWZ0KSxcbiAgICAgICAgICBNYXRoLnJvdW5kKHJlY3QudG9wKSxcbiAgICAgICAgICBNYXRoLnJvdW5kKHJlY3Qud2lkdGgpLFxuICAgICAgICAgIE1hdGgucm91bmQocmVjdC5oZWlnaHQpLFxuICAgICAgICBdLFxuICAgICAgICBvcmlnaW46IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sXG4gICAgICAgIGZyYW1lX2lkOiBmcmFtZUlkLFxuICAgICAgICBzZW1hbnRpY190eXBlOiBtYXBEb21Ub1NlbWFudGljVHlwZSh7XG4gICAgICAgICAgZG9tX2lkOiAnJyxcbiAgICAgICAgICBmcmFtZV9pZDogZnJhbWVJZCxcbiAgICAgICAgICBvcmlnaW46IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sXG4gICAgICAgICAgdGFnLFxuICAgICAgICAgIHJvbGU6IGVsLmdldEF0dHJpYnV0ZSgncm9sZScpLFxuICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgdGV4dDogZWwudGV4dENvbnRlbnQgfHwgJycsXG4gICAgICAgICAgYXJpYToge30sXG4gICAgICAgICAgYmJveDogWzAsIDAsIDAsIDBdLFxuICAgICAgICAgIHZpc2libGUsXG4gICAgICAgICAgaW5fdmlld3BvcnQ6IHRydWUsXG4gICAgICAgICAgb2NjbHVkZWQsXG4gICAgICAgICAgaW50ZXJhY3RhYmxlLFxuICAgICAgICAgIHJlbmRlcmluZzogJ2h0bWwnLFxuICAgICAgICAgIGhhc19iZ19pbWFnZTogZmFsc2UsXG4gICAgICAgICAgaGFuZGxlcnNfaGludDogZmFsc2UsXG4gICAgICAgICAgcGFyZW50X2RvbV9pZDogbnVsbCxcbiAgICAgICAgfSksXG4gICAgICAgIGlucHV0X3R5cGU6IGlucHV0VHlwZSxcbiAgICAgICAgaXNfcGFzc3dvcmQ6IGlzUGFzc3dvcmQsXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgYnVzLm9uKCdhY3Rpb24vZXhlY3V0ZScsIGFzeW5jIChwYXlsb2FkKSA9PiB7XG4gICAgICByZXR1cm4gZXhlY3V0ZUFjdGlvbihwYXlsb2FkLmFjdGlvbiwgcGF5bG9hZC5yZXNvbHZlZF9zZWNyZXQpO1xuICAgIH0pO1xuXG4gICAgYnVzLm9uKCd0ZXN0L2luamVjdC1kb20tY2hhbmdlJywgYXN5bmMgKHBheWxvYWQpID0+IHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZGl2LmlubmVySFRNTCA9IHBheWxvYWQuaHRtbDtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICAgIHJldHVybiB7IGluamVjdGVkOiB0cnVlIH07XG4gICAgfSk7XG4gIH0sXG59KTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiLCBbXCJtb2R1bGVcIl0sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZmFjdG9yeShtb2R1bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QpO1xuICAgIGdsb2JhbC5icm93c2VyID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsVGhpcyA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgLyogd2ViZXh0ZW5zaW9uLXBvbHlmaWxsIC0gdjAuMTIuMCAtIFR1ZSBNYXkgMTQgMjAyNCAxODowMToyOSAqL1xuICAvKiAtKi0gTW9kZTogaW5kZW50LXRhYnMtbW9kZTogbmlsOyBqcy1pbmRlbnQtbGV2ZWw6IDIgLSotICovXG4gIC8qIHZpbTogc2V0IHN0cz0yIHN3PTIgZXQgdHc9ODA6ICovXG4gIC8qIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAgICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICAgKiBmaWxlLCBZb3UgY2FuIG9idGFpbiBvbmUgYXQgaHR0cDovL21vemlsbGEub3JnL01QTC8yLjAvLiAqL1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBpZiAoIShnbG9iYWxUaGlzLmNocm9tZSAmJiBnbG9iYWxUaGlzLmNocm9tZS5ydW50aW1lICYmIGdsb2JhbFRoaXMuY2hyb21lLnJ1bnRpbWUuaWQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBzY3JpcHQgc2hvdWxkIG9ubHkgYmUgbG9hZGVkIGluIGEgYnJvd3NlciBleHRlbnNpb24uXCIpO1xuICB9XG4gIGlmICghKGdsb2JhbFRoaXMuYnJvd3NlciAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZSAmJiBnbG9iYWxUaGlzLmJyb3dzZXIucnVudGltZS5pZCkpIHtcbiAgICBjb25zdCBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UgPSBcIlRoZSBtZXNzYWdlIHBvcnQgY2xvc2VkIGJlZm9yZSBhIHJlc3BvbnNlIHdhcyByZWNlaXZlZC5cIjtcblxuICAgIC8vIFdyYXBwaW5nIHRoZSBidWxrIG9mIHRoaXMgcG9seWZpbGwgaW4gYSBvbmUtdGltZS11c2UgZnVuY3Rpb24gaXMgYSBtaW5vclxuICAgIC8vIG9wdGltaXphdGlvbiBmb3IgRmlyZWZveC4gU2luY2UgU3BpZGVybW9ua2V5IGRvZXMgbm90IGZ1bGx5IHBhcnNlIHRoZVxuICAgIC8vIGNvbnRlbnRzIG9mIGEgZnVuY3Rpb24gdW50aWwgdGhlIGZpcnN0IHRpbWUgaXQncyBjYWxsZWQsIGFuZCBzaW5jZSBpdCB3aWxsXG4gICAgLy8gbmV2ZXIgYWN0dWFsbHkgbmVlZCB0byBiZSBjYWxsZWQsIHRoaXMgYWxsb3dzIHRoZSBwb2x5ZmlsbCB0byBiZSBpbmNsdWRlZFxuICAgIC8vIGluIEZpcmVmb3ggbmVhcmx5IGZvciBmcmVlLlxuICAgIGNvbnN0IHdyYXBBUElzID0gZXh0ZW5zaW9uQVBJcyA9PiB7XG4gICAgICAvLyBOT1RFOiBhcGlNZXRhZGF0YSBpcyBhc3NvY2lhdGVkIHRvIHRoZSBjb250ZW50IG9mIHRoZSBhcGktbWV0YWRhdGEuanNvbiBmaWxlXG4gICAgICAvLyBhdCBidWlsZCB0aW1lIGJ5IHJlcGxhY2luZyB0aGUgZm9sbG93aW5nIFwiaW5jbHVkZVwiIHdpdGggdGhlIGNvbnRlbnQgb2YgdGhlXG4gICAgICAvLyBKU09OIGZpbGUuXG4gICAgICBjb25zdCBhcGlNZXRhZGF0YSA9IHtcbiAgICAgICAgXCJhbGFybXNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjbGVhckFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJvb2ttYXJrc1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDaGlsZHJlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFN1YlRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJicm93c2VyQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImRpc2FibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlbmFibGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuUG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZUJhY2tncm91bmRDb2xvclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEJhZGdlVGV4dFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NpbmdEYXRhXCI6IHtcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNhY2hlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ29va2llc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZURvd25sb2Fkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZvcm1EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlSGlzdG9yeVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUxvY2FsU3RvcmFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBhc3N3b3Jkc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVBsdWdpbkRhdGFcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbW1hbmRzXCI6IHtcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvbnRleHRNZW51c1wiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb29raWVzXCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbENvb2tpZVN0b3Jlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRldnRvb2xzXCI6IHtcbiAgICAgICAgICBcImluc3BlY3RlZFdpbmRvd1wiOiB7XG4gICAgICAgICAgICBcImV2YWxcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDIsXG4gICAgICAgICAgICAgIFwic2luZ2xlQ2FsbGJhY2tBcmdcIjogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicGFuZWxzXCI6IHtcbiAgICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDMsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVsZW1lbnRzXCI6IHtcbiAgICAgICAgICAgICAgXCJjcmVhdGVTaWRlYmFyUGFuZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkb3dubG9hZHNcIjoge1xuICAgICAgICAgIFwiY2FuY2VsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZG93bmxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJlcmFzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZpbGVJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhdXNlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlRmlsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlc3VtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNob3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJleHRlbnNpb25cIjoge1xuICAgICAgICAgIFwiaXNBbGxvd2VkRmlsZVNjaGVtZUFjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImlzQWxsb3dlZEluY29nbml0b0FjY2Vzc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImhpc3RvcnlcIjoge1xuICAgICAgICAgIFwiYWRkVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlUmFuZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWxldGVVcmxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRWaXNpdHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpMThuXCI6IHtcbiAgICAgICAgICBcImRldGVjdExhbmd1YWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWNjZXB0TGFuZ3VhZ2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRlbnRpdHlcIjoge1xuICAgICAgICAgIFwibGF1bmNoV2ViQXV0aEZsb3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpZGxlXCI6IHtcbiAgICAgICAgICBcInF1ZXJ5U3RhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYW5hZ2VtZW50XCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRFbmFibGVkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidW5pbnN0YWxsU2VsZlwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm5vdGlmaWNhdGlvbnNcIjoge1xuICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQZXJtaXNzaW9uTGV2ZWxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWdlQWN0aW9uXCI6IHtcbiAgICAgICAgICBcImdldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0SWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGVybWlzc2lvbnNcIjoge1xuICAgICAgICAgIFwiY29udGFpbnNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicnVudGltZVwiOiB7XG4gICAgICAgICAgXCJnZXRCYWNrZ3JvdW5kUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBsYXRmb3JtSW5mb1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5PcHRpb25zUGFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlcXVlc3RVcGRhdGVDaGVja1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmRNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE5hdGl2ZU1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRVbmluc3RhbGxVUkxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXNzaW9uc1wiOiB7XG4gICAgICAgICAgXCJnZXREZXZpY2VzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UmVjZW50bHlDbG9zZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN0b3JlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic3RvcmFnZVwiOiB7XG4gICAgICAgICAgXCJsb2NhbFwiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1hbmFnZWRcIjoge1xuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic3luY1wiOiB7XG4gICAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldEJ5dGVzSW5Vc2VcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInRhYnNcIjoge1xuICAgICAgICAgIFwiY2FwdHVyZVZpc2libGVUYWJcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRpc2NhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkdXBsaWNhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJleGVjdXRlU2NyaXB0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0JhY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnb0ZvcndhcmRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJoaWdobGlnaHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpbnNlcnRDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicXVlcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZWxvYWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDU1NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFpvb21cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tU2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0b3BTaXRlc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3ZWJOYXZpZ2F0aW9uXCI6IHtcbiAgICAgICAgICBcImdldEFsbEZyYW1lc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEZyYW1lXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViUmVxdWVzdFwiOiB7XG4gICAgICAgICAgXCJoYW5kbGVyQmVoYXZpb3JDaGFuZ2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2luZG93c1wiOiB7XG4gICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDdXJyZW50XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0TGFzdEZvY3VzZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhhcGlNZXRhZGF0YSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImFwaS1tZXRhZGF0YS5qc29uIGhhcyBub3QgYmVlbiBpbmNsdWRlZCBpbiBicm93c2VyLXBvbHlmaWxsXCIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEEgV2Vha01hcCBzdWJjbGFzcyB3aGljaCBjcmVhdGVzIGFuZCBzdG9yZXMgYSB2YWx1ZSBmb3IgYW55IGtleSB3aGljaCBkb2VzXG4gICAgICAgKiBub3QgZXhpc3Qgd2hlbiBhY2Nlc3NlZCwgYnV0IGJlaGF2ZXMgZXhhY3RseSBhcyBhbiBvcmRpbmFyeSBXZWFrTWFwXG4gICAgICAgKiBvdGhlcndpc2UuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY3JlYXRlSXRlbVxuICAgICAgICogICAgICAgIEEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSB2YWx1ZSBmb3IgYW55XG4gICAgICAgKiAgICAgICAga2V5IHdoaWNoIGRvZXMgbm90IGV4aXN0LCB0aGUgZmlyc3QgdGltZSBpdCBpcyBhY2Nlc3NlZC4gVGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gcmVjZWl2ZXMsIGFzIGl0cyBvbmx5IGFyZ3VtZW50LCB0aGUga2V5IGJlaW5nIGNyZWF0ZWQuXG4gICAgICAgKi9cbiAgICAgIGNsYXNzIERlZmF1bHRXZWFrTWFwIGV4dGVuZHMgV2Vha01hcCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKGNyZWF0ZUl0ZW0sIGl0ZW1zID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgc3VwZXIoaXRlbXMpO1xuICAgICAgICAgIHRoaXMuY3JlYXRlSXRlbSA9IGNyZWF0ZUl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgZ2V0KGtleSkge1xuICAgICAgICAgIGlmICghdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB0aGlzLmNyZWF0ZUl0ZW0oa2V5KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBzdXBlci5nZXQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIG9iamVjdCB3aXRoIGEgYHRoZW5gIG1ldGhvZCwgYW5kIGNhblxuICAgICAgICogdGhlcmVmb3JlIGJlIGFzc3VtZWQgdG8gYmVoYXZlIGFzIGEgUHJvbWlzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB0ZXN0LlxuICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZW5hYmxlLlxuICAgICAgICovXG4gICAgICBjb25zdCBpc1RoZW5hYmxlID0gdmFsdWUgPT4ge1xuICAgICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB3aGljaCwgd2hlbiBjYWxsZWQsIHdpbGwgcmVzb2x2ZSBvciByZWplY3RcbiAgICAgICAqIHRoZSBnaXZlbiBwcm9taXNlIGJhc2VkIG9uIGhvdyBpdCBpcyBjYWxsZWQ6XG4gICAgICAgKlxuICAgICAgICogLSBJZiwgd2hlbiBjYWxsZWQsIGBjaHJvbWUucnVudGltZS5sYXN0RXJyb3JgIGNvbnRhaW5zIGEgbm9uLW51bGwgb2JqZWN0LFxuICAgICAgICogICB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCB3aXRoIHRoYXQgdmFsdWUuXG4gICAgICAgKiAtIElmIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBleGFjdGx5IG9uZSBhcmd1bWVudCwgdGhlIHByb21pc2UgaXNcbiAgICAgICAqICAgcmVzb2x2ZWQgdG8gdGhhdCB2YWx1ZS5cbiAgICAgICAqIC0gT3RoZXJ3aXNlLCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB0byBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGVcbiAgICAgICAqICAgZnVuY3Rpb24ncyBhcmd1bWVudHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHByb21pc2VcbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgcmVzb2x1dGlvbiBhbmQgcmVqZWN0aW9uIGZ1bmN0aW9ucyBvZiBhXG4gICAgICAgKiAgICAgICAgcHJvbWlzZS5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVzb2x2ZVxuICAgICAgICogICAgICAgIFRoZSBwcm9taXNlJ3MgcmVzb2x1dGlvbiBmdW5jdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHByb21pc2UucmVqZWN0XG4gICAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZWplY3Rpb24gZnVuY3Rpb24uXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgd3JhcHBlZCBtZXRob2Qgd2hpY2ggaGFzIGNyZWF0ZWQgdGhlIGNhbGxiYWNrLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZ1xuICAgICAgICogICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggb25seSB0aGUgZmlyc3RcbiAgICAgICAqICAgICAgICBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2ssIGFsdGVybmF0aXZlbHkgYW4gYXJyYXkgb2YgYWxsIHRoZVxuICAgICAgICogICAgICAgIGNhbGxiYWNrIGFyZ3VtZW50cyBpcyByZXNvbHZlZC4gQnkgZGVmYXVsdCwgaWYgdGhlIGNhbGxiYWNrXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoYXQgd2lsbCBiZVxuICAgICAgICogICAgICAgIHJlc29sdmVkIHRvIHRoZSBwcm9taXNlLCB3aGlsZSBhbGwgYXJndW1lbnRzIHdpbGwgYmUgcmVzb2x2ZWQgYXNcbiAgICAgICAqICAgICAgICBhbiBhcnJheSBpZiBtdWx0aXBsZSBhcmUgZ2l2ZW4uXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2Z1bmN0aW9ufVxuICAgICAgICogICAgICAgIFRoZSBnZW5lcmF0ZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IG1ha2VDYWxsYmFjayA9IChwcm9taXNlLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gKC4uLmNhbGxiYWNrQXJncykgPT4ge1xuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyB8fCBjYWxsYmFja0FyZ3MubGVuZ3RoIDw9IDEgJiYgbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoY2FsbGJhY2tBcmdzWzBdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHBsdXJhbGl6ZUFyZ3VtZW50cyA9IG51bUFyZ3MgPT4gbnVtQXJncyA9PSAxID8gXCJhcmd1bWVudFwiIDogXCJhcmd1bWVudHNcIjtcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgd3JhcHBlciBmdW5jdGlvbiBmb3IgYSBtZXRob2Qgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBhbmQgbWV0YWRhdGEuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgICAqICAgICAgICBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHdoaWNoIGlzIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gbWV0YWRhdGFcbiAgICAgICAqICAgICAgICBNZXRhZGF0YSBhYm91dCB0aGUgbWV0aG9kIGJlaW5nIHdyYXBwZWQuXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1pbkFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWluaW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG11c3QgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBmZXdlciB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWF4QXJnc1xuICAgICAgICogICAgICAgIFRoZSBtYXhpbXVtIG51bWJlciBvZiBhcmd1bWVudHMgd2hpY2ggbWF5IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggbW9yZSB0aGFuIHRoaXMgbnVtYmVyIG9mIGFyZ3VtZW50cywgdGhlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihvYmplY3QsIC4uLiopfVxuICAgICAgICogICAgICAgVGhlIGdlbmVyYXRlZCB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgICAgICovXG4gICAgICBjb25zdCB3cmFwQXN5bmNGdW5jdGlvbiA9IChuYW1lLCBtZXRhZGF0YSkgPT4ge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYXN5bmNGdW5jdGlvbldyYXBwZXIodGFyZ2V0LCAuLi5hcmdzKSB7XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1ldGFkYXRhLmZhbGxiYWNrVG9Ob0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgQVBJIG1ldGhvZCBoYXMgY3VycmVudGx5IG5vIGNhbGxiYWNrIG9uIENocm9tZSwgYnV0IGl0IHJldHVybiBhIHByb21pc2Ugb24gRmlyZWZveCxcbiAgICAgICAgICAgICAgLy8gYW5kIHNvIHRoZSBwb2x5ZmlsbCB3aWxsIHRyeSB0byBjYWxsIGl0IHdpdGggYSBjYWxsYmFjayBmaXJzdCwgYW5kIGl0IHdpbGwgZmFsbGJhY2tcbiAgICAgICAgICAgICAgLy8gdG8gbm90IHBhc3NpbmcgdGhlIGNhbGxiYWNrIGlmIHRoZSBmaXJzdCBjYWxsIGZhaWxzLlxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgICAgIH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGNiRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYCR7bmFtZX0gQVBJIG1ldGhvZCBkb2Vzbid0IHNlZW0gdG8gc3VwcG9ydCB0aGUgY2FsbGJhY2sgcGFyYW1ldGVyLCBgICsgXCJmYWxsaW5nIGJhY2sgdG8gY2FsbCBpdCB3aXRob3V0IGEgY2FsbGJhY2s6IFwiLCBjYkVycm9yKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIEFQSSBtZXRob2QgbWV0YWRhdGEsIHNvIHRoYXQgdGhlIG5leHQgQVBJIGNhbGxzIHdpbGwgbm90IHRyeSB0b1xuICAgICAgICAgICAgICAgIC8vIHVzZSB0aGUgdW5zdXBwb3J0ZWQgY2FsbGJhY2sgYW55bW9yZS5cbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG1ldGFkYXRhLm5vQ2FsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhZGF0YS5ub0NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gZXhpc3RpbmcgbWV0aG9kIG9mIHRoZSB0YXJnZXQgb2JqZWN0LCBzbyB0aGF0IGNhbGxzIHRvIGl0IGFyZVxuICAgICAgICogaW50ZXJjZXB0ZWQgYnkgdGhlIGdpdmVuIHdyYXBwZXIgZnVuY3Rpb24uIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHJlY2VpdmVzLFxuICAgICAgICogYXMgaXRzIGZpcnN0IGFyZ3VtZW50LCB0aGUgb3JpZ2luYWwgYHRhcmdldGAgb2JqZWN0LCBmb2xsb3dlZCBieSBlYWNoIG9mXG4gICAgICAgKiB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgb3JpZ2luYWwgdGFyZ2V0IG9iamVjdCB0aGF0IHRoZSB3cmFwcGVkIG1ldGhvZCBiZWxvbmdzIHRvLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbWV0aG9kXG4gICAgICAgKiAgICAgICAgVGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLiBUaGlzIGlzIHVzZWQgYXMgdGhlIHRhcmdldCBvZiB0aGUgUHJveHlcbiAgICAgICAqICAgICAgICBvYmplY3Qgd2hpY2ggaXMgY3JlYXRlZCB0byB3cmFwIHRoZSBtZXRob2QuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgVGhlIHdyYXBwZXIgZnVuY3Rpb24gd2hpY2ggaXMgY2FsbGVkIGluIHBsYWNlIG9mIGEgZGlyZWN0IGludm9jYXRpb25cbiAgICAgICAqICAgICAgICBvZiB0aGUgd3JhcHBlZCBtZXRob2QuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PGZ1bmN0aW9uPn1cbiAgICAgICAqICAgICAgICBBIFByb3h5IG9iamVjdCBmb3IgdGhlIGdpdmVuIG1ldGhvZCwgd2hpY2ggaW52b2tlcyB0aGUgZ2l2ZW4gd3JhcHBlclxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiBpdHMgcGxhY2UuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBNZXRob2QgPSAodGFyZ2V0LCBtZXRob2QsIHdyYXBwZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShtZXRob2QsIHtcbiAgICAgICAgICBhcHBseSh0YXJnZXRNZXRob2QsIHRoaXNPYmosIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB3cmFwcGVyLmNhbGwodGhpc09iaiwgdGFyZ2V0LCAuLi5hcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGxldCBoYXNPd25Qcm9wZXJ0eSA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhbiBvYmplY3QgaW4gYSBQcm94eSB3aGljaCBpbnRlcmNlcHRzIGFuZCB3cmFwcyBjZXJ0YWluIG1ldGhvZHNcbiAgICAgICAqIGJhc2VkIG9uIHRoZSBnaXZlbiBgd3JhcHBlcnNgIGFuZCBgbWV0YWRhdGFgIG9iamVjdHMuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICAgICAgICogICAgICAgIFRoZSB0YXJnZXQgb2JqZWN0IHRvIHdyYXAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IFt3cmFwcGVycyA9IHt9XVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCB0cmVlIGNvbnRhaW5pbmcgd3JhcHBlciBmdW5jdGlvbnMgZm9yIHNwZWNpYWwgY2FzZXMuIEFueVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHByZXNlbnQgaW4gdGhpcyBvYmplY3QgdHJlZSBpcyBjYWxsZWQgaW4gcGxhY2Ugb2YgdGhlXG4gICAgICAgKiAgICAgICAgbWV0aG9kIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZS4gVGhlc2VcbiAgICAgICAqICAgICAgICB3cmFwcGVyIG1ldGhvZHMgYXJlIGludm9rZWQgYXMgZGVzY3JpYmVkIGluIHtAc2VlIHdyYXBNZXRob2R9LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbbWV0YWRhdGEgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIG1ldGFkYXRhIHVzZWQgdG8gYXV0b21hdGljYWxseSBnZW5lcmF0ZVxuICAgICAgICogICAgICAgIFByb21pc2UtYmFzZWQgd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFzeW5jaHJvbm91cy4gQW55IGZ1bmN0aW9uIGluXG4gICAgICAgKiAgICAgICAgdGhlIGB0YXJnZXRgIG9iamVjdCB0cmVlIHdoaWNoIGhhcyBhIGNvcnJlc3BvbmRpbmcgbWV0YWRhdGEgb2JqZWN0XG4gICAgICAgKiAgICAgICAgaW4gdGhlIHNhbWUgbG9jYXRpb24gaW4gdGhlIGBtZXRhZGF0YWAgdHJlZSBpcyByZXBsYWNlZCB3aXRoIGFuXG4gICAgICAgKiAgICAgICAgYXV0b21hdGljYWxseS1nZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbiwgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgKiAgICAgICAge0BzZWUgd3JhcEFzeW5jRnVuY3Rpb259XG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge1Byb3h5PG9iamVjdD59XG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBPYmplY3QgPSAodGFyZ2V0LCB3cmFwcGVycyA9IHt9LCBtZXRhZGF0YSA9IHt9KSA9PiB7XG4gICAgICAgIGxldCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGxldCBoYW5kbGVycyA9IHtcbiAgICAgICAgICBoYXMocHJveHlUYXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldCB8fCBwcm9wIGluIGNhY2hlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0KHByb3h5VGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgICAgaWYgKHByb3AgaW4gY2FjaGUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEocHJvcCBpbiB0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCBvbiB0aGUgdW5kZXJseWluZyBvYmplY3QuIENoZWNrIGlmIHdlIG5lZWQgdG8gZG9cbiAgICAgICAgICAgICAgLy8gYW55IHdyYXBwaW5nLlxuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygd3JhcHBlcnNbcHJvcF0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBzcGVjaWFsLWNhc2Ugd3JhcHBlciBmb3IgdGhpcyBtZXRob2QuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwTWV0aG9kKHRhcmdldCwgdGFyZ2V0W3Byb3BdLCB3cmFwcGVyc1twcm9wXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBhc3luYyBtZXRob2QgdGhhdCB3ZSBoYXZlIG1ldGFkYXRhIGZvci4gQ3JlYXRlIGFcbiAgICAgICAgICAgICAgICAvLyBQcm9taXNlIHdyYXBwZXIgZm9yIGl0LlxuICAgICAgICAgICAgICAgIGxldCB3cmFwcGVyID0gd3JhcEFzeW5jRnVuY3Rpb24ocHJvcCwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG1ldGhvZCB0aGF0IHdlIGRvbid0IGtub3cgb3IgY2FyZSBhYm91dC4gUmV0dXJuIHRoZVxuICAgICAgICAgICAgICAgIC8vIG9yaWdpbmFsIG1ldGhvZCwgYm91bmQgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAoaGFzT3duUHJvcGVydHkod3JhcHBlcnMsIHByb3ApIHx8IGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkpIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBvYmplY3QgdGhhdCB3ZSBuZWVkIHRvIGRvIHNvbWUgd3JhcHBpbmcgZm9yIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgICAvLyBvZi4gQ3JlYXRlIGEgc3ViLW9iamVjdCB3cmFwcGVyIGZvciBpdCB3aXRoIHRoZSBhcHByb3ByaWF0ZSBjaGlsZFxuICAgICAgICAgICAgICAvLyBtZXRhZGF0YS5cbiAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbcHJvcF0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgXCIqXCIpKSB7XG4gICAgICAgICAgICAgIC8vIFdyYXAgYWxsIHByb3BlcnRpZXMgaW4gKiBuYW1lc3BhY2UuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW1wiKlwiXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIGRvIGFueSB3cmFwcGluZyBmb3IgdGhpcyBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgLy8gc28ganVzdCBmb3J3YXJkIGFsbCBhY2Nlc3MgdG8gdGhlIHVuZGVybHlpbmcgb2JqZWN0LlxuICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0KHByb3h5VGFyZ2V0LCBwcm9wLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wIGluIGNhY2hlKSB7XG4gICAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVmaW5lUHJvcGVydHkocHJveHlUYXJnZXQsIHByb3AsIGRlc2MpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCBkZXNjKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlbGV0ZVByb3BlcnR5KHByb3h5VGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWxldGVQcm9wZXJ0eShjYWNoZSwgcHJvcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFBlciBjb250cmFjdCBvZiB0aGUgUHJveHkgQVBJLCB0aGUgXCJnZXRcIiBwcm94eSBoYW5kbGVyIG11c3QgcmV0dXJuIHRoZVxuICAgICAgICAvLyBvcmlnaW5hbCB2YWx1ZSBvZiB0aGUgdGFyZ2V0IGlmIHRoYXQgdmFsdWUgaXMgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZFxuICAgICAgICAvLyBub24tY29uZmlndXJhYmxlLiBGb3IgdGhpcyByZWFzb24sIHdlIGNyZWF0ZSBhbiBvYmplY3Qgd2l0aCB0aGVcbiAgICAgICAgLy8gcHJvdG90eXBlIHNldCB0byBgdGFyZ2V0YCBpbnN0ZWFkIG9mIHVzaW5nIGB0YXJnZXRgIGRpcmVjdGx5LlxuICAgICAgICAvLyBPdGhlcndpc2Ugd2UgY2Fubm90IHJldHVybiBhIGN1c3RvbSBvYmplY3QgZm9yIEFQSXMgdGhhdFxuICAgICAgICAvLyBhcmUgZGVjbGFyZWQgcmVhZC1vbmx5IGFuZCBub24tY29uZmlndXJhYmxlLCBzdWNoIGFzIGBjaHJvbWUuZGV2dG9vbHNgLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGUgcHJveHkgaGFuZGxlcnMgdGhlbXNlbHZlcyB3aWxsIHN0aWxsIHVzZSB0aGUgb3JpZ2luYWwgYHRhcmdldGBcbiAgICAgICAgLy8gaW5zdGVhZCBvZiB0aGUgYHByb3h5VGFyZ2V0YCwgc28gdGhhdCB0aGUgbWV0aG9kcyBhbmQgcHJvcGVydGllcyBhcmVcbiAgICAgICAgLy8gZGVyZWZlcmVuY2VkIHZpYSB0aGUgb3JpZ2luYWwgdGFyZ2V0cy5cbiAgICAgICAgbGV0IHByb3h5VGFyZ2V0ID0gT2JqZWN0LmNyZWF0ZSh0YXJnZXQpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHByb3h5VGFyZ2V0LCBoYW5kbGVycyk7XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYSBzZXQgb2Ygd3JhcHBlciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IG9iamVjdCwgd2hpY2ggaGFuZGxlc1xuICAgICAgICogd3JhcHBpbmcgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRoYXQgdGhvc2UgbWVzc2FnZXMgYXJlIHBhc3NlZC5cbiAgICAgICAqXG4gICAgICAgKiBBIHNpbmdsZSB3cmFwcGVyIGlzIGNyZWF0ZWQgZm9yIGVhY2ggbGlzdGVuZXIgZnVuY3Rpb24sIGFuZCBzdG9yZWQgaW4gYVxuICAgICAgICogbWFwLiBTdWJzZXF1ZW50IGNhbGxzIHRvIGBhZGRMaXN0ZW5lcmAsIGBoYXNMaXN0ZW5lcmAsIG9yIGByZW1vdmVMaXN0ZW5lcmBcbiAgICAgICAqIHJldHJpZXZlIHRoZSBvcmlnaW5hbCB3cmFwcGVyLCBzbyB0aGF0ICBhdHRlbXB0cyB0byByZW1vdmUgYVxuICAgICAgICogcHJldmlvdXNseS1hZGRlZCBsaXN0ZW5lciB3b3JrIGFzIGV4cGVjdGVkLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RGVmYXVsdFdlYWtNYXA8ZnVuY3Rpb24sIGZ1bmN0aW9uPn0gd3JhcHBlck1hcFxuICAgICAgICogICAgICAgIEEgRGVmYXVsdFdlYWtNYXAgb2JqZWN0IHdoaWNoIHdpbGwgY3JlYXRlIHRoZSBhcHByb3ByaWF0ZSB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgZm9yIGEgZ2l2ZW4gbGlzdGVuZXIgZnVuY3Rpb24gd2hlbiBvbmUgZG9lcyBub3QgZXhpc3QsIGFuZCByZXRyaWV2ZVxuICAgICAgICogICAgICAgIGFuIGV4aXN0aW5nIG9uZSB3aGVuIGl0IGRvZXMuXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgICAqL1xuICAgICAgY29uc3Qgd3JhcEV2ZW50ID0gd3JhcHBlck1hcCA9PiAoe1xuICAgICAgICBhZGRMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyLCAuLi5hcmdzKSB7XG4gICAgICAgICAgdGFyZ2V0LmFkZExpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSwgLi4uYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIGhhc0xpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0Lmhhc0xpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZUxpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIpIHtcbiAgICAgICAgICB0YXJnZXQucmVtb3ZlTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzID0gbmV3IERlZmF1bHRXZWFrTWFwKGxpc3RlbmVyID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXBzIGFuIG9uUmVxdWVzdEZpbmlzaGVkIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgd2lsbCByZXR1cm4gYVxuICAgICAgICAgKiBgZ2V0Q29udGVudCgpYCBwcm9wZXJ0eSB3aGljaCByZXR1cm5zIGEgYFByb21pc2VgIHJhdGhlciB0aGFuIHVzaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2sgQVBJLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxXG4gICAgICAgICAqICAgICAgICBUaGUgSEFSIGVudHJ5IG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5ldHdvcmsgcmVxdWVzdC5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvblJlcXVlc3RGaW5pc2hlZChyZXEpIHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkUmVxID0gd3JhcE9iamVjdChyZXEsIHt9IC8qIHdyYXBwZXJzICovLCB7XG4gICAgICAgICAgICBnZXRDb250ZW50OiB7XG4gICAgICAgICAgICAgIG1pbkFyZ3M6IDAsXG4gICAgICAgICAgICAgIG1heEFyZ3M6IDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0ZW5lcih3cmFwcGVkUmVxKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgb25NZXNzYWdlV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYSBtZXNzYWdlIGxpc3RlbmVyIGZ1bmN0aW9uIHNvIHRoYXQgaXQgbWF5IHNlbmQgcmVzcG9uc2VzIGJhc2VkIG9uXG4gICAgICAgICAqIGl0cyByZXR1cm4gdmFsdWUsIHJhdGhlciB0aGFuIGJ5IHJldHVybmluZyBhIHNlbnRpbmVsIHZhbHVlIGFuZCBjYWxsaW5nIGFcbiAgICAgICAgICogY2FsbGJhY2suIElmIHRoZSBsaXN0ZW5lciBmdW5jdGlvbiByZXR1cm5zIGEgUHJvbWlzZSwgdGhlIHJlc3BvbnNlIGlzXG4gICAgICAgICAqIHNlbnQgd2hlbiB0aGUgcHJvbWlzZSBlaXRoZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHsqfSBtZXNzYWdlXG4gICAgICAgICAqICAgICAgICBUaGUgbWVzc2FnZSBzZW50IGJ5IHRoZSBvdGhlciBlbmQgb2YgdGhlIGNoYW5uZWwuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzZW5kZXJcbiAgICAgICAgICogICAgICAgIERldGFpbHMgYWJvdXQgdGhlIHNlbmRlciBvZiB0aGUgbWVzc2FnZS5cbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbigqKX0gc2VuZFJlc3BvbnNlXG4gICAgICAgICAqICAgICAgICBBIGNhbGxiYWNrIHdoaWNoLCB3aGVuIGNhbGxlZCB3aXRoIGFuIGFyYml0cmFyeSBhcmd1bWVudCwgc2VuZHNcbiAgICAgICAgICogICAgICAgIHRoYXQgdmFsdWUgYXMgYSByZXNwb25zZS5cbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqICAgICAgICBUcnVlIGlmIHRoZSB3cmFwcGVkIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBsYXRlclxuICAgICAgICAgKiAgICAgICAgeWllbGQgYSByZXNwb25zZS4gRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uTWVzc2FnZShtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICAgICAgICAgIGxldCBkaWRDYWxsU2VuZFJlc3BvbnNlID0gZmFsc2U7XG4gICAgICAgICAgbGV0IHdyYXBwZWRTZW5kUmVzcG9uc2U7XG4gICAgICAgICAgbGV0IHNlbmRSZXNwb25zZVByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIHdyYXBwZWRTZW5kUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IHRydWU7XG4gICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHQgPSBsaXN0ZW5lcihtZXNzYWdlLCBzZW5kZXIsIHdyYXBwZWRTZW5kUmVzcG9uc2UpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVzdWx0ID0gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaXNSZXN1bHRUaGVuYWJsZSA9IHJlc3VsdCAhPT0gdHJ1ZSAmJiBpc1RoZW5hYmxlKHJlc3VsdCk7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgZGlkbid0IHJldHVybmVkIHRydWUgb3IgYSBQcm9taXNlLCBvciBjYWxsZWRcbiAgICAgICAgICAvLyB3cmFwcGVkU2VuZFJlc3BvbnNlIHN5bmNocm9ub3VzbHksIHdlIGNhbiBleGl0IGVhcmxpZXJcbiAgICAgICAgICAvLyBiZWNhdXNlIHRoZXJlIHdpbGwgYmUgbm8gcmVzcG9uc2Ugc2VudCBmcm9tIHRoaXMgbGlzdGVuZXIuXG4gICAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSAmJiAhaXNSZXN1bHRUaGVuYWJsZSAmJiAhZGlkQ2FsbFNlbmRSZXNwb25zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEEgc21hbGwgaGVscGVyIHRvIHNlbmQgdGhlIG1lc3NhZ2UgaWYgdGhlIHByb21pc2UgcmVzb2x2ZXNcbiAgICAgICAgICAvLyBhbmQgYW4gZXJyb3IgaWYgdGhlIHByb21pc2UgcmVqZWN0cyAoYSB3cmFwcGVkIHNlbmRNZXNzYWdlIGhhc1xuICAgICAgICAgIC8vIHRvIHRyYW5zbGF0ZSB0aGUgbWVzc2FnZSBpbnRvIGEgcmVzb2x2ZWQgcHJvbWlzZSBvciBhIHJlamVjdGVkXG4gICAgICAgICAgLy8gcHJvbWlzZSkuXG4gICAgICAgICAgY29uc3Qgc2VuZFByb21pc2VkUmVzdWx0ID0gcHJvbWlzZSA9PiB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4obXNnID0+IHtcbiAgICAgICAgICAgICAgLy8gc2VuZCB0aGUgbWVzc2FnZSB2YWx1ZS5cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKG1zZyk7XG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIC8vIFNlbmQgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpZiB0aGUgcmVqZWN0ZWQgdmFsdWVcbiAgICAgICAgICAgICAgLy8gaXMgYW4gaW5zdGFuY2Ugb2YgZXJyb3IsIG9yIHRoZSBvYmplY3QgaXRzZWxmIG90aGVyd2lzZS5cbiAgICAgICAgICAgICAgbGV0IG1lc3NhZ2U7XG4gICAgICAgICAgICAgIGlmIChlcnJvciAmJiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciB8fCB0eXBlb2YgZXJyb3IubWVzc2FnZSA9PT0gXCJzdHJpbmdcIikpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICBfX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X186IHRydWUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIC8vIFByaW50IGFuIGVycm9yIG9uIHRoZSBjb25zb2xlIGlmIHVuYWJsZSB0byBzZW5kIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBzZW5kIG9uTWVzc2FnZSByZWplY3RlZCByZXBseVwiLCBlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHNlbmQgdGhlIHJlc29sdmVkIHZhbHVlIGFzIGFcbiAgICAgICAgICAvLyByZXN1bHQsIG90aGVyd2lzZSB3YWl0IHRoZSBwcm9taXNlIHJlbGF0ZWQgdG8gdGhlIHdyYXBwZWRTZW5kUmVzcG9uc2VcbiAgICAgICAgICAvLyBjYWxsYmFjayB0byByZXNvbHZlIGFuZCBzZW5kIGl0IGFzIGEgcmVzcG9uc2UuXG4gICAgICAgICAgaWYgKGlzUmVzdWx0VGhlbmFibGUpIHtcbiAgICAgICAgICAgIHNlbmRQcm9taXNlZFJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQoc2VuZFJlc3BvbnNlUHJvbWlzZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTGV0IENocm9tZSBrbm93IHRoYXQgdGhlIGxpc3RlbmVyIGlzIHJlcGx5aW5nLlxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjayA9ICh7XG4gICAgICAgIHJlamVjdCxcbiAgICAgICAgcmVzb2x2ZVxuICAgICAgfSwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAvLyBEZXRlY3Qgd2hlbiBub25lIG9mIHRoZSBsaXN0ZW5lcnMgcmVwbGllZCB0byB0aGUgc2VuZE1lc3NhZ2UgY2FsbCBhbmQgcmVzb2x2ZVxuICAgICAgICAgIC8vIHRoZSBwcm9taXNlIHRvIHVuZGVmaW5lZCBhcyBpbiBGaXJlZm94LlxuICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS93ZWJleHRlbnNpb24tcG9seWZpbGwvaXNzdWVzLzEzMFxuICAgICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UgPT09IENIUk9NRV9TRU5EX01FU1NBR0VfQ0FMTEJBQ0tfTk9fUkVTUE9OU0VfTUVTU0FHRSkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZXBseSAmJiByZXBseS5fX21veldlYkV4dGVuc2lvblBvbHlmaWxsUmVqZWN0X18pIHtcbiAgICAgICAgICAvLyBDb252ZXJ0IGJhY2sgdGhlIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGludG9cbiAgICAgICAgICAvLyBhbiBFcnJvciBpbnN0YW5jZS5cbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKHJlcGx5Lm1lc3NhZ2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHdyYXBwZWRTZW5kTWVzc2FnZSA9IChuYW1lLCBtZXRhZGF0YSwgYXBpTmFtZXNwYWNlT2JqLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IGxlYXN0ICR7bWV0YWRhdGEubWluQXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWluQXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBjb25zdCB3cmFwcGVkQ2IgPSB3cmFwcGVkU2VuZE1lc3NhZ2VDYWxsYmFjay5iaW5kKG51bGwsIHtcbiAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICByZWplY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBhcmdzLnB1c2god3JhcHBlZENiKTtcbiAgICAgICAgICBhcGlOYW1lc3BhY2VPYmouc2VuZE1lc3NhZ2UoLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YXRpY1dyYXBwZXJzID0ge1xuICAgICAgICBkZXZ0b29sczoge1xuICAgICAgICAgIG5ldHdvcms6IHtcbiAgICAgICAgICAgIG9uUmVxdWVzdEZpbmlzaGVkOiB3cmFwRXZlbnQob25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycylcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJ1bnRpbWU6IHtcbiAgICAgICAgICBvbk1lc3NhZ2U6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgb25NZXNzYWdlRXh0ZXJuYWw6IHdyYXBFdmVudChvbk1lc3NhZ2VXcmFwcGVycyksXG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB0YWJzOiB7XG4gICAgICAgICAgc2VuZE1lc3NhZ2U6IHdyYXBwZWRTZW5kTWVzc2FnZS5iaW5kKG51bGwsIFwic2VuZE1lc3NhZ2VcIiwge1xuICAgICAgICAgICAgbWluQXJnczogMixcbiAgICAgICAgICAgIG1heEFyZ3M6IDNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgc2V0dGluZ01ldGFkYXRhID0ge1xuICAgICAgICBjbGVhcjoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9LFxuICAgICAgICBnZXQ6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBhcGlNZXRhZGF0YS5wcml2YWN5ID0ge1xuICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9LFxuICAgICAgICBzZXJ2aWNlczoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgd2Vic2l0ZXM6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gd3JhcE9iamVjdChleHRlbnNpb25BUElzLCBzdGF0aWNXcmFwcGVycywgYXBpTWV0YWRhdGEpO1xuICAgIH07XG5cbiAgICAvLyBUaGUgYnVpbGQgcHJvY2VzcyBhZGRzIGEgVU1EIHdyYXBwZXIgYXJvdW5kIHRoaXMgZmlsZSwgd2hpY2ggbWFrZXMgdGhlXG4gICAgLy8gYG1vZHVsZWAgdmFyaWFibGUgYXZhaWxhYmxlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gd3JhcEFQSXMoY2hyb21lKTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGdsb2JhbFRoaXMuYnJvd3NlcjtcbiAgfVxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1icm93c2VyLXBvbHlmaWxsLmpzLm1hcFxuIiwiaW1wb3J0IG9yaWdpbmFsQnJvd3NlciBmcm9tIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IG9yaWdpbmFsQnJvd3NlcjtcbiIsImZ1bmN0aW9uIHByaW50KG1ldGhvZCwgLi4uYXJncykge1xuICBpZiAoaW1wb3J0Lm1ldGEuZW52Lk1PREUgPT09IFwicHJvZHVjdGlvblwiKSByZXR1cm47XG4gIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gXCJzdHJpbmdcIikge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBhcmdzLnNoaWZ0KCk7XG4gICAgbWV0aG9kKGBbd3h0XSAke21lc3NhZ2V9YCwgLi4uYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgbWV0aG9kKFwiW3d4dF1cIiwgLi4uYXJncyk7XG4gIH1cbn1cbmV4cG9ydCBjb25zdCBsb2dnZXIgPSB7XG4gIGRlYnVnOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5kZWJ1ZywgLi4uYXJncyksXG4gIGxvZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUubG9nLCAuLi5hcmdzKSxcbiAgd2FybjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUud2FybiwgLi4uYXJncyksXG4gIGVycm9yOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5lcnJvciwgLi4uYXJncylcbn07XG4iLCJpbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG5leHBvcnQgY2xhc3MgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCBleHRlbmRzIEV2ZW50IHtcbiAgY29uc3RydWN0b3IobmV3VXJsLCBvbGRVcmwpIHtcbiAgICBzdXBlcihXeHRMb2NhdGlvbkNoYW5nZUV2ZW50LkVWRU5UX05BTUUsIHt9KTtcbiAgICB0aGlzLm5ld1VybCA9IG5ld1VybDtcbiAgICB0aGlzLm9sZFVybCA9IG9sZFVybDtcbiAgfVxuICBzdGF0aWMgRVZFTlRfTkFNRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcInd4dDpsb2NhdGlvbmNoYW5nZVwiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRVbmlxdWVFdmVudE5hbWUoZXZlbnROYW1lKSB7XG4gIHJldHVybiBgJHticm93c2VyPy5ydW50aW1lPy5pZH06JHtpbXBvcnQubWV0YS5lbnYuRU5UUllQT0lOVH06JHtldmVudE5hbWV9YDtcbn1cbiIsImltcG9ydCB7IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgfSBmcm9tIFwiLi9jdXN0b20tZXZlbnRzLm1qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcihjdHgpIHtcbiAgbGV0IGludGVydmFsO1xuICBsZXQgb2xkVXJsO1xuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIEVuc3VyZSB0aGUgbG9jYXRpb24gd2F0Y2hlciBpcyBhY3RpdmVseSBsb29raW5nIGZvciBVUkwgY2hhbmdlcy4gSWYgaXQncyBhbHJlYWR5IHdhdGNoaW5nLFxuICAgICAqIHRoaXMgaXMgYSBub29wLlxuICAgICAqL1xuICAgIHJ1bigpIHtcbiAgICAgIGlmIChpbnRlcnZhbCAhPSBudWxsKSByZXR1cm47XG4gICAgICBvbGRVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuICAgICAgaW50ZXJ2YWwgPSBjdHguc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBsZXQgbmV3VXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgaWYgKG5ld1VybC5ocmVmICE9PSBvbGRVcmwuaHJlZikge1xuICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50KG5ld1VybCwgb2xkVXJsKSk7XG4gICAgICAgICAgb2xkVXJsID0gbmV3VXJsO1xuICAgICAgICB9XG4gICAgICB9LCAxZTMpO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IGJyb3dzZXIgfSBmcm9tIFwid3h0L2Jyb3dzZXJcIjtcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCIuLi8uLi9zYW5kYm94L3V0aWxzL2xvZ2dlci5tanNcIjtcbmltcG9ydCB7IGdldFVuaXF1ZUV2ZW50TmFtZSB9IGZyb20gXCIuL2N1c3RvbS1ldmVudHMubWpzXCI7XG5pbXBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfSBmcm9tIFwiLi9sb2NhdGlvbi13YXRjaGVyLm1qc1wiO1xuZXhwb3J0IGNsYXNzIENvbnRlbnRTY3JpcHRDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoY29udGVudFNjcmlwdE5hbWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmNvbnRlbnRTY3JpcHROYW1lID0gY29udGVudFNjcmlwdE5hbWU7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICBpZiAodGhpcy5pc1RvcEZyYW1lKSB7XG4gICAgICB0aGlzLmxpc3RlbkZvck5ld2VyU2NyaXB0cyh7IGlnbm9yZUZpcnN0RXZlbnQ6IHRydWUgfSk7XG4gICAgICB0aGlzLnN0b3BPbGRTY3JpcHRzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBTQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUgPSBnZXRVbmlxdWVFdmVudE5hbWUoXG4gICAgXCJ3eHQ6Y29udGVudC1zY3JpcHQtc3RhcnRlZFwiXG4gICk7XG4gIGlzVG9wRnJhbWUgPSB3aW5kb3cuc2VsZiA9PT0gd2luZG93LnRvcDtcbiAgYWJvcnRDb250cm9sbGVyO1xuICBsb2NhdGlvbldhdGNoZXIgPSBjcmVhdGVMb2NhdGlvbldhdGNoZXIodGhpcyk7XG4gIHJlY2VpdmVkTWVzc2FnZUlkcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gIGdldCBzaWduYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcbiAgfVxuICBhYm9ydChyZWFzb24pIHtcbiAgICByZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuYWJvcnQocmVhc29uKTtcbiAgfVxuICBnZXQgaXNJbnZhbGlkKCkge1xuICAgIGlmIChicm93c2VyLnJ1bnRpbWUuaWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5ub3RpZnlJbnZhbGlkYXRlZCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zaWduYWwuYWJvcnRlZDtcbiAgfVxuICBnZXQgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNJbnZhbGlkO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBjb250ZW50IHNjcmlwdCdzIGNvbnRleHQgaXMgaW52YWxpZGF0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lci5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihjYik7XG4gICAqIGNvbnN0IHJlbW92ZUludmFsaWRhdGVkTGlzdGVuZXIgPSBjdHgub25JbnZhbGlkYXRlZCgoKSA9PiB7XG4gICAqICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihjYik7XG4gICAqIH0pXG4gICAqIC8vIC4uLlxuICAgKiByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyKCk7XG4gICAqL1xuICBvbkludmFsaWRhdGVkKGNiKSB7XG4gICAgdGhpcy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJuIGEgcHJvbWlzZSB0aGF0IG5ldmVyIHJlc29sdmVzLiBVc2VmdWwgaWYgeW91IGhhdmUgYW4gYXN5bmMgZnVuY3Rpb24gdGhhdCBzaG91bGRuJ3QgcnVuXG4gICAqIGFmdGVyIHRoZSBjb250ZXh0IGlzIGV4cGlyZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IGdldFZhbHVlRnJvbVN0b3JhZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAqICAgaWYgKGN0eC5pc0ludmFsaWQpIHJldHVybiBjdHguYmxvY2soKTtcbiAgICpcbiAgICogICAvLyAuLi5cbiAgICogfVxuICAgKi9cbiAgYmxvY2soKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKCgpID0+IHtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRJbnRlcnZhbGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWwgd2hlbiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHNldEludGVydmFsKGhhbmRsZXIsIHRpbWVvdXQpIHtcbiAgICBjb25zdCBpZCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQpIGhhbmRsZXIoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2xlYXJJbnRlcnZhbChpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRUaW1lb3V0YCB0aGF0IGF1dG9tYXRpY2FsbHkgY2xlYXJzIHRoZSBpbnRlcnZhbCB3aGVuIGludmFsaWRhdGVkLlxuICAgKi9cbiAgc2V0VGltZW91dChoYW5kbGVyLCB0aW1lb3V0KSB7XG4gICAgY29uc3QgaWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQpIGhhbmRsZXIoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2xlYXJUaW1lb3V0KGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgdGhhdCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIHJlcXVlc3Qgd2hlblxuICAgKiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjaykge1xuICAgIGNvbnN0IGlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCguLi5hcmdzKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICB9KTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2FuY2VsQW5pbWF0aW9uRnJhbWUoaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFja2AgdGhhdCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlIHJlcXVlc3Qgd2hlblxuICAgKiBpbnZhbGlkYXRlZC5cbiAgICovXG4gIHJlcXVlc3RJZGxlQ2FsbGJhY2soY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBjb25zdCBpZCA9IHJlcXVlc3RJZGxlQ2FsbGJhY2soKC4uLmFyZ3MpID0+IHtcbiAgICAgIGlmICghdGhpcy5zaWduYWwuYWJvcnRlZCkgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgfSwgb3B0aW9ucyk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbElkbGVDYWxsYmFjayhpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICBhZGRFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgaGFuZGxlciwgb3B0aW9ucykge1xuICAgIGlmICh0eXBlID09PSBcInd4dDpsb2NhdGlvbmNoYW5nZVwiKSB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSB0aGlzLmxvY2F0aW9uV2F0Y2hlci5ydW4oKTtcbiAgICB9XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXI/LihcbiAgICAgIHR5cGUuc3RhcnRzV2l0aChcInd4dDpcIikgPyBnZXRVbmlxdWVFdmVudE5hbWUodHlwZSkgOiB0eXBlLFxuICAgICAgaGFuZGxlcixcbiAgICAgIHtcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgc2lnbmFsOiB0aGlzLnNpZ25hbFxuICAgICAgfVxuICAgICk7XG4gIH1cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKiBBYm9ydCB0aGUgYWJvcnQgY29udHJvbGxlciBhbmQgZXhlY3V0ZSBhbGwgYG9uSW52YWxpZGF0ZWRgIGxpc3RlbmVycy5cbiAgICovXG4gIG5vdGlmeUludmFsaWRhdGVkKCkge1xuICAgIHRoaXMuYWJvcnQoXCJDb250ZW50IHNjcmlwdCBjb250ZXh0IGludmFsaWRhdGVkXCIpO1xuICAgIGxvZ2dlci5kZWJ1ZyhcbiAgICAgIGBDb250ZW50IHNjcmlwdCBcIiR7dGhpcy5jb250ZW50U2NyaXB0TmFtZX1cIiBjb250ZXh0IGludmFsaWRhdGVkYFxuICAgICk7XG4gIH1cbiAgc3RvcE9sZFNjcmlwdHMoKSB7XG4gICAgd2luZG93LnBvc3RNZXNzYWdlKFxuICAgICAge1xuICAgICAgICB0eXBlOiBDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsXG4gICAgICAgIGNvbnRlbnRTY3JpcHROYW1lOiB0aGlzLmNvbnRlbnRTY3JpcHROYW1lLFxuICAgICAgICBtZXNzYWdlSWQ6IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpXG4gICAgICB9LFxuICAgICAgXCIqXCJcbiAgICApO1xuICB9XG4gIHZlcmlmeVNjcmlwdFN0YXJ0ZWRFdmVudChldmVudCkge1xuICAgIGNvbnN0IGlzU2NyaXB0U3RhcnRlZEV2ZW50ID0gZXZlbnQuZGF0YT8udHlwZSA9PT0gQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFO1xuICAgIGNvbnN0IGlzU2FtZUNvbnRlbnRTY3JpcHQgPSBldmVudC5kYXRhPy5jb250ZW50U2NyaXB0TmFtZSA9PT0gdGhpcy5jb250ZW50U2NyaXB0TmFtZTtcbiAgICBjb25zdCBpc05vdER1cGxpY2F0ZSA9ICF0aGlzLnJlY2VpdmVkTWVzc2FnZUlkcy5oYXMoZXZlbnQuZGF0YT8ubWVzc2FnZUlkKTtcbiAgICByZXR1cm4gaXNTY3JpcHRTdGFydGVkRXZlbnQgJiYgaXNTYW1lQ29udGVudFNjcmlwdCAmJiBpc05vdER1cGxpY2F0ZTtcbiAgfVxuICBsaXN0ZW5Gb3JOZXdlclNjcmlwdHMob3B0aW9ucykge1xuICAgIGxldCBpc0ZpcnN0ID0gdHJ1ZTtcbiAgICBjb25zdCBjYiA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKHRoaXMudmVyaWZ5U2NyaXB0U3RhcnRlZEV2ZW50KGV2ZW50KSkge1xuICAgICAgICB0aGlzLnJlY2VpdmVkTWVzc2FnZUlkcy5hZGQoZXZlbnQuZGF0YS5tZXNzYWdlSWQpO1xuICAgICAgICBjb25zdCB3YXNGaXJzdCA9IGlzRmlyc3Q7XG4gICAgICAgIGlzRmlyc3QgPSBmYWxzZTtcbiAgICAgICAgaWYgKHdhc0ZpcnN0ICYmIG9wdGlvbnM/Lmlnbm9yZUZpcnN0RXZlbnQpIHJldHVybjtcbiAgICAgICAgdGhpcy5ub3RpZnlJbnZhbGlkYXRlZCgpO1xuICAgICAgfVxuICAgIH07XG4gICAgYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgY2IpO1xuICAgIHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiByZW1vdmVFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBjYikpO1xuICB9XG59XG4iLCJjb25zdCBudWxsS2V5ID0gU3ltYm9sKCdudWxsJyk7IC8vIGBvYmplY3RIYXNoZXNgIGtleSBmb3IgbnVsbFxuXG5sZXQga2V5Q291bnRlciA9IDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hbnlLZXlzTWFwIGV4dGVuZHMgTWFwIHtcblx0Y29uc3RydWN0b3IoLi4uYXJndW1lbnRzXykge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9vYmplY3RIYXNoZXMgPSBuZXcgV2Vha01hcCgpO1xuXHRcdHRoaXMuX3N5bWJvbEhhc2hlcyA9IG5ldyBNYXAoKTsgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvZWNtYTI2Mi9pc3N1ZXMvMTE5NFxuXHRcdHRoaXMuX3B1YmxpY0tleXMgPSBuZXcgTWFwKCk7XG5cblx0XHRjb25zdCBbcGFpcnNdID0gYXJndW1lbnRzXzsgLy8gTWFwIGNvbXBhdFxuXHRcdGlmIChwYWlycyA9PT0gbnVsbCB8fCBwYWlycyA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGVvZiBwYWlyc1tTeW1ib2wuaXRlcmF0b3JdICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKHR5cGVvZiBwYWlycyArICcgaXMgbm90IGl0ZXJhYmxlIChjYW5ub3QgcmVhZCBwcm9wZXJ0eSBTeW1ib2woU3ltYm9sLml0ZXJhdG9yKSknKTtcblx0XHR9XG5cblx0XHRmb3IgKGNvbnN0IFtrZXlzLCB2YWx1ZV0gb2YgcGFpcnMpIHtcblx0XHRcdHRoaXMuc2V0KGtleXMsIHZhbHVlKTtcblx0XHR9XG5cdH1cblxuXHRfZ2V0UHVibGljS2V5cyhrZXlzLCBjcmVhdGUgPSBmYWxzZSkge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShrZXlzKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGtleXMgcGFyYW1ldGVyIG11c3QgYmUgYW4gYXJyYXknKTtcblx0XHR9XG5cblx0XHRjb25zdCBwcml2YXRlS2V5ID0gdGhpcy5fZ2V0UHJpdmF0ZUtleShrZXlzLCBjcmVhdGUpO1xuXG5cdFx0bGV0IHB1YmxpY0tleTtcblx0XHRpZiAocHJpdmF0ZUtleSAmJiB0aGlzLl9wdWJsaWNLZXlzLmhhcyhwcml2YXRlS2V5KSkge1xuXHRcdFx0cHVibGljS2V5ID0gdGhpcy5fcHVibGljS2V5cy5nZXQocHJpdmF0ZUtleSk7XG5cdFx0fSBlbHNlIGlmIChjcmVhdGUpIHtcblx0XHRcdHB1YmxpY0tleSA9IFsuLi5rZXlzXTsgLy8gUmVnZW5lcmF0ZSBrZXlzIGFycmF5IHRvIGF2b2lkIGV4dGVybmFsIGludGVyYWN0aW9uXG5cdFx0XHR0aGlzLl9wdWJsaWNLZXlzLnNldChwcml2YXRlS2V5LCBwdWJsaWNLZXkpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7cHJpdmF0ZUtleSwgcHVibGljS2V5fTtcblx0fVxuXG5cdF9nZXRQcml2YXRlS2V5KGtleXMsIGNyZWF0ZSA9IGZhbHNlKSB7XG5cdFx0Y29uc3QgcHJpdmF0ZUtleXMgPSBbXTtcblx0XHRmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG5cdFx0XHRjb25zdCBrZXlUb1Bhc3MgPSBrZXkgPT09IG51bGwgPyBudWxsS2V5IDoga2V5O1xuXG5cdFx0XHRsZXQgaGFzaGVzO1xuXHRcdFx0aWYgKHR5cGVvZiBrZXlUb1Bhc3MgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBrZXlUb1Bhc3MgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0aGFzaGVzID0gJ19vYmplY3RIYXNoZXMnO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2Yga2V5VG9QYXNzID09PSAnc3ltYm9sJykge1xuXHRcdFx0XHRoYXNoZXMgPSAnX3N5bWJvbEhhc2hlcyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRoYXNoZXMgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFoYXNoZXMpIHtcblx0XHRcdFx0cHJpdmF0ZUtleXMucHVzaChrZXlUb1Bhc3MpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzW2hhc2hlc10uaGFzKGtleVRvUGFzcykpIHtcblx0XHRcdFx0cHJpdmF0ZUtleXMucHVzaCh0aGlzW2hhc2hlc10uZ2V0KGtleVRvUGFzcykpO1xuXHRcdFx0fSBlbHNlIGlmIChjcmVhdGUpIHtcblx0XHRcdFx0Y29uc3QgcHJpdmF0ZUtleSA9IGBAQG1rbS1yZWYtJHtrZXlDb3VudGVyKyt9QEBgO1xuXHRcdFx0XHR0aGlzW2hhc2hlc10uc2V0KGtleVRvUGFzcywgcHJpdmF0ZUtleSk7XG5cdFx0XHRcdHByaXZhdGVLZXlzLnB1c2gocHJpdmF0ZUtleSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHByaXZhdGVLZXlzKTtcblx0fVxuXG5cdHNldChrZXlzLCB2YWx1ZSkge1xuXHRcdGNvbnN0IHtwdWJsaWNLZXl9ID0gdGhpcy5fZ2V0UHVibGljS2V5cyhrZXlzLCB0cnVlKTtcblx0XHRyZXR1cm4gc3VwZXIuc2V0KHB1YmxpY0tleSwgdmFsdWUpO1xuXHR9XG5cblx0Z2V0KGtleXMpIHtcblx0XHRjb25zdCB7cHVibGljS2V5fSA9IHRoaXMuX2dldFB1YmxpY0tleXMoa2V5cyk7XG5cdFx0cmV0dXJuIHN1cGVyLmdldChwdWJsaWNLZXkpO1xuXHR9XG5cblx0aGFzKGtleXMpIHtcblx0XHRjb25zdCB7cHVibGljS2V5fSA9IHRoaXMuX2dldFB1YmxpY0tleXMoa2V5cyk7XG5cdFx0cmV0dXJuIHN1cGVyLmhhcyhwdWJsaWNLZXkpO1xuXHR9XG5cblx0ZGVsZXRlKGtleXMpIHtcblx0XHRjb25zdCB7cHVibGljS2V5LCBwcml2YXRlS2V5fSA9IHRoaXMuX2dldFB1YmxpY0tleXMoa2V5cyk7XG5cdFx0cmV0dXJuIEJvb2xlYW4ocHVibGljS2V5ICYmIHN1cGVyLmRlbGV0ZShwdWJsaWNLZXkpICYmIHRoaXMuX3B1YmxpY0tleXMuZGVsZXRlKHByaXZhdGVLZXkpKTtcblx0fVxuXG5cdGNsZWFyKCkge1xuXHRcdHN1cGVyLmNsZWFyKCk7XG5cdFx0dGhpcy5fc3ltYm9sSGFzaGVzLmNsZWFyKCk7XG5cdFx0dGhpcy5fcHVibGljS2V5cy5jbGVhcigpO1xuXHR9XG5cblx0Z2V0IFtTeW1ib2wudG9TdHJpbmdUYWddKCkge1xuXHRcdHJldHVybiAnTWFueUtleXNNYXAnO1xuXHR9XG5cblx0Z2V0IHNpemUoKSB7XG5cdFx0cmV0dXJuIHN1cGVyLnNpemU7XG5cdH1cbn1cbiIsImltcG9ydCBNYW55S2V5c01hcCBmcm9tICdtYW55LWtleXMtbWFwJztcbmltcG9ydCB7IGRlZnUgfSBmcm9tICdkZWZ1JztcbmltcG9ydCB7IGlzRXhpc3QgfSBmcm9tICcuL2RldGVjdG9ycy5tanMnO1xuXG5jb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9ICgpID0+ICh7XG4gIHRhcmdldDogZ2xvYmFsVGhpcy5kb2N1bWVudCxcbiAgdW5pZnlQcm9jZXNzOiB0cnVlLFxuICBkZXRlY3RvcjogaXNFeGlzdCxcbiAgb2JzZXJ2ZUNvbmZpZ3M6IHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gIH0sXG4gIHNpZ25hbDogdm9pZCAwLFxuICBjdXN0b21NYXRjaGVyOiB2b2lkIDBcbn0pO1xuY29uc3QgbWVyZ2VPcHRpb25zID0gKHVzZXJTaWRlT3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIGRlZnUodXNlclNpZGVPcHRpb25zLCBkZWZhdWx0T3B0aW9ucyk7XG59O1xuXG5jb25zdCB1bmlmeUNhY2hlID0gbmV3IE1hbnlLZXlzTWFwKCk7XG5mdW5jdGlvbiBjcmVhdGVXYWl0RWxlbWVudChpbnN0YW5jZU9wdGlvbnMpIHtcbiAgY29uc3QgeyBkZWZhdWx0T3B0aW9ucyB9ID0gaW5zdGFuY2VPcHRpb25zO1xuICByZXR1cm4gKHNlbGVjdG9yLCBvcHRpb25zKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgdGFyZ2V0LFxuICAgICAgdW5pZnlQcm9jZXNzLFxuICAgICAgb2JzZXJ2ZUNvbmZpZ3MsXG4gICAgICBkZXRlY3RvcixcbiAgICAgIHNpZ25hbCxcbiAgICAgIGN1c3RvbU1hdGNoZXJcbiAgICB9ID0gbWVyZ2VPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcbiAgICBjb25zdCB1bmlmeVByb21pc2VLZXkgPSBbXG4gICAgICBzZWxlY3RvcixcbiAgICAgIHRhcmdldCxcbiAgICAgIHVuaWZ5UHJvY2VzcyxcbiAgICAgIG9ic2VydmVDb25maWdzLFxuICAgICAgZGV0ZWN0b3IsXG4gICAgICBzaWduYWwsXG4gICAgICBjdXN0b21NYXRjaGVyXG4gICAgXTtcbiAgICBjb25zdCBjYWNoZWRQcm9taXNlID0gdW5pZnlDYWNoZS5nZXQodW5pZnlQcm9taXNlS2V5KTtcbiAgICBpZiAodW5pZnlQcm9jZXNzICYmIGNhY2hlZFByb21pc2UpIHtcbiAgICAgIHJldHVybiBjYWNoZWRQcm9taXNlO1xuICAgIH1cbiAgICBjb25zdCBkZXRlY3RQcm9taXNlID0gbmV3IFByb21pc2UoXG4gICAgICAvLyBiaW9tZS1pZ25vcmUgbGludC9zdXNwaWNpb3VzL25vQXN5bmNQcm9taXNlRXhlY3V0b3I6IGF2b2lkIG5lc3RpbmcgcHJvbWlzZVxuICAgICAgYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoc2lnbmFsPy5hYm9ydGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChzaWduYWwucmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgICAgIGFzeW5jIChtdXRhdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgXyBvZiBtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgaWYgKHNpZ25hbD8uYWJvcnRlZCkge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zdCBkZXRlY3RSZXN1bHQyID0gYXdhaXQgZGV0ZWN0RWxlbWVudCh7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgICAgIGRldGVjdG9yLFxuICAgICAgICAgICAgICAgIGN1c3RvbU1hdGNoZXJcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChkZXRlY3RSZXN1bHQyLmlzRGV0ZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkZXRlY3RSZXN1bHQyLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHNpZ25hbD8uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcImFib3J0XCIsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChzaWduYWwucmVhc29uKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgb25jZTogdHJ1ZSB9XG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGRldGVjdFJlc3VsdCA9IGF3YWl0IGRldGVjdEVsZW1lbnQoe1xuICAgICAgICAgIHNlbGVjdG9yLFxuICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICBkZXRlY3RvcixcbiAgICAgICAgICBjdXN0b21NYXRjaGVyXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZGV0ZWN0UmVzdWx0LmlzRGV0ZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkZXRlY3RSZXN1bHQucmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRhcmdldCwgb2JzZXJ2ZUNvbmZpZ3MpO1xuICAgICAgfVxuICAgICkuZmluYWxseSgoKSA9PiB7XG4gICAgICB1bmlmeUNhY2hlLmRlbGV0ZSh1bmlmeVByb21pc2VLZXkpO1xuICAgIH0pO1xuICAgIHVuaWZ5Q2FjaGUuc2V0KHVuaWZ5UHJvbWlzZUtleSwgZGV0ZWN0UHJvbWlzZSk7XG4gICAgcmV0dXJuIGRldGVjdFByb21pc2U7XG4gIH07XG59XG5hc3luYyBmdW5jdGlvbiBkZXRlY3RFbGVtZW50KHtcbiAgdGFyZ2V0LFxuICBzZWxlY3RvcixcbiAgZGV0ZWN0b3IsXG4gIGN1c3RvbU1hdGNoZXJcbn0pIHtcbiAgY29uc3QgZWxlbWVudCA9IGN1c3RvbU1hdGNoZXIgPyBjdXN0b21NYXRjaGVyKHNlbGVjdG9yKSA6IHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgcmV0dXJuIGF3YWl0IGRldGVjdG9yKGVsZW1lbnQpO1xufVxuY29uc3Qgd2FpdEVsZW1lbnQgPSBjcmVhdGVXYWl0RWxlbWVudCh7XG4gIGRlZmF1bHRPcHRpb25zOiBnZXREZWZhdWx0T3B0aW9ucygpXG59KTtcblxuZXhwb3J0IHsgY3JlYXRlV2FpdEVsZW1lbnQsIGdldERlZmF1bHRPcHRpb25zLCB3YWl0RWxlbWVudCB9O1xuIl0sIm5hbWVzIjpbImRlZmluaXRpb24iLCJ1dGlsIiwib2JqZWN0VXRpbCIsImRlZmF1bHRFcnJvck1hcCIsImVycm9yVXRpbCIsInJlc3VsdCIsImVycm9yTWFwIiwiY3R4IiwiaXNzdWVzIiwiZWxlbWVudHMiLCJwcm9jZXNzZWQiLCJab2RGaXJzdFBhcnR5VHlwZUtpbmQiLCJ6LnR1cGxlIiwiei5udW1iZXIiLCJ6LnN0cmluZyIsInouZW51bSIsInoub2JqZWN0Iiwiei5ib29sZWFuIiwiei5yZWNvcmQiLCJ6LnVuaW9uIiwiei5saXRlcmFsIiwiei5hcnJheSIsIl9hIiwibGlzdCIsIm8iLCJTZXRMaWtlIiwiQXJyYXlGcm9tIiwiY29udGVudCIsImRvY3VtZW50Iiwid2luZG93IiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImNvbXB1dGVUZXh0QWx0ZXJuYXRpdmUiLCJfYiIsIm5hbWUiLCJyZWN0IiwidGhpcyIsIm1vZHVsZSIsInByb3h5VGFyZ2V0IiwidmFsdWUiLCJtZXNzYWdlIiwicHJpbnQiLCJsb2dnZXIiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQU8sV0FBUyxvQkFBb0JBLGFBQVk7QUFDOUMsV0FBT0E7QUFBQSxFQUNUO0FDcUNPLFdBQVMsV0FDZCxNQUNBLE9BQ0EsU0FDQSxZQUFZLE9BQ1osUUFDWTtBQUNaLFdBQU8sRUFBRSxNQUFNLE9BQU8sU0FBUyxXQUFXLE9BQUE7QUFBQSxFQUM1Qzs7Ozs7Ozs7Ozs7QUNrQk8sV0FBUyxnQkFBZ0IsTUFBWSxPQUFPLEdBQVM7QUFDMUQsV0FBTztBQUFBLE1BQ0wsS0FBSyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSTtBQUFBLE1BQzdCLEtBQUssTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUk7QUFBQSxNQUM3QixLQUFLLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJO0FBQUEsTUFDN0IsS0FBSyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSTtBQUFBLElBQUE7QUFBQSxFQUVqQzs7QUN4RU8sTUFBSTtBQUNYLEdBQUMsU0FBVUMsT0FBTTtBQUNiLElBQUFBLE1BQUssY0FBYyxDQUFDLE1BQU07QUFBQSxJQUFFO0FBQzVCLGFBQVMsU0FBUyxNQUFNO0FBQUEsSUFBRTtBQUMxQixJ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Q0EsSUFBSSxhQUFhO0FBQ2IsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLFVBQVU7QUFBQSxJQUNqRTtBQUFBLElBQ0EsSUFBSSxTQUFTO0FBQ1QsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE1BQU07QUFBQSxJQUM3RDtBQUFBLElBQ0EsSUFBSSxTQUFTO0FBQ1QsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE1BQU07QUFBQSxJQUM3RDtBQUFBLElBQ0EsSUFBSSxhQUFhO0FBQ2IsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLFVBQVU7QUFBQSxJQUNqRTtBQUFBLElBQ0EsSUFBSSxVQUFVO0FBQ1YsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE9BQU87QUFBQSxJQUM5RDtBQUFBLElBQ0EsSUFBSSxRQUFRO0FBQ1IsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUs7QUFBQSxJQUM1RDtBQUFBLElBQ0EsSUFBSSxVQUFVO0FBQ1YsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE9BQU87QUFBQSxJQUM5RDtBQUFBLElBQ0EsSUFBSSxTQUFTO0FBQ1QsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE1BQU07QUFBQSxJQUM3RDtBQUFBLElBQ0EsSUFBSSxXQUFXO0FBQ1gsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLFFBQVE7QUFBQSxJQUMvRDtBQUFBLElBQ0EsSUFBSSxTQUFTO0FBQ1QsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE1BQU07QUFBQSxJQUM3RDtBQUFBLElBQ0EsSUFBSSxVQUFVO0FBQ1YsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE9BQU87QUFBQSxJQUM5RDtBQUFBLElBQ0EsSUFBSSxTQUFTO0FBQ1QsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE1BQU07QUFBQSxJQUM3RDtBQUFBLElBQ0EsSUFBSSxPQUFPO0FBQ1AsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLElBQUk7QUFBQSxJQUMzRDtBQUFBLElBQ0EsSUFBSSxTQUFTO0FBQ1QsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE1BQU07QUFBQSxJQUM3RDtBQUFBLElBQ0EsSUFBSSxXQUFXO0FBQ1gsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLFFBQVE7QUFBQSxJQUMvRDtBQUFBLElBQ0EsSUFBSSxjQUFjO0FBRWQsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLFdBQVc7QUFBQSxJQUNsRTtBQUFBLElBQ0EsSUFBSSxZQUFZO0FBQ1osVUFBSSxNQUFNO0FBQ1YsaUJBQVcsTUFBTSxLQUFLLEtBQUssUUFBUTtBQUMvQixZQUFJLEdBQUcsU0FBUyxPQUFPO0FBQ25CLGNBQUksUUFBUSxRQUFRLEdBQUcsUUFBUTtBQUMzQixrQkFBTSxHQUFHO0FBQUEsUUFDakI7QUFBQSxNQUNKO0FBQ0EsYUFBTztBQUFBLElBQ1g7QUFBQSxJQUNBLElBQUksWUFBWTtBQUNaLFVBQUksTUFBTTtBQUNWLGlCQUFXLE1BQU0sS0FBSyxLQUFLLFFBQVE7QUFDL0IsWUFBSSxHQUFHLFNBQVMsT0FBTztBQUNuQixjQUFJLFFBQVEsUUFBUSxHQUFHLFFBQVE7QUFDM0Isa0JBQU0sR0FBRztBQUFBLFFBQ2pCO0FBQUEsTUFDSjtBQUNBLGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUNBLFlBQVUsU0FBUyxDQUFDLFdBQVc7QUFDM0IsV0FBTyxJQUFJLFVBQVU7QUFBQSxNQUNqQixRQUFRLENBQUE7QUFBQSxNQUNSLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsU0FBUSxpQ0FBUSxXQUFVO0FBQUEsTUFDMUIsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBRUEsV0FBUyxtQkFBbUIsS0FBSyxNQUFNO0FBQ25DLFVBQU0sZUFBZSxJQUFJLFNBQVEsRUFBRyxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssSUFBSTtBQUN6RCxVQUFNLGdCQUFnQixLQUFLLFNBQVEsRUFBRyxNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssSUFBSTtBQUMzRCxVQUFNLFdBQVcsY0FBYyxlQUFlLGNBQWM7QUFDNUQsVUFBTSxTQUFTLE9BQU8sU0FBUyxJQUFJLFFBQVEsUUFBUSxFQUFFLFFBQVEsS0FBSyxFQUFFLENBQUM7QUFDckUsVUFBTSxVQUFVLE9BQU8sU0FBUyxLQUFLLFFBQVEsUUFBUSxFQUFFLFFBQVEsS0FBSyxFQUFFLENBQUM7QUFDdkUsV0FBUSxTQUFTLFVBQVcsTUFBTTtBQUFBLEVBQ3RDO0FBQUEsRUFDTyxNQUFNLGtCQUFrQixRQUFRO0FBQUEsSUFDbkMsY0FBYztBQUNWLFlBQU0sR0FBRyxTQUFTO0FBQ2xCLFdBQUssTUFBTSxLQUFLO0FBQ2hCLFdBQUssTUFBTSxLQUFLO0FBQ2hCLFdBQUssT0FBTyxLQUFLO0FBQUEsSUFDckI7QUFBQSxJQUNBLE9BQU8sT0FBTztBQUNWLFVBQUksS0FBSyxLQUFLLFFBQVE7QUFDbEIsY0FBTSxPQUFPLE9BQU8sTUFBTSxJQUFJO0FBQUEsTUFDbEM7QUFDQSxZQUFNLGFBQWEsS0FBSyxTQUFTLEtBQUs7QUFDdEMsVUFBSSxlQUFlLGNBQWMsUUFBUTtBQUNyQyxjQUFNQSxPQUFNLEtBQUssZ0JBQWdCLEtBQUs7QUFDdEMsMEJBQWtCQSxNQUFLO0FBQUEsVUFDbkIsTUFBTSxhQUFhO0FBQUEsVUFDbkIsVUFBVSxjQUFjO0FBQUEsVUFDeEIsVUFBVUEsS0FBSTtBQUFBLFFBQzlCLENBQWE7QUFDRCxlQUFPO0FBQUEsTUFDWDtBQUNBLFVBQUksTUFBTTtBQUNWLFlBQU0sU0FBUyxJQUFJLFlBQVc7QUFDOUIsaUJBQVcsU0FBUyxLQUFLLEtBQUssUUFBUTtBQUNsQyxZQUFJLE1BQU0sU0FBUyxPQUFPO0FBQ3RCLGNBQUksQ0FBQyxLQUFLLFVBQVUsTUFBTSxJQUFJLEdBQUc7QUFDN0Isa0JBQU0sS0FBSyxnQkFBZ0IsT0FBTyxHQUFHO0FBQ3JDLDhCQUFrQixLQUFLO0FBQUEsY0FDbkIsTUFBTSxhQUFhO0FBQUEsY0FDbkIsVUFBVTtBQUFBLGNBQ1YsVUFBVTtBQUFBLGNBQ1YsU0FBUyxNQUFNO0FBQUEsWUFDdkMsQ0FBcUI7QUFDRCxtQkFBTyxNQUFLO0FBQUEsVUFDaEI7QUFBQSxRQUNKLFdBQ1MsTUFBTSxTQUFTLE9BQU87QUFDM0IsZ0JBQU0sV0FBVyxNQUFNLFlBQVksTUFBTSxPQUFPLE1BQU0sUUFBUSxNQUFNLFFBQVEsTUFBTTtBQUNsRixjQUFJLFVBQVU7QUFDVixrQkFBTSxLQUFLLGdCQUFnQixPQUFPLEdBQUc7QUFDckMsOEJBQWtCLEtBQUs7QUFBQSxjQUNuQixNQUFNLGFBQWE7QUFBQSxjQUNuQixTQUFTLE1BQU07QUFBQSxjQUNmLE1BQU07QUFBQSxjQUNOLFdBQVcsTUFBTTtBQUFBLGNBQ2pCLE9BQU87QUFBQSxjQUNQLFNBQVMsTUFBTTtBQUFBLFlBQ3ZDLENBQXFCO0FBQ0QsbUJBQU8sTUFBSztBQUFBLFVBQ2hCO0FBQUEsUUFDSixXQUNTLE1BQU0sU0FBUyxPQUFPO0FBQzNCLGdCQUFNLFNBQVMsTUFBTSxZQUFZLE1BQU0sT0FBTyxNQUFNLFFBQVEsTUFBTSxRQUFRLE1BQU07QUFDaEYsY0FBSSxRQUFRO0FBQ1Isa0JBQU0sS0FBSyxnQkFBZ0IsT0FBTyxHQUFHO0FBQ3JDLDhCQUFrQixLQUFLO0FBQUEsY0FDbkIsTUFBTSxhQUFhO0FBQUEsY0FDbkIsU0FBUyxNQUFNO0FBQUEsY0FDZixNQUFNO0FBQUEsY0FDTixXQUFXLE1BQU07QUFBQSxjQUNqQixPQUFPO0FBQUEsY0FDUCxTQUFTLE1BQU07QUFBQSxZQUN2QyxDQUFxQjtBQUNELG1CQUFPLE1BQUs7QUFBQSxVQUNoQjtBQUFBLFFBQ0osV0FDUyxNQUFNLFNBQVMsY0FBYztBQUNsQyxjQUFJLG1CQUFtQixNQUFNLE1BQU0sTUFBTSxLQUFLLE1BQU0sR0FBRztBQUNuRCxrQkFBTSxLQUFLLGdCQUFnQixPQUFPLEdBQUc7QUFDckMsOEJBQWtCLEtBQUs7QUFBQSxjQUNuQixNQUFNLGFBQWE7QUFBQSxjQUNuQixZQUFZLE1BQU07QUFBQSxjQUNsQixTQUFTLE1BQU07QUFBQSxZQUN2QyxDQUFxQjtBQUNELG1CQUFPLE1BQUs7QUFBQSxVQUNoQjtBQUFBLFFBQ0osV0FDUyxNQUFNLFNBQVMsVUFBVTtBQUM5QixjQUFJLENBQUMsT0FBTyxTQUFTLE1BQU0sSUFBSSxHQUFHO0FBQzlCLGtCQUFNLEtBQUssZ0JBQWdCLE9BQU8sR0FBRztBQUNyQyw4QkFBa0IsS0FBSztBQUFBLGNBQ25CLE1BQU0sYUFBYTtBQUFBLGNBQ25CLFNBQVMsTUFBTTtBQUFBLFlBQ3ZDLENBQXFCO0FBQ0QsbUJBQU8sTUFBSztBQUFBLFVBQ2hCO0FBQUEsUUFDSixPQUNLO0FBQ0QsZUFBSyxZQUFZLEtBQUs7QUFBQSxRQUMxQjtBQUFBLE1BQ0o7QUFDQSxhQUFPLEVBQUUsUUFBUSxPQUFPLE9BQU8sT0FBTyxNQUFNLEtBQUk7QUFBQSxJQUNwRDtBQUFBLElBQ0EsSUFBSSxPQUFPLFNBQVM7QUFDaEIsYUFBTyxLQUFLLFNBQVMsT0FBTyxPQUFPLE1BQU0sVUFBVSxTQUFTLE9BQU8sQ0FBQztBQUFBLElBQ3hFO0FBQUEsSUFDQSxHQUFHLE9BQU8sU0FBUztBQUNmLGFBQU8sS0FBSyxTQUFTLE9BQU8sT0FBTyxPQUFPLFVBQVUsU0FBUyxPQUFPLENBQUM7QUFBQSxJQUN6RTtBQUFBLElBQ0EsSUFBSSxPQUFPLFNBQVM7QUFDaEIsYUFBTyxLQUFLLFNBQVMsT0FBTyxPQUFPLE1BQU0sVUFBVSxTQUFTLE9BQU8sQ0FBQztBQUFBLElBQ3hFO0FBQUEsSUFDQSxHQUFHLE9BQU8sU0FBUztBQUNmLGFBQU8sS0FBSyxTQUFTLE9BQU8sT0FBTyxPQUFPLFVBQVUsU0FBUyxPQUFPLENBQUM7QUFBQSxJQUN6RTtBQUFBLElBQ0EsU0FBUyxNQUFNLE9BQU8sV0FBVyxTQUFTO0FBQ3RDLGFBQU8sSUFBSSxVQUFVO0FBQUEsUUFDakIsR0FBRyxLQUFLO0FBQUEsUUFDUixRQUFRO0FBQUEsVUFDSixHQUFHLEtBQUssS0FBSztBQUFBLFVBQ2I7QUFBQSxZQUNJO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBLFNBQVMsVUFBVSxTQUFTLE9BQU87QUFBQSxVQUN2RDtBQUFBLFFBQ0E7QUFBQSxNQUNBLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxVQUFVLE9BQU87QUFDYixhQUFPLElBQUksVUFBVTtBQUFBLFFBQ2pCLEdBQUcsS0FBSztBQUFBLFFBQ1IsUUFBUSxDQUFDLEdBQUcsS0FBSyxLQUFLLFFBQVEsS0FBSztBQUFBLE1BQy9DLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxJQUFJLFNBQVM7QUFDVCxhQUFPLEtBQUssVUFBVTtBQUFBLFFBQ2xCLE1BQU07QUFBQSxRQUNOLFNBQVMsVUFBVSxTQUFTLE9BQU87QUFBQSxNQUMvQyxDQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0EsU0FBUyxTQUFTO0FBQ2QsYUFBTyxLQUFLLFVBQVU7QUFBQSxRQUNsQixNQUFNO0FBQUEsUUFDTixPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsUUFDWCxTQUFTLFVBQVUsU0FBUyxPQUFPO0FBQUEsTUFDL0MsQ0FBUztBQUFBLElBQ0w7QUFBQSxJQUNBLFNBQVMsU0FBUztBQUNkLGFBQU8sS0FBSyxVQUFVO0FBQUEsUUFDbEIsTUFBTTtBQUFBLFFBQ04sT0FBTztBQUFBLFFBQ1AsV0FBVztBQUFBLFFBQ1gsU0FBUyxVQUFVLFNBQVMsT0FBTztBQUFBLE1BQy9DLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxZQUFZLFNBQVM7QUFDakIsYUFBTyxLQUFLLFVBQVU7QUFBQSxRQUNsQixNQUFNO0FBQUEsUUFDTixPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsUUFDWCxTQUFTLFVBQVUsU0FBUyxPQUFPO0FBQUEsTUFDL0MsQ0FBUztBQUFBLElBQ0w7QUFBQSxJQUNBLFlBQVksU0FBUztBQUNqQixhQUFPLEtBQUssVUFBVTtBQUFBLFFBQ2xCLE1BQU07QUFBQSxRQUNOLE9BQU87QUFBQSxRQUNQLFdBQVc7QUFBQSxRQUNYLFNBQVMsVUFBVSxTQUFTLE9BQU87QUFBQSxNQUMvQyxDQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0EsV0FBVyxPQUFPLFNBQVM7QUFDdkIsYUFBTyxLQUFLLFVBQVU7QUFBQSxRQUNsQixNQUFNO0FBQUEsUUFDTjtBQUFBLFFBQ0EsU0FBUyxVQUFVLFNBQVMsT0FBTztBQUFBLE1BQy9DLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxPQUFPLFNBQVM7QUFDWixhQUFPLEtBQUssVUFBVTtBQUFBLFFBQ2xCLE1BQU07QUFBQSxRQUNOLFNBQVMsVUFBVSxTQUFTLE9BQU87QUFBQSxNQUMvQyxDQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0EsS0FBSyxTQUFTO0FBQ1YsYUFBTyxLQUFLLFVBQVU7QUFBQSxRQUNsQixNQUFNO0FBQUEsUUFDTixXQUFXO0FBQUEsUUFDWCxPQUFPLE9BQU87QUFBQSxRQUNkLFNBQVMsVUFBVSxTQUFTLE9BQU87QUFBQSxNQUMvQyxDQUFTLEVBQUUsVUFBVTtBQUFBLFFBQ1QsTUFBTTtBQUFBLFFBQ04sV0FBVztBQUFBLFFBQ1gsT0FBTyxPQUFPO0FBQUEsUUFDZCxTQUFTLFVBQVUsU0FBUyxPQUFPO0FBQUEsTUFDL0MsQ0FBUztBQUFBLElBQ0w7QUFBQSxJQUNBLElBQUksV0FBVztBQUNYLFVBQUksTUFBTTtBQUNWLGlCQUFXLE1BQU0sS0FBSyxLQUFLLFFBQVE7QUFDL0IsWUFBSSxHQUFHLFNBQVMsT0FBTztBQUNuQixjQUFJLFFBQVEsUUFBUSxHQUFHLFFBQVE7QUFDM0Isa0JBQU0sR0FBRztBQUFBLFFBQ2pCO0FBQUEsTUFDSjtBQUNBLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFDQSxJQUFJLFdBQVc7QUFDWCxVQUFJLE1BQU07QUFDVixpQkFBVyxNQUFNLEtBQUssS0FBSyxRQUFRO0FBQy9CLFlBQUksR0FBRyxTQUFTLE9BQU87QUFDbkIsY0FBSSxRQUFRLFFBQVEsR0FBRyxRQUFRO0FBQzNCLGtCQUFNLEdBQUc7QUFBQSxRQUNqQjtBQUFBLE1BQ0o7QUFDQSxhQUFPO0FBQUEsSUFDWDtBQUFBLElBQ0EsSUFBSSxRQUFRO0FBQ1IsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLFNBQVUsR0FBRyxTQUFTLGdCQUFnQixLQUFLLFVBQVUsR0FBRyxLQUFLLENBQUU7QUFBQSxJQUN0SDtBQUFBLElBQ0EsSUFBSSxXQUFXO0FBQ1gsVUFBSSxNQUFNO0FBQ1YsVUFBSSxNQUFNO0FBQ1YsaUJBQVcsTUFBTSxLQUFLLEtBQUssUUFBUTtBQUMvQixZQUFJLEdBQUcsU0FBUyxZQUFZLEdBQUcsU0FBUyxTQUFTLEdBQUcsU0FBUyxjQUFjO0FBQ3ZFLGlCQUFPO0FBQUEsUUFDWCxXQUNTLEdBQUcsU0FBUyxPQUFPO0FBQ3hCLGNBQUksUUFBUSxRQUFRLEdBQUcsUUFBUTtBQUMzQixrQkFBTSxHQUFHO0FBQUEsUUFDakIsV0FDUyxHQUFHLFNBQVMsT0FBTztBQUN4QixjQUFJLFFBQVEsUUFBUSxHQUFHLFFBQVE7QUFDM0Isa0JBQU0sR0FBRztBQUFBLFFBQ2pCO0FBQUEsTUFDSjtBQUNBLGFBQU8sT0FBTyxTQUFTLEdBQUcsS0FBSyxPQUFPLFNBQVMsR0FBRztBQUFBLElBQ3REO0FBQUEsRUFDSjtBQUNBLFlBQVUsU0FBUyxDQUFDLFdBQVc7QUFDM0IsV0FBTyxJQUFJLFVBQVU7QUFBQSxNQUNqQixRQUFRLENBQUE7QUFBQSxNQUNSLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsU0FBUSxpQ0FBUSxXQUFVO0FBQUEsTUFDMUIsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQUEsRUFDTyxNQUFNLGtCQUFrQixRQUFRO0FBQUEsSUFDbkMsY0FBYztBQUNWLFlBQU0sR0FBRyxTQUFTO0FBQ2xCLFdBQUssTUFBTSxLQUFLO0FBQ2hCLFdBQUssTUFBTSxLQUFLO0FBQUEsSUFDcEI7QUFBQSxJQUNBLE9BQU8sT0FBTztBQUNWLFVBQUksS0FBSyxLQUFLLFFBQVE7QUFDbEIsWUFBSTtBQUNBLGdCQUFNLE9BQU8sT0FBTyxNQUFNLElBQUk7QUFBQSxRQUNsQyxRQUNNO0FBQ0YsaUJBQU8sS0FBSyxpQkFBaUIsS0FBSztBQUFBLFFBQ3RDO0FBQUEsTUFDSjtBQUNBLFlBQU0sYUFBYSxLQUFLLFNBQVMsS0FBSztBQUN0QyxVQUFJLGVBQWUsY0FBYyxRQUFRO0FBQ3JDLGVBQU8sS0FBSyxpQkFBaUIsS0FBSztBQUFBLE1BQ3RDO0FBQ0EsVUFBSSxNQUFNO0FBQ1YsWUFBTSxTQUFTLElBQUksWUFBVztBQUM5QixpQkFBVyxTQUFTLEtBQUssS0FBSyxRQUFRO0FBQ2xDLFlBQUksTUFBTSxTQUFTLE9BQU87QUFDdEIsZ0JBQU0sV0FBVyxNQUFNLFlBQVksTUFBTSxPQUFPLE1BQU0sUUFBUSxNQUFNLFFBQVEsTUFBTTtBQUNsRixjQUFJLFVBQVU7QUFDVixrQkFBTSxLQUFLLGdCQUFnQixPQUFPLEdBQUc7QUFDckMsOEJBQWtCLEtBQUs7QUFBQSxjQUNuQixNQUFNLGFBQWE7QUFBQSxjQUNuQixNQUFNO0FBQUEsY0FDTixTQUFTLE1BQU07QUFBQSxjQUNmLFdBQVcsTUFBTTtBQUFBLGNBQ2pCLFNBQVMsTUFBTTtBQUFBLFlBQ3ZDLENBQXFCO0FBQ0QsbUJBQU8sTUFBSztBQUFBLFVBQ2hCO0FBQUEsUUFDSixXQUNTLE1BQU0sU0FBUyxPQUFPO0FBQzNCLGdCQUFNLFNBQVMsTUFBTSxZQUFZLE1BQU0sT0FBTyxNQUFNLFFBQVEsTUFBTSxRQUFRLE1BQU07QUFDaEYsY0FBSSxRQUFRO0FBQ1Isa0JBQU0sS0FBSyxnQkFBZ0IsT0FBTyxHQUFHO0FBQ3JDLDhCQUFrQixLQUFLO0FBQUEsY0FDbkIsTUFBTSxhQUFhO0FBQUEsY0FDbkIsTUFBTTtBQUFBLGNBQ04sU0FBUyxNQUFNO0FBQUEsY0FDZixXQUFXLE1BQU07QUFBQSxjQUNqQixTQUFTLE1BQU07QUFBQSxZQUN2QyxDQUFxQjtBQUNELG1CQUFPLE1BQUs7QUFBQSxVQUNoQjtBQUFBLFFBQ0osV0FDUyxNQUFNLFNBQVMsY0FBYztBQUNsQyxjQUFJLE1BQU0sT0FBTyxNQUFNLFVBQVUsT0FBTyxDQUFDLEdBQUc7QUFDeEMsa0JBQU0sS0FBSyxnQkFBZ0IsT0FBTyxHQUFHO0FBQ3JDLDhCQUFrQixLQUFLO0FBQUEsY0FDbkIsTUFBTSxhQUFhO0FBQUEsY0FDbkIsWUFBWSxNQUFNO0FBQUEsY0FDbEIsU0FBUyxNQUFNO0FBQUEsWUFDdkMsQ0FBcUI7QUFDRCxtQkFBTyxNQUFLO0FBQUEsVUFDaEI7QUFBQSxRQUNKLE9BQ0s7QUFDRCxlQUFLLFlBQVksS0FBSztBQUFBLFFBQzFCO0FBQUEsTUFDSjtBQUNBLGFBQU8sRUFBRSxRQUFRLE9BQU8sT0FBTyxPQUFPLE1BQU0sS0FBSTtBQUFBLElBQ3BEO0FBQUEsSUFDQSxpQkFBaUIsT0FBTztBQUNwQixZQUFNLE1BQU0sS0FBSyxnQkFBZ0IsS0FBSztBQUN0Qyx3QkFBa0IsS0FBSztBQUFBLFFBQ25CLE1BQU0sYUFBYTtBQUFBLFFBQ25CLFVBQVUsY0FBYztBQUFBLFFBQ3hCLFVBQVUsSUFBSTtBQUFBLE1BQzFCLENBQVM7QUFDRCxhQUFPO0FBQUEsSUFDWDtBQUFBLElBQ0EsSUFBSSxPQUFPLFNBQVM7QUFDaEIsYUFBTyxLQUFLLFNBQVMsT0FBTyxPQUFPLE1BQU0sVUFBVSxTQUFTLE9BQU8sQ0FBQztBQUFBLElBQ3hFO0FBQUEsSUFDQSxHQUFHLE9BQU8sU0FBUztBQUNmLGFBQU8sS0FBSyxTQUFTLE9BQU8sT0FBTyxPQUFPLFVBQVUsU0FBUyxPQUFPLENBQUM7QUFBQSxJQUN6RTtBQUFBLElBQ0EsSUFBSSxPQUFPLFNBQVM7QUFDaEIsYUFBTyxLQUFLLFNBQVMsT0FBTyxPQUFPLE1BQU0sVUFBVSxTQUFTLE9BQU8sQ0FBQztBQUFBLElBQ3hFO0FBQUEsSUFDQSxHQUFHLE9BQU8sU0FBUztBQUNmLGFBQU8sS0FBSyxTQUFTLE9BQU8sT0FBTyxPQUFPLFVBQVUsU0FBUyxPQUFPLENBQUM7QUFBQSxJQUN6RTtBQUFBLElBQ0EsU0FBUyxNQUFNLE9BQU8sV0FBVyxTQUFTO0FBQ3RDLGFBQU8sSUFBSSxVQUFVO0FBQUEsUUFDakIsR0FBRyxLQUFLO0FBQUEsUUFDUixRQUFRO0FBQUEsVUFDSixHQUFHLEtBQUssS0FBSztBQUFBLFVBQ2I7QUFBQSxZQUNJO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBLFNBQVMsVUFBVSxTQUFTLE9BQU87QUFBQSxVQUN2RDtBQUFBLFFBQ0E7QUFBQSxNQUNBLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxVQUFVLE9BQU87QUFDYixhQUFPLElBQUksVUFBVTtBQUFBLFFBQ2pCLEdBQUcsS0FBSztBQUFBLFFBQ1IsUUFBUSxDQUFDLEdBQUcsS0FBSyxLQUFLLFFBQVEsS0FBSztBQUFBLE1BQy9DLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxTQUFTLFNBQVM7QUFDZCxhQUFPLEtBQUssVUFBVTtBQUFBLFFBQ2xCLE1BQU07QUFBQSxRQUNOLE9BQU8sT0FBTyxDQUFDO0FBQUEsUUFDZixXQUFXO0FBQUEsUUFDWCxTQUFTLFVBQVUsU0FBUyxPQUFPO0FBQUEsTUFDL0MsQ0FBUztBQUFBLElBQ0w7QUFBQSxJQUNBLFNBQVMsU0FBUztBQUNkLGFBQU8sS0FBSyxVQUFVO0FBQUEsUUFDbEIsTUFBTTtBQUFBLFFBQ04sT0FBTyxPQUFPLENBQUM7QUFBQSxRQUNmLFdBQVc7QUFBQSxRQUNYLFNBQVMsVUFBVSxTQUFTLE9BQU87QUFBQSxNQUMvQyxDQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0EsWUFBWSxTQUFTO0FBQ2pCLGFBQU8sS0FBSyxVQUFVO0FBQUEsUUFDbEIsTUFBTTtBQUFBLFFBQ04sT0FBTyxPQUFPLENBQUM7QUFBQSxRQUNmLFdBQVc7QUFBQSxRQUNYLFNBQVMsVUFBVSxTQUFTLE9BQU87QUFBQSxNQUMvQyxDQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0EsWUFBWSxTQUFTO0FBQ2pCLGFBQU8sS0FBSyxVQUFVO0FBQUEsUUFDbEIsTUFBTTtBQUFBLFFBQ04sT0FBTyxPQUFPLENBQUM7QUFBQSxRQUNmLFdBQVc7QUFBQSxRQUNYLFNBQVMsVUFBVSxTQUFTLE9BQU87QUFBQSxNQUMvQyxDQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0EsV0FBVyxPQUFPLFNBQVM7QUFDdkIsYUFBTyxLQUFLLFVBQVU7QUFBQSxRQUNsQixNQUFNO0FBQUEsUUFDTjtBQUFBLFFBQ0EsU0FBUyxVQUFVLFNBQVMsT0FBTztBQUFBLE1BQy9DLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxJQUFJLFdBQVc7QUFDWCxVQUFJLE1BQU07QUFDVixpQkFBVyxNQUFNLEtBQUssS0FBSyxRQUFRO0FBQy9CLFlBQUksR0FBRyxTQUFTLE9BQU87QUFDbkIsY0FBSSxRQUFRLFFBQVEsR0FBRyxRQUFRO0FBQzNCLGtCQUFNLEdBQUc7QUFBQSxRQUNqQjtBQUFBLE1BQ0o7QUFDQSxhQUFPO0FBQUEsSUFDWDtBQUFBLElBQ0EsSUFBSSxXQUFXO0FBQ1gsVUFBSSxNQUFNO0FBQ1YsaUJBQVcsTUFBTSxLQUFLLEtBQUssUUFBUTtBQUMvQixZQUFJLEdBQUcsU0FBUyxPQUFPO0FBQ25CLGNBQUksUUFBUSxRQUFRLEdBQUcsUUFBUTtBQUMzQixrQkFBTSxHQUFHO0FBQUEsUUFDakI7QUFBQSxNQUNKO0FBQ0EsYUFBTztBQUFBLElBQ1g7QUFBQSxFQUNKO0FBQ0EsWUFBVSxTQUFTLENBQUMsV0FBVztBQUMzQixXQUFPLElBQUksVUFBVTtBQUFBLE1BQ2pCLFFBQVEsQ0FBQTtBQUFBLE1BQ1IsVUFBVSxzQkFBc0I7QUFBQSxNQUNoQyxTQUFRLGlDQUFRLFdBQVU7QUFBQSxNQUMxQixHQUFHLG9CQUFvQixNQUFNO0FBQUEsSUFDckMsQ0FBSztBQUFBLEVBQ0w7QUFBQSxFQUNPLE1BQU0sbUJBQW1CLFFBQVE7QUFBQSxJQUNwQyxPQUFPLE9BQU87QUFDVixVQUFJLEtBQUssS0FBSyxRQUFRO0FBQ2xCLGNBQU0sT0FBTyxRQUFRLE1BQU0sSUFBSTtBQUFBLE1BQ25DO0FBQ0EsWUFBTSxhQUFhLEtBQUssU0FBUyxLQUFLO0FBQ3RDLFVBQUksZUFBZSxjQUFjLFNBQVM7QUFDdEMsY0FBTSxNQUFNLEtBQUssZ0JBQWdCLEtBQUs7QUFDdEMsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixNQUFNLGFBQWE7QUFBQSxVQUNuQixVQUFVLGNBQWM7QUFBQSxVQUN4QixVQUFVLElBQUk7QUFBQSxRQUM5QixDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxhQUFPLEdBQUcsTUFBTSxJQUFJO0FBQUEsSUFDeEI7QUFBQSxFQUNKO0FBQ0EsYUFBVyxTQUFTLENBQUMsV0FBVztBQUM1QixXQUFPLElBQUksV0FBVztBQUFBLE1BQ2xCLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsU0FBUSxpQ0FBUSxXQUFVO0FBQUEsTUFDMUIsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQUEsRUFDTyxNQUFNLGdCQUFnQixRQUFRO0FBQUEsSUFDakMsT0FBTyxPQUFPO0FBQ1YsVUFBSSxLQUFLLEtBQUssUUFBUTtBQUNsQixjQUFNLE9BQU8sSUFBSSxLQUFLLE1BQU0sSUFBSTtBQUFBLE1BQ3BDO0FBQ0EsWUFBTSxhQUFhLEtBQUssU0FBUyxLQUFLO0FBQ3RDLFVBQUksZUFBZSxjQUFjLE1BQU07QUFDbkMsY0FBTUEsT0FBTSxLQUFLLGdCQUFnQixLQUFLO0FBQ3RDLDBCQUFrQkEsTUFBSztBQUFBLFVBQ25CLE1BQU0sYUFBYTtBQUFBLFVBQ25CLFVBQVUsY0FBYztBQUFBLFVBQ3hCLFVBQVVBLEtBQUk7QUFBQSxRQUM5QixDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxVQUFJLE9BQU8sTUFBTSxNQUFNLEtBQUssUUFBTyxDQUFFLEdBQUc7QUFDcEMsY0FBTUEsT0FBTSxLQUFLLGdCQUFnQixLQUFLO0FBQ3RDLDBCQUFrQkEsTUFBSztBQUFBLFVBQ25CLE1BQU0sYUFBYTtBQUFBLFFBQ25DLENBQWE7QUFDRCxlQUFPO0FBQUEsTUFDWDtBQUNBLFlBQU0sU0FBUyxJQUFJLFlBQVc7QUFDOUIsVUFBSSxNQUFNO0FBQ1YsaUJBQVcsU0FBUyxLQUFLLEtBQUssUUFBUTtBQUNsQyxZQUFJLE1BQU0sU0FBUyxPQUFPO0FBQ3RCLGNBQUksTUFBTSxLQUFLLFFBQU8sSUFBSyxNQUFNLE9BQU87QUFDcEMsa0JBQU0sS0FBSyxnQkFBZ0IsT0FBTyxHQUFHO0FBQ3JDLDhCQUFrQixLQUFLO0FBQUEsY0FDbkIsTUFBTSxhQUFhO0FBQUEsY0FDbkIsU0FBUyxNQUFNO0FBQUEsY0FDZixXQUFXO0FBQUEsY0FDWCxPQUFPO0FBQUEsY0FDUCxTQUFTLE1BQU07QUFBQSxjQUNmLE1BQU07QUFBQSxZQUM5QixDQUFxQjtBQUNELG1CQUFPLE1BQUs7QUFBQSxVQUNoQjtBQUFBLFFBQ0osV0FDUyxNQUFNLFNBQVMsT0FBTztBQUMzQixjQUFJLE1BQU0sS0FBSyxRQUFPLElBQUssTUFBTSxPQUFPO0FBQ3BDLGtCQUFNLEtBQUssZ0JBQWdCLE9BQU8sR0FBRztBQUNyQyw4QkFBa0IsS0FBSztBQUFBLGNBQ25CLE1BQU0sYUFBYTtBQUFBLGNBQ25CLFNBQVMsTUFBTTtBQUFBLGNBQ2YsV0FBVztBQUFBLGNBQ1gsT0FBTztBQUFBLGNBQ1AsU0FBUyxNQUFNO0FBQUEsY0FDZixNQUFNO0FBQUEsWUFDOUIsQ0FBcUI7QUFDRCxtQkFBTyxNQUFLO0FBQUEsVUFDaEI7QUFBQSxRQUNKLE9BQ0s7QUFDRCxlQUFLLFlBQVksS0FBSztBQUFBLFFBQzFCO0FBQUEsTUFDSjtBQUNBLGFBQU87QUFBQSxRQUNILFFBQVEsT0FBTztBQUFBLFFBQ2YsT0FBTyxJQUFJLEtBQUssTUFBTSxLQUFLLFFBQU8sQ0FBRTtBQUFBLE1BQ2hEO0FBQUEsSUFDSTtBQUFBLElBQ0EsVUFBVSxPQUFPO0FBQ2IsYUFBTyxJQUFJLFFBQVE7QUFBQSxRQUNmLEdBQUcsS0FBSztBQUFBLFFBQ1IsUUFBUSxDQUFDLEdBQUcsS0FBSyxLQUFLLFFBQVEsS0FBSztBQUFBLE1BQy9DLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxJQUFJLFNBQVMsU0FBUztBQUNsQixhQUFPLEtBQUssVUFBVTtBQUFBLFFBQ2xCLE1BQU07QUFBQSxRQUNOLE9BQU8sUUFBUSxRQUFPO0FBQUEsUUFDdEIsU0FBUyxVQUFVLFNBQVMsT0FBTztBQUFBLE1BQy9DLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxJQUFJLFNBQVMsU0FBUztBQUNsQixhQUFPLEtBQUssVUFBVTtBQUFBLFFBQ2xCLE1BQU07QUFBQSxRQUNOLE9BQU8sUUFBUSxRQUFPO0FBQUEsUUFDdEIsU0FBUyxVQUFVLFNBQVMsT0FBTztBQUFBLE1BQy9DLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxJQUFJLFVBQVU7QUFDVixVQUFJLE1BQU07QUFDVixpQkFBVyxNQUFNLEtBQUssS0FBSyxRQUFRO0FBQy9CLFlBQUksR0FBRyxTQUFTLE9BQU87QUFDbkIsY0FBSSxRQUFRLFFBQVEsR0FBRyxRQUFRO0FBQzNCLGtCQUFNLEdBQUc7QUFBQSxRQUNqQjtBQUFBLE1BQ0o7QUFDQSxhQUFPLE9BQU8sT0FBTyxJQUFJLEtBQUssR0FBRyxJQUFJO0FBQUEsSUFDekM7QUFBQSxJQUNBLElBQUksVUFBVTtBQUNWLFVBQUksTUFBTTtBQUNWLGlCQUFXLE1BQU0sS0FBSyxLQUFLLFFBQVE7QUFDL0IsWUFBSSxHQUFHLFNBQVMsT0FBTztBQUNuQixjQUFJLFFBQVEsUUFBUSxHQUFHLFFBQVE7QUFDM0Isa0JBQU0sR0FBRztBQUFBLFFBQ2pCO0FBQUEsTUFDSjtBQUNBLGFBQU8sT0FBTyxPQUFPLElBQUksS0FBSyxHQUFHLElBQUk7QUFBQSxJQUN6QztBQUFBLEVBQ0o7QUFDQSxVQUFRLFNBQVMsQ0FBQyxXQUFXO0FBQ3pCLFdBQU8sSUFBSSxRQUFRO0FBQUEsTUFDZixRQUFRLENBQUE7QUFBQSxNQUNSLFNBQVEsaUNBQVEsV0FBVTtBQUFBLE1BQzFCLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQUEsRUFDTyxNQUFNLGtCQUFrQixRQUFRO0FBQUEsSUFDbkMsT0FBTyxPQUFPO0FBQ1YsWUFBTSxhQUFhLEtBQUssU0FBUyxLQUFLO0FBQ3RDLFVBQUksZUFBZSxjQUFjLFFBQVE7QUFDckMsY0FBTSxNQUFNLEtBQUssZ0JBQWdCLEtBQUs7QUFDdEMsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixNQUFNLGFBQWE7QUFBQSxVQUNuQixVQUFVLGNBQWM7QUFBQSxVQUN4QixVQUFVLElBQUk7QUFBQSxRQUM5QixDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxhQUFPLEdBQUcsTUFBTSxJQUFJO0FBQUEsSUFDeEI7QUFBQSxFQUNKO0FBQ0EsWUFBVSxTQUFTLENBQUMsV0FBVztBQUMzQixXQUFPLElBQUksVUFBVTtBQUFBLE1BQ2pCLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQUEsRUFDTyxNQUFNLHFCQUFxQixRQUFRO0FBQUEsSUFDdEMsT0FBTyxPQUFPO0FBQ1YsWUFBTSxhQUFhLEtBQUssU0FBUyxLQUFLO0FBQ3RDLFVBQUksZUFBZSxjQUFjLFdBQVc7QUFDeEMsY0FBTSxNQUFNLEtBQUssZ0JBQWdCLEtBQUs7QUFDdEMsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixNQUFNLGFBQWE7QUFBQSxVQUNuQixVQUFVLGNBQWM7QUFBQSxVQUN4QixVQUFVLElBQUk7QUFBQSxRQUM5QixDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxhQUFPLEdBQUcsTUFBTSxJQUFJO0FBQUEsSUFDeEI7QUFBQSxFQUNKO0FBQ0EsZUFBYSxTQUFTLENBQUMsV0FBVztBQUM5QixXQUFPLElBQUksYUFBYTtBQUFBLE1BQ3BCLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQUEsRUFDTyxNQUFNLGdCQUFnQixRQUFRO0FBQUEsSUFDakMsT0FBTyxPQUFPO0FBQ1YsWUFBTSxhQUFhLEtBQUssU0FBUyxLQUFLO0FBQ3RDLFVBQUksZUFBZSxjQUFjLE1BQU07QUFDbkMsY0FBTSxNQUFNLEtBQUssZ0JBQWdCLEtBQUs7QUFDdEMsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixNQUFNLGFBQWE7QUFBQSxVQUNuQixVQUFVLGNBQWM7QUFBQSxVQUN4QixVQUFVLElBQUk7QUFBQSxRQUM5QixDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxhQUFPLEdBQUcsTUFBTSxJQUFJO0FBQUEsSUFDeEI7QUFBQSxFQUNKO0FBQ0EsVUFBUSxTQUFTLENBQUMsV0FBVztBQUN6QixXQUFPLElBQUksUUFBUTtBQUFBLE1BQ2YsVUFBVSxzQkFBc0I7QUFBQSxNQUNoQyxHQUFHLG9CQUFvQixNQUFNO0FBQUEsSUFDckMsQ0FBSztBQUFBLEVBQ0w7QUFBQSxFQUNPLE1BQU0sZUFBZSxRQUFRO0FBQUEsSUFDaEMsY0FBYztBQUNWLFlBQU0sR0FBRyxTQUFTO0FBRWxCLFdBQUssT0FBTztBQUFBLElBQ2hCO0FBQUEsSUFDQSxPQUFPLE9BQU87QUFDVixhQUFPLEdBQUcsTUFBTSxJQUFJO0FBQUEsSUFDeEI7QUFBQSxFQUNKO0FBQ0EsU0FBTyxTQUFTLENBQUMsV0FBVztBQUN4QixXQUFPLElBQUksT0FBTztBQUFBLE1BQ2QsVUFBVSxzQkFBc0I7QUFBQSxNQUNoQyxHQUFHLG9CQUFvQixNQUFNO0FBQUEsSUFDckMsQ0FBSztBQUFBLEVBQ0w7QUFBQSxFQUNPLE1BQU0sbUJBQW1CLFFBQVE7QUFBQSxJQUNwQyxjQUFjO0FBQ1YsWUFBTSxHQUFHLFNBQVM7QUFFbEIsV0FBSyxXQUFXO0FBQUEsSUFDcEI7QUFBQSxJQUNBLE9BQU8sT0FBTztBQUNWLGFBQU8sR0FBRyxNQUFNLElBQUk7QUFBQSxJQUN4QjtBQUFBLEVBQ0o7QUFDQSxhQUFXLFNBQVMsQ0FBQyxXQUFXO0FBQzVCLFdBQU8sSUFBSSxXQUFXO0FBQUEsTUFDbEIsVUFBVSxzQkFBc0I7QUFBQSxNQUNoQyxHQUFHLG9CQUFvQixNQUFNO0FBQUEsSUFDckMsQ0FBSztBQUFBLEVBQ0w7QUFBQSxFQUNPLE1BQU0saUJBQWlCLFFBQVE7QUFBQSxJQUNsQyxPQUFPLE9BQU87QUFDVixZQUFNLE1BQU0sS0FBSyxnQkFBZ0IsS0FBSztBQUN0Qyx3QkFBa0IsS0FBSztBQUFBLFFBQ25CLE1BQU0sYUFBYTtBQUFBLFFBQ25CLFVBQVUsY0FBYztBQUFBLFFBQ3hCLFVBQVUsSUFBSTtBQUFBLE1BQzFCLENBQVM7QUFDRCxhQUFPO0FBQUEsSUFDWDtBQUFBLEVBQ0o7QUFDQSxXQUFTLFNBQVMsQ0FBQyxXQUFXO0FBQzFCLFdBQU8sSUFBSSxTQUFTO0FBQUEsTUFDaEIsVUFBVSxzQkFBc0I7QUFBQSxNQUNoQyxHQUFHLG9CQUFvQixNQUFNO0FBQUEsSUFDckMsQ0FBSztBQUFBLEVBQ0w7QUFBQSxFQUNPLE1BQU0sZ0JBQWdCLFFBQVE7QUFBQSxJQUNqQyxPQUFPLE9BQU87QUFDVixZQUFNLGFBQWEsS0FBSyxTQUFTLEtBQUs7QUFDdEMsVUFBSSxlQUFlLGNBQWMsV0FBVztBQUN4QyxjQUFNLE1BQU0sS0FBSyxnQkFBZ0IsS0FBSztBQUN0QywwQkFBa0IsS0FBSztBQUFBLFVBQ25CLE1BQU0sYUFBYTtBQUFBLFVBQ25CLFVBQVUsY0FBYztBQUFBLFVBQ3hCLFVBQVUsSUFBSTtBQUFBLFFBQzlCLENBQWE7QUFDRCxlQUFPO0FBQUEsTUFDWDtBQUNBLGFBQU8sR0FBRyxNQUFNLElBQUk7QUFBQSxJQUN4QjtBQUFBLEVBQ0o7QUFDQSxVQUFRLFNBQVMsQ0FBQyxXQUFXO0FBQ3pCLFdBQU8sSUFBSSxRQUFRO0FBQUEsTUFDZixVQUFVLHNCQUFzQjtBQUFBLE1BQ2hDLEdBQUcsb0JBQW9CLE1BQU07QUFBQSxJQUNyQyxDQUFLO0FBQUEsRUFDTDtBQUFBLEVBQ08sTUFBTSxpQkFBaUIsUUFBUTtBQUFBLElBQ2xDLE9BQU8sT0FBTztBQUNWLFlBQU0sRUFBRSxLQUFLLE9BQU0sSUFBSyxLQUFLLG9CQUFvQixLQUFLO0FBQ3RELFlBQU0sTUFBTSxLQUFLO0FBQ2pCLFVBQUksSUFBSSxlQUFlLGNBQWMsT0FBTztBQUN4QywwQkFBa0IsS0FBSztBQUFBLFVBQ25CLE1BQU0sYUFBYTtBQUFBLFVBQ25CLFVBQVUsY0FBYztBQUFBLFVBQ3hCLFVBQVUsSUFBSTtBQUFBLFFBQzlCLENBQWE7QUFDRCxlQUFPO0FBQUEsTUFDWDtBQUNBLFVBQUksSUFBSSxnQkFBZ0IsTUFBTTtBQUMxQixjQUFNLFNBQVMsSUFBSSxLQUFLLFNBQVMsSUFBSSxZQUFZO0FBQ2pELGNBQU0sV0FBVyxJQUFJLEtBQUssU0FBUyxJQUFJLFlBQVk7QUFDbkQsWUFBSSxVQUFVLFVBQVU7QUFDcEIsNEJBQWtCLEtBQUs7QUFBQSxZQUNuQixNQUFNLFNBQVMsYUFBYSxVQUFVLGFBQWE7QUFBQSxZQUNuRCxTQUFVLFdBQVcsSUFBSSxZQUFZLFFBQVE7QUFBQSxZQUM3QyxTQUFVLFNBQVMsSUFBSSxZQUFZLFFBQVE7QUFBQSxZQUMzQyxNQUFNO0FBQUEsWUFDTixXQUFXO0FBQUEsWUFDWCxPQUFPO0FBQUEsWUFDUCxTQUFTLElBQUksWUFBWTtBQUFBLFVBQzdDLENBQWlCO0FBQ0QsaUJBQU8sTUFBSztBQUFBLFFBQ2hCO0FBQUEsTUFDSjtBQUNBLFVBQUksSUFBSSxjQUFjLE1BQU07QUFDeEIsWUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLFVBQVUsT0FBTztBQUN2Qyw0QkFBa0IsS0FBSztBQUFBLFlBQ25CLE1BQU0sYUFBYTtBQUFBLFlBQ25CLFNBQVMsSUFBSSxVQUFVO0FBQUEsWUFDdkIsTUFBTTtBQUFBLFlBQ04sV0FBVztBQUFBLFlBQ1gsT0FBTztBQUFBLFlBQ1AsU0FBUyxJQUFJLFVBQVU7QUFBQSxVQUMzQyxDQUFpQjtBQUNELGlCQUFPLE1BQUs7QUFBQSxRQUNoQjtBQUFBLE1BQ0o7QUFDQSxVQUFJLElBQUksY0FBYyxNQUFNO0FBQ3hCLFlBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxVQUFVLE9BQU87QUFDdkMsNEJBQWtCLEtBQUs7QUFBQSxZQUNuQixNQUFNLGFBQWE7QUFBQSxZQUNuQixTQUFTLElBQUksVUFBVTtBQUFBLFlBQ3ZCLE1BQU07QUFBQSxZQUNOLFdBQVc7QUFBQSxZQUNYLE9BQU87QUFBQSxZQUNQLFNBQVMsSUFBSSxVQUFVO0FBQUEsVUFDM0MsQ0FBaUI7QUFDRCxpQkFBTyxNQUFLO0FBQUEsUUFDaEI7QUFBQSxNQUNKO0FBQ0EsVUFBSSxJQUFJLE9BQU8sT0FBTztBQUNsQixlQUFPLFFBQVEsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sTUFBTTtBQUM5QyxpQkFBTyxJQUFJLEtBQUssWUFBWSxJQUFJLG1CQUFtQixLQUFLLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQztBQUFBLFFBQzlFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQ0YsWUFBVztBQUNqQixpQkFBTyxZQUFZLFdBQVcsUUFBUUEsT0FBTTtBQUFBLFFBQ2hELENBQUM7QUFBQSxNQUNMO0FBQ0EsWUFBTUEsVUFBUyxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sTUFBTTtBQUMxQyxlQUFPLElBQUksS0FBSyxXQUFXLElBQUksbUJBQW1CLEtBQUssTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDO0FBQUEsTUFDN0UsQ0FBQztBQUNELGFBQU8sWUFBWSxXQUFXLFFBQVFBLE9BQU07QUFBQSxJQUNoRDtBQUFBLElBQ0EsSUFBSSxVQUFVO0FBQ1YsYUFBTyxLQUFLLEtBQUs7QUFBQSxJQUNyQjtBQUFBLElBQ0EsSUFBSSxXQUFXLFNBQVM7QUFDcEIsYUFBTyxJQUFJLFNBQVM7QUFBQSxRQUNoQixHQUFHLEtBQUs7QUFBQSxRQUNSLFdBQVcsRUFBRSxPQUFPLFdBQVcsU0FBUyxVQUFVLFNBQVMsT0FBTyxFQUFDO0FBQUEsTUFDL0UsQ0FBUztBQUFBLElBQ0w7QUFBQSxJQUNBLElBQUksV0FBVyxTQUFTO0FBQ3BCLGFBQU8sSUFBSSxTQUFTO0FBQUEsUUFDaEIsR0FBRyxLQUFLO0FBQUEsUUFDUixXQUFXLEVBQUUsT0FBTyxXQUFXLFNBQVMsVUFBVSxTQUFTLE9BQU8sRUFBQztBQUFBLE1BQy9FLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxPQUFPLEtBQUssU0FBUztBQUNqQixhQUFPLElBQUksU0FBUztBQUFBLFFBQ2hCLEdBQUcsS0FBSztBQUFBLFFBQ1IsYUFBYSxFQUFFLE9BQU8sS0FBSyxTQUFTLFVBQVUsU0FBUyxPQUFPLEVBQUM7QUFBQSxNQUMzRSxDQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0EsU0FBUyxTQUFTO0FBQ2QsYUFBTyxLQUFLLElBQUksR0FBRyxPQUFPO0FBQUEsSUFDOUI7QUFBQSxFQUNKO0FBQ0EsV0FBUyxTQUFTLENBQUMsUUFBUSxXQUFXO0FBQ2xDLFdBQU8sSUFBSSxTQUFTO0FBQUEsTUFDaEIsTUFBTTtBQUFBLE1BQ04sV0FBVztBQUFBLE1BQ1gsV0FBVztBQUFBLE1BQ1gsYUFBYTtBQUFBLE1BQ2IsVUFBVSxzQkFBc0I7QUFBQSxNQUNoQyxHQUFHLG9CQUFvQixNQUFNO0FBQUEsSUFDckMsQ0FBSztBQUFBLEVBQ0w7QUFDQSxXQUFTLGVBQWUsUUFBUTtBQUM1QixRQUFJLGtCQUFrQixXQUFXO0FBQzdCLFlBQU0sV0FBVyxDQUFBO0FBQ2pCLGlCQUFXLE9BQU8sT0FBTyxPQUFPO0FBQzVCLGNBQU0sY0FBYyxPQUFPLE1BQU0sR0FBRztBQUNwQyxpQkFBUyxHQUFHLElBQUksWUFBWSxPQUFPLGVBQWUsV0FBVyxDQUFDO0FBQUEsTUFDbEU7QUFDQSxhQUFPLElBQUksVUFBVTtBQUFBLFFBQ2pCLEdBQUcsT0FBTztBQUFBLFFBQ1YsT0FBTyxNQUFNO0FBQUEsTUFDekIsQ0FBUztBQUFBLElBQ0wsV0FDUyxrQkFBa0IsVUFBVTtBQUNqQyxhQUFPLElBQUksU0FBUztBQUFBLFFBQ2hCLEdBQUcsT0FBTztBQUFBLFFBQ1YsTUFBTSxlQUFlLE9BQU8sT0FBTztBQUFBLE1BQy9DLENBQVM7QUFBQSxJQUNMLFdBQ1Msa0JBQWtCLGFBQWE7QUFDcEMsYUFBTyxZQUFZLE9BQU8sZUFBZSxPQUFPLE9BQU0sQ0FBRSxDQUFDO0FBQUEsSUFDN0QsV0FDUyxrQkFBa0IsYUFBYTtBQUNwQyxhQUFPLFlBQVksT0FBTyxlQUFlLE9BQU8sT0FBTSxDQUFFLENBQUM7QUFBQSxJQUM3RCxXQUNTLGtCQUFrQixVQUFVO0FBQ2pDLGFBQU8sU0FBUyxPQUFPLE9BQU8sTUFBTSxJQUFJLENBQUMsU0FBUyxlQUFlLElBQUksQ0FBQyxDQUFDO0FBQUEsSUFDM0UsT0FDSztBQUNELGFBQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUFBLEVBQ08sTUFBTSxrQkFBa0IsUUFBUTtBQUFBLElBQ25DLGNBQWM7QUFDVixZQUFNLEdBQUcsU0FBUztBQUNsQixXQUFLLFVBQVU7QUFLZixXQUFLLFlBQVksS0FBSztBQXFDdEIsV0FBSyxVQUFVLEtBQUs7QUFBQSxJQUN4QjtBQUFBLElBQ0EsYUFBYTtBQUNULFVBQUksS0FBSyxZQUFZO0FBQ2pCLGVBQU8sS0FBSztBQUNoQixZQUFNLFFBQVEsS0FBSyxLQUFLLE1BQUs7QUFDN0IsWUFBTSxPQUFPLEtBQUssV0FBVyxLQUFLO0FBQ2xDLFdBQUssVUFBVSxFQUFFLE9BQU8sS0FBSTtBQUM1QixhQUFPLEtBQUs7QUFBQSxJQUNoQjtBQUFBLElBQ0EsT0FBTyxPQUFPO0FBQ1YsWUFBTSxhQUFhLEtBQUssU0FBUyxLQUFLO0FBQ3RDLFVBQUksZUFBZSxjQUFjLFFBQVE7QUFDckMsY0FBTUUsT0FBTSxLQUFLLGdCQUFnQixLQUFLO0FBQ3RDLDBCQUFrQkEsTUFBSztBQUFBLFVBQ25CLE1BQU0sYUFBYTtBQUFBLFVBQ25CLFVBQVUsY0FBYztBQUFBLFVBQ3hCLFVBQVVBLEtBQUk7QUFBQSxRQUM5QixDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxZQUFNLEVBQUUsUUFBUSxJQUFHLElBQUssS0FBSyxvQkFBb0IsS0FBSztBQUN0RCxZQUFNLEVBQUUsT0FBTyxNQUFNLFVBQVMsSUFBSyxLQUFLLFdBQVU7QUFDbEQsWUFBTSxZQUFZLENBQUE7QUFDbEIsVUFBSSxFQUFFLEtBQUssS0FBSyxvQkFBb0IsWUFBWSxLQUFLLEtBQUssZ0JBQWdCLFVBQVU7QUFDaEYsbUJBQVcsT0FBTyxJQUFJLE1BQU07QUFDeEIsY0FBSSxDQUFDLFVBQVUsU0FBUyxHQUFHLEdBQUc7QUFDMUIsc0JBQVUsS0FBSyxHQUFHO0FBQUEsVUFDdEI7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUNBLFlBQU0sUUFBUSxDQUFBO0FBQ2QsaUJBQVcsT0FBTyxXQUFXO0FBQ3pCLGNBQU0sZUFBZSxNQUFNLEdBQUc7QUFDOUIsY0FBTSxRQUFRLElBQUksS0FBSyxHQUFHO0FBQzFCLGNBQU0sS0FBSztBQUFBLFVBQ1AsS0FBSyxFQUFFLFFBQVEsU0FBUyxPQUFPLElBQUc7QUFBQSxVQUNsQyxPQUFPLGFBQWEsT0FBTyxJQUFJLG1CQUFtQixLQUFLLE9BQU8sSUFBSSxNQUFNLEdBQUcsQ0FBQztBQUFBLFVBQzVFLFdBQVcsT0FBTyxJQUFJO0FBQUEsUUFDdEMsQ0FBYTtBQUFBLE1BQ0w7QUFDQSxVQUFJLEtBQUssS0FBSyxvQkFBb0IsVUFBVTtBQUN4QyxjQUFNLGNBQWMsS0FBSyxLQUFLO0FBQzlCLFlBQUksZ0JBQWdCLGVBQWU7QUFDL0IscUJBQVcsT0FBTyxXQUFXO0FBQ3pCLGtCQUFNLEtBQUs7QUFBQSxjQUNQLEtBQUssRUFBRSxRQUFRLFNBQVMsT0FBTyxJQUFHO0FBQUEsY0FDbEMsT0FBTyxFQUFFLFFBQVEsU0FBUyxPQUFPLElBQUksS0FBSyxHQUFHLEVBQUM7QUFBQSxZQUN0RSxDQUFxQjtBQUFBLFVBQ0w7QUFBQSxRQUNKLFdBQ1MsZ0JBQWdCLFVBQVU7QUFDL0IsY0FBSSxVQUFVLFNBQVMsR0FBRztBQUN0Qiw4QkFBa0IsS0FBSztBQUFBLGNBQ25CLE1BQU0sYUFBYTtBQUFBLGNBQ25CLE1BQU07QUFBQSxZQUM5QixDQUFxQjtBQUNELG1CQUFPLE1BQUs7QUFBQSxVQUNoQjtBQUFBLFFBQ0osV0FDUyxnQkFBZ0IsUUFBUztBQUFBLGFBRTdCO0FBQ0QsZ0JBQU0sSUFBSSxNQUFNLHNEQUFzRDtBQUFBLFFBQzFFO0FBQUEsTUFDSixPQUNLO0FBRUQsY0FBTSxXQUFXLEtBQUssS0FBSztBQUMzQixtQkFBVyxPQUFPLFdBQVc7QUFDekIsZ0JBQU0sUUFBUSxJQUFJLEtBQUssR0FBRztBQUMxQixnQkFBTSxLQUFLO0FBQUEsWUFDUCxLQUFLLEVBQUUsUUFBUSxTQUFTLE9BQU8sSUFBRztBQUFBLFlBQ2xDLE9BQU8sU0FBUztBQUFBLGNBQU8sSUFBSSxtQkFBbUIsS0FBSyxPQUFPLElBQUksTUFBTSxHQUFHO0FBQUE7QUFBQSxZQUMzRjtBQUFBLFlBQ29CLFdBQVcsT0FBTyxJQUFJO0FBQUEsVUFDMUMsQ0FBaUI7QUFBQSxRQUNMO0FBQUEsTUFDSjtBQUNBLFVBQUksSUFBSSxPQUFPLE9BQU87QUFDbEIsZUFBTyxRQUFRLFFBQU8sRUFDakIsS0FBSyxZQUFZO0FBQ2xCLGdCQUFNLFlBQVksQ0FBQTtBQUNsQixxQkFBVyxRQUFRLE9BQU87QUFDdEIsa0JBQU0sTUFBTSxNQUFNLEtBQUs7QUFDdkIsa0JBQU0sUUFBUSxNQUFNLEtBQUs7QUFDekIsc0JBQVUsS0FBSztBQUFBLGNBQ1g7QUFBQSxjQUNBO0FBQUEsY0FDQSxXQUFXLEtBQUs7QUFBQSxZQUN4QyxDQUFxQjtBQUFBLFVBQ0w7QUFDQSxpQkFBTztBQUFBLFFBQ1gsQ0FBQyxFQUNJLEtBQUssQ0FBQyxjQUFjO0FBQ3JCLGlCQUFPLFlBQVksZ0JBQWdCLFFBQVEsU0FBUztBQUFBLFFBQ3hELENBQUM7QUFBQSxNQUNMLE9BQ0s7QUFDRCxlQUFPLFlBQVksZ0JBQWdCLFFBQVEsS0FBSztBQUFBLE1BQ3BEO0FBQUEsSUFDSjtBQUFBLElBQ0EsSUFBSSxRQUFRO0FBQ1IsYUFBTyxLQUFLLEtBQUssTUFBSztBQUFBLElBQzFCO0FBQUEsSUFDQSxPQUFPLFNBQVM7QUFDWixnQkFBVTtBQUNWLGFBQU8sSUFBSSxVQUFVO0FBQUEsUUFDakIsR0FBRyxLQUFLO0FBQUEsUUFDUixhQUFhO0FBQUEsUUFDYixHQUFJLFlBQVksU0FDVjtBQUFBLFVBQ0UsVUFBVSxDQUFDLE9BQU8sUUFBUTs7QUFDdEIsa0JBQU0saUJBQWUsZ0JBQUssTUFBSyxhQUFWLDRCQUFxQixPQUFPLEtBQUssWUFBVyxJQUFJO0FBQ3JFLGdCQUFJLE1BQU0sU0FBUztBQUNmLHFCQUFPO0FBQUEsZ0JBQ0gsU0FBUyxVQUFVLFNBQVMsT0FBTyxFQUFFLFdBQVc7QUFBQSxjQUNoRjtBQUN3QixtQkFBTztBQUFBLGNBQ0gsU0FBUztBQUFBLFlBQ3JDO0FBQUEsVUFDb0I7QUFBQSxRQUNwQixJQUNrQjtNQUNsQixDQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0EsUUFBUTtBQUNKLGFBQU8sSUFBSSxVQUFVO0FBQUEsUUFDakIsR0FBRyxLQUFLO0FBQUEsUUFDUixhQUFhO0FBQUEsTUFDekIsQ0FBUztBQUFBLElBQ0w7QUFBQSxJQUNBLGNBQWM7QUFDVixhQUFPLElBQUksVUFBVTtBQUFBLFFBQ2pCLEdBQUcsS0FBSztBQUFBLFFBQ1IsYUFBYTtBQUFBLE1BQ3pCLENBQVM7QUFBQSxJQUNMO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBa0JBLE9BQU8sY0FBYztBQUNqQixhQUFPLElBQUksVUFBVTtBQUFBLFFBQ2pCLEdBQUcsS0FBSztBQUFBLFFBQ1IsT0FBTyxPQUFPO0FBQUEsVUFDVixHQUFHLEtBQUssS0FBSyxNQUFLO0FBQUEsVUFDbEIsR0FBRztBQUFBLFFBQ25CO0FBQUEsTUFDQSxDQUFTO0FBQUEsSUFDTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1BLE1BQU0sU0FBUztBQUNYLFlBQU0sU0FBUyxJQUFJLFVBQVU7QUFBQSxRQUN6QixhQUFhLFFBQVEsS0FBSztBQUFBLFFBQzFCLFVBQVUsUUFBUSxLQUFLO0FBQUEsUUFDdkIsT0FBTyxPQUFPO0FBQUEsVUFDVixHQUFHLEtBQUssS0FBSyxNQUFLO0FBQUEsVUFDbEIsR0FBRyxRQUFRLEtBQUssTUFBSztBQUFBLFFBQ3JDO0FBQUEsUUFDWSxVQUFVLHNCQUFzQjtBQUFBLE1BQzVDLENBQVM7QUFDRCxhQUFPO0FBQUEsSUFDWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQW9DQSxPQUFPLEtBQUssUUFBUTtBQUNoQixhQUFPLEtBQUssUUFBUSxFQUFFLENBQUMsR0FBRyxHQUFHLE9BQU0sQ0FBRTtBQUFBLElBQ3pDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFzQkEsU0FBUyxPQUFPO0FBQ1osYUFBTyxJQUFJLFVBQVU7QUFBQSxRQUNqQixHQUFHLEtBQUs7QUFBQSxRQUNSLFVBQVU7QUFBQSxNQUN0QixDQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0EsS0FBSyxNQUFNO0FBQ1AsWUFBTSxRQUFRLENBQUE7QUFDZCxpQkFBVyxPQUFPLEtBQUssV0FBVyxJQUFJLEdBQUc7QUFDckMsWUFBSSxLQUFLLEdBQUcsS0FBSyxLQUFLLE1BQU0sR0FBRyxHQUFHO0FBQzlCLGdCQUFNLEdBQUcsSUFBSSxLQUFLLE1BQU0sR0FBRztBQUFBLFFBQy9CO0FBQUEsTUFDSjtBQUNBLGFBQU8sSUFBSSxVQUFVO0FBQUEsUUFDakIsR0FBRyxLQUFLO0FBQUEsUUFDUixPQUFPLE1BQU07QUFBQSxNQUN6QixDQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0EsS0FBSyxNQUFNO0FBQ1AsWUFBTSxRQUFRLENBQUE7QUFDZCxpQkFBVyxPQUFPLEtBQUssV0FBVyxLQUFLLEtBQUssR0FBRztBQUMzQyxZQUFJLENBQUMsS0FBSyxHQUFHLEdBQUc7QUFDWixnQkFBTSxHQUFHLElBQUksS0FBSyxNQUFNLEdBQUc7QUFBQSxRQUMvQjtBQUFBLE1BQ0o7QUFDQSxhQUFPLElBQUksVUFBVTtBQUFBLFFBQ2pCLEdBQUcsS0FBSztBQUFBLFFBQ1IsT0FBTyxNQUFNO0FBQUEsTUFDekIsQ0FBUztBQUFBLElBQ0w7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlBLGNBQWM7QUFDVixhQUFPLGVBQWUsSUFBSTtBQUFBLElBQzlCO0FBQUEsSUFDQSxRQUFRLE1BQU07QUFDVixZQUFNLFdBQVcsQ0FBQTtBQUNqQixpQkFBVyxPQUFPLEtBQUssV0FBVyxLQUFLLEtBQUssR0FBRztBQUMzQyxjQUFNLGNBQWMsS0FBSyxNQUFNLEdBQUc7QUFDbEMsWUFBSSxRQUFRLENBQUMsS0FBSyxHQUFHLEdBQUc7QUFDcEIsbUJBQVMsR0FBRyxJQUFJO0FBQUEsUUFDcEIsT0FDSztBQUNELG1CQUFTLEdBQUcsSUFBSSxZQUFZLFNBQVE7QUFBQSxRQUN4QztBQUFBLE1BQ0o7QUFDQSxhQUFPLElBQUksVUFBVTtBQUFBLFFBQ2pCLEdBQUcsS0FBSztBQUFBLFFBQ1IsT0FBTyxNQUFNO0FBQUEsTUFDekIsQ0FBUztBQUFBLElBQ0w7QUFBQSxJQUNBLFNBQVMsTUFBTTtBQUNYLFlBQU0sV0FBVyxDQUFBO0FBQ2pCLGlCQUFXLE9BQU8sS0FBSyxXQUFXLEtBQUssS0FBSyxHQUFHO0FBQzNDLFlBQUksUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHO0FBQ3BCLG1CQUFTLEdBQUcsSUFBSSxLQUFLLE1BQU0sR0FBRztBQUFBLFFBQ2xDLE9BQ0s7QUFDRCxnQkFBTSxjQUFjLEtBQUssTUFBTSxHQUFHO0FBQ2xDLGNBQUksV0FBVztBQUNmLGlCQUFPLG9CQUFvQixhQUFhO0FBQ3BDLHVCQUFXLFNBQVMsS0FBSztBQUFBLFVBQzdCO0FBQ0EsbUJBQVMsR0FBRyxJQUFJO0FBQUEsUUFDcEI7QUFBQSxNQUNKO0FBQ0EsYUFBTyxJQUFJLFVBQVU7QUFBQSxRQUNqQixHQUFHLEtBQUs7QUFBQSxRQUNSLE9BQU8sTUFBTTtBQUFBLE1BQ3pCLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxRQUFRO0FBQ0osYUFBTyxjQUFjLEtBQUssV0FBVyxLQUFLLEtBQUssQ0FBQztBQUFBLElBQ3BEO0FBQUEsRUFDSjtBQUNBLFlBQVUsU0FBUyxDQUFDLE9BQU8sV0FBVztBQUNsQyxXQUFPLElBQUksVUFBVTtBQUFBLE1BQ2pCLE9BQU8sTUFBTTtBQUFBLE1BQ2IsYUFBYTtBQUFBLE1BQ2IsVUFBVSxTQUFTLE9BQU07QUFBQSxNQUN6QixVQUFVLHNCQUFzQjtBQUFBLE1BQ2hDLEdBQUcsb0JBQW9CLE1BQU07QUFBQSxJQUNyQyxDQUFLO0FBQUEsRUFDTDtBQUNBLFlBQVUsZUFBZSxDQUFDLE9BQU8sV0FBVztBQUN4QyxXQUFPLElBQUksVUFBVTtBQUFBLE1BQ2pCLE9BQU8sTUFBTTtBQUFBLE1BQ2IsYUFBYTtBQUFBLE1BQ2IsVUFBVSxTQUFTLE9BQU07QUFBQSxNQUN6QixVQUFVLHNCQUFzQjtBQUFBLE1BQ2hDLEdBQUcsb0JBQW9CLE1BQU07QUFBQSxJQUNyQyxDQUFLO0FBQUEsRUFDTDtBQUNBLFlBQVUsYUFBYSxDQUFDLE9BQU8sV0FBVztBQUN0QyxXQUFPLElBQUksVUFBVTtBQUFBLE1BQ2pCO0FBQUEsTUFDQSxhQUFhO0FBQUEsTUFDYixVQUFVLFNBQVMsT0FBTTtBQUFBLE1BQ3pCLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQUEsRUFDTyxNQUFNLGlCQUFpQixRQUFRO0FBQUEsSUFDbEMsT0FBTyxPQUFPO0FBQ1YsWUFBTSxFQUFFLElBQUcsSUFBSyxLQUFLLG9CQUFvQixLQUFLO0FBQzlDLFlBQU0sVUFBVSxLQUFLLEtBQUs7QUFDMUIsZUFBUyxjQUFjLFNBQVM7QUFFNUIsbUJBQVdGLFdBQVUsU0FBUztBQUMxQixjQUFJQSxRQUFPLE9BQU8sV0FBVyxTQUFTO0FBQ2xDLG1CQUFPQSxRQUFPO0FBQUEsVUFDbEI7QUFBQSxRQUNKO0FBQ0EsbUJBQVdBLFdBQVUsU0FBUztBQUMxQixjQUFJQSxRQUFPLE9BQU8sV0FBVyxTQUFTO0FBRWxDLGdCQUFJLE9BQU8sT0FBTyxLQUFLLEdBQUdBLFFBQU8sSUFBSSxPQUFPLE1BQU07QUFDbEQsbUJBQU9BLFFBQU87QUFBQSxVQUNsQjtBQUFBLFFBQ0o7QUFFQSxjQUFNLGNBQWMsUUFBUSxJQUFJLENBQUNBLFlBQVcsSUFBSSxTQUFTQSxRQUFPLElBQUksT0FBTyxNQUFNLENBQUM7QUFDbEYsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixNQUFNLGFBQWE7QUFBQSxVQUNuQjtBQUFBLFFBQ2hCLENBQWE7QUFDRCxlQUFPO0FBQUEsTUFDWDtBQUNBLFVBQUksSUFBSSxPQUFPLE9BQU87QUFDbEIsZUFBTyxRQUFRLElBQUksUUFBUSxJQUFJLE9BQU8sV0FBVztBQUM3QyxnQkFBTSxXQUFXO0FBQUEsWUFDYixHQUFHO0FBQUEsWUFDSCxRQUFRO0FBQUEsY0FDSixHQUFHLElBQUk7QUFBQSxjQUNQLFFBQVEsQ0FBQTtBQUFBLFlBQ2hDO0FBQUEsWUFDb0IsUUFBUTtBQUFBLFVBQzVCO0FBQ2dCLGlCQUFPO0FBQUEsWUFDSCxRQUFRLE1BQU0sT0FBTyxZQUFZO0FBQUEsY0FDN0IsTUFBTSxJQUFJO0FBQUEsY0FDVixNQUFNLElBQUk7QUFBQSxjQUNWLFFBQVE7QUFBQSxZQUNoQyxDQUFxQjtBQUFBLFlBQ0QsS0FBSztBQUFBLFVBQ3pCO0FBQUEsUUFDWSxDQUFDLENBQUMsRUFBRSxLQUFLLGFBQWE7QUFBQSxNQUMxQixPQUNLO0FBQ0QsWUFBSSxRQUFRO0FBQ1osY0FBTSxTQUFTLENBQUE7QUFDZixtQkFBVyxVQUFVLFNBQVM7QUFDMUIsZ0JBQU0sV0FBVztBQUFBLFlBQ2IsR0FBRztBQUFBLFlBQ0gsUUFBUTtBQUFBLGNBQ0osR0FBRyxJQUFJO0FBQUEsY0FDUCxRQUFRLENBQUE7QUFBQSxZQUNoQztBQUFBLFlBQ29CLFFBQVE7QUFBQSxVQUM1QjtBQUNnQixnQkFBTUEsVUFBUyxPQUFPLFdBQVc7QUFBQSxZQUM3QixNQUFNLElBQUk7QUFBQSxZQUNWLE1BQU0sSUFBSTtBQUFBLFlBQ1YsUUFBUTtBQUFBLFVBQzVCLENBQWlCO0FBQ0QsY0FBSUEsUUFBTyxXQUFXLFNBQVM7QUFDM0IsbUJBQU9BO0FBQUEsVUFDWCxXQUNTQSxRQUFPLFdBQVcsV0FBVyxDQUFDLE9BQU87QUFDMUMsb0JBQVEsRUFBRSxRQUFBQSxTQUFRLEtBQUssU0FBUTtBQUFBLFVBQ25DO0FBQ0EsY0FBSSxTQUFTLE9BQU8sT0FBTyxRQUFRO0FBQy9CLG1CQUFPLEtBQUssU0FBUyxPQUFPLE1BQU07QUFBQSxVQUN0QztBQUFBLFFBQ0o7QUFDQSxZQUFJLE9BQU87QUFDUCxjQUFJLE9BQU8sT0FBTyxLQUFLLEdBQUcsTUFBTSxJQUFJLE9BQU8sTUFBTTtBQUNqRCxpQkFBTyxNQUFNO0FBQUEsUUFDakI7QUFDQSxjQUFNLGNBQWMsT0FBTyxJQUFJLENBQUNHLFlBQVcsSUFBSSxTQUFTQSxPQUFNLENBQUM7QUFDL0QsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixNQUFNLGFBQWE7QUFBQSxVQUNuQjtBQUFBLFFBQ2hCLENBQWE7QUFDRCxlQUFPO0FBQUEsTUFDWDtBQUFBLElBQ0o7QUFBQSxJQUNBLElBQUksVUFBVTtBQUNWLGFBQU8sS0FBSyxLQUFLO0FBQUEsSUFDckI7QUFBQSxFQUNKO0FBQ0EsV0FBUyxTQUFTLENBQUMsT0FBTyxXQUFXO0FBQ2pDLFdBQU8sSUFBSSxTQUFTO0FBQUEsTUFDaEIsU0FBUztBQUFBLE1BQ1QsVUFBVSxzQkFBc0I7QUFBQSxNQUNoQyxHQUFHLG9CQUFvQixNQUFNO0FBQUEsSUFDckMsQ0FBSztBQUFBLEVBQ0w7QUFvSUEsV0FBUyxZQUFZLEdBQUcsR0FBRztBQUN2QixVQUFNLFFBQVEsY0FBYyxDQUFDO0FBQzdCLFVBQU0sUUFBUSxjQUFjLENBQUM7QUFDN0IsUUFBSSxNQUFNLEdBQUc7QUFDVCxhQUFPLEVBQUUsT0FBTyxNQUFNLE1BQU0sRUFBQztBQUFBLElBQ2pDLFdBQ1MsVUFBVSxjQUFjLFVBQVUsVUFBVSxjQUFjLFFBQVE7QUFDdkUsWUFBTSxRQUFRLEtBQUssV0FBVyxDQUFDO0FBQy9CLFlBQU0sYUFBYSxLQUFLLFdBQVcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxRQUFRLE1BQU0sUUFBUSxHQUFHLE1BQU0sRUFBRTtBQUMvRSxZQUFNLFNBQVMsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFDO0FBQzNCLGlCQUFXLE9BQU8sWUFBWTtBQUMxQixjQUFNLGNBQWMsWUFBWSxFQUFFLEdBQUcsR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUM5QyxZQUFJLENBQUMsWUFBWSxPQUFPO0FBQ3BCLGlCQUFPLEVBQUUsT0FBTyxNQUFLO0FBQUEsUUFDekI7QUFDQSxlQUFPLEdBQUcsSUFBSSxZQUFZO0FBQUEsTUFDOUI7QUFDQSxhQUFPLEVBQUUsT0FBTyxNQUFNLE1BQU0sT0FBTTtBQUFBLElBQ3RDLFdBQ1MsVUFBVSxjQUFjLFNBQVMsVUFBVSxjQUFjLE9BQU87QUFDckUsVUFBSSxFQUFFLFdBQVcsRUFBRSxRQUFRO0FBQ3ZCLGVBQU8sRUFBRSxPQUFPLE1BQUs7QUFBQSxNQUN6QjtBQUNBLFlBQU0sV0FBVyxDQUFBO0FBQ2pCLGVBQVMsUUFBUSxHQUFHLFFBQVEsRUFBRSxRQUFRLFNBQVM7QUFDM0MsY0FBTSxRQUFRLEVBQUUsS0FBSztBQUNyQixjQUFNLFFBQVEsRUFBRSxLQUFLO0FBQ3JCLGNBQU0sY0FBYyxZQUFZLE9BQU8sS0FBSztBQUM1QyxZQUFJLENBQUMsWUFBWSxPQUFPO0FBQ3BCLGlCQUFPLEVBQUUsT0FBTyxNQUFLO0FBQUEsUUFDekI7QUFDQSxpQkFBUyxLQUFLLFlBQVksSUFBSTtBQUFBLE1BQ2xDO0FBQ0EsYUFBTyxFQUFFLE9BQU8sTUFBTSxNQUFNLFNBQVE7QUFBQSxJQUN4QyxXQUNTLFVBQVUsY0FBYyxRQUFRLFVBQVUsY0FBYyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUc7QUFDaEYsYUFBTyxFQUFFLE9BQU8sTUFBTSxNQUFNLEVBQUM7QUFBQSxJQUNqQyxPQUNLO0FBQ0QsYUFBTyxFQUFFLE9BQU8sTUFBSztBQUFBLElBQ3pCO0FBQUEsRUFDSjtBQUFBLEVBQ08sTUFBTSx3QkFBd0IsUUFBUTtBQUFBLElBQ3pDLE9BQU8sT0FBTztBQUNWLFlBQU0sRUFBRSxRQUFRLElBQUcsSUFBSyxLQUFLLG9CQUFvQixLQUFLO0FBQ3RELFlBQU0sZUFBZSxDQUFDLFlBQVksZ0JBQWdCO0FBQzlDLFlBQUksVUFBVSxVQUFVLEtBQUssVUFBVSxXQUFXLEdBQUc7QUFDakQsaUJBQU87QUFBQSxRQUNYO0FBQ0EsY0FBTSxTQUFTLFlBQVksV0FBVyxPQUFPLFlBQVksS0FBSztBQUM5RCxZQUFJLENBQUMsT0FBTyxPQUFPO0FBQ2YsNEJBQWtCLEtBQUs7QUFBQSxZQUNuQixNQUFNLGFBQWE7QUFBQSxVQUN2QyxDQUFpQjtBQUNELGlCQUFPO0FBQUEsUUFDWDtBQUNBLFlBQUksUUFBUSxVQUFVLEtBQUssUUFBUSxXQUFXLEdBQUc7QUFDN0MsaUJBQU8sTUFBSztBQUFBLFFBQ2hCO0FBQ0EsZUFBTyxFQUFFLFFBQVEsT0FBTyxPQUFPLE9BQU8sT0FBTyxLQUFJO0FBQUEsTUFDckQ7QUFDQSxVQUFJLElBQUksT0FBTyxPQUFPO0FBQ2xCLGVBQU8sUUFBUSxJQUFJO0FBQUEsVUFDZixLQUFLLEtBQUssS0FBSyxZQUFZO0FBQUEsWUFDdkIsTUFBTSxJQUFJO0FBQUEsWUFDVixNQUFNLElBQUk7QUFBQSxZQUNWLFFBQVE7QUFBQSxVQUM1QixDQUFpQjtBQUFBLFVBQ0QsS0FBSyxLQUFLLE1BQU0sWUFBWTtBQUFBLFlBQ3hCLE1BQU0sSUFBSTtBQUFBLFlBQ1YsTUFBTSxJQUFJO0FBQUEsWUFDVixRQUFRO0FBQUEsVUFDNUIsQ0FBaUI7QUFBQSxRQUNqQixDQUFhLEVBQUUsS0FBSyxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU0sYUFBYSxNQUFNLEtBQUssQ0FBQztBQUFBLE1BQ3hELE9BQ0s7QUFDRCxlQUFPLGFBQWEsS0FBSyxLQUFLLEtBQUssV0FBVztBQUFBLFVBQzFDLE1BQU0sSUFBSTtBQUFBLFVBQ1YsTUFBTSxJQUFJO0FBQUEsVUFDVixRQUFRO0FBQUEsUUFDeEIsQ0FBYSxHQUFHLEtBQUssS0FBSyxNQUFNLFdBQVc7QUFBQSxVQUMzQixNQUFNLElBQUk7QUFBQSxVQUNWLE1BQU0sSUFBSTtBQUFBLFVBQ1YsUUFBUTtBQUFBLFFBQ3hCLENBQWEsQ0FBQztBQUFBLE1BQ047QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNBLGtCQUFnQixTQUFTLENBQUMsTUFBTSxPQUFPLFdBQVc7QUFDOUMsV0FBTyxJQUFJLGdCQUFnQjtBQUFBLE1BQ3ZCO0FBQUEsTUFDQTtBQUFBLE1BQ0EsVUFBVSxzQkFBc0I7QUFBQSxNQUNoQyxHQUFHLG9CQUFvQixNQUFNO0FBQUEsSUFDckMsQ0FBSztBQUFBLEVBQ0w7QUFBQSxFQUVPLE1BQU0saUJBQWlCLFFBQVE7QUFBQSxJQUNsQyxPQUFPLE9BQU87QUFDVixZQUFNLEVBQUUsUUFBUSxJQUFHLElBQUssS0FBSyxvQkFBb0IsS0FBSztBQUN0RCxVQUFJLElBQUksZUFBZSxjQUFjLE9BQU87QUFDeEMsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixNQUFNLGFBQWE7QUFBQSxVQUNuQixVQUFVLGNBQWM7QUFBQSxVQUN4QixVQUFVLElBQUk7QUFBQSxRQUM5QixDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxVQUFJLElBQUksS0FBSyxTQUFTLEtBQUssS0FBSyxNQUFNLFFBQVE7QUFDMUMsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixNQUFNLGFBQWE7QUFBQSxVQUNuQixTQUFTLEtBQUssS0FBSyxNQUFNO0FBQUEsVUFDekIsV0FBVztBQUFBLFVBQ1gsT0FBTztBQUFBLFVBQ1AsTUFBTTtBQUFBLFFBQ3RCLENBQWE7QUFDRCxlQUFPO0FBQUEsTUFDWDtBQUNBLFlBQU0sT0FBTyxLQUFLLEtBQUs7QUFDdkIsVUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLFNBQVMsS0FBSyxLQUFLLE1BQU0sUUFBUTtBQUNuRCwwQkFBa0IsS0FBSztBQUFBLFVBQ25CLE1BQU0sYUFBYTtBQUFBLFVBQ25CLFNBQVMsS0FBSyxLQUFLLE1BQU07QUFBQSxVQUN6QixXQUFXO0FBQUEsVUFDWCxPQUFPO0FBQUEsVUFDUCxNQUFNO0FBQUEsUUFDdEIsQ0FBYTtBQUNELGVBQU8sTUFBSztBQUFBLE1BQ2hCO0FBQ0EsWUFBTSxRQUFRLENBQUMsR0FBRyxJQUFJLElBQUksRUFDckIsSUFBSSxDQUFDLE1BQU0sY0FBYztBQUMxQixjQUFNLFNBQVMsS0FBSyxLQUFLLE1BQU0sU0FBUyxLQUFLLEtBQUssS0FBSztBQUN2RCxZQUFJLENBQUM7QUFDRCxpQkFBTztBQUNYLGVBQU8sT0FBTyxPQUFPLElBQUksbUJBQW1CLEtBQUssTUFBTSxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBQUEsTUFDL0UsQ0FBQyxFQUNJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLFVBQUksSUFBSSxPQUFPLE9BQU87QUFDbEIsZUFBTyxRQUFRLElBQUksS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFZO0FBQ3hDLGlCQUFPLFlBQVksV0FBVyxRQUFRLE9BQU87QUFBQSxRQUNqRCxDQUFDO0FBQUEsTUFDTCxPQUNLO0FBQ0QsZUFBTyxZQUFZLFdBQVcsUUFBUSxLQUFLO0FBQUEsTUFDL0M7QUFBQSxJQUNKO0FBQUEsSUFDQSxJQUFJLFFBQVE7QUFDUixhQUFPLEtBQUssS0FBSztBQUFBLElBQ3JCO0FBQUEsSUFDQSxLQUFLLE1BQU07QUFDUCxhQUFPLElBQUksU0FBUztBQUFBLFFBQ2hCLEdBQUcsS0FBSztBQUFBLFFBQ1I7QUFBQSxNQUNaLENBQVM7QUFBQSxJQUNMO0FBQUEsRUFDSjtBQUNBLFdBQVMsU0FBUyxDQUFDLFNBQVMsV0FBVztBQUNuQyxRQUFJLENBQUMsTUFBTSxRQUFRLE9BQU8sR0FBRztBQUN6QixZQUFNLElBQUksTUFBTSx1REFBdUQ7QUFBQSxJQUMzRTtBQUNBLFdBQU8sSUFBSSxTQUFTO0FBQUEsTUFDaEIsT0FBTztBQUFBLE1BQ1AsVUFBVSxzQkFBc0I7QUFBQSxNQUNoQyxNQUFNO0FBQUEsTUFDTixHQUFHLG9CQUFvQixNQUFNO0FBQUEsSUFDckMsQ0FBSztBQUFBLEVBQ0w7QUFBQSxFQUNPLE1BQU0sa0JBQWtCLFFBQVE7QUFBQSxJQUNuQyxJQUFJLFlBQVk7QUFDWixhQUFPLEtBQUssS0FBSztBQUFBLElBQ3JCO0FBQUEsSUFDQSxJQUFJLGNBQWM7QUFDZCxhQUFPLEtBQUssS0FBSztBQUFBLElBQ3JCO0FBQUEsSUFDQSxPQUFPLE9BQU87QUFDVixZQUFNLEVBQUUsUUFBUSxJQUFHLElBQUssS0FBSyxvQkFBb0IsS0FBSztBQUN0RCxVQUFJLElBQUksZUFBZSxjQUFjLFFBQVE7QUFDekMsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixNQUFNLGFBQWE7QUFBQSxVQUNuQixVQUFVLGNBQWM7QUFBQSxVQUN4QixVQUFVLElBQUk7QUFBQSxRQUM5QixDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxZQUFNLFFBQVEsQ0FBQTtBQUNkLFlBQU0sVUFBVSxLQUFLLEtBQUs7QUFDMUIsWUFBTSxZQUFZLEtBQUssS0FBSztBQUM1QixpQkFBVyxPQUFPLElBQUksTUFBTTtBQUN4QixjQUFNLEtBQUs7QUFBQSxVQUNQLEtBQUssUUFBUSxPQUFPLElBQUksbUJBQW1CLEtBQUssS0FBSyxJQUFJLE1BQU0sR0FBRyxDQUFDO0FBQUEsVUFDbkUsT0FBTyxVQUFVLE9BQU8sSUFBSSxtQkFBbUIsS0FBSyxJQUFJLEtBQUssR0FBRyxHQUFHLElBQUksTUFBTSxHQUFHLENBQUM7QUFBQSxVQUNqRixXQUFXLE9BQU8sSUFBSTtBQUFBLFFBQ3RDLENBQWE7QUFBQSxNQUNMO0FBQ0EsVUFBSSxJQUFJLE9BQU8sT0FBTztBQUNsQixlQUFPLFlBQVksaUJBQWlCLFFBQVEsS0FBSztBQUFBLE1BQ3JELE9BQ0s7QUFDRCxlQUFPLFlBQVksZ0JBQWdCLFFBQVEsS0FBSztBQUFBLE1BQ3BEO0FBQUEsSUFDSjtBQUFBLElBQ0EsSUFBSSxVQUFVO0FBQ1YsYUFBTyxLQUFLLEtBQUs7QUFBQSxJQUNyQjtBQUFBLElBQ0EsT0FBTyxPQUFPLE9BQU8sUUFBUSxPQUFPO0FBQ2hDLFVBQUksa0JBQWtCLFNBQVM7QUFDM0IsZUFBTyxJQUFJLFVBQVU7QUFBQSxVQUNqQixTQUFTO0FBQUEsVUFDVCxXQUFXO0FBQUEsVUFDWCxVQUFVLHNCQUFzQjtBQUFBLFVBQ2hDLEdBQUcsb0JBQW9CLEtBQUs7QUFBQSxRQUM1QyxDQUFhO0FBQUEsTUFDTDtBQUNBLGFBQU8sSUFBSSxVQUFVO0FBQUEsUUFDakIsU0FBUyxVQUFVLE9BQU07QUFBQSxRQUN6QixXQUFXO0FBQUEsUUFDWCxVQUFVLHNCQUFzQjtBQUFBLFFBQ2hDLEdBQUcsb0JBQW9CLE1BQU07QUFBQSxNQUN6QyxDQUFTO0FBQUEsSUFDTDtBQUFBLEVBQ0o7QUFBQSxFQUNPLE1BQU0sZUFBZSxRQUFRO0FBQUEsSUFDaEMsSUFBSSxZQUFZO0FBQ1osYUFBTyxLQUFLLEtBQUs7QUFBQSxJQUNyQjtBQUFBLElBQ0EsSUFBSSxjQUFjO0FBQ2QsYUFBTyxLQUFLLEtBQUs7QUFBQSxJQUNyQjtBQUFBLElBQ0EsT0FBTyxPQUFPO0FBQ1YsWUFBTSxFQUFFLFFBQVEsSUFBRyxJQUFLLEtBQUssb0JBQW9CLEtBQUs7QUFDdEQsVUFBSSxJQUFJLGVBQWUsY0FBYyxLQUFLO0FBQ3RDLDBCQUFrQixLQUFLO0FBQUEsVUFDbkIsTUFBTSxhQUFhO0FBQUEsVUFDbkIsVUFBVSxjQUFjO0FBQUEsVUFDeEIsVUFBVSxJQUFJO0FBQUEsUUFDOUIsQ0FBYTtBQUNELGVBQU87QUFBQSxNQUNYO0FBQ0EsWUFBTSxVQUFVLEtBQUssS0FBSztBQUMxQixZQUFNLFlBQVksS0FBSyxLQUFLO0FBQzVCLFlBQU0sUUFBUSxDQUFDLEdBQUcsSUFBSSxLQUFLLFFBQU8sQ0FBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHLFVBQVU7QUFDL0QsZUFBTztBQUFBLFVBQ0gsS0FBSyxRQUFRLE9BQU8sSUFBSSxtQkFBbUIsS0FBSyxLQUFLLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUM7QUFBQSxVQUM5RSxPQUFPLFVBQVUsT0FBTyxJQUFJLG1CQUFtQixLQUFLLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxPQUFPLENBQUMsQ0FBQztBQUFBLFFBQ3RHO0FBQUEsTUFDUSxDQUFDO0FBQ0QsVUFBSSxJQUFJLE9BQU8sT0FBTztBQUNsQixjQUFNLFdBQVcsb0JBQUksSUFBRztBQUN4QixlQUFPLFFBQVEsVUFBVSxLQUFLLFlBQVk7QUFDdEMscUJBQVcsUUFBUSxPQUFPO0FBQ3RCLGtCQUFNLE1BQU0sTUFBTSxLQUFLO0FBQ3ZCLGtCQUFNLFFBQVEsTUFBTSxLQUFLO0FBQ3pCLGdCQUFJLElBQUksV0FBVyxhQUFhLE1BQU0sV0FBVyxXQUFXO0FBQ3hELHFCQUFPO0FBQUEsWUFDWDtBQUNBLGdCQUFJLElBQUksV0FBVyxXQUFXLE1BQU0sV0FBVyxTQUFTO0FBQ3BELHFCQUFPLE1BQUs7QUFBQSxZQUNoQjtBQUNBLHFCQUFTLElBQUksSUFBSSxPQUFPLE1BQU0sS0FBSztBQUFBLFVBQ3ZDO0FBQ0EsaUJBQU8sRUFBRSxRQUFRLE9BQU8sT0FBTyxPQUFPLFNBQVE7QUFBQSxRQUNsRCxDQUFDO0FBQUEsTUFDTCxPQUNLO0FBQ0QsY0FBTSxXQUFXLG9CQUFJLElBQUc7QUFDeEIsbUJBQVcsUUFBUSxPQUFPO0FBQ3RCLGdCQUFNLE1BQU0sS0FBSztBQUNqQixnQkFBTSxRQUFRLEtBQUs7QUFDbkIsY0FBSSxJQUFJLFdBQVcsYUFBYSxNQUFNLFdBQVcsV0FBVztBQUN4RCxtQkFBTztBQUFBLFVBQ1g7QUFDQSxjQUFJLElBQUksV0FBVyxXQUFXLE1BQU0sV0FBVyxTQUFTO0FBQ3BELG1CQUFPLE1BQUs7QUFBQSxVQUNoQjtBQUNBLG1CQUFTLElBQUksSUFBSSxPQUFPLE1BQU0sS0FBSztBQUFBLFFBQ3ZDO0FBQ0EsZUFBTyxFQUFFLFFBQVEsT0FBTyxPQUFPLE9BQU8sU0FBUTtBQUFBLE1BQ2xEO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDQSxTQUFPLFNBQVMsQ0FBQyxTQUFTLFdBQVcsV0FBVztBQUM1QyxXQUFPLElBQUksT0FBTztBQUFBLE1BQ2Q7QUFBQSxNQUNBO0FBQUEsTUFDQSxVQUFVLHNCQUFzQjtBQUFBLE1BQ2hDLEdBQUcsb0JBQW9CLE1BQU07QUFBQSxJQUNyQyxDQUFLO0FBQUEsRUFDTDtBQUFBLEVBQ08sTUFBTSxlQUFlLFFBQVE7QUFBQSxJQUNoQyxPQUFPLE9BQU87QUFDVixZQUFNLEVBQUUsUUFBUSxJQUFHLElBQUssS0FBSyxvQkFBb0IsS0FBSztBQUN0RCxVQUFJLElBQUksZUFBZSxjQUFjLEtBQUs7QUFDdEMsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixNQUFNLGFBQWE7QUFBQSxVQUNuQixVQUFVLGNBQWM7QUFBQSxVQUN4QixVQUFVLElBQUk7QUFBQSxRQUM5QixDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxZQUFNLE1BQU0sS0FBSztBQUNqQixVQUFJLElBQUksWUFBWSxNQUFNO0FBQ3RCLFlBQUksSUFBSSxLQUFLLE9BQU8sSUFBSSxRQUFRLE9BQU87QUFDbkMsNEJBQWtCLEtBQUs7QUFBQSxZQUNuQixNQUFNLGFBQWE7QUFBQSxZQUNuQixTQUFTLElBQUksUUFBUTtBQUFBLFlBQ3JCLE1BQU07QUFBQSxZQUNOLFdBQVc7QUFBQSxZQUNYLE9BQU87QUFBQSxZQUNQLFNBQVMsSUFBSSxRQUFRO0FBQUEsVUFDekMsQ0FBaUI7QUFDRCxpQkFBTyxNQUFLO0FBQUEsUUFDaEI7QUFBQSxNQUNKO0FBQ0EsVUFBSSxJQUFJLFlBQVksTUFBTTtBQUN0QixZQUFJLElBQUksS0FBSyxPQUFPLElBQUksUUFBUSxPQUFPO0FBQ25DLDRCQUFrQixLQUFLO0FBQUEsWUFDbkIsTUFBTSxhQUFhO0FBQUEsWUFDbkIsU0FBUyxJQUFJLFFBQVE7QUFBQSxZQUNyQixNQUFNO0FBQUEsWUFDTixXQUFXO0FBQUEsWUFDWCxPQUFPO0FBQUEsWUFDUCxTQUFTLElBQUksUUFBUTtBQUFBLFVBQ3pDLENBQWlCO0FBQ0QsaUJBQU8sTUFBSztBQUFBLFFBQ2hCO0FBQUEsTUFDSjtBQUNBLFlBQU0sWUFBWSxLQUFLLEtBQUs7QUFDNUIsZUFBUyxZQUFZQyxXQUFVO0FBQzNCLGNBQU0sWUFBWSxvQkFBSSxJQUFHO0FBQ3pCLG1CQUFXLFdBQVdBLFdBQVU7QUFDNUIsY0FBSSxRQUFRLFdBQVc7QUFDbkIsbUJBQU87QUFDWCxjQUFJLFFBQVEsV0FBVztBQUNuQixtQkFBTyxNQUFLO0FBQ2hCLG9CQUFVLElBQUksUUFBUSxLQUFLO0FBQUEsUUFDL0I7QUFDQSxlQUFPLEVBQUUsUUFBUSxPQUFPLE9BQU8sT0FBTyxVQUFTO0FBQUEsTUFDbkQ7QUFDQSxZQUFNLFdBQVcsQ0FBQyxHQUFHLElBQUksS0FBSyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sTUFBTSxVQUFVLE9BQU8sSUFBSSxtQkFBbUIsS0FBSyxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN6SCxVQUFJLElBQUksT0FBTyxPQUFPO0FBQ2xCLGVBQU8sUUFBUSxJQUFJLFFBQVEsRUFBRSxLQUFLLENBQUNBLGNBQWEsWUFBWUEsU0FBUSxDQUFDO0FBQUEsTUFDekUsT0FDSztBQUNELGVBQU8sWUFBWSxRQUFRO0FBQUEsTUFDL0I7QUFBQSxJQUNKO0FBQUEsSUFDQSxJQUFJLFNBQVMsU0FBUztBQUNsQixhQUFPLElBQUksT0FBTztBQUFBLFFBQ2QsR0FBRyxLQUFLO0FBQUEsUUFDUixTQUFTLEVBQUUsT0FBTyxTQUFTLFNBQVMsVUFBVSxTQUFTLE9BQU8sRUFBQztBQUFBLE1BQzNFLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxJQUFJLFNBQVMsU0FBUztBQUNsQixhQUFPLElBQUksT0FBTztBQUFBLFFBQ2QsR0FBRyxLQUFLO0FBQUEsUUFDUixTQUFTLEVBQUUsT0FBTyxTQUFTLFNBQVMsVUFBVSxTQUFTLE9BQU8sRUFBQztBQUFBLE1BQzNFLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxLQUFLLE1BQU0sU0FBUztBQUNoQixhQUFPLEtBQUssSUFBSSxNQUFNLE9BQU8sRUFBRSxJQUFJLE1BQU0sT0FBTztBQUFBLElBQ3BEO0FBQUEsSUFDQSxTQUFTLFNBQVM7QUFDZCxhQUFPLEtBQUssSUFBSSxHQUFHLE9BQU87QUFBQSxJQUM5QjtBQUFBLEVBQ0o7QUFDQSxTQUFPLFNBQVMsQ0FBQyxXQUFXLFdBQVc7QUFDbkMsV0FBTyxJQUFJLE9BQU87QUFBQSxNQUNkO0FBQUEsTUFDQSxTQUFTO0FBQUEsTUFDVCxTQUFTO0FBQUEsTUFDVCxVQUFVLHNCQUFzQjtBQUFBLE1BQ2hDLEdBQUcsb0JBQW9CLE1BQU07QUFBQSxJQUNyQyxDQUFLO0FBQUEsRUFDTDtBQUFBLEVBbUhPLE1BQU0sZ0JBQWdCLFFBQVE7QUFBQSxJQUNqQyxJQUFJLFNBQVM7QUFDVCxhQUFPLEtBQUssS0FBSyxPQUFNO0FBQUEsSUFDM0I7QUFBQSxJQUNBLE9BQU8sT0FBTztBQUNWLFlBQU0sRUFBRSxJQUFHLElBQUssS0FBSyxvQkFBb0IsS0FBSztBQUM5QyxZQUFNLGFBQWEsS0FBSyxLQUFLLE9BQU07QUFDbkMsYUFBTyxXQUFXLE9BQU8sRUFBRSxNQUFNLElBQUksTUFBTSxNQUFNLElBQUksTUFBTSxRQUFRLElBQUcsQ0FBRTtBQUFBLElBQzVFO0FBQUEsRUFDSjtBQUNBLFVBQVEsU0FBUyxDQUFDLFFBQVEsV0FBVztBQUNqQyxXQUFPLElBQUksUUFBUTtBQUFBLE1BQ2Y7QUFBQSxNQUNBLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQUEsRUFDTyxNQUFNLG1CQUFtQixRQUFRO0FBQUEsSUFDcEMsT0FBTyxPQUFPO0FBQ1YsVUFBSSxNQUFNLFNBQVMsS0FBSyxLQUFLLE9BQU87QUFDaEMsY0FBTSxNQUFNLEtBQUssZ0JBQWdCLEtBQUs7QUFDdEMsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixVQUFVLElBQUk7QUFBQSxVQUNkLE1BQU0sYUFBYTtBQUFBLFVBQ25CLFVBQVUsS0FBSyxLQUFLO0FBQUEsUUFDcEMsQ0FBYTtBQUNELGVBQU87QUFBQSxNQUNYO0FBQ0EsYUFBTyxFQUFFLFFBQVEsU0FBUyxPQUFPLE1BQU0sS0FBSTtBQUFBLElBQy9DO0FBQUEsSUFDQSxJQUFJLFFBQVE7QUFDUixhQUFPLEtBQUssS0FBSztBQUFBLElBQ3JCO0FBQUEsRUFDSjtBQUNBLGFBQVcsU0FBUyxDQUFDLE9BQU8sV0FBVztBQUNuQyxXQUFPLElBQUksV0FBVztBQUFBLE1BQ2xCO0FBQUEsTUFDQSxVQUFVLHNCQUFzQjtBQUFBLE1BQ2hDLEdBQUcsb0JBQW9CLE1BQU07QUFBQSxJQUNyQyxDQUFLO0FBQUEsRUFDTDtBQUNBLFdBQVMsY0FBYyxRQUFRLFFBQVE7QUFDbkMsV0FBTyxJQUFJLFFBQVE7QUFBQSxNQUNmO0FBQUEsTUFDQSxVQUFVLHNCQUFzQjtBQUFBLE1BQ2hDLEdBQUcsb0JBQW9CLE1BQU07QUFBQSxJQUNyQyxDQUFLO0FBQUEsRUFDTDtBQUFBLEVBQ08sTUFBTSxnQkFBZ0IsUUFBUTtBQUFBLElBQ2pDLE9BQU8sT0FBTztBQUNWLFVBQUksT0FBTyxNQUFNLFNBQVMsVUFBVTtBQUNoQyxjQUFNLE1BQU0sS0FBSyxnQkFBZ0IsS0FBSztBQUN0QyxjQUFNLGlCQUFpQixLQUFLLEtBQUs7QUFDakMsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixVQUFVLEtBQUssV0FBVyxjQUFjO0FBQUEsVUFDeEMsVUFBVSxJQUFJO0FBQUEsVUFDZCxNQUFNLGFBQWE7QUFBQSxRQUNuQyxDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxVQUFJLENBQUMsS0FBSyxRQUFRO0FBQ2QsYUFBSyxTQUFTLElBQUksSUFBSSxLQUFLLEtBQUssTUFBTTtBQUFBLE1BQzFDO0FBQ0EsVUFBSSxDQUFDLEtBQUssT0FBTyxJQUFJLE1BQU0sSUFBSSxHQUFHO0FBQzlCLGNBQU0sTUFBTSxLQUFLLGdCQUFnQixLQUFLO0FBQ3RDLGNBQU0saUJBQWlCLEtBQUssS0FBSztBQUNqQywwQkFBa0IsS0FBSztBQUFBLFVBQ25CLFVBQVUsSUFBSTtBQUFBLFVBQ2QsTUFBTSxhQUFhO0FBQUEsVUFDbkIsU0FBUztBQUFBLFFBQ3pCLENBQWE7QUFDRCxlQUFPO0FBQUEsTUFDWDtBQUNBLGFBQU8sR0FBRyxNQUFNLElBQUk7QUFBQSxJQUN4QjtBQUFBLElBQ0EsSUFBSSxVQUFVO0FBQ1YsYUFBTyxLQUFLLEtBQUs7QUFBQSxJQUNyQjtBQUFBLElBQ0EsSUFBSSxPQUFPO0FBQ1AsWUFBTSxhQUFhLENBQUE7QUFDbkIsaUJBQVcsT0FBTyxLQUFLLEtBQUssUUFBUTtBQUNoQyxtQkFBVyxHQUFHLElBQUk7QUFBQSxNQUN0QjtBQUNBLGFBQU87QUFBQSxJQUNYO0FBQUEsSUFDQSxJQUFJLFNBQVM7QUFDVCxZQUFNLGFBQWEsQ0FBQTtBQUNuQixpQkFBVyxPQUFPLEtBQUssS0FBSyxRQUFRO0FBQ2hDLG1CQUFXLEdBQUcsSUFBSTtBQUFBLE1BQ3RCO0FBQ0EsYUFBTztBQUFBLElBQ1g7QUFBQSxJQUNBLElBQUksT0FBTztBQUNQLFlBQU0sYUFBYSxDQUFBO0FBQ25CLGlCQUFXLE9BQU8sS0FBSyxLQUFLLFFBQVE7QUFDaEMsbUJBQVcsR0FBRyxJQUFJO0FBQUEsTUFDdEI7QUFDQSxhQUFPO0FBQUEsSUFDWDtBQUFBLElBQ0EsUUFBUSxRQUFRLFNBQVMsS0FBSyxNQUFNO0FBQ2hDLGFBQU8sUUFBUSxPQUFPLFFBQVE7QUFBQSxRQUMxQixHQUFHLEtBQUs7QUFBQSxRQUNSLEdBQUc7QUFBQSxNQUNmLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxRQUFRLFFBQVEsU0FBUyxLQUFLLE1BQU07QUFDaEMsYUFBTyxRQUFRLE9BQU8sS0FBSyxRQUFRLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxTQUFTLEdBQUcsQ0FBQyxHQUFHO0FBQUEsUUFDdkUsR0FBRyxLQUFLO0FBQUEsUUFDUixHQUFHO0FBQUEsTUFDZixDQUFTO0FBQUEsSUFDTDtBQUFBLEVBQ0o7QUFDQSxVQUFRLFNBQVM7QUFBQSxFQUNWLE1BQU0sc0JBQXNCLFFBQVE7QUFBQSxJQUN2QyxPQUFPLE9BQU87QUFDVixZQUFNLG1CQUFtQixLQUFLLG1CQUFtQixLQUFLLEtBQUssTUFBTTtBQUNqRSxZQUFNLE1BQU0sS0FBSyxnQkFBZ0IsS0FBSztBQUN0QyxVQUFJLElBQUksZUFBZSxjQUFjLFVBQVUsSUFBSSxlQUFlLGNBQWMsUUFBUTtBQUNwRixjQUFNLGlCQUFpQixLQUFLLGFBQWEsZ0JBQWdCO0FBQ3pELDBCQUFrQixLQUFLO0FBQUEsVUFDbkIsVUFBVSxLQUFLLFdBQVcsY0FBYztBQUFBLFVBQ3hDLFVBQVUsSUFBSTtBQUFBLFVBQ2QsTUFBTSxhQUFhO0FBQUEsUUFDbkMsQ0FBYTtBQUNELGVBQU87QUFBQSxNQUNYO0FBQ0EsVUFBSSxDQUFDLEtBQUssUUFBUTtBQUNkLGFBQUssU0FBUyxJQUFJLElBQUksS0FBSyxtQkFBbUIsS0FBSyxLQUFLLE1BQU0sQ0FBQztBQUFBLE1BQ25FO0FBQ0EsVUFBSSxDQUFDLEtBQUssT0FBTyxJQUFJLE1BQU0sSUFBSSxHQUFHO0FBQzlCLGNBQU0saUJBQWlCLEtBQUssYUFBYSxnQkFBZ0I7QUFDekQsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixVQUFVLElBQUk7QUFBQSxVQUNkLE1BQU0sYUFBYTtBQUFBLFVBQ25CLFNBQVM7QUFBQSxRQUN6QixDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxhQUFPLEdBQUcsTUFBTSxJQUFJO0FBQUEsSUFDeEI7QUFBQSxJQUNBLElBQUksT0FBTztBQUNQLGFBQU8sS0FBSyxLQUFLO0FBQUEsSUFDckI7QUFBQSxFQUNKO0FBQ0EsZ0JBQWMsU0FBUyxDQUFDLFFBQVEsV0FBVztBQUN2QyxXQUFPLElBQUksY0FBYztBQUFBLE1BQ3JCO0FBQUEsTUFDQSxVQUFVLHNCQUFzQjtBQUFBLE1BQ2hDLEdBQUcsb0JBQW9CLE1BQU07QUFBQSxJQUNyQyxDQUFLO0FBQUEsRUFDTDtBQUFBLEVBQ08sTUFBTSxtQkFBbUIsUUFBUTtBQUFBLElBQ3BDLFNBQVM7QUFDTCxhQUFPLEtBQUssS0FBSztBQUFBLElBQ3JCO0FBQUEsSUFDQSxPQUFPLE9BQU87QUFDVixZQUFNLEVBQUUsSUFBRyxJQUFLLEtBQUssb0JBQW9CLEtBQUs7QUFDOUMsVUFBSSxJQUFJLGVBQWUsY0FBYyxXQUFXLElBQUksT0FBTyxVQUFVLE9BQU87QUFDeEUsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixNQUFNLGFBQWE7QUFBQSxVQUNuQixVQUFVLGNBQWM7QUFBQSxVQUN4QixVQUFVLElBQUk7QUFBQSxRQUM5QixDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxZQUFNLGNBQWMsSUFBSSxlQUFlLGNBQWMsVUFBVSxJQUFJLE9BQU8sUUFBUSxRQUFRLElBQUksSUFBSTtBQUNsRyxhQUFPLEdBQUcsWUFBWSxLQUFLLENBQUMsU0FBUztBQUNqQyxlQUFPLEtBQUssS0FBSyxLQUFLLFdBQVcsTUFBTTtBQUFBLFVBQ25DLE1BQU0sSUFBSTtBQUFBLFVBQ1YsVUFBVSxJQUFJLE9BQU87QUFBQSxRQUNyQyxDQUFhO0FBQUEsTUFDTCxDQUFDLENBQUM7QUFBQSxJQUNOO0FBQUEsRUFDSjtBQUNBLGFBQVcsU0FBUyxDQUFDLFFBQVEsV0FBVztBQUNwQyxXQUFPLElBQUksV0FBVztBQUFBLE1BQ2xCLE1BQU07QUFBQSxNQUNOLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQUEsRUFDTyxNQUFNLG1CQUFtQixRQUFRO0FBQUEsSUFDcEMsWUFBWTtBQUNSLGFBQU8sS0FBSyxLQUFLO0FBQUEsSUFDckI7QUFBQSxJQUNBLGFBQWE7QUFDVCxhQUFPLEtBQUssS0FBSyxPQUFPLEtBQUssYUFBYSxzQkFBc0IsYUFDMUQsS0FBSyxLQUFLLE9BQU8sV0FBVSxJQUMzQixLQUFLLEtBQUs7QUFBQSxJQUNwQjtBQUFBLElBQ0EsT0FBTyxPQUFPO0FBQ1YsWUFBTSxFQUFFLFFBQVEsSUFBRyxJQUFLLEtBQUssb0JBQW9CLEtBQUs7QUFDdEQsWUFBTSxTQUFTLEtBQUssS0FBSyxVQUFVO0FBQ25DLFlBQU0sV0FBVztBQUFBLFFBQ2IsVUFBVSxDQUFDLFFBQVE7QUFDZiw0QkFBa0IsS0FBSyxHQUFHO0FBQzFCLGNBQUksSUFBSSxPQUFPO0FBQ1gsbUJBQU8sTUFBSztBQUFBLFVBQ2hCLE9BQ0s7QUFDRCxtQkFBTyxNQUFLO0FBQUEsVUFDaEI7QUFBQSxRQUNKO0FBQUEsUUFDQSxJQUFJLE9BQU87QUFDUCxpQkFBTyxJQUFJO0FBQUEsUUFDZjtBQUFBLE1BQ1o7QUFDUSxlQUFTLFdBQVcsU0FBUyxTQUFTLEtBQUssUUFBUTtBQUNuRCxVQUFJLE9BQU8sU0FBUyxjQUFjO0FBQzlCLGNBQU0sWUFBWSxPQUFPLFVBQVUsSUFBSSxNQUFNLFFBQVE7QUFDckQsWUFBSSxJQUFJLE9BQU8sT0FBTztBQUNsQixpQkFBTyxRQUFRLFFBQVEsU0FBUyxFQUFFLEtBQUssT0FBT0MsZUFBYztBQUN4RCxnQkFBSSxPQUFPLFVBQVU7QUFDakIscUJBQU87QUFDWCxrQkFBTUwsVUFBUyxNQUFNLEtBQUssS0FBSyxPQUFPLFlBQVk7QUFBQSxjQUM5QyxNQUFNSztBQUFBLGNBQ04sTUFBTSxJQUFJO0FBQUEsY0FDVixRQUFRO0FBQUEsWUFDaEMsQ0FBcUI7QUFDRCxnQkFBSUwsUUFBTyxXQUFXO0FBQ2xCLHFCQUFPO0FBQ1gsZ0JBQUlBLFFBQU8sV0FBVztBQUNsQixxQkFBTyxNQUFNQSxRQUFPLEtBQUs7QUFDN0IsZ0JBQUksT0FBTyxVQUFVO0FBQ2pCLHFCQUFPLE1BQU1BLFFBQU8sS0FBSztBQUM3QixtQkFBT0E7QUFBQSxVQUNYLENBQUM7QUFBQSxRQUNMLE9BQ0s7QUFDRCxjQUFJLE9BQU8sVUFBVTtBQUNqQixtQkFBTztBQUNYLGdCQUFNQSxVQUFTLEtBQUssS0FBSyxPQUFPLFdBQVc7QUFBQSxZQUN2QyxNQUFNO0FBQUEsWUFDTixNQUFNLElBQUk7QUFBQSxZQUNWLFFBQVE7QUFBQSxVQUM1QixDQUFpQjtBQUNELGNBQUlBLFFBQU8sV0FBVztBQUNsQixtQkFBTztBQUNYLGNBQUlBLFFBQU8sV0FBVztBQUNsQixtQkFBTyxNQUFNQSxRQUFPLEtBQUs7QUFDN0IsY0FBSSxPQUFPLFVBQVU7QUFDakIsbUJBQU8sTUFBTUEsUUFBTyxLQUFLO0FBQzdCLGlCQUFPQTtBQUFBLFFBQ1g7QUFBQSxNQUNKO0FBQ0EsVUFBSSxPQUFPLFNBQVMsY0FBYztBQUM5QixjQUFNLG9CQUFvQixDQUFDLFFBQVE7QUFDL0IsZ0JBQU1BLFVBQVMsT0FBTyxXQUFXLEtBQUssUUFBUTtBQUM5QyxjQUFJLElBQUksT0FBTyxPQUFPO0FBQ2xCLG1CQUFPLFFBQVEsUUFBUUEsT0FBTTtBQUFBLFVBQ2pDO0FBQ0EsY0FBSUEsbUJBQWtCLFNBQVM7QUFDM0Isa0JBQU0sSUFBSSxNQUFNLDJGQUEyRjtBQUFBLFVBQy9HO0FBQ0EsaUJBQU87QUFBQSxRQUNYO0FBQ0EsWUFBSSxJQUFJLE9BQU8sVUFBVSxPQUFPO0FBQzVCLGdCQUFNLFFBQVEsS0FBSyxLQUFLLE9BQU8sV0FBVztBQUFBLFlBQ3RDLE1BQU0sSUFBSTtBQUFBLFlBQ1YsTUFBTSxJQUFJO0FBQUEsWUFDVixRQUFRO0FBQUEsVUFDNUIsQ0FBaUI7QUFDRCxjQUFJLE1BQU0sV0FBVztBQUNqQixtQkFBTztBQUNYLGNBQUksTUFBTSxXQUFXO0FBQ2pCLG1CQUFPLE1BQUs7QUFFaEIsNEJBQWtCLE1BQU0sS0FBSztBQUM3QixpQkFBTyxFQUFFLFFBQVEsT0FBTyxPQUFPLE9BQU8sTUFBTSxNQUFLO0FBQUEsUUFDckQsT0FDSztBQUNELGlCQUFPLEtBQUssS0FBSyxPQUFPLFlBQVksRUFBRSxNQUFNLElBQUksTUFBTSxNQUFNLElBQUksTUFBTSxRQUFRLElBQUcsQ0FBRSxFQUFFLEtBQUssQ0FBQyxVQUFVO0FBQ2pHLGdCQUFJLE1BQU0sV0FBVztBQUNqQixxQkFBTztBQUNYLGdCQUFJLE1BQU0sV0FBVztBQUNqQixxQkFBTyxNQUFLO0FBQ2hCLG1CQUFPLGtCQUFrQixNQUFNLEtBQUssRUFBRSxLQUFLLE1BQU07QUFDN0MscUJBQU8sRUFBRSxRQUFRLE9BQU8sT0FBTyxPQUFPLE1BQU0sTUFBSztBQUFBLFlBQ3JELENBQUM7QUFBQSxVQUNMLENBQUM7QUFBQSxRQUNMO0FBQUEsTUFDSjtBQUNBLFVBQUksT0FBTyxTQUFTLGFBQWE7QUFDN0IsWUFBSSxJQUFJLE9BQU8sVUFBVSxPQUFPO0FBQzVCLGdCQUFNLE9BQU8sS0FBSyxLQUFLLE9BQU8sV0FBVztBQUFBLFlBQ3JDLE1BQU0sSUFBSTtBQUFBLFlBQ1YsTUFBTSxJQUFJO0FBQUEsWUFDVixRQUFRO0FBQUEsVUFDNUIsQ0FBaUI7QUFDRCxjQUFJLENBQUMsUUFBUSxJQUFJO0FBQ2IsbUJBQU87QUFDWCxnQkFBTUEsVUFBUyxPQUFPLFVBQVUsS0FBSyxPQUFPLFFBQVE7QUFDcEQsY0FBSUEsbUJBQWtCLFNBQVM7QUFDM0Isa0JBQU0sSUFBSSxNQUFNLGlHQUFpRztBQUFBLFVBQ3JIO0FBQ0EsaUJBQU8sRUFBRSxRQUFRLE9BQU8sT0FBTyxPQUFPQSxRQUFNO0FBQUEsUUFDaEQsT0FDSztBQUNELGlCQUFPLEtBQUssS0FBSyxPQUFPLFlBQVksRUFBRSxNQUFNLElBQUksTUFBTSxNQUFNLElBQUksTUFBTSxRQUFRLElBQUcsQ0FBRSxFQUFFLEtBQUssQ0FBQyxTQUFTO0FBQ2hHLGdCQUFJLENBQUMsUUFBUSxJQUFJO0FBQ2IscUJBQU87QUFDWCxtQkFBTyxRQUFRLFFBQVEsT0FBTyxVQUFVLEtBQUssT0FBTyxRQUFRLENBQUMsRUFBRSxLQUFLLENBQUNBLGFBQVk7QUFBQSxjQUM3RSxRQUFRLE9BQU87QUFBQSxjQUNmLE9BQU9BO0FBQUEsWUFDL0IsRUFBc0I7QUFBQSxVQUNOLENBQUM7QUFBQSxRQUNMO0FBQUEsTUFDSjtBQUNBLFdBQUssWUFBWSxNQUFNO0FBQUEsSUFDM0I7QUFBQSxFQUNKO0FBQ0EsYUFBVyxTQUFTLENBQUMsUUFBUSxRQUFRLFdBQVc7QUFDNUMsV0FBTyxJQUFJLFdBQVc7QUFBQSxNQUNsQjtBQUFBLE1BQ0EsVUFBVSxzQkFBc0I7QUFBQSxNQUNoQztBQUFBLE1BQ0EsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQ0EsYUFBVyx1QkFBdUIsQ0FBQyxZQUFZLFFBQVEsV0FBVztBQUM5RCxXQUFPLElBQUksV0FBVztBQUFBLE1BQ2xCO0FBQUEsTUFDQSxRQUFRLEVBQUUsTUFBTSxjQUFjLFdBQVcsV0FBVTtBQUFBLE1BQ25ELFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQUEsRUFFTyxNQUFNLG9CQUFvQixRQUFRO0FBQUEsSUFDckMsT0FBTyxPQUFPO0FBQ1YsWUFBTSxhQUFhLEtBQUssU0FBUyxLQUFLO0FBQ3RDLFVBQUksZUFBZSxjQUFjLFdBQVc7QUFDeEMsZUFBTyxHQUFHLE1BQVM7QUFBQSxNQUN2QjtBQUNBLGFBQU8sS0FBSyxLQUFLLFVBQVUsT0FBTyxLQUFLO0FBQUEsSUFDM0M7QUFBQSxJQUNBLFNBQVM7QUFDTCxhQUFPLEtBQUssS0FBSztBQUFBLElBQ3JCO0FBQUEsRUFDSjtBQUNBLGNBQVksU0FBUyxDQUFDLE1BQU0sV0FBVztBQUNuQyxXQUFPLElBQUksWUFBWTtBQUFBLE1BQ25CLFdBQVc7QUFBQSxNQUNYLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQUEsRUFDTyxNQUFNLG9CQUFvQixRQUFRO0FBQUEsSUFDckMsT0FBTyxPQUFPO0FBQ1YsWUFBTSxhQUFhLEtBQUssU0FBUyxLQUFLO0FBQ3RDLFVBQUksZUFBZSxjQUFjLE1BQU07QUFDbkMsZUFBTyxHQUFHLElBQUk7QUFBQSxNQUNsQjtBQUNBLGFBQU8sS0FBSyxLQUFLLFVBQVUsT0FBTyxLQUFLO0FBQUEsSUFDM0M7QUFBQSxJQUNBLFNBQVM7QUFDTCxhQUFPLEtBQUssS0FBSztBQUFBLElBQ3JCO0FBQUEsRUFDSjtBQUNBLGNBQVksU0FBUyxDQUFDLE1BQU0sV0FBVztBQUNuQyxXQUFPLElBQUksWUFBWTtBQUFBLE1BQ25CLFdBQVc7QUFBQSxNQUNYLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQUEsRUFDTyxNQUFNLG1CQUFtQixRQUFRO0FBQUEsSUFDcEMsT0FBTyxPQUFPO0FBQ1YsWUFBTSxFQUFFLElBQUcsSUFBSyxLQUFLLG9CQUFvQixLQUFLO0FBQzlDLFVBQUksT0FBTyxJQUFJO0FBQ2YsVUFBSSxJQUFJLGVBQWUsY0FBYyxXQUFXO0FBQzVDLGVBQU8sS0FBSyxLQUFLLGFBQVk7QUFBQSxNQUNqQztBQUNBLGFBQU8sS0FBSyxLQUFLLFVBQVUsT0FBTztBQUFBLFFBQzlCO0FBQUEsUUFDQSxNQUFNLElBQUk7QUFBQSxRQUNWLFFBQVE7QUFBQSxNQUNwQixDQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0EsZ0JBQWdCO0FBQ1osYUFBTyxLQUFLLEtBQUs7QUFBQSxJQUNyQjtBQUFBLEVBQ0o7QUFDQSxhQUFXLFNBQVMsQ0FBQyxNQUFNLFdBQVc7QUFDbEMsV0FBTyxJQUFJLFdBQVc7QUFBQSxNQUNsQixXQUFXO0FBQUEsTUFDWCxVQUFVLHNCQUFzQjtBQUFBLE1BQ2hDLGNBQWMsT0FBTyxPQUFPLFlBQVksYUFBYSxPQUFPLFVBQVUsTUFBTSxPQUFPO0FBQUEsTUFDbkYsR0FBRyxvQkFBb0IsTUFBTTtBQUFBLElBQ3JDLENBQUs7QUFBQSxFQUNMO0FBQUEsRUFDTyxNQUFNLGlCQUFpQixRQUFRO0FBQUEsSUFDbEMsT0FBTyxPQUFPO0FBQ1YsWUFBTSxFQUFFLElBQUcsSUFBSyxLQUFLLG9CQUFvQixLQUFLO0FBRTlDLFlBQU0sU0FBUztBQUFBLFFBQ1gsR0FBRztBQUFBLFFBQ0gsUUFBUTtBQUFBLFVBQ0osR0FBRyxJQUFJO0FBQUEsVUFDUCxRQUFRLENBQUE7QUFBQSxRQUN4QjtBQUFBLE1BQ0E7QUFDUSxZQUFNQSxVQUFTLEtBQUssS0FBSyxVQUFVLE9BQU87QUFBQSxRQUN0QyxNQUFNLE9BQU87QUFBQSxRQUNiLE1BQU0sT0FBTztBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ0osR0FBRztBQUFBLFFBQ25CO0FBQUEsTUFDQSxDQUFTO0FBQ0QsVUFBSSxRQUFRQSxPQUFNLEdBQUc7QUFDakIsZUFBT0EsUUFBTyxLQUFLLENBQUNBLFlBQVc7QUFDM0IsaUJBQU87QUFBQSxZQUNILFFBQVE7QUFBQSxZQUNSLE9BQU9BLFFBQU8sV0FBVyxVQUNuQkEsUUFBTyxRQUNQLEtBQUssS0FBSyxXQUFXO0FBQUEsY0FDbkIsSUFBSSxRQUFRO0FBQ1IsdUJBQU8sSUFBSSxTQUFTLE9BQU8sT0FBTyxNQUFNO0FBQUEsY0FDNUM7QUFBQSxjQUNBLE9BQU8sT0FBTztBQUFBLFlBQzFDLENBQXlCO0FBQUEsVUFDekI7QUFBQSxRQUNZLENBQUM7QUFBQSxNQUNMLE9BQ0s7QUFDRCxlQUFPO0FBQUEsVUFDSCxRQUFRO0FBQUEsVUFDUixPQUFPQSxRQUFPLFdBQVcsVUFDbkJBLFFBQU8sUUFDUCxLQUFLLEtBQUssV0FBVztBQUFBLFlBQ25CLElBQUksUUFBUTtBQUNSLHFCQUFPLElBQUksU0FBUyxPQUFPLE9BQU8sTUFBTTtBQUFBLFlBQzVDO0FBQUEsWUFDQSxPQUFPLE9BQU87QUFBQSxVQUN0QyxDQUFxQjtBQUFBLFFBQ3JCO0FBQUEsTUFDUTtBQUFBLElBQ0o7QUFBQSxJQUNBLGNBQWM7QUFDVixhQUFPLEtBQUssS0FBSztBQUFBLElBQ3JCO0FBQUEsRUFDSjtBQUNBLFdBQVMsU0FBUyxDQUFDLE1BQU0sV0FBVztBQUNoQyxXQUFPLElBQUksU0FBUztBQUFBLE1BQ2hCLFdBQVc7QUFBQSxNQUNYLFVBQVUsc0JBQXNCO0FBQUEsTUFDaEMsWUFBWSxPQUFPLE9BQU8sVUFBVSxhQUFhLE9BQU8sUUFBUSxNQUFNLE9BQU87QUFBQSxNQUM3RSxHQUFHLG9CQUFvQixNQUFNO0FBQUEsSUFDckMsQ0FBSztBQUFBLEVBQ0w7QUFBQSxFQUNPLE1BQU0sZUFBZSxRQUFRO0FBQUEsSUFDaEMsT0FBTyxPQUFPO0FBQ1YsWUFBTSxhQUFhLEtBQUssU0FBUyxLQUFLO0FBQ3RDLFVBQUksZUFBZSxjQUFjLEtBQUs7QUFDbEMsY0FBTSxNQUFNLEtBQUssZ0JBQWdCLEtBQUs7QUFDdEMsMEJBQWtCLEtBQUs7QUFBQSxVQUNuQixNQUFNLGFBQWE7QUFBQSxVQUNuQixVQUFVLGNBQWM7QUFBQSxVQUN4QixVQUFVLElBQUk7QUFBQSxRQUM5QixDQUFhO0FBQ0QsZUFBTztBQUFBLE1BQ1g7QUFDQSxhQUFPLEVBQUUsUUFBUSxTQUFTLE9BQU8sTUFBTSxLQUFJO0FBQUEsSUFDL0M7QUFBQSxFQUNKO0FBQ0EsU0FBTyxTQUFTLENBQUMsV0FBVztBQUN4QixXQUFPLElBQUksT0FBTztBQUFBLE1BQ2QsVUFBVSxzQkFBc0I7QUFBQSxNQUNoQyxHQUFHLG9CQUFvQixNQUFNO0FBQUEsSUFDckMsQ0FBSztBQUFBLEVBQ0w7QUFBQSxFQUVPLE1BQU0sbUJBQW1CLFFBQVE7QUFBQSxJQUNwQyxPQUFPLE9BQU87QUFDVixZQUFNLEVBQUUsSUFBRyxJQUFLLEtBQUssb0JBQW9CLEtBQUs7QUFDOUMsWUFBTSxPQUFPLElBQUk7QUFDakIsYUFBTyxLQUFLLEtBQUssS0FBSyxPQUFPO0FBQUEsUUFDekI7QUFBQSxRQUNBLE1BQU0sSUFBSTtBQUFBLFFBQ1YsUUFBUTtBQUFBLE1BQ3BCLENBQVM7QUFBQSxJQUNMO0FBQUEsSUFDQSxTQUFTO0FBQ0wsYUFBTyxLQUFLLEtBQUs7QUFBQSxJQUNyQjtBQUFBLEVBQ0o7QUFBQSxFQUNPLE1BQU0sb0JBQW9CLFFBQVE7QUFBQSxJQUNyQyxPQUFPLE9BQU87QUFDVixZQUFNLEVBQUUsUUFBUSxJQUFHLElBQUssS0FBSyxvQkFBb0IsS0FBSztBQUN0RCxVQUFJLElBQUksT0FBTyxPQUFPO0FBQ2xCLGNBQU0sY0FBYyxZQUFZO0FBQzVCLGdCQUFNLFdBQVcsTUFBTSxLQUFLLEtBQUssR0FBRyxZQUFZO0FBQUEsWUFDNUMsTUFBTSxJQUFJO0FBQUEsWUFDVixNQUFNLElBQUk7QUFBQSxZQUNWLFFBQVE7QUFBQSxVQUM1QixDQUFpQjtBQUNELGNBQUksU0FBUyxXQUFXO0FBQ3BCLG1CQUFPO0FBQ1gsY0FBSSxTQUFTLFdBQVcsU0FBUztBQUM3QixtQkFBTyxNQUFLO0FBQ1osbUJBQU8sTUFBTSxTQUFTLEtBQUs7QUFBQSxVQUMvQixPQUNLO0FBQ0QsbUJBQU8sS0FBSyxLQUFLLElBQUksWUFBWTtBQUFBLGNBQzdCLE1BQU0sU0FBUztBQUFBLGNBQ2YsTUFBTSxJQUFJO0FBQUEsY0FDVixRQUFRO0FBQUEsWUFDaEMsQ0FBcUI7QUFBQSxVQUNMO0FBQUEsUUFDSjtBQUNBLGVBQU8sWUFBVztBQUFBLE1BQ3RCLE9BQ0s7QUFDRCxjQUFNLFdBQVcsS0FBSyxLQUFLLEdBQUcsV0FBVztBQUFBLFVBQ3JDLE1BQU0sSUFBSTtBQUFBLFVBQ1YsTUFBTSxJQUFJO0FBQUEsVUFDVixRQUFRO0FBQUEsUUFDeEIsQ0FBYTtBQUNELFlBQUksU0FBUyxXQUFXO0FBQ3BCLGlCQUFPO0FBQ1gsWUFBSSxTQUFTLFdBQVcsU0FBUztBQUM3QixpQkFBTyxNQUFLO0FBQ1osaUJBQU87QUFBQSxZQUNILFFBQVE7QUFBQSxZQUNSLE9BQU8sU0FBUztBQUFBLFVBQ3BDO0FBQUEsUUFDWSxPQUNLO0FBQ0QsaUJBQU8sS0FBSyxLQUFLLElBQUksV0FBVztBQUFBLFlBQzVCLE1BQU0sU0FBUztBQUFBLFlBQ2YsTUFBTSxJQUFJO0FBQUEsWUFDVixRQUFRO0FBQUEsVUFDNUIsQ0FBaUI7QUFBQSxRQUNMO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxJQUNBLE9BQU8sT0FBTyxHQUFHLEdBQUc7QUFDaEIsYUFBTyxJQUFJLFlBQVk7QUFBQSxRQUNuQixJQUFJO0FBQUEsUUFDSixLQUFLO0FBQUEsUUFDTCxVQUFVLHNCQUFzQjtBQUFBLE1BQzVDLENBQVM7QUFBQSxJQUNMO0FBQUEsRUFDSjtBQUFBLEVBQ08sTUFBTSxvQkFBb0IsUUFBUTtBQUFBLElBQ3JDLE9BQU8sT0FBTztBQUNWLFlBQU1BLFVBQVMsS0FBSyxLQUFLLFVBQVUsT0FBTyxLQUFLO0FBQy9DLFlBQU0sU0FBUyxDQUFDLFNBQVM7QUFDckIsWUFBSSxRQUFRLElBQUksR0FBRztBQUNmLGVBQUssUUFBUSxPQUFPLE9BQU8sS0FBSyxLQUFLO0FBQUEsUUFDekM7QUFDQSxlQUFPO0FBQUEsTUFDWDtBQUNBLGFBQU8sUUFBUUEsT0FBTSxJQUFJQSxRQUFPLEtBQUssQ0FBQyxTQUFTLE9BQU8sSUFBSSxDQUFDLElBQUksT0FBT0EsT0FBTTtBQUFBLElBQ2hGO0FBQUEsSUFDQSxTQUFTO0FBQ0wsYUFBTyxLQUFLLEtBQUs7QUFBQSxJQUNyQjtBQUFBLEVBQ0o7QUFDQSxjQUFZLFNBQVMsQ0FBQyxNQUFNLFdBQVc7QUFDbkMsV0FBTyxJQUFJLFlBQVk7QUFBQSxNQUNuQixXQUFXO0FBQUEsTUFDWCxVQUFVLHNCQUFzQjtBQUFBLE1BQ2hDLEdBQUcsb0JBQW9CLE1BQU07QUFBQSxJQUNyQyxDQUFLO0FBQUEsRUFDTDtBQWtETyxNQUFJO0FBQ1gsR0FBQyxTQUFVTSx3QkFBdUI7QUFDOUIsSUFBQUEsdUJBQXNCLFdBQVcsSUFBSTtBQUNyQyxJQUFBQSx1QkFBc0IsV0FBVyxJQUFJO0FBQ3JDLElBQUFBLHVCQUFzQixRQUFRLElBQUk7QUFDbEMsSUFBQUEsdUJBQXNCLFdBQVcsSUFBSTtBQUNyQyxJQUFBQSx1QkFBc0IsWUFBWSxJQUFJO0FBQ3RDLElBQUFBLHVCQUFzQixTQUFTLElBQUk7QUFDbkMsSUFBQUEsdUJBQXNCLFdBQVcsSUFBSTtBQUNyQyxJQUFBQSx1QkFBc0IsY0FBYyxJQUFJO0FBQ3hDLElBQUFBLHVCQUFzQixTQUFTLElBQUk7QUFDbkMsSUFBQUEsdUJBQXNCLFFBQVEsSUFBSTtBQUNsQyxJQUFBQSx1QkFBc0IsWUFBWSxJQUFJO0FBQ3RDLElBQUFBLHVCQUFzQixVQUFVLElBQUk7QUFDcEMsSUFBQUEsdUJBQXNCLFNBQVMsSUFBSTtBQUNuQyxJQUFBQSx1QkFBc0IsVUFBVSxJQUFJO0FBQ3BDLElBQUFBLHVCQUFzQixXQUFXLElBQUk7QUFDckMsSUFBQUEsdUJBQXNCLFVBQVUsSUFBSTtBQUNwQyxJQUFBQSx1QkFBc0IsdUJBQXVCLElBQUk7QUFDakQsSUFBQUEsdUJBQXNCLGlCQUFpQixJQUFJO0FBQzNDLElBQUFBLHVCQUFzQixVQUFVLElBQUk7QUFDcEMsSUFBQUEsdUJBQXNCLFdBQVcsSUFBSTtBQUNyQyxJQUFBQSx1QkFBc0IsUUFBUSxJQUFJO0FBQ2xDLElBQUFBLHVCQUFzQixRQUFRLElBQUk7QUFDbEMsSUFBQUEsdUJBQXNCLGFBQWEsSUFBSTtBQUN2QyxJQUFBQSx1QkFBc0IsU0FBUyxJQUFJO0FBQ25DLElBQUFBLHVCQUFzQixZQUFZLElBQUk7QUFDdEMsSUFBQUEsdUJBQXNCLFNBQVMsSUFBSTtBQUNuQyxJQUFBQSx1QkFBc0IsWUFBWSxJQUFJO0FBQ3RDLElBQUFBLHVCQUFzQixlQUFlLElBQUk7QUFDekMsSUFBQUEsdUJBQXNCLGFBQWEsSUFBSTtBQUN2QyxJQUFBQSx1QkFBc0IsYUFBYSxJQUFJO0FBQ3ZDLElBQUFBLHVCQUFzQixZQUFZLElBQUk7QUFDdEMsSUFBQUEsdUJBQXNCLFVBQVUsSUFBSTtBQUNwQyxJQUFBQSx1QkFBc0IsWUFBWSxJQUFJO0FBQ3RDLElBQUFBLHVCQUFzQixZQUFZLElBQUk7QUFDdEMsSUFBQUEsdUJBQXNCLGFBQWEsSUFBSTtBQUN2QyxJQUFBQSx1QkFBc0IsYUFBYSxJQUFJO0FBQUEsRUFDM0MsR0FBRywwQkFBMEIsd0JBQXdCLENBQUEsRUFBRztBQVV4RCxRQUFNLGFBQWEsVUFBVTtBQUM3QixRQUFNLGFBQWEsVUFBVTtBQUc3QixRQUFNLGNBQWMsV0FBVztBQU9iLFdBQVM7QUFFM0IsUUFBTSxZQUFZLFNBQVM7QUFDM0IsUUFBTSxhQUFhLFVBQVU7QUFFN0IsUUFBTSxZQUFZLFNBQVM7QUFFRixrQkFBZ0I7QUFDekMsUUFBTSxZQUFZLFNBQVM7QUFDM0IsUUFBTSxhQUFhLFVBQVU7QUFLN0IsUUFBTSxjQUFjLFdBQVc7QUFDL0IsUUFBTSxXQUFXLFFBQVE7QUFFTCxhQUFXO0FBRVYsY0FBWTtBQUNaLGNBQVk7QUN6bEgxQixRQUFNLGFBQWFDLFVBQVEsQ0FBQ0MsY0FBWUEsV0FBRSxHQUFVQSxXQUFFLEdBQVVBLFdBQUUsQ0FBUSxDQUFDO0FBRXREQyxlQUFXLE9BQU8sQ0FBQyxRQUFRO0FBQ3JELFdBQU8scUNBQXFDLEtBQUssR0FBRztBQUFBLEVBQ3RELEdBQUcsRUFBRSxTQUFTLHFFQUFBLENBQXNFO0FBRTdFLFFBQU0sZ0JBQWdCQSxXQUFFO0FBRXhCLFFBQU0sZUFBZUMsU0FBTyxDQUFDLE9BQU8sUUFBUSxVQUFVLEtBQUssQ0FBQztBQUU1RCxRQUFNLHFCQUFxQkEsU0FBTztBQUFBLElBQ3ZDO0FBQUEsSUFBVTtBQUFBLElBQVM7QUFBQSxJQUFZO0FBQUEsSUFBWTtBQUFBLElBQVE7QUFBQSxJQUFPO0FBQUEsSUFBUTtBQUFBLElBQ2xFO0FBQUEsSUFBUztBQUFBLElBQVM7QUFBQSxJQUFRO0FBQUEsSUFBYztBQUFBLElBQVM7QUFBQSxJQUFRO0FBQUEsSUFBa0I7QUFBQSxFQUM3RSxDQUFDO0FBRU0sUUFBTSxvQkFBb0JBLFNBQU87QUFBQSxJQUN0QztBQUFBLElBQVc7QUFBQSxJQUFZO0FBQUEsSUFBWTtBQUFBLElBQVk7QUFBQSxJQUMvQztBQUFBLElBQVc7QUFBQSxJQUFXO0FBQUEsSUFBYTtBQUFBLEVBQ3JDLENBQUM7QUFFTSxRQUFNLGtCQUFrQkEsU0FBTztBQUFBLElBQ3BDO0FBQUEsSUFBVztBQUFBLElBQU87QUFBQSxJQUFTO0FBQUEsSUFBVTtBQUFBLElBQU87QUFBQSxJQUFRO0FBQUEsSUFBVTtBQUFBLElBQzlEO0FBQUEsSUFBTztBQUFBLElBQVU7QUFBQSxJQUFZO0FBQUEsSUFBVztBQUFBLElBQVU7QUFBQSxJQUFZO0FBQUEsSUFBVztBQUFBLEVBQzNFLENBQUM7QUFFTSxRQUFNLHVCQUF1QkEsU0FBTztBQUFBLElBQ3pDO0FBQUEsSUFBc0I7QUFBQSxJQUFpQjtBQUFBLElBQWlCO0FBQUEsSUFDeEQ7QUFBQSxJQUFrQjtBQUFBLElBQWU7QUFBQSxJQUFtQjtBQUFBLElBQ3BEO0FBQUEsSUFBaUI7QUFBQSxJQUFvQjtBQUFBLElBQ3JDO0FBQUEsSUFBcUI7QUFBQSxJQUFlO0FBQUEsSUFBVztBQUFBLEVBQ2pELENBQUM7QUFFK0JDLGFBQVM7QUFBQSxJQUN2QyxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxTQUFTRixXQUFFO0FBQUEsSUFDWCxXQUFXRyxZQUFFO0FBQUEsSUFDYixRQUFRQyxXQUFTQyxVQUFRLENBQUNMLFdBQUUsR0FBVUQsV0FBRSxHQUFVSSxZQUFFLENBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBQTtBQUFBLEVBQ25FLENBQUMsRUFBRSxPQUFBO0FBRWlDRCxhQUFTO0FBQUEsSUFDM0MsSUFBSUgsV0FBRTtBQUFBLElBQ04sVUFBVUMsV0FBRTtBQUFBLElBQ1osT0FBTztBQUFBLElBQ1AsYUFBYUQsV0FBRTtBQUFBLElBQ2YsTUFBTUssV0FBU0MsVUFBUSxDQUFDTCxXQUFFLEdBQVVELFdBQUUsR0FBVUksWUFBRSxDQUFTLENBQUMsQ0FBQyxFQUFFLFNBQUE7QUFBQSxFQUNqRSxDQUFDLEVBQUUsT0FBQTtBQUVJLFFBQU0sa0JBQWtCRCxXQUFTO0FBQUEsSUFDdEMsVUFBVTtBQUFBLElBQ1YsaUJBQWlCLGNBQWMsU0FBQTtBQUFBLElBQy9CLFFBQVFGLFdBQUU7QUFBQSxJQUNWLE1BQU1BLFdBQUU7QUFBQSxJQUNSLFFBQVFGLFVBQVEsQ0FBQ0MsY0FBWUEsV0FBRSxDQUFRLENBQUM7QUFBQSxJQUN4QyxZQUFZSSxZQUFFO0FBQUEsRUFDaEIsQ0FBQyxFQUFFLE9BQUE7QUFFSSxRQUFNLHVCQUF1QkQsV0FBUztBQUFBLElBQzNDLFFBQVFGLFdBQUU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFFBQVFBLFdBQUU7QUFBQSxJQUNWLEtBQUtBLFdBQUU7QUFBQSxJQUNQLE1BQU1BLFdBQUUsRUFBUyxTQUFBO0FBQUEsSUFDakIsTUFBTUEsV0FBRSxFQUFTLFNBQUE7QUFBQSxJQUNqQixNQUFNQSxXQUFFO0FBQUEsSUFDUixNQUFNRSxXQUFTO0FBQUEsTUFDYixVQUFVQyxZQUFFLEVBQVUsU0FBQTtBQUFBLE1BQ3RCLFNBQVNFLFVBQVEsQ0FBQ0YsWUFBRSxHQUFXRyxZQUFVLE9BQU8sQ0FBQyxDQUFDLEVBQUUsU0FBQTtBQUFBLE1BQ3BELFVBQVVILFlBQUUsRUFBVSxTQUFBO0FBQUEsTUFDdEIsVUFBVUEsWUFBRSxFQUFVLFNBQUE7QUFBQSxNQUN0QixTQUFTQSxZQUFFLEVBQVUsU0FBQTtBQUFBLE1BQ3JCLFFBQVFBLFlBQUUsRUFBVSxTQUFBO0FBQUEsSUFBUyxDQUM5QixFQUFFLE9BQUE7QUFBQSxJQUNILE9BQU9ELFdBQVM7QUFBQSxNQUNkLE1BQU1GLFdBQUU7QUFBQSxNQUNSLGNBQWNBLFdBQUUsRUFBUyxTQUFBO0FBQUEsTUFDekIsTUFBTUEsV0FBRSxFQUFTLFNBQUE7QUFBQSxNQUNqQixhQUFhQSxXQUFFLEVBQVMsU0FBQTtBQUFBLE1BQ3hCLGFBQWFHLFlBQUU7QUFBQSxNQUNmLFdBQVdBLFlBQUU7QUFBQSxNQUNiLE9BQU9ILFdBQUUsRUFBUyxTQUFBO0FBQUEsSUFBUyxDQUM1QixFQUFFLE9BQUEsRUFBUyxTQUFBO0FBQUEsSUFDWixNQUFNO0FBQUEsSUFDTixTQUFTRyxZQUFFO0FBQUEsSUFDWCxhQUFhQSxZQUFFO0FBQUEsSUFDZixVQUFVQSxZQUFFO0FBQUEsSUFDWixjQUFjQSxZQUFFO0FBQUEsSUFDaEIsV0FBV0YsU0FBTztBQUFBLE1BQ2hCO0FBQUEsTUFBUTtBQUFBLE1BQVU7QUFBQSxNQUFPO0FBQUEsTUFBTztBQUFBLE1BQVM7QUFBQSxNQUN6QztBQUFBLE1BQWU7QUFBQSxNQUFpQjtBQUFBLElBQUEsQ0FDakM7QUFBQSxJQUNELGNBQWNFLFlBQUU7QUFBQSxJQUNoQixlQUFlQSxZQUFFO0FBQUEsSUFDakIsZUFBZUgsV0FBRSxFQUFTLFNBQUE7QUFBQSxFQUM1QixDQUFDLEVBQUUsT0FBQTtBQUU4QkUsYUFBUztBQUFBLElBQ3hDLGFBQWFGLFdBQUU7QUFBQSxJQUNmLFlBQVlBLFdBQUU7QUFBQSxJQUNkLFVBQVVBLFdBQUU7QUFBQSxJQUNaLFFBQVFPLFVBQVEsZUFBZTtBQUFBLElBQy9CLFVBQVVBLFVBQVEsb0JBQW9CO0FBQUEsSUFDdEMsVUFBVUwsV0FBUyxFQUFFLEdBQUdILFdBQUUsR0FBVSxHQUFHQSxXQUFFLEdBQVUsRUFBRSxPQUFBO0FBQUEsSUFDckQsS0FBS0EsV0FBRTtBQUFBLElBQ1AsUUFBUUcsV0FBUyxFQUFFLEdBQUdILFdBQUUsR0FBVSxHQUFHQSxXQUFFLEdBQVUsRUFBRSxPQUFBO0FBQUEsSUFDbkQsaUJBQWlCQyxXQUFFO0FBQUEsSUFDbkIsSUFBSUQsV0FBRTtBQUFBLEVBQ1IsQ0FBQyxFQUFFLE9BQUE7QUFFSSxRQUFNLHFCQUFxQkUsU0FBTyxDQUFDLFFBQVEsVUFBVSxLQUFLLENBQUM7QUFDM0QsUUFBTSxtQkFBbUJBLFNBQU8sQ0FBQyxPQUFPLGFBQWEsUUFBUSxRQUFRLENBQUM7QUFDdEUsUUFBTSxvQkFBb0JBLFNBQU8sQ0FBQyxRQUFRLFVBQVUsS0FBSyxDQUFDO0FBRTFELFFBQU0sZUFBZUMsV0FBUztBQUFBLElBQ25DLE9BQU87QUFBQSxJQUNQLFNBQVNELFNBQU8sQ0FBQyxVQUFVLFNBQVMsUUFBUSxNQUFNLENBQUM7QUFBQSxJQUNuRCxvQkFBb0JGLFdBQUU7QUFBQSxJQUN0QixZQUFZQSxXQUFFO0FBQUEsSUFDZCxnQkFBZ0JJLFlBQUU7QUFBQSxJQUNsQixVQUFVRixTQUFPLENBQUMsT0FBTyxRQUFRLGFBQWEsQ0FBQztBQUFBLEVBQ2pELENBQUMsRUFBRSxPQUFBO0FBRUksUUFBTSx3QkFBd0JDLFdBQVM7QUFBQSxJQUM1QyxZQUFZRixXQUFFO0FBQUEsSUFDZCxRQUFRQSxXQUFFLEVBQVMsU0FBQTtBQUFBLElBQ25CLE9BQU87QUFBQSxJQUNQLFNBQVNPLFVBQVFQLFlBQVU7QUFBQSxJQUMzQixNQUFNLFdBQVcsU0FBQTtBQUFBLElBQ2pCLE9BQU9PLFVBQVEsZ0JBQWdCO0FBQUEsRUFDakMsQ0FBQyxFQUFFLE9BQUE7QUFFOEJMLGFBQVM7QUFBQSxJQUN4QyxhQUFhRixXQUFFO0FBQUEsSUFDZixpQkFBaUJBLFdBQUU7QUFBQSxJQUNuQixXQUFXTyxVQUFRLHFCQUFxQjtBQUFBLElBQ3hDLGtCQUFrQkosWUFBRTtBQUFBLElBQ3BCLFFBQVE7QUFBQSxFQUNWLENBQUMsRUFBRSxPQUFBO0FBRThCRCxhQUFTO0FBQUEsSUFDeEMsWUFBWUYsV0FBRTtBQUFBLElBQ2QsaUJBQWlCQSxXQUFFO0FBQUEsSUFDbkIsS0FBS0QsV0FBRTtBQUFBLElBQ1AsVUFBVUcsV0FBUyxFQUFFLEdBQUdILFdBQUUsR0FBVSxHQUFHQSxXQUFFLEdBQVUsRUFBRSxPQUFBO0FBQUEsSUFDckQsUUFBUUcsV0FBUyxFQUFFLEdBQUdILFdBQUUsR0FBVSxHQUFHQSxXQUFFLEdBQVUsRUFBRSxPQUFBO0FBQUEsSUFDbkQsT0FBT0csV0FBUyxFQUFFLEdBQUdILFdBQUUsR0FBVSxHQUFHQSxXQUFFLEdBQVUsRUFBRSxPQUFBO0FBQUEsSUFDbEQsSUFBSUEsV0FBRTtBQUFBLEVBQ1IsQ0FBQyxFQUFFLE9BQUE7QUFFMkJHLGFBQVM7QUFBQSxJQUNyQyxNQUFNRixXQUFFO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixZQUFZRCxXQUFFO0FBQUEsSUFDZCxTQUFTQSxXQUFFO0FBQUEsRUFDYixDQUFDLEVBQUUsT0FBQTtBQUUwQkcsYUFBUztBQUFBLElBQ3BDLE1BQU07QUFBQSxJQUNOLFlBQVlILFdBQUU7QUFBQSxJQUNkLGlCQUFpQk8sWUFBVSxPQUFPO0FBQUEsRUFDcEMsQ0FBQyxFQUFFLE9BQUE7QUFFSSxRQUFNLGdCQUFnQkwsU0FBTztBQUFBLElBQ2xDO0FBQUEsSUFBUztBQUFBLElBQVM7QUFBQSxJQUFVO0FBQUEsSUFBVztBQUFBLElBQU87QUFBQSxJQUFRO0FBQUEsSUFDdEQ7QUFBQSxJQUFjO0FBQUEsSUFBVTtBQUFBLElBQWdCO0FBQUEsSUFBUTtBQUFBLEVBQ2xELENBQUM7QUFFTSxRQUFNLDZCQUE2QkMsV0FBUztBQUFBLElBQ2pELEtBQUtGLFdBQUU7QUFBQSxJQUNQLE1BQU1DLFNBQU8sQ0FBQyxZQUFZLFNBQVMsU0FBUyxTQUFTLFNBQVMsQ0FBQztBQUFBLElBQy9ELE9BQU9ELFdBQUU7QUFBQSxFQUNYLENBQUMsRUFBRSxPQUFBO0FBRUksUUFBTSxtQkFBbUJDLFNBQU87QUFBQSxJQUNyQztBQUFBLElBQVM7QUFBQSxJQUFVO0FBQUEsSUFBUztBQUFBLElBQVU7QUFBQSxJQUFRO0FBQUEsSUFBWTtBQUFBLElBQWU7QUFBQSxJQUFZO0FBQUEsRUFDdkYsQ0FBQztBQUVNLFFBQU0sb0JBQW9CQyxXQUFTO0FBQUEsSUFDeEMsTUFBTUgsV0FBRTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1Isa0JBQWtCQyxXQUFFLEVBQVMsU0FBQTtBQUFBLElBQzdCLFFBQVFDLFNBQU8sQ0FBQyxNQUFNLFdBQVcsUUFBUSxDQUFDO0FBQUEsSUFDMUMsTUFBTUQsV0FBRSxFQUFTLFNBQUE7QUFBQSxFQUNuQixDQUFDLEVBQUUsT0FBQTtBQUVJLFFBQU0scUJBQXFCRSxXQUFTO0FBQUEsSUFDekMsTUFBTUYsV0FBRSxFQUFTLFNBQUE7QUFBQSxJQUNqQixRQUFRQSxXQUFFLEVBQVMsU0FBQTtBQUFBLElBQ25CLEtBQUtBLFdBQUUsRUFBUyxTQUFBO0FBQUEsSUFDaEIsV0FBV0MsU0FBTyxDQUFDLE1BQU0sUUFBUSxRQUFRLE9BQU8sQ0FBQyxFQUFFLFNBQUE7QUFBQSxJQUNuRCxRQUFRRixXQUFFLEVBQVMsU0FBQTtBQUFBLEVBQ3JCLENBQUMsRUFBRSxPQUFBO0FBRUksUUFBTSx5QkFBeUJHLFdBQVM7QUFBQSxJQUM3QyxXQUFXRixXQUFFO0FBQUEsSUFDYixZQUFZQSxXQUFFO0FBQUEsSUFDZCxRQUFRO0FBQUEsSUFDUixRQUFRRSxXQUFTLEVBQUUsV0FBV0YsV0FBRSxFQUFPLENBQUcsRUFBRSxPQUFBLEVBQVMsU0FBQTtBQUFBLElBQ3JELFFBQVEsbUJBQW1CLFNBQUE7QUFBQSxJQUMzQixZQUFZQSxXQUFFLEVBQVMsU0FBQTtBQUFBLElBQ3ZCLFFBQVFBLFdBQUU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLGlCQUFpQkEsV0FBRTtBQUFBLElBQ25CLFdBQVdBLFdBQUUsRUFBUyxTQUFBO0FBQUEsRUFDeEIsQ0FBQyxFQUFFLE9BQUE7QUFFK0JFLGFBQVM7QUFBQSxJQUN6QyxZQUFZRixXQUFFO0FBQUEsSUFDZCxRQUFRQyxTQUFPLENBQUMsVUFBVSxRQUFRLGFBQWEsTUFBTSxDQUFDO0FBQUEsSUFDdEQsUUFBUSx1QkFBdUIsU0FBQTtBQUFBLElBQy9CLFNBQVNELFdBQUUsRUFBUyxTQUFBO0FBQUEsSUFDcEIsT0FBT0UsV0FBUztBQUFBLE1BQ2QsV0FBV0gsV0FBRTtBQUFBLE1BQ2IsT0FBT0MsV0FBRTtBQUFBLElBQU8sQ0FDakIsRUFBRSxPQUFBO0FBQUEsRUFDTCxDQUFDLEVBQUUsT0FBQTtBQUVJLFFBQU0sd0JBQXdCRSxXQUFTO0FBQUEsSUFDNUMsV0FBV0YsV0FBRTtBQUFBLElBQ2IsTUFBTTtBQUFBLElBQ04sTUFBTUEsV0FBRSxFQUFTLFNBQUE7QUFBQSxJQUNqQixNQUFNO0FBQUEsSUFDTixPQUFPTyxVQUFRLGlCQUFpQjtBQUFBLElBQ2hDLGNBQWNKLFlBQUU7QUFBQSxJQUNoQixVQUFVO0FBQUEsSUFDVixTQUFTSSxVQUFRLFlBQVk7QUFBQSxJQUM3QixZQUFZUixXQUFFO0FBQUEsSUFDZCxXQUFXUSxVQUFRTCxXQUFTLEVBQUUsS0FBS0YsV0FBRSxHQUFVLFFBQVFBLGFBQVMsQ0FBRyxFQUFFLE9BQUEsQ0FBUSxFQUFFLFNBQUE7QUFBQSxJQUMvRSxPQUFPTSxZQUFVLFdBQVc7QUFBQSxFQUM5QixDQUFDLEVBQUUsT0FBQTtBQUVtQ0osYUFBUztBQUFBLElBQzdDLGdCQUFnQkksWUFBVSxLQUFLO0FBQUEsSUFDL0IsWUFBWU4sV0FBRTtBQUFBLElBQ2QsU0FBU0EsV0FBRTtBQUFBLElBQ1gsWUFBWUQsV0FBRTtBQUFBLElBQ2QsTUFBTUMsV0FBRTtBQUFBLElBQ1IsTUFBTUUsV0FBUztBQUFBLE1BQ2IsUUFBUUYsV0FBRTtBQUFBLE1BQ1YsTUFBTUEsV0FBRTtBQUFBLE1BQ1IsT0FBT0EsV0FBRSxFQUFTLFNBQUE7QUFBQSxNQUNsQixpQkFBaUJBLFdBQUU7QUFBQSxNQUNuQixVQUFVRSxXQUFTLEVBQUUsR0FBR0gsV0FBRSxHQUFVLEdBQUdBLFdBQUUsR0FBVSxFQUFFLE9BQUE7QUFBQSxNQUNyRCxXQUFXUSxVQUFRLGFBQWE7QUFBQSxJQUFBLENBQ2pDLEVBQUUsT0FBQTtBQUFBLElBQ0gsU0FBU0EsVUFBUSxxQkFBcUI7QUFBQSxJQUN0QyxjQUFjQSxVQUFRLDBCQUEwQjtBQUFBLElBQ2hELFlBQVlBLFVBQVFMLFdBQVM7QUFBQSxNQUMzQixNQUFNO0FBQUEsTUFDTixPQUFPSCxXQUFFO0FBQUEsSUFBTyxDQUNqQixFQUFFLE9BQUEsQ0FBUTtBQUFBLElBQ1gsT0FBT0csV0FBUztBQUFBLE1BQ2QsTUFBTUksWUFBVSxZQUFZO0FBQUEsTUFDNUIsYUFBYU4sV0FBRTtBQUFBLE1BQ2YsT0FBT0QsV0FBRTtBQUFBLE1BQ1QsUUFBUUEsV0FBRTtBQUFBLE1BQ1YsbUJBQW1CUSxVQUFRUCxZQUFVO0FBQUEsSUFBQSxDQUN0QyxFQUFFLE9BQUEsRUFBUyxTQUFBO0FBQUEsSUFDWixTQUFTTyxVQUFRLGlCQUFpQjtBQUFBLElBQ2xDLE9BQU9MLFdBQVM7QUFBQSxNQUNkLGdDQUFnQ0ssVUFBUVAsWUFBVTtBQUFBLElBQUEsQ0FDbkQsRUFBRSxPQUFBO0FBQUEsRUFDTCxDQUFDLEVBQUUsT0FBQTtBQUVrQ0UsYUFBUztBQUFBLElBQzVDLFlBQVlGLFdBQUU7QUFBQSxJQUNkLE1BQU1BLFdBQUU7QUFBQSxJQUNSLFFBQVFBLFdBQUUsRUFBUyxPQUFPLEVBQUU7QUFBQSxJQUM1QixXQUFXRCxXQUFFO0FBQUEsRUFDZixDQUFDLEVBQUUsT0FBQTs7QUM1UUgsV0FBUyxZQUF1Qzs7QUFDOUMsUUFBSSxPQUFPLFdBQVcsZUFBZSxPQUFPLFNBQVM7QUFDbkQsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLE9BQU8sZUFBZSxpQkFBZ0IsZ0JBQW1CLFdBQW5CLG1CQUEyQixVQUFTO0FBQzVFLGFBQVEsV0FBbUI7QUFBQSxJQUM3QjtBQUNBLFdBQU87QUFBQSxFQUNUO0FBUUEsUUFBTSxxQ0FBcUIsSUFBQTtBQUMzQixNQUFJLHlCQUF5QjtBQUU3QixXQUFTLDRCQUE0QixLQUFvQjtBQUN2RCxRQUFJLHVCQUF3QjtBQUM1Qiw2QkFBeUI7QUFFekIsUUFBSSxRQUFRLFVBQVU7QUFBQSxNQUNwQixDQUFDLFNBQWMsUUFBYSxpQkFBa0Q7QUFDNUUsWUFBSSxDQUFDLFdBQVcsT0FBTyxRQUFRLFNBQVMsVUFBVTtBQUNoRCxpQkFBTztBQUFBLFFBQ1Q7QUFFQSxjQUFNLFdBQVcsZUFBZSxJQUFJLFFBQVEsSUFBSTtBQUNoRCxZQUFJLFlBQVksU0FBUyxTQUFTLEdBQUc7QUFDbkMsa0JBQVEsUUFBQSxFQUNMLEtBQUssTUFBTSxTQUFTLENBQUMsRUFBRyxRQUFRLFNBQVMsTUFBTSxDQUFDLEVBQ2hELEtBQUssQ0FBQyxTQUFTO0FBQ2QseUJBQWEsRUFBRSxJQUFJLE1BQU0sS0FBQSxDQUFNO0FBQUEsVUFDakMsQ0FBQyxFQUNBLE1BQU0sQ0FBQyxRQUFRO0FBQ2Qsa0JBQU0sU0FDSiwyQkFBSyxVQUFRLDJCQUFLLFNBQ2QsTUFDQSxXQUFXLFlBQVksUUFBTywyQkFBSyxZQUFXLE9BQU8sR0FBRyxDQUFDO0FBQy9ELHlCQUFhLEVBQUUsSUFBSSxPQUFPLE1BQUEsQ0FBTztBQUFBLFVBQ25DLENBQUM7QUFDSCxpQkFBTztBQUFBLFFBQ1Q7QUFFQSxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQUE7QUFBQSxFQUVKO0FBR0EsUUFBTSxvQ0FBb0IsSUFBQTtBQUVuQixRQUFNLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlqQixNQUFNLEtBQ0osTUFDQSxTQUNBLFNBQ2lEOztBQUNqRCxZQUFNLFVBQVUsRUFBRSxNQUFNLFFBQUE7QUFDeEIsWUFBTSxNQUFNLFVBQUE7QUFDWixZQUFNLGFBQVksbUNBQVMsZUFBYyxTQUFTLG9CQUFvQixNQUFRO0FBRzlFLFVBQUksU0FBTyxTQUFJLFlBQUosbUJBQWEsY0FBYTtBQUNuQyxlQUFPLElBQUksUUFBUSxDQUFDLFlBQVk7O0FBQzlCLGNBQUksVUFBVTtBQUNkLGdCQUFNLFFBQVEsV0FBVyxNQUFNO0FBQzdCLGdCQUFJLENBQUMsU0FBUztBQUNaLHdCQUFVO0FBQ1Ysc0JBQVE7QUFBQSxnQkFDTixJQUFJO0FBQUEsZ0JBQ0osT0FBTyxXQUFXLFdBQVcsT0FBTyxZQUFZLElBQUkscUJBQXFCLFNBQVMsSUFBSTtBQUFBLGNBQUEsQ0FDdkY7QUFBQSxZQUNIO0FBQUEsVUFDRixHQUFHLFNBQVM7QUFFWixjQUFJO0FBQ0Ysa0JBQU0sV0FBVyxDQUFDLFFBQTREO0FBQzVFLGtCQUFJLFFBQVM7QUFDYix3QkFBVTtBQUNWLDJCQUFhLEtBQUs7QUFFbEIsa0JBQUksSUFBSSxRQUFRLFdBQVc7QUFDekIsd0JBQVE7QUFBQSxrQkFDTixJQUFJO0FBQUEsa0JBQ0osT0FBTztBQUFBLG9CQUNMO0FBQUEsb0JBQ0E7QUFBQSxvQkFDQSxJQUFJLFFBQVEsVUFBVSxXQUFXO0FBQUEsa0JBQUE7QUFBQSxnQkFDbkMsQ0FDRDtBQUNEO0FBQUEsY0FDRjtBQUNBLGtCQUFJLENBQUMsS0FBSztBQUNSLHdCQUFRO0FBQUEsa0JBQ04sSUFBSTtBQUFBLGtCQUNKLE9BQU8sV0FBVyxZQUFZLE9BQU8seUNBQXlDLElBQUksR0FBRztBQUFBLGdCQUFBLENBQ3RGO0FBQ0Q7QUFBQSxjQUNGO0FBQ0Esc0JBQVEsR0FBRztBQUFBLFlBQ2I7QUFFQSxpQkFBSSxtQ0FBUyxVQUFTLFFBQVEsUUFBUSxPQUFLUyxNQUFBLElBQUksU0FBSixnQkFBQUEsSUFBVSxjQUFhO0FBQ2hFLGtCQUFJLFFBQVEsWUFBWSxRQUFXO0FBQ2pDLG9CQUFJLEtBQUssWUFBWSxRQUFRLE9BQU8sU0FBUyxFQUFFLFNBQVMsUUFBUSxRQUFBLEdBQVcsUUFBUTtBQUFBLGNBQ3JGLE9BQU87QUFDTCxvQkFBSSxLQUFLLFlBQVksUUFBUSxPQUFPLFNBQVMsUUFBUTtBQUFBLGNBQ3ZEO0FBQUEsWUFDRixPQUFPO0FBQ0wsa0JBQUksUUFBUSxZQUFZLFNBQVMsUUFBUTtBQUFBLFlBQzNDO0FBQUEsVUFDRixTQUFTLEtBQUs7QUFDWixnQkFBSSxDQUFDLFNBQVM7QUFDWix3QkFBVTtBQUNWLDJCQUFhLEtBQUs7QUFDbEIsc0JBQVE7QUFBQSxnQkFDTixJQUFJO0FBQUEsZ0JBQ0osT0FBTyxXQUFXLFlBQVksT0FBTyxlQUFlLFFBQVEsSUFBSSxVQUFVLE9BQU8sR0FBRyxDQUFDO0FBQUEsY0FBQSxDQUN0RjtBQUFBLFlBQ0g7QUFBQSxVQUNGO0FBQUEsUUFDRixDQUFDO0FBQUEsTUFDSDtBQUdBLFlBQU0sV0FBVyxjQUFjLElBQUksSUFBSTtBQUN2QyxVQUFJLENBQUMsWUFBWSxTQUFTLFdBQVcsR0FBRztBQUN0QyxlQUFPO0FBQUEsVUFDTCxJQUFJO0FBQUEsVUFDSixPQUFPLFdBQVcsWUFBWSxPQUFPLG9DQUFvQyxJQUFJLEdBQUc7QUFBQSxRQUFBO0FBQUEsTUFFcEY7QUFFQSxVQUFJO0FBQ0YsY0FBTSxPQUFPLE1BQU0sU0FBUyxDQUFDLEVBQUcsT0FBTztBQUN2QyxlQUFPLEVBQUUsSUFBSSxNQUFNLEtBQUE7QUFBQSxNQUNyQixTQUFTLEtBQVU7QUFDakIsZUFBTztBQUFBLFVBQ0wsSUFBSTtBQUFBLFVBQ0osT0FBTyxJQUFJLFFBQVEsSUFBSSxRQUFRLE1BQU0sV0FBVyxZQUFZLE9BQU8sSUFBSSxXQUFXLE9BQU8sR0FBRyxDQUFDO0FBQUEsUUFBQTtBQUFBLE1BRWpHO0FBQUEsSUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0EsR0FBMEIsTUFBUyxTQUFpQzs7QUFDbEUsWUFBTSxNQUFNLFVBQUE7QUFDWixVQUFJLFNBQU8sU0FBSSxZQUFKLG1CQUFhLFlBQVc7QUFDakMsb0NBQTRCLEdBQUc7QUFFL0IsY0FBTUMsUUFBTyxlQUFlLElBQUksSUFBSSxLQUFLLENBQUE7QUFDekNBLGNBQUssS0FBSyxPQUFPO0FBQ2pCLHVCQUFlLElBQUksTUFBTUEsS0FBSTtBQUU3QixlQUFPLE1BQU07QUFDWCxnQkFBTSxXQUFXLGVBQWUsSUFBSSxJQUFJLEtBQUssQ0FBQTtBQUM3QyxnQkFBTSxXQUFXLFNBQVMsT0FBTyxDQUFDLE1BQU0sTUFBTSxPQUFPO0FBQ3JELGNBQUksU0FBUyxTQUFTLEdBQUc7QUFDdkIsMkJBQWUsSUFBSSxNQUFNLFFBQVE7QUFBQSxVQUNuQyxPQUFPO0FBQ0wsMkJBQWUsT0FBTyxJQUFJO0FBQUEsVUFDNUI7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUdBLFlBQU0sT0FBTyxjQUFjLElBQUksSUFBSSxLQUFLLENBQUE7QUFDeEMsV0FBSyxLQUFLLE9BQU87QUFDakIsb0JBQWMsSUFBSSxNQUFNLElBQUk7QUFFNUIsYUFBTyxNQUFNO0FBQ1gsY0FBTSxXQUFXLGNBQWMsSUFBSSxJQUFJLEtBQUssQ0FBQTtBQUM1QyxjQUFNLFdBQVcsU0FBUyxPQUFPLENBQUMsTUFBTSxNQUFNLE9BQU87QUFDckQsWUFBSSxTQUFTLFNBQVMsR0FBRztBQUN2Qix3QkFBYyxJQUFJLE1BQU0sUUFBUTtBQUFBLFFBQ2xDLE9BQU87QUFDTCx3QkFBYyxPQUFPLElBQUk7QUFBQSxRQUMzQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLQSxzQkFBc0I7QUFDcEIsb0JBQWMsTUFBQTtBQUNkLHFCQUFlLE1BQUE7QUFBQSxJQUNqQjtBQUFBLEVBQ0Y7OztBQ3ZNTyxXQUFTLGlCQUFpQixJQUFzQjtBQUNyRCxRQUFJLE9BQVEsR0FBVyxvQkFBb0IsWUFBWTtBQUNyRCxVQUNFLENBQUUsR0FBVyxnQkFBZ0I7QUFBQSxRQUMzQixjQUFjO0FBQUEsUUFDZCxvQkFBb0I7QUFBQSxNQUFBLENBQ3JCLEdBQ0Q7QUFDQSxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFFQSxVQUFNLE9BQU8sR0FBRyxzQkFBQTtBQUNoQixRQUFJLEtBQUssVUFBVSxLQUFLLEtBQUssV0FBVyxHQUFHO0FBQ3pDLGFBQU87QUFBQSxJQUNUO0FBRUEsUUFBSSxPQUFPLFdBQVcsYUFBYTtBQUNqQyxZQUFNLFFBQVEsT0FBTyxpQkFBaUIsRUFBRTtBQUN4QyxVQUNFLE1BQU0sWUFBWSxVQUNsQixNQUFNLGVBQWUsWUFDckIsTUFBTSxlQUFlLGNBQ3JCLFdBQVcsTUFBTSxXQUFXLEdBQUcsSUFBSSxNQUNuQztBQUNBLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUVBLFdBQU87QUFBQSxFQUNUO0FBV08sV0FBUyxrQkFBa0IsSUFBYSxJQUFZLElBQXFCO0FBQzlFLFFBQUksT0FBTyxhQUFhLGVBQWUsT0FBTyxTQUFTLHNCQUFzQixZQUFZO0FBQ3ZGLGFBQU87QUFBQSxJQUNUO0FBQ0EsVUFBTSxjQUFjLFNBQVMsa0JBQWtCLElBQUksRUFBRTtBQUNyRCxRQUFJLFlBQVksV0FBVyxFQUFHLFFBQU87QUFFckMsVUFBTSxNQUFNLFlBQVksQ0FBQztBQUN6QixRQUFJLENBQUMsSUFBSyxRQUFPO0FBR2pCLFdBQU8sUUFBUSxNQUFNLENBQUMsR0FBRyxTQUFTLEdBQUc7QUFBQSxFQUN2Qzs7QUMxQ08sV0FBUyxvQkFBb0IsSUFJbEM7QUFDQSxVQUFNLE1BQU0sR0FBRyxRQUFRLFlBQUE7QUFFdkIsUUFBSSxZQUEyQjtBQUMvQixRQUFJLFFBQVEsU0FBVSxhQUFZO0FBQUEsYUFDekIsUUFBUSxTQUFTLFFBQVEsT0FBUSxhQUFZO0FBQUEsYUFDN0MsUUFBUSxNQUFPLGFBQVk7QUFBQSxhQUMzQixRQUFRLFFBQVMsYUFBWTtBQUFBLGFBQzdCLFFBQVEsU0FBVSxhQUFZO0FBQUEsYUFDOUIsR0FBRyxXQUFZLGFBQVk7QUFFcEMsUUFBSSxlQUFlO0FBQ25CLFFBQUksZ0JBQWdCO0FBRXBCLFFBQUksT0FBTyxXQUFXLGFBQWE7QUFDakMsWUFBTSxRQUFRLE9BQU8saUJBQWlCLEVBQUU7QUFDeEMsVUFBSSxNQUFNLG1CQUFtQixNQUFNLG9CQUFvQixRQUFRO0FBQzdELHVCQUFlO0FBQUEsTUFDakI7QUFDQSxVQUFJLE1BQU0sV0FBVyxXQUFXO0FBQzlCLHdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUVBLFFBQ0csR0FBVyxXQUNaLEdBQUcsYUFBYSxTQUFTLEtBQ3pCLEdBQUcsYUFBYSxNQUFNLE1BQU0sVUFDNUI7QUFDQSxzQkFBZ0I7QUFBQSxJQUNsQjtBQUVBLFdBQU8sRUFBRSxXQUFXLGNBQWMsY0FBQTtBQUFBLEVBQ3BDOztBQ2hETyxXQUFTLGdCQUFnQixJQUE0QjtBQUUxRCxVQUFNLGVBQWUsR0FBRyxhQUFhLE1BQU07QUFDM0MsUUFBSSxjQUFjO0FBQ2hCLGFBQU8sYUFBYSxPQUFPLE1BQU0sS0FBSyxFQUFFLENBQUMsS0FBSztBQUFBLElBQ2hEO0FBR0EsVUFBTSxNQUFNLEdBQUcsUUFBUSxZQUFBO0FBQ3ZCLFlBQVEsS0FBQTtBQUFBLE1BQ04sS0FBSztBQUNILGVBQU8sR0FBRyxhQUFhLE1BQU0sSUFBSSxTQUFTO0FBQUEsTUFDNUMsS0FBSztBQUNILGVBQU87QUFBQSxNQUNULEtBQUssU0FBUztBQUNaLGNBQU0sUUFBUSxHQUFHLGFBQWEsTUFBTSxLQUFLLFFBQVEsWUFBQTtBQUNqRCxZQUFJLFNBQVMsWUFBWSxTQUFTLFlBQVksU0FBUyxRQUFTLFFBQU87QUFDdkUsWUFBSSxTQUFTLFdBQVksUUFBTztBQUNoQyxZQUFJLFNBQVMsUUFBUyxRQUFPO0FBQzdCLFlBQUksU0FBUyxRQUFTLFFBQU87QUFDN0IsWUFBSSxTQUFTLFNBQVUsUUFBTztBQUM5QixlQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsS0FBSztBQUNILGVBQU87QUFBQSxNQUNULEtBQUs7QUFDSCxlQUFPO0FBQUEsTUFDVCxLQUFLO0FBQUEsTUFDTCxLQUFLO0FBQUEsTUFDTCxLQUFLO0FBQUEsTUFDTCxLQUFLO0FBQUEsTUFDTCxLQUFLO0FBQUEsTUFDTCxLQUFLO0FBQ0gsZUFBTztBQUFBLE1BQ1QsS0FBSztBQUNILGVBQU87QUFBQSxNQUNULEtBQUs7QUFDSCxlQUFPO0FBQUEsTUFDVCxLQUFLO0FBQ0gsZUFBTztBQUFBLE1BQ1Q7QUFDRSxlQUFPO0FBQUEsSUFBQTtBQUFBLEVBRWI7QUFFTyxXQUFTLGtCQUFrQixJQU9oQztBQUNBLFVBQU0sT0FPRixDQUFBO0FBRUosUUFBSSxHQUFHLGFBQWEsZUFBZSxHQUFHO0FBQ3BDLFdBQUssV0FBVyxHQUFHLGFBQWEsZUFBZSxNQUFNO0FBQUEsSUFDdkQ7QUFDQSxRQUFJLEdBQUcsYUFBYSxjQUFjLEdBQUc7QUFDbkMsWUFBTSxNQUFNLEdBQUcsYUFBYSxjQUFjO0FBQzFDLFdBQUssVUFBVSxRQUFRLFVBQVUsVUFBVSxRQUFRO0FBQUEsSUFDckQ7QUFDQSxRQUFJLEdBQUcsYUFBYSxlQUFlLEtBQU0sR0FBVyxVQUFVO0FBQzVELFdBQUssV0FBVyxHQUFHLGFBQWEsZUFBZSxNQUFNLFVBQVcsR0FBVyxhQUFhO0FBQUEsSUFDMUY7QUFDQSxRQUFJLEdBQUcsYUFBYSxlQUFlLEdBQUc7QUFDcEMsV0FBSyxXQUFXLEdBQUcsYUFBYSxlQUFlLE1BQU07QUFBQSxJQUN2RDtBQUNBLFFBQUksR0FBRyxhQUFhLGNBQWMsR0FBRztBQUNuQyxXQUFLLFVBQVUsR0FBRyxhQUFhLGNBQWMsTUFBTTtBQUFBLElBQ3JEO0FBQ0EsUUFBSSxHQUFHLGFBQWEsYUFBYSxHQUFHO0FBQ2xDLFdBQUssU0FBUyxHQUFHLGFBQWEsYUFBYSxNQUFNO0FBQUEsSUFDbkQ7QUFFQSxXQUFPO0FBQUEsRUFDVDs7QUMvRUEsTUFBSSxRQUFRLE9BQU8sVUFBVTtBQUM3QixXQUFTLFdBQVcsSUFBSTtBQUN0QixXQUFPLE9BQU8sT0FBTyxjQUFjLE1BQU0sS0FBSyxFQUFFLE1BQU07QUFBQSxFQUN4RDtBQUNBLFdBQVMsVUFBVSxPQUFPO0FBQ3hCLFFBQUksU0FBUyxPQUFPLEtBQUs7QUFDekIsUUFBSSxNQUFNLE1BQU0sR0FBRztBQUNqQixhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksV0FBVyxLQUFLLENBQUMsU0FBUyxNQUFNLEdBQUc7QUFDckMsYUFBTztBQUFBLElBQ1Q7QUFDQSxZQUFRLFNBQVMsSUFBSSxJQUFJLE1BQU0sS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLENBQUM7QUFBQSxFQUM1RDtBQUNBLE1BQUksaUJBQWlCLEtBQUssSUFBSSxHQUFHLEVBQUUsSUFBSTtBQUN2QyxXQUFTLFNBQVMsT0FBTztBQUN2QixRQUFJLE1BQU0sVUFBVSxLQUFLO0FBQ3pCLFdBQU8sS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsR0FBRyxjQUFjO0FBQUEsRUFDbEQ7QUFZZSxXQUFTLFVBQVUsV0FBVyxPQUFPO0FBR2xELFFBQUksSUFBSTtBQUdSLFFBQUksUUFBUSxPQUFPLFNBQVM7QUFHNUIsUUFBSSxhQUFhLE1BQU07QUFDckIsWUFBTSxJQUFJLFVBQVUsa0VBQWtFO0FBQUEsSUFDeEY7QUFlQSxRQUFJLE1BQU0sU0FBUyxNQUFNLE1BQU07QUFNL0IsUUFBSSxJQUFJLFdBQVcsQ0FBQyxJQUFJLE9BQU8sSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLElBQUksTUFBTSxHQUFHO0FBRzFELFFBQUksSUFBSTtBQUVSLFFBQUk7QUFDSixXQUFPLElBQUksS0FBSztBQUNkLGVBQVMsTUFBTSxDQUFDO0FBR1Q7QUFDTCxVQUFFLENBQUMsSUFBSTtBQUFBLE1BQ1Q7QUFDQSxXQUFLO0FBQUEsSUFDUDtBQUVBLE1BQUUsU0FBUztBQUVYLFdBQU87QUFBQSxFQUNUO0FDckZBLFdBQVMsUUFBUSxHQUFHO0FBQUU7QUFBMkIsV0FBTyxVQUFVLGNBQWMsT0FBTyxVQUFVLFlBQVksT0FBTyxPQUFPLFdBQVcsU0FBVUMsSUFBRztBQUFFLGFBQU8sT0FBT0E7QUFBQSxJQUFHLElBQUksU0FBVUEsSUFBRztBQUFFLGFBQU9BLE1BQUssY0FBYyxPQUFPLFVBQVVBLEdBQUUsZ0JBQWdCLFVBQVVBLE9BQU0sT0FBTyxZQUFZLFdBQVcsT0FBT0E7QUFBQSxJQUFHLEdBQUcsUUFBUSxDQUFDO0FBQUEsRUFBRztBQUM3VCxXQUFTLGdCQUFnQixVQUFVLGFBQWE7QUFBRSxRQUFJLEVBQUUsb0JBQW9CLGNBQWM7QUFBRSxZQUFNLElBQUksVUFBVSxtQ0FBbUM7QUFBQSxJQUFHO0FBQUEsRUFBRTtBQUN4SixXQUFTLGtCQUFrQixRQUFRLE9BQU87QUFBRSxhQUFTLElBQUksR0FBRyxJQUFJLE1BQU0sUUFBUSxLQUFLO0FBQUUsVUFBSSxhQUFhLE1BQU0sQ0FBQztBQUFHLGlCQUFXLGFBQWEsV0FBVyxjQUFjO0FBQU8saUJBQVcsZUFBZTtBQUFNLFVBQUksV0FBVyxXQUFZLFlBQVcsV0FBVztBQUFNLGFBQU8sZUFBZSxRQUFRLGVBQWUsV0FBVyxHQUFHLEdBQUcsVUFBVTtBQUFBLElBQUc7QUFBQSxFQUFFO0FBQzVVLFdBQVMsYUFBYSxhQUFhLFlBQVksYUFBYTtBQUFFLFFBQUksV0FBWSxtQkFBa0IsWUFBWSxXQUFXLFVBQVU7QUFBaUUsV0FBTyxlQUFlLGFBQWEsYUFBYSxFQUFFLFVBQVUsT0FBTztBQUFHLFdBQU87QUFBQSxFQUFhO0FBQzVSLFdBQVMsZ0JBQWdCLEtBQUssS0FBSyxPQUFPO0FBQUUsVUFBTSxlQUFlLEdBQUc7QUFBRyxRQUFJLE9BQU8sS0FBSztBQUFFLGFBQU8sZUFBZSxLQUFLLEtBQUssRUFBRSxPQUFjLFlBQVksTUFBTSxjQUFjLE1BQU0sVUFBVSxLQUFJLENBQUU7QUFBQSxJQUFHLE9BQU87QUFBRSxVQUFJLEdBQUcsSUFBSTtBQUFBLElBQU87QUFBRSxXQUFPO0FBQUEsRUFBSztBQUMzTyxXQUFTLGVBQWUsR0FBRztBQUFFLFFBQUksSUFBSSxhQUFhLEdBQUcsUUFBUTtBQUFHLFdBQU8sWUFBWSxRQUFRLENBQUMsSUFBSSxJQUFJLElBQUk7QUFBQSxFQUFJO0FBQzVHLFdBQVMsYUFBYSxHQUFHLEdBQUc7QUFBRSxRQUFJLFlBQVksUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFHLFFBQU87QUFBRyxRQUFJLElBQUksRUFBRSxPQUFPLFdBQVc7QUFBRyxRQUFJLFdBQVcsR0FBRztBQUFFLFVBQUksSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFjO0FBQUcsVUFBSSxZQUFZLFFBQVEsQ0FBQyxFQUFHLFFBQU87QUFBRyxZQUFNLElBQUksVUFBVSw4Q0FBOEM7QUFBQSxJQUFHO0FBQUUsV0FBeUIsT0FBaUIsQ0FBQztBQUFBLEVBQUc7QUFFM1QsTUFBSSxVQUF1Qiw0QkFBWTtBQUNyQyxhQUFTQyxXQUFVO0FBQ2pCLFVBQUksUUFBUSxVQUFVLFNBQVMsS0FBSyxVQUFVLENBQUMsTUFBTSxTQUFZLFVBQVUsQ0FBQyxJQUFJLENBQUE7QUFDaEYsc0JBQWdCLE1BQU1BLFFBQU87QUFDN0Isc0JBQWdCLE1BQU0sU0FBUyxNQUFNO0FBQ3JDLFdBQUssUUFBUTtBQUFBLElBQ2Y7QUFDQSxXQUFPLGFBQWFBLFVBQVMsQ0FBQztBQUFBLE1BQzVCLEtBQUs7QUFBQSxNQUNMLE9BQU8sU0FBUyxJQUFJLE9BQU87QUFDekIsWUFBSSxLQUFLLElBQUksS0FBSyxNQUFNLE9BQU87QUFDN0IsZUFBSyxNQUFNLEtBQUssS0FBSztBQUFBLFFBQ3ZCO0FBQ0EsZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUNKLEdBQUs7QUFBQSxNQUNELEtBQUs7QUFBQSxNQUNMLE9BQU8sU0FBUyxRQUFRO0FBQ3RCLGFBQUssUUFBUSxDQUFBO0FBQUEsTUFDZjtBQUFBLElBQ0osR0FBSztBQUFBLE1BQ0QsS0FBSztBQUFBLE1BQ0wsT0FBTyxTQUFTLFFBQVEsT0FBTztBQUM3QixZQUFJLGlCQUFpQixLQUFLLE1BQU07QUFDaEMsYUFBSyxRQUFRLEtBQUssTUFBTSxPQUFPLFNBQVUsTUFBTTtBQUM3QyxpQkFBTyxTQUFTO0FBQUEsUUFDbEIsQ0FBQztBQUNELGVBQU8sbUJBQW1CLEtBQUssTUFBTTtBQUFBLE1BQ3ZDO0FBQUEsSUFDSixHQUFLO0FBQUEsTUFDRCxLQUFLO0FBQUEsTUFDTCxPQUFPLFNBQVMsUUFBUSxZQUFZO0FBQ2xDLFlBQUksUUFBUTtBQUNaLGFBQUssTUFBTSxRQUFRLFNBQVUsTUFBTTtBQUNqQyxxQkFBVyxNQUFNLE1BQU0sS0FBSztBQUFBLFFBQzlCLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDSixHQUFLO0FBQUEsTUFDRCxLQUFLO0FBQUEsTUFDTCxPQUFPLFNBQVMsSUFBSSxPQUFPO0FBQ3pCLGVBQU8sS0FBSyxNQUFNLFFBQVEsS0FBSyxNQUFNO0FBQUEsTUFDdkM7QUFBQSxJQUNKLEdBQUs7QUFBQSxNQUNELEtBQUs7QUFBQSxNQUNMLEtBQUssU0FBUyxNQUFNO0FBQ2xCLGVBQU8sS0FBSyxNQUFNO0FBQUEsTUFDcEI7QUFBQSxJQUNKLENBQUcsQ0FBQztBQUFBLEVBQ0osR0FBQztBQUNELFFBQUEsWUFBZSxPQUFPLFFBQVEsY0FBYyxNQUFNO0FDakQzQyxXQUFTLGFBQWEsU0FBUztBQUNwQyxRQUFJO0FBQ0o7QUFBQTtBQUFBLE9BQ0cscUJBQXFCLFFBQVEsZUFBZSxRQUFRLHVCQUF1QixTQUFTO0FBQUE7QUFBQSxRQUVyRixRQUFRLFFBQVEsWUFBVztBQUFBO0FBQUE7QUFBQSxFQUUvQjtBQUNBLE1BQUksMEJBQTBCO0FBQUEsSUFDNUIsU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBLElBQ1AsUUFBUTtBQUFBLElBQ1IsVUFBVTtBQUFBLElBQ1YsSUFBSTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsUUFBUTtBQUFBLElBQ1IsSUFBSTtBQUFBLElBQ0osVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBO0FBQUEsSUFFUixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixRQUFRO0FBQUEsSUFDUixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsSUFDUixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsSUFDTCxJQUFJO0FBQUEsSUFDSixVQUFVO0FBQUE7QUFBQSxJQUVWLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLFVBQVU7QUFBQTtBQUFBLElBRVYsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLElBQ1QsT0FBTztBQUFBLElBQ1AsT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsT0FBTztBQUFBO0FBQUEsSUFFUCxJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsRUFDTjtBQUNBLE1BQUksdUJBQXVCO0FBQUEsSUFDekIsU0FBUyxvQkFBSSxJQUFJLENBQUMsY0FBYyxpQkFBaUIsQ0FBQztBQUFBLElBQ2xELE1BQU0sb0JBQUksSUFBSSxDQUFDLGNBQWMsaUJBQWlCLENBQUM7QUFBQSxJQUMvQyxVQUFVLG9CQUFJLElBQUksQ0FBQyxjQUFjLGlCQUFpQixDQUFDO0FBQUEsSUFDbkQsVUFBVSxvQkFBSSxJQUFJLENBQUMsY0FBYyxpQkFBaUIsQ0FBQztBQUFBLElBQ25ELFNBQVMsb0JBQUksSUFBSSxDQUFDLGNBQWMsbUJBQW1CLHNCQUFzQixDQUFDO0FBQUEsSUFDMUUsV0FBVyxvQkFBSSxJQUFJLENBQUMsY0FBYyxpQkFBaUIsQ0FBQztBQUFBLElBQ3BELE1BQU0sb0JBQUksSUFBSSxDQUFDLGNBQWMsaUJBQWlCLENBQUM7QUFBQSxJQUMvQyxXQUFXLG9CQUFJLElBQUksQ0FBQyxjQUFjLGlCQUFpQixDQUFDO0FBQUEsSUFDcEQsY0FBYyxvQkFBSSxJQUFJLENBQUMsY0FBYyxpQkFBaUIsQ0FBQztBQUFBLElBQ3ZELFFBQVEsb0JBQUksSUFBSSxDQUFDLGNBQWMsaUJBQWlCLENBQUM7QUFBQSxJQUNqRCxXQUFXLG9CQUFJLElBQUksQ0FBQyxjQUFjLGlCQUFpQixDQUFDO0FBQUEsSUFDcEQsYUFBYSxvQkFBSSxJQUFJLENBQUMsY0FBYyxpQkFBaUIsQ0FBQztBQUFBLEVBQ3hEO0FBT0EsV0FBUyx3QkFBd0IsU0FBUyxNQUFNO0FBRzlDLFdBQU87QUFBQSxNQUFDO0FBQUEsTUFBZTtBQUFBLE1BQWE7QUFBQSxNQUFpQjtBQUFBLE1BQWdCO0FBQUEsTUFBb0I7QUFBQSxNQUFvQjtBQUFBO0FBQUEsTUFFN0c7QUFBQTtBQUFBLE1BRUE7QUFBQSxNQUFlO0FBQUE7QUFBQSxNQUVmO0FBQUE7QUFBQSxNQUVBO0FBQUEsTUFBcUI7QUFBQSxNQUFjO0FBQUEsTUFBbUI7QUFBQSxNQUFhO0FBQUEsTUFBYTtBQUFBLE1BQWlCO0FBQUEsSUFBc0IsRUFBRSxLQUFLLFNBQVUsZUFBZTtBQUNySixVQUFJO0FBQ0osYUFBTyxRQUFRLGFBQWEsYUFBYSxLQUFLLEdBQUcsd0JBQXdCLHFCQUFxQixJQUFJLE9BQU8sUUFBUSwwQkFBMEIsVUFBVSxzQkFBc0IsSUFBSSxhQUFhO0FBQUEsSUFDOUwsQ0FBQztBQUFBLEVBQ0g7QUFDQSxXQUFTLHlCQUF5QixTQUFTLGNBQWM7QUFFdkQsV0FBTyx3QkFBd0IsU0FBUyxZQUFZO0FBQUEsRUFDdEQ7QUFDZSxXQUFTLFFBQVEsU0FBUztBQUN2QyxRQUFJLGVBQWUsZ0JBQWdCLE9BQU87QUFDMUMsUUFBSSxpQkFBaUIsUUFBUSxrQkFBa0IsUUFBUSxZQUFZLE1BQU0sSUFBSTtBQUMzRSxVQUFJLGVBQWUsZ0JBQWdCLE9BQU87QUFDMUMsVUFBSSxrQkFBa0IsUUFBUSxnQkFBZ0IsRUFBRSxNQUFNLE1BQU0seUJBQXlCLFNBQVMsZ0JBQWdCLEVBQUUsR0FBRztBQUNqSCxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUNBLFdBQVMsZ0JBQWdCLFNBQVM7QUFDaEMsUUFBSSxjQUFjLHdCQUF3QixhQUFhLE9BQU8sQ0FBQztBQUMvRCxRQUFJLGdCQUFnQixRQUFXO0FBQzdCLGFBQU87QUFBQSxJQUNUO0FBQ0EsWUFBUSxhQUFhLE9BQU8sR0FBQztBQUFBLE1BQzNCLEtBQUs7QUFBQSxNQUNMLEtBQUs7QUFBQSxNQUNMLEtBQUs7QUFDSCxZQUFJLFFBQVEsYUFBYSxNQUFNLEdBQUc7QUFDaEMsaUJBQU87QUFBQSxRQUNUO0FBQ0E7QUFBQSxNQUNGLEtBQUs7QUFDSCxZQUFJLFFBQVEsYUFBYSxLQUFLLE1BQU0sTUFBTSxDQUFDLHlCQUF5QixTQUFTLEtBQUssR0FBRztBQUNuRixpQkFBTztBQUFBLFFBQ1Q7QUFDQSxlQUFPO0FBQUEsTUFDVCxLQUFLLFNBQ0g7QUFDRSxZQUFJLE9BQU8sU0FDVCxPQUFPLEtBQUs7QUFDZCxnQkFBUSxNQUFJO0FBQUEsVUFDVixLQUFLO0FBQUEsVUFDTCxLQUFLO0FBQUEsVUFDTCxLQUFLO0FBQUEsVUFDTCxLQUFLO0FBQ0gsbUJBQU87QUFBQSxVQUNULEtBQUs7QUFBQSxVQUNMLEtBQUs7QUFDSCxtQkFBTztBQUFBLFVBQ1QsS0FBSztBQUNILG1CQUFPO0FBQUEsVUFDVCxLQUFLO0FBQUEsVUFDTCxLQUFLO0FBQUEsVUFDTCxLQUFLO0FBQUEsVUFDTCxLQUFLO0FBQ0gsZ0JBQUksUUFBUSxhQUFhLE1BQU0sR0FBRztBQUNoQyxxQkFBTztBQUFBLFlBQ1Q7QUFDQSxtQkFBTztBQUFBLFVBQ1QsS0FBSztBQUNILGdCQUFJLFFBQVEsYUFBYSxNQUFNLEdBQUc7QUFDaEMscUJBQU87QUFBQSxZQUNUO0FBQ0EsbUJBQU87QUFBQSxVQUNULEtBQUs7QUFDSCxtQkFBTztBQUFBLFVBQ1Q7QUFDRSxtQkFBTztBQUFBLFFBQ25CO0FBQUEsTUFDTTtBQUFBLE1BQ0YsS0FBSztBQUNILFlBQUksUUFBUSxhQUFhLFVBQVUsS0FBSyxRQUFRLE9BQU8sR0FBRztBQUN4RCxpQkFBTztBQUFBLFFBQ1Q7QUFDQSxlQUFPO0FBQUEsSUFDYjtBQUNFLFdBQU87QUFBQSxFQUNUO0FBQ0EsV0FBUyxnQkFBZ0IsU0FBUztBQUNoQyxRQUFJLE9BQU8sUUFBUSxhQUFhLE1BQU07QUFDdEMsUUFBSSxTQUFTLE1BQU07QUFDakIsVUFBSSxlQUFlLEtBQUssS0FBSSxFQUFHLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFHM0MsVUFBSSxhQUFhLFNBQVMsR0FBRztBQUMzQixlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQ3hMTyxNQUFJLG9CQUFvQixDQUFDLGdCQUFnQixNQUFNO0FBQy9DLFdBQVMsVUFBVSxNQUFNO0FBQzlCLFdBQU8sU0FBUyxRQUFRLEtBQUssYUFBYSxLQUFLO0FBQUEsRUFDakQ7QUFDTyxXQUFTLDBCQUEwQixNQUFNO0FBQzlDLFdBQU8sVUFBVSxJQUFJLEtBQUssYUFBYSxJQUFJLE1BQU07QUFBQSxFQUNuRDtBQUNPLFdBQVMsbUJBQW1CLE1BQU07QUFDdkMsV0FBTyxVQUFVLElBQUksS0FBSyxhQUFhLElBQUksTUFBTTtBQUFBLEVBQ25EO0FBQ08sV0FBUyxzQkFBc0IsTUFBTTtBQUMxQyxXQUFPLFVBQVUsSUFBSSxLQUFLLGFBQWEsSUFBSSxNQUFNO0FBQUEsRUFDbkQ7QUFDTyxXQUFTLG9CQUFvQixNQUFNO0FBQ3hDLFdBQU8sVUFBVSxJQUFJLEtBQUssYUFBYSxJQUFJLE1BQU07QUFBQSxFQUNuRDtBQUNPLFdBQVMsbUJBQW1CLE1BQU07QUFDdkMsV0FBTyxVQUFVLElBQUksS0FBSyxhQUFhLElBQUksTUFBTTtBQUFBLEVBQ25EO0FBQ08sV0FBUyxzQkFBc0IsTUFBTTtBQUMxQyxXQUFPLFVBQVUsSUFBSSxLQUFLLGFBQWEsSUFBSSxNQUFNO0FBQUEsRUFDbkQ7QUFDTyxXQUFTLFdBQVcsTUFBTTtBQUMvQixRQUFJLE9BQU8sS0FBSyxrQkFBa0IsT0FBTyxPQUFPLEtBQUssZUFDbkQsY0FBYyxLQUFLO0FBQ3JCLFFBQUksZ0JBQWdCLE1BQU07QUFDeEIsWUFBTSxJQUFJLFVBQVUscUJBQXFCO0FBQUEsSUFDM0M7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUNPLFdBQVMsc0JBQXNCLE1BQU07QUFDMUMsV0FBTyxVQUFVLElBQUksS0FBSyxhQUFhLElBQUksTUFBTTtBQUFBLEVBQ25EO0FBQ08sV0FBUyxvQkFBb0IsTUFBTTtBQUN4QyxXQUFPLFVBQVUsSUFBSSxLQUFLLGFBQWEsSUFBSSxNQUFNO0FBQUEsRUFDbkQ7QUFDTyxXQUFTLGtCQUFrQixNQUFNO0FBQ3RDLFdBQU8sVUFBVSxJQUFJLEtBQUssYUFBYSxJQUFJLE1BQU07QUFBQSxFQUNuRDtBQUNPLFdBQVMsYUFBYSxNQUFNO0FBQ2pDLFdBQU8sVUFBVSxJQUFJLEtBQUssS0FBSyxvQkFBb0I7QUFBQSxFQUNyRDtBQUNPLFdBQVMsZ0JBQWdCLE1BQU07QUFDcEMsV0FBTyxVQUFVLElBQUksS0FBSyxhQUFhLElBQUksTUFBTTtBQUFBLEVBQ25EO0FBQ08sV0FBUyxrQkFBa0IsTUFBTTtBQUN0QyxXQUFPLGFBQWEsSUFBSSxLQUFLLGFBQWEsSUFBSSxNQUFNO0FBQUEsRUFDdEQ7QUFRTyxXQUFTLFlBQVksTUFBTSxlQUFlO0FBQy9DLFFBQUksVUFBVSxJQUFJLEtBQUssS0FBSyxhQUFhLGFBQWEsR0FBRztBQUV2RCxVQUFJLE1BQU0sS0FBSyxhQUFhLGFBQWEsRUFBRSxNQUFNLEdBQUc7QUFHcEQsVUFBSSxPQUFPLEtBQUssY0FBYyxLQUFLLFlBQVcsSUFBSyxLQUFLO0FBQ3hELGFBQU8sSUFBSSxJQUFJLFNBQVUsSUFBSTtBQUMzQixlQUFPLEtBQUssZUFBZSxFQUFFO0FBQUEsTUFDL0IsQ0FBQyxFQUFFO0FBQUEsUUFBTyxTQUFVLFNBQVM7QUFDM0IsaUJBQU8sWUFBWTtBQUFBLFFBQ3JCO0FBQUE7QUFBQSxNQUVKO0FBQUEsSUFDRTtBQUNBLFdBQU8sQ0FBQTtBQUFBLEVBQ1Q7QUFDTyxXQUFTLG9CQUFvQixNQUFNLE9BQU87QUFDL0MsUUFBSSxVQUFVLElBQUksR0FBRztBQUNuQixhQUFPLE1BQU0sUUFBUSxRQUFRLElBQUksQ0FBQyxNQUFNO0FBQUEsSUFDMUM7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQzNEQSxXQUFTLGFBQWEsR0FBRztBQUN2QixXQUFPLEVBQUUsS0FBSSxFQUFHLFFBQVEsVUFBVSxHQUFHO0FBQUEsRUFDdkM7QUFRQSxXQUFTLFNBQVMsTUFBTSxnQ0FBZ0M7QUFDdEQsUUFBSSxDQUFDLFVBQVUsSUFBSSxHQUFHO0FBQ3BCLGFBQU87QUFBQSxJQUNUO0FBQ0EsUUFBSSxLQUFLLGFBQWEsUUFBUSxLQUFLLEtBQUssYUFBYSxhQUFhLE1BQU0sUUFBUTtBQUM5RSxhQUFPO0FBQUEsSUFDVDtBQUNBLFFBQUksUUFBUSwrQkFBK0IsSUFBSTtBQUMvQyxXQUFPLE1BQU0saUJBQWlCLFNBQVMsTUFBTSxVQUFVLE1BQU0saUJBQWlCLFlBQVksTUFBTTtBQUFBLEVBQ2xHO0FBTUEsV0FBUyxVQUFVLE1BQU07QUFDdkIsV0FBTyxvQkFBb0IsTUFBTSxDQUFDLFVBQVUsWUFBWSxXQUFXLFNBQVMsQ0FBQyxLQUFLLGdCQUFnQixNQUFNLE9BQU87QUFBQSxFQUNqSDtBQUNBLFdBQVMsZ0JBQWdCLE1BQU0sTUFBTTtBQUNuQyxRQUFJLENBQUMsVUFBVSxJQUFJLEdBQUc7QUFDcEIsYUFBTztBQUFBLElBQ1Q7QUFDQSxZQUFRLE1BQUk7QUFBQSxNQUNWLEtBQUs7QUFDSCxlQUFPLG9CQUFvQixNQUFNLENBQUMsU0FBUyxlQUFlLGFBQWEsVUFBVSxZQUFZLENBQUM7QUFBQSxNQUNoRztBQUNFLGNBQU0sSUFBSSxVQUFVLHFDQUFxQyxPQUFPLE1BQU0sNEJBQTRCLENBQUM7QUFBQSxJQUN6RztBQUFBLEVBQ0E7QUFPQSxXQUFTLHdCQUF3QixTQUFTLFdBQVc7QUFDbkQsUUFBSSxXQUFXQyxVQUFVLFFBQVEsaUJBQWlCLFNBQVMsQ0FBQztBQUM1RCxnQkFBWSxTQUFTLFdBQVcsRUFBRSxRQUFRLFNBQVUsTUFBTTtBQUV4RCxlQUFTLEtBQUssTUFBTSxVQUFVQSxVQUFVLEtBQUssaUJBQWlCLFNBQVMsQ0FBQyxDQUFDO0FBQUEsSUFDM0UsQ0FBQztBQUNELFdBQU87QUFBQSxFQUNUO0FBQ0EsV0FBUyxxQkFBcUIsU0FBUztBQUNyQyxRQUFJLG9CQUFvQixPQUFPLEdBQUc7QUFFaEMsYUFBTyxRQUFRLG1CQUFtQix3QkFBd0IsU0FBUyxZQUFZO0FBQUEsSUFDakY7QUFDQSxXQUFPLHdCQUF3QixTQUFTLHdCQUF3QjtBQUFBLEVBQ2xFO0FBQ0EsV0FBUyx1QkFBdUIsTUFBTTtBQUNwQyxXQUFPLG9CQUFvQixNQUFNLGlCQUFpQjtBQUFBLEVBQ3BEO0FBWUEsV0FBUywyQ0FBMkMsTUFBTTtBQUN4RCxXQUFPLDBCQUEwQixJQUFJO0FBQUEsRUFDdkM7QUFLQSxXQUFTLHNCQUFzQixNQUFNO0FBQ25DLFdBQU8sb0JBQW9CLE1BQU0sQ0FBQyxVQUFVLFFBQVEsWUFBWSxnQkFBZ0IsWUFBWSxXQUFXLFNBQVMsVUFBVSxRQUFRLFlBQVksb0JBQW9CLGlCQUFpQixVQUFVLFNBQVMsT0FBTyxhQUFhLFVBQVUsT0FBTyxXQUFXLFVBQVUsQ0FBQztBQUFBLEVBQ25RO0FBS0EsV0FBUyx1REFFVCxNQUFNO0FBQ0osV0FBTztBQUFBLEVBQ1Q7QUFDQSxXQUFTLGtCQUFrQixTQUFTO0FBQ2xDLFFBQUksbUJBQW1CLE9BQU8sS0FBSyxzQkFBc0IsT0FBTyxHQUFHO0FBQ2pFLGFBQU8sUUFBUTtBQUFBLElBQ2pCO0FBRUEsV0FBTyxRQUFRLGVBQWU7QUFBQSxFQUNoQztBQUNBLFdBQVMsa0JBQWtCLGFBQWE7QUFDdEMsUUFBSUMsV0FBVSxZQUFZLGlCQUFpQixTQUFTO0FBQ3BELFFBQUksZUFBZSxLQUFLQSxRQUFPLEdBQUc7QUFDaEMsYUFBT0EsU0FBUSxNQUFNLEdBQUcsRUFBRTtBQUFBLElBQzVCO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFPQSxXQUFTLG1CQUFtQixTQUFTO0FBQ25DLFFBQUksWUFBWSxhQUFhLE9BQU87QUFDcEMsV0FBTyxjQUFjLFlBQVksY0FBYyxXQUFXLFFBQVEsYUFBYSxNQUFNLE1BQU0sWUFBWSxjQUFjLFdBQVcsY0FBYyxZQUFZLGNBQWMsY0FBYyxjQUFjLFlBQVksY0FBYztBQUFBLEVBQ2hPO0FBT0EsV0FBUyxxQkFBcUIsU0FBUztBQUNyQyxRQUFJLG1CQUFtQixPQUFPLEdBQUc7QUFDL0IsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLG1CQUFtQjtBQUN2QixZQUFRLFdBQVcsUUFBUSxTQUFVLFdBQVc7QUFDOUMsVUFBSSxxQkFBcUIsUUFBUSxVQUFVLFNBQVMsR0FBRztBQUNyRCxZQUFJLDZCQUE2QixxQkFBcUIsU0FBUztBQUMvRCxZQUFJLCtCQUErQixNQUFNO0FBQ3ZDLDZCQUFtQjtBQUFBLFFBQ3JCO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUNELFdBQU87QUFBQSxFQUNUO0FBT0EsV0FBUyxrQkFBa0IsT0FBTztBQUNoQyxRQUFJLE1BQU0sWUFBWSxRQUFXO0FBQy9CLGFBQU8sTUFBTTtBQUFBLElBQ2Y7QUFDQSxRQUFJLFVBQVUsTUFBTSxhQUFhLEtBQUs7QUFDdEMsUUFBSSxZQUFZLE1BQU07QUFDcEIsYUFBTyxNQUFNLGNBQWMsZUFBZSxPQUFPO0FBQUEsSUFDbkQ7QUFDQSxXQUFPLHFCQUFxQixLQUFLO0FBQUEsRUFDbkM7QUFPQSxXQUFTLFVBQVUsU0FBUztBQUMxQixRQUFJLGlCQUFpQixRQUFRO0FBQzdCLFFBQUksbUJBQW1CLE1BQU07QUFDM0IsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJLG1CQUFtQixRQUFXO0FBQ2hDLGFBQU9ELFVBQVUsY0FBYztBQUFBLElBQ2pDO0FBR0EsUUFBSSxDQUFDLG1CQUFtQixPQUFPLEdBQUc7QUFDaEMsYUFBTztBQUFBLElBQ1Q7QUFDQSxRQUFJRSxZQUFXLFFBQVE7QUFDdkIsV0FBT0YsVUFBVUUsVUFBUyxpQkFBaUIsT0FBTyxDQUFDLEVBQUUsT0FBTyxTQUFVLE9BQU87QUFDM0UsYUFBTyxrQkFBa0IsS0FBSyxNQUFNO0FBQUEsSUFDdEMsQ0FBQztBQUFBLEVBQ0g7QUFNQSxXQUFTLGdCQUFnQixNQUFNO0FBSTdCLFFBQUksZ0JBQWdCLEtBQUssY0FBYTtBQUN0QyxRQUFJLGNBQWMsV0FBVyxHQUFHO0FBRTlCLGFBQU9GLFVBQVUsS0FBSyxVQUFVO0FBQUEsSUFDbEM7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQVFPLFdBQVMsdUJBQXVCLE1BQU07QUFDM0MsUUFBSSxVQUFVLFVBQVUsU0FBUyxLQUFLLFVBQVUsQ0FBQyxNQUFNLFNBQVksVUFBVSxDQUFDLElBQUksQ0FBQTtBQUNsRixRQUFJLGlCQUFpQixJQUFJRCxVQUFPO0FBQ2hDLFFBQUksaUJBQWlCLE9BQU8sUUFBUSxjQUFjLFNBQVksb0JBQUksSUFBRztBQUNyRSxRQUFJSSxVQUFTLFdBQVcsSUFBSTtBQUM1QixRQUFJLG1CQUFtQixRQUFRLFNBQzdCLFVBQVUscUJBQXFCLFNBQVMsU0FBUyxrQkFDakQsd0JBQXdCLFFBQVEscUNBQ2hDLHNDQUFzQywwQkFBMEIsU0FBUyxRQUFRLHFCQUFxQixTQUFZLHVCQUNsSCx3QkFBd0IsUUFBUSxrQkFDaEMsMkJBQTJCLDBCQUEwQixTQUFTQSxRQUFPLGlCQUFpQixLQUFLQSxPQUFNLElBQUksdUJBQ3JHLGtCQUFrQixRQUFRLFFBQzFCLFNBQVMsb0JBQW9CLFNBQVMsUUFBUTtBQUNoRCxRQUFJLG1CQUFtQixTQUFTQyxrQkFBaUIsSUFBSSxlQUFlO0FBR2xFLFVBQUksa0JBQWtCLFFBQVc7QUFDL0IsY0FBTSxJQUFJLE1BQU0sMkRBQTJEO0FBQUEsTUFDN0U7QUFJQSxVQUFJLG1CQUFtQixRQUFXO0FBQ2hDLGVBQU8seUJBQXlCLEVBQUU7QUFBQSxNQUNwQztBQUNBLFVBQUksZUFBZSxlQUFlLElBQUksRUFBRTtBQUN4QyxVQUFJLGNBQWM7QUFDaEIsZUFBTztBQUFBLE1BQ1Q7QUFDQSxVQUFJLFFBQVEseUJBQXlCLElBQUksYUFBYTtBQUN0RCxxQkFBZSxJQUFJLElBQUksS0FBSztBQUM1QixhQUFPO0FBQUEsSUFDVDtBQUdBLGFBQVMsMkJBQTJCLE1BQU0sU0FBUztBQUNqRCxVQUFJLGtCQUFrQjtBQUN0QixVQUFJLFVBQVUsSUFBSSxLQUFLLHFDQUFxQztBQUMxRCxZQUFJLGVBQWUseUJBQXlCLE1BQU0sVUFBVTtBQUM1RCxZQUFJLGdCQUFnQixrQkFBa0IsWUFBWTtBQUNsRCwwQkFBa0IsR0FBRyxPQUFPLGVBQWUsR0FBRyxFQUFFLE9BQU8sZUFBZTtBQUFBLE1BQ3hFO0FBSUEsVUFBSSxhQUFhLGtCQUFrQixJQUFJLElBQUksZ0JBQWdCLElBQUksSUFBSUosVUFBVSxLQUFLLFVBQVUsRUFBRSxPQUFPLFlBQVksTUFBTSxXQUFXLENBQUM7QUFDbkksaUJBQVcsUUFBUSxTQUFVLE9BQU87QUFDbEMsWUFBSXJCLFVBQVMwQix3QkFBdUIsT0FBTztBQUFBLFVBQ3pDLG1CQUFtQixRQUFRO0FBQUEsVUFDM0IsY0FBYztBQUFBLFVBQ2QsV0FBVztBQUFBLFFBQ25CLENBQU87QUFHRCxZQUFJLFVBQVUsVUFBVSxLQUFLLElBQUksaUJBQWlCLEtBQUssRUFBRSxpQkFBaUIsU0FBUyxJQUFJO0FBQ3ZGLFlBQUksWUFBWSxZQUFZLFdBQVcsTUFBTTtBQUU3QywyQkFBbUIsR0FBRyxPQUFPLFNBQVMsRUFBRSxPQUFPMUIsT0FBTSxFQUFFLE9BQU8sU0FBUztBQUFBLE1BQ3pFLENBQUM7QUFDRCxVQUFJLFVBQVUsSUFBSSxLQUFLLHFDQUFxQztBQUMxRCxZQUFJLGNBQWMseUJBQXlCLE1BQU0sU0FBUztBQUMxRCxZQUFJLGVBQWUsa0JBQWtCLFdBQVc7QUFDaEQsMEJBQWtCLEdBQUcsT0FBTyxpQkFBaUIsR0FBRyxFQUFFLE9BQU8sWUFBWTtBQUFBLE1BQ3ZFO0FBQ0EsYUFBTyxnQkFBZ0IsS0FBSTtBQUFBLElBQzdCO0FBUUEsYUFBUyxhQUFhLFNBQVMsZUFBZTtBQUM1QyxVQUFJLFlBQVksUUFBUSxpQkFBaUIsYUFBYTtBQUN0RCxVQUFJLGNBQWMsUUFBUSxDQUFDLGVBQWUsSUFBSSxTQUFTLEtBQUssVUFBVSxNQUFNLEtBQUksTUFBTyxJQUFJO0FBQ3pGLHVCQUFlLElBQUksU0FBUztBQUM1QixlQUFPLFVBQVU7QUFBQSxNQUNuQjtBQUNBLGFBQU87QUFBQSxJQUNUO0FBQ0EsYUFBUyw2QkFBNkIsTUFBTTtBQUMxQyxVQUFJLENBQUMsVUFBVSxJQUFJLEdBQUc7QUFDcEIsZUFBTztBQUFBLE1BQ1Q7QUFDQSxhQUFPLGFBQWEsTUFBTSxPQUFPO0FBQUEsSUFDbkM7QUFDQSxhQUFTLDhCQUE4QixNQUFNO0FBQzNDLFVBQUksQ0FBQyxVQUFVLElBQUksR0FBRztBQUNwQixlQUFPO0FBQUEsTUFDVDtBQUdBLFVBQUksc0JBQXNCLElBQUksR0FBRztBQUMvQix1QkFBZSxJQUFJLElBQUk7QUFDdkIsWUFBSSxXQUFXcUIsVUFBVSxLQUFLLFVBQVU7QUFDeEMsaUJBQVMsSUFBSSxHQUFHLElBQUksU0FBUyxRQUFRLEtBQUssR0FBRztBQUMzQyxjQUFJLFFBQVEsU0FBUyxDQUFDO0FBQ3RCLGNBQUksb0JBQW9CLEtBQUssR0FBRztBQUM5QixtQkFBT0ssd0JBQXVCLE9BQU87QUFBQSxjQUNuQyxtQkFBbUI7QUFBQSxjQUNuQixjQUFjO0FBQUEsY0FDZCxXQUFXO0FBQUEsWUFDdkIsQ0FBVztBQUFBLFVBQ0g7QUFBQSxRQUNGO0FBQUEsTUFDRixXQUFXLG1CQUFtQixJQUFJLEdBQUc7QUFFbkMsdUJBQWUsSUFBSSxJQUFJO0FBQ3ZCLFlBQUksWUFBWUwsVUFBVSxLQUFLLFVBQVU7QUFDekMsaUJBQVMsS0FBSyxHQUFHLEtBQUssVUFBVSxRQUFRLE1BQU0sR0FBRztBQUMvQyxjQUFJLFNBQVMsVUFBVSxFQUFFO0FBQ3pCLGNBQUksMEJBQTBCLE1BQU0sR0FBRztBQUNyQyxtQkFBT0ssd0JBQXVCLFFBQVE7QUFBQSxjQUNwQyxtQkFBbUI7QUFBQSxjQUNuQixjQUFjO0FBQUEsY0FDZCxXQUFXO0FBQUEsWUFDdkIsQ0FBVztBQUFBLFVBQ0g7QUFBQSxRQUNGO0FBQUEsTUFDRixXQUFXLGdCQUFnQixJQUFJLEdBQUc7QUFFaEMsdUJBQWUsSUFBSSxJQUFJO0FBQ3ZCLFlBQUksYUFBYUwsVUFBVSxLQUFLLFVBQVU7QUFDMUMsaUJBQVMsTUFBTSxHQUFHLE1BQU0sV0FBVyxRQUFRLE9BQU8sR0FBRztBQUNuRCxjQUFJLFVBQVUsV0FBVyxHQUFHO0FBQzVCLGNBQUksa0JBQWtCLE9BQU8sR0FBRztBQUM5QixtQkFBTyxRQUFRO0FBQUEsVUFDakI7QUFBQSxRQUNGO0FBQ0EsZUFBTztBQUFBLE1BQ1QsV0FBVyxhQUFhLElBQUksTUFBTSxTQUFTLGFBQWEsSUFBSSxNQUFNLFFBQVE7QUFHeEUsWUFBSSxjQUFjLGFBQWEsTUFBTSxLQUFLO0FBQzFDLFlBQUksZ0JBQWdCLE1BQU07QUFDeEIsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRixXQUFXLHNCQUFzQixJQUFJLEdBQUc7QUFDdEMsWUFBSSxnQkFBZ0IsYUFBYSxNQUFNLE9BQU87QUFDOUMsWUFBSSxrQkFBa0IsTUFBTTtBQUMxQixpQkFBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQ0EsVUFBSSxtQkFBbUIsSUFBSSxNQUFNLEtBQUssU0FBUyxZQUFZLEtBQUssU0FBUyxZQUFZLEtBQUssU0FBUyxVQUFVO0FBRTNHLFlBQUksZ0JBQWdCLGFBQWEsTUFBTSxPQUFPO0FBQzlDLFlBQUksa0JBQWtCLE1BQU07QUFDMUIsaUJBQU87QUFBQSxRQUNUO0FBR0EsWUFBSSxLQUFLLFNBQVMsVUFBVTtBQUMxQixpQkFBTztBQUFBLFFBQ1Q7QUFFQSxZQUFJLEtBQUssU0FBUyxTQUFTO0FBQ3pCLGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFDQSxVQUFJLFNBQVMsVUFBVSxJQUFJO0FBQzNCLFVBQUksV0FBVyxRQUFRLE9BQU8sV0FBVyxHQUFHO0FBQzFDLHVCQUFlLElBQUksSUFBSTtBQUN2QixlQUFPQSxVQUFVLE1BQU0sRUFBRSxJQUFJLFNBQVUsU0FBUztBQUM5QyxpQkFBT0ssd0JBQXVCLFNBQVM7QUFBQSxZQUNyQyxtQkFBbUI7QUFBQSxZQUNuQixjQUFjO0FBQUEsWUFDZCxXQUFXO0FBQUEsVUFDckIsQ0FBUztBQUFBLFFBQ0gsQ0FBQyxFQUFFLE9BQU8sU0FBVSxPQUFPO0FBQ3pCLGlCQUFPLE1BQU0sU0FBUztBQUFBLFFBQ3hCLENBQUMsRUFBRSxLQUFLLEdBQUc7QUFBQSxNQUNiO0FBS0EsVUFBSSxtQkFBbUIsSUFBSSxLQUFLLEtBQUssU0FBUyxTQUFTO0FBQ3JELFlBQUksZUFBZSxhQUFhLE1BQU0sS0FBSztBQUMzQyxZQUFJLGlCQUFpQixNQUFNO0FBQ3pCLGlCQUFPO0FBQUEsUUFDVDtBQUNBLFlBQUksZ0JBQWdCLGFBQWEsTUFBTSxPQUFPO0FBQzlDLFlBQUksa0JBQWtCLE1BQU07QUFDMUIsaUJBQU87QUFBQSxRQUNUO0FBR0EsZUFBTztBQUFBLE1BQ1Q7QUFDQSxVQUFJLG9CQUFvQixNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUc7QUFFekMsWUFBSSxrQkFBa0IsMkJBQTJCLE1BQU07QUFBQSxVQUNyRCxtQkFBbUI7QUFBQSxRQUVyQixDQUFDO0FBQ0QsWUFBSSxvQkFBb0IsSUFBSTtBQUMxQixpQkFBTztBQUFBLFFBQ1Q7QUFBQSxNQUNGO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFDQSxhQUFTQSx3QkFBdUIsU0FBUyxTQUFTO0FBQ2hELFVBQUksZUFBZSxJQUFJLE9BQU8sR0FBRztBQUMvQixlQUFPO0FBQUEsTUFDVDtBQUVBLFVBQUksQ0FBQyxVQUFVLFNBQVMsU0FBUyxnQkFBZ0IsS0FBSyxDQUFDLFFBQVEsY0FBYztBQUMzRSx1QkFBZSxJQUFJLE9BQU87QUFDMUIsZUFBTztBQUFBLE1BQ1Q7QUFHQSxVQUFJLHFCQUFxQixVQUFVLE9BQU8sSUFBSSxRQUFRLGlCQUFpQixpQkFBaUIsSUFBSTtBQUU1RixVQUFJLGdCQUFnQix1QkFBdUIsUUFBUSxDQUFDLGVBQWUsSUFBSSxrQkFBa0IsSUFBSSxZQUFZLFNBQVMsaUJBQWlCLElBQUksQ0FBQTtBQUN2SSxVQUFJLFlBQVksVUFBVSxDQUFDLFFBQVEsZ0JBQWdCLGNBQWMsU0FBUyxHQUFHO0FBRTNFLHVCQUFlLElBQUksa0JBQWtCO0FBQ3JDLGVBQU8sY0FBYyxJQUFJLFNBQVUsU0FBUztBQUUxQyxpQkFBT0Esd0JBQXVCLFNBQVM7QUFBQSxZQUNyQyxtQkFBbUIsUUFBUTtBQUFBLFlBQzNCLGNBQWM7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQUlkLFdBQVc7QUFBQSxVQUNyQixDQUFTO0FBQUEsUUFDSCxDQUFDLEVBQUUsS0FBSyxHQUFHO0FBQUEsTUFDYjtBQUtBLFVBQUksZUFBZSxRQUFRLGFBQWEsVUFBVSxPQUFPLEtBQUssWUFBWTtBQUMxRSxVQUFJLENBQUMsY0FBYztBQUNqQixZQUFJLGFBQWEsVUFBVSxPQUFPLEtBQUssUUFBUSxhQUFhLFlBQVksS0FBSyxJQUFJLEtBQUk7QUFDckYsWUFBSSxjQUFjLE1BQU0sWUFBWSxRQUFRO0FBQzFDLHlCQUFlLElBQUksT0FBTztBQUMxQixpQkFBTztBQUFBLFFBQ1Q7QUFHQSxZQUFJLENBQUMsdUJBQXVCLE9BQU8sR0FBRztBQUNwQyxjQUFJLHlCQUF5Qiw4QkFBOEIsT0FBTztBQUNsRSxjQUFJLDJCQUEyQixNQUFNO0FBQ25DLDJCQUFlLElBQUksT0FBTztBQUMxQixtQkFBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUlBLFVBQUksb0JBQW9CLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRztBQUMxQyx1QkFBZSxJQUFJLE9BQU87QUFDMUIsZUFBTztBQUFBLE1BQ1Q7QUFHQSxVQUFJLGdCQUFnQixRQUFRLHFCQUFxQixRQUFRLGNBQWM7QUFDckUsWUFBSSxvQkFBb0IsU0FBUyxDQUFDLFlBQVksU0FBUyxDQUFDLEdBQUc7QUFDekQseUJBQWUsSUFBSSxPQUFPO0FBQzFCLGNBQUksa0JBQWtCLHFCQUFxQixPQUFPO0FBQ2xELGNBQUksZ0JBQWdCLFdBQVcsR0FBRztBQUVoQyxtQkFBTyxtQkFBbUIsT0FBTyxJQUFJLFFBQVEsUUFBUTtBQUFBLFVBQ3ZEO0FBQ0EsaUJBQU9MLFVBQVUsZUFBZSxFQUFFLElBQUksU0FBVSxnQkFBZ0I7QUFDOUQsbUJBQU9LLHdCQUF1QixnQkFBZ0I7QUFBQSxjQUM1QyxtQkFBbUIsUUFBUTtBQUFBLGNBQzNCLGNBQWM7QUFBQSxjQUNkLFdBQVc7QUFBQSxZQUN2QixDQUFXO0FBQUEsVUFDSCxDQUFDLEVBQUUsS0FBSyxHQUFHO0FBQUEsUUFDYjtBQUNBLFlBQUksZ0JBQWdCLFNBQVMsT0FBTyxHQUFHO0FBQ3JDLHlCQUFlLElBQUksT0FBTztBQUMxQixjQUFJLFFBQVEsYUFBYSxnQkFBZ0IsR0FBRztBQUUxQyxtQkFBTyxRQUFRLGFBQWEsZ0JBQWdCO0FBQUEsVUFDOUM7QUFDQSxjQUFJLFFBQVEsYUFBYSxlQUFlLEdBQUc7QUFFekMsbUJBQU8sUUFBUSxhQUFhLGVBQWU7QUFBQSxVQUM3QztBQUVBLGlCQUFPLFFBQVEsYUFBYSxPQUFPLEtBQUs7QUFBQSxRQUMxQztBQUNBLFlBQUksb0JBQW9CLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRztBQUM3Qyx5QkFBZSxJQUFJLE9BQU87QUFDMUIsaUJBQU8sa0JBQWtCLE9BQU87QUFBQSxRQUNsQztBQUFBLE1BQ0Y7QUFHQSxVQUFJLHNCQUFzQixPQUFPLEtBQUssVUFBVSxPQUFPLEtBQUssUUFBUSxnQkFBZ0IsMkNBQTJDLE9BQU8sS0FBSyx1REFBOEQsR0FBRztBQUMxTSxZQUFJLG9CQUFvQiwyQkFBMkIsU0FBUztBQUFBLFVBQzFELG1CQUFtQixRQUFRO0FBQUEsUUFFN0IsQ0FBQztBQUNELFlBQUksc0JBQXNCLElBQUk7QUFDNUIseUJBQWUsSUFBSSxPQUFPO0FBQzFCLGlCQUFPO0FBQUEsUUFDVDtBQUFBLE1BQ0Y7QUFDQSxVQUFJLFFBQVEsYUFBYSxRQUFRLFdBQVc7QUFDMUMsdUJBQWUsSUFBSSxPQUFPO0FBQzFCLGVBQU8sUUFBUSxlQUFlO0FBQUEsTUFDaEM7QUFDQSxVQUFJLFFBQVEsV0FBVztBQUNyQix1QkFBZSxJQUFJLE9BQU87QUFDMUIsZUFBTywyQkFBMkIsU0FBUztBQUFBLFVBQ3pDLG1CQUFtQixRQUFRO0FBQUEsUUFFN0IsQ0FBQztBQUFBLE1BQ0g7QUFDQSxVQUFJLHdCQUF3Qiw2QkFBNkIsT0FBTztBQUNoRSxVQUFJLDBCQUEwQixNQUFNO0FBQ2xDLHVCQUFlLElBQUksT0FBTztBQUMxQixlQUFPO0FBQUEsTUFDVDtBQUdBLHFCQUFlLElBQUksT0FBTztBQUMxQixhQUFPO0FBQUEsSUFDVDtBQUNBLFdBQU8sYUFBYUEsd0JBQXVCLE1BQU07QUFBQSxNQUMvQyxtQkFBbUI7QUFBQTtBQUFBLE1BRW5CLGNBQWMsWUFBWTtBQUFBLE1BQzFCLFdBQVc7QUFBQSxJQUNmLENBQUcsQ0FBQztBQUFBLEVBQ0o7QUNyaUJBLFdBQVMsZ0JBQWdCLE1BQU07QUFDN0IsV0FBTyxvQkFBb0IsTUFBTSxDQUFDLFdBQVcsUUFBUSxZQUFZLFlBQVksV0FBVyxhQUFhLFFBQVEsYUFBYSxnQkFBZ0IsVUFBVSxhQUFhLGFBQWEsQ0FBQztBQUFBLEVBQ2pMO0FBUU8sV0FBUyxzQkFBc0IsTUFBTTtBQUMxQyxRQUFJLFVBQVUsVUFBVSxTQUFTLEtBQUssVUFBVSxDQUFDLE1BQU0sU0FBWSxVQUFVLENBQUMsSUFBSSxDQUFBO0FBQ2xGLFFBQUksZ0JBQWdCLElBQUksR0FBRztBQUN6QixhQUFPO0FBQUEsSUFDVDtBQUNBLFdBQU8sdUJBQXVCLE1BQU0sT0FBTztBQUFBLEVBQzdDO0FDcEJPLFdBQVMsNkJBQTZCLElBQTRCO0FBQ3ZFLFFBQUk7QUFDRixZQUFNLE9BQU8sc0JBQXNCLEVBQUU7QUFDckMsYUFBTyxPQUFPLEtBQUssS0FBQSxJQUFTO0FBQUEsSUFDOUIsUUFBUTtBQUVOLFlBQU0sWUFBWSxHQUFHLGFBQWEsWUFBWTtBQUM5QyxVQUFJLFVBQVcsUUFBTyxVQUFVLEtBQUE7QUFFaEMsWUFBTSxRQUFRLEdBQUcsYUFBYSxPQUFPO0FBQ3JDLFVBQUksTUFBTyxRQUFPLE1BQU0sS0FBQTtBQUV4QixZQUFNLGNBQWMsR0FBRyxhQUFhLGFBQWE7QUFDakQsVUFBSSxZQUFhLFFBQU8sWUFBWSxLQUFBO0FBRXBDLFlBQU0sTUFBTSxHQUFHLGFBQWEsS0FBSztBQUNqQyxVQUFJLElBQUssUUFBTyxJQUFJLEtBQUE7QUFFcEIsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGOztBQ3RCTyxXQUFTLHNCQUF3QztBQUN0RCxRQUFJLE9BQU8sV0FBVyxZQUFhLFFBQU8sQ0FBQyxHQUFHLENBQUM7QUFFL0MsUUFBSTtBQUNGLFVBQUksT0FBTyxTQUFTLE9BQU8sS0FBSztBQUM5QixlQUFPLENBQUMsR0FBRyxDQUFDO0FBQUEsTUFDZDtBQUVBLFVBQUksT0FBTyxjQUFjO0FBQ3ZCLGNBQU0sT0FBTyxPQUFPLGFBQWEsc0JBQUE7QUFDakMsZUFBTyxDQUFDLEtBQUssTUFBTSxLQUFLLEdBQUc7QUFBQSxNQUM3QjtBQUFBLElBQ0YsUUFBUTtBQUFBLElBR1I7QUFFQSxXQUFPLENBQUMsR0FBRyxDQUFDO0FBQUEsRUFDZDs7QUNsQkEsUUFBTSxvQ0FBb0IsSUFBQTtBQUMxQixRQUFNLHFDQUFxQixJQUFBO0FBRXBCLFFBQU0sa0JBQWtCO0FBQUEsSUFDN0IsU0FBUyxPQUFlLElBQW1CO0FBQ3pDLG9CQUFjLElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQUEsSUFDMUM7QUFBQSxJQUVBLElBQUksT0FBK0I7QUFDakMsWUFBTSxNQUFNLGNBQWMsSUFBSSxLQUFLO0FBQ25DLFVBQUksQ0FBQyxJQUFLLFFBQU87QUFDakIsWUFBTSxLQUFLLElBQUksTUFBQTtBQUNmLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxhQUFhO0FBQzFCLHNCQUFjLE9BQU8sS0FBSztBQUMxQixlQUFPO0FBQUEsTUFDVDtBQUNBLGFBQU87QUFBQSxJQUNUO0FBQUEsSUFFQSxpQkFBaUIsU0FBdUM7QUFDdEQsaUJBQVcsQ0FBQyxVQUFVLEtBQUssS0FBSyxPQUFPLFFBQVEsT0FBTyxHQUFHO0FBQ3ZELHVCQUFlLElBQUksVUFBVSxLQUFLO0FBQUEsTUFDcEM7QUFBQSxJQUNGO0FBQUEsSUFFQSxjQUFjLFVBQWtDO0FBQzlDLFlBQU0sUUFBUSxlQUFlLElBQUksUUFBUTtBQUN6QyxVQUFJLENBQUMsTUFBTyxRQUFPO0FBQ25CLGFBQU8sS0FBSyxJQUFJLEtBQUs7QUFBQSxJQUN2QjtBQUFBLElBRUEsUUFBYztBQUNaLG9CQUFjLE1BQUE7QUFDZCxxQkFBZSxNQUFBO0FBQUEsSUFDakI7QUFBQSxFQUNGOztBQ2hDQSxpQkFBc0IsVUFBVSxPQUE2QztBQUMzRSxVQUFNLE9BQU8sT0FBTyxVQUFVLFdBQVcsSUFBSSxjQUFjLE9BQU8sS0FBSyxJQUFJO0FBQzNFLFVBQU0sYUFBYSxNQUFNLE9BQU8sT0FBTyxPQUFPLFdBQVcsSUFBVztBQUNwRSxVQUFNLFlBQVksTUFBTSxLQUFLLElBQUksV0FBVyxVQUFVLENBQUM7QUFDdkQsV0FBTyxVQUFVLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUFBLEVBQ3RFO0FBTU8sV0FBUyxjQUFjLEtBQWtCO0FBQzlDLFFBQUksUUFBUSxRQUFRLE9BQU8sUUFBUSxVQUFVO0FBQzNDLGFBQU8sS0FBSyxVQUFVLEdBQUc7QUFBQSxJQUMzQjtBQUNBLFFBQUksTUFBTSxRQUFRLEdBQUcsR0FBRztBQUN0QixhQUFPLE1BQU0sSUFBSSxJQUFJLGFBQWEsRUFBRSxLQUFLLEdBQUcsSUFBSTtBQUFBLElBQ2xEO0FBQ0EsVUFBTSxPQUFPLE9BQU8sS0FBSyxHQUFHLEVBQUUsS0FBQTtBQUM5QixVQUFNLFFBQVEsS0FBSyxJQUFJLENBQUMsUUFBUTtBQUM5QixZQUFNLE1BQU0sSUFBSSxHQUFHO0FBQ25CLGFBQU8sS0FBSyxVQUFVLEdBQUcsSUFBSSxNQUFNLGNBQWMsR0FBRztBQUFBLElBQ3RELENBQUM7QUFDRCxXQUFPLE1BQU0sTUFBTSxLQUFLLEdBQUcsSUFBSTtBQUFBLEVBQ2pDOztBQ2xCQSxpQkFBc0IscUJBQ3BCLFFBQ0EsTUFDQSxRQUNBLFVBQ0EsVUFBVSxHQUNWLFVBQThCLElBQ2I7QUFDakIsVUFBTSxlQUFlLEtBQUssTUFBTSxVQUFVLEVBQUU7QUFDNUMsVUFBTSxhQUFhLFNBQVMsS0FBSyxDQUFDLE9BQU8sR0FBRyxRQUFRLFlBQVksR0FBRyxPQUFPO0FBRTFFLFFBQUksc0JBQXNCLFNBQVMsT0FBTyxDQUFDLE9BQU8sR0FBRyxXQUFXLEdBQUcsWUFBWTtBQUUvRSxRQUFJLFFBQVEsU0FBUyxtQkFBbUIsUUFBUSxZQUFZO0FBQzFELFlBQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFLElBQUksUUFBUTtBQUVqQyw0QkFBc0Isb0JBQW9CLE9BQU8sQ0FBQyxPQUFPO0FBQ3ZELGNBQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxHQUFHO0FBQ3BCLGVBQU8sS0FBSyxJQUFJLEtBQUssRUFBRSxJQUFJLEtBQUssT0FBTyxLQUFLLElBQUksS0FBSyxFQUFFLElBQUksS0FBSztBQUFBLE1BQ2xFLENBQUM7QUFBQSxJQUNIO0FBRUEsVUFBTSxxQkFBcUIsb0JBQW9CLElBQUksQ0FBQyxRQUFRO0FBQUEsTUFDMUQsS0FBSyxHQUFHO0FBQUEsTUFDUixNQUFNLEdBQUc7QUFBQSxNQUNULE1BQU0sR0FBRztBQUFBLE1BQ1QsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFBQSxNQUNoQyxVQUFVLEdBQUcsS0FBSztBQUFBLE1BQ2xCLFNBQVMsR0FBRyxLQUFLO0FBQUEsSUFBQSxFQUNqQjtBQUVGLFVBQU0sVUFBVTtBQUFBLE1BQ2Q7QUFBQSxNQUNBO0FBQUEsTUFDQSxRQUFRLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxRQUFRLEVBQUUsT0FBQSxFQUFTO0FBQUEsTUFDaEU7QUFBQSxNQUNBO0FBQUEsTUFDQSxhQUFhO0FBQUEsSUFBQTtBQUdmLFVBQU0sVUFBVSxjQUFjLE9BQU87QUFDckMsVUFBTSxXQUFXLE1BQU0sVUFBVSxPQUFPO0FBQ3hDLFdBQU8sU0FBUyxNQUFNLEdBQUcsRUFBRTtBQUFBLEVBQzdCOztBQzNDQSxRQUFNLHFCQUFxQjtBQUFBLElBQ3pCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0YsRUFBRSxLQUFLLEdBQUc7QUF1QlYsUUFBTSxtQ0FBbUIsUUFBQTtBQUN6QixNQUFJLFNBQVM7QUFDYixNQUFJLFlBQVk7QUFFVCxXQUFTLFVBQVUsSUFBb0I7QUFDNUMsUUFBSSxDQUFDLEdBQUk7QUFDVCxpQkFBYSxPQUFPLEVBQUU7QUFBQSxFQUN4QjtBQUVBLGlCQUFzQixtQkFDcEIsVUFBVSxRQUNWLGdCQUErQixNQUNUOztBQUN0QixRQUFJLE9BQU8sYUFBYSxlQUFlLE9BQU8sV0FBVyxhQUFhO0FBQ3BFLGFBQU87QUFBQSxRQUNMLGFBQWEsUUFBUSxLQUFLLElBQUEsQ0FBSztBQUFBLFFBQy9CLFlBQVk7QUFBQSxRQUNaLFVBQVU7QUFBQSxRQUNWLFFBQVE7QUFBQSxVQUNOO0FBQUEsWUFDRSxVQUFVO0FBQUEsWUFDVixpQkFBaUI7QUFBQSxZQUNqQixRQUFRO0FBQUEsWUFDUixNQUFNO0FBQUEsWUFDTixRQUFRLENBQUMsR0FBRyxDQUFDO0FBQUEsWUFDYixZQUFZO0FBQUEsVUFBQTtBQUFBLFFBQ2Q7QUFBQSxRQUVGLFVBQVUsQ0FBQTtBQUFBLFFBQ1YsVUFBVSxFQUFFLEdBQUcsTUFBTSxHQUFHLElBQUE7QUFBQSxRQUN4QixLQUFLO0FBQUEsUUFDTCxRQUFRLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBQTtBQUFBLFFBQ25CLGlCQUFpQjtBQUFBLFFBQ2pCLElBQUksS0FBSyxJQUFBO0FBQUEsTUFBSTtBQUFBLElBRWpCO0FBRUEsVUFBTSxZQUFZLE9BQU8sU0FBUztBQUNsQyxVQUFNLFVBQVUsT0FBTyxTQUFTO0FBQ2hDLFVBQU0sY0FBYyxvQkFBQTtBQUVwQixVQUFNLFdBQVc7QUFBQSxNQUNmLEtBQUcsY0FBUyxvQkFBVCxtQkFBMEIsZ0JBQWUsT0FBTztBQUFBLE1BQ25ELEtBQUcsY0FBUyxvQkFBVCxtQkFBMEIsaUJBQWdCLE9BQU87QUFBQSxJQUFBO0FBR3RELFVBQU0sU0FBc0I7QUFBQSxNQUMxQjtBQUFBLFFBQ0UsVUFBVTtBQUFBLFFBQ1YsaUJBQWlCO0FBQUEsUUFDakIsUUFBUTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsWUFBWTtBQUFBLE1BQUE7QUFBQSxJQUNkO0FBR0YsVUFBTSxrQ0FBa0IsSUFBQTtBQUd4QixhQUFTLGFBQWEsTUFBNkM7O0FBQ2pFLFlBQU0sV0FBVyxLQUFLLGlCQUFpQixHQUFHO0FBQzFDLGVBQVMsSUFBSSxHQUFHLElBQUksU0FBUyxRQUFRLEtBQUs7QUFDeEMsY0FBTSxLQUFLLFNBQVMsQ0FBQztBQUNyQixZQUFJLENBQUMsR0FBSTtBQUdULFlBQUksUUFBMkIsR0FBRyxjQUFjO0FBQ2hELFlBQUksQ0FBQyxTQUFTLE9BQU8sV0FBVyxpQkFBZ0JULE1BQUEsT0FBZSxRQUFmLGdCQUFBQSxJQUFvQix5QkFBd0I7QUFDekYsY0FBSTtBQUFFLG9CQUFTLE9BQWUsSUFBSSx1QkFBdUIsRUFBRTtBQUFBLFVBQUcsUUFBUTtBQUFBLFVBQUM7QUFBQSxRQUMxRTtBQUVBLFlBQUksT0FBTztBQUNULHVCQUFhLEtBQUs7QUFBQSxRQUNwQjtBQUdBLFlBQUksWUFBWSxJQUFJLEVBQUUsRUFBRztBQUV6QixZQUFJLFNBQVMsYUFBYSxJQUFJLEVBQUU7QUFDaEMsWUFBSSxRQUFRO0FBQ1YsY0FBSSxPQUFPLGFBQWMsYUFBWSxJQUFJLEVBQUU7QUFDM0M7QUFBQSxRQUNGO0FBRUEsWUFBSSxlQUFlO0FBRW5CLFlBQUk7QUFDRixjQUFJLEdBQUcsV0FBVyxHQUFHLFFBQVEsa0JBQWtCLEdBQUc7QUFDaEQsMkJBQWU7QUFBQSxVQUNqQjtBQUFBLFFBQ0YsUUFBUTtBQUFBLFFBRVI7QUFFQSxZQUFJLENBQUMsY0FBYztBQUNqQixnQkFBTSxTQUFTO0FBQ2YsY0FBSyxHQUFXLGFBQVdVLE1BQUEsT0FBTyxVQUFQLGdCQUFBQSxJQUFjLFlBQVcsYUFBYSxHQUFHLGFBQWEsU0FBUyxHQUFHO0FBQzNGLDJCQUFlO0FBQUEsVUFDakIsT0FBTztBQUVMLGdCQUFJLEdBQUcsaUJBQWlCO0FBQ3RCLG9CQUFNLGFBQWEsR0FBRztBQUN0Qix1QkFBUyxJQUFJLEdBQUcsSUFBSSxXQUFXLFFBQVEsS0FBSztBQUMxQyxzQkFBTSxRQUFRLFdBQVcsQ0FBQztBQUMxQixvQkFBSSxTQUFTLE1BQU0sYUFBYSxLQUFLLFdBQVc7QUFDOUMsd0JBQU0sT0FBTyxNQUFNO0FBQ25CLHNCQUFJLFFBQVEsS0FBSyxLQUFBLEVBQU8sU0FBUyxHQUFHO0FBQ2xDLG1DQUFlO0FBQ2Y7QUFBQSxrQkFDRjtBQUFBLGdCQUNGO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFFQSxnQkFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsV0FBVyxHQUFHO0FBQzdDLG9CQUFNLFdBQVcsT0FBTyxpQkFBaUIsRUFBRTtBQUMzQyxrQkFBSSxTQUFTLG1CQUFtQixTQUFTLG9CQUFvQixVQUFVLFNBQVMsZ0JBQWdCLFNBQVMsTUFBTSxHQUFHO0FBQ2hILHNCQUFNLE9BQU8sR0FBRyxzQkFBQTtBQUNoQixvQkFBSSxLQUFLLFFBQVEsTUFBTSxLQUFLLFNBQVMsSUFBSTtBQUN2QyxpQ0FBZTtBQUFBLGdCQUNqQjtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFFQSxZQUFJLGNBQWM7QUFDaEIsc0JBQVksSUFBSSxFQUFFO0FBQ2xCLHVCQUFhLElBQUksSUFBSSxFQUFFLGNBQWMsTUFBTTtBQUFBLFFBQzdDLE9BQU87QUFDTCx1QkFBYSxJQUFJLElBQUksRUFBRSxjQUFjLE9BQU87QUFBQSxRQUM5QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBRUEsaUJBQWEsUUFBUTtBQUdyQixVQUFNLFdBQVcsTUFBTSxLQUFLLFdBQVcsRUFBRTtBQUFBLE1BQ3ZDLENBQUMsT0FBTyxDQUFDLEdBQUcsUUFBUSxpQkFBaUIsS0FBSyxHQUFHLE9BQU87QUFBQSxJQUFBO0FBR3RELFVBQU0sV0FBNkIsQ0FBQTtBQUVuQyxlQUFXLE1BQU0sVUFBVTtBQUN6QixVQUFJLFNBQVMsYUFBYSxJQUFJLEVBQUU7QUFDaEMsVUFBSSxDQUFDLE9BQVE7QUFFYixVQUFJLENBQUMsT0FBTyxPQUFPO0FBQ2pCLGVBQU8sUUFBUSxJQUFJLFFBQVE7QUFBQSxNQUM3QjtBQUNBLFlBQU0sUUFBUSxPQUFPO0FBQ3JCLHNCQUFnQixTQUFTLE9BQU8sRUFBRTtBQUVsQyxZQUFNLE9BQU8sR0FBRyxzQkFBQTtBQUNoQixZQUFNLE9BQXlDO0FBQUEsUUFDN0MsS0FBSyxNQUFNLEtBQUssT0FBTyxZQUFZLENBQUMsQ0FBQztBQUFBLFFBQ3JDLEtBQUssTUFBTSxLQUFLLE1BQU0sWUFBWSxDQUFDLENBQUM7QUFBQSxRQUNwQyxLQUFLLE1BQU0sS0FBSyxLQUFLO0FBQUEsUUFDckIsS0FBSyxNQUFNLEtBQUssTUFBTTtBQUFBLE1BQUE7QUFHeEIsWUFBTSxVQUFVLGlCQUFpQixFQUFFO0FBQ25DLFlBQU0sYUFDSixLQUFLLFVBQVUsS0FDZixLQUFLLFNBQVMsS0FDZCxLQUFLLE9BQU8sU0FBUyxLQUNyQixLQUFLLFFBQVEsU0FBUztBQUV4QixZQUFNLEtBQUssS0FBSyxPQUFPLEtBQUssUUFBUTtBQUNwQyxZQUFNLEtBQUssS0FBSyxNQUFNLEtBQUssU0FBUztBQUNwQyxZQUFNLFdBQVcsa0JBQWtCLElBQUksSUFBSSxFQUFFO0FBRzdDLFVBQUksQ0FBQyxPQUFPLFlBQVk7QUFDdEIsY0FBTSxNQUFNLEdBQUcsUUFBUSxZQUFBO0FBQ3ZCLGNBQU0sT0FBTyxnQkFBZ0IsRUFBRTtBQUMvQixjQUFNLE9BQU8sNkJBQTZCLEVBQUU7QUFDNUMsY0FBTSxPQUFPLGtCQUFrQixFQUFFO0FBQ2pDLGNBQU0sRUFBRSxXQUFXLGNBQWMsY0FBQSxJQUFrQixvQkFBb0IsRUFBRTtBQUV6RSxZQUFJLFlBQWlCO0FBQ3JCLFlBQUksUUFBUSxXQUFXLFFBQVEsY0FBYyxRQUFRLFVBQVU7QUFDN0QsZ0JBQU0sVUFBVTtBQUNoQixnQkFBTSxRQUFRLFFBQVEsUUFBUSxRQUFRLFlBQUE7QUFDdEMsZ0JBQU0sYUFBYSxTQUFTO0FBQzVCLGdCQUFNLFdBQVcsUUFBUSxRQUFRLFNBQVMsUUFBUSxNQUFNLFNBQVMsQ0FBQztBQUVsRSxzQkFBWTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLGNBQWMsUUFBUSxnQkFBZ0I7QUFBQSxZQUN0QyxNQUFNLFFBQVEsUUFBUTtBQUFBLFlBQ3RCLGFBQWEsUUFBUSxlQUFlO0FBQUEsWUFDcEMsYUFBYTtBQUFBLFlBQ2IsV0FBVztBQUFBLFlBQ1gsT0FBTyxhQUFhLE9BQU8sUUFBUSxTQUFTO0FBQUEsVUFBQTtBQUFBLFFBRWhEO0FBRUEsY0FBTSxRQUFnQyxDQUFBO0FBQ3RDLGNBQU0sVUFBVSxDQUFDQyxVQUFpQjtBQUNoQyxnQkFBTSxNQUFNLEdBQUcsYUFBYUEsS0FBSTtBQUNoQyxjQUFJLElBQUssT0FBTUEsS0FBSSxJQUFJO0FBQUEsUUFDekI7QUFDQSxnQkFBUSxLQUFLO0FBQ2IsZ0JBQVEsT0FBTztBQUNmLGdCQUFRLGtCQUFrQjtBQUMxQixnQkFBUSxPQUFPO0FBQ2YsZ0JBQVEsY0FBYztBQUV0QixZQUFJLGdCQUFnQjtBQUNwQixjQUFNLGFBQThGLENBQUE7QUFFcEcsaUJBQVMsSUFBSSxHQUFHLElBQUksR0FBRyxXQUFXLFFBQVEsS0FBSztBQUM3QyxnQkFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDO0FBQzdCLGNBQUksU0FBUyxNQUFNLGFBQWEsS0FBSyxXQUFXO0FBQzlDLGtCQUFNLFVBQVUsTUFBTSxhQUFhO0FBQ25DLGdCQUFJLENBQUMsUUFBUSxRQUFRO0FBQ25CLCtCQUFpQjtBQUNqQjtBQUFBLFlBQ0Y7QUFFQSxnQkFBSSxlQUFlO0FBQ25CLGtCQUFNLFVBQXdFLENBQUE7QUFHOUUsdUJBQVcsS0FBSyxRQUFRLFNBQVMscURBQXFELEdBQUc7QUFDdkYsc0JBQVEsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFRLEtBQUssRUFBRSxRQUFTLEVBQUUsQ0FBQyxFQUFFLFFBQVEsTUFBTSxFQUFFLENBQUMsR0FBRyxNQUFNLFNBQVM7QUFBQSxZQUMxRjtBQUVBLHVCQUFXLEtBQUssUUFBUSxTQUFTLHVDQUF1QyxHQUFHO0FBQ3pFLG9CQUFNLFFBQVEsRUFBRSxDQUFDLEVBQUUsUUFBUSxVQUFVLEVBQUU7QUFDdkMsa0JBQUksZ0JBQWdCLEtBQUssS0FBSyxHQUFHO0FBQy9CLG9CQUFJLElBQUk7QUFDUixzQkFBTSxhQUFXLENBQUMsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLEdBQUUsQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxDQUFDLENBQUM7QUFDN08sc0JBQU0sYUFBVyxDQUFDLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsR0FBRSxHQUFFLEdBQUUsQ0FBQyxDQUFDO0FBQ2pNLHNCQUFNLFNBQVMsTUFBTSxNQUFNLEVBQUUsRUFBRSxJQUFJLE1BQU0sRUFBRSxRQUFBO0FBQzNDLG9CQUFJLFFBQVE7QUFDWix5QkFBUyxJQUFJ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VUFBVTtBQUFBLFFBQzVCLE9BQU87QUFDTixpQkFBTztBQUFBLFFBQ1I7QUFBQSxNQUNEO0FBRUEsYUFBTyxLQUFLLFVBQVUsV0FBVztBQUFBLElBQ2xDO0FBQUEsSUFFQSxJQUFJLE1BQU0sT0FBTztBQUNoQixZQUFNLEVBQUMsVUFBUyxJQUFJLEtBQUssZUFBZSxNQUFNLElBQUk7QUFDbEQsYUFBTyxNQUFNLElBQUksV0FBVyxLQUFLO0FBQUEsSUFDbEM7QUFBQSxJQUVBLElBQUksTUFBTTtBQUNULFlBQU0sRUFBQyxVQUFTLElBQUksS0FBSyxlQUFlLElBQUk7QUFDNUMsYUFBTyxNQUFNLElBQUksU0FBUztBQUFBLElBQzNCO0FBQUEsSUFFQSxJQUFJLE1BQU07QUFDVCxZQUFNLEVBQUMsVUFBUyxJQUFJLEtBQUssZUFBZSxJQUFJO0FBQzVDLGFBQU8sTUFBTSxJQUFJLFNBQVM7QUFBQSxJQUMzQjtBQUFBLElBRUEsT0FBTyxNQUFNO0FBQ1osWUFBTSxFQUFDLFdBQVcsV0FBVSxJQUFJLEtBQUssZUFBZSxJQUFJO0FBQ3hELGFBQU8sUUFBUSxhQUFhLE1BQU0sT0FBTyxTQUFTLEtBQUssS0FBSyxZQUFZLE9BQU8sVUFBVSxDQUFDO0FBQUEsSUFDM0Y7QUFBQSxJQUVBLFFBQVE7QUFDUCxZQUFNLE1BQUs7QUFDWCxXQUFLLGNBQWMsTUFBSztBQUN4QixXQUFLLFlBQVksTUFBSztBQUFBLElBQ3ZCO0FBQUEsSUFFQSxLQUFLLE9BQU8sV0FBVyxJQUFJO0FBQzFCLGFBQU87QUFBQSxJQUNSO0FBQUEsSUFFQSxJQUFJLE9BQU87QUFDVixhQUFPLE1BQU07QUFBQSxJQUNkO0FBQUEsRUFDRDtBQ3ZGbUIsTUFBSSxZQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMyw0LDUsNiw3LDgsOSwxNSwxNiwxNywxOCwxOSwyMCwzOCwzOSw0MCw0MSw0Miw0Myw0NCw0NV19
