// Indian-specific detection patterns
const indianPatterns = {
  email: /\b[\w.-]+@[\w.-]+\.\w{2,}\b/gi,
  phone: /(\+91[\-\s]?)?[6789]\d{9}\b/gi,
  pan: /[A-Z]{5}[0-9]{4}[A-Z]/gi,
  aadhaar: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/gi,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/gi,
  account: /\b\d{9,18}\b/gi,
  upi: /[\w.-]+@(okaxis|okbizaxis|okhdfcbank|oksbi|paytm)/gi
};

function createModalHTML(detected) {
  return `
    <div class="privacy-modal">
      <h3>🛡️ Privacy Alert</h3>
      <p>We detected sensitive information:</p>
      <ul>
        ${detected.map(d => `
          <li>
            <strong>${d.type.toUpperCase()}:</strong>
            ${d.values.slice(0, 2).join(', ')}
            ${d.values.length > 2 ? '...' : ''}
          </li>
        `).join('')}
      </ul>
      <div class="modal-buttons">
        <button class="cancel-btn">Cancel Submission</button>
        <button class="proceed-btn">Proceed Anyway</button>
      </div>
    </div>
  `;
}

// Style injection
const modalStyle = document.createElement('style');
modalStyle.textContent = `
  .privacy-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    z-index: 10000;
    font-family: 'Segoe UI', Arial;
    width: 400px;
  }
  .modal-buttons {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  .cancel-btn {
    background: #dc3545;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .proceed-btn {
    background: #28a745;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;
document.head.appendChild(modalStyle);

document.addEventListener('submit', async (e) => {
  const inputs = Array.from(e.target.querySelectorAll('input, textarea'));
  let detected = [];
  
  inputs.forEach(input => {
    const text = input.value;
    for (const [type, regex] of Object.entries(indianPatterns)) {
      const matches = text.match(regex);
      if (matches) {
        detected.push({
          type,
          values: [...new Set(matches)]
        });
      }
    }
  });

  if (detected.length > 0) {
    e.preventDefault();
    const modal = document.createElement('div');
    modal.innerHTML = createModalHTML(detected);
    document.body.appendChild(modal);
    
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('.proceed-btn').addEventListener('click', () => {
      modal.remove();
      e.target.submit();
    });
  }
});