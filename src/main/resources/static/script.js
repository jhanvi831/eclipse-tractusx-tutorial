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



async function addBusinessPartnerGroup() {
    const policyBpn = document.getElementById('Policy-BPN').value;
    const businessPartnerGroup = document.getElementById('Business-Partner-Group').value;
    const toast = document.getElementById('toast');

    if (!policyBpn || !businessPartnerGroup) {
        showToast("Please fill the required fields", true)
        return;
    }

    const payload = {
        "@context": { "tx": "https://w3id.org/tractusx/v0.0.1/ns/" },
        "@id": policyBpn,
        "tx:groups": [businessPartnerGroup]
    };

    try {
        const response = await fetch('http://localhost:8080/api/v1/business-partner-groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showToast("Successfully added", false)
            document.getElementById("dataTableBody").innerHTML = "";
            addToTable(policyBpn, businessPartnerGroup);
        }
        else {
            showToast("Failed to add", true)
        }
    }
    catch (error) {
        console.error("Error:", error);
        showToast("An error occurred", true);
    }
}

async function updateBusinessPartnerGroup() {
    const updateBpn = document.getElementById("Update-Policy-BPN").value;
    const updateGroup = document.getElementById("Update-Business-Partner-Group").value;

    if (!updateBpn || !updateGroup) {
        showToast("Enter the values", true);
        return;
    }

    const payload = {
        "@context": { "tx": "https://w3id.org/tractusx/v0.0.1/ns/" },
        "@id": updateBpn,
        "tx:groups": [updateGroup]
    };

    try {
        const response = await fetch('http://localhost:8080/api/v1/business-partner-groups', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            showToast("Successfully updated Business Partner Group", false)
            document.getElementById("dataTableBody").innerHTML = "";
            addToTable(updateBpn, updateGroup);
        }
        else {
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
        const response = await fetch(`http://localhost:8080/api/v1/business-partner-groups/${bpn}`);

        if (response.ok) {
            const data = await response.json();
            document.getElementById("dataTableBody").innerHTML = "";
            addToTable(data["@id"], data["tx:groups"]);
            showToast("Search completed, false");
        }
        else if (response.status === 500) {
            showToast("No data found for entered BPN", true);
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

async function addToTable(policyBpn, businessPartnerGroup) {
    const tableBody = document.getElementById('dataTableBody')
    const tableContainer = document.getElementById('entireTable')
    tableContainer.style.visibility = 'visible';
    const row = document.createElement('tr');

    const policyCell = document.createElement('td')
    policyCell.textContent = policyBpn;

    const groupCell = document.createElement('td')
    groupCell.textContent = businessPartnerGroup;

    row.appendChild(policyCell)
    row.appendChild(groupCell)

    tableBody.appendChild(row)

    //Clear the input fields
    document.getElementById("Policy-BPN").value = "";
    document.getElementById("Business-Partner-Group").value = "";

}

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

async function saveAsset() {
    const assetData = document.getElementById('assetJson').value;

    try {
        // validate json is correct
        const jsonData = JSON.parse(assetData);

        const response = await fetch('http://localhost:8080/api/v1/asset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        });

        if (response.ok) {
            showToast("Asset added successfully", false)
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

async function fetchAssets() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/asset/allAssets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const assets = await response.json()
            displayAssets(assets)
        }
        else {
            console.error("Failed to fetch assets")
        }
    }
    catch (error) {
        console.log("Error:", error)
    }
}

function displayAssets(assets) {
    const tableBody = document.getElementById('assetDataTableBody');
    const tableContainer = document.getElementById('assetTable')

    if (tableContainer.style.visibility === 'visible') {
        tableContainer.style.visibility = 'hidden';
        tableBody.innerHTML = "";
    }
    else {
        tableContainer.style.visibility = 'visible';
        tableBody.innerHTML = '';

        assets.forEach(asset => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = asset['@id'];

            const baseUrlCell = document.createElement('td');
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
        const response = await fetch(`http://localhost:8080/api/v1/asset/${assetId}`);

        if (response.ok) {
            const data = await response.json();
            document.getElementById("assetTable").innerHTML = "";
            addAssetToTable(data['@id'], data.dataAddress.baseUrl);
            showToast("Search completed, false");
        }
        else if (response.status === 500) {
            showToast("No data found for entered asset id", true);
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

async function addAssetToTable(assetId, baseUrl) {
    const tableBody = document.getElementById('assetDataTableBody')
    const tableContainer = document.getElementById('assetIdTable')
    tableContainer.style.visibility = 'visible';

    tableBody.innerHTML = "";

    const row = document.createElement('tr');

    const assetIdCell = document.createElement('td')
    assetIdCell.textContent = assetId;

    const baseUrlCell = document.createElement('td')
    baseUrlCell.textContent = baseUrl;

    row.appendChild(assetIdCell)
    row.appendChild(baseUrlCell)

    tableBody.appendChild(row)

    document.getElementById('asset-id').value = '';

}


async function deleteAssetById() {
    const assetId = document.getElementById("delete-asset-id").value;

    if (!assetId) {
        showToast("Please enter asset id", true);
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/v1/asset/${assetId}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            showToast("Asset Deleted Successfully", false);
        }
        else if (response.status === 500) {
            showToast("Error deleting asset with enterered id", true);
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


async function savePolicy() {
    const policyData = document.getElementById('custom-json').value;

    try{
        // validate json is correct
        const jsonData = JSON.parse(policyData); 

        const response = await fetch('http://localhost:8080/api/v1/policy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(jsonData)
        });

        if(response.ok){
            showToast("Policy added successfully", false)
        }
        else{
            showToast("Error occurred", true)
        }
    }
    catch(error){
        console.log("Error:", error)
        showToast("Error occurred", true)
    }
}



async function fetchPolicies() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/policy/allPolicies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const policies = await response.json()
            displayPolicies(policies)
        }
        else {
            console.error("Failed to fetch assets")
        }
    }
    catch (error) {
        console.log("Error:", error)
    }
}

function displayPolicies(policies) {
    const tableBody = document.getElementById('policyDataTableBody');
    const tableContainer = document.getElementById('policyTable')

    if (tableContainer.style.visibility === 'visible') {
        tableContainer.style.visibility = 'hidden';
        tableBody.innerHTML = "";
    }
    else {
        tableContainer.style.visibility = 'visible';
        tableBody.innerHTML = '';

        policies.forEach(policy => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = policy['@id'];

            const leftOperandCell = document.createElement('td');
            leftOperandCell.textContent = policy.policy["odrl:permission"]["odrl:constraint"]["odrl:or"]["odrl:leftOperand"];
            
            const rightOperandCell = document.createElement('td');
            rightOperandCell.textContent = policy.policy["odrl:permission"]["odrl:constraint"]["odrl:or"]["odrl:rightOperand"];


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
        const response = await fetch(`http://localhost:8080/api/v1/policy/${policyId}`);

        if (response.ok) {
            const data = await response.json();
            document.getElementById("policyTable").innerHTML = "";
            addPolicyToTable(data['@id'], data.policy["odrl:permission"]["odrl:constraint"]["odrl:or"]["odrl:leftOperand"], data.policy["odrl:permission"]["odrl:constraint"]["odrl:or"]["odrl:rightOperand"]);
            showToast("Search completed, false");
        }
        else if (response.status === 500) {
            showToast("No data found for entered asset id", true);
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

async function addPolicyToTable(policyId, leftOperand, rightOperand) {
    const tableBody = document.getElementById('policyDataTableBody')
    const tableContainer = document.getElementById('policyIdTable')
    tableContainer.style.visibility = 'visible';

    tableBody.innerHTML = "";

    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = policyId;

    const leftOperandCell = document.createElement('td');
    leftOperandCell.textContent = leftOperand;
    
    const rightOperandCell = document.createElement('td');
    rightOperandCell.textContent = rightOperand;


    row.appendChild(idCell);
    row.appendChild(leftOperandCell);
    row.appendChild(rightOperandCell);

    tableBody.appendChild(row)

    document.getElementById('policy-id').value = '';

}

async function deletePolicyById() {
    const policyId = document.getElementById("delete-policy-id").value;

    if (!policyId) {
        showToast("Please enter policy id", true);
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/v1/policy/${policyId}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            showToast("Policy Deleted Successfully", false);
        }
        else if (response.status === 500) {
            showToast("Error deleting policy with entered id", true);
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