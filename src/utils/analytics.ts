export const sendEvent = (type: string, payload: any) => {
  const event = {
    type,
    payload,
    timestamp: Date.now()
  };

  fetch('/api/sendEvent', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });
}