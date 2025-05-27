/** @format */

// 1 ton =      1,000 kg  =    1,000,000,000 mg
// 1 kilogram = 1,000  g  =        1,000,000 mg
// 1 gram =                            1,000 mg
// 1 milligram =                           1 mg

// {ton:1, kilogram:1, gram:1, milligram:1} = 1 001 001 001 mg

interface Stock {
    tons: number;
    kilograms: number;
    grams: number;
    milligrams: number;
}

function convertStockToMilligrams(stock: Stock): number {
    const milligrams =
        stock.tons * 1000000000 +
        stock.kilograms * 1000000 +
        stock.grams * 1000 +
        stock.milligrams;
    return milligrams;
}

function convertMilligramsToStock(milligrams: number): Stock {
    const tons = Math.floor(milligrams / 1000000000);
    const kilograms = Math.floor((milligrams % 1000000000) / 1000000);
    const grams = Math.floor((milligrams % 1000000) / 1000);
    const milligramsLeft = milligrams % 1000;
    return { tons, kilograms, grams, milligrams: milligramsLeft };
}

function purchaseStock(initialStock: Stock, buyStock: Stock) {
    const initialStockInMilligrams: number =
        convertStockToMilligrams(initialStock);
    const buyStockInMilligrams = convertStockToMilligrams(buyStock);

    const updatedStockInMilligrams =
        initialStockInMilligrams + buyStockInMilligrams;

    const updatedStock: Stock = convertMilligramsToStock(
        updatedStockInMilligrams
    );
    return updatedStock;
}

function sellStock(initialStock: Stock, sellStock: Stock) {
    const initialStockInMilligrams: number =
        convertStockToMilligrams(initialStock);
    const sellStockInMilligrams: number = convertStockToMilligrams(sellStock);

    const updatedStockInMilligrams: number =
        initialStockInMilligrams - sellStockInMilligrams;

    const updatedStock: Stock = convertMilligramsToStock(
        updatedStockInMilligrams
    );
    return updatedStock;
}

function updateStock(
    initialStock: Stock,
    exhcangeStock: Stock,
    action: "sell" | "purchase"
) {
    if (action === "sell") {
        return sellStock(initialStock, exhcangeStock);
    } else {
        return purchaseStock(initialStock, exhcangeStock);
    }
}

function main() {
    let initialStock = { tons: 1, kilograms: 0, grams: 0, milligrams: 0 };
    const sellStock = { tons: 0, kilograms: 0, grams: 1, milligrams: 0 };
    const buyStock = { tons: 0, kilograms: 0, grams: 1001, milligrams: 0 };

    //  sell
    initialStock = updateStock(initialStock, sellStock, "sell");
    console.log("stock after sell:-", initialStock);

    //  purchase
    initialStock = updateStock(initialStock, buyStock, "purchase");
    console.log("stock after buy:-", initialStock);

    return 0;
}

main();
