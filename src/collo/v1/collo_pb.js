// @generated by protoc-gen-es v1.3.0 with parameter "target=js"
// @generated from file collo/v1/collo.proto (package collo.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3, Timestamp } from "@bufbuild/protobuf";

/**
 * @generated from message collo.v1.ColloStreamRequest
 */
export const ColloStreamRequest = proto3.makeMessageType(
  "collo.v1.ColloStreamRequest",
  () => [
    { no: 1, name: "keyword", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "from", kind: "message", T: Timestamp },
    { no: 3, name: "until", kind: "message", T: Timestamp },
  ],
);

/**
 * @generated from message collo.v1.ColloStreamResponse
 */
export const ColloStreamResponse = proto3.makeMessageType(
  "collo.v1.ColloStreamResponse",
  () => [
    { no: 1, name: "words", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "scalar", T: 9 /* ScalarType.STRING */} },
    { no: 2, name: "pairs", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ],
);

