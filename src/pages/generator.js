import { setupLayoutEvents } from '../components/layout.js';
import { qrData, settingsData } from '../utils/storage.js';
import { showToast } from '../utils/toast.js';

const inputTemplates = {
    URL: `
        <div>
            <label class="form-label">Website URL</label>
            <input type="url" id="input-url" placeholder="https://example.com" class="premium-input">
        </div>
        <div>
            <label class="form-label">Name (optional)</label>
            <input type="text" id="input-name" placeholder="My Website" class="premium-input">
            <p class="input-hint">Leave blank to auto-name this QR.</p>
        </div>`,
    Text: `
        <div>
            <label class="form-label">Text Content</label>
            <textarea id="input-text" rows="4" placeholder="Enter your text..." class="premium-input resize-none"></textarea>
        </div>
        <div>
            <label class="form-label">Name (optional)</label>
            <input type="text" id="input-name" placeholder="My Note" class="premium-input">
            <p class="input-hint">Leave blank to auto-name this QR.</p>
        </div>`,
    WhatsApp: `
        <div>
            <label class="form-label">Phone Number (with country code)</label>
            <input type="tel" id="input-phone" placeholder="911234567890" class="premium-input">
        </div>
        <div>
            <label class="form-label">Pre-filled Message</label>
            <input type="text" id="input-msg" placeholder="Hello!" class="premium-input">
        </div>
        <div>
            <label class="form-label">Name (optional)</label>
            <input type="text" id="input-name" placeholder="WhatsApp Contact" class="premium-input">
            <p class="input-hint">Leave blank to auto-name this QR.</p>
        </div>`,
    WiFi: `
        <div>
            <label class="form-label">Network Name (SSID)</label>
            <input type="text" id="input-ssid" placeholder="My WiFi" class="premium-input">
        </div>
        <div>
            <label class="form-label">Password</label>
            <input type="password" id="input-pass" placeholder="WiFi Password" class="premium-input">
        </div>
        <div>
            <label class="form-label">Encryption</label>
            <select id="input-enc" class="premium-input">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
            </select>
        </div>
        <div>
            <label class="form-label">Name (optional)</label>
            <input type="text" id="input-name" placeholder="Office WiFi" class="premium-input">
            <p class="input-hint">Leave blank to auto-name this QR.</p>
        </div>`
};

const buildDataString = (type) => {
    if (type === 'URL')       return document.getElementById('input-url')?.value || '';
    if (type === 'Text')      return document.getElementById('input-text')?.value || '';
    if (type === 'WhatsApp') {
        const phone = document.getElementById('input-phone')?.value || '';
        const msg   = encodeURIComponent(document.getElementById('input-msg')?.value || '');
        return `https://wa.me/${phone}?text=${msg}`;
    }
    if (type === 'WiFi') {
        const ssid = document.getElementById('input-ssid')?.value || '';
        const pass = document.getElementById('input-pass')?.value || '';
        const enc  = document.getElementById('input-enc')?.value  || 'WPA';
        return `WIFI:T:${enc};S:${ssid};P:${pass};;`;
    }
    return '';
};

export const GeneratorPage = {
    afterRender: async () => {
        setupLayoutEvents();

        const settings    = settingsData.get();
        const colorPicker = document.getElementById('qr-color');
        const colorText   = document.getElementById('qr-color-text');
        const bgPicker    = document.getElementById('qr-bg');
        const bgText      = document.getElementById('qr-bg-text');
        const dynamicInputs = document.getElementById('dynamic-inputs');
        const generateBtn = document.getElementById('generate-btn');
        const saveBtn     = document.getElementById('save-qr-btn');
        const qrContainer = document.getElementById('qrcode');

        colorPicker.value = settings.defaultColor || '#ffffff';
        colorText.value   = settings.defaultColor || '#ffffff';

        let currentQRCode    = null;
        let currentDataStr   = '';
        let currentQRId      = '';
        let hasGeneratedQr   = false;

        const getRequestedType = () => {
            const query = (window.location.hash.split('?')[1] || '').split('#')[0];
            const params = new URLSearchParams(query);
            const type = params.get('type');
            return Object.prototype.hasOwnProperty.call(inputTemplates, type) ? type : 'URL';
        };

        const renderInputs = (type) => {
            dynamicInputs.innerHTML = inputTemplates[type] || '';
        };
        const initialType = getRequestedType();
        const initialTypeInput = document.querySelector(`input[name="qr_type"][value="${initialType}"]`);
        if (initialTypeInput) initialTypeInput.checked = true;
        renderInputs(initialType);

        document.querySelectorAll('input[name="qr_type"]').forEach(radio => {
            radio.addEventListener('change', e => renderInputs(e.target.value));
        });

        colorPicker.addEventListener('input', e => colorText.value = e.target.value);
        colorText.addEventListener('input',   e => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) colorPicker.value = e.target.value; });
        bgPicker.addEventListener('input',    e => bgText.value    = e.target.value);
        bgText.addEventListener('input',      e => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) bgPicker.value    = e.target.value; });

        generateBtn.addEventListener('click', () => {
            const type = document.querySelector('input[name="qr_type"]:checked').value;
            currentDataStr = buildDataString(type);
            currentQRId = Date.now().toString();

            if (!currentDataStr.trim()) {
                showToast('Please fill in the required fields.', 'error');
                return;
            }

            if (!window.QRCode) {
                hasGeneratedQr = false;
                showToast('QR generator could not load. Please check your internet connection and refresh.', 'error');
                return;
            }

            document.getElementById('qr-placeholder').style.display = 'none';
            qrContainer.innerHTML = '';

            currentQRCode = new window.QRCode(qrContainer, {
                text: currentDataStr,
                width: 220,
                height: 220,
                colorDark:  colorPicker.value,
                colorLight: bgPicker.value,
                correctLevel: window.QRCode.CorrectLevel.H
            });

            hasGeneratedQr = true;
            document.getElementById('qr-actions').classList.remove('hidden');
            document.getElementById('save-success').classList.add('hidden');
            showToast('QR code generated successfully.', 'success');
        });

        saveBtn.addEventListener('click', () => {
            if (!hasGeneratedQr || !currentDataStr.trim()) {
                showToast('Generate a QR code before saving.', 'error');
                return;
            }

            const type   = document.querySelector('input[name="qr_type"]:checked').value;
            const nameEl = document.getElementById('input-name');
            qrData.save({ id: currentQRId || Date.now().toString(), type, name: nameEl ? nameEl.value.trim() : '', data: currentDataStr, color: colorPicker.value, bg: bgPicker.value });
            document.getElementById('save-success').classList.remove('hidden');
            showToast('QR code saved to My QR Codes.', 'success');
        });

        document.getElementById('download-png').addEventListener('click', () => {
            const canvas = qrContainer.querySelector('canvas');
            if (canvas) {
                const a = document.createElement('a');
                a.href     = canvas.toDataURL('image/png');
                a.download = 'scanify-code.png';
                a.click();
                showToast('QR code downloaded.', 'success');
            } else {
                const img = qrContainer.querySelector('img');
                if (img) { const a = document.createElement('a'); a.href = img.src; a.download = 'scanify-code.png'; a.click(); showToast('QR code downloaded.', 'success'); }
            }
        });
    }
};
