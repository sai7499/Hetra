export interface Item {
  key?: number | string;
  value?: string;
}

export interface LovList {
  LOVS?: LOVS;
}

export interface LOVS {
  applicantRelationshipWithLead?: Item[];
  customerCategory?: Item[];
  entityType?: Item[];
  occupation?: Item[];
  nationality?: Item[];
  preferredLanguage?: Item[];
  salutaion?: Item[];
}
