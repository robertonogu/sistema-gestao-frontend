// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HttpHeaders } from "@angular/common/http";

export const environment = {
  production: true,

  httpOptions: {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Accept': 'application/json' 
    }) 
  },

  company: {
    account: {
      accountsUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/accounts',
      accountNamesUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/accountNames',
    },

    client: {
      clientsUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/clients',
      clientNamesUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/clientNames',
      createClientUrl: "https://sistema-gestao-api-production-9366.up.railway.app/clients",
      deleteClient: 'https://sistema-gestao-api-production-9366.up.railway.app/clients/',
    },

    externalEntity: {
      deleteExternalEntity: 'https://sistema-gestao-api-production-9366.up.railway.app/externalEntities/',
      externalEntitiesUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/externalEntities',
    },

    origin: {
      originNamesUrl: "https://sistema-gestao-api-production-9366.up.railway.app/originNames",
      originsGroupedUrl: "https://sistema-gestao-api-production-9366.up.railway.app/originsGrouped",
    },

    supplier: {
      suppliersUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/suppliers',
      supplierNamesUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/supplierNames',
    }
  },

  construction: {
    construction: {
      budgetSubItemsForConstruction: "https://sistema-gestao-api-production-9366.up.railway.app/constructions/budgetSubItems/",
      constructionsUrl: "https://sistema-gestao-api-production-9366.up.railway.app/constructions",
      markAsFavouriteUrl: "https://sistema-gestao-api-production-9366.up.railway.app/constructions/favourite/",
      constructionDetailsUrl: "https://sistema-gestao-api-production-9366.up.railway.app/constructions/details/",
      constructionNamesUrl: "https://sistema-gestao-api-production-9366.up.railway.app/constructionNames",
      constructionNamesForClientUrl: "https://sistema-gestao-api-production-9366.up.railway.app/constructionNames/",
      constructionsOngoingUrl: "https://sistema-gestao-api-production-9366.up.railway.app/constructionsOngoing",
    },

    costEmployeeHour: {
      deleteCostEmployeeHoursUrl: "https://sistema-gestao-api-production-9366.up.railway.app/costEmployeeHours/",
      costEmployeeHoursUrl: "https://sistema-gestao-api-production-9366.up.railway.app/costEmployeeHours",
      createCostEmployeeHoursUrl: "https://sistema-gestao-api-production-9366.up.railway.app/costEmployeeHours",
    },

    externalService: {
      externalServicesUrl: "https://sistema-gestao-api-production-9366.up.railway.app/externalServices",
    },

    vehicleCost: {
      deleteVehicleCostUrL: "https://sistema-gestao-api-production-9366.up.railway.app/vehicleCosts/",
      vehicleCostsUrL: "https://sistema-gestao-api-production-9366.up.railway.app/vehicleCosts"
    }
  },

  dashboard: {
    dashboardDataUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/dashboard'
  },

  inventory: {
    article: {
      articlesUrl: "https://sistema-gestao-api-production-9366.up.railway.app/articles",
      stockArticles: "https://sistema-gestao-api-production-9366.up.railway.app/articles/stock",
      issuedArticlesUrl: "https://sistema-gestao-api-production-9366.up.railway.app/issuedArticles"
    },

    equipment: {

    },

    tool: {
      
    },

    vehicle: {
      deleteVehicleUrl: "https://sistema-gestao-api-production-9366.up.railway.app/vehicles/",
      vehiclesUrl: "https://sistema-gestao-api-production-9366.up.railway.app/vehicles",
      activeVehicleNamesUrl: "https://sistema-gestao-api-production-9366.up.railway.app/activeVehicleNames",
      updateVehicleStatus: "https://sistema-gestao-api-production-9366.up.railway.app/vehicles/status/",
    }
  },

  people: {
    absence: {
      absencesUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/absences',
      deleteAbsence: 'https://sistema-gestao-api-production-9366.up.railway.app/absences/',
    },
    
    employee: {
      createEmployeeUrl: "https://sistema-gestao-api-production-9366.up.railway.app/employees",
      employeesUrl: "https://sistema-gestao-api-production-9366.up.railway.app/employees?",
      employeeNamesUrl: "https://sistema-gestao-api-production-9366.up.railway.app/employeeNames",
      employeeNamesInCostEmployeeHourForConstructionUrl: "https://sistema-gestao-api-production-9366.up.railway.app/employeeNamesInCostEmployeeHourForConstruction/",
      employeeNamesNotInCostEmployeeHourForConstructionUrl: "https://sistema-gestao-api-production-9366.up.railway.app/employeeNamesNotInCostEmployeeHourForConstruction/"
    },

    timemap: {

    },

    worklog: {
      workLogsUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/worklogs',
      timemapUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/worklogs/summary/'
    }
  },

  queries: {
    accountLogs: {
      accountLogsUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/accountLogs/',
      bankAccountNamesUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/bankAccountNames',
    },

    cashLogs: {
      cashAccountLogsUrl: 'https://sistema-gestao-api-production-9366.up.railway.app/cashAccountLogs',
    },

    currentAccountLogs: {
      currentAccountLogsUrl: "https://sistema-gestao-api-production-9366.up.railway.app/currentAccountLogs/",
    },

    debts: {
      expensesInDebtUrl: "https://sistema-gestao-api-production-9366.up.railway.app/expensesInDebt",
    }
  },

  transactions: {
    expense: {
      expensesUrl: "https://sistema-gestao-api-production-9366.up.railway.app/expenses",
    },

    movement: {
      movementsUrl: "https://sistema-gestao-api-production-9366.up.railway.app/movements",
    },

    payment: {
      paymentUrl: "https://sistema-gestao-api-production-9366.up.railway.app/payments",
    },

    revenue: {
      revenuesUrl: "https://sistema-gestao-api-production-9366.up.railway.app/revenues"
    },

    sale: {
      deleteSale: 'https://sistema-gestao-api-production-9366.up.railway.app/sales/',
      salesUrl: "https://sistema-gestao-api-production-9366.up.railway.app/sales"
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
