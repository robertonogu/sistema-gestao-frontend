// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HttpHeaders } from "@angular/common/http";

export const environment = {
  production: false,

  httpOptions: {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Accept': 'application/json' 
    }) 
  },

  company: {
    account: {
      accountsUrl: 'https://sistema-gestao-api.railway.internal/accounts',
      accountNamesUrl: 'https://sistema-gestao-api.railway.internal/accountNames',
    },

    client: {
      clientsUrl: 'https://sistema-gestao-api.railway.internal/clients',
      clientNamesUrl: 'https://sistema-gestao-api.railway.internal/clientNames',
      createClientUrl: "https://sistema-gestao-api.railway.internal/clients",
      deleteClient: 'https://sistema-gestao-api.railway.internal/clients/',
    },

    externalEntity: {
      deleteExternalEntity: 'https://sistema-gestao-api.railway.internal/externalEntities/',
      externalEntitiesUrl: 'https://sistema-gestao-api.railway.internal/externalEntities',
    },

    origin: {
      originNamesUrl: "https://sistema-gestao-api.railway.internal/originNames",
      originsGroupedUrl: "https://sistema-gestao-api.railway.internal/originsGrouped",
    },

    supplier: {
      suppliersUrl: 'https://sistema-gestao-api.railway.internal/suppliers',
      supplierNamesUrl: 'https://sistema-gestao-api.railway.internal/supplierNames',
    }
  },

  construction: {
    construction: {
      budgetSubItemsForConstruction: "https://sistema-gestao-api.railway.internal/constructions/budgetSubItems/",
      constructionsUrl: "https://sistema-gestao-api.railway.internal/constructions",
      markAsFavouriteUrl: "https://sistema-gestao-api.railway.internal/constructions/favourite/",
      constructionDetailsUrl: "https://sistema-gestao-api.railway.internal/constructions/details/",
      constructionNamesUrl: "https://sistema-gestao-api.railway.internal/constructionNames",
      constructionNamesForClientUrl: "https://sistema-gestao-api.railway.internal/constructionNames/",
      constructionsOngoingUrl: "https://sistema-gestao-api.railway.internal/constructionsOngoing",
    },

    costEmployeeHour: {
      deleteCostEmployeeHoursUrl: "https://sistema-gestao-api.railway.internal/costEmployeeHours/",
      costEmployeeHoursUrl: "https://sistema-gestao-api.railway.internal/costEmployeeHours",
      createCostEmployeeHoursUrl: "https://sistema-gestao-api.railway.internal/costEmployeeHours",
    },

    externalService: {
      externalServicesUrl: "https://sistema-gestao-api.railway.internal/externalServices",
    },

    vehicleCost: {
      deleteVehicleCostUrL: "https://sistema-gestao-api.railway.internal/vehicleCosts/",
      vehicleCostsUrL: "https://sistema-gestao-api.railway.internal/vehicleCosts"
    }
  },

  dashboard: {
    dashboardDataUrl: 'https://sistema-gestao-api.railway.internal/dashboard'
  },

  inventory: {
    article: {
      articlesUrl: "https://sistema-gestao-api.railway.internal/articles",
      stockArticles: "https://sistema-gestao-api.railway.internal/articles/stock",
      issuedArticlesUrl: "https://sistema-gestao-api.railway.internal/issuedArticles"
    },

    equipment: {

    },

    tool: {
      
    },

    vehicle: {
      deleteVehicleUrl: "https://sistema-gestao-api.railway.internal/vehicles/",
      vehiclesUrl: "https://sistema-gestao-api.railway.internal/vehicles",
      activeVehicleNamesUrl: "https://sistema-gestao-api.railway.internal/activeVehicleNames",
      updateVehicleStatus: "https://sistema-gestao-api.railway.internal/vehicles/status/",
    }
  },

  people: {
    absence: {
      absencesUrl: 'https://sistema-gestao-api.railway.internal/absences',
      deleteAbsence: 'https://sistema-gestao-api.railway.internal/absences/',
    },
    
    employee: {
      createEmployeeUrl: "https://sistema-gestao-api.railway.internal/employees",
      employeesUrl: "https://sistema-gestao-api.railway.internal/employees?",
      employeeNamesUrl: "https://sistema-gestao-api.railway.internal/employeeNames",
      employeeNamesInCostEmployeeHourForConstructionUrl: "https://sistema-gestao-api.railway.internal/employeeNamesInCostEmployeeHourForConstruction/",
      employeeNamesNotInCostEmployeeHourForConstructionUrl: "https://sistema-gestao-api.railway.internal/employeeNamesNotInCostEmployeeHourForConstruction/"
    },

    timemap: {

    },

    worklog: {
      workLogsUrl: 'https://sistema-gestao-api.railway.internal/worklogs',
      timemapUrl: 'https://sistema-gestao-api.railway.internal/worklogs/summary/'
    }
  },

  queries: {
    accountLogs: {
      accountLogsUrl: 'https://sistema-gestao-api.railway.internal/accountLogs/',
      bankAccountNamesUrl: 'https://sistema-gestao-api.railway.internal/bankAccountNames',
    },

    cashLogs: {
      cashAccountLogsUrl: 'https://sistema-gestao-api.railway.internal/cashAccountLogs',
    },

    currentAccountLogs: {
      currentAccountLogsUrl: "https://sistema-gestao-api.railway.internal/currentAccountLogs/",
    },

    debts: {
      expensesInDebtUrl: "https://sistema-gestao-api.railway.internal/expensesInDebt",
    }
  },

  transactions: {
    expense: {
      expensesUrl: "https://sistema-gestao-api.railway.internal/expenses",
    },

    movement: {
      movementsUrl: "https://sistema-gestao-api.railway.internal/movements",
    },

    payment: {
      paymentUrl: "https://sistema-gestao-api.railway.internal/payments",
    },

    revenue: {
      revenuesUrl: "https://sistema-gestao-api.railway.internal/revenues"
    },

    sale: {
      deleteSale: 'https://sistema-gestao-api.railway.internal/sales/',
      salesUrl: "https://sistema-gestao-api.railway.internal/sales"
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
