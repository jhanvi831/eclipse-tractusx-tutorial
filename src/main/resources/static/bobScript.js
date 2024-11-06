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

function showToast(message, isError) {
    const toast = document.getElementById("toast")
    toast.textContent = message
    toast.className = "toast show"
    if (isError) {
        toast.classList.add("error")
    }
    else {
        toast.classList.remove("error")
    }
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}

function resetText() {
    document.getElementById("custom-json").value = "";
}

async function queryCatalog() {
    payload = {
        "@context": {
            "edc": "https://w3id.org/edc/v0.0.1/ns/"
        },
        "@type": "CatalogRequest",
        "counterPartyAddress": "http://alice-controlplane:8084/api/v1/dsp",
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
            showToast('Catalog search successful', false);
            console.log(catalogs);
            displayCatalog(catalogs);
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

        const datasets = Array.isArray(catalogs["dcat:dataset"]) ? catalogs["dcat:dataset"] : [catalogs["dcat:dataset"]];

        datasets.forEach(dataset => {
            dataset["odrl:hasPolicy"].forEach(catalog => {

                const row = document.createElement('tr');

                const offerIdCell = document.createElement('td');
                offerIdCell.textContent = catalog["@id"];

                const bpgCell = document.createElement('td');
                bpgCell.textContent = catalog["odrl:permission"]["odrl:constraint"]["odrl:or"]["odrl:rightOperand"];

                row.appendChild(offerIdCell);
                row.appendChild(bpgCell);

                tableBody.appendChild(row);
            });

        });
    }
}

async function initateNegotiation() {
    const negotiationData = document.getElementById('custom-json').value;

    try {
        // validate json is correct
        const jsonData = JSON.parse(negotiationData);

        const response = await fetch('http://localhost:8080/api/v1/contract-negotiations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        });

        if (response.ok) {
            showToast("Negotiation initiated successfully", false)
        }
        else {
            showToast("Error occurred", true)
        }
    }
    catch (error) {
        console.log("Error:", error)
        showToast("Error occurred", true)
    }
}


async function fetchNegotiations() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/contract-negotiations/allNegotiations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const negotiations = await response.json()
            displayNegotiation(negotiations)
        }
        else {
            console.error("Failed to fetch Negotiations")
        }
    }
    catch (error) {
        console.log("Error:", error)
    }
}

function displayNegotiation(negotiations) {
    const tableBody = document.getElementById('negotiationDataTableBody');
    const tableContainer = document.getElementById('negotiationTable')

    if (tableContainer.style.visibility === 'visible') {
        tableContainer.style.visibility = 'hidden';
        tableBody.innerHTML = "";
    }
    else {
        tableContainer.style.visibility = 'visible';
        tableBody.innerHTML = '';

        negotiations.forEach(negotiation => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = negotiation['@id'];

            const typeCell = document.createElement('td');
            typeCell.textContent = negotiation["type"];

            const stateCell = document.createElement('td');
            stateCell.textContent = negotiation["state"]

            const counterPartyIdCell = document.createElement('td');
            counterPartyIdCell.textContent = negotiation["counterPartyId"]

            const contractAgreementIdCell = document.createElement('td');
            contractAgreementIdCell.textContent = negotiation["contractAgreementId"]

            const counterPartyAddressCell = document.createElement('td');
            counterPartyAddressCell.textContent = negotiation["counterPartyAddress"]

            row.appendChild(idCell);
            row.appendChild(typeCell);
            row.appendChild(stateCell);
            row.appendChild(counterPartyIdCell);
            row.appendChild(contractAgreementIdCell);
            row.appendChild(counterPartyAddressCell);

            tableBody.appendChild(row);

        });
    }
}


async function searchNegotiationById() {
    const negotiationId = document.getElementById("negotiation-id").value;

    if (!negotiationId) {
        showToast("Please enter Negotiation id", true);
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/v1/contract-negotiations/${negotiationId}`);

        if (response.ok) {
            const data = await response.json();
            document.getElementById("negotiationTable").innerHTML = "";
            addNegotiationToTable(
                data['@id'],
                data["type"],
                data["state"],
                data["counterPartyId"],
                data["contractAgreementId"],
                data["counterPartyAddress"]
            );
            showToast("Search completed, false");
        }
        else if (response.status === 404) {
            showToast("Negotiation Id not found", true);
        }
        else {
            showToast("Error occurred", true);
        }

    }
    catch (error) {
        console.error("Error:", error)
        showToast("Error occurred", true);
    }
}

async function addNegotiationToTable(negotiationId, type, state, counterPartyId, contractAgreementId, counterPartyAddress) {
    const tableBody = document.getElementById('negotiationDataTableBody')
    const tableContainer = document.getElementById('negotiationIdTable')
    tableContainer.style.visibility = 'visible';

    tableBody.innerHTML = "";

    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = negotiationId;

    const typeCell = document.createElement('td');
    typeCell.textContent = type;

    const stateCell = document.createElement('td');
    stateCell.textContent = state;

    const counterPartyIdCell = document.createElement('td');
    counterPartyIdCell.textContent = counterPartyId;

    const contractAgreementIdCell = document.createElement('td');
    contractAgreementIdCell.textContent = contractAgreementId;

    const counterPartyAddressCell = document.createElement('td');
    counterPartyAddressCell.textContent = counterPartyAddress;

    row.appendChild(idCell);
    row.appendChild(typeCell);
    row.appendChild(stateCell);
    row.appendChild(counterPartyIdCell);
    row.appendChild(contractAgreementIdCell);
    row.appendChild(counterPartyAddressCell);

    tableBody.appendChild(row)

    document.getElementById('contract-id').value = '';

}


async function initateTransfer() {
    const transferData = document.getElementById('custom-json').value;

    try {
        // validate json is correct
        const jsonData = JSON.parse(transferData);

        const response = await fetch('http://localhost:8080/api/v1/transfers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        });

        if (response.ok) {
            showToast("Transfer Process Initiated successfully", false)
        }
        else {
            showToast("Error occurred", true)
        }
    }
    catch (error) {
        console.log("Error:", error)
        showToast("Error occurred", true)
    }
}

async function fetchTransfers() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/transfers/allTransfers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const transfers = await response.json()
            displayTransfer(transfers)
        }
        else {
            console.error("Failed to fetch Transfers")
        }
    }
    catch (error) {
        console.log("Error:", error)
    }
}

function displayTransfer(transfers) {
    const tableBody = document.getElementById('transferDataTableBody');
    const tableContainer = document.getElementById('transferTable')

    if (tableContainer.style.visibility === 'visible') {
        tableContainer.style.visibility = 'hidden';
        tableBody.innerHTML = "";
    }
    else {
        tableContainer.style.visibility = 'visible';
        tableBody.innerHTML = '';

        transfers.forEach(transfer => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = transfer['@id'];

            const stateCell = document.createElement('td');
            stateCell.textContent = transfer["state"];

            const typeCell = document.createElement('td');
            typeCell.textContent = transfer['type'];

            const contractIdCell = document.createElement('td');
            contractIdCell.textContent = transfer['contractId'];

            row.appendChild(idCell);
            row.appendChild(stateCell);
            row.appendChild(typeCell);
            row.appendChild(contractIdCell);

            tableBody.appendChild(row);

        });
    }
}

async function searchTransferById() {
    const transferId = document.getElementById("transfer-id").value;

    if (!transferId) {
        showToast("Please enter Transfer id", true);
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/v1/transfers/${transferId}`);

        if (response.ok) {
            const data = await response.json();
            document.getElementById("transferTable").innerHTML = "";
            addTransferToTable(
                data['@id'],
                data["state"],
                data["type"],
                data["contractId"]
            );
            showToast("Search completed, false");
        }
        else if (response.status === 404) {
            showToast("Transfer Process id not found", true);
        }
        else {
            showToast("Error occurred", true);
        }

    }
    catch (error) {
        console.error("Error:", error)
        showToast("Error occurred", true);
    }
}

async function addTransferToTable(transferId, state, type, contractId) {
    const tableBody = document.getElementById('transferDataTableBody')
    const tableContainer = document.getElementById('transferIdTable')
    tableContainer.style.visibility = 'visible';

    tableBody.innerHTML = "";

    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = transferId;

    const stateCell = document.createElement('td');
    stateCell.textContent = state;

    const typeCell = document.createElement('td');
    typeCell.textContent = type;

    const contractIdCell = document.createElement('td');
    contractIdCell.textContent = contractId;

    row.appendChild(idCell);
    row.appendChild(stateCell);
    row.appendChild(typeCell);
    row.appendChild(contractIdCell);

    tableBody.appendChild(row)

    document.getElementById('transfer-id').value = '';

}
