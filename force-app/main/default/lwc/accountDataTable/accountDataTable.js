import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountDataTableController.getAccounts';

export default class AccountDataTable extends LightningElement {
    @track allData = [];
    @track data = [];
    @track paginatedData = [];
    @track searchTerm = '';
    @track sortedBy = 'Name';
    @track sortDirection = 'asc';
    @track currentPage = 1;
    @track pageSize = 10;
    @track totalRecords = 0;
    @track totalPages = 0;
    @track isLoading = true;
    @track error;

    // Component lifecycle
    connectedCallback() {
        console.log('AccountDataTable: Component connected', {
            componentName: 'AccountDataTable',
            initialState: {
                searchTerm: this.searchTerm,
                sortedBy: this.sortedBy,
                sortDirection: this.sortDirection,
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                isLoading: this.isLoading
            }
        });
    }

    disconnectedCallback() {
        console.log('AccountDataTable: Component disconnected');
    }

    // Column definitions
    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text', sortable: true },
        { label: 'Type', fieldName: 'Type', type: 'text', sortable: true },
        { label: 'Industry', fieldName: 'Industry', type: 'text', sortable: true },
        { label: 'Phone', fieldName: 'Phone', type: 'phone', sortable: true },
        { label: 'Website', fieldName: 'Website', type: 'url', sortable: true },
        { label: 'Billing City', fieldName: 'BillingCity', type: 'text', sortable: true },
        { label: 'Billing State', fieldName: 'BillingState', type: 'text', sortable: true },
        { label: 'Billing Country', fieldName: 'BillingCountry', type: 'text', sortable: true },
        { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency', sortable: true },
        { label: 'Employees', fieldName: 'NumberOfEmployees', type: 'number', sortable: true },
        { label: 'Created Date', fieldName: 'CreatedDate', type: 'date', sortable: true }
    ];

    // Pagination options
    pageSizeOptions = [
        { label: '5', value: '5' },
        { label: '10', value: '10' },
        { label: '25', value: '25' },
        { label: '50', value: '50' },
        { label: '100', value: '100' }
    ];

    // Wire methods to get data
    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        console.log('AccountDataTable: Wire method called');
        this.isLoading = true;
        if (data) {
            console.log('AccountDataTable: Data received successfully', {
                recordCount: data.length,
                data: data
            });
            this.allData = [...data];
            this.processData();
            this.error = undefined;
        } else if (error) {
            console.error('AccountDataTable: Error loading data', error);
            this.error = error.body?.message || 'Unknown error occurred';
            this.allData = [];
            this.data = [];
            this.paginatedData = [];
        }
        this.isLoading = false;
        console.log('AccountDataTable: Loading completed', {
            isLoading: this.isLoading,
            hasError: !!this.error,
            dataCount: this.allData.length
        });
    }



    // Process data with search and sorting
    processData() {
        console.log('AccountDataTable: Processing data started', {
            originalDataCount: this.allData.length,
            searchTerm: this.searchTerm,
            sortedBy: this.sortedBy,
            sortDirection: this.sortDirection,
            currentPage: this.currentPage,
            pageSize: this.pageSize
        });

        let processedData = [...this.allData];

        // Apply search filter
        if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            console.log('AccountDataTable: Applying search filter', { searchTerm: this.searchTerm });
            
            processedData = processedData.filter(record => {
                return Object.keys(record).some(key => {
                    if (key === 'Id') return false; // Skip Id field
                    const value = record[key];
                    return value && value.toString().toLowerCase().includes(searchLower);
                });
            });
            
            console.log('AccountDataTable: Search filter applied', {
                originalCount: this.allData.length,
                filteredCount: processedData.length,
                searchTerm: this.searchTerm
            });
        }

        // Apply sorting
        if (this.sortedBy) {
            console.log('AccountDataTable: Applying sorting', {
                field: this.sortedBy,
                direction: this.sortDirection,
                recordCount: processedData.length
            });

            processedData.sort((a, b) => {
                let aVal = a[this.sortedBy];
                let bVal = b[this.sortedBy];

                // Handle null/undefined values - always sort them to the end
                if (aVal == null && bVal == null) return 0;
                if (aVal == null) return 1;
                if (bVal == null) return -1;

                // Get column type for proper sorting
                const column = this.columns.find(col => col.fieldName === this.sortedBy);
                const columnType = column ? column.type : 'text';

                // Handle different data types
                switch (columnType) {
                    case 'date':
                        aVal = new Date(aVal);
                        bVal = new Date(bVal);
                        break;
                    case 'currency':
                    case 'number':
                        aVal = parseFloat(aVal) || 0;
                        bVal = parseFloat(bVal) || 0;
                        break;
                    case 'text':
                    case 'phone':
                    case 'url':
                    default:
                        aVal = aVal.toString().toLowerCase();
                        bVal = bVal.toString().toLowerCase();
                        break;
                }

                // Compare values
                let result = 0;
                if (aVal > bVal) result = 1;
                else if (aVal < bVal) result = -1;

                // Apply sort direction
                return this.sortDirection === 'asc' ? result : -result;
            });

            console.log('AccountDataTable: Sorting applied', {
                field: this.sortedBy,
                direction: this.sortDirection,
                columnType: this.columns.find(col => col.fieldName === this.sortedBy)?.type
            });
        }

        this.data = processedData;
        this.totalRecords = processedData.length;
        this.calculatePagination();
        this.updatePaginatedData();

        console.log('AccountDataTable: Data processing completed', {
            totalRecords: this.totalRecords,
            totalPages: this.totalPages,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            paginatedDataCount: this.paginatedData.length
        });
    }

    // Calculate pagination info
    calculatePagination() {
        const oldTotalPages = this.totalPages;
        const oldCurrentPage = this.currentPage;
        
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
        }

        console.log('AccountDataTable: Pagination calculated', {
            totalRecords: this.totalRecords,
            pageSize: this.pageSize,
            totalPages: this.totalPages,
            currentPage: this.currentPage,
            previousTotalPages: oldTotalPages,
            previousCurrentPage: oldCurrentPage
        });
    }

    // Update paginated data
    updatePaginatedData() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedData = this.data.slice(startIndex, endIndex);
        
        console.log('AccountDataTable: Paginated data updated', {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            startIndex: startIndex,
            endIndex: endIndex,
            paginatedDataCount: this.paginatedData.length,
            totalDataCount: this.data.length
        });
    }

    // Event handlers
    handleSearchChange(event) {
        const oldSearchTerm = this.searchTerm;
        this.searchTerm = event.target.value;
        this.currentPage = 1; // Reset to first page
        
        console.log('AccountDataTable: Search changed', {
            oldSearchTerm: oldSearchTerm,
            newSearchTerm: this.searchTerm,
            resetToPage: this.currentPage
        });
        
        this.processData();
    }

    handleSort(event) {
        const oldSortedBy = this.sortedBy;
        const oldSortDirection = this.sortDirection;
        
        this.sortedBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        
        console.log('AccountDataTable: Sort changed', {
            oldField: oldSortedBy,
            newField: this.sortedBy,
            oldDirection: oldSortDirection,
            newDirection: this.sortDirection
        });
        
        this.processData();
    }

    handlePageSizeChange(event) {
        const oldPageSize = this.pageSize;
        const oldCurrentPage = this.currentPage;
        
        this.pageSize = parseInt(event.detail.value);
        this.currentPage = 1; // Reset to first page
        
        console.log('AccountDataTable: Page size changed', {
            oldPageSize: oldPageSize,
            newPageSize: this.pageSize,
            oldCurrentPage: oldCurrentPage,
            newCurrentPage: this.currentPage
        });
        
        this.processData();
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            const oldPage = this.currentPage;
            this.currentPage--;
            
            console.log('AccountDataTable: Previous page clicked', {
                oldPage: oldPage,
                newPage: this.currentPage,
                totalPages: this.totalPages
            });
            
            this.updatePaginatedData();
        } else {
            console.log('AccountDataTable: Previous page clicked but already on first page');
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            const oldPage = this.currentPage;
            this.currentPage++;
            
            console.log('AccountDataTable: Next page clicked', {
                oldPage: oldPage,
                newPage: this.currentPage,
                totalPages: this.totalPages
            });
            
            this.updatePaginatedData();
        } else {
            console.log('AccountDataTable: Next page clicked but already on last page');
        }
    }

    // Computed properties
    get isFirstPage() {
        const result = this.currentPage <= 1;
        console.log('AccountDataTable: isFirstPage computed', {
            currentPage: this.currentPage,
            isFirstPage: result
        });
        return result;
    }

    get isLastPage() {
        const result = this.currentPage >= this.totalPages;
        console.log('AccountDataTable: isLastPage computed', {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            isLastPage: result
        });
        return result;
    }

    get startRecord() {
        const result = this.totalRecords === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
        console.log('AccountDataTable: startRecord computed', {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            totalRecords: this.totalRecords,
            startRecord: result
        });
        return result;
    }

    get endRecord() {
        const end = this.currentPage * this.pageSize;
        const result = end > this.totalRecords ? this.totalRecords : end;
        console.log('AccountDataTable: endRecord computed', {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            totalRecords: this.totalRecords,
            calculatedEnd: end,
            endRecord: result
        });
        return result;
    }
}
