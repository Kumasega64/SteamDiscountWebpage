// async function that calls CheapShark API
async function steamdeals(low, high, minMetaScore, minimumReviewCount) {
    const url = new URL("https://www.cheapshark.com/api/1.0/deals");

    url.searchParams.set("lowerPrice", low);
    url.searchParams.set("upperPrice", high);
    url.searchParams.set("metacritic", minMetaScore);
    url.searchParams.set("minimumReviewCount", minimumReviewCount);
    url.searchParams.set("onSale", "1");
    url.searchParams.set("pageSize", "10");

    try {
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            console.error("Error fetching deals:", response.status);
            return [];
        }

        const deals = await response.json();
        return deals;

    } catch (error) {
        console.error("Fetch failed:", error);
        return [];
    }
}

//event
document.getElementById("searchDeals").addEventListener("click", async () => {
    const low = document.getElementById("lowest").value;
    const high = document.getElementById("highest").value;
    const meta = document.getElementById("metacritic").value;
    const reviewCount = document.getElementById("minimumReviewCount").value;

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "Loading...";

    const deals = await steamdeals(low, high, meta, reviewCount);

    resultsDiv.innerHTML = "";

    if (deals.length === 0) {
        resultsDiv.innerHTML = "No deals found.";
        return;
    }

    deals.forEach(deal => {
        const div = document.createElement("div");
        div.classList.add("deal");

        div.innerHTML = `
            <strong>${deal.title}</strong><br>
            Sale Price: $${deal.salePrice}<br>
            Metacritic Score: ${deal.metacriticScore || "N/A"}<br>
            <a href="https://store.steampowered.com/app/${deal.steamAppID}" target="_blank">View on Steam</a>
        `;
        resultsDiv.appendChild(div);
    });
});
