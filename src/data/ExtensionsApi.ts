// To parse this data:
//
//   import { Convert, ExtensionsAPI } from "./file";
//
//   const extensionsAPI = Convert.toExtensionsAPI(json);

export interface ExtensionsAPI {
    header:                       Header;
    builtin_class_sizes:          BuiltinClassSize[];
    builtin_class_member_offsets: BuiltinClassMemberOffset[];
    global_constants:             any[];
    global_enums:                 GlobalEnumElement[];
    utility_functions:            UtilityFunction[];
    builtin_classes:              BuiltinClass[];
    classes:                      ExtensionsAPIClass[];
    singletons:                   Singleton[];
    native_structures:            NativeStructure[];
}

export interface BuiltinClassMemberOffset {
    build_configuration: string;
    classes:             BuiltinClassMemberOffsetClass[];
}

export interface BuiltinClassMemberOffsetClass {
    name:    TypeEnum;
    members: Member[];
}

export interface Member {
    member: string;
    offset: number;
    meta:   MemberMeta;
}

export enum MemberMeta {
    Basis = "Basis",
    Double = "double",
    Float = "float",
    Int32 = "int32",
    Vector2 = "Vector2",
    Vector2I = "Vector2i",
    Vector3 = "Vector3",
    Vector4 = "Vector4",
}

export enum TypeEnum {
    AABB = "AABB",
    Basis = "Basis",
    Color = "Color",
    Int = "int",
    Plane = "Plane",
    Projection = "Projection",
    Quaternion = "Quaternion",
    Rect2 = "Rect2",
    Rect2I = "Rect2i",
    Transform2D = "Transform2D",
    Transform3D = "Transform3D",
    Vector2 = "Vector2",
    Vector2I = "Vector2i",
    Vector3 = "Vector3",
    Vector3I = "Vector3i",
    Vector4 = "Vector4",
    Vector4I = "Vector4i",
}

export interface BuiltinClassSize {
    build_configuration: string;
    sizes:               Size[];
}

export interface Size {
    name: string;
    size: number;
}

export interface BuiltinClass {
    name:                  string;
    is_keyed:              boolean;
    operators:             Operator[];
    constructors:          Constructor[];
    has_destructor:        boolean;
    indexing_return_type?: string;
    methods?:              BuiltinClassMethod[];
    members?:              Singleton[];
    constants?:            BuiltinClassConstant[];
    enums?:                BuiltinClassEnum[];
}

export interface BuiltinClassConstant {
    name:  string;
    type:  TypeEnum;
    value: string;
}

export interface Constructor {
    index:      number;
    arguments?: Singleton[];
}

export interface Singleton {
    name: string;
    type: string;
}

export interface BuiltinClassEnum {
    name:   string;
    values: ValueElement[];
}

export interface ValueElement {
    name:  string;
    value: number;
}

export interface BuiltinClassMethod {
    name:         string;
    return_type?: string;
    is_vararg:    boolean;
    is_const:     boolean;
    is_static:    boolean;
    hash:         number;
    arguments?:   Argument[];
}

export interface Argument {
    name:           string;
    type:           string;
    default_value?: string;
    meta?:          ArgumentMeta;
}

export enum ArgumentMeta {
    Double = "double",
    Float = "float",
    Int16 = "int16",
    Int32 = "int32",
    Int64 = "int64",
    Int8 = "int8",
    Uint16 = "uint16",
    Uint32 = "uint32",
    Uint64 = "uint64",
    Uint8 = "uint8",
}

export interface Operator {
    name:        OperatorName;
    right_type?: string;
    return_type: string;
}

export enum OperatorName {
    Ambitious = "*",
    And = "and",
    Braggadocious = ">>",
    Cunning = "/",
    Empty = "==",
    Fluffy = ">",
    Frisky = "**",
    Hilarious = "-",
    In = "in",
    Indecent = "+",
    Indigo = ">=",
    Magenta = "%",
    Mischievous = "<<",
    Name = "!=",
    NameUnary = "unary+",
    Not = "not",
    Or = "or",
    Purple = "<",
    Sticky = "<=",
    Tentacled = "~",
    The1 = "&",
    The2 = "|",
    The3 = "^",
    Unary = "unary-",
    Xor = "xor",
}

export interface ExtensionsAPIClass {
    name:            string;
    is_refcounted:   boolean;
    is_instantiable: boolean;
    inherits?:       string;
    api_type:        APIType;
    enums?:          GlobalEnumElement[];
    methods?:        ClassMethod[];
    properties?:     Property[];
    signals?:        Signal[];
    constants?:      ValueElement[];
}

export enum APIType {
    Core = "core",
    Editor = "editor",
}

export interface GlobalEnumElement {
    name:        string;
    is_bitfield: boolean;
    values:      ValueElement[];
}

export interface ClassMethod {
    name:          string;
    is_const:      boolean;
    is_vararg:     boolean;
    is_static:     boolean;
    is_virtual:    boolean;
    hash?:         number;
    return_value?: ReturnValue;
    arguments?:    Argument[];
}

export interface ReturnValue {
    type:  string;
    meta?: ArgumentMeta;
}

export interface Property {
    type:    string;
    name:    string;
    setter?: string;
    getter:  string;
    index?:  number;
}

export interface Signal {
    name:       string;
    arguments?: Singleton[];
}

export interface Header {
    version_major:     number;
    version_minor:     number;
    version_patch:     number;
    version_status:    string;
    version_build:     string;
    version_full_name: string;
}

export interface NativeStructure {
    name:   string;
    format: string;
}

export interface UtilityFunction {
    name:         string;
    return_type?: ReturnType;
    category:     Category;
    is_vararg:    boolean;
    hash:         number;
    arguments?:   Singleton[];
}

export enum Category {
    General = "general",
    Math = "math",
    Random = "random",
}

export enum ReturnType {
    Bool = "bool",
    Float = "float",
    Int = "int",
    Object = "Object",
    PackedByteArray = "PackedByteArray",
    PackedInt64Array = "PackedInt64Array",
    Rid = "RID",
    String = "String",
    Variant = "Variant",
}

// Converts JSON strings to/from your types
export class Convert {
    public static toExtensionsAPI(json: string): ExtensionsAPI {
        return JSON.parse(json);
    }

    public static extensionsAPIToJson(value: ExtensionsAPI): string {
        return JSON.stringify(value);
    }
}
