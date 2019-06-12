/**
 * The Attribute Type as defined in the RFCP 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.2
 */
export declare enum Type {
    /** Gets BeneficiaryId Type */
    BeneficiaryId = 1,
    /** Gets FloorId Type */
    FloorId = 2,
    /** Gets FloorRequestId Type */
    FloorRequestId = 3,
    /** Gets Priority Type */
    Priority = 4,
    /** Gets RequestStatus Type */
    RequestStatus = 5,
    /** Gets ErrorCode Type */
    ErrorCode = 6,
    /** Gets ErrorInfo Type */
    ErrorInfo = 7,
    /** Gets ParticipantProvidedInfo Type */
    ParticipantProvidedInfo = 8,
    /** Gets StatusInfo Type */
    StatusInfo = 9,
    /** Gets SupportedAttributes Type */
    SupportedAttributes = 10,
    /** Gets SupportedPrimitives Type */
    SupportedPrimitives = 11,
    /** Gets UserDisplayName Type */
    UserDisplayName = 12,
    /** Gets UserUri Type */
    UserUri = 13,
    /** Gets BeneficiaryInformation Type */
    BeneficiaryInformation = 14,
    /** Gets FloorRequestInformation Type */
    FloorRequestInformation = 15,
    /** Gets RequestedByInformation Type */
    RequestedByInformation = 16,
    /** Gets FloorRequestStatus Type */
    FloorRequestStatus = 17,
    /** Gets OverallRequestStatus Type */
    OverallRequestStatus = 18,
    Unknown19 = 19,
    Unknown20 = 20,
    /** Mandatory Attribute */
    Mandatory = 128,
    /** Encode Handler */
    EncodeHandler = 256
}
