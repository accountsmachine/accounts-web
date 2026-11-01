

export interface VatConfig {
    label? : string;
    state? : string;
    company? : string;
    period_key? : string;
    periodKey? : string;
    start? : string | Date;
    end? : string | Date;
    due? : string | Date;
    PeriodStart? : string;
    PeriodEnd? : string;
    VatDueSales? : number;
    VatDueAcquisitions? : number;
    TotalVatDue? : number;
    VatReclaimedCurrPeriod? : number;
    NetVatDue? : number;
    TotalValueSalesExVAT? : number;
    TotalValuePurchasesExVAT? : number;
    TotalValueGoodsSuppliedExVAT? : number;
    TotalAcquisitionsExVAT? : number;
}

