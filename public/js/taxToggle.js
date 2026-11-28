document.addEventListener("DOMContentLoaded", () => {
    const taxSwitch = document.getElementById("taxSwitch");
    if (!taxSwitch) return;

    const savedTaxState = localStorage.getItem("wanderlust_tax_display") === "true";
    if (savedTaxState) {
        taxSwitch.checked = true;
        document.body.classList.add("show-tax");
    }

    taxSwitch.addEventListener("change", () => {
        const isChecked = taxSwitch.checked;
        localStorage.setItem("wanderlust_tax_display", isChecked ? "true" : "false");
        if (isChecked) {
            document.body.classList.add("show-tax");
        } else {
            document.body.classList.remove("show-tax");
        }
    });
});
