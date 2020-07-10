// Namespaced Header

#ifndef __NS_SYMBOL
// We need to have multiple levels of macros here so that __NAMESPACE_PREFIX_ is
// properly replaced by the time we concatenate the namespace prefix.
#define __NS_REWRITE(ns, symbol) ns ## _ ## symbol
#define __NS_BRIDGE(ns, symbol) __NS_REWRITE(ns, symbol)
#define __NS_SYMBOL(symbol) __NS_BRIDGE(FL, symbol)
#endif


// Classes
#ifndef PBAbstractMessage
#define PBAbstractMessage __NS_SYMBOL(PBAbstractMessage)
#endif

#ifndef PBAbstractMessage_Builder
#define PBAbstractMessage_Builder __NS_SYMBOL(PBAbstractMessage_Builder)
#endif

#ifndef PBCodedInputStream
#define PBCodedInputStream __NS_SYMBOL(PBCodedInputStream)
#endif

#ifndef PBCodedOutputStream
#define PBCodedOutputStream __NS_SYMBOL(PBCodedOutputStream)
#endif

#ifndef PBConcreteExtensionField
#define PBConcreteExtensionField __NS_SYMBOL(PBConcreteExtensionField)
#endif

#ifndef PBExtendableMessage
#define PBExtendableMessage __NS_SYMBOL(PBExtendableMessage)
#endif

#ifndef PBExtendableMessage_Builder
#define PBExtendableMessage_Builder __NS_SYMBOL(PBExtendableMessage_Builder)
#endif

#ifndef PBExtensionRegistry
#define PBExtensionRegistry __NS_SYMBOL(PBExtensionRegistry)
#endif

#ifndef PBField
#define PBField __NS_SYMBOL(PBField)
#endif

#ifndef PBGeneratedMessage
#define PBGeneratedMessage __NS_SYMBOL(PBGeneratedMessage)
#endif

#ifndef PBGeneratedMessage_Builder
#define PBGeneratedMessage_Builder __NS_SYMBOL(PBGeneratedMessage_Builder)
#endif

#ifndef PBMutableExtensionRegistry
#define PBMutableExtensionRegistry __NS_SYMBOL(PBMutableExtensionRegistry)
#endif

#ifndef PBMutableField
#define PBMutableField __NS_SYMBOL(PBMutableField)
#endif

#ifndef PBTextFormat
#define PBTextFormat __NS_SYMBOL(PBTextFormat)
#endif

#ifndef PBUnknownFieldSet
#define PBUnknownFieldSet __NS_SYMBOL(PBUnknownFieldSet)
#endif

#ifndef PBUnknownFieldSet_Builder
#define PBUnknownFieldSet_Builder __NS_SYMBOL(PBUnknownFieldSet_Builder)
#endif

// Functions
#ifndef typeIsFixedSize
#define typeIsFixedSize __NS_SYMBOL(typeIsFixedSize)
#endif

#ifndef typeSize
#define typeSize __NS_SYMBOL(typeSize)
#endif

#ifndef decodeZigZag32
#define decodeZigZag32 __NS_SYMBOL(decodeZigZag32)
#endif

#ifndef decodeZigZag64
#define decodeZigZag64 __NS_SYMBOL(decodeZigZag64)
#endif

#ifndef encodeZigZag32
#define encodeZigZag32 __NS_SYMBOL(encodeZigZag32)
#endif

#ifndef encodeZigZag64
#define encodeZigZag64 __NS_SYMBOL(encodeZigZag64)
#endif

#ifndef computeDoubleSizeNoTag
#define computeDoubleSizeNoTag __NS_SYMBOL(computeDoubleSizeNoTag)
#endif

#ifndef computeFloatSizeNoTag
#define computeFloatSizeNoTag __NS_SYMBOL(computeFloatSizeNoTag)
#endif

#ifndef computeUInt64SizeNoTag
#define computeUInt64SizeNoTag __NS_SYMBOL(computeUInt64SizeNoTag)
#endif

#ifndef computeRawVarint64Size
#define computeRawVarint64Size __NS_SYMBOL(computeRawVarint64Size)
#endif

#ifndef computeInt64SizeNoTag
#define computeInt64SizeNoTag __NS_SYMBOL(computeInt64SizeNoTag)
#endif

#ifndef computeInt32SizeNoTag
#define computeInt32SizeNoTag __NS_SYMBOL(computeInt32SizeNoTag)
#endif

#ifndef computeRawVarint32Size
#define computeRawVarint32Size __NS_SYMBOL(computeRawVarint32Size)
#endif

#ifndef computeFixed64SizeNoTag
#define computeFixed64SizeNoTag __NS_SYMBOL(computeFixed64SizeNoTag)
#endif

#ifndef computeFixed32SizeNoTag
#define computeFixed32SizeNoTag __NS_SYMBOL(computeFixed32SizeNoTag)
#endif

#ifndef computeBoolSizeNoTag
#define computeBoolSizeNoTag __NS_SYMBOL(computeBoolSizeNoTag)
#endif

#ifndef computeStringSizeNoTag
#define computeStringSizeNoTag __NS_SYMBOL(computeStringSizeNoTag)
#endif

#ifndef computeGroupSizeNoTag
#define computeGroupSizeNoTag __NS_SYMBOL(computeGroupSizeNoTag)
#endif

#ifndef computeUnknownGroupSizeNoTag
#define computeUnknownGroupSizeNoTag __NS_SYMBOL(computeUnknownGroupSizeNoTag)
#endif

#ifndef computeMessageSizeNoTag
#define computeMessageSizeNoTag __NS_SYMBOL(computeMessageSizeNoTag)
#endif

#ifndef computeDataSizeNoTag
#define computeDataSizeNoTag __NS_SYMBOL(computeDataSizeNoTag)
#endif

#ifndef computeUInt32SizeNoTag
#define computeUInt32SizeNoTag __NS_SYMBOL(computeUInt32SizeNoTag)
#endif

#ifndef computeEnumSizeNoTag
#define computeEnumSizeNoTag __NS_SYMBOL(computeEnumSizeNoTag)
#endif

#ifndef computeSFixed32SizeNoTag
#define computeSFixed32SizeNoTag __NS_SYMBOL(computeSFixed32SizeNoTag)
#endif

#ifndef computeSFixed64SizeNoTag
#define computeSFixed64SizeNoTag __NS_SYMBOL(computeSFixed64SizeNoTag)
#endif

#ifndef computeSInt32SizeNoTag
#define computeSInt32SizeNoTag __NS_SYMBOL(computeSInt32SizeNoTag)
#endif

#ifndef computeSInt64SizeNoTag
#define computeSInt64SizeNoTag __NS_SYMBOL(computeSInt64SizeNoTag)
#endif

#ifndef computeDoubleSize
#define computeDoubleSize __NS_SYMBOL(computeDoubleSize)
#endif

#ifndef computeTagSize
#define computeTagSize __NS_SYMBOL(computeTagSize)
#endif

#ifndef computeFloatSize
#define computeFloatSize __NS_SYMBOL(computeFloatSize)
#endif

#ifndef computeUInt64Size
#define computeUInt64Size __NS_SYMBOL(computeUInt64Size)
#endif

#ifndef computeInt64Size
#define computeInt64Size __NS_SYMBOL(computeInt64Size)
#endif

#ifndef computeInt32Size
#define computeInt32Size __NS_SYMBOL(computeInt32Size)
#endif

#ifndef computeFixed64Size
#define computeFixed64Size __NS_SYMBOL(computeFixed64Size)
#endif

#ifndef computeFixed32Size
#define computeFixed32Size __NS_SYMBOL(computeFixed32Size)
#endif

#ifndef computeBoolSize
#define computeBoolSize __NS_SYMBOL(computeBoolSize)
#endif

#ifndef computeStringSize
#define computeStringSize __NS_SYMBOL(computeStringSize)
#endif

#ifndef computeGroupSize
#define computeGroupSize __NS_SYMBOL(computeGroupSize)
#endif

#ifndef computeUnknownGroupSize
#define computeUnknownGroupSize __NS_SYMBOL(computeUnknownGroupSize)
#endif

#ifndef computeMessageSize
#define computeMessageSize __NS_SYMBOL(computeMessageSize)
#endif

#ifndef computeDataSize
#define computeDataSize __NS_SYMBOL(computeDataSize)
#endif

#ifndef computeUInt32Size
#define computeUInt32Size __NS_SYMBOL(computeUInt32Size)
#endif

#ifndef computeEnumSize
#define computeEnumSize __NS_SYMBOL(computeEnumSize)
#endif

#ifndef computeSFixed32Size
#define computeSFixed32Size __NS_SYMBOL(computeSFixed32Size)
#endif

#ifndef computeSFixed64Size
#define computeSFixed64Size __NS_SYMBOL(computeSFixed64Size)
#endif

#ifndef computeSInt32Size
#define computeSInt32Size __NS_SYMBOL(computeSInt32Size)
#endif

#ifndef computeSInt64Size
#define computeSInt64Size __NS_SYMBOL(computeSInt64Size)
#endif

#ifndef computeMessageSetExtensionSize
#define computeMessageSetExtensionSize __NS_SYMBOL(computeMessageSetExtensionSize)
#endif

#ifndef computeRawMessageSetExtensionSize
#define computeRawMessageSetExtensionSize __NS_SYMBOL(computeRawMessageSetExtensionSize)
#endif

#ifndef allZeroes
#define allZeroes __NS_SYMBOL(allZeroes)
#endif

#ifndef isOctal
#define isOctal __NS_SYMBOL(isOctal)
#endif

#ifndef isDecimal
#define isDecimal __NS_SYMBOL(isDecimal)
#endif

#ifndef isHex
#define isHex __NS_SYMBOL(isHex)
#endif

#ifndef digitValue
#define digitValue __NS_SYMBOL(digitValue)
#endif

#ifndef PBWireFormatMakeTag
#define PBWireFormatMakeTag __NS_SYMBOL(PBWireFormatMakeTag)
#endif

#ifndef PBWireFormatGetTagWireType
#define PBWireFormatGetTagWireType __NS_SYMBOL(PBWireFormatGetTagWireType)
#endif

#ifndef PBWireFormatGetTagFieldNumber
#define PBWireFormatGetTagFieldNumber __NS_SYMBOL(PBWireFormatGetTagFieldNumber)
#endif

#ifndef convertFloat64ToInt64
#define convertFloat64ToInt64 __NS_SYMBOL(convertFloat64ToInt64)
#endif

#ifndef convertFloat32ToInt32
#define convertFloat32ToInt32 __NS_SYMBOL(convertFloat32ToInt32)
#endif

#ifndef convertInt64ToFloat64
#define convertInt64ToFloat64 __NS_SYMBOL(convertInt64ToFloat64)
#endif

#ifndef convertInt32ToFloat32
#define convertInt32ToFloat32 __NS_SYMBOL(convertInt32ToFloat32)
#endif

#ifndef convertInt64ToUInt64
#define convertInt64ToUInt64 __NS_SYMBOL(convertInt64ToUInt64)
#endif

#ifndef convertUInt64ToInt64
#define convertUInt64ToInt64 __NS_SYMBOL(convertUInt64ToInt64)
#endif

#ifndef convertInt32ToUInt32
#define convertInt32ToUInt32 __NS_SYMBOL(convertInt32ToUInt32)
#endif

#ifndef convertUInt32ToInt32
#define convertUInt32ToInt32 __NS_SYMBOL(convertUInt32ToInt32)
#endif

#ifndef logicalRightShift32
#define logicalRightShift32 __NS_SYMBOL(logicalRightShift32)
#endif

#ifndef logicalRightShift64
#define logicalRightShift64 __NS_SYMBOL(logicalRightShift64)
#endif

// Externs
#ifndef DEFAULT_RECURSION_LIMIT
#define DEFAULT_RECURSION_LIMIT __NS_SYMBOL(DEFAULT_RECURSION_LIMIT)
#endif

#ifndef DEFAULT_SIZE_LIMIT
#define DEFAULT_SIZE_LIMIT __NS_SYMBOL(DEFAULT_SIZE_LIMIT)
#endif

#ifndef BUFFER_SIZE
#define BUFFER_SIZE __NS_SYMBOL(BUFFER_SIZE)
#endif

#ifndef DEFAULT_BUFFER_SIZE
#define DEFAULT_BUFFER_SIZE __NS_SYMBOL(DEFAULT_BUFFER_SIZE)
#endif

#ifndef LITTLE_ENDIAN_32_SIZE
#define LITTLE_ENDIAN_32_SIZE __NS_SYMBOL(LITTLE_ENDIAN_32_SIZE)
#endif

#ifndef LITTLE_ENDIAN_64_SIZE
#define LITTLE_ENDIAN_64_SIZE __NS_SYMBOL(LITTLE_ENDIAN_64_SIZE)
#endif

#ifndef ProtocolBuffersVersionString
#define ProtocolBuffersVersionString __NS_SYMBOL(ProtocolBuffersVersionString)
#endif

#ifndef ProtocolBuffersVersionNumber
#define ProtocolBuffersVersionNumber __NS_SYMBOL(ProtocolBuffersVersionNumber)
#endif

