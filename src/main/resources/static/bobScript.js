function showContent(section) {
    const contentArea = document.getElementById("contentArea");
    let content;

    switch (section) {
        case 'businessPartnerGroup':
            content = 'bobbusinessPartnerGroup.html'
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

function resetText(formToReset) {
    document.getElementById(formToReset).reset();
}


async function addBusinessPartnerGroup() {
    const policyBpn = document.getElementById("Policy-BPN").value;
    const businessPartnerGroup = document.getElementById(
      "Business-Partner-Group"
    ).value;
    const toast = document.getElementById("toast");
  
    if (!policyBpn || !businessPartnerGroup) {
      showToast("Please fill the required fields", true);
      return;
    }
  
    const payload = {
      "@context": { tx: "https://w3id.org/tractusx/v0.0.1/ns/" },
      "@id": policyBpn,
      "tx:groups": [businessPartnerGroup],
    };
  
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/bob/business-partner-groups",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      if (response.ok) {
        showToast("Successfully added", false);
        document.getElementById("dataTableBody").innerHTML = "";
        addToTable(policyBpn, businessPartnerGroup);
      } else if (response.status === 409) {
        showToast("BPN already exists, try updating", true);
      } else {
        showToast("Failed to add", true);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("An error occurred", true);
    }
  }
  
  async function updateBusinessPartnerGroup() {
    const updateBpn = document.getElementById("Update-Policy-BPN").value;
    const updateGroup = document.getElementById(
      "Update-Business-Partner-Group"
    ).value;
  
    if (!updateBpn || !updateGroup) {
      showToast("Enter the values", true);
      return;
    }
  
    const payload = {
      "@context": { tx: "https://w3id.org/tractusx/v0.0.1/ns/" },
      "@id": updateBpn,
      "tx:groups": [updateGroup],
    };
  
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/bob/business-partner-groups",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        showToast("Successfully updated Business Partner Group", false);
        document.getElementById("dataTableBody").innerHTML = "";
        addToTable(updateBpn, updateGroup);
      } else if (response.status === 404) {
        showToast("Invalid BPN Number", true);
      } else {
        showToast("Error occurred while updating", true);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Error occurred while updating", true);
    }
  }
  
  async function searchBusinessPartnerGroup() {
    const bpn = document.getElementById("search-bpn").value;
  
    if (!bpn) {
      showToast("Please enter BPN", true);
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/bob/business-partner-groups/${bpn}`
      );
  
      if (response.ok) {
        const data = await response.json();
        document.getElementById("dataTableBody").innerHTML = "";
        addToTable(data["@id"], data["tx:groups"]);
        showToast("Search completed", false);
      } else if (response.status === 404) {
        showToast("BPN does not exist", true);
      } else {
        showToast("Error occurred", true);
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Error occurred", true);
    }
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
            const policy =  Array.isArray(dataset["odrl:hasPolicy"]) ? dataset["odrl:hasPolicy"] : [dataset["odrl:hasPolicy"]];

            policy.forEach(catalog => {

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
    const offerId = document.getElementById('offerId-nego').value;
    const assetId = document.getElementById('assetId-negotiation').value;
    const businessPartner = document.getElementById('business-partner-nego').value;

    try {
        
        payload = {
            "@context": {
                "odrl": "http://www.w3.org/ns/odrl/2/"
            },
            "@type": "NegotiationInitiateRequestDto",
            "connectorAddress": "http://alice-controlplane:8084/api/v1/dsp",
            "protocol": "dataspace-protocol-http",
            "connectorId": "BPNL000000000001",
            "providerId": "BPNL000000000001",
            "offer": {
                "offerId": offerId,
                "assetId": assetId,
                "policy": {
                    "@type": "odrl:Set",
                    "odrl:permission": {
                        "odrl:target": assetId,
                        "odrl:action": {
                            "odrl:type": "USE"
                        },
                        "odrl:constraint": {
                    "odrl:or": {
                      "odrl:leftOperand": "https://w3id.org/tractusx/v0.0.1/ns/BusinessPartnerGroup",
                      "odrl:operator": {
                        "@id": "odrl:eq"
                      },
                      "odrl:rightOperand": businessPartner
                    }
                  }
                    },
                    "odrl:prohibition": [],
                    "odrl:obligation": [],
                    "odrl:target": assetId
                }
            }
        }

        const response = await fetch('http://localhost:8080/api/v1/contract-negotiations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
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
            showToast("Search completed", false);
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
    const agreementId = document.getElementById('agreementId-transfer').value;
    const assetId = document.getElementById('assetId-transfer').value;

    payload = {
        "@context": {
            "odrl": "http://www.w3.org/ns/odrl/2/"
        },
        "assetId": assetId,
        "connectorAddress": "http://alice-controlplane:8084/api/v1/dsp",
        "connectorId": "BPNL000000000001",
        "contractId": agreementId,
        "dataDestination": {
            "type": "HttpProxy"
        },
        "privateProperties": {
            "receiverHttpEndpoint": "http://backend:8080"
        },
        "protocol": "dataspace-protocol-http",
        "transferType": {
            "contentType": "application/octet-stream",
            "isFinite": true
        }
    }

    try {

        const response = await fetch('http://localhost:8080/api/v1/transfers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
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
            showToast("Search completed", false);
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
