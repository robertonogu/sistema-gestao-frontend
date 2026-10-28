import { CategoryType } from './enum/categoryType';
import { SubCategoryType } from './enum/subCategoryType';

// Categorias de despesa e as subcategorias que cada uma tem, pela ordem em que aparecem.
// Fonte única: usada no formulário de despesas e na página "Categorias de Despesa".
export const EXPENSE_CATEGORIES: { [category: string]: SubCategoryType[] } = {
  [CategoryType.BANK]: [
    SubCategoryType.MAINTENANCE_COMMISSIONS, SubCategoryType.FEES, SubCategoryType.COMMISSIONS,
    SubCategoryType.CREDIT, SubCategoryType.CARD_COMMISSIONS, SubCategoryType.LOAN_INTEREST,
    SubCategoryType.OTHER_INTEREST, SubCategoryType.BANK_GUARANTEES, SubCategoryType.FINANCING_CHARGES,
    SubCategoryType.STAMP_DUTY, SubCategoryType.BANK_EXPENSES
  ],
  [CategoryType.TAXES]: [
    SubCategoryType.IVA, SubCategoryType.IRC, SubCategoryType.IES, SubCategoryType.FONT_RETENTION,
    SubCategoryType.IMI, SubCategoryType.FINES_PENALTIES, SubCategoryType.LATE_PAYMENT_INTEREST,
    SubCategoryType.LEGAL_COSTS, SubCategoryType.OTHER_TAXES
  ],
  [CategoryType.PEOPLE]: [
    SubCategoryType.SALARIES, SubCategoryType.SOCIAL_SECURITY_CONTRIBUTIONS, SubCategoryType.IRS,
    SubCategoryType.SAFETY, SubCategoryType.MEALS, SubCategoryType.WORK_ACCIDENT_INSURANCE,
    SubCategoryType.OTHER_INSURANCES, SubCategoryType.PROFESSIONAL_TRAINING, SubCategoryType.PERSONAL_PROTECTIVE_EQUIPMENT,
    SubCategoryType.OCCUPATIONAL_HEALTH, SubCategoryType.EMPLOYEE_TRAVEL, SubCategoryType.OTHER_PEOPLE_EXPENSES
  ],
  [CategoryType.OPERATION]: [
    SubCategoryType.FACILITY_RENT, SubCategoryType.ELECTRICITY, SubCategoryType.WATER, SubCategoryType.GAS, SubCategoryType.COMMUNICATIONS,
    SubCategoryType.OFFICE_SUPPLIES, SubCategoryType.OFFICE_EQUIPMENT_REPAIR,
    SubCategoryType.CLOUD_STORAGE, SubCategoryType.SOFTWARE, SubCategoryType.ACCOUNTING_SERVICES, SubCategoryType.LEGAL_SERVICES,
    SubCategoryType.CONSULTING_SERVICES, SubCategoryType.COMPANY_INSURANCE, SubCategoryType.CLEANING, SubCategoryType.FACILITY_SECURITY,
    SubCategoryType.FACILITY_MAINTENANCE, SubCategoryType.PROJECTS, SubCategoryType.DUES,
    SubCategoryType.LICENSES_PERMITS
  ],
  [CategoryType.COMMERCIAL]: [
    SubCategoryType.GRAPHIC_DESIGN, SubCategoryType.CLIENT_SUPPLIER_MEALS, SubCategoryType.ADVERTISING
  ],
  [CategoryType.VEHICLES]: [
    SubCategoryType.INSURANCE_VEHICLES, SubCategoryType.IUC, SubCategoryType.FUEL, SubCategoryType.MAINTENANCE_VEHICLES,
    SubCategoryType.INSPECTION, SubCategoryType.PARKING, SubCategoryType.TOLLS, SubCategoryType.TIRES,
    SubCategoryType.VEHICLE_LEASING, SubCategoryType.VEHICLE_RENTAL
  ],
  [CategoryType.EQUIPMENTS]: [
    SubCategoryType.EQUIPMENTS_PURCHASE, SubCategoryType.OFFICE_EQUIPMENT_ACQUISITION, SubCategoryType.EQUIPMENTS_MAINTENANCE,
    SubCategoryType.EQUIPMENT_CONSUMABLES,
    SubCategoryType.EQUIPMENT_RENTAL, SubCategoryType.EQUIPMENT_FUEL
  ],
  [CategoryType.TOOLS]: [
    SubCategoryType.TOOLS_PURCHASE, SubCategoryType.ELECTRIC_TOOLS_PURCHASE,
    SubCategoryType.MANUAL_TOOLS_CONSUMABLES, SubCategoryType.ELECTRIC_TOOLS_CONSUMABLES,
    SubCategoryType.TOOLS_MAINTENANCE
  ],
  [CategoryType.INVENTORY]: [
    SubCategoryType.WOOD, SubCategoryType.CONSTRUCTION, SubCategoryType.METALS, SubCategoryType.HARDWARE,
    SubCategoryType.FASTENING_SYSTEMS, SubCategoryType.ADHESIVES_SEALANTS, SubCategoryType.PAINTS_GLUES_VARNISHES,
    SubCategoryType.WATERPROOFING_INSULATION, SubCategoryType.PLUMBING, SubCategoryType.ELECTRICAL_MATERIALS,
    SubCategoryType.SITE_CONSUMABLES, SubCategoryType.GLASS_MIRRORS, SubCategoryType.CLADDING, SubCategoryType.STONES, SubCategoryType.OTHER_MATERIALS,
    SubCategoryType.REAL_ESTATE, SubCategoryType.INVENTORY_EXPENSES, SubCategoryType.INVENTORY_INVESTMENT
  ],
  [CategoryType.CONSTRUCTIONS]: [SubCategoryType.EXTERNAL_SERVICES],
};

// Aquisições que criam automaticamente um equipamento / uma ferramenta ao guardar a despesa
export const EQUIPMENT_PURCHASE_SUBCATEGORIES: SubCategoryType[] = [
  SubCategoryType.EQUIPMENTS_PURCHASE,
  SubCategoryType.OFFICE_EQUIPMENT_ACQUISITION,
];

export const TOOL_PURCHASE_SUBCATEGORIES: SubCategoryType[] = [
  SubCategoryType.TOOLS_PURCHASE,
  SubCategoryType.ELECTRIC_TOOLS_PURCHASE,
];
