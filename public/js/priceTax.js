document.addEventListener("DOMContentLoaded", () => {
    const priceInput = document.getElementById("price");
    const taxSelect = document.getElementById("taxSelect");
    const taxedSpan = document.getElementById("taxedAmount");
    const taxRateLabel = document.getElementById("taxRateLabel");

    if (priceInput && taxedSpan) {
        const updateTax = () => {
            const val = parseFloat(priceInput.value) || 0;
            const rate = taxSelect ? parseFloat(taxSelect.value) || 18 : 18;
            const taxed = Math.round(val * (1 + rate / 100));
            taxedSpan.textContent = taxed.toLocaleString("en-IN");
            if (taxRateLabel) {
                taxRateLabel.textContent = rate;
            }
        };

        priceInput.addEventListener("input", updateTax);
        if (taxSelect) {
            taxSelect.addEventListener("change", updateTax);
        }
        updateTax();
    }
});
