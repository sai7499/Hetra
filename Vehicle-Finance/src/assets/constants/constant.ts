export abstract class Constant {
  public static readonly ENTITY_INDIVIDUAL_TYPE = 'INDIVENTTYP';
  public static readonly ENTITY_NON_INDIVIDUAL_TYPE = 'NONINDIVENTTYP';
  public static readonly CURRENT_ADDRESS = 'CURRADDADDTYP';
  public static readonly PERMANENT_ADDRESS = 'PERMADDADDTYP';
  public static readonly COMMUNICATION_ADDRESS = 'COMMADDADDTYP';
  public static readonly OFFICE_ADDRESS = 'OFFADDADDTYP';
  public static readonly REGISTER_ADDRESS = 'REGADDADDTYP';
  public static readonly PDTASKNAME = 'Personal Discussion';
  public static readonly VDTASKNAME = 'Vehicle Viability ';
  public static readonly ASSOCIATE_WITH_LEAD = '1';
  public static readonly ASSOCIATE_WITH_APPLICANT = '2';
  public static readonly ASSOCIATE_WIH_VEHICLE = '3';
  public static readonly PROFILE_IMAGE_SIZE = 87040; // 85 kb
  public static readonly PROFILE_ALLOWED_TYPES = 'png/jpg/jpeg';
  public static readonly OTHER_DOCUMENTS_SIZE = 2097152; // 2 mb
  public static readonly OTHER_DOCUMENTS_ALLOWED_TYPES =
    'png/jpg/jpeg/pdf/tiff/xlsx/xls/docx/doc/zip';
}
