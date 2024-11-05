function showContent(section) {
    const contentArea = document.getElementById("contentArea");
    let content;

    switch (section) {
        case 'businessPartnerGroup':
            content = 'businessPartnerGroup.html'
            break;

        case 'assets':
            content = 'asset.html'
            break;

        case 'policies':
            content = 'policies.html'
            break;

        case 'contractDefinition':
            content = 'contractDefinition.html'
            break;

        case 'catalog':
            content = 'catalog.html'
            break;

        case 'contractNegotiation':
            content = 'contractNegotiation.html'
            break;

        case 'transfers':
            content = 'transfers.html'
            break;

        default:
            content = 'businessPartnerGroup.html';
            break;

    }

    fetch(content)
        .then(response => {
            if (!response.ok) {
                throw new Error("Page not found !")
            }
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html;
        })
}

document.addEventListener("DOMContentLoaded", function () {
    showContent('businessPartnerGroup')
});


async function queryCatalog() {
    payload = {
        "@context": {
            "edc": "https://w3id.org/edc/v0.0.1/ns/"
        },
        "@type": "CatalogRequest",
        "counterPartyAddress":"http://alice-controlplane:8084/api/v1/dsp",
        "protocol": "dataspace-protocol-http",
        "querySpec": {
            "offset": 0,
            "limit": 50
        }
    }

    try {
        const response = await fetch('http://localhost:8080/api/v1/catalog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const catalogs = await response.json()
            displayCatalog(catalogs)
        }
        else {
            console.error("Failed to fetch catalogs")
        }
    }
    catch (error) {
        console.log("Error:", error)
    }
}

function displayCatalog(catalogs) {
    const tableBody = document.getElementById('catalogDataTableBody');
    const tableContainer = document.getElementById('catalogTable')

    if (tableContainer.style.visibility === 'visible') {
        tableContainer.style.visibility = 'hidden';
        tableBody.innerHTML = "";
    }
    else {
        tableContainer.style.visibility = 'visible';
        tableBody.innerHTML = '';

        catalogs.forEach(catalog => {
            const row = document.createElement('tr');

            const offerIdCell = document.createElement('td');
            offerIdCell.textContent = catalog["dcat:dataset"]["odrl:hasPolicy"]["@id"];
            
            const bpgCell = document.createElement('td');
            bpgCell.textContent = catalog["dcat:dataset"]["odrl:hasPolicy"]["odrl:constraint"]["odrl:rightOperand"];


            row.appendChild(offerIdCell);
            row.appendChild(bpgCell);

            tableBody.appendChild(row);

        });
    }
}