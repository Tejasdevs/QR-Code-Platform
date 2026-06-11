export const buildTrackingUrl = (qrId, destination = '') => {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const params = new URLSearchParams({ id: qrId });
    if (destination) params.set('to', destination);
    return `${baseUrl}#/scan?${params.toString()}`;
};

export const canRedirectTo = (value = '') => {
    return /^(https?:|mailto:|tel:|sms:)/i.test(value);
};
