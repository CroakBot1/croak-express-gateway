document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  if (typeof window.ethereum !== 'undefined') {
    status.textContent = "🟢 Wallet detected";
  } else {
    status.textContent = "🔴 Wallet not found";
  }
});
