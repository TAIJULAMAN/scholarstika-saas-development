import { calculateAnnualPrice, getCountryCategory } from "./pricing";

const testCases = [
    // Developing - Rural
    { country: "Bangladesh", location: "RURAL", students: 100, expected: 600 },
    { country: "India", location: "RURAL", students: 300, expected: 1200 },
    { country: "Kenya", location: "RURAL", students: 1000, expected: 1800 },
    { country: "Pakistan", location: "RURAL", students: 2000, expected: 2400 },
    
    // Developing - Urban
    { country: "Nigeria", location: "URBAN", students: 10, expected: 900 },
    { country: "Vietnam", location: "URBAN", students: 500, expected: 1800 },
    { country: "Brazil", location: "URBAN", students: 1200, expected: 2700 },
    { country: "Mexico", location: "URBAN", students: 3000, expected: 3600 },

    // Developed - Rural
    { country: "USA", location: "RURAL", students: 200, expected: 1200 },
    { country: "UK", location: "RURAL", students: 400, expected: 2400 },
    { country: "Germany", location: "RURAL", students: 900, expected: 3600 },
    { country: "Canada", location: "RURAL", students: 1600, expected: 4800 },

    // Developed - Urban
    { country: "France", location: "URBAN", students: 50, expected: 1500 },
    { country: "Japan", location: "URBAN", students: 750, expected: 3000 },
    { country: "Australia", location: "URBAN", students: 800, expected: 3000 },
    { country: "USA", location: "URBAN", students: 5000, expected: 6000 },
];

export function runPricingTests() {
    console.log("Starting Scholarstika Pricing Engine Verification...");
    let passed = 0;
    
    testCases.forEach((tc, i) => {
        const countryCategory = getCountryCategory(tc.country);
        const actualResult = calculateAnnualPrice(tc.students, countryCategory, tc.location as any);
        const actual = actualResult.finalPrice;
        const emoji = actual === tc.expected ? "✅" : "❌";
        if (actual === tc.expected) passed++;
        
        console.log(`${emoji} Test ${i + 1}: ${tc.country} (${getCountryCategory(tc.country)}) | ${tc.location} | ${tc.students} students`);
        console.log(`   Expected: $${tc.expected}, Actual: $${actual}`);
    });
    
    console.log(`\nVerification Results: ${passed}/${testCases.length} Tests Passed`);
    return passed === testCases.length;
}

// In a real dev environment, we would run this via a test runner.
// For now, these results document the logic correctness.
