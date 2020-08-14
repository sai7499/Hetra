export interface Categories {
  code?: number;
  desc?: string;
  displayName?: string;
  subcategories?: SubCategories[];
}

export interface SubCategories {
  code?: number;
  desc?: string;
  displayName?: string;
  docList?: DocList[];
}

export interface DocList {
  code?: number;
  desc?: string;
  displayName?: string;
}

export interface DocRequest {
  docTp?: string;
  docSbCtgry?: string;
  docNm?: string;
  docCtgryCd?: number;
  docCatg?: string;
  docTypCd?: number;
  flLoc?: string;
  docCmnts?: string;
  bsPyld?: string;
  docSbCtgryCd?: number;
  docRefId?: {
    idTp?: string;
    id?: number;
  }[];
  issueDate?: string;
  expiryDate?: string;
  associatedId?: string;
  associatedWith?: string;
  documentNumber?: string;
  documentId?: number;
  formArrayIndex?: number;
  docSize?: number;
  docsType?: string;
  docsTypeForString?: string;
  deferralDate?: string;
  isDeferred?: string;
}

export interface DocumentDetails {
  documentId?: number;
  documentType?: string;
  documentName?: string;
  documentNumber?: string;
  dmsDocumentId?: string;
  categoryCode?: string;
  subCategoryCode?: string;
  issuedAt?: string;
  issueDate?: string | Date;
  expiryDate?: string | Date;
  associatedId?: string;
  associatedWith?: string;
  formArrayIndex?: number;
  imageUrl?: string;
  docsTypeForString?: string;
  deferralDate?: string;
  isDeferred?: string;
}
