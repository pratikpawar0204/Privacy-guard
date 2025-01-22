document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('whitelist', (data) => {
    document.getElementById('whitelist').value = data.whitelist || '';
  });

  document.getElementById('save').addEventListener('click', () => {
    const whitelist = document.getElementById('whitelist').value;
    chrome.storage.local.set({ whitelist }, () => {
      alert('Settings Saved for Indian Websites!');
      window.close();
    });
  });
});