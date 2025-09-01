public with sharing class AccountDataTableController {
  @AuraEnabled(cacheable=true)
  public static List<Account> getAccounts() {
    try {
      // Get all accounts with required fields
      return [
        SELECT
          Id,
          Name,
          Type,
          Industry,
          Phone,
          Website,
          BillingState,
          BillingCountry,
          AnnualRevenue,
          NumberOfEmployees,
          CreatedDate
        FROM Account
        ORDER BY Name ASC
      ];
    } catch (Exception e) {
      throw new AuraHandledException(
        'Error retrieving accounts: ert ' + e.getMessage()
      );
    }
  }
}
