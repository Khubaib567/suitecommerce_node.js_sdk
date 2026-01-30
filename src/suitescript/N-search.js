/**
 * Fake N/search module
 * Simulates SuiteScript search API
 */


class ResultSet {
    constructor(results) {
        this.results = results;
    }

    getRange({ start, end }) {
        return this.results.slice(start, end);
    }
}

module.exports = {
    Type: {
        EMPLOYEE: 'employee',
        CUSTOMER: 'customer'
    },

    create: ({ type, columns, filters }) => {
        // Simulated data
        const sampleResults = [
            { email: 'xyz@company.com', id: 1 },
            { email: 'someone@company.com', id: 2 }
        ];

        // Basic filter simulation
        let filtered = sampleResults;
        if (filters && filters.length === 3) {
            const [field, operator, value] = filters;
            filtered = sampleResults.filter(r => r[field] && r[field].includes(value));
        }


        return {
            run: () => new ResultSet(filtered)
        };
    }
};
