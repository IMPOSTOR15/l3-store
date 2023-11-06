export const sendEvent = (type: string, payload: any) => {
    const event = {
        type,
        payload,
        timestamp: Date.now()
    };
    const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
    };

    fetch('/api/sendEvent', fetchOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success send event:', data);
        })
        .catch((error) => {
            console.error('Error send event:', error);
        });
};
