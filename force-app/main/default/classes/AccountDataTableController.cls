public with sharing class AccountDataTableController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        try {
            // Get all accounts with required fields
            return [
                SELECT Id, Name, Type, Industry, Phone, Website, BillingCity, BillingState, BillingCountry, AnnualRevenue, NumberOfEmployees, CreatedDate 
                FROM Account 
                ORDER BY Name ASC
            ];
            
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving accounts: ' + e.getMessage());
        }
    }
    

}
