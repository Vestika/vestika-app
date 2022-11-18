import {GrowthBook} from "@growthbook/growthbook";

export const growthbook = new GrowthBook({
    // enableDevMode: true allows you to use the Chrome DevTools Extension to test/debug.
    // enableDevMode: true,
    trackingCallback: (experiment, result) => {
        console.log({
            experimentId: experiment.key,
            variationId: result.variationId,
        });
    },
});

// Load feature definitions from API
const FEATURES_ENDPOINT
    = "https://cdn.growthbook.io/api/features/prod_FVT5kLi8bvLcCe97E6M1iUVzuZPvu20ErIObqjMzc";
fetch(FEATURES_ENDPOINT)
    .then(res => res.json())
    .then(json => {
        growthbook.setFeatures(json.features);
    })
    .catch(() => {
        console.log("Failed to fetch feature definitions from GrowthBook");
    });