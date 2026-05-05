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
      accountsUrl: 'http://localhost:8080/accounts',
      accountNamesUrl: 'http://localhost:8080/accountNames',
    },

    client: {
      clientsUrl: 'http://localhost:8080/clients',
      clientNamesUrl: 'http://localhost:8080/clientNames',
      createClientUrl: "http://localhost:8080/clients",
      deleteClient: 'http://localhost:8080/clients/',
    },

    externalEntity: {
      deleteExternalEntity: 'http://localhost:8080/externalEntities/',
      externalEntitiesUrl: 'http://localhost:8080/externalEntities',
    },

    origin: {
      originNamesUrl: "http://localhost:8080/originNames",
      originsGroupedUrl: "http://localhost:8080/originsGrouped",
    },

    supplier: {
      suppliersUrl: 'http://localhost:8080/suppliers',
      supplierNamesUrl: 'http://localhost:8080/supplierNames',
    }
  },

  construction: {
    construction: {
      budgetSubItemsForConstruction: "http://localhost:8080/constructions/budgetSubItems/",
      constructionsUrl: "http://localhost:8080/constructions",
      markAsFavouriteUrl: "http://localhost:8080/constructions/favourite/",
      constructionDetailsUrl: "http://localhost:8080/constructions/details/",
      constructionNamesUrl: "http://localhost:8080/constructionNames",
      constructionNamesForClientUrl: "http://localhost:8080/constructionNames/",
      constructionsOngoingUrl: "http://localhost:8080/constructionsOngoing",
    },

    costEmployeeHour: {
      deleteCostEmployeeHoursUrl: "http://localhost:8080/costEmployeeHours/",
      costEmployeeHoursUrl: "http://localhost:8080/costEmployeeHours",
      createCostEmployeeHoursUrl: "http://localhost:8080/costEmployeeHours",
    },

    externalService: {
      externalServicesUrl: "http://localhost:8080/externalServices",
    },

    vehicleCost: {
      deleteVehicleCostUrL: "http://localhost:8080/vehicleCosts/",
      vehicleCostsUrL: "http://localhost:8080/vehicleCosts"
    }
  },

  dashboard: {
    dashboardDataUrl: 'http://localhost:8080/dashboard'
  },

  inventory: {
    article: {
      articlesUrl: "http://localhost:8080/articles",
      stockArticles: "http://localhost:8080/articles/stock",
      issuedArticlesUrl: "http://localhost:8080/issuedArticles"
    },

    equipment: {

    },

    tool: {
      
    },

    vehicle: {
      deleteVehicleUrl: "http://localhost:8080/vehicles/",
      vehiclesUrl: "http://localhost:8080/vehicles",
      activeVehicleNamesUrl: "http://localhost:8080/activeVehicleNames",
      updateVehicleStatus: "http://localhost:8080/vehicles/status/",
    }
  },

  people: {
    absence: {
      absencesUrl: 'http://localhost:8080/absences',
      deleteAbsence: 'http://localhost:8080/absences/',
    },
    
    employee: {
      createEmployeeUrl: "http://localhost:8080/employees",
      employeesUrl: "http://localhost:8080/employees?",
      employeeNamesUrl: "http://localhost:8080/employeeNames",
      employeeNamesInCostEmployeeHourForConstructionUrl: "http://localhost:8080/employeeNamesInCostEmployeeHourForConstruction/",
      employeeNamesNotInCostEmployeeHourForConstructionUrl: "http://localhost:8080/employeeNamesNotInCostEmployeeHourForConstruction/"
    },

    timemap: {

    },

    worklog: {
      workLogsUrl: 'http://localhost:8080/worklogs',
      timemapUrl: 'http://localhost:8080/worklogs/summary/'
    }
  },

  queries: {
    accountLogs: {
      accountLogsUrl: 'http://localhost:8080/accountLogs/',
      bankAccountNamesUrl: 'http://localhost:8080/bankAccountNames',
    },

    cashLogs: {
      cashAccountLogsUrl: 'http://localhost:8080/cashAccountLogs',
    },

    currentAccountLogs: {
      currentAccountLogsUrl: "http://localhost:8080/currentAccountLogs/",
    },

    debts: {
      expensesInDebtUrl: "http://localhost:8080/expensesInDebt",
    }
  },

  transactions: {
    expense: {
      expensesUrl: "http://localhost:8080/expenses",
    },

    movement: {
      movementsUrl: "http://localhost:8080/movements",
    },

    payment: {
      paymentUrl: "http://localhost:8080/payments",
    },

    revenue: {
      revenuesUrl: "http://localhost:8080/revenues"
    },

    sale: {
      deleteSale: 'http://localhost:8080/sales/',
      salesUrl: "http://localhost:8080/sales"
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
