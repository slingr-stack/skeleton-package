/****************************************************
 Listeners
 ****************************************************/

listeners.defaultWebhookSkeleton = {
    label: 'Catch HTTP skeleton events',
    type: 'service',
    options: {
        service: 'http',
        event: 'webhook',
        matching: {
            path: '/skeleton',
        }
    },
    callback: function(event) {
        sys.logs.info('Received Skeleton webhook. Processing and triggering a package event.');
        sys.logs.info('Valid webhook received. Triggering event.');
        sys.events.triggerEvent('skeleton:webhook', event.data);
    }
};
