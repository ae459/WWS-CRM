function rowClick(name) {
  alert("Clicked: " + name);
}

function sortTable(tableId, colIndex) {
  let table = document.getElementById(tableId);
  let tbody = table.querySelector("tbody");
  let rows = Array.from(tbody.rows);

  rows.sort((a, b) => {
    let A = a.cells[colIndex].innerText.toLowerCase();
    let B = b.cells[colIndex].innerText.toLowerCase();
    return A.localeCompare(B);
  });

  rows.forEach(row => tbody.appendChild(row));
} 