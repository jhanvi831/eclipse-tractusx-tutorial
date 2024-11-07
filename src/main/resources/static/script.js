function showContent(section) {
  const contentArea = document.getElementById("contentArea");
  let content;

  switch (section) {
    case "businessPartnerGroup":
      content = "businessPartnerGroup.html";
      break;

    case "assets":
      content = "asset.html";
      break;

    case "policies":
      content = "policies.html";
      break;

    case "contractDefinition":
      content = "contractDefinition.html";
      break;

    case "catalog":
      content = "catalog.html";
      break;

    case "contractNegotiation":
      content = "aliceContractNegotiation.html";
      break;

    case "transfers":
      content = "aliceTransfers.html";
      break;

    default:
      content = "businessPartnerGroup.html";
      break;
  }

  fetch(content)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Page not found !");
      }
      return response.text();
    })
    .then((html) => {
      contentArea.innerHTML = html;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  showContent("businessPartnerGroup");
});

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
      "http://localhost:8080/api/v1/business-partner-groups",
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
      "http://localhost:8080/api/v1/business-partner-groups",
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
      `http://localhost:8080/api/v1/business-partner-groups/${bpn}`
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

async function addToTable(policyBpn, businessPartnerGroup) {
  const tableBody = document.getElementById("dataTableBody");
  const tableContainer = document.getElementById("entireTable");
  tableContainer.style.visibility = "visible";
  const row = document.createElement("tr");

  const policyCell = document.createElement("td");
  policyCell.textContent = policyBpn;

  const groupCell = document.createElement("td");
  groupCell.textContent = businessPartnerGroup;

  row.appendChild(policyCell);
  row.appendChild(groupCell);

  tableBody.appendChild(row);

  //Clear the input fields
  document.getElementById("Policy-BPN").value = "";
  document.getElementById("Business-Partner-Group").value = "";
}

function showToast(message, isError) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";
  if (isError) {
    toast.classList.add("error");
  } else {
    toast.classList.remove("error");
  }
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

function resetText(formToReset) {
  document.getElementById(formToReset).reset();
}

async function saveAsset() {
  const assetId = document.getElementById("assetId").value;
  const assetDescription = document.getElementById("assetDescription").value;
  const baseUrl = document.getElementById("baseUrl").value;

  payload = {
    "@context": {},
    "@id": assetId,
    "properties": {
      "description": assetDescription || "Product EDC Demo Asset"
    },
    "dataAddress": {
      "@type": "DataAddress",
      "type": "HttpData",
      "baseUrl": baseUrl
    }
  }

  try {
    const response = await fetch("http://localhost:8080/api/v1/asset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      showToast("Asset added successfully", false);
      resetText('addAssetForm');
    } else if (response.status === 409) {
      showToast("Asset Id already exists", true);
    } else {
      showToast("Error occurred while creating asset", true);
    }
  } catch (error) {
    console.log("Error:", error);
    showToast("Error occurred while creating asset", true);
  }
}

async function fetchAssets() {
  try {
    const response = await fetch(
      "http://localhost:8080/api/v1/asset/allAssets",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      const assets = await response.json();
      displayAssets(assets);
    } else {
      console.error("Error occured while fetching assets");
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

function displayAssets(assets) {
  const tableBody = document.getElementById("assetDataTableBody");
  const tableContainer = document.getElementById("assetTable");

  if (tableContainer.style.visibility === "visible") {
    tableContainer.style.visibility = "hidden";
    tableBody.innerHTML = "";
  } else {
    tableContainer.style.visibility = "visible";
    tableBody.innerHTML = "";

    assets.forEach((asset) => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = asset["@id"];

      const baseUrlCell = document.createElement("td");
      baseUrlCell.textContent = asset.dataAddress.baseUrl;

      row.appendChild(idCell);
      row.appendChild(baseUrlCell);

      tableBody.appendChild(row);
    });
  }
}

async function searchAssetById() {
  const assetId = document.getElementById("asset-id").value;

  if (!assetId) {
    showToast("Please enter asset id", true);
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/asset/${assetId}`
    );

    if (response.ok) {
      const data = await response.json();
      document.getElementById("assetTable").innerHTML = "";
      addAssetToTable(data["@id"], data.dataAddress.baseUrl);
      showToast("Search completed", false);
    } else if (response.status === 404) {
      showToast("Asset Id not found", true);
    } else {
      showToast("Error occurred", true);
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Error occurred", true);
  }
}

async function addAssetToTable(assetId, baseUrl) {
  const tableBody = document.getElementById("assetDataTableBody");
  const tableContainer = document.getElementById("assetIdTable");
  tableContainer.style.visibility = "visible";

  tableBody.innerHTML = "";

  const row = document.createElement("tr");

  const assetIdCell = document.createElement("td");
  assetIdCell.textContent = assetId;

  const baseUrlCell = document.createElement("td");
  baseUrlCell.textContent = baseUrl;

  row.appendChild(assetIdCell);
  row.appendChild(baseUrlCell);

  tableBody.appendChild(row);

  document.getElementById("asset-id").value = "";
}

async function deleteAssetById() {
  const assetId = document.getElementById("delete-asset-id").value;

  if (!assetId) {
    showToast("Please enter asset id", true);
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/asset/${assetId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      showToast("Asset Deleted Successfully", false);
    } else if (response.status === 404) {
      showToast("Asset id does not exist", true);
    } else {
      showToast("Error occurred", true);
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Error occurred", true);
  }
  document.getElementById("delete-asset-id").value = '';
}

async function savePolicy() {
  const activeTab = document.querySelector('.nav-link.active').getAttribute('id');
  let payload;

  if (activeTab === 'access-tab') {
    const accessPolicyId = document.getElementById("accesspolicyId").value;
    console.log("Creating Access Policy with Id: ", accessPolicyId);

    payload = {
      "@context": {
        "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        "edc": "https://w3id.org/edc/v0.0.1/ns/",
        "tx": "https://w3id.org/tractusx/v0.0.1/ns/",
        "odrl": "http://www.w3.org/ns/odrl/2/"
      },
      "@type": "PolicyDefinitionRequestDto",
      "@id": accessPolicyId,
      "policy": {
        "@type": "odrl:Set",
        "odrl:permission": [
          {
            "odrl:action": "use",
            "odrl:constraint": {
              "@type": "LogicalConstraint",
              "odrl:or": [
                {
                  "@type": "Constraint",
                  "odrl:leftOperand": "BpnCredential",
                  "odrl:operator": {
                    "@id": "odrl:eq"
                  },
                  "odrl:rightOperand": "active"
                }
              ]
            }
          }
        ]
      }
    }
  }
  else if (activeTab === 'contract-tab') {
    const contractPolicyId = document.getElementById("contractpolicyId").value;
    const businessPartner = document.getElementById("businessPartner").value;

    console.log("Creating Contract Policy with Id: ", contractPolicyId)

    payload = {
      "@context": {
        "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        "edc": "https://w3id.org/edc/v0.0.1/ns/",
        "tx": "https://w3id.org/tractusx/v0.0.1/ns/",
        "odrl": "http://www.w3.org/ns/odrl/2/"
      },
      "@type": "PolicyDefinitionRequestDto",
      "@id": contractPolicyId,
      "policy": {
        "@type": "odrl:Set",
        "odrl:permission": [
          {
            "odrl:action": "use",
            "odrl:constraint": {
              "@type": "LogicalConstraint",
              "odrl:or": [
                {
                  "@type": "Constraint",
                  "odrl:leftOperand": "https://w3id.org/tractusx/v0.0.1/ns/BusinessPartnerGroup",
                  "odrl:operator": {
                    "@id": "odrl:eq"
                  },
                  "odrl:rightOperand": businessPartner
                }
              ]
            }
          }
        ]
      }
    }
  }

  try {
    const response = await fetch("http://localhost:8080/api/v1/policy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      showToast("Policy added successfully", false);
      if (activeTab === 'access-tab') {
        resetText('accessPolicyForm');
      }
      else if (activeTab === 'contract-tab') {
        resetText('contractPolicyForm');
      }
    } else if (response.status === 409) {
      showToast("Policy Id already exists", true);
    } else {
      showToast("Error occurred", true);
    }
  } catch (error) {
    console.log("Error:", error);
    showToast("Error occurred", true);
  }
}


function resetPolicy() {
  const activeTab = document.querySelector('.nav-link.active').getAttribute('id');
  if (activeTab === 'access-tab') {
    resetText('accessPolicyForm');
  }
  else if (activeTab === 'contract-tab') {
    resetText('contractPolicyForm');
  }

}

async function fetchPolicies() {
  try {
    const response = await fetch(
      "http://localhost:8080/api/v1/policy/allPolicies",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      const policies = await response.json();
      displayPolicies(policies);
    } else {
      console.error("Failed to fetch assets");
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

function displayPolicies(policies) {
  const tableBody = document.getElementById("policyDataTableBody");
  const tableContainer = document.getElementById("policyTable");

  if (tableContainer.style.visibility === "visible") {
    tableContainer.style.visibility = "hidden";
    tableBody.innerHTML = "";
  } else {
    tableContainer.style.visibility = "visible";
    tableBody.innerHTML = "";

    policies.forEach((policy) => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = policy["@id"];

      const leftOperandCell = document.createElement("td");
      leftOperandCell.textContent =
        policy.policy["odrl:permission"]["odrl:constraint"]["odrl:or"][
        "odrl:leftOperand"
        ];

      const rightOperandCell = document.createElement("td");
      rightOperandCell.textContent =
        policy.policy["odrl:permission"]["odrl:constraint"]["odrl:or"][
        "odrl:rightOperand"
        ];

      row.appendChild(idCell);
      row.appendChild(leftOperandCell);
      row.appendChild(rightOperandCell);

      tableBody.appendChild(row);
    });
  }
}

async function searchPolicyById() {
  const policyId = document.getElementById("policy-id").value;

  if (!policyId) {
    showToast("Please enter policy id", true);
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/policy/${policyId}`
    );

    if (response.ok) {
      const data = await response.json();
      document.getElementById("policyTable").innerHTML = "";
      addPolicyToTable(
        data["@id"],
        data.policy["odrl:permission"]["odrl:constraint"]["odrl:or"][
        "odrl:leftOperand"
        ],
        data.policy["odrl:permission"]["odrl:constraint"]["odrl:or"][
        "odrl:rightOperand"
        ]
      );
      showToast("Search completed", false);
    } else if (response.status === 404) {
      showToast("Policy with given id does not exist", true);
    } else {
      showToast("Error occurred", true);
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Error occurred", true);
  }
}

async function addPolicyToTable(policyId, leftOperand, rightOperand) {
  const tableBody = document.getElementById("policyDataTableBody");
  const tableContainer = document.getElementById("policyIdTable");
  tableContainer.style.visibility = "visible";

  tableBody.innerHTML = "";

  const row = document.createElement("tr");

  const idCell = document.createElement("td");
  idCell.textContent = policyId;

  const leftOperandCell = document.createElement("td");
  leftOperandCell.textContent = leftOperand;

  const rightOperandCell = document.createElement("td");
  rightOperandCell.textContent = rightOperand;

  row.appendChild(idCell);
  row.appendChild(leftOperandCell);
  row.appendChild(rightOperandCell);

  tableBody.appendChild(row);

  document.getElementById("policy-id").value = "";
}

async function deletePolicyById() {
  const policyId = document.getElementById("delete-policy-id").value;

  if (!policyId) {
    showToast("Please enter policy id", true);
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/policy/${policyId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      showToast("Policy Deleted Successfully", false);
    } else if (response.status === 404) {
      showToast("Entered policy id does not exist", true);
    } else {
      showToast("Error occurred", true);
    }
    document.getElementById("delete-policy-id").value = '';
  } catch (error) {
    console.error("Error:", error);
    showToast("Error occurred", true);
  }
}

async function saveContract() {
  const contractId = document.getElementById("contractId").value;
  const accessPolicyId = document.getElementById("accessPolicyId").value;
  const contractPolicyId = document.getElementById("contractpolicyId").value;
  const assetId = document.getElementById("assetId-contract").value;

  console.log("Access Policy Id: ",accessPolicyId)
  console.log("Contract Policy Id", contractPolicyId)

  payload = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
      "edc": "https://w3id.org/edc/v0.0.1/ns/",
      "tx": "https://w3id.org/tractusx/v0.0.1/ns/",
      "odrl": "http://www.w3.org/ns/odrl/2/"
    },
    "@id": contractId,
    "@type": "ContractDefinition",
    "accessPolicyId": accessPolicyId,
    "contractPolicyId": contractPolicyId,
    "assetsSelector": {
      "@type": "CriterionDto",
      "operandLeft": "https://w3id.org/edc/v0.0.1/ns/id",
      "operator": "=",
      "operandRight": assetId
    }
  }

  try {
    const response = await fetch(
      "http://localhost:8080/api/v1/contract-definitions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      showToast("Contract added successfully", false);
      resetText('addContractForm')
    } else if (response.status === 409) {
      showToast("Contract Definition with give id already exists", true);
    } else {
      showToast("Error occurred", true);
    }
  } catch (error) {
    console.log("Error:", error);
    showToast("Error occurred", true);
  }
}

async function fetchContracts() {
  try {
    const response = await fetch(
      "http://localhost:8080/api/v1/contract-definitions/allContracts",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      const contracts = await response.json();
      displayContracts(contracts);
    } else {
      console.error("Failed to fetch contracts");
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

function displayContracts(contracts) {
  const tableBody = document.getElementById("contractDataTableBody");
  const tableContainer = document.getElementById("contractTable");

  if (tableContainer.style.visibility === "visible") {
    tableContainer.style.visibility = "hidden";
    tableBody.innerHTML = "";
  } else {
    tableContainer.style.visibility = "visible";
    tableBody.innerHTML = "";

    contracts.forEach((contract) => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = contract["@id"];

      const accessPolicyIdCell = document.createElement("td");
      accessPolicyIdCell.textContent = contract["accessPolicyId"];

      const contractPolicyCell = document.createElement("td");
      contractPolicyCell.textContent = contract["contractPolicyId"];

      const assetIdCell = document.createElement("td");
      assetIdCell.textContent = contract["assetsSelector"]["operandRight"];

      row.appendChild(idCell);
      row.appendChild(accessPolicyIdCell);
      row.appendChild(contractPolicyCell);
      row.appendChild(assetIdCell);

      tableBody.appendChild(row);
    });
  }
}

async function searchContractById() {
  const contractId = document.getElementById("contract-id").value;

  if (!contractId) {
    showToast("Please enter contract definition id", true);
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/contract-definitions/${contractId}`
    );

    if (response.ok) {
      const data = await response.json();
      document.getElementById("contractTable").innerHTML = "";
      addContractToTable(
        data["@id"],
        data["accessPolicyId"],
        data["contractPolicyId"]
      );
      showToast("Search completed", false);
    } else if (response.status === 404) {
      showToast("Contract Definiton with given Id not found", true);
    } else {
      showToast("Error occurred", true);
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("Error occurred", true);
  }
}

async function addContractToTable(
  contractId,
  accessPolicyId,
  contractPolicyId
) {
  const tableBody = document.getElementById("contractDataTableBody");
  const tableContainer = document.getElementById("contractIdTable");
  tableContainer.style.visibility = "visible";

  tableBody.innerHTML = "";

  const row = document.createElement("tr");

  const idCell = document.createElement("td");
  idCell.textContent = contractId;

  const accessPolicyCell = document.createElement("td");
  accessPolicyCell.textContent = accessPolicyId;

  const contractPolicyCell = document.createElement("td");
  contractPolicyCell.textContent = contractPolicyId;

  row.appendChild(idCell);
  row.appendChild(accessPolicyCell);
  row.appendChild(contractPolicyCell);

  tableBody.appendChild(row);

  document.getElementById("contract-id").value = "";
}

async function deleteContractById() {
  const contractId = document.getElementById("delete-contract-id").value;

  if (!contractId) {
    showToast("Please enter Contract id", true);
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/contract-definitions/${contractId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      showToast("Contract Definition Deleted Successfully", false);

    } else if (response.status === 404) {
      showToast("entered contract definition id does not exist", true);
    } else {
      showToast("Error occurred", true);
    }
    document.getElementById("delete-contract-id").value = '';
  } catch (error) {
    console.error("Error:", error);
    showToast("Error occurred", true);
  }
}


async function fetchNegotiations() {
  try {
      const response = await fetch('http://localhost:8080/api/v1/contract-negotiations/alice/allNegotiations', {
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
      const response = await fetch(`http://localhost:8080/api/v1/contract-negotiations/alice/${negotiationId}`);

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


async function fetchTransfers() {
  try {
      const response = await fetch('http://localhost:8080/api/v1/transfers/alice/allTransfers', {
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
      const response = await fetch(`http://localhost:8080/api/v1/transfers/alice/${transferId}`);

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